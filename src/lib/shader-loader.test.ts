// AIDEV-NOTE: Tests for WebGL shader loading and compilation utilities
// Tests the infrastructure that will be used by all WebGL pattern generators

import { loadShader, createShader, createShaderProgram, clearShaderCache } from './shader-loader'

// Mock fetch for shader file loading
global.fetch = jest.fn()

// Mock WebGL context for shader compilation tests
const mockGL = {
  createShader: jest.fn(),
  shaderSource: jest.fn(),
  compileShader: jest.fn(),
  getShaderParameter: jest.fn(),
  getShaderInfoLog: jest.fn(),
  deleteShader: jest.fn(),
  createProgram: jest.fn(),
  attachShader: jest.fn(),
  linkProgram: jest.fn(),
  getProgramParameter: jest.fn(),
  getProgramInfoLog: jest.fn(),
  deleteProgram: jest.fn(),
  VERTEX_SHADER: 0x8B31,
  FRAGMENT_SHADER: 0x8B30,
  COMPILE_STATUS: 0x8B81,
  LINK_STATUS: 0x8B82
} as WebGLRenderingContext

describe('Shader Loading System', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    clearShaderCache()
  })

  describe('loadShader', () => {
    test('loads vertex and fragment shaders successfully', async () => {
      const mockVertexShader = 'attribute vec3 a_position;\\nvoid main() { gl_Position = vec4(a_position, 1.0); }'
      const mockFragmentShader = 'precision mediump float;\\nvoid main() { gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0); }'
      
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockVertexShader)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockFragmentShader)
        })

      const result = await loadShader('test-shader')

      expect(fetch).toHaveBeenCalledWith('/shaders/vertex/fullscreen-quad.vert')
      expect(fetch).toHaveBeenCalledWith('/shaders/fragment/test-shader.frag')
      expect(result.vertex).toBe(mockVertexShader)
      expect(result.fragment).toBe(mockFragmentShader)
    })

    test('supports custom vertex shader names', async () => {
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve('vertex content')
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve('fragment content')
        })

      await loadShader('test-shader', 'custom-vertex')

      expect(fetch).toHaveBeenCalledWith('/shaders/vertex/custom-vertex.vert')
      expect(fetch).toHaveBeenCalledWith('/shaders/fragment/test-shader.frag')
    })

    test('caches loaded shaders to avoid repeated requests', async () => {
      ;(fetch as jest.Mock)
        .mockResolvedValue({
          ok: true,
          text: () => Promise.resolve('shader content')
        })

      // Load same shader twice
      await loadShader('cache-test')
      await loadShader('cache-test')

      // Should only fetch once due to caching
      expect(fetch).toHaveBeenCalledTimes(2) // vertex + fragment, only once
    })

    test('handles vertex shader loading failure', async () => {
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 404
        })

      await expect(loadShader('missing-shader')).rejects.toThrow('Failed to load vertex shader')
    })

    test('handles fragment shader loading failure', async () => {
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve('vertex content')
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404
        })

      await expect(loadShader('missing-fragment')).rejects.toThrow('Failed to load fragment shader')
    })

    test('extracts uniform definitions from fragment shader', async () => {
      const fragmentWithUniforms = `
        precision mediump float;
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform mat4 u_mvpMatrix;
        void main() { gl_FragColor = vec4(1.0); }
      `
      
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve('vertex content')
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(fragmentWithUniforms)
        })

      const result = await loadShader('uniform-test')

      expect(result.uniforms).toHaveProperty('u_time')
      expect(result.uniforms).toHaveProperty('u_resolution')
      expect(result.uniforms).toHaveProperty('u_mvpMatrix')
      expect(result.uniforms?.u_time.type).toBe('float')
      expect(result.uniforms?.u_resolution.type).toBe('vec2')
      expect(result.uniforms?.u_mvpMatrix.type).toBe('mat4')
    })
  })

  describe('createShader', () => {
    test('compiles shader successfully', () => {
      const mockShader = {}
      mockGL.createShader.mockReturnValue(mockShader)
      mockGL.getShaderParameter.mockReturnValue(true) // Compilation success

      const result = createShader(mockGL, mockGL.VERTEX_SHADER, 'void main() {}')

      expect(mockGL.createShader).toHaveBeenCalledWith(mockGL.VERTEX_SHADER)
      expect(mockGL.shaderSource).toHaveBeenCalledWith(mockShader, 'void main() {}')
      expect(mockGL.compileShader).toHaveBeenCalledWith(mockShader)
      expect(result).toBe(mockShader)
    })

    test('handles shader creation failure', () => {
      mockGL.createShader.mockReturnValue(null)

      const result = createShader(mockGL, mockGL.VERTEX_SHADER, 'void main() {}')

      expect(result).toBeNull()
    })

    test('handles compilation failure', () => {
      const mockShader = {}
      mockGL.createShader.mockReturnValue(mockShader)
      mockGL.getShaderParameter.mockReturnValue(false) // Compilation failure
      mockGL.getShaderInfoLog.mockReturnValue('Compilation error')

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const result = createShader(mockGL, mockGL.VERTEX_SHADER, 'invalid shader')

      expect(mockGL.deleteShader).toHaveBeenCalledWith(mockShader)
      expect(consoleSpy).toHaveBeenCalledWith('Shader compilation error:', 'Compilation error')
      expect(result).toBeNull()

      consoleSpy.mockRestore()
    })
  })

  describe('createShaderProgram', () => {
    test('creates and links program successfully', () => {
      const mockVertexShader = { type: 'vertex' }
      const mockFragmentShader = { type: 'fragment' }
      const mockProgram = {}
      
      mockGL.createShader
        .mockReturnValueOnce(mockVertexShader)
        .mockReturnValueOnce(mockFragmentShader)
      mockGL.getShaderParameter.mockReturnValue(true) // Compilation success
      mockGL.createProgram.mockReturnValue(mockProgram)
      mockGL.getProgramParameter.mockReturnValue(true) // Linking success

      const result = createShaderProgram(mockGL, 'vertex source', 'fragment source')

      expect(mockGL.attachShader).toHaveBeenCalledWith(mockProgram, mockVertexShader)
      expect(mockGL.attachShader).toHaveBeenCalledWith(mockProgram, mockFragmentShader)
      expect(mockGL.linkProgram).toHaveBeenCalledWith(mockProgram)
      expect(mockGL.deleteShader).toHaveBeenCalledWith(mockVertexShader)
      expect(mockGL.deleteShader).toHaveBeenCalledWith(mockFragmentShader)
      expect(result).toBe(mockProgram)
    })

    test('handles vertex shader compilation failure', () => {
      mockGL.createShader.mockReturnValueOnce(null) // Vertex shader creation fails

      const result = createShaderProgram(mockGL, 'invalid vertex', 'valid fragment')

      expect(result).toBeNull()
    })

    test('handles program creation failure', () => {
      const mockVertexShader = {}
      const mockFragmentShader = {}
      
      mockGL.createShader
        .mockReturnValueOnce(mockVertexShader)
        .mockReturnValueOnce(mockFragmentShader)
      mockGL.getShaderParameter.mockReturnValue(true)
      mockGL.createProgram.mockReturnValue(null) // Program creation fails

      const result = createShaderProgram(mockGL, 'vertex source', 'fragment source')

      expect(result).toBeNull()
    })

    test('handles program linking failure', () => {
      const mockVertexShader = {}
      const mockFragmentShader = {}
      const mockProgram = {}
      
      mockGL.createShader
        .mockReturnValueOnce(mockVertexShader)
        .mockReturnValueOnce(mockFragmentShader)
      mockGL.getShaderParameter.mockReturnValue(true)
      mockGL.createProgram.mockReturnValue(mockProgram)
      mockGL.getProgramParameter.mockReturnValue(false) // Linking failure
      mockGL.getProgramInfoLog.mockReturnValue('Linking error')

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const result = createShaderProgram(mockGL, 'vertex source', 'fragment source')

      expect(mockGL.deleteProgram).toHaveBeenCalledWith(mockProgram)
      expect(consoleSpy).toHaveBeenCalledWith('Program linking error:', 'Linking error')
      expect(result).toBeNull()

      consoleSpy.mockRestore()
    })
  })

  describe('clearShaderCache', () => {
    test('clears cached shaders', async () => {
      ;(fetch as jest.Mock)
        .mockResolvedValue({
          ok: true,
          text: () => Promise.resolve('shader content')
        })

      // Load shader to populate cache
      await loadShader('cache-clear-test')
      
      // Clear cache
      clearShaderCache()
      
      // Load again - should fetch again
      await loadShader('cache-clear-test')

      // Should have fetched twice (before and after cache clear)
      expect(fetch).toHaveBeenCalledTimes(4) // 2 loads × 2 files each
    })
  })
})