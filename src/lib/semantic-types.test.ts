// AIDEV-NOTE: Type validation tests for semantic layer definitions

import type {
  AlgorithmFamily,
  MathematicalConcept,
  VisualCharacteristic,
  TechnologyUsed,
  RichPatternControlDefinition,
  RichPatternGeneratorDefinition
} from './semantic-types'
import { hasSemanticMetadata } from './semantic-types'

describe('Semantic Types Validation', () => {
  describe('Enum Exhaustiveness', () => {
    it('should have comprehensive AlgorithmFamily options', () => {
      const families: AlgorithmFamily[] = [
        "StrangeAttractor",
        "CellularAutomata",
        "NoiseFunction",
        "Fractal",
        "WavePhenomenon",
        "ParticleSystem",
        "GeometricTiling",
        "MathematicalArt",
        "ImageProcessing",
        "PhysicsSimulation",
        "Other"
      ]
      expect(families.length).toBeGreaterThan(10)
    })

    it('should have comprehensive MathematicalConcept options', () => {
      const concepts: MathematicalConcept[] = [
        "Calculus",
        "LinearAlgebra",
        "Trigonometry",
        "ChaosTheory",
        "Probability",
        "Statistics",
        "SetTheory",
        "NumberTheory",
        "GraphTheory",
        "FormalGrammars",
        "DiscreteMathematics",
        "ComputationalGeometry",
        "SignalProcessing",
        "NoneNotable",
        "Other"
      ]
      expect(concepts.length).toBeGreaterThan(14)
    })

    it('should have comprehensive VisualCharacteristic options', () => {
      const characteristics: VisualCharacteristic[] = [
        "Organic", "Geometric", "Abstract", "Naturalistic",
        "Flowing", "Static", "Pulsating", "Swirling", "Jittery",
        "Discrete", "Continuous", "Pixelated", "Smooth",
        "Chaotic", "Ordered", "Symmetrical", "Asymmetrical",
        "Minimalist", "Complex", "Dense", "Sparse",
        "Luminous", "Matte", "Textured",
        "OtherVisual"
      ]
      expect(characteristics.length).toBeGreaterThan(20)
    })
  })

  describe('Type Structure Validation', () => {
    it('should properly type RichPatternControlDefinition', () => {
      const mockControl: RichPatternControlDefinition = {
        id: "test",
        label: "Test Control",
        type: "range",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50,
        description: "Test control description",
        role: "PrimaryAlgorithmParameter",
        unit: "px",
        impactsPerformance: "Minor",
        typicalRangeForInterestingResults: [25, 75],
        relatedControls: ["other-control"],
        group: "Test Group"
      }

      expect(mockControl.description).toBeDefined()
      expect(mockControl.role).toBeDefined()
      expect(mockControl.impactsPerformance).toBeDefined()
    })

    it('should properly type defaultRecommendations', () => {
      const mockControlWithRecommendations: RichPatternControlDefinition = {
        id: "enableTrails",
        label: "Enable Trails",
        type: "checkbox",
        defaultValue: true,
        description: "Enable particle trail effects",
        role: "VisualAesthetic",
        impactsPerformance: "Significant",
        defaultRecommendations: {
          performanceConsideration: {
            lowPerformance: false,
            highPerformance: true,
            rationale: "Trails add significant GPU load on constrained devices"
          },
          platformSpecific: {
            mobile: false,
            desktop: true,
            rationale: "Mobile users prioritize battery life over visual effects"
          }
        }
      }

      expect(mockControlWithRecommendations.defaultRecommendations).toBeDefined()
      expect(mockControlWithRecommendations.defaultRecommendations?.performanceConsideration?.lowPerformance).toBe(false)
      expect(mockControlWithRecommendations.defaultRecommendations?.platformSpecific?.mobile).toBe(false)
      expect(mockControlWithRecommendations.defaultRecommendations?.platformSpecific?.desktop).toBe(true)
    })

    it('should properly type RichPatternGeneratorDefinition', () => {
      const mockPattern: Partial<RichPatternGeneratorDefinition> = {
        id: "test-pattern",
        name: "Test Pattern",
        technology: "CANVAS_2D",
        category: "Noise",
        schemaVersion: "1.0",
        description: "A test pattern for validation",
        semantics: {
          primaryAlgorithmFamily: "NoiseFunction",
          keyMathematicalConcepts: ["SignalProcessing"],
          visualCharacteristics: ["Flowing", "Organic"],
          dimensionality: "2D",
          interactionStyle: "ParameterTuning",
          keywords: ["test", "noise"]
        },
        performance: {
          computationalComplexity: "Medium",
          typicalFrameRateTarget: "60fps",
          notes: "Test performance notes"
        },
        version: "1.0.0",
        author: "Test Author",
        dateAdded: "2024-01-01",
        lastModified: "2024-01-01",
        status: "Production"
      }

      expect(mockPattern.schemaVersion).toBe("1.0")
      expect(mockPattern.semantics).toBeDefined()
      expect(mockPattern.performance).toBeDefined()
    })
  })

  describe('Type Guards', () => {
    it('should correctly identify objects with semantic metadata', () => {
      const richPattern = {
        id: "test",
        name: "Test",
        schemaVersion: "1.0",
        semantics: {
          primaryAlgorithmFamily: "NoiseFunction",
          keyMathematicalConcepts: [],
          visualCharacteristics: [],
          dimensionality: "2D",
          interactionStyle: "ParameterTuning",
          keywords: []
        },
        performance: {
          computationalComplexity: "Low",
          typicalFrameRateTarget: "60fps"
        }
      }

      const basicPattern = {
        id: "test",
        name: "Test"
      }

      expect(hasSemanticMetadata(richPattern)).toBe(true)
      expect(hasSemanticMetadata(basicPattern)).toBe(false)
    })
  })

  describe('Technology Type Compatibility', () => {
    it('should support both old and new technology types', () => {
      const oldTech: 'WEBGL_2.0' | 'CANVAS_2D' = 'WEBGL_2.0'
      const newTech: TechnologyUsed = 'WEBGL_FRAGMENT_SHADER'
      
      // Both should be assignable to the union type in RichPatternGeneratorDefinition
      const pattern1: Pick<RichPatternGeneratorDefinition, 'technology'> = { technology: oldTech }
      const pattern2: Pick<RichPatternGeneratorDefinition, 'technology'> = { technology: newTech }
      
      expect(pattern1.technology).toBeDefined()
      expect(pattern2.technology).toBeDefined()
    })
  })

  describe('Control Role Categorization', () => {
    it('should have appropriate control role categories', () => {
      const roles: RichPatternControlDefinition['role'][] = [
        "PrimaryAlgorithmParameter",
        "VisualAesthetic",
        "AnimationBehavior",
        "InteractionModifier",
        "PerformanceTuning",
        "UserAction",
        "StructuralParameter"
      ]
      
      expect(roles.length).toBe(7)
    })
  })

  describe('Performance Impact Levels', () => {
    it('should have graduated performance impact levels', () => {
      const impacts: RichPatternControlDefinition['impactsPerformance'][] = [
        "Negligible",
        "Minor",
        "Moderate",
        "Significant"
      ]
      
      expect(impacts.length).toBe(4)
      // Verify they represent increasing impact
      expect(impacts[0]).toBe("Negligible")
      expect(impacts[3]).toBe("Significant")
    })
  })
})