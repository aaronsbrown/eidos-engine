// AIDEV-NOTE: Mobile-optimized pattern selector dropdown with search and touch-friendly interactions
// AIDEV-NOTE: Tests rewritten per G-8 to focus on user behavior vs implementation details
'use client'

import React, { useState, useRef, useEffect, memo, useMemo } from 'react'
import { ChevronDown, ChevronRight, Search } from 'lucide-react'
import type { MixedPatternGenerator } from '@/components/pattern-generators/types'
import { PatternCategoryManager, type PatternCategory } from '@/lib/pattern-category-manager'

export interface PatternDropdownSelectorProps {
  patterns: MixedPatternGenerator[]
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
  // AIDEV-NOTE: Category state management - track which categories are expanded
  const [expandedCategories, setExpandedCategories] = useState<Set<PatternCategory>>(new Set())
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const optionsRef = useRef<HTMLButtonElement[]>([])

  // Find selected pattern
  const selectedPattern = patterns.find(p => p.id === selectedId)
  
  // Initialize category manager
  const categoryManager = useMemo(() => new PatternCategoryManager(patterns), [patterns])
  
  // Initialize category expansion - expand all categories by default on mobile for discoverability
  useEffect(() => {
    if (expandedCategories.size === 0) {
      const allCategories = categoryManager.getCategories()
      setExpandedCategories(new Set(allCategories))
    }
  }, [categoryManager, expandedCategories.size])

  // Get categorized and filtered patterns
  const { categoryGroups, searchResults } = useMemo(() => {
    // If searching, use search functionality
    if (searchQuery.trim()) {
      const searchResults = categoryManager.searchPatterns(searchQuery)
      return { categoryGroups: [], searchResults }
    }

    // Otherwise, group by categories
    const categoryGroups = categoryManager.getCategoryGroups()
    return { categoryGroups, searchResults: [] }
  }, [categoryManager, searchQuery])

  // Get all patterns that should be visible (flattened for keyboard navigation)
  const visiblePatterns = useMemo(() => {
    if (searchQuery.trim()) {
      return searchResults
    }

    // Flatten visible patterns from expanded categories
    return categoryGroups.reduce<MixedPatternGenerator[]>((acc, group) => {
      if (expandedCategories.has(group.category)) {
        acc.push(...group.patterns)
      }
      return acc
    }, [])
  }, [searchQuery, searchResults, categoryGroups, expandedCategories])

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

