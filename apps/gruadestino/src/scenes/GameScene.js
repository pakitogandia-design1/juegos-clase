import { scenesData, actions } from '../data/scenesData.js';
import { itemsData } from '../data/itemsData.js';
import { dialoguesData } from '../data/dialoguesData.js';

const SAVE_KEY = 'la-grua-del-destino-save';

export default class GameScene extends Phaser.Scene {
  constructor(){ super('GameScene'); }

  init(data){
    const saved = data?.newGame ? null : this.loadSave();
    this.state = saved || { sceneIndex:0, inventory:[], flags:{}, finalSeen:false };
    this.selectedAction = 'Mirar';
    this.selectedItem = null;
    this.hotspotObjects = [];
  }

  create(){
    this.cameras.main.fadeIn(400,0,0,0);
    this.scale.on('resize', () => this.renderScene(), this);
    this.renderScene();
  }

  loadSave(){ try { return JSON.parse(localStorage.getItem(SAVE_KEY)); } catch(e){ return null; } }
  save(){ localStorage.setItem(SAVE_KEY, JSON.stringify(this.state)); this.flashSave(); }
  current(){ return scenesData[this.state.sceneIndex]; }
  flag(k){ return !!this.state.flags[k]; }
  setFlag(k){ if(k) this.state.flags[k]=true; }
  hasItem(k){ return this.state.inventory.includes(k); }
  addItem(k){ if(k && !this.hasItem(k)) this.state.inventory.push(k); }

  renderScene(){
    this.children.removeAll();
    this.hotspotObjects=[];
    const w=this.scale.width, h=this.scale.height;
    const portrait = h>w;
    this.topH = portrait ? 76 : 62;
    this.bottomH = portrait ? Math.min(290, h*.38) : 188;
    this.sceneRect = new Phaser.Geom.Rectangle(0, this.topH, w, h-this.topH-this.bottomH);
    this.drawBackground();
    this.drawTopBar();
    this.drawHotspots();
    this.drawProtagonist();
    this.drawBottomBar();
    this.narrate(this.current().intro, false);
  }

  drawBackground(){
    const s=this.current(), r=this.sceneRect;
    this.add.rectangle(r.centerX,r.centerY,r.width,r.height,0x111822,1);
    const img=this.add.image(r.centerX,r.centerY,s.id);
    const tex=img.texture.getSourceImage();
    const iw=tex?.width||1600, ih=tex?.height||900;
    const scale=Math.max(r.width/iw, r.height/ih);
    img.setScale(scale).setAlpha(.95);
    this.add.rectangle(r.centerX,r.centerY,r.width,r.height,0x000000,.18);
  }

  drawTopBar(){
    const w=this.scale.width;
    this.add.rectangle(w/2,this.topH/2,w,this.topH,0x090a0e,.92).setStrokeStyle(1,0x3b2c14);
    this.add.text(16,12,'LA GRÚA DEL DESTINO',{fontFamily:'Arial Black',fontSize:'18px',color:'#f2d28a'});
    this.add.text(16,36,this.current().title,{fontFamily:'Arial',fontSize:'16px',color:'#ffffff'});
    this.smallButton(w-184, this.topH/2, 74, 34, 'Menú', ()=>this.scene.start('MenuScene'));
    this.smallButton(w-96, this.topH/2, 86, 34, 'Reiniciar', ()=>{ localStorage.removeItem(SAVE_KEY); this.state={sceneIndex:0,inventory:[],flags:{},finalSeen:false}; this.renderScene(); });
    this.add.text(w-300,this.topH-22,'Autoguardado ✓',{fontFamily:'Arial',fontSize:'13px',color:'#b8d9b8'}).setOrigin(1,0);
  }

  drawProtagonist(){
    const r=this.sceneRect, s=this.current();
    const x=r.x+r.width*(s.start?.x||.25), y=r.y+r.height*(s.start?.y||.72);
    this.protagonist=this.add.image(x,y,'protagonista').setDisplaySize(78,156).setDepth(6).setAlpha(.92);
    this.protagonist.setOrigin(.5,1);
  }

