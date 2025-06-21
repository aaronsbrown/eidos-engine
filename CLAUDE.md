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
| G-4 | **NEVER** merge feature branches to main without explicit approval.    | ❌ Merge feature branches, even if "working state" - always ask for approval first. |
| G-5 | **Main UI features MUST be implemented via TDD**. Write tests first, then implement. | ❌ Implement main UI features without tests. Note: Visualizations don't need pixel-level verification, focus on React app behavior. |
| G-6 | **Create implementation notes for significant enhancements**. Document in `docs/implementation_notes/ISSUE_N_IMPLEMENTATION_SUMMARY.md`. | ❌ Skip documentation for major features, architectural changes, or complex integrations. |
| G-7 | **Before refactoring UI components, audit ALL pattern-specific special cases**. Each pattern may have unique layouts, behaviors, or controls that must be preserved. | ❌ Refactor UI components without cataloging existing pattern-specific customizations. This leads to lost functionality. |
| G-8 | **TDD tests MUST focus on user behavior, not implementation details**. Test what users can do (select patterns, change values) not how it's implemented (CSS classes, DOM structure, exact HTML elements). | ❌ Write brittle tests that assert implementation details like specific CSS classes, DOM structure, or element types. These break when refactoring and waste enormous development time. |

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
- **Single developer workflow**: Create feature branch → develop → test → **get approval** → merge to main
- **🚨 CRITICAL**: **NEVER merge feature branches to main without explicit developer approval**
- **Merging protocol**: Always ask "Should I merge this feature branch to main?" before executing merge commands

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
5. For WebGL generators, use external shader loading system

### Shader Loading System (Issue #14)

**External Shader Architecture:**
- **Shader files** stored in `shaders/vertex/` and `shaders/fragment/`
- **Dynamic loading** via `loadShader()` utility function
- **Type-safe uniforms** with TypeScript definitions
- **TouchDesigner import** workflow for external shader integration

**Implementation Pattern:**
```typescript
import { loadShader, createShaderProgram } from "@/lib/shader-loader"

// Load external shaders
const shaderProgram = await loadShader('shader-name')
const program = createShaderProgram(gl, shaderProgram.vertex, shaderProgram.fragment)
```

**Benefits:**
- GLSL syntax highlighting in external `.frag` and `.vert` files
- Improved maintainability and code organization
- Easy TouchDesigner shader imports
- Hot reload support during development
- Shader reusability across multiple generators

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

- **External shaders**: Use `loadShader()` for shader management
- **Constant loop bounds**: GLSL shaders must use compile-time constants
- **Uniform optimization**: Minimize uniform updates per frame
- **Proper cleanup**: `cancelAnimationFrame` and shader program deletion
- **Efficient buffers**: Vertex buffer management and reuse
- **Type safety**: Use shader type definitions from `lib/shader-types.ts`

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

## Implementation Notes Documentation

### When to Create Implementation Notes

Following Golden Rule G-6, create comprehensive implementation documentation for:

- ✅ **New features** (enhancements that add significant functionality)
- ✅ **Major architectural changes** (refactoring that affects multiple components)  
- ✅ **Complex integrations** (new patterns, external APIs, performance optimizations)
- ✅ **Accessibility improvements** (significant UX/accessibility enhancements)

**Do NOT create implementation notes for:**
- ❌ Bug fixes (unless they require architectural changes)
- ❌ Small refactorings (single file, minor improvements)
- ❌ Documentation updates or dependency updates

### Documentation Process

1. **During Planning**: Create design documents in `docs/implementation_notes/`
2. **During Implementation**: Follow TDD or documented approaches
3. **Upon Completion**: Create `ISSUE_N_IMPLEMENTATION_SUMMARY.md` with:
   - Problem/solution overview
   - Technical implementation details
   - Testing approach and coverage
   - User experience impact
   - Future considerations

### Documentation Location

- **Directory**: `docs/implementation_notes/`
- **Primary Document**: `ISSUE_N_IMPLEMENTATION_SUMMARY.md`
- **Supporting Documents**: `ISSUE_N_[DESCRIPTIVE_NAME].md`

