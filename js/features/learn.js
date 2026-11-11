(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};
  window.KoepandaFeatures.learn=function(){
    return `<section class="kp-learning-home" aria-label="学習ホーム">
      <img class="kp-learning-art" src="./assets/home/koepanda-learning-dashboard.png?v=10.108.301.172" alt="学習記録、今週のスタンプ、ピンイン・漢字・中国語検定の学習ロード" width="739" height="1589">
      <a class="kp-home-hotspot kp-home-calendar" href="#self" data-action="open-records" aria-label="学習カレンダーを見る"></a>
      <a class="kp-home-hotspot kp-home-stamps" href="#rewards" data-action="open-rewards" aria-label="スタンプ一覧を見る"></a>
      <button type="button" class="kp-home-hotspot kp-home-pinyin" data-action="pinyin-course" aria-label="ピンインのぼうけんを始める"></button>
      <a class="kp-home-hotspot kp-home-hanzi" href="./hanzi-practice.html" aria-label="漢字のたんけんを開く"></a>
      <a class="kp-home-hotspot kp-home-pre4" href="./hanzi-practice.html" aria-label="準4級の漢字ルートを開く"></a>
      <button type="button" class="kp-home-hotspot kp-home-grade4" data-action="roadmap-coming" data-level="4級" aria-label="4級コースの案内"></button>
      <button type="button" class="kp-home-hotspot kp-home-grade3" data-action="roadmap-coming" data-level="3級" aria-label="3級コースの案内"></button>
      <button type="button" class="kp-home-hotspot kp-home-grade2" data-action="roadmap-coming" data-level="2級" aria-label="2級コースの案内"></button>
      <button type="button" class="kp-home-hotspot kp-home-grade-pre1" data-action="roadmap-coming" data-level="準1級" aria-label="準1級コースの案内"></button>
      <button type="button" class="kp-home-hotspot kp-home-grade1" data-action="roadmap-coming" data-level="1級" aria-label="1級コースの案内"></button>
    </section>`;
  };
  window.KoepandaFeatures.learn.actions={
    'open-records':(ctx,button,event)=>{event.preventDefault();ctx.setPage('self');ctx.render();},
    'open-rewards':(ctx,button,event)=>{event.preventDefault();ctx.setPage('rewards');ctx.render();},
    'roadmap-coming':(ctx,button)=>ctx.modal(`${ctx.safe(button.dataset.level)}コース`,`<p class="kp-modal-copy">このコースは準備中です。公開後、この島から学習を始められます。</p><button class="kp-primary" data-action="modal-close">閉じる</button>`)
  };
})();
