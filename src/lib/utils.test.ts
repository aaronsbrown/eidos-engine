// AIDEV-NOTE: Utility function tests - cn function for className merging with clsx and tailwind-merge
import { cn } from './utils'

describe('Utils', () => {
  describe('cn function', () => {
    it('merges class names correctly', () => {
      const result = cn('px-4', 'py-2', 'bg-blue-500')
      expect(result).toBe('px-4 py-2 bg-blue-500')
    })

    it('handles conditional classes', () => {
      const result = cn('base-class', true && 'conditional-class', false && 'hidden-class')
      expect(result).toBe('base-class conditional-class')
    })

    it('handles empty inputs', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('handles null and undefined inputs', () => {
      const result = cn('valid-class', null, undefined, 'another-class')
      expect(result).toBe('valid-class another-class')
    })

    it('handles object-style class inputs', () => {
      const result = cn({
        'active': true,
        'disabled': false,
        'primary': true
      })
      expect(result).toBe('active primary')
    })

    it('merges conflicting Tailwind classes correctly (twMerge functionality)', () => {
      // twMerge should handle conflicting classes by keeping the last one
      const result = cn('px-4 px-8', 'py-2 py-4')
      expect(result).toBe('px-8 py-4')
    })

    it('handles array inputs', () => {
      const result = cn(['class1', 'class2'], ['class3', 'class4'])
      expect(result).toBe('class1 class2 class3 class4')
    })

    it('combines clsx and tailwind-merge functionality', () => {
      const isActive = true
      const size = 'large'
      
      const result = cn(
        'base-class',
        'px-2 px-4', // conflicting classes - should resolve to px-4
        {
          'active': isActive,
          'inactive': !isActive
        },
        size === 'large' && 'text-lg',
        ['additional', 'classes']
      )
      
      expect(result).toContain('base-class')
      expect(result).toContain('px-4')
      expect(result).not.toContain('px-2')
      expect(result).toContain('active')
      expect(result).not.toContain('inactive')
      expect(result).toContain('text-lg')
      expect(result).toContain('additional')
      expect(result).toContain('classes')
    })

    it('handles complex Tailwind class conflicts', () => {
      const result = cn(
        'bg-red-500 bg-blue-500', // background colors
        'text-sm text-lg', // text sizes
        'p-4 px-8' // padding conflicts
      )
      
      // Should keep the last of each conflicting group
      expect(result).toContain('bg-blue-500')
      expect(result).not.toContain('bg-red-500')
      expect(result).toContain('text-lg')
      expect(result).not.toContain('text-sm')
      expect(result).toContain('px-8')
      expect(result).toContain('p-4') // p-4 might be kept for y-axis padding
    })

    it('preserves non-conflicting classes', () => {
      const result = cn(
        'flex items-center justify-between',
        'rounded-md shadow-sm',
        'hover:bg-gray-100 focus:outline-none'
      )
      
      expect(result).toBe('flex items-center justify-between rounded-md shadow-sm hover:bg-gray-100 focus:outline-none')
    })
  })
})