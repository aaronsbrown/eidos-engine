// AIDEV-NOTE: Aizawa attractor particle fragment shader with parameter-based coloring
// Implements color schemes that highlight the Aizawa system's six-parameter complexity

uniform float u_time;
uniform float u_opacity;
uniform int u_colorScheme;
uniform float u_depthFading;

varying float v_depth;
varying float v_distanceFromCenter;
varying vec3 v_worldPosition;
varying float v_parameterGradient;

// Color scheme functions adapted for Aizawa attractor
vec3 rainbowDepth(float depth) {
    // Rainbow gradient: near=red, mid=yellow/green, far=blue/purple
    float hue = depth * 0.9; // 0.0 to 0.9 (red to purple)
    return vec3(
        sin(hue * 6.28318) * 0.5 + 0.5,
        sin(hue * 6.28318 + 2.09439) * 0.5 + 0.5,
        sin(hue * 6.28318 + 4.18879) * 0.5 + 0.5
    );
}

vec3 warmCool(float depth) {
    vec3 warm = vec3(1.0, 0.7, 0.3); // Rich amber-orange
    vec3 cool = vec3(0.2, 0.5, 0.9); // Deep blue
    return mix(warm, cool, depth);
}

vec3 parameterGradient(float depth, float paramGrad) {
    // Color based on parameter-dependent structure of Aizawa system
    // This highlights the complex six-parameter interactions
    float gradNorm = clamp(paramGrad * 0.5 + 0.5, 0.0, 1.0); // Normalize to [0,1]
    
    // Use a three-color gradient to show parameter complexity
    vec3 color1 = vec3(0.9, 0.2, 0.4); // Magenta-red
    vec3 color2 = vec3(0.9, 0.8, 0.1); // Golden yellow
    vec3 color3 = vec3(0.1, 0.8, 0.9); // Cyan-blue
    
    vec3 color;
    if (gradNorm < 0.5) {
        color = mix(color1, color2, gradNorm * 2.0);
    } else {
        color = mix(color2, color3, (gradNorm - 0.5) * 2.0);
    }
    
    // Modulate by depth for additional visual information
    return color * (1.0 - depth * 0.4);
}

void main() {
    // Create circular particle shape
    vec2 coord = gl_PointCoord - vec2(0.5, 0.5);
    float distance = length(coord);
    
    // Discard pixels outside circle
    if (distance > 0.5) {
        discard;
    }
    
    // Soft circular falloff with slight inner glow
    float alpha = 1.0 - smoothstep(0.25, 0.5, distance);
    alpha += 0.3 * (1.0 - smoothstep(0.0, 0.1, distance)); // Inner glow
    alpha = clamp(alpha, 0.0, 1.0);
    
    // Apply depth-based color scheme
    vec3 color;
    if (u_colorScheme == 0) {
        color = rainbowDepth(v_depth);
    } else if (u_colorScheme == 1) {
        color = warmCool(v_depth);
    } else {
        color = parameterGradient(v_depth, v_parameterGradient);
    }
    
    // Apply depth fading if enabled
    if (u_depthFading > 0.5) {
        alpha *= (1.0 - v_depth * 0.5);
    }
    
    // Add subtle time-based shimmer influenced by parameter gradient
    float shimmer = sin(u_time * 2.5 + v_parameterGradient * 8.0 + v_distanceFromCenter * 3.0) * 0.12 + 0.88;
    color *= shimmer;
    
    // Add subtle brightness variation based on parameter complexity
    float paramBrightness = 1.0 + 0.2 * sin(v_parameterGradient * 15.0);
    color *= paramBrightness;
    
    gl_FragColor = vec4(color, alpha * u_opacity);
}