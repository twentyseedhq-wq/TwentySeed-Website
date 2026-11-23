const test = require('node:test');
const assert = require('node:assert/strict');
const engines = require('../engine.js');

test('money keys match coin values and geometry keys match rectangle areas', () => {
  for (let i=0;i<100;i++) {
    for (const {q,a} of engines.Money({n:24,max:50}).items) {
      const m=q.match(/^(\d+) quarters \+ (\d+) dimes/);
      assert.ok(m,q);
      assert.equal(Number(a),25*Number(m[1])+10*Number(m[2]),q);
    }
    for (const {q,a} of engines.Geometry({n:24,max:50}).items) {
      const m=q.match(/^Length (\d+), width (\d+)/);
      assert.ok(m,q);
      assert.equal(Number(a),Number(m[1])*Number(m[2]),q);
    }
  }
});

test('time keys agree with verbal clocks and have valid hours and minutes', () => {
  for (const max of [10,12,50]) for (let i=0;i<100;i++) {
    for (const {q,a} of engines['Telling time']({n:24,max}).items) {
      const m=q.match(/^(\d+) minutes after (\d+) o’clock/);
      assert.ok(m,q);
      const [h,minute]=a.split(':').map(Number);
      assert.equal(h,Number(m[2]),q);
      assert.equal(minute,Number(m[1]),q);
      assert.ok(h>=1&&h<=12&&minute>=0&&minute<60,q);
      assert.equal(minute%5,0,q);
    }
  }
});

test('word problem keys match described multiplication', () => {
  for (let i=0;i<100;i++) for (const {q,a} of engines['Word problems']({n:24,max:50}).items) {
    const m=q.match(/has (\d+) rows with (\d+) plants/);
    assert.ok(m,q);
    assert.equal(Number(a),Number(m[1])*Number(m[2]),q);
  }
});
