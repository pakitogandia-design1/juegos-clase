export function normalizeText(str=''){
  return String(str).toLowerCase().replaceAll('ñ','__enie__').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replaceAll('__enie__','ñ').replace(/[^a-zñ0-9 ]/g,' ').replace(/\s+/g,' ').trim();
}
export function todayKey(){ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
export function hashSeed(str){ let h=2166136261; for(let i=0;i<str.length;i++){h^=str.charCodeAt(i); h=Math.imul(h,16777619);} return h>>>0; }
export class RNG{ constructor(seed='KIA'){this.s=hashSeed(String(seed))||1;} next(){this.s=(1664525*this.s+1013904223)>>>0; return this.s/4294967296;} int(a,b){return Math.floor(this.next()*(b-a+1))+a;} pick(arr){return arr[Math.floor(this.next()*arr.length)]} shuffle(arr){const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=this.int(0,i); [a[i],a[j]]=[a[j],a[i]];} return a;} }
export function pct(a,b){return b?Math.round((a/b)*100):0}
export function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
