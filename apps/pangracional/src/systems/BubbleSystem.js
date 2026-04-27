import { getNumber } from '../data/numbers.js';

const COLORS = [0xff6b6b,0x60a5fa,0xfacc15,0x34d399,0xfb7185,0xa78bfa,0x22d3ee,0xf97316];

export default class BubbleSystem {
  constructor(scene, level, mode) {
    this.scene = scene;
    this.level = level;
    this.mode = mode;
    this.group = scene.physics.add.group();
    this.createInitial();
  }

  createInitial() {
    this.level.bubbles.forEach((b, index) => {
      let [category, kind, size, x, y] = b;
      let forced = null;
      if (this.level.specials) {
        const specials = ['22/7','3,1416','π','1,101001101001...','1,101001000100001...'];
        forced = specials[index] || null;
      }
      this.spawn(category, kind, size, x, y, forced);
    });
  }

  forcedNumber(label, category, kind) {
    const tip = category === 'rational' ? 'Clasificación racional correcta' : 'Clasificación irracional correcta';
    const map = {
      '22/7': {label:'22/7', kind:'fraction', tip:'22/7 es fracción: racional'},
      '3,1416': {label:'3,1416', kind:'finite', tip:'Decimal finito: racional'},
      'π': {label:'π', kind:'pi', tip:'π es irracional'},
      '1,101001101001...': {label:'1,101001101001...', kind:'periodic', tip:'Bloque repetido: racional'},
      '1,101001000100001...': {label:'1,101001000100001...', kind:'nonperiodic', tip:'Infinito sin periodo: irracional'}
    };
    return map[label] || {label, kind, tip};
  }

  spawn(category, kind, size, x, y, forcedLabel = null, vxSign = null) {
    const number = forcedLabel ? this.forcedNumber(forcedLabel, category, kind) : getNumber(category, [kind]);
    const radius = [0,0,23,32,43][size] || 28;
    const color = Phaser.Utils.Array.GetRandom(COLORS);
    const c = this.scene.add.container(x, y);
    const circle = this.scene.add.circle(0,0,radius,color,.93).setStrokeStyle(4,0xffffff,.6);
    const shine = this.scene.add.circle(-radius*.28,-radius*.25,radius*.23,0xffffff,.28);
    const fontSize = number.label.length > 12 ? 12 : (number.label.length > 7 ? 15 : 19);
    const text = this.scene.add.text(0,0,number.label,{fontFamily:'Arial',fontSize, color:'#ffffff', fontStyle:'bold', align:'center', stroke:'#111827', strokeThickness:4}).setOrigin(.5);
    c.add([circle, shine, text]);
    c.radius = radius;
    c.sizeLevel = size;
    c.category = category;
    c.number = number;
    c.baseColor = color;
    this.scene.physics.add.existing(c);
    c.body.setCircle(radius, -radius, -radius);
    c.body.setBounce(1, .94);
    c.body.setCollideWorldBounds(true);
    const sign = vxSign || Phaser.Utils.Array.GetRandom([-1,1]);
    c.body.setVelocity(sign * Phaser.Math.Between(95,145) * this.mode.bubbleSpeed, -Phaser.Math.Between(120,260));
    c.body.setMaxVelocity(430, 780);
    this.group.add(c);
    this.scene.tweens.add({ targets:c, scaleX:1.04, scaleY:.96, yoyo:true, repeat:-1, duration:900 + Math.random()*500 });
    return c;
  }

  splitBubble(bubble) {
    if (bubble.sizeLevel <= 2) return;
    const newSize = bubble.sizeLevel - 1;
    this.spawn(bubble.category, bubble.number.kind, newSize, bubble.x-12, bubble.y-10, bubble.number.label, -1);
    this.spawn(bubble.category, bubble.number.kind, newSize, bubble.x+12, bubble.y-10, bubble.number.label, 1);
  }

  remaining() {
    return this.group.getChildren().filter(b => b.active).length;
  }

  slow(ms) {
    this.group.getChildren().forEach(b => {
      b.body.velocity.x *= .52;
      b.body.velocity.y *= .6;
      this.scene.tweens.add({targets:b, alpha:.72, yoyo:true, repeat:5, duration:120});
    });
    this.scene.time.delayedCall(ms, () => {
      this.group.getChildren().forEach(b => {
        if (b.active) {
          b.body.velocity.x *= 1.35;
        }
      });
    });
  }
}
