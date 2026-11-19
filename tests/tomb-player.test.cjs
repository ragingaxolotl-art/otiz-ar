const assert=require('node:assert/strict'),fs=require('node:fs'),P=require('../tomb-player.js');
assert.equal(P.profile.height,1.75);assert.equal(P.profile.eye,1.6);assert(P.profile.eye<P.profile.height);assert(P.profile.visibleBodyTop<P.profile.eye-.12);
assert.equal(P.motion(0,true,false),'idle');assert.equal(P.motion(.95,true,false),'walk');assert.equal(P.motion(1.9,true,false),'run');assert.equal(P.motion(1.9,false,false),'jump');assert.equal(P.motion(.95,true,true),'idle');
const bytes=fs.readFileSync(require.resolve('../assets/characters/girl-explorer-body.glb'));assert.equal(bytes.readUInt32LE(0),0x46546c67);assert.equal(bytes.length,bytes.readUInt32LE(8));const len=bytes.readUInt32LE(12),g=JSON.parse(bytes.subarray(20,20+len));
assert.equal(g.meshes.length,3);assert(g.skins[0].joints.length<100,'Only the necessary weighted joints are uploaded');assert(bytes.length<1_000_000,'The player body should remain lightweight');assert.equal(g.asset.extras.author.startsWith('EvgeshQa'),true);
const names=g.animations.map(a=>a.name);for(const name of ['rig|Idel','rig|Walk','rig|Run','rig|Jump'])assert(names.includes(name));assert(!names.some(n=>n.includes('Attack')));
const jointCount=g.skins[0].joints.length;for(const node of g.nodes){for(const child of node.children||[])assert(child<g.nodes.length);if(node.mesh!==undefined)assert(node.mesh<g.meshes.length);}
const start=28+len,data=bytes.subarray(start);for(const mesh of g.meshes)for(const prim of mesh.primitives){const a=g.accessors[prim.attributes.JOINTS_0],v=g.bufferViews[a.bufferView];for(let i=0;i<a.count*4;i++)assert(data[(v.byteOffset||0)+i]<jointCount,'Every remapped weight must name a live joint');}
console.log('PASS: player motion selection, first-person profile and compact valid rig asset.');
