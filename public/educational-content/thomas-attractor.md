## Layer 1: "What is this?" (Intuitive/Experiential)

The Thomas Attractor is an elegant, flowing pattern with three interconnected spirals dancing in perfect, cyclic symmetry. Unlike the Lorenz attractor’s butterfly shape, Thomas flows with a softer, breathing motion as particles trace curved paths through 3D space. Driven by sinusoidal forces, the system pushes and pulls particles into organic, wave-like trajectories that never quite repeat—but always retain their graceful structure. With interactive 3D camera controls, you can orbit around the chaos and uncover hidden symmetries in its dance.

## Layer 2: "How does this work?" (Conceptual/Mechanical)

The system is described by three coupled differential equations using sine functions and a single damping parameter b. Each coordinate influences the next in a cycle: x → y → z → x. That cyclic symmetry means you can rotate the variables and the equations still hold—a key reason Thomas looks so balanced.

The damping parameter b controls the attractor’s behavior:
 • High b dampens motion into stable fixed points.
 • Around b ≈ 0.2–0.21, the system enters chaos, showing the classic flowing attractor.
 • At b = 0, the system becomes conservative, wandering more like a 3D random walk.

In the 3D demo, WebGL and Three.js render thousands of particles in real time. The shaders use depth-based coloring to visually emphasize symmetry and phase structure—so you can feel the math as you watch it.

## Layer 3: "Show me the code" (Technical/Formal)

Here’s how Thomas is implemented using simple Euler integration:

```typescript
// In src/lib/math/thomas.ts
export function calculateThomasPoint(
  x: number, y: number, z: number,
  b: number, dt: number
): { newX: number; newY: number; newZ: number } {
  const dx = Math.sin(y) - b * x;
  const dy = Math.sin(z) - b * y;
  const dz = Math.sin(x) - b * z;

  return {
    newX: x + dx * dt,
    newY: y + dy * dt,
    newZ: z + dz * dt,
  };
}
```

This structure reveals the cyclic symmetry—each axis is driven by the sine of the next and damped by b. The Three.js component wraps this logic, using GPU-accelerated WebGL shaders for smooth performance and visual depth. Vertex and fragment shaders handle particle position and rendering, highlighting layers and structural symmetry.
