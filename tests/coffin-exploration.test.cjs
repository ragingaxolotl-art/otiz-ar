const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {transition}=require('../coffin-exploration.js');
test('students must place each coffin before opening it and can reveal three lids without lifting the wrapped mummy',()=>{
 let s=transition({},'reset');assert.deepEqual(s,{stage:0,placed:false,open:false});
 assert.equal(transition(s,'slide'),s);assert.equal(transition(s,'lift'),s);
 for(let stage=0;stage<2;stage++){
  s=transition(s,'place');assert.equal(s.stage,stage);assert.equal(transition(s,'lift'),s);
  s=transition(s,'slide');assert.equal(s.open,true);assert.equal(transition(s,'slide'),s);
  s=transition(s,'lift');assert.deepEqual(s,{stage:stage+1,placed:false,open:false});
 }
 s=transition(s,'place');s=transition(s,'slide');assert.equal(s.open,true);assert.equal(s.stage,2);assert.equal(transition(s,'lift'),s);
 assert.deepEqual(transition(s,'reset'),{stage:0,placed:false,open:false});
});
test('real assembly has independently removable outer and middle lids and a sealed inner mesh',()=>{
 const b=fs.readFileSync('assets/egypt/models/nested-coffins-ai.glb'),d=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)).toString());
 const node=name=>d.nodes.find(n=>n.name===name);
 for(const name of ['coffin-assembly','outer-lid','middle-coffin-group','middle-lid','innermost-coffin'])assert.ok(node(name),name);
 assert.ok(Number.isInteger(node('innermost-coffin').mesh));assert.equal(node('innermost-coffin').children,undefined);
 assert.ok(node('middle-coffin-group').children.includes(d.nodes.indexOf(node('middle-lid'))));
});
