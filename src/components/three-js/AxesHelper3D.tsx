// AIDEV-NOTE: Reusable 3D axes helper component for mathematical visualizations
// Provides coordinate reference with customizable appearance and labels

import React, { useMemo } from "react"
import * as THREE from "three"
import { Text } from "@react-three/drei"

interface AxesHelper3DProps {
  size?: number
  showLabels?: boolean
  lineWidth?: number
  opacity?: number
  xColor?: string
  yColor?: string
  zColor?: string
}

const AxesHelper3D: React.FC<AxesHelper3DProps> = React.memo(({
  size = 2,
  showLabels = true, // Currently used for future label implementation
  lineWidth = 2,
  opacity = 0.6,
  xColor = "#ff6b6b", // Red for X
  yColor = "#4ecdc4", // Teal for Y  
  zColor = "#45b7d1"  // Blue for Z
}) => {
  // MEMOIZE: Create line geometries for each axis (expensive Three.js operations)
  const xGeometry = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(size, 0, 0)
    ]
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [size])

  const yGeometry = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, size, 0)
    ]
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [size])

  const zGeometry = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, size)
    ]
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [size])

  // MEMOIZE: Create materials for each axis (expensive Three.js operations)
  const xMaterial = useMemo(() => new THREE.LineBasicMaterial({ 
    color: xColor, 
    transparent: true, 
    opacity,
    linewidth: lineWidth
  }), [xColor, opacity, lineWidth])

  const yMaterial = useMemo(() => new THREE.LineBasicMaterial({ 
    color: yColor, 
    transparent: true, 
    opacity,
    linewidth: lineWidth
  }), [yColor, opacity, lineWidth])

  const zMaterial = useMemo(() => new THREE.LineBasicMaterial({ 
    color: zColor, 
    transparent: true, 
    opacity,
    linewidth: lineWidth
  }), [zColor, opacity, lineWidth])

  // MEMOIZE: Create complete Line objects (this was the expensive operation causing stutters)
  const xLine = useMemo(() => new THREE.Line(xGeometry, xMaterial), [xGeometry, xMaterial])
  const yLine = useMemo(() => new THREE.Line(yGeometry, yMaterial), [yGeometry, yMaterial])
  const zLine = useMemo(() => new THREE.Line(zGeometry, zMaterial), [zGeometry, zMaterial])

  // MEMOIZE: Create origin sphere geometry and material (prevent recreation)
  const originSphereGeometry = useMemo(() => new THREE.SphereGeometry(0.03, 8, 6), [])
  const originSphereMaterial = useMemo(() => new THREE.MeshBasicMaterial({ 
    color: "#ffffff", 
    transparent: true, 
    opacity: opacity * 1.5 
  }), [opacity])

  return (
    <group name="axes-helper">
      {/* X Axis */}
      <primitive object={xLine} />
      
      {/* Y Axis */}
      <primitive object={yLine} />
      
      {/* Z Axis */}
      <primitive object={zLine} />
      
      {/* Axis labels */}
      {showLabels && (
        <>
          <Text
            position={[size + 0.2, 0, 0]}
            fontSize={0.2}
            color={xColor}
            anchorX="center"
            anchorY="middle"
          >
            X
          </Text>
          
          <Text
            position={[0, size + 0.2, 0]}
            fontSize={0.2}
            color={yColor}
            anchorX="center"
            anchorY="middle"
          >
            Y
          </Text>
          
          <Text
            position={[0, 0, size + 0.2]}
            fontSize={0.2}
            color={zColor}
            anchorX="center"
            anchorY="middle"
          >
            Z
          </Text>
        </>
      )}
      
      {/* Origin marker */}
      <mesh position={[0, 0, 0]} geometry={originSphereGeometry} material={originSphereMaterial} />
    </group>
  )
})

AxesHelper3D.displayName = 'AxesHelper3D'

export default AxesHelper3D