import { PLANTS } from '../data/plants.js';
import { TOOLS, BLOCKS, RESOURCES } from '../data/items.js';
import { SHOP_SECTIONS } from '../data/shop.js';
import { OUTFITS, SETS } from '../data/outfits.js';
import { MISSIONS, DAILY_OBJECTIVES } from '../data/missions.js';
import { RECIPES } from '../data/recipes.js';
import { NavigationSystem } from '../systems/NavigationSystem.js';
import { SaveSystem } from '../systems/SaveSystem.js';

export class UIScene extends Phaser.Scene {
  constructor(){ super('UIScene'); }
  init(data){ this.gameScene=data.gameScene; this.openOnStart=data.open; }
  create(){
    this.nav=new NavigationSystem(this);
    this.panel=null;
    this.message=null;
    this.activeTab={shop:'Vivero',wardrobe:'gorro',inventory:'Todos',plantFilter:'Todas'};
    this.createHud();
    this.refreshHud();
    if(this.openOnStart) this.time.delayedCall(200,()=>this.openPanel(this.openOnStart));
  }

  createHud(){
    this.hud=this.add.container(0,0).setDepth(50000);
    this.top=this.add.graphics(); this.hud.add(this.top);
    this.info=this.add.text(18,14,'',{fontFamily:'monospace',fontSize:17,color:'#e6f5cb'}); this.hud.add(this.info);
    this.mission=this.add.text(18,42,'',{fontFamily:'monospace',fontSize:14,color:'#aacfa2'}); this.hud.add(this.mission);
    this.notice=this.add.text(1010,14,'',{fontFamily:'monospace',fontSize:14,color:'#d9efbd',align:'right'}); this.hud.add(this.notice);
    this.menuButton=this.makeButton(1185,46,140,36,'Menu',()=>this.togglePause()); this.hud.add(this.menuButton);
    this.dayButton=this.makeButton(1028,46,150,36,'Dia siguiente',()=>this.gameScene.nextDay()); this.hud.add(this.dayButton);
    this.suggestionBox=this.add.container(640,96); this.hud.add(this.suggestionBox);
    this.hotbar=this.add.container(640,650); this.hud.add(this.hotbar);
  }

  refreshHud(){
    const s=this.gameScene.state;
    this.top.clear();
    this.top.fillStyle(0x0c1418,.74); this.top.fillRect(0,0,1280,82);
    this.top.lineStyle(2,0x395c42,1); this.top.lineBetween(0,82,1280,82);
    this.info.setText(`Puntos Verdes: ${s.greenPoints}   Reputacion: ${s.reputation}   Dia ${s.day} - ${s.season} - ${s.weather}   Modo: ${s.mode==='creative'?'Creativo':'Aventura Verde'}`);
    const m=MISSIONS.find(x=>x.id===s.missions.active);
    const prog=this.gameScene.missionProgress(m);
    this.mission.setText(m?`Mision: ${m.name}   ${Math.min(prog.value,prog.target)}/${prog.target} - ${prog.text}`:'Sin mision activa');
    const n=s.notifications[0]; this.notice.setText(n?`Buzon Verde: ${n.title}`:'Buzon Verde: sin novedades');
    this.drawSuggestion();
    this.drawHotbar();
  }

  drawSuggestion(){
    this.suggestionBox.removeAll(true);
    const g=this.add.graphics();
    g.fillStyle(0x12201a,.82); g.fillRoundedRect(-430,-10,860,50,8);
    g.lineStyle(2,0x6fa65c,.85); g.strokeRoundedRect(-430,-10,860,50,8);
    const t=this.add.text(0,15,this.gameScene.getSuggestion(),{fontFamily:'monospace',fontSize:15,color:'#eef8d0',align:'center',wordWrap:{width:820}}).setOrigin(.5);
    this.suggestionBox.add([g,t]);
  }

