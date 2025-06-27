"use client"

// AIDEV-NOTE: Lorenz attractor using reusable ThreeJSCanvas system
// Demonstrates scalable 3D pattern development approach

import { useRef, useMemo } from "react"
import type { PatternGeneratorProps } from "./types"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { calculateLorenzPoint } from '@/lib/math/lorenz'
import ThreeJSCanvas from "@/components/three-js/ThreeJSCanvas"

interface LorenzControls {
  sigma: number
  rho: number
  beta: number
  particleCount: number
  particleSize: number
  autoRotate: boolean
  autoRotateSpeed: number
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
      positions[i * 3] = p.x * 0.04     // Scale down to fit view
      positions[i * 3 + 1] = p.y * 0.04
      positions[i * 3 + 2] = p.z * 0.04
    })
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [particles, controls.particleCount])

  // Create material (could be enhanced with custom shader later)
  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color: '#FACC15',  // Yellow
      size: controls.particleSize,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true  // Particles get smaller with distance
    })
  }, [controls.particleSize])

  // Animation loop
  useFrame(() => {
    if (!pointsRef.current) return
    
    const dt = 0.01
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    
    // Update particle positions using Lorenz equations
    particlesRef.current.forEach((p, i) => {
      const { newX, newY, newZ } = calculateLorenzPoint(
        p.x, p.y, p.z, 
        controls.sigma, controls.rho, controls.beta, 
        dt
      )
      p.x = newX
      p.y = newY
      p.z = newZ
      
      // Update geometry positions (scaled)
      positions[i * 3] = p.x * 0.04
      positions[i * 3 + 1] = p.y * 0.04
      positions[i * 3 + 2] = p.z * 0.04
    })
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return <points ref={pointsRef} geometry={geometry} material={material} />
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
    autoRotateSpeed: (controlValues?.autoRotateSpeed as number) ?? 1.0
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
    </ThreeJSCanvas>
  )
}

export default LorenzAttractorGenerator