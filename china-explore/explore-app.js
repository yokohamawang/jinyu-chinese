const app = document.getElementById('app');
const embedded = window.parent !== window;
const lessons = { ...places, ...features, ...foodCultureLessons };
let topic = null;
let place = null;
let scene = 0;
let answer = null;
let readingRate = .22;

function readingSpeed() {
  return `<label class="reading-speed">再生速度
    <select data-reading-speed>
      <option value="0.22" ${readingRate === .22 ? 'selected' : ''}>ゆっくり</option>
      <option value="0.45" ${readingRate === .45 ? 'selected' : ''}>ふつう</option>
    </select>
  </label>`;
}

function title([text, reading, translation], level = 'div') {
  return `<${level} class="zh" lang="zh-Hans">${text}</${level}><span class="py">${reading}</span><span class="jp">${translation}</span>`;
}

function readButton(text) {
  const speech = text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  return `<button type="button" class="listen" data-say="${speech}" aria-label="中国語を聞く" aria-pressed="false">
    <span aria-hidden="true">♪</span><span class="listen-label">聞く</span>
  </button>`;
}

function bilingual(copy, level) {
  return `<div class="bilingual"><div class="copy-text">${title(copy, level)}</div>${readButton(copy[0])}</div>`;
}

function photo(key, alt, caption = '') {
  const image = photos[key];
  if (!image) return '';
  if (image.illustrated) {
    return `<figure class="photo food-illustration">
      <img src="${image.url}" alt="${alt}" width="${image.width}" height="${image.height}" decoding="async" loading="lazy">
      <figcaption>${caption} · イメージイラスト</figcaption>
    </figure>`;
  }
  const licenseUrl = image.license === 'pd'
    ? image.file
    : `https://creativecommons.org/licenses/${image.license}/`;
  const licenseLabel = image.license === 'pd' ? 'Public domain' : `CC ${image.license.replace('/', ' ').toUpperCase()}`;
  const resized = image.url.startsWith('./photos/') ? ' · サイズ調整' : '';
  return `<figure class="photo">
    <img src="${image.url}" alt="${alt}" decoding="async" loading="lazy" referrerpolicy="no-referrer">
    <figcaption>${caption ? `<span class="photo-label" lang="zh-Hans">${caption}</span>` : ''}<a href="${image.file}" target="_blank" rel="noopener">${image.author}</a> ·
    <a href="${licenseUrl}" target="_blank" rel="noopener">${licenseLabel}</a>${resized}</figcaption>
  </figure>`;
}

function source([label, url]) {
  return `<a class="source" href="${url}" target="_blank" rel="noopener">${label} ↗</a>`;
}

function reportLayout(reset = false, sectionTop) {
  if (!embedded) return;
  window.parent.postMessage({
    type: 'koepanda-explore-layout',
    height: app.getBoundingClientRect().height,
    reset,
    sectionTop
  }, location.origin);
}

function topicCards() {
  return `<header class="hero"><h1 lang="zh-Hans">中国探索</h1><p>中国の風景・食文化・物語を、中国語で。</p></header>
    <div class="grid">${topics.map(({ id, title: [name, reading, label] }) => `
      <button type="button" class="topic ${id}" data-topic="${id}">
        <span class="visual" lang="zh-Hans">${name}</span>
        <span class="topic-body"><span class="py">${reading}</span><span class="jp">${label}</span></span>
      </button>`).join('')}</div>`;
}

function lessonList(ids) {
  return `<div class="lessons">${ids.map(id => `
    <button type="button" class="lesson" data-place="${id}">
      ${lessons[id].thumbnail ? `<img class="lesson-thumbnail" src="${photos[lessons[id].thumbnail].url}" alt="" decoding="async" loading="lazy">` : ''}
      <span>${title(lessons[id].name, 'span')}</span><span class="arrow" aria-hidden="true">›</span>
    </button>`).join('')}</div>`;
}

