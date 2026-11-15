(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};
  const SERIES_IDS={pinyin:new Set(['a','o','e','n']),hanzi:new Set(['shan','shui','ren','hao'])};
  function seriesItems(catalog,key){const items=Array.isArray(catalog)?catalog:[];if(SERIES_IDS[key])return items.filter(s=>SERIES_IDS[key].has(s.id));if(key==='zodiac-pinyin')return items.filter(s=>s.id.startsWith('zodiac_')&&s.id.endsWith('_pinyin'));if(key==='zodiac-hanzi')return items.filter(s=>s.id.startsWith('zodiac_')&&s.id.endsWith('_kanji'));return [];}
  window.KoepandaFeatures.rewards = function({head,state,safe,img,STICKERS}){
    const ownedIds=Array.isArray(state.rewardStickerKeys)?state.rewardStickerKeys:state.unlocked;
    const unlocked=state.rewardStickerCountLabel||'確認中…';
    const countLoading=unlocked==='確認中…';
    const seriesCard=(key,title,caption,items)=>{const owned=items.filter(s=>ownedIds.includes(s.id));return `<button class="kp-series-card" data-action="show-series" data-series="${key}" aria-label="${safe(title)}、全${items.length}種類を見る"><span class="kp-series-art">${items.slice(0,4).map(s=>`<img src="${img(s.id)}" alt="">`).join('')}</span><b>${safe(title)}</b><small>${safe(caption)}</small><span class="kp-series-count">${countLoading?'—':owned.length} / ${items.length}</span><span class="kp-series-open">全${items.length}種類を見る　›</span></button>`;};
    const pinyin=seriesItems(STICKERS,'pinyin'),hanzi=seriesItems(STICKERS,'hanzi'),zodiacPinyin=seriesItems(STICKERS,'zodiac-pinyin'),zodiacHanzi=seriesItems(STICKERS,'zodiac-hanzi');
    return `${head('がんばりが形になる','ごほうびボックス','学んだ文字が、集めて飾れるシールに。お気に入りも管理できるよ。')}<div class="kp-reward-hero"><span>🎁</span><div><b>獲得済みシール：${unlocked}</b><small>ミニクイズを最後までクリアすると、ごほうびシールを1枚受け取れます。</small></div><button data-go="book" class="kp-primary">シール帳を開く</button></div><section class="kp-section"><div class="kp-section-title"><h2>シリーズ</h2><span>デザインを見てみよう</span></div><div class="kp-series-grid">${seriesCard('pinyin','拼音小芽','音と文字のシール',pinyin)}${seriesCard('hanzi','汉字探险','漢字のなかまたち',hanzi)}${seriesCard('zodiac-pinyin','声調果冻','声調を楽しむ十二生肖',zodiacPinyin)}${seriesCard('zodiac-hanzi','生肖印章','漢字を集める十二生肖',zodiacHanzi)}</div></section><section class="kp-section"><div class="kp-section-title"><h2>お気に入り</h2><span>シール帳に飾るものを選ぼう</span></div><div class="kp-favorite-grid">${ownedIds.map(id=>{const s=STICKERS.find(x=>x.id===id);if(!s)return'';return `<button data-action="favorite" data-id="${id}" class="${state.favorites.includes(id)?'is-favorite':''}"><img src="${img(id)}" alt=""><span>${state.favorites.includes(id)?'★':'☆'} ${safe(s.glyph)}</span></button>`;}).join('')||'<div class="kp-empty-favorites">シールを集めると、ここからお気に入りを選べます。</div>'}</div></section><section class="kp-season-teaser compact"><div class="kp-limited-badge">近日予告</div><div><h3>季節限定・特別デザイン</h3><p>ぷっくり、透け感、きらきらなど、見た目のちがうシールも登場予定。</p></div><button data-go="book" class="kp-secondary">シール帳を見る</button></section><div class="kp-soft-note">学習のごほうびは、ログイン中のアカウントとシール帳に保存されます。</div>`;
  };
  window.KoepandaFeatures.rewards.mount=async ctx=>{
    try{
      const api=window.KP_ACCOUNT_API,client=api&&await api.getClient();
      const session=client&&await client.auth.getSession(),user=session?.data?.session?.user;
      if(!user){const ids=[...new Set(ctx.state.unlocked)];ctx.state.rewardStickerKeys=ids;const label=`${ids.length} 種類`;if(ctx.state.rewardStickerCountLabel!==label){ctx.state.rewardStickerCountLabel=label;ctx.render();}return;}
      if(ctx.state.rewardStickerUserId===user.id||ctx.state.rewardStickerLoadFailed)return;
      ctx.state.rewardStickerUserId=user.id;
      ctx.state.rewardStickerCountLabel='確認中…';
      ctx.render();
      const {data,error}=await client.from('kp_user_stickers').select('sticker_key').eq('user_id',user.id);
      if(error)throw error;
      const ids=[...new Set((data||[]).map(row=>row.sticker_key).filter(Boolean))];
      ctx.state.rewardStickerKeys=ids;
      ctx.state.rewardStickerCountLabel=`${ids.length} 種類`;
      ctx.render();
    }catch(_){
      ctx.state.rewardStickerCountLabel='— 種類';
      ctx.state.rewardStickerLoadFailed=true;
      ctx.render();
    }
  };
  window.KoepandaFeatures.rewards.actions={
    favorite:(ctx,b)=>{const id=b.dataset.id;ctx.state.favorites=ctx.state.favorites.includes(id)?ctx.state.favorites.filter(x=>x!==id):ctx.state.favorites.concat(id);ctx.save();ctx.render();},
    'show-series':(ctx,b)=>{const catalog=Array.isArray(window.KoepandaCatalog?.STICKERS)?window.KoepandaCatalog.STICKERS:ctx.STICKERS;const groups={pinyin:{title:'拼音小芽',items:seriesItems(catalog,'pinyin')},hanzi:{title:'汉字探险',items:seriesItems(catalog,'hanzi')},'zodiac-pinyin':{title:'声調果冻',items:seriesItems(catalog,'zodiac-pinyin')},'zodiac-hanzi':{title:'生肖印章',items:seriesItems(catalog,'zodiac-hanzi')}};const group=groups[b.dataset.series];if(!group)return;ctx.modal(group.title,`<p class="kp-modal-copy">${group.items.length}種類のデザイン</p><div class="kp-series-gallery">${group.items.map(s=>`<figure><img src="${ctx.img(s.id)}" alt="${ctx.safe(s.name)}"><figcaption>${ctx.safe(s.glyph)}</figcaption></figure>`).join('')}</div>`);}
  };
})();
