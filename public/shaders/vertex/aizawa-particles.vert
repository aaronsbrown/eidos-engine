// AIDEV-NOTE: Aizawa attractor particle vertex shader with depth-based coloring
// Calculates depth and parameter-dependent effects for the six-parameter Aizawa system

uniform float u_time;
uniform float u_particleSize;
uniform vec3 u_cameraPosition;

varying float v_depth;
varying float v_distanceFromCenter;
varying vec3 v_worldPosition;
varying float v_parameterGradient;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Calculate depth for coloring (0.0 = near, 1.0 = far)
    float depth = -mvPosition.z;
    v_depth = smoothstep(0.8, 6.0, depth);
    
    // Distance from attractor center for additional coloring
    v_distanceFromCenter = length(position);
    
    // World position for advanced effects
    v_worldPosition = position;
    
    // Calculate parameter-dependent gradient for Aizawa-specific coloring
    // The Aizawa system has complex parameter interactions, so we use
    // a combination of spatial coordinates to highlight structure
    float x = position.x;
    float y = position.y;
    float z = position.z;
    
    // Parameter gradient based on the complex nonlinear structure
    // This highlights the six-parameter nature of the system
    v_parameterGradient = (x * x + y * y) * (1.0 + 0.25 * z) + 0.1 * z * x * x * x;
    v_parameterGradient = v_parameterGradient * 0.1; // Normalize for color mapping
    
    // Particle size with depth attenuation
    gl_PointSize = u_particleSize * (250.0 / depth);
}