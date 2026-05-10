import { ALL_WORDS, WORD_BANKS } from '../data/words.js';
export class WordManager{
  constructor(save,rng){this.save=save; this.rng=rng;}
  pickWord({categoryKey='jardineria', difficulty='normal', act=1}={}){
    let key=categoryKey==='loteria'?this.rng.pick(Object.keys(WORD_BANKS)):categoryKey;
    const recent=(this.save.recentWords||[]).slice(-140);
    const desired = difficulty==='hard' ? Math.min(3, Math.max(2, Math.ceil(act/2))) : Math.min(3, Math.max(1, Math.ceil(act/2)));
    let pool=(WORD_BANKS[key]||ALL_WORDS).filter(w=>!recent.includes(w.id));
    let byDiff=pool.filter(w=>w.dificultad<=desired && w.dificultad>=Math.max(1, desired-1));
    if(byDiff.length<6) byDiff=pool.length?pool:ALL_WORDS;
    const word=this.rng.pick(byDiff);
    this.save.recentWords=[...(this.save.recentWords||[]).slice(-180), word.id];
    return structuredClone(word);
  }
}
