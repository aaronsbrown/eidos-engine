// AIDEV-NOTE: Horizontal toolbar preset controls - Option 1 preview
"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { usePresetManager } from '@/lib/hooks/use-preset-manager'
import { PatternControl } from '@/components/pattern-generators/types'

interface ToolbarPresetControlsProps {
  patternId: string
  controlValues: Record<string, number | string | boolean>
  onControlValuesChange: (values: Record<string, number | string | boolean>) => void
  patternControls?: PatternControl[]
}

export function ToolbarPresetControls({
  patternId,
  controlValues,
  onControlValuesChange,
  patternControls = []
}: ToolbarPresetControlsProps) {
  const [showSaveInput, setShowSaveInput] = useState(false)
  const [presetName, setPresetName] = useState('')
  const [showPresetList, setShowPresetList] = useState(false)
  
  const {
    presets,
    activePresetId,
    isLoading,
    error,
    savePreset,
    loadPreset,
    deletePreset,
    clearError,
    exportPreset,
    importPreset
  } = usePresetManager({
    patternId,
    controlValues,
    onControlValuesChange,
    patternControls
  })

  const handleSavePreset = async () => {
    if (!presetName.trim()) return
    
    const success = await savePreset(presetName.trim())
    if (success) {
      setPresetName('')
      setShowSaveInput(false)
    }
  }

  const handleLoadPreset = async (presetId: string) => {
    await loadPreset(presetId)
    setShowPresetList(false)
  }

  const handleDeletePreset = async (presetId: string) => {
    if (window.confirm('Delete this preset?')) {
      await deletePreset(presetId)
    }
  }

  const handleExportPreset = (presetId: string) => {
    try {
      const preset = presets.find(p => p.id === presetId)
      if (!preset) return
      
      const jsonData = exportPreset(presetId)
      const blob = new Blob([jsonData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `preset_${preset.name.replace(/[^a-zA-Z0-9]/g, '_')}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const handleImportPreset = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      
      try {
        const text = await file.text()
        await importPreset(text)
      } catch (error) {
        console.error('Import failed:', error)
      }
    }
    input.click()
  }

  return (
    <div className="bg-background border-b border-border p-2 flex items-center gap-4 relative">
      <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
        Presets:
      </div>
      
      {/* Save Button */}
      {!showSaveInput ? (
        <Button
          onClick={() => setShowSaveInput(true)}
          variant="outline"
          size="sm"
          className="font-mono text-xs h-8"
          disabled={isLoading}
        >
          💾 Save
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="Preset name..."
            className="text-xs font-mono border border-border bg-background px-2 py-1 h-8 w-32"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSavePreset()
              if (e.key === 'Escape') setShowSaveInput(false)
            }}
            autoFocus
          />
          <Button
            onClick={handleSavePreset}
            variant="outline"
            size="sm"
            className="text-xs font-mono h-8"
            disabled={!presetName.trim() || isLoading}
          >
            ✓
          </Button>
          <Button
            onClick={() => {
              setShowSaveInput(false)
              setPresetName('')
            }}
            variant="outline"
            size="sm"
            className="text-xs font-mono h-8"
          >
            ✕
          </Button>
        </div>
      )}

      {/* Load Presets */}
      <div className="relative">
        <Button
          onClick={() => setShowPresetList(!showPresetList)}
          variant="outline"
          size="sm"
          className="font-mono text-xs h-8"
          disabled={isLoading}
        >
          📁 Load ({presets.length})
        </Button>
        
        {showPresetList && presets.length > 0 && (
          <div className="absolute top-full left-0 mt-1 bg-background border border-border shadow-lg z-50 min-w-48 max-h-48 overflow-y-auto">
            {presets.map((preset) => (
              <div key={preset.id} className="flex items-center justify-between p-2 hover:bg-muted/50 border-b border-border">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono truncate">{preset.name}</div>
                  <div className="text-xs text-muted-foreground/60">
                    {new Date(preset.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    onClick={() => handleLoadPreset(preset.id)}
                    variant="outline"
                    size="sm"
                    className="text-xs font-mono px-2 py-1 h-6"
                    disabled={isLoading || activePresetId === preset.id}
                  >
                    {activePresetId === preset.id ? '✓' : 'Load'}
                  </Button>
                  <Button
                    onClick={() => handleExportPreset(preset.id)}
                    variant="outline"
                    size="sm"
                    className="text-xs font-mono px-2 py-1 h-6"
                    disabled={isLoading}
                  >
                    ↗
                  </Button>
                  <Button
                    onClick={() => handleDeletePreset(preset.id)}
                    variant="outline"
                    size="sm"
                    className="text-xs font-mono px-2 py-1 h-6 hover:border-red-500"
                    disabled={isLoading}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Import Button */}
      <Button
        onClick={handleImportPreset}
        variant="outline"
        size="sm"
        className="font-mono text-xs h-8"
        disabled={isLoading}
      >
        ⬇ Import
      </Button>

      {/* Error Display */}
      {error && (
        <div className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 border border-red-200 dark:border-red-800">
          {error}
          <button 
            onClick={clearError}
            className="ml-2 underline hover:no-underline"
          >
            ✕
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-xs text-muted-foreground animate-pulse">
          Working...
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showPresetList && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowPresetList(false)}
        />
      )}
    </div>
  )
}