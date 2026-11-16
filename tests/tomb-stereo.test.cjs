const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const root={};vm.runInNewContext(fs.readFileSync(require.resolve('../tomb-viewer.js'),'utf8'),{window:root});
// At DPR 2, a 1280×720 display owns a 2560×1440 target. Do not feed
// those physical rectangles through renderer.setViewport's DPR scaling.
for(const [w,h]of [[1280,720],[2560,1440],[2533,1171]]){
 const rect=()=>({value:[],set(...v){this.value=v;},copy(r){this.value=[...r.value];}});
 const target={width:w,height:h,viewport:rect(),scissor:rect()},calls=[],drawn=[];
 const renderer={setRenderTarget(t){calls.push(t?{viewport:[...t.viewport.value],scissor:[...t.scissor.value],clip:t.scissorTest}:null);}};
 root.TombViewer.renderEyes(renderer,target,'left','right',eye=>drawn.push(eye));
 assert.deepEqual(drawn,['left','right']);assert.equal(calls[2],null);
 assert.deepEqual(calls[0],{viewport:[0,0,Math.floor(w/2),h],scissor:[0,0,Math.floor(w/2),h],clip:true});
 assert.deepEqual(calls[1],{viewport:[Math.floor(w/2),0,w-Math.floor(w/2),h],scissor:[Math.floor(w/2),0,w-Math.floor(w/2),h],clip:true});
 assert.equal(calls[0].viewport[2]+calls[1].viewport[2],w);
}
console.log('PASS: stereo eyes cover the physical target exactly once, including high-DPI and odd widths.');
