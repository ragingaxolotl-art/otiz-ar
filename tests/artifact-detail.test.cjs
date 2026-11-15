const assert=require('node:assert/strict'),Detail=require('../artifact-detail.js');
module.exports=(async()=>{
 const vector=()=>({copy(){return this;}}),oldMap={flipY:false,colorSpace:'srgb',wrapS:1,wrapT:1,offset:vector(),repeat:vector(),center:vector(),rotation:0,channel:0};
 const makeItem=id=>{const original={name:'gold',map:oldMap,clone(){return{...this,dispose(){this.disposed=true;}};}},mesh={isMesh:true,material:original};return{def:{id},group:{traverse:f=>f(mesh)},mesh,original};};
 const texture=()=>({offset:vector(),repeat:vector(),center:vector(),dispose(){this.disposed=(this.disposed||0)+1;}});
 const manifest=Promise.resolve({artifacts:{a:{materials:{gold:{map:{url:'a'}}}},b:{materials:{gold:{map:{url:'b'}}}}}});
 let first=texture();const a=makeItem('a'),b=makeItem('b'),d=Detail.create({manifest,loadTexture:async()=>first,anisotropy:8});await d.focus(a);assert.notEqual(a.mesh.material,a.original);assert.equal(a.mesh.material.map.flipY,false);assert.equal(a.mesh.material.map.anisotropy,8);d.clear();assert.equal(a.mesh.material,a.original);assert.equal(first.disposed,1);
 let resolveA,late=texture(),current=texture();const race=Detail.create({manifest,loadTexture:url=>url==='a'?new Promise(r=>resolveA=r):Promise.resolve(current)});const task=race.focus(a);await Promise.resolve();await race.focus(b);resolveA(late);await task;assert.equal(late.disposed,1);assert.equal(a.mesh.material,a.original);assert.equal(b.mesh.material.map,current);race.clear();assert.equal(current.disposed,1);
})();
