"""Package the teacher's terrain without mesh simplification or image upscaling.
Marker is visually aligned to the KV62/KV9 shelter west of the rest area.
This is approximate registration, not a surveyed geographic coordinate transform.
"""
from pathlib import Path
import struct,json,copy,subprocess
src=Path('assets/egypt/models/valley-of-the-kings-original.glb').read_bytes();n=struct.unpack_from('<I',src,12)[0];d=json.loads(src[20:20+n]);bn=src[28+n:];p=d['meshes'][0]['primitives'][0]
def read(i):
 a=d['accessors'][i];v=d['bufferViews'][a['bufferView']];w={'VEC3':3,'VEC2':2,'SCALAR':1}[a['type']];fmt,size={5126:('f',4),5125:('I',4),5123:('H',2)}[a['componentType']];start=v.get('byteOffset',0)+a.get('byteOffset',0);return[struct.unpack_from('<'+fmt*w,bn,start+k*v.get('byteStride',w*size))for k in range(a['count'])]
ps,uv,ix=read(p['attributes']['POSITION']),read(p['attributes']['TEXCOORD_0']),[v[0]for v in read(p['indices'])];target=[4338/8192,1-1883/4096];anchor=None
for k in range(0,len(ix),3):
 ids=ix[k:k+3];a,b,c=[uv[i]for i in ids];den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1])
 if abs(den)<1e-12:continue
 u=((b[1]-c[1])*(target[0]-c[0])+(c[0]-b[0])*(target[1]-c[1]))/den;v=((c[1]-a[1])*(target[0]-c[0])+(a[0]-c[0])*(target[1]-c[1]))/den;w=1-u-v
 if min(u,v,w)>=-1e-6:
  raw=[sum(ps[i][j]*weight for i,weight in zip(ids,[u,v,w]))for j in range(3)];anchor=[raw[0],raw[2],-raw[1]];break
assert anchor
image=d['images'][0];view=d['bufferViews'][image['bufferView']];original_image=Path('tmp/valley-source.png');original_image.write_bytes(bn[view.get('byteOffset',0):view.get('byteOffset',0)+view['byteLength']]);subprocess.run(['/usr/bin/sips','-s','format','jpeg','-s','formatOptions','95',str(original_image),'--out','tmp/valley-full.jpg'],check=True,stdout=subprocess.DEVNULL);image_data=Path('tmp/valley-full.jpg').read_bytes();image_view=d['images'][0]['bufferView'];out=bytearray()
for i,view in enumerate(d['bufferViews']):
 data=image_data if i==image_view else bn[view.get('byteOffset',0):view.get('byteOffset',0)+view['byteLength']];out+=b'\0'*(-len(out)%4);view['byteOffset']=len(out);view['byteLength']=len(data);out+=data
d['images'][0]['mimeType']='image/jpeg';d['buffers'][0]['byteLength']=len(out);d['asset'].setdefault('extras',{})['modifications']='Source mesh and original 8192 x 4096 color image resolution retained; image JPEG-compressed at quality 95. Terrain recentered at an approximate educational entrance marker at runtime.'
j=json.dumps(d,separators=(',',':')).encode();j+=b' '*(-len(j)%4);out+=b'\0'*(-len(out)%4);result=struct.pack('<III',0x46546c67,2,28+len(j)+len(out))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(out),0x004e4942)+out
Path('assets/egypt/walkthrough/valley.glb').write_bytes(result)
meta={'anchor':anchor,'sourceUV':target,'registration':'Approximate visual alignment to the KV62/KV9 covered approach west of the rest area, compared with the Theban Mapping Project detail plan. The source terrain has no GPS/geographic metadata; this is not a surveyed fit.','surveyReference':{'N':99572.277,'E':94069.638,'elevation':170.550,'grid':'TMP local survey grid; reference point printed on KV62 plan, not latitude/longitude.'},'sources':['https://thebanmappingproject.com/sites/default/files/plans/KV62_1.pdf','https://thebanmappingproject.com/sites/default/files/plans/Valley%20of%20the%20Kings.pdf'],'creator':'Nate Loper','license':'https://creativecommons.org/licenses/by/4.0/','sourceModel':'https://sketchfab.com/3d-models/valley-of-the-kings-tombs-luxor-egypt-f139edcc7b764f6ebde27be77ce53eca','bytes':len(result),'triangles':len(ix)//3,'texture':[8192,4096]}
Path('assets/egypt/walkthrough/valley-placement.json').write_text(json.dumps(meta,indent=2)+'\n');print(json.dumps(meta))
