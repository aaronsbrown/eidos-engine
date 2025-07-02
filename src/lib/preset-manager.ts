// AIDEV-NOTE: Refactored preset management utilities - now focuses on core CRUD operations
// Extracted modules: preset-types, preset-validation, factory-preset-operations, preset-import-export
"use client"

import type { 
  PatternPreset, 
  PresetExportData, 
  PresetImportResult,
  PresetValidationResult
} from './preset-types'
import { STORAGE_KEYS } from './preset-types'
import { generateContentHash, validatePresetParameters } from './preset-validation'
import { loadFactoryPresets } from './factory-preset-operations'
import { exportPresets, importPresets } from './preset-import-export'

// Re-export types for backward compatibility
export type { 
  PatternPreset, 
  PresetExportData, 
  PresetImportResult,
  PresetValidationResult 
} from './preset-types'

// Re-export STORAGE_KEYS for external usage
export { STORAGE_KEYS } from './preset-types'

/**
 * Core preset management utilities
 * Handles localStorage operations, validation, and data transformation
 */
export class PresetManager {
  /**
   * Load user presets from localStorage (excludes factory presets)
   */
  static loadUserPresets(): PatternPreset[] {
    try {
      if (typeof window === 'undefined') return []
      
      const stored = localStorage.getItem(STORAGE_KEYS.PRESETS)
      if (!stored) return []
      
      const parsed = JSON.parse(stored) as PatternPreset[]
      let shouldSave = false
      
      // AIDEV-NOTE: Filter out factory presets and update user presets
      const userPresets = parsed
        .filter(preset => !preset.isFactory) // Only keep user presets
        .map((preset) => {
          const updatedPreset = {
            ...preset,
            createdAt: new Date(preset.createdAt)
          }
          
          // Add contentHash if missing (backward compatibility)
          if (!updatedPreset.contentHash) {
            updatedPreset.contentHash = generateContentHash(
              updatedPreset.name, 
              updatedPreset.generatorType, 
              updatedPreset.parameters
            )
            shouldSave = true
          }
          
          return updatedPreset
        })
      
      // Save back to localStorage if we filtered out factory presets or added hashes
      if (shouldSave || userPresets.length !== parsed.length) {
        this.saveUserPresets(userPresets)
      }
      
      return userPresets
    } catch (error) {
      console.warn('Failed to load user presets from localStorage:', error)
      return []
    }
  }

