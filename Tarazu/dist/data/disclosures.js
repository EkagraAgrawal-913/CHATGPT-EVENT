const IndexWeights={"HDFCBANK": 9.95, "ICICIBANK": 9.39, "RELIANCE": 7.3, "BHARTIARTL": 5.63, "LT": 4.25, "INFY": 3.92, "SBIN": 3.73, "AXISBANK": 3.28, "KOTAKBANK": 3.19, "BAJFINANCE": 2.4};
const WeightSource={"sourceUrl": "https://www.niftyindices.com/Factsheet/ind_nifty50.pdf", "asOf": "2026-10-30", "licenceNote": "Selected factual top-ten weights attributed to NSE Indices Limited. No licence to redistribute the full factsheet is asserted."};
const hdfcTER={reg:.41,dir:.26,date:'September 2026',url:'https://files.hdfcfund.com/s3fs-public/Others/2026-10/Fund%20Facts%20-%20HDFC%20NIFTY%2050%20Index%20Fund_Oct%2026.pdf'};
const utiTER={reg:.37,dir:.25,date:'31 July 2026',url:'https://www.utimf.com/static/digitalfactsheet/august2026/Index-fund/UTI-NIFTY-50-INDEX-FUND.html'};
const PublishedTER={101525:hdfcTER,119063:hdfcTER,100822:utiTER,120716:utiTER};
function feeDefaults(lots){return Object.fromEntries(lots.filter(r=>PublishedTER[r.id]).map(r=>[r.id,{reg:PublishedTER[r.id].reg,dir:PublishedTER[r.id].dir,growth:8,years:20}]))}
