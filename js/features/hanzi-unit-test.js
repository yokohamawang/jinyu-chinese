/* 301.351 — first Hanzi unit assessment, separate from the learning stages. */
(()=>{
  'use strict';
  const popup=document.createElement('section');
  popup.id='kp351Test';popup.className='kp351-test';popup.hidden=true;
  popup.setAttribute('role','dialog');popup.setAttribute('aria-modal','true');
  popup.setAttribute('aria-label','第一単元のまとめテスト');
  popup.innerHTML='<div class="kp351-test-card"><header><div><small>✦ 第一単元</small><h2>まとめテスト</h2></div><button type="button" id="kp351Close" aria-label="テストを閉じる">×</button></header><div id="kp351TestBody" class="kp351-test-body" aria-live="polite"></div></div>';
  document.body.append(popup);
  const body=popup.querySelector('#kp351TestBody');
  popup.querySelector('#kp351Close').onclick=()=>{popup.hidden=true};
  const shuffle=arr=>{
    const list=arr.slice();
    for(let i=list.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[list[i],list[j]]=[list[j],list[i]];}
    return list;
  };
  const add=(tag,className,text,parent=body)=>{
    const node=document.createElement(tag);if(className)node.className=className;
    if(text!==undefined)node.textContent=text;parent.append(node);return node;
  };
  const button=(label,action,kind='')=>{
    const node=add('button','kp351-action '+kind,label);node.type='button';node.onclick=action;return node;
  };
  let entries=[],questions=[],index=0,score=0,errors=[],locked=false;
  function prepare(){
    questions=shuffle(entries).map((item,i)=>{
      const type=i%2===0?'find-char':'find-reading';
      const options=shuffle([item,...shuffle(entries.filter(x=>x.char!==item.char)).slice(0,3)])
        .map(candidate=>({char:candidate.char,label:type==='find-char'?candidate.char:candidate.pinyin}));
      return {item,type,options};
    });
    index=0;score=0;errors=[];locked=false;
  }
  function renderIntro(){
    body.replaceChildren();
    add('div','kp351-mascot','🐼');
    add('h3','kp351-title','10文字、覚えたかな？');
    add('p','kp351-description','10問のミニテストです。8問以上正解でクリア！');
    add('p','kp351-description','間違えた問題は答えを確認できます。何度でも挑戦できます。');
    button('テストを始める',()=>{prepare();renderQuestion()},'primary');
  }
  function play(char){
    try{if(typeof playHanziSystemVoice==='function')playHanziSystemVoice(char);
      else if(typeof playHanziRecognitionCharacter==='function')playHanziRecognitionCharacter(char)}catch(_){}
  }
  function renderQuestion(){
    locked=false;body.replaceChildren();
    const q=questions[index],counter=add('div','kp351-counter',(index+1)+' / '+questions.length+'問');
    counter.setAttribute('aria-label','第'+(index+1)+'問');
    const progress=add('div','kp351-bar');const bar=add('span','',undefined,progress);
    bar.style.width=((index+1)/questions.length*100)+'%';
    add('h3','kp351-question',q.type==='find-char'?'この音の漢字はどれ？':'この漢字の読み方は？');
    const display=add('div','kp351-stimulus');
    const text=add('strong','',q.type==='find-char'?q.item.pinyin:q.item.char,display);
    if(q.type==='find-char')text.classList.add('is-pinyin');
    const audio=add('button','kp351-audio','🔊',display);audio.type='button';audio.setAttribute('aria-label','発音を聞く');
    audio.onclick=()=>play(q.item.char);
    const choices=add('div','kp351-options');
    q.options.forEach(option=>{
      const item=add('button','',option.label,choices);item.type='button';
      item.onclick=()=>{
        if(locked)return;locked=true;
        const correct=option.char===q.item.char;
        if(correct){score++;item.classList.add('is-correct');}
        else{errors.push(q.item);item.classList.add('is-wrong');}
        choices.querySelectorAll('button').forEach(b=>{b.disabled=true;if(b.textContent===(q.type==='find-char'?q.item.char:q.item.pinyin))b.classList.add('is-correct')});
        const feedback=add('p','kp351-feedback '+(correct?'good':'retry'),
          correct?'○ 正解！ よくできました。':'× 「'+q.item.char+'」の読み方は「'+q.item.pinyin+'」です。');
        const next=button(index===questions.length-1?'結果を見る':'次の問題へ',()=>{
          if(index===questions.length-1)renderResult();else{index++;renderQuestion();}
        },'primary');
        next.focus({preventScroll:true});
      };
    });
    if(index===0)play(q.item.char);
  }
  function renderResult(){
    body.replaceChildren();
    const passed=score>=8;
    add('div','kp351-mascot',passed?'🎉':'🌱');
    add('h3','kp351-title',passed?'合格！ よくがんばったね！':'あと少し！ もう一度やってみよう');
    add('div','kp351-score',score+' / '+questions.length+'問 正解');
    if(errors.length){
      add('p','kp351-description','間違えた漢字を確認しよう');
      const review=add('div','kp351-review');
      errors.forEach(item=>add('span','',item.char+' · '+item.pinyin,review));
    }
    if(passed){
      add('p','kp351-description','第一単元のテストに合格しました。ごほうびを受け取ろう！');
      button('合格を記録してごほうびへ',()=>{
        popup.hidden=true;
        window.dispatchEvent(new CustomEvent('kp-hanzi-unit-test-passed',{detail:{score,total:questions.length}}));
      },'primary');
    }else{
      button('もう一度チャレンジ',()=>{prepare();renderQuestion()},'primary');
      button('学習に戻る',()=>{popup.hidden=true});
    }
  }
  window.KP_HANZI_UNIT_TEST={
    open(chars){
      if(!Array.isArray(chars)||chars.length<4)return;
      entries=chars.map(char=>({char,pinyin:HANZI_LESSONS.find(x=>x.char===char)?.pinyin||''}));
      if(entries.some(item=>!item.pinyin))return;
      popup.hidden=false;renderIntro();
    },
    close(){popup.hidden=true}
  };
})();
