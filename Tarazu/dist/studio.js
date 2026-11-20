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
