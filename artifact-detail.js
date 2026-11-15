(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ArtifactDetail=api;})(typeof window==='object'?window:globalThis,function(){
 function create({manifest,loadTexture,onStatus=()=>{},anisotropy=1}){
  let active=null,serial=0;
  function clear(){serial++;if(active){for(const e of active.materials){e.object.material=e.original;e.copies.forEach(m=>m.dispose());}active.textures.forEach(t=>t.dispose());active=null;}onStatus('');}
  function focus(item){if(active?.item===item)return active.task;clear();if(!item)return Promise.resolve();const state={item,token:serial,materials:[],textures:new Set()};active=state;onStatus('Loading artifact detail…');
   state.task=(async()=>{try{const data=await manifest,defs=data.artifacts[item.def.id]?.materials;if(!defs)throw Error('No detail available');if(active!==state)return;
    const urls=[...new Set(Object.values(defs).flatMap(d=>Object.values(d).map(t=>t.url)))],textures=new Map();await Promise.all(urls.map(async url=>{const t=await loadTexture(url);if(active!==state){t.dispose();return;}state.textures.add(t);textures.set(url,t);}));if(active!==state)return;
    item.group.traverse(o=>{if(!o.isMesh)return;const original=o.material,copies=(Array.isArray(original)?original:[original]).map(m=>{const settings=defs[m.name];if(!settings)return m;const copy=m.clone();for(const[slot,info]of Object.entries(settings)){const tex=textures.get(info.url),old=m[slot];if(!old)continue;tex.flipY=old.flipY;tex.colorSpace=old.colorSpace;tex.wrapS=old.wrapS;tex.wrapT=old.wrapT;tex.offset.copy(old.offset);tex.repeat.copy(old.repeat);tex.center.copy(old.center);tex.rotation=old.rotation;tex.channel=old.channel;tex.anisotropy=anisotropy;tex.needsUpdate=true;copy[slot]=tex;}copy.needsUpdate=true;return copy;});state.materials.push({object:o,original,copies:copies.filter((m,i)=>m!==(Array.isArray(original)?original:[original])[i])});o.material=Array.isArray(original)?copies:copies[0];});onStatus('Artifact detail: ready');
   }catch(error){if(active===state){for(const e of state.materials){e.object.material=e.original;e.copies.forEach(m=>m.dispose());}state.materials=[];state.textures.forEach(t=>t.dispose());state.textures.clear();onStatus('Standard artifact detail');}}})();return state.task;
  }
  return{focus,clear};
 }
 return{create};
});