  // Handle category expansion toggle
  const toggleCategory = (category: PatternCategory) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

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
          prev < visiblePatterns.length - 1 ? prev + 1 : 0
        )
        break
        
      case 'ArrowUp':
        event.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : visiblePatterns.length - 1
        )
        break
        
      case 'Enter':
        event.preventDefault()
        if (highlightedIndex >= 0 && visiblePatterns[highlightedIndex]) {
          handleSelect(visiblePatterns[highlightedIndex].id)
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
      aria-label="Select pattern generator"
    >
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={loading || patterns.length === 0}
        className="w-full min-h-[44px] bg-background border border-border rounded-md px-4 py-2 text-left mobile-typography-pattern md:text-sm focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-focus-ring disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between hover:border-muted-foreground transition-colors"
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
                  className="w-full pl-10 pr-4 py-2 mobile-typography-pattern md:text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-focus-ring"
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
            {searchQuery.trim() ? (
              // Search results - show flat list
              searchResults.length === 0 ? (
                <div className="px-4 py-8 text-center text-muted-foreground mobile-typography-pattern md:text-sm">
                  No patterns found
                </div>
              ) : (
                searchResults.map((pattern, index) => {
                  const isLastResult = index === searchResults.length - 1
                  return (
                    <button
                      key={pattern.id}
                      ref={(el) => {
                        if (el) optionsRef.current[index] = el
                      }}
                      type="button"
                      onClick={() => handleSelect(pattern.id)}
                      className={`w-full px-4 py-3 text-left hover:bg-muted focus:bg-muted focus:outline-none transition-colors ${
                        !isLastResult ? 'border-b border-border' : ''
                      } ${
                        pattern.id === selectedId ? 'bg-accent-primary-subtle dark:bg-accent-primary-subtle' : ''
                      } ${
                        index === highlightedIndex ? 'bg-muted' : ''
                      }`}
                    role="option"
                    aria-selected={pattern.id === selectedId}
                    data-selected={pattern.id === selectedId}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="mobile-typography-pattern md:text-sm font-medium text-foreground truncate">
                          {pattern.name}
                        </div>
                        <div className="mobile-typography-small md:text-xs text-muted-foreground mt-0.5">
                          {pattern.category}
                        </div>
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        <span className="inline-block px-2 py-1 mobile-typography-small md:text-xs bg-muted text-muted-foreground rounded">
                          {pattern.technology}
                        </span>
                      </div>
                    </div>
                    </button>
                  )
                })
              )
            ) : (
              // Category groups - show collapsible sections
              categoryGroups.length === 0 ? (
                <div className="px-4 py-8 text-center text-muted-foreground mobile-typography-pattern md:text-sm">
                  No patterns available
                </div>
              ) : (
                <div>
                  {categoryGroups.map((group, groupIndex) => {
                    const isExpanded = expandedCategories.has(group.category)
                    let patternIndex = 0
                    // Calculate running index for keyboard navigation
                    for (const prevGroup of categoryGroups) {
                      if (prevGroup.category === group.category) break
                      if (expandedCategories.has(prevGroup.category)) {
                        patternIndex += prevGroup.patterns.length
                      }
                    }

                    const isFirstCategory = groupIndex === 0
                    
                    return (
                      <div key={group.category}>
                        {/* Category Header */}
                        <button
                          type="button"
                          onClick={() => toggleCategory(group.category)}
                          className={`w-full px-4 py-3 text-left bg-muted hover:bg-muted/70 border-b border-border focus:outline-none focus:bg-muted/70 transition-colors ${
                            !isFirstCategory ? 'border-t border-border' : ''
                          }`}
                          aria-expanded={isExpanded}
                          aria-label={`${group.category} category, ${group.count} patterns`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <ChevronRight 
                                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                                  isExpanded ? 'rotate-90' : ''
                                }`}
                              />
                              <span className="mobile-typography-pattern md:text-sm font-medium text-foreground uppercase tracking-wider">
                                {group.category}
                              </span>
                            </div>
                            <span className="mobile-typography-small md:text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                              {group.count}
                            </span>
                          </div>
                        </button>

                        {/* Category Patterns */}
                        {isExpanded && (
                          <div>
                            {group.patterns.map((pattern, index) => {
                              const globalIndex = patternIndex + index
                              const isLastInCategory = index === group.patterns.length - 1
                              return (
                                <button
                                  key={pattern.id}
                                  ref={(el) => {
                                    if (el) optionsRef.current[globalIndex] = el
                                  }}
                                  type="button"
                                  onClick={() => handleSelect(pattern.id)}
                                  className={`w-full px-8 py-3 text-left hover:bg-muted focus:bg-muted focus:outline-none transition-colors ${
                                    !isLastInCategory ? 'border-b border-border' : ''
                                  } ${
                                    pattern.id === selectedId ? 'bg-accent-primary-subtle dark:bg-accent-primary-subtle border-l-2 border-l-accent-primary-strong dark:border-l-accent-primary' : 'border-l-2 border-l-transparent'
                                  } ${
                                    globalIndex === highlightedIndex ? 'bg-muted' : ''
                                  }`}
                                  role="option"
                                  aria-selected={pattern.id === selectedId}
                                  data-selected={pattern.id === selectedId}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                      <div className="mobile-typography-pattern md:text-sm font-medium text-foreground truncate">
                                        {pattern.name}
                                      </div>
                                    </div>
                                    <div className="ml-3 flex-shrink-0">
                                      <span className="inline-block px-2 py-1 mobile-typography-small md:text-xs bg-muted text-muted-foreground rounded">
                                        {pattern.technology}
                                      </span>
                                    </div>
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
})

export default PatternDropdownSelector