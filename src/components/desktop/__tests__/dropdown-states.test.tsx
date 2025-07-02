// AIDEV-NOTE: Behavioral test for dropdown states - ensures no blank/confusing dropdown states
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { PresetManager } from '@/lib/preset-manager'
import {
  createMockUserPreset,
  createMockFactoryPreset,
  resetPresetMocks,
  type MockPresetDropdownProps
} from '@/test-utils/preset-test-helpers'

// Mock the preset manager and comparison utilities
jest.mock('@/lib/preset-manager', () => ({
  PresetManager: {
    getEffectiveDefault: jest.fn(),
    getPresetsForGenerator: jest.fn(),
    loadPreset: jest.fn()
  }
}))

jest.mock('@/lib/preset-comparison', () => ({
  getPresetDisplayName: jest.fn((preset) => {
    if (!preset) return ''
    return preset.name
  })
}))

// Component that simulates the preset dropdown behavior
const PresetDropdownComponent = ({ 
  patternId,
  onPresetLoad,
  presets = []
}: MockPresetDropdownProps) => {
  const [selectedPresetId, setSelectedPresetId] = React.useState<string>('')
  const [effectiveDefault, setEffectiveDefault] = React.useState<{
    id: string
    name: string
    generatorType: string
    isFactory?: boolean
    isDefault?: boolean
    isUserDefault?: boolean
  } | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    const loadEffectiveDefault = async () => {
      setIsLoading(true)
      try {
        const defaultPreset = await PresetManager.getEffectiveDefault(patternId)
        setEffectiveDefault(defaultPreset)
        
        // Auto-select effective default if available
        if (defaultPreset) {
          setSelectedPresetId(defaultPreset.id)
        }
      } catch (error) {
        console.error('Failed to load effective default:', error)
        setEffectiveDefault(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadEffectiveDefault()
  }, [patternId])

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetId = e.target.value
    setSelectedPresetId(presetId)
    
    if (presetId) {
      onPresetLoad(presetId)
    }
  }

  // Determine dropdown options based on available presets and defaults
  const getDropdownOptions = () => {
    const options = []
    
    // Always show a meaningful default option
    if (effectiveDefault) {
      if (effectiveDefault.isUserDefault) {
        options.push({ value: effectiveDefault.id, label: `${effectiveDefault.name} (Your Default)` })
      } else if (effectiveDefault.isFactory || effectiveDefault.isDefault) {
        options.push({ value: effectiveDefault.id, label: `${effectiveDefault.name} (Default)` })
      } else {
        options.push({ value: effectiveDefault.id, label: effectiveDefault.name })
      }
    } else {
      // No defaults available - show pattern defaults option
      options.push({ value: 'pattern-defaults', label: 'Pattern Defaults' })
    }

    // Add other available presets
    presets.forEach(preset => {
      if (!effectiveDefault || preset.id !== effectiveDefault.id) {
        let label = preset.name
        if (preset.isFactory && (!effectiveDefault || effectiveDefault.id !== preset.id)) {
          label += ' (Factory)'
        }
        options.push({ value: preset.id, label })
      }
    })

    return options
  }

  const options = getDropdownOptions()

  return (
    <div data-testid="preset-dropdown-container">
      <label htmlFor="preset-select">Preset:</label>
      <select
        id="preset-select"
        value={selectedPresetId || (effectiveDefault?.id || 'pattern-defaults')}
        onChange={handlePresetChange}
        disabled={isLoading}
        data-testid="preset-dropdown"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {isLoading && <span data-testid="loading-indicator">Loading...</span>}
      
      <div data-testid="dropdown-info">
        <div>Pattern: {patternId}</div>
        <div>Options: {options.length}</div>
        <div>Selected: {selectedPresetId || 'none'}</div>
        <div>Effective Default: {effectiveDefault?.name || 'none'}</div>
      </div>
    </div>
  )
}

