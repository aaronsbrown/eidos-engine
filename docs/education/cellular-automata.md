# Cellular Automata Educational Documentation

## Layer 1: "What is this?" (Intuitive/Experiential)

**What you're seeing:** A digital evolution machine that grows patterns downward, one row at a time.

Imagine you're watching a microscopic civilization evolve. Each yellow square is a "living" cell, and each black square is "empty space." The pattern starts with just one or a few cells at the top, then follows a simple rule to decide what happens in the next generation below.

**The magic:** Even though the rule is incredibly simple (just looking at three neighboring cells), it creates surprisingly complex and beautiful patterns. Some rules create fractals, others make repeating patterns, and some dissolve into chaos. Rule 30 (a popular one) is so random-looking that it's actually used in random number generators!

**Interactive experience:** 
- Watch how changing the rule number completely transforms the pattern
- Notice how a single cell can spawn intricate, seemingly intelligent designs
- Try different starting conditions - a single cell vs. random scattered cells vs. a centered cell

This is emergence in action - complex behavior arising from simple rules.

## Layer 2: "How does this work?" (Conceptual/Mechanical)

**The Algorithm:**

1. **Setup:** Start with a row of cells (either a single active cell, random pattern, or centered cell)

2. **Rule Application:** For each cell in the current row, look at itself and its two neighbors (left, center, right)

3. **Pattern Matching:** The three cells create one of 8 possible patterns:
   ```
   111  110  101  100  011  010  001  000
   ```

4. **Rule Lookup:** Each rule number (0-255) is actually a binary number that tells you what happens for each of the 8 patterns. For example, Rule 30 in binary is `00011110`, which means:
   - Pattern 111 → 0 (cell dies)
   - Pattern 110 → 1 (cell lives)  
   - Pattern 101 → 1 (cell lives)
   - Pattern 100 → 1 (cell lives)
   - Pattern 011 → 1 (cell lives)
   - Pattern 010 → 0 (cell dies)
   - Pattern 001 → 0 (cell dies)
   - Pattern 000 → 0 (cell dies)

5. **Evolution:** Apply this rule simultaneously to every cell to create the next generation row

6. **Visualization:** Each generation is drawn as a horizontal row, with time flowing downward

**Why it works:** This is a 1D cellular automaton. Unlike Conway's Game of Life (which is 2D), this system evolves in just one dimension but displays its history over time, creating 2D patterns from 1D evolution.

## Layer 3: "Show me the code" (Technical/Formal)

**Core Implementation Details:**

The cellular automaton is implemented as a React component using Canvas 2D rendering with these key functions:

**Rule Lookup Generation** (cellular-automaton-generator.tsx:43-49):
```typescript
const getRuleLookup = (rule: number): boolean[] => {
  const lookup: boolean[] = new Array(8)
  for (let i = 0; i < 8; i++) {
    lookup[i] = (rule & (1 << i)) !== 0
  }
  return lookup
}
```
This converts a rule number (0-255) into a lookup table for the 8 possible neighborhood patterns.

**Rule Application** (cellular-automaton-generator.tsx:73-90):
```typescript
const applyRule = (cells: number[], ruleLookup: boolean[]): number[] => {
  const newCells = new Array(cells.length).fill(0)
  
  for (let i = 0; i < cells.length; i++) {
    // Get left, center, right neighbors (wrap around edges)
    const left = cells[(i - 1 + cells.length) % cells.length]
    const center = cells[i]
    const right = cells[(i + 1) % cells.length]
    
    // Convert to binary index (left=4, center=2, right=1)
    const index = left * 4 + center * 2 + right
    
    // Apply rule
    newCells[i] = ruleLookup[index] ? 1 : 0
  }
  
  return newCells
}
```

**Key Technical Features:**

- **Wraparound boundaries:** Edge cells use modulo arithmetic to treat the array as circular
- **Binary indexing:** Neighborhood patterns are converted to indices (0-7) using bit weights
- **History tracking:** All generations are stored in `historyRef.current` for visualization
- **Real-time controls:** Rule changes immediately reset and regenerate the pattern
- **Performance optimization:** Uses `requestAnimationFrame` for smooth 60fps animation

**Architecture Integration:**
- Implements `PatternGeneratorProps` interface for consistency
- Uses React refs for canvas manipulation and state management
- Integrates with the control panel system for interactive parameter adjustment
- Follows the project's technical aesthetic with yellow accents and monospace typography

The visualization renders each generation as a horizontal strip, creating a space-time diagram where horizontal position represents cell location and vertical position represents time progression.