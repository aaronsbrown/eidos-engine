// AIDEV-NOTE: Extracted pattern-specific control grouping logic from grouped-simulation-controls-panel.tsx
// This module contains all the pattern-specific grouping functions to organize controls into logical sections

import type { PatternControl } from '@/components/pattern-generators/types'

export interface ControlGroup {
  title: string
  controls: PatternControl[]
  defaultCollapsed?: boolean
}

/**
 * Main entry point for pattern-specific control grouping
 * Returns null if the pattern should use ungrouped layout
 */
export function getControlGroups(patternId: string, controls: PatternControl[]): ControlGroup[] | null {
  // Special case: cellular automaton always gets grouped for navigation layout
  if (patternId === 'cellular-automaton') {
    return groupCellularAutomatonControls(controls)
  }
  
  // If few controls, don't group them (except for patterns with special layouts)
  if (controls.length <= 6 && 
      patternId !== 'four-pole-gradient' && 
      patternId !== 'cellular-automaton') {
    return null
  }

  // Define grouping logic based on pattern ID
  switch (patternId) {
    case 'four-pole-gradient':
      return groupFourPoleGradientControls(controls)
    
    case 'particle-system':
      return groupParticleSystemControls(controls)
    
    case 'cellular-automaton':
      return groupCellularAutomatonControls(controls)
    
    default:
      // For unknown patterns, try generic grouping
      return tryGenericGrouping(controls)
  }
}

/**
 * Four-pole gradient pattern grouping
 * Creates specialized groups for pole colors, gradient properties, animation, noise, and display
 */
function groupFourPoleGradientControls(controls: PatternControl[]): ControlGroup[] {
  const groups: ControlGroup[] = []
  
  // Pole Colors group
  const poleColorControls = controls.filter(c => c.id.includes('pole') && c.id.includes('Color'))
  if (poleColorControls.length > 0) {
    groups.push({
      title: 'Pole Colors',
      controls: poleColorControls,
      defaultCollapsed: false
    })
  }

  // Gradient Properties
  const gradientControls = controls.filter(c => c.id === 'interpolationPower')
  if (gradientControls.length > 0) {
    groups.push({
      title: 'Gradient Properties',
      controls: gradientControls,
      defaultCollapsed: false
    })
  }

  // Animation Settings
  const animationControls = controls.filter(c => 
    c.id.includes('animation') || c.id.includes('Animation')
  )
  if (animationControls.length > 0) {
    groups.push({
      title: 'Animation Settings',
      controls: animationControls,
      defaultCollapsed: false
    })
  }

  // Noise Overlay
  const noiseControls = controls.filter(c => 
    c.id.includes('noise') || c.id.includes('Noise')
  )
  if (noiseControls.length > 0) {
    groups.push({
      title: 'Noise Overlay',
      controls: noiseControls,
      defaultCollapsed: true
    })
  }

  // Display
  const displayControls = controls.filter(c => 
    c.id.includes('show') || c.id.includes('Show') || c.id.includes('display')
  )
  if (displayControls.length > 0) {
    groups.push({
      title: 'Display',
      controls: displayControls,
      defaultCollapsed: true
    })
  }

  return groups
}

/**
 * Particle system pattern grouping
 * Creates groups for particle properties, physics, visual effects, and performance
 */
