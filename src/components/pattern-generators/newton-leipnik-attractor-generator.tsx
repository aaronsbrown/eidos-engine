"use client"

// AIDEV-NOTE: Newton-Leipnik attractor using reusable ThreeJSCanvas system
// Demonstrates butterfly-like structure with complex folding dynamics and cross-coupling

import React, { useRef, useMemo, useEffect } from "react"
import type { PatternGeneratorProps } from "./types"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { calculateNewtonLeipnikPoint } from '@/lib/math/newton-leipnik'
import ThreeJSCanvas from "@/components/three-js/ThreeJSCanvas"
import AxesHelper3D from "@/components/three-js/AxesHelper3D"
import { createThreeJSShaderMaterial } from "@/lib/threejs-shader-utils"
import { applySafeParticleCount, WEBGL_LIMITS } from "@/lib/webgl-limits"

interface NewtonLeipnikControls {
  a: number
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

function NewtonLeipnikPoints({ controls }: { controls: NewtonLeipnikControls }) {
  const pointsRef = useRef<THREE.Points>(null)
  const particlesRef = useRef<{ x: number; y: number; z: number }[]>([])
  
  // Initialize particles with Newton-Leipnik-appropriate initial conditions
  const particles = useMemo(() => {
    const particles = []
    for (let i = 0; i < controls.particleCount; i++) {
      // Use multiple known good initial conditions to encourage full structure
      const seed = Math.random()
      if (seed < 0.4) {
        // Primary attractor region
        particles.push({
          x: 0.349 + (Math.random() - 0.5) * 0.2,
          y: (Math.random() - 0.5) * 0.4,
          z: -0.16 + (Math.random() - 0.5) * 0.2,
        })
      } else if (seed < 0.8) {
        // Secondary region to encourage wing formation
        particles.push({
          x: (Math.random() - 0.5) * 0.8,
          y: (Math.random() - 0.5) * 0.8,
          z: (Math.random() - 0.5) * 0.8,
        })
      } else {
        // Near-origin exploration
        particles.push({
          x: (Math.random() - 0.5) * 0.1,
          y: (Math.random() - 0.5) * 0.1,
          z: (Math.random() - 0.5) * 0.1,
        })
      }
    }
    return particles
  }, [controls.particleCount])
  
  particlesRef.current = particles

  // Create geometry
  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(controls.particleCount * 3)
    
    for (let i = 0; i < controls.particleCount; i++) {
      positions[i * 3] = particles[i].x
      positions[i * 3 + 1] = particles[i].y
      positions[i * 3 + 2] = particles[i].z
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [controls.particleCount, particles])

  // Create material with color scheme support
  const material = useMemo(() => {
    const colors = [
      0xff6b6b, // Red
      0x4ecdc4, // Teal 
      0x45b7d1, // Blue
      0xfeca57, // Yellow
      0xff9ff3  // Pink
    ]
    
    return new THREE.PointsMaterial({
      color: colors[controls.colorScheme] || colors[0],
      size: controls.particleSize * 2, // Scale particle size properly
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true, // Enable size attenuation so size property works
      depthTest: false,
      depthWrite: false
    })
  }, [controls.particleSize, controls.colorScheme])

  // Enhanced shader material state
  const [shaderMaterial, setShaderMaterial] = React.useState<THREE.ShaderMaterial | null>(null)

  // Load custom shader material only once when enabled/disabled
  useEffect(() => {
    if (controls.useCustomShader) {
      createThreeJSShaderMaterial('newton-leipnik-particles', 'newton-leipnik-particles', {
        u_particleSize: { value: controls.particleSize },
        u_opacity: { value: 0.8 },
        u_colorScheme: { value: controls.colorScheme },
        u_depthFading: { value: controls.depthFading ? 1.0 : 0.0 }
      }).then(shaderMat => {
        setShaderMaterial(shaderMat)
      })
    } else {
      setShaderMaterial(null)
    }
  }, [controls.useCustomShader, controls.particleSize, controls.colorScheme, controls.depthFading])

  // Update animation frame
  const frameCounter = useRef(0)
  
  useFrame((state) => {
    if (!pointsRef.current) return
    
    frameCounter.current++
    
    // Much smaller time step for Newton-Leipnik stability
    const dt = 0.001 * controls.speed
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    
    // Batch update particles for better performance
    const particles = particlesRef.current
    const particleCount = particles.length
    const scale = 8.0  // Newton-Leipnik attractor scaling - increased for better visibility
    
    // Use efficient loop with minimal allocations
    for (let i = 0; i < particleCount; i++) {
      const p = particles[i]
      
      // Calculate Newton-Leipnik equations inline for better performance
      const { newX, newY, newZ } = calculateNewtonLeipnikPoint(
        p.x, p.y, p.z, 
        controls.a, 
        controls.b,
        dt
      )
      
      // Check for numerical stability and reset if needed
      if (Math.abs(newX) > 3 || Math.abs(newY) > 3 || Math.abs(newZ) > 3 || 
          !isFinite(newX) || !isFinite(newY) || !isFinite(newZ)) {
        // Reset to good initial condition if particle escapes
        const seed = Math.random()
        if (seed < 0.4) {
          p.x = 0.349 + (Math.random() - 0.5) * 0.2
          p.y = (Math.random() - 0.5) * 0.4
          p.z = -0.16 + (Math.random() - 0.5) * 0.2
        } else {
          p.x = (Math.random() - 0.5) * 0.1
          p.y = (Math.random() - 0.5) * 0.1
          p.z = (Math.random() - 0.5) * 0.1
        }
      } else {
        // Update particle position
        p.x = newX
        p.y = newY
        p.z = newZ
      }
      
      // Apply to geometry with scaling
      const index = i * 3
      positions[index] = p.x * scale
      positions[index + 1] = p.y * scale
      positions[index + 2] = p.z * scale
    }
    
    // Mark positions as needing update
    pointsRef.current.geometry.attributes.position.needsUpdate = true
    
    // Update shader uniforms for custom shader
    if (controls.useCustomShader && shaderMaterial) {
      shaderMaterial.uniforms.u_time.value = state.clock.elapsedTime
      shaderMaterial.uniforms.u_particleSize.value = controls.particleSize
      shaderMaterial.uniforms.u_colorScheme.value = controls.colorScheme
      shaderMaterial.uniforms.u_depthFading.value = controls.depthFading ? 1.0 : 0.0
    }
  })

  // Use shader material if available, otherwise fallback to basic material
  const activeMaterial = controls.useCustomShader ? shaderMaterial : material

  return activeMaterial ? (
    <points ref={pointsRef} geometry={geometry} material={activeMaterial} />
  ) : null
}

export default function NewtonLeipnikAttractorGenerator({ 
  width, 
  height, 
  className, 
  controlValues
}: PatternGeneratorProps) {
  // Use passed control values or defaults (matching other attractors)
  const controls: NewtonLeipnikControls = useMemo(() => ({
    a: (controlValues?.a as number) ?? 0.4,           // Classic parameter value
    b: (controlValues?.b as number) ?? 0.175,         // Classic parameter value 
    particleCount: applySafeParticleCount((controlValues?.particleCount as number) ?? 5000, WEBGL_LIMITS.MAX_ATTRACTOR_PARTICLES),
    particleSize: (controlValues?.particleSize as number) ?? 0.1,  // Smaller particles for better detail
    autoRotate: (controlValues?.autoRotate as boolean) ?? false,  // Changed default to false
    autoRotateSpeed: (controlValues?.autoRotateSpeed as number) ?? 0.5,
    colorScheme: (controlValues?.colorScheme as number) ?? 0,   // Default to rainbow depth
    depthFading: (controlValues?.depthFading as boolean) ?? true,
    useCustomShader: (controlValues?.useCustomShader as boolean) ?? true,  // Enable enhanced rendering by default
    showAxes: (controlValues?.showAxes as boolean) ?? false,
    speed: (controlValues?.speed as number) ?? 3.0,  // Faster animation for better visual flow
  }), [controlValues])
  

  return (
    <ThreeJSCanvas
      width={width}
      height={height}
      className={className}
      preset="orbital"
      customCamera={{
        position: [4, 3, 4],
        minDistance: 1,
        maxDistance: 15
      }}
      showInstructions={true}
      backgroundColor="#000000"
      autoRotate={controls.autoRotate}
      autoRotateSpeed={controls.autoRotateSpeed}
    >
      <NewtonLeipnikPoints controls={controls} />
      {controls.showAxes && <AxesHelper3D size={5} />}
    </ThreeJSCanvas>
  )
}