# Gondal Evil: VR Kebab Outbreak

Survival horror paródico en Phaser 3, listo para subir a GitHub Pages dentro de la Biblioteca Gamer.

## Instalación en el repo

Carpeta recomendada:

```txt
apps/gondal-evil/
```

Sube todo el contenido de esta carpeta a esa ruta. El juego se abre en:

```txt
apps/gondal-evil/
```

## Controles

### Ordenador

- WASD o flechas: mover al héroe.
- Ratón: apuntar.
- Clic: disparo/acción arcade.
- Espacio: esquiva.
- E: usar kebab / calmar a Laura.
- Q: bengala.
- ESC: pausa.

### Móvil

- Joystick virtual izquierdo.
- Botón FUEGO.
- Botón ESQ.
- Botón USAR.
- Botón PAUSA.

## Modos

- Modo Historia: 7 capítulos.
- Supervivencia: oleadas infinitas.
- Logros y colección: guardado en localStorage.

## Tarjeta para el índice principal

Añade esta tarjeta dentro del `<div class="rejilla" id="rejilla">` del `index.html` principal:

```html
<article class="tarjeta" data-category="arcade" data-title="gondal evil" data-keywords="gondal evil resident survival horror parodia vr kebab outbreak arcade acción phaser3 móvil ordenador logros supervivencia">
  <div class="card-top">
    <div class="icono">🧟</div>
    <div class="badges">
      <span class="meta">Arcade / Otros</span>
      <span class="tipo">Survival horror</span>
    </div>
  </div>
  <h3>Gondal Evil</h3>
  <p>Survival horror paródico en Phaser 3: rescata a Laura, sobrevive a la invasión de Gondals VR y escapa entre lluvia, bengalas, kebabs y caos.</p>
  <a class="boton" href="apps/gondal-evil/"><span>Abrir juego</span><span aria-hidden="true">➜</span></a>
</article>
```

Después actualiza los contadores del índice principal si quieres que el número inicial coincida con el total de tarjetas.

## Notas técnicas

- No necesita instalación ni build.
- Usa Phaser 3 desde CDN.
- Los sprites principales se generan por código para que el juego sea ligero.
- Las imágenes de historia incluidas en `assets/story/` están comprimidas para carga rápida.
- El progreso se guarda localmente en el navegador con la clave `gondal_evil_save_v1`.

