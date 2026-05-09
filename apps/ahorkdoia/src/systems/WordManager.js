import { ALL_WORDS, WORD_BANKS } from '../data/words.js';
import { ALL_TEMPLATES } from '../data/templates.js';
import { normalizeText } from './Utils.js';
export class WordManager{
  constructor(save,rng){this.save=save; this.rng=rng;}
  makeGenerated(categoryKey, act=1){ const pool=ALL_TEMPLATES.filter(t=>t.categoryKey===categoryKey); if(!pool.length) return null; const t=this.rng.pick(pool); const a=this.rng.pick(t.listas.a), b=this.rng.pick(t.listas.b); const sol=normalizeText(t.patron.replace('{a}',a).replace('{b}',b)); return {id:`gen_${t.id}_${sol.replace(/ /g,'_')}`, solucion:sol, mostrarComo:sol.replace(/\b\w/g,m=>m.toUpperCase()), tipo:sol.includes(' ')?'expresion':'palabra', categoria:t.categoria, categoryKey:t.categoryKey, subcategoria:t.subcategoria, dificultad:Math.min(3,t.dificultadBase+Math.floor(act/4)), pista0:`${t.categoria} · ${t.subcategoria}`, pista1:t.pistas.pista1, pista2:t.pistas.pista2, pista3:t.pistas.pista3, pista4:`La solución está muy cerca de: ${sol}.`, generated:true}; }
  pickWord({categoryKey='jardineria', difficulty='normal', act=1, daily=false}={}){
    let key=categoryKey==='loteria'?this.rng.pick(Object.keys(WORD_BANKS)):categoryKey;
    const recent=(this.save.recentWords||[]).slice(-80);
    const desired = difficulty==='hard'? Math.min(3, Math.max(2, Math.ceil(act/2))) : Math.min(3, Math.max(1, Math.ceil(act/2)));
    let pool=(WORD_BANKS[key]||ALL_WORDS).filter(w=>!recent.includes(w.id));
    let byDiff=pool.filter(w=>w.dificultad<=desired && w.dificultad>=Math.max(1,desired-1));
    if(byDiff.length<5) byDiff=pool.length?pool:ALL_WORDS;
    const useGen=this.rng.next()<0.28;
    let word= useGen ? this.makeGenerated(key,act) : this.rng.pick(byDiff);
    if(!word) word=this.rng.pick(byDiff);
    this.save.recentWords=[...(this.save.recentWords||[]).slice(-100), word.id];
    return structuredClone(word);
  }
}
