"use client"

import { useTheme } from "@/lib/theme-context"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="sm"
      className="font-mono text-xs relative group"
    >
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 ${theme === 'dark' ? 'bg-accent-primary' : 'bg-muted-foreground'} transition-colors`}></div>
        <span className="uppercase tracking-wider">
          {theme === 'dark' ? 'LIGHT_MODE' : 'DARK_MODE'}
        </span>
        <div className="text-muted-foreground">
          [{theme === 'dark' ? '●' : '○'}]
        </div>
      </div>
    </Button>
  )
}