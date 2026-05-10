import { ACHIEVEMENTS } from '../data/achievements.js';
import { CIVILIANS } from '../data/civilians.js';
export class AchievementManager{
  constructor(save){this.save=save;}
  unlock(id){ if(!this.save.achievements[id]){this.save.achievements[id]={unlocked:true,date:new Date().toISOString()}; return ACHIEVEMENTS.find(a=>a.id===id); } return null; }
  evaluate(){
    const s=this.save.stats, out=[], u=id=>{const a=this.unlock(id); if(a) out.push(a)};
    const civs=Object.values(this.save.collection||{}).filter(c=>c.saved); const codex=Object.values(this.save.codex||{}); const eco=this.save.economy||{};
    if(s.civiliansSaved>=1)u('first_rescue'); if(codex.length>=1)u('first_data'); if(s.bestStreak>=5)u('streak_5'); if(s.bossesDefeated>=1)u('boss_down'); if(s.dailyCompleted>=1)u('first_daily'); if(s.dailyCompleted>=3)u('daily_streak');
    if((eco.civiliansBought||0)>=1)u('first_purchase'); if((eco.civiliansBought||0)>=5)u('buy_5'); if((eco.civiliansBought||0)>=10)u('buy_10'); if((eco.civiliansBought||0)>=20)u('buy_20');
    [10,25,40,60].forEach(n=>{if(civs.length>=n)u('civ_'+n)}); [25,75,150,300,500,750,1000,1200].forEach(n=>{if(codex.length>=n)u('codex_'+n)});
    if(civs.some(c=>c.rarity==='legendario'))u('legend_civ'); if(civs.length>=CIVILIANS.length)u('all_civilians_shop');
    const byCat={}; codex.forEach(c=>byCat[c.categoryKey]=(byCat[c.categoryKey]||0)+1); Object.entries(byCat).forEach(([k,v])=>{if(v>=25)u('cat_'+k+'_25'); if(v>=60)u('cat_'+k+'_60'); if(v>=100)u('cat_'+k+'_100');});
    const savedByCat={}; civs.forEach(c=>savedByCat[c.categoryKey]=(savedByCat[c.categoryKey]||0)+1); Object.entries(savedByCat).forEach(([k,v])=>{if(v>=10)u('save_'+k+'_10')});
    const families={}; CIVILIANS.forEach(c=>{families[c.family]=families[c.family]||{total:0,saved:0,id:'fam_'+c.family.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'_')}; families[c.family].total++; if(this.save.collection[c.id]?.saved) families[c.family].saved++;});
    Object.values(families).forEach(f=>{if(f.saved>=f.total && f.total>0)u(f.id)});
    return out;
  }
  all(){return ACHIEVEMENTS;}
}
