/* Raíces Cruzadas V1 - juego HTML autónomo */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const APP_KEY = 'raices_cruzadas_v1_save';
const WORDS = (window.RC_WORDS || []).map(w => ({...w, answer: normalizeAnswer(w.answer || w.display)}));
const WORLDS = ['Mundo Verde','Matemon','Series','Sagas','Videojuegos','Extras','Multiverso'];
const WORLD_CATS = groupBy(WORDS, 'world');
const CATEGORIES = [...new Set(WORDS.map(w=>w.category))].sort((a,b)=>a.localeCompare(b,'es'));
const RARITIES = ['Común','Rara','Épica','Legendaria','Prohibida'];
const SLOT_TYPES = ['hat','outfit','accessory','badge','frame','background'];
const WORLD_THEME = {'Mundo Verde':'theme-green','Matemon':'theme-matemon','Series':'theme-series','Sagas':'theme-sagas','Videojuegos':'theme-videogames','Extras':'theme-extras','Brainrot English':'theme-brainrot','Multiverso':'theme-multiverse'};
const DIFF = {
  relajado:{label:'Relajado', words:6, energy:8, base:25, perWord:5},
  normal:{label:'Normal', words:8, energy:6, base:45, perWord:6},
  dificil:{label:'Difícil', words:11, energy:4, base:70, perWord:8},
  boss:{label:'Boss', words:14, energy:5, base:120, perWord:10}
};
let state = loadSave();
let view = 'home';
let activeGame = null;
let selectedEntryId = null;
let lastRewards = null;

function normalizeAnswer(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/Ñ/g,'N').replace(/[^A-Z0-9]/g,'');}
function slug(s){return normalizeAnswer(s).toLowerCase();}
function rand(arr){return arr[Math.floor(Math.random()*arr.length)];}
function shuffle(a){a=[...a]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]} return a;}
function groupBy(arr, key){return arr.reduce((m,x)=>{const k=x[key]||'Otros';(m[k] ||= []).push(x);return m;},{});}
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
function today(){return new Date().toLocaleDateString('es-ES');}
function unique(arr){return [...new Set(arr)];}
function toast(msg){const t=$('#toast'); t.className='toast show'; t.textContent=msg; clearTimeout(toast._t); toast._t=setTimeout(()=>t.className='toast',2600);}
function save(){localStorage.setItem(APP_KEY, JSON.stringify(state));}
function defaultSave(){return {version:1,profile:{name:'Explorador/a',created:Date.now()},resources:{seeds:300,keys:3,forbiddenKeys:1,dust:0},codex:{unlocked:{},recent:[]},collection:{items:{},recent:[]},matemon:{owned:{},fragments:{}},wardrobe:{hat:null,outfit:null,accessory:null,badge:null,frame:null,background:null},achievements:{},albums:{claimed:{}},stats:{played:0,completed:0,perfect:0,boxes:0,expeditions:0,bosses:0,byCategory:{},byWorld:{}},settings:{sound:false,showLabels:true},history:[]};}
function loadSave(){try{const s=JSON.parse(localStorage.getItem(APP_KEY)); return repairSave({...defaultSave(),...s});}catch(e){return defaultSave();}}
function repairSave(s){
  const d=defaultSave(); s.resources={...d.resources,...(s.resources||{})}; s.wardrobe={...d.wardrobe,...(s.wardrobe||{})};
  s.codex={...d.codex,...(s.codex||{})}; s.collection={...d.collection,...(s.collection||{})}; s.matemon={...d.matemon,...(s.matemon||{})};
  s.achievements=s.achievements||{}; s.albums={...d.albums,...(s.albums||{})}; s.stats={...d.stats,...(s.stats||{})}; s.settings={...d.settings,...(s.settings||{})};
  for(const k of Object.keys(s.resources)) s.resources[k]=Math.max(0, Number(s.resources[k]||0));
  repairWardrobe(s); return s;
}
function repairWardrobe(s=state){const ids=new Set(getAllCollectionItems().map(i=>i.id)); for(const slot of SLOT_TYPES){const id=s.wardrobe?.[slot]; if(id && (!ids.has(id) || !s.collection.items[id] || getItemById(id)?.slot!==slot)) s.wardrobe[slot]=null;} save(); return s.wardrobe;}

function getAllCollectionItems(){
  if(getAllCollectionItems.cache) return getAllCollectionItems.cache;
  const base=[]; const worldIcons={'Mundo Verde':'🌿','Matemon':'✨','Series':'📺','Sagas':'🧙','Videojuegos':'🎮','Extras':'🌀','Multiverso':'🌈'};
  const slots=['hat','outfit','accessory','badge','frame','background'];
  for(const cat of CATEGORIES){
    const sample=WORDS.find(w=>w.category===cat); const world=sample?.world||'Extras'; const safe=slug(cat);
    base.push({id:`obj_${safe}_1`,name:`Insignia ${cat}`,world,category:cat,type:'colección',slot:'badge',rarity:'Común',icon:worldIcons[world]||'⭐',desc:`Recuerdo de la categoría ${cat}.`});
    base.push({id:`obj_${safe}_2`,name:`Fondo ${cat}`,world,category:cat,type:'armario',slot:'background',rarity:'Rara',icon:'🎴',desc:`Fondo temático inspirado en ${cat}.`});
    base.push({id:`obj_${safe}_3`,name:`Marco ${cat}`,world,category:cat,type:'armario',slot:'frame',rarity:'Épica',icon:'🖼️',desc:`Marco especial para el avatar.`});
  }
  const special=[
    ['hat','Sombrero de vivero','Mundo Verde','JardinerIA','🧢'],['outfit','Bata de laboratorio','Mundo Verde','CiencIA','🥼'],['accessory','Regadera mental','Mundo Verde','JardinerIA','💧'],
    ['hat','Gorra Bro','Extras','Brainrot English','🧢'],['outfit','Sudadera Chill','Extras','Brainrot English','🧥'],['badge','Pegatina Cringe','Extras','Brainrot English','😬'],
    ['hat','Casco Arcade','Videojuegos','Videojuegos','🎧'],['accessory','Mando Pixel','Videojuegos','Videojuegos','🕹️'],['badge','Cristal del Nexo','Videojuegos','League of Legends','💎'],
    ['hat','Sombrero de mago','Sagas','Harry Potter','🧙'],['accessory','Mapa épico','Sagas','El Señor de los Anillos','🗺️'],['badge','Sable estelar','Sagas','Star Wars','⚔️'],
    ['accessory','Taza sitcom','Series','Friends','☕'],['badge','Dundie escolar','Series','The Office US','🏆'],['hat','Peluca azul','Series','Los Simpsons','💙'],
    ['frame','Portal Multiverso','Multiverso','Multiverso','🌈'],['background','Glitch Prohibido','Multiverso','Multiverso','🕳️']
  ];
  for(let i=0;i<special.length;i++){const [slot,name,world,category,icon]=special[i];base.push({id:`special_${i}_${slug(name)}`,name,world,category,type:'armario',slot,rarity:i%5===0?'Legendaria':i%3===0?'Épica':'Rara',icon,desc:`Objeto equipable: ${name}.`});}
  return getAllCollectionItems.cache=base;
}
function getItemById(id){return getAllCollectionItems().find(i=>i.id===id);}
function ownedItems(){return getAllCollectionItems().filter(i=>state.collection.items[i.id]);}

