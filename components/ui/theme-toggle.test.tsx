// AIDEV-NOTE: ThemeToggle component tests - rendering, toggleTheme function, theme state display
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from './theme-toggle'

// Mock the theme context for isolated testing
const mockToggleTheme = jest.fn()
const mockThemeContext = {
  theme: 'light' as const,
  setTheme: jest.fn(),
  toggleTheme: mockToggleTheme,
}

jest.mock('../../lib/theme-context', () => ({
  useTheme: () => mockThemeContext,
}))


describe('ThemeToggle Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockThemeContext.theme = 'light'
  })

  describe('Rendering', () => {
    it('renders theme toggle button', () => {
      render(<ThemeToggle />)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('displays light mode text when theme is light', () => {
      mockThemeContext.theme = 'light'
      render(<ThemeToggle />)
      expect(screen.getByText('LIGHT_MODE')).toBeInTheDocument()
      expect(screen.getByText('[○]')).toBeInTheDocument()
    })

    it('displays dark mode text when theme is dark', () => {
      mockThemeContext.theme = 'dark'
      render(<ThemeToggle />)
      expect(screen.getByText('DARK_MODE')).toBeInTheDocument()
      expect(screen.getByText('[●]')).toBeInTheDocument()
    })

    it('applies correct styling classes', () => {
      render(<ThemeToggle />)
      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'font-mono',
        'text-xs',
        'border-border',
        'hover:border-yellow-400',
        'hover:bg-yellow-50'
      )
    })
  })

  describe('Theme Indicator', () => {
    it('shows gray indicator dot for light theme', () => {
      mockThemeContext.theme = 'light'
      render(<ThemeToggle />)
      const indicator = screen.getByRole('button').querySelector('.bg-gray-400')
      expect(indicator).toBeInTheDocument()
    })

    it('shows yellow indicator dot for dark theme', () => {
      mockThemeContext.theme = 'dark'
      render(<ThemeToggle />)
      const indicator = screen.getByRole('button').querySelector('.bg-yellow-400')
      expect(indicator).toBeInTheDocument()
    })
  })

  describe('Click Interaction', () => {
    it('calls toggleTheme when clicked', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />)
      
      await user.click(screen.getByRole('button'))
      expect(mockToggleTheme).toHaveBeenCalledTimes(1)
    })

    it('calls toggleTheme multiple times for multiple clicks', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      await user.click(button)
      await user.click(button)
      
      expect(mockToggleTheme).toHaveBeenCalledTimes(3)
    })
  })

  describe('Keyboard Interaction', () => {
    it('toggles theme when Enter key is pressed', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />)
      
      const button = screen.getByRole('button')
      button.focus()
      await user.keyboard('{Enter}')
      
      expect(mockToggleTheme).toHaveBeenCalledTimes(1)
    })

    it('toggles theme when Space key is pressed', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />)
      
      const button = screen.getByRole('button')
      button.focus()
      await user.keyboard(' ')
      
      expect(mockToggleTheme).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('is keyboard accessible', () => {
      render(<ThemeToggle />)
      const button = screen.getByRole('button')
      expect(button).toBeVisible()
      expect(button).not.toHaveAttribute('aria-disabled')
    })

    it('provides semantic button role', () => {
      render(<ThemeToggle />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Integration with Theme Context', () => {
    it('uses mocked theme context correctly', () => {
      render(<ThemeToggle />)
      expect(screen.getByText('LIGHT_MODE')).toBeInTheDocument()
    })
  })
})