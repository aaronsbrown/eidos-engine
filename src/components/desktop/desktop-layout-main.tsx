// AIDEV-NOTE: Extracted desktop layout main content area from main component for better maintainability
"use client"

import React, { useMemo } from "react"
import { GraduationCap, BookOpen, Bookmark } from "lucide-react"
import { EducationalOverlay } from "@/components/ui/educational-overlay"
import GroupedSimulationControlsPanel from "@/components/ui/grouped-simulation-controls-panel"
import type { DesktopLayoutState } from "@/lib/hooks/use-desktop-layout-state"
import type { DesktopLayoutHandlers } from "@/lib/desktop-layout-handlers"
import type { EducationalContent } from "@/components/ui/educational-overlay"
import { getPresetDisplayName } from "@/lib/preset-comparison"
import { PresetManager } from "@/lib/preset-manager"

import type { PatternPreset } from "@/lib/preset-manager"

interface DesktopLayoutMainProps {
  state: DesktopLayoutState
  handlers: DesktopLayoutHandlers
  educationalContent: EducationalContent
  hasEducationalContent: boolean
  onQuickSave: () => void
  activePresetId: string | null
  presets: PatternPreset[]
  isPresetLoading: boolean
  getCurrentControlValues: () => Record<string, number | string | boolean>
  handleControlChange: (controlId: string, value: number | string | boolean) => void
  setIsPresetPanelOpen: (open: boolean) => void
  setDimensions: (dimensions: { width: number; height: number }) => void
  setIsEducationalVisible: (visible: boolean) => void
  loadPreset: (presetId: string) => void
  clearActivePreset: () => void
}

