// AIDEV-NOTE: Lightweight re-export index after refactoring large pattern registry (2,039 → ~400 lines each)
// AIDEV-NOTE: Patterns split by category: noise, geometric, simulation, attractors for better maintainability

import { noisePatterns } from "./noise-patterns"
import { geometricPatterns } from "./geometric-patterns"
import { simulationPatterns } from "./simulation-patterns"
import { attractorPatterns } from "./attractor-patterns"

// Re-export all pattern generator components individually
export { default as NoiseFieldGenerator } from "./noise-field-generator"
export { default as PixelatedNoiseGenerator } from "./pixelated-noise-generator"
export { default as BrownianMotionGenerator } from "./brownian-motion-generator"
export { default as TrigonometricCircleGenerator } from "./trigonometric-circle-generator"
export { default as ParticleSystemGenerator } from "./particle-system-generator"
export { default as CellularAutomatonGenerator } from "./cellular-automaton-generator"
export { default as FourPoleGradientGenerator } from "./four-pole-gradient-generator"
export { default as LorenzAttractorGenerator } from "./lorenz-attractor-generator"
export { default as ThomasAttractorGenerator } from "./thomas-attractor-generator"
export { default as AizawaAttractorGenerator } from "./aizawa-attractor-generator"
export { default as HalvorsenAttractorGenerator } from "./halvorsen-attractor-generator"
export { default as NewtonLeipnikAttractorGenerator } from "./newton-leipnik-attractor-generator"

// Re-export types
export type { PatternGenerator, PatternGeneratorProps } from "./types"

// Combine all patterns into unsorted array
const unsortedPatternGenerators = [
  ...noisePatterns,
  ...geometricPatterns,
  ...simulationPatterns,
  ...attractorPatterns,
]

// AIDEV-NOTE: Sort patterns by category to group them properly in the UI
// Category order: Noise, Geometric, Simulation, Data Visualization, Attractors
const categoryOrder = ['Noise', 'Geometric', 'Simulation', 'Data Visualization', 'Attractors']

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