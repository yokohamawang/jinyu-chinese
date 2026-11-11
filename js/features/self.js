(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};
  window.KoepandaFeatures.self = function({head,state}){
    return `${head('記録とコレクション','自分のページ','学習記録を保存して、集めたシールを楽しもう。')}<section class="kp-self-account"><img src="./assets/brand/xiaoyin-mascot.png" alt="小音"><div><b>ゲストとして学習中</b><small>アカウントを作ると、別の端末でも学習を続けられます。</small></div><button class="kp-primary" data-action="account">新規登録・ログイン</button></section><section class="kp-section"><div class="kp-section-title"><h2>コレクション</h2><span>${state.unlocked.length}枚</span></div><div class="kp-self-collection"><button data-go="book"><span>📒</span><b>シール帳</b><small>シールを自由に貼って飾ろう</small><strong>開く ›</strong></button><button data-go="rewards"><span>🎁</span><b>ごほうびボックス</b><small>シリーズとお気に入りを管理</small><strong>開く ›</strong></button></div></section><section class="kp-section"><div class="kp-section-title"><h2>学習の記録</h2></div><div class="kp-self-record"><span>🌱</span><p>続けた分だけ、学習ロードとシールが育っていくよ。</p></div></section>`;
  }
})();
