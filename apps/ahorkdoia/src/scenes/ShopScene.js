import { bg,title,button,back } from '../ui/Ui.js';
import { CIVILIANS } from '../data/civilians.js';
import { CivilianManager } from '../systems/CivilianManager.js';
import { AchievementManager } from '../systems/AchievementManager.js';
const PRICE={comun:45,poco_comun:70,raro:105,epico:165,legendario:260};
export class ShopScene extends Phaser.Scene{
  constructor(){super('ShopScene')}
  create(){this.page=0; this.draw();}
  draw(){bg(this); title(this,'Mercado Negro IA','Compra Civilians que faltan en tu colección'); back(this); this.sounder.startMusic('shop');
    const w=this.scale.width; const eco=this.save.economy||{datosIA:0,spent:0,civiliansBought:0};
    this.add.text(w/2,105,`Datos IA disponibles: ${eco.datosIA||0} · Comprados: ${eco.civiliansBought||0}`,{fontSize:'21px',fontStyle:'900',color:'#ffe14a'}).setOrigin(.5);
    const missing=CIVILIANS.filter(c=>!this.save.collection[c.id]?.saved);
    const order={comun:1,poco_comun:2,raro:3,epico:4,legendario:5}; missing.sort((a,b)=>(order[a.rarity]-order[b.rarity])||a.name.localeCompare(b.name));
    const per=6, start=this.page*per, items=missing.slice(start,start+per);
    if(!missing.length){this.add.text(w/2,210,'Colección completa. No queda nadie que comprar.',{fontSize:'24px',color:'#86ffb2'}).setOrigin(.5); return;}
    items.forEach((c,i)=>{const x=165+(i%3)*285,y=190+Math.floor(i/3)*140; const p=PRICE[c.rarity]||90; const col=Phaser.Display.Color.HexStringToColor(c.color).color; this.add.rectangle(x,y,250,110,0x101b3d,.94).setStrokeStyle(2,col); this.add.text(x,y-42,`${c.name}
${c.rarity.replace('_',' ').toUpperCase()} · ${c.family}
Precio: ${p} Datos IA`,{fontSize:'13px',align:'center',color:'#eaf7ff'}).setOrigin(.5,0); button(this,x,y+35,190,34,(eco.datosIA||0)>=p?'Comprar':'Sin datos',()=>this.buy(c,p),{size:'13px',stroke:(eco.datosIA||0)>=p?0x39ff88:0xff5470});});
    if(this.page>0) button(this,230,560,180,42,'◀ Anterior',()=>{this.page--;this.scene.restart();});
    if(start+per<missing.length) button(this,670,560,180,42,'Siguiente ▶',()=>{this.page++;this.scene.restart();});
  }
  buy(c,p){this.save.economy=this.save.economy||{datosIA:0,spent:0,civiliansBought:0}; if((this.save.economy.datosIA||0)<p){this.sounder.play('bad'); return;} this.save.economy.datosIA-=p; this.save.economy.spent=(this.save.economy.spent||0)+p; this.save.economy.civiliansBought=(this.save.economy.civiliansBought||0)+1; const cm=new CivilianManager(this.save,{pick:a=>a[0]}); cm.markSaved(c,{word:'Compra en Mercado Negro IA'}); const am=new AchievementManager(this.save); am.unlock('first_purchase'); am.evaluate(); this.storage.save(this.save); this.sounder.play('shop'); this.scene.restart();}
}
