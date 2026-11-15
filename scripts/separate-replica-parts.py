"""Separate the three connected components in the teacher's licensed replica scan.

Run from the project root. Original upload is retained. Output retains the source
CC BY credit; geometry is compacted and the modern coffin supports are trimmed. This separation
is a digital edit of a modern display, not an archaeological reconstruction.
"""
from pathlib import Path
import json,struct,collections,copy
SOURCE=Path('assets/egypt/walkthrough/sarcophagus.glb')
raw=SOURCE.read_bytes();jl=struct.unpack_from('<I',raw,12)[0];doc=json.loads(raw[20:20+jl]);binary=raw[28+jl:]
WIDTH={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}
TYPES={5126:('f',4),5125:('I',4),5123:('H',2)}
def read(i):
 a=doc['accessors'][i];v=doc['bufferViews'][a['bufferView']];w=WIDTH[a['type']];fmt,sz=TYPES[a['componentType']];off=v.get('byteOffset',0)+a.get('byteOffset',0);stride=v.get('byteStride',w*sz)
 return [struct.unpack_from('<'+fmt*w,binary,off+k*stride)for k in range(a['count'])]
def components(positions,indices):
 parent=list(range(len(positions)));same={}
 def find(a):
  while parent[a]!=a:parent[a]=parent[parent[a]];a=parent[a]
  return a
 def union(a,b):
  a,b=find(a),find(b)
  if a!=b:parent[a]=b
 for i,p in enumerate(positions):
  k=tuple(round(v,3)for v in p)
  if k in same:union(i,same[k])
  else:same[k]=i
 for i in range(0,len(indices),3):union(indices[i],indices[i+1]);union(indices[i],indices[i+2])
 groups=collections.defaultdict(list)
 for i in range(0,len(indices),3):groups[find(indices[i])].extend(indices[i:i+3])
 return sorted(groups.values(),key=len,reverse=True)
