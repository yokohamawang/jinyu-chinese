(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};
  window.KoepandaFeatures.story = function({head}){
    return `${head('耳から音を楽しもう','ストーリー','短い中国語の音を聞いて、意味を選ぶミニクイズ。')}<section class="kp-story-card"><div class="kp-story-art" aria-hidden="true">🐼📚✨</div><div><span class="kp-eyebrow">音を聞くミニクイズ</span><h2>聞こえたことばを選ぼう</h2><p>短い音声を聞いて、意味を選ぶ5問のクイズです。</p></div><button class="kp-primary" data-action="legacy" data-mode="listen">聞き分けクイズを始める</button></section><section class="kp-section"><div class="kp-section-title"><h2>練習もしてみる？</h2></div><button class="kp-review-card kp-story-practice" data-go="practice"><span class="kp-review-icon">🎧</span><span class="kp-grow"><b>聞く・声に出す・まねる</b><small>短い練習を選んで、小音と一緒にやってみよう。</small></span><span class="kp-round-arrow">›</span></button></section>`;
  }
})();
