window.VIVEROBOX_EPIS = [
  {id:'casco',name:'Casco de seguridad',slot:'cabeza',desc:'Protege la cabeza frente a golpes o caída de objetos.'},
  {id:'gafas',name:'Gafas de protección',slot:'ojos',desc:'Protegen los ojos frente a partículas o salpicaduras.'},
  {id:'pantalla',name:'Pantalla facial',slot:'cara',desc:'Protege la cara frente a proyecciones.'},
  {id:'auditivos',name:'Protectores auditivos',slot:'oido',desc:'Reducen la exposición al ruido de maquinaria.'},
  {id:'guantes_trabajo',name:'Guantes de trabajo',slot:'manos',desc:'Protegen las manos en tareas generales.'},
  {id:'guantes_anticorte',name:'Guantes anticorte',slot:'manos',desc:'Refuerzan la protección de manos en tareas de corte.'},
  {id:'mascarilla',name:'Mascarilla antipolvo',slot:'respiracion',desc:'Ayuda frente a polvo en suspensión.'},
  {id:'respiratoria',name:'Protección respiratoria específica',slot:'respiracion',desc:'Debe elegirse según etiqueta o ficha de seguridad del producto.'},
  {id:'botas',name:'Botas de seguridad',slot:'pies',desc:'Protegen los pies y mejoran la seguridad en el trabajo.'},
  {id:'chaleco',name:'Chaleco reflectante',slot:'torso',desc:'Aumenta la visibilidad en zonas compartidas o con tránsito.'},
  {id:'ropa',name:'Ropa de trabajo',slot:'torso',desc:'Ropa adecuada, cómoda y no suelta para trabajar.'},
  {id:'pantalon_anticorte',name:'Pantalón anticorte',slot:'piernas',desc:'EPI específico para tareas con alto riesgo de corte.'}
];
window.VIVEROBOX_EPI_CHALLENGES = [
  {id:'trasplante',title:'Trasplante en maceta',text:'Vas a trasplantar una planta en una maceta con sustrato.',required:['guantes_trabajo','ropa'],recommended:['botas'],unlock:'guantes_trabajo'},
  {id:'barrer',title:'Barrer y recoger restos',text:'Hay hojas y pequeños restos vegetales en una zona pavimentada.',required:['botas','ropa'],recommended:['guantes_trabajo'],unlock:'botas'},
  {id:'sopladora',title:'Uso de sopladora',text:'Vas a usar una sopladora para retirar hojas secas.',required:['auditivos','gafas','botas','ropa'],recommended:['mascarilla'],unlock:'auditivos'},
  {id:'desbroce',title:'Desbroce seguro',text:'Vas a usar la desbrozadora en una zona con piedras pequeñas.',required:['auditivos','guantes_trabajo','botas','ropa'],alternativeAny:[['gafas','pantalla']],recommended:['pantalla'],unlock:'gafas'},
  {id:'setos',title:'Corte de setos',text:'Vas a recortar un seto con cortasetos.',required:['guantes_trabajo','auditivos','botas','ropa'],alternativeAny:[['gafas','pantalla']],recommended:['pantalla'],unlock:'pantalla'},
  {id:'poda_manual',title:'Poda manual con tijeras',text:'Vas a podar ramas pequeñas con tijeras de poda.',required:['guantes_trabajo','ropa','botas'],recommended:['gafas'],unlock:'ropa'},
  {id:'serrucho',title:'Poda con serrucho',text:'Vas a cortar ramas medianas con serrucho de poda.',required:['guantes_anticorte','gafas','botas','ropa'],recommended:['casco'],unlock:'guantes_anticorte'},
  {id:'cesped',title:'Corte de césped',text:'Vas a utilizar un cortacésped en una zona ajardinada.',required:['botas','auditivos','gafas','ropa'],recommended:['chaleco'],unlock:'chaleco'},
  {id:'sustrato',title:'Sustrato seco o polvo',text:'Vas a manipular sustrato seco que levanta polvo.',required:['mascarilla','guantes_trabajo','ropa'],recommended:['gafas'],unlock:'mascarilla'},
  {id:'motocultor',title:'Uso de motocultor',text:'Vas a preparar el terreno con motocultor.',required:['botas','guantes_trabajo','auditivos','gafas','ropa'],recommended:['casco'],unlock:'casco'},
  {id:'motosierra',title:'Motosierra simulada',text:'Práctica simulada de motosierra en entorno controlado.',required:['casco','auditivos','guantes_anticorte','pantalon_anticorte','botas','ropa'],alternativeAny:[['gafas','pantalla']],recommended:['pantalla'],unlock:'pantalon_anticorte'},
  {id:'producto',title:'Producto con etiqueta de seguridad',text:'Vas a manipular un producto de jardinería revisando etiqueta y ficha de seguridad.',required:['guantes_trabajo','gafas','respiratoria','ropa','botas'],recommended:['mascarilla'],unlock:'respiratoria'}
];
