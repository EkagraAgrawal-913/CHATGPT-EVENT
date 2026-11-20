'use strict';
const Checks=(()=>{
 const catalog=typeof module!=='undefined'?require('./data/universe'):Universe;
 const sample=typeof module!=='undefined'?require('./data/sample-input'):SampleInput.csv;
 const normal=s=>s.toLowerCase().replace(/\b(limited|ltd)\.?$/,'').trim();
 function csv(text){
  const lines=text.trim().replace(/^\uFEFF/,'').split(/\r?\n/);
  function cells(line,n){if(!/^(?:"(?:[^"]|"")*"|[^",]*)(?:,(?:"(?:[^"]|"")*"|[^",]*))*$/.test(line))throw Error(n+'|csv');return (line+',').match(/(?:"(?:[^"]|"")*"|[^",]*),/g).map(x=>x.slice(0,-1).replace(/^"|"$/g,'').replace(/""/g,'"').trim())}
  const head=cells(lines.shift(),1).map(s=>s.toLowerCase().replace(/ /g,'_'));
  const sym=head.findIndex(s=>['symbol','name'].includes(s)),q=head.indexOf('quantity'),cost=head.indexOf('average_cost'),date=head.indexOf('acquired');
  if(Math.min(sym,q,cost)<0||new Set(head).size!==head.length)throw Error('1|header');
  if(!lines.length||lines.length>1000)throw Error('2|size');
  const seen=new Set();
  return lines.map((line,i)=>{
   const n=i+2,c=cells(line,n);if(c.length!==head.length)throw Error(n+'|columns');
   const id=Object.keys(catalog).find(k=>[k,catalog[k][0]].some(v=>normal(v)===normal(c[sym])));
   if(!id)throw Error(n+'|symbol');if(seen.has(id))throw Error(n+'|duplicate');seen.add(id);
   if(!/^\d{1,7}(\.\d{1,3})?$/.test(c[q])||Number(c[q])<=0||catalog[id][1]!=='Fund'&&!Number.isInteger(Number(c[q])))throw Error(n+'|qty');
   if(!/^\d{1,7}(\.\d{1,2})?$/.test(c[cost])||Number(c[cost])<=0||Number(c[q])*Number(c[cost])>1e10)throw Error(n+'|cost');
   const acquired=c[date]||'';if(acquired&&(!/^\d{4}-\d\d-\d\d$/.test(acquired)||!Number.isFinite(Date.parse(acquired))||new Date(acquired).toISOString().slice(0,10)!==acquired||acquired>new Date().toISOString().slice(0,10)))throw Error(n+'|date');
   return {id,units:Math.round(Number(c[q])*1000),basis:Math.round(Number(c[cost])*100),acquired};
  });
 }
 // Quote ticks are ten-thousandths of a rupee; quantities are thousandths of a unit.
 const rounded=(a,b,d)=>Number((BigInt(a)*BigInt(b)+BigInt(Math.floor(d/2)))/BigInt(d));
 function xray(lots,quotes){const rows=lots.filter(l=>quotes[l.id]?.ticks>0).map(l=>({...l,value:rounded(l.units,quotes[l.id].ticks,100000),cost:rounded(l.units,l.basis,1000)}));const total=rows.reduce((s,r)=>s+r.value,0),sectors={};for(const r of rows){let key=catalog[r.id][1];sectors[key]=(sectors[key]||0)+r.value}return {rows,total,sectors,cost:rows.reduce((s,r)=>s+r.cost,0)}}
 function fee(principal,regular,direct,growth,years){
  if(![principal,regular,direct,growth,years].every(Number.isSafeInteger)||principal<=0||Math.min(regular,direct)<0||Math.max(regular,direct)>1000||growth<0||growth>2000||years<1||years>30)throw RangeError();
  function end(rate){let v=principal;for(let y=0;y<years;y++)v=rounded(rounded(v,10000+growth,10000),10000-rate,10000);return v}
  return {regular:end(regular),direct:end(direct),difference:end(direct)-end(regular)};
 }
 function stress(value,peak,trough){return rounded(value,peak-trough,peak)}
 return {stress,fee,catalog,sample,csv,rounded,xray};
})();
if(typeof module!=='undefined')module.exports=Checks;
