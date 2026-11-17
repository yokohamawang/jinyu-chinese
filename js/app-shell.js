/* Koepanda app shell — shared routing, state and UI shell.
   Feature modules are isolated so a missing page module cannot stop the whole shell. */
(function(){
  'use strict';
  const KEY='koepanda.community.301166';
  const STICKERS=(window.KoepandaCatalog&&Array.isArray(window.KoepandaCatalog.STICKERS))?window.KoepandaCatalog.STICKERS:[];
  const QUESTIONS=(window.KoepandaFeatures&&window.KoepandaFeatures.practice&&Array.isArray(window.KoepandaFeatures.practice.questions))?window.KoepandaFeatures.practice.questions:[];
  const initial={pages:[[]], activePage:0, wrongs:{}, mastered:{}, unlocked:[], favorites:[], lastQuiz:0};
  let state;
  try{state=Object.assign({},initial,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(_){state=Object.assign({},initial);}
  if(state.stickerCollectionVersion!==1){state.unlocked=[];state.favorites=[];state.stickerCollectionVersion=1;}
  ['pages','unlocked','favorites'].forEach(k=>{if(!Array.isArray(state[k]))state[k]=initial[k].slice();});
  ['friends','greetings','trades','friendCode','progressVisible'].forEach(k=>delete state[k]);
  ['wrongs','mastered'].forEach(k=>{if(!state[k]||typeof state[k]!=='object'||Array.isArray(state[k]))state[k]={};});
  if(!state.pages.length)state.pages=[[]];
  state.pages=state.pages.map(p=>Array.isArray(p)?p:[]);
  state.activePage=Math.max(0,Math.min(state.pages.length-1,Number.isInteger(state.activePage)?state.activePage:0));
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(_){}}
  save();
  function img(id){const s=STICKERS.find(x=>x.id===id);return s?'./assets/stickers/'+s.art:'';}
  function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
  function safe(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  let root, page=new URLSearchParams(location.search).get('open')==='practice'?'practice':'learn', selectedSticker=null, pendingPinyin=false;
  let ownPresenceClient=null,ownPresenceChannel=null,ownPresenceAuth=null,ownPresenceBusy=false;
  async function syncOwnPresence(){
    if(ownPresenceBusy)return;ownPresenceBusy=true;
    try{
      const api=window.KP_ACCOUNT_API;if(!api||typeof api.getClient!=='function')return;
      const client=await api.getClient();if(!client)return;ownPresenceClient=client;
      const sessionResult=await client.auth.getSession();const user=sessionResult.data?.session?.user;
      const stop=async()=>{if(ownPresenceChannel){const channel=ownPresenceChannel;ownPresenceChannel=null;try{await client.removeChannel(channel);}catch(_){}}};
      if(!user){await stop();return;}
      const profile=await client.from('kp_social_profiles').select('online_visible').eq('user_id',user.id).maybeSingle();
      if(profile.error||!profile.data?.online_visible){await stop();return;}
      if(ownPresenceChannel&&ownPresenceChannel.topic===`realtime:kp-presence-${user.id}`)return;
      await stop();
      const channel=client.channel(`kp-presence-${user.id}`,{config:{private:true,presence:{key:user.id}}});ownPresenceChannel=channel;
      channel.subscribe(async status=>{if(status==='SUBSCRIBED'&&ownPresenceChannel===channel){const result=await channel.track({user_id:user.id});if(result==='error')console.warn('[Koepanda] presence publish failed');}});
    }catch(error){console.warn('[Koepanda] presence sync unavailable:',error);}
    finally{ownPresenceBusy=false;}
  }
  function startPresenceManager(){
    window.KP_PRESENCE_MANAGER={refresh:syncOwnPresence,stop:async()=>{if(ownPresenceClient&&ownPresenceChannel){const channel=ownPresenceChannel;ownPresenceChannel=null;try{await ownPresenceClient.removeChannel(channel);}catch(_){}}}};
    Promise.resolve().then(syncOwnPresence);
    const api=window.KP_ACCOUNT_API;if(api&&typeof api.getClient==='function')Promise.resolve(api.getClient()).then(client=>{if(client&&!ownPresenceAuth)ownPresenceAuth=client.auth.onAuthStateChange(()=>setTimeout(syncOwnPresence,0)).data.subscription;}).catch(()=>{});
  }
  function boot(){
    if(root)return;
    root=document.getElementById('kpFeatureRoot');
    if(!root){
    root=el('div','kp-feature-root');root.id='kpFeatureRoot';root.setAttribute('aria-hidden','true');root.innerHTML=`<div class="kp-feature-frame"><header class="kp-feature-header"><button class="kp-brand" data-go="learn" aria-label="Koepanda 学習ホーム"><img class="kp-logo-art" src="./assets/brand/koepanda-logo.jpeg?v=10.108.301.185" alt="小音と声調コーチ Koepanda" width="1536" height="864"></button></header><nav class="kp-feature-nav" aria-label="メインメニュー"><button data-go="learn"><span>学習</span></button><button data-go="practice"><span>練習</span></button><button data-go="story"><span>ストーリー</span></button><button data-go="friends"><span>友だち</span></button><button data-go="self"><span>自分</span></button></nav><main class="kp-feature-main" id="kpFeatureMain"></main><p class="kp-prototype-note">友だち機能はログイン後に使えます。自由入力のチャットはありません。</p></div><dialog class="kp-modal" id="kpModal"><div class="kp-modal-body"></div></dialog></div>`;
    document.body.append(root);
    }
    root.addEventListener('click',onClick);
    root.addEventListener('submit',onSubmit);
    root.addEventListener('change',onChange);
    root.addEventListener('pointerdown',e=>dispatchFeaturePointer('pointerDown',e));
    root.addEventListener('pointermove',e=>dispatchFeaturePointer('pointerMove',e));
    root.addEventListener('pointerup',e=>dispatchFeaturePointer('pointerUp',e));
    root.addEventListener('pointercancel',e=>dispatchFeaturePointer('pointerUp',e));
    window.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.classList.contains('is-open'))open('learn');});
    render();
    root.scrollTop=0;
    root.querySelectorAll('[data-shell-wait]').forEach(button=>{button.disabled=false;button.removeAttribute('aria-disabled');button.removeAttribute('data-shell-wait');});
    root.dataset.shellState='ready';
    window.dispatchEvent(new Event('kp-shell-ready'));
    root.classList.add('is-open');root.setAttribute('aria-hidden','false');document.body.classList.add('kp-feature-active');
    startPresenceManager();
    window.addEventListener('kp-auth-state-changed',()=>{state.remoteReviewLoadedAt=0;if(page==='practice')render();});
    window.addEventListener('kp-practice-state-changed',()=>{state.remoteReviewLoadedAt=0;});
    window.addEventListener('pageshow',event=>{if(event.persisted){state.remoteReviewLoadedAt=0;if(page==='practice')render();}});
    const bindHomeReturn=()=>{const previousHome=window.returnToAppHome;window.returnToAppHome=function(){if(previousHome)previousHome();open('learn');};};
    const lessonsReady=()=>{bindHomeReturn();};
    window.addEventListener('kp-pinyin-ready',()=>{if(pendingPinyin&&page==='learn')enterPinyin();});
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(lessonsReady,0),{once:true});else lessonsReady();
  }
  function open(where='practice'){pendingPinyin=false;page=where;root.scrollTop=0;window.scrollTo(0,0);root.classList.add('is-open');root.setAttribute('aria-hidden','false');document.body.classList.add('kp-feature-active');render();}
  function close(){root.classList.remove('is-open');root.setAttribute('aria-hidden','true');document.body.classList.remove('kp-feature-active');}
  function updateMain(main,html){
    // Background account/goal updates must not detach the image being downloaded.
    const current=page==='learn'&&main.querySelector('.kp-learning-home');
    if(current){
      const template=document.createElement('template');template.innerHTML=html;
      const next=template.content.querySelector('.kp-learning-home');
      const sections=['.kp-study-record','.kp-study-stamps'];
      if(next&&current.querySelector('.kp-learning-map')&&sections.every(selector=>current.querySelector(selector)&&next.querySelector(selector))){
        sections.forEach(selector=>current.querySelector(selector).replaceWith(next.querySelector(selector)));
        return;
      }
    }
    main.innerHTML=html;
  }
  function render(){
    if(!root)return;
    const main=root.querySelector('#kpFeatureMain');
    const active=page==='book'||page==='rewards'?'self':page==='records'?'learn':page;
    root.querySelectorAll('.kp-feature-nav [data-go]').forEach(b=>b.classList.toggle('is-active',b.dataset.go===active));
    const key=page==='book'?'sticker_book':page==='records'?'learning_records':page==='learn'?'learn':page==='practice'?'practice':page==='friends'?'friends':page==='story'?'story':page==='self'?'self':'rewards';
    const view=window.KoepandaFeatures&&window.KoepandaFeatures[key];
    if(typeof view!=='function'){
      main.innerHTML=`<section class="kp-feature-error" role="alert"><h1>このページを読み込めませんでした</h1><p>読み込みが途中で止まった可能性があります。学習ホームへ戻るか、ページを再読み込みしてください。</p><button class="kp-primary" data-go="learn">学習ホームへ戻る</button></section>`;
      return;
    }
    try{updateMain(main,view({state,img,head,safe,save,STICKERS,QUESTIONS,selectedSticker}));if(typeof view.mount==='function')view.mount({state,img,head,safe,save,STICKERS,QUESTIONS,selectedSticker,main,root,render,toast,modal,closeModal});}
    catch(error){console.error('[Koepanda] feature render failed:',key,error);main.innerHTML=`<section class="kp-feature-error" role="alert"><h1>ページを表示できませんでした</h1><p>このページの読み込み中に問題が起きました。ほかのページへ移動できます。</p><button class="kp-primary" data-go="learn">学習ホームへ戻る</button></section>`;}
  }
  function head(eyebrow,title,sub){return `<div class="kp-page-head"><span class="kp-eyebrow">${eyebrow}</span><h1>${title}</h1><p>${sub}</p></div>`;}
  function actionContext(){return {state,save,safe,img,head,STICKERS,QUESTIONS,selectedSticker,setSelectedSticker:value=>{selectedSticker=value;},setPage:value=>{page=value;root.scrollTop=0;window.scrollTo(0,0);},root,render,toast,modal,closeModal};}
  window.KP_REWARD_CONTEXT=actionContext;
  window.KP_OPEN_STICKER_BOOK=function(){state.bookOpen=true;state.coversOpen=false;state.bookReady=false;state.bookLoadError=false;state.bookError=false;state.bookFocusInventory=true;open('book');};
  function enterPinyin(){
    if(!window.KP_PINYIN_READY||typeof window.koepandaEnterKidsCourse!=='function'){toast('教材を準備しています。準備ができると自動で開きます。');return;}
    pendingPinyin=false;
    close();window.koepandaEnterKidsCourse();
  }
  function onClick(e){
    const go=e.target.closest('[data-go]');if(go){pendingPinyin=false;if(go.dataset.go==='book'){state.bookOpen=false;state.bookReady=false;state.coversOpen=false;}page=go.dataset.go;root.scrollTop=0;window.scrollTo(0,0);render();return;}
    const b=e.target.closest('[data-action]');if(!b)return;const action=b.dataset.action;
    if(action==='close'){open('learn');return;}
    if(action==='account'){const account=window.KP_ACCOUNT_API;if(account&&typeof account.open==='function')account.open();else toast('ログイン画面を読み込めませんでした。ページを再読み込みしてください。');return;}
    if(action==='pinyin-course'){if(!window.KP_PINYIN_READY){pendingPinyin=true;toast('ピンイン教材を準備しています。準備ができると自動で開きます。');return;}enterPinyin();return;}
    if(action==='legacy'){close();const area=b.dataset.mode==='listen'?'listen':b.dataset.mode==='talk'?'chat':'repeat';if(window.openHomeArea)window.openHomeArea(area);return;}
    if(action==='modal-close'){closeModal();return;}
    const ctx=actionContext();for(const feature of Object.values(window.KoepandaFeatures||{})){const handler=feature&&feature.actions&&feature.actions[action];if(handler){try{handler(ctx,b,e);}catch(error){console.error('[Koepanda] action failed:',action,error);toast('操作を完了できませんでした。もう一度お試しください。');}return;}}
  }
  function dispatchFeaturePointer(name,e){const feature=window.KoepandaFeatures.sticker_book,handler=feature&&feature[name];if(handler)handler(actionContext(),e);}
  function onSubmit(e){for(const feature of Object.values(window.KoepandaFeatures||{})){if(feature&&feature.submit){try{if(feature.submit(actionContext(),e))return;}catch(error){console.error('[Koepanda] form action failed:',error);toast('送信を完了できませんでした。入力内容を確認してもう一度お試しください。');return;}}}}
  function onChange(e){for(const feature of Object.values(window.KoepandaFeatures||{})){if(feature&&feature.change){try{if(feature.change(actionContext(),e))return;}catch(error){console.error('[Koepanda] setting update failed:',error);toast('設定を保存できませんでした。もう一度お試しください。');return;}}}}
  function modal(title,body){const d=root.querySelector('#kpModal');d.querySelector('.kp-modal-body').innerHTML=`<button class="kp-modal-x" data-action="modal-close" aria-label="閉じる">×</button><span class="kp-eyebrow">KOEPANDA</span><h2>${title}</h2>${body}`;d.showModal();}
  function closeModal(){const d=root.querySelector('#kpModal');if(d.open)d.close();}
  function toast(message){let t=root.querySelector('.kp-toast');if(!t){t=el('div','kp-toast');root.querySelector('.kp-feature-frame').append(t);}t.textContent=message;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),3200);}
  if(document.getElementById('kpFeatureRoot'))boot();else if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
