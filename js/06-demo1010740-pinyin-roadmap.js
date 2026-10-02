/* DEMO 10.107.56 — compact chapter roadmap + dedicated chapter detail view.
   Unit buttons are no longer laid out permanently on the main roadmap.
   Open a chapter to reveal its units; Back restores the exact chapter position. */
(function(){
  var course=window.KOEPANDA_PINYIN_COURSE;
  if(!course)return;
  var root=null, detail=null, lastStageId=null, lastStageTop=0;

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

  function openLesson(unit){
    var target=targetForUnit(unit.id);
    if(!target)return;
    requestAnimationFrame(function(){target.scrollIntoView({behavior:'smooth',block:'start'})});
  }

  function unitButton(unit,stageStatus){
    var b=document.createElement('button'); b.type='button'; b.className='pinyin-node';
    var isCurrent=(unit.id==='P0-U1'||unit.id==='P1'||unit.id==='P2');
    var locked=(stageStatus==='locked');
    if(isCurrent)b.classList.add('is-current'); if(locked)b.classList.add('is-locked');
    b.disabled=locked;
    b.innerHTML='<span class="pinyin-node-icon" aria-hidden="true">'+iconFor(unit.id)+'</span><span class="pinyin-node-copy"><b>'+unit.title+'</b><small>'+(unit.reward?'クリアで「'+unit.reward+'」':'音・口・声調をいっしょに練習')+'</small></span><span class="pinyin-node-go">'+(locked?'🔒':'›')+'</span>';
    if(!locked)b.addEventListener('click',function(){openLesson(unit)});
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
    var back=document.createElement('button'); back.type='button'; back.className='pinyin-stage-back'; back.textContent='← 学習ロード'; back.addEventListener('click',restoreRoadmap);
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
    open.innerHTML='<span class="pinyin-world-copy"><span>'+stage.world+'</span><strong>'+stage.title+'</strong><small>'+stage.subtitle+'</small></span><span class="pinyin-world-open-state"><span class="pinyin-world-unit-count">'+stage.units.length+' レッスン</span><b>'+(stage.status==='locked'?'🔒':'›')+'</b></span>';
    open.addEventListener('click',function(){openStage(stage,world)});
    world.appendChild(open);
    return world;
  }

  function render(){
    root=document.getElementById('pinyinRoadmap'); if(!root)return; root.replaceChildren();
    course.stages.forEach(function(stage){root.appendChild(stageCard(stage))});
    detail=document.createElement('section'); detail.id='pinyinStageDetail'; detail.className='pinyin-stage-detail'; detail.hidden=true; root.appendChild(detail);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true}); else render();
})();
