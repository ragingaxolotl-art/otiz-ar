(function(){
  const $=id=>document.getElementById(id);let scene,active=null,started=false,revealed=false;const visible=new Set();let timeout;
  const BASE_SCALE=.8,models=new Map(),views=new Map(),pointers=new Map(),surface=$('gesture-surface');
  let gesture=null;
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  function startingView(n){const p=Classroom.pose(n),k=Math.PI/180;return {yaw:p.yaw*k,pitch:p.pitch*k,roll:p.roll*k,size:1};}
  function view(n){if(!views.has(n))views.set(n,startingView(n));return views.get(n);}
  function applyView(n){
    const el=models.get(n);if(!el)return;
    const v=view(n),pivot=el.getObject3D('artifact');
    // Apply size to the model itself, independently of A-Frame / marker transforms.
    el.object3D.scale.setScalar(BASE_SCALE);
    if(pivot){pivot.scale.setScalar(Classroom.pose(n).size/100*v.size);pivot.rotation.set(v.pitch,v.yaw,v.roll,'YXZ');Classroom.ground(pivot);}
  }
  function cardStatus(){if(active!==null)$('status').textContent=`Card ${active} · ${Math.round(view(active).size*100)}% · drag to turn · pinch to resize`;}
  function syncCardPicker(){
    const picker=$('active-card');picker.replaceChildren(...[...visible].sort((a,b)=>a-b).map(n=>{const option=document.createElement('option');option.value=String(n);option.textContent=`Card ${n}`;return option;}));
    picker.value=active===null?'':String(active);$('card-picker').hidden=visible.size<2;
  }
  $('active-card').onchange=()=>{const n=Number($('active-card').value);if(visible.has(n))showArtifact(n);};
  const customized=Object.keys(Classroom.poses).length;
  $('setup-info').textContent=Classroom.hasSetup?`Teacher settings loaded · ${customized} customized starting ${customized===1?'view':'views'}. After edits, scan the new Teacher Mode QR.`:'Original starting views. To use teacher edits from another device, scan the latest QR in Teacher Mode. Refreshing this link does not import those edits.';
  function setScale(value){
    value=clamp(value,Number($('scale').min),Number($('scale').max));
    $('scale').value=String(value);$('scale-value').textContent=Math.round(Number($('scale').value)*100)+'%';
    if(active!==null){view(active).size=Number($('scale').value);applyView(active);cardStatus();}
  }
  function clearGesture(){
    for(const id of pointers.keys())if(surface.hasPointerCapture(id))surface.releasePointerCapture(id);
    pointers.clear();gesture=null;
  }
  function beginGesture(){
    if(active===null||!pointers.size){gesture=null;return;}
    const p=[...pointers.values()],v=view(active);
    gesture={n:active,yaw:v.yaw,pitch:v.pitch,scale:Number($('scale').value),x:p[0].x,y:p[0].y,
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
    if(p.length===1){const v=view(active);v.yaw=gesture.yaw+(p[0].x-gesture.x)*.009;v.pitch=clamp(gesture.pitch+(p[0].y-gesture.y)*.007,-Math.PI,Math.PI);applyView(active);}
    else if(gesture.distance>0){const distance=Math.hypot(p[1].x-p[0].x,p[1].y-p[0].y);setScale(gesture.scale*distance/gesture.distance);}
  });
  function endPointer(e){
    if(!pointers.delete(e.pointerId))return;
    if(surface.hasPointerCapture(e.pointerId))surface.releasePointerCapture(e.pointerId);
    beginGesture();
  }
  ['pointerup','pointercancel','lostpointercapture'].forEach(type=>surface.addEventListener(type,endPointer));
  addEventListener('blur',clearGesture);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)clearGesture();});
  $('size-4x').onclick=()=>{clearGesture();setScale(4);};
  $('scale').oninput=()=>setScale(Number($('scale').value));
  $('reset-model').onclick=()=>{clearGesture();if(active!==null){views.set(active,startingView(active));applyView(active);}setScale(1);};
  surface.addEventListener('keydown',e=>{
    if(active===null)return;const v=view(active);
    if(e.key==='ArrowLeft')v.yaw-=.15;else if(e.key==='ArrowRight')v.yaw+=.15;
    else if(e.key==='ArrowUp')v.pitch=clamp(v.pitch-.15,-Math.PI,Math.PI);
    else if(e.key==='ArrowDown')v.pitch=clamp(v.pitch+.15,-Math.PI,Math.PI);
    else if(e.key==='+'||e.key==='=')setScale(Number($('scale').value)+.05);
    else if(e.key==='-')setScale(Number($('scale').value)-.05);
    else if(e.key==='Home')$('reset-model').click();else return;
    e.preventDefault();applyView(active);
  });
  $('panel-toggle').onclick=()=>{
    const collapsed=!$('panel-content').hidden;
    $('panel-content').hidden=collapsed;$('details-panel').classList.toggle('collapsed',collapsed);
    $('panel-toggle').setAttribute('aria-expanded',String(!collapsed));
    $('panel-toggle').textContent=collapsed?'Show details ↑':'Hide details ↓';
  };
  function error(message){clearTimeout(timeout);$('loading-cover').hidden=true;$('start-screen').hidden=false;$('error').textContent=message;$('error').hidden=false;$('start-camera').textContent='Try camera again';$('start-camera').disabled=false;if(scene){stop();location.hash='camera-error';}}
  function stop(){clearGesture();visible.clear();active=null;document.querySelectorAll('video').forEach(v=>v.srcObject?.getTracks().forEach(t=>t.stop()));if(scene){scene.remove();scene=null;}models.clear();started=false;}
  function showArtifact(n){
    clearGesture();active=n;syncCardPicker();['scale','size-4x','reset-model'].forEach(id=>$(id).disabled=n===null);revealed=false;$('target-guide').hidden=n!==null;
    if(n===null){$('status').textContent='Point at a floor card · keep the full square visible';$('artifact-label').textContent='YOUR INVESTIGATION';$('artifact-name').textContent='Find the next clue';$('artifact-description').textContent='The model appears while its marker is visible. Move back or lower the iPad if you lose it.';$('reveal').hidden=true;$('artifact-question').hidden=true;return;}
    $('scale').value=String(view(n).size);$('scale-value').textContent=Math.round(view(n).size*100)+'%';
    const p=Classroom.pose(n);$('setup-summary').textContent=Classroom.hasSetup?`Teacher start: ${p.size}% · tilt ${p.pitch}° · turn ${p.yaw}°. Reset restores this view.`:'Original starting view · scan the latest Teacher Mode QR to load teacher changes.';
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
      const marker=document.createElement('a-marker');marker.setAttribute('type','barcode');marker.setAttribute('value',String(a.n));marker.setAttribute('size','1');marker.setAttribute('emitevents','true');marker.setAttribute('smooth','true');marker.setAttribute('smooth-count','5');marker.setAttribute('smooth-tolerance','0.01');marker.setAttribute('smooth-threshold','2');
      const el=document.createElement('a-entity');models.set(a.n,el);el.setAttribute('artifact-model',`index: ${i}`);el.setAttribute('position','0 0.03 0');marker.append(el);
      el.addEventListener('artifact-loading',()=>{if(active===a.n)$('status').textContent=`Card ${a.n} · loading ${a.name.toLowerCase()} model…`;});
      el.addEventListener('artifact-loaded',()=>{if(active===a.n)cardStatus();});
      el.addEventListener('artifact-error',()=>{if(active===a.n)$('status').textContent=`${a.name} could not load · check your connection and scan the card again`;});
      marker.addEventListener('markerFound',()=>{ready();visible.add(a.n);if(active===null)showArtifact(a.n);else syncCardPicker();el.emit('load-artifact');});
      marker.addEventListener('markerLost',()=>{visible.delete(a.n);if(active===a.n)showArtifact(visible.size?[...visible].at(-1):null);else syncCardPicker();});scene.append(marker);
    });
    const camera=document.createElement('a-entity');camera.setAttribute('camera','');scene.append(camera);$('scene-host').append(scene);
    timeout=setTimeout(()=>{if(!$('loading-cover').hidden){$('loading-cover').hidden=true;$('status').textContent='Waiting for camera permission · allow access in Safari';}},18000);
  };
  addEventListener('pagehide',stop);
})();
