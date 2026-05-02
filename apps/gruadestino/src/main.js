
const SAVE_KEY = 'grua_destino_autoaventura_html_v1';
const chapters = [
  {
    "id": "00",
    "title": "PRÓLOGO: LA PELÍCULA QUE NADIE PIDIÓ",
    "place": "Cartel cinematográfico · Antes de la tragedia",
    "bg": "bg00",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Narrador",
        "Toda gran tragedia empieza con una frase inocente: “esto lo movemos con una grúa y ya está”."
      ],
      [
        "Fran",
        "Una casa contenedor, un huerto valenciano y una fe absurda en la hidráulica. ¿Qué podría salir mal?"
      ],
      [
        "Autoaventura",
        "A partir de aquí no eliges: solo pulsas “Siguiente paso” y ves cómo el destino firma por ti."
      ]
    ]
  },
  {
    "id": "01",
    "title": "EL SUEÑO DEL CONTENEDOR",
    "place": "Camino estrecho entre huertos de naranjos · Valencia",
    "bg": "bg01",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Narrador",
        "Fran contempla la casa contenedor como si acabara de comprar el futuro en una web china con envío complicado."
      ],
      [
        "Fran",
        "No es una caja metálica. Es una vivienda modular con potencial emocional."
      ],
      [
        "Acción automática",
        "Recoge el casco, mira el terreno y decide ignorar la pendiente, el barro y todos los presagios."
      ]
    ]
  },
  {
    "id": "02",
    "title": "EL PLAN MAESTRO",
    "place": "Planos, medidas y optimismo sospechoso",
    "bg": "bg02",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Fran",
        "Si el plano cabe en una hoja, la casa cabe en el camino. Matemáticas de obra rural."
      ],
      [
        "Voz interior",
        "El cerebro humano es maravilloso: puede mirar un problema enorme y llamarlo “detalle logístico”."
      ],
      [
        "Acción automática",
        "Fran marca el suelo, revisa los planos y se convence de que la física está de su parte."
      ]
    ]
  },
  {
    "id": "03",
    "title": "COLLAGE DE ESPERANZA",
    "place": "La vida antes de la factura",
    "bg": "bg03",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Narrador",
        "Todo parece posible: vivienda nueva, naranjos al fondo, luz de atardecer y cero conciencia del presupuesto final."
      ],
      [
        "Fran",
        "Aquí pondré una mesa. Allí una ducha. Ahí, quizá, la dignidad."
      ],
      [
        "Acción automática",
        "El teléfono sale del bolsillo. Llamar a la grúa ya no parece opción: parece destino."
      ]
    ]
  },
  {
    "id": "04",
    "title": "LA LLEGADA DE LA GRÚA",
    "place": "Una máquina demasiado grande para una idea demasiado pequeña",
    "bg": "bg04",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Narrador",
        "La grúa aparece como una criatura mecánica majestuosa. Demasiado espectacular para ser buena señal."
      ],
      [
        "Operador",
        "¿Por aquí? ¿Entre naranjos? ¿Con una casa? Vale, pero primero firmamos."
      ],
      [
        "Acción automática",
        "Fran mira la grúa con amor. La grúa mira la parcela con hambre."
      ]
    ]
  },
  {
    "id": "05",
    "title": "INTERFAZ DEL DESTINO",
    "place": "Contratos, iconos y malas decisiones",
    "bg": "bg05",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Autoaventura",
        "El juego registra nuevos objetos: casco, planos, contrato, cincha y una confianza injustificada."
      ],
      [
        "Fran",
        "Me encanta cuando una interfaz hace parecer profesional una decisión catastrófica."
      ],
      [
        "Acción automática",
        "Se desbloquea el estado: “optimismo administrativo”."
      ]
    ]
  },
  {
    "id": "06",
    "title": "LA MANIOBRA IMPOSIBLE",
    "place": "Cable tenso · Vecino grabando · Grúa respirando",
    "bg": "bg06",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Narrador",
        "La casa se eleva. Durante un segundo, todo el mundo cree en los milagros. Incluso el vecino deja de narrar."
      ],
      [
        "Acción automática",
        "Secuencia correcta: revisar cable, avisar al operador, apartar al vecino, tensar poco a poco, confirmar."
      ],
      [
        "Voz interior",
        "Has hecho todo bien. Qué pena que esta historia no premie hacer las cosas bien."
      ]
    ]
  },
  {
    "id": "07",
    "title": "TABLERO DE RIESGOS",
    "place": "Cuando el desastre ya tiene mapa",
    "bg": "bg07",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Narrador",
        "Cada panel parece advertir de algo. Cada advertencia llega exactamente tarde."
      ],
      [
        "Fran",
        "Esto no es caos. Es una maniobra compleja con personalidad."
      ],
      [
        "Acción automática",
        "El cable cruje. La casa gira. La grúa descubre el suspense."
      ]
    ]
  },
  {
    "id": "08",
    "title": "CONTRATO Y CONTROL",
    "place": "La letra pequeña siempre gana",
    "bg": "bg08",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Operador",
        "El contrato dice que la gravedad no entra en garantía."
      ],
      [
        "Fran",
        "Firmé rápido porque la ilusión no lee cláusulas."
      ],
      [
        "Acción automática",
        "El documento queda guardado como objeto clave: “Papel que demuestra que esto fue legalmente mala idea”."
      ]
    ]
  },
  {
    "id": "09",
    "title": "EL DESASTRE EN EL HUERTO",
    "place": "La grúa descubre su vocación de villana",
    "bg": "bg09",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Narrador",
        "El camino estrecho deja de ser camino y empieza a ser escena de crimen agrícola."
      ],
      [
        "Vecino curioso",
        "Esto en TikTok con música dramática revienta."
      ],
      [
        "Fran",
        "Técnicamente… sigue siendo una vivienda."
      ]
    ]
  },
  {
    "id": "10",
    "title": "PANEL DE CRISIS",
    "place": "Todo tiene arreglo, excepto quizá todo",
    "bg": "bg10",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Autoaventura",
        "Nuevos estados: puerta torcida, ventana rota, barro estructural, factura activa."
      ],
      [
        "Fran",
        "Una grieta puede ser ventilación natural si uno redacta bien el anuncio."
      ],
      [
        "Acción automática",
        "Se recoge la factura. La música baja medio tono por respeto."
      ]
    ]
  },
  {
    "id": "11",
    "title": "CONTROL DE DAÑOS",
    "place": "Inventario emocional bajo mínimos",
    "bg": "bg11",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Narrador",
        "Fran usa la llave inglesa en la casa. Aprieta una tuerca imaginaria. La realidad no se inmuta."
      ],
      [
        "Voz interior",
        "A veces reparar es hacer ruido con una herramienta mientras finges que aún decides algo."
      ],
      [
        "Acción automática",
        "La casa pasa de “proyecto vital” a “caso práctico de resiliencia”."
      ]
    ]
  },
  {
    "id": "12",
    "title": "DASHBOARD DE RUINA",
    "place": "El juego empieza a parecer manual de supervivencia",
    "bg": "bg12",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Autoaventura",
        "El sistema recomienda: cubo, manta, café frío y negación moderada."
      ],
      [
        "Fran",
        "Si el juego me da un cubo como objeto clave, quizá no estoy en el género que pensaba."
      ],
      [
        "Acción automática",
        "Se desbloquea la noche dentro del contenedor."
      ]
    ]
  },
  {
    "id": "13",
    "title": "MENÚ DE LA RUINA",
    "place": "Opciones disponibles: sufrir, guardar, continuar sufriendo",
    "bg": "bg13",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Narrador",
        "La aventura ya no consiste en mover una casa, sino en vivir dentro de la consecuencia."
      ],
      [
        "Fran",
        "Guardar partida aquí parece irresponsable, pero la vida tampoco me dejó cargar una anterior."
      ],
      [
        "Acción automática",
        "Continuar: sí. Dignidad: no disponible."
      ]
    ]
  },
  {
    "id": "14",
    "title": "LA CASA TERRIBLE",
    "place": "Interior del contenedor · Humedad con ambición decorativa",
    "bg": "bg14",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Narrador",
        "Dentro, la casa parece haber sido diseñada por una tormenta con problemas económicos."
      ],
      [
        "Fran",
        "No es frío. Es una experiencia térmica minimalista."
      ],
      [
        "Acción automática",
        "Fran coloca el cubo bajo la gotera, usa la manta, evita el enchufe y bebe café frío."
      ]
    ]
  },
  {
    "id": "15",
    "title": "MANUAL DE SUPERVIVENCIA",
    "place": "Dormir como puzle narrativo",
    "bg": "bg15",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Autoaventura",
        "Objetivo: sobrevivir una noche. Recompensa: otra mañana."
      ],
      [
        "Voz interior",
        "El cubo suena. La ventana golpea. El colchón pide la baja."
      ],
      [
        "Acción automática",
        "Fran intenta dormir. El contenedor responde con una gotera nueva."
      ]
    ]
  },
  {
    "id": "16",
    "title": "NOCHE EN EL CONTENEDOR",
    "place": "Cuando el hogar hace ruidos de enemigo final",
    "bg": "bg16",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Narrador",
        "La noche convierte cada chapa en percusión, cada sombra en deuda y cada gota en recordatorio."
      ],
      [
        "Fran",
        "Mañana lo arreglo todo. Frase favorita de las personas que mañana estarán peor."
      ],
      [
        "Acción automática",
        "Amanece. El juego añade una factura más al inventario."
      ]
    ]
  },
  {
    "id": "17",
    "title": "FACTURAS",
    "place": "El papel como antagonista principal",
    "bg": "bg17",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Narrador",
        "Sobre la mesa hay facturas, avisos, mensajes sin responder y un silencio administrativo muy expresivo."
      ],
      [
        "Fran",
        "La cifra tiene tantos dígitos que parece una contraseña."
      ],
      [
        "Acción automática",
        "Fran llama al banco. La música de espera suena más estable que su vida."
      ]
    ]
  },
  {
    "id": "18",
    "title": "BANCO Y CARTA GVA",
    "place": "La salida laboral entra por correo",
    "bg": "bg18",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Banco",
        "Su operación no puede ser atendida. Su dignidad tampoco consta como garantía."
      ],
      [
        "Acción automática",
        "Fran abre una carta con logo de la GVA."
      ],
      [
        "Carta",
        "La GVA le ha convocado para una plaza en FP Básica."
      ]
    ]
  },
  {
    "id": "19",
    "title": "LA CAÍDA TOTAL",
    "place": "Espejo roto, libro de jardinería y destino docente",
    "bg": "bg19",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Narrador",
        "En el espejo roto, Fran ve varias versiones de sí mismo. Todas preguntan lo mismo: “¿por qué la grúa?”."
      ],
      [
        "Voz interior",
        "El libro de jardinería aparece como salida. Lo verde ya no es moho: es currículo."
      ],
      [
        "Acción automática",
        "Se desbloquea el último destino: FP Básica."
      ]
    ]
  },
  {
    "id": "20",
    "title": "MANUAL DEL DESASTRE",
    "place": "Resumen jugable de todo lo que salió regular",
    "bg": "bg20",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Autoaventura",
        "Recapitulación: sueño, grúa, maniobra, desastre, casa terrible, factura, carta."
      ],
      [
        "Fran",
        "Visto como manual, parece que alguien pudo haberlo evitado. Qué detalle tan cruel."
      ],
      [
        "Acción automática",
        "La historia prepara el cambio de escenario más duro: el aula."
      ]
    ]
  },
  {
    "id": "21",
    "title": "SISTEMA DE CAOS",
    "place": "Antes de clase, el juego configura la tormenta",
    "bg": "bg21",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Narrador",
        "La interfaz cambia: ya no hay grúa, pero sí tizas, partes disciplinarios y energía juvenil desatada."
      ],
      [
        "Voz interior",
        "Después de la casa contenedor, nada puede ir peor. Error de cálculo."
      ],
      [
        "Acción automática",
        "Se carga la escena final: FP Básica."
      ]
    ]
  },
  {
    "id": "22",
    "title": "FP BÁSICA: EL ÚLTIMO DESTINO",
    "place": "Aula · Ecosistema de caos controlado por nadie",
    "bg": "bg22",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Narrador",
        "El aula parece una zona cero de papeles, mochilas, tizas y teorías educativas en retirada."
      ],
      [
        "Fran",
        "Buenos días. Hoy vamos a hablar de tallos."
      ],
      [
        "Alumno",
        "Profe, ¿una casa contenedor cuenta como maceta si le salen hongos?"
      ]
    ]
  },
  {
    "id": "23",
    "title": "INTENTO DE CLASE",
    "place": "La pizarra contraataca",
    "bg": "bg23",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Acción automática",
        "Fran coge la tiza rota y escribe: “Partes de la planta”."
      ],
      [
        "Alumno",
        "Alguien añade en la pizarra: “Casa contenedor 0 - Vida 7”."
      ],
      [
        "Fran",
        "No voy a preguntar quién ha sido porque la respuesta probablemente sea el destino."
      ]
    ]
  },
  {
    "id": "24",
    "title": "PARTE DISCIPLINARIO INFINITO",
    "place": "La burocracia también tiene modo supervivencia",
    "bg": "bg24",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Acción automática",
        "Fran rellena un parte disciplinario infinito. El papel se reproduce como mala hierba."
      ],
      [
        "Narrador",
        "El libro de jardinería se abre por resistencia vegetal. Es casi poesía curricular."
      ],
      [
        "Voz interior",
        "La clase no se controla. La vida tampoco. Pero al menos hay programación didáctica."
      ]
    ]
  },
  {
    "id": "25",
    "title": "FINAL",
    "place": "La frase que lo explica todo",
    "bg": "bg25",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Narrador",
        "La casa fue promesa. La grúa fue esperanza. El aula fue la última pantalla."
      ],
      [
        "Reflexión final",
        "Por muy mal que te vaya la vida, piensa que siempre te puede ir peor."
      ],
      [
        "Autoaventura",
        "Has terminado la versión extendida. No has jugado: has contemplado una caída con botón de avance."
      ]
    ]
  },
  {
    "id": "26",
    "title": "EPÍLOGO",
    "place": "Porque aprender la lección sería demasiado sencillo",
    "bg": "bg26",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Narrador",
        "Fran no aprende la lección. En una servilleta empieza a dibujar una piscina elevada hecha con otro contenedor."
      ],
      [
        "Voz interior",
        "El destino observa. La grúa también."
      ],
      [
        "Créditos",
        "Fin de la Autoaventura extendida de La Grúa del Destino."
      ]
    ]
  },
  {
    "id": "27",
    "title": "ARTBOOK DESBLOQUEADO",
    "place": "Galería de interfaces, recuerdos y advertencias",
    "bg": "bg27",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Autoaventura",
        "Has desbloqueado el artbook interno: pruebas visuales de que la tragedia tuvo dirección artística."
      ],
      [
        "Narrador",
        "Cada lámina parece un menú. Cada menú parece una advertencia. Nadie la leyó."
      ],
      [
        "Fran",
        "Al menos ha quedado profesional."
      ]
    ]
  },
  {
    "id": "28",
    "title": "DOSSIER FINAL",
    "place": "Informe completo del hundimiento narrativo",
    "bg": "bg28",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Narrador",
        "El dossier confirma que todos los sistemas funcionaron: el sistema de mala suerte, el de facturas y el de ironía."
      ],
      [
        "Autoaventura",
        "El progreso queda guardado. La moraleja también, aunque nadie garantiza que se use."
      ],
      [
        "Fran",
        "Siguiente proyecto: quizá algo sin grúas. O con dos, para compensar."
      ]
    ]
  },
  {
    "id": "29",
    "title": "GALERÍA DEL CAOS",
    "place": "Última pantalla · Nadie sale indemne",
    "bg": "bg29",
    "objective": "Pulsa Siguiente paso para avanzar automáticamente por la historia.",
    "steps": [
      [
        "Narrador",
        "La historia termina como empezó: con demasiadas imágenes para una sola decisión equivocada."
      ],
      [
        "Reflexión final",
        "Por muy mal que te vaya la vida, piensa que siempre te puede ir peor."
      ],
      [
        "Sistema",
        "Pulsa “Ver final” para cerrar la Autoaventura."
      ]
    ]
  }
];

