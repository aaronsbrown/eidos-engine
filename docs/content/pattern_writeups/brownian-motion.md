# Brownian Motion Educational Documentation

## Layer 1: "What am I looking at?" (Experiential)

You're watching particles wander.

No destination. No path. Just pure motion.

Each bright yellow dot jitters through space, tracing trails behind it—ghosts of a journey with no plan. Some seem energetic. Some idle. But none repeat. It's like a crowd of microscopic flaneurs, each taking their own unpredictable stroll.

This isn't animation. It's simulation.

What you're seeing is a simplified model of *Brownian motion* — the chaotic movement of particles suspended in a fluid, jostled by invisible molecules all around them. It was first noticed by a botanist looking at pollen under a microscope. Today, the same logic explains how diseases spread, how markets move, and how life itself disperses.

This pattern isn’t *designed* in the usual sense. It's what emerges when randomness has rules.

**Try adjusting:**

* **Particle count** to feel the difference between sparse and crowded systems
* **Trail length** to sense how much of the past you can perceive
* **Speed** to shift the tempo of the dance
* **Jitter amount** to increase or decrease the randomness

What seems chaotic has structure. What seems meaningless, pattern.

And underneath it all, the quiet thrum of probability.

## Layer 2: "How does this work?" (Conceptual)

At its core, Brownian motion is a **random walk**. Each particle takes a small, random step. Then another. Then another. Over time, this produces diffusion: the spread of particles from areas of high concentration to low.

But in this simulation, we're layering a little art on top of the science.

Each particle:

1. **Starts** at a randomized position
2. **Moves** using two combined influences:

   * **Drift:** Smooth sine/cosine waves, added to keep motion dynamic and avoid visual stagnation
   * **Jitter:** Hash-based noise, mimicking the real unpredictability of molecular collisions
3. **Remembers** its past via fading trails, which give shape to each journey

The result is both familiar and strange. Particles wander, but never quite repeat. There's order in the chaos—but not *too* much.

**Why this matters:**

* In science, this behavior models everything from gas diffusion to genetic drift.
* In aesthetics, it shows how complexity can arise from very little input.
* In philosophy, it's a small reminder that systems don't need goals to create meaning. Just enough freedom, and a few good constraints.

This is what emergence looks like.

## Layer 3: "Show me the code" (Technical)

The Brownian simulation runs on the GPU using GLSL (a shading language), ensuring smooth performance even with many particles.

### Position Calculation

Each particle's position is computed as:

```glsl
vec2 getParticlePos(float id) {
  vec2 seed = vec2(id * 12.9898, id * 78.233);

  // Randomized start position
  vec2 startPos = vec2(
    0.2 + 0.6 * hash(seed),
    0.2 + 0.6 * hash(seed + vec2(1.0))
  );

  // Drift: sine/cosine oscillations for smoother paths
  float walkScale = 0.15;
  vec2 offset = vec2(
    sin(u_time * 0.8 * u_speed + id * 2.1) * hash(seed + vec2(2.0)) * walkScale,
    cos(u_time * 1.1 * u_speed + id * 1.7) * hash(seed + vec2(3.0)) * walkScale
  );

  // Jitter: randomness injected via hash noise
  offset += vec2(
    hash(seed + vec2(u_time * 0.5 * u_speed)) - 0.5,
    hash(seed + vec2(u_time * 0.7 * u_speed)) - 0.5
  ) * u_jitterAmount;

  return fract(startPos + offset);
}
```

### Hash Function

Simple pseudo-random generator to ensure stable but unique values:

```glsl
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
```

### Trail Rendering

Past positions are reconstructed by stepping backwards in time and redrawing faded dots—no stored arrays, just pure function-based memory.

**Architectural Highlights:**

* WebGL acceleration for real-time animation
* React integration for UI control
* Real-time parameter updates via uniforms
* All visual logic isolated in shader files

## Closing Reflection

This simulation started as a code exercise. It became something else: a meditation on randomness, structure, and perception.

The fact that it works is satisfying. The fact that it *feels* like something is surprising.

That feeling—of emergence, of witnessing pattern in motion—is what keeps me coming back to projects like this. Not just to build, but to explore. Not just to direct, but to listen.

The dance may be random. But the rhythm, somehow, always finds us.
