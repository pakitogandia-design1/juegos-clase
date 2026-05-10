import { RNG, todayKey } from './Utils.js';
import { CATEGORIES } from '../data/categories.js';
import { BOSSES } from '../data/bosses.js';
export class RunManager{
  constructor(save){this.save=save;}
  create({categoryKey='jardineria',difficulty='normal',daily=false}={}){
    const seed=daily?`DAILY-${todayKey()}`:`RUN-${Date.now()}-${categoryKey}-${difficulty}`;
    const rng=new RNG(seed);
    if(categoryKey==='daily') categoryKey=rng.pick(CATEGORIES).key;
    const total=difficulty==='hard'?25:15;
    const nodes=[];
    for(let i=1;i<=total;i++){
      const isBoss = i===total || (difficulty==='hard' && i===15);
      const event = !isBoss && [4,8,12,18,22].includes(i);
      const elite = !isBoss && [5,9,13,20,24].includes(i);
      nodes.push({index:i,type:isBoss?'boss':event?'event':elite?'elite':'rescue',completed:false});
    }
    const rewardBlocked=!!(daily && this.save.lastDaily?.date===todayKey() && this.save.lastDaily?.completed); const run={id:seed,seed,categoryKey,difficulty,daily,rewardBlocked,total,nodeIndex:0,nodes,act:1,datos:0,saved:0,lost:0,powerups:[],lettersUsed:{},completed:false,failed:false,bosses:[]};
    this.save.activeRun=run; this.save.stats.runsStarted++; return run;
  }
  current(){return this.save.activeRun;}
  actFor(run,nodeIndex){return Math.min(run.difficulty==='hard'?5:3, Math.ceil((nodeIndex+1)/5));}
  bossFor(run){ const key=run.categoryKey==='loteria'?'loteria':run.categoryKey; return BOSSES.find(b=>b.categoryKey===key)||BOSSES.at(-1); }
  completeNode(run){run.nodes[run.nodeIndex].completed=true; run.nodeIndex++; if(run.nodeIndex>=run.total){run.completed=true; if(!run.rewardsClaimed){this.save.economy=this.save.economy||{datosIA:0,spent:0,civiliansBought:0}; if(!run.rewardBlocked)this.save.economy.datosIA+=(run.datos||0); run.rewardsClaimed=true;} this.save.stats.runsCompleted++; if(run.daily && !run.rewardBlocked){this.save.stats.dailyCompleted++; this.save.lastDaily={date:todayKey(),completed:true,result:{saved:run.saved,lost:run.lost}};} } }
}
