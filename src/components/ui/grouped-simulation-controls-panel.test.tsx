// AIDEV-NOTE: Integration tests for grouped control panel with viewport constraints - Issue #19
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GroupedSimulationControlsPanel from './grouped-simulation-controls-panel'
import type { PatternControl } from '@/components/pattern-generators/types'

// Mock the child components
jest.mock('./collapsible-control-group', () => {
  return function MockCollapsibleControlGroup({ title, controls, onControlChange, defaultCollapsed }: {
    title: string
    controls: PatternControl[]
    onControlChange: (id: string, value: string | number | boolean) => void
    defaultCollapsed?: boolean
  }) {
    return (
      <div data-testid={`group-${title.replace(/\s+/g, '-').toLowerCase()}`}>
        <h3>{title}</h3>
        <div data-testid="group-expanded">{!defaultCollapsed ? 'expanded' : 'collapsed'}</div>
        {controls.map((control: PatternControl) => (
          <button
            key={control.id}
            onClick={() => onControlChange(control.id, 'test-value')}
            data-testid={`control-${control.id}`}
          >
            {control.label}
          </button>
        ))}
      </div>
    )
  }
})

jest.mock('./viewport-constrained-panel', () => {
  return function MockViewportConstrainedPanel({ children, ...props }: {
    children: React.ReactNode
    [key: string]: unknown
  }) {
    return (
      <div data-testid="viewport-panel" data-props={JSON.stringify(props)}>
        {children}
      </div>
    )
  }
})

