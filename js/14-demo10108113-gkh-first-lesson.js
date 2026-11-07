(function(){
  "use strict";
  var gkhRest='M126 49 C111 49 91 49 78 48 C64 47 51 46 45 43 C42 40 44 38 50 39 C58 39 66 43 76 43 C87 43 92 42 96 42 C100 42 104 40.5 108 40.5 C113 40.5 116 41 118 41.5 C121 42 124 42.6 126 43.8Z';
  var gkhTouch='M126 49 C111 49 91 49 78 48 C64 47 51 46 45 43 C42 40 44 38 50 39 C58 39 66 43 76 43 C87 43 92 36.8 96 34.8 C100 33 104 32.7 108 33 C113 33.4 116 35.8 118 38 C121 41 124 42.6 126 43.8Z';
  var gkhNarrow='M126 49 C111 49 91 49 78 48 C64 47 51 46 45 43 C42 40 44 38 50 39 C58 39 66 43 76 43 C87 43 92 39.4 96 38 C100 36.8 104 36.6 108 36.8 C113 37 116 38.8 118 40 C121 41.4 124 42.6 126 43.8Z';
  function gkhDiagram(letter,mode,instance){return mode==='live'?window.KP134.front(letter,true,'gkh-'+instance):mode==='contact'?window.KP134.front(letter,false,'gkh-'+instance):window.KP134.mechanism(letter,'gkh-'+instance)}

  var letters=['g','k','h'];
  var guide={"g": {"hanzi": "", "pinyin": "gē（1声・呼読音）", "poses": [], "tip": "舌の後ろ側を軟口蓋へつけ、短く離します。", "ipa": "[k]", "cue": "舌の後ろで止めて離す", "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/ge1.wav?v=10.108.134"}, "k": {"hanzi": "", "pinyin": "kē（1声・呼読音）", "poses": [], "tip": "g と同じ奥の位置から離し、はっきり送気します。", "ipa": "[kʰ]", "cue": "奥で離し、はっきり息", "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/ke1.wav?v=10.108.134"}, "h": {"hanzi": "", "pinyin": "hē（1声・呼読音）", "poses": [], "tip": "舌の後ろ側と上あごの奥のすき間で、息をこすります。", "ipa": "[x]", "cue": "奥のすき間で息をこする", "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/he1.wav?v=10.108.134"}};;;
  var selected='g',root,recordings={},recorder=null,stream=null,pendingRecord=false,recordToken=0,recordTimer=0;
  var playback=null,modelToken=0,playingTimer=0,quizTimer=0,resultTimer=0,quiz={active:false,order:[],index:0,score:0,answered:false},celebration=null;
  function el(id){return document.getElementById(id)}
  function feedback(id,text,kind){var box=el(id);box.textContent=text;box.className=(id==='gkhModelFeedback'?'gkh-model-feedback':'gkh-feedback')+(kind?' is-'+kind:'')}
  function complete(){try{return localStorage.getItem('koepandaInitialP5Complete')==='1'}catch(e){return false}}
  function redrawRecordingControls(){
    var busy=pendingRecord||!!(recorder&&recorder.state==='recording');
    root.querySelectorAll('[data-gkh-letter]').forEach(function(b){b.disabled=busy});
    el('gkhModel').disabled=busy;el('gkhToQuiz').disabled=busy;
    el('gkhPlayback').disabled=busy||!recordings[selected];
    el('gkhPracticeTarget').textContent='練習する音：'+selected;
    if(!busy){el('gkhRecord').textContent=recordings[selected]?'↻ もう一度録音':'● 録音する';el('gkhRecord').disabled=false;el('gkhRecord').classList.remove('is-recording');el('gkhRecord').removeAttribute('aria-busy')}
  }
  function stopSound(){
    modelToken++;clearTimeout(playingTimer);
    try{if(window.KP134)window.KP134.stopFor(root)}catch(e){}
    
    if(playback){try{playback.pause()}catch(e){}}
    root.querySelectorAll('.is-playing').forEach(function(b){b.classList.remove('is-playing')});
    root.querySelectorAll('#gkhModel[aria-busy],#gkhQuizListen[aria-busy]').forEach(function(b){b.removeAttribute('aria-busy')});
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
    stopSound();var token=modelToken,index=quiz.index,fb=forQuiz?'gkhQuizFeedback':'gkhModelFeedback';
    button.classList.add('is-playing');button.setAttribute('aria-busy','true');
    if(forQuiz&&!quiz.answered){quiz.heard=false;el('gkhMatchAnswers').querySelectorAll('button').forEach(function(b){b.disabled=true})}
    feedback(fb,'お手本を準備しています…');
    function clear(){button.classList.remove('is-playing');button.removeAttribute('aria-busy')}
    try{await window.KP134.play(letter,{root:root,button:button,onCancel:clear,onPlaying:function(){if(token===modelToken&&!forQuiz){feedback(fb,'聞いて・見て・まねよう。')}},onEnded:function(){if(token!==modelToken)return;clear();if(forQuiz&&quiz.active&&quiz.index===index&&!quiz.answered){quiz.heard=true;el('gkhMatchAnswers').querySelectorAll('button').forEach(function(b){b.disabled=b.classList.contains('is-matched')});feedback(fb,'聞こえた音を選ぼう。')}},onError:function(){if(token===modelToken){clear();feedback(fb,'音声を読み込めませんでした。もう一度押してね。','bad')}}})}
    catch(e){if(e&&e.name==='AbortError')return;if(token===modelToken){clear();feedback(fb,'音声を再生できませんでした。もう一度押してね。','bad')}}
  }
  function renderArt(){window.KP135.park(root,'gkh');
    el('gkhArticulation').innerHTML=window.KP134.panel(selected,'gkh');window.KP135.mount(root,'gkh',selected);
    var item=guide[selected];el('gkhStaticGuide').innerHTML='<div class="gkh-static-views">'+item.labels.map(function(label,i){return '<figure><strong>'+label+'</strong>'+gkhDiagram(selected,i===0?'contact':'release','static'+i)+'<figcaption>'+item.notes[i]+'</figcaption></figure>'}).join('')+'</div>';el('gkhStaticLetter').textContent=selected;
    var svg=el('gkhArticulation').querySelector('svg');if(matchMedia('(prefers-reduced-motion: reduce)').matches){svg.pauseAnimations();svg.setCurrentTime(1.1)}
  }
  function select(letter,listen){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    selected=letter;root.querySelectorAll('[data-gkh-letter]').forEach(function(b){var active=b.dataset.gkhLetter===letter;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
    var item=guide[letter];el('gkhFocusLetter').textContent=letter;el('gkhFocusGuide').textContent=item.hanzi+' '+item.pinyin+' · '+item.ipa;el('gkhFocusTip').textContent=item.tip;
    el('gkhModel').textContent='▶ '+letter+' のお手本を聞く';feedback('gkhModelFeedback','');feedback('gkhPracticeFeedback',recordings[letter]?'この音の録音を聞き返せます。':'');
    renderArt();redrawRecordingControls();if(listen)playModel(letter,el('gkhModel'),false);
  }
  function mimeType(){var types=['audio/mp4','audio/webm;codecs=opus','audio/webm'];for(var i=0;i<types.length;i++)try{if(MediaRecorder.isTypeSupported(types[i]))return types[i]}catch(e){}return ''}
  async function toggleRecord(){
    if(pendingRecord)return;
    if(recorder&&recorder.state==='recording'){recorder.stop();return}
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||typeof MediaRecorder==='undefined'){feedback('gkhPracticeFeedback','このブラウザでは録音を使えません。','bad');return}
    stopSound();pendingRecord=true;var token=++recordToken,letter=selected,chunks=[];
    el('gkhRecord').disabled=true;el('gkhRecord').textContent='マイクを準備中…';el('gkhRecord').setAttribute('aria-busy','true');redrawRecordingControls();
    feedback('gkhPracticeFeedback','マイクを準備しています…');
    try{
      var media=await window.KP134.microphone();
      if(token!==recordToken){window.KP134.releaseMicrophone(media);return}
      stream=media;var mt=mimeType(),rec=new MediaRecorder(media,mt?{mimeType:mt}:undefined);recorder=rec;
      rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data)};
      rec.onstop=function(){
        clearTimeout(recordTimer);window.KP134.releaseMicrophone(media);if(stream===media)stream=null;if(recorder===rec)recorder=null;
        if(token!==recordToken)return;
        var blob=new Blob(chunks,{type:rec.mimeType||mt||'audio/mp4'});
        if(blob.size){if(recordings[letter])URL.revokeObjectURL(recordings[letter]);recordings[letter]=URL.createObjectURL(blob);feedback('gkhPracticeFeedback','録音を保存しました。再生ボタンで聞き返せます。','good')}else feedback('gkhPracticeFeedback','録音を保存できませんでした。もう一度録音してね。','bad');
        redrawRecordingControls();
      };
      rec.onerror=function(){feedback('gkhPracticeFeedback','録音を続けられませんでした。もう一度試してね。','bad');try{rec.stop()}catch(e){}window.KP134.releaseMicrophone(media)};
      pendingRecord=false;rec.start(100);el('gkhRecord').disabled=false;el('gkhRecord').removeAttribute('aria-busy');el('gkhRecord').textContent='■ 録音を止める';el('gkhRecord').classList.add('is-recording');redrawRecordingControls();
      feedback('gkhPracticeFeedback','録音中… もう一度押すと止まります。10秒で自動停止。');recordTimer=setTimeout(function(){if(rec.state==='recording')rec.stop()},10000);
    }catch(e){if(token!==recordToken)return;pendingRecord=false;if(stream){window.KP134.releaseMicrophone(stream);stream=null}recorder=null;redrawRecordingControls();feedback('gkhPracticeFeedback','マイクの許可を確認して、もう一度試してね。','bad')}
  }
  async function playRecording(){
    if(!recordings[selected]||pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();var button=el('gkhPlayback');function clear(){button.classList.remove('is-playing')}
    try{await window.KP134.play(selected,{root:root,clipUrl:recordings[selected],rate:1,referenceVisual:false,button:button,onPlaying:function(){button.classList.add('is-playing')},onEnded:clear,onCancel:clear,onError:function(){clear();feedback('gkhPracticeFeedback','録音を再生できませんでした。もう一度試してね。','bad')}})}catch(e){clear()}
  }

  function quizOrder(){
    var source=letters.concat(letters[Math.floor(Math.random()*letters.length)]),orders=[],seen={};
    function visit(prefix,left){if(!left.length){var key=prefix.join('');if(!seen[key]){seen[key]=true;orders.push(prefix)}return}left.forEach(function(l,i){if(prefix[prefix.length-1]!==l)visit(prefix.concat(l),left.slice(0,i).concat(left.slice(i+1)))})}
    visit([],source);return orders[Math.floor(Math.random()*orders.length)];
  }
  var kpMatchState={active:null,matched:{},first:{},firstScore:0};
  function renderQuestion(){
    var box=el('gkhQuizChoices');if(!box)return;box.replaceChildren();
    var panel=el('gkhQuizPanel');var board=panel.querySelector('.kp-match-board');
    if(!board){board=document.createElement('div');board.className='kp-match-board';board.setAttribute('aria-label','音声と発音のペア合わせ');
      var left=document.createElement('section');left.className='kp-match-column';left.innerHTML='<h3>発音を選ぶ</h3>';var right=document.createElement('section');right.className='kp-match-column';right.innerHTML='<h3>音を聞く</h3>';
      var answers=document.createElement('div');answers.className='kp-match-answer-list';answers.id='gkhMatchAnswers';var audio=document.createElement('div');audio.className='kp-match-audio-list';audio.id='gkhMatchAudio';left.appendChild(answers);right.appendChild(audio);board.append(left,right);box.parentNode.insertBefore(board,box);box.hidden=true;
    }
    var answers=el('gkhMatchAnswers'),audio=el('gkhMatchAudio');answers.replaceChildren();audio.replaceChildren();
    window.KP134.shuffle(letters.slice()).forEach(function(letter){var b=document.createElement('button');b.type='button';b.className='kp-match-answer';b.textContent=letter;b.dataset.answer=letter;b.disabled=true;b.setAttribute('aria-label','発音 '+letter);b.addEventListener('click',function(){answer(letter,b)});answers.appendChild(b)});
    quiz.order.forEach(function(letter,i){var b=document.createElement('button');b.type='button';b.className='kp-match-audio';b.dataset.letter=letter;b.innerHTML='<span class="kp-match-speaker" aria-hidden="true">🔊</span>';b.setAttribute('aria-label','音声 '+(i+1)+' を聞く');b.addEventListener('click',function(){if(kpMatchState.matched[i])return;kpMatchState.active=i;quiz.index=i;quiz.answered=false;audio.querySelectorAll('button').forEach(function(x){x.classList.toggle('is-active',x===b);x.classList.remove('is-try-again')});el('gkhMatchAnswers').querySelectorAll('button').forEach(function(x){x.disabled=true});playModel(letter,b,true)});audio.appendChild(b)});
    var oldListen=el('gkhQuizListen');if(oldListen)oldListen.hidden=true;var count=el('gkhQuizCount');if(count)count.textContent='0 / '+quiz.order.length+' ペア · 初回 0 正解';var next=el('gkhQuizNext');if(next)next.hidden=true;feedback('gkhQuizFeedback','右の音声カードを押して、左から同じ音を選ぼう。');
  }
  
  function startQuiz(){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();clearTimeout(quizTimer);clearTimeout(resultTimer);quiz={active:true,order:window.KP134.shuffle(letters.slice()),index:0,score:0,answered:false,heard:false};kpMatchState={active:null,matched:{},first:{},firstScore:0};el('gkhToQuiz').hidden=true;el('gkhResult').hidden=true;el('gkhQuizPanel').hidden=false;root.querySelector('.gkh-practice').hidden=true;renderQuestion();
    el('gkhQuizPanel').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }
  function answer(letter,button){
    var i=kpMatchState.active;if(i===null||!quiz.heard||kpMatchState.matched[i])return;var correct=quiz.order[i]===letter,answers=el('gkhMatchAnswers'),audio=el('gkhMatchAudio'),card=audio.children[i];quiz.heard=false;answers.querySelectorAll('button').forEach(function(b){b.disabled=true});
    if(!Object.prototype.hasOwnProperty.call(kpMatchState.first,i))kpMatchState.first[i]=correct;
    if(correct){kpMatchState.matched[i]=true;if(kpMatchState.first[i])kpMatchState.firstScore++;button.classList.add('is-matched');button.disabled=true;card.classList.remove('is-active','is-playing');card.classList.add('is-matched');card.disabled=true;var done=Object.keys(kpMatchState.matched).length;var count=el('gkhQuizCount');if(count)count.textContent=done+' / '+quiz.order.length+' ペア · 初回 '+kpMatchState.firstScore+' 正解';feedback('gkhQuizFeedback','ぴったり！ペアがつながったよ ✨','good');kpMatchState.active=null;if(done===quiz.order.length){quiz.score=kpMatchState.firstScore;quiz.active=true;setTimeout(finishQuiz,520)}else answers.querySelectorAll('button').forEach(function(b){b.disabled=b.classList.contains('is-matched')})}
    else{button.classList.add('is-wrong');setTimeout(function(){button.classList.remove('is-wrong')},460);card.classList.add('is-try-again');feedback('gkhQuizFeedback','おしい！同じ音声カードをもう一度聞いてみよう 👂','bad')}
  }
  function nextQuestion(){if(!quiz.active||!quiz.answered||quiz.index>=3)return;quiz.index++;renderQuestion();playModel(quiz.order[quiz.index],el('gkhQuizListen'),true)}
  function showResultStage(){
    if(!celebration||typeof window.koepandaShowResultCelebration!=='function')return;
    var stage=window.koepandaShowResultCelebration(celebration);if(stage)stage.classList.add('is-gkh-result');
  }
  function finishQuiz(){
    quiz.active=false;stopSound();var passed=quiz.score>=Math.ceil(quiz.order.length*0.75);el('gkhQuizPanel').hidden=true;el('gkhResult').hidden=false;el('gkhRetry').hidden=passed;el('gkhReturn').hidden=!passed;
    el('gkhResultMark').textContent=passed?'✓':'↻';el('gkhResultTitle').textContent=passed?'ミニチェック合格！':'もう一度、聞き比べよう';el('gkhResultScore').textContent=(''+quiz.order.length+'問中 '+quiz.score+'問正解');
    var message=passed?'舌の奥と、g・k・h の息の違いがつかめたよ。':'g と k の息の強さ、h の続く息を聞いてみよう。';el('gkhResultMessage').textContent=message;
    if(passed){try{localStorage.setItem('koepandaInitialP5Complete','1')}catch(e){}el('gkhCompleteBadge').hidden=false}
    celebration={score:quiz.score,total:quiz.order.length,passed:passed,title:passed?'g・k・h クリア！':'あと一歩！',message:message};
    if(window.koepandaAttachResultReplay){window.koepandaAttachResultReplay(el('gkhResult'),celebration);var replay=el('gkhResult').querySelector('.koepanda-result-reopen');if(replay)replay.onclick=showResultStage}
    resultTimer=setTimeout(showResultStage,90);
    el('gkhResult').scrollIntoView({block:'center',behavior:'smooth'});
  }
  function cleanup(){
    stopSound();recordToken++;pendingRecord=false;clearTimeout(recordTimer);clearTimeout(quizTimer);clearTimeout(resultTimer);
    var stage=document.querySelector('#koepandaResultStage.is-gkh-result');if(stage)stage.remove();
    if(recorder&&recorder.state==='recording')try{recorder.stop()}catch(e){}
    if(stream){window.KP134.releaseMicrophone(stream);stream=null}recorder=null;redrawRecordingControls();
    feedback('gkhPracticeFeedback',recordings[selected]?'この音の録音を聞き返せます。':'');feedback('gkhModelFeedback','');
    if(quiz.active){quiz.active=false;el('gkhQuizPanel').hidden=true;el('gkhToQuiz').hidden=false;root.querySelector('.gkh-practice').hidden=false}
  }
  function init(){
    root=el('kidsInitialsGKHLesson');if(!root)return;window.KP134.attach(root,letters);
    letters.forEach(function(letter){var item=guide[letter],button=document.createElement('button');button.type='button';button.className='gkh-letter-card';button.dataset.gkhLetter=letter;button.innerHTML='<strong>'+letter+'</strong><small>'+item.ipa+'</small>';button.onclick=function(){select(letter,true)};el('gkhLetterGrid').appendChild(button);
      var free=document.createElement('button');free.type='button';free.dataset.gkhLetter=letter;free.textContent=letter;free.onclick=function(){select(letter,true)};el('gkhFreeChoice').appendChild(free)});
    el('gkhModel').onclick=function(){playModel(selected,this,false)};el('gkhRecord').onclick=toggleRecord;el('gkhPlayback').onclick=playRecording;el('gkhToQuiz').onclick=startQuiz;el('gkhRetry').onclick=startQuiz;
    el('gkhQuizListen').onclick=function(){if(quiz.active)playModel(quiz.order[quiz.index],this,true)};el('gkhQuizNext').onclick=nextQuestion;
    el('gkhReturn').onclick=function(){cleanup();var back=el('pinyinLessonBack');if(back)back.click();window.dispatchEvent(new CustomEvent('koepandaInitialProgressChanged',{detail:{P5:complete()}}))};
    root.addEventListener('click',function(e){var button=e.target.closest('button');if(!button)return;button.classList.add('is-pressed');setTimeout(function(){button.classList.remove('is-pressed')},160)});
    var wasActive=false,observer=new MutationObserver(function(){var active=!root.hidden&&root.classList.contains('is-roadmap-lesson-active')&&root.getClientRects().length>0;if(wasActive&&!active)cleanup();wasActive=active});observer.observe(root,{attributes:true,attributeFilter:['hidden','class']});
    if(el('kidsCourse'))observer.observe(el('kidsCourse'),{attributes:true,attributeFilter:['hidden','class','style']});observer.observe(document.body,{attributes:true,attributeFilter:['class']});
    window.addEventListener('pagehide',cleanup);el('gkhCompleteBadge').hidden=!complete();select('g',false);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

})();