  /**
   * Save user presets to localStorage (only user presets, not factory presets)
   */
  static saveUserPresets(userPresets: PatternPreset[]): boolean {
    try {
      if (typeof window === 'undefined') return false
      
      localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(userPresets))
      return true
    } catch (error) {
      console.error('Failed to save user presets to localStorage:', error)
      return false
    }
  }

  /**
   * Create a new preset from current pattern parameters
   */
  static createPreset(
    name: string,
    generatorType: string,
    parameters: Record<string, number | string | boolean>,
    description?: string
  ): PatternPreset {
    const contentHash = generateContentHash(name, generatorType, parameters)
    
    return {
      id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      generatorType,
      parameters: { ...parameters }, // Create shallow copy
      createdAt: new Date(),
      description: description?.trim(),
      contentHash
    }
  }

  /**
   * Add a new preset (for local saves - strict duplicate checking)
   */
  static addPreset(preset: PatternPreset): boolean {
    const userPresets = this.loadUserPresets()
    
    // AIDEV-NOTE: Check for exact content duplicates using hash
    const contentDuplicate = userPresets.find(p => 
      p.contentHash === preset.contentHash && p.generatorType === preset.generatorType
    )
    
    if (contentDuplicate) {
      throw new Error(`Preset with identical content already exists: "${contentDuplicate.name}"`)
    }
    
    // AIDEV-NOTE: Strict name checking for local saves - user should pick unique names
    const nameDuplicate = userPresets.find(p => 
      p.name === preset.name && p.generatorType === preset.generatorType
    )
    
    if (nameDuplicate) {
      throw new Error(`Preset name "${preset.name}" already exists. Please choose a different name.`)
    }
    
    userPresets.push(preset)
    return this.saveUserPresets(userPresets)
  }


  /**
   * Delete a preset by ID
   */
  static deletePreset(presetId: string): boolean {
    const userPresets = this.loadUserPresets()
    const filtered = userPresets.filter(p => p.id !== presetId)
    
    if (filtered.length === userPresets.length) {
      return false // Preset not found
    }
    
    return this.saveUserPresets(filtered)
  }

  /**
   * Update an existing preset
   */
  static updatePreset(presetId: string, updates: Partial<Omit<PatternPreset, 'id' | 'createdAt'>>): boolean {
    const userPresets = this.loadUserPresets()
    const index = userPresets.findIndex(p => p.id === presetId)
    
    if (index === -1) return false
    
    // AIDEV-NOTE: Check for name conflicts if name is being updated
    if (updates.name) {
      const duplicate = userPresets.find((p, i) => 
        i !== index && 
        p.name === updates.name && 
        p.generatorType === (updates.generatorType || userPresets[index].generatorType)
      )
      
      if (duplicate) {
        throw new Error(`Preset "${updates.name}" already exists`)
      }
    }
    
    userPresets[index] = { ...userPresets[index], ...updates }
    return this.saveUserPresets(userPresets)
  }

  /**
   * Get presets for a specific generator type (combines factory + user presets)
   */
  static async getPresetsForGenerator(generatorType: string): Promise<PatternPreset[]> {
    try {
      // Load factory presets fresh from JSON
      const factoryPresets = await this.loadFactoryPresets()
      
      // Load user presets from localStorage
      const userPresets = this.loadUserPresets()
      
      // Combine and filter by generator type
      const allPresets = [...factoryPresets, ...userPresets]
      const filtered = allPresets.filter(p => p.generatorType === generatorType)
      
      return filtered
    } catch (error) {
      console.warn('Failed to load presets for generator:', error)
      // Fallback to user presets only
      return this.loadUserPresets().filter(p => p.generatorType === generatorType)
    }
  }

  /**
   * Validate preset parameters against pattern controls
   * Returns true if preset is compatible with current pattern controls
   */
  static validatePresetParameters(
    preset: PatternPreset, 
    patternControls: Array<{id: string, type: string, min?: number, max?: number}>
  ): PresetValidationResult {
    return validatePresetParameters(preset, patternControls)
  }

  /**
   * Export presets to JSON format for sharing
   */
  static exportPresets(presetIds?: string[]): PresetExportData {
    const userPresets = this.loadUserPresets()
    return exportPresets(userPresets, presetIds)
  }

  /**
   * Import presets from JSON format with auto-conflict resolution
   * Returns object with imported IDs and skipped duplicates info
   */
  static importPresets(exportData: PresetExportData): PresetImportResult {
    const existingUserPresets = this.loadUserPresets()
    const result = importPresets(exportData, existingUserPresets)
    
    // Save updated presets if any were imported
    if (result.importedIds.length > 0) {
      this.saveUserPresets(result.updatedPresets)
    }
    
    // Return result without the updatedPresets array for backward compatibility
    return {
      importedIds: result.importedIds,
      skippedDuplicates: result.skippedDuplicates,
      errors: result.errors
    }
  }

  /**
   * Clear all user presets (with confirmation in UI layer)
   */
  static clearAllUserPresets(): boolean {
    try {
      if (typeof window === 'undefined') return false
      
      localStorage.removeItem(STORAGE_KEYS.PRESETS)
      localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVE_PRESET)
      return true
    } catch (error) {
      console.error('Failed to clear user presets:', error)
      return false
    }
  }

  /**
   * One-time cleanup: Remove factory presets from localStorage (migration helper)
   */
  static cleanupFactoryPresetsFromStorage(): void {
    try {
      if (typeof window === 'undefined') return
      
      // Remove the old factory presets loading flag
      localStorage.removeItem('pattern-generator-factory-loaded')
      
      // Load current presets and filter out factory ones
      const currentPresets = this.loadUserPresets() // This already filters out factory presets
      console.log(`Cleaned up localStorage: removed factory presets, kept ${currentPresets.length} user presets`)
    } catch (error) {
      console.warn('Failed to cleanup factory presets from localStorage:', error)
    }
  }

  /**
   * Get/set last active preset for convenience
   */
  static getLastActivePreset(): string | null {
    try {
      if (typeof window === 'undefined') return null
      return localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE_PRESET)
    } catch {
      return null
    }
  }

  static setLastActivePreset(presetId: string): void {
    try {
      if (typeof window === 'undefined') return
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE_PRESET, presetId)
    } catch (error) {
      console.warn('Failed to save last active preset:', error)
    }
  }

  static clearLastActivePreset(): void {
    try {
      if (typeof window === 'undefined') return
      localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVE_PRESET)
    } catch (error) {
      console.warn('Failed to clear last active preset:', error)
    }
  }

  /**
   * Load factory presets from the public directory
   */
  static async loadFactoryPresets(): Promise<PatternPreset[]> {
    return await loadFactoryPresets()
  }

  /**
   * Restore factory presets (simplified - just returns fresh presets from JSON)
   */
  static async restoreFactoryPresets(): Promise<{ imported: number; skipped: number }> {
    const { restoreFactoryPresets } = await import('./factory-preset-operations')
    return await restoreFactoryPresets()
  }

  /**
   * Get only factory presets
   */
  static async getFactoryPresets(): Promise<PatternPreset[]> {
    const { getFactoryPresets } = await import('./factory-preset-operations')
    return await getFactoryPresets()
  }

  /**
   * Get user-created presets (non-factory)
   */
  static getUserPresets(): PatternPreset[] {
    return this.loadUserPresets()
  }

  /**
   * Set a user preset as the default for its pattern type
   * Ensures only one user default per pattern type
   */
  static setUserDefault(presetId: string): boolean {
    const userPresets = this.loadUserPresets()
    const targetPreset = userPresets.find(p => p.id === presetId)
    
    if (!targetPreset) {
      throw new Error('Preset not found')
    }

    // Clear any existing user default for this pattern type
    userPresets.forEach(preset => {
      if (preset.generatorType === targetPreset.generatorType) {
        preset.isUserDefault = false
      }
    })

    // Set the target preset as user default
    targetPreset.isUserDefault = true

    return this.saveUserPresets(userPresets)
  }

  /**
   * Get the user default preset for a pattern type
   * Returns null if no user default is set
   */
  static getUserDefault(generatorType: string): PatternPreset | null {
    const userPresets = this.loadUserPresets()
    return userPresets.find(p => 
      p.generatorType === generatorType && p.isUserDefault === true
    ) || null
  }

  /**
   * Clear user default for a pattern type
   */
  static clearUserDefault(generatorType: string): boolean {
    const userPresets = this.loadUserPresets()
    let modified = false

    userPresets.forEach(preset => {
      if (preset.generatorType === generatorType && preset.isUserDefault) {
        preset.isUserDefault = false
        modified = true
      }
    })

    return modified ? this.saveUserPresets(userPresets) : true
  }

  /**
   * Get the effective default preset for a pattern type
   * Follows precedence: User Default -> Factory Default -> null
   */
  static async getEffectiveDefault(generatorType: string): Promise<PatternPreset | null> {
    // First check for user default
    const userDefault = this.getUserDefault(generatorType)
    if (userDefault) {
      return userDefault
    }

    // Fall back to factory default
    const factoryPresets = await this.loadFactoryPresets()
    const factoryDefault = factoryPresets.find(p => 
      p.generatorType === generatorType && p.isDefault === true
    )
    
    return factoryDefault || null
  }
}