let chapterIndex = 0;
let stepIndex = 0;

const screens = {
  menu: document.getElementById('menu'),
  game: document.getElementById('game'),
  ending: document.getElementById('ending')
};
const el = {
  sceneImage: document.getElementById('sceneImage'),
  chapterKicker: document.getElementById('chapterKicker'),
  chapterTitle: document.getElementById('chapterTitle'),
  chapterPlace: document.getElementById('chapterPlace'),
  progressLabel: document.getElementById('progressLabel'),
  progressFill: document.getElementById('progressFill'),
  speaker: document.getElementById('speaker'),
  dialogue: document.getElementById('dialogue'),
  objective: document.getElementById('objective'),
  continueBtn: document.getElementById('continueBtn'),
  nextBtn: document.getElementById('nextBtn')
};

function safeIndex(value, min, max) {
  const n = Number.isFinite(value) ? value : min;
  return Math.max(min, Math.min(max, n));
}

function saveGame(finished = false) {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ chapterIndex, stepIndex, finished, updatedAt: Date.now() }));
}

function loadGame() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch { return null; }
}

function clearSave() { localStorage.removeItem(SAVE_KEY); }

function showScreen(name) {
  Object.entries(screens).forEach(([key, node]) => node.classList.toggle('hidden', key !== name));
}

