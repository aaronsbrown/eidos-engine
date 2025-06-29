// AIDEV-NOTE: Refactored simulation controls panel - extracted logic into focused modules for maintainability
// Main component now orchestrates control rendering using extracted grouping and rendering modules
'use client'

import { useMemo } from 'react'
import CollapsibleControlGroup from './collapsible-control-group'
import ViewportConstrainedPanel from './viewport-constrained-panel'
import { renderControl, getControlGridClasses } from './base-control-renderer'
import { FourPoleColorGroup, CellularAutomatonNavigationGroup } from './pattern-specific-controls'
import { getControlGroups } from '@/lib/pattern-control-grouping'
import { useMobileDetection } from '@/components/hooks/useMobileDetection'
import type { PatternControl } from '@/components/pattern-generators/types'

interface GroupedSimulationControlsPanelProps {
  patternId: string
  controls: PatternControl[]
  controlValues: Record<string, number | string | boolean>
  onControlChange: (controlId: string, value: number | string | boolean) => void
  sidebarWidth: number
}

export default function GroupedSimulationControlsPanel({
  patternId,
  controls,
  controlValues,
  onControlChange,
  sidebarWidth
}: GroupedSimulationControlsPanelProps) {
  // AIDEV-NOTE: Mobile detection for consistent single-column layout on mobile devices (Issue #23)
  const { isMobile } = useMobileDetection()
  
  // AIDEV-NOTE: Use extracted control grouping logic
  const controlGroups = useMemo(() => {
    return getControlGroups(patternId, controls)
  }, [patternId, controls])

  const paddingBuffer = useMemo(() => {
    // Adjust padding based on sidebar width
    if (sidebarWidth < 350) return 16
    if (sidebarWidth < 450) return 24
    return 32
  }, [sidebarWidth])

  // Render ungrouped controls for simple patterns
  if (!controlGroups) {
    return (
      <ViewportConstrainedPanel paddingBuffer={paddingBuffer}>
        <div className="space-y-4">
          <div className={`grid gap-4 ${getControlGridClasses(sidebarWidth, isMobile)}`}>
            {controls.map(control => renderControl(control, controlValues, onControlChange))}
          </div>
        </div>
      </ViewportConstrainedPanel>
    )
  }

  // Find controls that are not in any group (like reset buttons)
  const groupedControlIds = new Set(
    controlGroups.flatMap(group => group.controls.map(control => control.id))
  )
  const ungroupedControls = controls.filter(control => !groupedControlIds.has(control.id))

  // Render grouped controls
  return (
    <ViewportConstrainedPanel paddingBuffer={paddingBuffer}>
      <div className="space-y-4">
        
        {controlGroups.map((group) => {
          // Special handling for four-pole gradient color picker layout
          if (patternId === 'four-pole-gradient' && group.title === 'Pole Colors') {
            return (
              <FourPoleColorGroup
                key={group.title}
                title={group.title}
                controls={group.controls}
                controlValues={controlValues}
                onControlChange={onControlChange}
                defaultCollapsed={group.defaultCollapsed}
              />
            )
          }
          
          // Special handling for cellular automaton rule navigation
          if (patternId === 'cellular-automaton' && group.title === 'Rule Navigation') {
            return (
              <CellularAutomatonNavigationGroup
                key={group.title}
                title={group.title}
                controls={group.controls}
                controlValues={controlValues}
                onControlChange={onControlChange}
                defaultCollapsed={group.defaultCollapsed}
              />
            )
          }
          
          return (
            <CollapsibleControlGroup
              key={group.title}
              title={group.title}
              controls={group.controls}
              controlValues={controlValues}
              onControlChange={onControlChange}
              defaultCollapsed={group.defaultCollapsed}
            />
          )
        })}
        
        {/* Render ungrouped controls (like reset buttons) at bottom */}
        {ungroupedControls.length > 0 && (
          <div className={`grid gap-4 ${getControlGridClasses(sidebarWidth, isMobile)}`}>
            {ungroupedControls.map(control => renderControl(control, controlValues, onControlChange))}
          </div>
        )}
      </div>
    </ViewportConstrainedPanel>
  )
}

