const test=require('node:test'),assert=require('node:assert/strict'),D=require('../dist/model');
test('checkpoint sells once, keeps proceeds through recovery',()=>{
 const r=D.freshReplay();r.week=6;D.decide(r,'sell');D.decide(r,'sell');
 assert.equal(r.units,500);assert.equal(r.cash,3250000);assert.equal(D.value(r,12),8450000);
});
test('score is absent until completion, then measures retained exposure',()=>{
 for(const [actions,expected] of [[['hold','hold','hold'],100],[['sell','hold','hold'],50],[['sell','sell','sell'],13]]){
  const r=D.freshReplay();assert.equal(D.score(r),null);
  actions.forEach((a,i)=>{r.week=D.gates[i];D.decide(r,a)});r.week=12;assert.equal(D.score(r),expected);
 }
});
test('reversals count per symbol',()=>assert.equal(D.reversals([{id:'A',side:'Buy'},{id:'B',side:'Sell'},{id:'A',side:'Sell'}]),1));
