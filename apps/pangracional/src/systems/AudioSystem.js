export default class AudioSystem {
  constructor(scene) {
    this.scene = scene;
    this.ctx = null;
  }
  ensure() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }
  beep(freq=440, dur=.08, type='sine', gain=.04) {
    try {
      this.ensure();
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.value = gain;
      o.connect(g); g.connect(this.ctx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
      o.stop(this.ctx.currentTime + dur);
    } catch(e) {}
  }
  shoot(){ this.beep(520,.05,'square',.035); }
  ok(){ this.beep(760,.08,'triangle',.05); setTimeout(()=>this.beep(980,.07,'triangle',.04),45); }
  bad(){ this.beep(150,.14,'sawtooth',.04); }
  hurt(){ this.beep(90,.22,'sawtooth',.055); }
  power(){ this.beep(660,.07,'sine',.05); setTimeout(()=>this.beep(990,.1,'sine',.04),70); }
  win(){ [520,660,780,1040].forEach((f,i)=>setTimeout(()=>this.beep(f,.1,'triangle',.05), i*70)); }
}
