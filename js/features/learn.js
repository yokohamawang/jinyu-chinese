(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};
  const WEEK=['日','月','火','水','木','金','土'];
  function localDateKey(date){return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');}
  function dailyRecord(){
    try{
      const record=typeof window.readDailyGoal==='function'?window.readDailyGoal():null;
      if(record&&Array.isArray(record.days))return record;
    }catch(_){}
    return {lastDay:'',streak:0,days:[]};
  }
  function weeklyCalendar(record){
    const today=new Date();
    return Array.from({length:7},(_,index)=>{
      const date=new Date(today.getFullYear(),today.getMonth(),today.getDate()-6+index);
      const key=localDateKey(date),done=record.days.includes(key),current=index===6;
      return `<span class="kp-study-day${done?' is-done':''}${current?' is-today':''}"><small>${WEEK[date.getDay()]}</small><b>${done?'✓':'·'}</b></span>`;
    }).join('');
  }
  function recordCard(){
    const record=dailyRecord();
    const streak=typeof window.currentStreak==='function'?window.currentStreak():Math.max(0,Number(record.streak)||0);
    return `<section class="kp-study-record" aria-label="学習の記録">
      <div class="kp-study-record-main"><span class="kp-study-flame" aria-hidden="true">🎋</span><div><b>学習の記録</b><small>連続学習</small></div><strong>${streak}<small>日</small></strong></div>
      <div class="kp-study-calendar" aria-label="直近7日の学習記録">${weeklyCalendar(record)}</div>
      <a href="#self" class="kp-study-link" data-action="open-records">カレンダーを見る <span aria-hidden="true">›</span></a>
    </section>`;
  }
  function stampCard(state,STICKERS,img,safe){
    const owned=STICKERS.filter(item=>state.unlocked.includes(item.id));
    const shown=owned.slice(-7);
    const stamps=shown.length?shown.map(item=>`<span class="kp-study-stamp" title="${safe(item.name)}"><img src="${img(item.id)}" alt="${safe(item.glyph)}"></span>`).join(''):'<span class="kp-study-stamp-empty">学習してシールを集めよう</span>';
    return `<section class="kp-study-stamps" aria-label="集めたスタンプ"><div class="kp-study-stamps-head"><div><b>集めたスタンプ</b><small>${owned.length}枚</small></div><a href="#rewards" data-action="open-rewards">一覧を見る <span aria-hidden="true">›</span></a></div><div class="kp-study-stamp-row">${stamps}</div></section>`;
  }
  window.KoepandaFeatures.learn=function({state,STICKERS,img,safe}){
    return `<section class="kp-learning-home" aria-label="学習ホーム">
      ${recordCard()}
      ${stampCard(state,STICKERS,img,safe)}
      <div class="kp-learning-map">
        <img class="kp-learning-art" src="./assets/home/koepanda-learning-roadmap.png?v=301.195" alt="ピンイン、漢字、中国語検定の学習ロード" width="739" height="1409">
        <button type="button" class="kp-home-hotspot kp-home-pinyin" data-action="pinyin-course" aria-label="ピンインのぼうけんを始める"></button>
        <a class="kp-home-hotspot kp-help-station" href="./help-station.html?v=10.108.301.64" aria-label="小音の手書き漢字辞典：手書きで文字を調べる">
          <img src="./assets/home/help-station-handwriting-dictionary.svg?v=301.195" alt="" width="180" height="108">
        </a>
        <a class="kp-home-hotspot kp-home-hanzi" href="./hanzi-practice.html" aria-label="漢字のたんけんを開く"></a>
        <a class="kp-home-hotspot kp-home-pre4" href="./hanzi-practice.html" aria-label="準4級の漢字ルートを開く"></a>
        <button type="button" class="kp-home-hotspot kp-home-grade4" data-action="roadmap-coming" data-level="4級" aria-label="4級コースの案内"></button>
        <button type="button" class="kp-home-hotspot kp-home-grade3" data-action="roadmap-coming" data-level="3級" aria-label="3級コースの案内"></button>
        <button type="button" class="kp-home-hotspot kp-home-grade2" data-action="roadmap-coming" data-level="2級" aria-label="2級コースの案内"></button>
        <button type="button" class="kp-home-hotspot kp-home-grade-pre1" data-action="roadmap-coming" data-level="準1級" aria-label="準1級コースの案内"></button>
        <button type="button" class="kp-home-hotspot kp-home-grade1" data-action="roadmap-coming" data-level="1級" aria-label="1級コースの案内"></button>
      </div>
    </section>`;
  };
  window.KoepandaFeatures.learn.actions={
    'open-records':(ctx,button,event)=>{event.preventDefault();ctx.setPage('self');ctx.render();},
    'open-rewards':(ctx,button,event)=>{event.preventDefault();ctx.setPage('rewards');ctx.render();},
    'roadmap-coming':(ctx,button)=>ctx.modal(`${ctx.safe(button.dataset.level)}コース`,`<p class="kp-modal-copy">このコースは準備中です。公開後、この島から学習を始められます。</p><button class="kp-primary" data-action="modal-close">閉じる</button>`)
  };
})();
