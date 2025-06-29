// AIDEV-NOTE: Extracted preset import/export operations from preset-manager.ts for better modularity
// This module handles importing and exporting presets in JSON format for sharing

import type { 
  PatternPreset, 
  PresetExportData, 
  PresetImportResult 
} from './preset-types'
import { 
  generateContentHash, 
  findContentDuplicate, 
  generateUniqueName 
} from './preset-validation'

/**
 * Export presets to JSON format for sharing
 * Can export all user presets or a specific subset by IDs
 */
export function exportPresets(
  userPresets: PatternPreset[], 
  presetIds?: string[]
): PresetExportData {
  const presetsToExport = presetIds 
    ? userPresets.filter(p => presetIds.includes(p.id))
    : userPresets
  
  return {
    version: "1.0.0",
    presets: presetsToExport,
    exportedAt: new Date()
  }
}

/**
 * Import presets from JSON format with auto-conflict resolution
 * Returns detailed result with imported IDs and skipped duplicates info
 */
export function importPresets(
  exportData: PresetExportData,
  existingUserPresets: PatternPreset[]
): PresetImportResult & { updatedPresets: PatternPreset[] } {
  const importedIds: string[] = []
  const skippedDuplicates: string[] = []
  const errors: string[] = []
  
  // Work with a copy to avoid modifying the original array
  const workingPresets = [...existingUserPresets]
  
  for (const preset of exportData.presets) {
    try {
      // Skip factory presets in imports - they should only come from JSON file
      if (preset.isFactory) {
        skippedDuplicates.push(`"${preset.name}" (factory preset - skipped)`)
        continue
      }
      
      // AIDEV-NOTE: Ensure preset has contentHash for duplicate detection
      let contentHash = preset.contentHash
      if (!contentHash) {
        contentHash = generateContentHash(preset.name, preset.generatorType, preset.parameters)
      }
      
      // Check for exact content duplicates - skip if found
      const contentDuplicate = findContentDuplicate({
        ...preset,
        contentHash
      }, workingPresets)
      
      if (contentDuplicate) {
        skippedDuplicates.push(`"${preset.name}" (identical to existing "${contentDuplicate.name}")`)
        continue
      }
      
      // AIDEV-NOTE: Generate new ID and prepare preset for import
      const importPreset: PatternPreset = {
        ...preset,
        id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        contentHash
      }
      
      // Auto-rename if name conflicts exist (common when importing from others)
      const existingWithSameName = workingPresets.find(p => 
        p.name === importPreset.name && p.generatorType === importPreset.generatorType
      )
      
      if (existingWithSameName) {
        // AIDEV-NOTE: Auto-rename imported presets to avoid conflicts
        importPreset.name = generateUniqueName(
          preset.name, 
          preset.generatorType, 
          workingPresets
        )
      }
      
      // Add to working collection and track success
      workingPresets.push(importPreset)
      importedIds.push(importPreset.id)
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      errors.push(`"${preset.name}": ${errorMsg}`)
      console.warn(`Failed to import preset "${preset.name}":`, error)
    }
  }
  
  return { importedIds, skippedDuplicates, errors, updatedPresets: workingPresets }
}

/**
 * Validate export data format
 * Checks if the imported data has the expected structure
 */
export function validateExportData(data: unknown): data is PresetExportData {
  if (!data || typeof data !== 'object') {
    return false
  }
  
  const exportData = data as Record<string, unknown>
  
  return (
    typeof exportData.version === 'string' &&
    Array.isArray(exportData.presets) &&
    exportData.exportedAt instanceof Date || typeof exportData.exportedAt === 'string'
  )
}

/**
 * Create export filename with timestamp
 * Generates a user-friendly filename for downloaded preset files
 */
export function createExportFilename(patternType?: string): string {
  const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  const suffix = patternType ? `-${patternType}` : ''
  return `pattern-presets${suffix}-${timestamp}.json`
}

/**
 * Export presets as downloadable file
 * Creates a blob and triggers download in the browser
 */
export function downloadPresetsAsFile(
  exportData: PresetExportData, 
  filename?: string
): void {
  const jsonString = JSON.stringify(exportData, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename || createExportFilename()
  
  // Trigger download
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up the URL object
  URL.revokeObjectURL(url)
}