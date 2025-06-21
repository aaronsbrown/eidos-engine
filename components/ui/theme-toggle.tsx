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
      className="font-mono text-xs border-border hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950/20 relative group"
    >
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 ${theme === 'dark' ? 'bg-yellow-400' : 'bg-gray-400'} transition-colors`}></div>
        <span className="uppercase tracking-wider">
          {theme === 'dark' ? 'LIGHT_MODE' : 'DARK_MODE'}
        </span>
        <div className="text-gray-500 dark:text-gray-400">
          [{theme === 'dark' ? '●' : '○'}]
        </div>
      </div>
    </Button>
  )
}