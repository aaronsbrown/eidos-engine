// AIDEV-NOTE: Semantic layer type definitions for pattern generator metadata enrichment

// --- Core Semantic Enums/Types ---

export type AlgorithmFamily =
  | "StrangeAttractor" // Lorenz, De Jong, Clifford, Aizawa, etc.
  | "CellularAutomata" // 1D Elementary, Game of Life, 3D CA
  | "NoiseFunction"    // Perlin, Simplex (1D, 2D, 3D), Value Noise
  | "Fractal"          // Mandelbrot, Julia, L-Systems, IFS
  | "WavePhenomenon"   // Standing waves, Chladni, Interference
  | "ParticleSystem"   // Basic, Flocking, Fluid-like
  | "GeometricTiling"  // Voronoi, Delaunay, Penrose, Tessellations
  | "MathematicalArt"  // Phyllotaxis, Rose Curves, Lissajous
  | "ImageProcessing"  // Pixel sorting, Edge detection (if you add these)
  | "PhysicsSimulation"// Gravity, Springs, Orbits (if not covered by ParticleSystem)
  | "Other"

export type MathematicalConcept =
  | "Calculus"             // Differential equations, integration
  | "LinearAlgebra"        // Vectors, matrices, transformations
  | "Trigonometry"         // Sine, cosine, circles, waves
  | "ChaosTheory"          // Attractors, bifurcations, sensitivity
  | "Probability"          // Random walks, distributions
  | "Statistics"           // Data-driven patterns (if any)
  | "SetTheory"            // Operations on sets (e.g., for fractals)
  | "NumberTheory"         // Properties of integers (e.g., for certain CAs or tilings)
  | "GraphTheory"          // Nodes, edges (e.g., for Delaunay)
  | "FormalGrammars"       // L-Systems
  | "DiscreteMathematics"  // Cellular Automata, Grids
  | "ComputationalGeometry"// Voronoi, Convex Hulls
  | "SignalProcessing"     // Fourier analysis, Spectrums
  | "NoneNotable"
  | "Other"

export type VisualCharacteristic =
  | "Organic" | "Geometric" | "Abstract" | "Naturalistic" // Overall feel
  | "Flowing" | "Static" | "Pulsating" | "Swirling" | "Jittery" // Motion
  | "Discrete" | "Continuous" | "Pixelated" | "Smooth" // Texture/Form
  | "Chaotic" | "Ordered" | "Symmetrical" | "Asymmetrical" // Structure
  | "Minimalist" | "Complex" | "Dense" | "Sparse" // Density/Complexity
  | "Luminous" | "Matte" | "Textured" // Surface Quality
  | "OtherVisual"

export type Dimensionality =
  | "1D"                // Primarily evolves or is visualized along one dimension
  | "2D"                // Operates and is visualized on a 2D plane
  | "3D_Projected"      // 3D mathematics projected onto a 2D canvas
  | "3D_Volumetric_Slice" // Shows a 2D slice of a 3D volumetric process
  | "True3D_WebGL"      // Rendered in a 3D WebGL scene

export type InteractionStyle =
  | "PassiveObservation"   // No user interaction beyond global controls like play/pause (if any)
  | "ParameterTuning"    // User primarily changes numerical/select controls
  | "DirectManipulation"   // User can click/drag elements within the visualization itself (e.g., 4-Pole Gradient poles)
  | "Seeding"              // User provides initial conditions or clicks to seed patterns (e.g., some CAs, GoL)
  | "Hybrid"

export type ComputationalComplexity =
  | "VeryLow"  // Minimal computation, suitable for very constrained devices
  | "Low"      // Basic loops, simple math
  | "Medium"   // e.g., Per-pixel noise, moderate particle counts
  | "High"     // e.g., Complex shaders, many particles, intensive iterative processes on CPU
  | "VeryHigh" // Demands significant resources, WebGL often essential for good FPS

export type TechnologyUsed = "CANVAS_2D" | "WEBGL_FRAGMENT_SHADER" | "WEBGL_COMPUTE_SHADER" | "WEBGL_MESHES"

// --- Rich Pattern Control Definition ---
import type { PatternControl } from "@/components/pattern-generators/types"

// Default recommendation structures for platform and performance awareness
export interface PerformanceDefaultRecommendation {
  lowPerformance: number | string | boolean // Value for constrained devices
  highPerformance: number | string | boolean // Value for powerful devices
  rationale: string // Explanation of why these defaults differ
}

export interface PlatformDefaultRecommendation {
  mobile?: number | string | boolean // Mobile-specific default
  desktop?: number | string | boolean // Desktop-specific default
  rationale: string // Explanation of platform differences
}

export interface DefaultRecommendations {
  performanceConsideration?: PerformanceDefaultRecommendation
  platformSpecific?: PlatformDefaultRecommendation
}

