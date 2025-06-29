// AIDEV-NOTE: Extracted base control rendering from grouped-simulation-controls-panel.tsx
// This module provides the core control rendering logic for different control types

import React from 'react'
import CustomSelect from './custom-select'
import type { PatternControl } from '@/components/pattern-generators/types'

/**
 * Simple control renderer for ungrouped layout
 * Handles all standard control types: range, checkbox, select, color, button
 */
export function renderControl(
  control: PatternControl,
  controlValues: Record<string, number | string | boolean>,
  onControlChange: (controlId: string, value: number | string | boolean) => void
) {
  const value = controlValues[control.id] ?? control.defaultValue

  switch (control.type) {
    case 'range':
      return (
        <div key={control.id} className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor={control.id} className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              {control.label}
            </label>
            {/* AIDEV-NOTE: Issue #51 - Changed from text-accent-primary-strong to text-foreground for WCAG 2.1 AA compliance */}
            <span className="font-mono text-xs text-foreground">
              {typeof value === 'number' ? value.toFixed(2) : value}
            </span>
          </div>
          <input
            id={control.id}
            type="range"
            min={control.min}
            max={control.max}
            step={control.step}
            value={value as number}
            onChange={(e) => onControlChange(control.id, parseFloat(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer range-slider"
            style={{ background: 'var(--control-track)' }}
          />
        </div>
      )

    case 'checkbox':
      return (
        <div key={control.id} className="flex items-center space-x-2">
          <input
            id={control.id}
            type="checkbox"
            checked={value as boolean}
            onChange={(e) => onControlChange(control.id, e.target.checked)}
            className="rounded border-form text-accent-primary-strong focus:ring-accent-primary focus:ring-offset-0"
          />
          <label htmlFor={control.id} className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {control.label}
          </label>
        </div>
      )

    case 'select':
      return (
        <div key={control.id} className="space-y-2">
          <label htmlFor={control.id} className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {control.label}
          </label>
          <CustomSelect
            id={control.id}
            value={value as string}
            options={control.options || []}
            onChange={(newValue) => onControlChange(control.id, newValue)}
          />
        </div>
      )

    case 'color':
      return (
        <div key={control.id} className="space-y-2">
          <label htmlFor={control.id} className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {control.label}
          </label>
          <input
            id={control.id}
            type="color"
            value={value as string}
            onChange={(e) => onControlChange(control.id, e.target.value)}
            className="w-full h-8 border border-border rounded cursor-pointer"
          />
        </div>
      )

    case 'button':
      return (
        <button
          key={control.id}
          onClick={() => onControlChange(control.id, true)}
          className="w-full font-mono text-xs uppercase tracking-wide bg-accent-primary text-accent-primary-foreground hover:bg-accent-primary-strong px-3 py-2 rounded transition-colors"
        >
          {control.label}
        </button>
      )

    default:
      return null
  }
}

/**
 * Utility function to get grid classes based on sidebar width and mobile state
 * Provides responsive column layout for control grids
 */
export function getControlGridClasses(sidebarWidth: number, isMobile: boolean): string {
  if (isMobile) return 'grid-cols-1'
  
  if (sidebarWidth > 500) return 'grid-cols-3'
  if (sidebarWidth > 400) return 'grid-cols-2'
  return 'grid-cols-1'
}