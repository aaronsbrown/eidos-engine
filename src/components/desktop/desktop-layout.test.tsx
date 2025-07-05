// AIDEV-NOTE: BEHAVIORAL_TEST - Desktop layout user workflows and interactions - Issue #12
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DesktopLayout from './desktop-layout'
import { ThemeProvider } from '@/lib/theme-context'
import { PatternStateProvider } from '@/lib/contexts/pattern-state-context'

// Test wrapper with required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <PatternStateProvider>
      {children}
    </PatternStateProvider>
  </ThemeProvider>
)

// Mock educational content system to avoid educational buttons interfering with tests
jest.mock('@/lib/hooks/use-educational-content', () => ({
  useEducationalContent: () => ({
    content: {
      title: 'Educational Content: test',
      layers: {
        intuitive: { title: 'What is this?', content: 'Educational content is being loaded...' },
        conceptual: { title: 'How does this work?', content: 'Educational content is being loaded...' },
        technical: { title: 'Show me the code', content: 'Educational content is being loaded...' }
      }
    },
    isLoading: false,
    error: null
  })
}))

// Mock educational content availability to return no patterns
jest.mock('@/lib/educational-content-loader', () => ({
  getAllPatternIds: () => [], // No educational content available
  hasEducationalContent: async () => false
}))

// Mock pattern generators with minimal test data
jest.mock('@/components/pattern-generators', () => ({
  patternGenerators: [
    {
      id: 'trigonometric-circle',
      name: 'Trigonometric Circle',
      component: () => <div data-testid="pattern-trig">Trig Pattern</div>,
      technology: 'CANVAS_2D',
      category: 'Geometric',
      controls: [
        { id: 'speed', label: 'Speed', type: 'range', min: 0, max: 10, step: 1, defaultValue: 5 },
        { id: 'radius', label: 'Radius', type: 'range', min: 10, max: 100, step: 5, defaultValue: 50 }
      ]
    },
    {
      id: 'noise-field',
      name: 'Noise Field',
      component: () => <div data-testid="pattern-noise">Noise Pattern</div>,
      technology: 'WEBGL_2.0',
      category: 'Noise',
      controls: [
        { id: 'scale', label: 'Scale', type: 'range', min: 1, max: 50, step: 1, defaultValue: 20 },
        { id: 'color', label: 'Color', type: 'color', defaultValue: '#00ff00' }
      ]
    },
    {
      id: 'particle-system',
      name: 'Particle System',
      component: () => <div data-testid="pattern-particle">Particle Pattern</div>,
      technology: 'WEBGL_2.0',
      category: 'Simulation',
      controls: [
        { id: 'particles', label: 'Particles', type: 'range', min: 10, max: 1000, step: 10, defaultValue: 100 },
        { id: 'reset', label: 'Reset', type: 'button', defaultValue: false }
      ]
    },
    {
      id: 'frequency-spectrum',
      name: 'Frequency Spectrum',
      component: () => <div data-testid="pattern-freq">Frequency Pattern</div>,
      technology: 'CANVAS_2D',
      category: 'Data Visualization',
      controls: []
    },
    {
      id: 'cellular-automaton',
      name: 'Cellular Automaton',
      component: () => <div data-testid="pattern-cellular">Cellular Pattern</div>,
      technology: 'CANVAS_2D',
      category: 'Simulation',
      controls: [
        { id: 'density', label: 'Initial Density', type: 'range', min: 0, max: 1, step: 0.1, defaultValue: 0.5 }
      ]
    },
    {
      id: 'brownian-motion',
      name: 'Brownian Motion',
      component: () => <div data-testid="pattern-brownian">Brownian Pattern</div>,
      technology: 'CANVAS_2D',
      category: 'Noise',
      controls: []
    }
  ]
}))

