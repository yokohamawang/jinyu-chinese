(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};
  window.KoepandaFeatures.learn = function({state,img}){
    const stickers=state.unlocked.slice(0,5).map(id=>`<img src="${img(id)}" alt="">`).join('');
    return `<div class="kp-learning-title"><h1>学習</h1></div><section class="kp-home-record-card"><div class="kp-home-record-title"><span>🌱</span><h2>学習の記録</h2></div><div class="kp-home-record-content"><div><b>今日も小音と一歩ずつ</b><small>学んだ内容は、ロードの中からいつでも続けられるよ。</small></div><button class="kp-secondary" data-go="practice">練習する ›</button></div></section><section class="kp-home-sticker-card"><div><span class="kp-eyebrow">MY COLLECTION</span><h2>集めたシール</h2><p>練習やクイズでシールを集めよう。</p></div><div class="kp-home-sticker-row">${stickers}<b>${state.unlocked.length}枚</b></div><button class="kp-mini-link" data-go="rewards">コレクションを見る ›</button></section><section class="kp-roadmap-section"><div class="kp-section-title kp-roadmap-title"><h2>学習ロード</h2><span>ピンイン → 漢字 → 検定</span></div><p class="kp-roadmap-copy">島を選ぶと、その学習へ進めるよ。</p><div class="kp-roadmap-window"><img src="./assets/home/koepanda-home-roadmap-301.46.png" alt="ピンインから漢字学習、中国語検定の各級へ続く既存の学習ロード"><button type="button" class="kp-roadmap-link kp-roadmap-link-pinyin" data-action="pinyin-course" aria-label="ピンインのぼうけんを始める"></button><a class="kp-roadmap-link kp-roadmap-link-hanzi" href="./hanzi-practice.html" aria-label="漢字のたんけんを開く"></a></div></section>`;
  }
})();
