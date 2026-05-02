const STORAGE_KEY = 'identificando-material-vegetal-4-1-phaser';
const W = 1280;
const H = 720;

const palette = {
  bg: 0xf3f8ee,
  ink: '#203120',
  green: 0x4caf50,
  greenDark: 0x2f6b36,
  greenSoft: 0xeaf6df,
  paper: 0xffffff,
  gold: 0xd4af37,
  danger: 0xb84a4a,
  muted: 0xdfead8,
  blue: 0x3f7fbb
};

const sections = [
  { id:'material', title:'Material vegetal', icon:'🌱', desc:'Semillas, plántulas, plantones, esquejes, bulbos, tubérculos, rizomas y plantas en cepellón o maceta.', type:'quiz', qs:[
    ['¿Qué material se usa para iniciar muchos cultivos y necesita humedad, temperatura y oxígeno adecuados?', ['Semillas','Bulbos','Esquejes','Plantones'],0,'Las semillas son la forma más común de iniciar muchos cultivos.'],
    ['Son plantas muy jóvenes, recién nacidas o con poco desarrollo, y son delicadas.', ['Plantones','Plántulas','Rizomas','Tubérculos'],1,'Las plántulas necesitan bastante cuidado porque son delicadas.'],
    ['¿Qué material es una planta joven más desarrollada que una plántula y suele estar lista para trasplantarse?', ['Plantón','Esqueje','Semilla','Bulbo'],0,'El plantón ya está más desarrollado y suele ir al terreno o a una jardinera.'],
    ['¿Qué material son trozos de tallo, hoja o raíz que se usan para obtener una nueva planta?', ['Bulbos','Esquejes','Plántulas','Rizomas'],1,'El esqueje es una forma de multiplicación vegetativa.'],
    ['¿Qué órgano subterráneo de reserva representa la cebolla?', ['Tubérculo','Rizoma','Bulbo','Plantón'],2,'Los bulbos son órganos subterráneos de reserva; por ejemplo, la cebolla.'],
    ['La patata es un ejemplo de…', ['Bulbo','Tubérculo','Rizoma','Plántula'],1,'Los tubérculos almacenan alimento; la patata es el ejemplo del tema.'],
    ['¿Qué material vegetal es un tallo subterráneo que crece horizontalmente?', ['Rizoma','Bulbo','Semilla','Esqueje'],0,'Los rizomas son tallos subterráneos horizontales, como en el jengibre o el bambú.'],
    ['¿Cómo se llaman las plantas que ya vienen enraizadas y con su sustrato?', ['Plantas en cepellón o en maceta','Semillas','Plántulas','Esquejes'],0,'Las plantas en cepellón o maceta ya vienen enraizadas y con sustrato.']
  ]},
  { id:'planta', title:'Partes básicas de la planta', icon:'🪴', desc:'Raíz, tallo, hojas, flor, fruto y semilla.', type:'quiz', qs:[
    ['¿Qué parte sujeta la planta al suelo y absorbe agua y sales minerales?', ['Fruto','Raíz','Semilla','Flor'],1,'La raíz normalmente está bajo tierra y cumple esa función.'],
    ['¿Qué parte sostiene la planta y comunica la raíz con hojas, flores y frutos?', ['Tallo','Hoja','Fruto','Bulbo'],0,'El tallo sostiene y comunica.'],
    ['¿Qué parte suele ser verde y realiza la fotosíntesis?', ['Hojas','Semillas','Raíces','Flores'],0,'Las hojas suelen ser verdes y realizan la fotosíntesis.'],
    ['¿Cuál es el órgano reproductor de muchas plantas?', ['Flor','Fruto','Raíz','Tallo'],0,'La flor es el órgano reproductor de muchas plantas.'],
    ['¿Qué estructura protege a la semilla?', ['Fruto','Tallo','Raíz','Hoja'],0,'El fruto protege a la semilla.'],
    ['¿Qué contiene el embrión de una nueva planta y puede germinar?', ['Flor','Semilla','Hoja','Bulbo'],1,'La semilla contiene el embrión y germina si las condiciones son adecuadas.'],
    ['Para identificar una planta, las hojas ayudan mucho por su forma, tamaño y…', ['Borde','Humedad','Maceta','Raíz'],0,'La forma, el tamaño y el borde de las hojas ayudan a identificar.']
  ]},
  { id:'flor', title:'Partes de la flor', icon:'🌸', desc:'Coloca pistilo, antera, estigma, tallo, sépalo, filamento, pétalo, ovarios y óvulo sobre la imagen.', type:'place', asset:'flor', terms:['pistilo','antera','estigma','tallo','sépalo','filamento','pétalo','ovarios','óvulo'], numbered:false,
    slots:[
      ['antera',.088,.262,.145,.068], ['filamento',.088,.390,.152,.068], ['pétalo',.086,.521,.154,.068], ['sépalo',.140,.686,.162,.068], ['tallo',.180,.819,.168,.068],
      ['estigma',.740,.287,.158,.068], ['pistilo',.734,.413,.158,.068], ['óvulo',.724,.549,.154,.068], ['ovarios',.718,.660,.162,.068]
    ]
  },
  { id:'hoja', title:'Partes de la hoja', icon:'🍃', desc:'La imagen de la hoja está adaptada: no muestra el concepto dentro de los recuadros.', type:'place', asset:'hoja', terms:['envés','haz','limbo','nervios','pecíolo','borde'], numbered:true,
    slots:[
      ['envés',.045,.032,.290,.142], ['haz',.555,.032,.210,.142], ['limbo',.130,.360,.200,.155], ['nervios',.632,.354,.330,.178], ['pecíolo',.020,.725,.240,.150], ['borde',.588,.763,.240,.130]
    ]
  },
  { id:'tipos', title:'Tipos básicos de plantas', icon:'🌳', desc:'Árboles, arbustos, herbáceas, anuales, bianuales y perennes.', type:'quiz', qs:[
    ['¿Qué grupo tiene un tronco principal y suele alcanzar bastante altura?', ['Árboles','Arbustos','Herbáceas','Anuales'],0,'Los árboles tienen un tronco principal.'],
    ['El olivo, el naranjo y el pino son ejemplos de…', ['Arbustos','Árboles','Herbáceas','Bianuales'],1,'Los tres aparecen como ejemplos de árboles.'],
    ['¿Qué grupo tiene varios tallos desde la base y menos altura que un árbol?', ['Herbáceas','Arbustos','Perennes','Árboles'],1,'Esa es la definición de arbusto.'],
    ['El romero, el rosal y la adelfa son ejemplos de…', ['Arbustos','Árboles','Herbáceas','Plantones'],0,'En el tema aparecen como arbustos.'],
    ['¿Qué tipo de plantas tienen tallos blandos y flexibles?', ['Arbustos','Árboles','Herbáceas','Bulbos'],2,'Las herbáceas tienen tallos blandos y flexibles.'],
    ['La lechuga, el geranio y la albahaca son ejemplos de…', ['Herbáceas','Árboles','Arbustos','Rizomas'],0,'Son los ejemplos de herbáceas del documento.'],
    ['¿Qué plantas completan su ciclo en un año o menos?', ['Perennes','Bianuales','Anuales','Herbáceas'],2,'Las anuales completan su ciclo en un año o menos.'],
    ['¿Qué plantas necesitan dos años para completar su ciclo?', ['Anuales','Arbustos','Bianuales','Perennes'],2,'Las bianuales necesitan dos años.'],
    ['¿Qué plantas viven varios años?', ['Perennes','Anuales','Plantones','Semillas'],0,'Las perennes viven varios años.']
  ]},
  { id:'identificacion', title:'Identificación básica', icon:'🔎', desc:'Porte, tallo, hojas, flores, frutos, olor y uso.', type:'quiz', qs:[
    ['Para identificar una planta, lo más importante es…', ['Comprar herramientas','Observar','Podar','Regar'],1,'El documento insiste en que lo más importante es observar.'],
    ['El aspecto general de una planta se llama…', ['Pericarpio','Porte','Cepellón','Savia'],1,'El porte es el aspecto general de la planta.'],
    ['El porte puede indicar que una planta es…', ['Solo árbol o arbusto','Árbol, arbusto, trepadora o herbácea','Semilla o fruto','Bulbo o tubérculo'],1,'Es la clasificación de porte que aparece en el tema.'],
    ['El tallo puede ser…', ['Solo verde','Leñoso o herbáceo, recto o rastrero, fino o grueso','Solo grueso','Solo recto'],1,'Esos son los rasgos a observar en el tallo.'],
    ['En las hojas conviene fijarse en…', ['El precio y la maceta','Tamaño, forma, color, borde y disposición en el tallo','Solo el olor','Solo si están mojadas'],1,'Es la lista que aparece en el documento.'],
    ['En las flores conviene fijarse en…', ['Color, tamaño, número de pétalos y época de floración','Solo el tallo','Solo la raíz','Solo el fruto'],0,'Esos son los datos de observación floral del tema.'],
    ['Los frutos…', ['No ayudan a identificar','Pueden ayudar mucho a identificar','Solo se comen','Solo aparecen en árboles'],1,'El documento indica que pueden ayudar mucho a identificar.'],
    ['Lavanda, romero e hierbabuena pueden reconocerse también por su…', ['Borde','Olor','Maceta','Color del tallo'],1,'Algunas plantas aromáticas se reconocen por su olor.']
  ]},
  { id:'calidad', title:'Material de calidad', icon:'✅', desc:'Aspecto sano, ausencia de plagas y enfermedades, raíces, tallos, hojas, humedad y etiquetado.', type:'quiz', qs:[
    ['Un buen material vegetal debe presentar…', ['Aspecto sano','Golpes visibles','Sequedad extrema','Manchas abundantes'],0,'El primer criterio del tema es el aspecto sano.'],
    ['Un buen material vegetal debe tener ausencia de…', ['Raíces','Plagas y enfermedades','Sustrato','Color'],1,'No debe presentar plagas ni enfermedades.'],
    ['Las raíces deben estar…', ['Aplastadas','En buen estado','Siempre secas','Fuera del envase'],1,'Las raíces deben estar en buen estado.'],
    ['Los tallos deben ser…', ['Firmes','Quebrados','Muy blandos siempre','Sin color'],0,'El tema indica que deben ser tallos firmes.'],
    ['Las hojas deben presentar…', ['Daños graves','Color apagado siempre','Ausencia de daños graves','Plagas'],2,'Las hojas no deben tener daños graves.'],
    ['La humedad correcta del material vegetal es…', ['Con exceso siempre','Adecuada, sin exceso ni sequedad extrema','Totalmente seca','Solo mojada al máximo'],1,'La humedad debe ser adecuada.'],
    ['Cuando el material viene preparado para venta o distribución, debe tener…', ['Cinta adhesiva','Etiquetado correcto','Más flores','Raíces fuera'],1,'El etiquetado correcto es uno de los criterios.'],
    ['Si una planta llega muy seca, amarilla, rota o con manchas…', ['Probablemente no sea adecuada','Es excelente','No importa','Solo necesita más altura'],0,'Es una señal de mala calidad.']
  ]},
  { id:'manipulacion', title:'Manipulación básica', icon:'📦', desc:'Cuidado, humedad, transporte y evitar dañar raíces, hojas o brotes.', type:'quiz', qs:[
    ['El material vegetal debe tratarse con…', ['Cuidado','Prisa','Golpes','Desorden'],0,'La manipulación básica exige cuidado.'],
    ['¿Qué no debemos hacer con las plantas ni con los envases?', ['Transportarlos con cuidado','Golpearlos','Mantener la humedad adecuada','Plantar en el momento adecuado'],1,'No hay que golpear las plantas ni los envases.'],
    ['Si son delicadas, no deben exponerse mucho tiempo a…', ['La sombra','La lluvia ligera','El sol','La jardinera'],2,'No deben exponerse mucho tiempo al sol si son delicadas.'],
    ['Es importante mantener la…', ['Altura','Humedad adecuada','Etiqueta mojada','Semilla abierta'],1,'La humedad adecuada es una norma básica.'],
    ['Las plantas deben…', ['Transportarse con cuidado','Aplastarse para sujetarlas','Ir siempre sin envase','Quedarse al sol fuerte'],0,'El transporte debe hacerse con cuidado.'],
    ['No hay que aplastar…', ['Solo los tallos','Raíces, hojas o brotes','Las etiquetas','Las macetas vacías'],1,'Raíces, hojas y brotes no deben aplastarse.'],
    ['La siembra o plantación debe hacerse…', ['En cualquier momento','En el momento adecuado','Solo de noche','Solo con sol fuerte'],1,'El momento adecuado es clave.']
  ]},
  { id:'seguridad', title:'Seguridad e higiene', icon:'🧤', desc:'Orden, herramientas, limpieza, restos vegetales, guantes y lavado de manos.', type:'quiz', qs:[
    ['Cuando trabajamos con material vegetal debemos…', ['Trabajar de forma ordenada','Trabajar deprisa y sin mirar','Acumular restos vegetales','Evitar lavar las manos'],0,'El orden es la primera norma que aparece.'],
    ['Las herramientas deben…', ['Usarse correctamente','Dejarse tiradas','Prestarse sin control','Usarse de cualquier manera'],0,'Las herramientas deben usarse correctamente.'],
    ['La zona de trabajo debe mantenerse…', ['Mojada siempre','Limpia','Desordenada','Llena de restos'],1,'Hay que mantener limpia la zona.'],
    ['Los restos vegetales deben…', ['Quedarse donde caen','Retirarse cuando sea necesario','Usarse como adorno','Esconderse bajo la mesa'],1,'Hay que retirar los restos vegetales cuando sea necesario.'],
    ['¿Cuándo se deben utilizar guantes?', ['Nunca','Si el trabajo lo requiere','Solo para regar','Solo al final'],1,'Los guantes se usan si el trabajo lo requiere.'],
    ['Después de manipular tierra, plantas o productos debemos…', ['Seguir sin limpiar','Lavarnos las manos','Guardar las herramientas sin más','Salir directamente'],1,'Lavarse las manos es una norma básica.'],
    ['La seguridad no solo protege a la persona, también ayuda a…', ['Conservar mejor el material','Gastar más tiempo','Tener más tierra en la mesa','Cambiar el nombre de las plantas'],0,'También ayuda a conservar mejor el material.']
  ]}
];

