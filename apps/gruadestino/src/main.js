import BootScene from './scenes/BootScene.js?v=autoaventura2';
import MenuScene from './scenes/MenuScene.js?v=autoaventura2';
import GameScene from './scenes/GameScene.js?v=autoaventura2';
import EndingScene from './scenes/EndingScene.js?v=autoaventura2';
import CreditsScene from './scenes/CreditsScene.js?v=autoaventura2';

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
