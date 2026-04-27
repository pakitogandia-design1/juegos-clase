const STORAGE_KEY = 'imv40-progress-v2';

const sections = [
  {
    id: 'material',
    short: 'Material vegetal',
    title: '1. Material vegetal',
    description: 'Reconoce semillas, plántulas, plantones, esquejes, bulbos, tubérculos, rizomas y plantas en cepellón o maceta.',
    cardText: 'Clasifica y reconoce los tipos de material vegetal del tema.',
    type: 'quiz',
    questions: [
      { prompt: '¿Qué material se usa para iniciar muchos cultivos y necesita humedad, temperatura y oxígeno adecuados para originar una nueva planta?', options: ['Semillas', 'Bulbos', 'Esquejes', 'Plantones'], answer: 0, explain: 'Las semillas son la forma más común de iniciar muchos cultivos.' },
      { prompt: 'Son plantas muy jóvenes, recién nacidas o con poco desarrollo, y son delicadas.', options: ['Plantones', 'Plántulas', 'Rizomas', 'Tubérculos'], answer: 1, explain: 'Las plántulas necesitan bastante cuidado porque son delicadas.' },
      { prompt: '¿Qué material es una planta joven más desarrollada que una plántula y suele estar lista para trasplantarse?', options: ['Plantón', 'Esqueje', 'Semilla', 'Bulbo'], answer: 0, explain: 'El plantón ya está más desarrollado y suele ir al terreno o a una jardinera.' },
      { prompt: '¿Qué material son trozos de tallo, hoja o raíz que se usan para obtener una nueva planta?', options: ['Bulbos', 'Esquejes', 'Plántulas', 'Rizomas'], answer: 1, explain: 'El esqueje es una forma de multiplicación vegetativa.' },
      { prompt: '¿Qué órgano subterráneo de reserva representa la cebolla?', options: ['Tubérculo', 'Rizoma', 'Bulbo', 'Plantón'], answer: 2, explain: 'Los bulbos son órganos subterráneos de reserva; por ejemplo, la cebolla.' },
      { prompt: 'La patata es un ejemplo de…', options: ['Bulbo', 'Tubérculo', 'Rizoma', 'Plántula'], answer: 1, explain: 'Los tubérculos almacenan alimento; la patata es el ejemplo del tema.' },
      { prompt: '¿Qué material vegetal es un tallo subterráneo que crece horizontalmente?', options: ['Rizoma', 'Bulbo', 'Semilla', 'Esqueje'], answer: 0, explain: 'Los rizomas son tallos subterráneos horizontales, como en el jengibre o el bambú.' },
      { prompt: '¿Cómo se llaman las plantas que ya vienen enraizadas y con su sustrato, muy frecuentes en jardinería ornamental?', options: ['Plantas en cepellón o en maceta', 'Semillas', 'Plántulas', 'Esquejes'], answer: 0, explain: 'Las plantas en cepellón o maceta ya vienen enraizadas y con sustrato.' }
    ]
  },
  {
    id: 'planta',
    short: 'Partes básicas de la planta',
    title: '2. Partes básicas de la planta',
    description: 'Repasa raíz, tallo, hojas, flor, fruto y semilla con sus funciones.',
    cardText: 'Identifica las partes principales de una planta y su función.',
    type: 'quiz',
    questions: [
      { prompt: '¿Qué parte de la planta sujeta la planta al suelo y absorbe agua y sales minerales?', options: ['Fruto', 'Raíz', 'Semilla', 'Flor'], answer: 1, explain: 'La raíz normalmente está bajo tierra y cumple esa función.' },
      { prompt: '¿Qué parte sostiene la planta y comunica la raíz con hojas, flores y frutos?', options: ['Tallo', 'Hoja', 'Fruto', 'Bulbo'], answer: 0, explain: 'El tallo sostiene y comunica.' },
      { prompt: '¿Qué parte suele ser verde y realiza la fotosíntesis?', options: ['Hojas', 'Semillas', 'Raíces', 'Flores'], answer: 0, explain: 'Las hojas suelen ser verdes y realizan la fotosíntesis.' },
      { prompt: '¿Cuál es el órgano reproductor de muchas plantas?', options: ['Flor', 'Fruto', 'Raíz', 'Tallo'], answer: 0, explain: 'La flor es el órgano reproductor de muchas plantas.' },
      { prompt: '¿Qué estructura protege a la semilla?', options: ['Fruto', 'Tallo', 'Raíz', 'Hoja'], answer: 0, explain: 'El fruto protege a la semilla.' },
      { prompt: '¿Qué contiene el embrión de una nueva planta y puede germinar?', options: ['Flor', 'Semilla', 'Hoja', 'Bulbo'], answer: 1, explain: 'La semilla contiene el embrión y germina si las condiciones son adecuadas.' },
      { prompt: 'Para identificar una planta, las hojas ayudan mucho por su forma, tamaño y…', options: ['Borde', 'Humedad', 'Maceta', 'Raíz'], answer: 0, explain: 'La forma, el tamaño y el borde de las hojas ayudan a identificar.' },
      { prompt: 'La flor puede ayudar a reconocer especies por su…', options: ['Color, forma y tamaño', 'Solo el olor', 'Solo el tallo', 'Solo la raíz'], answer: 0, explain: 'El documento destaca color, forma y tamaño.' }
    ]
  },
  {
    id: 'flor',
    short: 'Partes de la flor',
    title: '3. Partes de la flor',
    description: 'Usa la imagen del tema como base: selecciona un término y colócalo en su recuadro correcto.',
    cardText: 'Completa la lámina de las partes de la flor usando la imagen del tema.',
    type: 'placement',
    image: 'assets/flor_partes.png',
    terms: ['pistilo', 'antera', 'estigma', 'tallo', 'sépalo', 'filamento', 'pétalo', 'ovarios', 'óvulo'],
    numberedTerms: false,
    instructions: 'Primero elige un término y después pulsa el recuadro correcto de la imagen.',
    slots: [
      { key: 'l1', label: 'antera', left: 8.8, top: 26.2, width: 14.5, height: 6.8 },
      { key: 'l2', label: 'filamento', left: 8.8, top: 39.0, width: 15.2, height: 6.8 },
      { key: 'l3', label: 'pétalo', left: 8.6, top: 52.1, width: 15.4, height: 6.8 },
      { key: 'l4', label: 'sépalo', left: 14.0, top: 68.6, width: 16.2, height: 6.8 },
      { key: 'l5', label: 'tallo', left: 18.0, top: 81.9, width: 16.8, height: 6.8 },
      { key: 'r1', label: 'estigma', left: 74.0, top: 28.7, width: 15.8, height: 6.8 },
      { key: 'r2', label: 'pistilo', left: 73.4, top: 41.3, width: 15.8, height: 6.8 },
      { key: 'r3', label: 'óvulo', left: 72.4, top: 54.9, width: 15.4, height: 6.8 },
      { key: 'r4', label: 'ovarios', left: 71.8, top: 66.0, width: 16.2, height: 6.8 }
    ]
  },
  {
    id: 'hoja',
    short: 'Partes de la hoja',
    title: '4. Partes de la hoja',
    description: 'La imagen del tema se usa como base, pero sin mostrar los conceptos dentro de los recuadros. Colócalos tú.',
    cardText: 'Completa los conceptos de la hoja en la lámina adaptada para el juego.',
    type: 'placement',
    image: 'assets/hoja_sin_conceptos.png',
    terms: ['envés', 'haz', 'limbo', 'nervios', 'pecíolo', 'borde'],
    numberedTerms: true,
    instructions: 'Selecciona uno de los seis conceptos numerados de arriba y colócalo en el recuadro que le corresponde.',
    slots: [
      { key: 'h1', label: 'envés', left: 4.5, top: 3.2, width: 29.0, height: 14.2 },
      { key: 'h2', label: 'haz', left: 55.5, top: 3.2, width: 21.0, height: 14.2 },
      { key: 'h3', label: 'limbo', left: 13.0, top: 36.0, width: 20.0, height: 15.5 },
      { key: 'h4', label: 'nervios', left: 63.2, top: 35.4, width: 33.0, height: 17.8 },
      { key: 'h5', label: 'pecíolo', left: 2.0, top: 72.5, width: 24.0, height: 15.0 },
      { key: 'h6', label: 'borde', left: 58.8, top: 76.3, width: 24.0, height: 13.0 }
    ]
  },
  {
    id: 'tipos',
    short: 'Tipos básicos de plantas',
    title: '5. Tipos básicos de plantas',
    description: 'Clasifica árboles, arbustos y herbáceas; además repasa anuales, bianuales y perennes.',
    cardText: 'Diferencia grupos de plantas y repasa la clasificación básica.',
    type: 'quiz',
    questions: [
      { prompt: '¿Qué grupo tiene un tronco principal y suele alcanzar bastante altura?', options: ['Árboles', 'Arbustos', 'Herbáceas', 'Anuales'], answer: 0, explain: 'Los árboles tienen un tronco principal.' },
      { prompt: 'El olivo, el naranjo y el pino son ejemplos de…', options: ['Arbustos', 'Árboles', 'Herbáceas', 'Bianuales'], answer: 1, explain: 'Los tres aparecen como ejemplos de árboles.' },
      { prompt: '¿Qué grupo tiene varios tallos desde la base y menos altura que un árbol?', options: ['Herbáceas', 'Arbustos', 'Perennes', 'Árboles'], answer: 1, explain: 'Esa es la definición de arbusto.' },
      { prompt: 'El romero, el rosal y la adelfa son ejemplos de…', options: ['Arbustos', 'Árboles', 'Herbáceas', 'Plantones'], answer: 0, explain: 'En el tema aparecen como arbustos.' },
      { prompt: '¿Qué tipo de plantas tienen tallos blandos y flexibles?', options: ['Arbustos', 'Árboles', 'Herbáceas', 'Bulbos'], answer: 2, explain: 'Las herbáceas tienen tallos blandos y flexibles.' },
      { prompt: 'La lechuga, el geranio y la albahaca son ejemplos de…', options: ['Herbáceas', 'Árboles', 'Arbustos', 'Rizomas'], answer: 0, explain: 'Son los ejemplos de herbáceas del documento.' },
      { prompt: '¿Qué plantas completan su ciclo en un año o menos?', options: ['Perennes', 'Bianuales', 'Anuales', 'Herbáceas'], answer: 2, explain: 'Las anuales completan su ciclo en un año o menos.' },
      { prompt: '¿Qué plantas necesitan dos años para completar su ciclo?', options: ['Anuales', 'Arbustos', 'Bianuales', 'Perennes'], answer: 2, explain: 'Las bianuales necesitan dos años.' },
      { prompt: '¿Qué plantas viven varios años?', options: ['Perennes', 'Anuales', 'Plantones', 'Semillas'], answer: 0, explain: 'Las perennes viven varios años.' }
    ]
  },
  {
    id: 'identificacion',
    short: 'Identificación básica',
    title: '6. Identificación básica de plantas',
    description: 'Observa el porte, el tallo, las hojas, las flores, los frutos y el olor o el uso.',
    cardText: 'Aprende a fijarte en los rasgos básicos para identificar una planta.',
    type: 'quiz',
    questions: [
      { prompt: 'Para identificar una planta no siempre hace falta saber el nombre exacto desde el primer momento. Lo más importante es…', options: ['Comprar herramientas', 'Observar', 'Podar', 'Regar'], answer: 1, explain: 'El documento insiste en que lo más importante es observar.' },
      { prompt: 'El aspecto general de una planta se llama…', options: ['Pericarpio', 'Porte', 'Cepellón', 'Savia'], answer: 1, explain: 'El porte es el aspecto general de la planta.' },
      { prompt: 'El porte puede indicar que una planta es…', options: ['Solo árbol o arbusto', 'Árbol, arbusto, trepadora o herbácea', 'Semilla o fruto', 'Bulbo o tubérculo'], answer: 1, explain: 'Es la clasificación de porte que aparece en el tema.' },
      { prompt: 'El tallo puede ser…', options: ['Solo verde', 'Leñoso o herbáceo, recto o rastrero, fino o grueso', 'Solo grueso', 'Solo recto'], answer: 1, explain: 'Esos son los rasgos a observar en el tallo.' },
      { prompt: 'En las hojas conviene fijarse en…', options: ['El precio y la maceta', 'Tamaño, forma, color, borde y disposición en el tallo', 'Solo el olor', 'Solo si están mojadas'], answer: 1, explain: 'Es exactamente la lista que aparece en el documento.' },
      { prompt: 'En las flores conviene fijarse en…', options: ['Color, tamaño, número de pétalos y época de floración', 'Solo el tallo', 'Solo la raíz', 'Solo el fruto'], answer: 0, explain: 'Esos son los datos de observación floral del tema.' },
      { prompt: 'Los frutos…', options: ['No ayudan a identificar', 'Pueden ayudar mucho a identificar', 'Solo se comen', 'Solo aparecen en árboles'], answer: 1, explain: 'El documento indica que pueden ayudar mucho a identificar.' },
      { prompt: 'Lavanda, romero e hierbabuena pueden reconocerse también por su…', options: ['Borde', 'Olor', 'Maceta', 'Color del tallo'], answer: 1, explain: 'Algunas plantas aromáticas se reconocen por su olor.' }
    ]
  },
  {
    id: 'calidad',
    short: 'Material vegetal de calidad',
    title: '7. Material vegetal de calidad',
    description: 'Revisa si el material está sano, sin plagas ni enfermedades y con raíces, tallos, hojas y humedad adecuadas.',
    cardText: 'Decide si el material vegetal es de buena calidad según el tema.',
    type: 'quiz',
    questions: [
      { prompt: 'Un buen material vegetal debe presentar…', options: ['Aspecto sano', 'Golpes visibles', 'Sequedad extrema', 'Manchas abundantes'], answer: 0, explain: 'El primer criterio del tema es el aspecto sano.' },
      { prompt: 'Un buen material vegetal debe tener ausencia de…', options: ['Raíces', 'Plagas y enfermedades', 'Sustrato', 'Color'], answer: 1, explain: 'No debe presentar plagas ni enfermedades.' },
      { prompt: 'Las raíces deben estar…', options: ['Aplastadas', 'En buen estado', 'Siempre secas', 'Fuera del envase'], answer: 1, explain: 'Las raíces deben estar en buen estado.' },
      { prompt: 'Los tallos deben ser…', options: ['Firmes', 'Quebrados', 'Muy blandos siempre', 'Sin color'], answer: 0, explain: 'El tema indica que deben ser tallos firmes.' },
      { prompt: 'Las hojas deben presentar…', options: ['Daños graves', 'Color apagado siempre', 'Ausencia de daños graves', 'Plagas'], answer: 2, explain: 'Las hojas no deben tener daños graves.' },
      { prompt: 'La humedad correcta del material vegetal es…', options: ['Con exceso siempre', 'Adecuada, sin exceso ni sequedad extrema', 'Totalmente seca', 'Solo mojada al máximo'], answer: 1, explain: 'La humedad debe ser adecuada.' },
      { prompt: 'Cuando el material viene preparado para venta o distribución, debe tener…', options: ['Cinta adhesiva', 'Etiquetado correcto', 'Más flores', 'Raíces fuera'], answer: 1, explain: 'El etiquetado correcto es uno de los criterios.' },
      { prompt: 'Si una planta llega muy seca, amarilla, rota o con manchas…', options: ['Probablemente no sea adecuada', 'Es excelente', 'No importa', 'Solo necesita más altura'], answer: 0, explain: 'Es una señal de mala calidad del material vegetal.' }
    ]
  },
  {
    id: 'manipulacion',
    short: 'Manipulación básica',
    title: '8. Manipulación del material vegetal',
    description: 'Aplica las normas básicas para no dañar el material vegetal durante su manejo.',
    cardText: 'Repasa cómo manipular correctamente plantas y envases.',
    type: 'quiz',
    questions: [
      { prompt: 'El material vegetal debe tratarse con…', options: ['Cuidado', 'Prisa', 'Golpes', 'Desorden'], answer: 0, explain: 'La manipulación básica exige cuidado.' },
      { prompt: '¿Qué no debemos hacer con las plantas ni con los envases?', options: ['Transportarlos con cuidado', 'Golpearlos', 'Mantener la humedad adecuada', 'Plantar en el momento adecuado'], answer: 1, explain: 'No hay que golpear las plantas ni los envases.' },
      { prompt: 'Si son delicadas, no deben exponerse mucho tiempo a…', options: ['La sombra', 'La lluvia ligera', 'El sol', 'La jardinera'], answer: 2, explain: 'El tema indica no exponerlas mucho tiempo al sol si son delicadas.' },
      { prompt: 'Es importante mantener la…', options: ['Altura', 'Humedad adecuada', 'Etiqueta mojada', 'Semilla abierta'], answer: 1, explain: 'La humedad adecuada es una norma básica.' },
      { prompt: 'Las plantas deben…', options: ['Transportarse con cuidado', 'Aplastarse para sujetarlas', 'Ir siempre sin envase', 'Quedarse al sol fuerte'], answer: 0, explain: 'El transporte debe hacerse con cuidado.' },
      { prompt: 'No hay que aplastar…', options: ['Solo los tallos', 'Raíces, hojas o brotes', 'Las etiquetas', 'Las macetas vacías'], answer: 1, explain: 'Raíces, hojas y brotes no deben aplastarse.' },
      { prompt: 'La siembra o plantación debe hacerse…', options: ['En cualquier momento', 'En el momento adecuado', 'Solo de noche', 'Solo con sol fuerte'], answer: 1, explain: 'El momento adecuado es clave en el manejo básico.' }
    ]
  },
  {
    id: 'seguridad',
    short: 'Seguridad e higiene',
    title: '9. Seguridad e higiene en el trabajo',
    description: 'Mantén el orden, usa bien las herramientas y trabaja limpio y con higiene.',
    cardText: 'Aplica las normas de seguridad e higiene del tema.',
    type: 'quiz',
    questions: [
      { prompt: 'Cuando trabajamos con material vegetal debemos…', options: ['Trabajar de forma ordenada', 'Trabajar deprisa y sin mirar', 'Acumular restos vegetales', 'Evitar lavar las manos'], answer: 0, explain: 'El orden es la primera norma que aparece.' },
      { prompt: 'Las herramientas deben…', options: ['Usarse correctamente', 'Dejarse tiradas', 'Prestarse sin control', 'Usarse de cualquier manera'], answer: 0, explain: 'Las herramientas deben usarse correctamente.' },
      { prompt: 'La zona de trabajo debe mantenerse…', options: ['Mojada siempre', 'Limpia', 'Desordenada', 'Llena de restos'], answer: 1, explain: 'El tema insiste en mantener limpia la zona de trabajo.' },
      { prompt: 'Los restos vegetales deben…', options: ['Quedarse donde caen', 'Retirarse cuando sea necesario', 'Usarse como adorno', 'Esconderse bajo la mesa'], answer: 1, explain: 'Hay que retirar los restos vegetales cuando sea necesario.' },
      { prompt: '¿Cuándo se deben utilizar guantes?', options: ['Nunca', 'Si el trabajo lo requiere', 'Solo para regar', 'Solo al final'], answer: 1, explain: 'Los guantes se usan si el trabajo lo requiere.' },
      { prompt: 'Después de manipular tierra, plantas o productos debemos…', options: ['Seguir sin limpiar', 'Lavarnos las manos', 'Guardar las herramientas sin más', 'Salir directamente'], answer: 1, explain: 'Lavarse las manos es una norma básica de higiene.' },
      { prompt: 'La seguridad no solo protege a la persona, también ayuda a…', options: ['Conservar mejor el material', 'Gastar más tiempo', 'Tener más tierra en la mesa', 'Cambiar el nombre de las plantas'], answer: 0, explain: 'Así termina el apartado de seguridad e higiene.' }
    ]
  }
];

