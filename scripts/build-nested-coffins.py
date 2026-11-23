"""Build a teaching assembly from three uploaded closed meshes.
The outer lid retains uploaded decoration; its hollow case is constructed geometry.
Fit and opening are teaching choices, not archaeological measurements.
"""
from pathlib import Path
import json,struct,copy,math,hashlib
ROOT=Path(__file__).resolve().parents[1];M=ROOT/'assets/egypt/models'
WIDTH={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4};TYPES={5126:'f',5125:'I',5123:'H'}
def load(name):
 b=(M/name).read_bytes();n=struct.unpack_from('<I',b,12)[0];return json.loads(b[20:20+n]),b[28+n:]
def read(d,b,i):
 a=d['accessors'][i];v=d['bufferViews'][a['bufferView']];fmt='<'+TYPES[a['componentType']]*WIDTH[a['type']];stride=v.get('byteStride',struct.calcsize(fmt));off=v.get('byteOffset',0)+a.get('byteOffset',0)
 return [struct.unpack_from(fmt,b,off+k*stride)for k in range(a['count'])]
out={'asset':{'version':'2.0','generator':'Field Lab nested coffin builder','extras':{'description':'Two teacher-supplied Meshy AI coffins. Constructed hollow outer case and cut lid; approximate teaching fit, not museum measurements.'}},'scene':0,'scenes':[{'nodes':[0,1,2]}],'nodes':[],'meshes':[],'accessors':[],'bufferViews':[],'materials':[],'images':[],'textures':[],'samplers':[]};buf=bytearray()
def view(data,target=None):
 buf.extend(b'\0'*(-len(buf)%4));off=len(buf);buf.extend(data);out['bufferViews'].append({'buffer':0,'byteOffset':off,'byteLength':len(data),**({'target':target}if target else{})});return len(out['bufferViews'])-1
def accessor(values,kind,component=5126,target=34962):
 flat=[q for v in values for q in v];a={'bufferView':view(struct.pack('<'+TYPES[component]*len(flat),*flat),target),'componentType':component,'count':len(values),'type':kind}
 if kind in ['VEC3','SCALAR']:a.update(min=[min(v[k]for v in values)for k in range(WIDTH[kind])],max=[max(v[k]for v in values)for k in range(WIDTH[kind])])
 out['accessors'].append(a);return len(out['accessors'])-1
def mesh(name,attrs,ids,material):
 primitive={'attributes':{k:accessor(v,'VEC'+str(len(v[0])))for k,v in attrs.items()},'indices':accessor([(i,)for i in ids],'SCALAR',5125,34963),'material':material}
 out['meshes'].append({'name':name,'primitives':[primitive]});return len(out['meshes'])-1
