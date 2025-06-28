"use client"

import React from "react"
import { MobileLayoutWrapper } from "@/components/mobile"
import { DesktopLayout } from "@/components/desktop"
import { useMobileDetection } from "@/components/hooks/useMobileDetection"

export default function PatternGeneratorShowcase() {
  // AIDEV-NOTE: Simplified mobile-first layout switching - tablets now use mobile layout (Issue #70)
  const { isMobile } = useMobileDetection()
  
  return (
    <>
      {/* Mobile-first approach: mobile layout for ≤1023px, desktop for ≥1024px */}
      {isMobile ? (
        <MobileLayoutWrapper />
      ) : (
        <DesktopLayout />
      )}
    </>
  )
}