export const ACHIEVEMENTS = [
  {
    "id": "A01",
    "name": "Primer Orbe",
    "description": "Come tu primer orbe.",
    "condition": {
      "kind": "totalOrbs",
      "value": 1
    },
    "reward": {
      "coins": 50
    }
  },
  {
    "id": "A02",
    "name": "Primera Run",
    "description": "Juega tu primera run.",
    "condition": {
      "kind": "totalRuns",
      "value": 1
    },
    "reward": {
      "coins": 50
    }
  },
  {
    "id": "A03",
    "name": "Cámara 5",
    "description": "Llega a la cámara 5 en Expedición Roguelike.",
    "condition": {
      "kind": "bestCamera",
      "value": 5
    },
    "reward": {
      "coins": 75
    }
  },
  {
    "id": "A04",
    "name": "Cámara 10",
    "description": "Llega a la cámara 10.",
    "condition": {
      "kind": "bestCamera",
      "value": 10
    },
    "reward": {
      "box": "basic"
    }
  },
  {
    "id": "A05",
    "name": "Cámara 15",
    "description": "Llega a la cámara 15.",
    "condition": {
      "kind": "bestCamera",
      "value": 15
    },
    "reward": {
      "box": "advanced"
    }
  },
  {
    "id": "A06",
    "name": "Cámara 20",
    "description": "Completa una expedición.",
    "condition": {
      "kind": "roguelikeCompleted",
      "value": 1
    },
    "reward": {
      "box": "mastery"
    }
  },
  {
    "id": "A07",
    "name": "Infinito Nivel 5",
    "description": "Alcanza nivel 5 en modo Infinito.",
    "condition": {
      "kind": "bestInfiniteLevel",
      "value": 5
    },
    "reward": {
      "coins": 100
    }
  },
  {
    "id": "A08",
    "name": "Infinito Nivel 10",
    "description": "Alcanza nivel 10 en modo Infinito.",
    "condition": {
      "kind": "bestInfiniteLevel",
      "value": 10
    },
    "reward": {
      "box": "advanced"
    }
  },
  {
    "id": "A09",
    "name": "Infinito Nivel 15",
    "description": "Alcanza nivel 15 en modo Infinito.",
    "condition": {
      "kind": "bestInfiniteLevel",
      "value": 15
    },
    "reward": {
      "box": "elite"
    }
  },
  {
    "id": "A10",
    "name": "Combo x10",
    "description": "Consigue combo x10.",
    "condition": {
      "kind": "maxCombo",
      "value": 10
    },
    "reward": {
      "coins": 100
    }
  },
  {
    "id": "A11",
    "name": "Combo x20",
    "description": "Consigue combo x20.",
    "condition": {
      "kind": "maxCombo",
      "value": 20
    },
    "reward": {
      "box": "basic"
    }
  },
  {
    "id": "A12",
    "name": "Cazatesoros",
    "description": "Recoge 25 orbes dorados.",
    "condition": {
      "kind": "totalGoldOrbs",
      "value": 25
    },
    "reward": {
      "coins": 150
    }
  },
  {
    "id": "A13",
    "name": "Fantasma Activo",
    "description": "Usa Fase Snake 10 veces.",
    "condition": {
      "kind": "totalPhaseUses",
      "value": 10
    },
    "reward": {
      "coins": 100
    }
  },
  {
    "id": "A14",
    "name": "Escudo Salvador",
    "description": "Sobrevive a 10 choques gracias a escudos.",
    "condition": {
      "kind": "totalShieldSaves",
      "value": 10
    },
    "reward": {
      "coins": 150
    }
  },
  {
    "id": "A15",
    "name": "Mini Jefe Superado",
    "description": "Supera tu primer mini jefe.",
    "condition": {
      "kind": "totalBossesDefeated",
      "value": 1
    },
    "reward": {
      "box": "basic"
    }
  },
  {
    "id": "A16",
    "name": "Cobra del Núcleo",
    "description": "Derrota al jefe final.",
    "condition": {
      "kind": "finalBossDefeated",
      "value": 1
    },
    "reward": {
      "box": "mastery"
    }
  },
  {
    "id": "A17",
    "name": "Run Perfecta",
    "description": "Completa 5 cámaras seguidas sin perder escudo.",
    "condition": {
      "kind": "perfectRoomsStreak",
      "value": 5
    },
    "reward": {
      "box": "elite"
    }
  },
  {
    "id": "A18",
    "name": "Colección 10",
    "description": "Desbloquea 10 objetos.",
    "condition": {
      "kind": "collectiblesUnlocked",
      "value": 10
    },
    "reward": {
      "coins": 100
    }
  },
  {
    "id": "A19",
    "name": "Colección 25",
    "description": "Desbloquea 25 objetos.",
    "condition": {
      "kind": "collectiblesUnlocked",
      "value": 25
    },
    "reward": {
      "box": "basic"
    }
  },
  {
    "id": "A20",
    "name": "Colección 50",
    "description": "Desbloquea 50 objetos.",
    "condition": {
      "kind": "collectiblesUnlocked",
      "value": 50
    },
    "reward": {
      "box": "advanced"
    }
  },
  {
    "id": "A21",
    "name": "Abridor de Cajas",
    "description": "Abre 10 cajas.",
    "condition": {
      "kind": "totalBoxesOpened",
      "value": 10
    },
    "reward": {
      "coins": 200
    }
  },
  {
    "id": "A22",
    "name": "Legendario",
    "description": "Desbloquea tu primer objeto legendario.",
    "condition": {
      "kind": "legendaryUnlocked",
      "value": 1
    },
    "reward": {
      "coins": 300
    }
  },
  {
    "id": "A23",
    "name": "Experto Inicial",
    "description": "Llega a cámara 5 en Experto.",
    "condition": {
      "kind": "expertBestCamera",
      "value": 5
    },
    "reward": {
      "box": "advanced"
    }
  },
  {
    "id": "A24",
    "name": "Experto del Núcleo",
    "description": "Llega a cámara 15 en Experto.",
    "condition": {
      "kind": "expertBestCamera",
      "value": 15
    },
    "reward": {
      "box": "elite"
    }
  },
  {
    "id": "A25",
    "name": "Leyenda Snakademy",
    "description": "Completa una expedición en Experto o alcanza nivel 20 en Infinito.",
    "condition": {
      "kind": "legendCondition",
      "expertCompleteOrInfiniteLevel": 20
    },
    "reward": {
      "box": "mastery"
    }
  }
];
