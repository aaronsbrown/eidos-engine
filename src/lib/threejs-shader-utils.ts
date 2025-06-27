// AIDEV-NOTE: Utilities for using external shaders with Three.js materials
// Bridges our external shader system with Three.js for advanced effects

import * as THREE from "three"
import { loadShader } from "./shader-loader"

/**
 * Creates a Three.js ShaderMaterial from external shader files
 */
export async function createThreeJSShaderMaterial(
  shaderName: string,
  vertexShaderName?: string,
  uniforms: Record<string, { value: unknown }> = {}
): Promise<THREE.ShaderMaterial> {
  const shaderProgram = await loadShader(shaderName, vertexShaderName)
  
  return new THREE.ShaderMaterial({
    vertexShader: shaderProgram.vertex,
    fragmentShader: shaderProgram.fragment,
    uniforms: {
      // Default uniforms that most patterns need
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(1.0, 1.0) },
      u_mouse: { value: new THREE.Vector2(0.0, 0.0) },
      // Custom uniforms
      ...uniforms
    },
    transparent: true,
    blending: THREE.AdditiveBlending
  })
}

/**
 * Creates a Three.js PointsMaterial with custom shader support
 */
export async function createThreeJSPointMaterial(
  shaderName: string,
  options: {
    size?: number
    color?: string | number
    transparent?: boolean
    opacity?: number
    blending?: THREE.Blending
    uniforms?: Record<string, { value: unknown }>
  } = {}
): Promise<THREE.ShaderMaterial> {
  const {
    size = 1.0,
    color = 0xffffff,
    transparent = true,
    opacity = 1.0,
    blending = THREE.AdditiveBlending,
    uniforms = {}
  } = options

  const material = await createThreeJSShaderMaterial(shaderName, undefined, {
    u_pointSize: { value: size },
    u_color: { value: new THREE.Color(color) },
    u_opacity: { value: opacity },
    ...uniforms
  })

  material.transparent = transparent
  material.blending = blending
  
  return material
}

/**
 * Updates shader uniforms commonly used in animations
 */
export function updateShaderUniforms(
  material: THREE.ShaderMaterial,
  time: number,
  resolution?: { width: number; height: number },
  mouse?: { x: number; y: number }
) {
  if (material.uniforms.u_time) {
    material.uniforms.u_time.value = time
  }
  
  if (resolution && material.uniforms.u_resolution) {
    material.uniforms.u_resolution.value.set(resolution.width, resolution.height)
  }
  
  if (mouse && material.uniforms.u_mouse) {
    material.uniforms.u_mouse.value.set(mouse.x, mouse.y)
  }
}

/**
 * Creates a hybrid material that can use either Three.js built-in or custom shaders
 */
export function createHybridMaterial(
  useCustomShader: boolean,
  shaderName?: string,
  fallbackMaterial?: THREE.Material
): Promise<THREE.Material> | THREE.Material {
  if (useCustomShader && shaderName) {
    return createThreeJSShaderMaterial(shaderName)
  }
  
  return fallbackMaterial || new THREE.MeshBasicMaterial({ color: 0xff0000 })
}

/**
 * Utility for patterns that want to conditionally upgrade to custom shaders
 */
export interface ShaderEnhancedMaterialOptions {
  enableCustomShader?: boolean
  shaderName?: string
  fallbackMaterial: THREE.Material
  uniforms?: Record<string, { value: unknown }>
}

export async function createShaderEnhancedMaterial(
  options: ShaderEnhancedMaterialOptions
): Promise<THREE.Material> {
  const { enableCustomShader, shaderName, fallbackMaterial, uniforms = {} } = options
  
  if (enableCustomShader && shaderName) {
    try {
      return await createThreeJSShaderMaterial(shaderName, undefined, uniforms)
    } catch (error) {
      console.warn(`Failed to load custom shader "${shaderName}", falling back to built-in material:`, error)
      return fallbackMaterial
    }
  }
  
  return fallbackMaterial
}