// AIDEV-NOTE: Extracted desktop layout event handlers from 747-line component for better maintainability
"use client"

import { useCallback, useEffect } from "react"
import type { DesktopLayoutState, DesktopLayoutActions } from "./hooks/use-desktop-layout-state"

export interface DesktopLayoutHandlers {
  // Pattern navigation
  handlePatternSelect: (patternId: string) => void
  
  // Sidebar resizing
  handleMouseDown: (e: React.MouseEvent) => void
  handleMouseMove: (e: MouseEvent) => void
  handleMouseUp: () => void
}

export function useDesktopLayoutHandlers(
  state: DesktopLayoutState,
  actions: DesktopLayoutActions
): DesktopLayoutHandlers {
  const {
    isResizing,
  } = state

  const {
    setSelectedPatternId,
    setSidebarWidth,
    setIsResizing,
  } = actions

  // AIDEV-NOTE: Simple pattern selection for scroll-based UI
  const handlePatternSelect = (patternId: string) => {
    setSelectedPatternId(patternId)
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
    handlePatternSelect,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  }
}