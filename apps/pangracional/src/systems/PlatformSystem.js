export default class PlatformSystem {
  constructor(scene, level) {
    this.scene = scene;
    this.platforms = scene.physics.add.staticGroup();
    this.ladders = [];
    this.draw(level);
  }

  draw(level) {
    const g = this.scene.add.graphics();
    g.fillStyle(0x5eead4, .20);
    g.lineStyle(2, 0x7dd3fc, .55);
    level.platforms.forEach(p => {
      const rect = this.scene.add.rectangle(p.x, p.y, p.w, p.h, 0x23345f, .95).setStrokeStyle(2, 0x75e6ff, .65);
      this.scene.physics.add.existing(rect, true);
      this.platforms.add(rect);
      g.fillRoundedRect(p.x-p.w/2, p.y-p.h/2, p.w, p.h, 8);
    });
    (level.ladders || []).forEach(l => {
      const r = this.scene.add.rectangle(l.x, l.y + l.h/2, 46, l.h, 0xfcd34d, .12).setStrokeStyle(2, 0xfacc15, .35);
      this.ladders.push(new Phaser.Geom.Rectangle(l.x-23, l.y, 46, l.h));
      for (let yy = l.y + 12; yy < l.y + l.h; yy += 24) {
        this.scene.add.line(0,0,l.x-18,yy,l.x+18,yy,0xfacc15,.5).setOrigin(0);
      }
      this.scene.add.line(0,0,l.x-18,l.y,l.x-18,l.y+l.h,0xfacc15,.4).setOrigin(0);
      this.scene.add.line(0,0,l.x+18,l.y,l.x+18,l.y+l.h,0xfacc15,.4).setOrigin(0);
    });
  }

  isOnLadder(sprite) {
    return this.ladders.some(l => Phaser.Geom.Rectangle.Contains(l, sprite.x, sprite.y + 8));
  }
}