function render(){
  document.body.className = activeGame ? (WORLD_THEME[activeGame.theme] || WORLD_THEME[activeGame.world] || '') : '';
  const app=$('#app'); app.className='app';
  app.innerHTML = `<header class="topbar"><div class="brand"><div class="logo">RC</div><div><h1>Raíces Cruzadas</h1><small>Crucigramas · Códex · Matemon · Multiverso</small></div></div><div class="resources">${resPills()}</div></header><div class="layout"><nav class="nav">${navBtn('home','Inicio')} ${navBtn('play','Jugar')} ${navBtn('expedition','Expedición')} ${navBtn('codex','Códex')} ${navBtn('collection','Colección')} ${navBtn('matemon','Matemonario')} ${navBtn('boxes','Cajas')} ${navBtn('shop','Tienda')} ${navBtn('wardrobe','Armario')} ${navBtn('achievements','Logros')} ${navBtn('profile','Perfil')} ${navBtn('options','Opciones')}</nav><main class="main">${route()}</main></div>`;
  bindGlobal();
}
function navBtn(id,label){return `<button data-view="${id}" class="${view===id?'active':''}">${label}</button>`;}
function resPills(){return `<span class="pill">🌱 ${state.resources.seeds}</span><span class="pill">🔑 ${state.resources.keys}</span><span class="pill">🗝️ ${state.resources.forbiddenKeys}</span><span class="pill">✨ ${state.resources.dust}</span>`;}
function bindGlobal(){$$('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view; activeGame=null; render();});}
function route(){return ({home:homeView,play:playView,game:gameView,summary:summaryView,expedition:expeditionView,codex:codexView,collection:collectionView,matemon:matemonView,boxes:boxesView,shop:shopView,wardrobe:wardrobeView,achievements:achievementsView,profile:profileView,options:optionsView}[view]||homeView)();}

function homeView(){
  const counts = `${WORDS.length} entradas · ${CATEGORIES.length} categorías · ${getAllCollectionItems().length} objetos · ${WORDS.filter(w=>w.world==='Matemon').length} Matemon`;
  return `<section class="hero"><div class="card"><div class="tag">V1 completa</div><div class="tag">Economía generosa</div><div class="tag">Pistas tipo definición</div><h2 class="bigtitle">Crucigramas con alma de Códex</h2><p class="muted">Resuelve palabras, desbloquea entradas, abre cajas, completa álbumes, mejora tu Matemonario y explora rutas con bosses. Las pistas están preparadas como definiciones de crucigrama: nada de inventarlas durante la partida.</p><p>${counts}</p><div class="controls"><button class="btn primary" onclick="view='play';render()">Empezar partida</button><button class="btn" onclick="view='expedition';render()">Ir a Expedición</button><button class="btn" onclick="showTutorial()">Tutorial</button></div></div><div class="card"><h3>Recomendado</h3>${recommendation()}<hr><h3>Últimos desbloqueos</h3>${recentList()}</div></section><div class="grid three"><div class="card"><h3>🧩 Crucigrama cómodo</h3><p class="muted">Selecciona palabra, lee la definición y escribe la respuesta completa. En móvil no tendrás que escribir casilla por casilla.</p></div><div class="card"><h3>🎁 Premios frecuentes</h3><p class="muted">Cada crucigrama completado da recursos y siempre acerca a abrir cajas. Los repetidos dan polvo o fragmentos.</p></div><div class="card"><h3>🛡️ Seguro anti-bugs</h3><p class="muted">Incluye reparación de progreso, armario blindado, exportar/importar y conversión de recursos.</p></div></div>`;
}
function recommendation(){
  const missingAlbums = albumStats().filter(a=>a.pct<100).sort((a,b)=>b.pct-a.pct);
  const a=missingAlbums[0];
  return `<p>Te recomiendo jugar <b>${a?.name||'Multiverso'}</b> para avanzar en colección.</p><button class="btn primary" onclick="quickStart('${a?.world||'Multiverso'}')">Jugar recomendado</button>`;
}
function recentList(){const r=state.collection.recent.slice(0,5).map(id=>getItemById(id)?.name||id); const c=state.codex.recent.slice(0,5).map(id=>WORDS.find(w=>w.id===id)?.display||id); return [...r,...c].slice(0,6).map(x=>`<span class="tag">${x}</span>`).join('') || '<p class="muted">Todavía no hay desbloqueos.</p>';}

function playView(){
  const worlds = WORLDS.map(w=>`<option value="${w}">${w}</option>`).join('');
  const cats = CATEGORIES.map(c=>`<option value="${c}">${c}</option>`).join('');
  return `<div class="card section-title"><div><h2>Jugar</h2><p class="muted">Elige categoría única, mundo mixto, multiverso o personalizado.</p></div></div><div class="grid two"><div class="card mode-card"><div><h3>Una categoría</h3><p class="muted">Crucigrama centrado en una categoría concreta.</p><div class="controls"><select id="singleCat">${cats}</select><select id="singleDiff">${diffOptions()}</select></div></div><button class="btn primary" onclick="startSingle()">Crear crucigrama</button></div><div class="card mode-card"><div><h3>Mundo mixto</h3><p class="muted">Mezcla categorías dentro de un mismo mundo.</p><div class="controls"><select id="worldSel">${worlds}</select><select id="worldDiff">${diffOptions()}</select></div></div><button class="btn primary" onclick="startWorldMix()">Crear mixto</button></div><div class="card mode-card"><div><h3>Multiverso</h3><p class="muted">Cruces entre mundo verde, Matemon, series, sagas, videojuegos y Brainrot.</p><div class="controls"><select id="multiDiff">${diffOptions()}</select></div></div><button class="btn primary" onclick="startMultiverse()">Abrir portal</button></div><div class="card mode-card"><div><h3>Personalizado</h3><p class="muted">Marca las categorías que quieres mezclar.</p><div class="controls"><select id="customDiff">${diffOptions()}</select><button class="btn" onclick="toggleAllCats(true)">Marcar todo</button><button class="btn" onclick="toggleAllCats(false)">Limpiar</button></div><div class="checkbox-grid" id="catChecks">${CATEGORIES.map(c=>`<label class="checkitem"><input type="checkbox" value="${c}"> ${c}</label>`).join('')}</div></div><button class="btn primary" onclick="startCustom()">Crear personalizado</button></div></div>`;
}
function diffOptions(){return Object.entries(DIFF).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('');}
window.toggleAllCats=(on)=>{$$('#catChecks input').forEach(x=>x.checked=on)};
window.quickStart=(world)=>{activeGame=createGame({mode:world==='Multiverso'?'multiverse':'world',world,difficulty:'normal'}); view='game'; render();};
window.startSingle=()=>{activeGame=createGame({mode:'single',category:$('#singleCat').value,difficulty:$('#singleDiff').value}); view='game'; render();};
window.startWorldMix=()=>{activeGame=createGame({mode:'world',world:$('#worldSel').value,difficulty:$('#worldDiff').value}); view='game'; render();};
window.startMultiverse=()=>{activeGame=createGame({mode:'multiverse',difficulty:$('#multiDiff').value}); view='game'; render();};
window.startCustom=()=>{const cats=$$('#catChecks input:checked').map(x=>x.value); if(cats.length<2) return toast('Marca al menos 2 categorías.'); activeGame=createGame({mode:'custom',categories:cats,difficulty:$('#customDiff').value}); view='game'; render();};

function wordPool(opts){
  let pool=WORDS.filter(w=>w.playable && w.answer.length>=3 && w.answer.length<=22 && /^[A-Z0-9]+$/.test(w.answer));
  const maxLen = opts.difficulty==='relajado'?12:opts.difficulty==='normal'?14:opts.difficulty==='dificil'?18:22;
  pool = pool.filter(w=>w.answer.length<=maxLen);
  if(opts.mode==='single') pool=pool.filter(w=>w.category===opts.category);
  if(opts.mode==='world') pool=pool.filter(w=> opts.world==='Multiverso' ? true : w.world===opts.world);
  if(opts.mode==='custom') pool=pool.filter(w=>opts.categories.includes(w.category));
  if(opts.mode==='multiverse') pool=pool.filter(w=>['Mundo Verde','Matemon','Series','Sagas','Videojuegos','Extras'].includes(w.world));
  const d=DIFF[opts.difficulty]||DIFF.normal; pool=pool.filter(w=> w.difficulty <= (opts.difficulty==='relajado'?2:opts.difficulty==='normal'?3:4));
  return pool;
}
function createGame(opts){
  const d=DIFF[opts.difficulty]||DIFF.normal; let pool=wordPool(opts);
  if(pool.length<5) pool=WORDS.filter(w=>w.answer.length>=3 && w.answer.length<=16);
  let target=d.words; let grid=null, chosen=[];
  for(let size of [19,21,23,25]){
    for(let tries=0;tries<60;tries++){
      chosen=smartPick(pool,target,opts); grid=generateCrossword(chosen,size);
      if(grid && grid.entries.length>=Math.min(5,target-1)) break;
    }
    if(grid && grid.entries.length>=Math.min(5,target-1)) break;
    target=Math.max(5,target-1);
  }
  if(!grid) { chosen=smartPick(pool,6,opts); grid=generateFallback(chosen,19); }
  const theme = opts.mode==='multiverse'?'Multiverso':opts.category==='Brainrot English'?'Brainrot English':opts.world || grid.entries[0]?.world || 'Mundo Verde';
  selectedEntryId=grid.entries[0]?.id;
  return {opts,theme,world:opts.world||theme,difficulty:opts.difficulty,energy:d.energy,concentration:6,grid,revealed:{},solved:{},mistakes:0,started:Date.now(),isExpedition:false};
}
function smartPick(pool,target,opts){
  const cats=unique(pool.map(w=>w.category)); let result=[];
  if(opts.mode==='multiverse' || opts.mode==='world' || opts.mode==='custom'){
    const by=groupBy(pool,'category'); for(const c of shuffle(cats)){ if(result.length>=target) break; const p=by[c].filter(w=>w.answer.length<=18); if(p.length) result.push(rand(p)); }
  }
  const rest=shuffle(pool.filter(w=>!result.includes(w))).sort((a,b)=>scoreWord(b)-scoreWord(a));
  return [...result,...rest].slice(0,target+4);
}
function scoreWord(w){const common='AEIOURSTLNCMPD'; return [...w.answer].filter(ch=>common.includes(ch)).length + Math.min(w.answer.length,12)/3 + Math.random()*3;}

function generateCrossword(words,size=21){
  words=shuffle(words).sort((a,b)=>b.answer.length-a.answer.length).slice(0,18);
  const grid=Array.from({length:size},()=>Array(size).fill(null)); const entries=[];
  function canPlace(word,r,c,dir){
    const letters=word.answer; if(dir==='H' && (c<0||c+letters.length>size)) return false; if(dir==='V' && (r<0||r+letters.length>size)) return false;
    let crosses=0;
    for(let i=0;i<letters.length;i++){
      const rr=r+(dir==='V'?i:0), cc=c+(dir==='H'?i:0); const existing=grid[rr][cc];
      if(existing && existing.char!==letters[i]) return false; if(existing) crosses++;
      if(!existing){
        const sides=dir==='H'?[[rr-1,cc],[rr+1,cc]]:[[rr,cc-1],[rr,cc+1]];
        for(const [sr,sc] of sides){ if(sr>=0&&sr<size&&sc>=0&&sc<size&&grid[sr][sc]) return false; }
      }
    }
    const before=dir==='H'?[r,c-1]:[r-1,c], after=dir==='H'?[r,c+letters.length]:[r+letters.length,c];
    for(const [rr,cc] of [before,after]) if(rr>=0&&rr<size&&cc>=0&&cc<size&&grid[rr][cc]) return false;
    return entries.length===0 || crosses>0;
  }
  function place(word,r,c,dir){ const idx=entries.length; for(let i=0;i<word.answer.length;i++){const rr=r+(dir==='V'?i:0), cc=c+(dir==='H'?i:0); grid[rr][cc] ||= {char:word.answer[i],entries:[]}; grid[rr][cc].entries.push(idx);} entries.push({...word,row:r,col:c,dir,number:0}); }
  const first=words[0]; if(!first) return null; place(first,Math.floor(size/2),Math.floor((size-first.answer.length)/2),'H');
  for(const w of words.slice(1)){
    let positions=[];
    for(let ei=0;ei<entries.length;ei++){const e=entries[ei]; for(let i=0;i<e.answer.length;i++){for(let j=0;j<w.answer.length;j++){ if(e.answer[i]===w.answer[j]){ const dir=e.dir==='H'?'V':'H'; const r=e.row+(e.dir==='V'?i:0)-(dir==='V'?j:0); const c=e.col+(e.dir==='H'?i:0)-(dir==='H'?j:0); positions.push({r,c,dir,score:Math.random()+j/100}); }}}}
    positions=shuffle(positions).sort((a,b)=>b.score-a.score); const p=positions.find(p=>canPlace(w,p.r,p.c,p.dir)); if(p) place(w,p.r,p.c,p.dir);
  }
  if(entries.length<4) return null;
  // crop
  let minR=size,maxR=0,minC=size,maxC=0; for(let r=0;r<size;r++)for(let c=0;c<size;c++)if(grid[r][c]){minR=Math.min(minR,r);maxR=Math.max(maxR,r);minC=Math.min(minC,c);maxC=Math.max(maxC,c)}
  const pad=1; minR=Math.max(0,minR-pad);minC=Math.max(0,minC-pad);maxR=Math.min(size-1,maxR+pad);maxC=Math.min(size-1,maxC+pad);
  const newGrid=[]; for(let r=minR;r<=maxR;r++) newGrid.push(grid[r].slice(minC,maxC+1)); entries.forEach(e=>{e.row-=minR;e.col-=minC});
  numberEntries(entries); return {cells:newGrid,entries,width:newGrid[0].length,height:newGrid.length};
}
function generateFallback(words,size=19){const entries=[]; const grid=Array.from({length:size},()=>Array(size).fill(null)); let r=1; for(const w of words.slice(0,6)){ if(r>=size-1) break; const c=1; for(let i=0;i<Math.min(w.answer.length,size-2);i++) grid[r][c+i]={char:w.answer[i],entries:[entries.length]}; entries.push({...w,row:r,col:c,dir:'H',number:entries.length+1}); r+=2;} return {cells:grid,entries,width:size,height:size};}
function numberEntries(entries){const ordered=[...entries].sort((a,b)=>a.row-b.row || a.col-b.col); let n=1; for(const e of ordered) e.number=n++;}

function gameView(){ if(!activeGame) return playView(); const g=activeGame.grid; const entries=g.entries; const selected=entries.find(e=>e.id===selectedEntryId)||entries[0];
  return `<div class="card section-title"><div><h2>${gameTitle(activeGame.opts)}</h2><p class="muted">Energía: ${'❤️'.repeat(activeGame.energy)} · Concentración: ${activeGame.concentration} · Resueltas: ${Object.keys(activeGame.solved).length}/${entries.length}</p></div><button class="btn" onclick="giveUpGame()">Salir y guardar recompensas parciales</button></div><div class="game-wrap"><div class="card board-card"><div class="crossword" style="grid-template-columns:repeat(${g.width},var(--cell))">${renderGrid(g)}</div></div><aside class="card"><div class="answerbox"><h3>${selected?`${selected.number}. ${selected.dir==='H'?'Horizontal':'Vertical'}`:'Selecciona una palabra'}</h3>${selected?`<p><span class="tag">${selected.category}</span> <span class="tag">${selected.answer.length} letras</span></p><p>${selected.clue}</p>${activeGame.revealed[`extra_${selected.id}`]?`<p class="muted"><b>Pista extra:</b> ${selected.clueExtra||selected.clue}</p>`:''}<p class="kbd">${maskedAnswer(selected)}</p><input id="answerInput" placeholder="Escribe la respuesta completa" autocomplete="off" ${activeGame.solved[selected.id]?'disabled':''}><div class="grid two"><button class="btn primary" onclick="checkAnswer()">Comprobar</button><button class="btn" onclick="revealLetter()">Revelar letra ✨2</button><button class="btn" onclick="extraClue()">Pista extra ✨1</button><button class="btn" onclick="patternHint()">Detector ✨1</button></div>`:''}</div><hr><h3>Pistas</h3><div class="clue-list">${entries.map(e=>renderClue(e)).join('')}</div></aside></div>`;
}
function gameTitle(o){if(o.mode==='single') return `Crucigrama: ${o.category}`; if(o.mode==='world') return `Mundo mixto: ${o.world}`; if(o.mode==='custom') return 'Crucigrama personalizado'; return 'Multiverso';}
function renderGrid(g){let html=''; for(let r=0;r<g.height;r++)for(let c=0;c<g.width;c++){const cell=g.cells[r][c]; if(!cell){html+=`<div class="cell block"></div>`; continue;} const entryIds=cell.entries.map(i=>g.entries[i].id); const primary=g.entries[cell.entries[0]]; const isSel=entryIds.includes(selectedEntryId); const solved=entryIds.some(id=>activeGame.solved[id]); const reveal=cellRevealed(r,c); const num=startingNumber(r,c); const char=(solved||reveal)?cell.char:''; html+=`<div class="cell ${isSel?'selected':''} ${solved?'locked':''} ${char?'filled':''}" onclick="selectCell(${r},${c})">${num?`<span class="num">${num}</span>`:''}${char}</div>`;} return html;}
function startingNumber(r,c){const e=activeGame.grid.entries.find(e=>e.row===r&&e.col===c); return e?.number||'';}
function cellRevealed(r,c){return !!activeGame.revealed[`cell_${r}_${c}`];}
window.selectCell=(r,c)=>{const cell=activeGame.grid.cells[r][c]; if(cell){selectedEntryId=activeGame.grid.entries[cell.entries[0]].id; render(); setTimeout(()=>$('#answerInput')?.focus(),0);}};
function renderClue(e){return `<div class="clue ${selectedEntryId===e.id?'active':''} ${activeGame.solved[e.id]?'done':''}" onclick="selectedEntryId='${e.id}';render()"><b>${e.number}. ${e.dir==='H'?'H':'V'}</b> ${state.settings.showLabels?`<span class="tag">${e.category}</span>`:''}<br>${e.clue}</div>`;}
function maskedAnswer(e){let s=''; for(let i=0;i<e.answer.length;i++){const pos=e.dir==='H'?[e.row,e.col+i]:[e.row+i,e.col]; s += (cellRevealed(...pos)||activeGame.solved[e.id]) ? e.answer[i] : '·';} return s;}
window.checkAnswer=()=>{const e=activeGame.grid.entries.find(x=>x.id===selectedEntryId); const input=normalizeAnswer($('#answerInput')?.value); if(!e) return; if(input===e.answer){solveEntry(e);} else {activeGame.energy--; activeGame.mistakes++; if(activeGame.energy<=0){finishGame(false); return;} toast('No encaja todavía. Pierdes 1 energía.'); render();}};
function solveEntry(e){activeGame.solved[e.id]=true; unlockWord(e); state.resources.seeds += 5; toast(`¡${e.display} resuelta! +5 semillas`); if(Object.keys(activeGame.solved).length>=activeGame.grid.entries.length) finishGame(true); else {selectedEntryId=(activeGame.grid.entries.find(x=>!activeGame.solved[x.id])||e).id; save(); render();}}
window.revealLetter=()=>{const e=activeGame.grid.entries.find(x=>x.id===selectedEntryId); if(!e||activeGame.concentration<2) return toast('No tienes concentración suficiente.'); const positions=[]; for(let i=0;i<e.answer.length;i++){const r=e.row+(e.dir==='V'?i:0),c=e.col+(e.dir==='H'?i:0); if(!cellRevealed(r,c)) positions.push([r,c]);} if(!positions.length) return toast('Ya está revelada.'); const [r,c]=rand(positions); activeGame.revealed[`cell_${r}_${c}`]=true; activeGame.concentration-=2; render();};
window.extraClue=()=>{const e=activeGame.grid.entries.find(x=>x.id===selectedEntryId); if(!e||activeGame.concentration<1) return toast('No tienes concentración suficiente.'); activeGame.revealed[`extra_${e.id}`]=true; activeGame.concentration--; render();};
window.patternHint=()=>{const e=activeGame.grid.entries.find(x=>x.id===selectedEntryId); const input=normalizeAnswer($('#answerInput')?.value); if(!e||activeGame.concentration<1) return toast('No tienes concentración suficiente.'); let ok=0; for(let i=0;i<Math.min(input.length,e.answer.length);i++) if(input[i]===e.answer[i]) ok++; activeGame.concentration--; toast(`${ok} letras están bien colocadas.`); render();};
window.giveUpGame=()=>finishGame(false);
function finishGame(completed){
  const g=activeGame; const solvedCount=Object.keys(g.solved).length; const diff=DIFF[g.difficulty]||DIFF.normal; const perfect=completed && g.mistakes===0;
  const mult=g.opts.mode==='multiverse'?1.2:1; const seeds=Math.round((solvedCount*diff.perWord + (completed?diff.base:10))*mult); const rewards={completed,perfect,seeds,keys:completed?1:0,forbiddenKeys:0,dust:0,items:[],matemon:[],achievements:[], expedition:g.isExpedition?g.expedition:null};
  if(perfect) rewards.keys++; if(g.difficulty==='dificil' && perfect && Math.random()<.1) rewards.forbiddenKeys++; if(g.difficulty==='boss'||g.opts.boss){rewards.forbiddenKeys++; state.stats.bosses++;}
  if(completed && g.opts.mode==='multiverse') rewards.items.push(grantRandomItem('Multiverso'));
  if(completed && Math.random()<.55) rewards.items.push(grantRandomItem(g.opts.world||g.theme));
  state.resources.seeds+=seeds; state.resources.keys+=rewards.keys; state.resources.forbiddenKeys+=rewards.forbiddenKeys; state.stats.played++; if(completed) state.stats.completed++; if(perfect) state.stats.perfect++;
  for(const e of g.grid.entries){ if(g.solved[e.id]) {state.stats.byCategory[e.category]=(state.stats.byCategory[e.category]||0)+1; state.stats.byWorld[e.world]=(state.stats.byWorld[e.world]||0)+1; }}
  rewards.achievements.push(...checkAchievements()); lastRewards=rewards; save(); activeGame=null; view='summary'; render();
}
function unlockWord(e){state.codex.unlocked[e.id]=Date.now(); state.codex.recent=[e.id,...state.codex.recent.filter(x=>x!==e.id)].slice(0,30); if(e.world==='Matemon') grantMatemon(e);}
function grantRandomItem(worldOrCat){let pool=getAllCollectionItems(); if(worldOrCat && worldOrCat!=='Multiverso') pool=pool.filter(i=>i.world===worldOrCat||i.category===worldOrCat); if(!pool.length) pool=getAllCollectionItems(); const newOnes=pool.filter(i=>!state.collection.items[i.id]); const item=rand(newOnes.length?newOnes:pool); grantItem(item); return item;}
function grantItem(item){if(!item) return null; if(state.collection.items[item.id]) state.resources.dust += dustFor(item.rarity); else {state.collection.items[item.id]=Date.now(); state.collection.recent=[item.id,...state.collection.recent.filter(x=>x!==item.id)].slice(0,40);} return item;}
function grantMatemon(e){ if(!state.matemon.owned[e.id]) {state.matemon.owned[e.id]=Date.now();} else {state.matemon.fragments[e.id]=(state.matemon.fragments[e.id]||0)+1;} }
function dustFor(r){return r?.includes('Legend')?150:r?.includes('Épic')?60:r?.includes('Rar')?25:10;}
function checkAchievements(){const got=[]; const add=(id,name,desc,reward=100)=>{if(!state.achievements[id]){state.achievements[id]={name,desc,date:Date.now()}; state.resources.seeds+=reward; got.push({name,desc,reward});}}; add('first_game','Primeras raíces','Juega tu primer crucigrama.',50); if(state.stats.completed>=1) add('first_complete','Códex iniciado','Completa tu primer crucigrama.',100); if(state.stats.perfect>=1) add('first_perfect','Sin una hoja fuera','Completa un crucigrama perfecto.',120); if(Object.keys(state.matemon.owned).length>=1) add('first_matemon','Primer Matemon','Desbloquea tu primer Matemon.',150); if(Object.keys(state.collection.items).length>=10) add('ten_items','Coleccionista inicial','Consigue 10 objetos.',150); if(state.resources.forbiddenKeys>=1) add('forbidden_key','Llave prohibida','Consigue una llave prohibida.',100); return got;}
function summaryView(){const r=lastRewards; if(!r) return homeView(); return `<div class="card"><h2>${r.completed?'¡Crucigrama completado!':'Fin de la partida'}</h2><p class="muted">Resumen de recompensas y progreso.</p><div class="grid three"><div class="reward"><b>🌱 Semillas</b><span>+${r.seeds}</span></div><div class="reward"><b>🔑 Llaves</b><span>+${r.keys}</span></div><div class="reward"><b>🗝️ Prohibidas</b><span>+${r.forbiddenKeys}</span></div></div>${r.items.length?`<h3>Objetos</h3><div class="items">${r.items.map(itemCard).join('')}</div>`:''}${r.achievements.length?`<h3>Logros</h3>${r.achievements.map(a=>`<div class="reward"><b>${a.name}</b><span>+${a.reward} 🌱</span></div>`).join('')}`:''}<hr><div class="controls">${r.expedition&&r.expedition.node<5?`<button class="btn primary" onclick="continueExpedition()">Continuar expedición</button>`:`<button class="btn primary" onclick="view='play';render()">Jugar otra</button>`}<button class="btn" onclick="view='boxes';render()">Abrir cajas</button><button class="btn" onclick="view='collection';render()">Ver colección</button></div></div>`;}


window.continueExpedition=()=>{ if(!lastRewards?.expedition) return; const e=lastRewards.expedition; const map={'Ruta Verde':'Mundo Verde','Ruta Matemon':'Matemon','Ruta Series':'Series','Ruta Sagas':'Sagas','Ruta Videojuegos':'Videojuegos','Ruta Multiverso':'Multiverso','Ruta Prohibida':'Extras'}; showExpeditionNode(e.route,map[e.route]||'Multiverso',e.node+1);};

function expeditionView(){
  const routes=['Ruta Verde','Ruta Matemon','Ruta Series','Ruta Sagas','Ruta Videojuegos','Ruta Multiverso','Ruta Prohibida'];
  return `<div class="card"><h2>Expedición</h2><p class="muted">Ruta con crucigramas, eventos, descanso, tienda ambulante y boss. El boss siempre da llave prohibida.</p></div><div class="grid three">${routes.map(r=>`<div class="card mode-card"><div><h3>${r}</h3><p class="muted">5 nodos + boss. Premios reforzados y eventos especiales.</p></div><button class="btn primary" onclick="startExpedition('${r}')">Iniciar</button></div>`).join('')}</div>`;
}
window.startExpedition=(route)=>{state.stats.expeditions++; const map={'Ruta Verde':'Mundo Verde','Ruta Matemon':'Matemon','Ruta Series':'Series','Ruta Sagas':'Sagas','Ruta Videojuegos':'Videojuegos','Ruta Multiverso':'Multiverso','Ruta Prohibida':'Extras'}; const world=map[route]||'Multiverso'; showExpeditionNode(route,world,1);};
function showExpeditionNode(route,world,node){const boss=node>=5; const event=!boss && Math.random()<.35; if(event){const gained=80+node*20; state.resources.seeds+=gained; save(); modal(`<h2>Evento: ${rand(['Fuente de semillas','Mercader ambulante','Biblioteca perdida','Portal Matemon','Cruce raro'])}</h2><p>Has encontrado un evento favorable durante ${route}.</p><div class="reward"><b>Recompensa</b><span>+${gained} 🌱</span></div><button class="btn primary" onclick="closeModal();showExpeditionNode('${route}','${world}',${node+1})">Continuar</button>`); return;} activeGame=createGame({mode:world==='Multiverso'?'multiverse':'world',world,difficulty:boss?'boss':'normal',boss}); activeGame.isExpedition=true; activeGame.expedition={route,node}; view='game'; render();};

function codexView(){const unlocked=Object.keys(state.codex.unlocked).length; return `<div class="card section-title"><div><h2>Códex</h2><p class="muted">${unlocked}/${WORDS.length} entradas desbloqueadas. Por defecto se muestran conseguidas.</p></div><div class="controls"><select id="codexFilter" onchange="render()"><option value="owned">Conseguidos</option><option value="recent">Recientes</option><option value="all">Todo</option>${WORLDS.map(w=>`<option value="world:${w}">${w}</option>`).join('')}</select><input id="codexSearch" placeholder="Buscar" oninput="render()"></div></div>${renderCodexList()}`;}
function renderCodexList(){let filter=$('#codexFilter')?.value||'owned', q=normalizeAnswer($('#codexSearch')?.value||''); let list=WORDS; if(filter==='owned') list=list.filter(w=>state.codex.unlocked[w.id]); if(filter==='recent') list=state.codex.recent.map(id=>WORDS.find(w=>w.id===id)).filter(Boolean); if(filter.startsWith('world:')) list=list.filter(w=>w.world===filter.slice(6)); if(q) list=list.filter(w=>normalizeAnswer(w.display).includes(q)||normalizeAnswer(w.category).includes(q)); return `<div class="items">${list.slice(0,300).map(w=>`<div class="item"><div class="rarebar"></div><b>${state.codex.unlocked[w.id]?w.display:'???'}</b><p><span class="tag">${w.category}</span></p><p class="muted small">${state.codex.unlocked[w.id]?w.clue:'Entrada todavía no desbloqueada.'}</p></div>`).join('')}</div>`;}

function collectionView(){return `<div class="card"><h2>Colección</h2><p class="muted">Álbumes por mundo. Cada hito da recompensas.</p>${albumStats().map(albumBlock).join('')}</div><div class="items">${ownedItems().map(itemCard).join('') || '<p class="muted">Aún no tienes objetos.</p>'}</div>`;}
function albumStats(){return WORLDS.map(w=>{const items=getAllCollectionItems().filter(i=>i.world===w || (w==='Multiverso'&&i.world==='Multiverso')); const owned=items.filter(i=>state.collection.items[i.id]).length; return {name:w,world:w,total:items.length,owned,pct:items.length?Math.round(owned/items.length*100):0};}).filter(a=>a.total);}
function albumBlock(a){return `<div class="reward"><div style="flex:1"><b>${a.name}</b><div class="progressbar"><span style="width:${a.pct}%"></span></div><span class="muted small">${a.owned}/${a.total} · ${a.pct}%</span></div><button class="btn" onclick="claimAlbum('${a.world}')">Reclamar hitos</button></div>`;}
window.claimAlbum=(world)=>{const a=albumStats().find(x=>x.world===world); if(!a) return; const marks=[10,25,50,75,100]; let claimed=false; for(const m of marks){const id=`${world}_${m}`; if(a.pct>=m && !state.albums.claimed[id]){state.albums.claimed[id]=true; claimed=true; if(m===75) state.resources.forbiddenKeys++; else if(m===100) grantRandomItem(world); else state.resources.seeds+=m*10;}} save(); toast(claimed?'Hitos reclamados.':'No hay hitos nuevos.'); render();};
function itemCard(i){return `<div class="item rarity-${i.rarity}"><div class="rarebar"></div><h3>${i.icon||'🎁'} ${i.name}</h3><p><span class="tag">${i.world}</span> <span class="tag">${i.rarity}</span></p><p class="muted small">${i.desc||''}</p>${i.slot?`<button class="btn" onclick="equipItem('${i.id}')">Equipar</button>`:''}</div>`;}

function matemonView(){const mats=WORDS.filter(w=>w.world==='Matemon'); return `<div class="card"><h2>Matemonario</h2><p class="muted">${Object.keys(state.matemon.owned).length}/${mats.length} Matemon desbloqueados. Los repetidos dan fragmentos para mejoras visuales.</p></div><div class="items">${mats.map(m=>{const owned=state.matemon.owned[m.id]; return `<div class="item matemon-card rarity-${m.rarity}"><div class="rarebar"></div><img src="${m.image||''}" alt="${m.display}" onerror="this.style.display='none'"><h3>${owned?m.display:'???'}</h3><p><span class="tag">${m.rarity}</span><span class="tag">${m.category}</span></p><p class="muted small">${owned?m.clue:'Desbloquéalo resolviendo su palabra o abriendo Caja Matemon.'}</p><p>Fragmentos: ${state.matemon.fragments[m.id]||0}</p></div>`}).join('')}</div>`;}

function boxesView(){const boxes=[['basic','Caja Básica','80 semillas','3 recompensas variadas'],['green','Caja Verde','1 llave o 120 semillas','Objeto verde garantizado'],['matemon','Caja Matemon','1 llave o 150 semillas','Matemon garantizado'],['series','Caja Series','1 llave','Objeto de series'],['sagas','Caja Sagas','1 llave','Objeto de sagas'],['games','Caja Videojuegos','1 llave','Objeto gamer'],['brainrot','Caja Brainrot','1 llave','Objeto de Brainrot English'],['library','Caja LibrerIA','1 llave','Objeto de LibrerIA'],['multi','Caja Multiverso','2 llaves o 250 semillas','4 recompensas mixtas'],['forbidden','Caja Prohibida','1 llave prohibida','Raro o superior garantizado']]; return `<div class="card"><h2>Cajas</h2><p class="muted">Las cajas temáticas intentan dar al menos un objeto nuevo si queda disponible. Repetidos = polvo o fragmentos.</p></div><div class="grid three">${boxes.map(b=>`<div class="card mode-card"><div><h3>🎁 ${b[1]}</h3><p>${b[2]}</p><p class="muted">${b[3]}</p></div><button class="btn primary" onclick="openBox('${b[0]}')">Abrir</button></div>`).join('')}</div>`;}
window.openBox=(type)=>{let ok=false, world=null, matemon=false, count=3, cost='';
  const paySeeds=n=>{if(state.resources.seeds>=n){state.resources.seeds-=n; return true} return false}; const payKeys=n=>{if(state.resources.keys>=n){state.resources.keys-=n; return true} return false};
  if(type==='basic'){ok=paySeeds(80); cost='80 semillas'}
  if(type==='green'){ok=payKeys(1)||paySeeds(120); world='Mundo Verde'} if(type==='matemon'){ok=payKeys(1)||paySeeds(150); matemon=true; world='Matemon'}
  if(type==='series'){ok=payKeys(1); world='Series'} if(type==='sagas'){ok=payKeys(1); world='Sagas'} if(type==='games'){ok=payKeys(1); world='Videojuegos'}
  if(type==='brainrot'){ok=payKeys(1); world='Extras'} if(type==='library'){ok=payKeys(1); world='Mundo Verde'} if(type==='multi'){ok=payKeys(2)||paySeeds(250); world='Multiverso'; count=4}
  if(type==='forbidden'){ok=state.resources.forbiddenKeys>=1; if(ok) state.resources.forbiddenKeys--; world='Multiverso'; count=5}
  if(!ok) return toast('No tienes recursos suficientes. Puedes convertir recursos en la tienda.');
  const won=[]; for(let i=0;i<count;i++) won.push(grantRandomItem(world)); if(matemon){const m=rand(WORDS.filter(w=>w.world==='Matemon')); grantMatemon(m); won.push({name:m.display,world:'Matemon',rarity:m.rarity,icon:'✨',desc:m.clue});}
  state.stats.boxes++; checkAchievements(); save(); modal(`<h2>Caja abierta</h2><div class="items">${won.filter(Boolean).map(itemCard).join('')}</div><button class="btn primary" onclick="closeModal();render()">Genial</button>`);
};

function shopView(){return `<div class="card"><h2>Tienda</h2><p class="muted">Conversión fija para que ningún recurso quede bloqueado.</p><div class="grid two"><button class="btn" onclick="buyConvert('key')">150 semillas → 1 llave de vivero</button><button class="btn" onclick="buyConvert('forbiddenSeeds')">600 semillas → 1 llave prohibida</button><button class="btn" onclick="buyConvert('forbiddenKeys')">3 llaves → 1 llave prohibida</button><button class="btn" onclick="buyConvert('basicDust')">100 polvo → Caja Básica</button><button class="btn" onclick="buyConvert('themeDust')">250 polvo → Objeto nuevo</button></div></div><div class="card"><h3>Objetos no conseguidos destacados</h3><div class="items">${getAllCollectionItems().filter(i=>!state.collection.items[i.id]).slice(0,24).map(i=>`<div class="item rarity-${i.rarity}"><div class="rarebar"></div><h3>${i.icon} ${i.name}</h3><p>${i.rarity}</p><button class="btn" onclick="buyItem('${i.id}')">Comprar ${priceItem(i)} 🌱</button></div>`).join('')}</div></div>`;}
function priceItem(i){return i.rarity?.includes('Legend')?700:i.rarity?.includes('Épic')?320:i.rarity?.includes('Rar')?140:60;}
window.buyItem=(id)=>{const i=getItemById(id); const p=priceItem(i); if(state.resources.seeds<p) return toast('No tienes semillas suficientes.'); state.resources.seeds-=p; grantItem(i); save(); render();};
window.buyConvert=(t)=>{if(t==='key'&&state.resources.seeds>=150){state.resources.seeds-=150;state.resources.keys++} else if(t==='forbiddenSeeds'&&state.resources.seeds>=600){state.resources.seeds-=600;state.resources.forbiddenKeys++} else if(t==='forbiddenKeys'&&state.resources.keys>=3){state.resources.keys-=3;state.resources.forbiddenKeys++} else if(t==='basicDust'&&state.resources.dust>=100){state.resources.dust-=100; openBox('basic'); return;} else if(t==='themeDust'&&state.resources.dust>=250){state.resources.dust-=250; grantRandomItem('Multiverso')} else return toast('No tienes recursos suficientes.'); save(); render();};

function wardrobeView(){repairWardrobe(); return `<div class="grid two"><div class="card"><h2>Armario</h2><div class="avatar">${state.wardrobe.background?`<span class="slot background">${getItemById(state.wardrobe.background)?.icon||'🎴'}</span>`:''}<div class="face">🧑‍🌾</div>${SLOT_TYPES.filter(s=>s!=='background'&&s!=='frame').map(s=>state.wardrobe[s]?`<span class="slot ${s}">${getItemById(state.wardrobe[s])?.icon||'⭐'} ${getItemById(state.wardrobe[s])?.name||''}</span>`:'').join('')}</div><div class="controls"><button class="btn danger" onclick="unequipAll()">Desequipar todo</button><button class="btn" onclick="repairWardrobe();toast('Armario reparado');render()">Reparar armario</button></div>${SLOT_TYPES.map(s=>`<button class="btn" onclick="unequipSlot('${s}')">Quitar ${slotLabel(s)}</button>`).join('')}</div><div class="card"><h3>Equipables conseguidos</h3><div class="items">${ownedItems().filter(i=>i.slot).map(itemCard).join('') || '<p class="muted">Aún no tienes equipables.</p>'}</div></div></div>`;}
function slotLabel(s){return {hat:'sombrero',outfit:'ropa',accessory:'accesorio',badge:'insignia',frame:'marco',background:'fondo'}[s]||s;}
window.equipItem=(id)=>{const i=getItemById(id); if(!i?.slot) return; if(!state.collection.items[id]) return toast('No posees este objeto.'); state.wardrobe[i.slot]=id; save(); toast(`${i.name} equipado.`); render();};
window.unequipAll=()=>{for(const s of SLOT_TYPES) state.wardrobe[s]=null; save(); render();};
window.unequipSlot=(s)=>{state.wardrobe[s]=null; save(); render();};

function achievementsView(){const list=Object.values(state.achievements); return `<div class="card"><h2>Logros</h2><p class="muted">Los logros dan semillas y recursos. Conseguido: ${list.length}</p></div><div class="items">${list.map(a=>`<div class="item"><h3>🏅 ${a.name}</h3><p>${a.desc}</p><p class="muted small">${new Date(a.date).toLocaleDateString('es-ES')}</p></div>`).join('') || '<div class="card">Todavía no hay logros.</div>'}</div>`;}
function profileView(){return `<div class="card"><h2>Perfil</h2><div class="controls"><input id="playerName" value="${state.profile.name}"><button class="btn primary" onclick="state.profile.name=$('#playerName').value||'Explorador/a';save();render()">Guardar nombre</button></div><table class="table"><tr><th>Dato</th><th>Valor</th></tr><tr><td>Partidas</td><td>${state.stats.played}</td></tr><tr><td>Completadas</td><td>${state.stats.completed}</td></tr><tr><td>Perfectas</td><td>${state.stats.perfect}</td></tr><tr><td>Cajas abiertas</td><td>${state.stats.boxes}</td></tr><tr><td>Expediciones</td><td>${state.stats.expeditions}</td></tr><tr><td>Palabras Códex</td><td>${Object.keys(state.codex.unlocked).length}</td></tr><tr><td>Objetos</td><td>${Object.keys(state.collection.items).length}</td></tr><tr><td>Matemon</td><td>${Object.keys(state.matemon.owned).length}</td></tr></table></div>`;}
function optionsView(){return `<div class="card"><h2>Opciones y diagnóstico</h2><div class="grid two"><button class="btn" onclick="showTutorial()">Ver tutorial</button><button class="btn" onclick="state.settings.showLabels=!state.settings.showLabels;save();render()">Etiquetas en pistas: ${state.settings.showLabels?'Sí':'No'}</button><button class="btn" onclick="repairAll()">Reparar progreso</button><button class="btn" onclick="recalcLogros()">Recalcular logros</button><button class="btn" onclick="testResources()">Desbloquear recursos de prueba</button><button class="btn" onclick="exportSave()">Exportar progreso</button><button class="btn" onclick="importSave()">Importar progreso</button><button class="btn danger" onclick="resetSave()">Borrar progreso</button></div><p class="muted">Recursos: semillas se ganan jugando; llaves de vivero completando crucigramas o comprándolas; llaves prohibidas en bosses, conversiones o logros; polvo con repetidos; fragmentos con Matemon repetidos.</p></div>`;}
window.repairAll=()=>{state=repairSave(state); save(); toast('Progreso reparado.'); render();};
window.recalcLogros=()=>{checkAchievements(); save(); render();};
window.testResources=()=>{state.resources.seeds+=1000;state.resources.keys+=10;state.resources.forbiddenKeys+=3;state.resources.dust+=500;save();render();};
window.exportSave=()=>{const txt=btoa(unescape(encodeURIComponent(JSON.stringify(state)))); modal(`<h2>Exportar progreso</h2><textarea style="width:100%;height:180px">${txt}</textarea><button class="btn primary" onclick="closeModal()">Cerrar</button>`);};
window.importSave=()=>{modal(`<h2>Importar progreso</h2><textarea id="importTxt" style="width:100%;height:180px" placeholder="Pega aquí el código"></textarea><button class="btn primary" onclick="doImport()">Importar</button>`);};
window.doImport=()=>{try{state=repairSave(JSON.parse(decodeURIComponent(escape(atob($('#importTxt').value.trim()))))); save(); closeModal(); render();}catch(e){toast('Código no válido.')}};
window.resetSave=()=>{if(confirm('¿Borrar todo el progreso?')){localStorage.removeItem(APP_KEY);state=defaultSave();render();}};
function showTutorial(){modal(`<h2>Tutorial rápido</h2><p><b>1.</b> Elige un modo y una dificultad.</p><p><b>2.</b> Toca una palabra o pista, lee la definición y escribe la respuesta completa.</p><p><b>3.</b> Usa concentración para revelar letras o pedir pista extra.</p><p><b>4.</b> Al completar crucigramas ganas semillas, llaves y colección.</p><p><b>5.</b> Todo recurso visible tiene formas de conseguirse: juego normal, logros, bosses o tienda.</p><button class="btn primary" onclick="closeModal()">Entendido</button>`);}
function modal(html){document.body.insertAdjacentHTML('beforeend',`<div class="modal-back" id="modal"><div class="modal">${html}</div></div>`)}
window.closeModal=()=>$('#modal')?.remove();

render();
