const test=require('node:test'),assert=require('node:assert/strict'),T=require('../dist/tax');
const lot={q:2,price:10000,date:'2025-11-20'};
test('anniversary stays short, next day is long, including leap anniversary',()=>{
 assert.equal(T.estimate([lot],1,20000,'2026-11-20',0).lines[0].isLong,false);
 assert.equal(T.estimate([lot],1,20000,'2026-11-21',0).lines[0].isLong,true);
 assert.equal(T.longDate('2024-02-29'),'2025-03-01');
});
test('FIFO across long and short lots; allowance applies to long gains only',()=>{
 const v=T.estimate([lot,{q:1,price:5000,date:'2024-04-02'}],2,20000,'2026-11-20',15000);
 // First gain 15000 paise exempt. Remaining gain 10000 at 20% plus 4% cess.
 assert.equal(v.tax,2080);assert.equal(v.later,1300);
});
