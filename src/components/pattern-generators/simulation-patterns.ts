import BrownianMotionGenerator from "./brownian-motion-generator"
import ParticleSystemGenerator from "./particle-system-generator"
import CellularAutomatonGenerator from "./cellular-automaton-generator"
import ConwaysGameOfLifeGenerator from "./conways-game-of-life-generator"
import type { RichPatternGeneratorDefinition } from "@/lib/semantic-types"

// AIDEV-NOTE: Extracted from main index.ts for better maintainability and context window usage
// AIDEV-NOTE: Contains all simulation-based pattern generators with rich semantic metadata
export const simulationPatterns: RichPatternGeneratorDefinition[] = [
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
      keywords: ["random walk", "stochastic", "molecular motion", "chaos"],
      educationalContent: {
        contentId: "brownian-motion",
        relatedConcepts: ["random-walk", "stochastic-processes", "molecular-kinetics"],
        crossReferences: ["noise", "pixelated-noise", "particle-system"]
      }
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
      keywords: ["particles", "curl noise", "physics", "fluid dynamics", "generative"],
      educationalContent: {
        contentId: "particle-system",
        relatedConcepts: ["particle-physics", "fluid-dynamics", "vector-fields"],
        crossReferences: ["brownian-motion", "noise"]
      }
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
      keywords: ["wolfram", "rule 30", "rule 110", "emergence", "complexity"],
      educationalContent: {
        contentId: "cellular-automaton",
        relatedConcepts: ["discrete-mathematics", "emergence", "computational-theory"],
        crossReferences: ["pixelated-noise"]
      }
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
    id: "conways-game-of-life",
    name: "Conway's Game of Life",
    component: ConwaysGameOfLifeGenerator,
    technology: 'CANVAS_2D',
    category: 'Simulation',
    schemaVersion: "1.0",
    description: "Interactive 2D cellular automaton showcasing emergence and complexity from simple rules.",
    longDescription: "The most famous cellular automaton, invented by John Conway in 1970. Demonstrates how complex behaviors emerge from simple rules: cells live, die, or reproduce based on their neighbors. Interactive seeding allows exploration of patterns like gliders, oscillators, and still lifes.",
    semantics: {
      primaryAlgorithmFamily: "CellularAutomata",
      keyMathematicalConcepts: ["DiscreteMathematics", "ComputationalGeometry", "SetTheory"],
      visualCharacteristics: ["Discrete", "Ordered", "Complex", "Flowing"],
      dimensionality: "2D",
      interactionStyle: "Seeding",
      keywords: ["game of life", "cellular automaton", "emergence", "glider", "oscillator", "Conway"],
      educationalContent: {
        contentId: "conways-game-of-life",
        relatedConcepts: ["emergence", "turing-completeness", "cellular-automata", "discrete-mathematics"],
        crossReferences: ["cellular-automaton", "pixelated-noise"]
      }
    },
    performance: {
      computationalComplexity: "Medium",
      typicalFrameRateTarget: "60fps",
      notes: "Performance scales with grid size - automatically adapts to viewport dimensions"
    },
    educationalLinks: [
      {
        title: "Conway's Game of Life",
        url: "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life",
        type: "Reference"
      },
      {
        title: "Game of Life Pattern Collections",
        url: "https://www.conwaylife.com/wiki/Main_Page",
        type: "Reference"
      }
    ],
    version: "1.0.0",
    author: "Aaron Brown & Claude",
    dateAdded: "2024-07-05",
    lastModified: "2024-07-05",
    relatedPatterns: ["cellular-automaton"],
    isInteractive: true,
    isAnimatedByDefault: false,
    status: "Production",
    controls: [
      {
        id: "speed",
        label: "Evolution Speed",
        type: "range",
        min: 0.5,
        max: 10.0,
        step: 0.5,
        defaultValue: 3.0,
        description: "Speed of evolution - controls how quickly generations advance during simulation.",
        role: "AnimationBehavior",
        unit: "generations/second",
        impactsPerformance: "Minor",
        typicalRangeForInterestingResults: [1.0, 6.0],
        group: "Simulation"
      },
      {
        id: "density",
        label: "Initial Density",
        type: "range",
        min: 0.05,
        max: 0.50,
        step: 0.05,
        defaultValue: 0.15,
        description: "Probability of cells being alive when generating random patterns - affects initial complexity.",
        role: "PrimaryAlgorithmParameter",
        unit: "probability",
        impactsPerformance: "Negligible",
        typicalRangeForInterestingResults: [0.10, 0.25],
        group: "Initial State",
        defaultRecommendations: {
          platformSpecific: {
            mobile: 0.12,
            desktop: 0.15,
            rationale: "Lower density reduces visual complexity on smaller mobile screens"
          }
        }
      },
      {
        id: "resetTrigger",
        label: "Randomize Grid",
        type: "button",
        defaultValue: false,
        description: "Generates a new random pattern based on current density setting.",
        role: "UserAction",
        impactsPerformance: "Negligible",
        group: "Controls"
      }
    ],
  },
]