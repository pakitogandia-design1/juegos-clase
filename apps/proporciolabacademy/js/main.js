import { CHALLENGES } from './data/challenges.js';
import { COLLECTIBLES } from './data/collectibles.js';
import { LOOT_BOXES } from './data/lootBoxes.js';
import { ACHIEVEMENTS } from './data/achievements.js';
import { ECONOMY } from './data/economy.js';

const root = document.getElementById('game-root');
const SAVE_KEY = ECONOMY.saveKey || 'proporciolab_academy_save_v1';
const state = loadState();
let currentChallenge = null;
let currentType = 'direct';
let currentResult = null;
let audioCtx = null;

const TYPES = {
  direct: { label:'Proporcionalidad directa', short:'Directa', icon:'↗↗', color:'green', machine:'Turbo Directa', key:'direct', max:60, phrase:'Van juntas: ↑ ↑' },
  inverse: { label:'Proporcionalidad inversa', short:'Inversa', icon:'↗↘', color:'orange', machine:'Inversor 3000', key:'inverse', max:60, phrase:'Van al contrario: ↑ ↓' },
  simple: { label:'Interés simple', short:'Simple', icon:'＋＋＋', color:'gold', machine:'Hucha Simple', key:'simple', max:45, phrase:'Suma igual cada periodo' },
  compound: { label:'Interés compuesto', short:'Compuesto', icon:'＋＋✦', color:'violet', machine:'Hucha Compuesta', key:'compound', max:45, phrase:'Crece sobre lo acumulado' },
  mixed: { label:'Desafío mixto', short:'Mixto', icon:'？', color:'blue', machine:'Elegir máquina', key:'mixed', max:50, phrase:'Primero descubre la máquina correcta' }
};
const RARITY_LABELS = { common:'Común', rare:'Raro', epic:'Épico', legendary:'Legendario' };
const RARITY_ICON = { common:'◆', rare:'✦', epic:'✧', legendary:'✹' };
const PET_VISUALS = {
  P01:{emoji:'📈', c1:'#4ba3ff', c2:'#43df9c', aura:'#7fe9c1'}, P02:{emoji:'⚖️', c1:'#ffad4d', c2:'#ff6b7a', aura:'#ffc27a'},
  P03:{emoji:'🪙', c1:'#ffd35c', c2:'#f1a522', aura:'#ffe8a0'}, P04:{emoji:'🌱', c1:'#43df9c', c2:'#168a65', aura:'#7ef0bd'},
  P05:{emoji:'💧', c1:'#4ba3ff', c2:'#7c5cff', aura:'#9bc2ff'}, P06:{emoji:'🧺', c1:'#c89c6d', c2:'#8a5b2c', aura:'#dfc09e'},
  P07:{emoji:'🪴', c1:'#ff8f66', c2:'#7a4b2f', aura:'#ffc0aa'}, P08:{emoji:'➕', c1:'#6ae2b0', c2:'#3aa6ff', aura:'#9df0d1'},
  P09:{emoji:'✨', c1:'#bd6cff', c2:'#4ba3ff', aura:'#d9a8ff'}, P10:{emoji:'🤖', c1:'#93a7c7', c2:'#4ba3ff', aura:'#c9d7ee'},
  P11:{emoji:'🧚', c1:'#ff9fd2', c2:'#bd6cff', aura:'#ffd0ec'}, P12:{emoji:'⏰', c1:'#ffad4d', c2:'#4ba3ff', aura:'#ffd19b'},
  P13:{emoji:'⚙️', c1:'#90a5c4', c2:'#59769b', aura:'#c7d5e9'}, P14:{emoji:'💦', c1:'#61c6ff', c2:'#3d79ff', aura:'#b4e5ff'},
  P15:{emoji:'🐷', c1:'#ff9eb6', c2:'#f06ca0', aura:'#ffc5d5'}, P16:{emoji:'📊', c1:'#43df9c', c2:'#ffd35c', aura:'#b7f2d9'},
  P17:{emoji:'➗', c1:'#7c5cff', c2:'#4ba3ff', aura:'#b7a8ff'}, P18:{emoji:'✌️', c1:'#43df9c', c2:'#bd6cff', aura:'#c9f7e2'},
  P19:{emoji:'🌸', c1:'#ff9fd2', c2:'#ffd35c', aura:'#ffd9ee'}, P20:{emoji:'⚡', c1:'#ffd35c', c2:'#ff8a00', aura:'#ffe8a0'},
  P21:{emoji:'🌟', c1:'#bd6cff', c2:'#ffd35c', aura:'#ead0ff'}, P22:{emoji:'🐉', c1:'#43df9c', c2:'#2c6cff', aura:'#a7f3d0'},
  P23:{emoji:'🔥', c1:'#ff8a4d', c2:'#ffd35c', aura:'#ffd3b5'}, P24:{emoji:'🧠', c1:'#4ba3ff', c2:'#bd6cff', aura:'#cdd9ff'},
  P25:{emoji:'🌀', c1:'#43df9c', c2:'#bd6cff', aura:'#c7ffeb'}
};
const TYPE_TABS = [
  ['hat','Gorros'], ['pet','Mascotas'], ['background','Fondos'], ['badge','Insignias'], ['achievements','Logros']
];

