export class AudioSystem {
  constructor(){ this.ctx = null; this.enabled = true; }
  ensure(){ if(!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }
  tone(freq=440, dur=.08, type='sine', gain=.08){
    if(!this.enabled) return; this.ensure();
    const o=this.ctx.createOscillator(), g=this.ctx.createGain();
    o.type=type; o.frequency.value=freq; g.gain.value=gain;
    o.connect(g); g.connect(this.ctx.destination); o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime+dur); o.stop(this.ctx.currentTime+dur+.02);
  }
  shoot(){ this.tone(310,.08,'triangle',.06); this.tone(530,.04,'sine',.035); }
  bounce(){ this.tone(760,.04,'square',.035); }
  pop(){ [520,660,820].forEach((f,i)=>setTimeout(()=>this.tone(f,.06,'sine',.06),i*35)); }
  fall(){ this.tone(190,.13,'sawtooth',.04); }
  bad(){ this.tone(130,.18,'sawtooth',.055); }
  win(){ [523,659,784,1046].forEach((f,i)=>setTimeout(()=>this.tone(f,.14,'triangle',.06),i*95)); }
  lose(){ [330,247,196].forEach((f,i)=>setTimeout(()=>this.tone(f,.18,'sawtooth',.055),i*120)); }
}
