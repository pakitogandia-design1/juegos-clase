import { RECIPES } from '../data/recipes.js';
export class CraftingSystem {
  constructor(state, inventory, achievements, notify){
    this.state=state;
    this.inv=inventory;
    this.ach=achievements;
    this.notify=notify;
    this.state.craftedItems=this.state.craftedItems||[];
  }
  canCraft(recipe){
    const need={};
    recipe.in.forEach(id=>need[id]=(need[id]||0)+1);
    return Object.entries(need).every(([id,count])=>this.inv.has(id,count));
  }
  ingredientSummary(recipe){
    const need={}; recipe.in.forEach(id=>need[id]=(need[id]||0)+1);
    return Object.entries(need).map(([id,count])=>({id,need:count,have:this.state.inventory[id]||0,ok:(this.state.inventory[id]||0)>=count}));
  }
  craft(recipe){
    if(!this.canCraft(recipe)) return {ok:false,msg:'Faltan ingredientes.'};
    this.ingredientSummary(recipe).forEach(i=>this.inv.remove(i.id,i.need));
    this.inv.add(recipe.out,1,{crafted:true});
    if(!this.state.craftedItems.includes(recipe.out)) this.state.craftedItems.push(recipe.out);
    if(recipe.out==='compost_item') this.ach?.add('black_gold',1), this.ach?.add('compost_king',1);
    this.notify?.push('Crafteo completado', `${recipe.name} fabricado y añadido al inventario.`);
    return {ok:true,msg:`Fabricado: ${recipe.name}.`};
  }
  list(){ return RECIPES; }
}
