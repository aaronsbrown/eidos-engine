// AIDEV-NOTE: Extracted desktop layout event handlers from 747-line component for better maintainability
"use client"

import { useCallback, useEffect } from "react"
import { patternGenerators } from "@/components/pattern-generators"
import type { DesktopLayoutState, DesktopLayoutActions } from "./hooks/use-desktop-layout-state"

export interface DesktopLayoutHandlers {
  // Pattern navigation
  handlePreviousPattern: () => void
  handleNextPattern: () => void
  handlePatternSelect: (patternId: string) => void
  
  // Scroll handling
  handlePatternScroll: (e: WheelEvent) => void
  
  // Sidebar resizing
  handleMouseDown: (e: React.MouseEvent) => void
  handleMouseMove: (e: MouseEvent) => void
  handleMouseUp: () => void
  
  // Utility functions
  calculateTransformOffset: (startIndex: number) => number
}

export function useDesktopLayoutHandlers(
  state: DesktopLayoutState,
  actions: DesktopLayoutActions
): DesktopLayoutHandlers {
  const {
    selectedPatternId,
    visiblePatternStart,
    patternsPerPage,
    totalPatterns,
    isResizing,
    patternListRef,
    scrollTimeoutRef,
  } = state

  const {
    setSelectedPatternId,
    setVisiblePatternStart,
    setSidebarWidth,
    setIsResizing,
  } = actions

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

  // AIDEV-NOTE: Handle mouse wheel scrolling through patterns - using ref for proper event handling
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
  }, [visiblePatternStart, totalPatterns, patternsPerPage, scrollTimeoutRef, setVisiblePatternStart])

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

  // Handle sidebar resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return
    const newWidth = window.innerWidth - e.clientX
    setSidebarWidth(Math.max(300, Math.min(600, newWidth))) // Min 300px, max 600px
  }, [isResizing, setSidebarWidth])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [setIsResizing])

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
  }, [handlePatternScroll, patternListRef, scrollTimeoutRef])

  // Add mouse event listeners for resizing
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

  return {
    handlePreviousPattern,
    handleNextPattern,
    handlePatternSelect,
    handlePatternScroll,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    calculateTransformOffset,
  }
}