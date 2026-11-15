"""Remove coincident opaque faces, preferring photographed surfaces over back faces."""
exec(open('scripts/audit-tomb-geometry.py').read().split('triangles=[]')[0])
occurrences=collections.defaultdict(list)
def rank(name):
 if name.startswith('tut_tomb_'):return 100
 if name.startswith('King-tut'):return 90
 return {'Stone_Brushed_Khaki':70,'Granite_Brown':60}.get(name,10)
def scan(i,parent):
 node=d['nodes'][i];m=mul(parent,matrix(node))
 if 'mesh' in node:
  for pi,p in enumerate(d['meshes'][node['mesh']]['primitives']):
   material=d['materials'][p['material']]['name']
   if material.startswith('Lisanne_'):continue
   ps=[point(m,v) for v in accessor(p['attributes']['POSITION'])];ix=[v[0] for v in accessor(p['indices'])]
   for j in range(0,len(ix),3):
    pts=[ps[ix[j+k]] for k in range(3)];key=tuple(sorted(tuple(round(v,4) for v in pt) for pt in pts));occurrences[key].append((rank(material),node['mesh'],pi,j//3))
 for c in node.get('children',[]):scan(c,m)
for i in d['scenes'][d.get('scene',0)]['nodes']:scan(i,identity)
remove=collections.defaultdict(set)
for group in occurrences.values():
 if len(group)>1:
  winner=max(group,key=lambda item:item[0])
  for item in group:
   if item!=winner:remove[item[1],item[2]].add(item[3])
buf=bytearray(binary);removed=0
for (mi,pi),drop in remove.items():
 p=d['meshes'][mi]['primitives'][pi];old=accessor(p['indices']);ix=[old[j][0] for j in range(len(old)) if j//3 not in drop];removed+=len(drop)
 while len(buf)%4:buf.append(0)
 offset=len(buf);buf.extend(struct.pack('<'+'I'*len(ix),*ix));vi=len(d['bufferViews']);d['bufferViews'].append({'buffer':0,'byteOffset':offset,'byteLength':len(ix)*4,'target':34963});ai=len(d['accessors']);d['accessors'].append({'bufferView':vi,'componentType':5125,'count':len(ix),'type':'SCALAR'});p['indices']=ai
# Empty primitives are omitted; their original buffers remain intact for provenance.
for mesh in d['meshes']:mesh['primitives']=[p for p in mesh['primitives'] if d['accessors'][p['indices']]['count']]
d['buffers'][0]['byteLength']=len(buf);d['asset'].setdefault('extras',{})['surfaceCleanup']='Removed coincident opaque triangles, preferring photographed surfaces; modern figure hidden at runtime.'
j=json.dumps(d,separators=(',',':')).encode();j+=b' '*((-len(j))%4);buf+=b'\0'*((-len(buf))%4);out=struct.pack('<III',0x46546c67,2,28+len(j)+len(buf))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(buf),0x004e4942)+buf
Path('assets/egypt/walkthrough/tomb.glb').write_bytes(out);print(json.dumps({'removedDuplicateFaces':removed,'bytes':len(out)}))
