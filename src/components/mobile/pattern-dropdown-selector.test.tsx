// AIDEV-NOTE: Behavioral tests per G-8 - focus on user actions, not implementation details
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PatternDropdownSelector from './pattern-dropdown-selector'

// Mock pattern generators for testing
const mockPatterns = [
  {
    id: 'noise',
    name: 'Noise Field',
    component: () => <div>Noise</div>,
    technology: 'CANVAS_2D' as const,
    category: 'Noise' as const,
    controls: []
  },
  {
    id: 'brownian-motion',
    name: 'Brownian Motion',
    component: () => <div>Brownian</div>,
    technology: 'WEBGL_2.0' as const,
    category: 'Noise' as const,
    controls: []
  },
  {
    id: 'particle-system',
    name: 'Particle System',
    component: () => <div>Particle</div>,
    technology: 'WEBGL_2.0' as const,
    category: 'Simulation' as const,
    controls: []
  }
]

describe('PatternDropdownSelector - User Behavior', () => {
  const defaultProps = {
    patterns: mockPatterns,
    selectedId: 'noise',
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
      expect(screen.getByText('Noise Field')).toBeInTheDocument()
    })

    it('updates display when selection changes', () => {
      const { rerender } = render(<PatternDropdownSelector {...defaultProps} />)
      
      // Initially shows first pattern
      expect(screen.getByText('Noise Field')).toBeInTheDocument()
      
      // When selection changes, user sees new pattern
      rerender(<PatternDropdownSelector {...defaultProps} selectedId="brownian-motion" />)
      expect(screen.getByText('Brownian Motion')).toBeInTheDocument()
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
      expect(screen.getByText('Brownian Motion')).toBeInTheDocument() // Same category as selected
      expect(screen.getByText('Particle System')).toBeInTheDocument() // Different category, also visible
      
      // Category headers should be visible
      const simulationHeader = screen.getByText(/simulation/i)
      const noiseHeader = screen.getAllByText(/noise/i).find(el => 
        el.textContent === 'Noise' || el.textContent?.includes('NOISE')
      )
      expect(simulationHeader).toBeInTheDocument()
      expect(noiseHeader).toBeInTheDocument()
      
      // User selects a different pattern
      await user.click(screen.getByText('Brownian Motion'))
      
      // Selection callback is triggered
      expect(defaultProps.onSelect).toHaveBeenCalledWith('brownian-motion')
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
      
      // Noise Field should not appear in the filtered dropdown options
      // (Note: it may still appear as the selected value in the button, which is correct behavior)
      const dropdownOptions = screen.getByRole('listbox')
      expect(dropdownOptions).not.toHaveTextContent('Noise Field')
    })

    it('shows contextual category information in search vs grouped view', async () => {
      const user = userEvent.setup()
      render(<PatternDropdownSelector {...defaultProps} searchable={true} />)
      
      // User opens dropdown
      const dropdown = screen.getByRole('combobox')
      await user.click(dropdown)
      
      // In grouped view, category appears in headers but not under individual patterns
      const simulationHeader = screen.getByText(/simulation/i)
      expect(simulationHeader).toBeInTheDocument()
      
      // Particle System should appear without category label (it's already grouped under header)
      expect(screen.getByText('Particle System')).toBeInTheDocument()
      // Category should NOT appear redundantly under the pattern in grouped view
      const particlePattern = screen.getByText('Particle System').closest('button')
      expect(particlePattern).not.toHaveTextContent('Simulation')
      
      // User starts searching
      const searchInput = screen.getByPlaceholderText('Search patterns...')
      await user.type(searchInput, 'particle')
      
      // In search results, category context appears under pattern name (since headers are gone)
      expect(screen.getByText('Particle System')).toBeInTheDocument()
      const searchResult = screen.getByText('Particle System').closest('button')
      expect(searchResult).toHaveTextContent('Simulation') // Category context now appears
      
      // Category headers should be gone in search mode (but category text under pattern should remain)
      // Check that the collapsible category header button is gone
      expect(screen.queryByRole('button', { name: /simulation category/i })).not.toBeInTheDocument()
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
      expect(screen.getByText('CANVAS_2D')).toBeInTheDocument() // One pattern uses CANVAS_2D
      expect(screen.getAllByText('WEBGL_2.0')).toHaveLength(2) // Two patterns use WEBGL_2.0
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
      expect(screen.getByText('Brownian Motion')).toBeInTheDocument()
      
      // User clicks outside
      await user.click(document.body)
      
      // Dropdown closes
      await waitFor(() => {
        expect(screen.queryByText('Brownian Motion')).not.toBeInTheDocument()
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
        expect(screen.queryByText('Brownian Motion')).not.toBeInTheDocument()
      })
    })
  })
})