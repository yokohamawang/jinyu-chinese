/* Hanzi chapter progress: server-authoritative, no browser storage. */
(()=>{
  'use strict';
  const COURSE='hanzi-pre4-course';
  let completed=new Set(),identity='',loading=null;
  const changed=()=>window.dispatchEvent(new Event('kp-hanzi-progress-changed'));
  async function auth(){
    const client=await window.KP_ACCOUNT_API?.getClient?.();
    if(!client)return null;
    const {data,error}=await client.auth.getUser();
    if(error||!data?.user)return null;
    return {client,user:data.user};
  }
  async function refresh(){
    if(loading)return loading;
    loading=(async()=>{
      try{
        const account=await auth();
        if(!account){identity='';completed=window.KP_HANZI_GUEST?.completed()||new Set();changed();return true;}
        const {data,error}=await account.client.from('course_progress')
          .select('unit_id,status').eq('user_id',account.user.id).eq('course_id',COURSE);
        if(error)throw error;
        if(identity!==account.user.id)window.KP_HANZI_GUEST?.clear();
        identity=account.user.id;
        completed=new Set((data||[]).filter(row=>row.status==='completed').map(row=>row.unit_id));
        /* One-time migration only. Old devices stored chapter clears locally;
           save those on the signed-in account before removing the legacy key. */
        let legacy=[];
        try{const raw=JSON.parse(localStorage.getItem('koepanda.hanzi.unit-progress.v1')||'[]');if(Array.isArray(raw))legacy=raw.filter(id=>typeof id==='string'&&/^pre4-u\d{2,3}$/.test(id));}catch(_){}
        const missing=[...new Set(legacy)].filter(id=>!completed.has(id));
        if(missing.length){
          const now=new Date().toISOString();
          const payload=missing.map(unitId=>({user_id:identity,course_id:COURSE,unit_id:unitId,status:'completed',completed_at:now,last_visited_at:now,review_checks:{},updated_at:now}));
          const migration=await account.client.from('course_progress').upsert(payload,{onConflict:'user_id,course_id,unit_id'});
          if(migration.error)throw migration.error;
          missing.forEach(id=>completed.add(id));
        }
        if(legacy.length){try{localStorage.removeItem('koepanda.hanzi.unit-progress.v1')}catch(_){}}
        changed();return true;
      }catch(error){console.warn('[Koepanda] Hanzi progress fetch failed:',error);return false;}
    })();
    try{return await loading;}finally{loading=null;}
  }
  async function markComplete(unitId){
    if(completed.has(unitId))return false;
    const account=await auth();if(!account){const fresh=window.KP_HANZI_GUEST?.complete(unitId)||false;completed=window.KP_HANZI_GUEST?.completed()||new Set();changed();return fresh;}
    const {data:previous,error:readError}=await account.client.from('course_progress')
      .select('status,review_checks').eq('user_id',account.user.id)
      .eq('course_id',COURSE).eq('unit_id',unitId).maybeSingle();
    if(readError)throw readError;
    if(previous?.status==='completed'){
      completed.add(unitId);changed();return false;
    }
    const now=new Date().toISOString();
    const {error}=await account.client.from('course_progress').upsert({
      user_id:account.user.id,course_id:COURSE,unit_id:unitId,status:'completed',
      completed_at:now,last_visited_at:now,review_checks:previous?.review_checks||{},updated_at:now
    },{onConflict:'user_id,course_id,unit_id'});
    if(error)throw error;
    identity=account.user.id;completed.add(unitId);changed();return true;
  }
  window.KP_HANZI_PROGRESS={completed:()=>new Set(completed),refresh,markComplete};
  window.addEventListener('kp-account-state-changed',refresh);
  window.addEventListener('focus',refresh);
  document.addEventListener('DOMContentLoaded',refresh,{once:true});
})();
