# FUTMOV

Juego arcade de reflejos y fútbol competitivo creado con Phaser 3, HTML5, CSS y JavaScript modular.

## Cómo jugar

- `.00` = gol directo.
- `.01`, `.02`, `.03` = penalti.
- `.97`, `.98`, `.99` = falta.
- En penalti: una tirada extra; centésima par = gol, impar = fallo.
- En falta: 3 centésimas pares seguidas = gol; si sale impar, fallo.
- Si marcas, sigues tirando.
- Si fallas, cambia el turno.
- Contra IA siempre empieza el jugador humano.

## Modos incluidos

- Partido local 1 vs 1.
- Vs IA con dificultad fácil, normal, difícil y legendaria.
- Torneo eliminatorio con humanos e IA, generación de nombres IA y BYE automático.
- Campaña roguelike con powerups exclusivos del modo campaña.
- Entrenamiento.
- Colección de rivales IA.
- Logros y progreso.
- Ranking local.
- Ajustes de audio y borrado de progreso.

## Powerups

Los powerups solo existen en el modo Campaña. Derrotar rivales IA en campaña cuenta para la colección aunque se hayan usado powerups.

## Publicación en GitHub Pages

Sube todo el contenido de esta carpeta a un repositorio y activa GitHub Pages. El juego usa Phaser 3 desde CDN.

## Estructura

```text
index.html
styles.css
src/
  core/
  data/
  scenes/
  ui/
```

## Notas

- El progreso se guarda en `localStorage`.
- Los sonidos y la música se generan con WebAudio, sin archivos pesados.
- Los assets visuales son ligeros y procedurales.
