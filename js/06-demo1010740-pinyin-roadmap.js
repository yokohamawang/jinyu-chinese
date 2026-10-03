/* DEMO 10.107.71 — direct P0 entry + true layered lesson navigation + lesson unlocks.
   Chapter list, unit list, and lesson body never remain visually stacked.
   Vowel units open only their own 3-vowel group. Back controls are compact and non-obstructive. */
(function(){
  var course=window.KOEPANDA_PINYIN_COURSE;
  if(!course)return;
  var root=null, detail=null;
  var lastStageId=null, lastStageTop=0;
  var lessonState=null;
  var lessonMarker=null;

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
    if(stageStatus==='locked')return true;
    if(unit.id==='P2'&&typeof window.koepandaIsUnitComplete==='function')return !window.koepandaIsUnitComplete('P1');
    return false;
  }

  function unitButton(unit,stageStatus){
    var b=document.createElement('button'); b.type='button'; b.className='pinyin-node'; b.dataset.unitId=unit.id; b.dataset.stageStatus=stageStatus||'';
    var isCurrent=(unit.id==='P0-U1'||unit.id==='P1'||unit.id==='P2');
    var locked=unitLocked(unit,stageStatus);
    if(isCurrent)b.classList.add('is-current'); if(locked)b.classList.add('is-locked');
    b.disabled=locked;
    b.innerHTML='<span class="pinyin-node-icon" aria-hidden="true">'+iconFor(unit.id)+'</span><span class="pinyin-node-copy"><b>'+unit.title+'</b><small>'+(locked&&unit.id==='P2'?'a・o・e をクリアすると開く':(unit.reward?'クリアで「'+unit.reward+'」':'音・口・声調をいっしょに練習'))+'</small></span><span class="pinyin-node-go">'+(locked?'🔒':'›')+'</span>';
    if(!locked)b.addEventListener('click',function(){openLesson(unit,b)});
    return b;
  }

  function restoreRoadmap(){
    if(!root)return;
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

  function openStage(stage,world){
    lastStageId=stage.id;
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
    stage.units.forEach(function(unit){path.appendChild(unitButton(unit,stage.status))});
    detail.appendChild(head); detail.appendChild(path);

    if(stage.status==='locked'){
      var note=document.createElement('div'); note.className='pinyin-stage-locked-note'; note.textContent='🔒 ここは前のステージを進めると開くよ。'; detail.appendChild(note);
    }
    requestAnimationFrame(function(){detail.scrollIntoView({block:'start',behavior:'auto'})});
  }

  function stageCard(stage){
    var world=document.createElement('section');
    world.className='pinyin-world pinyin-world-compact'+(stage.status==='locked'?' is-locked':'');
    world.dataset.stageId=stage.id;
    var open=document.createElement('button'); open.type='button'; open.className='pinyin-world-open';
    open.setAttribute('aria-label',stage.title+' を開く');
    open.innerHTML='<span class="pinyin-world-copy"><span>'+stage.world+'</span><strong>'+stage.title+'</strong><small>'+stage.subtitle+'</small></span><span class="pinyin-world-open-state"><span class="pinyin-world-unit-count">'+(stage.id==='P0'?'すぐ体験':stage.units.length+' レッスン')+'</span><b>'+(stage.status==='locked'?'🔒':'›')+'</b></span>';
    open.addEventListener('click',function(){
      /* P0 is only an introduction to the four tones, so avoid a redundant one-item unit screen. */
      if(stage.id==='P0' && stage.units && stage.units.length===1){
        openLesson(stage.units[0],open);
        return;
      }
      openStage(stage,world);
    });
    world.appendChild(open);
    return world;
  }

  function render(){
    root=document.getElementById('pinyinRoadmap'); if(!root)return; root.replaceChildren();
    course.stages.forEach(function(stage){root.appendChild(stageCard(stage))});
    detail=document.createElement('section'); detail.id='pinyinStageDetail'; detail.className='pinyin-stage-detail'; detail.hidden=true; root.appendChild(detail);
    setLessonBodiesHidden();
  }


  window.addEventListener('koepandaVowelProgressChanged',function(){
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