  drawHotspots(){
    const r=this.sceneRect;
    this.current().hotspots.forEach(hs=>{
      const x=r.x+r.width*hs.x, y=r.y+r.height*hs.y, w=r.width*hs.w, h=r.height*hs.h;
      const g=this.add.rectangle(x,y,w,h,0xf2d28a,.13).setStrokeStyle(2,0xf2d28a,.75).setDepth(5).setInteractive({useHandCursor:true});
      const label=this.add.text(x,y-h/2-12,hs.name,{fontFamily:'Arial Black',fontSize:'12px',color:'#ffe8a6',backgroundColor:'rgba(0,0,0,.6)',padding:{x:6,y:3}}).setOrigin(.5).setDepth(7);
      this.tweens.add({targets:g,alpha:.25,duration:900,yoyo:true,repeat:-1});
      g.on('pointerdown',()=>this.onHotspot(hs));
      this.hotspotObjects.push(g,label);
    });
  }

  drawBottomBar(){
    const w=this.scale.width,h=this.scale.height,y0=h-this.bottomH;
    this.add.rectangle(w/2,y0+this.bottomH/2,w,this.bottomH,0x08090d,.96).setStrokeStyle(2,0x473817);
    this.actionTexts=[];
    const buttonW=Math.min(120,(w-34)/4);
    actions.forEach((a,i)=>{
      const x=16+i*(buttonW+6)+buttonW/2, y=y0+26;
      this.actionButton(x,y,buttonW,42,a);
    });
    this.dialogueText=this.add.text(18,y0+58,'',{fontFamily:'Arial',fontSize: this.scale.width<700?'16px':'18px', color:'#fff',wordWrap:{width:w-36},lineSpacing:4});
    this.objectiveText=this.add.text(w-18,y0+58,'Objetivo: '+this.current().objective,{fontFamily:'Arial',fontSize:this.scale.width<700?'13px':'14px',color:'#f2d28a',align:'right',wordWrap:{width:Math.min(520,w*.45)}}).setOrigin(1,0);
    this.drawInventory(y0+this.bottomH-70);
  }

  drawInventory(y){
    const w=this.scale.width;
    this.add.text(18,y-22,'Inventario',{fontFamily:'Arial Black',fontSize:'14px',color:'#f2d28a'});
    const max = Math.max(1, Math.floor((w-34)/72));
    const inv=this.state.inventory.slice(-max);
    for(let i=0;i<max;i++){
      const x=18+i*72;
      const key=inv[i];
      const rect=this.add.rectangle(x+30,y+28,58,58,key===this.selectedItem?0x5f4820:0x15171d,.95).setStrokeStyle(2,key===this.selectedItem?0xffdf86:0x6a5832).setInteractive({useHandCursor:!!key});
      if(key){
        this.add.image(x+30,y+28,`item-${key}`).setDisplaySize(42,42);
        this.add.text(x+30,y+59,itemsData[key].name.split(' ')[0],{fontFamily:'Arial',fontSize:'10px',color:'#fff'}).setOrigin(.5,0);
        rect.on('pointerdown',()=>{ this.selectedItem = this.selectedItem===key ? null : key; this.selectedAction='Usar'; this.renderScene(); this.narrate(`Seleccionado: ${itemsData[key].name}. Ahora toca dónde usarlo.`, false); });
      } else {
        this.add.text(x+30,y+20,'—',{fontFamily:'Arial',fontSize:'22px',color:'#555'}).setOrigin(.5);
      }
    }
  }

  actionButton(x,y,w,h,label){
    const active=label===this.selectedAction;
    const r=this.add.rectangle(x,y,w,h,active?0x6d4f19:0x17191f,.95).setStrokeStyle(2,active?0xffdb83:0x846b3b).setInteractive({useHandCursor:true});
    const t=this.add.text(x,y,label,{fontFamily:'Arial Black',fontSize:'15px',color:'#fff'}).setOrigin(.5);
    r.on('pointerdown',()=>{ this.selectedAction=label; if(label!=='Usar') this.selectedItem=null; this.renderScene(); this.narrate(`Acción seleccionada: ${label}.`, false); });
  }

