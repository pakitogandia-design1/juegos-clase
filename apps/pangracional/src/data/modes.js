export const MODES = {
  normal: {
    id: 'normal',
    name: 'Normal',
    subtitle: 'Para aprender sin temporizador',
    bubbleSpeed: 1,
    timer: 0,
    lives: 4,
    powerRate: 0.23,
    wrongPenalty: 25,
    feedback: 'alto'
  },
  hard: {
    id: 'hard',
    name: 'Difícil',
    subtitle: 'Más velocidad y 99 segundos',
    bubbleSpeed: 1.23,
    timer: 99,
    lives: 3,
    powerRate: 0.14,
    wrongPenalty: 50,
    feedback: 'medio'
  },
  nightmare: {
    id: 'nightmare',
    name: 'Pesadilla',
    subtitle: '60 segundos, pocos power-ups',
    bubbleSpeed: 1.48,
    timer: 60,
    lives: 3,
    powerRate: 0.08,
    wrongPenalty: 80,
    feedback: 'bajo'
  }
};

export const MODE_ORDER = ['normal', 'hard', 'nightmare'];
