// AIDEV-NOTE: Theme Context tests - ThemeProvider, useTheme hook, localStorage, DOM updates
import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from './theme-context'

// Test component to use the theme context
const TestComponent = () => {
  const { theme, setTheme, toggleTheme } = useTheme()
  
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button onClick={() => setTheme('light')} data-testid="set-light">
        Set Light
      </button>
      <button onClick={() => setTheme('dark')} data-testid="set-dark">
        Set Dark
      </button>
      <button onClick={toggleTheme} data-testid="toggle-theme">
        Toggle Theme
      </button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    
    // Clear DOM classes
    document.documentElement.classList.remove('dark')
    
    // Reset matchMedia mock
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  })

  describe('ThemeProvider', () => {
    it('provides default light theme when no saved theme exists', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
      })
    })

    it('uses saved theme from localStorage', async () => {
      localStorage.setItem('theme', 'dark')

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
      })
    })

    it('uses system preference when no saved theme exists', async () => {
      // Mock matchMedia to return dark preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
      })
    })

    it('renders null while not mounted', () => {
      // Mock useState to return mounted = false
      const mockSetState = jest.fn()
      jest.spyOn(React, 'useState')
        .mockReturnValueOnce(['light', mockSetState]) // theme state
        .mockReturnValueOnce([false, mockSetState]) // mounted state

      const { container } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      expect(container.firstChild).toBeNull()
    })
  })

  describe('Theme State Management', () => {
    it('updates theme when setTheme is called', async () => {
      const user = userEvent.setup()
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
      })

      await user.click(screen.getByTestId('set-dark'))

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
      })
    })

    it('toggles theme correctly from light to dark', async () => {
      const user = userEvent.setup()
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
      })

      await user.click(screen.getByTestId('toggle-theme'))

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
      })
    })

    it('toggles theme correctly from dark to light', async () => {
      localStorage.setItem('theme', 'dark')
      const user = userEvent.setup()
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
      })

      await user.click(screen.getByTestId('toggle-theme'))

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
      })
    })
  })

  describe('localStorage Integration', () => {
    it('saves theme to localStorage when theme changes', async () => {
      const user = userEvent.setup()
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
      })

      await user.click(screen.getByTestId('set-dark'))

      await waitFor(() => {
        expect(localStorage.getItem('theme')).toBe('dark')
      })
    })

    it('updates localStorage when toggling theme', async () => {
      const user = userEvent.setup()
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
      })

      await user.click(screen.getByTestId('toggle-theme'))

      await waitFor(() => {
        expect(localStorage.getItem('theme')).toBe('dark')
      })

      await user.click(screen.getByTestId('toggle-theme'))

      await waitFor(() => {
        expect(localStorage.getItem('theme')).toBe('light')
      })
    })
  })

  describe('DOM Updates', () => {
    it('adds dark class to document element when theme is dark', async () => {
      const user = userEvent.setup()
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      await user.click(screen.getByTestId('set-dark'))

      await waitFor(() => {
        expect(document.documentElement).toHaveClass('dark')
      })
    })

    it('removes dark class from document element when theme is light', async () => {
      // Start with dark theme
      localStorage.setItem('theme', 'dark')
      const user = userEvent.setup()
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(document.documentElement).toHaveClass('dark')
      })

      await user.click(screen.getByTestId('set-light'))

      await waitFor(() => {
        expect(document.documentElement).not.toHaveClass('dark')
      })
    })

    it('toggles document dark class when theme is toggled', async () => {
      const user = userEvent.setup()
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      // Initially light (no dark class)
      await waitFor(() => {
        expect(document.documentElement).not.toHaveClass('dark')
      })

      // Toggle to dark
      await user.click(screen.getByTestId('toggle-theme'))

      await waitFor(() => {
        expect(document.documentElement).toHaveClass('dark')
      })

      // Toggle back to light
      await user.click(screen.getByTestId('toggle-theme'))

      await waitFor(() => {
        expect(document.documentElement).not.toHaveClass('dark')
      })
    })
  })

  describe('useTheme Hook', () => {
    it('throws error when used outside ThemeProvider', () => {
      const TestComponentWithoutProvider = () => {
        useTheme()
        return <div>Test</div>
      }

      // Mock console.error to prevent test output pollution
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(<TestComponentWithoutProvider />)
      }).toThrow('useTheme must be used within a ThemeProvider')

      consoleSpy.mockRestore()
    })

    it('returns theme context value when used within provider', async () => {
      let themeContextValue: any

      const TestHookComponent = () => {
        themeContextValue = useTheme()
        return <div>Test</div>
      }

      render(
        <ThemeProvider>
          <TestHookComponent />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(themeContextValue).toEqual({
          theme: 'light',
          setTheme: expect.any(Function),
          toggleTheme: expect.any(Function),
        })
      })
    })
  })
})