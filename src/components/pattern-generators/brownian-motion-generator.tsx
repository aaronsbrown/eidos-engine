"use client"

// AIDEV-NOTE: Converted to use external shader loading system (Issue #14)
// Shader code now lives in shaders/fragment/brownian-motion.frag

import { useEffect, useRef, useMemo } from "react"
import type { PatternGeneratorProps } from "./types"
import { loadShader, createShaderProgram } from "@/lib/shader-loader"
import { applySafeParticleCount } from "@/lib/webgl-limits"

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
    particleCount: applySafeParticleCount((controlValues?.particleCount as number) ?? 12, 20),
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

    // AIDEV-NOTE: Load external shaders using new shader loading system
    const initShaders = async () => {
      try {
        const shaderProgram = await loadShader('brownian-motion')
        const program = createShaderProgram(gl, shaderProgram.vertex, shaderProgram.fragment)
        
        if (!program) {
          console.error("Failed to create shader program")
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

        // AIDEV-NOTE: Get uniform locations with type-safe names
        const uniformLocations = {
          u_resolution: gl.getUniformLocation(program, "u_resolution"),
          u_time: gl.getUniformLocation(program, "u_time"),
          u_particleCount: gl.getUniformLocation(program, "u_particleCount"),
          u_speed: gl.getUniformLocation(program, "u_speed"),
          u_brightness: gl.getUniformLocation(program, "u_brightness"),
          u_trailLength: gl.getUniformLocation(program, "u_trailLength"),
          u_jitterAmount: gl.getUniformLocation(program, "u_jitterAmount")
        }

        gl.useProgram(program)
        gl.uniform2f(uniformLocations.u_resolution, width, height)

        // Animation loop
        const animate = () => {
          if (!gl || !program) return

          timeRef.current += 0.016 // ~60fps

          gl.useProgram(program)
          gl.uniform1f(uniformLocations.u_time, timeRef.current)
          gl.uniform1f(uniformLocations.u_particleCount, controls.particleCount)
          gl.uniform1f(uniformLocations.u_speed, controls.speed)
          gl.uniform1f(uniformLocations.u_brightness, controls.brightness)
          gl.uniform1f(uniformLocations.u_trailLength, controls.trailLength)
          gl.uniform1f(uniformLocations.u_jitterAmount, controls.jitterAmount)
          
          gl.clearColor(0, 0, 0, 1)
          gl.clear(gl.COLOR_BUFFER_BIT)
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

          animationRef.current = requestAnimationFrame(animate)
        }

        animate()
      } catch (error) {
        console.error("Failed to load shaders:", error)
      }
    }

    initShaders()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (glRef.current && programRef.current) {
        glRef.current.deleteProgram(programRef.current)
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
        
      </div>
    </div>
  )
}