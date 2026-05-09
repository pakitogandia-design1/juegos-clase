import { BaseScene } from './BaseScene.js';
import { COLORS } from '../config/gameConfig.js';
import { makeButton } from '../ui/NeonButton.js';
import { progress } from '../systems/ProgressManager.js';
export class MenuScene extends BaseScene {
  constructor(){ super('MenuScene'); }
  create(){
    this.drawNeonBackground(); this.titleBlock(82);
    this.add.rectangle(640, 392, 760, 420, 0x090b19, 0.82).setStrokeStyle(2, COLORS.cyan, 0.55);
    const buttons = [
      ['MODO CLÁSICO', ()=>this.scene.start('GameScene', { mode:'classic', level: progress.data.tutorialDone ? 1 : 0 })],
      ['MODO ARCADE', ()=>this.scene.start('GameScene', { mode:'arcade', level: 1 })],
      ['PROGRESO', ()=>this.scene.start('ProgressScene')],
      ['LOGROS', ()=>this.scene.start('AchievementsScene')],
      ['COLECCIÓN', ()=>this.scene.start('CollectionScene')],
      ['CÓMO JUGAR', ()=>this.scene.start('HowToPlayScene')]
    ];
    buttons.forEach((b,i)=> makeButton(this, 640, 230+i*66, 360, 52, b[0], b[1], {color:i<2?COLORS.green:COLORS.cyan, bold:true}));
    const stats = `Clásico: ${progress.classicCompleted()}/10 · Arcade máximo: ${progress.data.arcadeMax}/30 · Estrellas: ${progress.starsTotal()}/30`;
    this.add.text(640, 658, stats, {fontFamily:'Arial', fontSize:'18px', color:'#9fb5c8'}).setOrigin(0.5);
  }
}
