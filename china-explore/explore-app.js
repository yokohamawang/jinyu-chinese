const app = document.getElementById('app');
const embedded = window.parent !== window;
const lessons = { ...places, ...features };
let topic = null;
let place = null;
let scene = 0;
let answer = null;

function title([text, reading, translation], level = 'div') {
  return `<${level} class="zh" lang="zh-Hans">${text}</${level}><span class="py">${reading}</span><span class="jp">${translation}</span>`;
}

function readButton(text) {
  return `<button type="button" class="listen" data-say="${text}" aria-label="中国語を聞く" aria-pressed="false">
    <span aria-hidden="true">♪</span><span class="listen-label">聞く</span>
  </button>`;
}

function bilingual(copy, level) {
  return `<div class="bilingual"><div class="copy-text">${title(copy, level)}</div>${readButton(copy[0])}</div>`;
}

function photo(key, alt, caption = '') {
  const image = photos[key];
  return `<figure class="photo">
    <img src="${image.url}" alt="${alt}" decoding="async" loading="lazy" referrerpolicy="no-referrer">
    <figcaption>${caption ? `<span class="photo-label" lang="zh-Hans">${caption}</span>` : ''}<a href="${image.file}" target="_blank" rel="noopener">${image.author}</a> ·
    <a href="https://creativecommons.org/licenses/${image.license}/" target="_blank" rel="noopener">CC ${image.license.replace('/', ' ').toUpperCase()}</a></figcaption>
  </figure>`;
}

function source([label, url]) {
  return `<a class="source" href="${url}" target="_blank" rel="noopener">${label} ↗</a>`;
}

function reportLayout(reset = false) {
  if (!embedded) return;
  window.parent.postMessage({
    type: 'koepanda-explore-layout',
    height: app.getBoundingClientRect().height,
    reset
  }, location.origin);
}

function topicCards() {
  return `<header class="hero"><h1 lang="zh-Hans">中国探索</h1><p>中国の風景と物語を、中国語で。</p></header>
    <div class="grid">${topics.map(({ id, title: [name, reading, label] }) => `
      <button type="button" class="topic ${id}" data-topic="${id}">
        <span class="visual" lang="zh-Hans">${name}</span>
        <span class="topic-body"><span class="py">${reading}</span><span class="jp">${label}</span></span>
      </button>`).join('')}</div>`;
}

function placeList() {
  return `<button type="button" class="back" data-back>‹ テーマ一覧</button>
    <header class="hero ${topic.id}">${bilingual(topic.title, 'h1')}</header>
    <div class="lessons">${topic.places.map(id => `
      <button type="button" class="lesson" data-place="${id}">
        <span>${title(lessons[id].name, 'span')}</span><span class="arrow" aria-hidden="true">›</span>
      </button>`).join('')}</div>`;
}

function dialogue() {
  const current = place.scenes[scene];
  return `<section class="pane">
    <div class="scene-top"><h2>${current.situation}</h2><span>${scene + 1} / ${place.scenes.length}</span></div>
    ${current.lines.map((line, i) => `<div class="dialogue"><span class="role">${(scene === 1 ? ['小音老师', '旅行者'] : ['旅行者', '小音老师'])[i]}</span>${bilingual(line)}</div>`).join('')}
    <h3>この場面ではどうする？</h3>
    <div class="choices">${current.choices.map((choice, i) => `<button type="button" data-answer="${i}" aria-pressed="${answer === i}">${choice}</button>`).join('')}</div>
    <p class="feedback" role="status">${answer === null ? '' : answer === current.answer ? '正解！ もう一度聞いて、声に出してみよう。' : '返事の中国語をもう一度聞いてみよう。'}</p>
    <nav class="pager" aria-label="会話練習">
      <button type="button" data-scene="${scene - 1}" ${scene === 0 ? 'disabled' : ''}>‹ 前の場面</button>
      <button type="button" data-scene="${scene + 1}" ${scene === place.scenes.length - 1 ? 'disabled' : ''}>次の場面 ›</button>
    </nav>
  </section>`;
}

function chapter(heading, lines) {
  return `<section class="pane"><h2>${heading}</h2>${lines.map(copy => bilingual(copy)).join('')}</section>`;
}

function reviewContent() {
  const id = Object.keys(lessons).find(key => lessons[key] === place);
  const extra = lessonReview[id];
  const words = [...(place.words || extra.words), ...(additionalWords[id] || [])];
  const [question, explanation] = place.check || extra.check;
  const task = place.task || extra?.task;
  return `<section class="pane">
      <h2>ことばを確認</h2>
      <div class="word-list">${words.map(copy => bilingual(copy)).join('')}</div>
    </section>
    <section class="pane">
      <h2>読んで確かめる</h2>
      <p class="speaking-task">${question}</p>
      <details class="model-answer"><summary>解説を見る</summary><p class="speaking-task">${explanation}</p></details>
    </section>
    ${task ? `<section class="pane">
      <h2>中国語で話してみよう</h2>
      <p class="speaking-task">${task[0]}</p>
      <details class="model-answer"><summary>回答例を見る</summary>${bilingual(task[1])}</details>
    </section>` : ''}
    ${place.scenes ? `<h2 class="practice-heading">会話練習</h2>${dialogue()}` : ''}`;
}

