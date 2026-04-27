(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const screens = [...document.querySelectorAll('.screen')];
  const canvas = $('gameCanvas');
  const ctx = canvas.getContext('2d');
  const starsCanvas = $('stars');
  const sctx = starsCanvas.getContext('2d');

  const MODES = {
    normal: { label: 'Normal', guide: true, next: true, speedMul: 1, lives: 3, powerRate: 1, desc: 'Guía de disparo, siguiente burbuja visible y bajada equilibrada.' },
    hard: { label: 'Difícil', guide: false, next: true, speedMul: 1.05, lives: 3, powerRate: .85, desc: 'Sin guía. Misma estructura de niveles, pero exige más puntería.' },
    nightmare: { label: 'Pesadilla', guide: false, next: false, speedMul: 1.55, lives: 2, powerRate: .55, desc: 'Sin guía, sin siguiente burbuja y con el tablero bajando más rápido.' }
  };

  const COLORS = ['#38d9ff','#ffd166','#ff5fb7','#74ff9b','#a78bfa','#ff9f1c','#4dabf7','#f783ac','#63e6be','#ffa94d','#91a7ff','#ff6b6b'];
  const STORE_KEY = 'potenciaPop_v1_3match';

  const ACHIEVEMENTS = [
    ['tutorial','🎓','Profesor de pompas','Completa el tutorial.'],
    ['firstPop','💥','Primer Pum','Explota tu primer grupo de burbujas.'],
    ['square10','⬛','Ya no me cuadran las dudas','Acierta 10 cuadrados.'],
    ['cube10','🧊','Cúbicamente brillante','Acierta 10 cubos.'],
    ['streak5','🔥','Sin despeinarse','Consigue una racha de 5 aciertos.'],
    ['streak10','⚡','Calculadora humana','Consigue una racha de 10 aciertos.'],
    ['streak20','🚀','Cerebro en modo turbo','Consigue una racha de 20 aciertos.'],
    ['normalPerfect','✨','Ni una pompa perdida','Completa un nivel Normal sin fallar.'],
    ['hardPerfect','🎯','Pulso de jardinero cirujano','Completa un nivel Difícil sin fallar.'],
    ['nightmareClear','😈','Pesadilla sin pestañear','Completa un nivel Pesadilla.'],
    ['nightmarePerfect','👑','Imposible pero cierto','Completa una pantalla de Pesadilla sin fallar ninguna burbuja.'],
    ['nightmareAll','🩸','Maestro de las potencias oscuras','Completa los 15 niveles de Pesadilla.'],
    ['allModes','🌟','Leyenda del cañón','Completa todos los niveles de todos los modos.'],
    ['rebound10','🌀','Geometría sagrada del rebote','Acierta 10 disparos usando rebote.'],
    ['sixtyFour','♾️','El 64 no me engaña','Acierta 64 con 8² y también con 4³.'],
    ['club225','🏰','El club del 225','Acierta 15².'],
    ['cube216','🧊','Cubito de hielo XXL','Acierta 6³.'],
    ['powerMaster','🛠️','Botonero legendario','Usa 20 power-ups.']
  ];

  const levels = Array.from({ length: 15 }, (_, i) => {
    const n = i + 1;
    const maxSq = [5,6,7,8,9,10,10,11,12,12,13,14,14,15,15][i];
    const maxCube = [0,0,0,0,0,0,4,4,0,5,5,0,6,6,6][i];
    return {
      n,
      rows: Math.min(5 + Math.floor(i / 2), 10),
      cols: Math.min(8 + Math.floor(i / 3), 11),
      maxSq,
      maxCube,
      target: 6 + i * 2,
      tickMs: Math.max(3600 - i * 145, 1450),
      startOffset: 20 + Math.min(i * 2, 24),
      title: maxCube ? `Cuadrados 2²-${maxSq}² y cubos 2³-${maxCube}³` : `Cuadrados 2²-${maxSq}²`
    };
  });

  const defaultProgress = () => ({
    modes: {
      normal: { unlocked: 1, completed: [], perfect: [] },
      hard: { unlocked: 1, completed: [], perfect: [] },
      nightmare: { unlocked: 1, completed: [], perfect: [] }
    },
    stats: { shots: 0, hits: 0, misses: 0, pops: 0, squares: 0, cubes: 0, bestStreak: 0, rebounds: 0, powerups: 0, score: 0 },
    forms64: {}, achievements: {}, tutorial: false
  });

  let progress = loadProgress();
  let currentMode = 'normal';
  let audioOn = true;
  let audioCtx = null;
  let lastTime = 0;
  let game = null;
  let particles = [];
  let rafId = 0;

  function loadProgress(){
    try {
      const parsed = JSON.parse(localStorage.getItem(STORE_KEY));
      const base = defaultProgress();
      if (!parsed) return base;
      return {
        ...base, ...parsed,
        modes: { ...base.modes, ...(parsed.modes || {}) },
        stats: { ...base.stats, ...(parsed.stats || {}) },
        forms64: parsed.forms64 || {}, achievements: parsed.achievements || {}
      };
    } catch { return defaultProgress(); }
  }
  function saveProgress(){ localStorage.setItem(STORE_KEY, JSON.stringify(progress)); updateSummaries(); }
  function unlockAchievement(id){
    if (!progress.achievements[id]) {
      progress.achievements[id] = true;
      saveProgress();
      toast(`🏆 Logro: ${ACHIEVEMENTS.find(a => a[0] === id)?.[2] || id}`);
      sound('achievement');
    }
  }

  function showScreen(id){
    screens.forEach(s => s.classList.toggle('active', s.id === id));
    if (id === 'screenModeSelect') renderLevelSelect(currentMode);
    if (id === 'screenAchievements') renderAchievements();
    if (id === 'screenProgress') renderProgress();
    if (id !== 'screenGame') stopGameLoop();
  }

  document.addEventListener('click', (e) => {
    const screenBtn = e.target.closest('[data-screen]');
    if (screenBtn) showScreen(screenBtn.dataset.screen);
    const modeCard = e.target.closest('[data-open-mode]');
    if (modeCard) { currentMode = modeCard.dataset.openMode; showScreen('screenModeSelect'); }
    if (e.target.id === 'btnHome') showScreen('screenMenu');
  });

  $('btnReset').addEventListener('click', () => {
    if (confirm('¿Seguro que quieres borrar todo el progreso de Potencia Pop?')) {
      progress = defaultProgress(); saveProgress(); renderAchievements(); renderProgress(); renderLevelSelect(currentMode); updateSummaries(); toast('Progreso reiniciado');
    }
  });
  $('btnSound').addEventListener('click', () => { audioOn = !audioOn; $('btnSound').textContent = audioOn ? '🔊 Sonido' : '🔇 Sonido'; });
  $('btnCompleteTutorial').addEventListener('click', () => { progress.tutorial = true; unlockAchievement('tutorial'); saveProgress(); showScreen('screenMenu'); });

  function renderLevelSelect(mode){
    const cfg = MODES[mode];
    $('modeTitle').textContent = `Modo ${cfg.label}`;
    $('modeDesc').textContent = cfg.desc;
    const grid = $('levelGrid'); grid.innerHTML = '';
    const mp = progress.modes[mode];
    levels.forEach(l => {
      const unlocked = l.n <= mp.unlocked;
      const completed = mp.completed.includes(l.n);
      const perfect = mp.perfect.includes(l.n);
      const btn = document.createElement('button');
      btn.className = `level-btn ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''} ${perfect ? 'perfect' : ''}`;
      btn.innerHTML = `<strong>${l.n}</strong><span>${l.title}</span>`;
      btn.disabled = !unlocked;
      btn.addEventListener('click', () => startGame(mode, l.n));
      grid.appendChild(btn);
    });
  }

  function renderAchievements(){
    const grid = $('achievementsGrid'); grid.innerHTML = '';
    ACHIEVEMENTS.forEach(([id, icon, title, desc]) => {
      const div = document.createElement('div');
      div.className = `achievement ${progress.achievements[id] ? 'unlocked' : ''}`;
      div.innerHTML = `<div class="icon">${progress.achievements[id] ? icon : '🔒'}</div><h3>${title}</h3><p>${desc}</p>`;
      grid.appendChild(div);
    });
  }

  function renderProgress(){
    const s = progress.stats;
    const accuracy = s.shots ? Math.round((s.hits / s.shots) * 100) : 0;
    const cards = [
      ['Normal', `${progress.modes.normal.completed.length}/15 completados`, `Máximo desbloqueado: ${progress.modes.normal.unlocked}`],
      ['Difícil', `${progress.modes.hard.completed.length}/15 completados`, `Máximo desbloqueado: ${progress.modes.hard.unlocked}`],
      ['Pesadilla', `${progress.modes.nightmare.completed.length}/15 completados`, `Máximo desbloqueado: ${progress.modes.nightmare.unlocked}`],
      ['Precisión', `${accuracy}%`, `${s.hits} aciertos de ${s.shots} disparos`],
      ['Mejor racha', s.bestStreak, 'Aciertos consecutivos'],
      ['Puntos totales', s.score, 'Suma de todas las partidas'],
      ['Cuadrados acertados', s.squares, 'Potencias con exponente 2'],
      ['Cubos acertados', s.cubes, 'Potencias con exponente 3']
    ];
    $('progressCards').innerHTML = cards.map(c => `<div class="progress-card"><span>${c[0]}</span><strong>${c[1]}</strong><p class="muted">${c[2]}</p></div>`).join('');
  }

  function updateSummaries(){
    ['normal','hard','nightmare'].forEach(m => { $(`${m}Summary`).textContent = `Nivel máximo: ${progress.modes[m].unlocked} · Completados: ${progress.modes[m].completed.length}/15`; });
  }

  function expressionsForLevel(lvl){
    const arr = [];
    for (let b = 2; b <= lvl.maxSq; b++) arr.push({ base: b, exp: 2, result: b*b, label: `${b}²` });
    if (lvl.maxCube) for (let b = 2; b <= lvl.maxCube; b++) arr.push({ base: b, exp: 3, result: b*b*b, label: `${b}³` });
    return arr;
  }

  function resultPoolForLevel(lvl){
    return [...new Set(expressionsForLevel(lvl).map(e => e.result))];
  }

  function startGame(mode, levelNum){
    currentMode = mode;
    showScreen('screenGame');
    const lvl = levels[levelNum - 1];
    const modeCfg = MODES[mode];
    game = createGameState(mode, modeCfg, lvl);
    $('pauseOverlay').classList.add('hidden');
    updateHud();
    resizeCanvasBacking();
    lastTime = performance.now();
    stopGameLoop();
    rafId = requestAnimationFrame(loop);
    sound('start');
  }

  function createGameState(mode, modeCfg, lvl){
    const radius = 28;
    const state = {
      mode, modeCfg, lvl, radius,
      offsetY: lvl.startOffset, descendTimer: 0, frozen: 0,
      lineY: canvas.height - 128,
      bubbles: [], score: 0, lives: modeCfg.lives, streak: 0, hitsThisLevel: 0, missesThisLevel: 0, poppedThisLevel: 0,
      shotsSinceUseful: 0, current: null, next: null, projectile: null,
      aim: -Math.PI/2, pointer: { x: canvas.width/2, y: canvas.height - 58 },
      cannon: { x: canvas.width/2, y: canvas.height - 54 },
      power: { freeze: 1, lupa: 1, swap: 2, bomb: 0 }, highlightUntil: 0, completed: false, awaiting: false
    };
    buildBoard(state);
    state.current = generateShot(state);
    state.next = generateShot(state);
    return state;
  }

  function buildBoard(st){
    const pool = resultPoolForLevel(st.lvl);
    const r = st.radius, dx = r * 1.82, dy = r * 1.56;
    const startX = (canvas.width - (st.lvl.cols - 1) * dx) / 2;
    st.bubbles = [];
    for (let row = 0; row < st.lvl.rows; row++) {
      for (let col = 0; col < st.lvl.cols; col++) {
        if (Math.random() < .1 && row > 1) continue;
        const x = startX + col * dx + (row % 2 ? dx / 2 : 0);
        const y = 54 + row * dy;
        const value = pool[Math.floor(Math.random() * pool.length)];
        st.bubbles.push(makeBubble(x, y, value, row, col));
      }
    }
    // Guarantee some early groups and useful targets
    const values = pool.slice(0, Math.min(pool.length, 5));
    values.forEach((v, i) => {
      if (st.bubbles[i]) st.bubbles[i].value = v;
      if (st.bubbles[i + 1]) st.bubbles[i + 1].value = v;
    });
  }

  function makeBubble(x, y, value, row = 0, col = 0){
    return { x, y, value, row, col, id: Math.random().toString(36).slice(2), wobble: Math.random() * Math.PI * 2, pop: 0 };
  }

  function generateShot(st){
    const exprs = expressionsForLevel(st.lvl);
    const values = new Set(st.bubbles.map(b => b.value));
    const useful = exprs.filter(e => values.has(e.result));
    let usefulProb = .60;
    const remaining = st.bubbles.length;
    const initial = Math.max(1, st.lvl.rows * st.lvl.cols * .85);
    if (remaining < initial * .4) usefulProb = .75;
    if (remaining <= 3) usefulProb = .92;
    if (st.shotsSinceUseful >= 3) usefulProb = 1;
    usefulProb *= st.mode === 'nightmare' ? .92 : 1;
    const pickUseful = useful.length && Math.random() < usefulProb;
    const source = pickUseful ? useful : exprs;
    const e = source[Math.floor(Math.random() * source.length)];
    return { ...e, useful: values.has(e.result) };
  }

  function loop(t){
    const dt = Math.min(40, t - lastTime); lastTime = t;
    if (game && !game.awaiting) updateGame(dt);
    drawGame();
    rafId = requestAnimationFrame(loop);
  }
  function stopGameLoop(){ if (rafId) cancelAnimationFrame(rafId); rafId = 0; }

  function updateGame(dt){
    const st = game;
    st.lineY = canvas.height - 128;
    st.cannon.x = canvas.width / 2; st.cannon.y = canvas.height - 54;
    st.frozen = Math.max(0, st.frozen - dt);
    if (!st.frozen) {
      st.descendTimer += dt;
      const threshold = st.lvl.tickMs / st.modeCfg.speedMul;
      if (st.descendTimer >= threshold) {
        st.descendTimer = 0;
        st.offsetY += 9 + st.lvl.n * .45;
        sound('descend');
      }
    }
    st.bubbles.forEach(b => b.wobble += dt * .004);
    if (st.projectile) updateProjectile(st, dt);
    updateParticles(dt);
    if (st.bubbles.some(b => b.y + st.offsetY + st.radius > st.lineY)) loseLife('Las burbujas han cruzado la línea de peligro.');
  }

  function updateProjectile(st, dt){
    const p = st.projectile;
    const step = dt / 16.67;
    p.x += p.vx * step; p.y += p.vy * step;
    if (p.x < st.radius) { p.x = st.radius; p.vx *= -1; p.rebounded = true; sound('wall'); }
    if (p.x > canvas.width - st.radius) { p.x = canvas.width - st.radius; p.vx *= -1; p.rebounded = true; sound('wall'); }
    if (p.y < st.radius + 8) { attachProjectile(st, null); return; }
    for (const b of st.bubbles) {
      const bx = b.x, by = b.y + st.offsetY;
      if (dist(p.x,p.y,bx,by) <= st.radius * 1.95) { attachProjectile(st, b); return; }
    }
  }

  function attachProjectile(st, hitBubble){
    const p = st.projectile; if (!p) return;
    const compatible = hitBubble && hitBubble.value === p.expr.result;
    const value = compatible ? p.expr.result : randomResult(st);
    const pos = findAttachPosition(st, p, hitBubble);
    const nb = makeBubble(pos.x, pos.y - st.offsetY, value);
    st.bubbles.push(nb);
    st.projectile = null;
    progress.stats.shots++;

    if (compatible) {
      st.hitsThisLevel++; st.streak++; progress.stats.hits++;
      if (p.expr.exp === 2) progress.stats.squares++; else progress.stats.cubes++;
      if (p.rebounded) progress.stats.rebounds++;
      if (p.expr.result === 64) progress.forms64[p.expr.label] = true;
      st.score += 60 + st.streak * 8 + (p.rebounded ? 40 : 0);
      st.shotsSinceUseful = 0;
      addParticles(nb.x, nb.y + st.offsetY, '#74ff9b', 12);
      toast(`${p.expr.label} = ${p.expr.result}. ¡Busca grupo de 3!`);
      sound('hit');
      const group = connectedGroup(st, nb, value);
      if (group.length >= 3) popGroup(st, group);
      else giveTip(st, `Bien: ${p.expr.label} vale ${p.expr.result}. Ahora necesitas 3 resultados iguales conectados.`);
    } else {
      st.missesThisLevel++; st.streak = 0; progress.stats.misses++; st.shotsSinceUseful++;
      addParticles(nb.x, nb.y + st.offsetY, '#ff4d6d', 10);
      toast(`Fallaste: ${p.expr.label} no iba ahí. Se convierte en ${value}.`);
      giveTip(st, `${p.expr.label} vale ${p.expr.result}. La burbuja tocada no era ese resultado.`);
      sound('miss');
    }

    progress.stats.bestStreak = Math.max(progress.stats.bestStreak, st.streak);
    maybeGrantPower(st);
    st.current = st.next;
    st.next = generateShot(st);
    checkAchievements();
    updateHud(); saveProgress();
  }

  function findAttachPosition(st, p, hit){
    const r = st.radius, dx = r * 1.82, dy = r * 1.56;
    let candidates = [];
    if (hit) {
      const hx = hit.x, hy = hit.y + st.offsetY;
      const angles = [0, Math.PI/3, 2*Math.PI/3, Math.PI, 4*Math.PI/3, 5*Math.PI/3];
      candidates = angles.map(a => ({ x: hx + Math.cos(a)*dx, y: hy + Math.sin(a)*dy }));
    } else {
      candidates = [{ x: p.x, y: Math.max(42, p.y) }];
    }
    candidates = candidates.filter(c => c.x > r && c.x < canvas.width-r && c.y > r && c.y < st.lineY-r);
    candidates.sort((a,b) => dist(a.x,a.y,p.x,p.y) - dist(b.x,b.y,p.x,p.y));
    for (const c of candidates) {
      if (!st.bubbles.some(b => dist(c.x,c.y,b.x,b.y+st.offsetY) < r*1.45)) return c;
    }
    return { x: clamp(p.x, r, canvas.width-r), y: clamp(p.y, r, st.lineY-r) };
  }

  function connectedGroup(st, start, value){
    const seen = new Set(), stack = [start], group = [];
    while (stack.length) {
      const b = stack.pop(); if (seen.has(b.id)) continue; seen.add(b.id);
      if (b.value !== value) continue;
      group.push(b);
      st.bubbles.forEach(o => { if (!seen.has(o.id) && o.value === value && dist(b.x,b.y,o.x,o.y) < st.radius*2.15) stack.push(o); });
    }
    return group;
  }

  function popGroup(st, group){
    const ids = new Set(group.map(b => b.id));
    group.forEach(b => addParticles(b.x, b.y + st.offsetY, colorForValue(b.value), 22));
    st.bubbles = st.bubbles.filter(b => !ids.has(b.id));
    st.poppedThisLevel += group.length; progress.stats.pops += group.length;
    st.score += group.length * 120 + Math.max(0, group.length - 3) * 60 + st.streak * 14;
    toast(`¡POP x${group.length}! Grupo eliminado`);
    sound('pop');
    removeFloaters(st);
    if (st.poppedThisLevel >= st.lvl.target || st.bubbles.length <= Math.max(2, Math.floor(st.lvl.cols * .3))) completeLevel();
  }

  function removeFloaters(st){
    const top = st.bubbles.filter(b => b.y + st.offsetY < 95 + st.offsetY);
    const connected = new Set();
    const stack = [...top];
    while (stack.length) {
      const b = stack.pop(); if (connected.has(b.id)) continue; connected.add(b.id);
      st.bubbles.forEach(o => { if (!connected.has(o.id) && dist(b.x,b.y,o.x,o.y) < st.radius*2.15) stack.push(o); });
    }
    const floaters = st.bubbles.filter(b => !connected.has(b.id));
    if (floaters.length >= 2) {
      floaters.forEach(b => addParticles(b.x, b.y + st.offsetY, '#ffffff', 10));
      st.score += floaters.length * 35;
      st.bubbles = st.bubbles.filter(b => connected.has(b.id));
      toast(`¡Caen ${floaters.length} burbujas sueltas!`);
    }
  }

  function loseLife(msg){
    const st = game; if (!st || st.awaiting) return;
    st.lives--; sound('life');
    if (st.lives <= 0) {
      st.awaiting = true;
      progress.stats.score += st.score; saveProgress();
      showModal('Partida terminada', `${msg}<br>Has llegado al nivel ${st.lvl.n}. Puedes volver a empezar desde cualquier nivel desbloqueado de este modo.`, 'Reintentar');
    } else {
      toast(`Pierdes una vida. Quedan ${st.lives}`);
      st.offsetY = st.lvl.startOffset;
      st.descendTimer = 0;
      st.bubbles.forEach(b => b.y = Math.max(42, b.y - 36));
      updateHud();
    }
  }

  function completeLevel(){
    const st = game; if (!st || st.awaiting) return;
    st.awaiting = true; st.completed = true;
    const mp = progress.modes[st.mode];
    if (!mp.completed.includes(st.lvl.n)) mp.completed.push(st.lvl.n);
    if (st.missesThisLevel === 0 && !mp.perfect.includes(st.lvl.n)) mp.perfect.push(st.lvl.n);
    mp.unlocked = Math.max(mp.unlocked, Math.min(15, st.lvl.n + 1));
    progress.stats.score += st.score;
    checkAchievements(true);
    saveProgress();
    const perfect = st.missesThisLevel === 0 ? ' Además, lo has hecho PERFECTO. ⭐' : '';
    showModal('¡Nivel superado!', `Has completado el nivel ${st.lvl.n} de ${MODES[st.mode].label}.<br>Puntos: ${st.score}.${perfect}`, st.lvl.n < 15 ? 'Siguiente nivel' : 'Volver');
    sound('win');
  }

  function showModal(title, text, contText){
    $('modalTitle').innerHTML = title; $('modalText').innerHTML = text; $('btnContinue').textContent = contText;
    $('pauseOverlay').classList.remove('hidden');
    $('btnContinue').onclick = () => {
      const st = game;
      if (!st) return showScreen('screenMenu');
      if (st.completed && st.lvl.n < 15) startGame(st.mode, st.lvl.n + 1);
      else if (!st.completed) startGame(st.mode, st.lvl.n);
      else showScreen('screenMenu');
    };
  }

  function checkAchievements(fromComplete = false){
    const s = progress.stats;
    if (s.pops > 0) unlockAchievement('firstPop');
    if (s.squares >= 10) unlockAchievement('square10');
    if (s.cubes >= 10) unlockAchievement('cube10');
    if (s.bestStreak >= 5) unlockAchievement('streak5');
    if (s.bestStreak >= 10) unlockAchievement('streak10');
    if (s.bestStreak >= 20) unlockAchievement('streak20');
    if (s.rebounds >= 10) unlockAchievement('rebound10');
    if (progress.forms64['8²'] && progress.forms64['4³']) unlockAchievement('sixtyFour');
    if (s.powerups >= 20) unlockAchievement('powerMaster');
    if (game?.current?.label === '15²' || s.squares > 80) {}
    if (fromComplete && game) {
      const mp = progress.modes[game.mode];
      if (game.mode === 'normal' && mp.perfect.includes(game.lvl.n)) unlockAchievement('normalPerfect');
      if (game.mode === 'hard' && mp.perfect.includes(game.lvl.n)) unlockAchievement('hardPerfect');
      if (game.mode === 'nightmare') unlockAchievement('nightmareClear');
      if (game.mode === 'nightmare' && mp.perfect.includes(game.lvl.n)) unlockAchievement('nightmarePerfect');
      if (progress.modes.nightmare.completed.length >= 15) unlockAchievement('nightmareAll');
      if (['normal','hard','nightmare'].every(m => progress.modes[m].completed.length >= 15)) unlockAchievement('allModes');
    }
  }

  function randomResult(st){
    const pool = resultPoolForLevel(st.lvl); return pool[Math.floor(Math.random() * pool.length)];
  }
  function maybeGrantPower(st){
    const chance = (.12 + Math.min(st.streak, 10) * .012) * st.modeCfg.powerRate;
    if (Math.random() < chance) {
      const keys = ['freeze','lupa','swap','bomb']; const k = keys[Math.floor(Math.random()*keys.length)];
      st.power[k]++; toast(`Power-up conseguido: ${powerName(k)}`); sound('power'); updateHud();
    }
  }
  function powerName(k){ return ({ freeze:'Congelar', lupa:'Lupa', swap:'Cambiar', bomb:'Bomba raíz' })[k]; }

  function usePower(k){
    const st = game; if (!st || st.awaiting || st.power[k] <= 0) return;
    st.power[k]--; progress.stats.powerups++; sound('power');
    if (k === 'freeze') { st.frozen = 7000; toast('❄ Tablero congelado'); }
    if (k === 'lupa') { st.highlightUntil = performance.now() + 5500; toast('🔍 Se iluminan resultados compatibles'); }
    if (k === 'swap') { st.current = generateShot(st); toast('🔁 Burbuja cambiada'); }
    if (k === 'bomb') useBomb(st);
    checkAchievements(); updateHud(); saveProgress();
  }
  $('powerFreeze').onclick = () => usePower('freeze');
  $('powerLupa').onclick = () => usePower('lupa');
  $('powerSwap').onclick = () => usePower('swap');
  $('powerBomb').onclick = () => usePower('bomb');

  function useBomb(st){
    if (!st.bubbles.length) return;
    const target = st.bubbles.slice().sort((a,b) => (b.y - a.y))[0];
    st.bubbles = st.bubbles.filter(b => b.id !== target.id);
    addParticles(target.x, target.y + st.offsetY, '#ffd166', 30);
    st.score += 80; toast(`💥 Bomba raíz elimina ${target.value}`); sound('bomb');
  }

  function giveTip(st, text){ $('tipBox').textContent = text; }
  function updateHud(){
    if (!game) return;
    const st = game;
    $('hudMode').textContent = MODES[st.mode].label; $('hudLevel').textContent = st.lvl.n; $('hudScore').textContent = st.score;
    $('hudLives').textContent = st.lives; $('hudStreak').textContent = st.streak; $('hudGoal').textContent = `${st.poppedThisLevel}/${st.lvl.target}`;
    $('hudNextWrap').style.display = st.modeCfg.next ? 'flex' : 'none'; $('hudNext').textContent = st.next?.label || '?';
    ['Freeze','Lupa','Swap','Bomb'].forEach(name => { const key = name.toLowerCase(); const btn = $(`power${name}`); btn.querySelector('b').textContent = st.power[key]; btn.disabled = st.power[key] <= 0; });
  }

  function fire(){
    const st = game; if (!st || st.awaiting || st.projectile) return;
    const speed = 11.5;
    st.projectile = { x: st.cannon.x, y: st.cannon.y - st.radius, vx: Math.cos(st.aim) * speed, vy: Math.sin(st.aim) * speed, expr: st.current, rebound: false };
    sound('shoot');
  }

  function pointerToAim(x, y){
    const st = game; if (!st) return;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width, sy = canvas.height / rect.height;
    const px = (x - rect.left) * sx, py = (y - rect.top) * sy;
    st.pointer = { x: px, y: py };
    let a = Math.atan2(py - st.cannon.y, px - st.cannon.x);
    a = clamp(a, -Math.PI + .18, -.18);
    st.aim = a;
  }
  canvas.addEventListener('mousemove', e => pointerToAim(e.clientX, e.clientY));
  canvas.addEventListener('mousedown', e => { pointerToAim(e.clientX, e.clientY); fire(); });
  canvas.addEventListener('touchstart', e => { e.preventDefault(); const t = e.touches[0]; pointerToAim(t.clientX,t.clientY); }, { passive:false });
  canvas.addEventListener('touchmove', e => { e.preventDefault(); const t = e.touches[0]; pointerToAim(t.clientX,t.clientY); }, { passive:false });
  canvas.addEventListener('touchend', e => { e.preventDefault(); fire(); }, { passive:false });
  window.addEventListener('resize', () => { resizeCanvasBacking(); resizeStars(); });

  function resizeCanvasBacking(){
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(720, Math.floor(rect.width * ratio));
    canvas.height = Math.max(560, Math.floor(rect.height * ratio));
    ctx.setTransform(1,0,0,1,0,0);
    if (game) { game.cannon.x = canvas.width/2; game.cannon.y = canvas.height-54; }
  }

  function drawGame(){
    if (!game) return;
    const st = game;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawBackground(st);
    if (st.modeCfg.guide) drawGuide(st);
    drawDangerLine(st);
    st.bubbles.forEach(b => drawBubble(b.x, b.y + st.offsetY, st.radius, String(b.value), colorForValue(b.value), shouldHighlight(st,b)));
    if (st.projectile) drawBubble(st.projectile.x, st.projectile.y, st.radius, st.projectile.expr.label, '#ffffff', false, true);
    drawCannon(st);
    drawParticles();
  }

  function drawBackground(st){
    ctx.save();
    ctx.globalAlpha = .25;
    for (let x = 0; x < canvas.width; x += 70) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x + canvas.height*.25,canvas.height); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.stroke(); }
    ctx.globalAlpha = .14;
    ctx.fillStyle = st.frozen ? '#9be7ff' : '#ffffff';
    ctx.font = '900 22px system-ui';
    ctx.fillText(st.frozen ? '❄ CONGELADO' : 'POTENCIA POP', 24, 34);
    ctx.restore();
  }
  function drawDangerLine(st){
    ctx.save();
    ctx.setLineDash([18,12]); ctx.lineWidth = 5; ctx.strokeStyle = '#ff4d6d';
    ctx.beginPath(); ctx.moveTo(0, st.lineY); ctx.lineTo(canvas.width, st.lineY); ctx.stroke();
    ctx.setLineDash([]); ctx.fillStyle = 'rgba(255,77,109,.18)'; ctx.fillRect(0, st.lineY, canvas.width, canvas.height-st.lineY);
    ctx.fillStyle = '#ffd6de'; ctx.font = '900 18px system-ui'; ctx.fillText('LÍNEA DE PELIGRO', 24, st.lineY - 12);
    ctx.restore();
  }
  function drawGuide(st){
    if (st.projectile) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 4; ctx.setLineDash([8,12]);
    let x = st.cannon.x, y = st.cannon.y - st.radius, vx = Math.cos(st.aim) * 24, vy = Math.sin(st.aim) * 24;
    ctx.beginPath(); ctx.moveTo(x,y);
    for (let i=0;i<42;i++) { x += vx; y += vy; if (x < st.radius || x > canvas.width-st.radius) { vx *= -1; x = clamp(x,st.radius,canvas.width-st.radius); } ctx.lineTo(x,y); if (y < 30 || y > st.lineY) break; }
    ctx.stroke(); ctx.restore();
  }
  function drawCannon(st){
    const c = st.cannon;
    ctx.save(); ctx.translate(c.x,c.y); ctx.rotate(st.aim + Math.PI/2);
    const grad = ctx.createLinearGradient(0,-70,0,40); grad.addColorStop(0,'#38d9ff'); grad.addColorStop(1,'#ff5fb7');
    ctx.fillStyle = grad; roundRect(ctx,-18,-72,36,86,18); ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.beginPath(); ctx.arc(c.x,c.y,48,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,.16)'; ctx.fill(); ctx.strokeStyle='rgba(255,255,255,.35)'; ctx.lineWidth=3; ctx.stroke();
    if (!st.projectile && st.current) drawBubble(c.x, c.y-58, st.radius, st.current.label, '#ffffff', false, true);
    ctx.restore();
  }
  function drawBubble(x,y,r,label,color,highlight=false,shot=false){
    ctx.save();
    const grad = ctx.createRadialGradient(x-r*.35,y-r*.45,r*.2,x,y,r);
    grad.addColorStop(0,'#ffffff'); grad.addColorStop(.28,'#ffffff'); grad.addColorStop(1,color);
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fillStyle=grad; ctx.fill();
    ctx.lineWidth = highlight ? 6 : 2.5; ctx.strokeStyle = highlight ? '#fff26d' : 'rgba(255,255,255,.58)'; ctx.stroke();
    ctx.beginPath(); ctx.arc(x-r*.28,y-r*.32,r*.18,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,.55)'; ctx.fill();
    ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 5;
    ctx.fillStyle='#071023'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.font = `1000 ${shot ? r*.72 : r*.66}px system-ui`;
    ctx.fillText(label,x,y+1);
    if (highlight) { ctx.shadowColor='#fff26d'; ctx.shadowBlur=20; ctx.strokeStyle='#fff26d'; ctx.beginPath(); ctx.arc(x,y,r+8,0,Math.PI*2); ctx.stroke(); }
    ctx.restore();
  }
  function shouldHighlight(st,b){ return performance.now() < st.highlightUntil && st.current && b.value === st.current.result; }
  function colorForValue(v){ const pool = resultPoolForLevel(game?.lvl || levels[14]); const idx = pool.indexOf(v); return COLORS[((idx < 0 ? v : idx) % COLORS.length)]; }
  function roundRect(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }

  function addParticles(x,y,color,n){ for(let i=0;i<n;i++) particles.push({x,y,vx:(Math.random()-.5)*8,vy:(Math.random()-.5)*8,life:700+Math.random()*400,color,size:3+Math.random()*5}); }
  function updateParticles(dt){ particles = particles.filter(p => (p.life -= dt) > 0); particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .07; }); }
  function drawParticles(){ ctx.save(); particles.forEach(p => { ctx.globalAlpha = Math.max(0,p.life/900); ctx.fillStyle=p.color; ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill(); }); ctx.restore(); }

  function toast(text){
    const el = $('toast'); el.textContent = text; el.classList.remove('hidden');
    clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.add('hidden'), 1900);
  }
  function dist(x1,y1,x2,y2){ return Math.hypot(x1-x2,y1-y2); }
  function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }

  function sound(type){
    if (!audioOn) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;
      const gain = audioCtx.createGain(); gain.connect(audioCtx.destination); gain.gain.value = .035;
      const osc = audioCtx.createOscillator(); osc.connect(gain);
      const map = { shoot:[420,.08,'triangle'], hit:[720,.13,'sine'], miss:[150,.18,'sawtooth'], pop:[920,.22,'square'], wall:[300,.05,'sine'], win:[880,.35,'triangle'], life:[90,.28,'sawtooth'], descend:[180,.05,'sine'], power:[660,.18,'triangle'], bomb:[70,.28,'square'], achievement:[1040,.4,'sine'], start:[520,.2,'triangle'] };
      const [freq,dur,wave] = map[type] || map.hit;
      osc.type = wave; osc.frequency.setValueAtTime(freq, now);
      if (type === 'pop' || type === 'achievement' || type === 'win') osc.frequency.exponentialRampToValueAtTime(freq*1.7, now+dur);
      else osc.frequency.exponentialRampToValueAtTime(Math.max(40,freq*.55), now+dur);
      gain.gain.exponentialRampToValueAtTime(.0001, now+dur);
      osc.start(now); osc.stop(now+dur+.02);
    } catch {}
  }

  function resizeStars(){ starsCanvas.width = innerWidth; starsCanvas.height = innerHeight; drawStars(); }
  function drawStars(){
    sctx.clearRect(0,0,starsCanvas.width,starsCanvas.height);
    for (let i=0;i<120;i++) { const x=Math.random()*starsCanvas.width,y=Math.random()*starsCanvas.height,r=Math.random()*1.8+.4; sctx.globalAlpha=Math.random()*.75+.2; sctx.fillStyle='#fff'; sctx.beginPath(); sctx.arc(x,y,r,0,Math.PI*2); sctx.fill(); }
  }

  // Explicit achievement checks for special expressions through stats of current projectile.
  const originalAttach = attachProjectile;
  attachProjectile = function(st, hitBubble){
    const expr = st.projectile?.expr;
    originalAttach(st, hitBubble);
    if (hitBubble && expr && hitBubble.value === expr.result) {
      if (expr.label === '15²') unlockAchievement('club225');
      if (expr.label === '6³') unlockAchievement('cube216');
    }
  };

  resizeStars(); updateSummaries(); showScreen('screenMenu');
})();
