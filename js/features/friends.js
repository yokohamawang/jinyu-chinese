(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};
  window.KoepandaFeatures.friends = function({head,state,safe,save}){
    const code=state.friendCode||('KP-'+Math.random().toString(36).slice(2,6).toUpperCase()+'-'+Math.random().toString(36).slice(2,5).toUpperCase());state.friendCode=code;save();
    return `${head('いっしょなら、もっと楽しい','友だちの広場','招待コードでつながって、ひとこと応援やシール交換をしよう。')}<section class="kp-friend-code"><div><span class="kp-eyebrow">あなたのコード</span><strong>${safe(code)}</strong><small>コードを知っている人だけが申請できます</small></div><button class="kp-secondary" data-action="copy-code">コードをコピー</button></section><form class="kp-add-friend" id="kpFriendForm"><label for="kpFriendCode">友だちの招待コード</label><div><input id="kpFriendCode" name="code" maxlength="16" placeholder="KP-AB12-XY3" autocomplete="off"><button class="kp-primary">申請する</button></div><small>名前やメールアドレスでは検索しません。</small></form><section class="kp-section"><div class="kp-section-title"><h2>友だち</h2><span>${state.friends.length}人</span></div>${state.friends.length?`<div class="kp-friend-list">${state.friends.map((f,i)=>`<article class="kp-friend-row"><div class="kp-avatar">${['🐼','🐰','🐯','🐸'][i%4]}</div><div class="kp-grow"><b>${safe(f.name)}</b><small>${f.pending?'申請中・相手の承認待ち':f.progressVisible?'今週の学習：'+(f.days||2)+'日':'学習記録は非公開'}</small></div>${f.pending?'<span class="kp-pending-label">申請中</span>':`<button class="kp-secondary kp-small" data-action="greet" data-id="${i}">あいさつ</button><button class="kp-trade-link" data-action="start-trade" data-id="${i}">シール交換</button>`}</article>`).join('')}</div>`:`<div class="kp-empty"><span>🌱</span><b>友だちはこれから</b><small>コードを教えてもらうか、下の体験用カードで画面を見てみよう。</small><button class="kp-secondary" data-action="demo-friend">体験用の友だちを表示</button></div>`}</section><section class="kp-section"><div class="kp-section-title"><h2>ひとことカード</h2><span>選んで送るだけ</span></div><div class="kp-greeting-grid">${['いっしょに勉強しよう！','今日もがんばったね 🌟','シール帳かわいいね！','またいっしょに遊ぼう！'].map((g,i)=>`<button data-action="greeting" data-text="${safe(g)}"><span>${['👋','🌟','💌','🌈'][i]}</span>${g}</button>`).join('')}</div><small class="kp-safety">自由入力のチャットはありません。いやなときは、申請や交換をいつでも断れます。</small></section><section class="kp-section"><div class="kp-section-title"><h2>学習記録の見せ方</h2></div><label class="kp-toggle-row"><span><b>友だちに今週の学習日数を見せる</b><small>プロフィールに日数だけ表示します。学習内容は表示されません。</small></span><input type="checkbox" data-action="privacy" ${state.progressVisible?'checked':''}></label></section>`;
  }
  window.KoepandaFeatures.friends.actions={
    'copy-code':ctx=>navigator.clipboard?.writeText(ctx.state.friendCode).then(()=>ctx.toast('招待コードをコピーしたよ！')).catch(()=>ctx.toast('招待コード：'+ctx.state.friendCode)),
    'demo-friend':ctx=>{ctx.state.friends.push({code:'DEMO-FRIEND',name:'ゆきパンダ（体験）',progressVisible:true,days:3,demo:true});ctx.save();ctx.render();},
    greet:(ctx,b)=>ctx.modal('あいさつカード',`<p class="kp-modal-copy">${ctx.safe(ctx.state.friends[+b.dataset.id]?.name||'友だち')}に送るカードを選んでね。</p><div class="kp-greeting-grid">${['いっしょに勉強しよう！','今日もがんばったね 🌟','またいっしょに遊ぼう！'].map(g=>`<button data-action="send-greeting" data-id="${b.dataset.id}" data-text="${ctx.safe(g)}">${ctx.safe(g)}</button>`).join('')}</div>`),
    greeting:(ctx,b)=>recordGreeting(ctx,b.dataset.text),
    'send-greeting':(ctx,b)=>{recordGreeting(ctx,b.dataset.text,ctx.state.friends[+b.dataset.id]?.name);ctx.closeModal();},
    'start-trade':(ctx,b)=>startTrade(ctx,+b.dataset.id),
    'trade-confirm':ctx=>tradeConfirm(ctx),
    'trade-cancel':ctx=>ctx.closeModal(),
    'trade-demo':ctx=>finishTradeDemo(ctx)
  };
  window.KoepandaFeatures.friends.change=(ctx,e)=>{
    if(e.target.dataset.action!=='privacy')return false;
    ctx.state.progressVisible=e.target.checked;ctx.save();ctx.toast('公開設定をこの端末に保存しました。');return true;
  };
  window.KoepandaFeatures.friends.submit=(ctx,e)=>{
    if(e.target.id!=='kpFriendForm')return false;
    e.preventDefault();const val=e.target.code.value.trim().toUpperCase();
    if(!/^KP-[A-Z0-9]{4}-[A-Z0-9]{3}$/.test(val)){ctx.toast('KP-AB12-XY3 の形の招待コードを入力してね。');return true;}
    if(val===ctx.state.friendCode){ctx.toast('これはあなたのコードだよ。友だちのコードを使ってね。');return true;}
    if(ctx.state.friends.some(f=>f.code===val)){ctx.toast('このコードには申請済みだよ。');return true;}
    ctx.state.friends.push({code:val,name:'コードの友だち',progressVisible:false,days:0,pending:true});ctx.save();ctx.render();ctx.toast('申請をこの端末に保存したよ。相手への送信はサービス接続後に有効になります。');return true;
  };
  function recordGreeting(ctx,text,name){ctx.state.greetings.unshift({text,name:name||'',at:Date.now()});ctx.save();ctx.toast(name?`「${text}」カードを${name}に送る準備ができたよ。`:`「${text}」を選んだよ。正式送信はサービス接続後に有効です。`);}
  function startTrade(ctx,friendIndex){const friend=ctx.state.friends[friendIndex];if(!friend)return;const owns=ctx.state.unlocked.map(id=>ctx.STICKERS.find(s=>s.id===id)).filter(Boolean);ctx.modal('シール交換を相談',`<p class="kp-modal-copy">${ctx.safe(friend.name)}と交換したいシールを選ぼう。お気に入りは交換できないよ。</p><div class="kp-trade-options">${owns.map(s=>`<label><input type="checkbox" value="${s.id}" ${ctx.state.favorites.includes(s.id)?'disabled':''}><img src="${ctx.img(s.id)}" alt=""><span>${ctx.safe(s.glyph)}${ctx.state.favorites.includes(s.id)?'・お気に入り':''}</span></label>`).join('')}</div><p class="kp-safety">交換する内容をおたがいに見て、両方がOKしてから成立します。</p><button data-action="trade-confirm" data-friend="${friendIndex}" class="kp-primary">内容を確認する</button>`);}
  function tradeConfirm(ctx){const d=ctx.root.querySelector('#kpModal'),friend=d.querySelector('[data-friend]')?.dataset.friend||'0',chosen=[...d.querySelectorAll('.kp-trade-options input:checked')].map(x=>x.value);if(!chosen.length){ctx.toast('交換するシールを選んでね。');return;}const items=chosen.map(id=>ctx.STICKERS.find(s=>s.id===id));d.querySelector('.kp-modal-body').innerHTML=`<button class="kp-modal-x" data-action="modal-close">×</button><span class="kp-eyebrow">交換前に確認</span><h2>${ctx.safe(ctx.state.friends[+friend]?.name||'友だち')}に渡すもの</h2><div class="kp-trade-preview">${items.map(s=>`<img src="${ctx.img(s.id)}" alt="${ctx.safe(s.glyph)}">`).join('')}</div><p class="kp-modal-copy">これは体験版の交換画面です。今は相手のシール内容が届いていないため、まだ成立しません。正式版では相手も内容を確認して承認します。</p><button data-action="trade-demo" data-friend="${friend}" data-items="${chosen.join(',')}" class="kp-primary">交換の流れを体験する</button>`;}
  function finishTradeDemo(ctx){const b=ctx.root.querySelector('#kpModal [data-action="trade-demo"]');ctx.state.trades.unshift({friend:ctx.state.friends[+b.dataset.friend]?.name,items:b.dataset.items.split(','),status:'preview',at:Date.now()});ctx.save();ctx.closeModal();ctx.toast('交換の確認画面を体験しました。シールは移動していません。');}
})();
