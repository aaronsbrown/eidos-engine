"use client"

import { useEffect, useRef, useMemo, useCallback } from "react"
import type { PatternGeneratorProps } from "./types"

interface QuadtreeControls {
  maxDepth: number
  coloringRule: 'depth' | 'grayscale' | 'circles'
  subdivisionPattern: 'uniform' | 'golden' | 'checkerboard' | 'spiral' | 'center'
}

interface QuadNode {
  x: number
  y: number
  width: number
  height: number
  depth: number
  subdivided: boolean
  children?: QuadNode[]
  color?: string
}

// AIDEV-NOTE: Simple noise function for coloring - avoids external dependencies
// Currently unused but kept for potential future noise-based coloring
// function simpleNoise(x: number, y: number): number {
//   const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
//   return (n - Math.floor(n))
// }

export default function QuadtreePattern({ 
  width, 
  height, 
  className = "",
  controlValues
}: PatternGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rootNodeRef = useRef<QuadNode | null>(null)

  // Use passed control values or defaults
  const controls: QuadtreeControls = useMemo(() => ({
    maxDepth: (controlValues?.maxDepth as number) ?? 4,
    coloringRule: (controlValues?.coloringRule as 'depth' | 'grayscale' | 'circles') ?? 'depth',
    subdivisionPattern: (controlValues?.subdivisionPattern as 'uniform' | 'golden' | 'checkerboard' | 'spiral' | 'center') ?? 'golden'
  }), [controlValues])

  // AIDEV-NOTE: Structured subdivision patterns for educational visualization
  const shouldSubdivideNode = useCallback((node: QuadNode): boolean => {
    if (node.depth >= controls.maxDepth) return false

    const centerX = node.x + node.width / 2
    const centerY = node.y + node.height / 2
    const canvasWidth = width
    const canvasHeight = height

    switch (controls.subdivisionPattern) {
      case 'uniform':
        return true // Always subdivide (original behavior)
      
      case 'golden':
        // Golden spiral with Y-axis mirroring for balance
        const phi = 1.618034 // Golden ratio
        const cx = canvasWidth / 2
        const cy = canvasHeight / 2
        const angle = Math.atan2(centerY - cy, centerX - cx)
        const radius = Math.sqrt((centerX - cx)**2 + (centerY - cy)**2)
        
        // Create spiral pattern using golden ratio
        const spiralValue = Math.sin(angle * phi + radius * 0.02) * 0.5 + 0.5
        
        // Mirror pattern: also check mirrored Y position for symmetry
        const mirroredY = canvasHeight - centerY
        const mirrorAngle = Math.atan2(mirroredY - cy, centerX - cx)
        const mirrorSpiralValue = Math.sin(mirrorAngle * phi + radius * 0.02) * 0.5 + 0.5
        
        // Combine original and mirrored patterns (inverted)
        const combinedValue = Math.max(spiralValue, 1 - mirrorSpiralValue)
        const depthThreshold = 0.3 + (node.depth / controls.maxDepth) * 0.5
        
        return combinedValue > depthThreshold
      
      case 'checkerboard':
        // Checkerboard pattern based on the node's position in the quadtree structure
        // Calculate which "quadrant" this node would be in at depth 2 (creates 4x4 grid)
        const rootSize = Math.max(canvasWidth, canvasHeight)
        const quadrantSize = rootSize / 4 // 4x4 grid
        
        const quadX = Math.floor(centerX / quadrantSize) 
        const quadY = Math.floor(centerY / quadrantSize)
        const isBlackSquare = (quadX + quadY) % 2 === 0
        
        // Black squares subdivide more, white squares subdivide less
        if (isBlackSquare) {
          return true // Full subdivision in black squares
        } else {
          return node.depth < Math.max(1, controls.maxDepth - 2) // Limited subdivision in white squares
        }
      
      case 'spiral':
        // Fibonacci spiral with Y-axis mirroring for balance
        const fibCx = canvasWidth / 2
        const fibCy = canvasHeight / 2
        const fibAngle = Math.atan2(centerY - fibCy, centerX - fibCx)
        const fibRadius = Math.sqrt((centerX - fibCx)**2 + (centerY - fibCy)**2)
        const fibMaxRadius = Math.sqrt(fibCx**2 + fibCy**2)
        
        // Original Fibonacci spiral
        const normalizedRadius = fibRadius / fibMaxRadius
        const fibSpiralValue = Math.sin(fibAngle * 2.4 + normalizedRadius * 8) * 0.5 + 0.5
        
        // Mirrored Fibonacci spiral (Y-axis flip + invert)
        const fibMirroredY = canvasHeight - centerY
        const fibMirrorAngle = Math.atan2(fibMirroredY - fibCy, centerX - fibCx)
        const fibMirrorSpiralValue = Math.sin(fibMirrorAngle * 2.4 + normalizedRadius * 8) * 0.5 + 0.5
        
        // Combine patterns for symmetry
        const fibCombinedValue = Math.max(fibSpiralValue, 1 - fibMirrorSpiralValue)
        const fibDepthThreshold = 0.2 + (node.depth / controls.maxDepth) * 0.6
        
        return fibCombinedValue > fibDepthThreshold
      
      case 'center':
        // Distance from center - subdivide closer to center more
        const distFromCenter = Math.sqrt((centerX - canvasWidth/2)**2 + (centerY - canvasHeight/2)**2)
        const maxDist = Math.sqrt((canvasWidth/2)**2 + (canvasHeight/2)**2)
        const centerBias = 1 - (distFromCenter / maxDist)
        return centerBias > (node.depth / controls.maxDepth) * 0.6 + 0.2
      
      default:
        return true
    }
  }, [controls.maxDepth, controls.subdivisionPattern, width, height])

  const subdivideNode = useCallback((node: QuadNode): void => {
    if (node.subdivided || !shouldSubdivideNode(node)) return

    const halfWidth = node.width / 2
    const halfHeight = node.height / 2
    node.subdivided = true
    node.children = [
      { x: node.x, y: node.y, width: halfWidth, height: halfHeight, depth: node.depth + 1, subdivided: false },
      { x: node.x + halfWidth, y: node.y, width: halfWidth, height: halfHeight, depth: node.depth + 1, subdivided: false },
      { x: node.x, y: node.y + halfHeight, width: halfWidth, height: halfHeight, depth: node.depth + 1, subdivided: false },
      { x: node.x + halfWidth, y: node.y + halfHeight, width: halfWidth, height: halfHeight, depth: node.depth + 1, subdivided: false }
    ]

    // Recursively subdivide children
    node.children.forEach(child => subdivideNode(child))
  }, [shouldSubdivideNode])

  // AIDEV-NOTE: Educational color system using design tokens for clear depth visualization
  const getNodeColor = useCallback((node: QuadNode): string => {
    switch (controls.coloringRule) {
      case 'depth':
        // Use design system chart colors for clear depth progression
        const colors = [
          'oklch(0.984 0.003 247.858)', // background - lightest
          'oklch(0.968 0.007 247.896)', // secondary
          'oklch(0.929 0.013 255.508)', // border  
          'oklch(0.704 0.04 256.788)',  // ring
          'oklch(0.554 0.046 257.417)', // muted-foreground
          'oklch(0.398 0.07 227.392)',  // chart-3 - blue
          'oklch(0.208 0.042 265.755)', // primary - darkest
          'oklch(0.129 0.042 264.695)'  // foreground - deepest
        ]
        return colors[Math.min(node.depth, colors.length - 1)]
      
      case 'grayscale':
        // Simple grayscale progression
        const intensity = 255 - (node.depth / controls.maxDepth) * 180
        return `rgb(${intensity}, ${intensity}, ${intensity})`
      
      default:
        return 'oklch(0.984 0.003 247.858)' // background color
    }
  }, [controls.coloringRule, controls.maxDepth])

  // AIDEV-NOTE: Recursive rendering function - traverses quadtree and draws nodes
  const renderNode = useCallback((ctx: CanvasRenderingContext2D, node: QuadNode): void => {
    if (node.subdivided && node.children) {
      // Render children if subdivided
      node.children.forEach(child => renderNode(ctx, child))
    } else {
      // Render leaf node
      if (controls.coloringRule === 'circles') {
        // Draw decorative half-circles like the reference image
        const centerX = node.x + node.width / 2
        const centerY = node.y + node.height / 2
        const radius = Math.min(node.width, node.height) / 2
        
        // Fill background (alternating black/white based on position)
        const bgColor = ((Math.floor(node.x / 50) + Math.floor(node.y / 50)) % 2 === 0) ? '#000000' : '#ffffff'
        const circleColor = bgColor === '#000000' ? '#ffffff' : '#000000'
        
        ctx.fillStyle = bgColor
        ctx.fillRect(node.x, node.y, node.width, node.height)
        
        // Draw half-circles in random orientations
        ctx.fillStyle = circleColor
        ctx.beginPath()
        
        // Random orientation for variety (like the reference)
        const orientation = Math.floor((node.x + node.y) * 0.01) % 4
        switch (orientation) {
          case 0: // Top half
            ctx.arc(centerX, node.y, radius, 0, Math.PI, false)
            break
          case 1: // Right half  
            ctx.arc(node.x + node.width, centerY, radius, Math.PI/2, 3*Math.PI/2, false)
            break
          case 2: // Bottom half
            ctx.arc(centerX, node.y + node.height, radius, Math.PI, 2*Math.PI, false)
            break
          case 3: // Left half
            ctx.arc(node.x, centerY, radius, -Math.PI/2, Math.PI/2, false)
            break
        }
        ctx.fill()
      } else {
        // Standard solid color fill
        if (!node.color) {
          node.color = getNodeColor(node)
        }
        
        ctx.fillStyle = node.color
        ctx.fillRect(node.x, node.y, node.width, node.height)
      }
    }

    // Draw subdivision lines (thinner for circles mode)
    ctx.strokeStyle = 'oklch(0.129 0.042 264.695)' // foreground color
    ctx.lineWidth = controls.coloringRule === 'circles' ? 0.5 : 0.25
    ctx.strokeRect(node.x, node.y, node.width, node.height)
  }, [getNodeColor, controls.coloringRule])

  // Generate new quadtree
  const generateQuadtree = useCallback(() => {
    // Create square quadtree using full height, centered horizontally
    const size = height // Use full canvas height
    const offsetX = (width - size) / 2 // Center horizontally
    const offsetY = 0 // No vertical padding
    
    rootNodeRef.current = {
      x: offsetX,
      y: offsetY,
      width: size,
      height: size,
      depth: 0,
      subdivided: false
    }

    subdivideNode(rootNodeRef.current)
  }, [width, height, subdivideNode])


  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = width
    canvas.height = height

    // Generate and render quadtree once
    generateQuadtree()
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    
    // Fill background with dark interface color
    ctx.fillStyle = 'oklch(0.129 0.042 264.695)' // Same as interface dark blue
    ctx.fillRect(0, 0, width, height)

    // Render quadtree
    if (rootNodeRef.current) {
      renderNode(ctx, rootNodeRef.current)
    }
  }, [width, height, controls, generateQuadtree, renderNode])

  return (
    <div className={className}>
      <div
        className="overflow-hidden relative"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
          style={{ imageRendering: "crisp-edges" }}
        />
      </div>
    </div>
  )
}