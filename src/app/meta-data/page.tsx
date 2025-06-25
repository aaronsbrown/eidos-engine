// AIDEV-NOTE: Internal admin page for viewing and filtering semantic metadata - Issue #44 Phase 5
'use client'

import { useState, useMemo } from 'react'
import { patternGenerators } from '@/components/pattern-generators'
import { hasSemanticMetadata } from '@/lib/semantic-types'
import type { RichPatternGeneratorDefinition } from '@/lib/semantic-types'
import SemanticDataTable from '@/components/meta-data/semantic-data-table'
import SemanticFilters from '@/components/meta-data/semantic-filters'

export default function AdminPage() {
  const [filters, setFilters] = useState({
    algorithmFamily: 'all',
    complexity: 'all',
    category: 'all',
    status: 'all',
    mobileFriendly: 'all'
  })

  // Get all patterns with semantic metadata
  const semanticPatterns = useMemo(() => {
    return patternGenerators.filter(hasSemanticMetadata) as RichPatternGeneratorDefinition[]
  }, [])

  // Apply filters
  const filteredPatterns = useMemo(() => {
    return semanticPatterns.filter(pattern => {
      if (filters.algorithmFamily !== 'all' && pattern.semantics.primaryAlgorithmFamily !== filters.algorithmFamily) {
        return false
      }
      if (filters.complexity !== 'all' && pattern.performance.computationalComplexity !== filters.complexity) {
        return false
      }
      if (filters.category !== 'all' && pattern.category !== filters.category) {
        return false
      }
      if (filters.status !== 'all' && pattern.status !== filters.status) {
        return false
      }
      if (filters.mobileFriendly !== 'all') {
        const hasMobileIssues = pattern.controls?.some(control => {
          if ('defaultRecommendations' in control) {
            const platformRec = control.defaultRecommendations?.platformSpecific
            return platformRec?.mobile === false && platformRec?.desktop === true
          }
          return false
        })
        const isMobileFriendly = pattern.performance.computationalComplexity !== 'VeryHigh' && !hasMobileIssues
        
        if (filters.mobileFriendly === 'yes' && !isMobileFriendly) return false
        if (filters.mobileFriendly === 'no' && isMobileFriendly) return false
      }
      return true
    })
  }, [semanticPatterns, filters])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-mono font-bold uppercase tracking-wider text-accent-primary-strong">
            Semantic Metadata Admin
          </h1>
          <p className="mt-2 text-sm text-muted-foreground font-mono">
            Internal view of pattern generator semantic data
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="border border-border rounded-lg p-4 bg-background/50">
            <div className="text-2xl font-mono font-bold text-accent-primary-strong">
              {semanticPatterns.length}
            </div>
            <div className="text-xs font-mono uppercase text-muted-foreground mt-1">
              Total Patterns
            </div>
          </div>
          <div className="border border-border rounded-lg p-4 bg-background/50">
            <div className="text-2xl font-mono font-bold text-accent-primary-strong">
              {filteredPatterns.length}
            </div>
            <div className="text-xs font-mono uppercase text-muted-foreground mt-1">
              Filtered Results
            </div>
          </div>
          <div className="border border-border rounded-lg p-4 bg-background/50">
            <div className="text-2xl font-mono font-bold text-accent-primary-strong">
              {semanticPatterns.filter(p => p.status === 'Production').length}
            </div>
            <div className="text-xs font-mono uppercase text-muted-foreground mt-1">
              Production Ready
            </div>
          </div>
          <div className="border border-border rounded-lg p-4 bg-background/50">
            <div className="text-2xl font-mono font-bold text-accent-primary-strong">
              {semanticPatterns.filter(p => {
                const hasMobileIssues = p.controls?.some(c => 
                  'defaultRecommendations' in c && 
                  c.defaultRecommendations?.platformSpecific?.mobile === false
                )
                return p.performance.computationalComplexity !== 'VeryHigh' && !hasMobileIssues
              }).length}
            </div>
            <div className="text-xs font-mono uppercase text-muted-foreground mt-1">
              Mobile Friendly
            </div>
          </div>
        </div>

        {/* Filters */}
        <SemanticFilters 
          filters={filters}
          onFilterChange={setFilters}
          patterns={semanticPatterns}
        />

        {/* Data Table */}
        <SemanticDataTable patterns={filteredPatterns} />
      </div>
    </div>
  )
}