export class NavigationSystem {
  constructor(ui){ this.ui = ui; this.stack = []; }
  open(name, payload={}){ this.stack.push({name,payload}); this.ui.showPanel(name,payload); }
  back(){ this.stack.pop(); const last = this.stack[this.stack.length-1]; if(last) this.ui.showPanel(last.name,last.payload,true); else this.ui.closePanel(); }
  close(){ this.stack = []; this.ui.closePanel(); }
}
