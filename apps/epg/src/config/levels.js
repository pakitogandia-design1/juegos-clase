export const CLASSIC_LEVELS = [
  { id: 1, title: 'Primer reflejo', eq: { lA: 1, lB: 3, rA: 0, rB: 8 }, energy: 100, moves: 3, tip: 'Quita el +3 con la Pistola de resta.' },
  { id: 2, title: 'Paquete de rescate', eq: { lA: 1, lB: -4, rA: 0, rB: 6 }, energy: 100, moves: 3, tip: 'Añade 4 con el Gancho para liberar x.' },
  { id: 3, title: 'Coeficiente blindado', eq: { lA: 2, lB: 0, rA: 0, rB: 10 }, energy: 100, moves: 3, tip: 'Divide entre 2 en ambos lados.' },
  { id: 4, title: 'División atrapada', eq: { lA: { n: 1, d: 3 }, lB: 0, rA: 0, rB: 4 }, energy: 100, moves: 3, tip: 'Cuando x está dividida, el Gancho de multiplicar la libera.' },
  { id: 5, title: 'Doble cierre', eq: { lA: 2, lB: 3, rA: 0, rB: 11 }, energy: 95, moves: 4, tip: 'Primero elimina el término suelto, después el coeficiente.' },
  { id: 6, title: 'Motor menos cinco', eq: { lA: 3, lB: -5, rA: 0, rB: 10 }, energy: 95, moves: 4, tip: 'El Gancho también sirve para sumar lo que falta.' },
  { id: 7, title: 'La x al otro lado', eq: { lA: 0, lB: 14, rA: 2, rB: 4 }, energy: 90, moves: 4, tip: 'La incógnita puede estar a la derecha. Despejar funciona igual.' },
  { id: 8, title: 'Carga fraccionada', eq: { lA: { n: 1, d: 2 }, lB: 6, rA: 0, rB: 11 }, energy: 90, moves: 4, tip: 'Primero limpia el +6. Luego multiplica para liberar x.' },
  { id: 9, title: 'Duelo de incógnitas', eq: { lA: 3, lB: 2, rA: 1, rB: 10 }, energy: 85, moves: 5, tip: 'Resta x para juntar las incógnitas en un lado.' },
  { id: 10, title: 'Cámara final clásica', eq: { lA: 4, lB: -3, rA: 1, rB: 12 }, energy: 80, moves: 5, tip: 'Separa x, limpia constantes y divide.' }
];
