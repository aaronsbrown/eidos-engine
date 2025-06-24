// AIDEV-NOTE: Shared test utilities for mocking pattern generators - Issue #12
import { PatternGenerator } from '@/components/pattern-generators/types'

/**
 * Creates a mock pattern generator for testing
 */
export function createMockPatternGenerator(overrides?: Partial<PatternGenerator>): PatternGenerator {
  return {
    id: 'test-pattern',
    name: 'Test Pattern',
    component: () => null,
    technology: 'CANVAS_2D',
    category: 'Geometric',
    controls: [],
    ...overrides
  }
}

/**
 * Creates a set of mock pattern generators covering all categories
 */
export function createMockPatternGenerators(): PatternGenerator[] {
  return [
    {
      id: 'test-geometric-1',
      name: 'Test Geometric 1',
      component: () => null,
      technology: 'CANVAS_2D',
      category: 'Geometric',
      controls: [
        { id: 'speed', label: 'Speed', type: 'range', min: 0, max: 10, step: 1, defaultValue: 5 },
        { id: 'size', label: 'Size', type: 'range', min: 10, max: 100, step: 5, defaultValue: 50 }
      ]
    },
    {
      id: 'test-noise-1',
      name: 'Test Noise 1',
      component: () => null,
      technology: 'WEBGL_2.0',
      category: 'Noise',
      controls: [
        { id: 'scale', label: 'Scale', type: 'range', min: 1, max: 50, step: 1, defaultValue: 20 },
        { id: 'color', label: 'Color', type: 'color', defaultValue: '#00ff00' }
      ]
    },
    {
      id: 'test-simulation-1',
      name: 'Test Simulation 1',
      component: () => null,
      technology: 'WEBGL_2.0',
      category: 'Simulation',
      controls: [
        { id: 'particles', label: 'Particles', type: 'range', min: 10, max: 1000, step: 10, defaultValue: 100 },
        { id: 'gravity', label: 'Gravity', type: 'checkbox', defaultValue: false },
        { id: 'reset', label: 'Reset', type: 'button', defaultValue: false }
      ]
    },
    {
      id: 'test-dataviz-1',
      name: 'Test DataViz 1',
      component: () => null,
      technology: 'CANVAS_2D',
      category: 'Data Visualization',
      controls: [
        { 
          id: 'chartType', 
          label: 'Chart Type', 
          type: 'select', 
          defaultValue: 'bar',
          options: [
            { value: 'bar', label: 'Bar Chart' },
            { value: 'line', label: 'Line Chart' },
            { value: 'pie', label: 'Pie Chart' }
          ]
        }
      ]
    }
  ]
}

/**
 * Creates a mock WebGL context for testing WebGL patterns
 */
