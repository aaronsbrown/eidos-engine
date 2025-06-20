// AIDEV-NOTE: TDD implementation per G-5 - Progressive disclosure panel tests written before implementation
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProgressiveDisclosurePanel from './progressive-disclosure-panel'

const mockControls = [
  { id: 'speed', label: 'Speed', type: 'range', min: 0, max: 10, step: 1, defaultValue: 5 },
  { id: 'intensity', label: 'Intensity', type: 'range', min: 0, max: 5, step: 0.1, defaultValue: 2.0 },
  { id: 'color', label: 'Color', type: 'color', defaultValue: '#ff0000' },
  { id: 'particles', label: 'Particles', type: 'range', min: 1, max: 100, step: 1, defaultValue: 50 },
  { id: 'brightness', label: 'Brightness', type: 'range', min: 0, max: 5, step: 0.1, defaultValue: 2.0 },
  { id: 'reset', label: 'Reset', type: 'button', defaultValue: false },
]

const mockControlGroups = [
  {
    title: 'Physics Settings',
    controls: [
      { id: 'gravity', label: 'Gravity', type: 'range', min: -2, max: 2, step: 0.1, defaultValue: 0 },
      { id: 'curl', label: 'Curl', type: 'range', min: 0, max: 2, step: 0.1, defaultValue: 1.0 },
    ],
    defaultCollapsed: false
  },
  {
    title: 'Visual Effects',
    controls: [
      { id: 'trails', label: 'Trail Length', type: 'range', min: 1, max: 10, step: 1, defaultValue: 5 },
      { id: 'glow', label: 'Glow Effect', type: 'checkbox', defaultValue: true },
    ],
    defaultCollapsed: true
  }
]

