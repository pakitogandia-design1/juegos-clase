export const NUMBERS = {
  rational: [
    { label: '1/2', kind: 'fraction', tip: 'Fracción: racional' },
    { label: '-3', kind: 'integer', tip: 'Entero: racional' },
    { label: '0,25', kind: 'finite', tip: 'Decimal finito: racional' },
    { label: '2,75', kind: 'finite', tip: 'Decimal finito: racional' },
    { label: '0', kind: 'integer', tip: 'El cero es racional' },
    { label: '4/8', kind: 'fraction', tip: 'Fracción: racional' },
    { label: '1,333...', kind: 'periodic', tip: 'Decimal periódico: racional' },
    { label: '0,666...', kind: 'periodic', tip: 'Decimal periódico: racional' },
    { label: '12/3', kind: 'fraction', tip: 'Cociente de enteros: racional' },
    { label: '-5/2', kind: 'fraction', tip: 'Fracción: racional' },
    { label: '22/7', kind: 'fraction', tip: '22/7 es fracción: racional' },
    { label: '3,1416', kind: 'finite', tip: 'Decimal finito: racional' },
    { label: '0,121212...', kind: 'periodic', tip: 'Decimal periódico: racional' },
    { label: '2,050505...', kind: 'periodic', tip: 'Decimal periódico: racional' },
    { label: '1,101001101001...', kind: 'periodic', tip: 'Bloque repetido: racional' },
    { label: '1,‾101001', kind: 'periodic', tip: 'Periodo marcado: racional' }
  ],
  irrational: [
    { label: '√2', kind: 'root', tip: 'Raíz no exacta: irracional' },
    { label: '√3', kind: 'root', tip: 'Raíz no exacta: irracional' },
    { label: '√5', kind: 'root', tip: 'Raíz no exacta: irracional' },
    { label: 'π', kind: 'pi', tip: 'π es irracional' },
    { label: '2π', kind: 'pi', tip: 'Múltiplo no nulo de π: irracional' },
    { label: 'π/2', kind: 'pi', tip: 'π dividido entre 2: irracional' },
    { label: 'e', kind: 'e', tip: 'e es irracional' },
    { label: '√7', kind: 'root', tip: 'Raíz no exacta: irracional' },
    { label: '√10', kind: 'root', tip: 'Raíz no exacta: irracional' },
    { label: 'φ', kind: 'phi', tip: 'φ es irracional' },
    { label: '1 + √2', kind: 'root', tip: 'Incluye √2: irracional' },
    { label: '√18', kind: 'root', tip: 'Raíz no exacta: irracional' },
    { label: '1,101001000100001...', kind: 'nonperiodic', tip: 'Infinito sin periodo: irracional' }
  ]
};

export function getNumber(category, preferKinds = []) {
  const pool = NUMBERS[category].filter(n => preferKinds.length === 0 || preferKinds.includes(n.kind));
  const finalPool = pool.length ? pool : NUMBERS[category];
  return Phaser.Utils.Array.GetRandom(finalPool);
}
