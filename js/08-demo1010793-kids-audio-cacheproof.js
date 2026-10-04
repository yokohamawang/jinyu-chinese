/* DEMO 10.107.99 — serialized tone playback for iPhone Safari.
   Keeps the known-working lesson UI and prevents a previous tone from racing/bleeding into the next one. */
(function(){
  window.KOEPANDA_PINYIN_BUILD="10.107.96";
  var data=window.KOEPANDA_KIDS_FIRST_LESSON;if(!data)return;
  var vowelIndex=0, localAudio=null, audioRequestId=0, audioPool={}, heard={}, completed={}, mastery={}, activeLetters=null, activeGroupTitle='';
  var introToneBusy=false, introTonePending=null, introToneLastEnd=0, introToneGuardMs=180;
  var STORE='koepandaVowelProgress54', MASTERY_STORE='koepandaVowelMastery69';
  var aFlow=null;
  function el(id){return document.getElementById(id)}
  function loadProgress(){
    try{completed=JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch(e){completed={}}
    try{mastery=JSON.parse(localStorage.getItem(MASTERY_STORE)||'{}')||{}}catch(e){mastery={}}
  }
  function saveProgress(){
    try{localStorage.setItem(STORE,JSON.stringify(completed))}catch(e){}
    try{localStorage.setItem(MASTERY_STORE,JSON.stringify(mastery))}catch(e){}
    try{window.dispatchEvent(new CustomEvent('koepandaVowelProgressChanged',{detail:{completed:completed,mastery:mastery}}))}catch(e){}
  }
  function enterKids(ev){if(typeof window.koepandaEnterKidsCourse==='function')return window.koepandaEnterKidsCourse(ev);document.body.classList.remove('app-home-mode','app-function-mode','app-area-listen','app-area-chat','app-area-repeat','app-area-settings');document.body.classList.add('app-kids-mode');var c=el('kidsCourse');if(c)c.setAttribute('aria-hidden','false');try{history.replaceState(null,'',location.pathname+location.search+'#kidsCourse')}catch(e){}requestAnimationFrame(function(){window.scrollTo({top:0,left:0,behavior:'auto'})})}
  function leaveKids(){document.body.classList.remove('app-kids-mode');var c=el('kidsCourse');if(c)c.setAttribute('aria-hidden','true');if(typeof window.returnToAppHome==='function')window.returnToAppHome();else{document.body.classList.add('app-home-mode');window.scrollTo(0,0)}}
  function stopAudio(){audioRequestId++;var oldAudio=localAudio;localAudio=null;try{if(oldAudio){oldAudio.pause();oldAudio.currentTime=0}}catch(e){}try{if(typeof pinyinSource!=='undefined'&&pinyinSource){pinyinSource.stop();pinyinSource.disconnect();pinyinSource=null}}catch(e){}try{if('speechSynthesis' in window)window.speechSynthesis.cancel()}catch(e){}}

  /* Verified 10.107.68 pronunciation source. 10.107.92 keeps the same MP3s but reuses one preloaded Audio element per syllable/tone on iPhone Safari. */
  var PINYIN_AUDIO_BASE='https://raw.githubusercontent.com/byhow/yanyu/main/pinyin-syllables/';
  function audioKey(letter,tone){var base=letter==='i'?'yi':(letter==='u'?'wu':(letter==='ü'?'yu':letter));return base+tone}
  function audioInfo(letter,tone){var isO=letter==='o',key=isO?('wo'+tone):audioKey(letter,tone),src=PINYIN_AUDIO_BASE+key+'.mp3';return {isO:isO,key:key,src:src}}
  function getPinyinAudio(letter,tone){var info=audioInfo(letter,tone),a=audioPool[info.key];if(!a){a=new Audio();a.preload='auto';a.playsInline=true;a.crossOrigin='anonymous';a.src=info.src;audioPool[info.key]=a;try{a.load()}catch(e){}}return {audio:a,info:info}}
  function warmPinyin(letter){for(var t=1;t<=4;t++)getPinyinAudio(letter,t)}
  function showAudioMissing(letter,tone){var msg='音声の読み込みに失敗しました。通信状態を確認して、もう一度押してください。';console.error(msg,letter,tone);var hint=el('kidsToneHint');if(hint)hint.textContent='⚠ '+msg}
  function playLocalPinyin(letter,tone){
    stopAudio();var requestId=audioRequestId,p=getPinyinAudio(letter,tone),a=p.audio,isO=p.info.isO;localAudio=a;
    return new Promise(function(resolve){var settled=false,started=false;
      function isCurrent(){return requestId===audioRequestId&&localAudio===a}
      function cleanup(){try{a.removeEventListener('canplay',start);a.removeEventListener('error',fail)}catch(e){}}
      function finish(value){if(settled)return;settled=true;cleanup();resolve(value)}
      function fail(){if(settled)return;if(!isCurrent()){finish(null);return}try{a.pause();a.currentTime=0}catch(e){}if(localAudio===a)localAudio=null;showAudioMissing(letter,tone);finish(null)}
      function start(){if(started||!isCurrent()){if(!isCurrent())finish(null);return}started=true;try{a.pause();a.currentTime=0;a.playbackRate=1;a.volume=1;if(isO&&a.duration>0.16){var oTrim=(tone===2||tone===4)?0.035:0.075;a.currentTime=Math.min(oTrim,a.duration*((tone===2||tone===4)?0.08:0.15));if(tone===2||tone===4)a.playbackRate=0.94}}catch(e){}try{var pr=a.play();if(pr&&typeof pr.then==='function')pr.then(function(){if(isCurrent())finish(a);else{try{a.pause();a.currentTime=0}catch(e){}finish(null)}}).catch(fail);else finish(isCurrent()?a:null)}catch(e){fail()}}
      a.addEventListener('ended',function(){if(localAudio===a)localAudio=null},{once:true});a.addEventListener('error',fail,{once:true});
      if(a.readyState>=2)start();else{a.addEventListener('canplay',start,{once:true});try{a.load()}catch(e){start()}}
    })
  }
  function playToneExample(tone){return playLocalPinyin('a',tone)}
  function playVowelExample(v,tone){return playLocalPinyin(v.letter,tone)}
  function playIntroToneSerialized(v,tone){
    introTonePending={v:v,tone:tone};
    if(introToneBusy)return;
    function launch(){
      if(!introTonePending){introToneBusy=false;return}
      var job=introTonePending;introTonePending=null;introToneBusy=true;
      var wait=Math.max(0,introToneGuardMs-(Date.now()-introToneLastEnd));
      setTimeout(function(){
        playVowelExample(job.v,job.tone).then(function(a){
          if(!a){introToneBusy=false;launch();return}
          var done=false;
          function finish(){
            if(done)return;done=true;introToneLastEnd=Date.now();introToneBusy=false;
            setTimeout(launch,introToneGuardMs);
          }
          if(a.ended||a.paused){finish();return}
          a.addEventListener('ended',finish,{once:true});
          a.addEventListener('pause',function(){if(a.currentTime>0&&!a.ended)finish()},{once:true});
        }).catch(function(){introToneBusy=false;launch()});
      },wait);
    }
    launch();
  }
  window.koepandaPlayToneIntro=playToneExample;
  function toneMarks(letter){var m={a:['ā','á','ǎ','à'],o:['ō','ó','ǒ','ò'],e:['ē','é','ě','è'],i:['ī','í','ǐ','ì'],u:['ū','ú','ǔ','ù'],'ü':['ǖ','ǘ','ǚ','ǜ']};return m[letter]||[letter,letter,letter,letter]}
  function toneLabels(){return ['高く平ら','低めから一気に上へ','低く下げてから上がる','高い所から一気に下へ']}
  function renderTones(){var box=el('kidsToneGrid');if(!box)return;box.replaceChildren();data.tones.forEach(function(t){var b=document.createElement('button');b.type='button';b.className='kids-tone-card tone-'+t.tone;b.innerHTML='<span class="mark">'+t.mark+'</span><b>'+t.label+'</b><small>'+t.jp+'</small>';b.addEventListener('click',function(){box.querySelectorAll('.kids-tone-card').forEach(function(x){x.classList.remove('is-active')});b.classList.add('is-active');var hint=el('kidsToneHint');if(hint)hint.textContent=t.label+'：'+t.jp+'。声の動きを聞こう。';playToneExample(t.tone)});box.appendChild(b)})}

  function visibleVowels(){if(!activeLetters||!activeLetters.length)return data.vowels.slice();return activeLetters.map(function(letter){return data.vowels.find(function(v){return v.letter===letter})}).filter(Boolean)}
  function isUnlocked(letter){
    if(!activeLetters||!activeLetters.length)return true;
    var idx=activeLetters.indexOf(letter);if(idx<=0)return true;
    var prev=activeLetters[idx-1];
    if(prev==='a')return !!(mastery.a&&mastery.a.passed);
    return !!completed[prev];
  }
  window.koepandaIsVowelUnlocked=isUnlocked;
  window.koepandaIsUnitComplete=function(id){
    if(id==='P1')return !!completed.a&&!!completed.o&&!!completed.e;
    if(id==='P2')return !!completed.i&&!!completed.u&&!!completed['ü'];
    return false;
  };
  function updateProgress(){
    var list=visibleVowels(),done=list.filter(function(v){return !!completed[v.letter]}).length,total=list.length||6,p=el('kidsVowelOverviewProgress');
    if(p){if(activeLetters&&activeLetters[0]==='a'&&!(mastery.a&&mastery.a.passed))p.textContent='まず a のレッスンをクリアすると、o が開くよ';else p.textContent=done===0?'最初の母音からはじめよう':(done<total?'できた母音 '+done+' / '+total:(activeGroupTitle?activeGroupTitle+'、ぜんぶできた！':'6つの母音、ぜんぶできた！'))}
    document.querySelectorAll('.kids-vowel-button').forEach(function(b){var letter=b.dataset.letter,unlocked=isUnlocked(letter);b.classList.toggle('is-complete',!!completed[letter]);b.classList.toggle('is-locked',!unlocked);b.disabled=!unlocked;b.setAttribute('aria-disabled',unlocked?'false':'true')});
    var note=el('kidsFinishNote');if(note){note.textContent='';note.classList.remove('is-visible')}
  }

  function ensureDrill(){
    if(el('kidsVowelDrill'))return el('kidsVowelDrill');var grid=el('kidsVowelGrid');if(!grid)return null;
    var progress=document.createElement('div');progress.id='kidsVowelOverviewProgress';progress.className='kids-vowel-overview-progress';grid.insertAdjacentElement('afterend',progress);
    var d=document.createElement('div');d.id='kidsVowelDrill';d.className='kids-vowel-drill';d.hidden=true;
    d.innerHTML=''
      +'<div class="kids-vowel-drill-head"><button type="button" class="kids-vowel-drill-back" id="kidsVowelDrillBack">← 戻る　母音一覧</button><div class="kids-vowel-drill-title"><b id="kidsVowelDrillTitle">a の四声</b><small id="kidsVowelDrillSubtitle">きく → まねる → たしかめる</small></div></div>'
      +'<div class="kids-vowel-drill-hero"><img id="kidsVowelDrillImage" alt=""><div><div class="kids-vowel-drill-letter" id="kidsVowelDrillLetter">a</div><div class="kids-vowel-drill-tip" id="kidsVowelDrillTip"></div></div></div>'
      +'<div class="kids-a-progress" id="kidsAProgress" hidden><span data-step="listen">1 きく</span><span data-step="ear">2 ききわけ</span><span data-step="imitate">3 まねる</span><span data-step="quiz">4 ミニチェック</span></div>'
      +'<div class="kids-vowel-tone-title">🔊 4つの声調を順番に聞いてみよう</div><div class="kids-vowel-tone-grid" id="kidsVowelToneGrid"></div>'
      +'<section class="kids-a-stage" id="kidsAEarStage" hidden><div class="kids-a-stage-head"><span>👂</span><div><b>耳でえらんでみよう</b><small>音を1回聞いて、どの声調か選ぼう</small></div></div><button type="button" class="kids-a-listen-button" id="kidsAEarListen">▶ もう一度聞く</button><div class="kids-a-choice-row" id="kidsAEarChoices"></div><div class="kids-a-feedback" id="kidsAEarFeedback"></div></section>'
      +'<section class="kids-a-stage" id="kidsAImitateStage" hidden><div class="kids-a-stage-head"><span>🗣️</span><div><b>小音といっしょにまねよう</b><small>音を聞いて、同じ高さの動きを声にしてみよう</small></div></div><button type="button" class="kids-a-listen-button" id="kidsAImitateListen">▶ お手本を聞く</button><button type="button" class="kids-a-confirm-button" id="kidsAImitateDone">まねして言えた！</button><div class="kids-a-feedback" id="kidsAImitateFeedback"></div></section>'
      +'<section class="kids-a-stage" id="kidsAQuizStage" hidden><div class="kids-a-stage-head"><span>⭐</span><div><b>ミニチェック</b><small>4問中3問できたら次へ進めるよ</small></div></div><div class="kids-a-quiz-count" id="kidsAQuizCount">1 / 4</div><button type="button" class="kids-a-listen-button" id="kidsAQuizListen">▶ 音を聞く</button><div class="kids-a-choice-row" id="kidsAQuizChoices"></div><div class="kids-a-feedback" id="kidsAQuizFeedback"></div><button type="button" class="kids-a-next-question" id="kidsAQuizNext" hidden>次の問題へ</button></section>'
      +'<section class="kids-a-reward" id="kidsAReward" hidden><div class="kids-a-reward-icon">🌱</div><div><strong>a クリア！</strong><span>「はじめての音」バッジをゲット</span><small>o のレッスンが開いたよ</small></div></section>'
      +'<div class="kids-vowel-write"><b>✍️ 声調記号もいっしょに覚えよう</b><div class="kids-vowel-trace-row" id="kidsVowelTraceRow"></div></div><div class="kids-vowel-special-note" id="kidsVowelSpecialNote" hidden></div>'
      +'<div class="kids-vowel-drill-actions"><button type="button" class="kids-vowel-complete" id="kidsVowelComplete">この母音、できた！</button><button type="button" class="kids-vowel-back-bottom" id="kidsVowelBackBottom">戻る</button></div>';
    progress.insertAdjacentElement('afterend',d);
    el('kidsVowelDrillBack').addEventListener('click',closeDrill);el('kidsVowelBackBottom').addEventListener('click',closeDrill);el('kidsVowelComplete').addEventListener('click',completeCurrent);
    el('kidsAEarListen').addEventListener('click',function(){if(aFlow)playLocalPinyin('a',aFlow.earTone)});
    el('kidsAImitateListen').addEventListener('click',function(){playLocalPinyin('a',2)});
    el('kidsAImitateDone').addEventListener('click',completeImitate);
    el('kidsAQuizListen').addEventListener('click',playCurrentQuizTone);
    el('kidsAQuizNext').addEventListener('click',nextQuizQuestion);
    return d;
  }

  function resetAFlow(){aFlow={earTone:3,earDone:false,imitateDone:false,quizOrder:[1,3,2,4],quizIndex:0,quizCorrect:0,quizAnswered:false,quizDone:false,passed:false}}
  function markAProgress(){
    var p=el('kidsAProgress');if(!p||!aFlow)return;var listenDone=Object.keys(heard).length===4;
    var states={listen:listenDone,ear:aFlow.earDone,imitate:aFlow.imitateDone,quiz:aFlow.passed};
    p.querySelectorAll('span').forEach(function(s){s.classList.toggle('is-done',!!states[s.dataset.step])});
    var ear=el('kidsAEarStage'),imit=el('kidsAImitateStage'),quiz=el('kidsAQuizStage');
    if(ear)ear.hidden=!listenDone;if(imit)imit.hidden=!aFlow.earDone;if(quiz)quiz.hidden=!aFlow.imitateDone;
    if(listenDone&&ear){/* 10.107.95: reveal the ear-training stage silently. Do not auto-play tone 3 here, because it can interrupt the tail of tone 4 on iPhone Safari. */ear.dataset.autoPlayed='manual';}
  }
  function buildToneChoices(containerId,handler){var box=el(containerId);if(!box)return;box.replaceChildren();toneMarks('a').forEach(function(mark,k){var b=document.createElement('button');b.type='button';b.className='kids-a-tone-choice';b.innerHTML='<strong>'+mark+'</strong><small>'+(k+1)+'声</small>';b.addEventListener('click',function(){handler(k+1,b)});box.appendChild(b)})}
  function renderAEarChoices(){buildToneChoices('kidsAEarChoices',function(tone,b){if(!aFlow||aFlow.earDone)return;var fb=el('kidsAEarFeedback');if(tone===aFlow.earTone){aFlow.earDone=true;b.classList.add('is-good');if(fb){fb.textContent='✨ 正解！ 音の上がり下がりが聞こえたね。次は「お手本を聞く」へ';fb.className='kids-a-feedback is-good'};markAProgress()}else{b.classList.add('is-try');if(fb){fb.textContent='もう一度聞いてみよう。まちがえても大丈夫 👂';fb.className='kids-a-feedback'};setTimeout(function(){b.classList.remove('is-try');playLocalPinyin('a',aFlow.earTone)},180)}})}
  function completeImitate(){if(!aFlow||aFlow.imitateDone)return;aFlow.imitateDone=true;var fb=el('kidsAImitateFeedback');if(fb){fb.textContent='いいね！ 次は4問だけチェックしよう';fb.className='kids-a-feedback is-good'};el('kidsAImitateDone').classList.add('is-done');markAProgress();renderQuizQuestion();setTimeout(playCurrentQuizTone,220)}
  function playCurrentQuizTone(){if(!aFlow||aFlow.quizDone)return;playLocalPinyin('a',aFlow.quizOrder[aFlow.quizIndex])}
  function renderQuizQuestion(){
    if(!aFlow)return;var count=el('kidsAQuizCount'),fb=el('kidsAQuizFeedback'),next=el('kidsAQuizNext');if(count)count.textContent=(aFlow.quizIndex+1)+' / 4';if(fb){fb.textContent='';fb.className='kids-a-feedback'}if(next)next.hidden=true;aFlow.quizAnswered=false;
    buildToneChoices('kidsAQuizChoices',function(tone,b){if(!aFlow||aFlow.quizAnswered||aFlow.quizDone)return;aFlow.quizAnswered=true;var correct=aFlow.quizOrder[aFlow.quizIndex],box=el('kidsAQuizChoices');if(tone===correct){aFlow.quizCorrect++;b.classList.add('is-good');if(fb){fb.textContent='✨ 正解！';fb.className='kids-a-feedback is-good'}}else{b.classList.add('is-wrong');if(box){Array.prototype.forEach.call(box.children,function(x,idx){if(idx+1===correct)x.classList.add('is-good')})}if(fb){fb.textContent='答えは '+toneMarks('a')[correct-1]+'。音をもう一度聞いてみよう';fb.className='kids-a-feedback'}}if(next){next.hidden=false;next.textContent=aFlow.quizIndex===3?'結果を見る':'次の問題へ'}})
  }
  function nextQuizQuestion(){if(!aFlow||!aFlow.quizAnswered)return;if(aFlow.quizIndex<3){aFlow.quizIndex++;renderQuizQuestion();setTimeout(playCurrentQuizTone,180);return}finishAQuiz()}
  function finishAQuiz(){
    aFlow.quizDone=true;var passed=aFlow.quizCorrect>=3;aFlow.passed=passed;var fb=el('kidsAQuizFeedback'),next=el('kidsAQuizNext');if(next)next.hidden=true;
    if(passed){if(fb){fb.textContent='🎉 '+aFlow.quizCorrect+' / 4！ クリア！';fb.className='kids-a-feedback is-good'};mastery.a={passed:true,score:aFlow.quizCorrect,total:4,updatedAt:Date.now()};completed.a=true;saveProgress();var reward=el('kidsAReward');if(reward)reward.hidden=false;var complete=el('kidsVowelComplete');if(complete){complete.disabled=false;complete.textContent='次へ：o を見てみる'};markAProgress();updateProgress()}
    else{if(fb){fb.textContent=aFlow.quizCorrect+' / 4。あと少し！ もう一度だけやってみよう';fb.className='kids-a-feedback'};var q=el('kidsAQuizStage'),retry=document.createElement('button');retry.type='button';retry.className='kids-a-retry';retry.textContent='もう一度チャレンジ';retry.addEventListener('click',function(){aFlow.quizIndex=0;aFlow.quizCorrect=0;aFlow.quizAnswered=false;aFlow.quizDone=false;aFlow.passed=false;retry.remove();renderQuizQuestion();setTimeout(playCurrentQuizTone,180)});q.appendChild(retry)}
  }

  function renderDrill(i){
    vowelIndex=i;heard={};introToneBusy=false;introTonePending=null;introToneLastEnd=0;var v=data.vowels[i],d=ensureDrill();if(!d)return;warmPinyin(v.letter);var isA=v.letter==='a';
    el('kidsVowelDrillTitle').textContent=v.letter+' の四声';el('kidsVowelDrillSubtitle').textContent=isA?'きく → ききわけ → まねる → ミニチェック':'きく → よむ → なぞって形を覚える';el('kidsVowelDrillLetter').textContent=v.letter;el('kidsVowelDrillImage').src=v.image;el('kidsVowelDrillImage').alt=v.sceneTitle||v.letter;el('kidsVowelDrillTip').textContent=v.tip+'。'+v.note;
    var p=el('kidsAProgress'),ear=el('kidsAEarStage'),imit=el('kidsAImitateStage'),quiz=el('kidsAQuizStage'),reward=el('kidsAReward');if(p)p.hidden=!isA;if(ear)ear.hidden=true;if(imit)imit.hidden=true;if(quiz)quiz.hidden=true;if(reward)reward.hidden=true;
    var marks=toneMarks(v.letter),labels=toneLabels(),g=el('kidsVowelToneGrid');g.replaceChildren();
    marks.forEach(function(mark,k){var tone=k+1,b=document.createElement('button');b.type='button';b.className='kids-vowel-tone-btn';b.innerHTML='<span class="tone-mark">'+mark+'</span><b>'+tone+'声</b><small>'+labels[k]+'</small>';b.setAttribute('aria-label',mark+' '+tone+'声を聞く');b.addEventListener('click',function(){heard[tone]=true;b.classList.add('is-heard');playIntroToneSerialized(v,tone);if(isA)markAProgress()});g.appendChild(b)});
    var tr=el('kidsVowelTraceRow');tr.replaceChildren();marks.forEach(function(mark){var x=document.createElement('div');x.className='kids-vowel-trace';x.textContent=mark;tr.appendChild(x)});
    var sp=el('kidsVowelSpecialNote');if(v.letter==='ü'){sp.hidden=false;sp.innerHTML='<strong>u と ü は別の音。</strong> ü は u の上に点が2つ。<br>j・q・x ＋ ü は <strong>ju・qu・xu</strong> と書くけれど、点を省くだけで発音は ü のまま。'}else{sp.hidden=true;sp.textContent=''}
    var complete=el('kidsVowelComplete');if(isA){resetAFlow();renderAEarChoices();complete.disabled=true;complete.textContent='4つのステップでクリア'}else{complete.disabled=false;complete.textContent='この母音、できた！'}
    el('kidsVowelGrid').hidden=true;var title=document.querySelector('.kids-lesson-card:has(#kidsVowelGrid) .kids-lesson-title');if(title)title.hidden=true;var prog=el('kidsVowelOverviewProgress');if(prog)prog.hidden=true;d.hidden=false;requestAnimationFrame(function(){d.scrollIntoView({block:'start',behavior:'auto'})})
  }
  function closeDrill(){introTonePending=null;introToneBusy=false;stopAudio();var d=el('kidsVowelDrill');if(d)d.hidden=true;var grid=el('kidsVowelGrid');if(grid)grid.hidden=false;var title=document.querySelector('.kids-lesson-card:has(#kidsVowelGrid) .kids-lesson-title');if(title)title.hidden=false;var p=el('kidsVowelOverviewProgress');if(p)p.hidden=false;renderVowels();requestAnimationFrame(function(){grid.scrollIntoView({block:'start',behavior:'auto'})})}
  function completeCurrent(){var v=data.vowels[vowelIndex];if(v.letter==='a'){if(!(aFlow&&aFlow.passed))return;closeDrill();var oIndex=data.vowels.findIndex(function(x){return x.letter==='o'});if(oIndex>=0)setTimeout(function(){renderDrill(oIndex)},40);return}completed[v.letter]=true;saveProgress();updateProgress();closeDrill()}
  function setVowelCardTitle(){var card=el('kidsVowelGrid');card=card?card.closest('.kids-lesson-card'):null;if(!card)return;var strong=card.querySelector('.kids-lesson-title strong'),small=card.querySelector('.kids-lesson-title small');if(strong)strong.textContent=activeGroupTitle?(activeGroupTitle+' の音あそび'):'6つの母音の音あそび';if(small)small.textContent='音・口の形・イメージをいっしょに覚えよう'}
  function renderVowels(){
    var box=el('kidsVowelGrid');if(!box)return;box.replaceChildren();visibleVowels().forEach(function(v){var i=data.vowels.indexOf(v),unlocked=isUnlocked(v.letter),b=document.createElement('button');b.type='button';b.className='kids-vowel-button';b.dataset.letter=v.letter;b.disabled=!unlocked;b.innerHTML='<img src="'+v.image+'" alt=""><span class="letter">'+v.letter+'</span><small class="hint">'+(unlocked?(v.buttonHint||''):'🔒 ひとつ前をクリア')+'</small>';b.setAttribute('aria-label',unlocked?(v.letter+' の四声練習を開く'):(v.letter+' はまだロックされています'));if(unlocked)b.addEventListener('click',function(){renderDrill(i)});box.appendChild(b)});ensureDrill();setVowelCardTitle();updateProgress()
  }
  window.koepandaOpenVowelGroup=function(letters,title){activeLetters=Array.isArray(letters)?letters.slice():null;activeGroupTitle=title||'';var d=el('kidsVowelDrill');if(d)d.hidden=true;var grid=el('kidsVowelGrid');if(grid)grid.hidden=false;var card=grid?grid.closest('.kids-lesson-card'):null;var t=card?card.querySelector('.kids-lesson-title'):null;if(t)t.hidden=false;var p=el('kidsVowelOverviewProgress');if(p)p.hidden=false;renderVowels()};
  window.koepandaResetVowelGroup=function(){activeLetters=null;activeGroupTitle='';setVowelCardTitle()};
  function init(){loadProgress();renderTones();renderVowels();var entry=el('kidsEntryButton'),back=el('kidsBackHome');if(entry)entry.addEventListener('click',enterKids);if(back)back.addEventListener('click',leaveKids)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
