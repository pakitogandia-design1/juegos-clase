import { PLANTS } from '../data/plants.js';
import { TOOLS, BLOCKS, RESOURCES } from '../data/items.js';
import { ACHIEVEMENTS } from '../data/achievements.js';
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
    this.nav=new NavigationSystem(this); this.panel=null; this.activeTab={shop:'Vivero',wardrobe:'gorro',inventory:'Todos'}; this.message=null;
    this.createHud(); this.refreshHud();
    if(this.openOnStart) this.time.delayedCall(200,()=>this.openPanel(this.openOnStart));
  }
  createHud(){
    this.hud=this.add.container(0,0).setDepth(50000);
    this.top=this.add.graphics(); this.hud.add(this.top);
    this.info=this.add.text(18,14,'',{fontFamily:'monospace',fontSize:17,color:'#e6f5cb'}); this.hud.add(this.info);
    this.mission=this.add.text(18,42,'',{fontFamily:'monospace',fontSize:14,color:'#aacfa2'}); this.hud.add(this.mission);
    this.notice=this.add.text(1030,14,'',{fontFamily:'monospace',fontSize:14,color:'#d9efbd',align:'right'}).setOrigin(0,0); this.hud.add(this.notice);
    this.menuButton=this.makeButton(1185,46,140,36,'Menu',()=>this.togglePause()); this.hud.add(this.menuButton);
    this.dayButton=this.makeButton(1028,46,150,36,'Dia siguiente',()=>this.gameScene.nextDay()); this.hud.add(this.dayButton);
    this.hotbar=this.add.container(640,650); this.hud.add(this.hotbar);
  }
  refreshHud(){
    const s=this.gameScene.state;
    this.top.clear(); this.top.fillStyle(0x0c1418,.72); this.top.fillRect(0,0,1280,82); this.top.lineStyle(2,0x395c42,1); this.top.lineBetween(0,82,1280,82);
    this.info.setText(`Puntos Verdes: ${s.greenPoints}   Reputacion: ${s.reputation}   Dia ${s.day} - ${s.season} - ${s.weather}   Modo: ${s.mode==='creative'?'Creativo':'Aventura Verde'}`);
    const m=MISSIONS.find(x=>x.id===s.missions.active); this.mission.setText(m?`Mision activa: ${m.name}`:'Sin mision activa');
    const n=s.notifications[0]; this.notice.setText(n?`Buzon Verde: ${n.title}`:'Buzon Verde: sin novedades');
    this.drawHotbar();
  }
  drawHotbar(){
    this.hotbar.removeAll(true); const items=this.gameScene.toolbar();
    const bg=this.add.graphics(); bg.fillStyle(0x0b1115,.75); bg.fillRoundedRect(-250,-34,500,68,7); bg.lineStyle(2,0x395c42,1); bg.strokeRoundedRect(-250,-34,500,68,7); this.hotbar.add(bg);
    items.forEach((id,i)=>{ const x=-216+i*54; const g=this.add.graphics(); g.fillStyle(this.gameScene.activeSlot===i?0x395c42:0x182329,1); g.fillRoundedRect(x,-24,46,46,4); g.lineStyle(2,this.gameScene.activeSlot===i?0xd8f19d:0x6b7c76,1); g.strokeRoundedRect(x,-24,46,46,4); this.hotbar.add(g);
      const key='icon_'+id; if(this.textures.exists(key)){ const img=this.add.image(x+23,-1,key).setScale(.88); this.hotbar.add(img); }
      const count=this.gameScene.state.inventory[id]; if(count){ const tx=this.add.text(x+37,11,String(count),{fontFamily:'monospace',fontSize:12,color:'#f6ffd7',backgroundColor:'#00000088'}).setOrigin(.5); this.hotbar.add(tx); }
      const num=this.add.text(x+6,-21,String(i+1),{fontFamily:'monospace',fontSize:10,color:'#b7c5ad'}); this.hotbar.add(num);
    });
    const p=PLANTS[this.gameScene.currentPlant%PLANTS.length]; this.hotbar.add(this.add.text(0,42,`Seleccion: ${this.itemName(this.gameScene.activeItem())}  Planta: ${p.common}`,{fontFamily:'monospace',fontSize:13,color:'#d9efbd'}).setOrigin(.5));
  }
  itemName(id){ return [...TOOLS,...BLOCKS,...RESOURCES].find(x=>x.id===id)?.name || id; }
  makeButton(x,y,w,h,label,cb){ const c=this.add.container(x,y); const g=this.add.graphics(); g.fillStyle(0x21342b,.95); g.fillRoundedRect(-w/2,-h/2,w,h,6); g.lineStyle(2,0x7fa65d,1); g.strokeRoundedRect(-w/2,-h/2,w,h,6); const t=this.add.text(0,0,label,{fontFamily:'monospace',fontSize:15,color:'#eef8d0'}).setOrigin(.5); const z=this.add.zone(0,0,w,h).setInteractive({useHandCursor:true}).on('pointerdown',()=>{this.gameScene.soundSys.beep('click'); cb();}); c.add([g,t,z]); return c; }
  openPanel(name,payload={}){ this.nav.open(name,payload); }
  showPanel(name,payload={},fromBack=false){
    this.closeOnlyPanel(); this.gameScene.setPaused(true); this.hud.setVisible(false);
    this.panel=this.add.container(0,0).setDepth(90000); const veil=this.add.rectangle(640,360,1280,720,0x05080a,.82).setInteractive(); const bg=this.add.graphics(); bg.fillStyle(0x162027,.98); bg.fillRoundedRect(70,55,1140,610,12); bg.lineStyle(3,0x80a95f,1); bg.strokeRoundedRect(70,55,1140,610,12); this.panel.add([veil,bg]);
    this.panel.add(this.add.text(98,76,this.title(name),{fontFamily:'monospace',fontSize:30,color:'#e8f7c5',stroke:'#07100c',strokeThickness:4}));
    this.panel.add(this.makeButton(990,86,130,38,'Atras',()=>this.nav.back())); this.panel.add(this.makeButton(1130,86,130,38,'Cerrar',()=>this.nav.close()));
    const map={pause:()=>this.drawPause(),inventory:()=>this.drawInventory(),jardidex:()=>this.drawJardidex(payload),shop:()=>this.drawShop(),wardrobe:()=>this.drawWardrobe(),achievements:()=>this.drawAchievements(),missions:()=>this.drawMissions(),map:()=>this.drawMapPanel(),diary:()=>this.drawDiary(),crafting:()=>this.drawCrafting(),tutorial:()=>this.drawTutorial(),summary:()=>this.drawSummary(),settings:()=>this.drawSettings(),notifications:()=>this.drawNotifications()};
    (map[name]||map.pause)();
  }
  title(n){ return ({pause:'Pausa',inventory:'Inventario',jardidex:'JardiDex',shop:'Mercado Verde',wardrobe:'Armario Verde',achievements:'Logros',missions:'Misiones',map:'Mapa Verde',diary:'Diario del Jardinero',crafting:'Banco de trabajo',tutorial:'Tutorial inicial',summary:'Resumen del jardin',settings:'Ajustes',notifications:'Buzon Verde'}[n]||n); }
  closeOnlyPanel(){ if(this.panel){this.panel.destroy(true); this.panel=null;} }
  closePanel(){ this.closeOnlyPanel(); this.gameScene.setPaused(false); this.hud.setVisible(true); this.refreshHud(); this.gameScene.save(); }
  togglePause(){ if(this.panel) this.nav.close(); else this.openPanel('pause'); }
  contentText(x,y,text,size=17,color='#dcebc5',width=900){ const t=this.add.text(x,y,text,{fontFamily:'monospace',fontSize:size,color,wordWrap:{width},lineSpacing:5}); this.panel.add(t); return t; }
  tabs(list,active,x,y,cb){ list.forEach((l,i)=>{ const b=this.makeButton(x+i*128,y,120,34,l,()=>cb(l)); this.panel.add(b); if(l===active) b.list[0].lineStyle(2,0xe4f58d,1); }); }
  drawPause(){
    [['Continuar',()=>this.nav.close()],['Inventario',()=>this.openPanel('inventory')],['JardiDex',()=>this.openPanel('jardidex')],['Mercado Verde',()=>this.openPanel('shop')],['Armario Verde',()=>this.openPanel('wardrobe')],['Misiones',()=>this.openPanel('missions')],['Logros',()=>this.openPanel('achievements')],['Resumen',()=>this.openPanel('summary')],['Buzon Verde',()=>this.openPanel('notifications')],['Ajustes',()=>this.openPanel('settings')],['Guardar y salir',()=>{this.gameScene.save(); this.scene.stop('UIScene'); this.gameScene.scene.start('MainMenuScene'); this.gameScene.scene.stop();}]].forEach((b,i)=>this.panel.add(this.makeButton(250+(i%3)*230,170+Math.floor(i/3)*72,190,44,b[0],b[1])));
  }
  drawInventory(){
    const filters=['Todos','Herramientas','Semillas','Materiales','Bloques','Decoracion','Ropa']; this.tabs(filters,this.activeTab.inventory,110,135,(f)=>{this.activeTab.inventory=f; this.showPanel('inventory');});
    const entries=this.gameScene.inv.entries(); let x=110,y=190; entries.forEach((e,i)=>{ const cx=x+(i%6)*170, cy=y+Math.floor(i/6)*70; this.card(cx,cy,150,54,`${this.itemName(e.id)}\nCantidad: ${e.count}`,()=>{}); });
    this.contentText(830,185,'Consejo: selecciona herramientas con las teclas 1-9. La semilla planta la especie mostrada en la barra inferior. Pulsa C para el banco de trabajo.',16,'#b9d4ac',310);
    this.panel.add(this.makeButton(880,430,230,42,'Cambiar planta',()=>{this.gameScene.currentPlant=(this.gameScene.currentPlant+1)%PLANTS.length; this.showPanel('inventory');}));
  }
  card(x,y,w,h,text,cb){ const c=this.add.container(x,y); const g=this.add.graphics(); g.fillStyle(0x223039,1); g.fillRoundedRect(0,0,w,h,6); g.lineStyle(2,0x5a7960,1); g.strokeRoundedRect(0,0,w,h,6); const t=this.add.text(10,8,text,{fontFamily:'monospace',fontSize:13,color:'#e7f1d1',wordWrap:{width:w-20}}); const z=this.add.zone(w/2,h/2,w,h).setInteractive({useHandCursor:true}).on('pointerdown',()=>{this.gameScene.soundSys.beep('click'); cb();}); c.add([g,t,z]); this.panel.add(c); return c; }
  drawJardidex(payload={}){
    const selected=payload.id || PLANTS[0].id; let x=110,y=145; PLANTS.forEach((p,i)=>{ const d=this.gameScene.state.jardidex[p.id]; const label=`${d?d.state:'silueta'}\n${d?p.common:'???'}`; this.card(x+(i%5)*150,y+Math.floor(i/5)*64,136,50,label,()=>this.showPanel('jardidex',{id:p.id})); });
    const p=PLANTS.find(a=>a.id===selected); const d=this.gameScene.state.jardidex[selected]||{state:'no descubierta',progress:0}; const baseX=900; this.panel.add(this.add.image(baseX,190,`plant_${p.colorIndex}_adult`).setScale(2));
    this.contentText(800,265,`${p.common}\n${p.scientific}\nTipo: ${p.type}\nColeccion: ${p.collection}\nLuz: ${p.light}\nRiego: ${p.water}\nSuelo: ${p.soil}\nEstado: ${d.state}\nDominio: ${d.progress}%\nError frecuente: ${p.commonMistake}`,16,'#e5f0c9',330);
  }
  drawShop(){
    const s=this.activeTab.shop; this.tabs(SHOP_SECTIONS,s,105,135,(tab)=>{this.activeTab.shop=tab; this.showPanel('shop');});
    const items=this.gameScene.shop.bySection(s,true,false).slice(0,18); let info=this.add.text(830,160,'Selecciona un objeto no obtenido para comprarlo con Puntos Verdes. La tienda evita duplicados.',{fontFamily:'monospace',fontSize:16,color:'#b9d4ac',wordWrap:{width:320}}); this.panel.add(info);
    items.forEach((it,i)=>{ const cx=110+(i%4)*170, cy=190+Math.floor(i/4)*74; this.card(cx,cy,155,58,`${it.name}\nPrecio: ${it.price}`,()=>{ const r=this.gameScene.shop.buy(it); this.toast(r.msg,r.ok); this.showPanel('shop'); }); });
  }
  drawWardrobe(){
    const cats=['gorro','ropa','mochila','botas','guantes','accesorio','titulos']; this.tabs(cats,this.activeTab.wardrobe,105,135,(tab)=>{this.activeTab.wardrobe=tab; this.showPanel('wardrobe');});
    this.panel.add(this.add.image(225,275,'player_down').setScale(3)); this.contentText(130,390,'Avatar actual\nEl equipamiento se guarda y forma parte del coleccionismo.',16,'#cfe3bd',260);
    const owned=this.gameScene.state.ownedOutfits.map(id=>OUTFITS.find(o=>o.id===id)).filter(o=>o&&o.category===this.activeTab.wardrobe); owned.forEach((o,i)=>{ const cx=390+(i%4)*170, cy=190+Math.floor(i/4)*74; this.card(cx,cy,155,58,`${o.name}\n${o.rarity}`,()=>{this.gameScene.avatar.equip(o.id); this.toast('Equipado: '+o.name,true); this.showPanel('wardrobe');}); });
    const total=OUTFITS.length, have=this.gameScene.state.ownedOutfits.length; this.contentText(850,180,`Armario Verde: ${have}/${total}\nSets completos: ${Object.keys(this.gameScene.state.completedSets).length}/${SETS.length}\nCompra prendas en Mercado Verde o desbloquealas mediante logros.`,16,'#e5f0c9',300);
  }
  drawAchievements(){
    const list=this.gameScene.ach.list(); list.forEach((a,i)=>{ const p=a.progress; const cx=105+(i%3)*350, cy=140+Math.floor(i/3)*58; this.card(cx,cy,330,48,`${p.unlocked?'DESBLOQUEADO':'BLOQUEADO'}: ${a.name}\n${p.value}/${a.target} - ${a.desc}`,()=>{}); });
  }
  drawMissions(){
    MISSIONS.forEach((m,i)=>{ const done=this.gameScene.state.missions.done.includes(m.id); const active=this.gameScene.state.missions.active===m.id; this.card(110+(i%2)*520,145+Math.floor(i/2)*58,500,48,`${active?'ACTIVA':done?'HECHA':'DISPONIBLE'}: ${m.name}\n${m.desc}`,()=>{this.gameScene.state.missions.active=m.id; this.showPanel('missions');}); });
    this.contentText(110,600,'Objetivos diarios sugeridos: '+DAILY_OBJECTIVES.slice(0,3).join(' | '),15,'#b9d4ac',980);
  }
  drawMapPanel(){
    this.contentText(110,145,'Mapa Verde. Zonas iniciales: Jardin inicial, Vivero, Invernadero, Zona seca, Zona de sombra, Compostaje, Huerto y Jardin ornamental.',18,'#e5f0c9',930);
    const zones=['Jardin inicial','Vivero','Invernadero','Zona seca','Zona sombra','Compostaje','Huerto','Ornamental']; zones.forEach((z,i)=>this.card(130+(i%4)*240,220+Math.floor(i/4)*120,210,82,`${z}\nEstado: desbloqueada\nCondiciones propias`,()=>{}));
  }
  drawDiary(){ const lines=this.gameScene.state.diary.slice(0,14).join('\n'); this.contentText(110,145,lines||'Todavia no hay entradas.',17,'#e5f0c9',1000); }
  drawNotifications(){ const lines=this.gameScene.state.notifications.slice(0,12).map(n=>`Dia ${n.day}: ${n.title}. ${n.body}`).join('\n\n'); this.contentText(110,145,lines||'Sin novedades en el Buzon Verde.',16,'#e5f0c9',1000); }
  drawCrafting(){ RECIPES.forEach((r,i)=>{ this.card(110+(i%3)*350,150+Math.floor(i/3)*72,330,58,`${r.name}\nIngredientes: ${r.in.join(', ')}`,()=>{const res=this.gameScene.crafting.craft(r); this.toast(res.msg,res.ok); this.showPanel('crafting');}); }); }
  drawTutorial(){
    this.contentText(120,145,'Bienvenido a JardiCraft FP. Tutorial rapido:\n\n1. Muevete con WASD o flechas.\n2. Selecciona herramientas con 1-9.\n3. Usa azada sobre suelo para labrar.\n4. Usa semillas para plantar.\n5. Riega solo cuando haga falta.\n6. Abre JardiDex con J.\n7. Entra al Mercado Verde y al Armario Verde desde el menu.\n\nEl mundo se pausa automaticamente al abrir menus.',20,'#e5f0c9',880);
    this.panel.add(this.makeButton(560,560,240,44,'Marcar tutorial hecho',()=>{this.gameScene.state.tutorialDone=true; this.nav.close();}));
  }
  drawSummary(){ const s=this.gameScene.state.summary||{health:0,biodiversity:0,water:70,beauty:0,plants:0,healthy:0,problems:0}; this.contentText(120,145,`Estado general del jardin\n\nSalud media: ${s.health}%\nBiodiversidad: ${s.biodiversity}%\nEficiencia hidrica: ${s.water}%\nEstetica: ${s.beauty}%\nPlantas totales: ${s.plants}\nPlantas sanas: ${s.healthy}\nPlantas con problemas: ${s.problems}\n\nUsa esta pantalla para decidir que atender antes.`,22,'#e5f0c9',700); this.panel.add(this.makeButton(850,210,240,44,'Ver JardiDex',()=>this.openPanel('jardidex'))); this.panel.add(this.makeButton(850,270,240,44,'Ver logros cercanos',()=>this.openPanel('achievements'))); this.panel.add(this.makeButton(850,330,240,44,'Ver tienda',()=>this.openPanel('shop'))); }
  drawSettings(){ this.contentText(120,145,'Ajustes\n\nEl juego usa sonidos sinteticos ligeros. Puedes silenciarlos para clase.\n\nLa interfaz esta pensada para raton, teclado y pantalla tactil.\n\nPulsa Guardar ahora para conservar progreso.',19,'#e5f0c9',800); this.panel.add(this.makeButton(220,360,210,44,'Silenciar sonido',()=>{this.gameScene.soundSys.muted=!this.gameScene.soundSys.muted; this.toast(this.gameScene.soundSys.muted?'Sonido silenciado':'Sonido activado',true);})); this.panel.add(this.makeButton(460,360,210,44,'Guardar ahora',()=>{this.gameScene.save(); this.toast('Partida guardada.',true);})); this.panel.add(this.makeButton(700,360,210,44,'Borrar partida',()=>{SaveSystem.clear(); this.toast('Partida borrada. Vuelve al menu.',false);})); }
  toast(msg,ok=true){ if(this.message) this.message.destroy(); this.message=this.add.text(640,630,msg,{fontFamily:'monospace',fontSize:17,color:ok?'#efffc9':'#ffd1bd',backgroundColor:'#0b1115ee',padding:{x:14,y:8}}).setOrigin(.5).setDepth(100000); this.time.delayedCall(1700,()=>this.message?.destroy()); }
}
