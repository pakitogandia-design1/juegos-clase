import { makeButton } from './NeonButton.js';
import { COLORS } from '../config/gameConfig.js';
export class OperationPanel {
  constructor(scene, onActivate) {
    this.scene = scene; this.onActivate = onActivate;
    this.tool = 'pistol'; this.op = '-'; this.num = 1; this.side = 'left';
    this.buttons = { tools: [], ops: [], nums: [], sides: [] };
    this.build(); this.refresh();
  }
  build() {
    const s = this.scene;
    s.add.rectangle(640, 628, 1200, 158, COLORS.panel, 0.82).setStrokeStyle(2, COLORS.cyan, 0.5);
    s.add.text(66, 565, 'HERRAMIENTA', labelStyle());
    this.buttons.tools.push(makeButton(s, 130, 610, 130, 54, 'PISTOLA', ()=>{this.tool='pistol'; if(!['-','÷'].includes(this.op)) this.op='-'; this.refresh();}, {color:COLORS.red, fontSize:'18px', bold:true}));
    this.buttons.tools.push(makeButton(s, 275, 610, 130, 54, 'GANCHO', ()=>{this.tool='hook'; if(!['+','×'].includes(this.op)) this.op='+'; this.refresh();}, {color:COLORS.yellow, fontSize:'18px', bold:true}));
    s.add.text(365, 565, 'OPERACIÓN', labelStyle());
    ['-','÷','+','×'].forEach((op, i)=> this.buttons.ops.push(makeButton(s, 410+i*62, 610, 50, 54, op, ()=>{this.op=op; this.tool=['-','÷'].includes(op)?'pistol':'hook'; this.refresh();}, {color:['-','÷'].includes(op)?COLORS.red:COLORS.yellow, fontSize:'28px', bold:true})));
    s.add.text(650, 565, 'CARGA', labelStyle());
    [1,2,3,4,5,6,7,8,9,10,11,12,'x'].forEach((n, i)=> this.buttons.nums.push(makeButton(s, 675+(i%7)*45, 596+Math.floor(i/7)*48, 38, 38, String(n), ()=>{this.num=n; this.refresh();}, {color:n==='x'?COLORS.magenta:COLORS.purple, fontSize:n==='x'?'19px':'16px', bold:true})));
    s.add.text(820, 681, 'La carga x sirve para juntar incógnitas en niveles avanzados.', {fontFamily:'Arial', fontSize:'11px', color:'#7f93aa'}).setOrigin(0.5);
    s.add.text(980, 565, 'LADO INICIAL', labelStyle());
    this.buttons.sides.push(makeButton(s, 1035, 610, 90, 54, 'IZQ', ()=>{this.side='left'; this.refresh();}, {color:COLORS.cyan, fontSize:'18px', bold:true}));
    this.buttons.sides.push(makeButton(s, 1135, 610, 90, 54, 'DER', ()=>{this.side='right'; this.refresh();}, {color:COLORS.cyan, fontSize:'18px', bold:true}));
    this.activate = makeButton(s, 640, 690, 300, 44, 'ACTIVAR ESPEJO', ()=>this.onActivate(this.getSelection()), {color:COLORS.green, fontSize:'22px', bold:true});
  }
  getSelection() { return { tool:this.tool, op:this.op, num:this.num, side:this.side }; }
  refresh() {
    this.buttons.tools[0].setActiveState(this.tool==='pistol'); this.buttons.tools[1].setActiveState(this.tool==='hook');
    this.buttons.ops.forEach(b=>b.setActiveState(b.label.text===this.op));
    this.buttons.nums.forEach(b=>b.setActiveState(String(b.label.text)===String(this.num)));
    const xSelected = this.num === 'x';
    this.buttons.ops.forEach(b => { if (xSelected && ['×','÷'].includes(b.label.text)) b.setAlpha(0.35); else b.setAlpha(1); });
    this.buttons.sides[0].setActiveState(this.side==='left'); this.buttons.sides[1].setActiveState(this.side==='right');
  }
  setEnabled(v) { [...this.buttons.tools,...this.buttons.ops,...this.buttons.nums,...this.buttons.sides,this.activate].forEach(b => v ? b.setInteractive({useHandCursor:true}) : b.disableInteractive()); }
}
function labelStyle(){return {fontFamily:'Arial',fontSize:'13px',color:'#9fb5c8',fontStyle:'bold'};}
