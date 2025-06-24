import type { MixedPatternGenerator } from '@/components/pattern-generators/types'

export type PatternCategory = 'Noise' | 'Geometric' | 'Simulation' | 'Data Visualization'

export interface CategoryGroup {
  category: PatternCategory
  patterns: MixedPatternGenerator[]
  count: number
}

// AIDEV-NOTE: Manages pattern categorization and filtering for desktop/mobile UI navigation
export class PatternCategoryManager {
  private patterns: MixedPatternGenerator[]

  constructor(patterns: MixedPatternGenerator[]) {
    this.patterns = patterns
  }

  /**
   * Get all unique categories present in the pattern collection
   */
  getCategories(): PatternCategory[] {
    const categories = new Set(this.patterns.map(p => p.category))
    return Array.from(categories).sort()
  }

  /**
   * Group patterns by category with counts
   */
  getCategoryGroups(): CategoryGroup[] {
    const categories = this.getCategories()
    return categories.map(category => {
      const patterns = this.patterns.filter(p => p.category === category)
      return {
        category,
        patterns,
        count: patterns.length
      }
    })
  }

  /**
   * Get patterns for a specific category
   */
  getPatternsByCategory(category: PatternCategory): MixedPatternGenerator[] {
    return this.patterns.filter(p => p.category === category)
  }

  /**
   * Get the category of a specific pattern by ID
   */
  getPatternCategory(patternId: string): PatternCategory | undefined {
    const pattern = this.patterns.find(p => p.id === patternId)
    return pattern?.category
  }

  /**
   * Get the first pattern ID in a specific category (for navigation)
   */
  getFirstPatternInCategory(category: PatternCategory): string | undefined {
    const patterns = this.getPatternsByCategory(category)
    return patterns[0]?.id
  }

  /**
   * Get category boundaries for desktop paging navigation
   * Returns array of pattern indices where categories change
   */
  getCategoryBoundaries(): Array<{ index: number; category: PatternCategory }> {
    const boundaries: Array<{ index: number; category: PatternCategory }> = []
    let currentCategory = this.patterns[0]?.category

    this.patterns.forEach((pattern, index) => {
      if (pattern.category !== currentCategory) {
        boundaries.push({ index, category: pattern.category })
        currentCategory = pattern.category
      }
    })

    // Always include first pattern as boundary
    if (this.patterns.length > 0) {
      boundaries.unshift({ index: 0, category: this.patterns[0].category })
    }

    return boundaries
  }

  /**
   * Find next category boundary from current pattern index
   */
  getNextCategoryBoundary(currentIndex: number): number | undefined {
    const boundaries = this.getCategoryBoundaries()
    const nextBoundary = boundaries.find(b => b.index > currentIndex)
    return nextBoundary?.index
  }

  /**
   * Find previous category boundary from current pattern index
   */
  getPreviousCategoryBoundary(currentIndex: number): number | undefined {
    const boundaries = this.getCategoryBoundaries()
    const previousBoundaries = boundaries.filter(b => b.index < currentIndex)
    return previousBoundaries[previousBoundaries.length - 1]?.index
  }

  /**
   * Get pattern index by ID for navigation purposes
   */
  getPatternIndex(patternId: string): number {
    return this.patterns.findIndex(p => p.id === patternId)
  }

  /**
   * Filter patterns by search term (name or category)
   */
  searchPatterns(searchTerm: string): MixedPatternGenerator[] {
    const term = searchTerm.toLowerCase()
    return this.patterns.filter(pattern => 
      pattern.name.toLowerCase().includes(term) ||
      pattern.category.toLowerCase().includes(term)
    )
  }
}