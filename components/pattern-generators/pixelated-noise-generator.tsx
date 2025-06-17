"use client"

import { useEffect, useRef, useState } from "react"
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
  onControlChange 
}: PatternGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const noiseRef = useRef<SimplexNoise>(new SimplexNoise())
  const timeRef = useRef<number>(0)

  // Control state
  const [controls, setControls] = useState<PixelatedNoiseControls>({
    pixelSize: 8,
    noiseScale: 0.1,
    animationSpeed: 0.02,
    colorIntensity: 1.0,
    colorScheme: 'retro'
  })

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
          let r, g, b

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

          const [red, green, blue] = getColor(controls.colorScheme, normalized, controls.colorIntensity)
          r = red
          g = green
          b = blue

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

  const handleControlChange = (key: keyof PixelatedNoiseControls, value: number | string) => {
    setControls(prev => ({ ...prev, [key]: value }))
    if (onControlChange) {
      onControlChange(key, value)
    }
  }

  return (
    <div className={className}>
      {/* Canvas Container */}
      <div
        className="overflow-hidden relative border border-gray-300"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <canvas ref={canvasRef} className="w-full h-full" style={{ imageRendering: "pixelated" }} />

        {/* Technical overlay */}
        <div className="absolute top-2 left-2 text-xs font-mono text-yellow-400 bg-black/20 px-2 py-1">
          PIXELATED_NOISE
        </div>
        <div className="absolute bottom-2 right-2 text-xs font-mono text-gray-400 bg-black/20 px-2 py-1">
          CANVAS_2D
        </div>

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

      {/* Control Panel */}
      <div className="mt-4 p-4 border border-gray-300 bg-white space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-yellow-400"></div>
          <h3 className="text-sm font-mono uppercase tracking-wider text-gray-700">Noise Parameters</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Pixel Size */}
          <div>
            <label className="block text-xs font-mono text-gray-600 mb-2 uppercase">Pixel Size</label>
            <input
              type="range"
              min="2"
              max="32"
              step="1"
              value={controls.pixelSize}
              onChange={(e) => handleControlChange('pixelSize', parseInt(e.target.value))}
              className="w-full accent-yellow-400"
            />
            <div className="text-xs font-mono text-gray-500 mt-1 text-right">{controls.pixelSize}px</div>
          </div>

          {/* Noise Scale */}
          <div>
            <label className="block text-xs font-mono text-gray-600 mb-2 uppercase">Noise Scale</label>
            <input
              type="range"
              min="0.01"
              max="0.5"
              step="0.01"
              value={controls.noiseScale}
              onChange={(e) => handleControlChange('noiseScale', parseFloat(e.target.value))}
              className="w-full accent-yellow-400"
            />
            <div className="text-xs font-mono text-gray-500 mt-1 text-right">{controls.noiseScale.toFixed(2)}</div>
          </div>

          {/* Animation Speed */}
          <div>
            <label className="block text-xs font-mono text-gray-600 mb-2 uppercase">Animation Speed</label>
            <input
              type="range"
              min="0.001"
              max="0.1"
              step="0.001"
              value={controls.animationSpeed}
              onChange={(e) => handleControlChange('animationSpeed', parseFloat(e.target.value))}
              className="w-full accent-yellow-400"
            />
            <div className="text-xs font-mono text-gray-500 mt-1 text-right">{controls.animationSpeed.toFixed(3)}</div>
          </div>

          {/* Color Intensity */}
          <div>
            <label className="block text-xs font-mono text-gray-600 mb-2 uppercase">Color Intensity</label>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={controls.colorIntensity}
              onChange={(e) => handleControlChange('colorIntensity', parseFloat(e.target.value))}
              className="w-full accent-yellow-400"
            />
            <div className="text-xs font-mono text-gray-500 mt-1 text-right">{controls.colorIntensity.toFixed(1)}×</div>
          </div>

          {/* Color Scheme */}
          <div className="col-span-2">
            <label className="block text-xs font-mono text-gray-600 mb-2 uppercase">Color Scheme</label>
            <select
              value={controls.colorScheme}
              onChange={(e) => handleControlChange('colorScheme', e.target.value)}
              className="w-full border border-gray-300 p-2 text-xs font-mono bg-white"
            >
              <option value="retro">RETRO_PALETTE</option>
              <option value="monochrome">MONOCHROME</option>
              <option value="cyan">CYAN_MATRIX</option>
              <option value="amber">AMBER_TERMINAL</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
