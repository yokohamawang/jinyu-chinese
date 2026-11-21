/* Shared reward bridge for the independent chapter, daily, and scenario pages. */
(()=>{
  'use strict';
  const completed=new Set();
  const catalog=window.KoepandaCatalog?.STICKERS||[];
  const context={
    STICKERS:catalog,
    state:{unlocked:[],bookInventory:[],rewardStickerKeys:[]},
    img:id=>{const sticker=catalog.find(item=>item.id===id);return sticker?'./assets/stickers/'+sticker.art:'';},
    save:()=>{},
    setPage:()=>{window.location.href='./index.html?open=book';},
    render:()=>{}
  };
  window.KP_OPEN_STICKER_BOOK=()=>{window.location.href='./index.html?open=book';};
  window.KPStandaloneReward={
    show({activityKey,score,total,completion,onContinue}){
      if(!activityKey||completed.has(activityKey))return;
      completed.add(activityKey);
      Promise.resolve(completion).catch(error=>{
        console.warn('[Koepanda] completion sync delayed:',error);
      }).finally(()=>{
        if(!window.KoepandaRewardReveal?.award)return;
        const claimToken=window.crypto?.randomUUID?.()||'claim-'+Date.now()+'-'+Math.random().toString(36).slice(2);
        window.KoepandaRewardReveal.award(context,{claimToken,score,total,activityKey,onContinue});
      });
    }
  };
  // All three independent practice engines render a completion card and then
  // update its record status. Observe that shared contract in one place.
  const params=new URLSearchParams(location.search);
  const activityKey=['practice',params.get('track')||'chapter',params.get('unit')||params.get('activity')||'unit'].join('.');
  const root=document.getElementById('practiceSession');
  if(root&&!params.has('review')){
    const observer=new MutationObserver(()=>{
      const card=root.querySelector('.ps-finish-card,.fx-finish');
      if(!card)return;
      const status=card.querySelector('#ps-record-status,#fx-record-status');
      if(status&&/更新しています/.test(status.textContent))return;
      const scoreText=card.querySelector('.ps-score')?.textContent||card.textContent;
      const match=scoreText.match(/(\d+)\s*\/\s*(\d+)/);
      if(!match)return;
      observer.disconnect();
      window.KPStandaloneReward.show({activityKey,score:Number(match[1]),total:Number(match[2])});
    });
    observer.observe(root,{childList:true,subtree:true,characterData:true});
  }
})();
