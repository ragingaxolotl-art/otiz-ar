'use strict';
// This prototype has its own storage and no connection to tomb.js or the game.
const $ = id => document.getElementById(id);
const ASSETS = window.PAPER_PREVIEW_ASSETS;
for (const [name, value] of Object.entries(ASSETS.images)) document.documentElement.style.setProperty(`--${name}`, `url("${value}")`);

const legacyCatalog = [
 {id:'pectoral',name:'Winged scarab pectoral',kind:'Jewellery',model:'scarab-pectoral',icon:'scarab',credit:'Mayantique',source:'https://sketchfab.com/3d-models/ancient-egyptian-jewelry-7fc4496e06b74293b23b24afc28b46e6',license:'CC BY 4.0',note:'Artistic study copy. Its precise ancient catalogue match and findspot are unverified.'},
 {id:'sandals',name:'Pair of sandals',kind:'Clothing',model:'sandals-ai',icon:'sandals',credit:'Teacher-supplied Meshy model',note:'AI reconstruction used in the game. This is a teaching copy.'},
 {id:'senet',name:'Senet board',kind:'Games',model:'senet',icon:'senet',credit:'Fisherowski',source:'https://skfb.ly/6WSrP',license:'CC BY 4.0',note:'Generic reconstruction of a senet board, rather than Tutankhamun’s specific surviving board.'},
 {id:'boat',name:'Model boat',kind:'Model boats',model:'model-boat-ai',icon:'boat',credit:'Teacher-supplied Meshy model',note:'AI teaching reconstruction. Its precise ancient identification is unverified.'},
 {id:'fan',name:'Ceremonial fan',kind:'Ceremonial objects',model:'fan-ai',icon:'fan',credit:'Teacher-supplied Meshy model',note:'AI teaching reconstruction based on a decorated fan reference.'},
 {id:'dagger',name:'Iron dagger & sheath',kind:'Weapons',model:'dagger',icon:'dagger',credit:'Tom_Bentkowski',source:'https://skfb.ly/6xKEs',license:'CC BY 4.0',note:'A 3D study model of the iron dagger and its gold sheath.'},
 {id:'bracelet',name:'Scarab bracelet',kind:'Jewellery',model:'scarab-bracelet',icon:'bracelet',credit:'Marius Ciulei',source:'https://skfb.ly/pxoON',license:'CC BY 4.0',note:'Existing project study model. Its particular ancient identification, owner and findspot are unverified.'},
 {id:'boat-2',name:'Model boat · second example',kind:'Model boats',model:'model-boat-2-ai',icon:'boat2',credit:'Teacher-supplied Meshy model',note:'Second AI teaching reconstruction. Kept separately from the first model boat.'}
];
const aliases={'pectoral':'scarab-pectoral','sandals':'sandals-ai','boat':'model-boat-ai','fan':'fan-ai','boat-2':'model-boat-2-ai','bracelet':'scarab-bracelet'};
const legacyById=new Map(legacyCatalog.map(e=>[aliases[e.id]||e.id,e]));
const catalog=ASSETS.catalog.map(e=>({...e,...legacyById.get(e.id),id:e.id,name:e.name,kind:e.kind||(e.room==='reference'?'Comparison reference':e.room==='burial'?'Burial equipment':'Artifact'),model:e.model||legacyById.get(e.id)?.model,icon:e.id,credit:legacyById.get(e.id)?.credit||e.credit||e.source_credit||'PixelLab notebook illustration',note:legacyById.get(e.id)?.note||e.note||e.audit_note,source:legacyById.get(e.id)?.source||e.source||e.source_url}));

const rooms=[['entrance','Entrance'],['antechamber','Antechamber'],['burial','Burial chamber'],['treasury','Treasury'],['annexe','Annexe'],['reference','References']];
const spreads=[{room:'explorer',name:'Your explorer',items:[]}];
for(const [room,name]of rooms){const items=catalog.filter(e=>e.room===room).map(e=>e.id);for(let i=0;i<items.length;i+=6)spreads.push({room,name,items:items.slice(i,i+6),part:Math.floor(i/6)+1});}
const sampleIds=legacyCatalog.slice(0,7).map(e=>aliases[e.id]||e.id);
const byId = new Map(catalog.map(item => [item.id, item]));

