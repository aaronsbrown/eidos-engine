# Trigonometric Circle Educational Documentation

## Layer 1: "What is this?" (Intuitive/Experiential)

**What you're seeing:** A dynamic mathematical diagram showing how a point moving around a circle creates the familiar wave patterns of sine and cosine. As a yellow dot travels in a perfect circle, you can see its height and position traced out as smooth waves that repeat endlessly.

**The magic/beauty:** This visualization reveals one of mathematics' most elegant relationships - how circular motion and wave patterns are fundamentally connected. Every time you see a wave (ocean waves, sound waves, radio signals), this circular motion is happening underneath in the mathematical description.

**Interactive experience:**
- **Animation Speed**: Controls how fast the point moves around the circle - slower speeds let you follow the relationships more clearly
- **Real-time Values**: Watch the exact numerical values of sine and cosine update as the angle changes
- **Connection Lines**: Yellow dashed lines show how the circle position directly creates the wave heights
- **Color Coding**: Blue for cosine, teal for sine, yellow for the moving point

**Real-world connections:** This fundamental relationship appears everywhere:
- **Sound and Music**: Audio waveforms, musical harmonics, and instrument tuning
- **Engineering**: AC electrical current, mechanical vibrations, signal processing
- **Physics**: Light waves, quantum mechanics, planetary orbits
- **Computer Graphics**: Animation curves, rotation calculations, 3D rendering
- **Navigation**: GPS satellites, compass readings, coordinate systems

## Layer 2: "How does this work?" (Conceptual/Mechanical)

**The Algorithm:**
1. **Circle Motion**: A point moves around a unit circle at constant angular velocity
2. **Coordinate Extraction**: The X-coordinate of the circle point gives cosine, Y-coordinate gives sine
3. **Wave Construction**: These coordinates are plotted over time to create the classic wave shapes
4. **Visual Connections**: Projection lines show how circle position directly maps to wave values
5. **Continuous Loop**: The pattern repeats every 2π radians (360 degrees)

**Mathematical Foundation:**
- **Unit Circle**: A circle with radius 1 centered at the origin
- **Angular Position**: Angle θ (theta) measured from the positive X-axis
- **Trigonometric Functions**: cos(θ) = x-coordinate, sin(θ) = y-coordinate
- **Periodic Motion**: Both functions repeat every 2π, creating predictable wave patterns
- **Phase Relationship**: Cosine leads sine by π/2 radians (90 degrees)

**Key Properties:**
- **Amplitude**: Both waves oscillate between -1 and +1
- **Period**: Complete cycle every 2π radians or 360 degrees
- **Frequency**: How many cycles occur per unit time (controlled by speed)
- **Phase**: Cosine starts at maximum (1), sine starts at zero
- **Orthogonality**: Sine and cosine are perpendicular - when one is maximum, the other is zero

**Why it works:** The unit circle provides a geometric way to understand trigonometric functions. Instead of memorizing abstract formulas, you can visualize how rotation creates oscillation. This connection explains why trigonometry is so powerful in describing anything that rotates, oscillates, or cycles.

## Layer 3: "Show me the code" (Technical/Formal)

**Core Implementation Details:**

The visualization uses real-time Canvas 2D rendering with mathematical precision. The core calculation loop is in `trigonometric-circle-generator.tsx:88-93`:

```typescript
const angle = timeRef.current
const circleX = centerX + Math.cos(angle) * circleRadius
const circleY = centerY - Math.sin(angle) * circleRadius // Negative for proper Y-axis orientation
```

**Wave Rendering Architecture:**
Sine and cosine waves are generated parametrically (`trigonometric-circle-generator.tsx:126-150`):

```typescript
// Cosine wave generation
for (let x = 0; x < waveWidth; x += 1) {
  const t = (x / waveWidth) * 4 * Math.PI
  const y = cosWaveY - Math.cos(t) * waveAmplitude
  ctx.lineTo(waveStartX + x, y)
}
```

**Real-time Value Display:**
Live trigonometric calculations with formatted output (`trigonometric-circle-generator.tsx:282-293`):

```typescript
const cosText = `cos(${(angle % (2 * Math.PI)).toFixed(2)}) = ${Math.cos(angle).toFixed(3)}`
const sinText = `sin(${(angle % (2 * Math.PI)).toFixed(2)}) = ${Math.sin(angle).toFixed(3)}`
```

**Visual Connection System:**
Projection lines demonstrate the geometric relationship (`trigonometric-circle-generator.tsx:194-223`):
- **Horizontal Projection**: Shows X-component (cosine) relationship
- **Vertical Projection**: Shows Y-component (sine) relationship  
- **Dashed Connection Lines**: Link circle position to corresponding wave points

**Performance Optimizations:**
- **Fixed Layout Calculations**: Wave positions computed once (`trigonometric-circle-generator.tsx:42-48`)
- **Efficient Trail Management**: Circular buffer for particle trails with alpha fade
- **Canvas State Management**: Proper alpha and dash pattern restoration
- **60fps Animation**: `requestAnimationFrame` ensures smooth motion

**Technical Grid System:**
Background grid provides mathematical reference (`trigonometric-circle-generator.tsx:70-84`):

```typescript
// 20px grid spacing for technical precision
for (let x = 0; x < width; x += 20) {
  ctx.moveTo(x, 0)
  ctx.lineTo(x, height)
}
```

**Architecture Integration:**
- Implements standard `PatternGeneratorProps` for control consistency
- Single speed control parameter for educational simplicity  
- Color-coded visualization (blue=cosine, teal=sine, yellow=position)
- Monospace font rendering for precise numerical display
- Technical aesthetic matching the project's blueprint design theme