// AIDEV-NOTE: Extracted preset types and interfaces from preset-manager.ts for better modularity
// This module contains all TypeScript interfaces and constants related to preset management

/**
 * Core pattern preset interface
 * Represents a saved pattern configuration with all its parameters
 */
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

/**
 * Export data format for sharing presets between users
 * Includes version information for compatibility checking
 */
export interface PresetExportData {
  version: string
  presets: PatternPreset[]
  exportedAt: Date
}

/**
 * Result of preset import operations
 * Provides detailed feedback about import success/failures
 */
export interface PresetImportResult {
  importedIds: string[]
  skippedDuplicates: string[]
  errors: string[]
}

/**
 * Result of preset validation operations
 * Used to check preset compatibility with current pattern controls
 */
export interface PresetValidationResult {
  valid: boolean
  warnings: string[]
}

/**
 * Factory preset restore operation result
 * Tracks how many presets were imported vs skipped
 */
export interface FactoryPresetRestoreResult {
  imported: number
  skipped: number
}

/**
 * Raw factory preset format from JSON file
 * Before conversion to PatternPreset interface
 */
export interface RawFactoryPreset {
  id: string
  name: string
  generatorType: string
  parameters: Record<string, number | string | boolean>
  description?: string
  isFactory?: boolean
  category?: string
  mathematicalSignificance?: string
}

/**
 * Factory preset JSON file structure
 * Top-level format for factory-presets.json
 */
export interface FactoryPresetData {
  version: string
  presets: RawFactoryPreset[]
}

// AIDEV-NOTE: localStorage key constants to avoid typos and enable easy refactoring
export const STORAGE_KEYS = {
  PRESETS: 'pattern-generator-presets',
  LAST_ACTIVE_PRESET: 'pattern-generator-last-active-preset'
} as const

// AIDEV-NOTE: Export type for storage keys to enable type-safe usage
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]