# 3D Pattern Development Guide

## Overview

This guide explains how to create 3D WebGL visualizations using our standardized Three.js infrastructure. The system provides reusable camera controls, shader integration, and user education components.

## Quick Start

### 1. Basic Three.js Pattern

```typescript
import ThreeJSCanvas from "@/components/three-js/ThreeJSCanvas"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

function MyPattern({ controls }: { controls: MyControls }) {
  // Your 3D objects and animation logic
  return <mesh>...</mesh>
}

const MyPatternGenerator: React.FC<PatternGeneratorProps> = ({ width, height, controlValues }) => {
  const controls = useMemo(() => ({
    // Parse controlValues with defaults
  }), [controlValues])

  return (
    <ThreeJSCanvas
      width={width}
      height={height}
      preset="orbital"  // or "close-up", "wide-view"
      showInstructions={true}
    >
      <MyPattern controls={controls} />
    </ThreeJSCanvas>
  )
}
```

### 2. Camera Presets

Choose the appropriate preset for your visualization:

- **`orbital`**: General purpose, medium distance, full controls (default)
- **`close-up`**: For detailed/intricate patterns, closer view, tighter zoom limits
- **`wide-view`**: For large-scale patterns, distant view, wider zoom range

### 3. Custom Camera Configuration

```typescript
<ThreeJSCanvas
  preset="orbital"
  customCamera={{
    position: [5, 3, 5],      // Override camera position
    minDistance: 2,           // Closest zoom
    maxDistance: 15,          // Furthest zoom
    enablePan: false,         // Disable panning
    target: [0, 1, 0]         // Look at specific point
  }}
>
```

## Advanced Features

### Custom Shader Integration

Use external shaders with Three.js materials:

```typescript
import { createThreeJSShaderMaterial, updateShaderUniforms } from "@/lib/threejs-shader-utils"

// In your component
const material = useMemo(async () => {
  if (controls.useCustomShader) {
    return await createThreeJSShaderMaterial('my-pattern', undefined, {
      u_customParam: { value: controls.someValue }
    })
  }
  return new THREE.MeshBasicMaterial({ color: controls.color })
}, [controls.useCustomShader, controls.someValue])

// In animation loop
useFrame(({ clock }) => {
  if (material instanceof THREE.ShaderMaterial) {
    updateShaderUniforms(material, clock.elapsedTime)
  }
})
```

### Performance Optimization

1. **Use `useMemo` for geometry and materials**
2. **Update positions in-place** rather than recreating
3. **Limit particle counts** with platform-specific defaults
4. **Use `sizeAttenuation: true`** for distance-based particle sizing

### User Education

The `ThreeJSCanvas` component automatically shows instruction tooltips:

```typescript
<ThreeJSCanvas
  showInstructions={true}  // Default: true
  // Instructions appear as overlay: "🖱️ Drag to orbit", etc.
>
```

## Pattern Definition

Add your pattern to the index with appropriate metadata:

```typescript
{
  id: "my-3d-pattern",
  name: "My 3D Pattern",
  component: MyPatternGenerator,
  technology: 'WEBGL_2.0',
  category: 'Simulation',
  isInteractive: true,
  semantics: {
    dimensionality: "True3D_WebGL",
    interactionStyle: "MouseControl3D",
    // ...
  },
  controls: [
    // Include useCustomShader checkbox for shader-enhanced patterns
    {
      id: "useCustomShader",
      label: "Enhanced Rendering",
      type: "checkbox",
      defaultValue: false,
      description: "Enable custom shader effects for enhanced visual quality.",
      role: "VisualAesthetic",
      group: "Visual Effects"
    }
  ]
}
```

## Examples

### Particle System

```typescript
function ParticlePattern({ controls }) {
  const pointsRef = useRef<THREE.Points>(null)
  
  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(controls.particleCount * 3)
    // Initialize positions...
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [controls.particleCount])

  useFrame(() => {
    if (!pointsRef.current) return
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    // Update positions...
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return <points ref={pointsRef} geometry={geometry} material={material} />
}
```

### Mesh-based Pattern

```typescript
function MeshPattern({ controls }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = clock.elapsedTime * controls.rotationSpeed
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={controls.color} />
    </mesh>
  )
}
```

## Migration from Manual WebGL

1. **Replace Canvas setup** with `<ThreeJSCanvas>`
2. **Convert shader materials** using `createThreeJSShaderMaterial`
3. **Use Three.js geometries** instead of manual buffer management
4. **Replace manual camera math** with OrbitControls preset
5. **Keep external shaders** but load them through Three.js utilities

## Best Practices

- **Start with built-in materials**, add custom shaders later
- **Use semantic control grouping** ("Simulation Parameters", "Visual Effects", etc.)
- **Provide platform-specific defaults** for performance-intensive controls
- **Test on mobile devices** with reduced particle counts
- **Document pattern-specific camera requirements** in comments
- **Use TypeScript interfaces** for control value typing

## Troubleshooting

### Black Screen
- Check camera position and target
- Verify geometry has proper positions
- Ensure materials are visible (not transparent with alpha=0)

### Poor Performance  
- Reduce particle count on mobile
- Use simpler materials for high particle counts
- Check for memory leaks in geometry/material updates

### Camera Issues
- Try different presets: "close-up" vs "orbital" vs "wide-view"
- Adjust minDistance/maxDistance for your pattern scale
- Set appropriate target point for your visualization center