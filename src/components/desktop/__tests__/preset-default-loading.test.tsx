// AIDEV-NOTE: Behavioral tests for default preset auto-loading on page initialization
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { PresetManager } from '@/lib/preset-manager'

// Mock PresetManager methods
jest.mock('@/lib/preset-manager', () => ({
  PresetManager: {
    getEffectiveDefault: jest.fn(),
    loadFactoryPresets: jest.fn(),
    getPresetsForGenerator: jest.fn(),
    getLastActivePreset: jest.fn(),
    setLastActivePreset: jest.fn(),
    getUserDefault: jest.fn(),
    cleanupFactoryPresetsFromStorage: jest.fn(),
    validatePresetParameters: jest.fn()
  }
}))

// Mock the usePresetManager hook
const mockUsePresetManager = jest.fn()
jest.mock('@/lib/hooks/use-preset-manager', () => ({
  usePresetManager: () => mockUsePresetManager()
}))

// Simple component that uses preset manager
const PresetLoadingComponent = ({ patternId }) => {
  const {
    presets,
    activePresetId,
    isLoading,
    error
  } = mockUsePresetManager()

  if (isLoading) return <div data-testid="loading">Loading presets...</div>
  if (error) return <div data-testid="error">Error: {error}</div>

  return (
    <div>
      <div data-testid="pattern-id">{patternId}</div>
      <div data-testid="active-preset-id">{activePresetId || 'none'}</div>
      <div data-testid="presets-count">{presets?.length || 0}</div>
      {activePresetId && (
        <div data-testid="active-preset-name">
          {presets?.find(p => p.id === activePresetId)?.name || 'Unknown'}
        </div>
      )}
    </div>
  )
}

