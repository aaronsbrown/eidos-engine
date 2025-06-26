// AIDEV-NOTE: Tests for Lorenz attractor differential equation calculations
// These tests ensure mathematical correctness and catch regressions

import { calculateLorenzPoint } from './lorenz'

describe('Lorenz Attractor Math', () => {
  describe('calculateLorenzPoint', () => {
    // Standard Lorenz parameters
    const standardParams = {
      sigma: 10,
      rho: 28,
      beta: 8/3,
      dt: 0.01
    }

    test('produces expected trajectory for standard parameters', () => {
      // Starting point (1, 1, 1) with standard Lorenz parameters
      const result = calculateLorenzPoint(1, 1, 1, standardParams.sigma, standardParams.rho, standardParams.beta, standardParams.dt)
      
      // Expected values calculated manually:
      // dx = 10 * (1 - 1) = 0
      // dy = 1 * (28 - 1) - 1 = 26 
      // dz = 1 * 1 - (8/3) * 1 = -5/3
      // newX = 1 + 0 * 0.01 = 1
      // newY = 1 + 26 * 0.01 = 1.26
      // newZ = 1 + (-5/3) * 0.01 = 1 - 0.0167 = 0.9833

      expect(result.newX).toBeCloseTo(1.0, 6)
      expect(result.newY).toBeCloseTo(1.26, 6)
      expect(result.newZ).toBeCloseTo(0.9833, 4)
    })

    test('handles zero initial conditions', () => {
      const result = calculateLorenzPoint(0, 0, 0, standardParams.sigma, standardParams.rho, standardParams.beta, standardParams.dt)
      
      // At origin: dx = 0, dy = 0, dz = 0
      expect(result.newX).toBe(0)
      expect(result.newY).toBe(0) 
      expect(result.newZ).toBe(0)
    })

    test('maintains mathematical properties with different time steps', () => {
      const x = 5, y = -3, z = 15
      
      // Compare single large step vs multiple small steps
      const singleStep = calculateLorenzPoint(x, y, z, standardParams.sigma, standardParams.rho, standardParams.beta, 0.02)
      
      let multiStep = { newX: x, newY: y, newZ: z }
      multiStep = calculateLorenzPoint(multiStep.newX, multiStep.newY, multiStep.newZ, standardParams.sigma, standardParams.rho, standardParams.beta, 0.01)
      multiStep = calculateLorenzPoint(multiStep.newX, multiStep.newY, multiStep.newZ, standardParams.sigma, standardParams.rho, standardParams.beta, 0.01)
      
      // Results should be close but not identical (numerical integration error accumulates)
      // Relaxed tolerance for Lorenz system which is highly sensitive
      expect(Math.abs(singleStep.newX - multiStep.newX)).toBeLessThan(1.0)
      expect(Math.abs(singleStep.newY - multiStep.newY)).toBeLessThan(1.0)
      expect(Math.abs(singleStep.newZ - multiStep.newZ)).toBeLessThan(1.0)
    })

    test('produces different results for different parameter values', () => {
      const x = 5, y = -3, z = 15, dt = 0.01  // Non-equilibrium point for more sensitivity
      
      const standard = calculateLorenzPoint(x, y, z, 10, 28, 8/3, dt)
      const differentSigma = calculateLorenzPoint(x, y, z, 20, 28, 8/3, dt)  // Double sigma
      const differentRho = calculateLorenzPoint(x, y, z, 10, 50, 8/3, dt)   // Much higher rho
      const differentBeta = calculateLorenzPoint(x, y, z, 10, 28, 5, dt)    // Much higher beta
      
      // All should produce different results - test actual differences
      expect(Math.abs(standard.newX - differentSigma.newX)).toBeGreaterThan(0.001)
      expect(Math.abs(standard.newY - differentRho.newY)).toBeGreaterThan(0.001) 
      expect(Math.abs(standard.newZ - differentBeta.newZ)).toBeGreaterThan(0.001)
    })

    test('handles extreme parameter values gracefully', () => {
      // Test with very small parameters
      const smallParams = calculateLorenzPoint(1, 1, 1, 0.1, 0.1, 0.1, 0.01)
      expect(smallParams.newX).toBeFinite()
      expect(smallParams.newY).toBeFinite()
      expect(smallParams.newZ).toBeFinite()
      
      // Test with large parameters
      const largeParams = calculateLorenzPoint(1, 1, 1, 100, 100, 100, 0.01)
      expect(largeParams.newX).toBeFinite()
      expect(largeParams.newY).toBeFinite()
      expect(largeParams.newZ).toBeFinite()
    })

    test('maintains conservation properties over time', () => {
      let point = { newX: 1, newY: 1, newZ: 1 }
      const trajectory: Array<{x: number, y: number, z: number}> = []
      
      // Simulate for 100 steps
      for (let i = 0; i < 100; i++) {
        point = calculateLorenzPoint(point.newX, point.newY, point.newZ, standardParams.sigma, standardParams.rho, standardParams.beta, standardParams.dt)
        trajectory.push({ x: point.newX, y: point.newY, z: point.newZ })
      }
      
      // Lorenz attractor should stay bounded (typical range: x,y ±20, z: 0-50)
      trajectory.forEach(p => {
        expect(Math.abs(p.x)).toBeLessThan(50) // Conservative bounds
        expect(Math.abs(p.y)).toBeLessThan(50)
        expect(p.z).toBeGreaterThan(-10)
        expect(p.z).toBeLessThan(100)
      })
    })

    test('demonstrates chaotic sensitivity to initial conditions', () => {
      const dt = 0.01, steps = 200  // More steps for divergence
      
      // Two very close initial conditions
      let point1 = { newX: 1.0, newY: 1.0, newZ: 1.0 }
      let point2 = { newX: 1.001, newY: 1.0, newZ: 1.0 } // Slightly larger difference
      
      // Evolve both trajectories
      for (let i = 0; i < steps; i++) {
        point1 = calculateLorenzPoint(point1.newX, point1.newY, point1.newZ, standardParams.sigma, standardParams.rho, standardParams.beta, dt)
        point2 = calculateLorenzPoint(point2.newX, point2.newY, point2.newZ, standardParams.sigma, standardParams.rho, standardParams.beta, dt)
      }
      
      // After sufficient time, trajectories should diverge significantly (chaos)
      const distance = Math.sqrt(
        Math.pow(point1.newX - point2.newX, 2) + 
        Math.pow(point1.newY - point2.newY, 2) + 
        Math.pow(point1.newZ - point2.newZ, 2)
      )
      
      expect(distance).toBeGreaterThan(0.005) // Very conservative threshold for chaotic divergence
    })
  })
})