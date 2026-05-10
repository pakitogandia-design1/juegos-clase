import { RECIPES } from '../data/recipes.js';
export class CraftingSystem {
  constructor(state, inventory, achievements, notify){ this.state=state; this.inv=inventory; this.ach=achievements; this.notify=notify; }
  craft(recipe){
    if(!recipe.in.every(id=>this.inv.has(id))) return {ok:false,msg:'Faltan ingredientes.'};
    recipe.in.forEach(id=>this.inv.remove(id)); this.inv.add(recipe.out,1);
    if(recipe.out==='compost_item') this.ach?.add('black_gold',1), this.ach?.add('compost_king',1);
    this.notify?.push('Crafteo completado', `${recipe.name} fabricado.`); return {ok:true,msg:'Fabricado.'};
  }
  list(){ return RECIPES; }
}
