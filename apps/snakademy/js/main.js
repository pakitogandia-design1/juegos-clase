
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

function equippedItem(type){
  return item(state.equipped?.[type]) || COLLECTIBLES.find(c=>c.type===type && c.unlockDefault) || COLLECTIBLES.find(c=>c.type===type);
}
function skinVisual(id=state.equipped.skin){
  const n = parseInt(String(id||'SK01').replace(/\D/g,''),10) || 1;
  const palette = {
    1:['#3ee08f','#176f50','#dfffee','#0a3c2b','classic'], 2:['#62d464','#257337','#e6ffd2','#123d22','leaf'], 3:['#83ffd2','#24a37f','#eefef8','#0d4b3f','soft'],
    4:['#53a8ff','#2251a8','#e5f2ff','#0d2a68','wave'], 5:['#ffad4d','#c9571d','#fff1d4','#6b2809','stripe'], 6:['#b98751','#6a3d22','#ffe1bd','#392213','earth'],
    7:['#88e06b','#2d7d3b','#f1ffe6','#143f1e','leaf'], 8:['#55d6ff','#147394','#e8fbff','#0b3d55','drop'], 9:['#7befa3','#2c8d5a','#eefff4','#143b29','garden'],
    10:['#e8c46e','#9a6a24','#fff5cf','#59380f','sand'], 11:['#ff4fd8','#42e8ff','#fff0fb','#3c1549','arcade'], 12:['#ff8bd7','#63df7d','#fff0fa','#4c1b45','flower'],
    13:['#b8c8d8','#52677e','#f7fbff','#2e3a4a','robot'], 14:['#bff7ff','#5aa9d6','#ffffff','#2a5267','crystal'], 15:['#7bd647','#246b2d','#fbffe9','#143a1b','cactus'],
    16:['#55c7ff','#1f7a95','#e8faff','#0e4658','water'], 17:['#7dff6a','#1b1b2d','#efffec','#080812','pixel'], 18:['#40ffbf','#173557','#e9fff8','#061a2e','circuit'],
    19:['#5c6cff','#1d214e','#ecefff','#090b24','night'], 20:['#ffd76f','#c78121','#fff6da','#5e3906','honey'], 21:['#ff5d3d','#7a120e','#fff0dc','#330505','lava'],
    22:['#bff3ff','#3d91c4','#ffffff','#1d4a68','ice'], 23:['#865cff','#111c4a','#f5ecff','#05071f','galaxy'], 24:['#42e8ff','#ff4fd8','#ffffff','#15153d','neon'],
    25:['#d7b66a','#5e4220','#fff8df','#2e1f10','cobra'], 26:['#4fe68d','#244b2f','#f0fff4','#102314','forest'], 27:['#55a8ff','#143a80','#eaf4ff','#081b45','coreBlue'],
    28:['#ffd15c','#8a5a00','#fff7d7','#3b2600','goldOrb'], 29:['#42465a','#12151f','#d7def0','#03050b','shadow'], 30:['#a96cff','#43ff9a','#f5eaff','#281044','mutant'],
    31:['#ff6b4a','#7e1010','#fff1dd','#3c0606','dragon'], 32:['#ffb24f','#ff5d6c','#fff1cf','#5e0e16','phoenix'], 33:['#53a8ff','#0d173d','#eff8ff','#030817','nucleus'],
    34:['#9f7aff','#161735','#fff4ff','#050512','cosmic'], 35:['#ff5d6c','#53a8ff','#ffffff','#1c1638','rainbow']
  };
  const p = palette[n] || palette[1];
  return { id, n, body:p[0], body2:p[1], hi:p[2], outline:p[3], pattern:p[4] };
}
function headVisual(id=state.equipped.head){
  const n = parseInt(String(id||'HD01').replace(/\D/g,''),10) || 1;
  if(n===7 || n===20) return {shape:'cobra', scale:1.12, horn:false};
  if(n===13) return {shape:'dragon', scale:1.18, horn:true};
  if(n===8) return {shape:'robot', scale:1.04, horn:false};
  if(n===9) return {shape:'flower', scale:1.08, horn:false};
  if(n===14) return {shape:'ghost', scale:1.08, horn:false};
  if(n===15) return {shape:'crystal', scale:1.08, horn:false};
  if(n===17) return {shape:'lava', scale:1.1, horn:false};
  if(n===18) return {shape:'phoenix', scale:1.16, horn:true};
  if(n===19) return {shape:'cosmic', scale:1.12, horn:false};
  if(n===5) return {shape:'pixel', scale:1, horn:false};
  if(n===10) return {shape:'helmet', scale:1.08, horn:false};
  if(n===11) return {shape:'glasses', scale:1, horn:false};
  return {shape:'classic', scale:1, horn:false};
}
function trailVisual(id=state.equipped.trail){
  const n = parseInt(String(id||'TR01').replace(/\D/g,''),10) || 1;
  const map = {
    1:['none','rgba(255,255,255,0)'],2:['leaf','#7dff6a'],3:['drop','#55d6ff'],4:['spark','#ffffff'],5:['dust','#d2b48c'],6:['petal','#ff8bd7'],7:['spark','#ffcf4d'],8:['coin','#ffd15c'],9:['bubble','#aeefff'],10:['circuit','#42e8ff'],11:['glow','#53a8ff'],12:['star','#fff18a'],13:['ember','#ff5d3d'],14:['ice','#bff3ff'],15:['smoke','#6a6f88'],16:['coin','#ffd15c'],17:['mist','#a96cff'],18:['galaxy','#9f7aff'],19:['rainbow','#ff5d6c'],20:['fire','#ff8a3d']
  };
  const p=map[n]||map[1]; return {kind:p[0], color:p[1], n};
}
function petVisual(id=state.equipped.pet){
  const n = parseInt(String(id||'PT01').replace(/\D/g,''),10) || 1;
  const pets = {
    1:['Mini Orbe','orb','🔵','#53a8ff','#a96cff'],2:['Manzanita','apple','🍎','#ff5d6c','#67d66b'],3:['Ratón Pixel','mouse','🐭','#c9d2e3','#8a95a8'],4:['Gotita','drop','💧','#55d6ff','#1d7aa0'],5:['Hoja Viva','leaf','🍃','#7bd647','#226a32'],6:['Gusanito','worm','🪱','#c88452','#6b3a24'],
    7:['Robot Manzana','robot','🤖','#b8c8d8','#ff5d6c'],8:['Luciérnaga','firefly','✨','#fff176','#3ee08f'],9:['Mini Cobra','cobra','🐍','#d7b66a','#5e4220'],10:['Orbe Azul','orb','🔷','#53a8ff','#1b3c91'],11:['Setita','mushroom','🍄','#ff6b6b','#f5e6c8'],12:['Dron Jardín','drone','🚁','#42e8ff','#1c2944'],
    13:['Fantasmín','ghost','👻','#eaf7ff','#a96cff'],14:['Dragón Mini','dragon','🐲','#ff6b4a','#7e1010'],15:['Cofre Vivo','chest','🎁','#d79520','#5b3210'],16:['Orbe Dorado','gold','🟡','#ffd15c','#8a5a00'],17:['Flor Mecánica','flower','🌸','#ff8bd7','#42e8ff'],
    18:['Fénix Mini','phoenix','🔥','#ffad4d','#ff5d6c'],19:['Cobra Cósmica','cosmic','🌌','#9f7aff','#161735'],20:['Núcleo Vivo','core','⚛️','#53a8ff','#08111f']
  };
  const p=pets[n]||pets[1]; return {name:p[0], cls:p[1], emoji:p[2], c1:p[3], c2:p[4], n};
}
function petHTML(){
  const p = petVisual();
  return `<div class="pet-custom pet-${p.cls}" style="--p1:${p.c1};--p2:${p.c2}"><span>${p.emoji}</span></div>`;
}
function segmentStyle(i,isHead=false){
  const s = skinVisual();
  const size = isHead ? 66 : 54;
  const radius = headVisual().shape==='pixel' ? 8 : (isHead?28:22);
  let extra = '';
  if(['robot','circuit'].includes(s.pattern)) extra = `background-image:linear-gradient(145deg,${s.body},${s.body2}),linear-gradient(90deg,rgba(255,255,255,.35) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.25) 1px,transparent 1px);background-size:auto,12px 12px,12px 12px;`;
  if(['pixel'].includes(s.pattern)) extra = `background-image:linear-gradient(145deg,${s.body},${s.body2});image-rendering:pixelated;border-radius:${isHead?10:8}px;`;
  if(['galaxy','cosmic','rainbow'].includes(s.pattern)) extra = `background-image:radial-gradient(circle at 25% 25%,#fff 0 2px,transparent 3px),linear-gradient(135deg,${s.body},${s.body2},${s.hi});`;
  if(['lava','phoenix','dragon'].includes(s.pattern)) extra = `background-image:radial-gradient(circle at 30% 30%,rgba(255,255,255,.5),transparent 18%),linear-gradient(145deg,${s.body},${s.body2});`;
  if(['ice','crystal'].includes(s.pattern)) extra = `background-image:linear-gradient(135deg,rgba(255,255,255,.75),transparent 22%),linear-gradient(145deg,${s.body},${s.body2});`;
  if(!extra) extra = `background:linear-gradient(145deg,${isHead?s.hi:s.body},${s.body2});`;
  return `${extra}width:${size}px;height:${isHead?62:54}px;border-radius:${radius}px;border:2px solid ${s.outline};box-shadow:0 12px 24px rgba(0,0,0,.32),inset 0 -8px rgba(0,0,0,.18);`;
}
function patternMarkHTML(i){
  const s=skinVisual();
  if(['leaf','garden','forest','flower'].includes(s.pattern)) return '<i class="mark leafmark">⌁</i>';
  if(['robot','circuit','coreBlue','nucleus'].includes(s.pattern)) return '<i class="mark circuitmark">⌬</i>';
  if(['goldOrb','honey'].includes(s.pattern)) return '<i class="mark coinmark">●</i>';
  if(['lava','phoenix','dragon'].includes(s.pattern)) return '<i class="mark firemark">⌃</i>';
  if(['galaxy','cosmic','rainbow','neon'].includes(s.pattern)) return '<i class="mark starmark">✦</i>';
  if(['water','drop','ice'].includes(s.pattern)) return '<i class="mark dropmark">•</i>';
  return i%2?'<i class="mark">·</i>':'';
}
function snakePreviewHTML(){
  const h = headVisual();
  return `<div class="snake-preview">${[0,1,2,3,4,5,6].map((_,i)=>{
    const isHead=i===6;
    return `<div class="seg ${isHead?'head head-'+h.shape:''}" style="left:${i*70}px;top:${55+Math.sin(i)*12}px;${segmentStyle(i,isHead)}">${patternMarkHTML(i)}${isHead?'<span class="eye l"></span><span class="eye r"></span><span class="tongue">⌁</span>':''}</div>`;
  }).join('')}</div>${petHTML()}`;
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
    drawTrail(ctx,this.snake);
    this.snake.slice().reverse().forEach((s,idx,arr)=>{
      const isHead=idx===arr.length-1; const px=BOARD.x+s.x*BOARD.cell, py=BOARD.y+s.y*BOARD.cell;
      ctx.globalAlpha=phase?.72:1;
      drawSnakeSegment(ctx, px, py, isHead, idx, arr.length, this.dir);
      ctx.globalAlpha=1;
    });
    if(this.message && this.messageTimer>0){ ctx.fillStyle='rgba(0,0,0,.55)'; round(ctx,250,278,430,84,24); ctx.fill(); ctx.fillStyle='white'; ctx.font='900 38px system-ui'; ctx.textAlign='center'; ctx.fillText(this.message,465,332); ctx.textAlign='left'; }
  }
}
function round(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); }
function line(ctx,x1,y1,x2,y2){ ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke(); }
function cell(ctx,x,y,c1,c2){ const px=BOARD.x+x*BOARD.cell, py=BOARD.y+y*BOARD.cell; const g=ctx.createLinearGradient(px,py,px+32,py+32); g.addColorStop(0,c1); g.addColorStop(1,c2); ctx.fillStyle=g; round(ctx,px+3,py+3,26,26,8); ctx.fill(); }

