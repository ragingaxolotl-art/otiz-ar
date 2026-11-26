/* Display names use excavation numbers only when the object comparison is established. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.EgyptCatalog=api;})(typeof window==='object'?window:globalThis,function(){
 const names={
  'guardian-statue-ai':['22','Guardian statue with nemes headcloth'],
  'guardian-khat-ai':['29','Guardian statue with khat headdress'],
  'painted-chest':['21','Painted wooden chest'],
  'throne':['91','Golden throne'],
  'dagger':['256k','Iron dagger and gold sheath'],
  'mask':['256a','Gold funerary mask'],
  'canopic':['266b','Calcite canopic chest'],
  'anubis-replica':['261','Anubis shrine'],
  'lotus-head':['8','Head of Tutankhamun emerging from a lotus'],
  'mannequin':['116','Wooden portrait bust of Tutankhamun'],
  'fan-ai':['245','Ceremonial fan'],
  'lotus-ai':['210','Calcite perfume vessel'],
  'headrest-ai':['403c','Ivory headrest with Shu and lions'],
  'headrest-blue':['403a','Turquoise glass headrest'],
  'headrest-azure':['403b','Dark-blue faience headrest'],
  'headrest-folding':['403d','Folding ivory headrest with Bes faces'],
  'headrest-cabinet':['403','Table-shaped box for four headrests'],
  'outer-coffin-ai':['253','Outermost coffin'],
  'middle-coffin-ai':['254','Middle coffin'],
  'inner-coffin-ai':['255','Innermost gold coffin'],
  'coffin-replica':[null,'Anthropoid coffin'],
  'funerary-bed':[null,'Funerary couch'],
  'throwing-sticks-ai':[null,'Decorated throwing sticks'],
  'sandals-ai':[null,'Sandals'],
  'crook-staff-ai':[null,'Crook and flail'],
  'pectoral-ai':[null,'Scarab pectoral'],
  'scarab-pectoral':[null,'Winged scarab pectoral'],
  'model-boat-ai':[null,'Model boat'],
  'model-boat-2-ai':[null,'Model boat · second example'],
  'shield-ai':[null,'Ceremonial shield'],
  'shield-2-ai':[null,'Openwork ceremonial shield'],
  'chariot-ai':[null,'Chariot'],
  'senet':[null,'Senet board and pieces']
 };
 function apply(defs){for(const d of defs){const entry=names[d.id];if(entry){d.carterNumber=entry[0];d.name=(entry[0]?'Carter '+entry[0]+' · ':'')+entry[1];}else d.name=d.name.replace(/\s*·\s*AI (?:reconstruction|approximation)/gi,'');}return defs;}
 return{names,apply};
});
