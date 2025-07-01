// AIDEV-NOTE: Desktop layout component - refactored from 747 lines to focused structure using extracted modules
"use client"

import React, { useEffect } from "react"
import { useDesktopLayoutState } from "@/lib/hooks/use-desktop-layout-state"
import { useDesktopLayoutHandlers } from "@/lib/desktop-layout-handlers"
import { DesktopLayoutHeader } from "./desktop-layout-header"
import { DesktopLayoutSidebar } from "./desktop-layout-sidebar"
import { DesktopLayoutMain } from "./desktop-layout-main"
import { DesktopLayoutPanels } from "./desktop-layout-panels"
import { usePresetManager } from "@/lib/hooks/use-preset-manager"
import { useEducationalContent } from "@/lib/hooks/use-educational-content"
import { getAllPatternIds } from "@/lib/educational-content-loader"
import { useTour } from "@/lib/hooks/use-tour"

export default function DesktopLayout() {
  // AIDEV-NOTE: Use extracted state and handlers for cleaner component structure
  const [state, actions] = useDesktopLayoutState()
  const handlers = useDesktopLayoutHandlers(state, actions)

  const {
    selectedPatternId,
    selectedPattern,
  } = state

  const {
    setIsPresetPanelOpen,
    setIsSaveModalOpen,
    getCurrentControlValues,
    handleControlChange,
  } = actions

  // AIDEV-NOTE: Load educational content for current pattern
  const { content: educationalContent } = useEducationalContent(selectedPatternId)
  
  // AIDEV-NOTE: Tour system integration with first-visit detection
  const { startDesktopTour, shouldShowTour } = useTour()
  
  // Check if educational content is available for current pattern
  const availableEducationalPatterns = getAllPatternIds()
  const hasEducationalContent = availableEducationalPatterns.includes(selectedPatternId)

  // AIDEV-NOTE: Initialize preset manager hook for dropdown functionality
  const {
    presets,
    activePresetId,
    loadPreset,
    savePreset,
    error: presetError,
    clearError: clearPresetError,
    isLoading: isPresetLoading
  } = usePresetManager({
    patternId: selectedPatternId,
    controlValues: getCurrentControlValues(),
    onControlValuesChange: (newValues) => {
      Object.entries(newValues).forEach(([controlId, value]) => {
        handleControlChange(controlId, value)
      })
    },
    patternControls: selectedPattern.controls
  })

  // AIDEV-NOTE: Quick save handler - opens save modal for user to name preset
  const handleQuickSave = () => {
    setIsSaveModalOpen(true)
  }

  // AIDEV-NOTE: Auto-start tour for first-time visitors
  useEffect(() => {
    const checkAndStartTour = () => {
      if (shouldShowTour()) {
        // Small delay to ensure UI is fully loaded
        setTimeout(() => {
          startDesktopTour()
        }, 1000)
      }
    }

    checkAndStartTour()
  }, [shouldShowTour, startDesktopTour])

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Technical Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Header */}
      <DesktopLayoutHeader
        shouldShowTour={shouldShowTour}
        startDesktopTour={startDesktopTour}
      />

      <div className="flex relative">
        {/* Left Sidebar - Pattern Selection & Specifications */}
        <DesktopLayoutSidebar
          state={state}
          handlers={handlers}
          onQuickSave={handleQuickSave}
          hasEducationalContent={hasEducationalContent}
          setIsEducationalVisible={actions.setIsEducationalVisible}
          setIsPresetPanelOpen={setIsPresetPanelOpen}
        />

        {/* Main Content Area */}
        <DesktopLayoutMain
          state={state}
          handlers={handlers}
          educationalContent={educationalContent}
          hasEducationalContent={hasEducationalContent}
          onQuickSave={handleQuickSave}
          activePresetId={activePresetId}
          presets={presets}
          isPresetLoading={isPresetLoading}
          getCurrentControlValues={getCurrentControlValues}
          handleControlChange={handleControlChange}
          setIsPresetPanelOpen={setIsPresetPanelOpen}
          setDimensions={actions.setDimensions}
          setIsEducationalVisible={actions.setIsEducationalVisible}
          loadPreset={loadPreset}
        />
      </div>

      {/* Floating Panels and Modals */}
      <DesktopLayoutPanels
        state={state}
        actions={{
          ...actions,
          getCurrentControlValues,
          handleControlChange,
        }}
        educationalContent={educationalContent}
        presetData={{
          presets,
          activePresetId,
          loadPreset,
          savePreset,
          error: presetError,
          clearError: clearPresetError,
          isLoading: isPresetLoading
        }}
      />
    </div>
  )
}