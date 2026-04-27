import { MODE_ORDER } from '../data/modes.js';
import { ACHIEVEMENTS } from '../data/achievements.js';

const KEY = 'pangRacionalSave_v1';

function fresh() {
  const modes = {};
  MODE_ORDER.forEach(id => modes[id] = { maxReached: 1, completed: {}, bestTime: {} });
  return {
    version: 1,
    modes,
    rationalDestroyed: 0,
    irrationalDestroyed: 0,
    totalDestroyed: 0,
    wrongHarpoons: 0,
    shots: 0,
    correctShots: 0,
    bestStreak: 0,
    noDamageLevels: 0,
    noWrongLevels: 0,
    achievements: {},
    byKind: {},
    specials: {}
  };
}

export default class SaveSystem {
  static load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return fresh();
      const data = JSON.parse(raw);
      const f = fresh();
      return Phaser.Utils.Objects.MergeRight(f, data);
    } catch(e) {
      console.warn('No se pudo cargar progreso', e);
      return fresh();
    }
  }

  static save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  static reset() {
    const data = fresh();
    this.save(data);
    return data;
  }

  static recordLevelStart(mode, levelId) {
    const s = this.load();
    s.modes[mode].maxReached = Math.max(s.modes[mode].maxReached || 1, levelId);
    this.save(s);
    return s;
  }

  static recordBubble(number, category) {
    const s = this.load();
    s.totalDestroyed++;
    if (category === 'rational') s.rationalDestroyed++;
    if (category === 'irrational') s.irrationalDestroyed++;
    s.byKind[number.kind] = (s.byKind[number.kind] || 0) + 1;
    if (number.label === '22/7') s.specials.club227 = true;
    if (number.label === '3,1416') s.specials.piFinite = true;
    if (number.kind === 'periodic') s.specials.periodicInfinite = true;
    if (number.kind === 'nonperiodic') s.specials.nonPeriodic = true;
    this.evaluate(s);
    this.save(s);
    return s;
  }

  static recordShot(correct, streak) {
    const s = this.load();
    s.shots++;
    if (correct) s.correctShots++;
    else s.wrongHarpoons++;
    s.bestStreak = Math.max(s.bestStreak || 0, streak || 0);
    this.evaluate(s);
    this.save(s);
    return s;
  }

  static completeLevel(mode, levelId, stats) {
    const s = this.load();
    s.modes[mode].completed[levelId] = true;
    s.modes[mode].maxReached = Math.max(s.modes[mode].maxReached || 1, Math.min(15, levelId + 1));
    const old = s.modes[mode].bestTime[levelId] || 9999;
    s.modes[mode].bestTime[levelId] = Math.min(old, stats.elapsed);
    if (mode === 'normal' && stats.elapsed < 30) s.fastNormal = true;
    if (stats.noDamage) s.noDamageLevels++;
    if (stats.noWrong) s.noWrongLevels++;
    if (mode === 'nightmare' && stats.noDamage && stats.noWrong) s.specials.nightmarePerfect = true;
    if (mode === 'nightmare' && levelId === 15 && stats.timeLeft > 0 && stats.timeLeft < 5) s.specials.lastDecimal = true;
    this.evaluate(s);
    this.save(s);
    return s;
  }

  static evaluate(s) {
    ACHIEVEMENTS.forEach(a => {
      try { if (a.test(s)) s.achievements[a.id] = true; } catch(e) {}
    });
    return s;
  }

  static accuracy(s) {
    return s.shots ? Math.round((s.correctShots / s.shots) * 100) : 100;
  }
}
