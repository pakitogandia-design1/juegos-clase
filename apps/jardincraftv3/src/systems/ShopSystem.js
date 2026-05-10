import { buildShopItems } from '../data/shop.js';
export class ShopSystem {
  constructor(state, inventory, avatar, achievements, notify){ this.items=buildShopItems(); this.state=state; this.inv=inventory; this.avatar=avatar; this.ach=achievements; this.notify=notify; }
  isOwned(item){ if(item.kind==='outfit') return this.state.ownedOutfits.includes(item.ref); if(item.kind==='decoration') return (this.state.inventory[item.ref]||0)>0 || this.state.ownedShop.includes(item.id); if(item.kind==='plant') return false; return this.state.ownedShop.includes(item.id); }
  buy(item){
    if(!item || this.isOwned(item) && item.kind!=='plant') return {ok:false,msg:'Ya esta en propiedad.'};
    if(item.unlock) return {ok:false,msg:'Bloqueado: '+item.unlock};
    if(this.state.greenPoints < item.price) return {ok:false,msg:'Faltan Puntos Verdes.'};
    this.state.greenPoints -= item.price;
    if(item.kind==='outfit') this.avatar.gain(item.ref); else this.inv.add(item.ref,1);
    if(!this.state.ownedShop.includes(item.id)) this.state.ownedShop.push(item.id);
    this.ach?.add('green_market',1); this.notify?.push('Compra realizada', `${item.name} comprado en Mercado Verde.`);
    return {ok:true,msg:'Compra realizada.'};
  }
  bySection(section, onlyMissing=false, affordable=false){ return this.items.filter(i=>i.section===section && (!onlyMissing || !this.isOwned(i)) && (!affordable || this.state.greenPoints>=i.price)); }
}
