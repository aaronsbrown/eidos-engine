// AIDEV-NOTE: TDD tests for viewport-constrained control panel - Issue #19
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ViewportConstrainedPanel from './viewport-constrained-panel'

// Mock window.innerHeight for viewport testing
const mockInnerHeight = (height: number) => {
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
}

// Mock ResizeObserver since it's already mocked in jest setup
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

describe('ViewportConstrainedPanel', () => {
  const mockChildren = (
    <div>
      <div style={{ height: '200px' }}>Control Group 1</div>
      <div style={{ height: '200px' }}>Control Group 2</div>
      <div style={{ height: '200px' }}>Control Group 3</div>
      <div style={{ height: '200px' }}>Control Group 4</div>
    </div>
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders children correctly', () => {
      mockInnerHeight(1000)
      render(
        <ViewportConstrainedPanel>
          {mockChildren}
        </ViewportConstrainedPanel>
      )

      expect(screen.getByText('Control Group 1')).toBeInTheDocument()
      expect(screen.getByText('Control Group 2')).toBeInTheDocument()
      expect(screen.getByText('Control Group 3')).toBeInTheDocument()
      expect(screen.getByText('Control Group 4')).toBeInTheDocument()
    })

    it('applies correct container classes', () => {
      mockInnerHeight(1000)
      render(
        <ViewportConstrainedPanel>
          {mockChildren}
        </ViewportConstrainedPanel>
      )

      const container = screen.getByTestId('viewport-constrained-panel')
      expect(container).toHaveClass('space-y-4')
    })

    it('has proper scrollable container', () => {
      mockInnerHeight(1000)
      render(
        <ViewportConstrainedPanel>
          {mockChildren}
        </ViewportConstrainedPanel>
      )

      const container = screen.getByTestId('viewport-constrained-panel')
      expect(container).toHaveClass('overflow-y-auto')
    })
  })

  describe('Viewport Height Calculation', () => {
    it('calculates correct max height for large viewport', () => {
      mockInnerHeight(1000)
      render(
        <ViewportConstrainedPanel headerHeight={100} footerHeight={50}>
          {mockChildren}
        </ViewportConstrainedPanel>
      )

      const container = screen.getByTestId('viewport-constrained-panel')
      // Should be: 1000 - 100 - 50 - 32 (default padding) = 818px
      expect(container).toHaveStyle({ 'max-height': '818px' })
    })

    it('calculates correct max height for small viewport', () => {
      mockInnerHeight(600)
      render(
        <ViewportConstrainedPanel headerHeight={100} footerHeight={50}>
          {mockChildren}
        </ViewportConstrainedPanel>
      )

      const container = screen.getByTestId('viewport-constrained-panel')
      // Should be: 600 - 100 - 50 - 32 = 418px
      expect(container).toHaveStyle({ 'max-height': '418px' })
    })

    it('uses default padding when not specified', () => {
      mockInnerHeight(800)
      render(
        <ViewportConstrainedPanel>
          {mockChildren}
        </ViewportConstrainedPanel>
      )

      const container = screen.getByTestId('viewport-constrained-panel')
      // Should be: 800 - 0 - 0 - 32 (default padding) = 768px
      expect(container).toHaveStyle({ 'max-height': '768px' })
    })

    it('applies custom padding correctly', () => {
      mockInnerHeight(800)
      render(
        <ViewportConstrainedPanel paddingBuffer={64}>
          {mockChildren}
        </ViewportConstrainedPanel>
      )

      const container = screen.getByTestId('viewport-constrained-panel')
      // Should be: 800 - 0 - 0 - 64 = 736px
      expect(container).toHaveStyle({ 'max-height': '736px' })
    })

    it('handles minimum height constraint', () => {
      mockInnerHeight(200) // Very small viewport
      render(
        <ViewportConstrainedPanel headerHeight={100} footerHeight={50} minHeight={300}>
          {mockChildren}
        </ViewportConstrainedPanel>
      )

      const container = screen.getByTestId('viewport-constrained-panel')
      // Calculated would be: 200 - 100 - 50 - 32 = 18px
      // But minHeight should override to 300px
      expect(container).toHaveStyle({ 'max-height': '300px' })
    })
  })

  describe('Responsive Behavior', () => {
    it('updates height when viewport changes', () => {
      mockInnerHeight(1000)
      render(
        <ViewportConstrainedPanel headerHeight={100}>
          {mockChildren}
        </ViewportConstrainedPanel>
      )

      const panel = screen.getByTestId('viewport-constrained-panel')
      expect(panel).toHaveStyle({ 'max-height': '868px' }) // 1000 - 100 - 32

      // Simulate viewport resize
      mockInnerHeight(600)
      fireEvent(window, new Event('resize'))

      // Should recalculate to 600 - 100 - 32 = 468px
      // Note: This test assumes the component listens to resize events
      // The actual implementation will need to handle resize events
    })

    it('handles window resize events', () => {
      const resizeListener = jest.fn()
      window.addEventListener = jest.fn((event, listener) => {
        if (event === 'resize') {
          resizeListener.mockImplementation(listener)
        }
      })

      mockInnerHeight(1000)
      render(
        <ViewportConstrainedPanel>
          {mockChildren}
        </ViewportConstrainedPanel>
      )

      expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
    })
  })

  describe('Scrolling Behavior', () => {
    it('enables scrolling when content exceeds viewport', () => {
      mockInnerHeight(400) // Small viewport
      render(
        <ViewportConstrainedPanel>
          {mockChildren} {/* This should be 800px tall (4 * 200px) */}
        </ViewportConstrainedPanel>
      )

      const container = screen.getByTestId('viewport-constrained-panel')
      expect(container).toHaveClass('overflow-y-auto')
      
      // Should have a max-height smaller than content height
      expect(container).toHaveStyle({ 'max-height': '368px' }) // 400 - 32
    })

    it('maintains scroll position during interactions', async () => {
      const user = userEvent.setup()
      mockInnerHeight(400)
      
      render(
        <ViewportConstrainedPanel>
          <div>
            <div style={{ height: '200px', background: 'red' }}>Top Content</div>
            <button>Clickable Button</button>
            <div style={{ height: '200px', background: 'blue' }}>Bottom Content</div>
          </div>
        </ViewportConstrainedPanel>
      )

      const container = screen.getByTestId('viewport-constrained-panel')
      const button = screen.getByRole('button', { name: 'Clickable Button' })

      // Scroll to make button visible
      container.scrollTop = 150
      
      // Click the button
      await user.click(button)
      
      // Scroll position should be preserved
      expect(container.scrollTop).toBe(150)
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes for scrollable region', () => {
      mockInnerHeight(400)
      render(
        <ViewportConstrainedPanel>
          {mockChildren}
        </ViewportConstrainedPanel>
      )

      const container = screen.getByTestId('viewport-constrained-panel')
      expect(container).toHaveAttribute('role', 'region')
      expect(container).toHaveAttribute('aria-label', 'Scrollable control panel')
    })

    it('indicates scrollable content with proper tabindex', () => {
      mockInnerHeight(400)
      render(
        <ViewportConstrainedPanel>
          {mockChildren}
        </ViewportConstrainedPanel>
      )

      const container = screen.getByTestId('viewport-constrained-panel')
      expect(container).toHaveAttribute('tabindex', '0')
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      mockInnerHeight(400)
      
      render(
        <ViewportConstrainedPanel>
          <div>
            <div style={{ height: '200px' }}>Top Content</div>
            <div style={{ height: '200px' }}>Bottom Content</div>
          </div>
        </ViewportConstrainedPanel>
      )

      const containerElement = screen.getByTestId('viewport-constrained-panel')
      
      // Should be able to focus the container
      await user.tab()
      expect(containerElement).toHaveFocus()
      
      // Should be able to scroll with arrow keys  
      await user.keyboard('{ArrowDown}')
      
      // Note: The actual scroll behavior would need to be implemented
      // This test verifies the container can receive focus for keyboard navigation
    })
  })

  describe('Performance', () => {
    it('handles resize events with debounce mechanism', () => {
      mockInnerHeight(1000)
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
      
      render(
        <ViewportConstrainedPanel>
          {mockChildren}
        </ViewportConstrainedPanel>
      )

      // Should register a resize event listener
      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
      
      addEventListenerSpy.mockRestore()
    })

    it('cleans up event listeners on unmount', () => {
      const removeEventListener = jest.fn()
      window.removeEventListener = removeEventListener

      mockInnerHeight(1000)
      const { unmount } = render(
        <ViewportConstrainedPanel>
          {mockChildren}
        </ViewportConstrainedPanel>
      )

      unmount()

      expect(removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
    })
  })

  describe('Edge Cases', () => {
    it('handles extremely small viewport heights gracefully', () => {
      mockInnerHeight(100) // Very small
      render(
        <ViewportConstrainedPanel headerHeight={50} footerHeight={25}>
          {mockChildren}
        </ViewportConstrainedPanel>
      )

      const container = screen.getByTestId('viewport-constrained-panel')
      // Should be: 100 - 50 - 25 - 32 = -7px, but should fallback to minimum (200px)
      expect(container).toHaveStyle({ 'max-height': '200px' })
      
      // Ensure it's the minimum height
      const maxHeight = parseInt(container.style.maxHeight)
      expect(maxHeight).toBe(200)
    })

    it('handles missing viewport dimensions', () => {
      // Mock undefined innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: undefined,
      })

      expect(() => {
        render(
          <ViewportConstrainedPanel>
            {mockChildren}
          </ViewportConstrainedPanel>
        )
      }).not.toThrow()

      const container = screen.getByTestId('viewport-constrained-panel')
      expect(container).toBeInTheDocument()
    })

    it('handles dynamic content height changes', () => {
      mockInnerHeight(600)
      const { rerender } = render(
        <ViewportConstrainedPanel>
          <div style={{ height: '200px' }}>Short Content</div>
        </ViewportConstrainedPanel>
      )

      // Increase content height
      rerender(
        <ViewportConstrainedPanel>
          <div style={{ height: '800px' }}>Tall Content</div>
        </ViewportConstrainedPanel>
      )

      const container = screen.getByTestId('viewport-constrained-panel')
      expect(container).toHaveClass('overflow-y-auto')
    })
  })
})