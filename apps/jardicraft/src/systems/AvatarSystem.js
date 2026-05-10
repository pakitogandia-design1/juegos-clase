import { OUTFITS, SETS } from '../data/outfits.js';
export class AvatarSystem {
  constructor(state, achievements, notify){ this.state=state; this.ach=achievements; this.notify=notify; }
  own(id){ return this.state.ownedOutfits.includes(id); }
  gain(id){ if(!this.own(id)){ this.state.ownedOutfits.push(id); this.notify?.push('Objeto conseguido', `${this.get(id)?.name || id} se ha anadido al Armario Verde.`); } }
  get(id){ return OUTFITS.find(o=>o.id===id); }
  equip(id){ const o=this.get(id); if(!o || !this.own(id)) return false; this.state.avatar[o.category]=id; this.ach?.add('green_flow',1); if(o.category==='gorro') this.ach?.set('hat_head', this.countCat('gorro')); if(o.category==='ropa') this.ach?.set('vivero_catwalk', this.countCat('ropa')); this.checkSets(); return true; }
  countCat(cat){ return this.state.ownedOutfits.filter(id=>this.get(id)?.category===cat).length; }
  checkSets(){ for(const s of SETS){ if(s.pieces.every(id=>this.own(id))){ this.state.completedSets[s.id]=true; this.ach?.add('gardener_drip',1); } } }
}
