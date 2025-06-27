---
marp: true
theme: uncover
class:
  - invert
---

# Generative Pattern Showcase

A deep dive into the project's architecture, features, and development practices.

---

## Project Overview

A Next.js-based showcase for real-time generative pattern visualizations with user-controllable parameters. Built as a learning platform for contemporary web development with AI assistance.

**Core Goals:**
-   Explore generative art algorithms.
-   Demonstrate modern web technologies.
-   Serve as a testbed for AI-assisted development workflows.
-   Provide an educational resource for developers.

---

## Tech Stack

-   **Framework**: Next.js 14+ (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **UI Components**: shadcn/ui
-   **Testing**: Jest & React Testing Library
-   **Component Dev**: Storybook
-   **Linting**: ESLint

---

## General Architecture

-   **Plugin-based System**: New patterns are added as self-contained components.
-   **Unified Interface**: All patterns implement a common `PatternGeneratorProps` interface.
-   **Real-time Controls**: A dynamic system for adjusting pattern parameters.
-   **Dual Rendering Paths**: Supports both Canvas 2D and WebGL for performance.
-   **Semantic Metadata**: Rich, machine-readable data for each pattern.

---

## Best Practices & Workflow

-   **Git Workflow**: Feature branches, granular commits, and PRs.
-   **AI Collaboration**: `AIDEV-NOTE` comments for context and AI-specific tasks.
-   **Testing**:
    -   Behavioral tests for UI features.
    -   Unit tests for utilities and logic.
-   **UI Development**: 3-phase "Wet Paint" -> "Drying Paint" -> "Dry Paint" process.
-   **Documentation**: Implementation notes for major features.

---

## Interesting Features

-   **External Shader Loading**: GLSL shaders are loaded dynamically.
-   **Semantic Layer**:
    -   Platform-aware defaults (e.g., mobile vs. desktop).
    -   Performance-impact warnings for controls.
-   **Educational Content**: In-app explanations for each pattern.
-   **Pattern Categorization**: Smart grouping and navigation of patterns.
-   **Preset System**: Save and load pattern configurations.

---

## Conclusion

-   A robust platform for generative art.
-   A great example of modern web development.
-   Designed for collaboration with AI assistants.

**Questions?**
