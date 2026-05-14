/* Raíces Cruzadas · Phaser 3 real */
const W = 1280, H = 720;
const LS_KEY = 'raices_cruzadas_phaser_v1_save';
const WORLD_THEMES = {
  'Mundo Verde': {bg:0x082719, accent:0x48f5a4, accent2:0xd7ff8f, label:'Cuaderno de campo'},
  'Matemon': {bg:0x16133a, accent:0xffd166, accent2:0x70d6ff, label:'Bestiario elemental'},
  'Series': {bg:0x2b1530, accent:0xff6bd6, accent2:0xffd166, label:'Sitcom & TV'},
  'Sagas': {bg:0x171024, accent:0xc8a2ff, accent2:0xffe66d, label:'Pergamino épico'},
  'Videojuegos': {bg:0x0b1734, accent:0x42e8ff, accent2:0x48f5a4, label:'HUD arcade'},
  'Extras': {bg:0x2b1432, accent:0xff4fd8, accent2:0x42e8ff, label:'Meme glitch'},
  'Multiverso': {bg:0x080b18, accent:0x42e8ff, accent2:0xff4fd8, label:'Portal multiverso'}
};
function normalizeAnswer(v){return String(v||'').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/Ñ/g,'N').replace(/[^A-Z0-9]/g,'');}
function loadSave(){
  const base={profile:{name:'Paco'},resources:{seeds:300,keys:3,forbidden:1,dust:0,fragments:0},codex:{},items:{},matemon:{},wardrobe:{hat:null,outfit:null,accessory:null,badge:null,frame:null,background:null},achievements:{},stats:{played:0,perfect:0,boxes:0},settings:{sound:true}};
  try{const old=JSON.parse(localStorage.getItem(LS_KEY)||'{}'); return merge(base,old);}catch(e){return base;}
}
function merge(a,b){for(const k in b){if(b[k]&&typeof b[k]==='object'&&!Array.isArray(b[k])) a[k]=merge(a[k]||{},b[k]); else a[k]=b[k];}return a;}
function save(){localStorage.setItem(LS_KEY,JSON.stringify(window.SAVE));}
window.SAVE = loadSave();
function ensureSave(){const s=window.SAVE; for(const k of ['seeds','keys','forbidden','dust','fragments']) if(typeof s.resources[k]!=='number') s.resources[k]=0; for(const k of ['hat','outfit','accessory','badge','frame','background']) if(!(k in s.wardrobe)) s.wardrobe[k]=null; save();}
function repairWardrobe(){const owned=window.SAVE.items; const validIds=new Set(RC_DATA.items.map(i=>i.id)); for(const slot of Object.keys(window.SAVE.wardrobe)){const id=window.SAVE.wardrobe[slot]; const item=RC_DATA.items.find(i=>i.id===id); if(!id) continue; if(!validIds.has(id)||!owned[id]||!item||item.slot!==slot) window.SAVE.wardrobe[slot]=null;} save();}
function pick(arr){return arr[Math.floor(Math.random()*arr.length)];}
function ownedItem(id){return !!window.SAVE.items[id];}
function itemDate(id){const v=window.SAVE.items[id]; return v && typeof v==='object' && v.date ? v.date : 'antes de esta versión';}
function markItemOwned(id){ if(!window.SAVE.items[id] || window.SAVE.items[id]===true){ window.SAVE.items[id]={owned:true,date:new Date().toLocaleDateString('es-ES')}; } }
function rarityDust(r){return r==='Prohibido'?300:r==='Legendario'?160:r==='Épico'?80:r==='Raro'?35:15;}
function rewardItem(album=null){let pool=RC_DATA.items.filter(i=>!album||i.album===album||album==='Multiverso'); if(!pool.length) pool=RC_DATA.items; const notOwned=pool.filter(i=>!ownedItem(i.id)); const it=notOwned.length?pick(notOwned):pick(pool); if(ownedItem(it.id)){window.SAVE.resources.dust += rarityDust(it.rarity); return {kind:'dust',text:`Repetido: ${it.name} → +${rarityDust(it.rarity)} polvo`,item:it};} markItemOwned(it.id); return {kind:'item',text:`Objeto nuevo: ${it.name}`,item:it};}
function unlockWord(w){window.SAVE.codex[w.id]=true;}
function categoriesByWorld(world){return [...new Set(RC_DATA.words.filter(w=>!world||w.world===world).map(w=>w.category))].sort((a,b)=>a.localeCompare(b,'es'));}
function albumColor(album){const map={'Mundo Verde':0x48f5a4,'LibrerIA':0xffe66d,'Matemon':0xffd166,'Series':0xff6bd6,'Sagas':0xc8a2ff,'Videojuegos':0x42e8ff,'Brainrot':0xff4fd8,'Multiverso':0x70d6ff,'Prohibido':0xff3d6e}; return map[album]||0xffffff;}
function unlockAchievement(id,text,rewards={seeds:50}){if(window.SAVE.achievements[id])return null; window.SAVE.achievements[id]=true; Object.entries(rewards).forEach(([k,v])=>window.SAVE.resources[k]=(window.SAVE.resources[k]||0)+v); return text;}
class BaseScene extends Phaser.Scene{
  addBg(world='Multiverso'){
    const t=WORLD_THEMES[world]||WORLD_THEMES.Multiverso;
    this.cameras.main.setBackgroundColor(t.bg);
    for(let i=0;i<42;i++){const x=Phaser.Math.Between(0,W), y=Phaser.Math.Between(0,H); const c=this.add.circle(x,y,Phaser.Math.Between(1,3), i%2?t.accent:t.accent2, .18); this.tweens.add({targets:c,alpha:{from:.05,to:.45},duration:Phaser.Math.Between(1600,3600),yoyo:true,repeat:-1,delay:i*60});}
    const g=this.add.graphics(); g.lineStyle(1,0xffffff,.055); for(let x=0;x<W;x+=42)g.lineBetween(x,0,x,H); for(let y=0;y<H;y+=42)g.lineBetween(0,y,W,y); return t;
  }
  title(txt,sub=''){this.add.text(56,34,txt,{fontSize:'44px',fontFamily:'Arial',fontStyle:'900',color:'#ffffff'}); if(sub)this.add.text(58,86,sub,{fontSize:'17px',color:'#b9c5d6'});}
  btn(x,y,w,h,label,cb,style={}){const bg=this.add.rectangle(x,y,w,h,style.fill||0x14223a,.92).setStrokeStyle(2,style.stroke||0x42e8ff,.7).setInteractive({useHandCursor:true}); const tx=this.add.text(x,y,label,{fontSize:style.size||'20px',fontStyle:'800',color:style.color||'#ffffff',align:'center',wordWrap:{width:w-18}}).setOrigin(.5); bg.on('pointerover',()=>{bg.setFillStyle(style.hover||0x1f365a); this.tweens.add({targets:[bg,tx],scale:1.035,duration:90});}); bg.on('pointerout',()=>{bg.setFillStyle(style.fill||0x14223a); this.tweens.add({targets:[bg,tx],scale:1,duration:90});}); bg.on('pointerdown',()=>cb&&cb()); return {bg,tx};}
  topBar(){const r=window.SAVE.resources; this.add.rectangle(W-265,58,470,58,0x000000,.28).setStrokeStyle(1,0xffffff,.15); this.add.text(W-480,42,`🌱 ${r.seeds}   🔑 ${r.keys}   🗝️ ${r.forbidden}   ✨ ${r.dust}   🧩 ${r.fragments}`,{fontSize:'18px',fontStyle:'800',color:'#ffffff'});}
  back(scene='MenuScene'){this.btn(70,H-44,110,42,'← Menú',()=>this.scene.start(scene),{fill:0x1b263d,stroke:0xffffff,size:'16px'});}
  toast(msg){const box=this.add.rectangle(W/2,112,Math.min(760,msg.length*13+60),52,0x000000,.72).setStrokeStyle(2,0xffffff,.2).setDepth(50); const t=this.add.text(W/2,112,msg,{fontSize:'18px',fontStyle:'800'}).setOrigin(.5).setDepth(51); this.tweens.add({targets:[box,t],alpha:0,y:'-=20',delay:1500,duration:500,onComplete:()=>{box.destroy();t.destroy();}});}
}
class MenuScene extends BaseScene{constructor(){super('MenuScene')}create(){ensureSave();repairWardrobe();this.addBg('Multiverso');this.title('Raíces Cruzadas','Crucigramas, Códex, Matemon, cajas y armario · Phaser 3 real');this.topBar();
  const opts=[['Jugar',()=>this.scene.start('ModeScene')],['Expedición',()=>this.scene.start('ExpeditionScene')],['Cajas animadas',()=>this.scene.start('BoxesScene')],['Armario',()=>this.scene.start('WardrobeScene')],['Colección',()=>this.scene.start('CollectionScene')],['Matemonario',()=>this.scene.start('MatemonScene')],['Tienda',()=>this.scene.start('ShopScene')],['Logros / Perfil',()=>this.scene.start('ProfileScene')],['Opciones',()=>this.scene.start('OptionsScene')]];
  opts.forEach((o,i)=>this.btn(230+(i%3)*410,185+Math.floor(i/3)*118,340,78,o[0],o[1],{fill:0x101c31,stroke:i%2?0xff4fd8:0x42e8ff,size:'22px'}));
  this.add.text(70,H-82,'Esta versión usa Phaser.Game y renderiza el juego dentro del canvas. El campo de respuesta se añade como DOM de Phaser para escribir cómodo en móvil.',{fontSize:'15px',color:'#9fb0c7',wordWrap:{width:1060}});
}}
class ModeScene extends BaseScene{
  constructor(){super('ModeScene')}
  init(data){this.page=data?.page||0; this.worldFilter=data?.worldFilter||'Todos';}
  create(){
    this.addBg('Multiverso');this.title('Elegir partida','Elige mundo, categoría única o crea un crucigrama personalizado con varias categorías');this.topBar();this.back();
    const worlds=['Mundo Verde','Matemon','Series','Sagas','Videojuegos','Extras','Multiverso'];
    this.add.text(64,132,'Mundo mixto',{fontSize:'23px',fontStyle:'900',color:'#ffffff'});
    worlds.forEach((w,i)=>this.btn(155+(i%7)*162,185,145,56,w,()=>this.scene.start('PlayScene',{mode:w==='Multiverso'?'multiverse':'world',world:w}),{fill:WORLD_THEMES[w].bg,stroke:WORLD_THEMES[w].accent,size:'15px'}));
    this.btn(1060,270,260,58,'Modo personalizado\nvarias categorías',()=>this.scene.start('CustomScene'),{fill:0x2a1640,stroke:0xff4fd8,size:'17px'});
    this.add.text(64,262,'Categoría única',{fontSize:'24px',fontStyle:'900',color:'#ffffff'});
    const filters=['Todos','Mundo Verde','Matemon','Series','Sagas','Videojuegos','Extras'];
    filters.forEach((f,i)=>this.btn(122+i*154,318,138,38,f,()=>this.scene.start('ModeScene',{worldFilter:f,page:0}),{fill:this.worldFilter===f?0x244468:0x111b31,stroke:this.worldFilter===f?0xffe66d:0x42e8ff,size:'13px'}));
    let cats=this.worldFilter==='Todos'?[...new Set(RC_DATA.words.map(w=>w.category))].sort((a,b)=>a.localeCompare(b,'es')):categoriesByWorld(this.worldFilter);
    const per=24, pages=Math.max(1,Math.ceil(cats.length/per)); this.page=Math.max(0,Math.min(this.page,pages-1));
    const slice=cats.slice(this.page*per,this.page*per+per);
    slice.forEach((c,i)=>{
      const n=RC_DATA.words.filter(w=>w.category===c).length;
      this.btn(145+(i%6)*192,390+Math.floor(i/6)*58,170,43,`${c}\n${n} palabras`,()=>this.scene.start('PlayScene',{mode:'category',category:c,world:RC_DATA.words.find(w=>w.category===c)?.world||'Multiverso'}),{fill:0x141f34,stroke:0x48f5a4,size:'12px'});
    });
    this.add.text(545,645,`Página ${this.page+1}/${pages} · ${cats.length} categorías visibles`,{fontSize:'16px',color:'#b9c5d6'}).setOrigin(.5);
    if(this.page>0)this.btn(360,650,140,42,'← Anterior',()=>this.scene.start('ModeScene',{worldFilter:this.worldFilter,page:this.page-1}),{fill:0x111b31,stroke:0xffffff,size:'15px'});
    if(this.page<pages-1)this.btn(730,650,140,42,'Siguiente →',()=>this.scene.start('ModeScene',{worldFilter:this.worldFilter,page:this.page+1}),{fill:0x111b31,stroke:0xffffff,size:'15px'});
  }
}
class CustomScene extends BaseScene{
  constructor(){super('CustomScene')}
  init(data){this.selected=new Set(data?.selected||[]); this.page=data?.page||0; this.worldFilter=data?.worldFilter||'Todos';}
  create(){
    this.addBg('Multiverso'); this.title('Modo personalizado','Marca varias categorías y genera un crucigrama mezclado'); this.topBar(); this.back('ModeScene');
    const filters=['Todos','Mundo Verde','Matemon','Series','Sagas','Videojuegos','Extras'];
    filters.forEach((f,i)=>this.btn(122+i*154,145,138,38,f,()=>this.scene.start('CustomScene',{selected:[...this.selected],worldFilter:f,page:0}),{fill:this.worldFilter===f?0x244468:0x111b31,stroke:this.worldFilter===f?0xffe66d:0x42e8ff,size:'13px'}));
    let cats=this.worldFilter==='Todos'?[...new Set(RC_DATA.words.map(w=>w.category))].sort((a,b)=>a.localeCompare(b,'es')):categoriesByWorld(this.worldFilter);
    const per=30, pages=Math.max(1,Math.ceil(cats.length/per)); this.page=Math.max(0,Math.min(this.page,pages-1));
    const slice=cats.slice(this.page*per,this.page*per+per);
    slice.forEach((c,i)=>{
      const on=this.selected.has(c); const n=RC_DATA.words.filter(w=>w.category===c).length;
      this.btn(145+(i%6)*192,220+Math.floor(i/6)*58,170,43,`${on?'☑':'☐'} ${c}\n${n} palabras`,()=>{on?this.selected.delete(c):this.selected.add(c); this.scene.start('CustomScene',{selected:[...this.selected],worldFilter:this.worldFilter,page:this.page});},{fill:on?0x234b38:0x141f34,stroke:on?0xffe66d:0x48f5a4,size:'12px'});
    });
    this.add.text(76,614,`Seleccionadas: ${[...this.selected].join(', ') || 'ninguna'}`,{fontSize:'15px',color:'#dce7f5',wordWrap:{width:820}});
    this.btn(1030,610,250,58,'Jugar personalizado',()=>{if(this.selected.size<2){this.toast('Elige al menos 2 categorías para mezclar.');return;} this.scene.start('PlayScene',{mode:'custom',categories:[...this.selected],world:'Multiverso'});},{fill:0x2a1640,stroke:0xff4fd8,size:'18px'});
    if(this.page>0)this.btn(370,665,140,38,'← Anterior',()=>this.scene.start('CustomScene',{selected:[...this.selected],worldFilter:this.worldFilter,page:this.page-1}),{fill:0x111b31,stroke:0xffffff,size:'14px'});
    if(this.page<pages-1)this.btn(710,665,140,38,'Siguiente →',()=>this.scene.start('CustomScene',{selected:[...this.selected],worldFilter:this.worldFilter,page:this.page+1}),{fill:0x111b31,stroke:0xffffff,size:'14px'});
  }
}
function buildCrossword(words){
  words=Phaser.Utils.Array.Shuffle(words.slice()).filter(w=>w.answer.length>=3&&w.answer.length<=15).slice(0,9);
  const size=17, grid=Array.from({length:size},()=>Array(size).fill(null)); const placed=[];
  function canPlace(word,x,y,dir){const dx=dir==='H'?1:0,dy=dir==='V'?1:0; if(x<0||y<0||x+dx*(word.length-1)>=size||y+dy*(word.length-1)>=size)return false; let touches=0; for(let i=0;i<word.length;i++){const xx=x+dx*i, yy=y+dy*i, cell=grid[yy][xx]; if(cell&&cell!==word[i])return false; if(cell===word[i])touches++; } return placed.length===0||touches>0;}
  function doPlace(entry,x,y,dir){const word=entry.answer, dx=dir==='H'?1:0,dy=dir==='V'?1:0; for(let i=0;i<word.length;i++)grid[y+dy*i][x+dx*i]=word[i]; placed.push({entry,x,y,dir,solved:false,number:placed.length+1});}
  if(!words.length) return {grid,placed}; const first=words.shift(); doPlace(first,Math.floor((size-first.answer.length)/2),Math.floor(size/2),'H');
  for(const entry of words){let done=false; const word=entry.answer; for(let tries=0;tries<240&&!done;tries++){const p=pick(placed), pword=p.entry.answer; for(let i=0;i<word.length&&!done;i++){for(let j=0;j<pword.length&&!done;j++){if(word[i]===pword[j]){const dir=p.dir==='H'?'V':'H'; const x=p.x+(p.dir==='H'?j:0)-(dir==='H'?i:0); const y=p.y+(p.dir==='V'?j:0)-(dir==='V'?i:0); if(canPlace(word,x,y,dir)){doPlace(entry,x,y,dir);done=true;}}}}}
  }
  if(placed.length<5){return buildFallback(words.concat(placed.map(p=>p.entry)));}
  return {grid,placed};
}
function buildFallback(words){const size=17,grid=Array.from({length:size},()=>Array(size).fill(null)),placed=[]; words.slice(0,6).forEach((entry,k)=>{const y=2+k*2,x=1; for(let i=0;i<Math.min(entry.answer.length,15);i++)grid[y][x+i]=entry.answer[i]; placed.push({entry,x,y,dir:'H',solved:false,number:k+1});}); return {grid,placed};}
class PlayScene extends BaseScene{constructor(){super('PlayScene')}init(data){this.cfg=data||{};}create(){const world=this.cfg.world||'Multiverso';this.theme=this.addBg(world);this.title('Crucigrama','Selecciona una palabra, lee la definición y escribe la respuesta completa');this.topBar();this.back('ModeScene');
 let pool=RC_DATA.words; if(this.cfg.mode==='category')pool=pool.filter(w=>w.category===this.cfg.category); else if(this.cfg.mode==='world')pool=pool.filter(w=>w.world===world); else if(this.cfg.mode==='custom')pool=pool.filter(w=>(this.cfg.categories||[]).includes(w.category)); else pool=pool.filter(w=>['Mundo Verde','Matemon','Series','Sagas','Videojuegos','Extras'].includes(w.world));
 if(pool.length<5) pool=RC_DATA.words; this.cross=buildCrossword(pool); this.selected=this.cross.placed[0]; this.revealed={}; this.mistakes=0; this.solved=0; this.drawBoard(); this.drawClues(); this.drawPanel(); this.updateSelection();}
 drawBoard(){const size=30,ox=72,oy=136; this.cells=[]; const g=this.add.container(ox,oy); this.boardContainer=g; for(let y=0;y<17;y++){this.cells[y]=[]; for(let x=0;x<17;x++){const letter=this.cross.grid[y][x]; if(!letter)continue; const rect=this.add.rectangle(x*size,y*size,size-2,size-2,0xf3f7ff,1).setStrokeStyle(1,0x0e1b2d,.95).setInteractive({useHandCursor:true}); const txt=this.add.text(x*size,y*size,'',{fontSize:'18px',fontStyle:'900',color:'#071425'}).setOrigin(.5); const num=this.cross.placed.find(p=>p.x===x&&p.y===y); let nt=null;if(num)nt=this.add.text(x*size-12,y*size-13,String(num.number),{fontSize:'9px',fontStyle:'900',color:'#26364f'}).setOrigin(0,0); rect.on('pointerdown',()=>{const p=this.cross.placed.find(p=>x>=p.x&&y>=p.y&&x<=p.x+(p.dir==='H'?p.entry.answer.length-1:0)&&y<=p.y+(p.dir==='V'?p.entry.answer.length-1:0)); if(p){this.selected=p;this.updateSelection();}}); g.add([rect,txt]); if(nt)g.add(nt); this.cells[y][x]={rect,txt,letter};}}
 }
 drawClues(){this.clueTexts=[]; this.add.text(620,126,'Pistas',{fontSize:'26px',fontStyle:'900'}); const h=this.cross.placed.filter(p=>p.dir==='H'), v=this.cross.placed.filter(p=>p.dir==='V'); let y=164; this.add.text(620,y,'Horizontales',{fontSize:'18px',fontStyle:'900',color:'#48f5a4'}); y+=28; h.forEach(p=>{const t=this.add.text(620,y,`${p.number}. [${p.entry.category}] ${p.entry.clue}`,{fontSize:'15px',color:'#dce7f5',wordWrap:{width:560}}).setInteractive({useHandCursor:true}); t.on('pointerdown',()=>{this.selected=p;this.updateSelection();}); this.clueTexts.push({p,t}); y+=t.height+10;}); y+=8; this.add.text(620,y,'Verticales',{fontSize:'18px',fontStyle:'900',color:'#42e8ff'}); y+=28; v.forEach(p=>{const t=this.add.text(620,y,`${p.number}. [${p.entry.category}] ${p.entry.clue}`,{fontSize:'15px',color:'#dce7f5',wordWrap:{width:560}}).setInteractive({useHandCursor:true}); t.on('pointerdown',()=>{this.selected=p;this.updateSelection();}); this.clueTexts.push({p,t}); y+=t.height+10;});}
 drawPanel(){this.panel=this.add.container(72,655); this.add.rectangle(350,650,540,92,0x000000,.28).setStrokeStyle(2,this.theme.accent,.5); this.inputDom=this.add.dom(264,650,'input','', '').createFromHTML('<input class="rc-input" placeholder="Escribe la respuesta">'); this.btn(625,650,140,48,'Comprobar',()=>this.check()); this.btn(792,650,150,48,'Pista extra',()=>this.extraClue(),{fill:0x231b3a,stroke:0xffd166,size:'17px'}); this.btn(965,650,150,48,'Revelar letra',()=>this.revealLetter(),{fill:0x183329,stroke:0x48f5a4,size:'17px'}); this.info=this.add.text(72,585,'',{fontSize:'17px',color:'#ffffff',wordWrap:{width:1080}});}
 updateSelection(){if(!this.selected)return; for(const row of this.cells)for(const c of row)if(c)c.rect.setFillStyle(0xf3f7ff); const p=this.selected; for(let i=0;i<p.entry.answer.length;i++){const x=p.x+(p.dir==='H'?i:0),y=p.y+(p.dir==='V'?i:0); const c=this.cells[y]?.[x]; if(c)c.rect.setFillStyle(p.solved?0xb9ffc9:0xfff2a8);} this.clueTexts.forEach(o=>o.t.setColor(o.p===p?'#ffe66d':'#dce7f5')); this.info.setText(`${p.number} ${p.dir==='H'?'Horizontal':'Vertical'} · [${p.entry.category}] ${p.entry.clue}`); const el=this.inputDom.node.querySelector('input'); el.value=''; setTimeout(()=>el.focus(),20);}
 fillWord(p,show=false){for(let i=0;i<p.entry.answer.length;i++){const x=p.x+(p.dir==='H'?i:0),y=p.y+(p.dir==='V'?i:0);const c=this.cells[y][x]; if(p.solved||this.revealed[`${p.number}_${i}`]||show)c.txt.setText(c.letter);}}
 check(){const el=this.inputDom.node.querySelector('input'); const val=normalizeAnswer(el.value); if(!this.selected||this.selected.solved)return; if(val===this.selected.entry.answer){this.selected.solved=true; this.solved++; unlockWord(this.selected.entry); window.SAVE.resources.seeds+=5*this.selected.entry.answer.length; this.fillWord(this.selected,true); this.toast(`Correcto: ${this.selected.entry.display} · +${5*this.selected.entry.answer.length} semillas`); this.updateSelection(); if(this.solved===this.cross.placed.length)this.finish();}else{this.mistakes++; window.SAVE.resources.seeds+=2; this.cameras.main.shake(150,.006); this.toast('No es esa. +2 semillas por intentarlo. La respuesta no se borra.');} save(); this.topBar();}
 extraClue(){if(!this.selected)return; const p=this.selected.entry; const extra=p.clueExtra&&p.clueExtra!==p.clue?p.clueExtra:`Empieza por ${p.answer[0]}, tiene ${p.answer.length} letras y pertenece a ${p.category}.`; this.toast(extra); this.info.setText(`Pista extra: ${extra}`);}
 revealLetter(){if(!this.selected||this.selected.solved)return; if(window.SAVE.resources.seeds<20){this.toast('Necesitas 20 semillas para revelar una letra.');return;} window.SAVE.resources.seeds-=20; const p=this.selected; const hidden=[]; for(let i=0;i<p.entry.answer.length;i++)if(!this.revealed[`${p.number}_${i}`])hidden.push(i); if(hidden.length){const i=pick(hidden); this.revealed[`${p.number}_${i}`]=true; this.fillWord(p); this.toast(`Letra revelada en ${p.number}.`);} save();}
 finish(){window.SAVE.stats.played++; window.SAVE.resources.seeds+=80; window.SAVE.resources.keys+=1; const ach=unlockAchievement('first_cross','Primer crucigrama completado',{seeds:100,keys:1}); const rewards=[`+80 semillas`, '+1 llave de vivero']; if(this.mistakes===0){window.SAVE.stats.perfect++; window.SAVE.resources.keys+=1; rewards.push('+1 llave extra por perfecto'); unlockAchievement('first_perfect','Primer perfecto',{seeds:150,keys:1});} const r=rewardItem(this.cfg.world); rewards.push(r.text); save(); this.scene.start('RewardScene',{title:'Crucigrama completado',lines:rewards,from:'ModeScene'});}
}
class RewardScene extends BaseScene{constructor(){super('RewardScene')}init(data){this.dataIn=data||{};}create(){this.addBg('Multiverso');this.title(this.dataIn.title||'Recompensas','Resumen final');this.topBar(); const panel=this.add.rectangle(W/2,H/2,760,430,0x071425,.9).setStrokeStyle(3,0x42e8ff,.7); (this.dataIn.lines||[]).forEach((l,i)=>this.add.text(330,220+i*42,'✦ '+l,{fontSize:'24px',fontStyle:'800',color:i%2?'#48f5a4':'#ffe66d'})); this.btn(W/2-180,570,260,58,'Abrir cajas',()=>this.scene.start('BoxesScene')); this.btn(W/2+180,570,260,58,'Volver',()=>this.scene.start(this.dataIn.from||'MenuScene'));}}
class BoxesScene extends BaseScene{constructor(){super('BoxesScene')}create(){this.addBg('Multiverso');this.title('Cajas animadas','Elige caja, mira la apertura y recibe objetos, polvo o Matemon');this.topBar();this.back(); const boxes=[['Básica','seeds',80,'Multiverso'],['Verde','keys',1,'Mundo Verde'],['LibrerIA','keys',1,'LibrerIA'],['Series','keys',1,'Series'],['Sagas','keys',1,'Sagas'],['Videojuegos','keys',1,'Videojuegos'],['Brainrot','keys',1,'Brainrot'],['Matemon','keys',1,'Matemon'],['Multiverso','keys',2,'Multiverso'],['Prohibida','forbidden',1,'Prohibido']]; boxes.forEach((b,i)=>this.btn(150+(i%5)*245,165+Math.floor(i/5)*106,210,72,`${b[0]}\n${b[2]} ${b[1]==='seeds'?'semillas':b[1]==='keys'?'llave(s)':'prohibida'}`,()=>this.openBox(b),{fill:0x111b31,stroke:i===9?0xff4fd8:0xffd166,size:'15px'})); this.add.text(80,610,'Todas las monedas tienen obtención: crucigramas, bosses, logros y conversiones de tienda. Los repetidos dan polvo o fragmentos.',{fontSize:'16px',color:'#b9c5d6'});}
 openBox(b){const [name,res,cost,album]=b; if(window.SAVE.resources[res]<cost){this.toast('No tienes recursos suficientes. Puedes convertir en Tienda.');return;} window.SAVE.resources[res]-=cost; window.SAVE.stats.boxes++; const cx=640,cy=410; const box=this.add.container(cx,cy); const base=this.add.rectangle(0,20,170,110,0x8a4f1d,1).setStrokeStyle(4,0xffd166); const lid=this.add.rectangle(0,-45,190,52,0xb86b28,1).setStrokeStyle(4,0xffe66d); const glow=this.add.circle(0,0,12,0xffe66d,.0); box.add([glow,base,lid]); this.tweens.add({targets:box,x:'+=8',yoyo:true,repeat:8,duration:50,onComplete:()=>{this.tweens.add({targets:lid,y:-130,angle:-18,duration:380,ease:'Back.Out'}); this.tweens.add({targets:glow,scale:28,alpha:.5,duration:420,yoyo:true,onComplete:()=>{const rewards=[]; const pulls=name==='Prohibida'?5:name==='Multiverso'?4:3; for(let i=0;i<pulls;i++){ if(album==='Matemon'&&i===0){const m=pick(RC_DATA.matemon); const id=m.id; if(window.SAVE.matemon[id]){window.SAVE.resources.fragments+=2; if(typeof window.SAVE.matemon[id]==='object') window.SAVE.matemon[id].fragments=(window.SAVE.matemon[id].fragments||0)+2; rewards.push(`Matemon repetido: ${m.name} → +2 fragmentos`);}else{window.SAVE.matemon[id]={owned:true,date:new Date().toLocaleDateString('es-ES'),fragments:0}; rewards.push(`Matemon nuevo: ${m.name}`);} } else {rewards.push(rewardItem(album).text);} } save(); this.scene.start('RewardScene',{title:`Caja ${name} abierta`,lines:rewards,from:'BoxesScene'});}});}});}
}
class WardrobeScene extends BaseScene{
  constructor(){super('WardrobeScene')}
  init(data){this.page=data?.page||0; this.slotFilter=data?.slotFilter||'Todos';}
  create(){this.addBg('Mundo Verde');this.title('Armario','Avatar grande, equipables temáticos y reparación segura');this.topBar();this.back();this.drawAvatar();this.drawSlots();this.drawInventory();
    this.btn(430,610,220,54,'Desequipar todo',()=>{Object.keys(window.SAVE.wardrobe).forEach(k=>window.SAVE.wardrobe[k]=null);save();this.scene.restart();},{fill:0x3a1720,stroke:0xff6b6b});
    this.btn(680,610,220,54,'Reparar armario',()=>{repairWardrobe();this.toast('Armario reparado y validado.');this.scene.restart();},{fill:0x183329,stroke:0x48f5a4});
  }
  drawAvatar(){
    const c=this.add.container(300,360); this.add.rectangle(300,360,360,510,0x000000,.25).setStrokeStyle(2,0xffffff,.14);
    const bg=window.SAVE.wardrobe.background?albumColor(RC_DATA.items.find(i=>i.id===window.SAVE.wardrobe.background)?.album):0x173420;
    c.add(this.add.circle(0,0,158,bg,.70)); c.add(this.add.circle(0,-88,58,0xffd3a3)); c.add(this.add.rectangle(0,38,116,170,0x48f5a4,.95));
    c.add(this.add.circle(-24,-100,8,0x071425)); c.add(this.add.circle(24,-100,8,0x071425)); c.add(this.add.arc(0,-72,30,18,0,180,false,0x071425,1));
    const slots=window.SAVE.wardrobe;
    const outfit=RC_DATA.items.find(i=>i.id===slots.outfit), hat=RC_DATA.items.find(i=>i.id===slots.hat), acc=RC_DATA.items.find(i=>i.id===slots.accessory), badge=RC_DATA.items.find(i=>i.id===slots.badge), frame=RC_DATA.items.find(i=>i.id===slots.frame);
    if(outfit)c.add(this.add.rectangle(0,42,136,188,albumColor(outfit.album),.90).setStrokeStyle(4,0xffffff,.45));
    if(hat){c.add(this.add.rectangle(0,-158,132,34,albumColor(hat.album),1).setStrokeStyle(3,0xffffff,.55)); c.add(this.add.text(0,-158,hat.name.split(' ')[0],{fontSize:'12px',fontStyle:'900',color:'#071425'}).setOrigin(.5));}
    if(acc)c.add(this.add.circle(92,10,31,albumColor(acc.album),.95).setStrokeStyle(3,0xffffff,.55));
    if(badge)c.add(this.add.star(-48,22,5,12,25,albumColor(badge.album),1).setStrokeStyle(2,0xffffff,.55));
    if(frame)c.add(this.add.rectangle(0,0,274,404).setStrokeStyle(8,albumColor(frame.album),.88));
    this.add.text(172,586,'Los equipables se colocan por ranura: gorro, ropa, accesorio, insignia, marco y fondo.',{fontSize:'15px',color:'#c8d5e8',wordWrap:{width:280},align:'center'});
  }
  drawSlots(){const slots=[['hat','Sombrero'],['outfit','Ropa'],['accessory','Accesorio'],['badge','Insignia'],['frame','Marco'],['background','Fondo']]; slots.forEach((s,i)=>{const x=550+(i%2)*230,y=145+Math.floor(i/2)*70; const id=window.SAVE.wardrobe[s[0]], item=RC_DATA.items.find(it=>it.id===id); this.btn(x,y,200,50,`${s[1]}\n${item?item.name:'vacío'}`,()=>{window.SAVE.wardrobe[s[0]]=null;save();this.scene.restart({page:this.page,slotFilter:this.slotFilter});},{fill:0x111b31,stroke:id?0xffd166:0x42e8ff,size:'14px'});});}
  drawInventory(){
    this.add.text(520,360,'Inventario equipable',{fontSize:'22px',fontStyle:'900'});
    const filters=['Todos','hat','outfit','accessory','badge','frame','background'];
    const labels={hat:'Gorros',outfit:'Ropa',accessory:'Accesorios',badge:'Insignias',frame:'Marcos',background:'Fondos'};
    filters.forEach((f,i)=>this.btn(560+i*94,405,84,32,labels[f]||f,()=>this.scene.restart({slotFilter:f,page:0}),{fill:this.slotFilter===f?0x244468:0x111b31,stroke:this.slotFilter===f?0xffe66d:0x42e8ff,size:'11px'}));
    let owned=RC_DATA.items.filter(i=>i.slot&&ownedItem(i.id)); if(this.slotFilter!=='Todos')owned=owned.filter(i=>i.slot===this.slotFilter);
    const per=15,pages=Math.max(1,Math.ceil(owned.length/per)); this.page=Math.max(0,Math.min(this.page,pages-1)); const slice=owned.slice(this.page*per,this.page*per+per);
    if(!owned.length)this.add.text(530,455,'Aún no tienes equipables de este tipo. Abre cajas o compra objetos en tienda.',{fontSize:'16px',color:'#b9c5d6',wordWrap:{width:620}});
    slice.forEach((it,i)=>this.btn(610+(i%3)*190,455+Math.floor(i/3)*42,170,34,it.name,()=>{window.SAVE.wardrobe[it.slot]=it.id;save();this.scene.restart({page:this.page,slotFilter:this.slotFilter});},{fill:0x172742,stroke:albumColor(it.album),size:'12px'}));
    this.add.text(800,664,`Página ${this.page+1}/${pages} · ${owned.length} equipables`,{fontSize:'14px',color:'#b9c5d6'}).setOrigin(.5);
    if(this.page>0)this.btn(610,665,110,34,'←',()=>this.scene.restart({page:this.page-1,slotFilter:this.slotFilter}),{fill:0x111b31,stroke:0xffffff,size:'14px'});
    if(this.page<pages-1)this.btn(990,665,110,34,'→',()=>this.scene.restart({page:this.page+1,slotFilter:this.slotFilter}),{fill:0x111b31,stroke:0xffffff,size:'14px'});
  }
}
class CollectionScene extends BaseScene{
  constructor(){super('CollectionScene')}
  init(data){this.album=data?.album||null; this.page=data?.page||0;}
  create(){
    this.addBg(this.album||'Multiverso'); this.title(this.album?`Álbum ${this.album}`:'Colección visual','Fichas con rareza, descripción divertida y fecha de consecución'); this.topBar(); this.back();
    if(!this.album){this.drawAlbums(); return;}
    this.drawAlbumCards(this.album);
  }
  drawAlbums(){
    const albums=[...new Set(RC_DATA.items.map(i=>i.album))];
    albums.forEach((a,i)=>{const total=RC_DATA.items.filter(it=>it.album===a).length, got=RC_DATA.items.filter(it=>it.album===a&&ownedItem(it.id)).length; const pct=total?Math.round(got/total*100):0; const x=170+(i%4)*300,y=160+Math.floor(i/4)*106; this.add.rectangle(x,y,255,84,0x111b31,.92).setStrokeStyle(3,albumColor(a),.75).setInteractive({useHandCursor:true}).on('pointerdown',()=>this.scene.start('CollectionScene',{album:a,page:0})); this.add.text(x-112,y-28,a,{fontSize:'20px',fontStyle:'900',color:'#ffffff'}); this.add.text(x-112,y+2,`${got}/${total} objetos · ${pct}%`,{fontSize:'15px',color:'#dce7f5'}); this.add.rectangle(x,y+29,200,10,0x000000,.35); this.add.rectangle(x-100+pct, y+29, Math.max(2,pct*2),10,albumColor(a),.9);});
    this.add.text(80,648,`Total de colección: ${Object.keys(window.SAVE.items).length}/${RC_DATA.items.length}. Los repetidos dan polvo y las cajas intentan entregar objetos nuevos.`,{fontSize:'16px',color:'#b9c5d6'});
  }
  drawAlbumCards(album){
    const items=RC_DATA.items.filter(i=>i.album===album); const per=12, pages=Math.max(1,Math.ceil(items.length/per)); this.page=Math.max(0,Math.min(this.page,pages-1)); const slice=items.slice(this.page*per,this.page*per+per);
    const got=items.filter(i=>ownedItem(i.id)).length, pct=Math.round(got/items.length*100);
    this.add.text(70,120,`${got}/${items.length} conseguidos · ${pct}%`,{fontSize:'20px',fontStyle:'900',color:'#ffe66d'});
    slice.forEach((it,i)=>{const x=165+(i%4)*300,y=230+Math.floor(i/4)*135; const own=ownedItem(it.id), col=own?albumColor(it.album):0x596174; this.add.rectangle(x,y,260,112,own?0x101c31:0x080b15,.94).setStrokeStyle(3,col,.85); this.add.circle(x-98,y-30,24,col,own?.95:.22); this.add.text(x-98,y-30,it.slot?slotIcon(it.slot):'✦',{fontSize:'23px',fontStyle:'900',color:'#071425'}).setOrigin(.5); this.add.text(x-62,y-48,own?it.name:'???',{fontSize:'18px',fontStyle:'900',color:own?'#ffffff':'#7e8797',wordWrap:{width:188}}); this.add.text(x-62,y-20,`${it.rarity}${it.slot?' · '+slotLabel(it.slot):''}`,{fontSize:'13px',fontStyle:'800',color:own?'#ffe66d':'#8d96a8'}); this.add.text(x-112,y+8,own?it.desc:'Objeto aún no conseguido. Abre cajas, juega crucigramas o visita la tienda.',{fontSize:'12px',color:own?'#c8d5e8':'#778196',wordWrap:{width:224}}); this.add.text(x-112,y+42,own?`Conseguido: ${itemDate(it.id)}`:'Fecha: pendiente',{fontSize:'11px',color:own?'#48f5a4':'#6d7688'});});
    this.add.text(610,655,`Página ${this.page+1}/${pages}`,{fontSize:'16px',color:'#b9c5d6'}).setOrigin(.5);
    if(this.page>0)this.btn(440,655,130,38,'← Anterior',()=>this.scene.start('CollectionScene',{album,page:this.page-1}),{fill:0x111b31,stroke:0xffffff,size:'14px'});
    if(this.page<pages-1)this.btn(780,655,130,38,'Siguiente →',()=>this.scene.start('CollectionScene',{album,page:this.page+1}),{fill:0x111b31,stroke:0xffffff,size:'14px'});
  }
}
function slotLabel(slot){return {hat:'Gorro',outfit:'Ropa',accessory:'Accesorio',badge:'Insignia',frame:'Marco',background:'Fondo'}[slot]||slot;}
function slotIcon(slot){return {hat:'🎩',outfit:'👕',accessory:'🧰',badge:'🏅',frame:'▣',background:'🌌'}[slot]||'✦';}
class MatemonScene extends BaseScene{
  constructor(){super('MatemonScene')}
  init(data){this.page=data?.page||0;}
  preload(){RC_DATA.matemon.forEach(m=>this.load.image(m.id,'assets/matemon/'+m.file));}
  create(){
    this.addBg('Matemon');this.title('Matemonario','Cartas visuales con páginas, tipos, rareza y fecha de obtención');this.topBar();this.back();
    const per=18,pages=Math.max(1,Math.ceil(RC_DATA.matemon.length/per)); this.page=Math.max(0,Math.min(this.page,pages-1));
    const slice=RC_DATA.matemon.slice(this.page*per,this.page*per+per);
    slice.forEach((m,i)=>{const x=116+(i%6)*205,y=180+Math.floor(i/6)*160; const owned=!!window.SAVE.matemon[m.id]; this.add.rectangle(x,y,170,138,owned?0x241d44:0x050915,.94).setStrokeStyle(3,owned?0xffd166:0x555f76); if(owned){this.add.image(x-46,y-14,m.id).setDisplaySize(78,78);} else this.add.text(x-46,y-18,'?',{fontSize:'56px',fontStyle:'900',color:'#657086'}).setOrigin(.5); this.add.text(x+18,y-48,owned?m.name:'No descubierto',{fontSize:'15px',fontStyle:'900',color:owned?'#ffffff':'#818a9d',wordWrap:{width:92}}).setOrigin(.5,0); this.add.text(x+18,y-10,owned?`${m.type}\n${m.rarity}`:'???\n???',{fontSize:'12px',fontStyle:'800',color:owned?'#ffe66d':'#687285',align:'center'}).setOrigin(.5,0); this.add.text(x-74,y+50,owned?`Conseguido: ${window.SAVE.matemon[m.id]?.date||'antes de esta versión'}\nFragmentos: ${window.SAVE.matemon[m.id]?.fragments||0}`:'Se desbloquea al aparecer por primera vez en una Caja Matemon.',{fontSize:'10px',color:owned?'#48f5a4':'#7d8798',wordWrap:{width:148},align:'center'});});
    this.add.text(640,642,`Página ${this.page+1}/${pages} · ${Object.keys(window.SAVE.matemon).length}/${RC_DATA.matemon.length} Matemon`,{fontSize:'16px',color:'#b9c5d6'}).setOrigin(.5);
    if(this.page>0)this.btn(440,650,130,40,'← Anterior',()=>this.scene.start('MatemonScene',{page:this.page-1}),{fill:0x111b31,stroke:0xffffff,size:'14px'});
    if(this.page<pages-1)this.btn(840,650,130,40,'Siguiente →',()=>this.scene.start('MatemonScene',{page:this.page+1}),{fill:0x111b31,stroke:0xffffff,size:'14px'});
  }
}
class ShopScene extends BaseScene{constructor(){super('ShopScene')}create(){this.addBg('Series');this.title('Tienda y conversiones','Ningún recurso queda bloqueado');this.topBar();this.back(); const trades=[['150 semillas → 1 llave',()=>this.trade('seeds',150,'keys',1)],['3 llaves → 1 prohibida',()=>this.trade('keys',3,'forbidden',1)],['600 semillas → 1 prohibida',()=>this.trade('seeds',600,'forbidden',1)],['100 polvo → Caja básica',()=>{if(window.SAVE.resources.dust>=100){window.SAVE.resources.dust-=100;save();this.scene.start('BoxesScene')}else this.toast('Necesitas 100 polvo.')}]]; trades.forEach((t,i)=>this.btn(250+(i%2)*390,180+Math.floor(i/2)*90,330,58,t[0],t[1],{fill:0x111b31,stroke:0x48f5a4})); const notOwned=RC_DATA.items.filter(i=>!ownedItem(i.id)).slice(0,8); this.add.text(90,390,'Objetos concretos no conseguidos',{fontSize:'24px',fontStyle:'900'}); notOwned.forEach((it,i)=>this.btn(190+(i%4)*270,460+Math.floor(i/4)*70,230,48,`${it.name}\n220 semillas`,()=>{if(window.SAVE.resources.seeds>=220){window.SAVE.resources.seeds-=220;markItemOwned(it.id);save();this.toast('Comprado: '+it.name);this.scene.restart();}else this.toast('Necesitas 220 semillas.');},{fill:0x221a32,stroke:0xffd166,size:'14px'}));}
 trade(a,ca,b,cb){if(window.SAVE.resources[a]>=ca){window.SAVE.resources[a]-=ca;window.SAVE.resources[b]+=cb;save();this.scene.restart();}else this.toast('No tienes suficientes recursos.');}}
