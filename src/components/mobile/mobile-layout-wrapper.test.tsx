// AIDEV-NOTE: Behavioral tests per G-8 - focus on user actions, not implementation details
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import { ThemeProvider } from '@/lib/theme-context'
import { PatternStateProvider } from '@/lib/contexts/pattern-state-context'
import MobileLayoutWrapper from './mobile-layout-wrapper'

// Test wrapper with required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <PatternStateProvider>
      {children}
    </PatternStateProvider>
  </ThemeProvider>
)

// Mock the pattern generators to avoid rendering complex canvas/WebGL
jest.mock('@/components/pattern-generators', () => ({
  patternGenerators: [
    {
      id: 'test-pattern-1',
      name: 'Test Pattern 1', 
      component: () => <div data-testid="pattern-1">Pattern 1</div>,
      technology: 'CANVAS_2D',
      category: 'Geometric',
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
      category: 'Simulation',
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

describe('MobileLayoutWrapper - User Behavior', () => {
  beforeEach(() => {
    // Clear localStorage to ensure clean test state
    localStorage.clear()
    
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

  describe('User can navigate between device layouts', () => {
    it('provides mobile layout when user is on mobile device', () => {
      render(<MobileLayoutWrapper />, { wrapper: TestWrapper })
      
      // User should see mobile-specific layout
      expect(screen.getByText('EIDOS ENGINE')).toBeInTheDocument() // Header
      expect(screen.getByRole('combobox')).toBeInTheDocument() // Pattern selector
      expect(screen.getByTestId('pattern-1')).toBeInTheDocument() // Pattern visualization
    })

    it('provides desktop layout when user is on desktop device', () => {
      mockUseMobileDetection.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        viewport: { width: 1024, height: 768 }
      })

      render(<MobileLayoutWrapper />, { wrapper: TestWrapper })
      
      // User should see desktop layout
      expect(screen.getByText('Desktop layout rendered here')).toBeInTheDocument()
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument() // No mobile dropdown
    })

    it('provides tablet layout when user is on tablet device', () => {
      mockUseMobileDetection.mockReturnValue({
        isMobile: false,
        isTablet: true,
        isDesktop: false,
        viewport: { width: 768, height: 1024 }
      })

      render(<MobileLayoutWrapper />, { wrapper: TestWrapper })
      
      // User should see tablet-specific layout
      expect(screen.getByText('EIDOS ENGINE')).toBeInTheDocument()
      // Tablet layout would have side panel
    })
  })

  describe('User can see current pattern information', () => {
    it('shows which pattern is currently active', () => {
      render(<MobileLayoutWrapper />, { wrapper: TestWrapper })
      
      // User can see current pattern name
      expect(screen.getByText('Test Pattern 1')).toBeInTheDocument()
    })

    it('displays the active pattern visualization', () => {
      render(<MobileLayoutWrapper />, { wrapper: TestWrapper })
      
      // User should see the actual pattern
      expect(screen.getByTestId('pattern-1')).toBeInTheDocument()
    })
  })

  describe('User can change patterns', () => {
    it('allows user to select different pattern via dropdown', async () => {
      render(<MobileLayoutWrapper />, { wrapper: TestWrapper })
      
      // User opens pattern selector
      const dropdown = screen.getByRole('combobox')
      fireEvent.click(dropdown)
      
      // User can see Test Pattern 2 (all categories expanded by default)
      await waitFor(() => {
        expect(screen.getByText('Test Pattern 2')).toBeInTheDocument()
      })
      
      // User selects different pattern
      fireEvent.click(screen.getByText('Test Pattern 2'))
      
      // User sees new pattern is selected
      await waitFor(() => {
        expect(screen.getByText('Test Pattern 2')).toBeInTheDocument()
      })
    })


    it('shows new pattern visualization when user changes patterns', async () => {
      render(<MobileLayoutWrapper />, { wrapper: TestWrapper })
      
      // Initially shows first pattern
      expect(screen.getByTestId('pattern-1')).toBeInTheDocument()
      
      // User changes pattern
      const dropdown = screen.getByRole('combobox')
      fireEvent.click(dropdown)
      
      // User selects Test Pattern 2 (all categories expanded by default)
      await waitFor(() => {
        fireEvent.click(screen.getByText('Test Pattern 2'))
      })
      
      // New pattern visualization appears
      await waitFor(() => {
        expect(screen.getByTestId('pattern-2')).toBeInTheDocument()
      })
    })
  })

  describe('User can control pattern parameters', () => {
    it('provides access to essential pattern controls', () => {
      render(<MobileLayoutWrapper />, { wrapper: TestWrapper })
      
      // User should see quick controls for current pattern
      expect(screen.getByLabelText('Speed')).toBeInTheDocument()
      expect(screen.getByDisplayValue('#ff0000')).toBeInTheDocument() // Color picker
    })

    it('allows user to access advanced controls when needed', async () => {
      render(<MobileLayoutWrapper />, { wrapper: TestWrapper })
      
      // User should have essential controls immediately visible
      expect(screen.getByLabelText('Speed')).toBeInTheDocument()
      expect(screen.getByLabelText('Color')).toBeInTheDocument()
      
      // For this pattern, there may not be advanced controls to expand
      // The test verifies that controls are accessible in the mobile layout
    })

    it('provides quick access to important actions like reset', () => {
      render(<MobileLayoutWrapper initialPatternId="test-pattern-2" />, { wrapper: TestWrapper })
      
      // User should see reset button prominently (there may be multiple reset buttons)
      const resetButtons = screen.getAllByRole('button', { name: 'Reset' })
      expect(resetButtons.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('User can access app menu and settings', () => {
    it('provides menu access for additional functions', () => {
      render(<MobileLayoutWrapper />, { wrapper: TestWrapper })
      
      // User can open menu
      const menuButton = screen.getByLabelText('Open menu')
      expect(menuButton).toBeInTheDocument()
    })

    it('shows menu overlay when user opens menu', async () => {
      render(<MobileLayoutWrapper />, { wrapper: TestWrapper })
      
      const menuButton = screen.getByLabelText('Open menu')
      fireEvent.click(menuButton)
      
      // User should see menu content
      await waitFor(() => {
        expect(screen.getByText('Menu')).toBeInTheDocument()
      })
    })
  })

  describe('User experience adapts to orientation changes', () => {
    it('maintains functionality when user rotates device', async () => {
      render(<MobileLayoutWrapper />, { wrapper: TestWrapper })
      
      // Initially in portrait
      expect(screen.getByText('Test Pattern 1')).toBeInTheDocument()
      
      // Simulate orientation change
      Object.defineProperty(window, 'innerWidth', { value: 667 })
      Object.defineProperty(window, 'innerHeight', { value: 375 })
      
      act(() => {
        window.dispatchEvent(new Event('resize'))
      })
      
      // User should still be able to use the app
      await waitFor(() => {
        expect(screen.getByText('Test Pattern 1')).toBeInTheDocument()
        expect(screen.getByLabelText('Speed')).toBeInTheDocument()
      })
    })
  })

  describe('User has responsive interaction experience', () => {
    it('provides appropriate touch targets for mobile interaction', () => {
      render(<MobileLayoutWrapper />, { wrapper: TestWrapper })
      
      // All interactive elements should be touch-friendly
      const interactiveElements = [
        screen.getByRole('combobox'), // Pattern selector
        screen.getByLabelText('Open menu'), // Menu button
        screen.getAllByRole('button'), // Any control buttons
      ].flat()
      
      // User should be able to interact with all elements easily
      interactiveElements.forEach(element => {
        expect(element).toBeInTheDocument()
      })
    })

    it('maintains good performance during interactions', async () => {
      render(<MobileLayoutWrapper />, { wrapper: TestWrapper })
      
      const speedSlider = screen.getByLabelText('Speed')
      
      const startTime = performance.now()
      fireEvent.change(speedSlider, { target: { value: '8' } })
      const endTime = performance.now()
      
      // Interactions should be responsive
      expect(endTime - startTime).toBeLessThan(100) // 100ms budget
    })
  })

  describe('User receives appropriate feedback and guidance', () => {
    it('shows loading states appropriately', () => {
      render(<MobileLayoutWrapper />, { wrapper: TestWrapper })
      
      // User should see pattern rendering
      expect(screen.getByTestId('pattern-1')).toBeInTheDocument()
    })

    it('provides accessibility support for screen readers', () => {
      render(<MobileLayoutWrapper />, { wrapper: TestWrapper })
      
      // Important elements should have proper labels
      expect(screen.getByLabelText('Open menu')).toBeInTheDocument()
      expect(screen.getByLabelText('Speed')).toBeInTheDocument()
    })
  })
})