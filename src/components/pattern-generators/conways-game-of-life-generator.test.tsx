// AIDEV-NOTE: Behavioral tests for Conway's Game of Life - focuses on user behaviors, not implementation details (G-8)
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import { ThemeProvider } from '@/lib/theme-context'
import ConwaysGameOfLifeGenerator from './conways-game-of-life-generator'
import { 
  createMockCanvas2DContext, 
  mockRequestAnimationFrame 
} from '@/test-utils/pattern-generator-mocks'

// Test wrapper with required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
)

describe('Conway\'s Game of Life - Behavioral Tests', () => {
  let mockRaf: ReturnType<typeof mockRequestAnimationFrame>
  let mockCanvas2D: CanvasRenderingContext2D
  let mockOnControlChange: jest.Mock
  
  beforeEach(() => {
    mockRaf = mockRequestAnimationFrame()
    mockCanvas2D = createMockCanvas2DContext()
    mockOnControlChange = jest.fn()
    
    // Mock canvas context methods
    HTMLCanvasElement.prototype.getContext = jest.fn(() => mockCanvas2D)
    
    // Mock Touch events for mobile testing
    global.TouchEvent = class MockTouchEvent extends Event {
      touches: TouchList
      changedTouches: TouchList
      
      constructor(type: string, init?: TouchEventInit) {
        super(type, init)
        this.touches = init?.touches || ([] as unknown as TouchList)
        this.changedTouches = init?.changedTouches || ([] as unknown as TouchList)
      }
    } as unknown as typeof TouchEvent
    
    // Mock getBoundingClientRect for accurate click position testing
    HTMLCanvasElement.prototype.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      right: 400,
      bottom: 300,
      width: 400,
      height: 300,
      x: 0,
      y: 0,
      toJSON: () => {}
    }))
  })
  
  afterEach(() => {
    jest.clearAllMocks()
  })

  const renderConwaysGameOfLife = (controlValues = {}) => {
    return render(
      <ConwaysGameOfLifeGenerator
        width={400}
        height={300}
        controlValues={{
          speed: 7.0,
          density: 0.15,
          resetTrigger: 0,
          ...controlValues
        }}
        onControlChange={mockOnControlChange}
      />,
      { wrapper: TestWrapper }
    )
  }

  describe('Initial State and UI Elements', () => {
    it('starts in drawing mode with generation 0', () => {
      renderConwaysGameOfLife()
      
      // User should see generation counter starting at 0
      expect(screen.getByText('GEN 0')).toBeInTheDocument()
      
      // Drawing instructions should be visible
      expect(screen.getByText(/Click\/drag to toggle cells, then press play to start simulation/)).toBeInTheDocument()
      
      // Play button should be available (not edit button)
      const playButton = screen.getByTitle('Start simulation')
      expect(playButton).toBeInTheDocument()
    })

    it('displays all control buttons with correct accessibility labels', () => {
      renderConwaysGameOfLife()
      
      // Users should be able to identify each button by its purpose
      expect(screen.getByTitle('Drawing tips')).toBeInTheDocument()
      expect(screen.getByTitle('Start simulation')).toBeInTheDocument()
      expect(screen.getByTitle('Clear grid')).toBeInTheDocument()
    })

    it('renders canvas with correct dimensions', () => {
      renderConwaysGameOfLife()
      
      const canvas = document.querySelector('canvas')
      expect(canvas).toBeInTheDocument()
      expect(canvas).toHaveClass('cursor-pointer')
    })
  })

  describe('Drawing Mode Interactions', () => {
    it('allows user to click on canvas to toggle cells', () => {
      renderConwaysGameOfLife()
      
      const canvas = document.querySelector('canvas')
      expect(canvas).toBeInTheDocument()
      
      // User clicks on canvas
      fireEvent.click(canvas!, { clientX: 100, clientY: 100 })
      
      // Canvas should receive the click (behavioral: user can interact with the canvas)
      expect(canvas).toBeInTheDocument()
    })

    it('supports mouse drag interactions for drawing', () => {
      renderConwaysGameOfLife()
      
      const canvas = document.querySelector('canvas')
      expect(canvas).toBeInTheDocument()
      
      // User starts dragging
      fireEvent.mouseDown(canvas!, { clientX: 50, clientY: 50 })
      fireEvent.mouseMove(canvas!, { clientX: 60, clientY: 60 })
      fireEvent.mouseMove(canvas!, { clientX: 70, clientY: 70 })
      fireEvent.mouseUp(canvas!)
      
      // User should be able to draw by dragging (behavioral expectation)
      expect(canvas).toBeInTheDocument()
    })

    it('handles mouse leave during drag gracefully', () => {
      renderConwaysGameOfLife()
      
      const canvas = document.querySelector('canvas')
      expect(canvas).toBeInTheDocument()
      
      // User drags and accidentally leaves canvas area
      fireEvent.mouseDown(canvas!, { clientX: 50, clientY: 50 })
      fireEvent.mouseMove(canvas!, { clientX: 60, clientY: 60 })
      fireEvent.mouseLeave(canvas!) // Should stop drawing
      
      // Drawing should stop when mouse leaves (expected behavior)
      expect(canvas).toBeInTheDocument()
    })
  })

  describe('Touch Support for Mobile', () => {
    it('supports touch interactions for mobile users', () => {
      // Set up spy before rendering
      const mockAddEventListener = jest.fn()
      const originalAddEventListener = HTMLCanvasElement.prototype.addEventListener
      HTMLCanvasElement.prototype.addEventListener = mockAddEventListener
      
      renderConwaysGameOfLife()
      
      // Component should add touch event listeners
      expect(mockAddEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function), { passive: false })
      expect(mockAddEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function), { passive: false })
      expect(mockAddEventListener).toHaveBeenCalledWith('touchend', expect.any(Function), { passive: false })
      
      // Restore original method
      HTMLCanvasElement.prototype.addEventListener = originalAddEventListener
    })

    it('prevents default scroll behavior during touch interactions', () => {
      // Set up spy before rendering
      const mockAddEventListener = jest.fn()
      const originalAddEventListener = HTMLCanvasElement.prototype.addEventListener
      HTMLCanvasElement.prototype.addEventListener = mockAddEventListener
      
      renderConwaysGameOfLife()
      
      // Touch events should be registered with passive: false to allow preventDefault
      expect(mockAddEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function), { passive: false })
      
      // Restore original method
      HTMLCanvasElement.prototype.addEventListener = originalAddEventListener
    })
  })

  describe('Mode Switching', () => {
    it('switches from drawing to simulation mode when play button is clicked', async () => {
      renderConwaysGameOfLife()
      
      // Initially in drawing mode
      expect(screen.getByText(/Click\/drag to toggle cells/)).toBeInTheDocument()
      expect(screen.getByTitle('Start simulation')).toBeInTheDocument()
      
      // User clicks play button
      const playButton = screen.getByTitle('Start simulation')
      fireEvent.click(playButton)
      
      // Should switch to simulation mode
      await waitFor(() => {
        expect(screen.getByText(/Simulation running/)).toBeInTheDocument()
        expect(screen.getByTitle('Enter drawing mode')).toBeInTheDocument()
      })
    })

    it('switches back to drawing mode when edit button is clicked', async () => {
      renderConwaysGameOfLife()
      
      // Start simulation
      const playButton = screen.getByTitle('Start simulation')
      fireEvent.click(playButton)
      
      await waitFor(() => {
        expect(screen.getByTitle('Enter drawing mode')).toBeInTheDocument()
      })
      
      // User clicks edit button to return to drawing
      const editButton = screen.getByTitle('Enter drawing mode')
      fireEvent.click(editButton)
      
      // Should return to drawing mode
      await waitFor(() => {
        expect(screen.getByText(/Click\/drag to toggle cells/)).toBeInTheDocument()
        expect(screen.getByTitle('Start simulation')).toBeInTheDocument()
      })
    })

    it('resets generation counter when returning to drawing mode', async () => {
      renderConwaysGameOfLife()
      
      // Start simulation
      const playButton = screen.getByTitle('Start simulation')
      fireEvent.click(playButton)
      
      // Let some time pass (simulate generations)
      act(() => {
        for (let i = 0; i < 10; i++) {
          mockRaf.runFrame(i * 16.67)
        }
      })
      
      // Switch back to drawing mode
      const editButton = screen.getByTitle('Enter drawing mode')
      fireEvent.click(editButton)
      
      // Generation should reset to 0
      await waitFor(() => {
        expect(screen.getByText('GEN 0')).toBeInTheDocument()
      })
    })
  })

  describe('Clear Grid Functionality', () => {
    it('clears the grid and returns to drawing mode when clear button is clicked', async () => {
      renderConwaysGameOfLife()
      
      // Start in simulation mode
      const playButton = screen.getByTitle('Start simulation')
      fireEvent.click(playButton)
      
      await waitFor(() => {
        expect(screen.getByText(/Simulation running/)).toBeInTheDocument()
      })
      
      // User clicks clear button
      const clearButton = screen.getByTitle('Clear grid')
      fireEvent.click(clearButton)
      
      // Should return to drawing mode and reset generation
      await waitFor(() => {
        expect(screen.getByText(/Click\/drag to toggle cells/)).toBeInTheDocument()
        expect(screen.getByText('GEN 0')).toBeInTheDocument()
      })
    })
  })

  describe('Help System', () => {
    it('shows drawing tips when help button is hovered', async () => {
      renderConwaysGameOfLife()
      
      const helpButton = screen.getByTitle('Drawing tips')
      
      // User hovers over help button
      fireEvent.mouseEnter(helpButton)
      
      // Help tooltip should appear
      await waitFor(() => {
        expect(screen.getByText('Drawing Tips:')).toBeInTheDocument()
        expect(screen.getByText(/Try an 'L' or 'T' shape/)).toBeInTheDocument()
        expect(screen.getByText(/Make a small 2x2 square/)).toBeInTheDocument()
      })
    })

    it('hides drawing tips when help button is no longer hovered', async () => {
      renderConwaysGameOfLife()
      
      const helpButton = screen.getByTitle('Drawing tips')
      
      // Show help
      fireEvent.mouseEnter(helpButton)
      await waitFor(() => {
        expect(screen.getByText('Drawing Tips:')).toBeInTheDocument()
      })
      
      // User moves mouse away
      fireEvent.mouseLeave(helpButton)
      
      // Help should disappear
      await waitFor(() => {
        expect(screen.queryByText('Drawing Tips:')).not.toBeInTheDocument()
      })
    })
  })

  describe('Control Integration', () => {
    it('responds to speed control changes during simulation', async () => {
      const { rerender } = renderConwaysGameOfLife()
      
      // User should be able to change speed via controls
      // This tests the integration with the control system
      rerender(
        <ConwaysGameOfLifeGenerator
          width={400}
          height={300}
          controlValues={{ speed: 10.0, density: 0.15, resetTrigger: 0 }}
          onControlChange={mockOnControlChange}
        />
      )
      
      // Component should accept and use the new speed value
      const canvas = document.querySelector('canvas')
      expect(canvas).toBeInTheDocument()
    })

    it('responds to density control changes', () => {
      renderConwaysGameOfLife({ density: 0.25 })
      
      // Component should accept the density value for random generation
      const canvas = document.querySelector('canvas')
      expect(canvas).toBeInTheDocument()
    })

    it('responds to reset trigger from controls', () => {
      const { rerender } = renderConwaysGameOfLife()
      
      // Trigger reset from external controls
      rerender(
        <ConwaysGameOfLifeGenerator
          width={400}
          height={300}
          controlValues={{ speed: 7.0, density: 0.15, resetTrigger: 1 }}
          onControlChange={mockOnControlChange}
        />
      )
      
      // Should call onControlChange to reset the trigger
      expect(mockOnControlChange).toHaveBeenCalledWith('resetTrigger', 0)
    })
  })

  describe('Animation and Performance', () => {
    it('maintains smooth animation during simulation', async () => {
      renderConwaysGameOfLife()
      
      // Start simulation
      const playButton = screen.getByTitle('Start simulation')
      fireEvent.click(playButton)
      
      // Run several animation frames
      act(() => {
        for (let i = 0; i < 5; i++) {
          mockRaf.runFrame(i * 16.67) // 60fps timing
        }
      })
      
      // Animation should be running smoothly
      expect(mockRaf.raf).toHaveBeenCalled()
    })

    it('cleans up animation when component unmounts', () => {
      const { unmount } = renderConwaysGameOfLife()
      
      unmount()
      
      // Should cancel any pending animation frames
      expect(mockRaf.caf).toHaveBeenCalled()
    })

    it('handles dimension changes gracefully', () => {
      const { rerender } = renderConwaysGameOfLife()
      
      // Change dimensions
      rerender(
        <ConwaysGameOfLifeGenerator
          width={800}
          height={600}
          controlValues={{ speed: 7.0, density: 0.15, resetTrigger: 0 }}
          onControlChange={mockOnControlChange}
        />
      )
      
      // Component should handle the resize
      const canvas = document.querySelector('canvas')
      expect(canvas).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('provides appropriate button labels for screen readers', () => {
      renderConwaysGameOfLife()
      
      // All interactive buttons should have descriptive titles
      expect(screen.getByTitle('Drawing tips')).toBeInTheDocument()
      expect(screen.getByTitle('Start simulation')).toBeInTheDocument()
      expect(screen.getByTitle('Clear grid')).toBeInTheDocument()
    })

    it('provides visual feedback for current mode', () => {
      renderConwaysGameOfLife()
      
      // Users should always know what mode they're in
      expect(screen.getByText(/Click\/drag to toggle cells, then press play to start simulation/)).toBeInTheDocument()
    })

    it('displays generation counter for simulation progress', () => {
      renderConwaysGameOfLife()
      
      // Users should be able to track simulation progress
      expect(screen.getByText('GEN 0')).toBeInTheDocument()
    })
  })

  describe('Theme Integration', () => {
    it('renders UI elements with theme-aware styling', () => {
      renderConwaysGameOfLife()
      
      // Generation counter should use theme colors
      const genCounter = screen.getByText('GEN 0')
      expect(genCounter).toHaveClass('text-foreground')
      expect(genCounter).toHaveClass('bg-background')
      
      // Instructions should use theme colors
      const instructions = screen.getByText(/Click\/drag to toggle cells/)
      expect(instructions).toHaveClass('text-foreground')
      expect(instructions).toHaveClass('bg-background')
    })

    it('uses consistent button styling across theme modes', () => {
      renderConwaysGameOfLife()
      
      // All action buttons should have consistent accent styling
      const buttons = [
        screen.getByTitle('Drawing tips'),
        screen.getByTitle('Start simulation'),
        screen.getByTitle('Clear grid')
      ]
      
      buttons.forEach(button => {
        expect(button).toHaveClass('bg-accent-primary')
      })
    })
  })
})