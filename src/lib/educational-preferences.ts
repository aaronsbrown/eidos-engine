import React from 'react'
import type { EducationalLevel } from '@/components/ui/educational-overlay'

const PREFERENCE_KEY = 'educational-level-preference'

// AIDEV-NOTE: Educational level preference management with localStorage fallback
export class EducationalPreferences {
  static getPreferredLevel(): EducationalLevel {
    if (typeof window === 'undefined') return 'intuitive' // SSR fallback
    
    try {
      const saved = localStorage.getItem(PREFERENCE_KEY)
      if (saved && ['intuitive', 'conceptual', 'technical'].includes(saved)) {
        return saved as EducationalLevel
      }
    } catch (error) {
      console.warn('Failed to read educational preference:', error)
    }
    
    return 'intuitive' // Default level
  }

  static setPreferredLevel(level: EducationalLevel): void {
    if (typeof window === 'undefined') return // SSR guard
    
    try {
      localStorage.setItem(PREFERENCE_KEY, level)
    } catch (error) {
      console.warn('Failed to save educational preference:', error)
    }
  }

  static clearPreference(): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(PREFERENCE_KEY)
    } catch (error) {
      console.warn('Failed to clear educational preference:', error)
    }
  }
}

// Hook for React components
export function useEducationalLevel(): [EducationalLevel, (level: EducationalLevel) => void] {
  const [level, setLevel] = React.useState<EducationalLevel>(() => 
    EducationalPreferences.getPreferredLevel()
  )

  const updateLevel = (newLevel: EducationalLevel) => {
    setLevel(newLevel)
    EducationalPreferences.setPreferredLevel(newLevel)
  }

  return [level, updateLevel]
}