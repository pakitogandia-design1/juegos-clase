# LA GRÚA DEL DESTINO (AUTOAVENTURA CANVAS)

Versión independiente del autojuego, hecha en **HTML + Canvas + JavaScript**, sin Phaser y sin dependencias externas.

## Qué incluye

- 30 pantallas visuales.
- Autoaventura paso a paso.
- Guardado automático en `localStorage`.
- Botones: **Empezar**, **Continuar**, **Siguiente paso**, **Saltar escena +**, **Reiniciar** y **Menú**.
- Todas las imágenes ya incluidas y comprimidas.

## Estructura

```text
index.html
src/
  app.js
  chapters.js
  styles.css
assets/
  00-menu-poster.jpg
  01-sueno-contenedor.jpg
  ...
  29-galeria-caos.jpg
```

## Cómo probarlo en local

Opción rápida con Python:

```bash
python -m http.server 8000
```

Luego abre:

```text
http://localhost:8000
```

## Cómo subirlo a GitHub Pages o Cloudflare Pages

Sube **el contenido de este zip** a la raíz del proyecto publicado, de modo que queden directamente:

```text
index.html
src/
assets/
README.md
```

## Notas

- No usa CDN.
- No usa build.
- No depende de npm.
- Está pensado para evitar problemas de despliegue.
