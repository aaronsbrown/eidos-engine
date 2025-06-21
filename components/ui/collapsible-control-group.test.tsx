// AIDEV-NOTE: TDD tests for collapsible control group component - Issue #19
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CollapsibleControlGroup from './collapsible-control-group'
import type { PatternControl } from '@/components/pattern-generators/types'

// Mock the ChevronDownIcon from lucide-react
jest.mock('lucide-react', () => ({
  ChevronDown: ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={className} data-testid="chevron-down-icon" {...props}>
      ChevronDown
    </div>
  ),
}))

describe('CollapsibleControlGroup', () => {
  const mockControls: PatternControl[] = [
    {
      id: 'speed',
      label: 'Animation Speed',
      type: 'range',
      min: 0.1,
      max: 3.0,
      step: 0.1,
      defaultValue: 1.0,
    },
    {
      id: 'enabled',
      label: 'Animation Enabled',
      type: 'checkbox',
      defaultValue: true,
    },
  ]

  const mockOnControlChange = jest.fn()
  const mockControlValues = { speed: 1.5, enabled: true }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders group title correctly', () => {
      render(
        <CollapsibleControlGroup
          title="Animation Settings"
          controls={mockControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
        />
      )

      expect(screen.getByText('Animation Settings')).toBeInTheDocument()
    })

    it('renders chevron icon', () => {
      render(
        <CollapsibleControlGroup
          title="Animation Settings"
          controls={mockControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
        />
      )

      expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument()
    })

    it('renders all controls when expanded by default', () => {
      render(
        <CollapsibleControlGroup
          title="Animation Settings"
          controls={mockControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
        />
      )

      expect(screen.getByLabelText('Animation Speed')).toBeInTheDocument()
      expect(screen.getByLabelText('Animation Enabled')).toBeInTheDocument()
    })

    it('applies correct technical aesthetic classes', () => {
      render(
        <CollapsibleControlGroup
          title="Animation Settings"
          controls={mockControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
        />
      )

      const titleElement = screen.getByText('Animation Settings')
      expect(titleElement).toHaveClass('font-mono', 'text-sm', 'font-semibold')
    })
  })

  describe('Expand/Collapse Functionality', () => {
    it('starts expanded by default', () => {
      render(
        <CollapsibleControlGroup
          title="Animation Settings"
          controls={mockControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
        />
      )

      const controlsContainer = screen.getByRole('region')
      expect(controlsContainer).toBeVisible()
    })

    it('starts collapsed when defaultCollapsed is true', () => {
      render(
        <CollapsibleControlGroup
          title="Animation Settings"
          controls={mockControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
          defaultCollapsed={true}
        />
      )

      const controlsContainer = screen.queryByRole('region')
      expect(controlsContainer).not.toBeInTheDocument()
    })

    it('toggles visibility when title is clicked', async () => {
      const user = userEvent.setup()
      render(
        <CollapsibleControlGroup
          title="Animation Settings"
          controls={mockControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
        />
      )

      const titleButton = screen.getByRole('button', { name: /Animation Settings/i })
      
      // Initially expanded
      expect(screen.getByRole('region')).toBeVisible()

      // Click to collapse
      await user.click(titleButton)
      
      await waitFor(() => {
        expect(screen.queryByRole('region')).not.toBeInTheDocument()
      })

      // Click to expand again
      await user.click(titleButton)
      
      await waitFor(() => {
        expect(screen.getByRole('region')).toBeVisible()
      })
    })

    it('rotates chevron icon when collapsed', async () => {
      const user = userEvent.setup()
      render(
        <CollapsibleControlGroup
          title="Animation Settings"
          controls={mockControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
        />
      )

      const chevron = screen.getByTestId('chevron-down-icon')
      const titleButton = screen.getByRole('button', { name: /Animation Settings/i })

      // Initially expanded - should be rotated (pointing up)
      expect(chevron).toHaveClass('rotate-180')

      // Click to collapse - should not be rotated (pointing down)
      await user.click(titleButton)
      
      await waitFor(() => {
        expect(chevron).not.toHaveClass('rotate-180')
      })
    })
  })

  describe('Keyboard Accessibility', () => {
    it('can be toggled with Enter key', async () => {
      const user = userEvent.setup()
      render(
        <CollapsibleControlGroup
          title="Animation Settings"
          controls={mockControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
        />
      )

      const titleButton = screen.getByRole('button', { name: /Animation Settings/i })
      titleButton.focus()

      // Initially expanded
      expect(screen.getByRole('region')).toBeVisible()

      // Press Enter to collapse
      await user.keyboard('{Enter}')
      
      await waitFor(() => {
        expect(screen.queryByRole('region')).not.toBeInTheDocument()
      })
    })

    it('can be toggled with Space key', async () => {
      const user = userEvent.setup()
      render(
        <CollapsibleControlGroup
          title="Animation Settings"
          controls={mockControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
        />
      )

      const titleButton = screen.getByRole('button', { name: /Animation Settings/i })
      titleButton.focus()

      // Press Space to collapse
      await user.keyboard(' ')
      
      await waitFor(() => {
        expect(screen.queryByRole('region')).not.toBeInTheDocument()
      })
    })

    it('has proper ARIA attributes', () => {
      render(
        <CollapsibleControlGroup
          title="Animation Settings"
          controls={mockControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
        />
      )

      const titleButton = screen.getByRole('button', { name: /Animation Settings/i })
      
      expect(titleButton).toHaveAttribute('aria-expanded', 'true')
      expect(titleButton).toHaveAttribute('aria-controls')
      
      const controlsContainer = screen.getByRole('region')
      expect(controlsContainer).toHaveAttribute('aria-labelledby')
    })

    it('updates aria-expanded when collapsed', async () => {
      const user = userEvent.setup()
      render(
        <CollapsibleControlGroup
          title="Animation Settings"
          controls={mockControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
        />
      )

      const titleButton = screen.getByRole('button', { name: /Animation Settings/i })
      
      // Click to collapse
      await user.click(titleButton)
      
      await waitFor(() => {
        expect(titleButton).toHaveAttribute('aria-expanded', 'false')
      })
    })
  })

  describe('Control Rendering Integration', () => {
    it('renders range controls correctly', () => {
      const rangeControl: PatternControl = {
        id: 'brightness',
        label: 'Brightness',
        type: 'range',
        min: 0.5,
        max: 2.0,
        step: 0.1,
        defaultValue: 1.0,
      }

      render(
        <CollapsibleControlGroup
          title="Visual Settings"
          controls={[rangeControl]}
          controlValues={{ brightness: 1.5 }}
          onControlChange={mockOnControlChange}
        />
      )

      const rangeInput = screen.getByDisplayValue('1.5')
      expect(rangeInput).toHaveAttribute('type', 'range')
      expect(rangeInput).toHaveAttribute('min', '0.5')
      expect(rangeInput).toHaveAttribute('max', '2')
      expect(rangeInput).toHaveAttribute('step', '0.1')
    })

    it('renders checkbox controls correctly', () => {
      const checkboxControl: PatternControl = {
        id: 'enableTrails',
        label: 'Enable Trails',
        type: 'checkbox',
        defaultValue: false,
      }

      render(
        <CollapsibleControlGroup
          title="Visual Settings"
          controls={[checkboxControl]}
          controlValues={{ enableTrails: true }}
          onControlChange={mockOnControlChange}
        />
      )

      const checkbox = screen.getByRole('checkbox', { name: 'Enable Trails' })
      expect(checkbox).toBeChecked()
    })

    it('renders select controls correctly', () => {
      const selectControl: PatternControl = {
        id: 'colorScheme',
        label: 'Color Scheme',
        type: 'select',
        defaultValue: 'classic',
        options: [
          { value: 'classic', label: 'CLASSIC' },
          { value: 'retro', label: 'RETRO' },
        ],
      }

      render(
        <CollapsibleControlGroup
          title="Appearance"
          controls={[selectControl]}
          controlValues={{ colorScheme: 'retro' }}
          onControlChange={mockOnControlChange}
        />
      )

      const selectButton = screen.getByRole('combobox', { name: /color scheme/i })
      expect(selectButton).toHaveTextContent('RETRO')
    })

    it('forwards control change events correctly', async () => {
      const user = userEvent.setup()
      render(
        <CollapsibleControlGroup
          title="Animation Settings"
          controls={mockControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
        />
      )

      const checkbox = screen.getByRole('checkbox', { name: 'Animation Enabled' })
      await user.click(checkbox)

      expect(mockOnControlChange).toHaveBeenCalledWith('enabled', false)
    })
  })

  describe('Animation Behavior', () => {
    it('applies smooth transition classes', () => {
      render(
        <CollapsibleControlGroup
          title="Animation Settings"
          controls={mockControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
        />
      )

      const controlsContainer = screen.getByRole('region')
      expect(controlsContainer.parentElement).toHaveClass('transition-all', 'duration-200', 'ease-in-out')
    })

    it('applies correct overflow classes during transitions', async () => {
      const user = userEvent.setup()
      render(
        <CollapsibleControlGroup
          title="Animation Settings"
          controls={mockControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
        />
      )

      const titleButton = screen.getByRole('button', { name: /Animation Settings/i })
      const controlsWrapper = screen.getByRole('region').parentElement!

      expect(controlsWrapper).toHaveClass('overflow-hidden')

      // Verify smooth height transition
      await user.click(titleButton)
      expect(controlsWrapper).toHaveClass('overflow-hidden')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty controls array', () => {
      render(
        <CollapsibleControlGroup
          title="Empty Group"
          controls={[]}
          controlValues={{}}
          onControlChange={mockOnControlChange}
        />
      )

      expect(screen.getByText('Empty Group')).toBeInTheDocument()
      const controlsContainer = screen.getByRole('region')
      expect(controlsContainer).toBeInTheDocument()
      expect(screen.getByText('No controls available')).toBeInTheDocument()
    })

    it('handles missing control values gracefully', () => {
      render(
        <CollapsibleControlGroup
          title="Animation Settings"
          controls={mockControls}
          controlValues={{}} // Missing values
          onControlChange={mockOnControlChange}
        />
      )

      // Should render without crashing and use default values
      expect(screen.getByLabelText('Animation Speed')).toBeInTheDocument()
      expect(screen.getByLabelText('Animation Enabled')).toBeInTheDocument()
    })

    it('handles long titles gracefully', () => {
      const longTitle = 'Very Long Control Group Title That Might Cause Layout Issues'
      render(
        <CollapsibleControlGroup
          title={longTitle}
          controls={mockControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
        />
      )

      expect(screen.getByText(longTitle)).toBeInTheDocument()
    })
  })
})