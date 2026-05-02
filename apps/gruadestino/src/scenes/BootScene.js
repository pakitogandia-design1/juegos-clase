import { scenesData } from '../data/scenesData.js';
import { itemsData } from '../data/itemsData.js';

export default class BootScene extends Phaser.Scene {
  constructor(){ super('BootScene'); }
  preload(){
    this.cameras.main.setBackgroundColor('#08090d');
    const { width, height } = this.scale;
    const title = this.add.text(width/2, height/2-30, 'LA GRÚA DEL DESTINO', {fontFamily:'Arial Black', fontSize:'34px', color:'#f2d28a'}).setOrigin(.5);
    this.add.text(width/2, height/2+20, 'Cargando tragicomedia...', {fontFamily:'Arial', fontSize:'18px', color:'#ffffff'}).setOrigin(.5);
    this.load.on('progress', p => title.setText(`LA GRÚA DEL DESTINO\n${Math.round(p*100)}%`));
    const loadImage = (key, url) => this.load.image(key, url);
    loadImage('menu-poster','assets/menu-poster.jpg');
    loadImage('ending-poster','assets/ending-poster.jpg');
    loadImage('placeholder-scene','assets/placeholder-scene.jpg');
    loadImage('protagonista','assets/protagonista.png');
    loadImage('grua','assets/grua.png');
    scenesData.forEach(s => loadImage(s.id, s.bg));
    Object.entries(itemsData).forEach(([key,item]) => loadImage(`item-${key}`, item.icon));
  }
  create(){ this.scene.start('MenuScene'); }
}
