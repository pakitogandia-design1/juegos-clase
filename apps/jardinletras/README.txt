Jardín de Letras V1.0.3
======================

Ruta recomendada en GitHub/Cloudflare:
apps/jardindeletras/

Incluye:
- Phaser 3 por CDN.
- Banco original AhorKDo IA convertido a Códex.
- Bancos nuevos profesionales y divertidos.
- Filtro de palabras jugables entre 3 y 20 letras.
- Modo misión con pistas progresivas.
- Expedición roguelike sencilla con eventos y boss final.
- Powerups consumibles de uso único.
- Códex, colección, tienda y logros paginados.
- Tooltips con fecha de obtención.
- Nombre del jugador editable en Opciones.
- Guardado local con localStorage.
- Opciones: nombre del jugador, sonido, información del banco y reinicio seguro.

Notas:
- La tienda no muestra objetos ya poseídos.
- Las cajas pueden dar repetidos; se convierten en Polvo de letras.
- Volver al menú desde una partida guarda el estado y permite continuar.
- El juego funciona sin backend.


Actualización 1.0.1:
- Eliminado el bloque de modo docente/pruebas de Opciones.
- Contratos reorganizados en tarjetas más grandes para evitar solapes en móvil.
- Las pistas muestran la inicial gratuita de la palabra.
- La Lupa de vivero ahora revela las dos primeras letras como ayuda extra.

Actualización 1.0.2:
- Los powerups ya no se gastan al tocar su botón.
- Primer toque/click: abre una ventana con nombre, descripción, coste, cantidad y objetivo seleccionado.
- El powerup solo se consume al pulsar “Usar powerup”.
- Añadido aviso en la zona de powerups: toca para ver qué hace.

Actualización 1.0.3:
- La pista gratuita ahora es orientativa de verdad: inicial + contexto + subcategoría + longitud.
- Para el banco original se priorizan las pistas técnicas/finales buenas del documento.
- Para bancos nuevos se sustituyen pistas genéricas por contexto útil según categoría y subcategoría.
- La Regadera mental compra una única pista decisiva por palabra.
- Las pistas de partida ahora aparecen en tarjetas paginadas para evitar solapes en móvil.
