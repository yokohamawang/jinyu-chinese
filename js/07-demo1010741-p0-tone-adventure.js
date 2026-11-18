/* Four-tone listening guide and four-question check. */
(function(){
  'use strict';
  const tones=window.KOEPANDA_KIDS_FIRST_LESSON?.tones;
  if(!tones)return;

  function init(){
    const get=id=>document.getElementById(id);
    const lesson=get('p0ToneAdventure'), quiz=get('p0MiniGame');
    const listen=get('p0GameListen'), next=get('p0GameNext');
    const feedback=get('p0GameFeedback'), choices=get('p0GameChoices');
    const questions=[
      {pair:[0,1],answer:0}, {pair:[2,3],answer:3},
      {pair:[0,2],answer:2}, {pair:[1,3],answer:1}
    ];
    let round=0, score=0, attempted=false, answered=false, finished=false;
    let request=0, ready=false;

    function enableAnswers(enabled){
      ready=enabled;
      choices.querySelectorAll('button').forEach(button=>{button.disabled=!enabled;});
    }
    async function playQuestion(manual=false){
      if(answered||finished||lesson.hidden)return;
      const previouslyReady=ready;
      if(manual)enableAnswers(true);
      listen.textContent='🔊 読み込み中…';
      const ticket=++request;
      const audio=await window.koepandaPlayToneIntro(tones[questions[round].answer].tone);
      if(ticket!==request||lesson.hidden||answered||finished)return;
      if(audio){
        // The shared player resolves on playing, before trailing silence.
        enableAnswers(true);
        listen.textContent='🔊 再生中';
        const ended=()=>{if(ticket===request)listen.textContent='🔊 もういちど聞く';};
        if(audio.ended)ended(); else audio.addEventListener('ended',ended,{once:true});
      }else{
        enableAnswers(previouslyReady);
        listen.textContent='🔊 問題の音を聞く';
        feedback.textContent='音を聞いてから選んでね。';
      }
    }
    function finish(){
      finished=true;
      ++request;
      listen.hidden=true;
      choices.replaceChildren();
      feedback.textContent='四声のミニチェック終了！　初回で正解 '+score+' / 4';
      next.textContent='もう一度挑戦する';
      next.hidden=false;
      window.KP_PINYIN_CHAPTER_STATE?.markComplete('P0-U1');
      window.koepandaShowResultCelebration?.({
        score:score,total:4,kicker:'四声の聞き分け',title:'ミニチェック終了！',
        message:'4問できたね。スコアは最初に選んだ答えの正解数だよ。'
      });
    }
    function select(index,button){
      if(!ready||answered||finished)return;
      const answer=questions[round].answer;
      if(index!==answer){
        attempted=true;
        feedback.textContent='もう一度聞いて、選び直してね。';
        playQuestion();
        return;
      }
      if(!attempted)score++;
      answered=true;
      listen.textContent='🔊 もういちど聞く';
      ++request;
      enableAnswers(false);
      button.classList.add('is-good');
      if(round===questions.length-1){finish();return;}
      feedback.textContent='✨ 正解！ '+tones[answer].label+'（'+tones[answer].jp+'）';
      feedback.classList.add('is-good');
      next.hidden=false;
    }
    function render(){
      ++request;
      attempted=false; answered=false; ready=false;
      choices.replaceChildren();
      listen.hidden=false;
      listen.textContent='🔊 問題の音を聞く';
      next.hidden=true;
      next.textContent='つぎの音 →';
      feedback.className='p0-game-feedback';
      feedback.textContent='第'+(round+1)+'問 / 全4問 · 音を聞いて選ぼう';
      questions[round].pair.forEach(index=>{
        const tone=tones[index], button=document.createElement('button');
        button.type='button'; button.className='p0-game-choice'; button.disabled=true;
        button.dataset.tone=tone.tone;
        button.innerHTML='<strong>'+tone.mark+'</strong><small>'+tone.label+'・'+tone.jp+'</small>';
        button.addEventListener('click',()=>select(index,button));
        choices.appendChild(button);
      });
    }
    listen.addEventListener('click',()=>{
      if(answered&&!finished){window.koepandaPlayToneIntro(tones[questions[round].answer].tone);return;}
      playQuestion(true);
    });
    next.addEventListener('click',()=>{
      if(!answered&&!finished)return;
      if(finished){round=0; score=0; finished=false;}else{round++;}
      render();
      playQuestion(true);
    });
    const cards=lesson.querySelectorAll('.p0-road-card[data-tone]');
    const labels=['高く平ら','低めから一気に上へ','低く下げてから上がる','高い所から一気に下へ'];
    cards.forEach(card=>card.addEventListener('click',()=>{
      ++request;
      const number=Number(card.dataset.tone);
      cards.forEach(other=>other.classList.toggle('is-active',other===card));
      get('kidsToneHint').textContent=number+'声：'+labels[number-1]+'。道の形と音の動きをいっしょに感じよう。';
      window.koepandaPlayToneIntro(number);
    }));
    render();
    window.addEventListener('koepandaToneGuideClose',()=>{
      ++request;
      window.KP134?.stop();
      round=0; score=0; finished=false;
      render();
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
