import { SaveSystem } from '../systems/SaveSystem.js';

export class MainMenuScene extends Phaser.Scene {
  constructor(){ super('MainMenuScene'); }
  create(){
    this.cameras.main.setBackgroundColor('#101820');
    this.drawBackground();
    this.add.text(640,95,'JardiCraft FP',{fontFamily:'monospace',fontSize:58,color:'#d9f7b7',stroke:'#142316',strokeThickness:8}).setOrigin(.5);
    this.add.text(640,148,'Minecraft de jardineria en 2D pseudo-voxel',{fontFamily:'monospace',fontSize:20,color:'#9ecb8b'}).setOrigin(.5);
    const has=SaveSystem.hasSave();
    const buttons=[];
    if(has) buttons.push(['Continuar Aventura Verde',()=>this.startGame('adventure',true)]);
    buttons.push(['Nueva Aventura Verde',()=>this.confirmNew()]);
    buttons.push(['Modo Creativo',()=>this.startGame('creative',false)]);
    buttons.push(['Colecciones y logros',()=>this.startGame('gallery',true)]);
    buttons.push(['Ajustes',()=>this.showInfo('Ajustes disponibles dentro del juego: volumen, interfaz y confirmaciones.')]);
    buttons.push(['Creditos',()=>this.showInfo('Juego original para FP. Assets generados por codigo. Sin recursos oficiales de Minecraft.')]);
    buttons.forEach((b,i)=>this.button(640,245+i*58,360,44,b[0],b[1]));
    this.add.text(640,670,'WASD o flechas para moverte. Ratón o toque para seleccionar. E abre inventario. Esc pausa.',{fontFamily:'monospace',fontSize:16,color:'#789a83'}).setOrigin(.5);
  }
  drawBackground(){
    for(let y=0;y<9;y++) for(let x=0;x<17;x++){ const img=this.add.image(60+x*78,70+y*70,'block_'+(['grass','dirt','fertile','path'][Math.floor(Math.random()*4)])).setAlpha(.13).setScale(.8); img.y+=x%2*16; }
  }
  button(x,y,w,h,label,cb){
    const g=this.add.graphics(); g.fillStyle(0x22342c,.95); g.fillRoundedRect(x-w/2,y-h/2,w,h,7); g.lineStyle(2,0x7aa35d,1); g.strokeRoundedRect(x-w/2,y-h/2,w,h,7);
    const t=this.add.text(x,y,label,{fontFamily:'monospace',fontSize:20,color:'#f1ffd7'}).setOrigin(.5);
    const zone=this.add.zone(x,y,w,h).setInteractive({useHandCursor:true}); zone.on('pointerover',()=>{g.clear();g.fillStyle(0x36583c,.98);g.fillRoundedRect(x-w/2,y-h/2,w,h,7);g.lineStyle(2,0xbde07a,1);g.strokeRoundedRect(x-w/2,y-h/2,w,h,7);});
    zone.on('pointerout',()=>{g.clear();g.fillStyle(0x22342c,.95);g.fillRoundedRect(x-w/2,y-h/2,w,h,7);g.lineStyle(2,0x7aa35d,1);g.strokeRoundedRect(x-w/2,y-h/2,w,h,7);});
    zone.on('pointerdown',cb); return {g,t,zone};
  }
  showInfo(msg){
    if(this.infoBox) this.infoBox.destroy(true);
    this.infoBox=this.add.container(640,560); const bg=this.add.graphics(); bg.fillStyle(0x0d1518,.94); bg.fillRoundedRect(-430,-42,860,84,8); bg.lineStyle(2,0x90b96c,1); bg.strokeRoundedRect(-430,-42,860,84,8);
    const tx=this.add.text(0,0,msg,{fontFamily:'monospace',fontSize:17,color:'#dbeabf',align:'center',wordWrap:{width:800}}).setOrigin(.5);
    this.infoBox.add([bg,tx]);
  }
  confirmNew(){
    if(SaveSystem.hasSave()) this.showInfo('Pulsa otra vez Nueva Aventura Verde para sobrescribir la partida guardada.');
    const old=this.confirmNew; this.confirmNew=()=>{SaveSystem.clear(); this.startGame('adventure',false);}; this.time.delayedCall(3500,()=>{this.confirmNew=old.bind(this);});
  }
  startGame(mode, load){
    if(mode==='gallery'){ this.scene.start('GameScene',{mode:'adventure',load:true,open:'achievements'}); return; }
    this.scene.start('GameScene',{mode,load});
  }
}
