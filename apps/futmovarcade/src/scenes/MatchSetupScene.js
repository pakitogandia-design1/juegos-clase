import { bg,title,button,inputBox,homeButton,small } from '../ui/ui.js';
import { AIManager } from '../core/AIManager.js';
import { AI_RIVALS } from '../data/aiRivals.js';
import { StorageManager } from '../core/StorageManager.js';

export class MatchSetupScene extends Phaser.Scene{
  constructor(){super('MatchSetup')}

  init(data){
    this.mode=data?.mode||'local';
  }

  create(){
    bg(this);
    homeButton(this);
    title(this,this.mode==='local'?'PARTIDO LOCAL':'VS IA',78,58);

    this.target=5;
    this.diff='normal';
    this.rivalMode='random';
    this.rival=null;
    this.inputs=[];
    this.selectedTexts=[];
    this.profileName=StorageManager.getPlayerName(this.game.save);

    // Limpieza segura de inputs DOM al cambiar de escena. Esto evita que el DOM se quede
    // por encima del canvas o que bloquee el arranque de partidas rápidas en algunos navegadores.
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.cleanupInputs());

    if(this.mode==='local'){
      this.inputs.push(inputBox(this,470,205,290,'Jugador 1',this.profileName));
      this.inputs.push(inputBox(this,810,205,290,'Jugador 2','Rival'));
      small(this,640,255,'Los dos jugadores comparten dispositivo. Si marcas, sigues tirando.',22);
    }else{
      this.inputs.push(inputBox(this,640,190,330,'Tu nombre',this.profileName));
      small(this,640,240,'Humano siempre empieza. Sin powerups. La IA difícil aprieta, pero no hace trampas absurdas.',21);
      this.addDiffButtons();
      this.addRivalButtons();
    }

    this.addTargetButtons();
    button(this,640,600,340,70,'EMPEZAR PARTIDO',()=>this.startMatch(),0x31ff8a);
  }

  markSelected(kind,label){
    if(kind==='target') this.targetLabel?.setText(`Objetivo seleccionado: ${label}`);
    if(kind==='diff') this.diffLabel?.setText(`Dificultad seleccionada: ${label}`);
    if(kind==='rival') this.rivalLabel?.setText(`Rival: ${label}`);
  }

  addTargetButtons(){
    small(this,640,330,'Objetivo del partido',22);
    this.targetLabel=this.add.text(640,425,'Objetivo seleccionado: 5 goles',{fontSize:'19px',color:'#ffd166'}).setOrigin(.5);
    [[5,'5 goles'],[10,'10 goles'],[999,'Infinito']].forEach((v,i)=>button(this,450+i*190,380,160,54,v[1],()=>{this.target=v[0];this.markSelected('target',v[1]);},0xffd166));
  }

  addDiffButtons(){
    small(this,640,315,'Dificultad IA',21);
    this.diffLabel=this.add.text(640,405,'Dificultad seleccionada: Normal',{fontSize:'18px',color:'#ffd166'}).setOrigin(.5);
    [['easy','Fácil'],['normal','Normal'],['hard','Difícil'],['legendary','Legendario']].forEach((d,i)=>button(this,355+i*185,360,160,48,d[1],()=>{this.diff=d[0];this.rival=null;this.rivalMode='random';this.markSelected('diff',d[1]);this.markSelected('rival','aleatorio');}));
  }

  addRivalButtons(){
    this.rivalLabel=this.add.text(640,505,'Rival: aleatorio',{fontSize:'18px',color:'#dff8ff'}).setOrigin(.5);
    button(this,470,455,250,50,'Rival aleatorio',()=>{this.rivalMode='random';this.rival=null;this.markSelected('rival','aleatorio');});
    button(this,810,455,250,50,'Revancha IA',()=>{
      this.rivalMode='known';
      const knownIds=Object.entries(this.game.save.collection||{}).filter(([id,c])=>c.state!=='locked').map(([id])=>id);
      const pool=AI_RIVALS.filter(r=>knownIds.includes(r.id));
      if(pool.length){
        this.rival=Phaser.Utils.Array.GetRandom(pool);
        this.diff=this.rival.difficulty;
        this.markSelected('rival',AIManager.fullName(this.rival));
        this.markSelected('diff',this.rival.difficulty);
      }else{
        this.rival=null;
        this.rivalMode='random';
        this.markSelected('rival','no hay rivales descubiertos; usaré uno aleatorio');
      }
    },0xffd166);
  }

  cleanupInputs(){
    if(!this.inputs) return;
    this.inputs.forEach(i=>{
      try{i.destroy?.();}catch(e){}
      try{i.el?.destroy?.();}catch(e){}
      try{i.dom?.remove?.();}catch(e){}
    });
    this.inputs=[];
  }

  startMatch(){
    const p1=this.inputs?.[0]?.value||StorageManager.getPlayerName(this.game.save)||'Jugador 1';
    StorageManager.setPlayerName(this.game.save,p1);
    this.game.persist();
    const cfg={mode:this.mode,target:this.target,players:[],from:'setup'};

    if(this.mode==='local'){
      const p2=this.inputs?.[1]?.value||'Jugador 2';
      cfg.players=[
        {type:'human',name:p1,nick:'Cazacentésimas',score:0},
        {type:'human',name:p2,nick:'El Nervios',score:0}
      ];
    }else{
      const rival=this.rival||AIManager.randomRival(this.diff);
      cfg.players=[
        {type:'human',name:p1,nick:'Humano peligroso',score:0},
        {type:'ai',...rival,score:0}
      ];
      cfg.aiDifficulty=rival.difficulty;
    }

    // Destruir inputs antes del cambio evita bloqueos de DOM en Chrome móvil/escritorio.
    this.cleanupInputs();
    this.scene.start('Match',cfg);
  }
}
