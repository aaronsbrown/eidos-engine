import NoiseFieldGenerator from "./noise-field-generator"
import PixelatedNoiseGenerator from "./pixelated-noise-generator"
import BrownianMotionGenerator from "./brownian-motion-generator"
import TrigonometricCircleGenerator from "./trigonometric-circle-generator"
import ParticleSystemGenerator from "./particle-system-generator"
import CellularAutomatonGenerator from "./cellular-automaton-generator"
import FourPoleGradientGenerator from "./four-pole-gradient-generator"
import LorenzAttractorGenerator from "./lorenz-attractor-generator"
import type { RichPatternGeneratorDefinition } from "@/lib/semantic-types"

// AIDEV-NOTE: Migrated to semantic pattern definitions with rich metadata
// AIDEV-NOTE: Patterns are sorted by category for proper grouping in the UI
const unsortedPatternGenerators: RichPatternGeneratorDefinition[] = [
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
  {
    id: "brownian-motion",
    name: "Brownian Motion",
    component: BrownianMotionGenerator,
    technology: 'WEBGL_2.0',
    category: 'Simulation',
    schemaVersion: "1.0",
    description: "Particles following random walk patterns with glowing trails, simulating molecular motion.",
    longDescription: "Simulates the random motion of particles suspended in a fluid, creating organic, unpredictable paths. Named after botanist Robert Brown's observations of pollen grains.",
    semantics: {
      primaryAlgorithmFamily: "PhysicsSimulation",
      secondaryAlgorithmFamilies: ["NoiseFunction"],
      keyMathematicalConcepts: ["Probability", "ChaosTheory", "Calculus"],
      visualCharacteristics: ["Organic", "Flowing", "Jittery", "Luminous"],
      dimensionality: "2D",
      interactionStyle: "ParameterTuning",
      keywords: ["random walk", "stochastic", "molecular motion", "chaos"]
    },
    performance: {
      computationalComplexity: "Medium",
      typicalFrameRateTarget: "60fps",
      notes: "WebGL implementation ensures smooth performance even with multiple particles",
      optimizationsUsed: ["WebGL Instancing", "Texture-based trails"]
    },
    educationalLinks: [
      {
        title: "Brownian Motion",
        url: "https://en.wikipedia.org/wiki/Brownian_motion",
        type: "Reference"
      }
    ],
    version: "1.0.0",
    author: "Aaron Brown & Claude",
    dateAdded: "2024-01-01",
    lastModified: "2024-06-24",
    relatedPatterns: ["noise", "particle-system"],
    isInteractive: false,
    isAnimatedByDefault: true,
    status: "Production",
    controls: [
      {
        id: "particleCount",
        label: "Particle Count",
        type: "range",
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 12,
        description: "Number of particles performing random walks - more particles create denser patterns.",
        role: "PerformanceTuning",
        unit: "particles",
        impactsPerformance: "Moderate",
        typicalRangeForInterestingResults: [8, 16],
        defaultRecommendations: {
          platformSpecific: {
            mobile: 8,
            desktop: 12,
            rationale: "Mobile devices handle fewer particles more smoothly"
          }
        }
      },
      {
        id: "speed",
        label: "Speed",
        type: "range",
        min: 0.1,
        max: 3.0,
        step: 0.1,
        defaultValue: 1.0,
        description: "Overall movement speed of particles - affects how quickly they traverse the canvas.",
        role: "AnimationBehavior",
        unit: "x (multiplier)",
        impactsPerformance: "Negligible",
        relatedControls: ["jitterAmount"]
      },
      {
        id: "brightness",
        label: "Brightness",
        type: "range",
        min: 0.5,
        max: 5.0,
        step: 0.1,
        defaultValue: 2.0,
        description: "Glow intensity of the particles - higher values create more luminous trails.",
        role: "VisualAesthetic",
        unit: "x (multiplier)",
        impactsPerformance: "Negligible",
        group: "Visual Effects"
      },
      {
        id: "trailLength",
        label: "Trail Length",
        type: "range",
        min: 2,
        max: 15,
        step: 1,
        defaultValue: 8,
        description: "Length of the glowing trail behind each particle - longer trails create more persistent patterns.",
        role: "VisualAesthetic",
        unit: "segments",
        impactsPerformance: "Minor",
        group: "Visual Effects",
        defaultRecommendations: {
          performanceConsideration: {
            lowPerformance: 5,
            highPerformance: 10,
            rationale: "Longer trails require more GPU memory and calculations"
          }
        }
      },
      {
        id: "jitterAmount",
        label: "Brownian Jitter",
        type: "range",
        min: 0.01,
        max: 0.2,
        step: 0.01,
        defaultValue: 0.05,
        description: "Amount of random motion applied each frame - higher values create more erratic movement.",
        role: "PrimaryAlgorithmParameter",
        unit: "displacement/frame",
        impactsPerformance: "Negligible",
        typicalRangeForInterestingResults: [0.03, 0.1],
        relatedControls: ["speed"]
      },
    ],
  },
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
      keywords: ["unit circle", "sine", "cosine", "trigonometry", "educational"]
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
    id: "particle-system",
    name: "Advanced Particle System",
    component: ParticleSystemGenerator,
    technology: 'WEBGL_2.0',
    category: 'Simulation',
    schemaVersion: "1.0",
    description: "A sophisticated particle system with curl noise fields, gravity, and customizable visual effects.",
    longDescription: "Advanced particle simulation featuring curl noise for organic movement, configurable physics, and multiple color palettes. Supports thousands of particles with WebGL acceleration.",
    semantics: {
      primaryAlgorithmFamily: "ParticleSystem",
      secondaryAlgorithmFamilies: ["NoiseFunction", "PhysicsSimulation"],
      keyMathematicalConcepts: ["Calculus", "LinearAlgebra", "SignalProcessing"],
      visualCharacteristics: ["Flowing", "Organic", "Complex", "Luminous", "Pulsating"],
      dimensionality: "2D",
      interactionStyle: "ParameterTuning",
      keywords: ["particles", "curl noise", "physics", "fluid dynamics", "generative"]
    },
    performance: {
      computationalComplexity: "High",
      typicalFrameRateTarget: "60fps",
      notes: "Performance scales with particle count and trail quality settings",
      optimizationsUsed: ["WebGL Instancing", "Texture-based particle storage"]
    },
    version: "1.0.0",
    author: "Aaron Brown & Claude",
    dateAdded: "2024-01-01",
    lastModified: "2024-06-24",
    relatedPatterns: ["brownian-motion"],
    isInteractive: false,
    isAnimatedByDefault: true,
    status: "Production",
    controls: [
      {
        id: "particleCount",
        label: "Particle Count",
        type: "range",
        min: 1,
        max: 100,
        step: 1,
        defaultValue: 50,
        description: "Total number of active particles in the simulation - directly impacts visual density and performance.",
        role: "PerformanceTuning",
        unit: "particles",
        impactsPerformance: "Significant",
        typicalRangeForInterestingResults: [30, 80],
        defaultRecommendations: {
          platformSpecific: {
            mobile: 30,
            desktop: 50,
            rationale: "Mobile devices struggle with high particle counts due to GPU limitations"
          }
        },
        group: "Particle Settings"
      },
      {
        id: "lifeExpectancy",
        label: "Life Expectancy",
        type: "range",
        min: 1.0,
        max: 10.0,
        step: 0.5,
        defaultValue: 5.0,
        description: "Average lifetime of particles before respawning - longer lives create more persistent patterns.",
        role: "PrimaryAlgorithmParameter",
        unit: "seconds",
        impactsPerformance: "Minor",
        relatedControls: ["lifeVariation", "spawnRate"],
        group: "Particle Settings"
      },
      {
        id: "lifeVariation",
        label: "Life Variation",
        type: "range",
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 50,
        description: "Randomness in particle lifetimes - higher values create more organic, varied patterns.",
        role: "PrimaryAlgorithmParameter",
        unit: "%",
        impactsPerformance: "Negligible",
        relatedControls: ["lifeExpectancy"],
        group: "Particle Settings"
      },
      {
        id: "particleSize",
        label: "Particle Size",
        type: "range",
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 8,
        description: "Base size of particles - larger particles create bolder, more visible patterns.",
        role: "VisualAesthetic",
        unit: "px",
        impactsPerformance: "Minor",
        group: "Visual Effects"
      },
      {
        id: "spawnRate",
        label: "Spawn Rate",
        type: "range",
        min: 1,
        max: 50,
        step: 1,
        defaultValue: 25,
        description: "How quickly new particles are created - affects pattern density and flow continuity.",
        role: "AnimationBehavior",
        unit: "particles/second",
        impactsPerformance: "Moderate",
        relatedControls: ["lifeExpectancy", "particleCount"],
        group: "Particle Settings"
      },
      {
        id: "movementSpeed",
        label: "Movement Speed",
        type: "range",
        min: 0.1,
        max: 5.0,
        step: 0.1,
        defaultValue: 1.0,
        description: "Base velocity of particles - controls how fast they move through the field.",
        role: "AnimationBehavior",
        unit: "x (multiplier)",
        impactsPerformance: "Negligible",
        relatedControls: ["curlStrength"],
        group: "Physics"
      },
      {
        id: "curlStrength",
        label: "Curl Strength",
        type: "range",
        min: 0.0,
        max: 2.0,
        step: 0.1,
        defaultValue: 1.0,
        description: "Intensity of the curl noise field - creates swirling, fluid-like motion patterns.",
        role: "PrimaryAlgorithmParameter",
        unit: "x (multiplier)",
        impactsPerformance: "Minor",
        typicalRangeForInterestingResults: [0.5, 1.5],
        relatedControls: ["movementSpeed"],
        group: "Physics"
      },
      {
        id: "gravity",
        label: "Gravity",
        type: "range",
        min: -2.0,
        max: 2.0,
        step: 0.1,
        defaultValue: 0.0,
        description: "Vertical force applied to particles - positive values pull down, negative values push up.",
        role: "PrimaryAlgorithmParameter",
        unit: "force units",
        impactsPerformance: "Negligible",
        group: "Physics"
      },
      {
        id: "brightness",
        label: "Brightness",
        type: "range",
        min: 0.5,
        max: 8.0,
        step: 0.5,
        defaultValue: 3.0,
        description: "Overall luminosity of particles - higher values create more intense glow effects.",
        role: "VisualAesthetic",
        unit: "x (multiplier)",
        impactsPerformance: "Negligible",
        group: "Visual Effects"
      },
      {
        id: "enableTrails",
        label: "Enable Trails",
        type: "checkbox",
        defaultValue: true,
        description: "Toggle particle trail rendering - creates flowing streaks behind moving particles.",
        role: "VisualAesthetic",
        impactsPerformance: "Significant",
        relatedControls: ["trailDecay", "trailQuality"],
        group: "Trail Effects",
        defaultRecommendations: {
          platformSpecific: {
            mobile: false,
            desktop: true,
            rationale: "Trails significantly impact mobile GPU performance and battery life"
          }
        }
      },
      {
        id: "trailDecay",
        label: "Trail Decay",
        type: "range",
        min: 0.8,
        max: 0.99,
        step: 0.01,
        defaultValue: 0.95,
        description: "How quickly trails fade - lower values create shorter trails, higher values create longer persistence.",
        role: "VisualAesthetic",
        unit: "decay factor",
        impactsPerformance: "Minor",
        typicalRangeForInterestingResults: [0.92, 0.98],
        relatedControls: ["enableTrails", "trailQuality"],
        group: "Trail Effects"
      },
      {
        id: "trailQuality",
        label: "Trail Quality",
        type: "select",
        defaultValue: "medium",
        options: [
          { value: "low", label: "LOW_PERF" },
          { value: "medium", label: "MEDIUM_PERF" },
          { value: "high", label: "HIGH_PERF" },
        ],
        description: "Rendering quality of particle trails - higher quality uses more GPU resources.",
        role: "PerformanceTuning",
        impactsPerformance: "Significant",
        relatedControls: ["enableTrails", "trailDecay"],
        group: "Trail Effects",
        defaultRecommendations: {
          performanceConsideration: {
            lowPerformance: "low",
            highPerformance: "high",
            rationale: "Trail quality directly impacts GPU fill rate and memory bandwidth"
          }
        }
      },
      {
        id: "colorPalette",
        label: "Color Palette",
        type: "select",
        defaultValue: "classic",
        options: [
          { value: "classic", label: "CLASSIC_YELLOW" },
          { value: "fire", label: "FIRE_GRADIENT" },
          { value: "plasma", label: "PLASMA_SPECTRUM" },
          { value: "ice", label: "ICE_CRYSTAL" },
          { value: "electric", label: "ELECTRIC_CYAN" },
        ],
        description: "Color scheme for particles - each palette creates a different mood and energy.",
        role: "VisualAesthetic",
        impactsPerformance: "Negligible",
        group: "Visual Effects"
      },
      {
        id: "reset",
        label: "Reset Simulation",
        type: "button",
        defaultValue: false,
        description: "Resets all particles to their initial spawn positions and clears trails.",
        role: "UserAction",
        impactsPerformance: "Negligible"
      },
    ],
  },
  {
    id: "cellular-automaton",
    name: "1D CELLULAR AUTOMATA",
    component: CellularAutomatonGenerator,
    technology: 'CANVAS_2D',
    category: 'Simulation',
    schemaVersion: "1.0",
    description: "One-dimensional cellular automaton exploring emergent complexity from simple rules.",
    longDescription: "Implements Stephen Wolfram's elementary cellular automata, generating complex patterns from simple local rules. Each cell's state depends only on its previous state and its neighbors.",
    semantics: {
      primaryAlgorithmFamily: "CellularAutomata",
      keyMathematicalConcepts: ["DiscreteMathematics", "SetTheory", "NumberTheory"],
      visualCharacteristics: ["Discrete", "Ordered", "Geometric", "Complex", "Static"],
      dimensionality: "1D",
      interactionStyle: "ParameterTuning",
      keywords: ["wolfram", "rule 30", "rule 110", "emergence", "complexity"]
    },
    performance: {
      computationalComplexity: "Low",
      typicalFrameRateTarget: "60fps",
      notes: "Linear time complexity - performance scales with canvas width"
    },
    educationalLinks: [
      {
        title: "Elementary Cellular Automaton",
        url: "https://en.wikipedia.org/wiki/Elementary_cellular_automaton",
        type: "Reference"
      },
      {
        title: "Wolfram's Rule 30",
        url: "https://en.wikipedia.org/wiki/Rule_30",
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
        id: "rulePrev",
        label: "← PREV",
        type: "button",
        defaultValue: false,
        description: "Navigate to the previous cellular automaton rule number.",
        role: "UserAction",
        impactsPerformance: "Negligible",
        relatedControls: ["ruleNext"],
        group: "Rule Navigation"
      },
      {
        id: "ruleNext",
        label: "NEXT →",
        type: "button",
        defaultValue: false,
        description: "Navigate to the next cellular automaton rule number.",
        role: "UserAction",
        impactsPerformance: "Negligible",
        relatedControls: ["rulePrev"],
        group: "Rule Navigation"
      },
      {
        id: "cellSize",
        label: "Cell Size",
        type: "range",
        min: 1,
        max: 8,
        step: 1,
        defaultValue: 2,
        description: "Size of each cell in pixels - larger cells show pattern detail, smaller cells show overall structure.",
        role: "StructuralParameter",
        unit: "px",
        impactsPerformance: "Moderate",
        typicalRangeForInterestingResults: [1, 4],
        defaultRecommendations: {
          platformSpecific: {
            mobile: 3,
            desktop: 2,
            rationale: "Larger cells reduce computation on mobile while maintaining visibility"
          }
        }
      },
      {
        id: "animationSpeed",
        label: "Generation Speed",
        type: "range",
        min: 0.02,
        max: 0.5,
        step: 0.02,
        defaultValue: 0.30,
        description: "Speed at which new generations are calculated and displayed - controls pattern evolution rate.",
        role: "AnimationBehavior",
        unit: "generations/frame",
        impactsPerformance: "Minor",
        typicalRangeForInterestingResults: [0.1, 0.4]
      },
      {
        id: "initialCondition",
        label: "Initial Condition",
        type: "select",
        defaultValue: "center",
        options: [
          { value: "single", label: "SINGLE_LEFT" },
          { value: "center", label: "SINGLE_CENTER" },
          { value: "random", label: "RANDOM_SEED" },
        ],
        description: "Starting configuration for the first row - determines how patterns begin and evolve.",
        role: "PrimaryAlgorithmParameter",
        impactsPerformance: "Negligible",
        group: "Initial State"
      },
      {
        id: "resetTrigger",
        label: "Reset Automaton",
        type: "button",
        defaultValue: false,
        description: "Clears the canvas and restarts the automaton from the initial condition.",
        role: "UserAction",
        impactsPerformance: "Negligible"
      },
    ],
  },
  {
    id: "lorenz-attractor",
    name: "Lorenz Attractor",
    component: LorenzAttractorGenerator,
    technology: 'WEBGL_2.0',
    category: 'Simulation',
    schemaVersion: "1.0",
    description: "A classic strange attractor that exhibits chaotic behavior, rendered in interactive 3D space.",
    longDescription: "The Lorenz Attractor is a system of three ordinary differential equations that results in chaotic, non-repeating, yet deterministic motion. This WebGL implementation renders particles in true 3D space with automatic camera rotation.",
    semantics: {
      primaryAlgorithmFamily: "StrangeAttractor",
      keyMathematicalConcepts: ["ChaosTheory", "Calculus", "LinearAlgebra"],
      visualCharacteristics: ["Flowing", "Chaotic", "Organic", "Complex", "Luminous"],
      dimensionality: "True3D_WebGL",
      interactionStyle: "ParameterTuning",
      keywords: ["lorenz", "butterfly effect", "dynamical system", "chaos", "3d", "webgl"]
    },
    performance: {
      computationalComplexity: "Medium",
      typicalFrameRateTarget: "60fps",
      notes: "Performance is dependent on the number of particles. Mobile devices may struggle with high particle counts."
    },
    version: "1.0.0",
    author: "Aaron Brown & Gemini",
    dateAdded: "2025-06-25",
    lastModified: "2025-06-25",
    status: "Production",
    isInteractive: false,
    isAnimatedByDefault: true,
    controls: [
        {
            id: "sigma",
            label: "Sigma",
            type: "range",
            min: 1,
            max: 20,
            step: 0.1,
            defaultValue: 10,
            description: "The Prandtl number, affecting the shape and stability of the attractor.",
            role: "PrimaryAlgorithmParameter",
            impactsPerformance: "Negligible",
            group: "Lorenz Parameters"
        },
        {
            id: "rho",
            label: "Rho",
            type: "range",
            min: 1,
            max: 50,
            step: 0.1,
            defaultValue: 28,
            description: "The Rayleigh number, a key parameter for inducing chaotic behavior.",
            role: "PrimaryAlgorithmParameter",
            impactsPerformance: "Negligible",
            group: "Lorenz Parameters"
        },
        {
            id: "beta",
            label: "Beta",
            type: "range",
            min: 1,
            max: 5,
            step: 0.1,
            defaultValue: 8 / 3,
            description: "A geometric parameter of the system.",
            role: "PrimaryAlgorithmParameter",
            impactsPerformance: "Negligible",
            group: "Lorenz Parameters"
        },
        {
            id: "particleCount",
            label: "Particle Count",
            type: "range",
            min: 100,
            max: 5000,
            step: 100,
            defaultValue: 1000,
            description: "Number of particles to trace the attractor's path.",
            role: "PerformanceTuning",
            impactsPerformance: "Significant",
            defaultRecommendations: {
                platformSpecific: {
                    mobile: 500,
                    desktop: 1500,
                    rationale: "High particle counts significantly impact performance on mobile devices."
                }
            }
        }
    ]
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
      keywords: ["gradient", "interpolation", "bilinear", "color field"]
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

// AIDEV-NOTE: Sort patterns by category to group them properly in the UI
// Category order: Noise, Geometric, Simulation, Data Visualization
const categoryOrder = ['Noise', 'Geometric', 'Simulation', 'Data Visualization']

export const patternGenerators = unsortedPatternGenerators.sort((a, b) => {
  const aIndex = categoryOrder.indexOf(a.category)
  const bIndex = categoryOrder.indexOf(b.category)
  
  // Sort by category order first
  if (aIndex !== bIndex) {
    return aIndex - bIndex
  }
  
  // Within same category, maintain original order (stable sort)
  return unsortedPatternGenerators.indexOf(a) - unsortedPatternGenerators.indexOf(b)
})

export { NoiseFieldGenerator, PixelatedNoiseGenerator, BrownianMotionGenerator, TrigonometricCircleGenerator, ParticleSystemGenerator, CellularAutomatonGenerator, FourPoleGradientGenerator, LorenzAttractorGenerator }
export type { PatternGenerator, PatternGeneratorProps } from "./types"
