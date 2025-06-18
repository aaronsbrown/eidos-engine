"use client"

import { useEffect, useRef, useMemo } from "react"
import type { PatternGeneratorProps } from "./types"

interface ParticleSystemControls {
  particleCount: number
  lifeExpectancy: number
  lifeVariation: number
  particleSize: number
  spawnRate: number
  movementSpeed: number
  curlStrength: number
  gravity: number
  colorPalette: 'classic' | 'fire' | 'plasma' | 'ice' | 'electric'
  brightness: number
  enableTrails: boolean
  trailDecay: number
  trailQuality: 'low' | 'medium' | 'high'
  reset?: boolean
}

export default function ParticleSystemGenerator({ 
  width, 
  height, 
  className = "",
  controlValues,
  onControlChange
}: PatternGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const timeRef = useRef<number>(0)
  const framebufferRef = useRef<WebGLFramebuffer | null>(null)
  const textureRef = useRef<WebGLTexture | null>(null)
  const feedbackTextureRef = useRef<WebGLTexture | null>(null)
  
  // Use passed control values or defaults
  const controls: ParticleSystemControls = useMemo(() => ({
    particleCount: (controlValues?.particleCount as number) ?? 50,
    lifeExpectancy: (controlValues?.lifeExpectancy as number) ?? 5.0,
    lifeVariation: (controlValues?.lifeVariation as number) ?? 50,
    particleSize: (controlValues?.particleSize as number) ?? 8,
    spawnRate: (controlValues?.spawnRate as number) ?? 25,
    movementSpeed: (controlValues?.movementSpeed as number) ?? 1.0,
    curlStrength: (controlValues?.curlStrength as number) ?? 1.0,
    gravity: (controlValues?.gravity as number) ?? 0.0,
    colorPalette: (controlValues?.colorPalette as 'classic' | 'fire' | 'plasma' | 'ice' | 'electric') ?? 'classic',
    brightness: (controlValues?.brightness as number) ?? 3.0,
    enableTrails: (controlValues?.enableTrails as boolean) ?? true,
    trailDecay: (controlValues?.trailDecay as number) ?? 0.95,
    trailQuality: (controlValues?.trailQuality as 'low' | 'medium' | 'high') ?? 'medium',
    reset: (controlValues?.reset as boolean) ?? false
  }), [controlValues])

  // Handle reset functionality
  useEffect(() => {
    if (controls.reset) {
      timeRef.current = 0 // Reset simulation time
      // Optionally reset the control back to false after reset
      if (onControlChange) {
        setTimeout(() => onControlChange('reset', false), 100)
      }
    }
  }, [controls.reset, onControlChange])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Initialize WebGL
    const glContext = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    if (!glContext) {
      console.error("WebGL not supported")
      return
    }

    const gl = glContext as WebGLRenderingContext
    glRef.current = gl
    canvas.width = width
    canvas.height = height
    gl.viewport(0, 0, width, height)

    // Vertex shader source
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `

    // Fragment shader source - Advanced particle system with curl noise
    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_particleCount;
      uniform float u_lifeExpectancy;
      uniform float u_lifeVariation;
      uniform float u_particleSize;
      uniform float u_spawnRate;
      uniform float u_movementSpeed;
      uniform float u_curlStrength;
      uniform float u_gravity;
      uniform float u_colorPalette;
      uniform float u_brightness;
      uniform float u_enableTrails;
      uniform float u_trailDecay;
      uniform float u_trailQuality;
      uniform sampler2D u_feedbackTexture;

      // Hash functions for pseudo-random numbers
      float hash(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * 0.1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
      }

      float hash21(vec2 p) {
        return hash(p);
      }

      vec2 hash22(vec2 p) {
        return vec2(hash(p), hash(p + vec2(1.0)));
      }

      // 3D Simplex noise implementation (simplified for GLSL)
      vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }

      vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }

      vec4 permute(vec4 x) {
        return mod289(((x*34.0)+1.0)*x);
      }

      vec4 taylorInvSqrt(vec4 r) {
        return 1.79284291400159 - 0.85373472095314 * r;
      }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
      
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
      
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
      
        i = mod289(i);
        vec4 p = permute(permute(permute(
                   i.z + vec4(0.0, i1.z, i2.z, 1.0))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
      
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
      
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
      
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
      
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
      
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
      
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
      
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      // Curl noise function
      vec2 curl(vec2 p, float time) {
        float eps = 0.01;
        float n1 = snoise(vec3(p.x, p.y + eps, time * 0.2));
        float n2 = snoise(vec3(p.x, p.y - eps, time * 0.2));
        float n3 = snoise(vec3(p.x + eps, p.y, time * 0.2));
        float n4 = snoise(vec3(p.x - eps, p.y, time * 0.2));
        
        float dx = (n1 - n2) / (2.0 * eps);
        float dy = -(n3 - n4) / (2.0 * eps);
        
        return vec2(dx, dy) * u_curlStrength;
      }

      // Get particle lifecycle info
      float getParticleLife(float id) {
        vec2 seed = vec2(id * 12.9898, id * 78.233);
        float baseLife = u_lifeExpectancy;
        float variation = u_lifeVariation / 100.0;
        float lifeVariance = (hash(seed) - 0.5) * 2.0 * variation;
        return baseLife * (1.0 + lifeVariance);
      }

      // Get particle birth time with cycling respawn
      float getParticleBirthTime(float id, float currentTime) {
        vec2 seed = vec2(id * 45.126, id * 23.987);
        float life = getParticleLife(id);
        
        // Spawn rate affects how often particles respawn (higher rate = shorter gaps)
        float spawnGap = 10.0 / u_spawnRate; // Inverse relationship
        float cycleLength = life + spawnGap;
        float offset = hash(seed) * cycleLength; // Stagger initial spawns
        
        // Calculate which cycle we're in
        float cycleTime = mod(currentTime + offset, cycleLength);
        return currentTime - cycleTime;
      }

      // Calculate particle position with curl noise physics
      vec2 getParticlePos(float id, float currentTime) {
        float birthTime = getParticleBirthTime(id, currentTime);
        float life = getParticleLife(id);
        float age = currentTime - birthTime;
        
        // Particle hasn't been born yet or is dead (in gap period)
        if (age < 0.0 || age > life) {
          return vec2(-10.0); // Off-screen
        }
        
        vec2 seed = vec2(id * 12.9898, id * 78.233);
        
        // Starting position (spawn around edges or center based on ID)
        vec2 startPos;
        float spawnType = hash(seed + vec2(100.0));
        if (spawnType < 0.3) {
          // Spawn from edges
          if (hash(seed + vec2(200.0)) < 0.5) {
            startPos = vec2(hash(seed) < 0.5 ? 0.1 : 0.9, 0.2 + 0.6 * hash(seed + vec2(1.0)));
          } else {
            startPos = vec2(0.2 + 0.6 * hash(seed + vec2(1.0)), hash(seed + vec2(2.0)) < 0.5 ? 0.1 : 0.9);
          }
        } else {
          // Spawn from center area
          startPos = vec2(0.3 + 0.4 * hash(seed), 0.3 + 0.4 * hash(seed + vec2(1.0)));
        }
        
        // Simplified physics simulation using direct noise sampling instead of loop
        vec2 pos = startPos;
        
        // Sample curl noise at current age for position offset
        vec2 curlOffset = curl(startPos * 8.0 + vec2(age * 0.1), birthTime + age) * age * u_movementSpeed * 0.1;
        
        // Apply gravity over time
        vec2 gravityOffset = vec2(0.0, u_gravity * age * age * 0.01);
        
        // Update position with accumulated forces
        pos += curlOffset + gravityOffset;
        
        // Wrap around screen boundaries
        pos = fract(pos);
        
        return pos;
      }

      // Get particle color based on age and palette
      vec3 getParticleColor(float age, float life, float paletteIndex) {
        float ageRatio = age / life;
        
        if (paletteIndex < 0.5) { // classic
          float intensity = 1.0 - ageRatio * 0.7;
          return vec3(intensity * 1.0, intensity * 0.8, intensity * 0.2);
        } else if (paletteIndex < 1.5) { // fire
          vec3 young = vec3(1.0, 0.8, 0.0);
          vec3 old = vec3(1.0, 0.2, 0.0);
          return mix(young, old, ageRatio);
        } else if (paletteIndex < 2.5) { // plasma
          return vec3(
            0.5 + 0.5 * sin(ageRatio * 6.28 + 0.0),
            0.5 + 0.5 * sin(ageRatio * 6.28 + 2.09),
            0.5 + 0.5 * sin(ageRatio * 6.28 + 4.18)
          );
        } else if (paletteIndex < 3.5) { // ice
          vec3 young = vec3(0.8, 0.9, 1.0);
          vec3 old = vec3(0.3, 0.5, 0.8);
          return mix(young, old, ageRatio);
        } else { // electric
          vec3 young = vec3(0.2, 1.0, 0.8);
          vec3 old = vec3(0.8, 0.2, 1.0);
          return mix(young, old, ageRatio);
        }
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        
        // Aspect ratio correction
        float aspect = u_resolution.x / u_resolution.y;
        vec2 aspectCorrectedUV = uv;
        aspectCorrectedUV.x *= aspect;
        
        // Simple background - trails will be handled by clear behavior
        vec3 color = vec3(0.01);
        
        // Draw particles
        int maxParticles = int(u_particleCount);
        for(int i = 0; i < 100; i++) {
          if(i >= maxParticles) break;
          
          float particleId = float(i);
          vec2 particlePos = getParticlePos(particleId, u_time);
          
          // Skip off-screen particles
          if (particlePos.x < -1.0) continue;
          
          // Apply aspect correction to particle position
          particlePos.x *= aspect;
          
          float dist = length(aspectCorrectedUV - particlePos);
          
          // Calculate particle age for color and size
          float birthTime = getParticleBirthTime(particleId, u_time);
          float life = getParticleLife(particleId);
          float age = u_time - birthTime;
          
          if (age < 0.0 || age > life) continue;
          
          float ageRatio = age / life;
          float sizeMultiplier = 1.0 - ageRatio * 0.5; // Particles shrink with age
          
          // Particle size with aspect correction
          float particleSize = (u_particleSize / 800.0) * sizeMultiplier / sqrt(aspect);
          float glowSize = particleSize * 2.0;
          
          // Draw particle core - significantly brighter
          if(dist < particleSize) {
            float intensity = 1.0 / (1.0 + dist * 400.0 * aspect); // Reduced falloff for brighter core
            vec3 particleColor = getParticleColor(age, life, u_colorPalette);
            color += particleColor * intensity * u_brightness * (1.0 - ageRatio * 0.2);
          }
          
          // Draw particle glow - much more prominent
          if(dist < glowSize) {
            float glowIntensity = 1.0 / (1.0 + dist * 100.0 * aspect); // Much larger, softer glow
            vec3 particleColor = getParticleColor(age, life, u_colorPalette);
            color += particleColor * glowIntensity * u_brightness * 0.8 * (1.0 - ageRatio * 0.3);
          }
          
          // Add extra bright halo for high brightness settings
          if(u_brightness > 2.0) {
            float haloSize = glowSize * 1.5;
            if(dist < haloSize) {
              float haloIntensity = 1.0 / (1.0 + dist * 50.0 * aspect);
              vec3 particleColor = getParticleColor(age, life, u_colorPalette);
              color += particleColor * haloIntensity * (u_brightness - 2.0) * 0.3;
            }
          }
          
          // Add trail effect when enabled (optimized)
          if(u_enableTrails > 0.5) {
            // Dynamic trail quality: low=4, medium=8, high=12 segments
            int maxTrailSegments = int(u_trailQuality * 4.0 + 4.0); // Maps 0,1,2 -> 4,8,12
            float trailSpacing = 0.08 + (u_trailQuality * 0.02); // Adjust spacing: 0.08-0.12
            
            for(int t = 1; t < 13; t++) { // Max possible segments
              if(t >= maxTrailSegments) break; // Early exit based on quality
              
              float trailTime = u_time - float(t) * trailSpacing;
              
              vec2 trailPos = getParticlePos(particleId, trailTime);
              if (trailPos.x < -1.0) continue; // Skip off-screen trail particles
              
              trailPos.x *= aspect;
              float trailDist = length(aspectCorrectedUV - trailPos);
              
              float trailAge = trailTime - getParticleBirthTime(particleId, trailTime);
              float trailLife = getParticleLife(particleId);
              
              if (trailAge < 0.0 || trailAge > trailLife) continue;
              
              // Calculate trail particle age and size multiplier for this trail segment
              float trailAgeRatio = trailAge / trailLife;
              float trailSizeMultiplier = 1.0 - trailAgeRatio * 0.5; // Same aging as main particle
              
              // Progressive tapering: each trail segment is smaller than the previous
              float trailProgress = float(t) / float(maxTrailSegments); // 0.0 (newest) to 1.0 (oldest)
              float taperFactor = 1.0 - trailProgress * 0.8; // Taper to 20% of original size
              
              // Combine the particle size with trail-specific scaling
              float baseTrailSize = (u_particleSize / 800.0) * trailSizeMultiplier / sqrt(aspect);
              float trailCoreSize = baseTrailSize * taperFactor;
              float trailGlowSize = trailCoreSize * 2.0;
              
              // Early exit if trail is too far away (performance optimization)
              if(trailDist > trailGlowSize) continue;
              
              // Calculate shared values once
              float trailAlpha = (1.0 - trailProgress) * u_trailDecay;
              vec3 trailColor = getParticleColor(trailAge, trailLife, u_colorPalette);
              
              // Draw trail particle core
              if(trailDist < trailCoreSize) {
                float trailIntensity = 1.0 / (1.0 + trailDist * 600.0 * aspect);
                color += trailColor * trailIntensity * u_brightness * 0.5 * trailAlpha;
              }
              
              // Draw trail particle glow (softer, larger)
              float trailGlowIntensity = 1.0 / (1.0 + trailDist * 300.0 * aspect);
              color += trailColor * trailGlowIntensity * u_brightness * 0.3 * trailAlpha * 0.6;
            }
          }
        }
        
        // Subtle grid overlay
        vec2 gridUV = uv;
        gridUV.x *= aspect;
        vec2 grid = abs(fract(gridUV * 20.0) - 0.5);
        float gridLine = min(grid.x, grid.y);
        if(gridLine < 0.005) {
          color += vec3(0.005);
        }
        
        gl_FragColor = vec4(color, 1.0);
      }
    `

    // Create shader function
    function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
      const shader = gl.createShader(type)
      if (!shader) return null
      
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      
      return shader
    }

    // Create program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    
    if (!vertexShader || !fragmentShader) return

    const program = gl.createProgram()
    if (!program) return

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program))
      return
    }

    programRef.current = program

    // Create textures for feedback loop
    const feedbackTexture = gl.createTexture()
    feedbackTextureRef.current = feedbackTexture
    gl.bindTexture(gl.TEXTURE_2D, feedbackTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    const currentTexture = gl.createTexture()
    textureRef.current = currentTexture
    gl.bindTexture(gl.TEXTURE_2D, currentTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    // Create framebuffer
    const framebuffer = gl.createFramebuffer()
    framebufferRef.current = framebuffer

    // Set up geometry (full screen quad)
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]), gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, "a_position")
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    // Get uniform locations
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution")
    const timeLocation = gl.getUniformLocation(program, "u_time")
    const particleCountLocation = gl.getUniformLocation(program, "u_particleCount")
    const lifeExpectancyLocation = gl.getUniformLocation(program, "u_lifeExpectancy")
    const lifeVariationLocation = gl.getUniformLocation(program, "u_lifeVariation")
    const particleSizeLocation = gl.getUniformLocation(program, "u_particleSize")
    const spawnRateLocation = gl.getUniformLocation(program, "u_spawnRate")
    const movementSpeedLocation = gl.getUniformLocation(program, "u_movementSpeed")
    const curlStrengthLocation = gl.getUniformLocation(program, "u_curlStrength")
    const gravityLocation = gl.getUniformLocation(program, "u_gravity")
    const colorPaletteLocation = gl.getUniformLocation(program, "u_colorPalette")
    const brightnessLocation = gl.getUniformLocation(program, "u_brightness")
    const enableTrailsLocation = gl.getUniformLocation(program, "u_enableTrails")
    const trailDecayLocation = gl.getUniformLocation(program, "u_trailDecay")
    const trailQualityLocation = gl.getUniformLocation(program, "u_trailQuality")
    const feedbackTextureLocation = gl.getUniformLocation(program, "u_feedbackTexture")

    gl.useProgram(program)
    gl.uniform2f(resolutionLocation, width, height)

    // Animation loop
    const animate = () => {
      if (!gl || !program) return

      timeRef.current += 0.016 // ~60fps

      // Always render to screen for simplicity - use clear behavior for trails
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, width, height)

      gl.useProgram(program)
      gl.uniform1f(timeLocation, timeRef.current)
      gl.uniform1f(particleCountLocation, controls.particleCount)
      gl.uniform1f(lifeExpectancyLocation, controls.lifeExpectancy)
      gl.uniform1f(lifeVariationLocation, controls.lifeVariation)
      gl.uniform1f(particleSizeLocation, controls.particleSize)
      gl.uniform1f(spawnRateLocation, controls.spawnRate)
      gl.uniform1f(movementSpeedLocation, controls.movementSpeed)
      gl.uniform1f(curlStrengthLocation, controls.curlStrength)
      gl.uniform1f(gravityLocation, controls.gravity)
      gl.uniform1f(brightnessLocation, controls.brightness)
      gl.uniform1f(enableTrailsLocation, controls.enableTrails ? 1.0 : 0.0)
      gl.uniform1f(trailDecayLocation, controls.trailDecay)
      
      // Convert trail quality to float: low=0, medium=1, high=2
      const qualityMap = { 'low': 0, 'medium': 1, 'high': 2 }
      gl.uniform1f(trailQualityLocation, qualityMap[controls.trailQuality] || 1)
      
      // Convert color palette to float
      const paletteMap = { 'classic': 0, 'fire': 1, 'plasma': 2, 'ice': 3, 'electric': 4 }
      gl.uniform1f(colorPaletteLocation, paletteMap[controls.colorPalette] || 0)
      
      // Bind dummy texture for now (trails will be implemented differently)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, feedbackTexture || textureRef.current)
      gl.uniform1i(feedbackTextureLocation, 0)
      
      // Always clear the screen (trails are now drawn in shader)
      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (gl && program) {
        gl.deleteProgram(program)
      }
    }
  }, [width, height, controls])

  return (
    <div className={className}>
      <div
        className="overflow-hidden relative"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  )
}