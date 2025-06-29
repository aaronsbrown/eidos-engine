import NoiseFieldGenerator from "./noise-field-generator"
import PixelatedNoiseGenerator from "./pixelated-noise-generator"
import type { RichPatternGeneratorDefinition } from "@/lib/semantic-types"

// AIDEV-NOTE: Extracted from main index.ts for better maintainability and context window usage
// AIDEV-NOTE: Contains all noise-based pattern generators with rich semantic metadata
export const noisePatterns: RichPatternGeneratorDefinition[] = [
  {
    id: "noise",
    name: "Noise Field",
    component: NoiseFieldGenerator,
    technology: 'CANVAS_2D',
    category: 'Noise',
    schemaVersion: "1.0",
    description: "A flowing Perlin noise field with customizable color modes and animation speed.",
    longDescription: "Generates smooth, organic patterns using Perlin noise algorithms. The noise field flows continuously, creating natural-looking textures reminiscent of clouds, water, or terrain.",
    semantics: {
      primaryAlgorithmFamily: "NoiseFunction",
      keyMathematicalConcepts: ["SignalProcessing", "Calculus"],
      visualCharacteristics: ["Flowing", "Organic", "Continuous", "Smooth"],
      dimensionality: "2D",
      interactionStyle: "ParameterTuning",
      keywords: ["perlin", "noise", "flow field", "organic patterns"]
    },
    performance: {
      computationalComplexity: "Medium",
      typicalFrameRateTarget: "60fps",
      notes: "Per-pixel noise calculation can be intensive on large canvases"
    },
    educationalLinks: [
      {
        title: "Perlin Noise",
        url: "https://en.wikipedia.org/wiki/Perlin_noise",
        type: "Reference"
      }
    ],
    version: "1.0.0",
    author: "Aaron Brown & Claude",
    dateAdded: "2024-01-01",
    lastModified: "2024-06-24",
    relatedPatterns: ["pixelated-noise", "brownian-motion"],
    isInteractive: false,
    isAnimatedByDefault: true,
    status: "Production",
    controls: [
      {
        id: "noiseScale",
        label: "Noise Scale",
        type: "range",
        min: 0.005,
        max: 0.1,
        step: 0.005,
        defaultValue: 0.02,
        description: "Controls the zoom level of the noise pattern - smaller values create larger, smoother features.",
        role: "PrimaryAlgorithmParameter",
        unit: "1/pixels",
        impactsPerformance: "Minor",
        typicalRangeForInterestingResults: [0.01, 0.05],
        group: "Noise Parameters"
      },
      {
        id: "animationSpeed",
        label: "Animation Speed",
        type: "range",
        min: 0.001,
        max: 0.05,
        step: 0.001,
        defaultValue: 0.01,
        description: "Speed of the noise field animation - controls how fast the pattern flows.",
        role: "AnimationBehavior",
        unit: "units/frame",
        impactsPerformance: "Negligible",
        typicalRangeForInterestingResults: [0.005, 0.02]
      },
      {
        id: "contrast",
        label: "Contrast",
        type: "range",
        min: 0.5,
        max: 3.0,
        step: 0.1,
        defaultValue: 1.0,
        description: "Adjusts the contrast of the noise pattern - higher values create more dramatic differences.",
        role: "VisualAesthetic",
        unit: "x (multiplier)",
        impactsPerformance: "Negligible",
        relatedControls: ["brightness"],
        group: "Visual Adjustments"
      },
      {
        id: "brightness",
        label: "Brightness",
        type: "range",
        min: 0.5,
        max: 2.0,
        step: 0.1,
        defaultValue: 1.0,
        description: "Overall brightness of the pattern - affects the luminosity of all colors.",
        role: "VisualAesthetic",
        unit: "x (multiplier)",
        impactsPerformance: "Negligible",
        relatedControls: ["contrast"],
        group: "Visual Adjustments"
      },
      {
        id: "colorMode",
        label: "Color Mode",
        type: "select",
        defaultValue: "blue",
        options: [
          { value: "blue", label: "BLUE_FIELD" },
          { value: "plasma", label: "PLASMA_FIELD" },
          { value: "fire", label: "FIRE_FIELD" },
          { value: "ice", label: "ICE_FIELD" },
          { value: "electric", label: "ELECTRIC_FIELD" },
        ],
        description: "Selects the color gradient used to visualize the noise field.",
        role: "VisualAesthetic",
        impactsPerformance: "Negligible",
        group: "Visual Adjustments"
      },
    ],
  },
  {
    id: "pixelated-noise",
    name: "Pixelated Noise",
    component: PixelatedNoiseGenerator,
    technology: 'CANVAS_2D',
    category: 'Noise',
    schemaVersion: "1.0",
    description: "A retro-style pixelated noise pattern with customizable pixel size and color schemes.",
    longDescription: "Creates blocky, pixel-art style noise patterns. Perfect for retro aesthetics or when you want discrete rather than smooth noise.",
    semantics: {
      primaryAlgorithmFamily: "NoiseFunction",
      keyMathematicalConcepts: ["DiscreteMathematics", "SignalProcessing"],
      visualCharacteristics: ["Pixelated", "Discrete", "Geometric", "Flowing"],
      dimensionality: "2D",
      interactionStyle: "ParameterTuning",
      keywords: ["pixel art", "retro", "discrete noise", "blocky"]
    },
    performance: {
      computationalComplexity: "Low",
      typicalFrameRateTarget: "60fps",
      notes: "Efficient due to reduced sampling - pixel size directly impacts performance"
    },
    version: "1.0.0",
    author: "Aaron Brown & Claude",
    dateAdded: "2024-01-01",
    lastModified: "2024-06-24",
    relatedPatterns: ["noise"],
    isInteractive: false,
    isAnimatedByDefault: true,
    status: "Production",
    controls: [
      {
        id: "pixelSize",
        label: "Pixel Size",
        type: "range",
        min: 2,
        max: 32,
        step: 1,
        defaultValue: 8,
        description: "Size of each pixel block - larger pixels create a more retro, chunky appearance.",
        role: "StructuralParameter",
        unit: "px",
        impactsPerformance: "Moderate",
        typicalRangeForInterestingResults: [4, 16],
        defaultRecommendations: {
          performanceConsideration: {
            lowPerformance: 16,
            highPerformance: 8,
            rationale: "Larger pixels require fewer calculations per frame"
          }
        }
      },
      {
        id: "noiseScale",
        label: "Noise Scale",
        type: "range",
        min: 0.01,
        max: 0.5,
        step: 0.01,
        defaultValue: 0.1,
        description: "Controls the zoom of the noise pattern - affects how quickly values change across pixels.",
        role: "PrimaryAlgorithmParameter",
        unit: "1/pixels",
        impactsPerformance: "Minor",
        typicalRangeForInterestingResults: [0.05, 0.2],
        group: "Noise Parameters"
      },
      {
        id: "animationSpeed",
        label: "Animation Speed",
        type: "range",
        min: 0.001,
        max: 0.1,
        step: 0.001,
        defaultValue: 0.02,
        description: "Speed at which the pixelated pattern changes over time.",
        role: "AnimationBehavior",
        unit: "units/frame",
        impactsPerformance: "Negligible"
      },
      {
        id: "colorIntensity",
        label: "Color Intensity",
        type: "range",
        min: 0.1,
        max: 2.0,
        step: 0.1,
        defaultValue: 1.0,
        description: "Intensity of the color palette - higher values create more vibrant, saturated colors.",
        role: "VisualAesthetic",
        unit: "x (multiplier)",
        impactsPerformance: "Negligible",
        group: "Visual Adjustments"
      },
      {
        id: "colorScheme",
        label: "Color Scheme",
        type: "select",
        defaultValue: "retro",
        options: [
          { value: "retro", label: "RETRO_PALETTE" },
          { value: "monochrome", label: "MONOCHROME" },
          { value: "cyan", label: "CYAN_MATRIX" },
          { value: "amber", label: "AMBER_TERMINAL" },
        ],
        description: "Color palette for the pixelated pattern - each evokes different retro computing aesthetics.",
        role: "VisualAesthetic",
        impactsPerformance: "Negligible",
        group: "Visual Adjustments"
      },
    ],
  },
]