export interface RichPatternControlDefinition extends PatternControl {
  description: string // Concise explanation of what the control does and its visual/behavioral effect.
  role:
    | "PrimaryAlgorithmParameter" // Directly maps to a core variable in the underlying math/algorithm (e.g., Lorenz's rho, CA rule number)
    | "VisualAesthetic"           // Affects colors, styles, appearance (e.g., colorScheme, lineThickness)
    | "AnimationBehavior"         // Controls timing, speed, evolution (e.g., animationSpeed, spawnRate)
    | "InteractionModifier"       // Modifies how the user interacts (e.g., showPoles)
    | "PerformanceTuning"         // Allows user to trade quality for speed (e.g., particleCount, trailQuality)
    | "UserAction"                // Triggers an event/reset (for type: 'button')
    | "StructuralParameter"       // Defines grid size, pixel size, etc.
  unit?: string // e.g., "px", "ms", "°", "%", "x (multiplier)"
  impactsPerformance: "Negligible" | "Minor" | "Moderate" | "Significant"
  typicalRangeForInterestingResults?: [number, number] // For 'range' types, subset of min/max
  relatedControls?: string[] // IDs of other controls this one often interacts with or depends on
  group?: string // Suggested grouping for UI, e.g., "Color", "Physics", "Noise Parameters"
  defaultRecommendations?: DefaultRecommendations // Platform and performance-aware default suggestions
}

// --- Rich Pattern Generator Definition ---
export interface EducationalLink {
  title: string
  url?: string // External URL (e.g., Wikipedia, academic paper)
  internalDocPath?: string // Path to your `docs/education/*.md`
  type: "Tutorial" | "Reference" | "Paper" | "Video" | "InteractiveDemo" | "ProjectWriteup"
}

export interface SemanticTags {
  primaryAlgorithmFamily: AlgorithmFamily
  secondaryAlgorithmFamilies?: AlgorithmFamily[]
  keyMathematicalConcepts: MathematicalConcept[]
  visualCharacteristics: VisualCharacteristic[]
  dimensionality: Dimensionality
  interactionStyle: InteractionStyle
  keywords: string[] // Freeform keywords for searchability, e.g., ["Lorenz", "butterfly effect", "dynamical system"]
}

export interface PerformanceProfile {
  computationalComplexity: ComputationalComplexity
  typicalFrameRateTarget: "60fps" | "30-60fps" | "30fps_Acceptable" | "Variable"
  notes?: string // e.g., "Performance degrades with >100k particles on Canvas2D"
  optimizationsUsed?: string[] // e.g., "WebGL Instancing", "Offscreen Canvas", "Pixel Buffers"
}

export interface RichPatternGeneratorDefinition {
  // Core existing fields (from PatternGenerator)
  id: string
  name: string
  component: React.ComponentType<import("@/components/pattern-generators/types").PatternGeneratorProps>
  controls?: RichPatternControlDefinition[] // Use the new rich control type
  technology: TechnologyUsed | 'WEBGL_2.0' | 'CANVAS_2D' // Support both old and new technology types
  category: 'Noise' | 'Geometric' | 'Simulation' | 'Data Visualization' | 'Attractors'

  // New Semantic Fields
  schemaVersion: "1.0" // Version of this semantic schema itself
  description: string // A concise (1-2 sentence) summary of the pattern.
  longDescription?: string // Optional longer explanation for tooltips or info panels.
  semantics: SemanticTags
  performance: PerformanceProfile
  educationalLinks?: EducationalLink[]
  version: string // Version of this specific pattern's implementation, e.g., "1.0.0"
  author: string // e.g., "Aaron Brown", "Aaron Brown & Claude"
  dateAdded: string // ISO Date string (YYYY-MM-DD)
  lastModified: string // ISO Date string (YYYY-MM-DD)
  relatedPatterns?: string[] // IDs of other related patterns in your system (e.g., lorenz -> aizawa)
  isInteractive?: boolean // Quick flag if it supports DirectManipulation or Seeding
  isAnimatedByDefault?: boolean // Does it animate without user interaction on animation controls?
  status: "Production" | "Experimental" | "Deprecated" | "NeedsRefactor" // Current status of the pattern
}

// Type guard to check if a pattern has semantic metadata
export function hasSemanticMetadata(pattern: unknown): pattern is RichPatternGeneratorDefinition {
  return (
    typeof pattern === 'object' && 
    pattern !== null &&
    'schemaVersion' in pattern && 
    'semantics' in pattern && 
    'performance' in pattern
  )
}

// Helper type for transitioning existing patterns
export type EnrichedPatternGenerator = Omit<RichPatternGeneratorDefinition, 'controls'> & {
  controls?: (PatternControl | RichPatternControlDefinition)[]
}