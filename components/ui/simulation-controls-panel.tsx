"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import CompactColorPicker from "@/components/ui/compact-color-picker"
import { PatternControl } from "@/components/pattern-generators/types"

// AIDEV-NOTE: Extracted from app/page.tsx to improve maintainability and prepare for future UI features
interface SimulationControlsPanelProps {
  patternId: string
  controls: PatternControl[]
  currentValues: Record<string, number | string | boolean>
  onControlChange: (controlId: string, value: number | string | boolean) => void
  sidebarWidth: number
}

export function SimulationControlsPanel({
  patternId,
  controls,
  currentValues,
  onControlChange,
  sidebarWidth
}: SimulationControlsPanelProps) {
  if (!controls) {
    return (
      <div className="border border-border p-3 bg-background">
        <div className="text-xs font-mono text-muted-foreground mb-3 uppercase">No Controls Available</div>
        <div className="text-xs text-muted-foreground/60">This pattern does not have interactive controls</div>
      </div>
    )
  }

  // AIDEV-NOTE: Special case handling for cellular-automaton pattern navigation
  const renderCellularAutomatonNavigation = () => {
    if (patternId !== 'cellular-automaton') return null

    const buttonControls = controls.filter(control => control.type === 'button')
    const prevButton = buttonControls.find(c => c.id === 'rulePrev')
    const nextButton = buttonControls.find(c => c.id === 'ruleNext')
    const currentRule = currentValues['rule'] ?? 30

    if (!prevButton && !nextButton) return null

    return (
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
              className="font-mono text-xs border-border hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950/20"
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
              className="font-mono text-xs border-border hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950/20"
            >
              {nextButton.label}
            </Button>
          )}
        </div>
      </div>
    )
  }

  // AIDEV-NOTE: Special case handling for four-pole-gradient pattern layout
  const renderFourPoleGradientLayout = () => {
    if (patternId !== 'four-pole-gradient') return null

    return (
      <div className="space-y-4">
        {/* Color pickers in 2x2 grid */}
        <div>
          <div className="text-xs font-mono text-muted-foreground mb-3 uppercase tracking-wider">
            Pole Colors
          </div>
          <div className="grid grid-cols-2 gap-3">
            {controls.filter(control => control.type === 'color').map((control) => {
              const currentValue = currentValues[control.id] ?? control.defaultValue
              return (
                <CompactColorPicker
                  key={control.id}
                  value={currentValue as string}
                  onChange={(color) => onControlChange(control.id, color)}
                  label={control.label}
                />
              )
            })}
          </div>
        </div>
        
        {/* Other controls in regular grid */}
        <div className={`grid gap-4 ${sidebarWidth > 500 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {controls.filter(control => control.type !== 'button' && control.type !== 'color').map((control) => {
            return renderControlInput(control)
          })}
        </div>
      </div>
    )
  }

  // AIDEV-NOTE: Renders individual control inputs with proper type handling
  const renderControlInput = (control: PatternControl) => {
    const currentValue = currentValues[control.id] ?? control.defaultValue

    if (control.type === 'range') {
      return (
        <div key={control.id} className="flex flex-col h-full">
          <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase">{control.label}</label>
          <div className="flex-1 flex flex-col justify-center">
            <input
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={currentValue as number}
              onChange={(e) => onControlChange(control.id, control.step && control.step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value))}
              className="w-full accent-yellow-400"
            />
          </div>
          <div className="text-xs font-mono text-muted-foreground mt-1 text-right">
            {control.step && control.step < 1
              ? (currentValue as number).toFixed(control.step.toString().split('.')[1]?.length || 1)
              : currentValue
            }{control.id.includes('Speed') || control.id.includes('brightness') || control.id.includes('colorIntensity') ? '×' : control.id.includes('Size') ? 'px' : ''}
          </div>
        </div>
      )
    } else if (control.type === 'select') {
      return (
        <div key={control.id} className={`flex flex-col h-full ${sidebarWidth > 500 ? '' : 'col-span-full'}`}>
          <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase">{control.label}</label>
          <div className="flex-1 flex flex-col justify-center">
            <select
              value={currentValue as string}
              onChange={(e) => onControlChange(control.id, e.target.value)}
              className="w-full border border-border p-2 text-xs font-mono bg-background text-foreground"
            >
              {control.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )
    } else if (control.type === 'checkbox') {
      return (
        <div key={control.id} className={`flex flex-col h-full ${sidebarWidth > 500 ? '' : 'col-span-full'}`}>
          <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase">{control.label}</label>
          <div className="flex-1 flex items-center">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={currentValue as boolean}
                onChange={(e) => onControlChange(control.id, e.target.checked)}
                className="w-4 h-4 accent-yellow-400"
              />
              <span className="text-xs font-mono text-muted-foreground uppercase">ENABLED</span>
            </label>
          </div>
        </div>
      )
    } else if (control.type === 'color') {
      return (
        <CompactColorPicker
          key={control.id}
          value={currentValue as string}
          onChange={(color) => onControlChange(control.id, color)}
          label={control.label}
        />
      )
    }
    return null
  }

  // AIDEV-NOTE: Renders button controls with special handling for cellular-automaton navigation
  const renderButtonControls = () => {
    const buttonControls = controls.filter(control => {
      if (control.type !== 'button') return false
      // For cellular-automaton, exclude navigation buttons (they're rendered at top)
      if (patternId === 'cellular-automaton') {
        return control.id !== 'rulePrev' && control.id !== 'ruleNext'
      }
      return true
    })

    if (buttonControls.length === 0) return null

    return buttonControls.map((control) => {
      const currentValue = currentValues[control.id] ?? control.defaultValue
      return (
        <div key={control.id} className="pt-2">
          <Button
            onClick={() => {
              onControlChange(control.id, !currentValue)
              setTimeout(() => onControlChange(control.id, false), 100)
            }}
            variant="outline"
            size="sm"
            className="w-full font-mono text-xs border-border hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950/20 uppercase"
          >
            {control.label}
          </Button>
        </div>
      )
    })
  }

  return (
    <div className="space-y-4">
      {/* Cellular automaton navigation at top */}
      {renderCellularAutomatonNavigation()}

      {/* Main control layout */}
      {patternId === 'four-pole-gradient' ? (
        renderFourPoleGradientLayout()
      ) : (
        /* Default layout for other patterns */
        <div className={`grid gap-4 ${sidebarWidth > 500 ? 'grid-cols-3' : sidebarWidth > 400 ? 'grid-cols-2' : 'grid-cols-1'}`} style={{ gridAutoRows: '1fr' }}>
          {controls.filter(control => control.type !== 'button').map((control) => {
            return renderControlInput(control)
          })}
        </div>
      )}

      {/* Button controls at bottom */}
      {renderButtonControls()}
    </div>
  )
}