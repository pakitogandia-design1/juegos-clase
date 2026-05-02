import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import EndingScene from './scenes/EndingScene.js';
import CreditsScene from './scenes/CreditsScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-root',
  backgroundColor: '#08090d',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight
  },
  input: { activePointers: 3 },
  render: { pixelArt: false, antialias: true },
  scene: [BootScene, MenuScene, GameScene, EndingScene, CreditsScene]
};

new Phaser.Game(config);
