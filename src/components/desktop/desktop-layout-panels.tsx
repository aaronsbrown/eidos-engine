// AIDEV-NOTE: Extracted desktop layout floating panels and modals for better maintainability
"use client"

import React from "react"
import { SavePresetModal } from "@/components/ui/save-preset-modal"
import { FloatingPresetPanel } from "@/components/ui/floating-preset-panel"
import type { DesktopLayoutState, DesktopLayoutActions } from "@/lib/hooks/use-desktop-layout-state"
import type { EducationalContent } from "@/components/ui/educational-overlay"

import type { PatternPreset } from "@/lib/preset-manager"

interface PresetData {
  presets: PatternPreset[]
  activePresetId: string | null
  loadPreset: (presetId: string) => void
  savePreset: (name: string, description?: string) => Promise<boolean>
  error: string | null
  clearError: () => void
  isLoading: boolean
}

interface DesktopLayoutPanelsProps {
  state: DesktopLayoutState
  actions: DesktopLayoutActions
  educationalContent: EducationalContent
  presetData: PresetData
}

export function DesktopLayoutPanels({
  state,
  actions,
  // Educational content handled in main component for desktop
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  educationalContent: _educationalContent,
  presetData
}: DesktopLayoutPanelsProps) {
  const {
    isPresetPanelOpen,
    isSaveModalOpen,
    selectedPatternId,
    selectedPattern,
  } = state

  const {
    setIsPresetPanelOpen,
    setIsSaveModalOpen,
    getCurrentControlValues,
    handleControlChange,
  } = actions

  const {
    savePreset,
    error: presetError,
    isLoading: isPresetLoading
  } = presetData

  return (
    <>
      {/* Save Preset Modal */}
      {isSaveModalOpen && (
        <SavePresetModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          onSave={savePreset}
          isLoading={isPresetLoading}
          error={presetError}
        />
      )}

      {/* Floating Preset Manager Panel */}
      {isPresetPanelOpen && (
        <FloatingPresetPanel
          patternId={selectedPatternId}
          controlValues={getCurrentControlValues()}
          onControlValuesChange={(newValues) => {
            Object.entries(newValues).forEach(([controlId, value]) => {
              handleControlChange(controlId, value)
            })
          }}
          patternControls={selectedPattern.controls}
          onClose={() => setIsPresetPanelOpen(false)}
        />
      )}

      {/* Educational Overlay - Mobile Sidebar (desktop uses accordion in main component) */}
      {/* Note: On desktop, educational content is embedded in main component as accordion */}
      {/* On mobile, it should appear as a sidebar overlay for better mobile UX */}
      {/* This is currently handled by the main component for both cases */}
    </>
  )
}