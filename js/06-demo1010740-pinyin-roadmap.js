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
    if(!target)return;
    var rect=(button||detail).getBoundingClientRect();
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
    target.classList.add('is-roadmap-lesson-active');
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
    requestAnimationFrame(function(){if(unit.id==='P1'||unit.id==='P2'){window.koepandaPlaceVowelEntry(document.getElementById('kidsVowelGrid'));return}var grid=target.querySelector('[id$="LetterGrid"]');if(grid){var y=grid.getBoundingClientRect().top+window.scrollY-58;window.scrollTo({top:Math.max(0,y),left:0,behavior:'auto'})}else back.scrollIntoView({block:'start',behavior:'auto'})});
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
    /* 193: real illustrated route asset with actual course-action hit targets. */
    var picture=document.createElement('div'); picture.className='kp193-map';
    picture.setAttribute('aria-label','イラストの学習ルート');
    var artwork=document.createElement('img');artwork.src='./assets/pinyin/roadmap-islands-194.webp';artwork.alt='小音とめぐるピンイン学習ルート';artwork.decoding='async';picture.appendChild(artwork);
    [{unit:'P1',y:13.9,x:35,w:37},{unit:'P3',y:24.5,x:76,w:41},{unit:'P16',y:37.0,x:46,w:43},{unit:'P17',y:50.7,x:74,w:44},{unit:'P14',y:62.9,x:29,w:43},{unit:'P15',y:76.3,x:79,w:40},{unit:'P19',y:89.2,x:54,w:45}].forEach(function(spec){
      var u=null,st=null;course.stages.forEach(function(stage){stage.units.forEach(function(item){if(item.id===spec.unit){u=item;st=stage;}})});if(!u)return;
      var b=document.createElement('button');b.type='button';b.className='kp193-hit';b.style.top=spec.y+'%';b.style.left=spec.x+'%';b.style.width=spec.w+'%';b.setAttribute('aria-label',u.title+' を開く');b.title=u.title;
      b.setAttribute('aria-disabled','false')
      b.addEventListener('click',function(){if(targetForUnit(u.id))openLesson(u,b);else { b.title='このレッスンは準備中です'; }});picture.appendChild(b);
    });
    root.insertBefore(picture,root.firstChild);
    detail=document.createElement('section'); detail.id='pinyinStageDetail'; detail.className='pinyin-stage-detail'; detail.hidden=true; root.appendChild(detail);
    setLessonBodiesHidden();
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
