/* Screen controls shared by touch, keyboard and mouse. */
(function(root){'use strict';root.TombInterface={create({focus,pause,resume,message}){
 const $=id=>document.getElementById(id),tools=$('view-tools'),toggle=$('interface-toggle'),fullscreen=$('fullscreen-button'),dialog=$('fullscreen-help');
 const appMode=()=>navigator.standalone===true||matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches;
 const activeFullscreen=()=>document.fullscreenElement||document.webkitFullscreenElement;
 let quiet=false;try{quiet=localStorage.getItem('tomb-hide-interface')==='true'}catch{}
 function applyQuiet(){document.body.classList.toggle('quiet-view',quiet);$('interface-label').textContent=quiet?'Show interface':'Hide interface';toggle.setAttribute('aria-pressed',String(quiet));toggle.title=quiet?'Show menus and action buttons (H)':'Hide menus and action buttons; keep direction arrows (H)';}
 function toggleInterface(){quiet=!quiet;applyQuiet();try{localStorage.setItem('tomb-hide-interface',String(quiet))}catch{}focus();}
 function syncFullscreen(){$('fullscreen-label').textContent=activeFullscreen()?'Exit full screen':appMode()?'App view':'Full screen';fullscreen.setAttribute('aria-pressed',String(!!activeFullscreen()||appMode()));}
 function showHelp(){pause();dialog.showModal();}
 async function toggleFullscreen(){
  try{if(activeFullscreen()){const exit=document.exitFullscreen||document.webkitExitFullscreen;if(exit)await exit.call(document);}
   else if(appMode()){message('Already open in app view.');}
   else{const enter=document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen;if(enter)await enter.call(document.documentElement);else{showHelp();return;}}
  }catch{showHelp();return;}syncFullscreen();focus();
 }
 toggle.onclick=toggleInterface;fullscreen.onclick=toggleFullscreen;$('close-fullscreen-help').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{resume();focus();});
 for(const event of ['fullscreenchange','webkitfullscreenchange'])document.addEventListener(event,syncFullscreen);
 window.addEventListener('keydown',e=>{if(tools.hidden||e.repeat||e.ctrlKey||e.metaKey||e.altKey||document.querySelector('dialog[open]')||e.target.closest?.('input,select,textarea,[contenteditable="true"]'))return;const key=e.key.toLowerCase();if(key==='h'){e.preventDefault();toggleInterface();}else if(key==='f'){e.preventDefault();toggleFullscreen();}});
 applyQuiet();syncFullscreen();return{start(){tools.hidden=false;syncFullscreen();}};
}};})(window);