  drawHotbar(){
    this.hotbar.removeAll(true);
    const items=this.gameScene.toolbar();
    const bg=this.add.graphics(); bg.fillStyle(0x0b1115,.78); bg.fillRoundedRect(-250,-34,500,68,7); bg.lineStyle(2,0x395c42,1); bg.strokeRoundedRect(-250,-34,500,68,7); this.hotbar.add(bg);
    items.forEach((id,i)=>{
      const x=-216+i*54;
      const g=this.add.graphics();
      g.fillStyle(this.gameScene.activeSlot===i?0x395c42:0x182329,1); g.fillRoundedRect(x,-24,46,46,4);
      g.lineStyle(2,this.gameScene.activeSlot===i?0xd8f19d:0x6b7c76,1); g.strokeRoundedRect(x,-24,46,46,4); this.hotbar.add(g);
      const key='icon_'+id; if(this.textures.exists(key)) this.hotbar.add(this.add.image(x+23,-1,key).setScale(.88));
      const count=this.gameScene.state.inventory[id]; if(count){ const tx=this.add.text(x+37,11,String(count),{fontFamily:'monospace',fontSize:12,color:'#f6ffd7',backgroundColor:'#00000088'}).setOrigin(.5); this.hotbar.add(tx); }
      this.hotbar.add(this.add.text(x+6,-21,String(i+1),{fontFamily:'monospace',fontSize:10,color:'#b7c5ad'}));
    });
    const p=this.gameScene.getActivePlant();
    const name=this.itemName(this.gameScene.activeItem());
    this.hotbar.add(this.add.text(0,42,`Seleccion: ${name}  |  Planta elegida: ${p.common}`,{fontFamily:'monospace',fontSize:13,color:'#d9efbd'}).setOrigin(.5));
  }

  itemName(id){ return [...TOOLS,...BLOCKS,...RESOURCES].find(x=>x.id===id)?.name || id; }
  title(n){ return ({pause:'Pausa',inventory:'Inventario y plantas',jardidex:'JardiDex',shop:'Mercado Verde',wardrobe:'Armario Verde',achievements:'Logros',missions:'Misiones visuales',map:'Mapa Verde',diary:'Diario del Jardinero',crafting:'Banco de trabajo',summary:'Resumen del jardin',settings:'Ajustes',notifications:'Buzon Verde'}[n]||n); }

  makeButton(x,y,w,h,label,cb){
    const c=this.add.container(x,y);
    const g=this.add.graphics(); g.fillStyle(0x21342b,.96); g.fillRoundedRect(-w/2,-h/2,w,h,6); g.lineStyle(2,0x7fa65d,1); g.strokeRoundedRect(-w/2,-h/2,w,h,6);
    const t=this.add.text(0,0,label,{fontFamily:'monospace',fontSize:15,color:'#eef8d0'}).setOrigin(.5);
    const z=this.add.zone(0,0,w,h).setInteractive({useHandCursor:true}).on('pointerdown',()=>{this.gameScene.soundSys.beep('click'); cb();});
    c.add([g,t,z]); return c;
  }
  card(x,y,w,h,text,cb,opts={}){
    const c=this.add.container(x,y);
    const g=this.add.graphics();
    g.fillStyle(opts.fill||0x223039,1); g.fillRoundedRect(0,0,w,h,6);
    g.lineStyle(opts.lineWidth||2,opts.line||0x5a7960,1); g.strokeRoundedRect(0,0,w,h,6);
    const t=this.add.text(10,8,text,{fontFamily:'monospace',fontSize:opts.size||13,color:opts.color||'#e7f1d1',wordWrap:{width:w-20},lineSpacing:3});
    const z=this.add.zone(w/2,h/2,w,h).setInteractive({useHandCursor:true}).on('pointerdown',()=>{this.gameScene.soundSys.beep('click'); cb();});
    c.add([g,t,z]); this.panel.add(c); return c;
  }
  contentText(x,y,text,size=17,color='#dcebc5',width=900){ const t=this.add.text(x,y,text,{fontFamily:'monospace',fontSize:size,color,wordWrap:{width},lineSpacing:5}); this.panel.add(t); return t; }
  tabs(list,active,x,y,cb,w=120){ list.forEach((l,i)=>{ const b=this.makeButton(x+i*(w+8),y,w,34,l,()=>cb(l)); this.panel.add(b); if(l===active) b.list[0].lineStyle(2,0xe4f58d,1); }); }

