// AIDEV-NOTE: Filter controls for semantic admin page - Issue #44 Phase 5
'use client'

import { useMemo } from 'react'
import type { RichPatternGeneratorDefinition } from '@/lib/semantic-types'

interface FilterState {
  algorithmFamily: string
  complexity: string
  category: string
  status: string
  mobileFriendly: string
}

interface SemanticFiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  patterns: RichPatternGeneratorDefinition[]
}

export default function SemanticFilters({ filters, onFilterChange, patterns }: SemanticFiltersProps) {
  // Extract unique values for filters
  const filterOptions = useMemo(() => {
    const algorithmFamilies = new Set<string>()
    const complexities = new Set<string>()
    const categories = new Set<string>()
    const statuses = new Set<string>()

    patterns.forEach(pattern => {
      algorithmFamilies.add(pattern.semantics.primaryAlgorithmFamily)
      complexities.add(pattern.performance.computationalComplexity)
      categories.add(pattern.category)
      statuses.add(pattern.status)
    })

    return {
      algorithmFamilies: Array.from(algorithmFamilies).sort(),
      complexities: ['Low', 'Medium', 'High', 'VeryHigh'],
      categories: Array.from(categories).sort(),
      statuses: Array.from(statuses).sort()
    }
  }, [patterns])

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value
    })
  }

  return (
    <div className="mb-8 p-6 border border-border rounded-lg bg-background/50">
      <h2 className="text-lg font-mono font-semibold uppercase tracking-wider mb-4 text-accent-primary-strong">
        Filters
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Algorithm Family */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-muted-foreground mb-2">
            Algorithm Family
          </label>
          <select
            value={filters.algorithmFamily}
            onChange={(e) => handleFilterChange('algorithmFamily', e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
          >
            <option value="all">All</option>
            {filterOptions.algorithmFamilies.map(family => (
              <option key={family} value={family}>{family}</option>
            ))}
          </select>
        </div>

        {/* Complexity */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-muted-foreground mb-2">
            Complexity
          </label>
          <select
            value={filters.complexity}
            onChange={(e) => handleFilterChange('complexity', e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
          >
            <option value="all">All</option>
            {filterOptions.complexities.map(complexity => (
              <option key={complexity} value={complexity}>{complexity}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-muted-foreground mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
          >
            <option value="all">All</option>
            {filterOptions.categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-muted-foreground mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
          >
            <option value="all">All</option>
            {filterOptions.statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Mobile Friendly */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-muted-foreground mb-2">
            Mobile Friendly
          </label>
          <select
            value={filters.mobileFriendly}
            onChange={(e) => handleFilterChange('mobileFriendly', e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
          >
            <option value="all">All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => onFilterChange({
          algorithmFamily: 'all',
          complexity: 'all',
          category: 'all',
          status: 'all',
          mobileFriendly: 'all'
        })}
        className="mt-4 px-4 py-2 bg-accent-primary-strong text-background font-mono text-xs uppercase tracking-wide rounded hover:bg-accent-primary transition-colors"
      >
        Reset Filters
      </button>
    </div>
  )
}