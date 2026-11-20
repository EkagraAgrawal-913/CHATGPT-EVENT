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
