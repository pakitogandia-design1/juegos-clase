export const ECONOMY = {
  "currencyName": "SnakeCoins",
  "saveKey": "snakademy_save_v1",
  "initialCoins": 0,
  "defaultUnlocked": {
    "skin": "SK01",
    "head": "HD01",
    "trail": "TR01",
    "pet": "PT01",
    "background": "BG01",
    "badge": "BD01"
  },
  "runRewards": {
    "greenOrb": 1,
    "goldOrb": 3,
    "roomCleared": 5,
    "miniBoss": 20,
    "finalBoss": 100,
    "difficultyMultipliers": {
      "relax": 0.8,
      "normal": 1.0,
      "expert": 1.35
    }
  },
  "infiniteRewards": {
    "greenOrb": 1,
    "goldOrb": 3,
    "levelReached": 10,
    "newLevelRecord": 50,
    "newTimeRecord": 50,
    "difficultyMultipliers": {
      "relax": 0.8,
      "normal": 1.0,
      "expert": 1.35
    }
  },
  "difficulties": {
    "relax": {
      "name": "Relax",
      "startShields": 2,
      "baseSpeedMs": 170,
      "coinMultiplier": 0.8,
      "trapFactor": 0.45,
      "description": "Más lento, más amable y con más margen."
    },
    "normal": {
      "name": "Normal",
      "startShields": 1,
      "baseSpeedMs": 140,
      "coinMultiplier": 1.0,
      "trapFactor": 1.0,
      "description": "Experiencia equilibrada."
    },
    "expert": {
      "name": "Experto",
      "startShields": 0,
      "baseSpeedMs": 115,
      "coinMultiplier": 1.35,
      "trapFactor": 1.35,
      "description": "Más velocidad, más riesgo y más recompensa."
    }
  },
  "controls": {
    "keyboard": [
      "Flechas",
      "WASD",
      "Espacio para Fase Snake",
      "Shift para freno si existe",
      "P/Esc para pausa"
    ],
    "touch": "Tocar lado izquierdo del tablero gira a la izquierda; tocar lado derecho gira a la derecha. La habilidad va fuera del tablero."
  }
};