  openPanel(name,payload={}){ this.nav.open(name,payload); }
  showPanel(name,payload={}){
    this.closeOnlyPanel(); this.gameScene.setPaused(true); this.hud.setVisible(false);
    this.panel=this.add.container(0,0).setDepth(90000);
    const veil=this.add.rectangle(640,360,1280,720,0x05080a,.82).setInteractive();
    const bg=this.add.graphics(); bg.fillStyle(0x162027,.98); bg.fillRoundedRect(70,55,1140,610,12); bg.lineStyle(3,0x80a95f,1); bg.strokeRoundedRect(70,55,1140,610,12);
    this.panel.add([veil,bg]);
    this.panel.add(this.add.text(98,76,this.title(name),{fontFamily:'monospace',fontSize:30,color:'#e8f7c5',stroke:'#07100c',strokeThickness:4}));
    this.panel.add(this.makeButton(990,86,130,38,'Atras',()=>this.nav.back()));
    this.panel.add(this.makeButton(1130,86,130,38,'Cerrar',()=>this.nav.close()));
    const map={pause:()=>this.drawPause(),inventory:()=>this.drawInventory(),jardidex:()=>this.drawJardidex(payload),shop:()=>this.drawShop(),wardrobe:()=>this.drawWardrobe(),achievements:()=>this.drawAchievements(),missions:()=>this.drawMissions(),map:()=>this.drawMapPanel(),diary:()=>this.drawDiary(),crafting:()=>this.drawCrafting(),summary:()=>this.drawSummary(),settings:()=>this.drawSettings(),notifications:()=>this.drawNotifications()};
    (map[name]||map.pause)();
  }
  closeOnlyPanel(){ if(this.panel){this.panel.destroy(true); this.panel=null;} }
  closePanel(){ this.closeOnlyPanel(); this.gameScene.setPaused(false); this.hud.setVisible(true); this.refreshHud(); this.gameScene.save(); }
  togglePause(){ if(this.panel) this.nav.close(); else this.openPanel('pause'); }

  drawPause(){
    const buttons=[['Continuar',()=>this.nav.close()],['Inventario / Plantas',()=>this.openPanel('inventory')],['JardiDex',()=>this.openPanel('jardidex')],['Mercado Verde',()=>this.openPanel('shop')],['Armario Verde',()=>this.openPanel('wardrobe')],['Misiones',()=>this.openPanel('missions')],['Logros',()=>this.openPanel('achievements')],['Resumen',()=>this.openPanel('summary')],['Buzon Verde',()=>this.openPanel('notifications')],['Ajustes',()=>this.openPanel('settings')],['Guardar y salir',()=>{this.gameScene.save(); this.scene.stop('UIScene'); this.gameScene.scene.start('MainMenuScene'); this.gameScene.scene.stop();}]];
    buttons.forEach((b,i)=>this.panel.add(this.makeButton(250+(i%3)*230,170+Math.floor(i/3)*72,190,44,b[0],b[1])));
  }

