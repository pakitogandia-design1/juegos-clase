# Potencia Pop Arcade

Juego educativo tipo bubble shooter creado con **HTML + CSS + JavaScript + Phaser 3**.

## Cómo funciona

- El tablero muestra resultados: `25`, `36`, `64`, `125`...
- El cañón dispara potencias: `5²`, `6²`, `4³`...
- Al pegarse al tablero, la burbuja disparada se transforma en su resultado.
- Si forma un grupo conectado de 3 o más resultados iguales, explotan.
- Las burbujas desconectadas del techo caen y dan puntos extra.
- El tablero baja con el tiempo y por disparos. Si cruza la línea de peligro, se pierde una vida.

## Modos

- **Normal**: con guía y próxima burbuja visible.
- **Difícil**: sin guía, próxima burbuja visible.
- **Pesadilla**: sin guía, sin próxima burbuja y mayor velocidad.

## Archivos

```text
index.html
style.css
src/main.js
src/scenes/GameScene.js
src/systems/BubbleGrid.js
src/systems/AudioSystem.js
src/systems/SaveSystem.js
src/data/powers.js
src/data/levels.js
src/data/achievements.js
```

## Publicación en GitHub Pages

Sube todos los archivos a tu repositorio y activa GitHub Pages. El juego carga Phaser desde CDN:

```html
https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.min.js
```

No necesita backend. El progreso se guarda en el navegador con `localStorage`.
