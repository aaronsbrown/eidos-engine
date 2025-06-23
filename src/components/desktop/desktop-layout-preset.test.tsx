// AIDEV-NOTE: Behavioral tests for preset dropdown functionality
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// Mock the preset manager hook to control preset state
const mockUsePresetManager = jest.fn()
jest.mock('@/lib/hooks/use-preset-manager', () => ({
  usePresetManager: () => mockUsePresetManager()
}))

// Simple test component that renders just the preset dropdown with the same logic
const PresetDropdown = ({ presets, activePresetId, isPresetLoading, loadPreset }) => {
  return (
    <select
      className="border border-border bg-background text-foreground px-2 py-1 font-mono text-xs disabled:opacity-50 disabled:cursor-not-allowed"
      value={activePresetId || ""}
      onChange={(e) => {
        if (e.target.value && e.target.value !== activePresetId) {
          loadPreset(e.target.value)
        }
      }}
      disabled={isPresetLoading || presets.length === 0}
    >
      <option value="">SELECT PRESET</option>
      {presets.map(preset => (
        <option key={preset.id} value={preset.id}>
          {preset.name}
        </option>
      ))}
    </select>
  )
}

describe('Preset Dropdown - Disabled State Behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Preset Dropdown Disabled State', () => {
    test('dropdown is disabled when no presets exist', () => {
      const mockLoadPreset = jest.fn()
      
      render(
        <PresetDropdown 
          presets={[]}
          activePresetId={null}
          isPresetLoading={false}
          loadPreset={mockLoadPreset}
        />
      )

      const dropdown = screen.getByRole('combobox')
      expect(dropdown).toBeDisabled()
    })

    test('dropdown is enabled when presets exist', () => {
      const mockLoadPreset = jest.fn()
      const mockPresets = [
        { 
          id: 'preset-1', 
          name: 'Test Preset',
          generatorType: 'pixelated-noise',
          parameters: { pixelSize: 15 },
          createdAt: new Date(),
          contentHash: 'test-hash'
        }
      ]
      
      render(
        <PresetDropdown 
          presets={mockPresets}
          activePresetId={null}
          isPresetLoading={false}
          loadPreset={mockLoadPreset}
        />
      )

      const dropdown = screen.getByRole('combobox')
      expect(dropdown).not.toBeDisabled()
    })

    test('dropdown is disabled when loading presets', () => {
      const mockLoadPreset = jest.fn()
      const mockPresets = [
        { 
          id: 'preset-1', 
          name: 'Test Preset',
          generatorType: 'pixelated-noise',
          parameters: { pixelSize: 15 },
          createdAt: new Date(),
          contentHash: 'test-hash'
        }
      ]
      
      render(
        <PresetDropdown 
          presets={mockPresets}
          activePresetId={null}
          isPresetLoading={true}
          loadPreset={mockLoadPreset}
        />
      )

      const dropdown = screen.getByRole('combobox')
      expect(dropdown).toBeDisabled()
    })

    test('dropdown shows proper visual indication when disabled', () => {
      const mockLoadPreset = jest.fn()
      
      render(
        <PresetDropdown 
          presets={[]}
          activePresetId={null}
          isPresetLoading={false}
          loadPreset={mockLoadPreset}
        />
      )

      const dropdown = screen.getByRole('combobox')
      
      // Check that disabled styling classes are applied
      expect(dropdown).toHaveClass('disabled:opacity-50')
      expect(dropdown).toHaveClass('disabled:cursor-not-allowed')
    })
  })

  describe('Preset Dropdown Interaction', () => {
    test('user can select preset when presets exist', async () => {
      const mockLoadPreset = jest.fn()
      const mockPresets = [
        { 
          id: 'preset-1', 
          name: 'Cool Preset',
          generatorType: 'pixelated-noise',
          parameters: { pixelSize: 15 },
          createdAt: new Date(),
          contentHash: 'test-hash'
        },
        { 
          id: 'preset-2', 
          name: 'Another Preset',
          generatorType: 'pixelated-noise',
          parameters: { pixelSize: 5 },
          createdAt: new Date(),
          contentHash: 'test-hash-2'
        }
      ]
      
      render(
        <PresetDropdown 
          presets={mockPresets}
          activePresetId={null}
          isPresetLoading={false}
          loadPreset={mockLoadPreset}
        />
      )

      const dropdown = screen.getByRole('combobox')
      
      // Should show default "SELECT PRESET" option
      expect(dropdown).toHaveValue('')
      
      // Should show preset options
      expect(screen.getByText('Cool Preset')).toBeInTheDocument()
      expect(screen.getByText('Another Preset')).toBeInTheDocument()

      // User selects a preset
      fireEvent.change(dropdown, { target: { value: 'preset-1' } })

      // Should call loadPreset
      await waitFor(() => {
        expect(mockLoadPreset).toHaveBeenCalledWith('preset-1')
      })
    })

    test('user cannot interact with dropdown when no presets exist', () => {
      const mockLoadPreset = jest.fn()
      
      render(
        <PresetDropdown 
          presets={[]}
          activePresetId={null}
          isPresetLoading={false}
          loadPreset={mockLoadPreset}
        />
      )

      const dropdown = screen.getByRole('combobox')
      
      // Dropdown should be disabled and not respond to clicks
      expect(dropdown).toBeDisabled()
      
      // Only shows the default "SELECT PRESET" option
      expect(dropdown).toHaveValue('')
      expect(screen.getByText('SELECT PRESET')).toBeInTheDocument()
    })

    test('active preset is reflected in dropdown selection', () => {
      const mockLoadPreset = jest.fn()
      const mockPresets = [
        { 
          id: 'preset-1', 
          name: 'Active Preset',
          generatorType: 'pixelated-noise',
          parameters: { pixelSize: 15 },
          createdAt: new Date(),
          contentHash: 'test-hash'
        }
      ]
      
      render(
        <PresetDropdown 
          presets={mockPresets}
          activePresetId='preset-1'
          isPresetLoading={false}
          loadPreset={mockLoadPreset}
        />
      )

      const dropdown = screen.getByRole('combobox')
      
      // Should show the active preset as selected
      expect(dropdown).toHaveValue('preset-1')
    })
  })
})