// AIDEV-NOTE: Floating preset panel - Option 2 preview
"use client"

import React, { useState } from 'react'
import { TempPresetControls } from './temp-preset-controls'
import { PatternControl } from '@/components/pattern-generators/types'

interface FloatingPresetPanelProps {
  patternId: string
  controlValues: Record<string, number | string | boolean>
  onControlValuesChange: (values: Record<string, number | string | boolean>) => void
  patternControls?: PatternControl[]
  onClose?: () => void
}

export function FloatingPresetPanel({
  patternId,
  controlValues,
  onControlValuesChange,
  patternControls = [],
  onClose
}: FloatingPresetPanelProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  
  // Use external onClose if provided, otherwise use internal state
  const isControlledExternally = Boolean(onClose)
  const isOpen = isControlledExternally ? true : internalIsOpen
  
  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      setInternalIsOpen(false)
    }
  }

  return (
    <>
      {/* Floating Trigger Button - Only show if not controlled externally */}
      {!isControlledExternally && (
        <button
          onClick={() => setInternalIsOpen(true)}
          className="fixed top-4 right-4 z-40 bg-accent-primary text-accent-primary-foreground hover:bg-accent-primary-strong w-12 h-12 rounded-full shadow-lg flex items-center justify-center font-mono text-lg transition-all hover:scale-110"
          aria-label="Open presets"
        >
          ⭐
        </button>
      )}

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose()
            }
          }}
        >
          <div 
            className="bg-background border border-border rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-sm font-mono uppercase tracking-wider text-foreground">
                Preset Management
              </h2>
              <button
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground w-8 h-8 flex items-center justify-center transition-colors"
                aria-label="Close presets"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <TempPresetControls
                patternId={patternId}
                controlValues={controlValues}
                onControlValuesChange={onControlValuesChange}
                patternControls={patternControls}
              />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/30">
              <div className="text-xs font-mono text-muted-foreground">
                Pattern: {patternId}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}