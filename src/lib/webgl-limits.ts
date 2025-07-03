// AIDEV-NOTE: WebGL resource limits to prevent browser freeze and performance issues
// Simple, practical limits for a pattern generator app

/**
 * Global WebGL resource limits
 * Applied when pattern-specific limits are not defined
 */
export const WEBGL_LIMITS = {
  /** Maximum number of particles to prevent browser freeze */
  MAX_PARTICLES: 5000,
  
  /** Maximum particles for complex attractors (same as general limit) */
  MAX_ATTRACTOR_PARTICLES: 5000,
  
  /** Maximum texture size for WebGL operations */
  MAX_TEXTURE_SIZE: 2048,
  
  /** Maximum number of draw calls per frame */
  MAX_DRAW_CALLS: 100
} as const

/**
 * Apply particle count limit with pattern-specific override
 * @param requestedCount - User requested particle count
 * @param patternMax - Optional pattern-specific maximum (from control metadata)
 * @returns Safe particle count within limits
 */
export function applySafeParticleCount(
  requestedCount: number, 
  patternMax?: number
): number {
  const limit = patternMax ?? WEBGL_LIMITS.MAX_PARTICLES
  return Math.min(Math.max(1, requestedCount), limit)
}

/**
 * Get the maximum particle count from control definition
 * @param controls - Pattern control definitions
 * @returns Maximum particle count or global fallback
 */
export function getParticleCountLimit(
  controls?: Array<{id: string, max?: number}>
): number {
  const particleControl = controls?.find(c => c.id === 'particleCount')
  return particleControl?.max ?? WEBGL_LIMITS.MAX_PARTICLES
}