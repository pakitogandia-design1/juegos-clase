import { POWERUPS } from '../data/powerups.js';
export class PowerupManager{
  constructor(save,rng){this.save=save; this.rng=rng;}
  choices(count=3,act=1){ const weights={comun:55,poco_comun:25,raro:15,epico:5,legendario:1}; const arr=[]; for(const p of POWERUPS){ const w=weights[p.rarity]||10; for(let i=0;i<w;i++) arr.push(p); } const out=[]; while(out.length<count){ const p=this.rng.pick(arr); if(!out.find(x=>x.id===p.id)) out.push(structuredClone(p)); } return out; }
  add(run,p){run.powerups=run.powerups||[]; run.discoveredPowerups=run.discoveredPowerups||[]; if(!run.powerups.find(x=>x.id===p.id) && run.powerups.length<8) run.powerups.push(p); else run.consumables=(run.consumables||0)+1; this.save.discoveredPowerups[p.id]=true;}
  has(run,type){return (run.powerups||[]).some(p=>p.type===type)}
  consumeType(run,type){ const i=(run.powerups||[]).findIndex(p=>p.type===type); if(i>=0){return run.powerups.splice(i,1)[0];} return null;}
}
