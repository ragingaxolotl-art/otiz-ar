"""Build the credited first-person body derivative; preserve the original GLB.
The exported asset shares the head's bind-scale with every mesh. Strip that
scale from body vertices, retain the coherent shirt, belt pouch and body in bind space, and retain
only the joints/animation channels needed by the first-person meshes.
"""
import struct,json,math,copy
from pathlib import Path
BASE=Path(__file__).resolve().parents[1]
raw=(BASE/'assets/characters/girl-explorer-original.glb').read_bytes();n=struct.unpack_from('<I',raw,12)[0];g=json.loads(raw[20:20+n]);binary=raw[28+n:]
ct={5126:'f',5125:'I',5123:'H',5121:'B'};width={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}
def acc(i):
 a=g['accessors'][i];v=g['bufferViews'][a['bufferView']];fmt=ct[a['componentType']]*width[a['type']];size=struct.calcsize('<'+fmt);off=v.get('byteOffset',0)+a.get('byteOffset',0)
 return[struct.unpack_from('<'+fmt,binary,off+j*v.get('byteStride',size))for j in range(a['count'])]
# Heavy hair, eyes, head and headgear are deliberately absent from the body view.
mesh_ids=[3,9,10];parents={c:i for i,v in enumerate(g['nodes'])for c in v.get('children',[])};joints=g['skins'][0]['joints'];used=set();geos=[]
for mi in mesh_ids:
 p=copy.deepcopy(g['meshes'][mi]['primitives'][0]);at=p['attributes'];ps=acc(at['POSITION']);ns=acc(at['NORMAL']);js=acc(at['JOINTS_0']);ws=acc(at['WEIGHTS_0']);ids=acc(p['indices']);uv=acc(at['TEXCOORD_0']);triangles=[tuple(v[0]for v in ids[i:i+3])for i in range(0,len(ids),3)]
 # The neck is never visible from inside the player's head. Removing its cap
 # also removes the malformed neck tip from the source export.
 if mi==10:triangles=[t for t in triangles if max(ps[i][1]for i in t)<111.5]
 live=sorted({i for t in triangles for i in t});remap={old:new for new,old in enumerate(live)};newp=[];newn=[]
 for i in live:
  x,y,z=ps[i];nx,ny,nz=ns[i]
  newp.append((x/17.5050678253,y/18.8173313141,z/20.5856342316))
  nn=(nx*17.5050678253,ny*18.8173313141,nz*20.5856342316);length=math.sqrt(sum(v*v for v in nn));newn.append(tuple(v/length for v in nn))
 newj=[js[i]for i in live];neww=[ws[i]for i in live]
 for j,w in zip(newj,neww):used.update(ji for ji,weight in zip(j,w)if weight>0)
 geos.append((mi,newp,newn,[uv[i]for i in live],newj,neww,[(remap[a],remap[b],remap[c])for a,b,c in triangles]))
keep={i for i,node in enumerate(g['nodes'])if node.get('mesh')in mesh_ids}|{joints[i]for i in used}
for i in list(keep):
 while i in parents:i=parents[i];keep.add(i)
node_ids=sorted(keep);node_map={old:new for new,old in enumerate(node_ids)};joint_ids=sorted(used);joint_map={old:new for new,old in enumerate(joint_ids)}
out={'asset':copy.deepcopy(g['asset']),'scene':0,'scenes':[{'name':'Explorer first-person body','nodes':[node_map[0]]}],'nodes':[],'meshes':[],'skins':[],'animations':[],'materials':g['materials'],'textures':g['textures'],'images':[],'samplers':g.get('samplers',[]),'buffers':[{}],'bufferViews':[],'accessors':[]};data=bytearray()
def view(b,target=None):
 while len(data)%4:data.append(0)
 d={'buffer':0,'byteOffset':len(data),'byteLength':len(b)}
 if target:d['target']=target
 data.extend(b);out['bufferViews'].append(d);return len(out['bufferViews'])-1
def accessor(rows,typ,component=5126,target=None):
 flat=[v for row in rows for v in row];b=struct.pack('<'+ct[component]*len(flat),*flat);a={'bufferView':view(b,target),'componentType':component,'count':len(rows),'type':typ}
 if typ in ['SCALAR','VEC3'] and rows:a.update(min=[min(row[i]for row in rows)for i in range(len(rows[0]))],max=[max(row[i]for row in rows)for i in range(len(rows[0]))])
 out['accessors'].append(a);return len(out['accessors'])-1
