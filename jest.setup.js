// AIDEV-NOTE: Global Jest setup file for React Testing Library and DOM mocking
import '@testing-library/jest-dom'

// Add custom Jest matchers for numerical testing
expect.extend({
  toBeFinite(received) {
    const pass = Number.isFinite(received)
    if (pass) {
      return {
        message: () => `expected ${received} not to be finite`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected ${received} to be finite`,
        pass: false,
      }
    }
  },
})

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock matchMedia for theme detection
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock ResizeObserver for canvas-based tests
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(callback => setTimeout(callback, 16))
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id))

// Mock fetch for educational content loading tests
global.fetch = jest.fn()

// Mock HTMLCanvasElement and WebGL context for pattern generators
HTMLCanvasElement.prototype.getContext = jest.fn().mockImplementation((contextType) => {
  if (contextType === '2d') {
    return {
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      strokeRect: jest.fn(),
      fillText: jest.fn(),
      measureText: jest.fn(() => ({ width: 0 })),
      createLinearGradient: jest.fn(() => ({
        addColorStop: jest.fn(),
      })),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      fill: jest.fn(),
      arc: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
    }
  }
  if (contextType === 'webgl' || contextType === 'webgl2') {
    return {
      createShader: jest.fn(),
      shaderSource: jest.fn(),
      compileShader: jest.fn(),
      createProgram: jest.fn(),
      attachShader: jest.fn(),
      linkProgram: jest.fn(),
      useProgram: jest.fn(),
      getAttribLocation: jest.fn(),
      getUniformLocation: jest.fn(),
      enableVertexAttribArray: jest.fn(),
      vertexAttribPointer: jest.fn(),
      uniform1f: jest.fn(),
      uniform2f: jest.fn(),
      uniform3f: jest.fn(),
      uniform4f: jest.fn(),
      drawArrays: jest.fn(),
      viewport: jest.fn(),
    }
  }
  return null
})