// AIDEV-NOTE: ThemeToggle component tests - user behavior focused (Rule G-8): theme switching, visual feedback, accessibility
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

    it('display dark mode text when theme is light', () => {
      mockThemeContext.theme = 'light'
      render(<ThemeToggle />)
      expect(screen.getByText('DARK_MODE')).toBeInTheDocument()
      // Moon icon should be present for light theme (click to go to dark)
      expect(screen.getByTestId('theme-icon')).toBeInTheDocument()
    })

    it('displays light mode text when theme is dark', () => {
      mockThemeContext.theme = 'dark'
      render(<ThemeToggle />)
      expect(screen.getByText('LIGHT_MODE')).toBeInTheDocument()
      // Sun icon should be present for dark theme (click to go to light)
      expect(screen.getByTestId('theme-icon')).toBeInTheDocument()
    })

    it('provides clear visual feedback about current theme', () => {
      render(<ThemeToggle />)
      const button = screen.getByRole('button')
      expect(button).toBeVisible()
      expect(button).toHaveTextContent('DARK_MODE')
      // Moon icon should be present for light theme (click to go to dark)
      expect(screen.getByTestId('theme-icon')).toBeInTheDocument()
    })
  })

  describe('Theme State Communication', () => {
    it('clearly communicates light theme state to users', () => {
      mockThemeContext.theme = 'light'
      render(<ThemeToggle />)
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('DARK_MODE') // Shows what clicking will do
      // Moon icon should be present for light theme (click to go to dark)
      expect(screen.getByTestId('theme-icon')).toBeInTheDocument()
    })

    it('clearly communicates dark theme state to users', () => {
      mockThemeContext.theme = 'dark'
      render(<ThemeToggle />)
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('LIGHT_MODE') // Shows what clicking will do
      // Sun icon should be present for dark theme (click to go to light)
      expect(screen.getByTestId('theme-icon')).toBeInTheDocument()
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
      expect(screen.getByText('DARK_MODE')).toBeInTheDocument()
    })
  })
})