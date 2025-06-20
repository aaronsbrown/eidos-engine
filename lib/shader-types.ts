// AIDEV-NOTE: TypeScript definitions for shader uniforms and WebGL utilities

/**
 * Supported GLSL uniform types with their corresponding TypeScript types
 */
export interface ShaderUniformTypeMap {
  float: number
  vec2: [number, number]
  vec3: [number, number, number]
  vec4: [number, number, number, number]
  int: number
  bool: boolean
  mat2: Float32Array | number[]
  mat3: Float32Array | number[]
  mat4: Float32Array | number[]
  sampler2D: WebGLTexture
}

/**
 * Base shader uniform definition
 */
export interface ShaderUniform {
  type: keyof ShaderUniformTypeMap
  description?: string
}

/**
 * Complete shader program definition with uniforms
 */
export interface ShaderProgram {
  vertex: string
  fragment: string
  uniforms?: Record<string, ShaderUniform>
}

/**
 * Uniform value types for common pattern generator uniforms
 */
export interface BrownianMotionUniforms {
  u_resolution: [number, number]
  u_time: number
  u_particleCount: number
  u_speed: number
  u_brightness: number
  u_trailLength: number
  u_jitterAmount: number
}

/**
 * Generic WebGL uniform setter function type
 */
export type UniformSetter = (
  gl: WebGLRenderingContext,
  location: WebGLUniformLocation,
  value: unknown
) => void

/**
 * Map of GLSL types to their WebGL uniform setter functions
 */
export const UNIFORM_SETTERS: Record<keyof ShaderUniformTypeMap, UniformSetter> = {
  float: (gl, location, value) => gl.uniform1f(location, value as number),
  vec2: (gl, location, value) => {
    const v = value as [number, number]
    gl.uniform2f(location, v[0], v[1])
  },
  vec3: (gl, location, value) => {
    const v = value as [number, number, number]
    gl.uniform3f(location, v[0], v[1], v[2])
  },
  vec4: (gl, location, value) => {
    const v = value as [number, number, number, number]
    gl.uniform4f(location, v[0], v[1], v[2], v[3])
  },
  int: (gl, location, value) => gl.uniform1i(location, value as number),
  bool: (gl, location, value) => gl.uniform1i(location, (value as boolean) ? 1 : 0),
  mat2: (gl, location, value) => gl.uniformMatrix2fv(location, false, value as Float32Array | number[]),
  mat3: (gl, location, value) => gl.uniformMatrix3fv(location, false, value as Float32Array | number[]),
  mat4: (gl, location, value) => gl.uniformMatrix4fv(location, false, value as Float32Array | number[]),
  sampler2D: () => {
    // This is more complex and requires texture unit management
    throw new Error('sampler2D uniform setting not implemented in this utility')
  }
}

/**
 * Helper to set uniform values with type safety
 */
export function setUniform(
  gl: WebGLRenderingContext,
  location: WebGLUniformLocation | null,
  type: keyof ShaderUniformTypeMap,
  value: unknown
): void {
  if (!location) {
    console.warn('Uniform location is null, skipping')
    return
  }

  const setter = UNIFORM_SETTERS[type]
  if (!setter) {
    console.error(`No uniform setter found for type: ${type}`)
    return
  }

  setter(gl, location, value)
}

/**
 * Predefined shader uniform schemas for common pattern generators
 */
export const SHADER_SCHEMAS = {
  'brownian-motion': {
    u_resolution: { type: 'vec2' as const, description: 'Canvas resolution in pixels' },
    u_time: { type: 'float' as const, description: 'Animation time in seconds' },
    u_particleCount: { type: 'float' as const, description: 'Number of particles to render' },
    u_speed: { type: 'float' as const, description: 'Animation speed multiplier' },
    u_brightness: { type: 'float' as const, description: 'Particle brightness multiplier' },
    u_trailLength: { type: 'float' as const, description: 'Particle trail length' },
    u_jitterAmount: { type: 'float' as const, description: 'Brownian motion jitter amount' }
  },
  // Add more shader schemas as needed
} as const

/**
 * Example of type-safe uniform values for Brownian Motion shader
 * For more complex type mapping, use manual type definitions
 */
export type BrownianMotionShaderUniforms = {
  u_resolution: [number, number]
  u_time: number
  u_particleCount: number
  u_speed: number
  u_brightness: number
  u_trailLength: number
  u_jitterAmount: number
}