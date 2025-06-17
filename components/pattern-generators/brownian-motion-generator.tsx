"use client"

import { useEffect, useRef, useMemo } from "react"
import type { PatternGeneratorProps } from "./types"

interface BrownianControls {
  particleCount: number
  speed: number
  brightness: number
  trailLength: number
  jitterAmount: number
}

export default function BrownianMotionGenerator({ 
  width, 
  height, 
  className = "",
  controlValues
}: PatternGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const timeRef = useRef<number>(0)
  
  // Use passed control values or defaults
  const controls: BrownianControls = useMemo(() => ({
    particleCount: (controlValues?.particleCount as number) ?? 12,
    speed: (controlValues?.speed as number) ?? 1.0,
    brightness: (controlValues?.brightness as number) ?? 2.0,
    trailLength: (controlValues?.trailLength as number) ?? 8,
    jitterAmount: (controlValues?.jitterAmount as number) ?? 0.05
  }), [controlValues])

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

    // Fragment shader source - Brownian motion visualization
    const fragmentShaderSource = `
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
        vec3 color = vec3(0.05); // Dark background
        
        // Draw particles with trails (controlled by particle count)
        int maxParticles = int(u_particleCount);
        for(int i = 0; i < 20; i++) {
          if(i >= maxParticles) break;
          
          float particleId = float(i);
          
          // Current position
          vec2 currentPos = getParticlePos(particleId);
          float currentDist = length(uv - currentPos);
          
          // Draw current particle (bright yellow, controlled by brightness)
          if(currentDist < 0.015) {
            float intensity = 1.0 / (1.0 + currentDist * 400.0);
            // Brightness controlled by uniform
            color += vec3(intensity * u_brightness, intensity * u_brightness * 0.75, intensity * u_brightness * 0.15);
            
            // Add extra glow around particle
            if(currentDist < 0.025) {
              float glowIntensity = 1.0 / (1.0 + currentDist * 150.0);
              color += vec3(glowIntensity * u_brightness * 0.4, glowIntensity * u_brightness * 0.3, glowIntensity * u_brightness * 0.05);
            }
          }
          
          // Draw trail points (gray, fading, controlled by trail length)
          int maxTrailLength = int(u_trailLength);
          for(int t = 1; t < 15; t++) {
            if(t >= maxTrailLength) break;
            
            float trailTime = u_time - float(t) * 0.15;
            
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
            float trailDist = length(uv - trailPos);
            
            if(trailDist < 0.008) {
              float alpha = 1.0 - float(t) / u_trailLength;
              float intensity = 1.0 / (1.0 + trailDist * 1000.0) * alpha;
              color += vec3(intensity * 0.2, intensity * 0.2, intensity * 0.2);
            }
          }
        }
        
        // Subtle grid overlay
        vec2 grid = abs(fract(uv * 40.0) - 0.5);
        float gridLine = min(grid.x, grid.y);
        if(gridLine < 0.01) {
          color += vec3(0.008);
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
    const speedLocation = gl.getUniformLocation(program, "u_speed")
    const brightnessLocation = gl.getUniformLocation(program, "u_brightness")
    const trailLengthLocation = gl.getUniformLocation(program, "u_trailLength")
    const jitterAmountLocation = gl.getUniformLocation(program, "u_jitterAmount")

    gl.useProgram(program)
    gl.uniform2f(resolutionLocation, width, height)

    // Animation loop
    const animate = () => {
      if (!gl || !program) return

      timeRef.current += 0.016 // ~60fps

      gl.useProgram(program)
      gl.uniform1f(timeLocation, timeRef.current)
      gl.uniform1f(particleCountLocation, controls.particleCount)
      gl.uniform1f(speedLocation, controls.speed)
      gl.uniform1f(brightnessLocation, controls.brightness)
      gl.uniform1f(trailLengthLocation, controls.trailLength)
      gl.uniform1f(jitterAmountLocation, controls.jitterAmount)
      
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
      {/* Canvas Container */}
      <div
        className="overflow-hidden relative"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <canvas ref={canvasRef} className="w-full h-full" />
        
        {/* Technical overlay */}
        <div className="absolute top-2 left-2 text-xs font-mono text-yellow-400 bg-black/20 px-2 py-1">
          GLSL_BROWNIAN
        </div>
        <div className="absolute bottom-2 right-2 text-xs font-mono text-gray-400 bg-black/20 px-2 py-1">
          WebGL_2.0
        </div>
      </div>
    </div>
  )
}