(function(){
  'use strict';
  const LEGACY='koepanda.continuous-goal.v2',OWNER=LEGACY+'.owner';
  let userId=null,ready=false,sequence=Promise.resolve(),status='loading',revision=0;
  const readKey=key=>{try{return JSON.parse(localStorage.getItem(key)||'{}')}catch(_){return{}}};
  const key=()=>LEGACY+'.'+(userId||'guest');
  const valid=g=>Number.isInteger(g.base)&&g.base>=0&&Number.isInteger(g.target)&&g.target>0&&g.target>=g.base&&/^\d{4}-\d{2}-\d{2}$/.test(g.end||'');
  function notify(s){status=s;window.dispatchEvent(new CustomEvent('kp-goal-sync-changed'))}
  async function sync(){
    const api=window.KP_ACCOUNT_API;if(!api){notify('error');return}
    const session=await api.getSession(),next=session?.user?.id||null;
    if(!ready||next!==userId){
      userId=next;ready=true;revision++;
      // Claim pre-sync goals once, so a different account cannot inherit them.
      const owner=localStorage.getItem(OWNER),legacy=readKey(LEGACY),guest=readKey(LEGACY+'.guest');
      if(userId&&!localStorage.getItem(key())&&valid(guest)&&(!owner||owner==='guest')){
        localStorage.setItem(key(),JSON.stringify({...guest,pending:true}));
        localStorage.setItem(OWNER,userId);
      }
      if(!localStorage.getItem(key())&&valid(legacy)&&(!owner||owner===(userId||'guest'))){
        localStorage.setItem(key(),JSON.stringify({...legacy,pending:true}));
        localStorage.setItem(OWNER,userId||'guest');
      }
    }
    if(!userId){notify('local');return}
    const id=userId,rev=revision,c=await api.getClient();
    let local=readKey(key());
    notify('saving');
    if(valid(local)&&local.pending){
      const result=await c.from('kp_learning_goals').upsert({user_id:id,base:local.base,target:local.target,end_date:local.end,updated_at:new Date().toISOString()},{onConflict:'user_id'}).select('base,target,end_date').single();
      if(result.error)throw result.error;
      if(userId!==id||revision!==rev)return;
      localStorage.setItem(key(),JSON.stringify({...local,pending:false}));
    }else{
      const result=await c.from('kp_learning_goals').select('base,target,end_date').eq('user_id',id).maybeSingle();
      if(result.error)throw result.error;
      if(userId!==id||revision!==rev)return;
      if(result.data){const g=result.data;localStorage.setItem(key(),JSON.stringify({base:g.base,target:g.target,end:g.end_date,pending:false}))}
    }
    notify('saved');
  }
  function queue(){sequence=sequence.then(sync).catch(e=>{console.warn('[Koepanda] goal sync failed',e);notify('error')});return sequence}
  window.KP_GOAL_STORE={
    read(){return ready?readKey(key()):readKey(LEGACY)},
    write(g){
      if(!valid(g))throw Error('Invalid learning goal');
      revision++;
      const value={...g,pending:true};
      if(ready)localStorage.setItem(key(),JSON.stringify(value));
      else localStorage.setItem(LEGACY,JSON.stringify(value));
      notify(userId?'saving':'local');queue();
    },
    message(){return {loading:'目標を確認中…',saving:'目標を同期中…',saved:'アカウントに保存済み',local:'この端末に保存済み・ログインすると同期します',error:'同期できませんでした。目標は端末に保存済みです。接続後に再試行します。'}[status]},
    sync:queue
  };
  window.addEventListener('kp-auth-state-changed',()=>setTimeout(queue,0));
  window.addEventListener('online',queue);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)queue()});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',queue,{once:true});else queue();
})();
