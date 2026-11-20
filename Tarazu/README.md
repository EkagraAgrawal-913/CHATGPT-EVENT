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
