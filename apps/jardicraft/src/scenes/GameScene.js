import { PLANTS } from '../data/plants.js';
import { BLOCKS, TOOLS, RESOURCES } from '../data/items.js';
import { SaveSystem } from '../systems/SaveSystem.js';
import { InventorySystem } from '../systems/InventorySystem.js';
import { AchievementSystem } from '../systems/AchievementSystem.js';
import { NotificationSystem } from '../systems/NotificationSystem.js';
import { PlantSystem } from '../systems/PlantSystem.js';
import { WeatherSystem } from '../systems/WeatherSystem.js';
import { AvatarSystem } from '../systems/AvatarSystem.js';
import { ShopSystem } from '../systems/ShopSystem.js';
import { CraftingSystem } from '../systems/CraftingSystem.js';
import { SoundSystem } from '../systems/SoundSystem.js';

export class GameScene extends Phaser.Scene {
  constructor(){ super('GameScene'); }
  init(data){ this.mode=data.mode||'adventure'; this.shouldLoad=data.load; this.openOnStart=data.open; }
  create(){
    this.tileW=96; this.tileH=48; this.originX=640; this.originY=120; this.gridW=18; this.gridH=18;
    this.soundSys = new SoundSystem(this);
    this.state = this.shouldLoad ? (SaveSystem.load() || this.defaultState()) : this.defaultState();
    if(this.mode==='creative') this.state.mode='creative';
    this.inv = new InventorySystem(this.state); this.notify = new NotificationSystem(this.state); this.ach = new AchievementSystem(this.state,this.notify);
    this.avatar = new AvatarSystem(this.state,this.ach,this.notify); this.shop = new ShopSystem(this.state,this.inv,this.avatar,this.ach,this.notify);
    this.crafting = new CraftingSystem(this.state,this.inv,this.ach,this.notify); this.plants = new PlantSystem(this.state,this.ach,this.notify); this.weather = new WeatherSystem(this.state,this.notify);
    this.map = this.state.map || this.generateMap(); this.state.map=this.map;
    this.selected={x:4,y:4}; this.activeSlot=0; this.currentPlant=this.state.selectedPlantIndex||0; this.isPaused=false;
    this.worldLayer=this.add.container(0,0); this.fxLayer=this.add.container(0,0); this.drawMap(); this.createPlayer(); this.createInput();
    this.scene.launch('UIScene',{gameScene:this,open:this.openOnStart});
    this.autoSaveEvent=this.time.addEvent({delay:20000,loop:true,callback:()=>this.save()});
  }
  defaultState(){
    const inv={hand:1,hoe:1,shovel:1,watering:1,pruners:1,sprayer:1,rake:1,hammer:1,seed:6,compost_item:3,grass:6,path:10,wood_res:5,stone_res:5,plant_waste:6,leaves:4};
    if(this.mode==='creative'){ ['grass','dirt','tilled','sand','gravel','stone','water','wood','path','compost','mulch','fertile','poor','dry'].forEach(id=>inv[id]=99); }
    return {mode:this.mode, day:1, season:'primavera', weather:'soleado', greenPoints:this.mode==='creative'?9999:450, reputation:10, inventory:inv, jardidex:{}, achievements:{}, ownedOutfits:['hat_straw','body_overall','bag_basic','boots_work'], avatar:{gorro:'hat_straw',ropa:'body_overall',mochila:'bag_basic',botas:'boots_work'}, completedSets:{}, ownedShop:[], notifications:[], diary:['Dia 1: Llegas a la parcela abandonada. La caseta necesita vida verde.'], missions:{active:'start',done:[]}, dailyDone:0, tutorialDone:false, settings:{music:.5,sfx:.8,uiScale:1,confirm:true}, map:null};
  }
  generateMap(){
    const map=[]; for(let y=0;y<this.gridH;y++){ const row=[]; for(let x=0;x<this.gridW;x++){ let block='grass'; if(x<3||y<3) block='poor'; if(x>13&&y<6) block='sand'; if(x>11&&y>11) block='fertile'; if(x<5&&y>12) block='dirt'; if((x===8||x===9)&&y>5&&y<13) block='path'; row.push({x,y,block,plant:null,decor:null,soil:{humidity:45,fertility:block==='fertile'?75:block==='poor'?25:50,drainage:block==='sand'?80:50,organic:25,ph:'neutro',compact:30},weed:Math.random()<.08}); } map.push(row); }
    map[2][2].decor='hut'; map[3][3].decor='workbench'; map[4][3].decor='composter'; map[2][4].decor='water_tank';
    return map;
  }
  drawMap(){
    this.worldLayer.removeAll(true); this.tileSprites=[];
    for(let y=0;y<this.gridH;y++) for(let x=0;x<this.gridW;x++){ const tile=this.map[y][x]; const {sx,sy}=this.isoToScreen(x,y);
      const block=this.add.image(sx,sy,'block_'+tile.block).setOrigin(.5,0); this.worldLayer.add(block); tile.sprite=block; this.tileSprites.push(block);
      if(tile.weed){ const weed=this.add.image(sx,sy+6,'plant_1_small').setScale(.65).setAlpha(.75); this.worldLayer.add(weed); tile.weedSprite=weed; }
      if(tile.plant) this.addPlantSprite(tile,sx,sy);
      if(tile.decor) this.addDecorSprite(tile,sx,sy);
    }
    this.selector=this.add.graphics(); this.worldLayer.add(this.selector); this.updateSelector();
  }
  addPlantSprite(tile,sx,sy){ const p=PLANTS.findIndex(x=>x.id===tile.plant.id); const key=`plant_${Math.max(0,p)}_${tile.plant.status==='sana'?(tile.plant.stage?'adult':'small'):'bad'}`; const img=this.add.image(sx,sy+4,key).setOrigin(.5,.85); tile.plantSprite=img; this.worldLayer.add(img); }
  addDecorSprite(tile,sx,sy){ const img=this.add.image(sx,sy-6,'deco_'+tile.decor).setOrigin(.5,.85); tile.decorSprite=img; this.worldLayer.add(img); }
  isoToScreen(x,y){ return {sx:this.originX+(x-y)*this.tileW/2, sy:this.originY+(x+y)*this.tileH/2}; }
  screenToIso(px,py){ const x=((px-this.originX)/(this.tileW/2)+(py-this.originY)/(this.tileH/2))/2; const y=((py-this.originY)/(this.tileH/2)-(px-this.originX)/(this.tileW/2))/2; return {x:Math.floor(x+.5),y:Math.floor(y+.5)}; }
  createPlayer(){
    this.player={x:4,y:4,dir:'down'};
    this.updateAvatarTextures();
    const p=this.isoToScreen(4,4);
    this.playerSprite=this.add.image(p.sx,p.sy+8,this.avatarTextureKey('down')).setOrigin(.5,.85).setDepth(10000);
  }
  avatarSignature(){ const a=this.state.avatar||{}; return `${a.gorro||'none'}_${a.ropa||'none'}_${a.mochila||'none'}_${a.botas||'none'}_${a.accesorio||'none'}`.replace(/[^a-zA-Z0-9_]/g,''); }
  avatarTextureKey(dir){ return `player_custom_${dir}_${this.avatarSignature()}`; }
  outfitColor(id, fallback){
    const colors={
      hat_straw:0xc9a858,hat_cactus:0x50a85b,hat_builder:0xd9b34d,hat_flower:0xe579b8,hat_rain:0x4d87c7,hat_light:0x59636b,hat_laurel:0xa9cf58,hat_mushroom:0xc94f4f,hat_green:0x3d8a48,hat_compost:0x72512f,
      body_overall:0x2d7a42,body_vivero:0x4e9c55,body_bee:0xd6b33f,body_florist:0xe38bb5,body_compost:0x6d4d2f,body_rain:0x377abe,body_explorer:0x8d7549,body_prune:0x607a70,body_dry:0xc69a5d,body_master:0x315f3e,
      bag_basic:0x7a4a25,bag_seed:0x6fa64a,bag_tools:0x60707a,bag_vivero:0x3d7a55,bag_explorer:0x8a6d3a,bag_compost:0x5a3922,bag_pollinator:0xe3c75b,
      boots_water:0x2f77a7,boots_work:0x3c2a1c,boots_mud:0x59402b,gloves_strong:0x787f85,gloves_soft:0xd7bd98,glasses_sun:0x111111,glasses_phyto:0x79d0b8,acc_basket:0xb6813d
    };
    return colors[id] ?? fallback;
  }
  updateAvatarTextures(){
    const sig=this.avatarSignature(); const a=this.state.avatar||{};
    const dirs=['down','up','left','right'];
    dirs.forEach(dir=>{
      const key=`player_custom_${dir}_${sig}`;
      if(this.textures.exists(key)) return;
      const g=this.make.graphics({add:false});
      const skin=0xe0b27a, body=this.outfitColor(a.ropa,0x2d7a42), hat=this.outfitColor(a.gorro,0x7a4a25), bag=this.outfitColor(a.mochila,0x6d4625), boots=this.outfitColor(a.botas,0x24313d), acc=this.outfitColor(a.accesorio,0xf4e8b4);
      g.fillStyle(0x000000,.22); g.fillEllipse(24,54,32,10);
      if(dir==='up'){ g.fillStyle(bag,1); g.fillRoundedRect(12,24,24,20,4); }
      else if(dir==='left'){ g.fillStyle(bag,1); g.fillRoundedRect(24,25,10,18,3); }
      else if(dir==='right'){ g.fillStyle(bag,1); g.fillRoundedRect(14,25,10,18,3); }
      g.fillStyle(skin,1); g.fillRoundedRect(16,9,16,15,3);
      g.fillStyle(body,1); g.fillRoundedRect(13,24,22,20,3);
      g.fillStyle(Phaser.Display.Color.ValueToColor(body).darken(18).color,1); g.fillRect(16,28,16,4);
      g.fillStyle(skin,1); g.fillRect(9,28,5,13); g.fillRect(35,28,5,13);
      g.fillStyle(boots,1); g.fillRect(13,44,9,12); g.fillRect(26,44,9,12);
      g.fillStyle(hat,1); g.fillRect(11,6,26,6); g.fillRect(16,1,16,8);
      if((a.gorro||'').includes('cactus')){ g.fillStyle(0x7de084,1); g.fillRect(20,0,3,5); g.fillRect(29,1,3,4); }
      if((a.gorro||'').includes('flower')){ g.fillStyle(0xf07bc0,1); g.fillCircle(16,4,3); g.fillCircle(32,4,3); }
      if((a.accesorio||'').includes('glasses')){ g.fillStyle(acc,1); g.fillRect(17,14,5,3); g.fillRect(26,14,5,3); g.fillRect(22,15,4,1); }
      if(dir==='down'){ g.fillStyle(0x111111,1); g.fillRect(19,15,2,2);g.fillRect(27,15,2,2); }
      else if(dir==='left'){ g.fillStyle(0x111111,1); g.fillRect(17,15,2,2); }
      else if(dir==='right'){ g.fillStyle(0x111111,1); g.fillRect(29,15,2,2); }
      if(dir!=='up' && a.mochila){ g.fillStyle(bag,1); g.fillRoundedRect(dir==='left'?28:8,29,8,17,3); }
      g.generateTexture(key,48,64); g.destroy();
    });
  }
  refreshAvatar(){
    this.updateAvatarTextures();
    if(this.playerSprite) this.playerSprite.setTexture(this.avatarTextureKey(this.player?.dir||'down'));
  }
  setCurrentPlant(index){
    this.currentPlant=Phaser.Math.Wrap(index,0,PLANTS.length);
    this.state.selectedPlantIndex=this.currentPlant;
    this.ui()?.refreshHud();
    this.saveSoon();
  }
  createInput(){
    this.keys=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,E,J,M,ESC,C,ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT,NINE,SPACE');
    this.input.on('pointermove',p=>{ if(this.isPaused) return; const t=this.screenToIso(p.x,p.y); if(this.valid(t.x,t.y)){ this.selected=t; this.updateSelector(); this.ui()?.refreshHud(); }});
    this.input.on('pointerdown',p=>{ if(this.isPaused) return; this.soundSys.ensure(); const t=this.screenToIso(p.x,p.y); if(this.valid(t.x,t.y)){ this.selected=t; this.updateSelector(); this.act(); }});
    this.input.keyboard.on('keydown-ESC',()=>this.ui()?.togglePause()); this.input.keyboard.on('keydown-E',()=>this.ui()?.openPanel('inventory')); this.input.keyboard.on('keydown-J',()=>this.ui()?.openPanel('jardidex')); this.input.keyboard.on('keydown-M',()=>this.ui()?.openPanel('map')); this.input.keyboard.on('keydown-C',()=>this.ui()?.openPanel('crafting'));
    ['ONE','TWO','THREE','FOUR','FIVE','SIX','SEVEN','EIGHT','NINE'].forEach((k,i)=>this.input.keyboard.on('keydown-'+k,()=>{this.activeSlot=i; this.ui()?.refreshHud(); this.soundSys.beep('click');}));
  }
  update(time,delta){ if(this.isPaused) return; this.handleMove(delta); this.animateWorld(time); }
  handleMove(delta){ const k=this.keys; if(this.moveLock && this.time.now<this.moveLock) return; let dx=0,dy=0,dir=this.player.dir; if(k.W.isDown||k.UP.isDown){dy=-1;dir='up';} else if(k.S.isDown||k.DOWN.isDown){dy=1;dir='down';} else if(k.A.isDown||k.LEFT.isDown){dx=-1;dir='left';} else if(k.D.isDown||k.RIGHT.isDown){dx=1;dir='right';}
    if(dx||dy){ const nx=this.player.x+dx, ny=this.player.y+dy; if(this.valid(nx,ny)){ this.player.x=nx; this.player.y=ny; this.selected={x:nx,y:ny}; const p=this.isoToScreen(nx,ny); this.tweens.add({targets:this.playerSprite,x:p.sx,y:p.sy+8,duration:110,ease:'Sine.easeOut'}); } this.player.dir=dir; this.playerSprite.setTexture(this.avatarTextureKey(dir)); this.moveLock=this.time.now+130; this.updateSelector(); this.ui()?.refreshHud(); }}
  animateWorld(time){ if(this.selector) this.selector.setAlpha(.65+Math.sin(time/180)*.25); }
  valid(x,y){ return x>=0&&y>=0&&x<this.gridW&&y<this.gridH; }
  updateSelector(){ if(!this.selector) return; const {sx,sy}=this.isoToScreen(this.selected.x,this.selected.y); this.selector.clear(); this.selector.lineStyle(3,0xd7f59a,.95); this.selector.beginPath(); this.selector.moveTo(sx-48,sy+24); this.selector.lineTo(sx,sy); this.selector.lineTo(sx+48,sy+24); this.selector.lineTo(sx,sy+48); this.selector.closePath(); this.selector.strokePath(); }
  toolbar(){ return ['hoe','shovel','watering','pruners','sprayer','seed','compost_item','path','hand']; }
  getActivePlant(){ return PLANTS[this.currentPlant%PLANTS.length]; }
  activeItem(){ return this.toolbar()[this.activeSlot] || 'hand'; }
  act(){ const tile=this.map[this.selected.y][this.selected.x]; const item=this.activeItem(); let res={ok:false,msg:'Nada que hacer.'};
    if(tile.weed && item==='hand'){ tile.weed=false; this.inv.add('plant_waste',1); this.ach.add('no_bad_weed',0); res={ok:true,msg:'Maleza retirada. Restos vegetales obtenidos.'}; }
    else if(item==='hoe'){ tile.block='tilled'; tile.soil.fertility+=8; this.ach.add('soil_doctor',1); res={ok:true,msg:'Tierra labrada.'}; }
    else if(item==='shovel'){ if(tile.plant){tile.plant=null; res={ok:true,msg:'Planta retirada.'};} else {tile.block='dirt'; res={ok:true,msg:'Bloque removido.'};} }
    else if(item==='watering') res=this.plants.water(tile);
    else if(item==='pruners') res=this.plants.prune(tile);
    else if(item==='sprayer') res=this.plants.treat(tile);
    else if(item==='compost_item'){ tile.soil.fertility=Math.min(100,tile.soil.fertility+18); tile.block='fertile'; this.ach.add('soil_doctor',1); res={ok:true,msg:'Suelo mejorado con compost.'}; }
    else if(item==='seed'){ const plant=PLANTS[this.currentPlant%PLANTS.length]; res=this.plants.plantAt(tile,plant.id); if(res.ok && this.state.mode!=='creative') this.inv.remove('seed',1); }
    else if(item==='path'){ tile.block='path'; this.ach.add('green_architect',1); res={ok:true,msg:'Camino colocado.'}; }
    else if(item==='hand' && tile.decor==='workbench') { this.ui()?.openPanel('crafting'); return; }
    else if(item==='hand' && tile.decor==='hut') { this.ui()?.openPanel('wardrobe'); return; }
    this.soundSys.beep(res.ok ? (item==='watering'?'water':item==='seed'?'plant':item==='hoe'?'dig':'block') : 'bad'); this.floatText(res.msg,res.ok); this.refreshTile(tile); this.ui()?.refreshHud(); if(res.ok) this.saveSoon(); }
  refreshTile(tile){ const {sx,sy}=this.isoToScreen(tile.x,tile.y); if(tile.sprite) tile.sprite.setTexture('block_'+tile.block); if(tile.plantSprite) tile.plantSprite.destroy(); if(tile.plant) this.addPlantSprite(tile,sx,sy); if(tile.weedSprite){ tile.weedSprite.destroy(); tile.weedSprite=null; } if(tile.weed){ tile.weedSprite=this.add.image(sx,sy+6,'plant_1_small').setScale(.65).setAlpha(.75); this.worldLayer.add(tile.weedSprite); } this.particles(sx,sy); }
  particles(x,y){ for(let i=0;i<8;i++){ const r=this.add.rectangle(x,y+25,Phaser.Math.Between(3,6),Phaser.Math.Between(3,6),0xd3e38a).setDepth(9999); this.tweens.add({targets:r,x:x+Phaser.Math.Between(-38,38),y:y+Phaser.Math.Between(-20,12),alpha:0,duration:380,onComplete:()=>r.destroy()}); }}
  floatText(msg,ok=true){ const t=this.add.text(640,96,msg,{fontFamily:'monospace',fontSize:18,color:ok?'#dfffc0':'#ffd0b0',backgroundColor:'#101820cc',padding:{x:14,y:8}}).setOrigin(.5).setDepth(20000); this.tweens.add({targets:t,y:74,alpha:0,duration:1900,onComplete:()=>t.destroy()}); }
  nextDay(){ const w=this.weather.next(); this.plants.nextDay(this.map,this.state.season,w); this.recalculateStats(); this.drawMap(); this.save(); this.ui()?.refreshHud(); }
  getSuggestion(){
    const tile=this.valid(this.selected.x,this.selected.y)?this.map[this.selected.y][this.selected.x]:null;
    const active=this.activeItem(); const plant=this.getActivePlant();
    if(!tile) return 'Selecciona una casilla del jardín para actuar.';
    if(tile.weed) return 'Sugerencia: selecciona la Mano (9) y limpia esta mala hierba para conseguir restos vegetales.';
    if(!tile.plant && active!=='seed') return `Sugerencia: labra una casilla con la Azada (1), abre Inventario y elige planta. Ahora puedes plantar ${plant.common} con Semillas (6).`;
    if(!tile.plant && active==='seed') return `Sugerencia: vas a plantar ${plant.common}. Comprueba que la zona encaja con luz, riego y suelo.`;
    if(tile.plant){
      const p=PLANTS.find(x=>x.id===tile.plant.id); const st=tile.plant.status;
      if(st==='sedienta') return `Sugerencia: ${p?.common||'la planta'} está sedienta. Usa Regadera (3), pero no te pases.`;
      if(st==='encharcada') return `Sugerencia: ${p?.common||'la planta'} está encharcada. No riegues; mejora drenaje o espera al siguiente día.`;
      if(st==='plaga') return `Sugerencia: hay plaga. Usa Pulverizador (5) o mejora biodiversidad.`;
      if(st==='poda') return `Sugerencia: necesita poda. Usa Tijeras (4) para mejorar su salud.`;
      if(st==='sana') return `Sugerencia: ${p?.common||'la planta'} está sana. Puedes plantar otra especie, decorar o avanzar al día siguiente.`;
      return `Sugerencia: revisa esta planta con JardiDex o aplica el mantenimiento adecuado.`;
    }
    return 'Sugerencia: abre Misiones para ver el objetivo visual activo o avanza al día siguiente.';
  }
  missionProgress(m){
    if(!m) return {value:0,target:1,text:'Sin progreso'};
    const stats=this.state.summary||{}; const dex=Object.keys(this.state.jardidex||{}).length; const outfits=(this.state.ownedOutfits||[]).length;
    const arom=Object.keys(this.state.jardidex||{}).filter(id=>['lavanda','romero','tomillo','salvia','menta','hierbabuena','albahaca','santolina'].includes(id)).length; const paths=this.map.flat().filter(t=>t.block==='path').length; const decos=this.map.flat().filter(t=>t.decor).length; const plants=stats.plants||0; const healthy=stats.healthy||0; const map={start:{value:plants,target:1,text:'Primera especie plantada'},low_water:{value:plants,target:3,text:'Parterre iniciado'},poor_soil:{value:this.map.flat().filter(t=>t.block==='fertile').length,target:5,text:'Casillas mejoradas'},irrigation:{value:this.map.flat().filter(t=>t.soil?.humidity>=55).length,target:6,text:'Casillas con humedad correcta'},first_pest:{value:this.state.achievements?.doctor_plant?.value||0,target:1,text:'Plagas tratadas'},aromatics:{value:arom,target:5,text:'Aromáticas registradas'},healthy_week:{value:healthy,target:10,text:'Plantas sanas'},shade:{value:Object.keys(this.state.jardidex||{}).filter(id=>{const p=PLANTS.find(x=>x.id===id); return p&&(p.light==='sombra'||p.light==='semisombra')}).length,target:3,text:'Plantas de sombra registradas'},decorate_hut:{value:decos,target:5,text:'Decoraciones colocadas'},first_outfit:{value:outfits,target:5,text:'Prendas conseguidas'},compost_route:{value:this.state.inventory.compost_item||0,target:3,text:'Compost disponible'},pollinators:{value:stats.biodiversity||0,target:45,text:'Biodiversidad'},florist:{value:stats.beauty||0,target:40,text:'Estética floral'},pathmaker:{value:paths,target:12,text:'Bloques de camino'},water_save:{value:stats.water||70,target:70,text:'Eficiencia hídrica'},wardrobe:{value:outfits,target:5,text:'Armario Verde'},daily:{value:this.state.dailyDone||0,target:5,text:'Objetivos diarios'},jardidex:{value:dex,target:15,text:'Especies registradas'},greenhouse:{value:decos,target:1,text:'Decoración avanzada'},master_zone:{value:Math.min(stats.health||0,stats.beauty||0,stats.biodiversity||0),target:60,text:'Jardín completo'}};
    return map[m.id]||{value:this.state.missions.done.includes(m.id)?1:0,target:1,text:'Encargo pendiente'};
  }
  recalculateStats(){ let plants=0,healthy=0,decor=0,flowers=0; for(const row of this.map) for(const t of row){ if(t.plant){plants++; if(t.plant.status==='sana') healthy++; if(t.plant.flower) flowers++;} if(t.decor) decor++; }
    this.state.summary={health:plants?Math.round(healthy/plants*100):0,biodiversity:Math.min(100,Object.keys(this.state.jardidex).length*3+flowers*2),water:70,beauty:Math.min(100,decor*4+flowers*5),plants,healthy,problems:plants-healthy}; }
  ui(){ return this.scene.get('UIScene'); }
  setPaused(v){ this.isPaused=v; if(v) this.tweens.pauseAll(); else this.tweens.resumeAll(); }
  saveSoon(){ clearTimeout(this._saveTimer); this._saveTimer=setTimeout(()=>this.save(),500); }
  save(){ this.state.map=this.map; SaveSystem.save(this.state); }
}
