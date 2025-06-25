/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen } from '@testing-library/react'
import { render } from '@/test-utils/test-providers'
import userEvent from '@testing-library/user-event'
import DesktopLayout from '../desktop-layout'

// AIDEV-NOTE: Behavioral tests for desktop educational overlay integration per G-8
// Focus on user behavior: can user access educational content in desktop layout?

// Mock the pattern generators to ensure cellular automaton is available
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
  useEducationalContent: () => ({
    content: {
    title: 'Test Educational Content',
    layers: {
      intuitive: {
        title: 'Intuitive Level',
        content: 'This is intuitive content for testing'
      },
      conceptual: {
        title: 'Conceptual Level', 
        content: 'This is conceptual content for testing'
      },
      technical: {
        title: 'Technical Level',
        content: 'This is technical content for testing'
      }
    }
    },
    isLoading: false,
    error: null
  })
}))

// Mock the preset manager hook
jest.mock('@/lib/hooks/use-preset-manager', () => ({
  usePresetManager: () => ({
    presets: [],
    activePresetId: null,
    loadPreset: jest.fn(),
    savePreset: jest.fn(),
    error: null,
    clearError: jest.fn(),
    isLoading: false
  })
}))

describe('Desktop Layout - Educational Overlay Integration', () => {
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
    render(<DesktopLayout />)

    // User should see the "LET'S LEARN!" button for cellular automaton
    expect(screen.getByRole('button', { name: /let's learn/i })).toBeInTheDocument()
    
    // Should not see the default VIEWPORT_01 label
    expect(screen.queryByText('VIEWPORT_01')).not.toBeInTheDocument()
  })

  it('shows VIEWPORT_01 label when non-educational pattern is selected', async () => {
    const user = userEvent.setup()
    render(<DesktopLayout />)

    // Find and click on a different pattern (test-pattern)
    const patternButtons = screen.getAllByRole('button')
    const testPatternButton = patternButtons.find(button => 
      button.textContent?.includes('Test Pattern')
    )
    
    if (testPatternButton) {
      await user.click(testPatternButton)
      
      // User should see VIEWPORT_01 label instead of educational button
      expect(screen.getByText('VIEWPORT_01')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /let's learn/i })).not.toBeInTheDocument()
    }
  })

  it('allows user to open educational overlay from desktop layout', async () => {
    const user = userEvent.setup()
    render(<DesktopLayout />)

    // User clicks the educational button
    const learnButton = screen.getByRole('button', { name: /let's learn/i })
    await user.click(learnButton)

    // User should see the educational overlay content
    expect(screen.getByText('Test Educational Content')).toBeInTheDocument()
    expect(screen.getByText('Intuitive Level')).toBeInTheDocument()
    expect(screen.getByText('This is intuitive content for testing')).toBeInTheDocument()
  })

  it('allows user to close educational overlay from desktop layout', async () => {
    const user = userEvent.setup()
    render(<DesktopLayout />)

    // User opens the educational overlay
    const learnButton = screen.getByRole('button', { name: /let's learn/i })
    await user.click(learnButton)

    // Verify overlay is open
    expect(screen.getByText('Test Educational Content')).toBeInTheDocument()

    // User closes the overlay
    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)

    // Educational content should no longer be visible
    expect(screen.queryByText('Test Educational Content')).not.toBeInTheDocument()
  })

  it('shows hide learning button when overlay is open', async () => {
    const user = userEvent.setup()
    render(<DesktopLayout />)

    // User opens the educational overlay
    const learnButton = screen.getByRole('button', { name: /let's learn/i })
    await user.click(learnButton)

    // Button text should change to "HIDE LEARNING"
    expect(screen.getByRole('button', { name: /hide learning/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /let's learn/i })).not.toBeInTheDocument()
  })

  it('toggles educational overlay when clicking learn/hide button', async () => {
    const user = userEvent.setup()
    render(<DesktopLayout />)

    // User clicks learn button
    const learnButton = screen.getByRole('button', { name: /let's learn/i })
    await user.click(learnButton)

    // Content should be visible
    expect(screen.getByText('Test Educational Content')).toBeInTheDocument()

    // User clicks hide button
    const hideButton = screen.getByRole('button', { name: /hide learning/i })
    await user.click(hideButton)

    // Content should be hidden
    expect(screen.queryByText('Test Educational Content')).not.toBeInTheDocument()

    // Button should be back to "LET'S LEARN!"
    expect(screen.getByRole('button', { name: /let's learn/i })).toBeInTheDocument()
  })

  it('uses accordion overlay type for desktop', async () => {
    const user = userEvent.setup()
    render(<DesktopLayout />)

    // User opens educational overlay
    const learnButton = screen.getByRole('button', { name: /let's learn/i })
    await user.click(learnButton)

    // Should see horizontal tab navigation (accordion style)
    expect(screen.getByRole('button', { name: /intuitive/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /conceptual/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /technical/i })).toBeInTheDocument()

    // Should be able to switch between levels
    await user.click(screen.getByRole('button', { name: /conceptual/i }))
    expect(screen.getByText('Conceptual Level')).toBeInTheDocument()
    expect(screen.getByText('This is conceptual content for testing')).toBeInTheDocument()
  })

  it('positions educational overlay below pattern visualization', async () => {
    const user = userEvent.setup()
    render(<DesktopLayout />)

    // User opens educational overlay
    const learnButton = screen.getByRole('button', { name: /let's learn/i })
    await user.click(learnButton)

    // Pattern should still be visible above the educational content
    expect(screen.getByTestId('cellular-automaton-pattern')).toBeInTheDocument()
    expect(screen.getByText('Test Educational Content')).toBeInTheDocument()
    
    // Both should be visible simultaneously (non-modal layout)
    const pattern = screen.getByTestId('cellular-automaton-pattern')
    const education = screen.getByText('Test Educational Content')
    expect(pattern).toBeInTheDocument()
    expect(education).toBeInTheDocument()
  })
})