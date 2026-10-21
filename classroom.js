/* Shared card settings published through the repository. No student account is needed. */
(function(){
  const factory=n=>({pitch:0,yaw:0,roll:0,size:100,screenZoom:100,lengthCm:LIFE_SIZES[n]?.cm||50});
  function validate(input){
    if(!input||input.version!==2||!Number.isFinite(input.markerWidthCm)||input.markerWidthCm<2||input.markerWidthCm>40||!Array.isArray(input.poses)||input.poses.length>ARTIFACTS.length)throw new Error('Invalid saved settings');
    if(typeof input.revision!=='string'||input.revision.length>100||!Number.isSafeInteger(input.sequence)||input.sequence<0)throw new Error('Invalid save revision');
    const poses={},seen=new Set();
    input.poses.forEach(row=>{
      if(!Array.isArray(row)||row.length!==6||!row.every(Number.isFinite))throw new Error('Invalid artifact settings');
      const [n,pitch,yaw,roll,size,lengthCm]=row;
      if(!ARTIFACTS.some(a=>a.n===n)||seen.has(n)||[pitch,yaw,roll].some(v=>v< -180||v>180)||size<10||size>800||lengthCm<1||lengthCm>500)throw new Error('Artifact settings out of range');
      seen.add(n);poses[n]={pitch,yaw,roll,size,lengthCm};
    });
    const screen=new Map();if(input.screenZooms!==undefined){if(!Array.isArray(input.screenZooms)||input.screenZooms.length>ARTIFACTS.length)throw new Error('Invalid screen zooms');for(const row of input.screenZooms){if(!Array.isArray(row)||row.length!==2||!ARTIFACTS.some(a=>a.n===row[0])||screen.has(row[0])||!Number.isFinite(row[1])||row[1]<10||row[1]>800)throw new Error('Invalid screen starting zoom');screen.set(row[0],row[1]);}}
    return {version:2,revision:input.revision,sequence:input.sequence,markerWidthCm:input.markerWidthCm,poses:ARTIFACTS.map(a=>{const p=poses[a.n]||factory(a.n);return [a.n,p.pitch,p.yaw,p.roll,p.size,p.lengthCm];}),screenZooms:ARTIFACTS.map(a=>[a.n,screen.get(a.n)||100])};
  }
  function make(settings,markerWidthCm,revision='preview',sequence=0){return validate({version:2,revision,sequence,markerWidthCm,poses:ARTIFACTS.map(a=>{const p={...factory(a.n),...settings[a.n]};return [a.n,p.pitch,p.yaw,p.roll,p.size,p.lengthCm];}),screenZooms:ARTIFACTS.map(a=>[a.n,settings[a.n]?.screenZoom||100])});}
  const toPoses=config=>Object.fromEntries(config.poses.map(([n,pitch,yaw,roll,size,lengthCm])=>[n,{pitch,yaw,roll,size,lengthCm,screenZoom:config.screenZooms?.find(r=>r[0]===n)?.[1]||100}]));
  function encode(config){return '2.'+btoa(JSON.stringify(validate(config))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
  function decode(value){if(!value||value.length>8000||!/^2\.[A-Za-z0-9_-]+$/.test(value))throw new Error('Invalid preview');return validate(JSON.parse(atob(value.slice(2).replace(/-/g,'+').replace(/_/g,'/'))));}
  function saveDocument(config){config=validate(config);return '---\nsequence: '+config.sequence+'\npayload: '+JSON.stringify(config)+'\n---\n';}
  function saveURL(config){config=validate(config);const url=new URL('https://github.com/ragingaxolotl-art/otiz-ar/new/main');url.searchParams.set('filename','_teacher_saves/save-'+config.sequence+'-'+config.revision.replace(/[^a-zA-Z0-9-]/g,'').slice(-10)+'.md');url.searchParams.set('value',saveDocument(config));return url.href;}
  function frame(T,object){
    const bounds=new T.Box3().setFromObject(object,true),center=bounds.getCenter(new T.Vector3()),size=bounds.getSize(new T.Vector3()),pivot=new T.Group();
    object.position.sub(center);pivot.position.copy(center);pivot.add(object);pivot.userData={...object.userData,cardHalfSize:{x:size.x/2,y:size.y/2,z:size.z/2},modelLength:Math.max(size.x,size.y,size.z)};return pivot;
  }
  function ground(pivot){const h=pivot.userData.cardHalfSize,x=pivot.rotation.x,z=pivot.rotation.z;pivot.position.y=(Math.abs(Math.cos(x)*Math.sin(z))*h.x+Math.abs(Math.cos(x)*Math.cos(z))*h.y+Math.abs(Math.sin(x))*h.z)*pivot.scale.x;}
  function rotation(p){const k=Math.PI/180;return [p.pitch*k,p.yaw*k,p.roll*k,'YXZ'];}
  function apply(pivot,p,percent=p.size){pivot.rotation.set(...rotation(p));pivot.scale.setScalar(p.lengthCm/100/pivot.userData.modelLength*percent/100);ground(pivot);}
  const params=new URLSearchParams(location.search);let preview=null,invalid=false;
  if(params.has('preview'))try{preview=decode(params.get('preview'));}catch{invalid=true;}
  const api=window.Classroom={factory,validate,make,toPoses,encode,decode,saveDocument,saveURL,frame,ground,rotation,apply,poses:{},markerWidthCm:8.001,loaded:false,published:null,isPreview:!!preview,invalid,error:'',legacyLink:params.has('setup')};
  api.pose=n=>({...factory(n),...api.poses[n]});
  function install(config){api.config=config;api.poses=toPoses(config);api.markerWidthCm=config.markerWidthCm;}
  if(preview)install(preview);
  api.refresh=async()=>{
    const response=await fetch(new URL('classroom-defaults.json?fresh='+Date.now(),location.href),{cache:'no-store'});if(!response.ok)throw new Error('Saved card settings could not be loaded.');
    const config=validate(await response.json());api.published=config;api.loaded=true;api.error='';if(!preview)install(config);return config;
  };
  api.ready=api.refresh().catch(error=>{api.error=error.message;return null;});
  api.previewLink=(path,config)=>{const url=new URL(path,location.href);url.searchParams.set('preview',encode(config));return url.href;};
  api.studentLink=()=>new URL('scan.html?v=ar-capture-1',location.href).href;
})();
