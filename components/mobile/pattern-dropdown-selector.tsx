// AIDEV-NOTE: Mobile-optimized pattern selector dropdown with search and touch-friendly interactions
'use client'

import React, { useState, useRef, useEffect, memo, useMemo } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import type { PatternGenerator } from '@/components/pattern-generators/types'

export interface PatternDropdownSelectorProps {
  patterns: PatternGenerator[]
  selectedId: string
  onSelect: (patternId: string) => void
  searchable?: boolean
  loading?: boolean
  className?: string
}

const PatternDropdownSelector = memo(function PatternDropdownSelector({
  patterns,
  selectedId,
  onSelect,
  searchable = true,
  loading = false,
  className = ''
}: PatternDropdownSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const optionsRef = useRef<HTMLButtonElement[]>([])

  // Find selected pattern
  const selectedPattern = patterns.find(p => p.id === selectedId)
  
  // Filter patterns based on search query
  const filteredPatterns = useMemo(() => {
    if (!searchQuery.trim()) return patterns
    
    const query = searchQuery.toLowerCase()
    return patterns.filter(pattern => 
      pattern.name.toLowerCase().includes(query) ||
      pattern.id.toLowerCase().includes(query) ||
      pattern.technology.toLowerCase().includes(query)
    )
  }, [patterns, searchQuery])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
        setHighlightedIndex(-1)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
      
      // Prevent body scroll when dropdown is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, searchable])

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
        setSearchQuery('')
        setHighlightedIndex(-1)
        break
        
      case 'ArrowDown':
        event.preventDefault()
        setHighlightedIndex(prev => 
          prev < filteredPatterns.length - 1 ? prev + 1 : 0
        )
        break
        
      case 'ArrowUp':
        event.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredPatterns.length - 1
        )
        break
        
      case 'Enter':
        event.preventDefault()
        if (highlightedIndex >= 0 && filteredPatterns[highlightedIndex]) {
          handleSelect(filteredPatterns[highlightedIndex].id)
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

  const handleSelect = (patternId: string) => {
    onSelect(patternId)
    setIsOpen(false)
    setSearchQuery('')
    setHighlightedIndex(-1)
  }

  const handleToggle = () => {
    if (loading || patterns.length === 0) return
    setIsOpen(!isOpen)
  }

  // Display text based on state
  const getDisplayText = () => {
    if (loading) return 'Loading patterns...'
    if (patterns.length === 0) return 'No patterns available'
    if (!selectedPattern) return 'Select pattern...'
    return selectedPattern.name
  }

  return (
    <div 
      ref={dropdownRef}
      className={`relative ${className}`}
      data-testid="pattern-dropdown-selector"
    >
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={loading || patterns.length === 0}
        className="w-full min-h-[44px] bg-background border border-border rounded-md px-4 py-2 text-left font-mono text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between hover:border-muted-foreground transition-colors"
        aria-label="Select pattern generator"
        aria-expanded={isOpen}
        aria-controls="pattern-options-listbox"
        aria-haspopup="listbox"
        role="combobox"
      >
        <span className="truncate text-foreground">
          {getDisplayText()}
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
          data-testid="dropdown-panel"
          data-prevent-scroll="true"
          id="pattern-options-listbox"
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg max-h-[60vh] overflow-hidden"
          role="listbox"
          aria-label="Pattern generator options"
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setHighlightedIndex(-1)
                  }}
                  placeholder="Search patterns..."
                  className="w-full pl-10 pr-4 py-2 font-mono text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  aria-label="Search patterns"
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div 
            className="max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {filteredPatterns.length === 0 ? (
              <div className="px-4 py-8 text-center text-muted-foreground font-mono text-sm">
                No patterns found
              </div>
            ) : (
              filteredPatterns.map((pattern, index) => (
                <button
                  key={pattern.id}
                  ref={(el) => {
                    if (el) optionsRef.current[index] = el
                  }}
                  type="button"
                  onClick={() => handleSelect(pattern.id)}
                  className={`w-full px-4 py-3 text-left hover:bg-muted focus:bg-muted focus:outline-none transition-colors ${
                    pattern.id === selectedId ? 'bg-yellow-50 dark:bg-yellow-950/20' : ''
                  } ${
                    index === highlightedIndex ? 'bg-muted' : ''
                  }`}
                  role="option"
                  aria-selected={pattern.id === selectedId}
                  data-selected={pattern.id === selectedId}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-sm font-medium text-foreground truncate">
                        {pattern.name}
                      </div>
                      <div className="font-mono text-xs text-muted-foreground mt-0.5">
                        {pattern.id}
                      </div>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <span className="inline-block px-2 py-1 text-xs font-mono bg-muted text-muted-foreground rounded">
                        {pattern.technology}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
})

export default PatternDropdownSelector