// AIDEV-NOTE: Newton-Leipnik attractor particle fragment shader with folding dynamics-based coloring
// Implements color schemes that highlight the Newton-Leipnik system's butterfly structure and folding properties

uniform float u_time;
uniform float u_opacity;
uniform int u_colorScheme;
uniform float u_depthFading;

varying float v_depth;
varying float v_distanceFromCenter;
varying vec3 v_worldPosition;
varying float v_foldingDynamics;

// Color scheme functions adapted for Newton-Leipnik attractor
vec3 rainbowDepth(float depth) {
    // Rainbow gradient: near=red, mid=yellow/green, far=blue/purple
    float hue = depth * 0.8; // 0.0 to 0.8 (red to blue/purple)
    return vec3(
        sin(hue * 6.28318) * 0.5 + 0.5,
        sin(hue * 6.28318 + 2.09439) * 0.5 + 0.5,
        sin(hue * 6.28318 + 4.18879) * 0.5 + 0.5
    );
}

vec3 warmCool(float depth) {
    vec3 warm = vec3(1.0, 0.8, 0.4); // Warmer orange-yellow
    vec3 cool = vec3(0.2, 0.6, 0.9); // Cooler blue-cyan
    return mix(warm, cool, depth);
}

vec3 butterflyGradient(float depth, float folding) {
    // Color based on butterfly-wing structure and folding dynamics of Newton-Leipnik system
    float foldingNorm = clamp(folding / 2.0, 0.0, 1.0); // Normalize folding component
    vec3 wing = vec3(0.9, 0.5, 0.2);     // Orange butterfly wing
    vec3 body = vec3(0.2, 0.4, 0.8);     // Blue butterfly body
    return mix(body, wing, foldingNorm) * (1.0 - depth * 0.3);
}

void main() {
    // Create circular particle shape
    vec2 coord = gl_PointCoord - vec2(0.5, 0.5);
    float distance = length(coord);
    
    // Discard pixels outside circle
    if (distance > 0.5) {
        discard;
    }
    
    // Soft circular falloff
    float alpha = 1.0 - smoothstep(0.2, 0.5, distance);
    
    // Apply depth-based color scheme
    vec3 color;
    if (u_colorScheme == 0) {
        color = rainbowDepth(v_depth);
    } else if (u_colorScheme == 1) {
        color = warmCool(v_depth);
    } else {
        color = butterflyGradient(v_depth, v_foldingDynamics);
    }
    
    // Apply depth fading if enabled
    if (u_depthFading > 0.5) {
        alpha *= (1.0 - v_depth * 0.6);
    }
    
    // Add subtle time-based shimmer influenced by folding dynamics
    float shimmer = sin(u_time * 1.2 + v_foldingDynamics * 2.5) * 0.15 + 0.85;
    color *= shimmer;
    
    gl_FragColor = vec4(color, alpha * u_opacity);
}