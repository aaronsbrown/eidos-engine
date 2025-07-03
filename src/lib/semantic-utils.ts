// AIDEV-NOTE: Utility functions for working with semantic pattern metadata

import type { RichPatternGeneratorDefinition, RichPatternControlDefinition } from './semantic-types'
import { hasSemanticMetadata } from './semantic-types'

/**
 * Get the appropriate default value for a control based on platform
 */
export function getPlatformDefaultValue(
  control: RichPatternControlDefinition,
  platform: 'mobile' | 'desktop'
): number | string | boolean {
  const platformRec = control.defaultRecommendations?.platformSpecific
  
  if (platformRec && platformRec[platform] !== undefined) {
    return platformRec[platform]!
  }
  
  return control.defaultValue
}

/**
 * Get the appropriate default value for a control based on performance
 */
export function getPerformanceDefaultValue(
  control: RichPatternControlDefinition,
  performanceLevel: 'low' | 'high'
): number | string | boolean {
  const perfRec = control.defaultRecommendations?.performanceConsideration
  
  if (perfRec) {
    return performanceLevel === 'low' ? perfRec.lowPerformance : perfRec.highPerformance
  }
  
  return control.defaultValue
}

/**
 * Get controls that significantly impact performance
 */
export function getPerformanceImpactingControls(
  pattern: RichPatternGeneratorDefinition
): RichPatternControlDefinition[] {
  if (!pattern.controls) return []
  
  return pattern.controls.filter(control => 
    control.impactsPerformance === 'Significant' || 
    control.impactsPerformance === 'Moderate'
  )
}

/**
 * Get educational resources for a pattern
 */
export function getEducationalResources(
  pattern: RichPatternGeneratorDefinition
): Array<{ title: string; url?: string; type: string }> {
  return pattern.educationalLinks || []
}

/**
 * Find patterns by mathematical concept
 */
export function findPatternsByMathConcept(
  patterns: RichPatternGeneratorDefinition[],
  concept: string
): RichPatternGeneratorDefinition[] {
  return patterns.filter(pattern =>
    hasSemanticMetadata(pattern) &&
    pattern.semantics.keyMathematicalConcepts.some(c => c === concept)
  )
}

/**
 * Get performance warning message for a pattern
 */
export function getPerformanceWarning(
  pattern: RichPatternGeneratorDefinition
): string | null {
  if (pattern.performance.computationalComplexity === 'VeryHigh') {
    return `This pattern is computationally intensive. ${pattern.performance.notes || 'Consider reducing quality settings on slower devices.'}`
  }
  
  if (pattern.performance.computationalComplexity === 'High') {
    return pattern.performance.notes || null
  }
  
  return null
}

/**
 * Get grouped controls by their semantic group
 */
export function getGroupedControls(
  controls: RichPatternControlDefinition[]
): Record<string, RichPatternControlDefinition[]> {
  const groups: Record<string, RichPatternControlDefinition[]> = {}
  
  controls.forEach(control => {
    const group = control.group || 'Other'
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(control)
  })
  
  return groups
}

/**
 * Get a human-readable description of a control's impact
 */
export function getControlImpactDescription(
  control: RichPatternControlDefinition
): string {
  const impactMap = {
    'Negligible': 'No noticeable performance impact',
    'Minor': 'Minimal performance impact',
    'Moderate': 'May affect performance on slower devices',
    'Significant': 'Considerable performance impact - adjust with care'
  }
  
  return impactMap[control.impactsPerformance]
}

/**
 * Check if a pattern is suitable for mobile devices
 */
export function isMobileFriendly(pattern: RichPatternGeneratorDefinition): boolean {
  const complexity = pattern.performance.computationalComplexity
  
  // Patterns with very high complexity are not mobile-friendly
  if (complexity === 'VeryHigh') return false
  
  // Check if any controls have mobile-specific warnings
  const hasProblematicControls = pattern.controls?.some(control => {
    const mobileDefault = control.defaultRecommendations?.platformSpecific?.mobile
    const desktopDefault = control.defaultRecommendations?.platformSpecific?.desktop
    
    // If mobile default is false but desktop is true, it's problematic
    return mobileDefault === false && desktopDefault === true
  })
  
  return !hasProblematicControls
}

