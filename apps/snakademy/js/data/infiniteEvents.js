export const INFINITE_EVENTS = [
  {
    "id": "EV_ORB_RAIN",
    "name": "Lluvia de orbes",
    "minLevel": 2,
    "durationSec": 12,
    "description": "Aparecen muchos orbes durante unos segundos.",
    "effect": {
      "type": "orbRain"
    }
  },
  {
    "id": "EV_GOLD_RAIN",
    "name": "Lluvia dorada",
    "minLevel": 4,
    "durationSec": 10,
    "description": "Aparecen monedas y orbes dorados.",
    "effect": {
      "type": "goldRain"
    }
  },
  {
    "id": "EV_SPEED",
    "name": "Velocidad creciente",
    "minLevel": 3,
    "durationSec": 12,
    "description": "La velocidad sube temporalmente.",
    "effect": {
      "type": "speedRamp"
    }
  },
  {
    "id": "EV_GHOST_ORBS",
    "name": "Orbes fantasma",
    "minLevel": 5,
    "durationSec": 14,
    "description": "Aparecen orbes fantasma de alto valor.",
    "effect": {
      "type": "ghostOrbs"
    }
  },
  {
    "id": "EV_PORTALS",
    "name": "Portales inestables",
    "minLevel": 6,
    "durationSec": 16,
    "description": "Aparecen portales temporales.",
    "effect": {
      "type": "temporaryPortals"
    }
  },
  {
    "id": "EV_MOVING_WALLS",
    "name": "Paredes móviles",
    "minLevel": 8,
    "durationSec": 12,
    "description": "Algunos obstáculos se mueven con aviso.",
    "effect": {
      "type": "movingWalls"
    }
  },
  {
    "id": "EV_SOFT_FOG",
    "name": "Niebla suave",
    "minLevel": 7,
    "durationSec": 10,
    "description": "El fondo se atenúa, pero los orbes siguen resaltados.",
    "effect": {
      "type": "softFog"
    }
  }
];
