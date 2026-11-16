const assert=require('node:assert/strict'),C=require('../tomb-core.js');
const approx=(a,b)=>assert(Math.abs(a-b)<1e-10,`${a} != ${b}`);
// The room, HUD and cursor use this same inverse lens mapping. The unadjusted
// calibration target lies at the center of each eye, independent of distortion.
for(const lens of [0,.12,.3])for(const eye of [0,1]){const p=C.viewerSample(.5,.5,eye,{lens});approx(p.x,.5);approx(p.y,.5);}
// Screen offsets move both full eye views symmetrically; they are not dot-only.
for(const x of [.2,.5,.8]){const left=C.viewerSample(x,.4,0,{lens:0,horizontal:.04,balance:.02,vertical:.01}),right=C.viewerSample(x,.4,1,{lens:0,horizontal:.04,balance:.02,vertical:.01});approx(left.x,x-.04);approx(right.x,x+.04);approx(left.y,.4);approx(right.y,.42);}
// A point in either displayed eye maps to the same shared action after correction.
const v={lens:.12,horizontal:.035,balance:-.015,vertical:.02},wanted={x:.66,y:.24};
for(const eye of [0,1]){let x=wanted.x,y=wanted.y;for(let i=0;i<20;i++){const p=C.viewerSample(x,y,eye,v);x+=(wanted.x-p.x)*.7;y+=(wanted.y-p.y)*.7;}const p=C.viewerSample(x,y,eye,v);assert(Math.abs(p.x-wanted.x)<1e-8);assert(Math.abs(p.y-wanted.y)<1e-8);}
console.log('PASS: centered target, whole-view offsets and shared corrected hit coordinates.');
