const test=require('node:test');
const assert=require('node:assert/strict');
const createProfiles=require('../profiles.js');
const buildPacket=require('../packets.js');
const engines=require('../engine.js');
function storage(){const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v))}}
test('student profiles persist, normalize and isolate storage instances',()=>{
 const disk=storage(), a=createProfiles(disk), b=createProfiles(disk);
 a.add({name:'  Alice  ',kinds:['Arithmetic','Spelling','Arithmetic'],n:12,max:10,op:'+',words:['apple']});
 assert.deepEqual(b.list()[0].kinds,['Arithmetic','Spelling']);
 assert.equal(b.list()[0].name,'Alice');
 b.replace(0,{name:'Alice B',kinds:['Geometry'],n:24,max:50,op:'×',words:[]});
 assert.equal(a.list()[0].name,'Alice B');
 assert.deepEqual(createProfiles(storage()).list(),[]);
 a.remove(0);assert.equal(b.list().length,0);
});
test('invalid profiles and out-of-range edits are rejected',()=>{
 const p=createProfiles(storage());
 assert.throws(()=>p.add({name:' ',kinds:['Arithmetic']}),/required/);
 assert.throws(()=>p.add({name:'Child',kinds:[]}),/required/);
 assert.throws(()=>p.remove(0),/Invalid student/);
 assert.throws(()=>p.replace(0,{name:'Child',kinds:['Arithmetic']}),/Invalid student/);
});
test('five-day two-student packet creates separate worksheets and valid keys',()=>{
 const students=[
 {name:'Alice',kinds:['Arithmetic','Geometry'],n:6,max:10,op:'+',words:['apple']},
 {name:'Bob',kinds:['Spelling','Crossword'],n:12,max:12,op:'+',words:['garden','river']}
 ];
 const packet=buildPacket(students,5,(kind,s)=>engines[kind](s));
 assert.equal(packet.length,20);
 for(const s of students){
  const entries=packet.filter(p=>p.student===s.name);
  assert.equal(entries.length,5*s.kinds.length);
  for(let d=1;d<=5;d++)assert.deepEqual(entries.filter(p=>p.day===d).map(p=>p.kind),s.kinds);
 }
 for(const p of packet){assert.ok(p.result.items.length);for(const q of p.result.items){assert.ok(q.q);assert.ok(q.a)}}
});
test('packet rejects invalid day counts',()=>{
 for(const days of [0,8,1.5,NaN])assert.throws(()=>buildPacket([{name:'A',kinds:['Arithmetic']}],days,()=>({})),/Invalid packet/);
});

test('profile categories and custom words are validated before persistence',()=>{
 const p=createProfiles(storage());
 assert.throws(()=>p.add({name:'Child',kinds:['Unknown generator']}),/Valid worksheet category/);
 const [student]=p.add({name:'Child',kinds:['Arithmetic','Unknown generator','Arithmetic'],words:['  apple  ',42,' ', 'x'.repeat(200)]});
 assert.deepEqual(student.kinds,['Arithmetic']);
 assert.equal(student.words[0],'apple');
 assert.equal(student.words.length,2);
 assert.equal(student.words[1].length,120);
});