  drawInventory(){
    this.tabs(['Todos','Herramientas','Semillas','Materiales','Bloques','Decoracion','Ropa'],this.activeTab.inventory,100,132,(f)=>{this.activeTab.inventory=f; this.showPanel('inventory');},112);
    const entries=this.gameScene.inv.entries();
    entries.slice(0,24).forEach((e,i)=>{ const cx=100+(i%4)*155, cy=182+Math.floor(i/4)*58; this.card(cx,cy,140,46,`${this.itemName(e.id)}\nCantidad: ${e.count}`,()=>{}, {size:12}); });

    const p=this.gameScene.getActivePlant();
    const side=this.add.graphics(); side.fillStyle(0x203529,1); side.fillRoundedRect(760,140,390,470,10); side.lineStyle(2,0x78a15f,1); side.strokeRoundedRect(760,140,390,470,10); this.panel.add(side);
    this.panel.add(this.add.text(785,158,'Selector de plantas',{fontFamily:'monospace',fontSize:22,color:'#e8f7c5'}));
    this.panel.add(this.add.image(820,230,`plant_${p.colorIndex}_adult`).setScale(1.7));
    this.contentText(865,190,`Elegida ahora:\n${p.common}\n${p.scientific}\nLuz: ${p.light}\nRiego: ${p.water}\nSuelo: ${p.soil}`,15,'#dcebc5',260);
    this.contentText(785,295,'Pulsa una planta para dejarla elegida. Luego selecciona Semillas (6) y planta en el mapa.',14,'#b9d4ac',330);
    PLANTS.slice(0,15).forEach((plant,i)=>{
      const x=785+(i%5)*68, y=360+Math.floor(i/5)*70;
      const sel=plant.id===p.id;
      const g=this.add.graphics(); g.fillStyle(sel?0x3d6b47:0x182329,1); g.fillRoundedRect(x,y,56,56,6); g.lineStyle(2,sel?0xe4f58d:0x5a7960,1); g.strokeRoundedRect(x,y,56,56,6); this.panel.add(g);
      const img=this.add.image(x+28,y+30,`plant_${plant.colorIndex}_adult`).setScale(.82); this.panel.add(img);
      const z=this.add.zone(x+28,y+28,56,56).setInteractive({useHandCursor:true}).on('pointerdown',()=>{ this.gameScene.setCurrentPlant(PLANTS.findIndex(pp=>pp.id===plant.id)); this.toast(`Planta elegida: ${plant.common}`,true); this.showPanel('inventory'); }); this.panel.add(z);
    });
    this.panel.add(this.makeButton(930,575,260,36,'Ver mas en JardiDex',()=>this.openPanel('jardidex',{id:p.id})));
  }

  drawJardidex(payload={}){
    const selected=payload.id || this.gameScene.getActivePlant().id || PLANTS[0].id;
    PLANTS.forEach((p,i)=>{ const d=this.gameScene.state.jardidex[p.id]; const label=`${d?d.state:'silueta'}\n${d?p.common:'???'}`; this.card(100+(i%5)*150,140+Math.floor(i/5)*62,136,48,label,()=>this.showPanel('jardidex',{id:p.id}),{line:p.id===selected?0xe4f58d:0x5a7960,size:12}); });
    const p=PLANTS.find(a=>a.id===selected); const d=this.gameScene.state.jardidex[selected]||{state:'no descubierta',progress:0};
    this.panel.add(this.add.image(910,190,`plant_${p.colorIndex}_adult`).setScale(2.2));
    this.contentText(800,265,`${p.common}\n${p.scientific}\nTipo: ${p.type}\nColeccion: ${p.collection}\nLuz: ${p.light}\nRiego: ${p.water}\nSuelo: ${p.soil}\nEstado: ${d.state}\nDominio: ${d.progress}%\nError frecuente: ${p.commonMistake}`,16,'#e5f0c9',330);
    this.panel.add(this.makeButton(940,560,250,38,'Elegir para plantar',()=>{this.gameScene.setCurrentPlant(PLANTS.findIndex(x=>x.id===p.id)); this.toast('Planta elegida: '+p.common,true); }));
  }

  drawShop(){
    const s=this.activeTab.shop; this.tabs(SHOP_SECTIONS,s,96,132,(tab)=>{this.activeTab.shop=tab; this.showPanel('shop');},110);
    const items=this.gameScene.shop.bySection(s,true,false).slice(0,18);
    this.contentText(820,150,'Selecciona un objeto no obtenido para comprarlo con Puntos Verdes. El Mercado Verde evita duplicados y algunos objetos se desbloquean por logros.',16,'#b9d4ac',330);
    items.forEach((it,i)=>{ const cx=100+(i%4)*170, cy=185+Math.floor(i/4)*72; this.card(cx,cy,155,56,`${it.name}\nPrecio: ${it.price}`,()=>{ const r=this.gameScene.shop.buy(it); this.toast(r.msg,r.ok); this.showPanel('shop'); }); });
  }

