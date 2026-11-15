"""Export source artifact textures for on-demand close inspection; preserve UVs/mesh.
Run from the repository root. Base-color images above 4096 px are reduced to
4096; opaque PNG color images are JPEG-compressed at quality 95. Other color images are retained exactly. No image is enlarged or AI generated.
"""
from pathlib import Path
import json,struct,hashlib,subprocess
OUT=Path('assets/egypt/detail');OUT.mkdir(parents=True,exist_ok=True)
for old in OUT.iterdir():
 if old.suffix in ['.png','.jpg']:old.unlink()
SOURCES={
 'painted-chest':'assets/egypt/models/painted-chest.glb','dagger':'assets/egypt/models/meteoric-dagger.glb','throne':'tmp/throne-original.glb','mask':'assets/egypt/models/tutankhamun-mask-original.glb','canopic':'assets/egypt/models/canopic-chest-original.glb','coffin-replica':'assets/egypt/models/sarcophagus-replica.glb','anubis-replica':'assets/egypt/models/sarcophagus-replica.glb','scarab-pectoral':'assets/egypt/models/scarab-pectoral-original.glb','lotus-head':'assets/egypt/models/lotus-head-original.glb','mannequin':'assets/egypt/models/mannequin-original.glb','funerary-bed':'assets/egypt/models/funerary-bed-original.glb'}
def dimensions(x):
 if x.startswith(b'\x89PNG'):return struct.unpack('>II',x[16:24])
 if x.startswith(b'\xff\xd8'):
  k=2
  while k<len(x)-8:
   if x[k]!=255:k+=1;continue
   marker=x[k+1];k+=2
   if marker in [0xd8,0xd9]:continue
   length=int.from_bytes(x[k:k+2],'big')
   if marker in [0xc0,0xc1,0xc2]:return(int.from_bytes(x[k+5:k+7],'big'),int.from_bytes(x[k+3:k+5],'big'))
   k+=length
 raise ValueError('Unknown image')
manifest={'version':1,'description':'Original artifact texture detail loaded on approach/pickup. At most one artifact uses these textures at a time. Source credits and licenses remain in walkthrough/credits.json.','artifacts':{}}
seen={};report=[]
for aid,path in SOURCES.items():
 b=Path(path).read_bytes();n=struct.unpack_from('<I',b,12)[0];d=json.loads(b[20:20+n]);bn=b[28+n:];materials={}
 for mi,m in enumerate(d.get('materials',[])):
  pbr=m.get('pbrMetallicRoughness',{});properties={};slots={'map':pbr.get('baseColorTexture'),}
  for slot,tex in slots.items():
   if tex is None:continue
   im=d['images'][d['textures'][tex['index']]['source']];v=d['bufferViews'][im['bufferView']];data=bn[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']];size=dimensions(data);key=hashlib.sha256(data).hexdigest()
   if key not in seen:
    ext='png'if im['mimeType']=='image/png'else'jpg';name=key[:20]+'.'+ext;f=OUT/name;f.write_bytes(data)
    if max(size)>4096:
     subprocess.run(['/usr/bin/sips','--resampleHeightWidthMax','4096',str(f)],check=True,stdout=subprocess.DEVNULL)
     size=dimensions(f.read_bytes())
    if ext=='png' and m.get('alphaMode','OPAQUE')=='OPAQUE':
     target=f.with_suffix('.jpg');subprocess.run(['/usr/bin/sips','-s','format','jpeg','-s','formatOptions','95',str(f),'--out',str(target)],check=True,stdout=subprocess.DEVNULL);f.unlink();f=target;name=f.name
    seen[key]={'url':'assets/egypt/detail/'+name,'width':size[0],'height':size[1]};report.append({'file':name,'size':size,'bytes':f.stat().st_size})
   properties[slot]=seen[key]
  if properties:materials[m.get('name','material-'+str(mi))]=properties
 manifest['artifacts'][aid]={'materials':materials}
(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'artifacts':len(SOURCES),'images':len(report),'bytes':sum(x['bytes']for x in report),'imagesDetail':report},indent=2))
