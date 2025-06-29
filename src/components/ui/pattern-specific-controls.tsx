// AIDEV-NOTE: Extracted pattern-specific control components from grouped-simulation-controls-panel.tsx
// This module contains specialized control group components for specific patterns

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from './button'
import CompactColorPicker from './compact-color-picker'
import type { PatternControl } from '@/components/pattern-generators/types'

// AIDEV-NOTE: Special component for four-pole gradient color pickers with 2x2 layout
interface FourPoleColorGroupProps {
  title: string
  controls: PatternControl[]
  controlValues: Record<string, number | string | boolean>
  onControlChange: (controlId: string, value: number | string | boolean) => void
  defaultCollapsed?: boolean
}

export function FourPoleColorGroup({
  title,
  controls,
  controlValues,
  onControlChange,
  defaultCollapsed = false
}: FourPoleColorGroupProps) {
  const [isExpanded, setIsExpanded] = useState(!defaultCollapsed)
  const controlsId = `${title.replace(/\s+/g, '-').toLowerCase()}-controls`
  const titleId = `${title.replace(/\s+/g, '-').toLowerCase()}-title`

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden" data-testid={`group-${title.replace(/\s+/g, '-').toLowerCase()}`}>
      <button
        id={titleId}
        onClick={toggleExpanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggleExpanded()
          }
        }}
        className="w-full flex items-center justify-between p-3 bg-background/50 hover:bg-background/70 transition-colors focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-inset"
        aria-expanded={isExpanded}
        aria-controls={controlsId}
      >
        <h3 className="font-mono text-sm font-semibold uppercase tracking-wide text-foreground">
          {title}
        </h3>
        <ChevronDown 
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>
      
      <div 
        className="transition-all duration-200 ease-in-out overflow-hidden"
        style={{
          height: isExpanded ? 'auto' : '0',
          opacity: isExpanded ? 1 : 0
        }}
      >
        {isExpanded && (
          <div 
            id={controlsId}
            role="region"
            aria-labelledby={titleId}
            aria-label={`${title} controls`}
            className="p-4 bg-background"
          >
            {/* 2x2 Grid for color pickers */}
            <div className="grid grid-cols-2 gap-3">
              {controls.map((control) => {
                const value = controlValues[control.id] ?? control.defaultValue
                return (
                  <CompactColorPicker
                    key={control.id}
                    value={value as string}
                    onChange={(color) => onControlChange(control.id, color)}
                    label={control.label}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// AIDEV-NOTE: Special component for cellular automaton rule navigation with prev/next buttons
interface CellularAutomatonNavigationGroupProps {
  title: string
  controls: PatternControl[]
  controlValues: Record<string, number | string | boolean>
  onControlChange: (controlId: string, value: number | string | boolean) => void
  defaultCollapsed?: boolean
}

export function CellularAutomatonNavigationGroup({
  title,
  controls,
  controlValues,
  onControlChange,
  defaultCollapsed = false
}: CellularAutomatonNavigationGroupProps) {
  const [isExpanded, setIsExpanded] = useState(!defaultCollapsed)
  const controlsId = `${title.replace(/\s+/g, '-').toLowerCase()}-controls`
  const titleId = `${title.replace(/\s+/g, '-').toLowerCase()}-title`

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  // Find navigation buttons and current rule value
  const prevButton = controls.find(c => c.id === 'rulePrev')
  const nextButton = controls.find(c => c.id === 'ruleNext')
  const currentRule = controlValues['rule'] ?? 30

  return (
    <div className="border border-border rounded-lg overflow-hidden" data-testid={`group-${title.replace(/\s+/g, '-').toLowerCase()}`}>
      <button
        id={titleId}
        onClick={toggleExpanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggleExpanded()
          }
        }}
        className="w-full flex items-center justify-between p-3 bg-background/50 hover:bg-background/70 transition-colors focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-inset"
        aria-expanded={isExpanded}
        aria-controls={controlsId}
      >
        <h3 className="font-mono text-sm font-semibold uppercase tracking-wide text-foreground">
          {title}
        </h3>
        <ChevronDown 
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>
      
      <div 
        className="transition-all duration-200 ease-in-out overflow-hidden"
        style={{
          height: isExpanded ? 'auto' : '0',
          opacity: isExpanded ? 1 : 0
        }}
      >
        {isExpanded && (
          <div 
            id={controlsId}
            role="region"
            aria-labelledby={titleId}
            aria-label={`${title} controls`}
            className="p-4 bg-background"
          >
            {/* Rule Navigation Layout */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Rule Number
              </div>
              <div className="flex items-center space-x-6">
                {prevButton && (
                  <Button
                    onClick={() => {
                      onControlChange(prevButton.id, true)
                      setTimeout(() => onControlChange(prevButton.id, false), 100)
                    }}
                    variant="outline"
                    size="sm"
                    className="font-mono text-xs"
                  >
                    {prevButton.label}
                  </Button>
                )}
                <div className="text-xs font-mono text-muted-foreground border border-border bg-background px-3 py-2">
                  {currentRule.toString().padStart(3, '0')} / 255
                </div>
                {nextButton && (
                  <Button
                    onClick={() => {
                      onControlChange(nextButton.id, true)
                      setTimeout(() => onControlChange(nextButton.id, false), 100)
                    }}
                    variant="outline"
                    size="sm"
                    className="font-mono text-xs"
                  >
                    {nextButton.label}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}