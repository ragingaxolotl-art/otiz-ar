"""Keep the original author's wall image resolution in the mobile derivative."""
import json,struct,pathlib,subprocess

def load(path):
 b=pathlib.Path(path).read_bytes();n=struct.unpack_from('<I',b,12)[0];return json.loads(b[20:20+n]),b[28+n:]
d,binary=load('assets/egypt/walkthrough/tomb.glb');source,source_bin=load('assets/egypt/models/tutankhamun-tomb-walkthrough-original.glb');buf=bytearray(binary);replaced=[]
for material in d['materials']:
 name=material.get('name','')
 if not name.startswith('tut_tomb_'):continue
 original=next(m for m in source['materials'] if m.get('name')==name);oi=source['images'][source['textures'][original['pbrMetallicRoughness']['baseColorTexture']['index']]['source']];v=source['bufferViews'][oi['bufferView']];data=source_bin[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']]
 original_image=pathlib.Path('tmp')/(name+'-original.jpg');compressed=pathlib.Path('tmp')/(name+'-web.jpg');original_image.write_bytes(data);subprocess.run(['/usr/bin/sips','-s','format','jpeg','-s','formatOptions','85',str(original_image),'--out',str(compressed)],check=True,stdout=subprocess.DEVNULL);data=compressed.read_bytes()
 while len(buf)%4:buf.append(0)
 offset=len(buf);buf.extend(data);vi=len(d['bufferViews']);d['bufferViews'].append({'buffer':0,'byteOffset':offset,'byteLength':len(data)});image=d['images'][d['textures'][material['pbrMetallicRoughness']['baseColorTexture']['index']]['source']];image['bufferView']=vi;image['mimeType']=oi['mimeType'];replaced.append(name)
used={a['bufferView'] for a in d['accessors'] if 'bufferView' in a}|{im['bufferView'] for im in d['images'] if 'bufferView' in im};packed=bytearray();views=[];mapping={}
for old in sorted(used):
 v=d['bufferViews'][old]
 while len(packed)%4:packed.append(0)
 offset=len(packed);packed.extend(buf[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']]);mapping[old]=len(views);views.append({**v,'byteOffset':offset})
for a in d['accessors']:
 if 'bufferView' in a:a['bufferView']=mapping[a['bufferView']]
for im in d['images']:
 if 'bufferView' in im:im['bufferView']=mapping[im['bufferView']]
d['bufferViews']=views;buf=packed;d['buffers'][0]['byteLength']=len(buf);d['asset']['extras']['wallImageResolution']='Original author-supplied wall image resolution retained; JPEG recompressed for web; no upscaling or invented paint.'
j=json.dumps(d,separators=(',',':')).encode();j+=b' '*((-len(j))%4);buf+=b'\0'*((-len(buf))%4);out=struct.pack('<III',0x46546c67,2,28+len(j)+len(buf))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(buf),0x004e4942)+buf;pathlib.Path('assets/egypt/walkthrough/tomb.glb').write_bytes(out);print(json.dumps({'restoredWalls':len(replaced),'bytes':len(out)}))
