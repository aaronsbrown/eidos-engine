import React from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider } from '@/lib/theme-context'

// AIDEV-NOTE: Test utility to provide necessary context providers for educational overlay tests

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }