(() => {
  'use strict';
  const course = 'pre4-preparation';
  const prefix = 'pre4-prep:';
  const supplemental = [
    ['greeting', '聞こえたあいさつに合う返事は？', '', '谢谢！', '不客气。', ['对不起。', '晚安。', '没关系。'], '谢谢（ありがとう）への返事は、不客气（どういたしまして）です。'],
    ['name', '聞こえた質問に合う返事は？', '', '你叫什么名字？', '我叫王明。', ['我住在北京。', '我今年十岁。', '我喜欢喝茶。'], '「名前は何ですか？」と聞かれたら「我叫＋名前」で答えます。'],
    ['time', '聞こえた時刻は？', '', '现在是七点半。', '7時30分', ['7時15分', '8時30分', '6時30分'], '七点は7時、半は30分です。'],
    ['price', '聞こえた値段は？', '', '一共二十八块。', '合計28元', ['合計18元', '合計20元', '合計82元'], '二十八は28、块は会話で使う「元」の数え方です。'],
    ['date', '聞こえた日付は？', '', '今天是六月十五号。', '6月15日', ['5月16日', '6月5日', '6月25日'], '六月は6月、十五号は15日です。'],
    ['destination', '聞こえた質問に合う返事は？', '', '你去哪儿？', '我去学校。', ['我喝水。', '我姓李。', '我有一本书。'], '哪儿（どこ）は場所を尋ねることばです。学校に行くなら「我去学校」と答えます。'],
    ['negation', '「私は学生ではありません」に合うことばは？', '我＿＿学生。', '', '不是', ['不有', '没有', '是'], '「～ではない」は「不是＋名詞」。学生ではないので「我不是学生」です。'],
    ['have', '「私は兄がいません」に合うことばは？', '我＿＿哥哥。', '', '没有', ['不有', '不是', '有'], '有（いる・ある）の否定は「没有」です。'],
    ['question', '「あなたは中国語を話せますか？」に合うことばは？', '你会说汉语＿＿？', '', '吗', ['了', '的', '也'], '「はい・いいえ」で答える質問は、文末に「吗」を置いて作れます。'],
    ['counter', '「本を3冊買います」に合うことばは？', '我买三＿＿书。', '', '本', ['杯', '个', '岁'], '本を数えるときは「数＋本＋书」。三本书は本3冊です。'],
    ['location', '「彼は学校にいます」に合うことばは？', '他＿＿学校。', '', '在', ['去', '是', '喝'], '居場所は「人＋在＋場所」。去は「行く」を表します。'],
    ['order', '「私は毎日中国語を勉強します」の語順は？', '', '', '我每天学汉语。', ['我学每天汉语。', '我汉语学每天。', '学我每天汉语。'], 'この文は「主語＋時を表すことば＋動詞＋目的語」の順です。'],
    ['translate', '「いくらですか？」に合う中国語は？', '', '', '多少钱？', ['几点了？', '你去哪儿？', '你叫什么名字？'], '多少は「いくつ・いくら」、钱は「お金」です。']
  ];

  function stableChoices(answer, alternatives, shuffle) {
    const labels = [...new Set([answer, ...alternatives])].slice(0, 4);
    return shuffle(labels).map(label => ({id:label, label}));
  }

  function wordQuestion(entry, entries, mode, shuffle) {
    const {simplified, pinyin, ja_meaning} = entry;
    const field = {meaning:'ja_meaning', reading:'pinyin', listening:'simplified'}[mode];
    if (mode === 'dictation') {
      return {
        kind:'dictation', prompt:'聞こえたことばを簡体字で入力しよう', target:ja_meaning,
        audioText:simplified, answerId:simplified.replace(/[。！？!?]$/, ''),
        explain:`${simplified} · ${pinyin} · ${ja_meaning}`,
        reviewKey:`${prefix}${mode}:${entry.entry_id}`, course
      };
    }
    if (!field) return null;
    const answer = entry[field];
    const pool = shuffle(entries.filter(other => other.simplified !== simplified &&
      (mode !== 'listening' || other.pinyin.replace(/\s/g, '') !== pinyin.replace(/\s/g, ''))));
    const alternatives = pool.map(other => other[field]);
    const prompt = {
      meaning:'このことばの意味は？',
      reading:'このことばのピンインは？',
      listening:'聞こえたことばはどれ？'
    }[mode];
    return {
      kind:'choice', prompt, target:mode === 'listening' ? '' : simplified,
      audioText:mode === 'listening' ? simplified : '',
      answerId:answer, choices:stableChoices(answer, alternatives, shuffle),
      explain:`${simplified} · ${pinyin} · ${ja_meaning}`,
      reviewKey:`${prefix}${mode}:${entry.entry_id}`, course
    };
  }

  const extras = supplemental.map(([id, prompt, target, audioText, answerId, distractors, explain]) => ({
    kind:'choice', prompt, target, audioText, answerId, explain,
    choices:[answerId, ...distractors].map(label => ({id:label, label})),
    reviewKey:prefix + 'exercise:' + id, course
  }));

  function contextQuestion(item, unit, index, type, shuffle) {
    const [kind, offset] = type.split('-');
    const sentence = item.sentences[Number(offset)];
    if (!sentence || !['context','cloze'].includes(kind)) return null;
    const [text, translation, focus] = sentence;
    const listening = kind === 'context';
    const column = listening ? 1 : 2;
    const answer = sentence[column];
    const alternatives = item.sentences.filter(row => row !== sentence).map(row => row[column]);
    return {
      course, context:item.title, kind:'choice',
      prompt:listening ? '文を聞いて日本語の意味を選ぼう' : '日本語に合うように文を完成させよう',
      target:listening ? '' : translation+'　'+text.replace(focus,'＿＿'),
      audioText:listening ? text : '',
      answerId:answer, choices:stableChoices(answer,alternatives,shuffle),
      explain:text+'　'+translation,
      reviewKey:prefix+'station:'+unit+':'+index+':'+type
    };
  }

  function stationQuestions(unit, lesson, shuffle) {
    const index = lesson - 1;
    const item = window.KP_PRE4_STATIONS[unit]?.[index];
    if (!item) return [];
    const types = item.sentences ? item.sentences.flatMap((_,i) => ['context-'+i, 'cloze-'+i]) :
      ['sound', 'listen', 'gap', 'order'];
    return types.map(type => stationQuestion(unit,index,type,shuffle)).filter(Boolean);
  }

  function stationQuestion(unit,index,type,shuffle){
    const item=window.KP_PRE4_STATIONS[unit]?.[index];
    if(!item)return null;
    if(item.sentences)return contextQuestion(item,unit,index,type,shuffle);
    const shared={course,context:item.title,reviewKey:prefix+'station:'+unit+':'+index+':'+type};
    if(type==='order'){
      const useAsk=item.reply.length<3;
      const source=useAsk?item.ask:item.reply;
      const ids=source.filter(w=>w!=='，').map((w,i)=>'station/'+i+'/'+w);
      const comma=source.indexOf('，');
      return {...shared,kind:'order',prompt:'お手本の文を組み立てよう',target:useAsk?item.jaAsk:item.jaReply,
        words:source.filter(w=>w!=='，'),answerIds:ids,tileIds:shuffle(ids.slice()),punctuationAfter:comma<0?[]:[comma],
        text:source.join('')+(item.endings?.[useAsk?0:1]||''),explain:source.join('')+'　'+item.tip};
    }
    let prompt,target='',audioText='',answers,explain;
    if(type==='sound'){
      const [word,...options]=item.sound;
      const lines = [item.ask.join(''), item.reply.join(''), item.transfer[0]];
      audioText = lines.find(line => line.includes(word));
      answers = options;
      prompt = '文を聞いて、「' + word + '」のピンインを選ぼう';
      explain = audioText + '　' + word + ' は ' + answers[0] + '。母音・子音と声調記号を確かめよう。';
    }else if(type==='listen'){
      [audioText,...answers]=item.transfer;prompt='新しい文を聞いて意味を選ぼう';
      explain=audioText+'　'+answers[0];
    }else if(type==='gap'){
      answers=item.options;prompt='日本語に合うことばを選ぼう';
      const useAsk=item.gapLine===0;
      const source=useAsk?item.ask:item.reply;
      const ending=item.endings?.[useAsk?0:1]||(useAsk?'？':'');
      const blank=source.indexOf(answers[0]);
      target=(useAsk?item.jaAsk:item.jaReply)+'　'+source.map((token,i)=>i===blank?'＿＿':token).join('')+ending;
      explain=source.join('')+ending+'　'+item.tip;
    }else return null;
    return {...shared,kind:'choice',prompt,target,audioText,answerId:answers[0],
      choices:stableChoices(answers[0],answers.slice(1),shuffle),explain};
  }

  function restore(key, entries, shuffle) {
    if (!key.startsWith(prefix)) return null;
    const [mode, id] = key.slice(prefix.length).split(':');
    if (mode === 'station') {
      const [,unit,index,type]=key.slice(prefix.length).split(':');
      return stationQuestion(unit,Number(index),type,shuffle);
    }
    if (mode === 'mock') return window.KP_PRE4_MOCK.restore(key, shuffle);
    if (mode === 'exercise') {
      const question = extras.find(item => item.reviewKey === key);
      return question ? {...question, choices:shuffle(question.choices)} : null;
    }
    const entry = entries.find(item => item.entry_id === id);
    return entry ? wordQuestion(entry, entries, mode, shuffle) : null;
  }

  function build(data, unitId, lesson, mode, shuffle) {
    const entries = data.vocabulary_entries;
    if (mode === 'station') return stationQuestions(unitId, lesson, shuffle);
    if (unitId === 'mock') return window.KP_PRE4_MOCK.build(mode, lesson, shuffle);
    if (unitId === 'exam') {
      const dictation = () => shuffle(entries.filter(entry => /^\p{Script=Han}{2}$/u.test(entry.simplified)))
        .slice(0, 3).map(entry => wordQuestion(entry, entries, 'dictation', shuffle));
      if (mode === 'dictation') return dictation();
      if (mode === 'listening' || mode === 'written') {
        return extras.filter(q => Boolean(q.audioText) === (mode === 'listening'))
          .map(q => restore(q.reviewKey, entries, shuffle));
      }
      if (mode === 'mixed') {
        return shuffle([
          ...shuffle(extras.filter(q => q.audioText)).slice(0, 3),
          ...shuffle(extras.filter(q => !q.audioText)).slice(0, 3),
          ...dictation().slice(0, 1),
          ...shuffle(entries).slice(0, 3).map((entry, i) =>
            wordQuestion(entry, entries, ['meaning','reading','listening'][i], shuffle))
        ]).map(q => ({...q, choices:q.choices&&shuffle(q.choices)}));
      }
      return [];
    }
    return [];
  }

  let extendedData;
  async function extend(data) {
    if (!extendedData) {
      const response = await fetch('./data/pre4-vocabulary.json?v=301.408');
      if (!response.ok) throw Error('準4級の追加教材が読み込めませんでした。');
      extendedData = await response.json();
    }
    return {
      ...data,
      units:[...data.units,...extendedData.units,...window.KP_PRE4_GRAMMAR_UNITS],
      vocabulary_entries:[...data.vocabulary_entries,...extendedData.vocabulary_entries]
    };
  }

  window.KP_PRE4 = {prefix, course, build, restore, extend};
})();
