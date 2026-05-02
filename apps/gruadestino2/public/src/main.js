(() => {
  'use strict';

  const SAVE_KEY = 'grua_destino_autoaventura_ligera_v1';
  const chapters = Array.isArray(window.CHAPTERS) ? window.CHAPTERS : [];
  const imageMap = {
    '00':'00-menu-poster.jpg','01':'01-sueno-contenedor.jpg','02':'02-plan-maestro.jpg','03':'03-collage-esperanza.jpg','04':'04-llegada-grua.jpg','05':'05-ui-destino.jpg','06':'06-maniobra-imposible.jpg','07':'07-tablero-riesgos.jpg','08':'08-contrato-y-control.jpg','09':'09-desastre-huerto.jpg','10':'10-panel-crisis.jpg','11':'11-control-danos.jpg','12':'12-dashboard-ruina.jpg','13':'13-menu-ruina.jpg','14':'14-casa-terrible.jpg','15':'15-manual-supervivencia.jpg','16':'16-noche-contenedor.jpg','17':'17-facturas.jpg','18':'18-banco-gva.jpg','19':'19-caida-total.jpg','20':'20-manual-del-desastre.jpg','21':'21-sistema-caos.jpg','22':'22-aula-fp.jpg','23':'23-resumen-ui.jpg','24':'24-despliegue-final.jpg','25':'25-final-epilogo.jpg','26':'26-creditos.jpg','27':'27-artbook-final.jpg','28':'28-dossier-autoaventura.jpg','29':'29-galeria-caos.jpg'
  };

  let chapterIndex = 0;
  let stepIndex = 0;

  const $ = (id) => document.getElementById(id);
  const screens = { menu: $('menu'), game: $('game'), ending: $('ending') };
  const el = {
    sceneImage: $('sceneImage'), counter: $('counter'), title: $('title'), place: $('place'),
    progressText: $('progressText'), bar: $('bar'), speaker: $('speaker'), dialogue: $('dialogue'), objective: $('objective'),
    continueBtn: $('continueBtn'), nextBtn: $('nextBtn')
  };

  function clamp(n, min, max) { return Math.max(min, Math.min(max, Number.isFinite(n) ? n : min)); }
  function show(name) { Object.entries(screens).forEach(([k, v]) => v.classList.toggle('hidden', k !== name)); }
  function save(finished = false) { localStorage.setItem(SAVE_KEY, JSON.stringify({ chapterIndex, stepIndex, finished, updatedAt: Date.now() })); }
  function load() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch { return null; } }
  function clear() { localStorage.removeItem(SAVE_KEY); }
  function imagePath(chapter) { const id = String(chapter.id).padStart(2, '0'); return 'assets/' + (imageMap[id] || '00-menu-poster.jpg'); }
  function totalSteps() { return chapters.reduce((sum, ch) => sum + ch.steps.length, 0); }
  function currentStepNumber() { return chapters.slice(0, chapterIndex).reduce((sum, ch) => sum + ch.steps.length, 0) + stepIndex + 1; }

  function updateContinue() {
    const s = load();
    const ok = !!s && !s.finished;
    el.continueBtn.disabled = !ok;
    el.continueBtn.textContent = ok ? 'Continuar' : 'Continuar no disponible';
  }

  function start(fromSave = false) {
    if (!chapters.length) {
      alert('No se han cargado los datos de la Autoaventura. Revisa src/data.js.');
      return;
    }
    const s = fromSave ? load() : null;
    if (s && !s.finished) {
      chapterIndex = clamp(Number(s.chapterIndex), 0, chapters.length - 1);
      stepIndex = clamp(Number(s.stepIndex), 0, chapters[chapterIndex].steps.length - 1);
    } else {
      chapterIndex = 0;
      stepIndex = 0;
      clear();
    }
    show('game');
    render();
  }

  function render() {
    const chapter = chapters[chapterIndex];
    const step = chapter.steps[stepIndex] || ['Sistema', 'Paso no encontrado.'];
    el.sceneImage.onerror = () => { el.sceneImage.style.display = 'none'; };
    el.sceneImage.onload = () => { el.sceneImage.style.display = 'block'; };
    el.sceneImage.src = imagePath(chapter);
    el.counter.textContent = `Pantalla ${chapterIndex + 1} de ${chapters.length}`;
    el.title.textContent = chapter.title || '';
    el.place.textContent = chapter.place || '';
    const done = currentStepNumber();
    const total = totalSteps();
    el.progressText.textContent = `Paso ${stepIndex + 1}/${chapter.steps.length} · Progreso ${done}/${total}`;
    el.bar.style.width = `${Math.round((done / total) * 100)}%`;
    el.speaker.textContent = step[0] || 'Narrador';
    el.dialogue.textContent = step[1] || '';
    el.objective.textContent = chapter.objective || 'Pulsa Siguiente paso para avanzar.';
    const last = chapterIndex === chapters.length - 1 && stepIndex === chapter.steps.length - 1;
    el.nextBtn.textContent = last ? 'Ver final ▶' : 'Siguiente paso ▶';
    save(false);
  }

  function next() {
    const chapter = chapters[chapterIndex];
    const last = chapterIndex === chapters.length - 1 && stepIndex === chapter.steps.length - 1;
    if (last) { save(true); show('ending'); updateContinue(); return; }
    if (stepIndex < chapter.steps.length - 1) stepIndex += 1;
    else { chapterIndex += 1; stepIndex = 0; }
    render();
  }

  function skip() {
    if (chapterIndex < chapters.length - 1) { chapterIndex += 1; stepIndex = 0; render(); }
    else { save(true); show('ending'); updateContinue(); }
  }

  function menu() { show('menu'); updateContinue(); }
  function restart() { if (confirm('¿Reiniciar la Autoaventura desde el principio?')) start(false); }

  $('startBtn').addEventListener('click', () => start(false));
  $('continueBtn').addEventListener('click', () => start(true));
  $('resetBtn').addEventListener('click', () => { clear(); updateContinue(); alert('Progreso borrado.'); });
  $('nextBtn').addEventListener('click', next);
  $('skipBtn').addEventListener('click', skip);
  $('backMenuBtn').addEventListener('click', menu);
  $('restartBtn').addEventListener('click', restart);
  $('againBtn').addEventListener('click', () => start(false));
  $('endingMenuBtn').addEventListener('click', menu);
  document.addEventListener('keydown', (ev) => { if (!screens.game.classList.contains('hidden') && (ev.key === ' ' || ev.key === 'Enter')) next(); });

  updateContinue();
})();
