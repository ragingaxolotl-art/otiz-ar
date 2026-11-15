(function(){
  const dialog=document.getElementById('egypt-dialog');let active=1;
  function show(n){active=(n+5)%6+1;document.getElementById('egypt-dialog-title').textContent='Artifact '+active;document.getElementById('egypt-dialog-number').textContent='PHOTO '+String(active).padStart(2,'0')+' / 06';const photo=document.getElementById('egypt-dialog-photo');photo.src='assets/egypt/reference-'+active+'.jpg';photo.alt='Class reference photograph for artifact '+active;document.getElementById('egypt-model-link').hidden=active!==4&&active!==5;document.querySelector('#egypt-model-link a').href=active===5?'#chest-model':'#senet-model';}
  document.querySelectorAll('[data-artifact]').forEach(button=>button.addEventListener('click',()=>{show(Number(button.dataset.artifact));dialog.showModal();}));
  document.querySelector('#egypt-model-link a').onclick=()=>dialog.close();
  ['senet','chest','dagger','sarcophagus','lotus-head','mannequin','funerary-bed'].forEach(id=>{
    const viewer=document.getElementById(id+'-viewer'),status=document.getElementById(id+'-status');
    viewer.addEventListener('load',()=>{status.textContent='Ready to explore. Drag to rotate or pinch to zoom.';});
    viewer.addEventListener('error',()=>{status.textContent='The 3D viewer could not load. Try refreshing, or use the model download below.';});
    document.getElementById(id+'-reset').onclick=()=>{viewer.cameraOrbit='30deg 60deg auto';viewer.cameraTarget='auto auto auto';viewer.fieldOfView='auto';};
  });
  document.getElementById('egypt-close').onclick=()=>dialog.close();
  document.getElementById('egypt-previous').onclick=()=>show(active-1);document.getElementById('egypt-next').onclick=()=>show(active+1);
  dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();show(active-1);}else if(event.key==='ArrowRight'){event.preventDefault();show(active+1);}});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
})();
