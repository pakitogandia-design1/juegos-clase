import { StorageManager } from './systems/StorageManager.js';
import { SoundManager } from './systems/SoundManager.js';
import { RunManager } from './systems/RunManager.js';
import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { RunSetupScene } from './scenes/RunSetupScene.js';
import { DailyScene } from './scenes/DailyScene.js';
import { MapScene } from './scenes/MapScene.js';
import { EventScene } from './scenes/EventScene.js';
import { GameScene } from './scenes/GameScene.js';
import { RewardScene } from './scenes/RewardScene.js';
import { SummaryScene } from './scenes/SummaryScene.js';
import { CollectionScene, CodexScene, AchievementsScene, ProgressScene, PowerupsScene } from './scenes/ListScenes.js';
import { HowToScene, OptionsScene, CreditsScene } from './scenes/InfoScenes.js';

const save=StorageManager.load();
const sounder=new SoundManager(save);
const runManager=new RunManager(save);
const plugin={key:'Globals',plugin:{start(){},stop(){}},start:true};
const scenes=[BootScene,MenuScene,RunSetupScene,DailyScene,MapScene,EventScene,GameScene,RewardScene,SummaryScene,CollectionScene,CodexScene,AchievementsScene,ProgressScene,PowerupsScene,HowToScene,OptionsScene,CreditsScene];
for(const S of scenes){const old=S.prototype.init; S.prototype.init=function(){this.save=save; this.storage=StorageManager; this.sounder=sounder; this.runManager=runManager; old&&old.call(this);};}
const config={type:Phaser.AUTO,parent:'game',backgroundColor:'#050714',scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:900,height:640},scene:scenes,render:{antialias:true,pixelArt:false},dom:{createContainer:false}};
window.addEventListener('beforeunload',()=>StorageManager.save(save));
new Phaser.Game(config);
