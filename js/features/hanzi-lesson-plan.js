/* 301.356: lesson/test pairs in theme tree; existing study modes remain unchanged. */
(()=>{
 'use strict';
 const COURSE='hanzi-pre4-course';
 async function getStatus(unitId){
   try{const client=await window.KP_ACCOUNT_API?.getClient?.();const auth=client?(await client.auth.getUser()).data:null;if(!auth?.user)return window.KP_HANZI_GUEST?.checks(unitId)||{};
     const {data}=await client.from('course_progress').select('review_checks').eq('user_id',auth.user.id).eq('course_id',COURSE).eq('unit_id',unitId).maybeSingle();
     return data?.review_checks||{};
   }catch(error){
     console.warn('[Koepanda] lesson status unavailable',error);
     // An unavailable auth client must not erase the visitor's verified work.
     return window.KP_HANZI_GUEST?.checks(unitId)||{};
   }
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
   let revision=0;
   const addItems=checks=>{

     slots.replaceChildren();
     groups.forEach((g,i)=>{
       const done=!!checks['unitTest:'+g.lessonId]?.passed_at;
       const previousPassed=i===0||groups.slice(0,i).every(prev=>!!checks['unitTest:'+prev.lessonId]?.passed_at);
       const lessonUnlocked=theme.testUnlocked||previousPassed||done;
       const started=!done&&g.chars.some(ch=>Array.isArray(checks['char:'+ch])&&checks['char:'+ch].length>0);
       const ready=g.chars.every(ch=>{const stages=checks['char:'+ch]||[],verified=checks['charVerified:'+ch]||[];return stages.includes(1)&&verified.includes(2)&&verified.includes(3);});

       const item=document.createElement('button');item.type='button';item.className='kp354-branch-item';
       item.classList.toggle('is-complete',done);
       item.classList.toggle('is-locked',!lessonUnlocked);
       item.disabled=!lessonUnlocked;
       item.setAttribute('aria-disabled',String(!lessonUnlocked));
       item.classList.toggle('is-in-progress',started);
       item.innerHTML='<span class="kp354-branch-marker" aria-hidden="true">'+(done?'✓':started?'◐':'')+'</span>';
       item.setAttribute('aria-label','第'+(i+1)+'課 '+(!lessonUnlocked?'前の課に合格すると解放':done?'クリア済み':started?'学習中':'未開始'));

       const content=document.createElement('span');content.className='kp354-branch-copy';
       const title=document.createElement('strong');title.textContent='第'+(i+1)+'課 · '+g.chars.join('・');
       const hint=document.createElement('small');
       hint.textContent=!lessonUnlocked?'🔒 前の課のテスト合格で解放':done?'✓ クリア':started?'学習中':g.reviewChars.length?'復習をふくむ':'';
       hint.hidden=!hint.textContent;
       content.append(title,hint);item.append(content);
       item.onclick=()=>onSelect({...theme,...g,lessonTitle:'第'+(i+1)+'課',lessonIndex:i,lessonCount:groups.length});
       slots.append(item);
       // The quiz is a visible, separate tree branch, not an invisible final step.
       const test=document.createElement('button');test.type='button';
       test.className='kp354-branch-item kp356-lesson-test';
       test.classList.toggle('is-complete',done);
       test.classList.toggle('is-ready',ready&&!done);
       const unlocked=theme.testUnlocked||(ready&&previousPassed)||done;
       test.disabled=!unlocked;
       test.setAttribute('aria-disabled',String(!unlocked));
       test.setAttribute('aria-label','第'+(i+1)+'課 テスト・'+(done?'合格済み':unlocked?'受験可能':'学習後に解放'));
       const marker=document.createElement('span');marker.className='kp354-branch-marker';marker.setAttribute('aria-hidden','true');marker.textContent=done?'✓':unlocked?'✎':'🔒';
       const testCopy=document.createElement('span');testCopy.className='kp354-branch-copy';
       const testTitle=document.createElement('strong');testTitle.textContent='第'+(i+1)+'課 テスト';
       const testHint=document.createElement('small');testHint.textContent=done?'合格済み・復習できます':unlocked?'6問 · テストを始める':'3文字の学習後に解放';
       testCopy.append(testTitle,testHint);test.append(marker,testCopy);
       test.onclick=()=>onSelect({...theme,...g,lessonTitle:'第'+(i+1)+'課',lessonIndex:i,lessonCount:groups.length,launchTest:true});
       slots.append(test);
       const records=checks['mistakes:'+g.lessonId]||[];
       const mistakes=records.filter(m=>!m.reviewed_at);
       const canRecover=ready&&previousPassed&&!done&&records.length>0&&!mistakes.length&&
         (checks['testHistory:'+g.lessonId]||[]).some(a=>a.total===6&&a.review!==true);
       if((mistakes.length||canRecover)&&!theme.testUnlocked){
         const review=document.createElement('button');review.type='button';review.className='kp354-branch-review';
         review.textContent=canRecover?'✓ 訂正済み・合格を記録':'↳ まちがい復習 · '+mistakes.length+'件';
         review.onclick=()=>onSelect({...theme,...g,lessonTitle:'第'+(i+1)+'課',lessonIndex:i,lessonCount:groups.length,launchTest:true,reviewRows:mistakes,resumeCorrected:canRecover});
         slots.append(review);
       }
     });
     const finished=theme.testUnlocked||groups.every(g=>checks['unitTest:'+g.lessonId]?.passed_at);
     const summary=document.createElement('button');summary.type='button';summary.className='kp354-branch-item kp354-summary';
     summary.innerHTML='<span class="kp354-branch-marker" aria-hidden="true">★</span><span class="kp354-branch-copy"><strong>テーマ総合テスト</strong><small></small></span>';
     summary.querySelector('small').textContent=finished?'10問 · まとめテスト':'全'+groups.length+'課のテスト合格で解放';
     summary.disabled=!finished;summary.setAttribute('aria-disabled',String(!finished));
     summary.onclick=()=>onSelect({...theme,lessonId:theme.unitId,lessonTitle:'まとめテスト',chars:theme.characters,themeTest:true,launchTest:true});
     slots.append(summary);
   };
   addItems({});
   const refresh=async()=>{const request=++revision;const checks=await getStatus(theme.unitId);if(request===revision&&branch.isConnected)addItems(checks)};
   // A guest completing a stage can unlock the test without a route reload.
   const onGuestChange=()=>{
     if(!branch.isConnected){window.removeEventListener?.('kp-hanzi-guest-changed',onGuestChange);return;}
     refresh().catch(error=>console.warn('[Koepanda] guest lesson refresh',error));
   };
   window.addEventListener?.('kp-hanzi-guest-changed',onGuestChange);
   branch.kpRefresh=refresh;
   // renderBranches runs before insertion. Defer the first fetch until the tree exists.
   Promise.resolve().then(()=>refresh().catch(e=>console.warn('[Koepanda] lesson tree progress',e)));
   return branch;
 }
 window.KP_HANZI_LESSON_PLAN={renderBranches,split};
})();
