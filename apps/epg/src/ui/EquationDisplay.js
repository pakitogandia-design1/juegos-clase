import { COLORS } from '../config/gameConfig.js';
export class EquationDisplay {
  constructor(scene, x, y) {
    this.scene = scene; this.x = x; this.y = y; this.objects = [];
    this.topText = scene.add.text(x, 58, '', { fontFamily:'Arial', fontSize:'42px', fontStyle:'bold', color:'#ffffff' }).setOrigin(0.5).setShadow(0,0,'#00d9ff',12);
  }
  clearTerms() { this.objects.forEach(o=>o.destroy()); this.objects = []; }
  render(eq) {
    this.topText.setText(eq.toText());
    this.clearTerms();
    this.renderSide(eq.visualTerms('left'), 330, this.y, 'left');
    this.renderSide(eq.visualTerms('right'), 950, this.y, 'right');
  }
  renderSide(terms, cx, cy, side) {
    const gap = 142;
    const start = cx - (terms.length - 1) * gap / 2;
    terms.forEach((term, i) => {
      const x = start + i * gap;
      const color = term.kind === 'x' ? COLORS.magenta : (term.positive ? COLORS.green : COLORS.orange);
      const cont = this.scene.add.container(x, cy);
      const w = term.kind === 'x' ? 118 : 104;
      const h = term.kind === 'x' ? 92 : 78;
      const shape = this.scene.add.rectangle(0, 0, w, h, term.kind === 'x' ? 0x24113a : 0x10281d, 0.88).setStrokeStyle(4, color, 0.95);
      const glow = this.scene.add.rectangle(0, 0, w+10, h+10, color, 0.08).setStrokeStyle(1, color, 0.4);
      const txt = this.scene.add.text(0, 0, term.text, { fontFamily:'Arial', fontSize: term.kind === 'x' ? '38px' : '34px', fontStyle:'bold', color:'#ffffff' }).setOrigin(0.5).setShadow(0,0,Phaser.Display.Color.IntegerToColor(color).rgba,10);
      cont.add([glow, shape, txt]); cont.termKind = term.kind; cont.side = side;
      this.objects.push(cont);
      this.scene.tweens.add({ targets: cont, y: cy - 5, yoyo: true, repeat: -1, duration: 1500 + i*180, ease: 'Sine.easeInOut' });
    });
  }
  pulseEquation() {
    this.scene.tweens.add({ targets: this.topText, scale: 1.08, yoyo: true, duration: 120 });
  }
}
