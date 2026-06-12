/* Gondal Evil: VR Kebab Outbreak
   Phaser 3 standalone build para GitHub Pages.
   Parodia survival-horror no oficial. */

const W = 1280;
const H = 720;
const SAVE_KEY = 'gondal_evil_save_v1';

const LEVELS = [
  { id:1, title:'La noche del Gondal', place:'Calle oscura', goal:'Encuentra a Laura y llega al punto seguro.', duration:95, spawn:1700, enemies:['basic','basic','runner'], palette:0x121927, itemCount:4, story:'Raccoon City se llenó de Gondals VR. La primera señal fue el sonido de dos mandos chocando en la oscuridad.' },
  { id:2, title:'Metro Subterráneo', place:'Entrada SUBWAY', goal:'Resiste la emboscada y activa la puerta del metro.', duration:105, spawn:1500, enemies:['basic','runner','drool'], palette:0x17151d, itemCount:5, story:'La lluvia arrastraba cables, salsa y ecos. Bajo el cartel de SUBWAY, el enjambre aprendió a correr.' },
  { id:3, title:'Pasillo R.P.D.', place:'Comisaría', goal:'Consigue la tarjeta R.P.D. y cruza el vestíbulo.', duration:115, spawn:1400, enemies:['basic','drool','tank'], palette:0x101820, itemCount:6, story:'La comisaría no estaba abandonada. Solo había cambiado de dueño: los Gondals VR patrullaban a ciegas.' },
  { id:4, title:'La barricada', place:'Oficina', goal:'Mantén cerrada la puerta hasta que Laura termine la barricada.', duration:120, spawn:1300, enemies:['basic','runner','drool'], palette:0x1a1613, itemCount:5, story:'Una puerta, una mesa vieja y demasiados mandos VR golpeando el cristal. No era un plan, pero era un plan.' },
  { id:5, title:'Escaleras rojas', place:'Salida de emergencia', goal:'Sube hasta la salida sin perder a Laura.', duration:120, spawn:1200, enemies:['runner','runner','basic','tank'], palette:0x241010, itemCount:5, story:'Las luces rojas parpadeaban. Cada escalón sonaba como una notificación de batería baja.' },
  { id:6, title:'Garaje siniestro', place:'Parking', goal:'Recoge batería, llave y combustible para arrancar el coche.', duration:135, spawn:1150, enemies:['basic','drool','tank','runner'], palette:0x151719, itemCount:7, story:'El coche estaba allí. La mala noticia: todo lo necesario para arrancarlo estaba repartido entre la niebla.' },
  { id:7, title:'Azotea final', place:'Rescate', goal:'Enciende bengalas y aguanta hasta que llegue el helicóptero.', duration:150, spawn:1050, enemies:['basic','runner','drool','tank','boss'], palette:0x101728, itemCount:8, story:'La azotea era el último plato del menú. Si el helicóptero no llegaba, el brote sería para llevar.' }
];

const ACHIEVEMENTS = [
  ['tutorial','Primer susto','Completa el tutorial.'],
  ['level1','No mires atrás','Supera el capítulo 1.'],
  ['level3','R.P.D. low cost','Supera el capítulo 3.'],
  ['story','Gondal nunca muere','Completa el modo historia.'],
  ['noPanic','Cero pánico','Termina un nivel sin que Laura entre en pánico.'],
  ['noDamage','Sin despeinarse','Termina un nivel sin recibir daño.'],
  ['flare10','Luz roja de emergencia','Usa 10 bengalas.'],
  ['kebab5','Kebab medicinal','Cúrate 5 veces con kebab.'],
  ['kills50','Batería baja','Neutraliza 50 Gondals VR.'],
  ['kills200','Batería al 100%','Neutraliza 200 Gondals VR.'],
  ['survive5','Cliente VIP','Aguanta 5 minutos en supervivencia.'],
  ['survive10','Modo pesadilla','Aguanta 10 minutos en supervivencia.'],
  ['coins300','Salsa premium','Consigue 300 KebabCoins.'],
  ['cards10','Coleccionista VR','Desbloquea 10 cromos.'],
  ['all','Gondal Edition','Consigue todos los logros.']
];

function defaultSave(){
  return { unlockedLevel:1, coins:0, bestSurvival:0, muted:false, achievements:{}, cards:{}, stats:{ kills:0, flares:0, kebabs:0, runs:0, noPanic:0, noDamage:0 } };
}
function loadSave(){ try { return Object.assign(defaultSave(), JSON.parse(localStorage.getItem(SAVE_KEY)||'{}')); } catch(e){ return defaultSave(); } }
function saveGame(){ localStorage.setItem(SAVE_KEY, JSON.stringify(SAVE)); }
let SAVE = loadSave();

function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
function dist(a,b){ return Phaser.Math.Distance.Between(a.x,a.y,b.x,b.y); }
function addText(scene,x,y,txt,size=24,color='#fff',align='left'){
  return scene.add.text(x,y,txt,{fontFamily:'system-ui, Segoe UI, sans-serif',fontSize:size+'px',fontStyle:'900',color,align,stroke:'#000',strokeThickness:5,wordWrap:{width:860}}).setResolution(2);
}
function tintFor(type){ return {basic:0xffd6c2, runner:0xff8585, drool:0xa7ffdf, tank:0xffb45e, boss:0xff2d55}[type] || 0xffffff; }
function unlock(key, scene){
  if(!SAVE.achievements[key]){
    SAVE.achievements[key]=Date.now();
    const ach = ACHIEVEMENTS.find(a=>a[0]===key);
    if(scene && ach) toast(scene, 'LOGRO: '+ach[1]);
    saveGame();
  }
}
function checkAll(scene){
  const all = ACHIEVEMENTS.filter(a=>a[0]!=='all').every(a=>SAVE.achievements[a[0]]);
  if(all) unlock('all', scene);
}
function toast(scene, msg){
  const box = scene.add.rectangle(W/2,64,720,52,0x071018,.92).setScrollFactor(0).setDepth(1000).setStrokeStyle(2,0xffd166,.9);
  const t = addText(scene,W/2,48,msg,20,'#ffd166','center').setOrigin(.5,0).setScrollFactor(0).setDepth(1001);
  scene.tweens.add({targets:[box,t], y:'-=12', alpha:0, delay:1800, duration:650, onComplete:()=>{box.destroy();t.destroy();}});
}

