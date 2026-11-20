const TaxCheck=(()=>{
 const rules=typeof module!=='undefined'?require('./data/tax-2026'):TaxRules;
 function longDate(acquired){
  const d=new Date(acquired+'T00:00:00Z'),y=d.getUTCFullYear()+1,m=d.getUTCMonth();
  const day=Math.min(d.getUTCDate(),new Date(Date.UTC(y,m+1,0)).getUTCDate());
  return new Date(Date.UTC(y,m,day+1)).toISOString().slice(0,10);
 }
 function estimate(lots,count,price,date,available){
  if(!Number.isInteger(count)||count<1||!Number.isInteger(available)||available<0||available>rules.exemptionPaise)throw Error('inputs');
  if(date<rules.from||date>rules.through)throw Error('year');
  let left=count,short=0,long=0;const lines=[];
  for(const lot of [...lots].sort((a,b)=>(a.date||'').localeCompare(b.date||''))){
   if(!left)break;
   if(!lot.date||lot.date>date||lot.date<=rules.grandfatherThrough)throw Error('history');
   const n=Math.min(left,lot.q),gain=n*(price-lot.price),boundary=longDate(lot.date),isLong=date>=boundary;
   if(gain<0)throw Error('loss');
   if(isLong)long+=gain;else short+=gain;
   lines.push({n,gain,boundary,isLong,days:Math.round((Date.parse(date)-Date.parse(lot.date))/86400000)});left-=n;
  }
  if(left)throw Error('inputs');
  const base=(s,l)=>Math.round(s*rules.shortBp/10000)+Math.round(Math.max(0,l-available)*rules.longBp/10000);
  const withCess=v=>v+Math.round(v*rules.cessBp/10000);
  const tax=withCess(base(short,long)),waitDate=lines.reduce((v,l)=>v>l.boundary?v:l.boundary,date);
  const later=waitDate<=rules.through?withCess(base(0,long+short)):null;
  return {lines,tax,later,waitDate};
 }
 return {longDate,estimate};
})();
if(typeof module!=='undefined')module.exports=TaxCheck;
