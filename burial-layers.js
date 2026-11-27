/* Four Meshy shrines around the existing sarcophagus and the three-coffin assembly. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.BurialLayers=api;})(typeof window==='object'?window:globalThis,function(){
 'use strict';
 const layers=[
  {id:'burial-shrine-207-ai',name:'Outermost shrine',carter:'207'},
  {id:'burial-shrine-237-ai',name:'Second shrine',carter:'237'},
  {id:'burial-shrine-238-ai',name:'Third shrine',carter:'238'},
  {id:'burial-shrine-239-ai',name:'Innermost shrine',carter:'239'},
  {id:'stone-sarcophagus',name:'Stone sarcophagus',carter:'240'},
  {id:'nested-coffins-ai',name:'Three nested coffins',carter:'253–255'}
 ];
 function stageFor(id){const i=layers.findIndex(l=>l.id===id);return i<0?0:i;}
 function create({THREE:T,scene,onChange=()=>{},onReveal=()=>{},onDoors=()=>{},message=()=>{}}={}){
  const $=id=>document.getElementById(id),panel=$('burial-layer-panel'),start=$('burial-layer-start'),status=$('burial-layer-status'),next=$('burial-layer-next'),previous=$('burial-layer-previous'),reset=$('burial-layer-reset'),close=$('burial-layer-close');
  let stage=0,opened=false,ready=false,coffinsActive=false,shrines=[],stone=[],coffins=null,doors=[],doorsOpen=false;
  const openDoors=$('burial-layer-open');
  function setDoors(value){doorsOpen=!!value;doors.forEach((d,i)=>{d.rotation.y=(i===0?-1:1)*(doorsOpen?Math.PI*.52:0);});visibility();onChange();onDoors(doorsOpen);ui();}
  function ui(){
   panel.hidden=!opened;const layer=layers[stage];
   status.textContent=(stage+1)+' / '+layers.length+' · '+layer.name+' · Carter '+layer.carter;
   next.textContent=stage<layers.length-1?'Reveal '+layers[stage+1].name.toLowerCase():'Three coffins revealed';
   next.disabled=coffinsActive||stage===layers.length-1||stage===0&&!doorsOpen;previous.disabled=coffinsActive||stage===0;reset.disabled=coffinsActive;
   openDoors.hidden=stage!==0;openDoors.disabled=coffinsActive;openDoors.textContent=doorsOpen?'Close outer shrine doors':'Open outer shrine doors';
   $('burial-layer-hint').textContent=coffinsActive?'Return the coffin copies before changing the outer layers.':stage===5?'Choose Explore nested coffins to open the three coffins and see the wrapped mummy.':stage===0?'Open the east-facing double doors to see the second shrine nested inside. Then remove each enclosure in order.':'Reveal each enclosing layer to see what was inside it. Restore all closes the doors and returns the four shrines to their nested positions.';
  }
  function visibility(){
   // Closed shells conceal their contents. Keep every object at its nested
   // transform, but cull enclosed layers until revealed to avoid drawing
   // unseen surfaces through approximate generated roof and wall profiles.
   shrines.forEach((e,i)=>{e.group.visible=i===stage||stage===0&&doorsOpen&&i===1;});
   stone.forEach(({object,visible})=>{object.visible=visible&&stage===4;});
   if(coffins)coffins.group.visible=stage>=4&&!coffinsActive;
  }
  function setStage(value){
   if(!ready||coffinsActive)return;
   stage=Math.max(0,Math.min(layers.length-1,value));if(stage===0){doorsOpen=false;doors.forEach(d=>d.rotation.y=0);}visibility();onChange();onReveal(stage);ui();
   message(layers[stage].name+' · Carter '+layers[stage].carter);
  }
  start.onclick=()=>{opened=true;ui();};close.onclick=()=>{opened=false;ui();};
  next.onclick=()=>setStage(stage+1);previous.onclick=()=>setStage(stage-1);reset.onclick=()=>setStage(0);
  openDoors.onclick=()=>setDoors(!doorsOpen);
  function attach(exhibits,tomb){
   shrines=layers.slice(0,4).map(l=>exhibits.find(e=>e.def.id===l.id));coffins=exhibits.find(e=>e.def.id==='nested-coffins-ai');
   if(shrines.some(e=>!e?.ready)||!coffins?.ready)throw Error('Burial assembly is incomplete');
   // The teacher's new outer shrine is split into actual textured door leaves.
   // Keep their hinges at the east end; inner enclosures retain the same centre.
   doors=[];for(const [name,x]of [['shrine-door-left',-1.57],['shrine-door-right',1.57]]){const leaf=shrines[0].model.getObjectByName(name);if(!leaf)throw Error('Outermost shrine door missing: '+name);const hinge=new T.Group();hinge.name=name+'-hinge';hinge.position.set(x,0,2.40);leaf.parent.add(hinge);hinge.add(leaf);leaf.position.sub(hinge.position);doors.push(hinge);}
   stone=[];tomb.traverse(object=>{if(object.isMesh&&(Array.isArray(object.material)?object.material:[object.material]).some(m=>m.name.startsWith('King-tut-stone_sarc')||m.name==='Granite_Brown'))stone.push({object,visible:object.visible});});
   if(!stone.length)throw Error('Existing stone sarcophagus was not found');
   // Align the stone surfaces with Carter’s east–west burial axis and fit
   // the existing coffin assembly. Transform only its stone surfaces;
   // the tomb walls and their textures stay in their published state.
   const bounds=new T.Box3();stone.forEach(s=>bounds.union(new T.Box3().setFromObject(s.object)));
   // Some inner stone faces share the structural room material. Separate only
   // triangles wholly within the original sarcophagus footprint, retaining the
   // floor and every triangle belonging to the surrounding room.
   const region=bounds.clone().expandByScalar(.06),parts=[],point=new T.Vector3();
   tomb.traverse(object=>{
    if(!object.isMesh||(Array.isArray(object.material)?object.material:[object.material]).every(m=>m.name!=='material_0'))return;
    object.updateWorldMatrix(true,false);const source=object.geometry,pos=source.attributes.position,index=source.index,count=index?index.count:pos.count,inside=[],outside=[],localBounds=new T.Box3();
    for(let i=0;i<count;i+=3){const ids=[0,1,2].map(k=>index?index.getX(i+k):i+k),points=ids.map(id=>point.fromBufferAttribute(pos,id).clone().applyMatrix4(object.matrixWorld));
     const take=points.every(p=>region.containsPoint(p)&&p.y>=bounds.min.y-.015)&&Math.max(...points.map(p=>p.y))>bounds.min.y+.08;
     (take?inside:outside).push(...ids);if(take)ids.forEach(id=>localBounds.expandByPoint(point.fromBufferAttribute(pos,id)));
    }
    if(!inside.length)return;
    const remaining=source.clone();remaining.setIndex(outside);remaining.clearGroups();object.geometry=remaining;
    const geometry=source.clone();geometry.setIndex(inside);geometry.clearGroups();geometry.boundingBox=localBounds;geometry.boundingSphere=localBounds.getBoundingSphere(new T.Sphere());
    const part=new T.Mesh(geometry,object.material);part.name='sarcophagus-inner-surfaces';part.position.copy(object.position);part.quaternion.copy(object.quaternion);part.scale.copy(object.scale);part.castShadow=true;part.receiveShadow=true;parts.push({parent:object.parent,object:part,visible:object.visible});
   });
   parts.forEach(s=>{s.parent.add(s.object);stone.push(s);});
   const bottom=bounds.min.y,pivot=new T.Group();pivot.name='aligned-stone-sarcophagus';pivot.position.copy(bounds.getCenter(new T.Vector3()));scene.add(pivot);
   stone.forEach(s=>pivot.attach(s.object));pivot.rotation.y=0;pivot.updateWorldMatrix(true,true);
   const rotated=new T.Box3().setFromObject(pivot).getSize(new T.Vector3());pivot.scale.set(1.48/rotated.x,1.62/rotated.y,2.76/rotated.z);pivot.updateWorldMatrix(true,true);
   pivot.position.y+=bottom-new T.Box3().setFromObject(pivot).min.y;pivot.position.x=-3.3765;pivot.position.z=-3.3678;pivot.updateWorldMatrix(true,true);
   ready=true;visibility();onChange();ui();
  }
  function open(id){if(id)setStage(stageFor(id));opened=true;ui();}
  function update(near,active){
   if(coffinsActive!==active){coffinsActive=active;visibility();ui();}
   if(opened&&(!near||coffinsActive)){opened=false;ui();}
   start.hidden=!ready||!near||opened||coffinsActive;
  }
  return {attach,open,update,reveal:id=>setStage(stageFor(id)),reset:()=>setStage(0),get stage(){return stage;},get doorsOpen(){return doorsOpen;},get doors(){return doors;},get coffinsVisible(){return ready&&stage===5;},get ready(){return ready;},get layers(){return layers;},get stoneObjects(){return stone.map(s=>s.object);}};
 }
 return {layers,stageFor,create};
});
