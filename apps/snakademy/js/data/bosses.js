export const BOSSES = [
  {
    "id": "BOSS_APPLE",
    "name": "Manzana Blindada",
    "camera": 5,
    "description": "Una manzana grande se mueve lentamente. Hay que tocarla 3 veces.",
    "objective": {
      "type": "hit_moving_target",
      "hits": 3
    },
    "rewardCoins": 20
  },
  {
    "id": "BOSS_WALL",
    "name": "Muro Vivo",
    "camera": 10,
    "description": "Muros que cambian de posición con aviso visual.",
    "objective": {
      "type": "eat_orbs_with_moving_walls",
      "target": 8
    },
    "rewardCoins": 35
  },
  {
    "id": "BOSS_SHADOW",
    "name": "Serpiente Sombra",
    "camera": 15,
    "description": "Una sombra copia tu trayectoria con retraso.",
    "objective": {
      "type": "survive_and_eat",
      "target": 10
    },
    "rewardCoins": 50
  },
  {
    "id": "BOSS_CORE",
    "name": "Cobra del Núcleo",
    "camera": 20,
    "description": "Jefe final con orbes falsos, barreras y velocidad creciente.",
    "objective": {
      "type": "core_orbs",
      "target": 12
    },
    "rewardCoins": 100,
    "finalBoss": true
  }
];
