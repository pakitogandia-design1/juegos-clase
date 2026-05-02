export default class CreditsScene extends Phaser.Scene {
  constructor(){ super('CreditsScene'); }
  create(){
    const w=this.scale.width,h=this.scale.height;
    this.add.image(w/2,h/2,'menu-poster').setDisplaySize(w,h).setAlpha(.55);
    this.add.rectangle(w/2,h/2,w,h,0x000000,.65);
    this.add.text(w/2,h*.16,'CRÉDITOS',{fontFamily:'Arial Black',fontSize:'42px',color:'#f2d28a'}).setOrigin(.5);
    this.add.text(w/2,h*.42,'LA GRÚA DEL DESTINO\n\nDiseño narrativo, estructura jugable y dirección artística: ChatGPT\nHistoria base e inspiración tragicómica: Fran\nMotor: Phaser 3 desde CDN\nFormato: GitHub Pages, HTML5, JavaScript modular\n\nNinguna casa contenedor fue emocionalmente reparada durante la creación de este juego.',{fontFamily:'Arial',fontSize:Math.min(21,w/35)+'px',color:'#fff',align:'center',wordWrap:{width:w*.82},lineSpacing:6}).setOrigin(.5);
    const r=this.add.rectangle(w/2,h*.82,260,52,0x17191f,.96).setStrokeStyle(2,0xd6b56d).setInteractive({useHandCursor:true});
    this.add.text(w/2,h*.82,'Volver al menú',{fontFamily:'Arial Black',fontSize:'18px',color:'#fff'}).setOrigin(.5);
    r.on('pointerdown',()=>this.scene.start('MenuScene'));
  }
}
