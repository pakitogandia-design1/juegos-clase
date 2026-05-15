export const ROOMS = [
  {
    "id": "normal",
    "name": "Cámara normal",
    "minCamera": 1,
    "description": "Come varios orbes y completa el objetivo base.",
    "objective": {
      "type": "eat_orbs",
      "baseTarget": 6,
      "scaleEvery": 4
    },
    "hazards": [
      "none"
    ],
    "weight": 30
  },
  {
    "id": "obstacles",
    "name": "Cámara de obstáculos",
    "minCamera": 3,
    "description": "Evita bloques internos mientras comes orbes.",
    "objective": {
      "type": "eat_orbs",
      "baseTarget": 7
    },
    "obstaclePatterns": [
      "columns",
      "islands",
      "cross",
      "garden_blocks"
    ],
    "weight": 18
  },
  {
    "id": "narrow",
    "name": "Cámara estrecha",
    "minCamera": 5,
    "description": "Pasillos y zonas cerradas con menos espacio.",
    "objective": {
      "type": "eat_orbs",
      "baseTarget": 7
    },
    "obstaclePatterns": [
      "corridors",
      "partial_spiral",
      "double_lane"
    ],
    "weight": 10
  },
  {
    "id": "gold",
    "name": "Cámara dorada",
    "minCamera": 4,
    "description": "Más SnakeCoins, más riesgo.",
    "objective": {
      "type": "collect_gold",
      "baseTarget": 5
    },
    "orbBias": {
      "ORB_GOLD": 3
    },
    "weight": 8
  },
  {
    "id": "speed",
    "name": "Cámara de velocidad",
    "minCamera": 6,
    "description": "La velocidad sube gradualmente.",
    "objective": {
      "type": "eat_orbs",
      "baseTarget": 8
    },
    "event": "speed_ramp",
    "weight": 9
  },
  {
    "id": "ghost",
    "name": "Cámara fantasma",
    "minCamera": 7,
    "description": "Los orbes fantasma aparecen y desaparecen.",
    "objective": {
      "type": "collect_ghost",
      "baseTarget": 4
    },
    "orbBias": {
      "ORB_GHOST": 4
    },
    "weight": 7
  },
  {
    "id": "portals",
    "name": "Cámara de portales",
    "minCamera": 8,
    "description": "Usa portales para moverte por el tablero.",
    "objective": {
      "type": "eat_orbs",
      "baseTarget": 8
    },
    "features": [
      "portals"
    ],
    "weight": 7
  },
  {
    "id": "mutation",
    "name": "Cámara de mutación",
    "minCamera": 9,
    "description": "Aparecen orbes morados con efectos especiales.",
    "objective": {
      "type": "eat_orbs",
      "baseTarget": 8
    },
    "orbBias": {
      "ORB_PURPLE": 4
    },
    "weight": 6
  },
  {
    "id": "treasure",
    "name": "Cámara de tesoro",
    "minCamera": 5,
    "description": "Recoge monedas durante un tiempo limitado.",
    "objective": {
      "type": "survive_time",
      "durationSec": 25
    },
    "orbBias": {
      "ORB_GOLD": 5
    },
    "weight": 4
  },
  {
    "id": "boss",
    "name": "Cámara jefe",
    "minCamera": 5,
    "description": "Mecánica especial de jefe o evento fuerte.",
    "objective": {
      "type": "boss"
    },
    "weight": 0
  }
];
