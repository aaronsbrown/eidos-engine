"use client"

import React from "react"
import { MobileLayoutWrapper } from "@/components/mobile"
import { DesktopLayout } from "@/components/desktop"
import { useMobileDetection } from "@/components/hooks/useMobileDetection"
import { PresetPlacementProvider } from "@/components/ui/preset-placement-preview"

export default function PatternGeneratorShowcase() {
  // AIDEV-NOTE: Mobile responsive layout integration - Issue #1
  const { isMobile, isTablet } = useMobileDetection()
  
  return (
    <PresetPlacementProvider>
      {/* If mobile or tablet, use new responsive layout */}
      {(isMobile || isTablet) ? (
        <MobileLayoutWrapper />
      ) : (
        <DesktopLayout />
      )}
    </PresetPlacementProvider>
  )
}