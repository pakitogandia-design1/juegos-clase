export default class HarpoonSystem {
  constructor(scene) {
    this.scene = scene;
    this.group = scene.physics.add.group({ allowGravity: false, immovable: true });
    this.cooldown = 420;
    this.lastShot = 0;
    this.doubleUntil = 0;
    this.pierceNext = false;
    this.fastUntil = 0;
  }

  setFast(ms) { this.fastUntil = this.scene.time.now + ms; }
  setDouble(ms) { this.doubleUntil = this.scene.time.now + ms; }
  setPierce() { this.pierceNext = true; }

  canShoot() {
    const cd = this.scene.time.now < this.fastUntil ? 190 : this.cooldown;
    return this.scene.time.now - this.lastShot > cd;
  }

  shoot(x, y, type) {
    if (!this.canShoot()) return [];
    this.lastShot = this.scene.time.now;
    const offsets = this.scene.time.now < this.doubleUntil ? [-24, 24] : [0];
    const made = [];
    offsets.forEach(off => made.push(this.makeHarpoon(x + off, y, type)));
    this.scene.audioSystem.shoot();
    return made;
  }

  makeHarpoon(x, y, type) {
    const color = type === 'rational' ? 0x7dd3fc : 0xf0abfc;
    const rect = this.scene.add.rectangle(x, y - 155, 7, 310, color, .95);
    rect.setStrokeStyle(2, 0xffffff, .65);
    rect.harpoonType = type;
    rect.pierce = this.pierceNext;
    this.scene.physics.add.existing(rect);
    rect.body.allowGravity = false;
    rect.body.setVelocityY(-430);
    rect.body.setImmovable(true);
    this.group.add(rect);
    this.scene.tweens.add({ targets: rect, alpha:.5, duration:120, yoyo:true, repeat:1 });
    this.scene.time.delayedCall(600, () => rect.active && rect.destroy());
    if (this.pierceNext) this.pierceNext = false;
    return rect;
  }
}