function groupParticleSystemControls(controls: PatternControl[]): ControlGroup[] {
  const groups: ControlGroup[] = []

  // Particle Properties
  const particleProps = controls.filter(c => 
    c.id.includes('particle') || c.id.includes('life') || c.id.includes('spawn')
  )
  if (particleProps.length > 0) {
    groups.push({
      title: 'Particle Properties',
      controls: particleProps,
      defaultCollapsed: false
    })
  }

  // Physics Settings
  const physicsControls = controls.filter(c => 
    c.id.includes('speed') || c.id.includes('gravity') || c.id.includes('curl')
  )
  if (physicsControls.length > 0) {
    groups.push({
      title: 'Physics Settings',
      controls: physicsControls,
      defaultCollapsed: false
    })
  }

  // Visual Effects
  const visualControls = controls.filter(c => 
    c.id.includes('brightness') || c.id.includes('trail') || c.id.includes('Trail')
  )
  if (visualControls.length > 0) {
    groups.push({
      title: 'Visual Effects',
      controls: visualControls,
      defaultCollapsed: false
    })
  }

  // Performance & Appearance (exclude reset buttons from grouping)
  const perfControls = controls.filter(c => 
    (c.id.includes('quality') || c.id.includes('color')) &&
    !c.id.includes('reset')
  )
  if (perfControls.length > 0) {
    groups.push({
      title: 'Performance & Appearance',
      controls: perfControls,
      defaultCollapsed: true
    })
  }

  return groups
}

/**
 * Cellular automaton pattern grouping
 * Creates groups for rule navigation and generation settings
 */
function groupCellularAutomatonControls(controls: PatternControl[]): ControlGroup[] {
  const groups: ControlGroup[] = []

  // Rule Navigation
  const navControls = controls.filter(c => 
    c.id.includes('rule') && (c.id.includes('Prev') || c.id.includes('Next'))
  )
  if (navControls.length > 0) {
    groups.push({
      title: 'Rule Navigation',
      controls: navControls,
      defaultCollapsed: false
    })
  }

  // Generation Settings (exclude reset buttons from grouping)
  const genControls = controls.filter(c => 
    (c.id.includes('cell') || c.id.includes('animation') || c.id.includes('initial')) &&
    !c.id.includes('reset') && !c.id.includes('trigger')
  )
  if (genControls.length > 0) {
    groups.push({
      title: 'Generation Settings',
      controls: genControls,
      defaultCollapsed: false
    })
  }

  // Note: Reset buttons are intentionally excluded from grouping and will render at bottom

  return groups
}

/**
 * Generic grouping for unknown patterns
 * Attempts to create logical groups based on common control patterns
 * Returns null if grouping doesn't provide meaningful organization
 */
function tryGenericGrouping(controls: PatternControl[]): ControlGroup[] | null {
  // For unknown patterns, try to create logical groups based on common patterns
  const groups: ControlGroup[] = []

  // Animation-related controls
  const animControls = controls.filter(c => 
    c.id.toLowerCase().includes('speed') || 
    c.id.toLowerCase().includes('animation') ||
    c.label.toLowerCase().includes('speed') ||
    c.label.toLowerCase().includes('animation')
  )

  // Color-related controls
  const colorControls = controls.filter(c => 
    c.type === 'color' || 
    c.id.toLowerCase().includes('color') ||
    c.label.toLowerCase().includes('color')
  )

  // Visual property controls (range controls that aren't animation)
  const visualControls = controls.filter(c => 
    c.type === 'range' && 
    !animControls.includes(c) &&
    !colorControls.includes(c)
  )

  // Settings and toggles
  const settingControls = controls.filter(c => 
    (c.type === 'checkbox' || c.type === 'select' || c.type === 'button') &&
    !colorControls.includes(c)
  )

  if (animControls.length > 0) {
    groups.push({
      title: 'Animation Settings',
      controls: animControls,
      defaultCollapsed: false
    })
  }

  if (visualControls.length > 0) {
    groups.push({
      title: 'Visual Properties',
      controls: visualControls,
      defaultCollapsed: false
    })
  }

  if (colorControls.length > 0) {
    groups.push({
      title: 'Appearance',
      controls: colorControls,
      defaultCollapsed: false
    })
  }

  if (settingControls.length > 0) {
    groups.push({
      title: 'Settings',
      controls: settingControls,
      defaultCollapsed: true
    })
  }

  // Only return groups if we successfully categorized most controls
  const categorizedCount = groups.reduce((sum, group) => sum + group.controls.length, 0)
  return categorizedCount >= controls.length * 0.8 ? groups : null
}