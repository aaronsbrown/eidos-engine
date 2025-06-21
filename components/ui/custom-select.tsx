'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string | number
  label: string
}

interface CustomSelectProps {
  id?: string
  value: string | number
  options: SelectOption[]
  onChange: (value: string | number) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function CustomSelect({
  id,
  value,
  options,
  onChange,
  placeholder = 'Select option...',
  disabled = false,
  className = ''
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const optionsRef = useRef<HTMLButtonElement[]>([])

  // Find selected option
  const selectedOption = options.find(option => option.value === value)
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen])

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setIsOpen(true)
      }
      return
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault()
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
        
      case 'ArrowDown':
        event.preventDefault()
        setHighlightedIndex(prev => 
          prev < options.length - 1 ? prev + 1 : 0
        )
        break
        
      case 'ArrowUp':
        event.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : options.length - 1
        )
        break
        
      case 'Enter':
        event.preventDefault()
        if (highlightedIndex >= 0 && options[highlightedIndex]) {
          handleSelect(options[highlightedIndex].value)
        }
        break
    }
  }

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && optionsRef.current[highlightedIndex]) {
      optionsRef.current[highlightedIndex].scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  }, [highlightedIndex])

  const handleSelect = (optionValue: string | number) => {
    onChange(optionValue)
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  const handleToggle = () => {
    if (disabled) return
    setIsOpen(!isOpen)
  }

  return (
    <div 
      ref={dropdownRef}
      className={`relative ${className}`}
    >
      {/* Select Trigger - matches pattern dropdown styling exactly */}
      <button
        id={id}
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="w-full min-h-[44px] bg-background border border-border rounded-md px-4 py-2 text-left font-mono text-xs focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between hover:border-muted-foreground transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        role="combobox"
      >
        <span className="truncate text-foreground">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg max-h-[40vh] overflow-hidden"
          role="listbox"
        >
          {/* Options List */}
          <div 
            className="max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {options.length === 0 ? (
              <div className="px-4 py-3 text-center text-muted-foreground font-mono text-xs">
                No options available
              </div>
            ) : (
              options.map((option, index) => (
                <button
                  key={option.value}
                  ref={(el) => {
                    if (el) optionsRef.current[index] = el
                  }}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-4 py-3 text-left hover:bg-muted focus:bg-muted focus:outline-none transition-colors font-mono text-xs ${
                    option.value === value ? 'bg-yellow-50 dark:bg-yellow-950/20' : ''
                  } ${
                    index === highlightedIndex ? 'bg-muted' : ''
                  }`}
                  role="option"
                  aria-selected={option.value === value}
                >
                  <span className="text-foreground">
                    {option.label}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}