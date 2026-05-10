const M=(id,name,desc,goal,reward=100)=>({id,name,desc,goal,reward});
export const MISSIONS = [
M('start','Primer terreno vivo','Limpia maleza, labra una casilla y planta tu primera especie.',{plant:1,hoe:1},120),
M('low_water','Parterre mediterraneo','Crea un parterre con 3 especies de bajo riego.',{lowWater:3},160),
M('poor_soil','Recuperar suelo pobre','Mejora 5 casillas de suelo pobre con compost o acolchado.',{soilImprove:5},150),
M('irrigation','Riego eficiente','Instala riego o mejora humedad en 6 casillas.',{waterTiles:6},140),
M('first_pest','Batalla microscopica','Controla una plaga sin perder la planta.',{curePest:1},130),
M('aromatics','Rincon aromatico','Registra 5 aromaticas en el JardiDex.',{collection:'Aromaticas',count:5},180),
M('healthy_week','Semana saludable','Mantén 10 plantas sanas durante 7 dias.',{healthy:10,days:7},220),
M('shade','Jardin de sombra','Diseña una zona con 3 plantas de sombra o semisombra.',{shade:3},150),
M('decorate_hut','Caseta con estilo','Decora tu caseta con 5 objetos.',{decor:5},150),
M('first_outfit','Conjunto de estreno','Compra y equipa tu primer gorro.',{outfit:1},130),
M('compost_route','Ruta del compost','Fabrica compost 3 veces.',{compost:3},150),
M('pollinators','Bienvenidos polinizadores','Atrae abejas o mariposas al jardin.',{biodiversity:45},170),
M('florist','Composicion floral','Haz florecer 4 plantas ornamentales.',{flowers:4},200),
M('pathmaker','Camino bonito','Coloca 12 bloques de camino.',{paths:12},120),
M('water_save','Agua con cabeza','Consigue eficiencia hidrica de 70 o mas.',{waterEfficiency:70},180),
M('wardrobe','Armario Verde','Consigue 5 prendas o accesorios.',{wardrobe:5},150),
M('daily','Oficio diario','Completa 5 objetivos diarios.',{daily:5},160),
M('jardidex','Botanica practica','Registra 15 especies en el JardiDex.',{dex:15},220),
M('greenhouse','Primer invernadero','Desbloquea o coloca el invernadero pequeno.',{greenhouse:1},260),
M('master_zone','Jardin completo','Alcanza salud, estetica y biodiversidad por encima de 60.',{summary:60},300)
];
export const DAILY_OBJECTIVES = [
  'Regar 3 plantas que lo necesiten','Revisar una planta con plaga','Fabricar compost','Plantar una especie nueva','Comprar un objeto nuevo','Completar una accion correcta','Mejorar una casilla de suelo','Colocar una decoracion','Consultar el JardiDex','Equipar una prenda nueva'
];
