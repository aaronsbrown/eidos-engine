import type { EducationalContent } from '@/components/ui/educational-overlay'

// AIDEV-NOTE: Parses markdown educational content into structured data for overlay display
export function parseEducationalContent(markdownContent: string): EducationalContent {
  // const sections = markdownContent.split('---').map(section => section.trim())
  
  // Extract title from first line
  const titleMatch = markdownContent.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1] : 'Educational Content'
  
  // Parse Layer 1 (Intuitive)
  const layer1Match = markdownContent.match(/## Layer 1: "([^"]+)"[^#]+([\s\S]*?)(?=##|$)/)
  const intuitive = {
    title: layer1Match ? layer1Match[1] : 'What am I looking at?',
    content: layer1Match ? layer1Match[2].trim() : 'Content not found'
  }
  
  // Parse Layer 2 (Conceptual) 
  const layer2Match = markdownContent.match(/## Layer 2: "([^"]+)"[^#]+([\s\S]*?)(?=##|$)/)
  const conceptual = {
    title: layer2Match ? layer2Match[1] : 'How does this work?',
    content: layer2Match ? layer2Match[2].trim() : 'Content not found'
  }
  
  // Parse Layer 3 (Technical)
  const layer3Match = markdownContent.match(/## Layer 3: "([^"]+)"[^#]+([\s\S]*?)(?=##|$)/)
  const technical = {
    title: layer3Match ? layer3Match[1] : 'Show me the code',
    content: layer3Match ? layer3Match[2].trim() : 'Content not found'
  }
  
  return {
    title,
    layers: {
      intuitive,
      conceptual,
      technical
    }
  }
}

// AIDEV-NOTE: Keep hard-coded content as fallback for educational content loader
export const cellularAutomataContent: EducationalContent = {
  title: "Cellular Automata: Patterns from First Principles",
  layers: {
    intuitive: {
      title: "What am I looking at?",
      audienceHint: "Beginner-friendly",
      content: `A single yellow pixel. Then another. Then a thousand more—marching downward row by row, like ink dripping from logic itself.

This is a **cellular automaton**, a machine that evolves patterns using nothing but its own local memory. Each row is a generation. Each cell only knows about its two neighbors. There's no central command. No global planner.

And yet—structure.

Some rules generate fractals. Others chaos. A few bloom with eerie balance, creating motifs that feel intentional, even "designed."

But it's all math. Or rather—**emergence**.
This is what complexity looks like when you zoom out.

**Play around:**

* Change the **rule number** and watch the entire universe morph
* Try a single seed vs. a randomized field
* Notice how some rules settle, others never stop writhing
* Rule 30? It's chaotic enough to power random number generators

This isn't just visual play. It's the same logic that powers Turing machines, cryptographic entropy, and even early theories of life.

It's proof that from nothing but **local decisions**, global intelligence can emerge.`
    },
    conceptual: {
      title: "How does this work?",
      audienceHint: "Intermediate",
      content: `At heart, it's just this:

> For each cell, look at its left neighbor, itself, and its right neighbor.
> Based on that 3-cell pattern, decide if it will be ON or OFF in the next row.

There are 8 possible combinations of 3 cells:

\`\`\`
111, 110, 101, 100, 011, 010, 001, 000
\`\`\`

Each **rule number** (from 0 to 255) is really just a binary mask, telling the system how to react to each of those 8 combinations.

Take **Rule 30**:

* Binary: \`00011110\`
* Meaning:
  * \`111\` → 0
  * \`110\` → 1
  * \`101\` → 1
  * \`100\` → 1
  * \`011\` → 1
  * \`010\` → 0
  * \`001\` → 0
  * \`000\` → 0

That's it. One number. And from that, everything unfolds.

**Why it's fascinating:**

* There's no memory. Each row only depends on the one above it.
* There's no randomness. It's all deterministic.
* And yet, it *feels* alive.

You're not seeing animation. You're seeing **accumulation**. Each row encodes a consequence of every rule and every seed that came before.`
    },
    technical: {
      title: "Show me the code",
      audienceHint: "Advanced",
      content: `**Rule Lookup Table**:
This converts a rule number (0–255) into an array of 8 booleans that describe how to respond to each neighborhood configuration.

\`\`\`ts
const getRuleLookup = (rule: number): boolean[] => {
  const lookup = new Array(8).fill(false)
  for (let i = 0; i < 8; i++) {
    lookup[i] = (rule & (1 << i)) !== 0
  }
  return lookup
}
\`\`\`

**Rule Application Logic**:
This function walks the current row, gathers neighbors, calculates an index (0–7), and uses the lookup table to determine each new cell.

\`\`\`ts
const applyRule = (cells: number[], ruleLookup: boolean[]): number[] => {
  const newCells = new Array(cells.length).fill(0)
  for (let i = 0; i < cells.length; i++) {
    const left   = cells[(i - 1 + cells.length) % cells.length]
    const center = cells[i]
    const right  = cells[(i + 1) % cells.length]
    const index  = left * 4 + center * 2 + right
    newCells[i] = ruleLookup[index] ? 1 : 0
  }
  return newCells
}
\`\`\`

**Rendering and Architecture Notes:**

* **Canvas 2D** is used for efficient raster-style rendering
* **Circular boundary conditions** avoid hard edges (modulo indexing)
* **\`requestAnimationFrame\`** ensures smooth 60fps updates
* **React refs** manage canvas state without re-renders
* **\`PatternGeneratorProps\`** maintains cross-pattern interface parity

Each generation is stored, stacked, and painted downward—creating a visual time axis. What starts as a 1D system reveals a 2D narrative. History is made visible.`
    }
  }
}