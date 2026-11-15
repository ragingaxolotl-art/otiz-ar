const assert=require('node:assert/strict'),C=require('../tomb-core.js'),Collision=require('../tomb-collision.js');
let s={feet:0,velocity:4.2,grounded:false,origin:0};for(let i=0;i<10;i++)s=C.verticalStep(s,.05,0);assert(s.feet>1&&s.feet<1.11);for(let i=0;i<30&&!s.grounded;i++)s=C.verticalStep(s,.05,.6);assert(s.grounded&&s.feet===.6,'Jump lands on a raised ledge');
s={feet:1.2,velocity:0,grounded:true};s=C.verticalStep(s,.05,0);assert(!s.grounded&&s.feet<1.2,'Walking off starts falling');for(let i=0;i<30&&!s.grounded;i++)s=C.verticalStep(s,.05,0);assert(s.grounded&&s.feet===0,'Fall lands on the lower floor');
s={feet:1,velocity:4.2,grounded:false,origin:1};for(let i=0;i<80&&!s.grounded;i++)s=C.verticalStep(s,.05,-2);assert(s.feet===-2&&s.grounded,'Jumping down can land below launch height');
const wall=[[[0,0,-1],[0,.7,-1],[0,.7,1]],[[0,0,-1],[0,.7,1],[0,0,1]]],world=Collision.createWorld(wall);
let p=world.move({x:-.5,z:0,feet:0},1,0,{airborne:true,floorAt:()=>.7});assert(p.x<0,'Cannot cross a ledge while feet are below it');p=world.move({x:-.5,z:0,feet:.8},1,0,{airborne:true,floorAt:()=>.7});assert(p.x>.49&&p.feet===.8,'Air movement can cross above ledge without snapping up');
p=world.move({x:1,z:0,feet:.7},1,0,{allowDrop:true,floorAt:()=>-2});assert(p.x>1.9&&p.feet===.7,'Leaving a ledge preserves height until gravity acts');
