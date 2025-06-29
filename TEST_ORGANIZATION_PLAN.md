# Phase 5: Test Organization Plan

## Current Test Structure Analysis (43 test files)

### Current Organization
Tests are currently co-located with their source files, following the convention:
- `src/path/to/component.tsx` → `src/path/to/component.test.tsx`
- Some tests in dedicated `__tests__/` directories

### Test Categories Identified

#### 1. **Unit Tests** (Pure Functions, Utilities, Math)
- `src/lib/utils.test.ts` - className merging utility
- `src/lib/math/lorenz.test.ts` - Mathematical calculations
- `src/lib/simplex-noise.test.ts` - Noise generation algorithms
- `src/lib/semantic-types.test.ts` - Type validation
- `src/lib/semantic-utils.test.ts` - Semantic utility functions
- `src/lib/shader-loader.test.ts` - Shader loading utilities
- `src/lib/threejs-shader-utils.test.ts` - Three.js utilities
- `src/lib/__tests__/educational-content-parser.test.ts` - Content parsing
- `src/lib/__tests__/educational-content-loader.test.ts` - Content loading

#### 2. **Integration Tests** (Hooks, Component Interactions)
- `src/lib/hooks/use-preset-manager.test.ts` - Hook state management
- `src/lib/hooks/use-preset-manager-sync.test.tsx` - Hook synchronization
- `src/lib/hooks/__tests__/use-tour.test.tsx` - Tour system integration
- `src/lib/hooks/__tests__/use-educational-content.test.tsx` - Content system integration
- `src/lib/theme-context.test.tsx` - Context provider integration
- `src/lib/preset-manager.test.ts` - Business logic integration
- `src/components/pattern-generators/semantic-integration.test.tsx` - Pattern system integration
- `src/components/ui/accessibility-integration.test.tsx` - Accessibility integration

#### 3. **Behavioral Tests** (User Workflows, UI Interactions)
- `src/app/page.test.tsx` - Main page interactions
- `src/components/desktop/desktop-layout.test.tsx` - Desktop layout interactions
- `src/components/desktop/desktop-layout-preset.test.tsx` - Preset workflow
- `src/components/desktop/__tests__/desktop-layout-tour.test.tsx` - Tour workflow
- `src/components/desktop/__tests__/desktop-layout-educational.test.tsx` - Educational workflow
- `src/components/mobile/mobile-layout-wrapper.test.tsx` - Mobile layout interactions
- `src/components/mobile/__tests__/mobile-layout-educational.test.tsx` - Mobile educational workflow
- `src/components/mobile/__tests__/mobile-layout-tour.test.tsx` - Mobile tour workflow
- `src/components/ui/floating-preset-panel.test.tsx` - Preset panel interactions
- `src/components/ui/grouped-simulation-controls-panel.test.tsx` - Controls panel interactions

#### 4. **Component Tests** (UI Component Rendering & Props)
- `src/components/ui/button.test.tsx` - Button component
- `src/components/ui/theme-toggle.test.tsx` - Theme toggle component
- `src/components/ui/checkbox.test.tsx` - Checkbox component
- `src/components/ui/collapsible-control-group.test.tsx` - Collapsible group component
- `src/components/ui/viewport-constrained-panel.test.tsx` - Viewport panel component
- `src/components/ui/__tests__/educational-overlay.test.tsx` - Educational overlay component
- `src/components/three-js/AxesHelper3D.test.tsx` - 3D axes component
- `src/components/three-js/ThreeJSCanvas.test.tsx` - 3D canvas component
- `src/components/mobile/mobile-header.test.tsx` - Mobile header component
- `src/components/mobile/pattern-dropdown-selector.test.tsx` - Pattern selector component
- `src/components/mobile/progressive-disclosure-panel.test.tsx` - Progressive disclosure component
- `src/components/mobile/mobile-typography-enhancement.test.tsx` - Typography component
- `src/components/pattern-generators/lorenz-attractor-generator.test.tsx` - Pattern generator component
- `src/components/pattern-generators/pattern-generator.test.tsx` - Base pattern component
- `src/components/pattern-generators/semantic-validation.test.ts` - Pattern validation

