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

  function showMap(data) {
    main.innerHTML = heading('準4級のぼうけん', `${data.units.length}テーマ・${data.vocabulary_entries.length}の基礎語句から始めよう。`) +
      `<nav class="pre4-tools" aria-label="テストと復習"><a class="pre4-button pre4-primary" href="${route('exam')}">模試・分野別練習</a>
      <a class="pre4-button" href="${route('past')}">公式過去問</a>
      <a class="pre4-button" href="./practice-session.html?reviewLesson=pre4">まちがいレッスン</a></nav>
      <details class="pr-footnote"><summary>準4級までの進め方</summary>
        <ol><li>各レッスンで語句の意味と発音を覚え、小テストで確かめる。</li>
        <li>模試を解き、まちがいレッスンで苦手を直す。簡体字は紙にも書いて練習する。</li>
        <li>初めて見る模試や過去問を50分で解き、聞き取りと筆記を通して安定して得点できるか確かめる。</li></ol></details>
      <ol class="pr-map-list">${data.units.map((unit, index) => node(route(unit.unit_id), index + 1,
        unit.title_ja, unit.entry_ids.length + '語句')).join('')}</ol>`;
  }

  function showExam() {
    setBack('./pre4.html','準4級のルートへ戻る');
    main.innerHTML = heading('準4級の模試と練習', '本番を想定して、模試は50分を目安に。苦手な形式は5問ずつ練習できます。') +
      `<ol class="pr-map-list">${[1,2,3].map(round =>
        node(quiz('mock','paper',round), round, '模擬試験 第'+round+'回', '聞き取り25問・筆記20問')).join('')}</ol>
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
    main.innerHTML = heading(unit.title_ja, `レッスン ${number}`) +
      `<section class="pre4-card">
      <nav class="pre4-word-nav" aria-label="ことばの切り替え">
      <button class="pre4-button" type="button" id="pre4Prev" aria-label="前のことば">‹</button>
      <span id="pre4Count"></span>
      <button class="pre4-button" type="button" id="pre4Next" aria-label="次のことば">›</button>
      </nav><div id="pre4Word" aria-live="polite"></div>
      <button class="pre4-button" type="button" id="pre4Audio">🔊 発音を聞く</button>
      <p id="pre4AudioStatus" role="status" hidden></p>
      <div class="pre4-tools"><a class="pre4-button pre4-primary" href="${quiz(unit.unit_id,'lesson',number)}">小テストへ</a></div></section>${lookup.example(unit)}`;

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
      word.innerHTML = `<p><ruby lang="zh-CN">${escape(current.simplified)}<rt>${escape(current.pinyin)}</rt></ruby></p>
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
      if (!unitId) { showMap(data); return; }
      setBack('./pre4.html', '準4級のルートへ戻る');
      const unit = data.units.find(item => item.unit_id === unitId);
      if (!unit) throw Error('単元が見つかりません。');
      const lessons = window.KP_PRE4.lessons(data, unit);
      const number = Number(params.get('lesson'));
      if (params.has('lesson')) {
        if (!lessons[number - 1]) throw Error('レッスンが見つかりません。');
        showLesson(unit, number, lessons[number - 1]);
        return;
      }
      main.innerHTML = heading(unit.title_ja, 'ことばを聞いて、小テストで確かめよう。') + lookup.example(unit) +
        `<ol class="pr-map-list pre4-lesson-list">${lessons.map((words, index) => node(
          route(unit.unit_id, index + 1), index + 1, 'レッスン ' + (index + 1),
          words.map(word => word.simplified).join('・'))).join('')}</ol>`;
    } catch (error) {
      main.innerHTML = '<p class="pr-empty" role="alert"></p><a class="pre4-button" href="./pre4.html">準4級のルートへ戻る</a>';
      main.querySelector('p').textContent = error.message;
    } finally {
      main.removeAttribute('aria-busy');
    }
  }
  start();
})();
