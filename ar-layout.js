/* Live models fit their own marker; Capture supplies the large inspection view. */
(function(){
  function fitScale(halfSize,modelLength,pose,markerWidthCm){
    const k=Math.PI/180,x=pose.pitch*k,y=pose.yaw*k,z=pose.roll*k;
    const sx=Math.sin(x),cx=Math.cos(x),sy=Math.sin(y),cy=Math.cos(y),sz=Math.sin(z),cz=Math.cos(z);
    // Absolute YXZ rotation bounds, in the marker's coordinates, not the camera's.
    const rows=[
      [cy*cz+sy*sx*sz,-cy*sz+sy*sx*cz,sy*cx],
      [cx*sz,cx*cz,-sx],
      [-sy*cz+cy*sx*sz,sy*sz+cy*sx*cz,cy*cx]
    ];
    const sides=[halfSize.x*2,halfSize.y*2,halfSize.z*2];
    const longest=Math.max(...rows.map(row=>row.reduce((sum,value,i)=>sum+Math.abs(value)*sides[i],0)));
    return markerWidthCm*.9*modelLength/(pose.lengthCm*longest);
  }
  window.ARLayout={fitScale};
})();
