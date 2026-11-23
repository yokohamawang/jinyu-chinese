/* In-place lookup for Explore and Story. Existing ruby and playback spans are retained. */
(() => {
  'use strict';
  const script = document.currentScript.src;
  const han = /\p{Script=Han}/u;
  const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('zh', { granularity: 'word' }) : null;
  let dictionaryPromise;
  const characterGloss = {
    汉字:['Hàn zì','漢字'],仓颉:['Cāng jié','倉頡（伝説上の漢字の発明者）'],
    脚印:['jiǎo yìn','足あと'],甲骨:['jiǎ gǔ','亀の甲羅や獣の骨'],竹简:['zhú jiǎn','竹簡（文字を記した竹の札）'],
    活字印刷:['huó zì yìn shuā','活字印刷'],毕昇:['Bì Shēng','畢昇（北宋の職人）'],工匠:['gōng jiàng','職人'],
    粘土:['nián tǔ','粘土'],印刷:['yìn shuā','印刷する'],诸葛亮:['Zhū gě Liàng','諸葛亮'],
    刘备:['Liú Bèi','劉備'],关羽:['Guān Yǔ','関羽'],张飞:['Zhāng Fēi','張飛'],桃园:['Táo yuán','桃園'],
    兄弟:['xiōng dì','兄弟'],办法:['bàn fǎ','やり方・方法'],困难:['kùn nan','困難']
  };
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
    if (characterGloss[term]) return lookup(term, characterGloss[term]);
    const dictionary = await loadDictionary();
    const rows = dictionary.get(term);
    if (!rows?.length) return null;
    return {
      readings: Array.from(new Set(rows.map(row => pinyin(row[2])))).slice(0, 3),
      gloss: Array.from(new Set(rows.slice(0, 2).flatMap(row => row[3].split('/')).filter(Boolean))).slice(0, 6).join(' / '),
      japanese: false
    };
  }
  function segments(text, local) {
    const defaults = new Map(Array.from(segmenter?.segment(text) || [], item => [item.index, item.segment]));
    const result = [];
    for (let index = 0; index < text.length;) {
      const character = String.fromCodePoint(text.codePointAt(index));
      let term = character;
      if (han.test(character)) {
        for (let end = Math.min(text.length, index + 12); end > index + character.length; end--) {
          const candidate = text.slice(index, end);
          if (local.has(candidate) || Object.hasOwn(characterGloss, candidate)) { term = candidate; break; }
        }
        if (term === character && defaults.has(index)) {
          const segment = defaults.get(index);
          if (/^\p{Script=Han}+$/u.test(segment)) term = segment;
        }
      }
      result.push({ term, index });
      index += term.length;
    }
    return result;
  }
  function base(node) {
    return node.querySelector('rb, .kp-story-char > b')?.textContent ||
      (node.classList.contains('kp-story-char') ? node.querySelector('b')?.textContent : node.textContent);
  }
  function decorate(element, local) {
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
    for (const {term} of segments(text, local)) {
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
  async function present(term, preferred, trigger, onClose) {
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
    dialog.append(heading,reading,meaning,source,actions,status);
    dialog.addEventListener('close', () => {
      stopVoice?.();dialog.remove();
      if (popup === dialog) popup=null;
      if (trigger.isConnected) trigger.focus({preventScroll:true});
      onClose?.();
    }, { once: true });
    doc.body.append(dialog);popup=dialog;dialog.showModal();
    try {
      const entry = await lookup(term, preferred);
      if (!dialog.open) return;
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
      root.querySelectorAll(selector).forEach(element=>decorate(element,local));
    }
    const observer = new MutationObserver(update);
    observer.observe(root,{childList:true,subtree:true});
    update();
    root.addEventListener('click', event => {
      const word=event.target.closest('.kp-lookup-word');
      if (!word || !word.closest(selector)) return;
      event.stopPropagation();
      options.beforeLookup?.();
      present(word.dataset.term,getLocal().get(word.dataset.term),word);
    });
    window.addEventListener('pagehide',close);
  }
  window.KP_READING_LOOKUP={mount,lookup,segments,close};
})();
