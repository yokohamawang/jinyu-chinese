/* 10.108.127 — P10 controller restored in update package; lesson behavior retained. */
(function(){
  "use strict";
  var mouthCrops={a:[18,145],e:[881,145],o:[451,145],i:[18,632],u:[451,632]};
  function photo(pose,live,index){var p=mouthCrops[pose];return '<svg '+(live?'class="cpo-pose cpo-pose-'+index+'" ':'')+'x="0" y="0" width="144" height="132" viewBox="'+p[0]+' '+p[1]+' 412 378" aria-hidden="true"><image href="./assets/articulation/vowel-mouth-101.png" width="1312" height="1199" /></svg>'}
  function cpoDiagram(letter,mode,instance){return mode==='live'?window.KP134.front(letter,true,'cpo-'+instance):mode==='contact'?window.KP134.front(letter,false,'cpo-'+instance):window.KP134.mechanism(letter,'cpo-'+instance)}
  function route(letter){var ui=letter==='iu',marks=guide[letter].poses;return '<svg class="cpo-route" viewBox="0 0 180 54" aria-hidden="true"><path d="M12 22H166" stroke="#cfdfd2" stroke-width="3" fill="none"/>'+marks.map(function(p,i){var x=ui?[12,89,166][i]:[12,166][i];return '<circle cx="'+x+'" cy="22" r="4" fill="#dbeadf"/><text x="'+x+'" y="46" text-anchor="middle" fill="#376e53" font-size="14">'+p+'</text>'}).join('')+'<circle class="cpo-flow-dot" cx="12" cy="22" r="5" fill="#3c9975"><animate attributeName="cx" values="12;166;166;12;12" keyTimes="0;.72;.90;.9001;1" dur="4.8s" repeatCount="indefinite"/></circle></svg>'}

  var letters=['ao','ou','iu'];
  var guide={"ao": {"hanzi": "凹", "pinyin": "āo", "ipa": "[ɑʊ̯]", "cue": "開きから、丸く収める", "tip": "a の大きい開きから、唇を丸めて u に近い方向へ収めます。", "poses": ["a", "u"], "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/ao1.wav?v=10.108.134"}, "ou": {"hanzi": "欧", "pinyin": "ōu", "ipa": "[oʊ̯]", "cue": "丸さを保ち、少し小さく", "tip": "o の丸い形から、小さく収めます。ao より動きは小さめです。", "poses": ["o", "u"], "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/ou1.wav?v=10.108.134"}, "iu": {"hanzi": "优", "pinyin": "yōu", "ipa": "[ioʊ̯]", "cue": "横から、丸さへ", "tip": "i から o を通り u の方向へ。独立音節 you と、声母後の iu では強さが変わります。", "poses": ["i", "o", "u"], "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/you1.wav?v=10.108.134"}};;
  var selected='ao',root,recordings={},recorder=null,stream=null,pendingRecord=false,recordToken=0,recordTimer=0;
  var playback=null,modelToken=0,playingTimer=0,quizTimer=0,resultTimer=0,quiz={active:false,order:[],index:0,score:0,answered:false},celebration=null;
  function el(id){return document.getElementById(id)}
  function feedback(id,text,kind){var box=el(id);box.textContent=text;box.className=(id==='cpoModelFeedback'?'cpo-model-feedback':'cpo-feedback')+(kind?' is-'+kind:'')}
  function complete(){try{return localStorage.getItem('koepandaCompoundP10Complete')==='1'}catch(e){return false}}
  function redrawRecordingControls(){
    var busy=pendingRecord||!!(recorder&&recorder.state==='recording');
    root.querySelectorAll('[data-cpo-letter]').forEach(function(b){b.disabled=busy});
    el('cpoModel').disabled=busy;el('cpoToQuiz').disabled=busy;
    el('cpoPlayback').disabled=busy||!recordings[selected];
    el('cpoPracticeTarget').textContent='練習する音：'+selected;
    if(!busy){el('cpoRecord').textContent=recordings[selected]?'↻ もう一度録音':'● 録音する';el('cpoRecord').disabled=false;el('cpoRecord').classList.remove('is-recording');el('cpoRecord').removeAttribute('aria-busy')}
  }
  function stopSound(){
    modelToken++;clearTimeout(playingTimer);
    try{if(window.KP134)window.KP134.stopFor(root)}catch(e){}
    
    if(playback){try{playback.pause()}catch(e){}}
    root.querySelectorAll('.is-playing').forEach(function(b){b.classList.remove('is-playing')});
    root.querySelectorAll('#cpoModel[aria-busy],#cpoQuizListen[aria-busy]').forEach(function(b){b.removeAttribute('aria-busy')});
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
    stopSound();var token=modelToken,index=quiz.index,fb=forQuiz?'cpoQuizFeedback':'cpoModelFeedback';
    button.classList.add('is-playing');button.setAttribute('aria-busy','true');
    if(forQuiz&&!quiz.answered){quiz.heard=false;el('cpoQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=true})}
    feedback(fb,'お手本を準備しています…');
    function clear(){button.classList.remove('is-playing');button.removeAttribute('aria-busy')}
    try{await window.KP134.play(letter,{root:root,button:button,onCancel:clear,onPlaying:function(){if(token===modelToken&&!forQuiz){feedback(fb,'聞いて・見て・まねよう。')}},onEnded:function(){if(token!==modelToken)return;clear();if(forQuiz&&quiz.active&&quiz.index===index&&!quiz.answered){quiz.heard=true;el('cpoQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=false});feedback(fb,'聞こえた音を選ぼう。')}},onError:function(){if(token===modelToken){clear();feedback(fb,'音声を読み込めませんでした。もう一度押してね。','bad')}}})}
    catch(e){if(e&&e.name==='AbortError')return;if(token===modelToken){clear();feedback(fb,'音声を再生できませんでした。もう一度押してね。','bad')}}
  }
  function renderArt(){window.KP135.park(root,'cpo');
    el('cpoArticulation').innerHTML=window.KP134.panel(selected,'cpo');window.KP135.mount(root,'cpo',selected);
    var item=guide[selected];el('cpoStaticGuide').innerHTML='<div class="cpo-static-views">'+item.labels.map(function(label,i){return '<figure><strong>'+label+'</strong>'+cpoDiagram(selected,i===0?'contact':'release','static'+i)+'<figcaption>'+item.notes[i]+'</figcaption></figure>'}).join('')+'</div>';el('cpoStaticLetter').textContent=selected;
    if(root.hidden||!root.classList.contains('is-roadmap-lesson-active')||matchMedia('(prefers-reduced-motion: reduce)').matches)root.querySelectorAll('.cpo-art-svg,.cpo-route').forEach(function(svg){svg.pauseAnimations();svg.setCurrentTime(0)})
  }
  function select(letter,listen){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    selected=letter;root.querySelectorAll('[data-cpo-letter]').forEach(function(b){var active=b.dataset.cpoLetter===letter;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
    var item=guide[letter];el('cpoFocusLetter').textContent=letter;el('cpoFocusGuide').textContent=item.hanzi+' '+item.pinyin+' · '+item.ipa;el('cpoFocusTip').textContent=item.tip;
    el('cpoModel').textContent='▶ '+letter+' のお手本を聞く';feedback('cpoModelFeedback','');feedback('cpoPracticeFeedback',recordings[letter]?'この音の録音を聞き返せます。':'');
    renderArt();redrawRecordingControls();if(listen)playModel(letter,el('cpoModel'),false);
  }
  function mimeType(){var types=['audio/mp4','audio/webm;codecs=opus','audio/webm'];for(var i=0;i<types.length;i++)try{if(MediaRecorder.isTypeSupported(types[i]))return types[i]}catch(e){}return ''}
  async function toggleRecord(){
    if(pendingRecord)return;
    if(recorder&&recorder.state==='recording'){recorder.stop();return}
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||typeof MediaRecorder==='undefined'){feedback('cpoPracticeFeedback','このブラウザでは録音を使えません。','bad');return}
    stopSound();pendingRecord=true;var token=++recordToken,letter=selected,chunks=[];
    el('cpoRecord').disabled=true;el('cpoRecord').textContent='マイクを準備中…';el('cpoRecord').setAttribute('aria-busy','true');redrawRecordingControls();
    feedback('cpoPracticeFeedback','マイクを準備しています…');
    try{
      var media=await navigator.mediaDevices.getUserMedia({audio:true});
      if(token!==recordToken){media.getTracks().forEach(function(t){t.stop()});return}
      stream=media;var mt=mimeType(),rec=new MediaRecorder(media,mt?{mimeType:mt}:undefined);recorder=rec;
      rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data)};
      rec.onstop=function(){
        clearTimeout(recordTimer);media.getTracks().forEach(function(t){t.stop()});if(stream===media)stream=null;if(recorder===rec)recorder=null;
        if(token!==recordToken)return;
        var blob=new Blob(chunks,{type:rec.mimeType||mt||'audio/mp4'});
        if(blob.size){if(recordings[letter])URL.revokeObjectURL(recordings[letter]);recordings[letter]=URL.createObjectURL(blob);feedback('cpoPracticeFeedback','録音できたよ。お手本と聞きくらべてみよう。','good')}else feedback('cpoPracticeFeedback','録音を保存できませんでした。もう一度録音してね。','bad');
        redrawRecordingControls();
      };
      rec.onerror=function(){feedback('cpoPracticeFeedback','録音を続けられませんでした。もう一度試してね。','bad');try{rec.stop()}catch(e){}media.getTracks().forEach(function(t){t.stop()})};
      pendingRecord=false;rec.start(100);el('cpoRecord').disabled=false;el('cpoRecord').removeAttribute('aria-busy');el('cpoRecord').textContent='■ 録音を止める';el('cpoRecord').classList.add('is-recording');redrawRecordingControls();
      feedback('cpoPracticeFeedback','録音中… もう一度押すと止まります。10秒で自動停止。');recordTimer=setTimeout(function(){if(rec.state==='recording')rec.stop()},10000);
    }catch(e){if(token!==recordToken)return;pendingRecord=false;if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}recorder=null;redrawRecordingControls();feedback('cpoPracticeFeedback','マイクの許可を確認して、もう一度試してね。','bad')}
  }
  async function playRecording(){
    if(!recordings[selected]||pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();var button=el('cpoPlayback');playback=new Audio(recordings[selected]);playback.playsInline=true;button.classList.add('is-playing');
    playback.onended=function(){button.classList.remove('is-playing')};playback.onerror=function(){button.classList.remove('is-playing');feedback('cpoPracticeFeedback','録音を再生できませんでした。もう一度試してね。','bad')};
    try{await playback.play()}catch(e){button.classList.remove('is-playing');feedback('cpoPracticeFeedback','もう一度「自分の声を聞く」を押してね。','bad')}
  }
  function quizOrder(){
    var source=letters.concat(letters[Math.floor(Math.random()*letters.length)]),orders=[],seen={};
    function visit(prefix,left){if(!left.length){var key=prefix.join('');if(!seen[key]){seen[key]=true;orders.push(prefix)}return}left.forEach(function(l,i){if(prefix[prefix.length-1]!==l)visit(prefix.concat(l),left.slice(0,i).concat(left.slice(i+1)))})}
    visit([],source);return orders[Math.floor(Math.random()*orders.length)];
  }
  function renderQuestion(){
    var box=el('cpoQuizChoices');box.replaceChildren();letters.forEach(function(letter){var b=document.createElement('button');b.type='button';b.textContent=letter;b.dataset.cpoAnswer=letter;b.disabled=true;b.onclick=function(){answer(letter,b)};box.appendChild(b)});
    el('cpoQuizCount').textContent=(quiz.index+1)+' / 4';feedback('cpoQuizFeedback','音を聞いてから選ぼう。');el('cpoQuizNext').hidden=true;quiz.answered=false;quiz.heard=false;
  }
  function startQuiz(){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();clearTimeout(quizTimer);clearTimeout(resultTimer);quiz={active:true,order:quizOrder(),index:0,score:0,answered:false};el('cpoToQuiz').hidden=true;el('cpoResult').hidden=true;el('cpoQuizPanel').hidden=false;root.querySelector('.cpo-practice').hidden=true;renderQuestion();
    el('cpoQuizPanel').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }
  function answer(letter,button){
    if(!quiz.active||quiz.answered||!quiz.heard)return;quiz.answered=true;var right=quiz.order[quiz.index],correct=letter===right;
    el('cpoQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=true;if(b.dataset.cpoAnswer===right)b.classList.add('is-correct')});
    if(correct){quiz.score++;feedback('cpoQuizFeedback','いい耳！ '+right+' だよ。','good')}else{button.classList.add('is-wrong');feedback('cpoQuizFeedback','今回は '+right+'。もう一度音を聞いて確かめよう。','bad')}
    if(quiz.index===3)quizTimer=setTimeout(function(){if(quiz.active&&quiz.answered&&quiz.index===3)finishQuiz()},650);else el('cpoQuizNext').hidden=false;
  }
  function nextQuestion(){if(!quiz.active||!quiz.answered||quiz.index>=3)return;quiz.index++;renderQuestion();playModel(quiz.order[quiz.index],el('cpoQuizListen'),true)}
  function showResultStage(){
    if(!celebration||typeof window.koepandaShowResultCelebration!=='function')return;
    var stage=window.koepandaShowResultCelebration(celebration);if(stage)stage.classList.add('is-cpo-result');
  }
  function finishQuiz(){
    quiz.active=false;stopSound();var passed=quiz.score>=3;el('cpoQuizPanel').hidden=true;el('cpoResult').hidden=false;el('cpoRetry').hidden=passed;el('cpoReturn').hidden=!passed;
    el('cpoResultMark').textContent=passed?'✓':'↻';el('cpoResultTitle').textContent=passed?'ミニチェック合格！':'もう一度、聞き比べよう';el('cpoResultScore').textContent='4問中 '+quiz.score+'問正解';
    var message=passed?'ao・ou・iu のつながりを聞き分けられたね。':'はじめの口形と、音のつながりを聞き比べよう。';el('cpoResultMessage').textContent=message;
    if(passed){try{localStorage.setItem('koepandaCompoundP10Complete','1')}catch(e){}el('cpoCompleteBadge').hidden=false}
    celebration={score:quiz.score,total:4,passed:passed,title:passed?'ao・ou・iu クリア！':'あと一歩！',message:message};
    if(window.koepandaAttachResultReplay){window.koepandaAttachResultReplay(el('cpoResult'),celebration);var replay=el('cpoResult').querySelector('.koepanda-result-reopen');if(replay)replay.onclick=showResultStage}
    resultTimer=setTimeout(showResultStage,90);
    el('cpoResult').scrollIntoView({block:'center',behavior:'smooth'});
  }
  function cleanup(){
    stopSound();root.querySelectorAll('.cpo-route').forEach(function(svg){try{svg.pauseAnimations()}catch(e){}});recordToken++;pendingRecord=false;clearTimeout(recordTimer);clearTimeout(quizTimer);clearTimeout(resultTimer);
    var stage=document.querySelector('#koepandaResultStage.is-cpo-result');if(stage)stage.remove();
    if(recorder&&recorder.state==='recording')try{recorder.stop()}catch(e){}
    if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}recorder=null;redrawRecordingControls();
    feedback('cpoPracticeFeedback',recordings[selected]?'この音の録音を聞き返せます。':'');feedback('cpoModelFeedback','');
    quiz.active=false;el('cpoQuizPanel').hidden=true;el('cpoToQuiz').hidden=false;root.querySelector('.cpo-practice').hidden=false
  }
  function init(){
    root=el('kidsCompoundAOOUIULesson');if(!root)return;window.KP134.attach(root,letters);
    letters.forEach(function(letter){var item=guide[letter],button=document.createElement('button');button.type='button';button.className='cpo-letter-card';button.dataset.cpoLetter=letter;button.innerHTML='<strong>'+letter+'</strong><small>'+item.ipa+'</small>';button.onclick=function(){select(letter,true)};el('cpoLetterGrid').appendChild(button);
      var free=document.createElement('button');free.type='button';free.dataset.cpoLetter=letter;free.textContent=letter;free.onclick=function(){select(letter,true)};el('cpoFreeChoice').appendChild(free)});
    el('cpoModel').onclick=function(){playModel(selected,this,false)};el('cpoRecord').onclick=toggleRecord;el('cpoPlayback').onclick=playRecording;el('cpoToQuiz').onclick=startQuiz;el('cpoRetry').onclick=startQuiz;
    el('cpoQuizListen').onclick=function(){if(quiz.active)playModel(quiz.order[quiz.index],this,true)};el('cpoQuizNext').onclick=nextQuestion;
    el('cpoReturn').onclick=function(){cleanup();var back=el('pinyinLessonBack');if(back)back.click();window.dispatchEvent(new CustomEvent('koepandaInitialProgressChanged',{detail:{P10:complete()}}))};
    root.addEventListener('click',function(e){var button=e.target.closest('button');if(!button)return;button.classList.add('is-pressed');setTimeout(function(){button.classList.remove('is-pressed')},160)});
    var wasActive=false,observer=new MutationObserver(function(){var active=!root.hidden&&root.classList.contains('is-roadmap-lesson-active')&&root.getClientRects().length>0;if(wasActive&&!active)cleanup();else if(!wasActive&&active)resetArt();wasActive=active});observer.observe(root,{attributes:true,attributeFilter:['hidden','class']});
    if(el('kidsCourse'))observer.observe(el('kidsCourse'),{attributes:true,attributeFilter:['hidden','class','style']});observer.observe(document.body,{attributes:true,attributeFilter:['class']});
    window.addEventListener('pagehide',cleanup);el('cpoCompleteBadge').hidden=!complete();select('ao',false);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

})();
