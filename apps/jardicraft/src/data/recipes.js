export const RECIPES = [
  {id:'compost', name:'Compost', in:['plant_waste','leaves'], out:'compost_item'},
  {id:'basic_tool', name:'Herramienta basica', in:['wood_res','stone_res'], out:'hoe'},
  {id:'potted_plant', name:'Planta en maceta', in:['seed','clay_pot','substrate'], out:'pot'},
  {id:'sprinkler', name:'Riego por aspersion', in:['tube','stone_res'], out:'sprinkler'},
  {id:'better_substrate', name:'Sustrato mejorado', in:['compost_item','dirt'], out:'substrate'},
  {id:'mulch', name:'Acolchado', in:['branch','leaves'], out:'mulch'},
  {id:'cutting', name:'Esqueje', in:['pruners','plant_waste'], out:'seed'},
  {id:'draining_substrate', name:'Sustrato drenante', in:['dirt','compost_item','sand_res'], out:'sand'},
  {id:'fence', name:'Valla', in:['wood_res','nails'], out:'fence'},
  {id:'path', name:'Losa de camino', in:['stone_res','sand_res'], out:'path'},
  {id:'raised_bed', name:'Bancal elevado', in:['wood_res','compost_item'], out:'raised_bed'},
  {id:'bee_hotel', name:'Hotel de insectos', in:['wood_res','branch'], out:'bee_hotel'},
  {id:'water_tank', name:'Deposito de agua', in:['wood_res','tube'], out:'water_tank'},
  {id:'sign', name:'Cartel botanico', in:['wood_res'], out:'sign'},
  {id:'workbench', name:'Banco de trabajo', in:['wood_res','stone_res','nails'], out:'workbench'}
];
