(() => {
 'use strict';
 const descriptions={
  pre4:{goal:'身近なことを短い中国語で聞き、話し、読めるようになろう。',topics:'あいさつ・自己紹介、家族、数字・日付・時刻、日常生活、基本文型、助詞・量詞・介詞・副詞、買い物、食事、道案内、お願い・体調。',note:'漢字は語句・例文に登場する異なる字の数です。専用の書き取り教材・辞書全体の収録数とは異なります。語句には教材に登録された語句と例文の重点語句を含みます。'},
  grade4:{goal:'日常の会話を理解し、経験・予定・考えを自分のことばで伝えよう。',topics:'人や仕事の紹介、日常の習慣と経験、文法・文型、買い物と食事、交通・道案内、気持ちとお願い。会話、聞き取り、読解、語順、簡体字、日中翻訳を練習します。',note:'漢字は重点語句・例文・章末の文章に登場する異なる字の数です。語句は重点語句の数で、辞書全体や文章中の参照語句を含めません。準4級との累計は重複を除いています。'}
 };
 const n=x=>Number(x).toLocaleString('ja-JP');
 function markup(level){const d=window.KP_COURSE_OVERVIEW_DATA?.[level],c=descriptions[level];if(!d||!c)return '';
  const metric=(label,count,unit)=>`<div class="kp-course-metric"><span>${label}</span><strong>${n(count)}<small>${unit}</small></strong></div>`;
  const grade=level==='grade4';
  const rows=grade?[
    ['常用語約1,000語',`準4級から累計${n(d.cumulativeWords)}語句。本級の重点${d.words}語句（新出${d.newWords}）。${d.vocabGroups}組で意味・聞き取り・手書きを練習。`],
    ['日常の問答・長めの会話の聞き取り','各課の会話音声、章末の聴解12問、模試の聴解60問。'],
    ['ピンイン・声調','48課で発音を確認。模試は声調比較15問・ピンイン15問。'],
    ['基本文法・単文の組み立て','48課で文法穴埋めと整句を各48問。模試は穴埋め30問、文の選択15問、整句15問。'],
    ['長めの文章の読解','章末12篇と、模試の長文3篇・18問。'],
    ['日本語から中国語への記述','48課で作文し、解答例と照合。模試でも12問。']
  ]:[
    ['基本単語約500語・あいさつ約80語',`本コースに${d.words}語句。あいさつ・自己紹介から生活場面へ進みます。`],
    ['基礎的な聞き取り','会話の聞き取りと音声選択。模試は各回25問のリスニング。'],
    ['ピンイン・声調、基本文法・単文の組み立て','読み方、文脈の穴埋め、語順を小課時と模試で練習。'],
    ['簡体字の書き取り','漢字の筆順・臨写に加え、模試で手書き解答。']
  ];
  return `<section class="kp-course-overview"><h2>中検${grade?'4級':'準4級'}の出題内容</h2><p>${rows.map(r=>r[0]).join(' ／ ')}</p><small><a href="https://www.chuken.gr.jp/tcp/grade">日本中国語検定協会の出題内容</a></small><h2>コースの対応と学習量</h2><p>${grade?`全12章・48課＋語彙60組。課内384問、語彙1,260問、章末24問、模試3回180問。`:`全${d.topics}テーマ・${d.lessons}課。課内${d.lessonQuestions}問、模試3回141問。`}</p><details><summary>出題項目ごとの学習内容</summary><dl>${rows.map(([k,v])=>`<dt><strong>${k}</strong></dt><dd>${v}</dd>`).join('')}</dl><p>本級の例文 ${d.sentences}文・掲載漢字 ${d.characters}字。${grade?`準4級からの累計例文は${d.cumulativeSentences}文。`:''}語句数は教材内で重複を除いた数です。</p></details></section>`;

 }
 window.KP_COURSE_OVERVIEW={markup};
})();
