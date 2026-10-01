/* DEMO 10.107.40 — roadmap renderer. Existing audio/recording logic untouched. */
(function(){
  var course=window.KOEPANDA_PINYIN_COURSE;
  if(!course)return;
  function iconFor(id){
    if(id==='P0-U1')return '🎵'; if(id==='P1')return '🌼'; if(id==='P2')return '🐟';
    if(/^P[3-8]$/.test(id))return '🌳'; if(/^P(9|10|11|12|13)$/.test(id))return '💧';
    if(/^P(14|15|16|17|18)$/.test(id))return '🏠'; if(/^P(19|20|21)$/.test(id))return '⭐'; return '●';
  }
  function unitButton(unit,stageStatus,index){
    var b=document.createElement('button'); b.type='button'; b.className='pinyin-node';
    var isCurrent=(unit.id==='P0-U1'||unit.id==='P1');
    var locked=(stageStatus==='locked');
    if(isCurrent)b.classList.add('is-current'); if(locked)b.classList.add('is-locked');
    b.disabled=locked;
    b.innerHTML='<span class="pinyin-node-icon" aria-hidden="true">'+iconFor(unit.id)+'</span><span class="pinyin-node-copy"><b>'+unit.title+'</b><small>'+(unit.reward?'クリアで「'+unit.reward+'」':'音・口・声調をいっしょに練習')+'</small></span><span class="pinyin-node-go">'+(locked?'🔒':'›')+'</span>';
    if(!locked){
      b.addEventListener('click',function(){
        if(unit.id==='P0-U1'||unit.id==='P1'){
          var first=document.querySelector('.kids-lesson-card');
          if(first)first.scrollIntoView({behavior:'smooth',block:'start'});
        }
      });
    }
    return b;
  }
  function render(){
    var root=document.getElementById('pinyinRoadmap'); if(!root)return; root.replaceChildren();
    course.stages.forEach(function(stage){
      var world=document.createElement('section'); world.className='pinyin-world'+(stage.status==='locked'?' is-locked':'');
      var head=document.createElement('div'); head.className='pinyin-world-head';
      head.innerHTML='<div><span>'+stage.world+'</span><strong>'+stage.title+'</strong><small>'+stage.subtitle+'</small></div><div class="pinyin-world-lock">'+(stage.status==='locked'?'🔒':'')+'</div>';
      var path=document.createElement('div'); path.className='pinyin-path';
      stage.units.forEach(function(unit,i){path.appendChild(unitButton(unit,stage.status,i))});
      world.appendChild(head); world.appendChild(path); root.appendChild(world);
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true}); else render();
})();