export function createMockWebGLContext(): WebGLRenderingContext {
  const mockProgram = {} as WebGLProgram
  const mockShader = {} as WebGLShader
  const mockBuffer = {} as WebGLBuffer
  const mockTexture = {} as WebGLTexture
  const mockFramebuffer = {} as WebGLFramebuffer
  const mockRenderbuffer = {} as WebGLRenderbuffer
  const mockUniformLocation = {} as WebGLUniformLocation
  
  return {
    createProgram: jest.fn(() => mockProgram),
    createShader: jest.fn(() => mockShader),
    createBuffer: jest.fn(() => mockBuffer),
    createTexture: jest.fn(() => mockTexture),
    createFramebuffer: jest.fn(() => mockFramebuffer),
    createRenderbuffer: jest.fn(() => mockRenderbuffer),
    attachShader: jest.fn(),
    bindBuffer: jest.fn(),
    bindFramebuffer: jest.fn(),
    bindRenderbuffer: jest.fn(),
    bindTexture: jest.fn(),
    bufferData: jest.fn(),
    clear: jest.fn(),
    clearColor: jest.fn(),
    compileShader: jest.fn(),
    deleteBuffer: jest.fn(),
    deleteFramebuffer: jest.fn(),
    deleteProgram: jest.fn(),
    deleteRenderbuffer: jest.fn(),
    deleteShader: jest.fn(),
    deleteTexture: jest.fn(),
    drawArrays: jest.fn(),
    drawElements: jest.fn(),
    enable: jest.fn(),
    enableVertexAttribArray: jest.fn(),
    getAttribLocation: jest.fn(() => 0),
    getProgramParameter: jest.fn(() => true),
    getShaderParameter: jest.fn(() => true),
    getUniformLocation: jest.fn(() => mockUniformLocation),
    linkProgram: jest.fn(),
    shaderSource: jest.fn(),
    uniform1f: jest.fn(),
    uniform1i: jest.fn(),
    uniform2f: jest.fn(),
    uniform3f: jest.fn(),
    uniform4f: jest.fn(),
    uniformMatrix4fv: jest.fn(),
    useProgram: jest.fn(),
    vertexAttribPointer: jest.fn(),
    viewport: jest.fn(),
    canvas: {
      width: 800,
      height: 600,
      getContext: jest.fn()
    },
    ARRAY_BUFFER: 34962,
    COLOR_BUFFER_BIT: 16384,
    COMPILE_STATUS: 35713,
    DEPTH_BUFFER_BIT: 256,
    DEPTH_TEST: 2929,
    ELEMENT_ARRAY_BUFFER: 34963,
    FLOAT: 5126,
    FRAGMENT_SHADER: 35632,
    FRAMEBUFFER: 36160,
    LINK_STATUS: 35714,
    RENDERBUFFER: 36161,
    STATIC_DRAW: 35044,
    TEXTURE_2D: 3553,
    TEXTURE0: 33984,
    TRIANGLES: 4,
    UNSIGNED_SHORT: 5123,
    VERTEX_SHADER: 35633,
  } as unknown as WebGLRenderingContext
}

/**
 * Creates a mock Canvas 2D context for testing Canvas patterns
 */
export function createMockCanvas2DContext(): CanvasRenderingContext2D {
  return {
    canvas: {
      width: 800,
      height: 600,
      getContext: jest.fn()
    },
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    strokeRect: jest.fn(),
    fillText: jest.fn(),
    strokeText: jest.fn(),
    beginPath: jest.fn(),
    closePath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    arc: jest.fn(),
    arcTo: jest.fn(),
    bezierCurveTo: jest.fn(),
    quadraticCurveTo: jest.fn(),
    rect: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    translate: jest.fn(),
    rotate: jest.fn(),
    scale: jest.fn(),
    transform: jest.fn(),
    setTransform: jest.fn(),
    createLinearGradient: jest.fn(() => ({
      addColorStop: jest.fn()
    })),
    createRadialGradient: jest.fn(() => ({
      addColorStop: jest.fn()
    })),
    createPattern: jest.fn(),
    drawImage: jest.fn(),
    getImageData: jest.fn(() => ({
      data: new Uint8ClampedArray(4),
      width: 1,
      height: 1
    })),
    putImageData: jest.fn(),
    createImageData: jest.fn(() => ({
      data: new Uint8ClampedArray(4),
      width: 1,
      height: 1
    })),
    measureText: jest.fn(() => ({ width: 100 })),
    fillStyle: '#000000',
    strokeStyle: '#000000',
    lineWidth: 1,
    lineCap: 'butt' as CanvasLineCap,
    lineJoin: 'miter' as CanvasLineJoin,
    font: '10px sans-serif',
    textAlign: 'start' as CanvasTextAlign,
    textBaseline: 'alphabetic' as CanvasTextBaseline,
    globalAlpha: 1,
    globalCompositeOperation: 'source-over' as GlobalCompositeOperation
  } as unknown as CanvasRenderingContext2D
}

/**
 * Mock requestAnimationFrame for testing animations
 */
export function mockRequestAnimationFrame() {
  let animationFrameId = 0
  const callbacks: Map<number, FrameRequestCallback> = new Map()
  
  const raf = jest.fn((callback: FrameRequestCallback) => {
    const id = ++animationFrameId
    callbacks.set(id, callback)
    return id
  })
  
  const caf = jest.fn((id: number) => {
    callbacks.delete(id)
  })
  
  const runFrame = (time: number = 0) => {
    const currentCallbacks = Array.from(callbacks.entries())
    callbacks.clear()
    currentCallbacks.forEach(([, callback]) => callback(time))
  }
  
  global.requestAnimationFrame = raf
  global.cancelAnimationFrame = caf
  
  return { raf, caf, runFrame }
}