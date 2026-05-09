const KEY='AHORKDO_IA_SAVE_V3';
export const DEFAULT_SAVE={
  settings:{sound:true,music:false,particles:true,flashes:true,blood:true,bigText:false},
  economy:{datosIA:0,spent:0,civiliansBought:0},
  stats:{runsStarted:0,runsCompleted:0,dailyCompleted:0,civiliansSaved:0,civiliansLost:0,bestStreak:0,currentStreak:0,letters:{},hintsBought:0,bossesDefeated:0},
  categories:{}, collection:{}, codex:{}, achievements:{}, discoveredPowerups:{}, activeRun:null, lastDaily:null, titles:{active:'Rescatador de neón'}
};
function merge(base,extra){
  if(!extra) return structuredClone(base);
  const out={...structuredClone(base),...extra};
  for(const k of Object.keys(base)) if(typeof base[k]==='object' && !Array.isArray(base[k])) out[k]={...structuredClone(base[k]),...(extra[k]||{})};
  return out;
}
export class StorageManager{
  static load(){ try{return merge(DEFAULT_SAVE, JSON.parse(localStorage.getItem(KEY))||{});}catch(e){return structuredClone(DEFAULT_SAVE)} }
  static save(data){ localStorage.setItem(KEY,JSON.stringify(data)); }
  static reset(){ localStorage.removeItem(KEY); }
}
