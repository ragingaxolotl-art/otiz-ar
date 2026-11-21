(function(){
  const params=new URLSearchParams(location.search),four=params.get('layout')!=='1',requested=Number(params.get('card'));
  const cards=ARTIFACTS.some(a=>a.n===requested)?ARTIFACTS.filter(a=>a.n===requested):ARTIFACTS;
  const label=n=>String(n).padStart(2,'0'),host=document.getElementById('cards');
  document.body.classList.toggle('four',four);
  document.getElementById('print-cards').textContent=cards.length===1?'Print Egypt card '+label(requested):'Print all '+cards.length+' cards';
  document.getElementById('print-size').textContent='Print at Actual size / 100%, one page per sheet. '+(four?'This layout already has four cards per sheet. Squares are 8.00 cm wide.':'This layout has one card per sheet. Squares are 16.00 cm wide.')+' Select this square size in the Egypt scanner.';
  for(const [id,layout]of [['four-layout','4'],['one-layout','1']]){const url=new URL(location.href);url.searchParams.set('layout',layout);document.getElementById(id).href=url.href;document.getElementById(id).setAttribute('aria-current',(four?layout==='4':layout==='1')?'page':'false');}
  let sheet;
  cards.forEach((a,i)=>{
    const card=document.createElement('section');card.className='card';
    card.innerHTML='<div class="label">EGYPT / AR FIELD LAB</div><h2>EVIDENCE '+label(a.n)+'</h2><img src="assets/markers/'+a.n+'.png" alt="Tracking square for Egypt evidence '+label(a.n)+'"><p>Open the Egypt scanner in Safari.<br>Keep the whole square in view.<br>What could this object reveal?</p><small>EGYPT CARD '+label(a.n)+' / 12 · egypt-scan.html</small>';
    if(four){if(i%4===0){sheet=document.createElement('div');sheet.className='sheet';host.append(sheet);}sheet.append(card);}else host.append(card);
  });
  for(const a of ARTIFACTS){
    const item=document.createElement('article');item.className='key-item';const title=document.createElement('h3'),note=document.createElement('p'),links=document.createElement('p');title.textContent=label(a.n)+' · '+a.name;note.textContent=a.fact;
    for(const [text,url]of [['Model by '+a.creator,a.source],['Creative Commons license',a.license],['Print this card','egypt-cards.html?card='+a.n]]){const link=document.createElement('a');link.textContent=text;link.href=url;links.append(link);}
    item.append(title,note,links);document.getElementById('key-list').append(item);
  }
  const scanner=new URL('egypt-scan.html',location.href);scanner.searchParams.set('marker',four?'8':'16');
  const link=document.getElementById('scanner-link');link.href=scanner.href;link.textContent=scanner.href;
  const qr=qrcode(0,'M');qr.addData(scanner.href);qr.make();document.getElementById('scanner-qr').innerHTML=qr.createSvgTag({cellSize:4,margin:16,scalable:true});
  document.getElementById('print-cards').onclick=()=>{document.body.classList.remove('print-key');window.print();};
  document.getElementById('print-key').onclick=()=>{document.body.classList.add('print-key');window.print();};
  addEventListener('afterprint',()=>document.body.classList.remove('print-key'));
})();
