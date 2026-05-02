export default class EndingScene extends Phaser.Scene {
  constructor(){ super('EndingScene'); }
  create(){ this.draw(); this.scale.on('resize', this.draw, this); }
  draw(){
    this.children.removeAll();
    const w=this.scale.width,h=this.scale.height;
    this.add.image(w/2,h/2,'ending-poster').setDisplaySize(w,h).setAlpha(.86);
    this.add.rectangle(w/2,h/2,w,h,0x000000,.52);
    this.add.text(w/2,h*.18,'FINAL', {fontFamily:'Arial Black',fontSize:Math.min(54,w/8)+'px',color:'#f2d28a',stroke:'#000',strokeThickness:8}).setOrigin(.5);
    this.add.text(w/2,h*.38,'“Por muy mal que te vaya la vida,\npiensa que siempre te puede ir peor”.', {fontFamily:'Georgia',fontSize:Math.min(42,w/12)+'px',color:'#ffffff',align:'center',fontStyle:'bold',wordWrap:{width:w*.86},stroke:'#000',strokeThickness:6}).setOrigin(.5);
    this.add.text(w/2,h*.58,'El protagonista aprendió que la esperanza puede venir en contenedor, la ruina en factura y el destino en forma de aula.', {fontFamily:'Arial',fontSize:Math.min(22,w/34)+'px',color:'#f6e7bd',align:'center',wordWrap:{width:w*.78}}).setOrigin(.5);
    this.button(w/2,h*.72,300,50,'Ver epílogo',()=>this.showEpilogue());
    this.button(w/2,h*.81,300,50,'Volver a empezar',()=>{ localStorage.removeItem('la-grua-del-destino-save'); this.scene.start('MenuScene'); });
  }
  button(x,y,w,h,label,cb){
    const r=this.add.rectangle(x,y,w,h,0x17191f,.96).setStrokeStyle(2,0xd6b56d).setInteractive({useHandCursor:true});
    this.add.text(x,y,label,{fontFamily:'Arial Black',fontSize:'18px',color:'#fff'}).setOrigin(.5);
    r.on('pointerdown',cb);
  }
  showEpilogue(){
    const w=this.scale.width,h=this.scale.height;
    const box=this.add.rectangle(w/2,h/2,Math.min(760,w*.9),Math.min(420,h*.68),0x08090d,.96).setStrokeStyle(2,0xd6b56d).setInteractive();
    this.add.text(w/2,h/2-60,'EPÍLOGO', {fontFamily:'Arial Black',fontSize:'28px',color:'#f2d28a'}).setOrigin(.5);
    this.add.text(w/2,h/2+10,'Meses después, el hombre descubrió una oferta irresistible: “casa submarina prefabricada con entrega inmediata”.\n\nPor primera vez en mucho tiempo, sonrió.\n\nEl destino también.', {fontFamily:'Arial',fontSize:Math.min(23,w/34)+'px',color:'#fff',align:'center',wordWrap:{width:Math.min(650,w*.78)}}).setOrigin(.5);
    this.button(w/2,h/2+145,220,46,'Cerrar',()=>this.draw());
  }
}
