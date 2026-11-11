(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};
  let drag=null;
  window.KoepandaFeatures.sticker_book = function({head,state,safe,img,STICKERS,selectedSticker}){
    const placed=state.pages[state.activePage]||[];
    return `${head('じぶんだけのコレクション','わたしのシール帳','シールをタップして貼ろう。指で動かしたり、くるっと回したりできるよ。')}<div class="kp-book-toolbar"><button class="kp-secondary" data-action="add-page">＋ ページをふやす</button><span>ページ ${state.activePage+1} / ${state.pages.length}</span><button class="kp-secondary" data-action="clear-page">このページを消す</button></div><div class="kp-sticker-book" id="kpStickerBook" aria-label="シールを自由に配置するシール帳"><div class="kp-book-title">${state.activePage===0?'ピンインの森':'わたしのコレクション'}</div>${placed.map((p,i)=>`<button class="kp-placed-sticker ${selectedSticker===p.uid?'selected':''}" data-action="select-sticker" data-index="${i}" style="left:${p.x}%;top:${p.y}%;transform:translate(-50%,-50%) rotate(${p.rotation||0}deg) scale(${p.scale||1})" aria-label="${safe(p.name)}を選択"><img draggable="false" src="${img(p.id)}" alt="${safe(p.name)}"></button>`).join('')}<div class="kp-book-hint">シールを選んで、好きな場所へドラッグ</div></div><div class="kp-book-controls">${selectedSticker?`<span>選択中：シール</span><button data-action="rotate">↻ 回す</button><button data-action="remove-sticker">はがす</button>`:'<span>シールを貼ると、ここで動かせるよ</span>'}</div><section class="kp-section"><div class="kp-section-title"><h2>シールケース</h2><span>${state.unlocked.length}枚</span></div><div class="kp-sticker-inventory">${state.unlocked.map(id=>{const s=STICKERS.find(x=>x.id===id);if(!s)return'';return `<button class="kp-inventory-sticker" data-action="place-sticker" data-id="${s.id}" aria-label="${safe(s.name)}を貼る"><img src="${img(s.id)}" alt=""><b>${safe(s.glyph)}</b><small>${safe(s.series)}</small></button>`;}).join('')}</div></section><section class="kp-season-teaser"><div class="kp-limited-badge">COMING SOON</div><div><span class="kp-eyebrow">季節の限定シール</span><h3>小音と竹の葉　秋のきらきら便り</h3><p>もみじ色の限定デザインを準備中。公開前にシール帳で予告するよ。</p></div><div class="kp-teaser-art"><img src="./assets/stickers/limited-autumn.svg" alt="秋限定予定　竹の葉と紅葉の小音シール"></div><button data-action="notify-season" class="kp-secondary">予告をチェック</button></section>`;
  }
  window.KoepandaFeatures.sticker_book.actions={
    'add-page':ctx=>{ctx.state.pages.push([]);ctx.state.activePage=ctx.state.pages.length-1;ctx.save();ctx.render();},
    'clear-page':ctx=>{ctx.state.pages[ctx.state.activePage]=[];ctx.setSelectedSticker(null);ctx.save();ctx.render();},
    'place-sticker':(ctx,b)=>placeSticker(ctx,b.dataset.id),
    'select-sticker':(ctx,b)=>{ctx.setSelectedSticker(ctx.state.pages[ctx.state.activePage][+b.dataset.index]?.uid);ctx.render();},
    rotate:ctx=>updateSelected(ctx,p=>p.rotation=(p.rotation||0)+15),
    'remove-sticker':ctx=>{ctx.state.pages[ctx.state.activePage]=ctx.state.pages[ctx.state.activePage].filter(p=>p.uid!==ctx.selectedSticker);ctx.setSelectedSticker(null);ctx.save();ctx.render();},
    'notify-season':ctx=>{ctx.state.seasonNotify=!ctx.state.seasonNotify;ctx.save();ctx.toast(ctx.state.seasonNotify?'限定シールの予告をチェックする設定にしたよ。':'予告チェックを解除したよ。');}
  };
  window.KoepandaFeatures.sticker_book.pointerDown=(ctx,e)=>{const item=e.target.closest('.kp-placed-sticker');if(!item)return;const i=+item.dataset.index,p=ctx.state.pages[ctx.state.activePage][i];if(!p)return;ctx.setSelectedSticker(p.uid);drag={item,p,box:ctx.root.querySelector('#kpStickerBook').getBoundingClientRect(),pointer:e.pointerId};item.setPointerCapture?.(e.pointerId);};
  window.KoepandaFeatures.sticker_book.pointerMove=(ctx,e)=>{if(!drag||e.pointerId!==drag.pointer)return;const {box,p}=drag;p.x=Math.max(8,Math.min(92,(e.clientX-box.left)/box.width*100));p.y=Math.max(18,Math.min(82,(e.clientY-box.top)/box.height*100));drag.item.style.left=p.x+'%';drag.item.style.top=p.y+'%';};
  window.KoepandaFeatures.sticker_book.pointerUp=ctx=>{if(!drag)return;ctx.save();drag=null;};
  function placeSticker(ctx,id){if(!ctx.state.unlocked.includes(id)){ctx.toast('まだ持っていないシールだよ。ミニクイズで集めよう！');return;}const s=ctx.STICKERS.find(x=>x.id===id);const p={uid:Date.now().toString(36)+Math.random().toString(36).slice(2,5),id,name:s.name,x:25+Math.random()*50,y:28+Math.random()*42,rotation:Math.round(Math.random()*16-8),scale:.92+Math.random()*.16};ctx.state.pages[ctx.state.activePage].push(p);ctx.setSelectedSticker(p.uid);ctx.save();ctx.render();}
  function updateSelected(ctx,fn){const p=ctx.state.pages[ctx.state.activePage].find(x=>x.uid===ctx.selectedSticker);if(p){fn(p);ctx.save();ctx.render();}}
})();
