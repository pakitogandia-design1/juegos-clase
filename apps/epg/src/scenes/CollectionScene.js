import { BaseScene } from './BaseScene.js';
import { COLORS } from '../config/gameConfig.js';
import { progress } from '../systems/ProgressManager.js';
import { COLLECTIBLES } from '../systems/CollectionManager.js';
export class CollectionScene extends BaseScene {
  constructor(){ super('CollectionScene'); }
  create(){
    this.drawNeonBackground(); this.backButton();
    this.add.text(640, 70, 'GALERÍA DE RELIQUIAS ALGEBRAICAS', {fontFamily:'Arial', fontSize:'36px', fontStyle:'bold', color:'#ffffff'}).setOrigin(0.5).setShadow(0,0,'#00d9ff',14);
    this.add.rectangle(640, 392, 1100, 525, 0x090b19, 0.86).setStrokeStyle(2, COLORS.cyan, 0.6);
    COLLECTIBLES.forEach((c,i)=>{
      const col = i%4, row = Math.floor(i/4);
      const x = 205 + col*290, y = 160 + row*145;
      const unlocked = !!progress.data.collection[c.id];
      this.add.rectangle(x,y,235,112,0x12172d,0.9).setStrokeStyle(2, unlocked?COLORS.yellow:COLORS.muted, unlocked?0.9:0.25);
      this.add.text(x,y-28,unlocked?'✦':'?',{fontFamily:'Arial',fontSize:'38px',fontStyle:'bold',color:unlocked?'#ffe66d':'#56677a'}).setOrigin(0.5).setShadow(0,0,unlocked?'#ffe66d':'#000000',10);
      this.add.text(x,y+10,unlocked?c.name:'Reliquia bloqueada',{fontFamily:'Arial',fontSize:'17px',fontStyle:'bold',color:unlocked?'#ffffff':'#7b8da0',align:'center',wordWrap:{width:210}}).setOrigin(0.5);
      this.add.text(x,y+38,unlocked?c.desc:'Sigue despejando incógnitas.',{fontFamily:'Arial',fontSize:'12px',color:unlocked?'#cfeaff':'#627386',align:'center',wordWrap:{width:210}}).setOrigin(0.5);
    });
  }
}
