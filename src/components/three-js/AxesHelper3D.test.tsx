// AIDEV-NOTE: Tests for AxesHelper3D component
// Tests structure and props handling for 3D coordinate reference

import React from 'react'
import { render } from '@testing-library/react'
import AxesHelper3D from './AxesHelper3D'

// Mock Three.js components since they require WebGL context
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <div data-testid="three-canvas" {...props}>
      {children}
    </div>
  )
}))

jest.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  Text: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <div data-testid="three-text" {...props}>
      {children}
    </div>
  )
}))

// Mock ThreeJSCanvas
jest.mock('./ThreeJSCanvas', () => {
  return function MockThreeJSCanvas({ children }: { children: React.ReactNode }) {
    return (
      <div data-testid="mock-threejs-canvas">
        {children}
      </div>
    )
  }
})

describe('AxesHelper3D Component', () => {
  describe('Basic Rendering', () => {
    test('renders without crashing', () => {
      expect(() => {
        render(<AxesHelper3D />)
      }).not.toThrow()
    })

    test('creates axes group element', () => {
      render(<AxesHelper3D />)
      
      // Should render group container
      const axesGroup = document.querySelector('[name="axes-helper"]')
      expect(axesGroup).toBeInTheDocument()
    })

    test('renders with custom size', () => {
      expect(() => {
        render(<AxesHelper3D size={5} />)
      }).not.toThrow()
    })

    test('renders with custom colors', () => {
      expect(() => {
        render(
          <AxesHelper3D 
            xColor="#ff0000"
            yColor="#00ff00"
            zColor="#0000ff"
          />
        )
      }).not.toThrow()
    })
  })

  describe('Props Handling', () => {
    test('accepts all optional props', () => {
      const props = {
        size: 3,
        showLabels: false,
        lineWidth: 4,
        opacity: 0.8,
        xColor: "#red",
        yColor: "#green",
        zColor: "#blue"
      }

      expect(() => {
        render(<AxesHelper3D {...props} />)
      }).not.toThrow()
    })

    test('uses default values when no props provided', () => {
      expect(() => {
        render(<AxesHelper3D />)
      }).not.toThrow()
    })

    test('handles edge case opacity values', () => {
      expect(() => {
        render(<AxesHelper3D opacity={0} />)
      }).not.toThrow()
      
      expect(() => {
        render(<AxesHelper3D opacity={1} />)
      }).not.toThrow()
    })

    test('handles very small and large sizes', () => {
      expect(() => {
        render(<AxesHelper3D size={0.1} />)
      }).not.toThrow()
      
      expect(() => {
        render(<AxesHelper3D size={100} />)
      }).not.toThrow()
    })
  })

  describe('Component Structure', () => {
    test('contains expected elements', () => {
      render(<AxesHelper3D />)
      
      // Should have the main group
      const group = document.querySelector('[name="axes-helper"]')
      expect(group).toBeInTheDocument()
      
      // Should have mesh elements (axis markers and origin)
      const meshes = document.querySelectorAll('mesh')
      expect(meshes.length).toBeGreaterThan(0)
    })

    test('renders axis labels when enabled', () => {
      render(<AxesHelper3D showLabels={true} />)
      
      // Should have text labels for axes
      const textLabels = document.querySelectorAll('[data-testid="three-text"]')
      expect(textLabels.length).toBe(3) // X, Y, Z labels
    })

    test('hides axis labels when disabled', () => {
      render(<AxesHelper3D showLabels={false} />)
      
      // Should not have text labels when disabled
      const textLabels = document.querySelectorAll('[data-testid="three-text"]')
      expect(textLabels.length).toBe(0)
    })
  })
})