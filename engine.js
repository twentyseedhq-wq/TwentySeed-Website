const r=n=>1+Math.floor(Math.random()*n), make=(n,f)=>Array.from({length:n},f), pack=(instructions,items)=>({instructions,items}), item=(q,a)=>({q,a:String(a)}), blank=' = ______';
const engines={
'Arithmetic':({n,max,op})=>pack('Solve each problem.',make(n,()=>{let a=r(max),b=r(max);if(op==='−'&&a<b)[a,b]=[b,a];if(op==='÷')a*=b;return item(`${a} ${op} ${b}${blank}`,op==='+'?a+b:op==='−'?a-b:op==='×'?a*b:a/b)})),
'Fractions':({n,max})=>pack('Add fractions with the same denominator. Simplify your answers.',make(n,()=>{let d=r(Math.min(max,12))+1,a=r(d-1),b=r(d-1),s=a+b,g=(x,y)=>y?g(y,x%y):x,z=g(s,d);return item(`${a}/${d} + ${b}/${d}${blank}`,d/z===1?s/z:`${s/z}/${d/z}`)})),
'Word problems':({n,max})=>pack('Read each problem and show your work.',make(n,()=>{let a=r(max),b=r(max);return item(`A garden has ${a} rows with ${b} plants in each row. How many plants are there?\n________`,a*b)})),
'Spelling':({words,n})=>pack('Write each word twice.',(words.length?words:['apple','garden']).slice(0,n).map(w=>item(`${w}\n________________\n________________`,w))),
'Handwriting':({words,n})=>pack('Trace or copy each line, then practice on paper.',(words.length?words:['Practice makes progress']).slice(0,n).map(w=>item(`${w}\n____________________________`,w))),
'Telling time':({n,max})=>pack('Write the digital time.',make(n,()=>{let h=r(12),m=(r(max===10?2:12)-1)*(max===10?30:5);return item(`${m} minutes after ${h} o’clock${blank}`,`${h}:${String(m).padStart(2,'0')}`)})),
'Money':({n,max})=>pack('Find the total value in cents.',make(n,()=>{let a=r(Math.min(max,12)),b=r(10);return item(`${a} quarters + ${b} dimes${blank} cents`,25*a+10*b)})),
'Geometry':({n,max})=>pack('Find the area of each rectangle in square units.',make(n,()=>{let a=r(max),b=r(max);return item(`Length ${a}, width ${b}${blank}`,a*b)})),
'Word search':({words})=>{
 let ws=[...new Set(words.map(w=>w.toUpperCase().replace(/[^A-Z]/g,'' )).filter(w=>w.length>=2&&w.length<=15))].slice(0,10);
 if(!ws.length)ws=['APPLE','GARDEN'];
 const size=15,dirs=[[0,1],[1,0],[1,1],[1,-1],[0,-1],[-1,0],[-1,-1],[-1,1]];
 let grid,placed;
 for(let attempt=0;attempt<20;attempt++){
 grid=make(size,()=>Array(size).fill(''));placed=[];
 for(const w of [...ws].sort((a,b)=>b.length-a.length)){
 const options=[];
 for(let y=0;y<size;y++)for(let x=0;x<size;x++)for(const [dy,dx] of dirs){
 const ey=y+dy*(w.length-1),ex=x+dx*(w.length-1);
 if(ey<0||ey>=size||ex<0||ex>=size)continue;
 if([...w].every((c,i)=>!grid[y+i*dy][x+i*dx]||grid[y+i*dy][x+i*dx]===c))options.push([y,x,dy,dx,ey,ex]);
 }
 if(!options.length)break;
 const [y,x,dy,dx,ey,ex]=options[r(options.length)-1];
 [...w].forEach((c,i)=>grid[y+i*dy][x+i*dx]=c);
 placed.push({word:w,row:y,col:x,dr:dy,dc:dx,endRow:ey,endCol:ex});
 }
 if(placed.length===ws.length)break;
 }
 if(placed.length!==ws.length){grid=make(size,()=>Array(size).fill(''));placed=ws.map((w,y)=>{[...w].forEach((c,x)=>grid[y][x]=c);return {word:w,row:y,col:0,dr:0,dc:1,endRow:y,endCol:w.length-1}})}
 grid=grid.map(row=>row.map(c=>c||String.fromCharCode(64+r(26))));
 const ans=placed.map(e=>e.word+': row '+(e.row+1)+', column '+(e.col+1)+' → row '+(e.endRow+1)+', column '+(e.endCol+1));
 return {...pack('Find these words: '+ws.join(', '),[item(grid.map(row=>row.join('  ')).join('\n'),ans.join('\n'))]),grid,placed};
}
};
function crossword(){
 const bank=[["PLANT","A living thing that grows"],["LEAF","A flat green part of a plant"],["ROOT","Part of a plant that takes in water"],["STEM","Part that supports leaves"],["SEED","A tiny beginning of a new plant"],["FLOWER","A bloom on a plant"],["RAIN","Water falling from clouds"],["SOIL","Earth where plants grow"],["SUN","The star nearest Earth"],["TREE","A tall plant with a woody trunk"],["BEE","An insect that makes honey"],["POND","A small body of still water"],["FROG","An animal that hops and croaks"],["BIRD","An animal with feathers"],["NEST","A place where birds lay eggs"],["GRASS","Green blades growing on lawns"]];
 const size=21, cells=make(size,()=>Array(size).fill('#')), used=make(size,()=>Array(size).fill(0)), placed=[];
 const shuffled=[...bank];for(let i=shuffled.length-1;i>0;i--){const j=r(i+1)-1;[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
 function put(word,clue,row,col,dr,dc){placed.push({word,clue,row,col,dr,dc});[...word].forEach((c,i)=>{cells[row+i*dr][col+i*dc]=c;used[row+i*dr][col+i*dc]|=dr?2:1;});}
 put(...shuffled[0],10,8,0,1);
 for(let pass=0;pass<3&&placed.length<8;pass++)for(const [word,clue] of shuffled){
 if(placed.length>=8)break;if(placed.some(e=>e.word===word))continue;
 const opts=[];
 for(let y=1;y<size-1;y++)for(let x=1;x<size-1;x++)for(const [dr,dc] of [[0,1],[1,0]]){
 const ey=y+dr*(word.length-1),ex=x+dc*(word.length-1);if(ey>=size-1||ex>=size-1||cells[y-dr][x-dc]!=='#'||cells[ey+dr][ex+dc]!=='#')continue;
 let cross=0,ok=true;for(let i=0;i<word.length;i++){const yy=y+i*dr,xx=x+i*dc,c=cells[yy][xx];if(c!=='#'){if(c!==word[i]||(used[yy][xx]&(dr?2:1))){ok=false;break;}cross++;}else if(cells[yy-dc][xx-dr]!=='#'||cells[yy+dc][xx+dr]!=='#'){ok=false;break;}}
 if(ok&&cross)opts.push([y,x,dr,dc]);
 }
 if(opts.length)put(word,clue,...opts[r(opts.length)-1]);
 }
 const top=Math.min(...placed.map(e=>e.row)),left=Math.min(...placed.map(e=>e.col)),bottom=Math.max(...placed.map(e=>e.row+e.dr*(e.word.length-1))),right=Math.max(...placed.map(e=>e.col+e.dc*(e.word.length-1)));
 const grid=cells.slice(top,bottom+1).map(row=>row.slice(left,right+1));placed.forEach(e=>{e.row-=top;e.col-=left;});placed.sort((a,b)=>a.row-b.row||a.col-b.col);let num=0,last='';for(const e of placed){const key=e.row+','+e.col;if(key!==last){num++;last=key;}e.number=num;}
 const clues=dir=>placed.filter(e=>dir==='Across'?e.dc:e.dr).map(e=>e.number+'. '+e.clue).join('\n');
 const diagram=grid.map((row,y)=>row.map((c,x)=>c==='#'?'██':String(placed.find(e=>e.row===y&&e.col===x)?.number||' ').padStart(2,' ')+'□').join(' ')).join('\n');
 return {...pack('Complete the crossword. Shaded squares are blocked.',[item(diagram+'\n\nAcross\n'+clues('Across')+'\n\nDown\n'+clues('Down'),grid.map(row=>row.map(c=>c==='#'?'██': ' '+c).join(' ')).join('\n')+'\n'+placed.map(e=>e.number+' '+(e.dc?'Across':'Down')+': '+e.word).join('\n'))]),cells:grid,placed};
}
engines['Crossword']=crossword;
if(typeof module!=='undefined')module.exports=engines;
