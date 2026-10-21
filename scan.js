(async function(){
  const $=id=>document.getElementById(id);let scene,active=null,started=false,revealed=false;const visible=new Set();let timeout;
  let explorer=null,held=null;
  await Classroom.ready;
  $('retry-saved').onclick=()=>location.reload();
  if(!Classroom.loaded&&!Classroom.isPreview){$('setup-info').textContent='Saved card settings could not load. Check your connection and retry.';$('start-camera').disabled=true;$('retry-saved').hidden=false;return;}
  const BASE_SCALE=1,models=new Map(),views=new Map(),pointers=new Map(),surface=$('gesture-surface');
  let gesture=null;
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  function startingView(n){const p=Classroom.pose(n),k=Math.PI/180;return {yaw:p.yaw*k,pitch:p.pitch*k,roll:p.roll*k,size:p.size/100};}
  function view(n){if(!views.has(n))views.set(n,startingView(n));return views.get(n);}
  function applyView(n){
    const el=models.get(n);if(!el)return;
    const v=view(n),pivot=el.getObject3D('artifact');
    // Apply size to the model itself, independently of A-Frame / marker transforms.
    el.object3D.scale.setScalar(BASE_SCALE);
    if(pivot){const k=180/Math.PI;Classroom.apply(pivot,{...Classroom.pose(n),pitch:v.pitch*k,yaw:v.yaw*k,roll:v.roll*k},v.size*100);}
  }
  function cardStatus(){if(active!==null)$('status').textContent=held!==null?`Captured card ${active} · rotate and zoom freely`:`Live AR · Card ${active} · ${Math.round(view(active).size*100)}%`;}
  function captureReady(){const ready=held===null&&active!==null&&visible.has(active)&&!!models.get(active)?.getObject3D('artifact');$('keep-explore').disabled=!ready;}
  function syncCardPicker(){
    const picker=$('active-card');picker.replaceChildren(...[...visible].sort((a,b)=>a-b).map(n=>{const option=document.createElement('option');option.value=String(n);option.textContent=`Card ${n}`;return option;}));
    picker.value=active===null?'':String(active);$('card-picker').hidden=held!==null||visible.size<2;captureReady();
  }
  $('active-card').onchange=()=>{const n=Number($('active-card').value);if(visible.has(n))showArtifact(n);};
  $('setup-info').textContent=Classroom.isPreview?'Preview of unsaved teacher edits. Save to cards makes them the shared starting views.':`Point at a card to see its object in live AR. Capture keeps it on screen even when the card leaves view. Release returns to live tracking for any card.`;
  function fitAR(n,force=false){
    const pivot=models.get(n)?.getObject3D('artifact');if(!pivot||held!==null)return;
    const v=view(n);if(v.framed&&!force)return;
    const k=180/Math.PI,p={...Classroom.pose(n),pitch:v.pitch*k,yaw:v.yaw*k,roll:v.roll*k};
    const fitted=ARLayout.fitScale(pivot.userData.cardHalfSize,pivot.userData.modelLength,p,Classroom.markerWidthCm);
    v.size=force?fitted:Math.min(v.size,fitted);applyView(n);
    v.framed=true;models.get(n).setAttribute('data-ar-framed','true');if(active===n){$('scale').value=String(v.size);$('scale-value').textContent=Math.round(v.size*100)+'%';$('dimension-value').textContent=(Classroom.pose(n).lengthCm*v.size).toFixed(1)+' cm';cardStatus();}
  }
  function exploreZoom(value){if(!explorer||held===null)return;explorer.setZoom(value);$('explore-zoom').textContent=Math.round(explorer.zoom*100)+'%';}
  function openExplorer(n){
    const source=models.get(n)?.getObject3D('artifact');if(!source)return;
    try{clearGesture();if(!explorer)explorer=new ArtifactExplorer(AFRAME.THREE,$('explore-host'));const v=view(n),k=180/Math.PI;explorer.open(source,{...Classroom.pose(n),pitch:v.pitch*k,yaw:v.yaw*k,roll:v.roll*k});explorer.startPose=Classroom.pose(n);held=n;
      models.forEach(el=>el.object3D.visible=false);$('hold-toolbar').hidden=false;$('card-controls').hidden=true;$('explore-controls').hidden=false;$('keep-explore').hidden=true;
      $('gesture-help').textContent='Captured: the object stays on screen even when the card leaves view. Drag to rotate, pinch to zoom, or tap Bigger. Fit object brings the whole object back. Tap Release to scan any card again.';
      $('release-capture').hidden=false;$('setup-summary').textContent='Captured for inspection. Release returns to live AR and lets you scan any card.';$('model-note').textContent='Captured · stays on screen until you tap Release';
      exploreZoom(explorer.zoom);syncCardPicker();cardStatus();setPanel(true);
    }catch(error){closeExplorer();$('status').textContent='Capture could not open. Live AR is still available.';console.error(error);}
  }
  function closeExplorer(){clearGesture();explorer?.close();held=null;models.forEach(el=>el.object3D.visible=true);$('card-controls').hidden=false;$('explore-controls').hidden=true;$('keep-explore').hidden=false;$('release-capture').hidden=true;captureReady();}
  $('release-capture').onclick=()=>{
    if(held===null)return;
    const n=held;closeExplorer();setPanel(true);
    showArtifact(visible.has(n)?n:visible.size?[...visible].at(-1):null);
    // Cards first detected during Capture need their models loaded on release.
    visible.forEach(id=>{models.get(id).emit('load-artifact');fitAR(id);});
    if(active===null)$('status').textContent='Live AR · point at any floor card';
  };
  $('keep-explore').onclick=()=>{if(active===null||!visible.has(active))return;openExplorer(active);};
  $('fit-ar').onclick=()=>{if(active!==null){clearGesture();fitAR(active,true);}};
  $('explore-grow').onclick=()=>{clearGesture();exploreZoom(explorer.zoom*2);};
  $('explore-shrink').onclick=()=>{clearGesture();exploreZoom(explorer.zoom/2);};
  $('explore-fit').onclick=()=>{clearGesture();explorer.fit();exploreZoom(1);};
  $('explore-reset').onclick=()=>{clearGesture();explorer.reset();exploreZoom(explorer.zoom);};
  function setScale(value){
    value=clamp(value,Number($('scale').min),Number($('scale').max));
    $('scale').value=String(value);$('scale-value').textContent=Math.round(Number($('scale').value)*100)+'%';
    if(active!==null){view(active).framed=true;view(active).size=Number($('scale').value);$('dimension-value').textContent=(Classroom.pose(active).lengthCm*view(active).size).toFixed(1)+' cm';applyView(active);cardStatus();}
  }
  function clearGesture(){
    for(const id of pointers.keys())if(surface.hasPointerCapture(id))surface.releasePointerCapture(id);
    pointers.clear();gesture=null;
  }
  function beginGesture(){
    if(active===null||!pointers.size){gesture=null;return;}
    const p=[...pointers.values()],v=held!==null?explorer:view(active);if(held===null)v.framed=true;
    gesture={n:active,yaw:v.yaw,pitch:v.pitch,scale:held!==null?explorer.zoom:Number($('scale').value),x:p[0].x,y:p[0].y,
      distance:p.length===2?Math.hypot(p[1].x-p[0].x,p[1].y-p[0].y):0};
  }
  surface.addEventListener('pointerdown',e=>{
    if(active===null||!started||(e.pointerType==='mouse'&&e.button!==0)||pointers.size===2)return;
    e.preventDefault();surface.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});beginGesture();
  });
  surface.addEventListener('pointermove',e=>{
    if(!pointers.has(e.pointerId)||!gesture||gesture.n!==active)return;
    e.preventDefault();pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    const p=[...pointers.values()];
    if(p.length===1){if(held!==null)explorer.rotate(gesture.pitch+(p[0].y-gesture.y)*.007,gesture.yaw+(p[0].x-gesture.x)*.009);else{const v=view(active);v.yaw=gesture.yaw+(p[0].x-gesture.x)*.009;v.pitch=clamp(gesture.pitch+(p[0].y-gesture.y)*.007,-Math.PI,Math.PI);applyView(active);}}
    else if(gesture.distance>0){const distance=Math.hypot(p[1].x-p[0].x,p[1].y-p[0].y);if(held!==null)exploreZoom(gesture.scale*distance/gesture.distance);else setScale(gesture.scale*distance/gesture.distance);}
  });
  function endPointer(e){
    if(!pointers.delete(e.pointerId))return;
    if(surface.hasPointerCapture(e.pointerId))surface.releasePointerCapture(e.pointerId);
    beginGesture();
  }
  ['pointerup','pointercancel','lostpointercapture'].forEach(type=>surface.addEventListener(type,endPointer));
  surface.addEventListener('wheel',e=>{if(held===null)return;e.preventDefault();exploreZoom(explorer.zoom*Math.exp(-e.deltaY*.002));},{passive:false});
  addEventListener('blur',clearGesture);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)clearGesture();});
  $('size-4x').onclick=()=>{clearGesture();setScale(4);};
  $('size-life').onclick=()=>{clearGesture();setScale(1);};
  $('size-grow').onclick=()=>{clearGesture();setScale(Number($('scale').value)*2);};
  $('scale').oninput=()=>setScale(Number($('scale').value));
  $('reset-model').onclick=()=>{clearGesture();if(active!==null){views.set(active,startingView(active));applyView(active);}setScale(active===null?1:view(active).size);};
  surface.addEventListener('keydown',e=>{
    if(active===null)return;if(held!==null){if(e.key==='+'||e.key==='=')exploreZoom(explorer.zoom*1.2);else if(e.key==='-')exploreZoom(explorer.zoom/1.2);else if(e.key==='Home')exploreZoom(1);else if(e.key.startsWith('Arrow'))explorer.rotate(explorer.pitch+(e.key==='ArrowDown'?.15:e.key==='ArrowUp'?-.15:0),explorer.yaw+(e.key==='ArrowRight'?.15:e.key==='ArrowLeft'?-.15:0));else return;e.preventDefault();return;}const v=view(active);
    if(e.key==='ArrowLeft')v.yaw-=.15;else if(e.key==='ArrowRight')v.yaw+=.15;
    else if(e.key==='ArrowUp')v.pitch=clamp(v.pitch-.15,-Math.PI,Math.PI);
    else if(e.key==='ArrowDown')v.pitch=clamp(v.pitch+.15,-Math.PI,Math.PI);
    else if(e.key==='+'||e.key==='=')setScale(Number($('scale').value)+.05);
    else if(e.key==='-')setScale(Number($('scale').value)-.05);
    else if(e.key==='Home')$('reset-model').click();else return;
    e.preventDefault();applyView(active);
  });
  function setPanel(collapsed){
    $('panel-content').hidden=collapsed;$('details-panel').classList.toggle('collapsed',collapsed);
    $('panel-toggle').setAttribute('aria-expanded',String(!collapsed));
    $('panel-toggle').textContent=collapsed?'Show details ↑':'Hide details ↓';
  }
  $('panel-toggle').onclick=()=>setPanel(!$('panel-content').hidden);
  function error(message){clearTimeout(timeout);$('loading-cover').hidden=true;$('start-screen').hidden=false;$('error').textContent=message;$('error').hidden=false;$('start-camera').textContent='Try camera again';$('start-camera').disabled=false;if(scene){stop();location.hash='camera-error';}}
  function stop(){closeExplorer();explorer?.dispose();explorer=null;visible.clear();active=null;$('hold-toolbar').hidden=true;document.querySelectorAll('video').forEach(v=>v.srcObject?.getTracks().forEach(t=>t.stop()));if(scene){scene.remove();scene=null;}models.clear();started=false;}
  function showArtifact(n){
    clearGesture();active=n;syncCardPicker();['scale','size-4x','size-life','size-grow','reset-model','fit-ar'].forEach(id=>$(id).disabled=n===null);revealed=false;$('target-guide').hidden=n!==null;
    if(n===null){$('status').textContent='Live AR · point at any floor card';$('artifact-label').textContent='YOUR INVESTIGATION';$('artifact-name').textContent='Find the next clue';$('artifact-description').textContent='Point at a card to see its object. Tap Capture while it is visible to keep it on screen for inspection.';$('reveal').hidden=true;$('artifact-question').hidden=true;return;}
    $('scale').value=String(view(n).size);$('scale-value').textContent=Math.round(view(n).size*100)+'%';
    const p=Classroom.pose(n);$('dimension-value').textContent=(p.lengthCm*view(n).size).toFixed(1)+' cm';$('setup-summary').textContent='Live objects start fitted to their own cards. Capture opens a large inspection view. Life size and Reset use your teacher’s saved dimensions.';$('gesture-help').textContent='Live AR: keep the square visible and move around the object. Tap Capture to keep it on screen while you inspect it. Drag to rotate and pinch to zoom. Release returns to live tracking for any card.';$('model-note').textContent='Live card tracking · Capture keeps the object on screen · Release resumes scanning';
    const a=ARTIFACTS[n-1];cardStatus();$('artifact-label').textContent=`EVIDENCE ${String(n).padStart(2,'0')}`;$('artifact-name').textContent=`Artifact ${n}`;$('artifact-description').textContent='Look at its shape and construction. What could it be made from? What might it do?';$('artifact-question').textContent=a.question;$('artifact-question').hidden=false;$('reveal').hidden=false;$('reveal').textContent='Reveal artifact name';
  }
  $('reveal').onclick=()=>{if(active===null)return;revealed=!revealed;const a=ARTIFACTS[active-1];$('artifact-name').textContent=revealed?a.name:`Artifact ${active}`;$('artifact-description').textContent=revealed?a.fact:'Look at its shape and construction. What could it be made from? What might it do?';$('reveal').textContent=revealed?'Hide artifact name':'Reveal artifact name';};
  function ready(){clearTimeout(timeout);$('loading-cover').hidden=true;if(active===null)$('status').textContent='Live AR · point at any floor card';}
  window.addEventListener('camera-init',ready);window.addEventListener('camera-error',e=>{const code=e.detail?.error?.name||e.detail?.name||'';error(code==='NotAllowedError'?'Camera access was blocked. Allow camera access for this site in Safari, then try again.':'The camera could not start. Check Safari camera permission and close other apps using the camera.');});
  $('start-camera').onclick=()=>{
    if(started)return;$('error').hidden=true;
    if(!window.isSecureContext)return error('Camera access needs HTTPS. Open the published site address in Safari.');
    if(!navigator.mediaDevices?.getUserMedia)return error('This browser cannot provide camera access. Open the page in Safari on the iPad.');
    if(!window.AFRAME?.systems?.arjs)return error('The AR library has not loaded. Check your connection, refresh, and try again.');
    started=true;$('start-screen').hidden=true;$('loading-cover').hidden=false;$('hold-toolbar').hidden=false;setPanel(true);
    if(!AFRAME.components['artifact-model'])AFRAME.registerComponent('artifact-model',{
      schema:{index:{type:'int',default:0}},
      init(){
        const T=AFRAME.THREE,index=this.data.index;
        const attach=model=>{
          if(this.removed)return;
          const pivot=Classroom.frame(T,model);
          this.el.setObject3D('artifact',pivot);applyView(index+1);fitAR(index+1);this.el.emit('artifact-loaded');
        };
        if(!ARTIFACTS[index].modelUrl){attach(ArtifactModels.create(T,index));return;}
        this.load=()=>{
          if(this.loading||this.el.getObject3D('artifact'))return;
          this.loading=true;this.el.emit('artifact-loading');
          ArtifactModels.load(T,index).then(attach).catch(err=>{if(!this.removed){console.error(err);this.el.emit('artifact-error');}}).finally(()=>{this.loading=false;});
        };
        this.el.addEventListener('load-artifact',this.load);
      },
      remove(){this.removed=true;if(this.load)this.el.removeEventListener('load-artifact',this.load);this.el.removeObject3D('artifact');}
    });
    scene=document.createElement('a-scene');scene.setAttribute('embedded','');scene.setAttribute('vr-mode-ui','enabled: false');scene.setAttribute('device-orientation-permission-ui','enabled: false');scene.setAttribute('renderer','alpha: true; antialias: true; precision: mediump;');
    scene.setAttribute('arjs','sourceType: webcam; debugUIEnabled: false; trackingMethod: best; detectionMode: mono_and_matrix; matrixCodeType: 3x3; cameraParametersUrl: vendor/camera_para.dat; sourceWidth: 1280; sourceHeight: 960; displayWidth: 1280; displayHeight: 960;');
    const amb=document.createElement('a-entity');amb.setAttribute('light','type: ambient; color: #fff4de; intensity: 1.8');scene.append(amb);const light=document.createElement('a-entity');light.setAttribute('light','type: directional; color: #ffffff; intensity: 2.2');light.setAttribute('position','1 4 2');scene.append(light);
    ARTIFACTS.forEach((a,i)=>{
      const marker=document.createElement('a-marker');marker.setAttribute('type','barcode');marker.setAttribute('value',String(a.n));marker.setAttribute('size',String(Classroom.markerWidthCm/100));marker.setAttribute('emitevents','true');marker.setAttribute('smooth','false');
      const el=document.createElement('a-entity');models.set(a.n,el);el.setAttribute('artifact-model',`index: ${i}`);el.setAttribute('position','0 0.004 0');marker.append(el);
      el.addEventListener('artifact-loading',()=>{if(active===a.n)$('status').textContent=`Card ${a.n} · loading ${a.name.toLowerCase()} model…`;});
      el.addEventListener('artifact-loaded',()=>{captureReady();if(active===a.n)cardStatus();fitAR(a.n);});
      el.addEventListener('artifact-error',()=>{if(active===a.n)$('status').textContent=`${a.name} could not load · check your connection and scan the card again`;});
      marker.addEventListener('markerFound',()=>{ready();visible.add(a.n);if(held!==null)return;if(active===null)showArtifact(a.n);else syncCardPicker();el.emit('load-artifact');fitAR(a.n);});
      marker.addEventListener('markerLost',()=>{visible.delete(a.n);if(held!==null)return;if(active===a.n)showArtifact(visible.size?[...visible].at(-1):null);else syncCardPicker();});scene.append(marker);
    });
    const camera=document.createElement('a-entity');camera.setAttribute('camera','');scene.append(camera);$('scene-host').append(scene);
    timeout=setTimeout(()=>{if(!$('loading-cover').hidden){$('loading-cover').hidden=true;$('status').textContent='Waiting for camera permission · allow access in Safari';}},18000);
  };
  addEventListener('pagehide',stop);
})();
