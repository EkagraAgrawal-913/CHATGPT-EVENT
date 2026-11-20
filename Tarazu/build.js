const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function check(dir){for(const name of fs.readdirSync(dir)){const file=path.join(dir,name);if(fs.statSync(file).isDirectory())check(file);else if(name.endsWith('.js'))new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});else if(name.endsWith('.json'))JSON.parse(fs.readFileSync(file,'utf8'))}}
check('dist');
console.log('Static distribution verified.');
