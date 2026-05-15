export const ACHIEVEMENTS = [
  {
    "id": "A01",
    "name": "Primer Encargo",
    "description": "Completa 1 reto.",
    "condition": {
      "kind": "completedTotal",
      "value": 1
    },
    "reward": {
      "coins": 50
    }
  },
  {
    "id": "A02",
    "name": "Cinco Misiones",
    "description": "Completa 5 retos.",
    "condition": {
      "kind": "completedTotal",
      "value": 5
    },
    "reward": {
      "coins": 75
    }
  },
  {
    "id": "A03",
    "name": "Diez Misiones",
    "description": "Completa 10 retos.",
    "condition": {
      "kind": "completedTotal",
      "value": 10
    },
    "reward": {
      "coins": 100
    }
  },
  {
    "id": "A04",
    "name": "Directa Inicial",
    "description": "Completa 5 retos de directa.",
    "condition": {
      "kind": "completedType",
      "type": "direct",
      "value": 5
    },
    "reward": {
      "coins": 75
    }
  },
  {
    "id": "A05",
    "name": "Inversa Inicial",
    "description": "Completa 5 retos de inversa.",
    "condition": {
      "kind": "completedType",
      "type": "inverse",
      "value": 5
    },
    "reward": {
      "coins": 75
    }
  },
  {
    "id": "A06",
    "name": "Primer Banco",
    "description": "Completa 3 retos de interés simple.",
    "condition": {
      "kind": "completedType",
      "type": "simple",
      "value": 3
    },
    "reward": {
      "coins": 75
    }
  },
  {
    "id": "A07",
    "name": "Hucha Compuesta",
    "description": "Completa 3 retos de interés compuesto.",
    "condition": {
      "kind": "completedType",
      "type": "compound",
      "value": 3
    },
    "reward": {
      "coins": 75
    }
  },
  {
    "id": "A08",
    "name": "Detective I",
    "description": "Clasifica correctamente 10 relaciones.",
    "condition": {
      "kind": "relationsCorrect",
      "value": 10
    },
    "reward": {
      "coins": 100
    }
  },
  {
    "id": "A09",
    "name": "Sin Pistas I",
    "description": "Completa 5 retos sin pistas.",
    "condition": {
      "kind": "noHints",
      "value": 5
    },
    "reward": {
      "coins": 100
    }
  },
  {
    "id": "A10",
    "name": "Con Ayuda También Se Aprende",
    "description": "Completa 5 retos usando pistas.",
    "condition": {
      "kind": "withHints",
      "value": 5
    },
    "reward": {
      "coins": 75
    }
  },
  {
    "id": "A11",
    "name": "Racha 3",
    "description": "Completa 3 retos seguidos.",
    "condition": {
      "kind": "streak",
      "value": 3
    },
    "reward": {
      "coins": 80
    }
  },
  {
    "id": "A12",
    "name": "Racha 5",
    "description": "Completa 5 retos seguidos.",
    "condition": {
      "kind": "streak",
      "value": 5
    },
    "reward": {
      "box": "basic"
    }
  },
  {
    "id": "A13",
    "name": "ProblemaLab I",
    "description": "Resuelve 3 problemas en ProblemaLab.",
    "condition": {
      "kind": "problemLabSolved",
      "value": 3
    },
    "reward": {
      "coins": 100
    }
  },
  {
    "id": "A14",
    "name": "Caja Abierta",
    "description": "Abre tu primera caja.",
    "condition": {
      "kind": "boxesOpened",
      "value": 1
    },
    "reward": {
      "coins": 50
    }
  },
  {
    "id": "A15",
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
    "id": "A16",
    "name": "Maestro de Directa",
    "description": "Completa 20 retos de directa.",
    "condition": {
      "kind": "completedType",
      "type": "direct",
      "value": 20
    },
    "reward": {
      "box": "mastery"
    }
  },
  {
    "id": "A17",
    "name": "Maestro de Inversa",
    "description": "Completa 20 retos de inversa.",
    "condition": {
      "kind": "completedType",
      "type": "inverse",
      "value": 20
    },
    "reward": {
      "box": "mastery"
    }
  },
  {
    "id": "A18",
    "name": "Banquero Total",
    "description": "Completa 15 retos de interés.",
    "condition": {
      "kind": "completedInterest",
      "value": 15
    },
    "reward": {
      "box": "mastery"
    }
  },
  {
    "id": "A19",
    "name": "Mixto sin Miedo",
    "description": "Completa 10 retos mixtos.",
    "condition": {
      "kind": "completedType",
      "type": "mixed",
      "value": 10
    },
    "reward": {
      "box": "advanced"
    }
  },
  {
    "id": "A20",
    "name": "ProporcioLeyenda",
    "description": "Completa 100 retos.",
    "condition": {
      "kind": "completedTotal",
      "value": 100
    },
    "reward": {
      "box": "elite"
    }
  },
  {
    "id": "A21",
    "name": "Colección 25",
    "description": "Desbloquea 25 objetos.",
    "condition": {
      "kind": "collectiblesUnlocked",
      "value": 25
    },
    "reward": {
      "coins": 150
    }
  },
  {
    "id": "A22",
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
    "id": "A23",
    "name": "Abridor Experto",
    "description": "Abre 15 cajas.",
    "condition": {
      "kind": "boxesOpened",
      "value": 15
    },
    "reward": {
      "coins": 200
    }
  },
  {
    "id": "A24",
    "name": "Máquinas al Máximo",
    "description": "Completa retos de las cuatro máquinas principales.",
    "condition": {
      "kind": "allMachinesUsed",
      "value": 1
    },
    "reward": {
      "box": "mastery"
    }
  },
  {
    "id": "A25",
    "name": "Dominio Visual",
    "description": "Completa 150 retos en total.",
    "condition": {
      "kind": "completedTotal",
      "value": 150
    },
    "reward": {
      "box": "elite"
    }
  }
];
