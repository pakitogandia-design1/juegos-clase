# LA GRÚA DEL DESTINO (AUTOAVENTURA LIGERA)

Versión independiente y robusta del autojuego narrativo.

## Qué cambia respecto a la versión anterior

- No usa Phaser.
- No usa CDN.
- No precarga todas las imágenes a la vez.
- Las imágenes están comprimidas en JPG para GitHub Pages.
- El juego carga una imagen por pantalla.
- Diálogos grandes y visibles.
- Incluye 30 pantallas visuales.

## Cómo subir a GitHub Pages

Sube estos archivos directamente a la raíz del repositorio:

```text
index.html
src/
assets/
README.md
```

No los metas dentro de otra carpeta si quieres que GitHub Pages abra el juego directamente.

Después ve a:

Settings → Pages → Deploy from a branch → main → /root → Save

## Cómo probar en local

```bash
python -m http.server 8000
```

Abre:

```text
http://localhost:8000
```

## Controles

- Empezar: inicia desde cero.
- Continuar: recupera la última pantalla guardada.
- Siguiente paso: avanza la historia.
- Saltar pantalla +: salta a la siguiente imagen narrativa.
- Reiniciar: vuelve al principio.
