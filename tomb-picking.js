/* Spatial indexing for exact artifact picking. Visible model buffers stay unchanged. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TombPicking=api;})(typeof window==='object'?window:globalThis,function(){
 'use strict';
 function create({THREE:T,bvh,minTriangles=60000}){
  const prepared=new WeakSet();
  function prepare(root){let meshes=0,triangles=0;root.traverse(mesh=>{
   const geometry=mesh.geometry;if(!mesh.isMesh||mesh.isSkinnedMesh||!geometry?.attributes.position||Object.keys(geometry.morphAttributes||{}).length)return;
   const count=(geometry.index?.count||geometry.attributes.position.count)/3;if(count<minTriangles)return;
   if(!bvh?.MeshBVH)return;
   if(!prepared.has(geometry)){geometry.boundsTree=new bvh.MeshBVH(geometry,{indirect:true,strategy:bvh.CENTER,maxLeafTris:10});prepared.add(geometry);}
   mesh.raycast=bvh.acceleratedRaycast;meshes++;triangles+=count;
  });return{meshes,triangles};}
  function configure(ray){ray.firstHitOnly=true;return ray;}
  return{prepare,configure};
 }
 return{create};
});
