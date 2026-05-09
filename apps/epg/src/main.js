import { GAME_WIDTH, GAME_HEIGHT } from './config/gameConfig.js';
import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { ProgressScene } from './scenes/ProgressScene.js';
import { AchievementsScene } from './scenes/AchievementsScene.js';
import { CollectionScene } from './scenes/CollectionScene.js';
import { HowToPlayScene } from './scenes/HowToPlayScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#050612',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT
  },
  dom: { createContainer: false },
  scene: [BootScene, MenuScene, GameScene, ProgressScene, AchievementsScene, CollectionScene, HowToPlayScene]
};

window.addEventListener('load', () => {
  new Phaser.Game(config);
});