class BootScene extends Phaser.Scene{
  constructor(){ super('Boot'); }
  preload(){
    for(let i=1;i<=10;i++) this.load.image('story'+i, `assets/story/panel${String(i).padStart(2,'0')}.jpg`);
  }
  create(){
    this.createTextures();
    this.sound.pauseOnBlur = false;
    this.scene.start('Menu');
  }
  createTextures(){
    const g=this.add.graphics();
    const make=(key,draw,w=64,h=64)=>{ g.clear(); draw(g); g.generateTexture(key,w,h); };
    make('hero',g=>{ g.fillStyle(0x0b0e13).fillRoundedRect(18,14,28,36,10); g.fillStyle(0xe8c4a7).fillCircle(32,14,13); g.fillStyle(0x121a26).fillRect(20,28,24,24); g.lineStyle(4,0x6e7b8d).strokeLineShape(new Phaser.Geom.Line(22,28,8,45)); g.strokeLineShape(new Phaser.Geom.Line(42,28,56,45)); g.lineStyle(5,0x0a0a0a).strokeCircle(32,32,25); },64,64);
    make('laura',g=>{ g.fillStyle(0x7a563d).fillEllipse(32,16,30,26); g.fillStyle(0xf2cdb9).fillCircle(32,18,12); g.fillStyle(0xb7a696).fillRoundedRect(18,30,28,25,8); g.lineStyle(4,0x3b2b2a).strokeLineShape(new Phaser.Geom.Line(20,34,10,48)); g.strokeLineShape(new Phaser.Geom.Line(44,34,54,48)); },64,64);
    make('enemy_basic',g=>{ g.fillStyle(0xf0b58d).fillCircle(32,19,14); g.fillStyle(0x252525).fillRect(20,11,24,7); g.fillStyle(0xffffff).fillRoundedRect(15,14,34,16,8); g.fillStyle(0x161616).fillCircle(24,22,2); g.fillCircle(40,22,2); g.fillStyle(0xf0b58d).fillRoundedRect(17,33,30,24,10); g.lineStyle(4,0xf0b58d).strokeLineShape(new Phaser.Geom.Line(18,36,7,45)); g.strokeLineShape(new Phaser.Geom.Line(46,36,57,45)); },64,64);
    make('enemy_runner',g=>{ g.fillStyle(0xffad99).fillCircle(32,19,13); g.fillStyle(0xffffff).fillRoundedRect(15,14,34,16,8); g.fillStyle(0x3b3b3b).fillRoundedRect(18,33,28,20,8); g.lineStyle(5,0xffad99).strokeLineShape(new Phaser.Geom.Line(18,37,5,55)); g.strokeLineShape(new Phaser.Geom.Line(46,37,59,51)); },64,64);
    make('enemy_drool',g=>{ g.fillStyle(0xffcfaa).fillCircle(32,18,13); g.fillStyle(0xffffff).fillRoundedRect(15,14,34,16,8); g.fillStyle(0x83ffd8).fillCircle(32,34,4); g.fillStyle(0xffcfaa).fillRoundedRect(17,34,30,22,10); },64,64);
    make('enemy_tank',g=>{ g.fillStyle(0xffbd87).fillCircle(40,22,17); g.fillStyle(0xffffff).fillRoundedRect(18,17,44,20,10); g.fillStyle(0xffbd87).fillRoundedRect(14,40,52,34,16); g.lineStyle(7,0xffbd87).strokeLineShape(new Phaser.Geom.Line(18,44,0,55)); g.strokeLineShape(new Phaser.Geom.Line(62,44,80,55)); },84,84);
    make('enemy_boss',g=>{ g.fillStyle(0xff9d76).fillCircle(54,28,24); g.fillStyle(0xffffff).fillRoundedRect(25,20,58,26,12); g.fillStyle(0xff9d76).fillRoundedRect(18,58,72,54,22); g.lineStyle(10,0xff9d76).strokeCircle(54,72,42); g.lineStyle(8,0xffffff).strokeCircle(18,74,12); g.strokeCircle(92,74,12); },108,128);
    make('bullet',g=>{ g.fillStyle(0xfff2a6).fillCircle(8,8,6); },16,16);
    make('kebab',g=>{ g.fillStyle(0xc16b22).fillCircle(18,18,15); g.fillStyle(0xffd18a).fillCircle(24,12,4); g.fillStyle(0x8d4315).fillCircle(12,22,5); },36,36);
    make('salsa',g=>{ g.fillStyle(0xffffff).fillRoundedRect(8,8,22,28,6); g.fillStyle(0xff5555).fillRect(11,10,16,6); },40,44);
    make('flare',g=>{ g.fillStyle(0xff2e2e).fillRoundedRect(12,6,14,30,5); g.fillStyle(0xfff2aa).fillCircle(19,4,7); },40,44);
    make('key',g=>{ g.lineStyle(6,0xffd166).strokeCircle(14,18,8); g.strokeLineShape(new Phaser.Geom.Line(22,18,38,18)); g.strokeLineShape(new Phaser.Geom.Line(32,18,32,26)); },44,44);
    make('battery',g=>{ g.fillStyle(0x9efcff).fillRoundedRect(8,12,28,20,4); g.fillStyle(0xdfffff).fillRect(36,18,5,8); g.fillStyle(0x0b2024).fillRect(13,17,18,10); },48,44);
    make('exit',g=>{ g.fillStyle(0x35ff90,.8).fillRoundedRect(0,0,70,42,8); g.fillStyle(0x061018).fillTriangle(22,9,22,33,50,21); },70,42);
    make('crate',g=>{ g.fillStyle(0x5b4029).fillRect(0,0,72,72); g.lineStyle(4,0x9a7048).strokeRect(5,5,62,62); g.strokeLineShape(new Phaser.Geom.Line(5,5,67,67)); g.strokeLineShape(new Phaser.Geom.Line(67,5,5,67)); },72,72);
    make('spark',g=>{ g.fillStyle(0xffd166).fillCircle(4,4,4); },8,8);
  }
}

