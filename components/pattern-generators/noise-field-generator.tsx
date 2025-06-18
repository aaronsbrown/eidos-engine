"use client"

import { useEffect, useRef, useMemo } from "react"
import type { PatternGeneratorProps } from "./types"

import { SimplexNoise } from "@/lib/simplex-noise"

interface NoiseFieldControls {
  noiseScale: number
  animationSpeed: number
  colorMode: 'blue' | 'plasma' | 'fire' | 'ice' | 'electric'
  contrast: number
  brightness: number
}

export default function NoiseFieldGenerator({ width, height, className = "", controlValues }: PatternGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const noiseRef = useRef<SimplexNoise>(new SimplexNoise())
  const timeRef = useRef<number>(0)

  const controls: NoiseFieldControls = useMemo(() => ({
    noiseScale: (controlValues?.noiseScale as number) ?? 0.02,
    animationSpeed: (controlValues?.animationSpeed as number) ?? 0.01,
    colorMode: (controlValues?.colorMode as 'blue' | 'plasma' | 'fire' | 'ice' | 'electric') ?? 'blue',
    contrast: (controlValues?.contrast as number) ?? 1.0,
    brightness: (controlValues?.brightness as number) ?? 1.0
  }), [controlValues])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = width
    canvas.height = height

    const animate = () => {
      timeRef.current += controls.animationSpeed

      // Create image data
      const imageData = ctx.createImageData(width, height)
      const data = imageData.data

      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          // Sample 3D noise with animated Z coordinate
          const noiseValue = noiseRef.current.noise3D(x * controls.noiseScale, y * controls.noiseScale, timeRef.current)

          // Normalize noise value from [-1, 1] to [0, 1]
          let normalized = (noiseValue + 1) * 0.5
          
          // Apply contrast and brightness
          normalized = Math.pow(normalized, 1 / controls.contrast) * controls.brightness
          normalized = Math.max(0, Math.min(1, normalized))

          // Create color based on noise value and selected color mode
          const getColor = (mode: string, value: number) => {
            const intensity = Math.floor(value * 255)
            
            switch (mode) {
              case 'blue':
                return [
                  Math.floor(intensity * 0.3 + value * 100),
                  Math.floor(intensity * 0.5 + value * 120),
                  Math.floor(intensity * 0.8 + value * 200)
                ]
              case 'plasma':
                return [
                  Math.floor(Math.sin(value * Math.PI) * 255),
                  Math.floor(Math.sin(value * Math.PI + Math.PI/3) * 255),
                  Math.floor(Math.sin(value * Math.PI + 2*Math.PI/3) * 255)
                ]
              case 'fire':
                return [
                  Math.floor(255 * value),
                  Math.floor(180 * value * value),
                  Math.floor(50 * value * value * value)
                ]
              case 'ice':
                return [
                  Math.floor(100 + 155 * value),
                  Math.floor(180 + 75 * value),
                  Math.floor(200 + 55 * value)
                ]
              case 'electric':
                return [
                  Math.floor(150 + 105 * Math.sin(value * Math.PI)),
                  Math.floor(255 * value),
                  Math.floor(255 * Math.sin(value * Math.PI * 2))
                ]
              default:
                return [intensity, intensity, intensity]
            }
          }

          const [r, g, b] = getColor(controls.colorMode, normalized)

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
  }, [width, height, controls])

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
