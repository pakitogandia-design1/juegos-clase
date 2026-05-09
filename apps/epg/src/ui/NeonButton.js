import { COLORS } from '../config/gameConfig.js';
export function makeButton(scene, x, y, w, h, label, onClick, options = {}) {
  const color = options.color || COLORS.cyan;
  const fill = options.fill || COLORS.panel2;
  const container = scene.add.container(x, y);
  const bg = scene.add.rectangle(0, 0, w, h, fill, 0.92).setStrokeStyle(2, color, 0.9);
  const glow = scene.add.rectangle(0, 0, w + 6, h + 6, color, 0.05).setStrokeStyle(1, color, 0.35);
  const text = scene.add.text(0, 0, label, { fontFamily:'Arial', fontSize: options.fontSize || '22px', color: '#f4fbff', align:'center', fontStyle: options.bold ? 'bold' : 'normal' }).setOrigin(0.5);
  container.add([glow, bg, text]);
  container.setSize(w, h).setInteractive({ useHandCursor: true });
  container.on('pointerover', () => { bg.setFillStyle(color, 0.22); scene.tweens.add({ targets: container, scale: 1.03, duration: 90 }); });
  container.on('pointerout', () => { bg.setFillStyle(fill, 0.92); scene.tweens.add({ targets: container, scale: 1, duration: 90 }); });
  container.on('pointerdown', () => { scene.tweens.add({ targets: container, scale: 0.96, yoyo: true, duration: 70 }); onClick?.(); });
  container.bg = bg; container.label = text;
  container.setActiveState = (active) => {
    bg.setFillStyle(active ? color : fill, active ? 0.38 : 0.92);
    bg.setStrokeStyle(active ? 4 : 2, color, active ? 1 : 0.8);
  };
  return container;
}
