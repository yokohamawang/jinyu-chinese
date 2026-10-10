/* DEMO 10.108.75 — P4 tongue blade/contact and stable lips */
(function(){
  var letters=['d','t','n','l'];
  var guide={"d":{"hanzi":"得","pinyin":"dé","ipa":"[t]","cue":"弱い息","tip":"唇はそのまま。舌先を上の歯のすぐ後ろにつけ、すぐ離す。","title":"舌の前を上げて、離す","sub":"上あごの手前に触れる → 弱い息"},"t":{"hanzi":"特","pinyin":"tè","ipa":"[tʰ]","cue":"強い息","tip":"唇はそのまま。d と同じ場所から舌先を離し、強く息を出す。","title":"同じ舌先、強い息","sub":"上の歯のすぐ後ろに触れる → 強い息"},"n":{"hanzi":"讷","pinyin":"nè","ipa":"[n]","cue":"鼻に響く","tip":"唇はそのまま。舌先を上の歯のすぐ後ろにつけたまま、鼻に響かせる。","title":"舌先はつけたまま","sub":"口の通り道をふさぎ、息は鼻から出る"},"l":{"hanzi":"勒","pinyin":"lè","ipa":"[l]","cue":"舌の両側へ","tip":"唇はそのまま。舌先を上の歯のすぐ後ろにつけ、舌の両脇から音を通す。","title":"舌先はつけたまま","sub":"舌の両側を息が通り、口から出る"}};
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
  // 10.108.75: a connected tongue blade bends toward the ridge behind the
  // upper incisors. Lips, teeth and the posterior tongue root stay fixed.
  // 10.108.75: a visible nasal exit and a separate top view for lateral airflow.
  // The side view shows tongue contact only; no lateral paths above/below it.
  function diagram(letter){
    var hold=letter==='n'||letter==='l',id='dtnl75-'+letter+'-';
    var rest='M126 73 C103 69 76 77 60 66 C52 62 44 58 45 54 C46 49 52 49 57 53 C72 65 97 59 126 60 Z';
    var touch='M126 73 C103 69 76 77 60 66 C52 59 45 40 45 35 C46 31 52 31 56 35 C62 54 97 59 126 60 Z';
    var hRest='M46 54 C46 49 52 49 57 53',hTouch='M46 35 C46 31 52 31 56 35';
    var times=hold?'0;.24;.78;.90;1':'0;.24;.46;.52;1';
    function morph(v){return '<animate attributeName="d" values="'+v.join(';')+'" keyTimes="'+times+'" dur="3.6s" repeatCount="indefinite"/>'}
    function pulse(v,t){return '<animate attributeName="opacity" values="'+v+'" keyTimes="'+t+'" dur="3.6s" repeatCount="indefinite"/>'}
    var heldPulse=pulse('0;0;.85;.85;0;0','0;.25;.33;.72;.83;1');
    var oral='<path class="td73-cavity" fill="#fcf0e9" d="M28 36 Q68 12 125 27 L131 75 Q95 91 34 78 L25 65 L25 46Z"/>'
      +'<path class="td73-palate" fill="none" stroke="#dcb9a8" stroke-width="5" stroke-linecap="round" d="M30 33 Q35 27 42 30 Q48 35 59 28 Q91 14 125 27"/>'
      +'<path class="td73-lower-teeth" fill="#fffdfa" stroke="#d8c8bf" stroke-width="1.2" d="M31 69 L39 71 L39 81 L32 80Z"/>'
      +'<path class="td73-tongue" stroke="#cf7069" stroke-width="1" stroke-linejoin="round" d="'+rest+'" fill="url(#'+id+'tongue)">'+morph([rest,touch,touch,rest,rest])+'</path>'
      +'<path class="td73-tongue-highlight" fill="none" stroke="#ffe0d7" stroke-width="2.1" stroke-linecap="round" d="'+hRest+'">'+morph([hRest,hTouch,hTouch,hRest,hRest])+'</path>'
      +'<path class="td73-upper-teeth" fill="#fffdfa" stroke="#d8c8bf" stroke-width="1.2" d="M31 31 L39 31 L39 45 Q35 47 31 44Z"/>'
      +'<path class="td73-upper-lip" fill="#f09a8e" d="M16 35 Q21 30 31 33 L29 41 Q22 44 16 40Z"/>'
      +'<path class="td73-lower-lip" fill="#e9847b" d="M16 68 Q23 65 32 68 L32 74 Q23 79 17 74Z"/>'
      +'<ellipse class="td73-contact" fill="#efb449" cx="50" cy="33" rx="5" ry="2.6" opacity="0">'+pulse('0;0;.8;.8;0;0',hold?'0;.23;.25;.78;.90;1':'0;.23;.25;.46;.52;1')+'</ellipse>'
      +'<text class="td73-roof-label" fill="#a48b7b" font-size="9" font-weight="800" x="66" y="40">上あご</text>';
    var scene='';
    if(letter==='n'){
      scene='<path fill="#fbf0e7" stroke="#dec2b2" stroke-width="1.5" stroke-linejoin="round" d="M53 16 Q42 25 39 39 Q37 46 23 56 Q15 63 23 68 Q29 71 38 68 Q40 76 30 86 L125 82 L126 40 Q91 20 53 16Z"/>'
        +'<path fill="#e1eee3" stroke="#c9dbcc" stroke-width="1" d="M37 60 Q60 43 94 44 Q113 44 117 55 L121 97 L113 99 L110 62 Q78 49 40 66Z"/>'
        +'<path fill="none" stroke="#e9d3c5" stroke-width="2" stroke-linecap="round" d="M45 34 Q42 48 29 58"/>'
        +'<ellipse fill="#b99583" cx="30" cy="65" rx="4.4" ry="2.1" transform="rotate(-14 30 65)"/>'
        +'<g transform="translate(0 54)">'+oral+'</g>'
        +'<g class="td75-nasal-route" fill="none" stroke="#61a68b" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" opacity="0">'+heldPulse
        +'<path d="M117 104 Q120 84 116 60 Q83 42 42 60 L30 65 Q23 72 16 73"/><path d="M22 69 L16 73 L23 76"/></g>'
        +'<text fill="#699980" font-size="10" font-weight="800" x="64" y="38">鼻の中</text>'
        +'<text fill="#66917c" font-size="9" font-weight="800" x="42" y="77">鼻孔</text>'
        +'<text fill="#aa9589" font-size="9" font-weight="700" x="24" y="165">鼻から息が出る</text>';
    }else if(letter==='l'){
      scene='<g transform="translate(5 0) scale(.92)">'+oral+'</g>'
        +'<text fill="#a48b7b" font-size="9" font-weight="800" x="24" y="86">横：舌先の位置</text>'
        +'<path fill="none" stroke="#e7dcd4" stroke-width="1" d="M14 95 H130"/>'
        +'<path fill="#fcf0e9" stroke="#ddc4b6" stroke-width="1.5" d="M26 161 L26 137 Q26 111 72 111 Q118 111 118 137 L118 161 L108 161 L108 136 Q108 121 72 121 Q36 121 36 136 L36 161Z"/>'
        +'<g stroke="#ddc4b6" stroke-width="1"><path d="M53 113 L56 122 M72 111 V121 M91 113 L88 122 M35 120 L41 128 M109 120 L103 128 M27 135 L37 138 M117 135 L107 138"/></g>'
        +'<path fill="url(#'+id+'tongue)" stroke="#cf7069" stroke-width="1.1" d="M49 164 Q46 143 54 135 Q61 131 63 123 Q64 117 72 117 Q80 117 81 123 Q83 131 90 135 Q98 143 95 164Z"/>'
        +'<path fill="none" stroke="#ffe0d7" stroke-width="1.8" stroke-linecap="round" d="M66 125 Q65 121 72 121 Q79 121 78 125"/>'
        +'<ellipse fill="#efb449" cx="72" cy="120" rx="6" ry="2.3" opacity="0">'+heldPulse+'</ellipse>'
        +'<g class="td75-lateral-route" fill="none" stroke="#61a68b" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" opacity="0">'+heldPulse
        +'<path d="M42 162 Q36 143 43 130 Q48 123 53 116 L54 104 M102 162 Q108 143 101 130 Q96 123 91 116 L90 104"/>'
        +'<path d="M50 110 L54 104 L58 110 M86 110 L90 104 L94 110"/></g>'
        +'<text fill="#a48b7b" font-size="9" font-weight="800" x="24" y="173">上：息は舌の両側へ</text>';
    }else{
      var strong=letter==='t';
      scene='<g transform="translate(0 32)">'+oral
        +'<g class="td73-oral-air" fill="none" stroke="#65a98f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0">'
        +pulse(strong?'0;0;.72;.72;0;0':'0;0;.40;0;0','0;.47;.53;'+(strong?'.65;.73;1':'.60;1'))
        +'<path d="M92 46 Q55 44 18 52"/><path d="M24 47 L18 52 L25 54"/>'+(strong?'<path d="M88 52 Q58 54 20 58"/>':'')+'</g></g>'
        +'<text fill="#aa9589" font-size="9" font-weight="700" x="32" y="140">横から見た図</text>';
    }
    return '<span class="dtnl73-diagram is-'+letter+'" aria-hidden="true" style="display:block;width:124px;height:155px;overflow:hidden"><svg class="dtnl73-svg" width="124" height="155" viewBox="0 0 144 180" focusable="false" data-letter="'+letter+'"><defs><linearGradient id="'+id+'tongue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6aca1"/><stop offset="1" stop-color="#df7b75"/></linearGradient></defs>'+scene+'</svg></span>';
  }
  function renderFocus(){var it=guide[selected];el('dtnlFocusLetter').textContent=selected;el('dtnlFocusGuide').textContent=it.hanzi+' '+it.pinyin+' · '+it.ipa;el('dtnlFocusTip').textContent=it.tip;var act=el('dtnlActions');act.replaceChildren();var a=document.createElement('button');a.type='button';a.className='dtnl-guide-btn';a.textContent='▶ お手本（'+it.hanzi+'）';a.onclick=function(){playGuide(selected)};var b=document.createElement('button');b.type='button';b.className='dtnl-raw-btn';b.textContent='舌・息だけ';b.onclick=function(){playRaw(selected)};act.append(a,b);el('dtnlArticulation').dataset.build='10.108.75';el('dtnlArticulation').innerHTML=diagram(selected)+'<div class="dtnl-art-copy"><b>'+it.title+'</b><small>'+it.sub+'</small><em>'+it.cue+'</em></div>';var svg=el('dtnlArticulation').querySelector('svg');if(svg&&window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){svg.pauseAnimations();svg.setCurrentTime(1.1)}}
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
