# Claude Development Context

This document provides context for AI assistants working on the Generative Pattern Generator System project.

## Project Overview

A Next.js-based showcase for real-time generative pattern visualizations with user-controllable parameters. Built as a learning platform for contemporary web development with AI assistance.

## Architecture

### Core System
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript with strict type safety
- **Styling**: Tailwind CSS with technical blueprint aesthetic
- **UI Components**: shadcn/ui component library

### Pattern Generator System
- **Plugin Architecture**: Modular, extensible pattern generator system
- **Common Interface**: All generators implement `PatternGeneratorProps`
- **Control System**: Real-time parameter adjustment via uniform/state controls
- **Rendering**: Mix of Canvas 2D and WebGL for optimal performance

## Current Pattern Generators

1. **Barcode Scanner** (`barcode-generator.tsx`)
   - Canvas 2D rendering with scrolling bars
   - Red scanning beam animation
   - No controls implemented yet

2. **Frequency Spectrum** (`frequency-spectrum-generator.tsx`)
   - Canvas 2D with gradient bars
   - Audio visualizer simulation
   - No controls implemented yet

3. **Noise Field** (`noise-field-generator.tsx`)
   - WebGL GLSL shader
   - 3D Simplex noise with time animation
   - No controls implemented yet

4. **Pixelated Noise** (`pixelated-noise-generator.tsx`)
   - Canvas 2D with retro pixel blocks
   - **✅ Full control panel implemented**
   - Controls: pixel size, noise scale, animation speed, color intensity, color schemes

5. **Brownian Motion** (`brownian-motion-generator.tsx`)
   - WebGL GLSL shader with particle simulation
   - **✅ Full control panel implemented**
   - Controls: particle count, speed, brightness, trail length, jitter amount

## Technical Implementation Details

### Pattern Generator Interface
```typescript
interface PatternGeneratorProps {
  width: number
  height: number
  className?: string
  controls?: PatternControl[]
  onControlChange?: (controlId: string, value: number | string | boolean) => void
}

interface PatternControl {
  id: string
  label: string
  type: 'range' | 'color' | 'checkbox' | 'select'
  min?: number
  max?: number
  step?: number
  defaultValue: number | string | boolean
  options?: { value: string | number; label: string }[]
}
```

### Adding New Pattern Generators
1. Create component in `components/pattern-generators/`
2. Implement `PatternGeneratorProps` interface
3. Add to exports in `components/pattern-generators/index.ts`
4. Follow existing patterns for control panel implementation

### Control Panel Architecture
- **Real-time updates**: Changes immediately affect the pattern
- **Technical aesthetic**: Monospace labels, yellow accents, technical styling
- **Type-safe**: Full TypeScript integration
- **Consistent layout**: 2-column grid with proper spacing

## Design System

### Visual Theme
- **Color Palette**: Grayscale with yellow (#FACC15) accents
- **Typography**: Monospace fonts, uppercase labels, technical styling
- **Layout**: Clean, minimal, blueprint-inspired design
- **Grid System**: Subtle grid overlays, technical annotations

### UI Components
- **Range Sliders**: Yellow accent color, real-time value display
- **Select Dropdowns**: Technical naming (e.g., "RETRO_PALETTE")
- **Technical Overlays**: Pattern type labels, rendering method indicators
- **Corner Markers**: Yellow L-shaped borders for pattern containers

## Performance Guidelines

### WebGL Patterns
- Use constant loop bounds in GLSL shaders
- Minimize uniform updates per frame
- Proper cleanup with `cancelAnimationFrame`
- Efficient vertex buffer management

### Canvas 2D Patterns
- Use `requestAnimationFrame` for 60fps animations
- Minimize canvas context operations
- Cache calculated values where possible
- Proper memory management

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Type checking
npm run build  # Next.js includes TypeScript checking

# Linting
npm run lint
```

## File Structure

```
components/
  pattern-generators/
    types.ts                    # Shared interfaces
    index.ts                    # Export all generators
    barcode-generator.tsx       # ✅ Implemented, needs controls
    frequency-spectrum-generator.tsx  # ✅ Implemented, needs controls  
    noise-field-generator.tsx   # ✅ Implemented, needs controls
    pixelated-noise-generator.tsx  # ✅ Implemented, ✅ controls
    brownian-motion-generator.tsx  # ✅ Implemented, ✅ controls
  ui/
    button.tsx                  # shadcn/ui button component
    checkbox.tsx                # shadcn/ui checkbox component
lib/
  simplex-noise.ts             # 3D Simplex noise implementation
  utils.ts                     # Utility functions
app/
  page.tsx                     # Main pattern showcase page
  layout.tsx                   # Root layout
  globals.css                  # Global styles
```

## Current Status & Next Steps

### ✅ Completed
- Basic pattern generator system
- Technical blueprint UI design
- Real-time control panels for 2 generators
- WebGL + Canvas 2D rendering pipeline
- Type-safe architecture
- Git repository setup

### 🔄 In Progress
- Adding control panels to remaining generators
- Expanding parameter options

### 📋 Future Enhancements
- Additional pattern generators
- Export/sharing capabilities
- Performance optimizations
- Mobile responsiveness improvements

## Development Notes

- **Code Style**: Prefer functional components with hooks
- **TypeScript**: Strict mode enabled, avoid `any` types
- **Performance**: Target 60fps for all animations
- **Accessibility**: Maintain keyboard navigation support
- **Browser Support**: Modern browsers with WebGL support

## AI Assistant Guidelines

When working on this project:
1. **Maintain consistency** with existing code patterns
2. **Follow the established architecture** for new generators
3. **Implement control panels** using the established pattern
4. **Ensure type safety** throughout all changes
5. **Test performance** for real-time parameter changes
6. **Keep technical aesthetic** in UI design choices

## Repository Information

- **GitHub**: https://github.com/aaronsbrown/gen_pattern_showcase.git
- **Branch**: `main`
- **License**: Not specified
- **Development**: Active, collaborative with AI assistance