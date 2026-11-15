/* Static capsule collision against the tomb's actual triangles. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TombCollision=api;})(typeof window==='object'?window:globalThis,function(){
 'use strict';
 const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],add=(a,b,t)=>[a[0]+b[0]*t,a[1]+b[1]*t,a[2]+b[2]*t],clamp=(v)=>Math.max(0,Math.min(1,v));
 const distanceSq=(a,b)=>{const d=sub(a,b);return dot(d,d)};
 function pointTriangleSq(p,a,b,c){
  const ab=sub(b,a),ac=sub(c,a),ap=sub(p,a),d1=dot(ab,ap),d2=dot(ac,ap);if(d1<=0&&d2<=0)return distanceSq(p,a);
  const bp=sub(p,b),d3=dot(ab,bp),d4=dot(ac,bp);if(d3>=0&&d4<=d3)return distanceSq(p,b);
  const vc=d1*d4-d3*d2;if(vc<=0&&d1>=0&&d3<=0)return distanceSq(p,add(a,ab,d1/(d1-d3)));
  const cp=sub(p,c),d5=dot(ab,cp),d6=dot(ac,cp);if(d6>=0&&d5<=d6)return distanceSq(p,c);
  const vb=d5*d2-d1*d6;if(vb<=0&&d2>=0&&d6<=0)return distanceSq(p,add(a,ac,d2/(d2-d6)));
  const va=d3*d6-d5*d4;if(va<=0&&(d4-d3)>=0&&(d5-d6)>=0)return distanceSq(p,add(b,sub(c,b),(d4-d3)/((d4-d3)+(d5-d6))));
  const inverse=1/(va+vb+vc),v=vb*inverse,w=vc*inverse;return distanceSq(p,[a[0]+ab[0]*v+ac[0]*w,a[1]+ab[1]*v+ac[1]*w,a[2]+ab[2]*v+ac[2]*w]);
 }
 function segmentSegmentSq(p1,q1,p2,q2){
  const d1=sub(q1,p1),d2=sub(q2,p2),r=sub(p1,p2),a=dot(d1,d1),e=dot(d2,d2),f=dot(d2,r);let s=0,t=0;
  if(a<=1e-12&&e<=1e-12)return distanceSq(p1,p2);
  if(a<=1e-12)t=clamp(f/e);else{const c=dot(d1,r);if(e<=1e-12)s=clamp(-c/a);else{const b=dot(d1,d2),den=a*e-b*b;s=den!==0?clamp((b*f-c*e)/den):0;t=(b*s+f)/e;if(t<0){t=0;s=clamp(-c/a)}else if(t>1){t=1;s=clamp((b-c)/a)}}}return distanceSq(add(p1,d1,s),add(p2,d2,t));
 }
 function segmentTriangleSq(p,q,t){
  const denominator=dot(t.normal,sub(q,p));if(Math.abs(denominator)>1e-12){const fraction=(t.plane-dot(t.normal,p))/denominator;if(fraction>=0&&fraction<=1){const crossing=add(p,sub(q,p),fraction);if(pointTriangleSq(crossing,t.a,t.b,t.c)<1e-12)return 0}}
  return Math.min(pointTriangleSq(p,t.a,t.b,t.c),pointTriangleSq(q,t.a,t.b,t.c),segmentSegmentSq(p,q,t.a,t.b),segmentSegmentSq(p,q,t.b,t.c),segmentSegmentSq(p,q,t.c,t.a));
 }
 function createWorld(input,cellSize=1){
  const triangles=[],grid=new Map();for(const raw of input){const [a,b,c]=raw.points||raw,ab=sub(b,a),ac=sub(c,a),n=[ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]],length=Math.sqrt(dot(n,n));if(length<1e-9)continue;const normal=n.map(v=>v/length),t={a,b,c,normal,plane:dot(normal,a),minY:Math.min(a[1],b[1],c[1]),maxY:Math.max(a[1],b[1],c[1])},id=triangles.push(t)-1;const minX=Math.floor(Math.min(a[0],b[0],c[0])/cellSize),maxX=Math.floor(Math.max(a[0],b[0],c[0])/cellSize),minZ=Math.floor(Math.min(a[2],b[2],c[2])/cellSize),maxZ=Math.floor(Math.max(a[2],b[2],c[2])/cellSize);for(let x=minX;x<=maxX;x++)for(let z=minZ;z<=maxZ;z++){const key=x+','+z;if(!grid.has(key))grid.set(key,[]);grid.get(key).push(id)}}
  function clear(x,z,feet,height=1.75,radius=.24){
   const start=[x,feet+radius,z],end=[x,feet+Math.max(radius,height-radius),z],seen=new Set();for(let gx=Math.floor((x-radius)/cellSize);gx<=Math.floor((x+radius)/cellSize);gx++)for(let gz=Math.floor((z-radius)/cellSize);gz<=Math.floor((z+radius)/cellSize);gz++)for(const id of grid.get(gx+','+gz)||[]){if(seen.has(id))continue;seen.add(id);const t=triangles[id];if(t.maxY<feet-.02||t.minY>feet+height+.02)continue;
    // A sloping walking surface can touch the capsule's rounded base.
    if(Math.abs(t.normal[1])>.65){const surfaceY=(t.plane-t.normal[0]*x-t.normal[2]*z)/t.normal[1];if(surfaceY<=feet+.045)continue}
    if(segmentTriangleSq(start,end,t)<(radius-.001)*(radius-.001))return false;
   }return true;
  }
  function move(start,dx,dz,options={}){
   const radius=options.radius||.24,height=options.height||1.75,jump=options.jump||0,floorAt=options.floorAt||(()=>start.feet),stepLimit=options.stepLimit??.42,result={...start},count=Math.max(1,Math.ceil(Math.hypot(dx,dz)/(radius*.25)));for(let i=0;i<count;i++)for(const [sx,sz]of [[dx/count,0],[0,dz/count]]){if(!sx&&!sz)continue;const x=result.x+sx,z=result.z+sz,f=floorAt(x,z,result.feet);let feet=result.feet;if(!options.airborne){if(Number.isFinite(f)&&Math.abs(f-result.feet)<=stepLimit)feet=f;else if(!options.allowDrop||f>result.feet+stepLimit)continue;}if(clear(x,z,feet+jump,height,radius)){result.x=x;result.z=z;result.feet=feet}}return result;
  }
  return{clear,move,triangles:triangles.length};
 }
 return{createWorld,pointTriangleSq,segmentSegmentSq,segmentTriangleSq};
});
