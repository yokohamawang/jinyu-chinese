/* 10.108 / 301.115 — keep single-item selectors synchronized with their sound cards. */
(function(){
  'use strict';
  var selectors=['.dtnl-letter-grid','.gkh-letter-grid','.jqx-letter-grid','.zhr-letter-grid','.zcs-letter-grid','.cpv-letter-grid','.cpo-letter-grid','.cpn-letter-grid','.nsv-letter-grid','.bnv-letter-grid'];
  function initGrid(grid){
    if(!grid||grid.dataset.singleItemReady)return;
    var card=grid.closest('.kids-lesson-card');if(!card)return;
    grid.dataset.singleItemReady='1';
    var current=0,buttons=[],nav=document.createElement('div');
    nav.className='kp-single-item-nav';nav.setAttribute('aria-label','音を選ぶ');
    nav.innerHTML='<button type="button" data-step="-1" aria-label="前の音">← 前へ</button><span aria-live="polite"></span><button type="button" data-step="1" aria-label="次の音">次へ →</button>';
    grid.insertAdjacentElement('beforebegin',nav);
    var count=nav.querySelector('span'),prev=nav.querySelector('[data-step="-1"]'),next=nav.querySelector('[data-step="1"]');
    function refresh(){
      buttons=Array.prototype.slice.call(grid.querySelectorAll(':scope > button'));
      if(!buttons.length){nav.hidden=true;return}
      nav.hidden=false;current=Math.max(0,Math.min(current,buttons.length-1));
      buttons.forEach(function(button,index){
        var active=index===current;
        button.hidden=!active;button.setAttribute('aria-hidden',String(!active));button.tabIndex=active?0:-1;
        if(active)button.style.removeProperty('display');
        else button.style.setProperty('display','none','important');
      });
      count.textContent=(current+1)+' / '+buttons.length;var busy=buttons.some(function(button){return button.disabled});prev.disabled=current===0||busy;next.disabled=current===buttons.length-1||busy;
    }
    nav.addEventListener('click',function(event){
      var control=event.target.closest('button[data-step]');if(!control)return;
      var target=current+Number(control.dataset.step);if(target<0||target>=buttons.length)return;
      current=target;refresh();var active=buttons[current];if(active)active.click();refresh();
    });
    grid.addEventListener('click',function(event){
      var button=event.target.closest('button');if(!button||button.parentElement!==grid)return;
      var index=buttons.indexOf(button);if(index>=0){current=index;refresh()}
    });
    new MutationObserver(refresh).observe(grid,{childList:true,attributes:true,attributeFilter:['disabled']});
    refresh();
    card.querySelectorAll('section').forEach(function(section){var heading=section.querySelector('header h3, h3');if(heading&&heading.textContent.trim()==='小音とまねよう')section.classList.add('kp-imitation-retired')});
    card.querySelectorAll('[class*="progress"]').forEach(function(progress){Array.prototype.slice.call(progress.querySelectorAll('span')).forEach(function(step){if(/まねる/.test(step.textContent))step.innerHTML=step.innerHTML.replace('まねる','音を確かめる');if(/チェック/.test(step.textContent))step.innerHTML=step.innerHTML.replace('チェック','ミニチェック')})});
  }
  function run(){selectors.forEach(function(selector){document.querySelectorAll(selector).forEach(initGrid)})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
  new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
})();
