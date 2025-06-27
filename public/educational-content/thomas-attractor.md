## Layer 1: "What is this?" (Intuitive/Experiential)

The Thomas Attractor is an elegant, flowing pattern that exhibits beautiful cyclic symmetry - imagine three interconnected spirals dancing together in perfect mathematical harmony. Unlike the butterfly shape of the Lorenz Attractor, the Thomas system creates smooth, curved trajectories that seem to breathe and pulse as they trace their paths through 3D space. The particles follow sinusoidal forces that push and pull them in cyclically symmetric ways, creating organic, wave-like motions that never quite repeat but always maintain their graceful structure. With interactive 3D camera controls, you can explore this chaotic dance from any angle, discovering hidden patterns and symmetries.


## Layer 2: "How does this work?" (Conceptual/Mechanical)

The Thomas Attractor is governed by a beautifully simple system of three differential equations that use sine functions and a single damping parameter 'b'. Each coordinate influences the next in a cyclic pattern: x affects z, z affects y, and y affects x. This cyclic symmetry means you can rotate the variable names and get the exact same system - a mathematical property that creates the attractor's balanced, symmetric appearance. The damping parameter 'b' controls how dissipative the system is: higher values lead to stable fixed points, while lower values (around 0.208) produce rich chaotic behavior with the characteristic flowing patterns. The 3D visualization uses WebGL and Three.js to render thousands of particles in real-time, with advanced shaders that highlight the mathematical structure through depth-based coloring and the unique cyclic symmetry properties.


## Layer 3: "Show me the code" (Technical/Formal)

The Thomas Attractor is implemented using three coupled differential equations with sinusoidal nonlinearities and cyclic symmetry. The system is advanced using Euler's method for numerical integration.

```typescript
// In src/lib/math/thomas.ts
export function calculateThomasPoint(
  x: number, y: number, z: number,
  b: number, dt: number
): { newX: number; newY: number; newZ: number } {
  const dx = Math.sin(y) - b * x;
  const dy = Math.sin(z) - b * y;
  const dz = Math.sin(x) - b * z;

  const newX = x + dx * dt;
  const newY = y + dy * dt;
  const newZ = z + dz * dt;

  return { newX, newY, newZ };
}
```

The equations show the cyclic symmetry clearly: each variable is driven by the sine of the next variable and damped by the parameter 'b'. The 3D visualization (src/components/pattern-generators/thomas-attractor-generator.tsx) uses the ThreeJSCanvas framework with WebGL shaders for enhanced performance and visual effects. The custom shaders (public/shaders/vertex/thomas-particles.vert and thomas-particles.frag) implement depth-based coloring and highlight the cyclic symmetry through specialized color schemes that respond to the mathematical structure of the attractor.