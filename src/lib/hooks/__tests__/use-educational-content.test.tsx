/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react'
import { useEducationalContent } from '../use-educational-content'
import { EducationalContentLoader } from '../../educational-content-loader'

// AIDEV-NOTE: Tests for educational content hook - ensures proper loading states and error handling
describe('useEducationalContent Hook', () => {
  beforeEach(() => {
    // Clear cache before each test
    EducationalContentLoader.clearCache()
    
    // Mock fetch for test environment
    global.fetch = jest.fn()
    
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('loads content successfully and manages loading states', async () => {
    const mockContent = `# Hook Test Pattern

## Layer 1: "What is this?" (Intuitive/Experiential)

Hook test content layer 1.

## Layer 2: "How does this work?" (Conceptual/Mechanical)

Hook test content layer 2.

## Layer 3: "Show me the code" (Technical/Formal)

Hook test content layer 3.`

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockContent)
    })

    const { result } = renderHook(() => useEducationalContent('hook-test'))

    // Initially should show loading state with sync content
    expect(result.current.isLoading).toBe(true)
    expect(result.current.error).toBe(null)
    expect(result.current.content.title).toBe('Educational Content: hook-test')

    // Wait for content to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.content.title).toBe('Hook Test Pattern')
    expect(result.current.content.layers.intuitive.content).toContain('Hook test content layer 1')
    expect(result.current.error).toBe(null)
  })

  it('handles loading errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useEducationalContent('error-pattern'))

    // Wait for loading to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // EducationalContentLoader catches errors and returns fallback content
    expect(result.current.error).toBe(null)
    expect(result.current.content.title).toBe('Educational Content: error-pattern')
    expect(result.current.content.layers.intuitive.content).toBe('Educational content is being loaded...')
  })

  it('handles fetch failures gracefully', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 404 })

    const { result } = renderHook(() => useEducationalContent('missing-pattern'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Should return fallback content without error
    expect(result.current.error).toBe(null)
    expect(result.current.content.title).toBe('Educational Content: missing-pattern')
  })

  it('reloads content when pattern ID changes', async () => {
    const mockContent1 = `# Pattern 1

## Layer 1: "What is this?" (Intuitive/Experiential)

Pattern 1 content.

## Layer 2: "How does this work?" (Conceptual/Mechanical)

Pattern 1 content.

## Layer 3: "Show me the code" (Technical/Formal)

Pattern 1 content.`

    const mockContent2 = `# Pattern 2

## Layer 1: "What is this?" (Intuitive/Experiential)

Pattern 2 content.

## Layer 2: "How does this work?" (Conceptual/Mechanical)

Pattern 2 content.

## Layer 3: "Show me the code" (Technical/Formal)

Pattern 2 content.`

    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockContent1)
      })
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockContent2)
      })

    const { result, rerender } = renderHook(
      ({ patternId }) => useEducationalContent(patternId),
      { initialProps: { patternId: 'pattern-1' } }
    )

    // Wait for first pattern to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.content.title).toBe('Pattern 1')

    // Change pattern ID
    rerender({ patternId: 'pattern-2' })

    // Should start loading again
    expect(result.current.isLoading).toBe(true)

    // Wait for second pattern to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.content.title).toBe('Pattern 2')
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })

  it('handles component unmounting during load', async () => {
    const mockContent = `# Unmount Test

## Layer 1: "What is this?" (Intuitive/Experiential)

Test content.

## Layer 2: "How does this work?" (Conceptual/Mechanical)

Test content.

## Layer 3: "Show me the code" (Technical/Formal)

Test content.`

    // Create a promise that we can control
    let resolvePromise: (value: unknown) => void
    const controlledPromise = new Promise((resolve) => {
      resolvePromise = resolve
    })

    ;(global.fetch as jest.Mock).mockReturnValueOnce(controlledPromise)

    const { result, unmount } = renderHook(() => useEducationalContent('unmount-test'))

    expect(result.current.isLoading).toBe(true)

    // Unmount component before promise resolves
    unmount()

    // Now resolve the promise
    resolvePromise({
      ok: true,
      text: () => Promise.resolve(mockContent)
    })

    // Wait a bit to ensure no state updates occur after unmount
    await new Promise(resolve => setTimeout(resolve, 50))

    // The hook should have been cleaned up without errors
    // If there were errors, they would be thrown by React
  })

  it('uses cached content when available', async () => {
    const mockContent = `# Cached Test

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

    // First hook instance
    const { result: result1 } = renderHook(() => useEducationalContent('cached-pattern'))

    await waitFor(() => {
      expect(result1.current.isLoading).toBe(false)
    })

    expect(result1.current.content.title).toBe('Cached Test')
    expect(global.fetch).toHaveBeenCalledTimes(1)

    // Second hook instance for same pattern
    const { result: result2 } = renderHook(() => useEducationalContent('cached-pattern'))

    await waitFor(() => {
      expect(result2.current.isLoading).toBe(false)
    })

    expect(result2.current.content.title).toBe('Cached Test')
    // Should still only have called fetch once due to caching
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('loads different content when pattern changes', async () => {
    const mockContent = `# Success Pattern

## Layer 1: "What is this?" (Intuitive/Experiential)

Success content.

## Layer 2: "How does this work?" (Conceptual/Mechanical)

Success content.

## Layer 3: "Show me the code" (Technical/Formal)

Success content.`

    ;(global.fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('Initial error'))
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockContent)
      })

    const { result, rerender } = renderHook(
      ({ patternId }) => useEducationalContent(patternId),
      { initialProps: { patternId: 'error-pattern' } }
    )

    // Wait for first pattern (error/fallback)
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.content.title).toBe('Educational Content: error-pattern')

    // Change to successful pattern
    rerender({ patternId: 'success-pattern' })

    // Wait for success
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBe(null)
    expect(result.current.content.title).toBe('Success Pattern')
  })
})