const wearableItems={
 'diadem-ai':{slot:'head',label:'Royal diadem'},
 'scarab-pectoral':{slot:'neck',label:'Winged scarab pectoral'},
 'pectoral-ai':{slot:'neck',label:'Scarab pectoral, alternate'},
 'scarab-bracelet':{slot:'wrist',label:'Scarab bracelet'}
};
const equipmentSlots=[['head','Head'],['neck','Neck'],['wrist','Wrist']];
function cleanEquipment(){const prior=state.equipped||{};state.equipped=Object.fromEntries(equipmentSlots.map(([slot])=>[slot,state.found.includes(prior[slot])&&wearableItems[prior[slot]]?.slot===slot?prior[slot]:null]));}
function itemCategory(item){const n=(item.name+' '+item.kind).toLowerCase();return /chest|cabinet|shrine|enclosure/.test(n)?'Boxes & chests':/vase|jar|vessel|stopper|calcite chest lid/.test(n)?'Jars & vessels':wearableItems[item.id]||/mask|pectoral|diadem|bracelet/.test(n)?'Jewellery':/dagger|stick|shield|crook|flail/.test(n)?'Weapons':/shabti|shawabti|head emerging|bust|guardian|ankhesenamun/.test(n)?'Figures':/headrest|couch|throne|bed/.test(n)?'Furniture':'Other';}

const STORAGE = 'paper-inventory-preview:v1';
let state;
try { state = JSON.parse(localStorage.getItem(STORAGE)); } catch (_) {}
if (!state || !Array.isArray(state.found)) state = {found:sampleIds,seen:[],spread:0};
state.found = [...new Set(state.found.map(id=>aliases[id]||id))].filter(id=>byId.has(id));
state.seen = Array.isArray(state.seen) ? state.seen.map(id=>aliases[id]||id).filter(id=>byId.has(id)) : [];
// Always open on the character page; collection and inspected markers still persist.
state.spread = 0;
cleanEquipment();
const LAST_SPREAD = spreads.length-1;
let turning = false;
const save = () => { try { localStorage.setItem(STORAGE, JSON.stringify(state)); } catch (_) {} };

// Every collectible must have its own audited PixelLab PNG; no silent draft fallback.
function icon(id) {
 if(!ASSETS.icons[id])throw new Error('Missing inventory artwork: '+id);
 return `<img class="item-icon" src="${ASSETS.icons[id]}" width="128" height="128" alt="">`;
}

