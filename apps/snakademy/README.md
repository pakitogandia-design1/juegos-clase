# Snakademy

**Snakademy** es un Snake arcade roguelike con colección, tienda, mutaciones, power ups, modo infinito y controles táctiles pensados para no tapar el tablero.

Subtítulo: **Cada orbe cambia la run.**

## Cómo probarlo

Para evitar restricciones de módulos ES en algunos navegadores, abre el juego con un servidor local:

```bash
python -m http.server
```

Después entra en:

```text
http://localhost:8000
```

También puedes subir la carpeta completa a GitHub Pages, Cloudflare Pages o cualquier hosting estático.

## Modos incluidos

- **Expedición Roguelike**: 20 cámaras, mutaciones entre cámaras, obstáculos, jefes/eventos y pantalla de resultados.
- **Modo Infinito**: partida continua sin cambios de pantalla, subida de nivel cada 10 orbes, eventos y mutaciones automáticas.
- **Práctica**: mini partida para probar controles sin presión.

## Controles

### PC

- Flechas / WASD: mover.
- Espacio: Fase Snake.
- Shift: freno si tienes la mutación correspondiente.
- P / Esc: pausa.

### Móvil / táctil

- Tocar el lado izquierdo del tablero: girar a la izquierda.
- Tocar el lado derecho del tablero: girar a la derecha.
- Botón pequeño de Fase Snake fuera del tablero.
- Botón de pausa fuera del tablero.

No hay cruceta ni botones grandes encima del tablero.

## Contenido integrado

- 60 mutaciones roguelike.
- 12 power ups.
- 7 tipos de orbe.
- 10 tipos de cámara.
- 4 jefes/eventos jefe.
- 7 eventos de infinito.
- 140 coleccionables visuales.
- 25 logros funcionales.
- 4 cajas de recompensa.
- Economía con SnakeCoins.
- Guardado local.

## Datos

Los bancos están en:

```text
js/data/
```

Archivos principales:

- `upgrades.js`
- `powerUps.js`
- `orbs.js`
- `rooms.js`
- `bosses.js`
- `infiniteEvents.js`
- `collectibles.js`
- `lootBoxes.js`
- `achievements.js`
- `economy.js`

## Guardado

El progreso se guarda en `localStorage` con la clave:

```text
snakademy_save_v1
```

Puede borrarse desde **Opciones → Borrar progreso**.

## Nota sobre Phaser local

El proyecto incluye `lib/phaser.min.js` como archivo local de compatibilidad. En este entorno no se ha podido descargar el archivo oficial de Phaser 3 por falta de resolución DNS/acceso de red.

El juego entregado funciona de forma autocontenida sin internet. Si necesitas que el archivo sea exactamente el oficial de Phaser 3, descarga `phaser.min.js` desde la distribución oficial de Phaser y reemplaza:

```text
lib/phaser.min.js
```

No hace falta modificar el resto del juego para jugar a esta versión.


## Corrección visual incluida

Esta versión aplica de forma real el equipamiento visual:

- Las skins cambian los colores, patrones y detalles del cuerpo de la serpiente.
- Las cabezas modifican detalles de la cabeza: cobra, robot, dragón, fantasma, cristal, etc.
- Los rastros se dibujan en partida sin ocultar la cola.
- Las mascotas del menú son distintas entre sí y tienen una forma/tema propio.


## Parche colección y perfil

Esta versión añade:

- Rastro más visible en partida.
- Perfil visible en el menú principal con insignia equipada y marco según rareza.
- En Colección, hacer clic en un objeto desbloqueado lo equipa automáticamente.
- Si haces clic en un objeto ya equipado, se desequipa y vuelve al objeto inicial de esa categoría.
