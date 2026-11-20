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
