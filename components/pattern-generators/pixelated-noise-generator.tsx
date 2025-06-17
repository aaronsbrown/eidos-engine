"use client"

import { useEffect, useRef, useMemo } from "react"
import type { PatternGeneratorProps } from "./types"
import { SimplexNoise } from "@/lib/simplex-noise"

interface PixelatedNoiseControls {
  pixelSize: number
  noiseScale: number
  animationSpeed: number
  colorIntensity: number
  colorScheme: 'retro' | 'monochrome' | 'cyan' | 'amber'
}

export default function PixelatedNoiseGenerator({ 
  width, 
  height, 
  className = "",
  controlValues
}: PatternGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const noiseRef = useRef<SimplexNoise>(new SimplexNoise())
  const timeRef = useRef<number>(0)

  // Use passed control values or defaults
  const controls: PixelatedNoiseControls = useMemo(() => ({
    pixelSize: (controlValues?.pixelSize as number) ?? 8,
    noiseScale: (controlValues?.noiseScale as number) ?? 0.1,
    animationSpeed: (controlValues?.animationSpeed as number) ?? 0.02,
    colorIntensity: (controlValues?.colorIntensity as number) ?? 1.0,
    colorScheme: (controlValues?.colorScheme as 'retro' | 'monochrome' | 'cyan' | 'amber') ?? 'retro'
  }), [controlValues])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = width
    canvas.height = height

    // Use control values
    const gridWidth = Math.ceil(width / controls.pixelSize)
    const gridHeight = Math.ceil(height / controls.pixelSize)

    const animate = () => {
      timeRef.current += controls.animationSpeed

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Draw pixelated noise
      for (let gridX = 0; gridX < gridWidth; gridX++) {
        for (let gridY = 0; gridY < gridHeight; gridY++) {
          // Sample noise at grid position
          const noiseValue = noiseRef.current.noise3D(gridX * controls.noiseScale, gridY * controls.noiseScale, timeRef.current)

          // Normalize noise value from [-1, 1] to [0, 1]
          const normalized = (noiseValue + 1) * 0.5

          // Create color based on noise value and selected color scheme
          const getColor = (scheme: string, value: number, intensity: number) => {
            switch (scheme) {
              case 'retro':
                if (value < 0.2) {
                  return [
                    Math.floor(value * 50 * intensity),
                    Math.floor(value * 20 * intensity),
                    Math.floor(value * 80 * intensity)
                  ]
                } else if (value < 0.4) {
                  return [
                    Math.floor((80 + value * 60) * intensity),
                    Math.floor((20 + value * 40) * intensity),
                    Math.floor((120 + value * 80) * intensity)
                  ]
                } else if (value < 0.6) {
                  return [
                    Math.floor((140 + value * 80) * intensity),
                    Math.floor((60 + value * 60) * intensity),
                    Math.floor((140 + value * 60) * intensity)
                  ]
                } else if (value < 0.8) {
                  return [
                    Math.floor((200 + value * 55) * intensity),
                    Math.floor((120 + value * 100) * intensity),
                    Math.floor((40 + value * 60) * intensity)
                  ]
                } else {
                  return [
                    Math.floor((240 + value * 15) * intensity),
                    Math.floor((220 + value * 35) * intensity),
                    Math.floor((100 + value * 100) * intensity)
                  ]
                }
              case 'monochrome':
                const mono = Math.floor(value * 255 * intensity)
                return [mono, mono, mono]
              case 'cyan':
                return [
                  Math.floor(value * 50 * intensity),
                  Math.floor(value * 200 * intensity),
                  Math.floor(value * 255 * intensity)
                ]
              case 'amber':
                return [
                  Math.floor(value * 255 * intensity),
                  Math.floor(value * 180 * intensity),
                  Math.floor(value * 50 * intensity)
                ]
              default:
                return [255, 255, 255]
            }
          }

          const [r, g, b] = getColor(controls.colorScheme, normalized, controls.colorIntensity)

          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`

          // Draw pixel block
          const x = gridX * controls.pixelSize
          const y = gridY * controls.pixelSize
          ctx.fillRect(x, y, controls.pixelSize, controls.pixelSize)
        }
      }

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
    <div className={className}>
      {/* Canvas Container */}
      <div
        className="overflow-hidden relative"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <canvas ref={canvasRef} className="w-full h-full" style={{ imageRendering: "pixelated" }} />


        {/* Add a subtle CRT-style overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0,0,0,0.1) 2px,
                rgba(0,0,0,0.1) 4px
              )
            `,
          }}
        />
      </div>
    </div>
  )
}
