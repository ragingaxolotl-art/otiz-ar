const assert=require('node:assert/strict'),fs=require('node:fs'),Collision=require('../tomb-collision.js');
const quad=(a,b,c,d)=>[[a,b,c],[a,c,d]];
const wall=quad([0,0,-3],[0,3,-3],[0,3,3],[0,0,3]);
let world=Collision.createWorld(wall);
assert(world.clear(-.25,0,0));assert(!world.clear(-.15,0,0),'Body radius stops eye-point wall clipping');
let p=world.move({x:-2,z:0,feet:0},4,0);assert(p.x<=-.235&&p.x>=-.30,'Swept volume cannot tunnel through a thin wall');
p=world.move({x:-.25,z:0,feet:0},1,1);assert(p.x<=-.235&&p.z>.9,'Body slides along a wall');
const corner=quad([-3,0,0],[-3,3,0],[3,3,0],[3,0,0]);world=Collision.createWorld([...wall,...corner]);p=world.move({x:-1,z:-1,feet:0},3,3);assert(p.x<=-.235&&p.z<=-.235,'Diagonal approach cannot cross corners');
const ceiling=quad([-2,1.2,-2],[2,1.2,-2],[2,1.2,2],[-2,1.2,2]);world=Collision.createWorld(ceiling);assert(!world.clear(0,0,0,1.75),'Standing body hits a low ceiling');assert(world.clear(0,0,0,1),'Crouching fits below a low ceiling');assert(!world.clear(0,0,.3,1),'Jump also respects headroom');
const floor=quad([-3,0,-3],[3,0,-3],[3,0,3],[-3,0,3]);world=Collision.createWorld(floor);assert(world.clear(0,0,0),'Walking surface does not block the rounded capsule base');
const door=[...quad([0,0,-3],[0,3,-3],[0,3,-.45],[0,0,-.45]),...quad([0,0,.45],[0,3,.45],[0,3,3],[0,0,3])];world=Collision.createWorld(door);p=world.move({x:-1,z:0,feet:0},2,0);assert(p.x>.9,'A valid doorway remains passable');p=world.move({x:-1,z:.35,feet:0},2,0);assert(p.x<0,'A doorway edge catches the player radius');
assert(Math.abs(Collision.segmentSegmentSq([0,0,0],[0,2,0],[1,1,-1],[1,1,1])-1)<1e-9);
const fixture=JSON.parse(fs.readFileSync('tests/fixtures/tomb-world.json','utf8'));world=Collision.createWorld(fixture);
assert(world.clear(3,-5.5,.6),'Actual antechamber start is clear');assert(world.clear(-1.95,-4.2,0),'Actual burial viewpoint is clear');
assert(!world.clear(-5.3,-4.2,0),'Actual north wall has a body clearance margin');
console.log('PASS: body radius, swept wall/corner collisions, wall sliding, door clearance, crouch/standing/jump headroom, floor contact, and actual tomb geometry.');

assert(!world.clear(-4.55,-6.49,0,1.75),'The actual Treasury doorway blocks a standing body');assert(world.clear(-4.55,-6.49,0,1),'The actual Treasury doorway admits a crouched body');assert(!world.clear(5.8,-2.25,.6,1.75),'The actual Annexe doorway is too low to stand');assert(world.clear(5.8,-2.25,.6,1),'The actual Annexe doorway admits crouching');
