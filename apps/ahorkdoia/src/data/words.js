import { WORDS_JARDINERIA } from './words/words.jardineria.js';
import { WORDS_MATEMATICAS } from './words/words.matematicas.js';
import { WORDS_CIENCIA } from './words/words.ciencia.js';
import { WORDS_FLORISTERIA } from './words/words.floristeria.js';
import { WORDS_FANTASIA } from './words/words.fantasia.js';
import { WORDS_ZOMBIA } from './words/words.zombia.js';
import { WORDS_LIBRERIA } from './words/words.libreria.js';
import { WORDS_ZOOLOGIA } from './words/words.zoologia.js';
import { WORDS_QUIMICA } from './words/words.quimica.js';
import { WORDS_FISICA } from './words/words.fisica.js';
import { WORDS_ECOLOGIA } from './words/words.ecologia.js';

export const ALL_WORDS = [...WORDS_JARDINERIA, ...WORDS_MATEMATICAS, ...WORDS_CIENCIA, ...WORDS_FLORISTERIA, ...WORDS_FANTASIA, ...WORDS_ZOMBIA, ...WORDS_LIBRERIA, ...WORDS_ZOOLOGIA, ...WORDS_QUIMICA, ...WORDS_FISICA, ...WORDS_ECOLOGIA];
export const WORD_BANKS = {
  jardineria: WORDS_JARDINERIA,
  matematicas: WORDS_MATEMATICAS,
  ciencia: WORDS_CIENCIA,
  floristeria: WORDS_FLORISTERIA,
  fantasia: WORDS_FANTASIA,
  zombia: WORDS_ZOMBIA,
  libreria: WORDS_LIBRERIA,
  zoologia: WORDS_ZOOLOGIA,
  quimica: WORDS_QUIMICA,
  fisica: WORDS_FISICA,
  ecologia: WORDS_ECOLOGIA
};
