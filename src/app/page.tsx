"use client"

import React from "react"
import { MobileLayoutWrapper } from "@/components/mobile"
import { DesktopLayout } from "@/components/desktop"
import { useMobileDetection } from "@/components/hooks/useMobileDetection"

export default function PatternGeneratorShowcase() {
  // AIDEV-NOTE: Mobile responsive layout integration - Issue #1
  const { isMobile, isTablet } = useMobileDetection()
  
  return (
    <>
      {/* If mobile or tablet, use new responsive layout */}
      {(isMobile || isTablet) ? (
        <MobileLayoutWrapper />
      ) : (
        <DesktopLayout />
      )}
    </>
  )
}