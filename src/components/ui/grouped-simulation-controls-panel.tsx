// AIDEV-NOTE: Enhanced simulation controls panel with collapsible grouping and viewport constraints - Issue #19 COMPLETE
// This component solves viewport height issues by organizing controls into collapsible groups with constrained scrolling
'use client'

import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from './button'
import CollapsibleControlGroup from './collapsible-control-group'
import ViewportConstrainedPanel from './viewport-constrained-panel'
import CompactColorPicker from './compact-color-picker'
import CustomSelect from './custom-select'
import { useMobileDetection } from '@/components/hooks/useMobileDetection'
import type { PatternControl } from '@/components/pattern-generators/types'

interface ControlGroup {
  title: string
  controls: PatternControl[]
  defaultCollapsed?: boolean
}

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
  
  const controlGroups = useMemo(() => {
    // Special case: cellular automaton always gets grouped for navigation layout
    if (patternId === 'cellular-automaton') {
      return groupCellularAutomatonControls(controls)
    }
    
    // If few controls, don't group them (except for patterns with special layouts)
    if (controls.length <= 6 && 
        patternId !== 'four-pole-gradient' && 
        patternId !== 'cellular-automaton') {
      return null
    }

    // Define grouping logic based on pattern ID
    switch (patternId) {
      case 'four-pole-gradient':
        return groupFourPoleGradientControls(controls)
      
      case 'particle-system':
        return groupParticleSystemControls(controls)
      
      case 'cellular-automaton':
        return groupCellularAutomatonControls(controls)
      
      
      default:
        // For unknown patterns, try generic grouping
        return tryGenericGrouping(controls)
    }
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
          
          <div className={`grid gap-4 ${
            isMobile ? 'grid-cols-1' : 
            sidebarWidth > 500 ? 'grid-cols-3' : 
            sidebarWidth > 400 ? 'grid-cols-2' : 
            'grid-cols-1'
          }`}>
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
          <div className={`grid gap-4 ${
            isMobile ? 'grid-cols-1' : 
            sidebarWidth > 500 ? 'grid-cols-3' : 
            sidebarWidth > 400 ? 'grid-cols-2' : 
            'grid-cols-1'
          }`}>
            {ungroupedControls.map(control => renderControl(control, controlValues, onControlChange))}
          </div>
        )}
      </div>
    </ViewportConstrainedPanel>
  )
}

// Pattern-specific grouping functions
function groupFourPoleGradientControls(controls: PatternControl[]): ControlGroup[] {
  const groups: ControlGroup[] = []
  
  // Pole Colors group
  const poleColorControls = controls.filter(c => c.id.includes('pole') && c.id.includes('Color'))
  if (poleColorControls.length > 0) {
    groups.push({
      title: 'Pole Colors',
      controls: poleColorControls,
      defaultCollapsed: false
    })
  }

  // Gradient Properties
  const gradientControls = controls.filter(c => c.id === 'interpolationPower')
  if (gradientControls.length > 0) {
    groups.push({
      title: 'Gradient Properties',
      controls: gradientControls,
      defaultCollapsed: false
    })
  }

  // Animation Settings
  const animationControls = controls.filter(c => 
    c.id.includes('animation') || c.id.includes('Animation')
  )
  if (animationControls.length > 0) {
    groups.push({
      title: 'Animation Settings',
      controls: animationControls,
      defaultCollapsed: false
    })
  }

  // Noise Overlay
  const noiseControls = controls.filter(c => 
    c.id.includes('noise') || c.id.includes('Noise')
  )
  if (noiseControls.length > 0) {
    groups.push({
      title: 'Noise Overlay',
      controls: noiseControls,
      defaultCollapsed: true
    })
  }

  // Display
  const displayControls = controls.filter(c => 
    c.id.includes('show') || c.id.includes('Show') || c.id.includes('display')
  )
  if (displayControls.length > 0) {
    groups.push({
      title: 'Display',
      controls: displayControls,
      defaultCollapsed: true
    })
  }

  return groups
}

