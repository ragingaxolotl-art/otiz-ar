/* Live Cardboard fit controls; the scene remains visible while adjusting. */
(function(root){'use strict';root.TombViewer={create({change,pause,resume,recenter,focus}){
 let settings=root.TombCore.viewerSettings(),open=false;try{settings=root.TombCore.viewerSettings(JSON.parse(localStorage.getItem('tomb-viewer-fit')||'null'))}catch{}
 function apply(){change(settings);for(const[key,text]of Object.entries({lens:settings.lens.toFixed(2),fov:Math.round(settings.fov)+'°',eye:Math.round(settings.eye*1000)+' mm',vertical:Math.round(settings.vertical*100)+'%'}))for(const el of document.querySelectorAll('[data-view-value="'+key+'"]'))el.textContent=text;for(const el of document.querySelectorAll('[data-view-swap]'))el.textContent=settings.swap?'Eyes swapped · change':'Swap eyes';try{localStorage.setItem('tomb-viewer-fit',JSON.stringify(settings))}catch{}}
 function set(value){settings=root.TombCore.viewerSettings(value);apply();}
 function toggle(next=!open){if(next===open)return;open=next;document.body.classList.toggle('viewer-tuning',open);for(const el of document.querySelectorAll('[data-view-toggle]')){el.textContent=open?'Done':'View & lenses';el.setAttribute('aria-pressed',String(open));}if(open)pause();else{resume();focus();}}
 for(const el of document.querySelectorAll('[data-view-toggle]'))el.onclick=()=>toggle();
 for(const el of document.querySelectorAll('[data-view-adjust]'))el.onclick=()=>set({...settings,[el.dataset.viewAdjust]:settings[el.dataset.viewAdjust]+Number(el.dataset.viewStep)});
 for(const el of document.querySelectorAll('[data-view-swap]'))el.onclick=()=>set({...settings,swap:!settings.swap});
 for(const el of document.querySelectorAll('[data-view-reset]'))el.onclick=()=>{set(root.TombCore.viewerSettings());recenter();};
 apply();return{set,toggle,close:()=>toggle(false),get open(){return open;}};
}};})(window);
