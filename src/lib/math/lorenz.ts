// AIDEV-NOTE: Core differential equations for the Lorenz system. Keep this pure and free of side effects.
export function calculateLorenzPoint(
  x: number,
  y: number,
  z: number,
  sigma: number,
  rho: number,
  beta: number,
  dt: number
): { newX: number; newY: number; newZ: number } {
  const dx = sigma * (y - x);
  const dy = x * (rho - z) - y;
  const dz = x * y - beta * z;

  const newX = x + dx * dt;
  const newY = y + dy * dt;
  const newZ = z + dz * dt;

  return { newX, newY, newZ };
}
