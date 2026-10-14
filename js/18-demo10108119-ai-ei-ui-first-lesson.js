(function(){
  "use strict";
  var mouthCrops={a:[18,145],e:[881,145],i:[18,632],u:[451,632]};
  function photo(pose,live,index){var p=mouthCrops[pose];return '<svg '+(live?'class="cpv-pose cpv-pose-'+index+'" ':'')+'x="0" y="0" width="144" height="132" viewBox="'+p[0]+' '+p[1]+' 412 378" aria-hidden="true"><image href="./assets/articulation/vowel-mouth-101.png" width="1312" height="1199" /></svg>'}
  function cpvDiagram(letter,mode,instance){return mode==='live'?window.KP134.front(letter,true,'cpv-'+instance):mode==='contact'?window.KP134.front(letter,false,'cpv-'+instance):window.KP134.mechanism(letter,'cpv-'+instance)}
  function route(letter){var ui=letter==='ui',marks=ui?['u','e','i']:letter==='ai'?['a','i']:['e','i'];return '<svg class="cpv-route" viewBox="0 0 180 54" aria-hidden="true"><path d="M12 22H166" stroke="#cfdfd2" stroke-width="3" fill="none"/>'+marks.map(function(p,i){var x=ui?[12,89,166][i]:[12,166][i];return '<circle cx="'+x+'" cy="22" r="4" fill="#dbeadf"/><text x="'+x+'" y="46" text-anchor="middle" fill="#376e53" font-size="14">'+p+'</text>'}).join('')+'<circle class="cpv-flow-dot" cx="12" cy="22" r="5" fill="#3c9975"><animate attributeName="cx" values="12;166;166;12;12" keyTimes="0;.72;.90;.9001;1" dur="4.8s" repeatCount="indefinite"/></circle></svg>'}

  var letters=['ai','ei','ui'];
  var guide={"ai": {"hanzi": "唉", "pinyin": "āi", "ipa": "[ai̯]", "cue": "開きから、横へ", "tip": "a の開きから i の方向へ、開きを小さくしてひと息でつなぎます。", "poses": ["a", "i"], "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/ai1.wav?v=10.108.134"}, "ei": {"hanzi": "诶", "pinyin": "ēi", "ipa": "[ei̯]", "cue": "前寄りの e から i へ", "tip": "前寄りの e から i の方向へ。唇を丸めず、なめらかにつなぎます。", "poses": ["e", "i"], "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/ei1.wav?v=10.108.134"}, "ui": {"hanzi": "微", "pinyin": "wēi", "ipa": "[uei̯]", "cue": "丸さをほどき、横へ", "tip": "u から短い e を通って i へ。独立した音節では wei と書きます。", "poses": ["u", "e", "i"], "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/wei1.wav?v=10.108.134"}};;
  var selected='ai',root,recordings={},recorder=null,stream=null,pendingRecord=false,recordToken=0,recordTimer=0;
  var playback=null,modelToken=0,playingTimer=0,quizTimer=0,resultTimer=0,quiz={active:false,order:[],index:0,score:0,answered:false},celebration=null;
  function el(id){return document.getElementById(id)}
  function feedback(id,text,kind){var box=el(id);box.textContent=text;box.className=(id==='cpvModelFeedback'?'cpv-model-feedback':'cpv-feedback')+(kind?' is-'+kind:'')}
  function complete(){try{return localStorage.getItem('koepandaCompoundP9Complete')==='1'}catch(e){return false}}
  function redrawRecordingControls(){
    var busy=pendingRecord||!!(recorder&&recorder.state==='recording');
    root.querySelectorAll('[data-cpv-letter]').forEach(function(b){b.disabled=busy});
    el('cpvModel').disabled=busy;el('cpvToQuiz').disabled=busy;
    el('cpvPlayback').disabled=busy||!recordings[selected];
    el('cpvPracticeTarget').textContent='練習する音：'+selected;
    if(!busy){el('cpvRecord').textContent=recordings[selected]?'↻ もう一度録音':'● 録音する';el('cpvRecord').disabled=false;el('cpvRecord').classList.remove('is-recording');el('cpvRecord').removeAttribute('aria-busy')}
  }
  function stopSound(){
    modelToken++;clearTimeout(playingTimer);
    try{if(window.KP134)window.KP134.stopFor(root)}catch(e){}
    
    if(playback){try{playback.pause()}catch(e){}}
    root.querySelectorAll('.is-playing').forEach(function(b){b.classList.remove('is-playing')});
    root.querySelectorAll('#cpvModel[aria-busy],#cpvQuizListen[aria-busy]').forEach(function(b){b.removeAttribute('aria-busy')});
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
    stopSound();var token=modelToken,index=quiz.index,fb=forQuiz?'cpvQuizFeedback':'cpvModelFeedback';
    button.classList.add('is-playing');button.setAttribute('aria-busy','true');
    if(forQuiz&&!quiz.answered){quiz.heard=false;el('cpvQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=true})}
    feedback(fb,'お手本を準備しています…');
    function clear(){button.classList.remove('is-playing');button.removeAttribute('aria-busy')}
    try{await window.KP134.play(letter,{root:root,button:button,onCancel:clear,onPlaying:function(){if(token===modelToken&&!forQuiz){feedback(fb,'聞いて・見て・まねよう。')}},onEnded:function(){if(token!==modelToken)return;clear();if(forQuiz&&quiz.active&&quiz.index===index&&!quiz.answered){quiz.heard=true;el('cpvQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=false});feedback(fb,'聞こえた音を選ぼう。')}},onError:function(){if(token===modelToken){clear();feedback(fb,'音声を読み込めませんでした。もう一度押してね。','bad')}}})}
    catch(e){if(e&&e.name==='AbortError')return;if(token===modelToken){clear();feedback(fb,'音声を再生できませんでした。もう一度押してね。','bad')}}
  }
  function renderArt(){window.KP135.park(root,'cpv');
    el('cpvArticulation').innerHTML=window.KP134.panel(selected,'cpv');window.KP135.mount(root,'cpv',selected);
    var item=guide[selected];el('cpvStaticGuide').innerHTML='<div class="cpv-static-views">'+item.labels.map(function(label,i){return '<figure><strong>'+label+'</strong>'+cpvDiagram(selected,i===0?'contact':'release','static'+i)+'<figcaption>'+item.notes[i]+'</figcaption></figure>'}).join('')+'</div>';el('cpvStaticLetter').textContent=selected;
    if(root.hidden||!root.classList.contains('is-roadmap-lesson-active')||matchMedia('(prefers-reduced-motion: reduce)').matches)root.querySelectorAll('.cpv-art-svg,.cpv-route').forEach(function(svg){svg.pauseAnimations();svg.setCurrentTime(0)})
  }
  function select(letter,listen){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    selected=letter;root.querySelectorAll('[data-cpv-letter]').forEach(function(b){var active=b.dataset.cpvLetter===letter;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
    var item=guide[letter];el('cpvFocusLetter').textContent=letter;el('cpvFocusGuide').textContent=item.hanzi+' '+item.pinyin+' · '+item.ipa;el('cpvFocusTip').textContent=item.tip;
    el('cpvModel').textContent='▶ '+letter+' のお手本を聞く';feedback('cpvModelFeedback','');feedback('cpvPracticeFeedback',recordings[letter]?'この音の録音を聞き返せます。':'');
    renderArt();redrawRecordingControls();if(listen)playModel(letter,el('cpvModel'),false);
  }
  function mimeType(){var types=['audio/mp4','audio/webm;codecs=opus','audio/webm'];for(var i=0;i<types.length;i++)try{if(MediaRecorder.isTypeSupported(types[i]))return types[i]}catch(e){}return ''}
  async function toggleRecord(){
    if(pendingRecord)return;
    if(recorder&&recorder.state==='recording'){recorder.stop();return}
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||typeof MediaRecorder==='undefined'){feedback('cpvPracticeFeedback','このブラウザでは録音を使えません。','bad');return}
    stopSound();pendingRecord=true;var token=++recordToken,letter=selected,chunks=[];
    el('cpvRecord').disabled=true;el('cpvRecord').textContent='マイクを準備中…';el('cpvRecord').setAttribute('aria-busy','true');redrawRecordingControls();
    feedback('cpvPracticeFeedback','マイクを準備しています…');
    try{
      var media=await navigator.mediaDevices.getUserMedia({audio:true});
      if(token!==recordToken){media.getTracks().forEach(function(t){t.stop()});return}
      stream=media;var mt=mimeType(),rec=new MediaRecorder(media,mt?{mimeType:mt}:undefined);recorder=rec;
      rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data)};
      rec.onstop=function(){
        clearTimeout(recordTimer);media.getTracks().forEach(function(t){t.stop()});if(stream===media)stream=null;if(recorder===rec)recorder=null;
        if(token!==recordToken)return;
        var blob=new Blob(chunks,{type:rec.mimeType||mt||'audio/mp4'});
        if(blob.size){if(recordings[letter])URL.revokeObjectURL(recordings[letter]);recordings[letter]=URL.createObjectURL(blob);feedback('cpvPracticeFeedback','録音できたよ。お手本と聞きくらべてみよう。','good')}else feedback('cpvPracticeFeedback','録音を保存できませんでした。もう一度録音してね。','bad');
        redrawRecordingControls();
      };
      rec.onerror=function(){feedback('cpvPracticeFeedback','録音を続けられませんでした。もう一度試してね。','bad');try{rec.stop()}catch(e){}media.getTracks().forEach(function(t){t.stop()})};
      pendingRecord=false;rec.start(100);el('cpvRecord').disabled=false;el('cpvRecord').removeAttribute('aria-busy');el('cpvRecord').textContent='■ 録音を止める';el('cpvRecord').classList.add('is-recording');redrawRecordingControls();
      feedback('cpvPracticeFeedback','録音中… もう一度押すと止まります。10秒で自動停止。');recordTimer=setTimeout(function(){if(rec.state==='recording')rec.stop()},10000);
    }catch(e){if(token!==recordToken)return;pendingRecord=false;if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}recorder=null;redrawRecordingControls();feedback('cpvPracticeFeedback','マイクの許可を確認して、もう一度試してね。','bad')}
  }
  async function playRecording(){
    if(!recordings[selected]||pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();var button=el('cpvPlayback');playback=new Audio(recordings[selected]);playback.playsInline=true;button.classList.add('is-playing');
    playback.onended=function(){button.classList.remove('is-playing')};playback.onerror=function(){button.classList.remove('is-playing');feedback('cpvPracticeFeedback','録音を再生できませんでした。もう一度試してね。','bad')};
    try{await playback.play()}catch(e){button.classList.remove('is-playing');feedback('cpvPracticeFeedback','もう一度「自分の声を聞く」を押してね。','bad')}
  }
  function quizOrder(){
    var source=letters.concat(letters[Math.floor(Math.random()*letters.length)]),orders=[],seen={};
    function visit(prefix,left){if(!left.length){var key=prefix.join('');if(!seen[key]){seen[key]=true;orders.push(prefix)}return}left.forEach(function(l,i){if(prefix[prefix.length-1]!==l)visit(prefix.concat(l),left.slice(0,i).concat(left.slice(i+1)))})}
    visit([],source);return orders[Math.floor(Math.random()*orders.length)];
  }
  function renderQuestion(){
    var box=el('cpvQuizChoices');box.replaceChildren();letters.forEach(function(letter){var b=document.createElement('button');b.type='button';b.textContent=letter;b.dataset.cpvAnswer=letter;b.disabled=true;b.onclick=function(){answer(letter,b)};box.appendChild(b)});
    el('cpvQuizCount').textContent=(quiz.index+1)+' / 4';feedback('cpvQuizFeedback','音を聞いてから選ぼう。');el('cpvQuizNext').hidden=true;quiz.answered=false;quiz.heard=false;
  }
  function startQuiz(){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();clearTimeout(quizTimer);clearTimeout(resultTimer);quiz={active:true,order:quizOrder(),index:0,score:0,answered:false};el('cpvToQuiz').hidden=true;el('cpvResult').hidden=true;el('cpvQuizPanel').hidden=false;root.querySelector('.cpv-practice').hidden=true;renderQuestion();
    el('cpvQuizPanel').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }
  function answer(letter,button){
    if(!quiz.active||quiz.answered||!quiz.heard)return;quiz.answered=true;var right=quiz.order[quiz.index],correct=letter===right;
    el('cpvQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=true;if(b.dataset.cpvAnswer===right)b.classList.add('is-correct')});
    if(correct){quiz.score++;feedback('cpvQuizFeedback','いい耳！ '+right+' だよ。','good')}else{button.classList.add('is-wrong');feedback('cpvQuizFeedback','今回は '+right+'。もう一度音を聞いて確かめよう。','bad')}
    if(quiz.index===3)quizTimer=setTimeout(function(){if(quiz.active&&quiz.answered&&quiz.index===3)finishQuiz()},650);else el('cpvQuizNext').hidden=false;
  }
  function nextQuestion(){if(!quiz.active||!quiz.answered||quiz.index>=3)return;quiz.index++;renderQuestion();playModel(quiz.order[quiz.index],el('cpvQuizListen'),true)}
  function showResultStage(){
    if(!celebration||typeof window.koepandaShowResultCelebration!=='function')return;
    var stage=window.koepandaShowResultCelebration(celebration);if(stage)stage.classList.add('is-cpv-result');
  }
  function finishQuiz(){
    quiz.active=false;stopSound();var passed=quiz.score>=3;el('cpvQuizPanel').hidden=true;el('cpvResult').hidden=false;el('cpvRetry').hidden=passed;el('cpvReturn').hidden=!passed;
    el('cpvResultMark').textContent=passed?'✓':'↻';el('cpvResultTitle').textContent=passed?'ミニチェック合格！':'もう一度、聞き比べよう';el('cpvResultScore').textContent='4問中 '+quiz.score+'問正解';
    var message=passed?'ai・ei・ui のつながりを聞き分けられたね。':'はじめの口形と、音のつながりを聞き比べよう。';el('cpvResultMessage').textContent=message;
    if(passed){try{localStorage.setItem('koepandaCompoundP9Complete','1')}catch(e){}el('cpvCompleteBadge').hidden=false}
    celebration={score:quiz.score,total:4,passed:passed,title:passed?'ai・ei・ui クリア！':'あと一歩！',message:message};
    if(window.koepandaAttachResultReplay){window.koepandaAttachResultReplay(el('cpvResult'),celebration);var replay=el('cpvResult').querySelector('.koepanda-result-reopen');if(replay)replay.onclick=showResultStage}
    resultTimer=setTimeout(showResultStage,90);
    el('cpvResult').scrollIntoView({block:'center',behavior:'smooth'});
  }
  function cleanup(){
    stopSound();root.querySelectorAll('.cpv-route').forEach(function(svg){try{svg.pauseAnimations()}catch(e){}});recordToken++;pendingRecord=false;clearTimeout(recordTimer);clearTimeout(quizTimer);clearTimeout(resultTimer);
    var stage=document.querySelector('#koepandaResultStage.is-cpv-result');if(stage)stage.remove();
    if(recorder&&recorder.state==='recording')try{recorder.stop()}catch(e){}
    if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}recorder=null;redrawRecordingControls();
    feedback('cpvPracticeFeedback',recordings[selected]?'この音の録音を聞き返せます。':'');feedback('cpvModelFeedback','');
    if(quiz.active){quiz.active=false;el('cpvQuizPanel').hidden=true;el('cpvToQuiz').hidden=false;root.querySelector('.cpv-practice').hidden=false}
  }
  function init(){
    root=el('kidsCompoundAIEIUILesson');if(!root)return;window.KP134.attach(root,letters);
    letters.forEach(function(letter){var item=guide[letter],button=document.createElement('button');button.type='button';button.className='cpv-letter-card';button.dataset.cpvLetter=letter;button.innerHTML='<strong>'+letter+'</strong><small>'+item.ipa+'</small><em>'+item.cue+'</em>';button.onclick=function(){select(letter,true)};el('cpvLetterGrid').appendChild(button);
      var free=document.createElement('button');free.type='button';free.dataset.cpvLetter=letter;free.textContent=letter;free.onclick=function(){select(letter,true)};el('cpvFreeChoice').appendChild(free)});
    el('cpvModel').onclick=function(){playModel(selected,this,false)};el('cpvRecord').onclick=toggleRecord;el('cpvPlayback').onclick=playRecording;el('cpvToQuiz').onclick=startQuiz;el('cpvRetry').onclick=startQuiz;
    el('cpvQuizListen').onclick=function(){if(quiz.active)playModel(quiz.order[quiz.index],this,true)};el('cpvQuizNext').onclick=nextQuestion;
    el('cpvReturn').onclick=function(){cleanup();var back=el('pinyinLessonBack');if(back)back.click();window.dispatchEvent(new CustomEvent('koepandaInitialProgressChanged',{detail:{P9:complete()}}))};
    root.addEventListener('click',function(e){var button=e.target.closest('button');if(!button)return;button.classList.add('is-pressed');setTimeout(function(){button.classList.remove('is-pressed')},160)});
    var wasActive=false,observer=new MutationObserver(function(){var active=!root.hidden&&root.classList.contains('is-roadmap-lesson-active')&&root.getClientRects().length>0;if(wasActive&&!active)cleanup();else if(!wasActive&&active)resetArt();wasActive=active});observer.observe(root,{attributes:true,attributeFilter:['hidden','class']});
    if(el('kidsCourse'))observer.observe(el('kidsCourse'),{attributes:true,attributeFilter:['hidden','class','style']});observer.observe(document.body,{attributes:true,attributeFilter:['class']});
    window.addEventListener('pagehide',cleanup);el('cpvCompleteBadge').hidden=!complete();select('ai',false);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

})();