def import_material(d,b):
 imoff=len(out['images']);toff=len(out['textures']);soff=len(out['samplers']);moff=len(out['materials'])
 for im in d['images']:
  im=copy.deepcopy(im);v=d['bufferViews'][im['bufferView']];im['bufferView']=view(b[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']]);out['images'].append(im)
 out['samplers']+=copy.deepcopy(d.get('samplers',[]))
 for t in d['textures']:
  t=copy.deepcopy(t);t['source']+=imoff
  if 'sampler'in t:t['sampler']+=soff
  out['textures'].append(t)
 def fix(o):
  if isinstance(o,dict):
   for k,v in o.items():
    if k.endswith('Texture')and isinstance(v,dict):v['index']+=toff
    else:fix(v)
 for m in d['materials']:m=copy.deepcopy(m);fix(m);out['materials'].append(m)
 return moff
def source(name):
 d,b=load(name);p=d['meshes'][0]['primitives'][0];return {k:read(d,b,i)for k,i in p['attributes'].items()},[v[0]for v in read(d,b,p['indices'])],import_material(d,b)
def shell(name,attrs,source_ids,material,child_points):
 attrs=copy.deepcopy(attrs);plane=-.08;ids=[];edges={}
 def cut(a,b):
  key=tuple(sorted((a,b)))
  if key in edges:return edges[key]
  t=(plane-attrs['POSITION'][a][2])/(attrs['POSITION'][b][2]-attrs['POSITION'][a][2]);n=len(attrs['POSITION'])
  for values in attrs.values():values.append(tuple(x+(y-x)*t for x,y in zip(values[a],values[b])))
  edges[key]=n;return n
 for i in range(0,len(source_ids),3):
  tri=source_ids[i:i+3];poly=[]
  for a,b in zip(tri,tri[1:]+tri[:1]):
   ia,ib=attrs['POSITION'][a][2]>=plane,attrs['POSITION'][b][2]>=plane
   if ia:poly.append(a)
   if ia!=ib:poly.append(cut(a,b))
  for k in range(1,len(poly)-1):ids.extend([poly[0],poly[k],poly[k+1]])
 used=sorted(set(ids));remap={v:i for i,v in enumerate(used)};lid=mesh(name+'-decorated-lid',{k:[v[i]for i in used]for k,v in attrs.items()},[remap[i]for i in ids],material)
 N=160;lo=min(v[1]for v in attrs['POSITION']);hi=max(v[1]for v in attrs['POSITION']);dy=(hi-lo)/N;rows=[]
 for i in range(N+1):
  y=lo+i*dy;vs=[v for v in attrs['POSITION']if abs(v[1]-y)<=dy*1.5];rows.append(max([abs(v[0])for v in vs]or[.03]))
 rows=[max(.025,sum(rows[max(0,i-2):min(N+1,i+3)])/len(rows[max(0,i-2):min(N+1,i+3)]))for i in range(N+1)]
 contour=[(-rows[i],lo+i*dy)for i in range(N+1)]+[(rows[i],lo+i*dy)for i in range(N,-1,-1)];wall=.022;inner=[(x-math.copysign(wall,x),y*.975)for x,y in contour]
 def halfwidth(y):
  q=(y/.975-lo)/dy
  if q<0 or q>N:return 0
  i=min(N-1,int(q));return rows[i]*(1-(q-i))+rows[i+1]*(q-i)-wall
 cx=(min(v[0]for v in child_points)+max(v[0]for v in child_points))/2;cy=(min(v[1]for v in child_points)+max(v[1]for v in child_points))/2;ratio=.91
 while ratio>.3:
  if all(abs((x-cx)*ratio)+.012<halfwidth((y-cy)*ratio)for x,y,z in child_points):break
  ratio-=.002
 assert ratio>.6,(name,ratio)
 mz=plane-.018-max(v[2]for v in child_points)*ratio;floor=min(v[2]for v in child_points)*ratio+mz-.02;back=floor-.025;positions=[];indices=[]
 def tri(a,b,c):
  n=len(positions);positions.extend([a,b,c]);indices.extend([n,n+1,n+2])
 def quad(a,b,c,d):tri(a,b,c);tri(a,c,d)
 for i in range(len(contour)):
  j=(i+1)%len(contour);x,y=contour[i];xx,yy=contour[j];ix,iy=inner[i];jx,jy=inner[j]
  quad((x,y,back),(xx,yy,back),(xx,yy,plane),(x,y,plane));quad((ix,iy,plane),(jx,jy,plane),(jx,jy,floor),(ix,iy,floor));quad((x,y,plane),(xx,yy,plane),(jx,jy,plane),(ix,iy,plane));tri((0,0,floor),(ix,iy,floor),(jx,jy,floor));tri((0,0,back),(xx,yy,back),(x,y,back))
 gold=len(out['materials']);out['materials'].append({'name':name+'-constructed-gilded-case','pbrMetallicRoughness':{'baseColorFactor':[.52,.32,.085,1],'metallicFactor':.65,'roughnessFactor':.48},'doubleSided':True})
 case=mesh(name+'-hollow-case',{'POSITION':positions},indices,gold);translation=[-cx*ratio,-cy*ratio,mz];cloud=positions+[attrs['POSITION'][i]for i in used]
 report={'coffin':name,'childScale':round(ratio,4),'childTranslation':translation,'innerFloor':floor,'lidPlane':plane,'sideClearance':.012,'verifiedChildVertices':len(child_points)}
 return case,lid,ratio,translation,cloud,report
outer,oi,om=source('outer-coffin-ai.glb');middle,mi,mm=source('middle-coffin-ai.glb');inner,ii,im=source('inner-coffin-ai.glb')
inner_mesh=mesh('innermost-coffin',inner,ii,im)
mc,ml,ir,it,midcloud,mreport=shell('middle',middle,mi,mm,inner['POSITION'])
oc,ol,mr,mt,outercloud,oreport=shell('outer',outer,oi,om,midcloud)
out['nodes']=[{'name':'coffin-assembly','children':[1,2,3]},{'name':'outer-hollow-case','mesh':oc},{'name':'outer-lid','mesh':ol},{'name':'middle-coffin-group','translation':mt,'scale':[mr]*3,'children':[4,5,6]},{'name':'middle-hollow-case','mesh':mc},{'name':'middle-lid','mesh':ml},{'name':'innermost-coffin','mesh':inner_mesh,'translation':it,'scale':[ir]*3}];out['scenes']=[{'nodes':[0]}]
out['asset']['extras']['description']='Three teacher-supplied AI coffins. Constructed hollow outer and middle cases; cut decorated lids; innermost mesh preserved. Approximate teaching fit.'
def save(name,opened=False):
 doc=copy.deepcopy(out)
 if opened:doc['nodes'][2]['translation']=[1.85,0,.13];doc['nodes'][5]['translation']=[.95/mr,0,.13/mr]
 doc['buffers']=[{'byteLength':len(buf)}];js=json.dumps(doc,separators=(',',':')).encode();js+=b' '*(-len(js)%4);bn=buf+b'\0'*(-len(buf)%4);data=struct.pack('<4sII',b'glTF',2,28+len(js)+len(bn))+struct.pack('<I4s',len(js),b'JSON')+js+struct.pack('<I4s',len(bn),b'BIN\0')+bn;(M/name).write_bytes(data);return len(data)
closed=save('nested-coffins-ai.glb');opened=save('nested-coffins-open-ai.glb',True)
report={'title':'Three nested coffins · teaching assembly','sources':['outer-coffin-ai.source.json','middle-coffin-ai.source.json','inner-coffin-ai.source.json'],'fitChecks':[oreport,mreport],'fit':'Every child mesh vertex checked against its containing cavity with side clearance. Both child assemblies lie below their enclosing lid and above their case floor.','construction':'Outer and middle decorated lids cut from supplied meshes. Hollow cases, hidden surfaces, wall thickness and relative scale are constructed teaching geometry, not verified archaeological measurements. Innermost mesh retained.','dateAdded':'2026-11-23','webBytes':closed,'openWebBytes':opened};(M/'nested-coffins-ai.source.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
