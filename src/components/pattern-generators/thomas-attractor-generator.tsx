"use client"

// AIDEV-NOTE: Thomas attractor using reusable ThreeJSCanvas system
// Demonstrates scalable 3D pattern development approach with cyclic symmetry

import React, { useRef, useMemo, useEffect } from "react"
import type { PatternGeneratorProps } from "./types"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { calculateThomasPoint } from '@/lib/math/thomas'
import ThreeJSCanvas from "@/components/three-js/ThreeJSCanvas"
import AxesHelper3D from "@/components/three-js/AxesHelper3D"
import { createThreeJSShaderMaterial } from "@/lib/threejs-shader-utils"
import { applySafeParticleCount, WEBGL_LIMITS } from "@/lib/webgl-limits"

interface ThomasControls {
  b: number
  particleCount: number
  particleSize: number
  autoRotate: boolean
  autoRotateSpeed: number
  colorScheme: number
  depthFading: boolean
  useCustomShader: boolean
  showAxes: boolean
  speed: number
}

function ThomasPoints({ controls }: { controls: ThomasControls }) {
  const pointsRef = useRef<THREE.Points>(null)
  const particlesRef = useRef<{ x: number; y: number; z: number }[]>([])
  
  // Initialize particles with Thomas-appropriate initial conditions
  const particles = useMemo(() => {
    const particles = []
    for (let i = 0; i < controls.particleCount; i++) {
      particles.push({
        x: Math.random() * 4 - 2,  // Thomas typical range: [-2, 2]
        y: Math.random() * 4 - 2,  // Thomas typical range: [-2, 2]
        z: Math.random() * 4 - 2,  // Thomas typical range: [-2, 2]
      })
    }
    return particles
  }, [controls.particleCount])
  
  particlesRef.current = particles

  // Create geometry
  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(controls.particleCount * 3)
    
    particles.forEach((p, i) => {
      positions[i * 3] = p.x * 0.4         // X: scale for good visual range
      positions[i * 3 + 1] = p.y * 0.4     // Y: scale for good visual range
      positions[i * 3 + 2] = p.z * 0.4     // Z: scale for good visual range
    })
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [particles, controls.particleCount])

  // Create enhanced material with shader or fallback
  const material = useMemo(() => {
    if (controls.useCustomShader) {
      // Use custom shader material for enhanced visuals
      return null // Will be created in useEffect
    } else {
      // Fallback to basic material
      return new THREE.PointsMaterial({
        color: '#FACC15',  // Yellow
        size: controls.particleSize,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      })
    }
  }, [controls.particleSize, controls.useCustomShader])

  // Enhanced shader material state
  const [shaderMaterial, setShaderMaterial] = React.useState<THREE.ShaderMaterial | null>(null)

  // Load custom shader material only once when enabled/disabled
  useEffect(() => {
    if (controls.useCustomShader) {
      createThreeJSShaderMaterial('thomas-particles', 'thomas-particles', {
        u_particleSize: { value: controls.particleSize },
        u_opacity: { value: 0.8 },
        u_colorScheme: { value: controls.colorScheme },
        u_depthFading: { value: controls.depthFading ? 1.0 : 0.0 }
      }).then(shaderMat => {
        // Configure for proper depth-aware alpha blending
        shaderMat.transparent = true
        shaderMat.depthWrite = false
        shaderMat.blending = THREE.NormalBlending
        setShaderMaterial(shaderMat)
      }).catch(err => {
        console.warn('Failed to load Thomas shader material:', err)
      })
    } else {
      setShaderMaterial(null)
    }
    // ESLint is disabled for this effect because we intentionally only want to recreate
    // the shader when useCustomShader changes. Control values are updated via uniforms in useFrame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls.useCustomShader]) // Only recreate when shader mode changes

  // Performance optimization: batch updates and efficient computation
  const frameCounter = useRef(0)
  
  // CONSOLIDATED: Single useFrame loop for both shader uniforms AND animation
  useFrame(({ clock }) => {
    // STEP 1: Update shader uniforms (if using custom shader)
    if (shaderMaterial && controls.useCustomShader) {
      shaderMaterial.uniforms.u_time.value = clock.elapsedTime
      shaderMaterial.uniforms.u_particleSize.value = controls.particleSize
      shaderMaterial.uniforms.u_colorScheme.value = controls.colorScheme
      shaderMaterial.uniforms.u_depthFading.value = controls.depthFading ? 1.0 : 0.0
    }
    
    // STEP 2: Animate particles (if geometry exists)
    if (!pointsRef.current) return
    
    frameCounter.current++
    
    // Adaptive time step for stability vs performance
    const dt = 0.01 * controls.speed
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    
    // Batch update particles for better performance
    const particles = particlesRef.current
    const particleCount = particles.length
    const scale = 0.4  // Thomas attractor scaling
    
    // Use efficient loop with minimal allocations
    for (let i = 0; i < particleCount; i++) {
      const p = particles[i]
      
      // Calculate Thomas equations inline for better performance
      const { newX, newY, newZ } = calculateThomasPoint(
        p.x, p.y, p.z, 
        controls.b, 
        dt
      )
      
      // Update particle state
      p.x = newX
      p.y = newY
      p.z = newZ
      
      // Update geometry positions with efficient indexing
      const idx = i * 3
      positions[idx] = newX * scale       // X: naturally centered around 0
      positions[idx + 1] = newY * scale   // Y: naturally centered around 0  
      positions[idx + 2] = newZ * scale   // Z: naturally centered around 0
    }
    
    // Mark geometry for update (Three.js will optimize this)
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  // Use shader material if available, otherwise fallback
  const activeMaterial = controls.useCustomShader ? shaderMaterial : material

  return activeMaterial ? (
    <points ref={pointsRef} geometry={geometry} material={activeMaterial} />
  ) : null
}

const ThomasAttractorGenerator: React.FC<PatternGeneratorProps> = ({ 
  width, 
  height, 
  className = "",
  controlValues 
}) => {

  // Use passed control values or defaults
  const controls: ThomasControls = useMemo(() => ({
      b: (controlValues?.b as number) ?? 0.208,
      particleCount: applySafeParticleCount((controlValues?.particleCount as number) ?? 2500, WEBGL_LIMITS.MAX_ATTRACTOR_PARTICLES),
      particleSize: (controlValues?.particleSize as number) ?? 0.04,
      autoRotate: (controlValues?.autoRotate as boolean) ?? false,
      autoRotateSpeed: (controlValues?.autoRotateSpeed as number) ?? 1.0,
      colorScheme: (controlValues?.colorScheme as number) ?? 1, // Default to warm-cool
      depthFading: (controlValues?.depthFading as boolean) ?? false,
      useCustomShader: (controlValues?.useCustomShader as boolean) ?? false,
      showAxes: (controlValues?.showAxes as boolean) ?? false,
      speed: (controlValues?.speed as number) ?? 2.0
    }), [controlValues])

  return (
    <ThreeJSCanvas
      width={width}
      height={height}
      className={className}
      preset="orbital"
      customCamera={{
        position: [1.5, 1.5, 1.5],
        minDistance: 0.5,
        maxDistance: 8
      }}
      showInstructions={true}
      backgroundColor="#000000"
      autoRotate={controls.autoRotate}
      autoRotateSpeed={controls.autoRotateSpeed}
    >
      <ThomasPoints controls={controls} />
      {controls.showAxes && (
        <AxesHelper3D 
          size={1.5} 
          opacity={0.4}
          showLabels={true}
        />
      )}
    </ThreeJSCanvas>
  )
}

export default ThomasAttractorGenerator