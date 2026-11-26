/* Constructed classroom reconstruction, not a scan of Tutankhamun's remains. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.WrappedMummy=api;})(typeof window==='object'?window:globalThis,function(){
 function createInner(T,closed,crookSource){
  const group=new T.Group();group.name='innermost-coffin';group.position.copy(closed.position);group.quaternion.copy(closed.quaternion);group.scale.copy(closed.scale);
  const geometry=closed.geometry,positions=geometry.attributes.position,index=geometry.index,attributes=Object.keys(geometry.attributes).filter(k=>!['skinIndex','skinWeight'].includes(k)),values=Object.fromEntries(attributes.map(k=>[k,[]])),plane=-.08;
  function vertex(i){return Object.fromEntries(attributes.map(k=>{const a=geometry.attributes[k];return[k,Array.from({length:a.itemSize},(_,c)=>a.getComponent(i,c))];}));}
  function crossing(a,b){const t=(plane-a.position[2])/(b.position[2]-a.position[2]);return Object.fromEntries(attributes.map(k=>[k,a[k].map((v,i)=>v+(b[k][i]-v)*t)]));}
  const count=index?index.count:positions.count;
  for(let i=0;i<count;i+=3){const tri=[0,1,2].map(k=>vertex(index?index.getX(i+k):i+k)),poly=[];for(let k=0;k<3;k++){const a=tri[k],b=tri[(k+1)%3],ia=a.position[2]>=plane,ib=b.position[2]>=plane;if(ia)poly.push(a);if(ia!==ib)poly.push(crossing(a,b));}for(let k=1;k<poly.length-1;k++)for(const v of [poly[0],poly[k],poly[k+1]])for(const a of attributes)values[a].push(...v[a]);}
  const lidGeometry=new T.BufferGeometry();for(const key of attributes)lidGeometry.setAttribute(key,new T.Float32BufferAttribute(values[key],geometry.attributes[key].itemSize));lidGeometry.computeVertexNormals();const lid=new T.Mesh(lidGeometry,closed.material);lid.name='inner-lid';group.add(lid);
  // Follow the uploaded outline, rather than opening an unrelated rectangular box.
  geometry.computeBoundingBox();const b=geometry.boundingBox,N=72,lo=b.min.y,hi=b.max.y,dy=(hi-lo)/N,rows=[];
  for(let n=0;n<=N;n++){const y=lo+n*dy;let width=.025;for(let i=0;i<positions.count;i++)if(Math.abs(positions.getY(i)-y)<dy*1.7)width=Math.max(width,Math.abs(positions.getX(i)));rows.push(width);}
  const outer=rows.map((r,i)=>[-r,lo+i*dy]).concat(rows.map((r,i)=>[r,lo+i*dy]).reverse()),inner=outer.map(([x,y])=>[x-Math.sign(x)*.018,y*.97]),p=[],ids=[];
  function tri(a,b,c){const n=p.length/3;p.push(...a,...b,...c);ids.push(n,n+1,n+2);}function quad(a,b,c,d){tri(a,b,c);tri(a,c,d);}
  const floor=-.30;
  for(let i=0;i<outer.length;i++){const j=(i+1)%outer.length,[x,y]=outer[i],[xx,yy]=outer[j],[a,b]=inner[i],[c,d]=inner[j];quad([x,y,floor-.02],[xx,yy,floor-.02],[xx,yy,plane],[x,y,plane]);quad([a,b,plane],[c,d,plane],[c,d,floor],[a,b,floor]);quad([x,y,plane],[xx,yy,plane],[c,d,plane],[a,b,plane]);tri([0,0,floor],[a,b,floor],[c,d,floor]);}
  const shell=new T.BufferGeometry();shell.setAttribute('position',new T.Float32BufferAttribute(p,3));shell.setIndex(ids);shell.computeVertexNormals();const gold=new T.MeshStandardMaterial({color:0x9e7226,metalness:.65,roughness:.48,side:T.DoubleSide,envMapIntensity:.12}),caseMesh=new T.Mesh(shell,gold);caseMesh.name='inner-constructed-case';group.add(caseMesh);
  const mummy=new T.Group();mummy.name='fully-wrapped-mummy';group.add(mummy);const linen=new T.MeshStandardMaterial({color:0xd2c09e,roughness:1,vertexColors:true});
  function wrapped(name,x,y,z,rx,ry,rz){const g=new T.SphereGeometry(1,32,40),a=g.attributes.position,colors=[],shade=new T.Color();for(let i=0;i<a.count;i++){const seam=Math.abs(Math.sin((a.getY(i)*ry+y)*Math.PI/0.027));shade.setRGB(seam<.2?.62:.9,seam<.2?.55:.83,seam<.2?.43:.68);colors.push(shade.r,shade.g,shade.b);}g.setAttribute('color',new T.Float32BufferAttribute(colors,3));const mesh=new T.Mesh(g,linen);mesh.name=name;mesh.scale.set(rx,ry,rz);mesh.position.set(x,y,z);mummy.add(mesh);}
  wrapped('linen-covered-head',0,.67,-.18,.11,.145,.085);wrapped('wrapped-shoulders-and-torso',0,.18,-.185,.17,.39,.095);wrapped('wrapped-legs',0,-.4,-.2,.115,.39,.075);wrapped('wrapped-feet',0,-.77,-.19,.11,.11,.065);
  for(const side of [-1,1]){const palm=new T.Mesh(new T.SphereGeometry(1,16,12),gold);palm.name='gold-hand-'+(side<0?'left':'right');palm.scale.set(.032,.065,.018);const handX=side<0?-.135:.06,handY=side<0?.27:.25;palm.position.set(handX,handY,-.055);palm.rotation.z=side*.7;mummy.add(palm);for(let i=0;i<4;i++){const finger=new T.Mesh(new T.CapsuleGeometry(.006,.037,3,6),gold);finger.position.set(handX+(i-1.5)*.011,handY+.05,-.042);finger.rotation.z=side*.7;mummy.add(finger);}}
  if(crookSource){const root=new T.Group(),copy=crookSource.clone(true);root.add(copy);copy.rotation.x=Math.PI/2;root.updateMatrixWorld(true);const box=new T.Box3().setFromObject(root),size=box.getSize(new T.Vector3()),scale=.48/Math.max(size.x,size.y,size.z),center=box.getCenter(new T.Vector3());copy.position.sub(center);root.scale.setScalar(scale);root.position.set(.025,.24,-.025);root.name='crook-and-flail-on-wrappings';mummy.add(root);}
  group.userData.teachingReconstruction=true;group.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});return group;
 }
 return{createInner};
});
