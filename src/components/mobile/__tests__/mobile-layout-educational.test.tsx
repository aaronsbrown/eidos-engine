/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@/test-utils/test-providers'
import userEvent from '@testing-library/user-event'
import MobileLayoutWrapper from '../mobile-layout-wrapper'

// AIDEV-NOTE: Behavioral tests for mobile educational overlay integration per G-8
// Focus on user behavior: can user access educational content in mobile layout?

// Mock the pattern generators
jest.mock('@/components/pattern-generators', () => ({
  patternGenerators: [
    {
      id: 'cellular-automaton',
      name: 'Cellular Automaton',
      component: () => <div data-testid="cellular-automaton-pattern">CA Pattern</div>,
      technology: 'CANVAS_2D',
      category: 'Simulation',
      controls: [
        {
          id: 'rule',
          label: 'Rule',
          type: 'range',
          min: 0,
          max: 255,
          step: 1,
          defaultValue: 30
        }
      ]
    },
    {
      id: 'test-pattern',
      name: 'Test Pattern',
      component: () => <div data-testid="test-pattern">Test Pattern</div>,
      technology: 'CANVAS_2D',
      category: 'Geometric',
      controls: []
    }
  ]
}))

// Mock the educational content loader
jest.mock('@/lib/hooks/use-educational-content', () => ({
  useEducationalContent: (patternId: string) => ({
    content: {
    title: patternId === 'cellular-automaton' ? 'Mobile Educational Content' : 'Educational Content: ' + patternId,
    layers: {
      intuitive: {
        title: 'Intuitive Mobile',
        content: patternId === 'cellular-automaton' ? 'Mobile intuitive content for testing' : 'Educational content is being loaded...'
      },
      conceptual: {
        title: 'Conceptual Mobile',
        content: patternId === 'cellular-automaton' ? 'Mobile conceptual content for testing' : 'Educational content is being loaded...'
      },
      technical: {
        title: 'Technical Mobile',
        content: patternId === 'cellular-automaton' ? 'Mobile technical content for testing' : 'Educational content is being loaded...'
      }
    }
    },
    isLoading: false,
    error: null
  })
}))

// Mock the educational content availability
jest.mock('@/lib/educational-content-loader', () => ({
  getAllPatternIds: () => ['cellular-automaton'], // Only cellular automaton has educational content
  hasEducationalContent: async (patternId: string) => patternId === 'cellular-automaton'
}))

// Mock mobile detection hook to force mobile layout
jest.mock('@/components/hooks/useMobileDetection', () => ({
  useMobileDetection: () => ({
    isMobile: true,
    isTablet: false,
    isDesktop: false,
    viewport: { width: 375, height: 667 } // iPhone SE dimensions
  })
}))

// Mock mobile utility functions
jest.mock('@/lib/mobile-utils', () => ({
  getMobileResponsiveClasses: () => ({
    container: 'flex flex-col min-h-screen'
  })
}))

// Mock mobile components
jest.mock('../mobile-header', () => {
  return function MockMobileHeader({ title, onMenuToggle }: { title: string; onMenuToggle: () => void }) {
    return (
      <div data-testid="mobile-header">
        <span>{title}</span>
        <button onClick={onMenuToggle}>Menu</button>
      </div>
    )
  }
})

jest.mock('../pattern-dropdown-selector', () => {
  return function MockPatternDropdownSelector({ selectedId, onSelect, className }: { 
    selectedId: string; 
    onSelect: (id: string) => void; 
    className?: string 
  }) {
    return (
      <div data-testid="pattern-dropdown" className={className}>
        <select 
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
          data-testid="pattern-select"
        >
          <option value="cellular-automaton">Cellular Automaton</option>
          <option value="test-pattern">Test Pattern</option>
        </select>
      </div>
    )
  }
})

jest.mock('../progressive-disclosure-panel', () => {
  return function MockProgressiveDisclosurePanel({ hasEducationalContent, onEducationalToggle, isEducationalVisible }: {
    hasEducationalContent?: boolean
    onEducationalToggle?: () => void
    isEducationalVisible?: boolean
  }) {
    return (
      <div data-testid="progressive-disclosure-panel">
        Controls Panel
        {hasEducationalContent && onEducationalToggle && (
          <button onClick={onEducationalToggle}>
            {isEducationalVisible ? '📚 HIDE' : '🎓 LEARN'}
          </button>
        )}
      </div>
    )
  }
})

