const test = require('node:test');
const assert = require('node:assert/strict');
const engines = require('../engine.js');

test('fraction answers are reduced and mathematically correct', () => {
  const gcd=(a,b)=>b?gcd(b,a%b):a;
  for(const max of [2,5,12,30]) for(let run=0;run<100;run++) {
    for(const {q,a} of engines.Fractions({n:20,max}).items) {
      const m=q.match(/^(\d+)\/(\d+) \+ (\d+)\/(\d+)/);
      assert.ok(m,q);
      const [,an,ad,bn,bd]=m.map(Number);
      assert.equal(ad,bd,q);
      const parts=a.split('/').map(Number);
      const numerator=parts[0],denominator=parts[1]??1;
      assert.ok(Number.isInteger(numerator)&&Number.isInteger(denominator)&&denominator>0,a);
      assert.equal(numerator*ad,(an+bn)*denominator,q);
      assert.equal(gcd(numerator,denominator),1,q);
    }
  }
});

test('word search answers identify actual horizontal word positions', () => {
  for(let run=0;run<100;run++) {
    const result=engines['Word search']({words:['apple','garden','bee','tree','sun','dog','cat']});
    assert.equal(result.items.length,1);
    const {q,a}=result.items[0];
    const rows=q.split('\n').map(row=>row.split(/\s+/));
    assert.equal(rows.length,15);
    rows.forEach(row=>assert.equal(row.length,15));
    const lines=a.split('\n');
    assert.equal(lines.length,7);
    for(const line of lines) {
      const m=line.match(/^([A-Z]+): row (\d+), columns (\d+)–(\d+)$/);
      assert.ok(m,line);
      const [,word,rs,cs,es]=m;
      const row=Number(rs)-1,start=Number(cs)-1,end=Number(es);
      assert.ok(row>=0&&row<15&&start>=0&&end<=15,line);
      assert.equal(rows[row].slice(start,end).join(''),word,line);
    }
  }
});
