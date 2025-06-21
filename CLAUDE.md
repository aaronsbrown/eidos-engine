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

### 🔧 Essential Workflows

1. **Feature Development**: Create branch → develop → test → get approval → merge
2. **Pattern Development**: Use `PatternGeneratorProps` interface + external shaders for WebGL
3. **UI Changes**: Follow 3-phase development (Wet Paint → Drying Paint → Dry Paint)
4. **Testing**: Focus on user behavior, not implementation details (G-8)

### 📋 Quick Commands

```bash
npm run dev     # Development server
npm run build   # Build + type check
npm run lint    # Linting
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
4. Follow existing patterns for control panel implementation
5. For WebGL generators, use external shader loading system

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

1. Create design documents in `docs/implementation_notes/`
2. Follow TDD or documented approaches
3. Create `ISSUE_N_IMPLEMENTATION_SUMMARY.md` upon completion

**Location:** `docs/implementation_notes/ISSUE_N_IMPLEMENTATION_SUMMARY.md`

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

### ✅ Common Task Checklists

**Adding New Pattern Generator:**

- [ ] Create component in `components/pattern-generators/`
- [ ] Implement `PatternGeneratorProps` interface
- [ ] Add to exports in `index.ts`
- [ ] Use external shader loading for WebGL
- [ ] Follow control panel patterns

**UI Refactoring:**

- [ ] Audit pattern-specific special cases
- [ ] Write preservation tests first
- [ ] Maintain technical aesthetic
- [ ] Test at 60fps performance target

---

## Appendix

### Repository Information

- **GitHub**: <https://github.com/aaronsbrown/gen_pattern_showcase.git>
- **Branch**: `main`
- **Development**: Active, collaborative with AI assistance

### File Structure

```
components/pattern-generators/  # Pattern implementations
components/ui/                  # UI components (shadcn/ui + custom)
lib/                           # Utilities (shader-loader, etc.)
shaders/                       # External shader files
app/                          # Next.js app router
docs/implementation_notes/     # Implementation documentation
```
