export const MODES = {
  normal: { name: 'Normal', guide: true, showNext: true, speed: .65, lives: 3, usefulChance: .72, powerupRate: 1, graceMs: 30000 },
  hard: { name: 'Difícil', guide: false, showNext: true, speed: 1.18, lives: 3, usefulChance: .62, powerupRate: .85, graceMs: 0 },
  nightmare: { name: 'Pesadilla', guide: false, showNext: false, speed: 1.75, lives: 2, usefulChance: .52, powerupRate: .55, graceMs: 0 }
};

export const LEVELS = Array.from({ length: 15 }, (_, i) => {
  const n = i + 1;
  return {
    id: n,
    rows: Math.min(4 + Math.floor(n / 2), 9),
    cols: 10,
    targetClears: 9999,
    dropEveryShots: Math.max(15, 24 - Math.floor(n / 2)),
    dropEveryMs: Math.max(24000, 36000 - n * 500),
    paletteSize: Math.min(4 + Math.floor(n / 3), 8),
    name: n === 15 ? 'Final 64' : `Nivel ${n}`
  };
});
