
const W = 1280;
const H = 720;
const SAVE_KEY = 'grua_destino_autoaventura_extendida_v1';
const ASSETS = {
  "bg00": "assets/00-menu-poster.png",
  "bg01": "assets/01-sueno-contenedor.png",
  "bg02": "assets/02-plan-maestro.png",
  "bg03": "assets/03-collage-esperanza.png",
  "bg04": "assets/04-llegada-grua.png",
  "bg05": "assets/05-ui-destino.png",
  "bg06": "assets/06-maniobra-imposible.png",
  "bg07": "assets/07-tablero-riesgos.png",
  "bg08": "assets/08-contrato-y-control.png",
  "bg09": "assets/09-desastre-huerto.png",
  "bg10": "assets/10-panel-crisis.png",
  "bg11": "assets/11-control-danos.png",
  "bg12": "assets/12-dashboard-ruina.png",
  "bg13": "assets/13-menu-ruina.png",
  "bg14": "assets/14-casa-terrible.png",
  "bg15": "assets/15-manual-supervivencia.png",
  "bg16": "assets/16-noche-contenedor.png",
  "bg17": "assets/17-facturas.png",
  "bg18": "assets/18-banco-gva.png",
  "bg19": "assets/19-caida-total.png",
  "bg20": "assets/20-manual-del-desastre.png",
  "bg21": "assets/21-sistema-caos.png",
  "bg22": "assets/22-aula-fp.png",
  "bg23": "assets/23-resumen-ui.png",
  "bg24": "assets/24-despliegue-final.png",
  "bg25": "assets/25-final-epilogo.png",
  "bg26": "assets/26-creditos.png",
  "bg27": "assets/27-artbook-final.png",
  "bg28": "assets/28-dossier-autoaventura.png",
  "bg29": "assets/29-galeria-caos.png"
};
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
function saveGame(chapterIndex, stepIndex, finished=false) { localStorage.setItem(SAVE_KEY, JSON.stringify({ chapterIndex, stepIndex, finished, updatedAt: Date.now() })); }
function loadGame() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch { return null; } }
function clearSave() { localStorage.removeItem(SAVE_KEY); }
class BootScene extends Phaser.Scene {
  constructor(){ super('BootScene'); }
  preload(){
    for (const [key, path] of Object.entries(ASSETS)) this.load.image(key, path);
    this.load.on('loaderror', file => console.warn('No se pudo cargar', file.key));
  }
  create(){ this.scene.start('MenuScene'); }
}
class MenuScene extends Phaser.Scene {
  constructor(){ super('MenuScene'); }
  create(){
    this.add.image(W/2,H/2,'bg00').setDisplaySize(W,H).setAlpha(.76);
    this.add.rectangle(W/2,H/2,W,H,0x000000,.45);
    this.add.rectangle(W/2,H/2,1010,560,0x090603,.72).setStrokeStyle(3,0xf0a13a,.85);
    this.add.text(W/2,96,'LA GRÚA DEL DESTINO',{fontFamily:'Georgia, serif', fontSize:'56px', color:'#fff2d7', fontStyle:'bold', align:'center', stroke:'#000', strokeThickness:8}).setOrigin(.5);
    this.add.text(W/2,154,'AUTOAVENTURA EXTENDIDA',{fontSize:'32px', color:'#f7b34d', fontStyle:'bold'}).setOrigin(.5);
    this.add.text(W/2,216,`Ahora sí: ${chapters.length} pantallas visuales con todas las imágenes integradas. Pulsa “Siguiente paso” y deja que la tragedia se juegue sola.`,{fontSize:'25px', color:'#f8ead0', align:'center', wordWrap:{width:900}, lineSpacing:8}).setOrigin(.5);
    const save = loadGame();
    this.makeButton(W/2,332,'▶ Empezar Autoaventura Extendida',()=>{ clearSave(); this.scene.start('AutoScene',{chapterIndex:0, stepIndex:0}); },620);
    this.makeButton(W/2,410, save ? '↻ Continuar desde el último paso' : '↻ Continuar no disponible',()=>{ const s = loadGame(); if (s) this.scene.start('AutoScene',{chapterIndex:s.chapterIndex||0, stepIndex:s.stepIndex||0}); },620,!save);
    this.makeButton(W/2,488,'🧹 Borrar progreso',()=>{ clearSave(); this.scene.restart(); },620);
    this.add.text(W/2,628,'PC, tablet y móvil · Sin instalación · GitHub Pages · Phaser 3',{fontSize:'20px', color:'#d8b98b', align:'center'}).setOrigin(.5);
  }
  makeButton(x,y,label,cb,w=520,disabled=false){
    const group = this.add.container(x,y);
    const rect = this.add.rectangle(0,0,w,60, disabled?0x302923:0x9b4c12,.96).setStrokeStyle(2, disabled?0x6f6250:0xffc166,1);
    const txt = this.add.text(0,0,label,{fontSize:'25px', color:disabled?'#958978':'#fff7e6', fontStyle:'bold'}).setOrigin(.5);
    group.add([rect,txt]);
    if(!disabled){ rect.setInteractive({useHandCursor:true}).on('pointerdown', cb).on('pointerover',()=>rect.setFillStyle(0xc86116,.98)).on('pointerout',()=>rect.setFillStyle(0x9b4c12,.96)); txt.setInteractive({useHandCursor:true}).on('pointerdown', cb); }
    return group;
  }
}
class AutoScene extends Phaser.Scene {
  constructor(){ super('AutoScene'); }
  init(data){ this.chapterIndex = Phaser.Math.Clamp(data.chapterIndex ?? 0,0,chapters.length-1); this.stepIndex = Phaser.Math.Clamp(data.stepIndex ?? 0,0,chapters[this.chapterIndex].steps.length-1); }
  create(){ this.cameras.main.fadeIn(420,0,0,0); this.buildLayout(); this.renderStep(); }
  buildLayout(){
    const ch = chapters[this.chapterIndex];
    this.bg = this.add.image(W/2,H/2,ch.bg).setDisplaySize(W,H);
    this.add.rectangle(W/2,54,W,108,0x050302,.68);
    this.add.rectangle(W/2,584,W,272,0x050302,.86);
    this.add.rectangle(W/2,584,W-40,252,0x100b07,.62).setStrokeStyle(2,0xf0a13a,.6);
    this.titleText = this.add.text(34,18,ch.title,{fontSize:'28px', color:'#fff3dc', fontStyle:'bold', stroke:'#000', strokeThickness:5});
    this.placeText = this.add.text(36,58,ch.place,{fontSize:'18px', color:'#f0c27a'});
    this.progressText = this.add.text(W-36,28,'',{fontSize:'21px', color:'#fff0d0', fontStyle:'bold', align:'right'}).setOrigin(1,0);
    this.objectiveText = this.add.text(W-36,62,ch.objective,{fontSize:'16px', color:'#d6c0a3', align:'right', wordWrap:{width:530}}).setOrigin(1,0);
    this.speakerBox = this.add.rectangle(192,462,310,50,0xa95013,.97).setStrokeStyle(2,0xffcb74,1);
    this.speakerText = this.add.text(192,462,'',{fontSize:'24px', color:'#fff7e6', fontStyle:'bold', align:'center'}).setOrigin(.5);
    this.dialogText = this.add.text(52,503,'',{fontSize:'30px', color:'#fffaf1', wordWrap:{width:1168}, lineSpacing:9, stroke:'#000', strokeThickness:4});
    this.tipText = this.add.text(52,672,'',{fontSize:'18px', color:'#d8b98b'});
    this.nextButton = this.makeButton(1014,660,'SIGUIENTE PASO ▶',()=>this.nextStep(),340,54);
    this.menuButton = this.makeButton(112,660,'MENÚ',()=>this.scene.start('MenuScene'),160,54,0x342319);
    this.restartButton = this.makeButton(276,660,'REINICIAR',()=>{ clearSave(); this.scene.start('AutoScene',{chapterIndex:0, stepIndex:0}); },190,54,0x342319);
    this.galleryButton = this.makeButton(480,660,'SALTAR +',()=>this.skipScene(),170,54,0x4c3219);
    this.barBg = this.add.rectangle(690,662,330,14,0x33261b,.9).setStrokeStyle(1,0xffc166,.5);
    this.barFill = this.add.rectangle(525,662,1,10,0xffb443,.95).setOrigin(0,.5);
    this.pulse = this.tweens.add({targets:this.nextButton.list[0], scaleX:1.035, scaleY:1.08, duration:650, yoyo:true, repeat:-1, ease:'Sine.easeInOut'});
  }
  makeButton(x,y,label,cb,w=260,h=56,color=0x9b4c12){
    const c=this.add.container(x,y); const r=this.add.rectangle(0,0,w,h,color,.98).setStrokeStyle(2,0xffc166,1); const t=this.add.text(0,0,label,{fontSize:'20px', color:'#fff7e6', fontStyle:'bold'}).setOrigin(.5); c.add([r,t]); r.setInteractive({useHandCursor:true}).on('pointerdown',cb).on('pointerover',()=>r.setFillStyle(0xc86116,.98)).on('pointerout',()=>r.setFillStyle(color,.98)); t.setInteractive({useHandCursor:true}).on('pointerdown',cb); return c;
  }
  renderStep(){
    const ch = chapters[this.chapterIndex]; const step = ch.steps[this.stepIndex];
    this.bg.setTexture(ch.bg).setDisplaySize(W,H); this.titleText.setText(ch.title); this.placeText.setText(ch.place); this.objectiveText.setText(ch.objective);
    this.progressText.setText(`Pantalla ${this.chapterIndex+1}/${chapters.length} · Paso ${this.stepIndex+1}/${ch.steps.length}`);
    this.speakerText.setText(step[0]); this.dialogText.setText(step[1]);
    const isLastStep = this.chapterIndex === chapters.length-1 && this.stepIndex === ch.steps.length-1;
    this.tipText.setText(isLastStep ? 'Has llegado al final de la Autoaventura extendida.' : 'Pulsa “Siguiente paso” para avanzar. Usa “Saltar +” para pasar a la siguiente pantalla visual.');
    this.nextButton.list[1].setText(isLastStep ? 'VER FINAL ▶' : 'SIGUIENTE PASO ▶');
    const totalSteps = chapters.reduce((a,c)=>a+c.steps.length,0); const doneBefore = chapters.slice(0,this.chapterIndex).reduce((a,c)=>a+c.steps.length,0)+this.stepIndex+1; this.barFill.width = 330*(doneBefore/totalSteps);
    saveGame(this.chapterIndex,this.stepIndex,false); this.cameras.main.flash(100,255,194,89,.14);
  }
  skipScene(){ if(this.chapterIndex < chapters.length-1){ this.chapterIndex++; this.stepIndex=0; this.scene.restart({chapterIndex:this.chapterIndex, stepIndex:0}); } }
  nextStep(){
    const ch = chapters[this.chapterIndex];
    if(this.chapterIndex === chapters.length-1 && this.stepIndex === ch.steps.length-1){ saveGame(this.chapterIndex,this.stepIndex,true); this.scene.start('EndingScene'); return; }
    if(this.stepIndex < ch.steps.length-1){ this.stepIndex++; this.renderStep(); }
    else { this.cameras.main.fadeOut(320,0,0,0); this.time.delayedCall(330,()=>{ this.chapterIndex++; this.stepIndex=0; this.scene.restart({chapterIndex:this.chapterIndex, stepIndex:0}); }); }
  }
}
class EndingScene extends Phaser.Scene {
  constructor(){ super('EndingScene'); }
  create(){
    this.add.image(W/2,H/2,'bg29').setDisplaySize(W,H).setAlpha(.72); this.add.rectangle(W/2,H/2,W,H,0x000000,.62); this.add.rectangle(W/2,H/2,1040,540,0x090603,.80).setStrokeStyle(3,0xf0a13a,.9);
    this.add.text(W/2,116,'FINAL DE LA AUTOAVENTURA EXTENDIDA',{fontSize:'40px', color:'#ffbf5b', fontStyle:'bold', align:'center', stroke:'#000', strokeThickness:6}).setOrigin(.5);
    this.add.text(W/2,262,'“Por muy mal que te vaya la vida, piensa que siempre te puede ir peor”.',{fontFamily:'Georgia, serif', fontSize:'44px', color:'#fff6df', align:'center', wordWrap:{width:920}, lineSpacing:12, stroke:'#000', strokeThickness:7}).setOrigin(.5);
    this.add.text(W/2,414,`Has recorrido ${chapters.length} pantallas visuales. Fran sobrevivió a la grúa, a la casa contenedor y al aula. Eso no significa que haya aprendido nada.`,{fontSize:'24px', color:'#ead2aa', align:'center', wordWrap:{width:900}, lineSpacing:8}).setOrigin(.5);
    this.makeButton(W/2-190,555,'VOLVER A EMPEZAR',()=>{ clearSave(); this.scene.start('AutoScene',{chapterIndex:0, stepIndex:0}); }); this.makeButton(W/2+190,555,'MENÚ',()=>this.scene.start('MenuScene'));
  }
  makeButton(x,y,label,cb){ const c=this.add.container(x,y); const r=this.add.rectangle(0,0,310,58,0x9b4c12,.98).setStrokeStyle(2,0xffc166,1); const t=this.add.text(0,0,label,{fontSize:'22px', color:'#fff7e6', fontStyle:'bold'}).setOrigin(.5); c.add([r,t]); r.setInteractive({useHandCursor:true}).on('pointerdown',cb); t.setInteractive({useHandCursor:true}).on('pointerdown',cb); }
}
const config = { type: Phaser.AUTO, parent: 'game', width: W, height: H, backgroundColor: '#050302', scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }, scene: [BootScene, MenuScene, AutoScene, EndingScene] };
new Phaser.Game(config);
