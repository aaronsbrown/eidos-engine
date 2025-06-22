// AIDEV-NOTE: Collapsible control group component with full accessibility - Issue #19 COMPLETE
// Provides expand/collapse functionality with keyboard navigation, ARIA support, and smooth animations
'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import CustomSelect from './custom-select'
import type { PatternControl } from '@/components/pattern-generators/types'

interface CollapsibleControlGroupProps {
  title: string
  controls: PatternControl[]
  controlValues: Record<string, number | string | boolean>
  onControlChange: (controlId: string, value: number | string | boolean) => void
  defaultCollapsed?: boolean
}

export default function CollapsibleControlGroup({
  title,
  controls,
  controlValues,
  onControlChange,
  defaultCollapsed = false
}: CollapsibleControlGroupProps) {
  const [isExpanded, setIsExpanded] = useState(!defaultCollapsed)
  const controlsId = `${title.replace(/\s+/g, '-').toLowerCase()}-controls`
  const titleId = `${title.replace(/\s+/g, '-').toLowerCase()}-title`

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const renderControl = (control: PatternControl) => {
    const value = controlValues[control.id] ?? control.defaultValue

    switch (control.type) {
      case 'range':
        return (
          <div key={control.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor={control.id} className="mobile-typography-label md:text-xs text-muted-foreground">
                {control.label}
              </label>
              <span className="mobile-typography-value md:text-xs text-accent-primary-strong">
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

  return (
    <div className="border border-border rounded-lg overflow-hidden">
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
        <h3 className="mobile-typography-pattern md:text-sm font-semibold text-foreground">
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
            className="p-4 space-y-4 bg-background"
          >
            {controls.length > 0 ? controls.map(renderControl) : (
              <div className="text-sm text-muted-foreground font-mono">No controls available</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}