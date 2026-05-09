import { TRASH_TALK } from '../data/trashTalk.js';
export class TrashTalkManager{
 constructor(){this.globalRecent=[];this.categoryRecent={};this.usedThisMatch={};this.globalLimit=32;this.categoryLimit=12;}
 resetMatch(){this.usedThisMatch={};}
 pick(category,vars={}){const pool=TRASH_TALK[category]||TRASH_TALK.generic||[]; if(!pool.length)return ''; const blocked=new Set([...(this.globalRecent||[]),...(this.categoryRecent[category]||[]),...(this.usedThisMatch[category]||[])]); let candidates=pool.filter(x=>!blocked.has(x)); if(!candidates.length)candidates=pool.filter(x=>!this.globalRecent.includes(x)); if(!candidates.length)candidates=pool; const line=Phaser.Utils.Array.GetRandom(candidates); this.register(category,line); return this.format(line,vars);}
 register(category,line){this.globalRecent.push(line); if(this.globalRecent.length>this.globalLimit)this.globalRecent.shift(); this.categoryRecent[category]=this.categoryRecent[category]||[]; this.categoryRecent[category].push(line); if(this.categoryRecent[category].length>this.categoryLimit)this.categoryRecent[category].shift(); this.usedThisMatch[category]=this.usedThisMatch[category]||[]; this.usedThisMatch[category].push(line);}
 format(line,vars){return line.replaceAll('{player}',vars.player||'jugador').replaceAll('{rival}',vars.rival||'rival').replaceAll('{score}',vars.score||'0-0');}
}
