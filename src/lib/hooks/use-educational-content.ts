import { useState, useEffect } from 'react'
import type { EducationalContent } from '@/components/ui/educational-overlay'
import { EducationalContentLoader } from '../educational-content-loader'

export interface UseEducationalContentResult {
  content: EducationalContent
  isLoading: boolean
  error: string | null
}

// AIDEV-NOTE: Hook for loading educational content with proper loading states
export function useEducationalContent(patternId: string): UseEducationalContentResult {
  const [content, setContent] = useState<EducationalContent>(
    () => EducationalContentLoader.getContentSync(patternId)
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadContent = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const loadedContent = await EducationalContentLoader.loadContent(patternId)
        
        if (mounted) {
          setContent(loadedContent)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load content')
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadContent()

    return () => {
      mounted = false
    }
  }, [patternId])

  return { content, isLoading, error }
}