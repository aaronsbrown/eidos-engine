import type React from "react"
import type { RichPatternControlDefinition, RichPatternGeneratorDefinition } from "@/lib/semantic-types"

// AIDEV-NOTE: Basic types maintained for backward compatibility during migration
export interface PatternControl {
  id: string
  label: string
  type: 'range' | 'color' | 'checkbox' | 'select' | 'button'
  min?: number
  max?: number
  step?: number
  defaultValue: number | string | boolean
  options?: { value: string | number; label: string }[]
}

export interface PatternGeneratorProps {
  width: number
  height: number
  className?: string
  controls?: PatternControl[]
  controlValues?: Record<string, number | string | boolean>
  onControlChange?: (controlId: string, value: number | string | boolean) => void
}

// AIDEV-NOTE: Extended to support semantic metadata while maintaining compatibility
export interface PatternGenerator {
  id: string
  name: string
  component: React.ComponentType<PatternGeneratorProps>
  controls?: PatternControl[]
  technology: 'WEBGL_2.0' | 'CANVAS_2D'
  category: 'Noise' | 'Geometric' | 'Simulation' | 'Data Visualization' | 'Attractors'
}

// Export semantic types for patterns that have been migrated
export type SemanticPatternGenerator = RichPatternGeneratorDefinition
export type SemanticPatternControl = RichPatternControlDefinition

// Helper type for gradual migration
export type MixedPatternGenerator = PatternGenerator | SemanticPatternGenerator
