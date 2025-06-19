"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { patternGenerators } from "@/components/pattern-generators"

export default function PatternGeneratorShowcase() {
  const [selectedPatternId, setSelectedPatternId] = useState<string>(patternGenerators[0].id)
  const [dimensions, setDimensions] = useState({ width: 700, height: 394 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [controlValues, setControlValues] = useState<Record<string, Record<string, number | string | boolean>>>({})
  const [sidebarWidth, setSidebarWidth] = useState(380) // Default sidebar width
  const [isResizing, setIsResizing] = useState(false)
  const [visiblePatternStart, setVisiblePatternStart] = useState(0) // Which pattern to start showing from
  const [isAnimating, setIsAnimating] = useState(false) // Track animation state
  const initializedPatternsRef = useRef<Set<string>>(new Set()) // Track which patterns have been initialized

  // How many patterns to show at once (fits in ~20rem container)
  const patternsPerPage = 5
  const totalPatterns = patternGenerators.length
  const currentIndex = patternGenerators.findIndex(p => p.id === selectedPatternId)
  const canGoToPrevious = currentIndex > 0 && !isAnimating
  const canGoToNext = currentIndex < totalPatterns - 1 && !isAnimating

  const selectedPattern = patternGenerators.find(p => p.id === selectedPatternId) || patternGenerators[0]
  const PatternComponent = selectedPattern.component

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

  // Handle pattern navigation (previous/next pattern selection)
  const handlePreviousPattern = () => {
    const currentIndex = patternGenerators.findIndex(p => p.id === selectedPatternId)
    if (currentIndex > 0) {
      const prevPattern = patternGenerators[currentIndex - 1]
      setSelectedPatternId(prevPattern.id)

      // Adjust visible window if needed to show the selected pattern
      if (currentIndex - 1 < visiblePatternStart) {
        setIsAnimating(true)
        setVisiblePatternStart(currentIndex - 1)
        setTimeout(() => setIsAnimating(false), 300)
      }
    }
  }

  const handleNextPattern = () => {
    const currentIndex = patternGenerators.findIndex(p => p.id === selectedPatternId)
    if (currentIndex < totalPatterns - 1) {
      const nextPattern = patternGenerators[currentIndex + 1]
      setSelectedPatternId(nextPattern.id)

      // Adjust visible window if needed to show the selected pattern
      if (currentIndex + 1 >= visiblePatternStart + patternsPerPage) {
        setIsAnimating(true)
        // Ensure we don't scroll past the last possible position
        const maxStart = Math.max(0, totalPatterns - patternsPerPage)
        setVisiblePatternStart(Math.min(currentIndex + 1 - patternsPerPage + 1, maxStart))
        setTimeout(() => setIsAnimating(false), 300)
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
      <header className="relative border-b border-gray-300 p-6 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-3 h-3 bg-yellow-400 border border-gray-400"></div>
            <h1 className="text-xl font-mono tracking-wider uppercase">Pattern Generator System</h1>
            <div className="text-xs font-mono text-gray-500 bg-white border border-gray-300 px-2 py-1">
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
              className="font-mono text-xs border-gray-400 hover:border-yellow-400 hover:bg-yellow-50"
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
              <div className="w-2 h-2 bg-yellow-400"></div>
              <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Pattern Selection</h2>
            </div>
          </div>

          {/* Previous Pattern Button */}
          <div className="px-6 mb-1">
            <button
              onClick={handlePreviousPattern}
              disabled={!canGoToPrevious}
              className={`w-full h-6 border transition-all font-mono text-xs flex items-center justify-center ${canGoToPrevious
                ? "border-yellow-400 bg-yellow-400 hover:bg-yellow-500 cursor-pointer"
                : "border-gray-300 bg-gray-200 dark:bg-gray-700 dark:border-gray-600 cursor-not-allowed"
                }`}
            >
              <span className={`font-bold ${canGoToPrevious ? "text-black" : "text-gray-400 dark:text-gray-500"}`}>
                ↑
              </span>
            </button>
          </div>

          {/* Pattern List - Animated Pagination */}
          <div
            className="px-6 overflow-hidden"
            style={{ height: `${patternsPerPage * 70 + 20}px` }}
          >
            {/* AIDEV-NOTE: Fixed height container to show exactly 5 patterns + padding */}
            <div
              className="space-y-1 pt-1 pb-4 transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateY(${-visiblePatternStart * 60}px)` //
              }}
            >
              {patternGenerators.map((pattern, index) => {
                const isVisible = index >= visiblePatternStart && index < visiblePatternStart + patternsPerPage
                return (
                  <button
                    key={pattern.id}
                    onClick={() => setSelectedPatternId(pattern.id)}
                    className={`w-full text-left p-3 border transition-all font-mono text-xs ${selectedPatternId === pattern.id
                      ? "bg-yellow-100 dark:bg-yellow-950/30 border-yellow-400 text-foreground"
                      : "bg-background border-border hover:border-muted-foreground text-muted-foreground hover:bg-muted/50"
                      }`}
                    style={{
                      pointerEvents: isVisible ? 'auto' : 'none'
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="uppercase tracking-wider">{pattern.name}</span>
                      <span className="text-muted-foreground/60">{(index + 1).toString().padStart(2, '0')}</span>
                    </div>
                    <div className="text-muted-foreground/80 mt-1">{pattern.id}</div>
                  </button>
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
                ? "border-yellow-400 bg-yellow-400 hover:bg-yellow-500 cursor-pointer"
                : "border-gray-300 bg-gray-200 dark:bg-gray-700 dark:border-gray-600 cursor-not-allowed"
                }`}
            >
              <span className={`font-bold ${canGoToNext ? "text-black" : "text-gray-400 dark:text-gray-500"}`}>
                ↓
              </span>
            </button>
          </div>


          {/* Pattern Specifications - Fixed at bottom */}
          <div className="p-6 pt-4 border-t border-border">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-yellow-400"></div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Specifications</h3>
            </div>
            <div className="border border-border p-3 bg-background space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">TYPE:</span>
                <span className="text-foreground uppercase">{selectedPattern.id}</span>
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
                <span className="text-green-600 dark:text-green-400">ACTIVE</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Center - Pattern Display */}
        <main className="flex-1 p-6 relative">
          {/* Technical annotation boxes */}
          <div className="absolute top-4 left-4 text-xs font-mono text-muted-foreground space-y-1">
            <div className="border border-border bg-background px-2 py-1">VIEWPORT_01</div>
          </div>
          <div className="absolute top-4 right-4 text-xs font-mono text-muted-foreground space-y-1">
            <div className="border border-border bg-background px-2 py-1">REAL_TIME</div>
          </div>

          {/* Bottom technical annotations - positioned exactly like top ones */}
          <div className="absolute bottom-4 left-4 text-xs font-mono text-muted-foreground">
            <div className="border border-border bg-background px-2 py-1">PATTERN_GENERATOR_SYSTEM_v1.0</div>
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
              <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-yellow-400"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-yellow-400"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-yellow-400"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-yellow-400"></div>


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

          </div>

        </main>

        {/* Resize Handle */}
        <div
          className={`w-1 bg-border hover:bg-yellow-400 cursor-col-resize transition-colors ${isResizing ? 'bg-yellow-400' : ''}`}
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
              <div className="w-2 h-2 bg-yellow-400"></div>
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
                    className="w-full accent-yellow-400"
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
                    className="w-full accent-yellow-400"
                  />
                  <div className="text-xs font-mono text-muted-foreground text-right">{dimensions.height}px</div>
                </div>
              </div>
            </div>
          </div>

          {/* Simulation Parameters */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-yellow-400"></div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
                {selectedPattern.controls ? "Simulation Parameters" : "Pattern Controls"}
              </h3>
            </div>
            {selectedPattern.controls ? (
              <div className="space-y-4">
                {/* Navigation buttons first - only for 1D CELLULAR AUTOMATA */}
                {selectedPattern.id === 'cellular-automaton' && (() => {
                  const buttonControls = selectedPattern.controls.filter(control => control.type === 'button')
                  const prevButton = buttonControls.find(c => c.id === 'rulePrev')
                  const nextButton = buttonControls.find(c => c.id === 'ruleNext')
                  const currentRule = getCurrentControlValues()['rule'] ?? 30

                  return (
                    (prevButton || nextButton) && (
                      <div className="space-y-3">
                        {/* Rule Number Header */}
                        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                          Rule Number
                        </div>

                        <div className="flex items-center space-x-6">
                          {prevButton && (
                            <Button
                              onClick={() => {
                                handleControlChange(prevButton.id, true)
                                setTimeout(() => handleControlChange(prevButton.id, false), 100)
                              }}
                              variant="outline"
                              size="sm"
                              className="font-mono text-xs border-border hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950/20"
                            >
                              {prevButton.label}
                            </Button>
                          )}

                          {/* Rule counter display */}
                          <div className="text-xs font-mono text-muted-foreground border border-border bg-background px-3 py-2">
                            {currentRule.toString().padStart(3, '0')} / 255
                          </div>

                          {nextButton && (
                            <Button
                              onClick={() => {
                                handleControlChange(nextButton.id, true)
                                setTimeout(() => handleControlChange(nextButton.id, false), 100)
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
                  )
                })()}

                {/* Main controls grid (excluding buttons) */}
                <div className={`grid gap-4 ${sidebarWidth > 500 ? 'grid-cols-3' : sidebarWidth > 400 ? 'grid-cols-2' : 'grid-cols-1'}`} style={{ gridAutoRows: '1fr' }}>
                  {selectedPattern.controls.filter(control => control.type !== 'button').map((control) => {
                    const currentValue = getCurrentControlValues()[control.id] ?? control.defaultValue

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
                              onChange={(e) => handleControlChange(control.id, control.step && control.step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value))}
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
                              onChange={(e) => handleControlChange(control.id, e.target.value)}
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
                                onChange={(e) => handleControlChange(control.id, e.target.checked)}
                                className="w-4 h-4 accent-yellow-400"
                              />
                              <span className="text-xs font-mono text-muted-foreground uppercase">ENABLED</span>
                            </label>
                          </div>
                        </div>
                      )
                    }
                    return null
                  })}
                </div>

                {/* Button controls at bottom */}
                {selectedPattern.controls.filter(control => {
                  if (control.type !== 'button') return false
                  // For 1D CELLULAR AUTOMATA, exclude navigation buttons (they're rendered at top)
                  if (selectedPattern.id === 'cellular-automaton') {
                    return control.id !== 'rulePrev' && control.id !== 'ruleNext'
                  }
                  // For other patterns, include all button controls
                  return true
                }).map((control) => {
                  const currentValue = getCurrentControlValues()[control.id] ?? control.defaultValue
                  return (
                    <div key={control.id} className="pt-2">
                      <Button
                        onClick={() => {
                          handleControlChange(control.id, !currentValue)
                          // Auto-reset the button state after a brief moment
                          setTimeout(() => handleControlChange(control.id, false), 100)
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full font-mono text-xs border-border hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950/20 uppercase"
                      >
                        {control.label}
                      </Button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="border border-border p-3 bg-background">
                <div className="text-xs font-mono text-muted-foreground mb-3 uppercase">No Controls Available</div>
                <div className="text-xs text-muted-foreground/60">This pattern does not have interactive controls</div>
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  )
}
