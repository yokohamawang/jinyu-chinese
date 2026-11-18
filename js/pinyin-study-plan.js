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

    function progress(){
      const vowels=['a','o','e','i','u','ü'];
      const groups=[
        {name:'声母',prefix:'koepandaInitial',ids:['P3','P4','P5','P6','P7','P8']},
        {name:'複韻母・鼻韻母',prefix:'koepandaCompound',ids:['P9','P10','P11','P12','P13']},
        {name:'整体認読',prefix:'koepandaWhole',ids:['P14','P15']}
      ];
      const units=window.KP_PINYIN_CHAPTER_STATE?.read().units||{};
      const completed=id=>!!units[id]?.complete;
      const done=Object.keys(units).filter(completed);
      const nextId=window.KP_PINYIN_PLAN_SCHEDULE?.units?.find(unit=>!completed(unit.id))?.id||'P21';
      const group=groups.find(g=>g.ids.includes(nextId));
      const next=group?`次は「${group.name}」へ。前の章も少し復習しよう`:'次の章へ進もう。終わった章も少しずつ復習しよう';
      return {done:done.length,next,nextId};
    }

    function render(){
      const p=progress();
      const schedule=window.KP_PINYIN_PLAN_SCHEDULE;
      const reviews=window.KP_PINYIN_CHAPTER_STATE?.reviewDue()||[];
      dialog.innerHTML=`
        <div class="kids-plan-sheet">
          <header class="kids-plan-head">
            <span class="kids-plan-eyebrow">🐼 むりなく、少しずつ</span>
            <button class="kids-plan-close" type="button" aria-label="学習プランを閉じる">×</button>
            <h2 id="kidsPlanTitle">音のぼうけん 学習プラン</h2>
            <p>今の章から、学ぶ順番と復習するタイミングを確認しよう。</p>
          </header>
          <section class="kids-plan-today" aria-label="今の進みぐあい">
            <span>🌱 いまの進みぐあい</span>
            <strong>学習単元 ${p.done}/21 クリア</strong>
            <p>${p.next}</p>
          </section>
          ${reviews.length?`<section class="kids-plan-today"><strong>🔁 復習する章</strong>${reviews.slice(0,2).map(id=>`<div class="kids-plan-review-row"><b>${id}</b><button type="button" data-plan-review-open="${id}">復習する</button><button type="button" data-plan-review-done="${id}">復習できた ✓</button></div>`).join('')}</section>`:''}
          <p class="kids-plan-effort">このプランは復習込みで約14〜18時間が目安。参考：中国の小学校ではピンインに約50時限（5〜6週間）かける例もあるよ。※習熟にはその後も練習が必要。</p>
          ${schedule?schedule.html(p.nextId):'<p>学習メニューを読み込めませんでした。もう一度開いてね。</p>'}
          <button class="kids-plan-done" type="button">学習ロードへ戻る</button>
        </div>`;
      dialog.querySelector('.kids-plan-close').addEventListener('click',close);
      dialog.querySelector('.kids-plan-done').addEventListener('click',close);
      dialog.querySelectorAll('[data-plan-review-open]').forEach(button=>button.addEventListener('click',()=>{
        const id=button.dataset.planReviewOpen;close();
        if(!window.koepandaOpenPinyinUnit?.(id))window.alert('学習ロードから復習する章を選んでね。');
      }));
      dialog.querySelectorAll('[data-plan-review-done]').forEach(button=>button.addEventListener('click',async()=>{
        button.disabled=true;
        if(await window.KP_PINYIN_CHAPTER_STATE?.markReviewed(button.dataset.planReviewDone))render();
        else {button.disabled=false;window.alert('記録できませんでした。ログイン状態を確認してね。');}
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
