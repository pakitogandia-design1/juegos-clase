import { CIVILIANS } from '../data/civilians.js';
export class CivilianManager{
  constructor(save,rng){this.save=save; this.rng=rng;}
  pick({categoryKey='jardineria', node=1, boss=false, difficulty='normal'}={}){
    if(boss){ const bossPool=CIVILIANS.filter(c=>c.rarity==='legendario'||c.categoryKey===categoryKey); return structuredClone(this.rng.pick(bossPool)); }
    let pool = node%2===1 ? CIVILIANS.filter(c=>c.categoryKey===categoryKey) : CIVILIANS;
    const unowned=pool.filter(c=>!this.save.collection[c.id]?.saved);
    const seenLost=pool.filter(c=>this.save.collection[c.id]?.seen && !this.save.collection[c.id]?.saved);
    if(unowned.length) pool=unowned; else if(seenLost.length) pool=seenLost;
    if(difficulty==='hard' && node>15){ const rare=pool.filter(c=>['raro','epico','legendario'].includes(c.rarity)); if(rare.length) pool=rare; }
    return structuredClone(this.rng.pick(pool));
  }
  markSeen(civ){ const col=this.save.collection[civ.id]||{}; this.save.collection[civ.id]={...col,seen:true,name:civ.name,rarity:civ.rarity,family:civ.family,categoryKey:civ.categoryKey,color:civ.color,updated:new Date().toISOString()}; }
  markSaved(civ,{perfect=false,critical=false,difficulty='normal',wordId='',word='' }={}){ const col=this.save.collection[civ.id]||{}; this.save.collection[civ.id]={...col,seen:true,saved:true,perfect:col.perfect||perfect,critical:col.critical||critical,hard:col.hard||difficulty==='hard',name:civ.name,rarity:civ.rarity,family:civ.family,categoryKey:civ.categoryKey,color:civ.color,bestWord:word,lastWordId:wordId,updated:new Date().toISOString()}; }
  markLost(civ){ const col=this.save.collection[civ.id]||{}; this.save.collection[civ.id]={...col,seen:true,lost:(col.lost||0)+1,name:civ.name,rarity:civ.rarity,family:civ.family,categoryKey:civ.categoryKey,color:civ.color,updated:new Date().toISOString()}; }
  all(){return CIVILIANS;}
}
