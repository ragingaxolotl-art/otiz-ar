/* Saved Cardboard alignment and visible control area. No movement during fitting. */
(function(root){'use strict';root.TombViewer={renderEyes(renderer,target,left,right,draw){
 // Target rectangles are physical pixels; renderer.setViewport would scale twice.
 const w=target.width,h=target.height,half=Math.floor(w/2);target.scissorTest=true;
 target.viewport.set(0,0,half,h);target.scissor.copy(target.viewport);renderer.setRenderTarget(target);draw(left);
 target.viewport.set(half,0,w-half,h);target.scissor.copy(target.viewport);renderer.setRenderTarget(target);draw(right);
 renderer.setRenderTarget(null);
},create({change,test=()=>{},pause,resume,recenter,focus}){
 let settings=root.TombCore.viewerSettings(),open=false,mode='room';const checked=new Set();
 try{settings=root.TombCore.viewerSettings(JSON.parse(localStorage.getItem('tomb-viewer-fit')||'null'))}catch{}
 function apply(){
  change(settings);document.documentElement.style.setProperty('--fit-width',(100-settings.insetX*200)+'%');document.documentElement.style.setProperty('--fit-bottom',(settings.insetY*100)+'vh');document.documentElement.style.setProperty('--fit-height',(100-settings.insetY*200)+'vh');
  for(const[key,text]of Object.entries({lens:settings.lens.toFixed(2),fov:Math.round(settings.fov)+'°',eye:Math.round(settings.eye*1000)+' mm',vertical:Math.round(settings.vertical*100)+'%',horizontal:(settings.horizontal*100).toFixed(1)+'%',balance:(settings.balance*100).toFixed(1)+'%',insetX:Math.round(settings.insetX*100)+'%',insetY:Math.round(settings.insetY*100)+'%'}))for(const el of document.querySelectorAll('[data-view-value="'+key+'"]'))el.textContent=text;
  for(const el of document.querySelectorAll('[data-view-swap]'))el.textContent=settings.swap?'Eyes swapped · change':'Swap eyes';
  try{localStorage.setItem('tomb-viewer-fit',JSON.stringify(settings))}catch{}
 }
 const eyes=Array.from(document.querySelectorAll('.fit-eye'));
 function edgeKey(el){return eyes.indexOf(el.closest('.fit-eye'))+':'+el.dataset.edge;}
 function edgeStatus(){for(const el of document.querySelectorAll('[data-edge]'))el.setAttribute('aria-pressed',String(checked.has(edgeKey(el))));for(const [index,eye]of eyes.entries()){const count=[1,2,3,4].filter(n=>checked.has(index+':'+n)).length;eye.querySelector('.edge-result').textContent=count+' / 4 buttons tested in this eye';}}

 function set(value){const next=root.TombCore.viewerSettings(value);if(next.insetX!==settings.insetX||next.insetY!==settings.insetY){checked.clear();edgeStatus();}settings=next;apply();}
 function setMode(value){mode=value;document.body.dataset.fitMode=mode;test(open?mode:'room');for(const el of document.querySelectorAll('[data-fit-mode]'))el.setAttribute('aria-pressed',String(el.dataset.fitMode===mode));}
 function toggle(next=!open){if(next===open)return;open=next;document.body.classList.toggle('viewer-tuning',open);setMode('room');for(const el of document.querySelectorAll('[data-view-toggle]')){el.textContent=open?'Save fit':'View & lenses';el.setAttribute('aria-pressed',String(open));}if(open)pause();else{resume();focus();}}
 for(const el of document.querySelectorAll('[data-view-toggle]'))el.onclick=()=>toggle();
 for(const el of document.querySelectorAll('[data-view-adjust]'))el.onclick=()=>set({...settings,[el.dataset.viewAdjust]:settings[el.dataset.viewAdjust]+Number(el.dataset.viewStep)});
 for(const el of document.querySelectorAll('[data-fit-mode]'))el.onclick=()=>{if(!open)toggle(true);setMode(el.dataset.fitMode===mode?'room':el.dataset.fitMode);};
 for(const el of document.querySelectorAll('[data-edge]'))el.onclick=()=>{checked.add(edgeKey(el));edgeStatus();};
 for(const el of document.querySelectorAll('[data-view-swap]'))el.onclick=()=>set({...settings,swap:!settings.swap});
 for(const el of document.querySelectorAll('[data-view-reset]'))el.onclick=()=>{set(root.TombCore.viewerSettings());checked.clear();edgeStatus();recenter();};
 apply();setMode('room');return{set,toggle,close:()=>toggle(false),get open(){return open;}};
}};})(window);
