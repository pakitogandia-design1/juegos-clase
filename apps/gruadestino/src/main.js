import BootScene from './scenes/BootScene.js?v=autoaventura3';
import MenuScene from './scenes/MenuScene.js?v=autoaventura3';
import GameScene from './scenes/GameScene.js?v=autoaventura3';
import EndingScene from './scenes/EndingScene.js?v=autoaventura3';
import CreditsScene from './scenes/CreditsScene.js?v=autoaventura3';

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

const game = new Phaser.Game(config);
window.__GRUA_GAME__ = game;

if (window.__GRUA_FORCE_AUTO__) {
  setTimeout(() => window.__startGruaAutoaventura?.(), 800);
}
