/* Three beam sizes; the small beam preserves the original tomb light. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TombFlashlight=api;})(typeof window!=='undefined'?window:this,function(){
 'use strict';
 const modes=Object.freeze([
  Object.freeze({id:'wide',label:'Wide / weak',intensity:4,distance:18,angle:1.30,penumbra:.95,decay:2}),
  Object.freeze({id:'medium',label:'Medium',intensity:14,distance:16.5,angle:.89,penumbra:.775,decay:2}),
  Object.freeze({id:'small',label:'Small / strong',intensity:24,distance:15,angle:.48,penumbra:.6,decay:2})
 ]);
 function apply(light,index){const mode=modes[index];if(!mode)throw Error('Unknown flashlight mode');
  for(const key of ['intensity','distance','angle','penumbra','decay'])light[key]=mode[key];light.visible=true;
  if(light.shadow){light.shadow.camera.far=mode.distance;light.shadow.camera.updateProjectionMatrix();light.shadow.needsUpdate=true;}
  return mode;
 }
 return{modes,apply,next:index=>(index+1)%modes.length};
});
