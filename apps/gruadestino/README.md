# La Grúa del Destino (AUTOAVENTURA)

Versión independiente y robusta del autojuego narrativo.

## Qué incluye

- 30 pantallas visuales.
- Todas las imágenes integradas en `assets/`.
- Botón **Siguiente paso**.
- Botón **Saltar pantalla +**.
- Textos y diálogos grandes.
- Guardado automático en `localStorage`.
- Sin CDN, sin Phaser y sin dependencias externas para evitar pantallas en blanco por precarga o bloqueo de librerías.

## Cómo probar en local

Desde la carpeta del proyecto:

```bash
python -m http.server 8000
```

Abre:

```text
http://localhost:8000
```

También puede abrirse directamente el `index.html`, aunque para GitHub Pages lo ideal es mantener la estructura tal cual.

## Cómo subir a GitHub Pages

Sube a la raíz del repositorio estos elementos:

```text
index.html
src/
assets/
README.md
```

En GitHub:

1. Settings.
2. Pages.
3. Source: Deploy from a branch.
4. Branch: main.
5. Folder: /(root).
6. Save.

## Nota

Esta versión reemplaza a la versión Phaser extendida porque aquella podía quedarse en blanco al intentar precargar muchas imágenes grandes desde el inicio. Esta carga solo la imagen de la pantalla actual.
