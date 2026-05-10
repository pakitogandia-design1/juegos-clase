export class InventorySystem {
  constructor(state){ this.state=state; }
  add(id, count=1){ this.state.inventory[id]=(this.state.inventory[id]||0)+count; }
  remove(id, count=1){ if((this.state.inventory[id]||0)<count) return false; this.state.inventory[id]-=count; if(this.state.inventory[id]<=0) delete this.state.inventory[id]; return true; }
  has(id,count=1){ return (this.state.inventory[id]||0)>=count; }
  entries(){ return Object.entries(this.state.inventory).map(([id,count])=>({id,count})); }
}
