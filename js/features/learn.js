(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};
  window.KoepandaFeatures.learn=function({state,img}){
    const stickers=state.unlocked.slice(0,5).map(id=>`<img src="${img(id)}" alt="">`).join('');
    return `<div class="kp-learning-title"><h1>学習</h1></div>
      <section class="kp-home-record-card"><div class="kp-home-record-title"><span>🌱</span><h2>学習の記録</h2></div><div class="kp-home-record-content"><div><b>今日も小音と一歩ずつ</b><small>学んだ内容は、ロードの中からいつでも続けられるよ。</small></div><button class="kp-secondary" data-go="practice">練習する ›</button></div></section>
      <section class="kp-home-sticker-card"><div><span class="kp-eyebrow">MY COLLECTION</span><h2>集めたシール</h2><p>練習やクイズでシールを集めよう。</p></div><div class="kp-home-sticker-row">${stickers}<b>${state.unlocked.length}枚</b></div><button class="kp-mini-link" data-go="rewards">コレクションを見る ›</button></section>
      <section class="kp-roadmap-section"><div class="kp-section-title kp-roadmap-title"><h2>学習ロード</h2><span>ピンイン → 漢字 → 検定</span></div><p class="kp-roadmap-copy">島をタップすると、その学習へ進めるよ。</p>
        <div class="kp-roadmap-window" id="kpRoadmap" aria-label="学習ロード。各島をタップして進めます">
          <img src="./assets/home/koepanda-home-roadmap-301.46.png?v=10.108.301.171" alt="ピンイン、漢字、中国語検定の学習ロード" width="739" height="2129">
          <button type="button" class="kp-roadmap-link kp-roadmap-link-pinyin" data-action="pinyin-course" aria-label="ピンインのぼうけんを始める"></button>
          <a class="kp-roadmap-link kp-roadmap-link-hanzi" href="./hanzi-practice.html" aria-label="漢字のたんけんを開く"></a>
          <a class="kp-roadmap-link kp-roadmap-link-pre4" href="./hanzi-practice.html" aria-label="準4級の漢字ルートを開く"></a>
          <button type="button" class="kp-roadmap-link kp-roadmap-link-grade4" data-action="roadmap-coming" data-level="4級" aria-label="4級コースの案内"></button>
          <button type="button" class="kp-roadmap-link kp-roadmap-link-grade3" data-action="roadmap-coming" data-level="3級" aria-label="3級コースの案内"></button>
          <button type="button" class="kp-roadmap-link kp-roadmap-link-grade2" data-action="roadmap-coming" data-level="2級" aria-label="2級コースの案内"></button>
          <button type="button" class="kp-roadmap-link kp-roadmap-link-grade-pre1" data-action="roadmap-coming" data-level="準1級" aria-label="準1級コースの案内"></button>
          <button type="button" class="kp-roadmap-link kp-roadmap-link-grade1" data-action="roadmap-coming" data-level="1級" aria-label="1級コースの案内"></button>
        </div>
      </section>`;
  };
  window.KoepandaFeatures.learn.actions={
    'roadmap-coming':(ctx,button)=>ctx.modal(`${ctx.safe(button.dataset.level)}コース`, `<p class="kp-modal-copy">この学習コースは準備中です。公開後、この島から開けるようになります。</p><button class="kp-primary" data-action="modal-close">閉じる</button>`)
  };
})();