const state = loadState();
let currentSection = null;

const menuView = document.getElementById('menuView');
const gameView = document.getElementById('gameView');
const progressView = document.getElementById('progressView');
const cardsGrid = document.getElementById('cardsGrid');
const heroStats = document.getElementById('heroStats');
const sectionKicker = document.getElementById('sectionKicker');
const sectionTitle = document.getElementById('sectionTitle');
const sectionDescription = document.getElementById('sectionDescription');
const sectionMiniProgress = document.getElementById('sectionMiniProgress');
const gameContainer = document.getElementById('gameContainer');
const overallBox = document.getElementById('overallBox');
const progressList = document.getElementById('progressList');
const finalBox = document.getElementById('finalBox');

function loadState() {
  const base = { scores: {}, attempts: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    return { ...base, ...JSON.parse(raw) };
  } catch {
    return base;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function scoreOf(id) {
  return state.scores[id] || 0;
}

function attemptsOf(id) {
  return state.attempts[id] || 0;
}

function registerScore(id, percent) {
  state.attempts[id] = attemptsOf(id) + 1;
  state.scores[id] = Math.max(scoreOf(id), percent);
  saveState();
  renderMenu();
  renderProgress();
  updateMiniProgress(id);
}

function getStars(percent) {
  if (percent >= 100) return 3;
  if (percent >= 70) return 2;
  if (percent >= 40) return 1;
  return 0;
}

function starsHTML(percent) {
  const count = getStars(percent);
  return `<span class="stars">${'★'.repeat(count)}${'☆'.repeat(3 - count)}</span>`;
}

function overallPercent() {
  const total = sections.reduce((sum, s) => sum + scoreOf(s.id), 0);
  return Math.round(total / sections.length);
}

function completedCount() {
  return sections.filter(s => scoreOf(s.id) > 0).length;
}

function goldCount() {
  return sections.filter(s => scoreOf(s.id) >= 100).length;
}

function finalGrade() {
  return (sections.reduce((sum, s) => sum + scoreOf(s.id), 0) / sections.length / 10).toFixed(1);
}

function allAttempted() {
  return completedCount() === sections.length;
}

function allGold() {
  return goldCount() === sections.length;
}

function showView(view) {
  [menuView, gameView, progressView].forEach(v => v.classList.remove('active'));
  view.classList.add('active');
}

function renderMenu() {
  heroStats.innerHTML = `
    <div class="stat-pill"><strong>${overallPercent()}%</strong> progreso global</div>
    <div class="stat-pill"><strong>${finalGrade()}</strong> nota actual / 10</div>
    <div class="stat-pill"><strong>${goldCount()}/${sections.length}</strong> apartados dorados</div>
    <div class="stat-pill"><strong>${completedCount()}/${sections.length}</strong> apartados jugados</div>
  `;
  cardsGrid.innerHTML = sections.map(section => {
    const score = scoreOf(section.id);
    const gold = score === 100;
    return `
      <article class="menu-card ${gold ? 'gold' : ''}">
        <div class="menu-meta">
          <span class="badge ${gold ? 'gold' : ''}">${gold ? '🏅 Superado' : score > 0 ? '🌱 En progreso' : '🪴 Pendiente'}</span>
          ${starsHTML(score)}
        </div>
        <h3>${section.title}</h3>
        <p>${section.cardText}</p>
        <div class="progress-track"><div class="progress-fill" style="width:${score}%"></div></div>
        <div class="card-footer">
          <span><strong>${score}%</strong> · ${attemptsOf(section.id)} intento(s)</span>
          <button class="primary-btn open-section" data-id="${section.id}">${score > 0 ? 'Mejorar' : 'Jugar'}</button>
        </div>
      </article>`;
  }).join('');

  cardsGrid.querySelectorAll('.open-section').forEach(btn => {
    btn.addEventListener('click', () => openSection(btn.dataset.id));
  });
}

function renderProgress() {
  overallBox.innerHTML = `
    <div class="note-box">
      <p><strong>Progreso global:</strong> ${overallPercent()}%</p>
      <p><strong>Nota final actual:</strong> ${finalGrade()} / 10</p>
      <p><strong>Apartados dorados:</strong> ${goldCount()} de ${sections.length}</p>
      <p class="small">El progreso se guarda en este navegador. Puedes volver y seguir mejorando tu álbum de apartados.</p>
    </div>`;

  progressList.innerHTML = sections.map(section => {
    const score = scoreOf(section.id);
    const gold = score === 100;
    return `
      <div class="progress-item ${gold ? 'gold' : ''}">
        <div class="progress-row">
          <strong>${section.title}</strong>
          <span class="badge ${gold ? 'gold' : ''}">${gold ? 'Superado' : score > 0 ? 'En progreso' : 'Pendiente'}</span>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${score}%"></div></div>
        <div class="progress-row">
          ${starsHTML(score)}
          <strong>${score}%</strong>
        </div>
        <p>${section.cardText}</p>
      </div>`;
  }).join('');

  if (allAttempted()) {
    finalBox.className = 'final-box ready';
    finalBox.innerHTML = `
      <h3>🎓 Tema superado</h3>
      <p><strong>Tu nota final es ${finalGrade()} / 10.</strong></p>
      <p>Has completado todos los apartados. Ahora puedes repetir los que no estén en dorado para mejorar tu nota, dejar todo el álbum al 100% y conseguir el <strong>10</strong>.</p>
      <p><strong>Apartados en dorado:</strong> ${goldCount()} / ${sections.length}</p>
      <p>${allGold() ? '¡Enhorabuena! Todos los apartados están en dorado y ya tienes el 10.' : 'Sigue mejorando: cuando todos estén en dorado tendrás el álbum perfecto.'}</p>`;
  } else {
    finalBox.className = 'final-box';
    finalBox.innerHTML = `
      <h3>🌟 Meta del tema</h3>
      <p>La pantalla de tema superado aparecerá cuando juegues todos los apartados al menos una vez.</p>
      <p>Llevas <strong>${completedCount()} de ${sections.length}</strong> apartados jugados.</p>`;
  }
}

function updateMiniProgress(id) {
  const score = scoreOf(id);
  sectionMiniProgress.innerHTML = `${starsHTML(score)}<div><strong>${score}%</strong><br><span class="small">mejor puntuación</span></div>`;
}

function openSection(id) {
  currentSection = sections.find(s => s.id === id);
  if (!currentSection) return;
  sectionKicker.textContent = currentSection.short;
  sectionTitle.textContent = currentSection.title;
  sectionDescription.textContent = currentSection.description;
  updateMiniProgress(id);
  showView(gameView);
  if (currentSection.type === 'quiz') renderQuiz(currentSection);
  if (currentSection.type === 'placement') renderPlacement(currentSection);
}

function renderQuiz(section) {
  let qIndex = 0;
  let correct = 0;
  let locked = false;

  function drawQuestion() {
    const q = section.questions[qIndex];
    const scoreLive = Math.round((correct / section.questions.length) * 100);
    gameContainer.innerHTML = `
      <div class="quiz-wrap">
        <div class="quiz-footer">
          <span class="badge">Pregunta ${qIndex + 1} de ${section.questions.length}</span>
          <span class="badge">Aciertos: ${correct}</span>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${((qIndex) / section.questions.length) * 100}%"></div></div>
        <div class="question-card">
          <div class="question-index">${section.short}</div>
          <div class="question-prompt">${q.prompt}</div>
          <div class="options-grid">
            ${q.options.map((opt, idx) => `<button class="option-btn" data-idx="${idx}">${opt}</button>`).join('')}
          </div>
          <div id="feedbackArea"></div>
        </div>
        <div class="quiz-footer">
          <span class="small">Puntuación provisional: ${scoreLive}%</span>
          <button id="skipBtn" class="ghost-btn">Ver resultado</button>
        </div>
      </div>`;

    gameContainer.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (locked) return;
        locked = true;
        const idx = Number(btn.dataset.idx);
        const ok = idx === q.answer;
        if (ok) correct += 1;

        gameContainer.querySelectorAll('.option-btn').forEach((b, i) => {
          b.disabled = true;
          if (i === q.answer) b.classList.add('correct');
          if (i === idx && i !== q.answer) b.classList.add('incorrect');
        });
        const feedback = document.getElementById('feedbackArea');
        feedback.innerHTML = `<div class="feedback-box ${ok ? 'ok' : 'ko'}">${ok ? '✅ Correcto.' : '❌ No es correcto.'} ${q.explain}</div>
        <div class="summary-actions" style="margin-top:14px;"><button id="nextQuestion" class="primary-btn">${qIndex < section.questions.length - 1 ? 'Siguiente pregunta' : 'Ver resultado del apartado'}</button></div>`;
        document.getElementById('nextQuestion').addEventListener('click', () => {
          locked = false;
          qIndex += 1;
          if (qIndex < section.questions.length) drawQuestion();
          else showQuizSummary(section, correct, section.questions.length);
        });
      });
    });

    document.getElementById('skipBtn').addEventListener('click', () => {
      showQuizSummary(section, correct, section.questions.length);
    });
  }

  drawQuestion();
}

