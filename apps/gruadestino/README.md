# LA GRÚA DEL DESTINO (AUTOAVENTURA EXTENDIDA)

Versión independiente tipo autojuego narrativo. No es un parche: es un juego aparte completo.

## Qué incluye

- Phaser 3 desde CDN.
- 30 pantallas visuales integrando las imágenes creadas.
- Botón **Siguiente paso** para avanzar automáticamente.
- Botón **Saltar +** para pasar a la siguiente pantalla visual.
- Diálogos grandes y visibles.
- Guardado automático en `localStorage`.
- Menú, continuar, reiniciar y final.
- Todos los assets necesarios dentro de `assets/`.

## Cómo probar en local

```bash
python -m http.server 8000
```

Abre:

```text
http://localhost:8000
```

## Cómo subir a GitHub Pages

Sube el contenido de esta carpeta a la raíz del repositorio, de forma que `index.html` quede directamente en la raíz.

Estructura esperada:

```text
index.html
src/main.js
src/styles.css
assets/
README.md
```

En GitHub: Settings → Pages → Deploy from a branch → `main` → `/root`.

## Nota

Esta versión no depende del juego anterior ni de los parches de Autoaventura. Es un proyecto nuevo y separado.
