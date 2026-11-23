const test=require('node:test');
const assert=require('node:assert/strict');
const buildPacket=require('../packets.js');
const engines=require('../engine.js');
const student={name:'Learner',kinds:['Arithmetic','Fractions','Crossword'],n:6,max:12,op:'÷',words:['apple']};
test('packet rejects malformed profiles instead of silently printing empty packets',()=>{
 for(const students of [null,{},[],[{name:'',kinds:['Arithmetic']}],[{name:'A',kinds:[]}],[{name:'A',kinds:['']}]]){
  assert.throws(()=>buildPacket(students,5,()=>({instructions:'ok',items:[{q:'q',a:'a'}]})));
 }
 assert.throws(()=>buildPacket([student],5,null),/Invalid packet/);
});
test('packet rejects missing answers and invalid worksheet output',()=>{
 for(const bad of [null,{}, {instructions:'',items:[]},{instructions:'ok',items:[]},{instructions:'ok',items:[{q:'question',a:''}]},{instructions:'ok',items:[{q:'question'}]}]){
  assert.throws(()=>buildPacket([student],1,()=>bad),/Invalid worksheet result/);
 }
});
test('multi-day packet preserves each generated answer key and student ordering',()=>{
 const students=[student,{name:'Second',kinds:['Word search','Money'],n:12,max:10,op:'+',words:['river','garden']}];
 const packet=buildPacket(students,5,(kind,s)=>engines[kind](s));
 assert.equal(packet.length,25);
 assert.deepEqual(packet.slice(0,3).map(x=>x.kind),student.kinds);
 assert.equal(packet[0].day,1);
 assert.equal(packet[15].student,'Second');
 for(const entry of packet){
  assert.ok(entry.day>=1&&entry.day<=5);
  assert.ok(entry.result.items.every(it=>it.q.length&&it.a.length));
 }
});
