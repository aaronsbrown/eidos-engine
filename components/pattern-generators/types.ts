import type React from "react"

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

export interface PatternGenerator {
  id: string
  name: string
  component: React.ComponentType<PatternGeneratorProps>
  controls?: PatternControl[]
  technology: 'WEBGL_2.0' | 'CANVAS_2D'
}
