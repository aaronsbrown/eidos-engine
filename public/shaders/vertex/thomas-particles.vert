// AIDEV-NOTE: Thomas attractor particle vertex shader with depth-based coloring
// Calculates depth and cyclic symmetry-based effects for Thomas system visualization

uniform float u_time;
uniform float u_particleSize;
uniform vec3 u_cameraPosition;

varying float v_depth;
varying float v_distanceFromCenter;
varying vec3 v_worldPosition;
varying float v_cyclicSymmetry;

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
    
    // Calculate cyclic symmetry measure for Thomas-specific coloring
    // Thomas has cyclic symmetry in x,y,z so we use rotational variance
    float x = position.x;
    float y = position.y;
    float z = position.z;
    v_cyclicSymmetry = sin(x) + sin(y) + sin(z);
    
    // Particle size with depth attenuation
    gl_PointSize = u_particleSize * (200.0 / depth);
}