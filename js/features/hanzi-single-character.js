/* 301.316: one character, three freely selectable learning stages.
 * Keeps 315 assets and the original lesson/animation renderer intact. */
(()=>{
  'use strict';
  const $=id=>document.getElementById(id);
  const lesson=$('pre4Learning'), game=$('readingGame'), app=document.querySelector('.app');
  if(!lesson||!game||!app)return;
  const state={character:'',stage:1,returnTo:'',answered:false,choice:'',currentCorrect:'',completed:new Map(),busy:false,legacyTest:false};
  const FIRST_UNIT='pre4-u01';
  const activeLesson=()=>window.KP_HANZI_SCOPE?.lessonId||FIRST_UNIT;
  const lessonLabel=()=>window.KP_HANZI_SCOPE?.lessonTitle||'第一単元';
  const stages=['認読','筆順','なぞり書き'];
  const shell=document.createElement('div');
  const teacherArea=document.querySelector('.pre4-learning-nav');
  let teacher=null;
  if(teacherArea){
    teacher=document.createElement('span');
    teacher.className='kp330-nav-teacher';
    teacher.setAttribute('role','img');teacher.setAttribute('aria-label','めがねの小音先生');
    teacher.innerHTML='<img class="kp331-teacher-resting" src="./assets/hanzi/teacher-welcome-resting.webp" alt=""><img class="kp331-teacher-speaking" src="./assets/hanzi/teacher-welcome-speaking-alpha-341.webp" alt="">';
    teacherArea.append(teacher);
  }
  // One pronunciation request = precisely one mouth opening. The older
  // is-speaking events can restart during a TTS fallback; do not use them for
  // the main mascot animation.
  let mouthBusy=false;
  const armTeacher=()=>{
    if(!teacher||mouthBusy)return;
    mouthBusy=true;teacher.classList.add('kp335-mouth-open');
    setTimeout(()=>{teacher.classList.remove('kp335-mouth-open');mouthBusy=false;},610);
  };
  $('speak')?.addEventListener('click',armTeacher,true);
  const mainCharacterCard=document.querySelector('.lesson'),mainAudio=$('speak');
  if(mainCharacterCard&&mainAudio){
    const speakFromCard=()=>speak(state.character);
    mainCharacterCard.addEventListener('click',event=>{
      if(event.target.closest?.('#speak'))return;
      if(!document.body.classList.contains('kp316-active'))return;
      speakFromCard();
    });
    mainCharacterCard.tabIndex=0;
    mainCharacterCard.setAttribute('aria-label','漢字の読み方を聞く');
    mainCharacterCard.addEventListener('keydown',event=>{
      if(event.target!==mainCharacterCard||!['Enter',' '].includes(event.key))return;
      if(!document.body.classList.contains('kp316-active'))return;
      event.preventDefault();speakFromCard();
    });
  }
  shell.className='kp316-shell';
  shell.innerHTML='<div class="kp316-character-nav"><button type="button" id="kp316Prev" aria-label="前の漢字">‹</button><button type="button" id="kp316Picker" aria-label="漢字一覧を開く">1 / 10</button><button type="button" id="kp316Next" aria-label="次の漢字">›</button></div><div class="kp316-character-list" id="kp316List" hidden></div>';
  const progress=document.querySelector('.progress');
  progress.before(shell);
  const unitProgress=document.createElement('div');
  unitProgress.id='kp350UnitProgress';
  unitProgress.setAttribute('role','status');
  unitProgress.setAttribute('aria-live','polite');
  unitProgress.hidden=true;
  progress.after(unitProgress);
  const dailyToast=document.createElement('div');
  dailyToast.id='kp352DailyToast';dailyToast.setAttribute('role','status');dailyToast.hidden=true;
  document.body.append(dailyToast);
  const unitFinish=document.createElement('section');
  unitFinish.id='kp350UnitFinish';unitFinish.className='kp350-unit-finish';unitFinish.hidden=true;
  unitFinish.setAttribute('role','dialog');unitFinish.setAttribute('aria-modal','true');
  unitFinish.innerHTML='<div class="kp350-unit-finish-card"><img src="./assets/hanzi/teacher-welcome-resting.webp" alt="小音先生"><span>✦ レッスンクリア ✦</span><h2>ミニテスト合格！</h2><p>読む・筆順・なぞり書き、ぜんぶがんばりました。</p><p id="kp350SaveStatus" role="status">学習記録を保存しています…</p><button type="button" id="kp350FinishRetry" hidden>記録をもう一度保存する</button><button type="button" id="kp350FinishClose">学習画面へ戻る</button></div>';
  document.body.append(unitFinish);
  const returnToHanziRoute=()=>{unitFinish.hidden=true;$('backToPre4Route')?.click()};
  $('kp350FinishClose').onclick=returnToHanziRoute;
  $('kp350FinishRetry').onclick=()=>{
    if(unitFinish.dataset.needsLogin==='true'){
      unitFinish.hidden=true;
      if($('kpAccountTrigger'))$('kpAccountTrigger').click();
      else window.location.href='./index.html';
      return;
    }
    completeFirstUnit();
  };
  const lessonBoard=document.querySelector('.board');
  if(lessonBoard){
    const originalScroll=lessonBoard.scrollIntoView.bind(lessonBoard);
    lessonBoard.scrollIntoView=(...args)=>{
      if(!document.body.classList.contains('kp316-active'))originalScroll(...args);
    };
  }
  const nextBar=document.createElement('div');nextBar.className='kp316-next';
  nextBar.innerHTML='<button type="button" id="kp316Continue">次の漢字へ</button><button type="button" id="kp316Return" hidden>学習のつづきへ戻る</button>';
  document.querySelector('.controls').after(nextBar);
  // The main page owns navigation. Only the task canvas and task-specific
  // tools move to the popup; the three mode buttons stay on the main page.
  const taskPopup=document.createElement('section');taskPopup.id='kp321Task';taskPopup.className='kp321-task';taskPopup.hidden=true;
  taskPopup.setAttribute('role','dialog');taskPopup.setAttribute('aria-modal','true');
  taskPopup.innerHTML='<div class="kp321-panel"><div class="kp321-head"><div><strong id="kp321Title">筆順</strong><span id="kp321Character">你 · nǐ</span></div><button type="button" id="kp321Close" aria-label="主画面に戻る">×</button></div><div class="kp321-body" id="kp321Body"></div></div>';
  document.body.append(taskPopup);
  $('kp321Body').append(lessonBoard,document.querySelector('.controls'));
  // Undo only the last accepted trace stroke, preserving earlier strokes.
  const paper=$('paper'),traceCanvas=$('canvas');
  const undoButton=document.createElement('button');
  undoButton.id='kp325Undo';undoButton.type='button';
  undoButton.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  undoButton.setAttribute('aria-label','一画戻す');undoButton.title='一画戻す';
  // Compact undo sits in the pad's empty lower-right corner, without adding a row.
  paper.append(undoButton);
  let undoHistory=[],pendingTrace=null;
  const traceNotice=document.createElement('div');
  traceNotice.id='kp349TraceNotice';
  traceNotice.setAttribute('role','status');
  traceNotice.setAttribute('aria-live','polite');
  traceNotice.hidden=true;
  paper.append(traceNotice);
  let traceNoticeTimer=null;
  function showTraceNotice(kind,message,persistent=false){
    clearTimeout(traceNoticeTimer);
    traceNotice.dataset.kind=kind;
    traceNotice.textContent=message;
    traceNotice.hidden=false;
    if(!persistent)traceNoticeTimer=setTimeout(()=>{traceNotice.hidden=true},1900);
  }
  function resetTraceNotice(){
    clearTimeout(traceNoticeTimer);
    traceNotice.hidden=true;
    traceNotice.textContent='';
  }
  function updateUndo(){undoButton.disabled=undoHistory.length===0}
  traceCanvas.addEventListener('pointerdown',event=>{
    if(!document.body.classList.contains('kp316-active')||state.stage!==3||taskPopup.hidden)return;
    if(strokeIndex>=HANZI_LESSONS[current].strokes.length){
      // Completion is a stable result, not the beginning of another trace.
      event.preventDefault();event.stopImmediatePropagation();return;
    }
    pendingTrace={index:strokeIndex};
  },true);
  // The first dot of 谢 is short enough that iOS Safari may emit no
  // pointermove before pointerup. Append the final position BEFORE the legacy
  // finishStroke listener checks tracePoints.length (without changing criteria).
  traceCanvas.addEventListener('pointerup',event=>{
    if(!document.body.classList.contains('kp316-active')||state.stage!==3||taskPopup.hidden)return;
    if(state.character!=='谢'||strokeIndex!==0||!drawing||!tracePoints.length)return;
    const r=traceCanvas.getBoundingClientRect();
    const p={x:event.clientX-r.left,y:event.clientY-r.top};
    const last=tracePoints[tracePoints.length-1];
    const movement=Math.hypot(p.x-last.x,p.y-last.y);
    if(movement>1){tracePoints.push(p);return;}
    // 谢 starts with a short 点 stroke. On iOS a small tap/dab can generate
    // only pointerdown and pointerup at virtually the same coordinate. Accept
    // that gesture ONLY when it lands close to the first stroke's real guide.
    // Other strokes and characters retain the original path checker.
    if(tracePoints.length===1){
      const first=HANZI_LESSONS[current].medians?.[0]?.[0];
      const sample=[((p.x/r.width-.12)/.76)*1024,900-((p.y/r.height-.12)/.76)*1024];
      if(first&&Math.hypot(sample[0]-first[0],sample[1]-first[1])<95){
        tracePoints.push({x:p.x+.5,y:p.y+.5});
      }
    }
  },true);
  // Rebuild the accepted ink from vector paths. Canvas pixel snapshots become
  // stale whenever Safari changes its visual viewport and calls resize().
  function repaintAccepted(){
    const box=traceCanvas.getBoundingClientRect();
    if(!box.width||!box.height)return;
    ctx.clearRect(0,0,box.width,box.height);
    undoHistory.forEach(item=>{
      const points=item.points;if(points.length<2)return;
      ctx.beginPath();
      ctx.moveTo(points[0].x*box.width,points[0].y*box.height);
      for(let i=1;i<points.length;i++)ctx.lineTo(points[i].x*box.width,points[i].y*box.height);
      ctx.stroke();
    });
  }
  const finishUndoCapture=()=>{
    if(!pendingTrace)return;
    const accepted=strokeIndex>pendingTrace.index;
    if(accepted){
      const box=traceCanvas.getBoundingClientRect();
      if(box.width&&box.height){
        pendingTrace.points=tracePoints.map(p=>({x:p.x/box.width,y:p.y/box.height}));
        undoHistory.push(pendingTrace);
      }
    }
    if(state.stage===3&&!taskPopup.hidden){
      const total=HANZI_LESSONS[current].strokes.length;
      if(accepted&&strokeIndex===total){
        // The legacy renderer schedules setStudyStep(2) after 1.6 s. That
        // silently resets the pad while keeping our undo history alive.
        clearTimeout(window.koepandaPraiseTimer);
        const praise=$('praisePop');
        if(praise){praise.classList.remove('on');praise.hidden=true;}
        showTraceNotice('success','✓ 正解！ 全'+total+'画、上手に書けました！',true);
        if(window.KP_HANZI_UNIT_TEST?.isWriting?.()){window.dispatchEvent(new CustomEvent('kp-hanzi-test-writing-complete',{detail:{char:state.character}}));}
        else markStage(3);
      }else if(accepted){
        resetTraceNotice();
      }else if(tracePoints.length>=2){
        showTraceNotice('retry','順番・始点・方向を確認して、もう一度なぞろう');
        if(window.KP_HANZI_UNIT_TEST?.isWriting?.())window.dispatchEvent(new CustomEvent('kp-hanzi-test-writing-error',{detail:{char:state.character,stroke:pendingTrace.index+1}}));
      }
    }
    pendingTrace=null;updateUndo();
  };
  ['pointerup','pointercancel','lostpointercapture'].forEach(n=>traceCanvas.addEventListener(n,finishUndoCapture));
  undoButton.onclick=()=>{
    const previous=undoHistory.pop();if(!previous)return;
    // A last-stroke celebration may still be queued: do not let it leave the
    // writing screen after the learner has undone that stroke.
    clearTimeout(window.koepandaPraiseTimer);
    const praise=$('praisePop');
    if(praise){praise.classList.remove('on');praise.hidden=true;}
    resetTraceNotice();
    strokeIndex=previous.index;
    repaintAccepted();
    drawStrokeDemo();
    const hint=$('strokeHint');
    if(hint)hint.textContent='最後の一画を戻しました。同じ画をもう一度なぞりましょう。';
    updateUndo();
  };
  $('clear')?.addEventListener('click',()=>{undoHistory=[];pendingTrace=null;resetTraceNotice();updateUndo()});
  window.addEventListener('resize',()=>requestAnimationFrame(()=>{
    if(state.stage===3&&!taskPopup.hidden&&undoHistory.length)repaintAccepted();
  }));
  updateUndo();
  let taskInteracted=false;
  $('kp321Body').addEventListener('pointerdown',e=>{
    if(e.target.closest('canvas,.stroke-controls button,.controls button'))taskInteracted=true;
  });
  const overlay=document.createElement('section');overlay.className='kp316-overlay';overlay.id='kp316Overlay';overlay.hidden=true;
  overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','kp316ModalTitle');
  overlay.innerHTML='<div class="kp316-modal"><button type="button" class="kp316-close" id="kp316Close" aria-label="閉じる">×</button><div class="kp316-mascot"><img alt="小音" src="./assets/hanzi/xiaoyin/xiaoyin-oops-puzzled.webp"></div><h2 id="kp316ModalTitle">ここを確認しよう</h2><div class="kp316-compare"><div class="kp316-example correct"><span class="kp316-glyph" id="kp316Correct"></span><strong>○ 正しい漢字</strong></div><div class="kp316-example wrong"><span class="kp316-glyph" id="kp316Wrong"></span><strong>× 選んだ漢字</strong></div></div><p id="kp316Hint">形をよく見比べてみよう。</p><button type="button" class="kp316-primary" id="kp316Retry">もう一度やってみる</button></div>';
  document.body.append(overlay);
  const quiz=document.createElement('section');quiz.className='kp316-quiz';quiz.id='kp316Quiz';quiz.hidden=true;
  quiz.innerHTML='<div class="kp316-quiz-panel"><div class="kp316-quiz-head"><strong>漢字を読んでみよう</strong><button type="button" id="kp316QuizClose" aria-label="認読を閉じる">×</button></div><p class="kp316-quiz-prompt" id="kp316QuizPrompt" aria-live="polite">意味に合う絵を選んでね</p><div class="kp316-quiz-info"><span class="kp360-reading"><span id="kp316SoundText"></span><span id="kp360Pinyin" class="kp360-pinyin"></span></span><button type="button" id="kp316Speak" aria-label="発音を聞く">🔊</button></div><div class="kp316-choices" id="kp316Choices"></div></div>';
  document.body.append(quiz);
  const liveReadingPrompt=quiz.querySelector('.kp316-quiz-info');
  liveReadingPrompt.tabIndex=0;
  liveReadingPrompt.setAttribute('aria-label','ピンインをタップして発音を聞く');
  liveReadingPrompt.addEventListener('click',event=>{
    if(event.target.closest?.('#kp316Speak'))return;
    speak(state.character);
  });
  liveReadingPrompt.addEventListener('keydown',event=>{
    if(event.target!==liveReadingPrompt||!['Enter',' '].includes(event.key))return;
    event.preventDefault();speak(state.character);
  });
  function scoped(){return window.KP_HANZI_SCOPE?.characters||HANZI_LESSONS.map(x=>x.char)}
  function index(){return Math.max(0,scoped().indexOf(state.character))}
  function entry(ch){return HANZI_LESSONS.find(x=>x.char===ch)}
  function speak(ch){armTeacher();try{if(typeof playHanziSystemVoice==='function')playHanziSystemVoice(ch);else if(typeof playHanziPronunciation==='function')playHanziPronunciation()}catch(_){}}
  function stageButton(n){return [null,$('readTab'),$('strokeTab'),$('practiceTab')][n]}
  function resetModeSelection(){
    [1,2,3].forEach(n=>{stageButton(n).classList.remove('on');stageButton(n).setAttribute('aria-pressed','false')});
  }
  function selectStage(n){
    clearTimeout(window.koepandaPraiseTimer);
    resetTraceNotice();
    state.stage=n;
    quiz.hidden=true;overlay.hidden=true;
    document.body.classList.toggle('kp316-read',n===1);
    setStudyStep(n===1?2:n);
    taskPopup.hidden=n===1;
    undoHistory=[];pendingTrace=null;updateUndo();
    taskInteracted=false;
    taskPopup.classList.toggle('kp321-tracing',n===3);
    $('kp321Title').textContent=n===3?'なぞり書き':'筆順アニメーション';
    $('kp321Character').textContent=state.character+' · '+(entry(state.character)?.pinyin||'');
    for(let i=1;i<=3;i++){stageButton(i).classList.toggle('on',i===n);stageButton(i).setAttribute('aria-pressed',String(i===n));}
    stageButton(1).innerHTML='認読';stageButton(2).innerHTML='筆順';stageButton(3).innerHTML='なぞり書き';
    if(n===1)openQuiz();
    if(n!==1)requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
  }
  function updateNavigation(){
    const chars=scoped(),i=index();
    $('kp316Prev').disabled=i===0;
    $('kp316Next').disabled=i===chars.length-1;
    $('kp316Next').setAttribute('aria-label','次の漢字');
    $('kp316Picker').textContent=(i+1)+' / '+chars.length;
    $('kp316List').replaceChildren();
    chars.forEach((ch,j)=>{const b=document.createElement('button');b.textContent=ch;b.className=ch===state.character?'current':'';b.type='button';b.onclick=()=>{switchCharacter(ch,0);$('kp316List').hidden=true};$('kp316List').append(b)});
    $('kp316Return').hidden=!state.returnTo||state.returnTo===state.character;
    const lessonEntry=(window.KP_HANZI_UNIT_ENTRIES||[]).find(e=>(e.character_sequence||[]).includes(state.character));
    if(lessonEntry){const meaning=$('meaning');if(meaning){meaning.textContent=(entry(state.character)?.meaning||'').split('：')[0]||lessonEntry.ja_meaning}}
    updateUnitProgress();
  }
  function switchCharacter(ch,stage=1){
    if(!entry(ch))return;
    if(state.character&&state.character!==ch&&!state.returnTo)state.returnTo=state.character;
    state.character=ch;
    const i=HANZI_LESSONS.findIndex(x=>x.char===ch);
    render(i);undoHistory=[];pendingTrace=null;resetTraceNotice();updateUndo();updateNavigation();
    if(stage)selectStage(stage);
    else{quiz.hidden=true;overlay.hidden=true;taskPopup.hidden=true;setStudyStep(2);resetModeSelection()}
  }
  // Reuse the existing Pre-4 semantic picture bank; never invent new artwork.
  const semanticBank=()=>{
    const all=window.KP_HANZI_ALL_ENTRIES||window.KP_HANZI_UNIT_ENTRIES||[];
    return all.filter(e=>e?.recognition?.image_data||e?.recognition?.image).map(e=>({
      id:e.entry_id,word:e.simplified,meaning:e.ja_meaning,chars:e.character_sequence||[],
      imageData:e.recognition?.image_data||'',image:window.KP_HANZI_RECOGNITION_SCENES?.[e.entry_id]||e.recognition?.image||''
    }));
  };
  let selectedMeaning=null;
  const quizPanel=quiz.querySelector('.kp316-quiz-panel');
  const quizChoices=$('kp316Choices');
  const quizPrompt=$('kp316QuizPrompt');
  const choosePicturePrompt='意味に合う絵を選んでね';
  let wrongChoices=0;
  function openQuiz(){
    const right=state.character,bank=semanticBank();
    if(!entry(right))return;
    const theme=window.KP_HANZI_UNIT_ENTRIES||[];
    const anchor=(theme.find(e=>(e.character_sequence||[]).includes(right))||
       (window.KP_HANZI_ALL_ENTRIES||[]).find(e=>(e.character_sequence||[]).includes(right)));
    const correct=bank.find(item=>item.id===anchor?.entry_id);
    wrongChoices=0;
    quizPrompt.textContent=choosePicturePrompt;
    delete quizPrompt.dataset.result;
    quizPanel.scrollTop=0;
    if(!correct){
      quizPrompt.textContent='この漢字の絵を読み込めませんでした。ページを更新してみてね。';
      quizChoices.replaceChildren();quiz.hidden=false;
      console.warn('[Koepanda] semantic scene unavailable',right,anchor?.entry_id,bank.length);
      return;
    }
    state.answered=false;selectedMeaning=correct;
    const pool=bank.filter(x=>x.id!==correct.id&&x.meaning!==correct.meaning);
    // Prefer variety from the same topic, then the existing picture catalog.
    const same=pool.filter(x=>theme.some(e=>e.entry_id===x.id));
    const distractors=[...same.sort(()=>Math.random()-.5),...pool.filter(x=>!same.includes(x)).sort(()=>Math.random()-.5)]
      .filter((item,i,arr)=>arr.findIndex(x=>x.id===item.id)===i).slice(0,3);
    const choices=[correct,...distractors].sort(()=>Math.random()-.5);
    $('kp316SoundText').textContent=right;
    $('kp360Pinyin').textContent=entry(right)?.pinyin||'';
    quizChoices.replaceChildren();
    quizChoices.classList.add('kp358-meaning-choices');
    choices.forEach(item=>{
      const b=document.createElement('button');b.type='button';b.className='kp358-meaning-card';
      b.setAttribute('aria-label',item.meaning);b.dataset.answer=item.id;
      const img=document.createElement('img');img.alt='';img.loading='eager';
      img.src=(window.KP_HANZI_RECOGNITION_SCENES?.[item.id]?'./assets/hanzi/recognition/'+item.image:item.imageData||('./assets/hanzi/recognition/'+item.image));
      const label=document.createElement('span');label.textContent=item.meaning;
      b.append(img,label);b.onclick=()=>choose(item.id);quizChoices.append(b);
    });
    quiz.hidden=false;requestAnimationFrame(()=>speak(right));
  }
  function choose(id){
    if(state.answered||!selectedMeaning)return;
    const cards=[...quizChoices.querySelectorAll('button')];
    const chosen=cards.find(card=>card.dataset.answer===id);
    if(!chosen||chosen.disabled)return;

    if(id!==selectedMeaning.id){
      chosen.disabled=true;
      chosen.classList.add('wrong');
      wrongChoices++;
      quizPrompt.dataset.result='retry';
      if(wrongChoices===1){
        quizPrompt.textContent='おしい！ もう一度選んでみよう';
      }else{
        const correctCard=cards.find(card=>card.dataset.answer===selectedMeaning.id);
        correctCard.classList.add('hinted');
        quizPrompt.textContent='緑の枠の絵を選んでね';
        if(wrongChoices===2)speak(state.character);
      }
      return;
    }

    state.answered=true;
    cards.forEach(card=>{
      card.disabled=true;
      card.classList.remove('hinted');
    });
    chosen.classList.add('correct');
    quizPrompt.dataset.result='correct';
    quizPrompt.textContent='正解！ '+selectedMeaning.word+' · '+selectedMeaning.meaning;
    markStage(1);
  }
  let saves=Promise.resolve(),lastSaveError=null,finishPending=false,finishedHere=false,unitTestPassed=false,unitTestScore=0;
  let dailySteps=new Map(),todayChars=new Set(),dailyToastTimer=null,lastPracticeDay='';
  function tokyoDay(){
    const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const part=type=>parts.find(item=>item.type===type)?.value||'';
    return part('year')+'-'+part('month')+'-'+part('day');
  }
  function showDailyToast(text){
    clearTimeout(dailyToastTimer);
    dailyToast.textContent=text;dailyToast.hidden=false;
    dailyToastTimer=setTimeout(()=>{dailyToast.hidden=true},2700);
  }
  function firstUnitActive(){return document.body.classList.contains('kp316-active')&&!!window.KP_HANZI_SCOPE?.unitId&&!!window.KP_HANZI_SCOPE?.lessonId}
  function unitIsReady(){return firstUnitActive()&&scoped().length>0&&scoped().every(ch=>[1,2,3].every(stage=>state.completed.get(ch)?.has(stage)))}
  function updateUnitProgress(){
    const visible=firstUnitActive();if(!visible){unitProgress.hidden=true;return;}
    const chars=scoped(),done=chars.filter(ch=>[1,2,3].every(n=>state.completed.get(ch)?.has(n))).length;
    // The 1/3 character navigation already communicates progress. Show only
    // the actionable test entry after the lesson's three characters are ready.
    unitProgress.replaceChildren();
    unitProgress.hidden=done!==chars.length||unitTestPassed;
    if(!unitProgress.hidden){
      const takeTest=document.createElement('button');takeTest.type='button';takeTest.className='kp351-take-test';
      takeTest.textContent='✓ 3文字できた！ ミニテストへ';takeTest.onclick=offerUnitTest;
      unitProgress.append(takeTest);
    }
    [1,2,3].forEach(n=>{
      const button=stageButton(n);button.classList.toggle('kp350-complete',!!state.completed.get(state.character)?.has(n));
      button.setAttribute('aria-label',stages[n-1]+(state.completed.get(state.character)?.has(n)?' 完了':''));
    });
  }
  function syncGuestStages(){
    const unit=window.KP_HANZI_SCOPE?.unitId;
    if(!unit)return false;
    window.KP_HANZI_GUEST?.update(unit,checks=>{
      scoped().forEach(ch=>{
        const verified=[...(state.completed.get(ch)||[])];
        checks['char:'+ch]=[...new Set([...(checks['char:'+ch]||[]),...verified])];
        checks['charVerified:'+ch]=[...new Set([...(checks['charVerified:'+ch]||[]),...verified.filter(n=>n===2||n===3)])];
      });
      if(unitTestPassed)checks['unitTest:'+activeLesson()]=checks['unitTest:'+activeLesson()]||{passed_at:nowIso(),score:unitTestScore,total:activeLesson()===unit?10:6};
    });
    return true;
  }
  async function syncVerifiedFirstUnit(){
    const client=await window.KP_ACCOUNT_API?.getClient?.();
    if(!client)return syncGuestStages();
    const {data:auth,error:authError}=await client.auth.getUser();
    if(authError||!auth?.user)return syncGuestStages();
    const {data:previous,error:readError}=await client.from('course_progress')
      .select('status,completed_at,review_checks').eq('user_id',auth.user.id)
      .eq('course_id','hanzi-pre4-course').eq('unit_id',window.KP_HANZI_SCOPE.unitId).maybeSingle();
    if(readError)throw readError;
    const checks={...(previous?.review_checks||{})};
    scoped().forEach(ch=>{
      const verified=[...(state.completed.get(ch)||[])];
      checks['char:'+ch]=[...new Set([...(checks['char:'+ch]||[]),...verified])];
      checks['charVerified:'+ch]=[...new Set([...(checks['charVerified:'+ch]||[]),...verified.filter(n=>n===2||n===3)])];
    });
    if(unitTestPassed)checks['unitTest:'+activeLesson()]=checks['unitTest:'+activeLesson()]||{passed_at:nowIso(),score:unitTestScore,total:activeLesson()===window.KP_HANZI_SCOPE.unitId?10:6};
    const now=new Date().toISOString();
    const payload={user_id:auth.user.id,course_id:'hanzi-pre4-course',unit_id:window.KP_HANZI_SCOPE.unitId,
      status:previous?.status||'started',last_visited_at:now,review_checks:checks,updated_at:now};
    if(previous?.completed_at)payload.completed_at=previous.completed_at;
    const {error:writeError}=await client.from('course_progress').upsert(payload,{onConflict:'user_id,course_id,unit_id'});
    if(writeError)throw writeError;
    return true;
  }
  async function completeFirstUnit(){
    if(!unitIsReady()||!unitTestPassed||finishPending||finishedHere)return;
    const completedLesson=activeLesson();
    finishPending=true;
    const status=$('kp350SaveStatus'),close=$('kp350FinishClose');
    unitFinish.hidden=false;close.hidden=true;
    close.textContent='単元一覧へ戻る';
    status.textContent='学習記録を保存しています…';
    const retry=$('kp350FinishRetry');retry.hidden=true;
    unitFinish.dataset.needsLogin='false';retry.textContent='記録をもう一度保存する';
    try{
      await saves;
      const already=window.KP_HANZI_PROGRESS?.completed()?.has(activeLesson());
      if(already){finishedHere=true;unitFinish.hidden=true;updateUnitProgress();return;}
      const synced=await syncVerifiedFirstUnit();
      if(!synced){
        unitFinish.hidden=false;
        status.textContent='学習はできました。記録とごほうびにはログインが必要です。';
        retry.hidden=false;retry.textContent='ログインして記録する';unitFinish.dataset.needsLogin='true';
        return;
      }
      const client=await window.KP_ACCOUNT_API?.getClient?.();
      const session=client?(await client.auth.getUser()).data:null;
      const guest=!session?.user;
      const saved=await window.KP_HANZI_PROGRESS?.markComplete?.(activeLesson());
      if(!saved){
        unitFinish.hidden=false;
        status.textContent='学習はできました。記録とごほうびにはログインが必要です。';
        retry.hidden=false;retry.textContent='ログインして記録する';unitFinish.dataset.needsLogin='true';
        finishPending=false;return;
      }
      finishedHere=true;
      taskPopup.hidden=true;
      quiz.hidden=true;
      setStudyStep(2);
      resetModeSelection();
      unitFinish.hidden=false;
      status.textContent=guest?'🎉 合格！ 次のレッスンが開きました。ログインすると学習記録を保存できます。':'✓ 学習記録を保存しました。ごほうびを準備しています！';
      close.hidden=!guest;
      const completion=guest?null:window.KP_ACCOUNT_API?.recordLearningCompletion?.('hanzi',activeLesson());
      // Allow the child to read their result before opening the sticker reveal.
      if(!guest)setTimeout(()=>{
        unitFinish.hidden=true;
        window.KPStandaloneReward?.show?.({activityKey:'hanzi.'+completedLesson,score:1,total:1,completion,onContinue:returnToHanziRoute});
      },2100);
      updateUnitProgress();
    }catch(error){
      console.warn('[Koepanda] first unit completion pending:',error);
      unitFinish.hidden=false;
      status.textContent='保存できませんでした。通信を確認してもう一度試してください。';
      retry.hidden=false;
    }finally{finishPending=false;if(!finishedHere)close.hidden=false}
  }
  // Navigation must wait for queued stage writes before rebuilding the lesson tree.
  window.KP_HANZI_LESSON_FLUSH=async()=>{
    try{
      await saves;
      // Reconcile all locally verified stages before the route reads progress.
      // This also repairs an earlier individual stage upsert that failed.
      const synced=await syncVerifiedFirstUnit();
      if(synced)lastSaveError=null;
      return !!synced;
    }catch(error){console.warn('[Koepanda] pending lesson progress',error);return false}
  };
  function nowIso(){return new Date().toISOString()}
  function offerUnitTest(){
    if(!unitIsReady()||unitTestPassed||finishedHere||window.KP_HANZI_UNIT_TEST?.isOpen?.())return;
    taskPopup.hidden=true;quiz.hidden=true;overlay.hidden=true;
    setStudyStep(2);resetModeSelection();
    window.KP_HANZI_UNIT_TEST?.open?.(scoped(),{lessonId:activeLesson(),lessonTitle:lessonLabel(),previewOnly:!!window.KP_HANZI_SCOPE?.testUnlocked});
  }
  window.addEventListener('kp-hanzi-unit-test-passed',event=>{
    if(!firstUnitActive()||!unitIsReady()||unitTestPassed||event.detail?.lessonId!==activeLesson())return;
    unitTestPassed=true;
    unitTestScore=Number(event.detail?.score)||5;
    window.KP_HANZI_UNIT_TEST?.close?.();
    updateUnitProgress();
    void completeFirstUnit();
  });
  function markStage(n){
    if(!window.KP_HANZI_SCOPE?.unitId||!state.character)return;
    const unit=window.KP_HANZI_SCOPE.unitId,char=state.character;
    const existing=state.completed.get(char)||new Set();
    const isNewStage=!existing.has(n);
    if(isNewStage){existing.add(n);state.completed.set(char,existing);}
    // Guest stages must be visible to the lesson tree as soon as verified.
    // Do not depend on a later navigation/flush to persist volatile progress.
    syncGuestStages();
    const activeDay=tokyoDay();
    if(lastPracticeDay!==activeDay){dailySteps=new Map();todayChars=new Set();lastPracticeDay=activeDay;}
    const steps=dailySteps.get(char)||new Set();
    if(!isNewStage&&steps.has(n))return;
    steps.add(n);dailySteps.set(char,steps);
    updateUnitProgress();
    // Unregistered visitors can unlock immediately using volatile verified stages.
    // The guest session is never written to cookies, storage or Supabase.
    const api=window.KP_ACCOUNT_API;
    lastSaveError=null;
    saves=saves.then(async()=>{
      const client=await api?.getClient?.();if(!client)return;
      const {data:userData}=await client.auth.getUser();const user=userData?.user;if(!user)return;
      const {data,error}=await client.from('course_progress').select('status,completed_at,review_checks').eq('user_id',user.id).eq('course_id','hanzi-pre4-course').eq('unit_id',unit).maybeSingle();
      if(error)throw error;
      const checks={...(data?.review_checks||{})};
      // Keep per-day handwriting snapshots short; the authoritative calendar
      // remains in learning_days, while this row only needs recent steps.
      const cutoff=new Date(Date.now()-45*86400000).toISOString().slice(0,10);
      Object.keys(checks).forEach(key=>{
        if((key.startsWith('daySteps:')||key.startsWith('dayChars:'))&&key.split(':')[1]<cutoff)delete checks[key];
      });
      if(isNewStage)checks['char:'+char]=[...new Set([...(checks['char:'+char]||[]),n])];
      // v350 distinguishes genuine completed strokes from legacy popup-close marks.
      if(isNewStage&&n!==1)checks['charVerified:'+char]=[...new Set([...(checks['charVerified:'+char]||[]),n])];
      const stepKey='daySteps:'+activeDay+':'+char,dayKey='dayChars:'+activeDay;
      const currentSteps=[...new Set([...(checks[stepKey]||[]),n])];
      checks[stepKey]=currentSteps;
      const previouslyDone=(checks[dayKey]||[]).includes(char);
      const finishedChar=currentSteps.length===3;
      if(finishedChar)checks[dayKey]=[...new Set([...(checks[dayKey]||[]),char])];
      const now=new Date().toISOString();
      const payload={user_id:user.id,course_id:'hanzi-pre4-course',unit_id:unit,status:data?.status||'started',last_visited_at:now,review_checks:checks,updated_at:now};
      if(data?.completed_at)payload.completed_at=data.completed_at;
      const result=await client.from('course_progress').upsert(payload,{onConflict:'user_id,course_id,unit_id'});
      if(result.error)throw result.error;
      if(finishedChar&&!previouslyDone){
        todayChars=new Set(checks[dayKey]);
        updateUnitProgress();
        const count=todayChars.size;
        if(count===1){
          showDailyToast('🌱 1文字できたね！ ミニテストまであと少し！');
          // Streak and sticker are granted only after the lesson quiz passes.
        }else showDailyToast('🌟 今日 '+count+'文字できたね！ よくがんばったね！');
      }
    }).catch(e=>{lastSaveError=e;console.warn('[Koepanda] stage sync failed:',e);showDailyToast('学習記録を保存できませんでした。接続を確認してね。')});
    // The learner chooses when to take the visible lesson-tree test;
    // do not abruptly open a quiz after the final writing stroke.
  }
  // Completion must be earned by finishing the demo, not by opening/closing it.
  const strokeCounter=$('strokeCount');
  if(strokeCounter)new MutationObserver(()=>{
    if(!firstUnitActive()||state.stage!==2||taskPopup.hidden)return;
    const total=HANZI_LESSONS[current]?.strokes?.length;
    if(total>0&&strokeIndex===total)markStage(2);
  }).observe(strokeCounter,{childList:true,characterData:true,subtree:true});
  async function restoreStages(){
    const unit=window.KP_HANZI_SCOPE?.unitId;if(!unit)return;
    try{
      const client=await window.KP_ACCOUNT_API?.getClient?.();const auth=client?(await client.auth.getUser()).data:null;
      const guest=!auth?.user;
      const data=guest?{review_checks:window.KP_HANZI_GUEST?.checks(unit)||{}}:(await client.from('course_progress').select('review_checks').eq('user_id',auth.user.id).eq('course_id','hanzi-pre4-course').eq('unit_id',unit).maybeSingle()).data;
      unitTestPassed=!!data?.review_checks?.['unitTest:'+activeLesson()]?.passed_at;
      unitTestScore=Number(data?.review_checks?.['unitTest:'+activeLesson()]?.score)||0;
      const today=tokyoDay();lastPracticeDay=today;
      todayChars=new Set([...(data?.review_checks?.['dayChars:'+today]||[]),...todayChars]);
      dailySteps=new Map(scoped().map(ch=>[ch,new Set([...(data?.review_checks?.['daySteps:'+today+':'+ch]||[]),...(dailySteps.get(ch)||[])])]));
      Object.entries(data?.review_checks||{}).forEach(([key,value])=>{
        if(!key.startsWith('char:')||!Array.isArray(value))return;
        const ch=key.slice(5),verified=data.review_checks['charVerified:'+ch]||[];
        const existing=state.completed.get(ch)||new Set();
        value.filter(n=>n===1||verified.includes(n)).forEach(n=>existing.add(n));
        state.completed.set(ch,existing);
      });
      updateUnitProgress();
      if(unitIsReady()&&unitTestPassed&&!finishedHere)setTimeout(completeFirstUnit,700);
    }catch(e){console.warn('[Koepanda] stage restore unavailable',e)}
  }
  function launch(){
    if(state.legacyTest||!window.KP_HANZI_SCOPE?.characters?.length)return;
    game.hidden=true;document.body.style.overflow='';
    document.body.classList.add('kp316-active');
    state.returnTo='';state.completed.clear();unitTestPassed=false;unitTestScore=0;finishedHere=false;
    dailySteps=new Map();todayChars=new Set();lastPracticeDay=tokyoDay();dailyToast.hidden=true;
    const restore=restoreStages();
    switchCharacter(scoped()[0],0);
    const scope=window.KP_HANZI_SCOPE;
    if(scope.launchTest){
      // A tree test entry must launch the actual quiz only after remote
      // progress restores; otherwise a valid unlocked test appears empty.
      Promise.resolve(restore).then(()=>{
        if(!firstUnitActive()||window.KP_HANZI_SCOPE!==scope||!scope.launchTest)return;
        scope.launchTest=false;
        const reviewOnly=Array.isArray(scope.reviewRows);
        if(!unitIsReady()&&!scope.testUnlocked&&!reviewOnly){
          const missing=scoped().filter(ch=>![1,2,3].every(n=>state.completed.get(ch)?.has(n)));
          showDailyToast('先に '+missing.join('・')+' の学習を終えよう');
          return;
        }
        taskPopup.hidden=true;quiz.hidden=true;overlay.hidden=true;
        resetModeSelection();
        window.KP_HANZI_UNIT_TEST?.open?.(scoped(),{lessonId:activeLesson(),lessonTitle:reviewOnly?'まちがい復習':lessonLabel(),previewOnly:scope.testUnlocked,reviewOnly,reviewRows:scope.reviewRows,resumeCorrected:scope.resumeCorrected});
      }).catch(error=>console.warn('[Koepanda] lesson test entry failed',error));
    }
  }
  // Intercept the old unit-wide recognition autostart; preserve legacy routes outside units.
  window.addEventListener('kp:open-hanzi-recognition',e=>{
    if(!window.KP_HANZI_SCOPE?.characters?.length)return;
    e.stopImmediatePropagation();launch();
  },true);
  [1,2,3].forEach(n=>stageButton(n).addEventListener('click',e=>{if(!document.body.classList.contains('kp316-active'))return;e.stopImmediatePropagation();selectStage(n)},true));
  for(const [id,delta] of [['kp316Prev',-1],['kp316Next',1]])$(id).onclick=()=>{const ch=scoped()[index()+delta];if(ch)switchCharacter(ch,0)};
  $('kp316Picker').onclick=()=>$('kp316List').hidden=!$('kp316List').hidden;
  $('kp316Return').onclick=()=>{const ch=state.returnTo;state.returnTo='';switchCharacter(ch,0)};
  $('kp316Continue').onclick=()=>{
    const next=scoped()[index()+1];
    if(next){switchCharacter(next,0);return}
    return;
  };
  $('kp316Close').onclick=()=>{overlay.hidden=true;quiz.hidden=false;state.answered=false;openQuiz()};
  $('kp316Retry').onclick=()=>{overlay.hidden=true;openQuiz()};
  $('kp316QuizClose').onclick=()=>{quiz.hidden=true;overlay.hidden=true;resetModeSelection()};
  const closeStrokePopup=()=>{
    if(taskPopup.hidden)return;
    // Hide the modal first: a touch must not fall through to the canvas.
    taskPopup.hidden=true;
    if(window.KP_HANZI_UNIT_TEST?.isWriting?.())window.dispatchEvent(new Event('kp-hanzi-test-writing-cancel'));
    setStudyStep(2);resetModeSelection();updateUnitProgress();
  };
  $('kp321Close').onclick=event=>{event.stopPropagation();closeStrokePopup()};
  // On some mobile browsers pressing the circular X moves the touch target
  // onto the surrounding header before click. Defer closing until AFTER the
  // synthetic click so the dialog remains in place for its entire gesture.
  $('kp321Close').addEventListener('pointerup',event=>{
    if(event.pointerType==='mouse')return;
    event.preventDefault();event.stopPropagation();
    setTimeout(closeStrokePopup,0);
  },true);
  window.addEventListener('kp-hanzi-test-writing-start',event=>{
    if(!firstUnitActive()||event.detail?.lessonId!==activeLesson())return;
    switchCharacter(event.detail.char,0);selectStage(3);
  });
  window.addEventListener('kp-hanzi-test-writing-complete',()=>{
    if(!firstUnitActive())return;
    taskPopup.hidden=true;setStudyStep(2);resetModeSelection();
  });
  $('kp316Speak').onclick=()=>speak(state.character);
  // Existing next/previous shortcuts should not change the word-level position.
  for(const [id,delta] of [['prevCharacter',-1],['nextCharacter',1],['writePrevCharacter',-1],['writeNextCharacter',1]])$(id)?.addEventListener('click',e=>{
    if(!document.body.classList.contains('kp316-active'))return;
    e.stopImmediatePropagation();const ch=scoped()[index()+delta];if(ch)switchCharacter(ch,state.stage);
  },true);
  $('backToPre4Route')?.addEventListener('click',()=>{document.body.classList.remove('kp316-active');quiz.hidden=true;overlay.hidden=true;taskPopup.hidden=true},true);
  window.addEventListener('kp-account-state-changed',()=>{
    if(unitIsReady()&&!finishedHere)setTimeout(completeFirstUnit,400);
  });
})();
