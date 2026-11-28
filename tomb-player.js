/* Girl explorer first-person body. Physics/camera remain authoritative. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TombPlayer=api;})(typeof window!=='undefined'?window:this,()=>{'use strict';
 const profile={height:1.75,eye:1.60,crouch:1.0,radius:.24,visibleBodyTop:1.42};
 function motion(speed,grounded,crouched){return !grounded?'jump':speed>1.4&&!crouched?'run':speed>.08?'walk':'idle';}
 function create({THREE:T,scene,camera,renderer,status=()=>{},character='explorer'}){
  const pivot=new T.Group(),stance=new T.Group(),direction=new T.Vector3(),point=new T.Vector3();pivot.name='Explorer player body';pivot.add(stance);pivot.visible=false;scene.add(pivot);
  const adventurer=character==='adventurer',characterName=adventurer?'Adventurer':'Girl explorer';
  const normalize=name=>name.replace(/[^a-z0-9]/gi,'').toLowerCase();
  const cameraClearance={value:.22};
  let ready=false,enabled=true,footSamples=[],last=null,metrics=null,lastStatus='',mixer=null,actions={},currentState='idle',activeAction=null,modelRoot=null,bookModel=null,headPoint=new T.Vector3(),eyeLocal=new T.Vector3(),headBone=null,forearmLength=1,forearmAdjustments=[],runningBodies=[],runningTorsoMeshes=[],animationNames=[],selectedAnimation=null,fullCharacter=false,hiddenHeadMeshes=[];
  async function load(){try{
   status('Loading explorer body…');const g=await new T.GLTFLoader().loadAsync(adventurer?'assets/characters/adventurer-mixamo.glb':'assets/characters/girl-explorer-restored.glb?v=1'),model=g.scene;stance.add(model);
   // Keep the source skin and rig live so the supplied gait deforms body and clothing together.
   modelRoot=model;mixer=new T.AnimationMixer(model);
   for(const [state,pattern]of Object.entries((adventurer?{idle:/^Idle_11$/i,walk:/^Walking$/i,run:/^Running$/i,jump:/^Jump_Run_inplace$/i}:{idle:/idel|idle/i,walk:/walk/i,run:/run/i,jump:/jump/i}))){const clip=g.animations.find(c=>pattern.test(c.name));if(!clip)throw Error('Explorer '+state+' clip is missing');actions[state]=mixer.clipAction(clip);}
   animationNames=g.animations.map(clip=>clip.name);for(const clip of g.animations)actions['clip:'+clip.name]=mixer.clipAction(clip);
   activeAction=actions.idle;activeAction.play();mixer.update(.01);model.updateMatrixWorld(true);
   for(const [name,power]of (adventurer?[['mixamorigLeftForeArm',1],['mixamorigLeftHand',-1],['mixamorigRightForeArm',1],['mixamorigRightHand',-1]]:[['DEF-forearmL_0457',1],['DEF-handL_0459',-1],['DEF-forearmR_0563',1],['DEF-handR_0585',-1]])){let bone;model.traverse(o=>{if(normalize(o.name)===normalize(name))bone=o;});if(!bone)throw Error('Missing forearm joint '+name);forearmAdjustments.push({bone,power,animatedScale:bone.scale.clone()});}
   const skins=[];model.traverse(o=>{if(o.isSkinnedMesh)skins.push(o);});
   for(const body of skins){
    if(!adventurer&&body.name!=='Circle_Shairt_0')continue;const p=body.geometry.attributes.position,j=body.geometry.attributes.skinIndex,w=body.geometry.attributes.skinWeight;
    for(let i=0;i<p.count;i++){let foot=0;for(let k=0;k<4;k++)if((adventurer?/mixamorig.*(Foot|Toe)/i:/DEF-(foot|toe)/).test(body.skeleton.bones[j.getComponent(i,k)]?.name||''))foot+=w.getComponent(i,k);if(foot>.5)footSamples.push({mesh:body,index:i});}
   }
   model.updateMatrixWorld(true);
   // Preserve the complete authored model for the field notebook. Bake its
   // current skin pose so the notebook's ordinary clone is independent of the rig.
   bookModel=new T.Group();
   model.traverse(o=>{if(!o.isMesh)return;const geometry=o.geometry.clone(),positions=geometry.attributes.position;
    for(let i=0;i<positions.count;i++){o.getVertexPosition(i,point);positions.setXYZ(i,point.x,point.y,point.z);}
    geometry.deleteAttribute('skinIndex');geometry.deleteAttribute('skinWeight');geometry.computeVertexNormals();
    const copy=new T.Mesh(geometry,o.material);copy.applyMatrix4(o.matrixWorld);bookModel.add(copy);
   });
   const box=new T.Box3().setFromObject(model,true);
   if(adventurer){let top,front;model.traverse(o=>{const name=normalize(o.name);if(name==='mixamorighead')headBone=o;if(name==='mixamorigheadtopend')top=o;if(name==='headfront')front=o;});if(!headBone||!top)throw Error('Adventurer head anchors are missing');eyeLocal.set(0,top.position.y*.62,(front?.position.z||.15)*.65);headBone.localToWorld(point.copy(eyeLocal));}
   else{headBone=model.getObjectByName('head_0403');const eyes=[];model.traverse(o=>{if(o.isMesh&&/^Eyes[LR]_/.test(o.name))eyes.push(o);});if(!headBone||eyes.length!==2)throw Error('Explorer eye anchors are missing');for(const eye of eyes)eyeLocal.add(eye.getWorldPosition(point));eyeLocal.multiplyScalar(.5);point.copy(eyeLocal);headBone.worldToLocal(eyeLocal);}
   const eyeHeight=point.y-box.min.y,scale=profile.eye/eyeHeight;
   if(!Number.isFinite(scale)||scale<=0)throw Error('Invalid explorer bounds');
   model.scale.multiplyScalar(scale);model.position.set(0,-box.min.y*scale,0);model.updateMatrixWorld(true);
   // Hide surfaces at the camera, retaining every body/clothing mesh and clip.
   const headMeshes=new Set(['Head_Shairt_0','Lashes_Shairt_0','Eyebrows_Shairt_0','NurbsPath066_Shairt_0','NurbsPath066_Shairt_0_1','Hat_Shairt_0','Hat2_Shairt_0','EyesL_Shairt_0','EyesR_Shairt_0']);
   model.traverse(o=>{if(!o.isMesh)return;o.visible=!headMeshes.has(o.name)&&!/^NurbsPath|^Eyes[LR]_/.test(o.name);if(!o.visible)hiddenHeadMeshes.push(o);o.frustumCulled=false;});
   // Keep original geometry for the book and other poses. Running uses an
   // index-only view of the body that retains arm and leg skin influences.
   model.traverse(mesh=>{if(!mesh.isMesh)return;
    if(['Shirt_Shairt_0','Backpack_Shairt_0','Bukle_Shairt_0','Plane007_Shairt_0','Plane008_Shairt_0','Compas_Shairt_0'].includes(mesh.name))runningTorsoMeshes.push(mesh);
    if(!adventurer&&mesh.name!=='Circle_Shairt_0')return;
    let original=mesh.geometry;const full=original;const j=original.attributes.skinIndex,w=original.attributes.skinWeight,index=original.index,kept=[];
    if(adventurer){const headless=original.clone(),visible=[];const headVertex=i=>{let weight=0;for(let k=0;k<4;k++)if(/mixamorig.*(Head|Neck)/i.test(mesh.skeleton.bones[j.getComponent(i,k)]?.name||''))weight+=w.getComponent(i,k);return weight>.35;};for(let i=0;i<index.count;i+=3){const a=index.getX(i),b=index.getX(i+1),c=index.getX(i+2);if(!headVertex(a)&&!headVertex(b)&&!headVertex(c))visible.push(a,b,c);}headless.setIndex(visible);original=headless;mesh.geometry=headless;}
    const geometry=original.clone();
    const limbVertex=i=>{let limb=0;for(let k=0;k<4;k++){const bone=mesh.skeleton.bones[j.getComponent(i,k)];if((adventurer?/mixamorig.*(Left|Right)(Arm|ForeArm|Hand|UpLeg|Leg|Foot|Toe)/i:/^DEF-(upper_arm|forearm|hand|palm|f_|thumb|thigh|shin|foot|toe)/).test(bone?.name||''))limb+=w.getComponent(i,k);}return limb>.5;};
    for(let i=0;i<index.count;i+=3){const a=index.getX(i),b=index.getX(i+1),c=index.getX(i+2);if(limbVertex(a)&&limbVertex(b)&&limbVertex(c))kept.push(a,b,c);}
    geometry.setIndex(kept);runningBodies.push({mesh,original,geometry,full});
   });
   // Discard only avatar fragments close to the viewing camera. Clone materials
   // so the complete notebook copy retains its ordinary source appearance.
   const firstPersonMaterials=new Map();
   function cameraMaterial(source){if(firstPersonMaterials.has(source))return firstPersonMaterials.get(source);const material=source.clone();material.side=T.FrontSide;
    material.onBeforeCompile=shader=>{shader.uniforms.explorerCameraClearance=cameraClearance;shader.fragmentShader='uniform float explorerCameraClearance;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\nif (length(vViewPosition) < explorerCameraClearance) discard;');};
    material.customProgramCacheKey=()=> 'explorer-camera-clearance-v1';firstPersonMaterials.set(source,material);return material;}
   model.traverse(o=>{if(o.isMesh)o.material=Array.isArray(o.material)?o.material.map(cameraMaterial):cameraMaterial(o.material);});
   if(!footSamples.length)throw Error('Body feet are missing');metrics={presentation:'animated first-person rig',referenceHeight:profile.height,eyeHeight:profile.eye,visibleBodyTop:profile.visibleBodyTop,scale,footSamples:footSamples.length};ready=true;status(characterName+' body active · '+profile.height.toFixed(2)+' m reference height');
  }catch(error){status('Explorer body could not load; walking and artifact controls remain available.');console.warn('Explorer body unavailable',error);}}
  function update(dt,{x,z,feet,height,grounded,crouched,started,paused=false,bodyEyeOffset=0,bodyEyeOffsetX=0,bodyEyeOffsetZ=0,animationSpeed=null}){
   pivot.visible=ready&&enabled&&started;if(!pivot.visible){last={x,z};return;}
   const distance=last?Math.hypot(x-last.x,z-last.z):0,speed=Number.isFinite(animationSpeed)?Math.max(0,animationSpeed):(dt>0&&distance<.5?distance/dt:0);last={x,z};const state=selectedAnimation?'clip:'+selectedAnimation:motion(paused?0:speed,grounded,crouched);if(state!==currentState){const next=actions[state];if(next!==activeAction){next.reset().play();activeAction.crossFadeTo(next,.16,false);activeAction=next;}currentState=state;}mixer.timeScale=state==='walk'?Math.max(.55,Math.min(1.5,speed/.95)):state==='run'?Math.max(.7,Math.min(1.35,speed/1.9)):1;for(const joint of forearmAdjustments)joint.bone.scale.copy(joint.animatedScale);if(!paused)mixer.update(Math.min(dt,.05));for(const joint of forearmAdjustments){joint.animatedScale.copy(joint.bone.scale);joint.bone.scale.y*=Math.pow(forearmLength,joint.power);}const description=crouched?'crouched · '+state:state;if(description!==lastStatus){lastStatus=description;status(characterName+' body active · '+description+' · '+profile.height.toFixed(2)+' m reference height');}
   const running=state==='run'||!!selectedAnimation&&/run/i.test(selectedAnimation);for(const body of runningBodies)body.mesh.geometry=fullCharacter?body.full:running?body.geometry:body.original;for(const mesh of runningTorsoMeshes)mesh.visible=fullCharacter||!running;for(const mesh of hiddenHeadMeshes)mesh.visible=fullCharacter;metrics.runningTorsoHidden=!fullCharacter&&running;
   camera.getWorldDirection(direction);const heading=Math.atan2(-direction.x,-direction.z);pivot.rotation.y=heading+Math.PI;pivot.position.set(x,feet,z);stance.scale.setScalar(1);pivot.updateMatrixWorld(true);modelRoot.traverse(o=>{if(o.isSkinnedMesh)o.skeleton.update();});
   // Put the camera at the authored head position without changing limb poses.
   const head=headBone;
   if(head&&!fullCharacter){head.localToWorld(headPoint.copy(eyeLocal));camera.getWorldPosition(point);point.x+=bodyEyeOffsetX;point.y+=bodyEyeOffset;point.z+=bodyEyeOffsetZ;pivot.position.add(point.sub(headPoint));pivot.updateMatrixWorld(true);head.localToWorld(headPoint.copy(eyeLocal));camera.getWorldPosition(point);point.x+=bodyEyeOffsetX;point.y+=bodyEyeOffset;point.z+=bodyEyeOffsetZ;metrics.eyeAlignmentError=headPoint.distanceTo(point);}

  }
  return{load,update,get animationNames(){return animationNames.slice();},setAnimation(name){if(name===null||animationNames.includes(name))selectedAnimation=name;},setFullCharacter(value){fullCharacter=!!value;},setForearmLength(value){if(Number.isFinite(value))forearmLength=Math.max(1,Math.min(2.5,value));},setCameraClearance(value){if(Number.isFinite(value))cameraClearance.value=Math.max(0,Math.min(.8,value));},getBookModel(){return bookModel;},setVisible(value){enabled=!!value;if(!enabled)pivot.visible=false;},reset(){last=null;},get ready(){return ready;},get metrics(){return metrics;},get state(){return ready?currentState:'loading';}};
 }
 return{profile,motion,create};
});
