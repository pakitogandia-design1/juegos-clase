export class SoundManager{
  constructor(save){this.save=save; this.ctx=null;}
  ensure(){ if(!this.ctx) this.ctx=new (window.AudioContext||window.webkitAudioContext)(); }
  play(type='click'){ if(!this.save.settings.sound) return; this.ensure(); const ctx=this.ctx; const o=ctx.createOscillator(); const g=ctx.createGain(); o.connect(g); g.connect(ctx.destination); const now=ctx.currentTime; const map={click:[420,0.04,'square'],ok:[660,0.12,'sine'],bad:[120,0.18,'sawtooth'],hurt:[90,0.22,'square'],win:[520,0.25,'triangle'],lose:[65,0.45,'sawtooth'],loot:[880,0.18,'sine']}; const [f,d,w]=map[type]||map.click; o.type=w; o.frequency.setValueAtTime(f,now); o.frequency.exponentialRampToValueAtTime(Math.max(40,f*1.8),now+d); g.gain.setValueAtTime(0.0001,now); g.gain.exponentialRampToValueAtTime(0.08,now+0.01); g.gain.exponentialRampToValueAtTime(0.0001,now+d); o.start(now); o.stop(now+d+0.02); }
}
