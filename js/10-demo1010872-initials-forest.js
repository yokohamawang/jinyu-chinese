/* 10.108.134 — same-speaker native helper syllables; shared pronunciation studio. */
(function(){
  var letters=['b','p','m','f'];
  var sounds={
    b:{mark:'[p]',label:'無気音',desc:'母音を足さず、くちびるを閉じて一瞬だけ開く'},
    p:{mark:'[pʰ]',label:'有気音',desc:'母音を足さず、同じ口の形で開く瞬間に強く息を出す'},
    m:{mark:'[m]',label:'鼻音',desc:'母音を足さず、くちびるを閉じたまま鼻に短く響かせる'},
    f:{mark:'[f]',label:'摩擦音',desc:'母音を足さず、上の歯を下くちびるに軽く当てて細く息を流す'}
  };
  var guide={
    b:{hanzi:'波',pinyin:'bō'},
    p:{hanzi:'泼',pinyin:'pō'},
    m:{hanzi:'摸',pinyin:'mō'},
    f:{hanzi:'佛',pinyin:'fó'}
  };
  var tips={
    b:'くちびるを閉じる → 一瞬だけ開く。母音を足さない（無気音）',
    p:'b と同じ口 → 開く瞬間に強く息を出す（有気音）',
    m:'くちびるを閉じたまま、鼻から「んー」と響かせる',
    f:'上の歯を下くちびるに軽く当て、そのすき間から細い息を流す'
  };
  var focusVisuals={
    b:{title:'両くちびるを閉じる',sub:'開く瞬間は、息を弱く',kind:'b',air:'弱い息'},
    p:{title:'両くちびるを閉じる',sub:'開く瞬間に、息を強く',kind:'p',air:'強い息'},
    m:{title:'くちびるは閉じたまま',sub:'音は鼻へ響かせる',kind:'m',air:'鼻に響く'},
    f:{title:'上の歯を下くちびるへ',sub:'軽くふれたまま、細い息を流す',kind:'f',air:'細い息'}
  };
  var quizHeard=false,recordings={};var selected='b', ctx=null, activeNodes=[], recorder=null, stream=null, chunks=[], recordingUrl='', playback=null, modelAudio=null;
  var soundFiles={};
  var quizOrder=['p','m','b','f'], quizIndex=0, quizAnswered=false, quizScore=0;

  function el(id){return document.getElementById(id)}
  
  function stopAudio(){if(window.KP134)window.KP134.stopFor(el('kidsInitialsLesson'));
    activeNodes.forEach(function(n){try{n.stop&&n.stop()}catch(e){} try{n.disconnect&&n.disconnect()}catch(e){}});
    activeNodes=[];
  }
  
  
  
  
  
  
  function play(letter){return playGuide(letter)}
  function playGuide(letter,forQuiz){stopAudio();var root=el('kidsInitialsLesson'),button=el(forQuiz?'initialsQuizListen':'initialsToneButtons');if(button&&button.tagName!=='BUTTON')button=button.querySelector('button');function clear(){if(button){button.classList.remove('is-playing');button.removeAttribute('aria-busy')}}if(forQuiz){quizHeard=false;el('initialsQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=true})}return window.KP134.play(letter,{root:root,button:button,onPlaying:function(){if(button)button.classList.add('is-playing')},onCancel:clear,onEnded:function(){clear();if(forQuiz){quizHeard=true;el('initialsQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=false})}},onError:function(){clear();var fb=el(forQuiz?'initialsQuizFeedback':'initialsImitateFeedback');if(fb)fb.textContent='音声を読み込めませんでした。もう一度押してね。'}}).catch(function(){return null})}
  function setStep(n){
    document.querySelectorAll('.initials-progress span').forEach(function(x){
      var k=Number(x.dataset.initialStep);
      x.classList.toggle('is-current',k===n);
      x.classList.toggle('is-done',k<n)
    })
  }
  // 10.108.79: one scoped front nose; no side-panel renderer.
  function noseSvg(id,nasal){
    var body='<defs><linearGradient id="IDskin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0e0"/><stop offset=".5" stop-color="#f3dac6"/><stop offset="1" stop-color="#dcb99f"/></linearGradient><radialGradient id="IDglow"><stop offset="0" stop-color="#8bc3af" stop-opacity=".28"/><stop offset="1" stop-color="#8bc3af" stop-opacity="0"/></radialGradient></defs>GLOW<g class="kp71-nose-body" opacity=".88"><path d="M26 25 C20 21 13 26 13 34 C13 42 21 44 29 40 M46 25 C52 21 59 26 59 34 C59 42 51 44 43 40" fill="url(#IDskin)" stroke="#dfc5b0" stroke-width=".8"/><path d="M30 6 C32 2 40 2 42 6 C42 13 41 20 44 26 C47 29 49 33 46 38 C42 44 30 44 26 38 C23 33 25 29 28 26 C31 20 30 13 30 6Z" fill="url(#IDskin)"/><path d="M33 9 Q31 21 31 27" fill="none" stroke="#fff4ec" stroke-width="2" stroke-linecap="round" opacity=".34"/><ellipse cx="36" cy="32" rx="7.3" ry="4.6" fill="#fff0df" opacity=".34"/><ellipse cx="23" cy="36.5" rx="4.2" ry="2.2" transform="rotate(14 23 36.5)" fill="#af8d75"/><ellipse cx="49" cy="36.5" rx="4.2" ry="2.2" transform="rotate(-14 49 36.5)" fill="#af8d75"/><path d="M30 40 Q36 43 42 40" fill="none" stroke="#cbaa91" stroke-width="1" stroke-linecap="round"/></g>';
    body=body.replace('</g>','<path d="M31 44 Q32 49 29 55 M41 44 Q40 49 43 55" fill="none" stroke="#b18b71" stroke-width="1.3" stroke-linecap="round" opacity=".12"/></g>');
    body=body.replace(/ID/g,id).replace('GLOW',nasal?'<ellipse class="kp71-nasal-glow" cx="36" cy="27" rx="35" ry="26" fill="url(#'+id+'glow)"/>':'');
    return '<svg class="kp71-front-nose'+(nasal?' is-nasal':'')+'" viewBox="0 0 72 58" aria-hidden="true">'+body+'</svg>';
  }
  // 10.108.96: versioned stylesheet and renderer-owned static layout fallback.
  var lessonScriptUrl=document.currentScript?document.currentScript.src:document.baseURI;
  var lessonCssUrl=new URL('../css/68-demo1010872-initials-forest.css?v=10.108.110',lessonScriptUrl).href;
  var lessonCss=document.getElementById('demo1010808-initials-forest');
  if(!lessonCss){lessonCss=document.createElement('link');lessonCss.id='demo1010808-initials-forest';lessonCss.rel='stylesheet';document.head.appendChild(lessonCss)}
  if(lessonCss.href!==lessonCssUrl)lessonCss.href=lessonCssUrl;
  var staticLayout=document.createElement('style');staticLayout.id='initialStaticLayout97';
  staticLayout.textContent="/* 10.108.87 — static f posture card follows the existing animation. */\n#kidsInitialsLesson #initialStaticExplainer[hidden]{display:none!important}\n#kidsInitialsLesson #initialStaticExplainer{grid-column:1/-1;margin-top:14px;padding:16px;border:1px solid rgba(78,135,106,.13);border-radius:23px;background:linear-gradient(145deg,#fffefb,#fffdf8 70%,#f5faf3);box-shadow:0 7px 20px rgba(65,99,79,.055)}\n#initialStaticExplainer .initial-static-head{display:flex;align-items:center;gap:10px}\n#initialStaticExplainer .initial-static-head>span{display:grid;place-items:center;flex:0 0 42px;width:42px;height:42px;border-radius:15px;background:linear-gradient(145deg,#e3f3e8,#f0f8ec);color:#2f765b;font-size:31px;line-height:1;font-weight:900;box-shadow:inset 0 0 0 1px rgba(69,137,98,.07)}\n#initialStaticExplainer .initial-static-head small{display:block;font-size:12px;font-weight:800;color:#719080;letter-spacing:.025em}\n#initialStaticExplainer h3{margin:3px 0 0;color:#2b6652;font-size:17px;line-height:1.5;font-weight:900}\n#initialStaticExplainer .initial-static-intro{margin:10px 0 13px;color:#708479;font-size:13px;line-height:1.7;font-weight:700}\n#initialStaticExplainer .initial-static-views{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px}\n#initialStaticExplainer figure{position:relative;margin:0;min-width:0;overflow:hidden;border-radius:20px;background:linear-gradient(180deg,#fffaf6,#fff4ec);box-shadow:inset 0 0 0 1px rgba(186,129,103,.16)}\n#initialStaticExplainer figcaption{position:relative;z-index:1;display:table;margin:10px 0 0 10px;padding:4px 10px;border-radius:99px;background:#edf6ef;color:#346b56;font-size:13px;line-height:1.4;font-weight:900;box-shadow:inset 0 0 0 1px rgba(55,124,81,.06)}\n#initialStaticExplainer img{display:block;width:100%;height:auto;margin:0;box-shadow:none;border:0;transform:none;animation:none}\n#initialStaticExplainer figure p{margin:0;padding:9px 7px 13px;color:#596f64;text-align:center;font-size:13px;line-height:1.6;font-weight:800;background:linear-gradient(180deg,rgba(255,251,248,.6),#fffaf5)}\n#initialStaticExplainer .initial-static-summary{margin-top:13px;text-align:center}\n#initialStaticExplainer .initial-static-summary b{display:block;color:#2b6953;font-size:16px;line-height:1.6;font-weight:900}\n#initialStaticExplainer .initial-static-summary small{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;column-gap:6px;row-gap:4px;margin-top:7px;color:#7b8b80;font-size:11px;line-height:1.5;font-weight:700}\n#initialStaticExplainer .contact{width:9px;height:9px;border:1.5px solid #d8aa53;border-radius:50%;background:#f7e5bf}\n#initialStaticExplainer .air{width:17px;height:0;border-top:2px dashed #4b9caf;margin-left:9px}\n@media(max-width:360px){#kidsInitialsLesson #initialStaticExplainer{padding:12px}#initialStaticExplainer .initial-static-views{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px}#initialStaticExplainer h3{font-size:16px}#initialStaticExplainer figcaption{margin:8px 0 0 8px;padding:4px 8px}#initialStaticExplainer figure p{padding:8px 5px 10px}}\n\n/* 10.108.91: use one raster illustration; crop its equal panels for each view. */\n#initialStaticExplainer .initial-raster-front img,#initialStaticExplainer .initial-raster-side img{width:100%;height:auto;aspect-ratio:1;object-fit:cover;max-width:none}\n#initialStaticExplainer .initial-raster-front img{object-position:left center}\n#initialStaticExplainer .initial-raster-side img{object-position:right center}\n\n/* 10.108.92: keep the two raster views compact and side by side on phones. */\n#initialStaticExplainer .initial-static-views{max-width:320px;margin:0 auto}\n#kidsInitialsLesson #initialStaticExplainer{margin-top:12px;padding-top:14px;padding-bottom:14px}\n#initialStaticExplainer .initial-static-intro{margin:8px 0 10px}\n#initialStaticExplainer .initial-static-summary{margin-top:10px}\n\n/* 10.108.94: stable static-card height and a gentle nasal legend for b/p/m/f. */\n#initialStaticExplainer .initial-static-summary b{min-height:3.2em;display:flex;flex-wrap:wrap;align-items:center;align-content:center;justify-content:center}\n#initialStaticExplainer .initial-static-summary .nasal{width:10px;height:10px;border-radius:50%;background:#b9dfce;box-shadow:0 0 0 3px rgba(185,223,206,.20)}\n\n#initialStaticExplainer .initial-static-summary b>span{flex:0 0 auto}\n\n\n/* 10.108.96: contain intrinsic raster sizes and text within the phone card. */\n#kidsInitialsLesson #initialsToneRibbon{grid-template-columns:minmax(0,1.05fr) minmax(0,1.6fr);min-width:0}\n#kidsInitialsLesson #initialsToneRibbon>div{min-width:0}\n#kidsInitialsLesson #initialStaticExplainer{box-sizing:border-box;min-width:0;width:100%;max-width:100%;overflow:hidden}\n#initialStaticExplainer .initial-static-head>div{min-width:0}\n#initialStaticExplainer .initial-static-views{width:100%;min-width:0}\n#initialStaticExplainer figure{box-sizing:border-box;min-width:0;width:100%}\n#initialStaticExplainer img{box-sizing:border-box;min-width:0}\n@media(max-width:390px){#kidsInitialsLesson #initialsToneRibbon{grid-template-columns:minmax(0,1fr)}}\n\n/* 10.108.97: raise supporting illustrations by tightening mobile spacing. */\n@media(max-width:600px){\n #kidsInitialsLesson .initials-letter-card{min-height:120px;padding-top:10px;padding-bottom:8px}\n #kidsInitialsLesson #initialsToneRibbon{margin-top:10px;padding-top:12px;padding-bottom:12px;row-gap:9px}\n #kidsInitialsLesson #initialsFocusVisual{min-height:88px}\n #kidsInitialsLesson #initialStaticExplainer{margin-top:2px;padding-top:12px}\n #kidsInitialsLesson #initialStaticExplainer h3{line-height:1.4}\n #kidsInitialsLesson #initialStaticExplainer .initial-static-intro{margin-top:4px;margin-bottom:6px}\n}\n";
  document.head.appendChild(staticLayout);
  var staticArtRoot=new URL('../assets/articulation/',document.currentScript?document.currentScript.src:document.baseURI).href;
  // Static raster assets complement the existing animations for all four initials.
  var staticGuides={
    b:{file:'b-static-raster-94.png',version:'10.108.94',title:'両くちびるを<br>閉じて、開く',intro:'閉じる → 開くを確認。',labels:['閉じる','開く'],notes:['軽く閉じる<br>力を入れず','小さく開く<br>弱い息'],alts:['b の準備。両くちびるを軽く閉じた正面の口の形。','b の発音時。唇が小さく開き、弱い息が出る。'],summary:'閉じて、小さく開く',legend:'弱い息の目安',kind:'air'},
    p:{file:'p-static-raster-94.png',version:'10.108.94',title:'唇を開いて<br>強い息を出す',intro:'息の強さを確認。',labels:['閉じる','開く'],notes:['軽く閉じる<br>両くちびる','小さく開く<br>強い息'],alts:['p の準備。両くちびるを軽く閉じた正面の口の形。','p の発音時。唇が小さく開き、b より強い息が出る。'],summary:'開く瞬間に、強い息',legend:'b より強い息',kind:'air'},
    m:{file:'m-static-raster-94.png',version:'10.108.94',title:'唇を閉じて<br>鼻にひびかせる',intro:'唇と鼻の出口を確認。',labels:['口元','鼻へ'],notes:['唇を閉じる<br>力を入れず','鼻にひびく<br>口は閉じる'],alts:['m の口の形。両くちびるを閉じたままにする。','m の音の出口。口は閉じたまま、鼻の周りの淡い緑色と矢印で鼻から出る息を示す。'],summary:'口は閉じて、鼻にひびく',legend:'緑は鼻の出口',kind:'nasal'},
    f:{file:'f-static-raster-91.png',version:'10.108.91',title:'上の前歯を<br>下くちびるへ',intro:'ふれる位置を確認。',labels:['正面','横から'],notes:['口角を寄せ<br>小さく開く','すき間から<br>息を流す'],alts:['上の前歯が下くちびるに軽く触れる、正面からの口の形。','右が口の前。上の前歯の先が下くちびるの内側に触れ、その狭いすき間から息が出る。'],summary:'軽くふれて、細い息を流す',kind:'contact'}
  };
  function renderStaticExplainer(letter){var card=el('initialStaticExplainer');if(card)card.innerHTML='<details><summary>調音部位を静止図で確かめる</summary>'+window.KP134.mechanism(letter,'initial-static-'+letter)+'<p>'+window.KP134.data[letter].tip+'</p></details>'}
  /* Lip drawings live inside the existing moving layers; timing and placement stay native. */
  /* The illustration stays inside the verified upper/lower motion layers. */
  function lipArt(part,letter){
    var id='kp105-'+letter+'-'+part+'-',upper=part==='upper';
    var shape=upper?'M1 19 C13 14 25 13 34 8 C40 5 44 5 50 9 C56 5 60 5 66 8 C75 13 87 14 99 19 C82 22 66 21.5 50 21 C34 21.5 18 22 1 19Z':'M1 3 C18 1 35 3 50 5 C65 3 82 1 99 3 C94 17 78 27 50 27 C22 27 6 17 1 3Z';
    if(letter==='f')shape=upper?'M1 21 C16 12 33 6 50 6 C67 6 84 12 99 21 C82 29 66 31 50 31 C34 31 18 29 1 21Z':'M1 5 C20 3 34 0 50 0 C66 0 80 3 99 5 C94 17 77 27 50 28 C23 27 6 17 1 5Z';
    var edge=upper?'M4 20 C22 21.5 38 21 50 21 C62 21 78 21.5 96 20':'M4 3 C20 2 36 4 50 5 C64 4 80 2 96 3';
    if(upper&&letter==='f')edge='M4 22 C22 29 38 31 50 31 C62 31 78 29 96 22';
    if(!upper&&letter==='f')edge='M4 5 C24 2 38 0 50 0 C62 0 76 2 96 5';
    return '<svg class="kp105-lip-art" viewBox="0 0 100 '+(upper?24:30)+'" aria-hidden="true" focusable="false"><defs><linearGradient id="'+id+'paint" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="'+(upper?'#efb4a4':'#edae9c')+'"/><stop offset=".55" stop-color="'+(upper?'#df9280':'#df917e')+'"/><stop offset="1" stop-color="'+(upper?'#c77c6d':'#c97e6c')+'"/></linearGradient><radialGradient id="'+id+'light" cx="38%" cy="28%" r="68%"><stop offset="0" stop-color="#ffe8d9" stop-opacity=".5"/><stop offset=".55" stop-color="#ffe8d9" stop-opacity=".18"/><stop offset="1" stop-color="#ffe8d9" stop-opacity="0"/></radialGradient><clipPath id="'+id+'clip"><path d="'+shape+'"/></clipPath></defs><path d="'+shape+'" fill="url(#'+id+'paint)"/><path d="'+shape+'" fill="url(#'+id+'light)"/><g clip-path="url(#'+id+'clip)"><path d="'+edge+'" fill="none" stroke="#995e55" stroke-width=".8" stroke-linecap="round" opacity=".24"/></g></svg>';
  }

  function fDentalArt(){
    return '<svg class="kp106-dental-art" viewBox="0 0 100 36" aria-hidden="true" focusable="false"><defs><linearGradient id="kp106-f-enamel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffdf4"/><stop offset=".65" stop-color="#fcf5e8"/><stop offset="1" stop-color="#ecdec7"/></linearGradient><linearGradient id="kp106-f-gum" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8b7a0"/><stop offset="1" stop-color="#f1d1b7"/></linearGradient><linearGradient id="kp106-f-root" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#be9778" stop-opacity=".38"/><stop offset="1" stop-color="#be9778" stop-opacity="0"/></linearGradient></defs><g transform="translate(5 0) scale(.9 1)"><path fill="url(#kp106-f-gum)" d="M1 3 Q25 0 50 3 Q75 0 99 3 L99 16 Q80 14 50 15 Q20 14 1 16Z"/><path class="kp106-f-crowns" fill="url(#kp106-f-enamel)" d="M4 10 C18 6 32 7 50 8 C68 7 82 6 96 10 L94 23 Q93 28 86 28 Q77 30 68 29 Q59 32 50 31 Q41 32 32 29 Q23 30 14 28 Q7 28 6 23Z"/><path fill="url(#kp106-f-root)" d="M4 10 C18 6 32 7 50 8 C68 7 82 6 96 10 L95 14 Q76 12 50 13 Q24 12 5 14Z"/><g fill="none" stroke="#b9ab92" stroke-width=".85" stroke-linecap="round" opacity=".3"><path d="M50 10 L50 29 M28 10 Q28 18 30 26 M72 10 Q72 18 70 26"/></g><path fill="none" stroke="#fffefa" stroke-width="1.15" stroke-linecap="round" opacity=".75" d="M17 15 Q28 12 39 14 M61 14 Q72 12 83 15"/></g></svg>';
  }

  function renderFocusVisual(letter){window.KP135.park(el('kidsInitialsLesson'),'initials');var box=el('initialsFocusVisual');box.className='initials-focus-visual';box.innerHTML=window.KP134.panel(letter,'initials');window.KP135.mount(el('kidsInitialsLesson'),'initials',letter)}
  function select(letter){if(window.KP134.isRecording(el('kidsInitialsLesson')))return;recordingUrl=recordings[letter]||'';el('initialsPlayback').disabled=!recordingUrl;
    selected=letter;
    document.querySelectorAll('.initials-letter-card,.initials-free-choice button').forEach(function(b){
      b.classList.toggle('is-active',b.dataset.letter===letter)
    });
    var f=el('initialsFocusLetter'),s=el('initialsFocusSyllable'),t=el('initialsFocusTip');
    if(f)f.textContent=letter;
    if(s)s.textContent=window.KP134.data[letter].roman+'（1声・呼読音） · '+sounds[letter].mark;
    if(t)t.textContent=window.KP134.data[letter].tip;
    renderFocusVisual(letter);
    renderStaticExplainer(letter);
    renderToneButtons()
  }
  function wirePressFeedback(button){
    var releaseTimer=0;
    function press(){if(releaseTimer)clearTimeout(releaseTimer);button.classList.add('is-pressed')}
    function release(){button.classList.remove('is-pressed')}
    button.addEventListener('pointerdown',press);
    button.addEventListener('pointerup',release);
    button.addEventListener('pointercancel',release);
    button.addEventListener('pointerleave',release);
    button.addEventListener('keydown',function(event){if(event.key===' '||event.key==='Enter')press()});
    button.addEventListener('keyup',release);
    button.addEventListener('blur',release);
    button.addEventListener('click',function(){press();releaseTimer=setTimeout(release,240)});
  }
  function renderToneButtons(){
    var box=el('initialsToneButtons'); if(!box)return;
    box.replaceChildren();
    var b=document.createElement('button');
    b.type='button'; b.className='initial-guide-button'; b.textContent='▶ '+selected+' のお手本を聞く（'+window.KP134.data[selected].roman+'・呼読音）';
    wirePressFeedback(b);b.addEventListener('click',function(){playGuide(selected)});
    box.appendChild(b);
  }
  function renderLetters(){
    var g=el('initialsLetterGrid'),free=el('initialsFreeChoice'); if(!g||!free)return;
    g.replaceChildren(); free.replaceChildren();
    letters.forEach(function(letter,i){
      var b=document.createElement('button'); b.type='button'; b.className='initials-letter-card'; b.dataset.letter=letter;
      var cue={
        b:{ipa:'[p]',kind:'air air-soft',label:'息は弱く'},
        p:{ipa:'[pʰ]',kind:'air air-strong',label:'息を強く'},
        m:{ipa:'[m]',kind:'nose',label:'鼻に響く'},
        f:{ipa:'[f]',kind:'air air-thin',label:'細い息'}
      }[letter];
      var icon=letter==='m'
        ? '<span class="initial-cue-icon kp71-nose-cue" aria-hidden="true">'+noseSvg('kp71-cue-',true)+'</span>'
        : '<span class="initial-cue-icon '+cue.kind+'" aria-hidden="true"><i></i><i></i><i></i></span>';
      b.innerHTML='<span class="big">'+letter+'</span><span class="initial-ipa">'+cue.ipa+'</span>';
      b.addEventListener('click',function(){select(letter);playGuide(letter)}); g.appendChild(b);
      var c=document.createElement('button'); c.type='button'; c.dataset.letter=letter;
      c.textContent=letter;
      c.addEventListener('click',function(){setStep(3);select(letter);playGuide(letter)}); free.appendChild(c)
    });
    select('b')
  }
  function renderQuiz(){
    var box=el('initialsQuizChoices'); if(!box)return; box.replaceChildren();
    letters.forEach(function(letter){
      var b=document.createElement('button'); b.type='button'; b.textContent=letter;
      b.addEventListener('click',function(){answerQuiz(letter,b)}); box.appendChild(b)
    });
    var count=el('initialsQuizCount'); if(count)count.textContent=(quizIndex+1)+' / '+quizOrder.length;
    box.querySelectorAll('button').forEach(function(b){b.disabled=true});quizHeard=false;var fb=el('initialsQuizFeedback'); if(fb){fb.textContent='';fb.className='initials-feedback'}
    var next=el('initialsQuizNext'); if(next)next.hidden=true; quizAnswered=false
  }
  function playQuiz(){playGuide(quizOrder[quizIndex],true)}
  function answerQuiz(letter,button){
    if(quizAnswered||!quizHeard)return; quizAnswered=true;el('initialsQuizChoices').querySelectorAll('button').forEach(function(b){b.disabled=true});
    var right=quizOrder[quizIndex],fb=el('initialsQuizFeedback');
    if(letter===right){
      quizScore++; button.classList.add('is-correct');
      if(fb){fb.textContent='いい耳！ '+right+' のお手本だよ ✓';fb.className='initials-feedback is-good'}
    }else{
      button.classList.add('is-wrong');
      var rb=Array.prototype.find.call(el('initialsQuizChoices').children,function(x){return x.textContent===right});
      if(rb)rb.classList.add('is-correct');
      if(fb){fb.textContent='今回は '+right+'。呼読音の最初の音と、息の出方をもう一度比べよう';fb.className='initials-feedback is-bad'}
    }
    var next=el('initialsQuizNext');
    if(quizIndex===quizOrder.length-1){
      if(next)next.hidden=true;
      window.setTimeout(function(){if(quizAnswered)finishQuiz()},650)
    }else if(next){next.hidden=false;next.textContent='次の問題へ →'}
  }
  function nextQuiz(){
    if(!quizAnswered)return;
    if(quizIndex<quizOrder.length-1){quizIndex++;renderQuiz();playQuiz();return}
    finishQuiz()
  }
  function goBackToInitialRoad(){
    var back=document.getElementById('pinyinLessonBack');
    if(back)back.click();
    window.setTimeout(function(){
      var world=document.querySelector('.pinyin-world[data-stage-id="P3-P8"]');
      var open=world&&world.querySelector('.pinyin-world-open');
      if(open)open.click();
      window.setTimeout(function(){
        var p4=document.querySelector('.pinyin-node[data-unit-id="P4"]');
        if(p4){p4.classList.add('is-next-focus');p4.scrollIntoView({block:'center',behavior:'smooth'})}
      },90);
    },90);
  }
  function retryQuiz(){
    var panel=el('initialsQuizPanel'),result=el('initialsResult'),reward=el('initialsReward');
    if(result)result.hidden=true;if(reward)reward.hidden=true;if(panel)panel.hidden=false;
    quizIndex=0;quizScore=0;renderQuiz();setStep(4);
    requestAnimationFrame(function(){if(panel)panel.scrollIntoView({block:'start',behavior:'smooth'})});
  }
  function finishQuiz(){
    var panel=el('initialsQuizPanel'),result=el('initialsResult'),reward=el('initialsReward');
    var passed=quizScore>=3,total=quizOrder.length;
    if(panel)panel.hidden=true;
    if(result)result.hidden=false;
    if(reward)reward.hidden=!passed;
    setStep(4);

    var badge=el('initialsResultBadge'),title=el('initialsResultTitle'),score=el('initialsResultScore'),msg=el('initialsResultMessage'),action=el('initialsResultAction');
    if(badge){badge.textContent=passed?'✓':'↻';badge.className='initials-result-badge '+(passed?'is-pass':'is-retry')}
    if(title)title.textContent=passed?'ミニチェック合格！':'あと一歩！';
    if(score)score.textContent=total+'問中 '+quizScore+'問正解';
    if(msg)msg.textContent=passed?'b・p・m・f の違いを聞き分けられたよ。':'3問以上でクリア。苦手な音をもう一度聞いて挑戦しよう。';
    if(action){
      action.textContent=passed?'声母の森へ戻る →':'もう一度やってみる';
      action.onclick=passed?goBackToInitialRoad:retryQuiz;
    }

    if(passed){
      try{localStorage.setItem('koepandaInitialP3Complete','1');window.dispatchEvent(new CustomEvent('koepandaInitialProgressChanged',{detail:{P3:true}}))}catch(e){}
    }
    var celebration={score:quizScore,total:total,passed:passed,title:passed?'ミニチェック合格！':'あと一歩！',message:passed?(quizScore===total?'b・p・m・f、4問ぜんぶ正解！ 音の違いをばっちり聞き分けられたよ。':'b・p・m・f の違いを聞き分けられたよ。あと1問で満点！'):'苦手な音をもう一度確認して、再チャレンジしよう。'};
    if(window.koepandaAttachResultReplay)window.koepandaAttachResultReplay(result,celebration);
    if(!window.KP134.lessonVisible(el('kidsInitialsLesson')))return;
    if(window.koepandaQueueResultCelebration)window.koepandaQueueResultCelebration(celebration,90);
    else if(window.koepandaShowResultCelebration)window.setTimeout(function(){window.koepandaShowResultCelebration(celebration)},90);
  }
  function mimeType(){
    if(typeof MediaRecorder==='undefined')return '';
    var arr=['audio/mp4','audio/webm;codecs=opus','audio/webm'];
    for(var i=0;i<arr.length;i++){try{if(MediaRecorder.isTypeSupported(arr[i]))return arr[i]}catch(e){}}
    return ''
  }
  function toggleRecord(){window.KP134.capture(el('kidsInitialsLesson'),el('initialsRecord'),el('initialsPlayback'),selected,el('initialsImitateFeedback'),function(key,url){if(recordings[key]&&recordings[key]!==url)URL.revokeObjectURL(recordings[key]);recordings[key]=url;recordingUrl=url})}
  async function playRecording(){var url=recordings[selected];if(!url)return;var btn=el('initialsPlayback');function clear(){btn.classList.remove('is-playing')}try{await window.KP134.play(selected,{root:el('kidsInitialsLesson'),clipUrl:url,rate:1,referenceVisual:false,button:btn,onPlaying:function(){btn.classList.add('is-playing')},onEnded:clear,onCancel:clear,onError:function(){clear();el('initialsImitateFeedback').textContent='録音を再生できませんでした。もう一度押してね。'}})}catch(e){clear()}}
  function init(){
    if(!el('kidsInitialsLesson'))return;window.KP134.attach(el('kidsInitialsLesson'),letters);
    var initialReward=el('initialsReward'),initialResult=el('initialsResult');
    if(initialReward)initialReward.hidden=true;
    if(initialResult)initialResult.hidden=true;
    renderLetters();
    document.querySelectorAll('.air-card').forEach(function(b){b.addEventListener('click',function(){setStep(2);play(b.dataset.air)})});
    document.querySelectorAll('.mouth-sound-card').forEach(function(b){b.addEventListener('click',function(){setStep(2);play(b.dataset.mouth)})});
    el('initialsToQuiz').disabled=false;
    el('initialsRecord').addEventListener('click',toggleRecord);
    el('initialsPlayback').addEventListener('click',playRecording);
    el('initialsToQuiz').addEventListener('click',function(){
      el('initialsResult').hidden=true;el('initialsReward').hidden=true;el('initialsQuizPanel').hidden=false; el('kidsInitialsLesson').querySelector('.initials-imitate-panel').hidden=true;
      quizIndex=0; quizScore=0; quizOrder=window.KP134.shuffle(letters);renderQuiz(); setStep(4);
      requestAnimationFrame(function(){el('initialsQuizPanel').scrollIntoView({block:'start',behavior:'smooth'})})
    });
    el('initialsQuizListen').addEventListener('click',playQuiz);
    el('initialsQuizNext').addEventListener('click',nextQuiz)
  }
  window.koepandaIsInitialUnitComplete=function(id){
    if(id==='P3'){try{return localStorage.getItem('koepandaInitialP3Complete')==='1'}catch(e){return false}}
    return false
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init()
})();
