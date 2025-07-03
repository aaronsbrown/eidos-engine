// AIDEV-NOTE: Extracted preset loading logic from PresetManager for better cohesion
// Focused class handling data loading and persistence operations

"use client"

import type { PatternPreset } from './preset-types'
import { STORAGE_KEYS } from './preset-types'
import { generateContentHash } from './preset-validation'
import { loadFactoryPresets } from './factory-preset-operations'

/**
 * Handles all preset loading and persistence operations
 * Separated from business logic for better maintainability
 */
export class PresetLoader {
  /**
   * Load user presets from localStorage (excludes factory presets)
   * Automatically handles backward compatibility and data cleanup
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
      
      // Check storage size before saving
      const dataString = JSON.stringify(userPresets)
      if (!this.checkStorageSize(dataString)) {
        console.warn('Cannot save presets: localStorage size limit exceeded (5MB)')
        return false
      }
      
      localStorage.setItem(STORAGE_KEYS.PRESETS, dataString)
      return true
    } catch (error) {
      console.error('Failed to save user presets to localStorage:', error)
      return false
    }
  }

  /**
   * Check if data can be stored without exceeding reasonable localStorage limits
   * @param newData - The data string to be stored
   * @returns true if storage is within limits
   */
  private static checkStorageSize(newData: string): boolean {
    try {
      // Calculate approximate current localStorage usage
      let currentSize = 0
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          currentSize += localStorage.getItem(key)?.length || 0
        }
      }
      
      // Add size of new data
      const totalSize = currentSize + newData.length
      const maxSize = 5 * 1024 * 1024 // 5MB limit
      
      return totalSize < maxSize
    } catch (error) {
      console.warn('Could not check storage size:', error)
      return true // Allow storage if we can't check
    }
  }

  /**
   * Load factory presets from the public directory
   * Wrapper around factory-preset-operations for consistency
   */
  static async loadFactoryPresets(): Promise<PatternPreset[]> {
    return await loadFactoryPresets()
  }

  /**
   * Load all presets for a specific generator type (user + factory)
   * Combines data from both sources with proper error handling
   */
  static async getPresetsForGenerator(generatorType: string): Promise<PatternPreset[]> {
    const userPresets = this.loadUserPresets()
    const userPresetsForGenerator = userPresets.filter(p => p.generatorType === generatorType)
    
    try {
      const factoryPresets = await this.loadFactoryPresets()
      const factoryPresetsForGenerator = factoryPresets.filter(p => p.generatorType === generatorType)
      
      return [...userPresetsForGenerator, ...factoryPresetsForGenerator]
    } catch (error) {
      console.warn('Failed to load factory presets, using only user presets:', error)
      return userPresetsForGenerator
    }
  }

  /**
   * Clean up old factory presets from localStorage
   * Ensures localStorage only contains user presets
   */
  static cleanupFactoryPresetsFromStorage(): { removed: number; kept: number } {
    try {
      if (typeof window === 'undefined') return { removed: 0, kept: 0 }
      
      const stored = localStorage.getItem(STORAGE_KEYS.PRESETS)
      if (!stored) return { removed: 0, kept: 0 }
      
      const parsed = JSON.parse(stored) as PatternPreset[]
      const beforeCount = parsed.length
      
      const userPresets = parsed.filter(preset => !preset.isFactory)
      const afterCount = userPresets.length
      const removedCount = beforeCount - afterCount
      
      if (removedCount > 0) {
        this.saveUserPresets(userPresets)
        console.log(`Cleaned up localStorage: removed factory presets, kept ${afterCount} user presets`)
      }
      
      return { removed: removedCount, kept: afterCount }
    } catch (error) {
      console.warn('Failed to cleanup factory presets from storage:', error)
      return { removed: 0, kept: 0 }
    }
  }

  /**
   * Get storage statistics for debugging/monitoring
   */
  static getStorageStats(): {
    userPresetCount: number
    totalStorageSize: number
    lastModified: Date | null
  } {
    try {
      if (typeof window === 'undefined') {
        return { userPresetCount: 0, totalStorageSize: 0, lastModified: null }
      }
      
      const stored = localStorage.getItem(STORAGE_KEYS.PRESETS)
      if (!stored) {
        return { userPresetCount: 0, totalStorageSize: 0, lastModified: null }
      }
      
      const parsed = JSON.parse(stored) as PatternPreset[]
      const userPresets = parsed.filter(preset => !preset.isFactory)
      
      // Find most recent modification
      const lastModified = userPresets.length > 0 
        ? new Date(Math.max(...userPresets.map(p => new Date(p.createdAt).getTime())))
        : null
      
      return {
        userPresetCount: userPresets.length,
        totalStorageSize: stored.length,
        lastModified
      }
    } catch (error) {
      console.warn('Failed to get storage stats:', error)
      return { userPresetCount: 0, totalStorageSize: 0, lastModified: null }
    }
  }
}