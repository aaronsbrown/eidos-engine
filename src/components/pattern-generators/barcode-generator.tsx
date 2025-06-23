"use client"

import { useEffect, useRef, useMemo, useState } from "react"
import type { PatternGeneratorProps } from "./types"

interface BarcodeBar {
  width: number
  isBlack: boolean
}

interface BarcodeControls {
  scrollSpeed: number
  barDensity: number
  scannerSpeed: number
  scannerOpacity: number
  colorScheme: 'classic' | 'inverted' | 'blue' | 'green' | 'amber'
  showScanner: boolean
}

export default function BarcodeGenerator({ width, height, className = "", controlValues }: PatternGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const barsRef = useRef<BarcodeBar[]>([])
  const offsetRef = useRef<number>(0)
  const [scannerPosition, setScannerPosition] = useState<number>(0)

  const controls: BarcodeControls = useMemo(() => ({
    scrollSpeed: (controlValues?.scrollSpeed as number) ?? 2,
    barDensity: (controlValues?.barDensity as number) ?? 0.6,
    scannerSpeed: (controlValues?.scannerSpeed as number) ?? 2,
    scannerOpacity: (controlValues?.scannerOpacity as number) ?? 0.6,
    colorScheme: (controlValues?.colorScheme as 'classic' | 'inverted' | 'blue' | 'green' | 'amber') ?? 'classic',
    showScanner: (controlValues?.showScanner as boolean) ?? true
  }), [controlValues])

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
        const isBlack = Math.random() > (1 - controls.barDensity)
        bars.push({ width: barWidth, isBlack })
        totalWidth += barWidth
      }
      
      return bars
    }

    // Regenerate bars when density changes
    barsRef.current = generateBars()

    const getColors = (scheme: string) => {
      switch (scheme) {
        case 'classic':
          return { background: 'white', foreground: 'black' }
        case 'inverted':
          return { background: 'black', foreground: 'white' }
        case 'blue':
          return { background: '#dbeafe', foreground: '#1e40af' }
        case 'green':
          return { background: '#dcfce7', foreground: '#166534' }
        case 'amber':
          return { background: '#fef3c7', foreground: '#92400e' }
        default:
          return { background: 'white', foreground: 'black' }
      }
    }

    const animate = () => {
      const colors = getColors(controls.colorScheme)
      
      ctx.fillStyle = colors.background
      ctx.fillRect(0, 0, width, height)

      // Update scroll offset
      offsetRef.current += controls.scrollSpeed
      
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
          ctx.fillStyle = bar.isBlack ? colors.foreground : colors.background
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
  }, [width, height, controls])

  // Update scanner position
  useEffect(() => {
    if (!controls.showScanner) return

    const updateScanner = () => {
      setScannerPosition(prev => {
        const newPosition = prev + controls.scannerSpeed
        return newPosition > width + 20 ? -20 : newPosition
      })
    }

    const scannerInterval = setInterval(updateScanner, 16) // ~60fps
    
    return () => clearInterval(scannerInterval)
  }, [controls.scannerSpeed, controls.showScanner, width])

  return (
    <div
      className={`overflow-hidden relative border border-border ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {/* Dynamic scanning line effect */}
      {controls.showScanner && (
        <div
          className="absolute top-0 w-1 h-full bg-destructive transition-opacity duration-200"
          style={{
            left: `${scannerPosition}px`,
            opacity: controls.scannerOpacity,
            boxShadow: "0 0 10px rgba(239, 68, 68, 0.8)",
          }}
        />
      )}
    </div>
  )
}
