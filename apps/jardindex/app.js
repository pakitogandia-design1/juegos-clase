
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
      <button onclick="go('home')">Inicio</button><button onclick="go('explore')">Explorar</button><button onclick="go('dex')">JardiDex</button><button onclick="go('garden')">Mantener</button><button onclick="go('credits')">Créditos</button>
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
function renderGarden(){
  const ids=Object.keys(state.data.garden);
  app.innerHTML=header()+`<div class="card dark"><h2>Modo Mantener</h2><p>Cada especie tiene cuidados personalizados. Observa síntomas, decide acciones y completa su ciclo para activar el marco dorado.</p></div>
  <div class="plant-grid">${ids.length?ids.map(id=>gardenCard(id)).join(""):`<div class="card"><h3>Aún no tienes plantas implantadas</h3><p>Ve a Explorar, identifica una especie e implántala.</p><button class="btn primary" onclick="go('explore')">Explorar ahora</button></div>`}</div>`;
}
function gardenCard(id){
  const sp=byId(id), g=state.data.garden[id];
  return `<div class="dex-card ${state.data.dex[id]?.status==='gold'?'gold':''}" onclick="startMaintain('${id}')">
    <div class="dex-img"><span style="font-size:70px">${g.dead?'🥀':plantEmoji(sp)}</span></div>
    <div class="dex-body"><h3>${sp.common}</h3><div class="sci">${sp.scientific}</div>
    <span class="tag">Nivel ${g.level}</span><span class="tag">${STAGES[g.stage]||'Ciclo completo'}</span>${g.dead?'<span class="tag dead">muerta</span>':''}</div></div>`;
}
function startMaintain(id){state.currentPlant=id; state.screen="maintain"; render();}
function renderMaintain(id){
  const sp=byId(id), g=state.data.garden[id], m=sp.maintenance;
  if(!g) return go("garden");
  app.innerHTML=header()+`<div class="maintain-layout">
  <div class="card">
    <h2>${plantEmoji(sp)} ${sp.common}</h2><div class="sci">${sp.scientific}</div>
    <div class="living-plant ${g.dead?'dead':''}">
      <div class="emoji">${g.dead?'🥀':stageEmoji(sp,g.stage)}</div>
      ${g.stress>60?'<div class="symptom s1">⚠️</div>':''}${g.sanity<55?'<div class="symptom s2">🐛</div>':''}${g.water>82?'<div class="symptom s3">💧</div>':''}${g.water<20?'<div class="symptom s3">☀️</div>':''}
    </div>
    <h3>${STAGES[g.stage]||'Ciclo completo'} · Día ${g.days}</h3>
    <div class="bars">
      ${bar("Salud",g.health,"green")}${bar("Agua",g.water,"water")}${bar("Nutrición",g.nutrition,"nut")}${bar("Estrés",g.stress,"stress")}${bar("Sanidad",g.sanity,"san")}
    </div>
  </div>
  <div class="card">
    <h2>Acciones de mantenimiento</h2>
    <p><b>Consejo de especie:</b> ${m.advice}</p>
    <p><b>Necesita:</b> ${m.keyActions.join("; ")}.</p>
    <div class="action-grid">
      <button class="action" onclick="care('${id}','water_low')"><span>💧</span>Riego ligero</button>
      <button class="action" onclick="care('${id}','water_mid')"><span>🚿</span>Riego moderado</button>
      <button class="action" onclick="care('${id}','drain')"><span>🪨</span>Mejorar drenaje/sustrato</button>
      <button class="action" onclick="care('${id}','feed')"><span>🟡</span>Abonar</button>
      <button class="action" onclick="care('${id}','prune')"><span>✂️</span>Podar/limpiar</button>
      <button class="action" onclick="care('${id}','inspect')"><span>🔍</span>Inspeccionar</button>
      <button class="action" onclick="care('${id}','treat')"><span>🧴</span>Tratar problema</button>
      <button class="action" onclick="care('${id}','support')"><span>🪢</span>Tutor/soporte/guiado</button>
      <button class="action" onclick="nextDay('${id}')"><span>⏭️</span>Siguiente jornada</button>
    </div>
    <h3>Diario</h3><div class="log">${(g.log||[]).slice(-8).reverse().map(x=>`<p>${x}</p>`).join("")}</div>
  </div></div>`;
}
function stageEmoji(sp,stage){ if(stage>=5)return "🏆"; if(stage>=4)return sp.type.toLowerCase().includes("árbol")?"🌳":"🌸"; if(stage>=2)return plantEmoji(sp); return "🌱"; }
function bar(name,val,cls){return `<label>${name}: <b>${Math.round(val)}%</b></label><div class="bar"><div class="fill ${cls}" style="width:${clamp(val)}%"></div></div>`;}
function care(id,action){
  const sp=byId(id), g=state.data.garden[id], m=sp.maintenance; if(g.dead)return toast("Este ejemplar está perdido. Captura otro en Explorar.","bad");
  let msg="", xp=0, h=0, st=0, san=0, wat=0, nut=0;
  const lowWater=m.water.includes("bajo"), highWater=m.water.includes("alto"), drainNeed=m.soil.includes("dren");
  if(action==="water_low"){wat+=18; if(lowWater){h+=3;st-=5;xp+=8;msg="Riego ligero adecuado: esta especie no necesita exceso de agua."} else if(highWater){h+=1;xp+=3;msg="Ayuda un poco, pero esta especie suele necesitar más humedad."} else {h+=2;xp+=5;msg="Riego ligero prudente."}}
  if(action==="water_mid"){wat+=32; if(lowWater){h-=8;st+=13;san-=6;msg="Demasiada agua para una planta de bajo riego: aumenta el riesgo de pudrición."; xp-=2}else{h+=5;st-=5;xp+=9;msg="Riego moderado correcto para su estado."}}
  if(action==="drain"){if(drainNeed||lowWater){wat-=18;h+=6;st-=8;san+=4;xp+=10;msg="Buen trabajo: mejorar drenaje evita asfixia radicular y pudriciones."}else{st-=2;xp+=3;msg="Sustrato revisado. No era urgente, pero mejora la aireación."}}
  if(action==="feed"){nut+=24; if(lowWater||sp.type.toLowerCase().includes("aromática")){st+=5;xp+=2;msg="Abonado suave: cuidado, esta especie no necesita excesos."}else{h+=5;xp+=9;msg="Abonado correcto para favorecer crecimiento y valor ornamental."}}
  if(action==="prune"){if(m.keyActions.join(" ").includes("poda")||m.keyActions.join(" ").includes("limpiar")||m.keyActions.join(" ").includes("flores")){h+=5;st-=4;xp+=11;msg="Poda/limpieza adecuada: mejora sanidad, forma y energía de la planta."}else{h-=6;st+=10;msg="Intervención innecesaria: no todas las plantas requieren poda frecuente.";xp-=1}}
  if(action==="inspect"){san+=6;st-=3;xp+=6; msg=`Inspección realizada. Problemas a vigilar: ${m.problems.join(", ")}.`}
  if(action==="treat"){if(g.sanity<70){san+=20;h+=6;st-=8;xp+=10;msg="Tratamiento aplicado tras observar síntomas. La sanidad mejora."}else{san-=5;st+=6;msg="Tratar sin diagnóstico claro puede ser innecesario y estresar la planta.";xp-=1}}
  if(action==="support"){if(m.keyActions.join(" ").includes("tutor")||m.keyActions.join(" ").includes("soporte")||m.keyActions.join(" ").includes("guiar")){h+=5;st-=8;xp+=10;msg="Soporte/guiado adecuado para su porte y fase."}else{st+=2;msg="No necesitaba apoyo especial ahora mismo.";xp+=1}}
  apply(id,{h,st,san,wat,nut,xp,msg});
}
function apply(id,d){
  const g=state.data.garden[id];
  g.health=clamp(g.health+d.h); g.stress=clamp(g.stress+d.st); g.sanity=clamp(g.sanity+d.san); g.water=clamp(g.water+d.wat); g.nutrition=clamp(g.nutrition+d.nut); g.xp=Math.max(0,g.xp+d.xp);
  g.log=g.log||[]; g.log.push(d.msg);
  checkProgress(id); save(); toast(d.msg, d.h<0||d.st>10?"bad":"ok"); renderMaintain(id);
}
function nextDay(id){
  const sp=byId(id), g=state.data.garden[id], m=sp.maintenance; if(g.dead)return;
  g.days++; g.water=clamp(g.water-(m.water.includes("bajo")?10:16)); g.nutrition=clamp(g.nutrition-5);
  if(g.water<18){g.health-=8;g.stress+=12;g.log.push("La planta muestra estrés por sequía.");}
  if(g.water>84){g.health-=7;g.sanity-=8;g.stress+=10;g.log.push("El exceso de humedad empieza a perjudicar raíces y sanidad.");}
  if(g.nutrition<18){g.health-=4;g.log.push("La nutrición baja limita el crecimiento.");}
  if(g.stress>75){g.health-=9;g.log.push("El estrés alto bloquea la evolución.");}
  if(g.sanity<45){g.health-=8;g.log.push("La sanidad baja: aparecen síntomas de plaga o enfermedad.");}
  if(Math.random()<.35){randomEvent(id);}
  checkProgress(id); save(); renderMaintain(id);
}
function randomEvent(id){
  const sp=byId(id), g=state.data.garden[id], m=sp.maintenance;
  const events=[
    ["Ola de calor",()=>{g.water-=15;g.stress+=m.water.includes("bajo")?3:12;}],
    ["Lluvia intensa",()=>{g.water+=25; if(m.water.includes("bajo")){g.sanity-=10;g.stress+=8;}}],
    ["Brote tierno",()=>{g.xp+=8;g.nutrition-=7;}],
    ["Revisión de plagas",()=>{if(Math.random()<.5){g.sanity-=14;}}],
    ["Semana favorable",()=>{g.health+=4;g.stress-=7;g.xp+=6;}]
  ];
  const [name,fn]=sample(events); fn(); g.log.push(`Evento: ${name}. Observa el estado antes de actuar.`);
}
function checkProgress(id){
  const sp=byId(id), g=state.data.garden[id];
  g.health=clamp(g.health); g.stress=clamp(g.stress); g.sanity=clamp(g.sanity); g.water=clamp(g.water); g.nutrition=clamp(g.nutrition);
  if(g.health<=0){g.dead=true; state.data.dex[id].status="seen"; g.log.push(`Ejemplar perdido. Causa probable: ${sp.maintenance.dangerActions[0]}. Puedes volver a capturarlo.`); toast("La planta ha muerto. Revisa el diario para aprender del error.","bad");}
  const canEvolve = g.health>65 && g.stress<55 && g.sanity>55 && g.xp>=70+(g.stage*35);
  if(canEvolve && g.stage<5){g.stage++; g.level++; g.xp=30; g.health=clamp(g.health+10); g.log.push(`Evolución: pasa a ${STAGES[g.stage]}.`); beep("evo");}
  if(g.stage>=5 && !g.dead){state.data.dex[id].status="gold"; g.log.push("Ciclo completado. Marco dorado desbloqueado para siempre.");}
}
function renderCredits(){
  const items=Object.entries(state.imageCredits);
  app.innerHTML=header()+`<div class="card dark"><h2>Créditos y fotos provisionales</h2><p>El juego intenta cargar foto local primero. Si no existe, busca foto real en Wikimedia Commons y luego iNaturalist. Las URLs y créditos se guardan en el navegador.</p></div>
  <div class="card"><h3>Fuentes cargadas en este navegador</h3>${items.length?items.map(([id,c])=>`<p><b>${byId(id)?.scientific||id}</b>: ${c.credit} · ${c.source} ${c.page?`· <a href="${c.page}" target="_blank">ver fuente</a>`:""}</p>`).join(""):"<p>Aún no se han cargado fotos. Entra en Explorar para que se vayan buscando.</p>"}</div>
  <div class="card"><h3>Sustitución por fotos propias</h3><p>Coloca tus imágenes reales en <code>assets/img/species/id_especie/general.jpg</code>. El juego las prioriza automáticamente.</p></div>`;
}
function resetGame(){ if(confirm("¿Seguro que quieres borrar el progreso local?")){localStorage.removeItem("jardindex_fp_safor_save"); location.reload();}}
window.addEventListener("load",()=>render());
