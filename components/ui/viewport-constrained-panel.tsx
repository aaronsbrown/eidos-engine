// AIDEV-NOTE: Viewport-constrained panel with responsive height calculation - Issue #19 COMPLETE  
// Automatically constrains content height to viewport with debounced resize handling and keyboard scrolling
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface ViewportConstrainedPanelProps {
  children: React.ReactNode
  headerHeight?: number
  footerHeight?: number
  paddingBuffer?: number
  minHeight?: number
  className?: string
}

export default function ViewportConstrainedPanel({
  children,
  headerHeight = 0,
  footerHeight = 0,
  paddingBuffer = 32,
  minHeight = 200,
  className = ''
}: ViewportConstrainedPanelProps) {
  const [maxHeight, setMaxHeight] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const resizeTimeoutRef = useRef<number | undefined>(undefined)

  const calculateMaxHeight = useCallback(() => {
    const viewportHeight = window.innerHeight || 600 // Fallback for SSR
    const calculatedHeight = viewportHeight - headerHeight - footerHeight - paddingBuffer
    
    // Ensure we don't set a negative or too small height
    const finalHeight = Math.max(calculatedHeight, minHeight)
    setMaxHeight(finalHeight)
  }, [headerHeight, footerHeight, paddingBuffer, minHeight])

  const debouncedResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current)
    }
    
    resizeTimeoutRef.current = window.setTimeout(() => {
      calculateMaxHeight()
    }, 100) // 100ms debounce
  }, [calculateMaxHeight])

  useEffect(() => {
    // Calculate initial height
    calculateMaxHeight()

    // Add resize listener
    window.addEventListener('resize', debouncedResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', debouncedResize)
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
    }
  }, [calculateMaxHeight, debouncedResize])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!containerRef.current) return

    const container = containerRef.current
    const scrollAmount = 40 // pixels to scroll

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        container.scrollTop += scrollAmount
        break
      case 'ArrowUp':
        e.preventDefault()
        container.scrollTop -= scrollAmount
        break
      case 'PageDown':
        e.preventDefault()
        container.scrollTop += container.clientHeight - scrollAmount
        break
      case 'PageUp':
        e.preventDefault()
        container.scrollTop -= container.clientHeight - scrollAmount
        break
      case 'Home':
        e.preventDefault()
        container.scrollTop = 0
        break
      case 'End':
        e.preventDefault()
        container.scrollTop = container.scrollHeight
        break
    }
  }

  return (
    <div
      ref={containerRef}
      data-testid="viewport-constrained-panel"
      role="region"
      aria-label="Scrollable control panel"
      tabIndex={0}
      className={`overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-inset ${className}`}
      style={{ maxHeight: `${maxHeight}px` }}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  )
}