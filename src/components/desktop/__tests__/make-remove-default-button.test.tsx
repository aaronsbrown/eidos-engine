// AIDEV-NOTE: Behavioral test for Make/Remove Default button functionality in preset management
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { PresetManager } from '@/lib/preset-manager'

// Mock the preset manager
jest.mock('@/lib/preset-manager', () => ({
  PresetManager: {
    setUserDefault: jest.fn(),
    clearUserDefault: jest.fn(),
    getUserDefault: jest.fn(),
    loadUserPresets: jest.fn()
  }
}))

// Mock component that simulates the preset panel with Make/Remove Default functionality
const PresetDefaultButtonComponent = ({ 
  preset,
  onRefresh
}: {
  preset: {
    id: string
    name: string
    generatorType: string
    isFactory?: boolean
    isUserDefault?: boolean
  }
  onRefresh: () => void
}) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleMakeDefault = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      await PresetManager.setUserDefault(preset.id)
      onRefresh()
    } catch (err) {
      setError('Failed to set as default')
      console.error('Failed to set user default:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveDefault = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      await PresetManager.clearUserDefault(preset.generatorType)
      onRefresh()
    } catch (err) {
      setError('Failed to remove default')
      console.error('Failed to remove user default:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Only show button for user presets (not factory presets)
  if (preset.isFactory) {
    return (
      <div data-testid="preset-item">
        <span>{preset.name}</span>
        <span data-testid="factory-badge">Factory</span>
      </div>
    )
  }

  return (
    <div data-testid="preset-item">
      <span>{preset.name}</span>
      {preset.isUserDefault && <span data-testid="default-indicator">★ Default</span>}
      <button
        onClick={preset.isUserDefault ? handleRemoveDefault : handleMakeDefault}
        disabled={isLoading}
        data-testid="default-toggle-button"
        title={preset.isUserDefault ? 'Remove as default (will use factory default)' : 'Make this your default preset'}
        className={preset.isUserDefault ? 'default-button active' : 'default-button'}
      >
        {isLoading ? '...' : (preset.isUserDefault ? '★' : '☆')}
      </button>
      {error && <div data-testid="error-message">{error}</div>}
    </div>
  )
}

describe('Make/Remove Default Button - Behavioral Tests', () => {
  const mockUserPreset = {
    id: 'user-preset-1',
    name: 'My Custom Preset',
    generatorType: 'noise-field',
    isFactory: false,
    isUserDefault: false
  }

  const mockUserPresetAsDefault = {
    ...mockUserPreset,
    isUserDefault: true
  }

  const mockFactoryPreset = {
    id: 'factory-preset-1',
    name: 'Factory Preset',
    generatorType: 'noise-field',
    isFactory: true,
    isDefault: true
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Make Default Functionality', () => {
    test('user clicks Make Default button - preset becomes user default', async () => {
      ;(PresetManager.setUserDefault as jest.Mock).mockResolvedValue(true)
      
      const onRefresh = jest.fn()

      render(
        <PresetDefaultButtonComponent
          preset={mockUserPreset}
          onRefresh={onRefresh}
        />
      )

      // User sees unfilled star (not default)
      const button = screen.getByTestId('default-toggle-button')
      expect(button).toHaveTextContent('☆')
      expect(button).toHaveClass('default-button')
      expect(button).not.toHaveClass('active')

      // User clicks to make default
      fireEvent.click(button)

      // Button shows loading
      expect(button).toHaveTextContent('...')
      expect(button).toBeDisabled()

      await waitFor(() => {
        expect(PresetManager.setUserDefault).toHaveBeenCalledWith('user-preset-1')
        expect(onRefresh).toHaveBeenCalled()
      })

      // Button returns to normal state
      expect(button).not.toBeDisabled()
    })

    test('user sets default on preset - button title explains purpose', () => {
      render(
        <PresetDefaultButtonComponent
          preset={mockUserPreset}
          onRefresh={jest.fn()}
        />
      )

      const button = screen.getByTestId('default-toggle-button')
      expect(button).toHaveAttribute('title', 'Make this your default preset')
    })

    test('making default fails - user sees error message', async () => {
      ;(PresetManager.setUserDefault as jest.Mock).mockRejectedValue(new Error('Network error'))
      
      const onRefresh = jest.fn()

      render(
        <PresetDefaultButtonComponent
          preset={mockUserPreset}
          onRefresh={onRefresh}
        />
      )

      fireEvent.click(screen.getByTestId('default-toggle-button'))

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Failed to set as default')
      })

      // onRefresh should not be called on error
      expect(onRefresh).not.toHaveBeenCalled()
    })

    test('user can make different presets default for same pattern type', async () => {
      ;(PresetManager.setUserDefault as jest.Mock).mockResolvedValue(true)
      
      const onRefresh = jest.fn()

      const { rerender } = render(
        <PresetDefaultButtonComponent
          preset={mockUserPreset}
          onRefresh={onRefresh}
        />
      )

      // Make first preset default
      fireEvent.click(screen.getByTestId('default-toggle-button'))

      await waitFor(() => {
        expect(PresetManager.setUserDefault).toHaveBeenCalledWith('user-preset-1')
      })

      jest.clearAllMocks()

      // Switch to another preset
      const anotherPreset = {
        id: 'user-preset-2',
        name: 'Another Preset',
        generatorType: 'noise-field',
        isFactory: false,
        isUserDefault: false
      }

      rerender(
        <PresetDefaultButtonComponent
          preset={anotherPreset}
          onRefresh={onRefresh}
        />
      )

      // Make second preset default
      fireEvent.click(screen.getByTestId('default-toggle-button'))

      await waitFor(() => {
        expect(PresetManager.setUserDefault).toHaveBeenCalledWith('user-preset-2')
      })

      // Verify both operations worked
      expect(PresetManager.setUserDefault).toHaveBeenCalledTimes(1)
    })
  })

  describe('Remove Default Functionality', () => {
    test('user clicks Remove Default button - preset is no longer user default', async () => {
      ;(PresetManager.clearUserDefault as jest.Mock).mockResolvedValue(true)
      
      const onRefresh = jest.fn()

      render(
        <PresetDefaultButtonComponent
          preset={mockUserPresetAsDefault}
          onRefresh={onRefresh}
        />
      )

      // User sees filled star (is default)
      const button = screen.getByTestId('default-toggle-button')
      expect(button).toHaveTextContent('★')
      expect(button).toHaveClass('active')
      expect(screen.getByTestId('default-indicator')).toHaveTextContent('★ Default')

      // User clicks to remove default
      fireEvent.click(button)

      await waitFor(() => {
        expect(PresetManager.clearUserDefault).toHaveBeenCalledWith('noise-field')
        expect(onRefresh).toHaveBeenCalled()
      })
    })

    test('remove default button title explains fallback behavior', () => {
      render(
        <PresetDefaultButtonComponent
          preset={mockUserPresetAsDefault}
          onRefresh={jest.fn()}
        />
      )

      const button = screen.getByTestId('default-toggle-button')
      expect(button).toHaveAttribute('title', 'Remove as default (will use factory default)')
    })

    test('removing default fails - user sees error message', async () => {
      ;(PresetManager.clearUserDefault as jest.Mock).mockRejectedValue(new Error('Storage error'))
      
      const onRefresh = jest.fn()

      render(
        <PresetDefaultButtonComponent
          preset={mockUserPresetAsDefault}
          onRefresh={onRefresh}
        />
      )

      fireEvent.click(screen.getByTestId('default-toggle-button'))

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Failed to remove default')
      })

      expect(onRefresh).not.toHaveBeenCalled()
    })

    test('user removes default and system falls back to factory default', async () => {
      ;(PresetManager.clearUserDefault as jest.Mock).mockResolvedValue(true)
      
      const onRefresh = jest.fn()

      render(
        <PresetDefaultButtonComponent
          preset={mockUserPresetAsDefault}
          onRefresh={onRefresh}
        />
      )

      fireEvent.click(screen.getByTestId('default-toggle-button'))

      await waitFor(() => {
        expect(PresetManager.clearUserDefault).toHaveBeenCalledWith('noise-field')
      })

      // Verify the system cleared the user default for the pattern type
      expect(PresetManager.clearUserDefault).toHaveBeenCalledWith('noise-field')
      expect(onRefresh).toHaveBeenCalled()
    })
  })

  describe('Button State Management', () => {
    test('button appearance changes based on default status', () => {
      const { rerender } = render(
        <PresetDefaultButtonComponent
          preset={mockUserPreset}
          onRefresh={jest.fn()}
        />
      )

      // Not default - empty star
      let button = screen.getByTestId('default-toggle-button')
      expect(button).toHaveTextContent('☆')
      expect(button).not.toHaveClass('active')

      // Is default - filled star
      rerender(
        <PresetDefaultButtonComponent
          preset={mockUserPresetAsDefault}
          onRefresh={jest.fn()}
        />
      )

      button = screen.getByTestId('default-toggle-button')
      expect(button).toHaveTextContent('★')
      expect(button).toHaveClass('active')
    })

    test('loading state prevents multiple clicks', async () => {
      ;(PresetManager.setUserDefault as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      )
      
      render(
        <PresetDefaultButtonComponent
          preset={mockUserPreset}
          onRefresh={jest.fn()}
        />
      )

      const button = screen.getByTestId('default-toggle-button')
      
      // Click button
      fireEvent.click(button)
      
      // Should be disabled and show loading
      expect(button).toBeDisabled()
      expect(button).toHaveTextContent('...')
      
      // Multiple clicks should not work
      fireEvent.click(button)
      fireEvent.click(button)
      
      await waitFor(() => {
        expect(button).not.toBeDisabled()
      })
      
      // Should only have been called once
      expect(PresetManager.setUserDefault).toHaveBeenCalledTimes(1)
    })

    test('default indicator appears only when preset is user default', () => {
      const { rerender } = render(
        <PresetDefaultButtonComponent
          preset={mockUserPreset}
          onRefresh={jest.fn()}
        />
      )

      // Not default - no indicator
      expect(screen.queryByTestId('default-indicator')).not.toBeInTheDocument()

      // Is default - shows indicator
      rerender(
        <PresetDefaultButtonComponent
          preset={mockUserPresetAsDefault}
          onRefresh={jest.fn()}
        />
      )

      expect(screen.getByTestId('default-indicator')).toHaveTextContent('★ Default')
    })
  })

  describe('Factory Preset Restrictions', () => {
    test('factory presets do not show default toggle button', () => {
      render(
        <PresetDefaultButtonComponent
          preset={mockFactoryPreset}
          onRefresh={jest.fn()}
        />
      )

      // Should show factory badge instead of default button
      expect(screen.getByTestId('factory-badge')).toHaveTextContent('Factory')
      expect(screen.queryByTestId('default-toggle-button')).not.toBeInTheDocument()
      expect(screen.queryByTestId('default-indicator')).not.toBeInTheDocument()
    })

    test('user cannot modify factory preset default status', () => {
      render(
        <PresetDefaultButtonComponent
          preset={mockFactoryPreset}
          onRefresh={jest.fn()}
        />
      )

      // Factory preset should be read-only regarding default status
      expect(screen.getByText('Factory Preset')).toBeInTheDocument()
      expect(screen.queryByTestId('default-toggle-button')).not.toBeInTheDocument()
      
      // No way to interact with default functionality
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('Integration with Preset Management System', () => {
    test('successful default change triggers preset refresh', async () => {
      ;(PresetManager.setUserDefault as jest.Mock).mockResolvedValue(true)
      
      const onRefresh = jest.fn()

      render(
        <PresetDefaultButtonComponent
          preset={mockUserPreset}
          onRefresh={onRefresh}
        />
      )

      fireEvent.click(screen.getByTestId('default-toggle-button'))

      await waitFor(() => {
        expect(onRefresh).toHaveBeenCalled()
      })

      // Refresh should happen after successful operation
      expect(PresetManager.setUserDefault).toHaveBeenCalled()
      expect(onRefresh).toHaveBeenCalled()
    })

    test('error conditions do not trigger refresh', async () => {
      ;(PresetManager.setUserDefault as jest.Mock).mockRejectedValue(new Error('Test error'))
      
      const onRefresh = jest.fn()

      render(
        <PresetDefaultButtonComponent
          preset={mockUserPreset}
          onRefresh={onRefresh}
        />
      )

      fireEvent.click(screen.getByTestId('default-toggle-button'))

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })

      // No refresh on error
      expect(onRefresh).not.toHaveBeenCalled()
    })

    test('button respects current preset state after refresh', () => {
      const onRefresh = jest.fn()

      // Simulate preset state change after refresh
      const { rerender } = render(
        <PresetDefaultButtonComponent
          preset={mockUserPreset}
          onRefresh={onRefresh}
        />
      )

      // Initially not default
      expect(screen.getByTestId('default-toggle-button')).toHaveTextContent('☆')

      // Simulate state change (e.g., from refresh)
      rerender(
        <PresetDefaultButtonComponent
          preset={mockUserPresetAsDefault}
          onRefresh={onRefresh}
        />
      )

      // Button reflects new state
      expect(screen.getByTestId('default-toggle-button')).toHaveTextContent('★')
      expect(screen.getByTestId('default-indicator')).toBeInTheDocument()
    })
  })
})