(function(){
  const DIRS = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]];
  const LETTERS = 'AAAAAABCDEEEEFFGHIIIJKLMNÑOOOOPQRSTUUUVWXYZ';
  function rnd(seed){ let t = seed += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }
  function shuffle(arr, rand){ return arr.map(v=>[rand(),v]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]); }
  function sizeFor(words, base){
    const max = Math.max(...words.map(w=>w.gridWord.length));
    let s = base || (max<=8?10:max<=11?12:max<=14?14:max<=17?16:max<=19?18:20);
    if(words.length>=9) s = Math.max(s, 16);
    if(words.length>=11) s = Math.max(s, 18);
    if(max>=19) s = 20;
    return Math.min(20, Math.max(10, s));
  }
  function dirKey(d){ return d.dx+','+d.dy; }
  function boardScore(placed){
    const counts={};
    placed.forEach(p=>counts[dirKey(p.placement.dir)]=(counts[dirKey(p.placement.dir)]||0)+1);
    const vals=Object.values(counts), max=Math.max(...vals,0), unique=vals.length;
    const horizontal=(counts['1,0']||0)+(counts['-1,0']||0);
    const reverse=(counts['-1,0']||0)+(counts['0,-1']||0)+(counts['-1,-1']||0)+(counts['-1,1']||0);
    return placed.length*100 + unique*14 - max*10 - horizontal*4 - reverse*2;
  }
  function tryPlace(board, word, rand, dirUsage){
    const n=board.length;
    const dirs = shuffle(DIRS, rand).sort((a,b)=>((dirUsage[a[0]+','+a[1]]||0)-(dirUsage[b[0]+','+b[1]]||0)) || (rand()-.5));
    const starts=[];
    for(let y=0;y<n;y++) for(let x=0;x<n;x++) starts.push([x,y]);
    for(const [sx,sy] of shuffle(starts, rand)){
      for(const [dx,dy] of dirs){
        const ex=sx+dx*(word.length-1), ey=sy+dy*(word.length-1);
        if(ex<0||ey<0||ex>=n||ey>=n) continue;
        let ok=true, overlap=0;
        for(let i=0;i<word.length;i++){
          const x=sx+dx*i, y=sy+dy*i;
          if(board[y][x] && board[y][x]!==word[i]) { ok=false; break; }
          if(board[y][x]===word[i]) overlap++;
        }
        if(!ok) continue;
        const path=[];
        for(let i=0;i<word.length;i++){
          const x=sx+dx*i, y=sy+dy*i;
          board[y][x]=word[i]; path.push({x,y});
        }
        dirUsage[dx+','+dy]=(dirUsage[dx+','+dy]||0)+1;
        return {start:{x:sx,y:sy}, end:{x:ex,y:ey}, dir:{dx,dy}, path, overlap};
      }
    }
    return null;
  }
  function build(entries, seed, opts={}){
    const rand = (()=>{ let s=seed; return ()=>rnd(s++); })();
    const chosen = entries.filter(e=>e.gridWord && e.gridWord.length>=3 && e.gridWord.length<=20)
      .sort((a,b)=>b.gridWord.length-a.gridWord.length);
    let size=sizeFor(chosen, opts.size);
    for(let attempt=0;attempt<5;attempt++){
      const board=Array.from({length:size},()=>Array(size).fill(''));
      const placed=[]; let failed=[]; const dirUsage={};
      for(const entry of shuffle(chosen, rand).sort((a,b)=>b.gridWord.length-a.gridWord.length)){
        const p=tryPlace(board, entry.gridWord, rand, dirUsage);
        if(p){ placed.push({...entry, placement:p, found:false}); } else failed.push(entry);
      }
      if(placed.length>=Math.min(chosen.length, opts.minPlaced||5)){
        for(let y=0;y<size;y++) for(let x=0;x<size;x++) if(!board[y][x]) board[y][x]=LETTERS[Math.floor(rand()*LETTERS.length)];
        return {size, board, objectives:placed, failed, seed, score:boardScore(placed)};
      }
      size=Math.min(20,size+2);
    }
    return null;
  }
  function generateWordSearch(entries, opts={}){
    const baseSeed = opts.seed || Math.floor(Math.random()*99999999);
    let best=null;
    for(let i=0;i<16;i++){
      const candidate=build(entries, baseSeed+i*7919, opts);
      if(candidate && (!best || candidate.score>best.score)) best=candidate;
    }
    if(best) return best;
    throw new Error('No se pudo generar la sopa con suficientes palabras.');
  }
  window.generateWordSearch = generateWordSearch;
})();
