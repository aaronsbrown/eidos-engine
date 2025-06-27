"use client"

// AIDEV-NOTE: Reusable Three.js canvas wrapper with standardized camera setups
// Provides consistent 3D experience across all WebGL visualizations

import React, { ReactNode } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"

interface CameraPreset {
  position: [number, number, number]
  fov: number
  near: number
  far: number
  target?: [number, number, number]
  minDistance?: number
  maxDistance?: number
  enablePan?: boolean
  enableZoom?: boolean
  enableRotate?: boolean
}

interface ThreeJSCanvasProps {
  width: number
  height: number
  className?: string
  preset?: "orbital" | "close-up" | "wide-view" | "custom"
  customCamera?: Partial<CameraPreset>
  children: ReactNode
  showInstructions?: boolean
  backgroundColor?: string
}

// Predefined camera presets for different visualization types
const CAMERA_PRESETS: Record<string, CameraPreset> = {
  orbital: {
    position: [3, 2, 3],
    fov: 60,
    near: 0.1,
    far: 1000,
    target: [0, 0, 0],
    minDistance: 1,
    maxDistance: 10,
    enablePan: true,
    enableZoom: true,
    enableRotate: true
  },
  "close-up": {
    position: [1.5, 1, 1.5],
    fov: 75,
    near: 0.01,
    far: 100,
    target: [0, 0, 0],
    minDistance: 0.5,
    maxDistance: 5,
    enablePan: true,
    enableZoom: true,
    enableRotate: true
  },
  "wide-view": {
    position: [5, 4, 5],
    fov: 45,
    near: 0.1,
    far: 2000,
    target: [0, 0, 0],
    minDistance: 2,
    maxDistance: 20,
    enablePan: true,
    enableZoom: true,
    enableRotate: true
  }
}

const ThreeJSCanvas: React.FC<ThreeJSCanvasProps> = ({
  width,
  height,
  className = "",
  preset = "orbital",
  customCamera = {},
  children,
  showInstructions = true,
  backgroundColor = "#000000"
}) => {
  // Merge preset with custom overrides
  const cameraConfig = { ...CAMERA_PRESETS[preset], ...customCamera }

  return (
    <div className="relative">
      <div
        className={`overflow-hidden relative ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <Canvas
          camera={{
            position: cameraConfig.position,
            fov: cameraConfig.fov,
            near: cameraConfig.near,
            far: cameraConfig.far
          }}
          gl={{ 
            antialias: true,
            alpha: false,
            powerPreference: "high-performance"
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(backgroundColor)
          }}
        >
          {/* Standard lighting setup for 3D visualizations */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.6} />
          
          {/* Pattern content */}
          {children}
          
          {/* Standardized camera controls */}
          <OrbitControls
            enablePan={cameraConfig.enablePan}
            enableZoom={cameraConfig.enableZoom}
            enableRotate={cameraConfig.enableRotate}
            minDistance={cameraConfig.minDistance}
            maxDistance={cameraConfig.maxDistance}
            target={cameraConfig.target}
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
            panSpeed={0.8}
          />
        </Canvas>
      </div>
      
      {/* Camera instructions overlay */}
      {showInstructions && (
        <div className="absolute top-2 right-2 bg-black/80 text-white text-xs p-2 rounded pointer-events-none opacity-70">
          <div>🖱️ Drag to orbit</div>
          <div>🔄 Scroll to zoom</div>
          <div>📦 Right-drag to pan</div>
        </div>
      )}
    </div>
  )
}

export default ThreeJSCanvas
export type { ThreeJSCanvasProps, CameraPreset }