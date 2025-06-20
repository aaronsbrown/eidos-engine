// AIDEV-NOTE: Accessibility integration tests for collapsible control groups - Issue #19
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CollapsibleControlGroup from './collapsible-control-group'
import ViewportConstrainedPanel from './viewport-constrained-panel'
import type { PatternControl } from '@/components/pattern-generators/types'

// Mock lucide-react icon
jest.mock('lucide-react', () => ({
  ChevronDown: ({ className }: { className?: string }) => (
    <div className={className} data-testid="chevron-icon">⌄</div>
  ),
}))

describe('Accessibility Integration Tests', () => {
  const mockControls: PatternControl[] = [
    {
      id: 'animationSpeed',
      label: 'Animation Speed',
      type: 'range',
      min: 0.1,
      max: 3.0,
      step: 0.1,
      defaultValue: 1.0,
    },
    {
      id: 'animationEnabled',
      label: 'Animation Enabled',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      id: 'colorScheme',
      label: 'Color Scheme',
      type: 'select',
      defaultValue: 'classic',
      options: [
        { value: 'classic', label: 'CLASSIC' },
        { value: 'retro', label: 'RETRO' },
      ],
    },
  ]

  const mockOnControlChange = jest.fn()
  const mockControlValues = {
    animationSpeed: 1.5,
    animationEnabled: true,
    colorScheme: 'classic',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Keyboard Navigation', () => {
    it('allows keyboard navigation through collapsible groups', async () => {
      const user = userEvent.setup()
      render(
        <div>
          <CollapsibleControlGroup
            title="Animation Settings"
            controls={mockControls}
            controlValues={mockControlValues}
            onControlChange={mockOnControlChange}
          />
          <CollapsibleControlGroup
            title="Visual Properties"
            controls={[mockControls[0]]}
            controlValues={mockControlValues}
            onControlChange={mockOnControlChange}
          />
        </div>
      )

      // Should be able to tab to first group header
      await user.tab()
      const firstGroupHeader = screen.getByRole('button', { name: /Animation Settings/i })
      expect(firstGroupHeader).toHaveFocus()

      // Should be able to toggle with Enter
      await user.keyboard('{Enter}')
      
      // The first group should be collapsed (both groups have regions, check specifically)
      const animationRegions = screen.queryAllByRole('region')
      expect(animationRegions).toHaveLength(1) // Only second group should be expanded

      // Should be able to toggle back with Space
      await user.keyboard(' ')
      const allRegions = screen.queryAllByRole('region')
      expect(allRegions).toHaveLength(2) // Both groups should be expanded

      // After expanding, tab should go to controls within the group
      // Tab through the controls in the first group
      await user.tab() // Animation Speed
      await user.tab() // Animation Enabled 
      await user.tab() // Color Scheme
      await user.tab() // Should now be on second group header
      
      const secondGroupHeader = screen.getByRole('button', { name: /Visual Properties/i })
      expect(secondGroupHeader).toHaveFocus()
    })

    it('maintains focus within viewport-constrained panel', async () => {
      const user = userEvent.setup()
      render(
        <ViewportConstrainedPanel>
          <CollapsibleControlGroup
            title="Animation Settings"
            controls={mockControls}
            controlValues={mockControlValues}
            onControlChange={mockOnControlChange}
          />
        </ViewportConstrainedPanel>
      )

      // Should be able to focus the viewport panel
      await user.tab()
      const viewportPanel = screen.getByTestId('viewport-constrained-panel')
      expect(viewportPanel).toHaveFocus()

      // Should be able to navigate to controls
      await user.tab()
      const groupHeader = screen.getByRole('button', { name: /Animation Settings/i })
      expect(groupHeader).toHaveFocus()
    })
  })

  describe('Screen Reader Support', () => {
    it('provides proper ARIA attributes for collapsed/expanded state', async () => {
      const user = userEvent.setup()
      render(
        <CollapsibleControlGroup
          title="Animation Settings"
          controls={mockControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
        />
      )

      const groupHeader = screen.getByRole('button', { name: /Animation Settings/i })
      const controlsRegion = screen.getByRole('region')

      // Initially expanded
      expect(groupHeader).toHaveAttribute('aria-expanded', 'true')
      expect(groupHeader).toHaveAttribute('aria-controls', controlsRegion.id)
      expect(controlsRegion).toHaveAttribute('aria-labelledby', groupHeader.id)

      // After collapsing
      await user.click(groupHeader)
      expect(groupHeader).toHaveAttribute('aria-expanded', 'false')
    })

    it('provides accessible labels for all controls', () => {
      render(
        <CollapsibleControlGroup
          title="Animation Settings"
          controls={mockControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
        />
      )

      // All controls should have proper labels
      expect(screen.getByLabelText('Animation Speed')).toBeInTheDocument()
      expect(screen.getByLabelText('Animation Enabled')).toBeInTheDocument()
      expect(screen.getByLabelText('Color Scheme')).toBeInTheDocument()

      // Range control should be properly labeled by its label element
      const rangeControl = screen.getByDisplayValue('1.5')
      expect(rangeControl).toHaveAttribute('id', 'animationSpeed')
      
      // Label should be associated with the control
      const label = screen.getByLabelText('Animation Speed')
      expect(label).toBe(rangeControl)
    })

    it('provides proper viewport panel accessibility', () => {
      render(
        <ViewportConstrainedPanel>
          <div>Content</div>
        </ViewportConstrainedPanel>
      )

      const panel = screen.getByTestId('viewport-constrained-panel')
      expect(panel).toHaveAttribute('role', 'region')
      expect(panel).toHaveAttribute('aria-label', 'Scrollable control panel')
      expect(panel).toHaveAttribute('tabindex', '0')
    })
  })

  describe('Keyboard Shortcuts', () => {
    it('supports keyboard scrolling in viewport panel', async () => {
      const user = userEvent.setup()
      render(
        <ViewportConstrainedPanel>
          <div style={{ height: '1000px' }}>Tall content</div>
        </ViewportConstrainedPanel>
      )

      const panel = screen.getByTestId('viewport-constrained-panel')
      
      // Focus the panel
      panel.focus()
      expect(panel).toHaveFocus()

      // Test arrow key scrolling
      await user.keyboard('{ArrowDown}')
      
      // The actual scrolling behavior is implemented in the component
      // This test verifies the keyboard event handling is set up
      expect(panel).toHaveFocus() // Should maintain focus
    })

    it('supports Home/End keys for viewport navigation', async () => {
      const user = userEvent.setup()
      render(
        <ViewportConstrainedPanel>
          <div style={{ height: '1000px' }}>Tall content</div>
        </ViewportConstrainedPanel>
      )

      const panel = screen.getByTestId('viewport-constrained-panel')
      panel.focus()

      // Test Home key (scroll to top)
      await user.keyboard('{Home}')
      expect(panel).toHaveFocus()

      // Test End key (scroll to bottom)
      await user.keyboard('{End}')
      expect(panel).toHaveFocus()
    })
  })

  describe('Focus Management', () => {
    it('preserves focus when collapsing/expanding groups', async () => {
      const user = userEvent.setup()
      render(
        <CollapsibleControlGroup
          title="Animation Settings"
          controls={mockControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
        />
      )

      const groupHeader = screen.getByRole('button', { name: /Animation Settings/i })
      
      // Focus the header
      groupHeader.focus()
      expect(groupHeader).toHaveFocus()

      // Collapse the group
      await user.keyboard('{Enter}')
      
      // Header should still have focus
      expect(groupHeader).toHaveFocus()
      expect(groupHeader).toHaveAttribute('aria-expanded', 'false')

      // Expand again
      await user.keyboard(' ')
      
      // Header should still have focus
      expect(groupHeader).toHaveFocus()
      expect(groupHeader).toHaveAttribute('aria-expanded', 'true')
    })

    it('handles complex focus scenarios with multiple groups', async () => {
      const user = userEvent.setup()
      render(
        <ViewportConstrainedPanel>
          <CollapsibleControlGroup
            title="Group 1"
            controls={[mockControls[0]]}
            controlValues={mockControlValues}
            onControlChange={mockOnControlChange}
          />
          <CollapsibleControlGroup
            title="Group 2"
            controls={[mockControls[1]]}
            controlValues={mockControlValues}
            onControlChange={mockOnControlChange}
            defaultCollapsed={true}
          />
          <CollapsibleControlGroup
            title="Group 3"
            controls={[mockControls[2]]}
            controlValues={mockControlValues}
            onControlChange={mockOnControlChange}
          />
        </ViewportConstrainedPanel>
      )

      // Should be able to navigate through all groups
      await user.tab() // Focus viewport panel
      const viewportPanel = screen.getByTestId('viewport-constrained-panel')
      expect(viewportPanel).toHaveFocus()
      
      await user.tab() // Focus first group
      const group1 = screen.getByRole('button', { name: /Group 1/i })
      expect(group1).toHaveFocus()

      // Continue tabbing through controls and other groups
      // The exact tab order depends on which groups are expanded and their controls
      const allButtons = screen.getAllByRole('button')
      const groupButtons = allButtons.filter(btn => 
        btn.getAttribute('aria-controls')?.includes('controls')
      )
      
      // Should have 3 group buttons
      expect(groupButtons).toHaveLength(3)
    })
  })

  describe('High Contrast and Visual Indicators', () => {
    it('provides visual indication of collapsed/expanded state', () => {
      render(
        <CollapsibleControlGroup
          title="Animation Settings"
          controls={mockControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
          defaultCollapsed={true}
        />
      )

      const chevronIcon = screen.getByTestId('chevron-icon')
      // Should NOT have rotation class when collapsed (pointing down)
      expect(chevronIcon).not.toHaveClass('rotate-180')
    })

    it('maintains visual hierarchy with proper headings', () => {
      render(
        <CollapsibleControlGroup
          title="Animation Settings"
          controls={mockControls}
          controlValues={mockControlValues}
          onControlChange={mockOnControlChange}
        />
      )

      // Group title should be properly styled as a heading
      const groupTitle = screen.getByText('Animation Settings')
      expect(groupTitle.tagName).toBe('H3')
      expect(groupTitle).toHaveClass('font-mono', 'text-sm', 'font-semibold')
    })
  })
})