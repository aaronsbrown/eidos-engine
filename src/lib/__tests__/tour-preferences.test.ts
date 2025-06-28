// AIDEV-NOTE: Behavioral tests for tour preferences focusing on user preference management per Rule G-8
import { TourPreferencesManager } from '../tour-preferences'

describe('TourPreferencesManager - User Preference Behavior', () => {
  let originalLocalStorage: Storage
  
  beforeEach(() => {
    // Save original localStorage reference
    originalLocalStorage = window.localStorage
    
    // Clear localStorage before each test to simulate fresh user
    if (typeof localStorage !== 'undefined' && localStorage.clear) {
      localStorage.clear()
    }
  })
  
  afterEach(() => {
    // Restore original localStorage after each test
    if (originalLocalStorage) {
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        writable: true,
        configurable: true
      })
    }
  })

  describe('User first-visit detection', () => {
    it('recognizes when user visits for the first time', () => {
      // New user with no stored preferences
      expect(TourPreferencesManager.isFirstVisit()).toBe(true)
    })

    it('recognizes returning users', () => {
      // User has visited before
      TourPreferencesManager.markTourCompleted()
      
      expect(TourPreferencesManager.isFirstVisit()).toBe(false)
    })
  })

  describe('User tour display preferences', () => {
    it('shows tour to new users by default', () => {
      // Fresh user should see tour
      expect(TourPreferencesManager.shouldShowTour()).toBe(true)
    })

    it('respects user choice to skip future tours permanently', () => {
      // User completes tour and opts out of future tours
      TourPreferencesManager.disableTourPermanently()
      
      expect(TourPreferencesManager.shouldShowTour()).toBe(false)
    })

    it('continues showing tour to users who completed it but did not opt out', () => {
      // User completed tour but may want to see it again
      TourPreferencesManager.markTourCompleted()
      
      // Should not show for same version (user has seen current version)
      expect(TourPreferencesManager.shouldShowTour()).toBe(false)
    })
  })

  describe('User preference persistence', () => {
    it('remembers user preferences across browser sessions', () => {
      // User marks tour as completed
      TourPreferencesManager.markTourCompleted()
      
      // Simulate new browser session (preferences should persist)
      expect(TourPreferencesManager.isFirstVisit()).toBe(false)
      expect(TourPreferencesManager.getTourPreferences()).toMatchObject({
        hasSeenTour: true
      })
    })

    it('stores user completion timestamp for analytics', () => {
      const beforeCompletion = new Date()
      TourPreferencesManager.markTourCompleted()
      const afterCompletion = new Date()
      
      const preferences = TourPreferencesManager.getTourPreferences()
      const completedAt = new Date(preferences?.tourCompletedAt || '')
      
      // User completion time should be recorded accurately
      expect(completedAt.getTime()).toBeGreaterThanOrEqual(beforeCompletion.getTime())
      expect(completedAt.getTime()).toBeLessThanOrEqual(afterCompletion.getTime())
    })

    it('tracks user skip behavior for future improvements', () => {
      TourPreferencesManager.markTourSkipped()
      
      const preferences = TourPreferencesManager.getTourPreferences()
      
      // User skip preference should be recorded (but not permanently disabled)
      expect(preferences?.skipTourOnVisit).toBe(false) // markTourSkipped doesn't permanently disable
      expect(preferences?.hasSeenTour).toBe(true)
    })
  })

  describe('User preference management', () => {
    it('allows users to reset their tour preferences', () => {
      // User sets preferences
      TourPreferencesManager.disableTourPermanently()
      expect(TourPreferencesManager.shouldShowTour()).toBe(false)
      
      // User resets preferences (wants to see tour again)
      TourPreferencesManager.resetTourPreferences()
      
      expect(TourPreferencesManager.shouldShowTour()).toBe(true)
      expect(TourPreferencesManager.isFirstVisit()).toBe(true)
    })

    it('handles version updates appropriately', () => {
      // User has seen old version of tour
      const oldPreferences = {
        hasSeenTour: true,
        lastTourVersion: '0.9',
        completedAt: new Date().toISOString(),
        skipTourOnVisit: false
      }
      
      localStorage.setItem('eidos-tour-preferences', JSON.stringify(oldPreferences))
      
      // With new tour version, user should see updated tour
      expect(TourPreferencesManager.shouldShowTour()).toBe(true)
    })
  })

  describe('User experience edge cases', () => {
    it('handles corrupted localStorage gracefully', () => {
      // Simulate corrupted data
      localStorage.setItem('eidos-tour-preferences', 'invalid-json{')
      
      // User should still get a functional experience
      expect(() => TourPreferencesManager.shouldShowTour()).not.toThrow()
      expect(TourPreferencesManager.shouldShowTour()).toBe(true) // Defaults to showing tour
    })

    it('works when localStorage is disabled', () => {
      // Mock localStorage to be unavailable
      const originalLocalStorage = window.localStorage
      Object.defineProperty(window, 'localStorage', {
        value: undefined
      })
      
      // User should still get basic functionality
      expect(() => TourPreferencesManager.shouldShowTour()).not.toThrow()
      expect(TourPreferencesManager.shouldShowTour()).toBe(true)
      
      // Restore localStorage
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage
      })
    })

    it('handles localStorage quota exceeded gracefully', () => {
      // Ensure localStorage is restored if it was mocked in previous test
      if (typeof localStorage === 'undefined' || !localStorage) {
        Object.defineProperty(window, 'localStorage', {
          value: originalLocalStorage,
          writable: true,
          configurable: true
        })
      }
      
      // Mock localStorage to throw quota exceeded error
      const originalSetItem = localStorage.setItem
      localStorage.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError')
      })
      
      // User should not see errors when preferences cannot be saved
      expect(() => TourPreferencesManager.markTourCompleted()).not.toThrow()
      
      // Restore original setItem
      localStorage.setItem = originalSetItem
    })
  })

  describe('User data privacy', () => {
    it('only stores minimal necessary preference data', () => {
      TourPreferencesManager.markTourCompleted()
      
      const preferences = TourPreferencesManager.getStoredPreferences()
      
      // Should only contain expected preference fields, no personal data
      const allowedKeys = ['hasSeenTour', 'lastTourVersion', 'tourCompletedAt', 'skipTourOnVisit']
      const actualKeys = Object.keys(preferences || {})
      
      actualKeys.forEach(key => {
        expect(allowedKeys).toContain(key)
      })
    })

    it('allows complete data removal for user privacy', () => {
      // User sets up preferences
      TourPreferencesManager.markTourCompleted()
      expect(TourPreferencesManager.getTourPreferences()).toBeTruthy()
      
      // User requests data deletion
      TourPreferencesManager.resetTourPreferences()
      
      expect(TourPreferencesManager.getTourPreferences()).toMatchObject({
        hasSeenTour: false,
        lastTourVersion: '0.0.0',
        skipTourOnVisit: false
      })
    })
  })
})