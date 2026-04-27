import { addBackground, button } from './ui.js';

export default class MenuScene extends Phaser.Scene {
  constructor(){ super('MenuScene'); }
  create(){
    addBackground(this);
    this.soundClick = () => {};
    this.add.text(480,78,'PANG RACIONAL',{fontSize:54,color:'#ffffff',fontStyle:'900',stroke:'#1e3a8a',strokeThickness:8}).setOrigin(.5);
    this.add.text(480,130,'Arcade matemático de números racionales e irracionales',{fontSize:18,color:'#bae6fd'}).setOrigin(.5);
    this.add.text(480,166,'Usa el arpón correcto. Sin pistas por color. Solo razonamiento y reflejos.',{fontSize:16,color:'#e0f2fe'}).setOrigin(.5);
    button(this,480,230,'Jugar',()=>this.scene.start('ModeSelectScene'));
    button(this,480,292,'Tutorial',()=>this.scene.start('TutorialScene'));
    button(this,480,354,'Logros',()=>this.scene.start('AchievementsScene'));
    button(this,480,416,'Progreso',()=>this.scene.start('ProgressScene'));
    this.add.text(480,500,'Phaser 3 · GitHub Pages · localStorage',{fontSize:13,color:'#94a3b8'}).setOrigin(.5);
  }
}
