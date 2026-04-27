const POWERUPS = [
  {id:'calc', name:'Calculadora Express', icon:'∑'},
  {id:'period', name:'Detector de Periodo', icon:'‾'},
  {id:'shield', name:'Escudo Periódico', icon:'0,3̅'},
  {id:'double', name:'Arpón Doble', icon:'⇈'},
  {id:'freeze', name:'Pi Congelado', icon:'π❄'},
  {id:'pierce', name:'Fracción Imparable', icon:'½'},
  {id:'change', name:'Cambio de Variable', icon:'x↔y'},
  {id:'line', name:'Orden en la Recta', icon:'↔'}
];

export default class PowerUpSystem {
  constructor(scene, rate) {
    this.scene = scene;
    this.rate = rate;
    this.group = scene.physics.add.group({ allowGravity:false });
  }

  maybeDrop(x, y) {
    if (Math.random() > this.rate) return;
    const p = Phaser.Utils.Array.GetRandom(POWERUPS);
    const c = this.scene.add.container(x, y);
    const bg = this.scene.add.circle(0,0,18,0x111827,.92).setStrokeStyle(3,0xfacc15,.9);
    const t = this.scene.add.text(0,0,p.icon,{fontSize:15,fontStyle:'bold',color:'#fde68a'}).setOrigin(.5);
    c.add([bg,t]);
    c.powerId = p.id; c.powerName = p.name;
    this.scene.physics.add.existing(c);
    c.body.allowGravity = false;
    c.body.setVelocityY(45);
    this.group.add(c);
    this.scene.tweens.add({targets:c, angle:360, duration:1600, repeat:-1});
    this.scene.time.delayedCall(9000,()=>c.active&&c.destroy());
  }

  apply(power) {
    const s = this.scene;
    s.audioSystem.power();
    s.floatText(power.x, power.y-20, power.powerName, '#fde68a');
    switch(power.powerId) {
      case 'calc': s.helpUntil = s.time.now + (s.mode.id==='nightmare'?3500:6500); break;
      case 'period': s.periodUntil = s.time.now + 8000; s.flashPeriodic(); break;
      case 'shield': s.shield = true; s.updateHud(); break;
      case 'double': s.harpoons.setDouble(9000); break;
      case 'freeze': s.bubbles.slow(s.mode.id==='nightmare'?2800:5200); break;
      case 'pierce': s.harpoons.setPierce(); break;
      case 'change': s.harpoons.setFast(8000); break;
      case 'line': s.bubbles.slow(4200); s.showNumberLine(); break;
    }
    power.destroy();
  }
}
