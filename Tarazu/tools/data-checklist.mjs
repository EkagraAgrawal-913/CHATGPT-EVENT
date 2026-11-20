import fs from 'node:fs/promises';
import universe from '../dist/data/universe.js';
import sample from '../dist/data/sample-input.js';
const all=process.argv.includes('--all'),selected=new Set([...sample.split('\n').slice(1).map(l=>l.split(',')[0]),'NIFTY50']);
const raw=new URL('../data-raw/',import.meta.url),files=await fs.readdir(raw);
const end=new Date(),start=new Date(end);start.setUTCFullYear(end.getUTCFullYear()-1);
const iso=d=>d.toISOString().slice(0,10);
for(const [symbol,[name,sector]] of Object.entries({...universe,NIFTY50:['NIFTY 50','Index']})){
 if(!all&&!selected.has(symbol))continue;
 const source=sector==='Index'?'https://www.niftyindices.com/reports/historical-data':sector==='Fund'?'https://www.amfiindia.com/net-asset-value/nav-download':'https://www.nseindia.com/report-detail/eq_security';
 for(const [suffix,from,to] of [['2020','2020-01-13','2020-03-23'],['recent',iso(start),iso(end)]]){
  if(!all&&suffix==='recent')continue;
  const prefix=symbol+'-'+suffix,file=prefix+'.csv';console.log(files.some(f=>f.startsWith(prefix)&&f.endsWith('.csv'))?'PRESENT (verify coverage)':'MISSING',name,from,to,sector==='Fund'&&suffix==='2020'?'(one AMFI request)':'',source,'→ data-raw/'+file);
 }
}
console.log('Supply data-raw/_provenance.json keyed by symbol or a per-file <filename>.json override with sourceUrl, retrievalDate, licenceNote. Review corporate actions for the historical window. Run node tools/import-prices.mjs.');

console.log('OPTIONAL EQUITY ACTION REVIEW: data-raw/corporate-actions-2020.csv · complete NSE equity export · 2020-01-14 to 2020-03-23 · https://www.nseindia.com/companies-listing/corporate-filings-actions');
