/* Shared starting poses. Classroom links contain settings; no account or server is needed. */
(function(){
  const factory=()=>({pitch:0,yaw:0,roll:0,size:100});
  function validate(rows){
    if(!Array.isArray(rows)||rows.length>ARTIFACTS.length)throw new Error('Invalid setup');
    const result={},seen=new Set();
    rows.forEach(row=>{
      if(!Array.isArray(row)||row.length!==5||!row.every(Number.isFinite))throw new Error('Invalid pose');
      const [n,pitch,yaw,roll,size]=row;
      if(!ARTIFACTS.some(a=>a.n===n)||seen.has(n)||[pitch,yaw,roll].some(v=>v < -180||v > 180)||size<25||size>400)throw new Error('Invalid pose');
      seen.add(n);result[n]={pitch,yaw,roll,size};
    });return result;
  }
  function encode(poses){
    const rows=ARTIFACTS.map(a=>{const p=poses[a.n]||factory();return [a.n,p.pitch,p.yaw,p.roll,p.size];}).filter(r=>r.slice(1).some((v,i)=>v!==[0,0,0,100][i]));
    validate(rows);return '1.'+btoa(JSON.stringify(rows)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  }
  function decode(value){
    if(!value||value.length>2400||!/^1\.[A-Za-z0-9_-]+$/.test(value))throw new Error('Invalid setup link');
    return validate(JSON.parse(atob(value.slice(2).replace(/-/g,'+').replace(/_/g,'/'))));
  }
  const raw=new URLSearchParams(location.search).get('setup');let poses={},invalid=false;
  if(raw)try{poses=decode(raw);}catch{invalid=true;}
  const pose=n=>({...factory(),...poses[n]});
  function link(path,settings=poses){const url=new URL(path,location.href);url.searchParams.set('setup',encode(settings));return url.href;}
  function frame(T,object){
    const center=new T.Box3().setFromObject(object).getCenter(new T.Vector3()),pivot=new T.Group();
    object.position.sub(center);pivot.position.copy(center);pivot.add(object);pivot.userData={...object.userData};return pivot;
  }
  function rotation(p){const k=Math.PI/180;return [p.pitch*k,p.yaw*k,p.roll*k,'YXZ'];}
  window.Classroom={factory,encode,decode,pose,link,frame,rotation,poses,hasSetup:!!raw&&!invalid,invalid};
  addEventListener('DOMContentLoaded',()=>{
    if(raw&&!invalid)document.querySelectorAll('a[href]').forEach(a=>{
      const original=a.getAttribute('href');if(original.startsWith('#'))return;
      const url=new URL(original,location.href),base=new URL('./',location.href);
      if(url.origin===base.origin&&url.pathname.startsWith(base.pathname)&&/\/(?:index.html|scan.html|teacher.html|teacher-mode.html)?$/.test(url.pathname)){url.searchParams.set('setup',raw);a.href=url.href;}
    });
    if(invalid){const notice=document.createElement('p');notice.className='setup-warning';notice.setAttribute('role','alert');notice.textContent='This classroom setup link is invalid. Original starting views are being used. Ask your teacher for a new link.';document.body.prepend(notice);}
  });
})();
