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
'Word search':({words})=>{let ws=[...new Set(words.map(w=>w.toUpperCase().replace(/[^A-Z]/g,'')).filter(w=>w.length>=2&&w.length<=15))].slice(0,10);if(!ws.length)ws=['APPLE','GARDEN'];let size=15,grid=make(size,()=>Array(size).fill('')),ans=[];ws.forEach((w,i)=>{let col=r(size-w.length+1)-1;for(let j=0;j<w.length;j++)grid[i][col+j]=w[j];ans.push(`${w}: row ${i+1}, columns ${col+1}–${col+w.length}`)});return pack('Find these words: '+ws.join(', '),[item(grid.map(row=>row.map(c=>c||String.fromCharCode(64+r(26))).join('  ')).join('\n'),ans.join('\n'))])}
};
function crossword(){
 const variants=[
 ["PLANT","A living thing with roots","PIG","A farm animal that oinks","TREE","A tall plant with a trunk"],
 ["STONE","A small rock","SUN","The star nearest Earth","EGG","A hen lays this"],
 ["BREAD","Food baked from dough","BEE","An insect that makes honey","DOG","A pet that barks"],
 ["CLOUD","A mass of droplets in the sky","CAT","A pet that purrs","DUCK","A bird that quacks"]
 ];
 const [v,vc,a,ac,b,bc]=variants[Math.floor(Math.random()*variants.length)];
 const cells=Array.from({length:v.length},()=>Array(Math.max(a.length,b.length)).fill("#"));
 const placed=[{word:v,clue:vc,row:0,col:0,dr:1,dc:0,number:1},{word:a,clue:ac,row:0,col:0,dr:0,dc:1,number:1},{word:b,clue:bc,row:v.length-1,col:0,dr:0,dc:1,number:2}];
 for(const e of placed) for(let i=0;i<e.word.length;i++)cells[e.row+i*e.dr][e.col+i*e.dc]=e.word[i];
 const diagram=cells.map((row,y)=>row.map((c,x)=>c==="#"?"██":x===0&&y===0?"1□":x===0&&y===v.length-1?"2□":" □").join(" ")).join("\n");
 return {instructions:"Complete the crossword. Shaded squares are blocked.",items:[{q:diagram+"\n\nAcross\n1. "+ac+"\n2. "+bc+"\n\nDown\n1. "+vc,a:cells.map(row=>row.map(c=>c==="#"?"██":" "+c).join(" ")).join("\n")+"\n\nAcross: "+a+", "+b+"\nDown: "+v}],cells,placed};
}
engines['Crossword']=crossword;
if(typeof module!=='undefined')module.exports=engines;
