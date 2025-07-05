import React from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider } from '@/lib/theme-context'
import { PatternStateProvider } from '@/lib/contexts/pattern-state-context'

// AIDEV-NOTE: Test utility to provide necessary context providers including pattern state (Issue #80)

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <PatternStateProvider>
        {children}
      </PatternStateProvider>
    </ThemeProvider>
  )
}

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }