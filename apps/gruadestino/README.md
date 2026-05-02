# LA GRÚA DEL DESTINO — Versión corregida con imágenes nuevas integradas

## Qué se ha corregido

En el zip anterior las imágenes nuevas estaban dentro de `assets/artbook/`, pero las escenas jugables seguían cargando los archivos antiguos `assets/01-sueno-contenedor.jpg`, `assets/02-llegada-grua.jpg`, etc.

En esta versión se han sobrescrito esos archivos principales con las imágenes nuevas/crops generados, y además se ha añadido un parámetro `?v=2` en la carga de Phaser para evitar que el navegador use imágenes antiguas en caché.

## Imágenes principales que ahora usa el juego

- `assets/01-sueno-contenedor.jpg` — nueva escena cinematográfica del sueño del contenedor.
- `assets/02-llegada-grua.jpg` — nueva escena de llegada de la grúa.
- `assets/03-maniobra-imposible.jpg` — nueva escena de la maniobra.
- `assets/04-desastre.jpg` — nueva escena del desastre.
- `assets/05-casa-terrible.jpg` — nueva escena dentro de la casa terrible.
- `assets/06-caida-total.jpg` — nueva escena de la carta/facturas.
- `assets/07-fp-basica-caos.jpg` — nueva escena de FP Básica.
- `assets/menu-poster.jpg` — nuevo arte de menú.
- `assets/ending-poster.jpg` — nuevo arte final.

## Importante si ya probaste el zip anterior

Al abrirlo en el navegador, pulsa `Ctrl + F5` o borra la caché si ves todavía las imágenes antiguas. La versión corregida ya fuerza `?v=2`, pero GitHub Pages a veces mantiene archivos cacheados unos minutos.


---

# LA GRÚA DEL DESTINO — versión definitiva con imágenes integradas

Aventura gráfica **point & click** hecha con **Phaser 3**, HTML5, CSS y JavaScript modular, lista para subir a **GitHub Pages**.

La historia adapta la tragicomedia del hombre, la casa contenedor, la grúa imposible y el destino final en FP Básica.

## Qué incluye

- Menú inicial profesional.
- 7 escenas jugables.
- Hotspots interactivos.
- Acciones: **Mirar**, **Usar**, **Hablar**, **Coger**.
- Inventario visual.
- Objetos usables.
- Diálogos con opciones.
- Puzles sencillos.
- Transiciones y autoguardado en `localStorage`.
- Pantalla final y epílogo.
- Imágenes integradas en `assets/`.
- Galería de arte conceptual incluida en `assets/artbook/`.
- No necesita npm, Vite ni instalación.

## Árbol de archivos

```text
index.html
README.md
src/
  main.js
  styles.css
  data/
    scenesData.js
    itemsData.js
    dialoguesData.js
  scenes/
    BootScene.js
    MenuScene.js
    GameScene.js
    EndingScene.js
    CreditsScene.js
assets/
  01-sueno-contenedor.jpg
  02-llegada-grua.jpg
  03-maniobra-imposible.jpg
  04-desastre.jpg
  05-casa-terrible.jpg
  06-caida-total.jpg
  07-fp-basica-caos.jpg
  menu-poster.jpg
  ending-poster.jpg
  protagonista.png
  grua.png
  icono-*.png
  artbook/
```

## Imágenes incorporadas

Esta versión ya incluye fondos funcionales para todas las escenas:

1. `assets/01-sueno-contenedor.jpg` — El sueño del contenedor.
2. `assets/02-llegada-grua.jpg` — Llegada de la grúa.
3. `assets/03-maniobra-imposible.jpg` — Maniobra imposible.
4. `assets/04-desastre.jpg` — El desastre.
5. `assets/05-casa-terrible.jpg` — Casa contenedor en estado terrible.
6. `assets/06-caida-total.jpg` — Caída total.
7. `assets/07-fp-basica-caos.jpg` — FP Básica: el último destino.
8. `assets/menu-poster.jpg` — Menú principal.
9. `assets/ending-poster.jpg` — Pantalla final.

También se incluyen láminas extra de diseño, UI y arte conceptual en:

```text
assets/artbook/
```

## IMÁGENES QUE FRAN DEBE SUSTITUIR

**Ninguna obligatoria.**

El juego ya funciona con todas las imágenes integradas.  
Si más adelante quieres mejorar el acabado, puedes sustituir cualquier imagen manteniendo exactamente el mismo nombre de archivo y la misma carpeta.

Recomendación opcional:

- Sustituir `assets/02-llegada-grua.jpg` por una imagen individual limpia de la llegada de la grúa, si quieres menos apariencia de collage.
- Sustituir `assets/03-maniobra-imposible.jpg` por una imagen individual limpia del contenedor suspendido en el aire.
- Sustituir `assets/06-caida-total.jpg` por una imagen individual del protagonista leyendo la carta GVA.

Si no sustituyes nada, el juego seguirá funcionando correctamente.

## Cómo probarlo en local

No abras `index.html` directamente con doble clic, porque los módulos JavaScript suelen necesitar servidor local.

Desde la carpeta del proyecto ejecuta:

```bash
python -m http.server 8000
```

Luego abre en el navegador:

```text
http://localhost:8000
```

## Cómo subirlo a GitHub Pages

1. Crea un repositorio en GitHub.
2. Sube todo el contenido de esta carpeta, no la carpeta comprimida.
3. En GitHub, entra en **Settings > Pages**.
4. En **Source**, elige la rama principal y la carpeta `/root`.
5. Guarda.
6. Espera a que GitHub genere la URL pública.

## Cómo jugar

1. Pulsa **Nueva partida**.
2. Selecciona una acción: **Mirar**, **Usar**, **Hablar** o **Coger**.
3. Toca/clica los hotspots de la escena.
4. Recoge objetos y úsalos en el lugar adecuado.
5. Habla con personajes cuando aparezcan.
6. Resuelve cada escena para avanzar.

## Consejos de edición

- Las escenas se editan en `src/data/scenesData.js`.
- Los objetos del inventario se editan en `src/data/itemsData.js`.
- Los diálogos se editan en `src/data/dialoguesData.js`.
- Puedes cambiar textos, posiciones de hotspots y objetivos sin tocar la lógica principal.

## Nota artística

El juego mantiene una estética tragicómica, absurda y cinematográfica.  
La casa contenedor representa la esperanza, la grúa representa la falsa solución, y FP Básica representa el remate cruel del destino.

Frase final obligatoria incluida:

> Por muy mal que te vaya la vida, piensa que siempre te puede ir peor.
