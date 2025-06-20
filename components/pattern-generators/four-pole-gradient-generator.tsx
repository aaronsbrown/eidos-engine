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
  animationEnabled: boolean
  animationSpeed: number
  animationPattern: string
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
  const animationFrameRef = useRef<number | null>(null)
  const animationTimeRef = useRef<number>(0)
  
  // Use passed control values or defaults
  const controls: FourPoleGradientControls = useMemo(() => ({
    pole1Color: (controlValues?.pole1Color as string) ?? "#FF0000",
    pole2Color: (controlValues?.pole2Color as string) ?? "#00FF00", 
    pole3Color: (controlValues?.pole3Color as string) ?? "#0000FF",
    pole4Color: (controlValues?.pole4Color as string) ?? "#FFFF00",
    interpolationPower: (controlValues?.interpolationPower as number) ?? 2.0,
    animationEnabled: (controlValues?.animationEnabled as boolean) ?? false,
    animationSpeed: (controlValues?.animationSpeed as number) ?? 1.0,
    animationPattern: (controlValues?.animationPattern as string) ?? "circular"
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


  // AIDEV-NOTE: Animation pattern calculation functions for different movement types
  const getAnimatedPolePosition = useCallback((poleIndex: number, time: number, pattern: string, speed: number) => {
    const centerX = width / 2
    const centerY = height / 2
    const radiusX = Math.min(width, height) * 0.3
    const radiusY = Math.min(width, height) * 0.3
    const t = (time * speed) / 1000 // Convert to seconds and apply speed
    
    switch (pattern) {
      case 'circular': {
        // Each pole moves in a circle, offset by 90 degrees
        const angle = (t + poleIndex * Math.PI / 2) % (2 * Math.PI)
        return {
          x: centerX + radiusX * Math.cos(angle),
          y: centerY + radiusY * Math.sin(angle)
        }
      }
      
      case 'figure8': {
        // Figure-8 pattern using parametric equations
        const phaseOffset = poleIndex * Math.PI / 2
        const angle = t + phaseOffset
        const scale = 0.7
        return {
          x: centerX + radiusX * scale * Math.sin(angle),
          y: centerY + radiusY * scale * Math.sin(2 * angle) / 2
        }
      }
      
      case 'oscillating': {
        // Oscillating wave pattern
        const xOffset = (poleIndex % 2) * width * 0.3
        const yOffset = Math.floor(poleIndex / 2) * height * 0.3
        return {
          x: centerX - width * 0.15 + xOffset + radiusX * 0.5 * Math.sin(t + poleIndex),
          y: centerY - height * 0.15 + yOffset + radiusY * 0.5 * Math.cos(t * 1.3 + poleIndex)
        }
      }
      
      case 'random': {
        // Smooth random walk using multiple sine waves
        const seedX = poleIndex * 1.37 // Prime number for pseudo-randomness
        const seedY = poleIndex * 2.73
        return {
          x: centerX + radiusX * 0.6 * (
            Math.sin(t * 0.7 + seedX) * 0.5 + 
            Math.sin(t * 1.3 + seedX * 2) * 0.3 +
            Math.sin(t * 0.4 + seedX * 3) * 0.2
          ),
          y: centerY + radiusY * 0.6 * (
            Math.cos(t * 0.8 + seedY) * 0.5 + 
            Math.cos(t * 1.1 + seedY * 2) * 0.3 +
            Math.cos(t * 0.6 + seedY * 3) * 0.2
          )
        }
      }
      
      case 'curl': {
        // Smooth turbulent swirling motion with continuous chaos
        const angle = (t * 0.8 + poleIndex * Math.PI / 2) % (2 * Math.PI)
        const swirl = t * 0.3 + poleIndex
        
        // Multiple layers of smooth turbulence at different frequencies
        const turbulence1 = Math.sin(t * 1.2 + poleIndex * 3.7) * 0.4
        const turbulence2 = Math.cos(t * 2.1 + poleIndex * 1.9) * 0.25
        const turbulence3 = Math.sin(t * 0.7 + poleIndex * 5.3) * 0.15
        const turbulence4 = Math.cos(t * 3.1 + poleIndex * 1.3) * 0.1
        
        // Smooth radial variations - multiple waves for complexity
        const radialNoise = Math.sin(t * 1.5 + poleIndex * 2.8) * 0.3 + 
                           Math.cos(t * 0.9 + poleIndex * 4.2) * 0.2
        const baseRadius = radiusX * (0.5 + Math.sin(swirl) * 0.3 + radialNoise)
        
        // Angular turbulence - makes the circular motion irregular but smooth
        const angularTurbulence = (turbulence1 + turbulence2 + turbulence4 * 2) * 0.6
        const chaosAngle = angle + angularTurbulence
        
        // Position turbulence - adds chaotic but continuous displacement
        const chaosX = (turbulence1 * 0.5 + turbulence3 * 0.7 + turbulence4 * 0.3) * radiusX
        const chaosY = (turbulence2 * 0.5 - turbulence3 * 0.4 + turbulence4 * 0.6) * radiusY
        
        // Smooth direction variation - gradual changes instead of snaps
        const directionWave = Math.sin(t * 0.4 + poleIndex * 2.1) * 0.3
        const smoothDirection = 1.0 + directionWave
        
        return {
          x: centerX + (baseRadius * Math.cos(chaosAngle) + chaosX) * smoothDirection,
          y: centerY + (baseRadius * Math.sin(chaosAngle) + chaosY) * smoothDirection
        }
      }
      
      default:
        return { x: centerX, y: centerY }
    }
  }, [width, height])

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


  // AIDEV-NOTE: Animation loop using requestAnimationFrame for smooth 60fps performance
  useEffect(() => {
    if (!controls.animationEnabled) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      return
    }

    const animate = (currentTime: number) => {
      animationTimeRef.current = currentTime
      
      // Update pole positions based on animation pattern
      setPoles(prevPoles => {
        return prevPoles.map((pole, index) => {
          const newPos = getAnimatedPolePosition(
            index, 
            currentTime, 
            controls.animationPattern, 
            controls.animationSpeed
          )
          return {
            ...pole,
            x: Math.max(0, Math.min(width, newPos.x)),
            y: Math.max(0, Math.min(height, newPos.y))
          }
        })
      })
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [controls.animationEnabled, controls.animationPattern, controls.animationSpeed, getAnimatedPolePosition, width, height])

  // Mouse event handlers - disabled when animation is active
  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (controls.animationEnabled) return // Disable interaction during animation
    
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const poleIndex = getPoleAtPosition(x, y)
    if (poleIndex !== null) {
      setIsDragging(poleIndex)
    }
  }, [getPoleAtPosition, controls.animationEnabled])

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (controls.animationEnabled) return // Disable interaction during animation
    
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
  }, [isDragging, width, height, getPoleAtPosition, controls.animationEnabled])

  const handleMouseUp = useCallback(() => {
    if (controls.animationEnabled) return // Disable interaction during animation
    setIsDragging(null)
  }, [controls.animationEnabled])

  const handleMouseLeave = useCallback(() => {
    if (controls.animationEnabled) return // Disable interaction during animation
    setIsDragging(null)
    setHoveredPole(null)
  }, [controls.animationEnabled])

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
        className={`overflow-hidden relative ${
          controls.animationEnabled ? 'cursor-default' : 'cursor-crosshair'
        }`}
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
        
        {/* Pattern type indicator with animation status */}
        <div className="absolute top-2 left-2 text-yellow-400 text-xs font-mono uppercase pointer-events-none">
          4-POLE GRADIENT / CANVAS_2D {controls.animationEnabled && '/ ANIMATED'}
        </div>
        
        {/* Animation status indicator */}
        {controls.animationEnabled && (
          <div className="absolute top-2 right-2 text-yellow-400 text-xs font-mono uppercase pointer-events-none">
            {controls.animationPattern.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toUpperCase()}
          </div>
        )}
      </div>
    </div>
  )
}