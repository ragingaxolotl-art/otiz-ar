(function(){
  const dialog=document.getElementById('egypt-dialog');let active=1;
  function show(n){active=(n+5)%6+1;document.getElementById('egypt-dialog-title').textContent='Artifact '+active;document.getElementById('egypt-dialog-number').textContent='EVIDENCE '+String(active).padStart(2,'0')+' / 06';const photo=document.getElementById('egypt-dialog-photo');photo.src='assets/egypt/reference-'+active+'.jpg';photo.alt='Class reference photograph for artifact '+active;}
  document.querySelectorAll('[data-artifact]').forEach(button=>button.addEventListener('click',()=>{show(Number(button.dataset.artifact));dialog.showModal();}));
  document.getElementById('egypt-close').onclick=()=>dialog.close();
  document.getElementById('egypt-previous').onclick=()=>show(active-1);document.getElementById('egypt-next').onclick=()=>show(active+1);
  dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();show(active-1);}else if(event.key==='ArrowRight'){event.preventDefault();show(active+1);}});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
})();
