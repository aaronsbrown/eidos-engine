// AIDEV-NOTE: Tour preferences and first-visit detection system
export interface TourPreferences {
  hasSeenTour: boolean
  lastTourVersion: string
  tourCompletedAt?: string
  skipTourOnVisit: boolean
}

const TOUR_STORAGE_KEY = 'eidos-engine-tour-preferences'
const CURRENT_TOUR_VERSION = '1.0.0'

export class TourPreferencesManager {
  private static getStoredPreferences(): TourPreferences | null {
    try {
      if (typeof localStorage === 'undefined' || !localStorage) {
        return null
      }
      const stored = localStorage.getItem(TOUR_STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.warn('Failed to read tour preferences:', error)
      return null
    }
  }

  private static savePreferences(preferences: TourPreferences): void {
    try {
      if (typeof localStorage === 'undefined' || !localStorage) {
        return
      }
      localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(preferences))
    } catch (error) {
      console.warn('Failed to save tour preferences:', error)
    }
  }

  static isFirstVisit(): boolean {
    const preferences = this.getStoredPreferences()
    return !preferences || !preferences.hasSeenTour
  }

  static shouldShowTour(): boolean {
    const preferences = this.getStoredPreferences()
    
    if (!preferences) {
      // First visit - show tour
      return true
    }
    
    if (preferences.skipTourOnVisit) {
      // User explicitly disabled tour
      return false
    }
    
    // Show tour if version changed (for major updates)
    return preferences.lastTourVersion !== CURRENT_TOUR_VERSION
  }

  static markTourCompleted(): void {
    const preferences: TourPreferences = {
      hasSeenTour: true,
      lastTourVersion: CURRENT_TOUR_VERSION,
      tourCompletedAt: new Date().toISOString(),
      skipTourOnVisit: false
    }
    this.savePreferences(preferences)
  }

  static markTourSkipped(): void {
    const preferences: TourPreferences = {
      hasSeenTour: true,
      lastTourVersion: CURRENT_TOUR_VERSION,
      skipTourOnVisit: false // Don't permanently disable, just mark as seen
    }
    this.savePreferences(preferences)
  }

  static disableTourPermanently(): void {
    const existing = this.getStoredPreferences()
    const preferences: TourPreferences = {
      ...existing,
      hasSeenTour: true,
      lastTourVersion: CURRENT_TOUR_VERSION,
      skipTourOnVisit: true
    }
    this.savePreferences(preferences)
  }

  static resetTourPreferences(): void {
    try {
      localStorage.removeItem(TOUR_STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to reset tour preferences:', error)
    }
  }

  static getTourPreferences(): TourPreferences {
    return this.getStoredPreferences() || {
      hasSeenTour: false,
      lastTourVersion: '0.0.0',
      skipTourOnVisit: false
    }
  }
}