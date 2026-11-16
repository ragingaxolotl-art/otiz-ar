(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TombCore=api;})(typeof window==='object'?window:globalThis,function(){
  function deadzone(value,zone=.18){if(!Number.isFinite(value)||Math.abs(value)<=zone)return 0;return Math.sign(value)*(Math.abs(value)-zone)/(1-zone);}
  function input(pad,pickButton=1){const axis=(i)=>deadzone(pad?.axes?.[i]||0);const down=(i)=>!!pad?.buttons?.[i]?.pressed;return{side:axis(0)+(down(15)?1:0)-(down(14)?1:0),forward:(-axis(1)||0)+(down(12)?1:0)-(down(13)?1:0),turn:axis(2),look:axis(3),pick:down(pickButton),putBack:down(pickButton===0?1:0),home:down(9),spinLeft:down(2),spinRight:down(3),jump:down(3),previous:down(4),next:down(5),precision:down(6),inspect:down(7),help:down(8),recenter:down(10),resetObject:down(11)};}
  function movement(side,forward,yaw,speed,dt){const length=Math.hypot(side,forward);if(length>1){side/=length;forward/=length;}const step=speed*Math.min(Math.max(dt,0),.05);return{x:(side*Math.cos(yaw)-forward*Math.sin(yaw))*step,z:(-side*Math.sin(yaw)-forward*Math.cos(yaw))*step};}
  function rising(now,before){return !!now&&!before;}
  function forwardSprint(state,forward,time,cancel=false){
    if(cancel)return{down:false,lastTap:-Infinity,boost:false,multiplier:1};
    let down=!!state?.down,lastTap=state?.lastTap??-Infinity,boost=!!state?.boost;
    if(forward<=.2){down=false;boost=false;}
    else if(forward>=.55&&!down){down=true;boost=time-lastTap>=0&&time-lastTap<=300;lastTap=boost?-Infinity:time;}
    return{down,lastTap,boost,multiplier:boost?2:1};
  }
  // Space distinguishes a crouch hold from a jump tap; release never jumps after a hold.
  function spaceGesture(state,event,time,crouched,holdMs=280){
    if(event==='cancel')return{state:null,action:null};
    if(event==='down')return{state:state?.down?state:{down:true,since:time,held:false,wasCrouched:!!crouched},action:null};
    if(!state?.down)return{state:null,action:null};
    const held=state.held||time-state.since>=holdMs;
    if(event==='tick')return{state:{...state,held},action:held&&!state.held?'crouch':null};
    if(event==='up')return{state:null,action:held?'crouch':state.wasCrouched||crouched?'stand':'jump'};
    return{state,action:null};
  }
  function inspectionDistance(distance,delta){return Math.max(.65,Math.min(1.8,distance+Math.max(-.12,Math.min(.12,delta*.0015))));}
  function walkableStep(current,next,maxStep=.42){return Number.isFinite(next)&&Math.abs(next-current)<=maxStep;}
  function jumpStep(state,dt,ceiling=Infinity){const step=Math.min(Math.max(dt,0),.05);let velocity=state.velocity-8*step,height=state.height+state.velocity*step-4*step*step;if(height>ceiling){height=Math.max(0,ceiling);velocity=Math.min(0,velocity)}if(height<=0)return{height:0,velocity:0};return{height,velocity};}
  function verticalStep(state,dt,support=-Infinity){
    const step=Math.min(Math.max(dt,0),.05),feet=state.feet;
    if(state.grounded&&Number.isFinite(support)&&Math.abs(feet-support)<.07)return{feet:support,velocity:0,grounded:true,origin:support,height:0};
    const velocity=state.velocity-8*step,next=feet+state.velocity*step-4*step*step,origin=state.origin??feet;
    if(velocity<=0&&Number.isFinite(support)&&feet>=support-.07&&next<=support)return{feet:support,velocity:0,grounded:true,origin:support,height:0};
    return{feet:next,velocity,grounded:false,origin,height:Math.max(0,next-origin)};
  }
  return{deadzone,input,movement,rising,forwardSprint,spaceGesture,inspectionDistance,walkableStep,jumpStep,verticalStep};
});
