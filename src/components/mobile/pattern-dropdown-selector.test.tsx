// AIDEV-NOTE: Behavioral tests per G-8 - focus on user actions, not implementation details
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PatternDropdownSelector from './pattern-dropdown-selector'

// Mock pattern generators for testing
const mockPatterns = [
  {
    id: 'barcode',
    name: 'Barcode Scanner',
    component: () => <div>Barcode</div>,
    technology: 'CANVAS_2D' as const,
    category: 'Data Visualization' as const,
    controls: []
  },
  {
    id: 'frequency',
    name: 'Frequency Spectrum',
    component: () => <div>Frequency</div>,
    technology: 'CANVAS_2D' as const,
    category: 'Data Visualization' as const,
    controls: []
  },
  {
    id: 'brownian-motion',
    name: 'Brownian Motion',
    component: () => <div>Brownian</div>,
    technology: 'WEBGL_2.0' as const,
    category: 'Noise' as const,
    controls: []
  }
]

describe('PatternDropdownSelector - User Behavior', () => {
  const defaultProps = {
    patterns: mockPatterns,
    selectedId: 'barcode',
    onSelect: jest.fn(),
    searchable: true
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('User can see current selection', () => {
    it('shows the currently selected pattern name', () => {
      render(<PatternDropdownSelector {...defaultProps} />)
      
      // User should see which pattern is currently selected
      expect(screen.getByText('Barcode Scanner')).toBeInTheDocument()
    })

    it('updates display when selection changes', () => {
      const { rerender } = render(<PatternDropdownSelector {...defaultProps} />)
      
      // Initially shows first pattern
      expect(screen.getByText('Barcode Scanner')).toBeInTheDocument()
      
      // When selection changes, user sees new pattern
      rerender(<PatternDropdownSelector {...defaultProps} selectedId="frequency" />)
      expect(screen.getByText('Frequency Spectrum')).toBeInTheDocument()
    })
  })

  describe('User can change pattern selection', () => {
    it('allows user to open dropdown and select different pattern', async () => {
      const user = userEvent.setup()
      render(<PatternDropdownSelector {...defaultProps} />)
      
      // User clicks to open dropdown
      const dropdown = screen.getByRole('combobox')
      await user.click(dropdown)
      
      // User can see patterns in all expanded categories by default
      expect(screen.getByText('Frequency Spectrum')).toBeInTheDocument() // Same category as selected
      expect(screen.getByText('Brownian Motion')).toBeInTheDocument() // Different category, also visible
      
      // Category headers should be visible
      const dataVizHeader = screen.getByText(/data visualization/i)
      const noiseHeader = screen.getByText(/noise/i)
      expect(dataVizHeader).toBeInTheDocument()
      expect(noiseHeader).toBeInTheDocument()
      
      // User selects a different pattern
      await user.click(screen.getByText('Frequency Spectrum'))
      
      // Selection callback is triggered
      expect(defaultProps.onSelect).toHaveBeenCalledWith('frequency')
    })

    it('supports keyboard navigation', async () => {
      // Mock scrollIntoView for testing
      Element.prototype.scrollIntoView = jest.fn()
      
      render(<PatternDropdownSelector {...defaultProps} />)
      
      const dropdown = screen.getByRole('combobox')
      dropdown.focus()
      
      // User opens with keyboard
      fireEvent.keyDown(dropdown, { key: 'Enter' })
      
      // User navigates with arrows and selects
      fireEvent.keyDown(dropdown, { key: 'ArrowDown' })
      fireEvent.keyDown(dropdown, { key: 'Enter' })
      
      expect(defaultProps.onSelect).toHaveBeenCalled()
    })
  })

  describe('User can search patterns', () => {
    it('allows user to filter patterns by typing', async () => {
      const user = userEvent.setup()
      render(<PatternDropdownSelector {...defaultProps} searchable={true} />)
      
      // User opens dropdown
      const dropdown = screen.getByRole('combobox')
      await user.click(dropdown)
      
      // User types in search
      const searchInput = screen.getByPlaceholderText('Search patterns...')
      await user.type(searchInput, 'brown')
      
      // User sees filtered results in the dropdown options
      expect(screen.getByText('Brownian Motion')).toBeInTheDocument()
      
      // Barcode Scanner should not appear in the filtered dropdown options
      // (Note: it may still appear as the selected value in the button, which is correct behavior)
      const dropdownOptions = screen.getByRole('listbox')
      expect(dropdownOptions).not.toHaveTextContent('Barcode Scanner')
    })

    it('shows contextual category information in search vs grouped view', async () => {
      const user = userEvent.setup()
      render(<PatternDropdownSelector {...defaultProps} searchable={true} />)
      
      // User opens dropdown
      const dropdown = screen.getByRole('combobox')
      await user.click(dropdown)
      
      // In grouped view, category appears in headers but not under individual patterns
      const dataVizHeader = screen.getByText(/data visualization/i)
      expect(dataVizHeader).toBeInTheDocument()
      
      // Frequency Spectrum should appear without category label (it's already grouped under header)
      expect(screen.getByText('Frequency Spectrum')).toBeInTheDocument()
      // Category should NOT appear redundantly under the pattern in grouped view
      const frequencyPattern = screen.getByText('Frequency Spectrum').closest('button')
      expect(frequencyPattern).not.toHaveTextContent('Data Visualization')
      
      // User starts searching
      const searchInput = screen.getByPlaceholderText('Search patterns...')
      await user.type(searchInput, 'freq')
      
      // In search results, category context appears under pattern name (since headers are gone)
      expect(screen.getByText('Frequency Spectrum')).toBeInTheDocument()
      const searchResult = screen.getByText('Frequency Spectrum').closest('button')
      expect(searchResult).toHaveTextContent('Data Visualization') // Category context now appears
      
      // Category headers should be gone in search mode (but category text under pattern should remain)
      // Check that the collapsible category header button is gone
      expect(screen.queryByRole('button', { name: /data visualization category/i })).not.toBeInTheDocument()
    })

    it('shows helpful message when no patterns match search', async () => {
      const user = userEvent.setup()
      render(<PatternDropdownSelector {...defaultProps} searchable={true} />)
      
      const dropdown = screen.getByRole('combobox')
      await user.click(dropdown)
      
      const searchInput = screen.getByPlaceholderText('Search patterns...')
      await user.type(searchInput, 'nonexistent')
      
      expect(screen.getByText('No patterns found')).toBeInTheDocument()
    })
  })

  describe('User receives feedback about pattern technology', () => {
    it('shows technology type for each pattern option', async () => {
      const user = userEvent.setup()
      render(<PatternDropdownSelector {...defaultProps} />)
      
      const dropdown = screen.getByRole('combobox')
      await user.click(dropdown)
      
      // User can see technology for all visible patterns (all categories expanded by default)
      expect(screen.getAllByText('CANVAS_2D')).toHaveLength(2) // Two patterns use CANVAS_2D
      expect(screen.getByText('WEBGL_2.0')).toBeInTheDocument() // Noise category is expanded by default
    })
  })

  describe('User sees appropriate loading and error states', () => {
    it('shows loading state when patterns are being fetched', () => {
      render(<PatternDropdownSelector {...defaultProps} patterns={[]} loading={true} />)
      
      expect(screen.getByText('Loading patterns...')).toBeInTheDocument()
    })

    it('shows disabled state when no patterns available', () => {
      render(<PatternDropdownSelector {...defaultProps} patterns={[]} loading={false} />)
      
      expect(screen.getByText('No patterns available')).toBeInTheDocument()
      // Dropdown should not be interactive
      expect(screen.getByRole('combobox')).toBeDisabled()
    })

    it('handles invalid selected pattern gracefully', () => {
      render(<PatternDropdownSelector {...defaultProps} selectedId="nonexistent" />)
      
      expect(screen.getByText('Select pattern...')).toBeInTheDocument()
    })
  })

  describe('User can close dropdown', () => {
    it('closes dropdown when user clicks outside', async () => {
      const user = userEvent.setup()
      render(<PatternDropdownSelector {...defaultProps} />)
      
      const dropdown = screen.getByRole('combobox')
      await user.click(dropdown)
      
      // Dropdown is open
      expect(screen.getByText('Frequency Spectrum')).toBeInTheDocument()
      
      // User clicks outside
      await user.click(document.body)
      
      // Dropdown closes
      await waitFor(() => {
        expect(screen.queryByText('Frequency Spectrum')).not.toBeInTheDocument()
      })
    })

    it('closes dropdown when user presses Escape', async () => {
      const user = userEvent.setup()
      render(<PatternDropdownSelector {...defaultProps} />)
      
      const dropdown = screen.getByRole('combobox')
      await user.click(dropdown)
      
      // User presses escape
      fireEvent.keyDown(dropdown, { key: 'Escape' })
      
      await waitFor(() => {
        expect(screen.queryByText('Frequency Spectrum')).not.toBeInTheDocument()
      })
    })
  })
})