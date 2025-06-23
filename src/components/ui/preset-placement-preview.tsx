// AIDEV-NOTE: Quick preview component for testing different preset placement options
"use client"

import React, { createContext, useContext, useState } from 'react'

type PresetPlacement = 'current' | 'toolbar' | 'floating'

interface PresetPlacementContextType {
  placement: PresetPlacement
  setPlacement: (placement: PresetPlacement) => void
}

const PresetPlacementContext = createContext<PresetPlacementContextType | undefined>(undefined)

export function usePresetPlacement() {
  const context = useContext(PresetPlacementContext)
  if (!context) {
    throw new Error('usePresetPlacement must be used within PresetPlacementProvider')
  }
  return context
}

export function PresetPlacementProvider({ children }: { children: React.ReactNode }) {
  const [placement, setPlacement] = useState<PresetPlacement>('current')
  
  return (
    <PresetPlacementContext.Provider value={{ placement, setPlacement }}>
      {children}
    </PresetPlacementContext.Provider>
  )
}

export function PresetPlacementToggle() {
  const { placement, setPlacement } = usePresetPlacement()
  
  return (
    <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 p-2 text-xs font-mono">
      <span className="text-yellow-800 dark:text-yellow-200 mr-2">🔧 PREVIEW MODE:</span>
      <button 
        onClick={() => setPlacement('current')}
        className={`mr-2 px-2 py-1 border ${placement === 'current' ? 'bg-yellow-200 dark:bg-yellow-800' : 'bg-white dark:bg-gray-800'}`}
      >
        Current
      </button>
      <button 
        onClick={() => setPlacement('toolbar')}
        className={`mr-2 px-2 py-1 border ${placement === 'toolbar' ? 'bg-yellow-200 dark:bg-yellow-800' : 'bg-white dark:bg-gray-800'}`}
      >
        Toolbar
      </button>
      <button 
        onClick={() => setPlacement('floating')}
        className={`px-2 py-1 border ${placement === 'floating' ? 'bg-yellow-200 dark:bg-yellow-800' : 'bg-white dark:bg-gray-800'}`}
      >
        Floating
      </button>
    </div>
  )
}