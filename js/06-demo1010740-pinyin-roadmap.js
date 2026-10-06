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

  function effectiveStageStatus(stage){
    if(devUnlockEnabled())return 'next';
    if(stage && stage.id==='P3-P8' && allSingleVowelsComplete())return 'next';
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
    if(lessonBack)lessonBack.remove();
    if(typeof window.koepandaResetVowelGroup==='function')window.koepandaResetVowelGroup();
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

    var existing=document.getElementById('pinyinLessonBack');
    if(existing)existing.remove();
    var back=document.createElement('button');
    back.type='button'; back.id='pinyinLessonBack'; back.className='pinyin-lesson-back';
    back.textContent='← 戻る　レッスン一覧'; back.addEventListener('click',closeLesson);
    target.parentNode.insertBefore(back,target);
    requestAnimationFrame(function(){ back.scrollIntoView({block:'start',behavior:'auto'}); });
  }

  function unitLocked(unit,stageStatus){
    if(devUnlockEnabled())return false;
    if(stageStatus==='locked')return true;
    if(unit.id==='P2'&&typeof window.koepandaIsUnitComplete==='function')return !window.koepandaIsUnitComplete('P1');
    if(unit.id==='P4'){
      try{return localStorage.getItem('koepandaInitialP3Complete')!=='1'}catch(e){return true}
    }
    if(/^P[5-8]$/.test(unit.id))return true;
    return false;
  }

  function unitButton(unit,stageStatus){
    var b=document.createElement('button'); b.type='button'; b.className='pinyin-node'; b.dataset.unitId=unit.id; b.dataset.stageStatus=stageStatus||'';
    var isCurrent=(unit.id==='P0-U1'||unit.id==='P1'||unit.id==='P2');
    var locked=unitLocked(unit,stageStatus),hasBody=!!targetForUnit(unit.id);
    if(isCurrent)b.classList.add('is-current'); if(locked)b.classList.add('is-locked'); if(!locked&&!hasBody)b.classList.add('is-upcoming');
    b.disabled=locked||(!hasBody&&!isCurrent);
    var note=locked&&unit.id==='P2'?'a・o・e をクリアすると開く':(!locked&&!hasBody?'次に学ぶレッスン':(unit.reward?'クリアで「'+unit.reward+'」':'音・口・声調をいっしょに練習'));
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

    if(stageStatus==='locked'){
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
      if(liveStatus==='locked')return;
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
