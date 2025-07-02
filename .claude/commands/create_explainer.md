# Create Explainer Documentation

## Overview
Generate comprehensive three-layer educational documentation for a specific pattern generator visualization.

## Usage
`/create_explainer <pattern_name>`

Example: `/create_explainer noise-field`

## Process

When this command is invoked:

1. **Examine the Pattern Generator Code**
   - Locate the pattern generator file in `components/pattern-generators/`
   - Read and analyze the implementation to understand:
     - The mathematical/algorithmic approach
     - Key parameters and controls
     - Rendering method (Canvas 2D vs WebGL)
     - Visual characteristics and behavior

2. **Create Three-Layer Documentation**
   Create a markdown file at `docs/education/{pattern_name}.md` with these sections:

   ### Layer 1: "What is this?" (Intuitive/Experiential)
   - **What you're seeing:** Simple, engaging description of the visual experience
   - **The magic/beauty:** Why this pattern is interesting or remarkable
   - **Interactive experience:** How different controls affect the visualization
   - **Real-world connections:** Where this pattern appears in nature, science, or daily life
   - Use accessible language, focus on wonder and discovery

   ### Layer 2: "How does this work?" (Conceptual/Mechanical)
   - **The Algorithm:** Step-by-step breakdown of the process
   - **Mathematical Foundation:** Core concepts without heavy formulas
   - **Key Properties:** Important characteristics of the pattern/system
   - **Why it works:** Intuitive explanation of the underlying principles
   - Bridge between visual experience and technical implementation

   ### Layer 3: "Show me the code" (Technical/Formal)
   - **Core Implementation Details:** Key functions with file references
   - **Code Examples:** Critical code snippets with explanations
   - **Technical Features:** Performance optimizations, architecture decisions
   - **Architecture Integration:** How it fits into the project structure
   - Include specific line references like `filename.tsx:line_number`

## Documentation Standards

- **File Location:** Always save to `docs/education/{pattern_name}.md`
- **Consistent Structure:** Use the exact section headers shown above
- **Code References:** Include file paths and line numbers for technical details
- **Accessibility:** Layer 1 should be understandable by anyone
- **Progressive Depth:** Each layer should build naturally on the previous
- **Visual Language:** Use descriptive, engaging language especially in Layer 1

## Example Structure

```markdown
# [Pattern Name] Educational Documentation

## Layer 1: "What is this?" (Intuitive/Experiential)
**What you're seeing:** [Visual description]
[Experience-focused content]

## Layer 2: "How does this work?" (Conceptual/Mechanical)
**The Algorithm:** [Step-by-step process]
[Conceptual explanations]

## Layer 3: "Show me the code" (Technical/Formal)
**Core Implementation Details:** [Technical analysis]
[Code examples and references]
```

## Notes

- Always examine the code first to understand the implementation
- Focus on making complex concepts accessible through the three-layer approach
- Include interactive elements and real-world connections where relevant
- Use the project's existing documentation style and technical aesthetic