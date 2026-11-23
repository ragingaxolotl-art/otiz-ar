const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const placement=require('../egypt-tomb-placements.js'),Collision=require('../tomb-collision.js');
const read=path=>fs.readFileSync(path,'utf8');
function catalog(){const ctx={};ctx.window=ctx;vm.runInNewContext(read('egypt-ar-data.js'),ctx);return ctx.ARTIFACTS;}
const expected=['throwing-sticks-ai','headrest-ai','fan-ai','senet','painted-chest','chariot-ai'];
test('cards 1–6 follow the assignment photos, with settings attached to the same objects',()=>{
 const a=catalog(),settings=JSON.parse(read('egypt-ar-settings.json'));
 assert.deepEqual(Array.from(a.slice(0,6),x=>x.id),expected);
 assert.deepEqual(Array.from(a.filter(x=>x.assignmentPhoto),x=>[x.n,x.assignmentPhoto]),expected.map((_,i)=>[i+1,i+1]));
 for(const x of a){assert.equal(settings.poses.find(p=>p[0]===x.n)[5],x.lengthCm,x.id);assert.ok(settings.screenZooms.some(p=>p[0]===x.n));}
 assert.match(a.find(x=>x.id==='senet').fact,/not identified as Tutankhamun/);
});
function printPage(search){
 const elements=new Map(),make=tag=>({tag,children:[],attributes:{},classList:{toggle(){},add(){},remove(){}},append(...children){this.children.push(...children)},setAttribute(k,v){this.attributes[k]=v;}});
 const document={body:make('body'),createElement:make,getElementById(id){if(!elements.has(id))elements.set(id,make(id));return elements.get(id);}};
 const ctx={ARTIFACTS:catalog(),document,location:{search,href:'https://example.test/egypt-cards.html'+search},URL,URLSearchParams,addEventListener(){},qrcode:()=>({addData(){},make(){},createSvgTag(){return '<svg/>';}})};
 vm.runInNewContext(read('egypt-cards.js'),ctx);return elements;
}
test('the assignment print link produces only the six student cards and retains the chosen set across layouts',()=>{
 const page=printPage('?set=assignment'),sheets=page.get('cards').children;
 assert.deepEqual(sheets.map(s=>s.children.length),[4,2]);
 const cards=sheets.flatMap(s=>s.children);cards.forEach((c,i)=>{assert.match(c.innerHTML,new RegExp('markers/'+(i+1)+'\\.png'));assert.ok(!c.innerHTML.includes(catalog()[i].name));});
 assert.equal(page.get('print-cards').textContent,'Print six assignment cards');
 assert.match(page.get('one-layout').href,/set=assignment/);assert.match(page.get('one-layout').href,/layout=1/);
 assert.equal(printPage('?card=6').get('cards').children[0].children.length,1);
});
test('the tomb starts with the same six priorities and includes generic Senet with its original license',()=>{
 const s=read('tomb.js'),start=s.indexOf(' const defs=[')+12,end=s.indexOf('\n ];',start);
 const defs=vm.runInNewContext('('+s.slice(start,end)+'\n])');placement.apply(defs);
 assert.deepEqual(Array.from(defs.slice(0,6),x=>x.id),expected);assert.equal(defs.length,24);
 assert.equal(defs.find(d=>d.id==='senet').credit,'Fisherowski');
 assert.equal(defs.find(d=>d.id==='senet').licenseUrl,'https://creativecommons.org/licenses/by/4.0/');
 assert.ok(s.includes('window.EgyptTombPlacements.apply(defs)'));
 const html=read('tomb.html');assert.ok(html.indexOf('egypt-tomb-placements.js')<html.indexOf('src="tomb.js'));
});
const triangles=JSON.parse(read('tests/fixtures/tomb-world.json'));
function floors(x,z){const found=[];for(const [a,b,c]of triangles){const den=(b[2]-c[2])*(a[0]-c[0])+(c[0]-b[0])*(a[2]-c[2]);if(Math.abs(den)<1e-8)continue;const u=((b[2]-c[2])*(x-c[0])+(c[0]-b[0])*(z-c[2]))/den,v=((c[2]-a[2])*(x-c[0])+(a[0]-c[0])*(z-c[2]))/den;if(u<-.00001||v<-.00001||u+v>1.00001)continue;const y=u*a[1]+v*b[1]+(1-u-v)*c[1];if(y>-1&&y<1)found.push(y);}return found;}
const world=Collision.createWorld(triangles);
test('moved studies rest on the actual room floor and have a clear standing inspection viewpoint',()=>{
 for(const p of placement.entries){
  const {pos:[x,z],floor,size,stand}=p.display;
  assert.ok(floors(x,z).some(y=>Math.abs(y-floor)<.02),p.id+' floor');
  if(stand)for(let i=0;i<8;i++)assert.ok(floors(x+.30*Math.cos(i*Math.PI/4),z+.30*Math.sin(i*Math.PI/4)).some(y=>Math.abs(y-floor)<.02),p.id+' stand support');
  const candidates=[];for(const radius of [1.7,1.35,2.1])for(let i=0;i<8;i++){const px=x+radius*Math.cos(i*Math.PI/4),pz=z+radius*Math.sin(i*Math.PI/4);const f=floors(px,pz).find(y=>Math.abs(y-floor)<.02);if(f!==undefined&&world.clear(px,pz,f,1.75,.24))candidates.push([px,pz]);}
  assert.ok(candidates.length,p.id+' inspection clearance');
  if(stand)for(const other of placement.entries){if(other===p||!other.display.stand)continue;assert.ok(Math.hypot(x-other.display.pos[0],z-other.display.pos[1])>.62,p.id+' stand overlaps '+other.id);}
  assert.ok(p.evidence.length&&p.evidence.every(url=>/^https:\/\//.test(url)));
  assert.ok(p.note&&p.confidence);assert.ok(size>0&&size<=1.1);
 }
 const rooms=Object.fromEntries(placement.entries.map(p=>[p.id,p.room]));
 assert.equal(rooms['headrest-ai'],'annexe');assert.equal(rooms.senet,'annexe');assert.equal(rooms['fan-ai'],'burial');assert.equal(rooms['shield-ai'],'annexe');assert.equal(rooms['shield-2-ai'],'annexe');
 assert.equal(rooms['model-boat-ai'],'treasury');assert.equal(rooms['chariot-ai'],'antechamber');
});
