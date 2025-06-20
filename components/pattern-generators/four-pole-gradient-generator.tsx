"use client"

import { useEffect, useRef, useMemo, useState, useCallback } from "react"
import type { PatternGeneratorProps } from "./types"

// AIDEV-NOTE: 4-pole gradient system using inverse distance weighting for smooth interpolation
interface GradientPole {
  x: number
  y: number
  color: { r: number; g: number; b: number }
}

interface FourPoleGradientControls {
  pole1Color: string
  pole2Color: string
  pole3Color: string
  pole4Color: string
  interpolationPower: number
}

export default function FourPoleGradientGenerator({ 
  width, 
  height, 
  className = "",
  controlValues
}: PatternGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState<number | null>(null)
  const [hoveredPole, setHoveredPole] = useState<number | null>(null)
  
  // Use passed control values or defaults
  const controls: FourPoleGradientControls = useMemo(() => ({
    pole1Color: (controlValues?.pole1Color as string) ?? "#FF0000",
    pole2Color: (controlValues?.pole2Color as string) ?? "#00FF00", 
    pole3Color: (controlValues?.pole3Color as string) ?? "#0000FF",
    pole4Color: (controlValues?.pole4Color as string) ?? "#FFFF00",
    interpolationPower: (controlValues?.interpolationPower as number) ?? 2.0
  }), [controlValues])

  // AIDEV-NOTE: Initialize 4 poles at corners with slight inset for better interaction
  const [poles, setPoles] = useState<GradientPole[]>(() => [
    { x: width * 0.2, y: height * 0.2, color: { r: 255, g: 0, b: 0 } },
    { x: width * 0.8, y: height * 0.2, color: { r: 0, g: 255, b: 0 } },
    { x: width * 0.2, y: height * 0.8, color: { r: 0, g: 0, b: 255 } },
    { x: width * 0.8, y: height * 0.8, color: { r: 255, g: 255, b: 0 } }
  ])

  // Convert hex color to RGB
  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 }
  }, [])

  // AIDEV-NOTE: Optimize color updates with useMemo to prevent unnecessary recalculations
  const poleColors = useMemo(() => [
    hexToRgb(controls.pole1Color),
    hexToRgb(controls.pole2Color),
    hexToRgb(controls.pole3Color),
    hexToRgb(controls.pole4Color)
  ], [controls.pole1Color, controls.pole2Color, controls.pole3Color, controls.pole4Color, hexToRgb])

  // Update pole colors when control values change
  useEffect(() => {
    setPoles(prevPoles => prevPoles.map((pole, index) => ({
      ...pole,
      color: poleColors[index]
    })))
  }, [poleColors])

  // AIDEV-NOTE: Inverse distance weighting interpolation for smooth 4-pole gradients  
  const calculatePixelColor = useCallback((x: number, y: number, poles: GradientPole[], interpolationPower: number) => {
    let totalWeight = 0
    let weightedR = 0
    let weightedG = 0
    let weightedB = 0

    poles.forEach(pole => {
      const distance = Math.sqrt(Math.pow(x - pole.x, 2) + Math.pow(y - pole.y, 2))
      const adjustedDistance = Math.max(distance, 1) // Prevent division by zero
      const weight = 1 / Math.pow(adjustedDistance, interpolationPower)
      
      totalWeight += weight
      weightedR += pole.color.r * weight
      weightedG += pole.color.g * weight
      weightedB += pole.color.b * weight
    })

    return {
      r: Math.round(weightedR / totalWeight),
      g: Math.round(weightedG / totalWeight),
      b: Math.round(weightedB / totalWeight)
    }
  }, [])

  // AIDEV-NOTE: Check if point is near a pole for interaction (collision detection)
  const getPoleAtPosition = useCallback((x: number, y: number): number | null => {
    const poleRadius = 15 // Touch-friendly size
    for (let i = 0; i < poles.length; i++) {
      const distance = Math.sqrt(Math.pow(x - poles[i].x, 2) + Math.pow(y - poles[i].y, 2))
      if (distance <= poleRadius) {
        return i
      }
    }
    return null
  }, [poles])

  // Mouse event handlers
  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const poleIndex = getPoleAtPosition(x, y)
    if (poleIndex !== null) {
      setIsDragging(poleIndex)
    }
  }, [getPoleAtPosition])

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    if (isDragging !== null) {
      // Update pole position while dragging
      setPoles(prevPoles => {
        const newPoles = [...prevPoles]
        newPoles[isDragging] = {
          ...newPoles[isDragging],
          x: Math.max(0, Math.min(width, x)),
          y: Math.max(0, Math.min(height, y))
        }
        return newPoles
      })
    } else {
      // Update hover state
      const hoveredPoleIndex = getPoleAtPosition(x, y)
      setHoveredPole(hoveredPoleIndex)
    }
  }, [isDragging, width, height, getPoleAtPosition])

  const handleMouseUp = useCallback(() => {
    setIsDragging(null)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsDragging(null)
    setHoveredPole(null)
  }, [])

  // Render gradient and poles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    // AIDEV-NOTE: Optimized gradient rendering using ImageData for performance
    const imageData = ctx.createImageData(width, height)
    const data = imageData.data

    // Calculate gradient for each pixel
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4
        const color = calculatePixelColor(x, y, poles, controls.interpolationPower)
        
        data[pixelIndex] = color.r     // Red
        data[pixelIndex + 1] = color.g // Green
        data[pixelIndex + 2] = color.b // Blue
        data[pixelIndex + 3] = 255     // Alpha
      }
    }

    ctx.putImageData(imageData, 0, 0)

    // Draw pole indicators
    poles.forEach((pole, index) => {
      const isHovered = hoveredPole === index
      const isDragged = isDragging === index
      
      // Pole circle
      ctx.beginPath()
      ctx.arc(pole.x, pole.y, isDragged ? 12 : (isHovered ? 10 : 8), 0, 2 * Math.PI)
      ctx.fillStyle = `rgb(${pole.color.r}, ${pole.color.g}, ${pole.color.b})`
      ctx.fill()
      
      // Border with project's yellow accent
      ctx.strokeStyle = isDragged || isHovered ? "#FACC15" : "#FFFFFF"
      ctx.lineWidth = isDragged ? 3 : 2
      ctx.stroke()
      
      // Pole number label (technical aesthetic)
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "10px monospace"
      ctx.textAlign = "center"
      ctx.fillText(`${index + 1}`, pole.x, pole.y + 3)
    })
  }, [width, height, poles, hoveredPole, isDragging, controls.interpolationPower, calculatePixelColor])

  return (
    <div className={className}>
      <div
        className="overflow-hidden relative cursor-crosshair"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
        
        {/* Pattern type indicator */}
        <div className="absolute top-2 left-2 text-yellow-400 text-xs font-mono uppercase pointer-events-none">
          4-POLE GRADIENT / CANVAS_2D
        </div>
      </div>
    </div>
  )
}