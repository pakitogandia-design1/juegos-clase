
const ZONES = ["Invernadero","Frontón","Escaleras del Frontón","Zona trasera Rosales","Escaleras exteriores","Jardín Delantero","Jardín Interior"];
const STAGES = ["Recién implantada","Enraizamiento","Crecimiento vegetativo","Formación","Valor ornamental","Consolidada"];
const state = {
  screen:"home", ecosystem:null, encounter:null, selectedTraits:[], captureScore:0, currentPlant:null,
  data: JSON.parse(localStorage.getItem("jardindex_fp_safor_save")||"{}"),
  imageCredits: JSON.parse(localStorage.getItem("jardindex_image_credits")||"{}")
};
if(!state.data.dex){
  state.data = {dex:{}, garden:{}, foundCount:0, completedCount:0, sound:true, difficulty:"Técnico"};
}
const app = document.getElementById("app");
const $ = (sel,root=document)=>root.querySelector(sel);
const $$ = (sel,root=document)=>Array.from(root.querySelectorAll(sel));
function save(){localStorage.setItem("jardindex_fp_safor_save",JSON.stringify(state.data));}
function saveCredits(){localStorage.setItem("jardindex_image_credits",JSON.stringify(state.imageCredits));}
function clamp(n,a=0,b=100){return Math.max(a,Math.min(b,n));}
function sample(arr){return arr[Math.floor(Math.random()*arr.length)];}
function byId(id){return JARDINDEX_SPECIES.find(s=>s.id===id);}
function ecoIcon(name){
  if(name.includes("Arbolado")) return "🌳"; if(name.includes("Frutales")) return "🍊"; if(name.includes("Palmeral")) return "🌴";
  if(name.includes("Coníferas")) return "🌲"; if(name.includes("Matorral")) return "🌿"; if(name.includes("florido")) return "🌺";
  if(name.includes("Sombra")) return "🍃"; if(name.includes("Rocalla")) return "🌵"; return "🌼";
}
function plantEmoji(s){
  const t=s.type.toLowerCase(), n=s.scientific.toLowerCase();
  if(t.includes("palmera")) return "🌴"; if(t.includes("conífera")||n.includes("pinus")||n.includes("cupressus")) return "🌲";
  if(t.includes("árbol")) return "🌳"; if(t.includes("suculenta")||n.includes("agave")||n.includes("aloe")) return "🌵";
  if(t.includes("helecho")) return "🌿"; if(t.includes("trepadora")) return "🌱"; if(t.includes("bulbosa")) return "🌷";
  if(t.includes("aromática")) return "🌿"; if(t.includes("rastrera")) return "☘️"; return "🌱";
}

