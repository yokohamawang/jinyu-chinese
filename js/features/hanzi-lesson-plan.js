/* Draw the small stations for a Hanzi theme. Progress uses the original lesson IDs. */
(()=>{
 'use strict';
 const routeChecks=new Map();
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
 function stationLabel(group){return (group.newChars || group.chars).join('・')+'の駅';}
 function renderBranches(theme, onSelect){
   const branch=document.createElement('div');branch.className='kp354-theme-branches';
   branch.setAttribute('aria-label',theme.title+' の小さな駅');
   const groups=split(theme.characters,theme.unitId);
   const slots=document.createElement('div');slots.className='kp354-branch-list';branch.append(slots);
   let revision=0;
   const addItems=checks=>{

     slots.replaceChildren();
     groups.forEach((g,i)=>{
       const station=stationLabel(g);
       const stop=document.createElement('div');stop.className='hanzi-small-stop';
       const done=!!checks['unitTest:'+g.lessonId]?.passed_at;
       const previousPassed=i===0||groups.slice(0,i).every(prev=>!!checks['unitTest:'+prev.lessonId]?.passed_at);
       const lessonUnlocked=!theme.previewOnly&&(theme.testUnlocked||previousPassed||done);
       const started=!done&&g.chars.some(ch=>Array.isArray(checks['char:'+ch])&&checks['char:'+ch].length>0);
       const ready=g.chars.every(ch=>{const stages=checks['char:'+ch]||[],verified=checks['charVerified:'+ch]||[];return stages.includes(1)&&verified.includes(2)&&verified.includes(3);});

       const item=document.createElement('button');item.type='button';item.className='kp354-branch-item';
       item.classList.toggle('is-complete',done);
       item.classList.toggle('is-locked',!lessonUnlocked);
       item.disabled=!lessonUnlocked;
       item.setAttribute('aria-disabled',String(!lessonUnlocked));
       item.classList.toggle('is-in-progress',started);
       item.innerHTML='<span class="kp354-branch-marker" aria-hidden="true">'+(!lessonUnlocked?'🔒':done?'✓':started?'▶':'🚩')+'</span>';
       item.setAttribute('aria-label',station+' '+(!lessonUnlocked?(theme.previewOnly?'前の大きな駅をクリアすると進めます':'ひとつ前の駅をクリアすると進めます'):done?'クリア済み':started?'学習中':'未開始'));

       const content=document.createElement('span');content.className='kp354-branch-copy';
       const title=document.createElement('strong');title.textContent=station;
       const hint=document.createElement('small');
       hint.textContent=started?'学習中':'';
       hint.hidden=!hint.textContent;
       content.append(title,hint);item.append(content);
       item.onclick=()=>onSelect({...theme,...g,lessonTitle:station,lessonIndex:i,lessonCount:groups.length});
       stop.append(item);
       if(theme.previewOnly){slots.append(stop);return;}
       // The challenge stays accessible at the same station.
       const test=document.createElement('button');test.type='button';
       test.className='kp354-branch-item kp356-lesson-test';
       test.classList.toggle('is-complete',done);
       test.classList.toggle('is-ready',ready&&!done);
       const unlocked=theme.testUnlocked||(ready&&previousPassed)||done;
       test.disabled=!unlocked;
       test.hidden=!unlocked;
       test.setAttribute('aria-disabled',String(!unlocked));
       test.setAttribute('aria-label',station+' チャレンジ・'+(done?'合格済み':unlocked?'受験可能':'学習後に解放'));
       const marker=document.createElement('span');marker.className='kp354-branch-marker';marker.setAttribute('aria-hidden','true');marker.textContent=done?'✓':unlocked?'✎':'🔒';
       const testCopy=document.createElement('span');testCopy.className='kp354-branch-copy';
       const testTitle=document.createElement('strong');testTitle.textContent='チャレンジ';
       const testHint=document.createElement('small');testHint.textContent=done?'合格済み・復習できます':unlocked?'6問':'';
       testCopy.append(testTitle,testHint);test.append(marker,testCopy);
       test.onclick=()=>onSelect({...theme,...g,lessonTitle:station,lessonIndex:i,lessonCount:groups.length,launchTest:true});
       stop.append(test);
       const records=checks['mistakes:'+g.lessonId]||[];
       const mistakes=records.filter(m=>!m.reviewed_at);
       const canRecover=ready&&previousPassed&&!done&&records.length>0&&!mistakes.length&&
         (checks['testHistory:'+g.lessonId]||[]).some(a=>a.total===6&&a.review!==true);
       if((mistakes.length||canRecover)&&!theme.testUnlocked){
         const review=document.createElement('button');review.type='button';review.className='kp354-branch-review';
         review.textContent=canRecover?'✓ 訂正済み・合格を記録':'↳ まちがい復習 · '+mistakes.length+'件';
         review.onclick=()=>onSelect({...theme,...g,lessonTitle:station,lessonIndex:i,lessonCount:groups.length,launchTest:true,reviewRows:mistakes,resumeCorrected:canRecover});
         stop.append(review);
       }
       slots.append(stop);
     });
     if(theme.previewOnly)return;
     const finished=theme.testUnlocked||groups.every(g=>checks['unitTest:'+g.lessonId]?.passed_at);
     const summary=document.createElement('button');summary.type='button';summary.className='kp354-branch-item kp354-summary';
     summary.innerHTML='<span class="kp354-branch-marker" aria-hidden="true">★</span><span class="kp354-branch-copy"><strong>まとめチャレンジ</strong><small></small></span>';
     summary.querySelector('small').textContent=finished?'10問 · まとめテスト':'';
     summary.disabled=!finished;summary.setAttribute('aria-disabled',String(!finished));
     summary.onclick=()=>onSelect({...theme,lessonId:theme.unitId,lessonTitle:'まとめテスト',chars:theme.characters,themeTest:true,launchTest:true});
     slots.append(summary);
   };
   let checks=theme.previewOnly?{}:routeChecks.get(theme.unitId)||{};
   addItems(checks);
   if(theme.previewOnly)return branch;
   const refresh=async()=>{
     const request=++revision;
     const latest=await getStatus(theme.unitId);
     if(request!==revision||!branch.isConnected)return;
     routeChecks.set(theme.unitId,latest);
     if(JSON.stringify(latest)===JSON.stringify(checks))return;
     checks=latest;
     addItems(checks);
   };
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
 const routeDrawings=new WeakMap();
 function drawRoute(list){
   const previous=routeDrawings.get(list);
   previous?.disconnect();
   const namespace='http://www.w3.org/2000/svg';
   const svg=document.createElementNS(namespace,'svg');
   const path=document.createElementNS(namespace,'path');
   svg.classList.add('hanzi-route-path');
   svg.setAttribute('aria-hidden','true');
   svg.append(path);
   list.prepend(svg);

   let frame=0;
   const schedule=()=>{
     cancelAnimationFrame(frame);
     frame=requestAnimationFrame(()=>{
       const bounds=list.getBoundingClientRect();
       if(!bounds.width||!bounds.height)return;
       const points=[...list.querySelectorAll(
         '.pre4-route-number, .hanzi-small-stop > .kp354-branch-item:first-child .kp354-branch-marker, .kp354-summary .kp354-branch-marker'
       )].filter(marker=>marker.getClientRects().length).map(marker=>{
         const {left,top,width,height}=marker.getBoundingClientRect();
         return {x:left-bounds.left+width/2,y:top-bounds.top+height/2};
       });
       const curve=points.map(({x,y},index)=>{
         if(!index)return `M ${x} ${y}`;
         const from=points[index-1];
         const mid=(from.y+y)/2;
         const bend=Math.abs(from.x-x)<6?(index%2?22:-22):0;
         return `C ${from.x+bend} ${mid}, ${x+bend} ${mid}, ${x} ${y}`;
       }).join(' ');
       svg.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);
       path.setAttribute('d',curve);
     });
   };
   const resize=new ResizeObserver(schedule);
   resize.observe(list);
   const changes=new MutationObserver(schedule);
   changes.observe(list,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});
   routeDrawings.set(list,{disconnect(){
     resize.disconnect();
     changes.disconnect();
     cancelAnimationFrame(frame);
   }});
   schedule();
 }
 window.KP_HANZI_LESSON_PLAN={renderBranches,split,stationLabel,drawRoute};
})();
