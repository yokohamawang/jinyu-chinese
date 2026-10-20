/* DEMO 10.108.10 — dynamic roadmap unlock after all six single vowels are mastered.
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
      if(lessonMarker&&lessonMarker.parentNode){ lessonMarker.parentNode.insertBefore(target,lessonMarker); lessonMarker.remove(); }
    }
    lessonMarker=null;
    var lessonBack=document.getElementById('pinyinLessonBack');
    if(lessonBack)lessonBack.remove();var header=document.querySelector('.kp148-lesson-header');if(header)header.remove();
    if(typeof window.koepandaResetVowelGroup==='function')window.koepandaResetVowelGroup();
    window.dispatchEvent(new Event('koepandaP15Close'));
    window.dispatchEvent(new Event('koepandaP16Close'));
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
    lessonState={target:target,returnY:window.scrollY,returnOffset:rect.top};
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

    var existing=document.getElementById('pinyinLessonBack');
    if(existing)existing.remove();
    var back=document.createElement('button');
    back.type='button'; back.id='pinyinLessonBack'; back.className='pinyin-lesson-back';
    back.textContent='← 戻る　レッスン一覧'; back.addEventListener('click',closeLesson);
    var previousHeader=document.querySelector('.kp148-lesson-header');if(previousHeader)previousHeader.remove();var header=document.createElement('div');header.className='kp148-lesson-header';header.appendChild(back);var lessonName=document.createElement('span');lessonName.className='kp148-lesson-name';lessonName.textContent=unit.title;header.appendChild(lessonName);target.parentNode.insertBefore(header,target);
    requestAnimationFrame(function(){if(unit.id==='P16'){var p16Anchor=target.querySelector('.kp192-title')||target;var p16Header=document.querySelector('.kp148-lesson-header');var p16HeaderBottom=p16Header&&getComputedStyle(p16Header).display!=='none'?p16Header.getBoundingClientRect().bottom:0;var p16Top=window.scrollY+p16Anchor.getBoundingClientRect().top-p16HeaderBottom-12;window.scrollTo({top:Math.max(0,p16Top),left:0,behavior:'auto'});return}if(unit.id==='P17'){var p17Anchor=target;var p17Header=document.querySelector('.kp148-lesson-header');var p17HeaderBottom=p17Header&&getComputedStyle(p17Header).display!=='none'?p17Header.getBoundingClientRect().bottom:0;var p17Top=window.scrollY+p17Anchor.getBoundingClientRect().top-p17HeaderBottom-12;window.scrollTo({top:Math.max(0,p17Top),left:0,behavior:'auto'});return}if(unit.id==='P1'||unit.id==='P2'){if(typeof window.koepandaPlaceVowelEntry==='function')window.koepandaPlaceVowelEntry(document.getElementById('kidsVowelGrid'));return}var grid=target.querySelector('[id$="LetterGrid"]');if(grid){var y=grid.getBoundingClientRect().top+window.scrollY-58;window.scrollTo({top:Math.max(0,y),left:0,behavior:'auto'})}else back.scrollIntoView({block:'start',behavior:'auto'})});
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
    /* 197: Nine-island illustration with DOM hit targets and fixed clear states. */
    var map=document.createElement('section');map.className='kp196-archipelago';map.setAttribute('aria-label','9つの島をめぐるピンインコース');
    makeExtraLessons();
    var islandSpecs=[
      {n:1,title:'単韻母',sample:'a · o · e · i · u · ü',unit:'P1',done:true},
      {n:2,title:'声母',sample:'b · p · m · f …',unit:'P3',done:true},
      {n:3,title:'二拼',sample:'声母 ＋ 韻母',unit:'P16'},
      {n:4,title:'三拼',sample:'拼読ステップアップ',unit:'P17'},
      {n:5,title:'整体認読①',sample:'zhi · chi · shi …',unit:'P14'},
      {n:6,title:'整体認読②',sample:'yi · wu · yu …',unit:'P15'},
      {n:7,title:'軽声のひみつ',sample:'短く、軽く、自然に',unit:'P19'},
      {n:8,title:'総合練習',sample:'これまでの音を復習',kind:'practice'},
      {n:9,title:'最終テスト',sample:'ピンインマスターへ！',kind:'exam'}
    ];
    function getUnit(id){var result=null;course.stages.forEach(function(st){(st.units||[]).forEach(function(u){if(u.id===id)result=u})});return result}
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
      var state=spec.done?'クリア':spec.kind==='practice'?'練習へ':available?'レッスンへ':'準備中';
      var button=document.createElement('button');button.type='button';button.className='kp197-hotspot';
      var loc=positions[index];button.style.left=loc.x+'%';button.style.top=loc.y+'%';button.style.width=loc.w+'%';button.style.height=loc.h+'%';
      button.dataset.island=String(spec.n);
      button.setAttribute('aria-label','島'+spec.n+' '+spec.title+' '+state);
      var sr=document.createElement('span');sr.className='kp197-screenreader';sr.textContent=spec.title+' '+state;button.appendChild(sr);
      if(spec.done){var clear=document.createElement('span');clear.className='kp197-clear';clear.textContent='✓ クリア';clear.setAttribute('aria-hidden','true');button.appendChild(clear)}
      /* The original 197 WebP has NO green clear badges; CSS owns exactly one per completed island. */
      if(available&&spec.kind==='exam'){button.addEventListener('click',function(){openLesson({id:'P21',title:'最終テスト'},button)})}
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
    /* 198: review is a standalone lesson screen (not content opening below the map). */
    var review=document.getElementById('kidsIslandReviewLesson');
    if(!review){
      review=document.createElement('section');review.id='kidsIslandReviewLesson';review.className='kids-lesson-card kp198-review';review.hidden=true;
      var heading=document.createElement('h2');heading.textContent='総合練習';review.appendChild(heading);
      var intro=document.createElement('p');intro.textContent='学んだ音をもう一度練習しよう。';review.appendChild(intro);
      var options=document.createElement('div');options.className='kp198-review-choices';review.appendChild(options);
      [{id:'P14',title:'整体認読①'},{id:'P15',title:'整体認読②'},{id:'P16',title:'二拼'}].forEach(function(item){
        var u=getUnit(item.id);if(!u||!targetForUnit(item.id))return;
        var btn=document.createElement('button');btn.type='button';btn.textContent=item.title+' →';
        btn.addEventListener('click',function(){closeLesson();openLesson(u,btn)});options.appendChild(btn);
      });
      document.getElementById('kidsCourse').appendChild(review);
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
    three.classList.add('kp202-three-spelling');
    if(!three.querySelector('.kp202-three-game')){
      var questions=[
        {parts:['g','u','a'],syllable:'guā',word:'瓜',audioKey:'gua',durations:[1020,1137,690],sample:['ge1','wu1','a1'],options:[{text:'guā',word:'瓜'},{text:'gāo',word:'高'},{text:'guǒ',word:'果'}],ok:0},
        {parts:['h','u','o'],syllable:'huǒ',word:'火',audioKey:'huo',durations:[1200,1137,400],sample:['he1','wu1','o1'],options:[{text:'hóu',word:'猴'},{text:'huǒ',word:'火'},{text:'hǎo',word:'好'}],ok:1},
        {parts:['j','i','a'],syllable:'jiā',word:'家',audioKey:'jia',durations:[1137,1137,690],sample:['ji1','yi1','a1'],options:[{text:'jiā',word:'家'},{text:'jiǎ',word:'假'},{text:'jiāo',word:'交'}],ok:0},
        {parts:['q','i','ao'],syllable:'qiáo',word:'桥',audioKey:'qiao',durations:[1233,1137,710],sample:['qi1','yi1','ao1'],options:[{text:'qiáo',word:'桥'},{text:'qiāo',word:'悄'},{text:'qiǎo',word:'巧'}],ok:0}
      ];
      var game=document.createElement('div');game.className='kp202-three-game';
      game.innerHTML='<div class="kp202-board-hero"><img class="kp203-three-art" src="./assets/pinyin/lesson-illustrations/p17-three-part-panda.webp" alt="小音把三个木牌音块连成一个音节"><div class="kp202-blend-board" aria-label="声母、介音、韵母拼合板"><span></span><span></span><span></span><strong></strong></div></div><div class="kp202-step-label">小音陪你一步一步读</div><div class="kp202-three-count" aria-live="polite"></div><div class="kp202-question"></div><div class="kp202-three-tip" aria-live="polite">声母、介音、韵母，三步连成一个音节。</div><button type="button" class="kp202-sound">▶ 三つの音を聞く</button><div class="kp202-three-answers"></div><button type="button" class="kp202-next" hidden>次へ →</button>';
      three.appendChild(game);
      var count=game.querySelector('.kp202-three-count'),prompt=game.querySelector('.kp202-question'),board=game.querySelector('.kp202-blend-board'),tip=game.querySelector('.kp202-three-tip'),answers=game.querySelector('.kp202-three-answers'),sound=game.querySelector('.kp202-sound'),next=game.querySelector('.kp202-next'),idx=0,score=0,answered=false,finished=false,steps=[],audio=null,playToken=0,playing=false,currentSelected=-1;
      function updateNext(){next.disabled=finished?false:(currentSelected<0||playing)}
      function stopPlayback(){playToken++;steps.forEach(function(t){window.clearTimeout(t)});steps=[];if(audio){audio.pause();audio.onended=null;audio.onerror=null;audio=null}playing=false;sound.disabled=false;sound.textContent='▶ 三つの音を聞く';}
      function finishPlayback(token){if(token!==playToken)return;playing=false;audio=null;sound.disabled=false;sound.textContent='▶ 三つの音を聞く';updateNext()}
      function playMergedResult(q,token){if(token!==playToken)return;if(!audio||!q.resultAudioUrl){tip.textContent='拼合した音声を準備できませんでした。通信状態を確認して、ページを開き直してください。';finishPlayback(token);return}tip.textContent='三つの音がつながって「'+q.syllable+'」。'+q.word+' の音を聞こう。';audio.onended=function(){finishPlayback(token)};audio.onerror=function(){if(token!==playToken)return;tip.textContent='拼合した音声を再生できませんでした。もう一度「三つの音を聞く」を押してください。';finishPlayback(token)};audio.src=q.resultAudioUrl;try{audio.currentTime=0}catch(e){}var p;try{p=audio.play()}catch(e){p=Promise.reject(e)}if(p&&p.catch)p.catch(function(){if(token!==playToken)return;tip.textContent='拼合した音声を再生できませんでした。もう一度「三つの音を聞く」を押してください。';finishPlayback(token)})}
      function animate(q,token){var offset=0,labels=['is-part-1','is-part-2','is-part-3'];board.className='kp202-blend-board';q.durations.forEach(function(ms,i){steps.push(window.setTimeout(function(){if(token!==playToken)return;board.classList.remove('is-part-1','is-part-2','is-part-3');board.classList.add(labels[i]);tip.textContent=['声母「'+q.parts[0]+'」の見本を聞こう。','介音「'+q.parts[1]+'」の見本を聞こう。','韻母「'+q.parts[2]+'」の見本を聞こう。'][i]},offset+45));offset+=ms+170});steps.push(window.setTimeout(function(){if(token!==playToken)return;board.classList.remove('is-part-3');board.classList.add('is-whole');tip.textContent='三つの音がつながって「'+q.syllable+'」。'+q.word+' の音だよ。'},offset+30))}
      function play(q){if(!q.resultAudioUrl){tip.textContent='拼合した音声を準備中です。少し待ってからもう一度押してください。';return}stopPlayback();var token=playToken;playing=true;sound.disabled=true;sound.textContent='▶ 再生中…';updateNext();var audioUrl=new URL('/assets/audio/p17-sequence/'+q.audioKey+'.wav',window.location.origin);audioUrl.searchParams.set('v','10.108.220');audio=new Audio(audioUrl.href);audio.preload='auto';audio.playsInline=true;tip.textContent='声母 → 介音 → 韻母。順番に聞いてみよう。';animate(q,token);audio.onended=function(){playMergedResult(q,token)};audio.onerror=function(){if(token!==playToken)return;tip.textContent='三つの音を読み込めませんでした。通信状態を確認してください。';finishPlayback(token)};var promise=audio.play();if(promise&&promise.catch)promise.catch(function(){if(token===playToken){tip.textContent='三つの音を再生できませんでした。もう一度「三つの音を聞く」を押してください。';finishPlayback(token)}})}
      function draw(){stopPlayback();var q=questions[idx];currentSelected=-1;answered=false;finished=false;count.textContent=(idx+1)+' / '+questions.length;prompt.textContent='この三つの音をつなぐと？';var spans=board.querySelectorAll('span');q.parts.forEach(function(x,i){spans[i].textContent=x});board.querySelector('strong').textContent=q.syllable;board.className='kp202-blend-board';tip.textContent='声母 → 介音 → 韻母。三つをつないでみよう。';next.hidden=false;next.textContent=idx===questions.length-1?'結果を見る':'次へ →';answers.replaceChildren();q.options.forEach(function(option,i){var b=document.createElement('button');b.type='button';b.textContent=option.text;b.setAttribute('aria-pressed','false');b.addEventListener('click',function(){currentSelected=i;answers.querySelectorAll('button').forEach(function(x,j){x.classList.toggle('is-selected',j===i);x.setAttribute('aria-pressed',String(j===i))});tip.textContent=i===q.ok?'正解！ '+q.syllable+' は「'+q.word+'」の音だよ。':'選び直せるよ。もう一度三つの音を聞いてみよう。';updateNext()});answers.appendChild(b)});sound.disabled=true;sound.textContent='拼合音声を準備中…';if(typeof window.koepandaWarmP17Speech==='function'){window.koepandaWarmP17Speech(q.word).then(function(url){if(idx!==questions.indexOf(q))return;if(url){q.resultAudioUrl=url;sound.disabled=false;sound.textContent='▶ 三つの音を聞く';tip.textContent='声母 → 介音 → 韻母。三つをつないでみよう。'}else{sound.disabled=false;sound.textContent='▶ 音声を再準備';tip.textContent='拼合音声を準備できませんでした。ボタンを押して再試行してください。'}}).catch(function(){if(idx!==questions.indexOf(q))return;sound.disabled=false;sound.textContent='▶ 音声を再準備';tip.textContent='拼合音声を準備できませんでした。ボタンを押して再試行してください。'})}else{sound.disabled=false;sound.textContent='▶ 音声を再準備';tip.textContent='音声機能を読み込めませんでした。ページを開き直してください。'}updateNext()}
      sound.addEventListener('click',function(){var q=questions[idx];if(!q.resultAudioUrl&&typeof window.koepandaWarmP17Speech==='function'){sound.disabled=true;sound.textContent='拼合音声を準備中…';window.koepandaWarmP17Speech(q.word).then(function(url){if(idx!==questions.indexOf(q))return;if(url){q.resultAudioUrl=url;sound.disabled=false;sound.textContent='▶ 三つの音を聞く';play(q)}else{sound.disabled=false;sound.textContent='▶ 音声を再準備';tip.textContent='拼合音声を準備できませんでした。もう一度押してください。'}}).catch(function(){if(idx!==questions.indexOf(q))return;sound.disabled=false;sound.textContent='▶ 音声を再準備';tip.textContent='拼合音声を準備できませんでした。もう一度押してください。'});return}play(q)});
      next.addEventListener('click',function(){if(next.disabled)return;if(finished){idx=0;score=0;draw();return}if(currentSelected<0||playing)return;if(currentSelected===questions[idx].ok)score++;if(idx<questions.length-1){idx++;draw();return}finished=true;stopPlayback();count.textContent='練習完了 · '+score+' / '+questions.length;prompt.textContent=score===questions.length?'ぜんぶできたね！':'もう一度ゆっくり練習しよう。';board.classList.add('is-whole');answers.replaceChildren();tip.textContent=score===questions.length?'小音といっしょに、よくできました。':'音をつなぐ順番を思い出して再挑戦しよう。';next.textContent='もう一度練習';next.disabled=false;sound.disabled=true;if(score===questions.length){try{localStorage.setItem('koepandaThreeP17Complete','1')}catch(e){}window.dispatchEvent(new Event('koepandaCompoundProgressChanged'))}});
      draw();
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
    refreshRoadmapLocks();
    var world=document.querySelector('.pinyin-world[data-stage-id="'+lastStageId+'"]');
    if(detail && !detail.hidden && (lastStageId==='P3-P8'||lastStageId==='P9-P13') && world){
      var stage=course.stages.find(function(x){return x.id===lastStageId});
      if(stage)openStage(stage,world,effectiveStageStatus(stage));
    }
  });

  window.addEventListener('koepandaVowelProgressChanged',function(){
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
