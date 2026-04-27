export function addBackground(scene) {
  const w = scene.scale.width, h = scene.scale.height;
  scene.add.rectangle(w/2,h/2,w,h,0x0f172a);
  for (let i=0;i<34;i++) {
    const x = Phaser.Math.Between(0,w), y = Phaser.Math.Between(0,h);
    const s = Phaser.Math.Between(1,3);
    const dot = scene.add.circle(x,y,s,0x7dd3fc,Phaser.Math.FloatBetween(.12,.38));
    scene.tweens.add({targets:dot, y:y-Phaser.Math.Between(12,36), alpha:.05, yoyo:true, repeat:-1, duration:Phaser.Math.Between(1600,3600)});
  }
  const titleGlow = scene.add.circle(w*.5, h*.15, 190, 0x3b82f6, .08);
  scene.tweens.add({targets:titleGlow, scale:1.18, alpha:.14, yoyo:true, repeat:-1, duration:2200});
}

export function button(scene, x, y, text, cb, width=260) {
  const c = scene.add.container(x,y);
  const bg = scene.add.rectangle(0,0,width,48,0x1f2a4a,.96).setStrokeStyle(2,0x7dd3fc,.75);
  const tx = scene.add.text(0,0,text,{fontSize:20,color:'#f8fafc',fontStyle:'bold'}).setOrigin(.5);
  c.add([bg,tx]).setSize(width,48).setInteractive({useHandCursor:true});
  c.on('pointerover',()=>{ bg.setFillStyle(0x334155); scene.tweens.add({targets:c, scale:1.04, duration:90});});
  c.on('pointerout',()=>{ bg.setFillStyle(0x1f2a4a); scene.tweens.add({targets:c, scale:1, duration:90});});
  c.on('pointerdown',()=>{ scene.soundClick?.(); cb();});
  return c;
}

export function panel(scene, x, y, w, h, color=0x111827) {
  return scene.add.rectangle(x,y,w,h,color,.88).setStrokeStyle(2,0x60a5fa,.35);
}
