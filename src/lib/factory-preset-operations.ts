// AIDEV-NOTE: Extracted factory preset operations from preset-manager.ts for better modularity
// This module handles loading, conversion, and management of factory presets from JSON

import type { 
  PatternPreset, 
  RawFactoryPreset, 
  FactoryPresetData, 
  FactoryPresetRestoreResult 
} from './preset-types'
import { generateContentHash } from './preset-validation'

/**
 * Load factory presets from the public directory
 * Converts raw JSON format to PatternPreset interface
 */
export async function loadFactoryPresets(): Promise<PatternPreset[]> {
  try {
    const response = await fetch('/factory-presets.json')
    if (!response.ok) {
      throw new Error(`Failed to load factory presets: ${response.status}`)
    }
    
    const data: FactoryPresetData = await response.json()
    
    // Convert factory preset format to PatternPreset format
    const factoryPresets: PatternPreset[] = data.presets.map((preset: RawFactoryPreset) => ({
      id: preset.id,
      name: preset.name,
      generatorType: preset.generatorType,
      parameters: preset.parameters,
      createdAt: new Date(), // Set to current time for consistent sorting
      description: preset.description,
      contentHash: generateContentHash(preset.name, preset.generatorType, preset.parameters),
      isFactory: preset.isFactory || true,
      isDefault: preset.isDefault || false, // CRITICAL: Preserve isDefault flag from factory presets
      category: preset.category,
      mathematicalSignificance: preset.mathematicalSignificance
    }))
    
    return factoryPresets
  } catch (error) {
    console.warn('Failed to load factory presets:', error)
    return []
  }
}

/**
 * Get only factory presets
 * Convenience method for accessing factory presets specifically
 */
export async function getFactoryPresets(): Promise<PatternPreset[]> {
  return await loadFactoryPresets()
}

/**
 * Restore factory presets (simplified - just returns fresh presets from JSON)
 * In the current system, factory presets are always "fresh" from the JSON file
 */
export async function restoreFactoryPresets(): Promise<FactoryPresetRestoreResult> {
  try {
    const factoryPresets = await loadFactoryPresets()
    // In the new system, factory presets are always "fresh" so we just return the count
    return { imported: factoryPresets.length, skipped: 0 }
  } catch (error) {
    console.error('Failed to load factory presets:', error)
    return { imported: 0, skipped: 0 }
  }
}

/**
 * Get presets for a specific generator type from factory presets only
 * Useful for getting curated presets for a specific pattern
 */
export async function getFactoryPresetsForGenerator(generatorType: string): Promise<PatternPreset[]> {
  try {
    const factoryPresets = await loadFactoryPresets()
    return factoryPresets.filter(p => p.generatorType === generatorType)
  } catch (error) {
    console.warn('Failed to load factory presets for generator:', error)
    return []
  }
}

/**
 * Check if factory presets are available
 * Useful for determining if factory preset features should be enabled
 */
export async function areFactoryPresetsAvailable(): Promise<boolean> {
  try {
    const response = await fetch('/factory-presets.json')
    return response.ok
  } catch {
    return false
  }
}

/**
 * Get factory preset categories
 * Returns unique categories from all factory presets
 */
export async function getFactoryPresetCategories(): Promise<string[]> {
  try {
    const factoryPresets = await loadFactoryPresets()
    const categories = new Set<string>()
    
    factoryPresets.forEach(preset => {
      if (preset.category) {
        categories.add(preset.category)
      }
    })
    
    return Array.from(categories).sort()
  } catch (error) {
    console.warn('Failed to get factory preset categories:', error)
    return []
  }
}