(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};
  window.KoepandaFeatures.story = function({head}){
    return `${head('耳から物語を楽しもう','ストーリー','短いお話を聞きながら、中国語の音に親しもう。')}<section class="kp-story-card"><div class="kp-story-art" aria-hidden="true">🐼📚✨</div><div><span class="kp-eyebrow">小音のおはなし</span><h2>ゆっくり聞いて、音を見つけよう</h2><p>物語を聞くページから、好きなお話を選べます。</p></div><button class="kp-primary" data-action="legacy" data-mode="listen">物語を聞く</button></section><section class="kp-section"><div class="kp-section-title"><h2>練習もしてみる？</h2></div><button class="kp-review-card kp-story-practice" data-go="practice"><span class="kp-review-icon">🎧</span><span class="kp-grow"><b>聞く・声に出す・まねる</b><small>短い練習を選んで、小音と一緒にやってみよう。</small></span><span class="kp-round-arrow">›</span></button></section>`;
  }
})();
