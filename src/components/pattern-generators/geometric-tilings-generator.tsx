"use client"

import React, { useRef, useEffect, useCallback } from 'react'
import type { PatternGeneratorProps } from './types'

// AIDEV-NOTE: Geometric tilings/tessellations pattern generator with multiple tiling algorithms
// Supports Square, Hexagonal, Penrose, and Islamic Star patterns with real-time parameter control

interface TilingPoint {
  x: number
  y: number
}

interface TilingShape {
  points: TilingPoint[]
  color?: string
  strokeColor?: string
}

type TilingType = 'square' | 'hexagonal' | 'penrose' | 'islamic-star'
type ColorScheme = 'monochrome' | 'warm' | 'cool' | 'rainbow' | 'gold-blue'

const GeometricTilingsGenerator: React.FC<PatternGeneratorProps> = ({
  width,
  height,
  className = '',
  controlValues = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const startTimeRef = useRef<number>(Date.now())

  // Extract control values with defaults
  const tilingType = (controlValues.tilingType as TilingType) || 'square'
  const colorScheme = (controlValues.colorScheme as ColorScheme) || 'monochrome'
  const scale = (controlValues.scale as number) || 40
  const lineWidth = (controlValues.lineWidth as number) || 1
  const showFill = (controlValues.showFill as boolean) ?? true
  const showStroke = (controlValues.showStroke as boolean) ?? true
  const animationEnabled = (controlValues.animationEnabled as boolean) ?? false
  const animationSpeed = (controlValues.animationSpeed as number) || 1.0

  // Color palette definitions
  const getColorPalette = useCallback((scheme: ColorScheme): string[] => {
    switch (scheme) {
      case 'monochrome':
        return ['#FFFFFF', '#E5E5E5', '#CCCCCC', '#999999', '#666666']
      case 'warm':
        return ['#FF6B47', '#FF8A80', '#FFAB40', '#FFD54F', '#FFF176']
      case 'cool':
        return ['#4FC3F7', '#64B5F6', '#81C784', '#A5D6A7', '#C8E6C9']
      case 'rainbow':
        return ['#FF5722', '#FF9800', '#FFC107', '#4CAF50', '#2196F3', '#9C27B0']
      case 'gold-blue':
        return ['#FFD700', '#FFA500', '#1E88E5', '#1565C0', '#0D47A1']
      default:
        return ['#FFFFFF', '#E5E5E5', '#CCCCCC', '#999999', '#666666']
    }
  }, [])

  // Generate square grid tiling
  const generateSquareTiling = useCallback((canvasWidth: number, canvasHeight: number, tileSize: number): TilingShape[] => {
    const shapes: TilingShape[] = []
    const colors = getColorPalette(colorScheme)
    
    for (let x = 0; x < canvasWidth + tileSize; x += tileSize) {
      for (let y = 0; y < canvasHeight + tileSize; y += tileSize) {
        const colorIndex = Math.floor((x / tileSize + y / tileSize) % colors.length)
        shapes.push({
          points: [
            { x, y },
            { x: x + tileSize, y },
            { x: x + tileSize, y: y + tileSize },
            { x, y: y + tileSize }
          ],
          color: colors[colorIndex],
          strokeColor: '#333333'
        })
      }
    }
    
    return shapes
  }, [colorScheme, getColorPalette])

  // Generate hexagonal tiling
  const generateHexagonalTiling = useCallback((canvasWidth: number, canvasHeight: number, radius: number): TilingShape[] => {
    const shapes: TilingShape[] = []
    const colors = getColorPalette(colorScheme)
    
    const hexWidth = radius * 2
    const hexHeight = radius * Math.sqrt(3)
    
    const generateHexagon = (centerX: number, centerY: number): TilingPoint[] => {
      const points: TilingPoint[] = []
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3
        points.push({
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        })
      }
      return points
    }
    
    let row = 0
    for (let y = -radius; y < canvasHeight + radius; y += hexHeight * 0.75) {
      const offsetX = (row % 2) * (hexWidth * 0.5)
      for (let x = -radius + offsetX; x < canvasWidth + radius; x += hexWidth * 0.75) {
        const colorIndex = Math.floor((row + Math.floor(x / hexWidth)) % colors.length)
        shapes.push({
          points: generateHexagon(x, y),
          color: colors[colorIndex],
          strokeColor: '#333333'
        })
      }
      row++
    }
    
    return shapes
  }, [colorScheme, getColorPalette])

  // Generate Penrose-inspired tiling with dart and kite shapes
  const generatePenroseTiling = useCallback((canvasWidth: number, canvasHeight: number, baseSize: number): TilingShape[] => {
    const shapes: TilingShape[] = []
    const colors = getColorPalette(colorScheme)
    
    const goldenRatio = (1 + Math.sqrt(5)) / 2
    
    // AIDEV-NOTE: Practical Penrose-inspired pattern using dart and kite shapes
    // Fills the screen with visible patterns rather than microscopic recursive subdivision
    
    // Create dart shape with proper proportions
    const createDart = (centerX: number, centerY: number, size: number, rotation: number): TilingPoint[] => {
      const length = size
      const width = size / goldenRatio
      
      // Dart has pointy ends and narrow waist
      const halfLength = length / 2
      const halfWidth = width / 2
      
      const cos = Math.cos(rotation)
      const sin = Math.sin(rotation)
      
      // Define dart points relative to center
      const localPoints = [
        { x: 0, y: -halfLength },        // top point
        { x: halfWidth, y: 0 },          // right side
        { x: 0, y: halfLength },         // bottom point  
        { x: -halfWidth, y: 0 }          // left side
      ]
      
      // Rotate and translate to world coordinates
      return localPoints.map(p => ({
        x: centerX + p.x * cos - p.y * sin,
        y: centerY + p.x * sin + p.y * cos
      }))
    }
    
    // Create kite shape with proper proportions
    const createKite = (centerX: number, centerY: number, size: number, rotation: number): TilingPoint[] => {
      const length = size / goldenRatio
      const width = size
      
      // Kite is wider than dart
      const halfLength = length / 2
      const halfWidth = width / 2
      
      const cos = Math.cos(rotation)
      const sin = Math.sin(rotation)
      
      // Define kite points relative to center
      const localPoints = [
        { x: 0, y: -halfLength },        // top point
        { x: halfWidth, y: 0 },          // right side
        { x: 0, y: halfLength },         // bottom point
        { x: -halfWidth, y: 0 }          // left side
      ]
      
      // Rotate and translate to world coordinates  
      return localPoints.map(p => ({
        x: centerX + p.x * cos - p.y * sin,
        y: centerY + p.x * sin + p.y * cos
      }))
    }
    
    // Generate quasi-periodic pattern using Fibonacci-based placement
    const tileSize = baseSize
    const spacing = tileSize * 1.2
    
    // Cover the canvas with overlapping tiles
    for (let x = -spacing; x <= canvasWidth + spacing; x += spacing * 0.7) {
      for (let y = -spacing; y <= canvasHeight + spacing; y += spacing * 0.7) {
        
        // Use position-based pseudo-random generation for quasi-periodicity
        const seedX = Math.floor(x / spacing * 10) % 17
        const seedY = Math.floor(y / spacing * 10) % 13
        const combinedSeed = (seedX * 13 + seedY * 17) % 89
        
        // Golden ratio-based decision for dart vs kite
        const isDart = (combinedSeed % 8) < 3 // Roughly golden ratio proportion
        
        // Fibonacci-based rotation angles (creates quasi-periodic orientations)
        const fibAngles = [0, Math.PI/5, 2*Math.PI/5, 3*Math.PI/5, 4*Math.PI/5, Math.PI, 6*Math.PI/5, 7*Math.PI/5, 8*Math.PI/5, 9*Math.PI/5]
        const rotation = fibAngles[combinedSeed % fibAngles.length]
        
        // Size variation for more organic feel
        const sizeVariation = 0.8 + (combinedSeed % 10) * 0.04 // 0.8 to 1.2
        const actualSize = tileSize * sizeVariation
        
        // Color based on type and position
        const colorIndex = isDart ? 
          (seedX + seedY) % colors.length : 
          (seedX + seedY + 2) % colors.length
        
        if (isDart) {
          shapes.push({
            points: createDart(x, y, actualSize, rotation),
            color: colors[colorIndex],
            strokeColor: '#333333'
          })
        } else {
          shapes.push({
            points: createKite(x, y, actualSize, rotation),
            color: colors[colorIndex], 
            strokeColor: '#333333'
          })
        }
      }
    }
    
    // Add some central focal patterns for visual interest
    const centerX = canvasWidth / 2
    const centerY = canvasHeight / 2
    
    // Central sunburst pattern
    for (let i = 0; i < 10; i++) {
      const angle = (i * 2 * Math.PI) / 10
      const distance = tileSize * 2
      const x = centerX + distance * Math.cos(angle)
      const y = centerY + distance * Math.sin(angle)
      
      const colorIndex = i % colors.length
      const isKite = i % 3 !== 0
      
      if (isKite) {
        shapes.push({
          points: createKite(x, y, tileSize * 0.8, angle + Math.PI/2),
          color: colors[colorIndex],
          strokeColor: '#333333'
        })
      } else {
        shapes.push({
          points: createDart(x, y, tileSize * 0.8, angle + Math.PI/2),
          color: colors[colorIndex],
          strokeColor: '#333333'
        })
      }
    }
    
    return shapes
  }, [colorScheme, getColorPalette])

  // Generate Islamic star pattern
  const generateIslamicStarTiling = useCallback((canvasWidth: number, canvasHeight: number, starSize: number): TilingShape[] => {
    const shapes: TilingShape[] = []
    const colors = getColorPalette(colorScheme)
    
    const generateStar = (centerX: number, centerY: number, outerRadius: number, innerRadius: number): TilingPoint[] => {
      const points: TilingPoint[] = []
      const spikes = 8
      
      for (let i = 0; i < spikes * 2; i++) {
        const angle = (i * Math.PI) / spikes
        const radius = i % 2 === 0 ? outerRadius : innerRadius
        points.push({
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        })
      }
      return points
    }
    
    const spacing = starSize * 2.5
    let starIndex = 0
    
    for (let x = starSize; x < canvasWidth; x += spacing) {
      for (let y = starSize; y < canvasHeight; y += spacing) {
        // Main star
        const colorIndex = starIndex % colors.length
        shapes.push({
          points: generateStar(x, y, starSize, starSize * 0.4),
          color: colors[colorIndex],
          strokeColor: '#333333'
        })
        
        // Surrounding octagons
        const octagonRadius = starSize * 0.6
        const octagonPoints: TilingPoint[] = []
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4 + Math.PI / 8
          octagonPoints.push({
            x: x + spacing * 0.5 + octagonRadius * Math.cos(angle),
            y: y + spacing * 0.5 + octagonRadius * Math.sin(angle)
          })
        }
        
        if (octagonPoints.every(p => p.x >= 0 && p.x <= canvasWidth && p.y >= 0 && p.y <= canvasHeight)) {
          shapes.push({
            points: octagonPoints,
            color: colors[(colorIndex + 1) % colors.length],
            strokeColor: '#333333'
          })
        }
        
        starIndex++
      }
    }
    
    return shapes
  }, [colorScheme, getColorPalette])

  // Generate tiling based on type
  const generateTiling = useCallback((tilingType: TilingType, canvasWidth: number, canvasHeight: number, size: number): TilingShape[] => {
    switch (tilingType) {
      case 'square':
        return generateSquareTiling(canvasWidth, canvasHeight, size)
      case 'hexagonal':
        return generateHexagonalTiling(canvasWidth, canvasHeight, size / 2)
      case 'penrose':
        return generatePenroseTiling(canvasWidth, canvasHeight, size)
      case 'islamic-star':
        return generateIslamicStarTiling(canvasWidth, canvasHeight, size / 2)
      default:
        return generateSquareTiling(canvasWidth, canvasHeight, size)
    }
  }, [generateSquareTiling, generateHexagonalTiling, generatePenroseTiling, generateIslamicStarTiling])

  // Draw a shape on the canvas
  const drawShape = useCallback((ctx: CanvasRenderingContext2D, shape: TilingShape) => {
    if (shape.points.length === 0) return
    
    ctx.beginPath()
    ctx.moveTo(shape.points[0].x, shape.points[0].y)
    
    for (let i = 1; i < shape.points.length; i++) {
      ctx.lineTo(shape.points[i].x, shape.points[i].y)
    }
    
    ctx.closePath()
    
    if (showFill && shape.color) {
      ctx.fillStyle = shape.color
      ctx.fill()
    }
    
    if (showStroke && shape.strokeColor) {
      ctx.strokeStyle = shape.strokeColor
      ctx.lineWidth = lineWidth
      ctx.stroke()
    }
  }, [showFill, showStroke, lineWidth])

  // Main animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    
    // Apply animation transformations if enabled
    if (animationEnabled) {
      const elapsed = (Date.now() - startTimeRef.current) * 0.001 * animationSpeed
      ctx.save()
      ctx.translate(width / 2, height / 2)
      ctx.rotate(elapsed * 0.1)
      ctx.translate(-width / 2, -height / 2)
    }
    
    // Generate and draw tiling
    const shapes = generateTiling(tilingType, width, height, scale)
    shapes.forEach(shape => drawShape(ctx, shape))
    
    if (animationEnabled) {
      ctx.restore()
    }
    
    animationRef.current = requestAnimationFrame(animate)
  }, [width, height, tilingType, scale, animationEnabled, animationSpeed, generateTiling, drawShape])

  // Initialize animation
  useEffect(() => {
    startTimeRef.current = Date.now()
    animate()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        maxWidth: `${width}px`,
        maxHeight: `${height}px`,
      }}
    />
  )
}

export default GeometricTilingsGenerator