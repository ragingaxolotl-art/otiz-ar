/* Generated ElevenLabs Foley, activated only after a user gesture. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TombAudio=api;})(typeof window==='object'?window:globalThis,function(){
 function stride(state,distance,grounded,crouched=false){
  if(!grounded||!Number.isFinite(distance)||distance>.5)return{distance:0,step:false};
  const total=state.distance+distance,span=crouched?.45:.62;return{distance:total>=span?total%span:total,step:distance>.001&&total>=span};
 }
 function create({button,AudioContextClass=window.AudioContext||window.webkitAudioContext}){
  let enabled=true;try{enabled=localStorage.getItem('tomb-sound')!=='off';}catch{}
  let ctx=null,master=null,loading=null,walk={distance:0},previous=null;const buffers=new Map(),playing=new Set();
  const files={scrape:'coffin-scrape.mp3',drop0:'coffin-drop-0.wav',drop1:'coffin-drop-1.wav',step0:'footstep-0.wav',step1:'footstep-1.wav',step2:'footstep-2.wav'};
  function ui(){button.textContent=enabled?'Sound on':'Sound off';button.setAttribute('aria-pressed',String(enabled));}
  function unlock(){if(!enabled||!AudioContextClass)return;if(!ctx){ctx=new AudioContextClass();master=ctx.createGain();master.gain.value=.6;master.connect(ctx.destination);loading=Promise.all(Object.entries(files).map(async([key,file])=>{try{const r=await fetch('assets/egypt/audio/'+file);if(!r.ok)throw Error(file);buffers.set(key,await ctx.decodeAudioData(await r.arrayBuffer()));}catch(e){console.warn('Sound unavailable:',file);}}));}if(ctx.state==='suspended')ctx.resume().catch(()=>{});}
  function stop(){for(const source of playing){try{source.stop();}catch{}}playing.clear();}
  button.onclick=()=>{enabled=!enabled;try{localStorage.setItem('tomb-sound',enabled?'on':'off');}catch{}if(!enabled)stop();else unlock();ui();};
  document.addEventListener('pointerdown',unlock,{passive:true});document.addEventListener('keydown',unlock);document.addEventListener('visibilitychange',()=>{previous=null;walk={distance:0};if(document.hidden){stop();ctx?.suspend();}});
  function play(key,stage=0){if(!enabled||!ctx||ctx.state!=='running'||document.hidden)return;const sample=key==='step'?'step'+Math.floor(Math.random()*3):key==='drop'?'drop'+(stage%2):key;if(!buffers.has(sample))return;const source=ctx.createBufferSource(),gain=ctx.createGain();source.buffer=buffers.get(sample);source.playbackRate.value=key==='step'?.95+Math.random()*.1:1+stage*.09;const level=key==='step'?.25:key==='scrape'?.38:.48;gain.gain.value=level;source.connect(gain);gain.connect(master);playing.add(source);source.onended=()=>{playing.delete(source);source.disconnect();gain.disconnect();};const duration=Math.min(source.buffer.duration,key==='scrape'?1.3:key==='step'?.55:1.1),end=ctx.currentTime+duration/source.playbackRate.value;gain.gain.setValueAtTime(level,Math.max(ctx.currentTime,end-.06));gain.gain.linearRampToValueAtTime(0,end);source.start(0,0,duration);}
  function update({x,z,grounded,crouched,active}){if(!active||!enabled){previous=null;walk={distance:0};return;}if(previous){walk=stride(walk,Math.hypot(x-previous.x,z-previous.z),grounded,crouched);if(walk.step)play('step');}previous={x,z};}
  ui();return{play,update,stop};
 }
 return{stride,create};
});
