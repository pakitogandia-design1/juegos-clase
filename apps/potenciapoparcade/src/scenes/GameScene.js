import { BubbleGrid } from '../systems/BubbleGrid.js';
import { AudioSystem } from '../systems/AudioSystem.js';
import { SaveSystem } from '../systems/SaveSystem.js';
import { powersForLevel, uniqueResults } from '../data/powers.js';
import { MODES, LEVELS } from '../data/levels.js';

const W=900,H=680;

class Bubble {
  constructor(scene,x,y,value,label,color){
    this.scene=scene; this.x=x; this.y=y; this.value=value; this.label=label || String(value); this.color=color;
    this.container=scene.add.container(x,y);
    this.circle=scene.add.circle(0,0,24,color,1).setStrokeStyle(3,0xffffff,.42);
    this.shine=scene.add.circle(-8,-9,7,0xffffff,.55);
    this.text=scene.add.text(0,1,this.label,{fontFamily:'Arial',fontSize:this.label.length>3?'15px':'18px',fontStyle:'900',color:'#11143d'}).setOrigin(.5);
    this.container.add([this.circle,this.shine,this.text]);
    this.container.setDepth(5);
  }
  setLabel(label){ this.label=label; this.text.setText(label); this.text.setFontSize(label.length>3?15:18); }
  destroyBubble(){ this.container.destroy(); }
  pulse(){ this.scene.tweens.add({targets:this.container,scale:1.16,yoyo:true,duration:115,ease:'Sine.easeOut'}); }
}

