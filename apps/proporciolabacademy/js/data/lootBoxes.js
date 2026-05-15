export const LOOT_BOXES = {
  "basic": {
    "id": "basic",
    "name": "Caja Básica",
    "cost": 100,
    "description": "Buena para empezar tu colección.",
    "odds": {
      "common": 75,
      "rare": 22,
      "epic": 3,
      "legendary": 0
    },
    "duplicateRefund": {
      "common": 25,
      "rare": 60,
      "epic": 150,
      "legendary": 300
    }
  },
  "advanced": {
    "id": "advanced",
    "name": "Caja Avanzada",
    "cost": 250,
    "description": "Más opciones de objetos raros.",
    "odds": {
      "common": 40,
      "rare": 45,
      "epic": 14,
      "legendary": 1
    },
    "duplicateRefund": {
      "common": 25,
      "rare": 60,
      "epic": 150,
      "legendary": 300
    }
  },
  "elite": {
    "id": "elite",
    "name": "Caja Élite",
    "cost": 500,
    "description": "Para buscar objetos épicos y legendarios.",
    "odds": {
      "common": 15,
      "rare": 40,
      "epic": 35,
      "legendary": 10
    },
    "duplicateRefund": {
      "common": 25,
      "rare": 60,
      "epic": 150,
      "legendary": 300
    }
  },
  "mastery": {
    "id": "mastery",
    "name": "Caja de Maestría",
    "cost": 0,
    "description": "Se consigue superando grandes logros. No se compra con monedas.",
    "odds": {
      "common": 0,
      "rare": 40,
      "epic": 45,
      "legendary": 15
    },
    "duplicateRefund": {
      "common": 25,
      "rare": 60,
      "epic": 150,
      "legendary": 300
    },
    "earnedOnly": true
  }
};
