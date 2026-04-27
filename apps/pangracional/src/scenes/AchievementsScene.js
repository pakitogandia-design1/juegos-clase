import { addBackground, button } from './ui.js';
import SaveSystem from '../systems/SaveSystem.js';
import { ACHIEVEMENTS } from '../data/achievements.js';

export default class AchievementsScene extends Phaser.Scene {
  constructor(){ super('AchievementsScene'); }
  create(){
    addBackground(this);
    const save = SaveSystem.load();
    this.add.text(480,42,'Logros',{fontSize:40,color:'#fff',fontStyle:'bold'}).setOrigin(.5);
    const unlocked = ACHIEVEMENTS.filter(a=>save.achievements[a.id]).length;
    this.add.text(480,78,`${unlocked}/${ACHIEVEMENTS.length} desbloqueados`,{fontSize:16,color:'#fde68a'}).setOrigin(.5);
    ACHIEVEMENTS.forEach((a,i)=>{
      const col = i%2, row=Math.floor(i/2);
      const x = 250 + col*430, y=118+row*38;
      const ok = !!save.achievements[a.id];
      const box = this.add.rectangle(x,y,390,32,ok?0x263b25:0x1f2937,.9).setStrokeStyle(1,ok?0xfacc15:0x475569,.85);
      this.add.text(x-180,y-1,`${ok?'🏆':'🔒'} ${a.name}`,{fontSize:13,color:ok?'#fef3c7':'#cbd5e1',fontStyle:'bold'}).setOrigin(0,.5);
      this.add.text(x+32,y, a.desc,{fontSize:10,color:'#94a3b8',wordWrap:{width:170}}).setOrigin(0,.5);
    });
    button(this,480,505,'Volver',()=>this.scene.start('MenuScene'),190);
  }
}
