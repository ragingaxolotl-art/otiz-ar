/* Original illustrative teaching models. No museum scans or measured geometry. */
(function () {
  const cache = new WeakMap();
  function materials(T) {
    if (cache.has(T)) return cache.get(T);
    let seed=83; const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    function texture(base,type) {
      const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');
      x.fillStyle=base;x.fillRect(0,0,256,256);
      for(let i=0;i<(type==='fur'?3500:1500);i++) {
        const a=random()*256,b=random()*256;
        x.strokeStyle=`rgba(${random()>.5?'255,231,182':'36,20,12'},${.04+random()*.18})`;
        x.lineWidth=type==='bark'?.5+random()*2:.4+random();x.beginPath();x.moveTo(a,b);
        x.lineTo(a+(type==='bark'?8+random()*45:random()*8-4),b+(type==='fur'?6+random()*14:random()*3));x.stroke();
      }
      const tx=new T.CanvasTexture(c);tx.wrapS=tx.wrapT=T.RepeatWrapping;tx.colorSpace=T.SRGBColorSpace;return tx;
    }
    const mat=(color,map)=>new T.MeshStandardMaterial({color,roughness:.91,map,side:T.DoubleSide});
    const m={wood:mat('#a67c4b',texture('#d3b28b','wood')),darkWood:mat('#715336'),
      bark:mat('#e7d4aa',texture('#ddc9a1','bark')),leather:mat('#a77945',texture('#bd9767','hide')),
      darkHide:mat('#5e3924',texture('#997047','hide')),fur:mat('#64472d',texture('#aa8156','fur')),
      cord:mat('#c0a46c'),darkCord:mat('#3d3023'),grass:mat('#ba9c57'),stone:mat('#b8b0a1'),
      marble:mat('#e1d7bd'),copper:new T.MeshStandardMaterial({color:'#ac7048',metalness:.65,roughness:.48})};
    cache.set(T,m);return m;
  }
  function create(T,index) {
    const m=materials(T),g=new T.Group(),v=(a)=>new T.Vector3(...a);
    function mesh(geo,mat,p=[0,0,0],s=[1,1,1],r=[0,0,0]) {
      const o=new T.Mesh(geo,mat);o.position.set(...p);o.scale.set(...s);o.rotation.set(...r);g.add(o);return o;
    }
    function tube(points,r=.02,mat=m.cord,closed=false) {
      const curve=new T.CatmullRomCurve3(points.map(v),closed);return mesh(new T.TubeGeometry(curve,Math.max(12,points.length*6),r,6,closed),mat);
    }
    function ring(y,rx,rz,mat=m.cord,r=.015,cx=0,cz=0) {
      const pts=Array.from({length:32},(_,i)=>{const a=i/32*Math.PI*2;return [cx+Math.cos(a)*rx,y,cz+Math.sin(a)*rz];});return tube(pts,r,mat,true);
    }
    function rod(a,b,r,mat) {const mid=v(a).add(v(b)).multiplyScalar(.5),d=v(b).sub(v(a));const o=mesh(new T.CylinderGeometry(r*.88,r,d.length(),10),mat,mid.toArray());o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return o;}
    function flint(p,scale=1) {
      const geo=new T.BufferGeometry(),verts=[0,.46,0,-.22,0,.07,.22,0,.07,0,.13,-.1],faces=[0,1,2,0,3,1,0,2,3,1,3,2];
      geo.setAttribute('position',new T.Float32BufferAttribute(faces.flatMap(i=>verts.slice(i*3,i*3+3)),3));geo.computeVertexNormals();
      return mesh(geo,m.stone,p,[scale,scale,scale]);
    }
    if(index===0) {
      mesh(new T.CylinderGeometry(.43,.45,1.08,40,1,true),m.bark,[0,.57,0]);
      mesh(new T.CylinderGeometry(.44,.44,.035,40),m.bark,[0,.035,0]);
      ring(1.11,.43,.43,m.darkCord,.018);ring(.09,.45,.45,m.cord,.014);
      for(let y=.15;y<1.06;y+=.09)tube([[.42,y,-.08],[.46,y+.025,0],[.42,y+.05,.08]],.009,m.darkCord);
      for(let i=0;i<20;i++){const a=i/20*Math.PI*2;tube([[Math.cos(a)*.44,.07,Math.sin(a)*.44],[Math.cos(a)*.46,.12,Math.sin(a)*.46]],.009,m.darkCord);}
    } else if(index===1) {
      [-.32,.32].forEach((x,k)=>{
        mesh(new T.CylinderGeometry(.23,.145,1.45,18,5,true),k?m.leather:m.darkHide,[x,.79,0],[1,1,.85]);
        for(let i=0;i<10;i++){let y=.17+i*.125;rod([x+.15,y,-.065],[x+.17,y+.04,.065],.009,m.cord);}
        tube([[x,1.5,0],[x+.03,1.7,.02],[x+.12,1.72,.03]],.014,m.darkCord);
        ring(.12,.15,.13,m.cord,.012,x);ring(.7,.19,.16,m.cord,.008,x);
      });
    } else if(index===2) {
      mesh(new T.SphereGeometry(.64,32,20,0,Math.PI*2,0,Math.PI/2),m.fur,[0,.62,0],[1,1,.92]);
      ring(.62,.64,.59,m.darkHide,.025);
      tube([[-.56,.65,0],[-.5,.29,.02],[-.23,.08,.1],[.16,.08,.1],[.5,.29,.02],[.56,.65,0]],.02,m.darkHide);
    } else if(index===3) {
      [-.17,.17].forEach((x,k)=>{
        rod([x,.06,0],[x,1.65,0],.022,m.wood);flint([x,1.62,0],.32);
        for(let i=0;i<5;i++)ring(1.6+i*.022,.03,.03,m.darkCord,.008,x);
        for(let j=0;j<3;j++){
          const o=mesh(new T.BoxGeometry(.13,.3,.009),m.cord,[x,.29,0]);o.rotation.y=j*Math.PI*2/3;
        }
      });
    } else if(index===4) {
      // Open, sleeveless approximation: the original sleeves do not survive.
      for(let i=0;i<12;i++){
        const a=(i/12)*Math.PI*1.82+.29,b=a+Math.PI*1.82/12;
        const o=mesh(new T.CylinderGeometry(.36,.61,1.32,5,6,true,a,b-a-.018),i%3?m.leather:m.darkHide,[0,.75,0]);
        for(let y=.18;y<1.35;y+=.12)rod([Math.sin(a)*(.61-(y-.09)*.19),y,Math.cos(a)*(.61-(y-.09)*.19)],[Math.sin(a+.025)*(.61-(y-.09)*.19),y+.025,Math.cos(a+.025)*(.61-(y-.09)*.19)],.008,m.cord);
      }
      ring(.73,.5,.5,m.darkHide,.035);
    } else if(index===5) {
      tube([[-.18,.05,0],[-.16,.55,0],[-.13,1.1,0],[-.09,1.48,0],[.04,1.55,0],[.26,1.53,0]],.06,m.wood);
      const s=new T.Shape();s.moveTo(.15,1.42);s.lineTo(.77,1.33);s.lineTo(.82,1.62);s.lineTo(.15,1.62);s.closePath();
      mesh(new T.ExtrudeGeometry(s,{depth:.09,bevelEnabled:true,bevelThickness:.012,bevelSize:.012,bevelSegments:1,steps:1}),m.copper,[0,0,-.045]);
      for(let i=0;i<8;i++)ring(1.36+i*.035,.13,.1,m.darkCord,.015,.14);
    } else if(index===6) {
      mesh(new T.CylinderGeometry(.115,.14,.78,10),m.wood,[0,.46,0],[1,1,.7]);
      flint([0,.82,0],1.05);
      for(let i=0;i<7;i++)ring(.72+i*.022,.123,.09,m.darkCord,.012);
      tube([[0,.09,0],[-.18,.05,.03],[-.2,.22,.04],[0,.24,0]],.018,m.cord);
    } else if(index===7) {
      mesh(new T.CylinderGeometry(.15,.17,.93,12),m.wood,[0,.51,0]);
      mesh(new T.ConeGeometry(.15,.26,12),m.wood,[0,1.1,0]);
      mesh(new T.ConeGeometry(.04,.22,7),m.darkCord,[0,1.28,0]);ring(.07,.17,.17,m.darkWood,.014);
    } else if(index===8) {
      mesh(new T.TorusGeometry(.17,.065,10,30),m.marble,[0,1.16,0],[1,1,.45]);
      for(let i=0;i<10;i++){
        const k=i/9;const x=(k-.5)*1.2;
        tube([[0,1.16,.01],[(k-.5)*.1,.91,.02],[x*.55,.55,Math.sin(i)*.12],[x,.13+Math.cos(i)*.07,.12]],.014,m.darkCord);
      }
    } else if(index===9) {
      // Open netting, rather than an invented complete shoe.
      const zLevels=[-.45,-.28,-.1,.08,.26,.45,.61];
      zLevels.forEach((z,i)=>{
        const w=[.22,.3,.34,.37,.36,.28,.12][i],h=[.55,.53,.42,.3,.22,.14,.09][i];
        tube(Array.from({length:17},(_,j)=>{const a=j/16*Math.PI;return [Math.cos(a)*w,.07+Math.sin(a)*h,z];}),.018,m.cord);
      });
      for(let j=0;j<9;j++){const a=j/8*Math.PI;tube(zLevels.map((z,i)=>[Math.cos(a)*[.22,.3,.34,.37,.36,.28,.12][i],.07+Math.sin(a)*[.55,.53,.42,.3,.22,.14,.09][i],z]),.017,m.cord);}
      tube([[-.22,.09,-.45],[-.36,.07,0],[-.28,.07,.45],[0,.07,.64],[.28,.07,.45],[.36,.07,0],[.22,.09,-.45]],.025,m.darkCord);
    } else if(index===10) {
      for(let i=0;i<34;i++){
        const x=(i-16.5)*.033;const h=1.35+Math.sin(i*5)*.06;
        tube([[x,.06,0],[x+.008,.46,.015],[x-.007,.9,-.025],[x,h,.02]],.013,i%4?m.grass:m.cord);
      }
      for(let y=.2;y<1.25;y+=.19)tube(Array.from({length:35},(_,i)=>[(i-17)*.033,y,Math.sin(i*Math.PI/2)*.028]),.016,m.darkCord);
    } else if(index===11) {
      tube([[-.48,.08,0],[-.5,.65,0],[-.48,1.35,0],[-.34,1.65,.02],[0,1.75,.02],[.34,1.65,.02],[.48,1.35,0],[.5,.65,0],[.48,.08,0]],.035,m.wood);
      [.3,.73].forEach(y=>{
        mesh(new T.BoxGeometry(1.05,.12,.075),m.darkWood,[0,y,0]);
        [-.48,.48].forEach(x=>{for(let i=0;i<3;i++)ring(y-.04+i*.04,.055,.055,m.cord,.012,x);});
      });
    }
    g.updateMatrixWorld(true);
    const b=new T.Box3().setFromObject(g),s=b.getSize(new T.Vector3()),c=b.getCenter(new T.Vector3());
    const scale=Math.min(1.35/Math.max(s.x,s.z),1.65/s.y);
    g.children.forEach(o=>{o.position.x-=c.x;o.position.z-=c.z;o.position.y-=b.min.y;});
    g.scale.setScalar(scale);g.userData.artifactIndex=index;return g;
  }
  window.ArtifactModels={create};
})();
