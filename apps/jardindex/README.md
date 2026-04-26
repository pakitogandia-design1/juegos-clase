# JardinDex FP Safor

Juego educativo web para CFGM Jardinería y Floristería: exploración, identificación, implantación y mantenimiento de 74 especies vegetales.

## Cómo subirlo a GitHub / Cloudflare Pages

1. Descomprime el ZIP.
2. Sube todos los archivos a un repositorio de GitHub.
3. En Cloudflare Pages, crea un proyecto desde ese repositorio.
4. Configuración recomendada:
   - Framework preset: `None` / `Static site`
   - Build command: vacío
   - Output directory: `/`
5. Publica.

## Imágenes

La versión actual usa fotos reales provisionales cargadas en vivo desde Wikimedia Commons y, si no encuentra resultado, desde iNaturalist. El juego cachea las URLs en el navegador para acelerar futuras cargas. Más adelante puedes sustituirlas por fotos reales de la escuela colocando archivos locales en:

`assets/img/species/<id_especie>/general.jpg`

El juego intenta primero la imagen local y después busca online.

## Zonas reales de la escuela

La zona de la escuela es una etiqueta informativa que el alumno elige desde desplegable. No puntúa ni penaliza.

- Invernadero
- Frontón
- Escaleras del Frontón
- Zona trasera Rosales
- Escaleras exteriores
- Jardín Delantero
- Jardín Interior

## Créditos de imágenes

Las imágenes provisionales se cargan desde fuentes externas con sus datos de origen cuando la API los devuelve. Consulta la pantalla “Créditos” dentro del juego.
