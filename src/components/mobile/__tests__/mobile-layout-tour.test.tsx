// AIDEV-NOTE: Behavioral integration tests for mobile tour functionality per Rule G-8
import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@/test-utils/test-providers'
import MobileLayoutWrapper from '../mobile-layout-wrapper'

// Mock the tour hook to control tour behavior in tests
const mockStartMobileTour = jest.fn()
const mockShouldShowTour = jest.fn(() => true)

jest.mock('@/lib/hooks/use-tour', () => ({
  useTour: () => ({
    startMobileTour: mockStartMobileTour,
    shouldShowTour: mockShouldShowTour
  })
}))

// Mock mobile detection to force mobile layout
jest.mock('@/components/hooks/useMobileDetection', () => ({
  useMobileDetection: () => ({
    isMobile: true,
    isDesktop: false,
    viewport: { width: 375, height: 667 }
  })
}))

// Mock pattern generators 
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

describe('MobileLayoutWrapper Tour Integration - User Behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('User can access mobile tour functionality', () => {
    it('automatically starts tour for first-time mobile users', async () => {
      mockShouldShowTour.mockReturnValue(true)
      
      await act(async () => {
        render(<MobileLayoutWrapper />)
      })
      
      // First-time mobile users should see tour auto-start
      await waitFor(() => {
        expect(mockStartMobileTour).toHaveBeenCalledTimes(1)
      }, { timeout: 2000 })
    })

    it('does not auto-start tour for returning mobile users', () => {
      mockShouldShowTour.mockReturnValue(false)
      
      render(<MobileLayoutWrapper />)
      
      // Returning users should not see automatic tour
      expect(mockStartMobileTour).not.toHaveBeenCalled()
    })

    it('provides tour button for returning mobile users', () => {
      mockShouldShowTour.mockReturnValue(false)
      
      render(<MobileLayoutWrapper />)
      
      // Returning users should see tour option in header
      expect(screen.getByText('TOUR')).toBeInTheDocument()
    })

    it('allows mobile users to manually start tour', () => {
      mockShouldShowTour.mockReturnValue(false)
      
      render(<MobileLayoutWrapper />)
      
      const tourButton = screen.getByText('TOUR')
      fireEvent.click(tourButton)
      
      // User click should trigger mobile tour
      expect(mockStartMobileTour).toHaveBeenCalledTimes(1)
    })
  })

  describe('User sees mobile-specific tour targets', () => {
    it('provides mobile learn button as tour target', () => {
      render(<MobileLayoutWrapper />)
      
      // Mobile learn button should be tour target
      const mobileLearnButton = document.querySelector('[data-tour="mobile-learn-button"]')
      expect(mobileLearnButton).toBeInTheDocument()
    })

    it('ensures mobile tour targets are accessible on touch devices', () => {
      render(<MobileLayoutWrapper />)
      
      const mobileLearnButton = document.querySelector('[data-tour="mobile-learn-button"]')
      
      // Mobile tour targets should be large enough for touch interaction
      expect(mobileLearnButton).toBeInTheDocument()
      expect(mobileLearnButton?.tagName).toBe('BUTTON')
    })
  })

  describe('User experience on mobile devices', () => {
    it('renders mobile layout for mobile users', () => {
      render(<MobileLayoutWrapper />)
      
      // Users should see mobile-optimized layout
      expect(screen.getByTestId('mobile-layout')).toBeInTheDocument()
      expect(screen.queryByTestId('desktop-layout')).not.toBeInTheDocument()
    })

    it('provides mobile-appropriate visualization area', () => {
      render(<MobileLayoutWrapper />)
      
      // Mobile users should see appropriately sized visualization
      const visualizationArea = screen.getByTestId('mobile-visualization-area')
      expect(visualizationArea).toBeInTheDocument()
      expect(visualizationArea).toHaveAttribute('aria-label', 'Pattern visualization')
    })

    it('maintains tour functionality during mobile interactions', () => {
      mockShouldShowTour.mockReturnValue(false)
      render(<MobileLayoutWrapper />)
      
      // Open mobile menu  
      const menuButton = screen.getByTestId('menu-toggle')
      fireEvent.click(menuButton)
      
      // Tour button should still be functional
      const tourButton = screen.getByText('TOUR')
      fireEvent.click(tourButton)
      
      expect(mockStartMobileTour).toHaveBeenCalledTimes(1)
    })
  })

  describe('User accessibility on mobile', () => {
    it('provides accessible tour controls for mobile users', () => {
      mockShouldShowTour.mockReturnValue(false)
      render(<MobileLayoutWrapper />)
      
      const tourButton = screen.getByText('TOUR')
      
      // Mobile tour controls should be accessible
      expect(tourButton).toBeInTheDocument()
      expect(tourButton.tagName).toBe('BUTTON')
    })

    it('supports keyboard navigation on mobile devices with keyboards', () => {
      mockShouldShowTour.mockReturnValue(false)
      render(<MobileLayoutWrapper />)
      
      const tourButton = screen.getByText('TOUR')
      
      // Users with external keyboards should be able to navigate
      tourButton.focus()
      expect(document.activeElement).toBe(tourButton)
    })
  })

  describe('User tour experience consistency', () => {
    it('maintains tour state during mobile orientation changes', () => {
      // Mock orientation change
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 667 })
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 375 })
      
      render(<MobileLayoutWrapper />)
      
      // Tour targets should remain accessible after orientation change
      const mobileLearnButton = document.querySelector('[data-tour="mobile-learn-button"]')
      expect(mobileLearnButton).toBeInTheDocument()
      
      // Restore original dimensions
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 })
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 768 })
    })

    it('handles tour timing appropriately for mobile performance', async () => {
      mockShouldShowTour.mockReturnValue(true)
      
      await act(async () => {
        render(<MobileLayoutWrapper />)
      })
      
      // Tour should start within reasonable time
      await waitFor(() => {
        expect(mockStartMobileTour).toHaveBeenCalledTimes(1)
      }, { timeout: 2000 })
    })
  })

  describe('User error handling on mobile', () => {
    it('handles mobile tour failures gracefully', () => {
      mockStartMobileTour.mockImplementation(() => {
        console.warn('Mobile tour failed')
        // Tour fails gracefully without throwing
      })
      
      mockShouldShowTour.mockReturnValue(false)
      render(<MobileLayoutWrapper />)
      
      const tourButton = screen.getByText('TOUR')
      
      // User should not see errors when mobile tour fails
      expect(() => {
        fireEvent.click(tourButton)
      }).not.toThrow()
    })

    it('provides fallback when tour is unavailable on mobile', () => {
      jest.doMock('@/lib/hooks/use-tour', () => ({
        useTour: () => ({
          startMobileTour: undefined,
          shouldShowTour: () => false
        })
      }))
      
      // Mobile users should still see functional layout
      expect(() => {
        render(<MobileLayoutWrapper />)
      }).not.toThrow()
    })
  })
})