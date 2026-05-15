
import { UPGRADES } from './data/upgrades.js';
import { POWER_UPS } from './data/powerUps.js';
import { ORBS } from './data/orbs.js';
import { ROOMS } from './data/rooms.js';
import { BOSSES } from './data/bosses.js';
import { INFINITE_EVENTS } from './data/infiniteEvents.js';
import { COLLECTIBLES } from './data/collectibles.js';
import { LOOT_BOXES } from './data/lootBoxes.js';
import { ACHIEVEMENTS } from './data/achievements.js';
import { ECONOMY } from './data/economy.js';

const app = document.getElementById('app');
const SAVE_KEY = ECONOMY.saveKey || 'snakademy_save_v1';
const W = 1280, H = 720;
const BOARD = { x: 20, y: 54, cols: 28, rows: 18, cell: 32, w: 896, h: 576 };
const DIRS = { right:{x:1,y:0}, left:{x:-1,y:0}, up:{x:0,y:-1}, down:{x:0,y:1} };
const LEFT_TURN = { right:'up', up:'left', left:'down', down:'right' };
const RIGHT_TURN = { right:'down', down:'left', left:'up', up:'right' };
const OPPOSITE = { right:'left', left:'right', up:'down', down:'up' };
const DIFF = {
  relax: { label:'Relax', shields:2, speed:150, mult:.8, obstacleRate:.55, trapRate:.35 },
  normal: { label:'Normal', shields:1, speed:125, mult:1, obstacleRate:1, trapRate:1 },
  expert: { label:'Experto', shields:0, speed:102, mult:1.35, obstacleRate:1.35, trapRate:1.45 }
};
const RARITY = { common:'Común', rare:'Raro', epic:'Épico', legendary:'Legendario' };
const TYPE_LABEL = { skin:'Skins', head:'Cabezas', trail:'Rastros', pet:'Mascotas', background:'Fondos', badge:'Insignias', achievements:'Logros' };
const state = load();
let screenName = 'main';
let audioCtx = null;
let game = null;
let selectedMode = 'roguelike';
let selectedDifficulty = 'normal';