const GROUP_STAGE_LABELS = {
  tree:["Plantón recién implantado","Enraizamiento y arraigo","Crecimiento de brotes","Formación de copa","Árbol joven equilibrado","Ejemplar consolidado"],
  citrus:["Plantón de cítrico/frutal","Arraigo","Brotación","Floración controlada","Cuajado/fructificación","Frutal consolidado"],
  palm:["Palmera recién implantada","Arraigo del cepellón","Emisión de hojas","Limpieza prudente","Porte ornamental","Palmera establecida"],
  conifer:["Conífera/seto recién implantado","Arraigo","Crecimiento compacto","Formación/recorte suave","Pantalla o estructura ornamental","Seto/conífera consolidada"],
  mediterranean:["Mata recién implantada","Arraigo en suelo drenante","Crecimiento compacto","Poda ligera de renovación","Flor/aroma/porte mediterráneo","Mata consolidada de bajo riego"],
  climber:["Trepadora recién implantada","Arraigo","Brotes guiables","Guiado y sujeción","Floración/cobertura","Trepadora consolidada"],
  rose:["Rosal recién implantado","Arraigo","Brotación","Poda y formación","Floración sana","Rosal consolidado"],
  shade:["Planta de sombra recién adaptada","Arraigo en sustrato fresco","Hojas nuevas","Limpieza y humedad estable","Porte tropical/verde ornamental","Planta de sombra consolidada"],
  succulent:["Roseta/planta recién implantada","Adaptación sin encharcar","Crecimiento lento","Limpieza de hojas dañadas","Porte suculento ornamental","Suculenta consolidada"],
  herbaceous:["Herbácea recién implantada","Arraigo","Crecimiento de hojas","Formación de mata","Floración/cobertura","Mata completada"],
  bulb:["Bulbo/rizoma implantado","Arraigo","Emisión de hojas","Botón floral","Floración","Ciclo completado"],
  fern:["Helecho recién adaptado","Arraigo húmedo","Nuevas frondes","Limpieza de frondes secas","Frondes desarrolladas","Helecho consolidado"]
};
function groupOf(sp){
  const t=sp.type.toLowerCase(), e=sp.ecosystem.toLowerCase(), id=sp.id;
  if(id.includes('rosal')) return 'rose';
  if(t.includes('palmera')) return 'palm';
  if(t.includes('conífera')||e.includes('coníferas')||id.includes('cupressus')||id.includes('pinus')||id.includes('thuja')||id.includes('taxus')||id.includes('tetraclinis')) return 'conifer';
  if(e.includes('frutales')||id.includes('citrus')||id.includes('prunus')) return 'citrus';
  if(t.includes('helecho')||id.includes('asplenium')||id.includes('platycerium')||id.includes('nephrolepis')) return 'fern';
  if(t.includes('suculenta')||id.includes('agave')||id.includes('aloe')||id.includes('echeveria')||id.includes('kalanchoe')||id.includes('sedum')||id.includes('yucca')) return 'succulent';
  if(t.includes('trepadora')||e.includes('trepadoras')||id.includes('hedera')||id.includes('bougainvillea')||id.includes('campsis')||id.includes('jasminum')||id.includes('lonicera')||id.includes('parthenocissus')) return 'climber';
  if(t.includes('bulbosa')||id.includes('lilium')||id.includes('iris')||id.includes('agapanthus')) return 'bulb';
  if(e.includes('sombra')||id.includes('monstera')||id.includes('philodendrum')||id.includes('aspidistra')||id.includes('clivia')||id.includes('chlorophytum')||id.includes('zantedeschia')||id.includes('acanthus')||id.includes('asparagus')) return 'shade';
  if(e.includes('matorral')||t.includes('aromática')||id.includes('lavandula')||id.includes('rosmarinus')||id.includes('thymus')||id.includes('santolina')||id.includes('pistacia')||id.includes('myrtus')||id.includes('nerium')||id.includes('rhamnus')||id.includes('ruscus')||id.includes('laurus')) return 'mediterranean';
  if(t.includes('árbol')) return 'tree';
  return 'herbaceous';
}
function profileFor(sp){
  const g=groupOf(sp), m=sp.maintenance||{};
  const base={
    tree:{water:[42,72],nutrition:[35,72],stressMax:54,sanityMin:52,actions:['water_deep','mulch','support','prune_form'],focus:'arraigo, riego profundo espaciado, tutorado si procede y poda de formación muy prudente'},
    citrus:{water:[48,76],nutrition:[45,82],stressMax:50,sanityMin:58,actions:['water_mid','feed_balanced','inspect','treat'],focus:'riego regular sin encharcar, nutrición equilibrada y vigilancia de cochinilla, pulgón y clorosis'},
    palm:{water:[38,70],nutrition:[32,72],stressMax:55,sanityMin:52,actions:['water_mid','drain','clean_old','inspect'],focus:'cepellón estable, drenaje y limpieza solo de hojas secas; no eliminar hojas verdes sanas'},
    conifer:{water:[35,68],nutrition:[25,65],stressMax:56,sanityMin:54,actions:['water_mid','drain','prune_light','inspect'],focus:'forma compacta, drenaje, riego de establecimiento y recortes suaves sin entrar en madera vieja'},
    mediterranean:{water:[22,55],nutrition:[15,60],stressMax:60,sanityMin:50,actions:['water_low','drain','prune_light','observe'],focus:'sol, drenaje, riego moderado-bajo y poca intervención; el exceso suele ser peor que la falta'},
    climber:{water:[38,72],nutrition:[35,78],stressMax:55,sanityMin:54,actions:['water_mid','support','prune_light','inspect','feed_balanced'],focus:'guiado sobre soporte, riego de establecimiento, poda tras floración o de control y vigilancia de brotes tiernos'},
    rose:{water:[42,72],nutrition:[45,84],stressMax:48,sanityMin:62,actions:['water_mid','prune_form','deadhead','inspect','treat','feed_bloom'],focus:'poda correcta, flor pasada, abonado de floración y control frecuente de pulgón y oídio'},
    shade:{water:[50,82],nutrition:[30,70],stressMax:50,sanityMin:55,actions:['water_mid','humidity','shade','clean_old','inspect'],focus:'luz indirecta, humedad ambiental, sustrato fresco pero aireado y protección frente a sol directo'},
    fern:{water:[58,88],nutrition:[20,62],stressMax:48,sanityMin:55,actions:['humidity','water_mid','clean_old','shade','inspect'],focus:'humedad ambiental y sustrato fresco; frondes limpias y nada de sol directo fuerte'},
    succulent:{water:[10,38],nutrition:[5,45],stressMax:60,sanityMin:50,actions:['observe','drain','water_low','sun','clean_old'],focus:'drenaje, luz y riegos muy espaciados; si el sustrato sigue húmedo, no se riega'},
    herbaceous:{water:[42,76],nutrition:[35,78],stressMax:52,sanityMin:54,actions:['water_mid','clean_old','feed_balanced','inspect'],focus:'riego equilibrado, limpieza de partes pasadas y control de crecimiento del estrato bajo'},
    bulb:{water:[40,72],nutrition:[35,78],stressMax:52,sanityMin:54,actions:['water_mid','feed_bloom','clean_old','observe'],focus:'respetar ciclo de hojas, floración y reposo; no cortar hojas verdes antes de que repongan reservas'}
  }[g];
  const overrides={
    zantedeschia_aethiopica:{water:[58,88],focus:'sustrato fresco y humedad constante, evitando sequía; retirar espatas y hojas deterioradas'},
    lavandula_dentata:{water:[16,45],nutrition:[5,45],focus:'pleno sol, drenaje y poda ligera tras floración; odia el encharcamiento'},
    lavandula_latifolia:{water:[16,45],nutrition:[5,45],focus:'pleno sol, drenaje y bajo riego; exceso de abono o agua reduce vigor'},
    rosmarinus_officinalis:{water:[14,44],nutrition:[5,45],focus:'sol, suelo muy drenante y riego escaso; poda ligera para mantenerlo compacto'},
    thymus_piperella:{water:[10,38],nutrition:[5,40],focus:'mata baja de secano: drenaje y mínima intervención'},
    santolina_chamaecyparissus:{water:[10,42],nutrition:[5,40],focus:'mata grisácea de bajo riego; poda ligera y nada de encharcar'},
    agave_americana:{water:[6,30],nutrition:[0,35],focus:'roseta grande muy resistente: drenaje extremo y casi nada de riego'},
    agave_attenuata:{water:[10,36],nutrition:[0,40],focus:'suculenta más blanda que Agave americana: drenaje, luz y evitar frío/encharcamiento'},
    echeveria_sp:{water:[8,32],nutrition:[0,38],focus:'roseta compacta: regar solo con sustrato seco y evitar sombra que la etiole'},
    sedum_sp:{water:[8,34],nutrition:[0,38],focus:'tapizante suculenta de baja intervención: drenaje y poco riego'},
    ficus_benjamina:{water:[42,72],focus:'evitar cambios bruscos, frío y sol fuerte; riego moderado sin encharcar'},
    monstera_deliciosa:{water:[48,78],focus:'luz indirecta brillante, tutor o soporte y humedad ambiental; cuidado con sol directo y encharcamiento'},
    philodendrum_sp:{water:[48,78],focus:'ambiente protegido, humedad y luz indirecta; guía si trepa'},
    rosal_sp:{water:[42,72],nutrition:[48,86],focus:'poda, aireación, eliminación de flor pasada y vigilancia de pulgón/oídio'},
    rosal_trepador_sp:{water:[42,72],nutrition:[48,86],focus:'guiado sobre soporte, poda de ramas mal dirigidas y floración controlada'},
    pelargonium_sp:{water:[32,62],nutrition:[35,76],focus:'sol/semisombra luminosa, retirar flores pasadas y evitar encharcamiento'},
    aspidistra_elatior:{water:[35,68],nutrition:[15,55],focus:'planta de sombra muy resistente: riego moderado y limpieza de hojas, sin sol directo'},
    asplenium_nidus:{water:[58,84],nutrition:[15,58],focus:'humedad ambiental, luz indirecta y sustrato fresco; no mojar el centro en exceso'},
    nephrolepis_sp:{water:[60,88],nutrition:[15,60],focus:'frondes con humedad ambiental constante; sequedad y sol directo lo debilitan'},
    taxus_baccata:{water:[36,64],nutrition:[20,58],focus:'sombra/semisombra tolerada y suelo fresco drenado; evitar encharcamiento y podas fuertes'},
    nerium_oleander:{water:[18,55],nutrition:[10,55],focus:'arbusto muy resistente: sol, riego bajo-moderado y poda prudente; recordar toxicidad'},
    buxus_sempervirens:{water:[35,65],nutrition:[20,60],focus:'bordura/seto: humedad moderada, recorte ligero y vigilancia de decaimiento o hongos'},
    hedera_helix:{water:[35,70],nutrition:[20,60],focus:'trepadora resistente: controlar crecimiento, guiar y revisar cochinilla en lugares densos'}
  }[sp.id]||{};
  const out={...base,...overrides}; out.group=g; out.stageLabels=GROUP_STAGE_LABELS[g]||STAGES; out.problems=m.problems||[]; out.dangers=m.dangerActions||[]; out.keyActions=m.keyActions||[]; return out;
}
function waterStatus(g,p){ if(g.water<p.water[0]-10) return ['sequía','bad']; if(g.water<p.water[0]) return ['algo seco','warn']; if(g.water>p.water[1]+14) return ['exceso grave','bad']; if(g.water>p.water[1]) return ['demasiado húmedo','warn']; return ['rango correcto','good']; }
function cyclePercent(g){return clamp((g.stage/5)*100 + Math.min(20,(g.xp/(70+(g.stage*35)))*20));}
function signed(n){return n>0?`+${Math.round(n)}`:String(Math.round(n));}
function effectText(e){const parts=[]; if(e.h)parts.push(`Salud ${signed(e.h)}`); if(e.wat)parts.push(`Agua ${signed(e.wat)}`); if(e.nut)parts.push(`Nutrición ${signed(e.nut)}`); if(e.st)parts.push(`Estrés ${signed(e.st)}`); if(e.san)parts.push(`Sanidad ${signed(e.san)}`); if(e.xp)parts.push(`EXP ${signed(e.xp)}`); return parts.join(' · ');}

