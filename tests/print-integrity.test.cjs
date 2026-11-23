const test=require('node:test');
const assert=require('node:assert/strict');
const engines=require('../engine.js');
test('crossword clue answers are recoverable from printed key, with valid crossings',()=>{
 for(let i=0;i<200;i++){
  const {items,cells,placed}=engines.Crossword({});
  const [sheet]=items;
  assert.match(sheet.q,/Across\n1\./);
  assert.match(sheet.q,/Down\n1\./);
  const answerGrid=sheet.a.split('\n\nAcross:')[0].split('\n');
  assert.equal(answerGrid.length,cells.length);
  for(const entry of placed){
   assert.ok(entry.clue.length>4);
   assert.ok(sheet.q.includes(entry.number+'. '+entry.clue));
   for(let j=0;j<entry.word.length;j++){
    const y=entry.row+j*entry.dr,x=entry.col+j*entry.dc;
    assert.equal(cells[y][x],entry.word[j]);
    assert.ok(answerGrid[y].includes(entry.word[j]));
   }
  }
  const [down,top,bottom]=placed;
  assert.equal(top.word[0],down.word[0]);
  assert.equal(bottom.word[0],down.word.at(-1));
 }
});
test('all generators reject undefined and NaN output across supported settings',()=>{
 const words=['apple','garden','river','school','friend'];
 for(const [kind,engine] of Object.entries(engines)){
  for(const n of [6,12,24])for(const max of [10,12,50]){
   const result=engine({n,max,op:'÷',words});
   for(const {q,a} of result.items){
    assert.ok(q.length&&a.length,kind);
    assert.ok(!/undefined|NaN|Infinity/.test(q+' '+a),kind);
   }
  }
 }
});
