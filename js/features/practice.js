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
    if(!catalog)return `<section class="kp-section kp-practice-routes"><div class="kp-section-title"><h2>テーマ・日常から自由に練習</h2></div><p class="kp-chapter-loading">練習ルートを準備しています…</p></section>`;
    const scenarioReady=completed.includes(catalog.scenario_activities?.[0]?.unlock_unit);
    const routeCards=catalog.tracks.filter(track=>track.id!=='chapter').map(track=>{
      const locked=track.id==='scenario'&&!scenarioReady;
      const glyph={chapter:'🗺️',theme:'🧩',daily:'💬',scenario:'🎧'}[track.id]||'✦';
      const meta=track.id==='chapter'?'準4級 11章':track.id==='theme'?`${catalog.themes.length}テーマ`:track.id==='daily'?`${catalog.daily_activities.length}コース`:`${catalog.scenario_activities.length}場面`;
      return `<button class="kp-practice-route ${locked?'is-locked':''}" data-action="practice-route" data-track="${safe(track.id)}" ${locked?'aria-disabled="true"':''}><span class="kp-route-icon">${glyph}</span><span class="kp-route-copy"><b>${safe(track.title)}</b><small>${safe(locked?'準4級 第10章を学ぶと開きます':track.description)}</small></span><span class="kp-route-meta">${safe(locked?'🔒':meta)}</span></button>`;
    }).join('');
    return `<section class="kp-section kp-practice-routes"><div class="kp-section-title"><h2>テーマ・日常から自由に練習</h2><span>興味のある話題を選ぼう</span></div><div class="kp-practice-route-grid">${routeCards}</div><p class="kp-route-note">今の章の進み具合とは別に、テーマや日常表現から選べます。場面会話は準4級 第10章を学ぶと開きます。</p></section>`;
  }
  window.KoepandaFeatures.practice = function({head,state,safe,QUESTIONS}){
    const localDue=Object.values(state.wrongs).filter(x=>x.due<=Date.now()).length;
    const localWrongs=Object.keys(state.wrongs).length;
    const cloudRows=Array.isArray(state.remoteReviewRows)?state.remoteReviewRows:null;
    const due=cloudRows?cloudRows.filter(x=>new Date(x.due_at).getTime()<=Date.now()).length:localDue;
    const wrongs=cloudRows?cloudRows.length:localWrongs;
    const nextCloudDue=cloudRows?.length?new Date(cloudRows[0].due_at):null;
    const reviewDescription=cloudRows?(due?`${due}問は復習できます。正解が続くと復習間隔が広がります。`:wrongs?`${wrongs}問を記録中。次の復習は${new Intl.DateTimeFormat('ja-JP',{month:'numeric',day:'numeric'}).format(nextCloudDue)}です。`:'間違えた問題は翌日から復習できます。'):(wrongs?`${wrongs}問を記録中。できたカードは少しずつ復習間隔が広がるよ。`:'ミニクイズで間違えた問題は、ここに集まるよ。');
    return `${head('きょうはどれで遊ぶ？','練習ひろば','上はすぐできるミニ練習。下は「今の章の復習」と「テーマ・日常の自由練習」です。')}<section class="kp-quick-practice" aria-labelledby="kpQuickPracticeTitle"><div class="kp-section-title"><h2 id="kpQuickPracticeTitle">すぐできるミニ練習</h2><span>短い時間で1つ選ぼう</span></div><div class="kp-mode-grid"><button class="kp-mode-card pink" data-action="legacy" data-mode="listen"><span>🎧</span><b>聞いてみる</b><small>中国語の音を聞こう</small></button><button class="kp-mode-card blue" data-action="legacy" data-mode="talk"><span>🎤</span><b>声に出してみる</b><small>小音といっしょに話そう</small></button><button class="kp-mode-card green" data-action="legacy" data-mode="repeat"><span>🪞</span><b>まねしてみる</b><small>発音と声調を練習</small></button><button class="kp-mode-card gold" data-action="quiz"><span>🧩</span><b>ミニクイズ</b><small>5問だけチャレンジ</small></button></div></section>${renderChapterPractice(state.chapterPracticeData,safe)}${renderPracticeTracks(state.practiceCatalog,state.completedUnitIds||[],safe)}<section class="kp-section"><div class="kp-section-title"><h2>もういちどチャレンジ</h2><span>学習に合わせた復習</span></div><article class="kp-review-card"><div class="kp-review-icon">🔁</div><div class="kp-grow"><b>${due?`復習するカードが ${due} 枚あるよ`:'まちがいノート'}</b><small>${reviewDescription}</small></div><button data-action="review" class="kp-round-arrow" aria-label="復習を開く">›</button></article></section>${wrongs?`<section class="kp-section"><div class="kp-section-title"><h2>まちがいノート</h2><button data-action="review">復習する →</button></div><div class="kp-mistake-list">${Object.values(state.wrongs).slice(0,4).map(x=>{const q=QUESTIONS.find(k=>k.id===x.question);return q?`<div><span>🌀</span><b>${safe(q.q)}</b><small>${x.due<=Date.now()?'復習できます':'あとで復習'}</small></div>`:''}).join('')}</div></section>`:''}`;
  }
  window.KoepandaFeatures.practice.mount=function(ctx){
    if(!ctx.state.chapterPracticeData&&!ctx.state.chapterPracticeLoading){
      ctx.state.chapterPracticeLoading=true;
      fetch('./data/pre4-content-package-0.1.json').then(response=>{if(!response.ok)throw new Error('chapter_catalog_unavailable');return response.json();}).then(data=>{
        let completedIds=[];try{const raw=JSON.parse(localStorage.getItem('koepanda.hanzi.unit-progress.v1')||'[]');if(Array.isArray(raw))completedIds=raw.filter(x=>typeof x==='string');}catch(_){}
        const completedSet=new Set(completedIds),currentIndex=data.units.findIndex(unit=>!completedSet.has(unit.unit_id));
        const targetIndex=currentIndex<0?data.units.length-1:currentIndex,unit=data.units[targetIndex];
        const entries=data.vocabulary_entries.filter(entry=>entry.unit_id===unit.unit_id);
        const chars=new Set(entries.flatMap(entry=>entry.character_sequence||[]));
        ctx.state.chapterPracticeData={currentUnit:{...unit,index:targetIndex,wordCount:entries.length,characterCount:chars.size},isComplete:completedSet.has(unit.unit_id),completed:data.units.map((x,i)=>({unit_id:x.unit_id,title_ja:x.title_ja,index:i})).filter(x=>completedSet.has(x.unit_id)),lockedCount:Math.max(0,data.units.length-targetIndex-1)};
        ctx.state.chapterPracticeLoading=false;ctx.render();
      }).catch(error=>{console.warn('[Koepanda] chapter practice catalog unavailable:',error);ctx.state.chapterPracticeData={error:true};ctx.state.chapterPracticeLoading=false;ctx.render();});
    }
    if(!ctx.state.practiceCatalogLoading&&!ctx.state.practiceCatalog){ctx.state.practiceCatalogLoading=true;fetch('./data/practice-catalog-0.1.json?v=301.237').then(response=>{if(!response.ok)throw new Error('practice_catalog_unavailable');return response.json()}).then(catalog=>{ctx.state.practiceCatalog=catalog;ctx.state.practiceCatalogLoading=false;ctx.render()}).catch(error=>{console.warn('[Koepanda] practice catalog unavailable:',error);ctx.state.practiceCatalog={tracks:[],themes:[],daily_activities:[],scenario_activities:[]};ctx.state.practiceCatalogLoading=false;ctx.render()})}
    const progressKey='koepanda.hanzi.unit-progress.v1';try{const ids=JSON.parse(localStorage.getItem(progressKey)||'[]');if(Array.isArray(ids))ctx.state.completedUnitIds=ids.filter(x=>typeof x==='string')}catch(_){}
    const loadedAt=Number(ctx.state.remoteReviewLoadedAt||0);
    if(Date.now()-loadedAt<60000)return;
    const api=window.KP_ACCOUNT_API;
    if(!api||typeof api.getPracticeReviewQueue!=='function')return;
    ctx.state.remoteReviewLoadedAt=Date.now();
    api.getPracticeReviewQueue().then(rows=>{
      if(rows===null){ctx.state.remoteReviewRows=null;}
      else{ctx.state.remoteReviewRows=rows;}
      ctx.render();
    }).catch(error=>{
      console.warn('[Koepanda] review sync unavailable:',error);
      ctx.state.remoteReviewRows=null;
    });
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
    if(isFullChallenge&&window.KoepandaRewardReveal){
      window.KoepandaRewardReveal.award(ctx,{claimToken:quizClaimToken,score:quizScore,total:quizSet.length,activityKey:'practice.mini-quiz'});
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