function defaults(){
  const d = ECONOMY.defaultUnlocked || {skin:'SK01',head:'HD01',trail:'TR01',pet:'PT01',background:'BG01',badge:'BD01'};
  return {
    coins: ECONOMY.initialCoins ?? 0,
    unlockedCollectibles: Object.values(d),
    newCollectibles: [],
    equipped: { ...d },
    achievements: [],
    pendingBoxes: { basic:0, advanced:0, elite:0, mastery:0 },
    records: {
      roguelike: { relax:{bestCamera:0,completed:false}, normal:{bestCamera:0,completed:false}, expert:{bestCamera:0,completed:false} },
      infinite: { relax:{bestLevel:0,bestTime:0,bestOrbs:0,bestCoins:0}, normal:{bestLevel:0,bestTime:0,bestOrbs:0,bestCoins:0}, expert:{bestLevel:0,bestTime:0,bestOrbs:0,bestCoins:0} }
    },
    stats: {
      totalRuns:0,totalOrbs:0,totalGoldOrbs:0,totalBlueOrbs:0,totalPhaseUses:0,totalShieldSaves:0,totalBoxesOpened:0,totalBossesDefeated:0,maxCombo:0,perfectRooms:0,expertRuns:0,legendaryUnlocked:0
    },
    options: { sound:true, reducedMotion:false, largeText:false, touchHints:true }
  };
}
function load(){
  try{
    const raw = localStorage.getItem(SAVE_KEY);
    const s = raw ? merge(defaults(), JSON.parse(raw)) : defaults();
    ensure(s);
    return s;
  }catch(e){ return defaults(); }
}
function merge(a,b){
  for(const k in b){
    if(b[k] && typeof b[k]==='object' && !Array.isArray(b[k]) && a[k]) a[k]=merge(a[k],b[k]);
    else a[k]=b[k];
  }
  return a;
}
function ensure(s){
  const ids = new Set(COLLECTIBLES.map(c=>c.id));
  Object.entries(ECONOMY.defaultUnlocked || {}).forEach(([type,id])=>{
    if(ids.has(id) && !s.unlockedCollectibles.includes(id)) s.unlockedCollectibles.push(id);
    if(!ids.has(s.equipped[type]) || !s.unlockedCollectibles.includes(s.equipped[type])) s.equipped[type]=id;
  });
}
function save(){ ensure(state); localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
function $(sel,el=document){ return el.querySelector(sel); }
function $all(sel,el=document){ return [...el.querySelectorAll(sel)]; }
function item(id){ return COLLECTIBLES.find(c=>c.id===id); }
function unlocked(id){ return state.unlockedCollectibles.includes(id); }
function setScreen(html, extra=''){
  screenName = extra || screenName;
  app.innerHTML = `<main class="screen ${state.options.reducedMotion?'reduced':''} ${state.options.largeText?'large':''}">${html}</main>`;
  bindNav();
}
function top(title='Snakademy', back=''){
  return `<div class="topbar"><div class="brand">${back?`<button class="btn small ghost" data-nav="${back}">← Volver</button>`:''} ${title}<small>Cada orbe cambia la run</small></div><div class="status"><div class="pill coin">🪙 ${state.coins} SnakeCoins</div><button class="btn small ghost" data-nav="main">🏠 Inicio</button></div></div>`;
}
function bindNav(){
  $all('[data-nav]').forEach(b=>b.onclick=()=>{ snd('click'); nav(b.dataset.nav); });
}
function nav(n){
  if(game) { game.stop(); game=null; }
  ({main:showMain, play:showPlay, shop:showShop, collection:()=>showCollection(), guide:showGuide, options:showOptions}[n]||showMain)();
}
function snd(kind='click'){
  if(!state.options.sound) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
    const map={click:[420,.03,.04],eat:[660,.05,.05],coin:[880,.05,.05],wrong:[190,.08,.045],box:[130,.18,.06],achievement:[760,.16,.05],phase:[520,.12,.045]};
    const [f,d,v]=map[kind]||map.click, o=audioCtx.createOscillator(), g=audioCtx.createGain();
    o.frequency.value=f; o.type='sine'; g.gain.value=v; o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime+d);
  }catch(e){}
}
function toast(msg){
  const s=$('.screen'); if(!s) return;
  const t=document.createElement('div'); t.className='toast'; t.textContent=msg; s.appendChild(t); setTimeout(()=>t.remove(),2050);
}
function modal(title, body, buttons){
  const s=$('.screen'); const m=document.createElement('div'); m.className='modal-back';
  m.innerHTML = `<div class="modal"><h2>${title}</h2><p>${body}</p><div class="row" style="justify-content:flex-end">${buttons.map((b,i)=>`<button class="btn ${b[2]||''}" data-m="${i}">${b[0]}</button>`).join('')}</div></div>`;
  s.appendChild(m);
  buttons.forEach((b,i)=>m.querySelector(`[data-m="${i}"]`).onclick=()=>{ snd('click'); m.remove(); if(b[1]) b[1](); });
}
function iconFor(c){
  if(!c) return '❔';
  if(c.type==='skin') return c.rarity==='legendary'?'🐍✨':'🐍';
  if(c.type==='head') return c.rarity==='legendary'?'🐲':'😎';
  if(c.type==='trail') return c.rarity==='legendary'?'🌈':'✨';
  if(c.type==='pet') return c.rarity==='legendary'?'🦅':'🐾';
  if(c.type==='background') return c.rarity==='legendary'?'🌌':'🖼️';
  if(c.type==='badge') return c.rarity==='legendary'?'🏆':'🎖️';
  return '◆';
}
function snakePreviewHTML(){
  return `<div class="snake-preview">${[0,1,2,3,4,5,6].map((_,i)=>`<div class="seg ${i===6?'head':''}" style="left:${i*70}px;top:${55+Math.sin(i)*12}px">${i===6?'<span class="eye l"></span><span class="eye r"></span><span class="tongue">⌁</span>':''}</div>`).join('')}</div><div class="pet"></div>`;
}
function showMain(){
  const bestR = Math.max(...Object.values(state.records.roguelike).map(r=>r.bestCamera||0));
  const bestI = Math.max(...Object.values(state.records.infinite).map(r=>r.bestLevel||0));
  setScreen(`${top('Snakademy')}
    <section class="layout">
      <div class="panel hero"><h1>Snakademy</h1><p>Cada orbe cambia la run. Muerde, evoluciona y sobrevive.</p>${snakePreviewHTML()}<div style="position:absolute;left:24px;bottom:22px"><b>Mejor cámara:</b> ${bestR}/20 · <b>Récord infinito:</b> nivel ${bestI}</div></div>
      <aside class="panel menu">
        <button class="btn primary" data-nav="play">▶ Jugar</button>
        <button class="btn gold" data-nav="shop">🎁 Tienda</button>
        <button class="btn" data-nav="collection">🐍 Colección</button>
        <button class="btn ghost" data-nav="guide">📘 Guía</button>
        <button class="btn ghost" data-nav="options">⚙ Opciones</button>
      </aside>
    </section>`);
}
function showPlay(){
  setScreen(`${top('Jugar','main')}<section class="full"><h1 class="title">Elige modo</h1><p class="sub">Expedición para construir una build. Infinito para una partida continua sin cortes.</p>
    <div class="grid cards">
      <div class="card" data-mode="roguelike"><div class="icon">🧪</div><h3>Expedición Roguelike</h3><p>20 cámaras · mutaciones · jefes · final de run.</p></div>
      <div class="card" data-mode="infinite"><div class="icon">♾️</div><h3>Modo Infinito</h3><p>Una sola partida continua · niveles · récords.</p></div>
      <div class="card" data-mode="practice"><div class="icon">🎮</div><h3>Probar controles</h3><p>Mini práctica sin recompensas para aprender a girar.</p></div>
    </div><div id="difficulty" style="margin-top:18px"></div></section>`);
  $all('[data-mode]').forEach(c=>c.onclick=()=>chooseMode(c.dataset.mode));
}
function chooseMode(m){
  selectedMode=m;
  $('#difficulty').innerHTML = `<div class="panel"><h2>${m==='roguelike'?'Expedición Roguelike':m==='infinite'?'Modo Infinito':'Práctica'}: dificultad</h2><div class="grid cards">${Object.entries(DIFF).map(([id,d])=>`<div class="card" data-diff="${id}"><h3>${d.label}</h3><p>${id==='relax'?'Más lento y amable.':id==='normal'?'Equilibrado.':'Más rápido, más riesgo y más monedas.'}</p></div>`).join('')}</div></div>`;
  $all('[data-diff]').forEach(b=>b.onclick=()=>startGame(m,b.dataset.diff));
}
function startGame(mode,difficulty){
  game = new Game(mode,difficulty);
  game.mount();
}
class Game{
  constructor(mode,difficulty){
    this.mode=mode; this.difficulty=difficulty; this.cfg=DIFF[difficulty];
    this.camera=1; this.level=1; this.running=false; this.paused=false; this.gameOver=false; this.last=0; this.acc=0; this.tickMs=this.cfg.speed;
    this.snake=[{x:7,y:9},{x:6,y:9},{x:5,y:9},{x:4,y:9}]; this.dir='right'; this.pending='right';
    this.grow=0; this.shields=this.cfg.shields; this.phase=0; this.phaseActive=0; this.brake=0;
    this.orbs=[]; this.powerUps=[]; this.obstacles=[]; this.portals=[]; this.effects=[]; this.upgrades=[]; this.autoMutations=[];
    this.objective={target:6,progress:0,type:'orbs'}; this.stats={orbs:0,gold:0,blue:0,coins:0,score:0,combo:0,maxCombo:0,bosses:0,perfect:true,start:Date.now(),maxLen:4,shieldSaves:0,phaseUses:0,perfectRooms:0};
    this.nextEventAt=18; this.message=''; this.messageTimer=0; this.practice=mode==='practice';
  }
  mount(){
    setScreen(`<div class="game-wrap"><div class="game-board"><canvas id="game" width="916" height="660"></canvas>${state.options.touchHints?'<div class="touch-hints"><span>↶ Girar</span><span>Girar ↷</span></div>':''}</div><aside class="panel hud" id="hud"></aside></div>`,'game');
    this.canvas=$('#game'); this.ctx=this.canvas.getContext('2d'); this.running=true; this.createRoom();
    this.bindInput(); this.loop= requestAnimationFrame(t=>this.update(t)); this.countdown();
  }
  stop(){ this.running=false; if(this.loop) cancelAnimationFrame(this.loop); window.onkeydown=null; window.onblur=null; }
  countdown(){
    this.paused=true; let n=3; this.message='3'; this.messageTimer=999;
    const int=setInterval(()=>{ n--; if(n>0){this.message=String(n); snd('click');} else {this.message='¡Snake!'; this.paused=false; clearInterval(int); setTimeout(()=>{this.message='';},500);} },650);
  }
  bindInput(){
    window.onkeydown=(e)=>{
      if(!this.running) return;
      const k=e.key.toLowerCase();
      if(['arrowup','w'].includes(k)) this.setDir('up');
      if(['arrowdown','s'].includes(k)) this.setDir('down');
      if(['arrowleft','a'].includes(k)) this.setDir('left');
      if(['arrowright','d'].includes(k)) this.setDir('right');
      if(k===' ') { e.preventDefault(); this.activatePhase(); }
      if(k==='shift') this.brake=1;
      if(k==='p'||k==='escape') this.togglePause();
    };
    window.onkeyup=(e)=>{ if(e.key.toLowerCase()==='shift') this.brake=0; };
    window.onblur=()=>{ if(this.running&&!this.gameOver) this.pause(true); };
    this.canvas.addEventListener('pointerdown',(e)=>{
      e.preventDefault();
      const rect=this.canvas.getBoundingClientRect();
      const x=(e.clientX-rect.left)/rect.width*this.canvas.width;
      const y=(e.clientY-rect.top)/rect.height*this.canvas.height;
      if(x<BOARD.x || x>BOARD.x+BOARD.w || y<BOARD.y || y>BOARD.y+BOARD.h) return;
      if(x < BOARD.x + BOARD.w/2) this.turnLeft(); else this.turnRight();
    },{passive:false});
  }
  togglePause(){ this.paused?this.resume():this.pause(false); }
  pause(auto=false){
    this.paused=true;
    modal('Pausa', auto?'La partida se ha pausado automáticamente.':'Run pausada.', [
      ['Continuar',()=>this.resume(),'primary'], ['Abandonar run',()=>this.finish(false),'orange']
    ]);
  }
  resume(){ this.countdown(); }
  setDir(d){ if(OPPOSITE[this.dir]!==d) this.pending=d; }
  turnLeft(){ this.setDir(LEFT_TURN[this.dir]); }
  turnRight(){ this.setDir(RIGHT_TURN[this.dir]); }
  hasUpgrade(idOrType){ return this.upgrades.some(u=>u.id===idOrType || u.effect?.type===idOrType); }
  activatePhase(){
    if(this.phase>=100 && this.phaseActive<=0){ this.phase=0; this.phaseActive=3000 + this.countEffect('phaseDuration')*1000; this.stats.phaseUses++; state.stats.totalPhaseUses++; snd('phase'); this.toast('Fase Snake activada'); }
  }
  countEffect(type){ return this.upgrades.filter(u=>u.effect?.type===type).reduce((a,u)=>a+(u.effect.amount||1),0); }
  createRoom(){
    this.obstacles=[]; this.orbs=[]; this.powerUps=[]; this.portals=[];
    const special = this.mode==='roguelike' ? (this.camera===10?'boss_wall':this.camera===15?'shadow':this.camera===20?'core':this.camera===5?'gold':'normal') : 'infinite';
    const target = this.mode==='roguelike' ? Math.min(13,5+Math.floor(this.camera/2)) : Infinity;
    this.objective={target,progress:0,type:'orbs'}; this.message = this.mode==='roguelike' ? `Cámara ${this.camera}` : `Infinito · Nivel ${this.level}`; this.messageTimer=1400; this.stats.perfect=true;
    this.addObstacles(special);
    this.spawnOrb(2);
    if(this.mode==='roguelike' && ['boss_wall','shadow','core'].includes(special)) this.toast(special==='shadow'?'Serpiente Sombra':special==='core'?'Cobra del Núcleo':'Muro Vivo');
  }
  addObstacles(kind){
    let amount = 3 + Math.floor((this.mode==='infinite'?this.level:this.camera)/3);
    amount = Math.floor(amount * this.cfg.obstacleRate);
    if(this.difficulty==='relax') amount=Math.max(1,amount-2);
    for(let i=0;i<amount;i++){
      const len=2+Math.floor(Math.random()*4), horizontal=Math.random()>.5;
      let x=4+Math.floor(Math.random()*(BOARD.cols-8)), y=3+Math.floor(Math.random()*(BOARD.rows-6));
      for(let j=0;j<len;j++){ const o={x:x+(horizontal?j:0),y:y+(horizontal?0:j)}; if(!this.blocked(o.x,o.y,true)) this.obstacles.push(o); }
    }
    if(kind==='core'||kind==='boss_wall') for(let y=4;y<14;y+=3) this.obstacles.push({x:14,y});
  }
  blocked(x,y,ignoreOrbs=false){
    if(x<0||y<0||x>=BOARD.cols||y>=BOARD.rows) return true;
    return this.snake.some(s=>s.x===x&&s.y===y) || this.obstacles.some(o=>o.x===x&&o.y===y) || (!ignoreOrbs && this.orbs.some(o=>o.x===x&&o.y===y));
  }
  freeCell(){
    for(let i=0;i<500;i++){ const x=Math.floor(Math.random()*BOARD.cols), y=Math.floor(Math.random()*BOARD.rows); if(!this.blocked(x,y)) return {x,y}; }
    return {x:1,y:1};
  }
  pickOrb(){
    const base = ORBS.filter(o=>{
      if(this.difficulty==='relax' && o.id==='ORB_BLACK' && (this.mode==='infinite'?this.level<7:this.camera<8)) return false;
      if(this.mode==='infinite' && o.id==='ORB_PURPLE') return this.stats.orbs>0 && this.stats.orbs%10===0;
      return true;
    });
    let total=base.reduce((a,o)=>a+(o.spawnWeight||1),0), r=Math.random()*total;
    for(const o of base){ r-=o.spawnWeight||1; if(r<=0) return {...o}; }
    return {...base[0]};
  }
  spawnOrb(n=1){ for(let i=0;i<n;i++){ const c=this.freeCell(); const o=this.pickOrb(); this.orbs.push({...o,x:c.x,y:c.y,life:o.id==='ORB_GHOST'?6500:0}); } }
  spawnPowerUp(){
    const p=POWER_UPS[Math.floor(Math.random()*POWER_UPS.length)]; const c=this.freeCell();
    this.powerUps.push({...p,x:c.x,y:c.y,life:9500});
  }
  update(t){
    if(!this.running) return;
    const dt = this.last? t-this.last : 16; this.last=t;
    if(!this.paused&&!this.gameOver){
      this.acc += dt; this.phaseActive=Math.max(0,this.phaseActive-dt); this.messageTimer=Math.max(0,this.messageTimer-dt);
      this.orbs.forEach(o=>{ if(o.life) o.life-=dt; }); this.orbs=this.orbs.filter(o=>!o.life || o.life>0);
      this.powerUps.forEach(p=>p.life-=dt); this.powerUps=this.powerUps.filter(p=>p.life>0);
      if(this.mode==='infinite') this.updateInfinite(dt);
      const speed = Math.max(55, this.tickMs - (this.mode==='infinite'?this.level*3:this.camera*1.2) + (this.brake?45:0));
      if(this.acc>=speed){ this.acc=0; this.step(); }
    }
    this.draw(); this.renderHUD();
    this.loop=requestAnimationFrame(tt=>this.update(tt));
  }
  updateInfinite(dt){
    const newLevel=1+Math.floor(this.stats.orbs/10);
    if(newLevel>this.level){ this.level=newLevel; this.message=`Nivel ${this.level}`; this.messageTimer=1200; this.addObstacles('infinite'); snd('achievement'); }
    if(this.stats.orbs>=this.nextEventAt){ this.nextEventAt+=18+Math.floor(Math.random()*10); this.triggerInfiniteEvent(); }
  }
  triggerInfiniteEvent(){
    const ev=INFINITE_EVENTS[Math.floor(Math.random()*INFINITE_EVENTS.length)];
    this.toast(`Evento: ${ev.name}`);
    if(/dorada/i.test(ev.name)) for(let i=0;i<3;i++){ const c=this.freeCell(); this.orbs.push({...ORBS.find(o=>o.id==='ORB_GOLD'),x:c.x,y:c.y,life:8000}); }
    else if(/orbes/i.test(ev.name)) this.spawnOrb(4);
    else if(/velocidad/i.test(ev.name)) this.tickMs=Math.max(70,this.tickMs-8);
    else this.spawnPowerUp();
  }
  step(){
    this.dir=this.pending;
    const d=DIRS[this.dir], head=this.snake[0], nh={x:head.x+d.x,y:head.y+d.y};
    if(this.checkCollision(nh)) return;
    this.snake.unshift(nh);
    const orbIndex=this.orbs.findIndex(o=>o.x===nh.x&&o.y===nh.y);
    if(orbIndex>=0){ const orb=this.orbs.splice(orbIndex,1)[0]; this.eatOrb(orb); } else if(this.grow>0) this.grow--; else this.snake.pop();
    const pIndex=this.powerUps.findIndex(p=>p.x===nh.x&&p.y===nh.y);
    if(pIndex>=0){ const p=this.powerUps.splice(pIndex,1)[0]; this.applyPower(p); }
    if(Math.random()<.035) this.spawnPowerUp();
    if(this.orbs.length<1) this.spawnOrb();
    this.stats.maxLen=Math.max(this.stats.maxLen,this.snake.length);
    if(this.mode==='roguelike' && this.objective.progress>=this.objective.target) this.completeRoom();
  }
  checkCollision(nh){
    const wall = nh.x<0||nh.y<0||nh.x>=BOARD.cols||nh.y>=BOARD.rows;
    const tail = this.snake.some((s,i)=>i>0&&s.x===nh.x&&s.y===nh.y);
    const obs = this.obstacles.some(o=>o.x===nh.x&&o.y===nh.y);
    if(tail && this.phaseActive>0) return false;
    if((wall||tail||obs)){
      if(this.shields>0){ this.shields--; this.stats.shieldSaves++; state.stats.totalShieldSaves++; this.stats.perfect=false; this.toast('Escudo salvador'); snd('wrong'); return true; }
      this.finish(false); return true;
    }
    return false;
  }
  eatOrb(orb){
    snd(orb.id==='ORB_GOLD'?'coin':'eat');
    this.stats.orbs++; state.stats.totalOrbs++; this.stats.combo++; this.stats.maxCombo=Math.max(this.stats.maxCombo,this.stats.combo); state.stats.maxCombo=Math.max(state.stats.maxCombo,this.stats.combo);
    this.stats.score += orb.score||10; this.stats.coins += orb.coins||0; if(orb.grow) this.grow += orb.grow;
    if(orb.id==='ORB_GOLD'){ this.stats.gold++; state.stats.totalGoldOrbs++; }
    if(orb.id==='ORB_BLUE'){ this.stats.blue++; state.stats.totalBlueOrbs++; }
    if(orb.chargesAbility) this.phase=Math.min(100,this.phase+(orb.chargesAbility||0)+this.countEffect('chargeBonus')*10);
    if(orb.id==='ORB_RED'){ this.tickMs=Math.max(65,this.tickMs-6); this.stats.coins+=2; }
    if(orb.id==='ORB_BLACK'){ this.checkCollision({x:-1,y:-1}); return; }
    if(orb.id==='ORB_PURPLE') this.applyAutoMutation();
    this.objective.progress++;
    if(Math.random()<.15) this.spawnOrb();
  }
  applyPower(p){
    this.toast(p.name); snd('achievement');
    const type=p.effect?.type || p.id;
    if(/shield|escudo/i.test(type+p.name)) this.shields++;
    else if(/phase|ghost|fantasma/i.test(type+p.name)) this.phaseActive=5000;
    else if(/slow|ralent/i.test(type+p.name)) this.tickMs+=25;
    else if(/cut|cola|corta/i.test(type+p.name)) this.snake=this.snake.slice(0,Math.max(4,this.snake.length-4));
    else if(/double|doble/i.test(type+p.name)) this.spawnOrb(3);
    else if(/gold|dorada/i.test(type+p.name)){ for(let i=0;i<5;i++){const c=this.freeCell();this.orbs.push({...ORBS.find(o=>o.id==='ORB_GOLD'),x:c.x,y:c.y,life:6500});} }
    else this.phase=Math.min(100,this.phase+30);
  }
  applyAutoMutation(){
    const safe=UPGRADES.filter(u=>(u.modes||[]).includes('infinite') || !u.modes || u.rarity!=='legendary').filter(u=>!this.upgrades.some(x=>x.id===u.id));
    const u=safe[Math.floor(Math.random()*safe.length)];
    if(u){ this.upgrades.push(u); this.applyUpgradeEffect(u); this.toast(`Mutación: ${u.name}`); }
  }
  applyUpgradeEffect(u){
    const e=u.effect||{};
    if(e.type==='addShield') this.shields += e.amount||1;
    if(e.type==='phaseDuration') this.phaseActive += (e.amount||1)*1000;
    if(e.type==='shrink') this.snake=this.snake.slice(0,Math.max(4,this.snake.length-(e.amount||1)));
    if(e.type==='coinMultiplier') this.stats.coins=Math.floor(this.stats.coins*(1+(e.amount||.1)));
    if(e.type==='chargeBonus') this.phase=Math.min(100,this.phase+20);
  }
  completeRoom(){
    if(this.stats.perfect){ this.stats.perfectRooms++; state.stats.perfectRooms++; }
    if([10,15,20].includes(this.camera)){ this.stats.bosses++; state.stats.totalBossesDefeated++; }
    if(this.camera>=20){ this.finish(true); return; }
    this.camera++;
    const best=state.records.roguelike[this.difficulty]; best.bestCamera=Math.max(best.bestCamera,this.camera);
    if(this.practice) { this.createRoom(); return; }
    this.running=false; showUpgrade(this);
  }
  finish(victory){
    this.gameOver=true; this.running=false;
    const seconds=Math.floor((Date.now()-this.stats.start)/1000);
    const mult=this.cfg.mult; let earned=0;
    if(this.mode==='infinite') earned=Math.floor((this.stats.coins + this.stats.orbs + this.level*10)*mult);
    else earned=Math.floor((this.stats.coins + this.stats.orbs + (this.camera-1)*5 + this.stats.bosses*20 + (victory?100:0))*mult);
    state.coins+=earned; state.stats.totalRuns++; if(this.difficulty==='expert') state.stats.expertRuns++;
    const r= state.records[this.mode==='infinite'?'infinite':'roguelike'][this.difficulty];
    let recordBonus=0;
    if(this.mode==='infinite'){
      if(this.level>r.bestLevel){ r.bestLevel=this.level; recordBonus+=50; }
      if(seconds>r.bestTime){ r.bestTime=seconds; recordBonus+=50; }
      r.bestOrbs=Math.max(r.bestOrbs,this.stats.orbs); r.bestCoins=Math.max(r.bestCoins,earned);
    }else{
      r.bestCamera=Math.max(r.bestCamera,this.camera); if(victory) r.completed=true;
    }
    state.coins+=recordBonus;
    const unlockedAch=checkAchievements();
    save();
    showResults({mode:this.mode,difficulty:this.difficulty,victory,camera:this.camera,level:this.level,time:seconds,orbs:this.stats.orbs,combo:this.stats.maxCombo,earned,recordBonus,ach:unlockedAch});
  }
  toast(m){ this.message=m; this.messageTimer=1600; }
  renderHUD(){
    const phasePct=Math.round(this.phase);
    const title=this.mode==='infinite'?`Infinito · Nivel ${this.level}`:`Cámara ${this.camera}/20`;
    const objective=this.mode==='infinite'?`Próximo nivel: ${10-(this.stats.orbs%10)} orbes`:`Objetivo: ${this.objective.progress}/${this.objective.target}`;
    $('#hud').innerHTML = `<h2>${title}</h2>
      <div class="hud-row"><span>${objective}</span><b></b></div>
      <div class="hud-row"><span>Escudos</span><b>${'🛡️'.repeat(this.shields)||'0'}</b></div>
      <div class="hud-row"><span>Combo</span><b>x${this.stats.combo}</b></div>
      <div class="hud-row"><span>SnakeCoins run</span><b class="coin">${this.stats.coins}</b></div>
      <div><div class="hud-row"><span>Fase Snake</span><b>${phasePct}%</b></div><div class="charge"><span style="width:${phasePct}%"></span></div></div>
      <button class="btn primary" id="phaseBtn" ${this.phase<100?'disabled':''}>⚡ Fase</button>
      ${this.hasUpgrade('brake')?'<button class="btn ghost" id="brakeBtn">🐢 Freno</button>':''}
      <button class="btn ghost" id="pauseBtn">⏸ Pausa</button>
      <div class="hud-row"><span>Mutaciones</span><b>${this.upgrades.length}</b></div>`;
    $('#phaseBtn').onclick=()=>this.activatePhase();
    $('#pauseBtn').onclick=()=>this.togglePause();
    const br=$('#brakeBtn'); if(br){ br.onpointerdown=()=>this.brake=1; br.onpointerup=()=>this.brake=0; }
  }
  draw(){
    const ctx=this.ctx; ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    ctx.fillStyle='#07101d'; round(ctx,BOARD.x,BOARD.y,BOARD.w,BOARD.h,20); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.06)'; ctx.lineWidth=1;
    for(let x=0;x<=BOARD.cols;x++){ line(ctx,BOARD.x+x*BOARD.cell,BOARD.y,BOARD.x+x*BOARD.cell,BOARD.y+BOARD.h); }
    for(let y=0;y<=BOARD.rows;y++){ line(ctx,BOARD.x,BOARD.y+y*BOARD.cell,BOARD.x+BOARD.w,BOARD.y+y*BOARD.cell); }
    this.obstacles.forEach(o=>cell(ctx,o.x,o.y,'#334a68','#1d2d45'));
    this.orbs.forEach(o=>drawOrb(ctx,o));
    this.powerUps.forEach(p=>drawPower(ctx,p));
    const phase=this.phaseActive>0;
    this.snake.slice().reverse().forEach((s,idx,arr)=>{
      const isHead=idx===arr.length-1; const px=BOARD.x+s.x*BOARD.cell, py=BOARD.y+s.y*BOARD.cell;
      ctx.globalAlpha=phase?.72:1; round(ctx,px+3,py+3,BOARD.cell-6,BOARD.cell-6,isHead?13:11); 
      const grad=ctx.createLinearGradient(px,py,px+BOARD.cell,py+BOARD.cell); grad.addColorStop(0,isHead?'#74ffc0':'#3ee08f'); grad.addColorStop(1,isHead?'#1c8b61':'#176f50'); ctx.fillStyle=grad; ctx.fill();
      if(isHead){ ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(px+12,py+11,3.8,0,Math.PI*2); ctx.arc(px+21,py+11,3.8,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#ff6680'; ctx.fillRect(px+29,py+15,8,3); }
      ctx.globalAlpha=1;
    });
    if(this.message && this.messageTimer>0){ ctx.fillStyle='rgba(0,0,0,.55)'; round(ctx,250,278,430,84,24); ctx.fill(); ctx.fillStyle='white'; ctx.font='900 38px system-ui'; ctx.textAlign='center'; ctx.fillText(this.message,465,332); ctx.textAlign='left'; }
  }
}
function round(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); }
function line(ctx,x1,y1,x2,y2){ ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke(); }
function cell(ctx,x,y,c1,c2){ const px=BOARD.x+x*BOARD.cell, py=BOARD.y+y*BOARD.cell; const g=ctx.createLinearGradient(px,py,px+32,py+32); g.addColorStop(0,c1); g.addColorStop(1,c2); ctx.fillStyle=g; round(ctx,px+3,py+3,26,26,8); ctx.fill(); }
function drawOrb(ctx,o){
  const colors={green:'#3ee08f',gold:'#ffd15c',blue:'#53a8ff',red:'#ff5d6c',purple:'#a96cff',ghost:'#d8edff',black:'#111'};
  const px=BOARD.x+o.x*BOARD.cell+16, py=BOARD.y+o.y*BOARD.cell+16; ctx.fillStyle=colors[o.color]||colors.green; ctx.beginPath(); ctx.arc(px,py,o.id==='ORB_GIANT'?14:10,0,Math.PI*2); ctx.fill(); ctx.strokeStyle='rgba(255,255,255,.55)'; ctx.stroke();
}
function drawPower(ctx,p){ const px=BOARD.x+p.x*BOARD.cell, py=BOARD.y+p.y*BOARD.cell; cell(ctx,p.x,p.y,'#fff176','#f6a300'); ctx.fillStyle='#201400'; ctx.font='18px system-ui'; ctx.fillText('✦',px+10,py+22); }
function showUpgrade(g){
  const pool=UPGRADES.filter(u=>(u.modes||[]).includes('roguelike') && !g.upgrades.some(x=>x.id===u.id));
  const picks=[]; while(picks.length<3 && pool.length){ const i=Math.floor(Math.random()*pool.length); picks.push(pool.splice(i,1)[0]); }
  setScreen(`${top('Elige una mutación','play')}<section class="full"><h1 class="title">Mutación de cámara</h1><p class="sub">Elige una mejora para esta expedición.</p><div class="grid cards">${picks.map(u=>`<div class="card rarity-${u.rarity}" data-up="${u.id}"><div class="icon">${u.rarity==='legendary'?'👑':u.rarity==='epic'?'✦':'◆'}</div><h3>${u.name}</h3><p><b>${RARITY[u.rarity]}</b> · ${u.family}</p><p>${u.description}</p></div>`).join('')}</div></section>`);
  $all('[data-up]').forEach(c=>c.onclick=()=>{ const u=picks.find(x=>x.id===c.dataset.up); g.upgrades.push(u); g.applyUpgradeEffect(u); g.running=true; g.mount(); });
}
function showResults(r){
  const mode = r.mode==='infinite'?'Modo Infinito':'Expedición Roguelike';
  const rows = [
    ['Modo',mode], ['Dificultad',DIFF[r.difficulty].label], [r.mode==='infinite'?'Nivel':'Cámara', r.mode==='infinite'?r.level:`${r.camera}/20`],
    ['Orbes',r.orbs], ['Combo máximo','x'+r.combo], ['SnakeCoins',`+${r.earned}`]
  ];
  if(r.recordBonus) rows.push(['Bonus récord',`+${r.recordBonus}`]);
  const ach = r.ach.map(a=>`<div class="res-row"><span>🏆 ${a.name}</span><b>${a.reward.coins?`+${a.reward.coins}`:a.reward.box?'Caja':''}</b></div>`).join('');
  setScreen(`${top('Run finalizada','play')}<section class="full"><div class="panel" style="max-width:760px;margin:auto;width:100%"><h1>${r.victory?'¡Núcleo estabilizado!':'Run finalizada'}</h1><div class="results">${rows.map(x=>`<div class="res-row"><span>${x[0]}</span><b>${x[1]}</b></div>`).join('')}${ach}</div><div class="row" style="margin-top:16px"><button class="btn primary" data-retry>Reintentar</button><button class="btn gold" data-nav="shop">Tienda</button><button class="btn" data-nav="collection">Colección</button><button class="btn ghost" data-nav="main">Menú</button></div></div></section>`);
  bindNav(); $('[data-retry]').onclick=()=>startGame(r.mode,r.difficulty);
}
function showShop(){
  const boxes=Object.values(LOOT_BOXES).map(b=>`<div class="card rarity-${b.id==='mastery'?'legendary':b.id==='elite'?'epic':'rare'}" data-box="${b.id}"><div class="icon">🎁</div><h3>${b.name}</h3><p>${b.description}</p><b class="coin">${b.earnedOnly?((state.pendingBoxes[b.id]||0)+' disponible(s)'):(b.cost+' SnakeCoins')}</b></div>`).join('');
  setScreen(`${top('Tienda','main')}<section class="full"><h1 class="title">Cajas de recompensa</h1><p class="sub">Todo se consigue jugando. Los duplicados vuelven como SnakeCoins.</p><div class="grid cards">${boxes}</div></section>`);
  $all('[data-box]').forEach(c=>c.onclick=()=>confirmBox(c.dataset.box));
}
function confirmBox(id){
  const b=LOOT_BOXES[id];
  if(b.earnedOnly && (state.pendingBoxes[id]||0)<=0) return toast('Esa caja se consigue con logros.');
  if(!b.earnedOnly && state.coins<b.cost) return toast('No tienes suficientes SnakeCoins.');
  modal(`Abrir ${b.name}`, b.earnedOnly?'Usarás una caja pendiente.':`Coste: ${b.cost} SnakeCoins.`, [['Cancelar',null,'ghost'],['Abrir',()=>openBox(id),'gold']]);
}
function openBox(id){
  const b=LOOT_BOXES[id]; if(b.earnedOnly) state.pendingBoxes[id]--; else state.coins-=b.cost;
  const reward=rollReward(id); state.stats.totalBoxesOpened++; const ach=checkAchievements(); save();
  showLoot(reward,ach);
}
function rollRarity(odds){ let r=Math.random()*100, acc=0; for(const [k,v] of Object.entries(odds)){ acc+=v; if(r<=acc) return k; } return 'common'; }
function rollReward(boxId){
  const b=LOOT_BOXES[boxId]; let rarity=rollRarity(b.odds);
  let pool=COLLECTIBLES.filter(i=>i.rarity===rarity&&!i.unlockDefault);
  let locked=pool.filter(i=>!unlocked(i.id));
  if(!locked.length) locked=COLLECTIBLES.filter(i=>!i.unlockDefault&&!unlocked(i.id));
  if(locked.length){ const it=locked[Math.floor(Math.random()*locked.length)]; state.unlockedCollectibles.push(it.id); state.newCollectibles.push(it.id); if(it.rarity==='legendary') state.stats.legendaryUnlocked++; return {item:it,duplicate:false,refund:0}; }
  const it=pool[Math.floor(Math.random()*pool.length)]||COLLECTIBLES.find(i=>!i.unlockDefault); const refund=b.duplicateRefund[it.rarity]||25; state.coins+=refund; return {item:it,duplicate:true,refund};
}
function showLoot(r,ach=[]){
  const it=r.item;
  setScreen(`${top('Caja abierta','shop')}<section class="full"><div class="panel rarity-${it.rarity}" style="max-width:650px;margin:auto;text-align:center"><div style="font-size:96px">${iconFor(it)}</div><h1>${r.duplicate?'Objeto repetido':'¡Nuevo objeto!'}</h1><h2>${it.name}</h2><p><b>${RARITY[it.rarity]}</b> · ${it.description}</p>${r.duplicate?`<p class="coin">Convertido en +${r.refund} SnakeCoins</p>`:''}<div class="row" style="justify-content:center"><button class="btn primary" data-equip="${it.id}">Equipar ahora</button><button class="btn gold" data-nav="shop">Abrir otra</button><button class="btn ghost" data-nav="collection">Colección</button></div></div></section>`);
  bindNav(); snd(it.rarity==='legendary'?'achievement':'box');
  $('[data-equip]').onclick=()=>{ equip(it.id); showMain(); };
}
function showCollection(tab='skin', selected=null){
  const tabs=[...Object.entries(TYPE_LABEL)].map(([id,l])=>`<button class="tab ${id===tab?'active':''}" data-tab="${id}">${l}</button>`).join('');
  const list = tab==='achievements' ? ACHIEVEMENTS.map(a=>({id:a.id,type:'achievement',name:a.name,description:a.description,rarity:state.achievements.includes(a.id)?'rare':'common'})) : COLLECTIBLES.filter(c=>c.type===tab);
  selected=selected||list[0]?.id; const sel=list.find(i=>i.id===selected)||list[0];
  const cards=list.map(i=>{ const un=tab==='achievements'?state.achievements.includes(i.id):unlocked(i.id); const nw=state.newCollectibles.includes(i.id); const eq=Object.values(state.equipped).includes(i.id); return `<div class="card collect rarity-${i.rarity} ${un?'':'locked'}" data-item="${i.id}"><div class="icon">${un?iconFor(i):'❔'}</div><b>${un?i.name:'Aún no descubierto'}</b><p>${RARITY[i.rarity]||''}</p>${nw?'<span class="new">Nuevo</span>':''}${eq?'<span class="new" style="left:8px;right:auto">Equipado</span>':''}</div>`; }).join('');
  const un=sel && (tab==='achievements'?state.achievements.includes(sel.id):unlocked(sel.id));
  setScreen(`${top('Colección','main')}<section class="full"><div class="tabs">${tabs}</div><div class="collection"><div class="collection-grid">${cards}</div><div class="panel rarity-${sel?.rarity||'common'}"><div style="font-size:100px;text-align:center">${un?iconFor(sel):'❔'}</div><h2>${un?sel.name:'Objeto misterioso'}</h2><p>${un?sel.description:'Abre cajas o completa logros para descubrirlo.'}</p>${tab!=='achievements'&&un?`<button class="btn primary" data-equip="${sel.id}">Equipar</button>`:''}</div></div></section>`);
  $all('[data-tab]').forEach(b=>b.onclick=()=>showCollection(b.dataset.tab));
  $all('[data-item]').forEach(b=>b.onclick=()=>showCollection(tab,b.dataset.item));
  const e=$('[data-equip]'); if(e) e.onclick=()=>{ equip(e.dataset.equip); showCollection(tab,e.dataset.equip); };
}
function equip(id){ const it=item(id); if(!it||!unlocked(id)) return toast('Bloqueado'); state.equipped[it.type]=id; state.newCollectibles=state.newCollectibles.filter(x=>x!==id); save(); snd('click'); toast('Equipado'); }
function showGuide(){
  setScreen(`${top('Guía','main')}<section class="full scroll"><div class="panel"><h1 class="title">Cómo se juega</h1><p class="sub">Snakademy mezcla Snake clásico con mutaciones roguelike.</p><div class="grid cards">
    ${[['🎮','Controles','PC: WASD/Flechas. Móvil: toca lado izquierdo/derecho del tablero para girar.'],['🧪','Expedición','20 cámaras, mutaciones entre cámaras y jefes.'],['♾️','Infinito','No cambia de pantalla. Cada 10 orbes sube el nivel.'],['🟢','Orbes','Verde comida, dorado monedas, azul Fase, rojo riesgo, morado mutación, negro trampa.'],['⚡','Fase Snake','Atraviesa tu cola durante unos segundos.'],['🎁','Colección','Skins, cabezas, rastros, mascotas, fondos e insignias.']].map(x=>`<div class="card"><div class="icon">${x[0]}</div><h3>${x[1]}</h3><p>${x[2]}</p></div>`).join('')}</div><button class="btn primary" data-practice style="margin-top:16px">Probar controles</button></div></section>`);
  $('[data-practice]').onclick=()=>startGame('practice','relax');
}
function showOptions(){
  setScreen(`${top('Opciones','main')}<section class="full"><div class="panel" style="max-width:650px;margin:auto;width:100%"><h1>Opciones</h1><div class="grid">
    <button class="btn ghost" data-opt="sound">Sonido: ${state.options.sound?'Activado':'Desactivado'}</button>
    <button class="btn ghost" data-opt="reducedMotion">Reducir animaciones: ${state.options.reducedMotion?'Activado':'Desactivado'}</button>
    <button class="btn ghost" data-opt="largeText">Texto grande: ${state.options.largeText?'Activado':'Desactivado'}</button>
    <button class="btn ghost" data-opt="touchHints">Ayuda táctil: ${state.options.touchHints?'Activada':'Desactivada'}</button>
    <button class="btn" data-full>Pantalla completa</button><button class="btn orange" data-credits>Créditos / Sobre el juego</button><button class="btn" style="background:linear-gradient(#ff6b7a,#b62c45)" data-reset>Borrar progreso</button></div></div></section>`);
  $all('[data-opt]').forEach(b=>b.onclick=()=>{ state.options[b.dataset.opt]=!state.options[b.dataset.opt]; save(); showOptions(); });
  $('[data-full]').onclick=()=>document.documentElement.requestFullscreen?.();
  $('[data-credits]').onclick=()=>modal('Snakademy','Snake roguelike arcade con colección, tienda, mutaciones y modo infinito. Cada orbe cambia la run.',[['Cerrar',null,'primary']]);
  $('[data-reset]').onclick=()=>modal('Borrar progreso','Se perderán SnakeCoins, colección, logros y récords.',[['Cancelar',null,'ghost'],['Borrar',()=>{localStorage.removeItem(SAVE_KEY); location.reload();},'orange']]);
}
function checkAchievements(){
  const out=[];
  for(const a of ACHIEVEMENTS){
    if(state.achievements.includes(a.id)) continue;
    if(meets(a.condition)){
      state.achievements.push(a.id); out.push(a);
      if(a.reward.coins) state.coins+=a.reward.coins;
      if(a.reward.box) state.pendingBoxes[a.reward.box]=(state.pendingBoxes[a.reward.box]||0)+1;
      const badge = 'BD'+a.id.slice(1).padStart(2,'0');
      if(COLLECTIBLES.some(c=>c.id===badge) && !unlocked(badge)){ state.unlockedCollectibles.push(badge); state.newCollectibles.push(badge); }
    }
  }
  return out;
}
function meets(c){
  const bestCam=Math.max(...Object.values(state.records.roguelike).map(r=>r.bestCamera||0));
  const bestInf=Math.max(...Object.values(state.records.infinite).map(r=>r.bestLevel||0));
  if(c.kind==='totalOrbs') return state.stats.totalOrbs>=c.value;
  if(c.kind==='totalRuns') return state.stats.totalRuns>=c.value;
  if(c.kind==='bestCamera') return bestCam>=c.value;
  if(c.kind==='infiniteLevel') return bestInf>=c.value;
  if(c.kind==='maxCombo') return state.stats.maxCombo>=c.value;
  if(c.kind==='goldOrbs') return state.stats.totalGoldOrbs>=c.value;
  if(c.kind==='phaseUses') return state.stats.totalPhaseUses>=c.value;
  if(c.kind==='shieldSaves') return state.stats.totalShieldSaves>=c.value;
  if(c.kind==='bossesDefeated') return state.stats.totalBossesDefeated>=c.value;
  if(c.kind==='perfectRooms') return state.stats.perfectRooms>=c.value;
  if(c.kind==='collectiblesUnlocked') return state.unlockedCollectibles.length>=c.value;
  if(c.kind==='boxesOpened') return state.stats.totalBoxesOpened>=c.value;
  if(c.kind==='legendaryUnlocked') return state.stats.legendaryUnlocked>=c.value;
  if(c.kind==='expertBestCamera') return state.records.roguelike.expert.bestCamera>=c.value;
  if(c.kind==='legendaryGoal') return state.records.roguelike.expert.completed || bestInf>=20;
  return false;
}
function validate(){
  const ids=new Set(); for(const c of COLLECTIBLES){ if(ids.has(c.id)) console.warn('Duplicado',c.id); ids.add(c.id); }
  for(const b of Object.values(LOOT_BOXES)){ const s=Object.values(b.odds).reduce((a,n)=>a+n,0); if(s!==100) console.warn('Odds',b.id,s); }
}
validate(); showMain();
