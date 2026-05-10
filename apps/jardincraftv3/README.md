# JardiCraft FP v3

Juego educativo de jardinería en Phaser 3 con estética pixel-art pseudo-voxel, preparado para GitHub Pages.

## Controles

- WASD o flechas: mover personaje.
- Click: seleccionar/actuar sobre casilla.
- 1-9: elegir slot de la barra rápida.
- E: inventario.
- C: banco de trabajo.
- J: JardiDex.
- M: mapa.
- Q/R: cambiar planta preparada.
- Esc: menú/pausa.

## Novedades v3

- Inventario rediseñado en cuadrícula con pestañas.
- Pestaña **Crafteados** para ver lo fabricado en el banco de trabajo.
- Ficha lateral del objeto seleccionado.
- Acciones contextuales: plantar, equipar y enviar a barra rápida.
- Objetos nuevos marcados como **NUEVO**.
- Banco de trabajo más visual con ingredientes disponibles y resultado.
- Panel de misión activa más visual.
- Panel de acción actual y sugerencias reubicadas para evitar solapes.
- Mensajes de acción tipo toast colocados sobre la barra rápida.
- Guardado de planta seleccionada, barra rápida y selección de inventario.

## Uso local

Para evitar problemas con módulos ES, prueba con un servidor local:

```bash
python -m http.server 8000
```

Luego abre `http://localhost:8000`.

## GitHub Pages / Cloudflare Pages

Sube todo el contenido de esta carpeta a `apps/jardicraft/`.
