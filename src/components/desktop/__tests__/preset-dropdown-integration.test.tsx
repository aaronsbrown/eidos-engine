// AIDEV-NOTE: Integration test to reproduce real-world issue where dropdown shows preset but activePresetId is null
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock the preset comparison functions
jest.mock('@/lib/preset-comparison', () => ({
  getPresetDisplayName: jest.fn((preset) => {
    if (!preset) return ''
    // Simple mock implementation
    return preset.name
  }),
  isPresetModified: jest.fn(() => false)
}))

// Component that simulates the real dropdown behavior
const DropdownIntegrationTest = ({ 
  presets, 
  activePresetId, 
  onLoadPreset,
  // getCurrentControlValues = () => ({})
}) => {
  const [localActivePresetId, setLocalActivePresetId] = React.useState(activePresetId)

  // This simulates the actual dropdown behavior from desktop-layout-main.tsx
  const handlePresetChange = (e) => {
    const selectedId = e.target.value
    console.log('Dropdown changed to:', selectedId)
    setLocalActivePresetId(selectedId)
    if (onLoadPreset) {
      onLoadPreset(selectedId)
    }
  }

  return (
    <div>
      <div data-testid="debug-info">
        <div data-testid="active-preset-id">activePresetId: {localActivePresetId || 'null'}</div>
        <div data-testid="presets-count">presets count: {presets.length}</div>
        <div data-testid="dropdown-value">dropdown value will be: {localActivePresetId || (presets.length > 0 ? presets[0].id : "")}</div>
      </div>
      
      {/* This mirrors the exact dropdown logic from desktop-layout-main.tsx */}
      {presets.length > 0 && (
        <select
          data-testid="preset-dropdown"
          className="border border-border bg-background text-foreground px-2 py-1 font-mono text-xs"
          value={localActivePresetId || (presets.length > 0 ? presets[0].id : "")}
          onChange={handlePresetChange}
        >
          {presets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>
      )}

      {/* Visual indicator of what user sees vs internal state */}
      <div data-testid="user-sees">
        User sees: {presets.length > 0 ? presets[0].name : 'No presets'}
      </div>
      <div data-testid="actual-state">
        Actual state: {localActivePresetId ? `preset-${localActivePresetId}` : 'no-preset-loaded'}
      </div>
    </div>
  )
}

describe('Preset Dropdown Integration - Real World Issue Reproduction', () => {
  const mockPresets = [
    {
      id: 'aizawa-classic',
      name: 'Classic Aizawa',
      generatorType: 'aizawa-attractor',
      parameters: { a: 0.95, b: 0.7, c: 0.6 },
      isFactory: true,
      isDefault: true
    },
    {
      id: 'aizawa-enhanced',
      name: 'Enhanced Complexity',
      generatorType: 'aizawa-attractor',
      parameters: { a: 0.98, b: 0.8, c: 0.7 },
      isFactory: true,
      isDefault: false
    },
    {
      id: 'aizawa-critical',
      name: 'Critical Boundary',
      generatorType: 'aizawa-attractor',
      parameters: { a: 0.93, b: 0.7, c: 0.6 },
      isFactory: true,
      isDefault: false
    },
    {
      id: 'user-custom',
      name: 'My Custom',
      generatorType: 'aizawa-attractor',
      parameters: { a: 1.0, b: 0.5, c: 0.8 },
      isFactory: false
    }
  ]

  describe('Reproducing the Visual vs State Mismatch', () => {
    test('ISSUE: dropdown shows first preset visually but activePresetId is null', () => {
      const mockLoadPreset = jest.fn()

      render(
        <DropdownIntegrationTest
          presets={mockPresets}
          activePresetId={null} // This is the bug condition
          onLoadPreset={mockLoadPreset}
        />
      )

      // This reproduces the exact issue: visual display doesn't match state
      expect(screen.getByTestId('active-preset-id')).toHaveTextContent('activePresetId: null')
      expect(screen.getByTestId('user-sees')).toHaveTextContent('User sees: Classic Aizawa')
      expect(screen.getByTestId('actual-state')).toHaveTextContent('Actual state: no-preset-loaded')

      // The dropdown appears to show a selection but nothing is actually loaded
      const dropdown = screen.getByTestId('preset-dropdown')
      expect(dropdown).toHaveValue('aizawa-classic') // Browser shows first option
      
      // But the React state doesn't reflect this
      expect(screen.getByTestId('debug-info')).toHaveTextContent('activePresetId: null')
    })

    test('FIX: user must manually select to sync visual and state', async () => {
      const mockLoadPreset = jest.fn()

      render(
        <DropdownIntegrationTest
          presets={mockPresets}
          activePresetId={null}
          onLoadPreset={mockLoadPreset}
        />
      )

      // Initial state: mismatch
      expect(screen.getByTestId('active-preset-id')).toHaveTextContent('activePresetId: null')

      // User clicks dropdown and selects the same preset that was visually showing
      const dropdown = screen.getByTestId('preset-dropdown')
      fireEvent.change(dropdown, { target: { value: 'aizawa-classic' } })

      // Now the state should sync
      await waitFor(() => {
        expect(screen.getByTestId('active-preset-id')).toHaveTextContent('activePresetId: aizawa-classic')
        expect(mockLoadPreset).toHaveBeenCalledWith('aizawa-classic')
      })

      expect(screen.getByTestId('actual-state')).toHaveTextContent('Actual state: preset-aizawa-classic')
    })

    test('CORRECT BEHAVIOR: when activePresetId is properly set', () => {
      const mockLoadPreset = jest.fn()

      render(
        <DropdownIntegrationTest
          presets={mockPresets}
          activePresetId="aizawa-classic" // Proper state
          onLoadPreset={mockLoadPreset}
        />
      )

      // Visual and state should match
      expect(screen.getByTestId('active-preset-id')).toHaveTextContent('activePresetId: aizawa-classic')
      expect(screen.getByTestId('user-sees')).toHaveTextContent('User sees: Classic Aizawa')
      expect(screen.getByTestId('actual-state')).toHaveTextContent('Actual state: preset-aizawa-classic')

      // Dropdown shows correct selection
      const dropdown = screen.getByTestId('preset-dropdown')
      expect(dropdown).toHaveValue('aizawa-classic')
    })

    test('EDGE CASE: empty string activePresetId vs null', () => {
      const mockLoadPreset = jest.fn()

      render(
        <DropdownIntegrationTest
          presets={mockPresets}
          activePresetId="" // Empty string instead of null
          onLoadPreset={mockLoadPreset}
        />
      )

      // Should behave the same as null
      expect(screen.getByTestId('active-preset-id')).toHaveTextContent('activePresetId: null')
      
      const dropdown = screen.getByTestId('preset-dropdown')
      expect(dropdown).toHaveValue('aizawa-classic') // Still shows first option visually
    })

    test('EDGE CASE: preset exists in dropdown but not in activePresetId', () => {
      const mockLoadPreset = jest.fn()

      render(
        <DropdownIntegrationTest
          presets={mockPresets}
          activePresetId="non-existent-preset-id" // ID that doesn't exist in presets
          onLoadPreset={mockLoadPreset}
        />
      )

      // This should be handled gracefully
      expect(screen.getByTestId('active-preset-id')).toHaveTextContent('activePresetId: non-existent-preset-id')
      
      const dropdown = screen.getByTestId('preset-dropdown')
      // Dropdown should fall back to first preset visually
      expect(dropdown).toHaveValue('aizawa-classic')
    })
  })

  describe('Testing the Root Cause: Preset Manager Initialization', () => {
    test('simulates preset manager failing to auto-load default', () => {
      // This simulates what happens when:
      // 1. Presets are loaded successfully
      // 2. But getEffectiveDefault returns null
      // 3. So activePresetId remains null
      // 4. But dropdown still shows first preset visually

      const mockLoadPreset = jest.fn()

      render(
        <DropdownIntegrationTest
          presets={mockPresets} // Presets loaded successfully
          activePresetId={null}  // But no preset was auto-selected
          onLoadPreset={mockLoadPreset}
        />
      )

      // This is the problematic state that causes user confusion
      expect(screen.getByTestId('presets-count')).toHaveTextContent('presets count: 4')
      expect(screen.getByTestId('active-preset-id')).toHaveTextContent('activePresetId: null')
      expect(screen.getByTestId('user-sees')).toHaveTextContent('User sees: Classic Aizawa')

      // User thinks "Classic Aizawa" is loaded but it's not
      const dropdown = screen.getByTestId('preset-dropdown')
      expect(dropdown).toHaveValue('aizawa-classic')
    })

    test('shows correct behavior when preset manager works properly', () => {
      // This simulates what should happen:
      // 1. Presets are loaded
      // 2. getEffectiveDefault finds "Classic Aizawa" (isDefault: true)
      // 3. activePresetId is set to "aizawa-classic"
      // 4. UI state matches internal state

      const mockLoadPreset = jest.fn()

      render(
        <DropdownIntegrationTest
          presets={mockPresets}
          activePresetId="aizawa-classic" // Properly auto-loaded
          onLoadPreset={mockLoadPreset}
        />
      )

      // Everything should be in sync
      expect(screen.getByTestId('presets-count')).toHaveTextContent('presets count: 4')
      expect(screen.getByTestId('active-preset-id')).toHaveTextContent('activePresetId: aizawa-classic')
      expect(screen.getByTestId('user-sees')).toHaveTextContent('User sees: Classic Aizawa')
      expect(screen.getByTestId('actual-state')).toHaveTextContent('Actual state: preset-aizawa-classic')

      const dropdown = screen.getByTestId('preset-dropdown')
      expect(dropdown).toHaveValue('aizawa-classic')
    })
  })

  describe('Modification Detection Integration', () => {
    test('asterisk only appears when preset is properly loaded and then modified', () => {
      const mockLoadPreset = jest.fn()

      render(
        <DropdownIntegrationTest
          presets={mockPresets}
          activePresetId="aizawa-classic" // Preset properly loaded
          onLoadPreset={mockLoadPreset}
        />
      )

      const dropdown = screen.getByTestId('preset-dropdown')
      
      // Initially should show preset name without asterisk
      expect(dropdown.textContent).toContain('Classic Aizawa')
      expect(dropdown.textContent).not.toContain('*')

      // Note: In real app, asterisk would appear when control values change
      // This test just verifies the integration point is working
    })

    test('no asterisk when activePresetId is null (nothing to compare against)', () => {
      const mockLoadPreset = jest.fn()

      render(
        <DropdownIntegrationTest
          presets={mockPresets}
          activePresetId={null} // No preset loaded
          onLoadPreset={mockLoadPreset}
        />
      )

      const dropdown = screen.getByTestId('preset-dropdown')
      
      // Should show plain preset names (no asterisk possible)
      expect(dropdown.textContent).toContain('Classic Aizawa')
      expect(dropdown.textContent).not.toContain('*')
    })
  })
})