export const dialoguesData = {
  operador: {
    title: 'Operador de grúa',
    options: [
      { text: '¿Está seguro de que esto aguanta?', reply: 'Aguantar, aguanta. Otra cosa es que la realidad colabore.', flag: 'habloOperador' },
      { text: 'Firmo lo que haga falta.', reply: 'El operador sonríe con la tranquilidad de quien ya ha cobrado.', flag: 'contratoListo', give: 'contrato' },
      { text: '¿Esto es una grúa o un animal prehistórico?', reply: '“Depende del seguro”, responde sin parpadear.' }
    ]
  },
  vecino: {
    title: 'Vecino curioso',
    options: [
      { text: '¿Puede apartarse un poco?', reply: 'El vecino se aparta medio metro. La cámara de su móvil, no.', flag: 'vecinoApartado' },
      { text: 'No grabe esto, por favor.', reply: '“Tranquilo, solo lo he subido a tres grupos y a mi cuñado”.' },
      { text: '¿Cree que saldrá bien?', reply: 'Se queda mirando la grúa. Luego mira la casa. Luego se ríe con miedo.' }
    ]
  },
  voz: {
    title: 'Voz interior',
    options: [
      { text: 'Esto tiene arreglo.', reply: 'Tu cerebro aplaude una mentira necesaria.', flag: 'autoengano' },
      { text: 'Técnicamente, sigue siendo una vivienda.', reply: 'La frase queda desbloqueada. Nadie sabe si eso es bueno.', flag: 'fraseTecnica' },
      { text: 'Quizá debería dedicarme a otra cosa.', reply: 'Una carta oficial parece escuchar desde la mesa.' }
    ]
  },
  alumno: {
    title: 'Alumno de FP Básica',
    options: [
      { text: 'Buenos días, sacad el libro.', reply: 'Un avión de papel aterriza en tu café imaginario.', flag: 'intentoClase' },
      { text: 'Hoy veremos herramientas de jardinería.', reply: 'Alguien pregunta si una grúa araña cuenta como herramienta.', flag: 'explicoJardineria' },
      { text: 'Por favor, silencio.', reply: 'El aula interpreta “silencio” como una sugerencia experimental.' }
    ]
  }
};