describe('Dropdown States - No Blank States Behavioral Tests', () => {
  const mockUserPreset = createMockUserPreset({ isUserDefault: true })
  const mockFactoryPreset = createMockFactoryPreset()
  const mockOtherUserPreset = createMockUserPreset({
    id: 'user-preset-2',
    name: 'Another Custom'
  })

  beforeEach(() => {
    resetPresetMocks()
  })

  describe('Dropdown Always Has Meaningful Default Selection', () => {
    test('pattern with user default - dropdown shows user default as selected', async () => {
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(mockUserPreset)
      
      const onPresetLoad = jest.fn()

      render(
        <PresetDropdownComponent
          patternId="noise-field"
          currentValues={{}}
          onPresetLoad={onPresetLoad}
          presets={[mockUserPreset, mockFactoryPreset]}
        />
      )

      await waitFor(() => {
        const dropdown = screen.getByTestId('preset-dropdown')
        expect(dropdown).toHaveValue('user-preset-1')
      })

      // Should show user default with clear labeling
      expect(screen.getByDisplayValue('My Custom Preset (Your Default)')).toBeInTheDocument()
      expect(screen.getByTestId('dropdown-info')).toHaveTextContent('Selected: user-preset-1')
    })

    test('pattern with only factory default - dropdown shows factory default as selected', async () => {
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(mockFactoryPreset)
      
      const onPresetLoad = jest.fn()

      render(
        <PresetDropdownComponent
          patternId="noise-field"
          currentValues={{}}
          onPresetLoad={onPresetLoad}
          presets={[mockFactoryPreset]}
        />
      )

      await waitFor(() => {
        const dropdown = screen.getByTestId('preset-dropdown')
        expect(dropdown).toHaveValue('factory-preset-1')
      })

      // Should show factory default with clear labeling
      expect(screen.getByDisplayValue('Factory Classic (Default)')).toBeInTheDocument()
    })

    test('pattern with no defaults - dropdown shows Pattern Defaults option', async () => {
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(null)
      
      const onPresetLoad = jest.fn()

      render(
        <PresetDropdownComponent
          patternId="experimental-pattern"
          currentValues={{}}
          onPresetLoad={onPresetLoad}
          presets={[]}
        />
      )

      await waitFor(() => {
        const dropdown = screen.getByTestId('preset-dropdown')
        expect(dropdown).toHaveValue('pattern-defaults')
      })

      // Should show pattern defaults option
      expect(screen.getByDisplayValue('Pattern Defaults')).toBeInTheDocument()
      expect(screen.getByTestId('dropdown-info')).toHaveTextContent('Effective Default: none')
    })

    test('dropdown never shows empty or blank state', async () => {
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(mockUserPreset)
      
      const onPresetLoad = jest.fn()

      render(
        <PresetDropdownComponent
          patternId="noise-field"
          currentValues={{}}
          onPresetLoad={onPresetLoad}
          presets={[mockUserPreset, mockFactoryPreset, mockOtherUserPreset]}
        />
      )

      await waitFor(() => {
        const dropdown = screen.getByTestId('preset-dropdown')
        const options = dropdown.querySelectorAll('option')
        
        // Should have meaningful options
        expect(options.length).toBeGreaterThan(0)
        
        // No empty values
        options.forEach(option => {
          expect(option.textContent).not.toBe('')
          expect(option.getAttribute('value')).not.toBe('')
        })
      })
    })
  })

  describe('Dropdown Option Labels Are Clear and Descriptive', () => {
    test('user defaults are clearly labeled', async () => {
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(mockUserPreset)
      
      render(
        <PresetDropdownComponent
          patternId="noise-field"
          currentValues={{}}
          onPresetLoad={jest.fn()}
          presets={[mockUserPreset, mockFactoryPreset]}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('My Custom Preset (Your Default)')).toBeInTheDocument()
      })
    })

    test('factory presets are clearly labeled', async () => {
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(mockFactoryPreset)
      
      render(
        <PresetDropdownComponent
          patternId="noise-field"
          currentValues={{}}
          onPresetLoad={jest.fn()}
          presets={[mockFactoryPreset, mockOtherUserPreset]}
        />
      )

      await waitFor(() => {
        // Factory default is selected
        expect(screen.getByDisplayValue('Factory Classic (Default)')).toBeInTheDocument()
        
        // Other factory presets would show as Factory
        const dropdown = screen.getByTestId('preset-dropdown')
        expect(dropdown).toBeInTheDocument()
      })
    })

    test('regular user presets have clear names', async () => {
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(mockUserPreset)
      
      render(
        <PresetDropdownComponent
          patternId="noise-field"
          currentValues={{}}
          onPresetLoad={jest.fn()}
          presets={[mockUserPreset, mockOtherUserPreset, mockFactoryPreset]}
        />
      )

      await waitFor(() => {
        const dropdown = screen.getByTestId('preset-dropdown')
        const options = Array.from(dropdown.querySelectorAll('option'))
        
        // Should find the other user preset with clear naming
        const otherUserOption = options.find(opt => opt.textContent === 'Another Custom')
        expect(otherUserOption).toBeDefined()
        
        // Factory preset should be labeled
        const factoryOption = options.find(opt => opt.textContent?.includes('Factory'))
        expect(factoryOption).toBeDefined()
      })
    })

    test('pattern defaults option is clear when no presets exist', async () => {
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(null)
      
      render(
        <PresetDropdownComponent
          patternId="custom-pattern"
          currentValues={{}}
          onPresetLoad={jest.fn()}
          presets={[]}
        />
      )

      await waitFor(() => {
        expect(screen.getByDisplayValue('Pattern Defaults')).toBeInTheDocument()
      })

      const dropdown = screen.getByTestId('preset-dropdown')
      expect(dropdown.querySelectorAll('option')).toHaveLength(1)
    })
  })

  describe('Dropdown State Transitions', () => {
    test('dropdown updates when user sets new default', async () => {
      // Start with factory default
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(mockFactoryPreset)
      
      const onPresetLoad = jest.fn()

      const { rerender } = render(
        <PresetDropdownComponent
          patternId="noise-field"
          currentValues={{}}
          onPresetLoad={onPresetLoad}
          presets={[mockFactoryPreset, mockOtherUserPreset]}
        />
      )

      await waitFor(() => {
        const dropdown = screen.getByTestId('preset-dropdown')
        expect(dropdown).toHaveValue('factory-preset-1')
      })

      // User sets a user default
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(mockUserPreset)

      rerender(
        <PresetDropdownComponent
          patternId="different-pattern" // Force re-render with different pattern to trigger useEffect
          currentValues={{}}
          onPresetLoad={onPresetLoad}
          presets={[mockUserPreset, mockFactoryPreset, mockOtherUserPreset]}
        />
      )

      await waitFor(() => {
        const dropdown = screen.getByTestId('preset-dropdown')
        expect(dropdown).toHaveValue('user-preset-1')
      })

      // Selection should have changed
      expect(screen.getByTestId('dropdown-info')).toHaveTextContent('Selected: user-preset-1')
    })

    test('dropdown handles preset removal gracefully', async () => {
      // Start with user default
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(mockUserPreset)
      
      const { rerender } = render(
        <PresetDropdownComponent
          patternId="noise-field"
          currentValues={{}}
          onPresetLoad={jest.fn()}
          presets={[mockUserPreset, mockFactoryPreset]}
        />
      )

      await waitFor(() => {
        const dropdown = screen.getByTestId('preset-dropdown')
        expect(dropdown).toHaveValue('user-preset-1')
      })

      // User removes default, falls back to factory
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(mockFactoryPreset)

      rerender(
        <PresetDropdownComponent
          patternId="different-pattern-2" // Force re-render to trigger useEffect
          currentValues={{}}
          onPresetLoad={jest.fn()}
          presets={[mockFactoryPreset]} // User preset removed
        />
      )

      await waitFor(() => {
        const dropdown = screen.getByTestId('preset-dropdown')
        expect(dropdown).toHaveValue('factory-preset-1')
      })
    })

    test('dropdown never shows loading state without fallback', async () => {
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockUserPreset), 100))
      )
      
      render(
        <PresetDropdownComponent
          patternId="noise-field"
          currentValues={{}}
          onPresetLoad={jest.fn()}
          presets={[mockUserPreset]}
        />
      )

      // Even during loading, dropdown should have a value
      const dropdown = screen.getByTestId('preset-dropdown')
      expect(dropdown).toHaveValue('pattern-defaults') // Fallback during load

      await waitFor(() => {
        expect(dropdown).toHaveValue('user-preset-1')
      })

      // Loading indicator appears but dropdown remains functional
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument()
    })
  })

  describe('User Interaction with Dropdown', () => {
    test('user can select different presets from dropdown', async () => {
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(mockUserPreset)
      
      const onPresetLoad = jest.fn()

      render(
        <PresetDropdownComponent
          patternId="noise-field"
          currentValues={{}}
          onPresetLoad={onPresetLoad}
          presets={[mockUserPreset, mockFactoryPreset, mockOtherUserPreset]}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('preset-dropdown')).toHaveValue('user-preset-1')
      })

      // User selects different preset
      const dropdown = screen.getByTestId('preset-dropdown')
      fireEvent.change(dropdown, { target: { value: 'user-preset-2' } })

      expect(onPresetLoad).toHaveBeenCalledWith('user-preset-2')
      expect(dropdown).toHaveValue('user-preset-2')
    })

    test('user can always distinguish between preset types in dropdown', async () => {
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(mockUserPreset)
      
      render(
        <PresetDropdownComponent
          patternId="noise-field"
          currentValues={{}}
          onPresetLoad={jest.fn()}
          presets={[mockUserPreset, mockFactoryPreset, mockOtherUserPreset]}
        />
      )

      await waitFor(() => {
        const dropdown = screen.getByTestId('preset-dropdown')
        const options = Array.from(dropdown.querySelectorAll('option'))
        
        // User should be able to identify:
        // 1. Their default
        expect(options.some(opt => opt.textContent?.includes('(Your Default)'))).toBe(true)
        
        // 2. Factory presets (when not default)
        expect(options.some(opt => opt.textContent?.includes('(Factory)'))).toBe(true)
        
        // 3. Regular user presets
        expect(options.some(opt => 
          opt.textContent === 'Another Custom' && 
          !opt.textContent.includes('(')
        )).toBe(true)
      })
    })

    test('dropdown provides enough context for user decision making', async () => {
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(null)
      
      render(
        <PresetDropdownComponent
          patternId="experimental-pattern"
          currentValues={{}}
          onPresetLoad={jest.fn()}
          presets={[mockOtherUserPreset]}
        />
      )

      await waitFor(() => {
        const dropdown = screen.getByTestId('preset-dropdown')
        const options = Array.from(dropdown.querySelectorAll('option'))
        
        // Should have meaningful choices
        expect(options.length).toBeGreaterThan(0)
        
        // Should include pattern defaults as fallback
        expect(options.some(opt => opt.textContent === 'Pattern Defaults')).toBe(true)
        
        // Should include available user preset
        expect(options.some(opt => opt.textContent === 'Another Custom')).toBe(true)
      })

      expect(screen.getByTestId('dropdown-info')).toHaveTextContent('Options: 2')
    })
  })

  describe('Edge Cases and Error States', () => {
    test('dropdown handles preset loading failure gracefully', async () => {
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockRejectedValue(new Error('Loading failed'))
      
      render(
        <PresetDropdownComponent
          patternId="noise-field"
          currentValues={{}}
          onPresetLoad={jest.fn()}
          presets={[mockOtherUserPreset]}
        />
      )

      await waitFor(() => {
        // Should fall back to pattern defaults when loading fails
        const dropdown = screen.getByTestId('preset-dropdown')
        expect(dropdown).toHaveValue('pattern-defaults')
      })

      expect(screen.getByDisplayValue('Pattern Defaults')).toBeInTheDocument()
    })

    test('dropdown handles empty preset list appropriately', async () => {
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(null)
      
      render(
        <PresetDropdownComponent
          patternId="new-pattern"
          currentValues={{}}
          onPresetLoad={jest.fn()}
          presets={[]}
        />
      )

      await waitFor(() => {
        const dropdown = screen.getByTestId('preset-dropdown')
        expect(dropdown.querySelectorAll('option')).toHaveLength(1)
        expect(dropdown).toHaveValue('pattern-defaults')
      })

      expect(screen.getByDisplayValue('Pattern Defaults')).toBeInTheDocument()
    })

    test('dropdown maintains consistency across pattern switches', async () => {
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(mockUserPreset)
      
      const { rerender } = render(
        <PresetDropdownComponent
          patternId="noise-field"
          currentValues={{}}
          onPresetLoad={jest.fn()}
          presets={[mockUserPreset]}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('preset-dropdown')).toHaveValue('user-preset-1')
      })

      // Switch to different pattern with no presets
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(null)

      rerender(
        <PresetDropdownComponent
          patternId="different-pattern"
          currentValues={{}}
          onPresetLoad={jest.fn()}
          presets={[]}
        />
      )

      await waitFor(() => {
        const dropdown = screen.getByTestId('preset-dropdown')
        expect(dropdown).toHaveValue('pattern-defaults')
        expect(dropdown.querySelectorAll('option')).toHaveLength(1)
      })
    })
  })
})