function beep(type="ok"){
  if(!state.data.sound) return;
  try{
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    const osc=ctx.createOscillator(), gain=ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    const now=ctx.currentTime;
    osc.type= type==="bad"?"sawtooth": type==="evo"?"triangle":"sine";
    osc.frequency.setValueAtTime(type==="bad"?160:type==="evo"?420:620,now);
    osc.frequency.exponentialRampToValueAtTime(type==="bad"?90:type==="evo"?880:920,now+.18);
    gain.gain.setValueAtTime(.0001,now); gain.gain.exponentialRampToValueAtTime(.18,now+.025); gain.gain.exponentialRampToValueAtTime(.0001,now+.28);
    osc.start(now); osc.stop(now+.3);
  }catch(e){}
}
function toast(msg,type="ok"){beep(type); const t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2600);}
function header(){
  const found=Object.values(state.data.dex).filter(x=>x.status&&x.status!=="unknown").length;
  const implanted=Object.values(state.data.garden).length;
  const complete=Object.values(state.data.dex).filter(x=>x.status==="gold").length;
  return `<div class="topbar">
    <div class="brand" onclick="go('home')" role="button">
      <div class="brand-badge">🌿</div><div><h1>JardinDex FP Safor</h1><small>Implantación · Mantenimiento · 74 especies</small></div>
    </div>
    <div class="nav">
      <button onclick="go('home')">Inicio</button><button onclick="go('explore')">Explorar</button><button onclick="go('dex')">JardiDex</button><button onclick="go('zones')">Zonas</button><button onclick="go('garden')">Mantener</button><button onclick="go('credits')">Créditos</button>
    </div>
  </div>
  <div class="stats-row">
    <div class="stat"><b>${found}/74</b> vistas</div><div class="stat"><b>${implanted}</b> en mantenimiento</div><div class="stat"><b>${complete}</b> doradas</div><div class="stat"><b>${state.data.difficulty}</b> dificultad</div>
  </div>`;
}
function go(screen,arg){state.screen=screen; if(arg!==undefined) state[screen+"Arg"]=arg; render();}
function render(){
  if(state.screen==="home") return renderHome();
  if(state.screen==="explore") return renderExplore();
  if(state.screen==="encounter") return renderEncounter();
  if(state.screen==="dex") return renderDex();
  if(state.screen==="garden") return renderGarden();
  if(state.screen==="zones") return renderZones(state.zonesArg||ZONES[0]);
  if(state.screen==="maintain") return renderMaintain(state.currentPlant);
  if(state.screen==="credits") return renderCredits();
}
function renderHome(){
  app.innerHTML = header()+`
    <section class="card dark hero">
      <div>
        <h2>Captura, implanta y mantiene especies reales.</h2>
        <p>Explora ecosistemas, identifica plantas por rasgos, implántalas correctamente y cuídalas hasta conseguir el marco dorado.</p>
        <div class="stats-row">
          <button class="btn primary" onclick="go('explore')">🌍 Entrar en Explorar</button>
          <button class="btn gold" onclick="go('garden')">🛠️ Modo Mantener</button>
          <button class="btn ghost" onclick="resetGame()">Reiniciar progreso</button>
        </div>
      </div>
      <div class="plant-orb"><div class="big-leaf">🌿</div></div>
    </section>
    <div class="grid">
      <div class="card span-4"><h3>🔎 Explorar</h3><p>Encuentros por ecosistema, fotos reales en vivo, lupa botánica y selección de rasgos.</p></div>
      <div class="card span-4"><h3>🌱 Implantación</h3><p>La captura se consigue eligiendo luz, suelo, riego y apoyo adecuados a cada especie.</p></div>
      <div class="card span-4"><h3>🧑‍🌾 Mantener</h3><p>Cada planta tiene cuidados personalizados, problemas frecuentes, minijuegos y evolución.</p></div>
    </div><p class="footer-note">Las zonas reales de la escuela son etiquetas informativas y no puntúan: ${ZONES.join(" · ")}</p>`;
}
function renderExplore(){
  const ecos=Object.keys(JARDINDEX_ECOSYSTEMS);
  app.innerHTML=header()+`<div class="card dark"><h2>Explorar ecosistemas</h2><p>Elige un ecosistema didáctico. No es la ubicación real de la escuela: sirve para aprender patrones de identificación y mantenimiento.</p></div>
  <div class="eco-grid">${ecos.map(e=>{
    const count=JARDINDEX_SPECIES.filter(s=>s.ecosystem===e).length;
    return `<div class="eco" onclick="startEncounter('${escapeAttr(e)}')"><div class="icon">${ecoIcon(e)}</div><h3>${e}</h3><p>${JARDINDEX_ECOSYSTEMS[e]}</p><b>${count} especies posibles</b></div>`;
  }).join("")}</div>`;
}
function escapeAttr(s){return s.replaceAll("'","&apos;");}
function startEncounter(eco){
  const pool=JARDINDEX_SPECIES.filter(s=>s.ecosystem===eco);
  const unseen=pool.filter(s=>!state.data.dex[s.id] || state.data.dex[s.id].status!=="gold");
  const sp=sample(unseen.length?unseen:pool);
  state.ecosystem=eco; state.encounter=sp.id; state.selectedTraits=[]; state.captureScore=20;
  state.data.dex[sp.id]=state.data.dex[sp.id]||{status:"seen",zone:"",attempts:0};
  state.data.dex[sp.id].status = state.data.dex[sp.id].status==="gold"?"gold":"seen";
  save(); state.screen="encounter"; render();
}
const falseTraits = ["hoja acicular","fronde de helecho","hoja carnosa","flor en trompeta","porte arbóreo","trepa con ventosas","hoja grisácea","tronco rugoso","roseta compacta","aroma intenso","hoja ancha tropical","hoja en abanico"];
function renderEncounter(){
  const sp=byId(state.encounter); const dex=state.data.dex[sp.id]||{};
  const right=sp.traits.map(t=> t==="hoja"?"hoja característica":t).concat([sp.type.toLowerCase(), sp.ecosystem.split(",")[0].toLowerCase()]).slice(0,5);
  const options=[...right, ...falseTraits.filter(t=>!right.includes(t)).sort(()=>Math.random()-.5).slice(0,7)].sort(()=>Math.random()-.5);
  app.innerHTML=header()+`
  <div class="photo-stage">
    <div class="photo-box">
      <img id="plantPhoto" alt="Foto de especie vegetal" />
      <div class="scan"></div><div class="photo-label">Especie desconocida · ${ecoIcon(sp.ecosystem)} ${sp.ecosystem}</div>
      <div class="photo-credit" id="photoCredit">Buscando fotografía real...</div>
    </div>
    <div class="card">
      <h2>Encuentro botánico</h2>
      <p><b>Pista del ecosistema:</b> ${sp.ecosystemNote}</p>
      <p><b>Observación inicial:</b> ${sp.hint}</p>
      <div class="bars"><label>Precisión de observación: <b id="score">${state.captureScore}%</b></label><div class="bar"><div class="fill" id="scoreFill" style="width:${state.captureScore}%"></div></div></div>
      <h3>1. Escaneo: selecciona rasgos observables</h3>
      <div class="choice-grid" id="traitGrid">${options.map(o=>`<button class="choice" onclick="toggleTrait(this,'${escapeAttr(o)}')">${o}</button>`).join("")}</div>
      <h3>2. Identifica la especie</h3>
      <div class="choice-grid">${makeChoices(sp).map(c=>`<button class="choice" onclick="identify('${c.id}', this)"><i>${c.scientific}</i><br><small>${c.common}</small></button>`).join("")}</div>
    </div>
  </div>`;
  loadPhoto(sp);
}
function makeChoices(sp){
  let pool=JARDINDEX_SPECIES.filter(s=>s.ecosystem===sp.ecosystem && s.id!==sp.id);
  if(pool.length<3) pool=JARDINDEX_SPECIES.filter(s=>s.type===sp.type && s.id!==sp.id);
  return [sp,...pool.sort(()=>Math.random()-.5).slice(0,3)].sort(()=>Math.random()-.5);
}
function toggleTrait(btn,trait){
  const sp=byId(state.encounter);
  const correct = sp.traits.some(t=>trait.includes(t) || t.includes(trait)) || trait.includes(sp.type.toLowerCase().split("/")[0]) || trait.includes(sp.ecosystem.split(",")[0].toLowerCase());
  btn.classList.toggle("selected");
  if(correct){state.captureScore=clamp(state.captureScore+10); btn.classList.add("good"); toast("Buen rasgo observado");}
  else{state.captureScore=clamp(state.captureScore-8); btn.classList.add("bad"); toast("Ese rasgo no encaja con la pista visual","bad");}
  $("#score").textContent=state.captureScore+"%"; $("#scoreFill").style.width=state.captureScore+"%";
}
function identify(id,btn){
  const sp=byId(state.encounter);
  if(id===sp.id){ btn.classList.add("good"); state.captureScore=clamp(state.captureScore+25); showImplantation(sp); }
  else{ btn.classList.add("bad"); state.captureScore=clamp(state.captureScore-18); toast(`No era esa. Compara la pista: ${sp.hint}`,"bad"); $("#score").textContent=state.captureScore+"%"; $("#scoreFill").style.width=state.captureScore+"%"; }
}
function showImplantation(sp){
  const m=sp.maintenance;
  document.body.insertAdjacentHTML("beforeend",`<div class="modal" id="implantModal"><div class="modal-card">
    <h2>🌱 Implantación de <i>${sp.scientific}</i></h2>
    <p>Has identificado la especie. Ahora la “captura” depende de implantarla con condiciones coherentes.</p>
    <div class="grid">
      <div class="card span-6"><h3>Luz</h3><select id="impLight"><option>sol</option><option>semisombra</option><option>sombra</option><option>luz indirecta brillante</option></select></div>
      <div class="card span-6"><h3>Riego inicial</h3><select id="impWater"><option>bajo</option><option>moderado</option><option>medio-alto</option><option>abundante</option></select></div>
      <div class="card span-6"><h3>Suelo/sustrato</h3><select id="impSoil"><option>drenante</option><option>fresco y rico</option><option>profundo y mejorado</option><option>compacto y húmedo</option></select></div>
      <div class="card span-6"><h3>Apoyo inicial</h3><select id="impSupport"><option>sin apoyo especial</option><option>tutorado</option><option>soporte de trepadora</option><option>mejorar drenaje</option><option>acolchado</option></select></div>
    </div>
    <p><b>Necesidades reales resumidas:</b> luz ${m.light}; riego ${m.water}; suelo ${m.soil}.</p>
    <button class="btn primary" onclick="finishImplantation('${sp.id}')">Confirmar implantación</button>
    <button class="btn" onclick="closeModal()">Cancelar</button>
  </div></div>`);
}
function closeModal(){const m=$(".modal"); if(m)m.remove();}
function finishImplantation(id){
  const sp=byId(id), m=sp.maintenance;
  let score=state.captureScore;
  const light=$("#impLight").value, water=$("#impWater").value, soil=$("#impSoil").value, support=$("#impSupport").value;
  if(m.light.includes(light)||light.includes(m.light.split(" ")[0])) score+=20; else score-=10;
  if(m.water.includes(water)||water.includes(m.water.split(" ")[0])) score+=20; else if(water==="abundante" && m.water.includes("bajo")) score-=25; else score-=8;
  if(m.soil.includes("dren") && soil==="drenante") score+=18; else if(m.soil.includes("fresco") && soil==="fresco y rico") score+=18; else if(m.soil.includes("profundo") && soil==="profundo y mejorado") score+=18; else score-=6;
  if((sp.type.toLowerCase().includes("trepadora") && support==="soporte de trepadora")||(sp.type.toLowerCase().includes("árbol")&&support==="tutorado")||(m.soil.includes("dren")&&support==="mejorar drenaje")) score+=14;
  score=clamp(score);
  const result = score>=80?"excelente":score>=60?"correcta":score>=40?"débil":"fallida";
  state.data.dex[id]={...(state.data.dex[id]||{}),status: result==="fallida"?"seen":"implanted",zone:state.data.dex[id]?.zone||"",lastScore:score};
  if(result!=="fallida"){
    state.data.garden[id]={id, level:1, xp:score, health: score>=80?100:score>=60?82:62, water:55, nutrition:52, stress: score>=80?8:score>=60?22:45, sanity:92, stage:0, days:0, dead:false, log:[`Implantación ${result} (${score}%). ${m.advice}`]};
  }
  save(); closeModal(); toast(result==="fallida"?"Implantación fallida. La especie queda como vista.":`Implantación ${result}. Añadida a Mantener.` , result==="fallida"?"bad":"evo");
  go(result==="fallida"?"explore":"garden");
}
async function loadPhoto(sp){
  const img=$("#plantPhoto"), credit=$("#photoCredit");
  img.src = sp.localImage;
  img.onerror = async ()=> {
    const cached = state.imageCredits[sp.id]?.url;
    if(cached){img.src=cached; credit.textContent=state.imageCredits[sp.id].credit||"Foto provisional online"; return;}
    try{
      credit.textContent="Buscando en Wikimedia Commons...";
      const query=encodeURIComponent(sp.imageQuery);
      const api=`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${query}&gsrnamespace=6&gsrlimit=6&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=900&format=json&origin=*`;
      const r=await fetch(api); const j=await r.json();
      const pages=Object.values(j.query?.pages||{}).filter(p=>p.imageinfo?.[0]?.thumburl||p.imageinfo?.[0]?.url);
      if(pages.length){
        const p=pages.find(x=>!/map|range|distribution|logo/i.test(x.title))||pages[0];
        const info=p.imageinfo[0], meta=info.extmetadata||{};
        const url=info.thumburl||info.url;
        const author=(meta.Artist?.value||"Wikimedia Commons").replace(/<[^>]+>/g,"");
        const lic=(meta.LicenseShortName?.value||"licencia abierta");
        state.imageCredits[sp.id]={url,source:"Wikimedia Commons",credit:`${author} · ${lic}`,page:info.descriptionurl};
        saveCredits(); img.src=url; credit.textContent=state.imageCredits[sp.id].credit; return;
      }
      throw new Error("Sin resultado Commons");
    }catch(e){
      try{
        credit.textContent="Buscando en iNaturalist...";
        const qr=await fetch(`https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(sp.imageQuery)}&per_page=1`);
        const qj=await qr.json();
        const tax=qj.results?.[0];
        if(tax?.default_photo?.medium_url){
          const url=tax.default_photo.medium_url.replace("square","medium");
          state.imageCredits[sp.id]={url,source:"iNaturalist",credit:`iNaturalist · ${tax.name}`,page:tax.uri||""};
          saveCredits(); img.src=url; credit.textContent=state.imageCredits[sp.id].credit; return;
        }
      }catch(err){}
      img.removeAttribute("src"); img.style.background="linear-gradient(135deg,#bbf7d0,#166534)"; credit.textContent="No se pudo cargar foto online. Comprueba conexión.";
    }
  };
}
function renderDex(){
  const filters = ["Todas",...Object.keys(JARDINDEX_ECOSYSTEMS)];
  app.innerHTML=header()+`<div class="card dark"><h2>JardiDex</h2><p>74 especies. Marco dorado = ciclo completado. La zona de escuela es una etiqueta que el alumno elige y no puntúa.</p>
  <select id="filter" onchange="drawDex(this.value)">${filters.map(f=>`<option>${f}</option>`).join("")}</select></div><div id="dexGrid" class="dex-grid"></div>`;
  drawDex("Todas");
}
function drawDex(filter){
  const grid=$("#dexGrid"); const arr=JARDINDEX_SPECIES.filter(s=>filter==="Todas"||s.ecosystem===filter);
  grid.innerHTML=arr.map(sp=>{
    const d=state.data.dex[sp.id]||{status:"unknown"}; const g=state.data.garden[sp.id]; const status=d.status||"unknown";
    return `<div class="dex-card ${status==='gold'?'gold':''} ${status==='unknown'?'unknown':''}" onclick="openSpecies('${sp.id}')">
      <div class="dex-img"><img data-sp="${sp.id}" onerror="this.style.display='none'"><span style="font-size:64px">${plantEmoji(sp)}</span></div>
      <div class="dex-body"><h3>${String(sp.num).padStart(2,'0')} · ${status==='unknown'?'Especie no descubierta':sp.common}</h3>
      <div class="sci">${status==='unknown'?'????':sp.scientific}</div>
      <span class="tag">${sp.type}</span>${status==='gold'?'<span class="tag gold">✓ dorada</span>':status==='implanted'?'<span class="tag">implantada</span>':status==='seen'?'<span class="tag warn">vista</span>':''}
      ${g?.dead?'<span class="tag dead">ejemplar perdido</span>':''}</div></div>`;
  }).join("");
  arr.forEach(sp=>{
    const el=grid.querySelector(`img[data-sp="${sp.id}"]`); if(el && state.imageCredits[sp.id]?.url) el.src=state.imageCredits[sp.id].url;
  });
}
function openSpecies(id){
  const sp=byId(id), d=state.data.dex[id]||{status:"unknown"}, g=state.data.garden[id];
  document.body.insertAdjacentHTML("beforeend",`<div class="modal"><div class="modal-card">
    <h2>${plantEmoji(sp)} ${sp.common}</h2><h3><i>${sp.scientific}</i></h3>
    <p><b>Tipo:</b> ${sp.type}</p><p><b>Ecosistema:</b> ${sp.ecosystem}</p><p><b>Pista:</b> ${sp.hint}</p>
    <p><b>Mantenimiento esencial:</b> ${sp.maintenance.keyActions.join("; ")}.</p>
    <p><b>Errores peligrosos:</b> ${sp.maintenance.dangerActions.join("; ")}.</p>
    <label><b>Ubicación en la escuela (no puntúa):</b></label><br>
    <select onchange="setZone('${id}',this.value)"><option value="">Sin elegir</option>${ZONES.map(z=>`<option ${d.zone===z?'selected':''}>${z}</option>`).join("")}</select>
    <div class="stats-row" style="margin-top:14px">
      ${g&&!g.dead?`<button class="btn primary" onclick="closeModal(); startMaintain('${id}')">Mantener esta planta</button>`:""}
      <button class="btn" onclick="closeModal()">Cerrar</button>
    </div>
  </div></div>`);
}
function setZone(id,z){state.data.dex[id]=state.data.dex[id]||{status:"seen"}; state.data.dex[id].zone=z; save(); toast("Ubicación guardada como etiqueta informativa");}
function renderZones(selected=ZONES[0]){
  const counts=Object.fromEntries(ZONES.map(z=>[z, JARDINDEX_SPECIES.filter(sp=>(state.data.dex[sp.id]?.zone||'')===z).length]));
  const list=JARDINDEX_SPECIES.filter(sp=>(state.data.dex[sp.id]?.zone||'')===selected);
  app.innerHTML=header()+`<div class="card dark"><h2>🗺️ Zonas de la escuela</h2><p>Estas zonas son una catalogación manual del alumnado. No puntúan, no penalizan y no determinan si la planta está “bien” o “mal” ubicada: sirven para organizar observaciones reales de la escuela.</p></div>
  <div class="zone-tabs">${ZONES.map(z=>`<button class="zone-tab ${z===selected?'active':''}" onclick="state.zonesArg='${escapeAttr(z)}'; renderZones('${escapeAttr(z)}')"><b>${z}</b><small>${counts[z]} catalogadas</small></button>`).join('')}</div>
  <div class="card"><h2>${selected}</h2>${list.length?`<div class="dex-grid">${list.map(sp=>zoneSpeciesCard(sp)).join('')}</div>`:`<p>Aún no hay especies catalogadas manualmente en esta zona.</p><button class="btn primary" onclick="go('dex')">Ir a JardiDex para etiquetar especies</button>`}</div>`;
}
function zoneSpeciesCard(sp){
  const d=state.data.dex[sp.id]||{}, g=state.data.garden[sp.id];
  return `<div class="dex-card ${d.status==='gold'?'gold':''}" onclick="openSpecies('${sp.id}')"><div class="dex-img"><span style="font-size:68px">${plantEmoji(sp)}</span></div><div class="dex-body"><h3>${String(sp.num).padStart(2,'0')} · ${sp.common}</h3><div class="sci">${sp.scientific}</div><span class="tag">${sp.type}</span><span class="tag warn">${sp.ecosystem.split(',')[0]}</span>${g?`<span class="tag">Nivel ${g.level}</span>`:''}</div></div>`;
}
function renderGarden(){
  const ids=Object.keys(state.data.garden);
  app.innerHTML=header()+`<div class="card dark"><h2>Modo Mantener</h2><p>Cada acción compara el estado real de la planta con su perfil: rango de agua, nutrición, estrés, sanidad, fase y grupo vegetal. Regar, podar, abonar o tratar mal penaliza de forma visible.</p></div>
  <div class="plant-grid">${ids.length?ids.map(id=>gardenCard(id)).join(""):`<div class="card"><h3>Aún no tienes plantas implantadas</h3><p>Ve a Explorar, identifica una especie e implántala.</p><button class="btn primary" onclick="go('explore')">Explorar ahora</button></div>`}</div>`;
}
function gardenCard(id){
  const sp=byId(id), g=state.data.garden[id], p=profileFor(sp), ws=waterStatus(g,p);
  return `<div class="dex-card ${state.data.dex[id]?.status==='gold'?'gold':''}" onclick="startMaintain('${id}')">
    <div class="dex-img"><span style="font-size:70px">${g.dead?'🥀':plantEmoji(sp)}</span><div class="mini-progress"><div style="width:${cyclePercent(g)}%"></div></div></div>
    <div class="dex-body"><h3>${sp.common}</h3><div class="sci">${sp.scientific}</div>
    <span class="tag">Nivel ${g.level}</span><span class="tag ${ws[1]==='bad'?'dead':ws[1]==='warn'?'warn':''}">Agua: ${ws[0]}</span><span class="tag">${(p.stageLabels||STAGES)[g.stage]||'Ciclo completo'}</span>${g.dead?'<span class="tag dead">muerta</span>':''}</div></div>`;
}
function startMaintain(id){state.currentPlant=id; state.screen="maintain"; render();}
function renderMaintain(id){
  const sp=byId(id), g=state.data.garden[id], p=profileFor(sp);
  if(!g) return go("garden");
  const stageName=(p.stageLabels||STAGES)[g.stage]||'Ciclo completo';
  const reqXp=70+(g.stage*35), pct=cyclePercent(g), ws=waterStatus(g,p), blocked=progressBlockers(g,p);
  app.innerHTML=header()+`<div class="maintain-layout">
  <div class="card">
    <h2>${plantEmoji(sp)} ${sp.common}</h2><div class="sci">${sp.scientific}</div>
    <div class="living-plant ${g.dead?'dead':''} ${ws[1]}">
      <div class="emoji">${g.dead?'🥀':stageEmoji(sp,g.stage)}</div>
      ${g.stress>60?'<div class="symptom s1">⚠️</div>':''}${g.sanity<55?'<div class="symptom s2">🐛</div>':''}${g.water>p.water[1]+8?'<div class="symptom s3">💧</div>':''}${g.water<p.water[0]-8?'<div class="symptom s3">☀️</div>':''}
    </div>
    <h3>${stageName} · Jornada ${g.days}</h3>
    <div class="progress-panel">
      <div class="progress-head"><b>Progreso de ciclo</b><b>${Math.round(pct)}%</b></div>
      <div class="cycle-bar"><div style="width:${pct}%"></div>${(p.stageLabels||STAGES).map((x,i)=>`<span class="milestone ${i<=g.stage?'done':''}" style="left:${i*20}%" title="${x}"></span>`).join('')}</div>
      <div class="phase-note"><b>Objetivo de fase:</b> ${phaseAdvice(sp,g.stage,p)}</div>
      ${blocked.length?`<div class="blockers"><b>Bloquea la evolución:</b> ${blocked.join(' · ')}</div>`:`<div class="blockers good"><b>Lista para progresar:</b> mantén buenas condiciones y acumula EXP (${Math.round(g.xp)}/${reqXp}).</div>`}
      ${g.lastEffects?`<div class="effect-strip">Última acción: ${g.lastEffects}</div>`:''}
    </div>
    <div class="bars">
      ${bar("Salud",g.health,"green")}${rangeHint('Agua',g.water,p.water)}${rangeHint('Nutrición',g.nutrition,p.nutrition)}${bar("Estrés",g.stress,"stress")}${bar("Sanidad",g.sanity,"san")}
    </div>
  </div>
  <div class="card">
    <h2>Acciones de mantenimiento</h2>
    <p><b>Perfil de esta especie:</b> ${p.focus}</p>
    <p><b>Riesgos principales:</b> ${(p.dangers||[]).join('; ')}.</p>
    <div class="action-grid enhanced">
      ${actionButton(id,'observe','👁️','Observar / no intervenir','Revisar sin tocar; útil en plantas de baja intervención.')}
      ${actionButton(id,'water_low','💧','Riego ligero','Poca cantidad. Adecuado para bajo riego o corrección suave.')}
      ${actionButton(id,'water_mid','🚿','Riego moderado','Riego normal de mantenimiento.')}
      ${actionButton(id,'water_high','🌊','Riego abundante','Solo para especies y fases que admiten mucha humedad.')}
      ${actionButton(id,'drain','🪨','Drenaje / sustrato','Airear, evitar encharcamiento o mejorar mezcla.')}
      ${actionButton(id,'feed','🟡','Abonado equilibrado','Nutrición general; cuidado con aromáticas y suculentas.')}
      ${actionButton(id,'feed_bloom','🌸','Abono floración','Útil en rosales, floridas, bulbosas o frutales en fase adecuada.')}
      ${actionButton(id,'prune_light','✂️','Poda ligera / limpieza','Retirar seco, pinzar o limpiar sin debilitar.')}
      ${actionButton(id,'prune_hard','🪓','Poda fuerte','Acción arriesgada: solo tiene sentido en casos concretos.')}
      ${actionButton(id,'inspect','🔍','Inspeccionar plagas','Mirar envés, brotes, tallos, suelo y síntomas.')}
      ${actionButton(id,'treat','🧴','Tratar problema','Mejor tras diagnóstico; tratar sin síntomas penaliza.')}
      ${actionButton(id,'support','🪢','Tutor / soporte / guiado','Árboles jóvenes y trepadoras lo necesitan.')}
      ${actionButton(id,'humidity','💦','Humedad ambiental','Clave en helechos y tropicales; inútil o peligrosa en suculentas.')}
      ${actionButton(id,'shade','⛱️','Proteger del sol','Para sombra/invernadero o golpes de calor.')}
      <button class="action next" onclick="nextDay('${id}')"><span>⏭️</span><b>Siguiente jornada</b><small>Avanza eventos y comprueba consecuencias.</small></button>
    </div>
    <h3>Diario técnico</h3><div class="log">${(g.log||[]).slice(-10).reverse().map(x=>`<p>${x}</p>`).join("")}</div>
  </div></div>`;
}
function actionButton(id,action,icon,title,desc){return `<button class="action" onclick="care('${id}','${action}')"><span>${icon}</span><b>${title}</b><small>${desc}</small></button>`;}
function rangeHint(name,val,range){
  const cls= val<range[0]?'low':val>range[1]?'high':'ok';
  return `<label>${name}: <b>${Math.round(val)}%</b> <small class="range ${cls}">óptimo ${range[0]}-${range[1]}%</small></label><div class="bar"><div class="range-window" style="left:${range[0]}%;width:${range[1]-range[0]}%"></div><div class="fill ${name==='Agua'?'water':'nut'} ${cls}" style="width:${clamp(val)}%"></div></div>`;
}
function phaseAdvice(sp,stage,p){
  const adv={
    tree:['no enterrar cuello, riego profundo y tutor si lo necesita','mantener humedad profunda sin encharcar','favorecer brotes sin podar fuerte','formar estructura con cortes suaves','consolidar copa sana','mantener estable'],
    citrus:['arraigo con riego regular','evitar estrés y clorosis','vigilar brotes tiernos y plagas','preparar floración sin exceso','mantener fruto y sanidad','frutal estable'],
    palm:['no mover cepellón ni podar verde','arraigo con drenaje','permitir hojas nuevas','limpiar solo seco','porte ornamental sano','palmera estable'],
    conifer:['arraigo y humedad moderada','evitar cepellón seco o asfixiado','crecimiento compacto','recorte muy suave','estructura verde densa','consolidación'],
    mediterranean:['drenaje y poco riego','arraigar sin encharcar','crecimiento compacto al sol','poda ligera si procede','flor/aroma con bajo riego','consolidación de baja intervención'],
    climber:['arraigar y colocar soporte','orientar brotes','guiar sin romper','poda/atado de formación','floración o cobertura','trepadora estable'],
    rose:['arraigo y riego sin mojar hojas','brotación sana','vigilar pulgón y oídio','poda/formación correcta','floración y flor pasada','rosal estable'],
    shade:['adaptación sin sol directo','sustrato fresco y aireado','hojas nuevas','limpieza y humedad','porte verde ornamental','planta estable'],
    fern:['humedad sin sol directo','frondes nuevas','evitar sequedad ambiental','retirar frondes secas','frondes desarrolladas','helecho estable'],
    succulent:['no regar si no toca','adaptación con drenaje','crecimiento lento al sol','limpiar hojas dañadas','porte compacto','suculenta estable'],
    herbaceous:['arraigo','crecimiento foliar','control de competencia','limpieza','flor/cobertura','mata completada'],
    bulb:['arraigo','hojas que cargan reservas','emisión de vara','floración','no cortar verde pronto','ciclo completo']
  }[p.group]||[];
  return adv[stage]||p.focus;
}
function progressBlockers(g,p){
  const out=[];
  if(g.health<=65) out.push('salud insuficiente');
  if(g.stress>=p.stressMax) out.push('estrés alto');
  if(g.sanity<=p.sanityMin) out.push('sanidad baja');
  if(g.water<p.water[0]) out.push('falta de agua para esta especie');
  if(g.water>p.water[1]) out.push('exceso de agua para esta especie');
  if(g.nutrition<p.nutrition[0]) out.push('nutrición baja');
  if(g.nutrition>p.nutrition[1]+12) out.push('exceso de abonado');
  return out;
}
function stageEmoji(sp,stage){ if(stage>=5)return "🏆"; if(stage>=4)return sp.type.toLowerCase().includes("árbol")?"🌳":"🌸"; if(stage>=2)return plantEmoji(sp); return "🌱"; }
function bar(name,val,cls){return `<label>${name}: <b>${Math.round(val)}%</b></label><div class="bar"><div class="fill ${cls}" style="width:${clamp(val)}%"></div></div>`;}
function care(id,action){
  const sp=byId(id), g=state.data.garden[id], p=profileFor(sp); if(g.dead)return toast("Este ejemplar está perdido. Captura otro en Explorar.","bad");
  let d={h:0,st:0,san:0,wat:0,nut:0,xp:0,msg:''};
  const group=p.group;
  if(action==='observe'){d={...d,st:-2,san:2,xp:3,msg:`Observación correcta: antes de actuar se revisa agua, sanidad y fase. ${waterStatus(g,p)[0]==='rango correcto'?'No intervenir también es mantenimiento profesional.':''}`};}
  if(action==='water_low'){d.wat+=16; d.xp+=5; d.msg='Riego ligero aplicado.'; if(group==='succulent'||group==='mediterranean'){d.h+=3;d.st-=4;d.xp+=5;d.msg+=' Adecuado para especies de bajo riego si el sustrato estaba seco.'} else if(g.water<p.water[0]){d.h+=2;d.st-=2;d.msg+=' Ayuda, pero quizá se queda corto para esta especie.'}}
  if(action==='water_mid'){d.wat+=32; d.msg='Riego moderado aplicado.'; if(group==='succulent'||p.water[1]<45){d.h-=10;d.st+=16;d.san-=8;d.xp-=3;d.msg+=' Penalización: para esta especie supone exceso de humedad y riesgo de pudrición.'} else {d.h+=4;d.st-=5;d.xp+=9;d.msg+=' Correcto si el sustrato no estaba ya húmedo.'}}
  if(action==='water_high'){d.wat+=52; d.msg='Riego abundante aplicado.'; if(p.water[1]>=82 && g.water<p.water[0]+12){d.h+=5;d.st-=5;d.xp+=8;d.msg+=' Bien usado en especie/fase de humedad alta.'} else {d.h-=16;d.st+=22;d.san-=14;d.xp-=5;d.msg+=' Penalización fuerte: riego excesivo, asfixia radicular y riesgo de hongos.'}}
  if(action==='drain'){d.wat-=20; d.san+=4; if(group==='succulent'||group==='mediterranean'||group==='conifer'||p.water[1]<60){d.h+=6;d.st-=9;d.xp+=11;d.msg='Drenaje mejorado: acción clave para evitar pudriciones y asfixia radicular.'}else{d.st-=2;d.xp+=3;d.msg='Sustrato aireado: mejora ligera, aunque no era la prioridad principal de esta especie.'}}
  if(action==='feed'){d.nut+=25; d.msg='Abonado equilibrado aplicado.'; if(group==='succulent'||group==='mediterranean'){d.st+=8;d.h-=3;d.xp+=1;d.msg+=' Cuidado: en plantas de baja demanda, abonar por rutina puede ser contraproducente.'} else if(g.nutrition>p.nutrition[1]){d.h-=8;d.st+=12;d.xp-=2;d.msg+=' Penalización: ya había suficiente nutrición; aparece riesgo de exceso de sales.'} else {d.h+=4;d.xp+=8;d.msg+=' Adecuado para sostener crecimiento.'}}
  if(action==='feed_bloom'){d.nut+=30; d.msg='Abono de floración aplicado.'; if(['rose','citrus','climber','herbaceous','bulb'].includes(group)&&g.stage>=2){d.h+=5;d.xp+=10;d.msg+=' Bien elegido para fase de floración/fructificación o valor ornamental.'}else{d.h-=4;d.st+=8;d.xp-=1;d.msg+=' No era el momento o la especie no lo necesita: penaliza por exceso/intervención innecesaria.'}}
  if(action==='prune_light'){d.msg='Poda ligera / limpieza realizada.'; if(['rose','climber','mediterranean','conifer','herbaceous','bulb','shade','fern','palm'].includes(group)){d.h+=4;d.st-=4;d.san+=5;d.xp+=9;d.msg+=' Correcta si se limita a seco, flor pasada o formación suave.'}else{d.st+=3;d.xp+=1;d.msg+=' No era prioritaria, pero al ser ligera no causa gran daño.'}}
  if(action==='prune_hard'){d.msg='Poda fuerte realizada.'; if(group==='rose' && g.stage===3){d.h+=2;d.xp+=6;d.msg+=' Solo en rosales y en fase adecuada puede tener sentido.'}else{d.h-=18;d.st+=24;d.san-=4;d.xp-=6;d.msg+=' Penalización grave: cortar tejido sano reduce fotosíntesis, reservas o estructura.'}}
  if(action==='inspect'){d.san+=8;d.st-=2;d.xp+=6;d.msg=`Inspección técnica. Vigila especialmente: ${p.problems.join(', ')||'estrés, riego y estado general'}.`; if(g.sanity<60){d.xp+=4; d.msg+=' Detectas síntomas a tiempo para tratarlos.'}}
  if(action==='treat'){d.msg='Tratamiento aplicado.'; if(g.sanity<70){d.san+=24;d.h+=5;d.st-=8;d.xp+=11;d.msg+=' Correcto porque había síntomas; mejora la sanidad.'}else{d.san-=8;d.h-=3;d.st+=8;d.xp-=2;d.msg+=' Penalización: tratar sin diagnóstico claro es una mala práctica.'}}
  if(action==='support'){d.msg='Tutor/soporte/guiado aplicado.'; if(['tree','climber','rose','palm'].includes(group)){d.h+=5;d.st-=8;d.xp+=10;d.msg+=' Adecuado para porte, arraigo o conducción.'}else{d.st+=3;d.xp+=1;d.msg+=' No aporta mucho en esta especie/fase.'}}
  if(action==='humidity'){d.msg='Humedad ambiental aumentada.'; if(['shade','fern'].includes(group)){d.h+=5;d.st-=8;d.xp+=9;d.msg+=' Acción clave en plantas de sombra húmeda y helechos.'}else if(group==='succulent'||group==='mediterranean'){d.h-=6;d.st+=10;d.san-=8;d.xp-=2;d.msg+=' Penalización: favorece problemas en plantas de ambiente seco.'}else{d.st-=1;d.xp+=1;d.msg+=' Efecto leve.'}}
  if(action==='shade'){d.msg='Protección frente a sol directo colocada.'; if(['shade','fern'].includes(group)){d.h+=5;d.st-=9;d.xp+=9;d.msg+=' Correcto: evita quemaduras en hojas tiernas o tropicales.'}else if(group==='succulent'||group==='mediterranean'){d.h-=4;d.st+=8;d.xp-=1;d.msg+=' Penalización: esta especie necesita mucha luz/sol para mantenerse compacta y sana.'}else{d.st-=2;d.xp+=2;d.msg+=' Protección puntual aceptable si había calor.'}}
  apply(id,d,action);
}
function apply(id,d,action=''){
  const sp=byId(id), g=state.data.garden[id], p=profileFor(sp);
  let extra=[];
  const projectedWater=clamp(g.water+d.wat), projectedNut=clamp(g.nutrition+d.nut);
  if(projectedWater>p.water[1]+10){const sev=Math.min(18,(projectedWater-p.water[1])*.45); d.h-=sev; d.st+=sev; d.san-=sev*.7; extra.push('exceso de agua fuera del rango de la especie');}
  if(projectedWater<p.water[0]-10){const sev=Math.min(14,(p.water[0]-projectedWater)*.35); d.h-=sev; d.st+=sev; extra.push('déficit hídrico para esta especie');}
  if(projectedNut>p.nutrition[1]+12){const sev=Math.min(13,(projectedNut-p.nutrition[1])*.35); d.h-=sev; d.st+=sev; extra.push('exceso de abonado/nutrición');}
  g.health=clamp(g.health+d.h); g.stress=clamp(g.stress+d.st); g.sanity=clamp(g.sanity+d.san); g.water=clamp(g.water+d.wat); g.nutrition=clamp(g.nutrition+d.nut); g.xp=Math.max(0,g.xp+d.xp);
  g.log=g.log||[]; let full=d.msg+(extra.length?` Penalización automática: ${extra.join(', ')}.`:''); const eff=effectText(d); g.lastEffects=eff||'sin cambios numéricos'; g.log.push(`${full} <br><small>${g.lastEffects}</small>`);
  checkProgress(id); save(); toast(full.replace(/<[^>]+>/g,''), d.h<0||d.st>10||d.san<0?"bad":"ok"); renderMaintain(id);
}
function nextDay(id){
  const sp=byId(id), g=state.data.garden[id], p=profileFor(sp); if(g.dead)return;
  g.days++; const before={wat:0,nut:0};
  const consumption = p.group==='succulent'?6:p.group==='mediterranean'?9:p.group==='fern'?18:p.group==='shade'?15:13;
  before.wat-=consumption; before.nut-= p.group==='succulent'?2:5;
  g.water=clamp(g.water+before.wat); g.nutrition=clamp(g.nutrition+before.nut);
  let notes=[];
  if(g.water<p.water[0]){const sev=Math.min(13,(p.water[0]-g.water)*.35+3); g.health-=sev; g.stress+=sev; notes.push(`sequía/agua baja para esta especie (${signed(-sev)} salud)`);} 
  if(g.water>p.water[1]){const sev=Math.min(14,(g.water-p.water[1])*.35+3); g.health-=sev; g.sanity-=sev; g.stress+=sev; notes.push(`exceso de humedad: riesgo radicular y hongos (${signed(-sev)} salud)`);} 
  if(g.nutrition<p.nutrition[0]){g.health-=3; notes.push('nutrición insuficiente ralentiza crecimiento');}
  if(g.nutrition>p.nutrition[1]+12){g.health-=5;g.stress+=6;notes.push('exceso de sales por abonado');}
  if(g.stress>p.stressMax){g.health-=6; notes.push('estrés alto bloquea evolución');}
  if(g.sanity<p.sanityMin){g.health-=6; notes.push('sanidad baja: plaga/enfermedad avanza');}
  if(Math.random()<.38){notes.push(randomEvent(id));}
  g.log.push(`Jornada ${g.days}: ${notes.length?notes.join(' · '):'sin incidencias; la planta mantiene su estado.'}`);
  g.lastEffects=`Agua ${signed(before.wat)} · Nutrición ${signed(before.nut)}`;
  checkProgress(id); save(); renderMaintain(id);
}
function randomEvent(id){
  const sp=byId(id), g=state.data.garden[id], p=profileFor(sp);
  const common=[
    ['Ola de calor',()=>{g.water-=p.group==='succulent'?4:14;g.stress+=p.group==='succulent'?3:10; return 'Evento: ola de calor: aumenta consumo de agua y estrés';}],
    ['Lluvia intensa',()=>{g.water+=26; if(['succulent','mediterranean','conifer'].includes(p.group)){g.sanity-=10;g.stress+=8;} return 'Evento: lluvia intensa: revisa drenaje y evita regar por rutina';}],
    ['Brote tierno',()=>{g.xp+=8;g.nutrition-=6; if(['rose','citrus'].includes(p.group))g.sanity-=6; return 'Evento: brote tierno: crece, pero puede atraer plagas';}],
    ['Semana favorable',()=>{g.health+=4;g.stress-=6;g.xp+=7; return 'Evento: semana favorable: buen crecimiento si no hay bloqueos';}]
  ];
  const [name,fn]=sample(common); return fn();
}
function checkProgress(id){
  const sp=byId(id), g=state.data.garden[id], p=profileFor(sp);
  g.health=clamp(g.health); g.stress=clamp(g.stress); g.sanity=clamp(g.sanity); g.water=clamp(g.water); g.nutrition=clamp(g.nutrition);
  if(g.health<=0){g.dead=true; state.data.dex[id].status="seen"; g.log.push(`Ejemplar perdido. Causa probable: ${diagnoseLoss(g,p)}. Puedes volver a capturarlo.`); toast("La planta ha muerto. Revisa el diario para aprender del error.","bad"); return;}
  const req=70+(g.stage*35); const blockers=progressBlockers(g,p);
  const canEvolve = blockers.length===0 && g.xp>=req;
  if(canEvolve && g.stage<5){g.stage++; g.level++; g.xp=30; g.health=clamp(g.health+8); g.stress=clamp(g.stress-6); g.log.push(`Evolución: pasa a ${(p.stageLabels||STAGES)[g.stage]}. La fase cambia porque la planta mantiene agua, sanidad, nutrición y estrés dentro de rangos adecuados.`); beep("evo");}
  if(g.stage>=5 && !g.dead && state.data.dex[id]?.status!=="gold"){state.data.dex[id].status="gold"; g.log.push("Ciclo completado. Marco dorado desbloqueado para siempre.");}
}
function diagnoseLoss(g,p){
  if(g.water>p.water[1]+12) return 'exceso de riego/encharcamiento';
  if(g.water<p.water[0]-12) return 'sequía o riego insuficiente';
  if(g.sanity<p.sanityMin-12) return 'plaga o enfermedad no controlada';
  if(g.stress>p.stressMax+15) return 'estrés acumulado';
  return 'acumulación de errores de mantenimiento';
}
function renderCredits(){
  const items=Object.entries(state.imageCredits);
  app.innerHTML=header()+`<div class="card dark"><h2>Créditos y fotos provisionales</h2><p>El juego intenta cargar foto local primero. Si no existe, busca foto real en Wikimedia Commons y luego iNaturalist. Las URLs y créditos se guardan en el navegador.</p></div>
  <div class="card"><h3>Fuentes cargadas en este navegador</h3>${items.length?items.map(([id,c])=>`<p><b>${byId(id)?.scientific||id}</b>: ${c.credit} · ${c.source} ${c.page?`· <a href="${c.page}" target="_blank">ver fuente</a>`:""}</p>`).join(""):"<p>Aún no se han cargado fotos. Entra en Explorar para que se vayan buscando.</p>"}</div>
  <div class="card"><h3>Sustitución por fotos propias</h3><p>Coloca tus imágenes reales en <code>assets/img/species/id_especie/general.jpg</code>. El juego las prioriza automáticamente.</p></div>`;
}
function resetGame(){ if(confirm("¿Seguro que quieres borrar el progreso local?")){localStorage.removeItem("jardindex_fp_safor_save"); location.reload();}}
window.addEventListener("load",()=>render());