function render() {
 const isCharacter=state.spread===0,spread=spreads[state.spread];
 $('character-page').hidden=!isCharacter;$('equipment-page').hidden=!isCharacter;
 $('left-items').hidden=isCharacter;$('right-items').hidden=isCharacter;
 $('left-title').textContent=isCharacter?'Your explorer':spread.name;
 $('right-title').textContent=isCharacter?'Wearable finds':spread.name;
 $('right-kicker').textContent=isCharacter?`${Object.values(state.equipped).filter(Boolean).length} / 3 WORN`:'DISCOVERED / UNDISCOVERED';
 $('left-footnote').textContent=isCharacter?'Your explorer, from every side.':'Dark gray silhouettes are waiting to be found.';
 $('right-footnote').textContent=isCharacter?'Turn the page to browse your finds.':'Collect an item to reveal its colors.';
 const roomItems=catalog.filter(e=>e.room===spread.room),found=roomItems.filter(e=>state.found.includes(e.id)).length;
 $('room-pages').replaceChildren();
 for(const [room,name]of [['explorer','Explorer'],...rooms]){const page=spreads.findIndex(s=>s.room===room);if(page<0)continue;const items=catalog.filter(e=>e.room===room),button=document.createElement('button');button.type='button';button.textContent=name+(room==='explorer'?'':` ${items.filter(e=>state.found.includes(e.id)).length}/${items.length}`);button.setAttribute('aria-pressed',String(spread.room===room));button.onclick=()=>{if(turning)return;state.spread=page;render();};$('room-pages').append(button);}
 for(const [side,offset]of [['left',0],['right',3]]){
  const target=$(`${side}-items`);target.replaceChildren();if(isCharacter)continue;
  for(let i=0;i<3;i++){
   const item=byId.get(spread.items[offset+i]);if(!item){const slot=document.createElement('div');slot.className='empty-slot';slot.innerHTML='<span>End of this room’s page</span>';target.append(slot);continue;}
   const collected=state.found.includes(item.id),wearable=wearableItems[item.id],button=document.createElement('button');button.className='find-card'+(collected?'':' is-locked');button.dataset.item=item.id;button.disabled=!collected;
   button.setAttribute('aria-label',`${item.name}, ${collected?(wearable?'collected, wear on book character':'collected, inspect'):'not collected'}`);
   const hasModel=!!ASSETS.models[item.model]||!!item.studyUrl;
   button.innerHTML=`<span class="icon-wrap">${icon(item.icon)}</span><span><span class="kind">${item.kind}</span><h3>${item.name}</h3><span class="inspect-hint">${collected?(wearable?'Click to wear · '+wearable.slot:hasModel?'Inspect in 3D':'Examine illustration'):'Not collected yet'}</span>${collected&&!state.seen.includes(item.id)?'<span class="new-tag">NEW</span>':''}</span>`;
   button.onclick=()=>{if(state.found.includes(item.id)){if(wearable)equipItem(item.id);else openInspector(item);}};target.append(button);
  }
 }
 $('total').textContent=`${state.found.length} / ${catalog.length} objects collected`;
 $('left-range').textContent=isCharacter?'CHARACTER':`${found}/${roomItems.length} FOUND · PART ${spread.part}`;
 $('left-number').textContent=String(state.spread*2+1).padStart(2,'0');$('right-number').textContent=String(state.spread*2+2).padStart(2,'0');
 $('page-status').textContent=`PAGES ${state.spread*2+1}–${state.spread*2+2} / ${spreads.length*2}`;
 $('previous').disabled=turning||state.spread===0;$('next').disabled=turning||state.spread===LAST_SPREAD;$('find-next').disabled=state.found.length===catalog.length;
 renderEquipment();renderCatalogIndex();save();syncCharacterEquipment();syncCharacterViewer();
}
function turn(direction) {
 if(turning||state.spread+direction<0||state.spread+direction>LAST_SPREAD)return;
 if(matchMedia('(prefers-reduced-motion: reduce)').matches) {state.spread+=direction;render();return;}
 turning=true;render();$('turn-sheet').className=`turn-sheet ${direction>0?'forward':'backward'}`;
 setTimeout(()=>{state.spread+=direction;render();},310);
 setTimeout(()=>{turning=false;$('turn-sheet').className='turn-sheet';render();},630);
}
let toastTimer;
function announce(text){clearTimeout(toastTimer);$('announcement').textContent=text;$('announcement').classList.add('show');toastTimer=setTimeout(()=>$('announcement').classList.remove('show'),3500);}
function recordDiscovery(id) {
 id=aliases[id]||id;if(!byId.has(id)||state.found.includes(id))return false;
 state.found.push(id);state.spread=spreads.findIndex(s=>s.items.includes(id));render();announce(`${byId.get(id).name} added to your collection.`);return true;
}
$('previous').onclick=()=>turn(-1);$('next').onclick=()=>turn(1);
$('demo-toggle').onclick=()=>{const open=$('demo-tools').hidden;$('demo-tools').hidden=!open;$('demo-toggle').setAttribute('aria-expanded',String(open));};
$('find-next').onclick=()=>recordDiscovery(catalog.find(x=>!state.found.includes(x.id))?.id);
$('sample').onclick=()=>{state={found:sampleIds,seen:[],spread:0};cleanEquipment();render();announce('Sample collection restored.');};
$('empty').onclick=()=>{state={found:[],seen:[],spread:0};cleanEquipment();render();announce('Preview emptied. Simulate a find to start collecting.');};
document.addEventListener('keydown',e=>{if($('inventory-root').hidden||$('inspector').open||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(e.key==='ArrowRight'){e.preventDefault();turn(1);}if(e.key==='ArrowLeft'){e.preventDefault();turn(-1);}});

function equipItem(id){const item=wearableItems[id];if(!item||!state.found.includes(id))return false;state.equipped[item.slot]=id;state.spread=0;render();announce(`${byId.get(id).name} placed on your book character.`);return true;}
function renderEquipment(){
 const holder=$('equipment-slots');holder.replaceChildren();
 for(const [slot,label]of equipmentSlots){const row=document.createElement('section');row.className='equipment-slot';const chosen=state.equipped[slot],eligible=Object.keys(wearableItems).filter(id=>wearableItems[id].slot===slot);row.innerHTML=`<h3>${label}</h3>`;
  const choices=document.createElement('div');choices.className='equipment-choices';
  for(const id of eligible){const found=state.found.includes(id),worn=chosen===id,b=document.createElement('button');b.className='equipment-choice'+(!found?' is-locked':'')+(worn?' is-worn':'');b.disabled=!found;b.dataset.equip=id;b.setAttribute('aria-label',`${found?(worn?'Remove':'Wear'):'Find'} ${byId.get(id).name}`);b.setAttribute('aria-pressed',String(worn));b.innerHTML=`${icon(id)}<span>${byId.get(id).name}<small>${!found?'Find to wear':worn?'Worn · click to remove':'Click to wear'}</small></span>`;b.onclick=()=>{if(worn){state.equipped[slot]=null;render();}else equipItem(id);};const choice=document.createElement('div');choice.className='equipment-choice-wrap';choice.append(b);const inspect=document.createElement('button');inspect.className='inspect-choice';inspect.textContent='Inspect';inspect.disabled=!found;inspect.setAttribute('aria-label','Inspect '+byId.get(id).name);inspect.onclick=()=>openInspector(byId.get(id));choice.append(inspect);choices.append(choice);}
  row.append(choices);holder.append(row);
 }
}
function renderCatalogIndex(){
 const query=$('catalog-search').value?.toLowerCase().trim()||'',category=$('catalog-filter').value||'',holder=$('catalog-results');holder.replaceChildren();
 const entries=catalog.filter(item=>(!category||itemCategory(item)===category)&&(!query||`${item.name} ${item.kind} ${itemCategory(item)} ${item.id}`.toLowerCase().includes(query)));
 $('catalog-summary').textContent=`All ${catalog.length} objects · index`;
 for(const item of entries){const b=document.createElement('button'),found=state.found.includes(item.id);b.className='index-entry';b.dataset.reveal=item.id;b.innerHTML=`<span>${item.name}<small>${rooms.find(([id])=>id===item.room)?.[1]||item.room} · ${itemCategory(item)}</small></span><span>${found?'Collected':'Not found'} →</span>`;b.onclick=()=>{state.spread=spreads.findIndex(s=>s.items.includes(item.id));$('catalog-index').open=false;render();document.querySelector(`[data-item="${item.id}"]`)?.scrollIntoView({block:'center',behavior:'smooth'});};holder.append(b);}
 if(!entries.length)holder.textContent='No matching objects.';
}
$('catalog-search').oninput=renderCatalogIndex;$('catalog-filter').onchange=renderCatalogIndex;
$('wearable-finds').onclick=()=>{state.found=[...new Set([...state.found,...Object.keys(wearableItems)])];state.spread=0;render();announce('Wearable discoveries added to this preview. Click a piece to wear it.');};
$('all-finds').onclick=()=>{state.found=catalog.map(e=>e.id);render();announce('All objects revealed in this preview.');};

let renderer,scene,camera,group,modelRoot,raf,loadToken=0,lastButton;
let distance=4.5,defaultDistance=4.5,dragPoints=new Map(),pinchDistance=0;
const T=window.AFRAME?.THREE;
async function loadStudyModel(key){
 const source=ASSETS.models[key];if(!source)throw Error('Study model is unavailable: '+key);
 if(typeof source==='object'&&source.url)return new T.GLTFLoader().loadAsync(source.url);
 const bytes=Uint8Array.from(atob(source),c=>c.charCodeAt(0));
 return new Promise((resolve,reject)=>new T.GLTFLoader().parse(bytes.buffer,'',resolve,reject));
}
function initializeViewer() {
 if(renderer)return;
 if(!T)throw new Error('The 3D renderer is unavailable.');
 renderer=new T.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));
 if(T.SRGBColorSpace)renderer.outputColorSpace=T.SRGBColorSpace;else renderer.outputEncoding=T.sRGBEncoding;
 renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
 scene=new T.Scene();camera=new T.PerspectiveCamera(35,1,.01,100);group=new T.Group();scene.add(group);
 scene.add(new T.HemisphereLight(0xfff3d4,0x638b78,2));
 for(const [color,intensity,x,y,z] of [[0xfff5d9,3,3,5,5],[0xb7dfd6,2,-4,2,1],[0xffd48d,2,0,3,-4]]){const l=new T.DirectionalLight(color,intensity);l.position.set(x,y,z);scene.add(l);}
 const canvas=renderer.domElement;canvas.setAttribute('aria-label','Rotatable 3D model of the selected object');$('model-stage').append(canvas);
 canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);dragPoints.set(e.pointerId,{x:e.clientX,y:e.clientY});pinchDistance=0;});
 canvas.addEventListener('pointermove',e=>{
  const prev=dragPoints.get(e.pointerId);if(!prev)return;
  if(dragPoints.size===1){group.rotation.y+=(e.clientX-prev.x)*.012;group.rotation.x=Math.max(-Math.PI,Math.min(Math.PI,group.rotation.x+(e.clientY-prev.y)*.012));}
  dragPoints.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(dragPoints.size===2){const [a,b]=[...dragPoints.values()],d=Math.hypot(a.x-b.x,a.y-b.y);if(pinchDistance)zoom(pinchDistance/d);pinchDistance=d;}
 });
 const end=e=>{dragPoints.delete(e.pointerId);pinchDistance=0;};canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
 canvas.addEventListener('wheel',e=>{e.preventDefault();zoom(Math.exp(e.deltaY*.001));},{passive:false});
 new ResizeObserver(resizeViewer).observe($('model-stage'));
}
function resizeViewer(){if(!renderer||!$('inspector').open)return;const {width,height}=$('model-stage').getBoundingClientRect();renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();}
function zoom(factor){distance=Math.max(defaultDistance*.45,Math.min(defaultDistance*2.3,distance*factor));}
function resetView(){if(group)group.rotation.set(.08,-.25,0);distance=defaultDistance;}
function disposeModel(){if(!modelRoot)return;group.remove(modelRoot);const textures=new Set(),materials=new Set();modelRoot.traverse(o=>{if(!o.isMesh)return;o.geometry.dispose();for(const m of(Array.isArray(o.material)?o.material:[o.material])){materials.add(m);for(const value of Object.values(m))if(value?.isTexture)textures.add(value);}});textures.forEach(x=>x.dispose());materials.forEach(x=>x.dispose());modelRoot=null;}
function draw(){if(!$('inspector').open)return;camera.position.set(0,.05,distance);camera.lookAt(0,0,0);renderer.render(scene,camera);raf=requestAnimationFrame(draw);}
async function openInspector(item) {
 if(!state.found.includes(item.id))return;
 lastButton=document.activeElement;const token=++loadToken;
 state.seen=[...new Set([...state.seen,item.id])];save();
 $('inspect-title').textContent=item.name;$('model-note').textContent=item.note;
 $('model-credit').replaceChildren(document.createTextNode(`3D model: ${item.credit}`));
 if(item.source){const a=document.createElement('a');a.href=item.source;a.target='_blank';a.rel='noopener';a.textContent=` · Source${item.license?` · ${item.license}`:''}`;$('model-credit').append(a);}
 $('model-status').hidden=false;$('model-status').textContent='Opening object…';$('inspector').showModal();
 const illustration=$('inspect-illustration');illustration.hidden=true;$('study-frame').hidden=true;
 if(item.studyUrl){cancelAnimationFrame(raf);disposeModel();if(renderer)renderer.domElement.hidden=true;const frame=$('study-frame');frame.hidden=false;frame.src=item.studyUrl;$('inspect-view-controls').hidden=false;$('inspect-view-hint').hidden=false;return;}
 if(renderer)renderer.domElement.hidden=false;
 const hasModel=!!ASSETS.models[item.model]||!!item.studyUrl;$('inspect-view-controls').hidden=!hasModel;$('inspect-view-hint').hidden=!hasModel;
 if(!hasModel){cancelAnimationFrame(raf);disposeModel();if(renderer)renderer.domElement.hidden=true;illustration.src=ASSETS.icons[item.id];illustration.alt=item.name;illustration.hidden=false;$('model-status').hidden=true;return;}

 try {
  initializeViewer();cancelAnimationFrame(raf);disposeModel();resizeViewer();draw();
  // Yield a frame so the opening state paints before decoding the embedded GLB.
  await new Promise(resolve=>requestAnimationFrame(resolve));
  const gltf=await loadStudyModel(item.model);
  if(token!==loadToken||!$('inspector').open){gltf.scene.traverse(o=>{if(o.isMesh)o.geometry.dispose();});return;}
  modelRoot=new T.Group();let object=gltf.scene;object.updateMatrixWorld(true);
  if(item.part){const part=new T.Group(),meshes=[];object.traverse(o=>{if(o.isMesh&&o.name.startsWith(item.part))meshes.push(o);});meshes.forEach(o=>part.attach(o));object=part;}
  const box=new T.Box3().setFromObject(object),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());
  const scale=2/Math.max(size.x,size.y,size.z);object.scale.multiplyScalar(scale);object.position.sub(center.multiplyScalar(scale));modelRoot.add(object);group.add(modelRoot);
  defaultDistance=3.8/Math.min(1,camera.aspect);resetView();$('model-status').hidden=true;
 }catch(error){$('model-status').textContent='This model could not be opened. Close the viewer and try again.';console.error(error);}
}
$('close-inspector').onclick=()=>$('inspector').close();
$('inspector').addEventListener('close',()=>{$('study-frame').src='about:blank';$('study-frame').hidden=true;++loadToken;cancelAnimationFrame(raf);dragPoints.clear();disposeModel();const id=lastButton?.dataset.item;render();if(id)document.querySelector(`[data-item="${id}"]`)?.focus();});
function studyCommand(command){const frame=$('study-frame');if(!frame.hidden){frame.contentWindow.postMessage({kind:'book-study-command',command},'*');return;}if(command==='zoom-in')zoom(.85);else if(command==='zoom-out')zoom(1.18);else resetView();}
$('zoom-in').onclick=()=>studyCommand('zoom-in');$('zoom-out').onclick=()=>studyCommand('zoom-out');$('reset-view').onclick=()=>studyCommand('reset');
window.addEventListener('message',e=>{if(e.source!==$('study-frame').contentWindow||!$('inspector').open)return;if(e.data?.kind==='book-study-ready')$('model-status').hidden=true;if(e.data?.kind==='book-study-close')$('inspector').close();if(e.data?.kind==='book-study-error'){$('model-status').hidden=false;$('model-status').textContent='This model could not be opened.';}});
// Deliberately preview-only; future integration must be explicitly requested.
window.paperInventoryPreview={recordDiscovery,getCollection:()=>[...state.found],equipItem,getEquipment:()=>({...state.equipped})};

