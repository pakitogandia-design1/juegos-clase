import { ACHIEVEMENTS } from '../data/achievements.js';

const KEY = 'potenciaPopArcadeSave.v1';
const base = () => ({
  tutorialDone:false,
  modes:{
    normal:{max:1, completed:[], perfect:[]},
    hard:{max:1, completed:[], perfect:[]},
    nightmare:{max:1, completed:[], perfect:[]}
  },
  stats:{score:0, shots:0, hits:0, misses:0, groups:0, fallen:0, squares:0, cubes:0, bestStreak:0, made64Square:false, made64Cube:false},
  achievements:[]
});

export class SaveSystem {
  static load(){
    try { return Object.assign(base(), JSON.parse(localStorage.getItem(KEY)) || {}); }
    catch { return base(); }
  }
  static save(data){ localStorage.setItem(KEY, JSON.stringify(data)); }
  static reset(){ localStorage.removeItem(KEY); return base(); }
  static unlock(save, id){ if(!save.achievements.includes(id)) save.achievements.push(id); }
  static completeLevel(save, mode, level, perfect=false){
    const m = save.modes[mode];
    if(!m.completed.includes(level)) m.completed.push(level);
    if(perfect && !m.perfect.includes(level)) m.perfect.push(level);
    m.max = Math.max(m.max, Math.min(15, level + 1));
    if(mode==='normal' && level===15) this.unlock(save,'normal_15');
    if(mode==='hard' && m.completed.length>=10) this.unlock(save,'hard_10');
    if(mode==='nightmare' && level>=1) this.unlock(save,'nightmare_1');
    if(mode==='nightmare' && level===15) this.unlock(save,'nightmare_15');
    if(mode==='normal' && perfect) this.unlock(save,'perfect_normal');
    if(mode==='nightmare' && perfect) this.unlock(save,'perfect_nightmare');
    if(save.modes.normal.completed.length===15 && save.modes.hard.completed.length===15 && save.modes.nightmare.completed.length===15) this.unlock(save,'all_modes');
  }
  static updateAchievements(save){
    const s = save.stats;
    if(save.tutorialDone) this.unlock(save,'tutorial');
    if(s.groups>0) this.unlock(save,'first_pop');
    if(s.squares>=25) this.unlock(save,'square_25');
    if(s.cubes>=15) this.unlock(save,'cube_15');
    if(s.bestStreak>=8) this.unlock(save,'streak_8');
    if(s.bestStreak>=18) this.unlock(save,'streak_18');
    if(s.fallen>=20) this.unlock(save,'fall_master');
    if(s.made64Square && s.made64Cube) this.unlock(save,'sixty_four');
  }
  static achievements(){ return ACHIEVEMENTS; }
}
