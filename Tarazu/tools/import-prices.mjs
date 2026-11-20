import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {reviewActions} from './action-review.mjs';
import universe from '../dist/data/universe.js';
import sampleCSV from '../dist/data/sample-input.js';
const catalog={...universe,NIFTY50:['NIFTY 50','Index',null]};
const norm=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
const aliases={date:['date','timestamp','tradingdate','businessdate','indexdate','historicaldate'],open:['open','openprice'],close:['close','closeprice','closingprice'],high:['high','highprice'],low:['low','lowprice'],volume:['volume','totaltradedquantity','tottrdqty','shares','noofshares'],nav:['nav','netassetvalue']};
export function parse(raw,symbol){
 const fund=/^\d+$/.test(symbol),keys=symbol==='NIFTY50'?['date','close']:fund?['date','nav']:['date','open','high','low','close','volume'];
 const input=raw.split(/\r?\n/),header=input.findIndex(l=>keys.every(k=>l.split(/[;,]/).some(v=>aliases[k].includes(norm(v)))));
 if(header<0)throw Error('Missing price header');
 const lines=input.slice(header),sep=lines[0].includes(';')?';':',';
 function cells(line){const parts=[],re=new RegExp('(?:^|'+sep+')(?:"((?:[^"]|"")*)"|([^"'+sep+']*))(?='+sep+'|$)','gy');let m;while(re.lastIndex<line.length&&(m=re.exec(line))){parts.push((m[1]??m[2]).trim());if(!m[0].length)break}return parts}
 const h=cells(lines.shift()).map(norm),idx=Object.fromEntries(keys.map(k=>[k,h.findIndex(n=>aliases[k].includes(n))]));
 for(const k of keys)if(idx[k]<0)throw Error('row 1: missing '+k);
 const dates=new Set(),out=[];
 for(const [i,line] of lines.entries()){
  if(!line.trim())continue;
  const fail=why=>{throw Error('row '+(header+i+2)+': '+why)},c=cells(line);
  if(c.length!==h.length)fail('column count or quoting');
  if(h.includes('series')&&c[h.indexOf('series')].trim().toUpperCase()!=='EQ')continue;
  const identity=h.findIndex(n=>['symbol','schemecode'].includes(n));if(identity>=0&&c[identity]!==symbol)fail('different symbol/scheme');
  let date=c[idx.date];const m=/^(\d{1,2})[- /]([A-Za-z]{3}|\d{2})[- /](\d{4})$/.exec(date);
  if(m){const month=Number(m[2])||'jan feb mar apr may jun jul aug sep oct nov dec'.split(' ').indexOf(m[2].toLowerCase())+1;date=m[3]+'-'+String(month).padStart(2,'0')+'-'+m[1].padStart(2,'0')}
  if(!/^\d{4}-\d\d-\d\d$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)fail('invalid date');
  const r={date};
  for(const k of keys.slice(1)){const s=c[idx[k]];if(!/^(?:\d+|\d{1,3}(?:,\d{2,3})*,\d{3})(?:\.\d+)?$/.test(s))fail('invalid '+k);
   const clean=s.replaceAll(',',''),[whole,frac='']=clean.split('.');const v=k==='volume'?Number(clean):Number(whole)*100+Number((frac+'00').slice(0,2))+(Number(frac[2]||0)>=5?1:0);
   if(!Number.isSafeInteger(v)||(k==='volume'?v<0:v<=0))fail('invalid '+k);r[k]=v}
  if(symbol!=='NIFTY50'&&!fund&&(r.high<Math.max(r.open,r.close)||r.low>Math.min(r.open,r.close)))fail('OHLC bounds');out.push(r)
 }
 if(!out.length)throw Error('no observations');return merge(out)
}
export function merge(rows){
 const unique=new Map();
 for(const r of rows){if(unique.has(r.date)&&JSON.stringify(unique.get(r.date))!==JSON.stringify(r))throw Error('conflicting duplicate row dated '+r.date);unique.set(r.date,r)}
 return [...unique.values()].sort((a,b)=>a.date.localeCompare(b.date));
}
if(path.resolve(process.argv[1]||'')===fileURLToPath(import.meta.url)){
 const root=fileURLToPath(new URL('../',import.meta.url)),raw=path.join(root,'data-raw'),dist=path.join(root,'dist/data'),files=await fs.readdir(raw);
 const provenance=files.includes('_provenance.json')?JSON.parse(await fs.readFile(path.join(raw,'_provenance.json'),'utf8')):{};
 const prices={};
 for(const [symbol,[name,sector,isin]] of Object.entries(catalog)){
  const group=files.filter(f=>f.startsWith(symbol)&&f.endsWith('.csv'));if(!group.length)continue;
  try{
   let candles=[];const sources=[];
   for(const file of group){
    const meta={...provenance[symbol],...(files.includes(file+'.json')?JSON.parse(await fs.readFile(path.join(raw,file+'.json'),'utf8')):{})};
    if(!/^https:\/\//.test(meta.sourceUrl)||!/^\d{4}-\d\d-\d\d$/.test(meta.retrievalDate)||!meta.licenceNote?.trim())throw Error(file+' needs sourceUrl, retrievalDate and licenceNote');
    const host=new URL(meta.sourceUrl).hostname;if(!['nseindia.com','amfiindia.com','niftyindices.com'].some(h=>host===h||host.endsWith('.'+h)))throw Error('Expected official source URL');
    if(sector!=='Fund'&&sector!=='Index'&&files.includes('corporate-actions-2020.csv'))meta.actionReview=reviewActions(await fs.readFile(path.join(raw,'corporate-actions-2020.csv'),'utf8'),symbol);
    sources.push({...meta,file});candles=merge([...candles,...parse(await fs.readFile(path.join(raw,file),'utf8'),symbol)]);
   }
   prices[symbol]=candles;const source=sector==='Fund'?'AMFI':sector==='Index'?'NSE Indices':'NSE';
   const dest=path.join(dist,'prices',symbol+'.json');
   await fs.writeFile(dest+'.tmp',JSON.stringify({symbol,name,isin,source,sources,sourceUrl:sources[0].sourceUrl,retrievalDate:sources.map(x=>x.retrievalDate).sort().at(-1),adjusted:false,method:'As published',candles}));await fs.rename(dest+'.tmp',dest);console.log(symbol,candles.length);
  }catch(e){console.error(symbol,e.message);process.exitCode=1}
 }
 if(!process.exitCode&&Object.keys(prices).length){
  let illustrative=false;
  const lines=sampleCSV.split('\n');for(let i=1;i<lines.length;i++){
   const [id,q,c,date]=lines[i].split(',');const history=prices[id]||await fs.readFile(path.join(dist,'prices',id+'.json'),'utf8').then(JSON.parse).then(x=>x.candles).catch(()=>[]);
   const r=history.find(x=>x.date===date);if(!r)illustrative=true;lines[i]=[id,q,r?((r.close??r.nav)/100).toFixed(2):c,date].join(',');
  }
  const csv=lines.join('\n');await fs.writeFile(path.join(dist,'sample.csv'),csv+'\n');await fs.writeFile(path.join(dist,'sample-input.js'),'const SampleInput='+JSON.stringify({csv,illustrative})+";\nif(typeof module!=='undefined')module.exports=SampleInput.csv;\n");
 }
}