function drawTrail(ctx, snake){
  const tr = trailVisual();
  if(tr.kind==='none' || state.options.reducedMotion) return;
  const tail = snake.slice(4);
  tail.forEach((s,i)=>{
    if(i%2) return;
    const px=BOARD.x+s.x*BOARD.cell+16, py=BOARD.y+s.y*BOARD.cell+16;
    ctx.save();
    ctx.globalAlpha=Math.max(.08,.34-i*.018);
    ctx.fillStyle=tr.color;
    ctx.font='18px system-ui';
    const marks={leaf:'❧',drop:'•',spark:'✦',dust:'·',petal:'✿',coin:'●',bubble:'○',circuit:'⌬',glow:'✧',star:'★',ember:'⌃',ice:'✣',smoke:'~',mist:'☁',galaxy:'✦',rainbow:'✦',fire:'⌃'};
    ctx.fillText(marks[tr.kind]||'✦',px-7+(i%3)*2,py+6);
    ctx.restore();
  });
}
function drawSnakeSegment(ctx, px, py, isHead, idx, total, dir){
  const s=skinVisual(), h=headVisual();
  const x=px+3, y=py+3, w=BOARD.cell-6, hh=BOARD.cell-6;
  const radius = isHead ? (h.shape==='pixel'?6:13) : (s.pattern==='pixel'?6:11);
  round(ctx,x,y,w,hh,radius);
  const grad=ctx.createLinearGradient(px,py,px+BOARD.cell,py+BOARD.cell);
  grad.addColorStop(0,isHead?s.hi:s.body);
  grad.addColorStop(1,s.body2);
  ctx.fillStyle=grad;
  ctx.fill();
  ctx.lineWidth = isHead ? 2.5 : 1.6;
  ctx.strokeStyle = s.outline;
  ctx.stroke();

  ctx.save();
  ctx.beginPath(); ctx.roundRect(x,y,w,hh,radius); ctx.clip();
  if(['robot','circuit','coreBlue','nucleus'].includes(s.pattern)){
    ctx.strokeStyle='rgba(255,255,255,.28)'; ctx.lineWidth=1;
    for(let i=0;i<3;i++){ line(ctx,x+6+i*8,y+4,x+6+i*8,y+hh-4); }
    ctx.fillStyle=s.hi; ctx.fillRect(x+10,y+12,5,5); ctx.fillRect(x+20,y+7,4,4);
  } else if(['leaf','garden','forest','flower'].includes(s.pattern)){
    ctx.fillStyle='rgba(255,255,255,.32)'; ctx.font='13px system-ui'; ctx.fillText('❧',x+8,y+19);
  } else if(['water','ice','crystal'].includes(s.pattern)){
    ctx.fillStyle='rgba(255,255,255,.46)'; ctx.beginPath(); ctx.arc(x+10,y+10,5,0,Math.PI*2); ctx.fill();
  } else if(['lava','phoenix','dragon'].includes(s.pattern)){
    ctx.fillStyle='rgba(255,245,180,.48)'; ctx.font='14px system-ui'; ctx.fillText('⌃',x+10,y+21);
  } else if(['galaxy','cosmic','rainbow','neon'].includes(s.pattern)){
    ctx.fillStyle='rgba(255,255,255,.72)'; ctx.font='12px system-ui'; ctx.fillText('✦',x+7,y+16); ctx.fillText('·',x+20,y+24);
  } else if(['goldOrb','honey','sand'].includes(s.pattern)){
    ctx.fillStyle='rgba(255,255,255,.35)'; ctx.beginPath(); ctx.arc(x+14,y+14,4,0,Math.PI*2); ctx.fill();
  } else if(s.pattern==='pixel'){
    ctx.fillStyle='rgba(255,255,255,.24)'; ctx.fillRect(x+5,y+5,8,8); ctx.fillRect(x+18,y+17,6,6);
  }
  ctx.restore();

  if(isHead){
    drawHeadDetails(ctx, px, py, h, s, dir);
  }
}
function drawHeadDetails(ctx, px, py, h, s, dir){
  const x=px+3, y=py+3;
  ctx.save();
  if(h.shape==='cobra'){
    ctx.fillStyle=s.body2; ctx.globalAlpha=.82;
    ctx.beginPath(); ctx.ellipse(px+16,py+16,18,12,0,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha=1;
  }
  if(h.horn || h.shape==='dragon' || h.shape==='phoenix'){
    ctx.fillStyle=s.hi;
    ctx.beginPath(); ctx.moveTo(px+9,py+6); ctx.lineTo(px+14,py-2); ctx.lineTo(px+18,py+8); ctx.fill();
    ctx.beginPath(); ctx.moveTo(px+24,py+6); ctx.lineTo(px+30,py-2); ctx.lineTo(px+31,py+8); ctx.fill();
  }
  if(h.shape==='robot'){
    ctx.strokeStyle='rgba(255,255,255,.65)'; ctx.lineWidth=2; ctx.strokeRect(px+8,py+8,18,15);
  }
  if(h.shape==='flower'){
    ctx.fillStyle='#ff8bd7'; ctx.font='15px system-ui'; ctx.fillText('✿',px+7,py+13);
  }
  if(h.shape==='ghost'){
    ctx.globalAlpha=.45; ctx.fillStyle='#ffffff'; ctx.fillRect(px+6,py+21,22,4); ctx.globalAlpha=1;
  }
  if(h.shape==='glasses'){
    ctx.strokeStyle='#111'; ctx.lineWidth=2; ctx.strokeRect(px+8,py+10,8,7); ctx.strokeRect(px+19,py+10,8,7); line(ctx,px+16,py+13,px+19,py+13);
  }
  ctx.fillStyle='#111';
  ctx.beginPath();
  ctx.arc(px+12,py+12,3.8,0,Math.PI*2);
  ctx.arc(px+21,py+12,3.8,0,Math.PI*2);
  ctx.fill();
  if(['cosmic','crystal','lava'].includes(h.shape)){ ctx.fillStyle=s.hi; ctx.beginPath(); ctx.arc(px+12,py+12,1.6,0,Math.PI*2); ctx.arc(px+21,py+12,1.6,0,Math.PI*2); ctx.fill(); }
  ctx.fillStyle='#ff6680';
  ctx.fillRect(px+29,py+16,8,3);
  ctx.restore();
}
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