  drawWardrobe(){
    const cats=['gorro','ropa','mochila','botas','guantes','accesorio','titulos']; this.tabs(cats,this.activeTab.wardrobe,100,132,(tab)=>{this.activeTab.wardrobe=tab; this.showPanel('wardrobe');},105);
    this.gameScene.refreshAvatar();
    this.panel.add(this.add.image(225,286,this.gameScene.avatarTextureKey('down')).setScale(3.2));
    this.contentText(125,405,'El avatar se actualiza visualmente al equipar gorros, ropa, mochila, botas y accesorios. Coleccionarlos ahora sí se nota en partida.',15,'#cfe3bd',300);
    const owned=this.gameScene.state.ownedOutfits.map(id=>OUTFITS.find(o=>o.id===id)).filter(o=>o&&o.category===this.activeTab.wardrobe);
    owned.forEach((o,i)=>{ const cx=390+(i%4)*170, cy=185+Math.floor(i/4)*72; const equipped=Object.values(this.gameScene.state.avatar||{}).includes(o.id); this.card(cx,cy,155,56,`${equipped?'EQUIPADO':'Disponible'}\n${o.name}\n${o.rarity}`,()=>{ if(this.gameScene.avatar.equip(o.id)){ this.gameScene.refreshAvatar(); this.toast('Equipado: '+o.name,true); this.showPanel('wardrobe'); } },{line:equipped?0xe4f58d:0x5a7960,size:12}); });
    const total=OUTFITS.length, have=this.gameScene.state.ownedOutfits.length; this.contentText(850,185,`Armario Verde: ${have}/${total}\nSets completos: ${Object.keys(this.gameScene.state.completedSets).length}/${SETS.length}\nCompra prendas en Mercado Verde o desbloquealas mediante logros.`,16,'#e5f0c9',300);
  }

  drawAchievements(){
    const list=this.gameScene.ach.list();
    list.forEach((a,i)=>{ const p=a.progress; const cx=100+(i%3)*355, cy=140+Math.floor(i/3)*58; this.card(cx,cy,335,48,`${p.unlocked?'DESBLOQUEADO':'BLOQUEADO'}: ${a.name}\n${p.value}/${a.target} - ${a.desc}`,()=>{}, {line:p.unlocked?0xe4f58d:0x5a7960,size:12}); });
  }

  drawMissions(){
    this.contentText(100,125,'Elige una misión y fíjate en la barra de progreso. Las misiones activas también aparecen en el HUD.',15,'#b9d4ac',900);
    MISSIONS.forEach((m,i)=>{
      const x=100+(i%2)*550, y=160+Math.floor(i/2)*88;
      const done=this.gameScene.state.missions.done.includes(m.id); const active=this.gameScene.state.missions.active===m.id; const prog=this.gameScene.missionProgress(m); const ratio=Math.min(1,prog.value/prog.target);
      const c=this.add.container(x,y); const bg=this.add.graphics(); bg.fillStyle(active?0x253c2c:0x223039,1); bg.fillRoundedRect(0,0,515,74,8); bg.lineStyle(2,done?0xe4f58d:active?0x8fce69:0x5a7960,1); bg.strokeRoundedRect(0,0,515,74,8);
      bg.fillStyle(0x0d1418,1); bg.fillRoundedRect(18,47,310,12,5); bg.fillStyle(done?0xe4f58d:0x6fc469,1); bg.fillRoundedRect(18,47,310*ratio,12,5);
      const title=this.add.text(18,8,`${active?'ACTIVA':done?'COMPLETADA':'DISPONIBLE'}: ${m.name}`,{fontFamily:'monospace',fontSize:15,color:'#e8f7c5'});
      const desc=this.add.text(18,27,m.desc,{fontFamily:'monospace',fontSize:12,color:'#b9d4ac',wordWrap:{width:465}});
      const pr=this.add.text(340,45,`${Math.min(prog.value,prog.target)}/${prog.target}`,{fontFamily:'monospace',fontSize:14,color:'#eef8d0'});
      const z=this.add.zone(257,37,515,74).setInteractive({useHandCursor:true}).on('pointerdown',()=>{this.gameScene.state.missions.active=m.id; this.toast('Misión activa: '+m.name,true); this.showPanel('missions');});
      c.add([bg,title,desc,pr,z]); this.panel.add(c);
    });
    this.contentText(100,590,'Objetivos diarios sugeridos: '+DAILY_OBJECTIVES.slice(0,3).join(' | '),15,'#b9d4ac',980);
  }

