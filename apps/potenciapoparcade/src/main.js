import { GameScene } from './scenes/GameScene.js';
import { MODES } from './data/levels.js';
import { SaveSystem } from './systems/SaveSystem.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let save = SaveSystem.load();
let selectedMode = 'normal';
let game;

function bootGame(){
  game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 900,
    height: 680,
    backgroundColor: '#070819',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: []
  });
  game.scene.add('GameScene', GameScene, false);
}

function show(screen){
  $$('.screen').forEach(s=>s.classList.remove('active'));
  $(`#screen-${screen}`).classList.add('active');
  if(screen==='progress') renderProgress();
  if(screen==='achievements') renderAchievements();
}

function modeName(mode){ return MODES[mode].name; }

function openLevels(mode){
  selectedMode=mode; $('#level-mode-pill').textContent=`Modo ${modeName(mode)}`;
  const data=save.modes[mode]; const grid=$('#level-grid'); grid.innerHTML='';
  for(let i=1;i<=15;i++){
    const btn=document.createElement('button'); btn.className='level-btn';
    const unlocked=i<=data.max; const completed=data.completed.includes(i);
    if(!unlocked) btn.classList.add('locked'); if(completed) btn.classList.add('completed');
    btn.innerHTML=`<b>Nivel ${i}</b><small>${completed?'Completado':unlocked?'Disponible':'Bloqueado'}</small>`;
    btn.disabled=!unlocked;
    btn.onclick=()=>startLevel(mode,i);
    grid.appendChild(btn);
  }
  show('levels');
}

function startLevel(mode,level){
  show('game');
  if(!game) bootGame();
  game.scale.refresh();
  game.scene.stop('GameScene');
  game.scene.start('GameScene', { mode, level, onHud:updateHud, onEnd:handleEnd });
}

function updateHud(h){
  $('#hud-mode').textContent=h.mode; $('#hud-level').textContent=h.level; $('#hud-score').textContent=h.score;
  $('#hud-streak').textContent=h.streak; $('#hud-lives').textContent=h.lives; $('#hud-next').textContent=h.next; $('#hud-tip').textContent=h.tip;
  $('#next-box').style.display = h.next === '?' ? 'none' : 'block';
  const scene=game?.scene?.getScene('GameScene');
  if(scene?.powerups){
    $('#pu-freeze').textContent=`❄️ Congelar (${scene.powerups.freeze})`; $('#pu-freeze').disabled=!scene.powerups.freeze;
    $('#pu-shuffle').textContent=`🔁 Cambiar (${scene.powerups.shuffle})`; $('#pu-shuffle').disabled=!scene.powerups.shuffle;
    $('#pu-bomb').textContent=`💥 Bomba raíz (${scene.powerups.bomb})`; $('#pu-bomb').disabled=!scene.powerups.bomb;
  }
}

function handleEnd(res){
  save=SaveSystem.load();
  const title=res.type==='win' ? (res.perfect?'¡Nivel perfecto!':'¡Nivel superado!') : 'Fin de partida';
  const body=res.type==='win'
    ? `Has completado el nivel ${res.level} en modo ${modeName(res.mode)} con ${res.score} puntos.${res.perfect?' Sin fallos: reborde dorado impecable.':''}`
    : `La línea de peligro pudo contigo en el nivel ${res.level}. Puedes repetir cualquier nivel desbloqueado.`;
  modal(title, body, [
    res.type==='win' && res.level<15 ? {txt:'Siguiente nivel', fn:()=>{hideModal(); startLevel(res.mode,res.level+1);}} : null,
    {txt:'Repetir nivel', fn:()=>{hideModal(); startLevel(res.mode,res.level);}},
    {txt:'Elegir nivel', fn:()=>{hideModal(); openLevels(res.mode);}},
    {txt:'Menú', fn:()=>{hideModal(); show('menu');}}
  ].filter(Boolean));
}

function modal(title,body,actions){
  $('#modal-title').textContent=title; $('#modal-body').textContent=body; const box=$('#modal-actions'); box.innerHTML='';
  actions.forEach(a=>{ const b=document.createElement('button'); b.textContent=a.txt; b.onclick=a.fn; b.className=a.txt==='Menú'?'ghost':'primary'; box.appendChild(b); });
  $('#modal').classList.remove('hidden');
}
function hideModal(){ $('#modal').classList.add('hidden'); }

function renderProgress(){
  save=SaveSystem.load(); const s=save.stats; const wrap=$('#progress-content'); wrap.innerHTML='';
  const items=[
    ['Normal', `${save.modes.normal.completed.length}/15 completados`, `Máximo alcanzado: ${save.modes.normal.max}`],
    ['Difícil', `${save.modes.hard.completed.length}/15 completados`, `Máximo alcanzado: ${save.modes.hard.max}`],
    ['Pesadilla', `${save.modes.nightmare.completed.length}/15 completados`, `Máximo alcanzado: ${save.modes.nightmare.max}`],
    ['Puntuación total', s.score, 'Suma histórica'],
    ['Aciertos / fallos', `${s.hits} / ${s.misses}`, `${s.shots} disparos totales`],
    ['Mejor racha', s.bestStreak, 'Récord personal'],
    ['Cuadrados acertados', s.squares, 'x² dominados'],
    ['Cubos acertados', s.cubes, 'x³ dominados'],
    ['Burbujas caídas', s.fallen, 'Desconectadas del techo']
  ];
  for(const [a,b,c] of items){ const div=document.createElement('div'); div.className='stat'; div.innerHTML=`<span>${a}</span><b>${b}</b><small>${c}</small>`; wrap.appendChild(div); }
}

function renderAchievements(){
  save=SaveSystem.load(); const grid=$('#achievement-grid'); grid.innerHTML='';
  SaveSystem.achievements().forEach(a=>{
    const ok=save.achievements.includes(a.id); const div=document.createElement('div'); div.className=`achievement ${ok?'unlocked':'locked'}`;
    div.innerHTML=`<div class="icon">${a.icon}</div><h3>${a.title}</h3><p>${a.desc}</p><small>${ok?'Desbloqueado':'Bloqueado'}</small>`;
    grid.appendChild(div);
  });
}

$$('.nav button').forEach(b=>b.onclick=()=>show(b.dataset.screen));
$$('.mode-card').forEach(b=>b.onclick=()=>openLevels(b.dataset.mode));
$('#back-to-menu').onclick=()=>show('menu');
$('#exit-game').onclick=()=>{ game.scene.stop('GameScene'); show('menu'); };
$('#complete-tutorial').onclick=()=>{ save=SaveSystem.load(); save.tutorialDone=true; SaveSystem.updateAchievements(save); SaveSystem.save(save); modal('Tutorial completado','Has desbloqueado el logro “Profesor de pompas”.',[{txt:'Ver logros',fn:()=>{hideModal();show('achievements');}},{txt:'Menú',fn:()=>{hideModal();show('menu');}}]); };
$('#reset-progress').onclick=()=>{ if(confirm('¿Seguro que quieres borrar todo el progreso de Potencia Pop Arcade en este navegador?')){ save=SaveSystem.reset(); renderProgress(); renderAchievements(); }};
$('#pu-freeze').onclick=()=>game.scene.getScene('GameScene')?.usePowerup('freeze');
$('#pu-shuffle').onclick=()=>game.scene.getScene('GameScene')?.usePowerup('shuffle');
$('#pu-bomb').onclick=()=>game.scene.getScene('GameScene')?.usePowerup('bomb');

renderAchievements(); renderProgress(); show('menu');
