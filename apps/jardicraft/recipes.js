import { PLANTS } from '../data/plants.js';
export class PlantSystem {
  constructor(state, achievements, notify){ this.state=state; this.ach=achievements; this.notify=notify; }
  plantAt(tile, plantId){
    if(tile.plant) return {ok:false,msg:'Ya hay una planta aqui.'};
    const plant=PLANTS.find(p=>p.id===plantId)||PLANTS[0];
    tile.plant={id:plant.id,age:0,health:75,water:plant.water==='bajo'?45:plant.water==='medio'?55:65,stage:0,status:'sana',flower:false,dominion:10};
    this.discover(plant.id,'plantada'); this.ach?.add('first_sprout',1); this.ach?.add('plant_exists',1);
    this.notify?.push('Nueva plantacion', `${plant.common} plantada.`);
    return {ok:true,msg:`${plant.common} plantada.`};
  }
  discover(id, level='descubierta'){
    const d=this.state.jardidex[id]||{state:'no descubierta',progress:0};
    const order=['no descubierta','descubierta','plantada','mantenida','florecida','dominada'];
    if(order.indexOf(level)>order.indexOf(d.state)) d.state=level;
    d.progress=Math.max(d.progress, level==='dominada'?100:level==='florecida'?80:level==='mantenida'?60:level==='plantada'?35:15);
    this.state.jardidex[id]=d;
    this.ach?.set('not_pokemon', Object.keys(this.state.jardidex).length);
  }
  water(tile){
    if(!tile.plant) return {ok:false,msg:'No hay planta que regar.'};
    tile.plant.water += 22;
    if(tile.plant.water>100){ tile.plant.status='encharcada'; tile.plant.health-=8; this.ach?.add('too_much_water',1); return {ok:false,msg:'Tu planta no queria piscina.'}; }
    tile.plant.health=Math.min(100,tile.plant.health+4); tile.plant.status='sana'; this.ach?.add('water_responsible',1); this.discover(tile.plant.id,'mantenida'); return {ok:true,msg:'Riego correcto.'};
  }
  prune(tile){
    if(!tile.plant) return {ok:false,msg:'No hay planta que podar.'};
    const p=PLANTS.find(x=>x.id===tile.plant.id);
    if(p?.needsPruning || tile.plant.status==='necesita poda'){ tile.plant.health=Math.min(100,tile.plant.health+8); tile.plant.status='sana'; this.ach?.add('green_scissorhands',1); return {ok:true,msg:'Poda limpia.'}; }
    tile.plant.health-=5; return {ok:false,msg:'Poda innecesaria. Mejor observar antes.'};
  }
  treat(tile){
    if(!tile.plant) return {ok:false,msg:'No hay planta que tratar.'};
    if(tile.plant.status==='plaga'){ tile.plant.status='sana'; tile.plant.health+=10; this.ach?.add('doctor_plant',1); return {ok:true,msg:'Plaga controlada.'}; }
    return {ok:false,msg:'No se detecta plaga.'};
  }
  nextDay(map, season, weather){
    for(const row of map) for(const tile of row){ if(!tile.plant) continue; const pl=tile.plant; const data=PLANTS.find(p=>p.id===pl.id); pl.age++;
      pl.water += weather==='lluvia'?15:weather==='lluvia intensa'?32:weather==='ola de calor'?-24:-8;
      if(pl.water<20){pl.status='sedienta'; pl.health-=8;} else if(pl.water>105){pl.status='encharcada'; pl.health-=8;} else if(Math.random()<0.05 && data.pestSensitivity==='alta'){pl.status='plaga'; this.ach?.add('paco_pulgon',1);} else if(Math.random()<0.04){pl.status='necesita poda';} else { if(pl.status!=='plaga') pl.status='sana'; pl.health=Math.min(100,pl.health+2); }
      pl.water=Phaser.Math.Clamp(pl.water,0,120); if(pl.age>data.growth) pl.stage=1; if(data.flowers && pl.age>data.growth+2 && season==='primavera'){pl.flower=true; this.discover(pl.id,'florecida');}
      if(pl.health>=95 && pl.age>data.growth+4){this.discover(pl.id,'dominada'); this.ach?.add('green_legend',1); this.ach?.add('vivero_master',1);}
      if(pl.health<=0) pl.status='perdida';
    }}
}