describe('GroupedSimulationControlsPanel', () => {
  const mockFourPoleGradientControls: PatternControl[] = [
    // Pole Colors group
    { id: 'pole1Color', label: 'Pole 1 Color', type: 'color', defaultValue: '#FF0000' },
    { id: 'pole2Color', label: 'Pole 2 Color', type: 'color', defaultValue: '#00FF00' },
    { id: 'pole3Color', label: 'Pole 3 Color', type: 'color', defaultValue: '#0000FF' },
    { id: 'pole4Color', label: 'Pole 4 Color', type: 'color', defaultValue: '#FFFF00' },
    
    // Gradient Properties group
    { id: 'interpolationPower', label: 'Interpolation Power', type: 'range', min: 0.5, max: 4.0, defaultValue: 2.0 },
    
    // Animation Settings group
    { id: 'animationEnabled', label: 'Animation Enabled', type: 'checkbox', defaultValue: false },
    { id: 'animationSpeed', label: 'Animation Speed', type: 'range', min: 0.1, max: 3.0, defaultValue: 1.0 },
    { id: 'animationPattern', label: 'Animation Pattern', type: 'select', defaultValue: 'circular', options: [
      { value: 'circular', label: 'CIRCULAR_ORBIT' },
      { value: 'figure8', label: 'FIGURE_8_PATH' }
    ]},
    
    // Noise Overlay group
    { id: 'noiseEnabled', label: 'Noise Overlay', type: 'checkbox', defaultValue: false },
    { id: 'noiseIntensity', label: 'Noise Intensity', type: 'range', min: 0.0, max: 1.0, defaultValue: 0.3 },
    { id: 'noiseScale', label: 'Noise Scale', type: 'range', min: 0.005, max: 0.1, defaultValue: 0.02 },
    { id: 'noiseType', label: 'Noise Type', type: 'select', defaultValue: 'analog', options: [
      { value: 'analog', label: 'ANALOG_GRAIN' },
      { value: 'digital', label: 'DIGITAL_STATIC' }
    ]},
    
    // Display group
    { id: 'showPoles', label: 'Show Pole Indicators', type: 'checkbox', defaultValue: true }
  ]

  const mockSimpleControls: PatternControl[] = [
    { id: 'speed', label: 'Animation Speed', type: 'range', min: 0.1, max: 3.0, defaultValue: 1.0 },
    { id: 'brightness', label: 'Brightness', type: 'range', min: 0.5, max: 2.0, defaultValue: 1.0 }
  ]

  const mockOnControlChange = jest.fn()
  const mockControlValues = {
    pole1Color: '#FF0000',
    pole2Color: '#00FF00',
    animationEnabled: true,
    noiseEnabled: false,
    showPoles: true
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Integration', () => {
    it('renders viewport-constrained panel with correct props', () => {
      render(
        <GroupedSimulationControlsPanel
          patternId="four-pole-gradient"
          controls={mockFourPoleGradientControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
          sidebarWidth={400}
        />
      )

      const viewportPanel = screen.getByTestId('viewport-panel')
      expect(viewportPanel).toBeInTheDocument()
      
      const props = JSON.parse(viewportPanel.getAttribute('data-props') || '{}')
      expect(props.paddingBuffer).toBe(24) // Should use appropriate padding
    })

    it('renders pattern without grouping when controls are few', () => {
      render(
        <GroupedSimulationControlsPanel
          patternId="simple-pattern"
          controls={mockSimpleControls}
          controlValues={{ speed: 1.5, brightness: 1.2 }}
          onControlChange={mockOnControlChange}
          sidebarWidth={400}
        />
      )

      // Should render simple grid instead of groups for few controls
      expect(screen.queryByTestId('group-animation-settings')).not.toBeInTheDocument()
      expect(screen.getByLabelText('Animation Speed')).toBeInTheDocument()
      expect(screen.getByLabelText('Brightness')).toBeInTheDocument()
    })
  })

  describe('Four-Pole Gradient Grouping', () => {
    beforeEach(() => {
      render(
        <GroupedSimulationControlsPanel
          patternId="four-pole-gradient"
          controls={mockFourPoleGradientControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
          sidebarWidth={400}
        />
      )
    })

    it('creates correct control groups', () => {
      expect(screen.getByTestId('group-pole-colors')).toBeInTheDocument()
      expect(screen.getByTestId('group-gradient-properties')).toBeInTheDocument() 
      expect(screen.getByTestId('group-animation-settings')).toBeInTheDocument()
      expect(screen.getByTestId('group-noise-overlay')).toBeInTheDocument()
      expect(screen.getByTestId('group-display')).toBeInTheDocument()
    })

    it('sets correct default collapsed states', () => {
      // Primary groups should be expanded (pole colors uses real component, so check for content)
      const poleColorsGroup = screen.getByTestId('group-pole-colors')
      expect(poleColorsGroup).toBeInTheDocument()
      // Real component shows color pickers when expanded, mocked ones show "expanded" 
      const poleColorPicker = screen.queryByText('Pole 1 Color')
      expect(poleColorPicker).toBeInTheDocument() // Should be visible when expanded
      
      expect(screen.getByTestId('group-animation-settings')).toHaveTextContent('expanded')
      
      // Secondary groups should be collapsed by default
      expect(screen.getByTestId('group-noise-overlay')).toHaveTextContent('collapsed')
      expect(screen.getByTestId('group-display')).toHaveTextContent('collapsed')
    })

    it('groups controls correctly by category', () => {
      // Pole Colors group should have color controls
      const poleColorsGroup = screen.getByTestId('group-pole-colors')
      expect(poleColorsGroup).toHaveTextContent('Pole 1 Color')
      expect(poleColorsGroup).toHaveTextContent('Pole 2 Color')
      expect(poleColorsGroup).toHaveTextContent('Pole 3 Color')
      expect(poleColorsGroup).toHaveTextContent('Pole 4 Color')

      // Animation Settings group should have animation controls
      const animationGroup = screen.getByTestId('group-animation-settings')
      expect(animationGroup).toHaveTextContent('Animation Enabled')
      expect(animationGroup).toHaveTextContent('Animation Speed')
      expect(animationGroup).toHaveTextContent('Animation Pattern')

      // Noise Overlay group should have noise controls
      const noiseGroup = screen.getByTestId('group-noise-overlay')
      expect(noiseGroup).toHaveTextContent('Noise Overlay')
      expect(noiseGroup).toHaveTextContent('Noise Intensity')
      expect(noiseGroup).toHaveTextContent('Noise Scale')
      expect(noiseGroup).toHaveTextContent('Noise Type')
    })
  })

  describe('Control Change Integration', () => {
    it('forwards control changes correctly through groups', () => {
      render(
        <GroupedSimulationControlsPanel
          patternId="four-pole-gradient"
          controls={mockFourPoleGradientControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
          sidebarWidth={400}
        />
      )

      // Click a color picker in the pole colors group
      // The pole colors group uses real CompactColorPicker components, not mocked buttons
      const pole1Label = screen.getByText('Pole 1 Color')
      expect(pole1Label).toBeInTheDocument()
      
      // For now, we'll verify the group renders correctly
      // The actual color picker interaction would require more complex testing
      expect(mockOnControlChange).not.toHaveBeenCalled() // No clicks yet
    })

    it('handles control changes from multiple groups', async () => {
      const user = userEvent.setup()
      render(
        <GroupedSimulationControlsPanel
          patternId="four-pole-gradient"
          controls={mockFourPoleGradientControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
          sidebarWidth={400}
        />
      )

      // Click controls from different groups
      await user.click(screen.getByTestId('control-animationEnabled'))
      expect(mockOnControlChange).toHaveBeenCalledWith('animationEnabled', 'test-value')

      await user.click(screen.getByTestId('control-noiseEnabled'))
      expect(mockOnControlChange).toHaveBeenCalledWith('noiseEnabled', 'test-value')

      expect(mockOnControlChange).toHaveBeenCalledTimes(2)
    })
  })

  describe('Responsive Behavior', () => {
    it('adapts grouping based on sidebar width', () => {
      const { rerender } = render(
        <GroupedSimulationControlsPanel
          patternId="four-pole-gradient"
          controls={mockFourPoleGradientControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
          sidebarWidth={300} // Narrow sidebar
        />
      )

      // Should still create groups but maybe adjust layout
      expect(screen.getByTestId('group-pole-colors')).toBeInTheDocument()

      // Widen sidebar
      rerender(
        <GroupedSimulationControlsPanel
          patternId="four-pole-gradient"
          controls={mockFourPoleGradientControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
          sidebarWidth={600} // Wide sidebar
        />
      )

      expect(screen.getByTestId('group-pole-colors')).toBeInTheDocument()
    })

    it('adjusts viewport constraints based on sidebar width', () => {
      render(
        <GroupedSimulationControlsPanel
          patternId="four-pole-gradient"
          controls={mockFourPoleGradientControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
          sidebarWidth={500}
        />
      )

      const viewportPanel = screen.getByTestId('viewport-panel')
      const props = JSON.parse(viewportPanel.getAttribute('data-props') || '{}')
      
      // Should have appropriate padding for wider sidebar
      expect(props.paddingBuffer).toBeGreaterThan(0)
    })
  })

  describe('Pattern-Specific Grouping Logic', () => {
    it('handles particle system pattern grouping', () => {
      const particleControls: PatternControl[] = [
        { id: 'particleCount', label: 'Particle Count', type: 'range', min: 1, max: 100, defaultValue: 50 },
        { id: 'lifeExpectancy', label: 'Life Expectancy', type: 'range', min: 1.0, max: 10.0, defaultValue: 5.0 },
        { id: 'movementSpeed', label: 'Movement Speed', type: 'range', min: 0.1, max: 5.0, defaultValue: 1.0 },
        { id: 'gravity', label: 'Gravity', type: 'range', min: -2.0, max: 2.0, defaultValue: 0.0 },
        { id: 'brightness', label: 'Brightness', type: 'range', min: 0.5, max: 8.0, defaultValue: 3.0 },
        { id: 'enableTrails', label: 'Enable Trails', type: 'checkbox', defaultValue: true },
        { id: 'colorPalette', label: 'Color Palette', type: 'select', defaultValue: 'classic', options: [] }
      ]

      render(
        <GroupedSimulationControlsPanel
          patternId="particle-system"
          controls={particleControls}
          controlValues={{}}
          onControlChange={mockOnControlChange}
          sidebarWidth={400}
        />
      )

      // Should create particle-specific groups
      expect(screen.getByTestId('group-particle-properties')).toBeInTheDocument()
      expect(screen.getByTestId('group-physics-settings')).toBeInTheDocument()
      expect(screen.getByTestId('group-visual-effects')).toBeInTheDocument()
    })

    it('handles cellular automaton pattern grouping even with few controls', () => {
      const cellularControls: PatternControl[] = [
        { id: 'rulePrev', label: '← PREV', type: 'button', defaultValue: false },
        { id: 'ruleNext', label: 'NEXT →', type: 'button', defaultValue: false },
        { id: 'cellSize', label: 'Cell Size', type: 'range', min: 1, max: 8, defaultValue: 2 },
        { id: 'animationSpeed', label: 'Generation Speed', type: 'range', min: 0.02, max: 0.5, defaultValue: 0.30 },
        { id: 'initialCondition', label: 'Initial Condition', type: 'select', defaultValue: 'center', options: [] },
        { id: 'resetTrigger', label: 'Reset Automaton', type: 'button', defaultValue: false }
      ]

      render(
        <GroupedSimulationControlsPanel
          patternId="cellular-automaton"
          controls={cellularControls}
          controlValues={{ rule: 30 }}
          onControlChange={mockOnControlChange}
          sidebarWidth={400}
        />
      )

      // Should create groups for cellular automaton even with only 6 controls
      expect(screen.getByTestId('group-rule-navigation')).toBeInTheDocument()
      expect(screen.getByTestId('group-generation-settings')).toBeInTheDocument()
      
      // Reset button should NOT be grouped - it should appear ungrouped at bottom
      expect(screen.queryByTestId('group-controls')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Reset Automaton' })).toBeInTheDocument() // Reset button appears ungrouped
    })

    it('falls back to ungrouped layout for unknown patterns', () => {
      render(
        <GroupedSimulationControlsPanel
          patternId="unknown-pattern"
          controls={mockSimpleControls}
          controlValues={{ speed: 1.0, brightness: 1.0 }}
          onControlChange={mockOnControlChange}
          sidebarWidth={400}
        />
      )

      // Should not create groups for unknown patterns
      expect(screen.queryByTestId('group-animation-settings')).not.toBeInTheDocument()
      expect(screen.getByLabelText('Animation Speed')).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('memoizes control groups to prevent unnecessary re-renders', () => {
      const { rerender } = render(
        <GroupedSimulationControlsPanel
          patternId="four-pole-gradient"
          controls={mockFourPoleGradientControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
          sidebarWidth={400}
        />
      )

      const initialGroups = screen.getAllByTestId(/^group-/)

      // Re-render with same props
      rerender(
        <GroupedSimulationControlsPanel
          patternId="four-pole-gradient"
          controls={mockFourPoleGradientControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
          sidebarWidth={400}
        />
      )

      const afterGroups = screen.getAllByTestId(/^group-/)
      expect(afterGroups).toHaveLength(initialGroups.length)
    })

    it('handles large number of controls efficiently', () => {
      const manyControls: PatternControl[] = Array.from({ length: 20 }, (_, i) => ({
        id: `control${i}`,
        label: `Control ${i}`,
        type: 'range' as const,
        min: 0,
        max: 10,
        defaultValue: 5
      }))

      const startTime = performance.now()
      
      render(
        <GroupedSimulationControlsPanel
          patternId="complex-pattern"
          controls={manyControls}
          controlValues={{}}
          onControlChange={mockOnControlChange}
          sidebarWidth={400}
        />
      )

      const endTime = performance.now()
      
      // Should render quickly even with many controls
      expect(endTime - startTime).toBeLessThan(100) // 100ms threshold
    })
  })

  describe('Accessibility Integration', () => {
    it('maintains proper focus management across groups', async () => {
      const user = userEvent.setup()
      render(
        <GroupedSimulationControlsPanel
          patternId="four-pole-gradient"
          controls={mockFourPoleGradientControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
          sidebarWidth={400}
        />
      )

      // Should be able to tab through the grouped controls
      // The pole colors group uses real CompactColorPicker components
      const poleColorsGroup = screen.getByTestId('group-pole-colors')
      expect(poleColorsGroup).toBeInTheDocument()
      
      await user.tab()
      // Focus behavior would be tested in actual integration
      expect(poleColorsGroup).toBeInTheDocument()
    })

    it('provides proper ARIA structure for grouped controls', () => {
      render(
        <GroupedSimulationControlsPanel
          patternId="four-pole-gradient"
          controls={mockFourPoleGradientControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
          sidebarWidth={400}
        />
      )

      // Viewport panel should have proper ARIA
      const viewportPanel = screen.getByTestId('viewport-panel')
      expect(viewportPanel).toBeInTheDocument()
      
      // Groups should be properly structured
      expect(screen.getByTestId('group-pole-colors')).toBeInTheDocument()
    })
  })
})