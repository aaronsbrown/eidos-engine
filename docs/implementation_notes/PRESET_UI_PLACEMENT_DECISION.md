# Preset UI Placement Decision - Issue #16 Phase 2

## Context
After implementing the core preset system functionality in Phase 1, we evaluated three UX/UI placement options for preset controls to determine the optimal user experience.

## Options Evaluated

### Option 1: Current (In Sidebar)
- **Location**: Top of control panels in right sidebar
- **Pros**: Integrated with existing controls
- **Cons**: Competes for sidebar space with pattern controls, can get buried

### Option 2: Toolbar Above Canvas
- **Location**: Horizontal toolbar strip between header and canvas
- **Pros**: Always visible, dedicated space, quick access
- **Cons**: Takes up vertical space, adds UI complexity

### Option 3: Integrated Floating Panel
- **Location**: Button in header area (replacing decorative "REAL_TIME" text)
- **Pros**: Uses existing UI real estate, maximum sidebar space for controls, discoverable but unobtrusive
- **Cons**: Requires extra click to access presets

## Decision: Integrated Floating Panel (Option 3)

**Rationale:**
- Preserves maximum sidebar space for pattern controls (primary workflow)
- Replaces decorative UI element with functional one
- Maintains clean, uncluttered interface
- Fits existing technical aesthetic
- Presets are important but secondary to pattern manipulation

## Implementation Specs

### Desktop Implementation
- **Button Location**: Header area, right side, where "REAL_TIME" decorative text currently appears
- **Button Style**: 
  - Text: "PRESETS" (no icons)
  - Background: Primary accent yellow (#FACC15)
  - Border: Slightly darker yellow (#E5B614)
  - Font: Monospace, bold, small size to match existing header elements
- **Behavior**: Click opens floating preset panel overlay
- **Panel**: Modal-style overlay with existing TempPresetControls component

### Mobile/Tablet
- Deferred to future iteration
- Focus on desktop experience first

## Files to Modify
1. `components/desktop/desktop-layout.tsx` - Add PRESETS button to header
2. `components/ui/floating-preset-panel.tsx` - Create modal overlay component
3. Update existing preset control integration to use floating approach

## Visual Reference
See `public/preset-layout-demo.html` for visual comparison of all three options with the selected approach highlighted.

## Next Steps
1. Implement PRESETS button in desktop header
2. Create floating preset panel component
3. Integrate with existing preset system hooks
4. Test user workflow and refine as needed

---
**Status**: Design approved, ready for implementation  
**Phase**: Issue #16 Phase 2 - UI Implementation  
**Focus**: Desktop only  
**Date**: 2025-01-24