const state = {
  cards: [],
  effectiveness: new Map(),
  types: [],
  gameMode: 'ai',
  teamA: [],
  teamB: [],
  filter: { q: '', type: '', gen: '' },
  battle: null,
  capture: { captured: new Set(), current: null, task: null, locked: false, queue: [] },
};

const DEX_STORAGE_KEY = 'matemonpaco_matedex_captured_v1';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const TYPE_COLORS = {
  Normal: '#64748b', Fuego: '#ef4444', Agua: '#0ea5e9', Eléctrico: '#eab308', Planta: '#22c55e',
  Hielo: '#67e8f9', Lucha: '#f97316', Veneno: '#a855f7', Tierra: '#92400e', Volador: '#60a5fa',
  Psíquico: '#ec4899', Bicho: '#84cc16', Roca: '#78716c', Fantasma: '#6366f1', Dragón: '#7c3aed',
  Siniestro: '#334155', Acero: '#94a3b8', Hada: '#f0abfc'
};

function norm(text) {
  return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getCard(id) {
  return state.cards.find((card) => Number(card.id) === Number(id));
}

function getActive(side) {
  const team = side === 'A' ? state.battle.teamA : state.battle.teamB;
  return team.find((member) => member.hp > 0) || null;
}

function isTeamDefeated(team) {
  return team.every((member) => member.hp <= 0);
}

function badge(text, extraClass = '') {
  const color = TYPE_COLORS[text];
  const style = color ? `style="background:${color}22;color:${color};border-color:${color}55"` : '';
  return `<span class="badge ${extraClass}" ${style}>${text}</span>`;
}

function safeInt(value) {
  if (value === '' || value === null || value === undefined) return null;
  if (!/^\d+$/.test(String(value).trim())) return null;
  return Number.parseInt(value, 10);
}

function customRound(value) {
  const floor = Math.floor(value);
  const fraction = value - floor;
  return fraction >= 0.5 ? Math.ceil(value) : floor;
}

function getEffectiveness(attackType, defenseType) {
  return state.effectiveness.get(`${attackType}|${defenseType}`) ?? 1;
}

function getMultiplier(move, defender) {
  let multiplier = getEffectiveness(move.type, defender.type1);
  if (defender.type2) multiplier *= getEffectiveness(move.type, defender.type2);
  return multiplier;
}

function getStab(attacker, move) {
  return move.type === attacker.type1 || move.type === attacker.type2 ? 1.5 : 1;
}

function calculateDamage(attacker, defender, move) {
  const multiplier = getMultiplier(move, defender);
  const stab = getStab(attacker, move);
  const raw = Number(move.power) * multiplier * stab;
  return {
    amount: customRound(raw),
    raw,
    multiplier,
    stab,
    attackVsType1: getEffectiveness(move.type, defender.type1),
    attackVsType2: defender.type2 ? getEffectiveness(move.type, defender.type2) : null,
  };
}

function makeMathExplanation(attacker, defender, move) {
  const calc = calculateDamage(attacker, defender, move);
  const steps = [];
  steps.push(`Potencia del movimiento: ${move.power}`);
  if (defender.type2) {
    steps.push(`Efectividad: ${calc.attackVsType1} contra ${defender.type1} × ${calc.attackVsType2} contra ${defender.type2} = ${calc.multiplier}`);
  } else {
    steps.push(`Efectividad: ${calc.attackVsType1} contra ${defender.type1}`);
  }
  steps.push(`STAB: ${calc.stab} ${calc.stab === 1.5 ? '(sí coincide el tipo)' : '(no coincide el tipo)'}`);
  steps.push(`Operación: ${move.power} × ${calc.multiplier} × ${calc.stab} = ${formatNumber(calc.raw)}`);
  steps.push(`Redondeo: ${formatNumber(calc.raw)} → ${calc.amount}`);
  return { calc, steps };
}

function formatNumber(n) {
  return Number.isInteger(n) ? String(n) : String(Number(n.toFixed(2))).replace('.', ',');
}

function typeComment(multiplier) {
  if (multiplier === 0) return 'No afecta. Multiplicador ×0.';
  if (multiplier >= 4) return '¡Efectividad brutal! Multiplicador ×4.';
  if (multiplier > 1) return 'Es muy eficaz. Multiplicador mayor que 1.';
  if (multiplier < 1) return 'Es poco eficaz. Multiplicador menor que 1.';
  return 'Daño normal. Multiplicador ×1.';
}

async function init() {
  try {
    const [cards, effectiveness] = await Promise.all([
      fetch('data/cards.json').then((response) => response.json()),
      fetch('data/effectiveness.json').then((response) => response.json()),
    ]);
    state.cards = cards.map((card) => ({ ...card, type2: card.type2 || null }));
    state.effectiveness = new Map(effectiveness.map((row) => [`${row.attack_type}|${row.defense_type}`, Number(row.multiplier)]));
    state.types = [...new Set(state.cards.flatMap((card) => [card.type1, card.type2]).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
    loadDexProgress();
    fillFilters();
    bindEvents();
    renderTypeTable();
    renderAll();
  } catch (error) {
    document.body.innerHTML = `<main class="app-shell"><div class="panel"><h1>No se pudo cargar el juego</h1><p>Comprueba que estás abriendo el juego desde GitHub Pages o desde un servidor local, no directamente como archivo.</p><pre>${error.message}</pre></div></main>`;
  }
}

function fillFilters() {
  $('#typeFilter').innerHTML = '<option value="">Todos los tipos</option>' + state.types.map((type) => `<option>${type}</option>`).join('');
}

function bindEvents() {
  $('#searchInput').addEventListener('input', (event) => { state.filter.q = event.target.value; renderCards(); });
  $('#typeFilter').addEventListener('change', (event) => { state.filter.type = event.target.value; renderCards(); });
  $('#genFilter').addEventListener('change', (event) => { state.filter.gen = event.target.value; renderCards(); });
  $('#modeAiBtn').addEventListener('click', () => setMode('ai'));
  $('#modeLocalBtn').addEventListener('click', () => setMode('local'));
  $('#modeCaptureBtn').addEventListener('click', () => setMode('capture'));
  $('#toggleTypeTableBtn').addEventListener('click', () => $('#typeTablePanel').classList.toggle('hidden'));
  $('#clearTeamsBtn').addEventListener('click', clearTeams);
  $('#startCaptureBtn').addEventListener('click', startCaptureMode);
  $('#backCaptureMenuBtn').addEventListener('click', () => showScreen('setupScreen'));
  $('#resetDexBtn').addEventListener('click', resetDexProgress);
  $('#resetDexBtn2').addEventListener('click', resetDexProgress);
  $('#throwBallBtn').addEventListener('click', checkCaptureAnswer);
  $('#algebraAnswerInput').addEventListener('keydown', (event) => { if (event.key === 'Enter') checkCaptureAnswer(); });
  $('#nextEncounterBtn').addEventListener('click', nextEncounter);
  $('#randomTeamsBtn').addEventListener('click', randomTeams);
  $('#startBattleBtn').addEventListener('click', startBattle);
  $('#newGameBtn').addEventListener('click', () => { clearTeams(); showScreen('setupScreen'); });
  $('#backSetupBtn').addEventListener('click', () => showScreen('setupScreen'));
  $('#resetBattleBtn').addEventListener('click', startBattle);
  $('#resolveBtn').addEventListener('click', saveDeclaredDamage);
  $('#declaredDamageInput').addEventListener('keydown', (event) => { if (event.key === 'Enter') saveDeclaredDamage(); });
  $('#changeMoveBtn').addEventListener('click', backToMoveSelection);
  $('#resolveTurnBtn').addEventListener('click', resolveTurn);
  $('#nextTurnBtn').addEventListener('click', nextTurn);
}

function setMode(mode) {
  state.gameMode = mode;
  if (mode === 'capture') {
    state.teamA = [];
    state.teamB = [];
  } else {
    state.capture.current = null;
  }
  $('.mode-btn').forEach((button) => button.classList.toggle('active', button.dataset.mode === mode));
  renderAll();
}

function clearTeams() {
  state.teamA = [];
  state.teamB = [];
  renderAll();
}

function randomTeams() {
  if (state.gameMode === 'capture') setMode('ai');
  const ids = shuffle(state.cards.map((card) => card.id));
  state.teamA = ids.slice(0, 3);
  state.teamB = ids.slice(3, 6);
  renderAll();
}

function showScreen(id) {
  $$('.screen').forEach((screen) => screen.classList.remove('active'));
  $('#' + id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderAll() {
  renderModeVisibility();
  renderCaptureIntro();
  renderSetupLabels();
  renderTeams();
  renderCards();
  renderStartButton();
}

function renderSetupLabels() {
  const ai = state.gameMode === 'ai';
  $('#teamATitle').textContent = ai ? 'Tu equipo' : 'Equipo A';
  $('#teamBTitle').textContent = ai ? 'Equipo de Paco' : 'Equipo B';
  $('#benchATitle').textContent = ai ? 'Tu equipo' : 'Equipo A';
  $('#benchBTitle').textContent = ai ? 'Equipo de Paco' : 'Equipo B';
  $('#teamHelp').textContent = ai
    ? 'Elige 3 MateMon para tu equipo. Puedes elegir también el equipo de Paco o dejar que se complete automáticamente.'
    : 'Elige 3 MateMon para el Equipo A y 3 MateMon para el Equipo B.';
}

function renderStartButton() {
  if (state.gameMode === 'capture') return;
  const ready = state.gameMode === 'ai' ? state.teamA.length === 3 : state.teamA.length === 3 && state.teamB.length === 3;
  $('#startBattleBtn').disabled = !ready;
  $('#startBattleBtn').textContent = ready ? 'Comenzar batalla' : state.gameMode === 'ai' ? 'Elige 3 cartas para jugar' : 'Elige 3 cartas por equipo';
}

function renderTeams() {
  renderMiniTeam('teamA', state.teamA);
  renderMiniTeam('teamB', state.teamB);
}

function renderMiniTeam(elementId, team) {
  const wrap = $('#' + elementId);
  wrap.innerHTML = '';
  for (let index = 0; index < 3; index++) {
    const card = getCard(team[index]);
    const slot = document.createElement('div');
    slot.className = 'mini-slot' + (!card ? ' empty' : '');
    slot.innerHTML = card
      ? `<img src="${card.image}" alt="${card.name}"><strong>${card.name}</strong><button title="Quitar carta">×</button>`
      : `Hueco ${index + 1}`;
    if (card) {
      slot.querySelector('button').addEventListener('click', () => {
        team.splice(index, 1);
        renderAll();
      });
    }
    wrap.appendChild(slot);
  }
}

function renderCards() {
  const q = norm(state.filter.q);
  const cards = state.cards.filter((card) => {
    const searchable = norm([card.name, card.type1, card.type2, card.moves.map((move) => move.name).join(' ')].join(' '));
    return (!q || searchable.includes(q)) &&
      (!state.filter.type || card.type1 === state.filter.type || card.type2 === state.filter.type) &&
      (!state.filter.gen || String(card.gen) === String(state.filter.gen));
  });
  const grid = $('#cardGrid');
  grid.innerHTML = '';
  cards.forEach((card) => {
    const selectedA = state.teamA.includes(card.id);
    const selectedB = state.teamB.includes(card.id);
    const disabled = selectedA || selectedB;
    const button = document.createElement('button');
    button.className = `monster-card ${selectedA ? 'selected-a' : ''} ${selectedB ? 'selected-b' : ''} ${disabled ? 'disabled' : ''}`;
    button.innerHTML = `
      <img class="card-img" src="${card.image}" alt="${card.name}" loading="lazy">
      <div class="card-content">
        <h3>${card.name}</h3>
        <div class="badges">${badge(card.type1)}${card.type2 ? badge(card.type2) : ''}${badge('Gen ' + card.gen, 'gen')}</div>
        <p><strong>PS:</strong> ${card.hp} · <strong>Velocidad:</strong> ${card.speed}</p>
        <p>${card.moves.map((move) => `${move.name} (${move.type}, ${move.power}${move.priority ? ', prioridad' : ''})`).join('<br>')}</p>
      </div>`;
    button.addEventListener('click', () => chooseCard(card.id));
    grid.appendChild(button);
  });
}

function chooseCard(cardId) {
  if (state.gameMode === 'capture') return;
  if (state.teamA.includes(cardId) || state.teamB.includes(cardId)) return;
  if (state.teamA.length < 3) state.teamA.push(cardId);
  else if (state.teamB.length < 3) state.teamB.push(cardId);
  renderAll();
}

function renderTypeTable() {
  const types = state.types;
  let html = '<table class="type-table"><thead><tr><th>Ataque ↓ / Defensa →</th>' + types.map((type) => `<th>${type}</th>`).join('') + '</tr></thead><tbody>';
  types.forEach((attack) => {
    html += `<tr><th>${attack}</th>`;
    types.forEach((defense) => {
      const value = getEffectiveness(attack, defense);
      const cls = value > 1 ? 'super' : value < 1 ? 'weak' : 'normal';
      html += `<td class="${cls}">${value}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  $('#typeTable').innerHTML = html;
}

function renderModeVisibility() {
  const isCapture = state.gameMode === 'capture';
  ['formulaPanel', 'teamSetupPanel', 'battleToolbar', 'cardGrid'].forEach((id) => {
    const el = $('#' + id);
    if (el) el.classList.toggle('hidden', isCapture);
  });
  $('#captureIntroPanel').classList.toggle('hidden', !isCapture);
  $('#randomTeamsBtn').classList.toggle('hidden', isCapture);
  if (isCapture) $('#typeTablePanel').classList.add('hidden');
}

function loadDexProgress() {
  try {
    const raw = localStorage.getItem(DEX_STORAGE_KEY);
    const ids = raw ? JSON.parse(raw) : [];
    state.capture.captured = new Set(ids.map(Number).filter(Boolean));
  } catch (_) {
    state.capture.captured = new Set();
  }
}

function saveDexProgress() {
  localStorage.setItem(DEX_STORAGE_KEY, JSON.stringify([...state.capture.captured]));
}

function renderCaptureIntro() {
  const total = state.cards.length || 53;
  const captured = state.capture.captured.size;
  const pending = Math.max(0, total - captured);
  const stats = $('#captureIntroStats');
  if (!stats) return;
  stats.innerHTML = `
    <div><strong>${captured}</strong><span>capturados</span></div>
    <div><strong>${pending}</strong><span>pendientes</span></div>
    <div><strong>${total}</strong><span>especies</span></div>`;
}

function resetDexProgress() {
  const ok = confirm('¿Seguro que quieres reiniciar la MateDex? Se perderán las capturas guardadas en este navegador.');
  if (!ok) return;
  state.capture.captured = new Set();
  state.capture.current = null;
  state.capture.task = null;
  state.capture.locked = false;
  state.capture.queue = [];
  saveDexProgress();
  renderCaptureIntro();
  if ($('#captureScreen').classList.contains('active')) nextEncounter();
}

function startCaptureMode() {
  state.capture.queue = shuffle(state.cards.filter((card) => !state.capture.captured.has(Number(card.id))).map((card) => Number(card.id)));
  showScreen('captureScreen');
  nextEncounter();
}

function nextEncounter() {
  const uncaptured = state.cards.filter((card) => !state.capture.captured.has(Number(card.id)));
  state.capture.locked = false;
  $('#captureSolution').classList.add('hidden');
  $('#captureSolution').innerHTML = '';
  $('#nextEncounterBtn').classList.add('hidden');
  $('#throwBallBtn').disabled = false;
  $('#algebraAnswerInput').disabled = false;
  $('#algebraAnswerInput').value = '';
  $('#algebraAnswerInput').classList.remove('shake');

  if (uncaptured.length === 0) {
    state.capture.current = null;
    state.capture.task = null;
    renderCaptureMode(true);
    return;
  }

  if (!state.capture.queue.length) {
    state.capture.queue = shuffle(uncaptured.map((card) => Number(card.id)));
  }
  let nextId = state.capture.queue.shift();
  while (state.capture.captured.has(Number(nextId)) && state.capture.queue.length) nextId = state.capture.queue.shift();
  if (state.capture.captured.has(Number(nextId))) nextId = Number(shuffle(uncaptured)[0].id);
  const card = getCard(nextId);
  const capturedCount = state.capture.captured.size;
  const difficulty = capturedCount < 10 ? 1 : capturedCount < 25 ? 2 : capturedCount < 40 ? 3 : 4;
  state.capture.current = card;
  state.capture.task = generateAlgebraTask(difficulty);
  renderCaptureMode(false);
  setCaptureBanner(`${card.name} salvaje aparece. Resuelve la incógnita para cargar la Master MateBall.`, 'capture');
  setTimeout(() => $('#algebraAnswerInput').focus(), 80);
}

function renderCaptureMode(completed) {
  renderDexGrid();
  const total = state.cards.length;
  const captured = state.capture.captured.size;
  $('#captureProgressLabel').textContent = `MateDex ${captured}/${total}`;
  $('#dexSummary').textContent = `${captured} / ${total}`;
  if (completed) {
    $('#wildCard').innerHTML = `<div class="wild-complete"><div class="master-ball big-ball">M</div><h2>¡MateDex completada!</h2><p>Has capturado las ${total} especies resolviendo incógnitas.</p></div>`;
    $('#algebraTitle').textContent = 'Colección completada';
    $('#algebraHelp').textContent = 'Puedes reiniciar la MateDex para volver a practicar desde cero.';
    $('#equationBox').innerHTML = '<div class="equation-main">¡Reto completado!</div>';
    $('#algebraHint').innerHTML = '<strong>Buen trabajo:</strong> has practicado ecuaciones lineales, paréntesis, incógnitas a ambos lados y segundo grado.';
    $('#throwBallBtn').disabled = true;
    $('#algebraAnswerInput').disabled = true;
    return;
  }

  const card = state.capture.current;
  const task = state.capture.task;
  const diffName = ['', 'Lineal básica', 'Lineal con dos pasos', 'Paréntesis / ambos lados', 'Segundo grado'][task.difficulty] || 'Álgebra';
  $('#wildCard').innerHTML = `
    <div class="wild-label">MateMon salvaje</div>
    <img class="wild-img" src="${card.image}" alt="${card.name}">
    <div class="wild-body">
      <h2>${card.name}</h2>
      <div class="badges">${badge(card.type1)}${card.type2 ? badge(card.type2) : ''}</div>
      <p><strong>Estado:</strong> pendiente de capturar</p>
      <div class="ball-lock"><span class="master-ball">M</span><strong>Master MateBall bloqueada</strong></div>
    </div>`;
  $('#algebraTitle').textContent = `${diffName}`;
  $('#algebraHelp').textContent = task.answers.length > 1 ? 'Esta ecuación tiene dos soluciones. Escríbelas separadas por coma. El orden no importa.' : 'Calcula el valor de x y escríbelo para intentar capturar.';
  $('#equationBox').innerHTML = `<div class="equation-label">Resuelve:</div><div class="equation-main">${task.equation}</div>`;
  $('#algebraHint').innerHTML = `<strong>Pista:</strong> ${task.hint}`;
}

function renderDexGrid() {
  const grid = $('#mateDexGrid');
  if (!grid) return;
  grid.innerHTML = state.cards.map((card, index) => {
    const caught = state.capture.captured.has(Number(card.id));
    return `<div class="dex-card ${caught ? 'caught' : 'locked'}">
      <div class="dex-number">#${String(index + 1).padStart(2, '0')}</div>
      <img src="${card.image}" alt="${card.name}">
      <strong>${caught ? card.name : '???'}</strong>
      <span>${caught ? '✓ Capturado' : 'Pendiente'}</span>
    </div>`;
  }).join('');
}

function setCaptureBanner(text, kind = 'capture') {
  const el = $('#captureBanner');
  el.className = `battle-comment ${kind}`;
  el.textContent = text;
}

function randint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function signed(n) { return n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`; }
function coef(n) { if (n === 1) return 'x'; if (n === -1) return '-x'; return `${n}x`; }

function generateAlgebraTask(difficulty) {
  if (difficulty === 1) return generateLevel1();
  if (difficulty === 2) return generateLevel2();
  if (difficulty === 3) return generateLevel3();
  return generateLevel4();
}

function generateLevel1() {
  const x = randint(-9, 12);
  if (Math.random() < 0.5) {
    const a = randint(-8, 9) || 4;
    const b = x + a;
    return { difficulty: 1, equation: `x ${signed(a)} = ${b}`, answers: [x], hint: `Aísla la x haciendo la operación contraria: si aparece ${signed(a)}, debes compensarlo en el otro lado.`, steps: [`x ${signed(a)} = ${b}`, `x = ${b} ${signed(-a)}`, `x = ${x}`] };
  }
  const a = pick([2,3,4,5,6,7,8,9]);
  return { difficulty: 1, equation: `${a}x = ${a * x}`, answers: [x], hint: `La x está multiplicada por ${a}. Divide ambos lados entre ${a}.`, steps: [`${a}x = ${a * x}`, `x = ${a * x} ÷ ${a}`, `x = ${x}`] };
}

function generateLevel2() {
  const x = randint(-8, 12);
  const a = pick([2,3,4,5,6,7,8,9]);
  const b = randint(-12, 12) || 5;
  const c = a * x + b;
  return { difficulty: 2, equation: `${coef(a)} ${signed(b)} = ${c}`, answers: [x], hint: `Primero quita el ${b >= 0 ? '+' : '-'} ${Math.abs(b)}. Después divide entre ${a}.`, steps: [`${coef(a)} ${signed(b)} = ${c}`, `${coef(a)} = ${c} ${signed(-b)}`, `${coef(a)} = ${a * x}`, `x = ${a * x} ÷ ${a}`, `x = ${x}`] };
}

function generateLevel3() {
  const x = randint(-7, 10);
  if (Math.random() < 0.5) {
    const a = pick([2,3,4,5]);
    const b = randint(-6, 6) || 3;
    const c = randint(-8, 8) || -2;
    const d = a * (x + b) + c;
    return { difficulty: 3, equation: `${a}(x ${signed(b)}) ${signed(c)} = ${d}`, answers: [x], hint: `Puedes empezar desarrollando el paréntesis o quitar primero el término exterior. Recuerda hacer lo mismo en ambos lados.`, steps: [`${a}(x ${signed(b)}) ${signed(c)} = ${d}`, `${coef(a)} ${signed(a*b)} ${signed(c)} = ${d}`, `${coef(a)} ${signed(a*b+c)} = ${d}`, `${coef(a)} = ${d} ${signed(-(a*b+c))}`, `${coef(a)} = ${a*x}`, `x = ${x}`] };
  }
  const a = pick([2,3,4,5,6]);
  let c = pick([1,2,3,4,5]);
  if (c === a) c += 1;
  const b = randint(-10, 10) || 4;
  const d = a * x + b - c * x;
  return { difficulty: 3, equation: `${coef(a)} ${signed(b)} = ${coef(c)} ${signed(d)}`, answers: [x], hint: `Junta las x en un lado y los números en el otro. Después divide por el coeficiente de x.`, steps: [`${coef(a)} ${signed(b)} = ${coef(c)} ${signed(d)}`, `${coef(a-c)} = ${d} ${signed(-b)}`, `${coef(a-c)} = ${(a-c)*x}`, `x = ${(a-c)*x} ÷ ${a-c}`, `x = ${x}`] };
}

function generateLevel4() {
  let r1 = randint(-8, 8);
  let r2 = randint(-8, 8);
  if (r1 === r2) r2 = r1 + 2;
  const sum = r1 + r2;
  const prod = r1 * r2;
  const bText = sum === 0 ? '' : ` ${signed(-sum)}x`;
  const cText = prod === 0 ? '' : ` ${signed(prod)}`;
  return { difficulty: 4, equation: `x²${bText}${cText} = 0`, answers: [r1, r2].sort((a,b)=>a-b), hint: `Busca dos números que multiplicados den ${prod} y sumados den ${sum}. Esos números son las soluciones.`, steps: [`x²${bText}${cText} = 0`, `Forma factorizada: (x ${signed(-r1)})(x ${signed(-r2)}) = 0`, `Si un producto vale 0, uno de los factores vale 0.`, `x = ${r1} o x = ${r2}`] };
}

function parseAnswers(text) {
  return String(text || '').replace(/;/g, ',').split(',').map((part) => part.trim()).filter(Boolean).map((part) => {
    const frac = part.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
    if (frac) return Number(frac[1]) / Number(frac[2]);
    return Number(part.replace(',', '.'));
  }).filter((value) => Number.isFinite(value));
}

function sameAnswerSet(user, correct) {
  if (user.length !== correct.length) return false;
  const a = [...user].sort((x,y)=>x-y);
  const b = [...correct].sort((x,y)=>x-y);
  return a.every((value, index) => Math.abs(value - b[index]) < 0.001);
}

function formatAnswerList(values) {
  return values.sort((a,b)=>a-b).map((v) => Number.isInteger(v) ? String(v) : String(Number(v.toFixed(3))).replace('.', ',')).join(', ');
}

function checkCaptureAnswer() {
  if (state.capture.locked || !state.capture.current || !state.capture.task) return;
  const userText = $('#algebraAnswerInput').value;
  const userAnswers = parseAnswers(userText);
  const task = state.capture.task;
  const correct = sameAnswerSet(userAnswers, task.answers);
  state.capture.locked = true;
  $('#throwBallBtn').disabled = true;
  $('#algebraAnswerInput').disabled = true;
  $('#captureSolution').classList.remove('hidden');
  $('#nextEncounterBtn').classList.remove('hidden');
  const card = state.capture.current;

  if (correct) {
    state.capture.captured.add(Number(card.id));
    saveDexProgress();
    setCaptureBanner(`¡Correcto! Master MateBall cargada. ${card.name} ha sido capturado.`, 'good');
    $('#wildCard').classList.add('capture-success');
    $('#captureSolution').innerHTML = `<h3>✅ Captura conseguida</h3><p><strong>${card.name}</strong> queda registrado en la MateDex y no volverá a aparecer en la rotación.</p>${renderSteps(task)}`;
  } else {
    setCaptureBanner(`${card.name} ha huido. Revisa la solución y sigue con el siguiente encuentro.`, 'bad');
    $('#wildCard').classList.add('capture-flee');
    $('#algebraAnswerInput').classList.add('shake');
    state.capture.queue.push(Number(card.id));
    $('#captureSolution').innerHTML = `<h3>💨 El MateMon huyó</h3><p>Tu respuesta: <strong>${userText || 'vacía'}</strong>. Respuesta correcta: <strong>${formatAnswerList(task.answers)}</strong>.</p>${renderSteps(task)}`;
  }
  setTimeout(() => $('#wildCard').classList.remove('capture-success', 'capture-flee'), 900);
  renderCaptureIntro();
  renderDexGrid();
  $('#captureProgressLabel').textContent = `MateDex ${state.capture.captured.size}/${state.cards.length}`;
  $('#dexSummary').textContent = `${state.capture.captured.size} / ${state.cards.length}`;
}

function renderSteps(task) {
  return `<div class="solution-steps"><h4>Solución paso a paso</h4><ol>${task.steps.map((step) => `<li>${step}</li>`).join('')}</ol></div>`;
}

function completeAiTeamIfNeeded() {
  if (state.gameMode !== 'ai') return;
  const used = new Set([...state.teamA, ...state.teamB]);
  const available = shuffle(state.cards.map((card) => card.id).filter((id) => !used.has(id)));
  while (state.teamB.length < 3 && available.length) state.teamB.push(available.shift());
}

function startBattle() {
  if (state.teamA.length < 3) return;
  completeAiTeamIfNeeded();
  if (state.teamB.length < 3) return;
  state.battle = {
    turn: 1,
    phase: 'selectA',
    teamA: state.teamA.map(makeFighter),
    teamB: state.teamB.map(makeFighter),
    selected: { A: null, B: null },
    declared: { A: null, B: null },
    log: [],
    winner: null,
  };
  showScreen('battleScreen');
  pushLog('Comienza el combate. Primero se eligen ambos movimientos; después se comprueba prioridad y velocidad.');
  setComment('Turno 1: elige el movimiento de tu MateMon.', 'info');
  renderBattle();
}

function makeFighter(id) {
  const card = getCard(id);
  return { ...card, maxHp: Number(card.hp), hp: Number(card.hp) };
}

function renderBattle() {
  if (!state.battle) return;
  const activeA = getActive('A');
  const activeB = getActive('B');
  renderFighter('fighterA', activeA, 'A');
  renderFighter('fighterB', activeB, 'B');
  renderBench('benchA', state.battle.teamA, activeA);
  renderBench('benchB', state.battle.teamB, activeB);
  renderLog();
  renderSelectedSummary();
  renderBattleControls();
}

function renderFighter(elementId, fighter, side) {
  const el = $('#' + elementId);
  if (!fighter) {
    el.innerHTML = '<div class="empty-fighter">Sin MateMon</div>';
    return;
  }
  const hpPct = Math.max(0, Math.round((fighter.hp / fighter.maxHp) * 100));
  el.innerHTML = `
    <div class="fighter-label">${side === 'A' ? (state.gameMode === 'ai' ? 'Tú' : 'Equipo A') : (state.gameMode === 'ai' ? 'IA Paco' : 'Equipo B')}</div>
    <img class="fighter-img" src="${fighter.image}" alt="${fighter.name}">
    <div class="fighter-body">
      <h2>${fighter.name}</h2>
      <div class="badges">${badge(fighter.type1)}${fighter.type2 ? badge(fighter.type2) : ''}</div>
      <div class="stats-line"><strong>Velocidad:</strong> ${fighter.speed}</div>
      <div class="hp-row"><span>PS</span><strong>${fighter.hp}/${fighter.maxHp}</strong></div>
      <div class="hp-bar"><span style="width:${hpPct}%"></span></div>
    </div>`;
}

function renderBench(elementId, team, active) {
  const el = $('#' + elementId);
  el.innerHTML = team.map((fighter) => {
    const hpPct = Math.max(0, Math.round((fighter.hp / fighter.maxHp) * 100));
    const cls = fighter.hp <= 0 ? 'ko' : active && fighter.id === active.id ? 'active' : '';
    return `<div class="bench-card ${cls}"><img src="${fighter.image}" alt="${fighter.name}"><div><strong>${fighter.name}</strong><small>${fighter.hp}/${fighter.maxHp} PS</small><div class="mini-hp"><span style="width:${hpPct}%"></span></div></div></div>`;
  }).join('');
}

function renderSelectedSummary() {
  const box = $('#selectedMovesSummary');
  const selectedA = state.battle.selected.A;
  const selectedB = state.battle.selected.B;
  if (!selectedA && !selectedB) {
    box.classList.add('hidden');
    box.innerHTML = '';
    return;
  }
  const nameA = selectedA ? selectedA.move.name : 'Pendiente';
  const nameB = selectedB ? selectedB.move.name : 'Pendiente';
  box.classList.remove('hidden');
  box.innerHTML = `
    <div><strong>${state.gameMode === 'ai' ? 'Tu movimiento' : 'Equipo A'}:</strong> ${nameA}</div>
    <div><strong>${state.gameMode === 'ai' ? 'Movimiento de Paco' : 'Equipo B'}:</strong> ${nameB}</div>`;
}

function renderBattleControls() {
  const b = state.battle;
  $('#turnLabel').textContent = b.winner ? 'Combate terminado' : `Turno ${b.turn}`;
  $('#winnerBanner').classList.toggle('hidden', !b.winner);
  if (b.winner) $('#winnerBanner').textContent = b.winner;

  $('#moveButtons').innerHTML = '';
  $('#mathTask').classList.add('hidden');
  $('#damageEntry').classList.add('hidden');
  $('#resolveTurnBtn').classList.add('hidden');
  $('#nextTurnBtn').classList.add('hidden');
  $('#changeMoveBtn').classList.add('hidden');

  if (b.winner) {
    $('#phaseTitle').textContent = 'Fin del combate';
    $('#phaseHelp').textContent = 'Puedes reiniciar el combate o volver a elegir equipos.';
    return;
  }

  const canChangeMove = ['selectB', 'damageA', 'damageB', 'ready'].includes(b.phase) && (b.selected.A || b.selected.B);
  $('#changeMoveBtn').classList.toggle('hidden', !canChangeMove);

  if (b.phase === 'selectA') {
    const activeA = getActive('A');
    $('#phaseTitle').textContent = state.gameMode === 'ai' ? 'Elige tu movimiento' : 'Equipo A: elige movimiento';
    $('#phaseHelp').textContent = 'Todavía no se ataca. Primero ambos MateMon deben elegir movimiento.';
    renderMoveButtons(activeA, 'A');
  } else if (b.phase === 'selectB') {
    const activeB = getActive('B');
    $('#phaseTitle').textContent = 'Equipo B: elige movimiento';
    $('#phaseHelp').textContent = 'Cuando el Equipo B elija, tocará calcular los daños antes de resolver.';
    renderMoveButtons(activeB, 'B');
  } else if (b.phase === 'damageA') {
    askDamage('A');
  } else if (b.phase === 'damageB') {
    askDamage('B');
  } else if (b.phase === 'ready') {
    $('#phaseTitle').textContent = 'Todo listo para resolver';
    $('#phaseHelp').textContent = 'Ahora se comprueba prioridad. Si ambos ataques tienen la misma prioridad, ataca primero el MateMon con más velocidad.';
    $('#resolveTurnBtn').classList.remove('hidden');
  } else if (b.phase === 'resolved') {
    $('#phaseTitle').textContent = 'Turno resuelto';
    $('#phaseHelp').textContent = 'Lee el registro para revisar aciertos, fallos y operaciones.';
    $('#nextTurnBtn').classList.remove('hidden');
  }
}

function renderMoveButtons(attacker, side) {
  const defender = side === 'A' ? getActive('B') : getActive('A');
  $('#moveButtons').innerHTML = attacker.moves.map((move, index) => {
    const calc = calculateDamage(attacker, defender, move);
    const p = move.priority ? '<span class="priority-tag">Prioridad</span>' : '';
    return `<button class="move-btn" data-index="${index}">
      <strong>${move.name}</strong>${p}
      <span>${badge(move.type)} Potencia ${move.power}</span>
      <small>${typeComment(calc.multiplier)} ${calc.stab === 1.5 ? 'Tiene STAB.' : 'Sin STAB.'}</small>
    </button>`;
  }).join('');
  $$('.move-btn').forEach((btn) => btn.addEventListener('click', () => selectMove(side, Number(btn.dataset.index))));
}

function selectMove(side, moveIndex) {
  const attacker = getActive(side);
  const move = attacker.moves[moveIndex];
  state.battle.selected[side] = { side, attackerId: attacker.id, moveIndex, move };
  state.battle.declared[side] = null;

  if (state.gameMode === 'ai' && side === 'A') {
    selectAiMove();
    state.battle.phase = 'damageA';
    const aiMove = state.battle.selected.B.move;
    setComment(`Paco ya ha elegido ${aiMove.name}. Ahora calcula tu daño antes de que se resuelva el turno.`, 'info');
    pushLog(`Elegiste ${move.name}. Paco prepara ${aiMove.name}.`);
  } else if (side === 'A') {
    state.battle.phase = 'selectB';
    setComment('Movimiento del Equipo A guardado. Ahora elige el movimiento del Equipo B.', 'info');
  } else {
    state.battle.phase = 'damageA';
    setComment('Ambos movimientos están elegidos. Ahora toca calcular el daño del Equipo A.', 'info');
  }
  renderBattle();
}

function selectAiMove() {
  const attacker = getActive('B');
  const defender = getActive('A');
  const scored = attacker.moves.map((move, index) => {
    const calc = calculateDamage(attacker, defender, move);
    return {
      index,
      move,
      damage: calc.amount,
      raw: calc.raw,
      priority: move.priority ? 1 : 0,
      power: Number(move.power) || 0,
    };
  });

  // Paco elige de forma determinista el movimiento que más daño real hace.
  // En empate, prioriza movimientos con prioridad; después, mayor potencia.
  scored.sort((a, b) =>
    b.damage - a.damage ||
    b.raw - a.raw ||
    b.priority - a.priority ||
    b.power - a.power ||
    a.index - b.index
  );

  const choice = scored[0];
  state.battle.selected.B = { side: 'B', attackerId: attacker.id, moveIndex: choice.index, move: choice.move };
  state.battle.declared.B = choice.damage;
}

function backToMoveSelection() {
  const b = state.battle;
  if (!b || b.winner || !['selectB', 'damageA', 'damageB', 'ready'].includes(b.phase)) return;

  b.selected = { A: null, B: null };
  b.declared = { A: null, B: null };
  b.phase = 'selectA';

  $('#declaredDamageInput').value = '';
  setComment('Movimiento cancelado. Vuelve a elegir ataque: después Paco/Equipo B elegirá y se resolverá la prioridad.', 'info');
  pushLog('Se cancela la elección de movimiento para repetir la selección del turno.');
  renderBattle();
}

function askDamage(side) {
  const label = side === 'A' ? (state.gameMode === 'ai' ? 'tu MateMon' : 'Equipo A') : 'Equipo B';
  const attacker = getActive(side);
  const defender = side === 'A' ? getActive('B') : getActive('A');
  const move = state.battle.selected[side].move;
  const explanation = makeMathExplanation(attacker, defender, move);
  $('#phaseTitle').textContent = `Calcula el daño de ${label}`;
  $('#phaseHelp').textContent = 'El movimiento ya está elegido. Haz la operación y escribe el resultado entero exacto.';
  $('#mathTask').classList.remove('hidden');
  $('#mathTask').innerHTML = `
    <div class="math-head">
      <div><strong>${attacker.name}</strong> usa <strong>${move.name}</strong> contra <strong>${defender.name}</strong></div>
      <div class="math-formula">${move.power} × ${explanation.calc.multiplier} × ${explanation.calc.stab} = ?</div>
    </div>
    <ol>${explanation.steps.slice(0, 3).map((step) => `<li>${step}</li>`).join('')}</ol>
    <div class="tip-box"><strong>Sugerencia:</strong> multiplica primero la efectividad. Después aplica el STAB. Al final redondea al entero más cercano.</div>`;
  $('#damageEntry').classList.remove('hidden');
  $('#damageLabel').textContent = `Daño calculado por ${label}`;
  $('#declaredDamageInput').value = state.battle.declared[side] ?? '';
  $('#declaredDamageInput').focus();
  $('#resolveBtn').textContent = state.gameMode === 'ai' && side === 'A' ? 'Guardar y resolver turno' : 'Guardar cálculo';
}

function saveDeclaredDamage() {
  const b = state.battle;
  if (!['damageA', 'damageB'].includes(b.phase)) return;
  const side = b.phase === 'damageA' ? 'A' : 'B';
  const value = safeInt($('#declaredDamageInput').value);
  if (value === null) {
    setComment('Escribe un número entero. No uses decimales ni letras.', 'bad');
    $('#declaredDamageInput').classList.add('shake');
    setTimeout(() => $('#declaredDamageInput').classList.remove('shake'), 500);
    return;
  }
  b.declared[side] = value;

  if (side === 'A' && state.gameMode === 'ai') {
    b.phase = 'ready';
    setComment('Cálculo guardado. Ahora se resolverá el turno según prioridad y velocidad.', 'good');
  } else if (side === 'A') {
    b.phase = 'damageB';
    setComment('Cálculo del Equipo A guardado. Ahora calcula el daño del Equipo B.', 'info');
  } else {
    b.phase = 'ready';
    setComment('Cálculos guardados. Ya se puede resolver el turno completo.', 'good');
  }
  renderBattle();
}

function getActionOrder() {
  const a = getActive('A');
  const b = getActive('B');
  const actionA = { side: 'A', attacker: a, defenderSide: 'B', move: state.battle.selected.A.move, declared: state.battle.declared.A };
  const actionB = { side: 'B', attacker: b, defenderSide: 'A', move: state.battle.selected.B.move, declared: state.battle.declared.B };
  const priA = actionA.move.priority ? 1 : 0;
  const priB = actionB.move.priority ? 1 : 0;
  if (priA !== priB) return priA > priB ? [actionA, actionB] : [actionB, actionA];
  if (Number(a.speed) !== Number(b.speed)) return Number(a.speed) > Number(b.speed) ? [actionA, actionB] : [actionB, actionA];
  return Math.random() < 0.5 ? [actionA, actionB] : [actionB, actionA];
}

function resolveTurn() {
  const b = state.battle;
  if (b.phase !== 'ready') return;
  const order = getActionOrder();
  const first = order[0];
  const second = order[1];
  const priText = first.move.priority !== second.move.priority
    ? `${first.attacker.name} actúa primero porque su movimiento tiene prioridad.`
    : Number(first.attacker.speed) !== Number(second.attacker.speed)
      ? `${first.attacker.name} actúa primero por tener más velocidad.`
      : `Empate de velocidad: ${first.attacker.name} actúa primero por sorteo.`;
  pushLog(`<strong>Orden del turno:</strong> ${priText}`);
  setComment(priText, 'info');

  runAction(order[0]);
  if (!b.winner) runAction(order[1]);
  checkWinner();
  b.phase = b.winner ? 'finished' : 'resolved';
  renderBattle();
}

function runAction(action) {
  const attacker = getActive(action.side);
  const defender = getActive(action.defenderSide);
  if (!attacker || !defender || attacker.hp <= 0) return;
  const move = action.move;
  const calc = calculateDamage(attacker, defender, move);
  const correct = Number(action.declared) === calc.amount;
  const label = action.side === 'A' ? (state.gameMode === 'ai' ? 'Tu cálculo' : 'Cálculo A') : (state.gameMode === 'ai' ? 'Cálculo de Paco' : 'Cálculo B');
  if (!correct) {
    pushLog(`<span class="bad-text">${attacker.name} falla ${move.name}</span>. ${label}: ${action.declared}. Resultado correcto: ${calc.amount}. Operación: ${move.power} × ${calc.multiplier} × ${calc.stab} = ${formatNumber(calc.raw)} → ${calc.amount}.`);
    animateFighter(action.side, 'miss');
    setComment(`¡Casi! ${attacker.name} falló porque el daño correcto era ${calc.amount}, no ${action.declared}.`, 'bad');
    return;
  }

  defender.hp = Math.max(0, defender.hp - calc.amount);
  pushLog(`<span class="good-text">${attacker.name} acierta ${move.name}</span> e inflige <strong>${calc.amount}</strong> PS. Operación: ${move.power} × ${calc.multiplier} × ${calc.stab} = ${formatNumber(calc.raw)} → ${calc.amount}. ${typeComment(calc.multiplier)}`);
  animateFighter(action.side, 'attack');
  animateFighter(action.defenderSide, 'hit');
  setComment(`¡Correcto! ${attacker.name} hace ${calc.amount} puntos de daño.`, 'good');
  if (defender.hp <= 0) {
    pushLog(`<strong>${defender.name} queda debilitado.</strong>`);
    setComment(`${defender.name} queda debilitado. Entra el siguiente MateMon del equipo.`, 'ko');
  }
  checkWinner();
}

function animateFighter(side, animation) {
  const el = side === 'A' ? $('#fighterA') : $('#fighterB');
  el.classList.remove('anim-attack', 'anim-hit', 'anim-miss');
  void el.offsetWidth;
  el.classList.add(`anim-${animation}`);
  setTimeout(() => el.classList.remove(`anim-${animation}`), 650);
}

function checkWinner() {
  const b = state.battle;
  if (isTeamDefeated(b.teamA)) b.winner = state.gameMode === 'ai' ? 'Gana Paco' : 'Gana el Equipo B';
  if (isTeamDefeated(b.teamB)) b.winner = state.gameMode === 'ai' ? '¡Ganaste a Paco!' : 'Gana el Equipo A';
  if (b.winner) pushLog(`<strong>${b.winner}</strong>`);
}

function nextTurn() {
  const b = state.battle;
  if (b.winner) return;
  b.turn += 1;
  b.phase = 'selectA';
  b.selected = { A: null, B: null };
  b.declared = { A: null, B: null };
  setComment(`Turno ${b.turn}: elegid movimientos antes de calcular el daño.`, 'info');
  renderBattle();
}

function pushLog(message) {
  if (!state.battle) return;
  state.battle.log.unshift({ turn: state.battle.turn, message });
}

function renderLog() {
  $('#battleLog').innerHTML = state.battle.log.map((item) => `<div class="log-item"><span>Turno ${item.turn}</span>${item.message}</div>`).join('');
}

function setComment(text, kind = 'info') {
  const el = $('#battleComment');
  el.className = `battle-comment ${kind}`;
  el.textContent = text;
}

init();
