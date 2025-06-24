// AIDEV-NOTE: Validation tests for semantic metadata completeness and accuracy

import { patternGenerators } from './index'
import type { RichPatternGeneratorDefinition, RichPatternControlDefinition } from '@/lib/semantic-types'
import { hasSemanticMetadata } from '@/lib/semantic-types'

describe('Pattern Semantic Metadata Validation', () => {
  describe('Pattern Metadata Completeness', () => {
    it('should have semantic metadata for all patterns', () => {
      const patternsWithSemantics = patternGenerators.filter(hasSemanticMetadata)
      
      // Initially this will fail until we migrate patterns
      expect(patternsWithSemantics.length).toBe(patternGenerators.length)
    })

    it('should have required fields for patterns with semantic metadata', () => {
      const semanticPatterns = patternGenerators.filter(hasSemanticMetadata) as RichPatternGeneratorDefinition[]
      
      semanticPatterns.forEach(pattern => {
        // Core fields
        expect(pattern.id).toBeDefined()
        expect(pattern.name).toBeDefined()
        expect(pattern.component).toBeDefined()
        expect(pattern.technology).toBeDefined()
        expect(pattern.category).toBeDefined()
        
        // Semantic fields
        expect(pattern.schemaVersion).toBe("1.0")
        expect(pattern.description).toBeDefined()
        expect(pattern.description.length).toBeGreaterThan(10)
        
        // Semantic tags
        expect(pattern.semantics).toBeDefined()
        expect(pattern.semantics.primaryAlgorithmFamily).toBeDefined()
        expect(pattern.semantics.keyMathematicalConcepts).toBeInstanceOf(Array)
        expect(pattern.semantics.keyMathematicalConcepts.length).toBeGreaterThan(0)
        expect(pattern.semantics.visualCharacteristics).toBeInstanceOf(Array)
        expect(pattern.semantics.visualCharacteristics.length).toBeGreaterThan(0)
        expect(pattern.semantics.dimensionality).toBeDefined()
        expect(pattern.semantics.interactionStyle).toBeDefined()
        expect(pattern.semantics.keywords).toBeInstanceOf(Array)
        
        // Performance profile
        expect(pattern.performance).toBeDefined()
        expect(pattern.performance.computationalComplexity).toBeDefined()
        expect(pattern.performance.typicalFrameRateTarget).toBeDefined()
        
        // Metadata
        expect(pattern.version).toMatch(/^\d+\.\d+\.\d+$/) // Semantic versioning
        expect(pattern.author).toBeDefined()
        expect(pattern.dateAdded).toMatch(/^\d{4}-\d{2}-\d{2}$/) // ISO date
        expect(pattern.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}$/) // ISO date
        expect(pattern.status).toBeDefined()
      })
    })
  })

  describe('Control Metadata Completeness', () => {
    it('should have semantic metadata for all controls', () => {
      const semanticPatterns = patternGenerators.filter(hasSemanticMetadata) as RichPatternGeneratorDefinition[]
      
      semanticPatterns.forEach(pattern => {
        if (pattern.controls) {
          pattern.controls.forEach((control: RichPatternControlDefinition) => {
            // Basic control fields
            expect(control.id).toBeDefined()
            expect(control.label).toBeDefined()
            expect(control.type).toBeDefined()
            expect(control.defaultValue).toBeDefined()
            
            // Semantic control fields
            expect(control.description).toBeDefined()
            expect(control.description.length).toBeGreaterThan(10)
            expect(control.role).toBeDefined()
            expect(control.impactsPerformance).toBeDefined()
            
            // Type-specific validations
            if (control.type === 'range') {
              expect(control.min).toBeDefined()
              expect(control.max).toBeDefined()
              expect(control.step).toBeDefined()
            }
            
            if (control.type === 'select') {
              expect(control.options).toBeDefined()
              expect(control.options!.length).toBeGreaterThan(0)
            }
          })
        }
      })
    })

    it('should have appropriate performance impact levels', () => {
      const semanticPatterns = patternGenerators.filter(hasSemanticMetadata) as RichPatternGeneratorDefinition[]
      
      semanticPatterns.forEach(pattern => {
        if (pattern.controls) {
          pattern.controls.forEach((control: RichPatternControlDefinition) => {
            // Performance tuning controls should have higher impact
            if (control.role === 'PerformanceTuning') {
              expect(['Moderate', 'Significant']).toContain(control.impactsPerformance)
            }
            
            // User action controls should have negligible impact
            if (control.role === 'UserAction') {
              expect(control.impactsPerformance).toBe('Negligible')
            }
          })
        }
      })
    })

    it('should have platform recommendations for performance-impacting controls', () => {
      const semanticPatterns = patternGenerators.filter(hasSemanticMetadata) as RichPatternGeneratorDefinition[]
      
      semanticPatterns.forEach(pattern => {
        if (pattern.controls) {
          pattern.controls.forEach((control: RichPatternControlDefinition) => {
            // Controls with significant performance impact should have recommendations
            if (control.impactsPerformance === 'Significant') {
              expect(control.defaultRecommendations).toBeDefined()
              expect(
                control.defaultRecommendations?.performanceConsideration ||
                control.defaultRecommendations?.platformSpecific
              ).toBeDefined()
            }
          })
        }
      })
    })
  })

  describe('Pattern Categorization Accuracy', () => {
    it('should have appropriate categories for each pattern type', () => {
      const semanticPatterns = patternGenerators.filter(hasSemanticMetadata) as RichPatternGeneratorDefinition[]
      
      semanticPatterns.forEach(pattern => {
        // Verify category matches algorithm family
        switch (pattern.semantics.primaryAlgorithmFamily) {
          case 'NoiseFunction':
            expect(pattern.category).toBe('Noise')
            break
          case 'GeometricTiling':
          case 'MathematicalArt':
            expect(pattern.category).toBe('Geometric')
            break
          case 'ParticleSystem':
          case 'CellularAutomata':
          case 'PhysicsSimulation':
            expect(pattern.category).toBe('Simulation')
            break
        }
      })
    })
  })

  describe('Technology Alignment', () => {
    it('should have appropriate technology for computational complexity', () => {
      const semanticPatterns = patternGenerators.filter(hasSemanticMetadata) as RichPatternGeneratorDefinition[]
      
      semanticPatterns.forEach(pattern => {
        // High complexity patterns should generally use WebGL
        if (pattern.performance.computationalComplexity === 'High' || 
            pattern.performance.computationalComplexity === 'VeryHigh') {
          expect(pattern.technology).toMatch(/WEBGL/)
        }
      })
    })
  })

  describe('Related Patterns Validation', () => {
    it('should have valid related pattern references', () => {
      const semanticPatterns = patternGenerators.filter(hasSemanticMetadata) as RichPatternGeneratorDefinition[]
      const allPatternIds = patternGenerators.map(p => p.id)
      
      semanticPatterns.forEach(pattern => {
        if (pattern.relatedPatterns) {
          pattern.relatedPatterns.forEach(relatedId => {
            expect(allPatternIds).toContain(relatedId)
          })
        }
      })
    })
  })

  describe('Control Relationships', () => {
    it('should have valid related control references', () => {
      const semanticPatterns = patternGenerators.filter(hasSemanticMetadata) as RichPatternGeneratorDefinition[]
      
      semanticPatterns.forEach(pattern => {
        if (pattern.controls) {
          const controlIds = pattern.controls.map((c: RichPatternControlDefinition) => c.id)
          
          pattern.controls.forEach((control: RichPatternControlDefinition) => {
            if (control.relatedControls) {
              control.relatedControls.forEach(relatedId => {
                expect(controlIds).toContain(relatedId)
              })
            }
          })
        }
      })
    })
  })
})