/* Shared completion and sticker reward for the independent Hanzi learning route. */
(()=>{
  'use strict';
  const learning=document.getElementById('pre4Learning');
  const counter=document.getElementById('pre4WordCounter');
  const finish=document.createElement('button');
  finish.type='button';finish.className='pre4-finish-unit';finish.hidden=true;
  finish.textContent='この単元を完了する ✦';
  learning.appendChild(finish);
  let completedUnit='',recognitionDone=false,strokeSeen=false,writingSeen=false;
  const state=()=>{
    const scope=window.KP_HANZI_SCOPE;
    if(!scope){finish.hidden=true;return null;}
    if(completedUnit!==scope.unitId){
      completedUnit=scope.unitId;recognitionDone=false;strokeSeen=false;writingSeen=false;
      finish.disabled=false;finish.textContent='この単元を完了する ✦';
    }
    // Lesson quizzes own all first-theme completion; legacy finish must never bypass them.
    if(scope.lessonId){finish.hidden=true;return scope;}
    const match=(counter?.textContent||'').match(/(\d+)\s*\/\s*(\d+)/);
    const onLast=!!match&&Number(match[1])===Number(match[2]);
    finish.hidden=!(onLast&&document.body.classList.contains('copy-mode'));
    if(window.KP_HANZI_PROGRESS?.completed()?.has(scope.unitId)){
      finish.disabled=true;finish.textContent='この単元はクリア済み ✓';
    }
    finish.title='認読・筆順・なぞり書きを終えたら記録できます';
    return scope;
  };
  document.addEventListener('click',event=>{
    const id=event.target?.closest('button')?.id;
    if(id==='rgGoStroke'){recognitionDone=true;strokeSeen=true;}
    if(id==='strokeTab'||id==='writeMode')strokeSeen=true;
    if(id==='practiceTab')writingSeen=true;
    requestAnimationFrame(state);
  });
  document.getElementById('canvas')?.addEventListener('pointerup',()=>{
    if(document.body.classList.contains('copy-mode'))writingSeen=true;
    requestAnimationFrame(state);
  });
  const watch=new MutationObserver(()=>requestAnimationFrame(state));
  watch.observe(counter,{childList:true,characterData:true,subtree:true});
  watch.observe(document.body,{attributes:true,attributeFilter:['class']});
  finish.addEventListener('click',async()=>{
    const scope=state();if(!scope||finish.disabled||scope.unitId==='pre4-u01')return;
    if(!recognitionDone||!strokeSeen||!writingSeen){
      finish.textContent='認読・筆順・なぞり書きの順に進めよう';
      window.setTimeout(()=>{if(!finish.disabled)finish.textContent='この単元を完了する ✦';},2600);
      return;
    }
    finish.disabled=true;finish.textContent='学習の記録を保存しています…';
    try{
      const saved=await window.KP_HANZI_MARK_UNIT_COMPLETE?.(scope.unitId);
      if(!saved){finish.textContent='ログインして学習を記録しよう';finish.disabled=false;return;}
      const completion=window.KP_ACCOUNT_API?.recordLearningCompletion?.('hanzi',scope.unitId);
      finish.textContent='単元クリア！ ✦';
      window.KPStandaloneReward?.show?.({activityKey:'hanzi.'+scope.unitId,score:1,total:1,completion});
    }catch(error){
      console.warn('[Koepanda] Hanzi completion failed:',error);
      finish.disabled=false;finish.textContent='保存できませんでした。もう一度試す';
    }
  });
  state();
})();
