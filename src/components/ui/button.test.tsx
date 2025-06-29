// AIDEV-NOTE: COMPONENT_TEST - Button component rendering, onClick, disabled state, and variant/size props
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('renders with default appearance and accessibility', () => {
      render(<Button>Default Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeEnabled()
      expect(button).toBeVisible()
      expect(button).toHaveTextContent('Default Button')
    })

    it('applies custom className', () => {
      render(<Button className="custom-class">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })
  })

  describe('Click Handling', () => {
    it('calls onClick handler when clicked', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={handleClick}>Click me</Button>)
      
      await user.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('passes event object to onClick handler', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={handleClick}>Click me</Button>)
      
      await user.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object))
    })
  })

  describe('Disabled State', () => {
    it('becomes disabled and non-interactive when disabled prop is true', () => {
      render(<Button disabled>Disabled Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveTextContent('Disabled Button')
    })

    it('does not call onClick when disabled', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<Button disabled onClick={handleClick}>Disabled Button</Button>)
      
      await user.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Variants', () => {
    it('renders all variants as functional buttons', () => {
      const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const
      
      variants.forEach(variant => {
        const { unmount } = render(<Button variant={variant}>{variant} Button</Button>)
        const button = screen.getByRole('button')
        expect(button).toBeInTheDocument()
        expect(button).toBeEnabled()
        expect(button).toHaveTextContent(`${variant} Button`)
        unmount()
      })
    })

    it('destructive variant maintains button functionality', () => {
      const handleClick = jest.fn()
      render(<Button variant="destructive" onClick={handleClick}>Delete</Button>)
      const button = screen.getByRole('button', { name: 'Delete' })
      expect(button).toBeEnabled()
      // Test that it's still clickable despite being visually different
    })
  })

  describe('Sizes', () => {
    it('renders all sizes as functional buttons with proper text content', () => {
      const sizes = [['sm', 'Small'], ['default', 'Default'], ['lg', 'Large'], ['icon', '×']] as const
      
      sizes.forEach(([size, text]) => {
        const { unmount } = render(<Button size={size}>{text}</Button>)
        const button = screen.getByRole('button')
        expect(button).toBeInTheDocument()
        expect(button).toBeEnabled()
        expect(button).toHaveTextContent(text)
        unmount()
      })
    })

    it('icon size button remains accessible for screen readers', () => {
      render(<Button size="icon" aria-label="Close dialog">×</Button>)
      const button = screen.getByRole('button', { name: 'Close dialog' })
      expect(button).toBeEnabled()
      expect(button).toHaveAttribute('aria-label', 'Close dialog')
    })
  })

  describe('AsChild Prop', () => {
    it('renders as child component when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      )
      
      const link = screen.getByRole('link', { name: 'Link Button' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/test')
    })
  })

  describe('Data Attributes', () => {
    it('includes data-slot attribute', () => {
      render(<Button>Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-slot', 'button')
    })
  })
})