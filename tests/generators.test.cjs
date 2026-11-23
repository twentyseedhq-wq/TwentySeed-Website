// Run with: node --test tests/generators.test.cjs
const test=require('node:test');
const assert=require('node:assert/strict');
const engines=require('../engine.js');
const {execFileSync}=require('node:child_process');
const names=['Arithmetic','Fractions','Word problems','Spelling','Handwriting','Telling time','Money','Geometry','Word search','Crossword'];
test('all ten worksheet generators are registered',()=>assert.deepEqual(Object.keys(engines).sort(),names.sort()));
for(const name of names){
 test(name+' creates printable questions and answers',()=>{
  for(let attempt=0;attempt<25;attempt++){
   const result=engines[name]({n:12,max:12,op:'+',words:['apple','garden','river','school','friend']});
   assert.equal(typeof result.instructions,'string');
   assert.ok(result.instructions.length);
   assert.ok(result.items.length>0);
   for(const entry of result.items){assert.equal(typeof entry.q,'string');assert.equal(typeof entry.a,'string');assert.ok(entry.q.length);assert.ok(entry.a.length);assert.ok(!entry.q.includes('undefined'));assert.ok(!entry.a.includes('NaN'))}
  }
 });
}
test('arithmetic answer keys agree with expressions',()=>{
 for(const op of ['+','−','×','÷'])for(let i=0;i<100;i++){
  const items=engines.Arithmetic({n:12,max:50,op}).items;
  for(const {q,a} of items){
   const m=q.match(/^(\d+) ([+−×÷]) (\d+)/);assert.ok(m,q);
   const x=Number(m[1]),y=Number(m[3]),actual=op==='+'?x+y:op==='−'?x-y:op==='×'?x*y:x/y;
   assert.equal(Number(a),actual,q);
  }
 }
});
test('fractions are mathematically equivalent and reduced',()=>{
 const gcd=(a,b)=>b?gcd(b,a%b):a;
 for(let i=0;i<200;i++)for(const {q,a} of engines.Fractions({n:12,max:50}).items){
  const m=q.match(/^(\d+)\/(\d+) \+ (\d+)\/(\d+)/);assert.ok(m,q);
  const [,x,d,y,e]=m.map(Number);assert.equal(d,e);
  const parts=a.split('/').map(Number),num=parts[0],den=parts[1]||1;
  assert.equal(num*d,(x+y)*den,q);assert.equal(gcd(num,den),1,a);
 }
});
test('word search key coordinates match the printed grid',()=>{
 for(let i=0;i<100;i++){
  const {items}=engines['Word search']({words:['apple','garden','river','school','friend']});
  const grid=items[0].q.split('\n').map(x=>x.trim().split(/\s+/));
  for(const line of items[0].a.split('\n')){
   const m=line.match(/^([A-Z]+): row (\d+), columns (\d+)–(\d+)$/);assert.ok(m,line);
   const [,word,rs,cs,es]=m;assert.equal(grid[+rs-1].slice(+cs-1,+es).join(''),word);
  }
 }
});
test('crossword answer grid matches all clue placements',()=>{
 for(let i=0;i<100;i++){
  const c=engines.Crossword({});
  assert.equal(c.placed.length,3);
  for(const p of c.placed)for(let j=0;j<p.word.length;j++)
   assert.equal(c.cells[p.row+j*p.dr][p.col+j*p.dc],p.word[j],p.word);
  assert.ok(c.items[0].q.includes('Across'));assert.ok(c.items[0].q.includes('Down'));
 }
});