describe('ProgressiveDisclosurePanel', () => {
  const defaultProps = {
    essentialControls: mockControls.slice(0, 3), // First 3 controls
    advancedControlGroups: mockControlGroups,
    isExpanded: false,
    onToggleExpanded: jest.fn(),
    patternId: 'test-pattern',
    controlValues: {
      speed: 5,
      intensity: 2.0,
      color: '#ff0000',
      gravity: 0,
      curl: 1.0,
      trails: 5,
      glow: true
    },
    onControlChange: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Essential Controls Display', () => {
    it('renders essential controls that are always visible', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} />)
      
      // Essential controls should be visible
      expect(screen.getByLabelText('Speed')).toBeInTheDocument()
      expect(screen.getByLabelText('Intensity')).toBeInTheDocument()
      expect(screen.getByLabelText('Color')).toBeInTheDocument()
      
      // Should show current values
      expect(screen.getByDisplayValue('5')).toBeInTheDocument() // Speed
      expect(screen.getByDisplayValue('#ff0000')).toBeInTheDocument() // Color
    })

    it('does not show essential controls in scrollable area', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} />)
      
      const essentialArea = screen.getByTestId('essential-controls-area')
      const scrollableArea = screen.queryByTestId('advanced-controls-panel')
      
      expect(essentialArea).toContainElement(screen.getByLabelText('Speed'))
      expect(scrollableArea).not.toBeInTheDocument() // Not expanded
    })

    it('has proper touch targets for essential controls', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} />)
      
      const speedSlider = screen.getByLabelText('Speed')
      const colorPicker = screen.getByLabelText('Color')
      
      // Touch targets should be at least 44px
      const speedStyles = window.getComputedStyle(speedSlider)
      const colorStyles = window.getComputedStyle(colorPicker)
      
      expect(parseInt(speedStyles.minHeight || speedStyles.height)).toBeGreaterThanOrEqual(44)
      expect(parseInt(colorStyles.minHeight || colorStyles.height)).toBeGreaterThanOrEqual(44)
    })
  })

  describe('Advanced Controls Toggle', () => {
    it('shows expand button when not expanded', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} />)
      
      const expandButton = screen.getByTestId('expand-advanced-controls')
      expect(expandButton).toBeInTheDocument()
      expect(expandButton).toHaveTextContent('Advanced Controls')
    })

    it('calls onToggleExpanded when expand button is clicked', async () => {
      const user = userEvent.setup()
      render(<ProgressiveDisclosurePanel {...defaultProps} />)
      
      const expandButton = screen.getByTestId('expand-advanced-controls')
      await user.click(expandButton)
      
      expect(defaultProps.onToggleExpanded).toHaveBeenCalledTimes(1)
    })

    it('shows collapse button when expanded', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} isExpanded={true} />)
      
      const collapseButton = screen.getByTestId('collapse-advanced-controls')
      expect(collapseButton).toBeInTheDocument()
      expect(collapseButton).toHaveTextContent('Less Controls')
    })

    it('shows correct chevron direction based on expanded state', () => {
      const { rerender } = render(<ProgressiveDisclosurePanel {...defaultProps} />)
      
      let chevron = screen.getByTestId('chevron-icon')
      expect(chevron).toHaveClass('rotate-0') // Down when collapsed
      
      rerender(<ProgressiveDisclosurePanel {...defaultProps} isExpanded={true} />)
      
      chevron = screen.getByTestId('chevron-icon')
      expect(chevron).toHaveClass('rotate-180') // Up when expanded
    })

    it('has proper accessibility attributes for toggle button', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} />)
      
      const toggleButton = screen.getByTestId('expand-advanced-controls')
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
      expect(toggleButton).toHaveAttribute('aria-controls', 'advanced-controls-panel')
    })
  })

  describe('Advanced Controls Panel', () => {
    it('shows advanced controls when expanded', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} isExpanded={true} />)
      
      const advancedPanel = screen.getByTestId('advanced-controls-panel')
      expect(advancedPanel).toBeInTheDocument()
      expect(advancedPanel).toHaveAttribute('aria-expanded', 'true')
      
      // Should show grouped controls
      expect(screen.getByText('Physics Settings')).toBeInTheDocument()
      expect(screen.getByText('Visual Effects')).toBeInTheDocument()
    })

    it('does not show advanced controls when collapsed', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} isExpanded={false} />)
      
      const advancedPanel = screen.queryByTestId('advanced-controls-panel')
      expect(advancedPanel).not.toBeInTheDocument()
    })

    it('has maximum height constraint for scrolling', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} isExpanded={true} />)
      
      const advancedPanel = screen.getByTestId('advanced-controls-panel')
      const styles = window.getComputedStyle(advancedPanel)
      
      expect(styles.maxHeight).toBe('40vh') // As specified in design
      expect(styles.overflowY).toBe('auto')
    })

    it('preserves pattern-specific grouping and layouts', () => {
      render(
        <ProgressiveDisclosurePanel 
          {...defaultProps} 
          isExpanded={true}
          patternId="four-pole-gradient"
        />
      )
      
      // Should render pattern-specific components
      const advancedPanel = screen.getByTestId('advanced-controls-panel')
      expect(advancedPanel).toBeInTheDocument()
      
      // Would contain pattern-specific layout components
      expect(screen.getByText('Physics Settings')).toBeInTheDocument()
    })
  })

  describe('Ungrouped Controls', () => {
    it('renders ungrouped controls outside of grouped sections', () => {
      const propsWithUngrouped = {
        ...defaultProps,
        isExpanded: true,
        ungroupedControls: [mockControls[5]] // Reset button
      }
      
      render(<ProgressiveDisclosurePanel {...propsWithUngrouped} />)
      
      const ungroupedArea = screen.getByTestId('ungrouped-controls')
      expect(ungroupedArea).toContainElement(screen.getByText('Reset'))
    })

    it('keeps reset buttons prominently accessible', () => {
      const propsWithReset = {
        ...defaultProps,
        isExpanded: true,
        ungroupedControls: [
          { id: 'reset', label: 'Reset Simulation', type: 'button', defaultValue: false }
        ]
      }
      
      render(<ProgressiveDisclosurePanel {...propsWithReset} />)
      
      const resetButton = screen.getByText('Reset Simulation')
      const ungroupedArea = screen.getByTestId('ungrouped-controls')
      
      // Reset button should be in ungrouped area, not hidden in collapsible groups
      expect(ungroupedArea).toContainElement(resetButton)
      expect(resetButton).toHaveClass('bg-yellow-500') // Prominent styling
    })
  })

  describe('Touch Interactions', () => {
    it('handles touch events on controls properly', async () => {
      const user = userEvent.setup()
      render(<ProgressiveDisclosurePanel {...defaultProps} />)
      
      const speedSlider = screen.getByLabelText('Speed')
      
      // Touch interaction should work
      fireEvent.touchStart(speedSlider)
      fireEvent.change(speedSlider, { target: { value: '8' } })
      fireEvent.touchEnd(speedSlider)
      
      expect(defaultProps.onControlChange).toHaveBeenCalledWith('speed', 8)
    })

    it('supports momentum scrolling in advanced panel', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} isExpanded={true} />)
      
      const advancedPanel = screen.getByTestId('advanced-controls-panel')
      
      // Should have momentum scrolling styles
      expect(advancedPanel).toHaveClass('overflow-y-auto')
      expect(advancedPanel).toHaveStyle('-webkit-overflow-scrolling: touch')
    })

    it('prevents body scroll when advanced panel is scrolling', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} isExpanded={true} />)
      
      const advancedPanel = screen.getByTestId('advanced-controls-panel')
      
      // Touch events should be handled to prevent body scroll
      fireEvent.touchStart(advancedPanel)
      
      expect(document.body).toHaveStyle('overflow: hidden')
    })
  })

  describe('Responsive Behavior', () => {
    it('adapts control layout based on available width', () => {
      // Mock narrow viewport
      Object.defineProperty(window, 'innerWidth', { value: 320 })
      
      render(<ProgressiveDisclosurePanel {...defaultProps} />)
      
      const essentialArea = screen.getByTestId('essential-controls-area')
      
      // Should use single column layout on narrow screens
      expect(essentialArea).toHaveClass('grid-cols-1')
    })

    it('uses multi-column layout on wider screens', () => {
      // Mock wider viewport
      Object.defineProperty(window, 'innerWidth', { value: 400 })
      
      render(<ProgressiveDisclosurePanel {...defaultProps} />)
      
      const essentialArea = screen.getByTestId('essential-controls-area')
      
      // Should use multi-column layout on wider screens
      expect(essentialArea).toHaveClass('grid-cols-2')
    })

    it('adjusts padding based on screen size', () => {
      Object.defineProperty(window, 'innerWidth', { value: 320 })
      
      render(<ProgressiveDisclosurePanel {...defaultProps} />)
      
      const panel = screen.getByTestId('progressive-disclosure-panel')
      expect(panel).toHaveClass('p-4') // Mobile padding
    })
  })

  describe('Animation and Transitions', () => {
    it('animates expansion and collapse smoothly', async () => {
      const { rerender } = render(<ProgressiveDisclosurePanel {...defaultProps} />)
      
      // Expand
      rerender(<ProgressiveDisclosurePanel {...defaultProps} isExpanded={true} />)
      
      const advancedPanel = screen.getByTestId('advanced-controls-panel')
      
      // Should have transition classes
      expect(advancedPanel).toHaveClass('transition-all', 'duration-300', 'ease-in-out')
    })

    it('maintains smooth scrolling during transitions', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} isExpanded={true} />)
      
      const advancedPanel = screen.getByTestId('advanced-controls-panel')
      expect(advancedPanel).toHaveStyle('scroll-behavior: smooth')
    })
  })

  describe('Performance', () => {
    it('does not render advanced controls when collapsed', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} isExpanded={false} />)
      
      // Advanced control components should not be in DOM
      expect(screen.queryByText('Physics Settings')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Gravity')).not.toBeInTheDocument()
    })

    it('efficiently updates control values without re-rendering entire panel', async () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} />)
      
      const speedSlider = screen.getByLabelText('Speed')
      
      // Performance test - control changes should be fast
      const startTime = performance.now()
      fireEvent.change(speedSlider, { target: { value: '7' } })
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(16) // 60fps budget
    })
  })

  describe('Accessibility', () => {
    it('maintains proper focus order through essential and advanced controls', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} isExpanded={true} />)
      
      const focusableElements = screen.getAllByRole('slider')
        .concat(screen.getAllByRole('button'))
        .concat(screen.getAllByRole('checkbox'))
      
      // Focus should flow logically: essential → toggle → advanced
      expect(focusableElements.length).toBeGreaterThan(0)
    })

    it('announces control value changes to screen readers', async () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} />)
      
      const speedSlider = screen.getByLabelText('Speed')
      fireEvent.change(speedSlider, { target: { value: '8' } })
      
      // Should have aria-live region for value announcements
      const liveRegion = screen.getByRole('status')
      expect(liveRegion).toHaveTextContent('Speed: 8')
    })

    it('provides proper labels and descriptions for all controls', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} isExpanded={true} />)
      
      // All controls should have proper labels
      expect(screen.getByLabelText('Speed')).toBeInTheDocument()
      expect(screen.getByLabelText('Intensity')).toBeInTheDocument()
      expect(screen.getByLabelText('Color')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty essential controls gracefully', () => {
      render(
        <ProgressiveDisclosurePanel 
          {...defaultProps} 
          essentialControls={[]}
        />
      )
      
      const essentialArea = screen.getByTestId('essential-controls-area')
      expect(essentialArea).toBeInTheDocument()
      expect(essentialArea).toBeEmptyDOMElement()
    })

    it('handles empty advanced control groups gracefully', () => {
      render(
        <ProgressiveDisclosurePanel 
          {...defaultProps} 
          advancedControlGroups={[]}
          isExpanded={true}
        />
      )
      
      const advancedPanel = screen.getByTestId('advanced-controls-panel')
      expect(advancedPanel).toBeInTheDocument()
      expect(advancedPanel).toHaveTextContent('No advanced controls available')
    })

    it('handles missing control values gracefully', () => {
      render(
        <ProgressiveDisclosurePanel 
          {...defaultProps} 
          controlValues={{}} // Empty values
        />
      )
      
      // Should use default values
      const speedSlider = screen.getByLabelText('Speed')
      expect(speedSlider).toHaveValue('5') // Default from control definition
    })
  })
})