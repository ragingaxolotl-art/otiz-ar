(function(){'use strict';
 const viewer=document.getElementById('nested-coffins-viewer'),closed=document.getElementById('nested-coffins-closed-viewer');if(!viewer||!closed)return;
 const status=document.getElementById('nested-coffins-status');let opened=true;
 function message(){status.textContent=opened?'Both lids moved aside. The inner coffin sits inside coffin 2, which sits inside the outer case.':'Coffins closed. Choose Open coffins to see all three nested together.';}
 function show(open){opened=open;viewer.style.display=open?'block':'none';closed.style.display=open?'none':'block';message();for(const b of document.querySelectorAll('[data-coffin-open]'))b.setAttribute('aria-pressed',String((b.dataset.coffinOpen==='true')===open));}
 for(const v of [viewer,closed]){v.addEventListener('load',message);v.addEventListener('error',()=>{status.textContent='The assembly could not load. Refresh or download the model below.';});}
 for(const b of document.querySelectorAll('[data-coffin-open]'))b.onclick=()=>show(b.dataset.coffinOpen==='true');
 document.getElementById('nested-coffins-reset').onclick=()=>{for(const v of [viewer,closed]){v.cameraOrbit='10deg 90deg 7m';v.cameraTarget='0.9m 0m -0.3m';v.fieldOfView='40deg';}show(true);};
})();
