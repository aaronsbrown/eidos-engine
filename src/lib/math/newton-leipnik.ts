// AIDEV-NOTE: Core differential equations for the Newton-Leipnik attractor. Keep this pure and free of side effects.
export function calculateNewtonLeipnikPoint(
  x: number,
  y: number,
  z: number,
  a: number,
  b: number,
  dt: number
): { newX: number; newY: number; newZ: number } {
  const dx = -x + y + 10 * x * z;
  const dy = -x - 0.4 * y + 5 * x * z;
  const dz = a * z - 5 * x * x - b * y * y;

  const newX = x + dx * dt;
  const newY = y + dy * dt;
  const newZ = z + dz * dt;

  return { newX, newY, newZ };
}