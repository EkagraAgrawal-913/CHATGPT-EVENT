const test=require('node:test'),assert=require('node:assert/strict'),T=require('../dist/tips');
test('exact phrases preserved, registry status never inferred',()=>{
 const hits=T.scan('Guaranteed returns! Limited slots. Move to Telegram. 15% daily.');
 assert.deepEqual(hits.map(h=>h.phrase),['Guaranteed returns','Limited slots','Move to Telegram','15% daily']);
 for(const input of ['No guaranteed returns.','INA000000001','Share the annual report.'])assert.deepEqual(T.scan(input),[]);
});