// Portrait equipment is confined to this separate book scene.
let characterRenderer,characterScene,characterCamera,characterPivot,characterFrame;
let characterRoot,characterCloseup=false;
const attachedEquipment={},equipmentLoads=new Map();
let characterLoading=false,characterReady=false,characterPointer=null,characterMixer=null,characterLastTime=null;
function loadEquipment(id){
 if(!equipmentLoads.has(id))equipmentLoads.set(id,(async()=>{
  return (await loadStudyModel(byId.get(id).model)).scene;
 })().catch(error=>{equipmentLoads.delete(id);throw error;}));
 return equipmentLoads.get(id);
}
function characterPoint(bone){return characterRoot.worldToLocal(bone.getWorldPosition(new T.Vector3()));}
function characterBone(suffix){
 // GLTFLoader sanitizes punctuation in node names for animation bindings.
 const wanted=('mixamorig'+suffix).replace(/[^a-z0-9]/gi,'').toLowerCase();let found;
 characterRoot.traverse(node=>{if(node.isBone&&node.name.replace(/[^a-z0-9]/gi,'').toLowerCase()===wanted)found=node;});
 return found;
}
function chestSurface(height,x){
 let front=-Infinity;
 characterRoot.traverse(mesh=>{
  if(!mesh.isSkinnedMesh)return;
  mesh.skeleton.update();const positions=mesh.geometry.attributes.position,point=new T.Vector3();
  for(let i=0;i<positions.count;i+=2){
   mesh.getVertexPosition(i,point);point.applyMatrix4(mesh.matrixWorld);characterRoot.worldToLocal(point);
   if(Math.abs(point.y-height)<.065&&Math.abs(point.x-x)<.11)front=Math.max(front,point.z);
  }
 });
 return Number.isFinite(front)?front:.175;
}
function fitEquipment(id,object){
 const root=characterRoot,config=wearableItems[id],bone=characterBone({head:'Head',neck:'Spine2',wrist:'LeftHand'}[config.slot]);
 if(!bone)throw Error('Missing character attachment bone');
 root.updateMatrixWorld(true);
 const mount=new T.Group();mount.name='book-equipment-'+id;
 const box=new T.Box3().setFromObject(object),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());
 let scale;
 if(config.slot==='head'){
  scale=.33/.975;center.set(0,.56,0);object.scale.multiplyScalar(scale);object.position.sub(center.multiplyScalar(scale));
  const head=characterPoint(bone),top=characterPoint(characterBone('HeadTop_End'));
  mount.position.copy(head.lerp(top,.6));mount.position.z+=.006;
 }else if(config.slot==='neck'){
  scale=.225/size.x;object.scale.multiplyScalar(scale);object.position.sub(center.multiplyScalar(scale));
  const chest=characterPoint(bone),height=chest.y-.09;
  mount.position.set(chest.x,height,chestSurface(height,chest.x)+size.z*scale*.6+.012);
  // Continue the cord over the collar and around the back of the actual neck.
  const material=new T.MeshStandardMaterial({color:0xc69b37,metalness:.8,roughness:.4});
  const neck=characterPoint(characterBone('Neck')),neckHeight=neck.y+.035;
  const neckPoint=(x,y,z)=>new T.Vector3(neck.x+x,neckHeight+y,neck.z+z).sub(mount.position);
  const cord=new T.CatmullRomCurve3([
   new T.Vector3(-.075,.07,0),
   neckPoint(-.085,-.045,.115),neckPoint(-.085,0,.07),
   neckPoint(-.095,.005,0),neckPoint(-.065,.01,-.075),neckPoint(0,.01,-.09),
   neckPoint(.065,.01,-.075),neckPoint(.095,.005,0),
   neckPoint(.085,0,.07),neckPoint(.085,-.045,.115),
   new T.Vector3(.075,.07,0)
  ]);
  mount.add(new T.Mesh(new T.TubeGeometry(cord,48,.0025,6,false),material));
 }else{
  scale=.105/size.x;center.set(0,-.09,0);object.scale.multiplyScalar(scale);object.position.sub(center.multiplyScalar(scale));
  const hand=characterPoint(bone),forearm=characterPoint(characterBone('LeftForeArm')),axis=forearm.sub(hand).normalize();
  mount.position.copy(hand).addScaledVector(axis,.045);
  const gem=new T.Vector3(0,0,1).addScaledVector(axis,-axis.z).normalize(),right=new T.Vector3().crossVectors(gem,axis).normalize();
  mount.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(right,gem,axis));
 }
 mount.add(object);root.add(mount);root.updateMatrixWorld(true);bone.attach(mount);return mount;
}
function syncCharacterEquipment(){
 if(!characterReady)return;
 for(const [slot]of equipmentSlots){const wanted=state.equipped[slot],current=attachedEquipment[slot];
  if(current?.id===wanted)continue;
  current?.mount?.removeFromParent();
  if(!wanted){delete attachedEquipment[slot];continue;}
  const pending={id:wanted,mount:null};attachedEquipment[slot]=pending;
  loadEquipment(wanted).then(source=>{if(attachedEquipment[slot]!==pending||state.equipped[slot]!==wanted)return;pending.mount=fitEquipment(wanted,source.clone(true));}).catch(error=>{if(attachedEquipment[slot]===pending){delete attachedEquipment[slot];state.equipped[slot]=null;render();announce('This piece could not be loaded. Click it again to retry.');}console.error(error);});
 }
}
function resizeCharacter() {
 if(!characterRenderer||state.spread!==0)return;
 const {width,height}=$('character-stage').getBoundingClientRect();
 if(!width||!height)return;
 characterRenderer.setSize(width,height,false);characterCamera.aspect=width/height;
 characterCamera.position.set(0,characterCloseup?.7:0,(characterCloseup?2.35:5.5)/Math.min(1,characterCamera.aspect));
 characterCamera.lookAt(0,characterCloseup?.7:0,0);characterCamera.updateProjectionMatrix();
}
function drawCharacter(time) {
 characterFrame=null;
 if($('inventory-root').hidden||state.spread!==0||document.hidden||!characterReady)return;
 if(characterMixer){const dt=characterLastTime===null?0:Math.min(.05,Math.max(0,(time-characterLastTime)/1000||0));characterMixer.update(dt);}characterLastTime=Number.isFinite(time)?time:null;
 characterRenderer.render(characterScene,characterCamera);
 characterFrame=requestAnimationFrame(drawCharacter);
}
function syncCharacterViewer() {
 cancelAnimationFrame(characterFrame);characterFrame=null;characterLastTime=null;
 if($('inventory-root').hidden||state.spread!==0)return;
 if(!characterLoading&&!characterReady){initializeCharacter();return;}
 if(characterReady){resizeCharacter();drawCharacter();}
}
async function initializeCharacter() {
 characterLoading=true;
 try {
  characterRenderer=new T.WebGLRenderer({antialias:true,alpha:true});characterRenderer.setPixelRatio(Math.min(devicePixelRatio,2));
  if(T.SRGBColorSpace)characterRenderer.outputColorSpace=T.SRGBColorSpace;else characterRenderer.outputEncoding=T.sRGBEncoding;
  characterRenderer.toneMapping=T.ACESFilmicToneMapping;characterRenderer.toneMappingExposure=1.05;
  characterScene=new T.Scene();characterCamera=new T.PerspectiveCamera(35,1,.01,100);
  characterScene.add(new T.HemisphereLight(0xfff4dc,0x8a8d78,2));
  const key=new T.DirectionalLight(0xfff3d7,2.2);key.position.set(3,5,5);characterScene.add(key);
  const rim=new T.DirectionalLight(0xc9e4d8,1.3);rim.position.set(-3,2,-3);characterScene.add(rim);
  characterPivot=new T.Group();characterScene.add(characterPivot);
  const canvas=characterRenderer.domElement;canvas.setAttribute('aria-label','Explorer character, drag to rotate');$('character-stage').append(canvas);
  canvas.addEventListener('pointerdown',e=>{characterPointer={id:e.pointerId,x:e.clientX};canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(characterPointer?.id!==e.pointerId)return;characterPivot.rotation.y+=(e.clientX-characterPointer.x)*.013;characterPointer.x=e.clientX;});
  const release=e=>{if(characterPointer?.id===e.pointerId)characterPointer=null;};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
  new ResizeObserver(resizeCharacter).observe($('character-stage'));
  await new Promise(resolve=>requestAnimationFrame(resolve));
  const gltf=await loadStudyModel('explorer');
  const root=gltf.scene;characterRoot=root;
  // Use the complete supplied rig and source materials. The former explorer's
  // mesh-name filters and head/neck rebinding do not apply to this character.
  root.traverse(mesh=>{if(mesh.isMesh){mesh.visible=true;mesh.frustumCulled=false;}});
  const idle=gltf.animations.find(clip=>clip.name==='Idle_11')||gltf.animations.find(clip=>/idle/i.test(clip.name));
  if(idle){characterMixer=new T.AnimationMixer(root);characterMixer.clipAction(idle).play();characterMixer.update(.01);}
  root.updateMatrixWorld(true);
  const box=new T.Box3().setFromObject(root,true),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3()),scale=2.7/size.y;
  if(!Number.isFinite(scale)||scale<=0)throw Error('Character bounds unavailable');
  const portrait=new T.Group();portrait.add(root);portrait.scale.setScalar(scale);portrait.position.sub(center.multiplyScalar(scale));characterPivot.add(portrait);
  characterReady=true;syncCharacterEquipment();$('character-status').hidden=true;resizeCharacter();syncCharacterViewer();
 }catch(error){$('character-status').textContent='The character could not be opened.';console.error(error);}
 finally{characterLoading=false;}
}
$('character-view').onclick=()=>{characterCloseup=!characterCloseup;$('character-view').textContent=characterCloseup?'Full figure':'Jewellery view';resizeCharacter();};
$('character-left').onclick=()=>{if(characterPivot)characterPivot.rotation.y-=Math.PI/6;};
$('character-right').onclick=()=>{if(characterPivot)characterPivot.rotation.y+=Math.PI/6;};
document.addEventListener('visibilitychange',syncCharacterViewer);
function showBook(show){
 if(!show&&$('inspector').open)$('inspector').close();
 $('inventory-root').hidden=!show;$('open-inventory').hidden=show;
 if(show){render();$('close-inventory').focus({preventScroll:true});}
 else{syncCharacterViewer();$('open-inventory').focus({preventScroll:true});}
}
$('close-inventory').onclick=()=>showBook(false);
$('open-inventory').onclick=()=>showBook(true);
document.addEventListener('keydown',e=>{
 if(e.repeat||e.ctrlKey||e.metaKey||e.altKey||$('inspector').open||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
 if(e.code==='KeyB'){e.preventDefault();showBook($('inventory-root').hidden);}
 else if(e.code==='Escape'&&!$('inventory-root').hidden){e.preventDefault();showBook(false);}
});
window.paperInventoryPreview.openBook=()=>showBook(true);
window.paperInventoryPreview.closeBook=()=>showBook(false);
render();
