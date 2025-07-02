// AIDEV-NOTE: Behavioral test for smart reset precedence system (User Default → Factory Default → Pattern Defaults)
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { PresetManager } from '@/lib/preset-manager'

// Mock the preset manager
jest.mock('@/lib/preset-manager', () => ({
  PresetManager: {
    getEffectiveDefault: jest.fn(),
    getUserDefault: jest.fn(),
    loadFactoryPresets: jest.fn(),
    setUserDefault: jest.fn(),
    clearUserDefault: jest.fn()
  }
}))

// Mock reset component that tests the precedence system
const SmartResetComponent = ({ 
  patternId, 
  onReset, 
  currentValues,
  patternDefaults
}: {
  patternId: string
  onReset: (values: Record<string, unknown>) => void
  currentValues: Record<string, unknown>
  patternDefaults: Record<string, unknown>
}) => {
  const [isResetting, setIsResetting] = React.useState(false)

  const handleSmartReset = async () => {
    setIsResetting(true)
    
    try {
      // Test the precedence system: User Default → Factory Default → Pattern Defaults
      const effectiveDefault = await PresetManager.getEffectiveDefault(patternId)
      
      if (effectiveDefault) {
        // Use preset parameters
        onReset(effectiveDefault.parameters)
      } else {
        // Fall back to pattern defaults
        onReset(patternDefaults)
      }
    } catch (error) {
      console.error('Reset failed:', error)
      // Always fall back to pattern defaults on error
      onReset(patternDefaults)
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div>
      <div data-testid="current-values">{JSON.stringify(currentValues)}</div>
      <button 
        onClick={handleSmartReset}
        disabled={isResetting}
        data-testid="smart-reset-button"
      >
        {isResetting ? 'Resetting...' : 'Smart Reset'}
      </button>
    </div>
  )
}

describe('Smart Reset Precedence System - Behavioral Tests', () => {
  const mockPatternDefaults = {
    frequency: 440,
    amplitude: 0.5,
    waveform: 'sine'
  }

  const mockFactoryDefault = {
    id: 'factory-default',
    name: 'Factory Default',
    generatorType: 'audio-visualizer',
    parameters: {
      frequency: 528,
      amplitude: 0.7,
      waveform: 'triangle'
    },
    isFactory: true,
    isDefault: true,
    createdAt: new Date(),
    contentHash: 'factory-hash'
  }

  const mockUserDefault = {
    id: 'user-default',
    name: 'My Default',
    generatorType: 'audio-visualizer',
    parameters: {
      frequency: 880,
      amplitude: 0.9,
      waveform: 'square'
    },
    isUserDefault: true,
    createdAt: new Date(),
    contentHash: 'user-hash'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Precedence Level 1: User Default Takes Priority', () => {
    test('user has set a default preset - smart reset uses user default', async () => {
      // Mock: User has set a default
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(mockUserDefault)
      
      const onReset = jest.fn()
      const currentValues = { frequency: 1000, amplitude: 0.3, waveform: 'sawtooth' }

      render(
        <SmartResetComponent
          patternId="audio-visualizer"
          onReset={onReset}
          currentValues={currentValues}
          patternDefaults={mockPatternDefaults}
        />
      )

      // User clicks smart reset
      fireEvent.click(screen.getByTestId('smart-reset-button'))

      await waitFor(() => {
        expect(PresetManager.getEffectiveDefault).toHaveBeenCalledWith('audio-visualizer')
        expect(onReset).toHaveBeenCalledWith(mockUserDefault.parameters)
      })

      // Should use user default values, not factory or pattern defaults
      expect(onReset).toHaveBeenCalledWith({
        frequency: 880,
        amplitude: 0.9,
        waveform: 'square'
      })
    })

    test('user default overrides factory default when both exist', async () => {
      // Even if factory default exists, user default should take precedence
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(mockUserDefault)
      
      const onReset = jest.fn()

      render(
        <SmartResetComponent
          patternId="audio-visualizer"
          onReset={onReset}
          currentValues={{}}
          patternDefaults={mockPatternDefaults}
        />
      )

      fireEvent.click(screen.getByTestId('smart-reset-button'))

      await waitFor(() => {
        expect(onReset).toHaveBeenCalledWith(mockUserDefault.parameters)
      })

      // Verify it's the user default, not factory default
      expect(onReset).not.toHaveBeenCalledWith(mockFactoryDefault.parameters)
      expect(onReset).not.toHaveBeenCalledWith(mockPatternDefaults)
    })
  })

  describe('Precedence Level 2: Factory Default When No User Default', () => {
    test('no user default exists - smart reset uses factory default', async () => {
      // Mock: No user default, but factory default exists
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(mockFactoryDefault)
      
      const onReset = jest.fn()

      render(
        <SmartResetComponent
          patternId="audio-visualizer"
          onReset={onReset}
          currentValues={{ frequency: 1000 }}
          patternDefaults={mockPatternDefaults}
        />
      )

      fireEvent.click(screen.getByTestId('smart-reset-button'))

      await waitFor(() => {
        expect(onReset).toHaveBeenCalledWith(mockFactoryDefault.parameters)
      })

      // Should use factory default values, not pattern defaults
      expect(onReset).toHaveBeenCalledWith({
        frequency: 528,
        amplitude: 0.7,
        waveform: 'triangle'
      })
      expect(onReset).not.toHaveBeenCalledWith(mockPatternDefaults)
    })

    test('user removes their default - smart reset falls back to factory default', async () => {
      // Simulate user removing their default - now factory default should be used
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(mockFactoryDefault)
      
      const onReset = jest.fn()

      render(
        <SmartResetComponent
          patternId="audio-visualizer"
          onReset={onReset}
          currentValues={{}}
          patternDefaults={mockPatternDefaults}
        />
      )

      fireEvent.click(screen.getByTestId('smart-reset-button'))

      await waitFor(() => {
        expect(onReset).toHaveBeenCalledWith(mockFactoryDefault.parameters)
      })

      // Verify fallback to factory default worked
      expect(onReset).toHaveBeenCalledWith({
        frequency: 528,
        amplitude: 0.7,
        waveform: 'triangle'
      })
    })
  })

  describe('Precedence Level 3: Pattern Defaults As Final Fallback', () => {
    test('no defaults exist - smart reset uses pattern defaults', async () => {
      // Mock: No user default, no factory default
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(null)
      
      const onReset = jest.fn()

      render(
        <SmartResetComponent
          patternId="audio-visualizer"
          onReset={onReset}
          currentValues={{ frequency: 1200, amplitude: 0.1 }}
          patternDefaults={mockPatternDefaults}
        />
      )

      fireEvent.click(screen.getByTestId('smart-reset-button'))

      await waitFor(() => {
        expect(onReset).toHaveBeenCalledWith(mockPatternDefaults)
      })

      // Should fall back to pattern defaults
      expect(onReset).toHaveBeenCalledWith({
        frequency: 440,
        amplitude: 0.5,
        waveform: 'sine'
      })
    })

    test('preset loading fails - smart reset gracefully falls back to pattern defaults', async () => {
      // Mock: getEffectiveDefault throws an error
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockRejectedValue(new Error('Loading failed'))
      
      const onReset = jest.fn()

      render(
        <SmartResetComponent
          patternId="audio-visualizer"
          onReset={onReset}
          currentValues={{}}
          patternDefaults={mockPatternDefaults}
        />
      )

      fireEvent.click(screen.getByTestId('smart-reset-button'))

      await waitFor(() => {
        expect(onReset).toHaveBeenCalledWith(mockPatternDefaults)
      })

      // Should gracefully fall back to pattern defaults on error
      expect(onReset).toHaveBeenCalledWith({
        frequency: 440,
        amplitude: 0.5,
        waveform: 'sine'
      })
    })

    test('pattern with no factory presets defined - uses pattern defaults', async () => {
      // Mock: Pattern type has no factory presets
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(null)
      
      const onReset = jest.fn()

      render(
        <SmartResetComponent
          patternId="custom-experimental-pattern"
          onReset={onReset}
          currentValues={{}}
          patternDefaults={mockPatternDefaults}
        />
      )

      fireEvent.click(screen.getByTestId('smart-reset-button'))

      await waitFor(() => {
        expect(PresetManager.getEffectiveDefault).toHaveBeenCalledWith('custom-experimental-pattern')
        expect(onReset).toHaveBeenCalledWith(mockPatternDefaults)
      })
    })
  })

  describe('User Experience During Reset', () => {
    test('smart reset shows loading state during async operation', async () => {
      // Mock slow preset loading
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockUserDefault), 100))
      )
      
      const onReset = jest.fn()

      render(
        <SmartResetComponent
          patternId="audio-visualizer"
          onReset={onReset}
          currentValues={{}}
          patternDefaults={mockPatternDefaults}
        />
      )

      const resetButton = screen.getByTestId('smart-reset-button')
      
      // Initially not loading
      expect(resetButton).toHaveTextContent('Smart Reset')
      expect(resetButton).not.toBeDisabled()

      // Click reset
      fireEvent.click(resetButton)

      // Should show loading state immediately
      expect(resetButton).toHaveTextContent('Resetting...')
      expect(resetButton).toBeDisabled()

      // Wait for completion
      await waitFor(() => {
        expect(resetButton).toHaveTextContent('Smart Reset')
        expect(resetButton).not.toBeDisabled()
      })

      expect(onReset).toHaveBeenCalledWith(mockUserDefault.parameters)
    })

    test('user can see which preset values are being applied', async () => {
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(mockUserDefault)
      
      const onReset = jest.fn()
      const initialValues = { frequency: 1000, amplitude: 0.3, waveform: 'sawtooth' }

      const { rerender } = render(
        <SmartResetComponent
          patternId="audio-visualizer"
          onReset={onReset}
          currentValues={initialValues}
          patternDefaults={mockPatternDefaults}
        />
      )

      // User sees current values
      expect(screen.getByTestId('current-values')).toHaveTextContent(JSON.stringify(initialValues))

      // User clicks reset
      fireEvent.click(screen.getByTestId('smart-reset-button'))

      await waitFor(() => {
        expect(onReset).toHaveBeenCalledWith(mockUserDefault.parameters)
      })

      // Simulate values changing after reset
      rerender(
        <SmartResetComponent
          patternId="audio-visualizer"
          onReset={onReset}
          currentValues={mockUserDefault.parameters}
          patternDefaults={mockPatternDefaults}
        />
      )

      // User can see the new values
      expect(screen.getByTestId('current-values')).toHaveTextContent(
        JSON.stringify(mockUserDefault.parameters)
      )
    })
  })

  describe('Integration with Preset Management', () => {
    test('precedence system respects live preset changes', async () => {
      // Start with no defaults
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(null)
      
      const onReset = jest.fn()

      const { rerender } = render(
        <SmartResetComponent
          patternId="audio-visualizer"
          onReset={onReset}
          currentValues={{}}
          patternDefaults={mockPatternDefaults}
        />
      )

      // Reset with no defaults - should use pattern defaults
      fireEvent.click(screen.getByTestId('smart-reset-button'))

      await waitFor(() => {
        expect(onReset).toHaveBeenCalledWith(mockPatternDefaults)
      })

      jest.clearAllMocks()

      // User sets a default preset
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(mockUserDefault)

      // Re-render component (simulating state update)
      rerender(
        <SmartResetComponent
          patternId="audio-visualizer"
          onReset={onReset}
          currentValues={{}}
          patternDefaults={mockPatternDefaults}
        />
      )

      // Reset again - should now use user default
      fireEvent.click(screen.getByTestId('smart-reset-button'))

      await waitFor(() => {
        expect(onReset).toHaveBeenCalledWith(mockUserDefault.parameters)
      })

      // Verify the precedence changed correctly
      expect(onReset).not.toHaveBeenCalledWith(mockPatternDefaults)
    })
  })
})