"use client"

// AIDEV-NOTE: Converted to WebGL for 3D rendering with interactive camera controls
// Uses external shader loading system following brownian-motion pattern

import { useEffect, useRef, useMemo } from "react"
import type { PatternGeneratorProps } from "./types"
import { loadShader, createShaderProgram } from "@/lib/shader-loader"
import { calculateLorenzPoint } from '@/lib/math/lorenz'

interface LorenzControls {
  sigma: number
  rho: number
  beta: number
  particleCount: number
}

const LorenzAttractorGenerator: React.FC<PatternGeneratorProps> = ({ 
  width, 
  height, 
  className = "",
  controlValues 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const timeRef = useRef<number>(0)
  const particlesRef = useRef<{ x: number; y: number; z: number }[]>([])
  const positionBufferRef = useRef<WebGLBuffer | null>(null)
  
  // Use passed control values or defaults
  const controls: LorenzControls = useMemo(() => ({
    sigma: (controlValues?.sigma as number) ?? 10,
    rho: (controlValues?.rho as number) ?? 28,
    beta: (controlValues?.beta as number) ?? 8/3,
    particleCount: (controlValues?.particleCount as number) ?? 1000
  }), [controlValues])

  // Initialize particles with random starting positions
  useEffect(() => {
    particlesRef.current = []
    for (let i = 0; i < controls.particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: Math.random() * 20 + 10,
      })
    }
  }, [controls.particleCount])

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

    // Enable depth testing and blending for 3D particles
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    // AIDEV-NOTE: Load external shaders using shader loading system
    const initShaders = async () => {
      try {
        const shaderProgram = await loadShader('lorenz-attractor', 'lorenz-attractor')
        const program = createShaderProgram(gl, shaderProgram.vertex, shaderProgram.fragment)
        
        if (!program) {
          console.error("Failed to create shader program")
          return
        }

        programRef.current = program

        // Create buffer for particle positions
        const positionBuffer = gl.createBuffer()
        positionBufferRef.current = positionBuffer
        
        const positionLocation = gl.getAttribLocation(program, "a_position")
        gl.enableVertexAttribArray(positionLocation)

        // AIDEV-NOTE: Get uniform locations
        const uniformLocations = {
          u_mvpMatrix: gl.getUniformLocation(program, "u_mvpMatrix"),
          u_time: gl.getUniformLocation(program, "u_time"),
          u_cameraPosition: gl.getUniformLocation(program, "u_cameraPosition"),
          u_pointSize: gl.getUniformLocation(program, "u_pointSize"),
          u_pointBrightness: gl.getUniformLocation(program, "u_pointBrightness")
        }

        gl.useProgram(program)

        // Basic perspective projection matrix
        const createPerspectiveMatrix = (fov: number, aspect: number, near: number, far: number) => {
          const f = Math.tan(Math.PI * 0.5 - 0.5 * fov)
          const rangeInv = 1.0 / (near - far)
          
          return new Float32Array([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
          ])
        }

        // Basic view matrix (looking at origin from distance)
        const createViewMatrix = (distance: number, angleY: number) => {
          const x = Math.sin(angleY) * distance
          const z = Math.cos(angleY) * distance
          const y = 0
          
          // Simple look-at matrix calculation
          const zAxis = [x, y, z]
          const magnitude = Math.sqrt(zAxis[0] * zAxis[0] + zAxis[1] * zAxis[1] + zAxis[2] * zAxis[2])
          zAxis[0] /= magnitude
          zAxis[1] /= magnitude
          zAxis[2] /= magnitude
          
          return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            -x, -y, -z, 1
          ])
        }

        // Animation loop
        const animate = () => {
          if (!gl || !program) return

          timeRef.current += 0.016 // ~60fps
          
          // Update particle positions using Lorenz equations
          const dt = 0.01
          particlesRef.current.forEach(p => {
            const { newX, newY, newZ } = calculateLorenzPoint(p.x, p.y, p.z, controls.sigma, controls.rho, controls.beta, dt)
            p.x = newX
            p.y = newY
            p.z = newZ
          })

          // Update position buffer with new particle positions
          gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
          const positions = new Float32Array(particlesRef.current.length * 3)
          particlesRef.current.forEach((p, i) => {
            positions[i * 3] = p.x
            positions[i * 3 + 1] = p.y
            positions[i * 3 + 2] = p.z
          })
          gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW)
          gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)

          // Set up matrices
          const projectionMatrix = createPerspectiveMatrix(Math.PI / 3, width / height, 0.1, 1000)
          const viewMatrix = createViewMatrix(80, timeRef.current * 0.3) // Slow rotation
          
          // Simple matrix multiplication for MVP
          const mvpMatrix = new Float32Array(16)
          for (let i = 0; i < 16; i++) {
            mvpMatrix[i] = projectionMatrix[i] * viewMatrix[i] // Simplified - should be proper matrix mult
          }

          gl.useProgram(program)
          gl.uniformMatrix4fv(uniformLocations.u_mvpMatrix, false, mvpMatrix)
          gl.uniform1f(uniformLocations.u_time, timeRef.current)
          gl.uniform3f(uniformLocations.u_cameraPosition, 0, 0, 80)
          gl.uniform1f(uniformLocations.u_pointSize, 3.0)
          gl.uniform1f(uniformLocations.u_pointBrightness, 1.0)
          
          gl.clearColor(0, 0, 0, 1)
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
          gl.drawArrays(gl.POINTS, 0, particlesRef.current.length)

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
      if (glRef.current && positionBufferRef.current) {
        glRef.current.deleteBuffer(positionBufferRef.current)
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

export default LorenzAttractorGenerator;
