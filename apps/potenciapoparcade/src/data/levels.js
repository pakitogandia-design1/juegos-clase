export const MODES = {
  normal: { name: 'Normal', guide: true, showNext: true, speed: 1, lives: 3, usefulChance: .72, powerupRate: 1 },
  hard: { name: 'Difícil', guide: false, showNext: true, speed: 1.15, lives: 3, usefulChance: .62, powerupRate: .85 },
  nightmare: { name: 'Pesadilla', guide: false, showNext: false, speed: 1.55, lives: 2, usefulChance: .52, powerupRate: .55 }
};

export const LEVELS = Array.from({ length: 15 }, (_, i) => {
  const n = i + 1;
  return {
    id: n,
    rows: Math.min(4 + Math.floor(n / 2), 9),
    cols: 10,
    targetClears: 8 + n * 2,
    dropEveryShots: Math.max(7, 14 - Math.floor(n / 2)),
    dropEveryMs: Math.max(9000, 19000 - n * 650),
    paletteSize: Math.min(4 + Math.floor(n / 3), 8),
    name: n === 15 ? 'Final 64' : `Nivel ${n}`
  };
});
