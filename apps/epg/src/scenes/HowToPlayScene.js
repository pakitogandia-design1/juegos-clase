import { BaseScene } from './BaseScene.js';
import { COLORS } from '../config/gameConfig.js';
export class HowToPlayScene extends BaseScene {
  constructor(){ super('HowToPlayScene'); }
  create(){
    this.drawNeonBackground(); this.backButton();
    this.add.text(640, 70, 'CÓMO JUGAR', {fontFamily:'Arial', fontSize:'42px', fontStyle:'bold', color:'#ffffff'}).setOrigin(0.5).setShadow(0,0,'#00d9ff',14);
    this.add.rectangle(640, 370, 1010, 500, 0x090b19, 0.86).setStrokeStyle(2, COLORS.cyan, 0.6);
    const text = [
      'Objetivo: dejar la incógnita sola:  x = número  o  número = x.',
      '',
      'El Espejo EPG copia siempre la misma operación al otro lado.',
      'No “pasas términos”: actúas en un lado y el espejo conserva la igualdad.',
      '',
      'PISTOLA: resta y divide. Sirve para quitar bloques o romper coeficientes.',
      'GANCHO: suma y multiplica. Sirve para añadir paquetes o liberar x cuando está dividida.',
      'En niveles avanzados aparece la carga x: puedes sumar o restar x a ambos lados para juntar incógnitas.',
      '',
      'Puedes perder si gastas la energía del espejo, usas demasiados movimientos,',
      'provocas sobrecarga numérica o, en arcade avanzado, los glitches alcanzan el espejo.',
      '',
      'Consejo clave: primero limpia los números sueltos. Después libera el coeficiente de x.'
    ].join('\n');
    this.add.text(180, 160, text, {fontFamily:'Arial', fontSize:'24px', color:'#f4fbff', lineSpacing:10}).setOrigin(0);
  }
}
