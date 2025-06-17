"use client"

import { useEffect, useRef, useMemo } from "react"
import type { PatternGeneratorProps } from "./types"

interface TrigonometricControls {
  speed: number
}

export default function TrigonometricCircleGenerator({ 
  width, 
  height, 
  className = "",
  controlValues
}: PatternGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const timeRef = useRef<number>(0)

  // Use passed control values or defaults
  const controls: TrigonometricControls = useMemo(() => ({
    speed: (controlValues?.speed as number) ?? 1.0
  }), [controlValues])

  // Fixed values for optimal display
  const waveAmplitude = 55
  const circleRadius = 55
  const showTrails = true
  const gridOpacity = 0.2

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = width
    canvas.height = height

    // Calculate layout to match reference image
    const waveStartX = 40
    const waveWidth = width * 0.55
    const cosWaveY = height * 0.25  // Top cosine wave
    const sinWaveY = height * 0.75  // Bottom sine wave  
    const centerX = width - circleRadius - 20 // Circle right-aligned with padding
    const centerY = sinWaveY        // Circle aligned with sine wave center

    // Trail storage
    const trailPoints: Array<{x: number, y: number, alpha: number}> = []
    const maxTrailLength = 200

    const animate = () => {
      timeRef.current += 0.016 * controls.speed

      // Clear canvas with dark background
      ctx.fillStyle = "#0f172a" // Dark slate background
      ctx.fillRect(0, 0, width, height)

      // Set up drawing styles
      ctx.lineWidth = 1
      ctx.font = "12px monospace"

      // Draw technical grid
      ctx.globalAlpha = gridOpacity
      ctx.strokeStyle = "#1e293b" // Darker grid lines
      ctx.lineWidth = 1
      
      // Vertical grid lines
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      
      // Horizontal grid lines
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      ctx.globalAlpha = 1

      // Current angle
      const angle = timeRef.current

      // Calculate current position on circle
      const circleX = centerX + Math.cos(angle) * circleRadius
      const circleY = centerY - Math.sin(angle) * circleRadius // Negative for proper orientation

      // Draw coordinate axes with technical style
      ctx.strokeStyle = "#475569" // Slate gray
      ctx.lineWidth = 1
      
      // Horizontal axis for cos wave
      ctx.beginPath()
      ctx.moveTo(waveStartX - 10, cosWaveY)
      ctx.lineTo(waveStartX + waveWidth + 10, cosWaveY)
      ctx.stroke()
      
      // Horizontal axis for sin wave  
      ctx.beginPath()
      ctx.moveTo(waveStartX - 10, sinWaveY)
      ctx.lineTo(waveStartX + waveWidth + 10, sinWaveY)
      ctx.stroke()
      
      // Circle axes
      ctx.beginPath()
      ctx.moveTo(centerX - circleRadius - 15, centerY)
      ctx.lineTo(centerX + circleRadius + 15, centerY)
      ctx.stroke()
      
      ctx.beginPath()
      ctx.moveTo(centerX, centerY - circleRadius - 15)
      ctx.lineTo(centerX, centerY + circleRadius + 15)
      ctx.stroke()

      // Draw cosine wave with analogous blue  
      ctx.strokeStyle = "#0ea5e9" // Sky-500 (blue)
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let x = 0; x < waveWidth; x += 1) {
        const t = (x / waveWidth) * 4 * Math.PI
        const y = cosWaveY - Math.cos(t) * waveAmplitude
        if (x === 0) {
          ctx.moveTo(waveStartX + x, y)
        } else {
          ctx.lineTo(waveStartX + x, y)
        }
      }
      ctx.stroke()

      // Draw sine wave with analogous teal (flipped so sin=1 is at top)
      ctx.strokeStyle = "#06b6d4" // Cyan-500 (teal)
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let x = 0; x < waveWidth; x += 1) {
        const t = (x / waveWidth) * 4 * Math.PI
        const y = sinWaveY - Math.sin(t) * waveAmplitude // Negative so sin=1 is at top
        if (x === 0) {
          ctx.moveTo(waveStartX + x, y)
        } else {
          ctx.lineTo(waveStartX + x, y)
        }
      }
      ctx.stroke()

      // Draw circle outline with analogous green
      ctx.strokeStyle = "#10b981" // Emerald-500 (green)
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI)
      ctx.stroke()

      // Add trail point if trails are enabled
      if (showTrails) {
        trailPoints.push({
          x: circleX,
          y: circleY,
          alpha: 1.0
        })

        // Remove old trail points
        if (trailPoints.length > maxTrailLength) {
          trailPoints.shift()
        }

        // Update trail alphas
        trailPoints.forEach((point, index) => {
          point.alpha = index / trailPoints.length
        })

        // Draw trail with yellow accent
        trailPoints.forEach((point) => {
          ctx.globalAlpha = point.alpha * 0.4
          ctx.fillStyle = "#facc15" // Yellow-400
          ctx.beginPath()
          ctx.arc(point.x, point.y, 1.5, 0, 2 * Math.PI)
          ctx.fill()
        })
        ctx.globalAlpha = 1
      }

      // Calculate current position markers on waves
      const currentCosX = waveStartX + (angle % (4 * Math.PI)) / (4 * Math.PI) * waveWidth
      const currentSinX = waveStartX + (angle % (4 * Math.PI)) / (4 * Math.PI) * waveWidth
      const currentCosY = cosWaveY - Math.cos(angle) * waveAmplitude
      const currentSinY = sinWaveY - Math.sin(angle) * waveAmplitude // Flipped to match wave
      
      // Draw key connecting lines showing component relationships
      ctx.strokeStyle = "#facc15" // Yellow accent
      ctx.lineWidth = 1.5
      ctx.setLineDash([3, 3])
      
      // Horizontal line from circle point to sine wave (shows Y-component)
      ctx.beginPath()
      ctx.moveTo(circleX, circleY)
      ctx.lineTo(currentSinX, circleY) // Same Y level as circle
      ctx.stroke()
      
      // Vertical line down to sine wave point  
      ctx.beginPath()
      ctx.moveTo(currentSinX, circleY)
      ctx.lineTo(currentSinX, currentSinY)
      ctx.stroke()
      
      // Line from circle point to cosine wave marker (shows X-component projected up)
      ctx.beginPath()
      ctx.moveTo(circleX, circleY)
      ctx.lineTo(circleX, currentCosY) // Vertical to cosine level
      ctx.stroke()
      
      // Horizontal line to cosine wave point
      ctx.beginPath()
      ctx.moveTo(circleX, currentCosY)
      ctx.lineTo(currentCosX, currentCosY)
      ctx.stroke()
      
      ctx.setLineDash([])

      // Draw projection lines with dashed style
      ctx.strokeStyle = "#64748b" // Slate-500
      ctx.lineWidth = 1
      ctx.setLineDash([2, 4])
      
      // Horizontal projection line (cosine)
      ctx.beginPath()
      ctx.moveTo(circleX, circleY)
      ctx.lineTo(circleX, centerY)
      ctx.stroke()
      
      // Vertical projection line (sine)
      ctx.beginPath()
      ctx.moveTo(circleX, circleY)
      ctx.lineTo(centerX, circleY)
      ctx.stroke()
      
      ctx.setLineDash([])

      // Draw radius line
      ctx.strokeStyle = "#facc15" // Yellow accent
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(circleX, circleY)
      ctx.stroke()

      // Cosine wave marker
      ctx.fillStyle = "#0ea5e9" // Sky-500 (blue)
      ctx.beginPath()
      ctx.arc(currentCosX, currentCosY, 4, 0, 2 * Math.PI)
      ctx.fill()
      
      // Sine wave marker
      ctx.fillStyle = "#06b6d4" // Cyan-500 (teal)
      ctx.beginPath()
      ctx.arc(currentSinX, currentSinY, 4, 0, 2 * Math.PI)
      ctx.fill()

      // Draw current position on circle
      ctx.fillStyle = "#facc15" // Yellow accent
      ctx.beginPath()
      ctx.arc(circleX, circleY, 4, 0, 2 * Math.PI)
      ctx.fill()

      // Draw technical labels at bottom of waves to avoid collision
      ctx.fillStyle = "#0ea5e9" // Sky-500 (blue)
      ctx.font = "bold 12px monospace"
      ctx.fillText("COS θ", waveStartX, cosWaveY + waveAmplitude + 1)
      
      ctx.fillStyle = "#06b6d4" // Cyan-500 (teal)
      ctx.fillText("SIN θ", waveStartX, sinWaveY + waveAmplitude + 1)
      
      ctx.fillStyle = "#facc15"
      ctx.fillText(`θ = ${(angle % (2 * Math.PI)).toFixed(2)}`, centerX - 40, centerY - circleRadius - 20)

      // Draw current values in upper right with proper right alignment
      const cosText = `cos(${(angle % (2 * Math.PI)).toFixed(2)}) = ${Math.cos(angle).toFixed(3)}`
      const sinText = `sin(${(angle % (2 * Math.PI)).toFixed(2)}) = ${Math.sin(angle).toFixed(3)}`
      
      ctx.font = "10px monospace"
      
      ctx.fillStyle = "#0ea5e9" // Sky-500 (blue)
      const cosTextWidth = ctx.measureText(cosText).width
      ctx.fillText(cosText, width - cosTextWidth - 10, 20)
      
      ctx.fillStyle = "#06b6d4" // Cyan-500 (teal)  
      const sinTextWidth = ctx.measureText(sinText).width
      ctx.fillText(sinText, width - sinTextWidth - 10, 35)

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
        <canvas ref={canvasRef} className="w-full h-full" />
        
      </div>
    </div>
  )
}