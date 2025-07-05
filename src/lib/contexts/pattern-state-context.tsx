// AIDEV-NOTE: Shared pattern state context for mobile/desktop layout synchronization (Issue #80)
// AIDEV-NOTE: Provides persistent state across viewport changes with localStorage backup and platform-aware defaults
"use client"

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react'
import { patternGenerators } from '@/components/pattern-generators'
import { getPlatformDefaultValue } from '@/lib/semantic-utils'

// AIDEV-NOTE: Shared state interface matching existing mobile/desktop patterns
export interface PatternStateContextType {
  selectedPatternId: string
  controlValues: Record<string, Record<string, number | string | boolean>>
  isInitialized: boolean
  // Actions
  setSelectedPatternId: (id: string) => void
  setControlValues: (values: Record<string, Record<string, number | string | boolean>>) => void
  updateControlValue: (patternId: string, controlId: string, value: number | string | boolean) => void
  initializePattern: (patternId: string, platform: 'mobile' | 'desktop') => void
  resetToDefaults: (patternId: string, platform: 'mobile' | 'desktop') => void
}

// AIDEV-NOTE: State shape for reducer pattern
interface PatternState {
  selectedPatternId: string
  controlValues: Record<string, Record<string, number | string | boolean>>
  isInitialized: boolean
}

// AIDEV-NOTE: Reducer actions for type-safe state updates
type PatternStateAction = 
  | { type: 'SET_SELECTED_PATTERN'; payload: string }
  | { type: 'SET_CONTROL_VALUES'; payload: Record<string, Record<string, number | string | boolean>> }
  | { type: 'UPDATE_CONTROL_VALUE'; payload: { patternId: string; controlId: string; value: number | string | boolean } }
  | { type: 'INITIALIZE_PATTERN'; payload: { patternId: string; platform: 'mobile' | 'desktop' } }
  | { type: 'RESET_TO_DEFAULTS'; payload: { patternId: string; platform: 'mobile' | 'desktop' } }
  | { type: 'SET_INITIALIZED'; payload: boolean }

// AIDEV-NOTE: localStorage keys for persistence
const STORAGE_KEYS = {
  SELECTED_PATTERN: 'pattern-state-selected-pattern',
  CONTROL_VALUES: 'pattern-state-control-values',
  IS_INITIALIZED: 'pattern-state-initialized'
} as const

// AIDEV-NOTE: Safe localStorage operations with SSR compatibility
const storage = {
  get: function<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },
  set: (key: string, value: unknown): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore storage errors
    }
  }
}

// AIDEV-NOTE: Initialize control values with platform-aware defaults
const initializeControlValues = (patternId: string, platform: 'mobile' | 'desktop'): Record<string, number | string | boolean> => {
  const pattern = patternGenerators.find(p => p.id === patternId)
  if (!pattern?.controls) return {}

  const defaults: Record<string, number | string | boolean> = {}
  pattern.controls.forEach(control => {
    // Use platform-aware defaults from semantic metadata
    defaults[control.id] = getPlatformDefaultValue(control, platform)
  })
  return defaults
}

// AIDEV-NOTE: Reducer for predictable state updates
const patternStateReducer = (state: PatternState, action: PatternStateAction): PatternState => {
  switch (action.type) {
    case 'SET_SELECTED_PATTERN':
      const newState = { ...state, selectedPatternId: action.payload }
      storage.set(STORAGE_KEYS.SELECTED_PATTERN, action.payload)
      return newState

    case 'SET_CONTROL_VALUES':
      const updatedState = { ...state, controlValues: action.payload }
      storage.set(STORAGE_KEYS.CONTROL_VALUES, action.payload)
      return updatedState

    case 'UPDATE_CONTROL_VALUE':
      const { patternId, controlId, value } = action.payload
      const newControlValues = {
        ...state.controlValues,
        [patternId]: {
          ...state.controlValues[patternId],
          [controlId]: value
        }
      }
      storage.set(STORAGE_KEYS.CONTROL_VALUES, newControlValues)
      return { ...state, controlValues: newControlValues }

    case 'INITIALIZE_PATTERN':
      const { patternId: initPatternId, platform } = action.payload
      if (state.controlValues[initPatternId]) {
        return state // Already initialized
      }
      const initialControlValues = initializeControlValues(initPatternId, platform)
      const newValues = {
        ...state.controlValues,
        [initPatternId]: initialControlValues
      }
      storage.set(STORAGE_KEYS.CONTROL_VALUES, newValues)
      return { ...state, controlValues: newValues }

    case 'RESET_TO_DEFAULTS':
      const { patternId: resetPatternId, platform: resetPlatform } = action.payload
      const defaultValues = initializeControlValues(resetPatternId, resetPlatform)
      const resetValues = {
        ...state.controlValues,
        [resetPatternId]: defaultValues
      }
      storage.set(STORAGE_KEYS.CONTROL_VALUES, resetValues)
      return { ...state, controlValues: resetValues }

    case 'SET_INITIALIZED':
      const initializedState = { ...state, isInitialized: action.payload }
      storage.set(STORAGE_KEYS.IS_INITIALIZED, action.payload)
      return initializedState

    default:
      return state
  }
}

