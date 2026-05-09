const KEY = 'epg_progress_v1';
const DEFAULT = {
  classic: {},
  arcadeMax: 0,
  arcadeWins: 0,
  stats: { ops: 0, plus: 0, minus: 0, multiply: 0, divide: 0, reflected: 0, perfect: 0, glitchesDestroyed: 0 },
  achievements: {},
  collection: {},
  tutorialDone: false
};
export class ProgressManager {
  constructor() { this.data = this.load(); }
  load() { try { return { ...structuredClone(DEFAULT), ...(JSON.parse(localStorage.getItem(KEY)) || {}) }; } catch { return structuredClone(DEFAULT); } }
  save() { localStorage.setItem(KEY, JSON.stringify(this.data)); }
  reset() { this.data = structuredClone(DEFAULT); this.save(); }
  recordOperation(op) {
    this.data.stats.ops++; this.data.stats.reflected++;
    if (op === '+') this.data.stats.plus++;
    if (op === '-') this.data.stats.minus++;
    if (op === '×') this.data.stats.multiply++;
    if (op === '÷') this.data.stats.divide++;
    this.save();
  }
  completeClassic(level, stars) {
    const old = this.data.classic[level] || 0;
    this.data.classic[level] = Math.max(old, stars);
    this.save();
  }
  completeArcade(level) {
    this.data.arcadeMax = Math.max(this.data.arcadeMax, level);
    this.data.arcadeWins++;
    this.save();
  }
  unlockAchievement(id) { if (!this.data.achievements[id]) { this.data.achievements[id] = true; this.save(); return true; } return false; }
  unlockCollectible(id) { if (!this.data.collection[id]) { this.data.collection[id] = true; this.save(); return true; } return false; }
  starsTotal() { return Object.values(this.data.classic).reduce((a,b)=>a+b,0); }
  classicCompleted() { return Object.keys(this.data.classic).filter(k=>this.data.classic[k]>0).length; }
}
export const progress = new ProgressManager();