**Example**: Issue #19 (Collapsible Control Panels)
- `docs/implementation_notes/ISSUE_19_IMPLEMENTATION_SUMMARY.md`
- `docs/implementation_notes/ISSUE_19_CONTROL_GROUPS_DESIGN.md`

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
    brownian-motion-generator.tsx  # ✅ Implemented, ✅ controls, ✅ external shaders
  ui/
    button.tsx                  # shadcn/ui button component
    checkbox.tsx                # shadcn/ui checkbox component
    collapsible-control-group.tsx  # ✅ Collapsible control groups (Issue #19)
    viewport-constrained-panel.tsx # ✅ Viewport height management (Issue #19) 
    grouped-simulation-controls-panel.tsx # ✅ Enhanced controls panel (Issue #19)
lib/
  shader-loader.ts             # External shader loading utility
  shader-types.ts              # TypeScript definitions for shaders
  simplex-noise.ts             # 3D Simplex noise implementation
  utils.ts                     # Utility functions
shaders/
  vertex/
    fullscreen-quad.vert        # Common vertex shader for full-screen effects
  fragment/
    brownian-motion.frag        # Brownian motion particle system shader
  touchdesigner-imports/
    README.md                   # TouchDesigner import workflow guide
    example-td-shader.frag      # Example converted TouchDesigner shader
public/
  shaders/                      # Static shader files served by Next.js
app/
  page.tsx                     # Main pattern showcase page
  layout.tsx                   # Root layout
  globals.css                  # Global styles
docs/
  implementation_notes/
    README.md                   # Documentation standards and index
    ISSUE_19_IMPLEMENTATION_SUMMARY.md # Issue #19 comprehensive documentation
    ISSUE_19_CONTROL_GROUPS_DESIGN.md  # Issue #19 design decisions
```

---

## Development Notes

- **Code Style**: Prefer functional components with hooks
- **TypeScript**: Strict mode enabled, avoid `any` types
- **Performance**: Target 60fps for all animations
- **Accessibility**: Maintain keyboard navigation support
- **Browser Support**: Modern browsers with WebGL support

---

## Pattern-Specific Refactoring Guidelines

As the number of pattern generators increases, each will likely develop unique UI requirements, layouts, and behaviors. This section documents lessons learned from Issue #19 refactoring.

### **Critical Pre-Refactoring Steps**

Before refactoring any UI component that handles multiple patterns:

1. **🔍 Audit ALL existing special cases**:
   ```bash
   # Search for pattern-specific code
   rg "patternId.*===|if.*pattern.*===" components/
   rg "switch.*patternId|case.*'" components/
   ```

2. **📋 Create preservation checklist**:
   - Document each pattern's unique layouts (e.g., 2x2 color grids, compact navigation)
   - Note special control behaviors (e.g., button interactions, state management)  
   - Identify custom styling or positioning

3. **🧪 Write preservation tests FIRST**:
   ```typescript
   it('preserves four-pole gradient 2x2 color layout', () => { ... })
   it('preserves cellular automaton compact navigation', () => { ... })
   ```

4. **👁️ Visual regression verification**: Before and after screenshots for each pattern

### **Common Pattern Specializations**

Based on current codebase patterns:

- **Four-Pole Gradient**: 2x2 color picker grid layout
- **Cellular Automaton**: Compact prev/next navigation with rule display  
- **Particle Systems**: Reset buttons must remain prominently accessible
- **Future patterns**: Will likely require similar unique layouts

### **Refactoring Anti-Patterns to Avoid**

❌ **Generic-first thinking**: Focusing on new architecture before preserving existing functionality  
❌ **Reactive discovery**: Finding special cases only when reported as bugs  
❌ **Missing preservation tests**: Only testing new functionality, not existing behaviors  
❌ **Grouping essential controls**: Hiding reset buttons or primary actions in collapsible groups

### **Success Patterns**

✅ **Preservation-first approach**: Ensure 100% existing functionality before adding features  
✅ **Explicit special case handling**: Clear conditional logic for pattern-specific needs  
✅ **Accessible primary actions**: Keep reset buttons and critical controls ungrouped  
✅ **Comprehensive testing**: Both new features AND preserved behaviors

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
3. **Use external shader loading** for WebGL-based pattern generators
4. **Implement control panels** using the established pattern
5. **Ensure type safety** throughout all changes (including shader uniforms)
6. **Test performance** for real-time parameter changes (60fps target)
7. **Keep technical aesthetic** in UI design choices
8. **Add AIDEV-NOTE comments** for significant architectural changes
9. **Update CLAUDE.md** when implementing major system enhancements

## Repository Information

- **GitHub**: <https://github.com/aaronsbrown/gen_pattern_showcase.git>
- **Branch**: `main`
- **License**: Not specified
- **Development**: Active, collaborative with AI assistance
