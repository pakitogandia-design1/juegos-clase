import { getNumber } from '../data/numbers.js';

const COLORS = [0xff6b6b,0x60a5fa,0xfacc15,0x34d399,0xfb7185,0xa78bfa,0x22d3ee,0xf97316];

export default class BubbleSystem {
  constructor(scene, level, mode) {
    this.scene = scene;
    this.level = level;
    this.mode = mode;
    this.group = scene.physics.add.group({
      allowGravity: true,
      collideWorldBounds: true
    });
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

  makeTexture(radius, color) {
    const key = `bubble_${radius}_${color.toString(16)}`;
    if (this.scene.textures.exists(key)) return key;

    const size = radius * 2 + 10;
    const g = this.scene.add.graphics();
    g.fillStyle(color, .93);
    g.fillCircle(size / 2, size / 2, radius);
    g.lineStyle(4, 0xffffff, .62);
    g.strokeCircle(size / 2, size / 2, radius);
    g.fillStyle(0xffffff, .26);
    g.fillCircle(size / 2 - radius * .28, size / 2 - radius * .28, Math.max(5, radius * .23));
    g.generateTexture(key, size, size);
    g.destroy();
    return key;
  }

  spawn(category, kind, size, x, y, forcedLabel = null, vxSign = null) {
    const number = forcedLabel ? this.forcedNumber(forcedLabel, category, kind) : getNumber(category, [kind]);
    const radius = [0,0,23,32,43][size] || 28;
    const color = Phaser.Utils.Array.GetRandom(COLORS);
    const key = this.makeTexture(radius, color);

    const bubble = this.scene.physics.add.image(x, y, key);
    bubble.setCircle(radius, 5, 5);
    bubble.setBounce(1, .96);
    bubble.setCollideWorldBounds(true);
    bubble.body.onWorldBounds = true;
    bubble.body.setAllowGravity(true);
    bubble.body.setDrag(0, 0);
    bubble.body.setFriction(0, 0);
    bubble.body.setMaxVelocity(520, 840);

    const sign = vxSign || Phaser.Utils.Array.GetRandom([-1, 1]);
    const vx = sign * Phaser.Math.Between(115, 175) * this.mode.bubbleSpeed;
    const vy = -Phaser.Math.Between(240, 380);
    bubble.setVelocity(vx, vy);

    bubble.radius = radius;
    bubble.sizeLevel = size;
    bubble.category = category;
    bubble.number = number;
    bubble.baseColor = color;

    const fontSize = number.label.length > 12 ? 12 : (number.label.length > 7 ? 15 : 19);
    bubble.label = this.scene.add.text(x, y, number.label, {
      fontFamily: 'Arial',
      fontSize,
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#111827',
      strokeThickness: 4
    }).setOrigin(.5).setDepth(12);

    this.group.add(bubble);

    this.scene.tweens.add({
      targets: bubble,
      scaleX: 1.04,
      scaleY: .96,
      yoyo: true,
      repeat: -1,
      duration: 900 + Math.random() * 500
    });

    bubble.once('destroy', () => {
      if (bubble.label && bubble.label.active) bubble.label.destroy();
    });

    return bubble;
  }

  syncLabels() {
    this.group.getChildren().forEach(b => {
      if (b.active && b.label) {
        b.label.setPosition(b.x, b.y);
        b.label.setScale(b.scaleX, b.scaleY);
      }
    });
  }

  splitBubble(bubble) {
    if (bubble.sizeLevel <= 2) return;
    const newSize = bubble.sizeLevel - 1;
    this.spawn(bubble.category, bubble.number.kind, newSize, bubble.x - 14, bubble.y - 12, bubble.number.label, -1);
    this.spawn(bubble.category, bubble.number.kind, newSize, bubble.x + 14, bubble.y - 12, bubble.number.label, 1);
  }

  remaining() {
    return this.group.getChildren().filter(b => b.active).length;
  }

  slow(ms) {
    this.group.getChildren().forEach(b => {
      b.body.velocity.x *= .52;
      b.body.velocity.y *= .6;
      this.scene.tweens.add({targets:b, alpha:.72, yoyo:true, repeat:5, duration:120});
      if (b.label) this.scene.tweens.add({targets:b.label, alpha:.72, yoyo:true, repeat:5, duration:120});
    });
    this.scene.time.delayedCall(ms, () => {
      this.group.getChildren().forEach(b => {
        if (b.active) b.body.velocity.x *= 1.35;
      });
    });
  }

  destroyBubble(bubble) {
    if (bubble.label && bubble.label.active) bubble.label.destroy();
    bubble.destroy();
  }
}
