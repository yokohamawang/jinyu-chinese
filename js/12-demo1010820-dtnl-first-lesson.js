/* DEMO 10.108.20 — P4 d/t/n/l first lesson */
(function(){
  var letters=['d','t','n','l'];
  var guide={d:{hanzi:'得',pinyin:'dé',ipa:'[t]',cue:'弱い息',tip:'舌先を、上の前歯のすぐ後ろの上あごにつけ、軽く離す。',title:'舌先は前歯のすぐ後ろ',sub:'触れてから、軽く離す'},t:{hanzi:'特',pinyin:'tè',ipa:'[tʰ]',cue:'強い息',tip:'d と同じ場所。舌先を離す瞬間に息を強く出す。',title:'舌先は d と同じ場所',sub:'離す瞬間に息を強く'},n:{hanzi:'讷',pinyin:'nè',ipa:'[n]',cue:'鼻に響く',tip:'舌先を、上の前歯のすぐ後ろの上あごにつけたまま、声を鼻へ響かせる。',title:'舌先はつけたまま',sub:'声は鼻へ響かせる'},l:{hanzi:'勒',pinyin:'lè',ipa:'[l]',cue:'左右に流す',tip:'舌先を、上の前歯のすぐ後ろの上あごにつけ、声を舌の左右から通す。',title:'舌先は前歯のすぐ後ろ',sub:'舌の左右から音を流す'}};
  var selected='d',quizOrder=['d','t','n','l'],quizIndex=0,quizScore=0,quizAnswered=false,audioCtxRef=null,nodes=[],recorder=null,stream=null,chunks=[],recordingUrl='',playback=null;
  function el(id){return document.getElementById(id)}
  function stopSynthetic(){nodes.forEach(function(n){try{n.stop(0)}catch(e){}});nodes=[]}
  function ctx(){try{audioCtxRef=audioCtxRef||new (window.AudioContext||window.webkitAudioContext)();if(audioCtxRef.state==='suspended')audioCtxRef.resume();return audioCtxRef}catch(e){return null}}
  function env(g,c,now,peak,dur){g.gain.cancelScheduledValues(now);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(peak,now+.015);g.gain.exponentialRampToValueAtTime(.0001,now+dur)}
  function noise(c,d){var b=c.createBuffer(1,Math.floor(c.sampleRate*d),c.sampleRate),a=b.getChannelData(0);for(var i=0;i<a.length;i++)a[i]=Math.random()*2-1;return b}
  function burst(asp){var c=ctx();if(!c)return;stopSynthetic();var now=c.currentTime+.02,src=c.createBufferSource(),bp=c.createBiquadFilter(),g=c.createGain();src.buffer=noise(c,asp?.18:.09);bp.type='bandpass';bp.frequency.value=3400;bp.Q.value=.8;env(g,c,now,asp?.22:.10,asp?.20:.10);src.connect(bp).connect(g).connect(c.destination);src.start(now);src.stop(now+(asp?.22:.12));nodes.push(src)}
  function nasal(){var c=ctx();if(!c)return;stopSynthetic();var now=c.currentTime+.02,o=c.createOscillator(),g=c.createGain(),lp=c.createBiquadFilter();o.type='sine';o.frequency.value=190;lp.type='lowpass';lp.frequency.value=900;env(g,c,now,.11,.32);o.connect(lp).connect(g).connect(c.destination);o.start(now);o.stop(now+.34);nodes.push(o)}
  function lateral(){var c=ctx();if(!c)return;stopSynthetic();var now=c.currentTime+.02,o=c.createOscillator(),g=c.createGain(),bp=c.createBiquadFilter();o.type='sawtooth';o.frequency.value=165;bp.type='bandpass';bp.frequency.value=1250;bp.Q.value=.5;env(g,c,now,.055,.30);o.connect(bp).connect(g).connect(c.destination);o.start(now);o.stop(now+.33);nodes.push(o)}
  function playRaw(letter){if(letter==='d')burst(false);else if(letter==='t')burst(true);else if(letter==='n')nasal();else lateral()}
  function playGuide(letter){var it=guide[letter];if(!it)return;stopSynthetic();try{if('speechSynthesis' in window)speechSynthesis.cancel()}catch(e0){}try{if(typeof window.playMachine==='function'){var r=window.playMachine(it.hanzi,null,false);if(r&&typeof r.catch==='function')r.catch(function(){playRaw(letter)});return}}catch(e){}try{if('speechSynthesis'in window){speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(it.hanzi);u.lang='zh-CN';u.rate=.78;u.pitch=1;u.onerror=function(){playRaw(letter)};speechSynthesis.speak(u);return}}catch(e2){}playRaw(letter)}
  function setStep(n){document.querySelectorAll('.dtnl-progress span').forEach(function(x){var k=Number(x.dataset.dtnlStep);x.classList.toggle('is-current',k===n);x.classList.toggle('is-done',k<n)})}
  function diagram(letter){return '<span class="tongue-diagram is-'+letter+'" aria-hidden="true"><i class="td-palate"></i><i class="td-teeth"></i><i class="td-ridge"></i><i class="td-target"></i><i class="td-tongue"></i><i class="td-tip"></i><i class="td-air a1"></i><i class="td-air a2"></i><i class="td-air a3"></i><i class="td-nose"></i><i class="td-side"></i><i class="td-side r"></i><small class="td-label">前歯のすぐ後ろの上あご</small></span>'}
  function renderFocus(){var it=guide[selected];el('dtnlFocusLetter').textContent=selected;el('dtnlFocusGuide').textContent=it.hanzi+' '+it.pinyin+' · '+it.ipa;el('dtnlFocusTip').textContent=it.tip;var act=el('dtnlActions');act.replaceChildren();var a=document.createElement('button');a.type='button';a.className='dtnl-guide-btn';a.textContent='▶ お手本（'+it.hanzi+'）';a.onclick=function(){playGuide(selected)};var b=document.createElement('button');b.type='button';b.className='dtnl-raw-btn';b.textContent='舌・息だけ';b.onclick=function(){playRaw(selected)};act.append(a,b);el('dtnlArticulation').innerHTML='<div class="dtnl-stage-head"><span>口の動きアニメーション</span><small>正面で口の形、横から舌先の位置</small></div><div class="dtnl-front-view"><span class="dtnl-view-label">正面</span><span class="dtnl-front-mouth is-'+selected+'" aria-hidden="true"><i class="df-bridge"></i><i class="df-nose"><u class="left"></u><u class="right"></u><b class="left"></b><b class="right"></b></i><i class="df-mouth"></i><i class="df-air a1"></i><i class="df-air a2"></i><i class="df-nasal n1"></i><i class="df-nasal n2"></i></span><small>鼻と口の位置もいっしょに確認</small></div><div class="dtnl-side-view"><span class="dtnl-view-label">横から</span>'+diagram(selected)+'</div><div class="dtnl-art-copy"><b>'+it.title+'</b><small>'+it.sub+'</small><em>'+it.cue+'</em></div>'}
  function select(letter,listen){selected=letter;document.querySelectorAll('.dtnl-letter-card,.dtnl-free-choice button').forEach(function(x){x.classList.toggle('is-active',x.dataset.letter===letter)});renderFocus();if(listen)playGuide(letter)}
  function renderLetters(){var grid=el('dtnlLetterGrid'),free=el('dtnlFreeChoice');if(!grid||!free)return;grid.replaceChildren();free.replaceChildren();letters.forEach(function(letter){var it=guide[letter],b=document.createElement('button');b.type='button';b.className='dtnl-letter-card';b.dataset.letter=letter;b.innerHTML='<span class="big">'+letter+'</span><span class="ipa">'+it.ipa+'</span><span class="cue">'+it.cue+'</span>';b.onclick=function(){setStep(2);select(letter,true)};grid.appendChild(b);var f=document.createElement('button');f.type='button';f.dataset.letter=letter;f.textContent=letter;f.onclick=function(){setStep(3);select(letter,true)};free.appendChild(f)});select('d',false)}
  function mimeType(){
    if(typeof MediaRecorder==='undefined')return '';
    var arr=['audio/mp4','audio/webm;codecs=opus','audio/webm'];
    for(var i=0;i<arr.length;i++){try{if(MediaRecorder.isTypeSupported(arr[i]))return arr[i]}catch(e){}}
    return ''
  }
  function stopPracticeAudio(){
    stopSynthetic();
    try{if('speechSynthesis' in window)speechSynthesis.cancel()}catch(e){}
    try{if(playback){playback.pause();playback.currentTime=0}}catch(e2){}
  }
  async function toggleRecord(){
    var btn=el('dtnlRecord'),fb=el('dtnlPracticeFeedback');
    if(recorder&&recorder.state==='recording'){try{recorder.stop()}catch(e){}return}
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||typeof MediaRecorder==='undefined'){
      if(fb){fb.textContent='このブラウザでは録音が使えません。';fb.className='dtnl-feedback is-bad'}return
    }
    try{
      stopPracticeAudio();chunks=[];stream=await navigator.mediaDevices.getUserMedia({audio:true});
      var mt=mimeType();recorder=new MediaRecorder(stream,mt?{mimeType:mt}:undefined);
      recorder.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data)};
      recorder.onstop=function(){
        var blob=new Blob(chunks,{type:recorder.mimeType||mt||'audio/mp4'});
        if(recordingUrl)URL.revokeObjectURL(recordingUrl);recordingUrl=URL.createObjectURL(blob);
        if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}
        btn.textContent='↻ もう一度録音';btn.classList.remove('is-recording');
        el('dtnlPlayback').disabled=false;
        if(fb){fb.textContent='録音できたよ。お手本と聞きくらべてみよう 👂';fb.className='dtnl-feedback is-good'}
        setStep(3)
      };
      recorder.start();btn.textContent='■ 録音を止める';btn.classList.add('is-recording');
      if(fb){fb.textContent='録音中… '+selected+' の舌先と息の出し方を意識してまねしよう';fb.className='dtnl-feedback'}
    }catch(e){if(fb){fb.textContent='マイクの許可を確認してね。';fb.className='dtnl-feedback is-bad'}}
  }
  function playRecording(){
    if(!recordingUrl)return;
    var btn=el('dtnlPlayback');if(btn){btn.classList.remove('is-pressed');void btn.offsetWidth;btn.classList.add('is-pressed');setTimeout(function(){btn.classList.remove('is-pressed')},180)}
    try{if(playback)playback.pause();playback=new Audio(recordingUrl);if(btn)btn.classList.add('is-playing');playback.addEventListener('ended',function(){if(btn)btn.classList.remove('is-playing')},{once:true});var p=playback.play();if(p&&p.catch)p.catch(function(){if(btn)btn.classList.remove('is-playing')})}catch(e){if(btn)btn.classList.remove('is-playing')}
  }
  function renderQuiz(){var box=el('dtnlQuizChoices');box.replaceChildren();letters.forEach(function(letter){var b=document.createElement('button');b.type='button';b.textContent=letter;b.onclick=function(){answer(letter,b)};box.appendChild(b)});el('dtnlQuizCount').textContent=(quizIndex+1)+' / '+quizOrder.length;el('dtnlQuizFeedback').textContent='';el('dtnlQuizFeedback').className='dtnl-feedback';el('dtnlQuizNext').hidden=true;quizAnswered=false}
  function answer(letter,button){if(quizAnswered)return;quizAnswered=true;var right=quizOrder[quizIndex],fb=el('dtnlQuizFeedback');if(letter===right){quizScore++;button.classList.add('is-correct');fb.textContent='いい耳！ '+right+' だよ ✓';fb.className='dtnl-feedback is-good'}else{button.classList.add('is-wrong');Array.from(el('dtnlQuizChoices').children).forEach(function(x){if(x.textContent===right)x.classList.add('is-correct')});fb.textContent='今回は '+right+'。舌先と息の違いをもう一度見よう';fb.className='dtnl-feedback is-bad'}var next=el('dtnlQuizNext');if(quizIndex===quizOrder.length-1){next.hidden=true;window.setTimeout(function(){if(quizAnswered)finish()},650)}else{next.hidden=false;next.textContent='次の問題へ →'}}
  function nextQuiz(){if(!quizAnswered)return;if(quizIndex<quizOrder.length-1){quizIndex++;renderQuiz();playGuide(quizOrder[quizIndex]);return}finish()}
  function finish(){var pass=quizScore>=3,res=el('dtnlResult');el('dtnlQuizPanel').hidden=true;res.hidden=false;var badge=el('dtnlResultBadge');badge.textContent=pass?'✓':'↻';badge.className='dtnl-result-badge '+(pass?'':'is-retry');el('dtnlResultScore').textContent='4問中 '+quizScore+'問正解';el('dtnlResultMessage').textContent=pass?'舌先の場所と、息・鼻・左右の通り道をつかめたよ。':'もう一度ゆっくり聞き比べよう。';var a=el('dtnlResultAction');a.textContent=pass?'レッスン一覧へ戻る':'もう一度チェックする';a.onclick=pass?function(){try{localStorage.setItem('koepandaInitialP4Complete','1');window.dispatchEvent(new CustomEvent('koepandaInitialProgressChanged',{detail:{P4:true}}))}catch(e){}var back=document.getElementById('pinyinLessonBack');if(back)back.click()}:function(){quizIndex=0;quizScore=0;res.hidden=true;el('dtnlQuizPanel').hidden=false;renderQuiz();setStep(4)};var celebration={score:quizScore,total:quizOrder.length,passed:pass,title:pass?'ミニチェック合格！':'あと一歩！',message:pass?(quizScore===quizOrder.length?'d・t・n・l、4問ぜんぶ正解！ 舌先と息の違いをしっかり聞き分けられたよ。':'d・t・n・l の違いがつかめたよ。あと1問で満点！'):'苦手な音を聞き直して、もう一度挑戦しよう。'};if(window.koepandaAttachResultReplay)window.koepandaAttachResultReplay(res,celebration);if(window.koepandaQueueResultCelebration)window.koepandaQueueResultCelebration(celebration,90);else if(window.koepandaShowResultCelebration)window.setTimeout(function(){window.koepandaShowResultCelebration(celebration)},90)}
  function init(){
    if(!el('kidsInitialsDTNLLesson'))return;
    renderLetters();
    var practice=document.querySelector('#kidsInitialsDTNLLesson .dtnl-practice-panel');
    if(practice)practice.hidden=false;
    el('dtnlQuizPanel').hidden=true;el('dtnlResult').hidden=true;
    el('dtnlPlayback').disabled=true;el('dtnlToQuiz').disabled=false;
    el('dtnlRecord').onclick=toggleRecord;
    el('dtnlPlayback').onclick=playRecording;
    el('dtnlToQuiz').onclick=function(){
      setStep(4);quizIndex=0;quizScore=0;if(practice)practice.hidden=true;el('dtnlQuizPanel').hidden=false;renderQuiz();
      requestAnimationFrame(function(){el('dtnlQuizPanel').scrollIntoView({block:'start',behavior:'smooth'})})
    };
    el('dtnlQuizListen').onclick=function(){playGuide(quizOrder[quizIndex])};el('dtnlQuizNext').onclick=nextQuiz
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