class BaseScene extends Phaser.Scene{
  button(x,y,w,h,label,cb,accent=0xffd166){
    const c=this.add.container(x,y).setDepth(50);
    const r=this.add.rectangle(0,0,w,h,0x101828,.92).setStrokeStyle(2,accent,.9);
    const t=addText(this,0,-14,label,24,'#ffffff','center').setOrigin(.5,0);
    c.add([r,t]); c.setSize(w,h); c.setInteractive({useHandCursor:true});
    c.on('pointerover',()=>r.setFillStyle(0x1d2a40,.98)); c.on('pointerout',()=>r.setFillStyle(0x101828,.92));
    c.on('pointerdown',()=>{ this.click(); cb(); });
    return c;
  }
  click(){ if(SAVE.muted) return; try{ this.sound.play(''); }catch(e){} }
  bg(){
    this.add.rectangle(W/2,H/2,W,H,0x070a12);
    for(let i=0;i<80;i++){ const x=Phaser.Math.Between(0,W), y=Phaser.Math.Between(0,H); this.add.circle(x,y,Phaser.Math.FloatBetween(.6,2.2),0x8ecaff,Phaser.Math.FloatBetween(.08,.25)); }
    this.add.rectangle(W/2,H-70,W,150,0x000000,.28);
  }
}

class MenuScene extends BaseScene{
  constructor(){ super('Menu'); }
  create(){
    this.bg();
    this.add.rectangle(W/2,H/2,980,560,0x071018,.58).setStrokeStyle(2,0x3ee8ff,.35);
    addText(this,W/2,72,'GONDAL EVIL',68,'#ffd166','center').setOrigin(.5,0);
    addText(this,W/2,144,'VR Kebab Outbreak',34,'#8efcff','center').setOrigin(.5,0);
    addText(this,W/2,196,'Survival horror paródico no oficial · Phaser 3 · móvil y ordenador',20,'#d8e7ff','center').setOrigin(.5,0);
    const progress = `Capítulo desbloqueado: ${SAVE.unlockedLevel}/7    KebabCoins: ${SAVE.coins}    Récord supervivencia: ${Math.floor(SAVE.bestSurvival)}s`;
    addText(this,W/2,238,progress,18,'#cde3ff','center').setOrigin(.5,0);
    this.button(W/2,318,360,58,'MODO HISTORIA',()=>this.scene.start('LevelSelect'));
    this.button(W/2,392,360,58,'SUPERVIVENCIA',()=>this.scene.start('Game',{survival:true, levelId:1}),0xff4d6d);
    this.button(W/2,466,360,58,'LOGROS Y COLECCIÓN',()=>this.scene.start('Achievements'),0x7cffaa);
    this.button(W/2,540,360,58,'OPCIONES / CRÉDITOS',()=>this.scene.start('Credits'),0x9b7cff);
    addText(this,W/2,H-64,'Consejo: en móvil usa joystick y botones; en ordenador WASD/flechas + ratón.',18,'#95a4bb','center').setOrigin(.5,0);
  }
}

class LevelSelectScene extends BaseScene{
  constructor(){ super('LevelSelect'); }
  create(){
    this.bg();
    addText(this,64,36,'Selecciona capítulo',42,'#ffd166');
    this.button(1138,58,200,48,'VOLVER',()=>this.scene.start('Menu'),0xffffff);
    const startX=116, startY=126, gapX=248, gapY=174;
    LEVELS.forEach((l,idx)=>{
      const x=startX+(idx%4)*gapX, y=startY+Math.floor(idx/4)*gapY;
      const locked=l.id>SAVE.unlockedLevel;
      const cont=this.add.container(x,y);
      const bg=this.add.rectangle(0,0,216,136,locked?0x111111:0x101828,.94).setStrokeStyle(2,locked?0x555555:0xffd166,.65);
      cont.add(bg);
      cont.add(addText(this,-92,-54,`${l.id}. ${l.title}`,20,locked?'#777':'#fff').setOrigin(0,0));
      cont.add(addText(this,-92,-20,l.place,15,locked?'#666':'#8efcff').setOrigin(0,0));
      cont.add(addText(this,-92,10,locked?'Bloqueado':l.goal,14,locked?'#666':'#cde3ff').setOrigin(0,0));
      cont.setSize(216,136).setInteractive({useHandCursor:!locked});
      if(!locked) cont.on('pointerdown',()=>this.scene.start('Story',{levelId:l.id}));
    });
    this.button(W/2,H-74,420,56,'TUTORIAL JUGABLE',()=>this.scene.start('Game',{tutorial:true, levelId:1}),0x7cffaa);
  }
}

