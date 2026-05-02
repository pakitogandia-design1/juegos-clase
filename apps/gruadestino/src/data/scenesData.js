export const actions = ['Mirar', 'Usar', 'Hablar', 'Coger'];

export const scenesData = [
  {
    id: 's1', order: 0, title: 'El sueño del contenedor', bg: 'assets/01-sueno-contenedor.jpg', start: {x:.18,y:.70},
    intro: 'La casa contenedor brilla como una promesa importada. El protagonista ignora que la promesa venía sin instrucciones emocionales.',
    objective: 'Recoge el casco, mira los planos y usa el teléfono para llamar a la grúa.',
    nextWhen: ['casco','planosVistos','gruaLlamada'],
    nextText: 'La llamada está hecha. Una sombra de metal aparece al fondo del camino.',
    hotspots: [
      {id:'casco', name:'Casco', x:.18,y:.78,w:.10,h:.10, look:'Un casco amarillo. Aún no sabe que protegerá más tu dignidad que tu cabeza.', take:'Coges el casco. Te queda sorprendentemente serio.', give:'casco'},
      {id:'planos', name:'Planos', x:.40,y:.73,w:.14,h:.10, look:'Los planos tienen flechas, medidas y una confianza imposible.', use:'Lees los planos. La casa debe moverse exactamente por donde no cabe.', flag:'planosVistos', give:'planos'},
      {id:'telefono', name:'Teléfono', x:.61,y:.77,w:.10,h:.10, look:'El teléfono espera la llamada que cambiará tu vida para peor.', use:'Llamas a la grúa. Al otro lado dicen: “Tenemos una solución grande”.', flag:'gruaLlamada', give:'telefono'},
      {id:'terreno', name:'Terreno', x:.72,y:.65,w:.18,h:.13, look:'Un camino estrecho entre naranjos. Ideal para pasear. No para mover una casa.'},
      {id:'contenedor', name:'Casa contenedor', x:.50,y:.44,w:.25,h:.22, look:'Tu nueva vida. Compacta, china y demasiado optimista.'},
      {id:'marca', name:'Marca en el suelo', x:.31,y:.84,w:.16,h:.06, look:'Una marca de spray indica dónde irá la casa. El suelo parece no haber sido consultado.'}
    ]
  },
  {
    id: 's2', order: 1, title: 'La llegada de la grúa', bg: 'assets/02-llegada-grua.jpg', start: {x:.25,y:.72},
    intro: 'La grúa llega como si la hubiese diseñado un herrero con fiebre y presupuesto infinito.',
    objective: 'Habla con el operador, revisa la cincha, firma el contrato y engancha la casa.',
    nextWhen: ['habloOperador','cinchaRevisada','contratoListo','casaEnganchada'],
    nextText: 'Todo está firmado, enganchado y moralmente condenado.',
    hotspots: [
      {id:'grua', name:'Grúa araña', x:.18,y:.43,w:.25,h:.25, look:'Era enorme. Por desgracia, tu confianza también.'},
      {id:'operador', name:'Operador', x:.34,y:.59,w:.10,h:.18, look:'Tiene la mirada de quien ha visto casas volar y facturas aterrizar.', talk:'operador'},
      {id:'cinchas', name:'Cinchas', x:.52,y:.55,w:.13,h:.11, look:'Unas cinchas cansadas. Han visto cosas.', use:'Revisas la cincha. Técnicamente es una cincha. Emocionalmente es una apuesta.', flag:'cinchaRevisada', give:'cincha'},
      {id:'gancho', name:'Gancho', x:.58,y:.36,w:.12,h:.12, look:'El gancho cuelga con una seguridad teatral.', use:'Enganchas la casa con la solemnidad de quien activa una profecía.', requires:'cincha', flag:'casaEnganchada'},
      {id:'mando', name:'Mando', x:.26,y:.64,w:.08,h:.08, look:'Tiene más botones que certezas.'},
      {id:'contrato', name:'Contrato', x:.73,y:.76,w:.12,h:.08, look:'La letra pequeña parece escrita por alguien que no piensa quedarse.', use:'Lees “daños emocionales no incluidos”. Firmas igual.', flag:'contratoListo', give:'contrato'},
      {id:'ruedas', name:'Patas hundidas', x:.15,y:.78,w:.15,h:.10, look:'La grúa no tiene ruedas: tiene patas. Y algunas ya dudan del terreno.'}
    ]
  },
  {
    id:'s3', order:2, title:'La maniobra imposible', bg:'assets/03-maniobra-imposible.jpg', start:{x:.28,y:.72},
    intro:'La casa se eleva. Los naranjos contienen la respiración. El vecino, no.',
    objective:'Completa la secuencia correcta: cable, operador, vecino, tensar y confirmar.',
    nextWhen:['pasoCable','pasoOperador','pasoVecino','pasoTensar','pasoConfirmar'],
    nextText:'La maniobra sale exactamente como nadie quería, pero con buena participación.',
    sequence:['cable','operador','vecino','palanca','senales'],
    hotspots:[
      {id:'palanca', name:'Palanca', x:.31,y:.66,w:.10,h:.12, look:'Una palanca que promete control. Qué gracioso.', use:'Tensas poco a poco. La casa se balancea como una idea mala.', seq:'palanca', flag:'pasoTensar'},
      {id:'senales', name:'Señales', x:.43,y:.63,w:.10,h:.10, look:'Gestos internacionales de “yo no quería esto”.', use:'Confirmas la maniobra. El destino firma el acta.', seq:'senales', flag:'pasoConfirmar'},
      {id:'cable', name:'Cable tenso', x:.52,y:.28,w:.20,h:.08, look:'El cable canta una nota aguda de puro miedo.', use:'Revisas el cable. Sigue entero, como tu ingenuidad.', seq:'cable', flag:'pasoCable'},
      {id:'viento', name:'Viento', x:.75,y:.25,w:.16,h:.15, look:'Una brisa valenciana decide participar en el desastre.'},
      {id:'vecino', name:'Vecino mirando', x:.78,y:.66,w:.10,h:.16, look:'No ayuda, pero narra la tragedia con entusiasmo.', talk:'vecino', seq:'vecino'},
      {id:'operador', name:'Operador', x:.22,y:.55,w:.10,h:.18, look:'Está demasiado tranquilo para la cantidad de metal en el aire.', talk:'operador', seq:'operador', flag:'pasoOperador'},
      {id:'base', name:'Base de la grúa', x:.18,y:.78,w:.18,h:.12, look:'La base tiene la firmeza de un flan con casco.'},
      {id:'casa', name:'Casa balanceándose', x:.57,y:.44,w:.25,h:.20, look:'Tu futuro se mueve con el viento. Literalmente.'}
    ]
  },
  {
    id:'s4', order:3, title:'El desastre', bg:'assets/04-desastre.jpg', start:{x:.25,y:.73},
    intro:'La casa toca tierra de una forma que ningún manual recomienda.',
    objective:'Reúne pruebas, recoge la factura, revisa puerta y ventana, y usa la llave inglesa inútilmente.',
    nextWhen:['facturaRecogida','puertaRevisada','ventanaRevisada','llaveUsada','fraseTecnica'],
    nextText:'La frase “Técnicamente, sigue siendo una vivienda” ya puede destruir amistades.',
    hotspots:[
      {id:'grietas', name:'Grietas', x:.55,y:.50,w:.15,h:.12, look:'No son grietas. Son ventilación emocional.'},
      {id:'puerta', name:'Puerta torcida', x:.46,y:.59,w:.12,h:.20, look:'La puerta ahora abre a una dimensión ligeramente inclinada.', use:'Revisas la puerta. Sigue existiendo. Eso cuenta.', flag:'puertaRevisada'},
      {id:'ventana', name:'Ventana rota', x:.60,y:.38,w:.12,h:.12, look:'La ventana ya no separa interior y exterior. Muy diáfano.', use:'Tocas el marco con cuidado. La casa responde con un crujido administrativo.', flag:'ventanaRevisada'},
      {id:'barro', name:'Barro', x:.24,y:.80,w:.15,h:.10, look:'El barro ha sido el único que ha ganado algo hoy.'},
      {id:'factura', name:'Factura', x:.72,y:.75,w:.12,h:.09, look:'Un papel pequeño con una cifra grande.', take:'Recoges la factura. Pesa más que la casa.', give:'factura', flag:'facturaRecogida'},
      {id:'cinchaRota', name:'Cincha rota', x:.34,y:.69,w:.13,h:.09, look:'La cincha ha decidido jubilarse.', take:'Coges una llave inglesa que estaba debajo. Nadie sabe por qué.', give:'llave'},
      {id:'operadorFuera', name:'Operador marchándose', x:.82,y:.59,w:.12,h:.18, look:'Se marcha con la dignidad de quien no mira atrás.'},
      {id:'vecino', name:'Vecino grabando', x:.12,y:.62,w:.10,h:.18, talk:'vecino', look:'Su móvil tiene mejor cobertura que tu vida.'},
      {id:'casa', name:'Casa arruinada', x:.52,y:.58,w:.20,h:.20, use:'Apreté una tuerca imaginaria. La casa no mejoró.', requires:'llave', flag:'llaveUsada', after:'voz'}
    ]
  },
  {
    id:'s5', order:4, title:'La casa contenedor en estado terrible', bg:'assets/05-casa-terrible.jpg', start:{x:.27,y:.75},
    intro:'Vivir aquí no es rendirse. Es negociar cada minuto con la humedad.',
    objective:'Sobrevive una noche: cubo bajo la gotera, manta, café frío y evita el enchufe.',
    nextWhen:['cuboColocado','mantaUsada','cafeBebido','enchufeEvitado','dormirIntentado'],
    nextText:'La noche termina. El cuerpo ha dormido dos minutos. La desgracia, ninguno.',
    hotspots:[
      {id:'cama', name:'Cama', x:.68,y:.73,w:.18,h:.13, look:'Un colchón hundido con vocación de trampa.', use:'Intentas dormir. La casa cruje como si leyera tus pensamientos.', flag:'dormirIntentado'},
      {id:'gotera', name:'Gotera', x:.52,y:.26,w:.10,h:.18, look:'La gotera marca el ritmo de una canción triste.', use:'Colocas el cubo bajo la gotera. Primer éxito doméstico del año.', requires:'cubo', flag:'cuboColocado'},
      {id:'enchufe', name:'Enchufe chispeante', x:.79,y:.52,w:.08,h:.10, look:'El enchufe hace sonidos de villano secundario.', use:'Decides no tocarlo. Por una vez, eliges vivir.', flag:'enchufeEvitado'},
      {id:'termo', name:'Termo roto', x:.34,y:.57,w:.10,h:.12, look:'Prometía agua caliente. Ahora promete conversación.'},
      {id:'comida', name:'Comida triste', x:.42,y:.75,w:.12,h:.09, look:'Una lata mira al vacío. Tú también.'},
      {id:'ventana', name:'Ventana que no cierra', x:.23,y:.45,w:.12,h:.18, look:'La ventana permite entrar aire, polvo y arrepentimiento.'},
      {id:'manta', name:'Manta', x:.61,y:.77,w:.12,h:.08, take:'Coges la manta. Tiene textura de derrota, pero abriga.', give:'manta'},
      {id:'cubo', name:'Cubo de goteras', x:.49,y:.76,w:.10,h:.10, take:'Coges el cubo. Un recipiente humilde para una tragedia ambiciosa.', give:'cubo'},
      {id:'cafe', name:'Café frío', x:.36,y:.74,w:.08,h:.08, take:'Coges el café frío. Tiene más carácter que temperatura.', give:'cafe', use:'Bebes café frío. No despierta, pero acompaña.', flag:'cafeBebido'},
      {id:'usarManta', name:'Noche helada', x:.72,y:.42,w:.12,h:.15, use:'Te envuelves en la manta. Sobrevivir se parece mucho a esperar.', requires:'manta', flag:'mantaUsada'}
    ]
  },
  {
    id:'s6', order:5, title:'La caída total', bg:'assets/06-caida-total.jpg', start:{x:.30,y:.72},
    intro:'El dinero se fue. La esperanza dejó un mensaje sin responder. La dignidad pide traslado.',
    objective:'Revisa factura, llama al banco, mírate al espejo, lee la carta y acepta lo ocurrido.',
    nextWhen:['facturaLeida','bancoLlamado','espejoMirado','cartaLeida','aceptado'],
    nextText:'La carta oficial abre una puerta. Nadie dijo que fuese buena.',
    hotspots:[
      {id:'movil', name:'Móvil', x:.36,y:.72,w:.08,h:.08, use:'Llamas al banco. La música de espera tiene más futuro que tú.', flag:'bancoLlamado'},
      {id:'banco', name:'App del banco', x:.44,y:.72,w:.08,h:.08, look:'Un número en rojo. No es decoración navideña.'},
      {id:'factura', name:'Factura de la grúa', x:.54,y:.70,w:.10,h:.08, use:'Revisas la factura. Descubres que el desastre también lleva IVA.', flag:'facturaLeida'},
      {id:'carta', name:'Carta oficial GVA', x:.63,y:.66,w:.12,h:.12, look:'Una carta con membrete de la GVA. Pesa como un giro de guion.', use:'La GVA le ha convocado para una plaza en FP Básica. No sabes si reír, llorar o plastificarla.', flag:'cartaLeida'},
      {id:'espejo', name:'Espejo roto', x:.22,y:.48,w:.10,h:.18, look:'Te miras. El espejo también parece necesitar tutoría.', use:'Te miras en el espejo. Confirmas que sigues siendo el protagonista, por desgracia.', flag:'espejoMirado'},
      {id:'mensajes', name:'Mensajes sin responder', x:.74,y:.57,w:.10,h:.12, look:'“¿Cómo va lo de la casa?” Nadie merece la verdad completa.'},
      {id:'libro', name:'Libro de jardinería', x:.31,y:.77,w:.12,h:.08, take:'Coges el libro de jardinería. Quizá enseñar plantas sea más estable que mover casas.', give:'libro'},
      {id:'silla', name:'Silla rota', x:.79,y:.78,w:.12,h:.09, look:'La silla y tú tenéis mucho en común.'},
      {id:'aceptar', name:'Aceptar destino', x:.50,y:.45,w:.16,h:.12, use:'Aceptas que todo ha ido a peor. La vida desbloquea el siguiente nivel.', flag:'aceptado'}
    ]
  },
  {
    id:'s7', order:6, title:'FP Básica: el último destino', bg:'assets/07-fp-basica-caos.jpg', start:{x:.46,y:.70},
    intro:'Primer día de clase. El aula no está fuera de control: el control se ha dado de baja.',
    objective:'Intenta dar clase: usa la tiza, habla con un alumno, mira la pizarra, explica jardinería y firma el parte infinito.',
    nextWhen:['tizaUsada','intentoClase','pizarraVista','explicoJardineria','parteFirmado'],
    nextText:'La clase termina. No porque acabara, sino porque el concepto de clase se rindió.',
    final:true,
    hotspots:[
      {id:'pizarra', name:'Pizarra', x:.48,y:.36,w:.24,h:.16, look:'Alguien ha escrito “Casa contenedor 0 - Vida 7”. Es matemáticamente cruel.', flag:'pizarraVista'},
      {id:'tizas', name:'Tizas', x:.38,y:.68,w:.10,h:.08, take:'Coges una tiza rota. Es el arma menos intimidante de la historia.', give:'tiza'},
      {id:'mochila', name:'Mochila', x:.20,y:.78,w:.10,h:.10, look:'La mochila vibra. Dentro hay algo que prefiere no salir.'},
      {id:'mesa', name:'Mesa del profesor', x:.52,y:.76,w:.18,h:.10, look:'La mesa contiene papeles, café invisible y resignación.'},
      {id:'papelera', name:'Papelera humeante', x:.82,y:.70,w:.10,h:.12, look:'La papelera produce una metáfora con humo.'},
      {id:'alumno', name:'Alumno', x:.30,y:.58,w:.10,h:.18, talk:'alumno', look:'Sonríe como quien acaba de descubrir el caos aplicado.'},
      {id:'extintor', name:'Extintor', x:.88,y:.48,w:.06,h:.15, use:'Lo señalas con autoridad. Nadie interpreta la indirecta.'},
      {id:'poster', name:'Póster roto', x:.14,y:.34,w:.12,h:.14, look:'Un póster de seguridad laboral cuelga como sátira institucional.'},
      {id:'libro', name:'Libro de jardinería', x:.62,y:.68,w:.10,h:.08, use:'Intentas explicar jardinería. Un alumno pregunta si los naranjos aceptan grúas como plaga.', requires:'libro', flag:'explicoJardineria'},
      {id:'parte', name:'Parte disciplinario infinito', x:.70,y:.76,w:.12,h:.08, take:'Coges el parte disciplinario. No tiene final. Como esta mañana.', give:'parte', use:'Firmas el parte infinito. El bolígrafo pide traslado.', requires:'parte', flag:'parteFirmado'},
      {id:'usarTiza', name:'Silencio en la pizarra', x:.58,y:.44,w:.12,h:.12, use:'Escribes “respeto”. Una bola de papel lo subraya violentamente.', requires:'tiza', flag:'tizaUsada'}
    ]
  }
];
