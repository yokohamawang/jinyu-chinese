/* In-place lookup for Explore and Story. Existing ruby and playback spans are retained. */
(() => {
  'use strict';
  const script = document.currentScript.src;
  const han = /\p{Script=Han}/u;
  const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('zh', { granularity: 'word' }) : null;
  let dictionaryPromise, typedVocabulary;
  const characterGloss = {
    汉字:['Hàn zì','漢字'],仓颉:['Cāng jié','倉頡（伝説上の漢字の発明者）'],
    脚印:['jiǎo yìn','足あと'],甲骨:['jiǎ gǔ','亀の甲羅や獣の骨'],竹简:['zhú jiǎn','竹簡（文字を記した竹の札）'],
    活字印刷:['huó zì yìn shuā','活字印刷'],毕昇:['Bì Shēng','畢昇（北宋の職人）'],工匠:['gōng jiàng','職人'],
    粘土:['nián tǔ','粘土'],印刷:['yìn shuā','印刷する'],诸葛亮:['Zhū gě Liàng','諸葛亮'],
    刘备:['Liú Bèi','劉備'],关羽:['Guān Yǔ','関羽'],张飞:['Zhāng Fēi','張飛'],桃园:['Táo yuán','桃園'],
    兄弟:['xiōng dì','兄弟'],办法:['bàn fǎ','やり方・方法'],困难:['kùn nan','困難']
  };
  // Reading-specific names need stable boundaries across browsers.
  const properNames = {
    河南:['Hé nán','河南省'],登封:['Dēng fēng','登封。中国・河南省にある都市'],
    嵩山:['Sōng shān','嵩山。河南省にある五岳の中岳'],少林寺:['Shào lín sì','少林寺'],
    少室山:['Shào shì shān','少室山。嵩山を構成する山の一つ'],千佛殿:['Qiān fó diàn','千仏殿'],
    李世民:['Lǐ Shì mín','李世民。唐の第2代皇帝（太宗）'],唐王:['Táng wáng','唐の王。この物語では李世民'],
    中岳:['Zhōng yuè','中岳。五岳のうちの嵩山'],杜甫:['Dù Fǔ','杜甫。唐の詩人'],
    泰山:['Tài shān','泰山'],华山:['Huà shān','華山'],衡山:['Héng shān','衡山'],恒山:['Héng shān','恒山'],
    白娘子:['Bái niáng zǐ','白娘子。白蛇の化身'],许仙:['Xǔ Xiān','許仙。白蛇伝に登場する青年'],
    法海:['Fǎ Hǎi','法海。白蛇伝に登場する僧侶'],白蛇传:['Bái shé zhuàn','白蛇伝'],
    西湖:['Xī hú','西湖。杭州にある湖'],杭州:['Háng zhōu','杭州'],雷峰塔:['Léi fēng tǎ','雷峰塔'],
    灵隐寺:['Líng yǐn sì','霊隠寺'],飞来峰:['Fēi lái fēng','飛来峰'],金山寺:['Jīn shān sì','金山寺'],镇江:['Zhèn jiāng','鎮江'],
    故宫:['Gù gōng','故宮'],午门:['Wǔ mén','午門。故宮の正門'],御花园:['Yù huā yuán','御花園'],
    慕田峪:['Mù tián yù','慕田峪。北京郊外の万里の長城の一地区'],万里长城:['Wàn lǐ Cháng chéng','万里の長城'],
    武当山:['Wǔ dāng shān','武当山'],张三丰:['Zhāng Sān fēng','張三豊。武当武術と結びつけて語られる人物'],
    长江:['Cháng jiāng','長江'],黄河:['Huáng hé','黄河'],漓江:['Lí jiāng','漓江'],桂林:['Guì lín','桂林'],
    黄山:['Huáng shān','黄山'],青岛:['Qīng dǎo','青島'],丽江:['Lì jiāng','麗江'],北宋:['Běi Sòng','北宋'],
    魏:['Wèi','魏。三国の一つ'],蜀:['Shǔ','蜀。三国の一つ'],吴:['Wú','呉。三国の一つ']
  };
  const readingVocabulary = {
    文字:['wén zì','文字'],观察:['guān chá','観察する'],鸟兽:['niǎo shòu','鳥やけもの'],
    山川:['shān chuān','山や川'],形状:['xíng zhuàng','形'],试着:['shì zhe','試しに～してみる'],
    样子:['yàng zi','様子・形'],画下来:['huà xià lái','描き留める'],图形:['tú xíng','図形'],
    慢慢:['màn màn','ゆっくり・少しずつ'],变成:['biàn chéng','～に変わる'],早期:['zǎo qī','初期'],
    人们:['rén men','人々'],种子:['zhǒng zi','種'],长大:['zhǎng dà','成長する'],
    走进:['zǒu jìn','歩いて入る'],时期:['shí qī','時期・時代'],发明:['fā míng','発明する'],
    活字:['huó zì','活字'],刻在:['kè zài','～に刻む'],泥块:['ní kuài','土のかたまり'],字块:['zì kuài','一文字ずつの活字のブロック'],
    涂:['tú','塗る'],墨:['mò','墨'],盖:['gài','覆う'],烧硬:['shāo yìng','焼いて固める'],
    排列:['pái liè','並べる'],拆下来:['chāi xià lái','取り外す'],重新:['chóng xīn','改めて・もう一度'],
    排队:['pái duì','列に並ぶ'],士兵:['shì bīng','兵士'],技术:['jì shù','技術'],自动:['zì dòng','自動の'],
    出现:['chū xiàn','現れる'],国家:['guó jiā','国'],相识:['xiāng shí','知り合う'],结为:['jié wéi','結びついて～になる'],
    帮助:['bāng zhù','助ける'],制定:['zhì dìng','立てる・定める'],计划:['jì huà','計画'],
    常常:['cháng cháng','よく・しばしば'],解决:['jiě jué','解決する'],时而:['shí ér','時には'],
    合作:['hé zuò','協力する'],交战:['jiāo zhàn','戦う'],留下:['liú xià','残す'],许多:['xǔ duō','多くの'],
    书本:['shū běn','本・書物'],戏台:['xì tái','芝居の舞台'],动画:['dòng huà','アニメーション'],
    继续:['jì xù','続ける'],冒险:['mào xiǎn','冒険する'],位于:['wèi yú','～に位置する'],
    一带:['yí dài','一帯・その付近'],殿堂:['diàn táng','堂宇・大きな堂'],古塔:['gǔ tǎ','古い塔'],
    世界遗产:['shì jiè yí chǎn','世界遺産'],练拳:['liàn quán','拳法の稽古をする'],
    联系起来:['lián xì qǐ lái','結びつける'],记载:['jì zǎi','記録する'],协助:['xié zhù','手助けする'],
    广为流传:['guǎng wéi liú chuán','広く語り継がれる'],遇见:['yù jiàn','出会う'],
    下起:['xià qǐ','降り始める'],交谈:['jiāo tán','話し合う'],相遇:['xiāng yù','出会う'],
    分离:['fēn lí','離れる・別れる'],造像:['zào xiàng','仏像などを作ること。また、その像']
  };
  function loadJapaneseVocabulary() {
    if (!typedVocabulary) {
      typedVocabulary = fetch(new URL('../data/pre4-content-package-0.1.json', script))
        .then(response => { if (!response.ok) throw new Error('vocabulary_unavailable');return response.json(); })
        .then(data => new Map(data.vocabulary_entries.filter(entry => entry.ja_meaning && entry.pinyin)
          .map(entry => [entry.simplified, [entry.pinyin, entry.ja_meaning]])))
        .catch(() => { typedVocabulary = null;return new Map(); });
    }
    return typedVocabulary;
  }
  function loadDictionary() {
    if (!dictionaryPromise) {
      dictionaryPromise = (async () => {
        const response = await fetch(new URL('../data/cc-cedict-2026-11-03.json.gz', script));
        if (!response.ok || !response.body) throw new Error('dictionary_unavailable');
        const bytes = await response.arrayBuffer();
        const compressed = new Uint8Array(bytes, 0, Math.min(bytes.byteLength, 2));
        const body = compressed[0] === 31 && compressed[1] === 139
          ? new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')) : bytes;
        const rows = await new Response(body).json();
        const words = new Map();
        for (const row of rows) {
          for (const form of new Set(row.slice(0, 2))) {
            if (!words.has(form)) words.set(form, []);
            words.get(form).push(row);
          }
        }
        return words;
      })().catch(error => { dictionaryPromise = null; throw error; });
    }
    return dictionaryPromise;
  }
  function pinyin(text) {
    const marked = {a:'āáǎà',e:'ēéěè',i:'īíǐì',o:'ōóǒò',u:'ūúǔù','ü':'ǖǘǚǜ'};
    return text.replace(/([a-züv:]+)([0-5])/gi, (_, syllable, number) => {
      const base = syllable.toLowerCase().replace(/u:|v/g, 'ü');
      let index = base.indexOf('a');
      if (index < 0) index = base.indexOf('e');
      if (index < 0) index = base.indexOf('ou');
      if (index < 0) index = Math.max(...Object.keys(marked).map(vowel => base.lastIndexOf(vowel)));
      return index < 0 || number === '0' || number === '5' ? base
        : base.slice(0,index) + marked[base[index]][Number(number)-1] + base.slice(index+1);
    });
  }
  async function lookup(term, preferred) {
    if (preferred) return { readings: [preferred[0]], gloss: preferred[1], japanese: true };
    const curated = properNames[term] || characterGloss[term] || readingVocabulary[term];
    if (curated) return lookup(term, curated);
    const japanese = (await loadJapaneseVocabulary()).get(term);
    if (japanese) return lookup(term, japanese);
    const dictionary = await loadDictionary();
    const rows = dictionary.get(term);
    if (!rows?.length) return null;
    return {
      readings: Array.from(new Set(rows.map(row => pinyin(row[2])))).slice(0, 3),
      gloss: Array.from(new Set(rows.slice(0, 2).flatMap(row => row[3].split('/')).filter(Boolean))).slice(0, 6).join(' / '),
      japanese: false
    };
  }
  function segments(text, local, splitUnmatched) {
    const boundaries = new Map();
    for (let index = 0; index < text.length; index++) {
      for (let end = Math.min(text.length, index + 12); end >= index + 2; end--) {
        const candidate = text.slice(index, end);
        if (!/^\p{Script=Han}+$/u.test(candidate)) continue;
        if (local.has(candidate) || Object.hasOwn(properNames, candidate) ||
            Object.hasOwn(characterGloss, candidate) || Object.hasOwn(readingVocabulary, candidate)) {
          boundaries.set(index, candidate);
          break;
        }
      }
    }
    const result = [];
    let start = 0;
    function appendUnmatched(end) {
      const gap = text.slice(start, end);
      let index = start;
      for (const segment of segmenter ? Array.from(segmenter.segment(gap), row => row.segment) : gap) {
        if (/^\p{Script=Han}+$/u.test(segment)) {
          const parts = splitUnmatched?.(segment,local) || [segment];
          for (const term of parts) {
            result.push({term,index});
            index += term.length;
          }
        } else {
          for (const term of segment) {
            result.push({term,index});
            index += term.length;
          }
        }
      }
    }
    for (const [index, term] of boundaries) {
      if (index < start) continue;
      appendUnmatched(index);
      result.push({term,index});
      start = index + term.length;
    }
    appendUnmatched(text.length);
    return result;
  }
  function base(node) {
    return node.querySelector('rb, .kp-story-char > b')?.textContent ||
      (node.classList.contains('kp-story-char') ? node.querySelector('b')?.textContent : node.textContent);
  }
  function decorate(element, local, splitUnmatched) {
    if (element.dataset.lookupReady) return;
    element.dataset.lookupReady = '1';
    if (!element.firstElementChild) {
      element.replaceChildren(...Array.from(element.textContent, char => {
        const span = document.createElement('span');span.textContent = char;return span;
      }));
    }
    const children = Array.from(element.children);
    const text = children.map(base).join('');
    let cursor = 0, index = 0;
    for (const {term} of segments(text, local, splitUnmatched)) {
      const nodes = [];
      const end = cursor + term.length;
      while (index < children.length && cursor < end) {
        const node = children[index++];
        nodes.push(node);
        cursor += base(node).length;
      }
      if (!nodes.length || !/^\p{Script=Han}+$/u.test(term)) continue;
      const word = document.createElement('button');
      word.type = 'button';word.className = 'kp-lookup-word';word.dataset.term = term;
      word.setAttribute('aria-label', term+'の意味');
      nodes[0].before(word);
      word.append(...nodes);
    }
  }
  let popup = null;
  function close() { popup?.close(); }
  function hostWindow() {
    try { if (window.parent.location.origin === location.origin) return window.parent; } catch (_) {}
    return window;
  }
  async function present(term, preferred, trigger, translation) {
    close();
    const host = hostWindow(), doc = host.document;
    const make = (tag, text) => { const node = doc.createElement(tag);node.textContent = text;return node; };
    const dialog = make('dialog','');
    dialog.className = 'kp-lookup-dialog';dialog.setAttribute('aria-label',term+'の辞書');
    const heading = make('h2',term), reading = make('p',''), meaning = make('p','辞書を読み込んでいます…');
    heading.lang = 'zh-Hans';
    meaning.setAttribute('role','status');
    const actions = make('div','');actions.className = 'kp-lookup-actions';
    const speaker = make('button','▶ 発音を聞く'), save = make('button','ことばを保存'), dismiss = make('button','閉じる');
    [speaker,save,dismiss].forEach(button => {button.type='button';actions.append(button);});
    let stopVoice;
    speaker.onclick = () => {
      stopVoice?.();
      try { stopVoice = window.KP_AUDIO_SESSION?.speakMandarin(term, {onError: () => { speaker.textContent='音声を再試行'; }}); }
      catch (_) { speaker.textContent='音声を再試行'; }
    };
    save.disabled = true;
    dismiss.onclick = () => dialog.close();
    const status = make('p','');status.setAttribute('role','status');
    const source = make('small','');source.className = 'kp-lookup-source';
    const context = make('p','');
    context.hidden = true;
    if (translation) context.textContent = 'この文の日本語訳：' + translation;
    dialog.append(heading,reading,meaning,context,source,actions,status);
    dialog.addEventListener('close', () => {
      stopVoice?.();dialog.remove();
      if (popup === dialog) popup=null;
      if (trigger.isConnected) trigger.focus({preventScroll:true});
    }, { once: true });
    doc.body.append(dialog);popup=dialog;dialog.showModal();
    try {
      const entry = await lookup(term, preferred);
      if (!dialog.open) return;
      if (translation && !entry?.japanese) context.hidden = false;
      if (!entry) { meaning.textContent='このことばの意味は辞書に見つかりませんでした。';return; }
      reading.textContent = entry.readings.join(' / ');
      meaning.textContent = entry.japanese ? entry.gloss : '英語の辞書：'+entry.gloss;
      source.textContent = entry.japanese ? '' : 'CC-CEDICT · CC BY-SA 4.0';
      const key = vocabularyKey(term, entry);
      if (!key) return;
      save.disabled = false;
      save.onclick = async () => {
        save.disabled = true;
        try {
          const api = host.KP_ACCOUNT_API;
          const queued = await api?.getPracticeReviewQueue?.('reading-vocabulary');
          const ok = queued?.some(item => item.item_key === key) ||
            await api?.recordPracticeAttempt(key,'reading-vocabulary',false);
          status.textContent = ok ? 'ことばの復習に保存しました。' : 'ログインするとことばを保存できます。';
          if (!ok) save.disabled=false;
        } catch (_) { status.textContent='保存できませんでした。もう一度お試しください。';save.disabled=false; }
      };
    } catch (_) { if (dialog.open) meaning.textContent='辞書を読み込めませんでした。もう一度お試しください。'; }
  }
  function vocabularyKey(term, entry) {
    // Keep the contextual Japanese gloss where it fits in the existing queue key.
    const prefix='reading-word:';
    const packed=entry.japanese ? JSON.stringify([term,entry.readings[0]||'',entry.gloss]) : term;
    return prefix+([...prefix+packed].length<=100 ? packed : term);
  }
  function mount(root, selector, options={}) {
    const getLocal = options.getLocal || (() => new Map());
    function update() {
      const local=getLocal();
      root.querySelectorAll(selector).forEach(element=>decorate(element,local,options.splitUnmatched));
    }
    const observer = new MutationObserver(update);
    observer.observe(root,{childList:true,subtree:true});
    update();
    root.addEventListener('click', event => {
      const word=event.target.closest('.kp-lookup-word');
      if (!word || !word.closest(selector)) return;
      event.stopPropagation();
      options.beforeLookup?.();
      const sentence = word.closest(selector);
      const translation = sentence.parentElement.querySelector('.kp-story-translation, .jp')?.textContent.trim();
      present(word.dataset.term,getLocal().get(word.dataset.term),word,translation);
    });
    window.addEventListener('pagehide',close);
  }
  window.KP_READING_LOOKUP={mount,lookup,segments,close};
})();
