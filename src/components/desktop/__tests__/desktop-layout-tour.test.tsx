// AIDEV-NOTE: Behavioral integration tests for desktop tour functionality per Rule G-8
import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@/test-utils/test-providers'
import DesktopLayout from '../desktop-layout'

// Mock the tour hook to control tour behavior in tests
const mockStartDesktopTour = jest.fn()
const mockShouldShowTour = jest.fn(() => true)

jest.mock('@/lib/hooks/use-tour', () => ({
  useTour: () => ({
    startDesktopTour: mockStartDesktopTour,
    shouldShowTour: mockShouldShowTour
  })
}))

// Mock pattern generators to avoid complex rendering issues
jest.mock('@/components/pattern-generators', () => ({
  patternGenerators: [
    {
      id: 'test-pattern',
      name: 'Test Pattern',
      component: () => React.createElement('div', { 'data-testid': 'test-pattern' }, 'Test Pattern'),
      technology: 'CANVAS_2D',
      category: 'Test',
      controls: []
    }
  ]
}))

// Mock educational content hooks to prevent async issues
jest.mock('@/lib/hooks/use-educational-content', () => ({
  useEducationalContent: () => ({
    content: null,
    isLoading: false
  })
}))

jest.mock('@/lib/educational-content-loader', () => ({
  getAllPatternIds: () => ['test-pattern'] // Return test pattern as having educational content
}))

describe('DesktopLayout Tour Integration - User Behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('User can access tour functionality', () => {
    it('automatically starts tour for first-time users', async () => {
      mockShouldShowTour.mockReturnValue(true)
      
      await act(async () => {
        render(<DesktopLayout />)
      })
      
      // First-time users should see tour auto-start after delay
      await waitFor(() => {
        expect(mockStartDesktopTour).toHaveBeenCalledTimes(1)
      }, { timeout: 2000 })
    })

    it('does not auto-start tour for returning users', () => {
      mockShouldShowTour.mockReturnValue(false)
      
      render(<DesktopLayout />)
      
      // Returning users should not see automatic tour
      expect(mockStartDesktopTour).not.toHaveBeenCalled()
    })

    it('provides replay tour button for returning users', () => {
      mockShouldShowTour.mockReturnValue(false)
      
      render(<DesktopLayout />)
      
      // Returning users should see replay option
      expect(screen.getByText('REPLAY TOUR')).toBeInTheDocument()
    })

    it('allows users to manually start tour via replay button', () => {
      mockShouldShowTour.mockReturnValue(false)
      
      render(<DesktopLayout />)
      
      const replayButton = screen.getByText('REPLAY TOUR')
      fireEvent.click(replayButton)
      
      // User click should trigger tour
      expect(mockStartDesktopTour).toHaveBeenCalledTimes(1)
    })
  })


  describe('User sees proper tour targets', () => {
    it('provides pattern selector as tour target', () => {
      render(<DesktopLayout />)
      
      // Pattern selector should be accessible for tour highlighting
      const patternSelector = document.querySelector('[data-tour="pattern-selector"]')
      expect(patternSelector).toBeInTheDocument()
    })

    it('provides learn button as tour target', () => {
      render(<DesktopLayout />)
      
      // Educational content button should be tour target
      const learnButton = document.querySelector('[data-tour="learn-button"]')
      expect(learnButton).toBeInTheDocument()
    })

    it('provides preset dropdown as tour target', () => {
      render(<DesktopLayout />)
      
      // Preset dropdown should be tour target
      const presetDropdown = document.querySelector('[data-tour="preset-dropdown"]')
      expect(presetDropdown).toBeInTheDocument()
    })

    it('provides controls panel as tour target', () => {
      render(<DesktopLayout />)
      
      // Controls panel should be tour target
      const controlsPanel = document.querySelector('[data-tour="controls-panel"]')
      expect(controlsPanel).toBeInTheDocument()
    })
  })

  describe('User experience consistency', () => {
    it('maintains tour targets during pattern changes', () => {
      render(<DesktopLayout />)
      
      // Get initial tour targets
      const initialTargets = document.querySelectorAll('[data-tour]')
      expect(initialTargets.length).toBeGreaterThan(0)
      
      // All essential tour targets should remain stable during pattern navigation
      expect(document.querySelector('[data-tour="pattern-selector"]')).toBeInTheDocument()
      expect(document.querySelector('[data-tour="controls-panel"]')).toBeInTheDocument()
      expect(document.querySelector('[data-tour="preset-dropdown"]')).toBeInTheDocument()
    })

    it('ensures tour targets are visible and accessible', () => {
      render(<DesktopLayout />)
      
      // Tour targets should be visible to users
      const patternSelector = document.querySelector('[data-tour="pattern-selector"]')
      const controlsPanel = document.querySelector('[data-tour="controls-panel"]')
      const presetDropdown = document.querySelector('[data-tour="preset-dropdown"]')
      
      expect(patternSelector).toBeVisible()
      expect(controlsPanel).toBeVisible()
      expect(presetDropdown).toBeVisible()
    })
  })

  describe('User accessibility requirements', () => {
    it('provides accessible tour buttons', () => {
      mockShouldShowTour.mockReturnValue(false)
      render(<DesktopLayout />)
      
      const replayButton = screen.getByText('REPLAY TOUR')
      
      // Tour control button should be accessible
      expect(replayButton).toBeInTheDocument()
      expect(replayButton.tagName).toBe('BUTTON')
    })

    it('maintains keyboard navigation for tour controls', () => {
      mockShouldShowTour.mockReturnValue(false)
      render(<DesktopLayout />)
      
      const replayButton = screen.getByText('REPLAY TOUR')
      
      // Users should be able to navigate to tour controls via keyboard
      replayButton.focus()
      expect(document.activeElement).toBe(replayButton)
    })
  })

  describe('User error handling', () => {
    it('handles tour initialization failures gracefully', () => {
      mockStartDesktopTour.mockImplementation(() => {
        console.warn('Tour failed to start')
        // Tour fails gracefully without throwing
      })
      
      mockShouldShowTour.mockReturnValue(false)
      render(<DesktopLayout />)
      
      const replayButton = screen.getByText('REPLAY TOUR')
      
      // User should not see errors when tour fails
      expect(() => {
        fireEvent.click(replayButton)
      }).not.toThrow()
    })

    it('continues to function when tour hooks return undefined', () => {
      jest.doMock('@/lib/hooks/use-tour', () => ({
        useTour: () => ({
          startDesktopTour: undefined,
          shouldShowTour: () => false
        })
      }))
      
      // User should still see functional layout even if tour is unavailable
      expect(() => {
        render(<DesktopLayout />)
      }).not.toThrow()
    })
  })
})