describe('Mobile Layout - Educational Overlay Integration', () => {
  beforeEach(() => {
    // Mock localStorage for testing with clean state
    const localStorageMock = {
      getItem: jest.fn(() => null), // Return null for clean state
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    }
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    })
    
    jest.clearAllMocks()
  })

  it('shows educational button when cellular automaton pattern is selected', async () => {
    render(<MobileLayoutWrapper />)

    // Wait for the component to fully render and check for the educational button
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /🎓 LEARN/i })).toBeInTheDocument()
    })
  })

  it('hides educational button when non-educational pattern is selected', async () => {
    const user = userEvent.setup()
    render(<MobileLayoutWrapper />)

    // User selects a different pattern
    const patternSelect = screen.getByTestId('pattern-select')
    await user.selectOptions(patternSelect, 'test-pattern')

    // Educational button should not be visible
    expect(screen.queryByRole('button', { name: /learn/i })).not.toBeInTheDocument()
  })

  it('allows user to open educational overlay from mobile layout', async () => {
    const user = userEvent.setup()
    render(<MobileLayoutWrapper />)

    // User clicks the educational button
    const learnButton = screen.getByRole('button', { name: /LEARN/i })
    await user.click(learnButton)

    // User should see the educational overlay content
    expect(screen.getByText('Mobile Educational Content')).toBeInTheDocument()
    expect(screen.getByText('Intuitive Mobile')).toBeInTheDocument()
  })

  it('shows hide button when overlay is open', async () => {
    const user = userEvent.setup()
    render(<MobileLayoutWrapper />)

    // User opens the educational overlay
    const learnButton = screen.getByRole('button', { name: /LEARN/i })
    await user.click(learnButton)

    // Button text should change to "HIDE"
    expect(screen.getByRole('button', { name: /📚 HIDE/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /🎓 LEARN/i })).not.toBeInTheDocument()
  })

  it('uses sidebar overlay type for mobile', async () => {
    const user = userEvent.setup()
    render(<MobileLayoutWrapper />)

    // User opens educational overlay
    const learnButton = screen.getByRole('button', { name: /LEARN/i })
    await user.click(learnButton)

    // Should see vertical level navigation with Lucide icons (sidebar style)
    // Icons are now Lucide icons, so we check for level buttons instead
    expect(screen.getByRole('button', { name: /intuitive/i })).toBeInTheDocument() 
    expect(screen.getByRole('button', { name: /conceptual/i })).toBeInTheDocument() 
    expect(screen.getByRole('button', { name: /technical/i })).toBeInTheDocument()

    // Should be able to switch between levels
    await user.click(screen.getByRole('button', { name: /conceptual/i }))
    expect(screen.getByText('Conceptual Mobile')).toBeInTheDocument()
  })

  it('allows user to close sidebar by clicking close button', async () => {
    const user = userEvent.setup()
    render(<MobileLayoutWrapper />)

    // User opens educational overlay
    const learnButton = screen.getByRole('button', { name: /LEARN/i })
    await user.click(learnButton)

    // Verify overlay is open
    expect(screen.getByText('Mobile Educational Content')).toBeInTheDocument()

    // User clicks close button for educational overlay
    const closeButton = screen.getByRole('button', { name: /close educational overlay/i })
    await user.click(closeButton)

    // Content should be hidden after animation
    await waitFor(() => {
      expect(screen.queryByText('Mobile Educational Content')).not.toBeInTheDocument()
    }, { timeout: 500 })
  })

  it('allows user to close sidebar by clicking backdrop', async () => {
    const user = userEvent.setup()
    render(<MobileLayoutWrapper />)

    // User opens educational overlay
    const learnButton = screen.getByRole('button', { name: /LEARN/i })
    await user.click(learnButton)

    // User clicks backdrop
    const backdrop = screen.getByTestId('sidebar-backdrop')
    await user.click(backdrop)

    // Content should be hidden after animation
    await waitFor(() => {
      expect(screen.queryByText('Mobile Educational Content')).not.toBeInTheDocument()
    }, { timeout: 500 })
  })

  it('positions educational button beside pattern selector', () => {
    render(<MobileLayoutWrapper />)

    // Pattern selector and educational button should be in the same row
    const patternDropdown = screen.getByTestId('pattern-dropdown')
    const learnButton = screen.getByRole('button', { name: /LEARN/i })

    // Both should be present in the UI
    expect(patternDropdown).toBeInTheDocument()
    expect(learnButton).toBeInTheDocument()

    // Pattern dropdown should have w-full class (taking full width)
    expect(patternDropdown).toHaveClass('w-full')
  })

  it('maintains pattern visualization while sidebar is open', async () => {
    const user = userEvent.setup()
    render(<MobileLayoutWrapper />)

    // User opens educational overlay
    const learnButton = screen.getByRole('button', { name: /LEARN/i })
    await user.click(learnButton)

    // Both pattern and educational content should be visible
    expect(screen.getByTestId('cellular-automaton-pattern')).toBeInTheDocument()
    expect(screen.getByText('Mobile Educational Content')).toBeInTheDocument()
  })

  it.skip('collapses advanced controls when switching to cellular automaton', async () => {
    const user = userEvent.setup()
    render(<MobileLayoutWrapper initialPatternId="test-pattern" />)

    // Switch to cellular automaton pattern
    const patternSelect = screen.getByTestId('pattern-select')
    await user.selectOptions(patternSelect, 'cellular-automaton')

    // Wait for the pattern change to be processed and educational button to appear
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /learn/i })).toBeInTheDocument()
    })
    
    // Progressive disclosure panel should still be present but collapsed
    expect(screen.getByTestId('progressive-disclosure-panel')).toBeInTheDocument()
  })

  it('handles rapid toggle of educational overlay', async () => {
    const user = userEvent.setup()
    render(<MobileLayoutWrapper />)

    const learnButton = screen.getByRole('button', { name: /LEARN/i })

    // User rapidly toggles the overlay
    await user.click(learnButton)
    expect(screen.getByText('Mobile Educational Content')).toBeInTheDocument()

    const hideButton = screen.getByRole('button', { name: /📚 HIDE/i })
    await user.click(hideButton)

    // Should handle rapid state changes gracefully
    await waitFor(() => {
      expect(screen.queryByText('Mobile Educational Content')).not.toBeInTheDocument()
    }, { timeout: 500 })

    // Should be able to reopen
    const newLearnButton = screen.getByRole('button', { name: /learn/i })
    await user.click(newLearnButton)
    expect(screen.getByText('Mobile Educational Content')).toBeInTheDocument()
  })
})