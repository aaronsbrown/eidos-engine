// AIDEV-NOTE: Core differential equations for the Halvorsen attractor. Keep this pure and free of side effects.
export function calculateHalvorsenPoint(
  x: number,
  y: number,
  z: number,
  a: number,
  dt: number
): { newX: number; newY: number; newZ: number } {
  const dx = -a * x - 4 * y - 4 * z - y * y;
  const dy = -a * y - 4 * z - 4 * x - z * z;
  const dz = -a * z - 4 * x - 4 * y - x * x;

  const newX = x + dx * dt;
  const newY = y + dy * dt;
  const newZ = z + dz * dt;

  return { newX, newY, newZ };
}