class StoryScene extends BaseScene{
  constructor(){ super('Story'); }
  init(data){ this.levelId=data.levelId||1; }
  create(){
    const l=LEVELS[this.levelId-1];
    this.add.rectangle(W/2,H/2,W,H,0x06070b);
    const imgKey='story'+Math.min(this.levelId,10);
    const img=this.add.image(W/2,H/2,imgKey).setDisplaySize(420,630).setAlpha(.88);
    this.add.rectangle(W/2,H/2,470,680,0x000000,.25).setStrokeStyle(2,0xffd166,.5);
    addText(this,68,54,`Capítulo ${l.id}`,30,'#ffd166');
    addText(this,68,92,l.title,48,'#ffffff');
    addText(this,68,166,l.story,21,'#cde3ff');
    addText(this,68,268,'Objetivo:',22,'#8efcff');
    addText(this,68,302,l.goal,24,'#ffffff');
    this.button(180,H-78,260,56,'VOLVER',()=>this.scene.start('LevelSelect'),0xffffff);
    this.button(W-220,H-78,310,56,'COMENZAR',()=>this.scene.start('Game',{levelId:this.levelId}),0xffd166);
  }
}

class GameScene extends Phaser.Scene{
  constructor(){ super('Game'); }
  init(data){ this.levelId=data.levelId||1; this.survival=!!data.survival; this.tutorial=!!data.tutorial; }
  create(){
    this.level = LEVELS[this.levelId-1];
    this.worldW = this.survival ? 2400 : 2200; this.worldH = this.survival ? 1500 : 1400;
    this.cameras.main.setBounds(0,0,this.worldW,this.worldH);
    this.physics.world.setBounds(0,0,this.worldW,this.worldH);
    this.runStats={kills:0,damage:false,panic:false,items:0,start:this.time.now};
    this.spawnTimer=0; this.itemTimer=0; this.flareActive=0; this.gameOver=false; this.finished=false;
    this.createWorld();
    this.createActors();
    this.createUI();
    this.createControls();
    this.cameras.main.startFollow(this.hero,true,.08,.08);
    this.physics.add.overlap(this.bullets,this.enemies,this.hitEnemy,null,this);
    this.physics.add.overlap(this.hero,this.enemies,this.touchHero,null,this);
    this.physics.add.overlap(this.laura,this.enemies,this.scareLaura,null,this);
    this.physics.add.overlap(this.hero,this.items,this.pickItem,null,this);
    this.physics.add.overlap(this.hero,this.exit,this.tryExit,null,this);
    if(this.tutorial) toast(this,'Tutorial: mueve, apunta, recoge kebabs y protege a Laura.');
  }
  createWorld(){
    this.add.rectangle(this.worldW/2,this.worldH/2,this.worldW,this.worldH,this.level.palette||0x101820);
    const grid=this.add.graphics(); grid.lineStyle(1,0xffffff,.035);
    for(let x=0;x<this.worldW;x+=96) grid.lineBetween(x,0,x,this.worldH);
    for(let y=0;y<this.worldH;y+=96) grid.lineBetween(0,y,this.worldW,y);
    this.obstacles=this.physics.add.staticGroup();
    for(let i=0;i<36;i++){
      const x=Phaser.Math.Between(160,this.worldW-160), y=Phaser.Math.Between(160,this.worldH-160);
      const c=this.obstacles.create(x,y,'crate').setScale(Phaser.Math.FloatBetween(.8,1.5)).refreshBody();
      c.setTint(Phaser.Display.Color.GetColor(55+Math.random()*45,45+Math.random()*35,35+Math.random()*25));
    }
    this.add.rectangle(this.worldW/2,40,this.worldW,80,0x000000,.25);
    this.add.text(32,18,this.survival?'PLAZA DEL KEBAB · SUPERVIVENCIA':this.level.place.toUpperCase(),{fontSize:'22px',fontStyle:'900',color:'#7cffaa'});
    this.exit=this.physics.add.staticSprite(this.worldW-150,this.worldH-120,'exit').setDepth(3);
    this.exit.body.setSize(120,80); this.exit.setVisible(!this.survival);
    this.items=this.physics.add.group();
    const baseItems = this.survival ? 10 : this.level.itemCount;
    for(let i=0;i<baseItems;i++) this.spawnItem();
    if(!this.survival && this.levelId>=3){ ['key','battery'].forEach((kind,idx)=>this.spawnItem(kind, 320+idx*180, this.worldH-260)); }
  }
  createActors(){
    this.hero=this.physics.add.sprite(160,160,'hero').setDepth(10); this.hero.setCollideWorldBounds(true); this.hero.speed=235; this.hero.hp=100; this.hero.ammo=48; this.hero.kebabs=1; this.hero.flares=1;
    this.laura=this.physics.add.sprite(this.survival?260:360, this.survival?220:250,'laura').setDepth(9); this.laura.setCollideWorldBounds(true); this.laura.calm=100; this.laura.rescued=this.survival || this.tutorial;
    if(!this.laura.rescued){ this.laura.x=this.worldW-300; this.laura.y=260; }
    this.enemies=this.physics.add.group(); this.bullets=this.physics.add.group({maxSize:70});
    this.physics.add.collider(this.hero,this.obstacles); this.physics.add.collider(this.laura,this.obstacles); this.physics.add.collider(this.enemies,this.obstacles);
    for(let i=0;i<(this.survival?8:5);i++) this.spawnEnemy();
  }
  createUI(){
    this.hud=this.add.container(0,0).setScrollFactor(0).setDepth(100);
    this.hudBg=this.add.rectangle(0,0,W,86,0x02050a,.72).setOrigin(0,0);
    this.txt=addText(this,22,14,'',18,'#fff');
    this.obj=addText(this,W/2,14,'',18,'#ffd166','center').setOrigin(.5,0);
    this.hud.add([this.hudBg,this.txt,this.obj]);
    this.pauseBtn=this.add.text(W-108,18,'PAUSA',{fontSize:'20px',fontStyle:'900',color:'#ffffff',backgroundColor:'#1b2638',padding:{x:14,y:8}}).setScrollFactor(0).setDepth(101).setInteractive({useHandCursor:true});
    this.pauseBtn.on('pointerdown',()=>this.togglePause());
    this.mobile=this.add.container(0,0).setScrollFactor(0).setDepth(101);
    if(this.sys.game.device.input.touch){
      this.joyBase=this.add.circle(108,H-116,62,0xffffff,.12).setStrokeStyle(2,0xffffff,.28);
      this.joyKnob=this.add.circle(108,H-116,28,0x8efcff,.35);
      this.btnFire=this.add.circle(W-100,H-112,54,0xffd166,.24).setStrokeStyle(2,0xffd166,.7);
      this.btnDodge=this.add.circle(W-220,H-84,42,0x8efcff,.18).setStrokeStyle(2,0x8efcff,.55);
      this.btnUse=this.add.circle(W-310,H-142,42,0x7cffaa,.18).setStrokeStyle(2,0x7cffaa,.55);
      this.mobile.add([this.joyBase,this.joyKnob,this.btnFire,this.btnDodge,this.btnUse]);
      [['FUEGO',this.btnFire],['ESQ',this.btnDodge],['USAR',this.btnUse]].forEach(([s,b])=>this.mobile.add(addText(this,b.x,b.y-10,s,14,'#fff','center').setOrigin(.5,0)));
    }
    this.notice=addText(this,W/2,H-46,'',18,'#cde3ff','center').setScrollFactor(0).setDepth(100).setOrigin(.5,0);
  }
  createControls(){
    this.keys=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SPACE,E,ESC,Q');
    this.input.keyboard.on('keydown-ESC',()=>this.togglePause());
    this.pointer=this.input.activePointer; this.joy={x:0,y:0,active:false}; this.fireHeld=false;
    if(this.sys.game.device.input.touch){
      this.input.on('pointerdown',p=>{
        if(p.x<260 && p.y>H-260){this.joy.active=true; this.updateJoy(p);}
        if(Phaser.Math.Distance.Between(p.x,p.y,W-100,H-112)<70) this.fireHeld=true;
        if(Phaser.Math.Distance.Between(p.x,p.y,W-220,H-84)<55) this.dodge();
        if(Phaser.Math.Distance.Between(p.x,p.y,W-310,H-142)<55) this.useItem();
      });
      this.input.on('pointermove',p=>{ if(this.joy.active) this.updateJoy(p); });
      this.input.on('pointerup',p=>{ this.joy.active=false; this.joy.x=this.joy.y=0; if(this.joyKnob) this.joyKnob.setPosition(108,H-116); this.fireHeld=false; });
    }
    this.input.on('pointerdown',p=>{ if(!this.sys.game.device.input.touch || p.y < H-220) this.shootAtPointer(); });
  }
  updateJoy(p){ const dx=p.x-108, dy=p.y-(H-116), len=Math.max(1,Math.hypot(dx,dy)), max=62; this.joy.x=clamp(dx/max,-1,1); this.joy.y=clamp(dy/max,-1,1); this.joyKnob.setPosition(108+dx/len*Math.min(max,len), H-116+dy/len*Math.min(max,len)); }
  spawnItem(kind,x,y){
    kind = kind || Phaser.Math.RND.pick(['kebab','salsa','flare','battery']);
    const key = kind==='kebab'?'kebab':kind==='salsa'?'salsa':kind==='flare'?'flare':kind==='key'?'key':'battery';
    const it=this.items.create(x||Phaser.Math.Between(140,this.worldW-160), y||Phaser.Math.Between(140,this.worldH-160), key).setDepth(4); it.kind=kind; it.setCircle(20); return it;
  }
  spawnEnemy(forcedType){
    const type = forcedType || (this.survival ? Phaser.Math.RND.pick(['basic','runner','drool','tank']) : Phaser.Math.RND.pick(this.level.enemies));
    const tex = type==='tank'?'enemy_tank':type==='boss'?'enemy_boss':'enemy_'+type;
    const edge=Phaser.Math.Between(0,3); let x,y;
    if(edge===0){x=Phaser.Math.Between(0,this.worldW);y=0;} if(edge===1){x=this.worldW;y=Phaser.Math.Between(0,this.worldH);} if(edge===2){x=Phaser.Math.Between(0,this.worldW);y=this.worldH;} if(edge===3){x=0;y=Phaser.Math.Between(0,this.worldH);}
    const e=this.enemies.create(x,y,tex).setDepth(8).setTint(tintFor(type)); e.type=type; e.hp={basic:2,runner:1,drool:2,tank:6,boss:24}[type]||2; e.speed={basic:72,runner:118,drool:60,tank:48,boss:42}[type]||70; e.damage={basic:8,runner:7,drool:6,tank:14,boss:20}[type]||8; e.cool=0; e.setCollideWorldBounds(true); return e;
  }
  update(time,dt){
    if(this.gameOver||this.finished||this.paused) return;
    const d=dt/1000;
    this.updatePlayer(d); this.updateLaura(d); this.updateEnemies(d); this.updateBullets(); this.updateSpawns(time); this.updateHUD(); this.updateObjective(time);
  }
  updatePlayer(d){
    let vx=0,vy=0; const k=this.keys;
    if(k.A.isDown||k.LEFT.isDown) vx--; if(k.D.isDown||k.RIGHT.isDown) vx++; if(k.W.isDown||k.UP.isDown) vy--; if(k.S.isDown||k.DOWN.isDown) vy++;
    if(this.joy.active){ vx+=this.joy.x; vy+=this.joy.y; }
    const len=Math.hypot(vx,vy)||1; this.hero.setVelocity(vx/len*this.hero.speed, vy/len*this.hero.speed);
    if(Phaser.Input.Keyboard.JustDown(k.SPACE)) this.dodge();
    if(Phaser.Input.Keyboard.JustDown(k.E)) this.useItem();
    if(Phaser.Input.Keyboard.JustDown(k.Q)) this.useFlare();
    this.fireCooldown=(this.fireCooldown||0)-d;
    if(this.fireHeld && this.fireCooldown<=0) this.autoShoot();
  }
  updateLaura(d){
    if(!this.laura.rescued){
      if(dist(this.hero,this.laura)<95){ this.laura.rescued=true; toast(this,'Laura rescatada. No la pierdas.'); }
      return;
    }
    const target=this.hero; const dd=dist(this.laura,target);
    if(dd>95){ const a=Phaser.Math.Angle.Between(this.laura.x,this.laura.y,target.x,target.y); this.laura.setVelocity(Math.cos(a)*180,Math.sin(a)*180); } else this.laura.setVelocity(0,0);
    this.laura.calm=clamp(this.laura.calm + 7*d,0,100);
  }
  updateEnemies(d){
    this.enemies.children.iterate(e=>{
      if(!e||!e.active) return;
      e.cool-=d;
      const target = this.laura.rescued && dist(e,this.laura)<dist(e,this.hero)+80 ? this.laura : this.hero;
      const a=Phaser.Math.Angle.Between(e.x,e.y,target.x,target.y); let sp=e.speed;
      if(this.flareActive>0 && dist(e,this.hero)<420){ sp*=.25; }
      e.setVelocity(Math.cos(a)*sp, Math.sin(a)*sp); e.rotation=a+Math.PI/2;
    });
    this.flareActive=Math.max(0,this.flareActive-d);
  }
  updateBullets(){
    this.bullets.children.iterate(b=>{ if(b && b.active && (b.x<0||b.y<0||b.x>this.worldW||b.y>this.worldH)) b.destroy(); });
  }
  updateSpawns(time){
    const rate=this.survival ? Math.max(520,1450-Math.floor((time-this.runStats.start)/1000)*12) : this.level.spawn;
    if(time>this.spawnTimer){ this.spawnTimer=time+rate; this.spawnEnemy(); if(this.levelId===7 && Math.random()<.22) this.spawnEnemy('boss'); }
    if(time>this.itemTimer){ this.itemTimer=time+Phaser.Math.Between(9000,15000); this.spawnItem(); }
  }
  updateHUD(){
    const seconds=Math.floor((this.time.now-this.runStats.start)/1000);
    this.txt.setText(`VIDA ${Math.ceil(this.hero.hp)}  ·  CALMA ${Math.ceil(this.laura.calm)}  ·  BALAS ${this.hero.ammo}  ·  KEBABS ${this.hero.kebabs}  ·  BENGALAS ${this.hero.flares}`);
    if(this.survival) this.obj.setText(`Supervivencia: ${seconds}s · Neutralizados: ${this.runStats.kills}`);
    else this.obj.setText(`Cap. ${this.levelId}: ${this.level.goal}`);
    if(this.notice) this.notice.setText(this.laura.rescued?'Laura te sigue. Pulsa E/USAR para curarte, Q para bengala.':'Encuentra a Laura.');
  }
  updateObjective(time){
    const elapsed=(time-this.runStats.start)/1000;
    if(this.survival){ if(this.hero.hp<=0) this.finish(false); return; }
    if(this.tutorial && elapsed>45){ unlock('tutorial',this); this.finish(true); return; }
    if(this.levelId===4){ if(elapsed>this.level.duration && this.laura.rescued) this.finish(true); }
    if(this.levelId===6 && this.runStats.items>=3 && dist(this.hero,this.exit)<120 && this.laura.rescued) this.finish(true);
    if(this.levelId===7 && elapsed>this.level.duration && this.laura.rescued) this.finish(true);
    if(this.hero.hp<=0 || this.laura.calm<=0){ if(this.laura.calm<=0){ this.runStats.panic=true; this.laura.calm=36; toast(this,'¡PÁNICO! Quédate cerca de Laura.'); } else this.finish(false); }
  }
  shootAtPointer(){
    if(this.fireCooldown>0) return; const p=this.input.activePointer; const world=this.cameras.main.getWorldPoint(p.x,p.y); this.shootAt(world.x,world.y);
  }
  autoShoot(){
    let nearest=null, nd=9999; this.enemies.children.iterate(e=>{ if(e&&e.active){ const dd=dist(this.hero,e); if(dd<nd){nd=dd; nearest=e;} } });
    if(nearest) this.shootAt(nearest.x,nearest.y);
  }
  shootAt(x,y){
    if(this.hero.ammo<=0){ toast(this,'Sin munición: busca baterías VR.'); this.fireCooldown=.45; return; }
    this.hero.ammo--; this.fireCooldown=.18;
    const b=this.bullets.get(this.hero.x,this.hero.y,'bullet'); if(!b) return; b.setActive(true).setVisible(true).setDepth(11); b.body.enable=true; b.setCircle(8);
    const a=Phaser.Math.Angle.Between(this.hero.x,this.hero.y,x,y); b.setVelocity(Math.cos(a)*720,Math.sin(a)*720); b.life=1.1;
    this.add.circle(this.hero.x+Math.cos(a)*34,this.hero.y+Math.sin(a)*34,10,0xfff2a6,.55).setDepth(12).destroySoon;
  }
  dodge(){ const v=this.hero.body.velocity; const len=Math.hypot(v.x,v.y)||1; this.hero.setVelocity(v.x/len*560, v.y/len*560); this.hero.setTint(0x8efcff); this.time.delayedCall(160,()=>this.hero.clearTint()); }
  useItem(){
    if(this.hero.kebabs>0 && this.hero.hp<100){ this.hero.kebabs--; this.hero.hp=clamp(this.hero.hp+34,0,100); SAVE.stats.kebabs++; SAVE.stats.kebabs>=5&&unlock('kebab5',this); saveGame(); toast(this,'Kebab curativo usado.'); }
    else if(this.laura.rescued && dist(this.hero,this.laura)<130){ this.laura.calm=100; toast(this,'Laura se tranquiliza.'); }
    else toast(this,'Nada que usar ahora.');
  }
  useFlare(){
    if(this.hero.flares<=0) return; this.hero.flares--; this.flareActive=5.5; SAVE.stats.flares++; if(SAVE.stats.flares>=10) unlock('flare10',this); saveGame();
    this.cameras.main.flash(160,255,80,80); toast(this,'Bengala: los Gondals se quedan empanados.');
  }
  hitEnemy(b,e){
    if(!b.active||!e.active) return; b.destroy(); e.hp--; e.setTint(0xffffff); this.time.delayedCall(75,()=>{ if(e.active) e.setTint(tintFor(e.type)); });
    e.setVelocity(e.body.velocity.x*-0.35,e.body.velocity.y*-0.35);
    if(e.hp<=0){ this.killEnemy(e); }
  }
  killEnemy(e){
    for(let i=0;i<8;i++) this.add.circle(e.x+Phaser.Math.Between(-18,18),e.y+Phaser.Math.Between(-18,18),Phaser.Math.Between(2,5),0xffd166,.85).setDepth(20);
    e.destroy(); this.runStats.kills++; SAVE.stats.kills++; SAVE.coins+=2; if(Math.random()<.18) this.spawnItem(null,this.hero.x+Phaser.Math.Between(-120,120),this.hero.y+Phaser.Math.Between(-120,120));
    if(SAVE.stats.kills>=50) unlock('kills50',this); if(SAVE.stats.kills>=200) unlock('kills200',this); if(SAVE.coins>=300) unlock('coins300',this); saveGame();
  }
  touchHero(hero,e){
    if(e.cool>0) return; e.cool=.85; hero.hp-=e.damage; this.runStats.damage=true; this.cameras.main.shake(120,.006); hero.setTint(0xff7777); this.time.delayedCall(120,()=>hero.clearTint());
  }
  scareLaura(laura,e){
    if(e.cool>0) return; e.cool=.75; laura.calm-=e.damage*1.4; this.runStats.panic=true; laura.setTint(0xffaaaa); this.time.delayedCall(120,()=>laura.clearTint());
  }
  pickItem(hero,it){
    const k=it.kind; it.destroy(); this.runStats.items++;
    if(k==='kebab') { hero.kebabs++; toast(this,'Kebab curativo +1'); }
    else if(k==='salsa') { this.flareActive=3.5; toast(this,'Salsa blanca: enemigos ralentizados.'); }
    else if(k==='flare') { hero.flares++; toast(this,'Bengala +1'); }
    else if(k==='battery') { hero.ammo+=18; toast(this,'Batería VR: munición +18'); }
    else if(k==='key') { toast(this,'Tarjeta / llave conseguida.'); }
  }
  tryExit(){ if(this.survival) return; if(!this.laura.rescued){ toast(this,'No puedes irte sin Laura.'); return; } if(this.levelId<4 || this.runStats.items>=2 || this.levelId===5) this.finish(true); else toast(this,'Aún faltan recursos.'); }
  finish(win){
    this.finished=true; this.physics.pause();
    const elapsed=Math.floor((this.time.now-this.runStats.start)/1000);
    if(this.survival){
      SAVE.bestSurvival=Math.max(SAVE.bestSurvival,elapsed); SAVE.stats.runs++; if(elapsed>=300) unlock('survive5',this); if(elapsed>=600) unlock('survive10',this); saveGame();
    } else if(win){
      SAVE.unlockedLevel=Math.max(SAVE.unlockedLevel,this.levelId+1); SAVE.cards['cap'+this.levelId]=true; if(this.levelId===1) unlock('level1',this); if(this.levelId===3) unlock('level3',this); if(this.levelId===7) unlock('story',this); if(!this.runStats.panic) unlock('noPanic',this); if(!this.runStats.damage) unlock('noDamage',this); const cards=Object.keys(SAVE.cards).length; if(cards>=10) unlock('cards10',this); saveGame();
    }
    checkAll(this);
    const overlay=this.add.rectangle(W/2,H/2,780,420,0x03070d,.92).setScrollFactor(0).setDepth(300).setStrokeStyle(3,win?0x7cffaa:0xff4d6d,.95);
    addText(this,W/2,H/2-150, win?'MISIÓN COMPLETADA':'FIN DE LA PARTIDA',42,win?'#7cffaa':'#ff7890','center').setOrigin(.5,0).setScrollFactor(0).setDepth(301);
    addText(this,W/2,H/2-80,`Tiempo: ${elapsed}s · Neutralizados: ${this.runStats.kills} · KebabCoins: ${SAVE.coins}`,22,'#fff','center').setOrigin(.5,0).setScrollFactor(0).setDepth(301);
    const b1=this.add.text(W/2-190,H/2+70,'REINTENTAR',{fontSize:'24px',fontStyle:'900',color:'#061018',backgroundColor:'#ffd166',padding:{x:28,y:14}}).setOrigin(.5).setScrollFactor(0).setDepth(302).setInteractive({useHandCursor:true});
    const b2=this.add.text(W/2+190,H/2+70,'MENÚ',{fontSize:'24px',fontStyle:'900',color:'#061018',backgroundColor:'#8efcff',padding:{x:48,y:14}}).setOrigin(.5).setScrollFactor(0).setDepth(302).setInteractive({useHandCursor:true});
    b1.on('pointerdown',()=>this.scene.restart({levelId:this.levelId,survival:this.survival,tutorial:this.tutorial})); b2.on('pointerdown',()=>this.scene.start('Menu'));
  }
  togglePause(){
    if(this.finished||this.gameOver) return;
    if(this.paused){ this.paused=false; this.physics.resume(); this.pauseLayer.destroy(); return; }
    this.paused=true; this.physics.pause();
    this.pauseLayer=this.add.container(0,0).setScrollFactor(0).setDepth(250);
    this.pauseLayer.add(this.add.rectangle(W/2,H/2,600,320,0x02060d,.92).setStrokeStyle(2,0xffd166));
    this.pauseLayer.add(addText(this,W/2,H/2-120,'PAUSA',42,'#ffd166','center').setOrigin(.5,0));
    const cont=this.add.text(W/2,H/2-20,'CONTINUAR',{fontSize:'24px',fontStyle:'900',color:'#061018',backgroundColor:'#7cffaa',padding:{x:38,y:14}}).setOrigin(.5).setInteractive({useHandCursor:true});
    const menu=this.add.text(W/2,H/2+70,'SALIR AL MENÚ',{fontSize:'24px',fontStyle:'900',color:'#061018',backgroundColor:'#8efcff',padding:{x:38,y:14}}).setOrigin(.5).setInteractive({useHandCursor:true});
    cont.on('pointerdown',()=>this.togglePause()); menu.on('pointerdown',()=>this.scene.start('Menu'));
    this.pauseLayer.add([cont,menu]);
  }
}

