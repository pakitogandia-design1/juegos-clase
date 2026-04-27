import SaveSystem from './SaveSystem.js';
import { ACHIEVEMENTS } from '../data/achievements.js';

export default class AchievementSystem {
  static newlyUnlocked(before, after) {
    return ACHIEVEMENTS.filter(a => !before.achievements[a.id] && after.achievements[a.id]);
  }

  static toast(scene, list) {
    list.slice(0,3).forEach((a,i) => {
      const box = scene.add.rectangle(760, 72 + i*58, 340, 48, 0x111827, .9).setStrokeStyle(2,0xfacc15,.95).setDepth(999);
      const tx = scene.add.text(760, 72 + i*58, `🏆 ${a.name}`, {fontSize:15, color:'#fde68a', fontStyle:'bold'}).setOrigin(.5).setDepth(1000);
      scene.tweens.add({targets:[box,tx], x:'-=18', yoyo:true, duration:170, repeat:1});
      scene.time.delayedCall(2600+i*300, () => { box.destroy(); tx.destroy(); });
    });
  }
}
