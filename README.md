# Generative Pattern Generator System

A sophisticated, modular system for creating and displaying animated generative patterns built with Next.js 15+. This project serves as a showcase for real-time pattern generation, mathematical visualization, and a learning platform for contemporary web development with AI assistance.

## Features

### 🎨 Pattern Generator Collection (12 Total)

#### **Noise Patterns (2)**
- **Noise Field** - Flowing Perlin noise with customizable color modes and animation speed
- **Pixelated Noise** - Retro-style pixelated noise with customizable pixel size and color schemes

#### **Geometric Patterns (2)**
- **Trigonometric Circle** - Interactive unit circle demonstrating sine/cosine relationships
- **4-Pole Gradient** - Color interpolation between four corner poles with animation options

#### **Simulation Patterns (3)**
- **Brownian Motion** - Particles following random walk patterns with glowing trails (WebGL)
- **Advanced Particle System** - Sophisticated particle system with curl noise and physics (WebGL)
- **1D Cellular Automata** - One-dimensional cellular automaton exploring emergent complexity

#### **Strange Attractors (5)**
- **Lorenz Attractor** - Classic chaotic system with interactive 3D visualization (WebGL)
- **Thomas Attractor** - Cyclically symmetric strange attractor with sinusoidal dynamics (WebGL)
- **Aizawa Attractor** - Complex 6-parameter attractor with rich mathematical structure (WebGL)
- **Halvorsen Attractor** - Cyclically symmetric with quadratic nonlinear terms (WebGL)
- **Newton-Leipnik Attractor** - Butterfly-structured attractor with folding dynamics (WebGL)

### ⚡ Advanced Technical Features

#### **Multi-Technology Rendering**
- **Canvas 2D** - Optimized for smooth 2D patterns and cellular automata
- **WebGL 2.0** - Hardware-accelerated particle systems with thousands of particles
- **WebGL 3D Meshes** - True 3D interactive visualizations with camera controls
- **External Shader System** - GLSL shaders loaded dynamically for advanced effects

#### **Interactive 3D Visualization**
- **Mouse/Touch Camera Controls** - Orbit, pan, and zoom in 3D space
- **Auto-rotation** - Smooth automatic camera movement
- **Depth-based Coloring** - Visual depth cues with color gradients
- **Coordinate Axes** - Optional reference frame display

#### **Factory Preset System**
- **Curated Parameters** - Mathematically significant starting points
- **Educational Descriptions** - Mathematical significance explanations
- **Auto-import** - Factory presets loaded automatically on first use
- **Categories** - Classic, Bifurcation, Enhanced, and Variant presets

#### **Educational Content Integration**
- **Three-Layer Approach** - Intuitive, Conceptual, and Technical explanations
- **Mathematical Context** - Real-world connections and theoretical foundations
- **Interactive Learning** - Explore patterns while understanding the mathematics

### 🛠 Tech Stack
- **Framework:** Next.js 15+ with App Router and Turbopack
- **Language:** TypeScript with strict type safety
- **Styling:** Tailwind CSS v4 with technical blueprint aesthetic
- **UI Components:** shadcn/ui component library
- **3D Graphics:** Three.js with React Three Fiber
- **WebGL:** Custom shader system with external GLSL files
- **Testing:** Jest with React Testing Library (unit, integration, behavioral)
- **Storybook:** Component development and documentation
- **Performance:** 60fps target with platform-aware optimization

## Getting Started

```bash
# Install dependencies
npm install

# Run development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm run test

# Run Storybook component development
npm run storybook
```