function showQuizSummary(section, correct, total) {
  const percent = Math.round((correct / total) * 100);
  registerScore(section.id, percent);
  const grade = (percent / 10).toFixed(1);
  gameContainer.innerHTML = makeSummaryHTML(
    section,
    percent,
    `${correct} de ${total} respuestas correctas. Nota del apartado: <strong>${grade} / 10</strong>. ${percent === 100 ? '¡Apartado dorado conseguido!' : 'Puedes repetirlo para seguir mejorando hasta el 100%.'}`
  );
  wireSummaryButtons(section.id);
}

function renderPlacement(section) {
  const placed = {};
  let selectedTerm = null;
  let checked = false;

  function allPlaced() {
    return section.slots.every(slot => placed[slot.key]);
  }

  function availableTerms() {
    return section.terms.filter(term => !Object.values(placed).includes(term));
  }

  function draw() {
    gameContainer.innerHTML = `
      <div class="placement-wrap">
        <div class="note-box">
          <p><strong>Cómo jugar:</strong> ${section.instructions}</p>
          <p class="small">Consejo: si quieres cambiar una respuesta, pulsa otro término y vuelve a pulsar sobre el recuadro deseado.</p>
        </div>
        <div class="term-bank">
          ${section.terms.map((term, index) => {
            const used = Object.values(placed).includes(term);
            const label = section.numberedTerms ? `${index + 1}. ${term}` : term;
            return `<button class="term-btn ${selectedTerm === term ? 'selected' : ''} ${used ? 'used' : ''}" data-term="${term}" ${used ? 'disabled' : ''}>${label}</button>`;
          }).join('')}
        </div>
        <div class="canvas-card">
          <div class="canvas-frame">
            <img src="${section.image}" alt="${section.title}">
            ${section.slots.map(slot => {
              const value = placed[slot.key] || '';
              const cls = ['hotspot-slot'];
              if (value) cls.push('filled');
              if (checked) cls.push(value === slot.label ? 'correct' : 'incorrect');
              return `<button class="hotspot-slot ${cls.join(' ')}" data-key="${slot.key}" style="left:${slot.left}%;top:${slot.top}%;width:${slot.width}%;height:${slot.height}%">${value || 'Pulsa aquí'}</button>`;
            }).join('')}
          </div>
        </div>
        <div class="placement-footer">
          <span class="slot-note">Términos por colocar: <strong>${availableTerms().length}</strong></span>
          <div class="summary-actions">
            <button id="clearPlacement" class="ghost-btn">🧹 Borrar respuestas</button>
            <button id="checkPlacement" class="primary-btn" ${allPlaced() ? '' : 'disabled'}>✅ Comprobar apartado</button>
          </div>
        </div>
      </div>`;

    gameContainer.querySelectorAll('.term-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        selectedTerm = btn.dataset.term;
        draw();
      });
    });

    gameContainer.querySelectorAll('.hotspot-slot').forEach(btn => {
      btn.addEventListener('click', () => {
        if (checked) return;
        const key = btn.dataset.key;
        if (!selectedTerm) return;
        const previous = placed[key];
        if (previous) delete placed[key];
        placed[key] = selectedTerm;
        selectedTerm = null;
        draw();
      });
    });

    document.getElementById('clearPlacement').addEventListener('click', () => {
      Object.keys(placed).forEach(k => delete placed[k]);
      selectedTerm = null;
      checked = false;
      draw();
    });

    document.getElementById('checkPlacement').addEventListener('click', () => {
      checked = true;
      const correct = section.slots.filter(slot => placed[slot.key] === slot.label).length;
      const percent = Math.round((correct / section.slots.length) * 100);
      registerScore(section.id, percent);
      gameContainer.innerHTML = makeSummaryHTML(
        section,
        percent,
        `Has colocado correctamente <strong>${correct} de ${section.slots.length}</strong> conceptos. ${percent === 100 ? '¡Imagen completada al 100%!' : 'Puedes repetir este minijuego para conseguir el apartado dorado.'}`
      );
      wireSummaryButtons(section.id);
    });
  }

  draw();
}

