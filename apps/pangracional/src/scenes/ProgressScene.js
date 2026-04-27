import { addBackground, button } from './ui.js';
import SaveSystem from '../systems/SaveSystem.js';
import { ACHIEVEMENTS } from '../data/achievements.js';

export default class ProgressScene extends Phaser.Scene {
  constructor(){ super('ProgressScene'); }

  recommendation(s) {
    const rec = [];
    if ((s.byKind.fraction||0) < 8) rec.push('fracciones');
    if ((s.byKind.finite||0) < 8) rec.push('decimales finitos');
    if ((s.byKind.periodic||0) < 8) rec.push('decimales periódicos');
    if ((s.byKind.nonperiodic||0) < 3) rec.push('decimales infinitos no periódicos');
    if ((s.byKind.pi||0) < 5) rec.push('irracionales con π');
    if ((s.byKind.e||0) < 3) rec.push('irracionales con e');
    if ((s.byKind.root||0) < 8) rec.push('raíces no exactas');
    return rec.length ? rec.slice(0,4).join(', ') : 'Vas equilibrado: prueba Difícil o Pesadilla.';
  }

  create(){
    addBackground(this);
    const s = SaveSystem.load();
    const acc = SaveSystem.accuracy(s);
    this.add.text(480,42,'Progreso',{fontSize:40,color:'#fff',fontStyle:'bold'}).setOrigin(.5);
    const lines = [
      `Normal: máximo alcanzado ${s.modes.normal.maxReached}/15 · completados ${Object.keys(s.modes.normal.completed).length}/15`,
      `Difícil: máximo alcanzado ${s.modes.hard.maxReached}/15 · completados ${Object.keys(s.modes.hard.completed).length}/15`,
      `Pesadilla: máximo alcanzado ${s.modes.nightmare.maxReached}/15 · completados ${Object.keys(s.modes.nightmare.completed).length}/15`,
      `Burbujas racionales destruidas: ${s.rationalDestroyed}`,
      `Burbujas irracionales destruidas: ${s.irrationalDestroyed}`,
      `Errores con arpón incorrecto: ${s.wrongHarpoons}`,
      `Porcentaje de acierto: ${acc}%`,
      `Mejor racha: ${s.bestStreak}`,
      `Niveles sin daño: ${s.noDamageLevels}`,
      `Niveles sin fallar clasificación: ${s.noWrongLevels}`,
      `Logros desbloqueados: ${Object.keys(s.achievements).length}/${ACHIEVEMENTS.length}`,
      `Recomendación de repaso: ${this.recommendation(s)}`
    ];
    lines.forEach((line,i)=>{
      const y = 104 + i*30;
      this.add.rectangle(480,y,760,24,0x111827,.72).setStrokeStyle(1,0x334155,.5);
      this.add.text(120,y,line,{fontSize:15,color:'#dbeafe'}).setOrigin(0,.5);
    });
    button(this,360,500,'Volver',()=>this.scene.start('MenuScene'),180);
    button(this,600,500,'Reiniciar progreso',()=>{
      SaveSystem.reset();
      this.scene.restart();
    },230);
  }
}
