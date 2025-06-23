// AIDEV-NOTE: Behavioral tests for preset hook - test user interactions and state management
import { renderHook, act } from '@testing-library/react'
import { usePresetManager } from './use-preset-manager'
import { PresetManager } from '../preset-manager'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('usePresetManager - User Interaction Behaviors', () => {
  const mockPatternControls = [
    { id: 'pixelSize', type: 'range', min: 1, max: 20, defaultValue: 8 },
    { id: 'colorIntensity', type: 'range', min: 0, max: 1, defaultValue: 0.5 },
    { id: 'enabled', type: 'checkbox', defaultValue: true }
  ]

  const defaultProps = {
    patternId: 'pixelated-noise',
    controlValues: { pixelSize: 10, colorIntensity: 0.7, enabled: true },
    onControlValuesChange: jest.fn(),
    patternControls: mockPatternControls
  }

  beforeEach(() => {
    localStorageMock.clear()
    jest.clearAllMocks()
  })

  describe('Save Preset User Flow', () => {
    test('user saves preset with valid name - success flow', async () => {
      const { result } = renderHook(() => usePresetManager(defaultProps))

      await act(async () => {
        const success = await result.current.savePreset('My Cool Preset')
        expect(success).toBe(true)
      })

      expect(result.current.presets).toHaveLength(1)
      expect(result.current.presets[0].name).toBe('My Cool Preset')
      expect(result.current.activePresetId).toBe(result.current.presets[0].id)
      expect(result.current.error).toBeNull()
    })

    test('user saves preset with empty name - error flow', async () => {
      const { result } = renderHook(() => usePresetManager(defaultProps))

      await act(async () => {
        const success = await result.current.savePreset('')
        expect(success).toBe(false)
      })

      expect(result.current.presets).toHaveLength(0)
      expect(result.current.error).toBe('Preset name cannot be empty')
    })

    test('user saves preset with duplicate name - error with helpful message', async () => {
      const { result } = renderHook(() => usePresetManager(defaultProps))

      // Save first preset
      await act(async () => {
        await result.current.savePreset('Duplicate Name')
      })

      // Try to save second with same name
      await act(async () => {
        const success = await result.current.savePreset('Duplicate Name')
        expect(success).toBe(false)
      })

      expect(result.current.presets).toHaveLength(1)
      expect(result.current.error).toContain('already exists')
    })

    test('user saves preset and it becomes active immediately', async () => {
      const { result } = renderHook(() => usePresetManager(defaultProps))

      await act(async () => {
        await result.current.savePreset('Active Test')
      })

      expect(result.current.activePresetId).toBe(result.current.presets[0].id)
    })
  })

  describe('Load Preset User Flow', () => {
    test('user loads preset and parameters update immediately', async () => {
      const onControlValuesChange = jest.fn()
      const { result } = renderHook(() => 
        usePresetManager({ ...defaultProps, onControlValuesChange })
      )

      // Save a preset first
      await act(async () => {
        await result.current.savePreset('Test Preset')
      })

      const presetId = result.current.presets[0].id

      // Change current values
      const newProps = {
        ...defaultProps,
        controlValues: { pixelSize: 5, colorIntensity: 0.3, enabled: false },
        onControlValuesChange
      }
      
      const { result: result2 } = renderHook(() => usePresetManager(newProps))

      // Load the preset
      await act(async () => {
        const success = await result2.current.loadPreset(presetId)
        expect(success).toBe(true)
      })

      // Check that onControlValuesChange was called with preset values
      expect(onControlValuesChange).toHaveBeenCalledWith({
        pixelSize: 10,
        colorIntensity: 0.7,
        enabled: true
      })

      expect(result2.current.activePresetId).toBe(presetId)
    })

    test('user loads non-existent preset - error flow', async () => {
      const { result } = renderHook(() => usePresetManager(defaultProps))

      await act(async () => {
        const success = await result.current.loadPreset('fake-id')
        expect(success).toBe(false)
      })

      expect(result.current.error).toBe('Preset not found')
    })

    test('user loads preset with missing parameters - graceful handling', async () => {
      // Create preset with extra parameter not in current controls
      const preset = PresetManager.createPreset(
        'Legacy Preset',
        'pixelated-noise',
        { pixelSize: 8, colorIntensity: 0.5, oldParam: 123 } // oldParam no longer exists
      )
      PresetManager.addPreset(preset)

      const onControlValuesChange = jest.fn()
      const { result } = renderHook(() => 
        usePresetManager({ ...defaultProps, onControlValuesChange })
      )

      const presets = result.current.presets
      expect(presets).toHaveLength(1)

      await act(async () => {
        await result.current.loadPreset(presets[0].id)
      })

      // Should only pass valid parameters (oldParam filtered out)
      expect(onControlValuesChange).toHaveBeenCalledWith({
        pixelSize: 8,
        colorIntensity: 0.5
        // oldParam should be filtered out
      })
    })
  })

  describe('Delete Preset User Flow', () => {
    test('user deletes preset and it disappears from list', async () => {
      const { result } = renderHook(() => usePresetManager(defaultProps))

      // Save preset first
      await act(async () => {
        await result.current.savePreset('To Delete')
      })

      expect(result.current.presets).toHaveLength(1)
      const presetId = result.current.presets[0].id

      // Delete it
      await act(async () => {
        const success = await result.current.deletePreset(presetId)
        expect(success).toBe(true)
      })

      expect(result.current.presets).toHaveLength(0)
      expect(result.current.activePresetId).toBeNull()
    })

    test('user deletes active preset - active state clears', async () => {
      const { result } = renderHook(() => usePresetManager(defaultProps))

      await act(async () => {
        await result.current.savePreset('Active Preset')
      })

      const presetId = result.current.presets[0].id
      expect(result.current.activePresetId).toBe(presetId)

      await act(async () => {
        await result.current.deletePreset(presetId)
      })

      expect(result.current.activePresetId).toBeNull()
    })

    test('user deletes non-existent preset - error handling', async () => {
      const { result } = renderHook(() => usePresetManager(defaultProps))

      await act(async () => {
        const success = await result.current.deletePreset('fake-id')
        expect(success).toBe(false)
      })

      expect(result.current.error).toBe('Failed to delete preset')
    })
  })

  describe('Import Preset User Flow', () => {
    test('user imports valid JSON - preset becomes active immediately', async () => {
      const onControlValuesChange = jest.fn()
      const { result } = renderHook(() => 
        usePresetManager({ ...defaultProps, onControlValuesChange })
      )

      const validJSON = JSON.stringify({
        version: '1.0.0',
        presets: [{
          id: 'import-test',
          name: 'Imported Preset',
          generatorType: 'pixelated-noise',
          parameters: { pixelSize: 15, colorIntensity: 0.9, enabled: false },
          createdAt: new Date(),
          contentHash: 'test-hash'
        }],
        exportedAt: new Date()
      })

      await act(async () => {
        const success = await result.current.importPreset(validJSON)
        expect(success).toBe(true)
      })

      expect(result.current.presets).toHaveLength(1)
      expect(result.current.presets[0].name).toBe('Imported Preset')
      
      // Should be immediately active
      expect(result.current.activePresetId).toBe(result.current.presets[0].id)
      
      // Should update parameters immediately
      expect(onControlValuesChange).toHaveBeenCalledWith({
        pixelSize: 15,
        colorIntensity: 0.9,
        enabled: false
      })
    })

    test('user imports invalid JSON - error with helpful message', async () => {
      const { result } = renderHook(() => usePresetManager(defaultProps))

      await act(async () => {
        const success = await result.current.importPreset('invalid json')
        expect(success).toBe(false)
      })

      expect(result.current.error).toMatch(/Failed to import preset|not valid JSON/)
      expect(result.current.presets).toHaveLength(0)
    })

    test('user imports duplicate content - helpful feedback about skipping', async () => {
      const { result } = renderHook(() => usePresetManager(defaultProps))

      // Save existing preset
      await act(async () => {
        await result.current.savePreset('Original')
      })

      const existingPreset = result.current.presets[0]

      // Try to import identical content
      const duplicateJSON = JSON.stringify({
        version: '1.0.0',
        presets: [{
          id: 'duplicate-test',
          name: 'Different Name',
          generatorType: 'pixelated-noise',
          parameters: existingPreset.parameters,
          createdAt: new Date(),
          contentHash: existingPreset.contentHash
        }],
        exportedAt: new Date()
      })

      await act(async () => {
        const success = await result.current.importPreset(duplicateJSON)
        expect(success).toBe(false)
      })

      expect(result.current.presets).toHaveLength(1) // Still just original
      expect(result.current.error).toContain('All presets already exist')
    })

    test('user imports from empty state - import button always works', async () => {
      const { result } = renderHook(() => usePresetManager(defaultProps))

      // Verify starting empty
      expect(result.current.presets).toHaveLength(0)

      const validJSON = JSON.stringify({
        version: '1.0.0',
        presets: [{
          id: 'first-import',
          name: 'First Preset',
          generatorType: 'pixelated-noise',
          parameters: { pixelSize: 12 },
          createdAt: new Date(),
          contentHash: 'first-hash'
        }],
        exportedAt: new Date()
      })

      await act(async () => {
        const success = await result.current.importPreset(validJSON)
        expect(success).toBe(true)
      })

      expect(result.current.presets).toHaveLength(1)
      expect(result.current.presets[0].name).toBe('First Preset')
    })
  })

  describe('Export Preset User Flow', () => {
    test('user exports preset and gets valid JSON', async () => {
      const { result } = renderHook(() => usePresetManager(defaultProps))

      await act(async () => {
        await result.current.savePreset('Export Test')
      })

      const presetId = result.current.presets[0].id
      const exportedJSON = result.current.exportPreset(presetId)

      expect(() => JSON.parse(exportedJSON)).not.toThrow()
      
      const parsed = JSON.parse(exportedJSON)
      expect(parsed.version).toBe('1.0.0')
      expect(parsed.presets).toHaveLength(1)
      expect(parsed.presets[0].name).toBe('Export Test')
    })

    test('user exports non-existent preset - error handling', async () => {
      const { result } = renderHook(() => usePresetManager(defaultProps))

      expect(() => result.current.exportPreset('fake-id')).toThrow('Preset not found')
    })
  })

  describe('Error Handling User Flow', () => {
    test('user can dismiss error messages', async () => {
      const { result } = renderHook(() => usePresetManager(defaultProps))

      // Trigger an error
      await act(async () => {
        await result.current.savePreset('')
      })

      expect(result.current.error).toBeTruthy()

      // Clear the error
      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })

    test('loading state is managed correctly', async () => {
      const { result } = renderHook(() => usePresetManager(defaultProps))

      // Initially not loading
      expect(result.current.isLoading).toBe(false)

      // After save completes, should not be loading
      await act(async () => {
        await result.current.savePreset('Test')
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.presets).toHaveLength(1)
    })
  })

  describe('Pattern Switching Behavior', () => {
    test('presets refresh when pattern changes', async () => {
      const { result, rerender } = renderHook(
        (props) => usePresetManager(props),
        { initialProps: defaultProps }
      )

      // Save preset for pixelated-noise
      await act(async () => {
        await result.current.savePreset('Noise Preset')
      })

      expect(result.current.presets).toHaveLength(1)

      // Switch to different pattern
      rerender({
        ...defaultProps,
        patternId: 'brownian-motion',
        controlValues: { particleCount: 100 }
      })

      // Should have no presets for new pattern
      expect(result.current.presets).toHaveLength(0)
    })

    test('active preset clears when switching patterns', async () => {
      const { result, rerender } = renderHook(
        (props) => usePresetManager(props),
        { initialProps: defaultProps }
      )

      await act(async () => {
        await result.current.savePreset('Active Preset')
      })

      expect(result.current.activePresetId).toBeTruthy()

      // Switch patterns
      rerender({
        ...defaultProps,
        patternId: 'brownian-motion'
      })

      expect(result.current.activePresetId).toBeNull()
    })
  })
})