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

// Mock the educational content
jest.mock('@/lib/educational-content-parser', () => ({
  cellularAutomataContent: {
    title: 'Mobile Educational Content',
    layers: {
      intuitive: {
        title: 'Intuitive Mobile',
        content: 'Mobile intuitive content for testing'
      },
      conceptual: {
        title: 'Conceptual Mobile',
        content: 'Mobile conceptual content for testing'
      },
      technical: {
        title: 'Technical Mobile',
        content: 'Mobile technical content for testing'
      }
    }
  }
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
  return function MockMobileHeader({ title, onMenuToggle }: any) {
    return (
      <div data-testid="mobile-header">
        <span>{title}</span>
        <button onClick={onMenuToggle}>Menu</button>
      </div>
    )
  }
})

jest.mock('../pattern-dropdown-selector', () => {
  return function MockPatternDropdownSelector({ selectedId, onSelect, className }: any) {
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
  return function MockProgressiveDisclosurePanel() {
    return <div data-testid="progressive-disclosure-panel">Controls Panel</div>
  }
})

describe('Mobile Layout - Educational Overlay Integration', () => {
  beforeEach(() => {
    // Mock localStorage for testing
    const localStorageMock = {
      getItem: jest.fn(),
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

  it('shows educational button when cellular automaton pattern is selected', () => {
    render(<MobileLayoutWrapper />)

    // User should see the compact "LEARN" button for cellular automaton
    expect(screen.getByRole('button', { name: /learn/i })).toBeInTheDocument()
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
    const learnButton = screen.getByRole('button', { name: /learn/i })
    await user.click(learnButton)

    // User should see the educational overlay content
    expect(screen.getByText('Mobile Educational Content')).toBeInTheDocument()
    expect(screen.getByText('Intuitive Mobile')).toBeInTheDocument()
  })

  it('shows hide button when overlay is open', async () => {
    const user = userEvent.setup()
    render(<MobileLayoutWrapper />)

    // User opens the educational overlay
    const learnButton = screen.getByRole('button', { name: /^🎓 learn$/i })
    await user.click(learnButton)

    // Button text should change to "HIDE"
    expect(screen.getByRole('button', { name: /hide/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^🎓 learn$/i })).not.toBeInTheDocument()
  })

  it('uses sidebar overlay type for mobile', async () => {
    const user = userEvent.setup()
    render(<MobileLayoutWrapper />)

    // User opens educational overlay
    const learnButton = screen.getByRole('button', { name: /learn/i })
    await user.click(learnButton)

    // Should see vertical level navigation with icons (sidebar style)
    expect(screen.getByText('🌱')).toBeInTheDocument() // Intuitive icon
    expect(screen.getByText('🧠')).toBeInTheDocument() // Conceptual icon
    expect(screen.getByText('⚙️')).toBeInTheDocument() // Technical icon

    // Should be able to switch between levels
    await user.click(screen.getByRole('button', { name: /conceptual/i }))
    expect(screen.getByText('Conceptual Mobile')).toBeInTheDocument()
  })

  it('allows user to close sidebar by clicking close button', async () => {
    const user = userEvent.setup()
    render(<MobileLayoutWrapper />)

    // User opens educational overlay
    const learnButton = screen.getByRole('button', { name: /learn/i })
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
    const learnButton = screen.getByRole('button', { name: /learn/i })
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
    const learnButton = screen.getByRole('button', { name: /learn/i })

    // Both should be present in the UI
    expect(patternDropdown).toBeInTheDocument()
    expect(learnButton).toBeInTheDocument()

    // Pattern dropdown should have flex-1 class (taking remaining space)
    expect(patternDropdown).toHaveClass('flex-1')
  })

  it('maintains pattern visualization while sidebar is open', async () => {
    const user = userEvent.setup()
    render(<MobileLayoutWrapper />)

    // User opens educational overlay
    const learnButton = screen.getByRole('button', { name: /learn/i })
    await user.click(learnButton)

    // Both pattern and educational content should be visible
    expect(screen.getByTestId('cellular-automaton-pattern')).toBeInTheDocument()
    expect(screen.getByText('Mobile Educational Content')).toBeInTheDocument()
  })

  it('collapses advanced controls when switching to cellular automaton', async () => {
    const user = userEvent.setup()
    render(<MobileLayoutWrapper initialPatternId="test-pattern" />)

    // Switch to cellular automaton pattern
    const patternSelect = screen.getByTestId('pattern-select')
    await user.selectOptions(patternSelect, 'cellular-automaton')

    // Should see the educational button appear
    expect(screen.getByRole('button', { name: /learn/i })).toBeInTheDocument()
    
    // Progressive disclosure panel should still be present but collapsed
    expect(screen.getByTestId('progressive-disclosure-panel')).toBeInTheDocument()
  })

  it('handles rapid toggle of educational overlay', async () => {
    const user = userEvent.setup()
    render(<MobileLayoutWrapper />)

    const learnButton = screen.getByRole('button', { name: /learn/i })

    // User rapidly toggles the overlay
    await user.click(learnButton)
    expect(screen.getByText('Mobile Educational Content')).toBeInTheDocument()

    const hideButton = screen.getByRole('button', { name: /hide/i })
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