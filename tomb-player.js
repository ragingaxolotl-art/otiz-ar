/* Girl explorer first-person body. Physics/camera remain authoritative. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TombPlayer=api;})(typeof window!=='undefined'?window:this,()=>{'use strict';
 const profile={height:1.75,eye:1.60,crouch:1.0,radius:.24,visibleBodyTop:1.42};
 function motion(speed,grounded,crouched){return !grounded?'jump':crouched?'idle':speed>1.4?'run':speed>.08?'walk':'idle';}
 function create({THREE:T,scene,camera,renderer,status=()=>{}}){
  const pivot=new T.Group(),stance=new T.Group(),direction=new T.Vector3(),point=new T.Vector3(),clip=new T.Plane(new T.Vector3(0,-1,0),0);pivot.name='Explorer player body';pivot.add(stance);pivot.visible=false;scene.add(pivot);renderer.localClippingEnabled=true;
  let ready=false,enabled=true,footSamples=[],last=null,metrics=null,lastStatus='';
  async function load(){try{
   status('Loading explorer body…');const g=await new T.GLTFLoader().loadAsync('assets/characters/girl-explorer-body.glb?v=2'),model=g.scene;stance.add(model);
   // Pose the full source skin once, then bake coherent body and clothing
   // surfaces together. The first-person reference never runs deforming clips.
   const idle=g.animations.find(c=>/idel|idle/i.test(c.name));if(!idle)throw Error('Neutral explorer pose is missing');const poser=new T.AnimationMixer(model);poser.clipAction(idle).play();poser.update(.01);model.updateMatrixWorld(true);
   const skins=[];model.traverse(o=>{if(o.isSkinnedMesh)skins.push(o);});
   for(const body of skins){
    const geometry=body.geometry.clone(),p=geometry.attributes.position.clone(),j=geometry.attributes.skinIndex,w=geometry.attributes.skinWeight,footIndices=[],sample=new T.Vector3();
    for(let i=0;i<p.count;i++){if(body.name==='Object_42'){let foot=0;for(let k=0;k<4;k++)if(/DEF-(foot|toe)/.test(body.skeleton.bones[j.getComponent(i,k)]?.name||''))foot+=w.getComponent(i,k);if(foot>.5)footIndices.push(i);}body.getVertexPosition(i,sample);p.setXYZ(i,sample.x,sample.y,sample.z);}
    geometry.setAttribute('position',p);geometry.deleteAttribute('skinIndex');geometry.deleteAttribute('skinWeight');geometry.computeVertexNormals();geometry.computeBoundingBox();geometry.computeBoundingSphere();
    const stable=new T.Mesh(geometry,body.material);stable.name=body.name;stable.userData.footIndices=footIndices;stable.position.copy(body.position);stable.quaternion.copy(body.quaternion);stable.scale.copy(body.scale);body.parent.add(stable);body.removeFromParent();
   }
   model.updateMatrixWorld(true);
   const box=new T.Box3().setFromObject(model,true),size=box.getSize(new T.Vector3()),hip=model.getObjectByName('DEF-spine_021');if(!Number.isFinite(size.y)||size.y<.1)throw Error('Invalid body bounds');const center=hip?hip.getWorldPosition(new T.Vector3()):box.getCenter(new T.Vector3()),scale=profile.visibleBodyTop/size.y;
   model.scale.multiplyScalar(scale);model.position.set(-center.x*scale,-box.min.y*scale,-center.z*scale);model.updateMatrixWorld(true);
   model.traverse(o=>{if(!o.isMesh)return;o.frustumCulled=false;o.castShadow=false;const materials=Array.isArray(o.material)?o.material:[o.material];for(const m of materials){m.clippingPlanes=[clip];m.clipShadows=true;m.side=T.FrontSide;}if(o.name==='Object_42'){
    for(const index of o.userData.footIndices||[])footSamples.push({mesh:o,index});
   }});
   if(!footSamples.length)throw Error('Body feet are missing');metrics={presentation:'stable first-person reference',referenceHeight:profile.height,eyeHeight:profile.eye,visibleBodyTop:profile.visibleBodyTop,scale,footSamples:footSamples.length};ready=true;status('Girl explorer body active · '+profile.height.toFixed(2)+' m reference height');
  }catch(error){status('Explorer body could not load; walking and artifact controls remain available.');console.warn('Explorer body unavailable',error);}}
  function update(dt,{x,z,feet,height,grounded,crouched,started,paused=false}){
   pivot.visible=ready&&enabled&&started;if(!pivot.visible){last={x,z};return;}
   const distance=last?Math.hypot(x-last.x,z-last.z):0,speed=dt>0&&distance<.5?distance/dt:0;last={x,z};const state=motion(paused?0:speed,grounded,crouched);const description=crouched?'crouched':state;if(description!==lastStatus){lastStatus=description;status('Girl explorer body active · '+description+' · '+profile.height.toFixed(2)+' m reference height');}
   camera.getWorldDirection(direction);const heading=Math.atan2(-direction.x,-direction.z);pivot.rotation.y=heading+Math.PI;pivot.position.set(x+Math.sin(heading)*.44,feet,z+Math.cos(heading)*.44);stance.scale.setScalar(1);clip.constant=camera.position.y-.18;pivot.updateMatrixWorld(true);
   // Pin the lowest sole sample to the physical feet, including drops/jumps.
   // Sole vertices were identified before baking; all feet stay grounded.
   let low=Infinity;for(const sample of footSamples){sample.mesh.getVertexPosition(sample.index,point);sample.mesh.localToWorld(point);low=Math.min(low,point.y);}if(Number.isFinite(low)){pivot.position.y+=feet-low;pivot.updateMatrixWorld(true);}
  }
  return{load,update,setVisible(value){enabled=!!value;if(!enabled)pivot.visible=false;},reset(){last=null;},get ready(){return ready;},get metrics(){return metrics;},get state(){return ready?'stable reference':'loading';}};
 }
 return{profile,motion,create};
});
