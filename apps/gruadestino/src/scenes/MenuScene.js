const SAVE_KEY = 'la-grua-del-destino-save';

export default class MenuScene extends Phaser.Scene {
  constructor(){ super('MenuScene'); }
  create(){
    this.draw();
    this.scale.on('resize', this.draw, this);
  }
  draw(){
    this.children.removeAll();
    const w=this.scale.width, h=this.scale.height;
    this.add.image(w/2,h/2,'menu-poster').setDisplaySize(w,h).setAlpha(.88);
    this.add.rectangle(w/2,h/2,w,h,0x000000,.35);
    this.add.text(w/2, h*.16, 'LA GRÚA\nDEL DESTINO', {fontFamily:'Arial Black', fontSize: Math.min(72,w/8)+'px', color:'#f1e2b8', align:'center', stroke:'#111', strokeThickness:8}).setOrigin(.5);
    this.add.text(w/2, h*.32, 'Aventura gráfica hiperrealista de ruina logística, vivienda china y FP Básica.', {fontFamily:'Arial', fontSize: Math.min(22,w/38)+'px', color:'#ffffff', align:'center', wordWrap:{width:w*.82}}).setOrigin(.5);
    const hasSave = !!localStorage.getItem(SAVE_KEY);
    const buttons = [
      {label: hasSave ? 'Continuar partida' : 'Empezar partida', action:()=>this.scene.start('GameScene',{continue:hasSave})},
      {label:'Nueva partida', action:()=>{localStorage.removeItem(SAVE_KEY); this.scene.start('GameScene',{newGame:true});}},
      {label:'Instrucciones', action:()=>this.showInstructions()},
      {label:'Créditos', action:()=>this.scene.start('CreditsScene')}
    ];
    buttons.forEach((b,i)=>this.button(w/2, h*.48+i*64, Math.min(420,w*.78), 48, b.label, b.action));
    if (h>w) this.add.text(w/2,h-34,'Para una experiencia más cinematográfica, gira el móvil.',{fontFamily:'Arial',fontSize:'15px',color:'#f2d28a'}).setOrigin(.5);
  }
  button(x,y,w,h,label,cb){
    const r=this.add.rectangle(x,y,w,h,0x17191f,.92).setStrokeStyle(2,0xd6b56d).setInteractive({useHandCursor:true});
    const t=this.add.text(x,y,label,{fontFamily:'Arial Black',fontSize:'18px',color:'#fff'}).setOrigin(.5);
    r.on('pointerdown',()=>{ this.tweens.add({targets:[r,t],scale:.97,duration:80,yoyo:true}); cb(); });
  }
  showInstructions(){
    const w=this.scale.width,h=this.scale.height;
    const box=this.add.rectangle(w/2,h/2,w*.86,h*.72,0x08090d,.95).setStrokeStyle(2,0xd6b56d).setInteractive();
    const txt='CÓMO JUGAR\n\n1. Elige una acción: Mirar, Usar, Hablar o Coger.\n2. Toca/clica un hotspot de la escena.\n3. Selecciona objetos del inventario y úsalos con elementos.\n4. Resuelve cada escena para avanzar.\n5. La partida se guarda automáticamente.\n\nConsejo: si algo parece mala idea, probablemente sea obligatorio.';
    this.add.text(w/2,h/2-20,txt,{fontFamily:'Arial',fontSize:Math.min(22,w/32)+'px',color:'#fff',align:'center',wordWrap:{width:w*.74}}).setOrigin(.5);
    this.button(w/2,h*.82,220,46,'Cerrar',()=>this.draw());
  }
}
