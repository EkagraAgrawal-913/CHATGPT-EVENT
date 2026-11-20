```text
Tarazu • 6049cd939b0cf1ca233fdf0807f443e1fa2eb56a
Static HTML, CSS, vanilla JavaScript, Canvas and browser session storage. Node built-ins handle imports and tests.
From tandem/: python3 -m http.server 8000 --directory dist
Open http://localhost:8000
Build: node build.js
Tests: node --test tests/*.test.js tests/*.test.mjs (25 passed).
Portfolio X-ray, index look-through, stress scenarios, fund costs, tax-aware sale practice and tip checks.
Daily history CSVs are absent. The sample shows an assumed crash loss and empty historical charts.
Only the published ten largest index weights are available. Other fund exposure stays unresolved.
Includes all project files except internal Git metadata.
```

```text
tandem/
  .openai/
    hosting.json
  README.md
  build.js
  data-raw/
    nifty50-weights.csv
    nifty50-weights.csv.json
  dist/
    analysis-view.js
    app.js
    checks.js
    data/
      disclosures.js
      instrument-verification.json
      marks.js
      nifty-2020.json
      prices/
        HDFCBANK.json
        ICICIBANK.json
        INFY.json
      sample-input.js
      sample.csv
      tax-2026.js
      template.csv
      universe.js
    feeds.js
    index.html
    language.js
    model.js
    price-model.js
    price-panel.js
    return-model.js
    review.js
    studio.js
    style.css
    tax.js
    tips.js
    tools.js
  package.json
  tests/
    checks.test.js
    existing.test.js
    replay.test.js
    shell.test.js
    sip.test.js
    tax.test.js
    test-fixture-price.test.mjs
    tips.test.js
  tools/
    action-review.mjs
    data-checklist.mjs
    import-prices.mjs
    refresh-quotes.mjs
```

```text
tandem/.openai/hosting.json
```

```json
{
  "project_id": "appgprj_6b0005d4fa648191aba1c33167de8063",
  "static": {
    "directory": "dist"
  }
}
```

```text
tandem/README.md
```

````markdown
# Tarazu

**Weigh it before you invest.** Tarazu helps Indian retail investors inspect a portfolio, compare fund fees, estimate equity-sale tax and examine the wording of a tip. It provides educational calculations. Tarazu is not a SEBI-registered adviser.

## Run locally

From this directory run `python3 -m http.server 8000 --directory dist` and open http://localhost:8000. Serving over HTTP enables the bundled historical JSON. No dependencies, API keys, accounts or build installation are needed. Node 20+ can verify the static build and run offline tests:

```sh
node build.js
node --test tests/*.test.js tests/*.test.mjs
```

The existing hash router, Canvas stock charts, watchlist, paise practice ledger, order review, SIP planner, fictional move explainers and Sell/Hold replay remain available under **Practice**. Portfolio X-ray has its own imported positions. The original session data migrates into the tarazu-v1 key. V2 balances already use paise. Older rupee-based sessions convert once.

## Import and privacy

Paste CSV, use the file picker or open the sample. Download **data/template.csv** for the header. The supported universe is ten NSE large caps and four index fund plans in dist/data/universe.js. Their displayed names are accepted too. Use one row per position, whole shares for equities and up to three unit decimals for funds. Average cost is INR per unit. The optional acquired field accepts YYYY-MM-DD for a single purchase lot. Leave it blank for blended positions. Unsupported symbols, duplicates, bad numbers, unmatched quotes and invalid dates yield row-specific errors. Previous holdings survive invalid imports.

The file is read locally. No CSV, symbols selected by the user, quantities, costs, tip messages or adviser names are transmitted to providers. Price refresh uses fixed bulk-publication URLs. Public servers receive ordinary request metadata such as an IP address. Browser session storage holds parsed positions, fees, public marks, preferences and practice activity. Tip text and adviser text exist only on the current screen. **Clear my data** removes the current and legacy application keys, then opens a fresh sample practice session. No PAN, bank credentials or contact details are required.

## Market observations and calculations

