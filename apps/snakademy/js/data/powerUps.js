export const POWER_UPS = [
  {
    "id": "PU_SHIELD",
    "name": "Escudo",
    "rarity": "common",
    "description": "Añade 1 escudo temporal.",
    "durationMs": 0,
    "effect": {
      "type": "addShield",
      "amount": 1
    }
  },
  {
    "id": "PU_GHOST",
    "name": "Fantasma",
    "rarity": "rare",
    "description": "Atraviesas tu cola durante 5 segundos.",
    "durationMs": 5000,
    "effect": {
      "type": "phase",
      "target": "tail"
    }
  },
  {
    "id": "PU_MAGNET",
    "name": "Imán",
    "rarity": "common",
    "description": "Atrae orbes y monedas cercanas durante 7 segundos.",
    "durationMs": 7000,
    "effect": {
      "type": "magnet",
      "radiusCells": 4
    }
  },
  {
    "id": "PU_SLOW",
    "name": "Ralentizador",
    "rarity": "common",
    "description": "Reduce la velocidad durante 6 segundos.",
    "durationMs": 6000,
    "effect": {
      "type": "speedMultiplier",
      "factor": 0.72
    }
  },
  {
    "id": "PU_TURBO",
    "name": "Turbo",
    "rarity": "rare",
    "description": "Aumenta velocidad y multiplica monedas durante 5 segundos.",
    "durationMs": 5000,
    "effect": {
      "type": "turbo",
      "speedFactor": 1.25,
      "coinFactor": 1.5
    }
  },
  {
    "id": "PU_CUT_TAIL",
    "name": "Cortacola",
    "rarity": "rare",
    "description": "Reduce 4 segmentos si tienes longitud suficiente.",
    "durationMs": 0,
    "effect": {
      "type": "shrink",
      "amount": 4,
      "minLength": 5
    }
  },
  {
    "id": "PU_DOUBLE_ORB",
    "name": "Doble orbe",
    "rarity": "rare",
    "description": "Aparecen dos orbes normales durante unos segundos.",
    "durationMs": 8000,
    "effect": {
      "type": "extraOrbSpawns",
      "amount": 1
    }
  },
  {
    "id": "PU_FREEZE",
    "name": "Congelar obstáculos",
    "rarity": "epic",
    "description": "Detiene obstáculos móviles durante 6 segundos.",
    "durationMs": 6000,
    "effect": {
      "type": "freezeHazards"
    }
  },
  {
    "id": "PU_CLEAN_BLAST",
    "name": "Explosión limpia",
    "rarity": "epic",
    "description": "Elimina peligros cercanos.",
    "durationMs": 0,
    "effect": {
      "type": "clearNearbyHazards",
      "radiusCells": 3
    }
  },
  {
    "id": "PU_RADAR",
    "name": "Radar de orbes",
    "rarity": "common",
    "description": "Muestra dónde aparecerá el próximo orbe.",
    "durationMs": 8000,
    "effect": {
      "type": "orbRadar"
    }
  },
  {
    "id": "PU_MINI",
    "name": "Mini serpiente",
    "rarity": "epic",
    "description": "Reduce temporalmente la longitud visible de colisión.",
    "durationMs": 6000,
    "effect": {
      "type": "temporaryCollisionLengthFactor",
      "factor": 0.65
    }
  },
  {
    "id": "PU_GOLD_RAIN",
    "name": "Lluvia dorada",
    "rarity": "legendary",
    "description": "Durante 5 segundos aparecen monedas pequeñas en el tablero.",
    "durationMs": 5000,
    "effect": {
      "type": "goldRain"
    }
  }
];
