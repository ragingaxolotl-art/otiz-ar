const assert=require('node:assert/strict'),C=require('../tomb-core.js');
assert.equal(C.wheelPixels(5,1),80);assert.equal(C.wheelPixels(1,2,390),390);assert.equal(C.wheelPixels(NaN),0);
const neutral=C.viewerSettings();
assert.equal(C.viewerWheel(neutral,'horizontal',-100).horizontal,.005,'Scroll up brings both whole views together');
assert.equal(C.viewerWheel(neutral,'horizontal',100).horizontal,-.005);
assert.equal(C.viewerWheel(neutral,'fov',-100).fov,82.5,'Empty-handed scroll up narrows view');
assert.equal(C.viewerWheel({fov:72},'fov',100).fov,74.5);
assert.equal(C.viewerWheel({horizontal:.149},'horizontal',-100).horizontal,.15,'Screen movement remains bounded');
assert.equal(C.viewerWheel({fov:55},'fov',-100).fov,55);assert.equal(C.viewerWheel({fov:110},'fov',100).fov,110);
assert.deepEqual(C.viewerWheel(neutral,'swap',100),neutral,'Wheel cannot alter a boolean setting');
assert.deepEqual(C.viewerWheel(neutral,'fov',NaN),neutral);
assert.equal(C.viewerWheel(neutral,'fov',1000000).fov,91,'Large page or mouse deltas are capped');
const changed=C.viewerWheel({...neutral,balance:.02,lens:.16},'horizontal',-100);assert.equal(changed.balance,.02);assert.equal(changed.lens,.16,'Changing spacing preserves lens calibration');
console.log('PASS: view wheel direction, units, adjustment isolation, bounds and invalid input.');

const tap={button:2,since:100,moved:false,walked:false};assert.equal(C.mouseReleaseAction(tap,160,false),'jump');assert.equal(C.mouseReleaseAction(tap,160,true),'return');assert.equal(C.mouseReleaseAction({...tap,moved:true},160,false),null,'Right drag cannot jump');assert.equal(C.mouseReleaseAction(tap,500,false),null,'Holding right cannot jump');assert.equal(C.mouseReleaseAction({...tap,button:0},160,true),'pick');
