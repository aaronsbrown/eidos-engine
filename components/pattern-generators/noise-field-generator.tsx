"use client"

import { useEffect, useRef } from "react"
import type { PatternGeneratorProps } from "./types"

import { SimplexNoise } from "@/lib/simplex-noise"

export default function NoiseFieldGenerator({ width, height, className = "" }: PatternGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const noiseRef = useRef<SimplexNoise>(new SimplexNoise())
  const timeRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = width
    canvas.height = height

    const scale = 0.02 // Noise scale - smaller = more zoomed out
    const timeScale = 0.01 // Animation speed

    const animate = () => {
      timeRef.current += timeScale

      // Create image data
      const imageData = ctx.createImageData(width, height)
      const data = imageData.data

      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          // Sample 3D noise with animated Z coordinate
          const noiseValue = noiseRef.current.noise3D(x * scale, y * scale, timeRef.current)

          // Normalize noise value from [-1, 1] to [0, 1]
          const normalized = (noiseValue + 1) * 0.5

          // Create color based on noise value
          const intensity = Math.floor(normalized * 255)

          // Create a blue-to-white gradient based on intensity
          const r = Math.floor(intensity * 0.3 + normalized * 100)
          const g = Math.floor(intensity * 0.5 + normalized * 120)
          const b = Math.floor(intensity * 0.8 + normalized * 200)

          const index = (y * width + x) * 4
          data[index] = r // Red
          data[index + 1] = g // Green
          data[index + 2] = b // Blue
          data[index + 3] = 255 // Alpha
        }
      }

      ctx.putImageData(imageData, 0, 0)
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [width, height])

  return (
    <div
      className={`overflow-hidden relative border border-gray-300 ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <canvas ref={canvasRef} className="w-full h-full" style={{ imageRendering: "pixelated" }} />

      {/* Add a subtle overlay for better integration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(45deg, rgba(0,0,0,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)",
        }}
      />
    </div>
  )
}
