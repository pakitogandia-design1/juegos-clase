import { bg,title,button,panel } from '../ui/Ui.js';
import { WordManager } from '../systems/WordManager.js';
import { CivilianManager } from '../systems/CivilianManager.js';
import { PowerupManager } from '../systems/PowerupManager.js';
import { RNG } from '../systems/Utils.js';
const LETTERS='abcdefghijklmnñopqrstuvwxyz'.split('');
const VOWELS='aeiou'.split('');
export class GameScene extends Phaser.Scene{
 constructor(){super('GameScene')}
 create(){
  this.run=this.save.activeRun; if(!this.run){this.scene.start('MenuScene');return;}
  this.node=this.run.nodes[this.run.nodeIndex]; this.rng=new RNG(this.run.seed+'-'+this.run.nodeIndex); this.wordManager=new WordManager(this.save,this.rng); this.civManager=new CivilianManager(this.save,this.rng); this.powerups=new PowerupManager(this.save,this.rng);
  const act=this.runManager.actFor(this.run,this.run.nodeIndex); const categoryKey=this.run.categoryKey==='loteria'?this.rng.pick(['jardineria','matematicas','ciencia','floristeria','fantasia','zombia','libreria','zoologia','quimica','fisica','ecologia']):this.run.categoryKey;
  this.word=this.wordManager.pickWord({categoryKey,difficulty:this.run.difficulty,act}); this.boss=this.node.type==='boss'?this.runManager.bossFor(this.run):null; this.civ=this.civManager.pick({categoryKey,node:this.run.nodeIndex+1,boss:!!this.boss,difficulty:this.run.difficulty}); this.civManager.markSeen(this.civ);
  this.maxFails=7; this.fails=0; if(this.run.freeHeal){this.maxFails++; this.run.freeHeal--;}
  this.used=new Set(); this.revealed=new Set(); this.disabledLetters=new Set(); this.hintLevel=1; if(this.run.powerups?.some(p=>p.type==='extra_start_hint')) this.hintLevel=Math.min(2,this.hintLevel+1);
  this.freeEmergency=false; this.emergencyUsed=false; this.consecutiveFails=0; this.hintsBought=0; this.perfectClean=true; this.powerupUi=[]; this.draw(); this.applyStartPowerups(); this.refreshPowerupsPanel();
 }
 draw(){
  bg(this); this.sounder.startMusic('run'); title(this,this.boss?`BOSS: ${this.boss.name}`:'Rescate Civilian',`${this.word.categoria} · ${this.word.subcategoria}`); const w=this.scale.width,h=this.scale.height;
  this.add.text(42,96,`Nodo ${this.run.nodeIndex+1}/${this.run.total} · ${this.run.difficulty==='hard'?'Difícil':'Normal'} ${this.boss?'· '+this.boss.rule:''}`,{fontSize:'14px',color:'#ffdf7e'});
  this.civGroup=this.add.group(); this.drawCivilian(); this.wordGroup=this.add.group(); this.drawWord();
  this.msg=this.add.text(w/2,382,this.currentHintText(),{fontSize:'17px',align:'center',color:'#eaf7ff',wordWrap:{width:w-170}}).setOrigin(.5);
  this.status=this.add.text(w/2,438,'K-IA espera tu letra.',{fontSize:'20px',fontStyle:'700',color:'#7df9ff'}).setOrigin(.5);
  this.drawKeyboard(); this.drawPowerupsPanel();
  button(this,120,h-38,205,42,'Comprar pista siguiente (+1 fallo)',()=>this.buyHint(),{size:'12px',stroke:0xffe14a});
  button(this,w-105,h-38,160,42,'Pausa / menú',()=>{this.storage.save(this.save); this.scene.start('MenuScene')},{size:'14px'});
  this.input.keyboard.on('keydown',e=>{const k=e.key.toLowerCase(); if(LETTERS.includes(k)) this.guess(k);});
 }
 drawCivilian(){const x=128,y=232; const col=Phaser.Display.Color.HexStringToColor(this.civ.color||'#31f7ff').color; this.add.text(x,118,this.civ.name,{fontSize:'16px',fontStyle:'800',color:'#eaf7ff'}).setOrigin(.5); this.add.text(x,140,`${this.civ.rarity.toUpperCase()} · ${this.civ.family}`,{fontSize:'11px',color:'#7df9ff'}).setOrigin(.5); this.add.circle(x,y-42,30,col,.25).setStrokeStyle(3,col); this.add.rectangle(x,y+15,48,78,col,.18).setStrokeStyle(3,col); this.add.circle(x-12,y-48,4,0xffffff); this.add.circle(x+12,y-48,4,0xffffff); this.lifeBarBg=this.add.rectangle(x,y+78,110,12,0x330b16).setStrokeStyle(1,0xff5470); this.lifeBar=this.add.rectangle(x-55,y+78,110,12,0xff3d5f).setOrigin(0,.5); this.lifeText=this.add.text(x,y+100,`VIDA ${this.maxFails-this.fails}/${this.maxFails}`,{fontSize:'14px',color:'#ffb3c0'}).setOrigin(.5);}
 updateLife(){const remain=Math.max(0,this.maxFails-this.fails); this.lifeBar.width=110*(remain/this.maxFails); this.lifeText.setText(`VIDA ${remain}/${this.maxFails}`);}
 drawWord(){const chars=this.word.solucion.split(''); const w=this.scale.width; const clean=chars.filter(c=>c!==' ').length; const size=clean>18?28:clean>12?34:42; let x=w/2-(Math.min(chars.length,18)*size)/2, y=190; chars.forEach((ch,i)=>{ if(i>0 && i%18===0){y+=52; x=w/2-(Math.min(chars.length-i,18)*size)/2;} if(ch===' '){x+=size*.7; return;} const shown=this.revealed.has(ch)||/\d/.test(ch); const rect=this.add.rectangle(x,y,size-5,42,shown?0x173d35:0x101b3d,.95).setStrokeStyle(2,shown?0x39ff88:0x31f7ff); const txt=this.add.text(x,y,shown?this.displayChar(ch):'?',{fontSize:'24px',fontStyle:'900',color:shown?'#b6ffd5':'#7df9ff'}).setOrigin(.5); this.wordGroup.addMultiple([rect,txt]); x+=size; });}
 redrawWord(){this.wordGroup.clear(true,true); this.drawWord();}
 displayChar(ch){return ch.toUpperCase();}
 currentHintText(){ const k='pista'+this.hintLevel; return `SEÑAL K-IA ${this.hintLevel}/4: ${this.word[k]||this.word.pista4}`;}
 drawKeyboard(){this.keyButtons={}; const w=this.scale.width; const startX=w/2-390, startY=475; LETTERS.forEach((l,i)=>{const x=startX+(i%10)*86,y=startY+Math.floor(i/10)*48; const b=button(this,x,y,70,38,l.toUpperCase(),()=>this.guess(l),{size:'18px'}); this.keyButtons[l]=b;});}
 setKey(l,good){const b=this.keyButtons[l]; if(!b)return; b.r.disableInteractive(); b.r.setFillStyle(good?0x174d35:0x451122); b.t.setColor(good?'#86ffb2':'#ff8aa0');}
 drawPowerupsPanel(){
  this.powerPanel=panel(this,760,245,238,235); this.add.text(760,145,'POWERUPS',{fontSize:'18px',fontStyle:'900',color:'#ffe14a'}).setOrigin(.5);
  this.powerInfo=this.add.text(760,166,'Pasivos + consumibles',{fontSize:'11px',color:'#a9c8ff'}).setOrigin(.5);
 }
 refreshPowerupsPanel(){
  (this.powerupUi||[]).forEach(o=>o.destroy?o.destroy():o.destroy()); this.powerupUi=[];
  const x=760; let y=194; const active=this.run.powerups||[]; const manuals=this.powerups.manualPowerups(this.run);
  const passive=active.filter(p=>!this.powerups.isManual(p)).slice(0,5).map(p=>`• ${p.name}`).join('\n') || 'Sin pasivos activos';
  const txt=this.add.text(x,y,passive,{fontSize:'11px',color:'#d8ecff',align:'center',wordWrap:{width:206}}).setOrigin(.5,0); this.powerupUi.push(txt); y+=Math.min(78,passive.split('\n').length*15+12);
  if(manuals.length===0){ const t=this.add.text(x,330,'No tienes consumibles\nmanuales ahora.',{fontSize:'12px',color:'#7df9ff',align:'center'}).setOrigin(.5); this.powerupUi.push(t); return; }
  manuals.slice(0,4).forEach((p,i)=>{ const b=button(this,x,y+i*34,204,28,this.shortPowerLabel(p),()=>this.usePowerup(p.id),{size:'11px',stroke:this.rarityStroke(p.rarity)}); this.powerupUi.push(b); });
  if(manuals.length>4){const t=this.add.text(x,y+140,`+${manuals.length-4} en reserva`,{fontSize:'11px',color:'#ffdf7e'}).setOrigin(.5); this.powerupUi.push(t);}
 }
 rarityStroke(r){return r==='legendario'?0xffe14a:r==='epico'?0xff3df2:r==='raro'?0x7df9ff:0x31f7ff;}
 shortPowerLabel(p){ const map={reveal_vowel:'Usar: revelar vocal',reveal_consonant:'Usar: consonante',free_hint:'Usar: pista gratis',heal:'Usar: curar fallo',remove_wrong:'Usar: quitar malas',first_letter:'Usar: 1ª letra',last_letter:'Usar: última letra',strong_reveal:'Usar: revelar x2',random_good:'Usar: ruleta buena',reveal_category:'Usar: señal gratis',double_hint_curse:'Usar: doble pista'}; return map[p.type]||`Usar: ${p.name}`;}
 applyStartPowerups(){
  if(this.powerups.consumeType(this.run,'first_letter')){this.revealPosition('first',false); this.status?.setText('Detector inicial revela la primera letra.');}
  if(this.powerups.consumeType(this.run,'last_letter')){this.revealPosition('last',false); this.status?.setText('Detector final revela la última letra.');}
 }
 guess(l){ if(this.used.has(l)||this.disabledLetters.has(l)||this.fails>=this.maxFails)return; this.used.add(l); this.save.stats.letters[l]=(this.save.stats.letters[l]||0)+1; const sol=this.word.solucion; if(sol.includes(l)){ this.revealed.add(l); this.setKey(l,true); this.status.setText('¡Letra encontrada! Civilian resiste.'); this.sounder.play('ok'); this.consecutiveFails=0; if(this.powerups.has(this.run,'echo')&&this.rng.next()<.25) this.revealRandom(); this.redrawWord(); if(this.isComplete()) this.win(); } else { this.setKey(l,false); this.applyFail('Esa letra no está. Civilian recibe daño.'); }}
 applyFail(msg){ if(this.powerups.consumeType(this.run,'shield')){this.status.setText('Blindaje Civilian absorbe el daño.'); this.sounder.play('ok'); this.refreshPowerupsPanel(); return;} this.fails++; this.perfectClean=false; this.consecutiveFails++; this.updateLife(); this.sounder.play('hurt'); if(this.save.settings.blood) this.redSplash(); this.status.setText(msg); if(this.powerups.has(this.run,'auto_remove')) this.removeWrongLetters(1); const normalEmergency=this.run.difficulty==='normal'&&!this.emergencyUsed&&(this.consecutiveFails>=3||this.maxFails-this.fails===1); const powerEmergency=(this.consecutiveFails>=3&&this.powerups.consumeType(this.run,'streak_hint'))||(this.maxFails-this.fails===1&&this.powerups.consumeType(this.run,'last_chance_hint')); if(normalEmergency||powerEmergency){this.freeEmergency=true; this.emergencyUsed=true; this.status.setText('PISTA DE EMERGENCIA DISPONIBLE.'); this.refreshPowerupsPanel();} if(this.fails>=this.maxFails){ if(this.powerups.consumeType(this.run,'revive')){this.fails=this.maxFails-1; this.updateLife(); this.status.setText('Segundo latido: Civilian revive con 1 vida.'); this.refreshPowerupsPanel(); return;} this.lose(); }}
 redSplash(){for(let i=0;i<12;i++){const c=this.add.circle(128+Phaser.Math.Between(-70,70),235+Phaser.Math.Between(-70,80),Phaser.Math.Between(2,7),0xff1538,.75); this.tweens.add({targets:c,alpha:0,y:'+=30',duration:650,onComplete:()=>c.destroy()});}}
 buyHint(){ if(this.hintLevel>=4){this.status.setText('K-IA no tiene más señales que filtrar.'); return;} let free=false; if(this.freeEmergency){free=true; this.freeEmergency=false;} if(this.run.freeHints){free=true; this.run.freeHints--;} if(this.powerups.consumeType(this.run,'free_hint')) free=true; if(!free){this.hintsBought++; this.save.stats.hintsBought++; this.applyFail('La pista tiene precio. +1 fallo.'); if(this.fails>=this.maxFails) return;} this.hintLevel++; this.msg.setText(this.currentHintText()); this.status.setText(free?'Señal gratis filtrada por K-IA.':'Señal comprada. Información recuperada.'); this.sounder.play('loot'); this.refreshPowerupsPanel();}
 usePowerup(id){
  const p=this.powerups.consumeId(this.run,id); if(!p){this.status.setText('Ese powerup ya no está disponible.'); this.refreshPowerupsPanel(); return;}
  let ok=true; const type=p.type;
  if(type==='reveal_vowel') ok=this.revealRandom(ch=>VOWELS.includes(ch));
  else if(type==='reveal_consonant') ok=this.revealRandom(ch=>!VOWELS.includes(ch));
  else if(type==='free_hint') ok=this.freeHintNow();
  else if(type==='heal') ok=this.healFail();
  else if(type==='remove_wrong') ok=this.removeWrongLetters(3);
  else if(type==='first_letter') ok=this.revealPosition('first');
  else if(type==='last_letter') ok=this.revealPosition('last');
  else if(type==='strong_reveal'){ const a=this.revealRandom(); const b=this.revealRandom(); ok=a||b; this.run.minorCurse=true; }
  else if(type==='random_good') ok=this.randomGood();
  else if(type==='reveal_category'){ ok=this.freeHintNow(); }
  else if(type==='double_hint_curse'){ ok=this.freeHintNow(false); if(this.hintLevel<4) this.freeHintNow(false); this.run.minorCurse=true; }
  if(!ok){ this.run.powerups.push(p); this.status.setText('No se puede usar ese powerup ahora.'); }
  else { this.sounder.play('loot'); if(this.isComplete()) this.win(); }
  this.redrawWord(); this.refreshPowerupsPanel(); this.storage.save(this.save);
 }
 freeHintNow(show=true){ if(this.hintLevel>=4) return false; this.hintLevel++; this.msg.setText(this.currentHintText()); this.status.setText('Powerup usado: pista gratis recuperada.'); return true; }
 healFail(){ if(this.fails<=0) return false; this.fails--; this.updateLife(); this.status.setText('Botiquín glitch: Civilian recupera 1 vida.'); return true; }
 revealRandom(filter=null){const letters=[...new Set(this.word.solucion.replace(/ /g,'').split(''))].filter(l=>!this.revealed.has(l) && (!filter || filter(l))); if(letters.length){this.revealed.add(this.rng.pick(letters)); this.redrawWord(); this.status.setText('Powerup usado: letra revelada.'); return true;} return false;}
 revealPosition(which,redraw=true){ const chars=this.word.solucion.split('').filter(ch=>ch!==' '); if(!chars.length) return false; const ch=which==='first'?chars[0]:chars[chars.length-1]; if(this.revealed.has(ch)) return this.revealRandom(); this.revealed.add(ch); if(redraw) this.redrawWord(); this.status.setText(which==='first'?'Primera letra revelada.':'Última letra revelada.'); return true;}
 removeWrongLetters(n=3){ const wrong=LETTERS.filter(l=>!this.used.has(l)&&!this.disabledLetters.has(l)&&!this.word.solucion.includes(l)); let count=0; while(wrong.length&&count<n){ const l=this.rng.pick(wrong); wrong.splice(wrong.indexOf(l),1); this.used.add(l); this.disabledLetters.add(l); this.setKey(l,false); count++; } if(count){this.status.setText(`Núcleo alfabético elimina ${count} letras malas.`); return true;} return false;}
 randomGood(){ const options=[()=>this.revealRandom(),()=>this.healFail(),()=>this.freeHintNow(),()=>this.removeWrongLetters(2)]; for(const fn of Phaser.Utils.Array.Shuffle(options)){ if(fn()) return true; } return false; }
 isComplete(){return this.word.solucion.split('').every(ch=>ch===' '||this.revealed.has(ch)||/\d/.test(ch));}
 win(){this.sounder.play('win'); const perfect=this.fails===0; const critical=this.maxFails-this.fails===1; this.civManager.markSaved(this.civ,{perfect,critical,difficulty:this.run.difficulty,wordId:this.word.id,word:this.word.mostrarComo}); this.save.codex[this.word.id]={id:this.word.id,solucion:this.word.solucion,mostrarComo:this.word.mostrarComo,categoria:this.word.categoria,categoryKey:this.word.categoryKey,subcategoria:this.word.subcategoria,dificultad:this.word.dificultad,times:(this.save.codex[this.word.id]?.times||0)+1,perfect:(this.save.codex[this.word.id]?.perfect||false)||perfect,last:new Date().toISOString(),pistaFinal:this.word.pista4}; this.save.stats.civiliansSaved++; this.save.stats.currentStreak++; this.save.stats.bestStreak=Math.max(this.save.stats.bestStreak,this.save.stats.currentStreak); this.run.saved++; let gain=30+(perfect?20:0)+(critical?15:0)+(this.run.difficulty==='hard'?20:0); if(this.powerups.consumeType(this.run,'double_data')) gain*=2; if(this.powerups.has(this.run,'codex_bonus')) gain+=10; if(this.hintsBought===0&&this.powerups.has(this.run,'no_hint_bonus')) gain+=20; this.run.datos+=gain; this.run.lastResult={win:true,perfect,critical,civ:this.civ,word:this.word,hints:this.hintsBought,fails:this.fails,hintLevel:this.hintLevel}; if(this.boss){this.save.stats.bossesDefeated++; this.run.bosses.push(this.boss.name);} this.storage.save(this.save); this.scene.start('RewardScene');}
 lose(){this.sounder.play('lose'); this.civManager.markLost(this.civ); this.save.stats.civiliansLost++; this.save.stats.currentStreak=0; this.run.lost++; this.run.lastResult={win:false,civ:this.civ,word:this.word,hints:this.hintsBought,fails:this.fails}; this.storage.save(this.save); this.scene.start('RewardScene');}
}
