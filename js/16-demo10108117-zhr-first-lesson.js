(function(){
  "use strict";
  var zhrRest='M126 49 C111 50 91 50 78 49 C64 48 51 48 45 47 C42 46 41 44 43 41 C44 43.3 48 40.6 53 39.8 C55 39 57 39.2 58 40 C59 41 56.7 43 54.5 44 C53 44.8 55 45.8 60 41.5 C75 43 91 41 98 40 C104 39 112 40 118 42 C121 43 124 44 126 45Z';
  var zhrTouch='M126 49 C111 50 91 50 78 49 C64 48 51 48 45 47 C42 46 41 44 43 41 C44 38.5 48 35.8 53 35 C55 34.2 57 34.4 58 35.2 C59 36.2 56.7 38.2 54.5 39.2 C53 40 55 41 60 41.5 C75 43 91 41 98 40 C104 39 112 40 118 42 C121 43 124 44 126 45Z';
  var zhrNarrow='M126 49 C111 50 91 50 78 49 C64 48 51 48 45 47 C42 46 41 44 43 41 C44 41.2 48 38.5 53 37.7 C55 36.9 57 37.1 58 37.9 C59 38.9 56.7 40.9 54.5 41.9 C53 42.7 55 43.7 60 41.5 C75 43 91 41 98 40 C104 39 112 40 118 42 C121 43 124 44 126 45Z';
  var zhrVoiced='M126 49 C111 50 91 50 78 49 C64 48 51 48 45 47 C42 46 41 44 43 41 C44 42.1 48 39.4 53 38.6 C55 37.8 57 38 58 38.8 C59 39.8 56.7 41.8 54.5 42.8 C53 43.6 55 44.6 60 41.5 C75 43 91 41 98 40 C104 39 112 40 118 42 C121 43 124 44 126 45Z';
  function zhrDiagram(letter,mode,instance){return mode==='live'?window.KP134.front(letter,true,'zhr-'+instance):mode==='contact'?window.KP134.front(letter,false,'zhr-'+instance):window.KP134.mechanism(letter,'zhr-'+instance)}

  var letters=['zh','ch','sh','r'];
  var guide={"zh": {"hanzi": "", "pinyin": "zhī（1声・呼読音）", "ipa": "[tʂ]", "cue": "少し後ろで止め、細く開く", "tip": "舌先・舌の前部を、歯ぐきより少し後ろへ。止めてから細く開きます。", "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/zhi1.wav?v=10.108.134"}, "ch": {"hanzi": "", "pinyin": "chī（1声・呼読音）", "ipa": "[tʂʰ]", "cue": "少し後ろから、はっきり息", "tip": "zh と同じ構えで止め、細く開くときにはっきり送気します。", "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/chi1.wav?v=10.108.134"}, "sh": {"hanzi": "", "pinyin": "shī（1声・呼読音）", "ipa": "[ʂ]", "cue": "少し反らせ、すき間で息", "tip": "舌の前部を少し上・後ろへ向け、すき間から息を続けます。", "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/shi1.wav?v=10.108.134"}, "r": {"hanzi": "", "pinyin": "rī（1声・呼読音）", "ipa": "[ɻ~ʐ]", "cue": "同じ構えで、声を響かせる", "tip": "舌の前部を少し上・後ろへ向け、声を通します。摩擦の強さには話者差があります。", "labels": ["口形の目安", "舌・息の基本図"], "notes": ["口形には個人差があります", "調音部位の基本図。舌の実測動画ではありません。"], "audio": "./assets/audio/course-134/ri1.wav?v=10.108.134"}};;;
  var selected='zh',root,recordings={},recorder=null,stream=null,pendingRecord=false,recordToken=0,recordTimer=0;
  var playback=null,modelToken=0,playingTimer=0,quizTimer=0,resultTimer=0,quiz={active:false,order:[],index:0,score:0,answered:false},celebration=null;
  function el(id){return document.getElementById(id)}
  function feedback(id,text,kind){var box=el(id);box.textContent=text;box.className=(id==='zhrModelFeedback'?'zhr-model-feedback':'zhr-feedback')+(kind?' is-'+kind:'')}
  function complete(){try{return localStorage.getItem('koepandaInitialP7Complete')==='1'}catch(e){return false}}
  function redrawRecordingControls(){
    var busy=pendingRecord||!!(recorder&&recorder.state==='recording');
    root.querySelectorAll('[data-zhr-letter]').forEach(function(b){b.disabled=busy});
    el('zhrModel').disabled=busy;el('zhrToQuiz').disabled=busy;
    el('zhrPlayback').disabled=busy||!recordings[selected];
    el('zhrPracticeTarget').textContent='練習する音：'+selected;
    if(!busy){el('zhrRecord').textContent=recordings[selected]?'↻ もう一度録音':'● 録音する';el('zhrRecord').disabled=false;el('zhrRecord').classList.remove('is-recording');el('zhrRecord').removeAttribute('aria-busy')}
  }
  function stopSound(){
    modelToken++;clearTimeout(playingTimer);
    try{if(window.KP134)window.KP134.stopFor(root)}catch(e){}
    
    if(playback){try{playback.pause()}catch(e){}}
    root.querySelectorAll('.is-playing').forEach(function(b){b.classList.remove('is-playing')});
    root.querySelectorAll('#zhrModel[aria-busy],#zhrQuizListen[aria-busy]').forEach(function(b){b.removeAttribute('aria-busy')});
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
    stopSound();var token=modelToken,index=quiz.index,fb=forQuiz?'zhrQuizFeedback':'zhrModelFeedback';
    button.classList.add('is-playing');button.setAttribute('aria-busy','true');
    if(forQuiz&&!quiz.answered){quiz.heard=false;el('zhrMatchAnswers').querySelectorAll('button').forEach(function(b){b.disabled=true})}
    feedback(fb,'お手本を準備しています…');
    function clear(){button.classList.remove('is-playing');button.removeAttribute('aria-busy')}
    try{await window.KP134.play(letter,{root:root,button:button,onCancel:clear,onPlaying:function(){if(token===modelToken&&!forQuiz){feedback(fb,'聞いて・見て・まねよう。')}},onEnded:function(){if(token!==modelToken)return;clear();if(forQuiz&&quiz.active&&quiz.index===index&&!quiz.answered){quiz.heard=true;el('zhrMatchAnswers').querySelectorAll('button').forEach(function(b){b.disabled=b.classList.contains('is-matched')});feedback(fb,'聞こえた音を選ぼう。')}},onError:function(){if(token===modelToken){clear();feedback(fb,'音声を読み込めませんでした。もう一度押してね。','bad')}}})}
    catch(e){if(e&&e.name==='AbortError')return;if(token===modelToken){clear();feedback(fb,'音声を再生できませんでした。もう一度押してね。','bad')}}
  }
  function renderArt(){window.KP135.park(root,'zhr');
    el('zhrArticulation').innerHTML=window.KP134.panel(selected,'zhr');window.KP135.mount(root,'zhr',selected);
    var item=guide[selected];el('zhrStaticGuide').innerHTML='<div class="zhr-static-views">'+item.labels.map(function(label,i){return '<figure><strong>'+label+'</strong>'+zhrDiagram(selected,i===0?'contact':'release','static'+i)+'<figcaption>'+item.notes[i]+'</figcaption></figure>'}).join('')+'</div>';el('zhrStaticLetter').textContent=selected;
    var svg=el('zhrArticulation').querySelector('svg');if(matchMedia('(prefers-reduced-motion: reduce)').matches){svg.pauseAnimations();svg.setCurrentTime(1.1)}
  }
  function select(letter,listen){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    selected=letter;root.querySelectorAll('[data-zhr-letter]').forEach(function(b){var active=b.dataset.zhrLetter===letter;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
    var item=guide[letter];el('zhrFocusLetter').textContent=letter;el('zhrFocusGuide').textContent=item.hanzi+' '+item.pinyin+' · '+item.ipa;el('zhrFocusTip').textContent=item.tip;
    el('zhrModel').textContent='▶ '+letter+' のお手本を聞く';feedback('zhrModelFeedback','');feedback('zhrPracticeFeedback',recordings[letter]?'この音の録音を聞き返せます。':'');
    renderArt();redrawRecordingControls();if(listen)playModel(letter,el('zhrModel'),false);
  }
  function mimeType(){var types=['audio/mp4','audio/webm;codecs=opus','audio/webm'];for(var i=0;i<types.length;i++)try{if(MediaRecorder.isTypeSupported(types[i]))return types[i]}catch(e){}return ''}
  async function toggleRecord(){
    if(pendingRecord)return;
    if(recorder&&recorder.state==='recording'){recorder.stop();return}
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||typeof MediaRecorder==='undefined'){feedback('zhrPracticeFeedback','このブラウザでは録音を使えません。','bad');return}
    stopSound();pendingRecord=true;var token=++recordToken,letter=selected,chunks=[];
    el('zhrRecord').disabled=true;el('zhrRecord').textContent='マイクを準備中…';el('zhrRecord').setAttribute('aria-busy','true');redrawRecordingControls();
    feedback('zhrPracticeFeedback','マイクを準備しています…');
    try{
      var media=await window.KP134.microphone();
      if(token!==recordToken){window.KP134.releaseMicrophone(media);return}
      stream=media;var mt=mimeType(),rec=new MediaRecorder(media,mt?{mimeType:mt}:undefined);recorder=rec;
      rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data)};
      rec.onstop=function(){
        clearTimeout(recordTimer);window.KP134.releaseMicrophone(media);if(stream===media)stream=null;if(recorder===rec)recorder=null;
        if(token!==recordToken)return;
        var blob=new Blob(chunks,{type:rec.mimeType||mt||'audio/mp4'});
        if(blob.size){if(recordings[letter])URL.revokeObjectURL(recordings[letter]);recordings[letter]=URL.createObjectURL(blob);feedback('zhrPracticeFeedback','録音を保存しました。再生ボタンで聞き返せます。','good')}else feedback('zhrPracticeFeedback','録音を保存できませんでした。もう一度録音してね。','bad');
        redrawRecordingControls();
      };
      rec.onerror=function(){feedback('zhrPracticeFeedback','録音を続けられませんでした。もう一度試してね。','bad');try{rec.stop()}catch(e){}window.KP134.releaseMicrophone(media)};
      pendingRecord=false;rec.start(100);el('zhrRecord').disabled=false;el('zhrRecord').removeAttribute('aria-busy');el('zhrRecord').textContent='■ 録音を止める';el('zhrRecord').classList.add('is-recording');redrawRecordingControls();
      feedback('zhrPracticeFeedback','録音中… もう一度押すと止まります。10秒で自動停止。');recordTimer=setTimeout(function(){if(rec.state==='recording')rec.stop()},10000);
    }catch(e){if(token!==recordToken)return;pendingRecord=false;if(stream){window.KP134.releaseMicrophone(stream);stream=null}recorder=null;redrawRecordingControls();feedback('zhrPracticeFeedback','マイクの許可を確認して、もう一度試してね。','bad')}
  }
  async function playRecording(){
    if(!recordings[selected]||pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();var button=el('zhrPlayback');function clear(){button.classList.remove('is-playing')}
    try{await window.KP134.play(selected,{root:root,clipUrl:recordings[selected],rate:1,referenceVisual:false,button:button,onPlaying:function(){button.classList.add('is-playing')},onEnded:clear,onCancel:clear,onError:function(){clear();feedback('zhrPracticeFeedback','録音を再生できませんでした。もう一度試してね。','bad')}})}catch(e){clear()}
  }

  function quizOrder(){
    var source=letters.slice(),orders=[],seen={};
    function visit(prefix,left){if(!left.length){var key=prefix.join('');if(!seen[key]){seen[key]=true;orders.push(prefix)}return}left.forEach(function(l,i){if(prefix[prefix.length-1]!==l)visit(prefix.concat(l),left.slice(0,i).concat(left.slice(i+1)))})}
    visit([],source);return orders[Math.floor(Math.random()*orders.length)];
  }
  var kpMatchState={active:null,matched:{},first:{},firstScore:0};
  function renderQuestion(){
    var box=el('zhrQuizChoices');if(!box)return;box.replaceChildren();
    var panel=el('zhrQuizPanel');var board=panel.querySelector('.kp-match-board');
    if(!board){board=document.createElement('div');board.className='kp-match-board';board.setAttribute('aria-label','音声と発音のペア合わせ');
      var left=document.createElement('section');left.className='kp-match-column';left.innerHTML='<h3>発音を選ぶ</h3>';var right=document.createElement('section');right.className='kp-match-column';right.innerHTML='<h3>音を聞く</h3>';
      var answers=document.createElement('div');answers.className='kp-match-answer-list';answers.id='zhrMatchAnswers';var audio=document.createElement('div');audio.className='kp-match-audio-list';audio.id='zhrMatchAudio';left.appendChild(answers);right.appendChild(audio);board.append(left,right);box.parentNode.insertBefore(board,box);box.hidden=true;
    }
    var answers=el('zhrMatchAnswers'),audio=el('zhrMatchAudio');answers.replaceChildren();audio.replaceChildren();
    window.KP134.shuffle(letters.slice()).forEach(function(letter){var b=document.createElement('button');b.type='button';b.className='kp-match-answer';b.textContent=letter;b.dataset.answer=letter;b.disabled=true;b.setAttribute('aria-label','発音 '+letter);b.addEventListener('click',function(){answer(letter,b)});answers.appendChild(b)});
    quiz.order.forEach(function(letter,i){var b=document.createElement('button');b.type='button';b.className='kp-match-audio';b.dataset.letter=letter;b.innerHTML='<span class="kp-match-speaker" aria-hidden="true">🔊</span>';b.setAttribute('aria-label','音声 '+(i+1)+' を聞く');b.addEventListener('click',function(){if(kpMatchState.matched[i])return;kpMatchState.active=i;quiz.index=i;quiz.answered=false;audio.querySelectorAll('button').forEach(function(x){x.classList.toggle('is-active',x===b);x.classList.remove('is-try-again')});el('zhrMatchAnswers').querySelectorAll('button').forEach(function(x){x.disabled=true});playModel(letter,b,true)});audio.appendChild(b)});
    var oldListen=el('zhrQuizListen');if(oldListen)oldListen.hidden=true;var count=el('zhrQuizCount');if(count)count.textContent='0 / '+quiz.order.length+' ペア · 初回 0 正解';var next=el('zhrQuizNext');if(next)next.hidden=true;feedback('zhrQuizFeedback','右の音声カードを押して、左から同じ音を選ぼう。');
  }
  
  function startQuiz(){
    if(pendingRecord||(recorder&&recorder.state==='recording'))return;
    stopSound();clearTimeout(quizTimer);clearTimeout(resultTimer);quiz={active:true,order:window.KP134.shuffle(letters.slice()),index:0,score:0,answered:false,heard:false};kpMatchState={active:null,matched:{},first:{},firstScore:0};el('zhrToQuiz').hidden=true;el('zhrResult').hidden=true;el('zhrQuizPanel').hidden=false;root.querySelector('.zhr-practice').hidden=true;renderQuestion();
    el('zhrQuizPanel').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }
  function answer(letter,button){
    var i=kpMatchState.active;if(i===null||!quiz.heard||kpMatchState.matched[i])return;var correct=quiz.order[i]===letter,answers=el('zhrMatchAnswers'),audio=el('zhrMatchAudio'),card=audio.children[i];quiz.heard=false;answers.querySelectorAll('button').forEach(function(b){b.disabled=true});
    if(!Object.prototype.hasOwnProperty.call(kpMatchState.first,i))kpMatchState.first[i]=correct;
    if(correct){kpMatchState.matched[i]=true;if(kpMatchState.first[i])kpMatchState.firstScore++;button.classList.add('is-matched');button.disabled=true;card.classList.remove('is-active','is-playing');card.classList.add('is-matched');card.disabled=true;var done=Object.keys(kpMatchState.matched).length;var count=el('zhrQuizCount');if(count)count.textContent=done+' / '+quiz.order.length+' ペア · 初回 '+kpMatchState.firstScore+' 正解';feedback('zhrQuizFeedback','ぴったり！ペアがつながったよ ✨','good');kpMatchState.active=null;if(done===quiz.order.length){quiz.score=kpMatchState.firstScore;quiz.active=true;setTimeout(finishQuiz,520)}else answers.querySelectorAll('button').forEach(function(b){b.disabled=b.classList.contains('is-matched')})}
    else{button.classList.add('is-wrong');setTimeout(function(){button.classList.remove('is-wrong')},460);card.classList.add('is-try-again');feedback('zhrQuizFeedback','おしい！同じ音声カードをもう一度聞いてみよう 👂','bad')}
  }
  function nextQuestion(){if(!quiz.active||!quiz.answered||quiz.index>=3)return;quiz.index++;renderQuestion();playModel(quiz.order[quiz.index],el('zhrQuizListen'),true)}
  function showResultStage(){
    if(!celebration||typeof window.koepandaShowResultCelebration!=='function')return;
    var stage=window.koepandaShowResultCelebration(celebration);if(stage)stage.classList.add('is-zhr-result');
  }
  function finishQuiz(){
    quiz.active=false;stopSound();var passed=quiz.score>=Math.ceil(quiz.order.length*0.75);el('zhrQuizPanel').hidden=true;el('zhrResult').hidden=false;el('zhrRetry').hidden=passed;el('zhrReturn').hidden=!passed;
    el('zhrResultMark').textContent=passed?'✓':'↻';el('zhrResultTitle').textContent=passed?'ミニチェック合格！':'もう一度、聞き比べよう';el('zhrResultScore').textContent=(''+quiz.order.length+'問中 '+quiz.score+'問正解');
    var message=passed?'舌先と、zh・ch・sh・r の息・声の違いがつかめたよ。':'zh と ch の息、sh と r の声の違いを聞いてみよう。';el('zhrResultMessage').textContent=message;
    if(passed){try{localStorage.setItem('koepandaInitialP7Complete','1')}catch(e){}el('zhrCompleteBadge').hidden=false}
    celebration={score:quiz.score,total:quiz.order.length,passed:passed,title:passed?'zh・ch・sh・r クリア！':'あと一歩！',message:message};
    if(window.koepandaAttachResultReplay){window.koepandaAttachResultReplay(el('zhrResult'),celebration);var replay=el('zhrResult').querySelector('.koepanda-result-reopen');if(replay)replay.onclick=showResultStage}
    resultTimer=setTimeout(showResultStage,90);
    el('zhrResult').scrollIntoView({block:'center',behavior:'smooth'});
  }
  function cleanup(){
    stopSound();recordToken++;pendingRecord=false;clearTimeout(recordTimer);clearTimeout(quizTimer);clearTimeout(resultTimer);
    var stage=document.querySelector('#koepandaResultStage.is-zhr-result');if(stage)stage.remove();
    if(recorder&&recorder.state==='recording')try{recorder.stop()}catch(e){}
    if(stream){window.KP134.releaseMicrophone(stream);stream=null}recorder=null;redrawRecordingControls();
    feedback('zhrPracticeFeedback',recordings[selected]?'この音の録音を聞き返せます。':'');feedback('zhrModelFeedback','');
    if(quiz.active){quiz.active=false;el('zhrQuizPanel').hidden=true;el('zhrToQuiz').hidden=false;root.querySelector('.zhr-practice').hidden=false}
  }
  function init(){
    root=el('kidsInitialsZHRLesson');if(!root)return;window.KP134.attach(root,letters);
    letters.forEach(function(letter){var item=guide[letter],button=document.createElement('button');button.type='button';button.className='zhr-letter-card';button.dataset.zhrLetter=letter;button.innerHTML='<strong>'+letter+'</strong><small>'+item.ipa+'</small>';button.onclick=function(){select(letter,true)};el('zhrLetterGrid').appendChild(button);
      var free=document.createElement('button');free.type='button';free.dataset.zhrLetter=letter;free.textContent=letter;free.onclick=function(){select(letter,true)};el('zhrFreeChoice').appendChild(free)});
    el('zhrModel').onclick=function(){playModel(selected,this,false)};el('zhrRecord').onclick=toggleRecord;el('zhrPlayback').onclick=playRecording;el('zhrToQuiz').onclick=startQuiz;el('zhrRetry').onclick=startQuiz;
    el('zhrQuizListen').onclick=function(){if(quiz.active)playModel(quiz.order[quiz.index],this,true)};el('zhrQuizNext').onclick=nextQuestion;
    el('zhrReturn').onclick=function(){cleanup();var back=el('pinyinLessonBack');if(back)back.click();window.dispatchEvent(new CustomEvent('koepandaInitialProgressChanged',{detail:{P7:complete()}}))};
    root.addEventListener('click',function(e){var button=e.target.closest('button');if(!button)return;button.classList.add('is-pressed');setTimeout(function(){button.classList.remove('is-pressed')},160)});
    var wasActive=false,observer=new MutationObserver(function(){var active=!root.hidden&&root.classList.contains('is-roadmap-lesson-active')&&root.getClientRects().length>0;if(wasActive&&!active)cleanup();wasActive=active});observer.observe(root,{attributes:true,attributeFilter:['hidden','class']});
    if(el('kidsCourse'))observer.observe(el('kidsCourse'),{attributes:true,attributeFilter:['hidden','class','style']});observer.observe(document.body,{attributes:true,attributeFilter:['class']});
    window.addEventListener('pagehide',cleanup);el('zhrCompleteBadge').hidden=!complete();select('zh',false);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

})();
