import { addBackground, button } from './ui.js';
import SaveSystem from '../systems/SaveSystem.js';
import { LEVELS } from '../data/levels.js';
import { MODES } from '../data/modes.js';

export default class LevelSelectScene extends Phaser.Scene {
  constructor(){ super('LevelSelectScene'); }
  init(data){ this.modeId = data.mode || 'normal'; }
  create(){
    addBackground(this);
    const save = SaveSystem.load();
    const modeSave = save.modes[this.modeId];
    this.add.text(480,48,`Modo ${MODES[this.modeId].name}: selección de nivel`,{fontSize:34,color:'#fff',fontStyle:'bold'}).setOrigin(.5);
    this.add.text(480,82,'Dorado = completado. Desbloqueado = alcanzado.',{fontSize:15,color:'#bae6fd'}).setOrigin(.5);

    LEVELS.forEach((level,i)=>{
      const col = i%5, row = Math.floor(i/5);
      const x = 160 + col*160, y = 150 + row*92;
      const unlocked = level.id <= (modeSave.maxReached || 1);
      const completed = !!modeSave.completed[level.id];
      const bg = this.add.rectangle(x,y,126,64,unlocked?0x1f2a4a:0x111827,.95).setStrokeStyle(completed?4:2, completed?0xfacc15:(unlocked?0x60a5fa:0x475569), completed?1:.55);
      this.add.text(x,y-10,`Nivel ${level.id}`,{fontSize:18,color:unlocked?'#fff':'#64748b',fontStyle:'bold'}).setOrigin(.5);
      this.add.text(x,y+14,level.title,{fontSize:11,color:unlocked?'#bae6fd':'#475569',align:'center',wordWrap:{width:112}}).setOrigin(.5);
      if (unlocked) {
        bg.setInteractive({useHandCursor:true});
        bg.on('pointerdown',()=>this.scene.start('GameScene',{mode:this.modeId, levelId:level.id}));
      }
    });
    button(this,350,475,'Cambiar modo',()=>this.scene.start('ModeSelectScene'),220);
    button(this,610,475,'Menú',()=>this.scene.start('MenuScene'),180);
  }
}