  smallButton(x,y,w,h,label,cb){
    const r=this.add.rectangle(x,y,w,h,0x17191f,.95).setStrokeStyle(1,0xd6b56d).setInteractive({useHandCursor:true});
    this.add.text(x,y,label,{fontFamily:'Arial Black',fontSize:'12px',color:'#fff'}).setOrigin(.5);
    r.on('pointerdown',cb);
  }

  moveToHotspot(hs, cb){
    const r=this.sceneRect;
    const targetX=r.x+r.width*hs.x, targetY=r.y+r.height*(hs.y+hs.h/2);
    if(!this.protagonist){ cb(); return; }
    this.tweens.add({targets:this.protagonist,x:targetX,y:targetY,duration:350,ease:'Sine.easeInOut',onComplete:cb});
  }

  onHotspot(hs){
    this.moveToHotspot(hs,()=>this.resolveAction(hs));
  }

  resolveAction(hs){
    const action=this.selectedAction;
    let text='';
    if(action==='Mirar'){
      text=hs.look || `Miras ${hs.name}. Confirma que la realidad tiene mal gusto.`;
      if(hs.flag && hs.id==='pizarra') this.setFlag(hs.flag);
    } else if(action==='Hablar'){
      if(hs.talk) { this.openDialogue(hs.talk, hs); return; }
      text=`Hablar con ${hs.name} sería raro incluso para hoy.`;
    } else if(action==='Coger'){
      if(hs.give){ this.addItem(hs.give); this.setFlag(hs.flag || `${hs.give}Cogido`); text=hs.take || `Coges ${hs.name}. Seguro que empeora algo.`; }
      else text=`No puedes coger ${hs.name}. Bastante carga emocional llevas ya.`;
    } else if(action==='Usar'){
      if(hs.seq){ if(!this.checkSequence(hs)) return; }
      if(hs.requires && this.selectedItem !== hs.requires){
        text=`Necesitas usar ${itemsData[hs.requires]?.name || hs.requires} con ${hs.name}.`;
      } else if(hs.use){
        text=hs.use; this.setFlag(hs.flag); if(hs.give) this.addItem(hs.give); if(hs.after) setTimeout(()=>this.openDialogue(hs.after, hs), 250);
      } else if(hs.give && !this.hasItem(hs.give)){
        this.addItem(hs.give); this.setFlag(hs.flag || `${hs.give}Cogido`); text=hs.take || `Lo usas y, de alguna forma, acaba en tu inventario.`;
      } else {
        text=`Usar ${this.selectedItem ? itemsData[this.selectedItem]?.name : 'eso'} con ${hs.name} no arregla la vida, pero lo intentaste.`;
      }
    }
    this.selectedItem=null;
    this.narrate(text, true);
    this.save();
    this.checkSceneSolved();
  }

  checkSequence(hs){
    const s=this.current();
    const seq=s.sequence;
    if(!seq) return true;
    const done=seq.filter(id=>this.flag(`seq_${id}`)).length;
    if(seq[done]!==hs.seq){
      this.narrate('Secuencia incorrecta. La grúa hace un ruido que en ningún idioma significa “bien”. Vuelve a intentarlo desde el cable.', true);
      seq.forEach(id=>delete this.state.flags[`seq_${id}`]);
      ['pasoCable','pasoOperador','pasoVecino','pasoTensar','pasoConfirmar'].forEach(k=>delete this.state.flags[k]);
      this.save(); return false;
    }
    this.setFlag(`seq_${hs.seq}`); this.setFlag(hs.flag);
    if(hs.talk){ this.openDialogue(hs.talk, hs); }
    return true;
  }

