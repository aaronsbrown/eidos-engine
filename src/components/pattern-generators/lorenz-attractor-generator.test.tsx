// AIDEV-NOTE: Tests for Lorenz Attractor Three.js pattern generator
// Focuses on structure, props, and integration rather than Three.js rendering

import React from 'react'
import { render } from '@testing-library/react'
import { patternGenerators } from './index'
import LorenzAttractorGenerator from './lorenz-attractor-generator'

// Mock WebGL context for testing
const mockWebGLContext = {
  getExtension: jest.fn(),
  createShader: jest.fn(),
  shaderSource: jest.fn(),
  compileShader: jest.fn(),
  getShaderParameter: jest.fn(() => true),
  createProgram: jest.fn(),
  attachShader: jest.fn(),
  linkProgram: jest.fn(),
  getProgramParameter: jest.fn(() => true),
  useProgram: jest.fn(),
  createBuffer: jest.fn(),
  bindBuffer: jest.fn(),
  bufferData: jest.fn(),
  getAttribLocation: jest.fn(() => 0),
  enableVertexAttribArray: jest.fn(),
  vertexAttribPointer: jest.fn(),
  getUniformLocation: jest.fn(() => ({})),
  uniformMatrix4fv: jest.fn(),
  uniform1f: jest.fn(),
  clearColor: jest.fn(),
  clear: jest.fn(),
  drawArrays: jest.fn(),
  enable: jest.fn(),
  blendFunc: jest.fn(),
  viewport: jest.fn(),
  deleteProgram: jest.fn(),
  deleteBuffer: jest.fn(),
  getError: jest.fn(() => 0), // GL_NO_ERROR
  COLOR_BUFFER_BIT: 0x00004000,
  DEPTH_BUFFER_BIT: 0x00000100,
  DEPTH_TEST: 0x0B71,
  BLEND: 0x0BE2,
  SRC_ALPHA: 0x0302,
  ONE_MINUS_SRC_ALPHA: 0x0303,
  VERTEX_SHADER: 0x8B31,
  FRAGMENT_SHADER: 0x8B30,
  COMPILE_STATUS: 0x8B81,
  LINK_STATUS: 0x8B82,
  ARRAY_BUFFER: 0x8892,
  STATIC_DRAW: 0x88E4,
  DYNAMIC_DRAW: 0x88E8,
  FLOAT: 0x1406,
  POINTS: 0x0000,
  NO_ERROR: 0
}

// Mock canvas getContext
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: jest.fn((contextType) => {
    if (contextType === 'webgl' || contextType === 'experimental-webgl') {
      return mockWebGLContext
    }
    return null
  })
})

// Mock shader loading
jest.mock('@/lib/shader-loader', () => ({
  loadShader: jest.fn().mockResolvedValue({
    vertex: 'mock vertex shader',
    fragment: 'mock fragment shader'
  }),
  createShaderProgram: jest.fn().mockReturnValue({})
}))

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
  setTimeout(cb, 16)
  return 1
})

global.cancelAnimationFrame = jest.fn()

