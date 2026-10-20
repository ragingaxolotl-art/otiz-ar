(function(){
  const $=id=>document.getElementById(id);let scene,active=null,started=false,revealed=false;const visible=new Set();let timeout;
  function error(message){clearTimeout(timeout);$('loading-cover').hidden=true;$('start-screen').hidden=false;$('error').textContent=message;$('error').hidden=false;$('start-camera').textContent='Try camera again';$('start-camera').disabled=false;if(scene){stop();location.hash='camera-error';}}
  function stop(){document.querySelectorAll('video').forEach(v=>v.srcObject?.getTracks().forEach(t=>t.stop()));if(scene){scene.remove();scene=null;}started=false;}
  function showArtifact(n){
    active=n;revealed=false;$('target-guide').hidden=n!==null;
    if(n===null){$('status').textContent='Point at a floor card · keep the full square visible';$('artifact-label').textContent='YOUR INVESTIGATION';$('artifact-name').textContent='Find the next clue';$('artifact-description').textContent='The model appears while its marker is visible. Move back or lower the iPad if you lose it.';$('reveal').hidden=true;$('artifact-question').hidden=true;return;}
    const a=ARTIFACTS[n-1];$('status').textContent=`Card ${n} detected · move slowly to explore`;$('artifact-label').textContent=`EVIDENCE ${String(n).padStart(2,'0')}`;$('artifact-name').textContent=`Artifact ${n}`;$('artifact-description').textContent='Look at its shape and construction. What could it be made from? What might it do?';$('artifact-question').textContent=a.question;$('artifact-question').hidden=false;$('reveal').hidden=false;$('reveal').textContent='Reveal artifact name';
  }
  $('reveal').onclick=()=>{if(active===null)return;revealed=!revealed;const a=ARTIFACTS[active-1];$('artifact-name').textContent=revealed?a.name:`Artifact ${active}`;$('artifact-description').textContent=revealed?a.fact:'Look at its shape and construction. What could it be made from? What might it do?';$('reveal').textContent=revealed?'Hide artifact name':'Reveal artifact name';};
  $('scale').oninput=()=>{const value=Number($('scale').value);$('scale-value').textContent=Math.round(value*100)+'%';document.querySelectorAll('[artifact-model]').forEach(el=>el.object3D.scale.setScalar(value));};
  function ready(){clearTimeout(timeout);$('loading-cover').hidden=true;$('status').textContent='Camera ready · point at a printed floor card';}
  window.addEventListener('camera-init',ready);window.addEventListener('camera-error',e=>{const code=e.detail?.error?.name||e.detail?.name||'';error(code==='NotAllowedError'?'Camera access was blocked. Allow camera access for this site in Safari, then try again.':'The camera could not start. Check Safari camera permission and close other apps using the camera.');});
  $('start-camera').onclick=()=>{
    if(started)return;$('error').hidden=true;
    if(!window.isSecureContext)return error('Camera access needs HTTPS. Open the published site address in Safari.');
    if(!navigator.mediaDevices?.getUserMedia)return error('This browser cannot provide camera access. Open the page in Safari on the iPad.');
    if(!window.AFRAME?.systems?.arjs)return error('The AR library has not loaded. Check your connection, refresh, and try again.');
    started=true;$('start-screen').hidden=true;$('loading-cover').hidden=false;
    if(!AFRAME.components['artifact-model'])AFRAME.registerComponent('artifact-model',{schema:{index:{type:'int',default:0}},init(){this.el.setObject3D('artifact',ArtifactModels.create(AFRAME.THREE,this.data.index));this.el.object3D.scale.setScalar(Number($('scale').value));},remove(){this.el.removeObject3D('artifact');}});
    scene=document.createElement('a-scene');scene.setAttribute('embedded','');scene.setAttribute('vr-mode-ui','enabled: false');scene.setAttribute('device-orientation-permission-ui','enabled: false');scene.setAttribute('renderer','alpha: true; antialias: true; precision: mediump;');
    scene.setAttribute('arjs','sourceType: webcam; debugUIEnabled: false; trackingMethod: best; detectionMode: mono_and_matrix; matrixCodeType: 3x3; cameraParametersUrl: vendor/camera_para.dat; sourceWidth: 1280; sourceHeight: 960; displayWidth: 1280; displayHeight: 960;');
    const amb=document.createElement('a-entity');amb.setAttribute('light','type: ambient; color: #fff4de; intensity: 1.8');scene.append(amb);const light=document.createElement('a-entity');light.setAttribute('light','type: directional; color: #ffffff; intensity: 2.2');light.setAttribute('position','1 4 2');scene.append(light);
    ARTIFACTS.forEach((a,i)=>{
      const marker=document.createElement('a-marker');marker.setAttribute('type','barcode');marker.setAttribute('value',String(a.n));marker.setAttribute('size','1');marker.setAttribute('emitevents','true');marker.setAttribute('smooth','true');marker.setAttribute('smooth-count','5');marker.setAttribute('smooth-tolerance','0.01');marker.setAttribute('smooth-threshold','2');
      const el=document.createElement('a-entity');el.setAttribute('artifact-model',`index: ${i}`);el.setAttribute('position','0 0.03 0');marker.append(el);
      marker.addEventListener('markerFound',()=>{ready();visible.add(a.n);if(active!==a.n)showArtifact(a.n);});
      marker.addEventListener('markerLost',()=>{visible.delete(a.n);if(active===a.n)showArtifact(visible.size?[...visible].at(-1):null);});scene.append(marker);
    });
    const camera=document.createElement('a-entity');camera.setAttribute('camera','');scene.append(camera);$('scene-host').append(scene);
    timeout=setTimeout(()=>{if(!$('loading-cover').hidden){$('loading-cover').hidden=true;$('status').textContent='Waiting for camera permission · allow access in Safari';}},18000);
  };
  addEventListener('pagehide',stop);
})();
