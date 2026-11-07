(function(){
  "use strict";
  var jqxRest='M126 49 C111 50 91 50 78 49 C64 48 51 48 45 47 C42 46.4 42 45.4 44 45.2 C47 45 50 43 54 40 C59 37 67 35 76 35 C86 35 92 39 98 39 C104 39 112 40 118 42 C121 43 124 44 126 45Z';
  var jqxTouch='M126 49 C111 50 91 50 78 49 C64 48 51 48 45 47 C42 46.4 42 45.4 44 45.2 C47 45 50 41 54 37 C59 33 65 32 73 31.4 C81 31 90 35 98 39 C104 39 112 40 118 42 C121 43 124 44 126 45Z';
  var jqxNarrow='M126 49 C111 50 91 50 78 49 C64 48 51 48 45 47 C42 46.4 42 45.4 44 45.2 C47 45 50 42.5 54 39.7 C59 35.7 65 34.7 73 34.1 C81 33.7 90 36.5 98 39 C104 39 112 40 118 42 C121 43 124 44 126 45Z';
  function jqxDiagram(letter,mode,instance){return mode==='live'?window.KP134.front(letter,true,'jqx-'+instance):mode==='contact'?window.KP134.front(letter,false,'jqx-'+instance):window.KP134.mechanism(letter,'jqx-'+instance)}

  var letters=['j','q','x'];
  var guide={"j": {"hanzi": "", "pinyin": "jī（1声・呼読音）", "ipa": "[tɕ]", "cue": "舌の前面で止めて細く開く", "tip": "舌先は下の前歯付近。舌の前面で止め、細く開いてこすります。", "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/ji1.wav?v=10.108.134"}, "q": {"hanzi": "", "pinyin": "qī（1声・呼読音）", "ipa": "[tɕʰ]", "cue": "前面を開き、はっきり息", "tip": "j と同じ舌の前面。開いてこするときにはっきり送気します。", "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/qi1.wav?v=10.108.134"}, "x": {"hanzi": "", "pinyin": "xī（1声・呼読音）", "ipa": "[ɕ]", "cue": "舌の前面のすき間で息", "tip": "舌先は下の前歯付近。舌の前面と硬口蓋のすき間から息を続けます。", "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/xi1.wav?v=10.108.134"}};;;
  var selected='j',root,recordings={},recorder=null,stream=null,pendingRecord=false,recordToken=0,recordTimer=0;
  var playback=null,modelToken=0,playingTimer=0,quizTimer=0,resultTimer=0,quiz={active:false,order:[],index:0,score:0,answered:false},celebration=null;
  function el(id){return document.getElementById(id)}
  function feedback(id,text,kind){var box=el(id);box.textContent=text;box.className=(id==='jqxModelFeedback'?'jqx-model-feedback':'jqx-feedback')+(kind?' is-'+kind:'')}
  function complete(){try{return localStorage.getItem('koepandaInitialP6Complete')==='1'}catch(e){return false}}
  function redrawRecordingControls(){
    var busy=pendingRecord||!!(recorder&&recorder.state==='recording');
    root.querySelectorAll('[data-jqx-letter]').forEach(function(b){b.disabled=busy});
    el('jqxModel').disabled=busy;el('jqxToQuiz').disabled=busy;
    el('jqxPlayback').disabled=busy||!recordings[selected];
    el('jqxPracticeTarget').textContent='練習する音：'+selected;
    if(!busy){el('jqxRecord').textContent=recordings[selected]?'↻ もう一度録音':'● 録音する';el('jqxRecord').disabled=false;el('jqxRecord').classList.remove('is-recording');el('jqxRecord').removeAttribute('aria-busy')}
  }
  function stopSound(){
    modelToken++;clearTimeout(playingTimer);
    try{if(window.KP134)window.KP134.stopFor(root)}catch(e){}
    
    if(playback){try{playback.pause()}catch(e){}}
    root.querySelectorAll('.is-playing').forEach(function(b){b.classList.remove('is-playing')});
    root.querySelectorAll('#jqxModel[aria-busy],#jqxQuizListen[aria-busy]').forEach(function(b){b.removeAttribute('aria-busy')});
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
    stopSound();var token=modelToken,index=quiz.index,fb=forQuiz?'jqxQuizFeedback':'jqxModelFeedback';
    button.classList.add('is-playing');button.setAttribute('aria-busy','true');
    if(forQuiz&&!quiz.answered){quiz.heard=false;el('jqxMatchAnswers').querySelectorAll('button').forEach(function(b){b.disabled=true})}
    feedback(fb,'お手本を準備しています…');
    function clear(){button.classList.remove('is-playing');button.removeAttribute('aria-busy')}
    try{await window.KP134.play(letter,{root:root,button:button,onCancel:clear,onPlaying:function(){if(token===modelToken&&!forQuiz){feedback(fb,'聞いて・見て・まねよう。')}},onEnded:function(){if(token!==modelToken)return;clear();if(forQuiz&&quiz.active&&quiz.index===index&&!quiz.answered){quiz.heard=true;el('jqxMatchAnswers').querySelectorAll('button').forEach(function(b){b.disabled=b.classList.contains('is-matched')});feedback(fb,'聞こえた音を選ぼう。')}},onError:function(){if(token===modelToken){clear();feedback(fb,'音声を読み込めませんでした。もう一度押してね。','bad')}}})}
    catch(e){if(e&&e.name==='AbortError')return;if(token===modelToken){clear();feedback(fb,'音声を再生できませんでした。もう一度押してね。','bad')}}
  }
  function renderArt(){window.KP135.park(root,'jqx');
    el('jqxArticulation').innerHTML=window.KP134.panel(selected,'jqx');window.KP135.mount(root,'jqx',selected);
    var item=guide[selected];el('jqxStaticGuide').innerHTML='<div class="jqx-static-views">'+item.labels.map(function(label,i){return '<figure><strong>'+label+'</strong>'+jqxDiagram(selected,i===0?'contact':'release','static'+i)+'<figcaption>'+item.notes[i]+'</figcaption></figure>'}).join('')+'</div>';el('jqxStaticLetter').textContent=selected;
    var svg=el('jqxArticulation').querySelector('svg');if(matchMedia('(prefers-reduced-motion: reduce)').matches){svg.pauseAnimations();svg.setCurrentTime(1.1)}
  }
  function select(letter,listen){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    selected=letter;root.querySelectorAll('[data-jqx-letter]').forEach(function(b){var active=b.dataset.jqxLetter===letter;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
    var item=guide[letter];el('jqxFocusLetter').textContent=letter;el('jqxFocusGuide').textContent=item.hanzi+' '+item.pinyin+' · '+item.ipa;el('jqxFocusTip').textContent=item.tip;
    el('jqxModel').textContent='▶ '+letter+' のお手本を聞く';feedback('jqxModelFeedback','');feedback('jqxPracticeFeedback',recordings[letter]?'この音の録音を聞き返せます。':'');
    renderArt();redrawRecordingControls();if(listen)playModel(letter,el('jqxModel'),false);
  }
  function mimeType(){var types=['audio/mp4','audio/webm;codecs=opus','audio/webm'];for(var i=0;i<types.length;i++)try{if(MediaRecorder.isTypeSupported(types[i]))return types[i]}catch(e){}return ''}
  async function toggleRecord(){
    if(pendingRecord)return;
    if(recorder&&recorder.state==='recording'){recorder.stop();return}
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||typeof MediaRecorder==='undefined'){feedback('jqxPracticeFeedback','このブラウザでは録音を使えません。','bad');return}
    stopSound();pendingRecord=true;var token=++recordToken,letter=selected,chunks=[];
    el('jqxRecord').disabled=true;el('jqxRecord').textContent='マイクを準備中…';el('jqxRecord').setAttribute('aria-busy','true');redrawRecordingControls();
    feedback('jqxPracticeFeedback','マイクを準備しています…');
    try{
      var media=await window.KP134.microphone();
      if(token!==recordToken){window.KP134.releaseMicrophone(media);return}
      stream=media;var mt=mimeType(),rec=new MediaRecorder(media,mt?{mimeType:mt}:undefined);recorder=rec;
      rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data)};
      rec.onstop=function(){
        clearTimeout(recordTimer);window.KP134.releaseMicrophone(media);if(stream===media)stream=null;if(recorder===rec)recorder=null;
        if(token!==recordToken)return;
        var blob=new Blob(chunks,{type:rec.mimeType||mt||'audio/mp4'});
        if(blob.size){if(recordings[letter])URL.revokeObjectURL(recordings[letter]);recordings[letter]=URL.createObjectURL(blob);feedback('jqxPracticeFeedback','録音を保存しました。再生ボタンで聞き返せます。','good')}else feedback('jqxPracticeFeedback','録音を保存できませんでした。もう一度録音してね。','bad');
        redrawRecordingControls();
      };
      rec.onerror=function(){feedback('jqxPracticeFeedback','録音を続けられませんでした。もう一度試してね。','bad');try{rec.stop()}catch(e){}window.KP134.releaseMicrophone(media)};
      pendingRecord=false;rec.start(100);el('jqxRecord').disabled=false;el('jqxRecord').removeAttribute('aria-busy');el('jqxRecord').textContent='■ 録音を止める';el('jqxRecord').classList.add('is-recording');redrawRecordingControls();
      feedback('jqxPracticeFeedback','録音中… もう一度押すと止まります。10秒で自動停止。');recordTimer=setTimeout(function(){if(rec.state==='recording')rec.stop()},10000);
    }catch(e){if(token!==recordToken)return;pendingRecord=false;if(stream){window.KP134.releaseMicrophone(stream);stream=null}recorder=null;redrawRecordingControls();feedback('jqxPracticeFeedback','マイクの許可を確認して、もう一度試してね。','bad')}
  }
  async function playRecording(){
    if(!recordings[selected]||pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();var button=el('jqxPlayback');function clear(){button.classList.remove('is-playing')}
    try{await window.KP134.play(selected,{root:root,clipUrl:recordings[selected],rate:1,referenceVisual:false,button:button,onPlaying:function(){button.classList.add('is-playing')},onEnded:clear,onCancel:clear,onError:function(){clear();feedback('jqxPracticeFeedback','録音を再生できませんでした。もう一度試してね。','bad')}})}catch(e){clear()}
  }

  function quizOrder(){
    var source=letters.concat(letters[Math.floor(Math.random()*letters.length)]),orders=[],seen={};
    function visit(prefix,left){if(!left.length){var key=prefix.join('');if(!seen[key]){seen[key]=true;orders.push(prefix)}return}left.forEach(function(l,i){if(prefix[prefix.length-1]!==l)visit(prefix.concat(l),left.slice(0,i).concat(left.slice(i+1)))})}
    visit([],source);return orders[Math.floor(Math.random()*orders.length)];
  }
  var kpMatchState={active:null,matched:{},first:{},firstScore:0};
  function renderQuestion(){
    var box=el('jqxQuizChoices');if(!box)return;box.replaceChildren();
    var panel=el('jqxQuizPanel');var board=panel.querySelector('.kp-match-board');
    if(!board){board=document.createElement('div');board.className='kp-match-board';board.setAttribute('aria-label','音声と発音のペア合わせ');
      var left=document.createElement('section');left.className='kp-match-column';left.innerHTML='<h3>発音を選ぶ</h3>';var right=document.createElement('section');right.className='kp-match-column';right.innerHTML='<h3>音を聞く</h3>';
      var answers=document.createElement('div');answers.className='kp-match-answer-list';answers.id='jqxMatchAnswers';var audio=document.createElement('div');audio.className='kp-match-audio-list';audio.id='jqxMatchAudio';left.appendChild(answers);right.appendChild(audio);board.append(left,right);box.parentNode.insertBefore(board,box);box.hidden=true;
    }
    var answers=el('jqxMatchAnswers'),audio=el('jqxMatchAudio');answers.replaceChildren();audio.replaceChildren();
    window.KP134.shuffle(letters.slice()).forEach(function(letter){var b=document.createElement('button');b.type='button';b.className='kp-match-answer';b.textContent=letter;b.dataset.answer=letter;b.disabled=true;b.setAttribute('aria-label','発音 '+letter);b.addEventListener('click',function(){answer(letter,b)});answers.appendChild(b)});
    quiz.order.forEach(function(letter,i){var b=document.createElement('button');b.type='button';b.className='kp-match-audio';b.dataset.letter=letter;b.innerHTML='<span class="kp-match-speaker" aria-hidden="true">🔊</span>';b.setAttribute('aria-label','音声 '+(i+1)+' を聞く');b.addEventListener('click',function(){if(kpMatchState.matched[i])return;kpMatchState.active=i;quiz.index=i;quiz.answered=false;audio.querySelectorAll('button').forEach(function(x){x.classList.toggle('is-active',x===b);x.classList.remove('is-try-again')});el('jqxMatchAnswers').querySelectorAll('button').forEach(function(x){x.disabled=true});playModel(letter,b,true)});audio.appendChild(b)});
    var oldListen=el('jqxQuizListen');if(oldListen)oldListen.hidden=true;var count=el('jqxQuizCount');if(count)count.textContent='0 / '+quiz.order.length+' ペア · 初回 0 正解';var next=el('jqxQuizNext');if(next)next.hidden=true;feedback('jqxQuizFeedback','右の音声カードを押して、左から同じ音を選ぼう。');
  }
  
  function startQuiz(){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();clearTimeout(quizTimer);clearTimeout(resultTimer);quiz={active:true,order:window.KP134.shuffle(letters.slice()),index:0,score:0,answered:false,heard:false};kpMatchState={active:null,matched:{},first:{},firstScore:0};el('jqxToQuiz').hidden=true;el('jqxResult').hidden=true;el('jqxQuizPanel').hidden=false;root.querySelector('.jqx-practice').hidden=true;renderQuestion();
    el('jqxQuizPanel').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }
  function answer(letter,button){
    var i=kpMatchState.active;if(i===null||!quiz.heard||kpMatchState.matched[i])return;var correct=quiz.order[i]===letter,answers=el('jqxMatchAnswers'),audio=el('jqxMatchAudio'),card=audio.children[i];quiz.heard=false;answers.querySelectorAll('button').forEach(function(b){b.disabled=true});
    if(!Object.prototype.hasOwnProperty.call(kpMatchState.first,i))kpMatchState.first[i]=correct;
    if(correct){kpMatchState.matched[i]=true;if(kpMatchState.first[i])kpMatchState.firstScore++;button.classList.add('is-matched');button.disabled=true;card.classList.remove('is-active','is-playing');card.classList.add('is-matched');card.disabled=true;var done=Object.keys(kpMatchState.matched).length;var count=el('jqxQuizCount');if(count)count.textContent=done+' / '+quiz.order.length+' ペア · 初回 '+kpMatchState.firstScore+' 正解';feedback('jqxQuizFeedback','ぴったり！ペアがつながったよ ✨','good');kpMatchState.active=null;if(done===quiz.order.length){quiz.score=kpMatchState.firstScore;quiz.active=true;setTimeout(finishQuiz,520)}else answers.querySelectorAll('button').forEach(function(b){b.disabled=b.classList.contains('is-matched')})}
    else{button.classList.add('is-wrong');setTimeout(function(){button.classList.remove('is-wrong')},460);card.classList.add('is-try-again');feedback('jqxQuizFeedback','おしい！同じ音声カードをもう一度聞いてみよう 👂','bad')}
  }
  function nextQuestion(){if(!quiz.active||!quiz.answered||quiz.index>=3)return;quiz.index++;renderQuestion();playModel(quiz.order[quiz.index],el('jqxQuizListen'),true)}
  function showResultStage(){
    if(!celebration||typeof window.koepandaShowResultCelebration!=='function')return;
    var stage=window.koepandaShowResultCelebration(celebration);if(stage)stage.classList.add('is-jqx-result');
  }
  function finishQuiz(){
    quiz.active=false;stopSound();var passed=quiz.score>=Math.ceil(quiz.order.length*0.75);el('jqxQuizPanel').hidden=true;el('jqxResult').hidden=false;el('jqxRetry').hidden=passed;el('jqxReturn').hidden=!passed;
    el('jqxResultMark').textContent=passed?'✓':'↻';el('jqxResultTitle').textContent=passed?'ミニチェック合格！':'もう一度、聞き比べよう';el('jqxResultScore').textContent=(''+quiz.order.length+'問中 '+quiz.score+'問正解');
    var message=passed?'舌の前面と、j・q・x の息の違いがつかめたよ。':'j と q の息の強さ、x の続く息を聞いてみよう。';el('jqxResultMessage').textContent=message;
    if(passed){try{localStorage.setItem('koepandaInitialP6Complete','1')}catch(e){}el('jqxCompleteBadge').hidden=false}
    celebration={score:quiz.score,total:quiz.order.length,passed:passed,title:passed?'j・q・x クリア！':'あと一歩！',message:message};
    if(window.koepandaAttachResultReplay){window.koepandaAttachResultReplay(el('jqxResult'),celebration);var replay=el('jqxResult').querySelector('.koepanda-result-reopen');if(replay)replay.onclick=showResultStage}
    resultTimer=setTimeout(showResultStage,90);
    el('jqxResult').scrollIntoView({block:'center',behavior:'smooth'});
  }
  function cleanup(){
    stopSound();recordToken++;pendingRecord=false;clearTimeout(recordTimer);clearTimeout(quizTimer);clearTimeout(resultTimer);
    var stage=document.querySelector('#koepandaResultStage.is-jqx-result');if(stage)stage.remove();
    if(recorder&&recorder.state==='recording')try{recorder.stop()}catch(e){}
    if(stream){window.KP134.releaseMicrophone(stream);stream=null}recorder=null;redrawRecordingControls();
    feedback('jqxPracticeFeedback',recordings[selected]?'この音の録音を聞き返せます。':'');feedback('jqxModelFeedback','');
    if(quiz.active){quiz.active=false;el('jqxQuizPanel').hidden=true;el('jqxToQuiz').hidden=false;root.querySelector('.jqx-practice').hidden=false}
  }
  function init(){
    root=el('kidsInitialsJQXLesson');if(!root)return;window.KP134.attach(root,letters);
    letters.forEach(function(letter){var item=guide[letter],button=document.createElement('button');button.type='button';button.className='jqx-letter-card';button.dataset.jqxLetter=letter;button.innerHTML='<strong>'+letter+'</strong><small>'+item.ipa+'</small><span class="initial-reading">'+window.KP134.data[letter].roman+'（1声・呼読音）</span><span class="initial-tip">'+item.tip+'</span>';button.onclick=function(){select(letter,true)};el('jqxLetterGrid').appendChild(button);
      var free=document.createElement('button');free.type='button';free.dataset.jqxLetter=letter;free.textContent=letter;free.onclick=function(){select(letter,true)};el('jqxFreeChoice').appendChild(free)});
    el('jqxModel').onclick=function(){playModel(selected,this,false)};el('jqxRecord').onclick=toggleRecord;el('jqxPlayback').onclick=playRecording;el('jqxToQuiz').onclick=startQuiz;el('jqxRetry').onclick=startQuiz;
    el('jqxQuizListen').onclick=function(){if(quiz.active)playModel(quiz.order[quiz.index],this,true)};el('jqxQuizNext').onclick=nextQuestion;
    el('jqxReturn').onclick=function(){cleanup();var back=el('pinyinLessonBack');if(back)back.click();window.dispatchEvent(new CustomEvent('koepandaInitialProgressChanged',{detail:{P6:complete()}}))};
    root.addEventListener('click',function(e){var button=e.target.closest('button');if(!button)return;button.classList.add('is-pressed');setTimeout(function(){button.classList.remove('is-pressed')},160)});
    var wasActive=false,observer=new MutationObserver(function(){var active=!root.hidden&&root.classList.contains('is-roadmap-lesson-active')&&root.getClientRects().length>0;if(wasActive&&!active)cleanup();wasActive=active});observer.observe(root,{attributes:true,attributeFilter:['hidden','class']});
    if(el('kidsCourse'))observer.observe(el('kidsCourse'),{attributes:true,attributeFilter:['hidden','class','style']});observer.observe(document.body,{attributes:true,attributeFilter:['class']});
    window.addEventListener('pagehide',cleanup);el('jqxCompleteBadge').hidden=!complete();select('j',false);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

})();
