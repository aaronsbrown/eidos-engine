// AIDEV-NOTE: Extracted preset validation utilities from preset-manager.ts for better modularity
// This module handles content hashing, duplicate detection, and parameter validation

import type { PatternPreset, PresetValidationResult } from './preset-types'

/**
 * Generate a consistent hash for preset content to detect duplicates
 * Hash includes: generatorType and sorted parameters (NOT name, for true content detection)
 */
export function generateContentHash(
  name: string,
  generatorType: string,
  parameters: Record<string, number | string | boolean>
): string {
  // AIDEV-NOTE: Create deterministic string by sorting parameters
  const sortedParams = Object.keys(parameters)
    .sort()
    .reduce((sorted, key) => {
      sorted[key] = parameters[key]
      return sorted
    }, {} as Record<string, number | string | boolean>)
  
  // AIDEV-NOTE: Hash based on content only (generatorType + parameters), not name
  const contentString = JSON.stringify({
    generatorType,
    parameters: sortedParams
  })
  
  // AIDEV-NOTE: Simple but effective hash function (djb2 algorithm)
  let hash = 5381
  for (let i = 0; i < contentString.length; i++) {
    hash = (hash * 33) ^ contentString.charCodeAt(i)
  }
  return Math.abs(hash).toString(36)
}

/**
 * Validate preset parameters against pattern controls
 * Returns validation result with warnings for incompatible parameters
 */
export function validatePresetParameters(
  preset: PatternPreset, 
  patternControls: Array<{id: string, type: string, min?: number, max?: number}>
): PresetValidationResult {
  const warnings: string[] = []
  
  // AIDEV-NOTE: Check if all preset parameters have corresponding controls
  Object.keys(preset.parameters).forEach(paramId => {
    const control = patternControls.find(c => c.id === paramId)
    if (!control) {
      warnings.push(`Parameter "${paramId}" no longer exists in current pattern`)
      return
    }
    
    const value = preset.parameters[paramId]
    
    // Validate numeric ranges
    if (control.type === 'range' && typeof value === 'number') {
      if (control.min !== undefined && value < control.min) {
        warnings.push(`Parameter "${paramId}" value ${value} is below minimum ${control.min}`)
      }
      if (control.max !== undefined && value > control.max) {
        warnings.push(`Parameter "${paramId}" value ${value} is above maximum ${control.max}`)
      }
    }
  })
  
  return {
    valid: warnings.length === 0,
    warnings
  }
}

/**
 * Check if two presets have identical content (same parameters and generator type)
 * Used for duplicate detection during imports
 */
export function presetsHaveIdenticalContent(preset1: PatternPreset, preset2: PatternPreset): boolean {
  return preset1.contentHash === preset2.contentHash && 
         preset1.generatorType === preset2.generatorType
}

/**
 * Find presets with identical content in a collection
 * Returns the existing preset if found, null otherwise
 */
export function findContentDuplicate(
  preset: PatternPreset, 
  existingPresets: PatternPreset[]
): PatternPreset | null {
  return existingPresets.find(p => presetsHaveIdenticalContent(preset, p)) || null
}

/**
 * Find presets with identical names in a collection
 * Returns the existing preset if found, null otherwise
 */
export function findNameDuplicate(
  preset: PatternPreset, 
  existingPresets: PatternPreset[]
): PatternPreset | null {
  return existingPresets.find(p => 
    p.name === preset.name && p.generatorType === preset.generatorType
  ) || null
}

/**
 * Generate a unique name for a preset by appending a counter
 * Used during imports to resolve name conflicts automatically
 */
export function generateUniqueName(
  baseName: string, 
  generatorType: string, 
  existingPresets: PatternPreset[]
): string {
  let counter = 1
  let newName = `${baseName} (${counter})`
  
  while (existingPresets.find(p => p.name === newName && p.generatorType === generatorType)) {
    counter++
    newName = `${baseName} (${counter})`
  }
  
  return newName
}