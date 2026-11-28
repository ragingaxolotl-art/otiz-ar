/* Cabinet 403 and its four headrests. Shared by the game and collection viewer. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.HeadrestCabinet=api;})(typeof window==='object'?window:globalThis,function(){
 'use strict';
 const items=[
  {id:'headrest-blue',carter:'403a',name:'Carter 403a · Turquoise glass headrest',file:'403a-turquoise-glass-headrest.glb'},
  {id:'headrest-azure',carter:'403b',name:'Carter 403b · Dark-blue faience headrest',file:'403b-dark-blue-faience-headrest.glb'},
  {id:'headrest-ai',carter:'403c',name:'Carter 403c · Ivory headrest with Shu and lions',file:'403c-ivory-headrest-shu-and-lions.glb'},
  {id:'headrest-folding',carter:'403d',name:'Carter 403d · Folding ivory headrest with Bes faces',file:'403d-folding-ivory-headrest.glb'}
 ];
 function transition(state,action,id){
  if(action==='close')return{open:false,selected:'box'};
  if(action==='open')return{open:true,selected:'box'};
  if(action==='select'&&state.open&&(id==='box'||items.some(item=>item.id===id)))return{open:true,selected:id};
  return state;
 }
 function create({THREE:T,loader=new T.GLTFLoader(),baseUrl='assets/egypt/models/',onChange=()=>{},onStatus=()=>{}}){
  const root=new T.Group(),boxHolder=new T.Group(),floating=new T.Group(),mainHolder=new T.Group();root.name='Carter-403-collection';root.add(boxHolder,floating,mainHolder);boxHolder.userData.cabinetItem='box';
  const collected=new Set(),entries=new Map(),requests=new Map(),ray=new T.Raycaster();ray.layers.enableAll();
  let state={open:false,selected:'box'},hinge=null,loaded=false,lastTime=0,revealAt=0,main=null,disposed=false;
  const boxDetail={def:{id:'headrest-cabinet'},group:boxHolder};
  function changed(){onChange({...state,ready:loaded,items:items.map(i=>({...i,ready:entries.has(i.id)}))});}
  function load(file){if(!requests.has(file))requests.set(file,loader.loadAsync(baseUrl+file).catch(e=>{requests.delete(file);throw e;}));return requests.get(file);}
  function normalize(source,length){const holder=new T.Group(),model=source.clone(true);model.updateMatrixWorld(true);const b=new T.Box3().setFromObject(model,true),dims=b.getSize(new T.Vector3()),center=b.getCenter(new T.Vector3());model.position.sub(center);holder.add(model);holder.scale.setScalar(length/Math.max(dims.x,dims.y,dims.z));holder.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});return holder;}
  function showMain(id){mainHolder.clear();main=null;if(id==='box')return;const entry=entries.get(id);if(!entry)return;const group=normalize(entry.source,.58);mainHolder.add(group);mainHolder.position.set(.1,.50,.35);mainHolder.rotation.set(0,0,0);mainHolder.scale.setScalar(1);mainHolder.userData.cabinetItem=id;main={def:entry.def,group:mainHolder};}
  async function loadContents(){await Promise.all(items.map(async(def,index)=>{if(entries.has(def.id))return;try{const gltf=await load(def.file);if(disposed)return;const group=normalize(gltf.scene,.245);group.userData.cabinetItem=def.id;group.visible=false;floating.add(group);const ring=new T.Mesh(new T.RingGeometry(.115,.125,40),new T.MeshBasicMaterial({color:0xe8c77e,side:T.DoubleSide,transparent:true,opacity:.7}));ring.rotation.x=-Math.PI/2;ring.position.y=-.095;group.add(ring);entries.set(def.id,{def,source:gltf.scene,group,index,readyAt:lastTime,progress:0,scale:group.scale.x,ring});changed();}catch(e){onStatus(def.name+' could not load. Select the box to retry.');console.error(e);}}));}
  async function init(){if(loaded)return root;onStatus('Loading Carter 403…');const gltf=await load('403-headrest-cabinet.glb');if(disposed)return root;boxHolder.add(gltf.scene);hinge=gltf.scene.getObjectByName('lid-hinge');if(!hinge)throw Error('Cabinet hinge is missing');hinge.rotation.x=0;loaded=true;onStatus('Select the box to reveal its four headrests.');changed();return root;}
  function open(){if(!loaded)return false;const wasOpen=state.open;state=transition(state,'open');if(!wasOpen)revealAt=lastTime+1250;showMain('box');loadContents();changed();return true;}
  function select(id){if(id==='box')return open();if(!state.open||!entries.has(id)||collected.has(id))return false;state=transition(state,'select',id);showMain(id);onStatus(items.find(i=>i.id===id).name+' · drag to turn and scroll to zoom.');changed();return true;}
  function close(){state=transition(state,'close');showMain('box');changed();}
  function visible(object){for(let o=object;o;o=o.parent)if(!o.visible)return false;return true;}
  function hit(point,camera){root.updateWorldMatrix(true,true);ray.setFromCamera(point,camera);for(const h of ray.intersectObject(root,true)){if(!visible(h.object))continue;for(let o=h.object;o&&o!==root;o=o.parent)if(o.userData.cabinetItem)return o.userData.cabinetItem;}return null;}
  function update(time,dt){lastTime=time;const ease=1-Math.exp(-Math.min(.1,dt)*8);if(hinge)hinge.rotation.x+=((state.open?-105*Math.PI/180:0)-hinge.rotation.x)*ease;
   const inspecting=state.selected!=='box',boxScale=inspecting?.58:1;boxHolder.scale.lerp(new T.Vector3(boxScale,boxScale,boxScale),ease);boxHolder.position.lerp(new T.Vector3(inspecting?-.36:0,0,inspecting?-.12:0),ease);
   for(const e of entries.values()){const t=state.open?Math.max(0,Math.min(1,(time-Math.max(revealAt+e.index*140,e.readyAt))/700)):0;const desired=t*t*(3-2*t);e.progress+=(desired-e.progress)*ease;e.group.visible=!collected.has(e.def.id)&&e.progress>.005;e.group.position.set((e.index-1.5)*.31,.43+.42*e.progress+(e.progress>.99?Math.sin(time*.0018+e.index)*.012:0),.10);e.group.scale.setScalar(e.scale*Math.max(.001,e.progress));e.ring.material.color.set(e.def.id===state.selected?0xffffff:0xe8c77e);}
   // Loaded copies inherit the inspection pass when the cabinet is carried.
   root.traverse(o=>o.layers.mask=root.layers.mask);
  }
  function rotate(dx,dy){if(main){mainHolder.rotation.y+=dx;mainHolder.rotation.x+=dy;return true;}return false;}
  function zoom(delta){if(!main)return false;mainHolder.scale.setScalar(Math.max(.4,Math.min(2.2,mainHolder.scale.x*Math.exp(-delta*.001))));return true;}
  function dispose(){disposed=true;root.removeFromParent();requests.clear();entries.clear();}
  return{root,init,open,select,close,hit,update,collect(id){if(!entries.has(id)||collected.has(id))return false;collected.add(id);entries.get(id).group.visible=false;state={...state,selected:'box'};showMain('box');changed();return true;},get empty(){return items.every(i=>collected.has(i.id));},rotate,zoom,dispose,inspectTarget:()=>main||boxDetail,get state(){return{...state}},get ready(){return loaded},get selectedName(){return state.selected==='box'?'Carter 403 · Headrest cabinet':items.find(i=>i.id===state.selected)?.name;},get items(){return items.map(i=>({...i,ready:entries.has(i.id),collected:collected.has(i.id)}));}};
 }
 return{items,transition,create};
});
