// AIDEV-NOTE: Mobile header component with technical aesthetic and minimal design
'use client'

import React, { memo } from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

export interface MobileHeaderProps {
  title: string
  onMenuToggle: () => void
  onStartTour?: () => void // AIDEV-NOTE: Optional tour trigger for testing
}

const MobileHeader = memo(function MobileHeader({
  title,
  onMenuToggle,
  onStartTour
}: MobileHeaderProps) {


  return (
    <header
      data-testid="mobile-header"
      className="h-12 bg-background/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 py-2 relative z-20 font-mono uppercase tracking-wider"
      style={{ height: '48px' }}
    >
      {/* Left side - Title */}
      <div className="flex-1 flex items-center justify-start px-2">
        <h1 className="font-mono text-sm md:text-base uppercase tracking-wider text-foreground truncate">
          {title || 'EIDOS ENGINE'}
        </h1>
      </div>

      {/* Right side - Tour button and menu button */}
      <div data-testid="header-controls" className="flex items-center space-x-2">
        {/* AIDEV-NOTE: Wet Paint tour testing button for mobile */}
        {onStartTour && (
          <button
            onClick={onStartTour}
            className="border border-border bg-accent-primary hover:bg-accent-primary-strong text-accent-primary-foreground px-2 py-1 text-xs font-mono transition-colors min-h-[28px]"
          >
            TOUR
          </button>
        )}

        {/* Menu button */}
        <Button
          data-testid="menu-toggle"
          type="button"
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="min-h-[44px] min-w-[44px] p-2 hover:bg-muted/50"
          aria-label="Open menu"
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          <Menu className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </header>
  )
})

export default MobileHeader