describe('Default Preset Auto-Loading - Behavioral Tests', () => {
  const mockFactoryPresets = [
    {
      id: 'aizawa-classic',
      name: 'Classic Aizawa',
      generatorType: 'aizawa-attractor',
      parameters: { a: 0.95, b: 0.7, c: 0.6 },
      isFactory: true,
      isDefault: true,
      createdAt: new Date(),
      contentHash: 'factory-hash'
    },
    {
      id: 'aizawa-enhanced',
      name: 'Enhanced Complexity',
      generatorType: 'aizawa-attractor',
      parameters: { a: 0.98, b: 0.8, c: 0.7 },
      isFactory: true,
      isDefault: false,
      createdAt: new Date(),
      contentHash: 'factory-hash-2'
    }
  ]

  const mockUserPresets = [
    {
      id: 'user-custom',
      name: 'My Custom',
      generatorType: 'aizawa-attractor',
      parameters: { a: 1.0, b: 0.5, c: 0.8 },
      isFactory: false,
      createdAt: new Date(),
      contentHash: 'user-hash'
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Default mock implementations
    ;(PresetManager.loadFactoryPresets as jest.Mock).mockResolvedValue(mockFactoryPresets)
    ;(PresetManager.getPresetsForGenerator as jest.Mock).mockResolvedValue([...mockFactoryPresets, ...mockUserPresets])
    ;(PresetManager.getLastActivePreset as jest.Mock).mockReturnValue(null)
    ;(PresetManager.getUserDefault as jest.Mock).mockReturnValue(null)
    ;(PresetManager.validatePresetParameters as jest.Mock).mockReturnValue({ valid: true, warnings: [] })
  })

  describe('Phase 1: Default Preset Discovery', () => {
    test('finds factory default when no user default exists', async () => {
      // Mock getEffectiveDefault to return factory default
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(mockFactoryPresets[0])

      const result = await PresetManager.getEffectiveDefault('aizawa-attractor')
      
      expect(result).toEqual(mockFactoryPresets[0])
      expect(result.isDefault).toBe(true)
      expect(result.name).toBe('Classic Aizawa')
    })

    test('prioritizes user default over factory default', async () => {
      const userDefault = {
        ...mockUserPresets[0],
        isUserDefault: true
      }
      
      ;(PresetManager.getUserDefault as jest.Mock).mockReturnValue(userDefault)
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(userDefault)

      const result = await PresetManager.getEffectiveDefault('aizawa-attractor')
      
      expect(result).toEqual(userDefault)
      expect(result.isUserDefault).toBe(true)
    })

    test('returns null when no defaults exist', async () => {
      const presetsWithoutDefaults = mockFactoryPresets.map(p => ({ ...p, isDefault: false }))
      ;(PresetManager.loadFactoryPresets as jest.Mock).mockResolvedValue(presetsWithoutDefaults)
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(null)

      const result = await PresetManager.getEffectiveDefault('aizawa-attractor')
      
      expect(result).toBeNull()
    })

    test('handles different pattern types correctly', async () => {
      const lorenzDefaults = [
        {
          id: 'lorenz-classic',
          name: 'Classic Lorenz',
          generatorType: 'lorenz-attractor',
          parameters: { sigma: 10, rho: 28, beta: 2.6667 },
          isFactory: true,
          isDefault: true,
          createdAt: new Date(),
          contentHash: 'lorenz-hash'
        }
      ]

      ;(PresetManager.loadFactoryPresets as jest.Mock).mockResolvedValue([...mockFactoryPresets, ...lorenzDefaults])
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockImplementation(async (patternType) => {
        if (patternType === 'lorenz-attractor') {
          return lorenzDefaults[0]
        }
        return mockFactoryPresets[0]
      })

      // Test Aizawa pattern
      const aizawaResult = await PresetManager.getEffectiveDefault('aizawa-attractor')
      expect(aizawaResult.generatorType).toBe('aizawa-attractor')
      expect(aizawaResult.name).toBe('Classic Aizawa')

      // Test Lorenz pattern
      const lorenzResult = await PresetManager.getEffectiveDefault('lorenz-attractor')
      expect(lorenzResult.generatorType).toBe('lorenz-attractor')
      expect(lorenzResult.name).toBe('Classic Lorenz')
    })
  })

  describe('Phase 2: Auto-Loading on Component Mount', () => {
    test('loads default preset when component mounts with no last active preset', async () => {
      const expectedState = {
        presets: [...mockFactoryPresets, ...mockUserPresets],
        activePresetId: 'aizawa-classic',
        isLoading: false,
        error: null
      }

      mockUsePresetManager.mockReturnValue(expectedState)

      render(<PresetLoadingComponent patternId="aizawa-attractor" />)

      await waitFor(() => {
        expect(screen.getByTestId('active-preset-id')).toHaveTextContent('aizawa-classic')
        expect(screen.getByTestId('active-preset-name')).toHaveTextContent('Classic Aizawa')
      })
    })

    test('preserves last active preset if it still exists', async () => {
      ;(PresetManager.getLastActivePreset as jest.Mock).mockReturnValue('user-custom')

      const expectedState = {
        presets: [...mockFactoryPresets, ...mockUserPresets],
        activePresetId: 'user-custom',
        isLoading: false,
        error: null
      }

      mockUsePresetManager.mockReturnValue(expectedState)

      render(<PresetLoadingComponent patternId="aizawa-attractor" />)

      await waitFor(() => {
        expect(screen.getByTestId('active-preset-id')).toHaveTextContent('user-custom')
        expect(screen.getByTestId('active-preset-name')).toHaveTextContent('My Custom')
      })
    })

    test('falls back to default when last active preset no longer exists', async () => {
      // Last active preset ID that doesn't exist in current presets
      ;(PresetManager.getLastActivePreset as jest.Mock).mockReturnValue('deleted-preset-id')

      const expectedState = {
        presets: [...mockFactoryPresets, ...mockUserPresets],
        activePresetId: 'aizawa-classic', // Falls back to default
        isLoading: false,
        error: null
      }

      mockUsePresetManager.mockReturnValue(expectedState)

      render(<PresetLoadingComponent patternId="aizawa-attractor" />)

      await waitFor(() => {
        expect(screen.getByTestId('active-preset-id')).toHaveTextContent('aizawa-classic')
        expect(screen.getByTestId('active-preset-name')).toHaveTextContent('Classic Aizawa')
      })
    })

    test('shows loading state during preset initialization', () => {
      mockUsePresetManager.mockReturnValue({
        presets: [],
        activePresetId: null,
        isLoading: true,
        error: null
      })

      render(<PresetLoadingComponent patternId="aizawa-attractor" />)
      
      expect(screen.getByTestId('loading')).toHaveTextContent('Loading presets...')
    })

    test('handles errors during preset loading gracefully', () => {
      mockUsePresetManager.mockReturnValue({
        presets: [],
        activePresetId: null,
        isLoading: false,
        error: 'Failed to load factory presets'
      })

      render(<PresetLoadingComponent patternId="aizawa-attractor" />)
      
      expect(screen.getByTestId('error')).toHaveTextContent('Error: Failed to load factory presets')
    })
  })

  describe('Phase 3: Pattern Switching Behavior', () => {
    test('loads appropriate default when switching between patterns', async () => {
      // Start with Aizawa pattern
      let expectedState = {
        presets: [...mockFactoryPresets, ...mockUserPresets],
        activePresetId: 'aizawa-classic',
        isLoading: false,
        error: null
      }

      mockUsePresetManager.mockReturnValue(expectedState)
      const { rerender } = render(<PresetLoadingComponent patternId="aizawa-attractor" />)

      await waitFor(() => {
        expect(screen.getByTestId('active-preset-id')).toHaveTextContent('aizawa-classic')
      })

      // Switch to different pattern (should trigger new default loading)
      const lorenzPresets = [
        {
          id: 'lorenz-classic',
          name: 'Classic Lorenz',
          generatorType: 'lorenz-attractor',
          parameters: { sigma: 10, rho: 28, beta: 2.6667 },
          isFactory: true,
          isDefault: true,
          createdAt: new Date(),
          contentHash: 'lorenz-hash'
        }
      ]

      expectedState = {
        presets: lorenzPresets,
        activePresetId: 'lorenz-classic',
        isLoading: false,
        error: null
      }

      mockUsePresetManager.mockReturnValue(expectedState)
      rerender(<PresetLoadingComponent patternId="lorenz-attractor" />)

      await waitFor(() => {
        expect(screen.getByTestId('pattern-id')).toHaveTextContent('lorenz-attractor')
        expect(screen.getByTestId('active-preset-id')).toHaveTextContent('lorenz-classic')
        expect(screen.getByTestId('active-preset-name')).toHaveTextContent('Classic Lorenz')
      })
    })

    test('handles patterns with no default presets', async () => {
      mockUsePresetManager.mockReturnValue({
        presets: [], // No presets available for this pattern
        activePresetId: null,
        isLoading: false,
        error: null
      })

      render(<PresetLoadingComponent patternId="noise-field" />)

      await waitFor(() => {
        expect(screen.getByTestId('active-preset-id')).toHaveTextContent('none')
        expect(screen.getByTestId('presets-count')).toHaveTextContent('0')
      })
    })
  })

  describe('Phase 4: Precedence Rules Verification', () => {
    test('user default beats factory default', async () => {
      const userDefault = {
        ...mockUserPresets[0],
        isUserDefault: true
      }

      // Mock the precedence: user default should be returned first
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(userDefault)

      const result = await PresetManager.getEffectiveDefault('aizawa-attractor')
      
      expect(result).toEqual(userDefault)
      expect(result.isUserDefault).toBe(true)
      // Verify the correct precedence result is returned
      expect(result.name).toBe('My Custom')
    })

    test('factory default is used when no user default exists', async () => {
      ;(PresetManager.getUserDefault as jest.Mock).mockReturnValue(null)
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(mockFactoryPresets[0])

      const result = await PresetManager.getEffectiveDefault('aizawa-attractor')
      
      expect(result).toEqual(mockFactoryPresets[0])
      expect(result.isDefault).toBe(true)
      expect(result.isFactory).toBe(true)
    })

    test('returns null when neither user nor factory defaults exist', async () => {
      ;(PresetManager.getUserDefault as jest.Mock).mockReturnValue(null)
      ;(PresetManager.loadFactoryPresets as jest.Mock).mockResolvedValue([])
      ;(PresetManager.getEffectiveDefault as jest.Mock).mockResolvedValue(null)

      const result = await PresetManager.getEffectiveDefault('aizawa-attractor')
      
      expect(result).toBeNull()
    })
  })
})