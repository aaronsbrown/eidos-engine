// AIDEV-NOTE: Test utilities for preset-related behavioral tests
// Extracted common patterns to reduce duplication across test files

import type { PatternPreset } from '@/lib/preset-types'

/**
 * Create a mock user preset with sensible defaults
 */
export function createMockUserPreset(overrides: Partial<PatternPreset> = {}): PatternPreset {
  return {
    id: 'user-preset-1',
    name: 'My Custom Preset',
    generatorType: 'noise-field',
    parameters: {
      scale: 0.5,
      octaves: 4,
      frequency: 1.0
    },
    createdAt: new Date('2024-01-01'),
    contentHash: 'user-hash-123',
    isFactory: false,
    isDefault: false,
    ...overrides
  }
}

/**
 * Create a mock factory preset with sensible defaults
 */
export function createMockFactoryPreset(overrides: Partial<PatternPreset> = {}): PatternPreset {
  return {
    id: 'factory-preset-1',
    name: 'Factory Classic',
    generatorType: 'noise-field',
    parameters: {
      scale: 1.0,
      octaves: 6,
      frequency: 0.8
    },
    createdAt: new Date('2024-01-01'),
    contentHash: 'factory-hash-123',
    isFactory: true,
    isDefault: true,
    category: 'Classic',
    mathematicalSignificance: 'Standard parameters for noise generation',
    ...overrides
  }
}

/**
 * Create multiple mock presets for testing collections
 */
export function createMockPresets(count: number, basePreset: Partial<PatternPreset> = {}): PatternPreset[] {
  return Array.from({ length: count }, (_, index) => 
    createMockUserPreset({
      id: `preset-${index + 1}`,
      name: `Preset ${index + 1}`,
      ...basePreset
    })
  )
}

/**
 * Common mock setup for PresetManager
 */
export const mockPresetManager = {
  getEffectiveDefault: jest.fn(),
  getPresetsForGenerator: jest.fn(),
  loadPreset: jest.fn(),
  setUserDefault: jest.fn(),
  clearUserDefault: jest.fn(),
  getUserDefault: jest.fn(),
  loadUserPresets: jest.fn()
}

/**
 * Common mock setup for preset comparison utilities
 */
export const mockPresetComparison = {
  getPresetDisplayName: jest.fn((preset) => {
    if (!preset) return ''
    return preset.name
  }),
  isPresetModified: jest.fn(() => false)
}

/**
 * Setup common mocks for preset tests
 */
export function setupPresetMocks() {
  jest.mock('@/lib/preset-manager', () => ({
    PresetManager: mockPresetManager
  }))

  jest.mock('@/lib/preset-comparison', () => mockPresetComparison)
}

/**
 * Reset all mocks - call in beforeEach
 */
export function resetPresetMocks() {
  jest.clearAllMocks()
  Object.values(mockPresetManager).forEach(mock => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear()
    }
  })
  Object.values(mockPresetComparison).forEach(mock => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear()
    }
  })
}

/**
 * Common preset dropdown component props for testing
 */
export interface MockPresetDropdownProps {
  patternId: string
  currentValues?: Record<string, unknown>
  onPresetLoad: (presetId: string) => void
  presets?: Array<{
    id: string
    name: string
    generatorType: string
    isFactory?: boolean
    isDefault?: boolean
    isUserDefault?: boolean
  }>
}

/**
 * Default props for preset-related components
 */
export const defaultPresetDropdownProps: MockPresetDropdownProps = {
  patternId: 'noise-field',
  currentValues: {},
  onPresetLoad: jest.fn(),
  presets: []
}

/**
 * Common test scenarios as reusable data
 */
export const presetTestScenarios = {
  userDefaultExists: {
    userDefault: createMockUserPreset({ isUserDefault: true }),
    factoryDefault: createMockFactoryPreset(),
    description: 'pattern with user default'
  },
  
  onlyFactoryDefault: {
    userDefault: null,
    factoryDefault: createMockFactoryPreset(),
    description: 'pattern with only factory default'
  },
  
  noDefaults: {
    userDefault: null,
    factoryDefault: null,
    description: 'pattern with no defaults'
  }
}