describe('Lorenz Attractor Pattern Generator', () => {
  describe('Pattern Definition', () => {
    test('is properly registered in pattern generators list', () => {
      const lorenzPattern = patternGenerators.find(p => p.id === 'lorenz-attractor')
      
      expect(lorenzPattern).toBeDefined()
      expect(lorenzPattern?.name).toBe('Lorenz Attractor')
      expect(lorenzPattern?.component).toBe(LorenzAttractorGenerator)
    })

    test('has correct WebGL technology specification', () => {
      const lorenzPattern = patternGenerators.find(p => p.id === 'lorenz-attractor')
      
      expect(lorenzPattern?.technology).toBe('WEBGL_MESHES')
      expect(lorenzPattern?.category).toBe('Simulation')
    })

    test('has proper semantic metadata structure', () => {
      const lorenzPattern = patternGenerators.find(p => p.id === 'lorenz-attractor')
      
      expect(lorenzPattern?.semantics).toBeDefined()
      expect(lorenzPattern?.semantics.primaryAlgorithmFamily).toBe('StrangeAttractor')
      expect(lorenzPattern?.semantics.dimensionality).toBe('True3D_WebGL')
      expect(lorenzPattern?.semantics.keyMathematicalConcepts).toContain('ChaosTheory')
      expect(lorenzPattern?.semantics.keyMathematicalConcepts).toContain('Calculus')
      expect(lorenzPattern?.semantics.visualCharacteristics).toContain('Chaotic')
      expect(lorenzPattern?.semantics.visualCharacteristics).toContain('Flowing')
    })

    test('has required control definitions', () => {
      const lorenzPattern = patternGenerators.find(p => p.id === 'lorenz-attractor')
      
      expect(lorenzPattern?.controls).toBeDefined()
      expect(lorenzPattern?.controls?.length).toBeGreaterThan(0)
      
      // Check for essential Lorenz parameters
      const controlIds = lorenzPattern?.controls?.map(c => c.id) || []
      expect(controlIds).toContain('sigma')
      expect(controlIds).toContain('rho')  
      expect(controlIds).toContain('beta')
      expect(controlIds).toContain('particleCount')
      expect(controlIds).toContain('autoRotate')
      expect(controlIds).toContain('autoRotateSpeed')
      
      // Check for visual quality controls
      expect(controlIds).toContain('useCustomShader')
      expect(controlIds).toContain('colorScheme')
      expect(controlIds).toContain('depthFading')
      expect(controlIds).toContain('showAxes')
    })

    test('has performance metadata', () => {
      const lorenzPattern = patternGenerators.find(p => p.id === 'lorenz-attractor')
      
      expect(lorenzPattern?.performance).toBeDefined()
      expect(lorenzPattern?.performance.computationalComplexity).toBe('Medium')
      expect(lorenzPattern?.performance.typicalFrameRateTarget).toBe('60fps')
    })
  })

  describe('Control Parameter Validation', () => {
    test('sigma control has appropriate bounds', () => {
      const lorenzPattern = patternGenerators.find(p => p.id === 'lorenz-attractor')
      const sigmaControl = lorenzPattern?.controls?.find(c => c.id === 'sigma')
      
      expect(sigmaControl).toBeDefined()
      expect(sigmaControl?.type).toBe('range')
      expect(sigmaControl?.min).toBeGreaterThan(0)
      expect(sigmaControl?.max).toBeGreaterThan(sigmaControl?.min || 0)
      expect(sigmaControl?.defaultValue).toBe(10) // Standard Lorenz value
    })

    test('rho control has appropriate bounds', () => {
      const lorenzPattern = patternGenerators.find(p => p.id === 'lorenz-attractor')
      const rhoControl = lorenzPattern?.controls?.find(c => c.id === 'rho')
      
      expect(rhoControl).toBeDefined()
      expect(rhoControl?.type).toBe('range')
      expect(rhoControl?.min).toBeGreaterThan(0)
      expect(rhoControl?.max).toBeGreaterThan(20) // Should allow chaotic regime
      expect(rhoControl?.defaultValue).toBe(28) // Standard chaotic value
    })

    test('beta control has appropriate bounds', () => {
      const lorenzPattern = patternGenerators.find(p => p.id === 'lorenz-attractor')
      const betaControl = lorenzPattern?.controls?.find(c => c.id === 'beta')
      
      expect(betaControl).toBeDefined()
      expect(betaControl?.type).toBe('range')
      expect(betaControl?.min).toBeGreaterThan(0)
      expect(betaControl?.defaultValue).toBeCloseTo(8/3, 2) // Standard value
    })

    test('particleCount has performance-conscious bounds', () => {
      const lorenzPattern = patternGenerators.find(p => p.id === 'lorenz-attractor')
      const particleControl = lorenzPattern?.controls?.find(c => c.id === 'particleCount')
      
      expect(particleControl).toBeDefined()
      expect(particleControl?.type).toBe('range')
      expect(particleControl?.min).toBeGreaterThanOrEqual(100) // Minimum for visual effect
      expect(particleControl?.max).toBeLessThanOrEqual(5000) // Performance limit
      expect(particleControl?.defaultValue).toBe(1000) // Good balance
    })

    test('autoRotate control has correct configuration', () => {
      const lorenzPattern = patternGenerators.find(p => p.id === 'lorenz-attractor')
      const autoRotateControl = lorenzPattern?.controls?.find(c => c.id === 'autoRotate')
      
      expect(autoRotateControl).toBeDefined()
      expect(autoRotateControl?.type).toBe('checkbox')
      expect(autoRotateControl?.defaultValue).toBe(false) // Disabled by default
      expect(autoRotateControl?.role).toBe('InteractionModifier')
      expect(autoRotateControl?.group).toBe('Camera Behavior')
    })

    test('autoRotateSpeed control has appropriate bounds', () => {
      const lorenzPattern = patternGenerators.find(p => p.id === 'lorenz-attractor')
      const speedControl = lorenzPattern?.controls?.find(c => c.id === 'autoRotateSpeed')
      
      expect(speedControl).toBeDefined()
      expect(speedControl?.type).toBe('range')
      expect(speedControl?.min).toBe(0.1) // Slow enough to be useful
      expect(speedControl?.max).toBe(3.0) // Fast enough for dramatic effect
      expect(speedControl?.defaultValue).toBe(1.0) // Standard speed
      expect(speedControl?.role).toBe('InteractionModifier')
      expect(speedControl?.group).toBe('Camera Behavior')
    })
  })

  describe('Component Rendering', () => {
    test('renders without crashing', () => {
      render(
        <LorenzAttractorGenerator 
          width={400} 
          height={300}
          controlValues={{ sigma: 10, rho: 28, beta: 8/3, particleCount: 500 }}
        />
      )
      
      // Should render Three.js canvas container
      const container = document.querySelector('div[style*="width: 400px"]')
      expect(container).toBeInTheDocument()
    })

    test('creates container with correct dimensions', () => {
      render(
        <LorenzAttractorGenerator 
          width={800} 
          height={600}
          controlValues={{}}
        />
      )
      
      const container = document.querySelector('div[style*="width: 800px"]')
      expect(container).toBeInTheDocument()
      expect(container).toHaveStyle('height: 600px')
    })

    test('accepts control values through props', () => {
      const controlValues = {
        sigma: 15,
        rho: 35,
        beta: 3,
        particleCount: 2000
      }
      
      // Should not throw with different control values
      expect(() => {
        render(
          <LorenzAttractorGenerator 
            width={400} 
            height={300}
            controlValues={controlValues}
          />
        )
      }).not.toThrow()
    })

    test('handles missing control values gracefully', () => {
      // Should work with undefined control values (use defaults)
      expect(() => {
        render(
          <LorenzAttractorGenerator 
            width={400} 
            height={300}
            controlValues={undefined}
          />
        )
      }).not.toThrow()
    })
  })

  describe('Three.js Integration', () => {
    test('renders with ThreeJSCanvas wrapper', () => {
      render(
        <LorenzAttractorGenerator 
          width={400} 
          height={300}
          controlValues={{}}
        />
      )
      
      // Should render without throwing errors
      // Note: Three.js rendering is complex to test, we focus on no crashes
      const container = document.querySelector('div')
      expect(container).toBeInTheDocument()
    })

    test('passes control values to pattern logic', () => {
      const controlValues = {
        sigma: 12,
        rho: 30,
        beta: 3,
        particleCount: 500,
        particleSize: 0.03
      }
      
      // Should not throw with valid control values
      expect(() => {
        render(
          <LorenzAttractorGenerator 
            width={400} 
            height={300}
            controlValues={controlValues}
          />
        )
      }).not.toThrow()
    })

    test('handles autoRotate control values', () => {
      const controlValues = {
        sigma: 10,
        rho: 28,
        beta: 8/3,
        particleCount: 1000,
        particleSize: 0.02,
        autoRotate: true,
        autoRotateSpeed: 2.0
      }
      
      // Should not throw with autoRotate control values
      expect(() => {
        render(
          <LorenzAttractorGenerator 
            width={400} 
            height={300}
            controlValues={controlValues}
          />
        )
      }).not.toThrow()
    })

    test('uses default autoRotate values when not provided', () => {
      const controlValues = {
        sigma: 10,
        rho: 28,
        // autoRotate values intentionally omitted
      }
      
      // Should not throw and use defaults
      expect(() => {
        render(
          <LorenzAttractorGenerator 
            width={400} 
            height={300}
            controlValues={controlValues}
          />
        )
      }).not.toThrow()
    })

    test('handles visual quality control values', () => {
      const controlValues = {
        sigma: 10,
        rho: 28,
        beta: 8/3,
        particleCount: 1000,
        useCustomShader: true,
        colorScheme: 0, // Rainbow depth
        depthFading: true,
        showAxes: true
      }
      
      // Should not throw with visual quality controls
      expect(() => {
        render(
          <LorenzAttractorGenerator 
            width={400} 
            height={300}
            controlValues={controlValues}
          />
        )
      }).not.toThrow()
    })

    test('handles color scheme options correctly', () => {
      const colorSchemes = [0, 1, 2] // Rainbow, Warm-Cool, Monochrome
      
      colorSchemes.forEach(scheme => {
        const controlValues = {
          sigma: 10,
          rho: 28,
          colorScheme: scheme,
          useCustomShader: true
        }
        
        expect(() => {
          render(
            <LorenzAttractorGenerator 
              width={400} 
              height={300}
              controlValues={controlValues}
            />
          )
        }).not.toThrow()
      })
    })
  })

  describe('Visual Quality Controls', () => {
    test('useCustomShader control has correct configuration', () => {
      const lorenzPattern = patternGenerators.find(p => p.id === 'lorenz-attractor')
      const shaderControl = lorenzPattern?.controls?.find(c => c.id === 'useCustomShader')
      
      expect(shaderControl).toBeDefined()
      expect(shaderControl?.type).toBe('checkbox')
      expect(shaderControl?.defaultValue).toBe(false)
      expect(shaderControl?.role).toBe('VisualAesthetic')
      expect(shaderControl?.group).toBe('Visual Effects')
    })

    test('colorScheme control has proper options', () => {
      const lorenzPattern = patternGenerators.find(p => p.id === 'lorenz-attractor')
      const colorControl = lorenzPattern?.controls?.find(c => c.id === 'colorScheme')
      
      expect(colorControl).toBeDefined()
      expect(colorControl?.type).toBe('select')
      expect(colorControl?.defaultValue).toBe(1) // Warm-Cool default
      expect(colorControl?.options).toHaveLength(3)
      expect(colorControl?.options?.[0].label).toBe('Rainbow Depth')
      expect(colorControl?.options?.[1].label).toBe('Warm-Cool')
      expect(colorControl?.options?.[2].label).toBe('Monochrome')
    })

    test('depthFading control has appropriate settings', () => {
      const lorenzPattern = patternGenerators.find(p => p.id === 'lorenz-attractor')
      const fadingControl = lorenzPattern?.controls?.find(c => c.id === 'depthFading')
      
      expect(fadingControl).toBeDefined()
      expect(fadingControl?.type).toBe('checkbox')
      expect(fadingControl?.defaultValue).toBe(true)
      expect(fadingControl?.role).toBe('VisualAesthetic')
      expect(fadingControl?.impactsPerformance).toBe('Negligible')
    })

    test('showAxes control configuration', () => {
      const lorenzPattern = patternGenerators.find(p => p.id === 'lorenz-attractor')
      const axesControl = lorenzPattern?.controls?.find(c => c.id === 'showAxes')
      
      expect(axesControl).toBeDefined()
      expect(axesControl?.type).toBe('checkbox')
      expect(axesControl?.defaultValue).toBe(false)
      expect(axesControl?.role).toBe('InteractionModifier')
      expect(axesControl?.group).toBe('Visual Effects')
    })
  })
})