/* Koepanda: non-blocking recommended pinyin study and review plan. */
(function(){
  'use strict';
  function init(){
    const trigger=document.getElementById('kidsPlanTrigger');
    if(!trigger||trigger.dataset.planBound)return;
    trigger.dataset.planBound='1';

    const dialog=document.createElement('dialog');
    dialog.id='kidsStudyPlan';
    dialog.className='kids-study-plan';
    dialog.setAttribute('aria-labelledby','kidsPlanTitle');
    document.body.appendChild(dialog);

    function lastLesson(){
      const id=window.KP_PINYIN_CHAPTER_STATE?.read()?.lastUnit;
      if(!id)return null;
      const title=window.KP_PINYIN_PLAN_SCHEDULE?.units?.find(unit=>unit.id===id)?.title||null;
      return title?{id,title}:null;
    }

    function render(){
      const recent=lastLesson();
      dialog.innerHTML=`
        <div class="kids-plan-sheet">
          <header class="kids-plan-head">
            <span class="kids-plan-eyebrow">🐼 むりなく、少しずつ</span>
            <button class="kids-plan-close" type="button" aria-label="学習プランを閉じる">×</button>
            <h2 id="kidsPlanTitle">ピンイン学習ガイド</h2>
            <p>自分のペースで、楽しく進もう。</p>
          </header>
          <section class="kids-plan-guide" aria-label="学び方の目安">
            <div class="kids-plan-flow"><span>📖<b>学ぶ</b></span><i>›</i><span>🎤<b>練習</b></span><i>›</i><span>✅<b>ミニテスト</b></span></div>
            <p>🕒 1日10〜15分くらいから。時々復習しよう。</p>
          </section>
          ${recent?`<section class="kids-plan-recent"><div><small>🔁 前回の学習</small><strong>${recent.title}</strong></div><button type="button" data-plan-review-open="${recent.id}">もう一度</button></section>`:''}
          <p class="kids-plan-effort">参考：中国の小学校ではピンインを約6週間で学ぶ授業計画もあります。速さは人それぞれ。</p>
          <button class="kids-plan-done" type="button">学習ロードを見る</button>
        </div>`;
      dialog.querySelector('.kids-plan-close').addEventListener('click',close);
      dialog.querySelector('.kids-plan-done').addEventListener('click',close);
      dialog.querySelectorAll('[data-plan-review-open]').forEach(button=>button.addEventListener('click',()=>{
        const id=button.dataset.planReviewOpen;close();
        if(!window.koepandaOpenPinyinUnit?.(id))window.alert('学習ロードから復習する章を選んでね。');
      }));
    }
    function open(){
      render();
      window.KP_PINYIN_CHAPTER_STATE?.refresh().then(()=>{if(dialog.open)render();});
      if(typeof dialog.showModal==='function')dialog.showModal();
      else dialog.setAttribute('open','');
      trigger.setAttribute('aria-expanded','true');
      dialog.querySelector('.kids-plan-close').focus();
    }
    function close(){
      if(typeof dialog.close==='function'&&dialog.open)dialog.close();
      else dialog.removeAttribute('open');
      trigger.setAttribute('aria-expanded','false');
      trigger.focus({preventScroll:true});
    }
    trigger.addEventListener('click',open);
    trigger.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
    dialog.addEventListener('close',()=>trigger.setAttribute('aria-expanded','false'));
    dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
