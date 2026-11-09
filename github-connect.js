/* Keys stay in the private connection service, never in this classroom page. */
(function(){
 const origin='https://otzi-teacher-github-connect.ragingaxolotl.chatgpt.site';
 const channel=crypto.randomUUID();let popup=null,connected=false;const requests=new Map();
 function change(value){connected=value;dispatchEvent(new Event('github-connection-change'));}
 function send(type,extra={}){if(!popup||popup.closed)throw new Error('Open Connect GitHub first. Keep the connection window open while saving.');popup.postMessage({source:'field-lab-teacher',channel,type,...extra},origin);}
 function connect(){popup=window.open(origin+'/?channel='+encodeURIComponent(channel),'field-lab-github','popup,width=760,height=820');if(!popup)throw new Error('Allow the GitHub connection window, then press Connect GitHub again.');popup.focus();return true;}
 function disconnect(){try{send('disconnect');}catch{}change(false);}
 addEventListener('message',event=>{const data=event.data;if(event.origin!==origin||event.source!==popup||data?.source!=='field-lab-github'||data.channel!==channel)return;
  if(data.type==='connected'){change(true);return;}if(data.type==='disconnected'){change(false);return;}
  if(!['saved','save-error'].includes(data.type))return;const request=requests.get(data.requestId);if(!request)return;clearTimeout(request.timer);requests.delete(data.requestId);if(data.type==='saved')request.resolve(data.result);else request.reject(new Error(data.message||'GitHub did not confirm this save. Your draft is kept.'));
 });
 function save(config){if(!connected)return Promise.reject(new Error('Connect GitHub first, then press Save to cards again.'));const checked=Classroom.validate(config),requestId=crypto.randomUUID();return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{requests.delete(requestId);reject(new Error('Save confirmation was interrupted. Check save status before retrying. Your draft is kept.'));},40000);requests.set(requestId,{resolve,reject,timer});try{send('save',{requestId,config:checked});}catch(error){clearTimeout(timer);requests.delete(requestId);change(false);reject(error);}});}
 setInterval(()=>{if(connected&&(!popup||popup.closed))change(false);},3000);
 // Remove credentials retained by the retired personal-key flow.
 try{sessionStorage.removeItem('otzi-github-session-v1');}catch{}
 window.GithubTeacherSave={connect,disconnect,save,get connected(){return connected&&!!popup&&!popup.closed;}};
})();
