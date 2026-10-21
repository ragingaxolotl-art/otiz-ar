/* A screen-held 3D view. Its zoom deliberately has no relationship to paper size. */
(function(){
  class ArtifactExplorer{
    constructor(T,host){
      this.T=T;this.host=host;this.zoom=1;this.active=false;
      this.renderer=new T.WebGLRenderer({alpha:true,antialias:true});this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.outputColorSpace=T.SRGBColorSpace;host.appendChild(this.renderer.domElement);
      this.scene=new T.Scene();this.camera=new T.PerspectiveCamera(42,1,.01,100);
      this.scene.add(new T.HemisphereLight(0xfff7df,0x566044,2.5));const sun=new T.DirectionalLight(0xffe8c0,3);sun.position.set(3,5,4);this.scene.add(sun);
      this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(host);
    }
    open(source,pose){
      this.close();const T=this.T;this.host.hidden=false;this.active=true;
      this.object=source.clone(true);this.object.position.set(0,0,0);this.object.scale.setScalar(1/source.userData.modelLength);
      this.presentation=new T.Group();this.presentation.rotation.x=.55;this.presentation.add(this.object);this.scene.add(this.presentation);
      this.startPose={...pose};this.reset();this.resize();
    }
    resize(){
      const w=this.host.clientWidth,h=this.host.clientHeight;if(!w||!h||!this.active)return;
      this.renderer.setSize(w,h,false);this.camera.aspect=w/h;
      this.presentation.position.set(0,0,0);const box=new this.T.Box3().setFromObject(this.presentation,true),size=box.getSize(new this.T.Vector3()),center=box.getCenter(new this.T.Vector3());this.presentation.position.copy(center).multiplyScalar(-1);
      const tangent=Math.tan(this.camera.fov*Math.PI/360),distance=Math.max(size.x/(2*tangent*this.camera.aspect),size.y/(2*tangent),.05)/.72+size.z/2;
      this.camera.position.set(0,0,distance);this.camera.lookAt(0,0,0);this.camera.updateProjectionMatrix();this.render();
    }
    rotate(pitch,yaw,roll=this.roll){this.pitch=pitch;this.yaw=yaw;this.roll=roll;this.object.rotation.set(pitch,yaw,roll,'YXZ');this.render();}
    setZoom(value){if(!Number.isFinite(value)||value<=0)return;this.zoom=Math.max(.02,value);this.camera.zoom=this.zoom;this.camera.updateProjectionMatrix();this.render();}
    fit(){this.setZoom(1);this.resize();}
    reset(){const p=this.startPose,k=Math.PI/180;this.rotate(p.pitch*k,p.yaw*k,p.roll*k);this.resize();this.setZoom((p.screenZoom||100)/100);}
    render(){if(this.active)this.renderer.render(this.scene,this.camera);}
    close(){this.active=false;if(this.presentation)this.scene.remove(this.presentation);this.presentation=null;this.object=null;this.host.hidden=true;this.renderer.clear();}
    dispose(){this.close();this.observer.disconnect();this.renderer.dispose();}
  }
  window.ArtifactExplorer=ArtifactExplorer;
})();
