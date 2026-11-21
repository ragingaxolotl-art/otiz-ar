document.getElementById('run').onclick=async function(){
  this.disabled=true;const out=document.getElementById('result'),report=[],frame=document.getElementById('app'),w=frame.contentWindow,d=w.document;
  const assert=(ok,msg)=>{if(!ok)throw Error(msg)},wait=fn=>new Promise((yes,no)=>{let tries=0;function tick(){if(fn())return yes();if(tries++>2400)return no(Error('Timed out: '+String(fn)));requestAnimationFrame(tick)}tick()});
  try{
    await w.Classroom.ready;assert(w.Classroom.loaded,'Egypt settings did not load');assert(w.ARTIFACTS.length===12,'Wrong Egypt catalog');assert(w.Classroom.published.revision==='egypt-ar-1','Loaded another collection settings');
    const selector=d.getElementById('egypt-marker-size');selector.value='16';selector.dispatchEvent(new Event('change'));assert(w.Classroom.markerWidthCm===16.002,'Large card width not applied');selector.value='8';selector.dispatchEvent(new Event('change'));assert(w.Classroom.markerWidthCm===8.001,'Small card width not applied');
    d.getElementById('start-camera').click();await wait(()=>d.getElementById('arjs-video')?.complete&&d.querySelector('a-scene')?.hasLoaded);
    const source=d.getElementById('arjs-video');source.onload=null;assert(source.tagName==='IMG','Fixture requested real camera');
    async function board(n){const canvas=d.createElement('canvas');canvas.width=1280;canvas.height=960;const ctx=canvas.getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,1280,960);if(n){const image=new Image();image.src='../assets/markers/'+n+'.png';await image.decode();ctx.imageSmoothingEnabled=false;ctx.drawImage(image,480,320,320,320);}source.src=canvas.toDataURL();await source.decode();}
    await board(null);await wait(()=>d.getElementById('keep-explore').disabled);
    for(const a of w.ARTIFACTS){
      out.textContent='Testing card '+a.n+' / 12';await board(a.n);
      const el=d.querySelector('a-marker[value="'+a.n+'"] a-entity');
      await wait(()=>el.getAttribute('data-ar-framed')==='true'&&!d.getElementById('keep-explore').disabled&&d.getElementById('status').textContent.includes('Card '+a.n+' ·'));
      const T=w.AFRAME.THREE,pivot=el.getObject3D('artifact'),box=new T.Box3().setFromObject(pivot,true),size=box.getSize(new T.Vector3());
      assert(Math.max(size.x,size.y,size.z)<=.08001*.901,'Model exceeds marker '+a.n);
      assert(d.getElementById('artifact-credit').textContent.includes(a.creator),'Credit missing '+a.n);
      if(a.modelNode){assert(pivot.getObjectByName(a.modelNode),'Missing selected replica part');assert(!pivot.getObjectByName(a.modelNode==='replica-coffin'?'replica-anubis':'replica-coffin'),'Unrelated replica component present');}
      d.getElementById('keep-explore').click();assert(!d.getElementById('explore-host').hidden,'Capture failed '+a.n);await board(null);
      await wait(()=>!d.querySelector('a-marker[value="'+a.n+'"]')?.object3D.visible);
      assert(!d.getElementById('explore-host').hidden,'Capture disappeared with marker '+a.n);
      d.getElementById('panel-toggle').click();d.getElementById('explore-grow').click();assert(d.getElementById('explore-zoom').textContent==='200%','Zoom failed '+a.n);d.getElementById('explore-fit').click();assert(d.getElementById('explore-zoom').textContent==='100%','Fit failed '+a.n);
      d.getElementById('release-capture').click();assert(d.getElementById('explore-host').hidden,'Release failed '+a.n);assert(d.getElementById('keep-explore').disabled,'Lost card left Capture enabled '+a.n);
      report.push({card:a.n,name:a.name,capture:true,markerLoss:true,release:true,fit:true});
    }
    document.getElementById('diagnostics').textContent=JSON.stringify(report,null,2);out.textContent='PASS: 12 markers recognized; 12 models loaded; Capture survives marker loss; zoom, fit, Release, credits and separate replica parts pass. Egypt settings isolated; both paper sizes pass.';
  }catch(error){out.textContent='FAIL: '+error.message;document.getElementById('diagnostics').textContent=JSON.stringify(report,null,2);console.error(error);}finally{this.disabled=false;}
};
