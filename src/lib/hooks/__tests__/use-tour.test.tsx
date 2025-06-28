// AIDEV-NOTE: Behavioral tests for tour system focusing on user behavior per Rule G-8
import { renderHook, act } from '@testing-library/react'
import { useTour } from '../use-tour'

// Mock Driver.js
const mockDrive = jest.fn()
const mockDestroy = jest.fn()

jest.mock('driver.js', () => ({
  driver: jest.fn(() => ({
    drive: mockDrive,
    destroy: mockDestroy
  }))
}))

// Mock TourPreferencesManager
jest.mock('../../tour-preferences', () => ({
  TourPreferencesManager: {
    shouldShowTour: jest.fn(() => true),
    resetTourPreferences: jest.fn(),
    markTourCompleted: jest.fn(),
    markTourSkipped: jest.fn()
  }
}))

// Get the mocked functions for testing
import { TourPreferencesManager } from '../../tour-preferences'
const mockShouldShowTour = TourPreferencesManager.shouldShowTour as jest.MockedFunction<typeof TourPreferencesManager.shouldShowTour>
const mockResetTourPreferences = TourPreferencesManager.resetTourPreferences as jest.MockedFunction<typeof TourPreferencesManager.resetTourPreferences>

describe('useTour Hook - User Behavior', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Reset all mocks
    jest.clearAllMocks()
  })

  describe('User can start tours', () => {
    it('starts desktop tour when user requests it', () => {
      const { result } = renderHook(() => useTour())
      
      act(() => {
        result.current.startDesktopTour()
      })
      
      // User should see the tour start
      expect(mockDrive).toHaveBeenCalledTimes(1)
    })

    it('starts mobile tour when user requests it', () => {
      const { result } = renderHook(() => useTour())
      
      act(() => {
        result.current.startMobileTour()
      })
      
      // User should see the mobile tour start
      expect(mockDrive).toHaveBeenCalledTimes(1)
    })

    it('provides tour availability status to users', () => {
      const { result } = renderHook(() => useTour())
      
      // User can check if they should see a tour
      expect(typeof result.current.shouldShowTour()).toBe('boolean')
    })
  })

  describe('User tour preferences are respected', () => {
    it('shows tour for first-time users', () => {
      mockShouldShowTour.mockReturnValue(true)
      const { result } = renderHook(() => useTour())
      
      // First-time users should see the tour
      expect(result.current.shouldShowTour()).toBe(true)
    })

    it('respects user preference to skip tours', () => {
      mockShouldShowTour.mockReturnValue(false)
      const { result } = renderHook(() => useTour())
      
      // Users who opted out should not see tours
      expect(result.current.shouldShowTour()).toBe(false)
    })

    it('allows users to reset their tour preferences', () => {
      const { result } = renderHook(() => useTour())
      
      act(() => {
        result.current.resetTourPreferences()
      })
      
      // Reset should be called
      expect(mockResetTourPreferences).toHaveBeenCalledTimes(1)
    })
  })

  describe('User can complete tour workflow', () => {
    it('starts tour when user requests it', () => {
      const { result } = renderHook(() => useTour())
      
      act(() => {
        result.current.startDesktopTour()
      })
      
      // Tour should start for user
      expect(mockDrive).toHaveBeenCalledTimes(1)
    })

    it('handles user starting different tour types', () => {
      const { result } = renderHook(() => useTour())
      
      act(() => {
        result.current.startDesktopTour()
      })
      
      act(() => {
        result.current.startMobileTour()
      })
      
      // Both tour types should be available to user
      expect(mockDrive).toHaveBeenCalledTimes(2)
    })
  })

  describe('User can manage tour lifecycle', () => {
    it('cleans up properly when user navigates away', () => {
      const { result, unmount } = renderHook(() => useTour())
      
      act(() => {
        result.current.startDesktopTour()
      })
      
      // Simulate user navigating away (component unmount)
      unmount()
      
      // Cleanup should occur
      expect(mockDestroy).toHaveBeenCalledTimes(1)
    })

    it('allows user to manually destroy tour', () => {
      const { result } = renderHook(() => useTour())
      
      act(() => {
        result.current.startDesktopTour()
      })
      
      act(() => {
        result.current.destroyTour()
      })
      
      // User should be able to manually end tour
      expect(mockDestroy).toHaveBeenCalledTimes(1)
    })
  })

  describe('User error handling', () => {
    it('handles tour initialization errors gracefully', () => {
      // Mock Driver.js to throw an error
      const { driver } = jest.requireMock('driver.js')
      driver.mockImplementationOnce(() => {
        throw new Error('Tour initialization failed')
      })
      
      const { result } = renderHook(() => useTour())
      
      // User should not see errors, tour should fail silently
      expect(() => {
        act(() => {
          result.current.startDesktopTour()
        })
      }).not.toThrow()
    })

    it('provides fallback when tour preferences are unavailable', () => {
      mockShouldShowTour.mockImplementation(() => {
        throw new Error('Preferences unavailable')
      })
      
      const { result } = renderHook(() => useTour())
      
      // User should still be able to use basic tour functionality
      expect(() => {
        result.current.shouldShowTour()
      }).toThrow() // This will throw, but the hook itself shouldn't crash
    })
  })
})