/* Koepanda app shell — shared routing, state and UI shell.
   Feature modules are isolated so a missing page module cannot stop the whole shell. */
(function(){
  'use strict';
  const KEY='koepanda.community.301166';
  const STICKERS=(window.KoepandaCatalog&&Array.isArray(window.KoepandaCatalog.STICKERS))?window.KoepandaCatalog.STICKERS:[];
  const QUESTIONS=(window.KoepandaFeatures&&window.KoepandaFeatures.practice&&Array.isArray(window.KoepandaFeatures.practice.questions))?window.KoepandaFeatures.practice.questions:[];
  const initial={pages:[[]], activePage:0, wrongs:{}, mastered:{}, unlocked:['a','o','n','shan','ren'], favorites:[], lastQuiz:0};
  let state;
  try{state=Object.assign({},initial,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(_){state=Object.assign({},initial);}
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
  let root, page='learn', selectedSticker=null;
  function boot(){
    if(document.getElementById('kpFeatureRoot'))return;
    root=el('div','kp-feature-root');root.id='kpFeatureRoot';root.setAttribute('aria-hidden','true');root.innerHTML=`<div class="kp-feature-frame"><header class="kp-feature-header"><button class="kp-brand" data-go="learn" aria-label="Koepanda 学習ホーム"><img class="kp-logo-art" src="./assets/brand/koepanda-logo.jpeg?v=10.108.301.185" alt="小音と声調コーチ Koepanda" width="1536" height="864"></button></header><nav class="kp-feature-nav" aria-label="メインメニュー"><button data-go="learn"><span>学習</span></button><button data-go="practice"><span>練習</span></button><button data-go="friends"><span>友だち</span></button><button data-go="story"><span>ストーリー</span></button><button data-go="self"><span>自分</span></button></nav><main class="kp-feature-main" id="kpFeatureMain"></main><p class="kp-prototype-note">友だち機能はログイン後に使えます。自由入力のチャットはありません。</p></div><dialog class="kp-modal" id="kpModal"><div class="kp-modal-body"></div></dialog></div>`;
    document.body.append(root);
    root.addEventListener('click',onClick);
    root.addEventListener('submit',onSubmit);
    root.addEventListener('change',onChange);
    root.addEventListener('pointerdown',e=>dispatchFeaturePointer('pointerDown',e));
    root.addEventListener('pointermove',e=>dispatchFeaturePointer('pointerMove',e));
    root.addEventListener('pointerup',e=>dispatchFeaturePointer('pointerUp',e));
    root.addEventListener('pointercancel',e=>dispatchFeaturePointer('pointerUp',e));
    window.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.classList.contains('is-open'))open('learn');});
    document.addEventListener('click',function(e){const a=e.target.closest('#homeEffect a.home-effect-hotspot.roadmap-hs-listen,#homeEffect a.home-effect-hotspot.roadmap-hs-talk,#homeEffect a.home-effect-hotspot.roadmap-hs-repeat');if(!a)return;e.preventDefault();e.stopImmediatePropagation();open('practice',a.classList.contains('roadmap-hs-listen')?'listen':a.classList.contains('roadmap-hs-talk')?'talk':'repeat');},true);
    render();
    root.classList.add('is-open');root.setAttribute('aria-hidden','false');document.body.classList.add('kp-feature-active');
    const previousHome=window.returnToAppHome;window.returnToAppHome=function(){if(previousHome)previousHome();open('learn');};
  }
  function open(where='practice'){page=where;root.classList.add('is-open');root.setAttribute('aria-hidden','false');document.body.classList.add('kp-feature-active');render();}
  function close(){root.classList.remove('is-open');root.setAttribute('aria-hidden','true');document.body.classList.remove('kp-feature-active');}
  function render(){
    if(!root)return;
    const main=root.querySelector('#kpFeatureMain');
    const active=page==='book'||page==='rewards'?'self':page;
    root.querySelectorAll('.kp-feature-nav [data-go]').forEach(b=>b.classList.toggle('is-active',b.dataset.go===active));
    const key=page==='book'?'sticker_book':page==='learn'?'learn':page==='practice'?'practice':page==='friends'?'friends':page==='story'?'story':page==='self'?'self':'rewards';
    const view=window.KoepandaFeatures&&window.KoepandaFeatures[key];
    if(typeof view!=='function'){
      main.innerHTML=`<section class="kp-feature-error" role="alert"><h1>このページを読み込めませんでした</h1><p>読み込みが途中で止まった可能性があります。学習ホームへ戻るか、ページを再読み込みしてください。</p><button class="kp-primary" data-go="learn">学習ホームへ戻る</button></section>`;
      return;
    }
    try{main.innerHTML=view({state,img,head,safe,save,STICKERS,QUESTIONS,selectedSticker});if(typeof view.mount==='function')view.mount({state,img,head,safe,save,STICKERS,QUESTIONS,selectedSticker,main,root,render,toast,modal,closeModal});}
    catch(error){console.error('[Koepanda] feature render failed:',key,error);main.innerHTML=`<section class="kp-feature-error" role="alert"><h1>ページを表示できませんでした</h1><p>このページの読み込み中に問題が起きました。ほかのページへ移動できます。</p><button class="kp-primary" data-go="learn">学習ホームへ戻る</button></section>`;}
  }
  function head(eyebrow,title,sub){return `<div class="kp-page-head"><span class="kp-eyebrow">${eyebrow}</span><h1>${title}</h1><p>${sub}</p></div>`;}
  function actionContext(){return {state,save,safe,img,head,STICKERS,QUESTIONS,selectedSticker,setSelectedSticker:value=>{selectedSticker=value;},setPage:value=>{page=value;},root,render,toast,modal,closeModal};}
  function onClick(e){
    const go=e.target.closest('[data-go]');if(go){page=go.dataset.go;render();return;}
    const b=e.target.closest('[data-action]');if(!b)return;const action=b.dataset.action;
    if(action==='close'){open('learn');return;}
    if(action==='account'){document.getElementById('kpAccountTrigger')?.click();return;}
    if(action==='pinyin-course'){close();window.koepandaEnterKidsCourse?.(e);return;}
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
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
