export class SoundSystem {
  constructor(scene){ this.scene=scene; this.muted=false; this.sfxVolume=.18; this.musicVolume=.08; this.ctx=null; }
  ensure(){ if(!this.ctx) this.ctx = new (window.AudioContext||window.webkitAudioContext)(); }
  beep(type='click'){
    if(this.muted) return;
    try{
      this.ensure();
      const map={click:[420,.03,'square'],back:[250,.04,'triangle'],buy:[660,.09,'sine'],ok:[520,.08,'sine'],bad:[140,.09,'sawtooth'],water:[330,.06,'sine'],dig:[180,.05,'square'],plant:[620,.08,'triangle'],ach:[720,.12,'sine'],block:[220,.04,'square']};
      const [freq,dur,wave]=map[type]||map.click;
      const osc=this.ctx.createOscillator(); const gain=this.ctx.createGain();
      osc.type=wave; osc.frequency.value=freq; gain.gain.value=this.sfxVolume;
      osc.connect(gain); gain.connect(this.ctx.destination); osc.start(); gain.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+dur); osc.stop(this.ctx.currentTime+dur+.02);
    }catch(e){}
  }
}
