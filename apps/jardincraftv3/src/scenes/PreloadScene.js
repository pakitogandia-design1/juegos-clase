export class PreloadScene extends Phaser.Scene {
  constructor(){ super('PreloadScene'); }
  create(){
    this.cameras.main.setBackgroundColor('#101820');
    this.add.text(640,330,'JardiCraft FP',{fontFamily:'monospace',fontSize:42,color:'#dff2c2'}).setOrigin(.5);
    this.add.text(640,382,'cargando mundo verde',{fontFamily:'monospace',fontSize:20,color:'#8fbf8f'}).setOrigin(.5);
    this.time.delayedCall(450,()=>this.scene.start('MainMenuScene'));
  }
}
