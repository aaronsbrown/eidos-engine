// AIDEV-NOTE: Tests for Three.js shader utility functions
// Tests integration between external shader system and Three.js materials

import * as THREE from 'three'
import { 
  createThreeJSShaderMaterial, 
  updateShaderUniforms, 
  createShaderEnhancedMaterial 
} from './threejs-shader-utils'

// Mock the shader loader
jest.mock('./shader-loader', () => ({
  loadShader: jest.fn().mockResolvedValue({
    vertex: 'attribute vec3 position; void main() { gl_Position = vec4(position, 1.0); }',
    fragment: 'precision mediump float; void main() { gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); }',
    uniforms: {
      u_time: { type: 'float' },
      u_resolution: { type: 'vec2' }
    }
  })
}))

describe('Three.js Shader Utilities', () => {
  describe('createThreeJSShaderMaterial', () => {
    test('creates shader material from external shaders', async () => {
      const material = await createThreeJSShaderMaterial('test-shader')
      
      expect(material).toBeInstanceOf(THREE.ShaderMaterial)
      expect(material.uniforms).toHaveProperty('u_time')
      expect(material.uniforms).toHaveProperty('u_resolution')
      expect(material.transparent).toBe(true)
      expect(material.blending).toBe(THREE.AdditiveBlending)
    })

    test('includes custom uniforms', async () => {
      const customUniforms = {
        u_customValue: { value: 42 },
        u_customColor: { value: new THREE.Color(0xff0000) }
      }

      const material = await createThreeJSShaderMaterial(
        'test-shader', 
        undefined, 
        customUniforms
      )
      
      expect(material.uniforms).toHaveProperty('u_customValue')
      expect(material.uniforms).toHaveProperty('u_customColor')
      expect(material.uniforms.u_customValue.value).toBe(42)
    })

    test('supports custom vertex shader names', async () => {
      const material = await createThreeJSShaderMaterial(
        'fragment-shader', 
        'custom-vertex'
      )
      
      expect(material).toBeInstanceOf(THREE.ShaderMaterial)
    })
  })

  describe('updateShaderUniforms', () => {
    let material: THREE.ShaderMaterial

    beforeEach(async () => {
      material = await createThreeJSShaderMaterial('test-shader')
    })

    test('updates time uniform', () => {
      const time = 123.456
      updateShaderUniforms(material, time)
      
      expect(material.uniforms.u_time.value).toBe(time)
    })

    test('updates resolution uniform', () => {
      const resolution = { width: 800, height: 600 }
      updateShaderUniforms(material, 0, resolution)
      
      expect(material.uniforms.u_resolution.value.x).toBe(800)
      expect(material.uniforms.u_resolution.value.y).toBe(600)
    })

    test('updates mouse uniform', () => {
      const mouse = { x: 0.5, y: 0.3 }
      updateShaderUniforms(material, 0, undefined, mouse)
      
      expect(material.uniforms.u_mouse.value.x).toBe(0.5)
      expect(material.uniforms.u_mouse.value.y).toBe(0.3)
    })

    test('updates all uniforms together', () => {
      updateShaderUniforms(
        material, 
        100, 
        { width: 1920, height: 1080 }, 
        { x: 0.2, y: 0.8 }
      )
      
      expect(material.uniforms.u_time.value).toBe(100)
      expect(material.uniforms.u_resolution.value.x).toBe(1920)
      expect(material.uniforms.u_mouse.value.y).toBe(0.8)
    })

    test('handles missing uniforms gracefully', () => {
      // Create material without all standard uniforms
      const basicMaterial = new THREE.ShaderMaterial({
        uniforms: { u_customOnly: { value: 1 } },
        vertexShader: 'void main() { gl_Position = vec4(0.0); }',
        fragmentShader: 'void main() { gl_FragColor = vec4(1.0); }'
      })

      // Should not throw even if uniforms don't exist
      expect(() => {
        updateShaderUniforms(basicMaterial, 100)
      }).not.toThrow()
    })
  })

  describe('createShaderEnhancedMaterial', () => {
    test('returns custom shader when enabled', async () => {
      const fallbackMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      
      const material = await createShaderEnhancedMaterial({
        enableCustomShader: true,
        shaderName: 'test-shader',
        fallbackMaterial
      })
      
      expect(material).toBeInstanceOf(THREE.ShaderMaterial)
    })

    test('returns fallback material when disabled', async () => {
      const fallbackMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      
      const material = await createShaderEnhancedMaterial({
        enableCustomShader: false,
        fallbackMaterial
      })
      
      expect(material).toBe(fallbackMaterial)
      expect(material).toBeInstanceOf(THREE.MeshBasicMaterial)
    })

    test('falls back on shader loading error', async () => {
      // Mock shader loading failure
      const shaderLoaderModule = await import('./shader-loader')
      const mockLoadShader = shaderLoaderModule.loadShader as jest.MockedFunction<typeof shaderLoaderModule.loadShader>
      mockLoadShader.mockRejectedValueOnce(new Error('Shader not found'))

      const fallbackMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff })
      
      const material = await createShaderEnhancedMaterial({
        enableCustomShader: true,
        shaderName: 'missing-shader',
        fallbackMaterial
      })
      
      expect(material).toBe(fallbackMaterial)
      expect(material).toBeInstanceOf(THREE.MeshBasicMaterial)
    })

    test('includes custom uniforms in shader material', async () => {
      const fallbackMaterial = new THREE.MeshBasicMaterial()
      const customUniforms = {
        u_intensity: { value: 2.5 }
      }
      
      const material = await createShaderEnhancedMaterial({
        enableCustomShader: true,
        shaderName: 'test-shader',
        fallbackMaterial,
        uniforms: customUniforms
      })
      
      expect(material).toBeInstanceOf(THREE.ShaderMaterial)
      if (material instanceof THREE.ShaderMaterial) {
        expect(material.uniforms.u_intensity.value).toBe(2.5)
      }
    })
  })

  describe('Error Handling', () => {
    test('handles shader loading failures gracefully', async () => {
      const shaderLoaderModule = await import('./shader-loader')
      const mockLoadShader = shaderLoaderModule.loadShader as jest.MockedFunction<typeof shaderLoaderModule.loadShader>
      mockLoadShader.mockRejectedValueOnce(new Error('Network error'))

      await expect(createThreeJSShaderMaterial('failing-shader'))
        .rejects.toThrow('Network error')
    })
  })
})