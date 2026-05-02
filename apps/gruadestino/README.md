# LA GRÚA DEL DESTINO

Aventura gráfica point & click en Phaser 3, HTML5 y JavaScript modular, lista para subir a GitHub Pages.

El juego adapta la tragicomedia del hombre, la grúa araña, la casa contenedor china, la vida en ruina y el destino final en FP Básica.

## Estructura del proyecto

```text
la-grua-del-destino/
├── index.html
├── README.md
├── assets/
│   ├── 01-sueno-contenedor.jpg
│   ├── 02-llegada-grua.jpg
│   ├── 03-maniobra-imposible.jpg
│   ├── 04-desastre.jpg
│   ├── 05-casa-terrible.jpg
│   ├── 06-caida-total.jpg
│   ├── 07-fp-basica-caos.jpg
│   ├── menu-poster.jpg
│   ├── ending-poster.jpg
│   ├── protagonista.png
│   ├── grua.png
│   └── icono-*.png
└── src/
    ├── main.js
    ├── styles.css
    ├── data/
    │   ├── scenesData.js
    │   ├── dialoguesData.js
    │   └── itemsData.js
    └── scenes/
        ├── BootScene.js
        ├── MenuScene.js
        ├── GameScene.js
        ├── UIScene.js
        ├── EndingScene.js
        └── CreditsScene.js
```

## Qué incluye

- Menú inicial profesional.
- 7 escenas jugables.
- Hotspots interactivos.
- Acciones: **Mirar**, **Usar**, **Hablar**, **Coger**.
- Inventario visual.
- Diálogos con opciones.
- Puzles sencillos por escena.
- Movimiento simulado del protagonista hacia el hotspot.
- Guardado automático en `localStorage`.
- Botón continuar, nueva partida y reiniciar progreso.
- Pantalla final y epílogo.
- Adaptación responsive para PC, tablet y móvil.
- Aviso amable en móvil vertical.
- Phaser 3 desde CDN, sin npm ni Vite.

## Imágenes incluidas

Esta versión incluye fondos ya preparados a partir de las imágenes generadas en el chat:

- `assets/01-sueno-contenedor.jpg`
- `assets/02-llegada-grua.jpg`
- `assets/03-maniobra-imposible.jpg`
- `assets/04-desastre.jpg`
- `assets/05-casa-terrible.jpg`
- `assets/06-caida-total.jpg`
- `assets/07-fp-basica-caos.jpg`
- `assets/menu-poster.jpg`
- `assets/ending-poster.jpg`

También incluye iconos provisionales de inventario y siluetas/elementos de apoyo:

- `assets/protagonista.png`
- `assets/grua.png`
- `assets/icono-casco.png`
- `assets/icono-planos.png`
- `assets/icono-telefono.png`
- `assets/icono-cincha.png`
- `assets/icono-contrato.png`
- `assets/icono-llave-inglesa.png`
- `assets/icono-factura.png`
- `assets/icono-cubo.png`
- `assets/icono-cafe.png`
- `assets/icono-manta.png`
- `assets/icono-libro-jardineria.png`
- `assets/icono-tiza.png`
- `assets/icono-parte.png`

## IMÁGENES QUE FRAN DEBE SUSTITUIR

No es obligatorio sustituir nada para que el juego funcione. El juego ya trae fondos provisionales funcionales. Pero para dejarlo perfecto, puedes reemplazar estas imágenes por versiones más concretas de cada escena:

1. `assets/01-sueno-contenedor.jpg`  
   - Imagen original recomendada: el primer collage o una escena limpia donde se vea la casa contenedor como sueño inicial.  
   - Se usa en: **El sueño del contenedor**.  
   - Si no la sustituyes: se usará el fondo incluido de la grúa y la casa contenedor.

2. `assets/02-llegada-grua.jpg`  
   - Imagen original recomendada: escena donde la grúa araña aparece majestuosa con la casa contenedor.  
   - Se usa en: **La llegada de la grúa**.  
   - Si no la sustituyes: se usará el mismo fondo incluido de la primera gran maniobra.

3. `assets/03-maniobra-imposible.jpg`  
   - Imagen original recomendada: la grúa levantando la casa con tensión, cables, naranjos y peligro.  
   - Se usa en: **La maniobra imposible**.  
   - Si no la sustituyes: se usará el collage del desastre como fondo dramático.

4. `assets/04-desastre.jpg`  
   - Imagen original recomendada: la imagen del accidente y los daños.  
   - Se usa en: **El desastre**.  
   - Si no la sustituyes: se usará el fondo incluido del desastre.

5. `assets/05-casa-terrible.jpg`  
   - Imagen original recomendada: el hombre viviendo en la casa contenedor en estado terrible.  
   - Se usa en: **La casa contenedor en estado terrible**.  
   - Si no la sustituyes: se usará el fondo incluido de vida miserable en la casa.

6. `assets/06-caida-total.jpg`  
   - Imagen original recomendada: el hombre leyendo la carta GVA o una escena interior de hundimiento personal.  
   - Se usa en: **La caída total**.  
   - Si no la sustituyes: se usará el mismo fondo incluido de la casa terrible.

7. `assets/07-fp-basica-caos.jpg`  
   - Imagen original recomendada: el collage del aula de FP Básica fuera de control.  
   - Se usa en: **FP Básica: el último destino**.  
   - Si no la sustituyes: se usará el fondo incluido del aula caótica.

8. `assets/menu-poster.jpg` y `assets/ending-poster.jpg`  
   - Imagen original recomendada: el póster de película “Siempre puede ir peor”.  
   - Se usa en: menú y final.  
   - Si no la sustituyes: ya está incluido un fondo tipo póster.

## Cómo probar en local

No abras `index.html` directamente con doble clic, porque los módulos JavaScript necesitan servidor local.

Opción sencilla con Python:

```bash
cd la-grua-del-destino
python -m http.server 8000
```

Luego abre:

```text
http://localhost:8000
```

## Cómo subir a GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube todo el contenido de la carpeta `la-grua-del-destino`.
3. En GitHub, ve a **Settings > Pages**.
4. En **Build and deployment**, elige:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Guarda.
6. Espera a que GitHub genere la URL.

## Consejos para mejorar los fondos

- Mantén los nombres exactos de archivo.
- Usa formato `.jpg` para fondos grandes.
- Tamaño recomendado: `1600x900` o superior en 16:9.
- Para móvil, evita texto muy pequeño dentro del propio fondo.
- Si cambias las imágenes, no necesitas tocar el código.

## Ampliar el juego

Las escenas están en:

```text
src/data/scenesData.js
```

Cada hotspot tiene:

- `id`
- `name`
- posición relativa `x`, `y`, `w`, `h`
- textos de `look`, `use`, `take`
- posible `talk`
- posible objeto requerido `requires`
- posible objeto obtenido `give`
- posible bandera de progreso `flag`

Para añadir una escena nueva, duplica un bloque dentro de `scenesData.js`, añade su fondo en `assets/` y ajusta `nextWhen`.

## Nota de diseño

He priorizado una versión compacta, robusta y jugable, con una sola escena principal (`GameScene`) que integra interfaz y aventura. El archivo `UIScene.js` queda reservado para una ampliación futura si quieres separar la interfaz en otra escena Phaser.
