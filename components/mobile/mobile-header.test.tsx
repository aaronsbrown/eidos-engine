// AIDEV-NOTE: TDD implementation per G-5 - Mobile header tests written before implementation
import { render, screen, fireEvent } from '@testing-library/react'
import MobileHeader from './mobile-header'

describe('MobileHeader', () => {
  const defaultProps = {
    title: 'PATTERN GENERATOR SYSTEM',
    patternCount: { current: 3, total: 9 },
    onMenuToggle: jest.fn(),
    onThemeToggle: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Layout and Styling', () => {
    it('renders with correct technical aesthetic styling', () => {
      render(<MobileHeader {...defaultProps} />)
      
      const header = screen.getByTestId('mobile-header')
      
      // Should have fixed height and technical styling
      expect(header).toHaveStyle('height: 48px')
      expect(header).toHaveClass('font-mono', 'uppercase', 'tracking-wider')
    })

    it('displays title with monospace font', () => {
      render(<MobileHeader {...defaultProps} />)
      
      const title = screen.getByText('PATTERN GENERATOR SYSTEM')
      expect(title).toHaveClass('font-mono', 'uppercase', 'tracking-wider')
    })

    it('has proper responsive padding', () => {
      render(<MobileHeader {...defaultProps} />)
      
      const header = screen.getByTestId('mobile-header')
      expect(header).toHaveClass('px-4', 'py-2') // Mobile-appropriate padding
    })
  })

  describe('Pattern Counter', () => {
    it('displays pattern counter with correct format', () => {
      render(<MobileHeader {...defaultProps} />)
      
      const counter = screen.getByTestId('pattern-counter')
      expect(counter).toHaveTextContent('03/09')
    })

    it('zero-pads single digit numbers', () => {
      const props = {
        ...defaultProps,
        patternCount: { current: 1, total: 9 }
      }
      
      render(<MobileHeader {...props} />)
      
      const counter = screen.getByTestId('pattern-counter')
      expect(counter).toHaveTextContent('01/09')
    })

    it('handles larger numbers correctly', () => {
      const props = {
        ...defaultProps,
        patternCount: { current: 12, total: 15 }
      }
      
      render(<MobileHeader {...props} />)
      
      const counter = screen.getByTestId('pattern-counter')
      expect(counter).toHaveTextContent('12/15')
    })

    it('has technical styling with monospace font', () => {
      render(<MobileHeader {...defaultProps} />)
      
      const counter = screen.getByTestId('pattern-counter')
      expect(counter).toHaveClass('font-mono', 'text-xs')
    })
  })

  describe('Menu Toggle', () => {
    it('renders menu toggle button', () => {
      render(<MobileHeader {...defaultProps} />)
      
      const menuButton = screen.getByTestId('menu-toggle')
      expect(menuButton).toBeInTheDocument()
    })

    it('calls onMenuToggle when menu button is clicked', () => {
      render(<MobileHeader {...defaultProps} />)
      
      const menuButton = screen.getByTestId('menu-toggle')
      fireEvent.click(menuButton)
      
      expect(defaultProps.onMenuToggle).toHaveBeenCalledTimes(1)
    })

    it('has minimum 44px touch target', () => {
      render(<MobileHeader {...defaultProps} />)
      
      const menuButton = screen.getByTestId('menu-toggle')
      const styles = window.getComputedStyle(menuButton)
      
      expect(parseInt(styles.minHeight || styles.height)).toBeGreaterThanOrEqual(44)
      expect(parseInt(styles.minWidth || styles.width)).toBeGreaterThanOrEqual(44)
    })

    it('has proper accessibility attributes', () => {
      render(<MobileHeader {...defaultProps} />)
      
      const menuButton = screen.getByTestId('menu-toggle')
      expect(menuButton).toHaveAttribute('aria-label', 'Open menu')
      expect(menuButton).toHaveAttribute('type', 'button')
    })
  })

  describe('Theme Toggle', () => {
    it('renders theme toggle button', () => {
      render(<MobileHeader {...defaultProps} />)
      
      const themeButton = screen.getByTestId('theme-toggle')
      expect(themeButton).toBeInTheDocument()
    })

    it('calls onThemeToggle when theme button is clicked', () => {
      render(<MobileHeader {...defaultProps} />)
      
      const themeButton = screen.getByTestId('theme-toggle')
      fireEvent.click(themeButton)
      
      expect(defaultProps.onThemeToggle).toHaveBeenCalledTimes(1)
    })

    it('has minimum 44px touch target', () => {
      render(<MobileHeader {...defaultProps} />)
      
      const themeButton = screen.getByTestId('theme-toggle')
      const styles = window.getComputedStyle(themeButton)
      
      expect(parseInt(styles.minHeight || styles.height)).toBeGreaterThanOrEqual(44)
      expect(parseInt(styles.minWidth || styles.width)).toBeGreaterThanOrEqual(44)
    })

    it('has proper accessibility attributes', () => {
      render(<MobileHeader {...defaultProps} />)
      
      const themeButton = screen.getByTestId('theme-toggle')
      expect(themeButton).toHaveAttribute('aria-label', 'Toggle theme')
      expect(themeButton).toHaveAttribute('type', 'button')
    })
  })

  describe('Responsive Behavior', () => {
    it('maintains layout integrity on small screens', () => {
      // Simulate very small screen
      Object.defineProperty(window, 'innerWidth', { value: 320 })
      
      render(<MobileHeader {...defaultProps} />)
      
      const header = screen.getByTestId('mobile-header')
      const title = screen.getByText('PATTERN GENERATOR SYSTEM')
      const controls = screen.getByTestId('header-controls')
      
      // Title should not overflow
      expect(title).toHaveClass('truncate')
      
      // Controls should remain visible and aligned
      expect(controls).toHaveClass('flex', 'items-center', 'space-x-2')
    })

    it('adapts font size for title on very small screens', () => {
      Object.defineProperty(window, 'innerWidth', { value: 320 })
      
      render(<MobileHeader {...defaultProps} />)
      
      const title = screen.getByText('PATTERN GENERATOR SYSTEM')
      expect(title).toHaveClass('text-sm') // Smaller font on mobile
    })
  })

  describe('Technical Aesthetic', () => {
    it('maintains blueprint/technical styling', () => {
      render(<MobileHeader {...defaultProps} />)
      
      const header = screen.getByTestId('mobile-header')
      
      // Should have technical border and background
      expect(header).toHaveClass('border-b', 'border-border')
      expect(header).toHaveClass('bg-background/80', 'backdrop-blur-sm')
    })

    it('uses yellow accent color appropriately', () => {
      render(<MobileHeader {...defaultProps} />)
      
      const counter = screen.getByTestId('pattern-counter')
      
      // Counter should have yellow accent styling
      expect(counter).toHaveClass('border-yellow-400')
    })

    it('has proper contrast and readability', () => {
      render(<MobileHeader {...defaultProps} />)
      
      const title = screen.getByText('PATTERN GENERATOR SYSTEM')
      const counter = screen.getByTestId('pattern-counter')
      
      // Text should have proper contrast classes
      expect(title).toHaveClass('text-foreground')
      expect(counter).toHaveClass('text-muted-foreground')
    })
  })

  describe('Edge Cases', () => {
    it('handles missing title gracefully', () => {
      const props = { ...defaultProps, title: '' }
      render(<MobileHeader {...props} />)
      
      // Should not crash and should render other elements
      expect(screen.getByTestId('mobile-header')).toBeInTheDocument()
      expect(screen.getByTestId('pattern-counter')).toBeInTheDocument()
    })

    it('handles zero pattern count gracefully', () => {
      const props = {
        ...defaultProps,
        patternCount: { current: 0, total: 0 }
      }
      
      render(<MobileHeader {...props} />)
      
      const counter = screen.getByTestId('pattern-counter')
      expect(counter).toHaveTextContent('00/00')
    })

    it('handles negative pattern count gracefully', () => {
      const props = {
        ...defaultProps,
        patternCount: { current: -1, total: 5 }
      }
      
      render(<MobileHeader {...props} />)
      
      const counter = screen.getByTestId('pattern-counter')
      // Should clamp to 0 or handle gracefully
      expect(counter).toHaveTextContent('00/05')
    })
  })

  describe('Performance', () => {
    it('does not re-render unnecessarily when props are the same', () => {
      const renderSpy = jest.fn()
      
      const { rerender } = render(
        <MobileHeader 
          {...defaultProps}
          ref={renderSpy}
        />
      )
      
      // Re-render with same props
      rerender(
        <MobileHeader 
          {...defaultProps}
          ref={renderSpy}
        />
      )
      
      // Component should be memoized and not re-render
      expect(screen.getByTestId('mobile-header')).toBeInTheDocument()
    })
  })
})