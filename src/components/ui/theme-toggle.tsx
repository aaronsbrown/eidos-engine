"use client"

import { useTheme } from "@/lib/theme-context"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="h-8 px-3 font-mono text-xs border border-gray-600 text-gray-600 hover:bg-accent-primary hover:text-accent-primary-foreground hover:border-accent-primary transition-colors rounded-md"
      style={{
        backgroundColor: theme === 'dark' ? 'rgb(205, 205, 208)' : undefined
      }}
    >
      <div className="flex items-center space-x-2">
        <span className="uppercase tracking-wider">
          {theme === 'dark' ? 'LIGHT_MODE' : 'DARK_MODE'}
        </span>
        <div className="text-gray-600">
          {theme === 'dark' ? <Sun className="w-3 h-3" data-testid="theme-icon" /> : <Moon className="w-3 h-3" data-testid="theme-icon" />}
        </div>
      </div>
    </button>
  )
}