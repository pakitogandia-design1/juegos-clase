import { COLORS, GAME_TITLE, GAME_SUBTITLE } from '../config/gameConfig.js';
import { makeButton } from '../ui/NeonButton.js';
export class BaseScene extends Phaser.Scene {
  drawNeonBackground() {
    this.cameras.main.setBackgroundColor(COLORS.bg);
    for (let i=0;i<70;i++) {
      const x = Math.random()*1280, y = Math.random()*720;
      const dot = this.add.circle(x,y,Math.random()*2+0.5, i%2?COLORS.cyan:COLORS.magenta, 0.25);
      this.tweens.add({targets:dot, alpha:{from:0.15,to:0.65}, duration:1000+Math.random()*1800, yoyo:true, repeat:-1});
    }
    const g = this.add.graphics();
    g.lineStyle(1, COLORS.cyan, 0.12);
    for (let x=0;x<1280;x+=40) g.lineBetween(x,0,x,720);
    for (let y=0;y<720;y+=40) g.lineBetween(0,y,1280,y);
  }
  titleBlock(y=95) {
    this.add.text(640, y, GAME_TITLE, {fontFamily:'Arial', fontSize:'44px', fontStyle:'bold', color:'#ffffff', align:'center'}).setOrigin(0.5).setShadow(0,0,'#00d9ff',18);
    this.add.text(640, y+48, GAME_SUBTITLE, {fontFamily:'Arial', fontSize:'25px', color:'#ffdcff', align:'center'}).setOrigin(0.5).setShadow(0,0,'#ff38d1',12);
  }
  backButton(target='MenuScene') { return makeButton(this, 76, 40, 112, 42, '← MENÚ', ()=>this.scene.start(target), {fontSize:'16px', color:COLORS.cyan}); }
  toast(text, color=COLORS.green) {
    const box = this.add.rectangle(640, 105, 620, 56, 0x02030a, 0.9).setStrokeStyle(3, color, 0.95).setDepth(1000);
    const t = this.add.text(640, 105, text, {fontFamily:'Arial', fontSize:'22px', fontStyle:'bold', color:'#ffffff', align:'center'}).setOrigin(0.5).setDepth(1001).setShadow(0,0,'#ffffff',6);
    this.tweens.add({targets:[box,t], y:'-=20', alpha:0, delay:1600, duration:350, onComplete:()=>{box.destroy();t.destroy();}});
  }
}