function palaceRoute() {
  return `<section class="pane sight-overview">
      <h2>中軸線の見どころ</h2>
      <ol>${place.sights.map((sight, i) => `<li><button type="button" data-sight="${i}">${title(sight.name, 'span')}</button></li>`).join('')}</ol>
    </section>
    ${photo(place.photo, place.name[0])}
    ${chapter('見学の準備', place.guide)}
    ${place.sights.map((sight, i) => `<section class="pane" id="sight-${i}">
      ${bilingual(sight.name, 'h2')}
      ${sight.photo ? photo(sight.photo, sight.name[0]) : ''}
      ${sight.intro.map(copy => bilingual(copy)).join('')}
    </section>`).join('')}
    ${chapter('歩いたルートを振り返る', [place.takeaway])}`;
}

function placePage() {
  const chapters = place.chapters || (place === places.westlake ? westLakeStory : []);
  const refs = place.refs || [place.source, place.booking,
    place === places.westlake && ['中国無形文化遺産網 · 白蛇伝','https://www.ihchina.cn/project_details/12185.html']
  ].filter(Boolean);
  return `<button type="button" class="back" data-back>‹ ${topic.title[2]}</button>
    <header class="hero ${topic.id}">${bilingual(place.name, 'h1')}</header>
    <div class="feature-reading">
      ${place.sights ? '' : photo(place.photo, place.caption || place.name[0], place.caption)}
      ${place.intro ? chapter('見どころ', place.intro) : ''}
      ${place.sights ? palaceRoute() : ''}
      ${chapters.map(([heading, lines]) => chapter(heading, lines)).join('')}
      ${reviewContent()}
      ${refs.length ? `<details class="reading-sources"><summary>参考資料・公式案内</summary>
        <ul>${refs.map(ref => `<li>${source(ref)}</li>`).join('')}</ul></details>` : ''}
    </div>`;
}

function render(reset = true) {
  app.innerHTML = (!topic ? topicCards() : !place ? placeList() : placePage()) + '<p class="speech-status" role="status"></p>';
  if (reset) {
    if (!embedded) window.scrollTo(0, 0);
    const heading = app.querySelector('h1');
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
  reportLayout(reset);
}

let active = null;
function stopSpeaking() {
  const previous = active;
  active = null;
  if (previous) {
    previous.button.setAttribute('aria-pressed', 'false');
    previous.button.querySelector('.listen-label').textContent = '聞く';
    window.speechSynthesis.cancel();
  }
}

function speak(button) {
  const status = app.querySelector('.speech-status');
  const stopOnly = active?.button === button;
  stopSpeaking();
  status.textContent = '';
  if (stopOnly) return;
  const synth = window.speechSynthesis;
  if (!synth || !window.SpeechSynthesisUtterance) {
    status.textContent = 'このブラウザでは読み上げを利用できません。';
    return;
  }
  const utterance = new window.SpeechSynthesisUtterance(button.dataset.say);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.8;
  const voices = synth.getVoices();
  const voice = voices.find(item => /^zh[-_](CN|Hans)/i.test(item.lang))
    || voices.find(item => /^(zh)([-_]|$)/i.test(item.lang));
  if (voice) utterance.voice = voice;
  const request = { button, utterance };
  active = request;
  button.setAttribute('aria-pressed', 'true');
  button.querySelector('.listen-label').textContent = '停止';
  const finish = error => {
    if (active !== request) return;
    active = null;
    button.setAttribute('aria-pressed', 'false');
    button.querySelector('.listen-label').textContent = '聞く';
    if (error) status.textContent = '読み上げに失敗しました。端末の中国語音声設定をご確認ください。';
  };
  utterance.onend = () => finish(false);
  utterance.onerror = () => finish(true);
  try { synth.speak(utterance); } catch { finish(true); }
}

app.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.say) return speak(button);
  stopSpeaking();
  if (button.hasAttribute('data-back')) {
    if (place) place = null;
    else topic = null;
  } else if (button.dataset.topic === 'story') {
    if (embedded) window.parent.postMessage({ type: 'koepanda-open-existing-story' }, location.origin);
    else location.href = '../index.html?view=story';
    return;
  } else if (button.dataset.topic) {
    topic = topics.find(item => item.id === button.dataset.topic);
  } else if (button.dataset.place) {
    place = lessons[button.dataset.place];
    scene = 0;
    answer = null;
  } else if (button.dataset.sight !== undefined) {
    const stop = app.querySelector(`#sight-${button.dataset.sight}`);
    if (stop) {
      stop.tabIndex = -1;
      stop.focus({ preventScroll: true });
      stop.scrollIntoView({ block: 'center' });
    }
    return;
  } else if (button.dataset.scene !== undefined) {
    scene = Number(button.dataset.scene);
    answer = null;
    const current = button.closest('.pane');
    current.outerHTML = dialogue();
    reportLayout();
    app.querySelector('.scene-top h2')?.scrollIntoView({ block: 'nearest' });
    return;
  } else if (button.dataset.answer !== undefined) {
    answer = Number(button.dataset.answer);
    const current = place.scenes[scene];
    app.querySelectorAll('[data-answer]').forEach(choice => {
      choice.setAttribute('aria-pressed', String(Number(choice.dataset.answer) === answer));
    });
    app.querySelector('.feedback').textContent = answer === current.answer
      ? '正解！ もう一度聞いて、声に出してみよう。'
      : '返事の中国語をもう一度聞いてみよう。';
    return;
  }
  render();
});

window.addEventListener('pagehide', stopSpeaking);
new ResizeObserver(() => reportLayout()).observe(app);
render(false);
