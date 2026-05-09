import { AI_RIVALS } from '../data/aiRivals.js';
import { ACHIEVEMENTS } from '../data/achievements.js';
const KEY='FUTMOV_SAVE_V1';
const baseStats=()=>({goals:0,directGoals:0,penaltyGoals:0,freeKickGoals:0,bestStreak:0,wins:0,localWins:0,shutouts:0,aiWins:0,aiEasyWins:0,aiNormalWins:0,aiHardWins:0,aiLegendWins:0,tournamentsCreated:0,tournamentMatchesWon:0,tournamentsWon:0,trainingSessions:0,trainingDirect:0,campaignStarts:0,campaignWins:0,campaignsCompleted:0,powerupsUsed:0,aiRivalsDefeatedCount:0,unlockedAchievements:0});
export class StorageManager{
 static load(){try{const raw=localStorage.getItem(KEY); if(raw) return this.migrate(JSON.parse(raw));}catch(e){} return this.migrate({});}
 static migrate(save){save.settings={music:true,sfx:true,musicVolume:.45,sfxVolume:.75,...(save.settings||{})}; save.stats={...baseStats(),...(save.stats||{})}; save.achievements=save.achievements||{}; save.collection=save.collection||{}; save.records=save.records||{recent:[]}; save.titles=save.titles||['Sin título']; AI_RIVALS.forEach(r=>{save.collection[r.id]={state:'locked',wins:0,losses:0,bestScore:null,firstDefeatMode:null,badges:[],...(save.collection[r.id]||{})}}); return save;}
 static save(data){localStorage.setItem(KEY,JSON.stringify(data));}
 static reset(){localStorage.removeItem(KEY); return this.load();}
 static addStat(save,key,amount=1){save.stats[key]=(save.stats[key]||0)+amount;}
 static setMax(save,key,value){save.stats[key]=Math.max(save.stats[key]||0,value);}
 static recordMatch(save,match){save.records.recent.unshift({...match,date:new Date().toLocaleDateString('es-ES')}); save.records.recent=save.records.recent.slice(0,12);}
 static discoverRival(save,id){if(save.collection[id]?.state==='locked') save.collection[id].state='discovered';}
 static defeatRival(save,id,mode,score){const c=save.collection[id]; if(!c)return; c.state='defeated'; c.wins=(c.wins||0)+1; if(!c.firstDefeatMode)c.firstDefeatMode=mode; c.bestScore=c.bestScore||score; const prev=(c.bestScore||'0-99').split('-').map(Number); const now=score.split('-').map(Number); if(now[0]-now[1]>prev[0]-prev[1]) c.bestScore=score; const count=Object.values(save.collection).filter(x=>x.state==='defeated').length; save.stats.aiRivalsDefeatedCount=count;}
 static loseToRival(save,id){const c=save.collection[id]; if(!c)return; if(c.state==='locked') c.state='discovered'; c.losses=(c.losses||0)+1;}
 static checkAchievements(save){const newly=[]; ACHIEVEMENTS.forEach(a=>{if(save.achievements[a.id]) return; if(a.id==='complete_all'){const unlocked=Object.keys(save.achievements).length; save.stats.unlockedAchievements=unlocked; if(unlocked>=ACHIEVEMENTS.length-1){save.achievements[a.id]=Date.now(); newly.push(a);} return;} const value=save.stats[a.stat]||0; if(value>=a.target){save.achievements[a.id]=Date.now(); newly.push(a);}}); save.stats.unlockedAchievements=Object.keys(save.achievements).length; return newly;}
}
