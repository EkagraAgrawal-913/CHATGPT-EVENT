// A whole-market, unfiltered official export for the stated dates is required.
// Ordinary dividends are excluded from the price-return adjustment check.
export function reviewActions(csv,symbol){
 const lines=csv.replace(/^\uFEFF/,'').trim().split(/\r?\n/);
 const cells=s=>(s.match(/(?:"(?:[^"]|"")*"|[^,]*)(?:,|$)/g)||[]).map(v=>v.replace(/,$/,'').replace(/^"|"$/g,'').trim());
 const header=cells(lines.shift()).map(c=>c.toLowerCase().replace(/[^a-z]/g,''));
 const sym=header.indexOf('symbol'),date=header.indexOf('exdate'),purpose=header.indexOf('purpose');
 if(Math.min(sym,date,purpose)<0)throw Error('Corporate actions CSV requires SYMBOL, EX-DATE, PURPOSE');
 const events=[];for(const line of lines){const c=cells(line);if(c[sym]!==symbol)continue;const parsed=Date.parse(c[date]);if(!Number.isFinite(parsed))throw Error('Unrecognised ex-date for '+symbol);const d=new Date(parsed).toISOString().slice(0,10);if(d>='2020-01-14'&&d<='2020-03-23'&&/split|sub[ -]?division|bonus|demerger|rights|merger|amalgamation|capital reduction|reduction of (?:share )?capital/i.test(c[purpose]))events.push({date:d,purpose:c[purpose]})}
 return {from:'2020-01-14',to:'2020-03-23',status:events.length?'affected':'clear',events,sourceUrl:'https://www.nseindia.com/companies-listing/corporate-filings-actions'};
}
