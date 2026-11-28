/* Nested canopic equipment: removable wooden enclosures and a lift-off calcite lid. */
(function(root){'use strict';
 const names=['Carter 266 · Canopy and four protective goddesses','Carter 266a · Gilded wooden canopic shrine','Carter 266b · Calcite canopic chest','Carter 266b · Four head-shaped canopic stoppers'];
 function create({THREE:T,loader,message=()=>{},onChange=()=>{}}){
  const root=new T.Group();root.name='nested-canopic-equipment';
  const parts={},homes={},starts={},targets={},collected=new Set();let maxStage=0,stage=0,opened=false,animationStart=0,moving=false,ready=false;
  const $=id=>document.getElementById(id),panel=$('canopic-contents'),status=$('canopic-status'),next=$('canopic-next'),previous=$('canopic-previous');
  function collect(scene,prefix){const g=new T.Group();g.name=prefix;const meshes=[];scene.traverse(o=>{if(o.isMesh&&o.name.startsWith(prefix))meshes.push(o)});meshes.forEach(o=>g.attach(o));return g;}
  function fit(group,dimensions,bottom=0){const box=new T.Box3().setFromObject(group),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());group.scale.set(...dimensions.map((n,i)=>n/size.getComponent(i)));group.position.set(-center.x*group.scale.x,bottom-box.min.y*group.scale.y,-center.z*group.scale.z);return group;}
  function save(){for(const[k,p]of Object.entries(parts)){root.add(p);homes[k]=p.position.clone();targets[k]=p.position.clone();}}
  function ui(){if(!panel)return;panel.hidden=!opened;status.textContent=names[stage];next.textContent=['Open outer canopy','Open wooden shrine','Lift calcite lid','Four stoppers revealed'][stage];next.disabled=stage===3||moving;previous.disabled=stage===0||moving;$('canopic-reset').disabled=moving;$('canopic-hint').textContent=stage===3?'The four head-shaped stoppers closed the compartments holding the king’s internal organs.':stage===2?'The stone lid lifts off; it has no hinges.':stage===1?'The wooden shrine is bottomless and lifts away from the calcite chest.':'The canopy and four goddesses surround the gilded wooden shrine. Remove the enclosures in order.';}
  function setStage(value,instant=false){
   if(!ready||moving&&!instant)return;stage=Math.max(0,Math.min(3,value));maxStage=Math.max(maxStage,stage);
   const shifts={canopy:stage>=1?[-1.55,.35,0]:[0,0,0],wood:stage>=2?[1.25,.45,0]:[0,0,0],chest:[0,0,0],heads:stage>=3?[0,.16,0]:[0,0,0],lid:stage>=3?[0,.72,.55]:[0,0,0]};
   for(const[k,p]of Object.entries(parts)){starts[k]=p.position.clone();targets[k]=homes[k].clone().add(new T.Vector3(...shifts[k]));if(instant)p.position.copy(targets[k]);}
   moving=!instant;animationStart=performance.now();ui();onChange();if(!instant)message(names[stage]);
  }
  async function init(){
   const [gold,stone]=await Promise.all([loader.loadAsync('assets/egypt/models/canopic-shrine-ai.glb'),loader.loadAsync('assets/egypt/models/canopic-chest-opening.glb')]);
   parts.canopy=fit(collect(gold.scene,'canopic-canopy'),[1.22,1.98,1.65]);
   parts.wood=fit(collect(gold.scene,'canopic-wooden-shrine'),[.90,1.36,.90],.11);
   parts.chest=collect(stone.scene,'calcite-chest-body');parts.heads=collect(stone.scene,'canopic-head-stoppers');parts.lid=collect(stone.scene,'calcite-chest-lid');
   const box=new T.Box3().setFromObject(parts.chest),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3()),scale=new T.Vector3(.80/size.x,.82/size.y,.80/size.z);
   for(const k of ['chest','heads']){parts[k].scale.copy(scale);parts[k].position.set(-center.x*scale.x,.13-box.min.y*scale.y,-center.z*scale.z);}
   // In the museum display the stoppers are raised above the box. Seat them
   // beneath its lid for the closed teaching assembly, then raise them to study.
   parts.heads.position.y-=.22;
   fit(parts.lid,[.80,.15,.80],.96);save();ready=true;setStage(0,true);return root;
  }
  next.onclick=()=>setStage(stage+1);previous.onclick=()=>setStage(stage-1);$('canopic-reset').onclick=()=>setStage(0);$('canopic-close').onclick=()=>$('put-back').click();
  function collectTarget(){if(maxStage<3)return null;const defs=[{key:'heads',id:'canopic-heads',name:'Four head-shaped canopic stoppers',parts:['heads']},{key:'chest',id:'canopic-chest',name:'Calcite canopic chest and lid',parts:['chest','lid']},{key:'wood',id:'canopic-wood',name:'Gilded wooden canopic shrine',parts:['wood']},{key:'canopy',id:'canopic',name:'Canopy and four protective goddesses',parts:['canopy']}],def=defs.find(d=>!collected.has(d.key));if(!def)return null;const source=new T.Group();for(const key of def.parts)source.add(parts[key].clone(true));return{...def,room:'treasury',source};}
  return{root,parts,init,collectTarget,collect(key){const target=collectTarget();if(!target||target.key!==key)return false;collected.add(key);for(const k of target.parts)parts[k].visible=false;onChange();return true;},get empty(){return collected.has('heads')&&collected.has('chest')&&collected.has('wood');},get complete(){return collected.has('canopy');},open(){opened=true;ui();},close(){opened=false;moving=false;setStage(0,true);ui();},update(time){if(!moving)return;const t=Math.min(1,(time-animationStart)/650),ease=t*t*(3-2*t);for(const[k,p]of Object.entries(parts))p.position.lerpVectors(starts[k],targets[k],ease);if(t===1){moving=false;ui();onChange();}},get stage(){return stage;},get selectedName(){return names[stage];},get ready(){return ready;},setStage};
 }
 root.CanopicAssembly={create,names};
})(window);
