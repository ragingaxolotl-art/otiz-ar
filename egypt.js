(function(){
  const dialog=document.getElementById('egypt-dialog');let active=1;
  function show(n){active=(n+5)%6+1;document.getElementById('egypt-dialog-title').textContent='Artifact '+active;document.getElementById('egypt-dialog-number').textContent='PHOTO '+String(active).padStart(2,'0')+' / 06';const photo=document.getElementById('egypt-dialog-photo');photo.src='assets/egypt/reference-'+active+'.jpg';photo.alt='Class reference photograph for artifact '+active;const links={1:'#throwing-sticks-model',2:'#headrest-ai-model',3:'#fan-ai-model',4:'#senet-model',5:'#chest-model',6:'#chariot-ai-model'};document.getElementById('egypt-model-link').hidden=!links[active];document.querySelector('#egypt-model-link a').href=links[active]||'#egypt-artifacts';}
  document.querySelectorAll('[data-artifact]').forEach(button=>button.addEventListener('click',()=>{show(Number(button.dataset.artifact));dialog.showModal();}));
  document.querySelector('#egypt-model-link a').onclick=()=>dialog.close();
  document.querySelectorAll('model-viewer[id]').forEach(viewer=>{
    const id=viewer.id.replace(/-viewer$/,'');
    const status=document.getElementById(id+'-status');if(!status)return;
    viewer.addEventListener('load',()=>{status.textContent='Ready to explore. Drag to rotate or pinch to zoom.';});
    viewer.addEventListener('error',()=>{status.textContent='The 3D viewer could not load. Try refreshing, or use the model download below.';});
    const reset=document.getElementById(id+'-reset');if(reset)reset.onclick=()=>{viewer.cameraOrbit='30deg 60deg auto';viewer.cameraTarget='auto auto auto';viewer.fieldOfView='auto';};
  });
  document.querySelectorAll('[data-sticks-orbit]').forEach(button=>button.onclick=()=>document.getElementById('throwing-sticks-viewer').cameraOrbit=button.dataset.sticksOrbit);
  document.getElementById('egypt-close').onclick=()=>dialog.close();
  document.getElementById('egypt-previous').onclick=()=>show(active-1);document.getElementById('egypt-next').onclick=()=>show(active+1);
  dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();show(active-1);}else if(event.key==='ArrowRight'){event.preventDefault();show(active+1);}});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
})();