function defaultState(){
  return {
    coins: ECONOMY.initialCoins ?? 0,
    streak: 0,
    completedChallenges: [],
    unlockedCollectibles: ['H01','P01','B01','G01'],
    newCollectibles: [],
    equipped: { hat:'H01', pet:'P01', background:'B01', badge:'G01' },
    achievements: [],
    pendingBoxes: { basic:0, advanced:0, elite:0, mastery:0 },
    stats: { relationsCorrect:0, noHints:0, withHints:0, boxesOpened:0, problemLabSolved:0, allMachines:[] },
    options: { sound:true, reducedMotion:false, largeText:false },
    lastType: 'direct'
  };
}
function loadState(){
  try{
    const raw = localStorage.getItem(SAVE_KEY);
    const base = defaultState();
    if(!raw) return base;
    const data = JSON.parse(raw);
    const merged = deepMerge(base, data);
    ensureDefaults(merged);
    return merged;
  }catch(e){ return defaultState(); }
}
function deepMerge(a,b){
  const out = Array.isArray(a) ? [...a] : {...a};
  for(const k in b){
    if(b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) && a[k]) out[k] = deepMerge(a[k], b[k]);
    else out[k] = b[k];
  }
  return out;
}
function ensureDefaults(s){
  const ids = new Set(COLLECTIBLES.map(x=>x.id));
  for(const id of ['H01','P01','B01','G01']) if(!s.unlockedCollectibles.includes(id)) s.unlockedCollectibles.push(id);
  if(!ids.has(s.equipped.hat) || !s.unlockedCollectibles.includes(s.equipped.hat)) s.equipped.hat='H01';
  if(!ids.has(s.equipped.pet) || !s.unlockedCollectibles.includes(s.equipped.pet)) s.equipped.pet='P01';
  if(!ids.has(s.equipped.background) || !s.unlockedCollectibles.includes(s.equipped.background)) s.equipped.background='B01';
  if(!ids.has(s.equipped.badge) || !s.unlockedCollectibles.includes(s.equipped.badge)) s.equipped.badge='G01';
}
function save(){ ensureDefaults(state); localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
function $(sel, el=document){ return el.querySelector(sel); }
function $all(sel, el=document){ return [...el.querySelectorAll(sel)]; }
function itemById(id){ return COLLECTIBLES.find(x=>x.id===id); }
function challengeById(id){ return CHALLENGES.find(x=>x.id===id); }
function isUnlocked(id){ return state.unlockedCollectibles.includes(id); }
function setScreen(html, cls='ambient'){
  root.innerHTML = `<main class="screen ${cls} ${state.options.reducedMotion?'reduced':''} ${state.options.largeText?'large-text':''}">${html}</main>`;
}
function topbar(title='ProporcioLab Academy', back=null){
  return `<div class="topbar"><div class="brand">${back?`<button class="btn small ghost" data-nav="${back}">← Volver</button>`:''} ${title}<small>Primero mira · luego conecta · después calcula</small></div><div class="status"><div class="pill coin">🪙 <span id="coin-count">${state.coins}</span> ProporCoins</div><button class="btn small ghost" data-nav="main">🏠 Inicio</button></div></div>`;
}
function attachNav(){
  $all('[data-nav]').forEach(b=>b.addEventListener('click',()=>{ sound('click'); navigate(b.dataset.nav); }));
}
function navigate(where){
  if(where==='main') showMain();
  if(where==='play') showPlayMenu();
  if(where==='shop') showShop();
  if(where==='collection') showCollection();
  if(where==='guide') showGuide();
  if(where==='problem') showProblemLab();
  if(where==='options') showOptions();
}
function toast(msg){
  const s = $('.screen'); if(!s) return;
  const el = document.createElement('div'); el.className='toast'; el.textContent=msg; s.appendChild(el);
  setTimeout(()=>el.remove(), 2100);
}
function sound(kind='click'){
  if(!state.options.sound) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
    const map = { click:[440,.035,.035], correct:[660,.08,.055], wrong:[220,.09,.045], coin:[880,.05,.05], box:[140,.18,.06], equip:[520,.08,.05], achievement:[760,.16,.05] };
    const [freq,dur,vol] = map[kind] || map.click;
    o.frequency.value = freq; o.type = 'sine'; g.gain.value = vol;
    o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + dur);
  }catch(e){}
}
function fmt(n){
  const num = Number(n);
  if(Math.abs(num - Math.round(num)) < .00001) return String(Math.round(num));
  return num.toFixed(2).replace('.', ',');
}
function parseAnswer(v){
  const m = String(v).replace(',', '.').match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : NaN;
}
function answerOk(user, correct, unit){
  const n = parseAnswer(user); if(Number.isNaN(n)) return false;
  const tolerance = unit === '€' || !Number.isInteger(correct) ? .05 : 0;
  return Math.abs(n - Number(correct)) <= tolerance;
}
function progress(type){
  if(type==='mixed') return state.completedChallenges.filter(id=>id.startsWith('M')).length;
  return state.completedChallenges.filter(id=>challengeById(id)?.type===type).length;
}
function getNextChallenge(type){
  let pool = CHALLENGES.filter(c=>c.type===type);
  if(type==='mixed') pool = CHALLENGES.filter(c=>c.type==='mixed');
  const notDone = pool.filter(c=>!state.completedChallenges.includes(c.id));
  const list = notDone.length ? notDone : pool;
  return list[Math.floor(Math.random()*list.length)];
}
function getSourceChallenge(c){
  return c.type==='mixed' ? challengeById(c.sourceId) || c : c;
}
function machineFor(type){ return TYPES[type]?.machine || 'Máquina visual'; }
function iconForItem(it){
  if(!it) return '？';
  if(it.type==='hat') return it.rarity==='legendary'?'👑':it.rarity==='epic'?'🎩':'🧢';
  if(it.type==='pet') return PET_VISUALS[it.id]?.emoji || (it.rarity==='legendary'?'🐉':it.rarity==='epic'?'🤖':'🐾');
  if(it.type==='background') return it.rarity==='legendary'?'🌌':it.rarity==='epic'?'🏛️':'🖼️';
  if(it.type==='badge') return it.rarity==='legendary'?'🏆':it.rarity==='epic'?'🥇':'🎖️';
  return '◆';
}
function petVisual(it){
  return PET_VISUALS[it?.id] || { emoji:'🐾', c1:'#4ba3ff', c2:'#7c5cff', aura:'#9bc2ff' };
}
function renderPetArt(it, extraClass=''){
  const v = petVisual(it);
  return `<div class="pet-bubble ${extraClass}" title="${it?.name||''}" style="--pet1:${v.c1};--pet2:${v.c2};--petAura:${v.aura};"><div class="pet-core"></div><div class="pet-emoji">${v.emoji}</div><div class="pet-spark">✦</div></div>`;
}
function drawAvatar(){
  const hat = itemById(state.equipped.hat); const pet = itemById(state.equipped.pet); const badge = itemById(state.equipped.badge);
  return `<div class="avatar-card"><div class="avatar"><div class="hat-shape" title="${hat?.name||''}"></div><div class="hair"></div><div class="head"></div><div class="eye l"></div><div class="eye r"></div><div class="smile"></div><div class="arm l"></div><div class="arm r"></div><div class="body"></div></div><div class="pet-slot">${renderPetArt(pet,'pet-main')}</div><div class="profile-label"><h2>Jugador/a ProporcioLab</h2><p>${badge?.name || 'Aprendiz visual'} · Mascota: ${pet?.name || 'Directín'} · Gorro: ${hat?.name || 'Gorra de Aprendiz'}</p></div></div>`;
}
function showMain(){
  const recType = state.lastType || 'direct';
  const rec = TYPES[recType] || TYPES.direct;
  setScreen(`${topbar('ProporcioLab Academy')}
    <section class="layout">
      <div class="avatar-zone">${drawAvatar()}</div>
      <aside class="panel menu-buttons">
        <div class="recommend"><b>Continuar recomendado:</b><br>${rec.label}<br><small>${progress(recType)}/${rec.max} completados</small></div>
        <button class="btn primary" data-action="continue">▶ Continuar</button>
        <button class="btn" data-nav="play">🎮 Jugar</button>
        <button class="btn violet" data-nav="problem">🔎 ProblemaLab</button>
        <button class="btn gold" data-nav="shop">🎁 Tienda</button>
        <button class="btn" data-nav="collection">🏛️ Colección</button>
        <button class="btn ghost" data-nav="guide">📘 Guía visual</button>
        <button class="btn ghost" data-nav="options">⚙ Opciones</button>
      </aside>
    </section>`);
  attachNav();
  $('[data-action="continue"]').addEventListener('click',()=>startChallenge(recType));
}
function showPlayMenu(){
  const cards = Object.values(TYPES).map(t=>`<div class="zone-card" data-type="${t.key}"><div class="zone-icon">${t.icon}</div><h3>${t.label}</h3><p>${t.phrase}</p><div class="progress"><span style="width:${Math.min(100,progress(t.key)/t.max*100)}%"></span></div><p><b>${progress(t.key)}/${t.max}</b> completados</p></div>`).join('');
  setScreen(`${topbar('Jugar','main')}<section class="full-layout"><h1 class="screen-title">Elige una zona de retos</h1><p class="screen-sub">Cada zona entrena una forma diferente de ver las relaciones.</p><div class="grid cards scroll">${cards}<div class="zone-card" data-random="1"><div class="zone-icon">🎲</div><h3>Reto rápido</h3><p>El laboratorio elige una misión sorpresa.</p></div></div></section>`);
  attachNav();
  $all('[data-type]').forEach(c=>c.addEventListener('click',()=>startChallenge(c.dataset.type)));
  $('[data-random]').addEventListener('click',()=>startChallenge(['direct','inverse','simple','compound','mixed'][Math.floor(Math.random()*5)]));
}
function startChallenge(type, challenge=null, fromProblem=false){
  currentType = type; state.lastType = type; save();
  currentChallenge = challenge || getNextChallenge(type);
  currentResult = { hints:0, firstTry:true, relationCorrect:false, machineActivated:false, fromProblemLab:fromProblem, phase:'relation' };
  showChallenge();
}
function machineVisual(c){
  const src = getSourceChallenge(c); const t = src.type;
  if(t==='direct') return `<div class="bars"><div class="bar" style="height:90px"></div><div class="bar" style="height:150px"></div></div><div class="machine-row"><span class="data-chip">${src.a1} ${src.aLabel}</span> → <span class="data-chip">${fmt(src.b1)} ${src.bLabel}</span> → <span class="data-chip">${src.a2} ${src.aLabel}</span> → <span class="data-chip">?</span></div>`;
  if(t==='inverse') return `<div class="bars"><div class="bar orange" style="height:150px"></div><div class="bar orange" style="height:80px"></div></div><div class="machine-row"><span class="data-chip">${src.a1} ${src.aLabel}</span> × <span class="data-chip">${fmt(src.b1)} ${src.bLabel}</span> = trabajo total</div>`;
  if(t==='simple') return `<div class="bars"><div class="bar" style="height:80px"></div><div class="bar" style="height:105px"></div><div class="bar" style="height:130px"></div></div><div class="machine-row"><span class="data-chip">${fmt(src.capital)} €</span> + intereses iguales</div>`;
  return `<div class="bars"><div class="bar violet" style="height:80px"></div><div class="bar violet" style="height:115px"></div><div class="bar violet" style="height:165px"></div></div><div class="machine-row"><span class="data-chip">${fmt(src.capital)} €</span> × crecimiento acumulado</div>`;
}
function showChallenge(){
  const c = currentChallenge; const src = getSourceChallenge(c); const mixed = c.type==='mixed';
  const title = mixed ? 'Desafío mixto' : TYPES[src.type].label;
  const relationPrompt = mixed ? '¿Qué máquina usarías para esta misión?' : src.senseQuestion || '¿Qué ocurre en esta situación?';
  const choices = mixed ? [['direct','Turbo Directa'],['inverse','Inversor 3000'],['simple','Hucha Simple'],['compound','Hucha Compuesta']] : (src.type==='direct' || src.type==='inverse' ? [['aumenta','La otra aumenta'],['disminuye','La otra disminuye'],['igual','No cambia']] : [['capital inicial','Capital inicial'],['total acumulado','Total acumulado'],['no sé','No lo sé']]);
  setScreen(`${topbar(title,'play')}<section class="challenge-layout"><div class="panel mission"><div><h1 class="screen-title">${c.title}</h1><p class="story">${c.story}</p></div><div class="visual-machine">${machineVisual(c)}</div><div class="feedback" id="challenge-feedback">Observa la situación antes de calcular.</div></div><aside class="panel"><h2>${relationPrompt}</h2><div class="choice-row" id="choices">${choices.map(([v,l])=>`<button class="btn ghost" data-choice="${v}">${l}</button>`).join('')}</div><hr style="border-color:rgba(255,255,255,.1);margin:18px 0"><div id="solve-panel"><button class="btn" data-action="hint">💡 Pista</button></div></aside></section>`);
  attachNav();
  $all('[data-choice]').forEach(b=>b.addEventListener('click',()=>handleChoice(b.dataset.choice)));
  $('[data-action="hint"]').addEventListener('click',hint);
}
function handleChoice(v){
  const c = currentChallenge; const src = getSourceChallenge(c); let ok;
  if(c.type==='mixed') ok = v === src.type;
  else ok = (v === src.senseAnswer);
  if(ok){
    currentResult.relationCorrect = true; currentResult.machineActivated = true; sound('correct');
    $('#challenge-feedback').className='feedback good'; $('#challenge-feedback').textContent = `Correcto. Máquina activada: ${TYPES[src.type].machine}.`;
    renderSolvePanel();
  } else {
    currentResult.firstTry = false; sound('wrong');
    $('#challenge-feedback').className='feedback warn';
    $('#challenge-feedback').textContent = c.type==='mixed' ? `Casi. Mira si es ↑↑, ↑↓ o interés. La máquina correcta ayuda a ordenar el problema.` : 'Casi. Revisa el sentido de la relación antes de calcular.';
  }
}
function renderSolvePanel(){
  const c = currentChallenge; const src = getSourceChallenge(c);
  let steps = '';
  if(src.type==='direct') steps = `<p><b>Paso 1:</b> ${fmt(src.b1)} ÷ ${src.a1} = ${fmt(src.b1/src.a1)}</p><p><b>Paso 2:</b> ${fmt(src.b1/src.a1)} × ${src.a2} = ?</p>`;
  else if(src.type==='inverse') steps = `<p><b>Paso 1:</b> ${src.a1} × ${fmt(src.b1)} = ${fmt(src.a1*src.b1)}</p><p><b>Paso 2:</b> ${fmt(src.a1*src.b1)} ÷ ${src.a2} = ?</p>`;
  else if(src.type==='simple') steps = `<p><b>Paso 1:</b> ${fmt(src.rate)}% de ${fmt(src.capital)} € = ${fmt(src.capital*src.rate/100)} €</p><p><b>Paso 2:</b> sumar ese interés durante ${src.time} años.</p>`;
  else steps = `<p><b>Paso:</b> ${fmt(src.capital)} × (1 + ${fmt(src.rate)}/100)<sup>${src.time}</sup></p><p>Año a año, cada total genera nuevos intereses.</p>`;
  $('#solve-panel').innerHTML = `${steps}<label class="field"><span>Respuesta</span><input class="answer-input" id="answer" placeholder="Escribe el resultado" /></label><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px"><button class="btn primary" data-action="check">Comprobar</button><button class="btn ghost" data-action="hint">💡 Pista</button></div>`;
  $('[data-action="check"]').addEventListener('click',checkAnswer);
  $('[data-action="hint"]').addEventListener('click',hint);
}
function hint(){
  currentResult.hints = Math.min(3, currentResult.hints+1); sound('click');
  const src = getSourceChallenge(currentChallenge);
  const hints = {
    direct: ['Pista de sentido: si aumenta la primera cantidad, el resultado debe aumentar.', 'Coloca los datos en parejas: cantidad inicial → resultado inicial; cantidad nueva → ?', 'Primero calcula 1 unidad. Después multiplica por la cantidad nueva.'],
    inverse: ['Pista de sentido: más recursos suelen reducir el tiempo.', 'Piensa en trabajo total: recursos × tiempo.', 'Divide el trabajo total entre los nuevos recursos.'],
    simple: ['Pista: en interés simple se suma siempre lo mismo.', 'Calcula el porcentaje sobre el capital inicial.', 'Multiplica el interés de un año por el número de años y suma al capital.'],
    compound: ['Pista: en compuesto el total cambia cada año.', 'Cada año multiplica por 1 + porcentaje/100.', 'Usa el total nuevo para el año siguiente.']
  };
  $('#challenge-feedback').className='feedback warn';
  $('#challenge-feedback').textContent = hints[src.type][currentResult.hints-1] || hints[src.type][2];
}
function checkAnswer(){
  const src = getSourceChallenge(currentChallenge); const val = $('#answer').value;
  if(answerOk(val, src.answer, src.unit)){
    sound('correct'); completeChallenge();
  } else {
    currentResult.firstTry = false; sound('wrong');
    $('#challenge-feedback').className='feedback warn';
    $('#challenge-feedback').textContent = errorText(src.type);
  }
}
function errorText(type){
  return {
    direct:'Casi. En directa, si la nueva cantidad es mayor, el resultado debería ser mayor también.',
    inverse:'Casi. En inversa, al aumentar recursos, el tiempo suele bajar.',
    simple:'Casi. En interés simple se suma siempre el mismo interés.',
    compound:'Casi. En interés compuesto cada año parte del total acumulado anterior.'
  }[type] || 'Casi. Revisa la escena antes de cambiar números.';
}
function completeChallenge(){
  const c = currentChallenge; const src = getSourceChallenge(c);
  if(!state.completedChallenges.includes(c.id)) state.completedChallenges.push(c.id);
  state.streak += 1;
  if(currentResult.relationCorrect) state.stats.relationsCorrect += 1;
  if(currentResult.hints===0) state.stats.noHints += 1; else state.stats.withHints += 1;
  if(currentResult.fromProblemLab) state.stats.problemLabSolved += 1;
  if(!state.stats.allMachines.includes(src.type)) state.stats.allMachines.push(src.type);
  const reward = calcReward(currentResult);
  state.coins += reward.total;
  currentResult.reward = reward;
  currentResult.src = src;
  const newAchievements = checkAchievements();
  currentResult.achievements = newAchievements;
  save(); showResult();
}
function calcReward(r){
  let rows = [['Misión completada',25]];
  if(r.relationCorrect) rows.push(['Relación correcta',10]);
  if(r.machineActivated) rows.push(['Máquina activada',15]);
  if(r.firstTry) rows.push(['Acierto a la primera',10]);
  if(r.hints===0) rows.push(['Sin pistas',10]);
  if(state.streak>=2) rows.push(['Racha',5]);
  let total = rows.reduce((a,b)=>a+b[1],0);
  if(r.hints>0) { const pen = Math.min(15, r.hints*5); rows.push([`Pistas usadas (${r.hints})`,-pen]); total-=pen; }
  total = Math.max(25,total);
  return { rows, total };
}
function checkAchievements(){
  const unlocked=[];
  for(const a of ACHIEVEMENTS){
    if(state.achievements.includes(a.id)) continue;
    if(meets(a.condition)){
      state.achievements.push(a.id); unlocked.push(a);
      if(a.reward.coins) state.coins += a.reward.coins;
      if(a.reward.box) state.pendingBoxes[a.reward.box] = (state.pendingBoxes[a.reward.box]||0)+1;
      const badgeId = 'G'+a.id.slice(1).padStart(2,'0');
      if(COLLECTIBLES.some(c=>c.id===badgeId) && !state.unlockedCollectibles.includes(badgeId)) { state.unlockedCollectibles.push(badgeId); state.newCollectibles.push(badgeId); }
    }
  }
  return unlocked;
}
function meets(c){
  const completed = state.completedChallenges.map(challengeById).filter(Boolean);
  if(c.kind==='completedTotal') return state.completedChallenges.length >= c.value;
  if(c.kind==='completedType') return completed.filter(x=>x.type===c.type || (x.type==='mixed' && x.sourceType===c.type)).length >= c.value;
  if(c.kind==='completedInterest') return completed.filter(x=>['simple','compound'].includes(x.type) || (x.type==='mixed' && ['simple','compound'].includes(x.sourceType))).length >= c.value;
  if(c.kind==='relationsCorrect') return state.stats.relationsCorrect >= c.value;
  if(c.kind==='noHints') return state.stats.noHints >= c.value;
  if(c.kind==='withHints') return state.stats.withHints >= c.value;
  if(c.kind==='streak') return state.streak >= c.value;
  if(c.kind==='problemLabSolved') return state.stats.problemLabSolved >= c.value;
  if(c.kind==='boxesOpened') return state.stats.boxesOpened >= c.value;
  if(c.kind==='collectiblesUnlocked') return state.unlockedCollectibles.length >= c.value;
  if(c.kind==='allMachinesUsed') return ['direct','inverse','simple','compound'].every(t=>state.stats.allMachines.includes(t));
  return false;
}
function showResult(){
  const r = currentResult.reward; const src = currentResult.src;
  const rows = r.rows.map(x=>`<div class="result-row"><span>${x[0]}</span><b>${x[1]>0?'+':''}${x[1]}</b></div>`).join('');
  const ach = (currentResult.achievements||[]).map(a=>`<div class="result-row"><span>🏆 ${a.name}</span><b>${a.reward.coins?`+${a.reward.coins} monedas`:a.reward.box?'Caja obtenida':''}</b></div>`).join('');
  setScreen(`${topbar('Resultado','play')}<section class="full-layout"><div class="panel" style="max-width:760px;margin:auto;width:100%"><h1 class="screen-title">¡Reto completado!</h1><p class="screen-sub">${src.feedback||'Has resuelto la misión.'}</p><div class="result-list">${rows}<div class="result-row"><span>Total ganado</span><b class="coin">+${r.total} ProporCoins</b></div>${ach}</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:18px"><button class="btn primary" data-action="next">Siguiente reto</button><button class="btn gold" data-nav="shop">Ir a tienda</button><button class="btn ghost" data-nav="main">Menú</button></div></div></section>`);
  attachNav(); confetti();
  $('[data-action="next"]').addEventListener('click',()=>startChallenge(currentType));
}
function confetti(){
  if(state.options.reducedMotion) return;
  const s=$('.screen'); for(let i=0;i<36;i++){ const e=document.createElement('div'); e.className='confetti'; e.style.left=Math.random()*100+'%'; e.style.top='-20px'; e.style.background=['#43df9c','#ffd35c','#4ba3ff','#bd6cff'][i%4]; s.appendChild(e); e.animate([{transform:'translateY(0) rotate(0)'},{transform:`translateY(${720+Math.random()*120}px) rotate(${360+Math.random()*360}deg)`}],{duration:1200+Math.random()*900,easing:'cubic-bezier(.2,.6,.4,1)'}).onfinish=()=>e.remove(); }
}
function showShop(){
  const boxHtml = Object.values(LOOT_BOXES).map(b=>{
    const pending = b.earnedOnly ? (state.pendingBoxes[b.id]||0) : 0;
    const cost = b.earnedOnly ? (pending>0?`${pending} disponible(s)`:'Solo por logros') : `${b.cost} ProporCoins`;
    return `<div class="box-card rarity-${b.id==='elite'?'epic':b.id==='mastery'?'legendary':'rare'}" data-box="${b.id}"><div class="zone-icon">🎁</div><h3>${b.name}</h3><p>${b.description}</p><b class="coin">${cost}</b></div>`;
  }).join('');
  setScreen(`${topbar('Tienda de recompensas','main')}<section class="full-layout"><h1 class="screen-title">Abre cajas con tus ProporCoins</h1><p class="screen-sub">No hay compras reales. Todo se consigue jugando.</p><div class="grid cards">${boxHtml}</div></section>`);
  attachNav(); $all('[data-box]').forEach(c=>c.addEventListener('click',()=>confirmBox(c.dataset.box)));
}
function confirmBox(id){
  const b = LOOT_BOXES[id];
  if(b.earnedOnly && (state.pendingBoxes[id]||0)<=0) return toast('Esa caja se consigue con logros.');
  if(!b.earnedOnly && state.coins < b.cost) return toast('No tienes suficientes ProporCoins.');
  modal(`¿Abrir ${b.name}?`, `${b.earnedOnly?'Usarás una caja conseguida por logro.':`Coste: ${b.cost} ProporCoins.`}`, [ ['Cancelar',null,'ghost'], ['Abrir',()=>openBox(id),'gold'] ]);
}
function openBox(id){
  const b=LOOT_BOXES[id];
  if(b.earnedOnly) state.pendingBoxes[id]--; else state.coins -= b.cost;
  const reward = rollReward(id); state.stats.boxesOpened += 1; save();
  showLootBox(id, reward);
}
function rollRarity(odds){
  const n = Math.random()*100; let acc=0;
  for(const [r,p] of Object.entries(odds)){ acc+=p; if(n<=acc) return r; }
  return 'common';
}
function rollReward(boxId){
  const b=LOOT_BOXES[boxId]; let rarity = rollRarity(b.odds);
  let pool = COLLECTIBLES.filter(i=>i.rarity===rarity && !i.unlockDefault);
  let locked = pool.filter(i=>!state.unlockedCollectibles.includes(i.id));
  if(!locked.length){
    locked = COLLECTIBLES.filter(i=>!i.unlockDefault && !state.unlockedCollectibles.includes(i.id));
    if(locked.length) rarity = locked[Math.floor(Math.random()*locked.length)].rarity;
  }
  if(locked.length){
    const it = locked[Math.floor(Math.random()*locked.length)];
    state.unlockedCollectibles.push(it.id); state.newCollectibles.push(it.id); save();
    return { item:it, duplicate:false, refund:0 };
  }
  const it = pool[Math.floor(Math.random()*pool.length)] || COLLECTIBLES.find(x=>!x.unlockDefault);
  const refund = b.duplicateRefund[it.rarity] || 25; state.coins += refund; save();
  return { item:it, duplicate:true, refund };
}
function showLootBox(boxId, reward){
  const it=reward.item;
  setScreen(`${topbar('Apertura de caja','shop')}<section class="loot-stage"><div id="loot-content"><div class="crate"></div><h1>Preparando recompensa...</h1><p class="screen-sub">La caja está cargando energía.</p><button class="btn small ghost" data-action="skip">Saltar animación</button></div></section>`,'ambient');
  attachNav(); sound('box');
  const reveal = ()=>{ $('#loot-content').innerHTML = `<div class="panel reveal-card rarity-${it.rarity}"><div style="font-size:80px">${iconForItem(it)}</div><h1>${reward.duplicate?'Objeto repetido':'¡Nuevo objeto!'}</h1><h2>${it.name}</h2><p><b>${RARITY_LABELS[it.rarity]}</b> · ${it.description}</p>${reward.duplicate?`<p class="coin">Convertido en +${reward.refund} ProporCoins</p>`:`<p>Añadido a tu colección.</p>`}<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px"><button class="btn primary" data-action="equip">Equipar ahora</button><button class="btn gold" data-nav="shop">Abrir otra</button><button class="btn ghost" data-nav="collection">Colección</button></div></div>`; attachNav(); $('[data-action="equip"]').addEventListener('click',()=>{ equipItem(it.id); showMain(); }); sound(it.rarity==='legendary'?'achievement':'coin'); };
  $('[data-action="skip"]').addEventListener('click',reveal);
  if(!state.options.reducedMotion) setTimeout(reveal, 1600); else reveal();
}
function equipItem(id){
  const it=itemById(id); if(!it || !isUnlocked(id)) return toast('Objeto bloqueado.');
  if(it.type==='hat') state.equipped.hat=id;
  if(it.type==='pet') state.equipped.pet=id;
  if(it.type==='background') state.equipped.background=id;
  if(it.type==='badge') state.equipped.badge=id;
  state.newCollectibles = state.newCollectibles.filter(x=>x!==id); save(); sound('equip'); toast('Equipado');
}
function showCollection(tab='hat', selected=null){
  const tabs = TYPE_TABS.map(([id,l])=>`<button class="tab ${id===tab?'active':''}" data-tab="${id}">${l}</button>`).join('');
  let items = tab==='achievements' ? ACHIEVEMENTS.map(a=>({id:a.id,type:'achievement',name:a.name,description:a.description,rarity:state.achievements.includes(a.id)?'rare':'common'})) : COLLECTIBLES.filter(i=>i.type===tab);
  selected = selected || items[0]?.id;
  const cards = items.map(i=>{
    const unlocked = tab==='achievements'?state.achievements.includes(i.id):isUnlocked(i.id);
    const isNew = state.newCollectibles.includes(i.id);
    const equipped = Object.values(state.equipped).includes(i.id);
    return `<div class="collect-card rarity-${i.rarity} ${unlocked?'':'locked'}" data-item="${i.id}"><div class="obj-icon">${unlocked?iconForItem(i):'❔'}</div><b>${unlocked?i.name:'Aún no descubierto'}</b><br><small>${RARITY_LABELS[i.rarity]||''}</small>${isNew?'<span class="tag-new">Nuevo</span>':''}${equipped?'<span class="tag-new" style="left:8px;right:auto">Equipado</span>':''}</div>`;
  }).join('');
  const sel = items.find(i=>i.id===selected) || items[0]; const unlocked = sel && (tab==='achievements'?state.achievements.includes(sel.id):isUnlocked(sel.id));
  const detailVisual = !sel ? '' : !unlocked ? '<div style="font-size:92px;text-align:center">❔</div>' : sel.type==='pet' ? `<div class="pet-detail-stage">${renderPetArt(sel,'pet-preview')}</div>` : `<div style="font-size:92px;text-align:center">${iconForItem(sel)}</div>`;
  const detail = sel ? `<div class="panel detail-preview rarity-${sel.rarity}">${detailVisual}<h2>${unlocked?sel.name:'Objeto misterioso'}</h2><p>${unlocked?sel.description:'Abre cajas o completa logros para descubrirlo.'}</p><p><b>${RARITY_LABELS[sel.rarity]||''}</b></p>${tab!=='achievements'&&unlocked?`<button class="btn primary" data-equip="${sel.id}">Equipar</button>`:''}</div>` : '';
  setScreen(`${topbar('Colección','main')}<section class="full-layout"><div class="tabs">${tabs}</div><div class="collection-layout"><div class="collection-grid">${cards}</div>${detail}</div></section>`);
  attachNav(); $all('[data-tab]').forEach(b=>b.addEventListener('click',()=>showCollection(b.dataset.tab)));
  $all('[data-item]').forEach(b=>b.addEventListener('click',()=>showCollection(tab,b.dataset.item)));
  const eq=$('[data-equip]'); if(eq) eq.addEventListener('click',()=>{ equipItem(eq.dataset.equip); showCollection(tab, eq.dataset.equip); });
}
function showGuide(page='home'){
  const pages = {
    home: ['Guía visual','Consulta las máquinas cuando necesites recordar cómo funciona cada relación.', [['tutorial','Cómo se juega','Aprende el camino básico del laboratorio.'],['direct','Directa ↑↑','Si una cantidad sube, la otra también.'],['inverse','Inversa ↑↓','Si una cantidad sube, la otra baja.'],['simple','Interés simple','Cada periodo suma lo mismo.'],['compound','Interés compuesto','Crece sobre lo acumulado.'],['duel','Duelo de Huchas','Compara simple y compuesto.']]],
    tutorial: ['Cómo se juega','Aquí activas máquinas, resuelves misiones y ganas ProporCoins. Primero mira. Luego conecta. Después calcula.', []],
    direct: ['Directa ↑↑','Más macetas → más dinero. Primero llega a 1 unidad y después construye la nueva cantidad.', []],
    inverse: ['Inversa ↑↓','Más jardineros → menos tiempo. Calcula el trabajo total y repártelo entre los nuevos recursos.', []],
    simple: ['Interés simple','El interés se calcula siempre sobre el capital inicial. Cada año suma lo mismo.', []],
    compound: ['Interés compuesto','Cada año el interés se calcula sobre el total acumulado. Los intereses también generan intereses.', []],
    duel: ['Duelo de Huchas','Con el mismo capital, porcentaje y tiempo, la hucha compuesta acaba creciendo más.', []]
  };
  const p=pages[page]; const cards = p[2].map(x=>`<div class="guide-card" data-guide="${x[0]}"><h3>${x[1]}</h3><p>${x[2]}</p></div>`).join('');
  const extra = page==='home'?cards:`<div class="visual-machine">${page==='duel'?duelVisual():guideVisual(page)}</div><div style="display:flex;gap:10px;margin-top:16px"><button class="btn primary" data-action="practice">Probar un reto</button><button class="btn ghost" data-guide="home">Volver a guía</button></div>`;
  setScreen(`${topbar('Guía visual','main')}<section class="full-layout"><div class="panel"><h1 class="screen-title">${p[0]}</h1><p class="screen-sub">${p[1]}</p>${extra}</div></section>`);
  attachNav(); $all('[data-guide]').forEach(b=>b.addEventListener('click',()=>showGuide(b.dataset.guide)));
  const pr=$('[data-action="practice"]'); if(pr) pr.addEventListener('click',()=>startChallenge(['direct','inverse','simple','compound'].includes(page)?page:'mixed'));
}
function guideVisual(page){
  const map = {direct:'<div class="bars"><div class="bar" style="height:90px"></div><div class="bar" style="height:150px"></div></div><div class="machine-row">↑ ↑</div>', inverse:'<div class="bars"><div class="bar orange" style="height:150px"></div><div class="bar orange" style="height:75px"></div></div><div class="machine-row">↑ ↓</div>', simple:'<div class="machine-row"><span class="data-chip">100</span> +10 +10 +10</div>', compound:'<div class="machine-row"><span class="data-chip">100</span> → 110 → 121 → 133,10</div>' };
  return map[page] || '<div class="machine-row">Primero mira · luego conecta · después calcula</div>';
}
function duelVisual(){ return '<div class="machine-row"><span class="data-chip">Simple: 100 → 110 → 120 → 130</span><span class="data-chip">Compuesto: 100 → 110 → 121 → 133,10</span></div>'; }
function showProblemLab(){
  setScreen(`${topbar('ProblemaLab','main')}<section class="full-layout"><div class="panel"><h1 class="screen-title">Convierte un problema en una misión visual</h1><p class="screen-sub">Intentaré detectar los datos importantes. Si algo no queda bien, podrás corregirlo.</p><div class="field"><label>Escribe o pega el problema</label><textarea id="problemText" placeholder="Ejemplo: Si 4 jardineros tardan 12 horas, ¿cuánto tardarán 6?"></textarea></div><div style="display:flex;gap:10px;flex-wrap:wrap;margin:14px 0"><button class="btn small ghost" data-example="direct">Ejemplo directa</button><button class="btn small ghost" data-example="inverse">Ejemplo inversa</button><button class="btn small ghost" data-example="compound">Ejemplo interés</button></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><button class="btn primary" data-action="analyze">Analizar</button><button class="btn" data-action="guided">Crear con ayuda</button></div><div id="problemOut" style="margin-top:16px"></div></div></section>`);
  attachNav();
  const examples = { direct:'Si 5 sacos de sustrato cuestan 35 €, ¿cuánto costarán 12 sacos?', inverse:'Si 4 jardineros tardan 12 horas, ¿cuánto tardarán 6 jardineros?', compound:'500 € al 4% compuesto durante 3 años. ¿Cuánto habrá al final?' };
  $all('[data-example]').forEach(b=>b.addEventListener('click',()=>{$('#problemText').value=examples[b.dataset.example];}));
  $('[data-action="analyze"]').addEventListener('click',analyzeProblem);
  $('[data-action="guided"]').addEventListener('click',guidedProblem);
}
function analyzeProblem(){
  const text=$('#problemText').value.trim(); if(!text) return toast('Escribe un problema primero.');
  const nums = [...text.replace(/,/g,'.').matchAll(/\d+(\.\d+)?/g)].map(m=>Number(m[0]));
  let type = /compuesto|acumulado|reinviert/i.test(text) ? 'compound' : /simple/i.test(text) ? 'simple' : /(jardiner|person|grif|máquin|boquill|tardan|tiempo|horas|min|velocidad)/i.test(text) ? 'inverse' : 'direct';
  $('#problemOut').innerHTML = `<div class="feedback good">He encontrado estos números: ${nums.join(', ') || 'ninguno'}. Máquina sugerida: <b>${TYPES[type].machine}</b>.</div><div class="form-grid" style="margin-top:12px"><div class="field"><label>Tipo</label><select id="pType"><option value="direct">Directa</option><option value="inverse">Inversa</option><option value="simple">Interés simple</option><option value="compound">Interés compuesto</option></select></div><div></div><div class="field"><label>Dato 1</label><input id="pA1" value="${nums[0]||''}"></div><div class="field"><label>Dato asociado</label><input id="pB1" value="${nums[1]||''}"></div><div class="field"><label>Nuevo dato</label><input id="pA2" value="${nums[2]||''}"></div><div class="field"><label>Unidad respuesta</label><input id="pUnit" value="${type.includes('simple')||type.includes('compound')?'€':type==='inverse'?'h':'€'}"></div></div><button class="btn primary" style="margin-top:14px" data-action="launchProblem">Convertir en misión</button>`;
  $('#pType').value=type; $('[data-action="launchProblem"]').addEventListener('click',launchProblemFromFields);
}
function guidedProblem(){
  $('#problemOut').innerHTML = `<div class="form-grid"><div class="field"><label>Tipo</label><select id="pType"><option value="direct">Directa</option><option value="inverse">Inversa</option><option value="simple">Interés simple</option><option value="compound">Interés compuesto</option></select></div><div></div><div class="field"><label>Cantidad inicial / capital</label><input id="pA1" value="5"></div><div class="field"><label>Resultado asociado / porcentaje</label><input id="pB1" value="35"></div><div class="field"><label>Nueva cantidad / años</label><input id="pA2" value="12"></div><div class="field"><label>Unidad respuesta</label><input id="pUnit" value="€"></div></div><button class="btn primary" style="margin-top:14px" data-action="launchProblem">Convertir en misión</button>`;
  $('[data-action="launchProblem"]').addEventListener('click',launchProblemFromFields);
}
function launchProblemFromFields(){
  const type=$('#pType').value, a1=Number($('#pA1').value.replace(',','.')), b1=Number($('#pB1').value.replace(',','.')), a2=Number($('#pA2').value.replace(',','.')), unit=$('#pUnit').value||'€';
  let ch;
  if(type==='simple' || type==='compound'){
    const capital=a1, rate=b1, time=a2; const ans = type==='simple'? capital+capital*rate*time/100 : capital*Math.pow(1+rate/100,time);
    ch={id:'PL'+Date.now(), type, title:'ProblemaLab', story:`${fmt(capital)} € al ${fmt(rate)}% ${type==='simple'?'simple':'compuesto'} durante ${time} años. ¿Total final?`, capital, rate, time, answer:Number(ans.toFixed(2)), unit:'€', machine:machineFor(type), feedback:'ProblemaLab convertido en misión visual.'};
  }else{
    const ans= type==='direct'? b1*a2/a1 : a1*b1/a2;
    ch={id:'PL'+Date.now(), type, title:'ProblemaLab', story:`${fmt(a1)} unidades → ${fmt(b1)} ${unit}. ${fmt(a2)} unidades → ? ${unit}`, aLabel:'unidades', bLabel:unit, a1,b1,a2, answer:Number(ans.toFixed(2)), unit, machine:machineFor(type), senseAnswer:type==='direct'?'aumenta':'disminuye', senseQuestion:'¿Qué ocurre cuando aumenta la primera cantidad?', feedback:'ProblemaLab convertido en misión visual.'};
  }
  startChallenge(type, ch, true);
}
function showOptions(){
  setScreen(`${topbar('Opciones','main')}<section class="full-layout"><div class="panel" style="max-width:620px;margin:auto;width:100%"><h1 class="screen-title">Opciones</h1><div class="result-list"><button class="btn ghost" data-opt="sound">Sonido: ${state.options.sound?'Activado':'Desactivado'}</button><button class="btn ghost" data-opt="reducedMotion">Reducir animaciones: ${state.options.reducedMotion?'Activado':'Desactivado'}</button><button class="btn ghost" data-opt="largeText">Texto grande: ${state.options.largeText?'Activado':'Desactivado'}</button><button class="btn" data-action="full">Pantalla completa</button><button class="btn orange" data-action="credits">Sobre el juego</button><button class="btn" style="background:linear-gradient(#ff7a88,#c8364c)" data-action="reset">Borrar progreso</button></div></div></section>`);
  attachNav();
  $all('[data-opt]').forEach(b=>b.addEventListener('click',()=>{ state.options[b.dataset.opt]=!state.options[b.dataset.opt]; save(); showOptions(); }));
  $('[data-action="full"]').addEventListener('click',()=>document.documentElement.requestFullscreen?.());
  $('[data-action="credits"]').addEventListener('click',()=>modal('Sobre el juego','ProporcioLab Academy es un juego educativo para aprender a ver relaciones antes de calcular. Creado para trabajar proporcionalidad directa, inversa e interés simple y compuesto.',[['Cerrar',null,'primary']]));
  $('[data-action="reset"]').addEventListener('click',()=>modal('Borrar progreso','Esta acción eliminará monedas, colección y retos completados.',[['Cancelar',null,'ghost'],['Borrar',()=>{localStorage.removeItem(SAVE_KEY); location.reload();},'orange']]));
}
function modal(title, body, buttons){
  const s=$('.screen'); const m=document.createElement('div'); m.className='modal-back';
  m.innerHTML=`<div class="modal"><h2>${title}</h2><p>${body}</p><div style="display:flex;gap:10px;justify-content:flex-end">${buttons.map((b,i)=>`<button class="btn ${b[2]||''}" data-modal-btn="${i}">${b[0]}</button>`).join('')}</div></div>`;
  s.appendChild(m);
  buttons.forEach((b,i)=>m.querySelector(`[data-modal-btn="${i}"]`).addEventListener('click',()=>{ sound('click'); m.remove(); if(b[1]) b[1](); }));
}
function validateData(){
  const warnings=[];
  const chIds = new Set(); for(const c of CHALLENGES){ if(chIds.has(c.id)) warnings.push('ID de reto duplicado: '+c.id); chIds.add(c.id); }
  const coIds = new Set(); for(const c of COLLECTIBLES){ if(coIds.has(c.id)) warnings.push('ID de coleccionable duplicado: '+c.id); coIds.add(c.id); }
  for(const b of Object.values(LOOT_BOXES)){ const sum=Object.values(b.odds).reduce((a,n)=>a+n,0); if(sum!==100) warnings.push('Probabilidades incorrectas: '+b.id); }
  return warnings;
}
const warnings = validateData();
if(warnings.length) console.warn('ProporcioLab data warnings:', warnings);
showMain();
