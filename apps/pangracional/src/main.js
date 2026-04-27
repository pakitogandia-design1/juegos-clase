import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import ModeSelectScene from './scenes/ModeSelectScene.js';
import LevelSelectScene from './scenes/LevelSelectScene.js';
import TutorialScene from './scenes/TutorialScene.js';
import GameScene from './scenes/GameScene.js';
import AchievementsScene from './scenes/AchievementsScene.js';
import ProgressScene from './scenes/ProgressScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 960,
  height: 540,
  backgroundColor: '#101525',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 720 },
      debug: false
    }
  },
  input: {
    activePointers: 6
  },
  scene: [
    BootScene,
    MenuScene,
    ModeSelectScene,
    LevelSelectScene,
    TutorialScene,
    GameScene,
    AchievementsScene,
    ProgressScene
  ]
};

window.addEventListener('load', () => {
  window.PANG_RACIONAL_VERSION = '1.0.0';
  new Phaser.Game(config);
});
