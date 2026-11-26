/* Full-size teaching copies; the innermost coffin never opens. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CoffinExploration=api;})(typeof window==='object'?window:globalThis,function(){
 const stages=['outer','middle','inner'];
 function transition(state,action){
  if(action==='reset')return{stage:0,placed:false,open:false};
  if(action==='place'&&!state.placed)return{...state,placed:true};
  if(action==='slide'&&state.placed&&!state.open&&state.stage<2)return{...state,open:true};
  if(action==='lift'&&state.placed&&state.open&&state.stage<2)return{stage:state.stage+1,placed:false,open:false};
  return state;
 }
 function create({THREE:T,scene,camera,loader,floorAt,clearAt,playerPosition,onStart=()=>{},sound=()=>{},message=()=>{}}){
  const panel=document.getElementById('coffin-exploration'),start=document.getElementById('coffin-explore-start'),status=document.getElementById('coffin-explore-status'),place=document.getElementById('coffin-place'),slide=document.getElementById('coffin-slide'),lift=document.getElementById('coffin-lift'),reset=document.getElementById('coffin-reset'),close=document.getElementById('coffin-explore-close');
  let active=false,busy=false,asset=null,task=null,state=transition({},'reset'),current=null,copies=[],animations=[];const lengths=[2.24,2.04,1.88];
  function ui(){panel.hidden=!active;place.hidden=state.placed;slide.hidden=!state.placed||state.stage===2;slide.disabled=busy||state.open;lift.hidden=!state.open||state.stage===2;for(const b of [place,lift,reset,close])b.disabled=busy;slide.textContent=state.stage===0?'Slide outer lid aside':'Slide middle lid aside';status.textContent=busy?'Moving the lid…':!state.placed?'Carry the '+stages[state.stage]+' coffin to a clear floor area, then choose Place down.':state.stage===2?'Innermost coffin revealed. It stays sealed; no mummy is shown.':state.open?'The next coffin is visible. Choose Lift next coffin to take it out.':'Slide the '+stages[state.stage]+' lid aside to reveal the next coffin.';}
  function bounds(o){o.updateWorldMatrix(true,true);return new T.Box3().setFromObject(o);}
  function makeCopy(stage){
   const source=asset.getObjectByName(['coffin-assembly','middle-coffin-group','innermost-coffin'][stage]);if(!source)throw Error('Coffin component missing');
   const group=new T.Group(),oriented=new T.Group(),model=source.clone(true);model.position.set(0,0,0);model.quaternion.identity();model.scale.set(1,1,1);oriented.add(model);oriented.rotation.x=-Math.PI/2;group.add(oriented);scene.add(group);
   let box=bounds(group),size=box.getSize(new T.Vector3());group.scale.setScalar(lengths[stage]/Math.max(size.x,size.y,size.z));box=bounds(group);const center=box.getCenter(new T.Vector3());group.position.set(-center.x,-box.min.y,-center.z);const holder=new T.Group();scene.add(holder);holder.attach(group);copies.push(holder);return{holder,model,lid:stage<2?model.getObjectByName(stage===0?'outer-lid':'middle-lid'):null};
  }
  function setAt(copy,x,y,z,yaw){copy.holder.position.set(x,y,z);copy.holder.rotation.y=yaw;}
  function preview(){if(!current||state.placed)return;const p=playerPosition(),dir=new T.Vector3();camera.getWorldDirection(dir);dir.y=0;if(dir.lengthSq()<.01)dir.set(0,0,-1);dir.normalize();setAt(current,p.x+dir.x*1.6,p.y+.65,p.z+dir.z*1.6,Math.atan2(dir.x,dir.z));}
  function freeSpot(){
   const p=playerPosition(),dir=new T.Vector3();camera.getWorldDirection(dir);dir.y=0;if(dir.lengthSq()<.01)dir.set(0,0,-1);dir.normalize();const yaw=Math.atan2(dir.x,dir.z);
   for(const distance of [1.8,2.3,2.8])for(const side of [0,-.65,.65]){
    const x=p.x+dir.x*distance+dir.z*side,z=p.z+dir.z*distance-dir.x*side,y=floorAt(x,z,p.y+.45);if(!Number.isFinite(y))continue;
    setAt(current,x,y,z,yaw);const box=bounds(current.holder);if(current.lid){const home=current.lid.position.clone();current.lid.position.x+=1.1;current.lid.position.z+=.10;box.union(bounds(current.holder));current.lid.position.copy(home);}let safe=true;
    for(let i=0;i<=4&&safe;i++)for(let j=0;j<=6&&safe;j++){const px=box.min.x+(box.max.x-box.min.x)*i/4,pz=box.min.z+(box.max.z-box.min.z)*j/6,f=floorAt(px,pz,y+.16);if(!Number.isFinite(f)||Math.abs(f-y)>.12||!clearAt(px,pz,y,.45,.09))safe=false;}
    if(safe&&copies.every(c=>c===current.holder||!box.intersectsBox(bounds(c))))return{x,y,z,yaw};
   }preview();return null;
  }
  async function begin(){if(active||busy)return;busy=true;start.disabled=true;message('Loading the three coffins…');try{onStart();if(!task)task=loader.loadAsync('assets/egypt/models/nested-coffins-ai.glb').catch(e=>{task=null;throw e;});asset=(await task).scene;active=true;state=transition({},'reset');current=makeCopy(0);preview();message('Full-size teaching copy: outer coffin about 2.24 m long. Place it on a clear floor area.');}catch(e){message('The coffins could not load. Try again.');console.error(e);}finally{busy=false;start.disabled=false;ui();}}
  start.onclick=begin;
  place.onclick=()=>{if(busy||state.placed)return;const spot=freeSpot();if(!spot){message('No clear floor space ahead. Move to a more open part of the room and try again.');return;}setAt(current,spot.x,spot.y,spot.z,spot.yaw);state=transition(state,'place');sound('drop',state.stage);ui();};
  slide.onclick=()=>{const next=transition(state,'slide');if(next===state||busy||!current.lid)return;state=next;busy=true;sound('scrape',state.stage);const lid=current.lid,from=lid.position.clone(),to=from.clone();to.x+=1.1;to.z+=.10;animations.push({object:lid,from,to,start:performance.now(),duration:1300,done:()=>{busy=false;ui();}});ui();};
  lift.onclick=()=>{const next=transition(state,'lift');if(next===state||busy)return;current.model.getObjectByName(state.stage===0?'middle-coffin-group':'innermost-coffin').visible=false;state=next;current=makeCopy(state.stage);preview();ui();};
  function cleanup(){animations=[];copies.forEach(c=>scene.remove(c));copies=[];current=null;busy=false;}
  reset.onclick=()=>{if(busy)return;cleanup();state=transition({},'reset');current=makeCopy(0);preview();ui();};
  close.onclick=()=>{if(busy)return;cleanup();active=false;ui();message('Teaching copies returned. The tomb exhibit is unchanged.');};
  function update(time,nearCoffin){start.hidden=active||!nearCoffin;preview();for(const a of animations){const t=Math.min(1,(time-a.start)/a.duration),ease=t*t*(3-2*t);a.object.position.lerpVectors(a.from,a.to,ease);if(t===1){a.done();a.finished=true;}}animations=animations.filter(a=>!a.finished);}
  return{update,get active(){return active;}};
 }
 return{transition,create};
});
