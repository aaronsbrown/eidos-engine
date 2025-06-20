# Control Groups Design for Pattern Generators

## Overview
This document outlines the logical groupings for pattern generator controls to improve viewport height management and user experience.

## Pattern-Specific Control Groupings

### 1. Barcode Scanner (6 controls)
- **Animation Settings** (2 controls)
  - Scroll Speed
  - Scanner Speed
- **Visual Properties** (2 controls)  
  - Bar Density
  - Scanner Opacity
- **Appearance** (2 controls)
  - Color Scheme
  - Show Scanner

### 2. Frequency Spectrum (6 controls)
- **Visual Properties** (3 controls)
  - Bar Width
  - Intensity
  - Bass Boost
- **Animation Settings** (1 control)
  - Update Speed
- **Appearance** (2 controls)
  - Color Scheme
  - Glow Effects

### 3. Noise Field (5 controls)
- **Noise Properties** (2 controls)
  - Noise Scale
  - Animation Speed
- **Visual Enhancement** (2 controls)
  - Contrast
  - Brightness
- **Appearance** (1 control)
  - Color Mode

### 4. Pixelated Noise (5 controls)
- **Pixel Properties** (2 controls)
  - Pixel Size
  - Noise Scale
- **Animation Settings** (1 control)
  - Animation Speed
- **Visual Enhancement** (1 control)
  - Color Intensity
- **Appearance** (1 control)
  - Color Scheme

### 5. Brownian Motion (5 controls)
- **Particle Properties** (2 controls)
  - Particle Count
  - Brownian Jitter
- **Motion Settings** (2 controls)
  - Speed
  - Trail Length
- **Visual Enhancement** (1 control)
  - Brightness

### 6. Trigonometric Circle (1 control)
- **Animation Settings** (1 control)
  - Animation Speed

### 7. Advanced Particle System (14 controls) - **MOST COMPLEX**
- **Particle Properties** (5 controls)
  - Particle Count
  - Life Expectancy
  - Life Variation
  - Particle Size
  - Spawn Rate
- **Physics Settings** (3 controls)
  - Movement Speed
  - Curl Strength
  - Gravity
- **Visual Effects** (3 controls)
  - Brightness
  - Enable Trails
  - Trail Decay
- **Performance & Appearance** (3 controls)
  - Trail Quality
  - Color Palette
  - Reset Simulation

### 8. Cellular Automaton (6 controls)
- **Rule Navigation** (2 controls)
  - ← PREV
  - NEXT →
- **Generation Settings** (3 controls)
  - Cell Size
  - Generation Speed
  - Initial Condition
- **Controls** (1 control)
  - Reset Automaton

### 9. 4-Pole Gradient (13 controls) - **MOST COMPLEX**
- **Pole Colors** (4 controls)
  - Pole 1 Color
  - Pole 2 Color
  - Pole 3 Color
  - Pole 4 Color
- **Gradient Properties** (1 control)
  - Interpolation Power
- **Animation Settings** (3 controls)
  - Animation Enabled
  - Animation Speed
  - Animation Pattern
- **Noise Overlay** (4 controls)
  - Noise Overlay
  - Noise Intensity
  - Noise Scale
  - Noise Type
- **Display** (1 control)
  - Show Pole Indicators

## Common Control Group Categories

Based on analysis, these are the most common logical groupings:

1. **Animation Settings** - Speed, enabled/disabled, patterns
2. **Visual Properties** - Size, density, intensity, brightness
3. **Appearance** - Color schemes, visual effects, show/hide elements
4. **Particle Properties** - Count, size, life expectancy (for particle systems)
5. **Physics Settings** - Movement, gravity, forces (for physics simulations)
6. **Noise Properties** - Scale, intensity, type (for noise-based patterns)
7. **Performance & Controls** - Quality settings, reset buttons
8. **Navigation** - Previous/next buttons for rule-based systems

## Priority Patterns for Implementation

1. **Four-Pole Gradient** (13 controls) - Most complex, biggest viewport impact
2. **Advanced Particle System** (14 controls) - Most controls overall
3. **Barcode Scanner** (6 controls) - Medium complexity, good test case
4. **Brownian Motion** (5 controls) - Existing implementation, good baseline

## Implementation Strategy

1. Start with collapsible groups, default state should be **expanded** for patterns with ≤6 controls
2. For patterns with >6 controls, use smart defaults:
   - Primary interaction groups (Animation, Visual Properties) → **expanded**
   - Secondary groups (Appearance, Performance) → **collapsed**
3. Groups with single controls should remain ungrouped for simplicity
4. Button controls (Reset, Navigation) should be easily accessible

## Technical Considerations

- Preserve existing control rendering logic
- Maintain type safety with `PatternControl[]` interface
- Groups should be collapsible/expandable with smooth animations
- Keyboard accessibility (Enter/Space to toggle, arrow keys to navigate)
- Viewport height constraints for entire control panel
- Scrolling within control panel container only