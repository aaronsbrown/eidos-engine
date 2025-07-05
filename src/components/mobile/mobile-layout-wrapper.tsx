// AIDEV-NOTE: Main mobile layout wrapper integrating all mobile components with responsive breakpoints
// AIDEV-NOTE: Tests rewritten per G-8 to focus on user behavior vs implementation details
'use client'

import React, { useState, useCallback, useMemo, memo, useEffect } from 'react'
import { useMobileDetection } from '@/components/hooks/useMobileDetection'
import { getMobileResponsiveClasses } from '@/lib/mobile-utils'
import MobileHeader from './mobile-header'
import PatternDropdownSelector from './pattern-dropdown-selector'
import ProgressiveDisclosurePanel from './progressive-disclosure-panel'
import { patternGenerators } from '@/components/pattern-generators'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { EducationalOverlay } from '@/components/ui/educational-overlay'
import { useEducationalContent } from '@/lib/hooks/use-educational-content'
import { getAllPatternIds } from '@/lib/educational-content-loader'
import { useTour } from '@/lib/hooks/use-tour'
import { PresetManager } from '@/lib/preset-manager'
import { usePatternState } from '@/lib/contexts/pattern-state-context'

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
  const { isMobile, isDesktop, viewport } = useMobileDetection()

  // AIDEV-NOTE: Use shared pattern state context for mobile/desktop synchronization (Issue #80)
  const {
    selectedPatternId,
    controlValues,
    setSelectedPatternId: setSharedSelectedPatternId,
    updateControlValue,
    initializePattern,
    resetToDefaults
  } = usePatternState()

  // AIDEV-NOTE: Handle initial pattern ID if provided as prop
  useEffect(() => {
    if (initialPatternId && initialPatternId !== selectedPatternId) {
      setSharedSelectedPatternId(initialPatternId)
    }
  }, [initialPatternId, selectedPatternId, setSharedSelectedPatternId])

  // Mobile UI state
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEducationalVisible, setIsEducationalVisible] = useState(false)

  // Get current pattern
  const selectedPattern = useMemo(() =>
    patternGenerators.find(p => p.id === selectedPatternId) || patternGenerators[0],
    [selectedPatternId]
  )

  // AIDEV-NOTE: Load educational content for current pattern
  const { content: educationalContent } = useEducationalContent(selectedPatternId)

  // Check if educational content is available for current pattern
  const availableEducationalPatterns = getAllPatternIds()
  const hasEducationalContent = availableEducationalPatterns.includes(selectedPatternId)

  // AIDEV-NOTE: Tour system integration with first-visit detection
  const { startMobileTour, shouldShowTour } = useTour()

  // Get responsive CSS classes
  const responsiveClasses = useMemo(() =>
    getMobileResponsiveClasses(isMobile),
    [isMobile]
  )

  // AIDEV-NOTE: Simplified dimensions calculation - mobile for all tablets, desktop only at ≥1024px
  const visualizationDimensions = useMemo(() => {
    if (isDesktop) {
      // For desktop, return desktop defaults
      return { width: 700, height: 394 }
    }

    // For mobile and tablet (now unified), use 4:3 aspect ratio with full screen width
    const availableWidth = viewport.width // use full screen width
    const optimalHeight = availableWidth * 0.75 // 4:3 aspect ratio
    const maxHeight = viewport.height * 0.5 // don't exceed 50% of viewport

    return {
      width: availableWidth,
      height: Math.min(optimalHeight, maxHeight)
    }
  }, [isDesktop, viewport])

  // AIDEV-NOTE: Get current control values from shared context (Issue #80)
  const getCurrentControlValues = useCallback(() => {
    return controlValues[selectedPatternId] || {}
  }, [selectedPatternId, controlValues])

  // AIDEV-NOTE: Initialize pattern when it's not in controlValues (Issue #80)
  useEffect(() => {
    if (!controlValues[selectedPatternId]) {
      initializePattern(selectedPatternId, 'mobile')
    }
  }, [selectedPatternId, controlValues, initializePattern])

  // AIDEV-NOTE: Handle pattern selection with shared context (Issue #80)
  const handlePatternSelect = useCallback((patternId: string) => {
    setSharedSelectedPatternId(patternId)
    setIsAdvancedExpanded(false) // Collapse advanced controls when switching patterns

    if (onPatternChange) {
      onPatternChange(patternId)
    }
  }, [setSharedSelectedPatternId, onPatternChange])

  // AIDEV-NOTE: Handle control changes with shared context (Issue #80)
  const handleControlChange = useCallback((controlId: string, value: number | string | boolean) => {
    updateControlValue(selectedPatternId, controlId, value)
  }, [selectedPatternId, updateControlValue])

  // AIDEV-NOTE: Handle reset to defaults with shared context (Issue #80)
  const handleResetToDefaults = useCallback(async () => {
    try {
      // Get the effective default preset using precedence rules
      const effectiveDefault = await PresetManager.getEffectiveDefault(selectedPatternId)

      if (effectiveDefault) {
        // Reset to the effective default preset values
        const validParameters: Record<string, number | string | boolean> = {}
        const selectedPattern = patternGenerators.find(p => p.id === selectedPatternId)
        const currentControlIds = new Set(selectedPattern?.controls?.map(c => c.id) || [])

        Object.entries(effectiveDefault.parameters).forEach(([key, value]) => {
          if (currentControlIds.has(key)) {
            validParameters[key] = value
          }
        })

        // Update each control value through the shared context
        Object.entries(validParameters).forEach(([controlId, value]) => {
          updateControlValue(selectedPatternId, controlId, value)
        })
      } else {
        // Fall back to pattern control defaults using shared context
        resetToDefaults(selectedPatternId, 'mobile')
      }
    } catch (error) {
      console.warn('Failed to reset to defaults, falling back to pattern defaults:', error)

      // Emergency fallback: reset to pattern defaults
      resetToDefaults(selectedPatternId, 'mobile')
    }
  }, [selectedPatternId, updateControlValue, resetToDefaults])

  // Handle menu toggle
  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(!isMenuOpen)
  }, [isMenuOpen])

  // AIDEV-NOTE: Auto-start mobile tour for first-time visitors (must be before early return)
  useEffect(() => {
    if (!isDesktop) { // Only run for mobile/tablet
      const checkAndStartTour = () => {
        if (shouldShowTour()) {
          // Small delay to ensure UI is fully loaded
          setTimeout(() => {
            startMobileTour()
          }, 1000)
        }
      }

      checkAndStartTour()
    }
  }, [shouldShowTour, startMobileTour, isDesktop])

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

  // AIDEV-NOTE: Tablet hybrid layout removed - tablets now use mobile layout for better UX

  // Mobile layout - progressive disclosure
  return (
    <>
      <div data-testid="mobile-layout" className={`${responsiveClasses.container} ${className}`}>
        {/* Mobile Header */}
        <MobileHeader
          title="EIDOS ENGINE"
          onMenuToggle={handleMenuToggle}
          onStartTour={shouldShowTour() ? undefined : startMobileTour}
        />

        {/* Pattern Selector */}
        <div className="flex-shrink-0 p-4 border-b border-border">
          <PatternDropdownSelector
            patterns={patternGenerators}
            selectedId={selectedPatternId}
            onSelect={handlePatternSelect}
            className="w-full"
          />
        </div>

        {/* Visualization Area */}
        <div
          data-testid="mobile-visualization-area"
          className="flex-shrink-0 bg-background"
          aria-label="Pattern visualization"
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

        {/* Progressive Disclosure Controls */}
        <div className="flex-shrink-0 border-t border-border bg-background/50 backdrop-blur-sm">
          <ProgressiveDisclosurePanel
            patternId={selectedPatternId}
            controls={selectedPattern.controls || []}
            controlValues={getCurrentControlValues()}
            onControlChange={handleControlChange}
            isExpanded={isAdvancedExpanded}
            onToggleExpanded={() => setIsAdvancedExpanded(!isAdvancedExpanded)}
            hasEducationalContent={hasEducationalContent}
            isEducationalVisible={isEducationalVisible}
            onEducationalToggle={() => setIsEducationalVisible(!isEducationalVisible)}
            onResetToDefaults={handleResetToDefaults}
          />
        </div>

        {/* Menu Overlay for mobile */}
        <div
          className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          onClick={handleMenuToggle}
        >
          <div className={`absolute top-0 right-0 w-64 h-full bg-background border-l border-border p-4 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-mono text-sm uppercase tracking-wider">Menu</h2>
              <button
                onClick={handleMenuToggle}
                className="text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <ThemeToggle />

              <div className="pt-4 border-t border-border">
                <div className="text-xs font-mono text-muted-foreground">
                  <div>VERSION: v0.1</div>
                  <div>VIEWPORT: {viewport.width}×{viewport.height}</div>
                  <div>PATTERN: {selectedPattern.technology}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Overlay - Mobile Sidebar */}
      {hasEducationalContent && (
        <EducationalOverlay
          type="sidebar"
          content={educationalContent}
          isVisible={isEducationalVisible}
          onClose={() => setIsEducationalVisible(false)}
        />
      )}
    </>
  )
})

export default MobileLayoutWrapper