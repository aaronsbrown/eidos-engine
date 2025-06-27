// AIDEV-NOTE: Lorenz attractor particle vertex shader with depth-based coloring
// Calculates depth and passes it to fragment shader for color interpolation

uniform float u_time;
uniform float u_particleSize;
uniform vec3 u_cameraPosition;

varying float v_depth;
varying float v_distanceFromCenter;
varying vec3 v_worldPosition;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Calculate depth for coloring (0.0 = near, 1.0 = far)
    float depth = -mvPosition.z;
    v_depth = smoothstep(1.0, 10.0, depth);
    
    // Distance from attractor center for additional coloring
    v_distanceFromCenter = length(position);
    
    // World position for advanced effects
    v_worldPosition = position;
    
    // Particle size with depth attenuation
    gl_PointSize = u_particleSize * (300.0 / depth);
}