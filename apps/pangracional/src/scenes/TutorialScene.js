import { addBackground, button } from './ui.js';

export default class TutorialScene extends Phaser.Scene {
  constructor(){ super('TutorialScene'); }
  create(){
    addBackground(this);
    this.step = 0;
    this.done = {};
    this.add.text(480,38,'Tutorial: misión guiada',{fontSize:34,color:'#fff',fontStyle:'bold'}).setOrigin(.5);
    this.info = this.add.text(480,92,'',{fontSize:19,color:'#e0f2fe',align:'center',wordWrap:{width:790},lineSpacing:5}).setOrigin(.5);
    this.player = this.add.rectangle(160,450,34,48,0x38bdf8).setStrokeStyle(2,0xffffff,.6);
    this.ladder = this.add.rectangle(470,365,46,170,0xfacc15,.15).setStrokeStyle(2,0xfacc15,.55);
    this.platform = this.add.rectangle(470,300,260,18,0x23345f,.95).setStrokeStyle(2,0x75e6ff,.65);
    this.bubble = this.add.circle(720,230,38,0x60a5fa,.9).setStrokeStyle(4,0xffffff,.55);
    this.bubbleText = this.add.text(720,230,'1/2',{fontSize:23,color:'#fff',fontStyle:'bold',stroke:'#111827',strokeThickness:4}).setOrigin(.5);
    this.harpoonText = this.add.text(160,500,'Arpón: RACIONAL',{fontSize:16,color:'#7dd3fc',fontStyle:'bold'}).setOrigin(.5);
    this.keys = this.input.keyboard.addKeys('A,D,W,S,SPACE,SHIFT,TAB,ONE,TWO,LEFT,RIGHT,UP,DOWN');
    this.next = button(this,800,500,'Continuar',()=>this.advance(),180);
    button(this,160,500,'Menú',()=>this.scene.start('MenuScene'),160);
    this.advance();
  }

  advance(){
    const texts = [
      '1/12 · Muévete con flechas o A/D. En móvil tendrás botones táctiles. El objetivo es esquivar burbujas y limpiar el nivel.',
      '2/12 · Las escaleras permiten subir y bajar con arriba/abajo. En Pang Racional las plataformas importan para colocarte bien.',
      '3/12 · Tienes dos arpones: RACIONAL e IRRACIONAL. Cambia con Shift, Tab, C, 1 o 2.',
      '4/12 · Un número racional puede escribirse como fracción de enteros. Ejemplos: 1/2, -3, 22/7.',
      '5/12 · Los decimales finitos son racionales: 0,25 y 3,1416 son racionales aunque se parezcan a π.',
      '6/12 · Los decimales periódicos son racionales: 0,121212... o 1,101001101001... repiten bloque.',
      '7/12 · Los irracionales no se pueden escribir como fracción exacta. π, e y raíces no exactas como √2 o √18 son irracionales.',
      '8/12 · Un decimal infinito no periódico es irracional. 1,101001000100001... tiene ceros crecientes, no periodo.',
      '9/12 · Si disparas con el arpón incorrecto, la burbuja no se destruye. Verás feedback, perderás racha y quizá puntos.',
      '10/12 · Las burbujas grandes pueden dividirse en dos más pequeñas. Conservan su misma categoría matemática.',
      '11/12 · Limpia todas las burbujas para superar el nivel. Normal no tiene temporizador; Difícil tiene 99 s; Pesadilla 60 s.',
      '12/12 · Logros y progreso se guardan en localStorage. Ya puedes jugar.'
    ];
    this.step++;
    if (this.step > texts.length) { this.scene.start('MenuScene'); return; }
    this.info.setText(texts[this.step-1]);
    if (this.step === 3) this.harpoonText.setText('Arpón: RACIONAL / IRRACIONAL');
    if (this.step === 5) this.bubbleText.setText('3,1416');
    if (this.step === 7) this.bubbleText.setText('√18');
    if (this.step === 8) this.bubbleText.setText('1,101001000100001...');
    if (this.step === 10) {
      this.tweens.add({targets:this.bubble, scale:.65, yoyo:true, repeat:1, duration:240});
    }
  }
}
