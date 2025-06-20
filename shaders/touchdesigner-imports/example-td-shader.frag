// Example TouchDesigner shader converted for web use
// Original: Simple animated noise pattern from TouchDesigner
// Converted: 2024-06-20 - Web-compatible version

precision mediump float;

// Web-compatible uniforms (converted from TouchDesigner)
uniform vec2 u_resolution;  // Was: uniform vec2 uRes;
uniform float u_time;       // Was: uniform float uTime;

// Additional uniforms for pattern control
uniform float u_noiseScale;
uniform float u_speed;
uniform float u_brightness;

// Simple hash function for noise
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// 2D noise function
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  // Four corners
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  // Smooth interpolation
  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  // Normalize coordinates (TouchDesigner conversion)
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  // Center coordinates
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y; // Aspect ratio correction

  // Animated noise sampling
  float n = noise(uv * u_noiseScale + u_time * u_speed);

  // Create color based on noise
  vec3 color = vec3(n) * u_brightness;

  // Add some variation
  color.r += sin(u_time + uv.x) * 0.1;
  color.g += cos(u_time + uv.y) * 0.1;

  // Output (converted from TouchDesigner out variable)
  gl_FragColor = vec4(color, 1.0);  // Was: fragColor = vec4(color, 1.0);
}