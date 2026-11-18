/* Shared large-card practice and final assessment. Course routing stays in the roadmap. */
(function(){
'use strict';
var practiceBank=[
      {interaction:'listen',kind:'整体認読',prompt:'音声と同じ音節を選ぼう。',audio:'assets/audio/p14-sequence-177/zhi.wav',choices:['zhī','zī','chī','shī'],answer:'zhī',hint:'整体認読の音は、声母と韻母を一つずつ分けずに読みます。',explain:'zhī は整体認読の音です。舌を巻く zh の音をそのまま一つのまとまりで聞こう。'},
      {interaction:'listen',kind:'二拼',prompt:'音声と同じ音節はどれ？',audio:'assets/audio/p16-sequence/bo.wav',choices:['mō','pō','bō','fō'],answer:'bō',hint:'声母の違いを聞き分けよう。二拼は声母と韻母をつなぎます。',explain:'音声は bō（b＋o）。mō・pō・fō も二拼ですが、音声と同じなのは bō です。'},
      {interaction:'structure3',kind:'三拼',prompt:'声母・介音・韻母の三つでできている音節はどれ？',choices:['qiáo','bō','zhī','yī'],answer:'qiáo',hint:'三拼は「声母＋介音＋韻母」の三つでできています。',explain:'qiáo は q＋i＋ao。bō は二拼、zhī と yī は整体認読です。'},
      {interaction:'listen',kind:'声調',prompt:'音声と同じ声調の「wu」を選ぼう。',audio:'assets/audio/course-134/wu3.wav',choices:['wū','wú','wǔ','wù'],answer:'wǔ',hint:'一声は平ら、二声は上がる、三声は下がって上がる、四声は下がります。',explain:'これは第三声の wǔ。声調記号の位置と形も一緒に確認しよう。'},
      {interaction:'listen',kind:'整体認読',prompt:'音声と同じ音節を選ぼう。',audio:'assets/audio/p15-staged-177/yue.wav',choices:['yuè','yè','yú','yuán'],answer:'yuè',hint:'音の最初と最後をよく聞いて比べましょう。',explain:'聞こえた音は yuè。整体認読のまとまりとして覚えます。'},
      {interaction:'structure2',kind:'二拼',prompt:'声母と韻母の二つでできている音節はどれ？',choices:['dé','guā','zhī','yī'],answer:'dé',hint:'二拼は「声母＋韻母」の二つでできています。',explain:'dé は d＋e。guā は三拼、zhī と yī は整体認読です。'},
      {interaction:'structure3',kind:'三拼',prompt:'声母・介音・韻母の三つでできている音節はどれ？',choices:['guā','bō','chī','yī'],answer:'guā',hint:'三拼は「声母＋介音＋韻母」の三つでできています。',explain:'guā は g＋u＋a。bō は二拼、chī と yī は整体認読です。'},
      {interaction:'listen',kind:'声調',prompt:'音声と同じ声調を選ぼう。',audio:'assets/audio/course-134/yi4.wav',choices:['yī','yí','yǐ','yì'],answer:'yì',hint:'声調記号の向きと音の動きを一緒に確認しましょう。',explain:'聞こえたのは第四声 yì。短く下がる音です。'},
      {interaction:'knowledge',kind:'軽声',prompt:'軽声について正しい説明はどれ？',choices:['いつも同じ高さの第五声','短く軽く発音し、高さは前の音節で変わる','必ず低く発音する'],answer:'短く軽く発音し、高さは前の音節で変わる',hint:'「媽媽」「爸爸」の後ろの音を思い出してみましょう。',explain:'軽声は固定された第五声ではありません。前の音節に続く短く軽い音です。'},
      {interaction:'knowledge',kind:'軽声',prompt:'「爸爸（bàba）」の二つ目の音節は？',choices:['bā','bá','bǎ','ba（軽声）'],answer:'ba（軽声）',hint:'軽声は拼音で声調記号を付けずに表します。',explain:'bà の後ろの ba は短く軽く続く軽声です。'}
    ];
var writtenExam=[
      {q:'「xiě（写）」と同じ声調の音節は？',a:['jiě（姐）','jié（节）','jiē（街）','jiè（借）'],ok:0,note:'xiě と jiě はどちらも第三声。'},
      {q:'「nǐ hǎo」を続けて発音すると、自然な声調の組み合わせは？',a:['nǐ hǎo','ní hǎo','nì hǎo','nǐ hào'],ok:1,note:'第三声が続くと、前の音節は第二声に変わるよ。'},
      {q:'「q ＋ ü ＋ an」を拼読した正しい書き方は？',a:['quān','qüān','qiān','qǖan'],ok:0,note:'j・q・x の後では ü の点を省くよ。'},
      {q:'「guā（瓜）」と声調だけが違う音節は？',a:['guǎ','kuā','guō','guāng'],ok:0,note:'guā は第一声、guǎ は第三声。ほかは韻母や声母も違うよ。'},
      {q:'「sh + u + ang」を第一声でつないだ音節は？',a:['shuāng','suāng','shāng','shuǎng'],ok:0,note:'声母 sh、介音 u、韻母 ang をつなぎ、第一声を付けるよ。'},
      {q:'「b」と「p」の違いを正しく説明しているのは？',a:['b は無気音、p は有気音','b は有気音、p は無気音','どちらも有気音','どちらも同じ音'],ok:0,note:'口の形は似ているけれど、p は息を強く出すよ。'},
      {q:'「māma（妈妈）」の二つ目の ma は？',a:['第一声','第二声','第三声','軽声'],ok:3,note:'軽声は固定した第五声ではなく、短く軽く発音するよ。'},
      {q:'「jué（觉）」のつづりについて正しいのは？',a:['j の後の ü は点を省く','j の後も ü の点を書く','j の後では u を ü と読む'],ok:0,note:'j・q・x の後の ü は、点を省いて u と書くよ。'},
      {q:'「xué（学）」を声母・韻母に分けると？',a:['x ＋ üe','x ＋ ue（別々の母音）','sh ＋ uei','s ＋ ü'],ok:0,note:'x の後の üe は、点を省いて xue と書くよ。'},
      {q:'「zhōng（中）」の声母はどれ？',a:['z','zh','j','ch'],ok:1,note:'zh はそり舌音。z・j・ch とは舌の位置と息の出し方が違うよ。'}
    ];
// Reuse the recorded listening tasks and retain the core final assessment topics.
var finalBank=practiceBank.filter(function(q){return q.interaction==='listen'}).slice(0,4).concat(
  [1,2,4,5,6,8].map(function(i){var q=writtenExam[i];return {kind:['','声調','つづり','','三拼','声母','軽声','','韻母'][i],prompt:q.q,choices:q.a,answer:q.a[q.ok],hint:q.note,explain:q.note}})
);
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),v=a[i];a[i]=a[j];a[j]=v}return a}
function mount(root,isFinal){
 if(!root||root.dataset.largeCards)return;root.dataset.largeCards='1';root.classList.add('kp-pinyin-cards');
 root.innerHTML='<header class="kp-pc-heading"><img src="./assets/brand/xiaoyin-mascot.png" alt="小音"><div><span class="kp-pc-island"></span><h2></h2></div></header>'+
 '<div class="kp-pc-modes" role="group" aria-label="練習モード"><button type="button" data-mode="practice">自由練習</button><button type="button" data-mode="test">10問チャレンジ</button></div>'+
 '<div class="kp-pc-progress"><span></span><div role="progressbar" aria-label="回答した問題" aria-valuemin="0" aria-valuemax="10"><i></i></div></div>'+
 '<article class="kp-pc-card"><div class="kp-pc-kind"></div><h3 tabindex="-1"></h3><button type="button" class="kp-pc-audio">▶ 音を聞く</button><div class="kp-pc-parts" aria-label="音の構成" hidden></div><details class="kp-pc-hint"><summary>ヒントを見る</summary><p></p></details><div class="kp-pc-choices"></div><p class="kp-pc-feedback" role="status" aria-live="polite"></p><section class="kp-pc-results" hidden></section></article>'+
 '<footer class="kp-pc-actions"><button type="button" class="kp-pc-secondary">やり直す</button><button type="button" class="kp-pc-next">次へ →</button></footer>';
 var $=function(s){return root.querySelector(s)}, modes=$('.kp-pc-modes'),count=$('.kp-pc-progress>span'),track=$('[role="progressbar"]'),bar=$('.kp-pc-progress i'),kind=$('.kp-pc-kind'),prompt=$('h3'),hear=$('.kp-pc-audio'),parts=$('.kp-pc-parts'),hint=$('details'),choices=$('.kp-pc-choices'),feedback=$('.kp-pc-feedback'),results=$('.kp-pc-results'),next=$('.kp-pc-next'),secondary=$('.kp-pc-secondary');
 $('.kp-pc-island').textContent=isFinal?'島10 ・最後のチャレンジ':'島9 ・音のまとめ';$('h2').textContent=isFinal?'最終テスト':'総合練習';modes.hidden=isFinal;
 var mode=isFinal?'test':'practice',session=[],index=0,score=0,wrong=[],answered=false,finished=false,retryOnly=false,audio=null,generation=0;
 function stop(){generation++;if(audio){audio.pause();audio.onended=null;audio.onerror=null;audio=null}hear.disabled=false;hear.classList.remove('is-playing')}
 function play(){stop();var q=session[index];if(!q||!q.audio||finished)return;var token=generation,clip=new Audio(new URL(q.audio,document.baseURI).href);audio=clip;hear.disabled=true;hear.classList.add('is-playing');
 function end(message){if(token!==generation)return;stop();if(message)feedback.textContent=message}
 clip.onended=function(){end()};clip.onerror=function(){end('音を読み込めませんでした。もう一度押してね。')};try{var p=clip.play();if(p&&p.catch)p.catch(function(){end('もう一度「音を聞く」を押してね。')})}catch(e){end('もう一度「音を聞く」を押してね。')}
 }
 function progress(value){track.setAttribute('aria-valuemax',session.length);track.setAttribute('aria-valuenow',value);bar.style.width=(value/session.length*100)+'%'}
 function draw(focus){stop();answered=false;finished=false;root.classList.remove('is-result');var q=session[index];results.hidden=true;results.replaceChildren();kind.textContent=q.kind;prompt.textContent=q.prompt;count.textContent=(index+1)+' / '+session.length+(retryOnly?' ・復習':'');progress(index);hear.hidden=!q.audio;hint.hidden=mode!=='practice';hint.open=false;hint.querySelector('p').textContent=q.hint||q.explain;parts.replaceChildren();parts.hidden=!/^structure/.test(q.interaction||'');if(!parts.hidden){(q.interaction==='structure3'?['声母','介音','韻母']:['声母','韻母']).forEach(function(label,i){if(i){var plus=document.createElement('b');plus.textContent='＋';parts.appendChild(plus)}var s=document.createElement('span');s.textContent=label;parts.appendChild(s)})}
 choices.hidden=false;choices.replaceChildren();choices.classList.toggle('has-long-text',q.choices.some(function(c){return c.length>13}));shuffle(q.choices.slice()).forEach(function(choice){var b=document.createElement('button');b.type='button';var label=document.createElement('span');label.textContent=choice;b.appendChild(label);b.setAttribute('aria-pressed','false');b.addEventListener('click',function(){if(answered)return;stop();var ok=choice===q.answer;b.setAttribute('aria-pressed','true');if(mode==='practice'&&!ok){b.classList.add('is-wrong');b.setAttribute('aria-label',choice+'：もう一度');feedback.textContent='もう一度！ ヒントも見てみよう。';return}answered=true;if(ok)score++;else wrong.push(q);choices.querySelectorAll('button').forEach(function(x){x.disabled=true;if(x.firstChild.textContent===q.answer){x.classList.add('is-answer');x.setAttribute('aria-label',x.firstChild.textContent+'：正解');var mark=document.createElement('small');mark.textContent='✓ 正解';x.appendChild(mark)}else if(x===b){x.classList.add('is-wrong');var mark=document.createElement('small');mark.textContent='もう一度覚えよう';x.appendChild(mark)}});feedback.textContent=(ok?'正解！ ':'正解は「'+q.answer+'」。 ')+q.explain;next.disabled=false;progress(index+1)});choices.appendChild(b)});
 feedback.textContent=q.audio?'音を聞いて、カードを選ぼう。':'カードを選ぼう。';next.disabled=mode!=='practice';next.textContent=index===session.length-1?'結果を見る':'次へ →';secondary.hidden=isFinal;secondary.disabled=false;secondary.textContent=mode==='practice'?'やり直す':'最初から';if(focus){prompt.focus({preventScroll:true});align()}
 }
 function align(){if(root.hidden)return;var header=document.querySelector('.kp148-lesson-header'),offset=header?header.getBoundingClientRect().bottom:0;window.scrollTo({top:Math.max(0,window.scrollY+root.getBoundingClientRect().top-offset-8),behavior:'auto'})}
 function begin(newMode,subset){stop();mode=newMode;retryOnly=!!subset;session=shuffle((subset|| (isFinal?finalBank:practiceBank)).slice());index=0;score=0;wrong=[];modes.querySelectorAll('button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.mode===mode))});draw(false)}
 function finish(){if(finished)return;stop();finished=true;root.classList.add('is-result');kind.textContent='チャレンジ完了';count.textContent='おつかれさま！';progress(session.length);prompt.textContent=mode==='practice'?'いろいろな音を練習できたね！':score===session.length?'全問正解！ おめでとう！':'最後までよくがんばったね！';hear.hidden=true;parts.hidden=true;hint.hidden=true;choices.hidden=true;feedback.textContent=mode==='practice'?'次は10問チャレンジで力だめし！':'正解 '+score+' / '+session.length+'問';results.hidden=false;results.replaceChildren();
 if(wrong.length){var title=document.createElement('h4');title.textContent='もう一度覚えよう';results.appendChild(title);wrong.forEach(function(q){var d=document.createElement('details'),s=document.createElement('summary'),p=document.createElement('p');s.textContent=q.kind+'：'+q.answer;p.textContent=q.prompt+' '+q.explain;d.append(s,p);results.appendChild(d)})}
 secondary.hidden=!wrong.length;secondary.textContent='間違えた問題だけ';next.disabled=false;next.textContent=mode==='practice'?'10問チャレンジへ':'もう一度チャレンジ';
 if(mode==='test'&&!retryOnly){if(isFinal&&score===session.length){try{localStorage.setItem('koepandaFinalP21Complete','1')}catch(e){}window.dispatchEvent(new Event('koepandaCompoundProgressChanged'))}
 var config={score:score,total:session.length,title:score===session.length?'全問正解！':'最後までできたね！',kicker:isFinal?'最終テスト':'総合練習',message:wrong.length?'間違えた問題を、小音ともう一度練習しよう。':'小音も大よろこび！ よくがんばりました。'};
 if(typeof window.koepandaQueueResultCelebration==='function')window.koepandaQueueResultCelebration(config,120);
 }align();prompt.focus({preventScroll:true})
 }
 hear.addEventListener('click',play);next.addEventListener('click',function(){if(next.disabled)return;if(finished){begin('test');align();return}if(index<session.length-1){index++;draw(true)}else finish()});secondary.addEventListener('click',function(){if(finished){begin('test',wrong);align()}else if(mode==='practice')draw(false);else{begin(mode);align()}});modes.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){if(mode===b.dataset.mode)return;begin(b.dataset.mode);align()})});
 window.addEventListener('koepandaP18Stop',stop);window.addEventListener('pagehide',stop);document.addEventListener('visibilitychange',function(){if(document.hidden)stop()});
 var visibility=new MutationObserver(function(){if(root.hidden)stop()});visibility.observe(root,{attributes:true,attributeFilter:['hidden']});
 if(!isFinal)window.addEventListener('koepandaP18Reset',function(){begin('practice');requestAnimationFrame(function(){requestAnimationFrame(align)})});begin(mode);
}
function init(){mount(document.getElementById('kidsIslandReviewLesson'),false);mount(document.getElementById('kidsFinalPinyinExam'),true);return !!document.querySelector('#kidsIslandReviewLesson[data-large-cards]')&&!!document.querySelector('#kidsFinalPinyinExam[data-large-cards]')}
var observer=new MutationObserver(function(){if(init())observer.disconnect()});if(!init())observer.observe(document.documentElement,{childList:true,subtree:true});
})();