function imagePath(chapter) {
  const num = String(chapter.id).padStart(2, '0');
  const map = {
    '00':'00-menu-poster.png','01':'01-sueno-contenedor.png','02':'02-plan-maestro.png','03':'03-collage-esperanza.png','04':'04-llegada-grua.png','05':'05-ui-destino.png','06':'06-maniobra-imposible.png','07':'07-tablero-riesgos.png','08':'08-contrato-y-control.png','09':'09-desastre-huerto.png','10':'10-panel-crisis.png','11':'11-control-danos.png','12':'12-dashboard-ruina.png','13':'13-menu-ruina.png','14':'14-casa-terrible.png','15':'15-manual-supervivencia.png','16':'16-noche-contenedor.png','17':'17-facturas.png','18':'18-banco-gva.png','19':'19-caida-total.png','20':'20-manual-del-desastre.png','21':'21-sistema-caos.png','22':'22-aula-fp.png','23':'23-resumen-ui.png','24':'24-despliegue-final.png','25':'25-final-epilogo.png','26':'26-creditos.png','27':'27-artbook-final.png','28':'28-dossier-autoaventura.png','29':'29-galeria-caos.png'
  };
  return 'assets/' + (map[num] || '00-menu-poster.png');
}

function totalStepCount() { return chapters.reduce((sum, ch) => sum + ch.steps.length, 0); }
function doneStepCount() { return chapters.slice(0, chapterIndex).reduce((sum, ch) => sum + ch.steps.length, 0) + stepIndex + 1; }

