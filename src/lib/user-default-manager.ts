// AIDEV-NOTE: Extracted user default management from PresetManager for better cohesion
// Focused class handling user-controlled default preset functionality

"use client"

import type { PatternPreset } from './preset-types'
import { loadFactoryPresets } from './factory-preset-operations'

/**
 * Manages user-controlled default presets with clear precedence hierarchy
 * Handles: User Default → Factory Default → null
 */
export class UserDefaultManager {
  /**
   * Set a preset as the user default for its pattern type
   * Automatically clears any existing user default for that pattern
   */
  static setUserDefault(presetId: string, userPresets: PatternPreset[]): PatternPreset[] {
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

    return [...userPresets] // Return new array to maintain immutability
  }

  /**
   * Get the user default preset for a pattern type
   * Returns null if no user default is set
   */
  static getUserDefault(generatorType: string, userPresets: PatternPreset[]): PatternPreset | null {
    return userPresets.find(p => 
      p.generatorType === generatorType && p.isUserDefault === true
    ) || null
  }

  /**
   * Clear user default for a pattern type
   * Returns updated presets array
   */
  static clearUserDefault(generatorType: string, userPresets: PatternPreset[]): PatternPreset[] {
    const updatedPresets = userPresets.map(preset => {
      if (preset.generatorType === generatorType && preset.isUserDefault) {
        return { ...preset, isUserDefault: false }
      }
      return preset
    })

    return updatedPresets
  }

  /**
   * Get the effective default preset for a pattern type
   * Follows precedence: User Default → Factory Default → null
   */
  static async getEffectiveDefault(
    generatorType: string, 
    userPresets: PatternPreset[]
  ): Promise<PatternPreset | null> {
    // First check for user default
    const userDefault = this.getUserDefault(generatorType, userPresets)
    if (userDefault) {
      return userDefault
    }

    // Then check for factory default
    try {
      const factoryPresets = await loadFactoryPresets()
      const factoryDefault = factoryPresets.find(p => 
        p.generatorType === generatorType && p.isDefault === true
      )
      
      if (factoryDefault) {
        return factoryDefault
      }
    } catch (error) {
      console.warn('Failed to load factory presets for default lookup:', error)
    }

    // No defaults found
    return null
  }

  /**
   * Check if a preset is currently the user default for its pattern type
   */
  static isUserDefault(preset: PatternPreset, userPresets: PatternPreset[]): boolean {
    const userDefault = this.getUserDefault(preset.generatorType, userPresets)
    return userDefault?.id === preset.id
  }

  /**
   * Get all user defaults across all pattern types
   * Useful for bulk operations or UI display
   */
  static getAllUserDefaults(userPresets: PatternPreset[]): PatternPreset[] {
    return userPresets.filter(preset => preset.isUserDefault === true)
  }
}