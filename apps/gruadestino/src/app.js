
(() => {
  'use strict';

  const SAVE_KEY = 'grua_destino_canvas_auto_v1';
  const chapters = Array.isArray(window.CHAPTERS) ? window.CHAPTERS : [];
  const imageMap = {
    '00':'00-menu-poster.jpg','01':'01-sueno-contenedor.jpg','02':'02-plan-maestro.jpg','03':'03-collage-esperanza.jpg','04':'04-llegada-grua.jpg','05':'05-ui-destino.jpg','06':'06-maniobra-imposible.jpg','07':'07-tablero-riesgos.jpg','08':'08-contrato-y-control.jpg','09':'09-desastre-huerto.jpg','10':'10-panel-crisis.jpg','11':'11-control-danos.jpg','12':'12-dashboard-ruina.jpg','13':'13-menu-ruina.jpg','14':'14-casa-terrible.jpg','15':'15-manual-supervivencia.jpg','16':'16-noche-contenedor.jpg','17':'17-facturas.jpg','18':'18-banco-gva.jpg','19':'19-caida-total.jpg','20':'20-manual-del-desastre.jpg','21':'21-sistema-caos.jpg','22':'22-aula-fp.jpg','23':'23-resumen-ui.jpg','24':'24-despliegue-final.jpg','25':'25-final-epilogo.jpg','26':'26-creditos.jpg','27':'27-artbook-final.jpg','28':'28-dossier-autoaventura.jpg','29':'29-galeria-caos.jpg'
  };

  const state = {
    screen: 'menu',
    chapterIndex: 0,
    stepIndex: 0,
    loaded: false,
    currentImage: null,
    currentImagePath: '',
    loading: false,
  };

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const statusEl = document.getElementById('headerStatus');

  const controls = {
    menu: document.getElementById('menuControls'),
    game: document.getElementById('gameControls'),
    ending: document.getElementById('endingControls')
  };

  const btn = {
    start: document.getElementById('startBtn'),
    continue: document.getElementById('continueBtn'),
    reset: document.getElementById('resetBtn'),
    menu: document.getElementById('menuBtn'),
    restart: document.getElementById('restartBtn'),
    skip: document.getElementById('skipBtn'),
    next: document.getElementById('nextBtn'),
    again: document.getElementById('againBtn'),
    endingMenu: document.getElementById('endingMenuBtn')
  };

  const imageCache = new Map();

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, Number.isFinite(n) ? n : min));
  }

  function save(finished = false) {
    const payload = {
      chapterIndex: state.chapterIndex,
      stepIndex: state.stepIndex,
      finished,
      updatedAt: Date.now()
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
  }

  function loadSave() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); }
    catch (_) { return null; }
  }

  function clearSave() {
    localStorage.removeItem(SAVE_KEY);
  }

  function updateContinue() {
    const s = loadSave();
    const ok = !!s && !s.finished;
    btn.continue.disabled = !ok;
    btn.continue.textContent = ok ? 'Continuar' : 'Continuar no disponible';
  }

  function setScreen(screen) {
    state.screen = screen;
    controls.menu.classList.toggle('hidden', screen !== 'menu');
    controls.game.classList.toggle('hidden', screen !== 'game');
    controls.ending.classList.toggle('hidden', screen !== 'ending');
    render();
  }

  function imagePathForChapter(chapter) {
    const id = String(chapter.id).padStart(2, '0');
    return `assets/${imageMap[id] || '00-menu-poster.jpg'}`;
  }

  function totalSteps() {
    return chapters.reduce((sum, ch) => sum + ch.steps.length, 0);
  }

  function currentStepNumber() {
    return chapters.slice(0, state.chapterIndex).reduce((sum, ch) => sum + ch.steps.length, 0) + state.stepIndex + 1;
  }

  function fitCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(320, Math.floor(rect.width));
    const height = Math.max(180, Math.floor(width * 9 / 16));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    render();
  }

  function preloadImage(src, onDone) {
    if (!src) {
      state.currentImage = null;
      state.currentImagePath = '';
      onDone && onDone();
      return;
    }
    if (imageCache.has(src)) {
      state.currentImage = imageCache.get(src);
      state.currentImagePath = src;
      onDone && onDone();
      return;
    }
    state.loading = true;
    const img = new Image();
    img.onload = () => {
      imageCache.set(src, img);
      state.currentImage = img;
      state.currentImagePath = src;
      state.loading = false;
      onDone && onDone();
      render();
    };
    img.onerror = () => {
      state.currentImage = null;
      state.currentImagePath = src;
      state.loading = false;
      onDone && onDone();
      render();
    };
    img.src = src;
  }

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function start(fromSave = false) {
    if (!chapters.length) {
      alert('No se han cargado los capítulos.');
      return;
    }
    const s = fromSave ? loadSave() : null;
    if (s && !s.finished) {
      state.chapterIndex = clamp(Number(s.chapterIndex), 0, chapters.length - 1);
      state.stepIndex = clamp(Number(s.stepIndex), 0, chapters[state.chapterIndex].steps.length - 1);
    } else {
      state.chapterIndex = 0;
      state.stepIndex = 0;
      clearSave();
    }
    const chapter = chapters[state.chapterIndex];
    preloadImage(imagePathForChapter(chapter), () => setScreen('game'));
    setStatus('Entrando en la Autoaventura…');
  }

  function restart() {
    if (confirm('¿Reiniciar la Autoaventura desde el principio?')) start(false);
  }

  function goMenu() {
    preloadImage('assets/00-menu-poster.jpg', () => setScreen('menu'));
    updateContinue();
    setStatus('Menú principal');
  }

  function goEnding() {
    save(true);
    preloadImage('assets/29-galeria-caos.jpg', () => setScreen('ending'));
    updateContinue();
    setStatus('Final de la historia');
  }

  function next() {
    const chapter = chapters[state.chapterIndex];
    const last = state.chapterIndex === chapters.length - 1 && state.stepIndex === chapter.steps.length - 1;
    if (last) {
      goEnding();
      return;
    }
    if (state.stepIndex < chapter.steps.length - 1) {
      state.stepIndex += 1;
      save(false);
      render();
    } else {
      state.chapterIndex += 1;
      state.stepIndex = 0;
      const nextChapter = chapters[state.chapterIndex];
      preloadImage(imagePathForChapter(nextChapter), () => {
        save(false);
        render();
      });
    }
    setStatus(`Capítulo ${state.chapterIndex + 1}/${chapters.length} · Paso ${state.stepIndex + 1}`);
  }

  function skipScene() {
    if (state.chapterIndex < chapters.length - 1) {
      state.chapterIndex += 1;
      state.stepIndex = 0;
      const chapter = chapters[state.chapterIndex];
      preloadImage(imagePathForChapter(chapter), () => {
        save(false);
        render();
      });
      setStatus(`Escena saltada · Capítulo ${state.chapterIndex + 1}`);
    } else {
      goEnding();
    }
  }

  function currentChapter() {
    return chapters[state.chapterIndex] || null;
  }

  function currentStep() {
    const ch = currentChapter();
    return ch ? ch.steps[state.stepIndex] : ['Sistema', 'No hay datos'];
  }

  function roundedRect(x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  function wrapText(text, x, y, maxWidth, lineHeight, maxLines, color, font, weight='400') {
    ctx.fillStyle = color;
    ctx.font = `${weight} ${font}`;
    const paragraphs = String(text || '').split('\n');
    let lines = 0;
    let yy = y;
    for (let p = 0; p < paragraphs.length; p++) {
      const ws = paragraphs[p].split(' ');
      let line = '';
      for (let n = 0; n < ws.length; n++) {
        const testLine = line ? line + ' ' + ws[n] : ws[n];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, x, yy);
          yy += lineHeight;
          lines++;
          line = ws[n];
          if (maxLines && lines >= maxLines) return yy;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, yy);
      yy += lineHeight;
      lines++;
      if (maxLines && lines >= maxLines) return yy;
    }
    return yy;
  }


  function drawBackground(img) {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    if (img) {
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      const scale = Math.max(w / iw, h / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    } else {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#3a3227');
      g.addColorStop(1, '#121417');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
    const overlay = ctx.createLinearGradient(0, 0, 0, h);
    overlay.addColorStop(0, 'rgba(0,0,0,0.20)');
    overlay.addColorStop(0.55, 'rgba(0,0,0,0.10)');
    overlay.addColorStop(1, 'rgba(0,0,0,0.78)');
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, w, h);
  }

  function drawTopBar(title, subtitle) {
    const w = canvas.clientWidth;
    ctx.fillStyle = 'rgba(12,14,18,0.70)';
    roundedRect(18, 18, w - 36, 92, 18, true, false);
    ctx.fillStyle = '#d9c7a3';
    ctx.font = '700 14px Inter, Arial';
    ctx.fillText('LA GRÚA DEL DESTINO · AUTOAVENTURA CANVAS', 34, 44);
    ctx.fillStyle = '#fff4de';
    ctx.font = '700 28px Inter, Arial';
    ctx.fillText(title || '', 34, 78);
    ctx.fillStyle = '#d7d3ca';
    ctx.font = '500 16px Inter, Arial';
    ctx.fillText(subtitle || '', 34, 100);
  }

  function drawProgress(done, total) {
    const w = canvas.clientWidth;
    const y = 124;
    const x = 24;
    const width = w - 48;
    const ratio = total ? done / total : 0;
    ctx.fillStyle = 'rgba(255,255,255,0.13)';
    roundedRect(x, y, width, 18, 9, true, false);
    const fill = Math.max(12, width * ratio);
    const grad = ctx.createLinearGradient(x, 0, x + width, 0);
    grad.addColorStop(0, '#f3b454');
    grad.addColorStop(1, '#ffdd8a');
    ctx.fillStyle = grad;
    roundedRect(x, y, fill, 18, 9, true, false);
    ctx.fillStyle = '#f1e8d4';
    ctx.font = '600 14px Inter, Arial';
    ctx.fillText(`Progreso ${done}/${total}`, x, y + 38);
  }

  function drawDialogueCard(speaker, dialogue, objective, stepCounter) {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const cardX = 24;
    const cardY = h - 220;
    const cardW = w - 48;
    const cardH = 192;

    ctx.fillStyle = 'rgba(12,14,18,0.88)';
    ctx.strokeStyle = 'rgba(255,255,255,0.10)';
    ctx.lineWidth = 1;
    roundedRect(cardX, cardY, cardW, cardH, 22, true, true);

    ctx.fillStyle = '#f5c778';
    ctx.font = '700 17px Inter, Arial';
    ctx.fillText(speaker || 'Narrador', cardX + 20, cardY + 30);

    ctx.fillStyle = '#fff5df';
    wrapText(dialogue || '', cardX + 20, cardY + 64, cardW - 40, 26, 4, '#fff5df', '20px Inter, Arial', '600');

    ctx.fillStyle = '#cfc8ba';
    wrapText(objective || '', cardX + 20, cardY + 152, cardW - 40, 20, 2, '#cfc8ba', '14px Inter, Arial', '500');

    ctx.fillStyle = '#d7bf92';
    ctx.font = '700 13px Inter, Arial';
    ctx.textAlign = 'right';
    ctx.fillText(stepCounter, cardX + cardW - 18, cardY + 30);
    ctx.textAlign = 'left';
  }

  function drawCenteredCard(tag, title, subtitle, bodyLines) {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const cw = Math.min(720, w - 48);
    const ch = Math.min(380, h - 72);
    const x = (w - cw) / 2;
    const y = (h - ch) / 2;

    ctx.fillStyle = 'rgba(12,14,18,0.86)';
    ctx.strokeStyle = 'rgba(255,255,255,0.10)';
    roundedRect(x, y, cw, ch, 24, true, true);

    ctx.fillStyle = '#dabb8d';
    ctx.font = '700 14px Inter, Arial';
    ctx.textAlign = 'center';
    ctx.fillText(tag, w / 2, y + 42);
    ctx.fillStyle = '#fff3db';
    ctx.font = '700 42px Inter, Arial';
    ctx.fillText(title, w / 2, y + 98);
    ctx.fillStyle = '#f0c46e';
    ctx.font = '700 20px Inter, Arial';
    ctx.fillText(subtitle, w / 2, y + 132);

    ctx.textAlign = 'left';
    let yy = y + 185;
    bodyLines.forEach((line, idx) => {
      yy = wrapText(line, x + 34, yy, cw - 68, idx === 1 ? 34 : 26, 3, idx === 1 ? '#fff3db' : '#ddd4c5', idx === 1 ? '28px Georgia, serif' : '18px Inter, Arial', idx === 1 ? '700' : '500') + 12;
    });
    ctx.textAlign = 'left';
  }

  function renderMenu() {
    drawBackground(state.currentImage);
    drawCenteredCard(
      'Autojuego narrativo · HTML Canvas',
      'LA GRÚA DEL DESTINO',
      'AUTOAVENTURA',
      [
        'Pulsa “Empezar” o “Continuar” y luego avanza con “Siguiente paso”.',
        'Una casa contenedor, una grúa imposible y una espiral de tragicomedia absurda en 30 pantallas visuales.',
        'Versión ligera, pensada para GitHub Pages, Cloudflare Pages o cualquier hosting estático sencillo.'
      ]
    );
    setStatus('Listo para empezar');
  }

  function renderGame() {
    const chapter = currentChapter();
    const step = currentStep();
    drawBackground(state.currentImage);
    drawTopBar(chapter.title || '', chapter.place || '');
    drawProgress(currentStepNumber(), totalSteps());
    drawDialogueCard(step[0], step[1], chapter.objective || 'Pulsa Siguiente paso para continuar.', `Paso ${state.stepIndex + 1}/${chapter.steps.length} · Pantalla ${state.chapterIndex + 1}/${chapters.length}`);
  }

  function renderEnding() {
    drawBackground(state.currentImage);
    drawCenteredCard(
      'Final de la Autoaventura',
      'FIN',
      'Todo podía empeorar. Y empeoró.',
      [
        'La grúa, la casa contenedor, las facturas y el aula de FP Básica ya forman parte del folclore de esta historia.',
        '“Por muy mal que te vaya la vida, piensa que siempre te puede ir peor”.',
        'Pulsa “Volver a empezar” o vuelve al menú para repetir la catástrofe con dignidad digital.'
      ]
    );
    setStatus('Final alcanzado');
  }

  function render() {
    if (!canvas.clientWidth) return;
    if (state.screen === 'menu') return renderMenu();
    if (state.screen === 'game') return renderGame();
    if (state.screen === 'ending') return renderEnding();
  }

  btn.start.addEventListener('click', () => start(false));
  btn.continue.addEventListener('click', () => start(true));
  btn.reset.addEventListener('click', () => {
    clearSave();
    updateContinue();
    setStatus('Progreso borrado');
    alert('Se ha borrado el progreso guardado.');
  });
  btn.menu.addEventListener('click', goMenu);
  btn.restart.addEventListener('click', restart);
  btn.skip.addEventListener('click', skipScene);
  btn.next.addEventListener('click', next);
  btn.again.addEventListener('click', () => start(false));
  btn.endingMenu.addEventListener('click', goMenu);

  document.addEventListener('keydown', (ev) => {
    if (state.screen === 'game' && (ev.key === ' ' || ev.key === 'Enter')) {
      ev.preventDefault();
      next();
    }
  });

  window.addEventListener('resize', fitCanvas);
  preloadImage('assets/00-menu-poster.jpg', () => {
    fitCanvas();
    updateContinue();
    setScreen('menu');
  });
})();
