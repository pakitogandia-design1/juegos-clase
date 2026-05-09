export class Rational {
  constructor(n, d = 1) {
    if (d === 0) throw new Error('Denominador 0');
    const sign = d < 0 ? -1 : 1;
    this.n = n * sign;
    this.d = Math.abs(d);
    this.simplify();
  }
  static from(value) {
    if (value instanceof Rational) return value.clone();
    if (typeof value === 'number') return new Rational(value, 1);
    if (value && typeof value === 'object') return new Rational(value.n, value.d);
    return new Rational(0, 1);
  }
  clone() { return new Rational(this.n, this.d); }
  simplify() {
    const g = gcd(Math.abs(this.n), Math.abs(this.d));
    this.n /= g; this.d /= g;
    return this;
  }
  add(v) { const r = Rational.from(v); return new Rational(this.n * r.d + r.n * this.d, this.d * r.d); }
  sub(v) { const r = Rational.from(v); return new Rational(this.n * r.d - r.n * this.d, this.d * r.d); }
  mul(v) { const r = Rational.from(v); return new Rational(this.n * r.n, this.d * r.d); }
  div(v) { const r = Rational.from(v); if (r.n === 0) throw new Error('División entre 0'); return new Rational(this.n * r.d, this.d * r.n); }
  neg() { return new Rational(-this.n, this.d); }
  absValue() { return Math.abs(this.n / this.d); }
  isZero() { return this.n === 0; }
  isOne() { return this.n === this.d; }
  isInteger() { return this.d === 1; }
  equals(v) { const r = Rational.from(v); return this.n === r.n && this.d === r.d; }
  toNumber() { return this.n / this.d; }
  toText() {
    if (this.d === 1) return String(this.n);
    return `${this.n}/${this.d}`;
  }
}
function gcd(a, b) {
  while (b) { const t = b; b = a % b; a = t; }
  return a || 1;
}
