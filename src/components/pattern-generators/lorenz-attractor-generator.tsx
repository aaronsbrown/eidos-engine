import React, { useRef, useEffect, useCallback } from 'react';
import { PatternGeneratorProps } from './types';
import { calculateLorenzPoint } from '@/lib/math/lorenz';

const LorenzAttractorGenerator: React.FC<PatternGeneratorProps> = ({ width, height, controlValues }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<{ x: number; y: number; z: number; }[]>([]);

  const getControlValue = useCallback((id: string, defaultValue: number) => {
    return (controlValues?.[id] as number) ?? defaultValue;
  }, [controlValues]);

  useEffect(() => {
    const particleCount = getControlValue('particleCount', 1000);
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: Math.random() * 20 + 10,
      });
    }
  }, [getControlValue]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const sigma = getControlValue('sigma', 10);
    const rho = getControlValue('rho', 28);
    const beta = getControlValue('beta', 8 / 3);
    const dt = 0.01;
    const scale = 10;

    const render = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
      particlesRef.current.forEach(p => {
        const { newX, newY, newZ } = calculateLorenzPoint(p.x, p.y, p.z, sigma, rho, beta, dt);
        p.x = newX;
        p.y = newY;
        p.z = newZ;

        const projectedX = p.x * scale + width / 2;
        const projectedY = p.y * scale + height / 2;

        if (projectedX > 0 && projectedX < width && projectedY > 0 && projectedY < height) {
          ctx.fillRect(projectedX, projectedY, 1, 1);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [width, height, getControlValue]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default LorenzAttractorGenerator;
