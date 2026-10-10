/* DEMO 10.108.86 — soft illustration materials; articulation geometry and timing retained from 85. */
(function(){
  // Keep the lesson styled even when an older HTML page is reused.
  var lessonScript=document.currentScript;
  var stylesheetUrl=new URL('../css/70-demo1010820-dtnl-first-lesson.css?v=10.108.86',
    lessonScript&&lessonScript.src?lessonScript.src:new URL('js/',document.baseURI).href).href;
  function ensureLessonStyles(){
    var existing=document.getElementById('demo1010820-dtnl-first-lesson');
    if(existing&&existing.tagName==='LINK'&&existing.href===stylesheetUrl)return;
    var link=document.createElement('link');link.rel='stylesheet';
    link.id='demo1010820-dtnl-first-lesson';link.href=stylesheetUrl;link.dataset.build='10.108.86';
    if(existing)existing.replaceWith(link);else document.head.appendChild(link);
  }
  ensureLessonStyles();
  var letters=['d','t','n','l'];
  var guide={"d":{"hanzi":"得","pinyin":"dé","ipa":"[t]","cue":"弱い息","tip":"舌の前をゆるやかに上げ、上の歯のすぐ後ろにつけて、すぐ離す。","title":"舌の前を上げて、離す","sub":"上あごの手前に触れる → 弱い息"},"t":{"hanzi":"特","pinyin":"tè","ipa":"[tʰ]","cue":"強い息","tip":"舌の前を d と同じ場所につけてから離し、強く息を出す。","title":"同じ場所から、強い息","sub":"上の歯のすぐ後ろに触れる → 強い息"},"n":{"hanzi":"讷","pinyin":"nè","ipa":"[n]","cue":"鼻に響く","tip":"舌の前を上の歯のすぐ後ろにつけたまま、鼻に響かせる。","title":"舌はつけたまま","sub":"口の通り道をふさぎ、息は鼻から出る"},"l":{"hanzi":"勒","pinyin":"lè","ipa":"[l]","cue":"舌の両側へ","tip":"舌の前を上の歯のすぐ後ろにつけ、舌の両脇から音を通す。","title":"舌はつけたまま","sub":"舌の両側を息が通り、口から出る"}};
  var selected='d',quizOrder=['d','t','n','l'],quizIndex=0,quizScore=0,quizAnswered=false,recorder=null,stream=null,chunks=[],recordingUrl='',playback=null;
  function el(id){return document.getElementById(id)}
  function speakFallback(item){
    try{
      if(!('speechSynthesis' in window))return;
      speechSynthesis.cancel();var utterance=new SpeechSynthesisUtterance(item.hanzi);
      utterance.lang='zh-CN';utterance.rate=.78;utterance.pitch=1;speechSynthesis.speak(utterance);
    }catch(e){}
  }
  function playGuide(letter){
    var item=guide[letter];if(!item)return;
    try{if('speechSynthesis' in window)speechSynthesis.cancel()}catch(e){}
    try{
      if(typeof window.playMachine==='function'){
        var result=window.playMachine(item.hanzi,null,false);
        if(result&&typeof result.catch==='function')result.catch(function(){speakFallback(item)});
        return;
      }
    }catch(e2){}
    speakFallback(item);
  }
  function setStep(n){document.querySelectorAll('.dtnl-progress span').forEach(function(x){var k=Number(x.dataset.dtnlStep);x.classList.toggle('is-current',k===n);x.classList.toggle('is-done',k<n)})}
  // The anterior tongue rises with a gentle S-like transition.
  // Posterior contours at x >= 74 are identical in every animation frame.
  // Small fixed mouth opening; all paths share command counts for smooth SMIL.
  function diagram(letter){
    // 10.108.86: lips follow the open facial contour; tongue geometry is preserved from 84.
    var hold=letter==='n'||letter==='l',id='dtnl75-'+letter+'-';
    var rest='M126 49 C111 49 91 49 78 48 C64 47 52 47 46 44 C42 42 43 38.5 49 38 C55 37.5 61 40 66 41 C69 41.5 70 41.8 74 42 C88 43.5 107 43.8 126 43.8 Z';
    var touch='M126 49 C111 49 91 49 78 48 C64 47 52 43 46 39 C42 36 42 34 48 34 C54 34 61 32.5 66 36.5 C69 39 70 41 74 42 C88 43.5 107 43.8 126 43.8 Z';
    var hRest='M46 41 C44 38.5 50 38 55 39',hTouch='M46 37 C44 34 50 34 55 33.7';
    var times=hold?'0;.24;.78;.90;1':'0;.24;.46;.52;1';
    function morph(v){return '<animate attributeName="d" values="'+v.join(';')+'" keyTimes="'+times+'" dur="3.6s" repeatCount="indefinite"/>'}
    function pulse(v,t){return '<animate attributeName="opacity" values="'+v+'" keyTimes="'+t+'" dur="3.6s" repeatCount="indefinite"/>'}
    var heldPulse=pulse('0;0;.85;.85;0;0','0;.25;.33;.72;.83;1');
    // Materials only: each gradient stays inside the existing anatomical path.
    var materials='<radialGradient id="'+id+'skin" cx="28%" cy="23%" r="88%"><stop offset="0" stop-color="#fff8ef"/><stop offset=".56" stop-color="#f8e8da"/><stop offset="1" stop-color="#eed5c5"/></radialGradient>'
      +'<linearGradient id="'+id+'cavity" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3e0d4"/><stop offset=".55" stop-color="#fff6ee"/><stop offset="1" stop-color="#f4e1d7"/></linearGradient>'
      +'<linearGradient id="'+id+'palate" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d2aa97"/><stop offset="1" stop-color="#e4c6b6"/></linearGradient>'
      +'<linearGradient id="'+id+'lip" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f8b5a5"/><stop offset=".5" stop-color="#e99285"/><stop offset="1" stop-color="#d67b73"/></linearGradient>'
      +'<linearGradient id="'+id+'tooth" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f2eee5"/></linearGradient>'
      +'<linearGradient id="'+id+'nasal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#edf3e9"/><stop offset="1" stop-color="#d8e7db"/></linearGradient>';

    var oral='<path class="td73-cavity" fill="url(#'+id+'cavity)" d="M35 34 Q68 24.6 125 30.6 L131 49.8 Q95 56.2 38 51 L35 47 Z"/>'
      +'<path class="td73-palate" fill="none" stroke="url(#'+id+'palate)" stroke-width="5" stroke-linecap="round" d="M36 32.2 Q39 31.2 42 31.8 Q48 33.8 59 31 Q91 25.4 125 30.6"/>'
      +'<path class="td83-mouth-floor" fill="none" stroke="url(#'+id+'palate)" stroke-width="2.5" stroke-linecap="round" d="M34 51.4 C54 54.6 86 56.2 126 51.8"/>'
      +'<path class="td73-lower-teeth" fill="url(#'+id+'tooth)" stroke="#cfc4b7" stroke-width="1.2" d="M36 46.8 L41 47.2 L41 50.2 L36 49.8 Z"/>'
      +'<path class="td73-tongue" stroke="#cf7069" stroke-width="1" stroke-linejoin="round" d="'+rest+'" fill="url(#'+id+'tongue)">'+morph([rest,touch,touch,rest,rest])+'</path>'
      +'<path class="td73-tongue-highlight" fill="none" stroke="#ffe0d7" stroke-width="2.1" stroke-linecap="round" d="'+hRest+'">'+morph([hRest,hTouch,hTouch,hRest,hRest])+'</path>'
      +'<path class="td73-upper-teeth" fill="url(#'+id+'tooth)" stroke="#cfc4b7" stroke-width="1.2" d="M36 32.2 L41 32.2 L41 36.8 Q38.5 37.2 36 36.8 Z"/>'
      +'<path class="td73-upper-lip" fill="url(#'+id+'lip)" d="M29 31.2 C28 32 26.3 32.6 26 33.3 C28.5 34.2 32 34.3 36 34.1 L40 33.6 C36 33.4 32 32.6 29 31.2 Z"/>'
      +'<path class="td73-lower-lip" fill="url(#'+id+'lip)" d="M26 47.4 C29 46.7 33 47 36 47.6 L40 48.4 C35 48.5 32 49 30 49.4 C28.5 49.1 27 48.4 26 47.4 Z"/>'
      +'<path class="td73-contact" fill="#efb449" d="M43 33 C48 33.4 54 33.4 59 31.8 L60 32.6 C54 34.2 48 34.2 43 33.8 Z" opacity="0">'+pulse('0;0;.8;.8;0;0',hold?'0;.23;.25;.78;.90;1':'0;.23;.25;.46;.52;1')+'</path>'
      +'<text class="td73-roof-label" fill="#a48b7b" font-size="9" font-weight="800" x="78" y="14">上あご</text>';
    // Skin fill is continuous, while the outline stops at each lip.
    // No vertical edge across the mouth and no detached coloured lip pads.
    var profile='<path class="td85-face-skin" fill="url(#'+id+'skin)" d="M53 16 C45 23 41 31 39 39 C37 47 30 52 23 57 C17 61 17 65 23 68 C28 71 34 69 38 68 C39 75 35 81 29 85.2 C28 86 26.3 86.6 26 87.3 C28.5 88.2 32 88.3 36 88.1 L36 101.6 C33 101 29 100.7 26 101.4 C27 102.4 28.5 103.1 30 103.4 C34 109 32 112 32 115 C32 125 46 133 61 136 C85 140 109 138 127 131 L127 40 C91 20 70 18 53 16 Z"/>'
      +'<path class="td85-upper-profile" fill="none" stroke="#cba996" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M127 40 C91 20 70 18 53 16 C45 23 41 31 39 39 C37 47 30 52 23 57 C17 61 17 65 23 68 C28 71 34 69 38 68 C39 75 35 81 29 85.2 C28 86 26.3 86.6 26 87.3"/>'
      +'<path class="td85-lower-profile" fill="none" stroke="#cba996" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M26 101.4 C27 102.4 28.5 103.1 30 103.4 C34 109 32 112 32 115 C32 125 46 133 61 136 C85 140 109 138 127 131"/>'
      +'<path fill="none" stroke="#e9d3c5" stroke-width="2" stroke-linecap="round" d="M45 34 Q42 48 29 58"/>'
      +'<ellipse class="td76-nostril" fill="#b28a76" cx="30" cy="65" rx="4.4" ry="2.1" transform="rotate(-14 30 65)"/>';
    function sideFace(air){return profile+'<g transform="translate(0 54)">'+oral+(air||'')+'</g>'}
    var scene='';
    if(letter==='n'){
      scene=profile
        +'<path class="td86-nasal-cavity" fill="url(#'+id+'nasal)" stroke="#c2d4c6" stroke-width="1" d="M37 60 Q60 43 94 44 Q113 44 117 55 L121 97 L113 99 L110 62 Q78 49 40 66Z"/>'
        +'<g transform="translate(0 54)">'+oral+'</g>'
        +'<g class="td75-nasal-route" fill="none" stroke="#61a68b" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" opacity="0">'+heldPulse
        +'<path d="M117 99 Q120 84 116 60 Q83 42 42 60 L30 65 Q23 72 16 73"/><path d="M22 69 L16 73 L23 76"/></g>'
        +'<text fill="#699980" font-size="10" font-weight="800" x="64" y="38">鼻の中</text>'
        +'<text fill="#66917c" font-size="9" font-weight="800" x="42" y="77">鼻孔</text>'
        +'<text fill="#aa9589" font-size="9" font-weight="700" x="24" y="200">鼻から息が出る</text>';
    }else if(letter==='l'){
      scene='<g class="td76-side-view" transform="translate(16 0) scale(.78)">'+sideFace('')+'</g>'
        +'<text fill="#a48b7b" font-size="9" font-weight="800" x="24" y="126">横：舌の前の位置</text>'
        +'<path fill="none" stroke="#e7dcd4" stroke-width="1" d="M14 136 H130"/>'
        +'<g class="td76-front-above-view" transform="translate(0 35) rotate(180 72 137)">'
        +'<path fill="url(#'+id+'tooth)" stroke="#d1b7a5" stroke-width="1.5" d="M26 161 L26 137 Q26 111 72 111 Q118 111 118 137 L118 161 L108 161 L108 136 Q108 121 72 121 Q36 121 36 136 L36 161Z"/>'
        +'<g stroke="#ddc4b6" stroke-width="1"><path d="M53 113 L56 122 M72 111 V121 M91 113 L88 122 M35 120 L41 128 M109 120 L103 128 M27 135 L37 138 M117 135 L107 138"/></g>'
        +'<path fill="url(#'+id+'frontTongue)" stroke="#cf7069" stroke-width="1.1" d="M49 164 Q46 143 54 135 Q58 131 60 125 Q61 119 66 118 Q72 116 78 118 Q83 119 84 125 Q86 131 90 135 Q98 143 95 164Z"/>'
        +'<path class="td84-front-blade-rim" fill="#ee948a" d="M60 125 Q61 118 66 117 Q72 115.5 78 117 Q83 118 84 125 Q78 122 72 122 Q66 122 60 125Z"/>'
        +'<path fill="none" stroke="#ffe0d7" stroke-width="1.8" stroke-linecap="round" d="M62 124 Q62 120 66 120 Q72 118.8 78 120 Q82 120 82 124"/>'
        +'<ellipse fill="#efb449" cx="72" cy="119" rx="9" ry="1.6" opacity="0">'+heldPulse+'</ellipse>'
        +'<g class="td75-lateral-route" fill="none" stroke="#61a68b" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" opacity="0">'+heldPulse
        +'<path d="M42 162 Q36 143 43 130 Q48 123 53 116 L54 104 M102 162 Q108 143 101 130 Q96 123 91 116 L90 104"/>'
        +'<path d="M50 110 L54 104 L58 110 M86 110 L90 104 L94 110"/></g>'

        +'</g>'
        +'<path fill="none" stroke="#e9b5a9" stroke-width="2.5" stroke-linecap="round" d="M27 198 Q35 209 72 209 Q109 209 117 198"/>'
        +'<text fill="#a48b7b" font-size="9" font-weight="800" x="32" y="223">正面・少し上から</text>';
    }else{
      var strong=letter==='t';
      var air='<g class="td73-oral-air" fill="none" stroke="#65a98f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0">'
        +pulse(strong?'0;0;.72;.72;0;0':'0;0;.40;0;0','0;.47;.53;'+(strong?'.65;.73;1':'.60;1'))
        +'<path d="M92 37.5 Q55 39 18 40.6"/><path d="M24 38.6 L18 40.6 L24 42.1"/>'+(strong?'<path d="M88 39.4 Q58 41 20 42.2"/>':'')+'</g>';
      scene=sideFace(air)+'<text fill="#aa9589" font-size="9" font-weight="700" x="32" y="200">横から見た図</text>';
    }
    return '<span class="dtnl73-diagram is-'+letter+'" aria-hidden="true" style="display:block;width:124px;height:198px;overflow:hidden"><svg class="dtnl73-svg" width="124" height="198" viewBox="0 0 144 230" focusable="false" data-letter="'+letter+'" style="--dtnl-cavity:url(#'+id+'cavity);--dtnl-palate:url(#'+id+'palate);--dtnl-tooth:url(#'+id+'tooth);--dtnl-lip:url(#'+id+'lip)"><defs><linearGradient id="'+id+'tongue" gradientUnits="userSpaceOnUse" x1="0" y1="32" x2="0" y2="50"><stop offset="0" stop-color="#f9b7aa"/><stop offset=".45" stop-color="#ec968a"/><stop offset="1" stop-color="#d57571"/></linearGradient><linearGradient id="'+id+'frontTongue" gradientUnits="userSpaceOnUse" x1="0" y1="116" x2="0" y2="164"><stop offset="0" stop-color="#f9b7aa"/><stop offset=".45" stop-color="#ec968a"/><stop offset="1" stop-color="#d57571"/></linearGradient>'+materials+'</defs>'+scene+'</svg></span>';
  }
  function renderFocus(){var it=guide[selected];el('dtnlFocusLetter').textContent=selected;el('dtnlFocusGuide').textContent=it.hanzi+' '+it.pinyin+' · '+it.ipa;el('dtnlFocusTip').textContent=it.tip;var act=el('dtnlActions');act.replaceChildren();var a=document.createElement('button');a.type='button';a.className='dtnl-guide-btn';a.textContent='▶ お手本（'+it.hanzi+'）';a.onclick=function(){playGuide(selected)};act.append(a);el('dtnlArticulation').dataset.build='10.108.86';el('dtnlArticulation').innerHTML=diagram(selected)+'<div class="dtnl-art-copy"><b>'+it.title+'</b><small>'+it.sub+'</small><em>'+it.cue+'</em></div>';var svg=el('dtnlArticulation').querySelector('svg');if(svg&&window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){svg.pauseAnimations();svg.setCurrentTime(1.1)}}
  function select(letter,listen){selected=letter;document.querySelectorAll('.dtnl-letter-card,.dtnl-free-choice button').forEach(function(x){x.classList.toggle('is-active',x.dataset.letter===letter)});renderFocus();if(listen)playGuide(letter)}
  function renderLetters(){var grid=el('dtnlLetterGrid'),free=el('dtnlFreeChoice');if(!grid||!free)return;grid.replaceChildren();free.replaceChildren();letters.forEach(function(letter){var it=guide[letter],b=document.createElement('button');b.type='button';b.className='dtnl-letter-card';b.dataset.letter=letter;b.innerHTML='<span class="big">'+letter+'</span><span class="ipa">'+it.ipa+'</span><span class="cue">'+it.cue+'</span>';b.onclick=function(){setStep(2);select(letter,true)};grid.appendChild(b);var f=document.createElement('button');f.type='button';f.dataset.letter=letter;f.textContent=letter;f.onclick=function(){setStep(3);select(letter,true)};free.appendChild(f)});select('d',false)}
  function mimeType(){
    if(typeof MediaRecorder==='undefined')return '';
    var arr=['audio/mp4','audio/webm;codecs=opus','audio/webm'];
    for(var i=0;i<arr.length;i++){try{if(MediaRecorder.isTypeSupported(arr[i]))return arr[i]}catch(e){}}
    return ''
  }
  function stopPracticeAudio(){
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
  function wireLessonButtonFeedback(root){
    var active=null,timer=0;
    function release(){if(active){active.classList.remove('dtnl-is-pressed');active=null}}
    root.addEventListener('pointerdown',function(event){
      var button=event.target.closest('button');if(!button||!root.contains(button))return;
      if(timer){clearTimeout(timer);timer=0}release();active=button;button.classList.add('dtnl-is-pressed');
    });
    root.addEventListener('pointerup',release);
    root.addEventListener('pointercancel',release);
    root.addEventListener('pointerleave',release);
    root.addEventListener('click',function(event){
      var button=event.target.closest('button');if(!button||!root.contains(button))return;
      if(timer)clearTimeout(timer);release();active=button;button.classList.add('dtnl-is-pressed');
      timer=setTimeout(function(){release();timer=0},220);
    });
    root.addEventListener('keydown',function(event){
      if(event.key!==' '&&event.key!=='Enter')return;
      var button=event.target.closest('button');if(button){release();active=button;button.classList.add('dtnl-is-pressed')}
    });
    root.addEventListener('keyup',function(){release()});
    root.addEventListener('focusout',function(){release()});
  }
  function init(){
    if(!el('kidsInitialsDTNLLesson'))return;
    wireLessonButtonFeedback(el('kidsInitialsDTNLLesson'));
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