function placeList() {
  const list = topic.groups
    ? topic.groups.map(([heading, ids]) => `<section class="lesson-group"><h2>${heading}</h2>${lessonList(ids)}</section>`).join('')
    : lessonList(topic.places);
  return `<button type="button" class="back" data-back>‹ テーマ一覧</button>
    <header class="hero ${topic.id}">${bilingual(topic.title, 'h1')}${readingSpeed()}</header>
    ${list}`;
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

function chapter(heading, lines, photos = [], index) {
  return `<section class="pane"${index === undefined ? '' : ` id="chapter-${index}"`}><h2>${heading}</h2>${photos.length ? `<div class="chapter-photos">${photos.map(([key, caption]) => photo(key, caption, caption)).join('')}</div>` : ''}${lines.map(copy => bilingual(copy)).join('')}</section>`;
}

function exercise(question, options, correct, explanation, audio = '') {
  return `<fieldset class="lesson-exercise" data-correct="${correct}">
      <legend>${question}</legend>
      ${audio ? readButton(audio) : ''}
      <div class="choices">${options.map((option, i) => `<button type="button" data-lesson-choice="${i}" aria-pressed="false">${option}</button>`).join('')}</div>
      <p class="feedback" role="status"></p>
      <template>${explanation}</template>
    </fieldset>`;
}

function shadowing(copy) {
  return `<details class="shadowing">
    <summary>一文をまねしてみる</summary>
    <div class="shadowing-prompt">
      ${bilingual(copy)}
      <div class="shadowing-actions">
        <button type="button" data-shadow-record aria-pressed="false">● 録音する</button>
        <button type="button" data-shadow-replay hidden>▶ 自分の声を聞く</button>
      </div>
      <p class="shadowing-status" role="status"></p>
    </div>
  </details>`;
}

let recording = null;

function disposeRecording() {
  if (!recording) return;
  const { controller, container, button, replay, note } = recording;
  recording = null;
  controller.dispose();
  button.disabled = false;
  button.textContent = '● 録音する';
  button.classList.remove('is-recording');
  button.setAttribute('aria-pressed', 'false');
  button.removeAttribute('aria-busy');
  replay.hidden = true;
  note.textContent = '';
  container.querySelector('.listen').disabled = false;
}

function shadowAction(button) {
  const container = button.closest('.shadowing');
  if (button.hasAttribute('data-shadow-replay')) {
    if (recording?.container === container) recording.controller.play();
    return;
  }
  if (recording?.container !== container) {
    disposeRecording();
    const replay = container.querySelector('[data-shadow-replay]');
    const note = container.querySelector('.shadowing-status');
    const controller = window.KoepandaPracticeRecorder.create({
      button, replay, note, bind: false,
      listenButtons: [container.querySelector('.listen')],
      beforeRecord: stopSpeaking,
      beforeReplay: stopSpeaking
    });
    recording = { controller, container, button, replay, note };
  }
  recording.controller.toggle();
}

function reviewContent() {
  const id = Object.keys(lessons).find(key => lessons[key] === place);
  const extra = lessonReview[id];
  const practiceWords = practiceVocabulary[id] || place.words;
  const vocabulary = [...(place.words || extra.words), ...(additionalWords[id] || []), ...practiceWords];
  const words = [...new Map(vocabulary.map(word => [word[0], word])).values()];
  const meaningChoices = words.filter((word, i) => words.findIndex(entry => entry[2] === word[2]) === i);
  const listeningCount = place.extraGaps ? Math.floor(meaningChoices.length / 3) : 2;
  const listeningWords = meaningChoices.slice(-listeningCount * 3);
  const listeningGroups = Array.from({ length: listeningCount }, (_, i) => listeningWords.slice(i * 3, i * 3 + 3));
  const listening = listeningGroups.map((options, round) => {
    const correct = (round + 1) % 3;
    const [chinese, pinyin, meaning] = options[correct];
    return exercise('聞こえた中国語の意味は？', options.map(word => word[2]), correct, `${chinese}（${pinyin}）は「${meaning}」。`, chinese);
  }).join('');
  const [sentence, options, correct, reason] = lessonExercises[id];
  const [question, explanation] = place.check || extra.check;
  const task = place.task || extra?.task || [
    'この場所を初めて訪れる友達に、中国語で一文紹介しましょう。',
    place.intro[0]
  ];
  const dictation = practiceWords[0];
  return `<section class="pane">
      <h2>ことばを確認</h2>
      <div class="word-list">${words.map(copy => bilingual(copy)).join('')}</div>
    </section>
    <section class="pane">
      <h2>聞いて選ぶ</h2>
      ${listening}
    </section>
    <section class="pane">
      <h2>文の中で使う</h2>
      ${exercise(sentence, options, correct, reason)}
      ${(place.extraGaps || []).map(args => exercise(...args)).join('')}
      <form class="lesson-exercise dictation" data-word="${dictation[0]}">
        <label for="lesson-dictation">聞いて漢字を入力</label>
        <div>${readButton(dictation[0])}</div>
        <input id="lesson-dictation" name="word" type="text" lang="zh-Hans" autocomplete="off" required>
        <button type="submit">答え合わせ</button>
        <p class="feedback" role="status"></p>
        <details><summary>ヒント・答え</summary>${bilingual(dictation)}</details>
      </form>
    </section>
    <section class="pane">
      <h2>読んで確かめる</h2>
      ${(place.readingExercises || []).map(args => exercise(...args)).join('')}
      <p class="speaking-task">${question}</p>
      <details class="model-answer"><summary>解説を見る</summary><p class="speaking-task">${explanation}</p></details>
    </section>
    ${task ? `<section class="pane">
      <h2>中国語で話してみよう</h2>
      <p class="speaking-task">${task[0]}</p>
      <details class="model-answer"><summary>回答例を見る</summary>${bilingual(task[1])}</details>
      ${shadowing(shadowingSentences[id] || task[1])}
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
  const chapters = place.chapters || (place === places.westlake ? westLakeStory : expandedReadings[place.name[0]] || []);
  const id = Object.keys(lessons).find(key => lessons[key] === place);
  const refs = [...(attractionGuides[id] || []), ...(place.refs || [place.source, place.booking,
    place === places.westlake && ['中国無形文化遺産網 · 白蛇伝','https://www.ihchina.cn/project_details/12185.html']
  ].filter(Boolean))];
  return `<button type="button" class="back" data-back>‹ ${topic.title[2]}</button>
    <header class="hero ${topic.id}">${bilingual(place.name, 'h1')}${readingSpeed()}</header>
    <div class="feature-reading">
      ${chapters.length > 1 ? `<nav class="pane sight-overview" aria-label="この課の見どころ">
        <ol>${chapters.map(([heading], i) => `<li><button type="button" data-chapter="${i}">${heading}</button></li>`).join('')}</ol>
      </nav>` : ''}
      ${place.sights ? '' : photo(place.photo, place.caption || place.name[0], place.caption)}
      ${place.intro ? chapter('見どころ', place.intro) : ''}
      ${place.sights ? palaceRoute() : ''}
      ${chapters.map(([heading, lines, photos], i) => chapter(heading, lines, photos, i)).join('')}
      ${reviewContent()}
      ${refs.length ? `<details class="reading-sources"><summary>参考資料・公式案内</summary>
        <ul>${refs.map(ref => `<li>${source(ref)}</li>`).join('')}</ul></details>` : ''}
    </div>`;
}

function render(reset = true) {
  disposeRecording();
  stopSpeaking();
  app.innerHTML = (!topic ? topicCards() : !place ? placeList() : placePage()) + '<p class="speech-status" role="status"></p>';
  if (reset) {
    window.scrollTo(0, 0);
    const heading = app.querySelector('h1');
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
  reportLayout(reset);
}

let active = null;

// Use ruby bases as the spoken text. The pinyin annotations stay intact.
function spokenUnits(target, text) {
  if (!target) return [];
  if (!target.classList.contains('ruby-text') && !target.firstElementChild) {
    const fragment = document.createDocumentFragment();
    for (const character of target.textContent) {
      const unit = document.createElement('span');
      unit.textContent = character;
      fragment.append(unit);
    }
    target.replaceChildren(fragment);
  }
  let offset = 0;
  const elements = Array.from(target.children).flatMap(element =>
    element.matches('.kp-lookup-word') ? Array.from(element.children) : [element]);
  const units = elements.map(element => {
    const value = element.querySelector('rb')?.textContent ?? element.textContent;
    const unit = { element, value, offset };
    offset += value.length;
    return unit;
  });
  return units.map(unit => unit.value).join('') === text ? units : [];
}

function revealUnit(element) {
  const rect = element.getBoundingClientRect();
  if (embedded) {
    window.parent.postMessage({
      type: 'koepanda-explore-reading',
      top: rect.top,
      bottom: rect.bottom
    }, location.origin);
  } else if (rect.top < 10 || rect.bottom > (window.visualViewport?.height || window.innerHeight) - 18) {
    element.scrollIntoView({ block: 'nearest' });
  }
}

function highlight(request, offset, length = 1) {
  const selected = request.units.filter((unit, index, units) =>
    unit.offset < offset + length && (units[index + 1]?.offset ?? request.text.length) > offset);
  if (!selected.length) return;
  request.highlighted?.forEach(unit => unit.element.classList.remove('is-reading-char'));
  selected.forEach(unit => unit.element.classList.add('is-reading-char'));
  if (request.highlighted?.[0] !== selected[0]) revealUnit(selected[0].element);
  request.highlighted = selected;
}

function stopSpeaking() {
  const previous = active;
  active = null;
  if (!previous) return;
  clearTimeout(previous.timer);
  clearInterval(previous.fallback);
  previous.stop?.();
  previous.target?.classList.remove('is-reading');
  previous.highlighted?.forEach(unit => unit.element.classList.remove('is-reading-char'));
  previous.button.setAttribute('aria-pressed', 'false');
  previous.button.querySelector('.listen-label').textContent = '聞く';
}

function speak(button, restart = false) {
  const status = app.querySelector('.speech-status');
  const stopOnly = !restart && active?.button === button;
  stopSpeaking();
  status.textContent = '';
  if (stopOnly) return;

  const session = window.KP_AUDIO_SESSION;
  const text = button.dataset.say;
  const target = button.closest('.bilingual')?.querySelector('.zh');
  const request = { button, target, text, units: spokenUnits(target, text) };
  active = request;
  button.setAttribute('aria-pressed', 'true');
  button.querySelector('.listen-label').textContent = '停止';

  function finish(message = '') {
    if (active !== request) return;
    stopSpeaking();
    status.textContent = message;
  }

  const failed = () => finish('端末の中国語音声を再生できませんでした。中国語の音声設定を確認してください。');
  try {
    request.timer = setTimeout(failed, 5000);
    const stop = session.speakMandarin(text, {
      rate: target ? readingRate : undefined,
      onStart: () => {
        if (active !== request) return;
        clearTimeout(request.timer);
        target?.classList.add('is-reading');
        if (target && !request.units.length) revealUnit(target);
        if (!request.units.length || request.hasBoundary) return;
        // Follow the story player's cadence on voices without boundary events.
        let index = 0;
        highlight(request, 0);
        if (request.units.length > 1) {
          request.fallback = setInterval(() => {
            if (++index < request.units.length) highlight(request, request.units[index].offset);
            else clearInterval(request.fallback);
          }, Math.round(210 / readingRate));
        }
      },
      onBoundary: event => {
        if (active !== request || event.name === 'sentence' || !Number.isInteger(event.charIndex) ||
            event.charIndex < 0 || event.charIndex >= text.length) return;
        request.hasBoundary = true;
        clearInterval(request.fallback);
        highlight(request, event.charIndex, event.charLength || 1);
      },
      onEnd: () => finish(),
      onError: failed
    });
    if (active === request) request.stop = stop;
  } catch {
    failed();
  }
}

app.addEventListener('change', event => {
  if (!event.target.matches('[data-reading-speed]')) return;
  readingRate = event.target.value === '0.45' ? .45 : .22;
  if (active?.target) speak(active.button, true);
});

app.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button || button.matches('.kp-lookup-word')) return;
  if (button.matches('[data-shadow-record], [data-shadow-replay]')) return shadowAction(button);
  if (button.dataset.say) {
    if (recording) {
      if (recording.container.contains(button)) recording.controller.pauseReplay();
      else disposeRecording();
    }
    return speak(button);
  }
  stopLessonAudio();
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
  } else if (button.dataset.sight !== undefined || button.dataset.chapter !== undefined) {
    const target = button.dataset.sight !== undefined ? `sight-${button.dataset.sight}` : `chapter-${button.dataset.chapter}`;
    const stop = document.getElementById(target);
    if (stop) {
      stop.tabIndex = -1;
      stop.focus({ preventScroll: true });
      if (embedded) reportLayout(false, stop.getBoundingClientRect().top + window.scrollY);
      else stop.scrollIntoView({ block: 'start' });
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
  } else if (button.dataset.lessonChoice !== undefined) {
    const card = button.closest('.lesson-exercise');
    card.querySelectorAll('[data-lesson-choice]').forEach(choice => {
      choice.setAttribute('aria-pressed', String(choice === button));
    });
    const correct = button.dataset.lessonChoice === card.dataset.correct;
    card.querySelector('[role="status"]').textContent = correct
      ? `正解！ ${card.querySelector('template').content.textContent}`
      : 'もう一度、音や文の意味を確かめよう。';
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

app.addEventListener('submit', event => {
  const form = event.target;
  if (!form.matches('.dictation')) return;
  event.preventDefault();
  stopLessonAudio();
  const entered = form.elements.word.value.trim();
  form.querySelector('[role="status"]').textContent = entered === form.dataset.word
    ? `正解！「${form.dataset.word}」です。`
    : 'もう一度聞いて、漢字を確かめよう。';
});

app.addEventListener('error', event => {
  if (!event.target.matches('.photo img')) return;
  const figure = event.target.closest('figure');
  event.target.hidden = true;
  const fallback = document.createElement('a');
  fallback.className = 'photo-fallback';
  const credit = figure.querySelector('figcaption a');
  if (!credit) {
    figure.hidden = true;
    return;
  }
  fallback.href = credit.href;
  fallback.target = '_blank';
  fallback.rel = 'noopener';
  fallback.textContent = '写真を出典ページで見る';
  figure.prepend(fallback);
}, true);

function stopLessonAudio() {
  stopSpeaking();
  disposeRecording();
}
app.addEventListener('toggle', event => {
  if (event.target === recording?.container && !event.target.open) stopLessonAudio();
}, true);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopLessonAudio();
});
window.addEventListener('pagehide', stopLessonAudio);
window.addEventListener('message', event => {
  if (embedded && event.source === window.parent && event.origin === location.origin &&
      event.data?.type === 'koepanda-explore-stop') {
    window.KP_READING_LOOKUP?.close();
    stopLessonAudio();
  }
});
new ResizeObserver(() => reportLayout()).observe(app);
render();