class MainScene extends Phaser.Scene {
  constructor(){ super('main'); }
  preload(){
    this.load.image('flor','assets/flor_partes.png');
    this.load.image('hoja','assets/hoja_sin_conceptos.png');
  }
  create(){
    this.state = this.loadState();
    this.objects = [];
    this.renderMenu();
  }
  clear(){ this.objects.forEach(o => o && o.destroy && o.destroy()); this.objects = []; }
  addObj(o){ this.objects.push(o); return o; }
  loadState(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {scores:{},attempts:{}}; }
    catch { return {scores:{},attempts:{}}; }
  }
  save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state)); }
  score(id){ return this.state.scores[id] || 0; }
  attempts(id){ return this.state.attempts[id] || 0; }
  register(id, score){
    this.state.attempts[id] = this.attempts(id)+1;
    this.state.scores[id] = Math.max(this.score(id), score);
    this.save();
  }
  avg(){ return Math.round(sections.reduce((a,s)=>a+this.score(s.id),0)/sections.length); }
  grade(){ return (sections.reduce((a,s)=>a+this.score(s.id),0)/sections.length/10).toFixed(1); }
  gold(){ return sections.filter(s=>this.score(s.id)>=100).length; }
  played(){ return sections.filter(s=>this.score(s.id)>0).length; }
  stars(score){ return '★'.repeat(score>=100?3:score>=70?2:score>=40?1:0) + '☆'.repeat(score>=100?0:score>=70?1:score>=40?2:3); }
  t(x,y,text,size=24,color=palette.ink,style={}){
    const obj = this.add.text(x,y,text,{fontFamily:'Arial, sans-serif',fontSize:size,color,wordWrap:{width:style.width||900},align:style.align||'left',fontStyle:style.bold?'bold':'normal'});
    obj.setLineSpacing(4); return this.addObj(obj);
  }
  box(x,y,w,h,color=palette.paper,stroke=0xd9e7d0,r=18,alpha=1){
    const g=this.add.graphics();
    g.fillStyle(color,alpha); g.fillRoundedRect(x,y,w,h,r);
    g.lineStyle(2,stroke,1); g.strokeRoundedRect(x,y,w,h,r);
    return this.addObj(g);
  }
  button(x,y,w,h,label,cb,opts={}){
    const color=opts.color||palette.green;
    const textColor=opts.textColor||'#ffffff';
    const g=this.add.graphics();
    g.fillStyle(color,1); g.fillRoundedRect(x,y,w,h,opts.r||16);
    g.lineStyle(opts.strokeWidth||0,opts.stroke||color,1); if(opts.strokeWidth) g.strokeRoundedRect(x,y,w,h,opts.r||16);
    const hit=this.add.zone(x+w/2,y+h/2,w,h).setInteractive({useHandCursor:true});
    const txt=this.add.text(x+w/2,y+h/2,label,{fontFamily:'Arial, sans-serif',fontSize:opts.size||22,color:textColor,fontStyle:'bold',align:'center',wordWrap:{width:w-18}}).setOrigin(.5);
    hit.on('pointerover',()=>{g.clear();g.fillStyle(opts.hover||0x63bd55,1);g.fillRoundedRect(x,y,w,h,opts.r||16); if(opts.strokeWidth){g.lineStyle(opts.strokeWidth,opts.stroke,1);g.strokeRoundedRect(x,y,w,h,opts.r||16);}});
    hit.on('pointerout',()=>{g.clear();g.fillStyle(color,1);g.fillRoundedRect(x,y,w,h,opts.r||16); if(opts.strokeWidth){g.lineStyle(opts.strokeWidth,opts.stroke,1);g.strokeRoundedRect(x,y,w,h,opts.r||16);}});
    hit.on('pointerdown', cb);
    this.addObj(g); this.addObj(hit); this.addObj(txt);
    return {g,hit,txt};
  }
  header(subtitle='Juego didáctico interactivo'){
    this.box(24,18,1232,88,0xffffff,0xdbe9d2,24,.95);
    this.t(48,34,subtitle,16,'#607860',{bold:true});
    this.t(48,56,'Identificando Material Vegetal 4.1',34,palette.ink,{bold:true});
    this.button(900,40,120,42,'🏠 Menú',()=>this.renderMenu(),{color:0xeef6e8,textColor:'#2f5030',size:18});
    this.button(1032,40,130,42,'📒 Progreso',()=>this.renderProgress(),{color:0xeef6e8,textColor:'#2f5030',size:18});
    this.button(1172,40,58,42,'♻',()=>this.resetProgress(),{color:0xf6e8e8,textColor:'#8b3434',size:20});
  }
  renderMenu(){
    this.clear(); this.cameras.main.setBackgroundColor('#f3f8ee'); this.header();
    this.box(34,122,1212,118,0xfffffb,0xe0ead8,26);
    this.t(62,142,'Álbum de aprendizaje · cartas · estrellas · progreso guardado',18,'#5c755c',{bold:true});
    this.t(62,170,'Completa todos los apartados, consigue rebordes dorados y mejora tu nota hasta lograr el 10.',30,palette.ink,{bold:true,width:900});
    this.t(920,144,`Progreso: ${this.avg()}%\nNota: ${this.grade()} / 10\nDorados: ${this.gold()}/${sections.length}`,22,'#335033',{bold:true,width:260});
    const cols=3, cardW=386, cardH=128, startX=34, startY=268, gap=20;
    sections.forEach((s,i)=>{
      const x=startX+(i%cols)*(cardW+gap), y=startY+Math.floor(i/cols)*(cardH+gap);
      const score=this.score(s.id), gold=score>=100;
      this.box(x,y,cardW,cardH,gold?0xfff8d8:0xffffff,gold?palette.gold:0xdce8d5,22);
      this.t(x+18,y+14,`${s.icon} ${s.title}`,22,palette.ink,{bold:true,width:260});
      this.t(x+18,y+43,s.desc,14,'#536b53',{width:260});
      this.t(x+285,y+16,this.stars(score),22,gold?'#9a7400':'#4b6d4b',{bold:true});
      this.progressBar(x+18,y+92,250,12,score);
      this.t(x+280,y+86,`${score}%`,20,gold?'#8c6c00':'#335033',{bold:true});
      this.button(x+300,y+92,70,28,score?'Mejorar':'Jugar',()=>this.openSection(s.id),{size:14,color:gold?palette.gold:palette.green});
    });
  }
  progressBar(x,y,w,h,percent){
    const back=this.add.graphics(); back.fillStyle(0xe5efdf,1); back.fillRoundedRect(x,y,w,h,h/2); this.addObj(back);
    const fill=this.add.graphics(); fill.fillStyle(percent>=100?palette.gold:palette.green,1); fill.fillRoundedRect(x,y,Math.max(4,w*percent/100),h,h/2); this.addObj(fill);
  }
  renderProgress(){
    this.clear(); this.header('Álbum de progreso');
    this.box(40,126,410,540,0xffffff,0xdde8d4,26);
    this.t(70,154,'Progreso del tema',32,palette.ink,{bold:true});
    this.t(70,206,`Progreso global: ${this.avg()}%\nNota actual: ${this.grade()} / 10\nApartados jugados: ${this.played()}/${sections.length}\nApartados dorados: ${this.gold()}/${sections.length}`,25,'#385438',{bold:true,width:330});
    this.progressBar(70,330,310,20,this.avg());
    const allPlayed=this.played()===sections.length, allGold=this.gold()===sections.length;
    this.box(70,380,320,210,allPlayed?0xfff8d8:0xf4faef,allPlayed?palette.gold:0xdde8d4,22);
    this.t(95,405,allPlayed?'🎓 Tema superado':'🌟 Meta del tema',26,palette.ink,{bold:true,width:270});
    this.t(95,445,allPlayed?`Tu nota final es ${this.grade()} / 10. Repite los apartados que no estén en dorado hasta conseguir el 10.${allGold?'\n\n¡Álbum perfecto conseguido!':''}`:`Juega todos los apartados para desbloquear la pantalla final.`,20,'#4e674e',{width:270});
    const x0=490,y0=126;
    sections.forEach((s,i)=>{
      const x=x0+(i%2)*365, y=y0+Math.floor(i/2)*106, score=this.score(s.id), gold=score>=100;
      this.box(x,y,340,88,gold?0xfff8d8:0xffffff,gold?palette.gold:0xdce8d5,18);
      this.t(x+16,y+12,`${s.icon} ${s.title}`,18,palette.ink,{bold:true,width:230});
      this.progressBar(x+16,y+52,220,12,score);
      this.t(x+250,y+41,`${score}%`,22,gold?'#8a6d00':'#315031',{bold:true});
      this.t(x+250,y+15,gold?'Superado':score?'En progreso':'Pendiente',13,gold?'#8a6d00':'#587058',{bold:true});
    });
  }
  resetProgress(){
    if(confirm('¿Borrar el progreso guardado de Material Vegetal 4.1?')){
      localStorage.removeItem(STORAGE_KEY); this.state={scores:{},attempts:{}}; this.renderMenu();
    }
  }
  openSection(id){
    const s=sections.find(a=>a.id===id); if(!s) return;
    if(s.type==='quiz') this.renderQuiz(s); else this.renderPlacement(s);
  }
  sectionTop(s){
    this.clear(); this.header(s.title);
    this.box(34,118,1212,72,0xffffff,0xdde8d4,22);
    this.t(60,136,`${s.icon} ${s.title}`,28,palette.ink,{bold:true});
    this.t(420,138,s.desc,18,'#536b53',{width:620});
    this.t(1070,134,`${this.stars(this.score(s.id))}\n${this.score(s.id)}%`,20,this.score(s.id)>=100?'#8b6b00':'#385438',{bold:true,align:'center'});
  }
  renderQuiz(s){
    let index=0, correct=0;
    const draw=()=>{
      this.sectionTop(s);
      const q=s.qs[index];
      this.box(90,230,1100,360,0xffffff,0xdbe9d2,28);
      this.t(130,260,`Pregunta ${index+1} de ${s.qs.length}`,20,'#5f7a5f',{bold:true});
      this.t(130,300,q[0],30,palette.ink,{bold:true,width:1000});
      q[1].forEach((opt,i)=>{
        const x=130+(i%2)*510, y=390+Math.floor(i/2)*86;
        this.button(x,y,470,60,opt,()=>answer(i),{color:0xf7fbf3,textColor:'#253925',stroke:0xd9e7d0,strokeWidth:2,size:20,hover:0xeaf6df});
      });
      this.progressBar(130,548,810,14,Math.round(index/s.qs.length*100));
      this.t(970,538,`Aciertos: ${correct}`,22,'#385438',{bold:true});
    };
    const answer=(i)=>{
      const q=s.qs[index], ok=i===q[2]; if(ok) correct++;
      this.sectionTop(s);
      this.box(160,240,960,300,ok?0xf1ffe9:0xfff1f1,ok?0x82c95a:0xd66b6b,28);
      this.t(210,280,ok?'✅ Correcto':'❌ No es correcto',34,ok?'#2f6b2f':'#8b3333',{bold:true});
      this.t(210,335,q[3],25,'#405c40',{width:850});
      this.button(500,455,280,58,index<s.qs.length-1?'Siguiente':'Ver resultado',()=>{
        index++; if(index<s.qs.length) draw(); else this.quizSummary(s,correct);
      },{size:22,color:ok?palette.green:palette.danger});
    };
    draw();
  }
  quizSummary(s, correct){
    const percent=Math.round(correct/s.qs.length*100); this.register(s.id,percent);
    this.summary(s, percent, `${correct} de ${s.qs.length} respuestas correctas. Nota del apartado: ${(percent/10).toFixed(1)} / 10.`);
  }
  renderPlacement(s){
    this.sectionTop(s);
    const placements={}; let selected=null;
    const draw=()=>{
      this.sectionTop(s);
      this.box(34,200,1212,486,0xffffff,0xdde8d4,24);
      this.t(60,213,'Elige una etiqueta y pulsa su recuadro correcto en la imagen.',18,'#536b53',{bold:true});
      s.terms.forEach((term,i)=>{
        const used=Object.values(placements).includes(term);
        const label=s.numbered?`${i+1}. ${term}`:term;
        const x=60+(i%9)*130, y=s.numbered?245:246;
        this.button(x,y,116,38,label,()=>{ if(!used){ selected=term; draw(); } },{size:15,color:selected===term?0x7fc45a:(used?0xd9e3d1:0xf7fbf3),textColor:'#253925',stroke:selected===term?palette.green:0xd9e7d0,strokeWidth:2,hover:0xeaf6df});
      });
      const tex=this.textures.get(s.asset).getSourceImage();
      const maxW=s.asset==='flor'?900:760, maxH=s.asset==='flor'?395:390;
      const scale=Math.min(maxW/tex.width,maxH/tex.height);
      const imgW=tex.width*scale, imgH=tex.height*scale;
      const imgX=(W-imgW)/2, imgY=s.asset==='flor'?286:286;
      const img=this.add.image(imgX,imgY,s.asset).setOrigin(0).setDisplaySize(imgW,imgH); this.addObj(img);
      s.slots.forEach((slot,idx)=>{
        const [answer,px,py,pw,ph]=slot;
        const x=imgX+px*imgW, y=imgY+py*imgH, w=pw*imgW, h=ph*imgH;
        const val=placements[idx]||'';
        const g=this.add.graphics();
        g.fillStyle(val?0xffffff:0xfffffff,.85); g.fillRoundedRect(x,y,w,h,10);
        g.lineStyle(2, val?palette.green:0x678267, 1); g.strokeRoundedRect(x,y,w,h,10);
        this.addObj(g);
        const txt=this.add.text(x+w/2,y+h/2,val||'?',{fontFamily:'Arial',fontSize:Math.max(13,Math.min(22,w/6)),color:val?'#203120':'#607860',fontStyle:'bold',align:'center',wordWrap:{width:w-8}}).setOrigin(.5); this.addObj(txt);
        const zone=this.add.zone(x+w/2,y+h/2,w,h).setInteractive({useHandCursor:true}); this.addObj(zone);
        zone.on('pointerdown',()=>{ if(selected){ placements[idx]=selected; selected=null; draw(); }});
      });
      const done=Object.keys(placements).length===s.slots.length;
      this.button(60,635,180,42,'Borrar',()=>{ Object.keys(placements).forEach(k=>delete placements[k]); selected=null; draw(); },{color:0xeef6e8,textColor:'#2f5030',size:18});
      this.button(1000,635,200,42,done?'Comprobar':'Coloca todas',()=>{ if(done) this.placeSummary(s,placements); },{color:done?palette.green:0xb9c7b3,textColor:'#ffffff',size:18});
      this.t(275,641,selected?`Etiqueta seleccionada: ${selected}`:'Selecciona una etiqueta superior.',18,'#496849',{bold:true,width:500});
    };
    draw();
  }
  placeSummary(s, placements){
    let correct=0; s.slots.forEach((slot,idx)=>{ if(placements[idx]===slot[0]) correct++; });
    const percent=Math.round(correct/s.slots.length*100); this.register(s.id,percent);
    this.summary(s, percent, `Has colocado correctamente ${correct} de ${s.slots.length} conceptos. ${percent>=100?'¡Apartado dorado conseguido!':'Puedes repetirlo para mejorar hasta el 100%.'}`);
  }
  summary(s,percent,msg){
    this.clear(); this.header('Resultado del apartado');
    this.box(220,160,840,380,percent>=100?0xfff8d8:0xffffff,percent>=100?palette.gold:0xdde8d4,34);
    this.t(270,205,`${s.icon} ${s.title}`,34,palette.ink,{bold:true,width:760});
    this.t(270,270,`${percent}%`,76,percent>=100?'#927000':'#2f6b36',{bold:true});
    this.t(460,292,this.stars(percent),36,percent>=100?'#927000':'#416741',{bold:true});
    this.t(270,380,msg,24,'#435d43',{width:720});
    this.button(300,475,220,52,'Repetir',()=>this.openSection(s.id),{size:22,color:palette.green});
    this.button(540,475,220,52,'Menú',()=>this.renderMenu(),{size:22,color:0xeef6e8,textColor:'#2f5030'});
    this.button(780,475,220,52,'Progreso',()=>this.renderProgress(),{size:22,color:0xeef6e8,textColor:'#2f5030'});
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: W,
  height: H,
  backgroundColor: '#f3f8ee',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [MainScene]
};

new Phaser.Game(config);
