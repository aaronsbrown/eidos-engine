// AIDEV-NOTE: Lorenz attractor particle fragment shader with depth-based coloring
// Implements multiple color schemes for enhanced visual depth perception

uniform float u_time;
uniform float u_opacity;
uniform int u_colorScheme;
uniform float u_depthFading;

varying float v_depth;
varying float v_distanceFromCenter;
varying vec3 v_worldPosition;

// Color scheme functions
vec3 rainbowDepth(float depth) {
    // Rainbow gradient: near=red, mid=yellow/green, far=blue/purple
    float hue = depth * 0.7; // 0.0 to 0.7 (red to blue)
    return vec3(
        sin(hue * 6.28318) * 0.5 + 0.5,
        sin(hue * 6.28318 + 2.09439) * 0.5 + 0.5,
        sin(hue * 6.28318 + 4.18879) * 0.5 + 0.5
    );
}

vec3 warmCool(float depth) {
    vec3 warm = vec3(1.0, 0.9, 0.7); // Warm yellow-orange
    vec3 cool = vec3(0.3, 0.4, 0.8); // Cool blue
    return mix(warm, cool, depth);
}

vec3 monochrome(float depth) {
    float intensity = 1.0 - depth * 0.6; // Brighter = closer
    return vec3(intensity, intensity, intensity);
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
    float alpha = 1.0 - smoothstep(0.3, 0.5, distance);
    
    // Apply depth-based color scheme
    vec3 color;
    if (u_colorScheme == 0) {
        color = rainbowDepth(v_depth);
    } else if (u_colorScheme == 1) {
        color = warmCool(v_depth);
    } else {
        color = monochrome(v_depth);
    }
    
    // Apply depth fading if enabled
    if (u_depthFading > 0.5) {
        alpha *= (1.0 - v_depth * 0.7);
    }
    
    // Add subtle time-based shimmer
    float shimmer = sin(u_time * 3.0 + v_distanceFromCenter * 10.0) * 0.1 + 0.9;
    color *= shimmer;
    
    gl_FragColor = vec4(color, alpha * u_opacity);
}