class ExpeditionScene extends BaseScene{constructor(){super('ExpeditionScene')}create(){this.addBg('Sagas');this.title('Expedición','Ruta con crucigramas, eventos, descanso y boss');this.topBar();this.back(); const nodes=['Crucigrama Verde','Evento','Caja','Descanso','Crucigrama Series','Tienda','Boss Multiverso']; nodes.forEach((n,i)=>{const x=120+i*170,y=330+Math.sin(i*.9)*80; this.add.line(0,0, i?120+(i-1)*170:x,y, x,y,0xffffff,.18).setOrigin(0); this.btn(x,y,135,58,n,()=>this.node(n),{fill:n.includes('Boss')?0x3a1229:0x111b31,stroke:n.includes('Boss')?0xff4fd8:0xffd166,size:'14px'});});}
 node(n){if(n.includes('Crucigrama'))this.scene.start('PlayScene',{mode:'multiverse',world:'Multiverso'}); else if(n==='Caja')this.scene.start('BoxesScene'); else if(n==='Tienda')this.scene.start('ShopScene'); else if(n==='Descanso'){window.SAVE.resources.seeds+=80;save();this.toast('Descanso: +80 semillas');this.scene.restart();} else if(n.includes('Boss')){window.SAVE.resources.forbidden+=1;window.SAVE.resources.seeds+=180;save();this.scene.start('RewardScene',{title:'Boss superado',lines:['+1 llave prohibida garantizada','+180 semillas','El boss multiverso siempre mezcla categorías'],from:'ExpeditionScene'});} else {window.SAVE.resources.keys+=1;save();this.toast('Evento: encuentras una llave de vivero.');this.scene.restart();}}
}
class ProfileScene extends BaseScene{constructor(){super('ProfileScene')}create(){this.addBg('Mundo Verde');this.title('Perfil y logros','Progreso guardado localmente');this.topBar();this.back(); const s=window.SAVE; const lines=[`Partidas completadas: ${s.stats.played}`,`Perfectos: ${s.stats.perfect}`,`Cajas abiertas: ${s.stats.boxes}`,`Palabras Códex: ${Object.keys(s.codex).length}`,`Objetos: ${Object.keys(s.items).length}/${RC_DATA.items.length}`,`Matemon: ${Object.keys(s.matemon).length}/${RC_DATA.matemon.length}`,`Logros: ${Object.keys(s.achievements).length}`]; lines.forEach((l,i)=>this.add.text(120,160+i*46,l,{fontSize:'24px',fontStyle:'800',color:i%2?'#48f5a4':'#ffffff'}));}}
class OptionsScene extends BaseScene{constructor(){super('OptionsScene')}create(){this.addBg('Extras');this.title('Opciones y diagnóstico','Herramientas para reparar y probar sin borrar todo');this.topBar();this.back(); const opts=[['Reparar progreso',()=>{ensureSave();repairWardrobe();this.toast('Progreso reparado.')}],['Recalcular / reparar armario',()=>{repairWardrobe();this.toast('Armario validado.')}],['Desbloquear recursos de prueba',()=>{window.SAVE.resources.seeds+=1000;window.SAVE.resources.keys+=8;window.SAVE.resources.forbidden+=3;save();this.scene.restart();}],['Exportar progreso',()=>this.exportSave()],['Importar progreso',()=>this.importSave()],['Borrar progreso',()=>{localStorage.removeItem(LS_KEY);location.reload();}]]; opts.forEach((o,i)=>this.btn(300+(i%2)*380,180+Math.floor(i/2)*90,320,58,o[0],o[1],{fill:0x111b31,stroke:i===5?0xff6b6b:0x42e8ff,size:'18px'}));}
 exportSave(){const data=btoa(unescape(encodeURIComponent(JSON.stringify(window.SAVE)))); navigator.clipboard?.writeText(data); this.toast('Código de progreso copiado al portapapeles.');}
 importSave(){const dom=this.add.dom(W/2,540).createFromHTML('<textarea class="rc-import" placeholder="Pega aquí el código exportado"></textarea>'); this.btn(W/2,660,220,46,'Importar',()=>{try{const val=dom.node.querySelector('textarea').value.trim(); window.SAVE=merge(loadSave(),JSON.parse(decodeURIComponent(escape(atob(val))))); save(); this.toast('Importado.'); this.scene.restart();}catch(e){this.toast('Código no válido.');}});}}
const config={type:Phaser.AUTO,parent:'game',width:W,height:H,backgroundColor:'#06111f',scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},dom:{createContainer:true},scene:[MenuScene,ModeScene,CustomScene,PlayScene,RewardScene,BoxesScene,WardrobeScene,CollectionScene,MatemonScene,ShopScene,ExpeditionScene,ProfileScene,OptionsScene]};
window.addEventListener('load',()=>{ if(!window.Phaser){document.body.innerHTML='<div style="color:white;padding:30px;font:20px system-ui">No se pudo cargar Phaser desde CDN.</div>';return;} window.game=new Phaser.Game(config);});
