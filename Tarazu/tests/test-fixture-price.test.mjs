import test from 'node:test';import assert from 'node:assert/strict';import {parse} from '../tools/import-prices.mjs';import M from '../dist/price-model.js';
const header='Date, Open Price,High, Low,Close,Total Traded Quantity',row='14-Jan-2020,1.055,2,1,1.50,100';
test('tiny importer fixture: price units, aliases, invalid rows and duplicates',()=>{
 assert.equal(parse(header+'\n'+row+'\n'+row,'INFY').length,1);assert.equal(parse(header+'\n'+row,'INFY')[0].open,106);
 for(const bad of [row+'\n'+row.replace(',100',',101'),row.replace(',2,',',1,'),row.replace(',100',',1.2'),row.replace('14-Jan','32-Jan')])assert.throws(()=>parse(header+'\n'+bad,'INFY'),/row/);
});
test('fixture ranges use complete observations, not gaps; fund and pointer behaviour',()=>{
 const first=Date.parse('2020-01-14'),obs=Array.from({length:366},(_,i)=>({date:new Date(first+i*86400000).toISOString().slice(0,10),nav:100+i}));
 assert.equal(M.slice(obs,'Covid crash 2020').at(-1).date,'2020-03-23');assert.deepEqual(M.slice(obs.slice(2),'Covid crash 2020'),[]);
 const s=M.stats(M.slice(obs,'52W'));assert.equal(s.low,101);assert.equal(s.high,465);assert.equal(s.change,(465/101-1)*100);
 assert.equal(M.index(100,100,20),19);assert.equal(M.index(-3,100,20),0);assert.equal(M.mode(true,'Candles'),'Line');assert.equal(M.empty(false),'Price history not loaded yet');
});
test('preamble, series, grouped values and supported dates',()=>{
 for(const date of ['14-01-2020','14/01/2020','14 Jan 2020','14-Jan-2020','2020-01-14']){
 const rows=parse('Report\n\n'+header+',Series\n'+date+',100,110,90,105,"1,23,456",EQ\n'+date+',100,110,90,105,10,BE','INFY');assert.equal(rows.length,1);assert.equal(rows[0].date,'2020-01-14');assert.equal(rows[0].volume,123456)}
});
test('cash dividend is non-distorting; mixed dividend and split is flagged',async()=>{
 const {reviewActions}=await import('../tools/action-review.mjs');const csv='SYMBOL,EX-DATE,PURPOSE\nA,15-Jan-2020,Interim Dividend';assert.equal(reviewActions(csv,'A').status,'clear');assert.equal(reviewActions(csv+' and Sub-Division','A').status,'affected');
});
