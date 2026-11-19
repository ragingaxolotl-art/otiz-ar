/* Girl explorer first-person body. Physics/camera remain authoritative. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TombPlayer=api;})(typeof window!=='undefined'?window:this,()=>{'use strict';
 const profile={height:1.75,eye:1.60,crouch:1.0,radius:.24,visibleBodyTop:1.42};
 function motion(speed,grounded,crouched){return !grounded?'jump':crouched?'idle':speed>1.4?'run':speed>.08?'walk':'idle';}
 function create({THREE:T,scene,camera,renderer,status=()=>{}}){
  const pivot=new T.Group(),stance=new T.Group(),direction=new T.Vector3(),point=new T.Vector3(),clip=new T.Plane(new T.Vector3(0,-1,0),0);pivot.name='Explorer player body';pivot.add(stance);pivot.visible=false;scene.add(pivot);renderer.localClippingEnabled=true;
  let ready=false,enabled=true,mixer=null,actions={},active=null,footSamples=[],last=null,metrics=null,lastStatus='';
  function action(name,speed){const next=actions[name]||actions.idle;if(next&&next!==active){const previous=active;next.reset().play();if(previous)previous.crossFadeTo(next,.14,false);active=next;}if(active)active.timeScale=name==='walk'?Math.min(2,Math.max(.5,speed/.8)):name==='run'?Math.min(1.6,Math.max(.65,speed/1.8)):1;}
  async function load(){try{
   status('Loading explorer body…');const g=await new T.GLTFLoader().loadAsync('assets/characters/girl-explorer-body.glb?v=2'),model=g.scene;stance.add(model);mixer=new T.AnimationMixer(model);
   for(const [name,pattern]of Object.entries({idle:/idel|idle/i,walk:/walk/i,run:/run/i,jump:/jump/i})){const c=g.animations.find(c=>pattern.test(c.name));if(c){const a=mixer.clipAction(c);if(name==='jump'){a.setLoop(T.LoopOnce,1);a.clampWhenFinished=true;}actions[name]=a;}}
   action('idle',0);mixer.update(.01);model.updateMatrixWorld(true);
   const box=new T.Box3().setFromObject(model,true),size=box.getSize(new T.Vector3()),hip=model.getObjectByName('DEF-spine_021');if(!Number.isFinite(size.y)||size.y<.1)throw Error('Invalid body bounds');const center=hip?hip.getWorldPosition(new T.Vector3()):box.getCenter(new T.Vector3()),scale=profile.visibleBodyTop/size.y;
   model.scale.multiplyScalar(scale);model.position.set(-center.x*scale,-box.min.y*scale,-center.z*scale);model.updateMatrixWorld(true);
   model.traverse(o=>{if(!o.isMesh)return;o.frustumCulled=false;o.castShadow=false;const materials=Array.isArray(o.material)?o.material:[o.material];for(const m of materials){m.clippingPlanes=[clip];m.clipShadows=true;m.side=T.FrontSide;}if(o.name==='Object_42'){
    const p=o.geometry.attributes.position,groups=[[],[]];for(let i=0;i<p.count;i++)groups[p.getX(i)<0?0:1].push({index:i,height:p.getY(i)});for(const group of groups){group.sort((a,b)=>a.height-b.height);for(const v of group.slice(0,24))footSamples.push({mesh:o,index:v.index});}
   }});
   if(!footSamples.length)throw Error('Body feet are missing');metrics={referenceHeight:profile.height,eyeHeight:profile.eye,visibleBodyTop:profile.visibleBodyTop,scale,footSamples:footSamples.length};ready=true;status('Girl explorer body active · '+profile.height.toFixed(2)+' m reference height');
  }catch(error){status('Explorer body could not load; walking and artifact controls remain available.');console.warn('Explorer body unavailable',error);}}
  function update(dt,{x,z,feet,height,grounded,crouched,started,paused=false}){
   pivot.visible=ready&&enabled&&started;if(!pivot.visible){last={x,z};return;}
   const distance=last?Math.hypot(x-last.x,z-last.z):0,speed=dt>0&&distance<.5?distance/dt:0;last={x,z};const state=motion(paused?0:speed,grounded,crouched);action(state,speed);const description=crouched?'crouched':state;if(description!==lastStatus){lastStatus=description;status('Girl explorer body active · '+description+' · '+profile.height.toFixed(2)+' m reference height');}mixer.update(paused?0:Math.min(dt,.05));
   camera.getWorldDirection(direction);const heading=Math.atan2(-direction.x,-direction.z);pivot.rotation.y=heading+Math.PI;pivot.position.set(x+Math.sin(heading)*.44,feet,z+Math.cos(heading)*.44);stance.scale.y=height/profile.height;clip.constant=camera.position.y-.12;pivot.updateMatrixWorld(true);
   // Pin the lowest sole sample to the physical feet, including drops/jumps.
   // Only 48 vertices are sampled, rather than recomputing the whole skin box.
   let low=Infinity;for(const sample of footSamples){sample.mesh.getVertexPosition(sample.index,point);sample.mesh.localToWorld(point);low=Math.min(low,point.y);}if(Number.isFinite(low)){pivot.position.y+=feet-low;pivot.updateMatrixWorld(true);}
  }
  return{load,update,setVisible(value){enabled=!!value;if(!enabled)pivot.visible=false;},reset(){last=null;},get ready(){return ready;},get metrics(){return metrics;},get state(){return active?.getClip().name||'loading';}};
 }
 return{profile,motion,create};
});
