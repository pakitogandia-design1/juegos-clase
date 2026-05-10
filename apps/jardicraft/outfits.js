export class InventorySystem {
  constructor(state){
    this.state=state;
    this.state.inventory=this.state.inventory||{};
    this.state.craftedItems=this.state.craftedItems||[];
    this.state.newItems=this.state.newItems||{};
  }
  add(id, count=1, meta={}){
    this.state.inventory[id]=(this.state.inventory[id]||0)+count;
    this.markNew(id);
    if(meta.crafted && !this.state.craftedItems.includes(id)) this.state.craftedItems.push(id);
  }
  remove(id, count=1){
    if((this.state.inventory[id]||0)<count) return false;
    this.state.inventory[id]-=count;
    if(this.state.inventory[id]<=0) delete this.state.inventory[id];
    return true;
  }
  has(id,count=1){ return (this.state.inventory[id]||0)>=count; }
  entries(){ return Object.entries(this.state.inventory).map(([id,count])=>({id,count,new:!!this.state.newItems[id]})); }
  markNew(id){ this.state.newItems[id]=true; }
  clearNew(id){ if(this.state.newItems) delete this.state.newItems[id]; }
}
