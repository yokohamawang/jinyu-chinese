(function(){
  "use strict";
  var zcsRest='M126 49 C111 50 91 50 78 49 C64 48 51 48 45 47 C42 46.2 40.3 45 40.5 42.5 C40.7 43.6 40.5 40.7 41 39.6 C41.3 39 42 38.9 42.6 39.5 C44 40.7 47 41.5 50 40.5 C53 41.5 56 42 60 42.4 C75 43.2 91 41 98 40 C104 39 112 40 118 42 C121 43 124 44 126 45Z';
  var zcsTouch='M126 49 C111 50 91 50 78 49 C64 48 51 48 45 47 C42 46.2 40.3 45 40.5 42.5 C40.7 39.6 40.5 36.7 41 35.6 C41.3 35 42 34.9 42.6 35.5 C44 36.7 47 39.5 50 40.5 C53 41.5 56 42 60 42.4 C75 43.2 91 41 98 40 C104 39 112 40 118 42 C121 43 124 44 126 45Z';
  var zcsNarrow='M126 49 C111 50 91 50 78 49 C64 48 51 48 45 47 C42 46.2 40.3 45 40.5 42.5 C40.7 42.7 40.5 39.8 41 38.7 C41.3 38.1 42 38 42.6 38.6 C44 39.8 47 41.05 50 40.5 C53 41.5 56 42 60 42.4 C75 43.2 91 41 98 40 C104 39 112 40 118 42 C121 43 124 44 126 45Z';
  function zcsDiagram(letter,mode,instance){return mode==='live'?window.KP134.front(letter,true,'zcs-'+instance):mode==='contact'?window.KP134.front(letter,false,'zcs-'+instance):window.KP134.mechanism(letter,'zcs-'+instance)}

  var letters=['z','c','s'];
  var guide={"z": {"hanzi": "", "pinyin": "zī（1声・呼読音）", "ipa": "[ts]", "cue": "前歯の後ろで止め、細く開く", "tip": "前歯の後ろ付近で止めてから、細いすき間を開いて息をこすります。", "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/zi1.wav?v=10.108.134"}, "c": {"hanzi": "", "pinyin": "cī（1声・呼読音）", "ipa": "[tsʰ]", "cue": "前のすき間から、はっきり息", "tip": "z と同じ前の位置で止め、開くときにはっきり送気します。", "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/ci1.wav?v=10.108.134"}, "s": {"hanzi": "", "pinyin": "sī（1声・呼読音）", "ipa": "[s]", "cue": "前の細いすき間で息", "tip": "舌の前部と歯の付近に細いすき間を残し、息を続けます。", "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/si1.wav?v=10.108.134"}};;;
  var selected='z',root,recordings={},recorder=null,stream=null,pendingRecord=false,recordToken=0,recordTimer=0;
  var playback=null,modelToken=0,playingTimer=0,quizTimer=0,resultTimer=0,quiz={active:false,order:[],index:0,score:0,answered:false},celebration=null;
  function el(id){return document.getElementById(id)}
  function feedback(id,text,kind){var box=el(id);box.textContent=text;box.className=(id==='zcsModelFeedback'?'zcs-model-feedback':'zcs-feedback')+(kind?' is-'+kind:'')}
  function complete(){try{return localStorage.getItem('koepandaInitialP8Complete')==='1'}catch(e){return false}}
  function redrawRecordingControls(){
    var busy=pendingRecord||!!(recorder&&recorder.state==='recording');
    root.querySelectorAll('[data-zcs-letter]').forEach(function(b){b.disabled=busy});
    el('zcsModel').disabled=busy;el('zcsToQuiz').disabled=busy;
    el('zcsPlayback').disabled=busy||!recordings[selected];
    el('zcsPracticeTarget').textContent='練習する音：'+selected;
    if(!busy){el('zcsRecord').textContent=recordings[selected]?'↻ もう一度録音':'● 録音する';el('zcsRecord').disabled=false;el('zcsRecord').classList.remove('is-recording');el('zcsRecord').removeAttribute('aria-busy')}
  }
  function stopSound(){
    modelToken++;clearTimeout(playingTimer);
    try{if(window.KP134)window.KP134.stopFor(root)}catch(e){}
    
    if(playback){try{playback.pause()}catch(e){}}
    root.querySelectorAll('.is-playing').forEach(function(b){b.classList.remove('is-playing')});
    root.querySelectorAll('#zcsModel[aria-busy],#zcsQuizListen[aria-busy]').forEach(function(b){b.removeAttribute('aria-busy')});
  }
  function resetArt(){window.KP134.progress(root,selected,matchMedia('(prefers-reduced-motion: reduce)').matches?1:0)}
  function fallbackSpeech(text){
    return new Promise(function(resolve,reject){
      if(!('speechSynthesis' in window)){reject(new Error('speech unavailable'));return}
      var u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=.78;
      var voices=speechSynthesis.getVoices(),voice=voices.find(function(v){return /^zh[-_](CN|Hans)/i.test(v.lang)});if(voice)u.voice=voice;
      var timer=setTimeout(function(){reject(new Error('speech timeout'))},6000);
      u.onstart=function(){clearTimeout(timer);resolve(true)};u.onerror=function(){clearTimeout(timer);reject(new Error('speech failed'))};
      speechSynthesis.speak(u);
    });
  }
  async function playModel(letter,button,forQuiz){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();var token=modelToken,index=quiz.index,fb=forQuiz?'zcsQuizFeedback':'zcsModelFeedback';
    button.classList.add('is-playing');button.setAttribute('aria-busy','true');
    if(forQuiz&&!quiz.answered){quiz.heard=false;el('zcsQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=true})}
    feedback(fb,'お手本を準備しています…');
    function clear(){button.classList.remove('is-playing');button.removeAttribute('aria-busy')}
    try{await window.KP134.play(letter,{root:root,button:button,onCancel:clear,onPlaying:function(){if(token===modelToken&&!forQuiz){feedback(fb,'聞いて・見て・まねよう。')}},onEnded:function(){if(token!==modelToken)return;clear();if(forQuiz&&quiz.active&&quiz.index===index&&!quiz.answered){quiz.heard=true;el('zcsQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=false});feedback(fb,'聞こえた音を選ぼう。')}},onError:function(){if(token===modelToken){clear();feedback(fb,'音声を読み込めませんでした。もう一度押してね。','bad')}}})}
    catch(e){if(e&&e.name==='AbortError')return;if(token===modelToken){clear();feedback(fb,'音声を再生できませんでした。もう一度押してね。','bad')}}
  }
  function renderArt(){window.KP135.park(root,'zcs');
    el('zcsArticulation').innerHTML=window.KP134.panel(selected,'zcs');window.KP135.mount(root,'zcs',selected);
    var item=guide[selected];el('zcsStaticGuide').innerHTML='<div class="zcs-static-views">'+item.labels.map(function(label,i){return '<figure><strong>'+label+'</strong>'+zcsDiagram(selected,i===0?'contact':'release','static'+i)+'<figcaption>'+item.notes[i]+'</figcaption></figure>'}).join('')+'</div>';el('zcsStaticLetter').textContent=selected;
    var svg=el('zcsArticulation').querySelector('svg');if(matchMedia('(prefers-reduced-motion: reduce)').matches){svg.pauseAnimations();svg.setCurrentTime(1.1)}
  }
  function select(letter,listen){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    selected=letter;root.querySelectorAll('[data-zcs-letter]').forEach(function(b){var active=b.dataset.zcsLetter===letter;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
    var item=guide[letter];el('zcsFocusLetter').textContent=letter;el('zcsFocusGuide').textContent=item.hanzi+' '+item.pinyin+' · '+item.ipa;el('zcsFocusTip').textContent=item.tip;
    el('zcsModel').textContent='▶ '+letter+' のお手本を聞く';feedback('zcsModelFeedback','');feedback('zcsPracticeFeedback',recordings[letter]?'この音の録音を聞き返せます。':'');
    renderArt();redrawRecordingControls();if(listen)playModel(letter,el('zcsModel'),false);
  }
  function mimeType(){var types=['audio/mp4','audio/webm;codecs=opus','audio/webm'];for(var i=0;i<types.length;i++)try{if(MediaRecorder.isTypeSupported(types[i]))return types[i]}catch(e){}return ''}
  async function toggleRecord(){
    if(pendingRecord)return;
    if(recorder&&recorder.state==='recording'){recorder.stop();return}
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||typeof MediaRecorder==='undefined'){feedback('zcsPracticeFeedback','このブラウザでは録音を使えません。','bad');return}
    stopSound();pendingRecord=true;var token=++recordToken,letter=selected,chunks=[];
    el('zcsRecord').disabled=true;el('zcsRecord').textContent='マイクを準備中…';el('zcsRecord').setAttribute('aria-busy','true');redrawRecordingControls();
    feedback('zcsPracticeFeedback','マイクを準備しています…');
    try{
      var media=await navigator.mediaDevices.getUserMedia({audio:true});
      if(token!==recordToken){media.getTracks().forEach(function(t){t.stop()});return}
      stream=media;var mt=mimeType(),rec=new MediaRecorder(media,mt?{mimeType:mt}:undefined);recorder=rec;
      rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data)};
      rec.onstop=function(){
        clearTimeout(recordTimer);media.getTracks().forEach(function(t){t.stop()});if(stream===media)stream=null;if(recorder===rec)recorder=null;
        if(token!==recordToken)return;
        var blob=new Blob(chunks,{type:rec.mimeType||mt||'audio/mp4'});
        if(blob.size){if(recordings[letter])URL.revokeObjectURL(recordings[letter]);recordings[letter]=URL.createObjectURL(blob);feedback('zcsPracticeFeedback','録音できたよ。お手本と聞きくらべてみよう。','good')}else feedback('zcsPracticeFeedback','録音を保存できませんでした。もう一度録音してね。','bad');
        redrawRecordingControls();
      };
      rec.onerror=function(){feedback('zcsPracticeFeedback','録音を続けられませんでした。もう一度試してね。','bad');try{rec.stop()}catch(e){}media.getTracks().forEach(function(t){t.stop()})};
      pendingRecord=false;rec.start(100);el('zcsRecord').disabled=false;el('zcsRecord').removeAttribute('aria-busy');el('zcsRecord').textContent='■ 録音を止める';el('zcsRecord').classList.add('is-recording');redrawRecordingControls();
      feedback('zcsPracticeFeedback','録音中… もう一度押すと止まります。10秒で自動停止。');recordTimer=setTimeout(function(){if(rec.state==='recording')rec.stop()},10000);
    }catch(e){if(token!==recordToken)return;pendingRecord=false;if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}recorder=null;redrawRecordingControls();feedback('zcsPracticeFeedback','マイクの許可を確認して、もう一度試してね。','bad')}
  }
  async function playRecording(){
    if(!recordings[selected]||pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();var button=el('zcsPlayback');playback=new Audio(recordings[selected]);playback.playsInline=true;button.classList.add('is-playing');
    playback.onended=function(){button.classList.remove('is-playing')};playback.onerror=function(){button.classList.remove('is-playing');feedback('zcsPracticeFeedback','録音を再生できませんでした。もう一度試してね。','bad')};
    try{await playback.play()}catch(e){button.classList.remove('is-playing');feedback('zcsPracticeFeedback','もう一度「自分の声を聞く」を押してね。','bad')}
  }
  function quizOrder(){
    var source=letters.concat(letters[Math.floor(Math.random()*letters.length)]),orders=[],seen={};
    function visit(prefix,left){if(!left.length){var key=prefix.join('');if(!seen[key]){seen[key]=true;orders.push(prefix)}return}left.forEach(function(l,i){if(prefix[prefix.length-1]!==l)visit(prefix.concat(l),left.slice(0,i).concat(left.slice(i+1)))})}
    visit([],source);return orders[Math.floor(Math.random()*orders.length)];
  }
  function renderQuestion(){
    var box=el('zcsQuizChoices');box.replaceChildren();letters.forEach(function(letter){var b=document.createElement('button');b.type='button';b.textContent=letter;b.dataset.zcsAnswer=letter;b.disabled=true;b.onclick=function(){answer(letter,b)};box.appendChild(b)});
    el('zcsQuizCount').textContent=(quiz.index+1)+' / 4';feedback('zcsQuizFeedback','音を聞いてから選ぼう。');el('zcsQuizNext').hidden=true;quiz.answered=false;quiz.heard=false;
  }
  function startQuiz(){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();clearTimeout(quizTimer);clearTimeout(resultTimer);quiz={active:true,order:quizOrder(),index:0,score:0,answered:false};el('zcsToQuiz').hidden=true;el('zcsResult').hidden=true;el('zcsQuizPanel').hidden=false;root.querySelector('.zcs-practice').hidden=true;renderQuestion();
    el('zcsQuizPanel').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }
  function answer(letter,button){
    if(!quiz.active||quiz.answered||!quiz.heard)return;quiz.answered=true;var right=quiz.order[quiz.index],correct=letter===right;
    el('zcsQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=true;if(b.dataset.zcsAnswer===right)b.classList.add('is-correct')});
    if(correct){quiz.score++;feedback('zcsQuizFeedback','いい耳！ '+right+' だよ。','good')}else{button.classList.add('is-wrong');feedback('zcsQuizFeedback','今回は '+right+'。もう一度音を聞いて確かめよう。','bad')}
    if(quiz.index===3)quizTimer=setTimeout(function(){if(quiz.active&&quiz.answered&&quiz.index===3)finishQuiz()},650);else el('zcsQuizNext').hidden=false;
  }
  function nextQuestion(){if(!quiz.active||!quiz.answered||quiz.index>=3)return;quiz.index++;renderQuestion();playModel(quiz.order[quiz.index],el('zcsQuizListen'),true)}
  function showResultStage(){
    if(!celebration||typeof window.koepandaShowResultCelebration!=='function')return;
    var stage=window.koepandaShowResultCelebration(celebration);if(stage)stage.classList.add('is-zcs-result');
  }
  function finishQuiz(){
    quiz.active=false;stopSound();var passed=quiz.score>=3;el('zcsQuizPanel').hidden=true;el('zcsResult').hidden=false;el('zcsRetry').hidden=passed;el('zcsReturn').hidden=!passed;
    el('zcsResultMark').textContent=passed?'✓':'↻';el('zcsResultTitle').textContent=passed?'ミニチェック合格！':'もう一度、聞き比べよう';el('zcsResultScore').textContent='4問中 '+quiz.score+'問正解';
    var message=passed?'舌先と、z・c・s の息の違いがつかめたよ。':'z と c の息の強さ、s の続く息を聞いてみよう。';el('zcsResultMessage').textContent=message;
    if(passed){try{localStorage.setItem('koepandaInitialP8Complete','1')}catch(e){}el('zcsCompleteBadge').hidden=false}
    celebration={score:quiz.score,total:4,passed:passed,title:passed?'z・c・s クリア！':'あと一歩！',message:message};
    if(window.koepandaAttachResultReplay){window.koepandaAttachResultReplay(el('zcsResult'),celebration);var replay=el('zcsResult').querySelector('.koepanda-result-reopen');if(replay)replay.onclick=showResultStage}
    resultTimer=setTimeout(showResultStage,90);
    el('zcsResult').scrollIntoView({block:'center',behavior:'smooth'});
  }
  function cleanup(){
    stopSound();recordToken++;pendingRecord=false;clearTimeout(recordTimer);clearTimeout(quizTimer);clearTimeout(resultTimer);
    var stage=document.querySelector('#koepandaResultStage.is-zcs-result');if(stage)stage.remove();
    if(recorder&&recorder.state==='recording')try{recorder.stop()}catch(e){}
    if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}recorder=null;redrawRecordingControls();
    feedback('zcsPracticeFeedback',recordings[selected]?'この音の録音を聞き返せます。':'');feedback('zcsModelFeedback','');
    if(quiz.active){quiz.active=false;el('zcsQuizPanel').hidden=true;el('zcsToQuiz').hidden=false;root.querySelector('.zcs-practice').hidden=false}
  }
  function init(){
    root=el('kidsInitialsZCSLesson');if(!root)return;window.KP134.attach(root,letters);
    letters.forEach(function(letter){var item=guide[letter],button=document.createElement('button');button.type='button';button.className='zcs-letter-card';button.dataset.zcsLetter=letter;button.innerHTML='<strong>'+letter+'</strong><small>'+item.ipa+'</small><em>'+(letter==='s'?'続く息':item.cue)+'</em>';button.onclick=function(){select(letter,true)};el('zcsLetterGrid').appendChild(button);
      var free=document.createElement('button');free.type='button';free.dataset.zcsLetter=letter;free.textContent=letter;free.onclick=function(){select(letter,true)};el('zcsFreeChoice').appendChild(free)});
    el('zcsModel').onclick=function(){playModel(selected,this,false)};el('zcsRecord').onclick=toggleRecord;el('zcsPlayback').onclick=playRecording;el('zcsToQuiz').onclick=startQuiz;el('zcsRetry').onclick=startQuiz;
    el('zcsQuizListen').onclick=function(){if(quiz.active)playModel(quiz.order[quiz.index],this,true)};el('zcsQuizNext').onclick=nextQuestion;
    el('zcsReturn').onclick=function(){cleanup();var back=el('pinyinLessonBack');if(back)back.click();window.dispatchEvent(new CustomEvent('koepandaInitialProgressChanged',{detail:{P8:complete()}}))};
    root.addEventListener('click',function(e){var button=e.target.closest('button');if(!button)return;button.classList.add('is-pressed');setTimeout(function(){button.classList.remove('is-pressed')},160)});
    var wasActive=false,observer=new MutationObserver(function(){var active=!root.hidden&&root.classList.contains('is-roadmap-lesson-active')&&root.getClientRects().length>0;if(wasActive&&!active)cleanup();wasActive=active});observer.observe(root,{attributes:true,attributeFilter:['hidden','class']});
    if(el('kidsCourse'))observer.observe(el('kidsCourse'),{attributes:true,attributeFilter:['hidden','class','style']});observer.observe(document.body,{attributes:true,attributeFilter:['class']});
    window.addEventListener('pagehide',cleanup);el('zcsCompleteBadge').hidden=!complete();select('z',false);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

})();
