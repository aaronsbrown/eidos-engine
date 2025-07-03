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
  getRelatedPatterns,
  getPatternsWithEducationalContent,
  findPatternsByEducationalContentId,
  getEducationalCrossReferences,
  findPatternsByRelatedConcept,
  getAllEducationalContentIds,
  getAllRelatedConcepts,
  buildEducationalContentNetwork
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

  // AIDEV-NOTE: Tests for new educational content metadata functionality
  describe('Educational Content Utilities', () => {
    const richPatterns = patternGenerators as RichPatternGeneratorDefinition[]
    
    describe('getPatternsWithEducationalContent', () => {
      it('should return only patterns with educational content metadata', () => {
        const patternsWithEducation = getPatternsWithEducationalContent(richPatterns)
        
        expect(patternsWithEducation.length).toBeGreaterThan(0)
        
        // All returned patterns should have educational content
        patternsWithEducation.forEach(pattern => {
          expect(pattern.semantics?.educationalContent).toBeDefined()
          expect(pattern.semantics.educationalContent?.contentId).toBeDefined()
        })
        
        // Should include patterns we know have educational content
        expect(patternsWithEducation.some(p => p.id === 'noise')).toBe(true)
        expect(patternsWithEducation.some(p => p.id === 'lorenz-attractor')).toBe(true)
      })
    })

    describe('findPatternsByEducationalContentId', () => {
      it('should find patterns by specific content ID', () => {
        const noisePatterns = findPatternsByEducationalContentId(richPatterns, 'noise')
        
        expect(noisePatterns.length).toBe(1)
        expect(noisePatterns[0].id).toBe('noise')
        expect(noisePatterns[0].semantics.educationalContent?.contentId).toBe('noise')
      })

      it('should return empty array for non-existent content ID', () => {
        const nonExistentPatterns = findPatternsByEducationalContentId(richPatterns, 'non-existent-content')
        expect(nonExistentPatterns).toEqual([])
      })
    })

    describe('getEducationalCrossReferences', () => {
      it('should find patterns that reference a target pattern', () => {
        const patternsReferencingNoise = getEducationalCrossReferences(richPatterns, 'noise')
        
        expect(patternsReferencingNoise.length).toBeGreaterThan(0)
        
        // Should include patterns that cross-reference noise
        expect(patternsReferencingNoise.some(p => p.id === 'pixelated-noise')).toBe(true)
        expect(patternsReferencingNoise.some(p => p.id === 'brownian-motion')).toBe(true)
        
        // Each pattern should actually reference noise in its cross-references
        patternsReferencingNoise.forEach(pattern => {
          expect(pattern.semantics.educationalContent?.crossReferences).toContain('noise')
        })
      })

      it('should return empty array for patterns with no references', () => {
        const noReferences = getEducationalCrossReferences(richPatterns, 'non-existent-pattern')
        expect(noReferences).toEqual([])
      })
    })

    describe('findPatternsByRelatedConcept', () => {
      it('should find patterns by related educational concept', () => {
        const chaosPatterns = findPatternsByRelatedConcept(richPatterns, 'chaos-theory')
        
        expect(chaosPatterns.length).toBeGreaterThan(0)
        
        // Should include attractor patterns which have chaos-theory concept
        expect(chaosPatterns.some(p => p.id === 'lorenz-attractor')).toBe(true)
        expect(chaosPatterns.some(p => p.id === 'aizawa-attractor')).toBe(true)
        
        // Each pattern should have the concept in its related concepts
        chaosPatterns.forEach(pattern => {
          expect(pattern.semantics.educationalContent?.relatedConcepts).toContain('chaos-theory')
        })
      })

      it('should return empty array for non-existent concept', () => {
        const nonExistentConcept = findPatternsByRelatedConcept(richPatterns, 'non-existent-concept')
        expect(nonExistentConcept).toEqual([])
      })
    })

    describe('getAllEducationalContentIds', () => {
      it('should return all unique content IDs', () => {
        const contentIds = getAllEducationalContentIds(richPatterns)
        
        expect(contentIds.length).toBeGreaterThan(0)
        expect(Array.isArray(contentIds)).toBe(true)
        
        // Should include known content IDs
        expect(contentIds).toContain('noise')
        expect(contentIds).toContain('lorenz-attractor')
        expect(contentIds).toContain('particle-system')
        
        // Should be unique (no duplicates)
        expect(new Set(contentIds).size).toBe(contentIds.length)
      })
    })

    describe('getAllRelatedConcepts', () => {
      it('should return all unique related concepts', () => {
        const concepts = getAllRelatedConcepts(richPatterns)
        
        expect(concepts.length).toBeGreaterThan(0)
        expect(Array.isArray(concepts)).toBe(true)
        
        // Should include known concepts
        expect(concepts).toContain('chaos-theory')
        expect(concepts).toContain('perlin-noise')
        
        // Should be unique (no duplicates)
        expect(new Set(concepts).size).toBe(concepts.length)
      })
    })

    describe('buildEducationalContentNetwork', () => {
      it('should build a complete cross-reference network', () => {
        const network = buildEducationalContentNetwork(richPatterns)
        
        expect(typeof network).toBe('object')
        expect(Object.keys(network).length).toBeGreaterThan(0)
        
        // Should include patterns with educational content
        expect(network['noise']).toBeDefined()
        expect(network['lorenz-attractor']).toBeDefined()
        
        // Cross-references should be arrays
        expect(Array.isArray(network['noise'])).toBe(true)
        expect(Array.isArray(network['lorenz-attractor'])).toBe(true)
        
        // Noise should reference pixelated-noise and brownian-motion
        expect(network['noise']).toContain('pixelated-noise')
        expect(network['noise']).toContain('brownian-motion')
        
        // Attractors should reference each other
        expect(network['lorenz-attractor']).toContain('thomas-attractor')
        expect(network['lorenz-attractor']).toContain('aizawa-attractor')
      })

      it('should handle patterns without educational content', () => {
        const mockPattern: RichPatternGeneratorDefinition = {
          id: 'test-pattern',
          name: 'Test Pattern',
          component: (() => null) as React.ComponentType<import("@/components/pattern-generators/types").PatternGeneratorProps>,
          technology: 'CANVAS_2D',
          category: 'Noise',
          schemaVersion: '1.0',
          description: 'Test',
          semantics: {
            primaryAlgorithmFamily: 'NoiseFunction',
            keyMathematicalConcepts: ['Calculus'],
            visualCharacteristics: ['Organic'],
            dimensionality: '2D',
            interactionStyle: 'ParameterTuning',
            keywords: ['test']
            // No educationalContent
          },
          performance: {
            computationalComplexity: 'Low',
            typicalFrameRateTarget: '60fps'
          },
          version: '1.0.0',
          author: 'Test',
          dateAdded: '2024-01-01',
          lastModified: '2024-01-01',
          status: 'Production'
        }
        
        const network = buildEducationalContentNetwork([mockPattern])
        expect(Object.keys(network)).toEqual([])
      })
    })
  })
})