/* Koepanda 10.108.30 — unified automatic result-stage celebration */
(function(){
  var lastConfig=null,autoTimer=null;
  function removeOld(){var x=document.getElementById('koepandaResultStage');if(x)x.remove()}
  function level(score,total){if(score===total)return'perfect';if(score>=Math.max(1,total-1))return'near';return'retry'}
  function defaults(cfg){
    var lv=level(cfg.score,cfg.total),passed=cfg.passed!==false;
    return {
      level:lv,
      kicker:cfg.kicker||(lv==='perfect'?'PERFECT!':lv==='near'?'あと1問！おしい！':'もう一回！'),
      title:cfg.title||(passed?'ミニチェック合格！':'あと一歩！'),
      message:cfg.message||(lv==='perfect'?'ぜんぶ正解！ 音の違いをしっかり聞き分けられたね。':lv==='near'?'ほとんどできたよ。あと一つで満点！':'苦手な音だけ確認して、もう一度挑戦しよう。'),
      mascot:cfg.mascot||'🐼'
    }
  }
  function close(stage){if(!stage)return;stage.classList.remove('is-show');setTimeout(function(){if(stage.parentNode)stage.remove()},220)}
  window.koepandaShowResultCelebration=function(cfg){
    cfg=Object.assign({},cfg||{});lastConfig=cfg;removeOld();
    var d=defaults(cfg),stage=document.createElement('div');stage.id='koepandaResultStage';stage.className='koepanda-result-stage is-'+d.level;stage.setAttribute('role','dialog');stage.setAttribute('aria-modal','true');stage.setAttribute('aria-label',d.title);
    stage.innerHTML='<div class="koepanda-result-stage-card"><div class="koepanda-result-stage-burst" aria-hidden="true"><i>★</i><i>✦</i><i>●</i><i>◆</i><i>★</i><i>✦</i><i>●</i><i>◆</i><i>★</i><i>✦</i><i>●</i><i>◆</i><i>★</i><i>✦</i><i>●</i><i>◆</i><i>★</i><i>✦</i><i>●</i><i>◆</i></div><button type="button" class="koepanda-result-stage-close" aria-label="閉じる">×</button><div class="koepanda-result-stage-mascot">'+d.mascot+'</div><b class="koepanda-result-stage-kicker">'+d.kicker+'</b><strong class="koepanda-result-stage-title">'+d.title+'</strong><span class="koepanda-result-stage-score">'+cfg.score+' / '+cfg.total+'</span><span class="koepanda-result-stage-message">'+d.message+'</span><button type="button" class="koepanda-result-stage-ok">閉じる</button></div>';
    function done(){close(stage);if(typeof cfg.onClose==='function')cfg.onClose()}
    stage.querySelector('.koepanda-result-stage-close').onclick=done;stage.querySelector('.koepanda-result-stage-ok').onclick=done;
    stage.addEventListener('click',function(e){if(e.target===stage)done()});
    document.body.appendChild(stage);requestAnimationFrame(function(){stage.classList.add('is-show')});
    return stage
  };
  window.koepandaQueueResultCelebration=function(cfg,delay){
    if(autoTimer)clearTimeout(autoTimer);
    autoTimer=setTimeout(function(){autoTimer=null;window.koepandaShowResultCelebration(cfg)},typeof delay==='number'?delay:90);
  };
  window.koepandaReplayLastResult=function(){if(lastConfig)window.koepandaShowResultCelebration(lastConfig)};
  window.koepandaAttachResultReplay=function(container,cfg){
    if(!container)return;var old=container.querySelector('.koepanda-result-reopen');if(old)old.remove();
    var b=document.createElement('button');b.type='button';b.className='koepanda-result-reopen';b.textContent='結果を見る';b.onclick=function(){window.koepandaShowResultCelebration(cfg)};container.appendChild(b)
  };
})();
