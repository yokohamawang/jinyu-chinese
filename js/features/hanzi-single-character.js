/* 301.316: one character, three freely selectable learning stages.
 * Keeps 315 assets and the original lesson/animation renderer intact. */
(()=>{
  'use strict';
  const $=id=>document.getElementById(id);
  const lesson=$('pre4Learning'), game=$('readingGame'), app=document.querySelector('.app');
  if(!lesson||!game||!app)return;
  const state={character:'',stage:1,returnTo:'',answered:false,choice:'',currentCorrect:'',completed:new Map(),busy:false,legacyTest:false};
  const stages=['認読','筆順','なぞり書き'];
  const shell=document.createElement('div');
  const teacherArea=document.querySelector('.pre4-learning-nav');
  let teacher=null;
  if(teacherArea){
    teacher=document.createElement('span');
    teacher.className='kp330-nav-teacher';
    teacher.setAttribute('role','img');teacher.setAttribute('aria-label','めがねの小音先生');
    teacher.innerHTML='<img class="kp331-teacher-resting" src="./assets/hanzi/teacher-welcome-resting.webp" alt=""><img class="kp331-teacher-speaking" src="./assets/hanzi/teacher-welcome-speaking-matched-340.webp" alt="">';
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
  shell.className='kp316-shell';
  shell.innerHTML='<div class="kp316-character-nav"><button type="button" id="kp316Prev" aria-label="前の漢字">‹</button><button type="button" id="kp316Picker" aria-label="漢字一覧を開く">1 / 10</button><button type="button" id="kp316Next" aria-label="次の漢字">›</button></div><div class="kp316-character-list" id="kp316List" hidden></div>';
  const progress=document.querySelector('.progress');
  progress.before(shell);
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
  paper.append(undoButton);
  let undoHistory=[],pendingTrace=null;
  function updateUndo(){undoButton.disabled=undoHistory.length===0}
  traceCanvas.addEventListener('pointerdown',()=>{
    if(!document.body.classList.contains('kp316-active')||state.stage!==3||taskPopup.hidden)return;
    pendingTrace={index:strokeIndex};
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
    if(strokeIndex>pendingTrace.index){
      const box=traceCanvas.getBoundingClientRect();
      if(box.width&&box.height){
        pendingTrace.points=tracePoints.map(p=>({x:p.x/box.width,y:p.y/box.height}));
        undoHistory.push(pendingTrace);
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
    strokeIndex=previous.index;
    repaintAccepted();
    drawStrokeDemo();
    const hint=$('strokeHint');
    if(hint)hint.textContent='最後の一画を戻しました。同じ画をもう一度なぞりましょう。';
    updateUndo();
  };
  $('clear')?.addEventListener('click',()=>{undoHistory=[];pendingTrace=null;updateUndo()});
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
  quiz.innerHTML='<div class="kp316-quiz-panel"><div class="kp316-quiz-head"><strong>漢字を読んでみよう</strong><button type="button" id="kp316QuizClose" aria-label="認読を閉じる">×</button></div><p class="kp316-quiz-prompt">読み方に合う漢字を選んでね</p><div class="kp316-quiz-info"><span id="kp316SoundText"></span><button type="button" id="kp316Speak" aria-label="発音を聞く">🔊</button></div><div class="kp316-choices" id="kp316Choices"></div><p class="kp316-quiz-feedback" id="kp316Feedback" aria-live="polite"></p></div>';
  document.body.append(quiz);
  function scoped(){return window.KP_HANZI_SCOPE?.characters||HANZI_LESSONS.map(x=>x.char)}
  function index(){return Math.max(0,scoped().indexOf(state.character))}
  function entry(ch){return HANZI_LESSONS.find(x=>x.char===ch)}
  function speak(ch){armTeacher();try{if(typeof playHanziSystemVoice==='function')playHanziSystemVoice(ch);else if(typeof playHanziPronunciation==='function')playHanziPronunciation()}catch(_){}}
  function stageButton(n){return [null,$('readTab'),$('strokeTab'),$('practiceTab')][n]}
  function resetModeSelection(){
    [1,2,3].forEach(n=>{stageButton(n).classList.remove('on');stageButton(n).setAttribute('aria-pressed','false')});
  }
  function selectStage(n){
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
  }
  function switchCharacter(ch,stage=1){
    if(!entry(ch))return;
    if(state.character&&state.character!==ch&&!state.returnTo)state.returnTo=state.character;
    state.character=ch;
    const i=HANZI_LESSONS.findIndex(x=>x.char===ch);
    render(i);undoHistory=[];pendingTrace=null;updateUndo();updateNavigation();
    if(stage)selectStage(stage);
    else{quiz.hidden=true;overlay.hidden=true;taskPopup.hidden=true;setStudyStep(2);resetModeSelection()}
  }
  function openQuiz(){
    const chars=scoped(),right=state.character,answer=entry(right);
    if(!answer)return;
    state.answered=false;state.currentCorrect=right;
    const others=[...new Set([...chars,...HANZI_LESSONS.map(x=>x.char)])].filter(ch=>ch!==right);
    const choices=[right,...others.sort(()=>Math.random()-.5).slice(0,3)].sort(()=>Math.random()-.5);
    $('kp316SoundText').textContent=answer.pinyin||right;
    $('kp316Choices').replaceChildren();$('kp316Feedback').textContent='';
    choices.forEach(ch=>{const b=document.createElement('button');b.type='button';b.textContent=ch;b.onclick=()=>choose(ch);$('kp316Choices').append(b)});
    quiz.hidden=false;requestAnimationFrame(()=>speak(right));
  }
  function choose(ch){
    if(state.answered)return;
    state.answered=true;state.choice=ch;
    if(ch===state.character){
      $('kp316Feedback').textContent='○ 正解！ よくできました。';
      $('kp316Choices').querySelectorAll('button').forEach(b=>{b.disabled=true;b.classList.toggle('correct',b.textContent===ch)});
      markStage(1);
      const next=document.createElement('button');next.className='kp316-inline-next';next.type='button';next.textContent='主画面に戻る';next.onclick=()=>{quiz.hidden=true;overlay.hidden=true;resetModeSelection()};$('kp316Feedback').append(next);
    }else{
      $('kp316Correct').textContent=state.character;$('kp316Wrong').textContent=ch;
      $('kp316Hint').textContent='「'+state.character+'」と「'+ch+'」の形を見比べてみよう。';
      quiz.hidden=true;overlay.hidden=false;
      $('kp316Retry').focus();
    }
  }
  let saves=Promise.resolve();
  function markStage(n){
    if(!window.KP_HANZI_SCOPE?.unitId||!state.character)return;
    const unit=window.KP_HANZI_SCOPE.unitId,char=state.character;
    const existing=state.completed.get(char)||new Set();existing.add(n);state.completed.set(char,existing);
    const api=window.KP_ACCOUNT_API;
    saves=saves.then(async()=>{
      const client=await api?.getClient?.();if(!client)return;
      const {data:userData}=await client.auth.getUser();const user=userData?.user;if(!user)return;
      const {data,error}=await client.from('course_progress').select('status,completed_at,review_checks').eq('user_id',user.id).eq('course_id','hanzi-pre4-course').eq('unit_id',unit).maybeSingle();
      if(error)throw error;
      const checks={...(data?.review_checks||{})};checks['char:'+char]=[...new Set([...(checks['char:'+char]||[]),n])];
      const now=new Date().toISOString();
      const payload={user_id:user.id,course_id:'hanzi-pre4-course',unit_id:unit,status:data?.status||'in_progress',last_visited_at:now,review_checks:checks,updated_at:now};
      if(data?.completed_at)payload.completed_at=data.completed_at;
      const result=await client.from('course_progress').upsert(payload,{onConflict:'user_id,course_id,unit_id'});
      if(result.error)throw result.error;
    }).catch(e=>console.warn('[Koepanda] stage sync pending:',e));
  }
  async function restoreStages(){
    const unit=window.KP_HANZI_SCOPE?.unitId;if(!unit)return;
    try{
      const client=await window.KP_ACCOUNT_API?.getClient?.();const {data:auth}=await client?.auth.getUser();if(!auth?.user)return;
      const {data}=await client.from('course_progress').select('review_checks').eq('user_id',auth.user.id).eq('course_id','hanzi-pre4-course').eq('unit_id',unit).maybeSingle();
      state.completed.clear();Object.entries(data?.review_checks||{}).forEach(([key,value])=>{if(key.startsWith('char:')&&Array.isArray(value))state.completed.set(key.slice(5),new Set(value))});
    }catch(e){console.warn('[Koepanda] stage restore unavailable',e)}
  }
  function launch(){
    if(state.legacyTest||!window.KP_HANZI_SCOPE?.characters?.length)return;
    game.hidden=true;document.body.style.overflow='';
    document.body.classList.add('kp316-active');
    state.returnTo='';state.completed.clear();
    restoreStages();
    switchCharacter(scoped()[0],0);
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
  $('kp321Close').onclick=()=>{if(taskInteracted)markStage(state.stage);taskPopup.hidden=true;setStudyStep(2);resetModeSelection()};
  $('kp316Speak').onclick=()=>speak(state.character);
  // Existing next/previous shortcuts should not change the word-level position.
  for(const [id,delta] of [['prevCharacter',-1],['nextCharacter',1],['writePrevCharacter',-1],['writeNextCharacter',1]])$(id)?.addEventListener('click',e=>{
    if(!document.body.classList.contains('kp316-active'))return;
    e.stopImmediatePropagation();const ch=scoped()[index()+delta];if(ch)switchCharacter(ch,state.stage);
  },true);
  $('backToPre4Route')?.addEventListener('click',()=>{document.body.classList.remove('kp316-active');quiz.hidden=true;overlay.hidden=true;taskPopup.hidden=true},true);
})();
