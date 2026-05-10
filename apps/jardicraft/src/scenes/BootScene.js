export class BootScene extends Phaser.Scene {
  constructor(){ super('BootScene'); }
  create(){
    this.makePixelTextures();
    this.scene.start('PreloadScene');
  }
  makePixelTextures(){
    const blockColors={grass:[0x4d8b3d,0x397038,0x6faa54],dirt:[0x8a5a32,0x684022,0xaa7040],tilled:[0x7b4a28,0x56331d,0x9a6038],wet:[0x5d4432,0x3f3027,0x785c42],sand:[0xc8b56b,0xa99552,0xe0d08c],gravel:[0x7b8184,0x5b6064,0xa4aaad],stone:[0x686f73,0x4d5558,0x90979b],water:[0x2f77a7,0x1e526f,0x5dade0],wood:[0x9b6a38,0x6d4625,0xba844b],path:[0x9b927d,0x6f6758,0xc2b99f],compost:[0x5a3c24,0x3d2819,0x7d5432],mulch:[0x6d4225,0x4a2d19,0x8f5b33],fertile:[0x5a6e35,0x3d4f28,0x79a34d],poor:[0x8a7953,0x685b3e,0xa59469],dry:[0xa47f4a,0x775a34,0xc69a5d],flooded:[0x3f6f7b,0x294a56,0x5b9aaa]};
    Object.entries(blockColors).forEach(([id,c])=>this.blockTexture('block_'+id,c));
    this.shadowTexture(); this.icons(); this.playerTextures(); this.plantTextures(); this.decorationTextures();
  }
  blockTexture(key,[top,side,hi]){
    const g=this.make.graphics({x:0,y:0,add:false});
    g.clear();
    g.fillStyle(side,1); g.beginPath(); g.moveTo(0,24); g.lineTo(48,48); g.lineTo(96,24); g.lineTo(96,42); g.lineTo(48,66); g.lineTo(0,42); g.closePath(); g.fillPath();
    g.fillStyle(Phaser.Display.Color.ValueToColor(side).darken(18).color,1); g.beginPath(); g.moveTo(48,48); g.lineTo(96,24); g.lineTo(96,42); g.lineTo(48,66); g.closePath(); g.fillPath();
    g.fillStyle(top,1); g.beginPath(); g.moveTo(0,24); g.lineTo(48,0); g.lineTo(96,24); g.lineTo(48,48); g.closePath(); g.fillPath();
    g.lineStyle(2,0x1b241d,.55); g.strokePath();
    for(let i=0;i<18;i++){ g.fillStyle(i%2?hi:Phaser.Display.Color.ValueToColor(top).brighten(12).color,.18); const x=Phaser.Math.Between(14,82), y=Phaser.Math.Between(8,36); g.fillRect(x,y,Phaser.Math.Between(2,5),2); }
    g.generateTexture(key,96,72); g.destroy();
  }
  shadowTexture(){ const g=this.make.graphics({add:false}); g.fillStyle(0x000000,.22); g.fillEllipse(32,16,58,18); g.generateTexture('soft_shadow',64,32); g.destroy(); }
  icons(){
    const tools={hand:0xd9c3a3,hoe:0x9e7a46,shovel:0x9ca6ad,watering:0x4aa6c8,pruners:0xbfd4d9,sprayer:0x83c9b7,rake:0xb68451,hammer:0xa36f46,compost_item:0x654321,seed:0x68b657};
    Object.entries(tools).forEach(([k,col])=>{const g=this.make.graphics({add:false}); g.fillStyle(0x111922,1); g.fillRoundedRect(0,0,40,40,4); g.lineStyle(2,0x708090,1); g.strokeRoundedRect(1,1,38,38,4); g.fillStyle(col,1); g.fillRect(12,8,16,24); g.fillStyle(0xf5f0d0,.8); g.fillRect(16,4,8,8); g.generateTexture('icon_'+k,40,40); g.destroy();});
    ['common','rare','epic','legendary','secret'].forEach((r,i)=>{const colors=[0xaeb7b3,0x5aa6ff,0xb06cff,0xffc857,0x85fff2]; const g=this.make.graphics({add:false}); g.lineStyle(3,colors[i],1); g.strokeRoundedRect(2,2,36,36,4); g.generateTexture('rarity_'+r,40,40); g.destroy();});
  }
  playerTextures(){
    const dirs=['down','up','left','right'];
    dirs.forEach(d=>{ const g=this.make.graphics({add:false});
      g.fillStyle(0x000000,.22); g.fillEllipse(24,52,28,10);
      g.fillStyle(0xe0b27a,1); g.fillRect(17,8,14,14);
      g.fillStyle(0x2d7a42,1); g.fillRect(14,23,20,20);
      g.fillStyle(0x24313d,1); g.fillRect(14,42,8,13); g.fillRect(26,42,8,13);
      g.fillStyle(0x7a4a25,1); g.fillRect(12,5,24,6);
      g.fillStyle(0x111111,1); if(d==='down'){g.fillRect(20,13,2,2);g.fillRect(27,13,2,2);} else if(d==='left'){g.fillRect(17,13,2,2);} else if(d==='right'){g.fillRect(29,13,2,2);} 
      g.generateTexture('player_'+d,48,60); g.destroy(); });
  }
  plantTextures(){
    const palette=[0x8fcf64,0x5abf54,0x7bc96f,0x4d9a48,0x62b35e,0x9bce55,0xc25555,0x67b266,0xe6dd65,0xea6a7a,0x8fd6e1,0xa3c95d,0x85b25b,0x5b8a46,0x3d7c4a,0x799a5a,0x7aa344,0x88bb56,0x58aa4c,0xe0a44c,0xb1c45e,0xf2eb77,0x86c15e,0xd36cdf,0x6abc64,0x62bc73,0x82b958,0xb6cb76,0x9f6cc7,0xd5536b];
    for(let i=0;i<30;i++) for(const st of ['small','adult','bad']){ const g=this.make.graphics({add:false}); const c=palette[i%palette.length];
      g.fillStyle(0x000000,.16); g.fillEllipse(24,41,26,7);
      g.fillStyle(0x4b7a36,1); g.fillRect(22,25,4,18);
      const radius=st==='small'?7:12; const offset=st==='bad'?4:0;
      g.fillStyle(st==='bad'?0xb9a84f:c,1); for(let a=0;a<6;a++){ const x=24+Math.cos(a)*radius; const y=25+Math.sin(a)*radius*.55+offset; g.fillCircle(x,y,5); }
      if(st==='adult' && i%3===0){ g.fillStyle(0xd56bd0,1); g.fillCircle(19,18,3); g.fillCircle(29,20,3); }
      if(st==='bad'){ g.fillStyle(0xf0d060,1); g.fillRect(16,12,4,4); g.fillRect(30,24,4,4); }
      g.generateTexture(`plant_${i}_${st}`,48,48); g.destroy(); }}
  }
  decorationTextures(){
    ['fence','pot','table','composter','water_tank','hut','workbench','sign','sprinkler','greenhouse','bench','lamp','fountain','pergola','pond','border','stone_path','wood_path','raised_bed','bee_hotel'].forEach((id,i)=>{ const g=this.make.graphics({add:false});
      g.fillStyle(0x000000,.18); g.fillEllipse(32,50,48,12); const col=[0x8b5a32,0xb76d3d,0x71808a,0x5d3f25,0x4d92b8,0x9c6b3e,0x765033,0xb49a58,0x66aacc,0x89cbbd][i%10];
      g.fillStyle(col,1); g.fillRoundedRect(16,14,32,34,3); g.fillStyle(Phaser.Display.Color.ValueToColor(col).brighten(25).color,1); g.fillRect(20,10,24,10); g.lineStyle(2,0x17202a,.5); g.strokeRoundedRect(16,14,32,34,3);
      g.generateTexture('deco_'+id,64,64); g.destroy(); });
  }
}
