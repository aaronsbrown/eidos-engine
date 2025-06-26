// AIDEV-NOTE: Progressive disclosure panel for mobile control layout with pattern-specific preservation
// AIDEV-NOTE: Tests rewritten per G-8 to focus on user behavior vs implementation details
'use client'

import React, { useState, useMemo, memo } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
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
  // Educational content props
  hasEducationalContent?: boolean
  isEducationalVisible?: boolean
  onEducationalToggle?: () => void
}

const ProgressiveDisclosurePanel = memo(function ProgressiveDisclosurePanel({
  patternId,
  controls,
  controlValues,
  onControlChange,
  isExpanded = false,
  onToggleExpanded,
  className = '',
  hasEducationalContent = false,
  isEducationalVisible = false,
  onEducationalToggle
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
    // Safety check for undefined controls
    if (!controls || !Array.isArray(controls)) {
      return []
    }

    const essentialIds = new Set(mobileLayout.essentialControls.map(c => c.id))
    const ungroupedIds = new Set(mobileLayout.ungroupedControls.map(c => c.id))
    
    return controls.filter(control => 
      !essentialIds.has(control.id) && !ungroupedIds.has(control.id)
    )
  }, [controls, mobileLayout.essentialControls, mobileLayout.ungroupedControls])


  return (
    <div
      data-testid="progressive-disclosure-panel"
      className={`bg-background ${mobileLayout.spacing.padding} ${className}`}
      aria-label="Pattern controls"
    >
      {/* Essential Controls - Always Visible */}
      <div data-testid="essential-controls-area">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent-primary"></div>
            <h3 className="mobile-typography-label md:text-sm text-muted-foreground">
              Quick Controls
            </h3>
          </div>
          
          {/* Educational Content Button - Mobile */}
          {hasEducationalContent && onEducationalToggle && (
            <button
              onClick={onEducationalToggle}
              className={`border border-border px-3 py-2 font-mono text-xs transition-colors ${
                isEducationalVisible 
                  ? "bg-background text-foreground hover:bg-muted" 
                  : "bg-accent-primary text-accent-primary-foreground hover:bg-accent-primary-strong"
              }`}
            >
              {isEducationalVisible ? '📚 HIDE' : '🎓 LEARN'}
            </button>
          )}
        </div>
        
        {mobileLayout.essentialControls.length > 0 ? (
          <GroupedSimulationControlsPanel
            patternId={patternId}
            controls={mobileLayout.essentialControls}
            controlValues={controlValues}
            onControlChange={onControlChange}
            sidebarWidth={viewport.width}
          />
        ) : (
          <div className="mobile-typography-small md:text-xs text-muted-foreground">
            No essential controls available
          </div>
        )}
      </div>

      {/* Advanced Controls Toggle */}
      {advancedControls.length > 0 && (
        <div 
          className="mt-6 -mx-4 border-t border-border cursor-pointer hover:bg-accent-primary-subtle dark:hover:bg-accent-primary-subtle transition-colors duration-200"
          data-testid={expanded ? 'collapse-advanced-controls' : 'expand-advanced-controls'}
          onClick={toggleExpanded}
          role="button"
          tabIndex={0}
          aria-expanded={expanded}
          aria-controls="advanced-controls-panel"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              toggleExpanded()
            }
          }}
        >
          <div className="px-4 py-3 flex items-center justify-between min-h-[44px]">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent-primary"></div>
              <span className="mobile-typography-label md:text-xs text-muted-foreground">
                {expanded ? 'Less Controls' : 'Advanced Controls'}
              </span>
            </div>
            {expanded ? (
              <ChevronUp data-testid="chevron-icon" className="h-4 w-4 transition-transform duration-200 text-muted-foreground" />
            ) : (
              <ChevronDown data-testid="chevron-icon" className="h-4 w-4 transition-transform duration-200 text-muted-foreground" />
            )}
          </div>
        </div>
      )}

      {/* Advanced Controls Panel - Accordion Drawer */}
      {advancedControls.length > 0 && (
        <div
          data-testid="advanced-controls-panel"
          className={`
            mt-4 overflow-hidden transition-all duration-300 ease-in-out
            ${expanded 
              ? 'max-h-[40vh] opacity-100' 
              : 'max-h-0 opacity-0'
            }
          `}
          role="region"
          aria-label="Advanced pattern controls"
          aria-hidden={!expanded}
        >
          <div 
            className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 max-h-[40vh]"
            style={{ 
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth'
            }}
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
        </div>
      )}

      {/* Ungrouped Controls - Always at Bottom */}
      {mobileLayout.ungroupedControls.length > 0 && (
        <div data-testid="ungrouped-controls" className="mt-6 pt-4 border-t border-border">
          <GroupedSimulationControlsPanel
            patternId={patternId}
            controls={mobileLayout.ungroupedControls}
            controlValues={controlValues}
            onControlChange={onControlChange}
            sidebarWidth={viewport.width}
          />
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