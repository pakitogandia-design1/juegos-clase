import { bg,title,button,small,inputBox,panel,toast } from '../ui/ui.js';
import { StorageManager } from '../core/StorageManager.js';

export class MainMenuScene extends Phaser.Scene{
  constructor(){super('MainMenu')}

  create(){
    bg(this);
    this.game.audio.startMusic('menu');
    title(this,'FUTMOV',88,76);
    small(this,640,150,'Para el cronómetro. Marca. Humilla.',26);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.cleanupProfileInput());
    this.createProfileBox();

    const items=[['Jugar','ModeSelect'],['Campaña','Campaign'],['Torneo','Tournament'],['Entrenamiento','Training'],['Colección IA','Collection'],['Logros','Achievements'],['Ranking','Ranking'],['Ajustes','Settings'],['Cómo jugar','HowTo']];
    const cols=3;
    items.forEach((it,i)=>{
      const x=350+(i%cols)*290,y=270+Math.floor(i/cols)*90;
      button(this,x,y,245,58,it[0],()=>this.scene.start(it[1]));
    });

    const profileName=StorageManager.getPlayerName(this.game.save);
    const phrase=this.game.trash.pick('generic',{player:profileName,rival:'el cronómetro'});
    small(this,640,660,`🎙️ ${phrase}`,22);
  }

  createProfileBox(){
    panel(this,640,205,620,54,.72);
    small(this,390,205,'Jugador principal',18);
    const current=StorageManager.getPlayerName(this.game.save);
    this.profileInput=inputBox(this,620,205,230,'Tu nombre',current);
    button(this,830,205,150,42,'Guardar',()=>this.saveProfileName(),0x31ff8a);
  }

  saveProfileName(){
    const clean=StorageManager.setPlayerName(this.game.save,this.profileInput?.value||'Fran');
    this.game.persist();
    toast(this,`Nombre guardado: ${clean}`,'⚽');
  }

  cleanupProfileInput(){
    try{this.profileInput?.destroy?.();}catch(e){}
    this.profileInput=null;
  }
}
