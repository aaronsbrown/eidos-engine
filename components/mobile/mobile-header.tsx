// AIDEV-NOTE: Mobile header component with technical aesthetic and minimal design
'use client'

import React, { memo } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

export interface MobileHeaderProps {
  title: string
  patternCount: { current: number; total: number }
  onMenuToggle: () => void
  onThemeToggle?: () => void
}

const MobileHeader = memo(function MobileHeader({
  title,
  patternCount,
  onMenuToggle,
  onThemeToggle
}: MobileHeaderProps) {
  const { theme, toggleTheme } = useTheme()

  const handleThemeToggle = () => {
    if (onThemeToggle) {
      onThemeToggle()
    } else {
      toggleTheme()
    }
  }

  // Format pattern counter with zero padding
  const formatCounter = (current: number, total: number): string => {
    const currentStr = Math.max(0, current).toString().padStart(2, '0')
    const totalStr = Math.max(0, total).toString().padStart(2, '0')
    return `${currentStr}/${totalStr}`
  }

  return (
    <header
      data-testid="mobile-header"
      className="h-12 bg-background/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 py-2 relative z-20"
    >
      {/* Left side - Menu button */}
      <Button
        data-testid="menu-toggle"
        variant="ghost"
        size="sm"
        onClick={onMenuToggle}
        className="min-h-[44px] min-w-[44px] p-2 hover:bg-muted/50"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-muted-foreground" />
      </Button>

      {/* Center - Title */}
      <div className="flex-1 flex items-center justify-center px-2">
        <h1 className="font-mono text-sm md:text-base uppercase tracking-wider text-foreground truncate text-center">
          {title || 'PATTERN GENERATOR'}
        </h1>
      </div>

      {/* Right side - Pattern counter and theme toggle */}
      <div data-testid="header-controls" className="flex items-center space-x-2">
        {/* Pattern Counter */}
        <div
          data-testid="pattern-counter"
          className="font-mono text-xs text-muted-foreground bg-background border border-yellow-400 px-2 py-1 min-w-[50px] text-center"
          aria-label={`Pattern ${patternCount.current} of ${patternCount.total}`}
        >
          {formatCounter(patternCount.current, patternCount.total)}
        </div>

        {/* Theme Toggle */}
        <Button
          data-testid="theme-toggle"
          variant="ghost"
          size="sm"
          onClick={handleThemeToggle}
          className="min-h-[44px] min-w-[44px] p-2 hover:bg-muted/50"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Moon className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
    </header>
  )
})

export default MobileHeader