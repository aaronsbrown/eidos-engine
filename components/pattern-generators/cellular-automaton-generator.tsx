"use client"

import { useEffect, useRef, useMemo, useState } from "react"
import type { PatternGeneratorProps } from "./types"

interface CellularAutomatonControls {
  rulePrev: boolean
  ruleNext: boolean
  cellSize: number
  animationSpeed: number
  resetTrigger: number
  initialCondition: 'single' | 'random' | 'center'
}

export default function CellularAutomatonGenerator({
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
  const cellsRef = useRef<number[]>([])
  const historyRef = useRef<number[][]>([])

  // Internal rule state
  const [rule, setRule] = useState(30)

  // Use passed control values or defaults
  const controls: CellularAutomatonControls = useMemo(() => ({
    rulePrev: (controlValues?.rulePrev as boolean) ?? false,
    ruleNext: (controlValues?.ruleNext as boolean) ?? false,
    cellSize: (controlValues?.cellSize as number) ?? 2,
    animationSpeed: (controlValues?.animationSpeed as number) ?? 0.1,
    resetTrigger: (controlValues?.resetTrigger as number) ?? 0,
    initialCondition: (controlValues?.initialCondition as 'single' | 'random' | 'center') ?? 'single'
  }), [controlValues])

  // Generate lookup table for 1D CELLULAR AUTOMATA rule
  const getRuleLookup = (rule: number): boolean[] => {
    const lookup: boolean[] = new Array(8)
    for (let i = 0; i < 8; i++) {
      lookup[i] = (rule & (1 << i)) !== 0
    }
    return lookup
  }

  // Initialize 1D CELLULAR AUTOMATA
  const initializeCells = (cellCount: number, condition: 'single' | 'random' | 'center'): number[] => {
    const cells = new Array(cellCount).fill(0)

    switch (condition) {
      case 'single':
        cells[0] = 1 // Single cell at left
        break
      case 'center':
        cells[Math.floor(cellCount / 2)] = 1 // Single cell at center
        break
      case 'random':
        for (let i = 0; i < cellCount; i++) {
          cells[i] = Math.random() < 0.1 ? 1 : 0 // 10% chance of being alive
        }
        break
    }

    return cells
  }

  // Apply 1D CELLULAR AUTOMATA rule to get next generation
  const applyRule = (cells: number[], ruleLookup: boolean[]): number[] => {
    const newCells = new Array(cells.length).fill(0)

    for (let i = 0; i < cells.length; i++) {
      // Get left, center, right neighbors (wrap around edges)
      const left = cells[(i - 1 + cells.length) % cells.length]
      const center = cells[i]
      const right = cells[(i + 1) % cells.length]

      // Convert to binary index (left=4, center=2, right=1)
      const index = left * 4 + center * 2 + right

      // Apply rule
      newCells[i] = ruleLookup[index] ? 1 : 0
    }

    return newCells
  }

  // Handle button presses from control panel
  useEffect(() => {
    if (controls.rulePrev && rule > 0) {
      const newRule = rule - 1
      setRule(newRule)
      onControlChange?.('rule', newRule) // Update parent with new rule
      onControlChange?.('rulePrev', false) // Reset button state
    }
  }, [controls.rulePrev, rule, onControlChange])

  useEffect(() => {
    if (controls.ruleNext && rule < 255) {
      const newRule = rule + 1
      setRule(newRule)
      onControlChange?.('rule', newRule) // Update parent with new rule
      onControlChange?.('ruleNext', false) // Reset button state
    }
  }, [controls.ruleNext, rule, onControlChange])

  // AIDEV-NOTE: Initialize rule state in parent on mount only once to avoid infinite loops
  useEffect(() => {
    onControlChange?.('rule', rule)
  }, [])  // Empty dependency array - only run on mount

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = width
    canvas.height = height

    // Calculate grid dimensions
    const cellSize = controls.cellSize
    const cellsPerRow = Math.floor(width / cellSize)
    const maxGenerations = Math.floor(height / cellSize)

    // Initialize or reset when rule changes or reset is triggered
    const resetAutomaton = () => {
      cellsRef.current = initializeCells(cellsPerRow, controls.initialCondition)
      historyRef.current = [cellsRef.current.slice()]
      generationRef.current = 0
      timeRef.current = 0
    }

    // Reset when rule changes or reset is triggered
    resetAutomaton()

    const ruleLookup = getRuleLookup(rule)

    const animate = () => {
      timeRef.current += controls.animationSpeed

      // Only advance generation when enough time has passed
      if (timeRef.current >= 1.0 && generationRef.current < maxGenerations - 1) {
        timeRef.current = 0
        generationRef.current++

        // Generate next generation
        const nextCells = applyRule(cellsRef.current, ruleLookup)
        cellsRef.current = nextCells
        historyRef.current.push(nextCells.slice())

        // Keep history from growing too large
        if (historyRef.current.length > maxGenerations) {
          historyRef.current.shift()
        }
      }

      // Clear canvas with dark background
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, width, height)

      // Draw all generations from history
      for (let gen = 0; gen < historyRef.current.length; gen++) {
        const generation = historyRef.current[gen]
        const y = gen * cellSize

        for (let x = 0; x < generation.length; x++) {
          if (generation[x] === 1) {
            // Alive cells - bright yellow
            ctx.fillStyle = '#FACC15'
            ctx.fillRect(x * cellSize, y, cellSize, cellSize)
          }
        }
      }

      // Add grid lines for better visibility
      ctx.strokeStyle = '#1a1a1a'
      ctx.lineWidth = 0.5

      // Vertical lines
      for (let x = 0; x <= cellsPerRow; x++) {
        ctx.beginPath()
        ctx.moveTo(x * cellSize, 0)
        ctx.lineTo(x * cellSize, Math.min(historyRef.current.length * cellSize, height))
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = 0; y <= Math.min(historyRef.current.length, maxGenerations); y++) {
        ctx.beginPath()
        ctx.moveTo(0, y * cellSize)
        ctx.lineTo(cellsPerRow * cellSize, y * cellSize)
        ctx.stroke()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [width, height, controls, rule])

  return (
    <div className={className}>
      {/* Canvas Container */}
      <div
        className="overflow-hidden relative border border-yellow-500/20"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <canvas ref={canvasRef} className="w-full h-full" />

        {/* Rule indicator overlay */}
        <div className="absolute top-2 left-2 text-yellow-500 text-xs font-mono bg-black/80 px-2 py-1 rounded">
          RULE {rule}
        </div>
      </div>
    </div>
  )
}