function updateContinueButton() {
  const saved = loadGame();
  el.continueBtn.disabled = !saved || saved.finished;
  el.continueBtn.textContent = saved && !saved.finished ? 'Continuar' : 'Continuar no disponible';
}

function startGame(fromSave = false) {
  const saved = fromSave ? loadGame() : null;
  if (saved && !saved.finished) {
    chapterIndex = safeIndex(saved.chapterIndex ?? 0, 0, chapters.length - 1);
    stepIndex = safeIndex(saved.stepIndex ?? 0, 0, chapters[chapterIndex].steps.length - 1);
  } else {
    chapterIndex = 0;
    stepIndex = 0;
    clearSave();
  }
  showScreen('game');
  render();
}

function render() {
  const chapter = chapters[chapterIndex];
  const step = chapter.steps[stepIndex];
  el.sceneImage.src = imagePath(chapter);
  el.sceneImage.onerror = () => {
    el.sceneImage.removeAttribute('src');
    document.getElementById('game').style.background = 'radial-gradient(circle at 30% 20%, #5f3214, #090603 65%)';
  };
  el.chapterKicker.textContent = `Pantalla ${chapterIndex + 1} de ${chapters.length}`;
  el.chapterTitle.textContent = chapter.title;
  el.chapterPlace.textContent = chapter.place;
  el.progressLabel.textContent = `Paso ${stepIndex + 1}/${chapter.steps.length} · Progreso ${doneStepCount()}/${totalStepCount()}`;
  el.progressFill.style.width = `${Math.round((doneStepCount() / totalStepCount()) * 100)}%`;
  el.speaker.textContent = step[0];
  el.dialogue.textContent = step[1];
  el.objective.textContent = chapter.objective || 'Pulsa Siguiente paso para avanzar.';
  const last = chapterIndex === chapters.length - 1 && stepIndex === chapter.steps.length - 1;
  el.nextBtn.textContent = last ? 'Ver final ▶' : 'Siguiente paso ▶';
  saveGame(false);
}

