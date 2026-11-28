/* Approximate teaching reconstruction of Carter and Mace's top-down clearance. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TombDoorway=api;})(typeof window==='object'?window:globalThis,function(){
 'use strict';
 const count=12,layout={x:-1.35,z:-5.42,width:1.4,bottom:.6,height:2.2};
 function initial(){return{captured:false,removed:0,loose:false,open:false};}
 function transition(s,action){
  if(action==='reset')return initial();
  if(s.open)return s;
  if(action==='capture'&&!s.captured)return{...s,captured:true};
  if(action==='loosen'&&s.captured&&!s.loose)return{...s,loose:true};
  if(action==='remove'&&s.loose){const removed=s.removed+1;return{...s,removed,loose:false,open:removed===count};}
  return s;
 }
 function protectedPoint(x,z){return x<layout.x&&z>-7.3&&z<.6||x<-2.5&&z<=-7.3;}
 function create({THREE:T,scene,camera,colliders,player,enabled,rebuild,message,capture=()=>{},sound=()=>{}}){
  let state=initial(),ready=false,nextActionAt=0;const group=new T.Group(),stones=[],direction=new T.Vector3();group.name='Sealed burial doorway';scene.add(group);
  const panel=document.getElementById('doorway-activity'),status=document.getElementById('doorway-status'),action=document.getElementById('doorway-action');
  const plaster=new T.MeshStandardMaterial({color:0xbca87e,roughness:1}),stoneMaterial=new T.MeshStandardMaterial({color:0xc8b68d,roughness:1});
  function box(w,h,d,x,y,z,material=plaster,physical=true){const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);if(physical){colliders.push(mesh);}return mesh;}
  // Restore the partition removed in the source model; retain only this doorway.
  const z0=-6.6,z1=-2.45,left=layout.z-layout.width/2,right=layout.z+layout.width/2;
  box(.25,3.4,left-z0,layout.x,1.7,(z0+left)/2);
  box(.25,3.4,z1-right,layout.x,1.7,(right+z1)/2);
  box(.25,.6,layout.width,layout.x,.3,layout.z);
  box(.25,.6,layout.width,layout.x,3.1,layout.z);
  // A full-depth blocker prevents squeezing through partly cleared stonework.
  const blocker=box(.26,layout.height,layout.width,layout.x,layout.bottom+layout.height/2,layout.z,new T.MeshBasicMaterial({visible:false}));
  for(let row=0;row<4;row++)for(let col=0;col<3;col++){
   const mesh=box(.27,layout.height/4-.014,layout.width/3-.014,layout.x,layout.bottom+layout.height-(row+.5)*layout.height/4,left+(col+.5)*layout.width/3,stoneMaterial.clone(),false);stones.push(mesh);
  }
  // Stylised stamped plaster, not a facsimile of an ancient seal impression.
  const sealCanvas=document.createElement('canvas');sealCanvas.width=256;sealCanvas.height=128;const ctx=sealCanvas.getContext('2d');ctx.fillStyle='#bca87e';ctx.fillRect(0,0,256,128);ctx.strokeStyle='#796849';ctx.lineWidth=5;for(const x of [50,128,206]){ctx.beginPath();ctx.ellipse(x,64,28,44,0,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(x-12,76);ctx.lineTo(x,40);ctx.lineTo(x+12,76);ctx.stroke();}const sealTexture=new T.CanvasTexture(sealCanvas);sealTexture.colorSpace=T.SRGBColorSpace;
  const seal=new T.Mesh(new T.PlaneGeometry(.85,.42),new T.MeshStandardMaterial({map:sealTexture,roughness:1,side:T.DoubleSide}));seal.rotation.y=Math.PI/2;seal.position.set(layout.x+.146,1.8,layout.z);group.add(seal);
  // Tool silhouettes move against the active stone while it is loosened.
  const tools=new T.Group();group.add(tools);tools.visible=false;const metal=new T.MeshStandardMaterial({color:0x63666a,roughness:.6}),wood=new T.MeshStandardMaterial({color:0x795331,roughness:1});
  const chisel=new T.Mesh(new T.CylinderGeometry(.012,.018,.27,6),metal);chisel.rotation.z=Math.PI/2;tools.add(chisel);const handle=new T.Mesh(new T.CylinderGeometry(.016,.016,.3,8),wood);handle.position.set(.17,.12,0);tools.add(handle);const hammer=new T.Mesh(new T.BoxGeometry(.16,.065,.065),metal);hammer.position.set(.17,.27,0);tools.add(hammer);
  function prompt(){return !state.captured?'Capture the seals':state.loose?'Support and lift out stone '+(state.removed+1):'Loosen stone '+(state.removed+1)+' with hammer and chisel';}
  function near(){const p=player();return ready&&enabled()&&p.x>layout.x+.15&&p.x<layout.x+2.9&&Math.abs(p.z-layout.z)<1.9&&Math.abs(p.y-.6)<.5;}
  function aimed(){if(!near()||state.open)return false;camera.getWorldDirection(direction);const goal=new T.Vector3(layout.x,camera.position.y,layout.z).sub(camera.position).normalize();return direction.dot(goal)>.65;}
  function ui(){action.textContent=prompt();action.disabled=state.open||!near()||performance.now()<nextActionAt;status.textContent=state.open?'Doorway cleared. You may now enter the burial chamber.':!state.captured?'Capture the seals for your field notebook before disturbing the wall.':state.loose?'Support the loosened stone so it cannot fall inward. '+state.removed+' / '+count+' stones removed.':'Work from the top downward. '+state.removed+' / '+count+' stones removed.';}
  function act(){if(!near()||state.open||performance.now()<nextActionAt)return false;const type=!state.captured?'capture':state.loose?'remove':'loosen';state=transition(state,type);nextActionAt=performance.now()+500;
   if(type==='capture'){capture(group);message('Seals captured in your field notebook. Begin below the lintel and work downward. The seal marks and stone pattern are approximate.');}
   if(type==='loosen'){seal.visible=false;const s=stones[state.removed];s.material.color.set(0xa99162);s.position.x+=.045;tools.position.copy(s.position);tools.position.x+=.25;tools.visible=true;sound('scrape',0);message('Stone loosened. Support it and lift it outward; do not push it into the chamber.');}
   if(type==='remove'){stones[state.removed-1].visible=false;tools.visible=false;sound('drop',0);if(state.open){colliders.splice(colliders.indexOf(blocker),1);blocker.removeFromParent();rebuild();message('The blocking is cleared. Enter the burial chamber. Carter and Mace’s team took nearly two hours on 16 February 1923.');}else message(state.removed+' of '+count+' stones safely passed back. Continue from the top.');}
   ui();return true;
  }
  action.onclick=()=>{act();};
  function update(time){panel.hidden=!near()||document.body.classList.contains('cardboard');if(!panel.hidden)ui();if(tools.visible){hammer.position.x=.17+Math.sin(time*.024)*.035;handle.rotation.z=Math.sin(time*.024)*.1;}stones.forEach((s,i)=>{if(i===state.removed&&!state.open)s.material.emissive.setHex(aimed()?0x34230b:0);else s.material.emissive.setHex(0);});}
  function initialize(){ready=true;group.updateMatrixWorld(true);ui();}
  return{initialize,update,act,aimed,prompt,get open(){return state.open;},get state(){return{...state};},locked(x,z){return !state.open&&protectedPoint(x,z);}};
 }
 return{initial,transition,count,layout,protectedPoint,create};
});
