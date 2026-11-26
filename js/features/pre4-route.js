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

  function route(unit, lesson) {
    const query = new URLSearchParams({unit});
    if (lesson) query.set('lesson', lesson);
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
    {id:'hello', title:'あいさつと自己紹介', icon:'👋', preview:'名前・家族・学校', units:['u01','u02','u06','extra-01','extra-13']},
    {id:'daily', title:'毎日のことを話す', icon:'🕒', preview:'時間・習慣・食事', units:['u03','extra-02','u08','extra-07','extra-08','extra-04']},
    {id:'grammar', title:'文のつくり方', icon:'💬', preview:'語順・疑問・助詞・量詞・介詞・副詞', units:['u10','u11','particles','counters','prepositions','adverbs','extra-12']},
    {id:'town', title:'買い物とお出かけ', icon:'🧭', preview:'値段・持ち物・道案内', units:['u05','extra-06','extra-16','u07','extra-05','u04','extra-03','extra-09','extra-18','extra-19']},
    {id:'talk', title:'会話を広げる', icon:'🌱', preview:'天気・気持ち・頼み方', units:['u09','extra-10','extra-11','extra-14','extra-15','extra-17']}
  ];

  const chapterGoals = {
    "u01":["あいさつ・お礼・名前", "会ったときのあいさつ、お礼と返事、名前の聞き方を学びます。"],
    "u02":["友だちと家族の紹介", "家族や友だちが誰か、どこの国の人かを伝えます。"],
    "u06":["学校と使うことば", "授業や宿題のことばを覚え、学んでいる言語や話せる言語を伝えます。"],
    "extra-01":["家族の仕事ときょうだい", "家族の仕事と、きょうだいがいるかを話します。"],
    "extra-13":["聞き直す・迎える", "聞き取れなかったときに言い直しを頼み、お客さんを迎えます。"],
    "u03":["時刻と日付", "何時か、何月何日かを聞き、日にちと時刻を答えます。"],
    "extra-02":["予定を合わせる", "曜日と午前・午後を使って、集まる予定を決めます。"],
    "u08":["いつもすること", "朝起きる時間や、読む・書く・運動するなどの習慣を伝えます。"],
    "extra-07":["一日の流れ", "何かをしたあとにすることや、寝る時間を話します。"],
    "extra-08":["勉強と仕事の一日", "勉強する場所や、仕事が終わる時刻を伝えます。"],
    "extra-04":["朝ごはんと飲み物", "食べる物と飲む物を言い、飲み物を何杯頼むか伝えます。"],
    "u10":["文の土台「是・有・在」", "人や物を示し、「〜です」「持っている」「〜にいる」と伝えます。否定の形も学びます。"],
    "u11":["疑問・助詞・量詞", "疑問や文末の表現を使い分け、物に合う数え方を選びます。"],
    "particles":["助詞「的・吗・了」", "持ち主を示す、はい・いいえで聞く、変化を伝えるという三つの使い方を学びます。"],
    "counters":["量詞の使い分け", "本、飲み物、傘、服、動物などを、それぞれに合う量詞で数えます。"],
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

  const questionPatterns = [
    {title:'疑問・文末表現', summary:'几で数を聞く、还是で二つから選んでもらう、呢で聞き返す、吧で誘う。', example:'你喝茶还是咖啡？', translation:'お茶とコーヒー、どちらを飲みますか。'},
    {title:'量詞', summary:'個数は个、本は本、紙や券は张、服は件、ズボンなどは条。', example:'我买了两件衣服。', translation:'服を2着買いました。'}
  ];

  function wordSummary(words) {
    return words.map(word=>word.simplified).join('・');
  }

  function showUnit(unit, lessons, stations) {
    const hasCoreWords = lessons.length > 0;
    const patterns = unit.unit_id === 'pre4-u11' ? questionPatterns : null;
    const [title, goal] = chapterGoals[unit.unit_id.slice(5)];
    main.innerHTML = heading(title, goal) +
      (hasCoreWords ? `<section class="pre4-chapter-section" aria-labelledby="pre4-core">
        <h2 id="pre4-core">まず学ぶこと</h2>
        <ol class="pre4-core-lessons">${lessons.map((words,index)=>{
          const pattern=patterns?.[index];
          return `<li><a class="pre4-core-link" href="${route(unit.unit_id,index+1)}">
            <b>${pattern?.title || 'レッスン '+(index+1)}</b>
            <span lang="zh-Hans">${escape(wordSummary(words))}</span>
            ${pattern?`<small>${pattern.summary}</small>`:''}
            <span class="pre4-lesson-arrow" aria-hidden="true">›</span>
          </a></li>`;
        }).join('')}</ol></section>` : '') +
      `<section class="pre4-chapter-section" aria-labelledby="pre4-conversation">
        <h2 id="pre4-conversation">${hasCoreWords?'会話で使ってみる':'学ぶ順番'}</h2>
        <ol class="pr-map-list">${stations.map((item,index)=>node(
          stationHref(unit.unit_id,index),index+1,item.title,'約5分 · 例文とミニテスト')).join('')}</ol>
      </section>`;
  }

  function mapHref(stage, stop) {
    return './pre4.html?stage='+stage.id+(stop?'#'+stop:'');
  }

  function stationHref(unitId, index) {
    return route(unitId)+'&station='+(index+1);
  }

  function showMap() {
    const stage = stages.find(item => item.id === params.get('stage')) || stages[0];
    const nextStage = stages[stages.indexOf(stage)+1];
    main.classList.add('pre4-roadmap');
    main.innerHTML = `<h1 class="pre4-map-title">準4級のぼうけん</h1>
      <nav class="pre4-regions" aria-label="学習エリア">${stages.map(item => `
        <a class="pre4-region" href="${mapHref(item)}"${item===stage?' aria-current="page"':''}>
          <span class="pre4-region-icon" aria-hidden="true">${item.icon}</span>
          <span><b><span class="pre4-region-order">${stages.indexOf(item)+1}.</span> ${item.title}</b><small>${item.preview}</small></span>
        </a>`).join('')}</nav>
      <section class="pre4-region-route pre4-region-${stage.id}" aria-labelledby="pre4-region-heading">
        <h2 id="pre4-region-heading">${stage.title}</h2>
        <p class="pre4-region-note">1レッスン約5分 · 会話とミニテスト</p>
        <ol class="pre4-stops">${stage.units.map(id => {
          const unitId='pre4-'+id;
          const [title, goal]=chapterGoals[id];
          return `<li class="pre4-stop" id="${unitId}">
            <a class="pre4-stop-card pre4-chapter-link" href="${route(unitId)}">
              <h3>${escape(title)}</h3>
              <p>${escape(goal)}</p><span aria-hidden="true">›</span>
            </a>
          </li>`;
        }).join('')}</ol>
        ${nextStage?`<a class="pre4-next-region" href="${mapHref(nextStage)}">次は ${nextStage.title} <span aria-hidden="true">›</span></a>`:''}
      </section>
      <section class="pre4-map-review" aria-labelledby="pre4-review-heading">
        <h2 id="pre4-review-heading">模試と復習</h2>
        <nav class="pre4-tools" aria-labelledby="pre4-review-heading">
          <a class="pre4-button" href="${route('exam')}">模試・練習</a>
          <a class="pre4-button" href="${route('past')}">公式過去問</a>
          <a class="pre4-button" href="./practice-session.html?reviewLesson=pre4">まちがいレッスン</a>
        </nav>
      </section>`;
    const stop = document.getElementById(location.hash.slice(1));
    if (stop?.classList.contains('pre4-stop')) stop.scrollIntoView({block:'start'});
  }

  function showExam() {
    setBack('./pre4.html','準4級のルートへ戻る');
    main.innerHTML = heading('準4級の模試と練習', '模試は50分が目安です。1問ずつ答えを確認することも、最後にまとめて採点することもできます。') +
      `<ol class="pr-map-list">${[1,2,3].map(round =>
        node(quiz('mock','paper',round), round, '模擬試験 第'+round+'回', '聞き取り25問・筆記20問 · 自動採点・全問解説')).join('')}</ol>
      <h2>分野別練習</h2><ul class="pr-map-list">${window.KP_PRE4_MOCK.groups.map(([id,title,description]) =>
        node(quiz('mock',id), '›',title,description)).join('')}</ul><h2>短いテスト</h2>` +
      `<ul class="pr-map-list">
      ${node(quiz('exam','listening'), '耳', '聞き取り', 'あいさつ・問答・時刻・値段')}
      ${node(quiz('exam','written'), '文', '筆記', '語順・否定・助数詞・基本文型')}
      ${node(quiz('exam','dictation'), '字', '簡体字の書き取り', '音を聞いて、中国語キーボードで入力')}
      ${node(quiz('exam','mixed'), '✓', 'まとめテスト', '聞き取りと筆記から10問')}
      </ul>`;
  }

  function showLesson(unit, number, words) {
    setBack(route(unit.unit_id), 'レッスン一覧へ戻る');
    const pattern=unit.unit_id==='pre4-u11'?questionPatterns[number-1]:null;
    main.innerHTML = heading(unit.title_ja, pattern?.title || `レッスン ${number}`) +
      `<section class="pre4-card">
      <nav class="pre4-word-nav" aria-label="ことばの切り替え">
      <button class="pre4-button" type="button" id="pre4Prev" aria-label="前のことば">‹</button>
      <span id="pre4Count"></span>
      <button class="pre4-button" type="button" id="pre4Next" aria-label="次のことば">›</button>
      </nav><div id="pre4Word" aria-live="polite"></div>
      <button class="pre4-button" type="button" id="pre4Audio">🔊 発音を聞く</button>
      <p id="pre4AudioStatus" role="status" hidden></p>
      <div class="pre4-tools"><a class="pre4-button pre4-primary" href="${quiz(unit.unit_id,'lesson',number)}">小テストへ</a></div></section>${pattern?`<aside class="pre4-example"><h2>例文</h2>
      <p class="pre4-lookup-sentence" lang="zh-Hans">${window.KP_PRE4_PINYIN.html(pattern.example)}</p>
      <p class="jp">${pattern.translation}</p></aside>`:lookup.example(unit)}`;

    const previous = document.getElementById('pre4Prev');
    const next = document.getElementById('pre4Next');
    const count = document.getElementById('pre4Count');
    const word = document.getElementById('pre4Word');
    const status = document.getElementById('pre4AudioStatus');
    let index = 0;
    function renderWord() {
      window.speechSynthesis?.cancel();
      status.hidden = true;
      const current = words[index];
      count.textContent = `${index + 1} / ${words.length}`;
      previous.disabled = index === 0;
      next.disabled = index === words.length - 1;
      word.innerHTML = `<p>${window.KP_PRE4_PINYIN.html(current.simplified)}</p>
        <p>${escape(current.ja_meaning)}</p>`;
    }
    previous.onclick = () => { index--; renderWord(); };
    next.onclick = () => { index++; renderWord(); };
    document.getElementById('pre4Audio').onclick = () => {
      const synthesis = window.speechSynthesis;
      const showError = () => {
        status.textContent = '中国語の音声を再生できませんでした。';
        status.hidden = false;
      };
      if (!synthesis) { showError(); return; }
      synthesis.cancel();
      status.hidden = true;
      const current = index;
      const utterance = new SpeechSynthesisUtterance(words[current].simplified);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.88;
      const voice = synthesis.getVoices().find(item => /^zh[-_]CN$/i.test(item.lang));
      if (voice) utterance.voice = voice;
      utterance.onerror = event => {
        if (current === index && !['canceled','interrupted'].includes(event.error)) showError();
      };
      window.KP_AUDIO_SESSION?.preparePlayback();
      synthesis.speak(utterance);
    };
    window.addEventListener('pagehide', () => window.speechSynthesis?.cancel());
    renderWord();
  }

  function showStation(unit,number,item){
    setBack(route(unit.unit_id),'章の全体を見る');
    const lines=[item.ask,item.reply], translations=[item.jaAsk,item.jaReply];
    const glosses=dictionary;
    const endings=item.endings||[item.ask.some(w=>['谁','什么','吗','几','哪儿','几本','几口','几杯','几斤','几点','几月','几号','是不是','哪','多久','多少','怎么','怎么样','星期几','呢','还是','哪只'].includes(w))?'？':'。','。'];
    const sections=lines.map((line,i)=>{
      let offset=0;const py=window.KP_PRE4_PINYIN;const aligned=py.pairs(line.join(''));
      const tokens=line.map(w=>{const n=Array.from(w).length;const body=py.html(w,aligned.slice(offset,offset+n));offset+=n;return glosses.has(w)?'<button type="button" class="station-word" data-word="'+escape(w)+'">'+body+'</button>':body;}).join('');
      return '<div class="station-line"><p lang="zh-CN">'+tokens+py.html(endings[i])+'</p><button type="button" class="pre4-button" data-play="'+i+'">🔊 聞く</button><details><summary>日本語</summary>'+escape(translations[i])+'</details><p class="station-gloss" role="status"></p></div>';
    });
    main.innerHTML=heading(item.title,'会話 '+number+' ／ '+window.KP_PRE4_STATIONS[unit.unit_id].length+'　·　約5分')+'<section class="pre4-card station-card"><p>ことばを押すと、読み方と日本語の意味が見られます。</p>'+sections.join('')+
      '<label>再生速度 <select id="stationRate"><option value=".88">ふつう</option><option value=".65">ゆっくり</option></select></label><details><summary>ことばのヒント</summary>'+window.KP_PRE4_PINYIN.explanation(item.tip)+'</details><a class="pre4-button pre4-primary" href="'+quiz(unit.unit_id,'station',number)+'">4問にチャレンジ</a></section>';
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
      const utterance=new SpeechSynthesisUtterance(lines[i].join('')+endings[i]);
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
      const response = await fetch('./data/pre4-content-package-0.1.json');
      if (!response.ok) throw Error('教材が読み込めませんでした。');
      const data = await window.KP_PRE4.extend(await response.json());
      dictionary = lookup.words(data.vocabulary_entries);
      if (!unitId) { showMap(); return; }
      setBack('./pre4.html', '準4級のルートへ戻る');
      const unit = data.units.find(item => item.unit_id === unitId);
      if (!unit) throw Error('単元が見つかりません。');
      const stage=stages.find(item=>item.units.includes(unitId.slice(5)));
      if(stage)setBack(mapHref(stage,unitId),'学習ルートへ戻る');
      const lessons = window.KP_PRE4.lessons(data, unit);
      const stations=window.KP_PRE4_STATIONS[unitId];
      if(params.has('station')){
        const i=Number(params.get('station'));
        if(!stations[i-1])throw Error('会話が見つかりません。');
        showStation(unit,i,stations[i-1]);return;
      }
      const number = Number(params.get('lesson'));
      if (params.has('lesson')) {
        if (!lessons[number - 1]) throw Error('レッスンが見つかりません。');
        showLesson(unit, number, lessons[number - 1]);
        return;
      }
      showUnit(unit, lessons, stations);
    } catch (error) {
      main.innerHTML = '<p class="pr-empty" role="alert"></p><a class="pre4-button" href="./pre4.html">準4級のルートへ戻る</a>';
      main.querySelector('p').textContent = error.message;
    } finally {
      main.removeAttribute('aria-busy');
    }
  }
  start();
})();
