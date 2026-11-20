/* One logical HUD, drawn identically into both eye views before lens correction. */
(function(root){'use strict';
// Hit testing uses the same rectangles that were drawn, with modest touch slop.
function findButton(buttons,p,slop=0){
 if(!p)return null;const eligible=b=>!b.el.disabled&&(!b.clip||(p.x>=b.clip.left&&p.x<=b.clip.right&&p.y>=b.clip.top&&p.y<=b.clip.bottom));
 for(let i=buttons.length-1;i>=0;i--){const b=buttons[i],r=b.r;if(eligible(b)&&p.x>=r.x&&p.x<=r.x+r.width&&p.y>=r.y&&p.y<=r.y+r.height)return b;}
 if(!slop)return null;let best=null,distance=Infinity;
 for(const b of buttons){const r=b.r;if(!eligible(b)||p.x<r.x-slop||p.x>r.x+r.width+slop||p.y<r.y-slop||p.y>r.y+r.height+slop)continue;const d=(p.x-r.x-r.width/2)**2+(p.y-r.y-r.height/2)**2;if(d<distance){best=b;distance=d;}}
 return best;
}
function createInput({active,frame,point,move,position=()=>{},hover=()=>{},invalidate=()=>{},capture=()=>{},activate=b=>b.click(),clock=()=>performance.now()}){
 let press=null,gesture=null,lastPointerClick=null;
 function prevent(e){e.preventDefault?.();}
 function remember(e){lastPointerClick={x:e.clientX,y:e.clientY,until:clock()+900};}
 function down(e){
  if(!active()||e.button!==0)return false;const f=frame(),p=point(e,f),b=findButton(f?.buttons||[],p,6),r=f?.panel;
  const owns=!!b||!!(p&&r&&p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom);gesture={id:e.pointerId,x:e.clientX,y:e.clientY};position(p);hover(b?.el);invalidate();
  if(!owns)return false;press={id:e.pointerId,button:b?.el,frame:f,x:e.clientX,y:e.clientY};try{capture(e.pointerId);}catch{}if(press.button?.dataset.move)move(press.button.dataset.move,1);prevent(e);return true;
 }
 function motion(e){if(!active())return false;const f=frame(),p=point(e,f);position(p);hover(findButton(f?.buttons||[],p,6)?.el);invalidate();return !!press;}
 function up(e,cancel=false){
  const owned=press?.id===e.pointerId,tracked=gesture?.id===e.pointerId;if(!owned&&!tracked)return false;
  const saved=press;press=null;gesture=null;remember(e);
  if(!owned)return false;const b=saved.button;if(b?.dataset.move)move(b.dataset.move,0);
  else if(b&&!cancel){const p=point(e,saved.frame),same=findButton(saved.frame?.buttons||[],p,10)?.el===b;if(same&&!b.disabled)activate(b);}
  invalidate();prevent(e);return true;
 }
 function click(e){
  if(!active()||(e.button!==undefined&&e.button!==0))return false;
  if(lastPointerClick&&clock()<=lastPointerClick.until&&Math.hypot(e.clientX-lastPointerClick.x,e.clientY-lastPointerClick.y)<=32){prevent(e);return true;}
  const f=frame(),p=point(e,f),b=findButton(f?.buttons||[],p,6),r=f?.panel;
  position(p);hover(b?.el);invalidate();
  if(gesture){if(press?.button?.dataset.move)move(press.button.dataset.move,0);press=null;gesture=null;remember(e);}
  if(b){if(!b.el.dataset.move)activate(b.el);prevent(e);return true;}
  if(p&&r&&p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom){prevent(e);return true;}return false;
 }
 function clear(){if(press?.button?.dataset.move)move(press.button.dataset.move,0);if(gesture)remember({clientX:gesture.x,clientY:gesture.y});press=null;gesture=null;position(null);hover(null);invalidate();}
 return{pointerDown:down,pointerMove:motion,pointerUp:up,click,clear};
}

root.TombViewerHUD={findButton,createInput,create({THREE,canvas,settings,active,move,adjustWheel}){
 const source=document.querySelector('.fit-eye'),panel=source.querySelector('.vr-eye-panel'),surface=document.createElement('canvas'),ctx=surface.getContext('2d'),texture=new THREE.CanvasTexture(surface);
 texture.colorSpace=THREE.SRGBColorSpace;texture.minFilter=THREE.LinearFilter;texture.generateMipmaps=false;
 let dirty=true,lastDraw=-Infinity,buttons=[],rows=[],drawn=null,cursor=null,hover=null;
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
  if(el.classList.contains('view-row'))rows.push({key:el.querySelector('[data-view-adjust]').dataset.viewAdjust,r});
  if(el.tagName==='BUTTON'){const clip=panel.getBoundingClientRect();if(!panel.contains(el)||(r.bottom>clip.top&&r.top<clip.bottom))buttons.push({el,r:{x:r.x,y:r.y,width:r.width,height:r.height},clip:panel.contains(el)?clip:null});}
  for(const node of el.childNodes){if(node.nodeType===1)paint(node);else if(node.nodeType===3){
   ctx.fillStyle=s.color;ctx.font=`${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;ctx.textBaseline='top';ctx.textAlign='left';
   const range=document.createRange();for(const m of node.textContent.matchAll(/\S+/g)){range.setStart(node,m.index);range.setEnd(node,m.index+m[0].length);for(const box of range.getClientRects())ctx.fillText(m[0],box.x,box.y);}
  }}ctx.restore();
 }
 function update(time){if(!active()||!dirty||time-lastDraw<70)return;dirty=false;lastDraw=time;
  const r=source.getBoundingClientRect(),ratio=Math.min(Math.max(devicePixelRatio||1,2),3),w=Math.round(r.width*ratio),h=Math.round(r.height*ratio);if(surface.width!==w||surface.height!==h){surface.width=w;surface.height=h;}
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,w,h);ctx.setTransform(ratio,0,0,ratio,-r.x*ratio,-r.y*ratio);buttons=[];rows=[];for(const el of source.children)paint(el);drawn={source:r,panel:panel.getBoundingClientRect(),buttons,rows};
  if(cursor){ctx.fillStyle='#ffffff';ctx.strokeStyle='#17382e';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(cursor.x,cursor.y);ctx.lineTo(cursor.x+3,cursor.y+13);ctx.lineTo(cursor.x+6,cursor.y+8);ctx.lineTo(cursor.x+12,cursor.y+7);ctx.closePath();ctx.fill();ctx.stroke();}
  texture.needsUpdate=true;
 }
 function point(e,f=drawn){if(!f)return null;const r=canvas.getBoundingClientRect(),eye=e.clientX-r.left<r.width/2?0:1,localX=((e.clientX-r.left)/(r.width/2))-eye,localY=1-(e.clientY-r.top)/r.height,uv=root.TombCore.viewerSample(localX,localY,eye,settings()),s=f.source;return{x:s.x+uv.x*s.width,y:s.y+(1-uv.y)*s.height};}
 function highlight(el){if(hover===el)return;if(hover)hover.classList.remove('vr-hover');hover=el;if(hover)hover.classList.add('vr-hover');dirty=true;}
 const input=createInput({active,frame:()=>drawn,point,move,position:p=>{cursor=p;dirty=true;},hover:highlight,invalidate,capture:id=>canvas.setPointerCapture?.(id)});
 function wheel(e){
  if(!active()||e.ctrlKey||e.metaKey)return false;const p=point(e),r=drawn?.panel;if(!p||!r)return false;
  const inside=p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom;
  if(inside)for(const row of drawn.rows){const box=row.r;if(p.x>=box.left&&p.x<=box.right&&p.y>=box.top&&p.y<=box.bottom){if(adjustWheel(e,row.key))return true;}}

  if(inside&&panel.scrollHeight>panel.clientHeight+1){panel.scrollTop+=root.TombCore.wheelPixels(e.deltaY,e.deltaMode,innerHeight);dirty=true;e.preventDefault();return true;}
  return adjustWheel(e);
 }

 panel.addEventListener('scroll',invalidate);window.addEventListener('blur',input.clear);document.addEventListener('visibilitychange',()=>{if(document.hidden)input.clear();});
 return{texture,update,...input,wheel,invalidate};
}};})(window);