/**
 * Get related patterns for exploration
 */
export function getRelatedPatterns(
  pattern: RichPatternGeneratorDefinition,
  allPatterns: RichPatternGeneratorDefinition[]
): RichPatternGeneratorDefinition[] {
  const related: RichPatternGeneratorDefinition[] = []
  
  // Direct relations
  if (pattern.relatedPatterns) {
    pattern.relatedPatterns.forEach(id => {
      const relatedPattern = allPatterns.find(p => p.id === id)
      if (relatedPattern && hasSemanticMetadata(relatedPattern)) {
        related.push(relatedPattern)
      }
    })
  }
  
  // Same algorithm family
  const sameFamily = allPatterns.filter(p => 
    hasSemanticMetadata(p) &&
    p.id !== pattern.id &&
    p.semantics.primaryAlgorithmFamily === pattern.semantics.primaryAlgorithmFamily
  )
  
  // Combine and deduplicate
  const combined = [...related, ...sameFamily]
  return Array.from(new Set(combined.map(p => p.id)))
    .map(id => combined.find(p => p.id === id)!)
}

// AIDEV-NOTE: Educational content utility functions for querying patterns by educational metadata
/**
 * Get all patterns that have educational content
 */
export function getPatternsWithEducationalContent(
  patterns: RichPatternGeneratorDefinition[]
): RichPatternGeneratorDefinition[] {
  return patterns.filter(pattern =>
    hasSemanticMetadata(pattern) && 
    pattern.semantics.educationalContent !== undefined
  )
}

/**
 * Find patterns by educational content ID
 */
export function findPatternsByEducationalContentId(
  patterns: RichPatternGeneratorDefinition[],
  contentId: string
): RichPatternGeneratorDefinition[] {
  return patterns.filter(pattern =>
    hasSemanticMetadata(pattern) &&
    pattern.semantics.educationalContent?.contentId === contentId
  )
}

/**
 * Get patterns that cross-reference a specific pattern's educational content
 */
export function getEducationalCrossReferences(
  patterns: RichPatternGeneratorDefinition[],
  targetPatternId: string
): RichPatternGeneratorDefinition[] {
  return patterns.filter(pattern =>
    hasSemanticMetadata(pattern) &&
    pattern.semantics.educationalContent?.crossReferences?.includes(targetPatternId)
  )
}

/**
 * Find patterns by related concept
 */
export function findPatternsByRelatedConcept(
  patterns: RichPatternGeneratorDefinition[],
  concept: string
): RichPatternGeneratorDefinition[] {
  return patterns.filter(pattern =>
    hasSemanticMetadata(pattern) &&
    pattern.semantics.educationalContent?.relatedConcepts?.includes(concept)
  )
}

/**
 * Get all unique educational content IDs from patterns
 */
export function getAllEducationalContentIds(
  patterns: RichPatternGeneratorDefinition[]
): string[] {
  const contentIds = patterns
    .filter(pattern => hasSemanticMetadata(pattern) && pattern.semantics.educationalContent)
    .map(pattern => pattern.semantics.educationalContent!.contentId)
  
  return Array.from(new Set(contentIds))
}

/**
 * Get all unique related concepts from patterns
 */
export function getAllRelatedConcepts(
  patterns: RichPatternGeneratorDefinition[]
): string[] {
  const concepts = patterns
    .filter(pattern => hasSemanticMetadata(pattern) && pattern.semantics.educationalContent)
    .flatMap(pattern => pattern.semantics.educationalContent!.relatedConcepts || [])
  
  return Array.from(new Set(concepts))
}

/**
 * Build educational content network - returns a map of pattern IDs to their cross-references
 */
export function buildEducationalContentNetwork(
  patterns: RichPatternGeneratorDefinition[]
): Record<string, string[]> {
  const network: Record<string, string[]> = {}
  
  patterns.forEach(pattern => {
    if (hasSemanticMetadata(pattern) && pattern.semantics.educationalContent) {
      network[pattern.id] = pattern.semantics.educationalContent.crossReferences || []
    }
  })
  
  return network
}