function makeSummaryHTML(section, percent, text) {
  const tpl = document.getElementById('summaryTemplate');
  const frag = tpl.content.cloneNode(true);
  frag.querySelector('.summary-title').textContent = `${section.short} · ${percent}%`;
  frag.querySelector('.summary-text').innerHTML = text;
  const wrapper = document.createElement('div');
  wrapper.appendChild(frag);
  return wrapper.innerHTML;
}

function wireSummaryButtons(sectionId) {
  const section = sections.find(s => s.id === sectionId);
  gameContainer.querySelector('.retry-btn').addEventListener('click', () => openSection(section.id));
  gameContainer.querySelector('.menu-btn').addEventListener('click', () => {
    showView(menuView);
    renderMenu();
  });
}

document.getElementById('homeBtn').addEventListener('click', () => {
  showView(menuView);
  renderMenu();
});
document.getElementById('backFromGame').addEventListener('click', () => {
  showView(menuView);
  renderMenu();
});
document.getElementById('progressBtn').addEventListener('click', () => {
  renderProgress();
  showView(progressView);
});
document.getElementById('resetBtn').addEventListener('click', () => {
  const ok = confirm('¿Seguro que quieres borrar el progreso guardado en este navegador?');
  if (!ok) return;
  localStorage.removeItem(STORAGE_KEY);
  state.scores = {};
  state.attempts = {};
  renderMenu();
  renderProgress();
  showView(menuView);
});

renderMenu();
renderProgress();
showView(menuView);
