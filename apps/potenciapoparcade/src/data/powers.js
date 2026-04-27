export const POWERS = [
  ...Array.from({ length: 14 }, (_, i) => ({ base: i + 2, exp: 2, result: (i + 2) ** 2, label: `${i + 2}²`, kind: 'square' })),
  ...Array.from({ length: 5 }, (_, i) => ({ base: i + 2, exp: 3, result: (i + 2) ** 3, label: `${i + 2}³`, kind: 'cube' }))
];

export function powersForLevel(level) {
  const map = [
    { sq: 5, cu: 0 }, { sq: 6, cu: 0 }, { sq: 7, cu: 0 }, { sq: 8, cu: 0 }, { sq: 9, cu: 0 },
    { sq: 10, cu: 0 }, { sq: 6, cu: 4 }, { sq: 11, cu: 4 }, { sq: 12, cu: 4 }, { sq: 10, cu: 5 },
    { sq: 13, cu: 5 }, { sq: 14, cu: 5 }, { sq: 12, cu: 6 }, { sq: 15, cu: 6 }, { sq: 15, cu: 6 }
  ][level - 1] || { sq: 15, cu: 6 };
  return POWERS.filter(p => (p.exp === 2 && p.base <= map.sq) || (p.exp === 3 && p.base <= map.cu));
}

export function uniqueResults(powers) {
  return [...new Set(powers.map(p => p.result))];
}

export function formulasForResult(result, powers = POWERS) {
  return powers.filter(p => p.result === result);
}