function nextStep() {
  const chapter = chapters[chapterIndex];
  const last = chapterIndex === chapters.length - 1 && stepIndex === chapter.steps.length - 1;
  if (last) {
    saveGame(true);
    showScreen('ending');
    updateContinueButton();
    return;
  }
  if (stepIndex < chapter.steps.length - 1) {
    stepIndex += 1;
  } else {
    chapterIndex += 1;
    stepIndex = 0;
  }
  render();
}

function skipScene() {
  if (chapterIndex < chapters.length - 1) {
    chapterIndex += 1;
    stepIndex = 0;
    render();
  } else {
    showScreen('ending');
  }
}

function toMenu() {
  showScreen('menu');
  updateContinueButton();
}

document.getElementById('newGameBtn').addEventListener('click', () => startGame(false));
document.getElementById('continueBtn').addEventListener('click', () => startGame(true));
document.getElementById('resetBtn').addEventListener('click', () => { clearSave(); updateContinueButton(); });
document.getElementById('nextBtn').addEventListener('click', nextStep);
document.getElementById('skipBtn').addEventListener('click', skipScene);
document.getElementById('menuBtn').addEventListener('click', toMenu);
document.getElementById('restartBtn').addEventListener('click', () => startGame(false));
document.getElementById('endingRestartBtn').addEventListener('click', () => startGame(false));
document.getElementById('endingMenuBtn').addEventListener('click', toMenu);
document.addEventListener('keydown', (ev) => {
  if (ev.key === ' ' || ev.key === 'Enter' || ev.key === 'ArrowRight') {
    if (!screens.game.classList.contains('hidden')) nextStep();
  }
  if (ev.key === 'Escape') toMenu();
});

updateContinueButton();
showScreen('menu');
