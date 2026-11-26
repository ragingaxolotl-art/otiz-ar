/* Girl explorer first-person body. Physics/camera remain authoritative. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TombPlayer=api;})(typeof window!=='undefined'?window:this,()=>{'use strict';
 const profile={height:1.75,eye:1.60,crouch:1.0,radius:.24,visibleBodyTop:1.42};
 function motion(speed,grounded,crouched){return !grounded?'jump':speed>1.4&&!crouched?'run':speed>.08?'walk':'idle';}
 function create({THREE:T,scene,camera,renderer,status=()=>{}}){
  const pivot=new T.Group(),stance=new T.Group(),direction=new T.Vector3(),point=new T.Vector3(),clip=new T.Plane(new T.Vector3(0,-1,0),0);pivot.name='Explorer player body';pivot.add(stance);pivot.visible=false;scene.add(pivot);renderer.localClippingEnabled=true;
  let ready=false,enabled=true,footSamples=[],last=null,metrics=null,lastStatus='',mixer=null,actions={},currentState='idle',activeAction=null,modelRoot=null,hipBone=null,hipRest=null;
  async function load(){try{
   status('Loading explorer body…');const g=await new T.GLTFLoader().loadAsync('assets/characters/girl-explorer-body.glb?v=2'),model=g.scene;stance.add(model);
   // Keep the source skin and rig live so the supplied gait deforms body and clothing together.
   modelRoot=model;mixer=new T.AnimationMixer(model);
   for(const [state,pattern]of Object.entries({idle:/idel|idle/i,walk:/walk/i,run:/run/i,jump:/jump/i})){const clip=g.animations.find(c=>pattern.test(c.name));if(!clip)throw Error('Explorer '+state+' clip is missing');actions[state]=mixer.clipAction(clip);}
   activeAction=actions.idle;activeAction.play();mixer.update(.01);model.updateMatrixWorld(true);hipBone=model.getObjectByName('DEF-spine_021');hipRest=hipBone?.position.clone();
   const skins=[];model.traverse(o=>{if(o.isSkinnedMesh)skins.push(o);});
   for(const body of skins){
    if(body.name!=='Object_42')continue;const p=body.geometry.attributes.position,j=body.geometry.attributes.skinIndex,w=body.geometry.attributes.skinWeight;
    for(let i=0;i<p.count;i++){let foot=0;for(let k=0;k<4;k++)if(/DEF-(foot|toe)/.test(body.skeleton.bones[j.getComponent(i,k)]?.name||''))foot+=w.getComponent(i,k);if(foot>.5)footSamples.push({mesh:body,index:i});}
   }
   model.updateMatrixWorld(true);
   const box=new T.Box3().setFromObject(model,true),size=box.getSize(new T.Vector3()),hip=model.getObjectByName('DEF-spine_021');if(!Number.isFinite(size.y)||size.y<.1)throw Error('Invalid body bounds');const center=hip?hip.getWorldPosition(new T.Vector3()):box.getCenter(new T.Vector3()),scale=profile.visibleBodyTop/size.y;
   model.scale.multiplyScalar(scale);model.position.set(-center.x*scale,-box.min.y*scale,-center.z*scale);model.updateMatrixWorld(true);
   model.traverse(o=>{if(!o.isMesh)return;o.frustumCulled=false;o.castShadow=false;const materials=Array.isArray(o.material)?o.material:[o.material];for(const m of materials){m.clippingPlanes=[clip];m.clipShadows=true;m.side=T.FrontSide;}});
   if(!footSamples.length)throw Error('Body feet are missing');metrics={presentation:'animated first-person rig',referenceHeight:profile.height,eyeHeight:profile.eye,visibleBodyTop:profile.visibleBodyTop,scale,footSamples:footSamples.length};ready=true;status('Girl explorer body active · '+profile.height.toFixed(2)+' m reference height');
  }catch(error){status('Explorer body could not load; walking and artifact controls remain available.');console.warn('Explorer body unavailable',error);}}
  function update(dt,{x,z,feet,height,grounded,crouched,started,paused=false}){
   pivot.visible=ready&&enabled&&started;if(!pivot.visible){last={x,z};return;}
   const distance=last?Math.hypot(x-last.x,z-last.z):0,speed=dt>0&&distance<.5?distance/dt:0;last={x,z};const state=motion(paused?0:speed,grounded,crouched);if(state!==currentState){const next=actions[state];next.reset().play();activeAction.crossFadeTo(next,.16,false);activeAction=next;currentState=state;}mixer.timeScale=state==='walk'?Math.max(.55,Math.min(1.5,speed/.95)):state==='run'?Math.max(.7,Math.min(1.35,speed/1.9)):1;if(!paused)mixer.update(Math.min(dt,.05));if(hipBone&&hipRest){hipBone.position.x=hipRest.x;hipBone.position.z=hipRest.z;}const description=crouched?'crouched · '+state:state;if(description!==lastStatus){lastStatus=description;status('Girl explorer body active · '+description+' · '+profile.height.toFixed(2)+' m reference height');}
   camera.getWorldDirection(direction);const heading=Math.atan2(-direction.x,-direction.z);pivot.rotation.y=heading+Math.PI;pivot.position.set(x+Math.sin(heading)*.44,feet,z+Math.cos(heading)*.44);stance.scale.setScalar(1);clip.constant=camera.position.y-.18;pivot.updateMatrixWorld(true);modelRoot.traverse(o=>{if(o.isSkinnedMesh)o.skeleton.update();});
   // Pin the lowest sole sample to the physical feet, including drops/jumps.
   // Sample the animated soles so gait and jumps remain aligned with the physical floor.
   let low=Infinity;for(const sample of footSamples){sample.mesh.getVertexPosition(sample.index,point);sample.mesh.localToWorld(point);low=Math.min(low,point.y);}if(Number.isFinite(low)){pivot.position.y+=feet-low;pivot.updateMatrixWorld(true);}
  }
  return{load,update,setVisible(value){enabled=!!value;if(!enabled)pivot.visible=false;},reset(){last=null;},get ready(){return ready;},get metrics(){return metrics;},get state(){return ready?currentState:'loading';}};
 }
 return{profile,motion,create};
});
