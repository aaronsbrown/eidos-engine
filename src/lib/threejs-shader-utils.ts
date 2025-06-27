// AIDEV-NOTE: Three.js shader utilities for enhanced pattern rendering
// Provides shader loading and material creation for WebGL-enhanced patterns

import * as THREE from 'three'
import { loadShader } from './shader-loader'

/**
 * Create a Three.js shader material from external shader files
 * @param vertexShaderName - Name of vertex shader file (without .vert extension)
 * @param fragmentShaderName - Name of fragment shader file (without .frag extension)  
 * @param uniforms - Custom uniforms for the shader
 * @returns Promise<THREE.ShaderMaterial>
 */
export async function createThreeJSShaderMaterial(
  vertexShaderName: string,
  fragmentShaderName: string,
  uniforms: Record<string, { value: number | string | boolean | THREE.Vector2 | THREE.Vector3 | THREE.Vector4 }> = {}
): Promise<THREE.ShaderMaterial> {
  try {
    // Load shader files
    const shaderProgram = await loadShader(vertexShaderName, fragmentShaderName)
    
    // Create standard Three.js uniforms
    const defaultUniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(1.0, 1.0) },
      u_mouse: { value: new THREE.Vector2(0.0, 0.0) },
      ...uniforms
    }
    
    // Create Three.js shader material
    const material = new THREE.ShaderMaterial({
      vertexShader: shaderProgram.vertex,
      fragmentShader: shaderProgram.fragment,
      uniforms: defaultUniforms,
      transparent: true,
      blending: THREE.AdditiveBlending
    })
    
    return material
  } catch (error) {
    console.error('Failed to create Three.js shader material:', error)
    throw error
  }
}

/**
 * Create shader-enhanced material with fallback to basic material
 * @param options - Configuration options
 * @returns Promise<THREE.Material>
 */
export async function createShaderEnhancedMaterial(options: {
  enableCustomShader: boolean
  shaderName?: string
  fallbackMaterial: THREE.Material
  uniforms?: Record<string, { value: number | string | boolean | THREE.Vector2 | THREE.Vector3 | THREE.Vector4 }>
}): Promise<THREE.Material> {
  const { enableCustomShader, shaderName, fallbackMaterial, uniforms = {} } = options
  
  if (!enableCustomShader || !shaderName) {
    return fallbackMaterial
  }
  
  try {
    return await createThreeJSShaderMaterial(shaderName, shaderName, uniforms)
  } catch (error) {
    console.warn(`Shader enhancement failed, falling back to basic material:`, error)
    return fallbackMaterial
  }
}

/**
 * Update common shader uniforms for animation
 * @param material - Three.js shader material to update
 * @param time - Current time value
 * @param resolution - Screen resolution {width, height}
 * @param mouse - Mouse coordinates {x, y} (normalized 0-1)
 */
export function updateShaderUniforms(
  material: THREE.ShaderMaterial,
  time: number,
  resolution?: { width: number; height: number },
  mouse?: { x: number; y: number }
): void {
  // Update time uniform if it exists
  if (material.uniforms.u_time) {
    material.uniforms.u_time.value = time
  }
  
  // Update resolution uniform if provided and exists
  if (resolution && material.uniforms.u_resolution) {
    material.uniforms.u_resolution.value.set(resolution.width, resolution.height)
  }
  
  // Update mouse uniform if provided and exists
  if (mouse && material.uniforms.u_mouse) {
    material.uniforms.u_mouse.value.set(mouse.x, mouse.y)
  }
}