  drawMapPanel(){ this.contentText(100,140,'Mapa Verde. Zonas iniciales: Jardin inicial, Vivero, Invernadero, Zona seca, Zona de sombra, Compostaje, Huerto y Jardin ornamental.',18,'#e5f0c9',930); ['Jardin inicial','Vivero','Invernadero','Zona seca','Zona sombra','Compostaje','Huerto','Ornamental'].forEach((z,i)=>this.card(130+(i%4)*240,220+Math.floor(i/4)*120,210,82,`${z}\nEstado: desbloqueada\nCondiciones propias`,()=>{})); }
  drawDiary(){ const lines=this.gameScene.state.diary.slice(0,14).join('\n'); this.contentText(110,145,lines||'Todavia no hay entradas.',17,'#e5f0c9',1000); }
  drawNotifications(){ const lines=this.gameScene.state.notifications.slice(0,12).map(n=>`Dia ${n.day}: ${n.title}. ${n.body}`).join('\n\n'); this.contentText(110,145,lines||'Sin novedades en el Buzon Verde.',16,'#e5f0c9',1000); }
  drawCrafting(){ RECIPES.forEach((r,i)=>{ this.card(110+(i%3)*350,150+Math.floor(i/3)*72,330,58,`${r.name}\nIngredientes: ${r.in.join(', ')}`,()=>{const res=this.gameScene.crafting.craft(r); this.toast(res.msg,res.ok); this.showPanel('crafting');}); }); }
  drawSummary(){ const s=this.gameScene.state.summary||{health:0,biodiversity:0,water:70,beauty:0,plants:0,healthy:0,problems:0}; this.contentText(120,145,`Estado general del jardin\n\nSalud media: ${s.health}%\nBiodiversidad: ${s.biodiversity}%\nEficiencia hidrica: ${s.water}%\nEstetica: ${s.beauty}%\nPlantas totales: ${s.plants}\nPlantas sanas: ${s.healthy}\nPlantas con problemas: ${s.problems}\n\nSiguiente paso recomendado:\n${this.gameScene.getSuggestion()}`,21,'#e5f0c9',760); this.panel.add(this.makeButton(850,210,240,44,'Ver JardiDex',()=>this.openPanel('jardidex'))); this.panel.add(this.makeButton(850,270,240,44,'Ver logros cercanos',()=>this.openPanel('achievements'))); this.panel.add(this.makeButton(850,330,240,44,'Ver tienda',()=>this.openPanel('shop'))); }
  drawSettings(){ this.contentText(120,145,'Ajustes\n\nEl juego usa sonidos sinteticos ligeros. Puedes silenciarlos para clase.\n\nLa interfaz esta pensada para raton, teclado y pantalla tactil.\n\nPulsa Guardar ahora para conservar progreso.',19,'#e5f0c9',800); this.panel.add(this.makeButton(220,360,210,44,'Silenciar sonido',()=>{this.gameScene.soundSys.muted=!this.gameScene.soundSys.muted; this.toast(this.gameScene.soundSys.muted?'Sonido silenciado':'Sonido activado',true);})); this.panel.add(this.makeButton(460,360,210,44,'Guardar ahora',()=>{this.gameScene.save(); this.toast('Partida guardada.',true);})); this.panel.add(this.makeButton(700,360,210,44,'Borrar partida',()=>{SaveSystem.clear(); this.toast('Partida borrada. Vuelve al menu.',false);})); }
  toast(msg,ok=true){ if(this.message) this.message.destroy(); this.message=this.add.text(640,630,msg,{fontFamily:'monospace',fontSize:17,color:ok?'#efffc9':'#ffd1bd',backgroundColor:'#0b1115ee',padding:{x:14,y:8}}).setOrigin(.5).setDepth(100000); this.time.delayedCall(1800,()=>this.message?.destroy()); }
}