class AchievementsScene extends BaseScene{
  constructor(){ super('Achievements'); }
  create(){
    this.bg(); addText(this,60,36,'Logros y colección',42,'#ffd166'); this.button(1138,58,200,48,'VOLVER',()=>this.scene.start('Menu'));
    const done=ACHIEVEMENTS.filter(a=>SAVE.achievements[a[0]]).length;
    addText(this,60,88,`Progreso: ${done}/${ACHIEVEMENTS.length} · KebabCoins: ${SAVE.coins} · Cromos: ${Object.keys(SAVE.cards).length}`,20,'#cde3ff');
    const startY=140;
    ACHIEVEMENTS.forEach((a,i)=>{
      const col=i%3,row=Math.floor(i/3); const x=70+col*400, y=startY+row*92;
      const ok=!!SAVE.achievements[a[0]];
      this.add.rectangle(x,y,360,72,ok?0x11351f:0x101828,.9).setOrigin(0,0).setStrokeStyle(2,ok?0x7cffaa:0x4b5b72,.6);
      addText(this,x+18,y+10,(ok?'✓ ':'□ ')+a[1],18,ok?'#7cffaa':'#ffffff');
      addText(this,x+18,y+38,a[2],14,'#b9c5d6');
    });
    const cards = Object.keys(SAVE.cards).sort();
    addText(this,60,H-98,'Colección: '+(cards.length?cards.join(' · '):'Completa capítulos para desbloquear cromos.'),18,'#8efcff');
  }
}

