export default class Player {
  constructor(scene, x, y, platformSystem) {
    this.scene = scene;
    this.platformSystem = platformSystem;
    this.sprite = scene.physics.add.sprite(x, y, null);
    this.sprite.setSize(32, 48);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.body.setMaxVelocity(260, 650);
    this.facing = 1;
    this.drawSprite();
    scene.physics.add.collider(this.sprite, platformSystem.platforms);
  }

  drawSprite() {
    const g = this.scene.add.graphics();
    g.fillStyle(0x38bdf8, 1); g.fillRoundedRect(0, 14, 32, 34, 10);
    g.fillStyle(0xfef3c7, 1); g.fillCircle(16, 10, 11);
    g.fillStyle(0x111827, 1); g.fillCircle(12, 8, 2); g.fillCircle(20, 8, 2);
    g.fillStyle(0xf59e0b, 1); g.fillRoundedRect(5, 0, 22, 6, 4);
    g.generateTexture('player_tex', 32, 50);
    g.destroy();
    this.sprite.setTexture('player_tex');
  }

  update(cursors, keys, touch) {
    const left = cursors.left.isDown || keys.A.isDown || touch.left;
    const right = cursors.right.isDown || keys.D.isDown || touch.right;
    const up = cursors.up.isDown || keys.W.isDown || touch.up;
    const down = cursors.down.isDown || keys.S.isDown || touch.down;
    const onLadder = this.platformSystem.isOnLadder(this.sprite);

    if (left) { this.sprite.setVelocityX(-210); this.facing = -1; }
    else if (right) { this.sprite.setVelocityX(210); this.facing = 1; }
    else this.sprite.setVelocityX(0);

    if (onLadder && (up || down)) {
      this.sprite.body.allowGravity = false;
      this.sprite.setVelocityY(up ? -150 : 150);
    } else {
      this.sprite.body.allowGravity = true;
    }

    if (!onLadder && (cursors.up.isDown || keys.W.isDown) && this.sprite.body.blocked.down) {
      this.sprite.setVelocityY(-420);
    }
  }
}
