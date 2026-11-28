/* The game's collection is authoritative; the shared pixel book displays it. */
(function(root){'use strict';
 const coffins=[['outer-coffin-ai','Outermost coffin'],['middle-coffin-ai','Middle coffin'],['inner-coffin-ai','Innermost gold coffin']].map(([id,name])=>({id,name,room:'burial'}));
 const canopic=[['canopic-heads','Four head-shaped canopic stoppers'],['canopic-chest','Calcite canopic chest and lid'],['canopic-wood','Gilded wooden canopic shrine']].map(([id,name])=>({id,name,room:'treasury'}));
 function roomOf(e){if(e.room)return e.room;if(e.placement?.room)return e.placement.room;const n=(e.note||'').toLowerCase();return ['burial','treasury','annexe','antechamber'].find(room=>n.startsWith(room))||'entrance';}
 root.TombNotebook={coffins,canopic,create({catalog=[],onOpen=()=>{},onClose=()=>{}}){
 const $=id=>document.getElementById(id),dialog=$('field-notebook'),button=$('notebook-open'),frame=$('pixel-book-frame');
 const entries=new Map();let ready=false,pending=null;
 for(const entry of [...catalog,...canopic])if(!entries.has(entry.id))entries.set(entry.id,{...entry,room:roomOf(entry),collected:false});
 const origin=root.location.origin;
 const send=data=>{if(ready)frame.contentWindow.postMessage(data,origin);};
 function count(){return [...entries.values()].filter(e=>e.collected).length;}
 function sync(){button.textContent='Pixel book ('+count()+'/'+entries.size+')';send({kind:'tomb-book-sync',entries:[...entries.values()].map(e=>({id:e.id,name:e.name,room:e.room,note:e.collected?e.note:undefined,collected:e.collected,analysisRotation:e.analysisRotation}))});}
 // Sources never travel through postMessage. Only collected originals can be inspected.
 root.TombBookBridge={getSource(id){const e=entries.get(id);return e?.collected?e.source?.():null;}};
 function open(id){pending=entries.has(id)?id:null;if(!dialog.open){onOpen();dialog.showModal();}if(!frame.getAttribute('src'))frame.src='paper-inventory/?tomb=1&v=pixel-book-game-20261128-1';sync();send({kind:'tomb-book-open',id:pending});if(ready)pending=null;frame.focus();}
 function close(){if(dialog.open)dialog.close();}
 root.addEventListener('message',event=>{if(event.origin!==origin||event.source!==frame.contentWindow)return;const kind=event.data?.kind;if(kind==='tomb-book-ready'){ready=true;$('pixel-book-loading').hidden=true;sync();send({kind:dialog.open?'tomb-book-open':'tomb-book-hide',id:pending});pending=null;}else if(kind==='tomb-book-close')close();});
 dialog.addEventListener('close',()=>{send({kind:'tomb-book-hide'});onClose();});
 button.onclick=()=>open();$('notebook-close').onclick=close;
 document.addEventListener('keydown',e=>{if(e.repeat||e.ctrlKey||e.metaKey||e.altKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(e.code==='KeyB'&&!document.querySelector('dialog[open]:not(#field-notebook)')){e.preventDefault();if(dialog.open)close();else open();}});
 sync();return{add(entry){const prior=entries.get(entry.id),fresh=!prior?.collected;entries.set(entry.id,{...prior,...entry,room:prior?.room||roomOf(entry),collected:true});sync();return fresh;},open,get count(){return count();},get total(){return entries.size;}};
 }};
})(window);
