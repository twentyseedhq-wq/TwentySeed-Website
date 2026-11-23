const test=require('node:test');
const assert=require('node:assert/strict');
const createBilling=require('../billing-sandbox.js');
const mail=require('../email-scheduler.js');
function storage(){const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)}}
test('billing remains simulated and preserves cancellation access only until expiry',()=>{
 let now=new Date('2026-01-31T12:00:00Z');
 const b=createBilling(storage(),()=>now);
 assert.equal(b.current().plan,'free');assert.equal(b.access(),false);
 assert.equal(b.subscribe('family').renewsAt,'2026-02-28T12:00:00.000Z');
 assert.equal(b.access(),true);
 now=new Date('2026-02-10T12:00:00Z');assert.equal(b.cancel().status,'canceled');assert.equal(b.access(),true);
 now=new Date('2026-02-28T12:00:00Z');assert.equal(b.access(),false);
 b.reset();assert.equal(b.current().plan,'free');
 assert.throws(()=>b.subscribe('not-a-plan'),/Unknown plan/);
});
test('weekly email preview creates no outbound messages and dates advance seven days',()=>{
 const items=mail.schedule({recipient:'parent@example.com',student:'Alice',start:'2026-11-23',hour:8,count:4});
 assert.equal(items.length,4);
 assert.deepEqual(items.map(x=>x.scheduledAt),['2026-11-23T08:00:00.000Z','2026-11-30T08:00:00.000Z','2026-12-07T08:00:00.000Z','2026-12-14T08:00:00.000Z']);
 assert.ok(items.every(x=>x.status==='preview-only'));
 assert.equal(mail.due(items,'2026-11-30T07:59:00Z').length,1);
 assert.equal(mail.due(items,'2026-11-30T08:00:00Z').length,2);
 const csv=mail.toCsv(items);assert.equal(csv.split('\r\n').length,5);
 assert.ok(csv.includes('parent@example.com'));
});
test('scheduler rejects unsafe or invalid input',()=>{
 for(const recipient of ['invalid','', 'foo@bar'])assert.throws(()=>mail.schedule({recipient,start:'2026-11-23'}),/Invalid email/);
 for(const opts of [{hour:24},{minute:-1},{count:0},{count:53}])assert.throws(()=>mail.schedule({recipient:'p@example.com',start:'2026-11-23',...opts}),/Invalid schedule options/);
 assert.throws(()=>mail.schedule({recipient:'p@example.com',start:'bad-date'}),/Invalid date/);
});
