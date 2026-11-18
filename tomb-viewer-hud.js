/* One logical HUD, drawn identically into both eye views before lens correction. */
(function(root){'use strict';root.TombViewerHUD={create({THREE,canvas,settings,active,move,adjustWheel}){
 const source=document.querySelector('.fit-eye'),panel=source.querySelector('.vr-eye-panel'),surface=document.createElement('canvas'),ctx=surface.getContext('2d'),texture=new THREE.CanvasTexture(surface);
 texture.colorSpace=THREE.SRGBColorSpace;texture.minFilter=THREE.LinearFilter;texture.generateMipmaps=false;
 let dirty=true,lastDraw=-Infinity,buttons=[],cursor=null,press=null,hover=null;
 const invalidate=()=>dirty=true;
 new MutationObserver(invalidate).observe(document.getElementById('vr-controls'),{subtree:true,attributes:true,childList:true,characterData:true});
 new MutationObserver(invalidate).observe(document.body,{attributes:true,attributeFilter:['class','data-fit-mode']});
 new ResizeObserver(invalidate).observe(source);window.addEventListener('resize',invalidate);
 function roundBox(r,s){ctx.beginPath();ctx.roundRect(r.x,r.y,r.width,r.height,Math.min(parseFloat(s.borderTopLeftRadius)||0,r.width/2,r.height/2));}
 function paint(el){
  const s=getComputedStyle(el),r=el.getBoundingClientRect();if(s.display==='none'||s.visibility==='hidden'||!r.width||!r.height)return;
  if(s.backgroundColor!=='rgba(0, 0, 0, 0)'&&s.backgroundColor!=='transparent'){ctx.fillStyle=s.backgroundColor;roundBox(r,s);ctx.fill();}
  if(parseFloat(s.borderTopWidth)>0&&s.borderTopStyle!=='none'){ctx.strokeStyle=s.borderTopColor;ctx.lineWidth=parseFloat(s.borderTopWidth);ctx.setLineDash(s.borderTopStyle==='dashed'?[4,4]:[]);roundBox(r,s);ctx.stroke();ctx.setLineDash([]);}
  ctx.save();if(['auto','hidden','scroll'].includes(s.overflowY)){ctx.beginPath();ctx.rect(r.x,r.y,r.width,r.height);ctx.clip();}
  if(el.tagName==='BUTTON'){const clip=panel.getBoundingClientRect();if(!panel.contains(el)||(r.bottom>clip.top&&r.top<clip.bottom))buttons.push({el,r:{x:r.x,y:r.y,width:r.width,height:r.height},clip:panel.contains(el)?clip:null});}
  for(const node of el.childNodes){if(node.nodeType===1)paint(node);else if(node.nodeType===3){
   ctx.fillStyle=s.color;ctx.font=`${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;ctx.textBaseline='top';ctx.textAlign='left';
   const range=document.createRange();for(const m of node.textContent.matchAll(/\S+/g)){range.setStart(node,m.index);range.setEnd(node,m.index+m[0].length);for(const box of range.getClientRects())ctx.fillText(m[0],box.x,box.y);}
  }}ctx.restore();
 }
 function update(time){if(!active()||!dirty||time-lastDraw<70)return;dirty=false;lastDraw=time;
  const r=source.getBoundingClientRect(),ratio=Math.min(Math.max(devicePixelRatio||1,2),3),w=Math.round(r.width*ratio),h=Math.round(r.height*ratio);if(surface.width!==w||surface.height!==h){surface.width=w;surface.height=h;}
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,w,h);ctx.setTransform(ratio,0,0,ratio,-r.x*ratio,-r.y*ratio);buttons=[];for(const el of source.children)paint(el);
  if(cursor){ctx.fillStyle='#ffffff';ctx.strokeStyle='#17382e';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(cursor.x,cursor.y);ctx.lineTo(cursor.x+3,cursor.y+13);ctx.lineTo(cursor.x+6,cursor.y+8);ctx.lineTo(cursor.x+12,cursor.y+7);ctx.closePath();ctx.fill();ctx.stroke();}
  texture.needsUpdate=true;
 }
 function point(e){const r=canvas.getBoundingClientRect(),eye=e.clientX-r.left<r.width/2?0:1,localX=((e.clientX-r.left)/(r.width/2))-eye,localY=1-(e.clientY-r.top)/r.height,uv=root.TombCore.viewerSample(localX,localY,eye,settings()),s=source.getBoundingClientRect();return{x:s.x+uv.x*s.width,y:s.y+(1-uv.y)*s.height};}
 function hit(p){return buttons.find(b=>p.x>=b.r.x&&p.x<=b.r.x+b.r.width&&p.y>=b.r.y&&p.y<=b.r.y+b.r.height&&(!b.clip||(p.y>=b.clip.top&&p.y<=b.clip.bottom)));}
 function highlight(el){if(hover===el)return;if(hover)hover.classList.remove('vr-hover');hover=el;if(hover)hover.classList.add('vr-hover');dirty=true;}
 function pointerMove(e){if(!active())return false;cursor=point(e);highlight(hit(cursor)?.el);dirty=true;return !!press;}
 function pointerDown(e){if(!active()||e.button!==0)return false;cursor=point(e);const b=hit(cursor);highlight(b?.el);dirty=true;if(!b)return false;press={id:e.pointerId,button:b.el};canvas.setPointerCapture(e.pointerId);if(b.el.dataset.move)move(b.el.dataset.move,1);e.preventDefault();return true;}
 function pointerUp(e,cancel=false){if(!press||press.id!==e.pointerId)return false;const b=press.button;press=null;if(b.dataset.move)move(b.dataset.move,0);else if(!cancel&&hit(point(e))?.el===b)b.click();dirty=true;e.preventDefault();return true;}
 function clear(){if(press?.button.dataset.move)move(press.button.dataset.move,0);press=null;cursor=null;highlight(null);dirty=true;}
 function wheel(e){
  if(!active()||e.ctrlKey||e.metaKey)return false;const p=point(e),r=panel.getBoundingClientRect();
  const inside=p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom;
  if(inside)for(const row of source.querySelectorAll('.view-row')){const box=row.getBoundingClientRect();if(box.width&&box.height&&p.x>=box.left&&p.x<=box.right&&p.y>=box.top&&p.y<=box.bottom){if(adjustWheel(e,row.querySelector('[data-view-adjust]').dataset.viewAdjust))return true;}}
  if(inside&&panel.scrollHeight>panel.clientHeight+1){panel.scrollTop+=root.TombCore.wheelPixels(e.deltaY,e.deltaMode,innerHeight);dirty=true;e.preventDefault();return true;}
  return adjustWheel(e);
 }

 panel.addEventListener('scroll',invalidate);window.addEventListener('blur',clear);document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});
 return{texture,update,pointerDown,pointerMove,pointerUp,clear,wheel,invalidate};
}};})(window);
