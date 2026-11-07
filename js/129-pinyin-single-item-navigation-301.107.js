/* 10.108 / 301.107 — use one large item at a time across phonetic units. */
(function(){
  var selectors=['.dtnl-letter-grid','.gkh-letter-grid','.jqx-letter-grid','.zhr-letter-grid','.zcs-letter-grid','.cpv-letter-grid','.cpo-letter-grid','.cpn-letter-grid','.nsv-letter-grid','.bnv-letter-grid'];
  function initGrid(grid){
    if(!grid||grid.dataset.singleItemReady)return;
    var card=grid.closest('.kids-lesson-card'),buttons=Array.prototype.slice.call(grid.querySelectorAll(':scope > button'));
    if(!card||buttons.length<2)return;
    grid.dataset.singleItemReady='1';var current=0,nav=document.createElement('div');nav.className='kp-single-item-nav';nav.setAttribute('aria-label','音を選ぶ');
    nav.innerHTML='<button type="button" data-step="-1" aria-label="前の音">← 前へ</button><span aria-live="polite"></span><button type="button" data-step="1" aria-label="次の音">次へ →</button>';
    grid.insertAdjacentElement('beforebegin',nav);
    var count=nav.querySelector('span'),prev=nav.querySelector('[data-step="-1"]'),next=nav.querySelector('[data-step="1"]');
    function refresh(){
      buttons=Array.prototype.slice.call(grid.querySelectorAll(':scope > button'));
      if(!buttons.length)return;
      current=Math.max(0,Math.min(current,buttons.length-1));
      buttons.forEach(function(button,index){var active=index===current;button.hidden=!active;button.setAttribute('aria-hidden',String(!active));if(active)button.tabIndex=0;else button.tabIndex=-1});
      count.textContent=(current+1)+' / '+buttons.length;prev.disabled=current===0;next.disabled=current===buttons.length-1;
    }
    nav.addEventListener('click',function(event){var button=event.target.closest('button[data-step]');if(!button)return;var target=current+Number(button.dataset.step);if(target<0||target>=buttons.length)return;current=target;buttons[current].click();refresh()});
    grid.addEventListener('click',function(event){var button=event.target.closest('button');if(!button||button.parentElement!==grid)return;var index=buttons.indexOf(button);if(index>=0){current=index;refresh()}});
    refresh();
    card.querySelectorAll('section').forEach(function(section){var heading=section.querySelector('header h3, h3');if(heading&&heading.textContent.trim()==='小音とまねよう')section.classList.add('kp-imitation-retired')});
    card.querySelectorAll('[class*="progress"]').forEach(function(progress){var steps=Array.prototype.slice.call(progress.querySelectorAll('span'));steps.forEach(function(step){if(/まねる/.test(step.textContent))step.innerHTML=step.innerHTML.replace('まねる','音を確かめる');if(/チェック/.test(step.textContent))step.innerHTML=step.innerHTML.replace('チェック','ミニチェック')})});
  }
  function run(){selectors.forEach(function(selector){document.querySelectorAll(selector).forEach(initGrid)})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
