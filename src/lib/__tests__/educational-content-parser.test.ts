/**
 * @jest-environment jsdom
 */

import { parseEducationalContent } from '../educational-content-parser'

// AIDEV-NOTE: Tests for educational content parsing - ensures markdown parsing works correctly
describe('Educational Content Parser', () => {
  describe('Standard Format Parsing', () => {
    it('parses complete educational content correctly', () => {
      const markdown = `# Test Pattern Educational Content

## Layer 1: "What is this?" (Intuitive/Experiential)

This is the intuitive explanation.
It can span multiple lines.

**Features:**
- Interactive elements
- Visual descriptions

## Layer 2: "How does this work?" (Conceptual/Mechanical)

This explains the mechanics.

**Algorithm steps:**
1. First step
2. Second step

## Layer 3: "Show me the code" (Technical/Formal)

Technical implementation details.

\`\`\`typescript
const example = () => {
  return "code example"
}
\`\`\``

      const result = parseEducationalContent(markdown)

      expect(result.title).toBe('Test Pattern Educational Content')
      expect(result.layers.intuitive.title).toBe('What is this?')
      expect(result.layers.intuitive.content).toContain('This is the intuitive explanation')
      expect(result.layers.intuitive.content).toContain('Interactive elements')
      
      expect(result.layers.conceptual.title).toBe('How does this work?')
      expect(result.layers.conceptual.content).toContain('This explains the mechanics')
      expect(result.layers.conceptual.content).toContain('First step')
      
      expect(result.layers.technical.title).toBe('Show me the code')
      expect(result.layers.technical.content).toContain('Technical implementation details')
      expect(result.layers.technical.content).toContain('const example')
    })

    it('handles ASCII quotes in headers', () => {
      const markdown = `# ASCII Quotes Test

## Layer 1: "What is this?" (Intuitive/Experiential)

ASCII quote content.

## Layer 2: "How does this work?" (Conceptual/Mechanical)

ASCII quote content.

## Layer 3: "Show me the code" (Technical/Formal)

ASCII quote content.`

      const result = parseEducationalContent(markdown)

      expect(result.layers.intuitive.title).toBe('What is this?')
      expect(result.layers.conceptual.title).toBe('How does this work?')
      expect(result.layers.technical.title).toBe('Show me the code')
    })

    it('handles Unicode smart quotes in headers', () => {
      const markdown = `# Unicode Quotes Test

## Layer 1: "What is this?" (Intuitive/Experiential)

Unicode quote content.

## Layer 2: "How does this work?" (Conceptual/Mechanical)

Unicode quote content.

## Layer 3: "Show me the code" (Technical/Formal)

Unicode quote content.`

      const result = parseEducationalContent(markdown)

      expect(result.layers.intuitive.title).toBe('What is this?')
      expect(result.layers.conceptual.title).toBe('How does this work?')
      expect(result.layers.technical.title).toBe('Show me the code')
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('handles missing title gracefully', () => {
      const markdown = `## Layer 1: "What is this?" (Intuitive/Experiential)

Content without title.

## Layer 2: "How does this work?" (Conceptual/Mechanical)

More content.

## Layer 3: "Show me the code" (Technical/Formal)

Even more content.`

      const result = parseEducationalContent(markdown)
      expect(result.title).toBe('Educational Content')
    })

    it('handles missing layers gracefully', () => {
      const markdown = `# Incomplete Content

## Layer 1: "What is this?" (Intuitive/Experiential)

Only layer 1 exists.`

      const result = parseEducationalContent(markdown)

      expect(result.layers.intuitive.content).toContain('Only layer 1 exists')
      expect(result.layers.conceptual.content).toBe('Content not found')
      expect(result.layers.technical.content).toBe('Content not found')
    })

    it('handles empty content sections', () => {
      const markdown = `# Empty Sections

## Layer 1: "What is this?" (Intuitive/Experiential)

## Layer 2: "How does this work?" (Conceptual/Mechanical)

Some content here.

## Layer 3: "Show me the code" (Technical/Formal)`

      const result = parseEducationalContent(markdown)

      expect(result.layers.intuitive.content).toBe('Content not found')
      expect(result.layers.conceptual.content).toContain('Some content here')
      expect(result.layers.technical.content).toBe('Content not found')
    })

    it('handles malformed layer headers', () => {
      const markdown = `# Malformed Headers

## Layer 1 What is this (no quotes)

Content without proper header format.

## Layer 2: "How does this work?" (Conceptual/Mechanical)

Proper content.

## Layer 3: Show me the code (missing quotes)

More content with malformed header.`

      const result = parseEducationalContent(markdown)

      // Should fall back to default titles when parsing fails
      expect(result.layers.intuitive.title).toBe('What is this?')
      expect(result.layers.conceptual.title).toBe('How does this work?')
      expect(result.layers.technical.title).toBe('Show me the code')
      
      // Content should still be extracted based on layer numbers
      expect(result.layers.intuitive.content).toContain('Content without proper header format')
      expect(result.layers.conceptual.content).toContain('Proper content')
      expect(result.layers.technical.content).toContain('More content with malformed header')
    })

    it('handles completely empty input', () => {
      const result = parseEducationalContent('')

      expect(result.title).toBe('Educational Content')
      expect(result.layers.intuitive.title).toBe('What is this?')
      expect(result.layers.intuitive.content).toBe('Content not found')
      expect(result.layers.conceptual.content).toBe('Content not found')
      expect(result.layers.technical.content).toBe('Content not found')
    })

    it('handles single layer content', () => {
      const markdown = `# Single Layer

## Layer 2: "How does this work?" (Conceptual/Mechanical)

Only the middle layer exists.
This is all the content we have.`

      const result = parseEducationalContent(markdown)

      expect(result.layers.intuitive.content).toBe('Content not found')
      expect(result.layers.conceptual.content).toContain('Only the middle layer exists')
      expect(result.layers.technical.content).toBe('Content not found')
    })
  })

  describe('Content Structure Preservation', () => {
    it('preserves markdown formatting in content', () => {
      const markdown = `# Formatting Test

## Layer 1: "What is this?" (Intuitive/Experiential)

This content has **bold text** and *italic text*.

- List item 1
- List item 2

\`inline code\` and links.

## Layer 2: "How does this work?" (Conceptual/Mechanical)

More formatted content.

## Layer 3: "Show me the code" (Technical/Formal)

Code blocks:

\`\`\`typescript
function example() {
  return true
}
\`\`\``

      const result = parseEducationalContent(markdown)

      expect(result.layers.intuitive.content).toContain('**bold text**')
      expect(result.layers.intuitive.content).toContain('*italic text*')
      expect(result.layers.intuitive.content).toContain('- List item 1')
      expect(result.layers.intuitive.content).toContain('`inline code`')
      
      expect(result.layers.technical.content).toContain('```typescript')
      expect(result.layers.technical.content).toContain('function example()')
    })

    it('trims whitespace but preserves internal structure', () => {
      const markdown = `# Whitespace Test

## Layer 1: "What is this?" (Intuitive/Experiential)

    
Content with leading/trailing whitespace.

Paragraph with spacing.

    

## Layer 2: "How does this work?" (Conceptual/Mechanical)

Another section.

## Layer 3: "Show me the code" (Technical/Formal)

Final section.`

      const result = parseEducationalContent(markdown)

      // Should trim leading/trailing whitespace but preserve paragraph structure
      expect(result.layers.intuitive.content).toBe('Content with leading/trailing whitespace.\n\nParagraph with spacing.')
      expect(result.layers.intuitive.content).not.toMatch(/^\s+/)
      expect(result.layers.intuitive.content).not.toMatch(/\s+$/)
    })
  })

  describe('Real Content Examples', () => {
    it('parses cellular automaton content correctly', () => {
      const markdown = `# Cellular Automata: Patterns from First Principles

## Layer 1: "What is this?" (Intuitive/Experiential)

A single yellow pixel. Then another. Then a thousand more—marching downward row by row, like ink dripping from logic itself.

This is a **cellular automaton**, a machine that evolves patterns using nothing but its own local memory.

## Layer 2: "How does this work?" (Conceptual/Mechanical)

At heart, it's just this:

> For each cell, look at its left neighbor, itself, and its right neighbor.
> Based on that 3-cell pattern, decide if it will be ON or OFF in the next row.

## Layer 3: "Show me the code" (Technical/Formal)

**Rule Lookup Table**:
This converts a rule number (0–255) into an array of 8 booleans.

\`\`\`ts
const getRuleLookup = (rule: number): boolean[] => {
  const lookup = new Array(8).fill(false)
  return lookup
}
\`\`\``

      const result = parseEducationalContent(markdown)

      expect(result.title).toBe('Cellular Automata: Patterns from First Principles')
      expect(result.layers.intuitive.content).toContain('A single yellow pixel')
      expect(result.layers.intuitive.content).toContain('cellular automaton')
      expect(result.layers.conceptual.content).toContain('For each cell, look at')
      expect(result.layers.technical.content).toContain('Rule Lookup Table')
      expect(result.layers.technical.content).toContain('const getRuleLookup')
    })
  })
})