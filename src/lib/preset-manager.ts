// AIDEV-NOTE: Core preset management utilities for Issue #16 - Pattern parameter saving/loading system
"use client"

export interface PatternPreset {
  id: string
  name: string
  generatorType: string
  parameters: Record<string, number | string | boolean>
  createdAt: Date
  description?: string
  contentHash: string // AIDEV-NOTE: Hash of meaningful content for duplicate detection
  isFactory?: boolean // AIDEV-NOTE: Factory presets that ship with the app
  category?: string // AIDEV-NOTE: Factory preset category (Classic, Bifurcation, Enhanced, etc.)
  mathematicalSignificance?: string // AIDEV-NOTE: Educational description of mathematical importance
}

export interface PresetExportData {
  version: string
  presets: PatternPreset[]
  exportedAt: Date
}

// AIDEV-NOTE: localStorage key constants to avoid typos and enable easy refactoring
const STORAGE_KEYS = {
  PRESETS: 'pattern-generator-presets',
  LAST_ACTIVE_PRESET: 'pattern-generator-last-active-preset',
  FACTORY_PRESETS_LOADED: 'pattern-generator-factory-loaded'
} as const

// AIDEV-NOTE: Current preset system version for future migration support
export const PRESET_VERSION = '1.0.1'

/**
 * Generate a consistent hash for preset content to detect duplicates
 * Hash includes: generatorType and sorted parameters (NOT name, for true content detection)
 */
