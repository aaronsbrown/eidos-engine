// AIDEV-NOTE: Behavioral tests for cross-component preset synchronization
import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { usePresetManager } from './use-preset-manager'
import { PatternControl } from '@/components/pattern-generators/types'

// Mock fetch API for factory preset loading
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: false,
    status: 404,
    json: () => Promise.reject(new Error('Not found'))
  })
) as jest.Mock

// Mock the preset manager utilities
jest.mock('../preset-manager', () => ({
  PresetManager: {
    getPresetsForGenerator: jest.fn(),
    getLastActivePreset: jest.fn(),
    createPreset: jest.fn(),
    addPreset: jest.fn(),
    setLastActivePreset: jest.fn(),
    deletePreset: jest.fn(),
    updatePreset: jest.fn(),
    validatePresetParameters: jest.fn(),
    exportPresets: jest.fn(),
    importPresets: jest.fn(),
    ensureFactoryPresetsLoaded: jest.fn()
  }
}))

// Test component that uses the hook
function TestComponent({ patternId, onPresetsChange }: { 
  patternId: string
  onPresetsChange?: (presets: unknown[]) => void 
}) {
  const [controlValues, setControlValues] = React.useState({ pixelSize: 10 })
  
  const { 
    presets, 
    savePreset, 
    deletePreset, 
    renamePreset 
  } = usePresetManager({
    patternId,
    controlValues,
    onControlValuesChange: setControlValues,
    patternControls: [
      { id: 'pixelSize', type: 'range', min: 1, max: 20, defaultValue: 8, label: 'Pixel Size' }
    ] as PatternControl[]
  })

  React.useEffect(() => {
    if (onPresetsChange) {
      onPresetsChange(presets)
    }
  }, [presets, onPresetsChange])

  return (
    <div data-testid={`component-${patternId}`}>
      <div data-testid="preset-count">{presets.length}</div>
      <button onClick={() => savePreset('Test Preset')}>Save Preset</button>
      <button onClick={() => deletePreset('preset-1')}>Delete Preset</button>
      <button onClick={() => renamePreset('preset-1', 'Renamed Preset')}>Rename Preset</button>
      {presets.map(preset => (
        <div key={preset.id} data-testid={`preset-${preset.id}`}>
          {preset.name}
        </div>
      ))}
    </div>
  )
}