function groupParticleSystemControls(controls: PatternControl[]): ControlGroup[] {
  const groups: ControlGroup[] = []

  // Particle Properties
  const particleProps = controls.filter(c => 
    c.id.includes('particle') || c.id.includes('life') || c.id.includes('spawn')
  )
  if (particleProps.length > 0) {
    groups.push({
      title: 'Particle Properties',
      controls: particleProps,
      defaultCollapsed: false
    })
  }

  // Physics Settings
  const physicsControls = controls.filter(c => 
    c.id.includes('speed') || c.id.includes('gravity') || c.id.includes('curl')
  )
  if (physicsControls.length > 0) {
    groups.push({
      title: 'Physics Settings',
      controls: physicsControls,
      defaultCollapsed: false
    })
  }

  // Visual Effects
  const visualControls = controls.filter(c => 
    c.id.includes('brightness') || c.id.includes('trail') || c.id.includes('Trail')
  )
  if (visualControls.length > 0) {
    groups.push({
      title: 'Visual Effects',
      controls: visualControls,
      defaultCollapsed: false
    })
  }

  // Performance & Appearance (exclude reset buttons from grouping)
  const perfControls = controls.filter(c => 
    (c.id.includes('quality') || c.id.includes('color')) &&
    !c.id.includes('reset')
  )
  if (perfControls.length > 0) {
    groups.push({
      title: 'Performance & Appearance',
      controls: perfControls,
      defaultCollapsed: true
    })
  }

  return groups
}

function groupCellularAutomatonControls(controls: PatternControl[]): ControlGroup[] {
  const groups: ControlGroup[] = []

  // Rule Navigation
  const navControls = controls.filter(c => 
    c.id.includes('rule') && (c.id.includes('Prev') || c.id.includes('Next'))
  )
  if (navControls.length > 0) {
    groups.push({
      title: 'Rule Navigation',
      controls: navControls,
      defaultCollapsed: false
    })
  }

  // Generation Settings (exclude reset buttons from grouping)
  const genControls = controls.filter(c => 
    (c.id.includes('cell') || c.id.includes('animation') || c.id.includes('initial')) &&
    !c.id.includes('reset') && !c.id.includes('trigger')
  )
  if (genControls.length > 0) {
    groups.push({
      title: 'Generation Settings',
      controls: genControls,
      defaultCollapsed: false
    })
  }

  // Note: Reset buttons are intentionally excluded from grouping and will render at bottom

  return groups
}


function tryGenericGrouping(controls: PatternControl[]): ControlGroup[] | null {
  // For unknown patterns, try to create logical groups based on common patterns
  const groups: ControlGroup[] = []

  // Animation-related controls
  const animControls = controls.filter(c => 
    c.id.toLowerCase().includes('speed') || 
    c.id.toLowerCase().includes('animation') ||
    c.label.toLowerCase().includes('speed') ||
    c.label.toLowerCase().includes('animation')
  )

  // Color-related controls
  const colorControls = controls.filter(c => 
    c.type === 'color' || 
    c.id.toLowerCase().includes('color') ||
    c.label.toLowerCase().includes('color')
  )

  // Visual property controls (range controls that aren't animation)
  const visualControls = controls.filter(c => 
    c.type === 'range' && 
    !animControls.includes(c) &&
    !colorControls.includes(c)
  )

  // Settings and toggles
  const settingControls = controls.filter(c => 
    (c.type === 'checkbox' || c.type === 'select' || c.type === 'button') &&
    !colorControls.includes(c)
  )

  if (animControls.length > 0) {
    groups.push({
      title: 'Animation Settings',
      controls: animControls,
      defaultCollapsed: false
    })
  }

  if (visualControls.length > 0) {
    groups.push({
      title: 'Visual Properties',
      controls: visualControls,
      defaultCollapsed: false
    })
  }

  if (colorControls.length > 0) {
    groups.push({
      title: 'Appearance',
      controls: colorControls,
      defaultCollapsed: false
    })
  }

  if (settingControls.length > 0) {
    groups.push({
      title: 'Settings',
      controls: settingControls,
      defaultCollapsed: true
    })
  }

  // Only return groups if we successfully categorized most controls
  const categorizedCount = groups.reduce((sum, group) => sum + group.controls.length, 0)
  return categorizedCount >= controls.length * 0.8 ? groups : null
}

// Simple control renderer for ungrouped layout
function renderControl(
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
          className="w-full font-mono text-xs uppercase tracking-wide bg-accent-primary-strong text-accent-primary-foreground hover:bg-accent-primary px-3 py-2 rounded transition-colors"
        >
          {control.label}
        </button>
      )

    default:
      return null
  }
}

// AIDEV-NOTE: Special component for four-pole gradient color pickers with 2x2 layout
interface FourPoleColorGroupProps {
  title: string
  controls: PatternControl[]
  controlValues: Record<string, number | string | boolean>
  onControlChange: (controlId: string, value: number | string | boolean) => void
  defaultCollapsed?: boolean
}

function FourPoleColorGroup({
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

function CellularAutomatonNavigationGroup({
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