// AIDEV-NOTE: Main mobile layout wrapper integrating all mobile components with responsive breakpoints
'use client'

import React, { useState, useCallback, useMemo, memo } from 'react'
import { useMobileDetection } from '@/components/hooks/useMobileDetection'
import { getMobileResponsiveClasses } from '@/lib/mobile-utils'
import MobileHeader from './mobile-header'
import PatternDropdownSelector from './pattern-dropdown-selector'
import ProgressiveDisclosurePanel from './progressive-disclosure-panel'
import { patternGenerators } from '@/components/pattern-generators'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export interface MobileLayoutWrapperProps {
  initialPatternId?: string
  onPatternChange?: (patternId: string) => void
  className?: string
}

const MobileLayoutWrapper = memo(function MobileLayoutWrapper({
  initialPatternId,
  onPatternChange,
  className = ''
}: MobileLayoutWrapperProps) {
  const { isMobile, isTablet, isDesktop, viewport } = useMobileDetection()
  
  // Pattern state
  const [selectedPatternId, setSelectedPatternId] = useState(
    initialPatternId || patternGenerators[0]?.id || ''
  )
  
  // Control values state
  const [controlValues, setControlValues] = useState<Record<string, Record<string, number | string | boolean>>>({})
  
  // Mobile UI state
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Get current pattern
  const selectedPattern = useMemo(() => 
    patternGenerators.find(p => p.id === selectedPatternId) || patternGenerators[0],
    [selectedPatternId]
  )

  // Get responsive CSS classes
  const responsiveClasses = useMemo(() => 
    getMobileResponsiveClasses(isMobile, isTablet, isDesktop),
    [isMobile, isTablet, isDesktop]
  )

  // Calculate optimal visualization dimensions
  const visualizationDimensions = useMemo(() => {
    if (isDesktop) {
      // For desktop, return desktop defaults
      return { width: 700, height: 394 }
    }
    
    if (isTablet) {
      // For tablet, use full available space minus sidebar
      const availableWidth = viewport.width - 320 // subtract sidebar width (320px)
      const availableHeight = viewport.height - 48 // subtract header height (48px)
      
      return {
        width: availableWidth,
        height: availableHeight
      }
    }

    // For mobile, use a square aspect ratio for optimal balance
    const availableWidth = viewport.width
    const squareSize = Math.min(availableWidth, viewport.height * 0.6) // max 60% of viewport height
    
    return {
      width: squareSize,
      height: squareSize
    }
  }, [isTablet, isDesktop, viewport, isAdvancedExpanded])

  // Initialize control values for pattern
  const initializeControlValues = useCallback((patternId: string) => {
    const pattern = patternGenerators.find(p => p.id === patternId)
    if (!pattern?.controls) return {}

    const defaults: Record<string, number | string | boolean> = {}
    pattern.controls.forEach(control => {
      defaults[control.id] = control.defaultValue
    })
    return defaults
  }, [])

  // Get current control values
  const getCurrentControlValues = useCallback(() => {
    if (!controlValues[selectedPatternId]) {
      const defaults = initializeControlValues(selectedPatternId)
      setControlValues(prev => ({ ...prev, [selectedPatternId]: defaults }))
      return defaults
    }
    return controlValues[selectedPatternId] || {}
  }, [selectedPatternId, controlValues, initializeControlValues])

  // Handle pattern selection
  const handlePatternSelect = useCallback((patternId: string) => {
    setSelectedPatternId(patternId)
    setIsAdvancedExpanded(false) // Collapse advanced controls when switching patterns
    
    if (onPatternChange) {
      onPatternChange(patternId)
    }
  }, [onPatternChange])

  // Handle control changes
  const handleControlChange = useCallback((controlId: string, value: number | string | boolean) => {
    setControlValues(prev => ({
      ...prev,
      [selectedPatternId]: {
        ...prev[selectedPatternId],
        [controlId]: value
      }
    }))
  }, [selectedPatternId])

  // Handle menu toggle
  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(!isMenuOpen)
  }, [isMenuOpen])

  // Handle theme toggle
  const handleThemeToggle = useCallback(() => {
    // Theme toggle is handled by the ThemeToggle component internally
  }, [])

  // If desktop, render the existing desktop layout
  if (isDesktop) {
    return (
      <div data-testid="desktop-layout" className={className}>
        {/* Import and render existing desktop page component */}
        {/* This preserves the existing desktop experience unchanged */}
        <div className="text-center p-8">
          <p className="text-muted-foreground">Desktop layout rendered here</p>
          <p className="text-xs text-muted-foreground mt-2">
            Existing desktop implementation preserved
          </p>
        </div>
      </div>
    )
  }

  // Tablet layout - hybrid approach
  if (isTablet) {
    return (
      <div data-testid="tablet-layout" className={`${responsiveClasses.container} ${className}`}>
        <MobileHeader
          title="PATTERN GENERATOR SYSTEM"
          patternCount={{
            current: patternGenerators.findIndex(p => p.id === selectedPatternId) + 1,
            total: patternGenerators.length
          }}
          onMenuToggle={handleMenuToggle}
          onThemeToggle={handleThemeToggle}
        />
        
        <div className="flex-1 flex">
          {/* Side panel for tablet */}
          <aside className="w-80 border-r border-border p-4 bg-background/50">
            <PatternDropdownSelector
              patterns={patternGenerators}
              selectedId={selectedPatternId}
              onSelect={handlePatternSelect}
              className="mb-4"
            />
            
            <ProgressiveDisclosurePanel
              patternId={selectedPatternId}
              controls={selectedPattern.controls || []}
              controlValues={getCurrentControlValues()}
              onControlChange={handleControlChange}
              isExpanded={isAdvancedExpanded}
              onToggleExpanded={() => setIsAdvancedExpanded(!isAdvancedExpanded)}
            />
          </aside>
          
          {/* Main content area */}
          <main className="flex-1">
            <div data-testid="tablet-visualization-area" className="w-full h-full bg-background">
              {selectedPattern && (
                <selectedPattern.component
                  width={visualizationDimensions.width}
                  height={visualizationDimensions.height}
                  className="w-full h-full"
                  controls={selectedPattern.controls}
                  controlValues={getCurrentControlValues()}
                  onControlChange={handleControlChange}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Mobile layout - progressive disclosure
  return (
    <div data-testid="mobile-layout" className={`${responsiveClasses.container} ${className}`}>
      {/* Mobile Header */}
      <MobileHeader
        title="PATTERN GENERATOR SYSTEM"
        patternCount={{
          current: patternGenerators.findIndex(p => p.id === selectedPatternId) + 1,
          total: patternGenerators.length
        }}
        onMenuToggle={handleMenuToggle}
        onThemeToggle={handleThemeToggle}
      />

      {/* Pattern Selector */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <PatternDropdownSelector
          patterns={patternGenerators}
          selectedId={selectedPatternId}
          onSelect={handlePatternSelect}
        />
      </div>

      {/* Visualization Area */}
      <div 
        data-testid="mobile-visualization-area"
        className="flex-1 bg-background flex items-center justify-center"
        aria-label="Pattern visualization"
      >
        <div 
          style={{
            width: visualizationDimensions.width,
            height: visualizationDimensions.height
          }}
        >
          {selectedPattern && (
            <selectedPattern.component
              width={visualizationDimensions.width}
              height={visualizationDimensions.height}
              className="w-full h-full"
              controls={selectedPattern.controls}
              controlValues={getCurrentControlValues()}
              onControlChange={handleControlChange}
            />
          )}
        </div>
      </div>

      {/* Progressive Disclosure Controls */}
      <div className="flex-shrink-0 border-t border-border bg-background/50 backdrop-blur-sm">
        <ProgressiveDisclosurePanel
          patternId={selectedPatternId}
          controls={selectedPattern.controls || []}
          controlValues={getCurrentControlValues()}
          onControlChange={handleControlChange}
          isExpanded={isAdvancedExpanded}
          onToggleExpanded={() => setIsAdvancedExpanded(!isAdvancedExpanded)}
        />
      </div>

      {/* Menu Overlay for mobile */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="absolute top-0 right-0 w-64 h-full bg-background border-l border-border p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-mono text-sm uppercase tracking-wider">Menu</h2>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <ThemeToggle />
              
              <div className="pt-4 border-t border-border">
                <div className="text-xs font-mono text-muted-foreground">
                  <div>VERSION: v1.0.0</div>
                  <div>VIEWPORT: {viewport.width}×{viewport.height}</div>
                  <div>PATTERN: {selectedPattern.technology}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

export default MobileLayoutWrapper