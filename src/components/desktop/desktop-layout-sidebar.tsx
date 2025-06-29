// AIDEV-NOTE: Extracted desktop layout sidebar from main component for better maintainability
"use client"

import React from "react"
import { ArrowUp, ArrowDown } from "lucide-react"
import { patternGenerators } from "@/components/pattern-generators"
import type { DesktopLayoutState } from "@/lib/hooks/use-desktop-layout-state"
import type { DesktopLayoutHandlers } from "@/lib/desktop-layout-handlers"

interface DesktopLayoutSidebarProps {
  state: DesktopLayoutState
  handlers: DesktopLayoutHandlers
  onQuickSave: () => void
  hasEducationalContent: boolean
  setIsEducationalVisible: (visible: boolean) => void
  setIsPresetPanelOpen: (open: boolean) => void
}

export function DesktopLayoutSidebar({
  state,
  handlers,
  // TODO: Use these props once full implementation is complete
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onQuickSave: _onQuickSave,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasEducationalContent: _hasEducationalContent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setIsEducationalVisible: _setIsEducationalVisible,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setIsPresetPanelOpen: _setIsPresetPanelOpen
}: DesktopLayoutSidebarProps) {
  const {
    selectedPatternId,
    selectedPattern,
    dimensions,
    visiblePatternStart,
    patternsPerPage,
    canGoToPrevious,
    canGoToNext,
    patternListRef,
  } = state

  const {
    handlePreviousPattern,
    handleNextPattern,
    handlePatternSelect,
    calculateTransformOffset,
  } = handlers

  return (
    <aside className="w-64 border-r border-border bg-background/50 backdrop-blur-sm flex flex-col">
      {/* AIDEV-NOTE: Made sidebar flex column to enable proper scrolling layout */}
      <div className="p-6 pb-4">
        {/* Pattern Selection Header */}
        <div data-tour="pattern-selector" className="flex flex-col">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-accent-primary"></div>
            <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Pattern Selection</h2>
          </div>

          {/* Previous Pattern Button */}
          <div className="px-6 mb-1">
            <button
              data-testid="pattern-prev-button"
              onClick={handlePreviousPattern}
              disabled={!canGoToPrevious}
              className={`w-full h-6 border transition-all font-mono text-xs flex items-center justify-center ${canGoToPrevious
                ? "border-accent-primary bg-accent-primary hover:bg-accent-primary-strong cursor-pointer"
                : "border-disabled-border bg-disabled-background dark:bg-disabled-background dark:border-disabled-border cursor-not-allowed"
                }`}
            >
              <ArrowUp className={`w-3 h-3 ${canGoToPrevious ? "text-accent-primary-foreground" : "text-muted-foreground"}`} />
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
              data-testid="pattern-next-button"
              onClick={handleNextPattern}
              disabled={!canGoToNext}
              className={`w-full h-6 border transition-all font-mono text-xs flex items-center justify-center ${canGoToNext
                ? "border-accent-primary bg-accent-primary hover:bg-accent-primary-strong cursor-pointer"
                : "border-disabled-border bg-disabled-background dark:bg-disabled-background dark:border-disabled-border cursor-not-allowed"
                }`}
            >
              <ArrowDown className={`w-3 h-3 ${canGoToNext ? "text-accent-primary-foreground" : "text-muted-foreground"}`} />
            </button>
          </div>
        </div>
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
  )
}