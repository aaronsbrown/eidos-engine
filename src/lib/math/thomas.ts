// AIDEV-NOTE: Core differential equations for the Thomas attractor. Keep this pure and free of side effects.
export function calculateThomasPoint(
  x: number,
  y: number,
  z: number,
  b: number,
  dt: number
): { newX: number; newY: number; newZ: number } {
  const dx = Math.sin(y) - b * x;
  const dy = Math.sin(z) - b * y;
  const dz = Math.sin(x) - b * z;

  const newX = x + dx * dt;
  const newY = y + dy * dt;
  const newZ = z + dz * dt;

  return { newX, newY, newZ };
}