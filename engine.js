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
if(typeof module!=='undefined')module.exports=engines;
