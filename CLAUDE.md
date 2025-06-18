# Claude Development Context

This document provides context for AI assistants working on the Generative Pattern Generator System project.

## Project Overview

A Next.js-based showcase for real-time generative pattern visualizations with user-controllable parameters. Built as a learning platform for contemporary web development with AI assistance.

---

## Non-negotiable golden rules

| #: | AI *may* do                                                            | AI *must NOT* do                                                                    |
|---|------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
| G-0 | Whenever unsure about something that's related to the project, ask the developer for clarification before making changes.    |  ❌ Write changes or use tools when you are not sure about something project specific, or if you don't have context for a particular feature/decision. |
| G-1 | Add/update **`AIDEV-NOTE:` anchor comments** near non-trivial edited code. | ❌ Delete or mangle existing `AIDEV-` comments.                                     |
| G-2 | For changes >300 LOC or >3 files, **ask for confirmation**.            | ❌ Refactor large modules without human guidance.                                     |
| G-3 | Stay within the current task context. Inform the dev if it'd be better to start afresh.     | ❌ Continue work from a prior prompt after "new task" – start a fresh session.      |

---

## Anchor comments

Add specially formatted comments throughout the codebase, where appropriate, for yourself as inline knowledge that can be easily `grep`ped for.

### Guidelines

- Use `AIDEV-NOTE:`, `AIDEV-TODO:`, or `AIDEV-QUESTION:` (all-caps prefix) for comments aimed at AI and developers.
- Keep them concise (≤ 120 chars).
- **Important:** Before scanning files, always first try to **locate existing anchors** `AIDEV-*` in relevant subdirectories.
- **Update relevant anchors** when modifying associated code.
- **Do not remove `AIDEV-NOTE`s** without explicit human instruction.
- Make sure to add relevant anchor comments, whenever a file or piece of code is:
  - too long, or
  - too complex, or
  - very important, or
  - confusing, or
  - could have a bug unrelated to the task you are currently working on.

Example:

```typescript
# AIDEV-NOTE: perf-hot-path; avoid extra allocations (see ADR-24)
export default function BarcodeGenerator...
    ...
```

---

## Git Workflow & Commit Discipline

### Branching Strategy

- **Always use feature branches** for development work (never commit directly to main)
- **Branch naming**: Use descriptive names like `feature/enhance-rar-testbench`, `fix/uart-timeout-bug`
- **Create branches early**: Before making any code changes
- **Single developer workflow**: Create feature branch → develop → test → merge to main

### Commit Standards

- **Granular commits**: One logical change per commit.
- **Tag AI-generated commits**: e.g., `feat: optimise feed query [AI]`.
- **Clear commit messages**: Explain the *why*; link to issues/ADRs if architectural.
- **Review AI-generated code**: Never merge code you don't understand.

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

## Development Notes

- **Code Style**: Prefer functional components with hooks
- **TypeScript**: Strict mode enabled, avoid `any` types
- **Performance**: Target 60fps for all animations
- **Accessibility**: Maintain keyboard navigation support
- **Browser Support**: Modern browsers with WebGL support

---

## AI Assistant Workflow: Step-by-Step Methodology

When responding to user instructions, the AI assistant (Claude, Cursor, GPT, etc.) should follow this process to ensure clarity, correctness, and maintainability:

1. **Consult Relevant Guidance**: When the user gives an instruction, consult the relevant files in the project directory to gather insight
2. **Clarify Ambiguities**: Based on what you could gather, see if there's any need for clarifications. If so, ask the user targeted questions before proceeding.
3. **Break Down & Plan**: Break down the task at hand and chalk out a rough plan for carrying it out, referencing project conventions and best practices.
4. **Create Feature Branch**: For any code changes, create a feature branch before starting work (never work directly on main)
5. **Trivial Tasks**: If the plan/request is trivial, go ahead and get started immediately.
6. **Non-Trivial Tasks**: Otherwise, present the plan to the user for review and iterate based on their feedback.
7. **Track Progress**: Use a to-do list (internally, or optionally in a `TODOS.md` file) to keep track of your progress on multi-step or complex tasks.
8. **If Stuck, Re-plan**: If you get stuck or blocked, return to step 3 to re-evaluate and adjust your plan.
9. **Update Documentation**: Once the user's request is fulfilled, update relevant anchor comments (`AIDEV-NOTE`, etc.) and `AGENTS.md` files in the files and directories you touched.
10. **User Review**: After completing the task, ask the user to review what you've done, and repeat the process as needed.
11. **Session Boundaries**: If the user's request isn't directly related to the current context and can be safely started in a fresh session, suggest starting from scratch to avoid context confusion.

---

## AI Assistant Guidelines: Project Specific

When working on this project:

1. **Maintain consistency** with existing code patterns
2. **Follow the established architecture** for new generators
3. **Implement control panels** using the established pattern
4. **Ensure type safety** throughout all changes
5. **Test performance** for real-time parameter changes
6. **Keep technical aesthetic** in UI design choices

## Repository Information

- **GitHub**: <https://github.com/aaronsbrown/gen_pattern_showcase.git>
- **Branch**: `main`
- **License**: Not specified
- **Development**: Active, collaborative with AI assistance
