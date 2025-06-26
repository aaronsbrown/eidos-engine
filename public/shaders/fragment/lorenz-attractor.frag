precision mediump float;

uniform float u_time;
uniform vec3 u_cameraPosition;
uniform float u_pointBrightness;

// Simple distance-based coloring and alpha
void main() {
  // Create circular point shape
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  
  if (dist > 0.5) {
    discard;
  }
  
  // Distance from center affects alpha for soft edges
  float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
  
  // Basic yellow color with slight animation
  vec3 color = vec3(1.0, 0.8, 0.2);
  
  // Add some time-based variation
  color += 0.1 * sin(u_time * 2.0 + gl_FragCoord.x * 0.01);
  
  gl_FragColor = vec4(color * u_pointBrightness, alpha * 0.7);
}