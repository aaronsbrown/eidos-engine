// AIDEV-NOTE: Extracted desktop layout sidebar from main component for better maintainability
"use client"

import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PatternCategoryManager } from "@/lib/pattern-category-manager"
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
  } = state

  const {
    handlePatternSelect,
  } = handlers

  const categoryManager = React.useMemo(() => new PatternCategoryManager(patternGenerators), [])

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

          {/* Pattern List - Simple Scroll Implementation */}
          <ScrollArea className="h-96"> {/* AIDEV-NOTE: Fixed height (384px) to match original container size for proper scrolling */}
            <div className="space-y-1 pl-3 pr-3"> {/* AIDEV-NOTE: Symmetric padding for balanced layout */}
              {categoryManager.getCategories().map((category) => {
                const categoryPatterns = categoryManager.getPatternsByCategory(category)
                
                return (
                  <div key={category}>
                    {/* Category Divider */}
                    <div className="flex items-center my-4 px-1">
                      <div className="flex-1 h-px bg-border"></div>
                      <div className="px-2 text-xs font-mono text-foreground bg-background border border-border uppercase tracking-wider">
                        {category}
                      </div>
                      <div className="flex-1 h-px bg-border"></div>
                    </div>
                    
                    {/* Category Patterns */}
                    {categoryPatterns.map((pattern) => (
                      <div key={pattern.id} className="mb-1">
                        <button
                          onClick={() => handlePatternSelect(pattern.id)}
                          className={`w-full text-left p-3 border transition-all font-mono text-xs ${selectedPatternId === pattern.id
                            ? "bg-accent-primary-subtle dark:bg-accent-primary-subtle border-accent-primary text-foreground"
                            : "bg-background border-border hover:border-muted-foreground text-muted-foreground hover:bg-muted/50"
                            }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="uppercase tracking-wider">{pattern.name}</span>
                            <span className="text-muted-foreground/60">{(categoryManager.getPatternIndex(pattern.id) + 1).toString().padStart(2, '0')}</span>
                          </div>
                          <div className="text-muted-foreground/80 mt-1">{pattern.id}</div>
                        </button>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
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