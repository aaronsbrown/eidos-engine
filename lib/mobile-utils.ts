// AIDEV-NOTE: Mobile utility functions for responsive design and touch interactions
import type { PatternControl } from '@/components/pattern-generators/types'

/**
 * Determines essential controls for a pattern based on impact and usage frequency
 * Returns the most important controls that should always be visible on mobile
 */
export function getEssentialControls(
  patternId: string, 
  controls: PatternControl[]
): PatternControl[] {
  // Pattern-specific essential control mapping
  const essentialControlIds: Record<string, string[]> = {
    'barcode': ['scrollSpeed', 'barDensity', 'scannerSpeed'],
    'frequency': ['updateSpeed', 'intensity', 'colorScheme'],
    'noise': ['noiseScale', 'animationSpeed', 'colorMode'],
    'pixelated-noise': ['pixelSize', 'noiseScale', 'animationSpeed'],
    'brownian-motion': ['particleCount', 'speed', 'brightness'],
    'trigonometric-circle': ['speed'],
    'particle-system': ['particleCount', 'movementSpeed', 'brightness'],
    'cellular-automaton': ['cellSize', 'animationSpeed', 'initialCondition'],
    'four-pole-gradient': ['pole1Color', 'pole2Color', 'interpolationPower']
  }

  const patternEssentials = essentialControlIds[patternId] || []
  
  // Filter controls to only include essential ones, maintaining order
  const essentialControls = controls.filter(control => 
    patternEssentials.includes(control.id)
  )

  // If no pattern-specific mapping, use first 3 controls as fallback
  if (essentialControls.length === 0) {
    return controls.slice(0, 3)
  }

  // Ensure we don't exceed 3 essential controls for mobile layout
  return essentialControls.slice(0, 3)
}

/**
 * Calculates optimal grid column count based on available width and control types
 */
export function getOptimalGridColumns(
  width: number,
  controlCount: number,
  controlTypes: string[]
): number {
  // For very narrow screens, always use single column
  if (width < 350) return 1
  
  // For color controls, prefer 2 columns for better touch targets
  const hasColorControls = controlTypes.includes('color')
  if (hasColorControls && width >= 400) return 2
  
  // For many range controls, use multiple columns if space allows
  const rangeControlCount = controlTypes.filter(type => type === 'range').length
  if (rangeControlCount >= 4 && width >= 500) return 3
  if (rangeControlCount >= 2 && width >= 400) return 2
  
  return 1
}

/**
 * Calculates touch-friendly spacing and padding based on screen size
 */
export function getMobileSpacing(width: number): {
  padding: string
  gap: string
  touchTarget: string
} {
  if (width < 350) {
    return {
      padding: 'p-3',
      gap: 'gap-3',
      touchTarget: 'min-h-[44px]'
    }
  }
  
  if (width < 450) {
    return {
      padding: 'p-4',
      gap: 'gap-4',
      touchTarget: 'min-h-[48px]'
    }
  }
  
  return {
    padding: 'p-6',
    gap: 'gap-6',
    touchTarget: 'min-h-[52px]'
  }
}

/**
 * Determines if a control should be excluded from grouping on mobile
 * Following G-7 requirement to keep reset buttons prominently accessible
 */
export function shouldExcludeFromGrouping(control: PatternControl): boolean {
  // Reset buttons must remain ungrouped for prominence
  if (control.type === 'button' && 
      (control.id.includes('reset') || control.label.toLowerCase().includes('reset'))) {
    return true
  }
  
  // Trigger buttons should also remain prominent
  if (control.type === 'button' && 
      (control.id.includes('trigger') || control.id.includes('Trigger'))) {
    return true
  }
  
  return false
}

/**
 * Generates mobile-friendly control layout configuration
 */
export function getMobileControlLayout(
  patternId: string,
  controls: PatternControl[],
  viewportWidth: number
): {
  essentialControls: PatternControl[]
  ungroupedControls: PatternControl[]
  gridColumns: number
  spacing: ReturnType<typeof getMobileSpacing>
} {
  const essentialControls = getEssentialControls(patternId, controls)
  const ungroupedControls = controls.filter(shouldExcludeFromGrouping)
  
  const controlTypes = essentialControls.map(c => c.type)
  const gridColumns = getOptimalGridColumns(viewportWidth, essentialControls.length, controlTypes)
  const spacing = getMobileSpacing(viewportWidth)
  
  return {
    essentialControls,
    ungroupedControls,
    gridColumns,
    spacing
  }
}

/**
 * Calculates visualization area height considering mobile UI elements
 */
export function calculateVisualizationHeight(
  viewportHeight: number,
  headerHeight: number = 48,
  selectorHeight: number = 44,
  essentialControlsHeight: number = 120
): number {
  const availableHeight = viewportHeight - headerHeight - selectorHeight - essentialControlsHeight
  
  // Ensure minimum visualization height
  const minHeight = 200
  return Math.max(availableHeight, minHeight)
}

/**
 * Optimizes canvas dimensions for mobile rendering performance
 */
export function getOptimalCanvasDimensions(
  containerWidth: number,
  containerHeight: number,
  devicePixelRatio: number = 1
): { width: number; height: number; scale: number } {
  // Limit maximum resolution for mobile performance
  const maxPixels = 500000 // 500k pixels max for mobile
  const totalPixels = containerWidth * containerHeight * Math.pow(devicePixelRatio, 2)
  
  let scale = 1
  if (totalPixels > maxPixels) {
    scale = Math.sqrt(maxPixels / totalPixels)
  }
  
  return {
    width: Math.floor(containerWidth * scale),
    height: Math.floor(containerHeight * scale),
    scale
  }
}

/**
 * Generates mobile-specific CSS classes for responsive design
 */
export function getMobileResponsiveClasses(
  isMobile: boolean,
  isTablet: boolean,
  _isDesktop: boolean
): {
  container: string
  header: string
  content: string
  controls: string
} {
  if (isMobile) {
    return {
      container: 'flex flex-col min-h-screen',
      header: 'flex-shrink-0 h-12',
      content: 'flex-1 flex flex-col',
      controls: 'flex-shrink-0'
    }
  }
  
  if (isTablet) {
    return {
      container: 'flex flex-col md:flex-row min-h-screen',
      header: 'flex-shrink-0 h-12 md:h-16',
      content: 'flex-1 flex flex-col md:flex-row',
      controls: 'md:w-80 flex-shrink-0'
    }
  }
  
  // Desktop - preserve existing layout
  return {
    container: 'flex min-h-screen',
    header: 'fixed top-0 w-full h-16 z-10',
    content: 'flex-1 pt-16',
    controls: 'w-96 flex-shrink-0'
  }
}

/**
 * Utility to detect if device supports haptic feedback
 */
export function supportsHapticFeedback(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check for various haptic APIs
  return !!(
    navigator.vibrate ||
    // @ts-expect-error - WebKit-specific
    window.DeviceMotionEvent?.requestPermission ||
    // @ts-expect-error - Experimental haptic API
    navigator.hapticActuators
  )
}

/**
 * Triggers haptic feedback if supported
 */
export function triggerHapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light'): void {
  if (!supportsHapticFeedback()) return
  
  // Simple vibration patterns for different feedback types
  const patterns = {
    light: [10],
    medium: [20],
    heavy: [30]
  }
  
  if (navigator.vibrate) {
    navigator.vibrate(patterns[type])
  }
}