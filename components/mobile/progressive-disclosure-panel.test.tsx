// AIDEV-NOTE: Behavioral tests per G-8 - focus on user actions, not implementation details
import { render, screen, fireEvent } from '@testing-library/react'
import ProgressiveDisclosurePanel from './progressive-disclosure-panel'

const mockControls = [
  { id: 'speed', label: 'Speed', type: 'range', min: 0, max: 10, step: 1, defaultValue: 5 },
  { id: 'intensity', label: 'Intensity', type: 'range', min: 0, max: 5, step: 0.1, defaultValue: 2.0 },
  { id: 'color', label: 'Color', type: 'color', defaultValue: '#ff0000' },
  { id: 'particles', label: 'Particles', type: 'range', min: 1, max: 100, step: 1, defaultValue: 50 },
  { id: 'brightness', label: 'Brightness', type: 'range', min: 0, max: 5, step: 0.1, defaultValue: 2.0 },
  { id: 'reset', label: 'Reset', type: 'button', defaultValue: false },
]

describe('ProgressiveDisclosurePanel - User Behavior', () => {
  const defaultProps = {
    patternId: 'test-pattern',
    controls: mockControls,
    controlValues: {
      speed: 5,
      intensity: 2.0,
      color: '#ff0000',
      particles: 50,
      brightness: 2.0,
      reset: false
    },
    onControlChange: jest.fn(),
    isExpanded: false,
    onToggleExpanded: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('User can access essential controls immediately', () => {
    it('shows most important controls without requiring any interaction', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} />)
      
      // User should see essential controls right away
      expect(screen.getByLabelText('Speed')).toBeInTheDocument()
      expect(screen.getByLabelText('Intensity')).toBeInTheDocument()
      expect(screen.getByLabelText('Color')).toBeInTheDocument()
      
      // Current values should be visible
      expect(screen.getByDisplayValue('5')).toBeInTheDocument() // Speed slider
      expect(screen.getByDisplayValue('#ff0000')).toBeInTheDocument() // Color picker
    })

    it('allows user to change essential control values', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} />)
      
      // User changes speed
      const speedControl = screen.getByLabelText('Speed')
      fireEvent.change(speedControl, { target: { value: '8' } })
      
      expect(defaultProps.onControlChange).toHaveBeenCalledWith('speed', 8)
    })
  })

  describe('User can access advanced controls when needed', () => {
    it('allows user to expand advanced controls', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} />)
      
      // Initially advanced controls are not visible
      expect(screen.queryByLabelText('Particles')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Brightness')).not.toBeInTheDocument()
      
      // User clicks to expand advanced controls
      const expandButton = screen.getByRole('button', { name: /advanced controls/i })
      fireEvent.click(expandButton)
      
      expect(defaultProps.onToggleExpanded).toHaveBeenCalled()
    })

    it('shows advanced controls when expanded', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} isExpanded={true} />)
      
      // User can now see advanced controls
      expect(screen.getByLabelText('Particles')).toBeInTheDocument()
      expect(screen.getByLabelText('Brightness')).toBeInTheDocument()
    })

    it('allows user to collapse advanced controls', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} isExpanded={true} />)
      
      // User clicks to collapse
      const collapseButton = screen.getByRole('button', { name: /less controls/i })
      fireEvent.click(collapseButton)
      
      expect(defaultProps.onToggleExpanded).toHaveBeenCalled()
    })
  })

  describe('User can use important action controls', () => {
    it('provides easy access to reset functionality', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} />)
      
      // Reset button should be prominently available
      const resetButton = screen.getByRole('button', { name: 'Reset' })
      expect(resetButton).toBeInTheDocument()
    })

    it('allows user to trigger reset action', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} />)
      
      const resetButton = screen.getByRole('button', { name: 'Reset' })
      fireEvent.click(resetButton)
      
      expect(defaultProps.onControlChange).toHaveBeenCalledWith('reset', expect.anything())
    })
  })

  describe('User receives clear feedback about control states', () => {
    it('shows current values for all visible controls', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} isExpanded={true} />)
      
      // User can see current values
      expect(screen.getByDisplayValue('5')).toBeInTheDocument() // Speed
      expect(screen.getByDisplayValue('#ff0000')).toBeInTheDocument() // Color
      expect(screen.getByDisplayValue('50')).toBeInTheDocument() // Particles
      
      // Check for specific controls to avoid duplicate value matches
      const intensityControl = screen.getByLabelText('Intensity')
      expect(intensityControl).toHaveValue('2')
      const brightnessControl = screen.getByLabelText('Brightness')
      expect(brightnessControl).toHaveValue('2')
    })

    it('updates displayed values when control values change', () => {
      const { rerender } = render(<ProgressiveDisclosurePanel {...defaultProps} />)
      
      // Initially shows default speed
      expect(screen.getByDisplayValue('5')).toBeInTheDocument()
      
      // When value changes, user sees updated value
      const newProps = {
        ...defaultProps,
        controlValues: { ...defaultProps.controlValues, speed: 8 }
      }
      rerender(<ProgressiveDisclosurePanel {...newProps} />)
      
      expect(screen.getByDisplayValue('8')).toBeInTheDocument()
    })
  })

  describe('User has smooth interaction experience', () => {
    it('provides responsive feedback when expanding/collapsing', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} />)
      
      const expandButton = screen.getByRole('button', { name: /advanced controls/i })
      
      // User sees visual feedback (button text changes)
      expect(expandButton).toHaveTextContent('Advanced Controls')
      
      // After interaction, user gets feedback (this would be managed by parent)
      fireEvent.click(expandButton)
      expect(defaultProps.onToggleExpanded).toHaveBeenCalled()
    })

    it('handles missing control values gracefully', () => {
      const propsWithMissingValues = {
        ...defaultProps,
        controlValues: {} // Empty values
      }
      
      render(<ProgressiveDisclosurePanel {...propsWithMissingValues} />)
      
      // User should still see controls, just with default/empty states
      expect(screen.getByLabelText('Speed')).toBeInTheDocument()
      expect(screen.getByLabelText('Color')).toBeInTheDocument()
    })

    it('handles empty control list gracefully', () => {
      const propsWithNoControls = {
        ...defaultProps,
        controls: []
      }
      
      render(<ProgressiveDisclosurePanel {...propsWithNoControls} />)
      
      // User should see appropriate message
      expect(screen.getByText('No essential controls available')).toBeInTheDocument()
    })
  })

  describe('User gets appropriate pattern-specific layouts', () => {
    it('adapts control organization based on pattern type', () => {
      render(<ProgressiveDisclosurePanel {...defaultProps} patternId="four-pole-gradient" />)
      
      // User should see controls organized appropriately for the pattern
      // (Exact layout depends on getMobileControlLayout implementation)
      expect(screen.getByLabelText('Speed')).toBeInTheDocument()
    })
  })
})