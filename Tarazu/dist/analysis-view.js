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
