(function(){
  const $=id=>document.getElementById(id),T=window.AFRAME?.THREE,host=$('model-viewer');
  let renderer,scene,camera,model,active=5,angle=-.55,pitch=.15,dist=3.6,rotating=!matchMedia('(prefers-reduced-motion: reduce)').matches;
  const grid=$('artifact-grid'),dialog=$('artifact-dialog');
  ARTIFACTS.forEach((a,i)=>{
    const b=document.createElement('button');b.className='artifact-card'+(i===active?' selected':'');b.dataset.index=i;
    b.setAttribute('aria-label',`Examine artifact ${a.n}: ${a.name}`);
    b.innerHTML=`<img loading="lazy" src="assets/reference-${a.n}.jpg" alt="Reference photograph: ${a.name}"><span class="card-info"><span class="card-number">OBJECT ${String(a.n).padStart(2,'0')}</span><span class="card-title">${a.name}</span><span class="card-material">${a.material}</span></span><span class="card-arrow" aria-hidden="true">↗</span>`;
    b.onclick=()=>{select(i);$('dialog-number').textContent=`OBJECT ${String(a.n).padStart(2,'0')}`;$('dialog-name').textContent=a.name;$('dialog-fact').textContent=a.fact;$('dialog-photo').src=`assets/reference-${a.n}.jpg`;$('dialog-photo').alt=`Reference photograph of ${a.name}`;$('dialog-question').textContent=a.question;dialog.showModal();};grid.append(b);
  });
  $('close-dialog').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  $('dialog-examine').onclick=()=>{dialog.close();host.scrollIntoView({block:'center',behavior:'smooth'});};
  function select(i){
    active=i;const a=ARTIFACTS[i];$('active-number').textContent=String(a.n).padStart(2,'0');$('active-name').textContent=a.name;$('active-material').textContent=a.material;host.setAttribute('aria-label',`Interactive 3D teaching model of ${a.name}`);
    document.querySelectorAll('.artifact-card').forEach((b,k)=>b.classList.toggle('selected',k===i));
    if(!scene)return;if(model)scene.remove(model);model=ArtifactModels.create(T,i);model.position.y=.22;scene.add(model);angle=-.55;pitch=.15;dist=3.6;
  }
  if(!T){$('viewer-loading').textContent='3D could not load. Refresh the page to try again.';return;}
  try{
    renderer=new T.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=T.SRGBColorSpace;host.appendChild(renderer.domElement);$('viewer-loading').remove();
    scene=new T.Scene();camera=new T.PerspectiveCamera(37,1,.01,100);
    scene.add(new T.HemisphereLight(0xfff7df,0x566044,2.5));const sun=new T.DirectionalLight(0xffe8c0,3);sun.position.set(3,5,4);scene.add(sun);const fill=new T.DirectionalLight(0xc7d1e2,1.6);fill.position.set(-3,3,-4);scene.add(fill);
    const disc=new T.Mesh(new T.CircleGeometry(.85,64),new T.MeshBasicMaterial({color:0xc4c9b7,transparent:true,opacity:.38}));disc.rotation.x=-Math.PI/2;disc.position.y=-.025;scene.add(disc);
    const orbit=new T.Mesh(new T.RingGeometry(.93,.936,64),new T.MeshBasicMaterial({color:0xbac1ab,transparent:true,opacity:.6,side:T.DoubleSide}));orbit.rotation.x=-Math.PI/2;orbit.position.y=-.02;scene.add(orbit);
    select(active);
    const resize=()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};new ResizeObserver(resize).observe(host);resize();
    let last=performance.now();renderer.setAnimationLoop(now=>{const dt=Math.min((now-last)/1000,.05);last=now;if(rotating)angle+=dt*.2;camera.position.set(Math.sin(angle)*dist,1.65+pitch*dist,Math.cos(angle)*dist);camera.lookAt(0,.85,0);renderer.render(scene,camera);});
    const points=new Map();let startDist=0,startZoom=dist;
    host.addEventListener('pointerdown',e=>{host.setPointerCapture(e.pointerId);points.set(e.pointerId,[e.clientX,e.clientY]);if(points.size===2){const p=[...points.values()];startDist=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1]);startZoom=dist;}});
    host.addEventListener('pointermove',e=>{if(!points.has(e.pointerId))return;const old=points.get(e.pointerId);points.set(e.pointerId,[e.clientX,e.clientY]);if(points.size===1){angle-=(e.clientX-old[0])*.009;pitch=Math.max(-.25,Math.min(.65,pitch+(e.clientY-old[1])*.004));}else if(points.size===2){const p=[...points.values()];const d=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1]);dist=Math.max(2.1,Math.min(6,startZoom*startDist/Math.max(d,1)));}});
    ['pointerup','pointercancel'].forEach(ev=>host.addEventListener(ev,e=>points.delete(e.pointerId)));
    host.addEventListener('wheel',e=>{e.preventDefault();dist=Math.max(2.1,Math.min(6,dist+e.deltaY*.003));},{passive:false});
    $('rotate-model').onclick=()=>{rotating=!rotating;syncRotate();};
    $('reset-model').onclick=()=>{angle=-.55;pitch=.15;dist=3.6;};
    function syncRotate(){$('rotate-model').textContent=rotating?'Ⅱ':'▷';$('rotate-model').setAttribute('aria-label',rotating?'Pause model rotation':'Start model rotation');$('rotate-model').setAttribute('aria-pressed',String(!rotating));}syncRotate();
    window.fieldLab={select,get active(){return active},get scene(){return scene}};
  }catch(err){console.error(err);const p=document.createElement('p');p.textContent='3D needs WebGL. Try Safari on an updated iPad.';p.style.cssText='padding:90px 25px';host.appendChild(p);}
})();
