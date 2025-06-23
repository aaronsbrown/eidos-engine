// AIDEV-NOTE: Temporary preset UI for core functionality testing - Issue #16 Phase 1
"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { usePresetManager } from '@/lib/hooks/use-preset-manager'
import { PatternControl } from '@/components/pattern-generators/types'

interface TempPresetControlsProps {
  patternId: string
  controlValues: Record<string, number | string | boolean>
  onControlValuesChange: (values: Record<string, number | string | boolean>) => void
  patternControls?: PatternControl[]
}

// AIDEV-NOTE: Basic temporary UI for testing preset functionality before polished design
export function TempPresetControls({
  patternId,
  controlValues,
  onControlValuesChange,
  patternControls = []
}: TempPresetControlsProps) {
  const [presetName, setPresetName] = useState('')
  const [showSaveInput, setShowSaveInput] = useState(false)
  
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
  }

  const handleDeletePreset = async (presetId: string) => {
    if (window.confirm('Delete this preset?')) {
      await deletePreset(presetId)
    }
  }

  // AIDEV-NOTE: Basic export functionality - downloads preset as JSON file
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

  // AIDEV-NOTE: Basic import functionality - handles file selection
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
    <div className="border border-border p-3 bg-background space-y-3">
      <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
        Presets (TEMP UI - {presets.length} saved)
      </div>
      
      {error && (
        <div className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-2 border border-red-200 dark:border-red-800">
          {error}
          <button 
            onClick={clearError}
            className="ml-2 underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Save Preset Section */}
      <div className="space-y-2">
        {!showSaveInput ? (
          <Button
            onClick={() => setShowSaveInput(true)}
            variant="outline"
            size="sm"
            className="w-full font-mono text-xs border-border hover:border-accent-primary"
            disabled={isLoading}
          >
            + Save Current as Preset
          </Button>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Preset name..."
              className="col-span-2 text-xs font-mono border border-border bg-background px-2 py-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSavePreset()
                if (e.key === 'Escape') setShowSaveInput(false)
              }}
            />
            <div className="flex gap-1">
              <Button
                onClick={handleSavePreset}
                variant="outline"
                size="sm"
                className="text-xs font-mono border-border hover:border-accent-primary flex-1"
                disabled={!presetName.trim() || isLoading}
              >
                Save
              </Button>
              <Button
                onClick={() => {
                  setShowSaveInput(false)
                  setPresetName('')
                }}
                variant="outline"
                size="sm"
                className="text-xs font-mono border-border hover:border-red-500 px-2"
              >
                ×
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Import Section - always available */}
      <div className="flex gap-2">
        <Button
          onClick={handleImportPreset}
          variant="outline"
          size="sm"
          className="flex-1 font-mono text-xs border-border hover:border-accent-primary"
          disabled={isLoading}
        >
          Import Preset JSON
        </Button>
      </div>

      {/* Load Preset Section */}
      {presets.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-mono text-muted-foreground/80 uppercase">
            Load Preset:
          </div>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {presets.map((preset) => (
              <div 
                key={preset.id}
                className={`flex items-center justify-between p-2 border ${
                  activePresetId === preset.id 
                    ? 'border-accent-primary bg-accent-primary/10' 
                    : 'border-border bg-background'
                } hover:bg-muted/50`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono truncate">
                    {preset.name}
                  </div>
                  <div className="text-xs text-muted-foreground/60">
                    {new Date(preset.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    onClick={() => handleLoadPreset(preset.id)}
                    variant="outline"
                    size="sm"
                    className="text-xs font-mono border-border hover:border-accent-primary px-2 py-1"
                    disabled={isLoading || activePresetId === preset.id}
                  >
                    {activePresetId === preset.id ? '✓' : 'Load'}
                  </Button>
                  <Button
                    onClick={() => handleExportPreset(preset.id)}
                    variant="outline"
                    size="sm"
                    className="text-xs font-mono border-border hover:border-accent-primary px-2 py-1"
                    disabled={isLoading}
                  >
                    Export
                  </Button>
                  <Button
                    onClick={() => handleDeletePreset(preset.id)}
                    variant="outline"
                    size="sm"
                    className="text-xs font-mono border-border hover:border-red-500 px-2 py-1"
                    disabled={isLoading}
                  >
                    Del
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {presets.length === 0 && (
        <div className="text-xs text-muted-foreground/60 italic">
          No presets saved for this pattern yet
        </div>
      )}

      {isLoading && (
        <div className="text-xs text-muted-foreground animate-pulse">
          Working...
        </div>
      )}
    </div>
  )
}