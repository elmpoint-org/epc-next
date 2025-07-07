export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(min, n), max);
}

export function randrange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
