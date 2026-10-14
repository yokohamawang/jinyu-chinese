/* DEMO 10.108.99 — compact static DTNL guidance and reduced repeated animation copy. */
(function(){
  // Keep the lesson styled even when an older HTML page is reused.
  var lessonScript=document.currentScript;
  var stylesheetUrl=new URL('../css/70-demo1010820-dtnl-first-lesson.css?v=10.108.112',
    lessonScript&&lessonScript.src?lessonScript.src:new URL('js/',document.baseURI).href).href;
  function ensureLessonStyles(){
    var existing=document.getElementById('demo1010820-dtnl-first-lesson');
    if(existing&&existing.tagName==='LINK'&&existing.href===stylesheetUrl)return;
    var link=document.createElement('link');link.rel='stylesheet';
    link.id='demo1010820-dtnl-first-lesson';link.href=stylesheetUrl;link.dataset.build='10.108.112';
    if(existing)existing.replaceWith(link);else document.head.appendChild(link);
  }
  ensureLessonStyles();
  var letters=['d','t','n','l'];
  var guide={"d":{"hanzi":"得","pinyin":"dé","ipa":"[t]","cue":"弱い息","tip":"舌先で息をいったん止め、ぱっと離します。強い息は出しません。","title":"舌先をつけて、ぱっと離す","sub":"息をいったん止めてから、短く出す"},"t":{"hanzi":"特","pinyin":"tè","ipa":"[tʰ]","cue":"強い息","tip":"d と同じ位置から舌先を離し、強い息を出します。","title":"舌先を離して、強い息","sub":"d と同じ場所につけ、離すときに送気する"},"n":{"hanzi":"讷","pinyin":"nè","ipa":"[n]","cue":"鼻に響く","tip":"舌先をつけたまま、鼻に声をひびかせます。","title":"舌先をつけたまま、鼻へ","sub":"口の通り道をふさぎ、鼻から息を通す"},"l":{"hanzi":"勒","pinyin":"lè","ipa":"[l]","cue":"舌の両側へ","tip":"舌先をつけたまま、舌の両側から息を通して声を出します。","title":"舌先をつけたまま、両側へ","sub":"舌の両側に通り道を残して、声を出す"}};
  var staticArtRoot=new URL('../assets/articulation/',lessonScript&&lessonScript.src?lessonScript.src:new URL('js/',document.baseURI).href).href;
  var staticGuides={
    d:{title:'つける → 離す',labels:['つける','離す'],notes:['舌先で息を止める','ぱっと離す・強い息なし'],alts:['d：舌先が上あごの手前に接触して、口の通り道をふさいだ断面図','d：舌先が離れ、口から短い気流が出る断面図']},
    t:{title:'つける → 強い息',labels:['つける','強い息'],notes:['d と同じ場所につける','離すときに強い息'],alts:['t：d と同じ位置で舌先が接触して、口の通り道をふさいだ断面図','t：舌先が離れ、強い気流が口から出る断面図']},
    n:{title:'舌先はつけたまま、鼻へ',labels:['舌の位置','鼻へ'],notes:['口の通り道をふさぐ','鼻の通り道へ息を通す'],alts:['n：舌先が接触し、口の通り道をふさいだ断面図','n：口の通り道を閉じたまま、気流が鼻の中を通る側面図']},
    l:{title:'舌先はつけたまま、両側へ',labels:['舌の位置','両側へ'],notes:['舌先を上あごにつける','舌の両側へ・少し上から'],alts:['l：舌先が上あごの手前に接触している断面図','l：正面の少し上から見て、舌の両側のすき間を気流が通る図']}
  };
  var staticStyles='#kidsInitialsDTNLLesson .dtnl-static-guide{box-sizing:border-box;margin-top:10px;padding:12px;border:1px solid rgba(76,131,106,.12);border-radius:20px;background:linear-gradient(145deg,#fffefb,#fbfdf8);min-width:0;max-width:100%;overflow:hidden}#kidsInitialsDTNLLesson .dtnl-static-head{display:grid;grid-template-columns:36px minmax(0,1fr);gap:9px;align-items:center;margin-bottom:9px}#kidsInitialsDTNLLesson .dtnl-static-letter{display:grid;place-items:center;width:36px;height:36px;border-radius:12px;background:#eaf6ed;color:#2f7a64;font-size:27px;font-weight:900}#kidsInitialsDTNLLesson .dtnl-static-head small{display:block;font-size:12px;line-height:1.4;color:#73897c;font-weight:800}#kidsInitialsDTNLLesson .dtnl-static-head h3{margin:2px 0 0;color:#295f4e;font-size:15px;line-height:1.4;font-weight:900}#kidsInitialsDTNLLesson .dtnl-static-views{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;max-width:320px;margin:0 auto}#kidsInitialsDTNLLesson .dtnl-static-view{box-sizing:border-box;margin:0;min-width:0;overflow:hidden;border-radius:16px;background:#fff8f2;border:1px solid #eeded4}#kidsInitialsDTNLLesson .dtnl-static-view strong{display:block;margin:7px 6px 4px;text-align:center;color:#34755e;font-size:13px;line-height:1.4}#kidsInitialsDTNLLesson .dtnl-static-view img{display:block;width:100%;height:auto;aspect-ratio:1;object-fit:cover;background:#fff8f2}#kidsInitialsDTNLLesson .dtnl-static-view:first-child img{object-position:left center}#kidsInitialsDTNLLesson .dtnl-static-view:last-child img{object-position:right center}#kidsInitialsDTNLLesson .dtnl-static-view figcaption{box-sizing:border-box;padding:6px 7px 8px;min-height:3.6em;text-align:center;font-size:13px;line-height:1.45;color:#637c6d;font-weight:800}#kidsInitialsDTNLLesson .dtnl-art-copy{min-width:0;text-align:center}#kidsInitialsDTNLLesson .dtnl-art-copy em{margin:0;font-size:12px;padding:5px 10px}#kidsInitialsDTNLLesson .dtnl-static-image{position:relative}#kidsInitialsDTNLLesson .dtnl-static-label{position:absolute;right:12%;font-size:12px;line-height:1.3;font-weight:800;pointer-events:none}#kidsInitialsDTNLLesson .dtnl-static-label.is-roof{top:20%;color:#95745f}#kidsInitialsDTNLLesson .dtnl-static-label.is-tongue{bottom:17%;color:#b36f65}#kidsInitialsDTNLLesson .dtnl-static-view figcaption{min-height:4.4em}@media(max-width:360px){#kidsInitialsDTNLLesson .dtnl-static-view figcaption{min-height:5.5em}}';
  function ensureStaticStyles(){
    if(document.getElementById('dtnlStaticLayout99'))return;
    var style=document.createElement('style');style.id='dtnlStaticLayout99';style.textContent=staticStyles;document.head.appendChild(style);
  }
  function renderStaticGuide(letter){var section=el('dtnlStaticGuide');if(!section){section=document.createElement('section');section.id='dtnlStaticGuide';el('dtnlArticulation').insertAdjacentElement('afterend',section)}section.innerHTML='<details><summary>舌・息の基本図を見る</summary>'+window.KP134.mechanism(letter,'dtnl-static-'+letter)+'<p>'+window.KP134.data[letter].tip+'</p></details>'}
  var quizHeard=false,recordings={};var selected='d',quizOrder=['d','t','n','l'],quizIndex=0,quizScore=0,quizAnswered=false,recorder=null,stream=null,chunks=[],recordingUrl='',playback=null;
  function el(id){return document.getElementById(id)}
  function speakFallback(item){
    try{
      if(!('speechSynthesis' in window))return;
      speechSynthesis.cancel();var utterance=new SpeechSynthesisUtterance(item.hanzi);
      utterance.lang='zh-CN';utterance.rate=.78;utterance.pitch=1;speechSynthesis.speak(utterance);
    }catch(e){}
  }
  function playGuide(letter,forQuiz){var root=el('kidsInitialsDTNLLesson');if(forQuiz){quizHeard=false;el('dtnlQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=true})}return window.KP134.play(letter,{root:root,onEnded:function(){if(forQuiz){quizHeard=true;el('dtnlQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=false})}},onError:function(){el(forQuiz?'dtnlQuizFeedback':'dtnlPracticeFeedback').textContent='音声を読み込めませんでした。もう一度押してね。'}}).catch(function(){return null})}
  function setStep(n){document.querySelectorAll('.dtnl-progress span').forEach(function(x){var k=Number(x.dataset.dtnlStep);x.classList.toggle('is-current',k===n);x.classList.toggle('is-done',k<n)})}
  // The anterior tongue rises with a gentle S-like transition.
  // Posterior contours at x >= 74 are identical in every animation frame.
  // Small fixed mouth opening; all paths share command counts for smooth SMIL.
  function diagram(letter){
    // 10.108.99: lips follow the open facial contour; tongue geometry is preserved from 84.
    var hold=letter==='n'||letter==='l',id='dtnl75-'+letter+'-';
    var rest='M126 49 C111 49 91 49 78 48 C64 47 52 47 46 44 C42 42 43 38.5 49 38 C55 37.5 61 40 66 41 C69 41.5 70 41.8 74 42 C88 43.5 107 43.8 126 43.8 Z';
    var touch='M126 49 C111 49 91 49 78 48 C64 47 52 43 46 39 C42 36 42 34 48 34 C54 34 61 32.5 66 36.5 C69 39 70 41 74 42 C88 43.5 107 43.8 126 43.8 Z';
    var hRest='M46 41 C44 38.5 50 38 55 39',hTouch='M46 37 C44 34 50 34 55 33.7';
    var times=hold?'0;.24;.78;.90;1':'0;.24;.46;.52;1';
    function morph(v){return '<animate attributeName="d" values="'+v.join(';')+'" keyTimes="'+times+'" dur="3.6s" repeatCount="indefinite"/>'}
    function pulse(v,t){return '<animate attributeName="opacity" values="'+v+'" keyTimes="'+t+'" dur="3.6s" repeatCount="indefinite"/>'}
    var heldPulse=pulse('0;0;.85;.85;0;0','0;.25;.33;.72;.83;1');
    // Materials only: each gradient stays inside the existing anatomical path.
    var materials='<radialGradient id="'+id+'skin" cx="30%" cy="24%" r="82%"><stop offset="0" stop-color="#fff8ea"/><stop offset=".32" stop-color="#fae9d6"/><stop offset=".72" stop-color="#edcbb0"/><stop offset="1" stop-color="#dbb497"/></radialGradient>'
      +'<linearGradient id="'+id+'cavity" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d5af96"/><stop offset=".2" stop-color="#efd5bc"/><stop offset=".55" stop-color="#fff3e2"/><stop offset=".82" stop-color="#f1dcc5"/><stop offset="1" stop-color="#d9b397"/></linearGradient>'
      +'<linearGradient id="'+id+'palate" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b99177"/><stop offset=".45" stop-color="#d0ab8e"/><stop offset="1" stop-color="#e6cbb0"/></linearGradient>'
      +'<linearGradient id="'+id+'lip" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#f0b8a7"/><stop offset=".52" stop-color="#df9682"/><stop offset="1" stop-color="#bd7966"/></linearGradient>'
      +'<radialGradient id="'+id+'tooth" cx="35%" cy="28%" r="80%"><stop offset="0" stop-color="#fffef7"/><stop offset=".52" stop-color="#fcf5e6"/><stop offset="1" stop-color="#e4d5b8"/></radialGradient>'
      +'<radialGradient id="'+id+'nasal" cx="28%" cy="23%" r="92%"><stop offset="0" stop-color="#f5f7ed"/><stop offset=".6" stop-color="#e1eadd"/><stop offset="1" stop-color="#becfbb"/></radialGradient>';

    materials += '<radialGradient id="'+id+'gum" cx="40%" cy="26%" r="88%"><stop offset="0" stop-color="#f5deca"/><stop offset=".52" stop-color="#e7c4aa"/><stop offset="1" stop-color="#cda489"/></radialGradient>';
    materials += '<radialGradient id="'+id+'archTooth" cx="62%" cy="72%" r="82%"><stop offset="0" stop-color="#fffef7"/><stop offset=".52" stop-color="#fcf5e6"/><stop offset="1" stop-color="#dfcfb0"/></radialGradient>';
    materials += '<linearGradient id="'+id+'archBed" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#eccbb2"/><stop offset="1" stop-color="#cca58a"/></linearGradient>';
    materials += '<linearGradient id="'+id+'airPaint" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#558c70"/><stop offset=".5" stop-color="#6aab8b"/><stop offset="1" stop-color="#80b397"/></linearGradient>';
    materials += '<linearGradient id="'+id+'frontBlade" gradientUnits="userSpaceOnUse" x1="0" y1="126" x2="0" y2="116"><stop offset="0" stop-color="#e9b099"/><stop offset=".55" stop-color="#dc997f"/><stop offset="1" stop-color="#c77e68"/></linearGradient>';

    materials += '<clipPath id="'+id+'dentalArchClip"><path d="M26 161 L26 137 Q26 111 72 111 Q118 111 118 137 L118 161 L108 161 L108 136 Q108 121 72 121 Q36 121 36 136 L36 161Z"/></clipPath>';

    var oral='<path class="td73-cavity" fill="url(#'+id+'cavity)" d="M35 34 Q68 24.6 125 30.6 L131 49.8 Q95 56.2 38 51 L35 47 Z"/>'
      +'<path class="td73-palate" fill="none" stroke="url(#'+id+'palate)" stroke-width="5" stroke-linecap="round" d="M36 32.2 Q39 31.2 42 31.8 Q48 33.8 59 31 Q91 25.4 125 30.6"/>'
      +'<path class="td83-mouth-floor" fill="none" stroke="url(#'+id+'palate)" stroke-width="2.5" stroke-linecap="round" d="M34 51.4 C54 54.6 86 56.2 126 51.8"/>'
      +'<g class="td106-lower-dental"><path class="td106-gingiva" fill="url(#'+id+'gum)" d="M29 49.2 Q32 48.4 35.9 48.7 Q39 48.1 43 49.5 Q53 52.7 63 52.9 L63 55 Q45 55.1 34.2 53.4 Q31.7 53 29 49.2Z"/><path class="td73-lower-teeth" fill="url(#'+id+'tooth)" stroke="#cfc4b7" stroke-width="1.2" d="M37.3 45.9 Q38.5 45.9 39.7 46.5 Q40.7 47 41.2 48.3 L41.4 50.8 Q41.4 51.5 40.2 51.4 L37.5 50.8 Q36.8 50.7 36.5 49.7 L35.9 47 Q35.8 46 37.3 45.9Z"/><path class="td106-dental-root-light" d="M37.1 47.5 L39.9 47.8"/></g>'
      +'<path class="td106-gingiva" fill="url(#'+id+'gum)" d="M29 31.2 Q31 29.5 35.7 29 Q40.2 28.2 44.2 30.2 Q50 32.7 59 29.7 L61 32.6 Q51 34.3 42.2 33.6 Q38 32.7 34.7 33.5 Q31 34 29 31.2Z"/>'
      +'<path class="td73-tongue" stroke="#cf7069" stroke-width="1" stroke-linejoin="round" d="'+rest+'" fill="url(#'+id+'tongue)">'+morph([rest,touch,touch,rest,rest])+'</path>'
      +'<path class="td73-tongue-highlight" fill="none" stroke="#ffe0d7" stroke-width="2.1" stroke-linecap="round" d="'+hRest+'">'+morph([hRest,hTouch,hTouch,hRest,hRest])+'</path>'
      +'<g class="td106-upper-dental"><path class="td73-upper-teeth" fill="url(#'+id+'tooth)" stroke="#cfc4b7" stroke-width="1.2" d="M38.4 29.8 C39.8 29.6 41.2 30.1 41.6 31.1 L40.7 35.9 Q40.3 37.2 39.1 37.1 L36.3 36.6 Q35.6 36.3 35.9 35.1 L37.2 31 Q37.6 30 38.4 29.8Z"/><path class="td106-dental-root-light" d="M37.2 31.8 Q38.5 31.4 39.8 31.8"/></g>'
      +'<path class="td73-upper-lip" fill="url(#'+id+'lip)" d="M29 31.2 C28 32 26.3 32.6 26 33.3 C29.6 34.1 33.2 34.2 36 33.8 C34.6 32.9 31.8 32 29 31.2Z"/>'
      +'<path class="td73-lower-lip" fill="url(#'+id+'lip)" d="M26 47.4 C29 46.7 33 47 36 47.6 C33.5 48.2 31.9 49 30 49.4 C28.5 49.1 27 48.4 26 47.4Z"/>'
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
        +'<path class="td106-arch-gum" fill="url(#'+id+'gum)" d="M23 161 L23 137 Q23 108 72 108 Q121 108 121 137 L121 161 Q121 164 117 164 L108 164 L108 136 Q108 121 72 121 Q36 121 36 136 L36 164 L27 164 Q23 164 23 161Z"/><path class="td106-dental-arch" fill="url(#'+id+'tooth)" stroke="#d1b7a5" stroke-width="1.5" d="M26 158 L26 137 Q26 111 72 111 Q118 111 118 137 L118 158 Q118 161 115 161 L108 161 L108 136 Q108 121 72 121 Q36 121 36 136 L36 161 L29 161 Q26 161 26 158Z"/>'
        +'<g class="td106-arch-crowns" clip-path="url(#'+id+'dentalArchClip)"><path d="M55 114 Q54 112 58 111.6 L69.5 110.9 Q71.5 111 71.5 113 L71.5 121.2 Q63 120.5 56.5 122.2Z"/><path d="M72.5 113 Q72.5 111 74.5 110.9 L86 111.6 Q90 112 89 114 L87.5 122.2 Q81 120.5 72.5 121.2Z"/><g><path d="M38.8 119.5 Q40.4 116.2 44 114.9 L51.8 112.9 Q54 112.6 54.4 114.5 L56.2 122.4 Q49.4 124 45 129.1 L39.2 124.4 Q37.7 123 38.8 119.5Z"/><path d="M29.1 130.5 Q29.5 125.6 32.8 122.4 L38.6 117.3 Q40.1 116.2 41.1 118.1 L44.8 128.8 Q40.4 132.6 38.7 138.2 L31.8 136.1 Q28.9 135.2 29.1 130.5Z"/><path d="M26.6 138.2 Q26.6 135.6 29.1 135.4 L36.5 137.1 Q38 137.5 37.6 139.4 L36.3 147.1 L27.8 147.1 Q26.3 146.8 26.5 144.8Z"/><path d="M26.3 149 Q26.3 147.5 28.2 147.5 L35 147.5 Q36.5 147.5 36.2 149.4 L35.8 158.7 Q35.8 160.5 34.2 160.5 L28.1 160.5 Q26.3 160.5 26.3 158.5Z"/></g><g transform="translate(144 0) scale(-1 1)"><path d="M38.8 119.5 Q40.4 116.2 44 114.9 L51.8 112.9 Q54 112.6 54.4 114.5 L56.2 122.4 Q49.4 124 45 129.1 L39.2 124.4 Q37.7 123 38.8 119.5Z"/><path d="M29.1 130.5 Q29.5 125.6 32.8 122.4 L38.6 117.3 Q40.1 116.2 41.1 118.1 L44.8 128.8 Q40.4 132.6 38.7 138.2 L31.8 136.1 Q28.9 135.2 29.1 130.5Z"/><path d="M26.6 138.2 Q26.6 135.6 29.1 135.4 L36.5 137.1 Q38 137.5 37.6 139.4 L36.3 147.1 L27.8 147.1 Q26.3 146.8 26.5 144.8Z"/><path d="M26.3 149 Q26.3 147.5 28.2 147.5 L35 147.5 Q36.5 147.5 36.2 149.4 L35.8 158.7 Q35.8 160.5 34.2 160.5 L28.1 160.5 Q26.3 160.5 26.3 158.5Z"/></g></g>'
        +'<g class="td106-tooth-divisions" stroke="#ddc4b6" stroke-width="1"><path d="M53 113 L56 122 M72 111 V121 M91 113 L88 122 M35 120 L41 128 M109 120 L103 128 M27 135 L37 138 M117 135 L107 138"/></g>'
        +'<path fill="url(#'+id+'frontTongue)" stroke="#cf7069" stroke-width="1.1" d="M49 164 Q46 143 54 135 Q58 131 60 125 Q61 119 66 118 Q72 116 78 118 Q83 119 84 125 Q86 131 90 135 Q98 143 95 164 C83 168 61 168 49 164Z"/>'
        +'<path class="td112-tongue-furrow" d="M72 158 Q70.8 148 72 138"/>'
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
    return '<span class="dtnl73-diagram is-'+letter+'" aria-hidden="true" style="display:block;width:144px;height:198px;overflow:hidden"><svg class="dtnl73-svg" width="124" height="198" viewBox="'+(letter==='l'?'0 0 144 230':'0 0 144 154')+'" focusable="false" data-letter="'+letter+'" style="--dtnl-front-blade:url(#'+id+'frontBlade);--dtnl-arch-tooth:url(#'+id+'archTooth);--dtnl-arch-bed:url(#'+id+'archBed);--dtnl-air-paint:url(#'+id+'airPaint);--dtnl-gum:url(#'+id+'gum);--dtnl-cavity:url(#'+id+'cavity);--dtnl-palate:url(#'+id+'palate);--dtnl-tooth:url(#'+id+'tooth);--dtnl-lip:url(#'+id+'lip)"><defs><radialGradient id="'+id+'tongue" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform="translate(52 34) scale(78 22)"><stop offset="0" stop-color="#f6c7b3"/><stop offset=".35" stop-color="#edac95"/><stop offset=".74" stop-color="#d68c76"/><stop offset="1" stop-color="#bb7762"/></radialGradient><radialGradient id="'+id+'frontTongue" gradientUnits="userSpaceOnUse" cx="80" cy="159" r="54"><stop offset="0" stop-color="#f6c7b3"/><stop offset=".35" stop-color="#edac95"/><stop offset=".74" stop-color="#d68c76"/><stop offset="1" stop-color="#bb7762"/></radialGradient>'+materials+'</defs>'+scene+'</svg><span class="kp105-view-label">'+(letter==='n'?'鼻の通り道':'横から見た図')+'</span></span>';
  }
  function renderFocus(){var it=guide[selected];el('dtnlFocusLetter').textContent=selected;el('dtnlFocusGuide').textContent=window.KP134.data[selected].roman+'（1声・呼読音） · '+it.ipa;el('dtnlFocusTip').textContent=window.KP134.data[selected].tip;var act=el('dtnlActions');act.replaceChildren();var a=document.createElement('button');a.type='button';a.className='dtnl-guide-btn';a.textContent='▶ お手本（'+window.KP134.data[selected].roman+'）';a.onclick=function(){playGuide(selected)};act.append(a);window.KP135.park(el('kidsInitialsDTNLLesson'),'dtnl');el('dtnlArticulation').dataset.build='10.108.112';el('dtnlArticulation').innerHTML=window.KP134.panel(selected,'dtnl');window.KP135.mount(el('kidsInitialsDTNLLesson'),'dtnl',selected);var svg=el('dtnlArticulation').querySelector('svg');if(svg&&window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){svg.pauseAnimations();svg.setCurrentTime(1.1)}renderStaticGuide(selected)}
  function select(letter,listen){if(window.KP134.isRecording(el('kidsInitialsDTNLLesson')))return;recordingUrl=recordings[letter]||'';el('dtnlPlayback').disabled=!recordingUrl;selected=letter;document.querySelectorAll('.dtnl-letter-card,.dtnl-free-choice button').forEach(function(x){x.classList.toggle('is-active',x.dataset.letter===letter)});renderFocus();if(listen)playGuide(letter)}
  function renderLetters(){var grid=el('dtnlLetterGrid'),free=el('dtnlFreeChoice');if(!grid||!free)return;grid.replaceChildren();free.replaceChildren();letters.forEach(function(letter){var it=guide[letter],b=document.createElement('button');b.type='button';b.className='dtnl-letter-card';b.dataset.letter=letter;b.innerHTML='<span class="big">'+letter+'</span><span class="ipa">'+it.ipa+'</span>';b.onclick=function(){setStep(2);select(letter,true)};grid.appendChild(b);var f=document.createElement('button');f.type='button';f.dataset.letter=letter;f.textContent=letter;f.onclick=function(){setStep(3);select(letter,true)};free.appendChild(f)});select('d',false)}
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
  function toggleRecord(){window.KP134.capture(el('kidsInitialsDTNLLesson'),el('dtnlRecord'),el('dtnlPlayback'),selected,el('dtnlPracticeFeedback'),function(key,url){if(recordings[key]&&recordings[key]!==url)URL.revokeObjectURL(recordings[key]);recordings[key]=url;recordingUrl=url})}
  async function playRecording(){var url=recordings[selected];if(!url)return;try{await window.KP134.play(selected,{root:el('kidsInitialsDTNLLesson'),clipUrl:url,rate:1,referenceVisual:false,onError:function(){el('dtnlPracticeFeedback').textContent='録音を再生できませんでした。もう一度押してね。'}})}catch(e){}}
  function renderQuiz(){var box=el('dtnlQuizChoices');box.replaceChildren();letters.forEach(function(letter){var b=document.createElement('button');b.type='button';b.textContent=letter;b.onclick=function(){answer(letter,b)};box.appendChild(b)});el('dtnlQuizCount').textContent=(quizIndex+1)+' / '+quizOrder.length;el('dtnlQuizFeedback').textContent='';el('dtnlQuizFeedback').className='dtnl-feedback';el('dtnlQuizNext').hidden=true;quizAnswered=false;quizHeard=false;box.querySelectorAll('button').forEach(function(b){b.disabled=true})}
  function answer(letter,button){if(quizAnswered||!quizHeard)return;quizAnswered=true;el('dtnlQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=true});var right=quizOrder[quizIndex],fb=el('dtnlQuizFeedback');if(letter===right){quizScore++;button.classList.add('is-correct');fb.textContent='いい耳！ '+right+' だよ ✓';fb.className='dtnl-feedback is-good'}else{button.classList.add('is-wrong');Array.from(el('dtnlQuizChoices').children).forEach(function(x){if(x.textContent===right)x.classList.add('is-correct')});fb.textContent='今回は '+right+'。舌先と息の違いをもう一度見よう';fb.className='dtnl-feedback is-bad'}var next=el('dtnlQuizNext');if(quizIndex===quizOrder.length-1){next.hidden=true;window.setTimeout(function(){if(quizAnswered)finish()},650)}else{next.hidden=false;next.textContent='次の問題へ →'}}
  function nextQuiz(){if(!quizAnswered)return;if(quizIndex<quizOrder.length-1){quizIndex++;renderQuiz();playGuide(quizOrder[quizIndex],true);return}finish()}
  function finish(){var pass=quizScore>=3,res=el('dtnlResult');if(pass){try{localStorage.setItem('koepandaInitialP4Complete','1');window.dispatchEvent(new CustomEvent('koepandaInitialProgressChanged',{detail:{P4:true}}))}catch(e){}}el('dtnlQuizPanel').hidden=true;res.hidden=false;var badge=el('dtnlResultBadge');badge.textContent=pass?'✓':'↻';badge.className='dtnl-result-badge '+(pass?'':'is-retry');el('dtnlResultScore').textContent='4問中 '+quizScore+'問正解';el('dtnlResultMessage').textContent=pass?'舌先の場所と、息・鼻・左右の通り道をつかめたよ。':'もう一度ゆっくり聞き比べよう。';var a=el('dtnlResultAction');a.textContent=pass?'レッスン一覧へ戻る':'もう一度チェックする';a.onclick=pass?function(){var back=document.getElementById('pinyinLessonBack');if(back)back.click()}:function(){quizIndex=0;quizScore=0;res.hidden=true;el('dtnlQuizPanel').hidden=false;renderQuiz();setStep(4)};var celebration={score:quizScore,total:quizOrder.length,passed:pass,title:pass?'ミニチェック合格！':'あと一歩！',message:pass?(quizScore===quizOrder.length?'d・t・n・l、4問ぜんぶ正解！ 舌先と息の違いをしっかり聞き分けられたよ。':'d・t・n・l の違いがつかめたよ。あと1問で満点！'):'苦手な音を聞き直して、もう一度挑戦しよう。'};if(window.koepandaAttachResultReplay)window.koepandaAttachResultReplay(res,celebration);if(!window.KP134.lessonVisible(el('kidsInitialsDTNLLesson')))return;if(window.koepandaQueueResultCelebration)window.koepandaQueueResultCelebration(celebration,90);else if(window.koepandaShowResultCelebration)window.setTimeout(function(){window.koepandaShowResultCelebration(celebration)},90)}
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
    if(!el('kidsInitialsDTNLLesson'))return;window.KP134.attach(el('kidsInitialsDTNLLesson'),letters);
    wireLessonButtonFeedback(el('kidsInitialsDTNLLesson'));
    renderLetters();
    var practice=document.querySelector('#kidsInitialsDTNLLesson .dtnl-practice-panel');
    if(practice)practice.hidden=false;
    el('dtnlQuizPanel').hidden=true;el('dtnlResult').hidden=true;
    el('dtnlPlayback').disabled=true;el('dtnlToQuiz').disabled=false;
    el('dtnlRecord').onclick=toggleRecord;
    el('dtnlPlayback').onclick=playRecording;
    el('dtnlToQuiz').onclick=function(){
      el('dtnlResult').hidden=true;setStep(4);quizIndex=0;quizScore=0;quizOrder=window.KP134.shuffle(letters);if(practice)practice.hidden=true;el('dtnlQuizPanel').hidden=false;renderQuiz();
      requestAnimationFrame(function(){el('dtnlQuizPanel').scrollIntoView({block:'start',behavior:'smooth'})})
    };
    el('dtnlQuizListen').onclick=function(){playGuide(quizOrder[quizIndex],true)};el('dtnlQuizNext').onclick=nextQuiz
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