def build(selected,standardized=False,trim_stand=False):
 out={'asset':copy.deepcopy(doc['asset']),'scene':0,'scenes':[{'nodes':[]}],'nodes':[],'meshes':[],'materials':copy.deepcopy(doc['materials']),'textures':copy.deepcopy(doc['textures']),'samplers':copy.deepcopy(doc['samplers']),'images':copy.deepcopy(doc['images']),'accessors':[],'bufferViews':[]};buf=bytearray();report=[]
 def view(data,target=None):
  buf.extend(b'\0'*(-len(buf)%4));off=len(buf);buf.extend(data);v={'buffer':0,'byteOffset':off,'byteLength':len(data)}
  if target:v['target']=target
  out['bufferViews'].append(v);return len(out['bufferViews'])-1
 for name,mi,ci in selected:
  primitive=doc['meshes'][mi]['primitives'][0];arrays={k:read(i)for k,i in primitive['attributes'].items()};indices=[v[0]for v in read(primitive['indices'])];group=components(arrays['POSITION'],indices)[ci];before=len(group)//3
  if standardized:
   arrays['POSITION']=[(x*.01,-z*.01,y*.01)for x,y,z in arrays['POSITION']]
   for key in ['NORMAL','TANGENT']:
    if key in arrays:arrays[key]=[(v[0],-v[2],v[1],*v[3:])for v in arrays[key]]
  if trim_stand and name=='replica-coffin':
   # The support legs occupy the source scan below 35 cm. Clip only this lower
   # display region; do not synthesize an unseen coffin interior or extra lids.
   plane=.35;clipped=[];edge_cache={}
   def cut(a,b):
    key=tuple(sorted((a,b)))
    if key in edge_cache:return edge_cache[key]
    a,b=key;t=(plane-arrays['POSITION'][a][1])/(arrays['POSITION'][b][1]-arrays['POSITION'][a][1]);new=len(arrays['POSITION'])
    for values in arrays.values():values.append(tuple(u+(v-u)*t for u,v in zip(values[a],values[b])))
    edge_cache[key]=new;return new
   for i in range(0,len(group),3):
    polygon=group[i:i+3];new=[]
    for a,b in zip(polygon,polygon[1:]+polygon[:1]):
     ia,ib=arrays['POSITION'][a][1]>=plane,arrays['POSITION'][b][1]>=plane
     if ia:new.append(a)
     if ia!=ib:new.append(cut(a,b))
    for k in range(1,len(new)-1):clipped.extend((new[0],new[k],new[k+1]))
   group=clipped
  used=sorted(set(group));remap={old:new for new,old in enumerate(used)};attrs={}
  for key,values in arrays.items():
   vals=[values[i]for i in used]
   if key in ['NORMAL','TANGENT']:
    import math
    vals=[tuple(n/(math.sqrt(sum(x*x for x in v[:3]))or 1)for n in v[:3])+((1 if v[3]>=0 else -1,)if key=='TANGENT'else())for v in vals]
   a={'bufferView':view(struct.pack('<'+'f'*sum(map(len,vals)),*(n for v in vals for n in v)),34962),'componentType':5126,'count':len(vals),'type':doc['accessors'][primitive['attributes'][key]]['type']}
   if key=='POSITION':a.update(min=[min(v[k]for v in vals)for k in range(3)],max=[max(v[k]for v in vals)for k in range(3)])
   attrs[key]=len(out['accessors']);out['accessors'].append(a)
  ids=[remap[i]for i in group];accessor=len(out['accessors']);out['accessors'].append({'bufferView':view(struct.pack('<'+'I'*len(ids),*ids),34963),'componentType':5125,'count':len(ids),'type':'SCALAR'})
  out['meshes'].append({'name':name,'primitives':[{'attributes':attrs,'indices':accessor,'material':primitive['material'],'mode':4}]})
  if standardized:
   out['scenes'][0]['nodes'].append(len(out['nodes']));out['nodes'].append({'name':name,'mesh':len(out['meshes'])-1})
  else:
   chain=[]
   for i in range(4):
    node=copy.deepcopy(doc['nodes'][i]);node.pop('children',None);node.pop('mesh',None);node['name']=name+('-root'if i==0 else '-transform-'+str(i));chain.append(node)
   chain.append({'name':name,'mesh':len(out['meshes'])-1});start=len(out['nodes']);out['scenes'][0]['nodes'].append(start)
   for k,node in enumerate(chain):
    if k<len(chain)-1:node['children']=[start+k+1]
    out['nodes'].append(node)
  report.append({'name':name,'sourceMesh':mi,'sourceComponent':ci,'trianglesBefore':before,'trianglesAfter':len(ids)//3,'minimum':out['accessors'][attrs['POSITION']]['min'],'maximum':out['accessors'][attrs['POSITION']]['max']})
 for im in out['images']:
  v=doc['bufferViews'][im['bufferView']];off=v.get('byteOffset',0);im['bufferView']=view(binary[off:off+v['byteLength']])
 out['buffers']=[{'byteLength':len(buf)}];out['asset'].setdefault('extras',{})['modifications']='Separated connected components of the modern replica display; source textures and credit retained. '+('Axes standardized; lower modern coffin supports clipped at source height 0.35 m. Chair/vessel remain unverified reference material.'if standardized else 'Source transforms retained for comparison.')
 js=json.dumps(out,separators=(',',':')).encode();js+=b' '*(-len(js)%4);buf+=b'\0'*(-len(buf)%4)
 data=struct.pack('<III',0x46546c67,2,28+len(js)+len(buf))+struct.pack('<II',len(js),0x4e4f534a)+js+struct.pack('<II',len(buf),0x004e4942)+buf
 return data,report
PARTS=[('replica-coffin',0,0),('replica-display',0,1),('replica-anubis',1,0)]
if __name__=='__main__':
 for name,mi,ci in PARTS:
  data,_=build([(name,mi,ci)]);Path('tmp/coffin-parts/'+name+'.glb').write_bytes(data)
 data,report=build(PARTS,standardized=True,trim_stand=True);Path('assets/egypt/walkthrough/replica-parts.glb').write_bytes(data)
 Path('assets/egypt/models/replica-parts.source.json').write_text(json.dumps({'title':'Separated parts of the modern replica display','creator':'karaman.arman','source':'https://sketchfab.com/3d-models/tutankhamuns-sarcophagus-replica-6c235c8f6e4148b1a4f467fbd64b8c7c','license':'https://creativecommons.org/licenses/by/4.0/','originalWebModel':'assets/egypt/models/sarcophagus-replica.glb','derivative':'assets/egypt/walkthrough/replica-parts.glb','date':'2026-11-15','changes':'Connected components separated; axes standardized; lower modern coffin supports clipped at source height 0.35 m. Meshes are replicas scanned at the Cairo (Giza) Papyrus center, not scans of excavated objects.','parts':report,'unverified':'replica-display contains a chair and vessel not identified by the creator; retained as reference, excluded from the historical room arrangement.'},indent=2)+'\n')
 print(json.dumps({'bytes':len(data),'parts':report}))
