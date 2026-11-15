(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};
  const COVERS=[
    {id:'zodiac_rat',name:'十二支・ねずみ',sub:'好奇心いっぱいのねずみ',className:'cover-rat',mark:'子',image:'assets/stickers/zodiac/rat.png'},
    {id:'zodiac_ox',name:'十二支・うし',sub:'ゆったりやさしいうし',className:'cover-zodiac',mark:'丑',image:'assets/stickers/zodiac/ox.png'},
    {id:'zodiac_tiger',name:'十二支・とら',sub:'元気いっぱいのとら',className:'cover-tiger',mark:'寅',image:'assets/stickers/zodiac/tiger.png'},
    {id:'clear_rabbit',name:'十二支・うさぎ',sub:'草花と遊ぶうさぎ',className:'cover-rabbit',mark:'卯',image:'assets/stickers/zodiac/rabbit.png'},
    {id:'zodiac_dragon',name:'十二支・りゅう',sub:'きらめくりゅう',className:'cover-zodiac',mark:'辰',image:'assets/stickers/zodiac/dragon.png'},
    {id:'zodiac_snake',name:'十二支・へび',sub:'すてきな模様のへび',className:'cover-zodiac',mark:'巳',image:'assets/stickers/zodiac/snake.png'},
    {id:'xiaoyin_sparkle',name:'小音のきらきら',sub:'やさしいピンクと星の箔',className:'cover-sparkle',mark:'✦',art:'🌙'},
    {id:'xiaoyin_study',name:'小音のひみつノート',sub:'小音といっしょに学ぶノート風',className:'cover-study',mark:'NOTE',image:'assets/stickers/covers/xiaoyin-hearts-cover.png'},
    {id:'xiaoyin_reader',name:'小音と読書',sub:'本を読む小音のきらきら表紙',className:'cover-character-pink',mark:'BOOK',image:'assets/stickers/covers/xiaoyin-happy.png'},
    {id:'zodiac_horse',name:'十二支・うま',sub:'風のように走るうま',className:'cover-zodiac',mark:'午',image:'assets/stickers/zodiac/horse.png'},
    {id:'peach_goat',name:'十二支・ひつじ',sub:'もも色のやさしいひつじ',className:'cover-peach',mark:'未',image:'assets/stickers/zodiac/goat.png'},
    {id:'zodiac_monkey',name:'十二支・さる',sub:'遊ぶのが大好きなさる',className:'cover-zodiac',mark:'申',image:'assets/stickers/zodiac/monkey.png'},
    {id:'zodiac_rooster',name:'十二支・とり',sub:'朝を知らせるにわとり',className:'cover-zodiac',mark:'酉',image:'assets/stickers/zodiac/rooster.png'},
    {id:'zodiac_dog',name:'十二支・いぬ',sub:'いつもいっしょのいぬ',className:'cover-zodiac',mark:'戌',image:'assets/stickers/zodiac/dog.png'},
    {id:'zodiac_pig',name:'十二支・いのしし',sub:'のんびりかわいいいのしし',className:'cover-zodiac',mark:'亥',image:'assets/stickers/zodiac/pig.png'},
    {id:'zodiac_album',name:'十二支コレクション',sub:'十二支となかよくなる表紙',className:'cover-zodiac',mark:'十二支',art:'🐉'},
    {id:'clear_mint',name:'クリアミント',sub:'すっきり透明感のあるデザイン',className:'cover-mint',mark:'✧',art:'🍃'},
    {id:'xiaoyin_friends',name:'小音とパンダ',sub:'パンダといっしょの小音',className:'cover-character-blue',mark:'♡',image:'assets/stickers/covers/xiaoyin-calm.webp'}
  ];
  const COVERS_PER_PAGE=9;
  const MAX_TRAILING_EMPTY_PAGES=2;
  let drag=null, dragGhost=null, suppressInventoryClick='', suppressPlacedClick='', suppressClickUntil=0, loadSequence=0, saveTimer=0, account=null;
  const feature=window.KoepandaFeatures.sticker_book=function({state,safe}){
    if(!state.bookReady)return `<section class="kp-book-loading"><span>📖</span><b>シール帳を準備中…</b></section>`;
    if(state.bookLoadError)return `<section class="kp-book-login"><span>☁️</span><h1>データに接続できません</h1><p>ネットワークを確認して、もう一度お試しください。</p><button class="kp-primary" data-action="retry">再読み込み</button></section>`;
    if(!account)return `<section class="kp-book-login"><span>📚</span><h1>シール帳をひらこう</h1><p>集めたシールやページの配置を、アカウントに保存します。</p><button class="kp-primary" data-action="account">ログインして使う</button></section>`;
    if(!state.bookOpen)return renderCover(state);
    const pages=state.bookPages||[], page=pages[state.bookPage]||{items:[]},items=page.items||[];
    const emptyTail=trailingEmptyPageCount(pages),pageAddDisabled=emptyTail>=MAX_TRAILING_EMPTY_PAGES||state.bookPageCreating;
    const owned=state.bookInventory||[], used=new Set(items.map(i=>i.userStickerId));
    return `<section class="kp-book-shell ${coverById(state.bookCover).className}"><div class="kp-open-book-head"><button class="kp-book-back" data-action="close-book" aria-label="自分のページへ戻る"><span aria-hidden="true">←</span> 自分のページへ戻る</button><div><span>MY STICKER BOOK</span><b>${escapeText(page.title||`シールページ ${state.bookPage+1}`)}</b></div><button class="kp-cover-change-mini" data-action="show-covers" aria-label="表紙を変更">表紙を変更</button></div>${owned.length?`<aside class="kp-book-inventory-notice" role="status"><span>🎁</span><div><b>シールケースに${owned.length}枚あるよ</b><small>ケースからタップして貼るか、ページへ直接ドラッグ。</small></div><button data-action="jump-to-inventory">シールケース ↓</button></aside>`:''}<div class="kp-book-page-wrap"><div class="kp-page-spine" aria-hidden="true">⋮</div><div class="kp-sticker-book" id="kpStickerBook" aria-label="シールを置くページ"><div class="kp-page-caption">${state.bookPage===0?'わたしのお気に入り':'シールコレクション'}</div>${items.map((it,i)=>{const s=state.bookCatalog.find(x=>x.id===it.stickerKey);if(!s)return'';return `<button class="kp-placed-sticker ${state.selectedBookSticker===it.id?'selected':''}" data-action="select-sticker" data-index="${i}" style="left:${it.x}%;top:${it.y}%" aria-label="${safe(s.name)}"><img draggable="false" src="./assets/stickers/${safe(s.art)}" alt="${safe(s.name)}"></button>`;}).join('')}${!items.length&&owned.length?'<div class="kp-empty-page-hint">このページはまだ空です。下のシールケースからタップするか、シールを直接ドラッグして貼れます。</div>':''}<div class="kp-book-hint">空いているマスへドラッグ／貼ったシールも移動できます</div></div></div>${state.selectedBookSticker?'<div class="kp-selected-sticker-bar"><span>シールを選択中</span><button data-action="remove-sticker">このシールをはがす</button></div>':''}<div class="kp-page-navigation"><button class="kp-page-arrow" data-action="previous-page" ${state.bookPage===0?'disabled':''} aria-label="前のページ">‹</button><span><b>${state.bookPage+1}</b><small> / ${pages.length} ページ</small></span><button class="kp-page-arrow" data-action="next-page" ${state.bookPage>=pages.length-1?'disabled':''} aria-label="次のページ">›</button><button class="kp-add-page" data-action="add-page" ${pageAddDisabled?'disabled':''}>${state.bookPageCreating?'ページ作成中…':'＋ 新しいページ'}</button></div>${emptyTail>=MAX_TRAILING_EMPTY_PAGES?'<p class="kp-page-limit-note" role="status">空白ページは2ページまでです。貼りはじめると追加できます。</p>':''}<div class="kp-inventory-heading" id="kpStickerInventory"><div><b>シールケース</b><small>${owned.length} 枚</small></div><span>タップで貼る／ドラッグで移動</span></div><div class="kp-sticker-inventory">${owned.map(st=>{const s=state.bookCatalog.find(x=>x.id===st.sticker_key);if(!s)return'';return `<button class="kp-inventory-sticker ${used.has(st.id)?'is-used':''}" data-action="place-sticker" data-sticker-instance="${safe(st.id)}" aria-label="${safe(s.name)}を貼る"><img src="./assets/stickers/${safe(s.art)}" alt=""><small>${safe(s.name)}</small></button>`;}).join('')||'<div class="kp-empty-stickers"><b>シールはまだありません</b><br>シールを受け取ると、ここに追加されます。ログイン中のアカウントに保存されます。</div>'}</div>${state.coversOpen?renderCoverPicker(state.bookCover,state.bookCoverOptionPage):''}<div class="kp-book-save-state" aria-live="polite">${state.bookSaving?'保存中…':state.bookError?'保存できませんでした。通信を確認してください。':'変更は自動で保存されます'}</div></section>`;
  };
  feature.mount=ctx=>{if(ctx.state.bookReady)return;const seq=++loadSequence;loadBook(ctx,seq).catch(e=>{if(seq!==loadSequence)return;console.warn('[Koepanda] sticker book sync failed',e);ctx.state.bookReady=true;ctx.state.bookLoadError=true;ctx.render();});};
  feature.actions={
    account:ctx=>document.getElementById('kpAccountTrigger')?.click(),
    retry:ctx=>{ctx.state.bookReady=false;ctx.state.bookError=false;ctx.state.bookLoadError=false;ctx.render();},
    'open-book':ctx=>{ctx.state.bookOpen=true;ctx.save();ctx.render();requestAnimationFrame(()=>{normalizePageLayout(ctx);ctx.root.querySelector('.kp-open-book-head')?.scrollIntoView({behavior:'smooth',block:'start'});});},
    'close-book':ctx=>{ctx.state.bookOpen=false;ctx.state.coversOpen=false;ctx.setSelectedSticker(null);ctx.setPage('self');ctx.render();},
    'show-covers':ctx=>{ctx.state.coversOpen=true;ctx.state.bookCoverOptionPage=Math.floor(Math.max(0,COVERS.findIndex(c=>c.id===ctx.state.bookCover))/COVERS_PER_PAGE);ctx.render();},
    'hide-covers':ctx=>{ctx.state.coversOpen=false;ctx.render();},
    'cover-page':(ctx,b)=>{ctx.state.bookCoverOptionPage=clamp(+b.dataset.page||0,0,1);ctx.render();},
    'choose-cover':(ctx,b)=>{ctx.state.bookCover=b.dataset.cover;ctx.state.coversOpen=false;ctx.render();saveSettings(ctx);},
    'previous-page':ctx=>flip(ctx,-1), 'next-page':ctx=>flip(ctx,1),
    'add-page':ctx=>addPage(ctx),
    'jump-to-inventory':ctx=>ctx.root.querySelector('#kpStickerInventory')?.scrollIntoView({behavior:'smooth',block:'center'}),
    'place-sticker':(ctx,b)=>place(ctx,b.dataset.stickerInstance),
    'select-sticker':(ctx,b)=>{const item=ctx.state.bookPages[ctx.state.bookPage].items[+b.dataset.index];if(suppressPlacedClick===item?.id&&Date.now()<suppressClickUntil){suppressPlacedClick='';return;}ctx.state.selectedBookSticker=item?.id;ctx.setSelectedSticker(ctx.state.selectedBookSticker);ctx.render();},
    'remove-sticker':ctx=>removeSelected(ctx)
  };
  feature.pointerDown=(ctx,e)=>{
    const placed=e.target.closest('.kp-placed-sticker');
    const inventory=e.target.closest('.kp-inventory-sticker');
    const pageEl=ctx.root.querySelector('#kpStickerBook');
    if(!pageEl)return;
    if(placed){
      const page=ctx.state.bookPages[ctx.state.bookPage],item=page.items[+placed.dataset.index];if(!item)return;
      e.preventDefault();
      const rect=placed.getBoundingClientRect();ctx.state.selectedBookSticker=item.id;placed.classList.add('selected');
      const repaired=separateOverlappedAt(ctx,page,pageEl,+placed.dataset.index);
      drag={kind:'move',el:placed,item,page,pageEl,pointer:e.pointerId,startX:e.clientX,startY:e.clientY,lastX:e.clientX,lastY:e.clientY,offsetX:e.clientX-rect.left,offsetY:e.clientY-rect.top,moved:false,repaired};
      placed.setPointerCapture?.(e.pointerId);return;
    }
    if(inventory){
      const instanceId=inventory.dataset.stickerInstance,sticker=ctx.state.bookInventory.find(x=>x.id===instanceId);if(!sticker)return;
      e.preventDefault();
      drag={kind:'place',instanceId,sticker,pageEl,pointer:e.pointerId,startX:e.clientX,startY:e.clientY,lastX:e.clientX,lastY:e.clientY,moved:false};
      inventory.setPointerCapture?.(e.pointerId);
    }
  };
  feature.pointerMove=(ctx,e)=>{
    if(!drag||drag.pointer!==e.pointerId)return;
    drag.lastX=e.clientX;drag.lastY=e.clientY;
    const moved=Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>6;
    if(moved)drag.moved=true;
    if(drag.kind==='move'){
      if(!drag.moved)return;
      drag.el.classList.add('is-dragging');
      if(!dragGhost){dragGhost=drag.el.querySelector('img').cloneNode();dragGhost.className='kp-sticker-drag-ghost is-placed-ghost';dragGhost.alt='';ctx.root.appendChild(dragGhost);}
      dragGhost.style.left=e.clientX+'px';dragGhost.style.top=e.clientY+'px';
      const r=drag.pageEl.getBoundingClientRect(),inside=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;
      drag.pageEl.classList.toggle('is-drop-target',inside);return;
    }
    if(!drag.moved)return;
    if(!dragGhost){dragGhost=document.createElement('img');dragGhost.className='kp-sticker-drag-ghost';dragGhost.alt='';dragGhost.src=stickerImage(ctx,drag.sticker.sticker_key);ctx.root.appendChild(dragGhost);}
    dragGhost.style.left=e.clientX+'px';dragGhost.style.top=e.clientY+'px';
    const bounds=drag.pageEl.getBoundingClientRect(),inside=e.clientX>=bounds.left&&e.clientX<=bounds.right&&e.clientY>=bounds.top&&e.clientY<=bounds.bottom;
    drag.pageEl.classList.toggle('is-drop-target',inside);
  };
  feature.pointerUp=(ctx,e)=>{
    if(!drag||e&&drag.pointer!==e.pointerId)return;
    const current=drag;if(e&&Number.isFinite(e.clientX)&&Number.isFinite(e.clientY)){current.lastX=e.clientX;current.lastY=e.clientY;}drag=null;clearDragPreview(ctx);
    if(current.kind==='move'){
      current.el.classList.remove('is-dragging');
      if(current.moved){
        const bounds=pageMetrics(current.pageEl),width=current.el.offsetWidth,height=current.el.offsetHeight;
        const left=clamp(current.lastX-current.offsetX-bounds.left,0,Math.max(0,bounds.width-width));
        const top=clamp(current.lastY-current.offsetY-bounds.top,0,Math.max(0,bounds.height-height));
        const preferred={x:left/bounds.width*100,y:top/bounds.height*100};
        const position=nearestFreeCell(current.page.items.filter(item=>item.id!==current.item.id),bounds,width,height,preferred);
        if(!position){current.el.classList.remove('is-dragging');ctx.toast('このページはいっぱいです。新しいページを追加してください');return;}
        current.item.x=position.x;current.item.y=position.y;current.el.style.left=position.x+'%';current.el.style.top=position.y+'%';
        suppressPlacedClick=current.item.id;suppressClickUntil=Date.now()+450;saveLayout(ctx);
      }else if(current.repaired)saveLayout(ctx);return;
    }
    if(current.moved){
      suppressInventoryClick=current.instanceId;suppressClickUntil=Date.now()+450;
      const bounds=pageMetrics(current.pageEl),r=current.pageEl.getBoundingClientRect();
      if(current.lastX>=r.left&&current.lastX<=r.right&&current.lastY>=r.top&&current.lastY<=r.bottom){
        const stickerSize=Math.min(76,Math.max(56,window.innerWidth*.17));
        const x=clamp(current.lastX-bounds.left-stickerSize/2,0,Math.max(0,bounds.width-stickerSize))/bounds.width*100;
        const y=clamp(current.lastY-bounds.top-stickerSize/2,0,Math.max(0,bounds.height-stickerSize))/bounds.height*100;
        const position=nearestFreeCell(ctx.state.bookPages[ctx.state.bookPage].items,bounds,stickerSize,stickerSize,{x,y});
        if(position)placeAt(ctx,current.instanceId,position.x,position.y);else ctx.toast('このページはいっぱいです。新しいページを追加してください');
      }
    }
  };
  function coverArtwork(c,mini=false){return c.image?`<span class="kp-cover-artwork ${mini?'is-mini':''}"><img src="./${c.image}" alt="" decoding="async"></span>`:`<span class="kp-cover-art-emoji ${mini?'is-mini':''}" aria-hidden="true">${c.art||'✦'}</span>`;}
  function renderCover(state){const c=coverById(state.bookCover);return `<section class="kp-book-cover-stage"><button class="kp-cover-back" data-action="close-book" aria-label="自分のページへ戻る"><span aria-hidden="true">←</span> 自分のページへ戻る</button><button type="button" class="kp-book-cover ${c.className}" data-action="open-book" aria-label="シール帳をひらく"><div class="kp-cover-ring" aria-hidden="true"><i></i><i></i><i></i></div><div class="kp-cover-art">${coverArtwork(c)}</div><span class="kp-cover-kicker">KOEPANDA · MY COLLECTION</span><h1>わたしの<br>シール帳</h1><p>${c.sub}</p><div class="kp-cover-sticker">${c.mark}</div><div class="kp-cover-strap" aria-hidden="true"><span>✦</span></div></button><div class="kp-cover-actions"><button class="kp-secondary" data-action="show-covers">表紙を変更</button></div><p class="kp-cover-tip">表紙をタップして開く · デザインはあとから変更できます</p>${state.coversOpen?renderCoverPicker(state.bookCover,state.bookCoverOptionPage):''}</section>`;}
  function renderCoverPicker(selected,page=0){const start=clamp(Number(page)||0,0,1),covers=COVERS.slice(start*COVERS_PER_PAGE,(start+1)*COVERS_PER_PAGE);return `<div class="kp-cover-picker-backdrop" data-action="hide-covers"><section class="kp-cover-picker" role="dialog" aria-modal="true" aria-label="表紙を変更" data-picker="true"><button class="kp-cover-picker-close" data-action="hide-covers" aria-label="閉じる">×</button><span class="kp-eyebrow">MY BOOK COVER</span><h2>表紙を変更しよう</h2><p>十二支と小音の表紙から選べます。</p><div class="kp-cover-options">${covers.map(c=>`<button class="kp-cover-option ${selected===c.id?'is-selected':''}" data-action="choose-cover" data-cover="${c.id}"><span class="kp-cover-mini ${c.className}">${coverArtwork(c,true)}<b>${c.mark}</b></span><strong>${c.name}</strong><small>${selected===c.id?'使用中':'この表紙にする'}</small></button>`).join('')}</div><nav class="kp-cover-pagination" aria-label="表紙一覧のページ"><button data-action="cover-page" data-page="0" ${start===0?'disabled':''} aria-label="前の表紙">‹</button><span><b>${start+1}</b> / 2</span><button data-action="cover-page" data-page="1" ${start===1?'disabled':''} aria-label="次の表紙">›</button></nav></section></div>`;}
  function coverById(id){return COVERS.find(c=>c.id===id)||COVERS[0];}
  function escapeText(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  async function loadBook(ctx,seq){const api=window.KP_ACCOUNT_API;if(!api||typeof api.getClient!=='function')throw Error('Account API unavailable');const client=await api.getClient();if(!client)throw Error('Database unavailable');const {data:sessionData,error:authError}=await client.auth.getSession();if(authError)throw authError;const user=sessionData?.session?.user;if(!user){account=null;ctx.state.bookReady=true;ctx.render();return;}account={client,user};
    const [settings,pages,inventory]=await Promise.all([
      client.from('kp_sticker_book_settings').select('cover_key').eq('user_id',user.id).maybeSingle(),
      client.from('kp_sticker_book_pages').select('id,title,page_order').eq('user_id',user.id).order('page_order'),
      client.from('kp_user_stickers').select('id,sticker_key').eq('user_id',user.id)
    ]);for(const r of [settings,pages,inventory])if(r.error)throw r.error;if(seq!==loadSequence)return;
    ctx.state.bookCover=settings.data?.cover_key||ctx.state.bookCover||'xiaoyin_sparkle';ctx.state.bookInventory=inventory.data||[];ctx.state.bookCatalog=ctx.STICKERS;let cloudPages=pages.data||[];
    if(!cloudPages.length){const created=await client.from('kp_sticker_book_pages').insert({user_id:user.id,title:'シールページ 1',page_order:0}).select('id,title,page_order').single();if(created.error)throw created.error;cloudPages=[created.data];}
    const pageIds=cloudPages.map(p=>p.id);const itemResult=await client.from('kp_sticker_book_items').select('id,page_id,user_sticker_id,x,y,z_order').eq('user_id',user.id).in('page_id',pageIds).order('z_order');if(itemResult.error)throw itemResult.error;
    const byInstance=new Map(ctx.state.bookInventory.map(x=>[x.id,x]));ctx.state.bookPages=cloudPages.map(p=>({id:p.id,title:p.title,items:(itemResult.data||[]).filter(i=>i.page_id===p.id).map(i=>{const own=byInstance.get(i.user_sticker_id);return own?{id:i.id,userStickerId:own.id,stickerKey:own.sticker_key,x:Number(i.x),y:Number(i.y)}:null;}).filter(Boolean)}));ctx.state.bookPage=Math.max(0,Math.min(ctx.state.bookPages.length-1,ctx.state.bookPage||0));ctx.state.bookReady=true;ctx.state.bookError=false;const focusInventory=ctx.state.bookFocusInventory;ctx.state.bookFocusInventory=false;ctx.render();requestAnimationFrame(()=>{normalizePageLayout(ctx);if(focusInventory)ctx.root.querySelector('#kpStickerInventory')?.scrollIntoView({behavior:'smooth',block:'center'});});
  }
  async function saveSettings(ctx){if(!account)return;ctx.state.bookSaving=true;ctx.render();const {error}=await account.client.from('kp_sticker_book_settings').upsert({user_id:account.user.id,cover_key:ctx.state.bookCover,updated_at:new Date().toISOString()},{onConflict:'user_id'});ctx.state.bookSaving=false;ctx.state.bookError=!!error;if(error)console.warn('[Koepanda] cover save failed',error);ctx.render();}
  function trailingEmptyPageCount(pages){let count=0;for(let i=pages.length-1;i>=0&&!(pages[i].items||[]).length;i--)count++;return count;}
  function addPage(ctx){const pages=ctx.state.bookPages||[];if(!account||ctx.state.bookPageCreating||trailingEmptyPageCount(pages)>=MAX_TRAILING_EMPTY_PAGES)return;ctx.state.bookPageCreating=true;ctx.state.bookSaving=true;ctx.render();account.client.from('kp_sticker_book_pages').insert({user_id:account.user.id,title:`シールページ ${pages.length+1}`,page_order:pages.length}).select('id,title,page_order').single().then(({data,error})=>{ctx.state.bookPageCreating=false;ctx.state.bookSaving=false;if(error){ctx.state.bookError=true;ctx.render();return;}pages.push({id:data.id,title:data.title,items:[]});ctx.state.bookPages=pages;ctx.state.bookPage=pages.length-1;ctx.render();}).catch(()=>{ctx.state.bookPageCreating=false;ctx.state.bookSaving=false;ctx.state.bookError=true;ctx.render();});}
  function flip(ctx,n){ctx.state.bookPage=clamp(ctx.state.bookPage+n,0,ctx.state.bookPages.length-1);ctx.state.selectedBookSticker=null;ctx.render();requestAnimationFrame(()=>normalizePageLayout(ctx));}
  function stickerImage(ctx,key){const s=ctx.STICKERS.find(x=>x.id===key);return s?'./assets/stickers/'+s.art:'';}
  function pageMetrics(pageEl){const r=pageEl.getBoundingClientRect(),s=getComputedStyle(pageEl),bl=parseFloat(s.borderLeftWidth)||0,br=parseFloat(s.borderRightWidth)||0,bt=parseFloat(s.borderTopWidth)||0,bb=parseFloat(s.borderBottomWidth)||0;return{left:r.left+bl,top:r.top+bt,width:Math.max(1,r.width-bl-br),height:Math.max(1,r.height-bt-bb)};}
  function clearDragPreview(ctx){if(dragGhost){dragGhost.remove();dragGhost=null;}ctx.root.querySelector('.kp-placed-sticker.is-dragging')?.classList.remove('is-dragging');ctx.root.querySelector('#kpStickerBook')?.classList.remove('is-drop-target');}
  function place(ctx,instanceId){if(suppressInventoryClick===instanceId&&Date.now()<suppressClickUntil){suppressInventoryClick='';return;}const board=ctx.root.querySelector('#kpStickerBook'),metrics=pageMetrics(board),size=Math.min(76,Math.max(56,window.innerWidth*.17)),page=ctx.state.bookPages[ctx.state.bookPage],position=nearestFreeCell(page.items,metrics,size,size,null);if(position)placeAt(ctx,instanceId,position.x,position.y);else ctx.toast('このページはいっぱいです。新しいページを追加してください');}
  async function placeAt(ctx,instanceId,x,y){if(!account)return;const page=ctx.state.bookPages[ctx.state.bookPage];if(page.items.some(i=>i.userStickerId===instanceId)){ctx.toast('このページにはもう貼ってあるよ。シールを動かしてみよう');return;}const sticker=ctx.state.bookInventory.find(s=>s.id===instanceId);if(!sticker)return;ctx.state.bookSaving=true;ctx.render();const {data,error}=await account.client.from('kp_sticker_book_items').insert({user_id:account.user.id,page_id:page.id,user_sticker_id:instanceId,x,y,z_order:page.items.length}).select('id').single();ctx.state.bookSaving=false;if(error){ctx.state.bookError=true;ctx.render();return;}page.items.push({id:data.id,userStickerId:instanceId,stickerKey:sticker.sticker_key,x,y});ctx.state.selectedBookSticker=data.id;ctx.render();}
  function nearestFreeCell(occupied,bounds,width,height,preferred){
    const cols=4,rows=5,cellW=bounds.width/cols,cellH=bounds.height/rows,used=new Set();
    occupied.forEach(item=>{
      const cx=(Number(item.x)||0)/100*bounds.width+width/2,cy=(Number(item.y)||0)/100*bounds.height+height/2;
      const col=clamp(Math.floor(cx/cellW),0,cols-1),row=clamp(Math.floor(cy/cellH),0,rows-1);
      used.add(`${row}:${col}`);
    });
    let preferredCol=0,preferredRow=0;
    if(preferred){
      const cx=clamp(preferred.x/100*bounds.width+width/2,0,bounds.width),cy=clamp(preferred.y/100*bounds.height+height/2,0,bounds.height);
      preferredCol=clamp(Math.floor(cx/cellW),0,cols-1);preferredRow=clamp(Math.floor(cy/cellH),0,rows-1);
    }
    const candidates=[];
    for(let row=0;row<rows;row++)for(let col=0;col<cols;col++)if(!used.has(`${row}:${col}`))candidates.push({row,col,distance:Math.hypot((col-preferredCol)*cellW,(row-preferredRow)*cellH)});
    candidates.sort((a,b)=>a.distance-b.distance||a.row-b.row||a.col-b.col);
    const cell=candidates[0];if(!cell)return null;
    const left=clamp(cell.col*cellW+(cellW-width)/2,0,Math.max(0,bounds.width-width));
    const top=clamp(cell.row*cellH+(cellH-height)/2,0,Math.max(0,bounds.height-height));
    return{x:left/bounds.width*100,y:top/bounds.height*100};
  }
  function separateOverlappedAt(ctx,page,board,selectedIndex){
    const selected=board.querySelector(`.kp-placed-sticker[data-index="${selectedIndex}"]`);if(!selected)return false;
    const target=selected.getBoundingClientRect(),bounds=pageMetrics(board),entries=page.items.map((item,index)=>({item,index,el:board.querySelector(`.kp-placed-sticker[data-index="${index}"]`)})).filter(x=>x.el);
    const overlaps=entries.filter(x=>x.index!==selectedIndex&&(()=>{const r=x.el.getBoundingClientRect();return target.left<r.right&&target.right>r.left&&target.top<r.bottom&&target.bottom>r.top;})());
    if(!overlaps.length)return false;
    const moving=new Set(overlaps.map(x=>x.index)),accepted=entries.filter(x=>!moving.has(x.index)).map(x=>x.item);let changed=false;
    overlaps.forEach(({item,el})=>{const pos=nearestFreeCell(accepted,bounds,el.offsetWidth,el.offsetHeight,{x:item.x,y:item.y});if(!pos)return;item.x=pos.x;item.y=pos.y;el.style.left=pos.x+'%';el.style.top=pos.y+'%';accepted.push(item);changed=true;});
    return changed;
  }
  function normalizePageLayout(ctx){const board=ctx.root.querySelector('#kpStickerBook'),page=ctx.state.bookPages?.[ctx.state.bookPage];if(!board||!page)return;const bounds=pageMetrics(board);let changed=false;const accepted=[];page.items.forEach((item,i)=>{const el=board.querySelector(`.kp-placed-sticker[data-index="${i}"]`);if(!el)return;const preferred={x:Number(item.x)||0,y:Number(item.y)||0},position=nearestFreeCell(accepted,bounds,el.offsetWidth,el.offsetHeight,preferred);if(!position)return;if(Math.abs(position.x-item.x)>.02||Math.abs(position.y-item.y)>.02){item.x=position.x;item.y=position.y;el.style.left=position.x+'%';el.style.top=position.y+'%';changed=true;}accepted.push(item);});if(changed)saveLayout(ctx);}
  function saveLayout(ctx){const page=ctx.state.bookPages[ctx.state.bookPage];if(!page||!account)return;const client=account.client,userId=account.user.id,updates=page.items.map(i=>({id:i.id,x:i.x,y:i.y}));ctx.state.bookSaving=true;ctx.state.bookError=false;const status=ctx.root.querySelector('.kp-book-save-state');if(status)status.textContent='保存中…';clearTimeout(saveTimer);saveTimer=setTimeout(async()=>{const results=await Promise.all(updates.map(i=>client.from('kp_sticker_book_items').update({x:i.x,y:i.y}).eq('id',i.id).eq('user_id',userId)));ctx.state.bookSaving=false;ctx.state.bookError=results.some(r=>r.error);const currentStatus=ctx.root.querySelector('.kp-book-save-state');if(currentStatus)currentStatus.textContent=ctx.state.bookError?'保存できませんでした。通信を確認してください。':'変更は自動で保存されます';if(ctx.state.bookError)console.warn('[Koepanda] sticker positions failed to save',results.filter(r=>r.error));},180);}
  async function removeSelected(ctx){const page=ctx.state.bookPages[ctx.state.bookPage],id=ctx.state.selectedBookSticker;if(!id||!account)return;const {error}=await account.client.from('kp_sticker_book_items').delete().eq('id',id).eq('user_id',account.user.id);if(error){ctx.state.bookError=true;ctx.render();return;}page.items=page.items.filter(i=>i.id!==id);ctx.state.selectedBookSticker=null;ctx.render();}
  function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
})();
