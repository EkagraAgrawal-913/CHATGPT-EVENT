const Returns=(()=>{
 const series=typeof module!=='undefined'?require('./price-model'):PriceSeries;
 function history(rows,models){
  const included=[],excluded=[];
  for(const r of rows){
   const m=models[r.id],p=series.slice(m?.candles||[],'Covid crash 2020');
   const reviews=(m?.sources||[]).map(s=>s.actionReview).filter(r=>r?.from==='2020-01-14'&&r.to==='2020-03-23'&&r.sourceUrl);
   const affected=reviews.some(r=>r.status==='affected'),clear=reviews.some(r=>r.status==='clear');
   const fund=/^\d+$/.test(r.id),prior=m?.candles?.find(d=>d.date==='2020-01-13'),jump=p.some((d,i)=>{const prev=i?p[i-1]:prior;return prev&&Math.abs(series.price(d)-series.price(prev))*100>35*series.price(prev)});
   const why=!p.length?'history unavailable':jump?'suspected adjustment':affected?'price-distorting corporate action':fund&&!clear?'fund attestation missing':'';
   if(why){excluded.push({id:r.id,why});continue}
   const prices=new Map(p.map(d=>[d.date,series.price(d)]));included.push({...r,review:fund?'manually attested':clear?'action file checked':'price-jump guard only',prices,start:series.price(p[0]),fall:1-series.price(p.at(-1))/series.price(p[0])});
  }
  const capital=included.reduce((s,r)=>s+r.value,0),dates=included.length?[...included[0].prices.keys()].filter(d=>included.every(r=>r.prices.has(d))):[];
  return {included,excluded,capital,path:dates.map(date=>({date,value:included.reduce((s,r)=>s+Math.round(r.value*r.prices.get(date)/r.start),0)}))};
 }
 function scenarioLoss(rows,included,betas,indexFall){
  const observedById=new Map(included.map(row=>[row.id,row.fall]));
  const uncovered=rows.filter(row=>!observedById.has(row.id));
  const observed=included.reduce((sum,row)=>sum+Math.round(row.value*row.fall),0);
  const assumed=uncovered.length&&indexFall==null?null:uncovered.reduce((sum,row)=>sum+Math.round(row.value*(betas[row.id]??1)*indexFall),0);
  return {observed,assumed,uncovered,total:rows.length&&assumed!==null?observed+assumed:null};
 }
 function exposure(rows,sector,weights={}){
  const direct={},via={},bySector={};let funds=0,total=0;
  for(const {id,value} of rows){total+=value;if(sector[id]==='Fund')funds+=value;else direct[id]=(direct[id]||0)+value}
  for(const [id,pct] of Object.entries(weights))via[id]=Math.round(funds*pct/100);
  const combined={...direct};
  for(const [id,v] of Object.entries(via))combined[id]=(combined[id]||0)+v;
  const residual=funds-Object.values(via).reduce((a,b)=>a+b,0);
  if(residual)combined.Other=residual;
  for(const [id,v] of Object.entries(combined)){const key=sector[id]||({SBIN:'Banking',AXISBANK:'Banking',KOTAKBANK:'Banking',BAJFINANCE:'Finance'})[id]||'Unresolved';bySector[key]=(bySector[key]||0)+v}
  const sq=Object.values(combined).reduce((s,v)=>s+v*v,0);
  return {total,direct,via,combined,bySector,residual,effective:sq?total*total/sq:0};
 }
 function trade(rows,id,side,amount,sector,falls,feeRates,weights){
  if(!Number.isSafeInteger(amount)||amount<=0||!['Buy','Sell'].includes(side))throw Error('Enter a positive amount.');
  const values=new Map(rows.map(r=>[r.id,r.value])),old=values.get(id)||0;
  if(side==='Sell'&&amount>old)throw Error('Sale exceeds the marked holding.');
  function metrics(){const total=[...values.values()].reduce((s,n)=>s+n,0),sectors={};let sq=0,loss=0,fee=0;
   for(const [key,v] of values){if(!v)continue;const weight=v/total;sq+=weight*weight;sectors[sector[key]]=(sectors[sector[key]]||0)+weight;loss+=Math.round(v*falls[key]);fee+=Math.round(v*(feeRates[key]||0))}
   if(weights){const exp=exposure([...values].map(([id,value])=>({id,value})),sector,weights);sq=exp.effective?1/exp.effective:0;for(const k of Object.keys(sectors))delete sectors[k];for(const [k,v] of Object.entries(exp.bySector))if(k!=='Unresolved')sectors[k]=v/total}
   const top=Object.entries(sectors).sort((a,b)=>b[1]-a[1])[0]||['None',0];return {effective:sq?1/sq:0,top:top[0],weight:top[1],loss,fee}}
  const before=metrics();values.set(id,old+(side==='Buy'?amount:-amount));return {before,after:metrics()};
 }
 return {history,trade,exposure,scenarioLoss};
})();
if(typeof module!=='undefined')module.exports=Returns;
