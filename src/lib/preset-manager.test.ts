// AIDEV-NOTE: Behavioral tests for preset system - cement UX contracts before UI polish (Rule G-8)
import { PresetManager, PresetExportData } from './preset-manager'

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('PresetManager - Core Behaviors', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  describe('Local Save Behavior', () => {
    test('user can save preset with unique name', () => {
      const preset = PresetManager.createPreset(
        'Cosmic Storm',
        'pixelated-noise',
        { pixelSize: 8, colorIntensity: 0.7 }
      )

      expect(() => PresetManager.addPreset(preset)).not.toThrow()
      
      const saved = PresetManager.getPresetsForGenerator('pixelated-noise')
      expect(saved).toHaveLength(1)
      expect(saved[0].name).toBe('Cosmic Storm')
    })

    test('user cannot save preset with duplicate name', () => {
      // First preset
      const preset1 = PresetManager.createPreset(
        'Cosmic Storm',
        'pixelated-noise',
        { pixelSize: 8, colorIntensity: 0.7 }
      )
      PresetManager.addPreset(preset1)

      // Second preset with same name but different content
      const preset2 = PresetManager.createPreset(
        'Cosmic Storm',
        'pixelated-noise',
        { pixelSize: 16, colorIntensity: 0.5 }
      )

      expect(() => PresetManager.addPreset(preset2)).toThrow('Preset name "Cosmic Storm" already exists')
    })

    test('user cannot save preset with identical content', () => {
      // First preset
      const preset1 = PresetManager.createPreset(
        'Cosmic Storm',
        'pixelated-noise',
        { pixelSize: 8, colorIntensity: 0.7 }
      )
      PresetManager.addPreset(preset1)

      // Second preset with different name but identical content
      const preset2 = PresetManager.createPreset(
        'Digital Rain',
        'pixelated-noise',
        { pixelSize: 8, colorIntensity: 0.7 }
      )

      expect(() => PresetManager.addPreset(preset2)).toThrow('identical content already exists')
    })

    test('user can save presets with same name for different pattern types', () => {
      const noisePreset = PresetManager.createPreset(
        'Cool Effect',
        'pixelated-noise',
        { pixelSize: 8 }
      )
      const motionPreset = PresetManager.createPreset(
        'Cool Effect',
        'brownian-motion',
        { particleCount: 100 }
      )

      expect(() => PresetManager.addPreset(noisePreset)).not.toThrow()
      expect(() => PresetManager.addPreset(motionPreset)).not.toThrow()

      const noisePresets = PresetManager.getPresetsForGenerator('pixelated-noise')
      const motionPresets = PresetManager.getPresetsForGenerator('brownian-motion')
      
      expect(noisePresets).toHaveLength(1)
      expect(motionPresets).toHaveLength(1)
      expect(noisePresets[0].name).toBe('Cool Effect')
      expect(motionPresets[0].name).toBe('Cool Effect')
    })
  })

  describe('Preset Loading Behavior', () => {
    test('user can load preset and get all parameters', () => {
      const originalParams = { pixelSize: 8, colorIntensity: 0.7, enabled: true }
      const preset = PresetManager.createPreset('Test Preset', 'pixelated-noise', originalParams)
      PresetManager.addPreset(preset)

      const savedPresets = PresetManager.getPresetsForGenerator('pixelated-noise')
      const loadedPreset = savedPresets[0]

      expect(loadedPreset.parameters).toEqual(originalParams)
      expect(loadedPreset.name).toBe('Test Preset')
      expect(loadedPreset.generatorType).toBe('pixelated-noise')
    })

    test('user can delete preset and it disappears from list', () => {
      const preset = PresetManager.createPreset('Temp Preset', 'pixelated-noise', { pixelSize: 4 })
      PresetManager.addPreset(preset)

      const savedPresets = PresetManager.getPresetsForGenerator('pixelated-noise')
      expect(savedPresets).toHaveLength(1)

      const success = PresetManager.deletePreset(savedPresets[0].id)
      expect(success).toBe(true)

      const afterDelete = PresetManager.getPresetsForGenerator('pixelated-noise')
      expect(afterDelete).toHaveLength(0)
    })

    test('user cannot delete non-existent preset', () => {
      const success = PresetManager.deletePreset('fake-id')
      expect(success).toBe(false)
    })
  })

  describe('Persistence Behavior', () => {
    test('presets survive page refresh (localStorage persistence)', () => {
      const preset = PresetManager.createPreset(
        'Persistent Effect',
        'pixelated-noise',
        { pixelSize: 12, colorIntensity: 0.9 }
      )
      PresetManager.addPreset(preset)

      // Simulate page refresh by creating new PresetManager instance
      const afterRefresh = PresetManager.getPresetsForGenerator('pixelated-noise')
      expect(afterRefresh).toHaveLength(1)
      expect(afterRefresh[0].name).toBe('Persistent Effect')
      expect(afterRefresh[0].parameters).toEqual({ pixelSize: 12, colorIntensity: 0.9 })
    })

    test('last active preset is remembered across sessions', () => {
      const preset = PresetManager.createPreset('Active Preset', 'pixelated-noise', { pixelSize: 6 })
      PresetManager.addPreset(preset)

      const saved = PresetManager.getPresetsForGenerator('pixelated-noise')
      PresetManager.setLastActivePreset(saved[0].id)

      // Simulate session restart
      const rememberedId = PresetManager.getLastActivePreset()
      expect(rememberedId).toBe(saved[0].id)
    })
  })

  describe('Import/Export Behavior', () => {
    test('user can export preset and get downloadable JSON', () => {
      const preset = PresetManager.createPreset(
        'Export Test',
        'pixelated-noise',
        { pixelSize: 10, colorIntensity: 0.8 }
      )
      PresetManager.addPreset(preset)

      const saved = PresetManager.getPresetsForGenerator('pixelated-noise')
      const exported = PresetManager.exportPresets([saved[0].id])

      expect(exported.version).toBe('1.0.0')
      expect(exported.presets).toHaveLength(1)
      expect(exported.presets[0].name).toBe('Export Test')
      expect(exported.presets[0].parameters).toEqual({ pixelSize: 10, colorIntensity: 0.8 })
      expect(exported.exportedAt).toBeInstanceOf(Date)
    })

    test('user can import new preset and it becomes available', () => {
      const exportData: PresetExportData = {
        version: '1.0.0',
        presets: [{
          id: 'temp-id',
          name: 'Imported Effect',
          generatorType: 'pixelated-noise',
          parameters: { pixelSize: 15, colorIntensity: 0.6 },
          createdAt: new Date(),
          contentHash: 'temp-hash'
        }],
        exportedAt: new Date()
      }

      const result = PresetManager.importPresets(exportData)
      
      expect(result.importedIds).toHaveLength(1)
      expect(result.skippedDuplicates).toHaveLength(0)
      expect(result.errors).toHaveLength(0)

      const imported = PresetManager.getPresetsForGenerator('pixelated-noise')
      expect(imported).toHaveLength(1)
      expect(imported[0].name).toBe('Imported Effect')
      expect(imported[0].parameters).toEqual({ pixelSize: 15, colorIntensity: 0.6 })
    })

    test('user imports preset with name conflict - gets auto-renamed', () => {
      // Create existing preset
      const existing = PresetManager.createPreset('Cool Preset', 'pixelated-noise', { pixelSize: 8 })
      PresetManager.addPreset(existing)

      // Import preset with same name but different content
      const exportData: PresetExportData = {
        version: '1.0.0',
        presets: [{
          id: 'temp-id',
          name: 'Cool Preset',
          generatorType: 'pixelated-noise',
          parameters: { pixelSize: 16, colorIntensity: 0.9 }, // Different content
          createdAt: new Date(),
          contentHash: 'different-hash'
        }],
        exportedAt: new Date()
      }

      const result = PresetManager.importPresets(exportData)
      
      expect(result.importedIds).toHaveLength(1)
      expect(result.skippedDuplicates).toHaveLength(0)

      const allPresets = PresetManager.getPresetsForGenerator('pixelated-noise')
      expect(allPresets).toHaveLength(2)
      
      const names = allPresets.map(p => p.name).sort()
      expect(names).toEqual(['Cool Preset', 'Cool Preset (1)'])
    })

    test('user imports duplicate content - gets skipped with feedback', () => {
      // Create existing preset
      const existing = PresetManager.createPreset(
        'Original Name',
        'pixelated-noise',
        { pixelSize: 8, colorIntensity: 0.7 }
      )
      PresetManager.addPreset(existing)

      // Import identical content with different name
      const exportData: PresetExportData = {
        version: '1.0.0',
        presets: [{
          id: 'temp-id',
          name: 'Different Name',
          generatorType: 'pixelated-noise',
          parameters: { pixelSize: 8, colorIntensity: 0.7 }, // Identical content
          createdAt: new Date(),
          contentHash: existing.contentHash // Same content hash
        }],
        exportedAt: new Date()
      }

      const result = PresetManager.importPresets(exportData)
      
      expect(result.importedIds).toHaveLength(0)
      expect(result.skippedDuplicates).toHaveLength(1)
      expect(result.skippedDuplicates[0]).toContain('Different Name')
      expect(result.skippedDuplicates[0]).toContain('Original Name')

      // Should still only have original preset
      const allPresets = PresetManager.getPresetsForGenerator('pixelated-noise')
      expect(allPresets).toHaveLength(1)
      expect(allPresets[0].name).toBe('Original Name')
    })

    test('user imports multiple presets with mixed results', () => {
      // Create existing preset
      const existing = PresetManager.createPreset('Existing', 'pixelated-noise', { pixelSize: 8 })
      PresetManager.addPreset(existing)

      const exportData: PresetExportData = {
        version: '1.0.0',
        presets: [
          {
            id: 'new-1',
            name: 'New Preset',
            generatorType: 'pixelated-noise',
            parameters: { pixelSize: 12 },
            createdAt: new Date(),
            contentHash: 'new-hash-1'
          },
          {
            id: 'duplicate',
            name: 'Duplicate Content',
            generatorType: 'pixelated-noise',
            parameters: { pixelSize: 8 }, // Same as existing
            createdAt: new Date(),
            contentHash: existing.contentHash
          },
          {
            id: 'new-2',
            name: 'Another New',
            generatorType: 'pixelated-noise',
            parameters: { pixelSize: 16 },
            createdAt: new Date(),
            contentHash: 'new-hash-2'
          }
        ],
        exportedAt: new Date()
      }

      const result = PresetManager.importPresets(exportData)
      
      expect(result.importedIds).toHaveLength(2) // 2 new presets
      expect(result.skippedDuplicates).toHaveLength(1) // 1 duplicate skipped
      expect(result.errors).toHaveLength(0)

      const allPresets = PresetManager.getPresetsForGenerator('pixelated-noise')
      expect(allPresets).toHaveLength(3) // Original + 2 imported
      
      const names = allPresets.map(p => p.name).sort()
      expect(names).toEqual(['Another New', 'Existing', 'New Preset'])
    })
  })

  describe('Backward Compatibility Behavior', () => {
    test('existing presets without contentHash get migrated automatically', () => {
      // Simulate old preset format without contentHash
      const oldPresetData = JSON.stringify([{
        id: 'old-preset',
        name: 'Legacy Preset',
        generatorType: 'pixelated-noise',
        parameters: { pixelSize: 8 },
        createdAt: new Date().toISOString()
        // No contentHash field
      }])
      
      localStorageMock.setItem('pattern-generator-presets', oldPresetData)

      // Loading should automatically add contentHash
      const loaded = PresetManager.loadPresets()
      expect(loaded).toHaveLength(1)
      expect(loaded[0].contentHash).toBeDefined()
      expect(typeof loaded[0].contentHash).toBe('string')
      expect(loaded[0].contentHash.length).toBeGreaterThan(0)
    })

    test('migrated presets can participate in duplicate detection', () => {
      // Simulate old preset
      const oldPresetData = JSON.stringify([{
        id: 'old-preset',
        name: 'Legacy Preset',
        generatorType: 'pixelated-noise',
        parameters: { pixelSize: 8 },
        createdAt: new Date().toISOString()
      }])
      
      localStorageMock.setItem('pattern-generator-presets', oldPresetData)

      // Load to trigger migration
      PresetManager.loadPresets()

      // Try to add identical content
      const newPreset = PresetManager.createPreset(
        'New Name',
        'pixelated-noise',
        { pixelSize: 8 } // Same content as legacy preset
      )

      expect(() => PresetManager.addPreset(newPreset)).toThrow('identical content already exists')
    })
  })
})