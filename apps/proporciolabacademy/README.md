# ProporcioLab Academy

Juego educativo visual sobre proporcionalidad directa, proporcionalidad inversa, interés simple e interés compuesto.

## Cómo abrirlo

Sube la carpeta completa a GitHub Pages, Cloudflare Pages o cualquier hosting estático y abre `index.html`.

Para probarlo en local, usa un servidor simple desde la carpeta del juego:

```bash
python -m http.server
```

Después abre `http://localhost:8000`.

## Contenido integrado

- 260 retos: directa, inversa, interés simple, interés compuesto y mixtos.
- 110 coleccionables visuales: gorros, mascotas, fondos e insignias.
- 25 logros funcionales.
- Tienda con cajas de recompensa.
- ProporCoins, duplicados convertidos en monedas y guardado local.
- ProblemaLab para convertir problemas en misiones visuales.
- Guía visual con tutorial no obligatorio.

## Estructura

- `js/data/challenges.js`: banco de retos.
- `js/data/collectibles.js`: coleccionables.
- `js/data/lootBoxes.js`: cajas.
- `js/data/achievements.js`: logros.
- `js/data/economy.js`: economía y valores base.
- `js/main.js`: lógica del juego.

## Nota técnica importante

El archivo `lib/phaser.min.js` está incluido como runtime local de compatibilidad/placeholder. En este entorno no se pudo descargar el archivo oficial de Phaser por una restricción de descarga de JavaScript. El juego entregado es autocontenido y funciona sin dependencias externas mediante runtime local DOM/canvas.

Si quieres sustituirlo por Phaser oficial, descarga `phaser.min.js` desde la página oficial de Phaser 3.80.1 y reemplaza `lib/phaser.min.js`. La versión actual ya funciona sin conexión externa.


## Carpetas de assets

- `assets/audio/`: contiene un README. Los sonidos actuales se generan por código con Web Audio API, así que no hacen falta archivos de audio externos.
- `assets/fonts/`: contiene un README. El juego usa fuentes del sistema para evitar dependencias externas.

Estas carpetas se mantienen preparadas por si en el futuro se quieren añadir sonidos o fuentes locales.

## Borrar progreso

Desde el juego: Opciones → Borrar progreso.

También puedes borrar el almacenamiento local del navegador. La clave usada es:

`proporciolab_academy_save_v1`
