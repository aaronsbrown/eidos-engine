# TouchDesigner Shader Import Workflow

This directory is designed for importing shader files from TouchDesigner and other external creative coding environments into the Generative Pattern Generator System.

## Overview

The shader loading system supports dynamic loading of external GLSL shaders, making it easy to integrate shaders created in TouchDesigner or other tools into your pattern generators.

## Import Process

### Step 1: Export from TouchDesigner

1. **Create your shader in TouchDesigner** using GLSL MAT or Custom operators
2. **Export the GLSL code**:
   - Right-click on your GLSL MAT → "View GLSL Source"
   - Copy the fragment shader code
   - Note: TouchDesigner vertex shaders often need modification for web use

### Step 2: Prepare for Web Import

TouchDesigner shaders may need adjustments for web compatibility:

**Common Modifications:**
- Replace TouchDesigner-specific uniforms with web-compatible ones
- Adjust precision declarations (add `precision mediump float;` at the top)
- Convert TouchDesigner input/output variables to web standards
- Replace TD-specific functions with web-compatible alternatives

**TouchDesigner → Web Uniform Mapping:**
```glsl
// TouchDesigner
uniform float uTime;
uniform vec2 uRes;

// Web Standard
uniform float u_time;
uniform vec2 u_resolution;
```

### Step 3: Place Files in Directory

1. **Save fragment shader** as `your-shader-name.frag` in this directory
2. **Create vertex shader** (usually use `fullscreen-quad.vert` for most cases)
3. **Test the import** by creating a pattern generator component

### Step 4: Integration

Create a new pattern generator that uses your imported shader:

```typescript
// In your pattern generator component
import { loadShader, createShaderProgram } from "@/lib/shader-loader"

// Load your TouchDesigner shader
const shaderProgram = await loadShader('your-shader-name')
const program = createShaderProgram(gl, shaderProgram.vertex, shaderProgram.fragment)
```

## Directory Structure

```
touchdesigner-imports/
├── README.md                    # This file
├── example-td-shader.frag       # Example imported shader
├── particle-system.frag         # Complex particle system from TD
└── generative-patterns/         # Organized by project/theme
    ├── noise-based/
    ├── particle-systems/
    └── geometric-patterns/
```

## Common TouchDesigner Conversions

### Texture Sampling
```glsl
// TouchDesigner
texture(sTD2DInputs[0], uv)

// Web Standard  
texture2D(u_texture, uv)
```

### Time and Resolution
```glsl
// TouchDesigner
uniform float uTime;
uniform vec2 uRes;

// Web Standard
uniform float u_time;
uniform vec2 u_resolution;
```

### Output
```glsl
// TouchDesigner
out vec4 fragColor;
fragColor = vec4(color, 1.0);

// Web Standard
gl_FragColor = vec4(color, 1.0);
```

## Best Practices

1. **Test in isolation**: Test each imported shader individually before integration
2. **Document parameters**: Add comments explaining what each uniform controls  
3. **Performance considerations**: TouchDesigner shaders may need optimization for 60fps web performance
4. **Preserve attribution**: Keep comments crediting the original TouchDesigner artist/developer
5. **Version control**: Use meaningful commit messages when adding new imported shaders

## Example Workflow

1. Create noise field in TouchDesigner
2. Export fragment shader to `noise-field-td.frag`
3. Modify uniforms for web compatibility
4. Test with development server
5. Create pattern generator component
6. Add to pattern generator exports

## Troubleshooting

**Common Issues:**
- **Shader compilation errors**: Check precision declarations and uniform names
- **Performance issues**: Reduce loop iterations or complex calculations
- **Visual differences**: TouchDesigner and WebGL may render slightly differently
- **Uniform binding**: Ensure all uniforms are properly declared and set

**Debug Tips:**
- Use browser DevTools to check console for shader compilation errors
- Start with simple shaders before importing complex ones
- Compare side-by-side with TouchDesigner output
- Use the shader cache clearing function during development

## Contributing

When adding new TouchDesigner imports:
1. Place files in appropriate subdirectories
2. Update this README with new examples if needed
3. Add shader schema to `lib/shader-types.ts` for type safety
4. Test thoroughly before committing

For questions or issues with TouchDesigner imports, check the main project documentation or create an issue in the repository.