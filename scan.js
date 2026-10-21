(async function(){
  const $=id=>document.getElementById(id);let scene,active=null,started=false,revealed=false;const visible=new Set();let timeout;
  let autoExplore=new URLSearchParams(location.search).get('mode')!=='card',explorer=null,held=null,heldPending=null,blockedCard=null;
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
  function cardStatus(){if(active!==null)$('status').textContent=held!==null?`Card ${active} · kept on screen · pinch to zoom`:`Card ${active} · ${Math.round(view(active).size*100)}% · drag to turn · pinch to resize`;}
  function syncCardPicker(){
    const picker=$('active-card');picker.replaceChildren(...[...visible].sort((a,b)=>a-b).map(n=>{const option=document.createElement('option');option.value=String(n);option.textContent=`Card ${n}`;return option;}));
    picker.value=active===null?'':String(active);$('card-picker').hidden=held!==null||heldPending!==null||visible.size<2;
  }
  $('active-card').onchange=()=>{const n=Number($('active-card').value);if(visible.has(n))showArtifact(n);};
  $('setup-info').textContent=Classroom.isPreview?'Preview of unsaved teacher edits. Save to cards makes them the shared starting views.':`Saved teacher views loaded. Scan once to keep an object on screen. Screen zoom is independent of paper size. On-card life size uses the ${Classroom.markerWidthCm.toFixed(2)} cm black square.`;
  function exploreZoom(value){if(!explorer||held===null)return;explorer.setZoom(value);$('explore-zoom').textContent=Math.round(explorer.zoom*100)+'%';}
  function openExplorer(n){
    const source=models.get(n)?.getObject3D('artifact');if(!source)return;
    try{clearGesture();if(!explorer)explorer=new ArtifactExplorer(AFRAME.THREE,$('explore-host'));explorer.open(source,Classroom.pose(n));held=n;heldPending=null;
      models.forEach(el=>el.object3D.visible=false);$('hold-toolbar').hidden=false;$('card-controls').hidden=true;$('explore-controls').hidden=false;$('keep-explore').hidden=true;
      $('gesture-help').textContent='The object stays on screen after the card leaves view. Drag to rotate, pinch to zoom, or tap Bigger repeatedly. Fit brings the whole object back. Screen zoom has no 800% ceiling and does not represent physical life size.';
      $('setup-summary').textContent='Teacher orientation loaded. Screen view stays with the iPad; On the card returns to floor tracking.';$('model-note').textContent='Screen-held 3D view · zoom is independent of paper size';
      exploreZoom(explorer.zoom);syncCardPicker();cardStatus();setPanel(true);
    }catch(error){heldPending=null;autoExplore=false;$('status').textContent='Screen view could not open. On-card controls are still available.';console.error(error);}
  }
  function closeExplorer(){clearGesture();explorer?.close();held=null;heldPending=null;models.forEach(el=>el.object3D.visible=true);$('hold-toolbar').hidden=true;$('card-controls').hidden=false;$('explore-controls').hidden=true;$('keep-explore').hidden=false;}
  $('scan-next').onclick=()=>{blockedCard=visible.has(held)?held:null;closeExplorer();autoExplore=true;showArtifact(null);$('status').textContent='Point at the next card · move the previous card out of view';};
  $('on-card').onclick=()=>{const n=held;closeExplorer();autoExplore=false;showArtifact(visible.has(n)?n:(visible.size?[...visible].at(-1):null));};
  $('keep-explore').onclick=()=>{if(active===null)return;heldPending=active;openExplorer(active);};
  $('explore-grow').onclick=()=>{clearGesture();exploreZoom(explorer.zoom*2);};
  $('explore-shrink').onclick=()=>{clearGesture();exploreZoom(explorer.zoom/2);};
  $('explore-fit').onclick=()=>{clearGesture();explorer.fit();exploreZoom(1);};
  $('explore-reset').onclick=()=>{clearGesture();explorer.reset();exploreZoom(explorer.zoom);};
  function setScale(value){
    value=clamp(value,Number($('scale').min),Number($('scale').max));
    $('scale').value=String(value);$('scale-value').textContent=Math.round(Number($('scale').value)*100)+'%';
    if(active!==null){view(active).size=Number($('scale').value);$('dimension-value').textContent=(Classroom.pose(active).lengthCm*view(active).size).toFixed(1)+' cm';applyView(active);cardStatus();}
  }
  function clearGesture(){
    for(const id of pointers.keys())if(surface.hasPointerCapture(id))surface.releasePointerCapture(id);
    pointers.clear();gesture=null;
  }
  function beginGesture(){
    if(active===null||!pointers.size){gesture=null;return;}
    const p=[...pointers.values()],v=held!==null?explorer:view(active);
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
  function stop(){closeExplorer();explorer?.dispose();explorer=null;visible.clear();active=null;document.querySelectorAll('video').forEach(v=>v.srcObject?.getTracks().forEach(t=>t.stop()));if(scene){scene.remove();scene=null;}models.clear();started=false;}
  function showArtifact(n){
    clearGesture();active=n;syncCardPicker();['scale','size-4x','size-life','size-grow','reset-model','keep-explore'].forEach(id=>$(id).disabled=n===null);revealed=false;$('target-guide').hidden=n!==null;
    if(n===null){$('status').textContent='Point at a floor card · keep the full square visible';$('artifact-label').textContent='YOUR INVESTIGATION';$('artifact-name').textContent='Find the next clue';$('artifact-description').textContent='The model appears while its marker is visible. Move back or lower the iPad if you lose it.';$('reveal').hidden=true;$('artifact-question').hidden=true;return;}
    $('scale').value=String(view(n).size);$('scale-value').textContent=Math.round(view(n).size*100)+'%';
    const p=Classroom.pose(n);$('dimension-value').textContent=(p.lengthCm*view(n).size).toFixed(1)+' cm';$('setup-summary').textContent=`${Classroom.isPreview?'Unsaved preview':'Saved teacher start'}: ${p.size}% · life-size reference ${p.lengthCm} cm. Reset restores the teacher’s pose and size.`;$('gesture-help').textContent='On-card view: keep the black square visible. Drag to rotate and pinch to resize up to 800% of reference life size. Keep & explore holds the object on screen with free zoom.';$('model-note').textContent='On-card scale uses the measured black-square width and teacher reference dimension';
    const a=ARTIFACTS[n-1];cardStatus();$('artifact-label').textContent=`EVIDENCE ${String(n).padStart(2,'0')}`;$('artifact-name').textContent=`Artifact ${n}`;$('artifact-description').textContent='Look at its shape and construction. What could it be made from? What might it do?';$('artifact-question').textContent=a.question;$('artifact-question').hidden=false;$('reveal').hidden=false;$('reveal').textContent='Reveal artifact name';
  }
  $('reveal').onclick=()=>{if(active===null)return;revealed=!revealed;const a=ARTIFACTS[active-1];$('artifact-name').textContent=revealed?a.name:`Artifact ${active}`;$('artifact-description').textContent=revealed?a.fact:'Look at its shape and construction. What could it be made from? What might it do?';$('reveal').textContent=revealed?'Hide artifact name':'Reveal artifact name';};
  function ready(){clearTimeout(timeout);$('loading-cover').hidden=true;if(active===null)$('status').textContent='Camera ready · point at a printed floor card';}
  window.addEventListener('camera-init',ready);window.addEventListener('camera-error',e=>{const code=e.detail?.error?.name||e.detail?.name||'';error(code==='NotAllowedError'?'Camera access was blocked. Allow camera access for this site in Safari, then try again.':'The camera could not start. Check Safari camera permission and close other apps using the camera.');});
  $('start-camera').onclick=()=>{
    if(started)return;$('error').hidden=true;
    if(!window.isSecureContext)return error('Camera access needs HTTPS. Open the published site address in Safari.');
    if(!navigator.mediaDevices?.getUserMedia)return error('This browser cannot provide camera access. Open the page in Safari on the iPad.');
    if(!window.AFRAME?.systems?.arjs)return error('The AR library has not loaded. Check your connection, refresh, and try again.');
    started=true;$('start-screen').hidden=true;$('loading-cover').hidden=false;
    if(!AFRAME.components['artifact-model'])AFRAME.registerComponent('artifact-model',{
      schema:{index:{type:'int',default:0}},
      init(){
        const T=AFRAME.THREE,index=this.data.index;
        const attach=model=>{
          if(this.removed)return;
          const pivot=Classroom.frame(T,model);
          this.el.setObject3D('artifact',pivot);applyView(index+1);this.el.emit('artifact-loaded');
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
      const marker=document.createElement('a-marker');marker.setAttribute('type','barcode');marker.setAttribute('value',String(a.n));marker.setAttribute('size',String(Classroom.markerWidthCm/100));marker.setAttribute('emitevents','true');marker.setAttribute('smooth','true');marker.setAttribute('smooth-count','5');marker.setAttribute('smooth-tolerance','0.01');marker.setAttribute('smooth-threshold','2');
      const el=document.createElement('a-entity');models.set(a.n,el);el.setAttribute('artifact-model',`index: ${i}`);el.setAttribute('position','0 0.003 0');marker.append(el);
      el.addEventListener('artifact-loading',()=>{if(active===a.n)$('status').textContent=`Card ${a.n} · loading ${a.name.toLowerCase()} model…`;});
      el.addEventListener('artifact-loaded',()=>{if(heldPending===a.n)openExplorer(a.n);else if(active===a.n)cardStatus();});
      el.addEventListener('artifact-error',()=>{if(active===a.n){heldPending=null;$('status').textContent=`${a.name} could not load · check your connection and scan the card again`;}});
      marker.addEventListener('markerFound',()=>{ready();visible.add(a.n);if(held!==null)return;if(autoExplore){if(a.n===blockedCard)return;if(heldPending===null){heldPending=a.n;showArtifact(a.n);}if(heldPending!==a.n)return;el.emit('load-artifact');if(heldPending===a.n&&el.getObject3D('artifact'))openExplorer(a.n);}else{if(active===null)showArtifact(a.n);else syncCardPicker();el.emit('load-artifact');}});
      marker.addEventListener('markerLost',()=>{visible.delete(a.n);if(blockedCard===a.n)blockedCard=null;if(held!==null||heldPending!==null)return;if(active===a.n)showArtifact(visible.size?[...visible].at(-1):null);else syncCardPicker();});scene.append(marker);
    });
    const camera=document.createElement('a-entity');camera.setAttribute('camera','');scene.append(camera);$('scene-host').append(scene);
    timeout=setTimeout(()=>{if(!$('loading-cover').hidden){$('loading-cover').hidden=true;$('status').textContent='Waiting for camera permission · allow access in Safari';}},18000);
  };
  addEventListener('pagehide',stop);
})();
