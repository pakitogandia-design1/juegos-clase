/* Resident Gondal VR: Kebab Outbreak
   Survival arcade roguelite hecho desde cero para subir a apps/resident-gondal/ */

const STORAGE_KEY = 'residentGondalVR_save_v1';
const W = 1280;
const H = 720;

const ENEMY_DATA = [
  { id:'zombie', name:'Dani Zombi VR', class:'infectado', hp:34, speed:78, dmg:9, score:12, tint:0xbcc0b3, desc:'El primer afectado por el brote. Lento, pegajoso y muy insistente.' },
  { id:'rana', name:'Dani Rana', class:'saltador', hp:42, speed:95, dmg:11, score:18, tint:0x86e45f, desc:'Salta en ráfagas y deja charcos viscosos donde aterriza.' },
  { id:'pollo', name:'Dani Pollo', class:'enjambre', hp:24, speed:148, dmg:7, score:16, tint:0xffe08a, desc:'Corre sin sentido aparente. Ese es precisamente el problema.' },
  { id:'cerdo', name:'Dani Cerdo', class:'embestida', hp:88, speed:72, dmg:15, score:28, tint:0xff9fba, desc:'Carga en línea recta y convierte el suelo en una trampa de grasa.' },
  { id:'cavernicola', name:'Dani Cavernícola', class:'bruto', hp:75, speed:92, dmg:13, score:26, tint:0xb47d44, desc:'Ataca de cerca y lanza huesos del paleokebab.' },
  { id:'pirata', name:'Dani Pirata VR', class:'artillero', hp:68, speed:88, dmg:12, score:30, tint:0xb58a42, desc:'Se mueve en zigzag y dispara monedas malditas de salsa negra.' },
  { id:'vampiro', name:'Conde Dani', class:'drenaje', hp:66, speed:118, dmg:12, score:34, tint:0xdc4972, desc:'Se cura al hacer daño. No le dejes acercarse demasiado.' },
  { id:'gremlin', name:'Dani Gremlin', class:'travesura', hp:30, speed:170, dmg:9, score:24, tint:0xffc36d, desc:'Pequeño, rápido y capaz de multiplicarse si sobrevive mucho.' },
  { id:'orco', name:'Dani Orco', class:'élite', hp:115, speed:82, dmg:17, score:42, tint:0x7ac56e, desc:'Un muro verde con colmillos, mala leche y pulseras de raid.' },
  { id:'lobo', name:'Dani Lobo', class:'cazador', hp:80, speed:155, dmg:16, score:44, tint:0x7a5d49, desc:'Huele tu miedo y acelera cuando tienes poca vida.' },
  { id:'mago', name:'Dani Mago', class:'portal', hp:130, speed:58, dmg:14, score:80, boss:true, tint:0x6eb8ff, desc:'Invoca portales VR, ralentiza la zona y desaparece cuando conviene.' },
  { id:'gladiador', name:'Dani Gladiador', class:'boss tanque', hp:220, speed:66, dmg:21, score:140, boss:true, tint:0xf2a44b, desc:'Carga con furia y golpea el suelo con ondas de choque.' },
  { id:'bebe', name:'Dani Bebé Gigante', class:'mini boss', hp:165, speed:118, dmg:19, score:110, boss:true, tint:0x9ddcff, desc:'Rebota contra todo y pisa fuerte. Demasiado fuerte.' },
  { id:'rey', name:'Dani Rey', class:'monarca', hp:250, speed:48, dmg:18, score:160, boss:true, tint:0xffd45f, desc:'Invoca súbditos y solo se debilita cuando cae su corona.' },
  { id:'papa', name:'Dani Papa VR', class:'bendición', hp:210, speed:52, dmg:15, score:170, boss:true, tint:0xffffff, desc:'Bendice enemigos, los cura y castiga a quien se queda quieto.' },
  { id:'titan', name:'Titán Morado VR', class:'finalista', hp:300, speed:56, dmg:23, score:190, boss:true, tint:0xa870ff, desc:'Cada golpe parece inevitable, hasta que aprendes a leer sus pausas.' },
  { id:'cazador', name:'Cazador Galáctico', class:'depredador', hp:270, speed:96, dmg:24, score:210, boss:true, tint:0xd1b286, desc:'Se camufla, marca al jugador y ataca desde ángulos imposibles.' }
];

const UPGRADES = [
  { id:'damage', title:'Salsa Picante', text:'+25% daño', apply:p=>p.damage*=1.25 },
  { id:'rate', title:'Doble Pincho', text:'Disparo más rápido', apply:p=>p.fireDelay=Math.max(110,p.fireDelay*0.78) },
  { id:'speed', title:'VR Overclock', text:'+18% velocidad', apply:p=>p.speed*=1.18 },
  { id:'maxhp', title:'Pan de Pita Blindado', text:'+25 vida máxima', apply:p=>{p.maxHp+=25;p.hp=Math.min(p.maxHp,p.hp+25)} },
  { id:'heal', title:'Salsa Blanca', text:'Recuperas 45 vida', apply:p=>p.hp=Math.min(p.maxHp,p.hp+45) },
  { id:'pierce', title:'Pincho Perforante', text:'+1 penetración', apply:p=>p.pierce++ },
  { id:'multi', title:'Extra de Carne', text:'+1 proyectil lateral', apply:p=>p.multi=Math.min(4,p.multi+1) },
  { id:'crit', title:'Cebolla Tóxica', text:'Golpes críticos y veneno', apply:p=>p.crit+=0.12 },
  { id:'dash', title:'Dash de Kebab', text:'Dash recarga antes', apply:p=>p.dashCooldown=Math.max(400,p.dashCooldown*0.72) },
  { id:'magnet', title:'Olor a Kebab', text:'Atrae monedas y curas', apply:p=>p.magnet+=80 }
];

