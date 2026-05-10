import { ACHIEVEMENTS } from '../data/achievements.js';
export class AchievementSystem {
  constructor(state, notify){ this.state=state; this.notify=notify; }
  add(id, amount=1){
    const a = ACHIEVEMENTS.find(x=>x.id===id); if(!a) return;
    const p = this.state.achievements[id] || {value:0, unlocked:false};
    if(p.unlocked) return;
    p.value += amount;
    if(p.value >= a.target){
      p.value = a.target; p.unlocked = true; p.day = this.state.day; this.state.greenPoints += a.reward;
      this.notify?.push('Logro desbloqueado', `${a.name}. Recompensa: ${a.reward} Puntos Verdes.`);
    }
    this.state.achievements[id] = p;
  }
  set(id, value){ const a=ACHIEVEMENTS.find(x=>x.id===id); const p=this.state.achievements[id]||{value:0,unlocked:false}; if(!p.unlocked){p.value=Math.max(p.value,value); this.state.achievements[id]=p; if(a && p.value>=a.target) this.add(id,0);} }
  list(){ return ACHIEVEMENTS.map(a=>({...a, progress:this.state.achievements[a.id]||{value:0,unlocked:false}})); }
}
