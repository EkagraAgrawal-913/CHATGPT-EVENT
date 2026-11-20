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
