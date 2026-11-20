const PriceSeries=(()=>{
 const price=d=>d.close??d.nav,day=86400000;
 function slice(data,range){
  if(!data.length)return [];
  const end=range==='Covid crash 2020'?'2020-03-23':data.at(-1).date;
  const start=range==='Covid crash 2020'?'2020-01-14':new Date(Date.parse(end)-({'1M':30,'3M':90,'1Y':365,'52W':364}[range])*day).toISOString().slice(0,10);
  const r=data.filter(d=>d.date>=start&&d.date<=end),tol=range==='Covid crash 2020'?0:5*day;
  if(!r.length||Date.parse(r[0].date)-Date.parse(start)>tol||Date.parse(end)-Date.parse(r.at(-1).date)>tol||r.some((d,i)=>i&&Date.parse(d.date)-Date.parse(r[i-1].date)>7*day))return [];
  return r;
 }
 function stats(r){return {high:Math.max(...r.map(d=>d.high??d.nav)),low:Math.min(...r.map(d=>d.low??d.nav)),change:(price(r.at(-1))/price(r[0])-1)*100}}
 const index=(x,width,n)=>Math.max(0,Math.min(n-1,Math.floor(x/width*n)));
 const mode=(fund,selected)=>fund?'Line':selected;
 const empty=loaded=>loaded?'No price history for this period':'Price history not loaded yet';
 return {price,slice,stats,index,mode,empty};
})();
if(typeof module!=='undefined')module.exports=PriceSeries;
