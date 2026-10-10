/* DEMO 10.108.73 — P4 tongue blade/contact and stable lips */
(function(){
  var letters=['d','t','n','l'];
  var guide={"d":{"hanzi":"得","pinyin":"dé","ipa":"[t]","cue":"弱い息","tip":"唇はそのまま。舌先を上の歯のすぐ後ろにつけ、すぐ離す。","title":"舌の前を上げて、離す","sub":"上あごの手前に触れる → 弱い息"},"t":{"hanzi":"特","pinyin":"tè","ipa":"[tʰ]","cue":"強い息","tip":"唇はそのまま。d と同じ場所から舌先を離し、強く息を出す。","title":"同じ舌先、強い息","sub":"上の歯のすぐ後ろに触れる → 強い息"},"n":{"hanzi":"讷","pinyin":"nè","ipa":"[n]","cue":"鼻に響く","tip":"唇はそのまま。舌先を上の歯のすぐ後ろにつけたまま、鼻に響かせる。","title":"舌先はつけたまま","sub":"口の出口をふさぎ、音は鼻へ"},"l":{"hanzi":"勒","pinyin":"lè","ipa":"[l]","cue":"左右に流す","tip":"唇はそのまま。舌先を上の歯のすぐ後ろにつけ、舌の両脇から音を通す。","title":"舌先はつけたまま","sub":"真ん中は接触、音は舌の左右へ"}};
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
  // 10.108.73: a connected tongue blade bends toward the ridge behind the
  // upper incisors. Lips, teeth and the posterior tongue root stay fixed.
  function diagram(letter){
    var hold=letter==='n'||letter==='l',id='dtnl73-'+letter+'-';
    var rest='M126 73 C103 69 76 77 60 66 C52 62 44 58 45 54 C46 49 52 49 57 53 C72 65 97 59 126 60 Z';
    var touch='M126 73 C103 69 76 77 60 66 C52 59 45 40 45 35 C46 31 52 31 56 35 C62 54 97 59 126 60 Z';
    var highlightRest='M46 54 C46 49 52 49 57 53',highlightTouch='M46 35 C46 31 52 31 56 35';
    var times=hold?'0;.24;.78;.90;1':'0;.24;.46;.52;1';
    function morph(values){return '<animate attributeName="d" values="'+values.join(';')+'" keyTimes="'+times+'" dur="3.6s" repeatCount="indefinite"/>'}
    function pulse(values,keyTimes){return '<animate attributeName="opacity" values="'+values+'" keyTimes="'+keyTimes+'" dur="3.6s" repeatCount="indefinite"/>'}
    var air='';
    if(letter==='d'||letter==='t'){
      var strong=letter==='t';
      air='<g class="td73-oral-air" opacity="0">'+pulse(strong?'0;0;.72;.72;0;0':'0;0;.40;0;0','0;.47;.53;'+(strong?'.65;.73;1':'.60;1'))+'<path d="M92 46 Q55 44 18 52"/><path d="M24 47 L18 52 L25 54"/>'+(strong?'<path d="M88 52 Q58 54 20 58"/>':'')+'</g>';
    }else if(letter==='n'){
      air='<g class="td73-nasal-air" opacity="0">'+pulse('0;0;.80;.80;0;0','0;.25;.33;.72;.83;1')+'<ellipse cx="71" cy="14" rx="41" ry="11" fill="url(#'+id+'nasal)" stroke="none"/><path d="M113 47 Q121 24 102 13 Q68 3 24 14"/><path d="M31 10 L24 14 L32 17"/></g>';
    }else{
      air='<g class="td73-lateral-air" opacity="0">'+pulse('0;0;.76;.76;0;0','0;.25;.33;.72;.83;1')+'<path d="M79 49 Q68 42 62 48 Q51 54 20 52"/><path d="M82 78 Q62 84 46 76 Q32 68 20 64"/><path d="M27 48 L20 52 L27 56 M27 60 L20 64 L27 68"/></g>';
    }
    return '<span class="dtnl73-diagram is-'+letter+'" aria-hidden="true"><svg class="dtnl73-svg" viewBox="0 0 144 104" focusable="false" data-letter="'+letter+'"><defs><linearGradient id="'+id+'tongue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6aca1"/><stop offset="1" stop-color="#df7b75"/></linearGradient><radialGradient id="'+id+'nasal"><stop offset="0" stop-color="#a9d4bd" stop-opacity=".7"/><stop offset="1" stop-color="#a9d4bd" stop-opacity="0"/></radialGradient></defs><path class="td73-cavity" d="M28 36 Q68 12 125 27 L131 75 Q95 91 34 78 L25 65 L25 46Z"/><path class="td73-palate" d="M30 33 Q35 27 42 30 Q48 35 59 28 Q91 14 125 27"/><path class="td73-lower-teeth" d="M31 69 L39 71 L39 81 L32 80Z"/><path class="td73-tongue" d="'+rest+'" fill="url(#'+id+'tongue)">'+morph([rest,touch,touch,rest,rest])+'</path><path class="td73-tongue-highlight" d="'+highlightRest+'">'+morph([highlightRest,highlightTouch,highlightTouch,highlightRest,highlightRest])+'</path><path class="td73-upper-teeth" d="M31 31 L39 31 L39 45 Q35 47 31 44Z"/><path class="td73-upper-lip" d="M16 35 Q21 30 31 33 L29 41 Q22 44 16 40Z"/><path class="td73-lower-lip" d="M16 68 Q23 65 32 68 L32 74 Q23 79 17 74Z"/><ellipse class="td73-contact" cx="50" cy="33" rx="5" ry="2.6" opacity="0">'+pulse(hold?'0;0;.8;.8;0;0':'0;0;.8;.8;0;0',hold?'0;.23;.25;.78;.90;1':'0;.23;.25;.46;.52;1')+'</ellipse>'+air+'<text class="td73-roof-label" x="66" y="40">上あご</text><text class="td73-view-label" x="16" y="97">口の中・息の模式図</text></svg></span>';
  }
  function renderFocus(){var it=guide[selected];el('dtnlFocusLetter').textContent=selected;el('dtnlFocusGuide').textContent=it.hanzi+' '+it.pinyin+' · '+it.ipa;el('dtnlFocusTip').textContent=it.tip;var act=el('dtnlActions');act.replaceChildren();var a=document.createElement('button');a.type='button';a.className='dtnl-guide-btn';a.textContent='▶ お手本（'+it.hanzi+'）';a.onclick=function(){playGuide(selected)};var b=document.createElement('button');b.type='button';b.className='dtnl-raw-btn';b.textContent='舌・息だけ';b.onclick=function(){playRaw(selected)};act.append(a,b);el('dtnlArticulation').dataset.build='10.108.73';el('dtnlArticulation').innerHTML=diagram(selected)+'<div class="dtnl-art-copy"><b>'+it.title+'</b><small>'+it.sub+'</small><em>'+it.cue+'</em></div>';var svg=el('dtnlArticulation').querySelector('svg');if(svg&&window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){svg.pauseAnimations();svg.setCurrentTime(1.1)}}
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
