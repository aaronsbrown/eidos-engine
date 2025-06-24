// AIDEV-NOTE: Tests for semantic utility functions

import {
  getPlatformDefaultValue,
  getPerformanceDefaultValue,
  getPerformanceImpactingControls,
  getEducationalResources,
  findPatternsByMathConcept,
  getPerformanceWarning,
  getGroupedControls,
  getControlImpactDescription,
  isMobileFriendly,
  getRelatedPatterns
} from './semantic-utils'
import { patternGenerators } from '@/components/pattern-generators'
import type { RichPatternGeneratorDefinition, RichPatternControlDefinition } from './semantic-types'

describe('Semantic Utilities', () => {
  const particleSystem = patternGenerators.find(p => p.id === 'particle-system') as RichPatternGeneratorDefinition
  const enableTrailsControl = particleSystem.controls?.find(c => c.id === 'enableTrails') as RichPatternControlDefinition
  
  describe('getPlatformDefaultValue', () => {
    it('should return platform-specific defaults when available', () => {
      expect(getPlatformDefaultValue(enableTrailsControl, 'mobile')).toBe(false)
      expect(getPlatformDefaultValue(enableTrailsControl, 'desktop')).toBe(true)
    })

    it('should return default value when no platform recommendation exists', () => {
      const control: RichPatternControlDefinition = {
        id: 'test',
        label: 'Test',
        type: 'range',
        defaultValue: 50,
        description: 'Test control',
        role: 'VisualAesthetic',
        impactsPerformance: 'Minor'
      }
      
      expect(getPlatformDefaultValue(control, 'mobile')).toBe(50)
      expect(getPlatformDefaultValue(control, 'desktop')).toBe(50)
    })
  })

  describe('getPerformanceDefaultValue', () => {
    it('should return performance-based defaults when available', () => {
      const trailQuality = particleSystem.controls?.find(c => c.id === 'trailQuality') as RichPatternControlDefinition
      
      expect(getPerformanceDefaultValue(trailQuality, 'low')).toBe('low')
      expect(getPerformanceDefaultValue(trailQuality, 'high')).toBe('high')
    })
  })

  describe('getPerformanceImpactingControls', () => {
    it('should return controls with moderate or significant performance impact', () => {
      const impactingControls = getPerformanceImpactingControls(particleSystem)
      
      expect(impactingControls.length).toBeGreaterThan(0)
      expect(impactingControls.some(c => c.id === 'particleCount')).toBe(true)
      expect(impactingControls.some(c => c.id === 'enableTrails')).toBe(true)
      expect(impactingControls.every(c => 
        c.impactsPerformance === 'Moderate' || c.impactsPerformance === 'Significant'
      )).toBe(true)
    })
  })

  describe('getEducationalResources', () => {
    it('should return educational links when available', () => {
      const noisePattern = patternGenerators.find(p => p.id === 'noise') as RichPatternGeneratorDefinition
      const resources = getEducationalResources(noisePattern)
      
      expect(resources.length).toBeGreaterThan(0)
      expect(resources[0].title).toBe('Perlin Noise')
      expect(resources[0].url).toContain('wikipedia.org')
    })
  })

  describe('findPatternsByMathConcept', () => {
    it('should find patterns by mathematical concept', () => {
      const patterns = patternGenerators as RichPatternGeneratorDefinition[]
      
      const chaosPatterns = findPatternsByMathConcept(patterns, 'ChaosTheory')
      expect(chaosPatterns.length).toBeGreaterThan(0)
      expect(chaosPatterns.some(p => p.id === 'brownian-motion')).toBe(true)
      
      const trigPatterns = findPatternsByMathConcept(patterns, 'Trigonometry')
      expect(trigPatterns.some(p => p.id === 'trigonometric-circle')).toBe(true)
    })
  })

  describe('getPerformanceWarning', () => {
    it('should return warning for high complexity patterns', () => {
      const warning = getPerformanceWarning(particleSystem)
      expect(warning).toContain('Performance scales with particle count')
    })

    it('should return null for low complexity patterns', () => {
      const trigPattern = patternGenerators.find(p => p.id === 'trigonometric-circle') as RichPatternGeneratorDefinition
      const warning = getPerformanceWarning(trigPattern)
      expect(warning).toBeNull()
    })
  })

  describe('getGroupedControls', () => {
    it('should group controls by their semantic group', () => {
      const groups = getGroupedControls(particleSystem.controls as RichPatternControlDefinition[])
      
      expect(groups['Particle Settings']).toBeDefined()
      expect(groups['Visual Effects']).toBeDefined()
      expect(groups['Physics']).toBeDefined()
      expect(groups['Trail Effects']).toBeDefined()
      
      expect(groups['Particle Settings'].some(c => c.id === 'particleCount')).toBe(true)
      expect(groups['Visual Effects'].some(c => c.id === 'brightness')).toBe(true)
    })
  })

  describe('getControlImpactDescription', () => {
    it('should return human-readable impact descriptions', () => {
      expect(getControlImpactDescription(enableTrailsControl)).toBe(
        'Considerable performance impact - adjust with care'
      )
      
      const speedControl = particleSystem.controls?.find(c => c.id === 'movementSpeed') as RichPatternControlDefinition
      expect(getControlImpactDescription(speedControl)).toBe(
        'No noticeable performance impact'
      )
    })
  })

  describe('isMobileFriendly', () => {
    it('should identify mobile-unfriendly patterns', () => {
      // Particle system has controls with mobile=false recommendations
      expect(isMobileFriendly(particleSystem)).toBe(false)
    })

    it('should identify mobile-friendly patterns', () => {
      const trigPattern = patternGenerators.find(p => p.id === 'trigonometric-circle') as RichPatternGeneratorDefinition
      expect(isMobileFriendly(trigPattern)).toBe(true)
    })
  })

  describe('getRelatedPatterns', () => {
    it('should find related patterns by direct relations and family', () => {
      const noisePattern = patternGenerators.find(p => p.id === 'noise') as RichPatternGeneratorDefinition
      const related = getRelatedPatterns(noisePattern, patternGenerators as RichPatternGeneratorDefinition[])
      
      expect(related.length).toBeGreaterThan(0)
      expect(related.some(p => p.id === 'pixelated-noise')).toBe(true) // Direct relation
      expect(related.some(p => p.id === 'brownian-motion')).toBe(true) // Same family + direct relation
    })
  })
})