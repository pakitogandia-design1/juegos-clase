# Raíces Cruzadas · Phaser 3 real

Esta versión sí carga Phaser 3 y crea el juego con `new Phaser.Game(config)`.

## Incluye

- Escenas Phaser: menú, modos, crucigrama, cajas, armario, colección, Matemonario, tienda, expedición, perfil y opciones.
- Tablero de crucigrama renderizado en canvas Phaser.
- Campo de respuesta creado con DOM de Phaser para facilitar escritura en móvil.
- Cajas con animación de apertura.
- Armario con avatar grande y equipables por ranura.
- Botones de quitar por ranura, desequipar todo y reparar armario.
- Pista extra diferente a la pista principal.
- Recursos conseguibles y tienda de conversiones.
- Diagnóstico, exportación e importación de progreso.

## Ruta recomendada

Subir la carpeta `raicescruzadas` a:

```text
apps/raicescruzadas/
```

## Nota

Phaser se carga desde CDN. Para uso completamente offline, descarga `phaser.min.js`, colócalo en `lib/phaser.min.js` y cambia el script del `index.html`.
