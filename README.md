# Generative Pattern Generator System

A modular, extensible system for creating and displaying animated generative patterns built with Next.js 14+. This project serves as a showcase for real-time pattern generation and a learning platform for contemporary web development with AI assistance.

## Features

### 🎨 Built-in Pattern Generators
- **Barcode Scanner** - Animated vertical lines with scanning effects
- **Audio Frequency Spectrum** - Realistic frequency bars with beat effects
- **2D Noise Field** - Smooth flowing organic patterns using 3D Simplex noise
- **Pixelated Noise** - Retro 8x8 pixel blocks with vintage color palettes

### ⚡ Technical Highlights
- **60fps Animations** - Smooth real-time rendering using `requestAnimationFrame`
- **Canvas-based Rendering** - Pixel-perfect control with HTML5 Canvas API
- **Plugin Architecture** - Easy to add new generators with consistent interface
- **TypeScript** - Full type safety throughout the codebase
- **Modern React** - Hooks, functional components, and contemporary patterns

### 🛠 Tech Stack
- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Animation:** Custom 60fps canvas rendering
- **Noise Generation:** Custom 3D Simplex noise implementation

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the pattern generator showcase.

## Architecture

### Pattern Generator Interface
```typescript
interface PatternGeneratorProps {
  width: number
  height: number
  className?: string
}

interface PatternGenerator {
  id: string
  name: string
  component: React.ComponentType<PatternGeneratorProps>
}
```

### Adding New Patterns

1. Create a new component in `components/pattern-generators/`
2. Implement the `PatternGeneratorProps` interface
3. Add your generator to the exports in `components/pattern-generators/index.ts`

Example:
```tsx
export default function MyGenerator({ width, height, className }: PatternGeneratorProps) {
  // Your pattern implementation
  return <canvas ref={canvasRef} width={width} height={height} />
}
```

### Project Structure

```
components/
  pattern-generators/
    types.ts                    # Shared interfaces
    barcode-generator.tsx       # Individual generators
    frequency-spectrum-generator.tsx
    noise-field-generator.tsx
    pixelated-noise-generator.tsx
    index.ts                    # Export all generators
lib/
  simplex-noise.ts             # Shared 3D Simplex noise implementation
  utils.ts                     # Utility functions
```

## Development Notes

- All pattern generators use canvas rendering for optimal performance
- Animation loops use `requestAnimationFrame` for smooth 60fps animations
- Proper cleanup is implemented with `useEffect` return functions
- The Simplex noise implementation is dependency-free and optimized

## Goals

This project serves multiple learning objectives:
- Partnering effectively with AI for development
- Learning contemporary web development patterns
- Practicing clear art direction and technical communication
- Building modular, extensible systems

## Contributing

New pattern generators are welcome! Follow the existing architecture and ensure:
- Consistent interface implementation
- Proper animation cleanup
- 60fps performance targets
- Clear, documented code
