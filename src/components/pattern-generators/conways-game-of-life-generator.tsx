"use client"

import { useEffect, useRef, useMemo, useState, useCallback } from "react"
import { Play, Edit3, HelpCircle, X } from "lucide-react"
import type { PatternGeneratorProps } from "./types"

interface GameOfLifeControls {
  speed: number
  density: number
  resetTrigger: number
}

export default function ConwaysGameOfLifeGenerator({
  width,
  height,
  className = "",
  controlValues,
  onControlChange
}: PatternGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const timeRef = useRef<number>(0)
  const generationRef = useRef<number>(0)
  const gridRef = useRef<number[][]>([])
  const nextGridRef = useRef<number[][]>([])
  const cellSizeRef = useRef<number>(4)
  const gridWidthRef = useRef<number>(0)
  const gridHeightRef = useRef<number>(0)
  const isDrawingRef = useRef<boolean>(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isDrawingMode, setIsDrawingMode] = useState(true)
  const [showHint, setShowHint] = useState(false)

  // Use passed control values or defaults
  const controls: GameOfLifeControls = useMemo(() => ({
    speed: (controlValues?.speed as number) ?? 3.0,
    density: (controlValues?.density as number) ?? 0.15,
    resetTrigger: (controlValues?.resetTrigger as number) ?? 0
  }), [controlValues])

  // AIDEV-NOTE: Conway's Game of Life rules - B3/S23 (Birth with 3 neighbors, Survival with 2-3 neighbors)
  const countNeighbors = useCallback((grid: number[][], x: number, y: number): number => {
    let count = 0
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue
        const nx = (x + dx + gridWidthRef.current) % gridWidthRef.current
        const ny = (y + dy + gridHeightRef.current) % gridHeightRef.current
        count += grid[ny][nx]
      }
    }
    return count
  }, [])

  // Apply Conway's Game of Life rules
  const applyGameOfLifeRules = useCallback((currentGrid: number[][], nextGrid: number[][]) => {
    for (let y = 0; y < gridHeightRef.current; y++) {
      for (let x = 0; x < gridWidthRef.current; x++) {
        const neighbors = countNeighbors(currentGrid, x, y)
        const isAlive = currentGrid[y][x] === 1

        // Conway's rules: B3/S23
        if (isAlive) {
          // Survival: 2 or 3 neighbors
          nextGrid[y][x] = (neighbors === 2 || neighbors === 3) ? 1 : 0
        } else {
          // Birth: exactly 3 neighbors
          nextGrid[y][x] = neighbors === 3 ? 1 : 0
        }
      }
    }
  }, [countNeighbors])

  // Initialize grid with random pattern
  const initializeGrid = useCallback((density: number = 0.15) => {
    const newGrid = Array(gridHeightRef.current).fill(null).map(() => 
      Array(gridWidthRef.current).fill(0)
    )
    
    // Random initialization
    for (let y = 0; y < gridHeightRef.current; y++) {
      for (let x = 0; x < gridWidthRef.current; x++) {
        newGrid[y][x] = Math.random() < density ? 1 : 0
      }
    }
    
    return newGrid
  }, [])

  // Handle canvas click for drawing mode
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((event.clientX - rect.left) / cellSizeRef.current)
    const y = Math.floor((event.clientY - rect.top) / cellSizeRef.current)
    
    if (x >= 0 && x < gridWidthRef.current && y >= 0 && y < gridHeightRef.current) {
      gridRef.current[y][x] = gridRef.current[y][x] === 1 ? 0 : 1
    }
  }, [isDrawingMode])

  // Handle mouse drag for drawing
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode || !isDrawingRef.current) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((event.clientX - rect.left) / cellSizeRef.current)
    const y = Math.floor((event.clientY - rect.top) / cellSizeRef.current)
    
    if (x >= 0 && x < gridWidthRef.current && y >= 0 && y < gridHeightRef.current) {
      gridRef.current[y][x] = 1 // Paint cells when dragging
    }
  }, [isDrawingMode])

  const handleMouseDown = useCallback(() => {
    if (isDrawingMode) {
      isDrawingRef.current = true
    }
  }, [isDrawingMode])

  const handleMouseUp = useCallback(() => {
    isDrawingRef.current = false
  }, [])

  // Toggle between play and drawing modes
  const toggleMode = useCallback(() => {
    setIsDrawingMode(!isDrawingMode)
    setIsPlaying(!isPlaying)
  }, [isDrawingMode, isPlaying])

  // Randomize grid with current density
  const randomizeGrid = useCallback(() => {
    gridRef.current = initializeGrid(controls.density)
    nextGridRef.current = Array(gridHeightRef.current).fill(null).map(() => 
      Array(gridWidthRef.current).fill(0)
    )
    generationRef.current = 0
    timeRef.current = 0
  }, [controls.density, initializeGrid])

  // Clear grid (all cells dead)
  const clearGrid = useCallback(() => {
    gridRef.current = Array(gridHeightRef.current).fill(null).map(() => 
      Array(gridWidthRef.current).fill(0)
    )
    nextGridRef.current = Array(gridHeightRef.current).fill(null).map(() => 
      Array(gridWidthRef.current).fill(0)
    )
    generationRef.current = 0
    timeRef.current = 0
  }, [])

  // AIDEV-NOTE: Dynamic grid sizing based on viewport with platform-specific cell sizes
  useEffect(() => {
    // Platform-specific cell sizes for optimal experience
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    cellSizeRef.current = isMobile ? 8 : 4
    
    // Calculate grid dimensions to fit viewport
    gridWidthRef.current = Math.floor(width / cellSizeRef.current)
    gridHeightRef.current = Math.floor(height / cellSizeRef.current)
    
    // Initialize grids
    randomizeGrid()
  }, [width, height, randomizeGrid])

  // Handle reset trigger from controls
  useEffect(() => {
    if (controls.resetTrigger > 0) {
      randomizeGrid()
      onControlChange?.('resetTrigger', 0) // Reset trigger
    }
  }, [controls.resetTrigger, randomizeGrid, onControlChange])

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = width
    canvas.height = height

    const animate = () => {
      // Only advance generation when playing
      if (isPlaying) {
        timeRef.current += 1
        const stepsPerSecond = controls.speed
        const frameInterval = 60 / stepsPerSecond // 60fps target

        if (timeRef.current >= frameInterval) {
          timeRef.current = 0
          generationRef.current++
          
          // Apply Game of Life rules
          applyGameOfLifeRules(gridRef.current, nextGridRef.current)
          
          // Swap grids
          const temp = gridRef.current
          gridRef.current = nextGridRef.current
          nextGridRef.current = temp
        }
      }

      // Clear canvas with dark background
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, width, height)

      // Draw grid
      const cellSize = cellSizeRef.current
      for (let y = 0; y < gridHeightRef.current; y++) {
        for (let x = 0; x < gridWidthRef.current; x++) {
          if (gridRef.current[y][x] === 1) {
            // Live cells - bright yellow
            ctx.fillStyle = '#FACC15'
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
          }
        }
      }

      // Add subtle grid lines in drawing mode
      if (isDrawingMode && cellSize >= 4) {
        ctx.strokeStyle = '#1a1a1a'
        ctx.lineWidth = 0.5
        
        // Draw grid lines
        for (let x = 0; x <= gridWidthRef.current; x++) {
          ctx.beginPath()
          ctx.moveTo(x * cellSize, 0)
          ctx.lineTo(x * cellSize, gridHeightRef.current * cellSize)
          ctx.stroke()
        }
        
        for (let y = 0; y <= gridHeightRef.current; y++) {
          ctx.beginPath()
          ctx.moveTo(0, y * cellSize)
          ctx.lineTo(gridWidthRef.current * cellSize, y * cellSize)
          ctx.stroke()
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
  }, [width, height, controls.speed, isPlaying, isDrawingMode, applyGameOfLifeRules])

  return (
    <div className={className}>
      {/* Canvas Container */}
      <div
        className="overflow-hidden relative border border-accent-primary/20"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <canvas 
          ref={canvasRef} 
          className="w-full h-full cursor-pointer"
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        {/* Generation Counter */}
        <div className="absolute top-2 left-2 text-accent-primary text-xs font-mono bg-background/80 border border-border px-2 py-1 rounded">
          GEN {generationRef.current}
        </div>

        {/* Button Group */}
        <div className="absolute top-2 right-2 flex gap-2">
          {/* Help Button */}
          <button
            onMouseEnter={() => setShowHint(true)}
            onMouseLeave={() => setShowHint(false)}
            className="bg-accent-primary hover:bg-accent-primary/80 border border-accent-primary p-2 rounded transition-colors"
            title="Drawing tips"
          >
            <HelpCircle className="w-4 h-4 text-background" />
          </button>

          {/* Mode Toggle Button */}
          <button
            onClick={toggleMode}
            className="bg-accent-primary hover:bg-accent-primary/80 border border-accent-primary p-2 rounded transition-colors"
            title={isDrawingMode ? "Start simulation" : "Enter drawing mode"}
          >
            {isDrawingMode ? (
              <Play className="w-4 h-4 text-background" />
            ) : (
              <Edit3 className="w-4 h-4 text-background" />
            )}
          </button>

          {/* Clear Button */}
          <button
            onClick={clearGrid}
            className="bg-accent-primary hover:bg-accent-primary/80 border border-accent-primary p-2 rounded transition-colors"
            title="Clear grid"
          >
            <X className="w-4 h-4 text-background" />
          </button>
        </div>

        {/* Help Tooltip */}
        {showHint && (
          <div className="absolute top-12 right-24 bg-background border border-border p-3 rounded text-xs font-mono max-w-xs">
            <p className="text-accent-primary mb-1">Drawing Tips:</p>
            <p>• Draw clusters of touching cells</p>
            <p>• Try an &apos;L&apos; or &apos;T&apos; shape</p>
            <p>• Make a small 2x2 square</p>
            <p>• Draw a straight line of 3-5 cells</p>
            <p>• Use clear to start fresh or controls to randomize</p>
          </div>
        )}

        {/* Mode Instructions */}
        <div className="absolute bottom-2 right-2 text-accent-primary text-xs font-mono bg-background border border-border px-2 py-1 rounded max-w-xs">
          {isDrawingMode ? 
            "Click/drag to toggle cells, then press play to start" : 
            "Simulation running - press edit to modify pattern"}
        </div>
      </div>
    </div>
  )
}