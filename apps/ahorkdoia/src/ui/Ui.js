export function bg(scene){
  const {width:w,height:h}=scene.scale; scene.add.rectangle(0,0,w,h,0x050714).setOrigin(0);
  for(let i=0;i<60;i++){ const x=Math.random()*w,y=Math.random()*h; scene.add.circle(x,y,Math.random()*2+0.5,0x31f7ff,0.35); }
  scene.add.rectangle(w/2,h/2,w*0.92,h*0.9,0x0b1024,0.82).setStrokeStyle(2,0x31f7ff,0.7);
}
export function title(scene,txt,sub=''){ const w=scene.scale.width; scene.add.text(w/2,38,txt,{fontSize:'34px',fontStyle:'900',color:'#eaf7ff',stroke:'#ff3df2',strokeThickness:3}).setOrigin(.5); if(sub) scene.add.text(w/2,78,sub,{fontSize:'15px',color:'#7df9ff'}).setOrigin(.5); }
export function button(scene,x,y,w,h,label,cb,opts={}){ const r=scene.add.rectangle(x,y,w,h,opts.fill||0x101b3d,0.96).setStrokeStyle(2,opts.stroke||0x31f7ff,1).setInteractive({useHandCursor:true}); const t=scene.add.text(x,y,label,{fontSize:opts.size||'18px',align:'center',color:opts.color||'#eaf7ff',fontStyle:'700',wordWrap:{width:w-18}}).setOrigin(.5); r.on('pointerover',()=>{r.setFillStyle(0x1f2d64); scene.tweens.add({targets:[r,t],scale:1.035,duration:90});}); r.on('pointerout',()=>{r.setFillStyle(opts.fill||0x101b3d); scene.tweens.add({targets:[r,t],scale:1,duration:90});}); r.on('pointerdown',()=>{scene.sounder?.play('click'); cb&&cb();}); return {r,t,destroy(){r.destroy();t.destroy();}} }
export function back(scene,target='MenuScene'){button(scene,76,scene.scale.height-38,120,42,'← Menú',()=>scene.scene.start(target),{size:'15px'});}
export function panel(scene,x,y,w,h){return scene.add.rectangle(x,y,w,h,0x08122b,0.92).setStrokeStyle(1,0x7df9ff,.65)}
export function small(scene,x,y,txt,color='#a9c8ff'){return scene.add.text(x,y,txt,{fontSize:'14px',color,wordWrap:{width:scene.scale.width-80}})}
