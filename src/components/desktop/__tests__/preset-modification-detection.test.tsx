// AIDEV-NOTE: Behavioral tests for preset modification detection and UX phases
import { getPresetDisplayName, isPresetModified } from '@/lib/preset-comparison'
import { createMockFactoryPreset } from '@/test-utils/preset-test-helpers'

// Test the core preset modification detection logic
describe('Preset Modification Detection - Behavioral Tests', () => {
  const mockPreset = createMockFactoryPreset({
    id: 'test-preset',
    name: 'Test Preset',
    generatorType: 'aizawa-attractor',
    parameters: {
      a: 0.95,
      b: 0.7,
      c: 0.6,
      particleCount: 2500,
      colorScheme: 1
    }
  })

  describe('Phase 1: Preset Modification Detection Logic', () => {
    test('detects when control values exactly match preset', () => {
      const currentValues = {
        a: 0.95,
        b: 0.7,
        c: 0.6,
        particleCount: 2500,
        colorScheme: 1
      }

      const isModified = isPresetModified(currentValues, mockPreset)
      expect(isModified).toBe(false)
    })

    test('detects when control values differ from preset', () => {
      const currentValues = {
        a: 0.98, // Changed from 0.95
        b: 0.7,
        c: 0.6,
        particleCount: 2500,
        colorScheme: 1
      }

      const isModified = isPresetModified(currentValues, mockPreset)
      expect(isModified).toBe(true)
    })

    test('handles floating point precision correctly', () => {
      const currentValues = {
        a: 0.95 + 1e-12, // Tiny floating point difference within tolerance
        b: 0.7,
        c: 0.6,
        particleCount: 2500,
        colorScheme: 1
      }

      const isModified = isPresetModified(currentValues, mockPreset)
      expect(isModified).toBe(false) // Should be considered equal
    })

    test('ignores extra controls not in preset', () => {
      const currentValues = {
        a: 0.95,
        b: 0.7,
        c: 0.6,
        particleCount: 2500,
        colorScheme: 1,
        extraControl: 999 // Not in preset, should be ignored
      }

      const isModified = isPresetModified(currentValues, mockPreset)
      expect(isModified).toBe(false)
    })

    test('handles missing controls gracefully', () => {
      const currentValues = {
        a: 0.95,
        b: 0.7,
        // Missing c, particleCount, colorScheme
      }

      const isModified = isPresetModified(currentValues, mockPreset)
      expect(isModified).toBe(false) // Missing values should be ignored
    })

    test('returns false when no preset is provided', () => {
      const currentValues = { a: 1.0, b: 2.0 }
      const isModified = isPresetModified(currentValues, null)
      expect(isModified).toBe(false)
    })
  })

  describe('Phase 2: Display Name with Asterisk Indicator', () => {
    test('shows preset name without asterisk when unmodified', () => {
      const currentValues = {
        a: 0.95,
        b: 0.7,
        c: 0.6,
        particleCount: 2500,
        colorScheme: 1
      }

      const displayName = getPresetDisplayName(mockPreset, currentValues)
      expect(displayName).toBe('Test Preset')
      expect(displayName).not.toContain('*')
    })

    test('shows preset name with asterisk when modified', () => {
      const currentValues = {
        a: 0.98, // Modified
        b: 0.7,
        c: 0.6,
        particleCount: 2500,
        colorScheme: 1
      }

      const displayName = getPresetDisplayName(mockPreset, currentValues)
      expect(displayName).toBe('Test Preset*')
      expect(displayName).toContain('*')
    })

    test('returns empty string when no preset provided', () => {
      const currentValues = { a: 1.0 }
      const displayName = getPresetDisplayName(null, currentValues)
      expect(displayName).toBe('')
    })

    test('asterisk appears immediately when any parameter changes', () => {
      // Test multiple parameter changes
      const testCases = [
        { a: 0.99, b: 0.7, c: 0.6, particleCount: 2500, colorScheme: 1 }, // a changed
        { a: 0.95, b: 0.8, c: 0.6, particleCount: 2500, colorScheme: 1 }, // b changed
        { a: 0.95, b: 0.7, c: 0.5, particleCount: 2500, colorScheme: 1 }, // c changed
        { a: 0.95, b: 0.7, c: 0.6, particleCount: 3000, colorScheme: 1 }, // particleCount changed
        { a: 0.95, b: 0.7, c: 0.6, particleCount: 2500, colorScheme: 0 }, // colorScheme changed
      ]

      testCases.forEach((values) => {
        const displayName = getPresetDisplayName(mockPreset, values)
        expect(displayName).toBe('Test Preset*')
        expect(displayName).toContain('*')
      })
    })
  })

  describe('Phase 3: User Behavior Scenarios', () => {
    test('user loads preset then modifies parameter - should show asterisk', () => {
      // Initial state: preset loaded, values match
      let currentValues = {
        a: 0.95,
        b: 0.7,
        c: 0.6,
        particleCount: 2500,
        colorScheme: 1
      }
      
      let displayName = getPresetDisplayName(mockPreset, currentValues)
      expect(displayName).toBe('Test Preset') // No asterisk initially

      // User modifies a parameter
      currentValues = {
        ...currentValues,
        a: 0.98 // User changes 'a' parameter
      }

      displayName = getPresetDisplayName(mockPreset, currentValues)
      expect(displayName).toBe('Test Preset*') // Asterisk appears
    })

    test('user modifies parameter then reverts - asterisk should disappear', () => {
      // Start with modified values
      let currentValues = {
        a: 0.98, // Modified
        b: 0.7,
        c: 0.6,
        particleCount: 2500,
        colorScheme: 1
      }
      
      let displayName = getPresetDisplayName(mockPreset, currentValues)
      expect(displayName).toBe('Test Preset*') // Shows asterisk

      // User reverts the change
      currentValues = {
        ...currentValues,
        a: 0.95 // Back to preset value
      }

      displayName = getPresetDisplayName(mockPreset, currentValues)
      expect(displayName).toBe('Test Preset') // Asterisk disappears
    })

    test('user makes multiple changes - asterisk remains throughout', () => {
      const changeSequence = [
        { a: 0.98, b: 0.7, c: 0.6, particleCount: 2500, colorScheme: 1 }, // Change a
        { a: 0.98, b: 0.8, c: 0.6, particleCount: 2500, colorScheme: 1 }, // Change b
        { a: 0.98, b: 0.8, c: 0.5, particleCount: 2500, colorScheme: 1 }, // Change c
      ]

      changeSequence.forEach((values) => {
        const displayName = getPresetDisplayName(mockPreset, values)
        expect(displayName).toBe('Test Preset*')
        expect(displayName).toContain('*')
      })
    })

    test('different value types (numbers, strings, booleans) are handled correctly', () => {
      const presetWithMixedTypes = {
        ...mockPreset,
        parameters: {
          numericParam: 10.5,
          stringParam: 'test-value',
          booleanParam: true,
          integerParam: 42
        }
      }

      // Exact match - no asterisk
      let currentValues = {
        numericParam: 10.5,
        stringParam: 'test-value',
        booleanParam: true,
        integerParam: 42
      }
      expect(getPresetDisplayName(presetWithMixedTypes, currentValues)).toBe('Test Preset')

      // String change - should show asterisk
      currentValues = { ...currentValues, stringParam: 'different-value' }
      expect(getPresetDisplayName(presetWithMixedTypes, currentValues)).toBe('Test Preset*')

      // Boolean change - should show asterisk
      currentValues = { 
        numericParam: 10.5,
        stringParam: 'test-value',
        booleanParam: false, // Changed
        integerParam: 42
      }
      expect(getPresetDisplayName(presetWithMixedTypes, currentValues)).toBe('Test Preset*')
    })
  })

  describe('Phase 4: Edge Cases and Error Conditions', () => {
    test('handles preset with no parameters', () => {
      const emptyPreset = {
        ...mockPreset,
        parameters: {}
      }

      const currentValues = { someParam: 123 }
      const displayName = getPresetDisplayName(emptyPreset, currentValues)
      expect(displayName).toBe('Test Preset') // No asterisk for empty preset
    })

    test('handles empty current values', () => {
      const currentValues = {}
      const displayName = getPresetDisplayName(mockPreset, currentValues)
      expect(displayName).toBe('Test Preset') // No asterisk when no current values
    })

    test('type mismatches are detected as modifications', () => {
      const currentValues = {
        a: '0.95', // String instead of number
        b: 0.7,
        c: 0.6,
        particleCount: 2500,
        colorScheme: 1
      }

      const isModified = isPresetModified(currentValues, mockPreset)
      expect(isModified).toBe(true) // Type mismatch should be detected

      const displayName = getPresetDisplayName(mockPreset, currentValues)
      expect(displayName).toBe('Test Preset*')
    })
  })
})