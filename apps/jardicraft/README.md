# JardiCraft FP

JardiCraft FP es un juego educativo de jardineria en 2D pseudo-voxel hecho con Phaser 3, HTML, CSS y JavaScript modular. Esta version esta pensada para subirse directamente a GitHub Pages o Cloudflare Pages.

## Vision del juego

Construye, planta, cuida y mejora un jardin por bloques. El juego incluye Aventura Verde, modo Creativo, JardiDex, Mercado Verde, Armario Verde, personalizacion del avatar, logros, misiones, crafteo, clima, estaciones, biodiversidad, notificaciones, diario y guardado local.

Todos los assets visuales principales se generan por codigo con estilo pixel-art/voxel falso. No se usan assets oficiales de Minecraft.

## Como jugar

### Controles de ordenador

- WASD o flechas: mover al personaje.
- Raton: seleccionar casilla.
- Click: usar herramienta activa.
- Teclas 1 a 9: cambiar herramienta de la barra rapida.
- E: inventario.
- J: JardiDex.
- M: mapa.
- C: banco de trabajo/crafteo.
- Esc: pausa o atras.

### Herramientas de la barra rapida

1. Azada: labra la tierra.
2. Pala: retira o remueve.
3. Regadera: riega plantas.
4. Tijeras: poda.
5. Pulverizador: trata plagas.
6. Semillas/planton: planta la especie seleccionada.
7. Compost: mejora el suelo.
8. Camino: coloca camino.
9. Mano: interactua con caseta, banco de trabajo y elementos.

## Modos de juego

### Aventura Verde

Modo principal. Permite progresar con Puntos Verdes, misiones, colecciones, logros, JardiDex, tienda y avatar.

### Creativo

Modo libre con muchos recursos para construir y probar composiciones sin presion.

## Menus principales

- Inventario.
- JardiDex.
- Mercado Verde.
- Armario Verde.
- Misiones.
- Logros.
- Mapa Verde.
- Diario del Jardinero.
- Buzon Verde.
- Resumen del jardin.
- Ajustes.

Al abrir menus grandes, el mundo se pausa automaticamente. Al cerrar el menu, la partida continua exactamente donde estaba.

## Guardado

El juego guarda en localStorage del navegador. Se guarda automaticamente en momentos importantes y tambien desde Ajustes.

Para borrar una partida, entra en Ajustes y usa Borrar partida.

## Como subirlo a GitHub Pages

1. Crea un repositorio nuevo.
2. Sube todo el contenido de esta carpeta, manteniendo `index.html`, `src/` y `assets/`.
3. En GitHub, entra en Settings > Pages.
4. Elige la rama principal y la carpeta raiz.
5. Guarda y abre la URL publicada.

## Uso local

Por usar modulos JavaScript, lo mas fiable es abrirlo con un servidor local.

Opcion con Python:

```bash
python -m http.server 8000
```

Luego abre:

```txt
http://localhost:8000
```

Tambien puede funcionar en algunos navegadores abriendo `index.html`, pero se recomienda servidor local.

## Estructura de carpetas

```txt
index.html
src/
  main.js
  styles.css
  scenes/
  systems/
  data/
assets/
  audio/
  sprites/
  ui/
```

## Como ampliar plantas

Edita:

```txt
src/data/plants.js
```

Cada planta tiene datos como nombre comun, nombre cientifico, tipo, coleccion, luz, riego, suelo y error frecuente.

## Como ampliar logros

Edita:

```txt
src/data/achievements.js
```

Cada logro tiene id, nombre, descripcion, objetivo, recompensa y tipo.

## Como ampliar ropa y accesorios

Edita:

```txt
src/data/outfits.js
```

Puedes anadir gorros, ropa, mochilas, botas, guantes, accesorios y sets completos.

## Como ampliar tienda

Edita:

```txt
src/data/shop.js
src/data/decorations.js
src/data/outfits.js
```

El Mercado Verde evita duplicados en objetos de propiedad unica.

## Notas de esta version

Esta version es una base completa y jugable. Algunas mecanicas estan simplificadas para mantener el proyecto ligero y facil de ampliar:

- Los sprites se generan por codigo.
- El sonido es sintetico con WebAudio.
- El sistema de coleccion, tienda, logros y JardiDex ya esta estructurado para ampliaciones futuras.
- El juego usa Phaser 3 desde CDN, por lo que necesita conexion a internet salvo que descargues Phaser y lo enlaces localmente.

## Creditos

Juego original creado para uso educativo en Formacion Profesional de jardineria y floristeria.

## Cambios de esta versión

- Inventario mejorado con selector visual de plantas: al elegir una planta, la semilla planta esa especie.
- Nueva caja de sugerencias en el HUD con el siguiente paso recomendado según la casilla seleccionada y la herramienta activa.
- Misiones más visuales, con tarjetas, estado activo/completado y barra de progreso.
- Se elimina la apertura automática del tutorial inicial.
- El avatar ahora cambia visualmente al equipar gorros, ropa, mochilas, botas y accesorios desde el Armario Verde.
