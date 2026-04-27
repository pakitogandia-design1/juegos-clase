import { addBackground, button } from './ui.js';
import { MODES, MODE_ORDER } from '../data/modes.js';

export default class ModeSelectScene extends Phaser.Scene {
  constructor(){ super('ModeSelectScene'); }
  create(){
    addBackground(this);
    this.add.text(480,58,'Elige modo',{fontSize:42,color:'#fff',fontStyle:'bold'}).setOrigin(.5);
    MODE_ORDER.forEach((id,i)=>{
      const m = MODES[id];
      const x = 210 + i*270;
      const card = this.add.rectangle(x,245,235,245, id==='nightmare'?0x331020:(id==='hard'?0x2b2350:0x123044),.92).setStrokeStyle(3, id==='normal'?0x7dd3fc:(id==='hard'?0xc084fc:0xfb7185), .9).setInteractive({useHandCursor:true});
      this.add.text(x,172,m.name,{fontSize:30,color:'#fff',fontStyle:'bold'}).setOrigin(.5);
      this.add.text(x,222,m.subtitle,{fontSize:15,color:'#dbeafe',align:'center',wordWrap:{width:190}}).setOrigin(.5);
      const rules = id==='normal' ? 'Sin tiempo\nMás ayudas\nPower-ups frecuentes' : id==='hard' ? '99 segundos\nMás velocidad\nMenos ayudas' : '60 segundos\nMuy rápido\nPower-ups escasos';
      this.add.text(x,286,rules,{fontSize:15,color:'#e0f2fe',align:'center',lineSpacing:8}).setOrigin(.5);
      card.on('pointerdown',()=>this.scene.start('LevelSelectScene',{mode:id}));
      card.on('pointerover',()=>this.tweens.add({targets:card,scaleX:1.04,scaleY:1.04,duration:100}));
      card.on('pointerout',()=>this.tweens.add({targets:card,scaleX:1,scaleY:1,duration:100}));
    });
    button(this,480,484,'Volver al menú',()=>this.scene.start('MenuScene'),250);
  }
}
