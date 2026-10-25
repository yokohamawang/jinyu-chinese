/* P18 only: isolated from roadmap rendering and course navigation. */
(function(){
  function init(){
    var review=document.getElementById('kidsIslandReviewLesson');
    if(!review||review.dataset.kp272Initialized==='1')return;
    review.dataset.kp272Initialized='1';
    review.className='kids-lesson-card kp198-review kp272-review';
    review.innerHTML='<h2>総合練習</h2><p class="kp272-intro">聞いて、見分けて、音のつながりを確かめよう。</p><div class="kp272-modes" role="group" aria-label="練習モード"><button type="button" class="is-active" data-mode="practice" aria-pressed="true">自由練習</button><button type="button" data-mode="test" aria-pressed="false">小テスト</button></div><section class="kp272-panel" data-panel="practice"><p class="kp272-mode-note">自分のペースで何度でも。ヒントと解説を見ながら練習できます。</p><article class="kp272-card"><span class="kp272-kind"></span><h3 class="kp272-prompt"></h3><button type="button" class="kp272-audio" hidden>▶ 音を聞く</button><div class="kp272-structure-guide" hidden aria-label="拼读の構成"><span class="kp272-structure-first"></span><b>＋</b><span class="kp272-structure-middle"></span><b>＋</b><span class="kp272-structure-last"></span></div><button type="button" class="kp272-hint-toggle" aria-expanded="false">ヒントを見る</button><p class="kp272-hint" hidden></p><div class="kp272-choices"></div><p class="kp272-feedback" aria-live="polite"></p><div class="kp272-practice-actions"><button type="button" class="kp272-retry">この問題をやり直す</button><button type="button" class="kp272-next">別の問題へ →</button></div></article></section><section class="kp272-panel" data-panel="test" hidden><p class="kp272-mode-note">全10問。解答後に結果をまとめて確認します。</p><div class="kp272-test-progress"><span class="kp272-count"></span><div><i></i></div></div><article class="kp272-card"><span class="kp272-test-kind"></span><h3 class="kp272-test-prompt"></h3><button type="button" class="kp272-test-audio" hidden>▶ 音を聞く</button><div class="kp272-test-structure-guide" hidden aria-label="拼读の構成"><span></span><b>＋</b><span></span><b>＋</b><span></span></div><div class="kp272-test-choices"></div><p class="kp272-test-feedback" aria-live="polite"></p><button type="button" class="kp272-test-next" hidden>次の問題 →</button></article></section>';
    installIntegratedPractice(review);
  }
  /* Re-align P18 after the shared route has inserted its fixed header and run its own scroll. */
  window.addEventListener('koepandaP18Reset',function(){
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        var review=document.getElementById('kidsIslandReviewLesson');
        var title=review&&review.querySelector('h2');
        var header=document.querySelector('.kp148-lesson-header');
        if(!review||review.hidden||!title)return;
        var headerBottom=header&&getComputedStyle(header).display!=='none'?header.getBoundingClientRect().bottom:0;
        var top=window.scrollY+title.getBoundingClientRect().top-headerBottom-16;
        window.scrollTo({top:Math.max(0,top),left:0,behavior:'auto'});
      });
    });
  });

  function installIntegratedPractice(review){
    if(review.dataset.kp272Ready==='1')return;
    review.dataset.kp272Ready='1';
    function syncVisibleBottomInset(){var viewport=window.visualViewport;if(!viewport){review.style.setProperty('--kp272-visible-bottom-inset','0px');return}var inset=Math.max(0,Math.round(window.innerHeight-(viewport.offsetTop+viewport.height)));review.style.setProperty('--kp272-visible-bottom-inset',inset+'px')}
    syncVisibleBottomInset();if(window.visualViewport){window.visualViewport.addEventListener('resize',syncVisibleBottomInset);window.visualViewport.addEventListener('scroll',syncVisibleBottomInset)}
    var style=document.createElement('style');style.id='kp272-integrated-style';style.textContent=`
      #kidsIslandReviewLesson.kp272-review{max-width:920px;margin:18px auto;padding:clamp(20px,5vw,42px);border-radius:34px;background:#fffefa;color:#4d7164;box-shadow:0 12px 0 #e9ece1}
      .kp272-review>h2{margin:0 0 8px;text-align:center;font-size:clamp(30px,6vw,44px);color:#45695c}
      .kp272-intro,.kp272-mode-note{margin:0 auto 22px;text-align:center;font-size:clamp(17px,3.8vw,22px);line-height:1.55;color:#71877d}
      .kp272-modes{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:0 0 26px}
      .kp272-modes button,.kp272-choices button,.kp272-test-choices button,.kp272-practice-actions button,.kp272-test-next{min-height:68px;border:2px solid #dce5d9;border-radius:26px;background:#fffefa;color:#4d7164;font-family:inherit;font-weight:700;box-shadow:0 6px 0 #e7ebe1;cursor:pointer}
      .kp272-modes button{font-size:clamp(18px,4vw,24px);font-weight:800}
      .kp272-modes button.is-active,.kp272-practice-actions .kp272-next,.kp272-test-next{border-color:#557f6b;background:#557f6b;color:#fff;box-shadow:0 6px 0 #3d624f}
      .kp272-panel[hidden]{display:none!important}
      .kp272-mode-note{margin-bottom:14px}
      .kp272-test-progress{display:flex;align-items:center;gap:16px;margin:10px 0 20px;font-size:22px;font-weight:800}
      .kp272-test-progress>div{height:14px;flex:1;overflow:hidden;border-radius:20px;background:#e9eee5}
      .kp272-test-progress i{display:block;width:0;height:100%;border-radius:20px;background:linear-gradient(90deg,#77bca0,#e8ca72);transition:width .25s ease}
      .kp272-card{padding:clamp(22px,5vw,40px);border:2px solid #e0e8dc;border-radius:34px;background:#fff;box-shadow:0 8px 0 #e9ece1;text-align:center}
      .kp272-structure-guide{display:flex;align-items:center;justify-content:center;gap:10px;min-height:54px;margin:0 auto 18px;color:#527366;font-weight:800}
      #kidsCourse > #kidsIslandReviewLesson.kp272-review .kp272-structure-guide[hidden]{display:none!important}
      #kidsCourse > #kidsIslandReviewLesson.kp272-review{padding-top:calc(72px + env(safe-area-inset-top))!important;padding-bottom:calc(120px + env(safe-area-inset-bottom))!important}
      .kp272-structure-guide span{padding:9px 13px;border-radius:16px;background:#eff4eb;font-size:15px}
      .kp272-structure-guide b{color:#8a9b8e;font-size:18px}
      .kp272-kind,.kp272-test-kind{display:inline-flex;align-items:center;min-height:42px;padding:0 22px;border-radius:24px;background:#eff4eb;color:#5d7d68;font-size:18px;font-weight:800}
      .kp272-card h3{margin:20px auto 22px;max-width:700px;color:#527366;font-size:clamp(25px,5.5vw,38px);line-height:1.4;font-weight:900}
      .kp272-audio,.kp272-test-audio{min-height:64px;padding:0 28px;border:0;border-radius:24px;background:#557f6b;color:#fff;font-size:22px;font-weight:800;box-shadow:0 6px 0 #3d624f;cursor:pointer}
      .kp272-hint-toggle{display:block;margin:20px auto 0;padding:12px 18px;border:0;background:transparent;color:#547766;font-size:18px;font-weight:800;text-decoration:underline;cursor:pointer}
      .kp272-hint{max-width:650px;margin:12px auto 18px;padding:16px;border-radius:18px;background:#f4f6ef;color:#5e746a;font-size:18px;line-height:1.55}
      .kp272-choices,.kp272-test-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:24px 0 14px}
      .kp272-choices button,.kp272-test-choices button{font-size:clamp(22px,5vw,32px);min-height:82px;box-shadow:0 6px 0 #e5e9df}
      .kp272-choices button.is-answer,.kp272-test-choices button.is-answer{border-color:#78a98d;background:#eaf5ed;color:#416f56}
      .kp272-choices button.is-wrong,.kp272-test-choices button.is-wrong{border-color:#d99a83;background:#fff0e9;color:#9a5c49}
      .kp272-feedback,.kp272-test-feedback{min-height:30px;margin:14px 0;color:#597468;font-size:19px;font-weight:700;line-height:1.55}
      .kp272-practice-actions{display:flex;justify-content:center;gap:14px;flex-wrap:wrap;margin-top:16px}
      .kp272-practice-actions button,.kp272-test-next{padding:0 22px;font-size:18px}
      .kp272-practice-actions .kp272-retry{background:#f4f6ef}
      .kp272-test-next{margin-top:8px}
      @media(max-width:520px){.kp272-review{padding:18px!important;padding-top:calc(68px + env(safe-area-inset-top))!important;padding-bottom:calc(210px + env(safe-area-inset-bottom))!important;border-radius:26px!important}.kp272-card{padding:20px 14px;border-radius:26px}.kp272-choices,.kp272-test-choices{gap:10px}.kp272-choices button,.kp272-test-choices button{min-height:70px;border-radius:22px}.kp272-practice-actions{position:fixed!important;left:max(14px,env(safe-area-inset-left));right:max(14px,env(safe-area-inset-right));bottom:calc(124px + env(safe-area-inset-bottom) + var(--kp272-visible-bottom-inset,0px));z-index:1000;display:flex;gap:10px;margin:0;padding:10px;border:1px solid #e0e8dc;border-radius:22px;background:rgba(255,254,250,.97);box-shadow:0 8px 24px rgba(51,78,65,.2);backdrop-filter:blur(8px)}.kp272-practice-actions button{flex:1 1 0;min-width:0;min-height:56px;padding:0 4px;font-size:clamp(14px,4vw,16px);line-height:1.2;white-space:nowrap}.kp272-test-next{position:fixed!important;left:50%;bottom:calc(124px + env(safe-area-inset-bottom) + var(--kp272-visible-bottom-inset,0px));z-index:1000;min-width:min(280px,calc(100vw - 36px));transform:translateX(-50%);margin:0;font-size:16px;white-space:nowrap}}
    `;document.head.appendChild(style);
    var bank=[
      {interaction:'listen',kind:'整体認読',prompt:'音声と同じ音節を選ぼう。',audio:'assets/audio/p14-sequence-177/zhi.wav',choices:['zhī','zī','chī','shī'],answer:'zhī',hint:'整体認読の音は、声母と韻母を一つずつ分けずに読みます。',explain:'zhī は整体認読の音です。舌を巻く zh の音をそのまま一つのまとまりで聞こう。'},
      {interaction:'listen',kind:'二拼',prompt:'音声と同じ音節はどれ？',audio:'assets/audio/p16-sequence/bo.wav',choices:['mō','pō','bō','fō'],answer:'bō',hint:'声母の違いを聞き分けよう。二拼は声母と韻母をつなぎます。',explain:'音声は bō（b＋o）。mō・pō・fō も二拼ですが、音声と同じなのは bō です。'},
      {interaction:'structure3',kind:'三拼',prompt:'声母・介音・韻母の三つでできている音節はどれ？',choices:['qiáo','bō','zhī','yī'],answer:'qiáo',hint:'三拼は「声母＋介音＋韻母」の三つでできています。',explain:'qiáo は q＋i＋ao。bō は二拼、zhī と yī は整体認読です。'},
      {interaction:'listen',kind:'声調',prompt:'音声と同じ声調の「wu」を選ぼう。',audio:'assets/audio/course-134/wu3.wav',choices:['wū','wú','wǔ','wù'],answer:'wǔ',hint:'一声は平ら、二声は上がる、三声は下がって上がる、四声は下がります。',explain:'これは第三声の wǔ。声調記号の位置と形も一緒に確認しよう。'},
      {interaction:'listen',kind:'整体認読',prompt:'音声と同じ音節を選ぼう。',audio:'assets/audio/p15-staged-177/yue.wav',choices:['yuè','yè','yú','yuán'],answer:'yuè',hint:'音の最初と最後をよく聞いて比べましょう。',explain:'聞こえた音は yuè。整体認読のまとまりとして覚えます。'},
      {interaction:'structure2',kind:'二拼',prompt:'声母と韻母の二つでできている音節はどれ？',choices:['dé','guā','zhī','yī'],answer:'dé',hint:'二拼は「声母＋韻母」の二つでできています。',explain:'dé は d＋e。guā は三拼、zhī と yī は整体認読です。'},
      {interaction:'structure3',kind:'三拼',prompt:'声母・介音・韻母の三つでできている音節はどれ？',choices:['guā','bō','chī','yī'],answer:'guā',hint:'三拼は「声母＋介音＋韻母」の三つでできています。',explain:'guā は g＋u＋a。bō は二拼、chī と yī は整体認読です。'},
      {interaction:'listen',kind:'声調',prompt:'音声と同じ声調を選ぼう。',audio:'assets/audio/course-134/yi4.wav',choices:['yī','yí','yǐ','yì'],answer:'yì',hint:'声調記号の向きと音の動きを一緒に確認しましょう。',explain:'聞こえたのは第四声 yì。短く下がる音です。'},
      {interaction:'knowledge',kind:'軽声',prompt:'軽声について正しい説明はどれ？',choices:['いつも同じ高さの第五声','短く軽く発音し、高さは前の音節で変わる','必ず低く発音する'],answer:'短く軽く発音し、高さは前の音節で変わる',hint:'「媽媽」「爸爸」の後ろの音を思い出してみましょう。',explain:'軽声は固定された第五声ではありません。前の音節に続く短く軽い音です。'},
      {interaction:'knowledge',kind:'軽声',prompt:'「爸爸（bàba）」の二つ目の音節は？',choices:['bā','bá','bǎ','ba（軽声）'],answer:'ba（軽声）',hint:'軽声は拼音で声調記号を付けずに表します。',explain:'bà の後ろの ba は短く軽く続く軽声です。'}
    ];
    var modes=review.querySelector('.kp272-modes'),practice=review.querySelector('[data-panel="practice"]'),test=review.querySelector('[data-panel="test"]');
    var pKind=review.querySelector('.kp272-kind'),pPrompt=review.querySelector('.kp272-prompt'),pAudio=review.querySelector('.kp272-audio'),pStructure=review.querySelector('.kp272-structure-guide'),pHintToggle=review.querySelector('.kp272-hint-toggle'),pHint=review.querySelector('.kp272-hint'),pChoices=review.querySelector('.kp272-choices'),pFeedback=review.querySelector('.kp272-feedback'),pRetry=review.querySelector('.kp272-retry'),pNext=review.querySelector('.kp272-next');
    var tCount=review.querySelector('.kp272-count'),tProgress=review.querySelector('.kp272-test-progress i'),tKind=review.querySelector('.kp272-test-kind'),tPrompt=review.querySelector('.kp272-test-prompt'),tAudio=review.querySelector('.kp272-test-audio'),tStructure=review.querySelector('.kp272-test-structure-guide'),tChoices=review.querySelector('.kp272-test-choices'),tFeedback=review.querySelector('.kp272-test-feedback'),tNext=review.querySelector('.kp272-test-next');
    var practiceIndex=0,testBank=[],testIndex=0,testScore=0,testAnswered=false,activeAudio=null,activeAudioButton=null;
    function stop(){if(activeAudio){activeAudio.pause();activeAudio.onended=null;activeAudio.onerror=null;activeAudio=null}if(activeAudioButton){activeAudioButton.disabled=false;activeAudioButton.textContent='▶ 音を聞く';activeAudioButton=null}}
    function play(q,target){stop();if(!q.audio){target.textContent='この問題はヒントを見ながら考えよう。';return}target.disabled=true;target.textContent='再生中…';activeAudioButton=target;var clip=new Audio(new URL(q.audio,window.location.href).href);activeAudio=clip;clip.onended=function(){if(activeAudio!==clip)return;activeAudio=null;target.disabled=false;target.textContent='▶ 音を聞く';activeAudioButton=null};clip.onerror=function(){if(activeAudio!==clip)return;activeAudio=null;target.disabled=false;target.textContent='▶ 音を聞く';activeAudioButton=null;if(target===pAudio)pFeedback.textContent='音声を読み込めませんでした。もう一度お試しください。';else tFeedback.textContent='音声を読み込めませんでした。もう一度お試しください。'};var promise=clip.play();if(promise&&promise.catch)promise.catch(function(){if(activeAudio!==clip)return;activeAudio=null;target.disabled=false;target.textContent='▶ 音を聞く';activeAudioButton=null;if(target===pAudio)pFeedback.textContent='再生ボタンをもう一度押してください。';else tFeedback.textContent='再生ボタンをもう一度押してください。'})}
    function renderPractice(){var q=bank[practiceIndex];pKind.textContent=q.kind;pPrompt.textContent=q.prompt;pFeedback.textContent='';pHint.textContent=q.hint;pHint.hidden=true;pHintToggle.hidden=false;pHintToggle.setAttribute('aria-expanded','false');pHintToggle.textContent='ヒントを見る';pAudio.hidden=q.interaction!=='listen';pStructure.hidden=q.interaction!=='structure2'&&q.interaction!=='structure3';if(!pStructure.hidden){var parts=q.interaction==='structure3'?['声母','介音','韻母']:['声母','韻母'];pStructure.querySelectorAll('span').forEach(function(el,i){el.hidden=i>=parts.length;if(i<parts.length)el.textContent=parts[i]});pStructure.querySelectorAll('b').forEach(function(el,i){el.hidden=i>=parts.length-1})}pChoices.replaceChildren();q.choices.forEach(function(choice){var b=document.createElement('button');b.type='button';b.textContent=choice;b.addEventListener('click',function(){if(choice===q.answer){pChoices.querySelectorAll('button').forEach(function(x){x.disabled=true;x.classList.remove('is-answer','is-wrong')});b.classList.add('is-answer');pFeedback.textContent='正解！ '+q.explain}else{pChoices.querySelectorAll('button').forEach(function(x){x.classList.remove('is-answer','is-wrong')});b.classList.add('is-wrong');pFeedback.textContent='もう一度考えてみよう。ヒントも使えます。'}});pChoices.appendChild(b)})}
    function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),v=a[i];a[i]=a[j];a[j]=v}return a}
    function renderTest(){testAnswered=false;var q=testBank[testIndex];tCount.textContent=(testIndex+1)+' / '+testBank.length;tProgress.style.width=((testIndex+1)/testBank.length*100)+'%';tKind.textContent=q.kind;tPrompt.textContent=q.prompt;tFeedback.textContent='';tAudio.hidden=q.interaction!=='listen';tStructure.hidden=q.interaction!=='structure2'&&q.interaction!=='structure3';if(!tStructure.hidden){var parts=q.interaction==='structure3'?['声母','介音','韻母']:['声母','韻母'],spans=tStructure.querySelectorAll('span'),pluses=tStructure.querySelectorAll('b');spans.forEach(function(el,i){el.hidden=i>=parts.length;if(i<parts.length)el.textContent=parts[i]});pluses.forEach(function(el,i){el.hidden=i>=parts.length-1})}tChoices.replaceChildren();tNext.hidden=true;tNext.textContent=testIndex===testBank.length-1?'結果を見る':'次の問題 →';shuffle(q.choices.slice()).forEach(function(choice){var b=document.createElement('button');b.type='button';b.textContent=choice;b.addEventListener('click',function(){if(testAnswered)return;testAnswered=true;stop();if(choice===q.answer)testScore++;tFeedback.textContent=choice===q.answer?'正解！ '+q.explain:'今回は違います。正解は「'+q.answer+'」。'+q.explain;tChoices.querySelectorAll('button').forEach(function(x){x.disabled=true;if(x.textContent===q.answer)x.classList.add('is-answer');if(x===b&&choice!==q.answer)x.classList.add('is-wrong')});tNext.hidden=false});tChoices.appendChild(b)})}
    modes.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){stop();var isTest=b.dataset.mode==='test';modes.querySelectorAll('button').forEach(function(x){var active=x===b;x.classList.toggle('is-active',active);x.setAttribute('aria-pressed',String(active))});practice.hidden=isTest;test.hidden=!isTest;if(isTest){delete tNext.dataset.restart;testBank=shuffle(bank.slice());testIndex=0;testScore=0;renderTest()}})});
    pAudio.addEventListener('click',function(){play(bank[practiceIndex],pAudio)});tAudio.addEventListener('click',function(){play(testBank[testIndex],tAudio)});
    pHintToggle.addEventListener('click',function(){var open=pHint.hidden;pHint.hidden=!open;pHintToggle.setAttribute('aria-expanded',String(open));pHintToggle.textContent=open?'ヒントを閉じる':'ヒントを見る'});
    pRetry.addEventListener('click',function(){stop();renderPractice()});pNext.addEventListener('click',function(){stop();var next=practiceIndex;while(next===practiceIndex)next=Math.floor(Math.random()*bank.length);practiceIndex=next;renderPractice()});
    tNext.addEventListener('click',function(){if(testIndex<testBank.length-1){testIndex++;renderTest();return}if(tNext.dataset.restart==='1'){delete tNext.dataset.restart;testBank=shuffle(bank.slice());testIndex=0;testScore=0;renderTest();return}tKind.textContent='結果';tPrompt.textContent=testScore+' / '+testBank.length+' 問正解';tChoices.replaceChildren();tFeedback.textContent=testScore===testBank.length?'やった！ 全問正解！':'よくがんばりました。自由練習で復習しよう。';tAudio.hidden=true;tStructure.hidden=true;tCount.textContent='';tProgress.style.width='100%';tNext.textContent='もう一度テスト';tNext.dataset.restart='1'});
    window.addEventListener('koepandaP18Reset',function(){stop();practice.hidden=false;test.hidden=true;modes.querySelectorAll('button').forEach(function(b){var active=b.dataset.mode==='practice';b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});practiceIndex=Math.floor(Math.random()*bank.length);renderPractice()});
    window.addEventListener('koepandaP18Close',stop);
    practiceIndex=Math.floor(Math.random()*bank.length);renderPractice();
  }

  function ensureMounted(){
    var courseRoot=document.getElementById('kidsCourse');
    if(!courseRoot)return false;
    var review=document.getElementById('kidsIslandReviewLesson');
    if(!review){
      review=document.createElement('section');
      review.id='kidsIslandReviewLesson';
      review.className='kids-lesson-card kp198-review kp272-review';
      review.hidden=true;
      courseRoot.appendChild(review);
    }
    init();
    return review.dataset.kp272Initialized==='1';
  }
  var mountObserver=new MutationObserver(function(){if(ensureMounted())mountObserver.disconnect()});
  if(!ensureMounted())mountObserver.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',function(){if(ensureMounted())mountObserver.disconnect()},{once:true});
  window.addEventListener('koepandaP18Reset',function(){if(ensureMounted())mountObserver.disconnect()});
})();