function generateContentHash(
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
 * Core preset management utilities
 * Handles localStorage operations, validation, and data transformation
 */
export class PresetManager {
  /**
   * Load all presets from localStorage
   */
  static loadPresets(): PatternPreset[] {
    try {
      if (typeof window === 'undefined') return []
      
      const stored = localStorage.getItem(STORAGE_KEYS.PRESETS)
      if (!stored) return []
      
      const parsed = JSON.parse(stored) as PatternPreset[]
      let shouldSave = false
      
      // AIDEV-NOTE: Convert date strings back to Date objects and ensure contentHash exists
      const presets = parsed.map((preset) => {
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
      
      // Save back to localStorage if we added any missing hashes
      if (shouldSave) {
        this.savePresets(presets)
      }
      
      return presets
    } catch (error) {
      console.warn('Failed to load presets from localStorage:', error)
      return []
    }
  }

  /**
   * Save presets to localStorage
   */
  static savePresets(presets: PatternPreset[]): boolean {
    try {
      if (typeof window === 'undefined') return false
      
      localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(presets))
      return true
    } catch (error) {
      console.error('Failed to save presets to localStorage:', error)
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
    const presets = this.loadPresets()
    
    // AIDEV-NOTE: Check for exact content duplicates using hash
    const contentDuplicate = presets.find(p => 
      p.contentHash === preset.contentHash && p.generatorType === preset.generatorType
    )
    
    if (contentDuplicate) {
      throw new Error(`Preset with identical content already exists: "${contentDuplicate.name}"`)
    }
    
    // AIDEV-NOTE: Strict name checking for local saves - user should pick unique names
    const nameDuplicate = presets.find(p => 
      p.name === preset.name && p.generatorType === preset.generatorType
    )
    
    if (nameDuplicate) {
      throw new Error(`Preset name "${preset.name}" already exists. Please choose a different name.`)
    }
    
    presets.push(preset)
    return this.savePresets(presets)
  }

  /**
   * Add a preset with automatic conflict resolution (for imports)
   */
  private static addPresetWithAutoRename(preset: PatternPreset, existingPresets: PatternPreset[]): PatternPreset | null {
    // Check for exact content duplicates - skip if found
    const contentDuplicate = existingPresets.find(p => 
      p.contentHash === preset.contentHash && p.generatorType === preset.generatorType
    )
    
    if (contentDuplicate) {
      return null // Signal to skip this preset
    }
    
    // Auto-rename if name conflicts exist (common when importing from others)
    const existingWithSameName = existingPresets.find(p => 
      p.name === preset.name && p.generatorType === preset.generatorType
    )
    
    let finalPreset: PatternPreset
    
    if (existingWithSameName) {
      // AIDEV-NOTE: Auto-rename imported presets to avoid conflicts
      let counter = 1
      let newName = `${preset.name} (${counter})`
      
      while (existingPresets.find(p => p.name === newName && p.generatorType === preset.generatorType)) {
        counter++
        newName = `${preset.name} (${counter})`
      }
      
      finalPreset = {
        ...preset,
        name: newName
        // Keep same contentHash since parameters didn't change
      }
    } else {
      finalPreset = { ...preset }
    }
    
    existingPresets.push(finalPreset)
    return finalPreset
  }

  /**
   * Delete a preset by ID
   */
  static deletePreset(presetId: string): boolean {
    const presets = this.loadPresets()
    const filtered = presets.filter(p => p.id !== presetId)
    
    if (filtered.length === presets.length) {
      return false // Preset not found
    }
    
    return this.savePresets(filtered)
  }

  /**
   * Update an existing preset
   */
  static updatePreset(presetId: string, updates: Partial<Omit<PatternPreset, 'id' | 'createdAt'>>): boolean {
    const presets = this.loadPresets()
    const index = presets.findIndex(p => p.id === presetId)
    
    if (index === -1) return false
    
    // AIDEV-NOTE: Check for name conflicts if name is being updated
    if (updates.name) {
      const duplicate = presets.find((p, i) => 
        i !== index && 
        p.name === updates.name && 
        p.generatorType === (updates.generatorType || presets[index].generatorType)
      )
      
      if (duplicate) {
        throw new Error(`Preset "${updates.name}" already exists`)
      }
    }
    
    presets[index] = { ...presets[index], ...updates }
    return this.savePresets(presets)
  }

  /**
   * Get presets for a specific generator type
   */
  static getPresetsForGenerator(generatorType: string): PatternPreset[] {
    return this.loadPresets().filter(p => p.generatorType === generatorType)
  }

  /**
   * Validate preset parameters against pattern controls
   * Returns true if preset is compatible with current pattern controls
   */
  static validatePresetParameters(
    preset: PatternPreset, 
    patternControls: Array<{id: string, type: string, min?: number, max?: number}>
  ): { valid: boolean; warnings: string[] } {
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
   * Export presets to JSON format for sharing
   */
  static exportPresets(presetIds?: string[]): PresetExportData {
    const allPresets = this.loadPresets()
    const presetsToExport = presetIds 
      ? allPresets.filter(p => presetIds.includes(p.id))
      : allPresets
    
    return {
      version: PRESET_VERSION,
      presets: presetsToExport,
      exportedAt: new Date()
    }
  }

  /**
   * Import presets from JSON format with auto-conflict resolution
   * Returns object with imported IDs and skipped duplicates info
   */
  static importPresets(exportData: PresetExportData): {
    importedIds: string[]
    skippedDuplicates: string[]
    errors: string[]
  } {
    const existingPresets = this.loadPresets()
    const importedIds: string[] = []
    const skippedDuplicates: string[] = []
    const errors: string[] = []
    
    for (const preset of exportData.presets) {
      try {
        // AIDEV-NOTE: Ensure preset has contentHash for duplicate detection
        let contentHash = preset.contentHash
        if (!contentHash) {
          contentHash = generateContentHash(preset.name, preset.generatorType, preset.parameters)
        }
        
        // AIDEV-NOTE: Generate new ID and prepare preset for import
        const importPreset: PatternPreset = {
          ...preset,
          id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          contentHash
        }
        
        // Use auto-rename helper for conflict resolution
        const addedPreset = this.addPresetWithAutoRename(importPreset, existingPresets)
        
        if (addedPreset) {
          importedIds.push(addedPreset.id)
        } else {
          // Content duplicate was skipped
          const existingDupe = existingPresets.find(p => 
            p.contentHash === contentHash && p.generatorType === preset.generatorType
          )
          skippedDuplicates.push(`"${preset.name}" (identical to existing "${existingDupe?.name || 'unknown'}")`)
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        errors.push(`"${preset.name}": ${errorMsg}`)
        console.warn(`Failed to import preset "${preset.name}":`, error)
      }
    }
    
    // Save all changes at once for better performance
    if (importedIds.length > 0) {
      this.savePresets(existingPresets)
    }
    
    return { importedIds, skippedDuplicates, errors }
  }

  /**
   * Clear all presets (with confirmation in UI layer)
   */
  static clearAllPresets(): boolean {
    try {
      if (typeof window === 'undefined') return false
      
      localStorage.removeItem(STORAGE_KEYS.PRESETS)
      localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVE_PRESET)
      return true
    } catch (error) {
      console.error('Failed to clear presets:', error)
      return false
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

  /**
   * Load factory presets from the public directory
   */
  static async loadFactoryPresets(): Promise<PatternPreset[]> {
    try {
      const response = await fetch('/factory-presets.json')
      if (!response.ok) {
        throw new Error(`Failed to load factory presets: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Convert factory preset format to PatternPreset format
      const factoryPresets: PatternPreset[] = data.presets.map((preset: {
        id: string;
        name: string;
        generatorType: string;
        parameters: Record<string, number | string | boolean>;
        description?: string;
        isFactory?: boolean;
        category?: string;
        mathematicalSignificance?: string;
      }) => ({
        id: preset.id,
        name: preset.name,
        generatorType: preset.generatorType,
        parameters: preset.parameters,
        createdAt: new Date(), // Set to current time for consistent sorting
        description: preset.description,
        contentHash: generateContentHash(preset.name, preset.generatorType, preset.parameters),
        isFactory: preset.isFactory || true,
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
   * Check if factory presets have been loaded for this version
   */
  static hasFactoryPresetsLoaded(): boolean {
    try {
      if (typeof window === 'undefined') return false
      const loaded = localStorage.getItem(STORAGE_KEYS.FACTORY_PRESETS_LOADED)
      return loaded === PRESET_VERSION
    } catch {
      return false
    }
  }

  /**
   * Mark factory presets as loaded for this version
   */
  static markFactoryPresetsLoaded(): void {
    try {
      if (typeof window === 'undefined') return
      localStorage.setItem(STORAGE_KEYS.FACTORY_PRESETS_LOADED, PRESET_VERSION)
    } catch (error) {
      console.warn('Failed to mark factory presets as loaded:', error)
    }
  }

  /**
   * Force re-import of factory presets (useful for restore functionality)
   */
  static async restoreFactoryPresets(): Promise<{ imported: number; skipped: number }> {
    try {
      const factoryPresets = await this.loadFactoryPresets()
      if (factoryPresets.length === 0) {
        console.warn('No factory presets found to restore')
        return { imported: 0, skipped: 0 }
      }

      const existingPresets = this.loadPresets()
      let importedCount = 0
      let skippedCount = 0

      // Import factory presets, skipping duplicates
      for (const factoryPreset of factoryPresets) {
        // Check if this factory preset already exists (by content hash)
        const duplicate = existingPresets.find(p => 
          p.contentHash === factoryPreset.contentHash && 
          p.generatorType === factoryPreset.generatorType
        )

        if (!duplicate) {
          existingPresets.push(factoryPreset)
          importedCount++
        } else {
          skippedCount++
        }
      }

      if (importedCount > 0) {
        this.savePresets(existingPresets)
      }

      return { imported: importedCount, skipped: skippedCount }
    } catch (error) {
      console.error('Failed to restore factory presets:', error)
      throw error
    }
  }

  /**
   * Auto-import factory presets if not already loaded
   */
  static async ensureFactoryPresetsLoaded(): Promise<void> {
    if (this.hasFactoryPresetsLoaded()) {
      return // Already loaded for this version
    }

    try {
      const factoryPresets = await this.loadFactoryPresets()
      if (factoryPresets.length === 0) {
        console.warn('No factory presets found to import')
        return
      }

      const existingPresets = this.loadPresets()
      let importedCount = 0

      // Import factory presets, skipping duplicates
      for (const factoryPreset of factoryPresets) {
        // Check if this factory preset already exists (by content hash)
        const duplicate = existingPresets.find(p => 
          p.contentHash === factoryPreset.contentHash && 
          p.generatorType === factoryPreset.generatorType
        )

        if (!duplicate) {
          existingPresets.push(factoryPreset)
          importedCount++
        }
      }

      // Save updated presets if any were imported
      if (importedCount > 0) {
        this.savePresets(existingPresets)
        console.log(`Imported ${importedCount} factory presets`)
      }

      // Mark as loaded regardless of whether anything was imported
      this.markFactoryPresetsLoaded()
    } catch (error) {
      console.error('Failed to import factory presets:', error)
    }
  }

  /**
   * Get only factory presets
   */
  static getFactoryPresets(): PatternPreset[] {
    return this.loadPresets().filter(p => p.isFactory === true)
  }

  /**
   * Get user-created presets (non-factory)
   */
  static getUserPresets(): PatternPreset[] {
    return this.loadPresets().filter(p => !p.isFactory)
  }
}