| Input | Origin and handling |
|---|---|
| Equity observations | Official dated NSE EQ closing prices in dist/data/marks.js. |
| Equity refresh | Fixed-date NSE cash-market security bhavcopy, EQ series and CLOSE_PRICE. Most recent weekday after the evening cutoff. Holidays, unavailable archives or cross-origin restrictions can cause fallback. This is end-of-day data. [NSE reports](https://www.nseindia.com/all-reports) |
| Fund NAV | HDFC and UTI Nifty 50 Growth, Direct and Regular. Source and observation date are stored per mark. |
| Availability | Browser requests run in parallel with a seven-second timeout and six-hour session cache. Rows show source, observation date, delay/staleness and fallback. Data older than 48 hours is marked stale. Totals can combine different observation dates. No live intraday service is claimed. |
| Concentration | Current marked holding value divided by marked portfolio value. Effective holdings equals one divided by the sum of squared portfolio weights. Counts below 4 are labelled Concentrated, below 8 Moderate and otherwise Diversified. These are illustrative thresholds. Index funds are allocated using the published top ten weights; unresolved constituents form a single residual bucket. |
| Fee drag | Enter both TERs, a gross return and a horizon. Dated AMC TERs initialise the fee comparison; growth and horizon are assumptions. Apply gross growth, then the annual charge to the resulting balance. Each step rounds to integer paise. Difference equals direct ending balance less regular ending balance. Same starting value; no additional flows, tax or exit loads. Actual schemes accrue expenses differently. |
| Historical stress | Each covered holding applies its own historical close/NAV return to its current marked value. The benchmark uses observed NIFTY 50 closes. Stocks without an action export use a daily jump guard. Funds require manual attestation. |
| Practice | Original companies, charts, balances, orders and reaction replay remain fictional. Orders never leave the browser. |

## Tax scope

Rules checked **20 November 2026**. The estimator is scoped to tax year 1 April 2026–31 March 2027, qualifying STT-paid listed equity, a resident individual with basic exemption already absorbed and total income up to ₹50 lakh. Under sections 196 and 198 of the Income-tax Act 2025, qualifying short-term gains use 20%; long-term gains use 12.5% above the available aggregate annual ₹1.25 lakh exemption. The holding period must exceed 12 months. Four percent health and education cess applies after tax and surcharge. The default scenario assumes zero surcharge; higher-income cases can attract surcharge, capped at 15% on these gains. Consult a tax professional for personal circumstances. [Income-tax Act as amended by Finance Act 2026](https://www.incometaxindia.gov.in/documents/d/guest/income_tax_act_2025_as_amended_by_fa_act_2026-pdf) · [Finance Act 2026](https://www.incometaxindia.gov.in/documents/d/guest/finance-act-2026-pdf-1) · [Department capital gains guidance](https://www.incometaxindia.gov.in/w/capital-gain)

The remaining exemption input belongs to the whole year. The comparison holds price and available exemption constant and only computes waiting tax within the verified year. New practice purchases record dated FIFO lots; old undated holdings cannot be assigned dates retrospectively. Imported averages support tax checking only when the position represents a single lot. For pre-February 2018 purchases the grandfathered cost generally requires the higher of actual cost and the lower of 31 January 2018 FMV and sale proceeds. The prototype declines these cases, losses requiring set-off, missing dates and unsupported instruments. The estimate is incremental transaction tax, excluding transaction charges and personal adjustments.

## Landing behaviour and route map

A first visit opens Portfolio X-ray with five sample positions valued from local, dated observations. No network response is needed for the first reading. Returning sessions keep their own positions. Clear on the sample banner removes the sample; Import my CSV focuses the editor. Valid rows remain usable when other rows fail validation. An all-invalid file preserves the previous portfolio. Use Refresh prices for public updates.

| Route | Screen |
|---|---|
| Default or #dashboard | Portfolio X-ray, concentration, fee drag and local CSV import |
| #stress | 2020 peak-to-trough comparison and editable beta assumptions |
| #tip | Message flags, matched phrases and official verification links |
| #practice | Simulated dashboard and links to #markets, #watchlist, #portfolio, #replay, #report, #planner and #learn |
| #stock/KITE or #order/KITE | Simulated stock detail or practice ticket |
| #order/HDFCBANK | Tax illustration for an imported HDFCBANK holding |

## 90-second demo

| Time | Presenter action |
|---|---|
| 0–15 s | Open the sample X-ray. Read the concentration, fee difference and crash estimate. The sample cost basis is labelled illustrative wherever purchase history is missing. |
| 15–27 s | Open True exposure. Read the HDFC Bank sentence showing direct weight plus weight through both funds. The remaining undisclosed constituents stay unresolved. |
| 27–40 s | Move the fee horizon. The TER pair comes from the dated AMC disclosure; the gross return is an editable assumption. |
| 40–52 s | Follow Practise sale on HDFCBANK. The full quantity is prefilled. Estimate tax and read the waiting-date comparison for the sample lot. |
| 52–68 s | Open Stress test. Show the real daily chart if history is available; otherwise read the scenario headline, the zero observed component and the assumed component. |
| 68–78 s | Open the candle drawer from a holding or impact bar. Without an imported series, show its history-unavailable state. |
| 78–90 s | Try the example in Tip Check. Show the highlighted phrases and explain why the flag count cannot authenticate a sender. |

## Six judge questions

1. **Is this investment advice?** Tarazu shows arithmetic, assumptions, exposures and textual warning signs. It provides no trade recommendation or suitability assessment.
2. **Where does the data come from?** The X-ray uses dated NSE observations and AMFI NAVs, with bulk refresh and labelled fallback. The stress endpoints come from NSE's annual report. Practice trades use a separate fictional ledger.
3. **Is my portfolio uploaded anywhere?** Import, validation and arithmetic run in the tab. Provider requests are the same for everyone. Clear my data removes this app's saved session records.
4. **How accurate is the tax calculation?** It handles the stated tax year, FIFO, calendar boundaries, annual exemption and cess under disclosed assumptions. Missing lot history, other income, surcharge, grandfathering and losses can materially change actual liability.
5. **Why can't Tip Check confirm registration?** SEBI publishes a searchable directory. No documented official public lookup API was verified for this prototype. Name matches also cannot authenticate a sender. Compare registration number, category and contact details in the official directory. [SEBI directory](https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognised=yes)
6. **How is this different from Groww or Zerodha?** Tarazu's workflow ends with a calculation or a question to investigate. A user can examine concentration, fee differences, tax timing and suspicious language before using any execution platform.

For a grievance involving a regulated intermediary, first contact the entity and then use [SEBI SCORES](https://scores.sebi.gov.in/). For financial cyber fraud, report through the [National Cyber Crime Reporting Portal](https://cybercrime.gov.in/) or 1930.

## Language and format inventory

| Language or format | Where used | Why |
|---|---|---|
| HTML | dist/index.html and JS view templates | Semantic forms, navigation and report sections |
| CSS | dist/style.css and computed styles | Shared responsive layout, typography and visual tokens |
| JavaScript | dist/*.js, dist/data/tax-2026.js, build.js, tests/ | Browser models, data adapters, UI, offline build and tests |
| JSON | package.json, .openai/hosting.json, historical dataset, session storage | Portable metadata, provenance and state |
| CSV | dist/data/sample.csv and template.csv, local imports and NSE data | Spreadsheet-compatible holdings and market files |
| Semicolon-delimited text | AMFI public NAV response | Official bulk NAV exchange format |
| Markdown | README.md | Setup, provenance and demo notes |
| Shell | README commands and package scripts | Start static server and run checks |
| Python (optional runtime) | README's local HTTP server command | Serve files using the standard library; no Python application code |
| English and Roman-script Hinglish | Navigation, forms, calculations and guidance | Present checks in familiar language |

## Known limits and next steps

- Actual live refresh depends on provider availability, browser CORS and publication calendars. Stale marks are usable for a dated illustration, not an executable price.
- Rules flag wording and can miss paraphrases, irony or multilingual scams. Absence of a flag does not establish safety.
- A blended holding CSV cannot recover purchase lots. Next candidates are offline CAS and contract-note import before considering consent-based Account Aggregator or broker integrations.

## Holding detail and real daily history

Activate an X-ray holding row or its stress impact button. The native modal drawer supports Escape, keyboard focus containment, arrow-key observation selection and a table alternative. Mutual funds show NAV only. The drawer also links back to the equity sale check. Real intraday prices require a licensed feed. The original fictional practice charts remain separate.

**Dataset status:** Historical files are absent until imported. Current marks are independently sourced; an index endpoint comparison does not establish a daily path.

**Sources and rights:** NSE historical data display and redistribution depend on the subscriber agreement. Use a legitimately obtained equity export whose licence covers the intended deployment. AMFI offers historical NAV downloads of up to 90 days per request. Public download access alone does not establish republication rights. Confirm permission before deploying populated files. [NSE data usage policy](https://nsearchives.nseindia.com/s3fs-public/inline-files/NSE_Data_Sharing_and_Usage_Policy_0.pdf) · [NSE historical data](https://www.nseindia.com/market-data/eod-historical-data-subscription) · [AMFI NAV history](https://www.amfiindia.com/net-asset-value/nav-download)


## Verified universe and data workflow

NSE's constituent export supplies the company names, tickers, ISINs and official industry classifications in data/instrument-verification.json. The X-ray groups the two banks together. The fund universe comprises HDFC 119063/101525 and UTI 120716/100822 (Direct/Regular Growth respectively). AMFI's HDFC scheme summary, pre-2020 HDFC prospectus and 2015 NAV report support plan identity and existence. [NSE constituents](https://nsearchives.nseindia.com/content/indices/ind_nifty50list.csv) · [AMFI current report](https://portal.amfiindia.com/spages/NAVAll.txt) · [HDFC identifiers](https://portal.amfiindia.com/spages/SSD_664.pdf) · [2015 NAV archive](https://portal.amfiindia.com/NavHistoryReport_Rpt_Po.aspx?frmdate=01-Apr-2015&rpt=0)

From the project root:

```sh
node tools/data-checklist.mjs
node tools/import-prices.mjs
node tools/refresh-quotes.mjs 2026-11-19
node build.js
node --test tests/*.test.js tests/*.test.mjs
```

Save multiple CSV exports as SYMBOL-2020-part1.csv, SYMBOL-recent-part1.csv, etc. For the index use NIFTY50 as the symbol and Date,Close columns. For equities use Date,Open,High,Low,Close,Volume; for funds use Date,NAV. Use official raw, unadjusted data. Use data-raw/_provenance.json mapping each symbol to sourceUrl, retrievalDate (YYYY-MM-DD) and licenceNote. Per-file .csv.json properties override the symbol defaults. Import preserves per-file provenance. Identical dated observations merge; conflicting values reject the instrument. No file modification timestamp stands in for the source retrieval date.

The checklist defaults to the five sample positions plus NIFTY50 for 13 Jan–23 Mar 2020. Use --all for every instrument and the recent window. One AMFI date-range request fits the 2020 window. The importer accepts preambles, blank lines, EQ-series selection, Indian/Western thousands grouping and ISO or day-first numeric/named-month dates.

The NSE corporate-actions-2020.csv export is optional. Splits, subdivisions, bonuses, demergers, rights, mergers/amalgamations and capital reductions exclude the holding. Cash dividends do not: this is price return and excludes dividends. Any adjacent observed closes more than 35% apart in the window trigger suspected adjustment. Without the export this guard cannot identify smaller distorting actions. For funds, attach an actionReview object with from, to, status and official sourceUrl in provenance or a sidecar. Covered fund rows identify this as manually attested.

The October 30, 2026 Nifty 50 factsheet publishes its ten largest constituents. The CSV and attribution in data-raw/ capture those dated weights. True exposure assumes the funds mirror the index; it does not estimate the other 40 weights. The effective holdings count is a lower bound with unresolved holdings grouped. The same mapping feeds Test a trade. [Index factsheet](https://www.niftyindices.com/Factsheet/ind_nifty50.pdf)

Published annual TER defaults use HDFC Fund Facts (September 2026, regular 0.41%, direct 0.26%) and UTI Fund Facts (31 July 2026, regular 0.37%, direct 0.25%). The UI links each disclosure and allows overrides. These are dated inputs, not current-rate guarantees.

The sample has five illustrative purchases dated 15 January 2026. Import substitutes each exact day's close/NAV in integer paise when available and labels the sample illustrative until all five costs are observed. Scenario trade amounts represent external additions or withdrawals, without changing the portfolio. Stress estimates combine known drawdowns and disclosed assumed betas for uncovered holdings. Fee comparisons use the displayed TERs and editable growth and horizon assumptions. Offline tests include coverage, return weighting and trade arithmetic.
````

```text
tandem/build.js
```

```javascript
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function check(dir){for(const name of fs.readdirSync(dir)){const file=path.join(dir,name);if(fs.statSync(file).isDirectory())check(file);else if(name.endsWith('.js'))new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});else if(name.endsWith('.json'))JSON.parse(fs.readFileSync(file,'utf8'))}}
check('dist');
console.log('Static distribution verified.');
```

```text
tandem/data-raw/nifty50-weights.csv
```

```csv
symbol,weight %
HDFCBANK,9.95
ICICIBANK,9.39
RELIANCE,7.30
BHARTIARTL,5.63
LT,4.25
INFY,3.92
SBIN,3.73
AXISBANK,3.28
KOTAKBANK,3.19
BAJFINANCE,2.40
```

```text
tandem/data-raw/nifty50-weights.csv.json
```

```json
{
  "sourceUrl": "https://www.niftyindices.com/Factsheet/ind_nifty50.pdf",
  "asOf": "2026-10-30",
  "licenceNote": "Selected factual top-ten weights attributed to NSE Indices Limited. No licence to redistribute the full factsheet is asserted."
}
```

```text
tandem/dist/analysis-view.js
```

```javascript
(()=>{
 const models={},all=()=>snapshot().rows,baseFall=()=>historical?(historical.peak.hundredths-historical.trough.hundredths)/historical.peak.hundredths:null;
 const analysis=()=>Returns.history(all(),models);
 function factors(h){const f={};for(const k of Object.keys(W.catalog))f[k]=h.included.find(r=>r.id===k)?.fall??((state.betas?.[k]??1)*baseFall());return f}
 function scenario(h){
  const {observed,assumed,total,uncovered}=Returns.scenarioLoss(all(),h.included,state.betas||{},baseFall());
  const sign=total>0?'−':total<0?'+':'';
  const figure=total===null?(all().length?'Benchmark unavailable':'No marked holdings'):sign+rupees(Math.abs(total))+' · '+percent(Math.abs(total),snapshot().total);
  const label=!uncovered.length?'Observed price return':uncovered.some(r=>(state.betas?.[r.id]??1)!==1)?'Scenario estimate with edited beta assumptions':'Scenario estimate if every uncovered holding fell like NIFTY (beta 1.0, assumption)';
  return {figure,label,observed,assumed,uncovered};
 }
 function fees(){return Object.fromEntries(Object.entries(state.fees||{}).map(([id,f])=>[id,W.fee(100000000,Math.round(f.reg*100),Math.round(f.dir*100),Math.round(f.growth*100),f.years).difference/100000000]))}
 function plot(h){
  const bn=new Map(PriceSeries.slice(models.NIFTY50?.candles||[],'Covid crash 2020').map(d=>[d.date,d.close]));
  if(!h.path.length)return '<p class="insight">Price history not loaded yet or action review incomplete. No observed portfolio path is available.</p>';
  const start=bn.get('2020-01-14'),pts=h.path.map(d=>({date:d.date,v:d.value/h.capital*100,b:bn.has(d.date)?bn.get(d.date)/start*100:null}));
  const vals=pts.flatMap(d=>[d.v,...(d.b===null?[]:[d.b])]),lo=Math.min(...vals),hi=Math.max(...vals),x=i=>10+i*580/(pts.length-1),y=n=>12+140*(hi-n)/(hi-lo||1);
  const path=k=>pts.map((d,i)=>d[k]===null?'':((i===0||pts[i-1][k]===null)?'M':'L')+x(i)+' '+y(d[k])).join(' ');
  window.tarazuReadout=i=>{const d=pts[Math.max(0,Math.min(pts.length-1,i))];document.querySelector('#return-readout').textContent=d.date+' · Portfolio '+d.v.toFixed(2)+' · NIFTY '+(d.b?.toFixed(2)??'unavailable')};
  return '<svg id="retplot" tabindex="0" role="img" aria-label="Portfolio dashed; NIFTY 50 solid. Arrow keys inspect observations." data-count="'+pts.length+'" viewBox="0 0 600 180"><path d="'+path('b')+'" stroke="#8e663c" fill="none" stroke-width="3"/><path d="'+path('v')+'" stroke="#17685f" fill="none" stroke-dasharray="6 3" stroke-width="3"/><text x="5" y="177">14 Jan · peak</text><text x="595" y="177" text-anchor="end">23 Mar · trough</text></svg><p id="return-readout">Portfolio starts at 100 · '+(bn.size?'NIFTY starts at 100':'Benchmark daily history unavailable')+'</p>';
 }
 views.stress=()=>{
  const h=analysis(),summary=scenario(h),total=snapshot().total,fall=baseFall(),unpriced=rows().filter(r=>!Feeds.quotes[r.id]?.ticks);
  return moduleTitle('NIFTY 50 · 14 JAN – 23 MAR 2020','Portfolio stress test','Each observed return is applied to the holding’s current marked value.')+box(summary.label, '<strong id="scenario-figure">'+summary.figure+'</strong><p>Observed loss '+rupees(summary.observed)+' · Assumed loss '+(summary.assumed===null?'unavailable':rupees(summary.assumed))+' · price return; excludes dividends.</p>'+'<p>Covers '+percent(h.capital,total)+' of marked value. Excluded: '+[...h.excluded.map(x=>x.id+' ('+x.why+')'),...unpriced.map(r=>r.id+' (no mark)')].join(', ')+'</p>'+plot(h)+h.included.sort((a,b)=>b.fall-a.fall).map(r=>'<button class="impact" data-price="'+r.id+'">'+r.id+' · '+r.review+' · '+percent(r.fall,1)+' fall · '+rupees(Math.round(r.value*r.fall))+bar(Math.abs(r.fall)*100)+'</button>').join(''))+
  box('Uncovered exposure · assumed',all().filter(r=>!h.included.some(v=>v.id===r.id)).map(r=>'<label class="beta">'+r.id+' · assumed beta <input type="number" data-assumption="'+r.id+'" min="0" max="2" step=".1" value="'+(state.betas?.[r.id]??1)+'"> <output>'+ (fall===null?'—':rupees(Math.round(r.value*fall*(state.betas?.[r.id]??1))))+'</output></label>').join('')+summary.uncovered.map(r=>'<button class="impact" data-price="'+r.id+'">'+r.id+' · assumed · '+(fall===null?'Benchmark unavailable':rupees(Math.round(r.value*(state.betas?.[r.id]??1)*fall))+bar(100*(state.betas?.[r.id]??1)*fall))+'</button>').join('')+'<p>Scenario amounts are excluded from the observed path.</p><a href="#replay">Practise your reaction</a>');
 };
 const previous=views.dashboard;
 views.dashboard=()=>{
  const h=analysis(),x=snapshot(),e=Returns.exposure(x.rows,Object.fromEntries(Object.entries(W.catalog).map(([k,v])=>[k,v[1]])),IndexWeights),top=Math.max(0,...Object.entries(e.bySector).filter(([k])=>k!=='Unresolved').map(([,v])=>v)),rates=fees(),fs=x.rows.reduce((s,r)=>s+Math.round(r.value*(rates[r.id]||0)),0);
  const priceDates=[...new Set(x.rows.map(r=>{const q=Feeds.quotes[r.id];return 'Prices as of '+q.date+' · '+q.source}))].join(' / ');
  const missing=rows().filter(r=>!Feeds.quotes[r.id]?.ticks).map(r=>r.id);
  let content=previous().replace('<section class="card summary">','<section id="concentration" class="card summary">').replace('<h2>Fund fee drag','<h2 id="fund-fees">Fund fee drag');
  const cards=[['Concentration',x.total&&top/x.total>.4?'Above 40%':'Marked sector',percent(top,x.total),'concentration'],['Costs',Object.keys(rates).length?'Scenario difference':'Inputs needed',Object.keys(rates).length?rupees(fs):'—','fund-fees'],['Crash exposure',scenario(h).uncovered.length?'Scenario estimate':'Observed',scenario(h).figure,'crash-check']];
  const strip='<div class="indices learning">'+cards.map(([label,status,v,id])=>'<button data-scroll="'+id+'" class="card">'+label+'<strong class="big">'+v+'</strong>'+status+'</button>').join('')+'</div><p>'+priceDates+(missing.length?' · Missing marks (excluded): '+missing.join(', '):'')+'</p>';
  content=content.replace('<div class="xgrid">',strip+'<div class="xgrid">');
  return content+box('True exposure',Object.keys(IndexWeights).length?'<p>Assumes each index fund mirrors NIFTY 50. Published top ten only · <a href="'+WeightSource.sourceUrl+'">'+WeightSource.asOf+'</a>.</p>'+Object.keys(IndexWeights).map(id=>'<p>'+(W.catalog[id]?.[0]||id)+' is '+percent(e.direct[id]||0,x.total)+' direct and '+percent(e.via[id]||0,x.total)+' via your index funds = <strong>'+percent(e.combined[id]||0,x.total)+'</strong>.</p>').join('')+'<p>Unresolved fund exposure: '+rupees(e.residual)+'</p>':'Look-through unavailable')+box('Crash exposure','<div id="crash-check">Observed coverage '+percent(h.capital,x.total)+' · <a href="#stress">Open stress test</a></div>')+box('Test a trade','<form id="trade-test"><label>Instrument <select name="id">'+Object.entries(W.catalog).map(([k,[n]])=>'<option value="'+k+'">'+esc(n)+'</option>').join('')+'</select></label><label>Scenario <select name="side"><option>Buy</option><option>Sell</option></select></label><label>Amount (₹) <input type="number" required min=".01" step=".01" name="amount"></label><button>Compare</button><p role="status" id="trade-out"></p></form>');
 };
 document.addEventListener('click',e=>{if(e.target.closest('[data-scroll]')){const id=e.target.closest('[data-scroll]').dataset.scroll;(document.getElementById(id)||document.querySelector('[data-fee]')||document.querySelector('#trade-test')).scrollIntoView()}});
 document.addEventListener('submit',e=>{if(e.target.id!=='trade-test')return;e.preventDefault();const f=new FormData(e.target),id=f.get('id'),side=f.get('side'),out=document.querySelector('#trade-out');
 try{if(rows().some(r=>!Feeds.quotes[r.id]?.ticks))throw Error('A holding has no current mark; full portfolio comparison unavailable.');if(!Feeds.quotes[id]?.ticks||baseFall()===null)throw Error('Market inputs unavailable for this comparison.');
 const {before:b,after:a}=Returns.trade(all(),id,side,Math.round(Number(f.get('amount'))*100),Object.fromEntries(Object.entries(W.catalog).map(([k,v])=>[k,v[1]])),factors(analysis()),fees(),IndexWeights);
 out.textContent='Effective holdings '+b.effective.toFixed(2)+' → '+a.effective.toFixed(2)+' · Top sector '+b.top+' '+percent(b.weight,1)+' → '+a.top+' '+percent(a.weight,1)+' · Estimated crash loss (beta for uncovered) '+rupees(b.loss)+' → '+rupees(a.loss)+(W.catalog[id][1]==='Fund'?(state.fees?.[id]?' · Modelled fee difference '+rupees(b.fee)+' → '+rupees(a.fee):' · Fee assumptions required'):'');
 if(side==='Sell'&&W.catalog[id][1]!=='Fund')out.insertAdjacentHTML('beforeend',' · <a href="#order/'+id+'">Tax-aware sell check</a>');
 }catch(err){out.textContent=err.message}});
 document.addEventListener('input',e=>{if(e.target.dataset.assumption&&e.target.value!==''&&e.target.validity.valid){const id=e.target.dataset.assumption,b=Number(e.target.value);state.betas||={};state.betas[id]=b;save();render();document.querySelector('[data-assumption="'+id+'"]')?.focus()}});
 let at=0;document.addEventListener('pointermove',e=>{const s=e.target.closest('#retplot');if(s){const r=s.getBoundingClientRect();at=Math.round((e.clientX-r.left)/r.width*(Number(s.dataset.count)-1));window.tarazuReadout(at)}});
 document.addEventListener('keydown',e=>{if(e.target.id==='retplot'&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();at=Math.max(0,Math.min(Number(e.target.dataset.count)-1,at+(e.key==='ArrowRight'?1:-1)));window.tarazuReadout(at)}});
 render();Promise.all([...Object.keys(W.catalog),'NIFTY50'].map(async k=>{try{const res=await fetch('data/prices/'+k+'.json');if(res.ok)models[k]=await res.json()}catch{}})).then(()=>{if(!document.activeElement?.closest('form,textarea,input,dialog')&&['','#dashboard','#stress'].includes(location.hash))render()});
})();
```

```text
tandem/dist/app.js
```

```javascript
const app=document.querySelector('#app'), pages=['Dashboard','Markets','Watchlist','Portfolio','Replay','Report','Planner','Learn'];
const stocks=[
 ['KITE','Kite Mobility','Auto',825,3.84,'#deecd4'],['VAYA','Vaya Systems','Technology',1640,2.76,'#dedbf2'],['MINT','Mintleaf Bank','Banking',712,1.95,'#d1eae0'],['ORBI','Orbit Power','Energy',354,-5.72,'#fae0c3'],['NIVA','Niva Foods','Consumer',482,-0.94,'#f2d9df'],['LOOM','Loom Digital','Technology',1240,1.32,'#cfe4f0']
].map(([id,name,sector,price,change,color])=>({id,name,sector,price,change,color}));
const seed={cash:65000,hold:{KITE:[40,760],VAYA:[30,1490],MINT:[60,680]},watch:['KITE','VAYA','ORBI'],orders:[]};
let state=structuredClone(seed),notice='';
try{state=JSON.parse(sessionStorage.getItem('tarazu-v1') || sessionStorage.getItem('dhairya-v2') || sessionStorage.getItem('tandem-v1'))||state}catch{notice='Session storage is unavailable. Your practice starts fresh.'}
// Convert the legacy rupee cash and per-share averages once.
if(state.version!==2){
 state.cash=Math.round(state.cash*100);
 for(const holding of Object.values(state.hold))holding[1]=Math.round(holding[0]*holding[1]*100);
 state.version=2;
}
function save(){try{sessionStorage.setItem('tarazu-v1',JSON.stringify(state))}catch{notice='Changes are available until you reload.'}}
const money=n=>'₹'+n.toLocaleString('en-IN',{maximumFractionDigits:2}), stock=id=>stocks.find(s=>s.id===id),pct=n=>(n>=0?'+':'')+n.toFixed(2)+'%',tone=n=>n>=0?'up':'down';
function render(){const [page='dashboard',id]=location.hash.slice(1).split('/');document.querySelector('nav').innerHTML=pages.map(p=>'<a class="'+(p.toLowerCase()===(page||"dashboard")?'active':'')+'" href="#'+p.toLowerCase()+'">'+navLabel(p)+'</a>').join('');app.innerHTML=(views[page||'dashboard']||(()=>'<h1>Page unavailable</h1><a href="#dashboard">Return to dashboard</a>'))(id);if(notice){let n=document.createElement('p');n.textContent=notice;app.prepend(n)}if(page==="markets")document.querySelector("#search").value=query;drawAll();syncLanguage()}
const views={};window.addEventListener('hashchange',()=>{render();scrollTo(0,0)});
let period='1M',mover='Gainers';
const periods=['1D','1W','1M','6M','1Y'];
function total(){return Object.entries(state.hold).reduce((a,[id,[q,c]])=>({value:a.value+q*stock(id).price,cost:a.cost+c/100}),{value:0,cost:0})}
function row(s,action=''){return '<div class="stock"><span class="mark" style="--t:'+s.color+'">'+s.id.slice(0,2)+'</span><a href="#stock/'+s.id+'"><strong>'+s.name+'</strong><small>'+s.id+' · '+s.sector+'</small></a><div class="right"><strong>'+money(s.price)+'</strong><small class="'+tone(s.change)+'">'+pct(s.change)+'</small></div>'+action+'</div>'}
function graph(seed,end,start,hero=false){return '<canvas role="img" aria-label="Fictional trend from '+money(start)+' to '+money(end)+'" data-seed="'+seed+'" data-end="'+end+'" data-start="'+start+'" data-hero="'+hero+'"></canvas>'}
function drawAll(){document.querySelectorAll('canvas').forEach(c=>{const w=c.clientWidth,h=c.clientHeight,d=devicePixelRatio||1;c.width=w*d;c.height=h*d;const x=c.getContext('2d');x.scale(d,d);let {seed,end,start,hero}=c.dataset;let r=Number(seed)+47;const vals=Array.from({length:100},(_,i)=>{r=(r*16807)%2147483647;let t=i/99;return +start+(end-start)*(t+Math.sin(t*Math.PI)*(0.18*Math.sin(t*19)+0.14*Math.sin(t*41)+0.18*r/2147483647))});let lo=Math.min(...vals),hi=Math.max(...vals);const points=vals.map((v,i)=>[w*i/99,h-6-(h-14)*(v-lo)/(hi-lo||1)]);const color=hero==='true'?'#d5f78a':+end>=+start?'#258058':'#ae5062';if(h>60){x.strokeStyle=hero==='true'?'#396054':'#e2e8df';for(let i=1;i<5;i++){x.beginPath();x.moveTo(0,h*i/5);x.lineTo(w,h*i/5);x.stroke()}}x.beginPath();points.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.strokeStyle=color;x.lineWidth=2.4;x.stroke();x.lineTo(w,h);x.lineTo(0,h);x.closePath();const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,color+'45');g.addColorStop(1,color+'00');x.fillStyle=g;x.fill()})}
window.addEventListener('resize',drawAll);
function tabs(items,selected,key){return '<div class="tabs">'+items.map(i=>'<button aria-pressed="'+(selected===i)+'" class="'+(selected===i?'active':'')+'" data-'+key+'="'+i+'">'+i+'</button>').join('')+'</div>'}
function history(end,id=1,hero=false,dailyChange=null){let i=periods.indexOf(period),start=Math.round(end*(1-[.008,.024,.052,.11,.18][i]));if(i===0&&dailyChange!==null)start=Math.round(end/(1+dailyChange/100)*100)/100;return graph(37*i+id,end,start,hero)+'<div class="legend"><span>'+money(start)+' · period start</span><span>'+money(end)+' · latest</span></div>'}
function portfolioHero(){let {value,cost}=total();return '<section class="card hero"><div class="head"><span class="eyebrow">PORTFOLIO VALUE</span><a href="#portfolio">View portfolio</a></div><b class="big">'+money(value)+'</b><p><strong class="'+tone(value-cost)+'">'+money(value-cost)+'</strong> since purchase</p><div class="head"><small>Sample performance</small>'+tabs(periods,period,'period')+'</div>'+history(value,3,true)+'</section>'}
function movers(){let gain=mover==='Gainers';return '<section class="card"><div class="head"><h2>Market movers</h2></div>'+tabs(['Gainers','Losers'],mover,'mover')+stocks.filter(s=>gain?s.change>0:s.change<0).sort((a,b)=>gain?b.change-a.change:a.change-b.change).slice(0,3).map(s=>row(s)).join('')+'<a class="button" href="#markets">Explore markets</a></section>'}
function marketOverview(){return '<div class="head"><div><h2>Market snapshot</h2></div><small>Sample close · 20 Nov 2026</small></div><div class="indices">'+[['NIFTY 50',24862.2,.68],['SENSEX',81642.4,.54],['BANK NIFTY',52814.75,-.32]].map(([name,n,v],i)=>'<section class="card index"><span class="eyebrow">'+name+'</span><br><strong>'+n.toLocaleString('en-IN')+'</strong><br><small class="'+tone(v)+'">'+pct(v)+' today</small>'+graph(i+2,n,n/(1+v/100))+'</section>').join('')+'</div><div class="grid">'+portfolioHero()+movers()+'</div><section class="card"><div class="head"><h2>Your watchlist</h2><a href="#watchlist">Manage watchlist</a></div>'+state.watch.slice(0,3).map(id=>row(stock(id))).join('')+(state.watch.length?'':'Save a stock from Markets to follow it here.')+'</section>';}
views.dashboard=()=>homeIntro()+marketOverview();
document.addEventListener('click',e=>{const d=e.target.dataset;if(d.period){period=d.period;render()}if(d.mover){mover=d.mover;render()}});
let query='',sector='All sectors',direction='All stocks';
function matches(){return stocks.filter(s=>(s.name+' '+s.id).toLowerCase().includes(query.toLowerCase().trim())&&(sector==='All sectors'||s.sector===sector)&&(direction==='All stocks'||(direction==='Gainers'?s.change>0:s.change<0)))}
function watchButton(s){return '<button data-watch="'+s.id+'" aria-label="'+(state.watch.includes(s.id)?'Remove ':'Save ')+s.name+'" aria-pressed="'+state.watch.includes(s.id)+'">'+(state.watch.includes(s.id)?'Saved':'Save')+'</button>'}
function results(){let list=matches();return list.length?list.map(s=>row(s,watchButton(s))+explain(s)).join(''):'<div class="empty"><h3>No matching stocks</h3><p>Try another name or widen your filters.</p><button data-clear="1">Clear filters</button></div>'}
views.markets=()=>'<span class="eyebrow">MARKETS</span><h1>Explore stocks</h1><p class="lead">Find a company to follow in the sample market.</p><section class="card"><div class="controls"><input id="search" aria-label="Search stocks" placeholder="Search name or symbol"><select aria-label="Sector" id="sector">'+['All sectors',...new Set(stocks.map(s=>s.sector))].map(s=>'<option value="'+s+'" '+(s===sector?'selected':'')+'>'+s+'</option>').join('')+'</select>'+tabs(['All stocks','Gainers','Losers'],direction,'direction')+'</div><div id="results">'+results()+'</div></section>';
document.addEventListener('input',e=>{if(e.target.id==='search'){query=e.target.value;document.querySelector('#results').innerHTML=results()}});
document.addEventListener('change',e=>{if(e.target.id==='sector'){sector=e.target.value;render()}});
document.addEventListener('click',e=>{if(e.target.dataset.direction){direction=e.target.dataset.direction;render()}if(e.target.dataset.clear){query='';sector='All sectors';direction='All stocks';render()}});
const descriptions=['Designs compact electric vehicles for urban commuters.','Builds business software for retailers and manufacturers.','Offers savings accounts and loans to households and small businesses.','Develops solar projects and distributes electricity.','Produces packaged staples for neighbourhood grocery stores.','Builds digital tools for small online businesses.'];
const unavailable=()=>'<h1>Stock unavailable</h1><a href="#markets">Browse sample stocks</a>';
views.stock=id=>{const s=stock(id);if(!s)return unavailable();let i=stocks.indexOf(s);return '<a href="#markets">‹ Markets</a><div class="head"><div><span class="eyebrow">'+s.id+' · '+s.sector+'</span><h1>'+s.name+'</h1></div>'+watchButton(s)+'</div><div class="grid"><section class="card"><div class="head"><div><strong class="big">'+money(s.price)+'</strong> <span class="'+tone(s.change)+'">'+pct(s.change)+' today</span></div>'+tabs(periods,period,'period')+'</div>'+history(s.price,i+1,false,s.change)+'</section><section class="card"><h2>Company snapshot</h2><p>'+descriptions[i]+'</p><details><summary>Market cap · ₹'+(18500+i*4310).toLocaleString('en-IN')+' crore</summary>The sample value of all shares in the company combined.</details><details><summary>P/E · '+(18+i*2)+'×</summary>Price-to-earnings compares one share’s price with annual earnings per share.</details><a class="button primary" href="#order/'+id+'">Practice an order</a></section></div>'+explain(s)};
function toggleWatch(id){if(!stock(id))return;state.watch=state.watch.includes(id)?state.watch.filter(v=>v!==id):[...state.watch,id];save()}
views.watchlist=()=>'<span class="eyebrow">SAVED STOCKS</span><h1>Your watchlist</h1><p class="lead">Follow price changes for companies you want to revisit.</p><section class="card"><div class="head"><h2>'+state.watch.length+' saved</h2><a class="button" href="#markets">Find stocks</a></div>'+(state.watch.length?state.watch.map(id=>row(stock(id),watchButton(stock(id)))).join(''):'<div class="empty"><h2>Start with one company</h2><p>Open Markets and choose Save next to a stock you recognise.</p></div>')+'</section>';
document.addEventListener('click',e=>{if(e.target.dataset.watch){toggleWatch(e.target.dataset.watch);render()}});
views.portfolio=()=>{let {value,cost}=total(),sum=0;const parts=Object.entries(state.hold).map(([id,[q,c]])=>({s:stock(id),q,c,share:100*q*stock(id).price/value}));let stops=parts.map(({s,share})=>{let from=sum;sum+=share;return s.color+' '+from+'% '+sum+'%'});return '<span class="eyebrow">PRACTICE ACCOUNT</span><h1>Practice Portfolio</h1><div class="stats"><div><small>Available cash</small><strong>'+money(state.cash/100)+'</strong></div><div><small>Holdings cost</small><strong>'+money(cost)+'</strong></div></div><div class="grid">'+portfolioHero()+'<section class="card"><h2>Allocation</h2><p>Share of your holdings by value</p><div class="stats"><div class="donut" style="background:'+(parts.length?'conic-gradient('+stops.join(',')+')':'#eee')+'"></div><div>'+parts.map(({s,share})=>'<div>'+s.id+' · '+share.toFixed(1)+'%</div>').join('')+'</div></div></section></div><section class="card"><h2>Holdings</h2><details><summary>What is P&amp;L?</summary>Profit and loss is the difference between the current value of your shares and what you paid for them.</details>'+parts.map(({s,q,c})=>'<div class="stock"><span class="mark" style="--t:'+s.color+'">'+s.id.slice(0,2)+'</span><a href="#stock/'+s.id+'"><strong>'+s.name+'</strong><small>'+q+' shares · average '+money(c/q/100)+'</small></a><div class="right"><strong>'+money(q*s.price)+'</strong><small class="'+tone(q*s.price*100-c)+'">P&amp;L '+money((q*s.price*100-c)/100)+'</small></div></div>').join('')+(parts.length?'':'Your first practice purchase will appear here.')+'</section>'};
let side='Buy',pending=null;
function invalid(id,qty,side){if(!Number.isSafeInteger(qty)||qty<1)return 'Enter a positive whole number of shares.';if(side==='Buy'&&qty*stock(id).price*100>state.cash)return 'Insufficient practice cash. Reduce your quantity.';if(side==='Sell'&&qty>(state.hold[id]?.[0]||0))return 'You can only sell shares you hold.';return ''}
function fill(id,q,side,reason){
 const error=invalid(id,q,side);if(error)return error;
 const price=stock(id).price,amount=q*price*100,[held,cost]=state.hold[id]||[0,0];
 const buy=side==='Buy',next=held+(buy?q:-q);
 state.lots||={};const lots=state.lots[id]||(state.lots[id]=held?[{q:held,date:null,price:null}]:[]);
 if(buy)lots.push({q,date:new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'}),price:price*100});
 else {let left=q;while(left&&lots.length){const n=Math.min(left,lots[0].q);lots[0].q-=n;left-=n;if(!lots[0].q)lots.shift()}}
 state.cash+=buy?-amount:amount;
 if(next)state.hold[id]=[next,buy?cost+amount:cost-Number((BigInt(cost)*BigInt(q)+BigInt(Math.floor(held/2)))/BigInt(held))];
 else delete state.hold[id];
 state.orders.push({id,q,side,price,reason});save();return '';
}
views.order=id=>{pending=null;let s=stock(id);if(!s)return unavailable();return '<a href="#stock/'+id+'">‹ '+s.name+'</a><h1>Practice order</h1><p class="lead">Try a simulated trade using your practice balance.</p><section class="card ticket"><div class="head"><h2>'+s.name+'</h2><strong>'+money(s.price)+' / share</strong></div>'+tabs(['Buy','Sell'],side,'side')+'<div class="stats"><div><small>Available cash</small><strong>'+money(state.cash/100)+'</strong></div><div><small>Shares held</small><strong>'+(state.hold[id]?.[0]||0)+'</strong></div></div><form id="ticket" novalidate><label>Quantity <input name="qty" type="number" min="1" step="1" value="1" required></label><p id="error" role="alert" class="error"></p><button class="primary">Review order</button></form></section>'};
document.addEventListener('submit',e=>{if(e.target.id!=='ticket')return;e.preventDefault();let id=location.hash.split('/')[1],q=Number(e.target.elements.qty.value),error=invalid(id,q,side);document.querySelector('#error').textContent=error;if(error)return;pending={id,q,side};e.target.outerHTML='<section id="review"><h3>Review simulated '+side.toLowerCase()+'</h3><p>'+q+' shares of '+id+' × '+money(stock(id).price)+' = <strong>'+money(q*stock(id).price)+'</strong></p><fieldset><legend>Pause and think</legend><label>What prompted this decision? <select id="reason"><option value="">Choose a reason</option><option value="plan">Following my plan</option><option value="move">Reacting to a price move</option><option value="try">Testing the simulator</option></select></label></fieldset><div class="controls"><button data-edit="1">Edit order</button><button class="primary" data-confirm="1" disabled>Confirm simulated '+side.toLowerCase()+'</button></div></section>';document.querySelector('#reason').focus()});
document.addEventListener('click',e=>{let d=e.target.dataset;if(d.side){side=d.side;render()}if(d.edit)render();if(d.confirm&&pending){let {id,q,side}=pending;pending=null;let error=fill(id,q,side,document.querySelector('#reason').value);document.querySelector('#review').innerHTML=error||'<h3>Practice order complete</h3><p>'+(side==='Buy'?'Bought ':'Sold ')+q+' shares of '+id+'. Available cash is '+money(state.cash/100)+'.</p><a class="button primary" href="#portfolio">See portfolio</a>'}});
```

```text
tandem/dist/checks.js
```

```javascript
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
```

```text
tandem/dist/data/disclosures.js
```

```javascript
const IndexWeights={"HDFCBANK": 9.95, "ICICIBANK": 9.39, "RELIANCE": 7.3, "BHARTIARTL": 5.63, "LT": 4.25, "INFY": 3.92, "SBIN": 3.73, "AXISBANK": 3.28, "KOTAKBANK": 3.19, "BAJFINANCE": 2.4};
const WeightSource={"sourceUrl": "https://www.niftyindices.com/Factsheet/ind_nifty50.pdf", "asOf": "2026-10-30", "licenceNote": "Selected factual top-ten weights attributed to NSE Indices Limited. No licence to redistribute the full factsheet is asserted."};
const hdfcTER={reg:.41,dir:.26,date:'September 2026',url:'https://files.hdfcfund.com/s3fs-public/Others/2026-10/Fund%20Facts%20-%20HDFC%20NIFTY%2050%20Index%20Fund_Oct%2026.pdf'};
const utiTER={reg:.37,dir:.25,date:'31 July 2026',url:'https://www.utimf.com/static/digitalfactsheet/august2026/Index-fund/UTI-NIFTY-50-INDEX-FUND.html'};
const PublishedTER={101525:hdfcTER,119063:hdfcTER,100822:utiTER,120716:utiTER};
function feeDefaults(lots){return Object.fromEntries(lots.filter(r=>PublishedTER[r.id]).map(r=>[r.id,{reg:PublishedTER[r.id].reg,dir:PublishedTER[r.id].dir,growth:8,years:20}]))}
```

```text
tandem/dist/data/instrument-verification.json
```

```json
{
  "verified": "2026-11-20",
  "equitySource": "https://nsearchives.nseindia.com/content/indices/ind_nifty50list.csv",
  "constituents": [
    {
      "name": "Bharti Airtel Ltd.",
      "industry": "Telecommunication",
      "symbol": "BHARTIARTL",
      "series": "EQ",
      "isin": "INE397D01024"
    },
    {
      "name": "HDFC Bank Ltd.",
      "industry": "Financial Services",
      "symbol": "HDFCBANK",
      "series": "EQ",
      "isin": "INE040A01034"
    },
    {
      "name": "Hindustan Unilever Ltd.",
      "industry": "Fast Moving Consumer Goods",
      "symbol": "HINDUNILVR",
      "series": "EQ",
      "isin": "INE030A01027"
    },
    {
      "name": "ICICI Bank Ltd.",
      "industry": "Financial Services",
      "symbol": "ICICIBANK",
      "series": "EQ",
      "isin": "INE090A01021"
    },
    {
      "name": "ITC Ltd.",
      "industry": "Fast Moving Consumer Goods",
      "symbol": "ITC",
      "series": "EQ",
      "isin": "INE154A01025"
    },
    {
      "name": "Infosys Ltd.",
      "industry": "Information Technology",
      "symbol": "INFY",
      "series": "EQ",
      "isin": "INE009A01021"
    },
    {
      "name": "Larsen & Toubro Ltd.",
      "industry": "Construction",
      "symbol": "LT",
      "series": "EQ",
      "isin": "INE018A01030"
    },
    {
      "name": "Reliance Industries Ltd.",
      "industry": "Oil Gas & Consumable Fuels",
      "symbol": "RELIANCE",
      "series": "EQ",
      "isin": "INE002A01018"
    },
    {
      "name": "Sun Pharmaceutical Industries Ltd.",
      "industry": "Healthcare",
      "symbol": "SUNPHARMA",
      "series": "EQ",
      "isin": "INE044A01036"
    },
    {
      "name": "Tata Consultancy Services Ltd.",
      "industry": "Information Technology",
      "symbol": "TCS",
      "series": "EQ",
      "isin": "INE467B01029"
    }
  ],
  "fundSource": "https://portal.amfiindia.com/spages/NAVAll.txt",
  "historicalEvidence": [
    "https://portal.amfiindia.com/spages/859.pdf",
    "https://portal.amfiindia.com/NavHistoryReport_Rpt_Po.aspx?frmdate=01-Apr-2015&rpt=0"
  ]
}
```

```text
tandem/dist/data/marks.js
```

```javascript
const PublishedMarks={"100822":{"ticks":1769920,"date":"2026-11-19","source":"AMFI NAV","sourceUrl":"https://portal.amfiindia.com/spages/NAVAll.txt","fallback":true},"101525":{"ticks":2438490,"date":"2026-11-19","source":"AMFI NAV","sourceUrl":"https://portal.amfiindia.com/spages/NAVAll.txt","fallback":true},"119063":{"ticks":2498054,"date":"2026-11-19","source":"AMFI NAV","sourceUrl":"https://portal.amfiindia.com/spages/NAVAll.txt","fallback":true},"120716":{"ticks":1797634,"date":"2026-11-19","source":"AMFI NAV","sourceUrl":"https://portal.amfiindia.com/spages/NAVAll.txt","fallback":true},"HDFCBANK":{"ticks":8218000,"date":"2026-11-19","source":"NSE EOD","sourceUrl":"https://nsearchives.nseindia.com/products/content/sec_bhavdata_full_19112026.csv","fallback":true},"ICICIBANK":{"ticks":16089000,"date":"2026-11-19","source":"NSE EOD","sourceUrl":"https://nsearchives.nseindia.com/products/content/sec_bhavdata_full_19112026.csv","fallback":true},"INFY":{"ticks":10919000,"date":"2026-11-19","source":"NSE EOD","sourceUrl":"https://nsearchives.nseindia.com/products/content/sec_bhavdata_full_19112026.csv","fallback":true},"BHARTIARTL":{"ticks":21440000,"date":"2026-11-19","source":"NSE EOD","sourceUrl":"https://nsearchives.nseindia.com/products/content/sec_bhavdata_full_19112026.csv","fallback":true},"HINDUNILVR":{"ticks":20742000,"date":"2026-11-19","source":"NSE EOD","sourceUrl":"https://nsearchives.nseindia.com/products/content/sec_bhavdata_full_19112026.csv","fallback":true},"ITC":{"ticks":3010000,"date":"2026-11-19","source":"NSE EOD","sourceUrl":"https://nsearchives.nseindia.com/products/content/sec_bhavdata_full_19112026.csv","fallback":true},"LT":{"ticks":42110000,"date":"2026-11-19","source":"NSE EOD","sourceUrl":"https://nsearchives.nseindia.com/products/content/sec_bhavdata_full_19112026.csv","fallback":true},"RELIANCE":{"ticks":13756000,"date":"2026-11-19","source":"NSE EOD","sourceUrl":"https://nsearchives.nseindia.com/products/content/sec_bhavdata_full_19112026.csv","fallback":true},"SUNPHARMA":{"ticks":19000000,"date":"2026-11-19","source":"NSE EOD","sourceUrl":"https://nsearchives.nseindia.com/products/content/sec_bhavdata_full_19112026.csv","fallback":true},"TCS":{"ticks":23427000,"date":"2026-11-19","source":"NSE EOD","sourceUrl":"https://nsearchives.nseindia.com/products/content/sec_bhavdata_full_19112026.csv","fallback":true}};
if(typeof module!=='undefined')module.exports=PublishedMarks;
```

```text
tandem/dist/data/nifty-2020.json
```

```json
{"index":"NIFTY 50","peak":{"date":"2020-01-14","hundredths":1236230},"trough":{"date":"2020-03-23","hundredths":761025},"source":"https://nsearchives.nseindia.com/s3fs-public/inline-files/NSE_Annual_Report_2020.pdf","retrieved":"2026-11-20","licence":"Two factual observations attributed to NSE Annual Report 2019–20, section 1.5.1. No exchange data redistribution licence is asserted."}
```

```text
tandem/dist/data/prices/HDFCBANK.json
```

```json
{
  "symbol": "HDFCBANK",
  "name": "HDFC Bank",
  "isin": "INE040A01034",
  "source": "NSE",
  "sourceUrl": "https://www.nseindia.com/market-data/eod-historical-data-subscription",
  "retrievalDate": null,
  "adjusted": false,
  "method": "No observations imported.",
  "candles": []
}
```

```text
tandem/dist/data/prices/ICICIBANK.json
```

```json
{
  "symbol": "ICICIBANK",
  "name": "ICICI Bank",
  "isin": "INE090A01021",
  "source": "NSE",
  "sourceUrl": "https://www.nseindia.com/market-data/eod-historical-data-subscription",
  "retrievalDate": null,
  "adjusted": false,
  "method": "No observations imported.",
  "candles": []
}
```

```text
tandem/dist/data/prices/INFY.json
```

```json
{
  "symbol": "INFY",
  "name": "Infosys",
  "isin": "INE009A01021",
  "source": "NSE",
  "sourceUrl": "https://www.nseindia.com/market-data/eod-historical-data-subscription",
  "retrievalDate": null,
  "adjusted": false,
  "method": "No observations imported.",
  "candles": []
}
```

```text
tandem/dist/data/sample-input.js
```

```javascript
const SampleInput={"csv": "symbol,quantity,average_cost,acquired\nHDFCBANK,200,540,2026-01-15\nICICIBANK,60,1150,2026-01-15\nINFY,20,1050,2026-01-15\n101525,100,200,2026-01-15\n119063,65,200,2026-01-15", "illustrative": true};
if(typeof module!=='undefined')module.exports=SampleInput.csv;
```

```text
tandem/dist/data/sample.csv
```

```csv
symbol,quantity,average_cost,acquired
HDFCBANK,200,540,2026-01-15
ICICIBANK,60,1150,2026-01-15
INFY,20,1050,2026-01-15
101525,100,200,2026-01-15
119063,65,200,2026-01-15
```

```text
tandem/dist/data/tax-2026.js
```

```javascript
const TaxRules=Object.freeze({verified:'2026-11-20',from:'2026-04-01',through:'2027-03-31',shortBp:2000,longBp:1250,exemptionPaise:12500000,cessBp:400,surchargeCapBp:1500,months:12,grandfatherThrough:'2018-01-31',sources:['https://www.incometaxindia.gov.in/documents/d/guest/income_tax_act_2025_as_amended_by_fa_act_2026-pdf','https://www.incometaxindia.gov.in/documents/d/guest/finance-act-2026-pdf-1','https://www.incometaxindia.gov.in/w/capital-gain']});
if(typeof module!=='undefined')module.exports=TaxRules;
```

```text
tandem/dist/data/template.csv
```

```csv
symbol,quantity,average_cost,acquired
```

```text
tandem/dist/data/universe.js
```

```javascript
const Universe={
 HDFCBANK:['HDFC Bank Limited','Banking','INE040A01034'],ICICIBANK:['ICICI Bank Limited','Banking','INE090A01021'],
 INFY:['Infosys Limited','IT','INE009A01021'],TCS:['Tata Consultancy Services Limited','IT','INE467B01029'],
 RELIANCE:['Reliance Industries Limited','Petroleum Products','INE002A01018'],ITC:['ITC Limited','FMCG','INE154A01025'],
 HINDUNILVR:['Hindustan Unilever Limited','FMCG','INE030A01027'],LT:['Larsen & Toubro Limited','Construction','INE018A01030'],
 SUNPHARMA:['Sun Pharmaceutical Industries Limited','Pharmaceuticals','INE044A01036'],BHARTIARTL:['Bharti Airtel Limited','Telecom','INE397D01024'],
 119063:['HDFC Nifty 50 Index Fund Direct Growth','Fund','INF179K01WM1'],101525:['HDFC Nifty 50 Index Fund Regular Growth','Fund','INF179K01KZ8'],
 120716:['UTI Nifty 50 Index Fund Direct Growth','Fund','INF789F01XA0'],100822:['UTI Nifty 50 Index Fund Regular Growth','Fund','INF789F01JN2']
};
if(typeof module!=='undefined')module.exports=Universe;
```

```text
tandem/dist/feeds.js
```

```javascript
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
```

```text
tandem/dist/index.html
```

```html
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#233a4c"><meta name="description" content="Weigh it before you invest. Portfolio exposure, fees, tax and tip checks for Indian investors.">
<title>Tarazu | Pre-trade checks</title><link rel="stylesheet" href="style.css">
</head><body><header><a href="#dashboard" class="brand"><span class="scale" aria-hidden="true">⚖</span>Tarazu</a><nav aria-label="Main navigation"></nav><button id="language" aria-label="Switch language">Hinglish</button><button id="clear-data">Clear my data</button></header>
<main id="app" aria-live="polite">Loading Tarazu…</main>
<footer>Tarazu · Educational calculations · Not investment advice · Tarazu is not a SEBI-registered adviser.</footer>
<script src="model.js"></script><script src="app.js"></script><script src="language.js"></script><script src="studio.js"></script><script src="data/universe.js"></script><script src="data/sample-input.js"></script><script src="data/marks.js"></script><script src="checks.js"></script><script src="feeds.js"></script><script src="data/tax-2026.js"></script><script src="tax.js"></script><script src="tips.js"></script><script src="data/disclosures.js"></script><script src="tools.js"></script><script src="price-model.js"></script><script src="return-model.js"></script><script src="review.js"></script><script src="price-panel.js"></script><script src="analysis-view.js"></script></body></html>
```

```text
tandem/dist/language.js
```

```javascript
// Localise the existing views after rendering, preserving stock symbols and control values.
const vocabulary = {
 'Market snapshot':'Bazaar ki jhalak','Sample close':'Kalpanik closing','today':'aaj',
 'PORTFOLIO VALUE':'HOLDINGS KI VALUE','View portfolio':'Khata dekhein','since purchase':'kharid ke baad','Sample performance':'Kalpanik performance',
 'period start':'shuruaat','latest':'abhi','Market movers':'Tezi aur mandi','Gainers':'Badhne waale','Losers':'Girne waale','Explore markets':'Bazaar dekhein',
 'Your watchlist':'Aapki watchlist','Manage watchlist':'Watchlist sambhaalein','Save a stock from Markets to follow it here.':'Bazaar se stock save karke yahaan dekhein.',
 'MARKETS':'BAZAAR','Markets':'Bazaar','Explore stocks':'Stocks dekhein','Find a company to follow in the sample market.':'Kalpanik bazaar mein ek company chunein.',
 'All sectors':'Sabhi sectors','All stocks':'Sabhi stocks','Saved':'Save hai','Save':'Save karein','Search name or symbol':'Naam ya symbol khojein','Search stocks':'Stocks khojein',
 'No matching stocks':'Koi stock nahi mila','Try another name or widen your filters.':'Doosra naam ya filter aazmaayein.','Clear filters':'Filter hataayein',
 'SAVED STOCKS':'SAVE KIYE STOCKS','Follow price changes for companies you want to revisit.':'Apni pasand ki companies ke daam par nazar rakhein.',
 ' saved':' save hain','Find stocks':'Stocks khojein','Start with one company':'Ek company se shuru karein','Open Markets and choose Save next to a stock you recognise.':'Bazaar kholein aur pehchaane stock ke paas Save dabaayein.',
 'Company snapshot':'Company ki jhalak','Practice an order':'Order ki practice karein','The sample value of all shares in the company combined.':'Company ke sabhi shares ki kul kalpanik keemat.',
 'Price-to-earnings compares one share’s price with annual earnings per share.':'P/E ek share ke daam ko uski saalana kamaai se tulna karta hai.',
 'Designs compact electric vehicles for urban commuters.':'Shehri safar ke liye chhoti electric gaadiyan banaati hai.',
 'Builds business software for retailers and manufacturers.':'Dukaandaaron aur factories ke liye software banaati hai.',
 'Offers savings accounts and loans to households and small businesses.':'Parivaaron aur chhote vyapaaron ko bachat khaate aur loan deti hai.',
 'Develops solar projects and distributes electricity.':'Solar projects banaati hai aur bijli baantti hai.',
 'Produces packaged staples for neighbourhood grocery stores.':'Kiraana dukaanon ke liye packaged anaaj banaati hai.',
 'Builds digital tools for small online businesses.':'Chhote online vyapaaron ke liye digital tools banaati hai.',
 'PRACTICE ACCOUNT':'PRACTICE KHATA','Practice Portfolio':'Practice khata','Available cash':'Bacha hua cash','Holdings cost':'Kharid ki kul laagat',
 'Allocation':'Bantwaara','Share of your holdings by value':'Keemat ke hisaab se holdings ka hissa','Holdings':'Aapke shares','What is P&L?':'P&L kya hai?',
 'Profit and loss is the difference between the current value of your shares and what you paid for them.':'Aaj ki keemat aur kharid ki laagat ka antar hi munaafa ya nuksaan hai.',
 'Your first practice purchase will appear here.':'Pehli practice kharid yahaan dikhegi.','shares · average':'shares · ausat',
 'Practice order complete':'Practice order poora hua','Practice order':'Practice order','Try a simulated trade using your practice balance.':'Practice cash se kalpanik sauda aazmaayein.',
 'Buy':'Kharidein','Sell':'Bechein','Shares held':'Maujooda shares','Quantity':'Kitne shares','Review order':'Order jaanchein','Pause and think':'Rukein aur sochein',
 'What prompted this decision?':'Ye faisla kyun liya?','Choose a reason':'Wajah chunein','Following my plan':'Apne plan ke anusaar','Reacting to a price move':'Daam badalne par',
 'Testing the simulator':'Simulator aazmaane ke liye','Edit order':'Order badlein','Review simulated buy':'Kalpanik kharid jaanchein','Review simulated sell':'Kalpanik bikri jaanchein',
 'Confirm simulated buy':'Kalpanik kharid confirm karein','Confirm simulated sell':'Kalpanik bikri confirm karein','Bought ':'Kharide ','Sold ':'Beche ',' shares of ':' shares · ',
 'Available cash is ':'Bacha hua cash ','See portfolio':'Khata dekhein','Enter a positive whole number of shares.':'Shares ki ginti ek ya zyaada poori sankhya mein bharein.',
 'Insufficient practice cash. Reduce your quantity.':'Practice cash kam hai. Shares ki ginti ghataayein.','You can only sell shares you hold.':'Sirf apne paas waale shares bech sakte hain.',
 'Stock unavailable':'Stock nahi mila','Page unavailable':'Page nahi mila','Browse sample stocks':'Kalpanik stocks dekhein','Return to dashboard':'Ghar lautein'
};
const phrases=Object.keys(vocabulary).sort((a,b)=>b.length-a.length);
function translateLegacy(root){
 if(state.language!=='hi')return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 let node;
 while((node=walker.nextNode())){
   const input=node.nodeValue;
   // Match against the original text once, so translated substrings cannot be translated twice.
   const key=phrases.find(k=>input.trim()===k)||phrases.find(k=>input.includes(k));
   if(key)node.nodeValue=input.replace(key,vocabulary[key]);
 }
 const search=root.querySelector('#search');
 if(search){search.placeholder=vocabulary['Search name or symbol'];search.setAttribute('aria-label',vocabulary['Search stocks'])}
}
```

```text
tandem/dist/model.js
```

```javascript
const Tarazu = (() => {
  // Value in paise per unit. One fictional week per observation.
  const prices = [10000, 9650, 9200, 8400, 8700, 7450, 6500, 7100, 7800, 8550, 9300, 9900, 10400];
  const gates = [3, 6, 9];
  function freshReplay() { return { week: 0, units: 1000, cash: 0, decisions: [], speed: 1 }; }
  function waiting(r) { return gates.includes(r.week) && !r.decisions.some(d => d.week === r.week); }
  function decide(r, action) {
    if (!waiting(r) || !['sell','hold'].includes(action)) return;
    const sold = action === 'sell' ? Math.floor(r.units / 2) : 0;
    r.cash += sold * prices[r.week];
    r.units -= sold;
    r.decisions.push({ week: r.week, action, sold });
  }
  function value(r, week = r.week) { return r.cash + r.units * prices[week]; }
  // Exposure retained after the last checkpoint; a descriptive exercise metric.
  function score(r) { return r.week === 12 ? Math.round(r.units / 10) : null; }
  function reversals(orders) {
    const last = new Map();
    let count = 0;
    for (const order of orders) {
      if (last.has(order.id) && last.get(order.id) !== order.side) count++;
      last.set(order.id, order.side);
    }
    return count;
  }
  // Month-end contribution; interest rounded to nearest paise every month.
  function future(payment, months, monthlyBp) {
    let balance=0;
    for(let month=0; month<months; month++){
      balance += Math.round(balance*monthlyBp/10000) + payment;
    }
    return balance;
  }
  function sip(target, months) {
    if(!Number.isSafeInteger(target)||target<100||target>1000000000||
       !Number.isInteger(months)||months<1||months>120)throw new RangeError('Invalid goal');
    let low=0,high=target;
    while(low<high){
      const mid=Math.floor((low+high)/2);
      if(future(mid,months,50)>=target)high=mid;
      else low=mid+1;
    }
    return { payment:low, worst:future(low,months,-25), likely:future(low,months,50), best:future(low,months,80) };
  }
  return { sip, future, score, reversals, prices, gates, freshReplay, waiting, decide, value };
})();
if (typeof module !== 'undefined') module.exports = Tarazu;
```

```text
tandem/dist/price-model.js
```

```javascript
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
```

```text
tandem/dist/price-panel.js
```

```javascript
(()=>{
 const M=PriceSeries,cache=new Map(),ranges=['1M','3M','1Y','Covid crash 2020'];
 const dialog=document.createElement('dialog');dialog.className='price-drawer';dialog.setAttribute('aria-labelledby','price-title');document.body.append(dialog);
 let symbol,model,period,style,table,selected,series=[],opener;
 const num=n=>n.toLocaleString('en-IN'),fmt=n=>n==null?'—':rupees(n);
 function load(id){if(!cache.has(id))cache.set(id,fetch('data/prices/'+id+'.json').then(r=>r.ok?r.json():null).then(v=>v?.symbol===id&&v.candles?.length?v:null).catch(()=>null));return cache.get(id)}
 function change(r){const i=model.candles.indexOf(r),prev=model.candles[i-1];if(!prev||Date.parse(r.date)-Date.parse(prev.date)>7*86400000)return '—';const d=M.price(r)-M.price(prev);return (d>0?'Up ':d<0?'Down ':'Unchanged ')+fmt(Math.abs(d))}
 function controls(items,attr,active){return items.map(i=>'<button data-'+attr+'="'+i+'" aria-pressed="'+(i===active)+'">'+i+'</button>').join(' ')}
 async function open(el){opener=el;symbol=el.dataset.price;const id=symbol;model=null;period='1M';style='Candles';table=false;dialog.innerHTML='<h2 id="price-title">Loading price history…</h2><button data-dismiss>Close</button>';dialog.showModal();const loaded=await load(id);if(dialog.open&&id===symbol){model=loaded;paint()}}
 function paint(){
  const fund=W.catalog[symbol][1]==='Fund',all=model?.candles||[],last=all.at(-1),annual=M.slice(all,'52W'),year=annual.length?M.stats(annual):null;
  series=M.slice(all,period);selected=series.length-1;
  const x=snapshot(),holding=x.rows.find(r=>r.id===symbol);
  dialog.innerHTML='<div class="head"><h2 id="price-title">'+esc(W.catalog[symbol][0])+'</h2><button data-dismiss>Close</button></div><p>'+symbol+' · Portfolio weight '+percent(holding.value,x.total)+'</p><div class="stats">'+metric(fund?'Last NAV':'Last close',fmt(last&&M.price(last)))+metric('Day change',last?change(last):'—')+metric('52-week high / low',year?fmt(year.high)+' / '+fmt(year.low):'—')+'</div><div class="controls">'+controls(ranges,'period',period)+'</div>'+(fund?'<p>Funds report one NAV per day</p>':'<div class="controls">'+controls(['Candles','Line'],'style',style)+'</div>')+(series.length?'<canvas tabindex="0" role="img"></canvas><p id="point" aria-live="polite"></p><button data-table aria-expanded="'+table+'">'+(table?'Hide table':'View as table')+'</button>':box(M.empty(!!model),'Daily observations are required for this view.'))+
  (series.length&&table?'<div class="price-table" tabindex="0"><table><thead><tr>'+['Date',...(fund?['NAV']:['Open','High','Low','Close','Volume']),'Day change'].map(s=>'<th>'+s+'</th>').join('')+'</tr></thead><tbody>'+series.map(r=>'<tr><td>'+r.date+'</td>'+(fund?[fmt(r.nav)]:[fmt(r.open),fmt(r.high),fmt(r.low),fmt(r.close),num(r.volume)]).map(s=>'<td>'+s+'</td>').join('')+'<td>'+change(r)+'</td></tr>').join('')+'</tbody></table></div>':'')+
  '<p>Daily observations only. Real intraday data requires a licensed feed.</p><small>End-of-day data · '+(fund?'AMFI':'NSE')+' · as of '+(last?.date||'unavailable')+' · prices '+(model?.adjusted?'adjusted':'unadjusted')+' · not real time</small>'+(!fund?'<p><a href="#order/'+symbol+'" data-dismiss>Open tax-aware sell check</a></p>':'');
  draw()
 }
 function draw(){
  const c=dialog.querySelector('canvas');if(!c||!series.length)return;
  const w=c.clientWidth,h=c.clientHeight,d=devicePixelRatio||1;c.width=w*d;c.height=h*d;const g=c.getContext('2d');g.scale(d,d);
  const fund=series[0].nav!=null,stats=M.stats(series),area=Math.max(1,w-84),height=h*(fund?.82:.65),step=area/series.length;
  const xx=i=>(i+.5)*step,yy=p=>14+height*(stats.high-p)/(stats.high-stats.low||1);
  function line(x,y,x2,y2,color){g.beginPath();g.strokeStyle=color;g.moveTo(x,y);g.lineTo(x2,y2);g.stroke()}
  for(let t=0;t<=4;t++)line(0,14+t*height/4,area,14+t*height/4,'#d1ded8');
  const vmax=Math.max(1,...series.map(r=>r.volume||0));
  series.forEach((r,i)=>{const x=xx(i),y=yy(M.price(r)),color=r.close>=r.open?'#167454':'#a33a4e';
   if(M.mode(fund,style)==='Candles'){line(x,yy(r.high),x,yy(r.low),color);g.fillStyle=color;g.fillRect(x-step*.32,Math.min(y,yy(r.open)),Math.max(.8,step*.64),Math.max(1,Math.abs(y-yy(r.open))))}
   else if(i)line(xx(i-1),yy(M.price(series[i-1])),x,y,'#245b65');else{g.fillStyle='#245b65';g.fillRect(x,y,2,2)}
   if(!fund){g.fillStyle=color;g.fillRect(x-step*.3,h-20,Math.max(1,step*.6),-r.volume/vmax*h*.16)}
  });
  const r=series[selected],close=M.price(series.at(-1));g.setLineDash([4,4]);line(0,yy(close),area,yy(close),'#384c59');line(xx(selected),0,xx(selected),h-18,'#384c59');line(0,yy(M.price(r)),area,yy(M.price(r)),'#82918d');g.setLineDash([]);g.fillStyle='#233d45';g.font='12px sans-serif';g.fillText(fmt(close),area+4,yy(close)+4);g.fillText(series[0].date,0,h-3);g.textAlign='right';g.fillText(period===ranges[3]?'Trough · 23 Mar 2020':series.at(-1).date,area,h-3);
  c.setAttribute('aria-label',period+' return '+stats.change.toFixed(2)+'%, high '+fmt(stats.high)+', low '+fmt(stats.low)+'. Use left and right arrows.');
  dialog.querySelector('#point').textContent=r.date+' · '+(fund?'NAV '+fmt(r.nav):'Open '+fmt(r.open)+' · High '+fmt(r.high)+' · Low '+fmt(r.low)+' · Close '+fmt(r.close)+' · Volume '+num(r.volume)+' · Candle '+(r.close>r.open?'up':r.close<r.open?'down':'flat'))+' · Day change '+change(r);
  c.onpointermove=e=>{selected=M.index(e.clientX-c.getBoundingClientRect().left,area,series.length);draw()};
  c.onkeydown=e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();selected=Math.max(0,Math.min(series.length-1,selected+(e.key==='ArrowLeft'?-1:1)));draw()}};
 }
 document.addEventListener('click',e=>{if(e.target.closest('a'))return;const el=e.target.closest('[data-price]');if(el)open(el)});
 document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('tr[data-price]')){e.preventDefault();open(e.target)}});
 dialog.onclick=e=>{e.stopPropagation();const k=e.target.dataset;if('dismiss'in k){dialog.close();return}if(k.period)period=k.period;else if(k.style)style=k.style;else if('table'in k)table=!table;else return;const selector=k.period?'[data-period="'+period+'"]':k.style?'[data-style="'+style+'"]':'[data-table]';paint();dialog.querySelector(selector)?.focus()};
 dialog.onclose=()=>opener?.focus();window.addEventListener('resize',draw);
})();
```

```text
tandem/dist/return-model.js
```

```javascript
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
```

```text
tandem/dist/review.js
```

```javascript
'use strict';
let sortField='value', sortDirection=-1;
function loadSample(){
 state.xray=W.csv(W.sample);state.sample=true;
 state.fees=feeDefaults(state.xray);
 state.betas={};save();render();
}
function metric(label,value,cls=''){return '<div><small>'+label+'</small><strong class="'+cls+'">'+value+'</strong></div>'}
function bar(weight,marker=false){return '<svg aria-hidden="true" class="weight" viewBox="0 0 100 5" preserveAspectRatio="none"><rect width="100" height="5" fill="#e2eae6"/><rect class="grow" width="'+Math.min(100,weight)+'" height="5" fill="#35776e"/>'+(marker?'<path d="M40 0v5" stroke="#804723" stroke-width="1"/>':'')+'</svg>'}
function resultsPanel(){
 const x=snapshot();if(!x.rows.length)return box(T('Portfolio cleared','Portfolio hata diya'),T('Import CSV or load the sample to see your results.','CSV laayein ya sample kholein.'));
 const ranked=[...x.rows].sort((a,b)=>b.value-a.value),exposure=Returns.exposure(ranked,Object.fromEntries(Object.entries(W.catalog).map(([k,v])=>[k,v[1]])),IndexWeights),effective=exposure.effective;
 const status=effective<4?T('Concentrated','Kendrit'):effective<8?T('Moderate','Madhyam'):T('Diversified','Vividha');
 const top=ranked.slice(0,Math.min(2,ranked.length)),v=top.reduce((s,r)=>s+r.value,0);
 const sectors=Object.entries(exposure.bySector).sort((a,b)=>b[1]-a[1]);
 const sorted=[...ranked].sort((a,b)=>sortDirection*(sortField==='id'?a.id.localeCompare(b.id):sortField==='gain'?(a.value-a.cost)-(b.value-b.cost):a.value-b.value));
 return '<section class="card summary"><h2>'+T('Portfolio overview','Portfolio ka saar')+'</h2><div class="metrics">'+metric(T('Total value','Kul value'),rupees(x.total))+metric('P&L',rupees(x.total-x.cost),tone(x.total-x.cost))+metric(T('Holdings','Holdings'),ranked.length)+'</div><strong>'+status+'</strong> · '+effective.toFixed(2)+' '+T('effective holdings','prabhaavi holdings')+bar(100/effective)+'<small>'+T('Partial look-through; unpublished constituents grouped together. Effective count is a lower bound.','Squared weights ke yog ka ulta. Kam ginti matlab adhik concentration.')+'</small></section>'+
 box(T('What stands out','Khaas baatein'),'<p class="insight">'+top.length+' / '+ranked.length+' '+T('holdings account for','holdings ka hissa')+' <b>'+percent(v,x.total)+'</b> · '+rupees(v)+'</p><p class="insight">'+sectorName(sectors[0][0])+' · <b>'+percent(sectors[0][1],x.total)+'</b> · '+rupees(sectors[0][1])+'</p>')+
 box(T('Sector exposure','Sector ka hissa'),sectors.map(([s,n])=>'<p>'+sectorName(s)+' <b>'+percent(n,x.total)+'</b>'+bar(100*n/x.total,true)+'</p>').join('')+'<small>'+T('Marker at 40%. Unpublished index constituents grouped as Unresolved.','Nishaan 40% par. Fund ke shares aur overlap uplabdh nahi.')+'</small>')+
 box(T('Holdings','Holdings'),'<table class="holdings"><thead><tr>'+[['id','Symbol'],['value',T('Value','Raashi')],['weight',T('Weight','Hissa')],['gain','P&L']].map(([k,l])=>'<th aria-sort="'+(sortField===k?(sortDirection===1?'ascending':'descending'):'none')+'"><button data-sort="'+k+'">'+l+(sortField===k?(sortDirection===1?' ↑':' ↓'):'')+'</button></th>').join('')+'</tr></thead><tbody>'+sorted.map(r=>'<tr data-price="'+r.id+'" tabindex="0" aria-label="Price history: '+W.catalog[r.id][0]+'"><td>'+r.id+(W.catalog[r.id][1]==='Fund'?'':'<br><a href="#order/'+r.id+'">Practise sale</a>')+'</td><td>'+rupees(r.value)+'</td><td>'+percent(r.value,x.total)+bar(100*r.value/x.total)+'</td><td class="'+tone(r.value-r.cost)+'">'+rupees(r.value-r.cost)+'</td></tr>').join('')+'</tbody></table><details><summary>'+T('Price sources and dates','Daam ke srot aur tareekh')+'</summary>'+ranked.map(r=>{const q=Feeds.quotes[r.id];return '<p>'+r.id+' · '+q.source+' · '+q.date+' · '+(q.fallback?'Bundled snapshot':'Published close')+'</p>'}).join('')+'</details><button data-refresh="1">'+T('Try live refresh (may be blocked by the provider)','Daam refresh karein')+'</button><span id="feedstatus" role="status"></span>');
}
positions=resultsPanel;
function importCard(){
 return box(T('Import holdings','Holdings laayein'),'<p>'+T('Paste or drop a CSV. Your file stays in this browser.','CSV paste ya drop karein. File isi browser mein rehti hai.')+'</p><details><summary>'+T('Format help','Format ki madad')+'</summary><p>symbol, quantity, average_cost, acquired (YYYY-MM-DD)</p><a download href="data/template.csv">Template CSV</a> · <a download href="data/sample.csv">Sample CSV</a></details><label>Find an instrument<input type="search" id="chipsearch" placeholder="Company, scheme or symbol"></label><div class="chips">'+Object.entries(W.catalog).map(([k,[name]])=>'<button data-chip="'+k+'">'+name+' · '+k+'</button>').join('')+'</div><label>CSV<textarea id="csv" rows="5" placeholder="'+W.sample.split('\n').slice(0,3).join('\n')+'"></textarea></label><label id="drop">'+T('Drop CSV here or choose a file','CSV yahaan drop karein ya file chunein')+'<input id="csvfile" type="file" accept=".csv,text/csv"></label><div class="controls"><button class="primary" data-import="1">'+T('Analyse CSV','CSV jaanchein')+'</button><button data-sample="1">'+T('Use sample portfolio','Sample portfolio dekhein')+'</button></div><div id="csvmsg" role="alert"></div>');
}
ingest=function(text){
 const [head,...lines]=text.trim().split(/\r?\n/),valid=[],messages=[],seen=new Set();
 if(!lines.length||lines.length>1000)messages.push('Row 1 · '+T(...errors.size));
 else lines.forEach((line,i)=>{try{const [row]=W.csv(head+'\n'+line);if(seen.has(row.id))throw Error('2|duplicate');valid.push(row);seen.add(row.id)}catch(e){const key=e.message.split('|')[1];messages.push('Row '+(i+2)+' · '+T(...(errors[key]||errors.csv))+(key==='symbol'?' · '+Object.keys(W.catalog).join(', '):''))}});
 if(valid.length){state.sample=false;state.xray=valid;state.fees=feeDefaults(valid);state.betas={};save();render()}
 document.querySelector('#csvmsg').innerHTML=messages.map(m=>'<p>'+esc(m)+'</p>').join('');
 if(messages.length)document.querySelector('#csv').value=text;
};
views.dashboard=()=>moduleTitle(T('PRE-TRADE CHECKS','NIVESH SE PEHLE JAANCH'),'Portfolio X-ray',T('Weigh it before you invest.','Nivesh se pehle tolein.'))+(state.sample?'<div class="samplebanner">'+T('Sample portfolio loaded. '+(SampleInput.illustrative?'Illustrative costs. ':'Observed purchase closes. ')+'Replace it with your own holdings.','Sample portfolio taiyaar hai. Apni holdings se badlein.')+' <button data-focuscsv="1">Import my CSV</button><button data-empty="1">Clear</button></div>':'')+'<div class="xgrid"><aside>'+importCard()+'</aside><div><div id="reading">'+resultsPanel()+'</div>'+feePanel().replaceAll('type="number" step="1" min="1" max="30" name="years"','type="range" step="1" min="5" max="30" name="years"').replace('<form','<p>'+T('Growth and horizon are assumptions. Plan expense ratios are editable.','Sample inputs sirf misaal hain, prakashit expense ratios nahi.')+'</p><form')+'</div></div>';
function stressNumbers(){
 const x=snapshot(),h=historical,base=(h.peak.hundredths-h.trough.hundredths)/h.peak.hundredths;
 const impacts=x.rows.map(r=>({...r,loss:Math.round(r.value*base*(state.betas?.[r.id]??1))})).sort((a,b)=>b.loss-a.loss);
 const lost=impacts.reduce((s,r)=>s+r.loss,0),ratio=lost/x.total;
 return '<div class="card"><small>'+T('Estimated loss','Anumaanit ghaata')+'</small><h2>−'+rupees(lost)+' · '+percent(lost,x.total)+'</h2><p>14 Jan 2020 · 12,362.30 → 23 Mar 2020 · 7,610.25</p><div id="daily-path">Daily portfolio path requires matching price histories for all holdings.</div><p>'+rupees(x.total)+' → '+rupees(x.total-lost)+'</p><h3>'+T('Impact by holding','Holding par asar')+'</h3>'+impacts.map(r=>'<button class="impact" data-price="'+r.id+'">'+r.id+' · −'+rupees(r.loss)+bar(impacts[0].loss?100*r.loss/impacts[0].loss:0)+'</button>').join('')+'</div>';
}
const priorStress=views.stress;
views.stress=()=>!historical||!rows().length?priorStress():moduleTitle('NIFTY 50 · 2020',T('Portfolio stress test','Portfolio stress jaanch'),T('Historical drawdown applied to your marked holdings.','Aapki holdings par aitihaasik giraawat.'))+'<div id="stressnumbers">'+stressNumbers()+'</div>'+box(T('Sensitivity assumptions','Sensitivity ke anumaan'),'<p>'+T('Beta defaults to 1.0. Each estimate scales the index fall by the assumed beta. This is not a prediction.','Beta 1.0 maana hai. Index ki giraawat ko beta se guna kiya hai. Ye prediction nahi hai.')+'</p>'+rows().map(r=>'<label class="beta">'+r.id+' · beta ('+T('assumption, editable','anumaan, badal sakte hain')+') <input type="number" min="0" max="2" step=".1" data-beta="'+r.id+'" value="'+(state.betas?.[r.id]??1)+'"></label>').join('')+'<p><a href="'+historical.source+'">NSE Annual Report 2019–20</a> · '+historical.retrieved+'</p><a class="button" href="#replay">Practise your reaction</a>');
const priorTip=views.tip;
views.tip=()=>priorTip().replace('<label>','<button data-example="1">'+T('Try an example scam-style message','Ek kalpanik scam sandesh dekhein')+'</button><label>');
const reasons={promise:'Market returns cannot be promised.',fixed:'A fixed profit claim hides price risk.',urgency:'Time pressure discourages verification.',payment:'Private access or payment can limit independent checks.',offsite:'Moving the conversation can bypass platform controls.',operator:'Certainty claims conceal potential losses.',return:'An exceptional short-term return needs independent evidence.'};
document.addEventListener('click',e=>{
 const d=e.target.dataset,field=document.querySelector('#csv');
 if(d.focuscsv)field.focus();
 if(d.empty){state.sample=false;state.xray=[];state.fees={};state.betas={};save();render()}
 if(d.chip){const row=W.sample.split('\n').find(l=>l.startsWith(d.chip+','))||d.chip+',1,,';field.value=(field.value.trim()||W.sample.split('\n')[0])+'\n'+row;field.focus()}
 if(d.sort){sortDirection=sortField===d.sort?-sortDirection:-1;sortField=d.sort;document.querySelector('#reading').innerHTML=resultsPanel();document.querySelector('[data-sort="'+sortField+'"]').focus()}
 if(d.example){const f=document.querySelector('#tiptext');f.value='Guaranteed returns on our next call. Limited slots. Join private group for the details.';f.focus()}
 if(d.scan){const text=document.querySelector('#tiptext').value,hits=TipCheck.scan(text);if(!text.trim())return;
 const byPos=hits.map(h=>({...h,index:h.index})).sort((a,b)=>a.index-b.index);let start=0,marked='';for(const h of byPos){if(h.index<start)continue;marked+=esc(text.slice(start,h.index))+'<mark>'+esc(h.phrase)+'</mark>';start=h.index+h.phrase.length}
 const risk=hits.length>=3?'High':hits.length?'Elevated':'Low';
 document.querySelector('#flags').innerHTML='<h3>'+risk+' flags</h3>'+bar(hits.length>=3?100:hits.length?55:8)+'<blockquote>'+marked+esc(text.slice(start))+'</blockquote>'+hits.map(h=>'<p><b>'+esc(h.phrase)+'</b> · '+reasons[h.type]+'</p>').join('')+'<p>'+T('No flags does not mean safe.','Koi sanket na milna suraksha ki guarantee nahi hai.')+'</p>'}
});
document.addEventListener('input',e=>{
 const f=e.target.form;
 if(e.target.dataset.beta&&e.target.value!==''&&e.target.validity.valid){state.betas||={};state.betas[e.target.dataset.beta]=Number(e.target.value);save();document.querySelector('#stressnumbers').innerHTML=stressNumbers()}
 if(f?.dataset.fee&&f.checkValidity()){const vals=Object.fromEntries([...new FormData(f)].map(([k,v])=>[k,Number(v)]));state.fees||={};state.fees[f.dataset.fee]=vals;save();f.querySelector('[role=status]').textContent=vals.years+' '+T('years','saal')+' · '+feeSummary(snapshot().rows.find(r=>r.id===f.dataset.fee).value,vals)}
});
document.addEventListener('dragover',e=>{if(e.target.closest('#drop'))e.preventDefault()});
document.addEventListener('drop',async e=>{if(!e.target.closest('#drop'))return;e.preventDefault();const file=e.dataTransfer.files[0];if(file&&file.size<=200000){try{ingest(await file.text())}catch{document.querySelector('#csvmsg').textContent=T('File unreadable.','File nahi padh sake.')}}else document.querySelector('#csvmsg').textContent=T('Choose a CSV up to 200 KB.','200 KB tak ki CSV chunein.')});
const menuLabel=navLabel;navLabel=p=>p==='Practice'?T('Practice (simulated)','Abhyaas (kalpanik)'):menuLabel(p);
if(!state.publishedFeeMigration){const old=state.fees||{};if(state.sample&&old['101525']?.reg===1.5&&old['101525']?.dir===.5)delete old['101525'];state.fees={...feeDefaults(rows()),...old};state.publishedFeeMigration=true}
if(state.sample&&state.xray?.some(r=>!W.catalog[r.id]))loadSample();
if(!state.xray&&!sessionStorage.getItem('tarazu-cleared'))loadSample();
save();render();loadHistorical();
document.body.classList.add('entry');setTimeout(()=>document.body.classList.remove('entry'),650);
document.addEventListener('input',e=>{if(e.target.id==='chipsearch')document.querySelectorAll('[data-chip]').forEach(b=>b.hidden=!b.textContent.toLowerCase().includes(e.target.value.trim().toLowerCase()))});
```

```text
tandem/dist/studio.js
```

```javascript
const D = Tarazu;
const tr = (en, hi) => state.language === 'hi' ? hi : en;
const rupees = paise => money(paise / 100);
const sim = () => state.replay || (state.replay = D.freshReplay());
const moduleTitle = (tag,title,description) => '<span class="eyebrow">'+tag+'</span><h1>'+title+'</h1><p class="lead">'+description+'</p>';
let timer = null;
function stopReplay(){ clearInterval(timer); timer=null; }
function startReplay(){
  stopReplay();
  const r=sim();
  if(D.waiting(r)||r.week>=D.prices.length-1)return;
  timer=setInterval(()=>{
    if(location.hash!=='#replay'){stopReplay();return;}
    r.week++;
    if(D.waiting(r)||r.week===D.prices.length-1)stopReplay();
    save();render();
  },1250/r.speed);
}
window.addEventListener('hashchange',stopReplay);
function timeline(r){
  const h=16;
  return '<div class="timeline" role="img" aria-label="'+tr('Weekly sample index','Haftay ka sample index')+'">'+D.prices.map((p,i)=>'<i class="'+(i>r.week?'future':'')+'" style="height:'+(i>r.week?h:(p-5500)/50)+'%"></i>').join('')+'</div>';
}
const bulletins=[
 ['Trading opens quietly','Bazaar shaant khula'],
 ['Fictional lenders report slower growth','Kalpanik banks ki growth dheemi'],
 ['Several sectors cut their outlook','Kai sectors ne umeedein ghataayin'],
 ['Buyers return, cautiously','Kharidaar dheere laut rahe hain'],
 ['The sample index recovers','Sample index sambhal gaya']
];
views.replay=()=>{
 const r=sim(),done=r.week===12,wait=D.waiting(r),news=bulletins[done?4:r.week>=9?3:r.week>=6?2:r.week>=3?1:0];
 return moduleTitle(tr('FIELD EXERCISE','ABHYAAS'),tr('Market Time Machine','Bazaar ki Time Machine'),tr('Follow ₹1,00,000 through twelve fictional weeks. The replay pauses at each decision.','₹1,00,000 ke saath baarah kalpanik hafte dekho. Har faisle par replay rukega.'))+
 '<div class="grid"><section class="card hero"><div class="head"><span class="eyebrow">'+tr('REPLAY PORTFOLIO','REPLAY PORTFOLIO')+'</span><b>'+tr('Week','Hafta')+' '+r.week+' / 12</b></div><strong class="big">'+rupees(D.value(r))+'</strong><p>'+tr('Index move since start','Shuruaat se index ka badlav')+' '+pct(D.prices[r.week]/100-100)+'</p>'+timeline(r)+'<div class="legend"><span>'+tr('Start','Shuruaat')+'</span><span>'+tr('Week 12','Hafta 12')+'</span></div></section><section class="card"><span class="eyebrow">'+tr('FICTIONAL HEADLINE','KALPANIK KHABAR')+'</span><h2>'+tr(...news)+'</h2><p>'+tr('Your replay cash','Aapka replay cash')+' '+rupees(r.cash)+' · '+r.units+' '+tr('units held','units bachi hain')+'</p><div class="controls">'+(wait?'<p>'+tr('Keep your position or move half your units into cash. Cash stays aside for the rest of this replay.','Units rakho ya aadhi cash mein badlo. Ye cash replay ke ant tak alag rahega.')+'</p><button data-choice="hold">'+tr('Hold','Rakhein')+'</button><button data-choice="sell">'+tr('Sell half','Aadhi bechein')+'</button>':done?'<a class="button primary" href="#report">'+tr('Open Behaviour Report','Apni report dekhein')+'</a>':'<button class="primary" data-play="1">'+(timer?tr('Pause','Rokein'):tr('Play replay','Replay chalaayein'))+'</button>')+'</div><label>'+tr('Replay speed','Replay ki raftaar')+' <select id="speed">'+[1,2,4].map(n=>'<option value="'+n+'" '+(r.speed===n?'selected':'')+'>'+n+'×</option>').join('')+'</select></label></section></div>';
};
document.addEventListener('click',e=>{
 const d=e.target.dataset;
 if(d.play){if(timer)stopReplay();else startReplay();render()}
 if(d.choice){D.decide(sim(),d.choice);save();startReplay();render()}
});
document.addEventListener('change',e=>{if(e.target.id==='speed'){sim().speed=Number(e.target.value);save();if(timer)startReplay()}});
function pathComparison(r){
 let cash=0,units=1000;
 const rows=[0,...D.gates,12].map(week=>{
   const price=D.prices[week],decision=r.decisions.find(d=>d.week===week);
   if(decision){cash+=decision.sold*price;units-=decision.sold;}
   return '<tr><td>'+week+'</td><td>'+rupees(cash+units*price)+'</td><td>'+rupees(1000*price)+'</td></tr>';
 }).join('');
 return '<details><summary>'+tr('Compare the paths week by week','Hafta-dar-hafta tulna')+'</summary><table><thead><tr><th>'+tr('Week','Hafta')+'</th><th>'+tr('Your path','Aapka raasta')+'</th><th>'+tr('Held throughout','Sab units rakhi')+'</th></tr></thead><tbody>'+rows+'</tbody></table></details>';
}
views.report=()=>{
 const r=sim(),complete=r.week===12,orders=state.orders,sales=r.decisions.filter(d=>d.action==='sell'),patient=1000*D.prices[12];
 return moduleTitle(tr('REFLECTION','SOCH VICHAR'),tr('Behaviour Report','Faislon ki report'),tr('Educational simulation. This exercise does not predict your real behaviour.','Ye seekhne ka simulation hai. Isse asli bazaar mein aapka vyavhaar predict nahi hota.'))+
 (complete?'<div class="grid"><section class="card hero"><span class="eyebrow">REGRET MIRROR</span><h2>'+tr('Two paths, one market','Ek bazaar, do raaste')+'</h2><div class="stats"><div><small>'+tr('Your final value','Aapki aakhri value')+'</small><strong>'+rupees(D.value(r))+'</strong></div><div><small>'+tr('Held throughout','Sab units rakhi hoti')+'</small><strong>'+rupees(patient)+'</strong></div></div><p>'+tr('Difference at recovery','Recovery par antar')+' · '+rupees(patient-D.value(r))+'</p>'+pathComparison(r)+'</section><section class="card"><span class="eyebrow">TARAZU SCORE</span><h2>'+D.score(r)+' / 100</h2><p>'+tr('Percentage of the original units you kept. This measures exposure in this exercise only.','Shuru ki units ka jitna pratishat rakha. Ye sirf is exercise ka exposure dikhata hai.')+'</p></section></div><section class="card"><h2>'+tr('What your choices show','Aapke faisle kya dikhaate hain')+'</h2><p>'+(sales.length?tr('You sold during the drawdown. That may resemble panic-selling, but a click cannot tell us your motive.','Giraawat mein aapne becha. Ye panic-selling jaisa lag sakta hai, par wajah sirf aap jaante hain.'):tr('You held at every checkpoint. There was no panic sale in this replay.','Aapne har mod par units rakhi. Is replay mein panic sale nahi hui.'))+'</p><ol><li>'+tr('Cash softened later swings and missed the recovery on any units sold.','Cash se utaar-chadhaav kam hua aur bechi units ka recovery laabh chhoot gaya.')+'</li><li>'+tr('This story includes a recovery. Other markets can keep falling.','Is kahaani mein recovery hui. Doosre bazaar aur gir sakte hain.')+'</li></ol><p>'+r.decisions.map(d=>tr('Week','Hafta')+' '+d.week+' · '+(d.action==='sell'?tr('sold','bechi')+' '+d.sold:tr('held','rakhi'))).join(' / ')+'</p><button data-again="1">'+tr('Start a fresh replay','Naya replay shuru karein')+'</button></section>':'<section class="card empty"><h2>'+tr('Your mirror opens after week 12','Hafta 12 ke baad report khulegi')+'</h2><a href="#replay" class="button">'+tr('Go to replay','Replay par jaayein')+'</a></section>')+
 '<section class="card spaced"><h2>'+tr('Practice decision log','Practice ke faisle')+'</h2><p>'+tr('Overtrading proxy','Overtrading ka sanket')+' · '+D.reversals(orders)+' — '+tr('count of buy/sell direction changes on the same symbol. This is a prompt for reflection, not a diagnosis.','Ek hi stock par buy aur sell ki disha kitni baar badli. Is ginti par sochiye; ye nateeja nahi hai.')+'</p>'+(orders.length?orders.slice().reverse().map(o=>'<div class="stock">'+o.id+' · '+(o.side==='Buy'?tr('Bought','Kharidi'):tr('Sold','Bechi'))+' '+o.q+' × '+money(o.price)+(o.reason?' · '+reasonLabel(o.reason):'')+'</div>').join(''):'<p>'+tr('Your confirmed practice orders will appear here.','Confirm kiye practice orders yahaan dikhenge.')+'</p>')+'</section>';
};
document.addEventListener('click',e=>{if(e.target.dataset.again){state.replay=D.freshReplay();save();location.hash='replay'}});
function navLabel(p){return ({Dashboard:tr('Home','Ghar'),Portfolio:tr('Practice Portfolio','Practice khata'),Replay:tr('Time Machine','Time Machine'),Report:tr('Report','Report'),Markets:tr('Markets','Bazaar'),Watchlist:tr('Watchlist','Watchlist'),Planner:tr('Goals','Lakshya'),Learn:tr('Learn','Seekhein')})[p]||p}
function reasonLabel(key){return ({plan:tr('Following my plan','Apne plan ke anusaar'),move:tr('Reacting to a price move','Daam badalne par'),try:tr('Testing the simulator','Simulator aazmaane ke liye')})[key]||''}
document.addEventListener('change',e=>{if(e.target.id==='reason')document.querySelector('[data-confirm]').disabled=!e.target.value});
function homeIntro(){
 const r=sim(),score=D.score(r);
 return '<div class="homehero"><div><span class="eyebrow">'+tr('BEHAVIOURAL INVESTING LAB','NIVESHAK KI PRAYOGSHAALA')+'</span><h1>'+tr('Pre-trade checks','Tarazu ka studio')+'</h1><p>'+tr("Weigh it before you invest.","Sirf daam mat dekho. Jab daam girte hain, apna faisla samjho.")+'</p><a class="button primary" href="#replay">'+tr('Enter the Time Machine','Time Machine kholein')+'</a></div><div class="orbit" aria-hidden="true"><i></i><i></i><i></i><b></b></div></div><div class="indices learning"><section class="card"><span class="eyebrow">TARAZU SCORE</span><h2>'+(score===null?tr('Awaiting replay','Replay baaki hai'):score+' / 100')+'</h2><a href="#report">'+tr('See behaviour report','Faislon ki report dekhein')+'</a></section><section class="card"><span class="eyebrow">'+tr('YOUR GOAL','AAPKA LAKSHYA')+'</span><h2>'+(state.goal?goalName(state.goal.name):tr('Plan a laptop','Laptop ka plan'))+'</h2><a href="#planner">'+tr('Open SIP planner','SIP planner kholein')+'</a></section><section class="card"><span class="eyebrow">'+tr('DAILY LESSON','AAJ KA SABAK')+'</span><h2>'+tr('Pause before a sale','Bechne se pehle ruko')+'</h2><p>'+tr('Ask what changed beyond the price.','Socho, daam ke alaava kya badla?')+'</p></section></div>';
}
function explain(s){
 if(Math.abs(s.change)<3)return '';
 const fall=s.change<0;
 return '<aside class="explain"><span class="eyebrow">'+tr('FICTIONAL MOVE EXPLAINER','KALPANIK BADLAV')+'</span><h3>'+ (fall?'Kyun gira?':'Kyun badha?')+' · '+s.name+'</h3><p>'+(fall?tr('Market-wide. A fictional funding squeeze delayed energy projects across the sector. Orbit fell with its peers.','Bazaar ka asar. Kalpanik funding ki kami se energy projects ruke. Orbit bhi sector ke saath gira.'):tr('Stock-specific. A fictional fleet order lifted expectations for Kite’s electric vans.','Company ka asar. Ek kalpanik fleet order se Kite ki electric vans ki maang ki umeed badhi.'))+'</p><strong>'+tr('Worth reading more','Aur padhna behtar hai')+'</strong></aside>';
}
function goalName(key){return ({laptop:tr('Laptop','Laptop'),bike:tr('Bike','Bike'),college:tr('College fees','College ki fees')})[key]}
const starterGoal={name:'laptop',amount:80000,months:24};
function projection(g){
 const m=D.sip(g.amount*100,g.months);
 return '<section class="card hero"><span class="eyebrow">'+tr('MONTHLY SIP','HAR MAHINE KI SIP')+'</span><h2 class="big">'+rupees(m.payment)+'</h2><p>'+tr('Monthly contribution for the middle scenario.','Beech waale scenario ke liye maasik yogdaan.')+'</p><div class="stats">'+[[tr('Worst','Kam'),m.worst],[tr('Likely*','Beech*'),m.likely],[tr('Best','Zyaada'),m.best]].map(([l,v])=>'<div><small>'+l+'</small><strong>'+rupees(v)+'</strong></div>').join('')+'</div><small>'+tr('*Illustrative scenarios use −0.25%, +0.50% and +0.80% monthly. “Likely” labels the middle assumption. Returns are not guaranteed. Outcomes can fall outside this range.','*Kalpanik maasik dar −0.25%, +0.50% aur +0.80% hain. Beech ka andaaza sirf misaal hai. Returns ki guarantee nahi hai. Asli nateeje is range ke bahar bhi ho sakte hain.')+'</small></section>';
}
views.planner=()=>{
 const g=state.goal||starterGoal;
 return moduleTitle(tr('GOAL FIRST','PEHLE LAKSHYA'),tr('SIP planner','SIP ka plan'),tr('Start with something you want to save for. Compare three fictional outcomes for regular month-end contributions.','Apne lakshya se shuru karo. Har mahine ke ant mein bachat ke teen kalpanik nateeje dekho.'))+
 '<div class="grid"><form class="card goalform" id="goalform" novalidate><label>'+tr('Goal','Lakshya')+'<select name="goal">'+['laptop','bike','college'].map(k=>'<option value="'+k+'" '+(k===g.name?'selected':'')+'>'+goalName(k)+'</option>').join('')+'</select></label><label>'+tr('Target amount (₹)','Lakshya raashi (₹)')+'<input name="amount" type="number" value="'+g.amount+'"></label><label>'+tr('Months','Mahine')+'<input name="months" type="number" value="'+g.months+'"></label><p id="goalerror" role="alert"></p><button class="primary">'+tr('Calculate and save goal','Hisaab karein aur save karein')+'</button></form>'+projection(g)+'</div>';
};
document.addEventListener('submit',e=>{
 if(e.target.id!=='goalform')return;
 e.preventDefault();
 const f=e.target.elements,amount=Number(f.amount.value),months=Number(f.months.value);
 if(!Number.isSafeInteger(amount)||amount<1||amount>10000000||!Number.isInteger(months)||months<1||months>120){
 document.querySelector('#goalerror').textContent=tr('Enter ₹1–₹1,00,00,000 in whole rupees and 1–120 whole months.','₹1 se ₹1,00,00,000 aur 1 se 120 poore mahine bharein.');return;}
 state.goal={name:f.goal.value,amount,months};save();render();
});
views.learn=()=>moduleTitle(tr('FIELD NOTES','SEEKHNE KI DIARY'),tr('Learn the language','Shabd samjhein'),tr('Four terms you will meet in the studio.','Studio mein milne waale chaar shabd.'))+
 '<div class="learn-grid">'+[
 ['P&L',tr('Profit and loss','Munaafa aur nuksaan'),tr('Buy a share for ₹100 and see it valued at ₹92. Its unrealised P&L is −₹8 until you sell.','₹100 ka share ab ₹92 ka hai. Bechne tak ₹8 ka nuksaan sirf kaagaz par hai.')],
 ['P/E',tr('Price to earnings','Daam aur kamaai'),tr('A ₹200 share earning ₹10 per year has a P/E of 20. It compares price with earnings.','₹200 ke share ki saalana kamaai ₹10 hai toh P/E 20 hai. Isse daam aur kamaai ki tulna hoti hai.')],
 ['SIP',tr('Systematic investment plan','Niyamit nivesh'),tr('Set aside an amount at regular intervals. In the planner you practise a contribution at each month’s end.','Niyamit antar par ek raashi lagaana. Planner mein har mahine ke ant mein ek yogdaan ki practice hoti hai.')],
 [tr('Volatility','Utaar-chadhaav'),tr('How much prices move','Daam kitna badalta hai'),tr('A price moving from ₹100 to ₹80 and back to ₹95 shows volatility. A swing alone cannot explain what changed in the business.','₹100 se ₹80 aur phir ₹95 jaana utaar-chadhaav hai. Sirf daam se company ke badlav ki wajah nahi pata chalti.')]
 ].map(([term,name,body])=>'<article class="card"><span class="eyebrow">'+name+'</span><h2>'+term+'</h2><p>'+body+'</p></article>').join('')+'</div>';
function syncLanguage(){
 document.documentElement.lang=state.language==='hi'?'hi-Latn':'en';
 document.querySelector('#language').textContent=tr('Hinglish','English');
 document.title='Tarazu | '+(app.querySelector('h1')?.textContent||'Pre-trade checks');
 translateLegacy(app);
}
document.querySelector('#language').addEventListener('click',()=>{
 state.language=state.language==='hi'?'en':'hi';save();render();
});
document.addEventListener('input',e=>{if(e.target.id==='search')translateLegacy(document.querySelector('#results'))});
document.addEventListener('submit',e=>{if(e.target.id==='ticket')translateLegacy(document.querySelector('#review')||document.querySelector('#error'))});
document.addEventListener('click',e=>{if(e.target.dataset.confirm)translateLegacy(document.querySelector('#review'))});
render();
```

```text
tandem/dist/style.css
```

```css
:root{--ink:#182e2a;--muted:#52665e;--green:#126945;--red:#a23d50;--line:#d8e0d9;--lime:#daf68a;--paper:#f5f7f2}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.5 Inter,"Helvetica Neue",Arial,sans-serif;font-variant-numeric:tabular-nums}header{display:flex;align-items:center;gap:4vw;padding:15px 5vw;background:#fff;border-bottom:1px solid var(--line)}a{color:inherit;text-decoration:none}.brand{font-size:32px;font-weight:800;letter-spacing:-2px;display:flex;align-items:center;gap:9px}.logo{display:grid;place-items:center;background:var(--ink);color:var(--lime);width:36px;height:36px;border-radius:10px;font-size:28px;text-shadow:0 -6px #79a692}nav{display:flex;gap:4px}nav a,button,.button,select,input{font:inherit;border-radius:9px;padding:9px 14px}nav a.active,.tabs button.active{background:#e6eddf;color:var(--ink);font-weight:650}.demo,.eyebrow{font-size:12px;letter-spacing:1.4px;font-weight:750}.demo{margin-left:auto;background:#ededdc;padding:6px 12px;border-radius:24px;white-space:nowrap}main,footer{max-width:1380px;margin:auto;padding:30px 5vw}h1,h2,h3,p{margin:0}h1{font-size:clamp(34px,4vw,54px);letter-spacing:-.055em;line-height:1.15}h2{font-size:24px;letter-spacing:-1px}p,small,.muted{color:var(--muted)}.lead{margin:8px 0 24px}.row,.head,.stats,.tabs,.controls{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.head{justify-content:space-between;margin-bottom:14px}.grid,.indices{display:grid;gap:16px}.indices{grid-template-columns:repeat(3,1fr)}.grid{grid-template-columns:1.55fr 1fr;margin:22px 0}.card{background:white;border:1px solid var(--line);border-radius:18px;padding:22px;min-width:0}.index{position:relative;overflow:hidden}.index strong,.big{font-size:28px;letter-spacing:-1px}.index canvas{position:absolute;right:6%;bottom:22%;width:30%;height:46px}.up{color:var(--green)}.down,.error{color:var(--red)}.hero{background:#163f35;color:#fff;border-color:#163f35}.hero p,.hero small{color:#d1dfd6}.hero .big{font-size:44px}.hero .up{color:var(--lime)}canvas{display:block;width:100%;height:158px}.tabs button{border:0;background:transparent;padding:6px 12px}.hero .tabs button{color:#e6f2e9}.hero .tabs button.active{background:var(--lime);color:var(--ink)}button,.button,select,input{border:1px solid var(--line);background:#fff;color:var(--ink)}button,.button,select{cursor:pointer}.primary{background:var(--ink);color:white}.stock{display:flex;align-items:center;gap:12px;border-top:1px solid var(--line);padding:12px 0}.stock a:first-of-type{flex:1}.stock small,.stock strong{display:block}.mark{background:var(--t);border-radius:11px;width:38px;height:38px;display:grid;place-items:center;font-size:14px;font-weight:bold;color:#233b33}.right{text-align:right}.stats{gap:28px;margin:18px 0}.stats strong{display:block;font-size:22px}.controls{margin:14px 0}.empty{padding:28px 8px}.error{font-weight:bold}.legend{display:flex;justify-content:space-between;color:inherit;font-size:13px}.donut{width:135px;height:135px;border-radius:100%;display:grid;place-items:center}.donut:after{content:'';width:88px;height:88px;background:white;border-radius:100%}footer{border-top:1px solid var(--line);font-size:14px}details{margin:12px 0}summary{cursor:pointer}:focus-visible{outline:3px solid #2777ad;outline-offset:3px}@media(max-width:830px){header{gap:12px;flex-wrap:wrap}nav{order:3;width:100%;justify-content:space-between}nav a{padding:7px}.grid{grid-template-columns:1fr}.demo{margin-left:auto}}@media(max-width:600px){main,footer{padding:20px 4vw}.indices{grid-template-columns:1fr;gap:8px}.index{padding:12px 16px}.index strong{font-size:22px}.index canvas{height:35px;bottom:25%}.card{padding:16px}.stock{gap:8px}.stock small{font-size:12px}.row,.head,.tabs{gap:7px}nav{font-size:14px}.stats{gap:14px}}
.ticket{max-width:680px}.ticket form{display:grid;gap:12px;justify-items:start}.ticket input{max-width:120px}.ticket p+.button,.stock+.button{display:inline-block;margin-top:12px}.hero .head:nth-last-child(3){margin-top:18px}
:root{--ink:#153d42;--muted:#4a6365;--line:#cfddda;--paper:#f3f7f5;--lime:#ffe0a1;--sea:#164c51;--accent:#eeb78b}.brand,h1,h2{font-family:Georgia,"Times New Roman",serif;font-weight:500}.brand{letter-spacing:-1.6px}.logo{position:relative;overflow:hidden;border-radius:50% 50% 35% 35%;background:var(--sea)}.logo:before,.logo:after{content:'';position:absolute;width:20px;height:10px;border:2px solid var(--lime);border-top:0;border-radius:0 0 20px 20px;top:10px}.logo:after{top:16px;width:26px}.hero{background:var(--sea);border-color:var(--sea)}.demo{background:#e2efea;color:#274d49}.card{border-radius:14px}.eyebrow{color:#406c6a}.hero .eyebrow{color:#c3dbd6}nav{flex-wrap:wrap}header{gap:18px;flex-wrap:wrap}a:hover{text-decoration:underline}button:hover,.button:hover{filter:brightness(.96)}
.timeline{height:170px;display:flex;gap:1.8%;align-items:flex-end;border-bottom:1px solid #8daba7;margin:22px 0 8px;background:repeating-linear-gradient(0deg,transparent 0 40px,#ffffff16 40px 41px)}.timeline i{flex:1;border-radius:4px 4px 0 0;background:#d9d8a3}.timeline i.future{background:#ffffff21}.card h2+p{margin:8px 0 16px}
.homehero{display:grid;grid-template-columns:3fr 2fr;position:relative;isolation:isolate;overflow:hidden;min-height:245px;background:#123f45;color:white;border-radius:18px;padding:clamp(24px,4vw,52px);align-items:center}.homehero .eyebrow{color:#e4c39c}.homehero h1{margin-top:8px;font-size:clamp(38px,5vw,74px)}.homehero p{color:#dce9e6;max-width:52ch;margin:10px 0 20px}.homehero .primary{display:inline-block;background:#f2d2a2;color:#173d40;border:0}.orbit{position:absolute;right:0;top:0;width:37%;height:100%;overflow:hidden;background:linear-gradient(145deg,#245b60,#163f45);z-index:-1}.orbit i{position:absolute;width:160%;height:125%;border:1px solid #8bb6a5;border-radius:50%;left:-8%;top:42%;box-shadow:0 -7px 0 #29575b,0 -8px 0 #709c90,0 -15px 0 #29575b,0 -16px 0 #719b90}.orbit i:nth-child(2){left:16%;top:60%;transform:rotate(-28deg)}.orbit i:nth-child(3){left:-70%;top:65%;transform:rotate(25deg)}.orbit b{position:absolute;width:44px;height:44px;border-radius:50%;background:#ebc296;left:42%;top:17%}.learning,.spaced{margin:20px 0}.learning h2{margin:8px 0}.learning a{color:#28666a;text-decoration:underline;text-underline-offset:3px}fieldset{border:1px solid var(--line);border-radius:10px;margin:14px 0}button:disabled{opacity:.5;cursor:default}@media(max-width:650px){.homehero{grid-template-columns:1fr}.orbit{width:28%;opacity:.35}.homehero>div:first-child{max-width:95%}nav{justify-content:flex-start}}
.explain{border-left:3px solid #cc9f6b;background:#f8f3eb;padding:12px 18px;margin:8px 0 16px;border-radius:0 10px 10px 0}.explain p{margin:5px 0}.goalform{display:grid;gap:12px}.goalform label{display:grid;gap:4px}.goalform input,.goalform select{width:100%}.goalform [role=alert]{color:var(--red)}
.learn-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr));gap:16px}.learn-grid h2{font-size:34px;margin:10px 0}header{padding:12px 3vw}nav a{padding:7px 9px;font-size:15px}#language{margin-left:auto}.demo{margin-left:0}@media(max-width:830px){nav{order:3;flex-basis:100%;justify-content:flex-start}.brand{font-size:28px}}@media(max-width:420px){header{gap:8px}.demo{font-size:10px;padding:5px 7px}.ticket select{max-width:100%}}
table{width:100%;border-collapse:collapse;text-align:right}th,td{padding:6px 4px;border-bottom:1px solid #ffffff38}th:first-child,td:first-child{text-align:left}.hero summary{color:#ffe0a1}
:root{--ink:#202c35;--muted:#4f5e68;--line:#cbd3d8;--paper:#f4f6f7;--sea:#253c50;--lime:#efd9b8}.scale{font:32px Georgia;color:#806238}.card,.button,button,input,select,.homehero,.mark{border-radius:5px}.orbit{display:none}.homehero{background:#233a4c}.brand{font-family:Georgia,serif}.hero{background:#233a4c}.card h2{line-height:1.2}nav{gap:2px}#clear-data{font-size:14px}
textarea{display:block;width:100%;box-sizing:border-box;margin:7px 0;padding:12px;font:15px/1.5 monospace;border:1px solid #8d9aa0;border-radius:4px}.stock .right{margin-left:auto}.card a{text-decoration:underline}.card p{margin:.6em 0}.card form label{display:block;margin:8px 0}.card input{max-width:100%}
.xgrid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.25fr);gap:20px}.xgrid>.card{margin:8px 0}.xgrid textarea{font-size:14px;background:#f6f8fa}.xgrid .card:nth-child(2){border-top:4px solid #93744a}.xgrid .card:first-child{border-top:4px solid var(--sea)}.scale{font-variant-emoji:text}header{border-top:3px solid #293c4a}.controls input[type=file]{width:100%;margin-top:5px}.stock{flex-wrap:wrap}.eyebrow{color:#4c646b}#csvmsg{color:#983c43}@media(max-width:850px){.xgrid{grid-template-columns:1fr}.xgrid .stock{align-items:flex-start}}
*{min-width:0}body{overflow-wrap:anywhere}main{width:100%}.xgrid{grid-template-columns:minmax(260px,.8fr) minmax(0,1.55fr);align-items:start}.xgrid .card{margin:0 0 16px;padding:24px}.samplebanner,.insight{background:#e7eee9;padding:12px 16px;border-radius:4px}.samplebanner{margin-bottom:16px}.samplebanner button{margin-left:8px}.chips{display:flex;flex-wrap:wrap;gap:4px;margin:12px 0}.chips button{font-size:12px;padding:4px 8px;background:#f3f6f3}#drop{position:relative;display:block;text-align:center;padding:16px;border:1px dashed #60746d;background:#f4f7f4}#drop input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}#drop:focus-within{outline:3px solid #2777ad}.metrics{display:flex;gap:24px;flex-wrap:wrap;margin:16px 0}.metrics strong,.metrics small{display:block}.metrics strong{font-size:clamp(19px,2vw,30px)}.weight{display:block;width:100%;height:6px;margin:6px 0}.holdings{font-variant-numeric:tabular-nums;table-layout:fixed}.holdings td,.holdings th{text-align:right;padding:8px 3px;border-bottom:1px solid var(--line)}.holdings td:first-child,.holdings th:first-child{text-align:left}.holdings button{background:transparent;border:0;padding:4px;font-weight:bold}.beta{display:block;margin:8px 0}.beta input{width:80px}mark{background:#ffe2a4;color:#30250d;padding:2px}blockquote{margin:16px 0;border-left:3px solid #8e6734;padding:12px}nav a,nav a:hover{text-decoration:none}nav a.active{border-bottom:2px solid #33645c;background:transparent;border-radius:0}.entry .grow,.entry .metrics strong{animation:appear .45s ease-out;transform-origin:left}@keyframes appear{from{opacity:.25;transform:translateY(3px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.entry .grow,.entry .metrics strong{animation:none}}@media(max-width:850px){.xgrid{grid-template-columns:minmax(0,1fr)}.xgrid aside{order:2}.xgrid .card{padding:16px}button,nav a,.button,summary{min-height:44px}.holdings{font-size:14px}.metrics{gap:12px}.card{max-width:100%}.controls>*{max-width:100%}header nav{flex-wrap:wrap}}
.price-drawer{box-sizing:border-box;inset:0 0 0 auto;margin:0;width:min(770px,100vw);height:100dvh;max-height:100dvh;max-width:100vw;border:0;padding:24px;background:var(--paper);color:var(--ink);overflow:auto;font-variant-numeric:tabular-nums}.price-drawer::backdrop{background:#15293288}.price-drawer canvas{height:300px;width:100%;background:white}.price-table{overflow:auto;max-height:45vh}.price-table table{white-space:nowrap}.price-drawer [aria-pressed=true]{background:#254b4c;color:white}.holdings tr[data-price],.impact{cursor:pointer}.impact{display:block;width:100%;text-align:left;margin:8px 0}.holdings tr[data-price]:hover{background:#edf4ef}@media(max-width:600px){.price-drawer{width:100vw;padding:16px}}
```

```text
tandem/dist/tax.js
```

```javascript
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
```

```text
tandem/dist/tips.js
```

```javascript
const TipCheck=(()=>{
 const rules=[
 ['promise',/\b(?:guaranteed?|assured|pakka)\s+(?:daily\s+)?(?:returns?|profits?|munafa)\b/gi],
 ['fixed',/\bfixed[ -](?:daily |monthly )?(?:profit|income|return)s?\b/gi],
 ['urgency',/\b(?:act now|last chance|today only|abhi karo|hurry|limited slots?)\b/gi],
 ['payment',/\b(?:pay (?:now|first|upfront)|send (?:money|payment)|join (?:our |my |the )?(?:private|vip|paid) (?:group|channel))\b/gi],
 ['offsite',/\b(?:move to|switch to|message (?:us|me) on|join (?:us )?on)\s+(?:telegram|whatsapp|signal)\b/gi],
 ['operator',/\b(?:sure[ -]shot|operator (?:call|tip)|no[ -]loss call)\b/gi],
 ['return',/\b(?:double (?:your )?money (?:in|within) (?:a |one |\d+ )?(?:day|week|month)s?|\d+(?:\.\d+)?\s*%\s*(?:daily|weekly|per day|per week|in a day))\b/gi]
 ];
 function scan(text){return rules.flatMap(([type,re])=>[...text.matchAll(re)].filter(m=>type!=='return'||!m[0].includes('%')||parseFloat(m[0])>=5).filter(m=>!/(?:\bno|\bnot|avoid|warn against)\s+$/i.test(text.slice(0,m.index))).map(m=>({type,phrase:m[0],index:m.index})))}
 return {scan};
})();
if(typeof module!=='undefined')module.exports=TipCheck;
```

```text
tandem/dist/tools.js
```

```javascript
const W=Checks, T=tr, rows=()=>state.xray||[], snapshot=()=>W.xray(rows(),Feeds.quotes);
const box=(heading,body)=>'<section class="card spaced"><h2>'+heading+'</h2>'+body+'</section>';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const percent=(n,total)=>total?(100*n/total).toFixed(1)+'%':'—';
const sectorName=s=>({Banking:T('Banking','Banking'),IT:'IT',Fund:T('Funds · sector unknown','Funds · sector agyaat')})[s]||s;
const errors={csv:['Malformed CSV quotes','CSV quotes galat hain'],header:['Expected symbol or name, quantity and average_cost','symbol ya name, quantity aur average_cost chahiye'],size:['Use 1–1,000 rows','1–1,000 rows dein'],columns:['Column count differs from header','Columns ki sankhya header se alag hai'],symbol:['No verified price coverage for this name or symbol','Is naam ya symbol ka verified daam nahi hai'],duplicate:['Duplicate position; combine the rows into one average-cost holding','Ek holding do baar hai; ek ausat laagat waali row banaayein'],qty:['Invalid quantity; stocks require whole shares','Quantity galat hai; stock ke poore shares dein'],cost:['Invalid cost or position too large','Laagat galat ya holding bahut badi hai'],date:['Use a valid past or present YYYY-MM-DD date','Sahi purani ya aaj ki YYYY-MM-DD date dein']};
function importBox(){return box(T('Import holdings','Holdings laayein'),'<p>'+T('Your file stays in this browser. Paste CSV or choose a file. Use one row per holding; provide an acquisition date only for a single purchase lot. Supported symbols:','File isi browser mein rehti hai. CSV paste karein ya file chunein. Har holding ki ek row dein; acquisition date sirf ek hi purchase lot ke liye dein. Supported symbols:')+' '+Object.keys(W.catalog).join(', ')+'</p><label>CSV<textarea id="csv" rows="5" placeholder="symbol,quantity,average_cost,acquired"></textarea></label><div class="controls"><button data-import="1" class="primary">'+T('Analyse CSV','CSV jaanchein')+'</button><button data-sample="1">'+T('Use sample portfolio','Sample portfolio dekhein')+'</button><label>'+T('Open file','File kholein')+' <input type="file" id="csvfile" accept=".csv,text/csv"></label><a download href="data/template.csv">'+T('Download template','Template download karein')+'</a> · <a download href="data/sample.csv">'+T('Sample CSV','Sample CSV')+'</a></div><p id="csvmsg" role="alert"></p>')}
function positions(){
 if(!rows().length)return '<p>'+T('Import holdings to see concentration, P&L and fees.','Concentration, P&L aur fees ke liye holdings laayein.')+'</p>';
 const x=snapshot();
 return '<div class="stats"><div><small>'+T('Marked value','Bazaar ke daam par value')+'</small><strong>'+rupees(x.total)+'</strong></div><div><small>P&L</small><strong>'+rupees(x.total-x.cost)+'</strong></div></div>'+x.rows.map(r=>{const q=Feeds.quotes[r.id];return '<div class="stock"><div><strong>'+W.catalog[r.id][0]+'</strong><small>'+T('Unit price','Ek unit ka daam')+' ₹'+(q.ticks/10000).toLocaleString('en-IN',{maximumFractionDigits:4})+' · '+q.source+' · '+q.date+' · '+(q.fallback?T('bundled snapshot','bundled snapshot'):T('published close','prakashit close'))+' · '+(Date.now()-Date.parse(q.date)>172800000?T('stale','puraana'):T('delayed','vilambit'))+'</small></div><div class="right"><b>'+rupees(r.value)+'</b><small>'+percent(r.value,x.total)+(r.value>x.total*.35?' · '+T('holding above 35%','holding 35% se adhik'):'')+'</small></div></div>'}).join('')+x.rows.filter(r=>W.catalog[r.id][1]!=='Fund').map(r=>'<a class="button" href="#order/'+r.id+'">'+T('Practise sale','Bikri jaanchein')+' · '+r.id+'</a>').join(' ')+'<h3>'+T('Sector exposure','Sector ka hissa')+'</h3>'+Object.entries(x.sectors).map(([s,v])=>'<p>'+sectorName(s)+' · '+percent(v,x.total)+(s!=='Fund'&&v>x.total*.5?' · '+T('More than half in one sector','Aadhe se adhik ek sector mein'):'')+'</p>').join('')+'<p>'+T('Fund overlap unavailable: no verified constituent file is bundled. Sector weights exclude look-through.','Fund overlap uplabdh nahi: verified constituent file nahi hai. Sector hisse fund ke andar tak nahi dekhte.')+'</p><button data-refresh="1">'+T('Refresh public prices','Public daam refresh karein')+'</button><span id="feedstatus" role="status"></span>';
}
views.dashboard=()=>moduleTitle(T('PRE-TRADE CHECKS','NIVESH SE PEHLE JAANCH'),'Portfolio X-ray',T('Weigh it before you invest. Check a tip, uncover fund costs and weigh the tax on a sale.','Nivesh se pehle tolein. Tip jaanchein, fund ka kharch samjhein aur bikri par tax dekhein.'))+ '<div class="xgrid">'+importBox()+box(T('Portfolio reading','Portfolio ka hisaab'),'<div id="reading">'+positions()+'</div>')+'</div>'+(typeof feePanel==='function'?feePanel():'');
function ingest(text){try{const parsed=W.csv(text);state.xray=parsed;state.fees={};save();render();updateFeeds()}catch(e){const [n,key]=e.message.split('|');document.querySelector('#csvmsg').textContent=T('Row ','Row ')+n+' · '+T(...(errors[key]||errors.csv))}}
document.addEventListener('click',async e=>{const d=e.target.dataset;if(d.import)ingest(document.querySelector('#csv').value);if(d.sample)loadSample();if(d.refresh)await updateFeeds();if(e.target.id==='clear-data'&&confirm(T('Clear holdings, tips, cached prices and all practice history in this tab?','Is tab ki holdings, tips, cached daam aur practice history mitaayein?'))){for(const k of ['tarazu-v1','dhairya-v2','tandem-v1'])sessionStorage.removeItem(k);sessionStorage.setItem('tarazu-cleared','1');location.hash='dashboard';location.reload()}});
document.addEventListener('change',async e=>{if(e.target.id==='csvfile'&&e.target.files[0]){const f=e.target.files[0];if(f.size>200000){document.querySelector('#csvmsg').textContent=T('File exceeds 200 KB.','File 200 KB se badi hai.');return}try{ingest(await f.text())}catch{document.querySelector('#csvmsg').textContent=T('Cannot read this file.','File padh nahi sake.')}}});
function feePanel(){
 const funds=snapshot().rows.filter(r=>W.catalog[r.id][1]==='Fund');
 if(!funds.length)return '';
 return box(T('Fund fee drag','Fund fees ka asar'),'<p>'+T('Enter both annual expense ratios from your plan documents. Annual growth is applied first, then expenses. Same starting balance and gross return, no new contributions.','Plan documents se dono saalana expense ratios bharein. Pehle growth phir fees lagti hai. Shuru ki raashi aur gross return samaan hain, koi naya yogdaan nahi.')+'</p>'+funds.map(r=>{
 const f=state.fees?.[r.id],ter=PublishedTER[r.id];return '<form data-fee="'+r.id+'"><h3>'+W.catalog[r.id][0]+'</h3><p>'+(ter?'<a href="'+ter.url+'">AMC disclosure · '+ter.date+'</a> · Regular '+ter.reg+'% / Direct '+ter.dir+'%':'Enter from scheme document')+'</p>'+[[T('Regular TER (%)','Regular TER (%)'),'reg'],[T('Direct TER (%)','Direct TER (%)'),'dir'],[T('Assumed gross annual return (%)','Anumaanit saalana gross return (%)'),'growth'],[T('Years','Saal'),'years']].map(([l,k])=>'<label>'+l+' <input required type="number" step="'+(k==='years'?'1':'.01')+'" min="'+(k==='years'?1:0)+'" max="'+(k==='years'?30:k==='growth'?20:10)+'" name="'+k+'" value="'+(f?.[k]??(k==='years'?10:''))+'"></label>').join('')+'<button>'+T('Compare costs','Kharch ki tulna')+'</button><p role="status">'+(f?feeSummary(r.value,f):'')+'</p></form>'}).join(''));
}
function feeSummary(p,f){const v=W.fee(p,...['reg','dir','growth'].map(k=>Math.round(f[k]*100)),f.years);return T('End value · regular','Antim raashi · regular')+' '+rupees(v.regular)+' · direct '+rupees(v.direct)+' · '+T('difference','antar')+' '+rupees(v.difference)}
document.addEventListener('submit',e=>{if(!e.target.dataset.fee)return;e.preventDefault();state.fees||={};state.fees[e.target.dataset.fee]=Object.fromEntries([...new FormData(e.target)].map(([k,v])=>[k,Number(v)]));save();render()});
const taxMessages={inputs:['Check quantity and remaining exemption.','Quantity aur bachi exemption jaanchein.'],year:['Sale outside the verified tax year.','Sale verified tax year ke bahar hai.'],history:['Missing or unsupported lot history. Pre-February 2018 lots need 31 January 2018 FMV and the grandfathering calculation.','Lot history adhoori ya unsupported hai. February 2018 se pehle ki lot ke liye 31 January 2018 ki FMV aur grandfathering hisaab chahiye.'],loss:['Loss set-off needs the wider tax record; estimate unavailable.','Loss set-off ke liye poora tax record chahiye; estimate uplabdh nahi.']};
const todayIST=()=>new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'});
function taxPanel(id,imported){
 const lot=rows().find(r=>r.id===id),max=imported?(lot?.units||0)/1000:state.hold[id]?.[0]||0;
 if(!max)return '';
 return box(T('Tax-aware sell check','Bikri se pehle tax jaanch'),'<p>'+T('Simulated sale only. Listed equity with qualifying STT; resident individual, basic allowance used, income up to ₹50 lakh, zero surcharge, 4% cess. Same price and available exemption assumed if waiting.','Sirf kalpanik bikri. STT waali listed equity; resident vyakti, basic chhoot istemaal, aay ₹50 lakh tak, surcharge shoonya, cess 4%. Intezaar par daam aur bachi chhoot samaan maani hai.')+'</p><form id="taxform" data-id="'+id+'" data-imported="'+Number(imported)+'"><label>'+T('Shares to check','Jaanch ke liye shares')+' <input required name="qty" type="number" min="1" max="'+max+'" step="1" value="'+max+'"></label><label>'+T('Sale date','Bikri ki tareekh')+' <input name="date" type="date" required value="'+todayIST()+'"></label><label>'+T('Remaining annual LTCG exemption (₹)','Bachi saalana LTCG chhoot (₹)')+' <input name="allowance" type="number" min="0" max="125000" step=".01" required value="125000"></label><button>'+T('Estimate sale tax','Bikri tax ka anumaan')+'</button><p role="status" id="taxresult"></p></form><small>'+T('Rules as of 20 Nov 2026; check with a tax professional.','20 Nov 2026 ke niyam; tax professional se jaanch karein.')+' <a href="'+TaxRules.sources[0]+'">Income Tax Department</a></small>');
}
const practiceOrder=views.order;
views.order=id=>{
 if(W.catalog[id]&&rows().some(r=>r.id===id)&&W.catalog[id][1]!=='Fund')return moduleTitle(T('SIMULATED ORDER TICKET','KALPANIK ORDER'),T('Sell check','Bikri jaanch')+' · '+id,T('Uses the X-ray mark. Imported positions are unchanged.','X-ray ke daam par hisaab. Import ki holding samaan rahegi.'))+taxPanel(id,true);
 return practiceOrder(id)+(side==='Sell'?taxPanel(id,false):'');
};
document.addEventListener('submit',e=>{
 if(e.target.id!=='taxform')return;e.preventDefault();
 const f=e.target,{id,imported}=f.dataset,r=rows().find(l=>l.id===id),isImport=imported==='1';
 const lots=isImport?[{date:r.acquired,q:r.units/1000,price:r.basis}]:(state.lots?.[id]||[{date:null,q:state.hold[id][0]}]);
 try{const v=TaxCheck.estimate(lots,Number(f.qty.value),isImport?Math.round(Feeds.quotes[id].ticks/100):stock(id).price*100,f.date.value,Math.round(Number(f.allowance.value)*100));
 document.querySelector('#taxresult').textContent=(v.later!==null&&v.lines.some(l=>!l.isLong)?'Waiting until '+v.waitDate+' turns this into long-term and changes the tax from '+rupees(v.tax)+' to '+rupees(v.later)+'. ':'')+v.lines.map(l=>l.n+' × '+l.days+' '+T('days','din')+' · '+(l.isLong?'LTCG':'STCG')+' · '+T('long-term from','long-term shuru')+' '+l.boundary).join(' / ')+' · '+T('Tax now','Ab tax')+' '+rupees(v.tax)+' · '+(v.later===null?T('Later tax year unverified.','Agle tax year ke niyam verified nahi.'):T('Tax on','Tax tareekh')+' '+v.waitDate+' '+rupees(v.later)+' · '+T('difference','antar')+' '+rupees(v.tax-v.later));
 }catch(err){document.querySelector('#taxresult').textContent=T(...(taxMessages[err.message]||taxMessages.inputs))}
});
const flagNames={promise:['Return promise','Return ka vaada'],fixed:['Fixed profit','Tay munaafa'],urgency:['Time pressure','Samay ka dabaav'],payment:['Payment or private group','Payment ya private group'],offsite:['Move to another app','Doosre app par le jaana'],operator:['Operator-style claim','Operator jaisa daava'],return:['Exceptional return claim','Asaadhaaran return ka daava']};
views.tip=()=>moduleTitle(T('MESSAGE REVIEW','SANDESH JAANCH'),'Tip Check',T('Inspect the wording before following a tip. Text is checked locally and discarded when you leave.','Tip par faisle se pehle shabd jaanchein. Text isi browser mein jaancha jaata hai aur page chhodne par hat jaata hai.'))+box(T('Message','Sandesh'),'<label>'+T('Paste tip','Tip paste karein')+'<textarea id="tiptext" rows="4" maxlength="10000"></textarea></label><button data-scan="1">'+T('Check phrases','Shabd jaanchein')+'</button><div id="flags" role="status"></div>')+box(T('Check the intermediary','Intermediary jaanchein'),'<label>'+T('Adviser name or registration number (local reference only)','Adviser ka naam ya registration number (sirf local sandarbh)')+' <input autocomplete="off"></label><p>'+T('Open the official directory, select Investment Adviser and search the exact name or number. Match contact details too. Tarazu has no verified public registration API.','Official directory kholein, Investment Adviser chunein aur sahi naam ya number khojein. Sampark jaankaari bhi milaayein. Tarazu ke paas verified public lookup API nahi hai.')+'</p><a href="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognised=yes" target="_blank" rel="noreferrer">SEBI · '+T('Recognised intermediaries','Intermediaries ki directory')+'</a>')+box(T('Report a concern','Shikaayat karein'),'<p>'+T('For a grievance against a regulated entity, contact the entity first, then use','Regulated sanstha ki shikaayat pehle usse karein, phir istemaal karein')+' <a href="https://scores.sebi.gov.in/">SEBI SCORES</a>.</p><p>'+T('For financial cyber fraud call 1930 or report at','Financial cyber fraud ke liye 1930 par call karein ya report karein')+' <a href="https://cybercrime.gov.in/">National Cyber Crime Reporting Portal</a>.</p>');
document.addEventListener('click',e=>{if(!e.target.dataset.scan)return;const text=document.querySelector('#tiptext').value,flags=TipCheck.scan(text);document.querySelector('#flags').innerHTML=!text.trim()?T('Enter a message first.','Pehle sandesh bharein.'):'<h3>'+(flags.length?T('Red flags found','Jokhim ke sanket mile'):T('No red flags found','Koi sanket nahi mila'))+'</h3>'+flags.map(f=>'<p>'+T(...flagNames[f.type])+' · <q>'+esc(f.phrase)+'</q></p>').join('')+'<p>'+T('No flags does not mean safe.','Koi sanket na milna suraksha ki guarantee nahi hai.')+'</p>'});
let historical=null,historyError=false;
async function loadHistorical(){
 try{const res=await fetch('data/nifty-2020.json');if(!res.ok)throw Error();historical=await res.json()}catch{historyError=true}
 if(['','#dashboard','#stress'].includes(location.hash)&&!document.activeElement?.closest('form,input,textarea'))render();
}
views.stress=()=>{
 const intro=moduleTitle(T('HISTORICAL SCENARIO','AITIHAASIK PARIDRISHYA'),T('Portfolio stress test','Portfolio stress jaanch'),T('Apply the January–March 2020 NIFTY 50 fall to the holdings in your X-ray.','Apne X-ray ki holdings par January–March 2020 ki NIFTY 50 giraawat lagaayein.'));
 const replay='<a class="button" href="#replay">'+T('Practise your reaction · fictional replay','Apni pratikriya aazmaayein · kalpanik replay')+'</a>';
 if(!historical)return intro+box(T('Scenario data','Paridrishya data'),historyError?T('Unable to load historical file. Serve the dist folder over HTTP and reload.','Historical file nahi khuli. Dist folder HTTP se chalaakar reload karein.'):T('Loading index observations…','Index observations load ho rahi hain…'))+replay;
 const h=historical,peak=h.peak.hundredths,trough=h.trough.hundredths,x=snapshot(),fall=W.stress(x.total,peak,trough);
 return intro+box('NIFTY 50 · '+h.peak.date+' — '+h.trough.date,'<p>'+peak/100+' → '+trough/100+' · −'+percent(peak-trough,peak)+'</p><p>'+T('All supported holdings use index beta 1.0: each position moves by the index percentage. Fund constituents, cash flows and security-specific changes are excluded. This estimate does not predict future losses.','Sabhi holdings ka index beta 1.0 maana hai: har holding index ke pratishat se badalti hai. Fund ke shares, cash flow aur alag company ka asar shaamil nahi. Ye bhavishya ki prediction nahi.')+'</p><a href="'+h.source+'">NSE Annual Report 2019–20 · §1.5.1</a> · '+h.retrieved)+box(T('Estimated exposure','Anumaanit asar'),x.rows.length?'<strong class="big">−'+rupees(fall)+'</strong><p>'+rupees(x.total)+' → '+rupees(x.total-fall)+'</p>'+x.rows.map(r=>'<p>'+W.catalog[r.id][0]+' · −'+rupees(W.stress(r.value,peak,trough))+'</p>').join(''):'<a href="#dashboard">'+T('Import holdings first','Pehle holdings laayein')+'</a>')+replay;
};

views.practice=()=>moduleTitle(T('SIMULATED DATA','KALPANIK DATA'),T('Practice tools','Practice ke tools'),T('Fictional quotes, orders and balances.','Quotes, orders aur balance kalpanik hain.'))+'<section class="card controls">'+['Markets','Watchlist','Portfolio','Replay','Report','Planner','Learn'].map(p=>'<a class="button" href="#'+p.toLowerCase()+'">'+navLabel(p)+'</a>').join('')+'</section>'+marketOverview();
pages.splice(0,pages.length,'Dashboard','Tip','Stress','Practice');
const originalNav=navLabel;
navLabel=p=>({Dashboard:'Portfolio X-ray',Tip:'Tip Check',Stress:T('Stress test','Stress jaanch'),Practice:T('Practice','Abhyaas')})[p]||originalNav(p);
const oldSync=syncLanguage;
syncLanguage=()=>{
 oldSync();document.querySelector('#clear-data').textContent=T('Clear my data','Mera data mitaayein');
 document.querySelector('footer').textContent=T('Tarazu · Educational calculations. Not investment advice. Tarazu is not a SEBI-registered adviser. Holdings, goals and practice activity stay in this tab. Tip text is not saved.','Tarazu · Shaikshik hisaab. Nivesh salaah nahi. Tarazu SEBI-registered adviser nahi hai. Holdings, lakshya aur practice isi tab mein rehte hain. Tip text save nahi hota.');
 const page=location.hash.slice(1).split('/')[0];if(['markets','stock','portfolio','order','watchlist','report','replay','planner','learn'].includes(page)){
 const badge=document.createElement('p');badge.className='eyebrow';badge.textContent=T('SIMULATED PRACTICE','KALPANIK ABHYAAS');app.prepend(badge)}
};
if(state.publicPrices?.quotes)for(const [id,q] of Object.entries(state.publicPrices.quotes))if(W.catalog[id]&&q.date>=(Feeds.quotes[id]?.date||''))Feeds.quotes[id]=q;
async function updateFeeds(){
 const status=document.querySelector('#feedstatus');
 if(status)status.textContent=T(' Checking public price files…',' Public daam ki jaanch…');
 await Feeds.refresh();
 const reading=document.querySelector('#reading');
 if(reading){reading.innerHTML=positions();const label=document.querySelector('#feedstatus');if(label)label.textContent=Object.values(Feeds.quotes).some(q=>q.fallback)?T(' Provider unavailable for some quotes; using dated snapshots.',' Kuch quotes ke liye provider uplabdh nahi; purane snapshots dikh rahe hain.'):T(' Published closing data.',' Prakashit closing data.')}
}
```

```text
tandem/package.json
```

```json
{
  "name": "tarazu-pretrade",
  "private": true,
  "scripts": {
    "build": "node build.js",
    "test": "node --test tests/*.test.js tests/*.test.mjs"
  }
}
```

```text
tandem/tests/checks.test.js
```

```javascript
const test=require('node:test'),assert=require('node:assert/strict'),W=require('../dist/checks');
test('CSV validates row and cause before replacing holdings',()=>{
 const [h,row]=W.sample.split('\n');assert.equal(W.csv(W.sample).length,5);
 for(const [s,err] of [[row+'\n'+row,'3|duplicate'],['HDFCBANK,xx,3,','2|qty'],['"broken,1,2,','2|csv'],['INFY,1,-2,','2|cost']])assert.throws(()=>W.csv(h+'\n'+s),e=>e.message===err);
});
test('concentration weights use market value and correctly scale fractional fund units',()=>{
 const r=W.csv('symbol,quantity,average_cost\nINFY,1,80\n101525,2.500,10');
 const x=W.xray(r,{INFY:{ticks:1000000},101525:{ticks:200000}});
 assert.equal(x.total,15000);assert.equal(x.sectors.IT,10000);assert.equal(x.cost,10500);
});
test('annual charges compound on post-growth balance in paise',()=>{
 // Rs 100 with no growth and a 1% annual fee leaves Rs 98.01 after two years.
 assert.deepEqual(W.fee(10000,100,0,0,2),{regular:9801,direct:10000,difference:199});
});
test('historical loss equals original value multiplied by the observed relative fall',()=>{
 assert.equal(W.stress(100000,10000,6500),35000);
 const h=require('../dist/data/nifty-2020.json');assert.equal(W.stress(1236230,h.peak.hundredths,h.trough.hundredths),475205);
});
test('trade comparison uses external cash and leaves original positions intact',()=>{
 const {trade}=require('../dist/return-model'),r=[{id:'A',value:10000},{id:'B',value:10000}],args=[{A:'Banking',B:'Fund'},{A:.4,B:.2},{B:.1}];
 const m=trade(r,'B','Buy',10000,...args);assert.equal(m.before.effective,2);assert.equal(m.after.weight,2/3);assert.equal(m.after.loss,8000);assert.equal(m.after.fee,2000);assert.equal(r[1].value,10000);assert.throws(()=>trade(r,'A','Sell',10001,...args));
});
test('partial historical coverage applies own return to current value and uses the jump guard for unchecked equities',()=>{
 const model=require('../dist/return-model');
 const candles=Array.from({length:70},(_,i)=>({date:new Date(Date.parse('2020-01-14')+i*86400000).toISOString().slice(0,10),close:200-i}));
 const clear={sources:[{actionReview:{from:'2020-01-14',to:'2020-03-23',status:'clear',sourceUrl:'https://www.nseindia.com/'}}],candles};
 const a=model.history([{id:'A',value:10000},{id:'B',value:9000}],{A:clear,B:{candles}});
 assert.equal(a.capital,19000);assert.equal(a.path.at(-1).value,12445);assert.equal(a.included[1].review,'price-jump guard only');
 const risky=candles.map((r,i)=>i===3?{...r,close:100}:r);assert.equal(model.history([{id:'B',value:9000}],{B:{candles:risky}}).excluded[0].why,'suspected adjustment');
 assert.equal(model.history([{id:'101525',value:9000}],{101525:{candles}}).excluded[0].why,'fund attestation missing');
});
test('look-through combines direct and indirect weights and carries the unresolved remainder',()=>{
 const R=require('../dist/return-model'),rows=[{id:'A',value:6000},{id:'F',value:4000}],sectors={A:'Banking',F:'Fund'},w={A:25};
 const e=R.exposure(rows,sectors,w);assert.equal(e.combined.A,7000);assert.equal(e.residual,3000);
 const t=R.trade(rows,'F','Buy',4000,sectors,{A:.4,F:.4},{},w);assert.equal(t.before.weight,.7);assert.equal(t.after.weight,8000/14000);
});
test('stress headline separates observed and assumed amounts, including missing inputs',()=>{
 const {scenarioLoss}=require('../dist/return-model'),a={id:'A',value:10000},b={id:'B',value:3000};
 const mixed=scenarioLoss([a,b],[{...a,fall:-.1}],{},.4);
 assert.equal(mixed.observed,-1000);assert.equal(mixed.assumed,1200);assert.equal(mixed.total,200);
 assert.equal(scenarioLoss([a,b],[],{},.4).total,5200);
 assert.equal(scenarioLoss([a,b],[],{A:0},.4).total,1200);
 assert.equal(scenarioLoss([a],[],{},null).total,null);
 assert.equal(scenarioLoss([a],[{...a,fall:.2}],{},null).total,2000);
 assert.equal(scenarioLoss([],[],{},.4).total,null);
});
```

```text
tandem/tests/existing.test.js
```

```javascript
const test=require('node:test'),assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs');
function session(legacy,key="tandem-v1"){
 const storage=new Map(legacy?[[key,JSON.stringify(legacy)]]:[]);
 const element={addEventListener(){},querySelector(){return null},innerHTML:''};
 const document={documentElement:{},createTreeWalker(){return {nextNode:()=>null}},addEventListener(){},querySelector(){return element},querySelectorAll(){return []}};
 const ctx=vm.createContext({NodeFilter:{SHOW_TEXT:4},document,window:{addEventListener(){}},location:{hash:''},structuredClone,
 sessionStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)}});
 for(const file of ['model','app','language','studio'])vm.runInContext(fs.readFileSync('dist/'+file+'.js','utf8'),ctx);
 return code=>vm.runInContext(code,ctx);
}
test('legacy session carries positions, cash and watchlist into paise ledger',()=>{
 const read=session({cash:3000,hold:{KITE:[3,760.123]},watch:['KITE'],orders:[]});
 assert.equal(read('state.cash'),300000);assert.equal(read('state.hold.KITE[1]'),228037);
 assert.equal(read("fill('KITE',1,'Sell','plan')"),'');assert.equal(read('state.hold.KITE[1]'),152025);
 assert.equal(read('state.cash'),382500);assert.equal(read('state.watch[0]'),'KITE');
 assert.equal(read('state.orders[0].reason'),'plan');
});
test('original views, new views and guarded practice order flow',()=>{
 const read=session();
 assert.equal(read('total().value'),124920);assert.equal(read('total().cost'),115900);
 for(const view of ['dashboard','markets','stock','watchlist','portfolio','order','planner','report','replay','learn'])
 assert.match(read('views.'+view+'("KITE")'),/<h1>/);
 assert.ok(read("invalid('KITE',41,'Sell')"));assert.ok(read("invalid('KITE',1000,'Buy')"));
 assert.equal(read("fill('KITE',2,'Buy','move');state.cash"),6335000);
 assert.equal(read('state.hold.KITE[1]'),3205000);
 assert.equal(read("query='orbit';matches()[0].id"),'ORBI');
 assert.match(read("views.stock('ORBI')"),/Kyun gira/);
 assert.match(read("views.report()"),/Reacting to a price move/);
});
test('Dhairya v2 paise migrate without multiplying twice',()=>{
 const read=session({version:2,cash:253011,hold:{KITE:[2,17502]},watch:['ORBI'],orders:[],language:'hi'},'dhairya-v2');
 assert.equal(read('state.cash'),253011);assert.equal(read('state.hold.KITE[1]'),17502);
 assert.equal(read("save(); JSON.parse(sessionStorage.getItem('tarazu-v1')).watch[0]"),'ORBI');
});
```

```text
tandem/tests/replay.test.js
```

```javascript
const test=require('node:test'),assert=require('node:assert/strict'),D=require('../dist/model');
test('checkpoint sells once, keeps proceeds through recovery',()=>{
 const r=D.freshReplay();r.week=6;D.decide(r,'sell');D.decide(r,'sell');
 assert.equal(r.units,500);assert.equal(r.cash,3250000);assert.equal(D.value(r,12),8450000);
});
test('score is absent until completion, then measures retained exposure',()=>{
 for(const [actions,expected] of [[['hold','hold','hold'],100],[['sell','hold','hold'],50],[['sell','sell','sell'],13]]){
  const r=D.freshReplay();assert.equal(D.score(r),null);
  actions.forEach((a,i)=>{r.week=D.gates[i];D.decide(r,a)});r.week=12;assert.equal(D.score(r),expected);
 }
});
test('reversals count per symbol',()=>assert.equal(D.reversals([{id:'A',side:'Buy'},{id:'B',side:'Sell'},{id:'A',side:'Sell'}]),1));
```

```text
tandem/tests/shell.test.js
```

```javascript
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
test('all linked scripts and styles ship with the static build', () => {
  const html = fs.readFileSync('dist/index.html', 'utf8');
  for (const match of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css))"/g)) assert.ok(fs.existsSync('dist/' + match[1]));
});
```

```text
tandem/tests/sip.test.js
```

```javascript
const test=require('node:test'),assert=require('node:assert/strict'),D=require('../dist/model');
test('month-end timing and compounding in paise',()=>{
 assert.equal(D.future(10000,2,50),20050);assert.equal(D.future(10000,3,0),30000);
 assert.deepEqual(D.sip(80000,1),{payment:80000,best:80000,likely:80000,worst:80000});
});
test('monthly payment is the minimum paise to reach target',()=>{
 const target=8000000,m=D.sip(target,24);assert.ok(m.worst<m.likely&&m.likely<m.best);
 assert.ok(m.likely>=target);assert.ok(D.future(m.payment-1,24,50)<target);
});
test('invalid targets and months fail',()=>{for(const args of [[0,1],[100,0],[100,2.5],[101,121]])assert.throws(()=>D.sip(...args),RangeError)});
```

```text
tandem/tests/tax.test.js
```

```javascript
const test=require('node:test'),assert=require('node:assert/strict'),T=require('../dist/tax');
const lot={q:2,price:10000,date:'2025-11-20'};
test('anniversary stays short, next day is long, including leap anniversary',()=>{
 assert.equal(T.estimate([lot],1,20000,'2026-11-20',0).lines[0].isLong,false);
 assert.equal(T.estimate([lot],1,20000,'2026-11-21',0).lines[0].isLong,true);
 assert.equal(T.longDate('2024-02-29'),'2025-03-01');
});
test('FIFO across long and short lots; allowance applies to long gains only',()=>{
 const v=T.estimate([lot,{q:1,price:5000,date:'2024-04-02'}],2,20000,'2026-11-20',15000);
 // First gain 15000 paise exempt. Remaining gain 10000 at 20% plus 4% cess.
 assert.equal(v.tax,2080);assert.equal(v.later,1300);
});
```

```text
tandem/tests/test-fixture-price.test.mjs
```

```javascript
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
```

```text
tandem/tests/tips.test.js
```

```javascript
const test=require('node:test'),assert=require('node:assert/strict'),T=require('../dist/tips');
test('exact phrases preserved, registry status never inferred',()=>{
 const hits=T.scan('Guaranteed returns! Limited slots. Move to Telegram. 15% daily.');
 assert.deepEqual(hits.map(h=>h.phrase),['Guaranteed returns','Limited slots','Move to Telegram','15% daily']);
 for(const input of ['No guaranteed returns.','INA000000001','Share the annual report.'])assert.deepEqual(T.scan(input),[]);
});
```

```text
tandem/tools/action-review.mjs
```

```javascript
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
```

```text
tandem/tools/data-checklist.mjs
```

```javascript
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
```

```text
tandem/tools/import-prices.mjs
```

```javascript
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
```

```text
tandem/tools/refresh-quotes.mjs
```

```javascript
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
```
