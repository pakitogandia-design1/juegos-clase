const P = {
  basic: [
    {x:120,y:405,w:210,h:18},{x:640,y:405,w:220,h:18}
  ],
  stairs: [
    {x:90,y:410,w:190,h:18},{x:385,y:330,w:190,h:18},{x:680,y:250,w:190,h:18}
  ],
  split: [
    {x:80,y:415,w:180,h:18},{x:385,y:355,w:190,h:18},{x:700,y:415,w:180,h:18},{x:410,y:225,w:140,h:18}
  ],
  final: [
    {x:55,y:420,w:170,h:18},{x:285,y:345,w:160,h:18},{x:515,y:345,w:160,h:18},{x:735,y:420,w:170,h:18},{x:390,y:230,w:180,h:18}
  ]
};

const L = [
  { title:'Enteros tranquilos', platforms:P.basic, ladders:[{x:470,y:330,h:170}], bubbles:[
    ['rational','integer',2,210,90],['rational','integer',2,700,90]
  ]},
  { title:'Fracciones al aire', platforms:P.basic, ladders:[{x:470,y:330,h:170}], bubbles:[
    ['rational','fraction',3,170,80],['rational','fraction',2,720,90]
  ]},
  { title:'Decimales exactos', platforms:P.basic, ladders:[{x:470,y:330,h:170}], bubbles:[
    ['rational','finite',3,180,80],['rational','finite',2,730,80],['rational','integer',2,500,75]
  ]},
  { title:'Periodo visible', platforms:P.stairs, ladders:[{x:280,y:345,h:170},{x:630,y:260,h:250}], bubbles:[
    ['rational','periodic',3,160,80],['rational','periodic',2,750,80],['rational','finite',2,500,70]
  ]},
  { title:'Aparece lo irracional', platforms:P.stairs, ladders:[{x:280,y:345,h:170},{x:630,y:260,h:250}], bubbles:[
    ['irrational','root',3,180,75],['irrational','pi',2,760,85],['rational','fraction',2,500,70]
  ]},
  { title:'Dos arpones, una decisión', platforms:P.stairs, ladders:[{x:280,y:345,h:170},{x:630,y:260,h:250}], bubbles:[
    ['rational','fraction',3,160,80],['irrational','root',3,720,75],['rational','finite',2,480,80],['irrational','pi',2,360,70]
  ]},
  { title:'Escaleras necesarias', platforms:P.stairs, ladders:[{x:260,y:345,h:170},{x:620,y:260,h:250},{x:800,y:250,h:270}], bubbles:[
    ['rational','periodic',3,150,80],['irrational','e',2,760,75],['rational','fraction',2,480,70],['irrational','root',2,360,70]
  ]},
  { title:'Primera división', platforms:P.split, ladders:[{x:280,y:360,h:160},{x:630,y:360,h:160},{x:480,y:225,h:290}], bubbles:[
    ['rational','fraction',4,190,70],['irrational','root',4,740,70],['rational','finite',2,470,70]
  ]},
  { title:'Finito, periódico o caos', platforms:P.split, ladders:[{x:280,y:360,h:160},{x:630,y:360,h:160},{x:480,y:225,h:290}], bubbles:[
    ['rational','periodic',3,160,70],['irrational','nonperiodic',3,760,70],['rational','finite',2,475,70],['irrational','root',2,350,70]
  ]},
  { title:'La familia de π', platforms:P.split, ladders:[{x:280,y:360,h:160},{x:630,y:360,h:160},{x:480,y:225,h:290}], bubbles:[
    ['irrational','pi',3,160,70],['irrational','pi',3,760,70],['irrational','root',2,475,70],['rational','fraction',3,350,70]
  ]},
  { title:'Parecidos peligrosos', platforms:P.final, ladders:[{x:235,y:345,h:175},{x:465,y:230,h:285},{x:695,y:345,h:175}], bubbles:[
    ['rational','fraction',3,150,70],['rational','finite',3,760,70],['irrational','pi',3,500,65],['rational','periodic',2,330,70],['irrational','nonperiodic',2,620,70]
  ], specials:true},
  { title:'Lluvia numérica', platforms:P.final, ladders:[{x:235,y:345,h:175},{x:465,y:230,h:285},{x:695,y:345,h:175}], bubbles:[
    ['rational','periodic',3,130,70],['irrational','root',3,800,70],['rational','fraction',3,430,70],['irrational','pi',2,555,65],['rational','finite',2,650,70]
  ]},
  { title:'Divisiones encadenadas', platforms:P.final, ladders:[{x:235,y:345,h:175},{x:465,y:230,h:285},{x:695,y:345,h:175}], bubbles:[
    ['rational','periodic',4,140,70],['irrational','root',4,790,70],['irrational','pi',3,480,65],['rational','fraction',3,340,70]
  ]},
  { title:'Presión en plataformas', platforms:P.final, ladders:[{x:235,y:345,h:175},{x:465,y:230,h:285},{x:695,y:345,h:175},{x:840,y:420,h:95}], bubbles:[
    ['rational','finite',4,150,70],['irrational','root',4,810,70],['rational','periodic',3,480,65],['irrational','e',3,340,70],['rational','fraction',2,650,70]
  ]},
  { title:'Final: todos los decimales', platforms:P.final, ladders:[{x:235,y:345,h:175},{x:465,y:230,h:285},{x:695,y:345,h:175},{x:840,y:420,h:95}], bubbles:[
    ['rational','fraction',4,120,70],['irrational','root',4,830,70],['rational','periodic',3,450,65],['irrational','pi',3,340,70],['irrational','e',3,650,70],['rational','finite',2,550,70]
  ]}
];

export const LEVELS = L.map((level, i) => ({ id:i+1, ...level }));
