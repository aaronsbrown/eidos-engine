// AIDEV-NOTE: Progressive disclosure panel for mobile control layout with pattern-specific preservation
'use client'

import React, { useState, useMemo, memo } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import GroupedSimulationControlsPanel from '@/components/ui/grouped-simulation-controls-panel'
import type { PatternControl } from '@/components/pattern-generators/types'
import { getMobileControlLayout } from '@/lib/mobile-utils'
import { useMobileDetection } from '@/components/hooks/useMobileDetection'

export interface ProgressiveDisclosurePanelProps {
  patternId: string
  controls: PatternControl[]
  controlValues: Record<string, number | string | boolean>
  onControlChange: (controlId: string, value: number | string | boolean) => void
  isExpanded?: boolean
  onToggleExpanded?: () => void
  className?: string
}

const ProgressiveDisclosurePanel = memo(function ProgressiveDisclosurePanel({
  patternId,
  controls,
  controlValues,
  onControlChange,
  isExpanded = false,
  onToggleExpanded,
  className = ''
}: ProgressiveDisclosurePanelProps) {
  const [internalExpanded, setInternalExpanded] = useState(false)
  const { viewport } = useMobileDetection()
  
  // Use internal state if no external control provided
  const expanded = onToggleExpanded ? isExpanded : internalExpanded
  const toggleExpanded = onToggleExpanded || (() => setInternalExpanded(!internalExpanded))

  // Calculate mobile layout configuration
  const mobileLayout = useMemo(() => 
    getMobileControlLayout(patternId, controls, viewport.width),
    [patternId, controls, viewport.width]
  )

  // Get advanced controls (all controls not in essential or ungrouped)
  const advancedControls = useMemo(() => {
    const essentialIds = new Set(mobileLayout.essentialControls.map(c => c.id))
    const ungroupedIds = new Set(mobileLayout.ungroupedControls.map(c => c.id))
    
    return controls.filter(control => 
      !essentialIds.has(control.id) && !ungroupedIds.has(control.id)
    )
  }, [controls, mobileLayout.essentialControls, mobileLayout.ungroupedControls])

  // Render individual control component
  const renderControl = (control: PatternControl) => {
    const value = controlValues[control.id] ?? control.defaultValue

    switch (control.type) {
      case 'range':
        return (
          <div key={control.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <label 
                htmlFor={`mobile-${control.id}`} 
                className="font-mono text-xs uppercase tracking-wide text-muted-foreground"
              >
                {control.label}
              </label>
              <span className="font-mono text-xs text-yellow-500">
                {typeof value === 'number' ? value.toFixed(2) : value}
              </span>
            </div>
            <input
              id={`mobile-${control.id}`}
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={value as number}
              onChange={(e) => onControlChange(control.id, parseFloat(e.target.value))}
              className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 range-slider ${mobileLayout.spacing.touchTarget}`}
              aria-label={`${control.label}: ${value}`}
            />
          </div>
        )

      case 'color':
        return (
          <div key={control.id} className="space-y-2">
            <label 
              htmlFor={`mobile-${control.id}`} 
              className="font-mono text-xs uppercase tracking-wide text-muted-foreground block"
            >
              {control.label}
            </label>
            <input
              id={`mobile-${control.id}`}
              type="color"
              value={value as string}
              onChange={(e) => onControlChange(control.id, e.target.value)}
              className={`w-full border border-border rounded cursor-pointer ${mobileLayout.spacing.touchTarget}`}
              aria-label={`${control.label}: ${value}`}
            />
          </div>
        )

      case 'checkbox':
        return (
          <div key={control.id} className="flex items-center space-x-3">
            <input
              id={`mobile-${control.id}`}
              type="checkbox"
              checked={value as boolean}
              onChange={(e) => onControlChange(control.id, e.target.checked)}
              className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0 w-5 h-5"
              aria-label={control.label}
            />
            <label 
              htmlFor={`mobile-${control.id}`} 
              className="font-mono text-xs uppercase tracking-wide text-muted-foreground flex-1"
            >
              {control.label}
            </label>
          </div>
        )

      case 'select':
        return (
          <div key={control.id} className="space-y-2">
            <label 
              htmlFor={`mobile-${control.id}`} 
              className="font-mono text-xs uppercase tracking-wide text-muted-foreground block"
            >
              {control.label}
            </label>
            <select
              id={`mobile-${control.id}`}
              value={value as string}
              onChange={(e) => onControlChange(control.id, e.target.value)}
              className={`w-full font-mono text-xs bg-background border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${mobileLayout.spacing.touchTarget}`}
              aria-label={control.label}
            >
              {control.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )

      case 'button':
        return (
          <Button
            key={control.id}
            onClick={() => onControlChange(control.id, true)}
            className={`w-full font-mono text-xs uppercase tracking-wide bg-yellow-500 text-black hover:bg-yellow-400 transition-colors ${mobileLayout.spacing.touchTarget}`}
            aria-label={control.label}
          >
            {control.label}
          </Button>
        )

      default:
        return null
    }
  }

  return (
    <div
      data-testid="progressive-disclosure-panel"
      className={`bg-background ${mobileLayout.spacing.padding} ${className}`}
      aria-label="Pattern controls"
    >
      {/* Essential Controls - Always Visible */}
      <div data-testid="essential-controls-area">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-yellow-400"></div>
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
            Quick Controls
          </h3>
        </div>
        
        {mobileLayout.essentialControls.length > 0 ? (
          <div 
            className={`grid ${mobileLayout.spacing.gap} ${
              mobileLayout.gridColumns === 1 ? 'grid-cols-1' :
              mobileLayout.gridColumns === 2 ? 'grid-cols-2' :
              'grid-cols-3'
            }`}
          >
            {mobileLayout.essentialControls.map(renderControl)}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground font-mono">
            No essential controls available
          </div>
        )}
      </div>

      {/* Advanced Controls Toggle */}
      {advancedControls.length > 0 && (
        <div className="mt-6">
          <Button
            data-testid={expanded ? 'collapse-advanced-controls' : 'expand-advanced-controls'}
            onClick={toggleExpanded}
            variant="outline"
            className="w-full font-mono text-xs border-border hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950/20 min-h-[44px] flex items-center justify-center space-x-2"
            aria-expanded={expanded}
            aria-controls="advanced-controls-panel"
          >
            <span>{expanded ? 'Less Controls' : 'Advanced Controls'}</span>
            {expanded ? (
              <ChevronUp data-testid="chevron-icon" className="h-4 w-4 transition-transform duration-200 rotate-180" />
            ) : (
              <ChevronDown data-testid="chevron-icon" className="h-4 w-4 transition-transform duration-200 rotate-0" />
            )}
          </Button>
        </div>
      )}

      {/* Advanced Controls Panel - Expandable */}
      {expanded && advancedControls.length > 0 && (
        <div
          data-testid="advanced-controls-panel"
          className="mt-4 max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 transition-all duration-300 ease-in-out"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth'
          }}
          role="region"
          aria-label="Advanced pattern controls"
        >
          {/* Use existing grouped controls component for advanced controls */}
          <GroupedSimulationControlsPanel
            patternId={patternId}
            controls={advancedControls}
            controlValues={controlValues}
            onControlChange={onControlChange}
            sidebarWidth={viewport.width}
          />
        </div>
      )}

      {/* Ungrouped Controls - Always at Bottom */}
      {mobileLayout.ungroupedControls.length > 0 && (
        <div data-testid="ungrouped-controls" className="mt-6 pt-4 border-t border-border">
          <div 
            className={`grid ${mobileLayout.spacing.gap} ${
              mobileLayout.gridColumns === 1 ? 'grid-cols-1' :
              mobileLayout.gridColumns === 2 ? 'grid-cols-2' :
              'grid-cols-3'
            }`}
          >
            {mobileLayout.ungroupedControls.map(renderControl)}
          </div>
        </div>
      )}

      {/* Live Region for Screen Reader Announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        data-testid="control-announcements"
      >
        {/* This will be populated by control change events */}
      </div>
    </div>
  )
})

export default ProgressiveDisclosurePanel