export class BubbleGrid {
  constructor(scene, opts={}){
    this.scene=scene; this.r=opts.radius||24; this.cols=opts.cols||10; this.rows=opts.rows||9;
    this.x0=opts.x0||58; this.y0=opts.y0||60; this.h=this.r*2+4; this.v=Math.sqrt(3)*this.r+3;
    this.cells=new Map();
  }
  key(r,c){ return `${r},${c}`; }
  has(r,c){ return this.cells.has(this.key(r,c)); }
  get(r,c){ return this.cells.get(this.key(r,c)); }
  set(r,c,b){ b.row=r; b.col=c; const p=this.pos(r,c); b.x=p.x; b.y=p.y; this.cells.set(this.key(r,c),b); }
  del(r,c){ const b=this.get(r,c); if(b){ b.destroyBubble?.(); this.cells.delete(this.key(r,c)); } }
  removeBubble(b){ this.cells.delete(this.key(b.row,b.col)); b.destroyBubble?.(); }
  all(){ return [...this.cells.values()]; }
  pos(r,c){ return { x:this.x0 + c*this.h + (r%2)*this.h/2, y:this.y0 + r*this.v }; }
  cellAtWorld(x,y){
    let best=null, bd=Infinity;
    for(let r=0;r<this.rows+4;r++) for(let c=0;c<this.cols;c++){
      const p=this.pos(r,c); const d=(p.x-x)**2+(p.y-y)**2;
      if(d<bd){bd=d; best={row:r,col:c,dist:Math.sqrt(d)};}
    }
    return best;
  }
  isInside(r,c){ return r>=0 && c>=0 && c<this.cols && r<this.rows+8; }
  neighbors(r,c){
    const even = r%2===0;
    const dirs = even ? [[0,-1],[0,1],[-1,-1],[-1,0],[1,-1],[1,0]] : [[0,-1],[0,1],[-1,0],[-1,1],[1,0],[1,1]];
    return dirs.map(([dr,dc])=>({row:r+dr,col:c+dc})).filter(n=>this.isInside(n.row,n.col));
  }
  nearestEmptyAround(x,y, hitBubble=null){
    const candidates=[];
    if(hitBubble){ candidates.push(...this.neighbors(hitBubble.row, hitBubble.col)); }
    const n=this.cellAtWorld(x,y); candidates.push(n, ...this.neighbors(n.row,n.col));
    let best=null, bd=Infinity;
    for(const cell of candidates){
      if(!this.isInside(cell.row,cell.col) || this.has(cell.row,cell.col)) continue;
      const p=this.pos(cell.row,cell.col); const d=(p.x-x)**2+(p.y-y)**2;
      if(d<bd){bd=d; best=cell;}
    }
    return best || n;
  }
  groupFrom(start){
    const first=this.get(start.row,start.col); if(!first) return [];
    const q=[first], seen=new Set([this.key(first.row,first.col)]), out=[];
    while(q.length){ const b=q.shift(); out.push(b); for(const n of this.neighbors(b.row,b.col)){ const nb=this.get(n.row,n.col); const k=this.key(n.row,n.col); if(nb && nb.value===first.value && !seen.has(k)){seen.add(k); q.push(nb);} } }
    return out;
  }
  connectedToTop(){
    const q=[], seen=new Set();
    for(let c=0;c<this.cols;c++){ const b=this.get(0,c); if(b){ q.push(b); seen.add(this.key(0,c)); } }
    while(q.length){ const b=q.shift(); for(const n of this.neighbors(b.row,b.col)){ const nb=this.get(n.row,n.col); const k=this.key(n.row,n.col); if(nb && !seen.has(k)){seen.add(k); q.push(nb);} } }
    return seen;
  }
  floating(){
    const top=this.connectedToTop(); return this.all().filter(b=>!top.has(this.key(b.row,b.col)));
  }
  lower(amount){
    this.y0 += amount;
    for(const b of this.all()){ const p=this.pos(b.row,b.col); this.scene.tweens.add({targets:b.container,x:p.x,y:p.y,duration:230,ease:'Sine.easeOut'}); b.x=p.x; b.y=p.y; }
  }
}
