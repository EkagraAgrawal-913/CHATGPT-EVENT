import fs from 'node:fs/promises';
import universe from '../dist/data/universe.js';
import old from '../dist/data/marks.js';
const date=process.argv[2]||new Date().toISOString().slice(0,10),marks={...old};
if(!/^\d{4}-\d\d-\d\d$/.test(date))throw Error('Use YYYY-MM-DD');
const stamp=date.split('-').reverse().join('');let updated=0;
for(const [source,url] of [['NSE EOD','https://nsearchives.nseindia.com/products/content/sec_bhavdata_full_'+stamp+'.csv'],['AMFI NAV','https://portal.amfiindia.com/spages/NAVAll.txt']]){
 try{const response=await fetch(url,{signal:AbortSignal.timeout(12000)});if(!response.ok)throw Error(String(response.status));
 const lines=(await response.text()).trim().split(/\r?\n/),h=lines.shift().split(',').map(s=>s.trim());
 for(const line of lines){const fund=source==='AMFI NAV',r=line.split(fund?';':',').map(s=>s.trim()),id=r[0];if(!universe[id]||(!fund&&r[h.indexOf('SERIES')]!=='EQ'))continue;
 const v=Number(fund?r.at(-2):r[h.indexOf('CLOSE_PRICE')]),asOf=fund?new Date(r.at(-1)+' 00:00 GMT').toISOString().slice(0,10):date;
 if(v>0&&asOf>=(marks[id]?.date||'')){marks[id]={ticks:Math.round(v*10000),date:asOf,source,sourceUrl:url,fallback:true};updated++}}
 }catch(e){console.error(source,e.message)}
}
if(!updated){console.error('No verified observations; snapshot preserved.');process.exitCode=1}else{
 const dest=new URL('../dist/data/marks.js',import.meta.url),tmp=new URL(dest.href+'.tmp');await fs.writeFile(tmp,'const PublishedMarks='+JSON.stringify(marks)+";\nif(typeof module!=='undefined')module.exports=PublishedMarks;\n");await fs.rename(tmp,dest);console.log(updated,'marks refreshed');
}
