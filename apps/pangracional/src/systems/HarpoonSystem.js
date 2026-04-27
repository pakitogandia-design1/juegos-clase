export default class HarpoonSystem {
  constructor(scene) {
    this.scene = scene;
    this.group = scene.physics.add.group({ allowGravity: false, immovable: true });
    this.cooldown = 420;
    this.shotgunCooldown = 360;
    this.lastShot = 0;
    this.doubleUntil = 0;
    this.pierceNext = false;
    this.fastUntil = 0;
  }

  setFast(ms) { this.fastUntil = this.scene.time.now + ms; }
  setDouble(ms) { this.doubleUntil = this.scene.time.now + ms; }
  setPierce() { this.pierceNext = true; }

  canShoot(cooldown = this.cooldown) {
    const cd = this.scene.time.now < this.fastUntil ? Math.max(160, cooldown * .45) : cooldown;
    return this.scene.time.now - this.lastShot > cd;
  }

  shoot(x, y, type) {
    if (!this.canShoot(this.cooldown)) return [];
    this.lastShot = this.scene.time.now;
    const offsets = this.scene.time.now < this.doubleUntil ? [-24, 24] : [0];
    const made = [];
    offsets.forEach(off => made.push(this.makeHarpoon(x + off, y, type)));
    this.scene.audioSystem.shoot();
    return made;
  }

  shootShotgun(x, y, type, facing = 1) {
    if (!this.canShoot(this.shotgunCooldown)) return [];
    this.lastShot = this.scene.time.now;
    const made = [];
    const spread = [-9, 0, 9];
    spread.forEach((off, index) => made.push(this.makePellet(x + facing * 28, y - 23 + off, type, facing, index)));
    this.scene.audioSystem.shoot();
    return made;
  }

  makeHarpoon(x, y, type) {
    const color = type === 'rational' ? 0x7dd3fc : 0xf0abfc;
    const rect = this.scene.add.rectangle(x, y - 155, 7, 310, color, .95);
    rect.setStrokeStyle(2, 0xffffff, .65);
    rect.attackType = type;
    rect.weaponKind = 'harpoon';
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

  makePellet(x, y, type, facing, index) {
    const color = type === 'rational' ? 0x38bdf8 : 0xe879f9;
    const pellet = this.scene.add.circle(x, y, index === 1 ? 7 : 5, color, .98).setStrokeStyle(2, 0xffffff, .72);
    pellet.attackType = type;
    pellet.weaponKind = 'shotgun';
    pellet.pierce = false;
    this.scene.physics.add.existing(pellet);
    pellet.body.allowGravity = false;
    pellet.body.setCircle(index === 1 ? 7 : 5);
    pellet.body.setVelocity(facing * 560, (index - 1) * 38);
    pellet.body.setImmovable(true);
    this.group.add(pellet);
    this.scene.tweens.add({ targets: pellet, scale: .72, yoyo: true, repeat: 2, duration: 80 });
    this.scene.time.delayedCall(520, () => pellet.active && pellet.destroy());
    return pellet;
  }
}
