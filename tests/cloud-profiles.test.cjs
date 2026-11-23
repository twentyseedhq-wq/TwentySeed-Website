const test=require('node:test'),assert=require('node:assert/strict');
const create=require('../cloud-profiles.js');
function mock(user='parent-a'){
 const calls=[];let operation,filters=[],payload;
 const query={select(...x){calls.push(['select',...x]);return this},eq(...x){filters.push(x);return this},order(...x){calls.push(['order',...x]);return Promise.resolve({data:[],error:null})},single(){return Promise.resolve({data:{id:'student-1',...payload},error:null})},insert(x){operation='insert';payload=x;return this},update(x){operation='update';payload=x;return this},delete(){operation='delete';return this}};
 return {calls,filters,get operation(){return operation},get payload(){return payload},auth:{getUser:async()=>({data:{user:user?{id:user}:null},error:null})},from(name){assert.equal(name,'students');return query}};
}
test('all operations constrain ownership; insert uses authenticated identity',async()=>{
 const m=mock(),p=create(m);
 await p.list();assert.deepEqual(m.filters.at(-1),['parent_id','parent-a']);
 await p.add({name:'  Alice  ',grade:'3'});assert.deepEqual(m.payload,{name:'Alice',grade:'3',parent_id:'parent-a'});
 await p.replace('student-1',{name:'Alice B'});assert.deepEqual(m.filters.slice(-2),[['id','student-1'],['parent_id','parent-a']]);
 await p.remove('student-1');assert.deepEqual(m.filters.slice(-2),[['id','student-1'],['parent_id','parent-a']]);
});
test('unauthenticated requests and invalid records fail before database access',async()=>{
 const m=mock(null),p=create(m);await assert.rejects(p.list(),/Sign in required/);await assert.rejects(p.add({name:'Alice'}),/Sign in required/);
 const n=mock(),q=create(n);await assert.rejects(q.add({name:'  '}),/name required/);await assert.rejects(q.add({name:'A',grade:'x'.repeat(41)}),/grade/);await assert.rejects(q.remove(''),/ID required/);
});
test('propagates Supabase errors',async()=>{
 const m=mock();m.auth.getUser=async()=>({error:new Error('Auth unavailable')});
 await assert.rejects(create(m).list(),/Auth unavailable/);
});
