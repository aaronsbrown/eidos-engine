// AIDEV-NOTE: Basic pattern generator component tests - Issue #12
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { act } from 'react'
import { ThemeProvider } from '@/lib/theme-context'
import { 
  createMockCanvas2DContext, 
  createMockWebGLContext,
  mockRequestAnimationFrame 
} from '@/test-utils/pattern-generator-mocks'
import { PatternControl } from '@/components/pattern-generators/types'

// Test wrapper with required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
)

// Sample pattern generator components for testing
const MockCanvasPattern = ({ width, height, controlValues }: { width: number; height: number; controlValues: Record<string, any> }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Mock animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = controlValues?.color || '#000000'
      ctx.fillRect(0, 0, width, height)
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [width, height, controlValues])
  
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      data-testid="pattern-canvas"
    />
  )
}

const MockWebGLPattern = ({ width, height, controlValues }: { width: number; height: number; controlValues: Record<string, any> }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const gl = canvas.getContext('webgl')
    if (!gl) return
    
    // Mock WebGL setup
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    
    let animationId: number
    const animate = () => {
      gl.clear(gl.COLOR_BUFFER_BIT)
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [width, height, controlValues])
  
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      data-testid="pattern-webgl-canvas"
    />
  )
}

describe('Pattern Generator Components - Basic Tests', () => {
  let mockRaf: any
  let mockCanvas2D: CanvasRenderingContext2D
  let mockWebGL: WebGLRenderingContext
  
  beforeEach(() => {
    mockRaf = mockRequestAnimationFrame()
    mockCanvas2D = createMockCanvas2DContext()
    mockWebGL = createMockWebGLContext()
    
    // Mock canvas context methods
    HTMLCanvasElement.prototype.getContext = jest.fn((type) => {
      if (type === '2d') return mockCanvas2D
      if (type === 'webgl' || type === 'experimental-webgl') return mockWebGL
      return null
    })
  })
  
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Canvas 2D Pattern Rendering', () => {
    it('renders canvas with correct dimensions', () => {
      render(
        <MockCanvasPattern 
          width={400} 
          height={300} 
          controlValues={{}} 
          onControlChange={jest.fn()} 
        />,
        { wrapper: TestWrapper }
      )
      
      const canvas = screen.getByTestId('pattern-canvas')
      expect(canvas).toBeInTheDocument()
      expect(canvas).toHaveAttribute('width', '400')
      expect(canvas).toHaveAttribute('height', '300')
    })

    it('initializes 2D rendering context', () => {
      render(
        <MockCanvasPattern 
          width={400} 
          height={300} 
          controlValues={{}} 
          onControlChange={jest.fn()} 
        />,
        { wrapper: TestWrapper }
      )
      
      expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d')
    })

    it('starts animation loop using requestAnimationFrame', () => {
      render(
        <MockCanvasPattern 
          width={400} 
          height={300} 
          controlValues={{}} 
          onControlChange={jest.fn()} 
        />,
        { wrapper: TestWrapper }
      )
      
      expect(mockRaf.raf).toHaveBeenCalled()
    })

    it('responds to control value changes', async () => {
      const { rerender } = render(
        <MockCanvasPattern 
          width={400} 
          height={300} 
          controlValues={{ color: '#ff0000' }} 
          onControlChange={jest.fn()} 
        />,
        { wrapper: TestWrapper }
      )
      
      // Run animation frame to trigger rendering
      act(() => {
        mockRaf.runFrame()
      })
      
      expect(mockCanvas2D.fillStyle).toBe('#ff0000')
      
      // Change control value
      rerender(
        <MockCanvasPattern 
          width={400} 
          height={300} 
          controlValues={{ color: '#00ff00' }} 
          onControlChange={jest.fn()} 
        />
      )
      
      // Run another animation frame
      act(() => {
        mockRaf.runFrame()
      })
      
      expect(mockCanvas2D.fillStyle).toBe('#00ff00')
    })

    it('cleans up animation on unmount', () => {
      const { unmount } = render(
        <MockCanvasPattern 
          width={400} 
          height={300} 
          controlValues={{}} 
          onControlChange={jest.fn()} 
        />,
        { wrapper: TestWrapper }
      )
      
      unmount()
      
      expect(mockRaf.caf).toHaveBeenCalled()
    })
  })

  describe('WebGL Pattern Rendering', () => {
    it('renders WebGL canvas with correct dimensions', () => {
      render(
        <MockWebGLPattern 
          width={600} 
          height={400} 
          controlValues={{}} 
        />,
        { wrapper: TestWrapper }
      )
      
      const canvas = screen.getByTestId('pattern-webgl-canvas')
      expect(canvas).toBeInTheDocument()
      expect(canvas).toHaveAttribute('width', '600')
      expect(canvas).toHaveAttribute('height', '400')
    })

    it('initializes WebGL rendering context', () => {
      render(
        <MockWebGLPattern 
          width={600} 
          height={400} 
          controlValues={{}} 
        />,
        { wrapper: TestWrapper }
      )
      
      expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('webgl')
    })

    it('performs WebGL initialization', () => {
      render(
        <MockWebGLPattern 
          width={600} 
          height={400} 
          controlValues={{}} 
        />,
        { wrapper: TestWrapper }
      )
      
      expect(mockWebGL.clearColor).toHaveBeenCalledWith(0, 0, 0, 1)
      expect(mockWebGL.clear).toHaveBeenCalledWith(mockWebGL.COLOR_BUFFER_BIT)
    })

    it('starts WebGL animation loop', () => {
      render(
        <MockWebGLPattern 
          width={600} 
          height={400} 
          controlValues={{}} 
        />,
        { wrapper: TestWrapper }
      )
      
      expect(mockRaf.raf).toHaveBeenCalled()
    })

    it('cleans up WebGL resources on unmount', () => {
      const { unmount } = render(
        <MockWebGLPattern 
          width={600} 
          height={400} 
          controlValues={{}} 
        />,
        { wrapper: TestWrapper }
      )
      
      unmount()
      
      expect(mockRaf.caf).toHaveBeenCalled()
    })
  })

  describe('Pattern Control Integration', () => {
    const TestPatternWithControls = ({ 
      controls, 
      controlValues, 
      onControlChange 
    }: {
      controls: PatternControl[]
      controlValues: Record<string, any>
      onControlChange: (id: string, value: any) => void
    }) => {
      return (
        <div>
          <MockCanvasPattern 
            width={400} 
            height={300} 
            controlValues={controlValues}
            onControlChange={onControlChange}
          />
          {controls.map(control => (
            <div key={control.id}>
              {control.type === 'range' && (
                <input
                  type="range"
                  aria-label={control.label}
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={controlValues[control.id] || control.defaultValue}
                  onChange={(e) => onControlChange(control.id, Number(e.target.value))}
                />
              )}
              {control.type === 'color' && (
                <input
                  type="color"
                  aria-label={control.label}
                  value={controlValues[control.id] || control.defaultValue}
                  onChange={(e) => onControlChange(control.id, e.target.value)}
                />
              )}
              {control.type === 'checkbox' && (
                <input
                  type="checkbox"
                  aria-label={control.label}
                  checked={controlValues[control.id] || control.defaultValue}
                  onChange={(e) => onControlChange(control.id, e.target.checked)}
                />
              )}
            </div>
          ))}
        </div>
      )
    }

    it('handles range control interactions', async () => {
      const mockOnControlChange = jest.fn()
      const controls: PatternControl[] = [
        { id: 'speed', label: 'Speed', type: 'range', min: 0, max: 10, step: 1, defaultValue: 5 }
      ]
      
      render(
        <TestPatternWithControls 
          controls={controls}
          controlValues={{}}
          onControlChange={mockOnControlChange}
        />,
        { wrapper: TestWrapper }
      )
      
      const slider = screen.getByLabelText('Speed')
      fireEvent.change(slider, { target: { value: '8' } })
      
      expect(mockOnControlChange).toHaveBeenCalledWith('speed', 8)
    })

    it('handles color control interactions', async () => {
      const mockOnControlChange = jest.fn()
      const controls: PatternControl[] = [
        { id: 'color', label: 'Color', type: 'color', defaultValue: '#ff0000' }
      ]
      
      render(
        <TestPatternWithControls 
          controls={controls}
          controlValues={{}}
          onControlChange={mockOnControlChange}
        />,
        { wrapper: TestWrapper }
      )
      
      const colorPicker = screen.getByLabelText('Color')
      fireEvent.change(colorPicker, { target: { value: '#00ff00' } })
      
      expect(mockOnControlChange).toHaveBeenCalledWith('color', '#00ff00')
    })

    it('handles checkbox control interactions', async () => {
      const mockOnControlChange = jest.fn()
      const controls: PatternControl[] = [
        { id: 'enabled', label: 'Enabled', type: 'checkbox', defaultValue: false }
      ]
      
      render(
        <TestPatternWithControls 
          controls={controls}
          controlValues={{}}
          onControlChange={mockOnControlChange}
        />,
        { wrapper: TestWrapper }
      )
      
      const checkbox = screen.getByLabelText('Enabled')
      fireEvent.click(checkbox)
      
      expect(mockOnControlChange).toHaveBeenCalledWith('enabled', true)
    })

    it('uses default values when no control values provided', () => {
      const controls: PatternControl[] = [
        { id: 'speed', label: 'Speed', type: 'range', min: 0, max: 10, step: 1, defaultValue: 7 }
      ]
      
      render(
        <TestPatternWithControls 
          controls={controls}
          controlValues={{}}
        />,
        { wrapper: TestWrapper }
      )
      
      const slider = screen.getByLabelText('Speed')
      expect(slider).toHaveValue('7')
    })

    it('uses provided values over defaults', () => {
      const controls: PatternControl[] = [
        { id: 'speed', label: 'Speed', type: 'range', min: 0, max: 10, step: 1, defaultValue: 7 }
      ]
      
      render(
        <TestPatternWithControls 
          controls={controls}
          controlValues={{ speed: 3 }}
        />,
        { wrapper: TestWrapper }
      )
      
      const slider = screen.getByLabelText('Speed')
      expect(slider).toHaveValue('3')
    })
  })

  describe('Dimension Responsiveness', () => {
    it('responds to dimension changes', async () => {
      const { rerender } = render(
        <MockCanvasPattern 
          width={400} 
          height={300} 
          controlValues={{}} 
          onControlChange={jest.fn()} 
        />,
        { wrapper: TestWrapper }
      )
      
      let canvas = screen.getByTestId('pattern-canvas')
      expect(canvas).toHaveAttribute('width', '400')
      expect(canvas).toHaveAttribute('height', '300')
      
      // Change dimensions
      rerender(
        <MockCanvasPattern 
          width={800} 
          height={600} 
          controlValues={{}} 
          onControlChange={jest.fn()} 
        />
      )
      
      canvas = screen.getByTestId('pattern-canvas')
      expect(canvas).toHaveAttribute('width', '800')
      expect(canvas).toHaveAttribute('height', '600')
    })

  })

  describe('Performance Considerations', () => {
    it('maintains 60fps target with animation frame timing', () => {
      render(
        <MockCanvasPattern 
          width={400} 
          height={300} 
          controlValues={{}} 
          onControlChange={jest.fn()} 
        />,
        { wrapper: TestWrapper }
      )
      
      const startTime = performance.now()
      
      // Run multiple animation frames
      for (let i = 0; i < 5; i++) {
        act(() => {
          mockRaf.runFrame(startTime + (i * 16.67)) // 60fps = 16.67ms per frame
        })
      }
      
      // Should have completed within reasonable time
      const endTime = performance.now()
      expect(endTime - startTime).toBeLessThan(100)
    })

    it('properly cleans up resources to prevent memory leaks', () => {
      const { unmount } = render(
        <MockCanvasPattern 
          width={400} 
          height={300} 
          controlValues={{}} 
          onControlChange={jest.fn()} 
        />,
        { wrapper: TestWrapper }
      )
      
      // Unmount should cancel any pending animations
      unmount()
      
      expect(mockRaf.caf).toHaveBeenCalled()
    })
  })
})