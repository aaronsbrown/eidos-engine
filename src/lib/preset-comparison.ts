// AIDEV-NOTE: Utility for comparing current control values with preset values
// Used to detect modifications and show "*" indicator in dropdown

import type { PatternPreset } from './preset-types'

// Epsilon for floating-point number comparison
const FLOAT_COMPARISON_EPSILON = 1e-10

/**
 * Compare current control values with a preset's parameters
 * Returns true if values have been modified from the preset
 */
export function isPresetModified(
  currentValues: Record<string, number | string | boolean>,
  preset: PatternPreset | null
): boolean {
  // If no preset is active, nothing is "modified"
  if (!preset) {
    return false
  }

  // Check if any current value differs from preset parameter
  for (const [controlId, currentValue] of Object.entries(currentValues)) {
    const presetValue = preset.parameters[controlId]
    
    // Skip if preset doesn't have this parameter (could be a new control)
    if (presetValue === undefined) {
      continue
    }

    // Compare values with type-safe equality
    if (!valuesEqual(currentValue, presetValue)) {
      return true
    }
  }

  // Also check if preset has parameters not in current values
  for (const [paramId, presetValue] of Object.entries(preset.parameters)) {
    const currentValue = currentValues[paramId]
    
    // If current values don't have this parameter, consider it modified
    // (unless current value is undefined, which means control was removed)
    if (currentValue === undefined) {
      continue
    }

    if (!valuesEqual(currentValue, presetValue)) {
      return true
    }
  }

  return false
}

/**
 * Type-safe value comparison that handles number precision issues
 */
function valuesEqual(a: number | string | boolean, b: number | string | boolean): boolean {
  // If types don't match, they're not equal
  if (typeof a !== typeof b) {
    return false
  }

  // For numbers, use small epsilon for floating point comparison
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) < FLOAT_COMPARISON_EPSILON
  }

  // For strings and booleans, use strict equality
  return a === b
}

/**
 * Get a preset name with modification indicator
 * Returns "Preset Name*" if modified, "Preset Name" if not
 */
export function getPresetDisplayName(
  preset: PatternPreset | null,
  currentValues: Record<string, number | string | boolean>
): string {
  if (!preset) {
    return ''
  }

  const isModified = isPresetModified(currentValues, preset)
  
  return isModified ? `${preset.name}*` : preset.name
}

/**
 * Check if current values exactly match pattern defaults
 * Useful for determining when to show/hide reset button
 */
export function isAtPatternDefaults(
  currentValues: Record<string, number | string | boolean>,
  patternControls: Array<{ id: string; defaultValue: number | string | boolean }>
): boolean {
  for (const control of patternControls) {
    const currentValue = currentValues[control.id]
    
    // If current value is undefined, not at defaults
    if (currentValue === undefined) {
      return false
    }

    if (!valuesEqual(currentValue, control.defaultValue)) {
      return false
    }
  }

  return true
}