class CreditsScene extends BaseScene{
  constructor(){ super('Credits'); }
  create(){
    this.bg(); addText(this,60,42,'Opciones / Créditos',42,'#ffd166');
    this.button(1138,58,200,48,'VOLVER',()=>this.scene.start('Menu'));
    const muteText=()=>SAVE.muted?'SONIDO: OFF':'SONIDO: ON';
    const b=this.button(260,170,340,58,muteText(),()=>{SAVE.muted=!SAVE.muted;saveGame();b.list[1].setText(muteText());},0x8efcff);
    this.button(260,250,340,58,'BORRAR PROGRESO',()=>{localStorage.removeItem(SAVE_KEY);SAVE=defaultSave();this.scene.restart();},0xff4d6d);
    addText(this,60,350,'Gondal Evil: VR Kebab Outbreak',32,'#fff');
    addText(this,60,400,'Juego paródico no oficial creado para la Biblioteca Gamer de clase.\nPhaser 3 · responsive móvil/PC · progreso en localStorage.\nControles PC: WASD/flechas, ratón, clic, espacio, E y Q.\nControles móvil: joystick virtual, FUEGO, ESQ y USAR.',21,'#cde3ff');
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: W,
  height: H,
  backgroundColor: '#05060a',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default:'arcade', arcade:{ debug:false, gravity:{y:0} } },
  scene: [BootScene, MenuScene, LevelSelectScene, StoryScene, GameScene, AchievementsScene, CreditsScene]
};
new Phaser.Game(config);