export class GameScene extends Phaser.Scene {
  constructor(){ super('GameScene'); }
  init(data){
    this.mode=data.mode||'normal'; this.levelId=data.level||1; this.onEnd=data.onEnd; this.onHud=data.onHud;
    this.modeCfg=MODES[this.mode]; this.level=LEVELS[this.levelId-1];
  }
  create(){
    this.audio=new AudioSystem(); this.save=SaveSystem.load();
    this.powers=powersForLevel(this.levelId); this.results=uniqueResults(this.powers);
    this.palette=[0x48e8ff,0x7cff9b,0xffd166,0xff4fd8,0xa78bfa,0xfb7185,0x93c5fd,0xfacc15,0x34d399,0xf97316];
    this.colorByValue=new Map(); this.results.forEach((v,i)=>this.colorByValue.set(v,this.palette[i%this.palette.length]));
    this.score=0; this.streak=0; this.misses=0; this.lives=this.modeCfg.lives; this.shots=0; this.cleared=0; this.perfect=true; this.freezeUntil=0;
    this.powerups={freeze:1,shuffle:2,bomb:1};
    this.dangerY=H-120;
    this.bg=this.add.graphics(); this.drawBackdrop();
    this.grid=new BubbleGrid(this,{radius:24,cols:this.level.cols,rows:12,x0:58,y0:62});
    this.makeInitialBoard();
    this.aim=this.add.graphics().setDepth(2);
    this.cannon=this.add.container(W/2,H-54).setDepth(10);
    this.cannonBase=this.add.circle(0,18,34,0x1e293b,1).setStrokeStyle(3,0x48e8ff,.8);
    this.cannonBar=this.add.rectangle(0,-12,30,76,0x2dd4bf,1).setOrigin(.5,1).setStrokeStyle(3,0xffffff,.45);
    this.cannon.add([this.cannonBar,this.cannonBase]);
    this.current=this.pickShot(); this.next=this.pickShot(); this.shotBubble=null; this.state='aim';
    this.createLoadedBubble(); this.updateHud('Forma grupos de 3 resultados iguales.');
    this.input.on('pointermove',p=>this.pointer=p); this.input.on('pointerdown',()=>{ if(this.state==='aim') this.shoot(); });
    this.dropGraceMs=this.modeCfg.graceMs ?? 30000;
    this.dropStartAt=this.time.now+this.dropGraceMs;
    this.lastDrop=this.dropStartAt;
    this.events.on('shutdown',()=>this.cleanup());
  }
  cleanup(){ this.input.removeAllListeners(); }
  drawBackdrop(){
    this.bg.clear();
    this.bg.fillGradientStyle(0x0a102f,0x0a102f,0x171052,0x2b105c,1); this.bg.fillRect(0,0,W,H);
    for(let i=0;i<70;i++){ this.bg.fillStyle(0xffffff,Math.random()*.22); this.bg.fillCircle(Math.random()*W,Math.random()*H,Math.random()*1.8+0.5); }
    this.bg.lineStyle(3,0xff5277,.95); this.bg.strokeLineShape(new Phaser.Geom.Line(24,this.dangerY,W-24,this.dangerY));
    this.add.text(30,this.dangerY+8,'LÍNEA DE PELIGRO',{fontSize:'13px',fontStyle:'900',color:'#ff9aaf'}).setDepth(1);
  }
  makeInitialBoard(){
    const values=this.results.slice(0,Math.max(3,this.level.paletteSize));
    for(let r=0;r<this.level.rows;r++){
      for(let c=0;c<this.level.cols;c++){
        if(r>1 && Math.random()<.12) continue;
        const v=Phaser.Utils.Array.GetRandom(values);
        const p=this.grid.pos(r,c); const b=new Bubble(this,p.x,p.y,v,String(v),this.colorByValue.get(v)); this.grid.set(r,c,b);
      }
    }
    // Guarantee a few pairs to make early play satisfying.
    for(let i=0;i<4;i++){
      const r=Phaser.Math.Between(1,Math.min(this.level.rows-1,5)); const c=Phaser.Math.Between(0,this.level.cols-2); const v=Phaser.Utils.Array.GetRandom(values);
      [0,1].forEach(dc=>{ const b=this.grid.get(r,c+dc); if(b){ b.value=v; b.setLabel(String(v)); b.circle.fillColor=this.colorByValue.get(v); }});
    }
  }
  boardValues(){ return [...new Set(this.grid.all().map(b=>b.value))]; }
  pickShot(){
    const board=this.boardValues(); const useful=this.powers.filter(p=>board.includes(p.result));
    const remaining=this.grid.all().length; let chance=this.modeCfg.usefulChance;
    if(remaining<18) chance=.84; if(remaining<9) chance=.94; if(this.deadUsefulCount>=2) chance=1;
    let pool=(useful.length && Math.random()<chance)?useful:this.powers;
    const p=Phaser.Utils.Array.GetRandom(pool); this.deadUsefulCount = useful.includes(p) ? 0 : (this.deadUsefulCount||0)+1; return p;
  }
  createLoadedBubble(){
    if(this.loaded) this.loaded.destroyBubble();
    this.loaded=new Bubble(this,W/2,H-95,this.current.result,this.current.label,this.colorByValue.get(this.current.result)||0x48e8ff);
    this.loaded.container.setDepth(12); this.loaded.container.setScale(1.05);
  }
  shoot(){
    const ang=this.getAimAngle(); const speed=650;
    this.state='shoot'; this.audio.shoot(); this.shots++; this.save.stats.shots++; SaveSystem.save(this.save);
    this.shotBubble=this.loaded; this.loaded=null; this.shotBubble.vx=Math.cos(ang)*speed; this.shotBubble.vy=Math.sin(ang)*speed; this.shotBubble.power=this.current;
    this.tweens.add({targets:this.cannon,y:H-50,duration:80,yoyo:true});
  }
  getAimAngle(){
    const p=this.pointer || {x:W/2,y:100};
    let a=Phaser.Math.Angle.Between(W/2,H-82,p.x,p.y);
    return Phaser.Math.Clamp(a, -Math.PI+0.16, -0.16);
  }
  update(time,delta){
    if(this.scene.isPaused()) return;
    const ang=this.getAimAngle(); this.cannonBar.rotation=ang+Math.PI/2;
    if(this.loaded){ this.loaded.container.x=W/2; this.loaded.container.y=H-95; }
    this.drawAim(ang);
    if(this.state==='shoot' && this.shotBubble) this.moveShot(delta/1000);
    const dropMs=this.level.dropEveryMs/(this.modeCfg.speed);
    if(time>this.dropStartAt && time-this.lastDrop>dropMs && time>this.freezeUntil){ this.dropRows(9); this.lastDrop=time; }
    this.checkDanger();
  }
  drawAim(ang){
    this.aim.clear(); if(!this.modeCfg.guide || this.state!=='aim') return;
    this.aim.lineStyle(4,0x48e8ff,.55); this.aim.fillStyle(0xffffff,.75);
    let x=W/2,y=H-98,dx=Math.cos(ang),dy=Math.sin(ang);
    for(let seg=0;seg<3;seg++){
      let t=999; if(dx<0) t=Math.min(t,(28-x)/dx); if(dx>0) t=Math.min(t,(W-28-x)/dx); if(dy<0) t=Math.min(t,(34-y)/dy);
      for(const b of this.grid.all()){
        const hit=this.rayCircle(x,y,dx,dy,b.x,b.y,28); if(hit && hit<t) t=hit;
      }
      t=Math.min(t,310); const nx=x+dx*t, ny=y+dy*t; this.aim.strokeLineShape(new Phaser.Geom.Line(x,y,nx,ny)); this.aim.fillCircle(nx,ny,4);
      if(nx<=30||nx>=W-30){ x=nx; y=ny; dx*=-1; } else break;
    }
  }
  rayCircle(x,y,dx,dy,cx,cy,r){
    const fx=x-cx, fy=y-cy; const b=2*(fx*dx+fy*dy), c=fx*fx+fy*fy-r*r; const disc=b*b-4*c;
    if(disc<0) return null; const t=(-b-Math.sqrt(disc))/2; return t>0?t:null;
  }
  moveShot(dt){
    const b=this.shotBubble; b.x+=b.vx*dt; b.y+=b.vy*dt; b.container.x=b.x; b.container.y=b.y;
    if(b.x<28){ b.x=28; b.vx=Math.abs(b.vx); this.audio.bounce(); }
    if(b.x>W-28){ b.x=W-28; b.vx=-Math.abs(b.vx); this.audio.bounce(); }
    if(b.y<42){ this.attachShot(null); return; }
    for(const ob of this.grid.all()){
      if(Phaser.Math.Distance.Between(b.x,b.y,ob.x,ob.y)<48){ this.attachShot(ob); return; }
    }
  }
  attachShot(hit){
    const shot=this.shotBubble; this.shotBubble=null; this.state='resolving';
    const cell=this.grid.nearestEmptyAround(shot.x,shot.y,hit); const p=this.grid.pos(cell.row,cell.col);
    shot.value=shot.power.result; shot.setLabel(String(shot.value)); shot.circle.fillColor=this.colorByValue.get(shot.value)||0x48e8ff;
    this.grid.set(cell.row,cell.col,shot); this.tweens.add({targets:shot.container,x:p.x,y:p.y,duration:80,ease:'Sine.easeOut',onComplete:()=>this.resolveAfterAttach(shot)});
    if(shot.value===64){ if(shot.power.exp===2) this.save.stats.made64Square=true; if(shot.power.exp===3) this.save.stats.made64Cube=true; }
  }
  resolveAfterAttach(shot){
    const group=this.grid.groupFrom(shot); let hit=false;
    if(group.length>=3){ hit=true; this.popGroup(group); }
    else { this.perfect=false; this.misses++; this.streak=0; this.save.stats.misses++; this.audio.bad(); this.updateHud(`${shot.power.label} = ${shot.value}. No formó grupo de 3.`); }
    if(hit){
      this.streak++; this.save.stats.hits++; if(shot.power.exp===2)this.save.stats.squares++; else this.save.stats.cubes++;
      this.save.stats.bestStreak=Math.max(this.save.stats.bestStreak,this.streak);
    }
    SaveSystem.updateAchievements(this.save); SaveSystem.save(this.save);
    this.time.delayedCall(hit?420:180,()=>this.nextTurn());
  }
  popGroup(group){
    this.audio.pop(); this.save.stats.groups++; this.cleared+=group.length; this.score+=group.length*120 + this.streak*35; this.save.stats.score+=group.length*120;
    for(const b of group){
      this.grid.cells.delete(this.grid.key(b.row,b.col));
      this.particlesAt(b.x,b.y,b.color); this.tweens.add({targets:b.container,scale:0,alpha:0,duration:250,ease:'Back.easeIn',onComplete:()=>b.destroyBubble()});
    }
    this.time.delayedCall(270,()=>{
      const floats=this.grid.floating(); if(floats.length){ this.audio.fall(); this.save.stats.fallen+=floats.length; this.score+=floats.length*180; }
      for(const b of floats){ this.grid.cells.delete(this.grid.key(b.row,b.col)); this.tweens.add({targets:b.container,y:H+60,rotation:Phaser.Math.FloatBetween(-2,2),duration:550,ease:'Back.easeIn',onComplete:()=>b.destroyBubble()}); }
      this.updateHud(`¡${group.length} burbujas! Combo x${Math.max(1,this.streak+1)}.`);
      if(this.grid.all().length===0) this.levelWin();
    });
  }
  particlesAt(x,y,color){
    for(let i=0;i<14;i++){
      const dot=this.add.circle(x,y,Phaser.Math.Between(2,5),color,.9).setDepth(20);
      this.tweens.add({targets:dot,x:x+Phaser.Math.Between(-70,70),y:y+Phaser.Math.Between(-70,70),alpha:0,scale:0,duration:420,ease:'Cubic.easeOut',onComplete:()=>dot.destroy()});
    }
  }
  nextTurn(){
    if(this.state==='ended') return;
    this.current=this.next; this.next=this.pickShot(); this.createLoadedBubble(); this.state='aim';
    const shotsForDrop=Math.max(6,Math.round(this.level.dropEveryShots/this.modeCfg.speed));
    if(this.shots>0 && this.time.now>this.dropStartAt && this.shots%shotsForDrop===0) this.dropRows(12);
    this.updateHud();
  }
  dropRows(amount){ this.grid.lower(amount); this.cameras.main.shake(90,.003); }
  checkDanger(){
    if(this.state==='ended') return;
    if(this.grid.all().some(b=>b.y>this.dangerY-18)){
      this.lives--; this.audio.lose(); this.perfect=false; this.dropRows(-60); this.dropGraceMs=this.modeCfg.graceMs ?? 30000;
    this.dropStartAt=this.time.now+this.dropGraceMs;
    this.lastDrop=this.dropStartAt;
      if(this.lives<1) this.levelLose(); else this.updateHud('¡Cuidado! Has perdido una vida por cruzar la línea.');
    }
  }
  levelWin(){
    if(this.state==='ended') return; this.state='ended'; this.audio.win();
    SaveSystem.completeLevel(this.save,this.mode,this.levelId,this.perfect); SaveSystem.updateAchievements(this.save); SaveSystem.save(this.save);
    this.onEnd?.({type:'win',mode:this.mode,level:this.levelId,score:this.score,perfect:this.perfect});
  }
  levelLose(){
    if(this.state==='ended') return; this.state='ended'; SaveSystem.updateAchievements(this.save); SaveSystem.save(this.save);
    this.onEnd?.({type:'lose',mode:this.mode,level:this.levelId,score:this.score,perfect:false});
  }
  updateHud(tip){
    const payload={mode:this.modeCfg.name,level:this.levelId,score:this.score,streak:this.streak,lives:this.lives,next:this.modeCfg.showNext?this.next?.label:'?', tip:tip||`${this.current?.label} = ? Busca dónde formar un trío. ${this.dropGraceMs>0?'El tablero empieza a bajar tras 30 s.':'¡El tablero ya está bajando!'}`};
    this.onHud?.(payload);
  }
  usePowerup(type){
    if(!this.powerups[type] || this.state!=='aim') return false;
    this.powerups[type]--;
    if(type==='freeze'){ this.freezeUntil=this.time.now+6500; this.updateHud('❄️ Techo congelado unos segundos.'); }
    if(type==='shuffle'){ this.current=this.pickShot(); this.createLoadedBubble(); this.updateHud('🔁 Burbuja cambiada.'); }
    if(type==='bomb'){
      const b=Phaser.Utils.Array.GetRandom(this.grid.all()); if(b){ this.audio.pop(); this.grid.removeBubble(b); this.cleared++; this.score+=160; this.updateHud('💥 Bomba raíz: una burbuja menos.'); if(this.grid.all().length===0){ this.levelWin(); return true; } }
    }
    this.updateHud(); return true;
  }
}
