(() => {
 'use strict';
 const descriptions={
  pre4:{goal:'身近なことを短い中国語で聞き、話し、読めるようになろう。',topics:'あいさつ・自己紹介、家族、数字・日付・時刻、日常生活、基本文型、助詞・量詞・介詞・副詞、買い物、食事、道案内、お願い・体調。',note:'漢字は語句・例文に登場する異なる字の数です。専用の書き取り教材・辞書全体の収録数とは異なります。語句には教材に登録された語句と例文の重点語句を含みます。'},
  grade4:{goal:'日常の会話を理解し、経験・予定・考えを自分のことばで伝えよう。',topics:'人や仕事の紹介、日常の習慣と経験、文法・文型、買い物と食事、交通・道案内、気持ちとお願い。会話、聞き取り、読解、語順、簡体字、日中翻訳を練習します。',note:'漢字は重点語句・例文・章末の文章に登場する異なる字の数です。語句は重点語句の数で、辞書全体や文章中の参照語句を含めません。準4級との累計は重複を除いています。'}
 };
 const n=x=>Number(x).toLocaleString('ja-JP');
 function markup(level){const d=window.KP_COURSE_OVERVIEW_DATA?.[level],c=descriptions[level];if(!d||!c)return '';
  const metric=(label,count,unit)=>`<div class="kp-course-metric"><span>${label}</span><strong>${n(count)}<small>${unit}</small></strong></div>`;
  return `<section class="kp-course-overview" aria-label="コースの学習内容"><h2>このコースで学べること</h2><p>${c.goal}</p><div class="kp-course-metrics">${metric('掲載漢字',d.characters,'字')}${metric(level==='grade4'?'重点語句':'学習語句',d.words,'語')}${metric('例文',d.sentences,'文')}</div><details><summary>詳しい学習内容</summary><div class="kp-course-overview-details"><p>${c.topics}</p><dl><div><dt>レッスン</dt><dd>${n(d.lessons)} 回</dd></div><div><dt>レッスン練習</dt><dd>${n(d.lessonQuestions)} 問</dd></div>${level==='pre4'?`<div><dt>模擬試験</dt><dd>${n(d.mockPapers)} 回分</dd></div><div><dt>模擬試験の問題</dt><dd>${n(d.mockQuestions)} 問</dd></div>`:`<div><dt>章末の読解・聴解</dt><dd>${n(d.readingTexts)} 篇・${n(d.chapterQuestions)} 問</dd></div><div><dt>準4級からの新しい重点語句</dt><dd>${n(d.newWords)} 語</dd></div><div><dt>準4級からの累計語句</dt><dd>${n(d.cumulativeWords)} 語</dd></div><div><dt>準4級からの累計例文</dt><dd>${n(d.cumulativeSentences)} 文</dd></div>`}<div><dt>例文中で意味を確認できる語句</dt><dd>${n(d.sentenceWords)} 語</dd></div></dl><small>${c.note} 同じ語句・例文は1回だけ数え、練習問題はレッスンごとの出題数です。</small></div></details></section>`;
 }
 window.KP_COURSE_OVERVIEW={markup};
})();
