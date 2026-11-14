(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};

  const CARDS={
    study_together:{icon:'📚',text:'いっしょに勉強しよう！'},
    great_job:{icon:'🌟',text:'今日もがんばったね！'},
    nice_stickers:{icon:'🎟️',text:'シール帳すてきだね！'},
    see_you_soon:{icon:'🌈',text:'またいっしょに遊ぼう！'}
  };
  const TRADE_STATUS={pending:'返事待ち',completed:'交換成立',declined:'お断り',cancelled:'取り消し',expired:'期限切れ'};
  let loadSequence=0;
  let authSubscription=null;
  let snapshot=null;

  function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function shortDate(value){try{return new Date(value).toLocaleDateString('ja-JP',{month:'numeric',day:'numeric'});}catch(_){return '';}}
  function friendName(userId,profiles){return profiles[userId]?.nickname||'Koepanda learner';}
  function errText(error){
    const msg=String(error&&(error.message||error)||'');
    if(/sign_in_required/i.test(msg))return '先にアカウントへログインしてください。';
    if(/friendship_required/i.test(msg))return '友だちになってから利用できます。';
    if(/not_found/i.test(msg))return '対象が見つかりませんでした。画面を更新してください。';
    if(/both_sides_required/i.test(msg))return '自分が渡すシールと、相手に希望するシールを1枚ずつ選んでください。';
    if(/sticker_unavailable|trade_items_changed/i.test(msg))return '選んだシールは交換できなくなりました。画面を更新してください。';
    return '通信に失敗しました。接続を確認して、もう一度お試しください。';
  }
  function setMessage(main,message,isError){const el=main.querySelector('#kpFriendsMessage');if(el){el.textContent=message||'';el.classList.toggle('is-error',!!isError);}}
  function shell({head}){
    return `${head('つながる・応援する','友だち','招待コードでつながり、定型カードで応援し合えます。')}
      <div class="kp-friends-status" id="kpFriendsMessage" role="status" aria-live="polite">アカウント情報を確認しています…</div>
      <div id="kpFriendsBody"><section class="kp-friends-card kp-friends-loading"><span class="kp-friends-spinner" aria-hidden="true"></span><p>友だち情報を読み込んでいます…</p></section></div>`;
  }
  async function getClientAndUser(){
    const api=window.KP_ACCOUNT_API;
    if(!api||typeof api.getClient!=='function')throw new Error('cloud_client_unavailable');
    const client=await api.getClient();
    if(!client)throw new Error('cloud_not_configured');
    const result=await client.auth.getSession();
    if(result.error)throw result.error;
    return {client,user:result.data.session&&result.data.session.user||null};
  }
  function mount(ctx){
    const sequence=++loadSequence;
    const main=ctx.main;
    load(ctx,main,sequence).catch(error=>{
      if(sequence!==loadSequence)return;
      const body=main.querySelector('#kpFriendsBody');
      if(body)body.innerHTML=`<section class="kp-friends-card kp-friends-error"><span aria-hidden="true">☁️</span><b>友だち情報を読み込めませんでした</b><p>${esc(errText(error))}</p><button class="kp-secondary" data-action="friends-retry">もう一度読み込む</button></section>`;
      setMessage(main,'',true);
    });
  }
  async function load(ctx,main,sequence){
    const {client,user}=await getClientAndUser();
    if(sequence!==loadSequence)return;
    if(!authSubscription){
      authSubscription=client.auth.onAuthStateChange((event)=>{
        if(event==='INITIAL_SESSION')return;
        setTimeout(()=>{
          if(document.querySelector('#kpFeatureRoot .kp-feature-nav [data-go="friends"].is-active'))ctx.render();
        },0);
      }).data.subscription;
    }
    const body=main.querySelector('#kpFriendsBody');
    if(!user){
      setMessage(main,'ログインすると友だち機能を使えます。',false);
      body.innerHTML=`<section class="kp-friends-card kp-friends-login"><span class="kp-friends-illustration" aria-hidden="true">🐼</span><h2>アカウントで友だちとつながろう</h2><p>招待コード、申請、カード、シール交換はアカウントに保存されます。端末を変えても続けられます。</p><button class="kp-primary" data-action="account">新規登録・ログイン</button></section>`;
      return;
    }
    setMessage(main,'データベースと同期しています…',false);
    const relationFilter=`user_low.eq.${user.id},user_high.eq.${user.id}`;
    const participantFilter=`from_user.eq.${user.id},to_user.eq.${user.id}`;
    const [profileRes,relationsRes,greetingsRes,tradesRes]=await Promise.all([
      client.from('kp_social_profiles').select('user_id,friend_code,nickname,progress_visible').eq('user_id',user.id).maybeSingle(),
      client.from('kp_friendships').select('id,user_low,user_high,requested_by,status,created_at,accepted_at').or(relationFilter).order('created_at',{ascending:false}).limit(100),
      client.from('kp_greeting_cards').select('id,from_user,to_user,card_key,created_at,read_at').or(participantFilter).order('created_at',{ascending:false}).limit(20),
      client.from('kp_sticker_trades').select('id,from_user,to_user,status,created_at,expires_at').or(participantFilter).order('created_at',{ascending:false}).limit(20)
    ]);
    for(const result of [profileRes,relationsRes,greetingsRes,tradesRes])if(result.error)throw result.error;
    const relations=relationsRes.data||[];
    const accepted=relations.filter(row=>row.status==='accepted');
    const pending=relations.filter(row=>row.status==='pending');
    const acceptedIds=accepted.map(row=>row.user_low===user.id?row.user_high:row.user_low);
    const relatedIds=pending.map(row=>row.user_low===user.id?row.user_high:row.user_low);
    const greetingIds=(greetingsRes.data||[]).map(row=>row.from_user===user.id?row.to_user:row.from_user);
    const tradeIds=(tradesRes.data||[]).map(row=>row.from_user===user.id?row.to_user:row.from_user);
    const profileIds=[...new Set([...acceptedIds,...relatedIds,...greetingIds,...tradeIds])].filter(id=>id!==user.id);
    let profiles={};
    if(profileIds.length){
      const profilesRes=await client.from('kp_social_profiles').select('user_id,nickname,progress_visible').in('user_id',profileIds);
      if(profilesRes.error)throw profilesRes.error;
      profiles=Object.fromEntries((profilesRes.data||[]).map(row=>[row.user_id,row]));
    }
    const progress=await Promise.all(accepted.map(async row=>{
      const id=row.user_low===user.id?row.user_high:row.user_low;
      if(!profiles[id]?.progress_visible)return [id,null];
      const result=await client.rpc('kp_friend_weekly_learning_days',{p_friend:id});
      return [id,result.error?null:result.data];
    }));
    let tradeItems=[];
    const tradeRows=tradesRes.data||[];
    if(tradeRows.length){
      const result=await client.rpc('kp_list_sticker_trade_items',{p_trade_ids:tradeRows.map(t=>t.id)});
      if(result.error)throw result.error;
      tradeItems=result.data||[];
    }
    snapshot={client,user,profile:profileRes.data,relations,accepted,pending,profiles,greetings:greetingsRes.data||[],trades:tradeRows,tradeItems,progress:Object.fromEntries(progress)};
    if(sequence!==loadSequence)return;
    body.innerHTML=renderBody(snapshot);
    setMessage(main,'最新の情報を表示しています。',false);
  }
  function requestRows(rows,user,profiles,incoming){
    if(!rows.length)return `<div class="kp-friends-empty-inline">${incoming?'新しい申請はありません。':'申請中の友だちはいません。'}</div>`;
    return `<div class="kp-friends-list">${rows.map(row=>{
      const other=row.user_low===user.id?row.user_high:row.user_low;
      const name=friendName(other,profiles);
      if(incoming)return `<article class="kp-friend-item"><span class="kp-friend-avatar" aria-hidden="true">✉️</span><div class="kp-friend-info"><b>${esc(name)}</b><small>あなたに友だち申請を送りました · ${shortDate(row.created_at)}</small></div><div class="kp-friend-actions"><button class="kp-primary kp-friend-action" data-action="friend-response" data-id="${esc(row.id)}" data-accept="true">承認</button><button class="kp-secondary kp-friend-action" data-action="friend-response" data-id="${esc(row.id)}" data-accept="false">断る</button></div></article>`;
      return `<article class="kp-friend-item"><span class="kp-friend-avatar" aria-hidden="true">⏳</span><div class="kp-friend-info"><b>${esc(name)}</b><small>申請を送信しました · ${shortDate(row.created_at)}</small></div><span class="kp-friends-pill">返事待ち</span></article>`;
    }).join('')}</div>`;
  }
  function renderBody(data){
    const {user,profile,accepted,pending,profiles,greetings,trades,tradeItems,progress}=data;
    if(!profile)return `<section class="kp-friends-card kp-friends-error"><b>アカウントの友だちプロフィールが見つかりません。</b><p>ログアウトして再度ログインしてください。解消しない場合は管理者に連絡してください。</p></section>`;
    const incoming=pending.filter(row=>row.requested_by!==user.id);
    const outgoing=pending.filter(row=>row.requested_by===user.id);
    const friends=accepted.map(row=>row.user_low===user.id?row.user_high:row.user_low);
    const incomingGreetings=greetings.filter(row=>row.to_user===user.id);
    const incomingTrades=trades.filter(row=>row.to_user===user.id&&row.status==='pending');
    const incomingGreetingsUnread=incomingGreetings.filter(g=>!g.read_at).length;
    return `<section class="kp-friends-card kp-my-friend-card">
      <div class="kp-my-friend-top"><div><span class="kp-eyebrow">1 · 招待コードを共有</span><p class="kp-friend-code-value">${esc(profile.friend_code)}</p><small>このコードを友だちに伝えてつながろう</small></div><button class="kp-secondary" data-action="copy-friend-code">コードをコピー</button></div>
      <form class="kp-friend-profile-form" id="kpFriendProfileForm"><label for="kpFriendNickname">友だちに表示する名前</label><div class="kp-friend-profile-controls"><input id="kpFriendNickname" name="nickname" maxlength="24" required value="${esc(profile.nickname)}" autocomplete="nickname"><button class="kp-primary">保存</button></div></form>
      <label class="kp-friend-privacy"><span><b>今週の学習日数を友だちに見せる</b><small>オフの間、学習日数は相手に表示されません。</small></span><input type="checkbox" data-action="friend-privacy" ${profile.progress_visible?'checked':''}></label>
    </section>

    <div class="kp-friends-overview" aria-label="友だちの状況">
      <div><b>${friends.length}</b><span>友だち</span></div>
      <div><b>${incoming.length}</b><span>届いた申請</span></div>
      <div><b>${incomingGreetingsUnread}</b><span>未読カード</span></div>
    </div>

    <section class="kp-friends-card kp-friend-add-card"><div class="kp-friends-section-heading"><span class="kp-friends-section-icon kp-friends-step">2</span><div><h2>招待コードで追加</h2><p>相手から教えてもらったコードを入力します。</p></div></div>
      <form class="kp-add-friend-form" id="kpFriendForm"><label for="kpFriendCodeInput">招待コード</label><div class="kp-add-friend-controls"><input id="kpFriendCodeInput" name="code" maxlength="12" placeholder="KP-AB12-XYZ" autocapitalize="characters" autocomplete="off" required><button class="kp-primary">申請を送る</button></div><small>名前やメールアドレスからは検索できません。</small></form>
    </section>

    <section class="kp-friends-card"><div class="kp-friends-section-heading"><span class="kp-friends-section-icon">💌</span><div><h2>友だち申請</h2><p>受け取った申請を承認すると、友だちに追加されます。</p></div></div><div class="kp-friends-subheading">届いた申請 <span>${incoming.length}</span></div>${requestRows(incoming,user,profiles,true)}<div class="kp-friends-subheading kp-friends-subheading-spaced">送った申請 <span>${outgoing.length}</span></div>${requestRows(outgoing,user,profiles,false)}</section>

    <section class="kp-friends-card"><div class="kp-friends-section-heading"><span class="kp-friends-section-icon">🐼</span><div><h2>友だち一覧</h2><p>カードで応援したり、シール交換を申し込めます。</p></div><span class="kp-friends-count">${friends.length}人</span></div>
      ${friends.length?`<div class="kp-friends-list">${friends.map(id=>{
        const p=profiles[id]||{};const days=progress[id];
        const study=p.progress_visible?(days===null||days===undefined?'学習記録を取得できません':`今週 ${days}日 学習`):'学習記録は非公開';
        return `<article class="kp-friend-item"><span class="kp-friend-avatar" aria-hidden="true">🐼</span><div class="kp-friend-info"><b>${esc(friendName(id,profiles))}</b><small>${esc(study)}</small></div><div class="kp-friend-actions"><button class="kp-secondary kp-friend-action" data-action="greet-friend" data-id="${esc(id)}">カード</button><button class="kp-primary kp-friend-action" data-action="trade-open" data-id="${esc(id)}">シール交換</button></div></article>`;
      }).join('')}</div>`:`<div class="kp-friends-empty"><span aria-hidden="true">🌱</span><b>友だちはまだいません</b><p>招待コードを伝えるか、相手のコードを入力してつながりましょう。</p></div>`}
    </section>

    <section class="kp-friends-card"><div class="kp-friends-section-heading"><span class="kp-friends-section-icon">🎁</span><div><h2>シール交換の申請</h2><p>交換は相手が内容を確認して承認すると成立します。</p></div><span class="kp-friends-count">${incomingTrades.length}件</span></div>
      ${trades.length?`<div class="kp-friends-list">${trades.slice(0,8).map(t=>{
        const incoming=t.to_user===user.id;const other=incoming?t.from_user:t.to_user;const items=tradeItems.filter(x=>x.trade_id===t.id);
        const giving=items.filter(x=>x.offered_by===user.id);const receiving=items.filter(x=>x.offered_by!==user.id);
        const itemNames=list=>list.length?list.map(x=>`<span class="kp-trade-sticker-chip"><span aria-hidden="true">${esc(x.glyph||'🎟️')}</span>${esc(x.title||'シール')}</span>`).join(''):'<span class="kp-trade-no-items">なし</span>';
        const details=items.length?`<div class="kp-trade-details"><div><small>あなたが渡す</small><div>${itemNames(giving)}</div></div><div><small>あなたが受け取る</small><div>${itemNames(receiving)}</div></div></div>`:`<p class="kp-trade-details-error">交換内容を読み込めません。更新して確認してください。</p>`;
        return `<article class="kp-friend-item kp-trade-item"><span class="kp-friend-avatar" aria-hidden="true">🎟️</span><div class="kp-friend-info"><b>${esc(friendName(other,profiles))}</b><small>${items.length}枚を含む交換 · ${shortDate(t.created_at)}</small></div><span class="kp-friends-pill">${esc(TRADE_STATUS[t.status]||t.status)}</span>${details}${t.status==='pending'?(incoming?`<div class="kp-friend-actions"><button class="kp-primary kp-friend-action" data-action="trade-reply" data-id="${esc(t.id)}" data-accept="true" ${items.length?'':'disabled'}>内容を確認して承認</button><button class="kp-secondary kp-friend-action" data-action="trade-reply" data-id="${esc(t.id)}" data-accept="false">断る</button></div>`:`<button class="kp-secondary kp-friend-action" data-action="trade-cancel" data-id="${esc(t.id)}">取り消す</button>`):''}</article>`;
      }).join('')}</div>`:`<div class="kp-friends-empty-inline">交換の申請はまだありません。</div>`}
    </section>

    <section class="kp-friends-card"><div class="kp-friends-section-heading"><span class="kp-friends-section-icon">💌</span><div><h2>受け取ったカード</h2><p>友だちから届いた応援メッセージです。</p></div><span class="kp-friends-count">${incomingGreetings.filter(g=>!g.read_at).length}件 未読</span></div>
      ${incomingGreetings.length?`<div class="kp-greeting-inbox">${incomingGreetings.slice(0,10).map(g=>`<article class="kp-greeting-item ${g.read_at?'is-read':'is-unread'}"><span aria-hidden="true">${esc(CARDS[g.card_key]?.icon||'💌')}</span><div><b>${esc(friendName(g.from_user,profiles))}</b><p>${esc(CARDS[g.card_key]?.text||'応援カードが届きました')}</p><small>${shortDate(g.created_at)}</small></div>${!g.read_at?`<button class="kp-secondary kp-friend-action" data-action="greeting-read" data-id="${esc(g.id)}">既読にする</button>`:''}</article>`).join('')}</div>`:`<div class="kp-friends-empty-inline">カードが届いたらここに表示されます。</div>`}
    </section>
    <p class="kp-friends-safety">自由入力のチャットやメール検索はありません。申請・応援カード・交換の状態はアカウントに保存されます。</p>`;
  }
  async function safeAction(ctx,fn){try{await fn();}catch(error){ctx.toast(errText(error));}}
  async function refresh(ctx){ctx.render();}
  async function updateProfile(ctx,form){
    if(!snapshot?.user)throw new Error('sign_in_required');
    const nickname=String(new FormData(form).get('nickname')||'').trim();
    if(!nickname||nickname.length>24){ctx.toast('表示名は1〜24文字で入力してください。');return;}
    const result=await snapshot.client.from('kp_social_profiles').update({nickname}).eq('user_id',snapshot.user.id);
    if(result.error)throw result.error;
    ctx.toast('友だちに表示する名前を保存しました。');await refresh(ctx);
  }
  async function sendRequest(ctx,form){
    const code=String(new FormData(form).get('code')||'').trim().toUpperCase();
    if(!/^KP-[A-Z0-9]{4}-[A-Z0-9]{3}$/.test(code)){ctx.toast('KP-AB12-XYZ の形式で入力してください。');return;}
    const result=await snapshot.client.rpc('kp_request_friend',{p_friend_code:code});
    if(result.error)throw result.error;
    const messages={request_sent:'友だち申請を送りました。',already_sent:'この相手には申請済みです。',incoming_request:'相手からの申請が届いています。申請一覧を確認してください。',already_friends:'この相手はすでに友だちです。',not_found:'招待コードが見つかりません。もう一度確認してください。',self:'自分の招待コードは使えません。',unavailable:'この相手には現在申請できません。'};
    ctx.toast(messages[result.data]||'申請を処理しました。');await refresh(ctx);
  }
  async function setPrivacy(ctx,input){
    const result=await snapshot.client.from('kp_social_profiles').update({progress_visible:input.checked}).eq('user_id',snapshot.user.id);
    if(result.error){input.checked=!input.checked;throw result.error;}
    ctx.toast(input.checked?'今週の学習日数を友だちに表示します。':'学習日数を非公開にしました。');
  }
  function greet(ctx,friendId){
    const name=friendName(friendId,snapshot.profiles);
    const cards=Object.entries(CARDS).map(([key,item])=>`<button class="kp-friend-card-choice" data-action="greeting-send" data-friend="${esc(friendId)}" data-card="${esc(key)}"><span>${item.icon}</span><b>${esc(item.text)}</b></button>`).join('');
    ctx.modal('応援カードを送る',`<p class="kp-modal-copy">${esc(name)}さんに送るカードを選んでください。</p><div class="kp-friend-card-choices">${cards}</div><p class="kp-friends-modal-note">メッセージは用意されたカードから選びます。</p>`);
  }
  async function sendGreeting(ctx,button){
    const result=await snapshot.client.rpc('kp_send_greeting',{p_friend:button.dataset.friend,p_card_key:button.dataset.card});
    if(result.error)throw result.error;
    ctx.closeModal();ctx.toast('応援カードを送りました。');await refresh(ctx);
  }
  async function markGreetingRead(ctx,id){
    const result=await snapshot.client.from('kp_greeting_cards').update({read_at:new Date().toISOString()}).eq('id',id).eq('to_user',snapshot.user.id).is('read_at',null);
    if(result.error)throw result.error;await refresh(ctx);
  }
  async function openTrade(ctx,friendId){
    const [mineRes,theirsRes]=await Promise.all([
      snapshot.client.from('kp_user_stickers').select('id,sticker_key').eq('user_id',snapshot.user.id).eq('is_favorite',false).is('locked_trade_id',null),
      snapshot.client.rpc('kp_list_friend_stickers',{p_friend:friendId})
    ]);
    if(mineRes.error)throw mineRes.error;if(theirsRes.error)throw theirsRes.error;
    const mine=mineRes.data||[],theirs=theirsRes.data||[];
    if(!mine.length||!theirs.length){
      const why=!mine.length?'あなたのアカウントに交換できるシールがまだありません。':'相手に交換できるシールがまだありません。';
      ctx.modal('シール交換',`<div class="kp-trade-empty"><span aria-hidden="true">🎟️</span><b>交換の準備ができていません</b><p>${esc(why)}</p><small>交換に使えるシールはデータベース上の所持数で確認します。お気に入りや申請中のシールは選べません。</small></div>`);return;
    }
    const allKeys=[...new Set([...mine.map(x=>x.sticker_key),...theirs.map(x=>x.sticker_key)])];
    const catalogRes=await snapshot.client.from('kp_sticker_catalog').select('sticker_key,title,glyph').in('sticker_key',allKeys);
    if(catalogRes.error)throw catalogRes.error;
    const catalog=Object.fromEntries((catalogRes.data||[]).map(row=>[row.sticker_key,row]));
    const option=(item,isMine)=>{const c=catalog[item.sticker_key]||{};const id=isMine?item.id:item.sticker_instance_id;return `<label class="kp-trade-option"><input type="checkbox" name="${isMine?'offer_ids':'want_ids'}" value="${esc(id)}"><span>${esc(c.glyph||'🎟️')}</span><b>${esc(c.title||item.title||'シール')}</b></label>`;};
    const name=friendName(friendId,snapshot.profiles);
    ctx.modal('シール交換を申し込む',`<form id="kpTradeCreateForm" class="kp-trade-create-form" data-friend="${esc(friendId)}"><p class="kp-modal-copy">${esc(name)}さんに渡すシールと、相手から受け取りたいシールを選びます。どちらも相手の承認前に交換が成立することはありません。</p><fieldset><legend>あなたが渡すシール</legend><div class="kp-trade-options">${mine.map(x=>option(x,true)).join('')}</div></fieldset><fieldset><legend>相手から受け取りたいシール</legend><div class="kp-trade-options">${theirs.map(x=>option(x,false)).join('')}</div></fieldset><p class="kp-modal-copy">双方のシールは返事があるまで一時的に予約されます。申請後も相手は断ることができます。</p><button class="kp-primary">交換を申し込む</button></form>`);
  }
  async function createTrade(ctx,form){
    const data=new FormData(form);const offers=data.getAll('offer_ids').map(String);const wants=data.getAll('want_ids').map(String);
    if(!offers.length||!wants.length){ctx.toast('両方から交換するシールを選んでください。');return;}
    if(offers.length>10||wants.length>10){ctx.toast('一度に選べるシールは各10枚までです。');return;}
    const result=await snapshot.client.rpc('kp_create_sticker_trade',{p_friend:form.dataset.friend,p_offer_ids:offers,p_want_ids:wants});
    if(result.error)throw result.error;ctx.closeModal();ctx.toast('交換を申し込みました。相手の返事を待ちましょう。');await refresh(ctx);
  }
  async function replyTrade(ctx,id,accept){
    const result=await snapshot.client.rpc('kp_reply_sticker_trade',{p_trade_id:id,p_accept:accept});
    if(result.error)throw result.error;
    ctx.toast(result.data==='completed'?'交換が成立しました。':result.data==='declined'?'交換を断りました。':result.data==='expired'?'申請の期限が切れています。':'処理しました。');await refresh(ctx);
  }
  async function cancelTrade(ctx,id){
    const result=await snapshot.client.rpc('kp_cancel_sticker_trade',{p_trade_id:id});
    if(result.error)throw result.error;ctx.toast('交換申請を取り消しました。');await refresh(ctx);
  }
  window.KoepandaFeatures.friends=shell;
  window.KoepandaFeatures.friends.mount=mount;
  window.KoepandaFeatures.friends.actions={
    'friends-retry':ctx=>safeAction(ctx,()=>refresh(ctx)),
    'copy-friend-code':ctx=>safeAction(ctx,async()=>{
      const code=snapshot?.profile?.friend_code;if(!code)throw new Error('profile_missing');
      try{await navigator.clipboard.writeText(code);ctx.toast('招待コードをコピーしました。');}
      catch(_){ctx.toast(`あなたの招待コード：${code}`);}
    }),
    account:()=>document.getElementById('kpAccountTrigger')?.click(),
    'greet-friend':(ctx,b)=>greet(ctx,b.dataset.id),
    'greeting-send':(ctx,b)=>safeAction(ctx,()=>sendGreeting(ctx,b)),
    'friend-response':(ctx,b)=>safeAction(ctx,async()=>{
      const result=await snapshot.client.rpc('kp_reply_friend',{p_request_id:b.dataset.id,p_accept:b.dataset.accept==='true'});
      if(result.error)throw result.error;ctx.toast(result.data==='accepted'?'友だちになりました。':'申請を断りました。');await refresh(ctx);
    }),
    'trade-open':(ctx,b)=>safeAction(ctx,()=>openTrade(ctx,b.dataset.id)),
    'trade-reply':(ctx,b)=>safeAction(ctx,()=>replyTrade(ctx,b.dataset.id,b.dataset.accept==='true')),
    'trade-cancel':(ctx,b)=>safeAction(ctx,()=>cancelTrade(ctx,b.dataset.id)),
    'greeting-read':(ctx,b)=>safeAction(ctx,()=>markGreetingRead(ctx,b.dataset.id))
  };
  window.KoepandaFeatures.friends.submit=(ctx,event)=>{
    const form=event.target;
    if(form.id==='kpFriendForm'){event.preventDefault();safeAction(ctx,()=>sendRequest(ctx,form));return true;}
    if(form.id==='kpFriendProfileForm'){event.preventDefault();safeAction(ctx,()=>updateProfile(ctx,form));return true;}
    if(form.id==='kpTradeCreateForm'){event.preventDefault();safeAction(ctx,()=>createTrade(ctx,form));return true;}
    return false;
  };
  window.KoepandaFeatures.friends.change=(ctx,event)=>{
    if(event.target.dataset.action!=='friend-privacy')return false;
    safeAction(ctx,()=>setPrivacy(ctx,event.target));return true;
  };
})();
