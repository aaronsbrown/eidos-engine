// AIDEV-NOTE: React hook for Driver.js tour integration - Wet Paint phase exploration
import { useCallback, useEffect } from 'react'
import { TourManager, TourConfig } from '@/lib/tour-manager'

let tourManagerInstance: TourManager | null = null

export function useTour() {
  // Initialize tour manager singleton
  useEffect(() => {
    if (!tourManagerInstance) {
      tourManagerInstance = new TourManager()
    }
    
    // Cleanup on unmount
    return () => {
      if (tourManagerInstance) {
        tourManagerInstance.destroy()
      }
    }
  }, [])

  const startDesktopTour = useCallback(() => {
    if (!tourManagerInstance) return
    
    const config = TourManager.getDesktopTourConfig()
    tourManagerInstance.startTour(config)
  }, [])

  const startMobileTour = useCallback(() => {
    if (!tourManagerInstance) return
    
    const config = TourManager.getMobileTourConfig()
    tourManagerInstance.startTour(config)
  }, [])

  const startCustomTour = useCallback((config: TourConfig) => {
    if (!tourManagerInstance) return
    
    tourManagerInstance.startTour(config)
  }, [])

  const destroyTour = useCallback(() => {
    if (tourManagerInstance) {
      tourManagerInstance.destroy()
    }
  }, [])

  const shouldShowTour = useCallback(() => {
    return TourManager.shouldShowTour()
  }, [])

  const resetTourPreferences = useCallback(() => {
    TourManager.resetTourPreferences()
  }, [])

  return {
    startDesktopTour,
    startMobileTour,
    startCustomTour, 
    destroyTour,
    shouldShowTour,
    resetTourPreferences
  }
}