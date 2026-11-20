/* 301.353: first-theme lesson organization only. Existing character modes are untouched. */
(()=>{
 'use strict';
 const box=document.createElement('section');box.id='kp353Lessons';box.className='kp353-lessons';box.hidden=true;
 box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','今日の漢字レッスン');
 box.innerHTML='<div class="kp353-lessons-card"><header><div><small>漢字の学習</small><h2>今日はどのレッスン？</h2></div><button type="button" id="kp353LessonsClose" aria-label="閉じる">×</button></header><p class="kp353-lessons-hint">1レッスン3文字。認読・筆順・なぞり書きのあとにミニテスト。</p><div id="kp353LessonsItems"></div></div>';
 document.body.append(box);
 const list=box.querySelector('#kp353LessonsItems');box.querySelector('#kp353LessonsClose').onclick=()=>{box.hidden=true};
 const COURSE='hanzi-pre4-course';
 async function getStatus(unitId){
   try{const client=await window.KP_ACCOUNT_API?.getClient?.();const {data:auth}=await client?.auth.getUser();if(!auth?.user)return {};
     const {data}=await client.from('course_progress').select('review_checks').eq('user_id',auth.user.id).eq('course_id',COURSE).eq('unit_id',unitId).maybeSingle();
     return data?.review_checks||{};
   }catch(error){console.warn('[Koepanda] lesson status unavailable',error);return {}}
 }
 function split(chars){
   const groups=[];
   for(let i=0;i<chars.length;i+=3){const next=chars.slice(i,i+3);const review=next.length<3?chars.slice(Math.max(0,i-(3-next.length)),i):[];
     groups.push({lessonId:'pre4-u01-l'+String(groups.length+1).padStart(2,'0'),chars:[...review,...next],newChars:next,reviewChars:review});}
   return groups;
 }
 async function open(theme, onSelect){
   const groups=split(theme.characters);
   box.hidden=false;list.replaceChildren();
   const loading=document.createElement('p');loading.className='kp353-lessons-hint';loading.textContent='レッスンを読み込んでいます…';list.append(loading);
   const checks=await getStatus(theme.unitId);if(box.hidden)return;list.replaceChildren();
   groups.forEach((g,i)=>{
     const done=!!checks['unitTest:'+g.lessonId]?.passed_at;
     const btn=document.createElement('button');btn.type='button';btn.className='kp353-lesson-item';
     const title=document.createElement('strong');title.textContent='第'+(i+1)+'課'+(done?'　✓ クリア':'');
     const chars=document.createElement('span');chars.textContent=g.chars.join('　');
     const meta=document.createElement('small');meta.textContent=g.reviewChars.length?'復習 '+g.reviewChars.join('・')+' ＋ 新しい漢字 '+g.newChars.join('・'):'3文字のミニレッスン';
     btn.append(title,chars,meta);
     btn.onclick=()=>{box.hidden=true;onSelect({...theme,...g,lessonTitle:'第'+(i+1)+'課',lessonIndex:i,lessonCount:groups.length})};list.append(btn);
     const mistakes=(checks['mistakes:'+g.lessonId]||[]).filter(m=>!m.reviewed_at);
     if(mistakes.length){
       const review=document.createElement('button');review.type='button';review.className='kp353-review-link';
       review.textContent='まちがい復習 · '+mistakes.length+'件';
       review.onclick=()=>{
         box.hidden=true;onSelect({...theme,...g,lessonTitle:'第'+(i+1)+'課',lessonIndex:i,lessonCount:groups.length});
         requestAnimationFrame(()=>window.KP_HANZI_UNIT_TEST?.open?.(g.chars,{lessonId:g.lessonId,lessonTitle:'まちがい復習',reviewOnly:true,reviewRows:mistakes}));
       };
       list.append(review);
     }
   });
   if(groups.every(g=>checks['unitTest:'+g.lessonId]?.passed_at)){
     const summary=document.createElement('button');summary.type='button';summary.className='kp353-lesson-item kp353-theme-test';
     summary.innerHTML='<strong>✦ テーマのまとめテスト</strong><span>今までの漢字を復習</span><small>すべての小レッスンを終えたら挑戦しよう</small>';
     summary.onclick=()=>{box.hidden=true;onSelect({...theme,lessonId:theme.unitId,lessonTitle:'まとめテスト',chars:theme.characters,themeTest:true})};
     list.append(summary);
   }
   const footer=document.createElement('p');footer.className='kp353-lessons-foot';footer.textContent='学んだレッスンはいつでも復習できます。';list.append(footer);
 }
 window.KP_HANZI_LESSON_PLAN={open,split};
})();
