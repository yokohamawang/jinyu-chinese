/* Chapter-level continuity in Supabase. No local chapter or review persistence. */
(function(){
  'use strict';
  const COURSE='pinyin-main-course';
  const VALID=new Set(['P0-U1',...Array.from({length:21},(_,i)=>'P'+(i+1))]);
  const MS_DAY=86400000;
  let snapshot={lastUnit:null,units:{}};
  let rows=new Map(),userId=null,client=null,loading=null,queue=Promise.resolve();
  const emit=()=>window.dispatchEvent(new Event('kp-pinyin-chapter-state-changed'));
  const day=stamp=>{const d=new Date(stamp);return Number.isFinite(d.getTime())?new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime():NaN};
  const today=()=>new Date().toISOString().slice(0,10);
  function rebuild(){
    const units={};let latest=null;
    for(const [id,row] of rows){
      units[id]={complete:row.status==='completed',completedAt:row.completed_at?.slice(0,10)||null,reviewed:row.review_checks||{}};
      if(row.last_visited_at&&(!latest||row.last_visited_at>latest.last_visited_at))latest=row;
    }
    snapshot={lastUnit:latest?.unit_id||null,units};emit();
  }
  function read(){return snapshot;}
  async function connection(){
    const api=window.KPCloud||window.KP_ACCOUNT_API;
    const c=await (api?.client?.()||api?.getClient?.());
    if(!c)return null;
    const {data,error}=await c.auth.getUser();
    if(error||!data?.user)return null;
    return {c,id:data.user.id};
  }
  async function refresh(){
    if(loading)return loading;
    loading=(async()=>{
      try{
        const auth=await connection();
        if(!auth){client=null;userId=null;rows=new Map();rebuild();return snapshot;}
        const {data,error}=await auth.c.from('course_progress')
          .select('unit_id,status,completed_at,last_visited_at,review_checks,updated_at')
          .eq('user_id',auth.id).eq('course_id',COURSE);
        if(error)throw error;
        client=auth.c;userId=auth.id;
        rows=new Map((data||[]).filter(r=>VALID.has(r.unit_id)).map(r=>[r.unit_id,r]));
        rebuild();
      }catch(error){console.warn('章の学習記録を読み込めませんでした',error);}
      return snapshot;
    })();
    try{return await loading;}finally{loading=null;}
  }
  function save(id,change){
    if(!VALID.has(id))return Promise.resolve(false);
    const job=async()=>{
      if(!client||!userId)await refresh();
      if(!client||!userId)return false;
      const previous=rows.get(id)||{};
      const patch=typeof change==='function'?change(previous):change;
      if(!patch)return false;
      const payload={user_id:userId,course_id:COURSE,unit_id:id,
        status:previous.status||'started',completed_at:previous.completed_at||null,
        last_visited_at:previous.last_visited_at||null,review_checks:previous.review_checks||{},
        updated_at:new Date().toISOString(),...patch};
      const {data,error}=await client.from('course_progress').upsert(payload,{onConflict:'user_id,course_id,unit_id'})
        .select('unit_id,status,completed_at,last_visited_at,review_checks,updated_at').single();
      if(error)throw error;
      rows.set(id,data);rebuild();return true;
    };
    const result=queue.then(job);
    queue=result.catch(error=>{console.warn('章の学習記録を保存できませんでした',error);return false;});
    return result.catch(error=>{console.warn('章の学習記録を保存できませんでした',error);return false;});
  }
  function enter(id){return save(id,{last_visited_at:new Date().toISOString()});}
  function markComplete(id){return save(id,old=>({status:'completed',completed_at:old.completed_at||new Date().toISOString()}));}
  function reviewDue(){
    const now=day(new Date());
    return [...rows].filter(([id,r])=>{
      if(!VALID.has(id)||r.status!=='completed'||!r.completed_at)return false;
      const elapsed=Math.floor((now-day(r.completed_at))/MS_DAY);
      return [1,3,7].some(n=>elapsed>=n&&!r.review_checks?.[n]);
    }).map(([id])=>id);
  }
  function markReviewed(id){return save(id,old=>{
    if(old.status!=='completed'||!old.completed_at)return null;
    const elapsed=Math.floor((day(new Date())-day(old.completed_at))/MS_DAY);
    const n=[1,3,7].find(x=>elapsed>=x&&!old.review_checks?.[x]);
    return n?{review_checks:{...(old.review_checks||{}),[n]:today()}}:null;
  });}
  // One-way compatibility bridge: older lessons still signal pass using their
  // original keys. The new chapter record is persisted only in Supabase.
  function legacyCompleted(id){
    try{
      if(id==='P1'||id==='P2'){
        const mastery=JSON.parse(localStorage.getItem('koepandaVowelMastery69')||'{}');
        return (id==='P1'?['a','o','e']:['i','u','ü']).every(x=>mastery?.[x]?.passed===true);
      }
      const match=/^P(\d+)$/.exec(id);
      if(!match)return false;
      const n=Number(match[1]);
      const key=n<=8?'koepandaInitial':n<=13?'koepandaCompound':n<=15?'koepandaWhole':null;
      const suffix={P16:'koepandaCompoundP16Complete',P17:'koepandaThreeP17Complete',P19:'koepandaNeutralP19Complete',P21:'koepandaFinalP21Complete'};
      return localStorage.getItem(key?key+id+'Complete':suffix[id])==='1';
    }catch(_){return false;}
  }
  async function importLegacy(withDate){
    await refresh();
    if(!userId)return;
    for(const id of VALID){
      if(!legacyCompleted(id)||rows.get(id)?.status==='completed')continue;
      await save(id,old=>({status:'completed',completed_at:withDate?(old.completed_at||new Date().toISOString()):null}));
    }
  }
  window.KP_PINYIN_CHAPTER_STATE={read,refresh,enter,markComplete,reviewDue,markReviewed,isComplete:id=>!!snapshot.units[id]?.complete};
  ['koepandaVowelProgressChanged','koepandaInitialProgressChanged','koepandaCompoundProgressChanged'].forEach(name=>window.addEventListener(name,()=>importLegacy(true)));
  window.addEventListener('kp-auth-state-changed',()=>{client=null;userId=null;rows=new Map();rebuild();importLegacy(false);});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>importLegacy(false),{once:true});else importLegacy(false);
})();
