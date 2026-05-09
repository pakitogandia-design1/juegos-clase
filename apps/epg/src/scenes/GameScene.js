import { BaseScene } from './BaseScene.js';
import { COLORS } from '../config/gameConfig.js';
import { CLASSIC_LEVELS } from '../config/levels.js';
import { EquationSystem } from '../systems/EquationSystem.js';
import { ArcadeGenerator } from '../systems/ArcadeGenerator.js';
import { progress } from '../systems/ProgressManager.js';
import { evaluateAchievements } from '../systems/AchievementManager.js';
import { unlockProgressCollectibles } from '../systems/CollectionManager.js';
import { EquationDisplay } from '../ui/EquationDisplay.js';
import { OperationPanel } from '../ui/OperationPanel.js';
import { makeButton } from '../ui/NeonButton.js';

const generator = new ArcadeGenerator();

export class GameScene extends BaseScene {
  constructor(){ super('GameScene'); }
  init(data){ this.mode = data.mode || 'classic'; this.level = data.level ?? 1; }
  create(){
    this.drawNeonBackground();
    this.setupLevel();
    this.drawArena();
    this.eqDisplay = new EquationDisplay(this, 640, 290);
    this.eqDisplay.render(this.eq);
    this.panel = new OperationPanel(this, (sel)=>this.activateOperation(sel));
    this.updateHud();
    this.showIntroTip();
  }
  setupLevel(){
    if (this.level === 0) {
      this.levelData = { id:0, title:'Tutorial: primer reflejo', eq:{ lA:1, lB:3, rA:0, rB:8 }, energy:100, moves:3, tip:'Tutorial: elige Pistola, resta 3 y mira cómo el espejo dispara también al otro lado.' };
    } else if (this.mode === 'classic') this.levelData = CLASSIC_LEVELS[this.level-1];
    else this.levelData = generator.generate(this.level);
    this.eq = new EquationSystem(this.levelData.eq);
    this.initialComplexity = this.eq.complexity();
    this.energy = this.levelData.energy ?? 90;
    this.movesLeft = this.levelData.moves ?? 5;
    this.timeLeft = this.levelData.time ?? 0;
    this.glitches = 0; this.busy = false; this.finished = false; this.usedMoves = 0;
    this.overload = this.levelData.overload ?? 160;
    if (this.timerEvent) this.timerEvent.remove();
    if (this.timeLeft > 0) this.timerEvent = this.time.addEvent({ delay: 1000, loop: true, callback: () => { if(!this.finished && !this.busy){ this.timeLeft--; this.updateHud(); if(this.timeLeft<=0) this.lose('El temporizador de la cámara llegó a cero.'); } } });
  }
  drawArena(){
    this.backButton();
    const title = this.mode === 'classic' ? `Clásico ${this.level || 'Tutorial'}: ${this.levelData.title}` : `Arcade ${this.level}/30: ${this.levelData.title}`;
    this.add.text(640, 22, title, {fontFamily:'Arial', fontSize:'22px', color:'#f4fbff', fontStyle:'bold'}).setOrigin(0.5);
    this.add.rectangle(320, 310, 540, 390, 0x07101a, 0.52).setStrokeStyle(2, COLORS.cyan, 0.35);
    this.add.rectangle(960, 310, 540, 390, 0x130817, 0.52).setStrokeStyle(2, COLORS.magenta, 0.35);
    this.add.text(320, 122, 'LADO IZQUIERDO', {fontFamily:'Arial', fontSize:'17px', color:'#9fb5c8', fontStyle:'bold'}).setOrigin(0.5);
    this.add.text(960, 122, 'LADO DERECHO', {fontFamily:'Arial', fontSize:'17px', color:'#9fb5c8', fontStyle:'bold'}).setOrigin(0.5);
    this.mirror = this.add.rectangle(640, 310, 28, 390, 0x02131f, 0.95).setStrokeStyle(5, COLORS.cyan, 1);
    this.mirrorCore = this.add.rectangle(640, 310, 8, 374, COLORS.cyan, 0.75);
    this.add.text(640, 516, 'MISMA OPERACIÓN · AMBOS LADOS', {fontFamily:'Arial', fontSize:'22px', color:'#ffffff', fontStyle:'bold'}).setOrigin(0.5).setShadow(0,0,'#00d9ff',12);
    this.tweens.add({targets:this.mirrorCore, alpha:{from:0.35,to:1}, scaleX:{from:1,to:1.45}, duration:900, yoyo:true, repeat:-1});
    this.hudText = this.add.text(1160, 34, '', {fontFamily:'Arial', fontSize:'18px', color:'#ffffff', align:'right'}).setOrigin(1,0);
    this.tipText = this.add.text(640, 548, '', {fontFamily:'Arial', fontSize:'17px', color:'#cfeaff', align:'center'}).setOrigin(0.5);
  }
  updateHud(){
    const time = this.timeLeft > 0 ? ` · Tiempo: ${this.timeLeft}s` : '';
    this.hudText?.setText(`Energía: ${Math.max(0, Math.round(this.energy))}%\nMovimientos: ${this.movesLeft}${time}\nGlitches: ${this.glitches}/3`);
  }
  showIntroTip(){
    this.tipText.setText(this.levelData.tip || 'Despeja x manteniendo el reflejo del espejo.');
  }
  activateOperation(sel){
    if (this.busy || this.finished) return;
    if (sel.num === 0 || (sel.op === '÷' && sel.num === 0)) return this.toast('El espejo rechaza dividir entre 0.', COLORS.red);
    if (sel.num === 'x' && ['×','÷'].includes(sel.op)) return this.toast('La carga x solo puede sumarse o restarse.', COLORS.red);
    const before = this.eq.clone();
    const beforeComplexity = before.complexity();
    try { this.eq.apply(sel.op, sel.num); } catch { return this.toast('Operación imposible para el espejo.', COLORS.red); }
    this.busy = true; this.panel.setEnabled(false); this.usedMoves++; this.movesLeft--; progress.recordOperation(sel.op);
    const afterComplexity = this.eq.complexity();
    const useful = afterComplexity < beforeComplexity;
    const cost = useful ? 7 : 15;
    this.energy -= cost;
    if (!useful) this.glitches++;
    this.animateOperation(sel, before, useful, () => {
      this.eqDisplay.render(this.eq); this.eqDisplay.pulseEquation(); this.updateHud();
      if (this.eq.maxMagnitude() > this.overload) return this.lose('Sobrecarga numérica: el espejo no puede contener tantos valores.');
      if (this.eq.isSolved()) return this.win();
      if (this.energy <= 0) return this.lose('El Espejo EPG se ha quedado sin energía.');
      if (this.movesLeft < 0) return this.lose('La incógnita escapó: demasiados movimientos.');
      if (this.glitches >= 3) return this.lose('Tres glitches tocaron el espejo y rompieron la cámara.');
      this.tipText.setText(useful ? '¡Movimiento limpio! La x está más cerca.' : 'Has conservado la igualdad, pero has complicado el despeje.');
      this.busy = false; this.panel.setEnabled(true);
    });
  }
  animateOperation(sel, before, useful, done){
    const startX = sel.side === 'left' ? 250 : 1030;
    const mirrorX = 640;
    const targetX = sel.side === 'left' ? 380 : 900;
    const reflectedX = sel.side === 'left' ? 900 : 380;
    const y = 330;
    this.tweens.add({targets:this.mirror, scaleX:1.6, alpha:1, yoyo:true, duration:180});
    this.cameras.main.shake(110, useful ? 0.003 : 0.006);
    if (sel.tool === 'pistol') this.animatePistol(sel, startX, targetX, reflectedX, mirrorX, y, useful, done);
    else this.animateHook(sel, startX, targetX, reflectedX, mirrorX, y, useful, done);
  }
  animatePistol(sel, startX, targetX, reflectedX, mirrorX, y, useful, done){
    const gun = this.add.container(startX, 500).setDepth(30);
    const color = sel.op === '-' ? COLORS.red : COLORS.purple;
    gun.add([this.add.rectangle(0,0,90,34,0x16111e,1).setStrokeStyle(3,color), this.add.rectangle(48,-10,46,16,color,0.9), this.add.text(0,0, sel.op === '-' ? 'PISTOLA' : 'DIVISOR', {fontFamily:'Arial',fontSize:'13px',fontStyle:'bold',color:'#fff'}).setOrigin(0.5)]);
    this.tweens.add({targets:gun, y:y+90, duration:220, ease:'Back.easeOut', onComplete:()=>{
      const bullets=[];
      const shots = sel.num === 'x' ? 3 : Math.min(sel.num,8);
      for(let i=0;i<shots;i++){
        const b=this.add.circle(startX, y+60-i*4, 7, color, 1).setDepth(25); bullets.push(b);
        this.tweens.add({targets:b, x:targetX, y:y-28+i*8, duration:260+i*30, ease:'Cubic.easeIn', onComplete:()=>this.impact(b.x,b.y,color)});
      }
      this.time.delayedCall(310, ()=>this.reflectWave(mirrorX, color));
      this.time.delayedCall(430, ()=>{
        const shots = sel.num === 'x' ? 3 : Math.min(sel.num,8);
      for(let i=0;i<shots;i++){
          const b=this.add.circle(mirrorX, y-20+i*7, 7, color, 1).setDepth(25);
          this.tweens.add({targets:b, x:reflectedX, y:y-28+i*8, duration:260+i*25, ease:'Cubic.easeOut', onComplete:()=>this.impact(b.x,b.y,color)});
        }
      });
      this.time.delayedCall(1050, ()=>{ gun.destroy(); done(); });
    }});
  }
  animateHook(sel, startX, targetX, reflectedX, mirrorX, y, useful, done){
    const color = sel.op === '+' ? COLORS.yellow : COLORS.green;
    const cable = this.add.rectangle(targetX, 105, 5, 20, color, 1).setOrigin(0.5,0).setDepth(25);
    const hook = this.add.text(targetX, 130, sel.op === '+' ? '📦' : '✦×', {fontFamily:'Arial',fontSize:'42px'}).setOrigin(0.5).setDepth(26);
    this.tweens.add({targets:cable, scaleY:10, duration:330, ease:'Sine.easeInOut'});
    this.tweens.add({targets:hook, y:y, duration:330, ease:'Sine.easeInOut', onComplete:()=>{
      this.impact(targetX,y,color);
      this.reflectWave(mirrorX, color);
      const hook2 = this.add.text(mirrorX, 130, sel.op === '+' ? '📦' : '✦×', {fontFamily:'Arial',fontSize:'42px'}).setOrigin(0.5).setDepth(26).setAlpha(0.7);
      this.tweens.add({targets:hook2, x:reflectedX, y:y, alpha:1, duration:430, ease:'Back.easeOut', onComplete:()=>{this.impact(reflectedX,y,color); hook2.destroy();}});
      this.time.delayedCall(760, ()=>{ cable.destroy(); hook.destroy(); done(); });
    }});
  }
  reflectWave(x, color){
    for(let i=0;i<3;i++){
      const r=this.add.rectangle(x,310,32,390,color,0.15).setDepth(20);
      this.tweens.add({targets:r, scaleX:7+i*3, alpha:0, duration:500+i*110, onComplete:()=>r.destroy()});
    }
  }
  impact(x,y,color){
    for(let i=0;i<12;i++){
      const p=this.add.circle(x,y,Phaser.Math.Between(2,5),color,1).setDepth(40);
      this.tweens.add({targets:p, x:x+Phaser.Math.Between(-55,55), y:y+Phaser.Math.Between(-40,40), alpha:0, duration:430, ease:'Quad.easeOut', onComplete:()=>p.destroy()});
    }
  }
  stars(){
    const target = this.levelData.targetSteps || Math.max(1, (this.levelData.moves ?? 4)-2);
    if (this.usedMoves <= target) return 3;
    if (this.energy > 45) return 2;
    return 1;
  }
  win(){
    this.finished = true; this.busy = false; this.panel.setEnabled(false);
    const stars = this.mode === 'classic' && this.level > 0 ? this.stars() : 0;
    if (this.level === 0) { progress.data.tutorialDone = true; progress.save(); }
    else if (this.mode === 'classic') progress.completeClassic(this.level, stars);
    else progress.completeArcade(this.level);
    unlockProgressCollectibles(progress);
    const news = evaluateAchievements(progress);
    const sol = this.eq.getSolution()?.toText() ?? '?';
    this.victoryAnimation(sol, stars, news);
  }
  victoryAnimation(sol, stars, news){
    this.tweens.add({targets:this.mirrorCore, scaleX:3, alpha:1, duration:300, yoyo:true, repeat:3});
    this.time.delayedCall(700, ()=>{
      const box=this.add.rectangle(640,320,680,360,0x050612,0.95).setStrokeStyle(4,COLORS.green,1).setDepth(200);
      const starText = this.mode==='classic' && this.level>0 ? `\nEstrellas: ${'★'.repeat(stars)}${'☆'.repeat(3-stars)}` : '';
      const nextText = this.level===0 ? 'Empezar clásico' : (this.mode==='classic' && this.level<10 ? 'Siguiente nivel' : this.mode==='arcade' && this.level<30 ? 'Siguiente cámara' : 'Volver al menú');
      this.add.text(640,235,`¡X LIBERADA!\nx = ${sol}${starText}`,{fontFamily:'Arial',fontSize:'34px',fontStyle:'bold',color:'#ffffff',align:'center'}).setOrigin(0.5).setDepth(201).setShadow(0,0,'#28ff9c',15);
      if(news.length) this.add.text(640,330,`Nuevo logro: ${news[0].name}`,{fontFamily:'Arial',fontSize:'20px',color:'#ffe66d',align:'center'}).setOrigin(0.5).setDepth(201);
      makeButton(this, 640, 420, 260, 55, nextText, ()=>{
        if(this.level===0) this.scene.start('GameScene',{mode:'classic',level:1});
        else if(this.mode==='classic' && this.level<10) this.scene.start('GameScene',{mode:'classic',level:this.level+1});
        else if(this.mode==='arcade' && this.level<30) this.scene.start('GameScene',{mode:'arcade',level:this.level+1});
        else this.scene.start('MenuScene');
      }, {color:COLORS.green,bold:true}).setDepth(202);
    });
  }
  lose(reason){
    this.finished = true; this.busy = false; this.panel.setEnabled(false);
    this.cameras.main.shake(500,0.018);
    this.mirror.setStrokeStyle(6, COLORS.red, 1);
    this.time.delayedCall(500, ()=>{
      this.add.rectangle(640,320,720,330,0x050612,0.96).setStrokeStyle(4,COLORS.red,1).setDepth(200);
      this.add.text(640,245,'ESPEJO SOBRECARGADO',{fontFamily:'Arial',fontSize:'36px',fontStyle:'bold',color:'#ffffff'}).setOrigin(0.5).setDepth(201).setShadow(0,0,'#ff3d62',15);
      this.add.text(640,315,reason,{fontFamily:'Arial',fontSize:'22px',color:'#ffd4dc',align:'center',wordWrap:{width:620}}).setOrigin(0.5).setDepth(201);
      makeButton(this, 530, 420, 220, 55, 'REINTENTAR', ()=>this.scene.start('GameScene',{mode:this.mode,level:this.level}), {color:COLORS.green,bold:true}).setDepth(202);
      makeButton(this, 770, 420, 220, 55, 'MENÚ', ()=>this.scene.start('MenuScene'), {color:COLORS.cyan,bold:true}).setDepth(202);
    });
  }
}
