export class ArcadeGenerator {
  constructor() { this.lastFamilies = []; }
  generate(level) {
    const family = this.pickFamily(level);
    const sol = randInt(level < 10 ? 2 : -8, level < 8 ? 12 : 14, [0]);
    let eq, moves, title;
    switch (family) {
      case 'oneAdd': {
        const b = randInt(2, 12); eq = { lA: 1, lB: b, rA: 0, rB: sol + b }; moves = 1; title = 'Suma pegada'; break;
      }
      case 'oneSub': {
        const b = randInt(2, 12); eq = { lA: 1, lB: -b, rA: 0, rB: sol - b }; moves = 1; title = 'Resta pegada'; break;
      }
      case 'coef': {
        const a = randChoice([2,3,4,5,6,7,8]); eq = { lA: a, lB: 0, rA: 0, rB: a * sol }; moves = 1; title = 'Coeficiente blindado'; break;
      }
      case 'divX': {
        const a = randChoice([2,3,4,5]); eq = { lA: { n: 1, d: a }, lB: 0, rA: 0, rB: { n: sol, d: a } }; moves = 1; title = 'x fraccionada'; break;
      }
      case 'twoStepPlus': {
        const a = randChoice([2,3,4,5,6]); const b = randInt(2, 15); eq = { lA: a, lB: b, rA: 0, rB: a * sol + b }; moves = 2; title = 'Doble cerradura'; break;
      }
      case 'twoStepMinus': {
        const a = randChoice([2,3,4,5,6,7]); const b = randInt(2, 15); eq = { lA: a, lB: -b, rA: 0, rB: a * sol - b }; moves = 2; title = 'Candado negativo'; break;
      }
      case 'rightX': {
        const a = randChoice([2,3,4,5,6]); const b = randInt(-10, 12, [0]); eq = { lA: 0, lB: a * sol + b, rA: a, rB: b }; moves = 2; title = 'Reflejo invertido'; break;
      }
      case 'bothX': {
        let a = randChoice([2,3,4,5,6,7]); let c = randChoice([1,2,3,4]); if (a === c) c = 1;
        const b = randInt(-10, 12, [0]);
        const d = (a - c) * sol + b;
        eq = { lA: a, lB: b, rA: c, rB: d }; moves = 3; title = 'Duelo de incógnitas'; break;
      }
      case 'fractionHard': {
        const den = randChoice([2,3,4]); const b = randInt(-8, 10, [0]);
        eq = { lA: { n: 1, d: den }, lB: b, rA: 0, rB: { n: sol + b * den, d: den } }; moves = 2; title = 'Fracción de neón'; break;
      }
      default: {
        const a = randChoice([3,4,5,6,7,8,9]); const c = randChoice([1,2,3,4,5]); const b = randInt(-15, 15, [0]);
        const d = (a - c) * sol + b;
        eq = { lA: a, lB: b, rA: c, rB: d }; moves = 3; title = 'Cámara inestable';
      }
    }
    const late = Math.max(0, level - 15);
    return {
      id: level,
      title: `${title} ${level}`,
      eq,
      energy: Math.max(45, 105 - level * 2),
      moves: moves + (level < 8 ? 3 : level < 18 ? 2 : 1),
      time: level <= 10 ? 0 : Math.max(35, 90 - level * 1.5),
      glitches: level >= 16,
      overload: level < 15 ? 120 : level < 25 ? 220 : 360,
      targetSteps: moves,
      solution: sol,
      late
    };
  }
  pickFamily(level) {
    let pool;
    if (level <= 5) pool = ['oneAdd','oneSub','coef','divX'];
    else if (level <= 10) pool = ['twoStepPlus','twoStepMinus','coef','divX','fractionHard'];
    else if (level <= 15) pool = ['twoStepPlus','twoStepMinus','fractionHard','rightX'];
    else if (level <= 20) pool = ['rightX','bothX','twoStepPlus','fractionHard'];
    else if (level <= 25) pool = ['bothX','rightX','fractionHard','advancedBoth'];
    else pool = ['bothX','advancedBoth','fractionHard'];
    let choices = pool.filter(f => !this.lastFamilies.includes(f));
    if (!choices.length) choices = pool;
    const f = randChoice(choices);
    this.lastFamilies.push(f);
    if (this.lastFamilies.length > 2) this.lastFamilies.shift();
    return f;
  }
}
function randInt(min, max, exclude = []) {
  let v, guard = 0;
  do { v = Math.floor(Math.random() * (max - min + 1)) + min; guard++; } while (exclude.includes(v) && guard < 30);
  return v;
}
function randChoice(a) { return a[Math.floor(Math.random() * a.length)]; }
