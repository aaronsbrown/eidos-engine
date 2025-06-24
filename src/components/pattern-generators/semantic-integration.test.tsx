// AIDEV-NOTE: Integration tests verifying semantic metadata is accessible throughout the app

import { patternGenerators } from './index'
import { hasSemanticMetadata } from '@/lib/semantic-types'
import type { RichPatternGeneratorDefinition, RichPatternControlDefinition } from '@/lib/semantic-types'

describe('Semantic Metadata Integration', () => {
  describe('Pattern Access', () => {
    it('should provide access to semantic metadata fields', () => {
      // Verify all patterns have semantic metadata
      expect(patternGenerators.every(hasSemanticMetadata)).toBe(true)
      
      // Test accessing semantic fields
      const noisePattern = patternGenerators.find(p => p.id === 'noise') as RichPatternGeneratorDefinition
      expect(noisePattern).toBeDefined()
      
      // Core semantic fields
      expect(noisePattern.description).toBe("A flowing Perlin noise field with customizable color modes and animation speed.")
      expect(noisePattern.semantics.primaryAlgorithmFamily).toBe("NoiseFunction")
      expect(noisePattern.performance.computationalComplexity).toBe("Medium")
      expect(noisePattern.version).toBe("1.0.0")
      expect(noisePattern.status).toBe("Production")
    })

    it('should provide access to control semantic metadata', () => {
      const particleSystem = patternGenerators.find(p => p.id === 'particle-system') as RichPatternGeneratorDefinition
      expect(particleSystem).toBeDefined()
      
      const enableTrailsControl = particleSystem.controls?.find(c => c.id === 'enableTrails') as RichPatternControlDefinition
      expect(enableTrailsControl).toBeDefined()
      
      // Control semantic fields
      expect(enableTrailsControl.description).toContain("Toggle particle trail rendering")
      expect(enableTrailsControl.role).toBe("VisualAesthetic")
      expect(enableTrailsControl.impactsPerformance).toBe("Significant")
      
      // Platform recommendations
      expect(enableTrailsControl.defaultRecommendations).toBeDefined()
      expect(enableTrailsControl.defaultRecommendations?.platformSpecific?.mobile).toBe(false)
      expect(enableTrailsControl.defaultRecommendations?.platformSpecific?.desktop).toBe(true)
    })
  })

  describe('Type Safety', () => {
    it('should maintain type safety when accessing semantic fields', () => {
      // This test verifies TypeScript compilation with semantic types
      const pattern = patternGenerators[0] as RichPatternGeneratorDefinition
      
      // These should all be type-safe accesses
      const schemaVersion: "1.0" = pattern.schemaVersion
      const description: string = pattern.description
      const complexity = pattern.performance.computationalComplexity
      const isProduction = pattern.status === "Production"
      
      expect(schemaVersion).toBe("1.0")
      expect(typeof description).toBe("string")
      expect(complexity).toBeDefined()
      expect(typeof isProduction).toBe("boolean")
    })

    it('should handle optional semantic fields safely', () => {
      const pattern = patternGenerators[0] as RichPatternGeneratorDefinition
      
      // Optional fields should be safely accessible
      const longDesc = pattern.longDescription
      const educationalLinks = pattern.educationalLinks
      const relatedPatterns = pattern.relatedPatterns
      const isInteractive = pattern.isInteractive
      
      // These may or may not exist but should not cause errors
      expect(longDesc === undefined || typeof longDesc === 'string').toBe(true)
      expect(educationalLinks === undefined || Array.isArray(educationalLinks)).toBe(true)
      expect(relatedPatterns === undefined || Array.isArray(relatedPatterns)).toBe(true)
      expect(isInteractive === undefined || typeof isInteractive === 'boolean').toBe(true)
    })
  })

  describe('Backward Compatibility', () => {
    it('should maintain compatibility with basic PatternGenerator interface', () => {
      // Components expecting basic PatternGenerator should still work
      patternGenerators.forEach(pattern => {
        // Basic fields must exist
        expect(pattern.id).toBeDefined()
        expect(pattern.name).toBeDefined()
        expect(pattern.component).toBeDefined()
        expect(pattern.technology).toBeDefined()
        expect(pattern.category).toBeDefined()
        
        // Controls should have basic fields
        if (pattern.controls) {
          pattern.controls.forEach(control => {
            expect(control.id).toBeDefined()
            expect(control.label).toBeDefined()
            expect(control.type).toBeDefined()
            expect(control.defaultValue).toBeDefined()
          })
        }
      })
    })
  })

  describe('Semantic Query Capabilities', () => {
    it('should support querying patterns by semantic properties', () => {
      // Find all patterns related to noise
      const noisePatterns = patternGenerators.filter(p => 
        hasSemanticMetadata(p) && p.semantics.primaryAlgorithmFamily === "NoiseFunction"
      )
      expect(noisePatterns.length).toBeGreaterThan(0)
      expect(noisePatterns.some(p => p.id === 'noise')).toBe(true)
      
      // Find patterns with high computational complexity
      const complexPatterns = patternGenerators.filter(p =>
        hasSemanticMetadata(p) && 
        (p.performance.computationalComplexity === "High" || 
         p.performance.computationalComplexity === "VeryHigh")
      )
      expect(complexPatterns.length).toBeGreaterThan(0)
      
      // Find patterns with educational links
      const educationalPatterns = patternGenerators.filter(p =>
        hasSemanticMetadata(p) && p.educationalLinks && p.educationalLinks.length > 0
      )
      expect(educationalPatterns.length).toBeGreaterThan(0)
    })

    it('should support finding controls with platform-specific recommendations', () => {
      const controlsWithPlatformRecs = patternGenerators.flatMap(pattern => {
        if (!hasSemanticMetadata(pattern) || !pattern.controls) return []
        
        return pattern.controls.filter((control): control is RichPatternControlDefinition => 
          'defaultRecommendations' in control && 
          control.defaultRecommendations?.platformSpecific !== undefined
        )
      })
      
      expect(controlsWithPlatformRecs.length).toBeGreaterThan(0)
      
      // Verify we can access platform-specific values
      const trailControl = controlsWithPlatformRecs.find(c => c.id === 'enableTrails')
      expect(trailControl?.defaultRecommendations?.platformSpecific?.mobile).toBe(false)
      expect(trailControl?.defaultRecommendations?.platformSpecific?.desktop).toBe(true)
    })
  })
})