// AIDEV-NOTE: TDD implementation per G-5 - Mobile layout tests written before implementation
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import MobileLayoutWrapper from './mobile-layout-wrapper'
import { patternGenerators } from '@/components/pattern-generators'

// Mock the pattern generators to avoid rendering complex canvas/WebGL
jest.mock('@/components/pattern-generators', () => ({
  patternGenerators: [
    {
      id: 'test-pattern-1',
      name: 'Test Pattern 1', 
      component: () => <div data-testid="pattern-1">Pattern 1</div>,
      technology: 'CANVAS_2D',
      controls: [
        { id: 'speed', label: 'Speed', type: 'range', min: 0, max: 10, step: 1, defaultValue: 5 },
        { id: 'color', label: 'Color', type: 'color', defaultValue: '#ff0000' },
      ]
    },
    {
      id: 'test-pattern-2',
      name: 'Test Pattern 2',
      component: () => <div data-testid="pattern-2">Pattern 2</div>,
      technology: 'WEBGL_2.0',
      controls: [
        { id: 'particles', label: 'Particles', type: 'range', min: 1, max: 100, step: 1, defaultValue: 50 },
        { id: 'brightness', label: 'Brightness', type: 'range', min: 0, max: 5, step: 0.1, defaultValue: 2.0 },
        { id: 'reset', label: 'Reset', type: 'button', defaultValue: false },
      ]
    }
  ]
}))

// Mock the mobile breakpoint detection
const mockUseMobileDetection = jest.fn()
jest.mock('../hooks/useMobileDetection', () => ({
  useMobileDetection: () => mockUseMobileDetection()
}))

