const app = document.getElementById('app');
const embedded = window.parent !== window;
const accents = { travel: '山', culture: '春', food: '味', story: '文' };
const examples = {
  travel: ['请问，入口在哪里？', 'Qǐng wèn, rù kǒu zài nǎ lǐ?', 'すみません、入口はどこですか。'],
  culture: ['你们怎么过春节？', 'Nǐ men zěn me guò Chūn jié?', '春節はどのように過ごしますか。'],
  food: ['请问，可以看看菜单吗？', 'Qǐng wèn, kě yǐ kàn kan cài dān ma?', 'メニューを見せてもらえますか。']
};
const cultureExamples = [
  examples.culture,
  ['请喝茶。', 'Qǐng hē chá.', 'お茶をどうぞ。'],
  ['我们慢慢走吧。', 'Wǒ men màn man zǒu ba.', 'ゆっくり歩きましょう。'],
  ['这里有一条小河。', 'Zhè lǐ yǒu yì tiáo xiǎo hé.', 'ここには小さな川があります。']
];
let topic = null;
let lesson = null;

function title(text, reading, translation, level = 'div') {
  return `<${level} class="zh" lang="zh-Hans">${text}</${level}><span class="py">${reading}</span><span class="jp">${translation}</span>`;
}

function reportLayout(reset = false) {
  if (!embedded) return;
  window.parent.postMessage({
    type: 'koepanda-explore-layout',
    height: app.getBoundingClientRect().height,
    reset
  }, location.origin);
}

function render(reset = true) {
  if (!topic) {
    app.innerHTML = `
      <header class="hero">${title('中国探索', 'Zhōng guó tàn suǒ', '中国の名所や暮らしを、中国語で。', 'h1')}</header>
      <div class="grid">${topics.map(item => `
        <button type="button" class="topic ${item.id}" data-topic="${item.id}">
          <span class="visual" aria-hidden="true">${accents[item.id]}</span>
          <span class="topic-body">${title(item.name, item.py, item.jp, 'span')}</span>
        </button>`).join('')}</div>`;
  } else if (lesson === null) {
    app.innerHTML = `
      <button type="button" class="back" data-back>‹ テーマ一覧</button>
      <header class="hero ${topic.id}">${title(topic.name, topic.py, topic.jp, 'h1')}</header>
      <h2>おためしレッスン</h2>
      <div class="lessons">${topic.lessons.map(([name, py, ja], index) => `
        <button type="button" class="lesson" data-lesson="${index}">
          <span>${title(name, py, ja, 'span')}</span><span class="arrow" aria-hidden="true">›</span>
        </button>`).join('')}</div>`;
  } else {
    const [name, py, ja] = topic.lessons[lesson];
    const example = topic.id === 'culture' ? cultureExamples[lesson] : examples[topic.id];
    app.innerHTML = `
      <button type="button" class="back" data-back>‹ レッスン一覧</button>
      <header class="hero ${topic.id}">${title(name, py, ja, 'h1')}</header>
      <section class="pane">
        <h2>使えるひとこと</h2>
        ${title(...example)}
        <button type="button" class="copy" data-copy>中国語をコピー</button>
        <p class="feedback" role="status"></p>
      </section>`;
  }
  if (reset) {
    if (!embedded) window.scrollTo(0, 0);
    app.querySelector('h1').tabIndex = -1;
    app.querySelector('h1').focus({ preventScroll: true });
  }
  reportLayout(reset);
}

app.addEventListener('click', async event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.hasAttribute('data-copy')) {
    const feedback = app.querySelector('.feedback');
    try {
      await navigator.clipboard.writeText(topic.id === 'culture' ? cultureExamples[lesson][0] : examples[topic.id][0]);
      feedback.textContent = 'コピーしました';
    } catch {
      feedback.textContent = '文章を長押ししてコピーできます。';
    }
    return;
  }
  if (button.hasAttribute('data-back')) {
    if (lesson !== null) lesson = null;
    else topic = null;
  } else if (button.dataset.topic === 'story') {
    if (embedded) window.parent.postMessage({ type: 'koepanda-open-existing-story' }, location.origin);
    else location.href = '../index.html?view=story';
    return;
  } else if (button.dataset.topic) {
    topic = topics.find(item => item.id === button.dataset.topic);
  } else if (button.dataset.lesson !== undefined) {
    lesson = Number(button.dataset.lesson);
  }
  render();
});

new ResizeObserver(() => reportLayout()).observe(app);
render(false);
