"use client"

import { useEffect, useRef } from "react"
import type { PatternGeneratorProps } from "./types"

interface BarcodeBar {
  width: number
  isBlack: boolean
}

export default function BarcodeGenerator({ width, height, className = "" }: PatternGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const barsRef = useRef<BarcodeBar[]>([])
  const offsetRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    // Generate barcode pattern
    const generateBars = () => {
      const bars: BarcodeBar[] = []
      let totalWidth = 0
      
      // Generate enough bars to fill 2x the width for seamless scrolling
      while (totalWidth < width * 2) {
        const barWidth = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 2 : 1
        const isBlack = Math.random() > 0.4
        bars.push({ width: barWidth, isBlack })
        totalWidth += barWidth
      }
      
      return bars
    }

    if (barsRef.current.length === 0) {
      barsRef.current = generateBars()
    }

    const animate = () => {
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, width, height)

      // Update scroll offset
      offsetRef.current += 2 // Speed of scrolling
      
      // Calculate total width of bars for wrap-around
      const totalBarsWidth = barsRef.current.reduce((sum, bar) => sum + bar.width, 0)
      if (offsetRef.current >= totalBarsWidth / 2) {
        offsetRef.current = 0
      }

      // Draw bars
      let x = -offsetRef.current
      let barIndex = 0
      
      while (x < width && barIndex < barsRef.current.length) {
        const bar = barsRef.current[barIndex]
        
        if (x + bar.width > 0) {
          ctx.fillStyle = bar.isBlack ? "black" : "white"
          ctx.fillRect(x, 0, bar.width, height)
        }
        
        x += bar.width
        barIndex++
        
        // Wrap around for seamless scrolling
        if (barIndex >= barsRef.current.length) {
          barIndex = 0
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
  }, [width, height])

  return (
    <div
      className={`overflow-hidden relative border border-gray-300 ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {/* Subtle scanning line effect */}
      <div
        className="absolute top-0 w-1 h-full bg-red-500 opacity-60 animate-pulse"
        style={{
          animation: "scan 2s linear infinite",
          boxShadow: "0 0 10px rgba(239, 68, 68, 0.8)",
        }}
      />

      <style jsx>{`
        @keyframes scan {
          0% {
            left: 0;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
