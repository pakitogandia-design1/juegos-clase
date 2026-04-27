export default class BootScene extends Phaser.Scene {
  constructor(){ super('BootScene'); }
  preload(){
    this.load.on('complete',()=>this.scene.start('MenuScene'));
  }
  create(){
    const g = this.add.graphics();
    g.fillStyle(0xffffff,1);
    g.fillCircle(16,16,16);
    g.generateTexture('particle',32,32);
    g.clear();
    g.fillStyle(0x7dd3fc,1);
    g.fillRoundedRect(0,0,24,24,6);
    g.generateTexture('spark',24,24);
    g.destroy();
    this.scene.start('MenuScene');
  }
}
