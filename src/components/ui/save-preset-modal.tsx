// AIDEV-NOTE: Simple focused modal for saving presets with name input
"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

interface SavePresetModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string) => Promise<boolean>
  isLoading?: boolean
  error?: string | null
}

export function SavePresetModal({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
  error = null
}: SavePresetModalProps) {
  const [presetName, setPresetName] = useState('')

  const handleSave = async () => {
    if (!presetName.trim()) return
    
    const success = await onSave(presetName.trim())
    if (success) {
      setPresetName('')
      onClose()
    }
  }

  const handleClose = () => {
    setPresetName('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose()
        }
      }}
    >
      <div 
        className="bg-background border border-border rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-sm font-mono uppercase tracking-wider text-foreground">
            Save Preset
          </h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground w-8 h-8 flex items-center justify-center transition-colors"
            aria-label="Close save preset modal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="preset-name" className="text-xs font-mono text-muted-foreground uppercase">
              Preset Name
            </label>
            <input
              id="preset-name"
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Enter preset name..."
              className="w-full text-sm font-mono border border-border bg-background px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
                if (e.key === 'Escape') handleClose()
              }}
              autoFocus
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 border border-red-200 dark:border-red-800 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSave}
              variant="default"
              className="flex-1 text-sm font-mono bg-accent-primary hover:bg-accent-primary-strong text-accent-primary-foreground"
              disabled={!presetName.trim() || isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Preset'}
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 text-sm font-mono"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}