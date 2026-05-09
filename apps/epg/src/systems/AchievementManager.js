export const ACHIEVEMENTS = [
  { id:'first_x', name:'Despejador novato', desc:'Completa tu primera ecuación.', reward:'fragmento_espejo' },
  { id:'pistolero', name:'Pistolero algebraico', desc:'Usa la Pistola 25 veces.', reward:'pistola_neon' },
  { id:'gancho', name:'Gancho constructor', desc:'Usa el Gancho 25 veces.', reward:'gancho_galactico' },
  { id:'reflejos_100', name:'Operación espejo', desc:'Realiza 100 operaciones reflejadas.', reward:'espejo_infinito' },
  { id:'clasico_10', name:'No era pasar, era reflejar', desc:'Completa los 10 niveles clásicos.', reward:'llave_igual' },
  { id:'estrellas_30', name:'Leyenda clásica', desc:'Consigue 30 estrellas en clásico.', reward:'corona_clasica' },
  { id:'arcade_10', name:'Cámara 10', desc:'Llega al nivel 10 del modo arcade.', reward:'nucleo_x' },
  { id:'arcade_20', name:'Cámara 20', desc:'Llega al nivel 20 del modo arcade.', reward:'glitch_domesticado' },
  { id:'arcade_30', name:'Cámara 30', desc:'Completa el nivel 30 del modo arcade.', reward:'trofeo_epg' },
  { id:'divisor', name:'Cirujano de coeficientes', desc:'Usa división 20 veces.', reward:'bala_divisora' },
  { id:'perfect_5', name:'Modo láser', desc:'Completa 5 niveles con 3 estrellas.', reward:'casco_x' }
];
export function evaluateAchievements(progress) {
  const d = progress.data;
  const newly = [];
  const pistol = d.stats.minus + d.stats.divide;
  const hook = d.stats.plus + d.stats.multiply;
  const checks = [
    ['first_x', progress.classicCompleted() + d.arcadeWins >= 1],
    ['pistolero', pistol >= 25],
    ['gancho', hook >= 25],
    ['reflejos_100', d.stats.reflected >= 100],
    ['clasico_10', progress.classicCompleted() >= 10],
    ['estrellas_30', progress.starsTotal() >= 30],
    ['arcade_10', d.arcadeMax >= 10],
    ['arcade_20', d.arcadeMax >= 20],
    ['arcade_30', d.arcadeMax >= 30],
    ['divisor', d.stats.divide >= 20],
    ['perfect_5', Object.values(d.classic).filter(s=>s>=3).length >= 5]
  ];
  for (const [id, ok] of checks) {
    if (ok && progress.unlockAchievement(id)) {
      const a = ACHIEVEMENTS.find(x=>x.id===id);
      if (a?.reward) progress.unlockCollectible(a.reward);
      newly.push(a);
    }
  }
  return newly;
}
