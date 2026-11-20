/* 301.354: theme-tree lesson organization; existing study modes remain unchanged. */
(()=>{
 'use strict';
 const COURSE='hanzi-pre4-course';
 async function getStatus(unitId){
   try{const client=await window.KP_ACCOUNT_API?.getClient?.();const {data:auth}=await client?.auth.getUser();if(!auth?.user)return {};
     const {data}=await client.from('course_progress').select('review_checks').eq('user_id',auth.user.id).eq('course_id',COURSE).eq('unit_id',unitId).maybeSingle();
     return data?.review_checks||{};
   }catch(error){console.warn('[Koepanda] lesson status unavailable',error);return {}}
 }
 function split(chars,unitId="pre4-u01"){
   const groups=[];
   for(let i=0;i<chars.length;i+=3){const next=chars.slice(i,i+3);const review=next.length<3?chars.slice(Math.max(0,i-(3-next.length)),i):[];
     groups.push({lessonId:unitId+'-l'+String(groups.length+1).padStart(2,'0'),chars:[...review,...next],newChars:next,reviewChars:review});}
   return groups;
 }
 function renderBranches(theme, onSelect){
   const branch=document.createElement('div');branch.className='kp354-theme-branches';
   branch.setAttribute('aria-label',theme.title+' のレッスン');
   const groups=split(theme.characters,theme.unitId);
   const slots=document.createElement('div');slots.className='kp354-branch-list';branch.append(slots);
   const addItems=checks=>{

     slots.replaceChildren();
     groups.forEach((g,i)=>{
       const done=!!checks['unitTest:'+g.lessonId]?.passed_at;
       const item=document.createElement('button');item.type='button';item.className='kp354-branch-item';
       item.innerHTML='<span class="kp354-branch-marker" aria-hidden="true"></span>';
       const content=document.createElement('span');content.className='kp354-branch-copy';
       const title=document.createElement('strong');title.textContent='第'+(i+1)+'課 · '+g.chars.join('・');
       const hint=document.createElement('small');hint.textContent=done?'✓ クリア · もう一度練習':g.reviewChars.length?'新しい字 '+g.newChars.join('・')+' ＋ 復習':'3文字 · ミニテストつき';
       content.append(title,hint);item.append(content);
       item.onclick=()=>onSelect({...theme,...g,lessonTitle:'第'+(i+1)+'課',lessonIndex:i,lessonCount:groups.length});
       slots.append(item);
       const mistakes=(checks['mistakes:'+g.lessonId]||[]).filter(m=>!m.reviewed_at);
       if(mistakes.length){
         const review=document.createElement('button');review.type='button';review.className='kp354-branch-review';
         review.textContent='↳ まちがい復習 · '+mistakes.length+'件';
         review.onclick=()=>{onSelect({...theme,...g,lessonTitle:'第'+(i+1)+'課',lessonIndex:i,lessonCount:groups.length});requestAnimationFrame(()=>window.KP_HANZI_UNIT_TEST?.open?.(g.chars,{lessonId:g.lessonId,lessonTitle:'まちがい復習',reviewOnly:true,reviewRows:mistakes}))};
         slots.append(review);
       }
     });
     const finished=groups.every(g=>checks['unitTest:'+g.lessonId]?.passed_at);
     const summary=document.createElement('button');summary.type='button';summary.className='kp354-branch-item kp354-summary';
     summary.innerHTML='<span class="kp354-branch-marker" aria-hidden="true">★</span><span class="kp354-branch-copy"><strong>テーマ総合テスト</strong><small></small></span>';
     summary.querySelector('small').textContent=finished?'テーマの漢字を10問で確認':groups.length+'課クリアで解放';
     summary.disabled=!finished;summary.setAttribute('aria-disabled',String(!finished));
     summary.onclick=()=>onSelect({...theme,lessonId:theme.unitId,lessonTitle:'まとめテスト',chars:theme.characters,themeTest:true});
     slots.append(summary);
   };
   addItems({});
   getStatus(theme.unitId).then(addItems).catch(e=>console.warn('[Koepanda] lesson tree progress',e));
   return branch;
 }
 window.KP_HANZI_LESSON_PLAN={renderBranches,split};
})();
