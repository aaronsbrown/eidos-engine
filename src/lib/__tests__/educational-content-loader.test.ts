/**
 * @jest-environment jsdom
 */

import { EducationalContentLoader } from '../educational-content-loader'

// AIDEV-NOTE: Tests for educational content loading system - focuses on application logic per G-8
describe('EducationalContentLoader', () => {
  beforeEach(() => {
    // Clear cache before each test
    EducationalContentLoader.clearCache()
    
    // Mock fetch for test environment
    global.fetch = jest.fn()
    
    jest.clearAllMocks()
  })

  afterEach(() => {
    // Clean up fetch mock
    jest.restoreAllMocks()
  })

  describe('Content Loading', () => {
    it('loads educational content from file successfully', async () => {
      const mockContent = `# Test Pattern

## Layer 1: "What is this?" (Intuitive/Experiential)

This is test content for layer 1.

## Layer 2: "How does this work?" (Conceptual/Mechanical)

This is test content for layer 2.

## Layer 3: "Show me the code" (Technical/Formal)

This is test content for layer 3.`

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockContent)
      })

      const result = await EducationalContentLoader.loadContent('test-pattern')

      expect(global.fetch).toHaveBeenCalledWith('/educational-content/test-pattern.md')
      expect(result.title).toBe('Test Pattern')
      expect(result.layers.intuitive.title).toBe('What is this?')
      expect(result.layers.intuitive.content).toContain('This is test content for layer 1')
      expect(result.layers.conceptual.content).toContain('This is test content for layer 2')
      expect(result.layers.technical.content).toContain('This is test content for layer 3')
    })

    it('uses cache for subsequent requests', async () => {
      const mockContent = `# Cached Pattern

## Layer 1: "What is this?" (Intuitive/Experiential)

Cached content.

## Layer 2: "How does this work?" (Conceptual/Mechanical)

Cached content.

## Layer 3: "Show me the code" (Technical/Formal)

Cached content.`

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockContent)
      })

      // First call should fetch
      const result1 = await EducationalContentLoader.loadContent('cached-pattern')
      expect(global.fetch).toHaveBeenCalledTimes(1)

      // Second call should use cache
      const result2 = await EducationalContentLoader.loadContent('cached-pattern')
      expect(global.fetch).toHaveBeenCalledTimes(1) // Still only called once
      expect(result1).toEqual(result2)
    })

    it('returns fallback content when file not found', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      const result = await EducationalContentLoader.loadContent('missing-pattern')

      expect(result.title).toBe('Educational Content: missing-pattern')
      expect(result.layers.intuitive.content).toBe('Educational content is being loaded...')
      expect(result.layers.conceptual.content).toBe('Educational content is being loaded...')
      expect(result.layers.technical.content).toBe('Educational content is being loaded...')
    })

    it('returns fallback content when fetch throws error', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      const result = await EducationalContentLoader.loadContent('error-pattern')

      expect(result.title).toBe('Educational Content: error-pattern')
      expect(result.layers.intuitive.content).toBe('Educational content is being loaded...')
    })
  })

  describe('Synchronous Content Access', () => {
    it('returns cached content synchronously when available', async () => {
      const mockContent = `# Sync Pattern

## Layer 1: "What is this?" (Intuitive/Experiential)

Sync content.

## Layer 2: "How does this work?" (Conceptual/Mechanical)

Sync content.

## Layer 3: "Show me the code" (Technical/Formal)

Sync content.`

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockContent)
      })

      // Load content first
      await EducationalContentLoader.loadContent('sync-pattern')

      // Should now be available synchronously
      const result = EducationalContentLoader.getContentSync('sync-pattern')
      expect(result.title).toBe('Sync Pattern')
      expect(result.layers.intuitive.content).toContain('Sync content')
    })

    it('returns fallback content synchronously when not cached', () => {
      const result = EducationalContentLoader.getContentSync('uncached-pattern')

      expect(result.title).toBe('Educational Content: uncached-pattern')
      expect(result.layers.intuitive.content).toBe('Educational content is being loaded...')
    })
  })

  describe('Content Validation', () => {
    it('validates that all patterns have educational content', async () => {
      // Mock successful response for first pattern, failures for others
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true }) // First pattern succeeds
        .mockResolvedValueOnce({ ok: false }) // Second pattern fails
        .mockRejectedValueOnce(new Error('Network error')) // Third pattern errors

      const missingContent = await EducationalContentLoader.validateEducationalContent()

      // Should have at least some missing content (exact patterns depend on current generators)
      expect(missingContent.length).toBeGreaterThan(0)
      expect(Array.isArray(missingContent)).toBe(true)
    })

    it('checks if educational content exists for specific pattern', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true })

      const hasContent = await EducationalContentLoader.hasEducationalContent('test-pattern')
      expect(hasContent).toBe(true)
      expect(global.fetch).toHaveBeenCalledWith('/educational-content/test-pattern.md')
    })

    it('returns false when educational content does not exist', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false })

      const hasContent = await EducationalContentLoader.hasEducationalContent('missing-pattern')
      expect(hasContent).toBe(false)
    })

    it('returns false when fetch throws error', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      const hasContent = await EducationalContentLoader.hasEducationalContent('error-pattern')
      expect(hasContent).toBe(false)
    })
  })

  describe('Cache Management', () => {
    it('clears cache when requested', async () => {
      const mockContent = `# Test Pattern

## Layer 1: "What is this?" (Intuitive/Experiential)

Test content.

## Layer 2: "How does this work?" (Conceptual/Mechanical)

Test content.

## Layer 3: "Show me the code" (Technical/Formal)

Test content.`

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockContent)
      })

      // Load content to cache it
      await EducationalContentLoader.loadContent('cache-test')
      expect(global.fetch).toHaveBeenCalledTimes(1)

      // Clear cache
      EducationalContentLoader.clearCache()

      // Load again should fetch from server
      await EducationalContentLoader.loadContent('cache-test')
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('Convenience Functions', () => {
    it('exports convenience functions that work correctly', async () => {
      const mockContent = `# Convenience Test

## Layer 1: "What is this?" (Intuitive/Experiential)

Convenience content.

## Layer 2: "How does this work?" (Conceptual/Mechanical)

Convenience content.

## Layer 3: "Show me the code" (Technical/Formal)

Convenience content.`

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockContent)
      })

      // Test convenience imports
      const { loadEducationalContent, getEducationalContentSync, getAllPatternIds } = await import('../educational-content-loader')

      const result = await loadEducationalContent('convenience-test')
      expect(result.title).toBe('Convenience Test')

      const syncResult = getEducationalContentSync('convenience-test')
      expect(syncResult.title).toBe('Convenience Test')

      const allIds = getAllPatternIds()
      expect(Array.isArray(allIds)).toBe(true)
    })

    it('exports new convenience functions for metadata features', async () => {
      // Test new convenience imports
      const { 
        getRelatedEducationalContent, 
        getEducationalContentReferences, 
        getRelatedConcepts 
      } = await import('../educational-content-loader')

      expect(typeof getRelatedEducationalContent).toBe('function')
      expect(typeof getEducationalContentReferences).toBe('function')
      expect(typeof getRelatedConcepts).toBe('function')
    })
  })

  // AIDEV-NOTE: Tests for new educational content metadata functionality
  describe('Educational Content Metadata', () => {
    // Mock pattern generators with educational content metadata
    const mockPatternGenerators = [
      {
        id: 'pattern-with-metadata',
        name: 'Pattern With Metadata',
        schemaVersion: '1.0',
        semantics: {
          primaryAlgorithmFamily: 'NoiseFunction',
          keyMathematicalConcepts: ['Calculus'],
          visualCharacteristics: ['Organic'],
          dimensionality: '2D',
          interactionStyle: 'ParameterTuning',
          keywords: ['test'],
          educationalContent: {
            contentId: 'custom-content-id',
            relatedConcepts: ['concept1', 'concept2'],
            crossReferences: ['related-pattern-1', 'related-pattern-2']
          }
        },
        performance: {
          computationalComplexity: 'Medium',
          typicalFrameRateTarget: '60fps'
        }
      },
      {
        id: 'pattern-without-metadata',
        name: 'Pattern Without Metadata',
        component: {},
        technology: 'CANVAS_2D',
        category: 'Noise'
      },
      {
        id: 'related-pattern-1',
        name: 'Related Pattern 1',
        schemaVersion: '1.0',
        semantics: {
          primaryAlgorithmFamily: 'NoiseFunction',
          keyMathematicalConcepts: ['Calculus'],
          visualCharacteristics: ['Organic'],
          dimensionality: '2D',
          interactionStyle: 'ParameterTuning',
          keywords: ['test'],
          educationalContent: {
            contentId: 'related-content-1',
            crossReferences: ['pattern-with-metadata']
          }
        },
        performance: {
          computationalComplexity: 'Low',
          typicalFrameRateTarget: '60fps'
        }
      }
    ]

    beforeEach(() => {
      // Mock the pattern generators import
      jest.doMock('@/components/pattern-generators', () => ({
        patternGenerators: mockPatternGenerators
      }))
    })

    it('loads content using explicit contentId from metadata', async () => {
      const mockContent = `# Custom Content

## Layer 1: "What is this?" (Intuitive/Experiential)

Custom content.

## Layer 2: "How does this work?" (Conceptual/Mechanical)

Custom content.

## Layer 3: "Show me the code" (Technical/Formal)

Custom content.`

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockContent)
      })

      // Re-import to get the mocked pattern generators
      jest.resetModules()
      const { EducationalContentLoader } = await import('../educational-content-loader')

      const result = await EducationalContentLoader.loadContent('pattern-with-metadata')

      // Should fetch using the custom contentId, not the pattern ID
      expect(global.fetch).toHaveBeenCalledWith('/educational-content/custom-content-id.md')
      expect(result.title).toBe('Custom Content')
    })

    it('falls back to pattern ID when no explicit contentId is provided', async () => {
      const mockContent = `# Fallback Content

## Layer 1: "What is this?" (Intuitive/Experiential)

Fallback content.

## Layer 2: "How does this work?" (Conceptual/Mechanical)

Fallback content.

## Layer 3: "Show me the code" (Technical/Formal)

Fallback content.`

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockContent)
      })

      // Re-import to get the mocked pattern generators
      jest.resetModules()
      const { EducationalContentLoader } = await import('../educational-content-loader')

      const result = await EducationalContentLoader.loadContent('pattern-without-metadata')

      // Should fetch using the pattern ID as fallback
      expect(global.fetch).toHaveBeenCalledWith('/educational-content/pattern-without-metadata.md')
      expect(result.title).toBe('Fallback Content')
    })

    it('gets related educational content from cross-references', async () => {
      // Re-import to get the mocked pattern generators
      jest.resetModules()
      const { EducationalContentLoader } = await import('../educational-content-loader')

      const relatedContent = EducationalContentLoader.getRelatedEducationalContent('pattern-with-metadata')
      expect(relatedContent).toEqual(['related-pattern-1', 'related-pattern-2'])
    })

    it('gets empty array for patterns without cross-references', async () => {
      // Re-import to get the mocked pattern generators
      jest.resetModules()
      const { EducationalContentLoader } = await import('../educational-content-loader')

      const relatedContent = EducationalContentLoader.getRelatedEducationalContent('pattern-without-metadata')
      expect(relatedContent).toEqual([])
    })

    it('finds patterns that reference a given pattern', async () => {
      // Re-import to get the mocked pattern generators
      jest.resetModules()
      const { EducationalContentLoader } = await import('../educational-content-loader')

      const references = EducationalContentLoader.getEducationalContentReferences('pattern-with-metadata')
      expect(references).toEqual(['related-pattern-1'])
    })

    it('gets related concepts from metadata', async () => {
      // Re-import to get the mocked pattern generators
      jest.resetModules()
      const { EducationalContentLoader } = await import('../educational-content-loader')

      const concepts = EducationalContentLoader.getRelatedConcepts('pattern-with-metadata')
      expect(concepts).toEqual(['concept1', 'concept2'])
    })

    it('uses explicit contentId in hasEducationalContent check', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true })

      // Re-import to get the mocked pattern generators
      jest.resetModules()
      const { EducationalContentLoader } = await import('../educational-content-loader')

      const hasContent = await EducationalContentLoader.hasEducationalContent('pattern-with-metadata')
      
      // Should check the custom contentId, not the pattern ID
      expect(global.fetch).toHaveBeenCalledWith('/educational-content/custom-content-id.md')
      expect(hasContent).toBe(true)
    })
  })
})