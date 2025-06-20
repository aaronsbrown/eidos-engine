precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_particleCount;
uniform float u_speed;
uniform float u_brightness;
uniform float u_trailLength;
uniform float u_jitterAmount;

// Hash function for pseudo-random numbers
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// Simple particle position calculation
vec2 getParticlePos(float id) {
  vec2 seed = vec2(id * 12.9898, id * 78.233);
  
  // Different starting positions around the screen
  vec2 startPos = vec2(
    0.2 + 0.6 * hash(seed),
    0.2 + 0.6 * hash(seed + vec2(1.0))
  );
  
  // Random walk with time (controlled by speed)
  float walkScale = 0.15;
  vec2 offset = vec2(
    sin(u_time * 0.8 * u_speed + id * 2.1) * hash(seed + vec2(2.0)) * walkScale,
    cos(u_time * 1.1 * u_speed + id * 1.7) * hash(seed + vec2(3.0)) * walkScale
  );
  
  // Add noise-based jitter for Brownian motion (controlled by jitter amount)
  offset += vec2(
    hash(seed + vec2(u_time * 0.5 * u_speed)) - 0.5,
    hash(seed + vec2(u_time * 0.7 * u_speed)) - 0.5
  ) * u_jitterAmount;
  
  return fract(startPos + offset);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  
  // Aspect ratio correction to prevent stretching
  float aspect = u_resolution.x / u_resolution.y;
  vec2 aspectCorrectedUV = uv;
  aspectCorrectedUV.x *= aspect;
  
  vec3 color = vec3(0.05); // Dark background
  
  // Draw particles with trails (controlled by particle count)
  int maxParticles = int(u_particleCount);
  for(int i = 0; i < 20; i++) {
    if(i >= maxParticles) break;
    
    float particleId = float(i);
    
    // Current position with aspect correction
    vec2 currentPos = getParticlePos(particleId);
    currentPos.x *= aspect;
    float currentDist = length(aspectCorrectedUV - currentPos);
    
    // Adjust particle size based on aspect ratio for consistent circular appearance
    float particleSize = 0.015 / sqrt(aspect);
    float glowSize = 0.025 / sqrt(aspect);
    
    // Draw current particle (bright yellow, controlled by brightness)
    if(currentDist < particleSize) {
      float intensity = 1.0 / (1.0 + currentDist * 400.0 * aspect);
      // Brightness controlled by uniform
      color += vec3(intensity * u_brightness, intensity * u_brightness * 0.75, intensity * u_brightness * 0.15);
      
      // Add extra glow around particle
      if(currentDist < glowSize) {
        float glowIntensity = 1.0 / (1.0 + currentDist * 150.0 * aspect);
        color += vec3(glowIntensity * u_brightness * 0.4, glowIntensity * u_brightness * 0.3, glowIntensity * u_brightness * 0.05);
      }
    }
    
    // Draw trail points (gray, fading, controlled by trail length)
    int maxTrailLength = int(u_trailLength);
    for(int t = 1; t < 15; t++) {
      if(t >= maxTrailLength) break;
      
      float trailTime = u_time - float(t) * 0.1; // Closer trail spacing for better visibility
      
      // Recalculate position at past time
      vec2 seed = vec2(particleId * 12.9898, particleId * 78.233);
      vec2 startPos = vec2(
        0.2 + 0.6 * hash(seed),
        0.2 + 0.6 * hash(seed + vec2(1.0))
      );
      
      float walkScale = 0.15;
      vec2 trailOffset = vec2(
        sin(trailTime * 0.8 * u_speed + particleId * 2.1) * hash(seed + vec2(2.0)) * walkScale,
        cos(trailTime * 1.1 * u_speed + particleId * 1.7) * hash(seed + vec2(3.0)) * walkScale
      );
      
      trailOffset += vec2(
        hash(seed + vec2(trailTime * 0.5 * u_speed)) - 0.5,
        hash(seed + vec2(trailTime * 0.7 * u_speed)) - 0.5
      ) * u_jitterAmount;
      
      vec2 trailPos = fract(startPos + trailOffset);
      trailPos.x *= aspect;
      float trailDist = length(aspectCorrectedUV - trailPos);
      
      // Make trail points larger and more visible
      float trailSize = 0.012 / sqrt(aspect);
      
      if(trailDist < trailSize) {
        float alpha = 1.0 - float(t) / u_trailLength;
        float intensity = 1.0 / (1.0 + trailDist * 600.0 * aspect) * alpha;
        // Make trails much more visible and slightly yellow-tinted
        color += vec3(intensity * 0.8, intensity * 0.75, intensity * 0.4);
      }
    }
  }
  
  // Subtle grid overlay with aspect correction
  vec2 gridUV = uv;
  gridUV.x *= aspect;
  vec2 grid = abs(fract(gridUV * 40.0) - 0.5);
  float gridLine = min(grid.x, grid.y);
  if(gridLine < 0.01) {
    color += vec3(0.008);
  }
  
  gl_FragColor = vec4(color, 1.0);
}