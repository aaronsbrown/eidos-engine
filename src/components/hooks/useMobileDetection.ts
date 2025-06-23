// AIDEV-NOTE: Mobile breakpoint detection hook for responsive layout switching
'use client'

import { useState, useEffect, useCallback } from 'react'

export interface ViewportInfo {
  width: number
  height: number
}

export interface MobileDetectionResult {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  viewport: ViewportInfo
}

// Breakpoint constants matching design specifications
const BREAKPOINTS = {
  MOBILE_MAX: 767,
  TABLET_MIN: 768,
  TABLET_MAX: 1023,
  DESKTOP_MIN: 1024
} as const

/**
 * Hook for detecting mobile/tablet/desktop breakpoints and viewport changes
 * Provides responsive state management for mobile-first design
 */
export function useMobileDetection(): MobileDetectionResult {
  const [viewport, setViewport] = useState<ViewportInfo>(() => {
    // Safe SSR defaults
    if (typeof window === 'undefined') {
      return { width: 1024, height: 768 }
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  })

  // Debounced resize handler to prevent excessive updates
  const handleResize = useCallback(() => {
    const newViewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    setViewport(newViewport)
  }, [])

  useEffect(() => {
    // Update viewport on mount to get actual values
    handleResize()

    // Debounced resize listener
    let timeoutId: number | undefined
    
    const debouncedResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = window.setTimeout(handleResize, 100)
    }

    window.addEventListener('resize', debouncedResize)
    
    // Also listen for orientation changes on mobile devices
    window.addEventListener('orientationchange', () => {
      // Delay to allow browser to update viewport after orientation change
      setTimeout(handleResize, 150)
    })

    return () => {
      window.removeEventListener('resize', debouncedResize)
      window.removeEventListener('orientationchange', handleResize)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [handleResize])

  // Calculate current breakpoint based on viewport width
  const isMobile = viewport.width <= BREAKPOINTS.MOBILE_MAX
  const isTablet = viewport.width >= BREAKPOINTS.TABLET_MIN && viewport.width <= BREAKPOINTS.TABLET_MAX
  const isDesktop = viewport.width >= BREAKPOINTS.DESKTOP_MIN

  return {
    isMobile,
    isTablet,
    isDesktop,
    viewport
  }
}

/**
 * Utility function to get breakpoint name for the current viewport
 */
export function getBreakpointName(width: number): 'mobile' | 'tablet' | 'desktop' {
  if (width <= BREAKPOINTS.MOBILE_MAX) return 'mobile'
  if (width <= BREAKPOINTS.TABLET_MAX) return 'tablet'
  return 'desktop'
}

/**
 * Utility function to check if viewport is in touch mode
 * Combines screen size with touch capability detection
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - Legacy support
    navigator.msMaxTouchPoints > 0
  )
}

/**
 * Hook for detecting if user prefers reduced motion
 * Important for mobile accessibility and battery optimization
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

/**
 * Hook for detecting device pixel ratio for high-DPI mobile screens
 * Useful for optimizing canvas rendering on mobile devices
 */
export function useDevicePixelRatio(): number {
  const [pixelRatio, setPixelRatio] = useState(() => {
    if (typeof window === 'undefined') return 1
    return window.devicePixelRatio || 1
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleChange = () => {
      setPixelRatio(window.devicePixelRatio || 1)
    }

    // Listen for pixel ratio changes (rare but possible)
    const mediaQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return pixelRatio
}