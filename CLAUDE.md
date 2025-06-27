# Claude Development Context

This document provides context for AI assistants working on the Generative Pattern Generator System project.

## Table of Contents

- [Quick Reference](#quick-reference)
- [Golden Rules](#golden-rules)
- [Project Overview](#project-overview)
- [Git Workflow](#git-workflow)
- [Architecture & Implementation](#architecture--implementation)
- [Development Guidelines](#development-guidelines)
- [AI Assistant Workflow](#ai-assistant-workflow)
- [Appendix](#appendix)

---

## Quick Reference

### 🚨 Critical Rules

- **G-0**: Ask for clarification when unsure about project-specific decisions
- **G-4**: **NEVER** merge feature branches without explicit approval
- **G-5**: Main UI features MUST have behavioral tests (follow UI Development Workflow)
- **G-7**: Audit ALL pattern-specific special cases before UI refactoring
- **G-10**: **NEVER** commit without running COMPLETE 4-command preflight checklist

### 🔧 Essential Workflows

1. **Feature Development**: Create branch → develop → test → get approval → merge
2. **Pattern Development**: Use `PatternGeneratorProps` interface + external shaders for WebGL
3. **UI Changes**: Follow 3-phase development (Wet Paint → Drying Paint → Dry Paint)
4. **Testing**: Focus on user behavior, not implementation details (G-8)
5. **Storybook Development**: Components in isolation reveal architecture issues (G-9)

### 📋 Quick Commands

```bash
npm run dev           # Development server
npm run build         # Build + type check
npm run lint          # Linting
npm run storybook     # Component development environment
npm run test          # Run tests
```

---

## Project Overview

A Next.js-based showcase for real-time generative pattern visualizations with user-controllable parameters. Built as a learning platform for contemporary web development with AI assistance.

---

## Golden Rules

### Core Development Rules

| Rule | AI *may* do | AI *must NOT* do |
|------|-------------|------------------|
| **G-0** | **🚨 Ask for clarification** when unsure about project-specific decisions | ❌ Make changes without understanding project context |
| **G-1** | Add **`AIDEV-NOTE:`** comments near non-trivial code | ❌ Delete or mangle existing `AIDEV-` comments |
| **G-2** | For changes >300 LOC or >3 files, **ask for confirmation** | ❌ Refactor large modules without human guidance |
| **G-3** | Stay within current task context | ❌ Continue work from prior prompt after "new task" |
| **G-4** | **🚨 NEVER merge** feature branches without explicit approval | ❌ Merge branches, even if "working state" |

### Testing & Quality Rules

| Rule | AI *may* do | AI *must NOT* do |
|------|-------------|------------------|
| **G-5** | **🚨 Main UI features MUST have behavioral tests.** Follow UI Development Workflow | ❌ Implement main UI features without tests |
| **G-6** | Create implementation notes for significant enhancements | ❌ Skip documentation for major features/architectural changes |
| **G-7** | **🚨 Before UI refactoring, audit ALL pattern-specific special cases** | ❌ Refactor UI without cataloging existing customizations |
| **G-8** | **Tests MUST focus on user behavior, not implementation details** | ❌ Write brittle tests asserting CSS classes/DOM structure |
| **G-9** | **🚨 Storybook component mismatches indicate app architecture issues** | ❌ "Fix Storybook" with overrides; investigate root cause instead |
| **G-10** | **🚨 NEVER commit without running COMPLETE 4-command preflight checklist** | ❌ Skip any preflight command or declare "preflight passed" when incomplete |

---

### 📝 Anchor Comments (Rule G-1)

Use `AIDEV-NOTE:`, `AIDEV-TODO:`, or `AIDEV-QUESTION:` for AI/developer communication:

**Guidelines:**

- Keep concise (≤ 120 chars)
- Locate existing anchors before scanning files
- Update anchors when modifying code
- Never remove without human instruction
- Add for: long/complex/important/confusing code

```typescript
# AIDEV-NOTE: perf-hot-path; avoid extra allocations
export default function BarcodeGenerator...
```

---

## Git Workflow

### 🔄 Branching Strategy

- **Always use feature branches** (never commit directly to main)
- **Branch naming**: `feature/description` or `fix/description`
- **Workflow**: Create branch → develop → test → **get approval** → merge
- **🚨 CRITICAL**: Always ask "Should I merge this feature branch to main?" before merging

### 📝 Commit Standards

- **Granular commits**: One logical change per commit
- **Tag AI commits**: `feat: description [AI]`
- **Clear messages**: Explain the *why*, link to issues if architectural
- **Never merge code you don't understand**

---

## Architecture & Implementation

### 🏢 Core System

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript with strict type safety
- **Styling**: Tailwind CSS with technical blueprint aesthetic
- **UI Components**: shadcn/ui component library

### 🎨 Pattern Generator System

- **Plugin Architecture**: Modular, extensible system
- **Common Interface**: All generators implement `PatternGeneratorProps`
- **Control System**: Real-time parameter adjustment
- **Rendering**: Canvas 2D + WebGL for optimal performance

### 📝 Pattern Generator Interface

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

### ➕ Adding New Pattern Generators

1. Create component in `components/pattern-generators/`
2. Implement `PatternGeneratorProps` interface
3. Add to exports in `components/pattern-generators/index.ts`
4. **Assign appropriate category** (see Pattern Categorization below)
5. Follow existing patterns for control panel implementation
6. For WebGL generators, use external shader loading system
7. **🚨 For patterns with custom shaders: Create shader files** (see Shader Requirements below)
8. **Add semantic metadata** (see Semantic Layer below)
9. **Create educational content** using `/create_explainer` flow (see Educational Content Convention below)

### 🎨 Shader Requirements for WebGL Patterns

**When custom shaders are needed:**
- Patterns using `useCustomShader` control option
- Patterns with `technology: 'WEBGL_MESHES'` that have enhanced rendering modes
- Any pattern calling `createThreeJSShaderMaterial()` function

**Required shader files:**
```
public/shaders/vertex/{pattern-id}.vert
public/shaders/fragment/{pattern-id}.frag
```

**Shader naming convention:**
- Use exact pattern ID as filename (e.g., `aizawa-attractor` → `aizawa-particles.vert/frag`)
- For particle systems, append `-particles` to distinguish from other shader types

**Required shader features:**
- Consistent uniform interface: `u_time`, `u_particleSize`, `u_colorScheme`, `u_depthFading`, `u_opacity`
- Depth-based coloring with `v_depth` varying
- Multiple color schemes (typically 3: Rainbow, Warm-Cool, Pattern-specific)
- Circular particle rendering with soft falloff
- Performance optimizations for mobile devices

### 🏭 Factory Preset System

**Overview:**
Factory presets are curated parameter combinations that ship with the application, providing users with mathematically significant starting points for exploration.

**Factory Preset Features:**
- **Auto-import on first load**: Factory presets are automatically imported into the user's preset collection
- **Educational descriptions**: Each preset includes mathematical significance explanations
- **Categorization**: Organized into Classic, Bifurcation, Enhanced, and Variant categories
- **Version tracking**: Factory presets are only imported once per application version

**Adding Factory Presets:**
1. **Edit factory preset file**: `public/factory-presets.json`
2. **Include required metadata**:
   ```json
   {
     "id": "unique-preset-id",
     "name": "Display Name",
     "generatorType": "pattern-id",
     "parameters": { /* parameter values */ },
     "description": "User-friendly description",
     "isFactory": true,
     "category": "Classic|Bifurcation|Enhanced|Variant",
     "mathematicalSignificance": "Educational explanation"
   }
   ```
3. **Test parameter stability**: Ensure all parameters produce stable, visually appealing results
4. **Mathematical relevance**: Choose parameters that demonstrate important mathematical concepts

**Factory Preset Categories:**
- **Classic**: Standard, well-known parameter sets (e.g., Lorenz σ=10, ρ=28, β=8/3)
- **Bifurcation**: Parameters near critical transition points
- **Enhanced**: Visually striking variations with enhanced features enabled
- **Variant**: Alternative parameter combinations showing system diversity

**Current Factory Presets:**
- **Lorenz Attractor**: 3 presets (Classic, Pre-Chaos Boundary, Enhanced Chaos)
- **Thomas Attractor**: 3 presets (Classic, Hopf Bifurcation, Enhanced Structure) 
- **Aizawa Attractor**: 4 presets (Classic, Critical Boundary, Enhanced Complexity, Compact Form)

### 📚 Educational Content Convention

**Naming Convention:**
- Educational content files must use the exact pattern ID as the filename
- Pattern with `id: "noise"` → `public/educational-content/noise.md`
- Files are created directly in the public directory for immediate availability

**Content Structure:**
Follow the three-layer educational approach:
- **Layer 1**: "What is this?" (Intuitive/Experiential) - Visual description and real-world connections
- **Layer 2**: "How does this work?" (Conceptual/Mechanical) - Algorithm explanation and principles  
- **Layer 3**: "Show me the mathematics" (Technical/Formal) - Mathematical analysis and theoretical foundations

**🚨 CRITICAL RULE: Educational content must NEVER reference our tech stack, implementation details, or app-specific code. Content should focus ONLY on the mathematical/scientific concept being visualized, as if written for a general educational resource.**

**Template Standard:**
All educational content MUST follow the established format:
- **Header Format**: `## Layer N: "Title" (Audience/Type)` with exact spacing and parentheses
- **Section Spacing**: Double newlines between major sections
- **Consistent Structure**: All files must use identical section headers and organization
- **Mathematical Notation**: Use standard mathematical notation and LaTeX-style formatting for equations

**File Location:**
- **Single source of truth**: `public/educational-content/{patternId}.md`
- Educational content is created directly in the public directory for immediate availability
- No build step required - content is available at runtime

### 🏷️ Pattern Categorization System

**Categories** (required field in PatternGenerator interface):
- **`'Noise'`**: Perlin noise, random fields, stochastic patterns (Noise Field, Pixelated Noise, Brownian Motion)
- **`'Geometric'`**: Mathematical shapes, gradients, geometric patterns (Trigonometric Circle, Four-Pole Gradient)
- **`'Simulation'`**: Physics-based, cellular automata, particle systems (Particle System, Cellular Automaton) 
- **`'Data Visualization'`**: Charts, spectrums, data-driven visuals (Frequency Spectrum, Barcode Scanner)
- **`'Attractors'`**: Strange attractors and chaotic dynamical systems (Lorenz Attractor, Thomas Attractor)

**Desktop UX Features:**
- **Visual Grouping**: Category dividers appear in pattern list when category changes
- **Smart Paging**: Previous/Next buttons can skip to category boundaries
- **Current Category Indicator**: Specifications panel shows pattern's category

**Implementation:**
```typescript
// In components/pattern-generators/index.ts
{
  id: "new-pattern",
  name: "New Pattern",
  component: NewPatternGenerator,
  technology: 'CANVAS_2D',
  category: 'Noise', // Required: choose appropriate category
  controls: [...]
}
```

**Category Management Utility:**
- Use `PatternCategoryManager` from `@/lib/pattern-category-manager`
- Provides filtering, grouping, and navigation utilities
- Handles category boundaries for desktop paging navigation

### 🎨 Shader Loading System

**External Shader Architecture:**

- Shader files in `shaders/vertex/` and `shaders/fragment/`
- Dynamic loading via `loadShader()` utility
- Type-safe uniforms with TypeScript definitions
- TouchDesigner import workflow

**Implementation:**

```typescript
import { loadShader, createShaderProgram } from "@/lib/shader-loader"

const shaderProgram = await loadShader('shader-name')
const program = createShaderProgram(gl, shaderProgram.vertex, shaderProgram.fragment)
```

**Benefits:** GLSL syntax highlighting, maintainability, TouchDesigner imports, hot reload

### 🧠 Semantic Layer System

**Rich Metadata for Pattern Generators:**

The semantic layer enhances pattern definitions with machine-readable metadata about algorithms, mathematical concepts, visual characteristics, and performance profiles. This enables intelligent features like platform-specific defaults, performance recommendations, and educational resource discovery.

**Core Semantic Types:**

```typescript
import type { RichPatternGeneratorDefinition, RichPatternControlDefinition } from '@/lib/semantic-types'

// Pattern must include these semantic fields:
- schemaVersion: "1.0"
- description: Brief user-facing description
- semantics: Algorithm family, math concepts, visual characteristics
- performance: Computational complexity, frame rate targets
- version: Semantic version (e.g., "1.0.0")
- author: Creator attribution
- dateAdded/lastModified: ISO dates
- status: "Development" | "Experimental" | "Production"
```

**Control Semantic Metadata:**

```typescript
// Controls must include:
- description: What the control does
- role: ControlRole type (e.g., "VisualAesthetic", "PerformanceTuning")
- impactsPerformance: "Negligible" | "Minor" | "Moderate" | "Significant"
- defaultRecommendations?: Platform and performance-based defaults
```

**Platform-Aware Defaults:**

```typescript
// Example: Particle trails disabled on mobile for performance
defaultRecommendations: {
  platformSpecific: {
    mobile: false,    // Disabled on mobile
    desktop: true,    // Enabled on desktop
    rationale: "Trails significantly impact mobile GPU performance"
  }
}
```

**Semantic Utility Functions:**

```typescript
import { 
  getPlatformDefaultValue,
  getPerformanceImpactingControls,
  isMobileFriendly,
  findPatternsByMathConcept
} from '@/lib/semantic-utils'

// Get appropriate defaults for current platform
const defaultValue = getPlatformDefaultValue(control, 'mobile')

// Find performance-critical controls
const criticalControls = getPerformanceImpactingControls(pattern)

// Check mobile compatibility
const mobileReady = isMobileFriendly(pattern)
```

**Adding Semantic Metadata to New Patterns:**

1. Use `RichPatternGeneratorDefinition` type
2. Fill all required semantic fields
3. Add platform recommendations for performance-impacting controls
4. Include educational links when relevant
5. Specify related patterns for discovery
6. Group controls semantically
7. Run semantic validation tests

---

## Development Guidelines

### 🎨 Design System

- **Color Palette**: Grayscale with yellow (#FACC15) accents
- **Typography**: Monospace fonts, uppercase labels, technical styling
- **Layout**: Clean, minimal, blueprint-inspired design
- **Controls**: Real-time updates, 2-column grid, technical aesthetic

### ⚡ Performance Guidelines

**WebGL Patterns:**

- Use `loadShader()` for shader management
- GLSL shaders must use compile-time constants
- Minimize uniform updates per frame
- Proper cleanup: `cancelAnimationFrame` and shader program deletion

**Canvas 2D Patterns:**

- Use `requestAnimationFrame` for 60fps animations
- Minimize canvas context operations
- Cache calculated values, proper memory management

### 🛠️ Development Notes

- **Code Style**: Functional components with hooks
- **TypeScript**: Strict mode enabled, avoid `any` types
- **Performance**: Target 60fps for all animations
- **Accessibility**: Maintain keyboard navigation support

### 📝 Implementation Notes Documentation

**When to Create (Rule G-6):**

- ✅ New features, major architectural changes, complex integrations
- ❌ Bug fixes, small refactorings, documentation updates

**Process:**

1. Create design documents in `docs/tech/architecture_notes/implementation_notes/`
2. Follow TDD or documented approaches
3. Create `ISSUE_N_IMPLEMENTATION_SUMMARY.md` upon completion

**Location:** `docs/tech/architecture_notes/implementation_notes/ISSUE_N_IMPLEMENTATION_SUMMARY.md`

---

### ⚠️ Pattern-Specific Refactoring Guidelines

**🚨 Before refactoring UI components (Rule G-7):**

1. **Audit existing special cases:**

   ```bash
   rg "patternId.*===|if.*pattern.*===" components/
   rg "switch.*patternId|case.*'" components/
   ```

2. **Create preservation checklist** (unique layouts, behaviors, styling)
3. **Write preservation tests FIRST**
4. **Visual regression verification** (before/after screenshots)

**Common Pattern Specializations:**

- Four-Pole Gradient: 2x2 color picker grid
- Cellular Automaton: Compact prev/next navigation  
- Particle Systems: Prominent reset buttons

**❌ Anti-Patterns:** Generic-first thinking, reactive discovery, missing preservation tests
**✅ Success Patterns:** Preservation-first approach, explicit special case handling

---

## AI Assistant Workflow

### 🤖 Essential Workflow Steps

1. **📊 Consult & Clarify**: Review project context, ask for clarification if unsure
2. **📋 Plan & Branch**: Break down task, create feature branch for code changes
3. **⚙️ Execute**: Implement trivial tasks immediately, present plan for complex tasks
4. **📝 Track & Update**: Use todos for progress, update `AIDEV-NOTE` comments
5. **🔍 Review & Iterate**: Get user review, repeat as needed

---

### 🎨 UI Development Workflow (3-Phase Testing Strategy)

1. **🎨 "Wet Paint" Phase**: Exploration & Prototyping
   - Focus on manual browser testing and visual feedback
   - Automated tests deferred until UI stabilizes
   - Rapid iteration on structure and interactions

2. **🔄 "Drying Paint" Phase**: Stabilization & Behavioral Testing
   - Write behavioral tests using React Testing Library (Rule G-8)
   - Test user behavior, not implementation details
   - Focus on what users see and can do

3. **✅ "Dry Paint" Phase**: Refinement & Maintenance
   - Existing tests should pass for cosmetic changes
   - Update tests when user behavior changes
   - Add tests for new significant behaviors

**Test Refactoring Guidance:**

- Update tests to reflect intended user behavior in new UI structure
- Refer to Pattern-Specific Refactoring Guidelines before major UI refactors
- Never suggest skipping tests - ask for guidance on complex refactoring scenarios

---

### 📊 Quick Decision Trees

**When to create feature branch?** Always for code changes (Rule G-4)
**When to write tests?** Main UI features must have behavioral tests; if unsure what Phase of UI Development, ask user for clarification! (Rule G-5)
**When to ask for clarification?** When unsure about project-specific decisions (Rule G-0)
**When to create implementation notes?** New features, major architectural changes (Rule G-6)
**When to audit special cases?** Before refactoring UI components (Rule G-7)
**When to commit code?** NEVER without running complete 4-command preflight: lint + build + test + storybook (Rule G-10)

### ✅ Common Task Checklists

**Adding New Pattern Generator:**

- [ ] Create component in `components/pattern-generators/`
- [ ] Implement `PatternGeneratorProps` interface
- [ ] Add to exports in `index.ts`
- [ ] Use external shader loading for WebGL
- [ ] Follow control panel patterns
- [ ] Add complete semantic metadata using `RichPatternGeneratorDefinition`
- [ ] Include platform-specific default recommendations
- [ ] Run semantic validation tests

**UI Refactoring:**

- [ ] Audit pattern-specific special cases
- [ ] Write preservation tests first
- [ ] Maintain technical aesthetic
- [ ] Test at 60fps performance target

**Storybook Development:**

- [ ] Always use .tsx files when JSX is used in stories
- [ ] Components in Storybook should match app styling exactly
- [ ] If Storybook components don't match app, investigate root cause (Rule G-9)
- [ ] Never "fix Storybook" with CSS overrides - fix the underlying architecture
- [ ] Create stories that demonstrate actual usage patterns from the app

**Storybook Interactivity Best Practices:**

**✅ Make These Interactive (use `render()` with `useState`):**
- [ ] **Default/Primary stories** - Main use case that people interact with most
- [ ] **"Interactive" or "Playground" stories** - Dedicated sandbox for testing
- [ ] **Form/control components** - Controls users naturally expect to work
- [ ] **Complex state demos** - Multi-step flows, state management examples

**📸 Keep These Static (use `args` object):**
- [ ] **Visual variations** - Color schemes, sizes, themes, layout demos
- [ ] **State examples** - Loading, error, empty, disabled states
- [ ] **Documentation stories** - "Here's what X looks like" examples
- [ ] **Edge cases** - Error conditions, extreme values, unusual inputs

**Example Pattern:**
```typescript
// ✅ INTERACTIVE - Primary use case
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('initial')
    return <Component value={value} onChange={setValue} />
  }
}

// 📸 STATIC - Visual documentation
export const Variants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Component variant="default" />
      <Component variant="outlined" />
    </div>
  )
}
```

**Target Ratio:** ~35% interactive, 65% static stories for optimal balance of usability and performance.

**🚨 MANDATORY Preflight Checks (Rule G-10) - ALL 4 must pass:**

- [ ] `npm run lint` - ESLint passes
- [ ] `npm run build` - Next.js build succeeds with type checking  
- [ ] `npm run test` - All tests pass (NEVER skip this!)
- [ ] `npm run storybook -- --no-open` - Storybook builds without errors

**STOP on first failure. NEVER commit if any command fails.**

---

## Appendix

### Repository Information

- **GitHub**: <https://github.com/aaronsbrown/gen_pattern_showcase.git>
- **Branch**: `main`
- **Development**: Active, collaborative with AI assistance

### File Structure

```
src/                           # Source code root
├── app/                       # Next.js app router
├── components/                # React components
│   ├── pattern-generators/    # Pattern implementations
│   ├── ui/                    # UI components (shadcn/ui + custom)
│   ├── desktop/               # Desktop-specific components
│   └── mobile/                # Mobile-specific components
├── lib/                       # Utilities (shader-loader, semantic-types, etc.)
└── test-utils/                # Test utilities and mocks
public/shaders/                # External shader files
├── fragment/                  # Fragment shaders
└── vertex/                    # Vertex shaders
docs/                          # Documentation root
├── content/                   # Content documentation
│   └── pattern_writeups/      # Pattern-specific documentation
├── process/                   # Process documentation
│   └── retrospectives/        # Development retrospectives
└── tech/                      # Technical documentation
    └── architecture_notes/    # Architecture and implementation notes
        └── implementation_notes/ # Detailed implementation summaries
stories/                       # Storybook stories
```

### Development Memories

- Remember to use .tsx files for storybook when using jsx code