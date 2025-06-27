// AIDEV-NOTE: Tests for reusable ThreeJSCanvas wrapper component
// Focuses on configuration, props, and structure rather than Three.js internals

import React from 'react'
import { render } from '@testing-library/react'
import ThreeJSCanvas from './ThreeJSCanvas'

// Mock Three.js components since they require WebGL context
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children, ...props }: any) => (
    <div data-testid="three-canvas" {...props}>
      {children}
    </div>
  )
}))

jest.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />
}))

describe('ThreeJSCanvas Component', () => {
  describe('Basic Rendering', () => {
    test('renders without crashing', () => {
      render(
        <ThreeJSCanvas width={400} height={300}>
          <div>Test content</div>
        </ThreeJSCanvas>
      )
      
      const canvas = document.querySelector('[data-testid="three-canvas"]')
      expect(canvas).toBeInTheDocument()
    })

    test('creates container with correct dimensions', () => {
      render(
        <ThreeJSCanvas width={800} height={600}>
          <div>Test content</div>
        </ThreeJSCanvas>
      )
      
      const container = document.querySelector('div[style*="width: 800px"]')
      expect(container).toBeInTheDocument()
      expect(container).toHaveStyle('height: 600px')
    })

    test('applies custom className', () => {
      render(
        <ThreeJSCanvas width={400} height={300} className="custom-class">
          <div>Test content</div>
        </ThreeJSCanvas>
      )
      
      const container = document.querySelector('.custom-class')
      expect(container).toBeInTheDocument()
    })
  })

  describe('Camera Presets', () => {
    test('uses orbital preset by default', () => {
      render(
        <ThreeJSCanvas width={400} height={300}>
          <div>Test content</div>
        </ThreeJSCanvas>
      )
      
      // Should render OrbitControls (mocked)
      const controls = document.querySelector('[data-testid="orbit-controls"]')
      expect(controls).toBeInTheDocument()
    })

    test('accepts different camera presets', () => {
      render(
        <ThreeJSCanvas width={400} height={300} preset="close-up">
          <div>Test content</div>
        </ThreeJSCanvas>
      )
      
      // Should still render without errors
      const canvas = document.querySelector('[data-testid="three-canvas"]')
      expect(canvas).toBeInTheDocument()
    })

    test('allows custom camera overrides', () => {
      const customCamera = {
        position: [5, 5, 5] as [number, number, number],
        minDistance: 2,
        maxDistance: 20
      }

      render(
        <ThreeJSCanvas 
          width={400} 
          height={300} 
          customCamera={customCamera}
        >
          <div>Test content</div>
        </ThreeJSCanvas>
      )
      
      const canvas = document.querySelector('[data-testid="three-canvas"]')
      expect(canvas).toBeInTheDocument()
    })
  })

  describe('Instructions Overlay', () => {
    test('shows instructions by default', () => {
      const { container } = render(
        <ThreeJSCanvas width={400} height={300}>
          <div>Test content</div>
        </ThreeJSCanvas>
      )
      
      expect(container.textContent).toContain('Drag to orbit')
      expect(container.textContent).toContain('Scroll to zoom')
      expect(container.textContent).toContain('Right-drag to pan')
    })

    test('can hide instructions', () => {
      const { container } = render(
        <ThreeJSCanvas width={400} height={300} showInstructions={false}>
          <div>Test content</div>
        </ThreeJSCanvas>
      )
      
      expect(container.textContent).not.toContain('Drag to orbit')
    })
  })

  describe('Props Handling', () => {
    test('renders children content', () => {
      render(
        <ThreeJSCanvas width={400} height={300}>
          <div data-testid="child-content">Pattern content</div>
        </ThreeJSCanvas>
      )
      
      const childContent = document.querySelector('[data-testid="child-content"]')
      expect(childContent).toBeInTheDocument()
      expect(childContent).toHaveTextContent('Pattern content')
    })

    test('handles all camera preset options', () => {
      const presets = ['orbital', 'close-up', 'wide-view'] as const
      
      presets.forEach(preset => {
        const { unmount } = render(
          <ThreeJSCanvas width={400} height={300} preset={preset}>
            <div>Test</div>
          </ThreeJSCanvas>
        )
        
        // Should render without errors for each preset
        const canvas = document.querySelector('[data-testid="three-canvas"]')
        expect(canvas).toBeInTheDocument()
        
        unmount()
      })
    })

    test('accepts backgroundColor prop', () => {
      render(
        <ThreeJSCanvas 
          width={400} 
          height={300} 
          backgroundColor="#ff0000"
        >
          <div>Test content</div>
        </ThreeJSCanvas>
      )
      
      // Should render without errors (backgroundColor handled internally)
      const canvas = document.querySelector('[data-testid="three-canvas"]')
      expect(canvas).toBeInTheDocument()
    })
  })
})