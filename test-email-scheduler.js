const assert=require('node:assert/strict');const s=require('./email-scheduler');
const rows=s.schedule({recipient:'parent@example.com',student:'Alex',start:'2026-11-23',count:52});
assert.equal(rows.length,52);assert.equal(rows[0].scheduledAt,'2026-11-23T08:00:00.000Z');assert.equal(rows[51].scheduledAt,'2027-11-15T08:00:00.000Z');
assert(rows.every(x=>x.status==='preview-only'&&x.recipient==='parent@example.com'));assert.equal(new Set(rows.map(x=>x.id)).size,52);
assert.equal(s.due(rows,'2026-11-30T07:59:59Z').length,1);assert.equal(s.due(rows,'2026-11-30T08:00:00Z').length,2);
assert.equal(s.toCsv(rows).split('\r\n').length,53);
for(const bad of [{recipient:'bad',start:'2026-11-23'},{recipient:'x@y.com',start:'invalid'},{recipient:'x@y.com',start:'2026-11-23',count:53},{recipient:'x@y.com',start:'2026-11-23',hour:24}])assert.throws(()=>s.schedule(bad));
assert.equal(s.schedule({recipient:'a@b.com',start:'2026-12-31',count:2})[1].scheduledAt,'2027-01-07T08:00:00.000Z');
console.log('Email scheduler: 12 assertions passed; preview only; no email sent');
