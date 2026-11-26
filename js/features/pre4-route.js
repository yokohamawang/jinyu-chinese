(() => {
  'use strict';
  const main = document.getElementById('pre4Main');
  const lookup = window.KP_PRE4_LOOKUP;
  let dictionary = lookup.words();
  lookup.mount(main,()=>dictionary);
  const back = document.getElementById('pre4Back');
  const params = new URLSearchParams(location.search);
  const escape = value => String(value).replace(/[&<>"']/g, c =>
    ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));

  function route(unit) {
    const query = new URLSearchParams({unit});
    return './pre4.html?' + query.toString();
  }

  function quiz(unit, mode, lesson) {
    const query = new URLSearchParams({track:'pre4', unit, mode});
    if (lesson) query.set('lesson', lesson);
    return './practice-session.html?' + query.toString();
  }

  function node(href, marker, title, description) {
    return `<li><a class="pr-node" href="${href}"><span class="pr-node-marker" aria-hidden="true">${escape(marker)}</span>
      <span class="pr-node-copy"><b>${escape(title)}</b><small>${escape(description)}</small></span>
      <span class="pr-node-arrow" aria-hidden="true">›</span></a></li>`;
  }

  function heading(title, subtitle) {
    return `<h1 class="pr-track-title">${escape(title)}</h1><p class="pr-track-subtitle">${escape(subtitle)}</p>`;
  }

  function setBack(href, label) {
    back.href = href;
    back.setAttribute('aria-label', label);
  }

  const stages = [
    {id:'hello', title:'あいさつと自己紹介', preview:'名前・家族・学校', units:['u01','u02','extra-01','u06','extra-13']},
    {id:'daily', title:'時刻・日付と毎日の生活', preview:'曜日・予定・食事・習慣', units:['u03','extra-02','u08','extra-04','extra-07','extra-08']},
    {id:'grammar', title:'文の組み立て', preview:'基本文・疑問・助詞・量詞・介詞・副詞', units:['u10','u11','particles','counters','prepositions','adverbs','extra-12']},
    {id:'town', title:'買い物と食事', preview:'注文・値段・色・会計', units:['u05','extra-06','extra-16','extra-19']},
    {id:'out', title:'場所とお出かけ', preview:'持ち物・乗り物・道案内', units:['u07','extra-05','u04','extra-03','extra-18','extra-09']},
    {id:'talk', title:'気持ち・体調・お願い', preview:'天気・体調・趣味・誘い方', units:['u09','extra-10','extra-17','extra-11','extra-14','extra-15']}
  ];

  const chapterGoals = {
    "u01":["あいさつ・お礼・名前", "会ったときのあいさつ、お礼と返事、名前の聞き方を学びます。"],
    "u02":["友だちと家族の紹介", "家族や友だちが誰か、どこの国の人かを伝えます。"],
    "u06":["学校と使うことば", "授業や宿題のことばを覚え、学んでいる言語や話せる言語を伝えます。"],
    "extra-01":["家族の仕事ときょうだい", "家族の仕事と、きょうだいがいるかを話します。"],
    "extra-13":["聞き直す・迎える", "聞き取れなかったときに言い直しを頼み、お客さんを迎えます。"],
    "u03":["時刻・日付・前後の日", "時刻、何月何日か、きのう・あしたなど前後の日を伝えます。"],
    "extra-02":["予定を合わせる", "曜日と午前・午後を使って、集まる予定を決めます。"],
    "u08":["いつもすること", "朝起きる時間や、読む・書く・運動するなどの習慣を伝えます。"],
    "extra-07":["一日の流れ", "何かをしたあとにすることや、寝る時間を話します。"],
    "extra-08":["勉強と仕事の一日", "勉強する場所や、仕事が終わる時刻を伝えます。"],
    "extra-04":["朝ごはんと飲み物", "食べる物と飲む物を言い、飲み物を何杯頼むか伝えます。"],
    "u10":["文の土台「是・有・在」", "人や物を示し、「〜です」「持っている」「〜にいる」と伝えます。否定の形も学びます。"],
    "u11":["質問のしかた", "数を尋ねる、聞き返す、二つから選んでもらう質問を学びます。"],
    "particles":["助詞「的・吗・了」", "持ち主を示す、はい・いいえで聞く、変化を伝えるという三つの使い方を学びます。"],
    "counters":["ものの数え方（量詞）", "人・物・動物・乗り物・食べ物を数え、重さ・金額・回数を伝えます。"],
    "prepositions":["介詞「在・用・从」", "どこで、何を使って、どこから、誰と行動するかを文に加えます。"],
    "adverbs":["副詞「也・都・已经」", "「私も」「みんな」「もう」を動詞の前に置き、否定の位置による意味の違いを学びます。"],
    "extra-12":["「もうした」と「今している」", "終わった行動と、今している行動を区別して話します。"],
    "u05":["注文と値段", "欲しい飲み物を頼み、本や服などの値段を尋ねます。"],
    "extra-06":["色を選ぶ・売り買いする", "欲しい色を伝え、声調で「买」と「卖」を聞き分けます。"],
    "extra-16":["買う量と合計金額", "重さを量って買い、会計の合計を聞き取ります。"],
    "u07":["持ち主と置き場所", "携帯電話などの持ち主と、本や持ち物の置き場所を尋ねます。"],
    "extra-05":["道具を探す・使う", "傘のありかを聞き、何を使うかを伝えます。"],
    "u04":["行き先と乗り物", "どこへ、どうやって行くかを伝えます。"],
    "extra-03":["道を聞く・案内する", "近くの建物を目印に場所を尋ね、進む方向を伝えます。"],
    "extra-09":["空港と乗り降り", "空港への交通手段や、どこで降りるかを伝えます。"],
    "extra-18":["所要時間と二択", "目的地までの時間を聞き、二つの選択肢から選んでもらいます。"],
    "extra-19":["食事の感想とお会計", "料理の辛さを尋ね、食後に会計を頼みます。"],
    "u09":["天気と今日の様子", "暑い、冷たい、疲れたなど、天気や自分の様子を伝えます。"],
    "extra-10":["外の寒さと体調", "外が寒いことや、体のどこが痛いかを伝えます。"],
    "extra-11":["味と気持ち", "料理がおいしいことや、自分の気持ちを伝えます。"],
    "extra-14":["休日の誘いと趣味", "休日の遊びに誘い、好きな音楽や活動を話します。"],
    "extra-15":["借りる・手伝いを頼む", "辞書を借りたり、困ったときに手伝いを頼んだりします。"],
    "extra-17":["薬と体の部位", "薬を探し、右手・左手など痛い場所を伝えます。"]
  };

  function showUnit(unit, stations) {
    const [title, goal] = chapterGoals[unit.unit_id.slice(5)];
    main.innerHTML = heading(title, goal) +
      `<section class="pre4-chapter-section" aria-labelledby="pre4-conversation">
        <h2 id="pre4-conversation">文で学ぶレッスン</h2>
        <ol class="pr-map-list">${stations.map((item,index)=>node(
          stationHref(unit.unit_id,index),index+1,item.title,item.sentences?.[0][1] || item.jaReply)).join('')}</ol>
      </section>`;
  }

  function mapHref(stage, stop) {
    return './pre4.html?stage='+stage.id+(stop?'#'+stop:'');
  }

  function stationHref(unitId, index) {
    return route(unitId)+'&station='+(index+1);
  }

  function showMap() {
    const stopId = location.hash.slice(1);
    const stage = stages.find(item => item.units.some(id => 'pre4-'+id === stopId)) ||
      stages.find(item => item.id === params.get('stage'));
    main.classList.add('pre4-roadmap');
    if (stage) {
      showStage(stage, stopId);
      return;
    }

    main.innerHTML = `<section class="pre4-intro">
      <div><h1>準4級への道</h1><p>文を聞いて、声に出して、使い方を学ぼう。</p></div>
      <img src="./assets/hanzi/teacher-speaking.webp" alt="">
    </section>
    <nav class="pre4-mode-nav" aria-label="準4級のメニュー">
      <a href="#pre4-learning" aria-current="page">レッスン</a>
      <a href="${route('practice')}">出題別練習</a>
      <a href="${route('exam')}">模擬試験</a>
    </nav>
    <section id="pre4-learning" aria-labelledby="pre4-learning-title">
      <h2 id="pre4-learning-title">学習コース</h2>
      <ol class="pre4-course-path">${stages.map((item, index) => `
        <li class="pre4-region-${item.id}">
          <a class="pre4-course-stop" href="${mapHref(item)}">
            <span class="pre4-course-number" aria-hidden="true">${index+1}</span>
            <span><strong>${item.title}</strong><small>${item.preview}</small></span>
            <span class="pre4-course-arrow" aria-hidden="true">›</span>
          </a>
        </li>`).join('')}</ol>
    </section>`;
  }

  function showStage(stage, stopId) {
    setBack('./pre4.html#pre4-learning','学習コースに戻る');
    const next = stages[stages.indexOf(stage)+1];
    const colorClass = 'pre4-region-'+stage.id;
    main.innerHTML = `<section class="pre4-stage ${colorClass}">${heading(stage.title,stage.preview)}
      <ol class="pre4-stops">${stage.units.map(id => {
        const unitId = 'pre4-'+id;
        const [title, goal] = chapterGoals[id];
        const count = window.KP_PRE4_STATIONS[unitId].length;
        return `<li class="pre4-stop" id="${unitId}">
          <a class="pre4-stop-card pre4-chapter-link" href="${route(unitId)}">
            <h3>${escape(title)}</h3><p>${escape(goal)}</p>
            <small>${count}レッスン</small><span aria-hidden="true">›</span>
          </a>
        </li>`;
      }).join('')}</ol>
      <a class="pre4-stage-next" href="${next?mapHref(next):route('exam')}">${next?'次のコースへ · '+next.title:'模擬試験へ'} <span aria-hidden="true">›</span></a>
    </section>`;
    if (stopId) document.getElementById(stopId)?.scrollIntoView({block:'start'});
  }

  function showExam() {
    setBack('./pre4.html','準4級のルートへ戻る');
    main.innerHTML = heading('模擬試験', '聞き取りと筆記を50分で解き、提出後に採点・解説を確認できます。') +
      `<ol class="pr-map-list">${[1,2,3].map(round =>
        node(quiz('mock','paper',round), round, '模擬試験 第'+round+'回', '聞き取り25問・筆記22解答 · 100点満点')).join('')}</ol>
      <nav class="pre4-tools" aria-label="試験の復習">
        <a class="pre4-button" href="${route('practice')}">出題別練習</a>
        <a class="pre4-button" href="${route('past')}">公式過去問を見る</a>
      </nav>`;
  }

  function showPractice() {
    setBack('./pre4.html','準4級のルートへ戻る');
    main.innerHTML = heading('出題別練習', '気になる出題形式を選んで練習できます。') +
      `<p><a class="pre4-button" href="./practice-session.html?reviewLesson=pre4">まちがいレッスン</a></p>
      <h2>聞き取り</h2><ul class="pr-map-list">${window.KP_PRE4_MOCK.listeningGroups.map(([id,title,description]) =>
        node(quiz('mock',id), '›',title,description)).join('')}</ul>
      <h2>筆記</h2><ul class="pr-map-list">${window.KP_PRE4_MOCK.writtenGroups.map(([id,title,description]) =>
        node(quiz('mock',id), '›',title,description)).join('')}</ul>`;
  }

  function sentenceTokens(text, words) {
    const tokens = [];
    for (let i=0; i<text.length;) {
      let length = Math.min(12,text.length-i);
      while (length>1 && !words.has(text.slice(i,i+length))) length--;
      tokens.push(text.slice(i,i+length));
      i += length;
    }
    return tokens;
  }

  function showStation(unit,number,item){
    setBack(route(unit.unit_id),'章の全体を見る');
    const glosses=dictionary;
    const supportingExamples = item.supportingExamples || [];
    const lines = item.sentences ? item.sentences.map(([text])=>sentenceTokens(text,glosses)) :
      [item.ask,item.reply,...supportingExamples.map(([text])=>sentenceTokens(text,glosses))];
    const translations = item.sentences ? item.sentences.map(([,translation])=>translation) : [item.jaAsk,item.jaReply,...supportingExamples.map(([,translation])=>translation)];
    const endings = item.sentences ? lines.map(()=>'') : item.endings ||[item.ask.some(w=>['谁','什么','吗','几','哪儿','几本','几口','几杯','几斤','几点','几月','几号','是不是','哪','多久','多少','怎么','怎么样','星期几','呢','还是','哪只'].includes(w))?'？':'。','。'];
    const sections=lines.map((line,i)=>{
      let offset=0;const py=window.KP_PRE4_PINYIN;const aligned=py.pairs(line.join(''));
      const tokens=line.map(w=>{const n=Array.from(w).length;const body=py.html(w,aligned.slice(offset,offset+n));offset+=n;return glosses.has(w)?'<button type="button" class="station-word" data-word="'+escape(w)+'">'+body+'</button>':body;}).join('');
      return '<div class="station-line"><p lang="zh-CN">'+tokens+py.html(endings[i] || '')+'</p><button type="button" class="pre4-button" data-play="'+i+'">🔊 聞く</button><details><summary>日本語</summary>'+escape(translations[i])+'</details><p class="station-gloss" role="status"></p></div>';
    });
    const quizCount = item.sentences ? item.sentences.length*2 : 4;
    main.innerHTML=heading(item.title,'レッスン '+number+' ／ '+window.KP_PRE4_STATIONS[unit.unit_id].length+'　·　約5分')+'<section class="pre4-card station-card">'+sections.join('')+'<p class="station-instruction">文の中のことばを押すと、日本語の意味と読み方を確認できます。</p>'+
      '<label>再生速度 <select id="stationRate"><option value=".88">ふつう</option><option value=".65">ゆっくり</option></select></label>' +
      (item.tip?'<details><summary>ことばのヒント</summary>'+window.KP_PRE4_PINYIN.explanation(item.tip)+'</details>':'') +
      '<a class="pre4-button pre4-primary" href="'+quiz(unit.unit_id,'station',number)+'">'+quizCount+'問にチャレンジ</a></section>';
    main.querySelectorAll('[data-word]').forEach(b=>b.onclick=()=>{
      const word=b.dataset.word;b.closest('.station-line').querySelector('[role=status]').textContent=word+'　'+glosses.get(word).join('　');
    });
    main.querySelectorAll('[data-play]').forEach(b=>b.onclick=()=>{
      const status=b.closest('.station-line').querySelector('[role=status]');
      if(!window.speechSynthesis){status.textContent='中国語音声を利用できません。';return;}
      const i=Number(b.dataset.play);speechSynthesis.cancel();
      main.querySelectorAll('.station-line.is-speaking').forEach(el=>el.classList.remove('is-speaking'));
      const line=b.closest('.station-line');const glyphs=Array.from(line.querySelectorAll('.pre4-ruby'));
      glyphs.forEach(el=>el.classList.remove('is-reading'));
      const clear=()=>{line.classList.remove('is-speaking');glyphs.forEach(el=>el.classList.remove('is-reading'));};
      const utterance=new SpeechSynthesisUtterance(lines[i].join('')+(endings[i] || ''));
      utterance.lang='zh-CN';utterance.rate=Number(document.getElementById('stationRate').value);
      utterance.onstart=()=>line.classList.add('is-speaking');
      utterance.onboundary=e=>{const offset=Array.from(utterance.text.slice(0,e.charIndex)).filter(c=>/\p{Script=Han}/u.test(c)).length;glyphs.forEach((el,j)=>el.classList.toggle('is-reading',j===offset));};
      utterance.onend=clear;utterance.onerror=e=>{clear();if(!['interrupted','canceled'].includes(e.error))status.textContent='音声を再生できませんでした。';};
      window.KP_AUDIO_SESSION?.preparePlayback();speechSynthesis.speak(utterance);
    });
    window.addEventListener('pagehide',()=>window.speechSynthesis?.cancel(),{once:true});
  }

  async function start() {
    try {
      const unitId = params.get('unit');
      if (unitId === 'past') {
        setBack('./pre4.html','準4級のルートへ戻る');
        window.KP_PRE4_PAST.render(main,heading);
        const selected=params.get('edition');
        const picker=document.getElementById('pre4PastEdition');
        if(Array.from(picker.options).some(option=>option.value===selected)){
          picker.value=selected;
          picker.onchange();
        }
        return;
      }
      if (unitId === 'exam') { showExam(); return; }
      if (unitId === 'practice') { showPractice(); return; }
      if (!unitId) { showMap(); return; }
      const response = await fetch('./data/pre4-content-package-0.1.json');
      if (!response.ok) throw Error('教材が読み込めませんでした。');
      const data = await window.KP_PRE4.extend(await response.json());
      dictionary = lookup.words(data.vocabulary_entries);
      setBack('./pre4.html', '準4級のルートへ戻る');
      const unit = data.units.find(item => item.unit_id === unitId);
      if (!unit) throw Error('単元が見つかりません。');
      const stage=stages.find(item=>item.units.includes(unitId.slice(5)));
      if(stage)setBack(mapHref(stage,unitId),'学習ルートへ戻る');
      const stations=window.KP_PRE4_STATIONS[unitId];
      if(params.has('station')){
        const i=Number(params.get('station'));
        if(!stations[i-1])throw Error('レッスンが見つかりません。');
        showStation(unit,i,stations[i-1]);return;
      }
      // Old vocabulary-card URLs now open the corresponding sentence lesson.
      const legacyLesson = Number(params.get('lesson'));
      if (stations[legacyLesson - 1]) {
        location.replace(stationHref(unitId, legacyLesson - 1));
        return;
      }
      showUnit(unit, stations);
    } catch (error) {
      main.innerHTML = '<p class="pr-empty" role="alert"></p><a class="pre4-button" href="./pre4.html">準4級のルートへ戻る</a>';
      main.querySelector('p').textContent = error.message;
    } finally {
      main.removeAttribute('aria-busy');
    }
  }
  start();
})();
