import { ACHIEVEMENTS } from '../data/achievements.js';
export class AchievementManager{
  constructor(save){this.save=save;}
  unlock(id){ if(!this.save.achievements[id]){this.save.achievements[id]={unlocked:true,date:new Date().toISOString()}; return ACHIEVEMENTS.find(a=>a.id===id); } return null; }
  evaluate(){const s=this.save.stats; const out=[]; const u=id=>{const a=this.unlock(id); if(a) out.push(a)}; if(s.civiliansSaved>=1)u('first_rescue'); if(Object.keys(this.save.codex).length>=1)u('first_data'); if(Object.keys(this.save.codex).length>=10)u('codex_10'); if(Object.values(this.save.collection).filter(c=>c.saved).length>=10)u('civ_10'); if(s.bestStreak>=5)u('streak_5'); if(s.bossesDefeated>=1)u('boss_down'); if(s.dailyCompleted>=1)u('first_daily'); return out;}
  all(){return ACHIEVEMENTS;}
}
