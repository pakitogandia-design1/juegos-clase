export const UPGRADES = [
  {
    "id": "SURV_01",
    "name": "Escama extra",
    "rarity": "common",
    "family": "survival",
    "description": "Ganas +1 escudo.",
    "effect": {
      "type": "addShield",
      "amount": 1
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "SURV_02",
    "name": "Escudo inicial",
    "rarity": "common",
    "family": "survival",
    "description": "Empiezas cada cámara con al menos 1 escudo si no tenías ninguno.",
    "effect": {
      "type": "minShieldEachRoom",
      "amount": 1
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "SURV_03",
    "name": "Cola compacta",
    "rarity": "common",
    "family": "survival",
    "description": "Cada 6 orbes verdes, reduces 1 segmento de longitud.",
    "effect": {
      "type": "shrinkEveryOrbs",
      "orbType": "green",
      "count": 6,
      "amount": 1
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "SURV_04",
    "name": "Piel de emergencia",
    "rarity": "rare",
    "family": "survival",
    "description": "Al perder un escudo, activas fase de cola durante 2 segundos.",
    "effect": {
      "type": "phaseOnShieldLoss",
      "durationMs": 2000
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "SURV_05",
    "name": "Segunda oportunidad",
    "rarity": "epic",
    "family": "survival",
    "description": "La primera vez que ibas a perder, reapareces con 1 escudo y la mitad de longitud.",
    "effect": {
      "type": "secondChance",
      "shield": 1,
      "lengthFactor": 0.5
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "SURV_06",
    "name": "Escamas reforzadas",
    "rarity": "rare",
    "family": "survival",
    "description": "El primer choque con obstáculo interno de cada cámara no consume escudo.",
    "effect": {
      "type": "freeInternalObstacleHitPerRoom",
      "amount": 1
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "SURV_07",
    "name": "Repliegue",
    "rarity": "rare",
    "family": "survival",
    "description": "Al activar Fase Snake, pierdes 2 segmentos si tienes más de 8.",
    "effect": {
      "type": "shrinkOnPhase",
      "amount": 2,
      "minLength": 8
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "SURV_08",
    "name": "Caparazón lento",
    "rarity": "common",
    "family": "survival",
    "description": "Ganas +1 escudo y la velocidad inicial de la siguiente cámara baja un poco.",
    "effect": {
      "type": "shieldAndStartSlow",
      "shield": 1,
      "slowFactor": 0.9
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "SURV_09",
    "name": "Cura dorada",
    "rarity": "rare",
    "family": "survival",
    "description": "Cada 5 orbes dorados recogidos, ganas 1 escudo.",
    "effect": {
      "type": "shieldEveryGoldOrbs",
      "count": 5,
      "amount": 1
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "SURV_10",
    "name": "Piel elástica",
    "rarity": "epic",
    "family": "survival",
    "description": "Puedes rozar tu cola una vez por cámara sin perder.",
    "effect": {
      "type": "tailGracePerRoom",
      "amount": 1
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "SURV_11",
    "name": "Superviviente",
    "rarity": "epic",
    "family": "survival",
    "description": "Si completas una cámara con 0 escudos, ganas +20 SnakeCoins.",
    "effect": {
      "type": "coinsIfNoShieldRoomClear",
      "coins": 20
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "SURV_12",
    "name": "Núcleo protector",
    "rarity": "legendary",
    "family": "survival",
    "description": "Cada jefe superado te concede +2 escudos.",
    "effect": {
      "type": "shieldOnBossClear",
      "amount": 2
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "CTRL_01",
    "name": "Arranque suave",
    "rarity": "common",
    "family": "control",
    "description": "Cada cámara empieza un 15% más lenta durante 5 segundos.",
    "effect": {
      "type": "roomStartSlow",
      "factor": 0.85,
      "durationMs": 5000
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "CTRL_02",
    "name": "Giro fino",
    "rarity": "common",
    "family": "control",
    "description": "El juego guarda mejor el siguiente giro si pulsas antes de llegar a la casilla.",
    "effect": {
      "type": "inputBufferBonus",
      "ticks": 1
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "CTRL_03",
    "name": "Frenada táctica",
    "rarity": "rare",
    "family": "control",
    "description": "Mantén Shift o el botón de freno para reducir velocidad unos segundos.",
    "effect": {
      "type": "enableBrake",
      "factor": 0.72,
      "energyMs": 3500
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "CTRL_04",
    "name": "Reflejos de academia",
    "rarity": "rare",
    "family": "control",
    "description": "La velocidad máxima tarda más en alcanzarse.",
    "effect": {
      "type": "speedRampFactor",
      "factor": 0.75
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "CTRL_05",
    "name": "Portal seguro",
    "rarity": "rare",
    "family": "control",
    "description": "Al salir de un portal, tienes 1 segundo de invulnerabilidad.",
    "effect": {
      "type": "portalInvulnerability",
      "durationMs": 1000
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "CTRL_06",
    "name": "Giro fantasma",
    "rarity": "epic",
    "family": "control",
    "description": "Después de usar Fase Snake, atraviesas tu cola 1 segundo más.",
    "effect": {
      "type": "postPhaseTailGrace",
      "durationMs": 1000
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "CTRL_07",
    "name": "Serpenteo estable",
    "rarity": "common",
    "family": "control",
    "description": "El primer giro brusco de cada cámara no aumenta la velocidad.",
    "effect": {
      "type": "freeSharpTurnSpeedPenalty",
      "amount": 1
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "CTRL_08",
    "name": "Control térmico",
    "rarity": "rare",
    "family": "control",
    "description": "Los orbes rojos aumentan menos la velocidad.",
    "effect": {
      "type": "redOrbSpeedPenaltyFactor",
      "factor": 0.6
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "CTRL_09",
    "name": "Mente fría",
    "rarity": "epic",
    "family": "control",
    "description": "Al llegar a combo x10, la velocidad se estabiliza durante 4 segundos.",
    "effect": {
      "type": "stabilizeOnCombo",
      "combo": 10,
      "durationMs": 4000
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "CTRL_10",
    "name": "Dominio total",
    "rarity": "legendary",
    "family": "control",
    "description": "Una vez por cámara, si un giro causaría choque inmediato, se ignora.",
    "effect": {
      "type": "cancelDangerousTurnPerRoom",
      "amount": 1
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "ORB_01",
    "name": "Orbes dobles",
    "rarity": "common",
    "family": "orbs",
    "description": "A veces aparecen dos orbes verdes a la vez.",
    "effect": {
      "type": "extraGreenOrbChance",
      "chance": 0.18
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "ORB_02",
    "name": "Núcleo azul",
    "rarity": "common",
    "family": "orbs",
    "description": "Los orbes azules cargan más Fase Snake.",
    "effect": {
      "type": "blueChargeBonus",
      "factor": 1.25
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "ORB_03",
    "name": "Orbe dorado frecuente",
    "rarity": "rare",
    "family": "orbs",
    "description": "Aumenta la aparición de orbes dorados.",
    "effect": {
      "type": "goldOrbChanceBonus",
      "amount": 0.12
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "ORB_04",
    "name": "Orbe fantasma lento",
    "rarity": "rare",
    "family": "orbs",
    "description": "Los orbes fantasma tardan más en desaparecer.",
    "effect": {
      "type": "ghostOrbDurationBonus",
      "durationMs": 2500
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "ORB_05",
    "name": "Orbe gigante",
    "rarity": "epic",
    "family": "orbs",
    "description": "A veces aparece un orbe gigante con gran recompensa.",
    "effect": {
      "type": "enableGiantOrb",
      "chance": 0.08
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "ORB_06",
    "name": "Orbe purificador",
    "rarity": "epic",
    "family": "orbs",
    "description": "A veces aparece un orbe que elimina un obstáculo interno.",
    "effect": {
      "type": "enablePurifierOrb",
      "chance": 0.07
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "ORB_07",
    "name": "Orbes seguros",
    "rarity": "common",
    "family": "orbs",
    "description": "Los orbes aparecen más lejos de paredes y obstáculos.",
    "effect": {
      "type": "safeOrbSpawnBias",
      "amount": 1
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "ORB_08",
    "name": "Orbe rojo rentable",
    "rarity": "rare",
    "family": "orbs",
    "description": "Los orbes rojos dan más monedas.",
    "effect": {
      "type": "redOrbCoinsBonus",
      "amount": 2
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "ORB_09",
    "name": "Mutación frecuente",
    "rarity": "rare",
    "family": "orbs",
    "description": "Aumenta la aparición de orbes morados.",
    "effect": {
      "type": "purpleOrbChanceBonus",
      "amount": 0.08
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "ORB_10",
    "name": "Lluvia controlada",
    "rarity": "legendary",
    "family": "orbs",
    "description": "Al completar una cámara, aparece una lluvia breve de orbes de recompensa.",
    "effect": {
      "type": "rewardOrbRainOnRoomClear",
      "durationMs": 5000
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "COIN_01",
    "name": "Bolsillo dorado",
    "rarity": "common",
    "family": "coins",
    "description": "+15% SnakeCoins al final de la run.",
    "effect": {
      "type": "runCoinsMultiplier",
      "multiplier": 1.15
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "COIN_02",
    "name": "Duplicador dorado",
    "rarity": "rare",
    "family": "coins",
    "description": "El primer orbe dorado de cada cámara vale el doble.",
    "effect": {
      "type": "doubleFirstGoldOrbEachRoom"
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "COIN_03",
    "name": "Imán de monedas",
    "rarity": "rare",
    "family": "coins",
    "description": "Las monedas cercanas se acercan a la serpiente.",
    "effect": {
      "type": "coinMagnet",
      "radiusCells": 3
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "COIN_04",
    "name": "Tesoro de cámara",
    "rarity": "epic",
    "family": "coins",
    "description": "Aumenta la probabilidad de cámaras de tesoro.",
    "effect": {
      "type": "treasureRoomChanceBonus",
      "amount": 0.12
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "COIN_05",
    "name": "Banquero serpiente",
    "rarity": "epic",
    "family": "coins",
    "description": "+30% SnakeCoins, pero empiezas cada cámara con +2 de longitud.",
    "effect": {
      "type": "coinsForLengthTrade",
      "multiplier": 1.3,
      "extraStartLength": 2
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "COIN_06",
    "name": "Reciclaje de cola",
    "rarity": "rare",
    "family": "coins",
    "description": "Cada vez que reduces longitud, ganas SnakeCoins.",
    "effect": {
      "type": "coinsOnShrink",
      "coinsPerSegment": 2
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "COIN_07",
    "name": "Cofre inesperado",
    "rarity": "common",
    "family": "coins",
    "description": "Pequeña probabilidad de que aparezca un cofre al comer un orbe verde.",
    "effect": {
      "type": "chestOnGreenChance",
      "chance": 0.04
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "COIN_08",
    "name": "Bolsa de jefe",
    "rarity": "rare",
    "family": "coins",
    "description": "Los jefes dan +50% SnakeCoins.",
    "effect": {
      "type": "bossCoinsMultiplier",
      "multiplier": 1.5
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "COIN_09",
    "name": "Pacto dorado",
    "rarity": "epic",
    "family": "coins",
    "description": "Ganas más monedas cuanto menos escudos tengas.",
    "effect": {
      "type": "coinsScaleWithLowShield",
      "maxBonus": 0.35
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "COIN_10",
    "name": "Pacto del Núcleo",
    "rarity": "legendary",
    "family": "coins",
    "description": "Pierdes todos los escudos actuales, pero duplicas las SnakeCoins de la run.",
    "effect": {
      "type": "removeShieldsDoubleCoins"
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "COMBO_01",
    "name": "Combo creciente",
    "rarity": "common",
    "family": "combo",
    "description": "Cada orbe seguido aumenta ligeramente el multiplicador.",
    "effect": {
      "type": "comboMultiplierBonus",
      "amount": 0.03
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "COMBO_02",
    "name": "Ruta perfecta",
    "rarity": "common",
    "family": "combo",
    "description": "Bonus si completas una cámara sin perder escudo.",
    "effect": {
      "type": "perfectRoomBonus",
      "coins": 15
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "COMBO_03",
    "name": "Hambre rápida",
    "rarity": "rare",
    "family": "combo",
    "description": "Si comes 3 orbes en poco tiempo, aparece un orbe extra.",
    "effect": {
      "type": "spawnExtraOrbOnFastChain",
      "count": 3,
      "windowMs": 3500
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "COMBO_04",
    "name": "Combo seguro",
    "rarity": "rare",
    "family": "combo",
    "description": "Perder un escudo no rompe el combo una vez por cámara.",
    "effect": {
      "type": "preserveComboOnShieldLossPerRoom",
      "amount": 1
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "COMBO_05",
    "name": "Combo explosivo",
    "rarity": "epic",
    "family": "combo",
    "description": "Cada combo x10 suelta monedas alrededor.",
    "effect": {
      "type": "coinBurstOnCombo",
      "comboStep": 10,
      "coins": 8
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "COMBO_06",
    "name": "Fiebre de orbes",
    "rarity": "epic",
    "family": "combo",
    "description": "Al alcanzar combo x15, todos los orbes dan doble puntuación unos segundos.",
    "effect": {
      "type": "scoreFeverOnCombo",
      "combo": 15,
      "durationMs": 6000
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "COMBO_07",
    "name": "Cadena dorada",
    "rarity": "rare",
    "family": "combo",
    "description": "Los orbes dorados mantienen el combo durante más tiempo.",
    "effect": {
      "type": "goldOrbComboWindowBonus",
      "durationMs": 2500
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "COMBO_08",
    "name": "Precisión",
    "rarity": "common",
    "family": "combo",
    "description": "Completar una cámara sin usar habilidad da bonus de puntos.",
    "effect": {
      "type": "noAbilityRoomBonus",
      "score": 150
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "COMBO_09",
    "name": "Núcleo de combo",
    "rarity": "epic",
    "family": "combo",
    "description": "Al superar un jefe, conservas parte del combo para la siguiente cámara.",
    "effect": {
      "type": "carryComboAfterBoss",
      "factor": 0.5
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "COMBO_10",
    "name": "Serpiente perfecta",
    "rarity": "legendary",
    "family": "combo",
    "description": "Cada cámara perfecta aumenta permanentemente el multiplicador de la run.",
    "effect": {
      "type": "permanentPerfectRoomMultiplier",
      "amount": 0.05
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "PHASE_01",
    "name": "Fase larga",
    "rarity": "common",
    "family": "ability",
    "description": "Fase Snake dura +1 segundo.",
    "effect": {
      "type": "phaseDurationBonus",
      "durationMs": 1000
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "PHASE_02",
    "name": "Carga eficiente",
    "rarity": "common",
    "family": "ability",
    "description": "Los orbes azules cargan un 25% más.",
    "effect": {
      "type": "blueChargeBonus",
      "factor": 1.25
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "PHASE_03",
    "name": "Fase imán",
    "rarity": "rare",
    "family": "ability",
    "description": "Durante Fase Snake atraes orbes cercanos.",
    "effect": {
      "type": "phaseMagnet",
      "radiusCells": 3
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "PHASE_04",
    "name": "Fase dorada",
    "rarity": "rare",
    "family": "ability",
    "description": "Durante Fase Snake los orbes dan más monedas.",
    "effect": {
      "type": "phaseCoinsBonus",
      "amount": 2
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "PHASE_05",
    "name": "Sobrecarga",
    "rarity": "legendary",
    "family": "ability",
    "description": "Puedes guardar una segunda carga de Fase Snake.",
    "effect": {
      "type": "extraAbilityCharge",
      "charges": 2
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "PHASE_06",
    "name": "Fantasma total",
    "rarity": "legendary",
    "family": "ability",
    "description": "Una vez por cámara, Fase Snake también atraviesa paredes internas.",
    "effect": {
      "type": "phaseThroughInternalWallsPerRoom",
      "amount": 1
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "PHASE_07",
    "name": "Carga por riesgo",
    "rarity": "epic",
    "family": "ability",
    "description": "Los orbes rojos cargan habilidad además de aumentar velocidad.",
    "effect": {
      "type": "redOrbChargesAbility",
      "amount": 15
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  },
  {
    "id": "PHASE_08",
    "name": "Fase de emergencia",
    "rarity": "epic",
    "family": "ability",
    "description": "Si ibas a chocar con tu cola y tienes habilidad cargada, se activa automáticamente.",
    "effect": {
      "type": "autoPhaseBeforeTailCollision"
    },
    "modes": [
      "roguelike"
    ],
    "tags": []
  }
];
