// AIDEV-NOTE: Core differential equations for the Aizawa attractor. Keep this pure and free of side effects.
export function calculateAizawaPoint(
  x: number,
  y: number,
  z: number,
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
  dt: number
): { newX: number; newY: number; newZ: number } {
  const dx = (z - b) * x - d * y;
  const dy = d * x + (z - b) * y;
  const dz = c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * (x * x * x);

  const newX = x + dx * dt;
  const newY = y + dy * dt;
  const newZ = z + dz * dt;

  return { newX, newY, newZ };
}