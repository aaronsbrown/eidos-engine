// AIDEV-NOTE: Newton-Leipnik attractor particle vertex shader with butterfly-wing structure analysis
// Calculates depth and folding dynamics-based effects for Newton-Leipnik system visualization

uniform float u_time;
uniform float u_particleSize;
uniform vec3 u_cameraPosition;

varying float v_depth;
varying float v_distanceFromCenter;
varying vec3 v_worldPosition;
varying float v_foldingDynamics;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Calculate depth for coloring (0.0 = near, 1.0 = far)
    float depth = -mvPosition.z;
    v_depth = smoothstep(0.5, 8.0, depth);
    
    // Distance from attractor center for additional coloring
    v_distanceFromCenter = length(position);
    
    // World position for advanced effects
    v_worldPosition = position;
    
    // Calculate folding dynamics measure for Newton-Leipnik-specific coloring
    // Newton-Leipnik features complex folding and butterfly-like structure
    float x = position.x;
    float y = position.y;
    float z = position.z;
    // Measure of folding complexity based on cross-coupling terms (10yz, 5xz, 5xy)
    v_foldingDynamics = abs(y * z + x * z + x * y) * 0.3; // Cross-coupling folding measure
    
    // Particle size with depth attenuation
    gl_PointSize = u_particleSize * (200.0 / depth);
}