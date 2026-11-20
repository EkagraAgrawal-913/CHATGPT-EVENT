const test=require('node:test'),assert=require('node:assert/strict'),W=require('../dist/checks');
test('CSV validates row and cause before replacing holdings',()=>{
 const [h,row]=W.sample.split('\n');assert.equal(W.csv(W.sample).length,5);
 for(const [s,err] of [[row+'\n'+row,'3|duplicate'],['HDFCBANK,xx,3,','2|qty'],['"broken,1,2,','2|csv'],['INFY,1,-2,','2|cost']])assert.throws(()=>W.csv(h+'\n'+s),e=>e.message===err);
});
test('concentration weights use market value and correctly scale fractional fund units',()=>{
 const r=W.csv('symbol,quantity,average_cost\nINFY,1,80\n101525,2.500,10');
 const x=W.xray(r,{INFY:{ticks:1000000},101525:{ticks:200000}});
 assert.equal(x.total,15000);assert.equal(x.sectors.IT,10000);assert.equal(x.cost,10500);
});
test('annual charges compound on post-growth balance in paise',()=>{
 // Rs 100 with no growth and a 1% annual fee leaves Rs 98.01 after two years.
 assert.deepEqual(W.fee(10000,100,0,0,2),{regular:9801,direct:10000,difference:199});
});
test('historical loss equals original value multiplied by the observed relative fall',()=>{
 assert.equal(W.stress(100000,10000,6500),35000);
 const h=require('../dist/data/nifty-2020.json');assert.equal(W.stress(1236230,h.peak.hundredths,h.trough.hundredths),475205);
});
test('trade comparison uses external cash and leaves original positions intact',()=>{
 const {trade}=require('../dist/return-model'),r=[{id:'A',value:10000},{id:'B',value:10000}],args=[{A:'Banking',B:'Fund'},{A:.4,B:.2},{B:.1}];
 const m=trade(r,'B','Buy',10000,...args);assert.equal(m.before.effective,2);assert.equal(m.after.weight,2/3);assert.equal(m.after.loss,8000);assert.equal(m.after.fee,2000);assert.equal(r[1].value,10000);assert.throws(()=>trade(r,'A','Sell',10001,...args));
});
test('partial historical coverage applies own return to current value and uses the jump guard for unchecked equities',()=>{
 const model=require('../dist/return-model');
 const candles=Array.from({length:70},(_,i)=>({date:new Date(Date.parse('2020-01-14')+i*86400000).toISOString().slice(0,10),close:200-i}));
 const clear={sources:[{actionReview:{from:'2020-01-14',to:'2020-03-23',status:'clear',sourceUrl:'https://www.nseindia.com/'}}],candles};
 const a=model.history([{id:'A',value:10000},{id:'B',value:9000}],{A:clear,B:{candles}});
 assert.equal(a.capital,19000);assert.equal(a.path.at(-1).value,12445);assert.equal(a.included[1].review,'price-jump guard only');
 const risky=candles.map((r,i)=>i===3?{...r,close:100}:r);assert.equal(model.history([{id:'B',value:9000}],{B:{candles:risky}}).excluded[0].why,'suspected adjustment');
 assert.equal(model.history([{id:'101525',value:9000}],{101525:{candles}}).excluded[0].why,'fund attestation missing');
});
test('look-through combines direct and indirect weights and carries the unresolved remainder',()=>{
 const R=require('../dist/return-model'),rows=[{id:'A',value:6000},{id:'F',value:4000}],sectors={A:'Banking',F:'Fund'},w={A:25};
 const e=R.exposure(rows,sectors,w);assert.equal(e.combined.A,7000);assert.equal(e.residual,3000);
 const t=R.trade(rows,'F','Buy',4000,sectors,{A:.4,F:.4},{},w);assert.equal(t.before.weight,.7);assert.equal(t.after.weight,8000/14000);
});
test('stress headline separates observed and assumed amounts, including missing inputs',()=>{
 const {scenarioLoss}=require('../dist/return-model'),a={id:'A',value:10000},b={id:'B',value:3000};
 const mixed=scenarioLoss([a,b],[{...a,fall:-.1}],{},.4);
 assert.equal(mixed.observed,-1000);assert.equal(mixed.assumed,1200);assert.equal(mixed.total,200);
 assert.equal(scenarioLoss([a,b],[],{},.4).total,5200);
 assert.equal(scenarioLoss([a,b],[],{A:0},.4).total,1200);
 assert.equal(scenarioLoss([a],[],{},null).total,null);
 assert.equal(scenarioLoss([a],[{...a,fall:.2}],{},null).total,2000);
 assert.equal(scenarioLoss([],[],{},.4).total,null);
});
