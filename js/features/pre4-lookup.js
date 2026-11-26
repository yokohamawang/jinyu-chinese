(() => {
  'use strict';
  const examples = [
    ['你好！请进，请坐。','こんにちは。どうぞお入りください。お掛けください。'],
    ['我哥哥是医生。','兄は医師です。'],
    ['我们星期五下午三点见。','金曜日の午後3時に会いましょう。'],
    ['我坐地铁去学校。','地下鉄で学校に行きます。'],
    ['请给我一杯茶。','お茶を一杯ください。'],
    ['我每天学习汉语。','私は毎日中国語を勉強します。'],
    ['我的手机在桌子上。','携帯電話は机の上にあります。'],
    ['我每天六点起床。','私は毎日6時に起きます。'],
    ['今天很冷，外面下雪了。','今日は寒く、外では雪が降っています。'],
    ['我们都喜欢喝茶。','私たちはみんなお茶を飲むのが好きです。'],
    ['你有几本书？','本を何冊持っていますか。'],
    ['外婆和孩子们住在一起。','母方の祖母と子どもたちは一緒に住んでいます。'],
    ['我们后天上午在公园见。','あさっての午前、公園で会いましょう。'],
    ['银行在邮局旁边。','銀行は郵便局の隣にあります。'],
    ['我早上喝牛奶，吃面包。','朝は牛乳を飲み、パンを食べます。'],
    ['椅子旁边有一把雨伞。','いすのそばに傘が一本あります。'],
    ['这双黑色的鞋多少钱？','この黒い靴はいくらですか。'],
    ['她下班以后回家做饭。','彼女は仕事が終わったあと、帰宅して料理をします。'],
    ['考试以前，我在图书馆复习。','試験前に図書館で復習します。'],
    ['我们坐出租车去机场。','タクシーで空港へ行きます。'],
    ['外面下雨了，我带了一把伞。','外で雨が降り始めたので、傘を一本持ってきました。'],
    ['这家店的面条很好吃。','この店の麺はとてもおいしいです。'],
    ['我已经吃过了，你呢？','私はもう食べました。あなたは？'],
    ['不好意思，请再说一遍。','すみません。もう一度言ってください。'],
    ['他们星期六去公园打篮球。','彼らは土曜日に公園でバスケットボールをします。'],
    ['我想借一本词典，请你帮我找一下。','辞書を一冊借りたいので、探すのを手伝ってください。'],
    ['我买了两斤苹果，一共二十块。','リンゴを1キロ買いました。全部で20元です。'],
    ['你的药在钱包旁边。','あなたの薬は財布のそばにあります。'],
    ['从这里走到地铁站要多久？','ここから地下鉄の駅まで歩くとどのくらいかかりますか。'],
    ['这家餐厅的菜不太辣。','このレストランの料理はあまり辛くありません。']
  ];
  const basics = {
    请:['qǐng','どうぞ・～してください'],给:['gěi','与える・～に'],我:['wǒ','私'],你:['nǐ','あなた'],您:['nín','あなた（丁寧）'],
    他:['tā','彼'],她:['tā','彼女'],们:['men','複数を表す接尾辞'],和:['hé','～と'],的:['de','後ろの名詞を修飾する助詞'],
    了:['le','出来事の完了や状況の変化を表す助詞'],过:['guo','ここでは「～したことがある」を表す助詞'],
    呢:['ne','既出の話題について「～は？」と尋ねる助詞'],吗:['ma','はい・いいえで答える疑問を作る助詞'],
    有:['yǒu','ある・いる・持っている'],在:['zài','～にいる・～で'],去:['qù','行く'],来:['lái','来る'],
    上:['shàng','上'],下雪:['xiàxuě','雪が降る'],下雨:['xiàyǔ','雨が降る'],把:['bǎ','傘など、柄のあるものを数える量詞'],
    本:['běn','本を数える量詞'],双:['shuāng','靴など、対になったものを数える量詞'],杯:['bēi','杯・コップで数える量詞'],
    点:['diǎn','～時・点'],块:['kuài','元（話しことば）'],一家:['yìjiā','一軒・一社'],这家:['zhè jiā','この店・この会社'],
    多久:['duōjiǔ','どのくらいの時間'],这里:['zhèlǐ','ここ'],多少:['duōshao','いくら・どれくらい'],
    还是:['háishi','それとも'],一点儿:['yìdiǎnr','少し'],抱歉:['bàoqiàn','申し訳ない'],
    一遍:['yí biàn','一回（はじめから終わりまで）'],一下:['yíxià','少しの間・ちょっと'],不太:['bú tài','あまり～ない'],
    听懂:['tīngdǒng','聞いて理解する'],见:['jiàn','会う・見える'],辣:['là','辛い'],餐厅:['cāntīng','レストラン・食堂'],
    哥哥:['gēge','兄'],三:['sān','3'],六:['liù','6'],一:['yī','1'],两:['liǎng','2・二つ'],
    每天:['měitiān','毎日'],喝:['hē','飲む'],吃:['chī','食べる'],几:['jǐ','いくつ・いくつか'],
    书:['shū','本'],住:['zhù','住む'],伞:['sǎn','傘'],店:['diàn','店'],想:['xiǎng','～したい'],
    打:['dǎ','する（球技など）・打つ'],走:['zǒu','歩く・行く'],到:['dào','着く・～まで'],
    菜:['cài','料理・野菜'],他们:['tāmen','彼ら'],
    都不:['dōu bù','全員が～しない'],不都:['bù dōu','全員が～するわけではない'],
    是不是:['shì bu shì','～ですか（はい・いいえで尋ねる）'],票:['piào','券・チケット'],那:['nà','その・あの'],没:['méi','～しなかった・～していない'],
    写字:['xiězì','字を書く'],喝茶:['hēchá','お茶を飲む'],
    考试:['kǎoshì','試験'],带:['dài','持っていく・連れていく'],找:['zhǎo','探す'],帮:['bāng','手伝う']
  };
  const exampleByUnit = new Map(examples.map((example,index) => {
    const base = index < 11;
    return [(base?'pre4-u':'pre4-extra-')+String(base?index+1:index-10).padStart(2,'0'),example];
  }));
  const escape = value => String(value).replace(/[&<>"']/g, c =>
    ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));

  function words(entries) {
    const map = new Map(Object.entries(basics));
    for (const entry of entries || []) {
      const {simplified,pinyin,ja_meaning} = entry;
      if (/^\p{Script=Han}{1,5}$/u.test(simplified) && pinyin && ja_meaning && !map.has(simplified)) {
        map.set(simplified,[pinyin,ja_meaning]);
      }
    }
    for(const [w,gloss] of Object.entries(window.KP_PRE4_GLOSSES||{}))map.set(w,gloss);
    return map;
  }

  function example(unit) {
    const entry = exampleByUnit.get(unit.unit_id);
    if (!entry) return '';
    return `<aside class="pre4-example"><h2>例文</h2><p class="pre4-lookup-sentence" lang="zh-Hans">${window.KP_PRE4_PINYIN.html(entry[0])}</p>
      <p class="jp">${escape(entry[1])}</p></aside>`;
  }

  function review(question) {
    const chinese = value => value && /\p{Script=Han}/u.test(value) && !/[ぁ-ゟ゠-ヿ]/u.test(value);
    const rawTarget = question.target;
    const target = rawTarget?.includes('　') ? rawTarget.slice(rawTarget.lastIndexOf('　')+1) : rawTarget;
    const answer = question.answerId;
    const completed = typeof answer === 'string' && target?.includes('＿＿') && chinese(answer)
      ? target.replace('＿＿',answer) : target;
    const japaneseAnswer = question.group==='number' || question.reviewKey?.startsWith('pre4-prep:meaning:') || question.reviewKey?.endsWith(':listen');
    const lines = [...new Set([question.kind==="order"?question.text:null,question.audioText,completed,japaneseAnswer?null:answer].filter(chinese))]
      .filter(line => !line.includes('＿＿') && !line.includes(' · '));
    if (!lines.length) return '';
    return `<div class="pre4-review-sentences" aria-label="ことばの意味を調べる">${lines.map(line =>
      `<p class="pre4-lookup-sentence" lang="zh-Hans">${window.KP_PRE4_PINYIN.html(line)}</p>`).join('')}</div>`;
  }

  function splitUnmatched(term, local) {
    if (local.has(term)) return null;
    const parts = Array.from(term);
    return parts.every(part => local.has(part)) ? parts : null;
  }

  function mount(root, getLocal) {
    window.KP_READING_LOOKUP.mount(root,'.pre4-lookup-sentence',{
      getLocal, splitUnmatched,
      beforeLookup:()=>window.speechSynthesis?.cancel()
    });
  }
  window.KP_PRE4_LOOKUP = {words,example,review,mount};
})();
