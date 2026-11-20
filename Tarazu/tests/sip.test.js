const test=require('node:test'),assert=require('node:assert/strict'),D=require('../dist/model');
test('month-end timing and compounding in paise',()=>{
 assert.equal(D.future(10000,2,50),20050);assert.equal(D.future(10000,3,0),30000);
 assert.deepEqual(D.sip(80000,1),{payment:80000,best:80000,likely:80000,worst:80000});
});
test('monthly payment is the minimum paise to reach target',()=>{
 const target=8000000,m=D.sip(target,24);assert.ok(m.worst<m.likely&&m.likely<m.best);
 assert.ok(m.likely>=target);assert.ok(D.future(m.payment-1,24,50)<target);
});
test('invalid targets and months fail',()=>{for(const args of [[0,1],[100,0],[100,2.5],[101,121]])assert.throws(()=>D.sip(...args),RangeError)});
