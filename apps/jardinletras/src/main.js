/* Jardín de Letras V1.0.9 - Phaser 3 */
(function(){
'use strict';
const W=1280,H=720, SAVE_KEY='jardin_de_letras_v1_save';
const COLORS={dark:0x10251b, dark2:0x183826, paper:0xf1e4c8, paper2:0xfff4d8, ink:0x2b2116, green:0x397a48, green2:0x62a05d, gold:0xd6a441, red:0xb74d3f, purple:0x583067, cream:0xf7edcf, blue:0x4d7c91, gray:0x6c6c60};
const ALL_WORDS=(window.WORD_BANK_ORIGINAL||[]).concat(window.WORD_BANK_EXTRA||[]).map(e=>({...e, gridWord:e.answer, playable:e.answer&&e.answer.length>=3&&e.answer.length<=20}));
const WORD_BY_ID=Object.fromEntries(ALL_WORDS.map(e=>[e.id,e]));
const PLAYABLE=ALL_WORDS.filter(e=>e.playable);
const CATEGORIES=[...new Set(ALL_WORDS.map(e=>e.category))].sort((a,b)=>a.localeCompare(b,'es'));
const PROFESSIONAL=['JardinerIA','FloristerIA','Zona Segura','Botánica de Campo','Herbario Ornamental','Almacén del Vivero','Manual de Labores','Clínica Vegetal','Red de Riego','Tierra Viva','Invernadero Vivo','Mesa de Identificación','Paisajismo y Diseño','Mostrador Floral'];
const AULA=['MatematIcAs','CiencIA','EcologIA','QuímIcA','FísIcA','ZoologIA','LibrerIA'];
const SPECIAL=['FantasIA','ZombIA','Criaturas del Jardín','Plantas Imposibles','Herramientas Legendarias','Fenómenos Raros','Enemigos del Códex','Objetos de Aula Gamer','Cocina del Compost','Mercado de Floristería'];
const POWERUPS=[
 {id:'lupa',name:'Lupa de vivero',desc:'Revela una de las letras restantes que no aparecen gratis en el patrón.',cost:2},
 {id:'regadera',name:'Regadera mental',desc:'Compra una única pista decisiva y orientativa para la palabra seleccionada.',cost:2},
 {id:'guantes',name:'Guantes de trabajo',desc:'Anula el próximo error.',cost:2},
 {id:'brujula',name:'Brújula de raíces',desc:'Indica la dirección de una palabra pendiente.',cost:3},
 {id:'linterna',name:'Linterna de invernadero',desc:'Ilumina una zona útil del tablero.',cost:3},
 {id:'semilla',name:'Semilla guía',desc:'Marca en el tablero una letra de la palabra seleccionada, priorizando las letras que no se ven gratis.',cost:2}
];
const RELICS=[
 {id:'libreta',name:'Libreta de campo',desc:'+1 concentración al iniciar expedición.'},
 {id:'botas',name:'Botas firmes',desc:'+1 energía máxima en expedición.'},
 {id:'etiquetadora',name:'Etiquetadora sabia',desc:'La primera palabra muestra subcategoría.'},
 {id:'regadera_antigua',name:'Regadera antigua',desc:'Recupera 1 concentración al completar un nodo.'},
 {id:'hoja_repuesto',name:'Hoja de repuesto',desc:'Una vez, evita perder una expedición.'}
];
const ACCESSORY_ITEMS=[
 {id:'acc_hat_regadera',name:'Sombrero Regadera Real',category:'Sombreros',slot:'hat',rarity:'Legendaria',secret:false,price:1,symbol:'🚿',color:0x68a87c,tooltip:'Un sombrero-regadera absurdo y majestuoso. Visible sobre el avatar.'},
 {id:'acc_hat_seta',name:'Boina Seta Luminosa',category:'Sombreros',slot:'hat',rarity:'Épica',secret:false,price:1,symbol:'🍄',color:0xc85c62,tooltip:'Brilla como una seta de cuento. Muy visible en el Armario.'},
 {id:'acc_hat_maceta',name:'Maceta Coronada',category:'Sombreros',slot:'hat',rarity:'Rara',secret:false,price:1,symbol:'🪴',color:0xb56a3c,tooltip:'Una maceta-casco para cabezas con vocación de vivero.'},
 {id:'acc_hat_florista',name:'Pamela Florista Deluxe',category:'Sombreros',slot:'hat',rarity:'Épica',secret:false,price:1,symbol:'🌺',color:0xde6faa,tooltip:'Pamela de gala con flor enorme. Imposible pasar desapercibido.'},
 {id:'acc_hat_cactus',name:'Casco Cactus Antipinchazos',category:'Sombreros',slot:'hat',rarity:'Rara',secret:false,price:1,symbol:'🌵',color:0x4e9e58,tooltip:'Parece peligroso, pero está homologado por el Códex.'},
 {id:'acc_hat_caracol',name:'Gorro Caracol Blindado',category:'Sombreros',slot:'hat',rarity:'Épica',secret:false,price:1,symbol:'🐌',color:0xd6a441,tooltip:'Lento, brillante y muy resistente a las pistas malas.'},
 {id:'acc_hat_lombriz',name:'Turbante Lombriz Sabia',category:'Sombreros',slot:'hat',rarity:'Legendaria',secret:false,price:1,symbol:'🪱',color:0x9a6a5b,tooltip:'Una lombriz de tela que parece saber más que tú.'},
 {id:'acc_hat_orquidea',name:'Corona Orquídea Abisal',category:'Sombreros',slot:'hat',rarity:'Prohibida',secret:true,price:1,symbol:'🪻',color:0x7b3fa1,tooltip:'Una corona prohibida con pétalos imposibles.'},
 {id:'acc_outfit_petalos',name:'Capa de Pétalos Épicos',category:'Indumentaria',slot:'outfit',rarity:'Épica',secret:false,price:1,symbol:'🧥',color:0xe28ab9,tooltip:'Capa floral animada. Se ve como pétalos alrededor del avatar.'},
 {id:'acc_outfit_jardinero',name:'Mono Jardinero Legendario',category:'Indumentaria',slot:'outfit',rarity:'Legendaria',secret:false,price:1,symbol:'🥼',color:0x3f8f62,tooltip:'Ropa de trabajo con bolsillos imposibles y brillo de oficio.'},
 {id:'acc_outfit_abeja',name:'Traje Abeja Polinizadora',category:'Indumentaria',slot:'outfit',rarity:'Rara',secret:false,price:1,symbol:'🐝',color:0xf3c743,tooltip:'Rayas amarillas y negras para moverse con energía por el jardín.'},
 {id:'acc_outfit_compost',name:'Armadura de Compost Feliz',category:'Indumentaria',slot:'outfit',rarity:'Épica',secret:false,price:1,symbol:'🛡️',color:0x7b5a32,tooltip:'Huele raro, protege mucho y queda sorprendentemente bien.'},
 {id:'acc_outfit_hiedra',name:'Traje Hiedra Trepadora',category:'Indumentaria',slot:'outfit',rarity:'Rara',secret:false,price:1,symbol:'🌿',color:0x2f7b45,tooltip:'Indumentaria verde con lianas visibles en brazos y torso.'},
 {id:'acc_outfit_fantasma',name:'Túnica Helecho Fantasma',category:'Indumentaria',slot:'outfit',rarity:'Prohibida',secret:true,price:1,symbol:'👻',color:0x90c8b2,tooltip:'Una túnica prohibida que deja estela de niebla vegetal.'},
 {id:'acc_outfit_dragon',name:'Chaleco Dragón de Invernadero',category:'Indumentaria',slot:'outfit',rarity:'Prohibida',secret:true,price:1,symbol:'🐉',color:0x9046a8,tooltip:'Demasiado épico para podar setos con discreción.'},
 {id:'acc_badge_llave',name:'Insignia Llave de Vivero',category:'Insignias',slot:'badge',rarity:'Rara',secret:false,price:1,symbol:'🔑',color:0xd6a441,tooltip:'Insignia visible en el pecho. Recuerda que abriste un cofre de llaves.'},
 {id:'acc_badge_codex',name:'Insignia Códex Vivo',category:'Insignias',slot:'badge',rarity:'Épica',secret:false,price:1,symbol:'📗',color:0x4f8fb0,tooltip:'Un pequeño libro brillante que flota junto al avatar.'},
 {id:'acc_badge_raiz',name:'Broche Raíz Oscura',category:'Insignias',slot:'badge',rarity:'Prohibida',secret:true,price:1,symbol:'🖤',color:0x43204d,tooltip:'Broche prohibido. Sus raíces parecen moverse cuando nadie mira.'}
];
function allCollection(){ return (window.COLLECTION_ITEMS||[]).concat(ACCESSORY_ITEMS); }

function today(){return new Date().toISOString();}
function fmtDate(iso){ if(!iso) return 'No descubierto todavía'; const d=new Date(iso); return d.toLocaleDateString('es-ES'); }
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function pick(arr,n,seed=Math.random()){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(((Math.sin(seed*999+i*37)+1)/2)*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a.slice(0,n); }
function randItem(arr){return arr[Math.floor(Math.random()*arr.length)];}
function initialSave(){ return {version:'1.0.9', profile:{name:'Jugador/a',createdAt:today(),equipped:{}}, codex:{}, items:{}, achievements:{}, stats:{games:0,perfect:0,expeditions:0,boxes:0,missionsDone:0,wordsFound:0}, resources:{seeds:120,dust:0,keys:1,secretKeys:0}, activeGame:null, activeExpedition:null, history:[], settings:{tutorialSeen:false, sound:true}}; }
function normalizeSave(raw){ const base=initialSave(); const d=Object.assign(base, raw||{}); d.profile=Object.assign(base.profile, raw?.profile||{}); d.profile.equipped=Object.assign({}, raw?.profile?.equipped||{}); d.stats=Object.assign(base.stats, raw?.stats||{}); d.resources=Object.assign(base.resources, raw?.resources||{}); d.settings=Object.assign(base.settings, raw?.settings||{}); d.codex=raw?.codex||{}; d.items=raw?.items||{}; d.achievements=raw?.achievements||{}; d.history=raw?.history||[]; return d; }
function loadSave(){ try{ return normalizeSave(JSON.parse(localStorage.getItem(SAVE_KEY)||'{}')); }catch(e){ return initialSave(); }}
function saveData(data){ localStorage.setItem(SAVE_KEY, JSON.stringify(data)); }
function textStyle(size=20,color='#2b2116',extra={}){ return {fontFamily:'system-ui, Segoe UI, Arial', fontSize:size+'px', color, ...extra}; }
function masteryName(r){ const c=r?.foundCount||0; if(!r) return 'No descubierta'; if(r.dorada) return 'Dorada'; if(r.experta) return 'Experta'; if(r.dominada) return 'Dominada'; if(c>=3) return 'Reconocida'; return 'Descubierta'; }
function rarityColor(r){ return {Común:COLORS.green2,'Poco común':0x72a7d8,Rara:0x8d66c2,'Épica':0xb15cc8,Legendaria:COLORS.gold,Prohibida:COLORS.purple}[r]||COLORS.green2; }

function usefulContext(e){
 const cat=(e.category||'').toLowerCase(), sub=(e.subcategory||'').toLowerCase();
 if(sub.includes('epi')) return 'Es un elemento de protección individual que se relaciona con la seguridad en el trabajo.';
 if(sub.includes('riesgo')) return 'Es un riesgo, accidente o situación que conviene prevenir durante el trabajo.';
 if(sub.includes('señal')) return 'Es una indicación o aviso que ayuda a trabajar con seguridad.';
 if(sub.includes('primer')) return 'Aparece cuando hay que actuar ante una emergencia o accidente.';
 if(sub.includes('herramient')||sub.includes('maquinaria')||cat.includes('almacén')) return 'Es una herramienta, máquina o recurso de trabajo del vivero o jardín.';
 if(sub.includes('riego')||cat.includes('riego')||sub.includes('emis')) return 'Pertenece al sistema de riego, agua, emisores, automatización o instalación.';
 if(sub.includes('plaga')||sub.includes('enfer')||sub.includes('síntoma')||cat.includes('clínica')) return 'Se relaciona con sanidad vegetal: plagas, síntomas, enfermedades o tratamientos.';
 if(sub.includes('hoja')||sub.includes('flor')||sub.includes('raíz')||sub.includes('tallo')||cat.includes('botánica')) return 'Es una parte, estructura o concepto usado para identificar y entender las plantas.';
 if(cat.includes('ornamental')||sub.includes('árbol')||sub.includes('arbusto')||sub.includes('interior')||sub.includes('aromática')) return 'Es una planta o grupo vegetal que puede aparecer en jardines, viveros o espacios ornamentales.';
 if(cat.includes('florister')||cat.includes('mostrador')||cat.includes('mercado')) return 'Aparece en trabajos de floristería, atención al cliente, encargos, ramos o productos florales.';
 if(cat.includes('tierra')||sub.includes('sustrato')||sub.includes('suelo')) return 'Tiene que ver con suelo, sustratos, propiedades, fertilidad o mejora del terreno.';
 if(cat.includes('invernadero')||sub.includes('producción')||sub.includes('propagación')) return 'Se usa en producción vegetal, semilleros, propagación o manejo de invernadero.';
 if(cat.includes('paisajismo')) return 'Forma parte del diseño, composición o planificación de espacios verdes.';
 if(cat.includes('criaturas')) return 'Es una criatura del jardín: útil, molesta, fantástica o exagerada para la aventura.';
 if(cat.includes('imposibles')) return 'Pertenece al Herbario de plantas imposibles: vegetal extraño, mágico o poco recomendable.';
 if(cat.includes('enemigos')) return 'Es una amenaza del Códex: algo que dificulta leer, buscar o conservar palabras.';
 if(cat.includes('aula')) return 'Es un objeto o recurso de aula convertido en elemento gamer de la colección.';
 if(cat.includes('compost')) return 'Se relaciona con restos orgánicos, compost, humus o transformación de materia vegetal.';
 return `Pertenece a ${e.category||'esta categoría'} y al bloque ${e.subcategory||'general'}.`;
}
function oddPattern(word){
 word=(word||'').toUpperCase();
 return word.split('').map((ch,i)=> i%2===0 ? ch : '·').join(' ');
}
function hiddenEvenPositions(word){
 word=(word||'').toUpperCase();
 const out=[];
 for(let i=0;i<word.length;i++) if(i%2===1) out.push({index:i+1,letter:word[i]});
 return out;
}
function pickHiddenEven(word){
 const arr=hiddenEvenPositions(word);
 return arr.length?randItem(arr):null;
}
function goodFreeClue(e,gridWord){
 const word=(gridWord||e.answer||'?'); const len=word.length; const pattern=oddPattern(word);
 const base = e.source==='original' && e.signals && e.signals[2] ? e.signals[2] : `${usefulContext(e)} Subcategoría: ${e.subcategory||'general'}.`;
 return `Letras impares: ${pattern} · ${base} · ${len} letras.`;
}
function goodPaidClue(e,gridWord){
 const word=gridWord||e.answer||''; const len=word.length; const extra=pickHiddenEven(word);
 const extraText=extra ? ` Además, una letra restante: posición ${extra.index} = ${extra.letter}.` : '';
 if(e.source==='original' && e.signals && e.signals[3]) return `${e.signals[3]}${extraText}`;
 return `Pista decisiva: ${usefulContext(e)} Tiene ${len} letras.${extraText}`;
}
function clueForObjective(entry,obj){
 if(obj.found) return `✅ ${entry.display}`;
 return obj.clueLevel>0 ? goodPaidClue(entry,obj.gridWord) : goodFreeClue(entry,obj.gridWord);
}

class JardinScene extends Phaser.Scene{
 constructor(){ super('JardinScene'); this.ui=[]; this.dataSave=loadSave(); this.page=0; this.filter='Todo'; this.tab='Profesional'; }
 preload(){}
 create(){ this.cameras.main.setBackgroundColor(COLORS.dark); this.input.setTopOnly(true); this.showMenu(); }
 persist(){ saveData(this.dataSave); }
 clear(){ this.ui.forEach(o=>{try{o.destroy();}catch(e){}}); this.ui=[]; this.input.off('pointerup'); this.input.off('pointermove'); this.tweens.killAll(); }
 addObj(o){ this.ui.push(o); return o; }
 panel(x,y,w,h,color=COLORS.paper,alpha=1,stroke=COLORS.gold){ const g=this.add.graphics(); g.fillStyle(color,alpha); g.fillRoundedRect(x,y,w,h,18); g.lineStyle(3,stroke,1); g.strokeRoundedRect(x,y,w,h,18); this.addObj(g); return g; }
 label(x,y,txt,size=22,color='#2b2116',align='left',w=0){ const t=this.add.text(x,y,txt,textStyle(size,color,{fontWeight:size>=28?'800':'600',align,wordWrap:{width:w||undefined}})); this.addObj(t); return t; }
 button(x,y,w,h,txt,cb,opts={}){ const g=this.add.graphics(); const base=opts.color||COLORS.green; const over=opts.over||COLORS.green2; g.fillStyle(base,1); g.fillRoundedRect(x,y,w,h,16); g.lineStyle(2,opts.stroke||COLORS.gold,1); g.strokeRoundedRect(x,y,w,h,16); const t=this.add.text(x+w/2,y+h/2,txt,textStyle(opts.size||20,opts.txtColor||'#fff',{fontWeight:'800',align:'center',wordWrap:{width:w-18}})).setOrigin(.5); const zone=this.add.zone(x,y,w,h).setOrigin(0).setInteractive({useHandCursor:true}); zone.on('pointerover',()=>{g.clear(); g.fillStyle(over,1); g.fillRoundedRect(x,y,w,h,16); g.lineStyle(2,opts.stroke||COLORS.gold,1); g.strokeRoundedRect(x,y,w,h,16);});
 zone.on('pointerout',()=>{g.clear(); g.fillStyle(base,1); g.fillRoundedRect(x,y,w,h,16); g.lineStyle(2,opts.stroke||COLORS.gold,1); g.strokeRoundedRect(x,y,w,h,16);});
 zone.on('pointerup',()=>{this.soundBlip(); cb&&cb();}); this.ui.push(g,t,zone); return {g,t,zone}; }
 smallBack(cb){ this.button(24,24,120,44,'← Volver',cb||(()=>this.showMenu()),{color:COLORS.gray,size:18}); }
 decorate(title,subtitle=''){ const bg=this.add.graphics(); bg.fillGradientStyle(0x10251b,0x183826,0x24492f,0x13251b,1); bg.fillRect(0,0,W,H); for(let i=0;i<40;i++){ const x=Math.random()*W,y=Math.random()*H,r=1+Math.random()*3; bg.fillStyle(i%3?0x5a8f4d:0xd2aa56,.18); bg.fillCircle(x,y,r); } this.addObj(bg); this.label(42,36,title,40,'#fff'); if(subtitle) this.label(44,86,subtitle,18,'#f7edcf'); }
 soundBlip(){ if(!this.dataSave.settings.sound) return; try{ const ctx=this.sound.context, osc=ctx.createOscillator(), gain=ctx.createGain(); osc.frequency.value=480; gain.gain.value=.025; osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime+.04);}catch(e){} }
 showToast(msg){ const p=this.panel(430,24,420,54,COLORS.dark2,.96,COLORS.gold); const t=this.label(640,51,msg,19,'#fff','center',380).setOrigin(.5); this.time.delayedCall(1800,()=>{p.destroy();t.destroy();}); }
 showMenu(){ this.clear(); this.decorate('Jardín de Letras','Sopas de letras con pistas, Códex, cajas, expediciones y colección.');
  this.panel(50,130,1180,520,COLORS.paper,.96); this.label(86,154,`Hola, ${this.dataSave.profile.name || 'Jugador/a'}`,30,'#2b2116');
  const buttons=[['Jugar misión',()=>this.showContracts()],['Continuar partida',()=>this.resumeGame()],['Expedición',()=>this.showExpedition()],['Códex',()=>this.showCodex()],['Colección',()=>this.showCollection()],['Cajas',()=>this.showBoxes()],['Tienda',()=>this.showShop()],['Armario',()=>this.showWardrobe()],['Mi Jardín',()=>this.showGarden()],['Logros',()=>this.showAchievements()],['Perfil',()=>this.showProfile()],['Tutorial',()=>this.showTutorial()],['Opciones',()=>this.showOptions()]];
  let x=90,y=220; buttons.forEach((b,i)=>{ if(b[0]==='Continuar partida'&&!this.dataSave.activeGame) return; this.button(x,y,245,62,b[0],b[1],{size:20,color:i%2?COLORS.green2:COLORS.green}); x+=285; if(x>950){x=90;y+=84;} });
  this.label(90,595,`Códex: ${Object.keys(this.dataSave.codex).length}/${ALL_WORDS.length} · Semillas: ${this.dataSave.resources.seeds} · Llaves vivero: ${this.dataSave.resources.keys} · Llaves prohibidas: ${this.dataSave.resources.secretKeys} · Polvo: ${this.dataSave.resources.dust}`,19,'#4b3a20');
 }
 showOptions(){ this.clear(); this.decorate('Opciones','Perfil del jugador, sonido, información del banco y reinicio seguro.'); this.smallBack(); this.panel(90,130,1100,500,COLORS.paper,.96);
  this.label(130,160,'Perfil del jugador',30); this.label(130,210,'Nombre actual:',20); const nameTxt=this.label(300,210,this.dataSave.profile.name||'Jugador/a',22,'#397a48');
  const letters='ABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚ -'; let temp=this.dataSave.profile.name||'';
  this.button(130,250,270,48,'Cambiar nombre',()=>{ temp=prompt('Nombre del jugador:', temp)||temp; temp=temp.trim().slice(0,22)||'Jugador/a'; this.dataSave.profile.name=temp; this.dataSave.profile.lastUpdatedAt=today(); this.persist(); nameTxt.setText(temp); this.showToast('Nombre guardado'); },{color:COLORS.green});
  this.button(430,250,220,48,this.dataSave.settings.sound?'Sonido: Sí':'Sonido: No',()=>{this.dataSave.settings.sound=!this.dataSave.settings.sound; this.persist(); this.showOptions();},{color:COLORS.blue});
  this.button(130,330,270,48,'Información del banco',()=>this.showDiagnostic(),{color:COLORS.gold,txtColor:'#2b2116'});
  this.button(430,330,270,48,'Borrar partida actual',()=>{ if(confirm('¿Borrar solo la partida actual?')){this.dataSave.activeGame=null;this.persist();this.showToast('Partida actual borrada');}}, {color:COLORS.red});
  this.button(730,330,270,48,'Resetear TODO',()=>{ const code=prompt('Escribe REINICIAR para borrar todo el progreso'); if(code==='REINICIAR'){localStorage.removeItem(SAVE_KEY); this.dataSave=initialSave(); this.persist(); this.showMenu();}}, {color:COLORS.red});
  this.label(130,430,'Consejo',24); this.label(130,468,'El progreso se guarda automáticamente. Cambiar el nombre o el sonido no reinicia la colección.',18,'#4b3a20','left',850);
 }
 showDiagnostic(){ this.clear(); this.decorate('Información del banco','Resumen técnico del banco y del progreso guardado.'); this.smallBack(()=>this.showOptions()); this.panel(100,120,1080,520,COLORS.paper,.96);
  const total=ALL_WORDS.length, playable=PLAYABLE.length, short=ALL_WORDS.filter(e=>e.answer.length<3).length, long=ALL_WORDS.filter(e=>e.answer.length>20).length;
  const cats=CATEGORIES.map(c=>`${c}: ${ALL_WORDS.filter(e=>e.category===c).length} (${PLAYABLE.filter(e=>e.category===c).length} jugables)`).join('\n');
  this.label(140,150,`Total entradas: ${total}\nJugables 3-20 letras: ${playable}\nDescartadas <3: ${short}\nDescartadas >20: ${long}\nObjetos: ${allCollection().length}\nLogros: ${ACHIEVEMENTS.length}\nPartida activa: ${this.dataSave.activeGame?'sí':'no'}`,22,'#2b2116');
  this.label(620,150,cats,15,'#2b2116','left',500);
 }
 showTutorial(){ this.clear(); this.decorate('Tutorial','Cinco ideas para jugar.'); this.smallBack(); this.panel(150,130,980,470,COLORS.paper,.96);
  const txt='1. No buscas palabras visibles: resuelves pistas.\n\n2. Arrastra desde la primera letra hasta la última.\n\n3. Cada palabra muestra gratis las letras impares y una pista útil. Solo puedes comprar una pista decisiva por palabra; los powerups cuestan Concentración.\n\n4. Cada palabra descubierta entra en tu Códex con fecha de obtención.\n\n5. Puedes guardar y volver al menú sin perder la partida.';
  this.label(210,185,txt,26,'#2b2116','left',860); this.button(500,560,280,54,'Entendido',()=>{this.dataSave.settings.tutorialSeen=true;this.persist();this.showMenu();},{color:COLORS.green}); }
 contractsForTab(){ let cats=this.tab==='Profesional'?PROFESSIONAL:this.tab==='Ciencia/Aula'?AULA:this.tab==='Especiales'?SPECIAL:CATEGORIES; return cats.filter(c=>PLAYABLE.some(e=>e.category===c)); }
 showContracts(){ this.clear(); this.decorate('Contratos','Elige una categoría y acepta una misión con pistas.'); this.smallBack(); ['Profesional','Ciencia/Aula','Especiales','Todo'].forEach((t,i)=>this.button(180+i*230,90,205,42,t,()=>{this.tab=t;this.page=0;this.showContracts();},{color:this.tab===t?COLORS.gold:COLORS.green,txtColor:this.tab===t?'#2b2116':'#fff',size:17}));
  const cats=this.contractsForTab(); const per=6, pages=Math.max(1,Math.ceil(cats.length/per)); this.page=clamp(this.page,0,pages-1); const slice=cats.slice(this.page*per,this.page*per+per);
  slice.forEach((cat,i)=>{ const x=95+(i%3)*390, y=155+Math.floor(i/3)*215; const count=PLAYABLE.filter(e=>e.category===cat).length; this.panel(x,y,340,178,COLORS.paper2,.96,rarityColor(i%3?'Común':'Rara')); this.label(x+20,y+16,cat,22,'#2b2116','left',300); this.label(x+20,y+55,`${count} palabras jugables
Contrato técnico · 7 palabras
Pistas con letras impares gratis
Recompensa: semillas + Códex`,15,'#4b3a20','left',300); this.button(x+72,y+128,195,36,'Aceptar contrato',()=>this.startMission(cat,'mission'),{size:14,color:COLORS.green}); });
  this.pager(500,650,pages,()=>this.showContracts());
 }
 pager(x,y,pages,redraw){ this.button(x-170,y,140,42,'← Anterior',()=>{this.page=clamp(this.page-1,0,pages-1);redraw();},{color:COLORS.gray,size:16}); this.label(x+25,y+10,`Página ${this.page+1} / ${pages}`,18,'#fff'); this.button(x+190,y,140,42,'Siguiente →',()=>{this.page=clamp(this.page+1,0,pages-1);redraw();},{color:COLORS.gray,size:16}); }
 startMission(category,mode='mission',modifier=null){ const pool=PLAYABLE.filter(e=>category==='LoterIA'||category==='Todo'||!category?true:e.category===category); const count=mode==='boss'?10:mode==='expedition'?7+Math.floor(Math.random()*3):7; const words=pick(pool,count,Math.random()).map(e=>({...e, gridWord:e.answer})); let gen; try{ gen=window.generateWordSearch(words,{minPlaced:Math.min(5,count)}); }catch(e){ this.showToast('No se pudo crear la sopa'); return; }
  const active={id:'game_'+Date.now(), mode, category:category||'LoterIA', modifier, board:gen.board, size:gen.size, objectives:gen.objectives.map(o=>({id:o.id, gridWord:o.gridWord, placement:o.placement, found:false, clueLevel:0})), foundPaths:[], energy:mode==='mission'?5:(mode==='boss'?7:8), maxEnergy:mode==='mission'?5:8, concentration:mode==='mission'?7:6, seedsEarned:0, errors:0, usedAdvanced:false, startedAt:today(), powerups:{lupa:1,regadera:1,guantes:1,brujula: mode==='mission'?0:1, linterna:0, semilla:1}, shield:false, selectedObjectiveId:null, finished:false};
  this.dataSave.activeGame=active; this.persist(); this.showGame(); }
 resumeGame(){ if(!this.dataSave.activeGame){this.showToast('No hay partida guardada'); return;} this.showGame(); }
 showGame(){ this.clear(); const g=this.dataSave.activeGame; if(!g){this.showMenu();return;} this.decorate(g.mode==='boss'?'Boss: Diccionario de Raíces':`Contrato: ${g.category}`,`Energía ${g.energy}/${g.maxEnergy} · Concentración ${g.concentration} · Semillas ${g.seedsEarned}`);
  this.button(1030,26,210,44,'Guardar y menú',()=>{this.persist();this.showMenu();},{color:COLORS.gray,size:17}); this.button(880,26,130,44,'Códex',()=>this.showCodex(()=>this.showGame()),{color:COLORS.blue,size:17});
  this.drawBoard(g); this.drawClues(g); this.drawPowerups(g); }
 drawBoard(g){ const maxBoard=560, cell=Math.floor(maxBoard/g.size), ox=52, oy=120; this.boardCells=[]; const boardBg=this.add.graphics(); boardBg.fillStyle(COLORS.paper,.98); boardBg.fillRoundedRect(ox-10,oy-10,cell*g.size+20,cell*g.size+20,18); boardBg.lineStyle(3,COLORS.gold); boardBg.strokeRoundedRect(ox-10,oy-10,cell*g.size+20,cell*g.size+20,18); this.addObj(boardBg);
  const foundSet=new Set(g.foundPaths.flat().map(p=>p.x+','+p.y));
  for(let y=0;y<g.size;y++) for(let x=0;x<g.size;x++){ const rect=this.add.rectangle(ox+x*cell,oy+y*cell,cell-2,cell-2,foundSet.has(x+','+y)?0xb7d99d:0xfff8de).setOrigin(0); rect.setStrokeStyle(1,0xceb36f,.8); const txt=this.add.text(ox+x*cell+cell/2,oy+y*cell+cell/2,g.board[y][x],textStyle(Math.max(15,cell*.48),'#2b2116',{fontWeight:'800'})).setOrigin(.5); const zone=this.add.zone(ox+x*cell,oy+y*cell,cell,cell).setOrigin(0).setInteractive({useHandCursor:true}); zone.cell={x,y}; zone.on('pointerdown',()=>this.startSelect(zone.cell)); zone.on('pointerover',()=>this.moveSelect(zone.cell)); zone.on('pointerup',()=>this.endSelect(zone.cell)); this.ui.push(rect,txt,zone); this.boardCells.push({x,y,rect,txt}); }
 }
 linePath(a,b){ const dx=Math.sign(b.x-a.x), dy=Math.sign(b.y-a.y); if(a.x!==b.x && a.y!==b.y && Math.abs(b.x-a.x)!==Math.abs(b.y-a.y)) return null; const len=Math.max(Math.abs(b.x-a.x),Math.abs(b.y-a.y))+1; const path=[]; for(let i=0;i<len;i++) path.push({x:a.x+dx*i,y:a.y+dy*i}); return path; }
 startSelect(cell){ this.selStart=cell; this.selEnd=cell; this.highlightSelection([cell]); }
 moveSelect(cell){ if(!this.selStart) return; const path=this.linePath(this.selStart,cell); if(path){this.selEnd=cell; this.highlightSelection(path);} }
 endSelect(cell){ if(!this.selStart) return; const g=this.dataSave.activeGame, path=this.linePath(this.selStart,cell); this.selStart=null; this.clearTempHighlights(); if(!path) return; if(path.length<=1){ this.showToast('Una sola letra no cuenta como intento'); return; } const word=path.map(p=>g.board[p.y][p.x]).join(''); const rev=word.split('').reverse().join(''); const obj=g.objectives.find(o=>!o.found && (o.gridWord===word||o.gridWord===rev)); if(obj){ obj.found=true; obj.foundAt=today(); g.foundPaths.push(obj.placement.path); g.seedsEarned+=10+obj.gridWord.length; this.unlockWord(WORD_BY_ID[obj.id]); this.animateFound(obj.placement.path); this.checkGameEnd(); } else { this.badSelection(word); } this.persist(); if(this.dataSave.activeGame) this.time.delayedCall(280,()=>this.showGame()); }
 highlightSelection(path){ this.clearTempHighlights(); this.tempHighlights=path.map(p=>{ const c=this.boardCells.find(c=>c.x===p.x&&c.y===p.y); if(c){ c.rect.setFillStyle(0xffdf7a); return c.rect;} return null; }).filter(Boolean); }
 clearTempHighlights(){ if(this.tempHighlights){ const g=this.dataSave.activeGame; const found=new Set((g?.foundPaths||[]).flat().map(p=>p.x+','+p.y)); this.tempHighlights.forEach(r=>{ const c=this.boardCells.find(c=>c.rect===r); if(c) r.setFillStyle(found.has(c.x+','+c.y)?0xb7d99d:0xfff8de);}); } this.tempHighlights=[]; }
 animateFound(path){ path.forEach((p,i)=>{ const c=this.boardCells.find(c=>c.x===p.x&&c.y===p.y); if(c) this.tweens.add({targets:[c.txt],scale:1.45,yoyo:true,duration:130,delay:i*20});}); this.showToast('¡Palabra descubierta!'); }
 badSelection(){ const g=this.dataSave.activeGame; if(g.shield){ g.shield=false; this.showToast('Guantes usados: error anulado'); return;} g.errors++; g.energy--; this.cameras.main.shake(140,.006); if(g.energy<=0){ this.finishGame(false,'Te quedaste sin energía.'); } }
 drawClues(g){ this.panel(665,105,570,395,COLORS.paper,.96); this.label(690,124,'Pistas útiles',26); this.label(900,130,'Las letras impares y una pista orientativa son gratis. Solo puedes comprar una pista decisiva por palabra.',12,'#4b3a20','left',300);
  const per=5, pages=Math.max(1,Math.ceil(g.objectives.length/per)); g.cluePage=clamp(g.cluePage||0,0,pages-1); const shown=g.objectives.slice(g.cluePage*per,g.cluePage*per+per);
  shown.forEach((o,i)=>{ const e=WORD_BY_ID[o.id]; const idx=g.cluePage*per+i+1; const y=166+i*60; const selected=g.selectedObjectiveId===o.id; this.panel(682,y-6,532,54,o.found?0xdff1d0:(selected?0xfff4d8:COLORS.paper2),.98,selected?COLORS.blue:COLORS.gold); const clue=`${idx}. ${clueForObjective(e,o)}`; const t=this.label(700,y,clue,13,o.found?'#397a48':'#2b2116','left',490); t.setInteractive({useHandCursor:true}).on('pointerup',()=>{g.selectedObjectiveId=o.id; this.showToast(o.found?e.display:'Pista seleccionada'); this.persist(); this.showGame();}); });
  if(pages>1){ this.button(815,466,100,30,'← Pistas',()=>{g.cluePage=clamp((g.cluePage||0)-1,0,pages-1);this.persist();this.showGame();},{size:12,color:COLORS.gray}); this.label(950,473,`Página ${g.cluePage+1}/${pages}`,13,'#4b3a20','center',120).setOrigin(.5); this.button(1010,466,110,30,'Pistas →',()=>{g.cluePage=clamp((g.cluePage||0)+1,0,pages-1);this.persist();this.showGame();},{size:12,color:COLORS.gray}); }
}
 drawPowerups(g){ this.panel(665,520,570,145,COLORS.paper,.96); this.label(690,540,'Powerups consumibles',24); this.label(910,545,'Toca para ver qué hace. No se gasta hasta pulsar USAR.',13,'#4b3a20','left',300); POWERUPS.forEach((p,i)=>{ const x=690+(i%3)*170, y=584+Math.floor(i/3)*42; const qty=g.powerups[p.id]||0; this.button(x,y,156,34,`${p.name.split(' ')[0]} x${qty}`,()=>this.showPowerupInfo(p.id),{size:13,color:qty?COLORS.green:COLORS.gray}); }); }
 closePowerupModal(){ const modal=this.ui.filter(o=>o.name==='powerupModal'); modal.forEach(o=>{try{o.destroy();}catch(e){}}); this.ui=this.ui.filter(o=>o.name!=='powerupModal'); }
 showPowerupInfo(id){ this.closePowerupModal(); const g=this.dataSave.activeGame; const p=POWERUPS.find(x=>x.id===id); if(!p||!g) return; const qty=g.powerups[id]||0; const pending=g.objectives.filter(o=>!o.found); const target=g.selectedObjectiveId?pending.find(o=>o.id===g.selectedObjectiveId):pending[0]; const targetIndex=target?g.objectives.findIndex(o=>o.id===target.id)+1:0; const selectedText=target?`Pista ${targetIndex} seleccionada`:'ninguna pista seleccionada'; const overlay=this.add.rectangle(0,0,W,H,0x000000,.42).setOrigin(0).setInteractive(); overlay.name='powerupModal'; const box=this.add.graphics(); box.name='powerupModal'; box.fillStyle(COLORS.paper,.98); box.fillRoundedRect(355,155,570,390,22); box.lineStyle(4,qty?COLORS.gold:COLORS.gray,1); box.strokeRoundedRect(355,155,570,390,22); const title=this.add.text(395,190,p.name,textStyle(32,'#2b2116',{fontWeight:'900',wordWrap:{width:500}})); title.name='powerupModal'; const body=this.add.text(395,245,`${p.desc}

Cantidad disponible: ${qty}
Coste: ${p.cost} concentración
Concentración actual: ${g.concentration}

Objetivo seleccionado: ${selectedText}

Consejo: toca una tarjeta de pista para seleccionarla. Esta ventana no muestra la palabra para no estropear la partida.`,textStyle(19,'#2b2116',{wordWrap:{width:490},lineSpacing:7})); body.name='powerupModal'; this.ui.push(overlay,box,title,body); const useBtn=this.button(395,470,210,48,qty?'Usar powerup':'Sin unidades',()=>{ if(qty>0){ this.closePowerupModal(); this.usePowerup(id); } },{color:qty?COLORS.green:COLORS.gray,size:18}); const closeBtn=this.button(650,470,210,48,'Cancelar',()=>this.closePowerupModal(),{color:COLORS.gray,size:18}); [useBtn.g,useBtn.t,useBtn.zone,closeBtn.g,closeBtn.t,closeBtn.zone].forEach(o=>o.name='powerupModal'); }

 usePowerup(id){ const g=this.dataSave.activeGame; if(!g||!(g.powerups[id]>0)){this.showToast('No tienes ese powerup'); return;} const pending=g.objectives.filter(o=>!o.found); if(!pending.length) return; let o=g.selectedObjectiveId?pending.find(x=>x.id===g.selectedObjectiveId):pending[0]; if(!o) o=pending[0]; const e=WORD_BY_ID[o.id]; const cost=(POWERUPS.find(p=>p.id===id)||{}).cost||1; if(g.concentration<cost){this.showToast('Falta concentración'); return;} g.concentration-=cost; g.powerups[id]--;
  if(id==='lupa') { const h=pickHiddenEven(o.gridWord); this.showToast(h?`Letra restante: posición ${h.index} = ${h.letter}`:'No quedan letras ocultas que revelar'); }
  if(id==='regadera'){ if(o.clueLevel>0){ g.concentration+=cost; g.powerups[id]++; this.persist(); this.showToast('Esa palabra ya tiene pista comprada'); this.showGame(); return; } o.clueLevel=1; g.usedAdvanced=true; this.showToast('Pista decisiva desbloqueada'); }
  if(id==='guantes'){ g.shield=true; this.showToast('Próximo error anulado'); }
  if(id==='brujula') this.showToast(`Dirección: ${this.dirName(o.placement.dir)}`);
  if(id==='linterna') this.showToast(`Zona útil cerca de fila ${o.placement.start.y+1}, columna ${o.placement.start.x+1}`);
  if(id==='semilla') { const hidden=o.placement.path.filter((p,idx)=>idx%2===1); const p=randItem(hidden.length?hidden:o.placement.path); this.showToast(`Una letra restante está en F${p.y+1} C${p.x+1}`); }
  this.persist(); this.showGame(); }
 dirName(d){ if(d.dx===1&&d.dy===0)return 'derecha'; if(d.dx===-1&&d.dy===0)return 'izquierda'; if(d.dx===0&&d.dy===1)return 'abajo'; if(d.dx===0&&d.dy===-1)return 'arriba'; if(d.dx===1&&d.dy===1)return 'diagonal abajo derecha'; if(d.dx===-1&&d.dy===-1)return 'diagonal arriba izquierda'; if(d.dx===1&&d.dy===-1)return 'diagonal arriba derecha'; return 'diagonal abajo izquierda'; }
 checkGameEnd(){ const g=this.dataSave.activeGame; if(g.objectives.every(o=>o.found)){ this.finishGame(true,'Misión completada'); } }
 finishGame(win,msg){ const g=this.dataSave.activeGame; const found=g.objectives.filter(o=>o.found).length; const total=g.objectives.length; const foundWords=g.objectives.filter(o=>o.found).map(o=>WORD_BY_ID[o.id]?.display||o.gridWord); const newlyFound=foundWords.filter((name,idx)=>{ const obj=g.objectives.filter(o=>o.found)[idx]; return obj && !this.dataSave.codex[obj.id]; }); let bonus=win?80:Math.floor(g.seedsEarned*.35); if(win&&g.errors===0){bonus+=40; this.dataSave.stats.perfect++;} const seedsTotal=g.seedsEarned + bonus; this.dataSave.resources.seeds += seedsTotal; let keyReward=0, secretKeyReward=0; if(win&&g.mode==='mission'){ keyReward=1; this.dataSave.resources.keys+=1; if(g.errors===0&&!g.usedAdvanced&&Math.random()<0.05){ secretKeyReward=1; this.dataSave.resources.secretKeys+=1; }} this.dataSave.stats.games++; if(win&&g.mode==='mission') this.dataSave.stats.missionsDone++; let continueExpedition=false, expeditionFinished=false; if(g.mode==='expedition'){ if(win&&this.dataSave.activeExpedition){ this.dataSave.activeExpedition.node++; this.dataSave.activeExpedition.concentration=Math.min(8,(this.dataSave.activeExpedition.concentration||0)+1); continueExpedition=true; } else { this.dataSave.activeExpedition=null; }} if(g.mode==='boss'){ if(win){ this.dataSave.stats.expeditions++; secretKeyReward+=1; this.dataSave.resources.secretKeys+=1; expeditionFinished=true; } this.dataSave.activeExpedition=null; } this.dataSave.history.unshift({date:today(),category:g.category,mode:g.mode,found,total,errors:g.errors,seeds:seedsTotal,result:win?'completa':'incompleta'}); this.dataSave.history=this.dataSave.history.slice(0,20); this.updateAchievements(); const rewards=[]; if(g.seedsEarned) rewards.push(`Semillas por palabras: +${g.seedsEarned}`); if(bonus) rewards.push(`Bonus de misión: +${bonus}`); if(keyReward) rewards.push(`Llave de vivero: +${keyReward}`); if(secretKeyReward) rewards.push(`Llave prohibida: +${secretKeyReward}`); if(newlyFound.length) rewards.push(`Nuevas fichas del Códex: ${newlyFound.length}`); if(!rewards.length) rewards.push('Sin recompensas nuevas.'); const summary={win,msg,found,total,errors:g.errors,seeds:seedsTotal,mode:g.mode,continueExpedition,expeditionFinished,keyReward,secretKeyReward,rewards,foundWords,newlyFound}; this.dataSave.activeGame=null; this.persist(); this.showReport(summary); }
 showReport(s){ this.clear(); this.decorate('Resumen de recompensas',s.win?'Contrato completado':'Misión incompleta'); this.panel(95,110,1090,540,COLORS.paper,.96); this.label(135,145,s.msg,34,'#2b2116','left',450); this.label(135,195,`Jugador/a: ${this.dataSave.profile.name}
Palabras encontradas: ${s.found}/${s.total}
Errores: ${s.errors}
Semillas totales: +${s.seeds}
Fecha: ${fmtDate(today())}`,23,'#2b2116','left',420); this.panel(580,145,560,210,COLORS.paper2,.98,COLORS.gold); this.label(610,170,'Recompensas de esta sopa',27); (s.rewards||[]).slice(0,5).forEach((r,i)=>this.label(620,215+i*30,'• '+r,18,'#2b2116','left',480)); this.panel(135,390,1005,150,COLORS.paper2,.98,COLORS.green); this.label(165,410,'Palabras encontradas',23); const words=(s.foundWords||[]).slice(0,18).join(' · ') || 'No se encontró ninguna palabra.'; this.label(165,448,words,18,'#2b2116','left',930); if(s.foundWords&&s.foundWords.length>18) this.label(165,505,`Y ${s.foundWords.length-18} más...`,15,'#4b3a20'); this.button(205,575,230,52,'Volver al menú',()=>this.showMenu(),{color:COLORS.green}); if(s.continueExpedition) this.button(500,575,270,52,'Continuar ruta',()=>this.nextExpeditionNode(),{color:COLORS.purple}); else this.button(500,575,270,52,'Nuevo contrato',()=>this.showContracts(),{color:COLORS.gold,txtColor:'#2b2116'}); this.button(835,575,230,52,'Ver Códex',()=>this.showCodex(()=>this.showMenu()),{color:COLORS.blue}); }
 unlockWord(e,{silent=false}={}){ if(!e) return; const r=this.dataSave.codex[e.id] || {unlocked:true,obtainedAt:today(),foundCount:0,new:true}; r.unlocked=true; if(!r.obtainedAt) r.obtainedAt=today(); r.foundCount=(r.foundCount||0)+1; if(r.foundCount>=3) r.mastery='Reconocida'; if(!this.dataSave.activeGame?.usedAdvanced) r.dominada=true; if(this.dataSave.activeGame?.errors===0) r.dorada=true; this.dataSave.codex[e.id]=r; this.dataSave.stats.wordsFound=Object.keys(this.dataSave.codex).length; if(!silent) this.showToast(`Códex: ${e.display}`); }
 showCodex(backCb){ this.clear(); this.decorate('Códex de Palabras','Colección paginada con fecha de obtención, pistas y maestría.'); if(!this.codexTab) this.codexTab='owned'; this.smallBack(backCb||(()=>this.showMenu())); this.renderGallery('codex', backCb); }
 renderGallery(kind, backCb){
 const isCodex=kind==='codex';
 let items=isCodex?ALL_WORDS:allCollection();
 if(isCodex){
   if(!this.codexTab) this.codexTab='owned';
   const ownedIds=new Set(Object.keys(this.dataSave.codex||{}));
   if(this.codexTab==='owned') items=items.filter(it=>ownedIds.has(it.id));
   if(this.codexTab==='recent'){
     items=items.filter(it=>ownedIds.has(it.id)).sort((a,b)=>{
       const da=this.dataSave.codex[a.id]?.obtainedAt||'';
       const db=this.dataSave.codex[b.id]?.obtainedAt||'';
       return db.localeCompare(da);
     });
   }
 }
 const cats=['Todo',...new Set(items.map(i=>i.category))].sort((a,b)=>a==='Todo'?-1:b==='Todo'?1:a.localeCompare(b,'es'));
 if(!cats.includes(this.filter)) this.filter='Todo';
 const filtered=items.filter(it=>this.filter==='Todo'||it.category===this.filter);
 const per=isCodex?15:16;
 const pages=Math.max(1,Math.ceil(filtered.length/per));
 this.page=clamp(this.page,0,pages-1);
 this.panel(55,100,1170,550,COLORS.paper,.94);
 if(isCodex){
   const ownedCount=Object.keys(this.dataSave.codex||{}).length;
   const tabButton=(x,label,tab,w=160)=>this.button(x,118,w,36,label,()=>{this.codexTab=tab;this.filter='Todo';this.page=0;this.showCodex(backCb);},{size:14,color:this.codexTab===tab?COLORS.gold:COLORS.green,txtColor:this.codexTab===tab?'#2b2116':'#fff'});
   tabButton(80,'Conseguidos', 'owned',155);
   tabButton(250,'Recientes', 'recent',135);
   tabButton(400,'Ver todo', 'all',125);
   this.label(545,125,`Mostrando: ${this.codexTab==='owned'?'conseguidos':this.codexTab==='recent'?'recientes':'todo el banco'} · ${ownedCount}/${ALL_WORDS.length}`,15,'#2b2116','left',410);
   this.button(975,118,130,36,'Filtro +',()=>{ const idx=cats.indexOf(this.filter); this.filter=cats[(idx+1)%cats.length]; this.page=0; this.showCodex(backCb);},{size:15,color:COLORS.blue});
   this.label(80,158,`Filtro: ${this.filter}`,15,'#4b3a20','left',700);
 } else {
   this.button(80,118,130,36,'Todo',()=>{this.filter='Todo';this.page=0; this.showCollection();},{size:15,color:this.filter==='Todo'?COLORS.gold:COLORS.green,txtColor:this.filter==='Todo'?'#2b2116':'#fff'});
   this.button(225,118,160,36,'Filtro +',()=>{ const idx=cats.indexOf(this.filter); this.filter=cats[(idx+1)%cats.length]; this.page=0; this.showCollection();},{size:15,color:COLORS.blue});
   this.label(410,125,`Filtro: ${this.filter}`,16,'#2b2116');
 }
 if(isCodex && filtered.length===0){
   this.label(120,250,this.codexTab==='owned'?'Todavía no has conseguido palabras en este filtro. Juega una misión para llenar el Códex.':'No hay palabras recientes en este filtro.',24,'#2b2116','left',960);
 }
 filtered.slice(this.page*per,this.page*per+per).forEach((it,i)=>{ const x=90+(i%5)*225, y=190+Math.floor(i/5)*128; const rec=isCodex?this.dataSave.codex[it.id]:this.dataSave.items[it.id]; const unlocked=!!rec; this.panel(x,y,205,101,unlocked?COLORS.paper2:0xc9b990,.98,unlocked?rarityColor(it.rarity):COLORS.gray); if(!isCodex){ this.drawItemIcon(unlocked?it:{...it,symbol:'?',color:0x777777},x+38,y+47,.72); } const title=unlocked?(isCodex?it.display:it.name):'???'; this.label(x+(isCodex?12:78),y+10,title,isCodex?16:14,unlocked?'#2b2116':'#5f574a','left',isCodex?180:112); this.label(x+(isCodex?12:78),y+36,it.category,12,'#675333','left',isCodex?180:105); this.label(x+(isCodex?12:78),y+58,unlocked?`Obtenido: ${fmtDate(rec.obtainedAt)}\n${isCodex?masteryName(rec):it.rarity}`:'No descubierto todavía',12,'#3d4b2f','left',isCodex?178:110); const z=this.add.zone(x,y,205,101).setOrigin(0).setInteractive({useHandCursor:true}); z.on('pointerup',()=>this.tooltip(isCodex?this.wordTooltip(it,rec):this.itemTooltip(it,rec), x+20, y+90)); this.addObj(z); });
 this.pager(510,660,pages,()=>isCodex?this.showCodex(backCb):this.showCollection()); }
 wordTooltip(it,rec){ if(!rec) return 'No descubierto todavía. Encuentra esta palabra en una sopa para revelar su ficha.'; return `${it.display}\nCategoría: ${it.category}\nSubcategoría: ${it.subcategory}\nRareza: ${it.rarity}\nObtenido: ${fmtDate(rec.obtainedAt)}\nEncontrada: ${rec.foundCount||1} veces\nEstado: ${masteryName(rec)}\n\nPista final: ${it.signals?.[3]||''}`; }
 itemTooltip(it,rec){ if(!rec) return 'No descubierto todavía.'; return `${it.name}
Categoría: ${it.category}${it.slot?' · Ranura: '+it.slot:''}
Rareza: ${it.rarity}
Obtenido: ${fmtDate(rec.obtainedAt)}

${it.tooltip}`; }
 tooltip(txt,x,y){ const existing=this.ui.filter(o=>o.name==='tooltip'); existing.forEach(o=>o.destroy()); this.ui=this.ui.filter(o=>o.name!=='tooltip'); const h=170; const px=clamp(x,40,W-430), py=clamp(y,80,H-h-20); const p=this.add.graphics(); p.name='tooltip'; p.fillStyle(COLORS.dark2,.98); p.fillRoundedRect(px,py,390,h,14); p.lineStyle(2,COLORS.gold); p.strokeRoundedRect(px,py,390,h,14); const t=this.add.text(px+18,py+16,txt,textStyle(15,'#fff',{wordWrap:{width:354}})); t.name='tooltip'; this.ui.push(p,t); this.time.delayedCall(4200,()=>{p.destroy();t.destroy();}); }
 showCollection(){ this.clear(); this.decorate('Colección','Objetos, herramientas, plantas, decoración y reliquias.'); this.smallBack(); this.renderGallery('items'); }
 showGarden(){ this.clear(); this.decorate('Mi Jardín','Galería visual de tus objetos desbloqueados.'); this.smallBack(); this.panel(55,105,1170,550,COLORS.paper,.94); const owned=allCollection().filter(i=>this.dataSave.items[i.id]); this.label(95,128,`Objetos colocados: ${owned.length}/${allCollection().length}`,24); this.drawAvatar(1010,260,1.2); const show=owned.slice(0,36); show.forEach((it,i)=>{ const x=95+(i%9)*98,y=185+Math.floor(i/9)*105; this.drawItemIcon(it,x+39,y+32,.85); this.label(x+39,y+67,it.name.split(' ').slice(0,2).join(' '),11,'#2b2116','center',92).setOrigin(.5,0); }); if(!owned.length) this.label(220,320,'Abre cajas, completa contratos o compra objetos para llenar tu jardín.',26,'#4b3a20','center',760); }
 drawItemIcon(it,x,y,scale=1){ const g=this.add.graphics(); const col=it.color||rarityColor(it.rarity); g.fillStyle(col,.95); g.fillRoundedRect(x-28*scale,y-28*scale,56*scale,56*scale,14*scale); g.lineStyle(3,0xffffff,.85); g.strokeRoundedRect(x-28*scale,y-28*scale,56*scale,56*scale,14*scale); this.addObj(g); const emoji=it.symbol||({Herramientas:'🛠️',Plantas:'🌿',Flores:'🌸',Decoración:'🏡',Reliquias:'✨',Prohibidos:'🖤'}[it.category]||'🎁'); const t=this.label(x,y,emoji,28*scale,'#fff','center').setOrigin(.5); return {g,t}; }
 drawAvatar(x,y,scale=1){
  const eq=this.dataSave.profile.equipped||{};
  const outfit=eq.outfit?allCollection().find(i=>i.id===eq.outfit):null;
  const hat=eq.hat?allCollection().find(i=>i.id===eq.hat):null;
  const badge=eq.badge?allCollection().find(i=>i.id===eq.badge):null;
  const g=this.add.graphics();
  const skin=0xf2c199, outline=0x2b2116;

  // Sombra y cuerpo base. La ropa se dibuja como prenda real, no como icono pegado al centro.
  g.fillStyle(0x000000,.12);
  g.fillEllipse(x,y+78*scale,104*scale,24*scale);
  g.fillStyle(outfit?.color||0x3f8f62,1);
  g.fillRoundedRect(x-43*scale,y-38*scale,86*scale,112*scale,22*scale);
  g.lineStyle(4,outline,.28);
  g.strokeRoundedRect(x-43*scale,y-38*scale,86*scale,112*scale,22*scale);

  // Brazos para que la indumentaria tenga silueta y no parezca un emoji flotante.
  g.fillStyle(outfit?.color||0x3f8f62,.95);
  g.fillRoundedRect(x-66*scale,y-24*scale,24*scale,82*scale,12*scale);
  g.fillRoundedRect(x+42*scale,y-24*scale,24*scale,82*scale,12*scale);
  g.fillStyle(skin,1);
  g.fillCircle(x-54*scale,y+64*scale,11*scale);
  g.fillCircle(x+54*scale,y+64*scale,11*scale);

  // Detalles específicos de cada prenda equipable.
  if(outfit){
    const id=outfit.id;
    if(id==='acc_outfit_jardinero'){
      g.fillStyle(0x2f6f4d,1);
      g.fillRoundedRect(x-28*scale,y-26*scale,56*scale,92*scale,12*scale);
      g.fillStyle(0xe7f0d2,1);
      g.fillRoundedRect(x-30*scale,y-35*scale,14*scale,78*scale,6*scale);
      g.fillRoundedRect(x+16*scale,y-35*scale,14*scale,78*scale,6*scale);
      g.fillStyle(0xf6d36b,1);
      g.fillCircle(x-22*scale,y-12*scale,4*scale);
      g.fillCircle(x+22*scale,y-12*scale,4*scale);
      g.fillStyle(0x24563b,1);
      g.fillRoundedRect(x-19*scale,y+16*scale,38*scale,26*scale,6*scale);
      g.lineStyle(2,0xffffff,.35);
      g.strokeRoundedRect(x-19*scale,y+16*scale,38*scale,26*scale,6*scale);
    } else if(id==='acc_outfit_abeja'){
      for(let k=0;k<4;k++){ g.fillStyle(k%2?0x1d1b16:0xf3c743,1); g.fillRoundedRect(x-37*scale,y+(-27+k*24)*scale,74*scale,16*scale,7*scale); }
      g.fillStyle(0xffffff,.38);
      g.fillEllipse(x-48*scale,y+2*scale,34*scale,58*scale);
      g.fillEllipse(x+48*scale,y+2*scale,34*scale,58*scale);
    } else if(id==='acc_outfit_petalos'){
      [0,1,2,3,4,5].forEach((k)=>{ const a=(Math.PI*2/6)*k; g.fillStyle(k%2?0xe28ab9:0xf0b6cf,.85); g.fillEllipse(x+Math.cos(a)*38*scale,y+12*scale+Math.sin(a)*32*scale,25*scale,50*scale,a); });
      g.fillStyle(0xdb7ba9,1); g.fillRoundedRect(x-34*scale,y-30*scale,68*scale,96*scale,18*scale);
    } else if(id==='acc_outfit_compost'){
      g.fillStyle(0x5f4328,1); g.fillRoundedRect(x-35*scale,y-30*scale,70*scale,100*scale,16*scale);
      g.lineStyle(3,0xd7b982,.75); g.strokeRoundedRect(x-35*scale,y-30*scale,70*scale,100*scale,16*scale);
      g.fillStyle(0x91bd5d,1); g.fillCircle(x-18*scale,y+6*scale,8*scale); g.fillCircle(x+18*scale,y+30*scale,7*scale);
    } else if(id==='acc_outfit_hiedra'){
      g.lineStyle(5,0x1e5d35,.9); g.beginPath(); g.moveTo(x-35*scale,y+60*scale); g.curveTo(x-6*scale,y+22*scale,x-30*scale,y-8*scale,x+24*scale,y-30*scale); g.strokePath();
      for(let k=0;k<6;k++){ g.fillStyle(0x74b66a,1); g.fillEllipse(x+(-30+k*12)*scale,y+(-12+k*10)*scale,16*scale,10*scale,0.5); }
    } else if(id==='acc_outfit_fantasma'){
      g.fillStyle(0xd8fff2,.42); g.fillRoundedRect(x-48*scale,y-42*scale,96*scale,126*scale,30*scale);
      g.fillStyle(0xffffff,.26); g.fillCircle(x-24*scale,y+74*scale,10*scale); g.fillCircle(x,y+78*scale,10*scale); g.fillCircle(x+24*scale,y+74*scale,10*scale);
    } else if(id==='acc_outfit_dragon'){
      g.fillStyle(0x4c205d,.92); g.fillTriangle(x-48*scale,y-10*scale,x-104*scale,y-48*scale,x-76*scale,y+58*scale);
      g.fillTriangle(x+48*scale,y-10*scale,x+104*scale,y-48*scale,x+76*scale,y+58*scale);
      g.fillStyle(0xff8a48,1); g.fillTriangle(x-10*scale,y-34*scale,x,y-56*scale,x+10*scale,y-34*scale);
    }
  }

  // Cabeza y cara por encima de la ropa.
  g.fillStyle(skin,1);
  g.fillCircle(x,y-70*scale,34*scale);
  g.fillStyle(outline,.85);
  g.fillCircle(x-12*scale,y-74*scale,3*scale);
  g.fillCircle(x+12*scale,y-74*scale,3*scale);
  g.lineStyle(3,outline,.7);
  g.beginPath(); g.arc(x,y-62*scale,12*scale,0,Math.PI,false); g.strokePath();

  if(badge){
    g.fillStyle(badge.color||COLORS.gold,1);
    g.fillCircle(x+28*scale,y+8*scale,13*scale);
    g.lineStyle(2,0xffffff,.85); g.strokeCircle(x+28*scale,y+8*scale,13*scale);
  }
  this.addObj(g);

  // Los símbolos solo se usan para sombreros e insignias, no para ropa, para evitar iconos en el pecho.
  if(hat) this.label(x,y-114*scale,hat.symbol||'🎩',42*scale,'#fff','center').setOrigin(.5);
  if(badge) this.label(x+28*scale,y+8*scale,badge.symbol||'⭐',17*scale,'#fff','center').setOrigin(.5);
 }
 
 showWardrobe(){ this.clear(); this.decorate('Armario','Equipa sombreros, indumentaria e insignias. Todos los accesorios son visibles y únicos.'); this.smallBack(); this.panel(55,110,1170,540,COLORS.paper,.94); this.drawAvatar(1040,340,1.55); const items=allCollection().filter(i=>['Sombreros','Indumentaria','Insignias'].includes(i.category)&&this.dataSave.items[i.id]); const per=12,pages=Math.max(1,Math.ceil(items.length/per)); this.page=clamp(this.page,0,pages-1); this.label(90,130,`Accesorios desbloqueados: ${items.length}`,22,'#2b2116'); if(!items.length){ this.label(110,230,'Abre la Caja de Llaves o la Caja Prohibida para conseguir accesorios visibles.',26,'#4b3a20','left',700); } items.slice(this.page*per,this.page*per+per).forEach((it,i)=>{ const x=90+(i%4)*220,y=180+Math.floor(i/4)*130; const equipped=this.dataSave.profile.equipped?.[it.slot]===it.id; this.panel(x,y,195,105,equipped?0xfff4d8:COLORS.paper2,.98,equipped?COLORS.blue:rarityColor(it.rarity)); this.drawItemIcon(it,x+38,y+40,.72); this.label(x+75,y+18,it.name,14,'#2b2116','left',105); this.label(x+75,y+55,`${it.category}
${equipped?'Equipado · tocar para quitar':'Tocar para equipar'}`,12,'#4b3a20','left',108); const z=this.add.zone(x,y,195,105).setOrigin(0).setInteractive({useHandCursor:true}); z.on('pointerup',()=>{ this.dataSave.profile.equipped=this.dataSave.profile.equipped||{}; if(equipped){ delete this.dataSave.profile.equipped[it.slot]; this.showToast('Objeto desequipado'); } else { this.dataSave.profile.equipped[it.slot]=it.id; this.showToast('Objeto equipado'); } this.persist(); this.showWardrobe(); }); this.addObj(z); });
 this.button(770,595,120,38,'Quitar sombrero',()=>{this.dataSave.profile.equipped=this.dataSave.profile.equipped||{}; delete this.dataSave.profile.equipped.hat; this.persist(); this.showWardrobe();},{size:13,color:COLORS.gray});
 this.button(910,595,110,38,'Quitar ropa',()=>{this.dataSave.profile.equipped=this.dataSave.profile.equipped||{}; delete this.dataSave.profile.equipped.outfit; this.persist(); this.showWardrobe();},{size:13,color:COLORS.gray});
 this.button(1040,595,135,38,'Quitar insignia',()=>{this.dataSave.profile.equipped=this.dataSave.profile.equipped||{}; delete this.dataSave.profile.equipped.badge; this.persist(); this.showWardrobe();},{size:13,color:COLORS.gray});
 this.pager(380,660,pages,()=>this.showWardrobe()); }
 showBoxes(){ this.clear(); this.decorate('Cajas','Abre cajas: las de llaves dan sombreros, indumentaria e insignias visibles en el Armario.'); this.smallBack(); this.panel(75,120,1130,500,COLORS.paper,.94); this.label(110,150,`Semillas: ${this.dataSave.resources.seeds} · Llaves de vivero: ${this.dataSave.resources.keys} · Llaves prohibidas: ${this.dataSave.resources.secretKeys}`,20,'#2b2116'); this.panel(820,140,350,70,COLORS.paper2,.98,COLORS.purple); this.label(845,153,'Conseguir llave prohibida',16,'#2b2116'); this.button(845,176,145,28,'600 semillas',()=>this.buySecretKey('seeds'),{size:12,color:COLORS.purple}); this.button(1005,176,135,28,'3 llaves',()=>this.buySecretKey('keys'),{size:12,color:COLORS.gold,txtColor:'#2b2116'}); const boxes=[['Caja Semillero',80,'normal','semillas'],['Caja Herramientas',130,'tool','semillas'],['Caja Florista',160,'plant','semillas'],['Caja de Llaves',1,'key_accessory','llave de vivero'],['Caja Prohibida',1,'secret','llave prohibida']]; boxes.forEach((b,i)=>{ const x=115+i*220,y=235; const secret=b[2]==='secret'; const key=b[2]==='key_accessory'; this.panel(x,y,190,245,secret?0x2d1734:(key?0xe9d18a:COLORS.paper2),.96,secret?COLORS.purple:(key?COLORS.gold:COLORS.green)); this.label(x+95,y+28,secret?'🗝️':(key?'🎩':'📦'),46,secret?'#fff':'#2b2116','center').setOrigin(.5); this.label(x+16,y+92,b[0],18,secret?'#fff':'#2b2116','center',158); const price=b[3]==='semillas'?`${b[1]} semillas`:`${b[1]} ${b[3]}`; const hint=key?'Sombreros e indumentaria':secret?'Accesorios prohibidos':'Objetos de colección'; this.label(x+18,y+130,`${price}
${hint}`,14,secret?'#f7edcf':'#4b3a20','center',150); this.button(x+35,y+188,120,38,'Abrir',()=>this.openBox(b),{size:15,color:secret?COLORS.purple:(key?COLORS.gold:COLORS.green),txtColor:key?'#2b2116':'#fff'}); }); }
 buySecretKey(method){ if(method==='seeds'){ if(this.dataSave.resources.seeds<600){this.showToast('Necesitas 600 semillas'); return;} this.dataSave.resources.seeds-=600; } else { if(this.dataSave.resources.keys<3){this.showToast('Necesitas 3 llaves de vivero'); return;} this.dataSave.resources.keys-=3; } this.dataSave.resources.secretKeys+=1; this.persist(); this.showToast('+1 llave prohibida'); this.showBoxes(); }
openBox(b){ const [name,price,type,currency]=b; if(type==='secret'){ if(this.dataSave.resources.secretKeys<price){this.showToast('Necesitas llave prohibida'); return;} this.dataSave.resources.secretKeys-=price; } else if(type==='key_accessory'){ if(this.dataSave.resources.keys<price){this.showToast('Necesitas llave de vivero'); return;} this.dataSave.resources.keys-=price; } else { if(this.dataSave.resources.seeds<price){this.showToast('Faltan semillas'); return;} this.dataSave.resources.seeds-=price; }
  const pool=allCollection().filter(i=> type==='secret'?(i.secret||i.rarity==='Prohibida'): type==='key_accessory'?(['Sombreros','Indumentaria','Insignias'].includes(i.category)&&!i.secret): type==='plant'?i.category==='Plantas': type==='tool'?i.category==='Herramientas': !i.secret);
  const choices=pick(pool, type==='key_accessory'||type==='secret'?2:3, Math.random()); let msg=[]; choices.forEach(it=>{ if(this.dataSave.items[it.id]){this.dataSave.resources.dust+=10; msg.push(`Repetido: ${it.name} (+10 polvo)`);} else {this.dataSave.items[it.id]={unlocked:true,obtainedAt:today(),new:true}; msg.push(`Nuevo: ${it.name}`);} }); this.dataSave.stats.boxes++; this.updateAchievements(); this.persist(); this.boxReveal(msg); }
 boxReveal(lines){ this.clear(); this.decorate('Caja abierta','Recompensas obtenidas'); this.panel(260,150,760,390,COLORS.paper,.96); lines.forEach((l,i)=>this.label(330,220+i*55,l,25,'#2b2116')); this.button(500,520,280,54,'Seguir abriendo',()=>this.showBoxes(),{color:COLORS.green}); }
 showShop(){ this.clear(); this.decorate('Tienda','Solo aparecen objetos que todavía no tienes.'); this.smallBack(); this.panel(70,110,1140,540,COLORS.paper,.94); const unowned=allCollection().filter(i=>!this.dataSave.items[i.id]&&!i.secret); const per=12, pages=Math.max(1,Math.ceil(unowned.length/per)); this.page=clamp(this.page,0,pages-1); unowned.slice(this.page*per,this.page*per+per).forEach((it,i)=>{ const x=105+(i%4)*280,y=155+Math.floor(i/4)*145; this.panel(x,y,250,120,COLORS.paper2,.96,rarityColor(it.rarity)); this.label(x+15,y+14,it.name,18); this.label(x+15,y+44,`${it.category} · ${it.rarity}\n${it.price} semillas`,14,'#4b3a20'); this.button(x+145,y+74,85,34,'Comprar',()=>{ if(this.dataSave.resources.seeds<it.price){this.showToast('Faltan semillas');return;} this.dataSave.resources.seeds-=it.price; this.dataSave.items[it.id]={unlocked:true,obtainedAt:today(),new:true}; this.persist(); this.showShop();},{size:13,color:COLORS.green}); }); this.pager(500,660,pages,()=>this.showShop()); }
 showAchievements(){ this.clear(); this.decorate('Logros','Insignias paginadas con recompensas reclamables.'); this.smallBack(); this.panel(70,110,1140,540,COLORS.paper,.94); const per=12,pages=Math.max(1,Math.ceil(ACHIEVEMENTS.length/per)); this.page=clamp(this.page,0,pages-1); ACHIEVEMENTS.slice(this.page*per,this.page*per+per).forEach((a,i)=>{ const rec=this.dataSave.achievements[a.id]; const x=105+(i%4)*280,y=150+Math.floor(i/4)*150; const done=rec?.done, claimed=rec?.claimed; this.panel(x,y,250,125,done?COLORS.paper2:0xc9b990,.96,done?COLORS.gold:COLORS.gray); this.label(x+15,y+12,done||!a.secret?a.name:'???',18,done?'#2b2116':'#5d5141','left',220); this.label(x+15,y+42,done||!a.secret?a.desc:'Logro secreto',13,'#4b3a20','left',215); this.label(x+15,y+80,done?`Obtenido: ${fmtDate(rec.obtainedAt)}`:'Pendiente',12,'#3d4b2f'); if(done&&!claimed) this.button(x+145,y+82,85,30,'Reclamar',()=>{rec.claimed=true; this.dataSave.resources.seeds+=a.reward; this.persist(); this.showAchievements();},{size:12,color:COLORS.green}); }); this.pager(500,660,pages,()=>this.showAchievements()); }
 updateAchievements(){ const s=this.dataSave.stats, codexCount=Object.keys(this.dataSave.codex).length; ACHIEVEMENTS.forEach(a=>{ if(this.dataSave.achievements[a.id]?.done) return; let done=false; if(a.id.startsWith('words_')) done=codexCount>=parseInt(a.id.split('_')[1]); if(a.id.startsWith('boxes_')) done=s.boxes>=parseInt(a.id.split('_')[1]); if(a.id.startsWith('perfect_')) done=s.perfect>=parseInt(a.id.split('_')[1]); if(a.id.startsWith('exp_')) done=s.expeditions>=parseInt(a.id.split('_')[1]); if(a.id.startsWith('cat_')){ const catName=a.name.replace('Maestría: ',''); done=Object.keys(this.dataSave.codex).filter(id=>WORD_BY_ID[id]?.category===catName).length>=25; } if(done) this.dataSave.achievements[a.id]={done:true,obtainedAt:today(),claimed:false,new:true}; }); }
 showProfile(){ this.clear(); this.decorate('Perfil','Estadísticas, historial y progreso guardado.'); this.smallBack(); this.panel(80,120,520,510,COLORS.paper,.96); this.label(120,155,this.dataSave.profile.name||'Jugador/a',34); const s=this.dataSave.stats; this.label(120,210,`Fecha de inicio: ${fmtDate(this.dataSave.profile.createdAt)}\nPalabras descubiertas: ${Object.keys(this.dataSave.codex).length}\nObjetos conseguidos: ${Object.keys(this.dataSave.items).length}\nLogros desbloqueados: ${Object.values(this.dataSave.achievements).filter(a=>a.done).length}\nSopas jugadas: ${s.games}\nSopas perfectas: ${s.perfect}\nExpediciones completadas: ${s.expeditions}\nSemillas: ${this.dataSave.resources.seeds}
Llaves de vivero: ${this.dataSave.resources.keys}
Llaves prohibidas: ${this.dataSave.resources.secretKeys}`,22,'#2b2116','left',440); this.panel(640,120,560,510,COLORS.paper,.96); this.label(680,155,'Últimas partidas',30); (this.dataSave.history||[]).slice(0,8).forEach((h,i)=>this.label(680,205+i*45,`${fmtDate(h.date)} · ${h.category} · ${h.found}/${h.total} · ${h.result}`,16,'#2b2116','left',500)); }
 showExpedition(){ this.clear(); this.decorate('Expedición','Ruta roguelike con nodos, eventos y boss final sencillo.'); this.smallBack(); this.panel(120,120,1040,500,COLORS.paper,.94); this.label(160,155,'Expedición al Invernadero Oculto',34); this.label(160,205,'Supera nodos de sopa de letras, eventos y una prueba final. Si pierdes energía, termina la run, pero conservas el Códex y los objetos permanentes.',21,'#2b2116','left',920);
  const nodes=['Contrato','Evento','Contrato difícil','Cofre','Nodo secreto','Boss']; nodes.forEach((n,i)=>{ const x=190+i*165,y=360+(i%2)*40; const g=this.add.graphics(); g.fillStyle(i===5?COLORS.purple:COLORS.green,.95); g.fillCircle(x,y,42); g.lineStyle(4,COLORS.gold); g.strokeCircle(x,y,42); this.addObj(g); this.label(x,y-10,i===5?'☠':'✦',28,'#fff','center').setOrigin(.5); this.label(x-65,y+58,n,15,'#2b2116','center',130); if(i<nodes.length-1){ const l=this.add.line(0,0,x+43,y,x+123,360+((i+1)%2)*40,0xd6a441).setOrigin(0); l.setLineWidth(4); this.addObj(l);} });
  this.button(480,565,320,56,'Iniciar expedición',()=>{ this.startExpeditionRun(); },{color:COLORS.purple,size:22}); }
 startExpeditionRun(){ this.dataSave.activeExpedition={node:0,energy:9,maxEnergy:9,concentration:6,relics:pick(RELICS,2).map(r=>r.id),startedAt:today()}; this.persist(); this.nextExpeditionNode(); }
 nextExpeditionNode(){ const ex=this.dataSave.activeExpedition; if(!ex){this.showExpedition(); return;} const cats=['JardinerIA','Zona Segura','Botánica de Campo','Almacén del Vivero','Clínica Vegetal','Red de Riego','Tierra Viva','FloristerIA','FantasIA','ZombIA']; if(ex.node>=5){ this.startMission('LoterIA','boss'); return; } if(ex.node===1||ex.node===3){ this.showEventNode(); return; } this.startMission(randItem(cats),'expedition'); }
 showEventNode(){ this.clear(); this.decorate('Evento de expedición','Elige con cuidado.'); this.panel(230,150,820,420,COLORS.paper,.96); const events=[['Etiqueta mojada','Leerla: +1 concentración','Guardarla: +40 semillas'],['Caja vieja','Abrir: objeto o polvo','Ignorar: +1 energía'],['Niebla verde','Atravesar: +1 llave','Esperar: sin riesgo']]; const ev=randItem(events); this.label(290,210,ev[0],36); this.label(290,265,'Una situación extraña aparece en la ruta del vivero.',22,'#2b2116','left',680); this.button(310,380,270,58,ev[1],()=>{this.eventReward(0);},{color:COLORS.green}); this.button(650,380,270,58,ev[2],()=>{this.eventReward(1);},{color:COLORS.gold,txtColor:'#2b2116'}); }
 eventReward(choice){ const ex=this.dataSave.activeExpedition; if(choice===0){ this.dataSave.resources.keys+=1; this.dataSave.resources.seeds+=25;} else { this.dataSave.resources.seeds+=40; if(ex) ex.energy=Math.min(ex.maxEnergy,ex.energy+1);} if(ex) ex.node++; this.persist(); this.showToast('Evento resuelto'); this.time.delayedCall(350,()=>this.nextExpeditionNode()); }
 showCodexFromGame(){ this.showCodex(()=>this.showGame()); }
}
const config={type:Phaser.AUTO,parent:'game',width:W,height:H,backgroundColor:'#10251b',scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[JardinScene]};
window.addEventListener('load',()=>{ new Phaser.Game(config); });
})();