function loadSave(){ try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||{unlocked:{},best:0,runs:0,sound:true};}catch(e){return{unlocked:{},best:0,runs:0,sound:true}} }
function saveGame(s){ localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function choice(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function dist(a,b){ return Phaser.Math.Distance.Between(a.x,a.y,b.x,b.y); }

class SoundLab{
  constructor(scene){ this.scene=scene; this.ctx=null; this.enabled=loadSave().sound!==false; this.musicTimer=null; }
  init(){ if(!this.ctx) this.ctx=new (window.AudioContext||window.webkitAudioContext)(); if(this.ctx.state==='suspended') this.ctx.resume(); }
  tone(freq=440,dur=.08,type='square',gain=.05){ if(!this.enabled) return; this.init(); const o=this.ctx.createOscillator(); const g=this.ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(gain,this.ctx.currentTime); g.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+dur); o.connect(g); g.connect(this.ctx.destination); o.start(); o.stop(this.ctx.currentTime+dur); }
  noise(dur=.12,gain=.06){ if(!this.enabled) return; this.init(); const len=this.ctx.sampleRate*dur; const buf=this.ctx.createBuffer(1,len,this.ctx.sampleRate); const data=buf.getChannelData(0); for(let i=0;i<len;i++) data[i]=(Math.random()*2-1)*(1-i/len); const src=this.ctx.createBufferSource(); const g=this.ctx.createGain(); g.gain.value=gain; src.buffer=buf; src.connect(g); g.connect(this.ctx.destination); src.start(); }
  shoot(){ this.tone(640,.045,'sawtooth',.035); }
  hit(){ this.noise(.07,.035); this.tone(110,.05,'triangle',.025); }
  hurt(){ this.noise(.18,.075); this.tone(80,.16,'sawtooth',.045); }
  pickup(){ this.tone(620,.07,'sine',.04); setTimeout(()=>this.tone(920,.08,'sine',.04),70); }
  boss(){ this.tone(55,.45,'sawtooth',.08); setTimeout(()=>this.noise(.5,.04),80); }
  wave(){ [420,560,740].forEach((f,i)=>setTimeout(()=>this.tone(f,.1,'square',.035),i*90)); }
}

class BootScene extends Phaser.Scene{
  constructor(){ super('Boot'); }
  preload(){
    const box=this.add.rectangle(W/2,H/2,520,180,0x080b18,.88).setStrokeStyle(2,0x42e8ff,.5);
    this.add.text(W/2,H/2-30,'RESIDENT GONDAL VR',{fontSize:'34px',fontStyle:'900',color:'#ffdb68'}).setOrigin(.5);
    this.add.text(W/2,H/2+22,'Cargando outbreak kebab...',{fontSize:'18px',color:'#dfe7ff'}).setOrigin(.5);
    ENEMY_DATA.forEach(e=>this.load.image(e.id,`assets/enemies/${e.id}.jpg`));
  }
  create(){
    const g=this.add.graphics();
    g.fillStyle(0x54fff0,1); g.fillCircle(16,16,16); g.generateTexture('player',32,32); g.clear();
    g.fillStyle(0xff4f7a,1); g.fillCircle(8,8,8); g.generateTexture('bullet',16,16); g.clear();
    g.fillStyle(0xffdb68,1); g.fillCircle(8,8,8); g.generateTexture('coin',16,16); g.clear();
    g.fillStyle(0x7dff95,1); g.fillRoundedRect(0,0,22,22,6); g.generateTexture('heal',22,22); g.destroy();
    this.scene.start('Menu');
  }
}

class MenuScene extends Phaser.Scene{
  constructor(){ super('Menu'); }
  create(){
    this.save=loadSave(); this.sound=new SoundLab(this);
    this.cameras.main.setBackgroundColor('#05060a');
    this.drawBg();
    this.add.text(W/2,70,'RESIDENT GONDAL VR',{fontSize:'62px',fontStyle:'900',color:'#ffffff',stroke:'#181b31',strokeThickness:8}).setOrigin(.5);
    this.add.text(W/2,125,'KEBAB OUTBREAK',{fontSize:'30px',fontStyle:'900',color:'#ffdb68',stroke:'#a31a4f',strokeThickness:5}).setOrigin(.5);
    this.add.text(W/2,170,'Survival arcade roguelite · oleadas · bosses · GondalDex',{fontSize:'18px',color:'#b9c5d6'}).setOrigin(.5);
    const ids=['gladiador','pirata','mago','rana','pollo','vampiro','cazador'];
    ids.forEach((id,i)=>{
      const x=160+i*160; const img=this.add.image(x,300,id).setDisplaySize(112,158).setAlpha(.82);
      img.setAngle((i%2?3:-3));
      this.tweens.add({targets:img,y:img.y+(i%2?14:-14),duration:1600+i*80,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    });
    this.makeBtn(W/2,445,'MODO HISTORIA ARCADE',()=>this.startGame('story'));
    this.makeBtn(W/2,510,'SUPERVIVENCIA INFINITA',()=>this.startGame('survival'));
    this.makeBtn(W/2,575,'BOSS RUSH',()=>this.startGame('bossrush'));
    this.makeBtn(W/2,640,'GONDALDEX',()=>this.scene.start('Gallery'));
    const mute=this.add.text(W-24,24,this.save.sound===false?'SONIDO OFF':'SONIDO ON',{fontSize:'16px',fontStyle:'900',color:'#ffffff',backgroundColor:'#14203a',padding:{x:14,y:9}}).setOrigin(1,0).setInteractive({useHandCursor:true});
    mute.on('pointerdown',()=>{this.save.sound=this.save.sound===false; saveGame(this.save); mute.setText(this.save.sound===false?'SONIDO OFF':'SONIDO ON'); this.sound.enabled=this.save.sound!==false; this.sound.pickup();});
    this.add.text(24,H-36,`Mejor puntuación: ${this.save.best||0} · Partidas: ${this.save.runs||0}`,{fontSize:'16px',color:'#9fb1ca'});
  }
  drawBg(){
    const g=this.add.graphics();
    g.fillGradientStyle(0x090a18,0x090a18,0x17112d,0x111f32,1); g.fillRect(0,0,W,H);
    for(let i=0;i<90;i++){ g.fillStyle(i%3?0x20304c:0x4b274f,Phaser.Math.FloatBetween(.12,.42)); g.fillCircle(Math.random()*W,Math.random()*H,Math.random()*3+1); }
    for(let x=0;x<W;x+=64){ g.lineStyle(1,0xffffff,.035); g.beginPath(); g.moveTo(x,0); g.lineTo(x,H); g.strokePath(); }
    for(let y=0;y<H;y+=64){ g.lineStyle(1,0xffffff,.035); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.strokePath(); }
  }
  makeBtn(x,y,label,cb){
    const c=this.add.container(x,y); const r=this.add.rectangle(0,0,360,48,0x111a31,.92).setStrokeStyle(2,0x48f5a4,.55); const t=this.add.text(0,0,label,{fontSize:'18px',fontStyle:'900',color:'#f7fbff'}).setOrigin(.5); c.add([r,t]); c.setSize(360,48).setInteractive({useHandCursor:true});
    c.on('pointerover',()=>{r.setFillStyle(0x203d43); c.setScale(1.03)}); c.on('pointerout',()=>{r.setFillStyle(0x111a31,.92); c.setScale(1)}); c.on('pointerdown',()=>{this.sound.pickup(); cb();}); return c;
  }
  startGame(mode){ this.scene.start('Game',{mode}); }
}

class GalleryScene extends Phaser.Scene{
  constructor(){ super('Gallery'); }
  create(){
    this.save=loadSave(); this.drawBg();
    this.add.text(48,28,'GONDALDEX',{fontSize:'42px',fontStyle:'900',color:'#ffdb68'});
    this.add.text(48,75,'Derrota versiones de Dani para desbloquear fichas, ataques y rarezas.',{fontSize:'17px',color:'#b9c5d6'});
    this.makeBack();
    const startX=60, startY=125, gapX=230, gapY=250;
    ENEMY_DATA.forEach((e,i)=>{
      const x=startX+(i%5)*gapX; const y=startY+Math.floor(i/5)*gapY; const unlocked=this.save.unlocked[e.id];
      const card=this.add.rectangle(x+85,y+105,190,230,0x0d1428,.92).setStrokeStyle(2,unlocked?0x48f5a4:0x39445d,.7);
      const img=this.add.image(x+85,y+78,e.id).setDisplaySize(112,150).setAlpha(unlocked?1:.22).setTint(unlocked?0xffffff:0x222222);
      this.add.text(x+85,y+166,unlocked?e.name:'???',{fontSize:'15px',fontStyle:'900',align:'center',color:unlocked?'#ffffff':'#6c748a',wordWrap:{width:170}}).setOrigin(.5,0);
      this.add.text(x+85,y+205,unlocked?e.class.toUpperCase():'BLOQUEADO',{fontSize:'11px',fontStyle:'900',color:unlocked?'#ffdb68':'#566075'}).setOrigin(.5);
      card.setInteractive({useHandCursor:true}).on('pointerdown',()=>this.showDetails(e,unlocked));
    });
  }
  drawBg(){ const g=this.add.graphics(); g.fillGradientStyle(0x05060a,0x05060a,0x17162e,0x0a1725,1); g.fillRect(0,0,W,H); for(let i=0;i<50;i++){g.fillStyle(0x42e8ff,.08);g.fillCircle(Math.random()*W,Math.random()*H,Math.random()*5+1);} }
  makeBack(){ const b=this.add.text(W-42,34,'VOLVER',{fontSize:'18px',fontStyle:'900',color:'#061018',backgroundColor:'#ffdb68',padding:{x:16,y:10}}).setOrigin(1,0).setInteractive({useHandCursor:true}); b.on('pointerdown',()=>this.scene.start('Menu')); }
  showDetails(e,unlocked){
    const shade=this.add.rectangle(W/2,H/2,W,H,0x000000,.72).setInteractive();
    const panel=this.add.rectangle(W/2,H/2,760,480,0x101728,.98).setStrokeStyle(3,unlocked?0x48f5a4:0xff4f7a,.85);
    const img=this.add.image(W/2-230,H/2,e.id).setDisplaySize(220,330).setAlpha(unlocked?1:.22).setTint(unlocked?0xffffff:0x222222);
    this.add.text(W/2-80,H/2-175,unlocked?e.name:'Ficha bloqueada',{fontSize:'32px',fontStyle:'900',color:'#ffffff',wordWrap:{width:420}});
    this.add.text(W/2-80,H/2-118,unlocked?`Clase: ${e.class}`:'Derrota a este enemigo para revelar su ficha.',{fontSize:'18px',color:'#ffdb68'});
    this.add.text(W/2-80,H/2-70,unlocked?e.desc:'Sigue jugando en Historia o Supervivencia para llenar la GondalDex.',{fontSize:'18px',color:'#c7d2e3',lineSpacing:7,wordWrap:{width:440}});
    this.add.text(W/2-80,H/2+65,unlocked?`PV base: ${e.hp}\nVelocidad: ${e.speed}\nDaño: ${e.dmg}\nPuntuación: ${e.score}`:'',{fontSize:'17px',color:'#b9c5d6',lineSpacing:8});
    const close=this.add.text(W/2+310,H/2-205,'X',{fontSize:'26px',fontStyle:'900',color:'#ffdb68'}).setOrigin(.5).setInteractive({useHandCursor:true});
    close.on('pointerdown',()=>{[shade,panel,img,close,...this.children.list.slice(-5)].forEach(o=>o&&o.destroy&&o.destroy()); this.scene.restart();});
    shade.on('pointerdown',()=>this.scene.restart());
  }
}

class GameScene extends Phaser.Scene{
  constructor(){ super('Game'); }
  init(data){ this.mode=data.mode||'survival'; }
  create(){
    this.save=loadSave(); this.sound=new SoundLab(this); this.sound.enabled=this.save.sound!==false;
    this.wave=0; this.score=0; this.combo=0; this.kills=0; this.gamePaused=false; this.upgrading=false; this.bossActive=false; this.spawning=false; this.lastShot=0; this.lastDash=0; this.enemyBullets=null;
    this.playerStats={hp:110,maxHp:110,speed:230,damage:18,fireDelay:260,pierce:0,multi:0,crit:.05,dashCooldown:1100,magnet:80};
    this.drawArena();
    this.physics.world.setBounds(0,0,W,H);
    this.player=this.physics.add.sprite(W/2,H/2,'player').setDisplaySize(34,34).setCollideWorldBounds(true); this.player.body.setCircle(16);
    this.player.invuln=0;
    this.bullets=this.physics.add.group({classType:Phaser.Physics.Arcade.Image});
    this.enemies=this.physics.add.group(); this.pickups=this.physics.add.group(); this.enemyShots=this.physics.add.group();
    this.keys=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SPACE,SHIFT,ESC');
    this.input.on('pointerdown',p=>{ this.sound.init(); if(p.x>W-170&&p.y>H-170) this.manualShoot=true; });
    this.input.on('pointerup',()=>this.manualShoot=false);
    this.createUi(); this.createTouchUi();
    this.physics.add.overlap(this.bullets,this.enemies,this.hitEnemy,null,this);
    this.physics.add.overlap(this.player,this.enemies,this.playerHit,null,this);
    this.physics.add.overlap(this.player,this.pickups,this.takePickup,null,this);
    this.physics.add.overlap(this.player,this.enemyShots,this.shotHitPlayer,null,this);
    this.startWave();
  }
  drawArena(){
    this.cameras.main.setBackgroundColor('#05060a');
    const g=this.add.graphics();
    g.fillGradientStyle(0x080a14,0x0c1021,0x151129,0x071822,1); g.fillRect(0,0,W,H);
    for(let i=0;i<140;i++){ const c=i%4===0?0xff4f7a:(i%3===0?0x48f5a4:0x42e8ff); g.fillStyle(c,Phaser.Math.FloatBetween(.03,.14)); g.fillCircle(Math.random()*W,Math.random()*H,Math.random()*3+1); }
    g.lineStyle(2,0x2b344d,.45); for(let x=80;x<W;x+=160){ g.beginPath(); g.moveTo(x,0); g.lineTo(x,H); g.strokePath(); } for(let y=70;y<H;y+=140){ g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.strokePath(); }
    for(let i=0;i<8;i++){ const r=this.add.rectangle(Math.random()*W,Math.random()*H,Phaser.Math.Between(70,150),Phaser.Math.Between(18,40),0x2b1d19,.75).setAngle(Math.random()*180); this.physics.add.existing(r,true); }
  }
  createUi(){
    this.hpBg=this.add.rectangle(156,30,250,20,0x260b13,.9).setScrollFactor(0); this.hpBar=this.add.rectangle(32,30,248,16,0x48f5a4,1).setOrigin(0,.5).setScrollFactor(0);
    this.scoreText=this.add.text(28,56,'Puntos 0',{fontSize:'18px',fontStyle:'900',color:'#ffffff'}).setScrollFactor(0);
    this.waveText=this.add.text(W/2,25,'OLEADA 1',{fontSize:'28px',fontStyle:'900',color:'#ffdb68',stroke:'#000',strokeThickness:5}).setOrigin(.5,0).setScrollFactor(0);
    this.infoText=this.add.text(W/2,65,'',{fontSize:'16px',color:'#c7d2e3'}).setOrigin(.5,0).setScrollFactor(0);
    this.pauseBtn=this.add.text(W-26,24,'PAUSA',{fontSize:'16px',fontStyle:'900',color:'#061018',backgroundColor:'#ffdb68',padding:{x:13,y:8}}).setOrigin(1,0).setInteractive({useHandCursor:true}).setScrollFactor(0);
    this.pauseBtn.on('pointerdown',()=>this.togglePause());
  }
  createTouchUi(){
    this.touch={x:0,y:0,dash:false};
    const pad=this.add.circle(86,H-88,62,0xffffff,.08).setStrokeStyle(2,0xffffff,.18).setScrollFactor(0).setInteractive();
    const knob=this.add.circle(86,H-88,22,0x48f5a4,.34).setScrollFactor(0);
    pad.on('pointermove',p=>{ const a=Phaser.Math.Angle.Between(86,H-88,p.x,p.y); const d=Math.min(48,Phaser.Math.Distance.Between(86,H-88,p.x,p.y)); knob.setPosition(86+Math.cos(a)*d,H-88+Math.sin(a)*d); this.touch.x=Math.cos(a)*(d/48); this.touch.y=Math.sin(a)*(d/48);});
    pad.on('pointerout',()=>{knob.setPosition(86,H-88); this.touch.x=0; this.touch.y=0;}); pad.on('pointerup',()=>{knob.setPosition(86,H-88); this.touch.x=0; this.touch.y=0;});
    const shoot=this.add.circle(W-92,H-92,58,0xff4f7a,.18).setStrokeStyle(2,0xff4f7a,.55).setScrollFactor(0).setInteractive(); this.add.text(W-92,H-101,'SALSA',{fontSize:'14px',fontStyle:'900',color:'#fff'}).setOrigin(.5).setScrollFactor(0);
    shoot.on('pointerdown',()=>{this.manualShoot=true; this.shootNearest();}); shoot.on('pointerup',()=>this.manualShoot=false); shoot.on('pointerout',()=>this.manualShoot=false);
    const dash=this.add.circle(W-205,H-70,36,0x42e8ff,.12).setStrokeStyle(2,0x42e8ff,.45).setScrollFactor(0).setInteractive(); this.add.text(W-205,H-77,'DASH',{fontSize:'12px',fontStyle:'900',color:'#fff'}).setOrigin(.5).setScrollFactor(0);
    dash.on('pointerdown',()=>this.doDash());
  }
  startWave(){
    this.wave++; this.bossActive=false; this.spawning=true; this.waveText.setText(this.mode==='bossrush'?`BOSS ${this.wave}`:`OLEADA ${this.wave}`); this.infoText.setText('Sobrevive, recoge mejoras y desbloquea la GondalDex.'); this.sound.wave();
    let pool=ENEMY_DATA.filter(e=>!e.boss && ENEMY_DATA.indexOf(e)<=Math.min(9,2+this.wave*2));
    let count=6+this.wave*3;
    if(this.mode==='story' && this.wave%3===0) return this.spawnBoss(this.pickStoryBoss());
    if(this.mode==='survival' && this.wave%5===0) return this.spawnBoss(this.pickSurvivalBoss());
    if(this.mode==='bossrush') return this.spawnBoss(ENEMY_DATA.filter(e=>e.boss)[(this.wave-1)%ENEMY_DATA.filter(e=>e.boss).length]);
    for(let i=0;i<count;i++){ this.time.delayedCall(i*260,()=>this.spawnEnemy(choice(pool))); }
    this.time.delayedCall(count*260+250,()=>{ this.spawning=false; });
  }
  pickStoryBoss(){ const bosses=['mago','gladiador','bebe','rey','papa','titan','cazador']; return ENEMY_DATA.find(e=>e.id===bosses[Math.min(bosses.length-1,Math.floor(this.wave/3)-1)]); }
  pickSurvivalBoss(){ const bosses=ENEMY_DATA.filter(e=>e.boss); return bosses[Math.floor((this.wave/5-1)%bosses.length)]; }
  spawnPoint(){ const side=Phaser.Math.Between(0,3); if(side===0)return{x:-40,y:Math.random()*H}; if(side===1)return{x:W+40,y:Math.random()*H}; if(side===2)return{x:Math.random()*W,y:-40}; return{x:Math.random()*W,y:H+40}; }
  spawnEnemy(data){
    if(!data) return; const p=this.spawnPoint(); const e=this.physics.add.image(p.x,p.y,data.id).setDisplaySize(data.boss?150:62,data.boss?205:88); e.dataRef=data; e.hp=data.hp*(1+this.wave*.12)*(data.boss?1.8:1); e.maxHp=e.hp; e.lastAttack=0; e.skillTimer=Phaser.Math.Between(800,2100); e.setDepth(data.boss?5:3); e.body.setCircle(data.boss?42:24,e.body.width/2-(data.boss?42:24),e.body.height/2-(data.boss?42:24)); this.enemies.add(e); this.flashSpawn(e); if(data.boss){ this.bossActive=true; this.showBossCard(data); }
  }
  spawnBoss(data){ this.sound.boss(); this.spawnEnemy(data); const minions=3+Math.floor(this.wave/2); for(let i=0;i<minions;i++) this.time.delayedCall(1500+i*600,()=>this.spawnEnemy(choice(ENEMY_DATA.filter(e=>!e.boss).slice(0,8)))); this.time.delayedCall(1600+minions*600,()=>{ this.spawning=false; }); }
  flashSpawn(e){ const c=this.add.circle(e.x,e.y,50,e.dataRef.tint,.28); this.tweens.add({targets:c,scale:2,alpha:0,duration:450,onComplete:()=>c.destroy()}); }
  showBossCard(data){
    const shade=this.add.rectangle(W/2,H/2,W,H,0x000000,.65).setDepth(80); const img=this.add.image(W/2-260,H/2,data.id).setDisplaySize(260,390).setDepth(81); const title=this.add.text(W/2+80,H/2-95,'ALERTA VR',{fontSize:'34px',fontStyle:'900',color:'#ff4f7a',stroke:'#000',strokeThickness:7}).setOrigin(.5).setDepth(82); const name=this.add.text(W/2+80,H/2-38,data.name,{fontSize:'38px',fontStyle:'900',color:'#ffdb68',stroke:'#000',strokeThickness:7,align:'center',wordWrap:{width:460}}).setOrigin(.5).setDepth(82); const desc=this.add.text(W/2+80,H/2+55,data.desc,{fontSize:'20px',color:'#ffffff',align:'center',wordWrap:{width:460}}).setOrigin(.5).setDepth(82); this.time.delayedCall(1850,()=>[shade,img,title,name,desc].forEach(o=>o.destroy())); this.cameras.main.shake(350,.008);
  }
  update(time,delta){
    if(this.gamePaused||this.upgrading) return;
    this.handleMove(delta); if(this.keys.SPACE.isDown||this.manualShoot) this.shootNearest(time); if(Phaser.Input.Keyboard.JustDown(this.keys.SHIFT)) this.doDash(); if(Phaser.Input.Keyboard.JustDown(this.keys.ESC)) this.togglePause();
    this.updateEnemies(time,delta); this.updateBullets(); this.updatePickups(); this.updateUi();
    if(this.enemies.countActive(true)===0 && !this.bossActive && !this.spawning && time>1200){ this.completeWave(); }
  }
  handleMove(delta){
    let vx=0,vy=0; if(this.keys.A.isDown||this.keys.LEFT.isDown)vx--; if(this.keys.D.isDown||this.keys.RIGHT.isDown)vx++; if(this.keys.W.isDown||this.keys.UP.isDown)vy--; if(this.keys.S.isDown||this.keys.DOWN.isDown)vy++;
    vx+=this.touch.x||0; vy+=this.touch.y||0; const len=Math.hypot(vx,vy)||1; this.player.setVelocity((vx/len)*this.playerStats.speed,(vy/len)*this.playerStats.speed);
  }
  shootNearest(time=this.time.now){ if(time-this.lastShot<this.playerStats.fireDelay) return; const target=this.getNearestEnemy(); if(!target) return; this.lastShot=time; const ang=Phaser.Math.Angle.Between(this.player.x,this.player.y,target.x,target.y); const shots=1+this.playerStats.multi; for(let i=0;i<shots;i++){ const spread=(i-(shots-1)/2)*0.17; this.fireBullet(ang+spread); } this.sound.shoot(); }
  fireBullet(angle){ const b=this.bullets.get(this.player.x+Math.cos(angle)*25,this.player.y+Math.sin(angle)*25,'bullet'); if(!b) return; b.setActive(true).setVisible(true).setDisplaySize(14,14).setDepth(4); b.damage=this.playerStats.damage*(Math.random()<this.playerStats.crit?2.1:1); b.pierce=this.playerStats.pierce; b.birth=this.time.now; b.body.setCircle(7); this.physics.velocityFromRotation(angle,560,b.body.velocity); }
  getNearestEnemy(){ let best=null,bd=99999; this.enemies.children.iterate(e=>{if(!e.active)return; const d=dist(this.player,e); if(d<bd){bd=d;best=e;}}); return best; }
  updateBullets(){ this.bullets.children.iterate(b=>{ if(!b||!b.active)return; if(this.time.now-b.birth>1300||b.x<-60||b.x>W+60||b.y<-60||b.y>H+60) b.destroy(); }); this.enemyShots.children.iterate(s=>{ if(!s||!s.active)return; if(this.time.now-s.birth>3500||s.x<-80||s.x>W+80||s.y<-80||s.y>H+80)s.destroy(); }); }
  updateEnemies(time,delta){
    this.enemies.children.iterate(e=>{
      if(!e||!e.active)return; const d=e.dataRef; let speed=d.speed*(1+this.wave*.018); if(d.id==='lobo'&&this.playerStats.hp<45)speed*=1.35;
      const a=Phaser.Math.Angle.Between(e.x,e.y,this.player.x,this.player.y);
      if(d.class==='artillero') speed*=.75; if(d.id==='gremlin') speed*=1.12;
      e.setVelocity(Math.cos(a)*speed,Math.sin(a)*speed); e.setAngle(Math.sin(time/300+e.x)*3);
      e.skillTimer-=delta;
      if(e.skillTimer<=0){ this.enemySkill(e); e.skillTimer=Phaser.Math.Between(d.boss?900:1600,d.boss?1700:3000); }
    });
  }
  enemySkill(e){ const d=e.dataRef; if(!e.active) return;
    if(d.id==='pirata'||d.id==='cavernicola'||d.id==='mago'||d.id==='papa'||d.id==='cazador'){ this.fireEnemyShot(e, d.id==='mago'?0x6eb8ff:(d.id==='papa'?0xffffff:0xffdb68)); }
    if(d.id==='rana'||d.id==='bebe'||d.id==='cerdo'||d.id==='gladiador'){ const a=Phaser.Math.Angle.Between(e.x,e.y,this.player.x,this.player.y); e.setVelocity(Math.cos(a)*420,Math.sin(a)*420); this.cameras.main.shake(120,.004); this.makeRing(e.x,e.y,d.tint); }
    if(d.id==='gremlin' && Math.random()<.4){ this.spawnEnemy(ENEMY_DATA.find(x=>x.id==='gremlin')); }
    if(d.id==='rey'){ this.spawnEnemy(choice(ENEMY_DATA.filter(x=>!x.boss).slice(0,6))); this.makeRing(e.x,e.y,0xffd45f); }
    if(d.id==='mago'){ e.setPosition(Phaser.Math.Between(120,W-120),Phaser.Math.Between(110,H-110)); this.flashSpawn(e); }
    if(d.id==='papa'){ this.enemies.children.iterate(o=>{ if(o&&o.active&&o!==e&&dist(e,o)<240){ o.hp=Math.min(o.maxHp,o.hp+22); this.makeRing(o.x,o.y,0xffffff,.6);} }); }
    if(d.id==='titan'){ for(let i=0;i<8;i++) this.fireEnemyShot(e,0xa870ff,i*Math.PI/4); this.cameras.main.shake(250,.008); }
  }
  fireEnemyShot(e,color=0xffdb68,fixedAngle=null){ const s=this.physics.add.image(e.x,e.y,'bullet').setTint(color).setDisplaySize(18,18).setDepth(4); s.damage=e.dataRef.dmg*.72; s.birth=this.time.now; s.body.setCircle(9); const a=fixedAngle ?? Phaser.Math.Angle.Between(e.x,e.y,this.player.x,this.player.y); this.physics.velocityFromRotation(a,230,s.body.velocity); this.enemyShots.add(s); }
  makeRing(x,y,color,alpha=.25){ const r=this.add.circle(x,y,30,color,alpha).setDepth(2); this.tweens.add({targets:r,scale:3.2,alpha:0,duration:500,onComplete:()=>r.destroy()}); }
  hitEnemy(b,e){
    if(!b.active||!e.active)return; e.hp-=b.damage; this.sound.hit(); this.score+=1; this.combo++; this.makeImpact(b.x,b.y,e.dataRef.tint); e.setTint(0xffffff); this.time.delayedCall(60,()=>e.active&&e.clearTint()); if(b.pierce>0){ b.pierce--; } else b.destroy();
    if(e.hp<=0) this.killEnemy(e);
  }
  killEnemy(e){ const data=e.dataRef; this.kills++; this.score+=data.score+Math.min(80,this.combo); this.unlock(data.id); this.dropLoot(e.x,e.y,data.boss); this.bigSplatter(e.x,e.y,data.tint); if(data.boss){this.bossActive=false; this.cameras.main.flash(220,255,219,104,.25);} e.destroy(); }
  unlock(id){ if(!this.save.unlocked[id]){ this.save.unlocked[id]=true; saveGame(this.save); this.infoText.setText('Nueva ficha desbloqueada en la GondalDex.'); this.sound.pickup(); } }
  dropLoot(x,y,boss=false){ const n=boss?8:Phaser.Math.Between(0,2); for(let i=0;i<n;i++){ const p=this.pickups.create(x+Phaser.Math.Between(-25,25),y+Phaser.Math.Between(-25,25),Math.random()<.12?'heal':'coin'); p.kind=p.texture.key; p.value=p.kind==='heal'?25:(boss?30:10); p.setDisplaySize(p.kind==='heal'?20:14,p.kind==='heal'?20:14); p.body.setCircle(8); } }
  makeImpact(x,y,color){ for(let i=0;i<5;i++){ const c=this.add.circle(x,y,Phaser.Math.Between(2,6),color,.45); this.tweens.add({targets:c,x:x+Phaser.Math.Between(-30,30),y:y+Phaser.Math.Between(-30,30),alpha:0,duration:300,onComplete:()=>c.destroy()}); } }
  bigSplatter(x,y,color){ for(let i=0;i<20;i++) this.makeImpact(x+Phaser.Math.Between(-15,15),y+Phaser.Math.Between(-15,15),color); }
  playerHit(player,e){ if(this.time.now<player.invuln)return; player.invuln=this.time.now+650; this.playerStats.hp-=e.dataRef.dmg; this.combo=0; this.sound.hurt(); this.cameras.main.shake(160,.006); this.makeRing(player.x,player.y,0xff4f7a,.35); if(e.dataRef.id==='vampiro') e.hp=Math.min(e.maxHp,e.hp+20); if(this.playerStats.hp<=0)this.gameOver(false); }
  shotHitPlayer(player,s){ if(this.time.now<player.invuln)return; s.destroy(); player.invuln=this.time.now+500; this.playerStats.hp-=s.damage||10; this.combo=0; this.sound.hurt(); this.cameras.main.shake(140,.006); if(this.playerStats.hp<=0)this.gameOver(false); }
  doDash(){ const now=this.time.now; if(now-this.lastDash<this.playerStats.dashCooldown)return; this.lastDash=now; const v=this.player.body.velocity; const len=Math.hypot(v.x,v.y)||1; this.player.setVelocity((v.x/len)*760,(v.y/len)*760); this.player.invuln=now+260; this.makeRing(this.player.x,this.player.y,0x42e8ff,.35); this.sound.tone(250,.08,'sawtooth',.05); }
  updatePickups(){ this.pickups.children.iterate(p=>{ if(!p||!p.active)return; const d=dist(this.player,p); if(d<this.playerStats.magnet){ const a=Phaser.Math.Angle.Between(p.x,p.y,this.player.x,this.player.y); p.body.setVelocity(Math.cos(a)*250,Math.sin(a)*250); } }); }
  takePickup(player,p){ if(p.kind==='heal') this.playerStats.hp=Math.min(this.playerStats.maxHp,this.playerStats.hp+p.value); else this.score+=p.value; this.sound.pickup(); p.destroy(); }
  completeWave(){ this.bossActive=true; this.sound.wave(); if(this.mode==='story' && this.wave>=18) return this.gameOver(true); if(this.mode==='bossrush' && this.wave>=7) return this.gameOver(true); this.time.delayedCall(500,()=>this.showUpgradeCards()); }
  showUpgradeCards(){
    this.upgrading=true; const shade=this.add.rectangle(W/2,H/2,W,H,0x000000,.68).setDepth(90); this.add.text(W/2,115,'ELIGE MEJORA',{fontSize:'42px',fontStyle:'900',color:'#ffdb68',stroke:'#000',strokeThickness:6}).setOrigin(.5).setDepth(91);
    const options=Phaser.Utils.Array.Shuffle([...UPGRADES]).slice(0,3); options.forEach((u,i)=>{ const x=W/2+(i-1)*285; const card=this.add.rectangle(x,H/2,245,270,0x10172a,.98).setStrokeStyle(3,0x48f5a4,.75).setDepth(91).setInteractive({useHandCursor:true}); const title=this.add.text(x,H/2-75,u.title,{fontSize:'25px',fontStyle:'900',color:'#ffffff',align:'center',wordWrap:{width:205}}).setOrigin(.5).setDepth(92); const text=this.add.text(x,H/2+18,u.text,{fontSize:'20px',color:'#c7d2e3',align:'center',wordWrap:{width:205}}).setOrigin(.5).setDepth(92); const btn=this.add.text(x,H/2+95,'EQUIPAR',{fontSize:'18px',fontStyle:'900',color:'#061018',backgroundColor:'#ffdb68',padding:{x:18,y:9}}).setOrigin(.5).setDepth(92); card.on('pointerdown',()=>{u.apply(this.playerStats); this.sound.pickup(); this.children.list.filter(o=>o.depth>=90).forEach(o=>o.destroy()); this.upgrading=false; this.bossActive=false; this.time.delayedCall(500,()=>this.startWave());}); });
  }
  updateUi(){ const pct=clamp(this.playerStats.hp/this.playerStats.maxHp,0,1); this.hpBar.width=248*pct; this.hpBar.fillColor=pct>.45?0x48f5a4:(pct>.22?0xffdb68:0xff4f7a); this.scoreText.setText(`Puntos ${Math.floor(this.score)}  Combo x${this.combo}`); }
  togglePause(){ if(this.upgrading)return; this.gamePaused=!this.gamePaused; this.physics.world.isPaused=this.gamePaused; if(this.gamePaused){ this.pauseOverlay=this.add.container(W/2,H/2).setDepth(100); this.pauseOverlay.add(this.add.rectangle(0,0,430,240,0x0b1020,.96).setStrokeStyle(2,0xffdb68)); this.pauseOverlay.add(this.add.text(0,-70,'PAUSA',{fontSize:'44px',fontStyle:'900',color:'#ffdb68'}).setOrigin(.5)); const cont=this.add.text(0,10,'CONTINUAR',{fontSize:'24px',fontStyle:'900',color:'#ffffff'}).setOrigin(.5).setInteractive({useHandCursor:true}); const menu=this.add.text(0,70,'VOLVER AL MENÚ',{fontSize:'20px',fontStyle:'900',color:'#ff4f7a'}).setOrigin(.5).setInteractive({useHandCursor:true}); this.pauseOverlay.add([cont,menu]); cont.on('pointerdown',()=>this.togglePause()); menu.on('pointerdown',()=>this.scene.start('Menu')); } else { this.pauseOverlay&&this.pauseOverlay.destroy(); } }
  gameOver(win){
    this.physics.world.isPaused=true; this.save.runs=(this.save.runs||0)+1; this.save.best=Math.max(this.save.best||0,Math.floor(this.score)); saveGame(this.save);
    const shade=this.add.rectangle(W/2,H/2,W,H,0x000000,.78).setDepth(120); const panel=this.add.rectangle(W/2,H/2,620,400,0x11172a,.98).setStrokeStyle(3,win?0x48f5a4:0xff4f7a).setDepth(121); this.add.text(W/2,H/2-120,win?'BROTE CONTENIDO':'INFECTADO POR KEBAB',{fontSize:'38px',fontStyle:'900',color:win?'#48f5a4':'#ff4f7a',stroke:'#000',strokeThickness:6}).setOrigin(.5).setDepth(122); this.add.text(W/2,H/2-35,`Puntuación: ${Math.floor(this.score)}\nOleada alcanzada: ${this.wave}\nBajas: ${this.kills}`,{fontSize:'22px',color:'#ffffff',align:'center',lineSpacing:10}).setOrigin(.5).setDepth(122);
    const retry=this.add.text(W/2,H/2+90,'REINTENTAR',{fontSize:'22px',fontStyle:'900',color:'#061018',backgroundColor:'#ffdb68',padding:{x:18,y:10}}).setOrigin(.5).setInteractive({useHandCursor:true}).setDepth(123); const menu=this.add.text(W/2,H/2+150,'MENÚ PRINCIPAL',{fontSize:'18px',fontStyle:'900',color:'#ffffff'}).setOrigin(.5).setInteractive({useHandCursor:true}).setDepth(123); retry.on('pointerdown',()=>this.scene.restart({mode:this.mode})); menu.on('pointerdown',()=>this.scene.start('Menu'));
  }
}

const config={
  type:Phaser.AUTO,
  parent:'game',
  width:W,
  height:H,
  backgroundColor:'#05060a',
  scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},
  physics:{default:'arcade',arcade:{debug:false,gravity:{y:0}}},
  scene:[BootScene,MenuScene,GalleryScene,GameScene]
};

window.addEventListener('load',()=>new Phaser.Game(config));
