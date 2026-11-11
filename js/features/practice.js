(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};
  window.KoepandaFeatures.practice = function({head,state,safe,QUESTIONS}){
    const due=Object.values(state.wrongs).filter(x=>x.due<=Date.now()).length;
    const wrongs=Object.keys(state.wrongs).length;
    return `${head('きょうはどれで遊ぶ？','練習ひろば','今の気分に合わせて選ぼう。短い練習も、あとで復習もできるよ。')}<div class="kp-welcome-card"><span class="kp-spark">✦</span><div><strong>小音といっしょに、ひとつずつ。</strong><small>練習するとシールやバッジがふえるよ</small></div><button data-go="book" class="kp-mini-link">シールを見る →</button></div><div class="kp-mode-grid"><button class="kp-mode-card pink" data-action="legacy" data-mode="listen"><span>🎧</span><b>聞いてみる</b><small>中国語の音を聞こう</small></button><button class="kp-mode-card blue" data-action="legacy" data-mode="talk"><span>🎤</span><b>声に出してみる</b><small>小音といっしょに話そう</small></button><button class="kp-mode-card green" data-action="legacy" data-mode="repeat"><span>🪞</span><b>まねしてみる</b><small>発音と声調を練習</small></button><button class="kp-mode-card gold" data-action="quiz"><span>🧩</span><b>ミニクイズ</b><small>5問だけチャレンジ</small></button></div><section class="kp-section"><div class="kp-section-title"><h2>もういちどチャレンジ</h2><span>学習に合わせた復習</span></div><article class="kp-review-card"><div class="kp-review-icon">🔁</div><div class="kp-grow"><b>${due?`復習するカードが ${due} 枚あるよ`:'まちがいノート'}</b><small>${wrongs?`${wrongs}問を記録中。できたカードは少しずつ復習間隔が広がるよ。`:'ミニクイズで間違えた問題は、ここに集まるよ。'}</small></div><button data-action="review" class="kp-round-arrow" aria-label="復習を開く">›</button></article></section>${wrongs?`<section class="kp-section"><div class="kp-section-title"><h2>まちがいノート</h2><button data-action="review">復習する →</button></div><div class="kp-mistake-list">${Object.values(state.wrongs).slice(0,4).map(x=>{const q=QUESTIONS.find(k=>k.id===x.question);return q?`<div><span>🌀</span><b>${safe(q.q)}</b><small>${x.due<=Date.now()?'復習できます':'あとで復習'}</small></div>`:''}).join('')}</div></section>`:''}<section class="kp-section"><div class="kp-section-title"><h2>友だちといっしょ</h2><button data-go="friends">見にいく →</button></div><div class="kp-friend-banner"><span>🐼🌱</span><div><b>あいさつして、いっしょに続けよう</b><small>ひとことカードで応援。学習記録は見せる範囲を選べるよ。</small></div><button data-go="friends" class="kp-primary">友だちページ</button></div></section><div class="kp-soft-note">学習内容やコースの進み方は、今までの学習ページをそのまま使えます。</div>`;
  }
  const QUESTIONS=[
    {id:'nihao',q:'「你好」はどんなあいさつ？',a:['こんにちは','ありがとう','おやすみ'],correct:0,sticker:'a'},
    {id:'shui',q:'「水」の意味は？',a:['山','水','人'],correct:1,sticker:'shui'},
    {id:'ren',q:'「人」のピンインは？',a:['rén','shuǐ','hǎo'],correct:0,sticker:'ren'},
    {id:'hao',q:'「好」の意味に近いのは？',a:['よい','大きい','あした'],correct:0,sticker:'hao'},
    {id:'shan',q:'「山」のピンインは？',a:['mā','shān','nǐ'],correct:1,sticker:'shan'}
  ];
  let quizIndex=0,quizSet=[];
  window.KoepandaFeatures.practice.actions={
    quiz:ctx=>startQuiz(ctx),
    review:ctx=>review(ctx),
    'quiz-answer':(ctx,b)=>answer(ctx,+b.dataset.answer),
    'quiz-next':ctx=>nextQuestion(ctx),
    'finish-quiz':ctx=>finishQuiz(ctx)
  };
  window.KoepandaFeatures.practice.questions=QUESTIONS;
  function startQuiz(ctx){quizSet=QUESTIONS.map((q,i)=>i).sort(()=>Math.random()-.5);quizIndex=0;renderQuiz(ctx);}
  function renderQuiz(ctx,feedback){const main=ctx.root.querySelector('#kpFeatureMain'),q=QUESTIONS[quizSet[quizIndex]];main.innerHTML=`${ctx.head('ミニクイズ','5問チャレンジ','答えた問題は、次の復習タイミングに反映するよ。')}<div class="kp-quiz-progress"><span style="width:${(quizIndex/quizSet.length)*100}%"></span></div><section class="kp-quiz-card"><span class="kp-eyebrow">${quizIndex+1} / ${quizSet.length} 問</span><h2>${q.q}</h2><div class="kp-quiz-options">${q.a.map((x,i)=>`<button data-action="quiz-answer" data-answer="${i}" ${feedback?'disabled':''}>${ctx.safe(x)}</button>`).join('')}</div>${feedback?`<div class="kp-quiz-feedback ${feedback.ok?'good':'again'}">${feedback.ok?'せいかい！シールをゲット ✨':'だいじょうぶ。まちがいノートに入れて、あとで復習しよう。'}<button data-action="quiz-next" class="kp-primary">${quizIndex===quizSet.length-1?'結果を見る':'つぎへ'}</button></div>`:''}</section><button class="kp-text-button" data-go="practice">練習ひろばへ戻る</button>`;}
  function answer(ctx,index){const q=QUESTIONS[quizSet[quizIndex]],ok=index===q.correct;ctx.state.lastQuiz=Date.now();if(ok){ctx.state.mastered[q.id]=(ctx.state.mastered[q.id]||0)+1;const old=ctx.state.wrongs[q.id];if(old){old.streak=(old.streak||0)+1;if(old.streak>=3)delete ctx.state.wrongs[q.id];else old.due=Date.now()+(old.streak===1?86400000:3*86400000);}if(!ctx.state.unlocked.includes(q.sticker))ctx.state.unlocked.push(q.sticker);}else{const old=ctx.state.wrongs[q.id]||{count:0,streak:0};old.count++;old.streak=0;old.due=Date.now();old.question=q.id;ctx.state.wrongs[q.id]=old;}ctx.save();renderQuiz(ctx,{ok});}
  function nextQuestion(ctx){quizIndex++;if(quizIndex>=quizSet.length){finishQuiz(ctx);return;}renderQuiz(ctx);}
  function finishQuiz(ctx){ctx.save();ctx.setPage('practice');ctx.render();ctx.modal('チャレンジできたね！',`<div class="kp-result-illustration">${ctx.STICKERS.slice(0,ctx.state.unlocked.length).map(s=>`<img src="${ctx.img(s.id)}" alt="">`).join('')}</div><p class="kp-modal-copy">まちがえた問題は、次にちょうどいいタイミングで出てくるよ。シールはシール帳に追加しました。</p><button data-action="modal-close" class="kp-primary">とじる</button>`);}
  function review(ctx){const due=Object.values(ctx.state.wrongs).filter(x=>x.due<=Date.now());if(!due.length){ctx.modal('まちがいノート',`<p class="kp-modal-copy">今は復習する問題がないよ。ミニクイズで新しいチャレンジをしてみよう。</p><button data-action="modal-close" class="kp-primary">とじる</button>`);return;}const q=QUESTIONS.find(x=>x.id===due[0].question);if(!q)return;quizSet=[QUESTIONS.indexOf(q)];quizIndex=0;renderQuiz(ctx);}
})();
