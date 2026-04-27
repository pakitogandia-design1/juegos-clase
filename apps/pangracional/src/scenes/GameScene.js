import { LEVELS } from '../data/levels.js';
import { MODES } from '../data/modes.js';
import SaveSystem from '../systems/SaveSystem.js';
import AudioSystem from '../systems/AudioSystem.js';
import AchievementSystem from '../systems/AchievementSystem.js';
import PlatformSystem from '../systems/PlatformSystem.js';
import Player from '../systems/Player.js';
import BubbleSystem from '../systems/BubbleSystem.js';
import HarpoonSystem from '../systems/HarpoonSystem.js';
import PowerUpSystem from '../systems/PowerUpSystem.js';

export default class GameScene extends Phaser.Scene {
  constructor(){ super('GameScene'); }

  init(data) {
    this.modeId = data.mode || 'normal';
    this.levelId = data.levelId || 1;
    this.level = LEVELS[this.levelId-1];
    this.mode = MODES[this.modeId];
  }

  create(){
    this.physics.world.setBounds(0,0,960,520);
    this.audioSystem = new AudioSystem(this);
    this.createArcadeBackground();
    SaveSystem.recordLevelStart(this.modeId, this.levelId);
    this.levelStart = this.time.now;
    this.lives = this.mode.lives;
    this.score = 0;
    this.currentHarpoon = 'rational';
    this.streak = 0;
    this.noDamage = true;
    this.noWrong = true;
    this.shield = false;
    this.invulnerableUntil = 0;
    this.helpUntil = 0;
    this.periodUntil = 0;
    this.pausedByUser = false;
    this.timeLeft = this.mode.timer;

    this.platformSystem = new PlatformSystem(this, this.level);
    this.player = new Player(this, 480, 470, this.platformSystem);
    this.bubbles = new BubbleSystem(this, this.level, this.mode);
    this.harpoons = new HarpoonSystem(this);
    this.powerups = new PowerUpSystem(this, this.mode.powerRate);

    this.physics.add.collider(this.bubbles.group, this.platformSystem.platforms);
    this.physics.add.collider(this.bubbles.group, this.bubbles.group);
    this.physics.add.overlap(this.harpoons.group, this.bubbles.group, this.hitBubble, null, this);
    this.physics.add.overlap(this.player.sprite, this.bubbles.group, this.hitPlayer, null, this);
    this.physics.add.overlap(this.player.sprite, this.powerups.group, (_,p)=>this.powerups.apply(p), null, this);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      A:Phaser.Input.Keyboard.KeyCodes.A,D:Phaser.Input.Keyboard.KeyCodes.D,W:Phaser.Input.Keyboard.KeyCodes.W,S:Phaser.Input.Keyboard.KeyCodes.S,
      SPACE:Phaser.Input.Keyboard.KeyCodes.SPACE,SHIFT:Phaser.Input.Keyboard.KeyCodes.SHIFT,TAB:Phaser.Input.Keyboard.KeyCodes.TAB,
      C:Phaser.Input.Keyboard.KeyCodes.C,ONE:Phaser.Input.Keyboard.KeyCodes.ONE,TWO:Phaser.Input.Keyboard.KeyCodes.TWO,
      P:Phaser.Input.Keyboard.KeyCodes.P, ESC:Phaser.Input.Keyboard.KeyCodes.ESC
    });
    this.touch = {left:false,right:false,up:false,down:false,shoot:false};
    this.createTouchControls();
    this.createHud();
    this.updateHud();
    this.input.keyboard.on('keydown-TAB', e => e.preventDefault());
    this.physics.resume();
  }

  createArcadeBackground(){
    this.add.rectangle(480,270,960,540,0x08111f);
    for(let i=0;i<50;i++){
      const d=this.add.circle(Phaser.Math.Between(0,960),Phaser.Math.Between(0,520),Phaser.Math.Between(1,3),0x60a5fa,Phaser.Math.FloatBetween(.08,.28));
      this.tweens.add({targets:d,y:d.y-Phaser.Math.Between(20,70),alpha:.02,yoyo:true,repeat:-1,duration:Phaser.Math.Between(2200,5200)});
    }
    this.add.rectangle(480,520,960,40,0x172554,.95).setStrokeStyle(2,0x38bdf8,.5);
  }

  createHud(){
    this.hud = this.add.container(0,0).setDepth(50);
    this.hudBg = this.add.rectangle(480,18,960,36,0x020617,.76);
    this.hudText = this.add.text(14,18,'',{fontSize:15,color:'#e0f2fe',fontStyle:'bold'}).setOrigin(0,.5);
    this.harpoonLabel = this.add.text(810,18,'',{fontSize:15,color:'#fff',fontStyle:'bold'}).setOrigin(.5);
    this.hud.add([this.hudBg,this.hudText,this.harpoonLabel]);
  }

  updateHud(){
    const timer = this.mode.timer ? ` · Tiempo: ${Math.ceil(this.timeLeft)}` : '';
    const shield = this.shield ? ' · Escudo activo' : '';
    this.hudText.setText(`Nivel ${this.levelId}/15 · ${this.level.title} · Vidas: ${this.lives} · Puntos: ${this.score}${timer}${shield}`);
    this.harpoonLabel.setText(`Arpón: ${this.currentHarpoon === 'rational' ? 'RACIONAL' : 'IRRACIONAL'}`);
    this.harpoonLabel.setColor(this.currentHarpoon === 'rational' ? '#7dd3fc' : '#f0abfc');
  }

  createTouchControls(){
    const make = (x,y,label,key) => {
      const b = this.add.circle(x,y,28,0x111827,.68).setStrokeStyle(2,0x7dd3fc,.55).setDepth(80).setInteractive();
      const t = this.add.text(x,y,label,{fontSize:18,color:'#fff',fontStyle:'bold'}).setOrigin(.5).setDepth(81);
      b.on('pointerdown',()=>this.touch[key]=true);
      b.on('pointerup',()=>this.touch[key]=false);
      b.on('pointerout',()=>this.touch[key]=false);
      return [b,t];
    };
    make(54,468,'◀','left'); make(126,468,'▶','right'); make(90,404,'▲','up'); make(90,522,'▼','down');
    make(790,468,'⇄','change'); make(880,468,'⤊','shoot');
  }

  switchHarpoon(type=null){
    this.currentHarpoon = type || (this.currentHarpoon === 'rational' ? 'irrational' : 'rational');
    this.floatText(this.player.sprite.x, this.player.sprite.y-50, this.currentHarpoon === 'rational' ? 'Arpón racional' : 'Arpón irracional', this.currentHarpoon === 'rational' ? '#7dd3fc' : '#f0abfc');
    this.updateHud();
  }

  update(time, delta){
    if (!this.player || this.pausedByUser) return;
    if (Phaser.Input.Keyboard.JustDown(this.keys.P) || Phaser.Input.Keyboard.JustDown(this.keys.ESC)) return this.pauseGame();
    if (Phaser.Input.Keyboard.JustDown(this.keys.SHIFT) || Phaser.Input.Keyboard.JustDown(this.keys.TAB) || Phaser.Input.Keyboard.JustDown(this.keys.C) || this.touch.change) {
      this.touch.change = false; this.switchHarpoon();
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.ONE)) this.switchHarpoon('rational');
    if (Phaser.Input.Keyboard.JustDown(this.keys.TWO)) this.switchHarpoon('irrational');

    this.player.update(this.cursors, this.keys, this.touch);
    if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE) || this.touch.shoot) {
      this.touch.shoot = false;
      this.harpoons.shoot(this.player.sprite.x, this.player.sprite.y-28, this.currentHarpoon);
    }
    if (this.mode.timer) {
      this.timeLeft -= delta/1000;
      if (this.timeLeft <= 0) this.loseLife(true);
    }
    this.updateHud();
  }

  hitBubble(harpoon, bubble){
    if (!bubble.active || !harpoon.active) return;
    const correct = harpoon.harpoonType === bubble.category;
    const before = SaveSystem.load();
    if (correct) {
      this.streak++;
      this.score += 100 + this.streak*8;
      const afterBubble = SaveSystem.recordBubble(bubble.number, bubble.category);
      SaveSystem.recordShot(true, this.streak);
      this.audioSystem.ok();
      this.floatText(bubble.x, bubble.y-45, bubble.number.tip, '#bbf7d0');
      this.makeParticles(bubble.x,bubble.y,bubble.baseColor);
      this.powerups.maybeDrop(bubble.x, bubble.y);
      this.bubbles.splitBubble(bubble);
      bubble.destroy();
      if (!harpoon.pierce) harpoon.destroy();
      const after = SaveSystem.load();
      AchievementSystem.toast(this, AchievementSystem.newlyUnlocked(before, after));
      if (this.bubbles.remaining() <= 0) this.levelComplete();
    } else {
      this.noWrong = false;
      this.streak = 0;
      this.score = Math.max(0, this.score - this.mode.wrongPenalty);
      SaveSystem.recordShot(false, 0);
      this.audioSystem.bad();
      this.floatText(bubble.x, bubble.y-45, this.time.now < this.helpUntil ? `Ese no era. ${bubble.number.tip}` : 'Ese no era el arpón correcto', '#fecaca');
      this.cameras.main.shake(90,.004);
      this.tweens.add({targets:bubble, scaleX:1.2, scaleY:1.2, yoyo:true, duration:95});
      harpoon.destroy();
    }
  }

  hitPlayer(player, bubble){
    if (this.time.now < this.invulnerableUntil) return;
    if (this.shield) {
      this.shield = false;
      this.invulnerableUntil = this.time.now + 900;
      this.floatText(player.x, player.y-55, 'Escudo periódico', '#fde68a');
      this.updateHud();
      return;
    }
    this.loseLife(false);
  }

  loseLife(timeout=false){
    this.noDamage = false;
    this.lives--;
    this.audioSystem.hurt();
    this.cameras.main.shake(220,.009);
    this.floatText(480,120, timeout ? '¡Tiempo agotado!' : '¡Daño!', '#fecaca');
    this.invulnerableUntil = this.time.now + 1600;
    this.player.sprite.setPosition(480,470);
    if (this.mode.timer && timeout) this.timeLeft = this.mode.timer;
    if (this.lives <= 0) this.gameOver();
  }

  levelComplete(){
    this.physics.pause();
    this.audioSystem.win();
    const elapsed = (this.time.now - this.levelStart)/1000;
    const before = SaveSystem.load();
    const after = SaveSystem.completeLevel(this.modeId, this.levelId, {elapsed, noDamage:this.noDamage, noWrong:this.noWrong, timeLeft:this.timeLeft});
    AchievementSystem.toast(this, AchievementSystem.newlyUnlocked(before, after));
    this.overlay(`Nivel superado`, `Tiempo: ${elapsed.toFixed(1)} s\nSin daño: ${this.noDamage?'sí':'no'} · Sin fallos: ${this.noWrong?'sí':'no'}`, [
      ['Siguiente',()=> this.levelId<15 ? this.scene.start('GameScene',{mode:this.modeId,levelId:this.levelId+1}) : this.scene.start('LevelSelectScene',{mode:this.modeId})],
      ['Selección',()=>this.scene.start('LevelSelectScene',{mode:this.modeId})],
      ['Menú',()=>this.scene.start('MenuScene')]
    ]);
  }

  gameOver(){
    this.physics.pause();
    this.overlay('Game over', 'La clasificación matemática también se entrena. Revisa el progreso y vuelve a intentarlo.', [
      ['Reintentar',()=>this.scene.start('GameScene',{mode:this.modeId,levelId:this.levelId})],
      ['Niveles',()=>this.scene.start('LevelSelectScene',{mode:this.modeId})],
      ['Menú',()=>this.scene.start('MenuScene')]
    ]);
  }

  pauseGame(){
    this.pausedByUser = true;
    this.physics.pause();
    this.overlay('Pausa', 'Respira. Cambia de arpón antes de disparar.', [
      ['Continuar',()=>{ this.closeOverlay(); this.pausedByUser=false; this.physics.resume(); }],
      ['Niveles',()=>this.scene.start('LevelSelectScene',{mode:this.modeId})],
      ['Menú',()=>this.scene.start('MenuScene')]
    ]);
  }

  overlay(title, body, actions){
    this.overlayItems = [];
    const bg = this.add.rectangle(480,270,960,540,0x020617,.72).setDepth(200);
    const card = this.add.rectangle(480,270,520,330,0x111827,.96).setStrokeStyle(3,0x7dd3fc,.75).setDepth(201);
    const tt = this.add.text(480,155,title,{fontSize:38,color:'#fff',fontStyle:'bold'}).setOrigin(.5).setDepth(202);
    const bb = this.add.text(480,225,body,{fontSize:18,color:'#dbeafe',align:'center',lineSpacing:8,wordWrap:{width:450}}).setOrigin(.5).setDepth(202);
    this.overlayItems.push(bg,card,tt,bb);
    actions.forEach((a,i)=>{
      const b = this.add.rectangle(480,305+i*52,260,40,0x1f2a4a,.98).setStrokeStyle(2,0x60a5fa,.85).setDepth(202).setInteractive({useHandCursor:true});
      const tx = this.add.text(480,305+i*52,a[0],{fontSize:18,color:'#fff',fontStyle:'bold'}).setOrigin(.5).setDepth(203);
      b.on('pointerdown',a[1]);
      this.overlayItems.push(b,tx);
    });
  }

  closeOverlay(){
    (this.overlayItems||[]).forEach(o=>o.destroy());
    this.overlayItems = [];
  }

  floatText(x,y,msg,color='#e0f2fe'){
    const t=this.add.text(x,y,msg,{fontSize:15,color, fontStyle:'bold',stroke:'#020617',strokeThickness:4,align:'center',wordWrap:{width:260}}).setOrigin(.5).setDepth(90);
    this.tweens.add({targets:t,y:y-38,alpha:0,duration:1100,onComplete:()=>t.destroy()});
  }

  makeParticles(x,y,color){
    for(let i=0;i<14;i++){
      const p=this.add.circle(x,y,Phaser.Math.Between(2,5),color,.9).setDepth(70);
      this.tweens.add({targets:p,x:x+Phaser.Math.Between(-60,60),y:y+Phaser.Math.Between(-55,55),alpha:0,duration:450,onComplete:()=>p.destroy()});
    }
  }

  flashPeriodic(){
    this.bubbles.group.getChildren().forEach(b=>{
      if (b.number.kind === 'periodic') this.floatText(b.x,b.y-50,'bloque repetido', '#fde68a');
    });
  }

  showNumberLine(){
    const line = this.add.line(480,475,-270,0,270,0,0xfde68a,.75).setDepth(30).setOrigin(.5);
    const t = this.add.text(480,455,'Orden en la recta: piensa antes de disparar',{fontSize:15,color:'#fde68a',fontStyle:'bold'}).setOrigin(.5).setDepth(31);
    this.time.delayedCall(4200,()=>{line.destroy();t.destroy();});
  }
}
