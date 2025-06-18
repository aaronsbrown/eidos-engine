// AIDEV-NOTE: SimplexNoise tests - basic instantiation and noise3D output validation within expected range
import { SimplexNoise } from './simplex-noise'

describe('SimplexNoise', () => {
  let noise: SimplexNoise

  beforeEach(() => {
    noise = new SimplexNoise()
  })

  describe('Instantiation', () => {
    it('creates instance without errors', () => {
      expect(() => new SimplexNoise()).not.toThrow()
      expect(noise).toBeInstanceOf(SimplexNoise)
    })

    it('has noise3D method available', () => {
      expect(typeof noise.noise3D).toBe('function')
    })
  })

  describe('noise3D method', () => {
    it('returns a number', () => {
      const result = noise.noise3D(0, 0, 0)
      expect(typeof result).toBe('number')
    })

    it('returns values within expected range [-1, 1]', () => {
      // Test multiple sample points to ensure range consistency
      const testPoints = [
        [0, 0, 0],
        [1, 1, 1],
        [-1, -1, -1],
        [0.5, 0.5, 0.5],
        [10, 20, 30],
        [-5, -10, -15],
        [0.1, 0.2, 0.3],
        [100, 200, 300]
      ]

      testPoints.forEach(([x, y, z]) => {
        const result = noise.noise3D(x, y, z)
        expect(result).toBeGreaterThanOrEqual(-1)
        expect(result).toBeLessThanOrEqual(1)
      })
    })

    it('returns consistent values for same input coordinates', () => {
      const x = 5.5
      const y = 10.2
      const z = -3.7

      const result1 = noise.noise3D(x, y, z)
      const result2 = noise.noise3D(x, y, z)
      const result3 = noise.noise3D(x, y, z)

      expect(result1).toBe(result2)
      expect(result2).toBe(result3)
    })

    it('returns different values for different input coordinates', () => {
      const result1 = noise.noise3D(0, 0, 0)
      const result2 = noise.noise3D(1, 0, 0)
      const result3 = noise.noise3D(0, 1, 0)
      const result4 = noise.noise3D(0, 0, 1)

      // Test with different step sizes if some coordinates return the same value
      const results = [result1, result2, result3, result4]
      const uniqueResults = [...new Set(results)]
      
      // Should have at least 2 different values out of 4 samples
      expect(uniqueResults.length).toBeGreaterThan(1)
    })

    it('handles zero coordinates', () => {
      expect(() => noise.noise3D(0, 0, 0)).not.toThrow()
      const result = noise.noise3D(0, 0, 0)
      expect(typeof result).toBe('number')
      expect(result).toBeGreaterThanOrEqual(-1)
      expect(result).toBeLessThanOrEqual(1)
    })

    it('handles negative coordinates', () => {
      expect(() => noise.noise3D(-5, -10, -15)).not.toThrow()
      const result = noise.noise3D(-5, -10, -15)
      expect(typeof result).toBe('number')
      expect(result).toBeGreaterThanOrEqual(-1)
      expect(result).toBeLessThanOrEqual(1)
    })

    it('handles large positive coordinates', () => {
      expect(() => noise.noise3D(1000, 2000, 3000)).not.toThrow()
      const result = noise.noise3D(1000, 2000, 3000)
      expect(typeof result).toBe('number')
      expect(result).toBeGreaterThanOrEqual(-1)
      expect(result).toBeLessThanOrEqual(1)
    })

    it('handles fractional coordinates', () => {
      expect(() => noise.noise3D(0.123, 0.456, 0.789)).not.toThrow()
      const result = noise.noise3D(0.123, 0.456, 0.789)
      expect(typeof result).toBe('number')
      expect(result).toBeGreaterThanOrEqual(-1)
      expect(result).toBeLessThanOrEqual(1)
    })

    it('shows smooth transitions between nearby points', () => {
      // Test that nearby points have similar but not identical values
      const baseX = 5
      const baseY = 5
      const baseZ = 5
      const step = 0.1

      const baseValue = noise.noise3D(baseX, baseY, baseZ)
      const nearbyValue = noise.noise3D(baseX + step, baseY, baseZ)
      
      // Values should be different but not wildly different (smooth function)
      expect(baseValue).not.toBe(nearbyValue)
      const difference = Math.abs(baseValue - nearbyValue)
      expect(difference).toBeLessThan(0.5) // Reasonable smoothness expectation
    })
  })

  describe('Multiple instances', () => {
    it('different instances produce same results for same inputs', () => {
      const noise1 = new SimplexNoise()
      const noise2 = new SimplexNoise()
      
      const x = 7.3
      const y = -2.1
      const z = 4.7
      
      const result1 = noise1.noise3D(x, y, z)
      const result2 = noise2.noise3D(x, y, z)
      
      expect(result1).toBe(result2)
    })
  })

  describe('Statistical properties', () => {
    it('generates values that span significant portion of [-1, 1] range', () => {
      const values: number[] = []
      
      // Sample many points
      for (let i = 0; i < 100; i++) {
        values.push(noise.noise3D(i * 0.1, i * 0.1, i * 0.1))
      }
      
      const min = Math.min(...values)
      const max = Math.max(...values)
      
      // Should use a reasonable portion of the available range
      expect(max - min).toBeGreaterThan(0.5)
      expect(min).toBeGreaterThanOrEqual(-1)
      expect(max).toBeLessThanOrEqual(1)
    })
  })
})