  openDialogue(key, hs){
    const data=dialoguesData[key];
    if(!data){ this.narrate('No hay nada que decir. La escena ya lo ha dicho todo.', true); return; }
    const w=this.scale.width,h=this.scale.height;
    const overlay=this.add.rectangle(w/2,h/2,w,h,0x000000,.55).setDepth(20).setInteractive();
    const box=this.add.rectangle(w/2,h/2,Math.min(760,w*.92),Math.min(430,h*.72),0x101216,.98).setStrokeStyle(2,0xd6b56d).setDepth(21);
    this.add.text(w/2,h/2-box.height/2+28,data.title,{fontFamily:'Arial Black',fontSize:'22px',color:'#f2d28a'}).setOrigin(.5).setDepth(22);
    data.options.forEach((op,i)=>{
      const yy=h/2-90+i*76;
      const bw=Math.min(680,w*.82);
      const r=this.add.rectangle(w/2,yy,bw,54,0x1b1e26,.96).setStrokeStyle(1,0x6f5b32).setDepth(22).setInteractive({useHandCursor:true});
      this.add.text(w/2,yy,op.text,{fontFamily:'Arial',fontSize:this.scale.width<700?'16px':'18px',color:'#fff',align:'center',wordWrap:{width:bw-24}}).setOrigin(.5).setDepth(23);
      r.on('pointerdown',()=>{
        overlay.destroy(); box.destroy();
        this.children.list.filter(o=>o.depth>=22).forEach(o=>o.destroy());
        if(op.flag) this.setFlag(op.flag);
        if(hs?.flag) this.setFlag(hs.flag);
        if(op.give) this.addItem(op.give);
        if(hs?.seq) {
          this.setFlag(`seq_${hs.seq}`);
          const map={cable:'pasoCable', operador:'pasoOperador', vecino:'pasoVecino', palanca:'pasoTensar', senales:'pasoConfirmar'};
          if(map[hs.seq]) this.setFlag(map[hs.seq]);
        }
        this.narrate(op.reply, true); this.save(); this.checkSceneSolved();
      });
    });
    const close=this.add.text(w/2,h/2+box.height/2-38,'Cerrar',{fontFamily:'Arial Black',fontSize:'16px',color:'#f2d28a'}).setOrigin(.5).setDepth(23).setInteractive({useHandCursor:true});
    close.on('pointerdown',()=>this.renderScene());
  }

  narrate(text, append=false){
    if(this.dialogueText) this.dialogueText.setText(text || '...');
  }

  checkSceneSolved(){
    const s=this.current();
    const ok=s.nextWhen?.every(k=> this.hasItem(k) || this.flag(k));
    if(!ok) return;
    this.time.delayedCall(500,()=>this.showNextPrompt());
  }

  showNextPrompt(){
    const s=this.current();
    const w=this.scale.width,h=this.scale.height;
    const overlay=this.add.rectangle(w/2,h/2,w,h,0x000000,.6).setDepth(30).setInteractive();
    const box=this.add.rectangle(w/2,h/2,Math.min(680,w*.9),240,0x101216,.98).setStrokeStyle(2,0xd6b56d).setDepth(31);
    this.add.text(w/2,h/2-64,s.nextText,{fontFamily:'Arial',fontSize:this.scale.width<700?'18px':'21px',color:'#fff',align:'center',wordWrap:{width:Math.min(610,w*.82)}}).setOrigin(.5).setDepth(32);
    const label=s.final?'Ver final':'Siguiente escena';
    const b=this.add.rectangle(w/2,h/2+62,260,52,0x6d4f19,.98).setStrokeStyle(2,0xffdb83).setDepth(32).setInteractive({useHandCursor:true});
    this.add.text(w/2,h/2+62,label,{fontFamily:'Arial Black',fontSize:'18px',color:'#fff'}).setOrigin(.5).setDepth(33);
    b.on('pointerdown',()=>{
      if(s.final){ this.state.finalSeen=true; this.save(); this.scene.start('EndingScene'); }
      else { this.state.sceneIndex++; this.save(); this.cameras.main.fadeOut(250,0,0,0); this.time.delayedCall(260,()=>this.renderScene()); }
    });
  }

  flashSave(){
    // intentionally subtle: top bar already indicates autosave
  }
}
