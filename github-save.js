/* Teacher-only connection. Credentials never enter saved settings, links or GitHub files. */
(function(){
  const base='https://api.github.com/repos/ragingaxolotl-art/otiz-ar',key='otzi-github-session-v1';let token='';
  try{token=sessionStorage.getItem(key)||'';}catch{}
  function disconnect(){token='';try{sessionStorage.removeItem(key);}catch{}}
  async function request(url,options={}){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),25000);
    try{return await fetch(url,{...options,redirect:'error',cache:'no-store',signal:controller.signal,headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2026-03-10',Authorization:'Bearer '+token,...options.headers}});}
    catch{throw new Error('GitHub could not be reached. Your draft is kept; check the connection and retry.');}finally{clearTimeout(timer);}
  }
  function failure(status){if(status===401){disconnect();return new Error('The GitHub connection expired. Connect again with a valid key.');}if(status===403||status===404)return new Error('GitHub denied this save. Select only otiz-ar and grant Contents: Read and write when creating the connection key.');return new Error('GitHub could not save this change (status '+status+'). Your draft is kept.');}
  async function connect(value){
    disconnect();if(!/^github_pat_[A-Za-z0-9_]+$/.test(value.trim()))throw new Error('Use a fine-grained GitHub access token. Enter it here, not in the chat.');token=value.trim();
    try{const response=await request(base);if(!response.ok)throw failure(response.status);const data=await response.json();if(data.full_name!=='ragingaxolotl-art/otiz-ar')throw new Error('This connection does not match the classroom repository.');try{sessionStorage.setItem(key,token);}catch{}return true;}catch(error){disconnect();throw error;}
  }
  async function save(config){
    if(!token)throw new Error('Connect GitHub before saving. Your draft is still on this device.');
    const url=new URL(Classroom.saveURL(config)),path=url.searchParams.get('filename');if(!/^_teacher_saves\/save-\d+-[A-Za-z0-9-]+\.md$/.test(path))throw new Error('Invalid save path');
    const document=Classroom.saveDocument(config),endpoint=base+'/contents/'+path,response=await request(endpoint,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Save classroom artifact views',content:btoa(document),branch:'main'})});
    if(response.ok){const data=await response.json();return {sha:data.commit?.sha||'',path};}
    // An interrupted response may have committed successfully. Retrying the same immutable save is safe.
    if(response.status===409||response.status===422){const existing=await request(endpoint+'?ref=main');if(existing.ok){const data=await existing.json();if(data.encoding==='base64'&&atob(data.content.replace(/\s/g,''))===document)return {sha:'',path};}}
    throw failure(response.status);
  }
  window.GithubTeacherSave={connect,disconnect,save,get connected(){return !!token;}};
})();
