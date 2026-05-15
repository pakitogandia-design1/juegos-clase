export const ORBS = [
  {
    "id": "ORB_GREEN",
    "name": "Orbe verde",
    "color": "green",
    "description": "Comida normal. Aumenta longitud y puntuación.",
    "grow": 1,
    "coins": 0,
    "score": 10,
    "chargesAbility": 0,
    "risk": 0,
    "spawnWeight": 60
  },
  {
    "id": "ORB_GOLD",
    "name": "Orbe dorado",
    "color": "gold",
    "description": "Da SnakeCoins. No aumenta longitud.",
    "grow": 0,
    "coins": 3,
    "score": 20,
    "chargesAbility": 0,
    "risk": 0,
    "spawnWeight": 12
  },
  {
    "id": "ORB_BLUE",
    "name": "Orbe azul",
    "color": "blue",
    "description": "Carga Fase Snake. No aumenta longitud.",
    "grow": 0,
    "coins": 0,
    "score": 15,
    "chargesAbility": 25,
    "risk": 0,
    "spawnWeight": 10
  },
  {
    "id": "ORB_RED",
    "name": "Orbe rojo",
    "color": "red",
    "description": "Riesgo/recompensa. Da monedas y sube velocidad temporalmente.",
    "grow": 1,
    "coins": 2,
    "score": 35,
    "chargesAbility": 0,
    "risk": 2,
    "spawnWeight": 7
  },
  {
    "id": "ORB_PURPLE",
    "name": "Orbe morado",
    "color": "purple",
    "description": "Activa una mutación temporal o automática, especialmente en Infinito.",
    "grow": 0,
    "coins": 0,
    "score": 25,
    "chargesAbility": 10,
    "risk": 0,
    "spawnWeight": 5
  },
  {
    "id": "ORB_GHOST",
    "name": "Orbe fantasma",
    "color": "ghost",
    "description": "Aparece durante poco tiempo. Da buen bonus.",
    "grow": 0,
    "coins": 4,
    "score": 45,
    "chargesAbility": 10,
    "risk": 0,
    "spawnWeight": 4,
    "lifetimeMs": 5000
  },
  {
    "id": "ORB_BLACK",
    "name": "Orbe negro",
    "color": "black",
    "description": "Trampa. Hay que evitarlo.",
    "grow": 0,
    "coins": 0,
    "score": 0,
    "chargesAbility": 0,
    "risk": 5,
    "spawnWeight": 2,
    "harmful": true
  }
];
