# Cellular Automata: Patterns from First Principles

## Layer 1: “What am I looking at?” (Intuitive / Experiential)

A single yellow pixel. Then another. Then a thousand more—marching downward row by row, like ink dripping from logic itself.

This is a **cellular automaton**, a machine that evolves patterns using nothing but its own local memory. Each row is a generation. Each cell only knows about its two neighbors. There’s no central command. No global planner.

And yet—structure.

Some rules generate fractals. Others chaos. A few bloom with eerie balance, creating motifs that feel intentional, even “designed.”

But it’s all math. Or rather—**emergence**.
This is what complexity looks like when you zoom out.

**Play around:**

* Change the **rule number** and watch the entire universe morph
* Try a single seed vs. a randomized field
* Notice how some rules settle, others never stop writhing
* Rule 30? It’s chaotic enough to power random number generators

This isn’t just visual play. It’s the same logic that powers Turing machines, cryptographic entropy, and even early theories of life.

It’s proof that from nothing but **local decisions**, global intelligence can emerge.

---

## Layer 2: “How does this work?” (Conceptual / Mechanical)

At heart, it’s just this:

> For each cell, look at its left neighbor, itself, and its right neighbor.
> Based on that 3-cell pattern, decide if it will be ON or OFF in the next row.

There are 8 possible combinations of 3 cells:

```
111, 110, 101, 100, 011, 010, 001, 000
```

Each **rule number** (from 0 to 255) is really just a binary mask, telling the system how to react to each of those 8 combinations.

Take **Rule 30**:

* Binary: `00011110`
* Meaning:

  * `111` → 0
  * `110` → 1
  * `101` → 1
  * `100` → 1
  * `011` → 1
  * `010` → 0
  * `001` → 0
  * `000` → 0

That’s it. One number. And from that, everything unfolds.

**Why it’s fascinating:**

* There’s no memory. Each row only depends on the one above it.
* There’s no randomness. It’s all deterministic.
* And yet, it *feels* alive.

You’re not seeing animation. You’re seeing **accumulation**. Each row encodes a consequence of every rule and every seed that came before.

---

## Layer 3: “Show me the code” (Technical / Formal)

**Rule Lookup Table**:
This converts a rule number (0–255) into an array of 8 booleans that describe how to respond to each neighborhood configuration.

```ts
const getRuleLookup = (rule: number): boolean[] => {
  const lookup = new Array(8).fill(false)
  for (let i = 0; i < 8; i++) {
    lookup[i] = (rule & (1 << i)) !== 0
  }
  return lookup
}
```

**Rule Application Logic**:
This function walks the current row, gathers neighbors, calculates an index (0–7), and uses the lookup table to determine each new cell.

```ts
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
```

**Rendering and Architecture Notes:**

* **Canvas 2D** is used for efficient raster-style rendering
* **Circular boundary conditions** avoid hard edges (modulo indexing)
* **`requestAnimationFrame`** ensures smooth 60fps updates
* **React refs** manage canvas state without re-renders
* **`PatternGeneratorProps`** maintains cross-pattern interface parity

Each generation is stored, stacked, and painted downward—creating a visual time axis. What starts as a 1D system reveals a 2D narrative. History is made visible.
