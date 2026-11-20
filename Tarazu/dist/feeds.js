const Feeds=(()=>{
 const ttl=6*3600000, quotes={};
 const navUrl='https://portal.amfiindia.com/spages/NAVAll.txt';
 Object.assign(quotes,PublishedMarks);
 let busy=false;
 async function refresh(){
  if(busy)return;busy=true;
  try{
   const now=Date.now(),cached=state.publicPrices;
   if(cached)for(const [id,q] of Object.entries(cached.quotes))if(Checks.catalog[id]&&q.date>=(quotes[id]?.date||''))quotes[id]=q;
   if(cached&&now-cached.at<ttl)return;
   const day=new Date(now+19800000);if(day.getUTCHours()<18)day.setUTCDate(day.getUTCDate()-1);
   while([0,6].includes(day.getUTCDay()))day.setUTCDate(day.getUTCDate()-1);
   const iso=day.toISOString().slice(0,10),stamp=iso.split('-').reverse().join('');
   async function load(url,parse){const response=await fetch(url,{credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(7000)});if(!response.ok)throw Error();parse(await response.text())}
   await Promise.allSettled([
    load(navUrl,text=>{for(const line of text.split(/\r?\n/)){const c=line.split(';'),id=c[0];if(!Checks.catalog[id]||Checks.catalog[id][1]!=='Fund')continue;const price=Number(c.at(-2)),date=Date.parse(c.at(-1)+' 00:00:00 GMT');if(price>0&&Number.isFinite(date)){const iso=new Date(date).toISOString().slice(0,10);if(iso>=(quotes[id]?.date||''))quotes[id]={ticks:Math.round(price*10000),date:iso,source:'AMFI NAV',fallback:false}}}}),
    load('https://nsearchives.nseindia.com/products/content/sec_bhavdata_full_'+stamp+'.csv',text=>{const lines=text.trim().split(/\r?\n/),h=lines.shift().split(',').map(x=>x.trim());for(const line of lines){const c=line.split(',').map(x=>x.trim()),id=c[h.indexOf('SYMBOL')],price=Number(c[h.indexOf('CLOSE_PRICE')]);if(Checks.catalog[id]&&c[h.indexOf('SERIES')]==='EQ'&&price>0&&iso>=(quotes[id]?.date||''))quotes[id]={ticks:Math.round(price*10000),date:iso,source:'NSE EOD · IST',fallback:false}}})
   ]);
   state.publicPrices={at:now,quotes};save();
  }finally{busy=false}
 }
 return {quotes,refresh};
})();
