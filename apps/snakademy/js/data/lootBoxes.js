export const LOOT_BOXES = {
  "basic": {
    "id": "basic",
    "name": "Caja Academy",
    "cost": 100,
    "description": "Caja básica para empezar la colección.",
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
    "name": "Caja Mutante",
    "cost": 250,
    "description": "Más opciones de objetos raros y épicos.",
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
    "description": "Alta probabilidad de recompensas épicas.",
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
    "name": "Caja Maestra",
    "cost": 0,
    "description": "Caja especial obtenida mediante logros.",
    "earnedOnly": true,
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
    }
  }
};