describe('MobileLayoutWrapper', () => {
  beforeEach(() => {
    // Default to mobile viewport
    mockUseMobileDetection.mockReturnValue({
      isMobile: true,
      isTablet: false, 
      isDesktop: false,
      viewport: { width: 375, height: 667 }
    })
    
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 })
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 667 })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Mobile Layout Structure', () => {
    it('renders mobile layout with correct structure when on mobile device', () => {
      render(<MobileLayoutWrapper />)
      
      // Header should be present
      expect(screen.getByTestId('mobile-header')).toBeInTheDocument()
      
      // Pattern selector should be present
      expect(screen.getByTestId('pattern-dropdown-selector')).toBeInTheDocument()
      
      // Visualization area should be present
      expect(screen.getByTestId('mobile-visualization-area')).toBeInTheDocument()
      
      // Progressive disclosure panel should be present
      expect(screen.getByTestId('progressive-disclosure-panel')).toBeInTheDocument()
    })

    it('renders desktop layout when on desktop device', () => {
      mockUseMobileDetection.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        viewport: { width: 1024, height: 768 }
      })

      render(<MobileLayoutWrapper />)
      
      // Should render existing desktop layout
      expect(screen.getByTestId('desktop-layout')).toBeInTheDocument()
      expect(screen.queryByTestId('mobile-header')).not.toBeInTheDocument()
    })

    it('has correct mobile layout proportions', () => {
      render(<MobileLayoutWrapper />)
      
      const header = screen.getByTestId('mobile-header')
      const selector = screen.getByTestId('pattern-dropdown-selector')
      const visualization = screen.getByTestId('mobile-visualization-area')
      
      // Header should be fixed height
      expect(header).toHaveStyle('height: 48px')
      
      // Selector should be minimum touch target height
      expect(selector).toHaveStyle('min-height: 44px')
      
      // Visualization should take remaining space
      expect(visualization).toHaveStyle('height: calc(100vh - 140px - var(--controls-height))')
    })
  })

  describe('Pattern Selection', () => {
    it('displays current pattern in dropdown selector', () => {
      render(<MobileLayoutWrapper />)
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      expect(selector).toHaveTextContent('Test Pattern 1')
    })

    it('allows pattern selection via dropdown', async () => {
      render(<MobileLayoutWrapper />)
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      fireEvent.click(selector)
      
      // Should show pattern options
      const option2 = screen.getByText('Test Pattern 2')
      fireEvent.click(option2)
      
      await waitFor(() => {
        expect(selector).toHaveTextContent('Test Pattern 2')
      })
    })

    it('updates pattern counter in header when pattern changes', async () => {
      render(<MobileLayoutWrapper />)
      
      const header = screen.getByTestId('mobile-header')
      expect(header).toHaveTextContent('01/02')
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      fireEvent.click(selector)
      fireEvent.click(screen.getByText('Test Pattern 2'))
      
      await waitFor(() => {
        expect(header).toHaveTextContent('02/02')
      })
    })
  })

  describe('Progressive Disclosure Controls', () => {
    it('shows essential controls by default', () => {
      render(<MobileLayoutWrapper />)
      
      const disclosurePanel = screen.getByTestId('progressive-disclosure-panel')
      
      // Essential controls should be visible
      expect(screen.getByLabelText('Speed')).toBeInTheDocument()
      expect(screen.getByDisplayValue('#ff0000')).toBeInTheDocument()
      
      // Advanced controls should be collapsed initially
      expect(screen.queryByText('Advanced Controls')).toBeInTheDocument()
    })

    it('expands advanced controls when toggle is clicked', async () => {
      render(<MobileLayoutWrapper />)
      
      const expandButton = screen.getByText('Advanced Controls')
      fireEvent.click(expandButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('advanced-controls-panel')).toHaveAttribute('aria-expanded', 'true')
      })
    })

    it('preserves pattern-specific control layouts in mobile', async () => {
      // Test with four-pole gradient pattern that has 2x2 color grid
      const fourPolePattern = {
        id: 'four-pole-gradient',
        name: '4-Pole Gradient',
        component: () => <div>Four Pole</div>,
        technology: 'CANVAS_2D',
        controls: [
          { id: 'pole1Color', label: 'Pole 1 Color', type: 'color', defaultValue: '#ff0000' },
          { id: 'pole2Color', label: 'Pole 2 Color', type: 'color', defaultValue: '#00ff00' },
          { id: 'pole3Color', label: 'Pole 3 Color', type: 'color', defaultValue: '#0000ff' },
          { id: 'pole4Color', label: 'Pole 4 Color', type: 'color', defaultValue: '#ffff00' },
        ]
      }

      render(<MobileLayoutWrapper initialPatternId="four-pole-gradient" />)
      
      // Expand advanced controls to see pattern-specific layout
      fireEvent.click(screen.getByText('Advanced Controls'))
      
      await waitFor(() => {
        // Should preserve 2x2 grid layout for color pickers
        const colorGrid = screen.getByTestId('four-pole-color-grid')
        expect(colorGrid).toHaveClass('grid-cols-2')
      })
    })

    it('keeps reset buttons ungrouped and prominent', () => {
      render(<MobileLayoutWrapper initialPatternId="test-pattern-2" />)
      
      // Reset button should be outside grouped controls
      const resetButton = screen.getByText('Reset')
      const ungroupedControls = screen.getByTestId('ungrouped-controls')
      
      expect(ungroupedControls).toContainElement(resetButton)
    })
  })

  describe('Touch Interactions', () => {
    it('has minimum 44px touch targets for all interactive elements', () => {
      render(<MobileLayoutWrapper />)
      
      // All buttons and controls should meet touch target size
      const interactiveElements = screen.getAllByRole('button')
      interactiveElements.forEach(element => {
        const styles = window.getComputedStyle(element)
        const height = parseInt(styles.height)
        const minHeight = parseInt(styles.minHeight)
        
        expect(Math.max(height, minHeight)).toBeGreaterThanOrEqual(44)
      })
    })

    it('handles orientation changes smoothly', async () => {
      render(<MobileLayoutWrapper />)
      
      // Simulate orientation change
      Object.defineProperty(window, 'innerWidth', { value: 667 })
      Object.defineProperty(window, 'innerHeight', { value: 375 })
      
      act(() => {
        window.dispatchEvent(new Event('resize'))
      })
      
      await waitFor(() => {
        const visualization = screen.getByTestId('mobile-visualization-area')
        // Should adjust to new dimensions
        expect(visualization).toHaveStyle('height: calc(100vh - 140px - var(--controls-height))')
      })
    })
  })

  describe('Responsive Breakpoint Behavior', () => {
    it('switches to tablet layout at 768px breakpoint', () => {
      mockUseMobileDetection.mockReturnValue({
        isMobile: false,
        isTablet: true,
        isDesktop: false,
        viewport: { width: 768, height: 1024 }
      })

      render(<MobileLayoutWrapper />)
      
      // Should render tablet-specific layout
      expect(screen.getByTestId('tablet-layout')).toBeInTheDocument()
    })

    it('switches to desktop layout at 1024px breakpoint', () => {
      mockUseMobileDetection.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        viewport: { width: 1024, height: 768 }
      })

      render(<MobileLayoutWrapper />)
      
      // Should render existing desktop layout unchanged
      expect(screen.getByTestId('desktop-layout')).toBeInTheDocument()
      expect(screen.queryByTestId('mobile-header')).not.toBeInTheDocument()
    })
  })

  describe('Performance Requirements', () => {
    it('maintains pattern rendering performance on mobile', async () => {
      const performanceStart = performance.now()
      
      render(<MobileLayoutWrapper />)
      
      // Pattern should render within performance budget
      await waitFor(() => {
        expect(screen.getByTestId('pattern-1')).toBeInTheDocument()
      })
      
      const renderTime = performance.now() - performanceStart
      expect(renderTime).toBeLessThan(100) // 100ms budget for initial render
    })

    it('handles control changes efficiently', async () => {
      render(<MobileLayoutWrapper />)
      
      const speedSlider = screen.getByLabelText('Speed')
      
      const performanceStart = performance.now()
      fireEvent.change(speedSlider, { target: { value: '8' } })
      
      await waitFor(() => {
        expect(speedSlider).toHaveValue('8')
      })
      
      const updateTime = performance.now() - performanceStart
      expect(updateTime).toBeLessThan(16) // 60fps budget (16ms)
    })
  })

  describe('Accessibility', () => {
    it('maintains proper focus order in mobile layout', () => {
      render(<MobileLayoutWrapper />)
      
      // Should be able to tab through all interactive elements
      const focusableElements = screen.getAllByRole('button')
        .concat(screen.getAllByRole('combobox'))
        .concat(screen.getAllByRole('slider'))
      
      expect(focusableElements.length).toBeGreaterThan(0)
      
      // First element should be in header
      expect(screen.getByTestId('mobile-header')).toContainElement(focusableElements[0])
    })

    it('provides proper ARIA labels for mobile-specific elements', () => {
      render(<MobileLayoutWrapper />)
      
      expect(screen.getByTestId('pattern-dropdown-selector')).toHaveAttribute('aria-label', 'Select pattern generator')
      expect(screen.getByTestId('progressive-disclosure-panel')).toHaveAttribute('aria-label', 'Pattern controls')
      expect(screen.getByTestId('mobile-visualization-area')).toHaveAttribute('aria-label', 'Pattern visualization')
    })
  })
})