import { BaseScene } from './BaseScene.js';
import { COLORS } from '../config/gameConfig.js';
import { progress } from '../systems/ProgressManager.js';
import { ACHIEVEMENTS } from '../systems/AchievementManager.js';
export class AchievementsScene extends BaseScene {
  constructor(){ super('AchievementsScene'); }
  create(){
    this.drawNeonBackground(); this.backButton();
    this.add.text(640, 70, 'LOGROS', {fontFamily:'Arial', fontSize:'42px', fontStyle:'bold', color:'#ffffff'}).setOrigin(0.5).setShadow(0,0,'#ff38d1',14);
    this.add.rectangle(640, 390, 1080, 520, 0x090b19, 0.86).setStrokeStyle(2, COLORS.magenta, 0.6);
    ACHIEVEMENTS.forEach((a,i)=>{
      const col = i%2, row = Math.floor(i/2);
      const x = 380 + col*520, y = 145 + row*82;
      const unlocked = !!progress.data.achievements[a.id];
      this.add.rectangle(x,y,470,62,0x12172d,0.9).setStrokeStyle(2, unlocked?COLORS.green:COLORS.muted, unlocked?0.9:0.28);
      this.add.text(x-215,y-16,`${unlocked?'🏆':'🔒'} ${a.name}`,{fontFamily:'Arial',fontSize:'19px',fontStyle:'bold',color:unlocked?'#ffffff':'#9fb5c8'}).setOrigin(0,0.5);
      this.add.text(x-215,y+12,a.desc,{fontFamily:'Arial',fontSize:'15px',color:unlocked?'#cffff0':'#6f8298'}).setOrigin(0,0.5);
    });
  }
}
