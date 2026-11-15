"""Audit static GLB world triangles for duplicate/coplanar faces (stdlib only)."""
import json,struct,collections,math,sys
from pathlib import Path
b=Path('assets/egypt/walkthrough/tomb.glb').read_bytes();n=struct.unpack_from('<I',b,12)[0];d=json.loads(b[20:20+n]);binary=b[28+n:]
def accessor(i):
 a=d['accessors'][i];v=d['bufferViews'][a['bufferView']];width={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}[a['type']];fmt,size={5126:('f',4),5125:('I',4),5123:('H',2)}[a['componentType']];start=v.get('byteOffset',0)+a.get('byteOffset',0);stride=v.get('byteStride',size*width)
 return [struct.unpack_from('<'+fmt*width,binary,start+k*stride) for k in range(a['count'])]
def mul(a,b):return [sum(a[k*4+r]*b[c*4+k] for k in range(4)) for c in range(4) for r in range(4)]
identity=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
def matrix(node):
 if 'matrix' in node:return node['matrix']
 x,y,z,w=node.get('rotation',[0,0,0,1]);sx,sy,sz=node.get('scale',[1,1,1]);tx,ty,tz=node.get('translation',[0,0,0]);return [(1-2*(y*y+z*z))*sx,2*(x*y+z*w)*sx,2*(x*z-y*w)*sx,0,2*(x*y-z*w)*sy,(1-2*(x*x+z*z))*sy,2*(y*z+x*w)*sy,0,2*(x*z+y*w)*sz,2*(y*z-x*w)*sz,(1-2*(x*x+y*y))*sz,0,tx,ty,tz,1]
def point(m,p):return tuple(.0254*(sum(m[k*4+r]*p[k] for k in range(3))+m[12+r]) for r in range(3))
triangles=[]
def visit(i,parent):
 node=d['nodes'][i];m=mul(parent,matrix(node))
 if 'mesh' in node:
  for p in d['meshes'][node['mesh']]['primitives']:
   material=d['materials'][p['material']]['name']
   if material.startswith('Lisanne_'):continue
   ps=[point(m,v) for v in accessor(p['attributes']['POSITION'])];ix=[v[0] for v in accessor(p['indices'])]
   for j in range(0,len(ix),3):triangles.append({'points':[ps[ix[j+k]] for k in range(3)],'material':material})
 for c in node.get('children',[]):visit(c,m)
for i in d['scenes'][d.get('scene',0)]['nodes']:visit(i,identity)
seen=collections.defaultdict(list);planes=collections.defaultdict(list)
for t in triangles:
 p=t['points'];key=tuple(sorted(tuple(round(v,4) for v in pt) for pt in p));seen[key].append(t['material'])
 u=[p[1][k]-p[0][k] for k in range(3)];v=[p[2][k]-p[0][k] for k in range(3)];normal=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];length=math.sqrt(sum(x*x for x in normal))
 if length<1e-8:continue
 normal=[x/length for x in normal];axis=max(range(3),key=lambda k:abs(normal[k]));sign=1 if normal[axis]>0 else -1;normal=[x*sign for x in normal];dist=sum(normal[k]*p[0][k] for k in range(3));plane=tuple(round(x,4) for x in normal)+(round(dist,4),);planes[plane].append(t)
result={'worldTriangles':len(triangles),'duplicateGroups':[{ 'count':len(ms),'materials':ms} for ms in seen.values() if len(ms)>1],'paintedWallPlanes':[{'plane':plane,'triangles':len(ts),'materials':dict(collections.Counter(t['material'] for t in ts))} for plane,ts in planes.items() if any(t['material'].startswith('tut_tomb_') for t in ts)]}
Path('tmp/tomb-world-triangles.json').write_text(json.dumps(triangles))
if '--write-fixture' in sys.argv:
 Path('tests/fixtures/tomb-world.json').write_text(json.dumps([[[round(v,6) for v in point] for point in t['points']] for t in triangles],separators=(',',':'))+'\n')
Path('tmp/tomb-geometry-audit.json').write_text(json.dumps(result,indent=2))
print(json.dumps({'worldTriangles':len(triangles),'duplicateGroups':len(result['duplicateGroups']),'duplicateFaces':sum(g['count']-1 for g in result['duplicateGroups']),'paintedPlanes':len(result['paintedWallPlanes'])}))
