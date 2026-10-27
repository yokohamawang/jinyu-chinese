/* DEMO 10.108.269 — P19 title clearance measured against the fixed lesson header.
   Keeps later lesson content honest: the next stage opens on the roadmap, while not-yet-built unit bodies are marked as next lessons.
   Based on the layered navigation from 10.107.71.
   Chapter list, unit list, and lesson body never remain visually stacked.
   Vowel units open only their own 3-vowel group. Back controls are compact and non-obstructive. */
(function(){
  var course=window.KOEPANDA_PINYIN_COURSE;
  if(!course)return;
  var root=null, detail=null;
  var lastStageId=null, lastStageTop=0;
  var lessonState=null;
  var lessonMarker=null;


  function devUnlockEnabled(){
    try{return typeof window.koepandaDevUnlockEnabled==='function' && window.koepandaDevUnlockEnabled();}catch(e){return false}
  }

  function allSingleVowelsComplete(){
    return typeof window.koepandaIsUnitComplete==='function' &&
      window.koepandaIsUnitComplete('P1') && window.koepandaIsUnitComplete('P2');
  }

  function allInitialsComplete(){try{return ['P3','P4','P5','P6','P7','P8'].every(function(id){return localStorage.getItem('koepandaInitial'+id+'Complete')==='1'})}catch(e){return false}}

  function islandComplete(island){
    if(island===1)return typeof window.koepandaIsUnitComplete==='function' && window.koepandaIsUnitComplete('P1') && window.koepandaIsUnitComplete('P2');
    if(island===2)return allInitialsComplete();
    return false;
  }

  function refreshIslandCompletion(){
    if(!root)return;
    root.querySelectorAll('.kp197-hotspot[data-island]').forEach(function(button){
      var island=Number(button.dataset.island),complete=islandComplete(island),title=button.dataset.islandTitle||'',fallback=button.dataset.incompleteLabel||'';
      var state=complete?'クリア':fallback;
      button.setAttribute('aria-label','島'+island+' '+title+' '+state);
      var sr=button.querySelector('.kp197-screenreader');if(sr)sr.textContent=title+' '+state;
      var badge=button.querySelector('.kp197-clear');
      if(complete&&!badge){badge=document.createElement('span');badge.className='kp197-clear';badge.textContent='✓ クリア';badge.setAttribute('aria-hidden','true');button.appendChild(badge)}
      else if(!complete&&badge)badge.remove();
    });
  }

  function effectiveStageStatus(stage){
    if(devUnlockEnabled())return 'next';
    if(stage && stage.id==='P3-P8' && allSingleVowelsComplete())return 'next';
    if(stage && stage.id==='P9-P13' && allInitialsComplete())return 'next';
    if(stage && stage.id==='P14-P18'){try{if(['P9','P10','P11','P12','P13'].every(function(id){return localStorage.getItem('koepandaCompound'+id+'Complete')==='1'}))return 'next'}catch(e){}}
    return stage ? stage.status : 'locked';
  }

  function iconFor(id){
    if(id==='P0-U1')return '🎵'; if(id==='P1')return '🌼'; if(id==='P2')return '🐟';
    if(/^P[3-8]$/.test(id))return '🌳'; if(/^P(9|10|11|12|13)$/.test(id))return '💧';
    if(/^P(14|15|16|17|18)$/.test(id))return '🏠'; if(/^P(19|20|21)$/.test(id))return '⭐'; return '●';
  }

  function targetForUnit(id){
    if(id==='P0-U1')return document.getElementById('p0ToneAdventure');
    if(id==='P1'||id==='P2'){
      var grid=document.getElementById('kidsVowelGrid');
      return grid?grid.closest('.kids-lesson-card'):null;
    }
    if(id==='P3')return document.getElementById('kidsInitialsLesson');
    if(id==='P4')return document.getElementById('kidsInitialsDTNLLesson');
    if(id==='P5')return document.getElementById('kidsInitialsGKHLesson');
    if(id==='P6')return document.getElementById('kidsInitialsJQXLesson');
    if(id==='P7')return document.getElementById('kidsInitialsZHRLesson');
    if(id==='P8')return document.getElementById('kidsInitialsZCSLesson');
    if(id==='P9')return document.getElementById('kidsCompoundAIEIUILesson');
    if(id==='P10')return document.getElementById('kidsCompoundAOOUIULesson');
    if(id==='P11')return document.getElementById('kidsCompoundIEUEERLesson');
    if(id==='P12')return document.getElementById('kidsFrontNasalLesson');
    if(id==='P13')return document.getElementById('kidsBackNasalLesson');
    if(id==='P14')return document.getElementById('kidsWholeSyllableLesson');
    if(id==='P15')return document.getElementById('kidsWholeSyllableP15');
    if(id==='P16')return document.getElementById('kidsTwoSpellingP16');
    if(id==='P18')return document.getElementById('kidsIslandReviewLesson');
    if(id==='P17')return document.getElementById('kidsThreeSpellingLesson');
    if(id==='P19')return document.getElementById('kidsNeutralToneLesson');
    if(id==='P21')return document.getElementById('kidsFinalPinyinExam');
    return null;
  }

  function courseChrome(){
    return {
      map: document.querySelector('.kids-map'),
      intro: document.querySelector('.pinyin-roadmap-intro'),
      note: document.querySelector('.pinyin-roadmap-note'),
      finish: document.getElementById('kidsFinishLesson'),
      finishNote: document.getElementById('kidsFinishNote'),
      head: document.querySelector('.kids-course-head')
    };
  }

  function allLessonCards(){
    return Array.prototype.slice.call(document.querySelectorAll('#kidsCourse > .kids-lesson-card'));
  }

  function setLessonBodiesHidden(){
    allLessonCards().forEach(function(card){ card.hidden=true; card.classList.remove('is-roadmap-lesson-active'); });
    var c=courseChrome();
    if(c.finish)c.finish.hidden=true;
    if(c.finishNote)c.finishNote.hidden=true;
  }

  function showRoadmapChrome(show){
    var c=courseChrome();
    [c.head,c.map,c.intro,root,c.note].forEach(function(el){ if(el)el.hidden=!show; });
  }

  function closeLesson(){
    if(!lessonState)return;
    var target=lessonState.target;
    if(target){
      target.hidden=true; target.classList.remove('is-roadmap-lesson-active');
      if(lessonState.p19PaddingTop!==undefined){if(lessonState.p19PaddingTop)target.style.paddingTop=lessonState.p19PaddingTop;else target.style.removeProperty('padding-top')}
      if(lessonMarker&&lessonMarker.parentNode){ lessonMarker.parentNode.insertBefore(target,lessonMarker); lessonMarker.remove(); }
    }
    lessonMarker=null;
    var lessonBack=document.getElementById('pinyinLessonBack');
    if(lessonBack)lessonBack.remove();var header=document.querySelector('.kp148-lesson-header');if(header)header.remove();
    if(typeof window.koepandaResetVowelGroup==='function')window.koepandaResetVowelGroup();
    window.dispatchEvent(new Event('koepandaP15Close'));
    window.dispatchEvent(new Event('koepandaP16Close'));
    window.dispatchEvent(new Event('koepandaP17Close'));
    window.dispatchEvent(new Event('koepandaP18Stop'));
    showRoadmapChrome(true);
    var y=lessonState.returnY;
    lessonState=null;
    requestAnimationFrame(function(){ window.scrollTo({top:Math.max(0,y),left:0,behavior:'auto'}); });
  }

  function openLesson(unit,button){
    var target=targetForUnit(unit.id);
    if(!target){
      console.error('[Koepanda roadmap] Missing lesson body:',unit.id);
      if(unit.id==='P15')window.alert('整体認読②の読み込みに失敗しました。ページを再読み込みしてください。');
      return false;
    }
    if(lessonState)closeLesson();
    var rect=(button||detail||root).getBoundingClientRect();
    lessonState={target:target,returnY:window.scrollY,returnOffset:rect.top,p19PaddingTop:unit.id==='P19'?target.style.paddingTop:undefined};
    showRoadmapChrome(false);
    setLessonBodiesHidden();

    /* Put the active lesson at the front of the course instead of leaving it
       at its original lower-page position. This makes the transition feel
       like opening one lesson screen, not expanding content behind the map. */
    if(!lessonMarker){
      lessonMarker=document.createComment('koepanda-lesson-origin');
      target.parentNode.insertBefore(lessonMarker,target);
    }
    var courseRoot=document.getElementById('kidsCourse');
    var head=document.querySelector('#kidsCourse > .kids-course-head');
    if(courseRoot){
      if(head&&head.nextSibling)courseRoot.insertBefore(target,head.nextSibling);
      else courseRoot.insertBefore(target,courseRoot.firstChild);
    }
    target.hidden=false;
    target.style.removeProperty('display');
    target.classList.add('is-roadmap-lesson-active');
    /* Do not let any older accordion or hidden-style rule bury an opened P15. */
    if(unit.id==='P15'){
      target.removeAttribute('aria-hidden');
      target.setAttribute('data-roadmap-open','true');
    }
    if(unit.id==='P1'||unit.id==='P2'){
      if(typeof window.koepandaOpenVowelGroup==='function'){
        window.koepandaOpenVowelGroup(unit.lessons||[],unit.title);
      }
    }else if(typeof window.koepandaResetVowelGroup==='function'){
      window.koepandaResetVowelGroup();
    }
    if(unit.id==='P15')window.dispatchEvent(new Event('koepandaP15Open'));
    if(unit.id==='P16')window.dispatchEvent(new Event('koepandaP16Open'));
    if(unit.id==='P17')window.dispatchEvent(new Event('koepandaP17Open'));
    if(unit.id==='P18')window.dispatchEvent(new Event('koepandaP18Reset'));

    var existing=document.getElementById('pinyinLessonBack');
    if(existing)existing.remove();
    var back=document.createElement('button');
    back.type='button'; back.id='pinyinLessonBack'; back.className='pinyin-lesson-back';
    back.textContent='← 戻る　レッスン一覧'; back.addEventListener('click',closeLesson);
    var previousHeader=document.querySelector('.kp148-lesson-header');if(previousHeader)previousHeader.remove();var header=document.createElement('div');header.className='kp148-lesson-header';header.appendChild(back);var lessonName=document.createElement('span');lessonName.className='kp148-lesson-name';lessonName.textContent=unit.title;header.appendChild(lessonName);target.parentNode.insertBefore(header,target);
    requestAnimationFrame(function(){if(unit.id==='P16'){var p16Anchor=target.querySelector('.kp192-title')||target;var p16Header=document.querySelector('.kp148-lesson-header');var p16HeaderBottom=p16Header&&getComputedStyle(p16Header).display!=='none'?p16Header.getBoundingClientRect().bottom:0;var p16Top=window.scrollY+p16Anchor.getBoundingClientRect().top-p16HeaderBottom-12;window.scrollTo({top:Math.max(0,p16Top),left:0,behavior:'auto'});return}if(unit.id==='P17'){var p17Anchor=target;var p17Header=document.querySelector('.kp148-lesson-header');var p17HeaderBottom=p17Header&&getComputedStyle(p17Header).display!=='none'?p17Header.getBoundingClientRect().bottom:0;var p17Top=window.scrollY+p17Anchor.getBoundingClientRect().top-p17HeaderBottom-12;window.scrollTo({top:Math.max(0,p17Top),left:0,behavior:'auto'});return}if(unit.id==='P14'){var p14Anchor=target.querySelector('.kp240-head')||target;var p14Header=document.querySelector('.kp148-lesson-header');var p14HeaderBottom=p14Header&&getComputedStyle(p14Header).display!=='none'?p14Header.getBoundingClientRect().bottom:0;var p14Top=window.scrollY+p14Anchor.getBoundingClientRect().top-p14HeaderBottom-12;window.scrollTo({top:Math.max(0,p14Top),left:0,behavior:'auto'});return}if(unit.id==='P18'){var p18Anchor=target.querySelector('h2')||target;var p18Header=document.querySelector('.kp148-lesson-header');var p18HeaderBottom=p18Header&&getComputedStyle(p18Header).display!=='none'?p18Header.getBoundingClientRect().bottom:0;var p18Top=window.scrollY+p18Anchor.getBoundingClientRect().top-p18HeaderBottom-12;window.scrollTo({top:Math.max(0,p18Top),left:0,behavior:'auto'});return}if(unit.id==='P19'){var p19Anchor=target.querySelector('h2'),p19Header=document.querySelector('.kp148-lesson-header');if(p19Anchor&&p19Header&&getComputedStyle(p19Header).display!=='none'){var p19Gap=12,p19HeaderBottom=p19Header.getBoundingClientRect().bottom,p19HeadingTop=p19Anchor.getBoundingClientRect().top,p19Shortfall=p19HeaderBottom+p19Gap-p19HeadingTop;if(p19Shortfall>0){var p19CurrentPadding=parseFloat(getComputedStyle(target).paddingTop)||0;target.style.paddingTop=(p19CurrentPadding+p19Shortfall)+'px'}}return}if(unit.id==='P1'||unit.id==='P2'){if(typeof window.koepandaPlaceVowelEntry==='function')window.koepandaPlaceVowelEntry(document.getElementById('kidsVowelGrid'));return}var grid=target.querySelector('[id$="LetterGrid"]');if(grid){var y=grid.getBoundingClientRect().top+window.scrollY-58;window.scrollTo({top:Math.max(0,y),left:0,behavior:'auto'})}else back.scrollIntoView({block:'start',behavior:'auto'})});
    return true;
  }

  function unitLocked(unit,stageStatus){
    if(devUnlockEnabled())return false;
    if(unit.id==='P15'||unit.id==='P16')return false;
    if(stageStatus==='locked')return true;
    if(unit.id==='P2'&&typeof window.koepandaIsUnitComplete==='function')return !window.koepandaIsUnitComplete('P1');
    if(unit.id==='P4'){
      try{return localStorage.getItem('koepandaInitialP3Complete')!=='1'}catch(e){return true}
    }
    if(unit.id==='P5'){
      try{return localStorage.getItem('koepandaInitialP4Complete')!=='1'}catch(e){return true}
    }
    if(unit.id==='P6'){try{return localStorage.getItem('koepandaInitialP5Complete')!=='1'}catch(e){return true}}
    if(unit.id==='P7'){try{return localStorage.getItem('koepandaInitialP6Complete')!=='1'}catch(e){return true}}
    if(unit.id==='P8'){try{return localStorage.getItem('koepandaInitialP7Complete')!=='1'}catch(e){return true}}
    if(unit.id==='P10'){try{return localStorage.getItem('koepandaCompoundP9Complete')!=='1'}catch(e){return true}}
    if(unit.id==='P11'){try{return localStorage.getItem('koepandaCompoundP10Complete')!=='1'}catch(e){return true}}
    if(unit.id==='P12'){try{return localStorage.getItem('koepandaCompoundP11Complete')!=='1'}catch(e){return true}}
    /* P14 completion belongs to unitButton, not unitLocked. */
    if(unit.id==='P13'){try{return localStorage.getItem('koepandaCompoundP12Complete')!=='1'}catch(e){return true}}
    if(unit.id==='P15'){try{return localStorage.getItem('koepandaWholeP14Complete')!=='1'}catch(e){return true}}
    return false;
  }

  function unitButton(unit,stageStatus){
    var b=document.createElement('button'); b.type='button'; b.className='pinyin-node'; b.dataset.unitId=unit.id; b.dataset.stageStatus=stageStatus||'';
    var isCurrent=(unit.id==='P0-U1'||unit.id==='P1'||unit.id==='P2');
    var locked=unitLocked(unit,stageStatus),hasBody=!!targetForUnit(unit.id);
    if(isCurrent)b.classList.add('is-current'); if(locked)b.classList.add('is-locked'); if(!locked&&!hasBody)b.classList.add('is-upcoming');
    b.disabled=locked||(!hasBody&&!isCurrent);
    var note=locked&&unit.id==='P2'?'a・o・e をクリアすると開く':(locked&&unit.id==='P4'?'b・p・m・f をクリアすると開く':(locked&&unit.id==='P5'?'d・t・n・l をクリアすると開く':(locked&&unit.id==='P6'?'g・k・h をクリアすると開く':(locked&&unit.id==='P7'?'j・q・x をクリアすると開く':(locked&&unit.id==='P8'?'zh・ch・sh・r をクリアすると開く':(!locked&&!hasBody?'次に学ぶレッスン':(unit.reward?'クリアで「'+unit.reward+'」':'音・口・声調をいっしょに練習')))))));
    if(unit.id==='P5'){try{if(localStorage.getItem('koepandaInitialP5Complete')==='1'){b.classList.add('is-complete');note='クリア！ 舌の奥と息の違いを復習しよう'}}catch(e){}}
    if(unit.id==='P6'){try{if(localStorage.getItem('koepandaInitialP6Complete')==='1'){b.classList.add('is-complete');note='クリア！ 舌の前面と息の違いを復習しよう'}}catch(e){}}
    if(unit.id==='P7'){try{if(localStorage.getItem('koepandaInitialP7Complete')==='1'){b.classList.add('is-complete');note='クリア！ 舌先と息・声の違いを復習しよう'}}catch(e){}}
    if(unit.id==='P8'){try{if(localStorage.getItem('koepandaInitialP8Complete')==='1'){b.classList.add('is-complete');note='クリア！ 歯の裏と息の違いを復習しよう'}}catch(e){}}
    if(unit.id==='P9'){try{if(localStorage.getItem('koepandaCompoundP9Complete')==='1'){b.classList.add('is-complete');note='クリア！ ai・ei・ui のつながりを復習しよう'}}catch(e){}}
    if(unit.id==='P10'){try{if(localStorage.getItem('koepandaCompoundP10Complete')==='1'){b.classList.add('is-complete');note='クリア！ ao・ou・iu のつながりを復習しよう'}else if(locked){note='ai・ei・ui をクリアすると開く'}}catch(e){}}
    if(unit.id==='P11'){try{if(localStorage.getItem('koepandaCompoundP11Complete')==='1'){b.classList.add('is-complete');note='クリア！ ie・üe・er の音色を復習しよう'}else if(locked){note='ao・ou・iu をクリアすると開く'}}catch(e){}}
    if(unit.id==='P12'){try{if(localStorage.getItem('koepandaCompoundP12Complete')==='1'){b.classList.add('is-complete');note='クリア！ 前鼻韻母の音色を復習しよう'}else if(locked){note='ie・üe・er をクリアすると開く'}}catch(e){}}
    if(unit.id==='P14'){try{if(localStorage.getItem('koepandaWholeP14Complete')==='1'){b.classList.add('is-complete');note='クリア！ 7つの音を聞き分けよう'}}catch(e){}}
    if(unit.id==='P15'){try{if(localStorage.getItem('koepandaWholeP15Complete')==='1'){b.classList.add('is-complete');note='クリア！ 9つの音を聞き分けよう'}else if(locked){note='zhi〜si をクリアすると開く'}}catch(e){}}
    if(unit.id==='P13'){try{if(localStorage.getItem('koepandaCompoundP13Complete')==='1'){b.classList.add('is-complete');note='クリア！ 舌の後ろ側と鼻の響きを復習しよう'}else if(locked){note='前鼻韻母をクリアすると開く'}}catch(e){}}
    b.innerHTML='<span class="pinyin-node-icon" aria-hidden="true">'+iconFor(unit.id)+'</span><span class="pinyin-node-copy"><b>'+unit.title+'</b><small>'+note+'</small></span><span class="pinyin-node-go">'+(locked?'🔒':(!hasBody?'○':'›'))+'</span>';
    if(!locked&&hasBody)b.addEventListener('click',function(){openLesson(unit,b)});
    return b;
  }

  function restoreRoadmap(){
    if(!root)return;
    root.classList.remove('is-stage-detail-open');
    detail.hidden=true;
    root.querySelectorAll('.pinyin-world').forEach(function(w){w.hidden=false});
    var target=lastStageId?document.querySelector('.pinyin-world[data-stage-id="'+lastStageId+'"]'):null;
    requestAnimationFrame(function(){
      if(target){
        var y=target.getBoundingClientRect().top+window.scrollY-lastStageTop;
        window.scrollTo({top:Math.max(0,y),left:0,behavior:'auto'});
      }
    });
  }

  function openStage(stage,world,stageStatus){
    lastStageId=stage.id;
    if(root)root.classList.add('is-stage-detail-open');
    lastStageTop=world.getBoundingClientRect().top;
    root.querySelectorAll('.pinyin-world').forEach(function(w){w.hidden=true});
    detail.replaceChildren();
    detail.hidden=false;

    var head=document.createElement('div'); head.className='pinyin-stage-detail-head';
    var back=document.createElement('button'); back.type='button'; back.className='pinyin-stage-back'; back.textContent='← 戻る　学習ロード'; back.addEventListener('click',restoreRoadmap);
    var copy=document.createElement('div'); copy.className='pinyin-stage-detail-copy';
    copy.innerHTML='<span>'+stage.world+'</span><strong>'+stage.title+'</strong><small>'+stage.subtitle+'</small>';
    head.appendChild(back); head.appendChild(copy);

    var path=document.createElement('div'); path.className='pinyin-path pinyin-stage-detail-path';
    stageStatus=stageStatus||effectiveStageStatus(stage);
    stage.units.forEach(function(unit){path.appendChild(unitButton(unit,stageStatus))});
    detail.appendChild(head); detail.appendChild(path);

    if(stageStatus==='locked' && !(stage.units||[]).some(function(u){return u.id==='P15'||u.id==='P16'})){
      var note=document.createElement('div'); note.className='pinyin-stage-locked-note'; note.textContent='🔒 ここは前のステージを進めると開くよ。'; detail.appendChild(note);
    }
    requestAnimationFrame(function(){detail.scrollIntoView({block:'start',behavior:'auto'})});
  }

  function stageCard(stage,index){
    var stageStatus=effectiveStageStatus(stage);
    var world=document.createElement('section');
    world.className='pinyin-world'+(stageStatus==='locked'?' is-locked':'');
    if(index===0)world.classList.add('is-current-route');
    else if(index===1)world.classList.add('is-next-route');
    world.dataset.stageId=stage.id;

    var open=document.createElement('button'); open.type='button'; open.className='pinyin-world-open';
    open.setAttribute('aria-label',stage.title+' を開く');

    var node=document.createElement('span'); node.className='pinyin-route-node';
    node.textContent=stageStatus==='locked'?'🔒':String(index+1);

    var copy=document.createElement('span'); copy.className='pinyin-route-copy';
    var label=document.createElement('span'); label.textContent='LESSON '+(index+1);
    var title=document.createElement('strong'); title.textContent=stage.title;
    var sub=document.createElement('small'); sub.textContent=stage.subtitle;
    copy.appendChild(label); copy.appendChild(title); copy.appendChild(sub);
    if(stageStatus==='locked'){
      var reward=document.createElement('span'); reward.className='pinyin-route-reward'; reward.textContent='🔒 前のレッスンをクリアすると開く'; copy.appendChild(reward);
    }

    open.appendChild(copy); open.appendChild(node);
    open.addEventListener('click',function(){
      var liveStatus=effectiveStageStatus(stage);
      if(liveStatus==='locked' && !(stage.units||[]).some(function(u){return u.id==='P15'||u.id==='P16'}))return;
      if(stage.id==='P0' && stage.units && stage.units.length===1){
        openLesson(stage.units[0],open);
        return;
      }
      openStage(stage,world,liveStatus);
    });
    world.appendChild(open);
    return world;
  }

  function render(){
    root=document.getElementById('pinyinRoadmap'); if(!root)return; root.replaceChildren();
    course.stages.forEach(function(stage,index){root.appendChild(stageCard(stage,index))});
    /* 234: Nine-island status is derived from persisted lesson completion. */
    var map=document.createElement('section');map.className='kp196-archipelago';map.setAttribute('aria-label','9つの島をめぐるピンインコース');
    makeExtraLessons();
    var islandSpecs=[
      {n:1,title:'単韻母',sample:'a · o · e · i · u · ü',unit:'P1'},
      {n:2,title:'声母',sample:'b · p · m · f …',unit:'P3'},
      {n:3,title:'二拼',sample:'声母 ＋ 韻母',unit:'P16'},
      {n:4,title:'三拼',sample:'拼読ステップアップ',unit:'P17'},
      {n:5,title:'整体認読①',sample:'zhi · chi · shi …',unit:'P14'},
      {n:6,title:'整体認読②',sample:'yi · wu · yu …',unit:'P15'},
      {n:7,title:'軽声のひみつ',sample:'短く、軽く、自然に',unit:'P19'},
      {n:8,title:'総合練習',sample:'これまでの音を復習',kind:'practice'},
      {n:9,title:'最終テスト',sample:'ピンインマスターへ！',kind:'exam'}
    ];
    function getUnit(id){var result=null;course.stages.forEach(function(st){(st.units||[]).forEach(function(u){if(u.id===id)result=u})});return result}
    window.koepandaOpenUnitFromVowelOverview=function(id){var unit=getUnit(id);if(!unit)return false;var stage=course.stages.find(function(st){return (st.units||[]).some(function(u){return u.id===id})}),status=stage?effectiveStageStatus(stage):'locked';if(unitLocked(unit,status))return false;var button=root.querySelector('.pinyin-node[data-unit-id="'+id+'"]');return openLesson(unit,button||root)};
    var artwork=document.createElement('div');artwork.className='kp197-artwork';
    var picture=document.createElement('img');picture.src='./assets/pinyin/roadmap-nine-islands-197.webp';picture.alt='';picture.className='kp197-map-image';picture.width=941;picture.height=1672;picture.loading='eager';picture.decoding='async';artwork.appendChild(picture);
    /* Hitboxes follow artwork island centers. Keep targets inside each island, never on connecting bridges. */
    var positions=[
      {x:15,y:5,w:42,h:11},{x:55,y:13,w:41,h:11},
      {x:10,y:23,w:42,h:13},{x:55,y:33,w:42,h:12},
      {x:10,y:43,w:42,h:12},{x:54,y:52,w:43,h:12},
      {x:9,y:62,w:44,h:12},{x:54,y:71,w:43,h:12},
      {x:26,y:83,w:49,h:13}
    ];
    islandSpecs.forEach(function(spec,index){
      var unit=spec.unit?getUnit(spec.unit):null;
      var available=!!((unit&&targetForUnit(unit.id))||(spec.unit&&targetForUnit(spec.unit))||spec.kind==='exam');
      var fallback=spec.kind==='practice'?'練習へ':available?'レッスンへ':'準備中';
      var state=islandComplete(spec.n)?'クリア':fallback;
      var button=document.createElement('button');button.type='button';button.className='kp197-hotspot';
      var loc=positions[index];button.style.left=loc.x+'%';button.style.top=loc.y+'%';button.style.width=loc.w+'%';button.style.height=loc.h+'%';
      button.dataset.island=String(spec.n);button.dataset.islandTitle=spec.title;button.dataset.incompleteLabel=fallback;
      button.setAttribute('aria-label','島'+spec.n+' '+spec.title+' '+state);
      var sr=document.createElement('span');sr.className='kp197-screenreader';sr.textContent=spec.title+' '+state;button.appendChild(sr);
      if(islandComplete(spec.n)){var clear=document.createElement('span');clear.className='kp197-clear';clear.textContent='✓ クリア';clear.setAttribute('aria-hidden','true');button.appendChild(clear)}
      /* The original 197 WebP has NO green clear badges; CSS owns exactly one per completed island. */
      if(available&&spec.kind==='exam'){button.addEventListener('click',function(){openLesson({id:'P21',title:'最終テスト'},button)})}
      else if(spec.n===2){
        /* 240: the consonant island opens the full P3–P8 unit picker, not only b·p·m·f. */
        button.addEventListener('click',function(){
          var stage=course.stages.find(function(item){return item.id==='P3-P8'});
          var world=root.querySelector('.pinyin-world[data-stage-id="P3-P8"]');
          if(!stage)return;
          /* Island 2 has always been an entry point; preserve that access while keeping per-unit progression locks. */
          openStage(stage,world||button,'next');
        });
      }
      else if(spec.n===6){
        /* P15 is already a finished lesson. Resolve its node at CLICK time, not
           during the roadmap render, to avoid a permanently dead sixth island
           when the separately bundled P15 script initializes later. */
        button.disabled=false;button.removeAttribute('aria-disabled');
        button.addEventListener('click',function(){
          try{openLesson({id:'P15',title:'整体認読②'},button)}
          catch(err){console.error('[Koepanda P15 island entry]',err);window.alert('整体認読②を開けませんでした。再読み込みしてください。')}
        });
      }
      else if(available&&spec.kind!=='practice'){button.addEventListener('click',function(){try{openLesson(unit||{id:spec.unit,title:spec.title},button)}catch(err){console.error('Koepanda island '+spec.n,err);alert('レッスンを開けません。もう一度お試しください。')}})}
      else if(spec.kind==='practice'){button.addEventListener('click',function(){openLesson({id:'P18',title:'総合練習'},button)})}
      else{button.disabled=true;button.setAttribute('aria-disabled','true')}
      artwork.appendChild(button);
    });
    map.appendChild(artwork);
    /* P18 is an independent mixed review, not a shortcut back into completed lessons. */
    var review=document.getElementById('kidsIslandReviewLesson');
    if(!review){
      review=document.createElement('section');review.id='kidsIslandReviewLesson';review.className='kids-lesson-card kp198-review kp240-whole';review.hidden=true;
      review.innerHTML='<header class="kp240-head"><span class="kp240-kicker">総合練習 · MIX</span><h2>いろいろな音をまとめて練習</h2><p>整体認読・二拼・三拼・声調・軽声をまぜて聞き分けよう。</p></header><div class="kp18-modes" role="group" aria-label="練習方法"><button type="button" class="kp240-action primary" data-mode="practice" aria-pressed="true">自由練習</button><button type="button" class="kp240-action" data-mode="test" aria-pressed="false">小テスト</button></div><div class="kp240-progress"><span class="kp18-count">1 / 10</span><div class="kp240-track"><i class="kp18-progress"></i></div></div><section class="kp18-question" aria-live="polite"><span class="kp18-category">整体認読</span><p class="kp18-prompt">聞こえた音はどれ？</p><button type="button" class="kp240-action primary kp18-hear">▶ 音を聞く</button></section><div class="kp240-options kp18-options"></div><p class="kp240-status kp18-feedback" role="status" aria-live="polite">音を聞いて、答えを選ぼう。</p><button type="button" class="kp240-action primary kp18-next" disabled>次の問題 →</button>';
      var style=document.createElement('style');style.id='kp198-review-style';style.textContent=`
#kidsCourse > #kidsIslandReviewLesson{box-sizing:border-box;width:min(100%,760px);max-width:760px;margin:0 auto;padding:clamp(16px,4vw,26px) clamp(14px,4vw,24px) 80px!important;color:#385f53;background:#fffdf8;border:1px solid #e2e9dd;border-radius:26px;box-shadow:0 8px 24px rgba(54,91,72,.08);overflow:hidden}
#kidsIslandReviewLesson .kp240-head{margin:0 0 16px}#kidsIslandReviewLesson .kp240-head h2{margin:8px 0 4px;color:#345b50;font-size:clamp(24px,6vw,32px);line-height:1.25;font-weight:900}#kidsIslandReviewLesson .kp240-head p{margin:0;color:#78867e;font-size:14px;line-height:1.6;font-weight:650}
#kidsIslandReviewLesson .kp18-modes{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:12px 0 16px}#kidsIslandReviewLesson .kp18-modes button,#kidsIslandReviewLesson .kp18-next,#kidsIslandReviewLesson .kp18-hear{min-height:50px;border-radius:16px;transition:transform .12s ease,box-shadow .12s ease}#kidsIslandReviewLesson button:active:not(:disabled){transform:translateY(3px);box-shadow:0 1px 0 #dce4d8}
#kidsIslandReviewLesson .kp18-question{display:grid;justify-items:center;gap:10px;margin:12px 0;padding:20px 15px;border:1px solid #e2e9dd;border-radius:22px;background:radial-gradient(ellipse at 50% 15%,#fff 0,#fffdf8 68%,#f7f8ef 100%);box-shadow:0 5px 0 #e8e9dd;text-align:center}
#kidsIslandReviewLesson .kp18-category{display:inline-flex;padding:5px 11px;border-radius:99px;background:#edf3e8;color:#627d65;font-size:13px;font-weight:850}.kp18-prompt{margin:0;color:#345b50;font-size:clamp(19px,5vw,25px);font-weight:900;line-height:1.45}.kp18-hear[hidden]{display:none!important}
#kidsIslandReviewLesson .kp18-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:15px 0 6px}#kidsIslandReviewLesson .kp18-options button{min-height:60px;padding:10px 8px;border:1.5px solid #dce5d8;border-radius:17px;background:#fffefa;color:#456b5a;font-size:clamp(17px,4.5vw,22px);font-weight:900;box-shadow:0 4px 0 #e3e8df;touch-action:manipulation;transition:transform .12s ease,box-shadow .12s ease,border-color .12s ease}#kidsIslandReviewLesson .kp18-options button:disabled{opacity:1}#kidsIslandReviewLesson .kp18-options button.is-correct{border-color:#79b49a;background:#eaf6ee;color:#376d55}#kidsIslandReviewLesson .kp18-options button.is-wrong{border-color:#e4b7bd;background:#fff0f1;color:#9a5964}
#kidsIslandReviewLesson .kp18-feedback{min-height:28px;margin:10px 2px 12px;text-align:center;font-size:15px}#kidsIslandReviewLesson .kp18-next{display:block;width:100%;margin:5px 0 0}#kidsIslandReviewLesson .kp18-next:disabled{opacity:.48;box-shadow:none}
@media(max-width:390px){#kidsIslandReviewLesson .kp18-question{padding:17px 12px}#kidsIslandReviewLesson .kp18-options{gap:8px}#kidsIslandReviewLesson .kp18-options button{min-height:56px}}
@media(prefers-reduced-motion:reduce){#kidsIslandReviewLesson button{transition:none!important}}
`;
      document.head.appendChild(style);
      document.getElementById('kidsCourse').appendChild(review);
      (function initMixedReview(card){
        var bank=[
          {type:'整体認読①',prompt:'聞こえた音はどれ？',audio:'p14-sequence-177/zhi.wav',answer:'zhī',choices:['zhī','chī','shī','rì'],hint:'「zhi」は声母と韻母に分けず、ひとまとまりで聞こう。'},
          {type:'整体認読②',prompt:'聞こえた音はどれ？',audio:'p15-staged-177/yu.wav',answer:'yú',choices:['yī','wǔ','yú','yuè'],hint:'「yu」は整体認読音節。ü の点は y の後で省略するよ。'},
          {type:'二拼',prompt:'声母と韻母がつながった音はどれ？',audio:'p16-sequence/qi.wav',answer:'qī',choices:['qī','bō','jī','xī'],hint:'声母 q と韻母 i をつなげて「qi」。'},
          {type:'二拼',prompt:'声母と韻母がつながった音はどれ？',audio:'p16-sequence/bo.wav',answer:'bō',choices:['pō','bō','mō','fō'],hint:'声母 b と韻母 o をつなげて「bo」。'},
          {type:'三拼',prompt:'三つの音がつながった音節はどれ？',audio:'p17-merged/gua.wav',answer:'guā',choices:['guā','guǒ','gāo','guó'],hint:'声母 g ＋介音 u ＋韻母 a がつながって「guā」。'},
          {type:'三拼',prompt:'三つの音がつながった音節はどれ？',audio:'p17-merged/qiao.wav',answer:'qiáo',choices:['qiāo','qiáo','qiǎo','jiāo'],hint:'声母 q ＋介音 i ＋韻母 ao がつながって「qiáo」。'},
          {type:'四声',prompt:'聞こえた声調は？',audio:'course-134/a1.wav',answer:'第一声',choices:['第一声','第二声','第三声','第四声'],hint:'第一声は高く平らに伸びる音。'},
          {type:'四声',prompt:'聞こえた声調は？',audio:'course-134/a3.wav',answer:'第三声',choices:['第一声','第二声','第三声','第四声'],hint:'第三声は低く下がってから上がる音。'},
          {type:'軽声',prompt:'「妈妈（māma）」の二つ目の ma は？',answer:'軽声',choices:['第一声','第三声','第四声','軽声'],hint:'後ろの ma は短く軽く続く軽声。'},
          {type:'軽声',prompt:'「好吗（hǎo ma）」の ma は？',answer:'軽声',choices:['第二声','第三声','第四声','軽声'],hint:'疑問を表す ma は短く軽い軽声。'}
        ];
        var practice=card.querySelector('[data-mode="practice"]'),test=card.querySelector('[data-mode="test"]'),count=card.querySelector('.kp18-count'),bar=card.querySelector('.kp18-progress'),category=card.querySelector('.kp18-category'),prompt=card.querySelector('.kp18-prompt'),hear=card.querySelector('.kp18-hear'),answers=card.querySelector('.kp18-options'),feedback=card.querySelector('.kp18-feedback'),next=card.querySelector('.kp18-next');
        var mode='practice',session=[],index=0,score=0,answered=false,finished=false,audio=null,token=0;
        function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
        function stop(){token++;if(audio){audio.pause();audio.currentTime=0;audio=null}}
        function play(q){if(!q.audio)return;stop();var t=token;audio=new Audio('./assets/audio/'+q.audio+'?v=10.108.270');audio.preload='auto';audio.playsInline=true;hear.textContent='再生中…';audio.onended=function(){if(t===token){audio=null;hear.textContent='▶ もう一度聞く'}};audio.onerror=function(){if(t===token){audio=null;hear.textContent='▶ 音声をもう一度聞く';feedback.textContent='音声を読み込めませんでした。通信状態を確認してください。'}};var result;try{result=audio.play()}catch(e){result=Promise.reject(e)}if(result&&result.catch)result.catch(function(){if(t===token){audio=null;hear.textContent='▶ タップして音を聞く';feedback.textContent='音声を再生できませんでした。もう一度押してください。'}})}
        function render(){stop();answered=false;finished=false;var q=session[index];count.textContent=(index+1)+' / '+session.length+(mode==='test'?'　正解 '+score+'問':'');bar.style.width=((index+1)/session.length*100)+'%';category.textContent=q.type;prompt.textContent=q.prompt;hear.hidden=!q.audio;hear.textContent='▶ 音を聞く';answers.replaceChildren();shuffle(q.choices.slice()).forEach(function(choice){var b=document.createElement('button');b.type='button';b.textContent=choice;b.addEventListener('click',function(){if(answered)return;answered=true;var correct=choice===q.answer;if(correct)score++;answers.querySelectorAll('button').forEach(function(x){x.disabled=true;if(x.textContent===q.answer)x.classList.add('is-correct');else if(x===b)x.classList.add('is-wrong')});feedback.textContent=correct?'正解！ '+q.hint:(mode==='practice'?'もう一度覚えよう。正解は「'+q.answer+'」。'+q.hint:'回答を記録したよ。');next.disabled=false;if(mode==='test')count.textContent=(index+1)+' / '+session.length+'　正解 '+score+'問'});answers.appendChild(b)});feedback.textContent=q.audio?'音を聞いて、答えを選ぼう。':'問題を読んで、答えを選ぼう。';next.disabled=true;next.textContent=index===session.length-1?(mode==='test'?'結果を見る →':'練習を終える →'):'次の問題 →'}
        function begin(newMode){stop();mode=newMode;practice.classList.toggle('primary',mode==='practice');practice.setAttribute('aria-pressed',String(mode==='practice'));test.classList.toggle('primary',mode==='test');test.setAttribute('aria-pressed',String(mode==='test'));session=shuffle(bank.slice());index=0;score=0;render()}
        practice.addEventListener('click',function(){begin('practice')});test.addEventListener('click',function(){begin('test')});hear.addEventListener('click',function(){if(session[index]&&session[index].audio)play(session[index])});next.addEventListener('click',function(){if(finished){begin(mode);return}if(next.disabled)return;if(index<session.length-1){index++;render();return}stop();finished=true;answers.replaceChildren();hear.hidden=true;bar.style.width='100%';count.textContent=mode==='test'?'テスト結果　'+score+' / '+session.length:'練習完了　10問';category.textContent=mode==='test'?'小テスト結果':'自由練習';prompt.textContent=mode==='test'?(score===session.length?'全問正解！':'よくがんばりました！'):'いろいろな音を練習できたね！';feedback.textContent=mode==='test'?'正解 '+score+' / '+session.length+'問。もう一度挑戦してみよう。':'おつかれさま！小テストで聞き分けを確認しよう。';next.textContent=mode==='test'?'もう一度テスト':'もう一度練習';next.disabled=false});
        window.addEventListener('koepandaP18Reset',function(){begin('practice')});window.addEventListener('koepandaP18Stop',stop);begin('practice');
      })(review);
    }
    root.insertBefore(map,root.firstChild);
    detail=document.createElement('section'); detail.id='pinyinStageDetail'; detail.className='pinyin-stage-detail'; detail.hidden=true; root.appendChild(detail);
    setLessonBodiesHidden();
  }



  /* 198 supplemental learning screens: real entries, not placeholders. */
  function makeExtraLessons(){
    var courseRoot=document.getElementById('kidsCourse');if(!courseRoot)return;
    function make(id,title,lead){
      var el=document.getElementById(id);if(el)return el;
      el=document.createElement('section');el.id=id;el.className='kids-lesson-card kp198-exercise';el.hidden=true;
      var h=document.createElement('h2');h.textContent=title;el.appendChild(h);
      var p=document.createElement('p');p.textContent=lead;el.appendChild(p);
      courseRoot.appendChild(el);return el;
    }
    function question(el,questions,storageKey){
      if(el.querySelector('.kp198-quiz'))return;
      var wrap=document.createElement('div');wrap.className='kp198-quiz';el.appendChild(wrap);
      var prompt=document.createElement('div');prompt.className='kp198-question';wrap.appendChild(prompt);
      var answers=document.createElement('div');answers.className='kp198-answers';wrap.appendChild(answers);
      var feedback=document.createElement('p');feedback.className='kp198-feedback';feedback.setAttribute('aria-live','polite');wrap.appendChild(feedback);
      var score=document.createElement('p');score.className='kp198-score';wrap.appendChild(score);
      var next=document.createElement('button');next.type='button';next.className='kp198-next';next.textContent='次へ →';next.hidden=true;wrap.appendChild(next);
      var index=0,correct=0,answered=false;
      function draw(){
        var q=questions[index];answered=false;prompt.textContent=q.q;feedback.textContent='';next.hidden=true;
        score.textContent=(index+1)+' / '+questions.length;answers.replaceChildren();
        q.a.forEach(function(val,i){var b=document.createElement('button');b.type='button';b.textContent=val;
          b.addEventListener('click',function(){if(answered)return;answered=true;
            if(i===q.ok){correct++;feedback.textContent='正解！ '+(q.note||'')}else{feedback.textContent='もう一度覚えよう。正解：'+q.a[q.ok]+'。 '+(q.note||'')}
            Array.prototype.forEach.call(answers.children,function(x,j){x.disabled=true;if(j===q.ok)x.classList.add('is-answer')});
            next.hidden=false;next.textContent=index===questions.length-1?'結果を見る':'次へ →';
          });answers.appendChild(b)});
      }
      next.addEventListener('click',function(){if(next.dataset.restart==='1'){delete next.dataset.restart;index=0;correct=0;draw();return}if(index<questions.length-1){index++;draw();return}
        prompt.textContent='結果：'+correct+' / '+questions.length;answers.replaceChildren();feedback.textContent=correct===questions.length?'やった！ 全問正解！':'間違えたところをもう一度練習しよう。';score.textContent='';next.textContent='もう一度チャレンジ';next.hidden=false;
        try{if(correct===questions.length&&storageKey)localStorage.setItem(storageKey,'1')}catch(e){}
        next.dataset.restart='1';
      });draw();
    }
    var three=make('kidsThreeSpellingLesson','三拼 · 音をつなごう','声母・介音・韻母を順につなげて、一つの音節を作ろう。');
    three.classList.add('kp223-three-spelling');
    three.querySelectorAll(':scope > h2, :scope > p').forEach(function(el){el.remove()});
    if(!three.querySelector('.kp223-game')){
      var questions=[
        {parts:['g','u','a'],syllable:'guā',word:'瓜',cue:'瓜の「瓜」',audioKey:'gua',durations:[1020,1137,690],options:[{text:'guā',word:'瓜'},{text:'gāo',word:'高'},{text:'guǒ',word:'果'}],ok:0},
        {parts:['h','u','o'],syllable:'huǒ',word:'火',cue:'火の「火」',audioKey:'huo',durations:[1200,1137,400],options:[{text:'hóu',word:'猴'},{text:'huǒ',word:'火'},{text:'hǎo',word:'好'}],ok:1},
        {parts:['j','i','a'],syllable:'jiā',word:'家',cue:'家の「家」',audioKey:'jia',durations:[1137,1137,690],options:[{text:'jiā',word:'家'},{text:'jiǎ',word:'假'},{text:'jiāo',word:'交'}],ok:0},
        {parts:['q','i','ao'],syllable:'qiáo',word:'桥',cue:'橋の「橋」',audioKey:'qiao',durations:[1233,1137,710],options:[{text:'qiáo',word:'桥'},{text:'qiāo',word:'悄'},{text:'qiǎo',word:'巧'}],ok:0}
      ];
      var game=document.createElement('div');game.className='kp223-game';
      game.innerHTML='<div class="kp223-title"><span>三拼 · 三つの音をつなごう</span><h2>三拼・音をつなごう</h2><p>声母・介音・韻母を順につないで、一つの音節にしよう。</p></div><div class="kp223-progress"><span class="kp223-count"></span><div class="kp223-track"><i></i></div></div><details class="kp223-picker"><summary><span>音節をえらぶ</span><strong class="kp223-current-choice"></strong><small><span class="kp223-picker-label">一覧をひらく</span><span class="kp223-chevron" aria-hidden="true">⌄</span></small></summary><div class="kp223-list" aria-label="三拼の音節"></div></details><article class="kp223-lesson"><div class="kp223-practice-core"><div class="kp223-reading"><div><strong class="kp223-syllable"></strong><button type="button" class="kp223-hear" aria-label="お手本を聞く">▶</button></div><p class="kp223-cue"></p><small class="kp223-parts-label"></small><img class="kp223-cue-art" alt=""></div><div class="kp223-hero"><img class="kp223-art" src="./assets/pinyin/lesson-illustrations/p17-three-part-panda.webp" alt="小音が声母、介音、韻母の三つを順につなぐ"><div class="kp223-board" aria-label="三つの音を順につなぐ動き"><strong class="kp223-part kp223-part-1"></strong><strong class="kp223-part kp223-part-2"></strong><strong class="kp223-part kp223-part-3"></strong><strong class="kp223-result"></strong></div></div><p class="kp223-status" role="status" aria-live="polite">音を聞きながら、三つの音のつながりを見よう。</p><div class="kp223-controls"><button type="button" class="kp223-prev">← 前の音</button><button type="button" class="kp223-next-practice">次の音 →</button></div><div class="kp223-actions"><button type="button" class="kp223-record">● 録音する</button><button type="button" class="kp223-replay-record" disabled>▶ 自分の声を聞く</button></div><p class="kp223-record-state" role="status" aria-live="polite"></p><div class="kp223-test-entry"><button type="button" class="kp223-test-go">ミニテストへ →</button></div></div><section class="kp223-test" hidden><div class="kp223-test-head"><span class="kp223-test-label">三拼のミニテスト</span><h3 class="kp223-test-question"></h3></div><button type="button" class="kp223-test-hear">▶ 音を聞く</button><div class="kp223-test-options"></div><p class="kp223-test-feedback" role="status" aria-live="polite"></p><div class="kp223-test-selected" aria-live="polite">選んだ音：？</div><button type="button" class="kp223-test-next" hidden>次へ →</button><button type="button" class="kp223-test-back">練習に戻る</button></section></article>';
      three.appendChild(game);
      var count=game.querySelector('.kp223-count'),progress=game.querySelector('.kp223-track i'),picker=game.querySelector('.kp223-picker'),pickerLabel=game.querySelector('.kp223-picker-label'),currentChoice=game.querySelector('.kp223-current-choice'),list=game.querySelector('.kp223-list'),practice=game.querySelector('.kp223-practice-core'),syllable=game.querySelector('.kp223-syllable'),cue=game.querySelector('.kp223-cue'),partsLabel=game.querySelector('.kp223-parts-label'),cueArt=game.querySelector('.kp223-cue-art'),board=game.querySelector('.kp223-board'),status=game.querySelector('.kp223-status'),hear=game.querySelector('.kp223-hear'),prev=game.querySelector('.kp223-prev'),nextPractice=game.querySelector('.kp223-next-practice'),record=game.querySelector('.kp223-record'),replayRecord=game.querySelector('.kp223-replay-record'),recordState=game.querySelector('.kp223-record-state'),testGo=game.querySelector('.kp223-test-go'),test=game.querySelector('.kp223-test'),testQuestion=game.querySelector('.kp223-test-question'),testHear=game.querySelector('.kp223-test-hear'),testOptions=game.querySelector('.kp223-test-options'),testFeedback=game.querySelector('.kp223-test-feedback'),testSelected=game.querySelector('.kp223-test-selected'),testNext=game.querySelector('.kp223-test-next'),testBack=game.querySelector('.kp223-test-back');
      var current=0,playToken=0,audio=null,timers=[],recordTimer=null,clips={},clipUrls={},recorder=null,stream=null,quiz=[],quizIndex=0,quizScore=0,answered=false,playOwner=null;
      function timer(fn,ms){timers.push(window.setTimeout(fn,ms))}
      function stopPlayback(){playToken++;timers.forEach(function(id){window.clearTimeout(id)});timers=[];if(audio){audio.pause();audio.onended=null;audio.onerror=null;audio=null}playOwner=null;hear.disabled=false;hear.textContent='▶';hear.classList.remove('is-playing');testHear.disabled=false;testHear.textContent='▶ 音を聞く'}
      function stopRecording(){if(recordTimer){window.clearTimeout(recordTimer);recordTimer=null}if(recorder&&recorder.state==='recording')try{recorder.stop()}catch(e){} }
      function audioUrl(q){var url=new URL('/assets/audio/p17-sequence/'+q.audioKey+'.wav',window.location.origin);url.searchParams.set('v','10.108.264');return url.href}
      function setPlaybackState(owner,on){if(owner==='practice'){hear.disabled=on;hear.textContent=on?'再生中…':'▶';hear.classList.toggle('is-playing',on)}else if(owner==='test'){testHear.disabled=on;testHear.textContent=on?'再生中…':'▶ 音を聞く'}}
      function finishPlayback(token,owner){if(token!==playToken)return;audio=null;playOwner=null;setPlaybackState(owner,false)}
      function animate(q,token){var offset=0,labels=['is-part-1','is-part-2','is-part-3'];board.className='kp223-board';q.durations.forEach(function(ms,i){timer(function(){if(token!==playToken)return;board.classList.remove('is-part-1','is-part-2','is-part-3');board.classList.add(labels[i]);status.textContent=['声母「'+q.parts[0]+'」の音を聞こう。','介音「'+q.parts[1]+'」の音を聞こう。','韻母「'+q.parts[2]+'」の音を聞こう。'][i]},offset+45);offset+=ms+170});timer(function(){if(token!==playToken)return;board.classList.remove('is-part-3');board.classList.add('is-complete')},offset+30)}
      function play(q,animatePractice,owner){stopPlayback();var token=playToken;playOwner=owner;setPlaybackState(owner,true);if(animatePractice){status.textContent='声母 → 介音 → 韻母。順番に聞いてみよう。';animate(q,token)}audio=new Audio(audioUrl(q));audio.preload='auto';audio.playsInline=true;audio.onended=function(){if(token!==playToken)return;if(owner==='practice')status.textContent='三つの音がつながった音節「'+q.syllable+'」まで聞けたね。';else testFeedback.textContent='三つの音と拼合音を最後まで再生しました。';board.classList.remove('is-part-1','is-part-2','is-part-3');board.classList.add('is-complete');finishPlayback(token,owner)};audio.onerror=function(){if(token!==playToken)return;if(owner==='practice')status.textContent='三つの音を読み込めませんでした。通信状態を確認してください。';else testFeedback.textContent='三つの音を読み込めませんでした。通信状態を確認してください。';finishPlayback(token,owner)};var promise;try{promise=audio.play()}catch(e){promise=Promise.reject(e)}if(promise&&promise.catch)promise.catch(function(){if(token!==playToken)return;if(owner==='practice')status.textContent='もう一度お手本を聞いてね。';else testFeedback.textContent='もう一度「音を聞く」を押してください。';finishPlayback(token,owner)})}
      function selectPractice(index,autoplay){stopPlayback();if(index<0||index>=questions.length)return;current=index;var q=questions[current];count.textContent=(current+1)+' / '+questions.length;progress.style.width=((current+1)/questions.length*100)+'%';currentChoice.textContent=q.syllable;syllable.textContent=q.syllable;cue.textContent=q.cue;if(cueArt){cueArt.src='./assets/pinyin/p17-illustrations/'+q.audioKey+'.svg?v=10.108.230';cueArt.alt=q.cue+'のイラスト'}partsLabel.textContent='声母 '+q.parts[0]+' ＋ 介音 '+q.parts[1]+' ＋ 韻母 '+q.parts[2];var partEls=board.querySelectorAll('.kp223-part');q.parts.forEach(function(part,i){partEls[i].textContent=part});board.querySelector('.kp223-result').textContent=q.syllable;board.className='kp223-board';status.textContent='音を聞きながら、三つの音のつながりを見よう。';list.querySelectorAll('button').forEach(function(button,i){button.classList.toggle('is-selected',i===current);button.setAttribute('aria-pressed',String(i===current))});prev.disabled=current===0;nextPractice.disabled=current===questions.length-1;replayRecord.disabled=!clips[q.audioKey];recordState.textContent='';if(autoplay)play(q,true,'practice')}
      questions.forEach(function(q,index){var button=document.createElement('button');button.type='button';button.textContent=q.syllable;button.setAttribute('aria-pressed','false');button.addEventListener('click',function(){picker.open=false;selectPractice(index,true)});list.appendChild(button)});
      picker.addEventListener('toggle',function(){pickerLabel.textContent=picker.open?'一覧を閉じる':'一覧をひらく'});
      hear.addEventListener('click',function(){play(questions[current],true,'practice')});prev.addEventListener('click',function(){if(!prev.disabled)selectPractice(current-1,true)});nextPractice.addEventListener('click',function(){if(!nextPractice.disabled)selectPractice(current+1,true)});
      record.addEventListener('click',async function(){if(recorder&&recorder.state==='recording'){stopRecording();return}if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.MediaRecorder){recordState.textContent='この環境では録音できません。';return}stopPlayback();try{stream=await navigator.mediaDevices.getUserMedia({audio:true});var chunks=[],key=questions[current].audioKey;recorder=new MediaRecorder(stream);recorder.ondataavailable=function(event){if(event.data&&event.data.size)chunks.push(event.data)};recorder.onstop=function(){var blob=new Blob(chunks,{type:recorder.mimeType||'audio/webm'});if(clipUrls[key])URL.revokeObjectURL(clipUrls[key]);clipUrls[key]=URL.createObjectURL(blob);clips[key]=clipUrls[key];replayRecord.disabled=false;record.textContent='● 録音する';recordState.textContent='録音できたよ！';if(stream)stream.getTracks().forEach(function(track){track.stop()});stream=null};recorder.start();record.textContent='■ 録音を止める';recordState.textContent='録音中…';recordTimer=window.setTimeout(function(){recordTimer=null;if(recorder&&recorder.state==='recording')stopRecording()},5000)}catch(e){recordState.textContent='マイクの許可を確認してください。'}});
      replayRecord.addEventListener('click',function(){var clip=clips[questions[current].audioKey];if(!clip)return;stopPlayback();audio=new Audio(clip);audio.onended=function(){audio=null};var p;try{p=audio.play()}catch(e){p=Promise.reject(e)}if(p&&p.catch)p.catch(function(){recordState.textContent='録音を再生できません。'})});
      function shuffle(array){for(var i=array.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),temp=array[i];array[i]=array[j];array[j]=temp}return array}
      function askTestQuestion(){answered=false;testHear.hidden=false;var q=quiz[quizIndex];testQuestion.textContent=(quizIndex+1)+' / '+quiz.length+'　聞こえた三拼はどれ？';testFeedback.textContent='';testSelected.textContent='選んだ音：？';testNext.hidden=true;testNext.textContent=quizIndex===quiz.length-1?'結果を見る':'次へ →';testOptions.replaceChildren();var choices=shuffle(q.options.slice());choices.forEach(function(option){var button=document.createElement('button');button.type='button';button.textContent=option.text;button.addEventListener('click',function(){if(answered)return;answered=true;stopPlayback();var correct=option.text===q.syllable;if(correct)quizScore++;testSelected.textContent='選んだ音：'+option.text+'（'+option.word+'）';testFeedback.textContent=correct?'正解！':'もう一度覚えよう。正解は「'+q.syllable+'」（'+q.word+'）だよ。';testOptions.querySelectorAll('button').forEach(function(item){item.disabled=true;if(item.textContent===q.syllable)item.classList.add('is-correct');if(item===button&&!correct)item.classList.add('is-wrong')});testNext.hidden=false});testOptions.appendChild(button)});play(q,false,'test')}
      function hideOldTestReplay(){test.querySelectorAll('.koepanda-result-reopen').forEach(function(button){button.hidden=true})}
      function startTest(){stopPlayback();stopRecording();hideOldTestReplay();delete testNext.dataset.restart;picker.open=false;picker.hidden=true;practice.hidden=true;test.hidden=false;testGo.setAttribute('aria-expanded','true');quiz=shuffle(questions.slice());quizIndex=0;quizScore=0;askTestQuestion();test.scrollIntoView({block:'nearest',behavior:'smooth'})}
      testGo.addEventListener('click',startTest);testHear.addEventListener('click',function(){if(quiz[quizIndex])play(quiz[quizIndex],false,'test')});
      testNext.addEventListener('click',function(){if(testNext.dataset.restart==='1'){delete testNext.dataset.restart;hideOldTestReplay();quiz=shuffle(questions.slice());quizIndex=0;quizScore=0;askTestQuestion();return}quizIndex++;if(quizIndex<quiz.length){askTestQuestion();return}stopPlayback();testQuestion.textContent='ミニテスト結果　'+quizScore+' / '+quiz.length;testOptions.replaceChildren();testFeedback.textContent=quizScore===quiz.length?'全問正解！ 小音も大よろこび！':'よくがんばりました！';testSelected.textContent='';testHear.hidden=true;testNext.hidden=false;testNext.textContent='もう一度テスト';testNext.dataset.restart='1';try{localStorage.setItem('koepandaThreeP17Complete','1')}catch(e){}window.dispatchEvent(new Event('koepandaCompoundProgressChanged'))});
      testBack.addEventListener('click',function(){stopPlayback();test.hidden=true;testHear.hidden=false;picker.hidden=false;practice.hidden=false;testGo.setAttribute('aria-expanded','false');selectPractice(current,false)});
      window.addEventListener('koepandaP17Open',function(){test.hidden=true;picker.hidden=false;practice.hidden=false;testGo.hidden=false;testGo.setAttribute('aria-expanded','false');testNext.hidden=true;delete testNext.dataset.restart;testOptions.replaceChildren();testFeedback.textContent='';testSelected.textContent='選んだ音：？';testHear.hidden=false;hideOldTestReplay();quiz=[];quizIndex=0;quizScore=0;answered=false;selectPractice(0,true)});
      window.addEventListener('koepandaP17Close',function(){stopPlayback();stopRecording();test.hidden=true;picker.hidden=false;practice.hidden=false;testGo.hidden=false;testGo.setAttribute('aria-expanded','false');testNext.hidden=true;delete testNext.dataset.restart;testOptions.replaceChildren();testFeedback.textContent='';testSelected.textContent='選んだ音：？';testHear.hidden=false;hideOldTestReplay();quiz=[];quizIndex=0;quizScore=0;answered=false;selectPractice(0,false)});
      selectPractice(0,false);
    }
    var neutral=make('kidsNeutralToneLesson','軽声のひみつ','軽声は「第五声」ではなく、前の音節に続く短く軽い音。音の高さは前の音節により変わるよ。');
    question(neutral,[
      {q:'「妈妈（māma）」の二つ目の ma は？',a:['第一声','軽声','第四声'],ok:1,note:'短く、軽く発音するよ。'},
      {q:'「爸爸（bàba）」の二つ目の ba は？',a:['軽声','第二声','第三声'],ok:0,note:'bà のあとに自然に続けよう。'},
      {q:'軽声の音の高さは？',a:['常に高い','前の音節によって変わる','必ず低い'],ok:1,note:'第五声として固定しないよ。'},
      {q:'「好吗（hǎo ma）」の ma は？',a:['第三声','第四声','軽声'],ok:2,note:'疑問を表す ma は軽声。'}
    ],'koepandaNeutralP19Complete');
    var exam=make('kidsFinalPinyinExam','最終テスト','これまでの拼音、声調、拼読、軽声をまとめて確認しよう。');
    question(exam,[
      {q:'第三声の基本の動きは？',a:['平ら','下がってから上がる','一気に下がる'],ok:1},
      {q:'「b ＋ a」の拼読は？',a:['ba','pa','ma'],ok:0},
      {q:'「g ＋ u ＋ a」は？',a:['gao','gua','guo'],ok:1},
      {q:'「鱼（yú）」の ü の点は？',a:['y の後で省略','必ず書く','声調による'],ok:0},
      {q:'「妈妈」の二つ目の ma は？',a:['第四声','第一声','軽声'],ok:2},
      {q:'「yi」は？',a:['整体認読音節','単独の声母','声調名'],ok:0}
    ],'koepandaFinalP21Complete');
  }

  function refreshRoadmapLocks(){
    if(!root)return;
    course.stages.forEach(function(stage,index){
      var world=root.querySelector('.pinyin-world[data-stage-id="'+stage.id+'"]');if(!world)return;
      var status=effectiveStageStatus(stage),locked=status==='locked';
      world.classList.toggle('is-locked',locked);
      var node=world.querySelector('.pinyin-route-node');if(node)node.textContent=locked?'🔒':String(index+1);
      var reward=world.querySelector('.pinyin-route-reward');
      if(locked&&!reward){reward=document.createElement('span');reward.className='pinyin-route-reward';reward.textContent='🔒 前のレッスンをクリアすると開く';var copy=world.querySelector('.pinyin-route-copy');if(copy)copy.appendChild(reward)}
      if(!locked&&reward)reward.remove();
    });
  }

  window.addEventListener('koepandaDevModeChanged',function(){
    if(lessonState)return;
    render();
  });


  window.addEventListener('koepandaInitialProgressChanged',function(){
    if(!root)return;
    refreshIslandCompletion();
    refreshRoadmapLocks();
    var world=document.querySelector('.pinyin-world[data-stage-id="'+lastStageId+'"]');
    if(detail && !detail.hidden && (lastStageId==='P3-P8'||lastStageId==='P9-P13') && world){
      var stage=course.stages.find(function(x){return x.id===lastStageId});
      if(stage)openStage(stage,world,effectiveStageStatus(stage));
    }
  });

  window.addEventListener('koepandaVowelProgressChanged',function(){
    refreshIslandCompletion();
    refreshRoadmapLocks();
    if(!detail||detail.hidden)return;
    var p2=detail.querySelector('.pinyin-node[data-unit-id="P2"]');
    if(!p2)return;
    var locked=!(typeof window.koepandaIsUnitComplete==='function'&&window.koepandaIsUnitComplete('P1'));
    p2.disabled=locked;p2.classList.toggle('is-locked',locked);
    var small=p2.querySelector('.pinyin-node-copy small'),go=p2.querySelector('.pinyin-node-go');
    if(small)small.textContent=locked?'a・o・e をクリアすると開く':'クリアで「単韻母クリア」';
    if(go)go.textContent=locked?'🔒':'›';
    if(!locked&&!p2.dataset.bound){p2.dataset.bound='1';var unit=null;course.stages.forEach(function(stage){stage.units.forEach(function(u){if(u.id==='P2')unit=u})});if(unit)p2.addEventListener('click',function(){openLesson(unit,p2)})}
  });

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true}); else render();
})();
