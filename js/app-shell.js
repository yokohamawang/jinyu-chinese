/* Koepanda app shell — shared routing, state and UI shell.
   Local interactions are device-local prototypes. Real friend sync/trades require the supplied SQL RPC migration. */
(function(){
  'use strict';
  const KEY='koepanda.community.301166';
  const STICKERS=window.KoepandaCatalog.STICKERS, QUESTIONS=window.KoepandaFeatures.practice.questions;
  const initial={friends:[], greetings:[], pages:[[]], activePage:0, wrongs:{}, mastered:{}, unlocked:['a','o','n','shan','ren'], favorites:[], trades:[], lastQuiz:0};
  let state;
  try{state=Object.assign({},initial,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(_){state=Object.assign({},initial);}
  if(!Array.isArray(state.friends))state.friends=[];
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(_){}}
  function img(id){const s=STICKERS.find(x=>x.id===id);return s?'./assets/stickers/'+s.art:'';}
  function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
  function safe(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  let root, page='learn', selectedSticker=null;
  function boot(){
    if(document.getElementById('kpFeatureRoot'))return;
    root=el('div','kp-feature-root');root.id='kpFeatureRoot';root.setAttribute('aria-hidden','true');root.innerHTML=`<div class="kp-feature-frame"><header class="kp-feature-header"><button class="kp-header-mascot" data-go="learn" aria-label="学習ホーム"><img src="./assets/brand/xiaoyin-mascot.png" alt=""></button><button class="kp-brand" data-go="learn" aria-label="Koepanda 学習ホーム"><img class="kp-logo-art" src="./assets/brand/koepanda-logo.jpeg" alt="声調コーチ Koepanda"></button><button class="kp-profile-shortcut" data-go="self" aria-label="自分のページ"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.5" r="3.6"></circle><path d="M4.6 20c.6-3.7 3.1-5.7 7.4-5.7s6.8 2 7.4 5.7"></path></svg></button></header><nav class="kp-feature-nav" aria-label="メインメニュー"><button data-go="learn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m2.5 8.3 9.5-5 9.5 5-9.5 5z"></path><path d="M6.2 10.4v5.1c3.6 2.7 8 2.7 11.6 0v-5.1M21.5 8.5v6"></path></svg><span>学習</span></button><button data-go="practice"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8v8M4.5 9.5v5M17 8v8m2.5-6.5v5M7 12h10"></path></svg><span>練習</span></button><button data-go="friends"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="8" r="3"></circle><circle cx="17" cy="9" r="2.5"></circle><path d="M2.5 19c.4-3.2 2.2-4.8 5.5-4.8s5.1 1.6 5.5 4.8M14 15c3.8-.4 6.1 1 7 4"></path></svg><span>友だち</span></button><button data-go="story"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 5.5c3.6-.9 6.4-.2 8.5 1.5v13c-2.1-1.7-4.9-2.4-8.5-1.5zM20.5 5.5c-3.6-.9-6.4-.2-8.5 1.5v13c2.1-1.7 4.9-2.4 8.5-1.5z"></path></svg><span>ストーリー</span></button><button data-go="self"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.5" r="3.4"></circle><path d="M4.5 20c.5-3.7 3-5.6 7.5-5.6s7 1.9 7.5 5.6"></path></svg><span>自分</span></button></nav><main class="kp-feature-main" id="kpFeatureMain"></main><p class="kp-prototype-note">友だちとの送受信・シール交換は、正式サービス接続後に使えます。</p></div><dialog class="kp-modal" id="kpModal"><div class="kp-modal-body"></div></dialog></div>`;
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
  function render(){const main=root.querySelector('#kpFeatureMain');const active=page==='book'||page==='rewards'?'self':page;root.querySelectorAll('.kp-feature-nav [data-go]').forEach(b=>b.classList.toggle('is-active',b.dataset.go===active));const key=page==='book'?'sticker_book':page==='learn'?'learn':page==='practice'?'practice':page==='friends'?'friends':page==='story'?'story':page==='self'?'self':'rewards';const view=window.KoepandaFeatures[key];main.innerHTML=view?view({state,img,head,safe,save,STICKERS,QUESTIONS,selectedSticker}):'<p>ページを読み込めませんでした。</p>'; }
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
    const ctx=actionContext();for(const feature of Object.values(window.KoepandaFeatures)){const handler=feature.actions&&feature.actions[action];if(handler){handler(ctx,b,e);return;}}
  }
  function dispatchFeaturePointer(name,e){const feature=window.KoepandaFeatures.sticker_book,handler=feature&&feature[name];if(handler)handler(actionContext(),e);}
  function onSubmit(e){for(const feature of Object.values(window.KoepandaFeatures)){if(feature.submit&&feature.submit(actionContext(),e))return;}}
  function onChange(e){for(const feature of Object.values(window.KoepandaFeatures)){if(feature.change&&feature.change(actionContext(),e))return;}}
  function modal(title,body){const d=root.querySelector('#kpModal');d.querySelector('.kp-modal-body').innerHTML=`<button class="kp-modal-x" data-action="modal-close" aria-label="閉じる">×</button><span class="kp-eyebrow">KOEPANDA</span><h2>${title}</h2>${body}`;d.showModal();}
  function closeModal(){const d=root.querySelector('#kpModal');if(d.open)d.close();}
  function toast(message){let t=root.querySelector('.kp-toast');if(!t){t=el('div','kp-toast');root.querySelector('.kp-feature-frame').append(t);}t.textContent=message;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),3200);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