Open [http://localhost:3000](http://localhost:3000) to view the pattern generator showcase.

## Architecture

### Rich Pattern Generator Interface
```typescript
interface PatternGeneratorProps {
  width: number
  height: number
  className?: string
  controls?: PatternControl[]
  onControlChange?: (controlId: string, value: number | string | boolean) => void
}

interface RichPatternGeneratorDefinition {
  id: string
  name: string
  component: React.ComponentType<PatternGeneratorProps>
  technology: 'CANVAS_2D' | 'WEBGL_2D' | 'WEBGL_MESHES'
  category: 'Noise' | 'Geometric' | 'Simulation' | 'Data Visualization' | 'Attractors'
  controls: RichPatternControlDefinition[]
  semantics: PatternSemantics
  performance: PerformanceCharacteristics
  // ... extensive metadata for intelligent features
}
```

### Adding New Patterns

1. **Create Pattern Component**: Implement in `components/pattern-generators/`
2. **Define Rich Metadata**: Use `RichPatternGeneratorDefinition` with semantic metadata
3. **Add to Category File**: Export from appropriate category file (noise-patterns.ts, etc.)
4. **Create Educational Content**: Add `public/educational-content/{patternId}.md`
5. **Add Factory Presets**: Include mathematically significant parameter sets
6. **WebGL Patterns**: Create external shader files in `public/shaders/`

Example:
```tsx
export default function MyGenerator({ width, height, className, controls, onControlChange }: PatternGeneratorProps) {
  // Canvas 2D, WebGL 2.0, or WebGL 3D implementation
  return <canvas ref={canvasRef} width={width} height={height} className={className} />
}
```

### Project Structure

```
src/
├── components/
│   ├── pattern-generators/
│   │   ├── noise-patterns.ts           # Noise-based patterns
│   │   ├── geometric-patterns.ts       # Mathematical shapes and gradients
│   │   ├── simulation-patterns.ts      # Physics and cellular automata
│   │   ├── attractor-patterns/         # Strange attractors (WebGL 3D)
│   │   │   └── index.ts
│   │   └── index.ts                    # Main pattern registry
│   ├── ui/                             # shadcn/ui components
│   ├── desktop/                        # Desktop-specific layouts
│   └── mobile/                         # Mobile-optimized components
├── lib/
│   ├── semantic-types.ts               # Rich metadata type definitions
│   ├── shader-loader.ts                # External WebGL shader management
│   ├── preset-manager.ts               # Factory preset system
│   └── simplex-noise.ts                # Custom 3D noise implementation
public/
├── shaders/
│   ├── vertex/                         # WebGL vertex shaders (.vert)
│   └── fragment/                       # WebGL fragment shaders (.frag)
├── educational-content/                # Educational explanations (.md)
└── factory-presets.json               # Curated parameter sets
```

## Development Guidelines

### Performance Targets
- **60fps Animation** - All patterns maintain smooth frame rates
- **Platform Optimization** - Mobile-aware defaults and performance tuning
- **WebGL Acceleration** - Hardware rendering for complex visualizations
- **Memory Management** - Proper cleanup and resource management

### Architecture Principles
- **Rich Semantic Metadata** - Every pattern includes algorithm family, math concepts, and performance characteristics
- **Platform-Aware Defaults** - Controls adapt based on device capabilities
- **Educational Integration** - Three-layer learning approach (Intuitive → Conceptual → Technical)
- **Factory Preset System** - Curated mathematical starting points for exploration

## Educational Mission

This project serves as a comprehensive learning platform combining:

### **Mathematical Visualization**
- **Interactive Exploration** - Adjust parameters and see mathematical concepts come alive
- **Strange Attractors** - Explore chaos theory and dynamical systems through 3D visualization
- **Educational Content** - Three-layer explanations from intuitive to rigorous mathematical treatment

### **Contemporary Web Development**
- **AI-Assisted Development** - Collaborative coding with advanced AI systems
- **Modern React Patterns** - Hooks, functional components, and contemporary architectures
- **Performance Engineering** - 60fps targets with WebGL acceleration and platform optimization
- **Type-Safe Architecture** - Comprehensive TypeScript with rich semantic metadata

### **Technical Communication**
- **Clear Documentation** - Extensive inline comments and architectural notes
- **Component Isolation** - Storybook-driven development for better design systems
- **Test-Driven Quality** - Behavioral testing focused on user experience

## Development Workflow

### **Prerequisites**
- Node.js 18+ 
- Modern browser with WebGL 2.0 support
- Basic understanding of React and TypeScript

### **Branch Strategy**
- **Feature branches** for all development work
- **Comprehensive testing** before integration
- **AI-assisted code review** and quality assurance

### **Quality Assurance**
```bash
# Complete preflight checklist (required before commits)
npm run lint      # ESLint validation
npm run build     # TypeScript compilation and build verification  
npm run test      # Full test suite execution
npm run storybook # Component library verification
```

## Contributing

We welcome contributions that advance the educational and technical mission:

### **Pattern Generator Contributions**
- **Mathematical Significance** - Patterns should demonstrate interesting mathematical concepts
- **Rich Metadata** - Include comprehensive semantic metadata for intelligent features
- **Educational Content** - Provide three-layer explanations (Intuitive → Conceptual → Technical)
- **Performance Standards** - Maintain 60fps with proper cleanup and optimization

### **Technical Standards**
- **Type Safety** - Comprehensive TypeScript with strict mode
- **Semantic Architecture** - Rich metadata for intelligent pattern management
- **Platform Awareness** - Mobile-optimized defaults and responsive behavior
- **Educational Integration** - Connect mathematical concepts to interactive visualizations

### **Code Quality**
- **Clean Architecture** - Follow established patterns and conventions
- **Comprehensive Testing** - Unit, integration, and behavioral test coverage
- **Performance Optimization** - WebGL acceleration where appropriate
- **Documentation** - Clear inline comments and architectural notes
