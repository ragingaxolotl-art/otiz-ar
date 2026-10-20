(function(){
  const $=id=>document.getElementById(id),T=window.AFRAME?.THREE,host=$('pose-preview'),key='otzi-teacher-poses-v1';
  let settings={},active=6,root,pivot,renderer,scene,camera,request=0;
  if(Classroom.hasSetup)settings={...Classroom.poses};
  else if(!Classroom.invalid)try{const saved=localStorage.getItem(key);if(saved)settings=Classroom.decode(saved);}catch{}
  const pose=()=>settings[active]||Classroom.factory(),clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v)),wrap=v=>((Math.round(v)+180)%360+360)%360-180;
  ARTIFACTS.forEach(a=>{const o=document.createElement('option');o.value=a.n;o.textContent=`${String(a.n).padStart(2,'0')} · ${a.name}`;$('artifact-select').append(o);});
  function share(){
    const url=Classroom.link('scan.html',settings);$('classroom-link').value=url;$('test-scanner').href=url;$('open-classroom').href=url;$('print-link').textContent=url;
    try{const qr=qrcode(0,'M');qr.addData(url);qr.make();const svg=qr.createSvgTag({cellSize:4,margin:16,scalable:true});$('classroom-qr').innerHTML=svg;$('print-qr-code').innerHTML=svg;}catch{$('classroom-qr').textContent='QR could not load. Use the classroom link below.';}
    const count=Object.values(settings).filter(p=>p.pitch||p.yaw||p.roll||p.size!==100).length;$('settings-count').textContent=`13 artifacts · ${count} customized starting ${count===1?'view':'views'}`;
  }
  function sync(){
    const p=pose();['yaw','pitch','roll','size'].forEach(k=>{$(k).value=p[k];$(k+'-value').textContent=p[k]+(k==='size'?'%':'°');});
    if(pivot){pivot.rotation.set(...Classroom.rotation(p));pivot.scale.setScalar(p.size/100);}share();
  }
  function save(){
    try{localStorage.setItem(key,Classroom.encode(settings));$('save-status').textContent='Saved on this device · classroom link and QR updated.';}catch{$('save-status').textContent='Browser storage unavailable. Copy the classroom link to keep your settings.';}
    $('copy-status').textContent='';sync();
  }
  function change(k,value){settings[active]={...pose(),[k]:value};save();}
  ['yaw','pitch','roll','size'].forEach(k=>$(k).oninput=()=>change(k,Number($(k).value)));
  function select(n){
    active=n;$('artifact-select').value=String(n);const a=ARTIFACTS.find(a=>a.n===n),id=++request;
    if(root){scene?.remove(root);root=null;pivot=null;}host.setAttribute('aria-label',`Starting view preview of ${a.name}`);sync();
    if(!T||!scene)return;$('preview-status').hidden=false;$('preview-status').textContent=`Loading ${a.name.toLowerCase()}…`;
    function attach(object){if(id!==request)return;root=new T.Group();root.scale.setScalar(.8);pivot=Classroom.frame(T,object);root.add(pivot);root.position.y=.03;scene.add(root);$('preview-status').hidden=true;sync();}
    if(a.modelUrl)ArtifactModels.load(T,n-1).then(attach).catch(()=>{if(id===request)$('preview-status').textContent='Model could not load. Select it again to retry.';});else attach(ArtifactModels.create(T,n-1));
  }
  $('artifact-select').onchange=()=>select(Number($('artifact-select').value));$('previous').onclick=()=>select(active===1?ARTIFACTS.length:active-1);$('next').onclick=()=>select(active===ARTIFACTS.length?1:active+1);
  $('lay-flat').onclick=()=>{settings[active]={...pose(),pitch:-90,roll:0};save();};$('teacher-4x').onclick=()=>change('size',400);
  $('restore-original').onclick=()=>{delete settings[active];save();};$('print-qr').onclick=()=>window.print();
  $('copy-link').onclick=async()=>{try{await navigator.clipboard.writeText($('classroom-link').value);$('copy-status').textContent='Classroom link copied.';}catch{$('classroom-link').focus();$('classroom-link').select();$('copy-status').textContent='Select and copy the classroom link above.';}};
  try{
    if(!T)throw new Error('3D library unavailable');renderer=new T.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=T.SRGBColorSpace;host.appendChild(renderer.domElement);scene=new T.Scene();camera=new T.PerspectiveCamera(42,1,.01,100);camera.position.set(2.3,3.4,4.7);camera.lookAt(0,.7,0);
    scene.add(new T.HemisphereLight(0xfff7df,0x566044,2.5));const light=new T.DirectionalLight(0xffe8c0,3);light.position.set(3,5,4);scene.add(light);
    const card=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({color:0xfafaf6,side:T.DoubleSide}));card.rotation.x=-Math.PI/2;scene.add(card);
    const square=new T.Mesh(new T.RingGeometry(.27,.44,4,1,Math.PI/4),new T.MeshBasicMaterial({color:0x28332a,side:T.DoubleSide}));square.rotation.x=-Math.PI/2;square.position.y=.002;scene.add(square);
    const resize=()=>{renderer.setSize(host.clientWidth,host.clientHeight,false);camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();};new ResizeObserver(resize).observe(host);resize();renderer.setAnimationLoop(()=>renderer.render(scene,camera));
  }catch{$('preview-status').textContent='3D preview needs WebGL. You can still set the controls and share the classroom link.';}
  const points=new Map();let gesture=null;
  function begin(){const p=[...points.values()];gesture=p.length?{...pose(),x:p[0].x,y:p[0].y,d:p.length===2?Math.hypot(p[1].x-p[0].x,p[1].y-p[0].y):0}:null;}
  host.addEventListener('pointerdown',e=>{if(points.size===2)return;e.preventDefault();host.setPointerCapture(e.pointerId);points.set(e.pointerId,{x:e.clientX,y:e.clientY});begin();});
  host.addEventListener('pointermove',e=>{if(!points.has(e.pointerId)||!gesture)return;e.preventDefault();points.set(e.pointerId,{x:e.clientX,y:e.clientY});const p=[...points.values()];if(p.length===1){settings[active]={...pose(),yaw:wrap(gesture.yaw+(p[0].x-gesture.x)*.5),pitch:wrap(gesture.pitch+(p[0].y-gesture.y)*.4)};save();}else if(gesture.d>0)change('size',clamp(Math.round(gesture.size*Math.hypot(p[1].x-p[0].x,p[1].y-p[0].y)/gesture.d),25,400));});
  ['pointerup','pointercancel','lostpointercapture'].forEach(type=>host.addEventListener(type,e=>{points.delete(e.pointerId);begin();}));
  addEventListener('blur',()=>{points.clear();gesture=null;});select(active);
})();