mesh_map={}
for mi,ps,ns,uv,js,ws,ts in geos:
 mesh_map[mi]=len(out['meshes']);at={'POSITION':accessor(ps,'VEC3',target=34962),'NORMAL':accessor(ns,'VEC3',target=34962),'TEXCOORD_0':accessor(uv,'VEC2',target=34962),'JOINTS_0':accessor([tuple(joint_map[j]if w>0 else 0 for j,w in zip(jj,ww))for jj,ww in zip(js,ws)],'VEC4',5121 if len(joint_ids)<256 else 5123,34962),'WEIGHTS_0':accessor(ws,'VEC4',target=34962)}
 if mi==10:
  colors=[]
  for pos,jj,ww in zip(ps,js,ws):
   y=pos[1]*18.8173313141
   lower=sum(w for j,w in zip(jj,ww)if any(term in g['nodes'][joints[j]].get('name','').lower()for term in ['thigh','shin','foot','toe','pelvis','spine']))>.5
   colors.append((.12,.055,.025)if y<32 else(.42,.23,.11)if 64<y<89 and lower else(1.,1.,1.))
  at['COLOR_0']=accessor(colors,'VEC3',target=34962)
 out['meshes'].append({'name':g['meshes'][mi]['name'],'primitives':[{'attributes':at,'indices':accessor([(i,)for t in ts for i in t],'SCALAR',5123,34963),'material':0}]})
for old in node_ids:
 node=copy.deepcopy(g['nodes'][old]);node['children']=[node_map[c]for c in node.get('children',[])if c in keep]
 if not node['children']:node.pop('children')
 if 'mesh'in node:node['mesh']=mesh_map[node['mesh']]
 out['nodes'].append(node)
ibm=acc(g['skins'][0]['inverseBindMatrices']);out['skins']=[{'joints':[node_map[joints[i]]for i in joint_ids],'skeleton':node_map[g['skins'][0]['skeleton']],'inverseBindMatrices':accessor([ibm[i]for i in joint_ids],'MAT4')}]
cache={}
def copy_access(i):
 if i not in cache:
  a=g['accessors'][i];cache[i]=accessor(acc(i),a['type'],a['componentType'])
 return cache[i]
for source in g['animations']:
 if 'Attack'in source['name']:continue
 a={'name':source['name'],'samplers':[],'channels':[]}
 for c in source['channels']:
  if c['target']['node']not in keep:continue
  s=source['samplers'][c['sampler']];a['samplers'].append({'input':copy_access(s['input']),'output':copy_access(s['output']),'interpolation':s.get('interpolation','LINEAR')});a['channels'].append({'sampler':len(a['samplers'])-1,'target':{'node':node_map[c['target']['node']],'path':c['target']['path']}})
 out['animations'].append(a)
image=g['images'][0];v=g['bufferViews'][image['bufferView']];out['images']=[{'bufferView':view(binary[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']]),'mimeType':image['mimeType']}]
out['asset']['extras']['modifications']='First-person body derivative: corrected body bind scale, cropped unseen neck tip, retained body/shirt/pouch, added brown boot/short colors to replace detached clothing meshes, excluded unseen head/hair and damaged accessories, trimmed unused rig and attack clip. Full source preserved separately.'
out['buffers'][0]['byteLength']=len(data)
while len(data)%4:data.append(0)
j=json.dumps(out,separators=(',',':')).encode()
while len(j)%4:j+=b' '
result=struct.pack('<III',0x46546c67,2,28+len(j)+len(data))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(data),0x004e4942)+data
path=BASE/'assets/characters/girl-explorer-body.glb';path.write_bytes(result)
report={'fileBytes':len(result),'meshCount':len(out['meshes']),'triangleCount':sum(len(x[-1])for x in geos),'jointCount':len(joint_ids),'nodeCount':len(node_ids),'animationChannels':{a['name']:len(a['channels'])for a in out['animations']}}
(BASE/'tmp/explorer-body-build.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
