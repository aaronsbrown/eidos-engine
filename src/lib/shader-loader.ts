// AIDEV-NOTE: Shader loading utility for dynamic loading of external GLSL files

import type { ShaderProgram, ShaderUniform } from './shader-types'

// Cache for loaded shaders to avoid repeated file reads
const shaderCache = new Map<string, ShaderProgram>()

/**
 * Load shader files dynamically from the shaders directory
 * @param name - Name of the shader (without extension)
 * @param vertexName - Optional custom vertex shader name (defaults to 'fullscreen-quad')
 * @returns Promise resolving to ShaderProgram
 */
export async function loadShader(
  name: string, 
  vertexName: string = 'fullscreen-quad'
): Promise<ShaderProgram> {
  const cacheKey = `${vertexName}:${name}`
  
  // Return cached shader if available
  if (shaderCache.has(cacheKey)) {
    return shaderCache.get(cacheKey)!
  }

  try {
    // Load vertex and fragment shaders in parallel
    const [vertexResponse, fragmentResponse] = await Promise.all([
      fetch(`/shaders/vertex/${vertexName}.vert`),
      fetch(`/shaders/fragment/${name}.frag`)
    ])

    if (!vertexResponse.ok) {
      throw new Error(`Failed to load vertex shader: ${vertexName}.vert (${vertexResponse.status})`)
    }

    if (!fragmentResponse.ok) {
      throw new Error(`Failed to load fragment shader: ${name}.frag (${fragmentResponse.status})`)
    }

    const [vertex, fragment] = await Promise.all([
      vertexResponse.text(),
      fragmentResponse.text()
    ])

    const shaderProgram: ShaderProgram = {
      vertex: vertex.trim(),
      fragment: fragment.trim(),
      uniforms: extractUniforms(fragment)
    }

    // Cache the loaded shader
    shaderCache.set(cacheKey, shaderProgram)
    
    return shaderProgram
  } catch (error) {
    console.error(`Error loading shader "${name}":`, error)
    throw error
  }
}

/**
 * Synchronous shader loading for build-time use
 * Note: This would require build-time processing in a real implementation
 * For now, it throws an error to indicate it's not implemented
 */
export function loadShaderSync(name: string): ShaderProgram {
  throw new Error(`Synchronous shader loading not implemented for "${name}". Use loadShader() with async/await.`)
}

/**
 * Extract uniform declarations from shader source code
 * @param shaderSource - GLSL shader source code
 * @returns Record of uniform names and their types
 */
function extractUniforms(shaderSource: string): Record<string, ShaderUniform> {
  const uniforms: Record<string, ShaderUniform> = {}
  
  // Regex to match uniform declarations: uniform type name;
  const uniformRegex = /uniform\s+(float|vec[234]|int|bool|mat[234]|sampler2D)\s+(\w+)\s*;/g
  
  let match
  while ((match = uniformRegex.exec(shaderSource)) !== null) {
    const [, type, name] = match
    uniforms[name] = {
      type: type as ShaderUniform['type']
    }
  }
  
  return uniforms
}

/**
 * Create and compile a WebGL shader
 * @param gl - WebGL rendering context
 * @param type - Shader type (gl.VERTEX_SHADER or gl.FRAGMENT_SHADER)
 * @param source - Shader source code
 * @returns Compiled WebGL shader or null if compilation failed
 */
export function createShader(
  gl: WebGLRenderingContext, 
  type: number, 
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) {
    console.error('Failed to create shader')
    return null
  }
  
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader)
    console.error('Shader compilation error:', error)
    console.error('Shader source:', source)
    gl.deleteShader(shader)
    return null
  }
  
  return shader
}

/**
 * Create and link a WebGL program from vertex and fragment shaders
 * @param gl - WebGL rendering context
 * @param vertexSource - Vertex shader source code
 * @param fragmentSource - Fragment shader source code
 * @returns Linked WebGL program or null if linking failed
 */
export function createShaderProgram(
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string
): WebGLProgram | null {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
  
  if (!vertexShader || !fragmentShader) {
    return null
  }

  const program = gl.createProgram()
  if (!program) {
    console.error('Failed to create shader program')
    return null
  }

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program)
    console.error('Program linking error:', error)
    gl.deleteProgram(program)
    return null
  }

  // Clean up shaders (they're now part of the program)
  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)

  return program
}

/**
 * Clear the shader cache (useful for development/hot reload)
 */
export function clearShaderCache(): void {
  shaderCache.clear()
}