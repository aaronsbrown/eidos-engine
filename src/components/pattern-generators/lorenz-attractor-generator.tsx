"use client"

// AIDEV-NOTE: Lorenz attractor using reusable ThreeJSCanvas system
// Demonstrates scalable 3D pattern development approach

import React, { useRef, useMemo, useEffect } from "react"
import type { PatternGeneratorProps } from "./types"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { calculateLorenzPoint } from '@/lib/math/lorenz'
import ThreeJSCanvas from "@/components/three-js/ThreeJSCanvas"
import AxesHelper3D from "@/components/three-js/AxesHelper3D"
import { createThreeJSShaderMaterial } from "@/lib/threejs-shader-utils"

interface LorenzControls {
  sigma: number
  rho: number
  beta: number
  particleCount: number
  particleSize: number
  autoRotate: boolean
  autoRotateSpeed: number
  colorScheme: number
  depthFading: boolean
  useCustomShader: boolean
  showAxes: boolean
}

function LorenzPoints({ controls }: { controls: LorenzControls }) {
  const pointsRef = useRef<THREE.Points>(null)
  const particlesRef = useRef<{ x: number; y: number; z: number }[]>([])
  
  // Initialize particles
  const particles = useMemo(() => {
    const particles = []
    for (let i = 0; i < controls.particleCount; i++) {
      particles.push({
        x: Math.random() * 20 - 10,  // Lorenz x range
        y: Math.random() * 20 - 10,  // Lorenz y range  
        z: Math.random() * 30 + 5,   // Lorenz z range
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
      positions[i * 3] = p.x * 0.04           // X: naturally centered
      positions[i * 3 + 1] = p.y * 0.04       // Y: naturally centered  
      positions[i * 3 + 2] = (p.z - 27) * 0.04  // Z: center around origin
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
      createThreeJSShaderMaterial('lorenz-particles', 'lorenz-particles', {
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
        console.warn('Failed to load Lorenz shader material:', err)
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
    const dt = 0.008
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    
    // Batch update particles for better performance
    const particles = particlesRef.current
    const particleCount = particles.length
    const scale = 0.04
    
    // Use efficient loop with minimal allocations
    for (let i = 0; i < particleCount; i++) {
      const p = particles[i]
      
      // Calculate Lorenz equations inline for better performance
      const { newX, newY, newZ } = calculateLorenzPoint(
        p.x, p.y, p.z, 
        controls.sigma, controls.rho, controls.beta, 
        dt
      )
      
      // Update particle state
      p.x = newX
      p.y = newY
      p.z = newZ
      
      // Update geometry positions with efficient indexing and centering
      const idx = i * 3
      positions[idx] = newX * scale           // X: naturally centered around 0
      positions[idx + 1] = newY * scale       // Y: naturally centered around 0  
      positions[idx + 2] = (newZ - 27) * scale  // Z: shift center from ~27 to 0
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

const LorenzAttractorGenerator: React.FC<PatternGeneratorProps> = ({ 
  width, 
  height, 
  className = "",
  controlValues 
}) => {

  // Use passed control values or defaults
  const controls: LorenzControls = useMemo(() => ({
      sigma: (controlValues?.sigma as number) ?? 10,
      rho: (controlValues?.rho as number) ?? 28,
      beta: (controlValues?.beta as number) ?? 8/3,
      particleCount: (controlValues?.particleCount as number) ?? 1000,
      particleSize: (controlValues?.particleSize as number) ?? 0.02,
      autoRotate: (controlValues?.autoRotate as boolean) ?? false,
      autoRotateSpeed: (controlValues?.autoRotateSpeed as number) ?? 1.0,
      colorScheme: (controlValues?.colorScheme as number) ?? 1, // Default to warm-cool
      depthFading: (controlValues?.depthFading as boolean) ?? true,
      useCustomShader: (controlValues?.useCustomShader as boolean) ?? false,
      showAxes: (controlValues?.showAxes as boolean) ?? false
    }), [controlValues])

  return (
    <ThreeJSCanvas
      width={width}
      height={height}
      className={className}
      preset="orbital"
      customCamera={{
        position: [3, 2, 3],
        minDistance: 1,
        maxDistance: 10
      }}
      showInstructions={true}
      backgroundColor="#000000"
      autoRotate={controls.autoRotate}
      autoRotateSpeed={controls.autoRotateSpeed}
    >
      <LorenzPoints controls={controls} />
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

export default LorenzAttractorGenerator