## Proposed Organization Strategy

### Option 1: Maintain Co-location (RECOMMENDED)
**Rationale**: 
- Preserves discoverability (tests next to source)
- Follows established React/Next.js conventions
- Minimal disruption to existing workflow
- Easy to find and maintain tests

**Improvements**:
- Standardize on `__tests__/` directories for complex test suites
- Add clear test type indicators in file headers
- Group related tests within files by type

### Option 2: Separate Test Directories by Type
**Structure**:
```
tests/
├── unit/
│   ├── lib/
│   └── utils/
├── integration/
│   ├── hooks/
│   └── systems/
├── behavioral/
│   ├── desktop/
│   └── mobile/
└── component/
    ├── ui/
    └── pattern-generators/
```

**Rationale**: 
- Clear separation by test type
- Easier to run specific test categories
- Better for CI/CD pipeline organization

**Drawbacks**:
- Breaks co-location convention
- Harder to find tests when working on components
- Requires significant file movement

## Recommended Approach: Enhanced Co-location

### 1. Standardize Test Headers
Add clear type indicators to all test files:

```typescript
// AIDEV-NOTE: [TEST_TYPE] - Brief description
// Examples:
// AIDEV-NOTE: UNIT_TEST - Math utility functions for Lorenz attractor calculations
// AIDEV-NOTE: INTEGRATION_TEST - Preset manager hook state synchronization
// AIDEV-NOTE: BEHAVIORAL_TEST - Desktop layout user workflows and interactions
// AIDEV-NOTE: COMPONENT_TEST - Button component rendering and props
```

### 2. Organize Complex Test Suites
Move multi-file test suites to `__tests__/` directories:

```
src/components/desktop/
├── desktop-layout.tsx
├── __tests__/
│   ├── desktop-layout-unit.test.tsx       # Unit tests
│   ├── desktop-layout-integration.test.tsx # Integration tests  
│   └── desktop-layout-behavioral.test.tsx  # Behavioral tests
```

### 3. Jest Configuration Enhancement
Update Jest config to support test type filtering:

```javascript
// jest.config.js additions
module.exports = {
  // ... existing config
  testMatch: [
    "**/__tests__/**/*.(test|spec).(ts|tsx)",
    "**/*.(test|spec).(ts|tsx)"
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/__tests__/**"
  ]
}
```

### 4. NPM Scripts for Test Categories
Add test type filtering scripts:

```json
{
  "scripts": {
    "test:unit": "jest --testPathPattern='(utils|math|validation|semantic).*test'",
    "test:integration": "jest --testPathPattern='(hooks|integration|manager).*test'", 
    "test:behavioral": "jest --testPathPattern='(layout|workflow|tour|educational).*test'",
    "test:component": "jest --testPathPattern='(ui|component|generator).*test'"
  }
}
```

## Implementation Plan

### Phase 5.1: Documentation and Headers
1. Add standardized test type headers to all 43 test files
2. Document test categories in project README
3. Create test writing guidelines

### Phase 5.2: Structural Organization  
1. Move complex test suites to `__tests__/` directories
2. Split large test files by type where beneficial
3. Ensure all tests still pass after moves

### Phase 5.3: Tooling Enhancement
1. Update Jest configuration for better test discovery
2. Add NPM scripts for test type filtering
3. Update CI/CD pipeline to leverage test categories

## Benefits of This Approach

1. **Maintains Discoverability**: Tests stay near source code
2. **Enables Filtering**: Can run specific test types when needed
3. **Improves Documentation**: Clear test type indicators
4. **Preserves Workflow**: Minimal disruption to existing practices
5. **Future-Friendly**: Supports test pyramid best practices

## Success Metrics

- All 603 tests continue to pass
- Clear test type identification in all files
- Ability to run test categories independently
- Improved test discovery and maintenance
- Zero breaking changes to existing workflow