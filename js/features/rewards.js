(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};
  window.KoepandaFeatures.rewards = function({head,state,safe,img,STICKERS}){
    const unlocked=state.unlocked.length;
    const seriesCard=(title,caption,items)=>{const owned=items.filter(s=>state.unlocked.includes(s.id));return `<article><div class="kp-series-art">${items.slice(0,4).map(s=>`<img src="${img(s.id)}" alt="">`).join('')}</div><b>${safe(title)}</b><small>${safe(caption)}</small><span>${owned.length} / ${items.length}</span></article>`;};
    const pinyin=STICKERS.filter(s=>s.series==='拼音小芽'),hanzi=STICKERS.filter(s=>s.series==='汉字探险'),zodiacPinyin=STICKERS.filter(s=>s.series==='声调果冻'),zodiacHanzi=STICKERS.filter(s=>s.series==='生肖印章');
    return `${head('がんばりが形になる','ごほうびボックス','学んだ文字が、集めて飾れるシールに。お気に入りも管理できるよ。')}<div class="kp-reward-hero"><span>🎁</span><div><b>シール ${unlocked} 種類</b><small>集めたシールは友だちと交換できます</small></div><button data-go="book" class="kp-primary">シール帳を開く</button></div><section class="kp-section"><div class="kp-section-title"><h2>シリーズ</h2><span>学習で集めよう</span></div><div class="kp-series-grid">${seriesCard('拼音小芽','音と文字のシール',pinyin)}${seriesCard('汉字探险','漢字のなかまたち',hanzi)}${seriesCard('声調果冻','声調を楽しむ十二生肖',zodiacPinyin)}${seriesCard('生肖印章','漢字を集める十二生肖',zodiacHanzi)}</div></section><section class="kp-section"><div class="kp-section-title"><h2>お気に入り</h2><span>シール帳に飾るものを選ぼう</span></div><div class="kp-favorite-grid">${state.unlocked.map(id=>{const s=STICKERS.find(x=>x.id===id);if(!s)return'';return `<button data-action="favorite" data-id="${id}" class="${state.favorites.includes(id)?'is-favorite':''}"><img src="${img(id)}" alt=""><span>${state.favorites.includes(id)?'★':'☆'} ${safe(s.glyph)}</span></button>`;}).join('')}</div></section><section class="kp-season-teaser compact"><div class="kp-limited-badge">近日予告</div><div><h3>季節限定・特別デザイン</h3><p>ぷっくり、透け感、きらきらなど、見た目のちがうシールも登場予定。</p></div><button data-go="book" class="kp-secondary">予告を見る</button></section><div class="kp-soft-note">シールはゲーム内の学習ごほうびです。友だちとの交換は、双方が内容を確認してから行います。</div>`;
  }
  window.KoepandaFeatures.rewards.actions={
    favorite:(ctx,b)=>{const id=b.dataset.id;ctx.state.favorites=ctx.state.favorites.includes(id)?ctx.state.favorites.filter(x=>x!==id):ctx.state.favorites.concat(id);ctx.save();ctx.render();}
  };
})();
