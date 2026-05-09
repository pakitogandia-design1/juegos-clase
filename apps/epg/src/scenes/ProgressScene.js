import { BaseScene } from './BaseScene.js';
import { COLORS } from '../config/gameConfig.js';
import { progress } from '../systems/ProgressManager.js';
import { makeButton } from '../ui/NeonButton.js';
export class ProgressScene extends BaseScene {
  constructor(){ super('ProgressScene'); }
  create(){
    this.drawNeonBackground(); this.backButton();
    this.add.text(640, 70, 'PROGRESO', {fontFamily:'Arial', fontSize:'42px', fontStyle:'bold', color:'#ffffff'}).setOrigin(0.5).setShadow(0,0,'#00d9ff',14);
    this.add.rectangle(640, 380, 1060, 500, 0x090b19, 0.86).setStrokeStyle(2, COLORS.cyan, 0.6);
    const d = progress.data;
    this.add.text(150, 135, `Progreso general: ${Math.round(((progress.classicCompleted()/10)+(d.arcadeMax/30)+(Object.keys(d.achievements).length/11))/3*100)}%`, big());
    this.add.text(150, 185, `Modo clásico: ${progress.classicCompleted()}/10 niveles · ${progress.starsTotal()}/30 estrellas`, normal());
    this.add.text(150, 225, `Modo arcade: máximo nivel alcanzado ${d.arcadeMax}/30 · victorias ${d.arcadeWins}`, normal());
    this.add.text(150, 275, 'Niveles clásicos', big());
    for(let i=1;i<=10;i++){
      const stars = d.classic[i] || 0;
      const x = 170 + ((i-1)%5)*190, y = 325 + Math.floor((i-1)/5)*70;
      this.add.rectangle(x,y,150,48,0x12172d,0.85).setStrokeStyle(2, stars?COLORS.green:COLORS.muted, stars?0.9:0.35);
      this.add.text(x,y-8,`Nivel ${i}`,{fontFamily:'Arial',fontSize:'16px',color:'#ffffff',fontStyle:'bold'}).setOrigin(0.5);
      this.add.text(x,y+12,`${'★'.repeat(stars)}${'☆'.repeat(3-stars)}`,{fontFamily:'Arial',fontSize:'18px',color:'#ffe66d'}).setOrigin(0.5);
    }
    const ops = `Operaciones reflejadas: ${d.stats.reflected}\n+ ${d.stats.plus}    - ${d.stats.minus}    × ${d.stats.multiply}    ÷ ${d.stats.divide}`;
    this.add.text(150, 510, ops, normal());
    makeButton(this, 980, 610, 220, 50, 'BORRAR PROGRESO', ()=>this.confirmReset(), {color:COLORS.red, fontSize:'17px', bold:true});
  }
  confirmReset(){
    const box=this.add.rectangle(640,360,560,230,0x050612,0.97).setStrokeStyle(3,COLORS.red,1).setDepth(50);
    const t=this.add.text(640,310,'¿Borrar todo el progreso?',{fontFamily:'Arial',fontSize:'26px',fontStyle:'bold',color:'#fff'}).setOrigin(0.5).setDepth(51);
    const yes=makeButton(this,550,395,160,50,'SÍ, BORRAR',()=>{progress.reset(); this.scene.restart();},{color:COLORS.red,bold:true}).setDepth(52);
    const no=makeButton(this,730,395,160,50,'CANCELAR',()=>{box.destroy();t.destroy();yes.destroy();no.destroy();},{color:COLORS.cyan,bold:true}).setDepth(52);
  }
}
function big(){ return {fontFamily:'Arial',fontSize:'26px',fontStyle:'bold',color:'#ffffff'}; }
function normal(){ return {fontFamily:'Arial',fontSize:'22px',color:'#d9f7ff',lineSpacing:8}; }
