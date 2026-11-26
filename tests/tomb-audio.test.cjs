const {test}=require('node:test'),assert=require('node:assert/strict'),{stride}=require('../tomb-audio.js');
test('footsteps follow actual grounded travel, not idle input or teleportation',()=>{
 let s={distance:0};for(let i=0;i<6;i++){s=stride(s,.1,true);assert.equal(s.step,false);}s=stride(s,.1,true);assert.equal(s.step,true);assert.ok(s.distance<.1);
 assert.equal(stride({distance:.61},0,true).step,false);assert.equal(stride({distance:.61},.1,false).step,false);assert.deepEqual(stride({distance:.61},3,true),{distance:0,step:false});assert.equal(stride({distance:.4},.1,true,true).step,true);
});
