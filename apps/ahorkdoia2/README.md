# AhorKDo IA: Última Letra

Roguelike arcade educativo de palabras ocultas creado con Phaser 3.

## Cómo usarlo

1. Sube todo el contenido de esta carpeta a un repositorio de GitHub.
2. Activa GitHub Pages desde la rama principal.
3. Abre la URL publicada.

No requiere instalación. Phaser 3 se carga por CDN.

## Estructura

- `index.html`: entrada del juego.
- `styles/style.css`: estilos básicos.
- `src/main.js`: configuración Phaser.
- `src/scenes`: pantallas del juego.
- `src/systems`: lógica de runs, palabras, progreso, sonidos, etc.
- `src/data`: bancos de palabras, Civilians, bosses, logros y powerups.

## Notas

El progreso se guarda en `localStorage`. La Run diaria se genera offline con una semilla basada en la fecha local.


## Powerups durante la partida

La pantalla de rescate muestra un panel de **POWERUPS** con dos zonas:

- Powerups pasivos: se aplican automáticamente cuando corresponde.
- Consumibles manuales: aparecen como botones durante la palabra y pueden usarse en el momento.

Consumibles manuales incluidos: revelar vocal, revelar consonante, pista gratis, curar 1 fallo, quitar letras incorrectas, revelar primera/última letra, revelar dos letras, ruleta buena y categoría.

Esta versión incluye corregido el error de sintaxis de `MenuScene.js` relacionado con el tween `y:"-=20"`.
