import TrigonometricCircleGenerator from "./trigonometric-circle-generator"
import FourPoleGradientGenerator from "./four-pole-gradient-generator"
import type { RichPatternGeneratorDefinition } from "@/lib/semantic-types"

// AIDEV-NOTE: Extracted from main index.ts for better maintainability and context window usage
// AIDEV-NOTE: Contains all geometric pattern generators with rich semantic metadata
export const geometricPatterns: RichPatternGeneratorDefinition[] = [
  {
    id: "trigonometric-circle",
    name: "Trigonometric Circle",
    component: TrigonometricCircleGenerator,
    technology: 'CANVAS_2D',
    category: 'Geometric',
    schemaVersion: "1.0",
    description: "An animated unit circle demonstrating sine and cosine relationships in real-time.",
    longDescription: "Educational visualization showing the relationship between circular motion and trigonometric functions. Displays how sine and cosine values change as a point rotates around the unit circle.",
    semantics: {
      primaryAlgorithmFamily: "MathematicalArt",
      keyMathematicalConcepts: ["Trigonometry", "LinearAlgebra"],
      visualCharacteristics: ["Geometric", "Minimalist", "Ordered", "Flowing"],
      dimensionality: "2D",
      interactionStyle: "ParameterTuning",
      keywords: ["unit circle", "sine", "cosine", "trigonometry", "educational"],
      educationalContent: {
        contentId: "trigonometric-circle",
        relatedConcepts: ["trigonometry", "unit-circle", "periodic-functions"],
        crossReferences: ["four-pole-gradient"]
      }
    },
    performance: {
      computationalComplexity: "VeryLow",
      typicalFrameRateTarget: "60fps",
      notes: "Minimal computation - just basic trigonometric calculations"
    },
    educationalLinks: [
      {
        title: "Unit Circle",
        url: "https://en.wikipedia.org/wiki/Unit_circle",
        type: "Reference"
      }
    ],
    version: "1.0.0",
    author: "Aaron Brown & Claude",
    dateAdded: "2024-01-01",
    lastModified: "2024-06-24",
    isInteractive: false,
    isAnimatedByDefault: true,
    status: "Production",
    controls: [
      {
        id: "speed",
        label: "Animation Speed",
        type: "range",
        min: 0.1,
        max: 3.0,
        step: 0.1,
        defaultValue: 1.0,
        description: "Speed of rotation around the unit circle - affects how quickly the trigonometric values cycle.",
        role: "AnimationBehavior",
        unit: "x (multiplier)",
        impactsPerformance: "Negligible",
        typicalRangeForInterestingResults: [0.5, 1.5]
      },
    ],
  },
  {
    id: "four-pole-gradient",
    name: "4-Pole Gradient",
    component: FourPoleGradientGenerator,
    technology: 'CANVAS_2D',
    category: 'Geometric',
    schemaVersion: "1.0",
    description: "Smooth color interpolation between four corner poles with animated movement options.",
    longDescription: "Creates beautiful gradient fields by interpolating colors from four control points. Supports various animation patterns and noise overlays for dynamic, evolving visuals.",
    semantics: {
      primaryAlgorithmFamily: "GeometricTiling",
      secondaryAlgorithmFamilies: ["NoiseFunction"],
      keyMathematicalConcepts: ["LinearAlgebra", "ComputationalGeometry"],
      visualCharacteristics: ["Smooth", "Continuous", "Geometric", "Flowing", "Luminous"],
      dimensionality: "2D",
      interactionStyle: "ParameterTuning",
      keywords: ["gradient", "interpolation", "bilinear", "color field"],
      educationalContent: {
        contentId: "four-pole-gradient",
        relatedConcepts: ["linear-interpolation", "bilinear-interpolation", "color-theory"],
        crossReferences: ["trigonometric-circle", "noise"]
      }
    },
    performance: {
      computationalComplexity: "Medium",
      typicalFrameRateTarget: "60fps",
      notes: "Per-pixel interpolation can be intensive on large canvases, especially with noise overlay"
    },
    version: "1.0.0",
    author: "Aaron Brown & Claude",
    dateAdded: "2024-01-01",
    lastModified: "2024-06-24",
    isInteractive: false,
    isAnimatedByDefault: false,
    status: "Production",
    controls: [
      {
        id: "pole1Color",
        label: "Pole 1 Color",
        type: "color",
        defaultValue: "#FF0000",
        description: "Color of the top-left gradient pole - influences the upper left region.",
        role: "PrimaryAlgorithmParameter",
        impactsPerformance: "Negligible",
        relatedControls: ["pole2Color", "pole3Color", "pole4Color"],
        group: "Pole Colors"
      },
      {
        id: "pole2Color",
        label: "Pole 2 Color", 
        type: "color",
        defaultValue: "#00FF00",
        description: "Color of the top-right gradient pole - influences the upper right region.",
        role: "PrimaryAlgorithmParameter",
        impactsPerformance: "Negligible",
        relatedControls: ["pole1Color", "pole3Color", "pole4Color"],
        group: "Pole Colors"
      },
      {
        id: "pole3Color",
        label: "Pole 3 Color",
        type: "color",
        defaultValue: "#0000FF",
        description: "Color of the bottom-left gradient pole - influences the lower left region.",
        role: "PrimaryAlgorithmParameter",
        impactsPerformance: "Negligible",
        relatedControls: ["pole1Color", "pole2Color", "pole4Color"],
        group: "Pole Colors"
      },
      {
        id: "pole4Color",
        label: "Pole 4 Color",
        type: "color",
        defaultValue: "#FFFF00",
        description: "Color of the bottom-right gradient pole - influences the lower right region.",
        role: "PrimaryAlgorithmParameter",
        impactsPerformance: "Negligible",
        relatedControls: ["pole1Color", "pole2Color", "pole3Color"],
        group: "Pole Colors"
      },
      {
        id: "interpolationPower",
        label: "Interpolation Power",
        type: "range",
        min: 0.5,
        max: 4.0,
        step: 0.1,
        defaultValue: 2.0,
        description: "Controls the gradient falloff curve - lower values create sharper transitions, higher values create smoother blends.",
        role: "PrimaryAlgorithmParameter",
        unit: "power",
        impactsPerformance: "Minor",
        typicalRangeForInterestingResults: [1.0, 3.0],
        group: "Gradient Settings"
      },
      {
        id: "animationEnabled",
        label: "Animation Enabled",
        type: "checkbox",
        defaultValue: false,
        description: "Enables animated movement of gradient poles according to the selected pattern.",
        role: "AnimationBehavior",
        impactsPerformance: "Minor",
        relatedControls: ["animationSpeed", "animationPattern"],
        group: "Animation"
      },
      {
        id: "animationSpeed",
        label: "Animation Speed",
        type: "range",
        min: 0.1,
        max: 3.0,
        step: 0.1,
        defaultValue: 1.0,
        description: "Speed of pole movement animation - controls how fast the gradient evolves.",
        role: "AnimationBehavior",
        unit: "x (multiplier)",
        impactsPerformance: "Negligible",
        relatedControls: ["animationEnabled", "animationPattern"],
        group: "Animation"
      },
      {
        id: "animationPattern",
        label: "Animation Pattern",
        type: "select",
        defaultValue: "circular",
        options: [
          { value: "circular", label: "CIRCULAR_ORBIT" },
          { value: "figure8", label: "FIGURE_8_PATH" },
          { value: "oscillating", label: "OSCILLATING_WAVE" },
          { value: "random", label: "RANDOM_WALK" },
          { value: "curl", label: "CURL_NOISE_FIELD" },
        ],
        description: "Movement pattern for animated poles - each creates different gradient dynamics.",
        role: "AnimationBehavior",
        impactsPerformance: "Minor",
        relatedControls: ["animationEnabled", "animationSpeed"],
        group: "Animation"
      },
      {
        id: "noiseEnabled",
        label: "Noise Overlay",
        type: "checkbox",
        defaultValue: false,
        description: "Adds texture to the gradient using noise patterns - creates more organic appearances.",
        role: "VisualAesthetic",
        impactsPerformance: "Moderate",
        relatedControls: ["noiseIntensity", "noiseScale", "noiseType"],
        group: "Noise Effects",
        defaultRecommendations: {
          performanceConsideration: {
            lowPerformance: false,
            highPerformance: true,
            rationale: "Noise overlay requires additional per-pixel calculations"
          }
        }
      },
      {
        id: "noiseIntensity",
        label: "Noise Intensity",
        type: "range",
        min: 0.0,
        max: 1.0,
        step: 0.05,
        defaultValue: 0.3,
        description: "Strength of the noise overlay - higher values create more pronounced texture.",
        role: "VisualAesthetic",
        unit: "intensity",
        impactsPerformance: "Negligible",
        relatedControls: ["noiseEnabled", "noiseScale", "noiseType"],
        group: "Noise Effects"
      },
      {
        id: "noiseScale",
        label: "Noise Scale",
        type: "range",
        min: 0.005,
        max: 0.1,
        step: 0.005,
        defaultValue: 0.02,
        description: "Scale of noise features - smaller values create finer grain, larger values create broader patterns.",
        role: "VisualAesthetic",
        unit: "1/pixels",
        impactsPerformance: "Minor",
        relatedControls: ["noiseEnabled", "noiseIntensity", "noiseType"],
        group: "Noise Effects"
      },
      {
        id: "noiseType",
        label: "Noise Type",
        type: "select",
        defaultValue: "analog",
        options: [
          { value: "analog", label: "ANALOG_GRAIN" },
          { value: "digital", label: "DIGITAL_STATIC" },
          { value: "film", label: "FILM_GRAIN" },
        ],
        description: "Visual style of the noise overlay - each type creates different texture characteristics.",
        role: "VisualAesthetic",
        impactsPerformance: "Negligible",
        relatedControls: ["noiseEnabled", "noiseIntensity", "noiseScale"],
        group: "Noise Effects"
      },
      {
        id: "showPoles",
        label: "Show Pole Indicators",
        type: "checkbox",
        defaultValue: true,
        description: "Displays visual indicators at pole positions - helpful for understanding gradient structure.",
        role: "InteractionModifier",
        impactsPerformance: "Negligible",
        group: "Display Options"
      },
    ],
  },
]