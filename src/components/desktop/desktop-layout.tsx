// AIDEV-NOTE: Desktop layout component - extracted to separate mobile from desktop logic per hooks rules
"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { patternGenerators } from "@/components/pattern-generators"
import GroupedSimulationControlsPanel from "@/components/ui/grouped-simulation-controls-panel"
import { FloatingPresetPanel } from "@/components/ui/floating-preset-panel"
import { SavePresetModal } from "@/components/ui/save-preset-modal"
import { usePresetManager } from "@/lib/hooks/use-preset-manager"
import { EducationalOverlay } from "@/components/ui/educational-overlay"
import { useEducationalContent } from "@/lib/hooks/use-educational-content"
import { getAllPatternIds } from "@/lib/educational-content-loader"

export default function DesktopLayout() {
  const [selectedPatternId, setSelectedPatternId] = useState<string>(patternGenerators[0].id)
  const [dimensions, setDimensions] = useState({ width: 700, height: 394 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [controlValues, setControlValues] = useState<Record<string, Record<string, number | string | boolean>>>({})
  const [sidebarWidth, setSidebarWidth] = useState(380) // Default sidebar width
  const [isResizing, setIsResizing] = useState(false)
  const [visiblePatternStart, setVisiblePatternStart] = useState(0) // Which pattern to start showing from
  const initializedPatternsRef = useRef<Set<string>>(new Set()) // Track which patterns have been initialized
  const [isPresetPanelOpen, setIsPresetPanelOpen] = useState(false) // Track preset panel visibility
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false) // Track save preset modal visibility
  const [isEducationalVisible, setIsEducationalVisible] = useState(false) // Track educational overlay visibility

  // How many patterns to show at once (fits in ~20rem container)
  const patternsPerPage = 5
  const totalPatterns = patternGenerators.length
  const currentIndex = patternGenerators.findIndex(p => p.id === selectedPatternId)
  // AIDEV-NOTE: Don't disable buttons during scroll animation to prevent oscillation
  const canGoToPrevious = currentIndex > 0
  const canGoToNext = currentIndex < totalPatterns - 1

  const selectedPattern = patternGenerators.find(p => p.id === selectedPatternId) || patternGenerators[0]
  const PatternComponent = selectedPattern.component

  // AIDEV-NOTE: Load educational content for current pattern
  const { content: educationalContent } = useEducationalContent(selectedPatternId)
  
  // Check if educational content is available for current pattern
  const availableEducationalPatterns = getAllPatternIds()
  const hasEducationalContent = availableEducationalPatterns.includes(selectedPatternId)

  // Initialize default control values for patterns that have controls
  const initializeControlValues = (patternId: string) => {
    const pattern = patternGenerators.find(p => p.id === patternId)
    if (!pattern?.controls) return {}

    const defaults: Record<string, number | string | boolean> = {}
    pattern.controls.forEach(control => {
      defaults[control.id] = control.defaultValue
    })
    return defaults
  }

  // Get current control values for the selected pattern
  const getCurrentControlValues = () => {
    return controlValues[selectedPatternId] || {}
  }

  // AIDEV-NOTE: Initialize preset manager hook for dropdown functionality
  const {
    presets,
    activePresetId,
    loadPreset,
    savePreset,
    error: presetError,
    clearError: clearPresetError,
    isLoading: isPresetLoading
  } = usePresetManager({
    patternId: selectedPatternId,
    controlValues: getCurrentControlValues(),
    onControlValuesChange: (newValues) => {
      Object.entries(newValues).forEach(([controlId, value]) => {
        handleControlChange(controlId, value)
      })
    },
    patternControls: selectedPattern.controls
  })

  // AIDEV-NOTE: Quick save handler - opens save modal for user to name preset
  const handleQuickSave = () => {
    setIsSaveModalOpen(true)
  }

  // Initialize control values when pattern changes
  useEffect(() => {
    if (!controlValues[selectedPatternId] && !initializedPatternsRef.current.has(selectedPatternId)) {
      const defaults = initializeControlValues(selectedPatternId)
      setControlValues(prev => ({ ...prev, [selectedPatternId]: defaults }))
      initializedPatternsRef.current.add(selectedPatternId)
    }
  }, [selectedPatternId, controlValues])

  // Handle control changes
  const handleControlChange = (controlId: string, value: number | string | boolean) => {
    setControlValues(prev => ({
      ...prev,
      [selectedPatternId]: {
        ...prev[selectedPatternId],
        [controlId]: value
      }
    }))
  }

  // AIDEV-NOTE: Calculate cumulative height accounting for category dividers - fix for issue #49
  const calculateTransformOffset = (startIndex: number) => {
    let totalHeight = 0
    for (let i = 0; i < startIndex; i++) {
      const pattern = patternGenerators[i]
      const prevPattern = i > 0 ? patternGenerators[i - 1] : null
      
      // Add category divider height if needed
      if (i === 0 || (prevPattern && prevPattern.category !== pattern.category)) {
        totalHeight += 28 // Category divider height (my-2 = 8px*2 + text height + borders)
      }
      
      totalHeight += 69 // Pattern button height (p-3 padding + content + border + space-y-1)
    }
    return totalHeight
  }

  // AIDEV-NOTE: Enhanced navigation with category-aware smart paging
  const handlePreviousPattern = () => {
    const currentIndex = patternGenerators.findIndex(p => p.id === selectedPatternId)
    if (currentIndex > 0) {
      const prevPattern = patternGenerators[currentIndex - 1]
      setSelectedPatternId(prevPattern.id)

      // Adjust visible window if needed to show the selected pattern
      if (currentIndex - 1 < visiblePatternStart) {
        setVisiblePatternStart(currentIndex - 1)
      }
    }
  }

  // AIDEV-NOTE: Handle mouse wheel scrolling through patterns - using ref for proper event handling
  const patternListRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const handlePatternScroll = useCallback((e: WheelEvent) => {
    e.preventDefault() // Stop default page scrolling
    
    // Throttle scroll events to prevent excessive updates
    if (scrollTimeoutRef.current) return
    
    const scrollingDown = e.deltaY > 0
    const maxStart = Math.max(0, totalPatterns - patternsPerPage)
    
    if (scrollingDown && visiblePatternStart < maxStart) {
      // Scroll down - show next patterns for browsing
      setVisiblePatternStart(Math.min(visiblePatternStart + 1, maxStart))
    } else if (!scrollingDown && visiblePatternStart > 0) {
      // Scroll up - show previous patterns for browsing
      setVisiblePatternStart(Math.max(visiblePatternStart - 1, 0))
    }
    
    // Throttle subsequent scroll events
    scrollTimeoutRef.current = setTimeout(() => {
      scrollTimeoutRef.current = null
    }, 100) // Short throttle for smooth scrolling
  }, [visiblePatternStart, totalPatterns, patternsPerPage])
  
  // AIDEV-NOTE: Set up wheel event listener with proper passive: false
  useEffect(() => {
    const element = patternListRef.current
    if (!element) return
    
    element.addEventListener('wheel', handlePatternScroll, { passive: false })
    
    return () => {
      element.removeEventListener('wheel', handlePatternScroll)
      // Clean up any pending timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
        scrollTimeoutRef.current = null
      }
    }
  }, [handlePatternScroll])

  // AIDEV-NOTE: Enhanced pattern selection that auto-adjusts visible window
  const handlePatternSelect = (patternId: string) => {
    const patternIndex = patternGenerators.findIndex(p => p.id === patternId)
    setSelectedPatternId(patternId)
    
    // Auto-adjust visible window if selected pattern is not visible
    if (patternIndex < visiblePatternStart) {
      // Pattern is above visible window - scroll up to show it
      setVisiblePatternStart(patternIndex)
    } else if (patternIndex >= visiblePatternStart + patternsPerPage) {
      // Pattern is below visible window - scroll down to show it
      const maxStart = Math.max(0, totalPatterns - patternsPerPage)
      setVisiblePatternStart(Math.min(patternIndex - patternsPerPage + 1, maxStart))
    }
  }

  const handleNextPattern = () => {
    const currentIndex = patternGenerators.findIndex(p => p.id === selectedPatternId)
    if (currentIndex < totalPatterns - 1) {
      const nextPattern = patternGenerators[currentIndex + 1]
      setSelectedPatternId(nextPattern.id)

      // Adjust visible window if needed to show the selected pattern
      if (currentIndex + 1 >= visiblePatternStart + patternsPerPage) {
        // Ensure we don't scroll past the last possible position
        const maxStart = Math.max(0, totalPatterns - patternsPerPage)
        setVisiblePatternStart(Math.min(currentIndex + 1 - patternsPerPage + 1, maxStart))
      }
    }
  }


  // Handle sidebar resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return
    const newWidth = window.innerWidth - e.clientX
    setSidebarWidth(Math.max(300, Math.min(600, newWidth))) // Min 300px, max 600px
  }, [isResizing])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  // Add mouse event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    if (!isFullscreen) {
      setDimensions({ width: window.innerWidth - 40, height: window.innerHeight - 120 })
    } else {
      setDimensions({ width: 700, height: 394 })
    }
  }


  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Technical Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Header */}
      <header className="relative border-b border-form p-6 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-3 h-3 bg-accent-primary border border-border"></div>
            <h1 className="text-xl font-mono tracking-wider uppercase">Eidos Engine</h1>
            <div className="text-xs font-mono text-muted-foreground bg-background border border-border px-2 py-1">
              v1.0.0
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="text-xs font-mono text-muted-foreground border border-border px-2 py-1 bg-background">
              [{String(patternGenerators.findIndex(p => p.id === selectedPatternId) + 1).padStart(2, '0')}/{String(patternGenerators.length).padStart(2, '0')}]
            </div>
            <Button
              onClick={toggleFullscreen}
              variant="outline"
              size="sm"
              className="font-mono text-xs"
            >
              {isFullscreen ? "EXIT_FULLSCREEN" : "FULLSCREEN"}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Left Sidebar - Pattern Selection & Specifications */}
        <aside className="w-64 border-r border-border bg-background/50 backdrop-blur-sm flex flex-col">
          {/* AIDEV-NOTE: Made sidebar flex column to enable proper scrolling layout */}
          <div className="p-6 pb-4">
            {/* Pattern Selection Header */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent-primary"></div>
              <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Pattern Selection</h2>
            </div>
          </div>

          {/* Previous Pattern Button */}
          <div className="px-6 mb-1">
            <button
              onClick={handlePreviousPattern}
              disabled={!canGoToPrevious}
              className={`w-full h-6 border transition-all font-mono text-xs flex items-center justify-center ${canGoToPrevious
                ? "border-accent-primary bg-accent-primary hover:bg-accent-primary-strong cursor-pointer"
                : "border-disabled-border bg-disabled-background dark:bg-disabled-background dark:border-disabled-border cursor-not-allowed"
                }`}
            >
              <span className={`font-bold ${canGoToPrevious ? "text-accent-primary-foreground" : "text-muted-foreground"}`}>
                ↑
              </span>
            </button>
          </div>

          {/* Pattern List - Animated Pagination */}
          <div
            ref={patternListRef}
            className="px-6 overflow-hidden"
            style={{ height: `${patternsPerPage * 70 + 40}px` }} // AIDEV-NOTE: Adjusted height to fit patterns with category dividers properly
          >
            {/* AIDEV-NOTE: Fixed height container to show exactly 5 patterns + padding */}
            <div
              className="space-y-1 pt-1 pb-4 transition-transform duration-200 ease-out"
              style={{
                transform: `translateY(${-calculateTransformOffset(visiblePatternStart)}px)` // AIDEV-NOTE: Fixed to account for category dividers
              }}
            >
              {patternGenerators.map((pattern, index) => {
                const isVisible = index >= visiblePatternStart && index < visiblePatternStart + patternsPerPage
                const prevPattern = index > 0 ? patternGenerators[index - 1] : null
                
                // AIDEV-NOTE: Show category divider when category changes from previous pattern
                const showCategoryDivider = isVisible && (
                  index === visiblePatternStart || // First visible pattern
                  (prevPattern && prevPattern.category !== pattern.category) // Category boundary
                )
                
                return (
                  <div key={pattern.id}>
                    {/* AIDEV-NOTE: Category divider when category changes - accessible colors */}
                    {showCategoryDivider && (
                      <div className="flex items-center my-2 px-1">
                        <div className="flex-1 h-px bg-border"></div>
                        <div className="px-2 text-xs font-mono text-foreground bg-background border border-border uppercase tracking-wider">
                          {pattern.category}
                        </div>
                        <div className="flex-1 h-px bg-border"></div>
                      </div>
                    )}
                    
                    <button
                      onClick={() => handlePatternSelect(pattern.id)}
                      className={`w-full text-left p-3 border transition-all font-mono text-xs ${selectedPatternId === pattern.id
                        ? "bg-accent-primary-subtle dark:bg-accent-primary-subtle border-accent-primary text-foreground"
                        : "bg-background border-border hover:border-muted-foreground text-muted-foreground hover:bg-muted/50"
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="uppercase tracking-wider">{pattern.name}</span>
                        <span className="text-muted-foreground/60">{(index + 1).toString().padStart(2, '0')}</span>
                      </div>
                      <div className="text-muted-foreground/80 mt-1">{pattern.id}</div>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Next Pattern Button */}
          <div className="px-6 mt-1 mb-2.5">
            <button
              onClick={handleNextPattern}
              disabled={!canGoToNext}
              className={`w-full h-6 border transition-all font-mono text-xs flex items-center justify-center ${canGoToNext
                ? "border-accent-primary bg-accent-primary hover:bg-accent-primary-strong cursor-pointer"
                : "border-disabled-border bg-disabled-background dark:bg-disabled-background dark:border-disabled-border cursor-not-allowed"
                }`}
            >
              <span className={`font-bold ${canGoToNext ? "text-accent-primary-foreground" : "text-muted-foreground"}`}>
                ↓
              </span>
            </button>
          </div>


          {/* Pattern Specifications - Fixed at bottom */}
          <div className="p-6 pt-4 border-t border-border">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-accent-primary"></div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Specifications</h3>
            </div>
            <div className="border border-border p-3 bg-background space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">TYPE:</span>
                <span className="text-foreground uppercase">{selectedPattern.id}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">CATEGORY:</span>
                <span className="text-foreground uppercase">{selectedPattern.category}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">SIZE:</span>
                <span className="text-foreground">{dimensions.width} × {dimensions.height}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">TECHNOLOGY:</span>
                <span className="text-foreground uppercase">
                  {selectedPattern.technology}
                </span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">FPS:</span>
                <span className="text-foreground">60</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">STATUS:</span>
                <span className="text-success-foreground">ACTIVE</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Center - Pattern Display */}
        <main className="flex-1 p-6 relative">
          {/* Educational Content Button - Upper Left */}
          <div className="absolute top-4 left-4 text-xs font-mono space-y-1">
            {hasEducationalContent ? (
              <button
                onClick={() => setIsEducationalVisible(!isEducationalVisible)}
                className={`border border-border px-2 py-1 font-mono transition-colors ${
                  isEducationalVisible 
                    ? "bg-background text-foreground hover:bg-muted" 
                    : "bg-accent-primary text-accent-primary-foreground hover:bg-accent-primary-strong"
                }`}
              >
                {isEducationalVisible ? '📚 HIDE LEARNING' : '🎓 LET\'S LEARN!'}
              </button>
            ) : (
              <div className="border border-border bg-background px-2 py-1 text-muted-foreground">VIEWPORT_01</div>
            )}
          </div>
          <div className="absolute top-4 right-4 text-xs font-mono text-muted-foreground space-y-1">
            <div className="flex items-center space-x-2">
              {/* Preset Selection Dropdown */}
              <select
                className="border border-border bg-background text-foreground px-2 py-1 font-mono text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                value={activePresetId || ""}
                onChange={(e) => {
                  if (e.target.value && e.target.value !== activePresetId) {
                    loadPreset(e.target.value)
                  }
                }}
                disabled={isPresetLoading || presets.length === 0}
              >
                <option value="">SELECT PRESET</option>
                {presets.map(preset => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
              
              {/* Quick Save Button */}
              <button
                onClick={handleQuickSave}
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

            {/* Educational Overlay - Desktop Accordion */}
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
                    onChange={(e) => setDimensions(prev => ({ ...prev, width: parseInt(e.target.value) }))}
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
                    onChange={(e) => setDimensions(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                    className="w-full accent-form-accent"
                  />
                  <div className="text-xs font-mono text-muted-foreground text-right">{dimensions.height}px</div>
                </div>
              </div>
            </div>
          </div>

          {/* Simulation Parameters - AIDEV-NOTE: Refactored into dedicated component for maintainability */}
          <div className="border-t border-border pt-4">
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
            />
          </div>
        </aside>

      </div>

      {/* AIDEV-NOTE: Floating preset panel - Option 3 implementation */}
      {isPresetPanelOpen && (
        <FloatingPresetPanel
          patternId={selectedPattern.id}
          controlValues={getCurrentControlValues()}
          onControlValuesChange={(newValues) => {
            Object.entries(newValues).forEach(([controlId, value]) => {
              handleControlChange(controlId, value)
            })
          }}
          patternControls={selectedPattern.controls}
          onClose={() => setIsPresetPanelOpen(false)}
        />
      )}

      {/* Save Preset Modal */}
      <SavePresetModal
        isOpen={isSaveModalOpen}
        onClose={() => {
          setIsSaveModalOpen(false)
          clearPresetError()
        }}
        onSave={savePreset}
        isLoading={isPresetLoading}
        error={presetError}
      />
      
    </div>
  )
}