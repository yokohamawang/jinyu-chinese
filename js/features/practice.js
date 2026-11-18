(function(){
  'use strict';
  window.KoepandaFeatures=window.KoepandaFeatures||{};
  function renderChapterPractice(data,safe){
    if(!data)return `<section class="kp-section kp-chapter-practice"><div class="kp-section-title"><h2>今の章を復習</h2><span>学習順に進むコース練習</span></div><p class="kp-chapter-loading">準4級の章を読み込んでいます…</p></section>`;
    if(data.error)return `<section class="kp-section kp-chapter-practice"><div class="kp-section-title"><h2>今の章を復習</h2></div><p class="kp-chapter-loading">章の練習を読み込めませんでした。学習ページから続けてください。</p></section>`;
    const u=data.currentUnit;
    const completed=data.completed||[];
    const completedList=completed.length?`<details class="kp-chapter-past"><summary>修了した章を練習する（${completed.length}）</summary>${completed.map(x=>`<button data-action="chapter-practice" data-unit="${safe(x.unit_id)}" data-mode="meaning"><span>${safe(x.title_ja)}</span><small>ことば・意味に再挑戦</small></button>`).join('')}</details>`:'';
    return `<section class="kp-section kp-chapter-practice"><div class="kp-section-title"><h2>今の章を復習</h2><span>今学んでいる章から5問ずつ</span></div><article class="kp-chapter-current"><span class="kp-eyebrow">${data.isComplete?'修了した章':'次のチャレンジ'} · ${String(u.index+1).padStart(2,'0')}</span><h3>${safe(u.title_ja)}</h3><p>${u.wordCount}語・${u.characterCount}字から出題。学習中の章を、3つの方法で復習できます。</p><div class="kp-chapter-modes"><button data-action="chapter-practice" data-unit="${safe(u.unit_id)}" data-mode="word"><b>絵からことば</b><small>場面を見て、ぴったりの中国語を選ぶ</small></button><button data-action="chapter-practice" data-unit="${safe(u.unit_id)}" data-mode="reading"><b>読み方パズル</b><small>漢字に合うピンインと声調を選ぶ</small></button><button data-action="chapter-practice" data-unit="${safe(u.unit_id)}" data-mode="meaning"><b>意味を思い出す</b><small>中国語から日本語の意味を選ぶ</small></button></div></article>${completedList}${data.lockedCount?`<p class="kp-chapter-footnote">次の章は、今の章の学習を終えると開きます。</p>`:''}</section>`;
  }
  function renderPracticeTracks(catalog,completed,safe){
    if(!catalog)return `<section class="kp-practice-routes"><p class="kp-chapter-loading">練習コースを準備しています…</p></section>`;
    const routes=[
      {id:'chapter',icon:'🗺️',title:'学習章の練習',description:'学習した章を、読み・意味・ことばのミッションで復習',meta:`${catalog.unit_summaries?.length||11}章`},
      {id:'daily',icon:'💬',title:'日常でよく使う中国語',description:'よく使うひとことを聞いて、声に出して練習',meta:'テーマ別'},
      {id:'scenario',icon:'🎭',title:'場面練習',description:'食事・移動・買い物など、場面ごとの会話を練習',meta:`${catalog.scenario_activities?.length||0}場面`}
    ];
    return `<section class="kp-practice-routes" aria-label="練習コース"><div class="kp-practice-route-grid">${routes.map(route=>`<button class="kp-practice-route kp-route-${route.id}" data-action="practice-route" data-track="${route.id}"><span class="kp-route-icon" aria-hidden="true">${route.icon}</span><span class="kp-route-copy"><b>${safe(route.title)}</b><small>${safe(route.description)}</small><em>${safe(route.meta)}</em></span><span class="kp-route-arrow" aria-hidden="true">›</span></button>`).join('')}</div></section>`;
  }
  window.KoepandaFeatures.practice = function({head,state,safe,QUESTIONS}){
    return `${head('どの練習にする？','練習ひろば','好きなコースを選んで、ゆっくり進もう。')}<div class="kp-practice-welcome"><span aria-hidden="true">🌱</span><p>ひとつずつで大丈夫。気になる練習からはじめよう。</p></div>${renderPracticeTracks(state.practiceCatalog,state.completedUnitIds||[],safe)}`;
  }
  window.KoepandaFeatures.practice.mount=function(ctx){
    const requestedAction=new URLSearchParams(location.search);
    if(ctx.state.practiceCatalog&&!ctx.state.practiceAutoAction&&requestedAction.get('review')==='1'){ctx.state.practiceAutoAction=true;setTimeout(()=>review(ctx),0)}
    if(ctx.state.practiceCatalog&&!ctx.state.practiceAutoAction&&requestedAction.get('quiz')==='1'){ctx.state.practiceAutoAction=true;setTimeout(()=>startQuiz(ctx),0)}
    if(!ctx.state.practiceCatalogLoading&&!ctx.state.practiceCatalog){ctx.state.practiceCatalogLoading=true;fetch('./data/practice-catalog-0.1.json?v=301.240').then(response=>{if(!response.ok)throw new Error('practice_catalog_unavailable');return response.json()}).then(catalog=>{ctx.state.practiceCatalog=catalog;ctx.state.practiceCatalogLoading=false;ctx.render()}).catch(error=>{console.warn('[Koepanda] practice catalog unavailable:',error);ctx.state.practiceCatalog={tracks:[],themes:[],daily_activities:[],scenario_activities:[]};ctx.state.practiceCatalogLoading=false;ctx.render()})}
    const progressKey='koepanda.hanzi.unit-progress.v1';try{const ids=JSON.parse(localStorage.getItem(progressKey)||'[]');if(Array.isArray(ids))ctx.state.completedUnitIds=ids.filter(x=>typeof x==='string')}catch(_){}
  };
  const QUESTIONS=[
    {id:'nihao',q:'「你好」はどんなあいさつ？',a:['こんにちは','ありがとう','おやすみ'],correct:0,sticker:'a'},
    {id:'shui',q:'「水」の意味は？',a:['山','水','人'],correct:1,sticker:'shui'},
    {id:'ren',q:'「人」のピンインは？',a:['rén','shuǐ','hǎo'],correct:0,sticker:'ren'},
    {id:'hao',q:'「好」の意味に近いのは？',a:['よい','大きい','あした'],correct:0,sticker:'hao'},
    {id:'shan',q:'「山」のピンインは？',a:['mā','shān','nǐ'],correct:1,sticker:'shan'}
  ];
  let quizIndex=0,quizSet=[],quizMode='challenge',quizClaimToken=null,quizScore=0;
  window.KoepandaFeatures.practice.actions={
    quiz:ctx=>startQuiz(ctx),
    'chapter-practice':(ctx,b)=>{const params=new URLSearchParams({track:'chapter',unit:b.dataset.unit,mode:b.dataset.mode});window.location.href='./practice-session.html?'+params.toString();},
    'practice-route':(ctx,b)=>{if(b.getAttribute('aria-disabled')==='true')return;window.location.href='./practice-routes.html?track='+encodeURIComponent(b.dataset.track);},
    review:ctx=>review(ctx),
    'quiz-answer':(ctx,b)=>answer(ctx,+b.dataset.answer),
    'quiz-next':ctx=>nextQuestion(ctx),
    'finish-quiz':ctx=>finishQuiz(ctx),
    'sticker-award-retry':ctx=>window.KoepandaRewardReveal?.award(ctx,{claimToken:quizClaimToken,score:quizScore,total:quizSet.length,activityKey:'practice.mini-quiz'})
  };
  window.KoepandaFeatures.practice.questions=QUESTIONS;
  function startQuiz(ctx){quizMode='challenge';quizClaimToken=newClaimToken();quizScore=0;quizSet=QUESTIONS.map((q,i)=>i).sort(()=>Math.random()-.5);quizIndex=0;renderQuiz(ctx);}
  function renderQuiz(ctx,feedback){const main=ctx.root.querySelector('#kpFeatureMain'),q=QUESTIONS[quizSet[quizIndex]];main.innerHTML=`${ctx.head('ミニクイズ','5問チャレンジ','答えた問題は、次の復習タイミングに反映するよ。')}<div class="kp-quiz-progress"><span style="width:${(quizIndex/quizSet.length)*100}%"></span></div><section class="kp-quiz-card"><span class="kp-eyebrow">${quizIndex+1} / ${quizSet.length} 問</span><h2>${q.q}</h2><div class="kp-quiz-options">${q.a.map((x,i)=>`<button data-action="quiz-answer" data-answer="${i}" ${feedback?'disabled':''}>${ctx.safe(x)}</button>`).join('')}</div>${feedback?`<div class="kp-quiz-feedback ${feedback.ok?'good':'again'}">${feedback.ok?'せいかい！ごほうびに近づいたよ ✨':'だいじょうぶ。まちがいノートに入れて、あとで復習しよう。'}<button data-action="quiz-next" class="kp-primary">${quizIndex===quizSet.length-1?'結果を見る':'つぎへ'}</button></div>`:''}</section><button class="kp-text-button" data-go="practice">練習ひろばへ戻る</button>`;}
  function answer(ctx,index){const q=QUESTIONS[quizSet[quizIndex]],ok=index===q.correct;ctx.state.lastQuiz=Date.now();recordAttempt(q.id,'intro-mini-quiz',ok);if(ok){quizScore++;ctx.state.mastered[q.id]=(ctx.state.mastered[q.id]||0)+1;const old=ctx.state.wrongs[q.id];if(old){old.streak=(old.streak||0)+1;if(old.streak>=5)delete ctx.state.wrongs[q.id];else{const intervals=[3,7,14,30];old.due=Date.now()+intervals[Math.min(old.streak-1,intervals.length-1)]*86400000;}}}else{const old=ctx.state.wrongs[q.id]||{count:0,streak:0};old.count++;old.streak=0;old.due=Date.now()+86400000;old.question=q.id;ctx.state.wrongs[q.id]=old;}ctx.save();renderQuiz(ctx,{ok});}
  function recordAttempt(itemKey,courseKey,isCorrect){
    const api=window.KP_ACCOUNT_API;
    if(api&&typeof api.recordPracticeAttempt==='function')api.recordPracticeAttempt('quiz:'+itemKey,courseKey,isCorrect).catch(error=>console.warn('[Koepanda] answer sync unavailable:',error));
  }
  function nextQuestion(ctx){quizIndex++;if(quizIndex>=quizSet.length){finishQuiz(ctx);return;}renderQuiz(ctx);}
  function finishQuiz(ctx){
    ctx.save();
    const isFullChallenge=quizMode==='challenge'&&quizSet.length===QUESTIONS.length;
    if(isFullChallenge&&window.KoepandaRewardReveal&&typeof window.koepandaShowResultCelebration==='function'){
      window.koepandaShowResultCelebration({score:quizScore,total:quizSet.length,kicker:'ミニクイズ',title:'チャレンジ完了！',__kpRewardContext:ctx,__kpRewardClaimToken:quizClaimToken,__kpRewardActivityKey:'practice.mini-quiz'});
      return;
    }
    ctx.setPage('practice');ctx.render();
    ctx.modal('チャレンジできたね！',`<p class="kp-modal-copy">復習する問題をまちがいノートに入れました。</p><button data-action="modal-close" class="kp-primary">とじる</button>`);
  }
  function newClaimToken(){if(window.crypto?.randomUUID)return window.crypto.randomUUID();return'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:(r&3|8)).toString(16);});}
  async function review(ctx){
    const api=window.KP_ACCOUNT_API;
    if(api&&typeof api.getPracticeReviewQueue==='function'){
      let cloudRows=null;
      try{
        const rows=await api.getPracticeReviewQueue();
        if(Array.isArray(rows)){cloudRows=rows;const dueRows=rows.filter(x=>new Date(x.due_at).getTime()<=Date.now());if(dueRows.length){
          const row=dueRows[0];
          if(row.item_key.startsWith('pre4-char:')&&row.course_key==='hanzi-basic'){
            const params=new URLSearchParams({review:row.item_key,course:row.course_key});window.location.href='./hanzi-practice.html?'+params.toString();return;
          }
          if(row.item_key.startsWith('pre4-entry:')||row.item_key.startsWith('pre4-char:')||row.item_key.startsWith('daily:')||row.item_key.startsWith('scenario:')||row.item_key.startsWith('dialogue:')){
            const params=new URLSearchParams({review:row.item_key,course:row.course_key});window.location.href='./practice-session.html?'+params.toString();return;
          }
          const q=QUESTIONS.find(x=>'quiz:'+x.id===row.item_key);
          if(q){quizMode='review';quizClaimToken=null;quizSet=[QUESTIONS.indexOf(q)];quizIndex=0;renderQuiz(ctx);return;}
        }
        }
        if(rows===null)throw new Error('signed_out');
        if(cloudRows&&cloudRows.length){const nextAt=new Date(cloudRows[0].due_at);ctx.modal('次の復習まで待とう',`<p class="kp-modal-copy">記録した問題は${new Intl.DateTimeFormat('ja-JP',{month:'numeric',day:'numeric'}).format(nextAt)}から復習できます。未復習の問題は消えずに残ります。</p><button data-action="modal-close" class="kp-primary">わかった</button>`);return;}
      }catch(error){if(error.message!=='signed_out')console.warn('[Koepanda] cloud review unavailable:',error);}
    }
    const due=Object.values(ctx.state.wrongs).filter(x=>x.due<=Date.now());
    if(!due.length){ctx.modal('まちがいノート',`<p class="kp-modal-copy">今は復習する問題がないよ。学習ページの単元練習かミニクイズに挑戦してみよう。</p><button data-action="modal-close" class="kp-primary">とじる</button>`);return;}
    const q=QUESTIONS.find(x=>x.id===due[0].question);if(!q)return;quizMode='review';quizClaimToken=null;quizSet=[QUESTIONS.indexOf(q)];quizIndex=0;renderQuiz(ctx);
  }
})();
