export const COLLECTIBLES = [
  { id:'fragmento_espejo', name:'Fragmento de espejo', desc:'Brilla cuando la igualdad se conserva.' },
  { id:'bala_resta', name:'Bala de resta', desc:'Quita lo que sobra, siempre a ambos lados.' },
  { id:'bala_divisora', name:'Bala divisora', desc:'Rompe coeficientes con precisión quirúrgica.' },
  { id:'gancho_basico', name:'Gancho oxidado', desc:'Primer paquete algebraico entregado.' },
  { id:'pistola_neon', name:'Pistola Neón', desc:'Para pistoleros de ecuaciones.' },
  { id:'gancho_galactico', name:'Gancho Galáctico', desc:'Construye igualdad entre estrellas.' },
  { id:'espejo_infinito', name:'Espejo Infinito', desc:'Cien reflejos no son suficientes.' },
  { id:'llave_igual', name:'Llave del igual', desc:'Abre cualquier cámara equilibrada.' },
  { id:'corona_clasica', name:'Corona clásica', desc:'Tres estrellas, diez cámaras.' },
  { id:'nucleo_x', name:'Núcleo de la x', desc:'La incógnita late dentro.' },
  { id:'glitch_domesticado', name:'Glitch domesticado', desc:'Antes rompía espejos. Ahora posa.' },
  { id:'casco_x', name:'Casco de la x', desc:'Protección para incógnitas veloces.' },
  { id:'trofeo_epg', name:'Trofeo EPG', desc:'Leyenda de la Cámara 30.' }
];
export function unlockProgressCollectibles(progress) {
  if (progress.classicCompleted() >= 1) progress.unlockCollectible('bala_resta');
  if (progress.classicCompleted() >= 2) progress.unlockCollectible('gancho_basico');
  if (progress.classicCompleted() >= 5) progress.unlockCollectible('bala_divisora');
}
