import { BaseScene } from './BaseScene.js';
export class BootScene extends BaseScene {
  constructor(){ super('BootScene'); }
  create(){ this.scene.start('MenuScene'); }
}
