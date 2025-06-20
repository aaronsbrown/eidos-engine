// AIDEV-NOTE: TDD implementation per G-5 - Pattern dropdown selector tests written before implementation
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PatternDropdownSelector from './pattern-dropdown-selector'
import { patternGenerators } from '@/components/pattern-generators'

// Mock pattern generators for testing
const mockPatterns = [
  {
    id: 'barcode',
    name: 'Barcode Scanner',
    component: () => <div>Barcode</div>,
    technology: 'CANVAS_2D',
    controls: []
  },
  {
    id: 'frequency',
    name: 'Frequency Spectrum',
    component: () => <div>Frequency</div>,
    technology: 'CANVAS_2D',
    controls: []
  },
  {
    id: 'brownian-motion',
    name: 'Brownian Motion',
    component: () => <div>Brownian</div>,
    technology: 'WEBGL_2.0',
    controls: []
  }
]

describe('PatternDropdownSelector', () => {
  const defaultProps = {
    patterns: mockPatterns,
    selectedId: 'barcode',
    onSelect: jest.fn(),
    searchable: true
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders dropdown selector with selected pattern', () => {
      render(<PatternDropdownSelector {...defaultProps} />)
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      expect(selector).toBeInTheDocument()
      
      // Should display current selection
      expect(screen.getByDisplayValue('Barcode Scanner')).toBeInTheDocument()
    })

    it('has minimum 44px touch target height', () => {
      render(<PatternDropdownSelector {...defaultProps} />)
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      const styles = window.getComputedStyle(selector)
      
      expect(parseInt(styles.minHeight || styles.height)).toBeGreaterThanOrEqual(44)
    })

    it('has proper accessibility attributes', () => {
      render(<PatternDropdownSelector {...defaultProps} />)
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      expect(selector).toHaveAttribute('aria-label', 'Select pattern generator')
      expect(selector).toHaveAttribute('role', 'combobox')
    })

    it('maintains technical aesthetic styling', () => {
      render(<PatternDropdownSelector {...defaultProps} />)
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      expect(selector).toHaveClass('font-mono', 'border', 'border-border')
    })
  })

  describe('Pattern Selection', () => {
    it('opens dropdown when clicked', async () => {
      const user = userEvent.setup()
      render(<PatternDropdownSelector {...defaultProps} />)
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      await user.click(selector)
      
      // Should show all pattern options
      expect(screen.getByText('Frequency Spectrum')).toBeInTheDocument()
      expect(screen.getByText('Brownian Motion')).toBeInTheDocument()
    })

    it('calls onSelect when pattern is chosen', async () => {
      const user = userEvent.setup()
      render(<PatternDropdownSelector {...defaultProps} />)
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      await user.click(selector)
      
      const frequencyOption = screen.getByText('Frequency Spectrum')
      await user.click(frequencyOption)
      
      expect(defaultProps.onSelect).toHaveBeenCalledWith('frequency')
    })

    it('updates displayed value when new pattern is selected', async () => {
      const user = userEvent.setup()
      const { rerender } = render(<PatternDropdownSelector {...defaultProps} />)
      
      // Change selected pattern
      rerender(
        <PatternDropdownSelector 
          {...defaultProps} 
          selectedId="frequency"
        />
      )
      
      expect(screen.getByDisplayValue('Frequency Spectrum')).toBeInTheDocument()
    })

    it('shows technology indicator for each pattern', async () => {
      const user = userEvent.setup()
      render(<PatternDropdownSelector {...defaultProps} />)
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      await user.click(selector)
      
      // Should show technology types
      expect(screen.getByText('CANVAS_2D')).toBeInTheDocument()
      expect(screen.getByText('WEBGL_2.0')).toBeInTheDocument()
    })
  })

  describe('Search Functionality', () => {
    it('renders search input when searchable is true', async () => {
      const user = userEvent.setup()
      render(<PatternDropdownSelector {...defaultProps} searchable={true} />)
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      await user.click(selector)
      
      const searchInput = screen.getByPlaceholderText('Search patterns...')
      expect(searchInput).toBeInTheDocument()
    })

    it('filters patterns based on search input', async () => {
      const user = userEvent.setup()
      render(<PatternDropdownSelector {...defaultProps} searchable={true} />)
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      await user.click(selector)
      
      const searchInput = screen.getByPlaceholderText('Search patterns...')
      await user.type(searchInput, 'brown')
      
      // Should only show matching patterns
      expect(screen.getByText('Brownian Motion')).toBeInTheDocument()
      expect(screen.queryByText('Barcode Scanner')).not.toBeInTheDocument()
      expect(screen.queryByText('Frequency Spectrum')).not.toBeInTheDocument()
    })

    it('shows no results message when search has no matches', async () => {
      const user = userEvent.setup()
      render(<PatternDropdownSelector {...defaultProps} searchable={true} />)
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      await user.click(selector)
      
      const searchInput = screen.getByPlaceholderText('Search patterns...')
      await user.type(searchInput, 'nonexistent')
      
      expect(screen.getByText('No patterns found')).toBeInTheDocument()
    })

    it('does not render search when searchable is false', async () => {
      const user = userEvent.setup()
      render(<PatternDropdownSelector {...defaultProps} searchable={false} />)
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      await user.click(selector)
      
      expect(screen.queryByPlaceholderText('Search patterns...')).not.toBeInTheDocument()
    })

    it('clears search when dropdown is closed', async () => {
      const user = userEvent.setup()
      render(<PatternDropdownSelector {...defaultProps} searchable={true} />)
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      await user.click(selector)
      
      const searchInput = screen.getByPlaceholderText('Search patterns...')
      await user.type(searchInput, 'brown')
      
      // Close dropdown
      fireEvent.keyDown(selector, { key: 'Escape' })
      
      // Reopen dropdown
      await user.click(selector)
      
      const newSearchInput = screen.getByPlaceholderText('Search patterns...')
      expect(newSearchInput).toHaveValue('')
    })
  })

  describe('Keyboard Navigation', () => {
    it('opens dropdown with Enter key', () => {
      render(<PatternDropdownSelector {...defaultProps} />)
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      selector.focus()
      fireEvent.keyDown(selector, { key: 'Enter' })
      
      expect(screen.getByText('Frequency Spectrum')).toBeInTheDocument()
    })

    it('opens dropdown with Space key', () => {
      render(<PatternDropdownSelector {...defaultProps} />)
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      selector.focus()
      fireEvent.keyDown(selector, { key: ' ' })
      
      expect(screen.getByText('Frequency Spectrum')).toBeInTheDocument()
    })

    it('closes dropdown with Escape key', async () => {
      const user = userEvent.setup()
      render(<PatternDropdownSelector {...defaultProps} />)
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      await user.click(selector)
      
      // Should be open
      expect(screen.getByText('Frequency Spectrum')).toBeInTheDocument()
      
      fireEvent.keyDown(selector, { key: 'Escape' })
      
      await waitFor(() => {
        expect(screen.queryByText('Frequency Spectrum')).not.toBeInTheDocument()
      })
    })

    it('navigates options with arrow keys', async () => {
      render(<PatternDropdownSelector {...defaultProps} />)
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      selector.focus()
      fireEvent.keyDown(selector, { key: 'Enter' })
      
      // Navigate down
      fireEvent.keyDown(selector, { key: 'ArrowDown' })
      fireEvent.keyDown(selector, { key: 'ArrowDown' })
      
      // Select with Enter
      fireEvent.keyDown(selector, { key: 'Enter' })
      
      expect(defaultProps.onSelect).toHaveBeenCalledWith('frequency')
    })
  })

  describe('Touch Interactions', () => {
    it('handles touch events properly', () => {
      render(<PatternDropdownSelector {...defaultProps} />)
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      
      // Touch start and end should open dropdown
      fireEvent.touchStart(selector)
      fireEvent.touchEnd(selector)
      
      expect(screen.getByText('Frequency Spectrum')).toBeInTheDocument()
    })

    it('prevents scroll when dropdown is open', async () => {
      const user = userEvent.setup()
      render(<PatternDropdownSelector {...defaultProps} />)
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      await user.click(selector)
      
      const dropdown = screen.getByTestId('dropdown-panel')
      expect(dropdown).toHaveAttribute('data-prevent-scroll', 'true')
    })
  })

  describe('Visual Feedback', () => {
    it('shows loading state when patterns are being loaded', () => {
      render(
        <PatternDropdownSelector 
          {...defaultProps} 
          patterns={[]}
          loading={true}
        />
      )
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      expect(selector).toHaveTextContent('Loading patterns...')
    })

    it('shows disabled state when no patterns available', () => {
      render(
        <PatternDropdownSelector 
          {...defaultProps} 
          patterns={[]}
          loading={false}
        />
      )
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      expect(selector).toBeDisabled()
      expect(selector).toHaveTextContent('No patterns available')
    })

    it('highlights selected option in dropdown', async () => {
      const user = userEvent.setup()
      render(<PatternDropdownSelector {...defaultProps} />)
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      await user.click(selector)
      
      const selectedOption = screen.getByText('Barcode Scanner')
      expect(selectedOption.closest('[data-selected="true"]')).toBeInTheDocument()
    })

    it('shows hover states on options', async () => {
      const user = userEvent.setup()
      render(<PatternDropdownSelector {...defaultProps} />)
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      await user.click(selector)
      
      const option = screen.getByText('Frequency Spectrum')
      await user.hover(option)
      
      expect(option).toHaveClass('hover:bg-muted')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty pattern list gracefully', () => {
      render(<PatternDropdownSelector {...defaultProps} patterns={[]} />)
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      expect(selector).toBeDisabled()
    })

    it('handles invalid selectedId gracefully', () => {
      render(
        <PatternDropdownSelector 
          {...defaultProps} 
          selectedId="nonexistent"
        />
      )
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      expect(selector).toHaveTextContent('Select pattern...')
    })

    it('handles very long pattern names', () => {
      const longNamePatterns = [{
        ...mockPatterns[0],
        name: 'Very Long Pattern Name That Should Be Truncated Properly'
      }]
      
      render(
        <PatternDropdownSelector 
          {...defaultProps} 
          patterns={longNamePatterns}
          selectedId="barcode"
        />
      )
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      expect(selector).toHaveClass('truncate')
    })
  })

  describe('Performance', () => {
    it('virtualizes long pattern lists efficiently', async () => {
      // Create many patterns
      const manyPatterns = Array.from({ length: 100 }, (_, i) => ({
        id: `pattern-${i}`,
        name: `Pattern ${i}`,
        component: () => <div>Pattern {i}</div>,
        technology: 'CANVAS_2D',
        controls: []
      }))
      
      const user = userEvent.setup()
      render(
        <PatternDropdownSelector 
          {...defaultProps} 
          patterns={manyPatterns}
        />
      )
      
      const selector = screen.getByTestId('pattern-dropdown-selector')
      await user.click(selector)
      
      // Should only render visible items
      const visibleItems = screen.getAllByRole('option')
      expect(visibleItems.length).toBeLessThan(100) // Should be virtualized
    })
  })
})