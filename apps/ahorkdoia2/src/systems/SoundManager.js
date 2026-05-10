export class SoundManager{
  constructor(save){this.save=save; this.ctx=null; this.musicNodes=null; this.musicKind='';}
  ensure(){ if(!this.ctx) this.ctx=new (window.AudioContext||window.webkitAudioContext)(); if(this.ctx.state==='suspended') this.ctx.resume(); }
  play(type='click'){
    if(!this.save.settings.sound) return; this.ensure(); const ctx=this.ctx; const now=ctx.currentTime;
    const variants={
      click:[[420,.035,'square'],[520,.035,'triangle'],[360,.04,'sine']],
      ok:[[660,.11,'sine'],[740,.1,'triangle'],[590,.12,'sine']],
      bad:[[130,.16,'sawtooth'],[95,.2,'square'],[180,.14,'sawtooth']],
      hurt:[[90,.22,'square'],[70,.28,'sawtooth'],[120,.18,'square']],
      win:[[520,.24,'triangle'],[660,.22,'sine'],[780,.18,'triangle']],
      lose:[[65,.45,'sawtooth'],[55,.5,'square'],[80,.38,'sawtooth']],
      loot:[[880,.18,'sine'],[990,.16,'triangle'],[760,.2,'sine']],
      shop:[[620,.12,'square'],[800,.14,'triangle'],[500,.16,'sine']],
      achievement:[[700,.1,'triangle'],[900,.13,'sine'],[1100,.18,'triangle']]
    };
    const [f,d,w]=Phaser.Utils.Array.GetRandom(variants[type]||variants.click);
    const o=ctx.createOscillator(); const g=ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type=w;
    o.frequency.setValueAtTime(f,now); const down=['bad','hurt','lose'].includes(type); o.frequency.exponentialRampToValueAtTime(Math.max(40,f*(down?0.55:1.65)),now+d);
    g.gain.setValueAtTime(0.0001,now); g.gain.exponentialRampToValueAtTime(0.075,now+0.01); g.gain.exponentialRampToValueAtTime(0.0001,now+d);
    o.start(now); o.stop(now+d+0.02);
  }
  startMusic(kind='menu'){
    if(!this.save.settings.music) {this.stopMusic(); return;} this.ensure(); if(this.musicNodes&&this.musicKind===kind) return; this.stopMusic();
    const ctx=this.ctx; const gain=ctx.createGain(); gain.gain.value=0.018; gain.connect(ctx.destination);
    const base={menu:110,run:82,boss:55,shop:146}[kind]||110;
    const osc1=ctx.createOscillator(), osc2=ctx.createOscillator(), lfo=ctx.createOscillator(), lg=ctx.createGain();
    osc1.type='sawtooth'; osc2.type='triangle'; lfo.type='sine';
    osc1.frequency.value=base; osc2.frequency.value=base*1.5; lfo.frequency.value=0.08; lg.gain.value=base*0.05;
    lfo.connect(lg); lg.connect(osc1.frequency); osc1.connect(gain); osc2.connect(gain); osc1.start(); osc2.start(); lfo.start();
    this.musicNodes={osc1,osc2,lfo,gain}; this.musicKind=kind;
  }
  stopMusic(){ if(this.musicNodes){ Object.values(this.musicNodes).forEach(n=>{try{n.stop&&n.stop(); n.disconnect&&n.disconnect();}catch(e){}}); } this.musicNodes=null; this.musicKind=''; }
}