export function DesktopLayoutMain({
  state,
  handlers,
  educationalContent,
  hasEducationalContent,
  onQuickSave,
  activePresetId,
  presets,
  isPresetLoading,
  getCurrentControlValues,
  handleControlChange,
  setIsPresetPanelOpen,
  setDimensions,
  setIsEducationalVisible,
  loadPreset,
  clearActivePreset,
}: DesktopLayoutMainProps) {
  const {
    selectedPattern,
    dimensions,
    isEducationalVisible,
    isResizing,
    sidebarWidth,
  } = state

  const {
    handleMouseDown,
  } = handlers

  const { PatternComponent } = state

  // AIDEV-NOTE: Memoize active preset display name to detect modifications
  const activePresetDisplayName = useMemo(() => {
    if (!activePresetId) {
      return ''
    }
    
    const activePreset = presets.find(p => p.id === activePresetId)
    if (!activePreset) {
      return ''
    }
    
    const currentValues = getCurrentControlValues()
    return getPresetDisplayName(activePreset, currentValues)
  }, [activePresetId, presets, getCurrentControlValues])

  // AIDEV-NOTE: Smart reset function with precedence: User Default → Factory Default → Pattern Defaults
  const handleResetToDefaults = async () => {
    try {
      // Get the effective default preset using precedence rules
      const effectiveDefault = await PresetManager.getEffectiveDefault(selectedPattern.id)
      
      if (effectiveDefault) {
        // Reset to the effective default preset
        loadPreset(effectiveDefault.id)
      } else {
        // Fall back to pattern control defaults
        const defaultValues: Record<string, number | string | boolean> = {}
        selectedPattern.controls?.forEach(control => {
          defaultValues[control.id] = control.defaultValue
        })
        Object.entries(defaultValues).forEach(([controlId, value]) => {
          handleControlChange(controlId, value)
        })
        
        // Clear any active preset since we're now at pattern defaults (not a preset)
        if (activePresetId) {
          clearActivePreset()
        }
      }
    } catch (error) {
      console.warn('Failed to reset to defaults, falling back to pattern defaults:', error)
      
      // Emergency fallback: reset to pattern defaults
      const defaultValues: Record<string, number | string | boolean> = {}
      selectedPattern.controls?.forEach(control => {
        defaultValues[control.id] = control.defaultValue
      })
      Object.entries(defaultValues).forEach(([controlId, value]) => {
        handleControlChange(controlId, value)
      })
      
      if (activePresetId) {
        clearActivePreset()
      }
    }
  }

  return (
    <>
      {/* Center - Pattern Display */}
      <main className="flex-1 p-6 relative">
        {/* Educational Content Button - Upper Left */}
        <div className="absolute top-4 left-4 text-xs font-mono space-y-1">
          {hasEducationalContent ? (
            <button
              data-tour="learn-button"
              onClick={() => setIsEducationalVisible(!isEducationalVisible)}
              className={`border border-border px-2 py-1 font-mono transition-colors ${
                isEducationalVisible 
                  ? "bg-background text-foreground hover:bg-muted" 
                  : "bg-accent-primary text-accent-primary-foreground hover:bg-accent-primary-strong"
              }`}
            >
              {isEducationalVisible ? (
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-foreground" />
                  HIDE LEARNING
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-accent-primary-foreground" />
                  LET&apos;S LEARN!
                </span>
              )}
            </button>
          ) : (
            <div className="border border-border bg-background px-2 py-1 text-muted-foreground">VIEWPORT_01</div>
          )}
        </div>
        
        <div data-tour="preset-dropdown" className="absolute top-4 right-4 text-xs font-mono text-muted-foreground space-y-1">
          <div className="flex items-center space-x-2">
            {/* Preset Selection Dropdown - Only show if presets exist */}
            {presets.length > 0 && (
              <select
                className="border border-border bg-background text-foreground px-2 py-1 font-mono text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                value={activePresetId || (presets.length > 0 ? presets[0].id : "")}
                onChange={(e) => {
                  // Load the selected preset
                  loadPreset(e.target.value)
                }}
                disabled={isPresetLoading}
              >
                {presets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.id === activePresetId ? activePresetDisplayName : preset.name}
                  </option>
                ))}
              </select>
            )}
            
            {/* Quick Save Button */}
            <button
              onClick={onQuickSave}
              disabled={isPresetLoading || !Object.keys(getCurrentControlValues()).length}
              className="border border-border bg-accent-primary hover:bg-accent-primary-strong px-2 py-[6px] font-mono text-accent-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed hidden md:inline-flex items-center justify-center"
              title="Quick Save Current Settings"
            >
              <Bookmark className="w-3 h-3" />
            </button>
            
            {/* Preset Manager Button */}
            <button
              onClick={() => setIsPresetPanelOpen(true)}
              className="border border-border bg-accent-primary hover:bg-accent-primary-strong px-2 py-1 font-mono text-accent-primary-foreground transition-colors"
            >
              PRESET MANAGER
            </button>
          </div>
        </div>

        {/* Bottom technical annotations - positioned exactly like top ones */}
        <div className="absolute bottom-4 left-4 text-xs font-mono text-muted-foreground">
          <div className="border border-border bg-background px-2 py-1">EIDOS_ENGINE_v1.0</div>
        </div>
        <div className="absolute bottom-4 right-4 text-xs font-mono text-muted-foreground">
          <div className="border border-border bg-background px-2 py-1">
            {new Date().toISOString().split('T')[0]}
          </div>
        </div>

        <div className="flex flex-col items-center min-h-full pt-16">
          {/* Pattern Container with technical frame */}
          <div className="relative">
            {/* Corner markers */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-accent-primary"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-accent-primary"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-accent-primary"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-accent-primary"></div>

            <div
              className="border-2 border-border bg-background shadow-lg"
              style={{
                width: dimensions.width,
                height: dimensions.height
              }}
            >
              <PatternComponent
                width={dimensions.width}
                height={dimensions.height}
                className="w-full h-full"
                controls={selectedPattern.controls}
                controlValues={getCurrentControlValues()}
                onControlChange={handleControlChange}
              />
            </div>
          </div>

          {/* Educational Overlay - Desktop Accordion (embedded in main content flow) */}
          {hasEducationalContent && (
            <div className="mt-8 mb-16 max-w-4xl">
              <EducationalOverlay
                type="accordion"
                content={educationalContent}
                isVisible={isEducationalVisible}
                onClose={() => setIsEducationalVisible(false)}
              />
            </div>
          )}
        </div>
      </main>

      {/* Resize Handle */}
      <div
        className={`w-1 bg-border hover:bg-accent-primary cursor-col-resize transition-colors ${isResizing ? 'bg-accent-primary' : ''}`}
        onMouseDown={handleMouseDown}
      />

      {/* Right Sidebar - Viewport & Simulation Parameters */}
      <aside
        className="border-l border-border p-6 space-y-4 bg-background/50 backdrop-blur-sm"
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* Viewport Controls - Compact */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 bg-accent-primary"></div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Viewport</h3>
          </div>
          <div className="border border-border p-2 bg-background space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1 uppercase">Width</label>
                <input
                  type="range"
                  min="320"
                  max="1280"
                  value={dimensions.width}
                  onChange={(e) => setDimensions({ ...dimensions, width: parseInt(e.target.value) })}
                  className="w-full accent-form-accent"
                />
                <div className="text-xs font-mono text-muted-foreground text-right">{dimensions.width}px</div>
              </div>
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1 uppercase">Height</label>
                <input
                  type="range"
                  min="180"
                  max="720"
                  value={dimensions.height}
                  onChange={(e) => setDimensions({ ...dimensions, height: parseInt(e.target.value) })}
                  className="w-full accent-form-accent"
                />
                <div className="text-xs font-mono text-muted-foreground text-right">{dimensions.height}px</div>
              </div>
            </div>
          </div>
        </div>

        {/* Simulation Parameters - AIDEV-NOTE: Refactored into dedicated component for maintainability */}
        <div data-tour="controls-panel" className="border-t border-border pt-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-accent-primary"></div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              {selectedPattern.controls ? "Simulation Parameters" : "Pattern Controls"}
            </h3>
          </div>
          <GroupedSimulationControlsPanel
            patternId={selectedPattern.id}
            controls={selectedPattern.controls || []}
            controlValues={getCurrentControlValues()}
            onControlChange={handleControlChange}
            sidebarWidth={sidebarWidth}
            onResetToDefaults={handleResetToDefaults}
          />
        </div>
      </aside>
    </>
  )
}