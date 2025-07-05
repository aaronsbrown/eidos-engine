// AIDEV-NOTE: Extracted desktop layout state management from 747-line component for better maintainability
"use client"

import { useState, useEffect, useRef } from "react"
import { patternGenerators } from "@/components/pattern-generators"
import type { PatternGeneratorProps } from "@/components/pattern-generators"
import { getPlatformDefaultValue } from "@/lib/semantic-utils"
import { usePatternState } from "@/lib/contexts/pattern-state-context"

// AIDEV-NOTE: Desktop layout responsive breakpoints and sizing constants
export const DESKTOP_LAYOUT_CONSTANTS = {
  // Responsive breakpoints
  SMALL_DESKTOP_BREAKPOINT: 1200, // iPad Pro and smaller desktop screens
  
  // Default visualization dimensions for large screens
  DEFAULT_WIDTH: 700,
  DEFAULT_HEIGHT: 394,
  
  // Responsive sizing for small desktop screens
  VIEWPORT_WIDTH_RATIO: 0.45, // 45% of viewport width
  MIN_VISUALIZATION_WIDTH: 500, // Minimum width to prevent UI overlap
  MAX_VISUALIZATION_WIDTH: 600, // Maximum width for optimal proportions
  
  // Layout spacing (for future calculations if needed)
  LEFT_SIDEBAR_WIDTH: 256, // w-64 = 16rem = 256px
  DEFAULT_RIGHT_SIDEBAR_WIDTH: 380,
} as const

export interface DesktopLayoutState {
  // Pattern and visualization state
  selectedPatternId: string
  dimensions: { width: number; height: number }
  controlValues: Record<string, Record<string, number | string | boolean>>
  
  // UI state
  sidebarWidth: number
  isResizing: boolean
  isPresetPanelOpen: boolean
  isSaveModalOpen: boolean
  isEducationalVisible: boolean
  
  // Current pattern info
  selectedPattern: typeof patternGenerators[0]
  PatternComponent: React.ComponentType<PatternGeneratorProps>
  
  // Refs for event handling
  initializedPatternsRef: React.MutableRefObject<Set<string>>
}

export interface DesktopLayoutActions {
  // Pattern selection
  setSelectedPatternId: (id: string) => void
  
  // Control management
  handleControlChange: (controlId: string, value: number | string | boolean) => void
  getCurrentControlValues: () => Record<string, number | string | boolean>
  initializeControlValues: (patternId: string) => Record<string, number | string | boolean>
  
  // UI state management
  setSidebarWidth: (width: number) => void
  setIsResizing: (resizing: boolean) => void
  setIsPresetPanelOpen: (open: boolean) => void
  setIsSaveModalOpen: (open: boolean) => void
  setIsEducationalVisible: (visible: boolean) => void
  
  // Dimension management
  setDimensions: (dimensions: { width: number; height: number }) => void
}

export function useDesktopLayoutState(): [DesktopLayoutState, DesktopLayoutActions] {
  // AIDEV-NOTE: Use shared pattern state context for mobile/desktop synchronization (Issue #80)
  const {
    selectedPatternId,
    controlValues,
    setSelectedPatternId: setSharedSelectedPatternId,
    updateControlValue,
    initializePattern
  } = usePatternState()

  // Desktop-specific state
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ 
    width: DESKTOP_LAYOUT_CONSTANTS.DEFAULT_WIDTH, 
    height: DESKTOP_LAYOUT_CONSTANTS.DEFAULT_HEIGHT 
  })
  const [sidebarWidth, setSidebarWidth] = useState<number>(DESKTOP_LAYOUT_CONSTANTS.DEFAULT_RIGHT_SIDEBAR_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const [isPresetPanelOpen, setIsPresetPanelOpen] = useState(false) // Track preset panel visibility
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false) // Track save preset modal visibility
  const [isEducationalVisible, setIsEducationalVisible] = useState(false) // Track educational overlay visibility

  // Refs for event handling
  const initializedPatternsRef = useRef<Set<string>>(new Set()) // Track which patterns have been initialized

  const selectedPattern = patternGenerators.find(p => p.id === selectedPatternId) || patternGenerators[0]
  const PatternComponent = selectedPattern.component

  // AIDEV-NOTE: Control value functions updated for shared context (Issue #80)
  const initializeControlValues = (patternId: string) => {
    const pattern = patternGenerators.find(p => p.id === patternId)
    if (!pattern?.controls) return {}

    const defaults: Record<string, number | string | boolean> = {}
    pattern.controls.forEach(control => {
      // Use platform-aware defaults for desktop
      defaults[control.id] = getPlatformDefaultValue(control, 'desktop')
    })
    return defaults
  }

  // Get current control values for the selected pattern
  const getCurrentControlValues = () => {
    return controlValues[selectedPatternId] || {}
  }

  // Handle control changes through shared context
  const handleControlChange = (controlId: string, value: number | string | boolean) => {
    updateControlValue(selectedPatternId, controlId, value)
  }

  // AIDEV-NOTE: Responsive dimensions for smaller desktop screens (like iPad Mini horizontal)
  useEffect(() => {
    const updateDimensions = () => {
      const viewportWidth = window.innerWidth
      
      // For iPad Mini and similar small desktop screens, use more conservative sizing
      if (viewportWidth <= DESKTOP_LAYOUT_CONSTANTS.SMALL_DESKTOP_BREAKPOINT) {
        // Calculate responsive width with constraints
        const calculatedWidth = viewportWidth * DESKTOP_LAYOUT_CONSTANTS.VIEWPORT_WIDTH_RATIO
        const optimalWidth = Math.max(
          DESKTOP_LAYOUT_CONSTANTS.MIN_VISUALIZATION_WIDTH,
          Math.min(DESKTOP_LAYOUT_CONSTANTS.MAX_VISUALIZATION_WIDTH, calculatedWidth)
        )
        
        // Maintain aspect ratio from default dimensions
        const aspectRatio = DESKTOP_LAYOUT_CONSTANTS.DEFAULT_HEIGHT / DESKTOP_LAYOUT_CONSTANTS.DEFAULT_WIDTH
        const optimalHeight = Math.round(optimalWidth * aspectRatio)
        
        setDimensions({ width: Math.round(optimalWidth), height: optimalHeight })
      } else {
        // For larger screens, use default dimensions
        setDimensions({ 
          width: DESKTOP_LAYOUT_CONSTANTS.DEFAULT_WIDTH, 
          height: DESKTOP_LAYOUT_CONSTANTS.DEFAULT_HEIGHT 
        })
      }
    }
    
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [sidebarWidth])

  // AIDEV-NOTE: Initialize control values when pattern changes (Issue #80)
  useEffect(() => {
    if (!controlValues[selectedPatternId]) {
      initializePattern(selectedPatternId, 'desktop')
    }
  }, [selectedPatternId, controlValues, initializePattern])

  const state: DesktopLayoutState = {
    selectedPatternId,
    dimensions,
    controlValues,
    sidebarWidth,
    isResizing,
    isPresetPanelOpen,
    isSaveModalOpen,
    isEducationalVisible,
    selectedPattern,
    PatternComponent,
    initializedPatternsRef,
  }

  const actions: DesktopLayoutActions = {
    setSelectedPatternId: setSharedSelectedPatternId,
    handleControlChange,
    getCurrentControlValues,
    initializeControlValues,
    setSidebarWidth,
    setIsResizing,
    setIsPresetPanelOpen,
    setIsSaveModalOpen,
    setIsEducationalVisible,
    setDimensions,
  }

  return [state, actions]
}