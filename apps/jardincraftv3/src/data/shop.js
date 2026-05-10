import { OUTFITS } from './outfits.js';
import { DECORATIONS } from './decorations.js';
import { PLANTS } from './plants.js';
export const SHOP_SECTIONS = ['Vivero','Ropa','Gorros','Mochilas','Guantes','Botas','Decoracion','Herramientas','Mejoras'];
export function buildShopItems(){
  const plants = PLANTS.slice(0,20).map(p=>({id:'seed_'+p.id,name:'Plantón: '+p.common,section:'Vivero',price:70+(p.colorIndex%5)*20,kind:'plant',ref:p.id}));
  const outfits = OUTFITS.map(o=>({id:o.id,name:o.name,section:sectionFor(o.category),price:o.price,kind:'outfit',ref:o.id,unlock:o.unlock,rarity:o.rarity}));
  const decos = DECORATIONS.map(d=>({id:d.id,name:d.name,section:'Decoracion',price:d.price,kind:'decoration',ref:d.id}));
  const tools = [{id:'tool_sprayer',name:'Pulverizador profesional',section:'Herramientas',price:240,kind:'upgrade',ref:'sprayer'}, {id:'tool_watering',name:'Regadera grande',section:'Herramientas',price:220,kind:'upgrade',ref:'watering'}, {id:'upgrade_storage',name:'Almacen ampliado',section:'Mejoras',price:360,kind:'upgrade',ref:'storage'}];
  return [...plants,...outfits,...decos,...tools].filter(x=>x.price>0 || x.kind==='decoration' || x.kind==='plant');
}
function sectionFor(cat){return cat==='gorro'?'Gorros':cat==='mochila'?'Mochilas':cat==='guantes'?'Guantes':cat==='botas'?'Botas':cat==='ropa'?'Ropa':'Ropa';}
