// AIDEV-NOTE: Floating preset panel - Option 2 preview
"use client"

import React, { useState } from 'react'
import { Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePresetManager } from '@/lib/hooks/use-preset-manager'
import { PatternControl } from '@/components/pattern-generators/types'

interface FloatingPresetPanelProps {
  patternId: string
  controlValues: Record<string, number | string | boolean>
  onControlValuesChange: (values: Record<string, number | string | boolean>) => void
  patternControls?: PatternControl[]
  onClose?: () => void
}

export function FloatingPresetPanel({
  patternId,
  controlValues,
  onControlValuesChange,
  patternControls = [],
  onClose
}: FloatingPresetPanelProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [renamingPresetId, setRenamingPresetId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null)
  
  // Use external onClose if provided, otherwise use internal state
  const isControlledExternally = Boolean(onClose)
  const isOpen = isControlledExternally ? true : internalIsOpen
  
  const {
    presets,
    isLoading,
    error,
    deletePreset,
    renamePreset,
    clearError,
    exportPreset,
    importPreset,
    restoreFactoryPresets
  } = usePresetManager({
    patternId,
    controlValues,
    onControlValuesChange,
    patternControls
  })
  
  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      setInternalIsOpen(false)
    }
  }

  // Check if factory presets exist for this pattern
  const hasFactoryPresets = presets.some(preset => preset.isFactory && preset.generatorType === patternId)

  // Handle restore factory presets
  const handleRestoreFactoryPresets = async () => {
    try {
      setRestoreMessage(null)
      const result = await restoreFactoryPresets()
      
      if (result.imported > 0) {
        setRestoreMessage(`✓ Restored ${result.imported} factory preset${result.imported === 1 ? '' : 's'}`)
      } else {
        setRestoreMessage('ℹ All factory presets already present')
      }
      
      // Clear message after 3 seconds
      setTimeout(() => setRestoreMessage(null), 3000)
    } catch {
      setRestoreMessage('✗ Failed to restore factory presets')
      setTimeout(() => setRestoreMessage(null), 3000)
    }
  }

  const handleDeletePreset = async (presetId: string) => {
    if (window.confirm('Delete this preset?')) {
      await deletePreset(presetId)
    }
  }

  const handleStartRename = (presetId: string, currentName: string) => {
    setRenamingPresetId(presetId)
    setRenameValue(currentName)
  }

  const handleConfirmRename = async () => {
    if (!renamingPresetId || !renameValue.trim()) return
    
    const success = await renamePreset(renamingPresetId, renameValue.trim())
    if (success) {
      setRenamingPresetId(null)
      setRenameValue('')
    }
  }

  const handleCancelRename = () => {
    setRenamingPresetId(null)
    setRenameValue('')
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
    <>
      {/* Floating Trigger Button - Only show if not controlled externally */}
      {!isControlledExternally && (
        <button
          onClick={() => setInternalIsOpen(true)}
          className="fixed top-4 right-4 z-40 bg-accent-primary text-accent-primary-foreground hover:bg-accent-primary-strong w-12 h-12 rounded-full shadow-lg flex items-center justify-center font-mono text-lg transition-all hover:scale-110"
          aria-label="Open presets"
        >
          ⭐
        </button>
      )}

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onMouseDown={(e) => {
            // Don't close modal when in rename mode
            if (renamingPresetId) return
            
            if (e.target === e.currentTarget) {
              handleClose()
            }
          }}
        >
          <div 
            className="bg-background border border-border rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-sm font-mono uppercase tracking-wider text-foreground">
                Preset Manager
              </h2>
              <button
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground w-8 h-8 flex items-center justify-center transition-colors"
                aria-label="Close presets"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Import Section */}
              <div className="flex gap-2">
                <Button
                  onClick={handleImportPreset}
                  variant="outline"
                  className="flex-1 font-mono text-xs"
                  disabled={isLoading}
                >
                  Import Preset JSON
                </Button>
              </div>

              {/* Preset Library Section */}
              {presets.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-mono text-muted-foreground/80 uppercase">
                    Preset Library:
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {presets.map((preset) => (
                      <div key={preset.id} className="flex items-center justify-between p-2 border border-accent-primary bg-accent-primary/10 hover:bg-muted/50">
                        <div className="flex-1 min-w-0">
                          {renamingPresetId === preset.id ? (
                            <div className="space-y-1">
                              <input
                                type="text"
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                className="w-full text-xs font-mono border border-border bg-background px-2 py-1 rounded"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleConfirmRename()
                                  if (e.key === 'Escape') handleCancelRename()
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                                onMouseUp={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                              />
                            </div>
                          ) : (
                            <>
                              <div className="text-xs font-mono truncate">{preset.name}</div>
                              <div className="text-xs text-muted-foreground/60">
                                {new Date(preset.createdAt).toLocaleDateString()}
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex gap-1 ml-2">
                          {renamingPresetId === preset.id ? (
                            <>
                              <Button
                                onClick={handleConfirmRename}
                                variant="outline"
                                size="sm"
                                className="text-xs font-mono border-border hover:border-green-500 px-2 py-1"
                                disabled={!renameValue.trim() || isLoading}
                              >
                                Save
                              </Button>
                              <Button
                                onClick={handleCancelRename}
                                variant="outline"
                                size="sm"
                                className="text-xs font-mono border-border hover:border-red-500 px-2 py-1"
                                disabled={isLoading}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                onClick={() => handleStartRename(preset.id, preset.name)}
                                variant="outline"
                                size="sm"
                                className="text-xs font-mono border-border hover:border-accent-primary px-2 py-1"
                                disabled={isLoading}
                              >
                                <Edit2 className="w-3 h-3" />
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
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 border border-red-200 dark:border-red-800 rounded">
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
                <div className="text-xs text-muted-foreground animate-pulse text-center">
                  Working...
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/30">
              <div className="flex justify-between items-center">
                <div className="text-xs font-mono text-muted-foreground">
                  Pattern: {patternId}
                </div>
                {hasFactoryPresets && (
                  <div className="flex flex-col items-end gap-1">
                    {restoreMessage && (
                      <div className="text-xs font-mono text-muted-foreground">
                        {restoreMessage}
                      </div>
                    )}
                    <Button
                      onClick={handleRestoreFactoryPresets}
                      variant="outline"
                      size="sm"
                      className="text-xs font-mono border-border hover:border-accent-primary px-3 py-1"
                      disabled={isLoading}
                    >
                      Restore Factory Presets
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}