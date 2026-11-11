(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};
  window.KoepandaFeatures.rewards = function({head,state,safe,img,STICKERS}){
    const unlocked=state.unlocked.length;
    return `${head('がんばりが形になる','ごほうびボックス','学んだ文字が、集めて飾れるシールに。お気に入りも管理できるよ。')}<div class="kp-reward-hero"><span>🎁</span><div><b>シール ${unlocked} 枚</b><small>ピンイン・漢字シリーズを集めよう</small></div><button data-go="book" class="kp-primary">シール帳を開く</button></div><section class="kp-section"><div class="kp-section-title"><h2>シリーズ</h2><span>学習で増えるよ</span></div><div class="kp-series-grid"><article><div class="kp-series-art">${['a','o','e','n'].map(id=>`<img src="${img(id)}" alt="">`).join('')}</div><b>拼音小芽</b><small>音と文字のシール</small><span>${state.unlocked.filter(id=>['a','o','e','n'].includes(id)).length} / 4</span></article><article><div class="kp-series-art">${['shan','shui','ren','hao'].map(id=>`<img src="${img(id)}" alt="">`).join('')}</div><b>汉字探险</b><small>漢字のなかまたち</small><span>${state.unlocked.filter(id=>['shan','shui','ren','hao'].includes(id)).length} / 4</span></article></div></section><section class="kp-section"><div class="kp-section-title"><h2>お気に入り</h2><span>シール帳に飾るものを選ぼう</span></div><div class="kp-favorite-grid">${state.unlocked.map(id=>{const s=STICKERS.find(x=>x.id===id);return `<button data-action="favorite" data-id="${id}" class="${state.favorites.includes(id)?'is-favorite':''}"><img src="${img(id)}" alt=""><span>${state.favorites.includes(id)?'★':'☆'} ${safe(s.glyph)}</span></button>`;}).join('')}</div></section><section class="kp-season-teaser compact"><div class="kp-limited-badge">近日予告</div><div><h3>季節限定・特別デザイン</h3><p>ぷっくり、透け感、きらきらなど、見た目のちがうシールも登場予定。</p></div><button data-go="book" class="kp-secondary">予告を見る</button></section><div class="kp-soft-note">シールはゲーム内の学習ごほうびです。売買や現金交換はありません。友だちとの交換は、双方が内容を確認してから行う設計です。</div>`;
  }
  window.KoepandaFeatures.rewards.actions={
    favorite:(ctx,b)=>{const id=b.dataset.id;ctx.state.favorites=ctx.state.favorites.includes(id)?ctx.state.favorites.filter(x=>x!==id):ctx.state.favorites.concat(id);ctx.save();ctx.render();}
  };
})();
