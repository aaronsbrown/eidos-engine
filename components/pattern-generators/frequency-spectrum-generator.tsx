"use client"

import { useEffect, useRef } from "react"
import type { PatternGeneratorProps } from "./types"

export default function FrequencySpectrumGenerator({ width, height, className = "" }: PatternGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const frequenciesRef = useRef<number[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    const barWidth = 3
    const barCount = Math.floor(width / (barWidth + 1))
    
    // Initialize frequencies if needed
    if (frequenciesRef.current.length !== barCount) {
      frequenciesRef.current = new Array(barCount).fill(0)
    }

    const generateFrequencies = () => {
      const newFrequencies = []
      for (let i = 0; i < barCount; i++) {
        // Create realistic frequency spectrum (higher on left, lower on right)
        const baseHeight = Math.max(0.1, 1 - (i / barCount) * 0.7)
        const randomVariation = Math.random() * 0.6 + 0.4
        const beatEffect = Math.sin(Date.now() * 0.003 + i * 0.1) * 0.2 + 0.8
        newFrequencies.push(baseHeight * randomVariation * beatEffect)
      }
      return newFrequencies
    }

    let lastUpdate = 0
    const updateInterval = 50 // Update every 50ms

    const animate = (currentTime: number) => {
      // Clear canvas with black background
      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, width, height)

      // Update frequencies periodically
      if (currentTime - lastUpdate > updateInterval) {
        frequenciesRef.current = generateFrequencies()
        lastUpdate = currentTime
      }

      // Draw frequency bars
      frequenciesRef.current.forEach((freq, index) => {
        const barHeight = Math.max(2, freq * (height - 4))
        const x = index * (barWidth + 1) + 2
        const y = height - barHeight

        // Create gradient for each bar
        const gradient = ctx.createLinearGradient(0, y, 0, height)
        gradient.addColorStop(0, "rgb(34, 197, 94)")
        gradient.addColorStop(0.5, "rgb(74, 222, 128)")
        gradient.addColorStop(1, "rgb(16, 185, 129)")

        ctx.fillStyle = gradient
        ctx.fillRect(x, y, barWidth, barHeight)

        // Add glow effect
        ctx.shadowColor = "rgba(34, 197, 94, 0.6)"
        ctx.shadowBlur = 4
        ctx.fillRect(x, y, barWidth, barHeight)
        ctx.shadowBlur = 0
      })

      // Add subtle base glow
      const baseGradient = ctx.createRadialGradient(width / 2, height, 0, width / 2, height, width / 2)
      baseGradient.addColorStop(0, "rgba(34, 197, 94, 0.1)")
      baseGradient.addColorStop(1, "transparent")
      
      ctx.fillStyle = baseGradient
      ctx.fillRect(0, 0, width, height)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate(0)

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