// AIDEV-NOTE: Context creation with error handling
const PatternStateContext = createContext<PatternStateContextType | null>(null)

// AIDEV-NOTE: Initial state from localStorage or defaults
const getInitialState = (): PatternState => {
  const defaultPatternId = patternGenerators[0]?.id || ''
  
  return {
    selectedPatternId: storage.get(STORAGE_KEYS.SELECTED_PATTERN, defaultPatternId),
    controlValues: storage.get(STORAGE_KEYS.CONTROL_VALUES, {}),
    isInitialized: storage.get(STORAGE_KEYS.IS_INITIALIZED, false)
  }
}

// AIDEV-NOTE: Provider component with localStorage persistence
export function PatternStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(patternStateReducer, getInitialState())

  // AIDEV-NOTE: Initialize patterns with platform-aware defaults on first load
  useEffect(() => {
    if (!state.isInitialized && typeof window !== 'undefined') {
      // Simple platform detection based on window width
      const platform = window.innerWidth <= 1023 ? 'mobile' : 'desktop'
      
      // Initialize the currently selected pattern if needed
      if (state.selectedPatternId && !state.controlValues[state.selectedPatternId]) {
        dispatch({ type: 'INITIALIZE_PATTERN', payload: { patternId: state.selectedPatternId, platform } })
      }
      
      dispatch({ type: 'SET_INITIALIZED', payload: true })
    }
  }, [state.isInitialized, state.selectedPatternId, state.controlValues])

  // AIDEV-NOTE: Actions for context consumers
  const setSelectedPatternId = useCallback((id: string) => {
    dispatch({ type: 'SET_SELECTED_PATTERN', payload: id })
    
    // Initialize the pattern if it doesn't have control values yet
    if (typeof window !== 'undefined' && !state.controlValues[id]) {
      const platform = window.innerWidth <= 1023 ? 'mobile' : 'desktop'
      dispatch({ type: 'INITIALIZE_PATTERN', payload: { patternId: id, platform } })
    }
  }, [state.controlValues])

  const setControlValues = useCallback((values: Record<string, Record<string, number | string | boolean>>) => {
    dispatch({ type: 'SET_CONTROL_VALUES', payload: values })
  }, [])

  const updateControlValue = useCallback((patternId: string, controlId: string, value: number | string | boolean) => {
    dispatch({ type: 'UPDATE_CONTROL_VALUE', payload: { patternId, controlId, value } })
  }, [])

  const initializePattern = useCallback((patternId: string, platform: 'mobile' | 'desktop') => {
    dispatch({ type: 'INITIALIZE_PATTERN', payload: { patternId, platform } })
  }, [])

  const resetToDefaults = useCallback((patternId: string, platform: 'mobile' | 'desktop') => {
    dispatch({ type: 'RESET_TO_DEFAULTS', payload: { patternId, platform } })
  }, [])

  const contextValue: PatternStateContextType = {
    selectedPatternId: state.selectedPatternId,
    controlValues: state.controlValues,
    isInitialized: state.isInitialized,
    setSelectedPatternId,
    setControlValues,
    updateControlValue,
    initializePattern,
    resetToDefaults
  }

  return (
    <PatternStateContext.Provider value={contextValue}>
      {children}
    </PatternStateContext.Provider>
  )
}

// AIDEV-NOTE: Custom hook for consuming context with error handling
export function usePatternState(): PatternStateContextType {
  const context = useContext(PatternStateContext)
  if (!context) {
    throw new Error('usePatternState must be used within a PatternStateProvider')
  }
  return context
}

// AIDEV-NOTE: Utility hook for getting control values for a specific pattern
export function usePatternControlValues(patternId: string): Record<string, number | string | boolean> {
  const { controlValues } = usePatternState()
  return controlValues[patternId] || {}
}