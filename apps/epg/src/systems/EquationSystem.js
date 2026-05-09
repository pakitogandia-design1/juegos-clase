import { Rational } from './Rational.js';

export class EquationSystem {
  constructor(raw) {
    this.lA = Rational.from(raw.lA);
    this.lB = Rational.from(raw.lB);
    this.rA = Rational.from(raw.rA);
    this.rB = Rational.from(raw.rB);
  }
  clone() {
    return new EquationSystem({ lA: this.lA, lB: this.lB, rA: this.rA, rB: this.rB });
  }
  apply(op, n) {
    if (n === 'x') {
      const one = new Rational(1, 1);
      if (op === '+') { this.lA = this.lA.add(one); this.rA = this.rA.add(one); return this; }
      if (op === '-') { this.lA = this.lA.sub(one); this.rA = this.rA.sub(one); return this; }
      throw new Error('Solo se puede sumar o restar x');
    }
    const v = new Rational(n, 1);
    if (op === '+') { this.lB = this.lB.add(v); this.rB = this.rB.add(v); }
    if (op === '-') { this.lB = this.lB.sub(v); this.rB = this.rB.sub(v); }
    if (op === '×') { this.lA = this.lA.mul(v); this.lB = this.lB.mul(v); this.rA = this.rA.mul(v); this.rB = this.rB.mul(v); }
    if (op === '÷') { this.lA = this.lA.div(v); this.lB = this.lB.div(v); this.rA = this.rA.div(v); this.rB = this.rB.div(v); }
    return this;
  }
  sideToText(side) {
    const a = side === 'left' ? this.lA : this.rA;
    const b = side === 'left' ? this.lB : this.rB;
    const parts = [];
    if (!a.isZero()) {
      if (a.equals(1)) parts.push('x');
      else if (a.equals(-1)) parts.push('-x');
      else if (a.n === 1 && a.d !== 1) parts.push(`x/${a.d}`);
      else if (a.n === -1 && a.d !== 1) parts.push(`-x/${a.d}`);
      else parts.push(`${a.toText()}x`);
    }
    if (!b.isZero()) {
      const bText = b.toText();
      if (parts.length === 0) parts.push(bText);
      else if (b.n > 0) parts.push(`+ ${bText}`);
      else parts.push(`- ${new Rational(-b.n, b.d).toText()}`);
    }
    if (parts.length === 0) return '0';
    return parts.join(' ');
  }
  toText() { return `${this.sideToText('left')} = ${this.sideToText('right')}`; }
  isSolved() {
    const leftSolved = this.lA.isOne() && this.lB.isZero() && this.rA.isZero() && this.rB.isInteger();
    const rightSolved = this.rA.isOne() && this.rB.isZero() && this.lA.isZero() && this.lB.isInteger();
    return leftSolved || rightSolved;
  }
  getSolution() {
    const a = this.lA.sub(this.rA);
    const b = this.rB.sub(this.lB);
    if (a.isZero()) return null;
    return b.div(a);
  }
  maxMagnitude() {
    return Math.max(this.lA.absValue(), this.lB.absValue(), this.rA.absValue(), this.rB.absValue());
  }
  complexity() {
    const xTerms = (!this.lA.isZero()?1:0)+(!this.rA.isZero()?1:0);
    const constants = (!this.lB.isZero()?1:0)+(!this.rB.isZero()?1:0);
    const fracPenalty = [this.lA,this.lB,this.rA,this.rB].filter(r=>!r.isInteger()).length * 1.5;
    const mag = Math.min(8, Math.log2(2 + this.maxMagnitude()));
    const solvedBonus = this.isSolved() ? -99 : 0;
    return xTerms * 4 + constants * 2 + fracPenalty + mag + solvedBonus;
  }
  visualTerms(side) {
    const a = side === 'left' ? this.lA : this.rA;
    const b = side === 'left' ? this.lB : this.rB;
    const terms = [];
    if (!a.isZero()) {
      let xText = a.equals(1) ? 'x' : a.equals(-1) ? '-x' : `${a.toText()}x`;
      if (a.n === 1 && a.d !== 1) xText = `x/${a.d}`;
      if (a.n === -1 && a.d !== 1) xText = `-x/${a.d}`;
      terms.push({ kind: 'x', text: xText, positive: a.n > 0 });
    }
    if (!b.isZero()) terms.push({ kind: 'num', text: b.toText(), positive: b.n > 0 });
    if (!terms.length) terms.push({ kind: 'num', text: '0', positive: true });
    return terms;
  }
}