describe('usePresetManager Cross-Component Synchronization', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mockPresetManager = require('../preset-manager').PresetManager

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Default mock implementations
    mockPresetManager.getPresetsForGenerator.mockReturnValue([])
    mockPresetManager.getLastActivePreset.mockReturnValue(null)
    mockPresetManager.createPreset.mockReturnValue({
      id: 'new-preset-id',
      name: 'Test Preset',
      patternId: 'test-pattern',
      parameters: { pixelSize: 10 },
      createdAt: new Date().toISOString()
    })
    mockPresetManager.addPreset.mockReturnValue(true)
    mockPresetManager.deletePreset.mockReturnValue(true)
    mockPresetManager.updatePreset.mockReturnValue(true)
    mockPresetManager.setLastActivePreset.mockImplementation(() => {})
    mockPresetManager.validatePresetParameters.mockReturnValue({ valid: true, warnings: [] })
    mockPresetManager.exportPresets.mockReturnValue({})
    mockPresetManager.importPresets.mockReturnValue({ importedIds: [], skippedDuplicates: [], errors: [] })
    mockPresetManager.ensureFactoryPresetsLoaded.mockResolvedValue()
  })

  describe('Storage Event Synchronization', () => {
    test('components sync when localStorage changes externally', async () => {
      const presets1: unknown[] = []
      const presets2: unknown[] = []
      
      const onPresetsChange1 = jest.fn((presets) => {
        presets1.length = 0
        presets1.push(...presets)
      })
      const onPresetsChange2 = jest.fn((presets) => {
        presets2.length = 0
        presets2.push(...presets)
      })

      // Render two components using the same pattern
      render(
        <div>
          <TestComponent patternId="test-pattern" onPresetsChange={onPresetsChange1} />
          <TestComponent patternId="test-pattern" onPresetsChange={onPresetsChange2} />
        </div>
      )

      // Simulate external localStorage change
      const newPresets = [
        { id: 'preset-1', name: 'External Preset', patternId: 'test-pattern' }
      ]
      
      mockPresetManager.getPresetsForGenerator.mockReturnValue(newPresets)

      // Simulate storage event
      const storageEvent = new StorageEvent('storage', {
        key: 'pattern-presets',
        oldValue: '[]',
        newValue: JSON.stringify(newPresets)
      })
      
      await act(async () => {
        window.dispatchEvent(storageEvent)
      })

      await waitFor(() => {
        expect(onPresetsChange1).toHaveBeenCalledWith(newPresets)
        expect(onPresetsChange2).toHaveBeenCalledWith(newPresets)
      })
    })

    test('components ignore irrelevant storage events', async () => {
      const onPresetsChange = jest.fn()

      render(<TestComponent patternId="test-pattern" onPresetsChange={onPresetsChange} />)

      // Clear initial calls
      onPresetsChange.mockClear()
      mockPresetManager.getPresetsForGenerator.mockClear()

      // Simulate unrelated storage event
      const storageEvent = new StorageEvent('storage', {
        key: 'other-key',
        oldValue: 'old',
        newValue: 'new'
      })
      
      await act(async () => {
        window.dispatchEvent(storageEvent)
        // Wait for any async operations
        await new Promise(resolve => setTimeout(resolve, 50))
      })

      // Should not trigger preset refresh for unrelated storage keys
      expect(mockPresetManager.getPresetsForGenerator).not.toHaveBeenCalledWith('test-pattern')
    })
  })

  describe('Custom Event Synchronization', () => {
    test('components sync when preset-updated event is dispatched', async () => {
      const presets1: unknown[] = []
      const presets2: unknown[] = []
      
      const onPresetsChange1 = jest.fn((presets) => {
        presets1.length = 0
        presets1.push(...presets)
      })
      const onPresetsChange2 = jest.fn((presets) => {
        presets2.length = 0
        presets2.push(...presets)
      })

      render(
        <div>
          <TestComponent patternId="test-pattern" onPresetsChange={onPresetsChange1} />
          <TestComponent patternId="test-pattern" onPresetsChange={onPresetsChange2} />
        </div>
      )

      // Clear initial calls
      onPresetsChange1.mockClear()
      onPresetsChange2.mockClear()

      // Update mock to return new presets
      const newPresets = [
        { id: 'preset-1', name: 'Updated Preset', patternId: 'test-pattern' }
      ]
      mockPresetManager.getPresetsForGenerator.mockReturnValue(newPresets)

      // Dispatch custom event
      await act(async () => {
        window.dispatchEvent(new CustomEvent('preset-updated'))
      })

      await waitFor(() => {
        expect(onPresetsChange1).toHaveBeenCalledWith(newPresets)
        expect(onPresetsChange2).toHaveBeenCalledWith(newPresets)
      })
    })

    test('save operation triggers synchronization across components', async () => {
      const onPresetsChange1 = jest.fn()
      const onPresetsChange2 = jest.fn()

      render(
        <div>
          <TestComponent patternId="test-pattern" onPresetsChange={onPresetsChange1} />
          <TestComponent patternId="test-pattern" onPresetsChange={onPresetsChange2} />
        </div>
      )

      // Clear initial calls
      onPresetsChange1.mockClear()
      onPresetsChange2.mockClear()

      // Mock successful save and update presets list
      const savedPreset = {
        id: 'new-preset-id',
        name: 'Test Preset',
        patternId: 'test-pattern',
        parameters: { pixelSize: 10 },
        createdAt: new Date().toISOString()
      }

      mockPresetManager.addPreset.mockReturnValue(true)
      // Update the preset list to include the new preset after save
      mockPresetManager.getPresetsForGenerator.mockReturnValue([savedPreset])

      // Click save button in first component
      const saveButton = screen.getAllByText('Save Preset')[0]
      
      await act(async () => {
        fireEvent.click(saveButton)
        // Wait for the async save operation
        await new Promise(resolve => setTimeout(resolve, 10))
      })

      // Should dispatch custom event and sync both components
      await waitFor(() => {
        expect(onPresetsChange1).toHaveBeenCalledWith([savedPreset])
        expect(onPresetsChange2).toHaveBeenCalledWith([savedPreset])
      })
    })

    test('delete operation triggers synchronization across components', async () => {
      const initialPresets = [
        { id: 'preset-1', name: 'To Delete', patternId: 'test-pattern' }
      ]
      
      mockPresetManager.getPresetsForGenerator.mockReturnValue(initialPresets)

      const onPresetsChange1 = jest.fn()
      const onPresetsChange2 = jest.fn()

      render(
        <div>
          <TestComponent patternId="test-pattern" onPresetsChange={onPresetsChange1} />
          <TestComponent patternId="test-pattern" onPresetsChange={onPresetsChange2} />
        </div>
      )

      // Clear initial calls and update mock for after deletion
      onPresetsChange1.mockClear()
      onPresetsChange2.mockClear()
      mockPresetManager.getPresetsForGenerator.mockReturnValue([])

      // Click delete button in first component
      const deleteButton = screen.getAllByText('Delete Preset')[0]
      
      await act(async () => {
        fireEvent.click(deleteButton)
        // Wait for the async delete operation
        await new Promise(resolve => setTimeout(resolve, 10))
      })

      // Should dispatch custom event and sync both components
      await waitFor(() => {
        expect(onPresetsChange1).toHaveBeenCalledWith([])
        expect(onPresetsChange2).toHaveBeenCalledWith([])
      })
    })

    test('rename operation triggers synchronization across components', async () => {
      const initialPresets = [
        { id: 'preset-1', name: 'Original Name', patternId: 'test-pattern' }
      ]
      
      const renamedPresets = [
        { id: 'preset-1', name: 'Renamed Preset', patternId: 'test-pattern' }
      ]

      mockPresetManager.getPresetsForGenerator.mockReturnValue(initialPresets)

      const onPresetsChange1 = jest.fn()
      const onPresetsChange2 = jest.fn()

      render(
        <div>
          <TestComponent patternId="test-pattern" onPresetsChange={onPresetsChange1} />
          <TestComponent patternId="test-pattern" onPresetsChange={onPresetsChange2} />
        </div>
      )

      // Clear initial calls and update mock for after rename
      onPresetsChange1.mockClear()
      onPresetsChange2.mockClear()
      mockPresetManager.getPresetsForGenerator.mockReturnValue(renamedPresets)

      // Click rename button in first component
      const renameButton = screen.getAllByText('Rename Preset')[0]
      
      await act(async () => {
        fireEvent.click(renameButton)
        // Wait for the async rename operation
        await new Promise(resolve => setTimeout(resolve, 10))
      })

      // Should dispatch custom event and sync both components
      await waitFor(() => {
        expect(onPresetsChange1).toHaveBeenCalledWith(renamedPresets)
        expect(onPresetsChange2).toHaveBeenCalledWith(renamedPresets)
      })
    })
  })

  describe('Pattern-Specific Synchronization', () => {
    test('components with different patterns do not cross-sync', async () => {
      const pattern1Presets = [
        { id: 'preset-1', name: 'Pattern 1 Preset', patternId: 'pattern-1' }
      ]
      
      const pattern2Presets = [
        { id: 'preset-2', name: 'Pattern 2 Preset', patternId: 'pattern-2' }
      ]

      // Mock different responses for different patterns
      mockPresetManager.getPresetsForGenerator
        .mockImplementation((patternId: string) => {
          if (patternId === 'pattern-1') return pattern1Presets
          if (patternId === 'pattern-2') return pattern2Presets
          return []
        })

      const presets1Calls: unknown[] = []
      const presets2Calls: unknown[] = []
      
      const onPresetsChange1 = jest.fn((presets) => {
        presets1Calls.push(presets)
      })
      const onPresetsChange2 = jest.fn((presets) => {
        presets2Calls.push(presets)
      })

      render(
        <div>
          <TestComponent patternId="pattern-1" onPresetsChange={onPresetsChange1} />
          <TestComponent patternId="pattern-2" onPresetsChange={onPresetsChange2} />
        </div>
      )

      // Each should get its own presets initially
      await waitFor(() => {
        expect(onPresetsChange1).toHaveBeenCalledWith(pattern1Presets)
        expect(onPresetsChange2).toHaveBeenCalledWith(pattern2Presets)
      })

      // Clear mock calls to test the event behavior
      mockPresetManager.getPresetsForGenerator.mockClear()

      // Dispatch preset-updated event
      await act(async () => {
        window.dispatchEvent(new CustomEvent('preset-updated'))
      })

      // Both should refresh, calling the getPresetsForGenerator with their respective patterns
      await waitFor(() => {
        expect(mockPresetManager.getPresetsForGenerator).toHaveBeenCalledWith('pattern-1')
        expect(mockPresetManager.getPresetsForGenerator).toHaveBeenCalledWith('pattern-2')
        // Verify that each pattern gets its own presets, not cross-pollination
        expect(mockPresetManager.getPresetsForGenerator).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Event Cleanup', () => {
    test('removes event listeners when component unmounts', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

      const { unmount } = render(<TestComponent patternId="test-pattern" />)

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('preset-updated', expect.any(Function))

      removeEventListenerSpy.mockRestore()
    })
  })
})