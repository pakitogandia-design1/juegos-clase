export class WeatherSystem {
  constructor(state, notify){ this.state=state; this.notify=notify; }
  next(){
    this.state.day++;
    const seasons=['primavera','verano','otono','invierno']; this.state.season=seasons[Math.floor((this.state.day-1)/12)%4];
    const base=['soleado','nublado','lluvia','viento'];
    const extra=this.state.season==='verano'?['ola de calor','soleado','soleado']:this.state.season==='invierno'?['helada','nublado']:['lluvia intensa','soleado'];
    const pool=[...base,...extra]; this.state.weather=pool[Math.floor(Math.random()*pool.length)];
    this.notify?.push('Nuevo dia', `Dia ${this.state.day}. Estacion: ${this.state.season}. Clima: ${this.state.weather}.`);
    return this.state.weather;
  }
}
