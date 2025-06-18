"use client"

import { useEffect, useRef, useMemo } from "react"
import type { PatternGeneratorProps } from "./types"

interface FrequencySpectrumControls {
  barWidth: number
  updateSpeed: number
  intensity: number
  bassBoost: number
  colorScheme: 'green' | 'blue' | 'purple' | 'rainbow' | 'amber'
  glow: boolean
}

export default function FrequencySpectrumGenerator({ width, height, className = "", controlValues }: PatternGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const frequenciesRef = useRef<number[]>([])

  const controls: FrequencySpectrumControls = useMemo(() => ({
    barWidth: (controlValues?.barWidth as number) ?? 3,
    updateSpeed: (controlValues?.updateSpeed as number) ?? 50,
    intensity: (controlValues?.intensity as number) ?? 1.0,
    bassBoost: (controlValues?.bassBoost as number) ?? 0.7,
    colorScheme: (controlValues?.colorScheme as 'green' | 'blue' | 'purple' | 'rainbow' | 'amber') ?? 'green',
    glow: (controlValues?.glow as boolean) ?? true
  }), [controlValues])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    const barCount = Math.floor(width / (controls.barWidth + 1))
    
    // Initialize frequencies if needed
    if (frequenciesRef.current.length !== barCount) {
      frequenciesRef.current = new Array(barCount).fill(0)
    }

    const generateFrequencies = () => {
      const newFrequencies = []
      for (let i = 0; i < barCount; i++) {
        // Create realistic frequency spectrum with bass boost
        const freqPosition = i / barCount
        const baseHeight = Math.max(0.1, 1 - freqPosition * controls.bassBoost)
        const randomVariation = Math.random() * 0.6 + 0.4
        const beatEffect = Math.sin(Date.now() * 0.003 + i * 0.1) * 0.2 + 0.8
        newFrequencies.push(baseHeight * randomVariation * beatEffect * controls.intensity)
      }
      return newFrequencies
    }

    const getBarColor = (scheme: string, height: number, index: number, barCount: number) => {
      const normalizedHeight = height / canvas.height
      const position = index / barCount
      
      switch (scheme) {
        case 'green':
          return [
            `rgb(34, 197, 94)`,
            `rgb(74, 222, 128)`,
            `rgb(16, 185, 129)`
          ]
        case 'blue':
          return [
            `rgb(59, 130, 246)`,
            `rgb(96, 165, 250)`,
            `rgb(147, 197, 253)`
          ]
        case 'purple':
          return [
            `rgb(147, 51, 234)`,
            `rgb(168, 85, 247)`,
            `rgb(196, 181, 253)`
          ]
        case 'rainbow':
          const hue = (position * 360 + normalizedHeight * 60) % 360
          return [
            `hsl(${hue}, 70%, 50%)`,
            `hsl(${hue}, 80%, 60%)`,
            `hsl(${hue}, 90%, 70%)`
          ]
        case 'amber':
          return [
            `rgb(245, 158, 11)`,
            `rgb(251, 191, 36)`,
            `rgb(253, 230, 138)`
          ]
        default:
          return ['rgb(255, 255, 255)', 'rgb(200, 200, 200)', 'rgb(150, 150, 150)']
      }
    }

    let lastUpdate = 0

    const animate = (currentTime: number) => {
      // Clear canvas with black background
      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, width, height)

      // Update frequencies periodically
      if (currentTime - lastUpdate > controls.updateSpeed) {
        frequenciesRef.current = generateFrequencies()
        lastUpdate = currentTime
      }

      // Draw frequency bars
      frequenciesRef.current.forEach((freq, index) => {
        const barHeight = Math.max(2, freq * (height - 4))
        const x = index * (controls.barWidth + 1) + 2
        const y = height - barHeight

        const colors = getBarColor(controls.colorScheme, barHeight, index, barCount)

        // Create gradient for each bar
        const gradient = ctx.createLinearGradient(0, y, 0, height)
        gradient.addColorStop(0, colors[0])
        gradient.addColorStop(0.5, colors[1])
        gradient.addColorStop(1, colors[2])

        ctx.fillStyle = gradient
        ctx.fillRect(x, y, controls.barWidth, barHeight)

        // Add glow effect if enabled
        if (controls.glow) {
          ctx.shadowColor = colors[0].replace('rgb', 'rgba').replace(')', ', 0.6)')
          ctx.shadowBlur = 4
          ctx.fillRect(x, y, controls.barWidth, barHeight)
          ctx.shadowBlur = 0
        }
      })

      // Add subtle base glow if enabled
      if (controls.glow) {
        const baseColors = getBarColor(controls.colorScheme, height, 0, 1)
        const baseGradient = ctx.createRadialGradient(width / 2, height, 0, width / 2, height, width / 2)
        baseGradient.addColorStop(0, baseColors[0].replace('rgb', 'rgba').replace(')', ', 0.1)'))
        baseGradient.addColorStop(1, "transparent")
        
        ctx.fillStyle = baseGradient
        ctx.fillRect(0, 0, width, height)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate(0)

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
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {/* Optional: Add subtle reflection effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, transparent 70%, rgba(0,0,0,0.1) 100%)",
        }}
      />
    </div>
  )
}
