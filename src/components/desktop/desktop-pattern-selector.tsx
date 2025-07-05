// AIDEV-NOTE: Experimental desktop pattern selector component for Storybook testing
// This component explores different UX approaches: ScrollArea + accordion vs simple scroll vs pagination
"use client"

import React, { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { patternGenerators } from "@/components/pattern-generators"
import type { MixedPatternGenerator } from "@/components/pattern-generators/types"
import { PatternCategoryManager, type PatternCategory } from "@/lib/pattern-category-manager"

export interface DesktopPatternSelectorProps {
  selectedPatternId: string
  onPatternSelect: (patternId: string) => void
  variant?: 'accordion' | 'simple-scroll' | 'pagination-current'
  className?: string
}

export function DesktopPatternSelector({
  selectedPatternId,
  onPatternSelect,
  variant = 'accordion',
  className = ''
}: DesktopPatternSelectorProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<PatternCategory>>(
    new Set(['Attractors', 'Noise', 'Geometric', 'Simulation', 'Data Visualization'])
  )

  const categoryManager = React.useMemo(() => new PatternCategoryManager(patternGenerators), [])

  const toggleCategory = (category: PatternCategory) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const renderPatternCard = (pattern: MixedPatternGenerator, showCategory = false) => (
    <button
      key={pattern.id}
      onClick={() => onPatternSelect(pattern.id)}
      className={`w-full text-left p-3 border transition-all font-mono text-xs ${
        selectedPatternId === pattern.id
          ? "bg-accent-primary-subtle dark:bg-accent-primary-subtle border-accent-primary text-foreground"
          : "bg-background border-border hover:border-muted-foreground text-muted-foreground hover:bg-muted/50"
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="uppercase tracking-wider">{pattern.name}</span>
        {/* AIDEV-NOTE: Removed pattern numbers as suggested - cleaner UI */}
      </div>
      {/* AIDEV-NOTE: Removed duplicate pattern ID as suggested - reduces redundancy */}
      {showCategory && (
        <div className="text-muted-foreground/60 mt-1 text-xs">{pattern.category}</div>
      )}
    </button>
  )

  if (variant === 'accordion') {
    return (
      <div className={`flex flex-col ${className}`}>
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-accent-primary"></div>
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Pattern Selection</h2>
        </div>

        <ScrollArea className="flex-1 px-6 h-80"> {/* AIDEV-NOTE: Fixed height needed to constrain accordion expansion within container bounds */}
          <div className="space-y-2">
            {categoryManager.getCategories().map((category) => {
              const categoryPatterns = categoryManager.getPatternsByCategory(category)
              const isExpanded = expandedCategories.has(category)

              return (
                <div key={category} className="border border-border rounded">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full p-3 flex items-center justify-between bg-background hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono uppercase tracking-wider text-foreground">
                        {category}
                      </span>
                      <span className="text-xs text-muted-foreground">({categoryPatterns.length})</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>

                  {/* Category Patterns */}
                  {isExpanded && (
                    <div className="border-t border-border">
                      {categoryPatterns.map((pattern) => (
                        <div key={pattern.id} className="border-b border-border last:border-b-0">
                          {renderPatternCard(pattern)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    )
  }

  if (variant === 'simple-scroll') {
    return (
      <div className={`flex flex-col ${className}`}>
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-accent-primary"></div>
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Pattern Selection</h2>
        </div>

        <ScrollArea className="flex-1 h-80"> {/* AIDEV-NOTE: Clean ScrollArea with balanced padding */}
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
                      {renderPatternCard(pattern)}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    )
  }

  // variant === 'pagination-current' - simplified version of current approach for comparison
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-2 h-2 bg-accent-primary"></div>
        <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Pattern Selection (Current)</h2>
      </div>

      <div className="px-6">
        <div className="space-y-1 max-h-96 overflow-hidden">
          {patternGenerators.slice(0, 5).map((pattern) => (
            <div key={pattern.id}>
              {renderPatternCard(pattern)}
            </div>
          ))}
        </div>
        <div className="mt-2 text-center text-muted-foreground text-xs">
          Showing 5 of {patternGenerators.length} patterns
        </div>
      </div>
    </div>
  )
}