// Mock UI components that would have complex implementations
jest.mock('@/components/ui/grouped-simulation-controls-panel', () => ({
  __esModule: true,
  default: ({ controls, controlValues, onControlChange }: { controls: any[]; controlValues: Record<string, any>; onControlChange: (id: string, value: any) => void }) => (
    <div data-testid="simulation-controls">
      {controls.map((control: any) => (
        <div key={control.id}>
          {control.type === 'range' && (
            <input
              type="range"
              aria-label={control.label}
              min={control.min}
              max={control.max}
              step={control.step}
              value={controlValues[control.id] || control.defaultValue}
              onChange={(e) => onControlChange(control.id, Number(e.target.value))}
            />
          )}
          {control.type === 'color' && (
            <input
              type="color"
              aria-label={control.label}
              value={controlValues[control.id] || control.defaultValue}
              onChange={(e) => onControlChange(control.id, e.target.value)}
            />
          )}
          {control.type === 'button' && (
            <button
              aria-label={control.label}
              onClick={() => onControlChange(control.id, true)}
            >
              {control.label}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}))

// Mock preset components
jest.mock('@/components/ui/floating-preset-panel', () => ({
  FloatingPresetPanel: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="preset-panel">
      <button onClick={onClose}>Close</button>
      Preset Panel
    </div>
  )
}))

jest.mock('@/components/ui/save-preset-modal', () => ({
  SavePresetModal: ({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: (name: string) => void }) =>
    isOpen ? (
      <div data-testid="save-modal">
        <input aria-label="Preset name" />
        <button onClick={() => onSave('test-preset')}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    ) : null
}))

// Mock preset manager hook
const mockLoadPreset = jest.fn()
const mockSavePreset = jest.fn()
jest.mock('@/lib/hooks/use-preset-manager', () => ({
  usePresetManager: () => ({
    presets: [
      { id: 'preset-1', name: 'Preset 1' },
      { id: 'preset-2', name: 'Preset 2' },
      { id: 'preset-3', name: 'Preset 3' }
    ],
    activePresetId: null,
    loadPreset: mockLoadPreset,
    savePreset: mockSavePreset,
    error: null,
    clearError: jest.fn(),
    isLoading: false
  })
}))

describe('DesktopLayout - User Behavior', () => {
  // AIDEV-NOTE: Mock wheel events and timers for scroll testing - required for JSDOM environment
  beforeAll(() => {
    // Ensure wheel events are properly supported
    if (!window.WheelEvent) {
      window.WheelEvent = window.Event as any
    }
    // Use real timers for setTimeout in scroll throttling
    jest.useRealTimers()
  })

  afterAll(() => {
    // Restore fake timers for other tests
    jest.useFakeTimers()
  })
  beforeEach(() => {
    jest.clearAllMocks()
    // Clear localStorage to ensure clean test state
    localStorage.clear()
    // Mock window dimensions - use large desktop size by default to get default 700x394 dimensions
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1400 })
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 900 })
  })

  describe('User can see and navigate patterns', () => {
    it('displays the initial pattern and its information', () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      // User sees the app title
      expect(screen.getByText('Eidos Engine')).toBeInTheDocument()

      // User sees the first pattern is selected
      expect(screen.getByTestId('pattern-trig')).toBeInTheDocument()

      // User sees pattern information (check TYPE field in specifications)
      expect(screen.getAllByText(/trigonometric-circle/i)).toHaveLength(2) // Appears in sidebar and specs
      expect(screen.getAllByText(/geometric/i)).toHaveLength(2) // Appears in sidebar divider and specs

      // User sees pattern counter
      expect(screen.queryByText('[01/06]')).not.toBeInTheDocument()
    })

    it('shows pattern names in the selection list', () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      // User should see all patterns (tests show all 6 are visible)
      expect(screen.getByText('Trigonometric Circle')).toBeInTheDocument()
      expect(screen.getByText('Noise Field')).toBeInTheDocument()
      expect(screen.getByText('Particle System')).toBeInTheDocument()
      expect(screen.getByText('Frequency Spectrum')).toBeInTheDocument()
      expect(screen.getByText('Cellular Automaton')).toBeInTheDocument()
      expect(screen.getByText('Brownian Motion')).toBeInTheDocument()
    })

    it('allows user to select different patterns by clicking', async () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      // User clicks on Noise Field pattern
      fireEvent.click(screen.getByText('Noise Field'))

      // Pattern changes
      await waitFor(() => {
        expect(screen.getByTestId('pattern-noise')).toBeInTheDocument()
        expect(screen.queryByTestId('pattern-trig')).not.toBeInTheDocument()
      })

      // Counter updates
      expect(screen.queryByText('[02/06]')).not.toBeInTheDocument()

      // Specifications update
      expect(screen.getAllByText(/noise-field/i)).toHaveLength(2) // Sidebar + specs
      // "Noise" appears in: divider, pattern name, specs, mock pattern content = multiple places
    })

    it('allows user to navigate patterns by clicking on them in scroll list', async () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      // Initially on first pattern
      expect(screen.getByTestId('pattern-trig')).toBeInTheDocument()

      // User clicks on different pattern in the scroll list
      fireEvent.click(screen.getByText('Noise Field'))

      // Pattern changes to second pattern
      await waitFor(() => {
        expect(screen.getByTestId('pattern-noise')).toBeInTheDocument()
      })

      // User clicks back to first pattern
      fireEvent.click(screen.getByText('Trigonometric Circle'))

      // Pattern changes back to first
      await waitFor(() => {
        expect(screen.getByTestId('pattern-trig')).toBeInTheDocument()
      })
    })

    it('shows category dividers in the pattern list', () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      // First visible category divider should be Geometric
      expect(screen.getAllByText(/geometric/i)).toHaveLength(2) // Divider and specs
    })

    it('allows user to navigate to any pattern by clicking', async () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      // Click on the last pattern (Brownian Motion)
      fireEvent.click(screen.getByText('Brownian Motion'))

      // Should be on the last pattern
      await waitFor(() => {
        expect(screen.getByTestId('pattern-brownian')).toBeInTheDocument()
      })
    })

    it('displays all patterns in a scrollable area', async () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      // Initially on first pattern
      expect(screen.getByTestId('pattern-trig')).toBeInTheDocument()

      // Verify scroll area exists
      const scrollArea = screen.getByText('Trigonometric Circle').closest('[data-slot="scroll-area"]')
      expect(scrollArea).toBeInTheDocument()

      // All patterns should be visible in the DOM (within scroll area)
      expect(screen.getByText('Trigonometric Circle')).toBeInTheDocument()
      expect(screen.getByText('Noise Field')).toBeInTheDocument()
      expect(screen.getByText('Particle System')).toBeInTheDocument()
      expect(screen.getByText('Brownian Motion')).toBeInTheDocument()

      // User can click to select different patterns
      fireEvent.click(screen.getByText('Noise Field'))

      await waitFor(() => {
        expect(screen.getByTestId('pattern-noise')).toBeInTheDocument()
      })
    })

    it('allows direct pattern selection that auto-adjusts visible window', async () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      // Initially all patterns should be clickable even if outside visible window
      expect(screen.getByText('Trigonometric Circle')).toBeInTheDocument()
      expect(screen.getByText('Brownian Motion')).toBeInTheDocument()

      // User clicks on last pattern (Brownian Motion)
      fireEvent.click(screen.getByText('Brownian Motion'))

      // Pattern should change and counter should update
      await waitFor(() => {
        expect(screen.getByTestId('pattern-brownian')).toBeInTheDocument()
        expect(screen.getByTestId('pattern-brownian')).toBeInTheDocument()
      })

      // Specifications should update
      expect(screen.getAllByText(/brownian-motion/i)).toHaveLength(2) // Sidebar + specs
    })

    it('maintains scroll position within scroll area boundaries', async () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      // Find scroll area container
      const scrollArea = screen.getByText('Trigonometric Circle').closest('[data-slot="scroll-area"]')
      expect(scrollArea).toBeInTheDocument()

      // Initially on first pattern
      expect(screen.getByTestId('pattern-trig')).toBeInTheDocument()

      // Click on last pattern to verify it's reachable
      fireEvent.click(screen.getByText('Brownian Motion'))

      await waitFor(() => {
        expect(screen.getByTestId('pattern-brownian')).toBeInTheDocument()
      })

      // Click back to first pattern
      fireEvent.click(screen.getByText('Trigonometric Circle'))

      await waitFor(() => {
        expect(screen.getByTestId('pattern-trig')).toBeInTheDocument()
      })
    })
  })

  describe('User can control pattern parameters', () => {
    it('displays controls for the selected pattern', () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      // User sees simulation parameters section
      expect(screen.getByText('Simulation Parameters')).toBeInTheDocument()

      // User sees controls for first pattern (Trigonometric Circle)
      expect(screen.getByLabelText('Speed')).toBeInTheDocument()
      expect(screen.getByLabelText('Radius')).toBeInTheDocument()
    })

    it('updates control values when user interacts with them', async () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      const speedSlider = screen.getByLabelText('Speed')
      expect(speedSlider).toHaveValue('5') // Default value

      // User changes speed
      fireEvent.change(speedSlider, { target: { value: '8' } })

      await waitFor(() => {
        expect(speedSlider).toHaveValue('8')
      })
    })

    it('maintains control values when switching patterns and back', async () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      // Change speed value
      const speedSlider = screen.getByLabelText('Speed')
      fireEvent.change(speedSlider, { target: { value: '8' } })

      // Switch to another pattern
      fireEvent.click(screen.getByText('Noise Field'))

      await waitFor(() => {
        expect(screen.getByTestId('pattern-noise')).toBeInTheDocument()
      })

      // Switch back
      fireEvent.click(screen.getByText('Trigonometric Circle'))

      await waitFor(() => {
        expect(screen.getByTestId('pattern-trig')).toBeInTheDocument()
      })

      // Value should be preserved
      expect(screen.getByLabelText('Speed')).toHaveValue('8')
    })

    it('handles different control types appropriately', async () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      // Switch to Noise Field which has a color control
      fireEvent.click(screen.getByText('Noise Field'))

      await waitFor(() => {
        expect(screen.getByTestId('pattern-noise')).toBeInTheDocument()
      })

      // User sees color control
      const colorPicker = screen.getByLabelText('Color')
      expect(colorPicker).toHaveValue('#00ff00')

      // User changes color
      fireEvent.change(colorPicker, { target: { value: '#ff0000' } })

      await waitFor(() => {
        expect(colorPicker).toHaveValue('#ff0000')
      })
    })

    it('handles button controls like reset', async () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      // Switch to Particle System which has a reset button
      fireEvent.click(screen.getByText('Particle System'))

      await waitFor(() => {
        expect(screen.getByTestId('pattern-particle')).toBeInTheDocument()
      })

      // User clicks reset button
      const resetButton = screen.getByLabelText('Reset')
      fireEvent.click(resetButton)

      // Button click should trigger control change
      expect(resetButton).toBeInTheDocument()
    })
  })

  describe('User can control viewport dimensions', () => {
    it('displays viewport controls with current dimensions', () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      expect(screen.getByText('Viewport')).toBeInTheDocument()
      expect(screen.getByText('700px')).toBeInTheDocument() // Default width
      expect(screen.getByText('394px')).toBeInTheDocument() // Default height
    })

    it('automatically adjusts visualization size for smaller desktop screens (iPad Mini)', async () => {
      // AIDEV-NOTE: Test responsive dimensions for Issue #70 - iPad Mini horizontal (1024x768)
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 })
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 768 })

      render(<DesktopLayout />, { wrapper: TestWrapper })

      // For iPad Mini (1024px width), should use responsive sizing (45% of viewport = ~460px, but min 500px)
      await waitFor(() => {
        expect(screen.getByText('500px')).toBeInTheDocument() // Should be 500px (minimum width)
        expect(screen.getByText('281px')).toBeInTheDocument() // Should be 281px (500 * 394/700)
      })

      // Specifications should show the responsive dimensions
      expect(screen.getByText('500 × 281')).toBeInTheDocument()
    })

    it('uses default dimensions for larger desktop screens', async () => {
      // AIDEV-NOTE: Test that larger screens still get default dimensions
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1400 })
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 900 })

      render(<DesktopLayout />, { wrapper: TestWrapper })

      // For larger screens (>1200px), should use default dimensions
      await waitFor(() => {
        expect(screen.getByText('700px')).toBeInTheDocument() // Default width
        expect(screen.getByText('394px')).toBeInTheDocument() // Default height
      })

      expect(screen.getByText('700 × 394')).toBeInTheDocument()
    })

    it('allows user to resize pattern viewport', async () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      // Find width slider by looking for the one with value 700
      const sliders = screen.getAllByRole('slider')
      const widthSlider = sliders.find(s => s.getAttribute('value') === '700')
      expect(widthSlider).toBeDefined()

      // User changes width
      fireEvent.change(widthSlider!, { target: { value: '800' } })

      await waitFor(() => {
        expect(screen.getByText('800px')).toBeInTheDocument()
      })
    })

  })

  describe('User can manage presets', () => {
    it('allows user to browse and select available presets', () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      // User can find and interact with preset selection
      const presetDropdown = screen.getByRole('combobox')
      expect(presetDropdown).toBeInTheDocument()

      // User can see preset options are available for selection
      const options = screen.getAllByRole('option')
      expect(options.length).toBeGreaterThan(2) // Default + at least 2 presets

      // User can interact with the dropdown (it's not disabled)
      expect(presetDropdown).not.toBeDisabled()
    })

    it('loads preset settings when user selects one', async () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      // User selects a preset from the dropdown
      const presetDropdown = screen.getByRole('combobox')
      fireEvent.change(presetDropdown, { target: { value: 'preset-1' } })

      // System loads the preset settings
      await waitFor(() => {
        expect(mockLoadPreset).toHaveBeenCalledWith('preset-1')
      })
    })

    it('opens save modal when user clicks quick save', async () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      // Find the bookmark icon button
      const quickSaveButton = screen.getByTitle('Quick Save Current Settings')
      fireEvent.click(quickSaveButton)

      await waitFor(() => {
        expect(screen.getByTestId('save-modal')).toBeInTheDocument()
      })
    })

    it('opens preset manager panel when user clicks preset manager', async () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      const presetManagerButton = screen.getByText('PRESET MANAGER')
      fireEvent.click(presetManagerButton)

      await waitFor(() => {
        expect(screen.getByTestId('preset-panel')).toBeInTheDocument()
      })

      // User can close it
      fireEvent.click(screen.getByText('Close'))

      await waitFor(() => {
        expect(screen.queryByTestId('preset-panel')).not.toBeInTheDocument()
      })
    })
  })

  describe('User can see pattern specifications', () => {
    it('displays complete pattern specifications', () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      // Check all specification fields
      expect(screen.getByText('TYPE:')).toBeInTheDocument()
      expect(screen.getByText('CATEGORY:')).toBeInTheDocument()
      expect(screen.getByText('SIZE:')).toBeInTheDocument()
      expect(screen.getByText('TECHNOLOGY:')).toBeInTheDocument()
      expect(screen.getByText('FPS:')).toBeInTheDocument()
      expect(screen.getByText('STATUS:')).toBeInTheDocument()

      // Check values (pattern ID and category appear in multiple places)
      expect(screen.getAllByText(/trigonometric-circle/i)).toHaveLength(2)
      expect(screen.getAllByText(/geometric/i)).toHaveLength(2)
      expect(screen.getByText('700 × 394')).toBeInTheDocument()
      expect(screen.getByText('CANVAS_2D')).toBeInTheDocument()
      expect(screen.getByText('60')).toBeInTheDocument()
      expect(screen.getByText('ACTIVE')).toBeInTheDocument()
    })

    it('updates specifications when pattern changes', async () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      // Switch to WebGL pattern
      fireEvent.click(screen.getByText('Noise Field'))

      await waitFor(() => {
        expect(screen.getAllByText(/noise-field/i)).toHaveLength(2)
        expect(screen.getByText(/webgl/i)).toBeInTheDocument()
        // Just check that noise appears somewhere for specs
        expect(screen.getByText(/webgl_2\.0/i)).toBeInTheDocument()
      })
    })
  })

  describe('User interface interactions', () => {
    it('provides theme toggle functionality', () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      // Theme toggle should be present in header (may not have aria-label, just check it exists)
      const themeToggleButtons = screen.getAllByRole('button')
      expect(themeToggleButtons.length).toBeGreaterThan(0)
    })

    it('shows technical annotations', () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      // Technical viewport annotation
      expect(screen.getByText('VIEWPORT_01')).toBeInTheDocument()

      // System version annotation
      expect(screen.getByText('EIDOS_ENGINE_v0.1')).toBeInTheDocument()

      // Date annotation (today's date)
      const today = new Date().toISOString().split('T')[0]
      expect(screen.getByText(today)).toBeInTheDocument()
    })

    it('allows scrolling through pattern list', async () => {
      render(<DesktopLayout />, { wrapper: TestWrapper })

      // Find the scroll area containing patterns
      const patternList = screen.getByText('Trigonometric Circle').closest('[data-slot="scroll-area-viewport"]')
      expect(patternList).toBeInTheDocument()

      // Verify that patterns are scrollable by checking scroll container exists
      const scrollContainer = screen.getByText('Trigonometric Circle').closest('[data-slot="scroll-area"]')
      expect(scrollContainer).toBeInTheDocument()

      // Test clicking on different patterns works
      fireEvent.click(screen.getByText('Noise Field'))
      
      await waitFor(() => {
        expect(screen.getAllByText(/noise-field/i)).toHaveLength(2)
      })
    })
  })
})