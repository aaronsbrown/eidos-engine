// AIDEV-NOTE: Extracted desktop layout header from main component for better maintainability
"use client"

import React from "react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

interface DesktopLayoutHeaderProps {
  shouldShowTour: () => boolean
  startDesktopTour: () => void
}

export function DesktopLayoutHeader({
  shouldShowTour,
  startDesktopTour
}: DesktopLayoutHeaderProps) {
  return (
    <header className="relative border-b border-form p-3 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-mono tracking-wider uppercase text-header-text">Eidos Engine</h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* AIDEV-NOTE: Tour control button - shows for returning users */}
          {!shouldShowTour() && (
            <button
              onClick={startDesktopTour}
              className="border border-border bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground px-3 py-1 text-xs font-mono transition-colors"
            >
              REPLAY TOUR
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}