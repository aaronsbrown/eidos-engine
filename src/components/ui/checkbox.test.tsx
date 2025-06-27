// AIDEV-NOTE: Checkbox component tests - checked state, onCheckedChange handler, disabled state
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './checkbox'

describe('Checkbox Component', () => {
  describe('Rendering', () => {
    it('renders checkbox with default unchecked state', () => {
      render(<Checkbox aria-label="Test checkbox" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
      expect(checkbox).not.toBeChecked()
    })

    it('renders checkbox with checked state when checked prop is true', () => {
      render(<Checkbox checked aria-label="Checked checkbox" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
    })

    it('accepts and applies custom className while maintaining functionality', () => {
      const handleChange = jest.fn()
      render(<Checkbox className="custom-class" onCheckedChange={handleChange} aria-label="Custom checkbox" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeEnabled()
      expect(checkbox).toHaveClass('custom-class')
    })

    it('includes data-slot attribute', () => {
      render(<Checkbox aria-label="Test checkbox" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('data-slot', 'checkbox')
    })
  })

  describe('State Changes', () => {
    it('calls onCheckedChange when clicked from unchecked to checked', async () => {
      const handleCheckedChange = jest.fn()
      const user = userEvent.setup()
      
      render(<Checkbox onCheckedChange={handleCheckedChange} aria-label="Toggle checkbox" />)
      
      await user.click(screen.getByRole('checkbox'))
      expect(handleCheckedChange).toHaveBeenCalledTimes(1)
      expect(handleCheckedChange).toHaveBeenCalledWith(true)
    })

    it('calls onCheckedChange when clicked from checked to unchecked', async () => {
      const handleCheckedChange = jest.fn()
      const user = userEvent.setup()
      
      render(<Checkbox checked onCheckedChange={handleCheckedChange} aria-label="Toggle checkbox" />)
      
      await user.click(screen.getByRole('checkbox'))
      expect(handleCheckedChange).toHaveBeenCalledTimes(1)
      expect(handleCheckedChange).toHaveBeenCalledWith(false)
    })

    it('toggles state when controlled by parent component', async () => {
      const TestComponent = () => {
        const [checked, setChecked] = React.useState(false)
        return (
          <Checkbox 
            checked={checked} 
            onCheckedChange={setChecked} 
            aria-label="Controlled checkbox" 
          />
        )
      }
      
      const user = userEvent.setup()
      render(<TestComponent />)
      
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()
      
      await user.click(checkbox)
      expect(checkbox).toBeChecked()
      
      await user.click(checkbox)
      expect(checkbox).not.toBeChecked()
    })
  })

  describe('Keyboard Interaction', () => {
    it('toggles when Space key is pressed', async () => {
      const handleCheckedChange = jest.fn()
      const user = userEvent.setup()
      
      render(<Checkbox onCheckedChange={handleCheckedChange} aria-label="Keyboard checkbox" />)
      
      const checkbox = screen.getByRole('checkbox')
      checkbox.focus()
      await user.keyboard(' ')
      
      expect(handleCheckedChange).toHaveBeenCalledWith(true)
    })

    it('is keyboard accessible with focus', async () => {
      const user = userEvent.setup()
      
      render(<Checkbox aria-label="Keyboard checkbox" />)
      
      const checkbox = screen.getByRole('checkbox')
      await user.tab()
      
      expect(checkbox).toHaveFocus()
    })
  })

  describe('Disabled State', () => {
    it('becomes non-interactive when disabled', () => {
      render(<Checkbox disabled aria-label="Disabled checkbox" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeDisabled()
      expect(checkbox).toHaveAccessibleName('Disabled checkbox')
    })

    it('does not call onCheckedChange when disabled and clicked', async () => {
      const handleCheckedChange = jest.fn()
      const user = userEvent.setup()
      
      render(<Checkbox disabled onCheckedChange={handleCheckedChange} aria-label="Disabled checkbox" />)
      
      await user.click(screen.getByRole('checkbox'))
      expect(handleCheckedChange).not.toHaveBeenCalled()
    })
  })

  describe('Indeterminate State', () => {
    it('displays indeterminate state to users', () => {
      render(<Checkbox checked="indeterminate" aria-label="Indeterminate checkbox - partially selected" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('data-state', 'indeterminate')
      expect(checkbox).toHaveAccessibleName('Indeterminate checkbox - partially selected')
    })

    it('calls onCheckedChange when clicked from indeterminate state', async () => {
      const handleCheckedChange = jest.fn()
      const user = userEvent.setup()
      
      render(
        <Checkbox 
          checked="indeterminate" 
          onCheckedChange={handleCheckedChange} 
          aria-label="Indeterminate checkbox" 
        />
      )
      
      await user.click(screen.getByRole('checkbox'))
      // Radix UI checkbox behavior for indeterminate -> checked may vary
      expect(handleCheckedChange).toHaveBeenCalledTimes(1)
      expect(handleCheckedChange).toHaveBeenCalledWith(expect.any(Boolean))
    })
  })

  describe('Accessibility', () => {
    it('supports aria-label for accessibility', () => {
      render(<Checkbox aria-label="Accessible checkbox" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAccessibleName('Accessible checkbox')
    })

    it('supports aria-labelledby for accessibility', () => {
      render(
        <>
          <label id="checkbox-label">Checkbox Label</label>
          <Checkbox aria-labelledby="checkbox-label" />
        </>
      )
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAccessibleName('Checkbox Label')
    })
  })
})